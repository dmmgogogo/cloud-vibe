#!/bin/bash
# Cloud Vibe 部署脚本
# 使用环境变量配置服务器信息

set -e  # 遇到错误立即退出

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查必要的环境变量
check_env() {
    log_info "检查环境变量..."
    
    if [ -z "$DEPLOY_HOST" ]; then
        log_error "DEPLOY_HOST 未设置"
        exit 1
    fi
    
    if [ -z "$DEPLOY_USER" ]; then
        log_error "DEPLOY_USER 未设置"
        exit 1
    fi
    
    if [ -z "$DEPLOY_PASSWORD" ] && [ -z "$DEPLOY_SSH_KEY" ]; then
        log_error "DEPLOY_PASSWORD 或 DEPLOY_SSH_KEY 必须设置一个"
        exit 1
    fi
    
    if [ -z "$DEPLOY_PATH" ]; then
        log_warning "DEPLOY_PATH 未设置，使用默认值: /var/www/cloud-vibe"
        DEPLOY_PATH="/var/www/cloud-vibe"
    fi
    
    log_success "环境变量检查通过"
}

# 安装 sshpass（如果使用密码认证）
install_sshpass() {
    if [ ! -z "$DEPLOY_PASSWORD" ]; then
        if ! command -v sshpass &> /dev/null; then
            log_info "安装 sshpass..."
            if [[ "$OSTYPE" == "darwin"* ]]; then
                # macOS
                if command -v brew &> /dev/null; then
                    brew install hudochenkov/sshpass/sshpass
                else
                    log_error "请先安装 Homebrew: https://brew.sh"
                    exit 1
                fi
            elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
                # Linux
                sudo apt-get update && sudo apt-get install -y sshpass
            else
                log_error "不支持的操作系统: $OSTYPE"
                exit 1
            fi
        fi
    fi
}

# 执行远程命令
remote_exec() {
    local cmd="$1"
    local description="$2"
    
    log_info "$description..."
    
    if [ ! -z "$DEPLOY_PASSWORD" ]; then
        # 使用密码认证
        sshpass -p "$DEPLOY_PASSWORD" ssh -o StrictHostKeyChecking=no \
            -o UserKnownHostsFile=/dev/null \
            -o ConnectTimeout=10 \
            "$DEPLOY_USER@$DEPLOY_HOST" "$cmd"
    else
        # 使用 SSH 密钥认证
        ssh -i "$DEPLOY_SSH_KEY" \
            -o StrictHostKeyChecking=no \
            -o UserKnownHostsFile=/dev/null \
            -o ConnectTimeout=10 \
            "$DEPLOY_USER@$DEPLOY_HOST" "$cmd"
    fi
    
    if [ $? -eq 0 ]; then
        log_success "$description 完成"
    else
        log_error "$description 失败"
        exit 1
    fi
}

# 执行远程命令并获取输出
remote_exec_output() {
    local cmd="$1"
    
    if [ ! -z "$DEPLOY_PASSWORD" ]; then
        sshpass -p "$DEPLOY_PASSWORD" ssh -o StrictHostKeyChecking=no \
            -o UserKnownHostsFile=/dev/null \
            -o ConnectTimeout=10 \
            "$DEPLOY_USER@$DEPLOY_HOST" "$cmd"
    else
        ssh -i "$DEPLOY_SSH_KEY" \
            -o StrictHostKeyChecking=no \
            -o UserKnownHostsFile=/dev/null \
            -o ConnectTimeout=10 \
            "$DEPLOY_USER@$DEPLOY_HOST" "$cmd"
    fi
}

# 主部署函数
deploy() {
    log_info "=========================================="
    log_info "开始部署 Cloud Vibe"
    log_info "=========================================="
    
    # 检查环境变量
    check_env
    
    # 安装 sshpass（如果需要）
    install_sshpass
    
    # 测试连接
    log_info "测试服务器连接..."
    remote_exec "echo '连接成功'" "连接测试"
    
    # 检查 Node.js 和 npm
    log_info "检查服务器环境..."
    remote_exec "node --version && npm --version" "检查 Node.js 环境"
    
    # 进入项目目录并拉取代码
    log_info "更新代码..."
    remote_exec "cd $DEPLOY_PATH && git fetch origin && git reset --hard origin/main" "拉取最新代码"
    
    # 安装依赖
    log_info "安装依赖..."
    remote_exec "cd $DEPLOY_PATH && npm ci" "安装依赖"
    
    # 构建项目
    log_info "构建项目..."
    remote_exec "cd $DEPLOY_PATH && npm run build" "构建项目"
    
    # 重启 PM2 进程
    log_info "重启应用..."
    remote_exec "cd $DEPLOY_PATH && pm2 restart cloud-vibe || pm2 start ecosystem.config.js" "重启 PM2 进程"
    
    # 检查 PM2 状态
    log_info "检查应用状态..."
    remote_exec_output "pm2 status cloud-vibe"
    
    log_success "=========================================="
    log_success "部署完成！"
    log_success "=========================================="
    
    # 显示应用信息
    if [ ! -z "$DEPLOY_DOMAIN" ]; then
        log_info "访问地址: https://$DEPLOY_DOMAIN"
    fi
}

# 显示帮助信息
show_help() {
    echo "Cloud Vibe 部署脚本"
    echo ""
    echo "用法: ./deploy.sh [选项]"
    echo ""
    echo "选项:"
    echo "  -h, --help     显示帮助信息"
    echo "  -v, --version  显示版本信息"
    echo "  --status       检查服务器状态"
    echo "  --logs         查看应用日志"
    echo ""
    echo "环境变量:"
    echo "  DEPLOY_HOST        服务器 IP 或域名（必需）"
    echo "  DEPLOY_USER        SSH 用户名（必需）"
    echo "  DEPLOY_PASSWORD    SSH 密码（密码或密钥二选一）"
    echo "  DEPLOY_SSH_KEY     SSH 私钥路径（密码或密钥二选一）"
    echo "  DEPLOY_PATH        项目部署路径（默认: /var/www/cloud-vibe）"
    echo "  DEPLOY_DOMAIN      应用域名（可选，用于显示）"
    echo ""
    echo "示例:"
    echo "  export DEPLOY_HOST=192.168.1.100"
    echo "  export DEPLOY_USER=ubuntu"
    echo "  export DEPLOY_PASSWORD=your_password"
    echo "  ./deploy.sh"
    echo ""
}

# 检查状态
check_status() {
    check_env
    log_info "检查服务器状态..."
    remote_exec_output "pm2 status"
    remote_exec_output "cd $DEPLOY_PATH && git log -1 --oneline"
}

# 查看日志
view_logs() {
    check_env
    log_info "查看应用日志..."
    remote_exec_output "pm2 logs cloud-vibe --lines 50"
}

# 主程序
main() {
    case "${1:-}" in
        -h|--help)
            show_help
            exit 0
            ;;
        --status)
            check_status
            exit 0
            ;;
        --logs)
            view_logs
            exit 0
            ;;
        "")
            deploy
            ;;
        *)
            log_error "未知选项: $1"
            show_help
            exit 1
            ;;
    esac
}

# 运行主程序
main "$@"

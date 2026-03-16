#!/bin/bash
# 从环境变量文件加载配置并执行部署
# 支持 .env.local, .env.deploy, .env (按优先级顺序)

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEPLOY_SCRIPT="$SCRIPT_DIR/deploy.sh"

# 按优先级查找环境变量文件
ENV_FILES=(
    "$SCRIPT_DIR/.env.local"
    "$SCRIPT_DIR/.env.deploy"
    "$SCRIPT_DIR/.env"
)

ENV_FILE=""
for file in "${ENV_FILES[@]}"; do
    if [ -f "$file" ]; then
        ENV_FILE="$file"
        echo "使用配置文件: $file"
        break
    fi
done

# 检查是否找到环境变量文件
if [ -z "$ENV_FILE" ]; then
    echo "错误: 未找到环境变量配置文件"
    echo ""
    echo "请创建以下文件之一并填写配置:"
    echo "  - .env.local (推荐，与 Next.js 保持一致)"
    echo "  - .env.deploy (专门用于部署)"
    echo "  - .env"
    echo ""
    echo "示例:"
    echo "  cp .env.example .env.local"
    echo "  # 然后编辑 .env.local 填写你的服务器信息"
    exit 1
fi

# 加载环境变量
set -a
source "$ENV_FILE"
set +a

# 执行部署脚本
exec "$DEPLOY_SCRIPT" "$@"

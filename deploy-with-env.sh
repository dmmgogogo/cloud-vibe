#!/bin/bash
# 从 .env 文件加载环境变量并执行部署

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="$SCRIPT_DIR/.env"
DEPLOY_SCRIPT="$SCRIPT_DIR/deploy.sh"

# 检查 .env 文件是否存在
if [ ! -f "$ENV_FILE" ]; then
    echo "错误: .env 文件不存在"
    echo "请复制 .env.example 为 .env 并填写配置:"
    echo "  cp .env.example .env"
    exit 1
fi

# 加载环境变量
set -a
source "$ENV_FILE"
set +a

# 执行部署脚本
exec "$DEPLOY_SCRIPT" "$@"

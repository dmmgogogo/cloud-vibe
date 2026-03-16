# 部署命令参考

## 如何呼叫我执行部署

配置好 `.env.local` 文件后，你可以通过以下方式呼叫我执行部署：

### 直接命令
- "帮我部署项目"
- "部署到服务器"
- "执行部署"
- "运行部署脚本"
- "deploy"

### 其他相关命令
- "检查部署状态" - 查看服务器状态
- "查看部署日志" - 查看应用日志

## 配置文件位置

部署配置存储在 `.env.local` 文件中（不会被提交到 Git）：

```bash
DEPLOY_HOST=108.61.161.207
DEPLOY_USER=root
DEPLOY_PASSWORD=t-Y2Tbi-bwK4PeTz
DEPLOY_PATH=/var/www/cloud-vibe
DEPLOY_DOMAIN=vibe.iamxmm.xyz
```

## 部署流程

当我执行部署时，会执行以下步骤：

1. ✅ 检查环境变量
2. ✅ 测试服务器连接
3. ✅ 检查 Node.js 环境
4. ✅ 检查/初始化 Git 仓库
5. ✅ 拉取最新代码
6. ✅ 安装依赖
7. ✅ 构建项目
8. ✅ 重启 PM2 进程

## 注意事项

- 配置文件 `.env.local` 只存在于临时环境，不会提交到 GitHub
- 每次部署都会从 GitHub 拉取最新代码
- 如果构建失败，需要检查项目结构（确保有 `app` 或 `pages` 目录）

# 部署脚本使用说明

## 快速开始

### 1. 配置环境变量

复制示例文件并填写配置（推荐使用 `.env.local`）：

```bash
cp .env.example .env.local
```

编辑 `.env.local` 文件，填写你的服务器信息：

**注意**: 脚本会按以下优先级查找配置文件：
1. `.env.local` (推荐，与 Next.js 保持一致)
2. `.env.deploy` (专门用于部署)
3. `.env` (通用配置)

```bash
DEPLOY_HOST=192.168.1.100
DEPLOY_USER=ubuntu
DEPLOY_PASSWORD=your_password
DEPLOY_PATH=/var/www/cloud-vibe
DEPLOY_DOMAIN=vibe.iamxmm.xyz
```

### 2. 给脚本添加执行权限

```bash
chmod +x deploy.sh deploy-with-env.sh
```

### 3. 执行部署

**方式 1: 使用环境变量文件（推荐）**

脚本会自动查找 `.env.local`、`.env.deploy` 或 `.env` 文件：

```bash
./deploy-with-env.sh
```

**方式 2: 手动设置环境变量**

```bash
export DEPLOY_HOST=192.168.1.100
export DEPLOY_USER=ubuntu
export DEPLOY_PASSWORD=your_password
./deploy.sh
```

## 使用 Skill 部署

配置好 `.env` 文件后，你可以直接对我说：

- "帮我部署项目"
- "部署到服务器"
- "执行部署脚本"

我会自动运行 `./deploy-with-env.sh` 来部署。

## 脚本功能

### 基本部署

```bash
./deploy-with-env.sh
```

执行完整的部署流程：
1. 检查环境变量
2. 测试服务器连接
3. 拉取最新代码
4. 安装依赖
5. 构建项目
6. 重启 PM2 进程

### 检查状态

```bash
./deploy-with-env.sh --status
```

查看服务器上的应用状态和最新提交。

### 查看日志

```bash
./deploy-with-env.sh --logs
```

查看 PM2 应用日志（最近 50 行）。

### 帮助信息

```bash
./deploy-with-env.sh --help
```

显示使用说明。

## 环境变量说明

| 变量名 | 必需 | 说明 | 示例 |
|--------|------|------|------|
| `DEPLOY_HOST` | ✅ | 服务器 IP 或域名 | `192.168.1.100` |
| `DEPLOY_USER` | ✅ | SSH 用户名 | `ubuntu` |
| `DEPLOY_PASSWORD` | ⚠️ | SSH 密码（与密钥二选一） | `your_password` |
| `DEPLOY_SSH_KEY` | ⚠️ | SSH 私钥路径（与密码二选一） | `~/.ssh/id_rsa` |
| `DEPLOY_PATH` | ❌ | 项目部署路径 | `/var/www/cloud-vibe` |
| `DEPLOY_DOMAIN` | ❌ | 应用域名（仅用于显示） | `vibe.iamxmm.xyz` |

## 认证方式

### 方式 1: 密码认证

```bash
DEPLOY_PASSWORD=your_password
```

**注意**: 需要安装 `sshpass` 工具
- macOS: `brew install hudochenkov/sshpass/sshpass`
- Linux: `sudo apt-get install sshpass`

### 方式 2: SSH 密钥认证（推荐，更安全）

```bash
DEPLOY_SSH_KEY=~/.ssh/id_rsa
```

## 安全建议

1. ✅ **不要提交 .env 文件到 Git**（已在 .gitignore 中）
2. ✅ **使用 SSH 密钥而不是密码**（更安全）
3. ✅ **限制 SSH 密钥权限**（只读访问）
4. ✅ **定期轮换密码/密钥**

## 故障排查

### 连接失败

- 检查 `DEPLOY_HOST` 和 `DEPLOY_USER` 是否正确
- 确认服务器 SSH 服务正在运行
- 检查防火墙设置

### 权限错误

- 确认 `DEPLOY_USER` 有权限访问 `DEPLOY_PATH`
- 确认用户有执行 `npm` 和 `pm2` 的权限

### 构建失败

- 检查服务器上的 Node.js 版本（需要 Node.js 20+）
- 查看服务器上的错误日志

### PM2 未找到

- 在服务器上安装 PM2: `npm install -g pm2`
- 或修改脚本使用其他进程管理器

## 示例输出

```
[INFO] ==========================================
[INFO] 开始部署 Cloud Vibe
[INFO] ==========================================
[INFO] 检查环境变量...
[SUCCESS] 环境变量检查通过
[INFO] 测试服务器连接...
[SUCCESS] 连接测试 完成
[INFO] 更新代码...
[SUCCESS] 拉取最新代码 完成
[INFO] 安装依赖...
[SUCCESS] 安装依赖 完成
[INFO] 构建项目...
[SUCCESS] 构建项目 完成
[INFO] 重启应用...
[SUCCESS] 重启 PM2 进程 完成
[SUCCESS] ==========================================
[SUCCESS] 部署完成！
[SUCCESS] ==========================================
```

## 通过 Skill 使用

配置好 `.env` 后，你可以直接对我说：

- "部署项目"
- "帮我部署"
- "执行部署"
- "部署到生产环境"

我会自动运行部署脚本。

# 部署安全指南 / Deployment Security Guide

## 安全性对比

### 1. 手动部署 (Manual Deployment)
**安全等级**: ⭐⭐⭐⭐ (高)

**优点**:
- 完全控制部署过程
- 不需要在 GitHub 存储任何密钥
- 可以实时查看部署日志
- 适合敏感项目

**缺点**:
- 需要手动操作
- 容易忘记部署
- 需要服务器 SSH 访问权限

**适用场景**: 
- 生产环境关键应用
- 对安全性要求极高的项目
- 部署频率不高的项目

---

### 2. GitHub Actions 自动部署 (Automated Deployment)
**安全等级**: ⭐⭐⭐ (中高，正确配置后)

**优点**:
- 自动化，减少人为错误
- 每次推送自动部署
- 部署历史可追溯

**缺点**:
- 需要在 GitHub Secrets 中存储密钥
- 如果密钥泄露，风险较大
- 需要正确配置权限

**安全最佳实践**:

#### ✅ 推荐配置（最安全）

1. **使用 Deploy Key（部署密钥）**
   ```bash
   # 在服务器上生成专门的部署密钥
   ssh-keygen -t ed25519 -C "deploy-key" -f ~/.ssh/deploy_key
   
   # 只添加仓库的只读权限
   cat ~/.ssh/deploy_key.pub >> ~/.ssh/authorized_keys
   ```

2. **限制 SSH 密钥权限**
   - 创建专门的部署用户（非 root）
   - 使用 `authorized_keys` 限制命令执行
   - 设置密钥为只读权限

3. **使用 GitHub Secrets**
   - 将私钥存储在 GitHub Secrets 中
   - 不要使用个人 SSH 密钥
   - 定期轮换密钥

4. **限制服务器访问**
   ```bash
   # 在服务器上创建受限的 authorized_keys
   command="cd /var/www/cloud-vibe && git pull",no-port-forwarding,no-X11-forwarding,no-agent-forwarding ssh-ed25519 AAAAC3...
   ```

#### ❌ 不推荐的做法

- 使用 root 用户部署
- 使用个人 SSH 密钥
- 密钥权限过大
- 在代码中硬编码密钥

---

### 3. 使用 CI/CD 平台（Vercel/Netlify）
**安全等级**: ⭐⭐⭐⭐⭐ (最高)

**优点**:
- 平台负责安全
- 自动 HTTPS
- 无需管理服务器
- 内置安全最佳实践

**缺点**:
- 需要将代码连接到平台
- 可能有平台锁定
- 自定义部署流程受限

---

## 推荐方案

### 对于你的项目（cloud-vibe）

**推荐**: **手动部署** 或 **GitHub Actions + Deploy Key**

#### 方案 A: 手动部署（最安全，适合当前）

```bash
# 在服务器上设置别名，简化部署
alias deploy-vibe='cd /var/www/cloud-vibe && git pull && npm ci && npm run build && pm2 restart cloud-vibe'

# 使用时只需
deploy-vibe
```

#### 方案 B: GitHub Actions + Deploy Key（自动化且安全）

1. **在服务器上生成部署密钥**:
   ```bash
   ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_deploy_key
   ```

2. **配置 authorized_keys 限制权限**:
   ```bash
   # 编辑 ~/.ssh/authorized_keys
   command="cd /var/www/cloud-vibe && git pull && npm ci && npm run build && pm2 restart cloud-vibe",no-port-forwarding,no-X11-forwarding,no-agent-forwarding,no-pty ssh-ed25519 [公钥内容]
   ```

3. **在 GitHub 添加 Secrets**:
   - `SSH_HOST`: 服务器地址
   - `SSH_USER`: 部署用户名（非 root）
   - `DEPLOY_SSH_KEY`: 部署私钥内容

4. **使用工作流文件**: `.github/workflows/deploy-secure.yml`

---

## 安全检查清单

- [ ] 使用非 root 用户部署
- [ ] 使用专门的部署密钥（不是个人密钥）
- [ ] 限制 SSH 密钥的命令执行权限
- [ ] 密钥存储在 GitHub Secrets（不在代码中）
- [ ] 定期轮换密钥（建议每 3-6 个月）
- [ ] 启用服务器防火墙
- [ ] 使用 SSH 密钥认证（禁用密码登录）
- [ ] 限制 SSH 访问 IP（如果可能）
- [ ] 启用 PM2 日志监控
- [ ] 定期备份代码和数据库

---

## 快速开始（手动部署）

```bash
# 1. 在服务器上创建部署脚本
cat > /var/www/cloud-vibe/deploy.sh << 'EOF'
#!/bin/bash
set -e
cd /var/www/cloud-vibe
git pull origin main
npm ci
npm run build
pm2 restart cloud-vibe
EOF

chmod +x /var/www/cloud-vibe/deploy.sh

# 2. 设置别名
echo 'alias deploy-vibe="/var/www/cloud-vibe/deploy.sh"' >> ~/.bashrc
source ~/.bashrc

# 3. 使用
deploy-vibe
```

---

## 总结

**最安全**: 手动部署（完全控制，无密钥泄露风险）
**平衡**: GitHub Actions + Deploy Key（自动化 + 相对安全）
**最简单**: CI/CD 平台（Vercel/Netlify，但需要迁移）

**建议**: 对于你的项目，如果部署频率不高，使用**手动部署**最安全。如果需要频繁部署，配置 **GitHub Actions + Deploy Key**。

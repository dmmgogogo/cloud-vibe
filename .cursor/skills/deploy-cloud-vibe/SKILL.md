---
name: deploy-cloud-vibe
description: Deploy the cloud-vibe project to production server vibe.iamxmm.xyz. Use when the user says "部署", "deploy", "部署到服务器", "上线", "发布到服务器", or asks to push changes live to the cloud-vibe project.
---

# Deploy cloud-vibe to Production

## Project Info
- **Repo**: `/Users/mmx/Documents/work/Github/cloud-vibe`
- **Server**: read from `.env.local` — never hardcode credentials
- **Live URL**: https://vibe.iamxmm.xyz
- **PM2 app name**: `cloud-vibe`
- **Deploy path**: `/var/www/cloud-vibe`

## Credentials (from .env.local — never commit)

Read credentials from the project's `.env.local` before deploying:

```
/Users/mmx/Documents/work/Github/cloud-vibe/.env.local
```

Required vars: `DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_PASSWORD`, `DEPLOY_PATH`, `DEPLOY_DOMAIN`

## ⚠️ 已知根因 & 防坑规则

### 根因：`client reference manifest does not exist` 崩溃

**场景还原**：服务器上 `.next/` 是旧构建产物，但 git pull 拉下了新代码（新的 Server Component chunk ID），两者不匹配，Next.js 找不到对应的 client manifest，导致所有页面 500。

**为什么会发生**：
- `.next/` 在 `.gitignore` 中，不随代码一起提交
- 服务器 `.next/` 不会自动更新，必须每次部署都在服务器上重新 `npm run build`
- 如果只做了 `git pull` 没有 `npm run build`，就会出现代码与构建产物版本错位

**防复发规则**：
> **每次 `git pull` 之后必须紧跟 `npm run build && pm2 restart`，三步缺一不可。**
> 绝对不允许只 `git pull` 不重新构建就重启服务。

---

## Standard Deploy Flow

### 1. Local build check
```bash
cd /Users/mmx/Documents/work/Github/cloud-vibe
npm run build
```

### 2. Commit & push (if there are uncommitted changes)
```bash
git add -f src/app/ src/components/ src/lib/ src/hooks/ src/middleware.ts package.json
git commit -m "..."
git push
```
> Note: `src/app/` and `.next/` are in `.gitignore` — always use `git add -f` for files under `src/app/`.

### 3. Sync .env.local to server (首次部署或 .env 变更时必须执行)
```bash
sshpass -p "$DEPLOY_PASSWORD" scp -o StrictHostKeyChecking=no \
  /Users/mmx/Documents/work/Github/cloud-vibe/.env.local \
  $DEPLOY_USER@$DEPLOY_HOST:$DEPLOY_PATH/.env.local
```
> ⚠️ `.env.local` 在 `.gitignore` 中，git pull 不会同步，必须手动上传。
> 服务器上 `.env.local` 丢失会导致 Supabase 初始化失败，所有请求 500 崩溃。

### 4. Deploy to server (必须包含 build 步骤)
```bash
sshpass -p "$DEPLOY_PASSWORD" ssh -o StrictHostKeyChecking=no $DEPLOY_USER@$DEPLOY_HOST \
  "cd $DEPLOY_PATH && git pull && npm install && npm run build && pm2 restart cloud-vibe && echo DEPLOY_OK"
```
> ⚠️ `git pull` 和 `npm run build` 必须在同一条命令里串联执行，不可分开。

### 4. Verify
```bash
curl -s --connect-timeout 5 https://vibe.iamxmm.xyz/ -o /dev/null -w "%{http_code}"
# Expected: 200
```

## Troubleshooting

**`.env.local` 丢失 → Supabase 初始化失败 → 所有请求 500**
```bash
# 重新上传 .env.local，然后重新构建
sshpass -p "$DEPLOY_PASSWORD" scp -o StrictHostKeyChecking=no \
  /Users/mmx/Documents/work/Github/cloud-vibe/.env.local \
  $DEPLOY_USER@$DEPLOY_HOST:$DEPLOY_PATH/.env.local
sshpass -p "$DEPLOY_PASSWORD" ssh -o StrictHostKeyChecking=no $DEPLOY_USER@$DEPLOY_HOST \
  "cd $DEPLOY_PATH && npm run build && pm2 restart cloud-vibe"
```

**`client reference manifest does not exist` / Application error 崩溃**
```bash
# 根因：.next 构建产物与代码版本不匹配，必须重新构建
sshpass -p "$DEPLOY_PASSWORD" ssh -o StrictHostKeyChecking=no $DEPLOY_USER@$DEPLOY_HOST \
  "cd $DEPLOY_PATH && npm run build && pm2 restart cloud-vibe"
```

**git pull fails (untracked files)**
```bash
# On server: clean untracked files, then pull
git clean -fd && git pull
```

**git pull fails (safe.directory)**
```bash
git config --global --add safe.directory /var/www/cloud-vibe
```

**PM2 not running / crash loop**
```bash
pm2 logs cloud-vibe --lines 30   # check errors
pm2 restart cloud-vibe
# If .env.local missing on server, restore it manually
```

**SSH connection timeout (fail2ban 封 IP)**
- 多次频繁 SSH 连接会触发 fail2ban，等 5-10 分钟后自动解封
- Check server is up: `curl -s https://vibe.iamxmm.xyz/ -o /dev/null -w "%{http_code}"`

## Release Version Bump

When user asks to "发布版本" or "release":
1. Update `version` in `package.json`
2. Commit with `chore: bump version to vX.Y.Z`
3. `git tag vX.Y.Z && git push && git push origin vX.Y.Z`
4. `gh release create vX.Y.Z --title "vX.Y.Z" --notes "..."`
5. Then run standard deploy flow above

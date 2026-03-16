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

## Standard Deploy Flow

### 1. Local build check
```bash
cd /Users/mmx/Documents/work/Github/cloud-vibe
npm run build
```

### 2. Commit & push (if there are uncommitted changes)
```bash
git add -f src/app/ src/components/ src/lib/ src/middleware.ts package.json
git commit -m "..."
git push
```
> Note: `src/app/` is in `.gitignore` — always use `git add -f` for files under it.

### 3. Deploy to server
```bash
sshpass -p '$DEPLOY_PASSWORD' ssh -o StrictHostKeyChecking=no $DEPLOY_USER@$DEPLOY_HOST \
  "cd $DEPLOY_PATH && git pull && npm install && npm run build && pm2 restart cloud-vibe && echo DEPLOY_OK"
```

### 4. Verify
```bash
curl -s --connect-timeout 5 https://vibe.iamxmm.xyz/ -o /dev/null -w "%{http_code}"
# Expected: 200
```

## Troubleshooting

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

**SSH connection timeout**
- Check server is up: `curl -s http://$DEPLOY_HOST -o /dev/null -w "%{http_code}"`
- Try again — sometimes transient

## Release Version Bump

When user asks to "发布版本" or "release":
1. Update `version` in `package.json`
2. Commit with `chore: bump version to vX.Y.Z`
3. `git tag vX.Y.Z && git push && git push origin vX.Y.Z`
4. `gh release create vX.Y.Z --title "vX.Y.Z" --notes "..."`
5. Then run standard deploy flow above

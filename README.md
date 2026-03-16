# Cloud Vibe

一个基于 Next.js 和 Supabase 构建的 Cursor Cloud Agents Web 仪表板，用于管理和监控 AI 代码助手代理。

A web dashboard built with Next.js and Supabase for managing and monitoring Cursor Cloud Agents (AI code assistant agents).

## 🌐 Online Access / 在线访问

**Dashboard**: [https://vibe.iamxmm.xyz/dashboard/bc-746e5fb7-eb3a-4381-90b4-3d2d565ced84](https://vibe.iamxmm.xyz/dashboard/bc-746e5fb7-eb3a-4381-90b4-3d2d565ced84)

## 主要功能 / Features

- 🔐 **安全的 API 密钥管理** - 使用 Supabase 加密存储 Cursor API 密钥
- 🤖 **代理管理** - 创建、监控和管理多个 AI 代码助手代理
- 💬 **对话历史** - 查看代理与代码库的完整对话记录
- 📁 **文件下载** - 下载代理生成的文件和代码变更
- 🔖 **书签功能** - 为重要代理添加标签和备注
- 📦 **仓库缓存** - 智能缓存 GitHub 仓库列表，减少 API 调用

## 技术栈 / Tech Stack

- **前端**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **后端**: Next.js API Routes
- **数据库**: Supabase (PostgreSQL)
- **状态管理**: SWR
- **认证**: Supabase Auth

## 快速开始 / Quick Start

### 环境变量

创建 `.env.local` 文件：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 安装依赖

```bash
npm install
```

### 运行开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

### 数据库设置

运行 `supabase-migration.sql` 中的 SQL 脚本在 Supabase Dashboard 中创建必要的表结构。

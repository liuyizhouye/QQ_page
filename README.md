# QQ Story - 静态站点与后端服务

## 概述

本仓库包含两部分：
- `docs/`：静态站点（部署到 GitHub Pages，域名由 `CNAME` 指向）
- `server/`：Node.js/Express 后端服务（SQLite 持久化，支持媒体/PDF 上传，提供 REST API）

## 目录结构

```
.
├── CNAME                 # GitHub Pages 自定义域配置
├── docs/                 # 前端静态资源（HTML/CSS/JS/图片等）
│   ├── index.html        # 主页
│   ├── js/
│   │   ├── api.config.js # 前端 API 端点配置
│   │   └── ...
│   └── ...
├── server/               # 后端（Express + SQLite）
│   ├── src/              # 业务代码与路由
│   ├── uploads/          # 上传文件存储目录
│   ├── database/         # SQLite 数据库存储目录
│   ├── deploy/           # 部署配置参考
│   └── README.md         # 后端部署与运维的详细说明
└── DEPLOY_NAS.md         # NAS 存储配置指南（可选）
```

## 快速开始（本地开发）

### 后端 API（必需）

1. 进入后端目录并安装依赖：
```bash
cd server
npm install
```

2. 初始化数据库并启动开发服务（默认端口 8080）：
```bash
npm run migrate
npm run dev
```

3. 健康检查：
```bash
curl http://localhost:8080/health
```

### 前端静态站点（可选）

- 直接用浏览器打开 `docs/index.html` 进行本地预览，或使用任意静态文件服务器（如 VSCode Live Server）
- `docs/js/api.config.js` 会自动在本地使用 `http://localhost:8080/api`，线上使用 `https://api.hanbaodoudou.com/api`
- 如需在浏览器内进行写操作，需先在控制台注入管理员密钥：
```javascript
window.QQStoryApi.setAdminKey('你的 ADMIN_API_KEY', { persist: 'session' });
```

## 常用命令

在 `server/` 目录下：
```bash
npm run migrate   # 初始化/迁移数据库
npm run dev       # 开发模式（nodemon）
npm start         # 生产模式启动
```

## 部署架构

### 当前生产环境

- **前端**：`docs/` 静态站点托管在 GitHub Pages（`https://hanbaodoudou.com`）
- **后端**：运行在阿里云 ECS（Ubuntu 22.04）
  - 使用 PM2 进程管理，开机自启动
  - 通过 Caddy 反向代理提供 HTTPS（`https://api.hanbaodoudou.com`）
  - Let's Encrypt 自动证书管理
  - 文件存储：ECS 本地 `uploads/` 目录（可选配置 NAS 远程挂载）

### 数据流

```
浏览器 ─HTTPS─> api.hanbaodoudou.com (Caddy) ─> localhost:8080 (PM2 + Express)
                                                      └─> SQLite DB
                                                      └─> uploads/ 或 NAS
```

## 环境变量（后端）

在 `server/.env` 中配置：
```ini
PORT=8080
ADMIN_API_KEY=请替换为长度≥32的随机字符串
DATABASE_FILE=database/qq_story.db
UPLOAD_DIR=uploads  # 或 /mnt/nas_uploads（如配置 NAS）
MEDIA_BASE_URL=     # 可选：CDN 或 NAS 直连地址
ALLOWED_ORIGINS=*
MAX_UPLOAD_SIZE_MB=100
RATE_LIMIT_WINDOW_MINUTES=15
RATE_LIMIT_MAX_REQUESTS=300
```

> ⚠️ `ADMIN_API_KEY` 只用于管理员写入操作，请妥善保密；仅允许来自前端域名的跨域请求。

## 注意事项

- 请妥善保管 `ADMIN_API_KEY`，仅在需要写操作时短暂注入浏览器，并在完成后执行 `window.QQStoryApi.clearStoredAdminKey()` 或关闭窗口
- 生产环境通过 Caddy 提供 HTTPS，确保安全访问
- 定期备份 `server/database/qq_story.db` 与整个 `server/uploads/`

## 高级配置

### NAS 存储（可选）

如需将文件存储到私有 NAS，请参考 `DEPLOY_NAS.md` 配置指南。

主要步骤：
1. 在 ECS 和 NAS 上安装 Tailscale 组网
2. 通过 NFS 将 NAS 目录挂载到 ECS
3. 修改 `.env` 中的 `UPLOAD_DIR` 指向挂载点

### 自动部署

后端使用 PM2 管理：
```bash
pm2 start src/app.js --name qq-story
pm2 startup  # 配置开机自启动
pm2 save
```

查看状态和日志：
```bash
pm2 status
pm2 logs qq-story
pm2 restart qq-story
```

## 许可证

未显式声明许可证。如需开源/闭源分发，请根据实际需求补充 LICENSE 文件与声明。

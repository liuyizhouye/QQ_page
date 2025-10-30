QQ Story - 静态站点与后端服务

概述

本仓库包含两部分：
- docs：静态站点（部署到 GitHub Pages，域名由 `CNAME` 指向）。
- server：Node.js/Express 后端服务（SQLite 持久化，支持媒体/PDF 上传，提供 REST API）。

目录结构

```
.
├── CNAME                 # GitHub Pages 自定义域配置
├── docs/                 # 前端静态资源（HTML/CSS/JS/图片等）
│   ├── index.html        # 主页
│   ├── js/
│   │   ├── api.config.js # 前端 API 端点与管理员密钥的浏览器侧注入
│   │   └── ...
│   └── ...
└── server/               # 后端（Express + SQLite）
    ├── src/              # 业务代码与路由
    ├── uploads/          # 上传文件存储目录
    ├── database/         # SQLite 数据库存储目录
    ├── deploy/           # 云服务器与 NAS 的部署配置（Caddy/frp 等）
    ├── Dockerfile
    ├── docker-compose.yml
    └── README.md         # 后端部署与运维的详细说明
```

快速开始（本地开发）

后端 API（必需）

1. 进入后端目录并安装依赖：
```
cd server
npm install
```
2. 初始化数据库并启动开发服务（默认端口 8080）：
```
npm run migrate
npm run dev
```
3. 健康检查：
```
curl http://localhost:8080/health
```

前端静态站点（可选）

- 直接用浏览器打开 `docs/index.html` 进行本地预览，或使用任意静态文件服务器（如 VSCode Live Server）。
- `docs/js/api.config.js` 会自动在本地使用 `http://localhost:8080/api`，线上使用 `https://api.hanbaodoudou.com/api`。
- 如需在浏览器内进行写操作，需先在控制台注入管理员密钥：
```
window.QQStoryApi.setAdminKey('你的 ADMIN_API_KEY', { persist: 'session' });
```

常用命令

在 `server/` 目录下：
```
npm run migrate   # 初始化/迁移数据库
npm run dev       # 开发模式（nodemon）
npm start         # 生产模式启动
```

部署与架构说明（摘要）

- 前端：`docs/` 静态站点托管在 GitHub Pages（域名见根目录 `CNAME`）。
- 后端：运行在家庭 NAS（Docker），暴露给内网；通过云服务器（Caddy + frps）做公网入口与反向代理；NAS 使用 frpc 穿透回云端，实现公网安全访问。
- 详细部署、环境变量、安全与运维建议，请阅读 `server/README.md`。

环境变量（后端简要）

在 `server/.env` 中配置：
```
PORT=8080
DATABASE_FILE=/app/database/qq_story.db
UPLOAD_DIR=/app/uploads
LOG_DIR=/app/logs
ADMIN_API_KEY=请替换为长度≥32的随机字符串
ALLOWED_ORIGINS=https://hanbaodoudou.com,https://www.hanbaodoudou.com,https://hanbaodoudou.github.io,http://localhost:4173
MAX_UPLOAD_SIZE_MB=20
```
完整列表及说明见 `server/README.md`。

注意事项

- 请妥善保管 `ADMIN_API_KEY`，仅在需要写操作时短暂注入浏览器，并在完成后执行 `window.QQStoryApi.clearStoredAdminKey()` 或关闭窗口。
- 生产环境请通过云服务器的反向代理提供 HTTPS，避免直接暴露 NAS 端口。
- 定期备份 `server/database/qq_story.db` 与整个 `server/uploads/`。

许可证

未显式声明许可证。如需开源/闭源分发，请根据实际需求补充 LICENSE 文件与声明。



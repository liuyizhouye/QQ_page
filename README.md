# 兜兜 & 汉堡 の 大冒险

一个个人纪念网站。前端是部署在 ECS 上的静态站，后端是 Express + SQLite API，负责时间线、瞬间、留言、私密信件和管理区写入。

线上入口：

- 主站：<https://hanbaodoudou.com>
- `www`：<https://www.hanbaodoudou.com>，由 Caddy 301 到主域名
- API：<https://api.hanbaodoudou.com>

## 当前架构

```text
Internet
  ├─ hanbaodoudou.com
  ├─ www.hanbaodoudou.com
  └─ api.hanbaodoudou.com
         |
         v
      ECS 47.115.72.187
         |
         +-- Caddy (Docker)
         |     - hanbaodoudou.com -> /srv/www/hanbaodoudou.com
         |     - www.hanbaodoudou.com -> 301 to apex
         |     - api.hanbaodoudou.com -> reverse_proxy 172.17.0.1:8080
         |
         +-- PM2
         |     - process: qq-story-api
         |     - entry: /root/QQ_page/server/src/app.js
         |
         +-- Runtime data
               - /srv/qq-story/data/qq_story.db
               - /srv/qq-story/uploads
               - /srv/qq-story/logs
```

域名已转入阿里云，ICP 备案已完成。当前发布链路不让 ECS 自己 `git pull`，而是由 GitHub Actions 或本机脚本上传制品并远端部署。

## 功能

- `Home`：首屏入口、桌面章节地图、移动端精选章节入口
- `Our Story`：站点背景和纪念数据计数
- `QQ Footprint`：按年份组织的里程碑时间线
- `Moments`：照片/视频展示、分类筛选、媒体查看器
- `Comments`：公开留言墙
- `Letters`：服务端密码保护的私密信件
- `Story Manager`：管理员内容管理区
- `Liuyizhouye.com`：旧生日网站合并后的彩蛋章节

## 仓库结构

```text
.
├── .github/workflows/deploy.yml  # push main 自动部署，也支持手动触发
├── AGENTS.md                     # 维护代理使用的真实架构与约束
├── README.md                     # 项目入口
├── deploy.ps1                    # Windows 本机一键制品部署
├── design/                       # 设计源文件归档，不公开部署
├── docs/                         # 公开静态站根目录
├── notes/                        # 内部文档与历史记录，不公开部署
├── scripts/                      # 打包与 ECS 远端部署脚本
└── server/                       # Express API、SQLite、上传逻辑
```

`docs/` 会镜像同步到 `/srv/www/hanbaodoudou.com`，这里只放线上运行必需的公开资源。`design/` 和 `notes/` 不参与公开部署。

## 前端实现

- 页面入口是 `docs/index.html`。
- 主要样式在 `docs/css/stylesheet.css`，当前 UI 刷新由 `body.qq-ui-refresh` 和相关规则承载。
- 主要脚本在 `docs/js/theme.js`，API 封装在 `docs/js/api-client.js`，API 地址选择在 `docs/js/api.config.js`。
- 生产环境默认请求 `https://api.hanbaodoudou.com/api`。
- 只有页面运行在 `localhost` 或 `127.x.x.x` 时，前端才会改用 `http://localhost:8080/api`。
- 桌面端保留左侧导航和章节式大屏浏览。
- 移动端使用底部横向快捷导航、首屏章节入口、每章封面卡和内容浮层，不再只是桌面布局的窄屏压缩版。
- Section 背景由 CSS 直接引用 `docs/images/*-section-bg.webp`；移动端封面使用 `docs/images/*-mobile-cover.webp`。

## 后端本地开发

```bash
cd server
npm install
cp env.example .env
npm run dev
```

本地健康检查：

```bash
curl http://127.0.0.1:8080/health
```

如果要让前端也请求本地 API，请用 `localhost` 或 `127.0.0.1` 起一个静态服务器来打开 `docs/`，不要直接用 `file://` 预览。例如：

```bash
python -m http.server 5500 -d docs
```

然后访问 `http://localhost:5500`。

## 发布到 ECS

### 自动发布

推送 `main` 会自动运行 GitHub Actions 工作流 `Deploy to ECS`：

```bash
git push origin main
```

工作流会打包仓库制品、上传到 ECS、同步静态站与服务端代码、重启 API 和 Caddy，并做健康检查。通常等待 1-3 分钟后主站更新。

### 本机发布

```powershell
.\deploy.ps1
```

如需指定 SSH 私钥：

```powershell
.\deploy.ps1 -IdentityFile C:\Users\liuyi\.ssh\id_ed25519
```

### 手动 CI 发布

在 GitHub Actions 页面手动触发 `Deploy to ECS`。需要仓库 Secrets：

- `ECS_HOST`
- `ECS_PORT`
- `ECS_USER`
- `ECS_SSH_KEY`
- `ECS_KNOWN_HOSTS`

## 发布链路

- `scripts/package-release.sh` 使用 Git 跟踪文件和未忽略文件打包制品。
- `scripts/deploy-ecs.sh` 在 ECS 临时目录解压制品。
- 远端执行 `npm ci --omit=dev` 和 `npm rebuild better-sqlite3`。
- `docs/` 镜像同步到 `/srv/www/hanbaodoudou.com`。
- 仓库副本镜像同步到 `/root/QQ_page`。
- `server/.env`、数据库、上传文件和日志不会被制品覆盖。
- `qq-story-api` 由 PM2 重启。
- Caddy Docker Compose 会重新应用。
- 健康检查失败时部署退出非零。

## 静态资源维护

- 不要把内部文档、设计稿、审查记录放回 `docs/`。
- 不要提交 `.env`、管理员 key、私钥、口令、EPP 或含敏感信息的截图。
- `docs/vendor/` 只保留页面实际引用的 minified CSS/JS、Font Awesome webfonts 和必要运行时图片。
- `server/database/`、`server/uploads/`、`server/logs/` 是运行时目录，由本机或 ECS 自动创建，不作为仓库内容维护。

## 发布后验证

```bash
curl -I https://hanbaodoudou.com
curl -I https://www.hanbaodoudou.com
curl https://api.hanbaodoudou.com/health
ssh root@47.115.72.187 "pm2 list && docker ps"
```

更多后端细节见 [server/README.md](server/README.md)。维护约束以 [AGENTS.md](AGENTS.md) 为准。

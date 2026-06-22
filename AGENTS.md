# QQ_page Agent Notes

本文件记录当前项目的真实架构、维护边界和发布约束。后续维护以这里为准，不再参考旧的 GitHub Pages、GoDaddy 或 ECS 手工 `git pull` 流程。

## 1. 项目定位

- 这是一个个人纪念网站，不是作品集模板站。
- 前端是静态页面，后端负责内容查询、写入和文件上传。
- 主要章节：
  - `Home`：首屏入口
  - `Our Story`：关系背景和计数信息
  - `QQ Footprint`：里程碑时间线
  - `Moments`：照片/视频展示
  - `Comments`：公开留言
  - `Letters`：私密信件
  - `Story Manager`：管理员操作区
  - `Liuyizhouye.com`：旧生日网站合并后的彩蛋章节

## 2. 当前线上架构

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

## 3. 域名与解析

- 域名：`hanbaodoudou.com`
- 当前 NS：`dns27.hichina.com` / `dns28.hichina.com`
- 当前解析：
  - `@` -> `47.115.72.187`
  - `www` -> `47.115.72.187`
  - `api` -> `47.115.72.187`
- 域名转入阿里云已完成。
- ICP 备案已完成。

## 4. 仓库结构与职责

- `docs/`
  - 公开静态站根目录。
  - 线上镜像同步到 `/srv/www/hanbaodoudou.com` 和 `/root/QQ_page/docs`。
  - 只能放前端运行必需内容，不要放内部文档、设计稿、审查记录或临时素材。
- `docs/images/`
  - 当前公开图片全部被页面、CSS 或脚本引用。
  - `*-section-bg.webp` 是桌面 section 背景。
  - `*-mobile-cover.webp` 是移动端章节封面。
  - `intro-bg-new.webp`、`profile_new.webp`、Liuyizhouye 装饰图和 favicon 都是运行时资源。
- `docs/vendor/`
  - 只保留页面实际引用的 minified CSS/JS、Font Awesome webfonts 与必要运行时图片。
- `design/`
  - 设计源文件归档，不参与公开部署。
  - 当前保存 `story.pdf`、`timeline.pdf`、`moments.pdf`、`comments.pdf`、`letters.pdf`、`manager.pdf`。
- `notes/`
  - 内部文档与历史记录，不参与公开部署。
- `server/`
  - Express API、SQLite、上传逻辑。
  - 线上代码目录：`/root/QQ_page/server`。
- `scripts/`
  - `package-release.sh`：为 CI 打包发布制品。
  - `deploy-ecs.sh`：ECS 远端部署脚本。
- `deploy.ps1`
  - Windows 本机一键制品部署入口。
- `.github/workflows/deploy.yml`
  - `push` 到 `main` 自动部署到 ECS。
  - 保留 `workflow_dispatch` 手动部署入口。
- `server/deploy/cloud/`
  - 当前线上 Caddy Docker Compose 配置源码。

## 5. 前端实现边界

- 页面入口是 `docs/index.html`。
- 样式主文件是 `docs/css/stylesheet.css`。
- 页面主逻辑在 `docs/js/theme.js`。
- API 地址选择在 `docs/js/api.config.js`：
  - 生产默认 `https://api.hanbaodoudou.com/api`。
  - 只有 `localhost` 或 `127.x.x.x` 才走 `http://localhost:8080/api`。
- API 封装在 `docs/js/api-client.js`。
- 当前 UI 刷新基于 `body.qq-ui-refresh`。
- 桌面端仍是左侧导航 + 章节式大屏内容。
- 移动端是独立打磨过的体验：
  - `mobile-quick-nav`：底部横向快捷导航。
  - `mobile-home-map`：首屏章节入口。
  - `mobile-section-cover` / `mobile-chapter-poster`：每章移动端封面。
  - `mobile-editorial-sheet`：移动端内容浮层。
- 不影响桌面端是移动端改动的硬约束。移动端专属规则应放在 `@media (max-width: 767.98px)` 或使用 `d-md-none` 等现有 Bootstrap 断点。
- Section 背景必须继续由 `docs/css/stylesheet.css` 直接引用 `docs/images/*-section-bg.webp`，不要改回依赖 HTML 内联 CSS 变量。

## 6. 后端实现边界

- 后端是 Node.js + Express + SQLite。
- `server/src/config.js` 会自动创建数据库目录、上传目录和日志目录。
- 生产数据库：`/srv/qq-story/data/qq_story.db`。
- 生产上传目录：`/srv/qq-story/uploads`。
- 生产日志目录：`/srv/qq-story/logs`。
- `Letters` 和 `Story Manager` 的解锁密码只保存在 ECS 的 `server/.env`。
- `Letters` 列表接口和 `/uploads/letters/*` PDF 下载依赖服务端校验后的 `HttpOnly` cookie 或管理员 `x-api-key`。
- 写接口依赖后端 `x-api-key`。
- 前端管理员 `x-api-key` 只保存在页面内存，不写入 `localStorage` 或 `sessionStorage`。
- `server/.env`、运行时数据库、上传文件和日志都不应进入 Git 跟踪或发布制品。

## 7. 当前发布流程

### 推荐方式

- 日常发布：提交到 `main` 并 `git push origin main`，GitHub Actions 自动运行 `Deploy to ECS`。
- 本机发布：在仓库根目录运行 `.\deploy.ps1`。
- 手动 CI 发布：在 GitHub Actions 手动触发 `Deploy to ECS`。

### 自动部署触发

- `.github/workflows/deploy.yml` 当前触发条件：
  - `push` 到 `main`
  - `workflow_dispatch`
- 工作流使用 `concurrency` 按分支串行化部署。
- 自动部署走制品上传链路，不让 ECS 自己 `git pull`。

### 发布链路

- 本机或 GitHub Actions 打包仓库制品。
- 上传到 ECS `/tmp`。
- `scripts/deploy-ecs.sh` 在 ECS 上执行：
  - 解压到临时目录。
  - 在临时目录执行 `npm ci --omit=dev` 和 `npm rebuild better-sqlite3`。
  - 镜像同步 `docs/` 到 `/srv/www/hanbaodoudou.com`。
  - 镜像同步仓库副本到 `/root/QQ_page`。
  - 保留 `server/.env`、`server/database/`、`server/uploads/`、`server/logs/`。
  - 更新 `/root/server/deploy/cloud`。
  - `pm2 restart qq-story-api`。
  - `docker compose up -d`。
  - 做本地 API、公开 API 和公开站点健康检查。

### GitHub Actions Secrets

- `ECS_HOST`
- `ECS_PORT`
- `ECS_USER`
- `ECS_SSH_KEY`
- `ECS_KNOWN_HOSTS`

### 发布后验证

```bash
curl -I https://hanbaodoudou.com
curl -I https://www.hanbaodoudou.com
curl https://api.hanbaodoudou.com/health
ssh root@47.115.72.187 "pm2 list && docker ps"
```

## 8. 已完成的关键变更

- 主站从 GitHub Pages 迁移到 ECS。
- API、公网主站和 `www` 全部由 ECS 上的 Caddy 接管。
- 运行时数据迁移到 `/srv/qq-story`。
- 静态站迁移到 `/srv/www/hanbaodoudou.com`。
- DNS 已切换到阿里云云解析。
- 去掉 Google Fonts 外链，背景音频改为 `preload="none"`。
- 大背景图改为 `.webp`。
- 六个主要 section 改为语义化背景资源并直接由 CSS 绑定。
- 设计稿移到 `design/`，内部文档移到 `notes/`。
- 删除未使用的旧 vendor、历史 Sass、已跟踪的 `server/node_modules/` 和未引用图片。
- 补齐本机部署、GitHub Actions 自动部署和 ECS 远端制品部署脚本。
- 公开 vendor 资源已收敛到页面实际引用的文件。
- QQ Footprint、Moments、Comments、Letters、Story Manager 和 Liuyizhouye.com 已完成桌面视觉间距与卡片层级优化。
- 移动端已改为独立的章节封面、内容浮层和底部快捷导航体验。
- 当前已从 Git 跟踪中移除 `server/.env` 和运行时目录占位文件，避免制品带上本机/生产运行态内容。

## 9. 后续建议

1. 做最小监控与恢复验证。
   - 定时检查 `https://api.hanbaodoudou.com/health`。
   - 定期抽查数据库快照与上传文件是否可恢复。
2. 处理安全债务。
   - 轮换管理员 API key。
   - 不把任何密钥、口令、截图中的敏感信息写入仓库。
3. 继续优化前端时，先保证桌面端现状不退化，再单独打磨移动端。

## 10. 不要再做的事

- 不要把内部文档、设计稿、审查记录重新放回 `docs/`。
- 不要恢复 GitHub Pages 的 `CNAME` 流程。
- 不要在 ECS 上把 `/root/QQ_page` 当成手工编辑工作区。
- 不要把上线流程改回 ECS `git pull`。
- 不要把运行时数据库和上传目录重新耦合回仓库目录。
- 不要把 `.env`、密钥、EPP、私钥、口令写入仓库。
- 不要为了移动端优化改坏桌面端布局。

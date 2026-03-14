# QQ_page Agent Notes

本文件是当前项目的真实架构与维护约束。后续继续维护时，以这里为准，不再参考旧的 GitHub Pages / GoDaddy 流程。

## 1. 项目定位

- 这是一个个人纪念网站。
- 前端是静态页面，后端负责内容查询、写入和文件上传。
- 主要功能：
  - `QQ Footprint`：里程碑时间线
  - `Moments`：照片/视频内容展示
  - `Comments`：公开留言
  - `Letters`：私密信件
  - `Story Manager`：管理员操作区

## 2. 当前真实架构

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
```

## 3. 域名与解析现状

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
  - 公开静态站根目录
  - 线上镜像同步到 `/srv/www/hanbaodoudou.com` 和 `/root/QQ_page/docs`
  - 这里只能放前端运行必需内容，不要再放内部文档、设计稿或审查记录
- `design/`
  - 设计源文件归档
  - 当前保存 6 份背景设计 PDF：
    - `story.pdf`
    - `timeline.pdf`
    - `moments.pdf`
    - `comments.pdf`
    - `letters.pdf`
    - `manager.pdf`
  - 不参与公开部署
- `notes/`
  - 内部文档与历史记录
  - 当前包括：
    - `ops-handover-2026-02-20.md`
    - `security-review.md`
  - 不参与公开部署
- `server/`
  - Express API、SQLite、上传逻辑
  - 线上代码目录：`/root/QQ_page/server`
- `scripts/`
  - 制品部署脚本
  - `package-release.sh`：为 CI 打包发布制品
  - `deploy-ecs.sh`：ECS 远端部署脚本
- `deploy.ps1`
  - Windows 本机一键部署入口
- `.github/workflows/deploy.yml`
  - GitHub Actions 手动部署工作流
- `server/deploy/cloud/Caddyfile`
  - 当前线上 Caddy 配置源码
- `server/deploy/cloud/compose.yaml`
  - 当前线上 Caddy Docker Compose 配置
- `DEPLOY_NAS.md`
  - NAS 接入方案，当前推荐“同步备份”而不是“在线挂载主存”

## 5. 已完成的关键变更

- 主站从 GitHub Pages 迁移到 ECS。
- API、公网主站和 `www` 全部由 ECS 上的 Caddy 统一接管。
- 运行时数据迁移到 `/srv/qq-story`，避免与代码目录耦合。
- 静态站迁移到 `/srv/www/hanbaodoudou.com`。
- DNS 已切换到阿里云云解析。
- 已做首屏性能与资源清理：
  - 去掉 Google Fonts 外链
  - 背景音频改为 `preload="none"`
  - 大背景图改为 `.webp`
  - 六个主要 section 改为语义化背景资源并直接由 CSS 绑定
- 已完成仓库收敛：
  - 设计稿移到 `design/`
  - 内部文档移到 `notes/`
  - 删除未使用的 `docs/vendor/jquery.mb.YTPlayer/`
  - 删除历史 Sass 源码目录 `docs/sass/`
  - 删除已跟踪的 `server/node_modules/`
  - 删除未引用的旧背景和原始大图副本
- 已补充制品部署链路：
  - 本机 `deploy.ps1`
  - GitHub Actions `workflow_dispatch`
  - ECS 远端 `scripts/deploy-ecs.sh`

## 6. 当前已知实现细节

- 前端固定请求 `https://api.hanbaodoudou.com/api`，本地开发时才走 `http://localhost:8080/api`。
- `Letters` 和 `Story Manager` 的解锁密码仍然在前端代码里，属于展示层门禁，不是真正安全边界。
- 真正需要保护的写操作依赖后端 `x-api-key`。
- 数据库当前是 SQLite，适合放在 ECS 本地磁盘，不适合直接放在 NAS / NFS 上作为在线主库。
- 当前网页 section 背景直接由 `docs/css/stylesheet.css` 引用 `docs/images/*-section-bg.webp`，不要再改回依赖 HTML 内联 CSS 变量的写法。

## 7. 后续建议顺序

1. 完成 NAS 私网接入。
   - 给 ECS 和家里 NAS 安装 `Tailscale`
   - 确认两端互通
2. 把 NAS 用作同步备份目标。
   - 上传文件继续写入 `/srv/qq-story/uploads`
   - 使用 `sqlite3 .backup` 备份数据库
   - 使用 `rsync` 把数据库备份和上传目录同步到 NAS
3. 做最小监控与恢复验证。
   - 定时检查 `https://api.hanbaodoudou.com/health`
   - 定期抽查 NAS 备份是否可恢复
4. 处理安全债务。
   - 把前端硬编码密码迁移为服务端校验或更合理的访问控制
   - 轮换管理员 API key
   - 不把任何密钥、口令、截图中的敏感信息写入仓库

## 8. 代码发布标准流程

### 推荐方式

- 本机发布：在仓库根目录运行 `.\deploy.ps1`
- CI 发布：在 GitHub Actions 手动触发 `Deploy to ECS`

### 当前发布链路

- 不让 ECS 自己 `git pull`
- 由本机或 GitHub Actions 打包仓库制品
- 上传到 ECS `/tmp`
- 由 `scripts/deploy-ecs.sh` 在 ECS 上执行：
  - 解压到临时目录
  - 在临时目录执行 `npm ci --omit=dev` 和 `npm rebuild better-sqlite3`
  - 镜像同步 `docs/` 到 `/srv/www/hanbaodoudou.com`
  - 镜像同步仓库副本到 `/root/QQ_page`
  - 保留 `server/.env`、`server/database/`、`server/uploads/`、`server/logs/`
  - 更新 `/root/server/deploy/cloud`
  - `pm2 restart qq-story-api`
  - `docker compose up -d`
  - 做健康检查

### GitHub Actions 需要的 Secrets

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

## 9. 不要再做的事

- 不要把内部文档、设计稿、审查记录重新放回 `docs/`。
- 不要恢复 GitHub Pages 的 `CNAME` 流程。
- 不要在 ECS 上把 `/root/QQ_page` 当成手工编辑工作区。
- 不要把上线流程重新改回 `git pull`。
- 不要把 SQLite 主库直接放到 NAS / NFS。
- 不要把家里 NAS 直接暴露为线上主服务入口。
- 不要把 `.env`、密钥、EPP、私钥、口令写入仓库。

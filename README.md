# 兜兜 & 汉堡 の 大冒险

一个前后端分离的个人纪念网站，前端是静态页面，后端提供时间线、瞬间、留言和信件的内容管理 API。

## 当前线上架构

```text
浏览器
  ├─ https://hanbaodoudou.com      -> ECS 上的 Caddy -> /srv/www/hanbaodoudou.com
  ├─ https://www.hanbaodoudou.com  -> 301 跳转到主域名
  └─ https://api.hanbaodoudou.com  -> ECS 上的 Caddy -> PM2 Node.js -> /srv/qq-story
                                                         ├─ data/qq_story.db
                                                         └─ uploads/
```

- 域名已转入阿里云，ICP 备案已完成。
- 主站与 API 已全部收口到同一台阿里云 ECS。
- 运行时数据库与上传文件当前都保存在 ECS 本地目录 `/srv/qq-story`。

## 仓库结构

```text
.
├── .github/workflows/  # GitHub Actions 部署工作流
├── AGENTS.md          # 当前真实架构、运维约束、同步流程、后续待办
├── README.md          # 项目总入口
├── deploy.ps1         # Windows 本机一键部署到 ECS
├── design/            # 设计源文件归档，不参与公开部署
├── docs/              # 公开静态站根目录，会镜像同步到 ECS
├── notes/             # 内部文档与归档记录，不参与公开部署
├── scripts/           # 打包与 ECS 远端部署脚本
└── server/            # Node.js + Express API
```

说明：

- `docs/` 只放会被部署到 ECS 的公开资源。
- `design/` 保存 PDF 设计稿，当前网页背景图已经从这里导出到 `docs/images/`。
- `notes/` 保存交接记录、安全审查等内部文档。
- `server/node_modules/` 不提交，依赖通过 `npm install` 恢复。

## 本地开发

```bash
cd server
npm install
cp env.example .env
npm run dev
```

前端可直接打开 `docs/index.html`，也可以用任意静态服务器预览。

## 发布到 ECS

推荐使用制品部署，不再让 ECS 直接 `git pull`：

### 本机一键发布

```powershell
.\deploy.ps1
```

如果你的 SSH 私钥不在默认位置：

```powershell
.\deploy.ps1 -IdentityFile C:\Users\liuyi\.ssh\id_ed25519
```

### GitHub Actions 手动发布

工作流文件：`.github/workflows/deploy.yml`

需要先配置仓库 Secrets：

- `ECS_HOST`
- `ECS_PORT`
- `ECS_USER`
- `ECS_SSH_KEY`
- `ECS_KNOWN_HOSTS`

发布时会：

- 打包当前仓库制品
- 上传到 ECS
- 在 ECS 临时目录安装生产依赖
- 同步静态站到 `/srv/www/hanbaodoudou.com`
- 同步仓库副本到 `/root/QQ_page`
- 重启 `qq-story-api`
- 重新应用 Caddy Compose 配置
- 自动执行健康检查

## 相关文档

- [AGENTS.md](AGENTS.md)：当前真实架构、部署流程、后续待办
- [server/README.md](server/README.md)：后端运行与 ECS 部署说明
- [notes/ops-handover-2026-02-20.md](notes/ops-handover-2026-02-20.md)：2026-02-20 历史交接记录
- [notes/security-review.md](notes/security-review.md)：后端快速安全检查记录

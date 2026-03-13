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
- NAS 仍是下一阶段的备份/归档节点，不是当前线上实时依赖。

## 仓库结构

```text
.
├── AGENTS.md          # 当前真实架构、运维约束、同步流程、后续待办
├── README.md          # 项目总入口
├── DEPLOY_NAS.md      # NAS 备份/同步方案
├── design/            # 设计源文件归档，不参与公开部署
├── docs/              # 公开静态站根目录，会镜像同步到 ECS
├── notes/             # 内部文档与归档记录，不参与公开部署
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

## 同步到 ECS

静态站目录采用镜像同步，确保本地已删除的旧资源会从 ECS 一起清掉：

```bash
rsync -av --delete docs/ root@47.115.72.187:/srv/www/hanbaodoudou.com/
rsync -av --delete docs/ root@47.115.72.187:/root/QQ_page/docs/
```

后端与 Caddy 配置见：

- `server/deploy/cloud/Caddyfile`
- `server/deploy/cloud/compose.yaml`

## 相关文档

- [AGENTS.md](AGENTS.md)：当前真实架构、部署流程、后续待办
- [server/README.md](server/README.md)：后端运行与 ECS 部署说明
- [DEPLOY_NAS.md](DEPLOY_NAS.md)：NAS 同步/备份方案
- [notes/ops-handover-2026-02-20.md](notes/ops-handover-2026-02-20.md)：2026-02-20 历史交接记录
- [notes/security-review.md](notes/security-review.md)：后端快速安全检查记录

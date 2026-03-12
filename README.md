# 兜兜 & 汉堡 の 大冒险

一个前后端分离的个人纪念网站，记录时间线、照片/视频、公开留言和私密信件。

## 当前线上架构

```text
浏览器
  ├─ https://hanbaodoudou.com           -> ECS 上的 Caddy -> /srv/www/hanbaodoudou.com
  ├─ https://www.hanbaodoudou.com       -> 301 跳转到主域名
  └─ https://api.hanbaodoudou.com       -> ECS 上的 Caddy -> PM2 Node.js -> /srv/qq-story
                                                          ├─ data/qq_story.db
                                                          └─ uploads/
```

- 域名已转入阿里云，ICP 备案已完成。
- 主站和 API 都已收口到同一台阿里云 ECS。
- NAS 规划为下一阶段的数据归档/备份节点，不作为当前线上实时依赖。

## 目录说明

```text
.
├── AGENTS.md                  # 当前项目总览、部署现状、后续待办
├── README.md                  # 项目入口说明
├── DEPLOY_NAS.md              # NAS 接入方案（推荐同步备份）
├── docs/                      # 前端静态站源码
└── server/                    # Node.js + Express API
```

## 本地开发

```bash
cd server
npm install
cp env.example .env
npm run dev
```

前端可直接打开 `docs/index.html`，或使用任意静态服务器预览。

## 线上部署入口

- 静态站目录：`/srv/www/hanbaodoudou.com`
- API 数据目录：`/srv/qq-story`
- API 代码目录：`/root/QQ_page/server`
- Caddy 配置：`server/deploy/cloud/Caddyfile`
- Caddy Compose：`server/deploy/cloud/compose.yaml`

## 相关文档

- [AGENTS.md](AGENTS.md)：当前真实架构、部署流程、下一步计划
- [server/README.md](server/README.md)：后端运行与 ECS 部署说明
- [DEPLOY_NAS.md](DEPLOY_NAS.md)：NAS 同步/备份方案
- [docs/ops-handover-2026-02-20.md](docs/ops-handover-2026-02-20.md)：2026-02-20 历史交接记录，已归档

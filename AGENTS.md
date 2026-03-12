# QQ_page Agent Notes

本文件是当前项目的运维与架构总览。后续继续维护时，优先以这里为准，不再以旧的 GitHub Pages / GoDaddy 流程文档为准。

## 1. 项目定位

- 这是一个个人纪念网站，前端为静态页面，后端提供内容管理 API。
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
  - 前端静态站源码
  - 线上同步目标：`/srv/www/hanbaodoudou.com`
- `server/`
  - Express API、SQLite、上传逻辑
  - 线上代码目录：`/root/QQ_page/server`
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
- 已做首屏性能优化：
  - 去掉 Google Fonts 外链
  - 背景音频改为 `preload="none"`
  - 大背景图改为 `.webp`
  - 部分区块改为接近视口时再加载背景
  - 初始故事数据拉取改为延后触发

## 6. 当前已知实现细节

- 前端固定请求 `https://api.hanbaodoudou.com/api`，本地开发时才走 `http://localhost:8080/api`。
- `Letters` 和 `Story Manager` 的解锁密码仍然在前端代码里，属于“展示层门禁”，不是真正安全边界。
- 真正需要保护的写操作依赖后端 `x-api-key`。
- 数据库当前是 SQLite，适合放在 ECS 本地磁盘，不适合直接放在 NAS/NFS 上作为在线主库。

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

## 8. 本地改动同步到 ECS 的标准流程

### 前端静态站

```bash
scp -r docs/* root@47.115.72.187:/srv/www/hanbaodoudou.com/
ssh root@47.115.72.187 "rm -f /srv/www/hanbaodoudou.com/CNAME /srv/www/hanbaodoudou.com/.DS_Store"
```

### Caddy 配置

```bash
scp server/deploy/cloud/Caddyfile root@47.115.72.187:/root/server/deploy/cloud/Caddyfile
scp server/deploy/cloud/compose.yaml root@47.115.72.187:/root/server/deploy/cloud/compose.yaml
ssh root@47.115.72.187 "cd /root/server/deploy/cloud && docker compose up -d"
```

### 验证

```bash
curl -I https://hanbaodoudou.com
curl -I https://www.hanbaodoudou.com
curl https://api.hanbaodoudou.com/health
```

## 9. 不要再做的事

- 不要恢复 GitHub Pages 的 `CNAME` 流程。
- 不要把 SQLite 主库直接放到 NAS / NFS。
- 不要把家里 NAS 直接暴露为线上主服务入口。
- 不要把 `.env`、密钥、EPP、私钥、口令写入仓库。

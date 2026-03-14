# QQ Story 后端服务

Node.js + Express + SQLite API，为前端静态站提供内容查询、写入和文件上传能力。

## 当前生产拓扑

```text
api.hanbaodoudou.com
  -> Caddy (Docker on ECS)
  -> 172.17.0.1:8080
  -> PM2: qq-story-api
  -> /srv/qq-story
       ├─ data/qq_story.db
       └─ uploads/
```

## 代码结构

```text
server/
├── src/
│   ├── app.js
│   ├── config.js
│   ├── db.js
│   ├── middleware/
│   ├── routes/
│   └── services/
├── deploy/cloud/
│   ├── Caddyfile
│   └── compose.yaml
├── env.example
└── package.json
```

说明：

- `server/node_modules/` 不提交，依赖通过 `npm install` 恢复。
- 前端公开静态资源位于仓库根目录 `docs/`，镜像同步到 ECS。
- 设计稿与内部文档已移到仓库根目录 `design/`、`notes/`，不参与公开部署。

## 环境变量

基于 `env.example` 创建 `.env`：

```bash
cp env.example .env
```

生产环境关键变量：

```ini
PORT=8080
NODE_ENV=production
ADMIN_API_KEYS=replace_with_secure_key
DATABASE_FILE=/srv/qq-story/data/qq_story.db
UPLOAD_DIR=/srv/qq-story/uploads
LOG_DIR=/srv/qq-story/logs
ALLOWED_ORIGINS=https://hanbaodoudou.com,https://www.hanbaodoudou.com,https://api.hanbaodoudou.com
MAX_UPLOAD_SIZE_MB=100
RATE_LIMIT_WINDOW_MINUTES=15
RATE_LIMIT_MAX_REQUESTS=300
```

## 本地开发

```bash
cd server
npm install
cp env.example .env
npm run dev
```

健康检查：

```bash
curl http://127.0.0.1:8080/health
```

## ECS 部署

### 1. 首次初始化依赖

```bash
sudo apt update
sudo apt install -y nodejs npm docker.io docker-compose-plugin sqlite3
sudo npm install -g pm2
sudo systemctl enable docker --now
```

### 2. 安装依赖

```bash
cd /root/QQ_page/server
npm install
npm rebuild better-sqlite3
```

### 3. 配置运行目录

```bash
mkdir -p /srv/qq-story/data /srv/qq-story/uploads /srv/qq-story/logs
```

### 4. 启动 API

```bash
cd /root/QQ_page/server
pm2 start src/app.js --name qq-story-api
pm2 save
```

### 5. 启动 Caddy

```bash
cd /root/server/deploy/cloud
docker compose up -d
```

### 6. 同步最新静态站

```bash
rsync -av --delete /root/QQ_page/docs/ /srv/www/hanbaodoudou.com/
```

## 后续发布

后续代码更新不要在 ECS 上直接 `git pull`。当前标准做法是：

- 本机运行仓库根目录 `.\deploy.ps1`
- 或在 GitHub Actions 手动触发 `Deploy to ECS`

发布脚本：

- `scripts/package-release.sh`：打包仓库制品
- `scripts/deploy-ecs.sh`：在 ECS 上执行正式部署

这条链路会：

- 在 ECS 临时目录解压新版本
- 在临时目录执行 `npm ci --omit=dev`
- `npm rebuild better-sqlite3`
- 镜像同步 `docs/` 到 `/srv/www/hanbaodoudou.com`
- 镜像同步仓库副本到 `/root/QQ_page`
- 保留 `server/.env`、`server/database/`、`server/uploads/`、`server/logs/`
- 更新 `/root/server/deploy/cloud`
- `pm2 restart qq-story-api`
- `docker compose up -d`
- 健康检查失败时退出非零

说明：

- `/root/QQ_page` 现在是部署镜像副本，不是线上手工编辑工作区。
- 运行时数据仍然在 `/srv/qq-story`，不会被发布覆盖。

## 当前线上验证命令

```bash
pm2 list
curl http://127.0.0.1:8080/health
docker ps
curl -I https://hanbaodoudou.com
curl -I https://www.hanbaodoudou.com
curl https://api.hanbaodoudou.com/health
```

## API 端点

| 方法 | 路径 | 说明 | 需要密钥 |
|------|------|------|---------|
| GET | `/health` | 健康检查 | 否 |
| GET | `/api/milestones` | 获取里程碑 | 否 |
| POST | `/api/milestones` | 创建里程碑 | 是 |
| PUT | `/api/milestones/:id` | 更新里程碑 | 是 |
| DELETE | `/api/milestones/:id` | 删除里程碑 | 是 |
| GET | `/api/moments` | 获取瞬间 | 否 |
| POST | `/api/moments` | 创建瞬间 | 是 |
| DELETE | `/api/moments/:id` | 删除瞬间 | 是 |
| GET | `/api/comments` | 获取留言 | 否 |
| POST | `/api/comments` | 提交留言 | 否 |
| DELETE | `/api/comments/:id` | 删除留言 | 是 |
| GET | `/api/letters` | 获取信件 | 否 |
| POST | `/api/letters` | 创建信件 | 是 |
| DELETE | `/api/letters/:id` | 删除信件 | 是 |

写接口需要请求头：

```text
x-api-key: <ADMIN_API_KEYS 中的任意一个>
```

## 备份建议

- 数据库：使用 `sqlite3 .backup` 导出快照
- 上传目录：使用 `rsync`
- NAS 方案：见项目根目录 [DEPLOY_NAS.md](../DEPLOY_NAS.md)

## 注意事项

- SQLite 主库保持在 ECS 本地磁盘，不要直接放到 NAS / NFS。
- 不要把 `.env` 或管理员密钥写入仓库。
- `server/deploy/cloud/` 中的配置应与线上 Caddy 容器保持一致。

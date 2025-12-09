# QQ Story 后端服务

Node.js + Express + SQLite 后端，为 QQ Story 前端提供 REST API 和文件上传功能。

## 架构概览

```
浏览器 ─HTTPS─> api.hanbaodoudou.com (Caddy Docker)
                        │
                        └──> localhost:8080 (PM2 + Express)
                                    ├── SQLite 数据库
                                    └── uploads/ 文件存储
```

当前生产环境运行在阿里云 ECS (Ubuntu) 上：
- **PM2** 管理 Node.js 进程
- **Caddy** (Docker) 提供反向代理和自动 HTTPS
- **SQLite** 持久化数据
- **uploads/** 存储上传的图片、视频和 PDF

## 快速开始

### 1. 安装依赖

```bash
cd server
npm install
```

### 2. 配置环境变量

```bash
cp env.example .env
nano .env
```

主要配置项：

```ini
PORT=8080
NODE_ENV=production
ADMIN_API_KEYS=你的安全密钥（建议32位以上随机字符串）
DATABASE_FILE=database/qq_story.db
UPLOAD_DIR=uploads
ALLOWED_ORIGINS=https://hanbaodoudou.com,https://www.hanbaodoudou.com,https://api.hanbaodoudou.com
MAX_UPLOAD_SIZE_MB=100
RATE_LIMIT_WINDOW_MINUTES=15
RATE_LIMIT_MAX_REQUESTS=300
```

### 3. 启动服务

**开发模式：**
```bash
npm run dev
```

**生产模式（PM2）：**
```bash
# 首次启动
pm2 start ecosystem.config.cjs

# 或直接启动
pm2 start src/app.js --name qq-story-api

# 保存配置（开机自启）
pm2 save
pm2 startup
```

### 4. 验证服务

```bash
curl http://localhost:8080/health
# 返回: {"status":"ok","timestamp":"..."}
```

## API 端点

| 方法 | 路径 | 说明 | 需要密钥 |
|------|------|------|---------|
| GET | `/health` | 健康检查 | ❌ |
| GET | `/api/milestones` | 获取里程碑列表 | ❌ |
| POST | `/api/milestones` | 创建里程碑 | ✅ |
| PUT | `/api/milestones/:id` | 更新里程碑 | ✅ |
| DELETE | `/api/milestones/:id` | 删除里程碑 | ✅ |
| GET | `/api/moments` | 获取瞬间列表 | ❌ |
| POST | `/api/moments` | 创建瞬间 | ✅ |
| DELETE | `/api/moments/:id` | 删除瞬间 | ✅ |
| GET | `/api/comments` | 获取留言列表 | ❌ |
| POST | `/api/comments` | 发表留言 | ❌ |
| DELETE | `/api/comments/:id` | 删除留言 | ✅ |
| GET | `/api/letters` | 获取信件列表 | ❌ |
| POST | `/api/letters` | 创建信件 | ✅ |
| DELETE | `/api/letters/:id` | 删除信件 | ✅ |

> 需要密钥的接口需在请求头中携带 `x-api-key: 你的ADMIN_API_KEY`

## 部署到阿里云 ECS

### 1. 服务器准备

```bash
# 安装 Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 安装 PM2
sudo npm install -g pm2

# 安装 Docker（用于 Caddy）
sudo apt install -y docker.io docker-compose-plugin
sudo systemctl enable docker --now
```

### 2. 部署代码

```bash
cd ~
git clone https://github.com/你的用户名/QQ_page.git
cd QQ_page/server
npm install
npm rebuild better-sqlite3  # 重新编译原生模块

# 配置环境变量
cp env.example .env
nano .env
```

### 3. 启动后端服务

```bash
# 使用 ecosystem 配置启动（推荐）
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup

# 查看状态
pm2 list
pm2 logs qq-story-api
```

### 4. 配置 Caddy 反向代理

```bash
cd ~/QQ_page/server/deploy/cloud

# 创建环境变量文件
echo "CADDY_ADMIN_EMAIL=你的邮箱@example.com" > .env

# 启动 Caddy
docker compose up -d
```

Caddyfile 配置示例：

```caddyfile
api.hanbaodoudou.com {
    encode zstd gzip
    reverse_proxy 172.17.0.1:8080 {
        health_uri /health
        health_interval 30s
    }
}
```

### 5. DNS 配置

在域名控制台添加 A 记录：
- `api.hanbaodoudou.com` → ECS 公网 IP

## PM2 常用命令

```bash
pm2 list                    # 查看进程列表
pm2 logs qq-story-api       # 查看日志
pm2 restart qq-story-api    # 重启服务
pm2 stop qq-story-api       # 停止服务
pm2 delete qq-story-api     # 删除进程
pm2 monit                   # 监控面板
```

## 故障排查

### 服务无法启动

```bash
# 查看详细日志
pm2 logs qq-story-api --lines 50

# 检查端口占用
netstat -tlnp | grep 8080

# 检查环境变量
pm2 env 0
```

### better-sqlite3 错误

```bash
# 重新编译原生模块
cd ~/QQ_page/server
npm rebuild better-sqlite3
pm2 restart qq-story-api
```

### API 返回 500 错误

```bash
# 检查 .env 配置
cat .env

# 确保 ADMIN_API_KEYS 已配置
grep ADMIN_API_KEYS .env
```

### Caddy 无法连接后端

```bash
# 检查后端是否在监听
curl http://127.0.0.1:8080/health

# 检查 Docker 网络
docker exec cloud-caddy-1 curl http://172.17.0.1:8080/health
```

## 备份

定期备份以下内容：

```bash
# 数据库
cp ~/QQ_page/server/database/qq_story.db ~/backup/

# 上传文件
rsync -av ~/QQ_page/server/uploads/ ~/backup/uploads/
```

## 可选：NAS 存储

如需将文件存储到私有 NAS，请参考项目根目录的 `DEPLOY_NAS.md`。

主要步骤：
1. 在 ECS 和 NAS 上安装 Tailscale 组网
2. 通过 NFS 挂载 NAS 目录到 ECS
3. 修改 `.env` 中的 `UPLOAD_DIR` 指向挂载点

---

如有问题，欢迎提 Issue 或联系维护者。

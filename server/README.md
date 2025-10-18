# QQ Story 后端（NAS + 公网代理）

该后端负责为 QQ Story 前端提供统一的 REST API、文件上传与数据存储能力。代码运行在 NAS 上，通过 SQLite 持久化结构化数据，通过 `uploads/` 目录保存 PDF、图片和视频。本版本按照 **方案 A + 方案 C** 改造，使用「云服务器 + 反向代理」负责公网入口，再借助内网穿透（frp）安全地把流量回穿至家庭 NAS。

---

## 架构总览（方案 A + C）

- 静态前端：继续托管在 GitHub Pages (`https://hanbaodoudou.com`)。
- 云服务器（拥有固定公网 IP）：部署 Caddy 反向代理与 frps，负责 TLS 证书、日志、WAF/防火墙。
- 家庭 NAS：运行 QQ Story 后端（Express + SQLite）与 frpc，通过 frp 隧道把 8080 端口映射到云服务器的本地回环地址。
- Tailscale/WireGuard（可选）：在云服务器与 NAS 之间建立运维用的内网互联，便于 SSH/文件同步。

数据流如下：

```
浏览器  ─HTTPS─>  api.hanbaodoudou.com (Caddy) ──> frps ─隧道─> frpc ─> NAS 上的 Express
                                                               └──> NAS /uploads 静态文件
```

---

## 目录结构速览

```
server/
├── Dockerfile
├── docker-compose.yml          # NAS 侧运行 QQ Story 的 Compose
├── deploy/
│   ├── cloud/
│   │   ├── Caddyfile           # 云服务器 Caddy 配置
│   │   ├── docker-compose.yml  # Caddy + frps 组合
│   │   └── frps.ini            # frps 配置模板
│   └── nas/
│       └── frpc.ini            # NAS 侧 frpc 配置模板
├── src/                        # Express 源码
├── database/                   # SQLite 文件（挂载卷）
├── uploads/                    # 上传的媒体/PDF（挂载卷）
└── logs/                       # 日志输出
```

---

## 环境变量 (`server/.env`)

```ini
PORT=8080
NODE_ENV=production
DATABASE_FILE=/app/database/qq_story.db
UPLOAD_DIR=/app/uploads
LOG_DIR=/app/logs
ADMIN_API_KEY=请替换为长度≥32的随机字符串
ALLOWED_ORIGINS=https://hanbaodoudou.com,https://www.hanbaodoudou.com,https://hanbaodoudou.github.io,http://localhost:4173
MAX_UPLOAD_SIZE_MB=20
RATE_LIMIT_WINDOW_MINUTES=15
RATE_LIMIT_MAX_REQUESTS=100
```

> ⚠️ `ADMIN_API_KEY` 只用于管理员写入操作，请妥善保密；仅允许来自前端域名的跨域请求。

---

## 部署步骤总览

### 1. 准备云服务器（方案 A）

1. 选择一台国外/国内云厂商的 Ubuntu 22.04 LTS，获取固定公网 IP。
2. 安装必要组件：
   ```bash
   sudo apt update && sudo apt install -y git docker.io docker-compose-plugin fail2ban
   sudo systemctl enable docker --now
   ```
3. （推荐）安装 Tailscale 或 WireGuard，便于与 NAS 建立安全内网，示例：
   ```bash
   curl -fsSL https://tailscale.com/install.sh | sh
   sudo tailscale up --ssh
   ```
4. 关闭除 `22/80/443/7000` 以外的所有入站端口，或在云防火墙中手动放行这四个端口。

### 2. 在云服务器部署 Caddy + frps（方案 C）

1. 克隆项目（或仅复制 `server/deploy/cloud` 文件夹）：
   ```bash
   git clone https://github.com/<your-fork>/QQ_page.git
   cd QQ_page/server/deploy/cloud
   ```
2. 编辑 `frps.ini`：
   - 把 `token` 改成长度 ≥ 32 的随机字符串。
   - 如果需要限制 NAS IP，可在云厂商防火墙上针对 `7000` 端口做白名单。
3. 创建 `.env` 文件（供 docker compose 读取）：
   ```bash
   cat <<'EOF' > .env
   CADDY_ADMIN_EMAIL=contact@hanbaodoudou.com   # 用于 ACME 注册，可替换
   EOF
   ```
4. 创建日志目录并启动：
   ```bash
   mkdir -p logs
   docker compose up -d
   docker compose logs -f frps
   ```
5. 在 DNS 控制台中，把 `api.hanbaodoudou.com` 的 A 记录指向云服务器公网 IP。等待生效后，Caddy 会自动签发 Let’s Encrypt 证书。

### 3. NAS 侧部署 frpc（方案 C）

1. 将 `server/deploy/nas/frpc.ini` 拷贝到 NAS（例如 `/volume1/docker/frp/frpc.ini`）。
2. 根据实际情况修改：
   - `server_addr`：云服务器公网 IP。
   - `token`：与 frps 相同。
   - `remote_port`：与 Caddy 配置中转发的目标端口保持一致（本文默认 `18080`）。
3. 使用容器或二进制运行 `frpc`（以容器为例）：
   ```bash
   docker run -d \
     --name frpc \
     --restart=unless-stopped \
     -v /volume1/docker/frp/frpc.ini:/etc/frp/frpc.ini:ro \
     -v /volume1/docker/frp/logs:/var/log/frp \
     fatedier/frpc:0.53.2 \
     -c /etc/frp/frpc.ini
   ```
4. 日志位于 `/volume1/docker/frp/logs/frpc.log`，可用 `docker logs -f frpc` 查看。

> 可选：若 NAS 支持 Cloudflare Tunnel，亦可用 `cloudflared` 取代 frp，只需把 Caddy 的 upstream 改成 Cloudflare 回环端口。

### 4. NAS 侧部署 QQ Story 后端

1. 进入项目 `server/` 目录，复制环境变量并编辑：
   ```bash
   cd /volume1/hanbaodoudou/server
   cp .env.example .env
   nano .env   # 设置 ADMIN_API_KEY 等
   ```
2. 首次启动：
   ```bash
   docker compose up -d --build
   ```
3. 验证：
   ```bash
   curl http://127.0.0.1:8080/health
   curl http://127.0.0.1:8080/api/milestones
   ```
4. 确保 NAS 防火墙关闭 8080 的外网暴露，仅允许本地访问。

### 5. 前端对接与密钥管理

1. `docs/js/api.config.js` 已更新为：
   - 自动根据域名选择默认 API 地址（本地 → `http://localhost:8080/api`，线上 → `https://api.hanbaodoudou.com/api`）。
   - 增加 `window.QQStoryApi.setAdminKey(key, { persist: 'session' | 'local' | 'memory' })` 用于在浏览器内注入管理员密钥，并可存入 SessionStorage/LocalStorage。
2. 管理员流程建议：
   - 先在页面右上角打开浏览器控制台执行：
     ```js
     window.QQStoryApi.setAdminKey('实际的 ADMIN_API_KEY', { persist: 'session' });
     ```
   - 再输入前端 Story Manager 的解锁密码（仅作 UI 防护），即可执行写操作。
   - 操作结束后执行 `window.QQStoryApi.clearStoredAdminKey()` 或关闭浏览器窗口。
3. 每次更新 GitHub Pages 静态站点时，请确认 `docs/js/api.config.js` 已随之发布。

---

## 运维与安全建议

- **访问控制**：Caddy 负责 TLS 与 HSTS，必要时可接入 Cloudflare/WAF；frps 只允许 frpc 所在 IP 连接。
- **日志与监控**：
  - Caddy 日志保存于云服务器 `server/deploy/cloud/logs/`。
  - Express 访问日志写入 NAS `server/logs/access.log`。
- **备份策略**：
  - 定期备份 `server/database/qq_story.db` 与整个 `uploads/`。
  - 建议使用 NAS 自带快照或 `rclone` 同步到对象存储。
- **升级流程**：
  ```bash
  # NAS
  git pull
  docker compose build
  docker compose up -d

  # 云服务器（如更新 Caddy/FRP 配置）
  cd server/deploy/cloud
  docker compose pull
  docker compose up -d
  ```
- **故障排查**：
  - `docker compose logs -f`（NAS/云服务器）。
  - `curl https://api.hanbaodoudou.com/health` 检查公网链路。
  - 确认 `frpc` 状态：`docker exec -it frpc frpc status`.

---

## 开发与测试

```bash
cd server
npm install
npm run migrate
npm run dev   # http://localhost:8080
```

本地调试时，前端会自动使用 `http://localhost:8080/api`。记得根据需要执行 `window.QQStoryApi.setAdminKey(...)`。

---

如需扩展登录体系、内容审核或自动备份脚本，欢迎继续提出需求。祝部署顺利 🚀

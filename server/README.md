# QQ Story 后端（部署在绿联 NAS）

这个后端用来取代网页原先依赖的 `localStorage`，把里程碑、精选瞬间、留言和情书统一保存到 NAS 上。  
整体架构：**Node.js + Express + SQLite**，配合 Docker 一键部署；文件（PDF/图片/视频）保存在磁盘的 `uploads` 目录。

---

## 1. 功能概览

- `/api/*` REST 接口供前端调用  
- SQLite 数据库存储结构化内容  
- 上传文件落盘，提供静态访问地址  
- 通过环境变量配置、API Key 鉴权  
- 适配 UGREEN NAS 的 Docker Compose

---

## 2. NAS 端准备

1. 在 NAS 管理界面开启 **Docker / Docker Compose**。  
2. 将本项目拷贝到 NAS（例如 `/volume1/hanbaodoudou`）。  
3. 确保端口（默认 `8080`）可用，或根据需要更改。  
4. 建议：  
   - 使用 NAS 的反向代理/HTTPS（Nginx、Caddy、Traefik 等）。  
   - 给运行目录单独分配权限。  
   - 外网访问时最好配合 VPN 或白名单。

---

## 3. 文件结构说明

```
server/
├── Dockerfile                # 镜像构建
├── docker-compose.yml        # 部署编排
├── .env.example              # 环境变量示例
├── package.json / lock 文件
├── src/
│   ├── app.js                # 入口
│   ├── config.js / db.js / migrate.js
│   ├── routes/               # API 路由
│   └── services/ 等工具
├── uploads/                  # 上传文件（挂载卷）
├── database/                 # SQLite 数据库（挂载卷）
└── logs/                     # 访问日志（挂载卷）
```

---

## 4. 配置步骤

1. 复制环境变量模板：
   ```bash
   cd server
   cp .env.example .env
   ```
2. 编辑 `.env`：  
   - `ADMIN_API_KEY`：设置较长的随机字符串，写入权限需要它。  
   - `ALLOWED_ORIGINS`：允许的前端域名，多个用逗号分隔。  
   - 如有需要可调整 `PORT`、`DATABASE_FILE`、`UPLOAD_DIR` 等。
3. 可选：如果想在宿主机直接运行（不用 Docker）：
   ```bash
   npm install
   npm run migrate
   npm start
   ```

---

## 5. Docker Compose 部署

```bash
cd /path/to/hanbaodoudou/server
docker compose up -d --build      # 首次启动
```

检查状态：
```bash
docker compose ps
curl http://<NAS-IP>:8080/health
```

目录挂载含义：
- `database/qq_story.db`：SQLite 数据文件  
- `uploads/`：上传的媒体、PDF  
- `logs/access.log`：HTTP 访问日志

更新版本时：
```bash
git pull
docker compose build
docker compose up -d
```

---

## 6. 前端对接

在 `docs/js/api.config.js` 中设置：
```js
window.QQStoryApi.baseUrl = 'https://你的域名或IP/api';
window.QQStoryApi.adminKey = '与 .env 中一致的 ADMIN_API_KEY';
```

重新部署静态站点（如 GitHub Pages）后，前端会从 NAS 获取/提交数据。  
⚠️ API Key 暴露在前端代码中，务必结合网络访问限制、HTTPS、防火墙或账号保护使用。

---

## 7. 主要接口速查

| 方法 | 路径 | 是否需要 API Key | 说明 |
| ---- | ---- | ---------------- | ---- |
| GET  | `/api/milestones` | 否 | 获取里程碑列表 |
| POST | `/api/milestones` | 是 | 新增里程碑 |
| PUT  | `/api/milestones/:id` | 是 | 更新里程碑 |
| DELETE | `/api/milestones/:id` | 是 | 删除里程碑 |
| GET  | `/api/moments` | 否 | 获取瞬间列表 |
| POST | `/api/moments` | 是 | 新增瞬间（需传 base64 媒体） |
| DELETE | `/api/moments/:id` | 是 | 删除瞬间 |
| GET  | `/api/letters` | 否 | 获取情书（支持 `?writer=`） |
| POST | `/api/letters` | 是 | 上传 PDF 情书 |
| DELETE | `/api/letters/:id` | 是 | 删除情书 |
| GET  | `/api/comments` | 否 | 留言分页列表 |
| POST | `/api/comments` | 否 | 提交留言（有频率限制） |
| DELETE | `/api/comments/:id` | 是 | 删除留言 |
| POST | `/api/comments/:id/hide` | 是 | 隐藏留言 |
| GET  | `/health` | 否 | 健康检查 |

认证方式：请求头传 `x-api-key: <ADMIN_API_KEY>` 或 `Authorization: Bearer <ADMIN_API_KEY>`。

---

## 8. 数据迁移建议

1. 如需保留旧数据，可在迁移前导出浏览器 `localStorage` 中的 `storyManagerData`。  
2. 后端部署后，通过 Story Manager 页面重新录入（表单已经改为调用 API）。  
3. 上传的媒体将存放在 `uploads/` 下，后端会返回可访问的 URL。

---

## 9. 备份与运维

- 定期备份 `database/qq_story.db`。  
- 同步/备份 `uploads/` 目录到其他盘或云端。  
- 查看日志：`docker compose logs -f` 或直接查看 `logs/access.log`。  
- 建议设置 NAS 定时任务做增量备份。

---

## 10. 安全提示

- 使用 HTTPS 并限制访问来源（白名单 / VPN）。  
- 谨慎保存和传输 `ADMIN_API_KEY`。  
- 生产环境关闭多余端口；只保留健康检查和 API 必需的端口。  
- 发现异常日志及时处理。

---

## 11. 本地开发调试（可选）

```bash
cd server
npm install
npm run migrate
npm run dev
```

此时服务监听 `http://localhost:8080`，前端 `api.config.js` 设置为本地地址即可调试。

---

部署完成后，刷新前端页面即可看到最新数据都来自 NAS。需要进一步增强安全、完善权限或写导入脚本时，欢迎继续沟通。祝使用愉快! 🎉

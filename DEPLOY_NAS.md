# NAS 接入方案

当前推荐方案不是“把 NAS 直接挂成线上主存”，而是：

```text
用户请求 -> ECS 在线服务
数据写入 -> ECS 本地盘
定时同步 -> 家里 NAS
```

这样可以同时满足两件事：

- 线上访问稳定，尽量不受家庭网络波动影响
- 照片、视频、数据库备份最终都进入自己的 NAS

## 为什么不推荐直接挂 NAS

- 家庭网络和 NAS 重启会直接影响线上可用性
- SQLite 不适合放到 NFS/NAS 上做在线主库
- 上传和媒体读取都会依赖家里上行带宽

因此当前建议是：

- `UPLOAD_DIR` 继续使用 ECS 本地目录：`/srv/qq-story/uploads`
- 数据库继续使用 ECS 本地目录：`/srv/qq-story/data/qq_story.db`
- NAS 通过 `Tailscale + SSH + rsync` 做同步备份

## 推荐拓扑

```text
ECS
  ├─ /srv/qq-story/data/qq_story.db
  ├─ /srv/qq-story/uploads/
  └─ Tailscale
         |
         v
家里 NAS
  └─ /volume1/web_backup/qq_story/
       ├─ database/
       └─ uploads/
```

## 步骤 1：安装 Tailscale

### ECS

```bash
curl -fsSL https://tailscale.com/install.sh | sh
tailscale up
tailscale ip -4
```

### NAS

- 群晖 / 威联通直接安装 Tailscale 应用
- 登录同一个账号
- 记录 NAS 的 Tailscale IPv4 地址

## 步骤 2：准备 NAS 备份目录和账号

在 NAS 上创建目录，例如：

```text
/volume1/web_backup/qq_story
```

建议结构：

```text
/volume1/web_backup/qq_story/
├── database/
└── uploads/
```

同时：

- 开启 NAS 的 SSH 服务
- 创建一个专用备份账号，例如 `backup`
- 只给该目录读写权限

## 步骤 3：在 ECS 上配置 SSH 免密

```bash
ssh-keygen -t ed25519 -f ~/.ssh/qq_story_nas -N ""
```

把公钥追加到 NAS 备份账号的 `authorized_keys`。

首次联通测试：

```bash
ssh -i ~/.ssh/qq_story_nas backup@<NAS_TAILSCALE_IP>
```

## 步骤 4：创建同步脚本

建议脚本路径：

```text
/usr/local/bin/qq-story-sync-to-nas.sh
```

示例脚本：

```bash
#!/usr/bin/env bash
set -euo pipefail

NAS_HOST="<NAS_TAILSCALE_IP>"
NAS_USER="backup"
NAS_ROOT="/volume1/web_backup/qq_story"

DB="/srv/qq-story/data/qq_story.db"
UPLOADS="/srv/qq-story/uploads"
TMP="/tmp/qq-story-backup"
SSH_KEY="/root/.ssh/qq_story_nas"

mkdir -p "$TMP"
sqlite3 "$DB" ".backup '$TMP/qq_story.db'"

rsync -az --delete -e "ssh -i $SSH_KEY" \
  "$UPLOADS/" "${NAS_USER}@${NAS_HOST}:${NAS_ROOT}/uploads/"

rsync -az -e "ssh -i $SSH_KEY" \
  "$TMP/qq_story.db" "${NAS_USER}@${NAS_HOST}:${NAS_ROOT}/database/"
```

赋予执行权限：

```bash
chmod +x /usr/local/bin/qq-story-sync-to-nas.sh
```

## 步骤 5：配置定时任务

例如每天凌晨 3 点同步：

```bash
crontab -e
```

加入：

```cron
0 3 * * * /usr/local/bin/qq-story-sync-to-nas.sh >> /var/log/qq-story-sync.log 2>&1
```

## 步骤 6：恢复验证

不要只看同步日志，至少做一次真实恢复验证：

- 在 NAS 上确认 `database/qq_story.db` 已生成
- 在 NAS 上确认 `uploads/` 有最新文件
- 抽查一张图片和一条评论数据是否能恢复

## 可选高级方案

如果未来确定要让 ECS 实时访问 NAS 文件，可以再评估：

- `Tailscale + NFS` 挂载媒体目录
- 只挂媒体，不挂 SQLite 数据库

这不是当前推荐默认方案，除非已经接受家庭网络波动会影响线上访问。

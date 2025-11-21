# NAS 存储与加速部署指南

为了实现**存储空间最大化**和**访问速度最优化**，本指南介绍了如何将阿里云 ECS 与您的 NAS 结合使用。

## 架构说明

1.  **存储**：所有大文件（照片、PDF、视频）实际存储在您的 NAS 上。
2.  **连接**：ECS 通过 Tailscale (VPN) 安全地挂载 NAS 的目录。
3.  **加速 (可选)**：通过配置 `MEDIA_BASE_URL`，可以让用户直接从 NAS (需公网访问) 下载资源，绕过 ECS 的带宽瓶颈。

## 步骤 1: 在 ECS 和 NAS 上安装 Tailscale

这是最安全且简单的组网方式。

1.  **注册 Tailscale**: 访问 [tailscale.com](https://tailscale.com) 注册账号。
2.  **NAS 安装**: 在群晖/威联通的应用商店搜索并安装 Tailscale，登录账号。
3.  **ECS 安装**:
    ```bash
    curl -fsSL https://tailscale.com/install.sh | sh
    sudo tailscale up
    ```
    登录后，你会看到 ECS 和 NAS 都在 Tailscale 的控制台里，并且有 `100.x.x.x` 的内网 IP。

## 步骤 2: 配置 NAS 共享 (NFS)

以群晖为例：
1.  **控制面板** -> **文件服务** -> **NFS** -> 勾选 **启用 NFS 服务**。
2.  **控制面板** -> **共享文件夹** -> 选择你存放照片的文件夹 (例如 `web_uploads`) -> **编辑** -> **NFS 权限**。
3.  **新增**:
    *   **服务器 IP**: 输入 ECS 的 Tailscale IP (例如 `100.64.0.5`)。
    *   **权限**: 读写。
    *   **Squash**: 映射所有用户为 admin (简化权限问题，或者配置为具体用户)。

## 步骤 3: 在 ECS 上挂载 NAS

1.  **安装 NFS 客户端**:
    ```bash
    sudo apt-get update && sudo apt-get install nfs-common
    ```
2.  **创建挂载点**:
    假设你的代码在 `/home/user/QQ_page`，我们要把上传目录指出去。
    ```bash
    # 只要创建一个空目录作为挂载点
    sudo mkdir -p /mnt/nas_uploads
    ```
3.  **挂载**:
    ```bash
    # 格式: mount -t nfs [NAS_TAILSCALE_IP]:[NAS_PATH] [LOCAL_PATH]
    sudo mount -t nfs 100.x.x.x:/volume1/web_uploads /mnt/nas_uploads
    ```
4.  **验证**:
    ```bash
    df -h
    # 应该能看到 NAS 的容量
    touch /mnt/nas_uploads/test.txt
    # 检查 NAS 上是否出现了 test.txt
    ```

## 步骤 4: 配置后端服务

现在我们需要告诉 Node.js 程序把文件写到 `/mnt/nas_uploads`。

在 `server/.env` 文件中添加或修改：

```env
# 这里填刚才挂载的路径
UPLOAD_DIR=/mnt/nas_uploads

# (高级选项) 如果你的 NAS 有公网访问能力 (例如 nas.liuyizhouye.com)，
# 配置这个可以让用户直接从 NAS 下载图片，速度更快！
# 如果不配置，流量依然走 ECS 中转。
# MEDIA_BASE_URL=https://nas.liuyizhouye.com/uploads
```

重启后端服务：
```bash
cd server
npm run start
```

## 自动挂载 (防止重启失效)

编辑 `/etc/fstab` 添加一行：
```
100.x.x.x:/volume1/web_uploads  /mnt/nas_uploads  nfs  defaults  0  0
```
注意：因为依赖 Tailscale 网络，可能需要配置 systemd 等待网络就绪。

## 故障排查

- **权限问题**: 确保 ECS 上的运行用户有权限写入 `/mnt/nas_uploads`。最简单的方法是 `chmod 777 /mnt/nas_uploads`。
- **网络不通**: 确保 Tailscale 在两端都显示 Connected。


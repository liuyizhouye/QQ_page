# 图片和文件访问问题修复说明

## 问题原因

之前其他设备无法看到上传的图片和文件的原因是：
1. **图片 URL 是相对路径**：API 返回的图片 URL 是 `/uploads/moments/xxx.jpg`（相对路径）
2. **前端访问错误域名**：浏览器会将相对路径解析为当前域名（`hanbaodoudou.com`），但文件实际存储在 `api.hanbaodoudou.com` 上
3. **结果**：访问 `https://hanbaodoudou.com/uploads/...` 会 404，因为文件不在那里

## 已修复

✅ **前端 URL 转换**：添加了 `resolveMediaUrl()` 函数，自动将相对路径转换为完整的 API URL

✅ **修复范围**：
- Moments 图片和视频
- Love Notes PDF 文件
- 所有 `/uploads/` 路径的文件

## 技术实现

### 前端自动转换

```javascript
// 相对路径：/uploads/moments/xxx.jpg
// 自动转换为：https://api.hanbaodoudou.com/uploads/moments/xxx.jpg
```

### 处理逻辑

1. 如果 URL 已经是完整 URL（`http://`、`https://`、`data:`），直接返回
2. 如果是相对路径（以 `/uploads/` 开头），转换为 API 域名
3. 自动从 `window.QQStoryApi.baseUrl` 获取 API 地址

## 使用说明

### 1. 推送代码到 GitHub

```bash
git push
```

### 2. 等待 GitHub Pages 更新（约 3-5 分钟）

### 3. 清除浏览器缓存并刷新

- **Mac**: `Command + Shift + R`
- **Windows/Linux**: `Ctrl + Shift + R`

### 4. 验证修复

1. 在其他设备上访问网站
2. 检查 Moments 区域的图片是否正常显示
3. 检查 Love Notes 的 PDF 是否可以下载
4. 打开浏览器开发者工具（F12）→ Network 标签
5. 查看图片请求的 URL，应该是 `https://api.hanbaodoudou.com/uploads/...`

## 后端配置（可选但推荐）

为了更好的性能和一致性，建议在 ECS 的 `.env` 文件中设置：

```bash
MEDIA_BASE_URL=https://api.hanbaodoudou.com
```

这样 API 返回的 URL 就是完整的绝对路径，前端不需要转换。

### 设置步骤

1. SSH 登录到 ECS
2. 编辑 `.env` 文件：
   ```bash
   cd ~/QQ_page/server
   nano .env
   ```
3. 添加或修改：
   ```ini
   MEDIA_BASE_URL=https://api.hanbaodoudou.com
   ```
4. 重启后端服务：
   ```bash
   pm2 restart qq-story-api
   ```

## 注意事项

- 修复后，所有设备都能正常访问图片和文件
- 如果仍然无法显示，请检查：
  1. ECS 上的后端服务是否正常运行
  2. Caddy 是否正确配置了 `/uploads` 静态文件服务
  3. 文件是否真的上传到了服务器

## 验证后端配置

在 ECS 上运行以下命令检查：

```bash
# 检查文件是否存在
ls -lh ~/QQ_page/server/uploads/moments/

# 检查 Caddy 配置
cat ~/QQ_page/server/deploy/cloud/Caddyfile

# 测试文件访问
curl -I https://api.hanbaodoudou.com/uploads/moments/某个文件名.jpg
```

如果返回 200 OK，说明配置正确。


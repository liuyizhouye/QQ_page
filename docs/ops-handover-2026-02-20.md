# 运维续办交接文档（2026-02-20）

更新时间：2026-02-20  
适用目标：5-7 天后可直接按本文继续，不需要回看聊天记录。

## 背景与目标
当前站点为前后端分离部署，目标是在不改业务架构前提下恢复并稳定 API 公网访问。  
本文件用于记录截至 2026-02-20 的确认现状、已完成动作、未完成动作与可直接执行命令。

## 当前架构（确认版）
- 前端：`https://hanbaodoudou.com`（GitHub Pages，`docs/` 发布）。
- 后端：`api.hanbaodoudou.com` -> 阿里云 ECS（`47.115.72.187`）-> Caddy(80/443) -> Node.js/PM2(`127.0.0.1:8080`)。
- 存储路线：继续坚持 `ECS（大陆）+ NAS 存储` 路线，本轮未做 NAS 数据迁移。
- DNS（当前确认）：
  - `@` -> `185.199.108.153 / 185.199.109.153 / 185.199.110.153 / 185.199.111.153`
  - `www` -> `liuyizhouye.github.io`
  - `api` -> `47.115.72.187`

## 已完成事项（到 2026-02-20）
1. 已确认主站 `https://hanbaodoudou.com` 可访问，响应来自 GitHub Pages。
2. 已将 `www` CNAME 调整为 `liuyizhouye.github.io`。
3. 已在 ECS 确认后端本机服务正常：
   - PM2 进程 `qq-story-api` 在线；
   - `curl http://127.0.0.1:8080/health` 返回正常 JSON；
   - Caddy 容器监听 80/443。
4. 已在 GoDaddy 完成域名解锁并拿到 EPP/Auth code。
5. 已确认路线为“域名转入阿里云后备案”。

## 当前问题与证据
1. 主站可访问：`https://hanbaodoudou.com` 返回 200（GitHub Pages）。
2. `www` 仍有证书不匹配（截至 2026-02-20 07:23 UTC）。
3. API 现象（已实测）：
   - ECS 本机 `127.0.0.1:8080/health` 正常；
   - ECS 本机经 443 访问 `api.hanbaodoudou.com` 正常；
   - 外部网络访问 `api.hanbaodoudou.com:443` 被 reset。
4. 阿里云备案系统当前无备案主体/无网站备案信息（截图已确认）。

## 根因判断
1. API 进程与 Caddy 反向代理在 ECS 内部是通的，不是应用崩溃问题。
2. 域名在 GoDaddy，且阿里云备案向导已提示注册商未获工信部批复，不允许直接提交备案。
3. 在“无备案主体/无网站备案”的状态下，大陆公网链路对 `api` 存在受限风险，表现为外网 443 reset。

## 已确定路线
1. 保持 `ECS（大陆）+ NAS 存储` 方向，不迁移海外节点。
2. 先将域名 `hanbaodoudou.com` 从 GoDaddy 转入阿里云（万网）。
3. 转入完成后，以个人主体在阿里云完成 ICP 备案。
4. 备案通过后复测 API 公网 HTTPS。

## 5-7天后回来先做什么（按顺序）
1. 在 GoDaddy 重新生成 EPP（此前已泄露于截图）。
2. 阿里云发起域名转入（`hanbaodoudou.com` + EPP，保持 DNS/NS 不改）。
3. 在 GoDaddy/注册邮箱确认转出。
4. 等待转入完成（一般 5-7 天）。
5. 转入完成后在阿里云发起 ICP 备案（个人主体）。
6. 备案通过后复测 `api` 外网 HTTPS。

## 验证命令（可直接复制）
```bash
dig +short hanbaodoudou.com A
dig +short www.hanbaodoudou.com CNAME
dig +short api.hanbaodoudou.com A

curl -I https://hanbaodoudou.com
curl -I https://www.hanbaodoudou.com
curl -v https://api.hanbaodoudou.com/health

# ECS 内
curl -sS http://127.0.0.1:8080/health
curl -kIv --resolve api.hanbaodoudou.com:443:127.0.0.1 https://api.hanbaodoudou.com/health
pm2 list
docker ps
```

## 风险与注意事项
1. EPP 已曝光需重置：请在继续转入前重新生成新 EPP，不要复用旧值。
2. 转入期间不改 NS：保持当前 DNS/NS，避免主站和现有解析中断。
3. 本文不保存敏感明文：不要把密码、EPP、私钥写入仓库。
4. `*** System restart required ***` 属于系统更新提示，与本次域名转入和备案流程非强耦合，可单独安排维护窗口处理。

## 完成标准（DoD）
1. `www` 证书匹配且能正常 HTTPS。
2. 外网 `https://api.hanbaodoudou.com/health` 返回 200 JSON。
3. 前端调用 API 无 TLS/CORS 报错。
4. 备案状态在阿里云可见为已备案。

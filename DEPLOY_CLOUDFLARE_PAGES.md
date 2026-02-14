# Taroria 上线指南（Cloudflare Pages 免费版）

本项目是纯静态站点（HTML/CSS/JS + assets），最适合直接用 Cloudflare Pages 免费托管。

## 1. 准备代码仓库

1. 把当前目录推到 GitHub（或 GitLab）仓库。
2. 确保以下文件在仓库根目录：
   - `index.html`
   - `draw.html`
   - `daily.html`
   - `three.html`
   - `404.html`
   - `tarot-deck.js`
   - `assets/`
   - `_headers`

## 2. 在 Cloudflare Pages 创建项目

1. 打开 Cloudflare Dashboard -> `Workers & Pages` -> `Create` -> `Pages`。
2. 选择 `Connect to Git`，连接你的代码仓库。
3. 选择仓库后，构建设置如下：
   - Framework preset: `None`
   - Build command: 留空
   - Build output directory: `/` 或 `.`
4. 点击 `Save and Deploy`。

## 3. 验证部署结果

部署完成后，先检查：

1. 首页是否可访问。
2. 路径是否都正常：
   - `/draw.html`
   - `/daily.html`
   - `/three.html`
3. 随机输入一个不存在路径（例如 `/abc`）应显示 `404.html`。

## 4. 绑定自定义域名（可选）

1. 进入 Pages 项目 -> `Custom domains` -> `Set up a custom domain`。
2. 输入你的域名并按引导添加 DNS 记录。
3. Cloudflare 会自动签发 HTTPS 证书。

## 5. 后续更新

以后只要向主分支 `git push`，Cloudflare Pages 会自动重新部署。


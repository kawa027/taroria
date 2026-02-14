# ChatGPT 深度解讀接入說明（單張 + 三張）

本專案已新增 Cloudflare Pages Function：

- `functions/api/three-card-reading.js`
- `functions/api/daily-reading.js`

前端在三張牌頁面展開深度解讀時，會呼叫：

- `POST /api/three-card-reading`

前端在單張牌頁面展開深度解讀時，會呼叫：

- `POST /api/daily-reading`

## 你需要做的設定

1. 到 Cloudflare Pages 專案 `Settings` -> `Environment variables`。
2. 新增變數：
   - Key: `OPENAI_API_KEY`
   - Value: 你的 OpenAI API Key（`sk-...`）
3. 儲存後重新部署專案。

## 行為說明（兩個頁面相同）

- 若 API 正常：顯示 ChatGPT 生成的深度解讀。
- 若 API 失敗（例如沒有設定 Key）：自動回退為本地模板解讀，頁面不會壞掉。

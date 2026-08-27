# GitHub Pages 靜態前台部署紀錄

## 本機靜態預覽

首次以 Vite 預覽 `VITE_GITHUB_PAGES=true` 的 `dist/public`，開啟 `/advertisment-tutorial/` 時出現空白頁面。HTML 標題已正確載入為「學習航圖｜小學分級免費評估」，表示入口文件可讀取。其後確認 Vite 的預覽伺服器並不會把 `/advertisment-tutorial/assets/*` 正確映射至輸出根目錄，因此它不是 GitHub Pages 的有效模擬；獨立靜態預覽已確認該路徑的 JavaScript 回應為 `200 application/javascript`。正式發布後仍須以真實 GitHub Pages 網址作最後目視檢查。

## 靜態版範圍

GitHub Pages 會保留首頁、年級及三科選擇、20 題隨機評估、結果摘要、PDF 下載、分享控制及公開合作中心資訊。靜態模式以現時已確認的公開合作中心資料作唯讀備援，並使用中央 WhatsApp 作一般查詢。

家長稱呼、電話、十八區、評估跟進資料、管理員登入、中心修改、CSV 匯出、轉介確認及佣金資料不會由 GitHub Pages 收集或處理。完成靜態評估後，如家長需要安排跟進，會被清楚導往 Manus 正式站 `https://learnquiz-pe8vp32z.manus.space`；該站繼續負責資料庫、權限及「家長明確確認後才分享最少資料」的規則。

## 已驗證項目

| 項目 | 結果 |
|---|---|
| 子路徑建置 | `VITE_GITHUB_PAGES=true` 會產生 `/advertisment-tutorial/assets/*` 的 CSS 及 JavaScript 連結。 |
| 靜態產物 | 已包括 `index.html`、`.nojekyll`、`404.html`、壓縮資產及正式站品牌圖示網址。 |
| 模式分流 | 靜態模式停用公開 tRPC 查詢、跳過家長資料提交，並在報告頁提供正式站安排跟進按鈕。 |
| 自動部署 | `.github/workflows/deploy-pages.yml` 在 `main` 更新時建置及部署 GitHub Pages。 |

## 發布來源遷移

原有 GitHub Pages 設定使用 `main` 分支的根目錄（legacy），因此只會顯示儲存庫的 `README.md`。同步本工作流程後，發布來源必須更新為 GitHub Actions（`build_type: workflow`），才會上載 `dist/public` 靜態產物並顯示完整前台。

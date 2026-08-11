# Lane86 網球場預約行事曆

一個以 React + Vite 建立的網球場預約行事曆，支援貼上解析、月曆檢視、Firebase 即時同步，以及匿名登入的多人共用流程。

## 亮點

- 📅 互動式月曆，支援 A / B 場的每日預約檢視
- 🎾 依據狀態顯示不同顏色，方便辨識已預約、臨櫃預約與不同意
- 🔄 透過 Firebase Realtime Database 提供即時同步，所有開啟中的分頁都能即時更新
- 🔐 使用 Firebase Anonymous Authentication，無需註冊即可使用
- 📋 支援貼上多筆預約資料並自動解析
- 🗑️ 可直接從行事曆或詳細面板刪除預約
- 📱 支援桌面與手機版寬度調整

## 快速開始

1. 安裝依賴
   ```bash
   npm install
   ```

2. 複製 Firebase 設定範本
   ```bash
   cp .env.example .env.local
   ```
   然後依照 [FIREBASE_SETUP.md](FIREBASE_SETUP.md) 的步驟填入你的 Firebase 參數。

3. 啟動本機開發伺服器
   ```bash
   npm run dev
   ```
   開發頁面會在 http://localhost:3000 開啟。

## Firebase 設定

專案需要以下內容：

- Firebase Realtime Database 已啟用
- Firebase Authentication 已啟用匿名登入
- Realtime Database 規則允許讀寫 `/items`

建議的測試規則如下：

```json
{
  "rules": {
    "items": {
      ".read": true,
      ".write": true
    }
  }
}
```

完整步驟請參閱 [FIREBASE_SETUP.md](FIREBASE_SETUP.md)。

## GitHub Pages 部署

部署前請確認 `.env.local` 已存在，因為 Vite 會在建置時把 `VITE_*` 環境變數嵌入到前端 bundle 中。

```bash
npm run deploy
```

此指令會先執行 `vite build`，再把 `dist/` 發佈到 GitHub Pages 的 `gh-pages` 分支。

> ⚠️ 請勿把 `.env.local` 提交到 GitHub；該檔案已被加入 `.gitignore`。

若你使用 GitHub Actions 自動部署，請在 Repository 的 Secrets 或 Variables 中設定 Firebase 相關環境變數，部署流程會自動帶入。

## 資料格式

每筆預約至少包含三行：

| 欄位 | 範例 | 說明 |
|------|------|------|
| 場地 | `星空球場網球 A` | 需以 A 或 B 結尾 |
| 狀態 | `已預約` | 可用 `已預約` / `臨櫃已預約` / `不同意` |
| 日期與時段 | `租借日期：2026-08-13 | 18:00,19:00` | 可一次輸入多個時段 |

## 專案結構

- [src/App.jsx](src/App.jsx)：主畫面、月曆邏輯與貼上解析流程
- [src/firebase.js](src/firebase.js)：Firebase 初始化與即時資料存取
- [src/components](src/components)：共用 UI 元件
- [.github/workflows/deploy.yml](.github/workflows/deploy.yml)：GitHub Pages 自動部署流程

## 技術堆疊

- React 18
- Vite 5
- Tailwind CSS 3
- Framer Motion
- Lucide React
- Firebase Realtime Database
- Firebase Anonymous Authentication

## 授權

MIT

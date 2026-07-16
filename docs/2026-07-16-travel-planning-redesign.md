# 旅遊規劃全面重新設計（2026-07-16）

## 背景

原網站是「唯讀行程展示」：行程寫死在 `src/data/itinerary.js`，使用者只能看、不能改。
本次重新設計目標是把它升級為**互動式旅遊規劃工具**，涵蓋四大面向：

1. **資料匯入的彙整** — 訂單/確認信匯入、備份還原、旅伴分享
2. **行程安排規劃** — 可拖曳編輯的行程工作台
3. **互動網頁設計** — 全程 client-side 即時互動，維持靜態部署零成本
4. **狀況變更計畫** — 情境化 Plan B + 一鍵套用替代方案

## 熱門相似網站參考

| 網站/App | 借鏡的核心功能 | 對應本站實作 |
|---|---|---|
| **Wanderlog** | 拖曳式逐日行程編輯、預算追蹤、行程放上地圖、離線可用 | `/planner` 拖曳排序 + 即時預算條；PWA 離線快取 |
| **TripIt** | 轉寄確認信自動解析成統一行程（email parsing） | `/import` 貼上確認信 → 正則解析航班號/日期/訂位代號 |
| **Funliday** | 行程分享（Line/WhatsApp 連結）、旅伴協作 | 分享連結（行程編碼進 URL hash，旅伴一鍵套用） |
| **Stippl / 旅行手帳類** | 行前 checklist、備援計畫思維 | `/planb` 五大情境應變手冊 + 雨天替代方案 |

（比較來源：Wanderlog vs TripIt 2026 各家評測，見文末連結）

## 新增頁面

### 🧭 `/planner` 行程規劃工作台
- 以原始行程為底，變更以 **overlay** 形式存進 `localStorage`（`kumamoto-plan-v1`），原始資料不動
- HTML5 拖曳排序（支援跨天）、手機用 ↑↓ 按鈕（跨天邊界自動移到前/後一天）
- 新增/編輯/刪除活動（`<dialog>` 表單：時間、圖示、名稱、說明、預算、類型）
- 即時預算重算：總額 vs ¥60,000 進度條，超支變紅
- 匯出：行程 JSON、`.ics`（含自訂變更）、分享連結
- 重置一鍵回到原始行程

### 📥 `/import` 資料匯入・訂單彙整
- **貼上確認信解析**：啟發式正則抽出航班號（`XX999`）、日期（ISO/中文格式）、時間、訂位代號（含標籤式 PNR 偵測）、飯店關鍵字 → 預填表單供人工確認
- 訂單卡片彙整（依日期時間排序），可「➕ 加入行程」自動推薦對應天數並寫入規劃工作台
- **完整備份/還原**：自訂行程 + 訂單 + 花費紀錄打包成單一 JSON
- **分享連結接收端**：偵測 `#plan=<base64>`，顯示摘要（天數/活動數/總預算）後一鍵套用

### 🆘 `/planb` 應變計畫中心
- 五大情境手冊（資料驅動，存於 `itinerary.js` 的 `contingency`）：
  ☔ 午後雷陣雨 / 🥵 高溫中暑 / 🚄 航班延誤 / 😴 體力透支 / 🤒 身體不適
- **一鍵套用雨天替代方案**：戶外活動（熊本城、水前寺、動植物園）定義了室內 `alt`，
  套用後替換規劃工作台中的活動（保留 `_orig` 可隨時還原，顯示「替代方案」徽章）
- **即時天氣連動**：Open-Meteo 抓行程四天的降雨機率/最高溫，≥50% 或 ≥34°C 自動亮警示並展開對應情境
- 雨天備用景點庫（6 個室內點）+ 緊急聯絡快速卡（119/110/JNTO 中文熱線/急診），PWA 離線可開

## 資料流設計

```
src/data/itinerary.js（原始行程，build 時嵌入各頁）
        │
        ▼
public/js/trip-tools.js（共用前端資料層 window.TripTools）
  ├─ PlanStore：loadPlan/savePlan → localStorage overlay
  ├─ Bookings：loadBookings/saveBookings + parseBookingText
  ├─ buildICS：行事曆匯出（支援自訂版行程）
  └─ encodeShare/decodeShare：URL hash 分享
        │
   /planner ↔ /import ↔ /planb 三頁共用同一份 overlay
```

維持全靜態架構（Astro build → Cloudflare Pages），無後端、無資料庫、無新增付費 API。

## 已知限制與後續方向

- Day1–4 頁面仍顯示**原始行程**（規劃工作台的自訂版不回寫靜態頁）；後續可讓 Day 頁 client-side 讀 overlay
- 確認信解析是啟發式，非 TripIt 等級的 email parsing；解析結果一律需人工確認
- 分享連結是單向快照，非即時協作；多人即時編輯需要後端（可考慮 Cloudflare KV + Functions）
- localStorage 綁裝置；跨裝置同步目前靠手動備份 JSON

## 參考來源

- [Wanderlog vs TripIt: Which Travel Planning App Is Better in 2026?](https://blueplanit.co/blog/wanderlog-vs-tripit)
- [Wanderlog vs. TripIt [2026 Comparison]](https://www.wandrly.app/comparisons/wanderlog-vs-tripit)
- [Wanderlog 官網](https://wanderlog.com/)
- [Funliday - Travel planner](https://play.google.com/store/apps/details?id=com.funliday.app)
- [7 Travel Planning Apps That Actually Work in 2026 — Stippl](https://www.stippl.io/blog/best-travel-planning-apps-2026)

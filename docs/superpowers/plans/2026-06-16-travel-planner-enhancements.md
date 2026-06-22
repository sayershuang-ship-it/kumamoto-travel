# Travel Planner Template Enhancements

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 4 features to the kumamoto-travel template: .ics calendar export, expense tracker page, OG meta tags, and Wikimedia place photos.

**Architecture:** All features are pure frontend — no backend, no paid APIs. Data comes from the existing `src/data/itinerary.js`. New pages follow the same pattern as `tickets.astro` (Astro page + inline `<script>` + `<style>`). The .ics generator and Wikimedia photo fetcher run client-side.

**Tech Stack:** Astro 4.x, vanilla JS, Open-Meteo API (existing), Wikimedia Commons REST API (new, free, no key), iCalendar RFC 5545 format.

---

## File structure

| Action | File | Responsibility |
|--------|------|----------------|
| Create | `src/pages/calendar.astro` | .ics export page with preview + download button |
| Create | `src/pages/expenses.astro` | Expense tracker with localStorage persistence |
| Modify | `src/layouts/Base.astro` | Add OG meta tags (title, description, image, url) |
| Create | `public/images/og-cover.svg` | OG cover image (SVG → fallback for social preview) |
| Modify | `src/data/itinerary.js` | Add `wikiSearchTerm` field per location for photo lookup |
| Modify | `src/layouts/Day.astro` | Show Wikimedia photos in timeline |
| Modify | `src/pages/index.astro` | Add calendar + expenses to nav, add photo thumbnails |
| Modify | `src/pages/map.astro` | Update nav links |
| Modify | `src/pages/tickets.astro` | Update nav links |
| Modify | `src/pages/weather.astro` | Update nav links |
| Modify | `src/styles/global.css` | Add expense tracker + photo card styles |
| Modify | `public/sw.js` | Add new pages to cache list |

---

## Task 1: .ics calendar export page

**Files:**
- Create: `src/pages/calendar.astro`
- Modify: `src/data/itinerary.js` (add `startDate` field to trip object for machine-readable dates)

### Spec

Users click "Download .ics" → browser downloads a single `.ics` file containing one `VEVENT` per activity across all days. Each event has:
- `DTSTART` / `DTEND` in the trip's timezone (`Asia/Tokyo`)
- `SUMMARY` = activity title
- `DESCRIPTION` = activity desc + budget
- `LOCATION` = activity title (best available)

Also show a visual preview of what the calendar will look like before downloading.

### Steps

- [ ] **Step 1: Add machine-readable dates to itinerary.js**

Add a `startDate` string and `timezone` to the trip object so the .ics generator can compute real dates:

```javascript
// Add after budgetCurrency line in src/data/itinerary.js
startDate: '2026-07-17',  // ISO date of Day 1
timezone: 'Asia/Tokyo',
```

- [ ] **Step 2: Create `src/pages/calendar.astro`**

The page has two parts: a visual calendar preview (SSR from Astro) and a client-side `<script>` that builds and downloads the .ics file.

The .ics generation logic:
- Parse each activity's `time` field. Handle `午前` → `09:00`, `午後` → `13:00`, numeric `HH:MM` directly.
- Default duration: 60 minutes per activity (unless next activity provides a natural end time).
- Format dates as iCalendar `TZID=Asia/Tokyo:YYYYMMDDTHHmmss`.
- `VCALENDAR` wraps all events, with `PRODID:-//TravelPlanner//kumamoto-travel//ZH` and `VERSION:2.0`.

Page structure:
```
Header: 📅 匯出日曆
Preview: table showing Day / Time / Event for all activities
Button: "下載 .ics 檔案" → triggers download
Button: "加到 Google Calendar" → opens Google Calendar import URL
```

Full page code — follows the exact same layout pattern as `tickets.astro` (Base layout, hero header, nav, main container, footer).

Nav must include all pages:
```html
<a href="/">📋 總覽</a>
<a href="/day1">Day 1</a> ... <a href="/day4">Day 4</a>
<a href="/map">🗺️ 地圖</a>
<a href="/weather">🌤️ 天氣</a>
<a href="/tickets">🎫 預訂</a>
<a href="/expenses">💰 花費</a>
<a href="/calendar" class="active">📅 日曆</a>
```

The .ics builder function (in `<script>` block):

```javascript
function buildICS(trip) {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//TravelPlanner//kumamoto-travel//ZH',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${trip.title}`,
    `X-WR-TIMEZONE:${trip.timezone}`,
  ];

  const baseDate = new Date(trip.startDate + 'T00:00:00');

  trip.days.forEach((day, dayIndex) => {
    const date = new Date(baseDate);
    date.setDate(date.getDate() + dayIndex);
    const ymd = date.toISOString().slice(0, 10).replace(/-/g, '');

    day.activities.forEach((act, i) => {
      const startHM = parseTime(act.time);
      if (!startHM) return;

      const nextAct = day.activities[i + 1];
      const endHM = nextAct ? parseTime(nextAct.time) : null;
      const endTime = endHM || addMinutes(startHM, 60);

      lines.push('BEGIN:VEVENT');
      lines.push(`DTSTART;TZID=${trip.timezone}:${ymd}T${fmt(startHM)}00`);
      lines.push(`DTEND;TZID=${trip.timezone}:${ymd}T${fmt(endTime)}00`);
      lines.push(`SUMMARY:${icsEscape(act.icon + ' ' + act.title)}`);
      lines.push(`DESCRIPTION:${icsEscape(act.desc + (act.budget ? ' (¥' + act.budget.toLocaleString() + ')' : ''))}`);
      lines.push(`UID:${ymd}-${i}@kumamoto-travel`);
      lines.push('END:VEVENT');
    });
  });

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

function parseTime(t) {
  if (/^\d{1,2}:\d{2}$/.test(t)) {
    const [h, m] = t.split(':').map(Number);
    return { h, m };
  }
  if (t.includes('午前') || t.includes('上午')) return { h: 9, m: 0 };
  if (t.includes('午後') || t.includes('下午')) return { h: 13, m: 0 };
  return null;
}

function addMinutes(hm, mins) {
  let total = hm.h * 60 + hm.m + mins;
  return { h: Math.floor(total / 60) % 24, m: total % 60 };
}

function fmt(hm) {
  return String(hm.h).padStart(2, '0') + String(hm.m).padStart(2, '0');
}

function icsEscape(s) {
  return s.replace(/[\\;,\n]/g, c => '\\' + c);
}
```

Download trigger:
```javascript
document.getElementById('dl-ics').addEventListener('click', () => {
  const ics = buildICS(window.__TRIP__);
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'kumamoto-travel.ics';
  a.click();
  URL.revokeObjectURL(url);
});
```

Google Calendar button:
```javascript
document.getElementById('gcal-btn').addEventListener('click', () => {
  // Google Calendar doesn't support direct .ics import via URL without hosting
  // Instead, create events one by one via the add event URL for the first day as a demo
  const trip = window.__TRIP__;
  const d = trip.days[0];
  const base = trip.startDate.replace(/-/g, '');
  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(trip.title)}&dates=${base}/${base}&details=${encodeURIComponent('行程詳情請見網站')}`;
  window.open(url, '_blank');
});
```

- [ ] **Step 3: Pass trip data to client script via `define:vars`**

In the Astro frontmatter:
```javascript
---
import Base from '../layouts/Base.astro';
import { trip } from '../data/itinerary';
const tripJson = JSON.stringify(trip);
---
```

In the `<script define:vars={{ tripJson }}>` block, parse it:
```javascript
window.__TRIP__ = JSON.parse(tripJson);
```

- [ ] **Step 4: Build and verify**

```bash
npm run build
```

Expected: `dist/calendar/index.html` appears in the build output. Open in dev server, click download, verify .ics file opens in a calendar app.

- [ ] **Step 5: Commit**

```bash
git add src/pages/calendar.astro src/data/itinerary.js
git commit -m "feat: add .ics calendar export page"
```

---

## Task 2: Expense tracker page

**Files:**
- Create: `src/pages/expenses.astro`
- Modify: `src/styles/global.css` (add expense-specific styles)

### Spec

A page where users record actual spending during the trip. Each day shows the planned budget alongside an input for actual spending. Data persists in `localStorage`. Shows a running total and a bar chart comparing planned vs actual per category.

Features:
- Per-activity actual cost input (prefilled with planned budget)
- Category totals (food, transport, ticket, etc.)
- Visual bar: planned vs actual per day
- Grand total with over/under budget indicator
- Reset button (with confirmation)
- All state in `localStorage` key `kumamoto-expenses`

### Steps

- [ ] **Step 1: Create `src/pages/expenses.astro`**

Page structure:
```
Header: 💰 花費追蹤
Summary cards: 預算總計 / 實際花費 / 差額（綠色=省、紅色=超）

Per-day sections:
  Day N header with planned vs actual total
  Activity rows: icon + title + planned ¥X + input[type=number] for actual
  Day subtotal bar (visual comparison)

Category breakdown:
  Bar chart rows: category name | planned bar | actual bar | numbers

Footer buttons: 匯出 CSV | 重置
```

The `<script>` block:
- On load: read `localStorage('kumamoto-expenses')` → populate inputs
- On input change: debounce 300ms → save to localStorage → recalculate totals
- Totals update: sum all actual values, compute difference, update summary cards and bars
- Reset: `confirm()` → clear localStorage → reset all inputs to planned values

Each activity input:
```html
<input type="number"
  class="expense-input"
  data-day="{day.day}"
  data-idx="{activityIndex}"
  value="{savedValue || activity.budget}"
  min="0"
  step="100"
/>
```

CSS styles to add to `global.css`:
```css
.expense-input {
  width: 5rem;
  padding: 0.3rem 0.5rem;
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  font-size: 0.85rem;
  text-align: right;
}
.expense-input:focus {
  outline: 2px solid var(--brand);
  border-color: var(--brand);
}
.expense-bar {
  display: flex;
  height: 0.5rem;
  border-radius: 999px;
  overflow: hidden;
  margin: 0.5rem 0;
}
.expense-bar .planned { background: var(--border); }
.expense-bar .actual { background: var(--brand); }
.expense-over { color: #ef4444; }
.expense-under { color: var(--accent-green); }
```

CSV export function:
```javascript
function exportCSV() {
  const rows = [['Day', 'Time', 'Activity', 'Type', 'Planned', 'Actual']];
  trip.days.forEach(d => {
    d.activities.forEach((a, i) => {
      const actual = state[`${d.day}-${i}`] ?? a.budget;
      rows.push([`Day ${d.day}`, a.time, a.title, a.type, a.budget, actual]);
    });
  });
  const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'kumamoto-expenses.csv';
  a.click();
}
```

Nav links: same as Task 1 but with `expenses` as active.

- [ ] **Step 2: Add styles to `global.css`**

Append the `.expense-input`, `.expense-bar`, `.expense-over`, `.expense-under` rules shown above.

- [ ] **Step 3: Build and verify**

```bash
npm run build
```

Expected: `dist/expenses/index.html` in output. Open in dev, enter some values, refresh page — values persist. Click CSV export — file downloads with BOM for Excel compatibility.

- [ ] **Step 4: Commit**

```bash
git add src/pages/expenses.astro src/styles/global.css
git commit -m "feat: add expense tracker page with CSV export"
```

---

## Task 3: OG meta tags + social share preview

**Files:**
- Modify: `src/layouts/Base.astro`
- Create: `public/images/og-cover.svg`

### Spec

When the site URL is shared on LINE / Facebook / Twitter, show a rich preview with:
- Title: 熊本四天三夜自由行
- Description: 美食・休閒・溫泉・六萬日幣
- Image: a 1200x630 cover image (SVG, served as-is — most social platforms render SVG in og:image)

Also add `twitter:card` = `summary_large_image`.

Since the data is in `itinerary.js`, read it in the layout and inject dynamically.

### Steps

- [ ] **Step 1: Create OG cover image**

Create `public/images/og-cover.svg` — a simple 1200x630 branded card with:
- Background: gradient matching `.hero` (dark to red)
- Text: trip title + subtitle + dates
- Keep it simple since it's generated per-template

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1a1a2e"/>
      <stop offset="100%" stop-color="#d4342c"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <text x="600" y="260" text-anchor="middle" fill="white" font-size="64" font-weight="700" font-family="sans-serif">🗾 熊本四天三夜自由行</text>
  <text x="600" y="340" text-anchor="middle" fill="rgba(255,255,255,0.9)" font-size="32" font-family="sans-serif">美食・休閒・溫泉・六萬日幣</text>
  <text x="600" y="410" text-anchor="middle" fill="rgba(255,255,255,0.7)" font-size="24" font-family="sans-serif">2026/7/17 → 7/20 · 2人</text>
  <text x="600" y="560" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-size="18" font-family="sans-serif">Travel Planner · Astro + Cloudflare Pages</text>
</svg>
```

- [ ] **Step 2: Modify `Base.astro` to include OG tags**

Update the frontmatter to accept optional props:

```javascript
---
import '../styles/global.css';
const { title, description, ogImage } = Astro.props;
const siteUrl = 'https://kumamoto-travel.pages.dev';
const desc = description || '熊本四天三夜自由行 — 美食・休閒・溫泉・預算六萬日幣';
const img = ogImage || '/images/og-cover.svg';
---
```

Add inside `<head>`, after the existing `<meta name="description">`:

```html
<!-- Open Graph -->
<meta property="og:type" content="website" />
<meta property="og:title" content={`${title} | 熊本旅行`} />
<meta property="og:description" content={desc} />
<meta property="og:image" content={`${siteUrl}${img}`} />
<meta property="og:url" content={siteUrl} />
<meta property="og:locale" content="zh_TW" />

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={`${title} | 熊本旅行`} />
<meta name="twitter:description" content={desc} />
<meta name="twitter:image" content={`${siteUrl}${img}`} />
```

- [ ] **Step 3: Build and verify**

```bash
npm run build
```

Verify by inspecting `dist/index.html`:
```bash
grep 'og:image' dist/index.html
```
Expected: `<meta property="og:image" content="https://kumamoto-travel.pages.dev/images/og-cover.svg" />`

- [ ] **Step 4: Commit**

```bash
git add src/layouts/Base.astro public/images/og-cover.svg
git commit -m "feat: add OG meta tags and social share cover image"
```

---

## Task 4: Wikimedia place photos

**Files:**
- Modify: `src/data/itinerary.js` (add `wiki` search terms to locations)
- Modify: `src/layouts/Day.astro` (show photos in timeline)
- Modify: `src/pages/index.astro` (show thumbnail grid)

### Spec

For each major location, fetch a photo from Wikimedia Commons REST API at page load. The API is free, requires no key, and returns CC-licensed images.

API endpoint:
```
https://commons.wikimedia.org/w/api.php?action=query&titles=File:{filename}&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=400&format=json&origin=*
```

However, the easier approach is the **search endpoint**:
```
https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={term}&gsrnamespace=6&gsrlimit=1&prop=imageinfo&iiprop=url&iiurlwidth=400&format=json&origin=*
```

This returns the first matching image at 400px width — perfect for card thumbnails.

To keep it reliable, we pre-define search terms per location in `itinerary.js` rather than guessing at runtime.

### Steps

- [ ] **Step 1: Add `wiki` field to locations in `itinerary.js`**

Update each location entry:
```javascript
locations: [
  { name: '熊本空港', lat: 32.8375, lng: 130.8552, icon: 'airport', wiki: 'Aso Kumamoto Airport' },
  { name: '熊本駅', lat: 32.7893, lng: 130.7013, icon: 'train', wiki: 'Kumamoto Station' },
  { name: '熊本城', lat: 32.8062, lng: 130.7062, icon: 'castle', wiki: 'Kumamoto Castle' },
  { name: '水前寺成趣園', lat: 32.7911, lng: 130.7343, icon: 'garden', wiki: 'Suizenji Garden' },
  { name: 'くまモンスクエア', lat: 32.8021, lng: 130.7071, icon: 'bear', wiki: 'Kumamon' },
  { name: '上下通商店街', lat: 32.8040, lng: 130.7080, icon: 'shopping', wiki: '' },
  { name: '城彩苑', lat: 32.8065, lng: 130.7045, icon: 'historic', wiki: 'Kumamoto Castle' },
  { name: '湯らっくす', lat: 32.7785, lng: 130.6975, icon: 'onsen', wiki: '' },
  { name: 'あがんなっせ', lat: 32.8350, lng: 130.7200, icon: 'onsen', wiki: '' },
  { name: '熊本県立美術館', lat: 32.8095, lng: 130.7035, icon: 'museum', wiki: 'Kumamoto Prefectural Museum of Art' },
  { name: '動植物園', lat: 32.7910, lng: 130.7160, icon: 'zoo', wiki: 'Kumamoto City Zoological and Botanical Gardens' },
  { name: '肥後よかモン市場', lat: 32.7893, lng: 130.7013, icon: 'market', wiki: '' },
],
```

Empty `wiki` means no photo — skip those.

Also add `wiki` to each activity that maps to a known landmark:
```javascript
// In days[0].activities:
{ time: '15:00', icon: '🏯', title: '熊本城', desc: '...', budget: 1600, type: 'ticket', wiki: 'Kumamoto Castle' },
```

Only add `wiki` to the 6–8 activities that have recognizable landmarks. Leave the rest without it.

- [ ] **Step 2: Create photo fetcher utility**

Add a shared script that Day.astro and index.astro can both use. Since Astro inline scripts can't easily share code, we'll use a small self-contained function in each page's `<script>`:

```javascript
async function fetchWikiPhoto(searchTerm) {
  if (!searchTerm) return null;
  try {
    const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(searchTerm)}&gsrnamespace=6&gsrlimit=1&prop=imageinfo&iiprop=url&iiurlwidth=400&format=json&origin=*`;
    const res = await fetch(url);
    const data = await res.json();
    const pages = data.query?.pages;
    if (!pages) return null;
    const page = Object.values(pages)[0];
    return page?.imageinfo?.[0]?.thumburl || null;
  } catch { return null; }
}
```

- [ ] **Step 3: Modify `Day.astro` to show photos**

Add a photo slot below each activity that has a `wiki` field. The photo loads async after page render.

In the Astro template, add a `data-wiki` attribute to activities that have wiki terms:
```html
<div class="activity" data-wiki={a.wiki || ''}>
  <!-- existing activity content -->
  <div class="activity-photo" style="display:none;"></div>
</div>
```

In the `<script>` block, after Leaflet init:
```javascript
document.querySelectorAll('.activity[data-wiki]').forEach(async el => {
  const term = el.dataset.wiki;
  if (!term) return;
  const url = await fetchWikiPhoto(term);
  if (!url) return;
  const photoDiv = el.querySelector('.activity-photo');
  photoDiv.innerHTML = `<img src="${url}" alt="${term}" style="width:100%;max-width:300px;border-radius:0.75rem;margin-top:0.5rem;" loading="lazy" />`;
  photoDiv.style.display = 'block';
});
```

- [ ] **Step 4: Modify `index.astro` to show photo grid**

Add a "景點風光" section before the map preview on the index page. Only show locations that have a `wiki` field.

Astro template:
```html
<!-- Photo highlights -->
<div class="card" style="margin-top:1rem;">
  <h2 style="margin-bottom:0.75rem;">📸 景點風光</h2>
  <div id="photo-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:0.75rem;">
    {trip.locations.filter(l => l.wiki).map(loc => (
      <div class="photo-card" data-wiki={loc.wiki}>
        <div class="photo-placeholder" style="width:100%;height:120px;background:var(--bg);border-radius:0.75rem;display:flex;align-items:center;justify-content:center;color:var(--text-muted);font-size:0.8rem;">
          載入中...
        </div>
        <div style="font-size:0.85rem;font-weight:600;margin-top:0.4rem;">{loc.name}</div>
      </div>
    ))}
  </div>
  <p style="font-size:0.7rem;color:var(--text-muted);margin-top:0.75rem;">
    Photos: Wikimedia Commons (CC BY-SA)
  </p>
</div>
```

In the index page `<script>`:
```javascript
document.querySelectorAll('.photo-card[data-wiki]').forEach(async el => {
  const term = el.dataset.wiki;
  const url = await fetchWikiPhoto(term);
  const placeholder = el.querySelector('.photo-placeholder');
  if (url) {
    placeholder.outerHTML = `<img src="${url}" alt="${term}" style="width:100%;height:120px;object-fit:cover;border-radius:0.75rem;" loading="lazy" />`;
  } else {
    placeholder.textContent = '📷';
  }
});
```

- [ ] **Step 5: Build and verify**

```bash
npm run build
```

Open dev server. Check:
1. Index page photo grid shows images (may take 1-2s to load)
2. Day 1 page shows 熊本城 photo in timeline
3. Locations without `wiki` field show no photo (no error)

- [ ] **Step 6: Commit**

```bash
git add src/data/itinerary.js src/layouts/Day.astro src/pages/index.astro
git commit -m "feat: add Wikimedia place photos to timeline and index"
```

---

## Task 5: Update all nav links + service worker

**Files:**
- Modify: `src/pages/index.astro` (nav)
- Modify: `src/pages/map.astro` (nav)
- Modify: `src/pages/tickets.astro` (nav)
- Modify: `src/pages/weather.astro` (nav)
- Modify: `src/layouts/Day.astro` (nav)
- Modify: `public/sw.js` (cache list)

### Spec

All pages need the same nav with 9 links: 總覽, Day 1–4, 地圖, 天氣, 預訂, 花費, 日曆.
Service worker must cache the two new pages.

### Steps

- [ ] **Step 1: Update nav on all existing pages**

The new nav (each page sets its own `class="active"`):
```html
<nav class="nav">
  <a href="/">📋 總覽</a>
  <a href="/day1">Day 1</a>
  <a href="/day2">Day 2</a>
  <a href="/day3">Day 3</a>
  <a href="/day4">Day 4</a>
  <a href="/map">🗺️ 地圖</a>
  <a href="/weather">🌤️ 天氣</a>
  <a href="/tickets">🎫 預訂</a>
  <a href="/expenses">💰 花費</a>
  <a href="/calendar">📅 日曆</a>
</nav>
```

Apply to: `index.astro`, `map.astro`, `tickets.astro`, `weather.astro`, `Day.astro`.
Each file keeps its current `class="active"` on the correct link.

- [ ] **Step 2: Update `public/sw.js`**

```javascript
const CACHE = 'kumamoto-v2';  // bump version
const URLS = ['/', '/day1', '/day2', '/day3', '/day4', '/map', '/weather', '/tickets', '/expenses', '/calendar', '/manifest.json'];
```

- [ ] **Step 3: Build and verify**

```bash
npm run build
```

Expected: 10 pages in build output (index + day1-4 + map + weather + tickets + expenses + calendar).

Check that every page's nav has 9 links and the active state is correct.

- [ ] **Step 4: Commit**

```bash
git add src/pages/ src/layouts/ public/sw.js
git commit -m "feat: update nav and service worker for new pages"
```

---

## Task 6: Update travel-planner skill

**Files:**
- Modify: `~/.claude/skills/travel-planner/SKILL.md`
- Modify: `~/.claude/skills/travel-planner/references/itinerary-schema.md`

### Steps

- [ ] **Step 1: Update SKILL.md**

In Phase 6 (最終交付), add the two new pages:
```
💰 花費：旅途中記錄實際花費，對比預算
📅 日曆：一鍵匯出 .ics 到 Google Calendar / Apple Calendar
```

In the 技術規格 table, add:
```
| 照片 | Wikimedia Commons API（免費、CC BY-SA） |
```

- [ ] **Step 2: Update itinerary-schema.md**

Add the new fields:
- `trip.startDate` (string, ISO date)
- `trip.timezone` (string, IANA timezone)
- `locations[].wiki` (string, Wikimedia search term, optional)
- `activities[].wiki` (string, optional)

- [ ] **Step 3: Commit**

```bash
git add ~/.claude/skills/travel-planner/
git commit -m "docs: update skill references for new features"
```

---

## Execution order

Tasks 1–4 are independent and can be parallelized.
Task 5 (nav update) depends on Tasks 1 and 2 being complete (need final page URLs).
Task 6 (skill update) can run anytime after Tasks 1–4.

```
┌─ Task 1: .ics export ──────────┐
├─ Task 2: Expense tracker ──────┤
├─ Task 3: OG meta tags ─────────┤──→ Task 5: Nav + SW ──→ Task 6: Skill update
└─ Task 4: Wikimedia photos ─────┘
```

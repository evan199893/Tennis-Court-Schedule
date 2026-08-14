# Tennis Schedule

A React + Vite app for managing tennis court bookings, with paste-and-parse scheduling, Firebase real-time syncing, and anonymous multi-user access.

## Features

- 📅 Interactive monthly calendar with court A / B tracking
- 🎾 Color-coded statuses for approved, counter-approved, and rejected bookings
- 🔄 Real-time sync through Firebase Realtime Database
- 🔐 Anonymous sign-in with Firebase, no account required
- 📋 Bulk booking import from pasted text
- 🗑️ Delete bookings directly from the calendar or details panel
- 📱 Responsive layout for desktop and mobile
- 🔔 iCalendar (.ics) subscription feed for iOS and Android calendars

## Quick Start

1. Install dependencies
   ```bash
   npm install
   ```

2. Copy the Firebase environment template
   ```bash
   cp .env.example .env.local
   ```
   Then follow the steps in [FIREBASE_SETUP.md](FIREBASE_SETUP.md) and fill in your Firebase values.

3. Start the local dev server
   ```bash
   npm run dev
   ```
   The app opens at http://localhost:3000.

## Firebase Setup

This project requires:

- Firebase Realtime Database enabled
- Firebase Authentication with Anonymous sign-in enabled
- Realtime Database rules allowing read/write access to `/items`

Example test rules:

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

See [FIREBASE_SETUP.md](FIREBASE_SETUP.md) for the full setup instructions.

## iOS / Android Calendar Subscription (.ics)

This project now supports two free workflows:

### Option A: Vercel auto-update

Deploy this repo to Vercel and set one environment variable:

```bash
VITE_FIREBASE_DATABASE_URL=https://lane87-tennis-default-rtdb.firebaseio.com
```

The app will automatically use `/api/calendar.ics` as a live subscription URL.

### Option B: GitHub Pages manual publish

1. In the app, open `行事曆訂閱（.ics）` and click `匯出 .ics 檔案`
2. Replace `public/lane86-tennis.ics` with the exported file
3. Deploy again:

  ```bash
  npm run deploy
  ```

4. Use the app's displayed URL for calendar subscription:

- iOS: subscribe with `webcal://...`
- Android / Google Calendar: subscribe with `https://...`

If you use GitHub Pages, repeat the export-and-deploy steps when bookings change.

## GitHub Pages Deployment

Before building, make sure `.env.local` exists because Vite embeds `VITE_*` variables into the production bundle.

```bash
npm run deploy
```

This runs `vite build` and then publishes the `dist/` folder to the `gh-pages` branch.

> ⚠️ Do not commit `.env.local`. It is already ignored in `.gitignore`.

If you use GitHub Actions for deployment, add the same Firebase variables as GitHub repository Secrets or Variables.

## Data Format

Each booking entry needs at least three lines:

| Field | Example | Notes |
|------|---------|-------|
| Court | `星空球場網球 A` | Must end with A or B |
| Status | `已預約` | Valid values: `已預約`, `臨櫃已預約`, `不同意` |
| Date and time | `租借日期：2026-08-13 | 18:00,19:00` | Multiple times may be comma-separated |

## Project Structure

- [src/App.jsx](src/App.jsx): main calendar UI and parser logic
- [src/firebase.js](src/firebase.js): Firebase initialization and real-time data access
- [src/components](src/components): shared UI components
- [.github/workflows/deploy.yml](.github/workflows/deploy.yml): GitHub Pages deployment workflow

## Tech Stack

- React 18
- Vite 5
- Tailwind CSS 3
- Framer Motion
- Lucide React
- Firebase Realtime Database
- Firebase Anonymous Authentication

## License

MIT

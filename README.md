# Lane86 網球場預約行事曆 - Tennis Court Schedule

A React-based calendar app for managing tennis court bookings at Lane86, backed by Firebase Realtime Database for live multi-user sync across all browsers and devices.

## Features

- 📅 Interactive 7-column monthly calendar
- 🎾 Court A & B tracking with colour-coded status pills
- 📊 Status tracking: 已預約 (Approved), 臨櫃已預約 (Counter-approved), 不同意 (Rejected)
- 🔄 Real-time sync via Firebase Realtime Database — all users see the same data instantly
- 🔐 Anonymous Authentication — no sign-up required
- 📋 Bulk import via text paste-and-parse
- 🗑️ Delete events directly from the calendar or detail panel (syncs to DB immediately)
- 📱 Responsive design (desktop & mobile)

## Architecture

```
Browser → Firebase Anonymous Auth → Firebase Realtime Database
                                          ↕  real-time listener
                                    All other open tabs/browsers
```

All bookings are stored in Firebase under `/items`. Every connected client receives live updates the moment any user adds or deletes an event. There is no backend server — Firebase handles everything.

## Prerequisites

- Node.js 16+ and npm
- A Firebase project with:
  - **Realtime Database** enabled (region: `asia-southeast1` recommended)
  - **Anonymous Authentication** enabled
  - Database rules set to allow read/write on `/items`

## Firebase Database Rules

In Firebase Console → Realtime Database → Rules:

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

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` in the project root with your Firebase credentials:
```bash
VITE_FIREBASE_API_KEY=YOUR_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.asia-southeast1.firebasedatabase.app
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID
```

3. Start the dev server:
```bash
npm run dev
# Opens at http://localhost:3000
```

> For full Firebase setup steps, see [FIREBASE_SETUP.md](FIREBASE_SETUP.md)

## Deploy to GitHub Pages

`.env.local` must exist **before** building — Vite substitutes `VITE_*` variables at build time.

```bash
npm run deploy
```

This runs `vite build` (embedding Firebase credentials from `.env.local`) then publishes `dist/` to the `gh-pages` branch.

> ⚠️ **Never commit `.env.local`** — it is already in `.gitignore`. The file must be present locally each time you run `npm run deploy`.

## Usage

### Adding Bookings

Paste schedule text into the textarea and click **解析並加入行事曆**:

```
星空球場網球 B
已預約
租借日期：2026-08-13 | 18:00,19:00
```

Multiple bookings can be pasted at once. Duplicate entries are automatically skipped.

### Deleting Bookings

- Hover over an event pill on the calendar → click **×**
- Or click a date → click the **trash icon** in the detail panel

Deletions sync to Firebase immediately and disappear from all connected clients.

### Viewing Bookings

- Click any date to see full details in the right panel
- Use **‹** / **›** to navigate months
- **今天** jumps back to the current month

## Data Format

Each booking requires three lines:

| Line | Example | Notes |
|------|---------|-------|
| Court name | `星空球場網球 A` | Must end with `A` or `B` |
| Status | `已預約` | 已預約 / 臨櫃已預約 / 不同意 |
| Date & times | `租借日期：2026-08-13 \| 18:00,19:00` | Multiple times comma-separated |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| UI Framework | React 18 |
| Build Tool | Vite 5 |
| Styling | Tailwind CSS 3 |
| Animations | Framer Motion |
| Icons | Lucide React |
| Database | Firebase Realtime Database |
| Auth | Firebase Anonymous Authentication |
| Hosting | GitHub Pages (`gh-pages` branch) |

## License

MIT

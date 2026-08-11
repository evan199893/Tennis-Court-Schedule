# Lane86 網球場預約行事曆 - Tennis Court Schedule

A React-based calendar application for managing tennis court bookings at Lane86. Features include parsing booking schedules, tracking reservation status, and organizing by date and court.

## Features

- 📅 Interactive calendar view
- 🎾 Multiple court tracking (Court A & B)
- 📊 Status tracking (已預約/Approved, 臨櫃已預約/Counter-approved, 不同意/Rejected)
- 💾 Auto-save to browser localStorage
- 📋 Bulk import via text parsing
- 📱 Responsive design

## Setup & Deployment

### Prerequisites
- Node.js 16+ and npm

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Open browser to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

### Deploy to GitHub Pages

1. Update the `homepage` field in `package.json`:
```json
"homepage": "https://YOUR_USERNAME.github.io/Tennis-Court-Schedule"
```

2. Deploy:
```bash
npm run deploy
```

3. Enable GitHub Pages in your repository settings:
   - Go to Settings → Pages
   - Select "Deploy from a branch"
   - Choose `gh-pages` branch
   - Click Save

Your site will be live at `https://YOUR_USERNAME.github.io/Tennis-Court-Schedule`

## Usage

1. **Paste Schedule**: Paste reservation text in the format:
   ```
   星空球場網球 B
   已預約
   租借日期：2026-08-13 | 18:00,19:00
   ```

2. **View Calendar**: Click on dates to see all bookings for that day

3. **Delete Entry**: Hover over an event and click the X button

4. **Change Month**: Use arrow buttons to navigate months

## Data Format

Expected format for import:
- Court name (containing A or B)
- Status (已預約, 臨櫃已預約, or 不同意)
- Date in format: 租借日期：YYYY-MM-DD | HH:MM
- Multiple times can be comma-separated

## Tech Stack

- React 18
- Vite (Build tool)
- Tailwind CSS (Styling)
- Framer Motion (Animations)
- Lucide React (Icons)
- gh-pages (GitHub Pages deployment)

## Local Storage

All bookings are automatically saved to browser localStorage under the key `tennis-calendar-items-v1`. Data persists across browser sessions.

## License

MIT
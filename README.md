# Lane86 網球場預約行事曆 - Tennis Court Schedule

A React-based calendar application for managing tennis court bookings at Lane86. Features include parsing booking schedules, tracking reservation status, and organizing by date and court.

## Features

- 📅 Interactive calendar view
- 🎾 Multiple court tracking (Court A & B)
- 📊 Status tracking (已預約/Approved, 臨櫃已預約/Counter-approved, 不同意/Rejected)
- � Real-time Firebase sync across all browsers and devices
- 💾 Auto-save to Firebase (multi-user shared database)
- 📋 Bulk import via text parsing
- 📱 Responsive design

## Setup & Deployment

### Prerequisites
- Node.js 16+ and npm
- Firebase project with Realtime Database and Authentication enabled

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Set up Firebase (see [FIREBASE_SETUP.md](FIREBASE_SETUP.md) for detailed steps):
   - Create a Firebase project
   - Enable Realtime Database and Anonymous Auth
   - Create `.env.local` with your Firebase credentials:
   ```bash
   VITE_FIREBASE_API_KEY=YOUR_API_KEY
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
   VITE_FIREBASE_APP_ID=YOUR_APP_ID
   ```

3. Start development server:
```bash
npm run dev
```

4. Open browser to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

### Deploy to GitHub Pages

1. **Important**: Add Firebase credentials to your `.env.local` before building and deploying
2. Update the `homepage` field in `package.json`:
```json
"homepage": "https://YOUR_USERNAME.github.io/Tennis-Court-Schedule"
```

3. Deploy:
```bash
npm run deploy
```

4. Enable GitHub Pages in your repository settings:
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

3. **Delete Entry**: Click the X button on an event to delete it

4. **Change Month**: Use arrow buttons to navigate months

5. **Real-time Sync**: Open the app in multiple tabs/browsers to see live updates across all windows

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
- Firebase (Realtime Database + Authentication)
- gh-pages (GitHub Pages deployment)

## Firebase Integration

This app uses Firebase Realtime Database for multi-user data synchronization:
- **Anonymous Authentication**: Users don't need to sign up
- **Real-time Sync**: All bookings sync instantly across all browsers and devices
- **Shared Data**: All users see the same tennis court bookings

For detailed Firebase setup instructions, see [FIREBASE_SETUP.md](FIREBASE_SETUP.md)

## Important Security Notes

⚠️ **Never commit `.env.local` to GitHub** - it contains sensitive Firebase credentials
- The file is already in `.gitignore`
- Each environment (local, production) should have separate Firebase credentials if needed
- For testing, use the same credentials locally and on GitHub Pages

## License

MIT

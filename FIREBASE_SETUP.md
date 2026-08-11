# Firebase Setup Guide for Lane86 Tennis Court Schedule

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Sign in with your Google account
3. Click **"Add project"** or **"Create a project"**
4. Enter project name: `Lane86-Tennis-Court-Schedule`
5. Click **Create project** (disable Google Analytics if prompted)
6. Wait for the project to initialize

## Step 2: Enable Realtime Database

1. In Firebase Console, select your project
2. Go to **Build** → **Realtime Database**
3. Click **Create Database**
4. Choose region (e.g., `asia-southeast1` for Singapore) for better latency
5. Start in **Test mode** (for development - add security rules later)
6. Click **Enable**
7. Copy the **Database URL** (looks like `https://your-project.firebaseio.com`)

## Step 3: Enable Authentication

1. Go to **Build** → **Authentication**
2. Click **Get Started**
3. Enable **Anonymous** authentication:
   - Click the **Anonymous** provider
   - Toggle **Enable** switch
   - Click **Save**

This allows users to access the app without logging in (perfect for shared calendars).

## Step 4: Get Firebase Configuration

1. Go to **Project Settings** (gear icon in top-left)
2. Scroll to **Your apps** section
3. Click on the **Web** icon (</>) or create a new web app
4. Copy your configuration (it will look like this):

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project.firebaseio.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};
```

## Step 5: Set Up Environment Variables

1. In the project root directory, create a `.env.local` file (copy from `.env.example`):

```bash
VITE_FIREBASE_API_KEY=YOUR_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID
```

2. **DO NOT commit `.env.local` to GitHub!** (it's already in `.gitignore`)

## Step 6: Test Locally

```bash
npm run dev
```

1. Open the app at `http://localhost:3000`
2. Add some tennis court bookings
3. Open the app in another browser tab or window
4. Add a booking in the first tab - it should appear in the second tab in real-time ✓

## Step 7: Deploy to GitHub Pages

```bash
npm run deploy
```

This builds and deploys to GitHub Pages with Firebase integration.

## Security Rules (For Production)

When ready to use with real user data, update your Realtime Database rules:

1. Go to **Realtime Database** → **Rules**
2. Replace with secure rules that limit access:

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

⚠️ **Note**: These open rules are for testing only. For production, implement user-based access control.

## Troubleshooting

- **"Cannot find module 'firebase'"**: Run `npm install firebase`
- **"Env variable not found"**: Make sure `.env.local` exists in the root directory
- **Data not syncing**: Check Firebase console → Database → ensure data exists
- **Blank page**: Open browser console (F12) and check for errors

## Features Now Available

✅ Real-time sync across all browsers and devices
✅ Multi-user data sharing (all users see same bookings)
✅ Automatic data persistence (no need to copy/paste)
✅ Anonymous authentication (no sign-up needed)

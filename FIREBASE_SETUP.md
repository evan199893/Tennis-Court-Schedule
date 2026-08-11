# Firebase Setup Guide

This project uses Firebase Realtime Database and Anonymous Authentication for shared calendar access without a custom backend.

## 1. Create a Firebase project

1. Open [Firebase Console](https://console.firebase.google.com)
2. Create or select a project
3. Name it something like `Lane86-Tennis-Court-Schedule`
4. Skip or disable Google Analytics if prompted

## 2. Enable Realtime Database

1. In Firebase Console, open **Build** → **Realtime Database**
2. Click **Create Database**
3. Choose a region close to your users (for example `asia-southeast1`)
4. Start in **Test mode** for development
5. Save the database URL for later

## 3. Enable Authentication

1. Open **Build** → **Authentication**
2. Click **Get Started**
3. Enable the **Anonymous** sign-in provider
4. Save the change

This makes the app usable without a login screen.

## 4. Get your web app config

1. Open **Project Settings**
2. Go to **Your apps**
3. Select the web app or create one
4. Copy the config values for:
   - `apiKey`
   - `authDomain`
   - `databaseURL`
   - `projectId`
   - `storageBucket`
   - `messagingSenderId`
   - `appId`

## 5. Configure local environment variables

From the project root, copy the example file and fill it in:

```bash
cp .env.example .env.local
```

Then update [.env.local](.env.local) with the Firebase values:

```bash
VITE_FIREBASE_API_KEY=YOUR_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.asia-southeast1.firebasedatabase.app
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID
```

> ⚠️ Keep `.env.local` local. It is already ignored by Git.

## 6. Test locally

```bash
npm run dev
```

Then verify that:
1. the app opens in the browser
2. you can add a booking
3. another tab shows the same booking after a moment

## 7. Deploy to GitHub Pages

```bash
npm run deploy
```

For GitHub Actions deployments, add the same Firebase variables as GitHub repository Secrets or Variables.

## Production rules suggestion

For real-world use, tighten the database rules so only authorized users can read or write. A simple test-only rule is:

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

## Troubleshooting

- `Cannot find module 'firebase'`: run `npm install`
- `Env variable not found`: confirm `.env.local` exists and is named correctly
- `Data not syncing`: check that Realtime Database has been created and your app config points to the right project
- `Blank page`: open the browser devtools console and inspect the Firebase initialization message

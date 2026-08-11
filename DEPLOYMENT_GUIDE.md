# Deployment Guide - GitHub Pages

This guide walks you through deploying the Tennis Court Schedule app to GitHub Pages.

## Quick Start (3 steps)

### 1️⃣ Update Your GitHub Username

Edit `package.json` and replace `YOUR_USERNAME` with your actual GitHub username:

```json
"homepage": "https://YOUR_USERNAME.github.io/Tennis-Court-Schedule"
```

### 2️⃣ Install Dependencies & Deploy

```bash
npm install
npm run deploy
```

This will:
- Install all dependencies
- Build the production version
- Deploy to GitHub Pages automatically

### 3️⃣ Enable GitHub Pages (if not auto-enabled)

- Go to your repository → **Settings** → **Pages**
- Under "Build and deployment", select:
  - Source: **Deploy from a branch**
  - Branch: **gh-pages**
  - Folder: **/ (root)**
- Click **Save**

## Verify Deployment

After deployment, your app will be live at:
```
https://YOUR_USERNAME.github.io/Tennis-Court-Schedule
```

## Automatic Deployment (Optional)

If you pushed code to GitHub, the included GitHub Actions workflow (`.github/workflows/deploy.yml`) will automatically:
- Build your app
- Deploy to GitHub Pages on every push to `main` branch

No additional setup needed!

## Troubleshooting

### Site shows 404
- Wait 2-3 minutes for GitHub Pages to process
- Verify `gh-pages` branch exists in your repo
- Check Settings → Pages to confirm branch selection

### Blank page or broken styling
- Clear browser cache (Ctrl+Shift+Del or Cmd+Shift+Del)
- Check that `homepage` in `package.json` matches your GitHub URL

### Need to redeploy
```bash
npm run build
npm run deploy
```

## Local Testing

Before deploying to GitHub, test locally:

```bash
npm run dev
# Open http://localhost:3000 in your browser
```

## Environment Variables

Firebase credentials must be set in `.env.local` **before** running `npm run deploy`.
Vite embeds `VITE_*` variables at build time — if they are missing the app will load but show 0 records.

```bash
VITE_FIREBASE_API_KEY=YOUR_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.asia-southeast1.firebasedatabase.app
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID
```

> ⚠️ Never commit `.env.local` — it is in `.gitignore` for a reason.

## Need Help?

- Check GitHub Pages official docs: https://docs.github.com/en/pages
- Vite deployment guide: https://vitejs.dev/guide/static-deploy.html

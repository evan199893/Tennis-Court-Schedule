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

No environment variables are needed for basic deployment. Data is stored in browser localStorage.

## Need Help?

- Check GitHub Pages official docs: https://docs.github.com/en/pages
- Vite deployment guide: https://vitejs.dev/guide/static-deploy.html

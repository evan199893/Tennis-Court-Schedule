# Deployment Guide - GitHub Pages

This guide covers the recommended flow for deploying the Tennis Court Schedule app to GitHub Pages.

## 1. Confirm the GitHub Pages base URL

The project already uses the correct base path in [vite.config.js](vite.config.js):

```js
base: '/Tennis-Court-Schedule/'
```

If you fork or rename the repository, update the homepage value in [package.json](package.json) to match your own GitHub Pages URL.

## 2. Set Firebase environment variables locally

Create a local environment file before building:

```bash
cp .env.example .env.local
```

Then fill in your Firebase values in [.env.local](.env.local).

## 3. Deploy locally

```bash
npm install
npm run deploy
```

This will:
- install dependencies
- build the production bundle
- publish the build to the `gh-pages` branch

## 4. Enable GitHub Pages in GitHub

If GitHub Pages is not enabled automatically, open your repository settings and choose:

- Source: Deploy from a branch
- Branch: `gh-pages`
- Folder: `/ (root)`

## 5. Optional: automatic deployment via GitHub Actions

The workflow at [.github/workflows/deploy.yml](.github/workflows/deploy.yml) will build and deploy on pushes to `main`.

To make Firebase work in automated deployments, add the same Firebase variables as GitHub repository Secrets or Variables.

## 6. Deploy the iCalendar subscription endpoint (.ics)

### Recommended: Vercel free auto-update mode

1. Import this repository into Vercel
2. Add environment variable:

```bash
VITE_FIREBASE_DATABASE_URL=https://lane87-tennis-default-rtdb.firebaseio.com
```

3. Deploy

The app will expose a live `.ics` URL at `/api/calendar.ics` on your Vercel domain.

### Fallback: GitHub Pages manual export mode

Use the free manual export flow:

1. Open the app and go to `行事曆訂閱（.ics）`
2. Click `匯出 .ics 檔案`
3. Replace `public/lane86-tennis.ics` with the exported file
4. Redeploy frontend:

```bash
npm run deploy
```

Users can then copy the subscription URL directly from the same card.

## Troubleshooting

### 404 page
- wait 2–3 minutes after the first deployment
- confirm the `gh-pages` branch exists
- confirm GitHub Pages is pointing to that branch

### Blank page or missing data
- confirm `.env.local` exists before running `npm run deploy`
- verify Firebase values are correct in the environment file or GitHub secrets
- check the browser console for Firebase initialization errors

### Re-run a deployment

```bash
npm run build
npm run deploy
```

## Local preview

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

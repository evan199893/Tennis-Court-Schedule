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

GitHub Pages can host the frontend, but `.ics` subscription requires a dynamic endpoint that returns `text/calendar`. This repo provides that endpoint as a Firebase Function.

```bash
cd functions
npm install
cd ..
npm run deploy:ics
```

Then set `VITE_ICS_FEED_URL` in `.env.local` to the deployed function URL and redeploy frontend:

```bash
npm run deploy
```

When users open the app, they can copy the subscription URL from the `行事曆訂閱（.ics）` card.

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

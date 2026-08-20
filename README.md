# Astronomy 💓 — NASA APOD New Tab Page

A custom new-tab page that fetches **NASA's Astronomy Picture of the Day** and wraps it in a full dashboard — live clock, search, weather, shortcuts, todos, notes, and a focus timer. Built with Vite + vanilla JavaScript.

> Built for [Hack Club Stardance](https://stardance.hackclub.com) — Mission: *Give Your Website a Pulse*

## Features

- **NASA APOD** — fetches the Astronomy Picture of the Day from the official API: title, image (or video/YouTube embed), and explanation, updated automatically every day
- **Animated ECG heartbeat** — a glowing pulse line under the clock, the theme of the mission
- **Live clock & date** — big glowing Orbitron clock with an hour-based greeting
- **Smart search bar** — URLs, domains, or queries; `Ctrl+K` focuses it
- **Speed dial** — editable shortcuts with emoji icons (stored in `localStorage`)
- **Weather widget** — Open-Meteo API, no key needed, cached for 10 minutes
- **To-do list** — add/check/delete/clear tasks (`Ctrl+N` to add)
- **Notes panel** — auto-saving scratchpad
- **Focus timer** — pomodoro ring with 25/45/60 min modes + browser notification
- **Starfield** — canvas-based twinkling stars + random shooting stars
- **Animations** — orbit loading animation, staggered content reveals, shimmering title, hover zoom on the image
- **Keyboard shortcuts** — `Esc` closes panels, `Ctrl+K` search, `Ctrl+N` todo

## Getting started

1. Clone the repo
2. `npm install`
3. Get a free key at [api.nasa.gov](https://api.nasa.gov) — it's emailed to you instantly
4. Copy `.env.example` to `.env` and put your key in it:
   ```
   VITE_NASA_API_KEY=your_key_here
   ```
5. `npm run dev` and open the URL shown (usually http://localhost:5173)

**Never open `index.html` directly** — Vite's module system and `.env` only work through the dev server.

## Deploying to GitHub Pages

The repo includes `.github/workflows/deploy.yml` which auto-deploys on every push to `main`:

1. Create a repo named exactly `apod` (matches `vite.config.js` base path)
2. `git init`, add remote, commit, push
3. Add your key as a repo secret: Settings → Secrets and variables → Actions → **`VITE_NASA_API_KEY`**
4. Settings → Pages → Source: **GitHub Actions**
5. Your site lives at `https://<username>.github.io/apod/`

Use it as a real new-tab page with the [Custom New Tab URL](https://chromewebstore.google.com/detail/custom-new-tab-url/mmjbdbjnoablecnkagjmlgedomnlcbni) extension.

## Project structure

```
apod/
├── index.html                  # page structure
├── vite.config.js              # base path for GitHub Pages
├── .env.example                # template for your API key
├── .github/workflows/deploy.yml # auto-deploy on push
└── src/
    ├── main.js                 # all widget + APOD logic
    ├── stars.js                # canvas starfield + shooting stars
    └── style.css               # space theme, animations
```

## Tech

- [Vite](https://vitejs.dev) — build tool + dev server
- [NASA APOD API](https://api.nasa.gov) — picture of the day
- [Open-Meteo](https://open-meteo.com) — weather, free and keyless
- [Google Fonts](https://fonts.google.com) — Orbitron + Black Ops One
- No frameworks, no UI libraries

## License

MIT
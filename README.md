# Astronomy — NASA APOD New Tab Page

A custom new-tab page that fetches "NASA's Astronomy Picture of the Day" and wraps it in a full dashboard -- live clock, search, weather, shortcuts, todos, notes, and a focus timer. Built with Vite + vanilla JavaScript.

> Built for [Hack Club Stardance](https://stardance.hackclub.com) — Mission: "Give Your Website a Pulse"

## Features

1 NASA APOD -- fetches the Astronomy Picture of the Day from the official API: title, image (or video/YouTube embed), and explanation, updated automatically every day
2 Live clock & date --The  big glowing Nunito clock with an hour-based greeting looks intercative and futuristic.
3 Smart search bar -- URLs, domains, or queries; "Ctrl+K" focuses it.Now even the search bar is creative
4 Speed dial -- editable shortcuts with emoji icons (stored in "localStorage")
5 Weather widget -- Open-Meteo API, no key needed, cached for 10 minutes.Pretty easy to configure.
6 To-do list -- add/check/delete/clear tasks ("Ctrl+N" to add)
7 Notes panel -- It has a auto-saving scratchpad
8 Focus timer -- It includes a pomodoro ring with 25/45/60 min modes and is combined with a browser notification
9 Starfield -- canvas-based twinkling stars and random shooting stars
10 Animations -- orbit loading animation, staggered content reveals, hover zoom on the image
11 Keyboard shortcuts -- 'Esc' closes panels, 'Ctrl+K' search, 'Ctrl+N' todo

How to Get started

Step 1. Clone the repo
Step 2. Use the command in the respective terminal(windows,linux or IOS) npm install.
Step 3. Get a free key at [api.nasa.gov](https://api.nasa.gov),it's emailed to you instantly once you give it a email address
Step 4. Copy ".env.example" to ".env" and put your key in it:
   
   VITE_NASA_API_KEY=yourkeyhere
   
Step 5. run the command `npm run dev` and open the URL shown (usually http://localhost:5173 or localhost:5174)

Note-Never open "index.html" directly — Vite's module system and ".env" only work through the dev server.

 Deploying to GitHub Pages

Step 1. Create a repo named exactly `apod` (matches `vite.config.js` base path)
Step 2. initialize your git repositort,before that  add remote, then commit, push
Step 3.Importanat** Add your key as a repo secret: Settings => Secrets and variables => Actions => VITE_NASA_API_KEY
Step 4. Settings => Pages => Source: GitHub Actions
Step 5. Your site lives at 'https://<username>.github.io/apod/'

Use it as a real new-tab page with the [Custom New Tab URL](https://chromewebstore.google.com/detail/custom-new-tab-url/mmjbdbjnoablecnkagjmlgedomnlcbni) extension.

Structure of this website
apod
├── index.html                  # the basic page structure
├── vite.config.js              # base path for GitHub Pages
├── .env.example                # provides the template for your API key
├── .github/workflows/deploy.yml #allows you to auto-deploy on push
└── src/
   ├── main.js                 # all widgets and the  APOD logic
    ├── stars.js                # canvas starfield with  shooting stars
    └── style.css               # space theme and the futuristic animations

 Tech Stack of this page 

  [Vite](https://vitejs.dev) — build tool + dev server
  [NASA APOD API](https://api.nasa.gov) — picture of the day
  [Open-Meteo](https://open-meteo.com) — weather, free and keyless
  [Google Fonts](https://fonts.google.com) — Orbitron + Black Ops One
  No frameworks, no UI libraries are used it was raw coding 

 License
MIT

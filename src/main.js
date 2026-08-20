import './style.css';

const API_KEY = import.meta.env.VITE_NASA_API_KEY;

// Stable NASA image pool so the background slideshow still works
// even when the API key is missing (e.g. a fresh Netlify/GH Pages deploy).
const FALLBACK_APOD_IMAGES = [
  "https://images-assets.nasa.gov/image/PIA15415/PIA15415~medium.jpg",
  "https://images-assets.nasa.gov/image/PIA00271/PIA00271~medium.jpg",
  "https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000261/GSFC_20171208_Archive_e000261~medium.jpg",
  "https://images-assets.nasa.gov/image/PIA17172/PIA17172~medium.jpg",
  "https://images-assets.nasa.gov/image/PIA12110/PIA12110~medium.jpg",
  "https://images-assets.nasa.gov/image/PIA19040/PIA19040~medium.jpg",
  "https://images-assets.nasa.gov/image/PIA17041/PIA17041~medium.jpg",
];

const $ = (sel) => document.querySelector(sel);
const store = {
  get(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  },
};

const GREETINGS = [
  { min: 5, max: 12, text: "Good morning" },
  { min: 12, max: 17, text: "Good afternoon" },
  { min: 17, max: 21, text: "Good evening" },
  { min: 21, max: 24, text: "Good night" },
  { min: 0, max: 5, text: "Still up?" },
];

const clk = $("#clock");
const dt = $("#date");
const gr = $("#greeting");

function pad(n) {
  return String(n).padStart(2, "0");
}

function tick() {
  const now = new Date();
  clk.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  dt.textContent = now.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const hour = now.getHours();
  const greeting = GREETINGS.find((g) => hour >= g.min && hour < g.max);
  if (greeting && gr.textContent !== greeting.text) {
    gr.textContent = greeting.text;
  }
}

const sf = $("#searchForm");
const si = $("#searchInput");

sf.addEventListener("submit", (e) => {
  e.preventDefault();
  const q = si.value.trim();
  if (!q) return;
  if (/^https?:\/\//i.test(q)) {
    window.location.href = q;
  } else if (/^[\w-]+(\.[\w-]+)+([\/?#].*)?$/.test(q) && !q.includes(" ")) {
    window.location.href = `https://${q}`;
  } else {
    window.location.href = `https://www.google.com/search?q=${encodeURIComponent(q)}`;
  }
});

const DEFAULT_SHORTCUTS = [
  { name: "GitHub", url: "https://github.com", emoji: "🐙" },
  { name: "YouTube", url: "https://youtube.com", emoji: "▶️" },
  { name: "Gmail", url: "https://mail.google.com", emoji: "✉️" },
  { name: "Hack Club", url: "https://hackclub.com", emoji: "⚡" },
  { name: "Reddit", url: "https://reddit.com", emoji: "👽" },
  { name: "Spotify", url: "https://open.spotify.com", emoji: "🎵" },
  { name: "X", url: "https://x.com", emoji: "🐦" },
  { name: "MDN", url: "https://developer.mozilla.org", emoji: "📚" },
];

const sd = $("#speedDial");
const se = $("#shortcutEditor");

function getShortcuts() {
  return store.get("pulse.shortcuts", DEFAULT_SHORTCUTS);
}

function saveShortcuts(list) {
  store.set("pulse.shortcuts", list);
}

function renderShortcuts() {
  sd.innerHTML = "";
  getShortcuts().forEach((s) => {
    const a = document.createElement("a");
    a.className = "tile";
    a.href = s.url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    const icon = document.createElement("div");
    icon.className = "tile-icon";
    icon.textContent = s.emoji || "🔗";
    const name = document.createElement("span");
    name.className = "tile-name";
    name.textContent = s.name;
    a.append(icon, name);
    sd.appendChild(a);
  });
}

function renderShortcutEditor() {
  se.innerHTML = "";
  getShortcuts().forEach((s, i) => {
    const row = document.createElement("div");
    row.className = "shortcut-row";

    const ni = document.createElement("input");
    ni.value = s.name;
    ni.placeholder = "Name";
    ni.addEventListener("change", () => {
      const list = getShortcuts();
      list[i].name = ni.value;
      saveShortcuts(list);
      renderShortcuts();
    });

    const ei = document.createElement("input");
    ei.value = s.emoji || "";
    ei.placeholder = "Emoji";
    ei.maxLength = 4;
    ei.style.maxWidth = "64px";
    ei.addEventListener("change", () => {
      const list = getShortcuts();
      list[i].emoji = ei.value;
      saveShortcuts(list);
      renderShortcuts();
    });

    const ui = document.createElement("input");
    ui.value = s.url;
    ui.placeholder = "https://…";
    ui.addEventListener("change", () => {
      let url = ui.value.trim();
      if (url && !/^https?:\/\//i.test(url)) url = `https://${url}`;
      const list = getShortcuts();
      list[i].url = url;
      saveShortcuts(list);
      renderShortcuts();
    });

    const db = document.createElement("button");
    db.className = "panel-add";
    db.textContent = "−";
    db.title = "Remove";
    db.addEventListener("click", () => {
      const list = getShortcuts();
      list.splice(i, 1);
      saveShortcuts(list);
      renderShortcuts();
      renderShortcutEditor();
    });

    row.append(ni, ei, ui, db);
    se.appendChild(row);
  });
}

$("#addShortcut").addEventListener("click", () => {
  const list = getShortcuts();
  list.push({ name: "New", url: "https://example.com", emoji: "🔗" });
  saveShortcuts(list);
  renderShortcuts();
  renderShortcutEditor();
});

const we = $("#weather");
const wi = $("#weatherIcon");
const wt = $("#weatherTemp");

const WEATHER_ICONS = {
  "0": "☀️",
  "1": "🌤️",
  "2": "⛅",
  "3": "☁️",
  "45": "🌫️",
  "48": "🌫️",
  "51": "🌦️",
  "53": "🌦️",
  "55": "🌧️",
  "56": "🌧️",
  "57": "🌧️",
  "61": "🌧️",
  "63": "🌧️",
  "65": "🌧️",
  "66": "🌧️",
  "67": "🌧️",
  "71": "🌨️",
  "73": "🌨️",
  "75": "❄️",
  "77": "❄️",
  "80": "🌦️",
  "81": "🌧️",
  "82": "⛈️",
  "85": "🌨️",
  "86": "🌨️",
  "95": "⛈️",
  "96": "⛈️",
  "99": "⛈️",
};

async function fetchWeather(lat, lon) {
  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=auto`
  );
  if (!res.ok) throw new Error("weather request failed");
  const data = await res.json();
  const code = String(data.current.weather_code);
  wi.textContent = WEATHER_ICONS[code] || "🌡️";
  wt.textContent = `${Math.round(data.current.temperature_2m)}°`;
  we.title = "Weather • click to refresh";
}

async function loadWeather() {
  const cached = store.get("pulse.weather", null);
  if (cached && Date.now() - cached.at < 10 * 60 * 1000) {
    wi.textContent = cached.icon;
    wt.textContent = cached.temp;
    return;
  }
  try {
    const pos = await new Promise((resolve, reject) => {
      if (!navigator.geolocation) return reject(new Error("no geolocation"));
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        timeout: 5000,
      });
    });
    await fetchWeather(pos.coords.latitude, pos.coords.longitude);
    store.set("pulse.weather", {
      icon: wi.textContent,
      temp: wt.textContent,
      at: Date.now(),
    });
  } catch {
    we.title = "Weather unavailable — check location permission";
    wt.textContent = "—°";
  }
}

we.addEventListener("click", () => {
  store.set("pulse.weather", null);
  loadWeather();
});

const tl = $("#todoList");
const tf = $("#todoForm");
const ti = $("#todoInput");
const tc = $("#todoCount");
const tx = $("#todoClear");

function getTodos() {
  return store.get("pulse.todos", []);
}

function saveTodos(list) {
  store.set("pulse.todos", list);
}

function renderTodos() {
  const todos = getTodos();
  tl.innerHTML = "";
  const remaining = todos.filter((t) => !t.done).length;
  tc.textContent = `${remaining} task${remaining === 1 ? "" : "s"} left`;
  todos.forEach((t, i) => {
    const li = document.createElement("li");
    li.className = "todo-item" + (t.done ? " done" : "");

    const check = document.createElement("input");
    check.type = "checkbox";
    check.className = "todo-check";
    check.checked = t.done;
    check.addEventListener("change", () => {
      const list = getTodos();
      list[i].done = check.checked;
      saveTodos(list);
      renderTodos();
    });

    const text = document.createElement("span");
    text.className = "todo-text";
    text.textContent = t.text;

    const del = document.createElement("button");
    del.className = "todo-del";
    del.textContent = "×";
    del.title = "Delete";
    del.addEventListener("click", () => {
      const list = getTodos();
      list.splice(i, 1);
      saveTodos(list);
      renderTodos();
    });

    li.append(check, text, del);
    tl.appendChild(li);
  });
}

tf.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = ti.value.trim();
  if (!text) return;
  const list = getTodos();
  list.push({ text, done: false });
  saveTodos(list);
  ti.value = "";
  renderTodos();
});

tx.addEventListener("click", () => {
  saveTodos(getTodos().filter((t) => !t.done));
  renderTodos();
});

const na = $("#notesArea");
const ns = $("#notesSaved");

na.value = store.get("pulse.notes", "");

let nt = null;
na.addEventListener("input", () => {
  ns.textContent = "typing…";
  clearTimeout(nt);
  nt = setTimeout(() => {
    store.set("pulse.notes", na.value);
    ns.textContent = "saved";
  }, 500);
});

const panels = document.querySelectorAll(".panel");
const toggles = {
  todoPanel: $("#todoToggle"),
  notesPanel: $("#notesToggle"),
  settingsPanel: $("#settingsToggle"),
};

function closeAllPanels(except) {
  panels.forEach((p) => {
    if (p.id !== except) p.classList.remove("open");
  });
}

Object.entries(toggles).forEach(([id, btn]) => {
  btn.addEventListener("click", () => {
    const panel = document.getElementById(id);
    const wasOpen = panel.classList.contains("open");
    closeAllPanels();
    if (!wasOpen) panel.classList.add("open");
  });
});

document.querySelectorAll(".panel-close").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.getElementById(btn.dataset.close).classList.remove("open");
  });
});

document.addEventListener("click", (e) => {
  const insidePanel = e.target.closest(".panel");
  const insideToggle = e.target.closest(".icon-btn");
  if (!insidePanel && !insideToggle) closeAllPanels();
});

const fb = $("#focusBtn");
const fl = $("#focusLabel");
const ft = $("#focusTime");
const fp = $("#focusProgress");
const fm = $("#focusModes");

const CIR = 2 * Math.PI * 52;
fp.style.strokeDasharray = CIR;

let fs = null;

function focusTick() {
  const elapsed = (Date.now() - fs.started) / 1000;
  const total = fs.minutes * 60;
  const left = Math.max(0, total - elapsed);
  const mm = Math.floor(left / 60);
  const ss = Math.floor(left % 60);
  ft.textContent = `${pad(mm)}:${pad(ss)}`;
  fp.style.strokeDashoffset = CIR * (1 - elapsed / total);
  if (left <= 0) {
    clearInterval(fs.interval);
    fs = null;
    fb.textContent = "Done ✓";
    fl.textContent = "finished";
    fp.style.strokeDashoffset = 0;
    try {
      new Notification("Pulse", { body: "Focus session complete. Nice work!" });
    } catch {}
  }
}

fb.addEventListener("click", () => {
  if (fs) {
    clearInterval(fs.interval);
    fs = null;
    fb.textContent = "Start";
    fl.textContent = "start";
    fp.style.strokeDashoffset = 0;
    ft.textContent = `${pad(fm.querySelector(".active").dataset.min)}:00`;
    return;
  }
  const minutes = parseInt(fm.querySelector(".active").dataset.min, 10);
  fs = {
    minutes,
    started: Date.now(),
    interval: setInterval(focusTick, 250),
  };
  fb.textContent = "Cancel";
  fl.textContent = "focusing";
  focusTick();
});

fm.addEventListener("click", (e) => {
  if (!e.target.classList.contains("focus-mode")) return;
  fm.querySelectorAll(".focus-mode").forEach((m) => m.classList.remove("active"));
  e.target.classList.add("active");
  ft.textContent = `${pad(e.target.dataset.min)}:00`;
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeAllPanels();
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
    e.preventDefault();
    si.focus();
    si.select();
  }
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "n") {
    e.preventDefault();
    ti.focus();
  }
});

const app = $("#app");
const bg = document.createElement("div");
bg.id = "bg";
document.body.prepend(bg);
const bgs = [];

function setBackground(url) {
  if (bgs.some((s) => s.url === url)) return;
  const img = new Image();
  img.onload = () => {
    const slide = document.createElement("div");
    slide.className = "bg-slide";
    slide.style.backgroundImage = `url("${url}")`;
    slide.url = url;
    bg.appendChild(slide);
    bgs.push(slide);
    if (bgs.length > 1) bgs[bgs.length - 2].classList.remove("active");
    slide.classList.add("active");
    while (bg.children.length > 4) bg.firstElementChild.remove();
  };
  img.src = url;
}

function fmtDate(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

async function loadBackground() {
  try {
    if (!API_KEY || API_KEY === "your_actual_key_here") {
      throw new Error("no API key");
    }
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 6);
    const res = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&start_date=${fmtDate(start)}&end_date=${fmtDate(end)}`
    );
    if (!res.ok) throw new Error("background request failed");
    const data = await res.json();
    data
      .filter((d) => d.media_type === "image" && d.url)
      .forEach((d) => setBackground(d.url));
  } catch {
    // No key or the request failed — fall back to the stable image pool
    // and always show the NASA background slideshow.
    FALLBACK_APOD_IMAGES.forEach((u) => setBackground(u));
  }
}

setInterval(() => {
  if (bgs.length < 2) return;
  const idx = bgs.findIndex((s) => s.classList.contains("active"));
  bgs[idx].classList.remove("active");
  bgs[(idx + 1) % bgs.length].classList.add("active");
}, 20000);

function loadAPOD() {
  app.innerHTML = `
    <div class="loading">
      <div class="loader">
        <span class="loader-ring"></span>
        <span class="loader-planet"></span>
      </div>
      <p>loading...</p>
    </div>
  `;

  fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`)
    .then(response => response.json())
    .then(data => {
      let media;

      if (data.media_type === "image" && data.url) {
        setBackground(data.url);
        media = `<img src="${data.url}" alt="${data.title || ""}"/>`;
      } else if (data.url && data.url.includes("youtube")) {
        media = `<iframe src="${data.url.replace("watch?v=", "embed/")}" allowfullscreen></iframe>`;
      } else if (data.media_type === "video" && data.url) {
        media = `<video src="${data.url}" controls></video>`;
      } else {
        // No usable NASA image/video (e.g. missing key or error object).
        // Show a stable NASA picture so the daily panel never breaks.
        setBackground(FALLBACK_APOD_IMAGES[0]);
        media = `<img src="${FALLBACK_APOD_IMAGES[0]}" alt="NASA image of the day"/>`;
      }

      app.innerHTML = `
        <h1 class="reveal">${data.title}</h1>
        <div class="media reveal">${media}</div>
        <p class="reveal">${data.explanation}</p>
        <a class="nasa-link reveal" href="https://apod.nasa.gov" target="_blank" rel="noopener">view on NASA apod</a>
      `;

      app.querySelectorAll(".reveal").forEach((el, i) => {
        el.style.animationDelay = `${0.15 + i * 0.2}s`;
      });
    })
    .catch(err => {
      app.innerHTML = `<p class="error reveal">Error: ${err.message}</p>`;
    });
}

loadBackground();
loadAPOD();
tick();
setInterval(tick, 1000);
renderShortcuts();
renderShortcutEditor();
renderTodos();
loadWeather();
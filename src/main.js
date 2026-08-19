import './styles.css';
import { startStarfield } from './stars.js';

const API_KEY = import.meta.env.VITE_NASA_API_KEY || "DEMO_KEY";

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

const clockEl = $("#clock");
const dateEl = $("#date");
const greetingEl = $("#greeting");

function pad(n) {
  return String(n).padStart(2, "0");
}

function tick() {
  const now = new Date();
  clockEl.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  dateEl.textContent = now.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const hour = now.getHours();
  const greeting = GREETINGS.find((g) => hour >= g.min && hour < g.max);
  if (greeting && greetingEl.textContent !== greeting.text) {
    greetingEl.textContent = greeting.text;
  }
}

const searchForm = $("#searchForm");
const searchInput = $("#searchInput");

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const q = searchInput.value.trim();
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

const speedDialEl = $("#speedDial");
const settingsPanel = $("#settingsPanel");
const shortcutEditor = $("#shortcutEditor");

function getShortcuts() {
  return store.get("pulse.shortcuts", DEFAULT_SHORTCUTS);
}

function saveShortcuts(list) {
  store.set("pulse.shortcuts", list);
}

function renderShortcuts() {
  speedDialEl.innerHTML = "";
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
    speedDialEl.appendChild(a);
  });
}

function renderShortcutEditor() {
  shortcutEditor.innerHTML = "";
  getShortcuts().forEach((s, i) => {
    const row = document.createElement("div");
    row.className = "shortcut-row";

    const nameInput = document.createElement("input");
    nameInput.value = s.name;
    nameInput.placeholder = "Name";
    nameInput.addEventListener("change", () => {
      const list = getShortcuts();
      list[i].name = nameInput.value;
      saveShortcuts(list);
      renderShortcuts();
    });

    const emojiInput = document.createElement("input");
    emojiInput.value = s.emoji || "";
    emojiInput.placeholder = "Emoji";
    emojiInput.maxLength = 4;
    emojiInput.style.maxWidth = "64px";
    emojiInput.addEventListener("change", () => {
      const list = getShortcuts();
      list[i].emoji = emojiInput.value;
      saveShortcuts(list);
      renderShortcuts();
    });

    const urlInput = document.createElement("input");
    urlInput.value = s.url;
    urlInput.placeholder = "https://…";
    urlInput.addEventListener("change", () => {
      let url = urlInput.value.trim();
      if (url && !/^https?:\/\//i.test(url)) url = `https://${url}`;
      const list = getShortcuts();
      list[i].url = url;
      saveShortcuts(list);
      renderShortcuts();
    });

    const delBtn = document.createElement("button");
    delBtn.className = "panel-add";
    delBtn.textContent = "−";
    delBtn.title = "Remove";
    delBtn.addEventListener("click", () => {
      const list = getShortcuts();
      list.splice(i, 1);
      saveShortcuts(list);
      renderShortcuts();
      renderShortcutEditor();
    });

    row.append(nameInput, emojiInput, urlInput, delBtn);
    shortcutEditor.appendChild(row);
  });
}

$("#addShortcut").addEventListener("click", () => {
  const list = getShortcuts();
  list.push({ name: "New", url: "https://example.com", emoji: "🔗" });
  saveShortcuts(list);
  renderShortcuts();
  renderShortcutEditor();
});

const weatherEl = $("#weather");
const weatherIcon = $("#weatherIcon");
const weatherTemp = $("#weatherTemp");

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
  weatherIcon.textContent = WEATHER_ICONS[code] || "🌡️";
  weatherTemp.textContent = `${Math.round(data.current.temperature_2m)}°`;
  weatherEl.title = "Weather • click to refresh";
}

async function loadWeather() {
  const cached = store.get("pulse.weather", null);
  if (cached && Date.now() - cached.at < 10 * 60 * 1000) {
    weatherIcon.textContent = cached.icon;
    weatherTemp.textContent = cached.temp;
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
      icon: weatherIcon.textContent,
      temp: weatherTemp.textContent,
      at: Date.now(),
    });
  } catch {
    weatherEl.title = "Weather unavailable — check location permission";
    weatherTemp.textContent = "—°";
  }
}

weatherEl.addEventListener("click", () => {
  store.set("pulse.weather", null);
  loadWeather();
});

const todoList = $("#todoList");
const todoForm = $("#todoForm");
const todoInput = $("#todoInput");
const todoCount = $("#todoCount");
const todoClear = $("#todoClear");

function getTodos() {
  return store.get("pulse.todos", []);
}

function saveTodos(list) {
  store.set("pulse.todos", list);
}

function renderTodos() {
  const todos = getTodos();
  todoList.innerHTML = "";
  const remaining = todos.filter((t) => !t.done).length;
  todoCount.textContent = `${remaining} task${remaining === 1 ? "" : "s"} left`;
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
    todoList.appendChild(li);
  });
}

todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = todoInput.value.trim();
  if (!text) return;
  const list = getTodos();
  list.push({ text, done: false });
  saveTodos(list);
  todoInput.value = "";
  renderTodos();
});

todoClear.addEventListener("click", () => {
  saveTodos(getTodos().filter((t) => !t.done));
  renderTodos();
});

const notesArea = $("#notesArea");
const notesSaved = $("#notesSaved");

notesArea.value = store.get("pulse.notes", "");

let notesTimer = null;
notesArea.addEventListener("input", () => {
  notesSaved.textContent = "typing…";
  clearTimeout(notesTimer);
  notesTimer = setTimeout(() => {
    store.set("pulse.notes", notesArea.value);
    notesSaved.textContent = "saved";
  }, 500);
});

const panels = document.querySelectorAll(".panel");
const panelToggles = {
  todoPanel: $("#todoToggle"),
  notesPanel: $("#notesToggle"),
  settingsPanel: $("#settingsToggle"),
};

function closeAllPanels(except) {
  panels.forEach((p) => {
    if (p.id !== except) p.classList.remove("open");
  });
}

Object.entries(panelToggles).forEach(([id, btn]) => {
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

const focusBtn = $("#focusBtn");
const focusLabel = $("#focusLabel");
const focusTime = $("#focusTime");
const focusProgress = $("#focusProgress");
const focusModes = $("#focusModes");

const CIRCUMFERENCE = 2 * Math.PI * 52;
focusProgress.style.strokeDasharray = CIRCUMFERENCE;

let focusState = null;

function focusTick() {
  const elapsed = (Date.now() - focusState.started) / 1000;
  const total = focusState.minutes * 60;
  const left = Math.max(0, total - elapsed);
  const mm = Math.floor(left / 60);
  const ss = Math.floor(left % 60);
  focusTime.textContent = `${pad(mm)}:${pad(ss)}`;
  focusProgress.style.strokeDashoffset = CIRCUMFERENCE * (1 - elapsed / total);
  if (left <= 0) {
    clearInterval(focusState.interval);
    focusState = null;
    focusBtn.textContent = "Done ✓";
    focusLabel.textContent = "finished";
    focusProgress.style.strokeDashoffset = 0;
    try {
      new Notification("Pulse", { body: "Focus session complete. Nice work!" });
    } catch {}
  }
}

focusBtn.addEventListener("click", () => {
  if (focusState) {
    clearInterval(focusState.interval);
    focusState = null;
    focusBtn.textContent = "Start";
    focusLabel.textContent = "start";
    focusProgress.style.strokeDashoffset = 0;
    focusTime.textContent = `${pad(focusModes.querySelector(".active").dataset.min)}:00`;
    return;
  }
  const minutes = parseInt(focusModes.querySelector(".active").dataset.min, 10);
  focusState = {
    minutes,
    started: Date.now(),
    interval: setInterval(focusTick, 250),
  };
  focusBtn.textContent = "Cancel";
  focusLabel.textContent = "focusing";
  focusTick();
});

focusModes.addEventListener("click", (e) => {
  if (!e.target.classList.contains("focus-mode")) return;
  focusModes.querySelectorAll(".focus-mode").forEach((m) => m.classList.remove("active"));
  e.target.classList.add("active");
  focusTime.textContent = `${pad(e.target.dataset.min)}:00`;
});

if ("Notification" in window && Notification.permission === "default") {
  Notification.requestPermission().catch(() => {});
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeAllPanels();
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
    e.preventDefault();
    searchInput.focus();
    searchInput.select();
  }
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "n") {
    e.preventDefault();
    todoInput.focus();
  }
});

const app = $("#app");
const bg = document.createElement("div");
bg.id = "bg";
document.body.prepend(bg);
const bgSlides = [];

function setBackground(url) {
  if (bgSlides.some((s) => s.url === url)) return;
  const img = new Image();
  img.onload = () => {
    const slide = document.createElement("div");
    slide.className = "bg-slide";
    slide.style.backgroundImage = `url("${url}")`;
    slide.url = url;
    bg.appendChild(slide);
    bgSlides.push(slide);
    if (bgSlides.length > 1) bgSlides[bgSlides.length - 2].classList.remove("active");
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
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 6);
    const res = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&start_date=${fmtDate(start)}&end_date=${fmtDate(end)}`
    );
    if (!res.ok) throw new Error("background request failed");
    const data = await res.json();
    data.filter((d) => d.media_type === "image").forEach((d) => setBackground(d.url));
  } catch {
    setBackground("https://apod.nasa.gov/apod/image/2408/BarredSpiral_WebbSchmidt_960.jpg");
  }
}

setInterval(() => {
  if (bgSlides.length < 2) return;
  const idx = bgSlides.findIndex((s) => s.classList.contains("active"));
  bgSlides[idx].classList.remove("active");
  bgSlides[(idx + 1) % bgSlides.length].classList.add("active");
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

      if (data.media_type === "image") {
        setBackground(data.url);
        media = `<img src="${data.url}" alt="${data.title}"/>`;
      } else if (data.url?.includes("youtube")) {
        media = `<iframe src="${data.url.replace("watch?v=", "embed/")}" allowfullscreen></iframe>`;
      } else {
        media = `<video src="${data.url}" controls></video>`;
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

startStarfield();
loadBackground();
loadAPOD();
tick();
setInterval(tick, 1000);
renderShortcuts();
renderShortcutEditor();
renderTodos();
loadWeather();
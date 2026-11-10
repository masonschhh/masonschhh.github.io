"use strict";
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const EMAIL = "mace.schindler@icloud.com";

/* ---------- Daten ---------- */
const cases = {
  shift: {
    kicker: "Projekt 001 / 2026", title: "SHIFT <em>– Plantinos</em>",
    desc: "Für die Schulaufgabe SHIFT habe ich eine Snack-Marke entwickelt: Plantinos, Kochbananen-Chips mit Chili und Limette.",
    facts: [["Kontext", "Schulprojekt · Modul 275"], ["Meine Rolle", "Konzept, Logo, Verpackung, Social Media"], ["Umsetzung", "Logo, Farbwelt und Typografie entwickelt und auf Verpackungen und Social-Media-Entwürfe übertragen."], ["Ergebnis", "Ein dokumentiertes Markenkonzept mit Verpackungs-Mockups und einer Social-Media-Serie."]],
    images: [1, 2, 3, 4, 5, 6, 7, 8].map(i => [`/images-shift-page-${i}.webp`, i === 1 ? "SHIFT – Titelseite" : `SHIFT – Doppelseite ${i - 1}`]),
  },
  "ew-hoefe": {
    kicker: "Projekt 002 / 2025", title: "Connected <em>– EW Höfe</em>",
    desc: "Ein Magazin für EW Höfe, gestaltet im Rahmen eines Schulprojekts. Das Layout verbindet Energie-Themen, Bilder und Zahlen zu einer zusammenhängenden Publikation.",
    facts: [["Kontext", "Schulprojekt · Modul 273"], ["Meine Rolle", "Magazingestaltung und Layout"], ["Umsetzung", "Texte, Bilder und Zahlen in Magazinseiten angeordnet, Typografie und Seitenhierarchie ausgearbeitet."]],
    images: [1, 2, 3, 4, 5].map(i => [`/images-ew-hoefe-page-${i}.webp`, i === 1 ? "Connected – Titelseite" : i === 5 ? "Connected – Rückseite" : `Connected – Doppelseite ${i - 1}`]),
  },
  luzern: {
    kicker: "Projekt 003 / 2025–2026", title: "Luzern <em>entdecken</em>",
    desc: "Zwei Schulaufgaben zu Luzern Tourismus: ein F200-Plakat für Kurzferien und eine Infografik über Hotelgäste von 2018 bis 2024, im vorgegebenen Branding.",
    facts: [["Kontext", "Schulprojekt · Modul 274"], ["Meine Rolle", "Gestaltung gemeinsam mit Mathis"], ["Hinweis", "Plakatillustration KI-generiert; Bildquelle der Infografik im Original ausgewiesen."]],
    images: [["/images-luzern-plakat-page-1.webp", "Luzern – F200-Plakat"], ["/images-luzern-infografik-page-1.webp", "Luzern – Infografik Hotelgäste"]],
  },
};
const photos = [
  ["eisvogel", "Eisvogel", "Eisvogel auf einem Ast vor grünem Hintergrund", "Natur · 2026", "1/400 s · f/6,3 · ISO 800 · 300 mm · Sony α7 III"],
  ["multiplicity", "Multiplicity", "Fotomontage mit vier Versionen von Mason auf einer geschwungenen Treppe", "Fotomontage · 2024", "1/125 s · f/7,1 · ISO 1000 · 18 mm · Canon EOS R7"],
  ["oldtimer-01", "Borgward Isabella", "Mintgrüner Borgward Isabella vor einer Garage", "Chrom & Charakter · 2025", "1/500 s · f/14 · ISO 320 · 18 mm · Canon EOS R7"],
  ["oldtimer-02", "Am Steuer", "Lenkrad und Armaturen eines klassischen Mercedes mit roten Sitzen", "Chrom & Charakter · 2025", "1/20 s · f/3,5 · ISO 800 · 50 mm · Canon EOS R7"],
  ["oldtimer-03", "Chrom & Kurven", "Detailaufnahme der Front eines mintgrünen Borgward Isabella", "Chrom & Charakter · 2025", "1/400 s · f/18 · ISO 400 · 18 mm · Canon EOS R7"],
  ["oldtimer-04", "Isabella von hinten", "Heck eines Borgward Isabella Coupés", "Chrom & Charakter · 2025", "1/400 s · f/11 · ISO 400 · 18 mm · Canon EOS R7"],
  ["oldtimer-05", "Drei Klassiker", "Drei klassische Mercedes in einer Reihe im Sonnenlicht", "Chrom & Charakter · 2025", "1/400 s · f/10 · ISO 500 · 18 mm · Canon EOS R7"],
  ["oldtimer-06", "Rote Sitze", "Roter Innenraum eines klassischen Mercedes 220 SE", "Chrom & Charakter · 2025", "1/400 s · f/7,1 · ISO 1000 · 18 mm · Canon EOS R7"],
].map(([id, title, alt, sub, exif]) => ({ src: `/images-photo-${id}.webp`, title, alt, sub, exif }));
const films = [
  { src: "/video-uek-modul-267.mp4", poster: "/images-projects-uek-video.jpg", title: "ÜK – Modul 267" },
  { src: "/video-der-weg-eines-auftrags.mp4", poster: "/images-projects-animation.jpg", title: "Der Weg eines Auftrags" },
];

/* ---------- Dialoge ---------- */
function openDialog(d) {
  d._return = document.activeElement;
  d.showModal();
  document.body.classList.add("locked");
}
function closeDialog(d) {
  if (!d.open) return;
  d.close();
}
$$("dialog").forEach(d => {
  d.addEventListener("close", () => {
    if (!$$("dialog").some(x => x.open)) document.body.classList.remove("locked");
    d._return?.focus?.({ preventScroll: true });
    d.dispatchEvent(new Event("closed"));
  });
  d.addEventListener("click", e => { if (e.target === d || e.target.closest("[data-close]")) closeDialog(d); });
});

/* ---------- Navigation ---------- */
const nav = $("#nav"), progress = $(".nav-progress");
const links = $$(".nav nav a");
const sections = links.map(a => $(a.getAttribute("href")));
let ticking = false;
function onScroll() {
  ticking = false;
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
  nav.classList.toggle("scrolled", scrollY > 10);
  const under = document.elementsFromPoint(innerWidth / 2, 70).find(el => el.closest?.(".darkroom,.cinema"));
  nav.classList.toggle("on-dark", !!under);
  let current = -1;
  sections.forEach((s, i) => { if (s && s.getBoundingClientRect().top < innerHeight * .4) current = i; });
  links.forEach((a, i) => a.classList.toggle("active", i === current));
}
addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
onScroll();

/* ---------- Einblenden ---------- */
if (!reduced && "IntersectionObserver" in window) {
  const io = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px" });
  $$(".sec-head, .case, .screen, .podcast, .cv-photo, .cv-block, .cv-lead, .contact-head, .form").forEach((el, i) => {
    el.classList.add("reveal");
    el.style.transitionDelay = el.classList.contains("case") ? `${(i % 3) * 90}ms` : "";
    io.observe(el);
  });
}

/* ---------- Türen ---------- */
$$(".door").forEach(door => door.addEventListener("click", e => {
  const target = $(door.getAttribute("href"));
  if (!target) return;
  e.preventDefault();
  const go = () => {
    target.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
    history.replaceState(null, "", door.getAttribute("href"));
  };
  if (reduced) return go();
  door.classList.add("open");
  setTimeout(go, 520);
  setTimeout(() => door.classList.remove("open"), 1400);
}));

/* ---------- Projektansicht ---------- */
const caseDialog = $("#caseDialog");
$$("[data-case]").forEach(btn => btn.addEventListener("click", () => {
  const c = cases[btn.dataset.case];
  $("#caseKicker").textContent = c.kicker;
  $("#caseTitle").innerHTML = c.title;
  $("#caseDesc").textContent = c.desc;
  $("#caseFacts").innerHTML = c.facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("");
  const gallery = $("#caseGallery");
  gallery.innerHTML = "";
  c.images.forEach(([src, label], i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.setAttribute("aria-label", `${label} vergrössern`);
    b.innerHTML = `<img src="${src}" alt="${label}" loading="${i < 2 ? "eager" : "lazy"}">`;
    b.addEventListener("click", () => openLightbox(c.images.map(([s, t]) => ({ src: s, title: t, alt: t })), i));
    gallery.append(b);
  });
  openDialog(caseDialog);
  caseDialog.scrollTop = 0;
}));

/* ---------- Bildbetrachter ---------- */
const lb = $("#lightbox");
let lbItems = [], lbIndex = 0, touchX = null;
function renderLightbox() {
  const it = lbItems[lbIndex];
  $("#lbImg").src = it.src;
  $("#lbImg").alt = it.alt;
  $("#lbTitle").textContent = it.title;
  $("#lbExif").textContent = it.exif || "";
  $("#lbCount").textContent = `${String(lbIndex + 1).padStart(2, "0")} / ${String(lbItems.length).padStart(2, "0")}`;
  const n = lbItems[(lbIndex + 1) % lbItems.length];
  if (n) new Image().src = n.src;
}
function openLightbox(items, i) { lbItems = items; lbIndex = i; renderLightbox(); openDialog(lb); }
function stepLightbox(d) { lbIndex = (lbIndex + d + lbItems.length) % lbItems.length; renderLightbox(); }
$$("[data-lb]", lb).forEach(b => b.addEventListener("click", () => stepLightbox(+b.dataset.lb)));
lb.addEventListener("keydown", e => { if (e.key === "ArrowRight") stepLightbox(1); if (e.key === "ArrowLeft") stepLightbox(-1); });
lb.addEventListener("touchstart", e => { touchX = e.touches[0].clientX; }, { passive: true });
lb.addEventListener("touchend", e => { if (touchX === null) return; const dx = e.changedTouches[0].clientX - touchX; touchX = null; if (Math.abs(dx) > 45) stepLightbox(dx < 0 ? 1 : -1); });

/* ---------- Fotostrecke ---------- */
const strip = $("#strip");
photos.forEach((p, i) => {
  const b = document.createElement("button");
  b.type = "button"; b.className = "shot";
  b.setAttribute("aria-label", `${p.title} ansehen`);
  b.innerHTML = `<img src="${p.src}" alt="${p.alt}" loading="${i < 2 ? "eager" : "lazy"}"><figcaption><b>${p.title}</b><span class="mono">${p.sub}</span></figcaption>`;
  b.addEventListener("click", () => openLightbox(photos, i));
  strip.append(b);
});
const shots = $$(".shot", strip);
function currentShot() {
  const mid = strip.scrollLeft + strip.clientWidth / 2;
  let best = 0, dist = Infinity;
  shots.forEach((s, i) => { const d = Math.abs(s.offsetLeft + s.offsetWidth / 2 - mid); if (d < dist) { dist = d; best = i; } });
  return best;
}
strip.addEventListener("scroll", () => { $("#stripCount").textContent = `${String(currentShot() + 1).padStart(2, "0")} / 08`; }, { passive: true });
$$("[data-strip]").forEach(b => b.addEventListener("click", () => {
  const i = Math.max(0, Math.min(shots.length - 1, currentShot() + +b.dataset.strip));
  const s = shots[i];
  strip.scrollTo({ left: s.offsetLeft - (strip.clientWidth - s.offsetWidth) / 2, behavior: reduced ? "auto" : "smooth" });
}));
strip.addEventListener("keydown", e => { if (e.key === "ArrowRight" || e.key === "ArrowLeft") { e.preventDefault(); $(`[data-strip="${e.key === "ArrowRight" ? 1 : -1}"]`).click(); } });

/* ---------- Filme ---------- */
const video = $("#film");
$$("[data-film]").forEach(btn => btn.addEventListener("click", () => {
  const f = films[+btn.dataset.film];
  $$("[data-film]").forEach(b => b.setAttribute("aria-selected", String(b === btn)));
  video.pause();
  video.poster = f.poster;
  video.querySelector("source").src = f.src;
  video.setAttribute("aria-label", f.title);
  video.load();
}));

/* ---------- Podcast ---------- */
const pod = $("#pod"), player = $(".player"), seek = $("#podSeek"), wave = $("#wave");
const clock = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
wave.innerHTML = Array.from({ length: 44 }, (_, i) => `<i style="height:${18 + ((i * 37 + 11) % 82)}%;animation-delay:${-i * .07}s"></i>`).join("");
const bars = $$("i", wave);
function syncPod() {
  const dur = pod.duration || 1549;
  seek.max = dur; seek.value = pod.currentTime;
  $("#podTime").textContent = clock(pod.currentTime);
  $("#podDur").textContent = clock(dur);
  const on = Math.round(pod.currentTime / dur * bars.length);
  bars.forEach((b, i) => b.classList.toggle("on", i < on));
}
$("#podPlay").addEventListener("click", async () => {
  if (!pod.paused) return pod.pause();
  try { await pod.play(); } catch { $("#podState").textContent = "Fehler – bitte nochmals"; }
});
pod.addEventListener("play", () => { player.classList.add("playing"); $("#podState").textContent = "Läuft"; $("#podPlay").setAttribute("aria-label", "Podcast pausieren"); });
pod.addEventListener("pause", () => { player.classList.remove("playing"); $("#podState").textContent = "Pausiert"; $("#podPlay").setAttribute("aria-label", "Podcast abspielen"); });
pod.addEventListener("timeupdate", syncPod);
pod.addEventListener("loadedmetadata", syncPod);
seek.addEventListener("input", () => { pod.currentTime = +seek.value; syncPod(); });
video.addEventListener("play", () => pod.pause());
pod.addEventListener("play", () => video.pause());

/* ---------- Kontaktformular ---------- */
const form = $("#form"), status = $("#formStatus"), send = $(".send", form);
let sending = false;
function say(msg, kind = "") { status.textContent = msg; status.className = `status full ${kind}`; }
form.addEventListener("submit", async e => {
  e.preventDefault();
  if (sending) return;
  const data = new FormData(form), v = n => String(data.get(n) || "").trim();
  if (v("_honey")) return;
  const missing = !v("name") ? "deinen Namen" : !/^\S+@\S+\.\S+$/.test(v("email")) ? "eine gültige E-Mail" : !v("kind") ? "worum es geht" : !v("message") ? "eine Nachricht" : "";
  if (missing) return say(`Bitte gib noch ${missing} an.`, "error");
  sending = true; send.disabled = true; say("Wird gesendet …");
  const ctrl = new AbortController(), t = setTimeout(() => ctrl.abort(), 20000);
  try {
    const res = await fetch(`https://formsubmit.co/ajax/${EMAIL}`, {
      method: "POST", signal: ctrl.signal,
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ name: v("name"), email: v("email"), Anfrage: v("kind"), Nachricht: v("message"),
        _subject: `Portfolio-Anfrage: ${v("kind")} – ${v("name")}`.replace(/[\r\n]/g, " "), _replyto: v("email"), _template: "table", _honey: "", _url: "https://masonschindler.ch/" }),
    });
    const r = await res.json();
    if (/activat|confirm|check.{0,30}(email|inbox)/i.test(String(r.message || ""))) throw new Error("activation");
    if (!res.ok || !(r.success === true || r.success === "true")) throw new Error("delivery");
    form.reset(); say("Danke! Deine Anfrage ist angekommen. Ich melde mich bei dir.", "ok");
  } catch {
    say(`Das hat leider nicht geklappt. Deine Eingaben bleiben erhalten – schreib mir sonst direkt an ${EMAIL}.`, "error");
  } finally { clearTimeout(t); sending = false; send.disabled = false; }
});

/* ---------- Snake (Easter Egg im letzten R) ---------- */
(() => {
  const dlg = $("#snake"), cv = $("#snCanvas"), ctx = cv.getContext("2d"), startBtn = $("#snStart");
  const N = 18, C = cv.width / N;
  let snake, dir, queued, food, score, timer = null, best = 0;
  try { best = +localStorage.getItem("mason-snake-best") || 0; } catch {}
  const pad = n => String(n).padStart(2, "0");
  const dirs = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
  const keys = { ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right", w: "up", s: "down", a: "left", d: "right" };
  function place() {
    const free = [];
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) if (!snake.some(p => p[0] === x && p[1] === y)) free.push([x, y]);
    return free[Math.floor(Math.random() * free.length)];
  }
  function reset() { snake = [[8, 9], [7, 9], [6, 9]]; dir = queued = dirs.right; food = [12, 9]; score = 0; draw(); updateScore(); }
  function updateScore() { $("#snScore").textContent = pad(score); $("#snBest").textContent = pad(best); }
  function draw() {
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { ctx.fillStyle = (x + y) % 2 ? "#cdd5af" : "#d9deba"; ctx.fillRect(x * C, y * C, C, C); }
    if (food) { ctx.fillStyle = "#ba452e"; ctx.beginPath(); ctx.arc(food[0] * C + C / 2, food[1] * C + C / 2 + 1, C * .36, 0, 7); ctx.fill(); ctx.fillStyle = "#597346"; ctx.fillRect(food[0] * C + C / 2, food[1] * C + 2, 3, 5); }
    snake.forEach((p, i) => { ctx.fillStyle = i ? "#526d45" : "#263d2d"; ctx.beginPath(); ctx.roundRect(p[0] * C + 1, p[1] * C + 1, C - 2, C - 2, i ? 4 : 7); ctx.fill(); });
  }
  function stop(msg) { clearInterval(timer); timer = null; startBtn.textContent = msg; startBtn.hidden = false; }
  function tick() {
    dir = queued;
    const h = [snake[0][0] + dir[0], snake[0][1] + dir[1]];
    const eat = food && h[0] === food[0] && h[1] === food[1];
    const body = eat ? snake : snake.slice(0, -1);
    if (h[0] < 0 || h[1] < 0 || h[0] >= N || h[1] >= N || body.some(p => p[0] === h[0] && p[1] === h[1])) { draw(); return stop(`${score} Äpfel · Nochmal ↗`); }
    snake.unshift(h);
    if (eat) {
      score++; if (score > best) { best = score; try { localStorage.setItem("mason-snake-best", best); } catch {} }
      food = place(); updateScore();
      clearInterval(timer); timer = setInterval(tick, Math.max(80, 170 - score * 4));
      if (!food) { draw(); return stop("Alles aufgefressen! ↗"); }
    } else snake.pop();
    draw();
  }
  function steer(name) { const d = dirs[name]; if (!timer || (d[0] === -dir[0] && d[1] === -dir[1])) return; queued = d; }
  startBtn.addEventListener("click", () => { reset(); startBtn.hidden = true; timer = setInterval(tick, 170); cv.focus(); });
  dlg.addEventListener("keydown", e => { const k = keys[e.key] || keys[e.key.toLowerCase?.()]; if (k) { e.preventDefault(); steer(k); } });
  $$("[data-dir]", dlg).forEach(b => b.addEventListener("click", () => steer(b.dataset.dir)));
  let t0 = null;
  cv.addEventListener("pointerdown", e => { t0 = [e.clientX, e.clientY]; });
  cv.addEventListener("pointerup", e => { if (!t0) return; const dx = e.clientX - t0[0], dy = e.clientY - t0[1]; t0 = null; if (Math.max(Math.abs(dx), Math.abs(dy)) < 14) return; steer(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : (dy > 0 ? "down" : "up")); });
  cv.tabIndex = 0;
  $("#snakeOpen").addEventListener("click", () => { reset(); startBtn.textContent = "Losspielen ↗"; startBtn.hidden = false; openDialog(dlg); startBtn.focus(); });
  dlg.addEventListener("closed", () => { clearInterval(timer); timer = null; });
})();

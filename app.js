"use strict";
/* Mason Schindler — Portfolio 2026
   GSAP + ScrollTrigger (vendor/), Lenis (vendor/). Alles funktioniert auch ohne. */
(() => {
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const root = document.documentElement, body = document.body;
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
const G = window.gsap, ST = window.ScrollTrigger;
const hasG = !!(G && ST);
const motion = hasG && !reduced;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const pad2 = n => String(n).padStart(2, "0");
if (hasG) { G.registerPlugin(ST); ST.config({ ignoreMobileResize: true }); }

/* ---------- Daten ---------- */
const cases = {
  shift: {
    kicker: "Projekt 001 / 2026", title: "SHIFT <em>– Plantinos</em>",
    desc: "Für die Schulaufgabe SHIFT habe ich eine Snack-Marke entwickelt: Plantinos, Kochbananen-Chips mit Chili und Limette.",
    facts: [["Kontext", "Schulprojekt · Modul 275"], ["Meine Rolle", "Konzept, Logo, Verpackung, Social Media"], ["Umsetzung", "Logo, Farbwelt und Typografie entwickelt und auf Verpackungen und Social-Media-Entwürfe übertragen."], ["Ergebnis", "Ein dokumentiertes Markenkonzept mit Verpackungs-Mockups und einer Social-Media-Serie."]],
    images: [1, 2, 3, 4, 5, 6, 7, 8].map(i => [`images-shift-page-${i}.webp`, i === 1 ? "SHIFT – Titelseite" : `SHIFT – Doppelseite ${i - 1}`, ""]),
  },
  "ew-hoefe": {
    kicker: "Projekt 002 / 2025", title: "Connected <em>– EW Höfe</em>",
    desc: "Ein Magazin für EW Höfe, gestaltet im Rahmen eines Schulprojekts. Das Layout verbindet Energie-Themen, Bilder und Zahlen zu einer zusammenhängenden Publikation.",
    facts: [["Kontext", "Schulprojekt · Modul 273"], ["Meine Rolle", "Magazingestaltung und Layout"], ["Umsetzung", "Texte, Bilder und Zahlen in Magazinseiten angeordnet, Typografie und Seitenhierarchie ausgearbeitet."]],
    images: [["images-ew-hoefe-page-1.webp", "Connected – Titelseite", "half"], ["images-ew-hoefe-page-5.webp", "Connected – Rückseite", "half"], ...[2, 3, 4].map(i => [`images-ew-hoefe-page-${i}.webp`, `Connected – Doppelseite ${i - 1}`, ""])],
  },
  luzern: {
    kicker: "Projekt 003 / 2025–2026", title: "Luzern <em>entdecken</em>",
    desc: "Zwei Schulaufgaben zu Luzern Tourismus: ein F200-Plakat für Kurzferien und eine Infografik über Hotelgäste von 2018 bis 2024, im vorgegebenen Branding.",
    facts: [["Kontext", "Schulprojekt · Modul 274"], ["Meine Rolle", "Gestaltung gemeinsam mit Mathis"], ["Hinweis", "Plakatillustration KI-generiert; Bildquelle der Infografik im Original ausgewiesen."]],
    images: [["images-luzern-plakat-page-1.webp", "Luzern – F200-Plakat", "portrait"], ["images-luzern-infografik-page-1.webp", "Luzern – Infografik Hotelgäste", ""]],
  },
};
const caseOrder = Object.keys(cases);
const films = [
  { src: "video-uek-modul-267.mp4", poster: "images-projects-uek-video.jpg", title: "ÜK – Modul 267", kicker: "Film 01 · 3:13" },
  { src: "video-der-weg-eines-auftrags.mp4", poster: "images-projects-animation.jpg", title: "Der Weg eines Auftrags", kicker: "Film 02 · 2:53" },
];
const trailSet = [
  ["photo-eisvogel", 373 / 560], ["shift-page-1", 560 / 396], ["photo-oldtimer-01", 560 / 373], ["ew-hoefe-page-1", 396 / 560],
  ["photo-multiplicity", 560 / 373], ["luzern-plakat-page-1", 384 / 560], ["photo-oldtimer-05", 560 / 373], ["projects-animation", 560 / 315],
  ["photo-oldtimer-02", 560 / 373], ["ew-hoefe-page-3", 560 / 396], ["photo-oldtimer-06", 560 / 373], ["luzern-infografik-page-1", 560 / 396], ["photo-oldtimer-03", 560 / 376],
];

/* ---------- Uhrzeit Luzern ---------- */
(() => {
  let fmt;
  try { fmt = new Intl.DateTimeFormat("de-CH", { timeZone: "Europe/Zurich", hour: "2-digit", minute: "2-digit" }); } catch { return; }
  const tick = () => { const t = fmt.format(new Date()); $$("[data-clock]").forEach(e => { e.textContent = t; }); };
  tick(); setInterval(tick, 10000);
})();

/* ---------- Text zerlegen ---------- */
function splitChars(el, mask = true) {
  const chars = [];
  if (mask && !el.hasAttribute("aria-label")) el.setAttribute("aria-label", el.textContent.replace(/\s+/g, " ").trim());
  const walk = node => {
    [...node.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(part => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.append(document.createTextNode(" ")); return; }
          let holder = frag;
          if (mask) { holder = document.createElement("span"); holder.className = "wm"; holder.setAttribute("aria-hidden", "true"); }
          for (const ch of part) { const c = document.createElement("span"); c.className = "c"; c.textContent = ch; holder.append(c); chars.push(c); }
          if (mask) frag.append(holder);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1 && !/^(BR|BUTTON)$/.test(n.tagName)) walk(n);
    });
  };
  walk(el);
  return chars;
}
function splitWords(el) {
  const words = [];
  const walk = node => {
    [...node.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(part => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.append(document.createTextNode(part)); return; }
          const w = document.createElement("span"); w.className = "w"; w.textContent = part; frag.append(w); words.push(w);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1 && n.tagName !== "BR") walk(n);
    });
  };
  walk(el);
  return words;
}

/* ---------- Smooth Scroll ---------- */
let lenis = null;
if (motion && window.Lenis) {
  lenis = new Lenis({ lerp: .095, wheelMultiplier: 1, anchors: false });
  lenis.on("scroll", ST.update);
  G.ticker.add(t => lenis.raf(t * 1000));
  G.ticker.lagSmoothing(0);
}
const easeOutExpo = t => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
function goTo(target, opts = {}) {
  const el = typeof target === "string" ? $(target) : target;
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: opts.offset || 0, duration: 1.7, immediate: !!opts.immediate, easing: easeOutExpo, force: true });
  else el.scrollIntoView({ behavior: reduced || opts.immediate ? "auto" : "smooth", block: "start" });
}
const aliases = { "#kino": "#film", "#cv": "#lebenslauf", "#raeume": "#arbeiten" };

/* ---------- Dialoge ---------- */
const openDialogs = () => $$("dialog").filter(d => d.open);
function lock(on) {
  if (on) { lenis?.stop(); body.classList.add("locked"); }
  else if (!openDialogs().length) { lenis?.start(); body.classList.remove("locked"); }
}
function openDialog(d) {
  if (d.open) return;
  d._return = document.activeElement;
  d.showModal();
  lock(true);
  $(".cursor")?.classList.remove("on");
  if (motion && d.enter) d.enter();
}
function closeDialog(d) {
  if (!d.open || d._closing) return;
  if (motion && d.leave) { d._closing = true; d.leave(() => { d._closing = false; if (d.open) d.close(); }); }
  else d.close();
}
$$("dialog").forEach(d => {
  d.setAttribute("data-lenis-prevent", "");
  d.addEventListener("cancel", e => { e.preventDefault(); closeDialog(d); });
  d.addEventListener("close", () => {
    d._closing = false;
    if (hasG) G.set(d, { clearProps: "clipPath,opacity" });
    lock(false);
    d._return?.focus?.({ preventScroll: true });
    d.dispatchEvent(new Event("closed"));
  });
  d.addEventListener("click", e => {
    if (e.target.closest("[data-close]")) closeDialog(d);
    else if (e.target === d && d.classList.contains("snake")) closeDialog(d);
  });
});

/* ---------- Navigation ---------- */
const nav = $("#nav");
let lastY = 0;
function onScroll(y) {
  nav.classList.toggle("scrolled", y > 24);
  if (Math.abs(y - lastY) > 6) {
    nav.classList.toggle("hide", y > lastY && y > innerHeight * .7 && !body.classList.contains("locked"));
    lastY = y;
  }
}
if (lenis) lenis.on("scroll", e => onScroll(e.scroll));
else addEventListener("scroll", () => onScroll(scrollY), { passive: true });
nav.addEventListener("focusin", () => nav.classList.remove("hide"));

const menu = $("#menu");
document.addEventListener("click", e => {
  const a = e.target.closest('a[href^="#"]');
  if (!a || e.defaultPrevented) return;
  const hash = aliases[a.getAttribute("href")] || a.getAttribute("href");
  const el = hash.length > 1 ? $(hash) : null;
  if (!el) return;
  e.preventDefault();
  const go = () => {
    goTo(el);
    if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
    el.focus({ preventScroll: true });
  };
  // Aus dem Menü: erst schliessen (gibt das Scrollen wieder frei), dann springen.
  if (menu.open) { menu.addEventListener("closed", () => requestAnimationFrame(go), { once: true }); closeDialog(menu); }
  else go();
  history.replaceState(null, "", hash === "#start" ? location.pathname : hash);
});

/* Menü */
$("#menuOpen").addEventListener("click", () => openDialog(menu));
menu.enter = () => {
  G.fromTo(menu, { clipPath: "circle(0% at 92% 3%)" }, { clipPath: "circle(150% at 92% 3%)", duration: .9, ease: "expo.inOut", clearProps: "clipPath" });
  G.fromTo($$(".ml", menu), { yPercent: 110 }, { yPercent: 0, duration: 1, ease: "expo.out", stagger: .05, delay: .28 });
  G.fromTo($$(".menu-links .mono, .menu-foot, .menu-bar", menu), { opacity: 0 }, { opacity: 1, duration: .6, delay: .45, stagger: .03 });
};
menu.leave = done => G.to(menu, { clipPath: "circle(0% at 92% 3%)", duration: .7, ease: "expo.inOut", onComplete: done });

/* ---------- Bildbetrachter ---------- */
const lb = $("#lightbox"), lbImg = $("#lbImg");
let lbItems = [], lbI = 0, touchX = null;
function lbApply() {
  const it = lbItems[lbI];
  lbImg.src = it.src;
  lbImg.alt = it.alt || it.title;
  $("#lbTitle").textContent = it.title;
  $("#lbExif").textContent = it.exif || "";
  $("#lbCount").textContent = `${pad2(lbI + 1)} / ${pad2(lbItems.length)}`;
  const n = lbItems[(lbI + 1) % lbItems.length];
  if (n) new Image().src = n.src;
}
function lbStep(dir) {
  if (lbItems.length < 2) return;
  lbI = (lbI + dir + lbItems.length) % lbItems.length;
  if (!motion) return lbApply();
  G.killTweensOf(lbImg);
  G.to(lbImg, { x: -50 * dir, opacity: 0, duration: .22, ease: "power2.in", onComplete: () => {
    lbApply();
    G.fromTo(lbImg, { x: 50 * dir, opacity: 0 }, { x: 0, opacity: 1, duration: .6, ease: "expo.out" });
  } });
}
function openLightbox(items, i) { lbItems = items; lbI = i; lbApply(); openDialog(lb); }
lb.enter = () => {
  G.fromTo(lb, { opacity: 0 }, { opacity: 1, duration: .45, ease: "power2.out" });
  G.fromTo(lbImg, { scale: .92, opacity: 0, x: 0 }, { scale: 1, opacity: 1, duration: .9, ease: "expo.out", delay: .08 });
};
lb.leave = done => G.to(lb, { opacity: 0, duration: .3, ease: "power2.in", onComplete: done });
$$("[data-lb]", lb).forEach(b => b.addEventListener("click", () => lbStep(+b.dataset.lb)));
lb.addEventListener("keydown", e => { if (e.key === "ArrowRight") lbStep(1); if (e.key === "ArrowLeft") lbStep(-1); });
lb.addEventListener("touchstart", e => { touchX = e.touches[0].clientX; }, { passive: true });
lb.addEventListener("touchend", e => {
  if (touchX === null) return;
  const dx = e.changedTouches[0].clientX - touchX; touchX = null;
  if (Math.abs(dx) > 45) lbStep(dx < 0 ? 1 : -1);
});

/* ---------- Projektansicht ---------- */
const caseD = $("#caseDialog"), gallery = $("#caseGallery");
let currentCase = null, galleryIO = null;
function fillCase(id) {
  const c = cases[id];
  currentCase = id;
  $("#caseKicker").textContent = c.kicker;
  $("#caseTitle").innerHTML = c.title;
  $("#caseDesc").textContent = c.desc;
  $("#caseFacts").innerHTML = c.facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("");
  gallery.innerHTML = "";
  galleryIO?.disconnect();
  const items = c.images.map(([src, label]) => ({ src, title: label, alt: label }));
  c.images.forEach(([src, label, kind], i) => {
    const b = document.createElement("button");
    b.type = "button";
    if (kind) b.className = kind;
    b.setAttribute("aria-label", `${label} vergrössern`);
    b.innerHTML = `<img src="${src}" alt="${label}" loading="${i < 3 ? "eager" : "lazy"}" decoding="async">`;
    b.addEventListener("click", () => openLightbox(items, i));
    gallery.append(b);
  });
  const next = cases[caseOrder[(caseOrder.indexOf(id) + 1) % caseOrder.length]];
  $("#caseNextTitle").innerHTML = next.title;
  caseD.scrollTop = 0;
  if (motion && "IntersectionObserver" in window) {
    galleryIO = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); galleryIO.unobserve(en.target); } }), { root: caseD, rootMargin: "0px 0px -6% 0px" });
    $$("button", gallery).forEach(b => galleryIO.observe(b));
  } else $$("button", gallery).forEach(b => b.classList.add("in"));
}
function openCase(id) {
  if (!cases[id]) return;
  fillCase(id);
  openDialog(caseD);
}
caseD.enter = () => {
  G.fromTo(caseD, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "expo.inOut", clearProps: "clipPath" });
  G.fromTo(["#caseTitle", ...$$(".case-info > *", caseD)], { y: 70, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: "expo.out", stagger: .08, delay: .5 });
};
caseD.leave = done => G.to(caseD, { clipPath: "inset(0% 0% 100% 0%)", duration: .8, ease: "expo.inOut", onComplete: done });
$("#caseNext").addEventListener("click", () => {
  const nextId = caseOrder[(caseOrder.indexOf(currentCase) + 1) % caseOrder.length];
  if (!motion) { fillCase(nextId); return; }
  const inner = $(".case-body", caseD);
  G.to(inner, { y: -40, opacity: 0, duration: .4, ease: "power2.in", onComplete: () => {
    fillCase(nextId);
    G.fromTo(inner, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "expo.out", clearProps: "transform,opacity" });
  } });
});
document.addEventListener("click", e => {
  const t = e.target.closest("[data-open-case]");
  if (!t) return;
  e.preventDefault();
  openCase(t.dataset.openCase);
});

/* ---------- Fotos ---------- */
const photoSec = $("#fotos"), phTrack = $("#phTrack"), phItems = $$(".ph", phTrack);
const photoData = phItems.map(b => ({
  src: $("img", b).getAttribute("src"), alt: $("img", b).alt, title: $("b", b).textContent,
  exif: `${$(".ph-sub", b).textContent} — ${$(".ph-exif", b).textContent}`,
}));
phItems.forEach((b, i) => b.addEventListener("click", () => openLightbox(photoData, i)));
let phIndex = 0, phPin = null;
function setPhoto(i) {
  phIndex = i;
  $("#phCount").textContent = `${pad2(i + 1)} / ${pad2(phItems.length)}`;
  if (!phPin) $("#phBar").style.transform = `scaleX(${(i + 1) / phItems.length})`;
}
function nearestPhoto() {
  const mid = innerWidth / 2;
  let best = 0, dist = Infinity;
  phItems.forEach((b, i) => { const r = b.getBoundingClientRect(); const d = Math.abs(r.left + r.width / 2 - mid); if (d < dist) { dist = d; best = i; } });
  return best;
}
function showPhoto(i) {
  i = clamp(i, 0, phItems.length - 1);
  const b = phItems[i];
  if (phPin) {
    const st = phPin.scrollTrigger, dist = phTrack.scrollWidth - innerWidth;
    const p = clamp((b.offsetLeft + b.offsetWidth / 2 - innerWidth / 2) / dist, 0, 1);
    const y = st.start + p * (st.end - st.start);
    lenis ? lenis.scrollTo(y, { duration: 1.2, easing: easeOutExpo, force: true }) : scrollTo(0, y);
  } else {
    phTrack.scrollTo({ left: b.offsetLeft - (phTrack.clientWidth - b.offsetWidth) / 2, behavior: reduced ? "auto" : "smooth" });
  }
}
phTrack.addEventListener("scroll", () => { if (!phPin) setPhoto(nearestPhoto()); }, { passive: true });
$$("[data-ph]").forEach(b => b.addEventListener("click", () => showPhoto(nearestPhoto() + +b.dataset.ph)));
phTrack.addEventListener("keydown", e => {
  if (e.target !== phTrack || !/^Arrow(Left|Right)$/.test(e.key)) return;
  e.preventDefault();
  showPhoto(nearestPhoto() + (e.key === "ArrowRight" ? 1 : -1));
});
phItems.forEach((b, i) => b.addEventListener("focus", () => { if (phPin) showPhoto(i); }));

/* ---------- Film ---------- */
const video = $("#video"), screen = $("#screen"), spBtn = $("#screenPlay");
function startFilm() {
  screen.classList.add("playing");
  video.controls = true;
  const p = video.play();
  if (p) p.catch(() => {});
  video.focus({ preventScroll: true });
}
spBtn.addEventListener("click", startFilm);
video.addEventListener("ended", () => { screen.classList.remove("playing"); video.controls = false; spBtn.focus({ preventScroll: true }); });
function selectFilm(i) {
  const f = films[i];
  $$("[data-film]").forEach(b => b.setAttribute("aria-selected", String(+b.dataset.film === i)));
  video.pause();
  video.controls = false;
  screen.classList.remove("playing");
  video.poster = f.poster;
  video.querySelector("source").src = f.src;
  video.setAttribute("aria-label", f.title);
  video.load();
  $("#spTitle").textContent = f.title;
  $("#spKicker").textContent = f.kicker;
  spBtn.setAttribute("aria-label", `Film abspielen: ${f.title}`);
  if (motion) G.fromTo(".sp-title", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: .9, ease: "expo.out" });
}
$$("[data-film]").forEach(b => b.addEventListener("click", () => selectFilm(+b.dataset.film)));
$$("[data-film-link]").forEach(a => a.addEventListener("click", () => selectFilm(+a.dataset.filmLink)));

/* ---------- Podcast ---------- */
const pod = $("#pod"), player = $("#player"), seek = $("#podSeek"), podPlay = $("#podPlay"), viz = $("#viz"), vctx = viz.getContext("2d");
const fmtTime = s => `${Math.floor(s / 60)}:${pad2(Math.floor(s % 60))}`;
const isIOS = /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
let actx = null, analyser = null, freq = null;
function setupAudio() {
  if (actx || isIOS || !window.AudioContext) return;
  try {
    actx = new AudioContext();
    const src = actx.createMediaElementSource(pod);
    analyser = actx.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = .78;
    src.connect(analyser); analyser.connect(actx.destination);
    freq = new Uint8Array(analyser.frequencyBinCount);
  } catch { analyser = null; }
}
const BARS = 64, levels = new Float32Array(BARS);
let vizRunning = false, vizRaf = 0;
function syncPod() {
  const d = pod.duration || 1549;
  seek.max = d; seek.value = pod.currentTime;
  seek.style.setProperty("--p", `${(pod.currentTime / d) * 100}%`);
  $("#podTime").textContent = fmtTime(pod.currentTime);
  $("#podDur").textContent = fmtTime(d);
  if (!vizRunning) drawViz(performance.now());
}
podPlay.addEventListener("click", async () => {
  if (!pod.paused) { pod.pause(); return; }
  setupAudio();
  try { if (actx && actx.state === "suspended") await actx.resume(); await pod.play(); }
  catch { $("#podState").textContent = "Fehler – bitte nochmals"; }
});
pod.addEventListener("play", () => { player.classList.add("playing"); $("#podState").textContent = "On Air"; podPlay.setAttribute("aria-label", "Podcast pausieren"); video.pause(); });
pod.addEventListener("pause", () => { player.classList.remove("playing"); $("#podState").textContent = "Pausiert"; podPlay.setAttribute("aria-label", "Podcast abspielen"); });
pod.addEventListener("timeupdate", syncPod);
pod.addEventListener("loadedmetadata", syncPod);
seek.addEventListener("input", () => { pod.currentTime = +seek.value; syncPod(); });
video.addEventListener("play", () => pod.pause());

function sizeViz() {
  const r = viz.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2);
  viz.width = Math.max(1, Math.round(r.width * dpr)); viz.height = Math.max(1, Math.round(r.height * dpr));
  vctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
function drawViz(t) {
  const w = viz.clientWidth, h = viz.clientHeight;
  if (!w) return;
  vctx.clearRect(0, 0, w, h);
  const playing = !pod.paused;
  if (analyser && playing) analyser.getByteFrequencyData(freq);
  const prog = pod.duration ? pod.currentTime / pod.duration : 0;
  const gap = Math.max(2, w / BARS * .32), bw = (w - gap * (BARS - 1)) / BARS;
  for (let i = 0; i < BARS; i++) {
    let target;
    if (analyser && playing) target = freq[Math.floor(Math.pow(i / BARS, 1.5) * freq.length * .72)] / 255 * 1.05;
    else if (playing) target = .2 + .6 * Math.abs(Math.sin(t * .0042 + i * .5) * Math.cos(t * .0021 + i * .23));
    else target = .1 + .07 * Math.sin(t * .0013 + i * .33) + .1 * (((i * 37) % 11) / 11);
    levels[i] += (target - levels[i]) * (reduced ? 1 : .16);
    const bh = Math.max(3, Math.min(1, levels[i]) * h);
    vctx.fillStyle = (i + .5) / BARS <= prog ? "#2E5AAC" : "rgba(238,236,231,.82)";
    const x = i * (bw + gap), y = (h - bh) / 2;
    vctx.beginPath();
    if (vctx.roundRect) vctx.roundRect(x, y, bw, bh, Math.min(bw / 2, 3)); else vctx.rect(x, y, bw, bh);
    vctx.fill();
  }
}
function vizLoop(t) { drawViz(t); vizRaf = requestAnimationFrame(vizLoop); }
sizeViz(); drawViz(0);
addEventListener("resize", () => { sizeViz(); drawViz(performance.now()); });
if (!reduced && "IntersectionObserver" in window) {
  new IntersectionObserver(([en]) => {
    if (en.isIntersecting && !vizRunning) { vizRunning = true; vizRaf = requestAnimationFrame(vizLoop); }
    else if (!en.isIntersecting && vizRunning) { vizRunning = false; cancelAnimationFrame(vizRaf); }
  }).observe(viz);
}

/* ---------- Snake (Easter Egg im letzten R) ---------- */
(() => {
  const dlg = $("#snake"), cv = $("#snCanvas"), ctx = cv.getContext("2d"), startBtn = $("#snStart");
  const N = 18, C = cv.width / N;
  let snake, dir, queued, food, score, timer = null, best = 0;
  try { best = +localStorage.getItem("mason-snake-best") || 0; } catch {}
  const dirs = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
  const keys = { ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right", w: "up", s: "down", a: "left", d: "right" };
  function place() {
    const free = [];
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) if (!snake.some(p => p[0] === x && p[1] === y)) free.push([x, y]);
    return free[Math.floor(Math.random() * free.length)];
  }
  function reset() { snake = [[8, 9], [7, 9], [6, 9]]; dir = queued = dirs.right; food = [12, 9]; score = 0; draw(); updateScore(); }
  function updateScore() { $("#snScore").textContent = pad2(score); $("#snBest").textContent = pad2(best); }
  function draw() {
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { ctx.fillStyle = (x + y) % 2 ? "#181818" : "#1f1f1f"; ctx.fillRect(x * C, y * C, C, C); }
    if (food) { ctx.fillStyle = "#2E5AAC"; ctx.beginPath(); ctx.arc(food[0] * C + C / 2, food[1] * C + C / 2, C * .34, 0, 7); ctx.fill(); }
    snake.forEach((p, i) => {
      ctx.fillStyle = i ? "#eeece7" : "#ffffff";
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(p[0] * C + 1.5, p[1] * C + 1.5, C - 3, C - 3, i ? 4 : 7); else ctx.rect(p[0] * C + 1.5, p[1] * C + 1.5, C - 3, C - 3);
      ctx.fill();
      if (!i) { ctx.fillStyle = "#0e0e0e"; ctx.beginPath(); ctx.arc(p[0] * C + C / 2 + dir[0] * 4, p[1] * C + C / 2 + dir[1] * 4, 2.4, 0, 7); ctx.fill(); }
    });
  }
  function stop(msg) { clearInterval(timer); timer = null; startBtn.textContent = msg; startBtn.hidden = false; }
  function tick() {
    dir = queued;
    const h = [snake[0][0] + dir[0], snake[0][1] + dir[1]];
    const eat = food && h[0] === food[0] && h[1] === food[1];
    const bodyCells = eat ? snake : snake.slice(0, -1);
    if (h[0] < 0 || h[1] < 0 || h[0] >= N || h[1] >= N || bodyCells.some(p => p[0] === h[0] && p[1] === h[1])) { draw(); return stop(`${score} Äpfel · Nochmal`); }
    snake.unshift(h);
    if (eat) {
      score++;
      if (score > best) { best = score; try { localStorage.setItem("mason-snake-best", best); } catch {} }
      food = place(); updateScore();
      clearInterval(timer); timer = setInterval(tick, Math.max(80, 170 - score * 4));
      if (!food) { draw(); return stop("Alles aufgefressen!"); }
    } else snake.pop();
    draw();
  }
  function steer(name) { const d = dirs[name]; if (!timer || (d[0] === -dir[0] && d[1] === -dir[1])) return; queued = d; }
  startBtn.addEventListener("click", () => { reset(); startBtn.hidden = true; timer = setInterval(tick, 170); cv.focus(); });
  dlg.addEventListener("keydown", e => { const k = keys[e.key] || keys[e.key?.toLowerCase?.()]; if (k) { e.preventDefault(); steer(k); } });
  $$("[data-dir]", dlg).forEach(b => b.addEventListener("click", () => steer(b.dataset.dir)));
  let t0 = null;
  cv.addEventListener("pointerdown", e => { t0 = [e.clientX, e.clientY]; });
  cv.addEventListener("pointerup", e => {
    if (!t0) return;
    const dx = e.clientX - t0[0], dy = e.clientY - t0[1]; t0 = null;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 14) return;
    steer(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : (dy > 0 ? "down" : "up"));
  });
  cv.tabIndex = 0;
  dlg.enter = () => G.fromTo(dlg, { scale: .9, opacity: 0, y: 30 }, { scale: 1, opacity: 1, y: 0, duration: .7, ease: "expo.out", clearProps: "transform" });
  dlg.leave = done => G.to(dlg, { scale: .94, opacity: 0, duration: .3, ease: "power2.in", onComplete: () => { G.set(dlg, { clearProps: "transform" }); done(); } });
  $("#snakeOpen").addEventListener("click", () => { reset(); startBtn.textContent = "Losspielen"; startBtn.hidden = false; openDialog(dlg); startBtn.focus(); });
  dlg.addEventListener("closed", () => { clearInterval(timer); timer = null; });
})();

/* ---------- Typo einpassen ---------- */
const heroName = $(".hero-name"), heroBottom = $(".hero-bottom");
function fitHero() {
  const line = $(".hn-2 .hn-in");
  heroName.style.fontSize = "100px";
  const w = line.getBoundingClientRect().width;
  if (!w) return;
  const fs = 100 * heroBottom.clientWidth / w;
  heroName.style.fontSize = `${fs}px`;
  heroBottom.style.setProperty("--hero-fs", `${fs}px`);
}
const footName = $(".foot-name"), footIn = $(".fn-in");
function fitFoot() {
  footName.style.fontSize = "100px";
  const w = footIn.getBoundingClientRect().width;
  if (w) footName.style.fontSize = `${100 * footName.clientWidth / w * .995}px`;
}
function fitAll() { fitHero(); fitFoot(); }
fitAll();
let lastW = innerWidth;
addEventListener("resize", () => { if (innerWidth !== lastW) { lastW = innerWidth; fitAll(); } });

/* ==========================================================================
   Animationen (nur mit GSAP und ohne reduzierte Bewegung)
   ========================================================================== */
const heroChars = [];
if (motion) {
  heroChars.push(...splitChars($(".hn-1 .hn-in"), false));
  heroChars.push(...splitChars($(".hn-2 .hn-in > span"), false));
  const r = $("#snakeOpen"); r.classList.add("c"); heroChars.push(r);
  fitAll();
}

function heroIntro() {
  const tl = G.timeline({ onComplete: () => G.set(heroChars, { clearProps: "transform" }) });
  tl.fromTo(heroChars, { yPercent: 105 }, { yPercent: 0, duration: 1.5, ease: "expo.out", stagger: .045 })
    .fromTo([".hero-intro", ".hero-hint", ".rotator", ".badge"], { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: "expo.out", stagger: .08 }, .25)
    .fromTo($$("#nav > *"), { y: -24, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "expo.out", stagger: .05, clearProps: "transform,opacity" }, .2);
  return tl;
}

function initTrail() {
  const wrap = $("#trail"), hero = $(".hero");
  const imgs = trailSet.map(([n, r]) => {
    const im = new Image();
    im.className = "trail-img"; im.alt = ""; im.decoding = "async"; im.draggable = false;
    im.src = `thumbs/${n}.webp`;
    im.style.setProperty("--r", r);
    im.style.setProperty("--w", r < 1 ? "clamp(110px, 11.5vw, 210px)" : "clamp(150px, 16vw, 300px)");
    wrap.append(im);
    return im;
  });
  let i = 0, z = 1, last = null;
  function spawn(x, y, vx = 0, vy = 0) {
    const im = imgs[i++ % imgs.length];
    G.killTweensOf(im);
    G.set(im, { x, y, xPercent: -50, yPercent: -50, zIndex: z++, opacity: 1, scale: .4, rotation: G.utils.random(-14, 14) });
    G.to(im, { scale: 1, x: x + vx * .35, y: y + vy * .35, rotation: G.utils.random(-5, 5), duration: .9, ease: "expo.out" });
    G.to(im, { opacity: 0, scale: .75, duration: .7, ease: "power2.in", delay: .6 });
  }
  hero.addEventListener("pointermove", e => {
    if (e.pointerType !== "mouse" || body.classList.contains("locked")) return;
    const r = hero.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
    if (!last) { last = { x, y }; return; }
    const dx = x - last.x, dy = y - last.y;
    if (Math.hypot(dx, dy) > Math.max(90, innerWidth * .075)) { spawn(x, y, dx, dy); last = { x, y }; }
  });
  hero.addEventListener("pointerleave", () => { last = null; });
  if (!fine && "IntersectionObserver" in window) {
    let timer = null;
    const auto = () => {
      const r = hero.getBoundingClientRect();
      spawn(G.utils.random(r.width * .18, r.width * .82), G.utils.random(r.height * .28, r.height * .62));
    };
    new IntersectionObserver(([en]) => {
      if (en.isIntersecting && !timer) timer = setInterval(auto, 950);
      else if (!en.isIntersecting && timer) { clearInterval(timer); timer = null; }
    }, { threshold: .35 }).observe(hero);
  }
}

function initRotator() {
  const words = $$(".rot > em");
  if (words.length < 2) return;
  G.set(words, { y: 0, yPercent: 110 });
  G.set(words[0], { yPercent: 0 });
  let k = 0;
  const step = () => {
    const a = words[k]; k = (k + 1) % words.length; const b = words[k];
    G.to(a, { yPercent: -110, duration: 1, ease: "expo.inOut" });
    G.fromTo(b, { yPercent: 110 }, { yPercent: 0, duration: 1, ease: "expo.inOut" });
    G.delayedCall(2.3, step);
  };
  G.delayedCall(2.6, step);
}

function initHeroScroll() {
  const st = () => ({ trigger: ".hero", start: "top top", end: "bottom top", scrub: true });
  G.to(".hn-1 .hn-in", { xPercent: -16, ease: "none", scrollTrigger: st() });
  G.to(".hn-2 .hn-in", { xPercent: 10, ease: "none", scrollTrigger: st() });
  G.fromTo(".hero-top", { y: 0, opacity: 1 }, { y: -100, opacity: 0, ease: "none", immediateRender: false, scrollTrigger: { trigger: ".hero", start: "top top", end: "40% top", scrub: true } });
  G.fromTo(".hero-meta", { y: 0, opacity: 1 }, { y: -60, opacity: 0, ease: "none", immediateRender: false, scrollTrigger: { trigger: ".hero", start: "10% top", end: "55% top", scrub: true } });
}

function initBands() {
  const sec = $(".bands");
  const bands = $$(".band-track").map((t, i) => {
    const unit = t.innerHTML, unitW = t.scrollWidth;
    const copies = Math.max(2, Math.ceil(t.parentElement.clientWidth / Math.max(unitW, 1)) + 1);
    t.innerHTML = unit.repeat(copies);
    return { t, w: unitW, x: i ? -unitW * .5 : 0, dir: i ? 1 : -1 };
  });
  let vel = 0, sign = 1, visible = false;
  lenis?.on("scroll", e => { vel = e.velocity || 0; });
  new IntersectionObserver(([en]) => { visible = en.isIntersecting; }).observe(sec);
  G.ticker.add((time, dt) => {
    if (!visible) return;
    if (Math.abs(vel) > .3) sign = vel > 0 ? 1 : -1;
    const speed = (.055 + Math.min(Math.abs(vel) * .028, .7)) * Math.min(dt, 50);
    bands.forEach(b => {
      b.x += b.dir * sign * speed;
      if (b.x <= -b.w) b.x += b.w;
      if (b.x > 0) b.x -= b.w;
      b.t.style.transform = `translate3d(${b.x.toFixed(2)}px,0,0)`;
    });
    vel *= .9;
  });
  G.fromTo(".band-a", { rotation: -7 }, { rotation: -3.2, ease: "none", scrollTrigger: { trigger: sec, start: "top bottom", end: "bottom top", scrub: true } });
  G.fromTo(".band-b", { rotation: 6 }, { rotation: 2.2, ease: "none", scrollTrigger: { trigger: sec, start: "top bottom", end: "bottom top", scrub: true } });
}

function initReveals() {
  $$("[data-chars]").forEach(el => {
    const chars = splitChars(el, true);
    G.fromTo(chars, { yPercent: 120, rotation: 7 }, { yPercent: 0, rotation: 0, duration: 1.3, ease: "expo.out", stagger: .03, transformOrigin: "0% 100%", scrollTrigger: { trigger: el, start: "top 88%", once: true } });
  });
  $$("[data-scrub]").forEach(el => {
    const words = splitWords(el);
    G.fromTo(words, { opacity: .13 }, { opacity: 1, ease: "none", stagger: .1, scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: true } });
  });
  $$("[data-reveal]").forEach(el => {
    G.fromTo(el, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1.3, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 92%", once: true } });
  });
  $$("[data-stagger]").forEach(el => {
    G.fromTo(el.children, { y: 44, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: "expo.out", stagger: .07, scrollTrigger: { trigger: el, start: "top 90%", once: true } });
  });
  $$("[data-photo]").forEach(el => {
    const frame = $(".ap-frame", el), img = $("img", el);
    const st = () => ({ trigger: el, start: "top 85%", once: true });
    G.fromTo(frame, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "expo.inOut", scrollTrigger: st() });
    G.fromTo(img, { scale: 1.35 }, { scale: 1, duration: 1.8, ease: "expo.out", scrollTrigger: st() });
    G.fromTo($("figcaption", el), { opacity: 0, y: 12 }, { opacity: .55, y: 0, duration: 1, delay: .6, ease: "expo.out", scrollTrigger: st() });
  });
  $$(".sec-label").forEach(el => {
    G.fromTo(el, { opacity: 0, x: -20 }, { opacity: .6, x: 0, duration: 1, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 92%", once: true } });
  });
}

function initCards() {
  const cards = $$(".card");
  const marks = cards.map(card => {
    const m = document.createElement("span");
    m.className = "card-mark"; m.setAttribute("aria-hidden", "true");
    card.before(m);
    return m;
  });
  cards.forEach((card, i) => {
    const inner = $(".card-inner", card), shade = $(".card-shade", card);
    const next = cards[i + 1];
    if (next) {
      const st = () => ({ trigger: marks[i + 1], start: "top bottom", end: () => `top ${parseFloat(getComputedStyle(next).top) || 0}px`, scrub: true, invalidateOnRefresh: true });
      G.to(inner, { scale: .9, ease: "none", scrollTrigger: st() });
      G.to(shade, { opacity: .5, scale: .9, ease: "none", scrollTrigger: st() });
    }
    const main = $(".cm-main", card), sub = $(".cm-sub", card);
    G.fromTo(sub, { yPercent: 30 }, { yPercent: -12, ease: "none", scrollTrigger: { trigger: marks[i], start: "top bottom", end: "top top", scrub: true } });
    G.fromTo(main, { yPercent: 12, scale: 1.08 }, { yPercent: 0, scale: 1, ease: "none", scrollTrigger: { trigger: marks[i], start: "top bottom", end: "top top", scrub: true } });
    G.fromTo($$(".card-title, .card-tags, .card-desc, .card-info > .btn", card), { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: "expo.out", stagger: .07, scrollTrigger: { trigger: marks[i], start: "top 70%", once: true } });
    if (fine) {
      const media = $(".card-media", card);
      const mx = G.quickTo(main, "x", { duration: 1, ease: "power3" }), sx = G.quickTo(sub, "x", { duration: 1, ease: "power3" });
      const rot = G.quickTo(sub, "rotation", { duration: 1, ease: "power3" });
      media.addEventListener("pointermove", e => {
        const r = media.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - .5;
        mx(px * -24); sx(px * 40); rot(px * 4);
      });
      media.addEventListener("pointerleave", () => { mx(0); sx(0); rot(0); });
    }
  });
}

function initPhotos() {
  const mm = G.matchMedia();
  mm.add("(min-width: 901px) and (min-height: 600px)", () => {
    photoSec.classList.add("is-pinned");
    const dist = () => Math.max(0, phTrack.scrollWidth - innerWidth);
    phPin = G.to(phTrack, {
      x: () => -dist(), ease: "none",
      scrollTrigger: {
        trigger: ".ph-pin", start: "top top", end: () => `+=${dist()}`, pin: true, scrub: .9, invalidateOnRefresh: true, anticipatePin: 1,
        onUpdate: self => { const i = self.progress > .985 ? phItems.length - 1 : nearestPhoto(); if (i !== phIndex) setPhoto(i); },
      },
    });
    phItems.forEach(b => {
      G.fromTo($("img", b), { xPercent: 7 }, { xPercent: -7, ease: "none", scrollTrigger: { trigger: b, containerAnimation: phPin, start: "left right", end: "right left", scrub: true } });
      G.fromTo(b, { rotation: 3, scale: .92 }, { rotation: 0, scale: 1, ease: "none", scrollTrigger: { trigger: b, containerAnimation: phPin, start: "left right", end: "center 60%", scrub: true } });
    });
    G.fromTo("#phBar", { scaleX: .02 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: ".ph-pin", start: "top top", end: () => `+=${dist()}`, scrub: true, invalidateOnRefresh: true } });
    return () => { photoSec.classList.remove("is-pinned"); phPin = null; };
  });
}

function initFilm() {
  const mobile = innerWidth < 900;
  const st = () => ({ trigger: ".screen-wrap", start: "top 92%", end: "center 58%", scrub: true });
  G.fromTo(screen, { clipPath: mobile ? "inset(6% 8% 6% 8% round 24px)" : "inset(12% 16% 12% 16% round 36px)" }, { clipPath: "inset(0% 0% 0% 0% round 16px)", ease: "none", scrollTrigger: st() });
  G.fromTo(video, { scale: 1.3 }, { scale: 1, ease: "none", scrollTrigger: st() });
}

function initFooter() {
  const chars = splitChars(footIn, false);
  fitFoot();
  G.fromTo(chars, { yPercent: 105 }, { yPercent: 0, duration: 1.4, ease: "expo.out", stagger: .035, scrollTrigger: { trigger: ".footer", start: "top 95%", once: true } });
}

function initThemes() {
  root.classList.add("themed");
  const meta = $('meta[name="theme-color"]');
  const colors = { light: "#eeece7", dark: "#0e0e0e", accent: "#13294B" };
  const set = t => { if (body.dataset.theme !== t) { body.dataset.theme = t; meta?.setAttribute("content", colors[t]); } };
  $$("main [data-theme], footer[data-theme]").forEach(sec => {
    ST.create({ trigger: sec, start: "top 50%", end: "bottom 50%", onToggle: self => { if (self.isActive) set(sec.dataset.theme); } });
  });
}

function initCursor() {
  if (!fine) return;
  body.classList.add("has-cursor");
  const cur = $(".cursor"), ring = $(".cur-ring"), dot = $(".cur-dot"), label = $(".cur-label");
  const rx = G.quickTo(ring, "x", { duration: .55, ease: "power3" }), ry = G.quickTo(ring, "y", { duration: .55, ease: "power3" });
  const dx = G.quickSetter(dot, "x", "px"), dy = G.quickSetter(dot, "y", "px");
  addEventListener("pointermove", e => {
    if (e.pointerType !== "mouse") return;
    if (!cur.classList.contains("on") && !body.classList.contains("locked")) { cur.classList.add("on"); G.set(ring, { x: e.clientX, y: e.clientY }); }
    dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
  }, { passive: true });
  document.documentElement.addEventListener("mouseleave", () => cur.classList.remove("on"));
  document.addEventListener("pointerover", e => {
    const t = e.target.closest?.("[data-cursor], a, button, label, input[type=range]");
    cur.classList.remove("is-link", "is-label");
    if (!t) return;
    if (t.dataset.cursor) { label.textContent = t.dataset.cursor; cur.classList.add("is-label"); }
    else cur.classList.add("is-link");
  });
}

function initMagnetic() {
  if (!fine) return;
  $$(".magnetic").forEach(el => {
    const xTo = G.quickTo(el, "x", { duration: .9, ease: "elastic.out(1, .4)" }), yTo = G.quickTo(el, "y", { duration: .9, ease: "elastic.out(1, .4)" });
    const s = el.classList.contains("badge") ? .45 : .3;
    el.addEventListener("pointermove", e => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - r.left - r.width / 2) * s); yTo((e.clientY - r.top - r.height / 2) * s);
    });
    el.addEventListener("pointerleave", () => { xTo(0); yTo(0); });
  });
}

/* ---------- Start ---------- */
const loader = $("#loader");
const startHash = aliases[location.hash] || location.hash;
const startTarget = startHash.length > 1 ? $(startHash) : null;

if (hasG) {
  if (motion) {
    // Reihenfolge = Reihenfolge auf der Seite: der Pin der Fotostrecke muss vor allem darunter entstehen.
    initTrail(); initHeroScroll(); initBands(); initCards(); initPhotos(); initReveals(); initFilm(); initFooter(); initCursor(); initMagnetic();
  }
  initThemes();
  ST.sort?.();
}

function afterLayout() {
  fitAll();
  if (hasG) ST.refresh();
}
document.fonts?.ready?.then(afterLayout);
addEventListener("load", afterLayout);

if (!motion) {
  loader?.remove();
  if (startTarget) requestAnimationFrame(() => startTarget.scrollIntoView());
} else {
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  lenis?.stop();
  let seen = false;
  try { seen = sessionStorage.getItem("ms-intro") === "1"; sessionStorage.setItem("ms-intro", "1"); } catch {}
  const num = $("#ldNum"), bar = $(".ld-bar i"), counter = { v: 0 };
  const render = () => { num.textContent = Math.round(counter.v); bar.style.transform = `scaleX(${counter.v / 100})`; };
  const minTime = seen ? 350 : 1500;
  G.to(counter, { v: 86, duration: minTime / 1000, ease: "power2.inOut", onUpdate: render });
  G.fromTo(".ld-inner > *", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: .8, ease: "expo.out", stagger: .08 });
  const firstImgs = $$(".trail-img").slice(0, 4).map(im => (im.decode ? im.decode().catch(() => {}) : null));
  const ready = Promise.all([document.fonts?.ready, ...firstImgs].filter(Boolean)).catch(() => {});
  const wait = ms => new Promise(r => setTimeout(r, ms));
  Promise.race([Promise.all([ready, wait(minTime)]), wait(4000)]).then(() => {
    afterLayout();
    if (startTarget) lenis ? lenis.scrollTo(startTarget, { immediate: true, force: true }) : startTarget.scrollIntoView();
    else scrollTo(0, 0);
    G.to(counter, { v: 100, duration: .45, ease: "power2.out", onUpdate: render, onComplete: () => {
      const tl = G.timeline({ onComplete: () => { loader.remove(); lenis?.start(); initRotator(); } });
      tl.to(".ld-inner", { yPercent: -12, opacity: 0, duration: .7, ease: "power3.in" })
        .to(loader, { clipPath: "inset(0% 0% 100% 0%)", duration: 1.1, ease: "expo.inOut" }, "-=.25")
        .add(heroIntro(), "-=.6");
    } });
  });
}
})();

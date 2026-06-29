/* ============================================================
   Propello marketing — motion layer
   Lenis smooth scroll · scroll reveals · stat counters ·
   scroll progress · sticky nav · mobile menu · hero parallax
   ============================================================ */

const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Smooth scroll (Lenis) ---------- */
let lenis = null;
async function initLenis() {
  if (prefersReduced) return;
  try {
    const { default: Lenis } = await import(
      "https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.mjs"
    );
    lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // anchor links use lenis
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const id = a.getAttribute("href");
        if (id.length < 2) return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { offset: -90 });
        closeMenu();
      });
    });
  } catch (err) {
    console.warn("Lenis unavailable, using native scroll:", err);
  }
}

/* ---------- Scroll reveals ---------- */
function initReveals() {
  const items = Array.from(document.querySelectorAll("[data-reveal]"));
  items.forEach((el) => {
    const delay = el.dataset.revealDelay || 0;
    el.style.setProperty("--reveal-delay", `${delay}ms`);
  });

  if (prefersReduced || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.15 }
  );
  items.forEach((el) => io.observe(el));
}

/* ---------- Stat counters ---------- */
function animateCount(el) {
  const target = parseFloat(el.dataset.count);
  const decimals = (el.dataset.count.split(".")[1] || "").length;
  const prefix = el.dataset.prefix || "";
  const suffix = el.dataset.suffix || "";
  const duration = 1600;
  const start = performance.now();
  function tick(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    const val = (target * eased).toFixed(decimals);
    el.textContent = prefix + val + suffix;
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = prefix + target.toFixed(decimals) + suffix;
  }
  requestAnimationFrame(tick);
}

function initCounters() {
  const counters = Array.from(document.querySelectorAll("[data-count]"));
  if (!counters.length) return;
  if (prefersReduced || !("IntersectionObserver" in window)) {
    counters.forEach((el) => {
      el.textContent =
        (el.dataset.prefix || "") + el.dataset.count + (el.dataset.suffix || "");
    });
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCount(entry.target);
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.6 }
  );
  counters.forEach((el) => io.observe(el));
}

/* ---------- Scroll progress + nav state ---------- */
function initScrollUI() {
  const bar = document.querySelector(".scroll-progress");
  const readout = document.querySelector(".scroll-readout span");
  const nav = document.querySelector(".nav");
  let ticking = false;

  function update() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const height =
      document.documentElement.scrollHeight - window.innerHeight;
    const pct = height > 0 ? Math.min(scrollTop / height, 1) : 0;
    if (bar) bar.style.width = (pct * 100).toFixed(1) + "%";
    if (readout) readout.textContent = Math.round(pct * 100) + "%";
    if (nav) nav.classList.toggle("is-scrolled", scrollTop > 24);
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  update();
}

/* ---------- Mobile menu ---------- */
function closeMenu() {
  document.body.classList.remove("menu-open");
}
function initMenu() {
  const burger = document.querySelector(".nav__burger");
  if (!burger) return;
  burger.addEventListener("click", () => {
    document.body.classList.toggle("menu-open");
  });
  document.querySelectorAll(".mobile-menu a").forEach((a) => {
    a.addEventListener("click", closeMenu);
  });
}

/* ---------- Hero parallax (pointer) ---------- */
function initParallax() {
  if (prefersReduced) return;
  const orbs = document.querySelectorAll(".bg-orb");
  if (!orbs.length) return;
  window.addEventListener(
    "pointermove",
    (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      orbs.forEach((orb, i) => {
        const depth = (i + 1) * 14;
        orb.style.transform = `translate3d(${x * depth}px, ${y * depth}px, 0)`;
      });
    },
    { passive: true }
  );
}

/* ---------- Boot ---------- */
function boot() {
  initReveals();
  initCounters();
  initScrollUI();
  initMenu();
  initParallax();
  initLenis();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}

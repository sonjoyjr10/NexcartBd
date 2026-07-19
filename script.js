// ============================================================
// NEXCARTBD — 2060 Storefront Engine
// Vanilla JS only. Depends on config.js (API_URL) and
// products.js (const products = [...]).
// ============================================================

(function () {
  "use strict";

  /* ------------------------------------------------------------
     STATE
  ------------------------------------------------------------ */
  const state = {
    cart: JSON.parse(localStorage.getItem("nexcart_cart") || "[]"),
    user: JSON.parse(localStorage.getItem("nexcart_user") || "null"),
    token: localStorage.getItem("nexcart_token") || null,
    filters: { search: "", category: "all", maxPrice: 200000, sort: "trending" },
  };

  const els = {};
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    cacheEls();
    initLoader();
    initCursor();
    initParticleField();
    initHeroGrid();
    initHeroOrbFollow();
    initTypewriter();
    initHeaderScroll();
    initNav();
    initHamburger();
    initShop();
    initCartUI();
    initCheckout();
    initTracking();
    initAuth();
    initRippleButtons();
    initTiltCards();
    renderCartBadge();
    animateStat($("#statOrders"), 128430, 2000);
  }

  function cacheEls() {
    els.header = $("#siteHeader");
  }

  /* ------------------------------------------------------------
     LOADER
  ------------------------------------------------------------ */
  function initLoader() {
    const loader = $("#quantumLoader");
    window.addEventListener("load", () => {
      setTimeout(() => loader.classList.add("hidden"), 500);
    });
    // Fallback in case load event already fired
    setTimeout(() => loader.classList.add("hidden"), 2500);
  }

  /* ------------------------------------------------------------
     CUSTOM CURSOR + LIGHT TRAIL
  ------------------------------------------------------------ */
  function initCursor() {
    if (window.matchMedia("(hover: none)").matches) return;
    const core = $("#cursorCore");
    const canvas = $("#cursorTrail");
    const ctx = canvas.getContext("2d");
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    window.addEventListener("resize", () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    });

    const points = [];
    let mx = w / 2, my = h / 2;

    document.addEventListener("mousemove", (e) => {
      mx = e.clientX; my = e.clientY;
      core.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
      points.push({ x: mx, y: my, life: 1 });
      if (points.length > 24) points.shift();

      const target = e.target.closest("a, button, .product-card, input, select, textarea, .radio-card");
      core.classList.toggle("hovering", !!target);
    });

    function loop() {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        p.life -= 0.045;
        if (p.life <= 0) continue;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5 * p.life, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,255,157,${p.life * 0.5})`;
        ctx.fill();
      }
      requestAnimationFrame(loop);
    }
    loop();
  }

  /* ------------------------------------------------------------
     PARTICLE UNIVERSE BACKGROUND
  ------------------------------------------------------------ */
  function initParticleField() {
    const canvas = $("#particleField");
    const ctx = canvas.getContext("2d");
    let w, h, particles;

    function size() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    size();
    window.addEventListener("resize", size);

    const count = Math.min(90, Math.floor((window.innerWidth * window.innerHeight) / 14000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.6 + 0.4,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      glow: Math.random() > 0.85,
    }));

    function loop() {
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.glow ? "rgba(255,215,0,0.5)" : "rgba(0,255,157,0.35)";
        ctx.fill();
      });
      requestAnimationFrame(loop);
    }
    loop();
  }

  /* ------------------------------------------------------------
     HERO GRID (subtle animated perspective grid)
  ------------------------------------------------------------ */
  function initHeroGrid() {
    const canvas = $("#heroGrid");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w, h, t = 0;
    function size() {
      const rect = canvas.parentElement.getBoundingClientRect();
      w = canvas.width = rect.width;
      h = canvas.height = rect.height;
    }
    size();
    window.addEventListener("resize", size);

    function loop() {
      t += 0.4;
      ctx.clearRect(0, 0, w, h);
      const spacing = 46;
      ctx.strokeStyle = "rgba(0,255,157,0.06)";
      ctx.lineWidth = 1;
      for (let x = -spacing; x < w + spacing; x += spacing) {
        ctx.beginPath();
        ctx.moveTo(x + ((t * 0.3) % spacing), 0);
        ctx.lineTo(x + ((t * 0.3) % spacing), h);
        ctx.stroke();
      }
      for (let y = -spacing; y < h + spacing; y += spacing) {
        ctx.beginPath();
        ctx.moveTo(0, y + ((t * 0.15) % spacing));
        ctx.lineTo(w, y + ((t * 0.15) % spacing));
        ctx.stroke();
      }
      requestAnimationFrame(loop);
    }
    loop();
  }

  /* ------------------------------------------------------------
     HERO ORB — follows mouse with light trail (CSS driven)
  ------------------------------------------------------------ */
  function initHeroOrbFollow() {
    const hero = $(".hero");
    const wrap = $("#heroOrbWrap");
    if (!hero || !wrap) return;
    let tx = 0, ty = 0, cx = 0, cy = 0;

    hero.addEventListener("mousemove", (e) => {
      const rect = hero.getBoundingClientRect();
      tx = e.clientX - rect.left - rect.width / 2;
      ty = e.clientY - rect.top - rect.height / 2;
    });
    hero.addEventListener("mouseleave", () => { tx = 0; ty = 0; });

    function loop() {
      cx += (tx * 0.15 - cx * 0.15);
      cy += (ty * 0.15 - cy * 0.15);
      wrap.style.transform = `translate(${cx * 0.25}px, ${cy * 0.25}px)`;
      requestAnimationFrame(loop);
    }
    loop();
  }

  /* ------------------------------------------------------------
     TYPEWRITER + HOLOGRAM HEADLINE
  ------------------------------------------------------------ */
  function initTypewriter() {
    const line1 = $("#typeLine1");
    const line2 = $("#typeLine2");
    if (!line1 || !line2) return;
    const text1 = "WELCOME TO";
    const text2 = "2060 SHOPPING";

    typeInto(line1, text1, 60, () => {
      typeInto(line2, text2, 60, () => {
        const caret = document.createElement("span");
        caret.className = "cursor-caret";
        line2.appendChild(caret);
      });
    });
  }

  function typeInto(el, text, speed, done) {
    let i = 0;
    el.textContent = "";
    (function step() {
      if (i <= text.length) {
        el.textContent = text.slice(0, i);
        i++;
        setTimeout(step, speed);
      } else if (done) done();
    })();
  }

  /* ------------------------------------------------------------
     HEADER SCROLL EFFECT
  ------------------------------------------------------------ */
  function initHeaderScroll() {
    window.addEventListener("scroll", () => {
      els.header.classList.toggle("scrolled", window.scrollY > 20);
    });
  }

  /* ------------------------------------------------------------
     NAVIGATION (SPA-style page switch)
  ------------------------------------------------------------ */
  function initNav() {
    $$(".nav-link").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        goToPage(link.dataset.page);
        $("#mainNav").classList.remove("open");
      });
    });
    $("#exploreBtn").addEventListener("click", () => goToPage("shop"));
    $("#aiRecommendBtn").addEventListener("click", () => {
      goToPage("shop");
      showToast("NEXA is curating picks based on trending demand ✦");
      state.filters.sort = "trending";
      $("#sortFilter").value = "trending";
      renderProducts();
    });
  }

  function goToPage(name) {
    $$(".page").forEach((p) => p.classList.remove("active"));
    const target = document.getElementById(name);
    if (target) target.classList.add("active");
    $$(".nav-link").forEach((l) => l.classList.toggle("active", l.dataset.page === name));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function initHamburger() {
    $("#hamburgerBtn").addEventListener("click", () => {
      $("#mainNav").classList.toggle("open");
    });
  }

  /* ------------------------------------------------------------
     SHOP — dynamic product rendering from products.js
  ------------------------------------------------------------ */

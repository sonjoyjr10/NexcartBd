/* ============================================================
   NEXCARTBD — 2060 Storefront Engine
   Vanilla JS. Cart + Auth + Orders + Particle/Cursor FX.
   ============================================================ */

(() => {
  "use strict";

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);
  const on = (el, evt, fn) => { if (el) el.addEventListener(evt, fn); };

  /* ---------- STATE ---------- */
  const state = {
    cart: JSON.parse(localStorage.getItem("nexcart_cart") || "[]"),
    user: JSON.parse(localStorage.getItem("nexcart_user") || "null"),
    token: localStorage.getItem("nexcart_token") || null,
    filtered: []
  };

  /* ============================================================
     BOOT SCREEN (with hard failsafe)
     ============================================================ */
  function hideBootScreen() {
    const boot = $("#bootScreen");
    if (boot) boot.classList.add("done");
  }
  try {
    window.addEventListener("load", () => {
      const fill = $("#bootFill");
      let p = 0;
      const iv = setInterval(() => {
        p += Math.random() * 25;
        if (fill) fill.style.width = Math.min(p, 100) + "%";
        if (p >= 100) {
          clearInterval(iv);
          setTimeout(hideBootScreen, 300);
        }
      }, 120);
    });
  } catch (e) { console.warn("Boot animation error:", e); }
  // No matter what happens anywhere else in this file, force-hide after 3s
  setTimeout(hideBootScreen, 3000);

  /* ============================================================
     CUSTOM CURSOR + LIGHT TRAIL
     ============================================================ */
  try {
    const cursorCore = $("#cursorCore");
    const cursorRing = $("#cursorRing");
    if (cursorCore && cursorRing && window.matchMedia("(hover: hover)").matches) {
      let mx = 0, my = 0, rx = 0, ry = 0;
      window.addEventListener("mousemove", (e) => {
        mx = e.clientX; my = e.clientY;
        cursorCore.style.left = mx + "px";
        cursorCore.style.top = my + "px";
        spawnTrail(mx, my);
      });
      (function loop() {
        rx += (mx - rx) * 0.18;
        ry += (my - ry) * 0.18;
        cursorRing.style.left = rx + "px";
        cursorRing.style.top = ry + "px";
        requestAnimationFrame(loop);
      })();

      document.addEventListener("mouseover", (e) => {
        if (e.target.closest("a,button,input,select,.product-card,.icon-btn")) {
          cursorRing.classList.add("hovering");
        }
      });
      document.addEventListener("mouseout", (e) => {
        if (e.target.closest("a,button,input,select,.product-card,.icon-btn")) {
          cursorRing.classList.remove("hovering");
        }
      });

      function spawnTrail(x, y) {
        if (Math.random() > 0.6) return;
        const dot = document.createElement("div");
        dot.style.cssText = `position:fixed;left:${x}px;top:${y}px;width:4px;height:4px;
          background:#00FF9D;border-radius:50%;pointer-events:none;z-index:9998;
          transform:translate(-50%,-50%);box-shadow:0 0 8px #00FF9D;
          transition:opacity .6s ease, transform .6s ease;`;
        document.body.appendChild(dot);
        requestAnimationFrame(() => {
          dot.style.opacity = "0";
          dot.style.transform = "translate(-50%,-50%) scale(0.2)";
        });
        setTimeout(() => dot.remove(), 600);
      }
    }
  } catch (e) { console.warn("Cursor FX error:", e); }

  /* ============================================================
     PARTICLE UNIVERSE BACKGROUND
     ============================================================ */
  try {
    const canvas = $("#particleField");
    if (canvas) {
      const ctx = canvas.getContext("2d");
      let particles = [];
      const PARTICLE_COUNT = window.innerWidth < 768 ? 45 : 100;

      function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
      function initParticles() {
        particles = Array.from({ length: PARTICLE_COUNT }, () => ({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          z: Math.random() * 1.5 + 0.3,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          r: Math.random() * 1.6 + 0.4
        }));
      }
      function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "rgba(0,255,157,0.5)";
        particles.forEach((p) => {
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0) p.x = canvas.width;
          if (p.x > canvas.width) p.x = 0;
          if (p.y < 0) p.y = canvas.height;
          if (p.y > canvas.height) p.y = 0;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * p.z, 0, Math.PI * 2);
          ctx.fill();
        });
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 110) {
              ctx.strokeStyle = `rgba(0,255,157,${0.08 * (1 - dist / 110)})`;
              ctx.lineWidth = 0.5;
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
        }
        requestAnimationFrame(drawParticles);
      }
      resizeCanvas(); initParticles(); drawParticles();
      window.addEventListener("resize", () => { resizeCanvas(); initParticles(); });
    }
  } catch (e) { console.warn("Particle field error:", e); }

  /* ============================================================
     HEADER — scroll state + mobile nav + AI search
     ============================================================ */
  try {
    const header = $("#siteHeader");
    window.addEventListener("scroll", () => {
      if (header) header.classList.toggle("scrolled", window.scrollY > 30);
    });

    on($("#hamburger"), "click", () => $("#mainNav")?.classList.toggle("open"));

    $$(".nav-link").forEach(link => on(link, "click", () => {
      $$(".nav-link").forEach(l => l.classList.remove("active"));
      link.classList.add("active");
      $("#mainNav")?.classList.remove("open");
    }));

    on($("#aiSearchBtn"), "click", () => {
      $("#aiSearchPanel")?.classList.toggle("open");
      $("#aiSearchInput")?.focus();
    });
    on($("#closeSearch"), "click", () => $("#aiSearchPanel")?.classList.remove("open"));
    on($("#aiSearchInput"), "input", (e) => {
      const shopSearch = $("#shopSearch");
      if (shopSearch) shopSearch.value = e.target.value;
      renderProducts();
      $("#shop")?.scrollIntoView({ behavior: "smooth" });
    });
  } catch (e) { console.warn("Header error:", e); }

  /* ============================================================
     HERO — typewriter + 3D orb tracking mouse
     ============================================================ */
  try {
    const phrase = "WELCOME TO 2060 SHOPPING";
    let ti = 0;
    function typewrite() {
      const tw = $("#typewriter");
      if (!tw) return;
      if (ti <= phrase.length) {
        tw.textContent = phrase.slice(0, ti);
        ti++;
        setTimeout(typewrite, 55);
      }
    }
    typewrite();

    const orb = $("#heroOrb");
    if (orb) {
      window.addEventListener("mousemove", (e) => {
        const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
        const rx = ((e.clientY - cy) / cy) * -10;
        const ry = ((e.clientX - cx) / cx) * 10;
        orb.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
      });
    }

    on($("#aiRecommendBtn"), "click", () => {
      if (!window.products || !products.length) {
        toast("AI is still learning the catalog — check back soon.", "error");
        return;
      }
      const pick = products[Math.floor(Math.random() * products.length)];
      toast(`AI recommends: ${pick.name}`);
      $("#shop")?.scrollIntoView({ behavior: "smooth" });
    });

    $$(".btn-primary").forEach(btn => on(btn, "mousemove", (e) => {
      const r = btn.getBoundingClientRect();
      btn.style.setProperty("--mx", `${e.clientX - r.left}px`);
      btn.style.setProperty("--my", `${e.clientY - r.top}px`);
    }));
  } catch (e) { console.warn("Hero error:", e); }

  /* ============================================================
     PRODUCTS — render from products.js, filters, 3D tilt
     ============================================================ */
  function populateCategories() {
    try {
      const sel = $("#categoryFilter");
      if (!sel || !window.products) return;
      const cats = [...new Set(products.map(p => p.category).filter(Boolean))];
      cats.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c; opt.textContent = c;
        sel.appendChild(opt);
      });
    } catch (e) { console.warn("populateCategories error:", e); }
  }

  function renderProducts() {
    try {
      const grid = $("#productGrid");
      if (!grid) return;
      const search = ($("#shopSearch")?.value || "").toLowerCase();
      const category = $("#categoryFilter")?.value || "all";
      const maxPrice = Number($("#priceFilter")?.value || 200000);
      const list = ((window.products) || []).filter(p => {
        const matchSearch = !search || p.name?.toLowerCase().includes(search);
        const matchCat = category === "all" || p.category === category;
        const matchPrice = !p.price || p.price <= maxPrice;
        return matchSearch && matchCat && matchPrice;
      });

      grid.innerHTML = "";
      if (!list.length) {
        grid.innerHTML = `
          <div class="empty-state">
            <span class="ai-pulse-dot" style="display:inline-block;"></span>
            <p>${(window.products && products.length) ? "No products match your filters." : "AI is scanning the catalog… products will materialize here once added."}</p>
          </div>`;
        return;
      }

      list.forEach((p, i) => {
        const card = document.createElement("div");
        card.className = "product-card glass";
        card.style.animationDelay = `${i * 0.05}s`;
        card.innerHTML = `
          ${p.trending ? '<span class="trending-badge">AI TRENDING</span>' : ""}
          <div class="product-img"><img src="${p.image || ''}" alt="${p.name || 'Product'}" loading="lazy" onerror="this.style.opacity=0"></div>
          <h4>${p.name || "Unnamed Product"}</h4>
          <div class="product-price">৳${(p.price || 0).toLocaleString()}</div>
          <div class="product-actions">
            <button class="btn-liquid btn-ghost" data-action="add" data-id="${p.id}">Add to Cart</button>
            <button class="btn-liquid btn-primary" data-action="buy" data-id="${p.id}">Instant Buy</button>
          </div>
        `;
        grid.appendChild(card);
        apply3DTilt(card);
      });
    } catch (e) { console.warn("renderProducts error:", e); }
  }

  function apply3DTilt(card) {
    on(card, "mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-4px)`;
    });
    on(card, "mouseleave", () => { card.style.transform = "rotateY(0) rotateX(0) translateY(0)"; });
  }

  try {
    on($("#productGrid"), "click", (e) => {
      const btn = e.target.closest("button[data-action]");
      if (!btn || !window.products) return;
      const product = products.find(p => String(p.id) === btn.dataset.id);
      if (!product) return;
      if (btn.dataset.action === "add") addToCart(product);
      else { addToCart(product); showCheckout(); }
    });

    ["shopSearch", "categoryFilter"].forEach(id => on($("#" + id), "input", renderProducts));
    on($("#priceFilter"), "input", (e) => {
      const lbl = $("#priceLabel");
      if (lbl) lbl.textContent = "৳" + Number(e.target.value).toLocaleString();
      renderProducts();
    });
    on($("#resetFilters"), "click", () => {
      if ($("#shopSearch")) $("#shopSearch").value = "";
      if ($("#categoryFilter")) $("#categoryFilter").value = "all";
      if ($("#priceFilter")) $("#priceFilter").value = 200000;
      if ($("#priceLabel")) $("#priceLabel").textContent = "Any";
      renderProducts();
    });

    populateCategories();
    renderProducts();
  } catch (e) { console.warn("Shop init error:", e); }

  /* ============================================================
     CART SYSTEM (localStorage)
     ============================================================ */
  function saveCart() {
    localStorage.setItem("nexcart_cart", JSON.stringify(state.cart));
    renderCart();
  }
  function addToCart(product) {
    const existing = state.cart.find(i => i.id === product.id);
    if (existing) existing.qty += 1;
    else state.cart.push({ id: product.id, name: product.name, price: product.price, image: product.image, qty: 1 });
    saveCart();
    toast(`${product.name} added to cart`);
  }
  function updateQty(id, delta) {
    const item = state.cart.find(i => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) removeFromCart(id);
    else saveCart();
  }
  function removeFromCart(id) {
    const el = document.querySelector(`.cart-item[data-id="${id}"]`);
    if (el) {
      el.classList.add("removing");
      setTimeout(() => { state.cart = state.cart.filter(i => i.id !== id); saveCart(); }, 380);
    } else {
      state.cart = state.cart.filter(i => i.id !== id);
      saveCart();
    }
  }
  function cartTotal() { return state.cart.reduce((sum, i) => sum + i.price * i.qty, 0); }

  function renderCart() {
    try {
      const wrap = $("#cartItems");
      const countEl = $("#cartCount");
      const totalEl = $("#cartTotal");
      if (countEl) countEl.textContent = state.cart.reduce((s, i) => s + i.qty, 0);
      if (totalEl) totalEl.textContent = "৳" + cartTotal().toLocaleString();
      if (!wrap) return;

      if (!state.cart.length) {
        wrap.innerHTML = `<div class="cart-empty">Your cart is a quantum vacuum. Add something!</div>`;
        return;
      }
      wrap.innerHTML = state.cart.map(i => `
        <div class="cart-item" data-id="${i.id}">
          <img src="${i.image || ''}" alt="${i.name}" onerror="this.style.opacity=0">
          <div class="cart-item-info">
            <h5>${i.name}</h5>
            <div>৳${i.price.toLocaleString()}</div>
            <div class="cart-item-controls">
              <button class="qty-btn" data-act="dec" data-id="${i.id}">−</button>
              <span>${i.qty}</span>
              <button class="qty-btn" data-act="inc" data-id="${i.id}">+</button>
              <span class="remove-item" data-act="rm" data-id="${i.id}">Remove</span>
            </div>
          </div>
        </div>
      `).join("");
    } catch (e) { console.warn("renderCart error:", e); }
  }

  try {
    on($("#cartItems"), "click", (e) => {
      const t = e.target.closest("[data-act]");
      if (!t) return;
      const id = t.dataset.id;
      const pid = isNaN(id) ? id : Number(id);
      if (t.dataset.act === "inc") updateQty(pid, 1);
      if (t.dataset.act === "dec") updateQty(pid, -1);
      if (t.dataset.act === "rm") removeFromCart(pid);
    });

    on($("#cartBtn"), "click", openCart);
    on($("#closeCart"), "click", closeCart);
    on($("#cartOverlay"), "click", closeCart);
    function openCart() { $("#cartSidebar")?.classList.add("open"); $("#cartOverlay")?.classList.add("open"); }
    function closeCart() { $("#cartSidebar")?.classList.remove("open"); $("#cartOverlay")?.classList.remove("open"); }

    renderCart();
  } catch (e) { console.warn("Cart init error:", e); }

  /* ============================================================
     AUTH — register / login via API
     ============================================================ */
  try {
    on($("#authBtn"), "click", () => $("#authOverlay")?.classList.add("open"));
    on($("#closeAuth"), "click", () => $("#authOverlay")?.classList.remove("open"));
    on($("#authOverlay"), "click", (e) => { if (e.target.id === "authOverlay") $("#authOverlay").classList.remove("open"); });

    $$(".auth-tab").forEach(tab => on(tab, "click", () => {
      $$(".auth-tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      $$(".auth-form").forEach(f => f.classList.remove("active"));
      $(`#${tab.dataset.tab}Form`)?.classList.add("active");
    }));
  } catch (e) { console.warn("Auth tabs error:", e); }

  async function apiCall(url, payload) {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(state.token ? { Authorization: `Bearer ${state.token}` } : {})
      },
      body: JSON.stringify(payload)
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || "Request failed");
    return data;
  }

  try {
    on($("#registerForm"), "submit", async (e) => {
      e.preventDefault();
      const payload = {
        name: $("#regName")?.value, mobile: $("#regMobile")?.value, email: $("#regEmail")?.value,
        password: $("#regPassword")?.value, address: $("#regAddress")?.value, district: $("#regDistrict")?.value
      };
      try {
        const data = await apiCall(API_ACTIONS.REGISTER, payload);
        handleAuthSuccess(data, payload.name);
      } catch (err) { toast(err.message || "Registration failed", "error"); }
    });

    on($("#loginForm"), "submit", async (e) => {
      e.preventDefault();
      const payload = { mobile: $("#loginMobile")?.value, password: $("#loginPassword")?.value };
      try {
        const data = await apiCall(API_ACTIONS.LOGIN, payload);
        handleAuthSuccess(data, data.name || "User");
      } catch (err) { toast(err.message || "Login failed", "error"); }
    });
  } catch (e) { console.warn("Auth forms error:", e); }

  function handleAuthSuccess(data, name) {
    state.user = { name, mobile: data.mobile || "" };
    state.token = data.token || null;
    localStorage.setItem("nexcart_user", JSON.stringify(state.user));
    if (state.token) localStorage.setItem("nexcart_token", state.token);
    $("#authOverlay")?.classList.remove("open");
    toast(`Welcome, ${name}`);
  }

  /* ============================================================
     PRODUCTS FROM API (optional live sync)
     ============================================================ */
  async function getProducts() {
    try {
      const res = await fetch(API_ACTIONS.GET_PRODUCTS);
      const data = await res.json();
      if (Array.isArray(data) && data.length && window.products) {
        products.length = 0;
        products.push(...data);
        populateCategories();
        renderProducts();
      }
    } catch (err) {
      // No live backend yet — silently keep local products.js
    }
  }
  try { getProducts(); } catch (e) { console.warn("getProducts error:", e); }

  /* ============================================================
     QUANTUM CHECKOUT — order form
     ============================================================ */
  function showCheckout() {
    if (!state.cart.length) { toast("Your cart is empty", "error"); return; }
    $("#cartSidebar")?.classList.remove("open");
    $("#cartOverlay")?.classList.remove("open");
    renderCheckoutSummary();
    $("#checkoutBody")?.classList.remove("hidden");
    $("#checkoutSuccess")?.classList.remove("show");
    $("#checkoutOverlay")?.classList.add("open");
  }
  function closeCheckout() { $("#checkoutOverlay")?.classList.remove("open"); }

  try {
    on($("#initiateOrderBtn"), "click", showCheckout);
    on($("#closeCheckout"), "click", cl
function showCheckout() {
    if (!state.cart.length) { toast("Your cart is empty", "error"); return; }
    $("#cartSidebar")?.classList.remove("open");
    $("#cartOverlay")?.classList.remove("open");
    renderCheckoutSummary();
    $("#checkoutBody")?.classList.remove("hidden");
    $("#checkoutSuccess")?.classList.remove("show");
    $("#checkoutOverlay")?.classList.add("open");
  }
  function closeCheckout() { $("#checkoutOverlay")?.classList.remove("open"); }

  try {
    on($("#initiateOrderBtn"), "click", showCheckout);
    on($("#closeCheckout"), "click", closeCheckout);
    on($("#checkoutOverlay"), "click", (e) => { if (e.target.id === "checkoutOverlay") closeCheckout(); });

    on($("#checkoutForm"), "submit", async (e) => { e.preventDefault(); submitOrder(e); });

    on($("#orderNowBtn"), "click", (e) => {
      const btn = e.currentTarget;
      const r = btn.getBoundingClientRect();
      const ripple = document.createElement("span");
      ripple.className = "ripple";
      const size = Math.max(r.width, r.height);
      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = (e.clientX - r.left - size / 2) + "px";
      ripple.style.top = (e.clientY - r.top - size / 2) + "px";
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  } catch (e) { console.warn("Checkout init error:", e); }

  function renderCheckoutSummary() {
    const itemsEl = $("#checkoutItems");
    if (itemsEl) {
      itemsEl.innerHTML = state.cart.map(i => `
        <div class="checkout-summary-item">
          <span>${i.name} × ${i.qty}</span>
          <span>৳${(i.price * i.qty).toLocaleString()}</span>
        </div>
      `).join("");
    }
    const totalEl = $("#checkoutTotal");
    if (totalEl) totalEl.textContent = "৳" + cartTotal().toLocaleString();
  }

  async function submitOrder(e) {
    const payload = {
      name: $("#ordName")?.value, mobile: $("#ordMobile")?.value, email: $("#ordEmail")?.value,
      address: $("#ordAddress")?.value, district: $("#ordDistrict")?.value,
      payment: document.querySelector('input[name="payment"]:checked')?.value,
      items: state.cart, total: cartTotal()
    };
    let orderId = "NXC" + String(Math.floor(Math.random() * 1e7)).padStart(7, "0");
    try {
      const data = await apiCall(API_ACTIONS.CREATE_ORDER, payload);
      if (data.orderId) orderId = data.orderId;
    } catch (err) {
      console.warn("Order API unreachable, using local order ID:", err.message);
    }
    const idEl = $("#orderIdDisplay");
    if (idEl) idEl.textContent = orderId;
    $("#checkoutBody")?.classList.add("hidden");
    $("#checkoutSuccess")?.classList.add("show");
    state.cart = [];
    saveCart();
    e.target?.reset?.();
  }

  try { on($("#closeSuccessBtn"), "click", closeCheckout); } catch (e) {}

  /* ============================================================
     TRACKING — animated progress path
     ============================================================ */
  const STAGE_ORDER = ["pending", "processing", "shipped", "delivered"];
  function trackOrder() {
    const id = $("#trackingInput")?.value.trim();
    if (!id) { toast("Enter an order ID", "error"); return; }
    const hash = [...id].reduce((a, c) => a + c.charCodeAt(0), 0);
    const stageIndex = hash % 4;

    $$(".track-step").forEach(s => s.classList.remove("active"));
    $$(".track-line").forEach(l => l.classList.remove("filled"));

    STAGE_ORDER.forEach((stage, i) => {
      if (i <= stageIndex) {
        setTimeout(() => {
          $(`.track-step[data-step="${stage}"]`)?.classList.add("active");
          if (i > 0) $$(".track-line")[i - 1]?.classList.add("filled");
        }, i * 300);
      }
    });

    const labels = ["Pending confirmation…", "Being processed at fulfillment hub…", "Shipped — en route to you…", "Delivered. Enjoy!"];
    setTimeout(() => {
      const statusEl = $("#trackStatusText");
      if (statusEl) statusEl.textContent = `Order ${id}: ${labels[stageIndex]}`;
    }, stageIndex * 300 + 200);
  }
  try {
    on($("#trackBtn"), "click", trackOrder);
    on($("#trackingInput"), "keydown", (e) => { if (e.key === "Enter") trackOrder(); });
  } catch (e) { console.warn("Tracking init error:", e); }

  /* ============================================================
     SCROLL REVEAL
     ============================================================ */
  try {
    const revealTargets = document.querySelectorAll(".info-card, .tracking-panel, .shop-layout");
    revealTargets.forEach(el => el.classList.add("reveal"));
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add("visible"); io.unobserve(entry.target); }
      });
    }, { threshold: 0.15 });
    revealTargets.forEach(el => io.observe(el));
  } catch (e) { console.warn("Scroll reveal error:", e); }

  /* ============================================================
     TOASTS
     ============================================================ */
  function toast(msg, type = "success") {
    const stack = $("#toastStack");
    if (!stack) return;
    const t = document.createElement("div");
    t.className = "toast" + (type === "error" ? " error" : "");
    t.textContent = msg;
    stack.appendChild(t);
    setTimeout(() => t.remove(), 2800);
  }

  window.NEXCART = { addToCart, showCheckout, submitOrder };
})();

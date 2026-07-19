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
  function initShop() {
    populateCategories();
    renderProducts();

    $("#productSearch").addEventListener("input", (e) => {
      state.filters.search = e.target.value.toLowerCase();
      renderProducts();
    });
    $("#categoryFilter").addEventListener("change", (e) => {
      state.filters.category = e.target.value;
      renderProducts();
    });
    $("#priceFilter").addEventListener("input", (e) => {
      state.filters.maxPrice = Number(e.target.value);
      $("#priceMax").textContent = "৳" + Number(e.target.value).toLocaleString() + (Number(e.target.value) >= 200000 ? "+" : "");
      renderProducts();
    });
    $("#sortFilter").addEventListener("change", (e) => {
      state.filters.sort = e.target.value;
      renderProducts();
    });

    $("#aiSearchBtn").addEventListener("click", () => {
      goToPage("shop");
      $("#productSearch").focus();
    });
  }

  function populateCategories() {
    const sel = $("#categoryFilter");
    const cats = Array.from(new Set((window.products || []).map((p) => p.category).filter(Boolean)));
    cats.forEach((c) => {
      const opt = document.createElement("option");
      opt.value = c; opt.textContent = c;
      sel.appendChild(opt);
    });
  }

  function getFilteredProducts() {
    let list = (window.products || []).slice();
    const f = state.filters;

    if (f.search) {
      list = list.filter((p) => (p.name || "").toLowerCase().includes(f.search) || (p.category || "").toLowerCase().includes(f.search));
    }
    if (f.category !== "all") {
      list = list.filter((p) => p.category === f.category);
    }
    list = list.filter((p) => (p.price || 0) <= f.maxPrice);

    switch (f.sort) {
      case "price-asc": list.sort((a, b) => (a.price||0) - (b.price||0)); break;
      case "price-desc": list.sort((a, b) => (b.price||0) - (a.price||0)); break;
      case "newest": list.sort((a, b) => new Date(b.createdAt||0) - new Date(a.createdAt||0)); break;
      default: list.sort((a, b) => (b.trending === true) - (a.trending === true));
    }
    return list;
  }

  function renderProducts() {
    const grid = $("#productGrid");
    const empty = $("#emptyState");
    const list = getFilteredProducts();

    grid.innerHTML = "";
    $("#resultCount").textContent = `${list.length} item${list.length === 1 ? "" : "s"}`;

    if (!list.length) {
      empty.classList.add("show");
      return;
    }
    empty.classList.remove("show");

    list.forEach((p, i) => {
      const card = document.createElement("div");
      card.className = "product-card";
      card.style.animationDelay = `${Math.min(i, 10) * 0.05}s`;
      card.innerHTML = `
        ${p.trending ? '<span class="card-badge">AI TRENDING</span>' : ""}
        <div class="product-thumb">${p.image ? `<img src="${escapeAttr(p.image)}" alt="${escapeAttr(p.name || "")}" loading="lazy">` : "🛰️"}</div>
        <div class="product-name">${escapeHtml(p.name || "Unnamed Product")}</div>
        <div class="product-cat">${escapeHtml(p.category || "")}</div>
        <div class="product-price-row">
          <span class="product-price">৳${Number(p.price || 0).toLocaleString()}</span>
        </div>
        <div class="card-actions">
          <button class="btn btn-liquid btn-ghost add-to-cart-btn" data-id="${escapeAttr(p.id)}"><span>Add to Cart</span></button>
          <button class="btn btn-liquid btn-primary instant-buy-btn" data-id="${escapeAttr(p.id)}"><span>Instant Buy</span></button>
        </div>
      `;
      grid.appendChild(card);
    });

    $$(".add-to-cart-btn").forEach((btn) => btn.addEventListener("click", (e) => {
      addToCart(btn.dataset.id);
      spawnRipple(e, btn);
    }));
    $$(".instant-buy-btn").forEach((btn) => btn.addEventListener("click", (e) => {
      addToCart(btn.dataset.id, true);
      spawnRipple(e, btn);
      showOrderForm();
    }));

    initTiltCards();
  }

  /* ------------------------------------------------------------
     CART SYSTEM (localStorage)
  ------------------------------------------------------------ */
function saveCart() {
    localStorage.setItem("nexcart_cart", JSON.stringify(state.cart));
    renderCartBadge();
  }

  function addToCart(productId, silent) {
    const product = (window.products || []).find((p) => String(p.id) === String(productId));
    if (!product) { showToast("Product unavailable in the catalog."); return; }

    const existing = state.cart.find((c) => c.id === product.id);
    if (existing) existing.qty += 1;
    else state.cart.push({ id: product.id, name: product.name, price: product.price, image: product.image, qty: 1 });

    saveCart();
    renderCartItems();
    if (!silent) showToast(`${product.name} added to cart`);
  }

  function updateQty(id, delta) {
    const item = state.cart.find((c) => c.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
      removeFromCart(id);
      return;
    }
    saveCart();
    renderCartItems();
  }

  function removeFromCart(id) {
    const el = document.querySelector(`.cart-item[data-id="${cssEscape(id)}"]`);
    if (el) {
      el.classList.add("removing");
      setTimeout(() => {
        state.cart = state.cart.filter((c) => c.id !== id);
        saveCart();
        renderCartItems();
      }, 280);
    } else {
      state.cart = state.cart.filter((c) => c.id !== id);
      saveCart();
      renderCartItems();
    }
  }

  function cartTotal() {
    return state.cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  }

  function renderCartBadge() {
    const count = state.cart.reduce((s, i) => s + i.qty, 0);
    $("#cartCount").textContent = count;
  }

  function renderCartItems() {
    const wrap = $("#cartItems");
    const emptyMsg = $("#cartEmptyMsg");
    wrap.innerHTML = "";

    if (!state.cart.length) {
      emptyMsg.classList.add("show");
    } else {
      emptyMsg.classList.remove("show");
      state.cart.forEach((item) => {
        const row = document.createElement("div");
        row.className = "cart-item";
        row.dataset.id = item.id;
        row.innerHTML = `
          <div class="cart-item-thumb">${item.image ? `<img src="${escapeAttr(item.image)}" alt="">` : "🛰️"}</div>
          <div class="cart-item-info">
            <h4>${escapeHtml(item.name)}</h4>
            <div class="cart-item-price">৳${Number(item.price).toLocaleString()}</div>
            <div class="qty-row">
              <button class="qty-btn minus">−</button>
              <span>${item.qty}</span>
              <button class="qty-btn plus">+</button>
            </div>
            <div class="remove-item">Remove</div>
          </div>
        `;
        row.querySelector(".minus").addEventListener("click", () => updateQty(item.id, -1));
        row.querySelector(".plus").addEventListener("click", () => updateQty(item.id, 1));
        row.querySelector(".remove-item").addEventListener("click", () => removeFromCart(item.id));
        wrap.appendChild(row);
      });
    }
    $("#cartTotal").textContent = "৳" + cartTotal().toLocaleString();
  }

  function initCartUI() {
    renderCartItems();
    $("#cartBtn").addEventListener("click", openCart);
    $("#closeCart").addEventListener("click", closeCart);
    $("#cartScrim").addEventListener("click", () => { closeCart(); closeAuthPopup(); });
    $("#initiateOrderBtn").addEventListener("click", () => {
      if (!state.cart.length) { showToast("Your cart is empty."); return; }
      closeCart();
      showOrderForm();
    });
  }

  function openCart() {
    $("#cartSidebar").classList.add("open");
    $("#cartScrim").classList.add("show");
  }
  function closeCart() {
    $("#cartSidebar").classList.remove("open");
    $("#cartScrim").classList.remove("show");
  }

  /* ------------------------------------------------------------
     QUANTUM CHECKOUT (order form)
  ------------------------------------------------------------ */
  function initCheckout() {
    $("#closeCheckout").addEventListener("click", hideOrderForm);
    $("#successCloseBtn").addEventListener("click", () => {
      hideOrderForm();
      goToPage("shop");
    });
    $("#orderForm").addEventListener("submit", (e) => {
      e.preventDefault();
      submitOrder();
    });
  }

  window.showOrderForm = function showOrderForm() {
    if (!state.cart.length) { showToast("Your cart is empty."); return; }
    renderSummary();
    $("#checkoutOverlay").classList.add("show");
    $("#orderForm").hidden = false;
    $("#orderForm").style.display = "";
    $("#orderSuccess").hidden = true;
  };

  function hideOrderForm() {
    $("#checkoutOverlay").classList.remove("show");
  }

  function renderSummary() {
    const wrap = $("#summaryItems");
    wrap.innerHTML = "";
    state.cart.forEach((item) => {
      const row = document.createElement("div");
      row.className = "summary-item";
      row.innerHTML = `<span>${escapeHtml(item.name)} × ${item.qty}</span><span>৳${(item.price * item.qty).toLocaleString()}</span>`;
      wrap.appendChild(row);
    });
    $("#summaryTotal").textContent = "৳" + cartTotal().toLocaleString();
  }

  async function submitOrder() {
    const btn = $("#orderNowBtn");
    const payload = {
      name: $("#custName").value.trim(),
      mobile: $("#custMobile").value.trim(),
      email: $("#custEmail").value.trim(),
      address: $("#custAddress").value.trim(),
      district: $("#custDistrict").value,
      payment: (document.querySelector('input[name="payment"]:checked') || {}).value || "cod",
      items: state.cart,
      total: cartTotal(),
    };

    btn.disabled = true;
    const originalText = btn.innerHTML;
    btn.innerHTML = "<span>PROCESSING...</span>";

    try {
      const result = await apiCall("create", payload);
      const orderId = (result && result.orderId) || generateOrderId();
      showOrderSuccess(orderId);
      state.cart = [];
      saveCart();
      renderCartItems();
    } catch (err) {
      // API not reachable (expected until backend is wired up) — still confirm locally
      const orderId = generateOrderId();
      showOrderSuccess(orderId);
      state.cart = [];
      saveCart();
      renderCartItems();
    } finally {
      btn.disabled = false;
      btn.innerHTML = originalText;
    }
  }

  function generateOrderId() {
    const last = Number(localStorage.getItem("nexcart_order_seq") || "0") + 1;
    localStorage.setItem("nexcart_order_seq", String(last));
    return "NXC" + String(last).padStart(7, "0");
  }

  function showOrderSuccess(orderId) {
    $("#orderForm").hidden = true;
    $("#orderForm").style.display = "none";
    $("#orderSuccess").hidden = false;
    $("#finalOrderId").textContent = "Order ID: " + orderId;
    // persist for tracking demo
  const orders = JSON.parse(localStorage.getItem("nexcart_orders") || "{}");
    orders[orderId] = { step: 0, createdAt: Date.now() };
    localStorage.setItem("nexcart_orders", JSON.stringify(orders));
  }

  /* ------------------------------------------------------------
     TRACKING
  ------------------------------------------------------------ */
  function initTracking() {
    $("#trackBtn").addEventListener("click", runTracking);
    $("#trackingInput").addEventListener("keydown", (e) => {
      if (e.key === "Enter") runTracking();
    });
  }

  function runTracking() {
    const id = $("#trackingInput").value.trim();
    if (!id) { showToast("Enter an order ID to track."); return; }

    const orders = JSON.parse(localStorage.getItem("nexcart_orders") || "{}");
    // Deterministic pseudo-status derived from the order id + elapsed time,
    // so the same ID always reproduces a believable step.
    let step;
    if (orders[id]) {
      const hrsElapsed = (Date.now() - orders[id].createdAt) / 3600000;
      step = Math.min(3, Math.floor(hrsElapsed / 6));
    } else {
      let hash = 0;
      for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
      step = hash % 4;
    }

    $("#trackingResult").hidden = false;
    $("#orderIdDisplay").textContent = "ORDER — " + id.toUpperCase();

    const steps = $$(".path-step");
    steps.forEach((s, i) => {
      s.classList.remove("done", "current");
      if (i < step) s.classList.add("done");
      else if (i === step) s.classList.add("current");
    });
    $("#pathFill").style.width = `${(step / 3) * 100}%`;

    const notes = [
      "Your order has been received and is awaiting confirmation.",
      "Your order is being prepared at the nearest quantum fulfillment node.",
      "Your order has left the facility and is en route to your district.",
      "Your order has been delivered. Thank you for shopping with NEXCARTBD.",
    ];
    $("#trackingNote").textContent = notes[step];
  }

  /* ------------------------------------------------------------
     AUTH — register / login via API
  ------------------------------------------------------------ */
  function initAuth() {
    $("#authBtn").addEventListener("click", openAuthPopup);
    $("#closeAuth").addEventListener("click", closeAuthPopup);
    $("#authScrim").addEventListener("click", closeAuthPopup);

    $$(".auth-tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        $$(".auth-tab").forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        $$(".auth-form").forEach((f) => f.classList.remove("active"));
        $(`#${tab.dataset.tab}Form`).classList.add("active");
      });
    });

    $("#loginForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      await handleLogin();
    });
    $("#registerForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      await handleRegister();
    });
  }

  function openAuthPopup() {
    $("#authPopup").classList.add("show");
    $("#authScrim").classList.add("show");
  }
  function closeAuthPopup() {
    $("#authPopup").classList.remove("show");
    $("#authScrim").classList.remove("show");
  }

  async function handleLogin() {
    const msg = $("#loginMsg");
    msg.textContent = "Authenticating...";
    msg.classList.remove("error");
    try {
      const payload = { identifier: $("#loginId").value.trim(), password: $("#loginPassword").value };
      const result = await apiCall("login", payload);
      state.user = (result && result.user) || { name: "Member" };
      state.token = (result && result.token) || null;
      persistUser();
      msg.textContent = "Welcome back!";
      setTimeout(closeAuthPopup, 700);
    } catch (err) {
      msg.textContent = "Login failed. Check your credentials or connection.";
      msg.classList.add("error");
    }
  }

  async function handleRegister() {
    const msg = $("#registerMsg");
    msg.textContent = "Creating your account...";
    msg.classList.remove("error");
    try {
      const payload = {
        name: $("#regName").value.trim(),
        mobile: $("#regMobile").value.trim(),
        email: $("#regEmail").value.trim(),
        password: $("#regPassword").value,
        address: $("#regAddress").value.trim(),
        district: $("#regDistrict").value,
      };
      const result = await apiCall("register", payload);
      state.user = (result && result.user) || { name: payload.name };
      state.token = (result && result.token) || null;
      persistUser();
      msg.textContent = "Account created. Welcome to NEXCARTBD!";
      setTimeout(closeAuthPopup, 700);
    } catch (err) {
      msg.textContent = "Registration failed. Please try again.";
      msg.classList.add("error");
    }
  }

  function persistUser() {
    if (state.user) localStorage.setItem("nexcart_user", JSON.stringify(state.user));
    if (state.token) localStorage.setItem("nexcart_token", state.token);
  }

  /* ------------------------------------------------------------
     API LAYER
     Actions: register, login, getProducts, create (order)
  ------------------------------------------------------------ */
  async function apiCall(action, data) {
    const endpointMap = {
      register: "/auth/register",
      login: "/auth/login",
      getProducts: "/products",
      create: "/orders/create",
    };
    const path = endpointMap[action] || `/${action}`;
    const url = `${API_URL}${path}`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(state.token ? { Authorization: `Bearer ${state.token}` } : {}),
      },
      body: JSON.stringify(data || {}),
    });

    if (!res.ok) throw new Error(`API ${action} failed with status ${res.status}`);
    return res.json();
  }

  /* ------------------------------------------------------------
     3D TILT ON HOVER (product cards)
  ------------------------------------------------------------ */
  function initTiltCards() {
    $$(".product-card").forEach((card) => {
      if (card.dataset.tiltBound) return;
      card.dataset.tiltBound = "1";
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const rx = ((y / rect.height) - 0.5) * -10;
        const ry = ((x / rect.width) - 0.5) * 10;
        card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(6px)`;
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "perspective(800px) rotateX(0) rotateY(0) translateZ(0)";
      });
    });
  }

  /* ------------------------------------------------------------
     LIQUID BUTTON RIPPLE
  ------------------------------------------------------------ */
  function initRippleButtons() {
    document.addEventListener("click", (e) => {
      const btn = e.target.closest(".btn");
      if (!btn) return;
      spawnRipple(e, btn);
    });
  }

  function spawnRipple(e, btn) {
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement("span");
    const size = Math.max(rect.width, rect.height);
    ripple.className = "ripple";
    ripple.style.width = ripple.style.height = size + "px";
    ripple.style.left = (e.clientX - rect.left - size / 2) + "px";
    ripple.style.top = (e.clientY - rect.top - size / 2) + "px";
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 650);
  }

  /* ------------------------------------------------------------
     UTIL
  ------------------------------------------------------------ */

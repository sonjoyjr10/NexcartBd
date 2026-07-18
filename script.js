/* ============================================================
   NEXCARTBD — 2060 Storefront Engine
   Vanilla JS. Cart + Auth + Orders + Particle/Cursor FX.
   ============================================================ */

(() => {
  "use strict";

  /* ---------- STATE ---------- */
  const state = {
    cart: JSON.parse(localStorage.getItem("nexcart_cart") || "[]"),
    user: JSON.parse(localStorage.getItem("nexcart_user") || "null"),
    token: localStorage.getItem("nexcart_token") || null,
    filtered: []
  };

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  /* ============================================================
     BOOT SCREEN
     ============================================================ */
  window.addEventListener("load", () => {
    const fill = $("#bootFill");
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 25;
      fill.style.width = Math.min(p, 100) + "%";
      if (p >= 100) {
        clearInterval(iv);
        setTimeout(() => $("#bootScreen").classList.add("done"), 300);
      }
    }, 120);
  });

  /* ============================================================
     CUSTOM CURSOR + LIGHT TRAIL
     ============================================================ */
  const cursorCore = $("#cursorCore");
  const cursorRing = $("#cursorRing");
  if (window.matchMedia("(hover: hover)").matches) {
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
      if (Math.random() > 0.6) return; // throttle
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

  /* ============================================================
     PARTICLE UNIVERSE BACKGROUND
     ============================================================ */
  const canvas = $("#particleField");
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
    // faint connecting lines for nearby particles
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

  /* ============================================================
     HEADER — scroll state + mobile nav + AI search
     ============================================================ */
  const header = $("#siteHeader");
  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 30);
  });

  $("#hamburger").addEventListener("click", () => {
    $("#mainNav").classList.toggle("open");
  });
  $$(".nav-link").forEach(link => link.addEventListener("click", () => {
    $$(".nav-link").forEach(l => l.classList.remove("active"));
    link.classList.add("active");
    $("#mainNav").classList.remove("open");
  }));

  $("#aiSearchBtn").addEventListener("click", () => {
    $("#aiSearchPanel").classList.toggle("open");
    $("#aiSearchInput").focus();
  });
  $("#closeSearch").addEventListener("click", () => $("#aiSearchPanel").classList.remove("open"));
  $("#aiSearchInput").addEventListener("input", (e) => {
    $("#shopSearch").value = e.target.value;
    renderProducts();
    document.getElementById("shop").scrollIntoView({ behavior: "smooth" });
  });

  /* ============================================================
     HERO — typewriter + 3D orb tracking mouse
     ============================================================ */
  const phrase = "WELCOME TO 2060 SHOPPING";
  let ti = 0;
  function typewrite() {
    if (ti <= phrase.length) {
      $("#typewriter").textContent = phrase.slice(0, ti);
      ti++;
      setTimeout(typewrite, 55);
    }
  }
  typewrite();

  const orb = $("#heroOrb");
  window.addEventListener("mousemove", (e) => {
    const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
    const rx = ((e.clientY - cy) / cy) * -10;
    const ry = ((e.clientX - cx) / cx) * 10;
    orb.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
  });

  $("#aiRecommendBtn").addEventListener("click", () => {
    if (!products.length) {
      toast("AI is still learning the catalog — check back soon.", "error");
      return;
    }
    const pick = products[Math.floor(Math.random() * products.length)];
    toast(`AI recommends: ${pick.name}`);
    document.getElementById("shop").scrollIntoView({ behavior: "smooth" });
  });

  /* liquid button glow follows cursor */
  $$(".btn-primary").forEach(btn => {
    btn.addEventListener("mousemove", (e) => {
      const r = btn.getBoundingClientRect();
      btn.style.setProperty("--mx", `${e.clientX - r.left}px`);
      btn.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
  });

  /* ============================================================
     PRODUCTS — render from products.js, filters, 3D tilt
     ============================================================ */
  function populateCategories() {
    const cats = [...new Set(products.map(p => p.category).filter(Boolean))];
    const sel = $("#categoryFilter");
    cats.forEach(c => {
      const opt = document.createElement("option");
      opt.value = c; opt.textContent = c;
      sel.appendChild(opt);
    });
  }

  function renderProducts() {
    const grid = $("#productGrid");
    const search = $("#shopSearch").value.toLowerCase();
    const category = $("#categoryFilter").value;
    const maxPrice = Number($("#priceFilter").value);

    const list = products.filter(p => {
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
          <p>${products.length ? "No products match your filters." : "AI is scanning the catalog… products will materialize here once added."}</p>
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
  }

  function apply3DTilt(card) {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-4px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "rotateY(0) rotateX(0) translateY(0)";
    });
  }

  $("#productGrid").addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;
    const product = products.find(p => String(p.id) === btn.dataset.id);
    if (!product) return;
    if (btn.dataset.action === "add") {
      addToCart(product);
    } else {
      addToCart(product);
      showCheckout();
    }
  });

  ["shopSearch", "categoryFilter"].forEach(id => $("#" + id)?.addEventListener("input", renderProducts));
  $("#priceFilter").addEventListener("input", (e) => {
    $("#priceLabel").textContent = "৳" + Number(e.target.value).toLocaleString();
    renderProducts();
  });
  $("#resetFilters").addEventListener("click", () => {
    $("#shopSearch").value = "";
    $("#categoryFilter").value = "all";
    $("#priceFilter").value = 200000;
    $("#priceLabel").textContent = "Any";
    renderProducts();
  });

  populateCategories();
  renderProducts();

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
      setTimeout(() => {
        state.cart = state.cart.filter(i => i.id !== id);
        saveCart();
      }, 380);
    } else {
      state.cart = state.cart.filter(i => i.id !== id);
      saveCart();
    }
  }

  function cartTotal() {
    return state.cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  }

  function renderCart() {
    const wrap = $("#cartItems");
    $("#cartCount").textContent = state.cart.reduce((s, i) => s + i.qty, 0);
    $("#cartTotal").textContent = "৳" + cartTotal().toLocaleString();

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
  }

  $("#cartItems").addEventListener("click", (e) => {
    const t = e.target.closest("[data-act]");
    if (!t) return;
    const id = t.dataset.id;
    const pid = isNaN(id) ? id : Number(id);
    if (t.dataset.act === "inc") updateQty(pid, 1);
    if (t.dataset.act === "dec") updateQty(pid, -1);
    if (t.dataset.act === "rm") removeFromCart(pid);
  });

  $("#cartBtn").addEventListener("click", openCart);
  $("#closeCart").addEventListener("click", closeCart);
  $("#cartOverlay").addEventListener("click", closeCart);
  function openCart() {
    $("#cartSidebar").classList.add("open");
    $("#cartOverlay").classList.add("open");
  }
  function closeCart() {
    $("#cartSidebar").classList.remove("open");
    $("#cartOverlay").classList.remove("open");
  }

  renderCart();

  /* ============================================================
     AUTH — register / login via API
     ============================================================ */
  $("#authBtn").addEventListener("click", () => $("#authOverlay").classList.add("open"));
  $("#closeAuth").addEventListener("click", () => $("#authOverlay").classList.remove("open"));
  $("#authOverlay").addEventListener("click", (e) => { if (e.target.id === "authOverlay") $("#authOverlay").classList.remove("open"); });

  $$(".auth-tab").forEach(tab => tab.addEventListener("click", () => {
    $$(".auth-tab").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    $$(".auth-form").forEach(f => f.classList.remove("active"));
    $(`#${tab.dataset.tab}Form`).classList.add("active");
  }));

  async function apiCall(url, payload) {
    try {
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
    } catch (err) {
      throw err;
    }
  }

  $("#registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const payload = {
      name: $("#regName").value,
      mobile: $("#regMobile").value,
      email: $("#regEmail").value,
      password: $("#regPassword").value,
      address: $("#regAddress").value,
      district: $("#regDistrict").value
    };
    try {
      const data = await apiCall(API_ACTIONS.REGISTER, payload);
      handleAuthSuccess(data, payload.name);
    } catch (err) {
      toast(err.message || "Registration failed", "error");
    }
  });

  $("#loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const payload = {
      mobile: $("#loginMobile").value,
      password: $("#loginPassword").value
    };
    try {
      const data = await apiCall(API_ACTIONS.LOGIN, payload);
      handleAuthSuccess(data, data.name || "User");
    } catch (err) {
      toast(err.message || "Login failed", "error");
    }
  });

  function handleAuthSuccess(data, name) {
    state.user = { name, mobile: data.mobile || "" };
    state.token = data.token || null;
    localStorage.setItem("nexcart_user", JSON.stringify(state.user));
    if (state.token) localStorage.setItem("nexcart_token", state.token);
    $("#authOverlay").classList.remove("open");
    toast(`Welcome, ${name}`);
  }

  /* ============================================================
     PRODUCTS FROM API (optional live sync)
     ============================================================ */
  async function getProducts() {
    try {
      const res = await fetch(API_ACTIONS.GET_PRODUCTS);
      const data = await res.json();
      if (Array.isArray(data) && data.length) {
        products.length = 0;
        products.push(...data);
        populateCategories();
        renderProducts();
      }
    } catch (err) {
      // Silently fall back to local products.js — no live backend yet
    }
  }
  getProducts();

  /* ============================================================
     QUANTUM CHECKOUT — order form
     ============================================================ */
  function showCheckout() {
    if (!state.cart.length) {
      toast("Your cart is empty", "error");
      return;
    }
    closeCart();
    renderCheckoutSummary();
    $("#checkoutBody").classList.remove("hidden");
    $("#checkoutSuccess").classList.remove("show");
    $("#checkoutOverlay").classList.add("open");
  }
  function closeCheckout() {
    $("#checkoutOverlay").classList.remove("open");
  }

  $("#initiateOrderBtn").addEventListener("click", showCheckout);
  $("#closeCheckout").addEventListener("click", closeCheckout);
  $("#checkoutOverlay").addEventListener("click", (e) => { if (e.target.id === "checkoutOverlay") closeCheckout(); });

  function renderCheckoutSummary() {
    $("#checkoutItems").innerHTML = state.cart.map(i => `
      <div class="checkout-summary-item">
        <span>${i.name} × ${i.qty}</span>
        <span>৳${(i.price * i.qty).toLocaleString()}</span>
      </div>
    `).join("");
    $("#checkoutTotal").textContent = "৳" + cartTotal().toLocaleString();
  }

  $("#checkoutForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    submitOrder(e);
  });

  // ripple on ORDER NOW click
  $("#orderNowBtn").addEventListener("click", (e) => {
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

  async function submitOrder(e) {
    const payload = {
      name: $("#ordName").value,
      mobile: $("#ordMobile").value,
      email: $("#ordEmail").value,
      address: $("#ordAddress").value,
      district: $("#ordDistrict").value,
      payment: document.querySelector('input[name="payment"]:checked')?.value,
      items: state.cart,
      total: cartTotal()
    };

    let orderId = "NXC" + String(Math.floor(Math.random() * 1e7)).padStart(7, "0");

    try {
      const data = await apiCall(API_ACTIONS.CREATE_ORDER, payload);
      if (data.orderId) orderId = data.orderId;
    } catch (err) {
      // No live bac

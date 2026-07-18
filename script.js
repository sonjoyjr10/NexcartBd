// Global State Allocation Engine
let cart = [];
let shippingCost = CONFIG.shipping.insideDhaka; // Dynamically pull initial inside Dhaka cost

// Core System Lifecycles - Inject all dynamic assets using CONFIG object properties
function initializeWebsite() {
    // 1. Set global document headers & top notice bar text dynamically
    document.getElementById("site-title-tag").textContent = `${CONFIG.storeName} - Premium E-Store Platform`;
    document.getElementById("top-bar-announcement").textContent = `Welcome to ${CONFIG.storeName} | Fast Reliable Deliveries Everywhere`;

    // 2. Build Logo Components inside layout dynamically
    const logoContainer = document.getElementById("dynamic-logo-container");
    logoContainer.innerHTML = `${CONFIG.logoTextPrimary}<span>${CONFIG.logoTextAccent}</span>`;
    
    const footerLogo = document.getElementById("footer-logo-anchor");
    footerLogo.innerHTML = `${CONFIG.logoTextPrimary}<span>${CONFIG.logoTextAccent}</span>`;

    // 3. Populate Hero Banner using configuration variables
    document.getElementById("hero-badge").textContent = CONFIG.hero.badge;
    document.getElementById("hero-title").textContent = CONFIG.hero.title;
    document.getElementById("hero-desc").textContent = CONFIG.hero.description;
    
    const heroBtn = document.getElementById("hero-btn");
    heroBtn.textContent = CONFIG.hero.buttonText;
    heroBtn.setAttribute("href", CONFIG.hero.buttonLink);

    // 4. Mount Select Dropdown Option Tags using configuration metrics
    document.getElementById("opt-inside").textContent = `Inside Dhaka (${CONFIG.currencySymbol}${CONFIG.shipping.insideDhaka})`;
    document.getElementById("opt-outside").textContent = `Outside Dhaka (${CONFIG.currencySymbol}${CONFIG.shipping.outsideDhaka})`;

    // 5. Mount texts inside active DOM sections
    document.getElementById("footer-about-paragraph").textContent = CONFIG.footer.aboutText;
    document.getElementById("footer-copyright-string").textContent = CONFIG.footer.copyright;

    // 6. Trigger transactional operations rendering
    renderProductGrid();
    updateCartUI();
}

// Map database array elements to active CSS template grid
function renderProductGrid() {
    const container = document.getElementById("product-list");
    if (!container) return;
    
    container.innerHTML = CONFIG.products.map(product => `
        <div class="product-item">
            <div class="product-img-frame">
                <img src="${product.image}" alt="${product.title}" loading="lazy">
            </div>
            <div class="product-info">
                <h3 class="p-title">${product.title}</h3>
                <div class="p-rating">
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star-half-stroke"></i>
                    <span>(${product.rating})</span>
                </div>
                <div class="p-price">${CONFIG.currencySymbol} ${product.price.toLocaleString()}</div>
                <button class="btn-buy-now" onclick="addItemToCart(${product.id})">
                    <i class="fa-solid fa-cart-plus"></i> Buy Now / Order
                </button>
            </div>
        </div>
    `).join('');
}

// Side Cart Window View toggling
function toggleCart() {
    document.getElementById("cartDrawer").classList.toggle("open");
    document.getElementById("cartOverlay").classList.toggle("open");
}

// Handle cart calculations operations pipeline
function addItemToCart(productId) {
    const item = CONFIG.products.find(p => p.id === productId);
    const existing = cart.find(c => c.id === productId);
    
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    
    updateCartUI();
    toggleCart(); // Slide open cart drawer modal layer instantly like premium Shopify frameworks
}

function removeCartItem(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
}

// Synchronize all items total pricing inside standard viewport fields
function updateCartUI() {
    const counts = document.querySelectorAll(".cart-count");
    const totalItems = cart.reduce((acc, current) => acc + current.quantity, 0);
    counts.forEach(el => el.textContent = totalItems);
    
    const cartContainer = document.getElementById("cartItemsContainer");
    const subtotalPriceEl = document.querySelector(".subtotal-price");
    
    const subtotal = cart.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
    subtotalPriceEl.textContent = `${CONFIG.currencySymbol} ${subtotal.toLocaleString()}`;

    if(cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-cart-msg">
                <i class="fa-solid fa-basket-shopping"></i>
                <p>Your shopping cart is currently empty.</p>
            </div>
        `;
    } else {
        cartContainer.innerHTML = cart.map(item => `
            <div class="cart-prod-item">
                <div class="cart-prod-img"><img src="${item.image}"></div>
                <div class="cart-prod-details">
                    <h5>${item.title}</h5>
                    <p>${item.quantity} x ${CONFIG.currencySymbol}${item.price.toLocaleString()}</p>
                </div>
                <button class="remove-cart-item" onclick="removeCartItem(${item.id})">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        `).join('');
    }
    
    updateCheckoutSummary(subtotal);
}

// Synchronize inside sidebar panel order summaries tracking module
function updateCheckoutSummary(subtotal) {
    const summaryItemsContainer = document.getElementById("checkoutSummaryItems");
    const itemsTotalEl = document.getElementById("summaryItemsTotal");
    const shippingEl = document.getElementById("summaryShipping");
    const grandTotalEl = document.getElementById("summaryGrandTotal");
    
    if(!summaryItemsContainer) return;

    if(cart.length === 0) {
        summaryItemsContainer.innerHTML = `<p class="text-muted">No operational lines selected.</p>`;
        itemsTotalEl.textContent = `${CONFIG.currencySymbol} 0`;
        shippingEl.textContent = `${CONFIG.currencySymbol} ${shippingCost}`;
        grandTotalEl.textContent = `${CONFIG.currencySymbol} 0`;
        return;
    }

    summaryItemsContainer.innerHTML = cart.map(item => `
        <div class="summary-item-row">
            <span>${item.title} <strong>(x${item.quantity})</strong></span>
            <span>${CONFIG.currencySymbol} ${(item.price * item.quantity).toLocaleString()}</span>
        </div>
    `).join('');

    itemsTotalEl.textContent = `${CONFIG.currencySymbol} ${subtotal.toLocaleString()}`;
    shippingEl.textContent = `${CONFIG.currencySymbol} ${shippingCost}`;
    grandTotalEl.textContent = `${CONFIG.currencySymbol} ${(subtotal + shippingCost).toLocaleString()}`;
}

// Recalculate billing values automatically when shipping parameters mutation occurs
function updateShippingPrice() {
    const citySelect = document.getElementById("city");
    shippingCost = citySelect.value === "Dhaka" ? CONFIG.shipping.insideDhaka : CONFIG.shipping.outsideDhaka;
    
    const subtotal = cart.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
    updateCheckoutSummary(subtotal);
}

// Redirect client to target anchor block form view context
function scrollToCheckout() {
    toggleCart(); 
    const checkoutArea = document.getElementById("checkout-area");
    if(checkoutArea) {
        checkoutArea.scrollIntoView({ behavior: 'smooth' });
    }
}

// Setup listeners to handle visually selected inputs toggles
document.addEventListener('DOMContentLoaded', () => {
    const options = document.querySelectorAll('.payment-option');
    options.forEach(option => {
        option.addEventListener('click', function() {
            options.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            this.querySelector('input[type="radio"]').checked = true;
        });
    });
});

// Mock submission validation processor endpoint
function handleOrderSubmit(e) {
    e.preventDefault();
    if(cart.length === 0) {
        alert("Your transaction matrix contains no assets! Order submission cancelled.");
        return;
    }
    
    const name = document.getElementById("fullName").value;
    const phone = document.getElementById("phone").value;
    const addr = document.getElementById("address").value;
    
    alert(`🎉 Order Dispatched Successfully via CRM Setup!\n\nClient Name: ${name}\nShipping Targets: ${addr}\nContact Channel: ${phone}\n\nOur service line will sync tracking parameters shorty.`);
    
    cart = [];
    updateCartUI();
    document.getElementById("orderForm").reset();
}

// Execute core rendering framework lifecycles instantly
window.onload = initializeWebsite;

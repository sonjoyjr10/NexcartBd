let selectedProduct = null;
let currentQuantity = 1;
let deliveryCharge = CONFIG.DELIVERY.insideDhaka.charge;

// ১. পেজ লোড হবার পরে ডাইনামিক স্টাইল এবং কনফিগারেশন সেট করা
document.addEventListener("DOMContentLoaded", () => {
    // ডাইনামিক সিএসএস ভেরিয়েবল ইনজেকশন
    const root = document.documentElement;
    root.style.setProperty('--primary-color', CONFIG.THEME.primaryColor);
    root.style.setProperty('--primary-hover', CONFIG.THEME.primaryHover);
    root.style.setProperty('--accent-color', CONFIG.THEME.accentColor);
    root.style.setProperty('--bg-light', CONFIG.THEME.backgroundLight);
    root.style.setProperty('--card-bg', CONFIG.THEME.cardBackground);
    root.style.setProperty('--text-main', CONFIG.THEME.textMain);
    root.style.setProperty('--text-muted', CONFIG.THEME.textMuted);
    root.style.setProperty('--border-color', CONFIG.THEME.borderColor);

    // ব্র্যান্ডিং কন্টেন্ট সেটআপ
    document.title = `${CONFIG.BRAND.name} | Premium Shop`;
    document.getElementById("checkoutSubtitle").innerText = CONFIG.BRAND.tagline;
    document.getElementById("currencySymbol").innerText = CONFIG.BRAND.currencySymbol;

    const brandContainer = document.getElementById("headerLogo");
    if (brandContainer) {
        brandContainer.innerHTML = `
            <i class="${CONFIG.BRAND.logoIcon} brand-icon"></i>
            <h2>${CONFIG.BRAND.name}</h2>
        `;
    }

    // ডেলিভারি লেবেল এবং কস্ট টেক্সট সেটআপ
    document.getElementById("insideLabel").innerText = CONFIG.DELIVERY.insideDhaka.label;
    document.getElementById("insideCostText").innerText = `${CONFIG.BRAND.currencySymbol} ${CONFIG.DELIVERY.insideDhaka.charge}`;
    document.getElementById("outsideLabel").innerText = CONFIG.DELIVERY.outsideDhaka.label;
    document.getElementById("outsideCostText").innerText = `${CONFIG.BRAND.currencySymbol} ${CONFIG.DELIVERY.outsideDhaka.charge}`;

    // শপ কন্টাক্ট ডাটা লোড
    loadShopProducts();
    setupCheckoutEventListeners();
});

// ২. কাস্টম প্রোডাক্ট লোড করা
function loadShopProducts() {
    const productGrid = document.getElementById("productGrid");
    productGrid.innerHTML = "";

    CONFIG.PRODUCTS.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
            <div class="prod-img-wrap">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="price-row">
                    <span class="card-price">${CONFIG.BRAND.currencySymbol} ${product.price}</span>
                </div>
                <button class="buy-btn" onclick="openCheckout(${product.id})">
                    <i class="fa-solid fa-bolt"></i> Order Now
                </button>
            </div>
        `;
        productGrid.appendChild(card);
    });
}

// ৩. চেকআউট মডাল ওপেন লজিক
function openCheckout(productId) {
    selectedProduct = CONFIG.PRODUCTS.find(p => p.id === productId);
    currentQuantity = 1;
    
    document.getElementById("modalProductName").innerText = selectedProduct.name;
    document.getElementById("modalProductPrice").innerText = selectedProduct.price;
    document.getElementById("modalProductImg").src = selectedProduct.image;
    document.getElementById("quantityInput").value = currentQuantity;
    
    const badgeEl = document.getElementById("modalProductBadge");
    badgeEl.innerHTML = `<span class="dot"></span> ${selectedProduct.badge || 'In Stock'}`;

    updateCalculations();
    document.getElementById("checkoutModal").style.display = "flex";
}

// ৪. রিয়েল-টাইম এমাউন্ট ক্যালকুলেশন
function updateCalculations() {
    if (!selectedProduct) return;

    const productTotal = selectedProduct.price * currentQuantity;
    const finalTotal = productTotal + deliveryCharge;

    document.getElementById("summaryProductPrice").innerText = productTotal.toLocaleString();
    document.getElementById("summaryDeliveryCharge").innerText = deliveryCharge;
    document.getElementById("summaryTotalAmount").innerText = finalTotal.toLocaleString();
}

// ৫. ফর্ম কন্ট্রোল এবং ইভেন্ট হ্যান্ডলার্স
function setupCheckoutEventListeners() {
    const modal = document.getElementById("checkoutModal");
    const closeBtn = document.getElementById("closeModalBtn");
    const plusBtn = document.getElementById("plusBtn");
    const minusBtn = document.getElementById("minusBtn");
    
    // মডাল এক্সিট
    closeBtn.addEventListener("click", () => modal.style.display = "none");
    window.addEventListener("click", (e) => { if (e.target === modal) modal.style.display = "none"; });

    // কোয়ান্টিটি বৃদ্ধি
    plusBtn.addEventListener("click", () => {
        currentQuantity++;
        document.getElementById("quantityInput").value = currentQuantity;
        updateCalculations();
    });

    // কোয়ান্টিটি কমানো
    minusBtn.addEventListener("click", () => {
        if (currentQuantity > 1) {
            currentQuantity--;
            document.getElementById("quantityInput").value = currentQuantity;
            updateCalculations();
        }
    });

    // ডেলিভারি লোকেশন সুইচ লজিক
    const deliveryCards = document.querySelectorAll(".delivery-card");
    deliveryCards.forEach(card => {
        card.addEventListener("click", function() {
            deliveryCards.forEach(c => c.classList.remove("checked"));
            this.classList.add("checked");
            
            const radioVal = this.querySelector("input").value;
            deliveryCharge = radioVal === "inside" ? CONFIG.DELIVERY.insideDhaka.charge : CONFIG.DELIVERY.outsideDhaka.charge;
            updateCalculations();
        });
    });

    // পেমেন্ট মেথড সুইচ ও ডিসপ্লে নোটিস
    const paymentCards = document.querySelectorAll(".payment-card");
    const instructionPanel = document.getElementById("paymentInstructionPanel");
    const instructionText = document.getElementById("instructionText");

    paymentCards.forEach(card => {
        card.addEventListener("click", function() {
            paymentCards.forEach(c => c.classList.remove("checked"));
            this.classList.add("checked");
            
            const method = this.getAttribute("data-method");
            if (method === "bKash") {
                instructionPanel.style.display = "block";
                instructionText.innerHTML = `💸 অনুগ্রহ করে আমাদের পার্সোনাল বিকাশ নাম্বার <strong>${CONFIG.PAYMENT.bKashNumber}</strong> এ ক্যাশ-আউট / সেন্ট-মানি করুন।`;
            } else if (method === "Nagad") {
                instructionPanel.style.display = "block";
                instructionText.innerHTML = `💸 অনুগ্রহ করে আমাদের পার্সোনাল নগদ নাম্বার <strong>${CONFIG.PAYMENT.NagadNumber}</strong> এ ক্যাশ-আউট / সেন্ট-মানি করুন।`;
            } else {
                instructionPanel.style.display = "none";
            }
        });
    });

    // ৬. গুগল শিটে ডাটা সাবমিট
    const form = document.getElementById("orderForm");
    form.addEventListener("submit", function(e) {
        e.preventDefault();

        const submitBtn = document.getElementById("submitBtn");
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Processing Order...`;

        const orderData = {
            productName: selectedProduct.name,
            quantity: currentQuantity,
            price: selectedProduct.price,
            totalPrice: (selectedProduct.price * currentQuantity) + deliveryCharge,
            name: document.getElementById("fullName").value,
            phone: document.getElementById("phoneNumber").value,
            address: document.getElementById("fullAddress").value,
            district: document.getElementById("districtSelect").value,
            postCode: document.getElementById("postCode").value || "N/A",
            email: document.getElementById("customerEmail").value,
            note: document.getElementById("orderNote").value || "N/A",
            delivery: document.querySelector('input[name="deliveryLocation"]:checked').value === "inside" ? CONFIG.DELIVERY.insideDhaka.label : CONFIG.DELIVERY.outsideDhaka.label,
            payment: document.querySelector('input[name="paymentMethod"]:checked').value,
            adminEmail: CONFIG.BRAND.adminEmail,
            websiteName: CONFIG.BRAND.name
        };

        fetch(CONFIG.API_URL, {
            method: "POST",
            mode: "no-cors", 
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderData)
        })
        .then(() => {
            alert(`🎉 অভিনন্দন! আপনার অর্ডারটি সফলভাবে সম্পন্ন হয়েছে।\nঅর্ডার ইনভয়েসটি আপনার ইমেইল (${orderData.email}) এবং অ্যাডমিনের ইমেইলে পাঠিয়ে দেওয়া হয়েছে।`);
            form.reset();
            modal.style.display = "none";
        })
        .catch(error => {
            console.error("Error:", error);
            alert("দুঃখিত! এই মুহূর্তে সার্ভার কানেক্ট করা যাচ্ছে না। দয়া করে আবার চেষ্টা করুন।");
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = `<i class="fa-solid fa-lock"></i> Confirm Order <i class="fa-solid fa-arrow-right arrow-icon"></i>`;
        });
    });
}

                                 

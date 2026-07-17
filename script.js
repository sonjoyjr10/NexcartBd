/* =========================================================================
   Interactive Shop & Cart Processing Functions
   ========================================================================= */

let cart = [];
let textToCopyGlobal = "";

// Initialize store text variables and components dynamically on window load
function initStoreSetup() {
    document.getElementById('headerPhone').innerText = SiteConfig.phone;
    document.getElementById('headerEmail').innerText = SiteConfig.email;
    document.getElementById('logoPart1').innerText = SiteConfig.logoTextFirst;
    document.getElementById('logoPart2').innerText = SiteConfig.logoTextSecond;
    document.getElementById('heroStoreName').innerText = SiteConfig.storeName;
    
    document.getElementById('footerLogoPart1').innerText = SiteConfig.logoTextFirst;
    document.getElementById('footerLogoPart2').innerText = SiteConfig.logoTextSecond;
    document.getElementById('footerAbout').innerText = `Premium brand-warranty-soho original gadgets sohoje order korun sorasori secure Google Form er madhome.`;
    document.getElementById('footerAddress').innerText = SiteConfig.address;
    document.getElementById('footerPhone').innerText = SiteConfig.phone;
    document.getElementById('copyrightName').innerText = SiteConfig.storeName;

    if(SiteConfig.products.length > 0) {
        document.getElementById('spotlightTitle').innerText = SiteConfig.products[0].title;
        document.getElementById('spotlightImg').src = SiteConfig.products[0].image;
    }

    renderProducts();
}

// Render product list cards dynamically
function renderProducts(filtered = SiteConfig.products) {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = '';
    
    filtered.forEach(product => {
        grid.innerHTML += `
            <div class="bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between border border-slate-100 group relative">
                <span class="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full z-10 shadow-sm">${product.badge}</span>
                
                <div class="relative overflow-hidden bg-slate-100 h-52">
                    <img src="${product.image}" alt="${product.title}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
                </div>

                <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                        <span class="text-slate-400 text-[11px] font-bold uppercase tracking-wider">${product.category}</span>
                        <h3 class="text-slate-800 font-extrabold text-sm mt-1 line-clamp-2 hover:text-blue-600 transition-colors cursor-pointer">${product.title}</h3>
                        <div class="flex items-center gap-1.5 mt-1 text-slate-400 text-xs">
                            <i class="fa-solid fa-shield text-emerald-500 text-[10px]"></i>
                            <span>${product.warranty}</span>
                        </div>
                    </div>

                    <div>
                        <div class="flex items-baseline gap-2 mb-4">
                            <span class="text-xl font-black text-blue-600">${SiteConfig.currency}${product.price}</span>
                            <span class="text-xs line-through text-slate-400">${SiteConfig.currency}${product.oldPrice}</span>
                        </div>

                        <div class="grid grid-cols-2 gap-2">
                            <button onclick="addToCart(${product.id})" class="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2 px-1.5 rounded-xl text-xs transition">
                                <i class="fa-solid fa-cart-plus mr-1"></i> Add Cart
                            </button>
                            <button onclick="buyNow(${product.id})" class="bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-2 px-1.5 rounded-xl text-xs transition shadow-sm">
                                Buy Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
}

// Push selected product into local array
function addToCart(productId) {
    const product = SiteConfig.products.find(p => p.id === productId);
    if (!product) return;

    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartUI();
    showNotification(`${product.title} successfully cart-e add hoyeche!`);
}

// Fast check out shortcut trigger
function buyNow(productId) {
    addToCart(productId);
    toggleCart(true);
}

// Adjust quantities inside cart view
function changeQty(productId, amt) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;

    item.quantity += amt;
    if (item.quantity <= 0) {
        cart = cart.filter(p => p.id !== productId);
    }
    updateCartUI();
}

// Remove item row
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
}

// Render dynamic DOM updates inside sliding panel
function updateCartUI() {
    const countEl = document.getElementById('cartCount');
    const container = document.getElementById('cartItemsContainer');
    const priceEl = document.getElementById('cartTotalPrice');

    const totalCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);
    countEl.innerText = totalCount;

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="text-center py-12 text-slate-400 space-y-2">
                <i class="fa-solid fa-basket-shopping text-4xl block"></i>
                <p>Apnar Cart khali ache!</p>
            </div>
        `;
        priceEl.innerText = `${SiteConfig.currency}0`;
        return;
    }

    container.innerHTML = '';
    let subtotal = 0;

    cart.forEach(item => {
        const total = item.price * item.quantity;
        subtotal += total;

        container.innerHTML += `
            <div class="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <img src="${item.image}" alt="${item.title}" class="w-12 h-12 object-cover rounded-lg bg-white border">
                <div class="flex-1 min-w-0">
                    <h4 class="font-bold text-slate-800 text-xs truncate">${item.title}</h4>
                    <span class="text-xs text-blue-600 font-bold">${SiteConfig.currency}${item.price}</span>
                    <div class="flex items-center gap-2 mt-1">
                        <button onclick="changeQty(${item.id}, -1)" class="w-5 h-5 bg-white border rounded text-xs">-</button>
                        <span class="text-xs font-bold">${item.quantity}</span>
                        <button onclick="changeQty(${item.id}, 1)" class="w-5 h-5 bg-white border rounded text-xs">+</button>
                    </div>
                </div>
                <button onclick="removeFromCart(${item.id})" class="text-slate-400 hover:text-red-500">
                    <i class="fa-solid fa-trash-can text-sm"></i>
                </button>
            </div>
        `;
    });

    priceEl.innerText = `${SiteConfig.currency}${subtotal}`;
}

// Toggle drawer element
function toggleCart(force = null) {
    const drawer = document.getElementById('cartDrawer');
    if (force === true) drawer.classList.remove('hidden');
    else if (force === false) drawer.classList.add('hidden');
    else drawer.classList.toggle('hidden');
}

// Show Alert notification toast
function showNotification(msg) {
    const toast = document.getElementById('toastNotification');
    const toastMsg = document.getElementById('toastMessage');
    toastMsg.innerText = msg;
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 3000);
}

// Live search keyup event
document.getElementById('searchInput').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = SiteConfig.products.filter(p => 
        p.title.toLowerCase().includes(term) || 
        p.category.toLowerCase().includes(term)
    );
    renderProducts(filtered);
});

// =========================================================================
// GOOGLE FORM REDIRECTION & INTEGRATION LOGIC
// =========================================================================
function checkoutToGoogleForm() {
    if (cart.length === 0) {
        showNotification("Prothome cart-e product jog korun!");
        return;
    }

    let details = cart.map(item => `- ${item.title} (Qty: ${item.quantity}) - Price: ${SiteConfig.currency}${item.price}`).join('\n');
    let grandTotal = cart.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);

    textToCopyGlobal = `=== ORDER INVOICE ===\nStore: ${SiteConfig.storeName}\n\nSelected Products:\n${details}\n=====================\nTotal Bill Amount: ${SiteConfig.currency}${grandTotal}`;

    // Auto copy function for iframe environment
    try {
        const temp = document.createElement("textarea");
        temp.value = textToCopyGlobal;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        document.body.removeChild(temp);
        showNotification("Cart details auto-copy hoyeche!");
    } catch(e) {
        console.log("Clipboard fallback active.");
    }

    const modal = document.getElementById('redirectModal');
    const preview = document.getElementById('copiedTextPreview');
    preview.innerText = textToCopyGlobal;
    modal.classList.remove('hidden');
}

function confirmAndRedirect() {
    document.getElementById('redirectModal').classList.add('hidden');
    window.open(SiteConfig.googleFormUrl, '_blank');
}

function redirectToGoogleForm() {
    window.open(SiteConfig.googleFormUrl, '_blank');
}

// Onload initializer
window.onload = function() {
    initStoreSetup();
};


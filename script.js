// Switch Screen to Login Overlay without disrupting landing page visibility
window.goToAdminPortal = () => {
    document.getElementById('auth-container').classList.remove('hidden');
};

// Dismiss login view and return to full store layout
window.goToShop = () => {
    document.getElementById('auth-container').classList.add('hidden');
    document.getElementById('main-layout').classList.add('hidden');
    const landing = document.getElementById('landing-page');
    if(landing) landing.classList.remove('hidden');
};

// Navigation layout swapping
window.switchTab = (tabName) => {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));

    document.getElementById(`tab-${tabName}`).classList.remove('hidden');
    event.currentTarget.classList.add('active');
    document.querySelector('.mobile-sidebar').classList.remove('open');
};

// Responsive mobile nav triggers
window.toggleSidebar = () => {
    document.querySelector('.mobile-sidebar').classList.toggle('open');
};

// Universal Admin CRUD UI Modals
window.openProductModal = () => {
    document.getElementById('product-form').reset();
    document.getElementById('prod-id').value = '';
    document.getElementById('modal-title').innerText = "Add New Product";
    document.getElementById('product-modal').classList.remove('hidden');
};

window.closeProductModal = () => {
    document.getElementById('product-modal').classList.add('hidden');
};

window.editProduct = (id, title, price, stock, image) => {
    document.getElementById('prod-id').value = id;
    document.getElementById('prod-title').value = title;
    document.getElementById('prod-price').value = price;
    document.getElementById('prod-stock').value = stock;
    document.getElementById('prod-img-url').value = image;
    
    document.getElementById('modal-title').innerText = "Modify Product Data";
    document.getElementById('product-modal').classList.remove('hidden');
};

// Optional Customer E-Commerce Interactions
window.openCart = () => { alert("Premium Interactive Shopify Cart Preview Loaded!"); };
window.addToCart = (id, title, price) => {
    const count = document.getElementById('cart-count');
    count.innerText = parseInt(count.innerText) + 1;
};

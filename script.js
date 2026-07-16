// Display secure authentication portal overlay
window.goToAdminPortal = () => {
    document.getElementById('auth-container').classList.remove('hidden');
};

// Dismiss authentication portal overlay and return home
window.goToShop = () => {
    document.getElementById('auth-container').classList.add('hidden');
    document.getElementById('main-layout').classList.add('hidden');
    const home = document.getElementById('landing-page');
    if(home) home.classList.remove('hidden');
};

// Layout Panel Switch Handler Routing Engine
window.switchTab = (targetScreen) => {
    document.querySelectorAll('.tab-content').forEach(screen => screen.classList.add('hidden'));
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));

    document.getElementById(`tab-${targetScreen}`).classList.remove('hidden');
    event.currentTarget.classList.add('active');
    document.querySelector('.mobile-sidebar').classList.remove('open');
};

// Responsive mobile viewport side menu logic
window.toggleSidebar = () => {
    document.querySelector('.mobile-sidebar').classList.toggle('open');
};

// Product Workspace Modal UI Controls
window.openProductModal = () => {
    document.getElementById('product-form').reset();
    document.getElementById('prod-id').value = '';
    document.getElementById('modal-title').innerText = "Create Catalog Entry";
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
    
    document.getElementById('modal-title').innerText = "Modify Inventory Specifications";
    document.getElementById('product-modal').classList.remove('hidden');
};

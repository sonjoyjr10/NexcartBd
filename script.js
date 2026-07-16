// SPA Tab Switching Logic
window.switchTab = (tabName) => {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));

    document.getElementById(`tab-${tabName}`).classList.remove('hidden');
    event.currentTarget.classList.add('active');
    
    // Automatically close sidebar on mobile after choosing a menu item
    document.querySelector('.mobile-sidebar').classList.remove('open');
};

// Responsive Mobile Sidebar Toggle
window.toggleSidebar = () => {
    document.querySelector('.mobile-sidebar').classList.toggle('open');
};

// Universal Product Modal Handling
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


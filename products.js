import { db } from './firebase-config.js';
import { collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const productForm = document.getElementById('product-form');
const productList = document.getElementById('product-list');

// Listen for updates when authenticated
window.addEventListener('authReady', () => {
    onSnapshot(collection(db, "products"), (snapshot) => {
        productList.innerHTML = '';
        snapshot.forEach((docSnap) => {
            const prod = docSnap.data();
            const id = docSnap.id;
            
            productList.innerHTML += `
                <div class="glass-card rounded-2xl border border-white/10 p-4 relative group overflow-hidden">
                    <img src="${prod.image}" class="w-full h-48 object-cover rounded-xl mb-4 group-hover:scale-105 transition-all">
                    <span class="absolute top-6 right-6 text-xs px-2 py-1 rounded-md ${prod.stock === 'In Stock' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}">${prod.stock}</span>
                    <h4 class="font-bold text-lg truncate">${prod.title}</h4>
                    <p class="text-purple-400 font-semibold mt-1">$${parseFloat(prod.price).toFixed(2)}</p>
                    <div class="flex gap-2 mt-4">
                        <button onclick="editProduct('${id}', '${prod.title}', ${prod.price}, '${prod.stock}', '${prod.image}')" class="flex-1 bg-white/5 hover:bg-purple-600 py-2 rounded-xl text-sm transition-all"><i class="fa-solid fa-pen"></i> Edit</button>
                        <button onclick="deleteProduct('${id}')" class="bg-rose-500/10 hover:bg-rose-600 p-2 rounded-xl text-rose-400 hover:text-white transition-all"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </div>
            `;
        });
    });
});

// Create or Update Action
productForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('prod-id').value;
    const data = {
        title: document.getElementById('prod-title').value,
        price: parseFloat(document.getElementById('prod-price').value),
        stock: document.getElementById('prod-stock').value,
        image: document.getElementById('prod-img-url').value
    };

    if(id) {
        await updateDoc(doc(db, "products", id), data);
    } else {
        await addDoc(collection(db, "products"), data);
    }
    closeProductModal();
});

// Delete Trigger
window.deleteProduct = async (id) => {
    if(confirm("Are you sure you want to delete this product?")) {
        await deleteDoc(doc(db, "products", id));
    }
};


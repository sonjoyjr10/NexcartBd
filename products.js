import { db } from './firebase-config.js';
import { collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const productForm = document.getElementById('product-form');
const productList = document.getElementById('product-list');
const landingGrid = document.getElementById('landing-product-grid');

// Public Guest Product Realtime Synchronizer (Runs Always)
onSnapshot(collection(db, "products"), (snapshot) => {
    if(!landingGrid) return;
    landingGrid.innerHTML = '';
    snapshot.forEach((docSnap) => {
        const prod = docSnap.data();
        landingGrid.innerHTML += `
            <div class="glass-card rounded-2xl border border-white/5 p-4 flex flex-col justify-between hover:border-purple-500/40 group transition-all duration-300">
                <div class="relative overflow-hidden rounded-xl mb-3">
                    <img src="${prod.image}" class="w-full h-40 object-cover group-hover:scale-105 transition-all duration-500">
                </div>
                <div>
                    <h3 class="font-semibold text-sm truncate text-slate-200">${prod.title}</h3>
                    <div class="flex items-center justify-between mt-2">
                        <span class="text-pink-400 font-bold text-sm">$${parseFloat(prod.price).toFixed(2)}</span>
                        <button onclick="addToCart('${docSnap.id}', '${prod.title}', ${prod.price})" class="bg-purple-600/20 text-purple-400 group-hover:bg-purple-600 group-hover:text-white text-xs px-2.5 py-1.5 rounded-lg transition-all font-medium cursor-pointer">
                            + Add
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
});

// Admin Control Panel Sync Engine (Runs after validation)
window.addEventListener('authReady', () => {
    onSnapshot(collection(db, "products"), (snapshot) => {
        if(!productList) return;
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
                        <button onclick="editProduct('${id}', '${prod.title}', ${prod.price}, '${prod.stock}', '${prod.image}')" class="flex-1 bg-white/5 hover:bg-purple-600 py-2 rounded-xl text-sm transition-all cursor-pointer"><i class="fa-solid fa-pen"></i> Edit</button>
                        <button onclick="deleteProduct('${id}')" class="bg-rose-500/10 hover:bg-rose-600 p-2 rounded-xl text-rose-400 hover:text-white transition-all cursor-pointer"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </div>
            `;
        });
    });
});

if(productForm) {
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
}

window.deleteProduct = async (id) => {
    if(confirm("Permanently erase product record?")) {
        await deleteDoc(doc(db, "products", id));
    }
};

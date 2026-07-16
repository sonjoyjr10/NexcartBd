import { db } from './firebase-config.js';
import { collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const productForm = document.getElementById('product-form');
const productList = document.getElementById('product-list');
const landingGrid = document.getElementById('landing-product-grid');

// Public Real-Time View Sync Interface Engine
onSnapshot(collection(db, "products"), (snapshot) => {
    if(!landingGrid) return;
    landingGrid.innerHTML = '';
    snapshot.forEach((docSnap) => {
        const prod = docSnap.data();
        landingGrid.innerHTML += `
            <div class="glass-card rounded-2xl border border-white/5 p-4 flex flex-col justify-between hover:border-pink-500/30 group transition-all duration-300">
                <div class="relative overflow-hidden rounded-xl mb-3">
                    <img src="${prod.image}" class="w-full h-40 object-cover group-hover:scale-105 transition-all duration-500">
                </div>
                <div class="space-y-2">
                    <h3 class="font-bold text-sm truncate text-slate-200">${prod.title}</h3>
                    <div class="flex items-center justify-between">
                        <span class="text-pink-400 font-bold text-sm">$${parseFloat(prod.price).toFixed(2)}</span>
                        <button onclick="addToCart('${docSnap.id}', '${prod.title.replace(/'/g, "\\'")}', ${prod.price})" class="bg-purple-600/20 text-purple-300 group-hover:bg-pink-600 group-hover:text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg transition-all cursor-pointer">
                            + Add Bag
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
});

// Authenticated Admin Catalog Synchronizer Setup
window.addEventListener('authReady', () => {
    onSnapshot(collection(db, "products"), (snapshot) => {
        if(!productList) return;
        productList.innerHTML = '';
        snapshot.forEach((docSnap) => {
            const prod = docSnap.data();
            const id = docSnap.id;
            
            productList.innerHTML += `
                <div class="glass-card rounded-2xl border border-white/10 p-4 relative group overflow-hidden flex flex-col justify-between">
                    <div>
                        <div class="relative overflow-hidden rounded-xl mb-3">
                            <img src="${prod.image}" class="w-full h-36 object-cover">
                            <span class="absolute top-2 right-2 text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md ${prod.stock === 'In Stock' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}">${prod.stock}</span>
                        </div>
                        <h4 class="font-bold text-sm truncate text-slate-200">${prod.title}</h4>
                        <p class="text-purple-400 text-xs font-bold mt-0.5">$${parseFloat(prod.price).toFixed(2)}</p>
                    </div>
                    <div class="flex gap-2 mt-4 border-t border-white/5 pt-3">
                        <button onclick="editProduct('${id}', '${prod.title.replace(/'/g, "\\'")}', ${prod.price}, '${prod.stock}', '${prod.image}')" class="flex-1 bg-white/5 hover:bg-purple-600 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"><i class="fa-solid fa-pen-to-square"></i> Modify</button>
                        <button onclick="deleteProduct('${id}')" class="bg-rose-500/10 hover:bg-rose-600 p-2 rounded-xl text-rose-400 hover:text-white text-xs transition-all cursor-pointer"><i class="fa-solid fa-trash-can"></i></button>
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
    if(confirm("Confirm catalog item elimination?")) {
        await deleteDoc(doc(db, "products", id));
    }
};

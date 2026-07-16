import { db } from './firebase-config.js';
import { 
    collection, 
    addDoc, 
    getDocs, 
    doc, 
    deleteDoc, 
    updateDoc, 
    onSnapshot 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// DOM Targets Extraction
const landingGrid = document.getElementById('landing-product-grid');
const adminTable = document.getElementById('admin-product-table');
const addProductForm = document.getElementById('add-product-form');

/* ==========================================================================
   📦 1. REAL-TIME RENDER: USER LANDING GRID (Jaguar Style Layout)
   ========================================================================== */
if (landingGrid) {
    onSnapshot(collection(db, "products"), (snapshot) => {
        landingGrid.innerHTML = '';
        
        if (snapshot.empty) {
            landingGrid.innerHTML = `
                <div class="col-span-full text-center py-12 text-slate-500 text-xs tracking-widest uppercase">
                    No active premium assets found in catalog.
                </div>
            `;
            return;
        }

        snapshot.forEach((docSnap) => {
            const prod = docSnap.data();
            const prodId = docSnap.id;
            
            landingGrid.innerHTML += `
                <div class="luxury-card p-4 flex flex-col justify-between group animate-fade-in">
                    <div>
                        <div class="relative overflow-hidden rounded-xl mb-4 bg-[#161616]">
                            <img src="${prod.image || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600'}" 
                                 class="w-full h-48 object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" 
                                 alt="${prod.title}">
                            <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                        </div>
                        <div class="space-y-2">
                            <p class="text-[9px] tracking-[0.2em] font-bold text-slate-500 uppercase">PREMIUM ASSET</p>
                            <h3 class="font-normal text-sm text-slate-200 tracking-wide truncate">${prod.title}</h3>
                        </div>
                    </div>
                    <div class="flex items-center justify-between pt-4 mt-2 border-t border-white/5">
                        <span class="text-white font-mono text-sm font-medium">$${parseFloat(prod.price).toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                        <button onclick="addToCart('${prodId}', '${prod.title.replace(/'/g, "\\'")}', ${prod.price})" 
                                class="border border-white/10 hover:border-black hover:bg-[#ccff00] text-slate-300 hover:text-black text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full transition-all cursor-pointer">
                            + Add Bag
                        </button>
                    </div>
                </div>
            `;
        });
    });
}

/* ==========================================================================
   ⚙️ 2. REAL-TIME RENDER: ADMIN BACKEND INVENTORY TABLE
   ========================================================================== */
if (adminTable) {
    onSnapshot(collection(db, "products"), (snapshot) => {
        adminTable.innerHTML = '';
        
        snapshot.forEach((docSnap) => {
            const prod = docSnap.data();
            const prodId = docSnap.id;
            
            adminTable.innerHTML += `
                <tr class="border-b border-white/5 hover:bg-white/[0.01] transition-colors">
                    <td class="p-4">
                        <div class="flex items-center gap-3">
                            <img src="${prod.image}" class="w-10 h-10 object-cover rounded-lg border border-white/10 bg-[#161616]">
                            <span class="font-medium text-slate-200 text-xs truncate max-w-[180px]">${prod.title}</span>
                        </div>
                    </td>
                    <td class="p-4 font-mono text-slate-300 text-xs">$${parseFloat(prod.price).toFixed(2)}</td>
                    <td class="p-4">
                        <div class="flex items-center gap-2">
                            <button onclick="editProductPrompt('${prodId}', '${prod.title.replace(/'/g, "\\'")}', ${prod.price})" 
                                    class="text-xs font-bold text-slate-400 hover:text-[#ccff00] uppercase tracking-wider px-2 py-1 transition-colors cursor-pointer">
                                Edit
                            </button>
                            <button onclick="deleteProductAsset('${prodId}')" 
                                    class="text-xs font-bold text-slate-500 hover:text-red-400 uppercase tracking-wider px-2 py-1 transition-colors cursor-pointer">
                                Remove
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });
    });
}

/* ==========================================================================
   🛠️ 3. CORE INVENTORY MUTATIONS (ADD, EDIT, DELETE)
   ========================================================================== */

// Create New Product Entry
if (addProductForm) {
    addProductForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('prod-title').value.trim();
        const price = parseFloat(document.getElementById('prod-price').value);
        const image = document.getElementById('prod-image').value.trim();

        try {
            await addDoc(collection(db, "products"), { title, price, image });
            addProductForm.reset();
            alert("Asset listed successfully into live inventory catalog.");
        } catch (error) {
            console.error("Mutation failed:", error);
            alert("Error listing asset: " + error.message);
        }
    });
}

// Modify Existing Product Document
window.editProductPrompt = async function(id, currentTitle, currentPrice) {
    const newTitle = prompt("Update Asset Title:", currentTitle);
    const newPrice = prompt("Update Asset Price ($):", currentPrice);
    
    if (newTitle !== null && newPrice !== null) {
        const parsedPrice = parseFloat(newPrice);
        if (isNaN(parsedPrice)) {
            alert("Invalid monetary value submitted.");
            return;
        }
        try {
            const docRef = doc(db, "products", id);
            await updateDoc(docRef, {
                title: newTitle.trim(),
                price: parsedPrice
            });
        } catch (error) {
            console.error("Update execution caught error:", error);
        }
    }
};

// Terminate Product Asset Listing
window.deleteProductAsset = async function(id) {
    if (confirm("Are you absolutely sure you want to remove this asset from the database?")) {
        try {
            await deleteDoc(doc(db, "products", id));
        } catch (error) {
            console.error("Deletion lifecycle caught error:", error);
        }
    }
};

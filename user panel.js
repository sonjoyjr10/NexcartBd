import { db } from './firebase-config.js';
import { collection, addDoc, onSnapshot, query, where } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let cart = [];
let userSession = {
    uid: "session_user_" + Math.random().toString(36).substring(2, 9),
    name: "Guest Client",
    email: "notset@nexshop.com",
    phone: "",
    address: ""
};

window.openCart = () => document.getElementById('cart-drawer').classList.remove('hidden');
window.closeCart = () => document.getElementById('cart-drawer').classList.add('hidden');

window.addToCart = (id, title, price) => {
    const matched = cart.find(i => i.id === id);
    if(matched) { matched.qty += 1; } 
    else { cart.push({ id, title, price, qty: 1 }); }
    syncCartUI();
    openCart();
};

window.changeQuantity = (id, change) => {
    const match = cart.find(i => i.id === id);
    if(!match) return;
    match.qty += change;
    if(match.qty <= 0) { cart = cart.filter(i => i.id !== id); }
    syncCartUI();
};

function syncCartUI() {
    const view = document.getElementById('cart-items-wrapper');
    const badge = document.getElementById('cart-count');
    const aggregate = document.getElementById('cart-total-price');
    
    if(!view) return;
    view.innerHTML = '';
    
    let totalItems = 0;
    let netSum = 0;

    cart.forEach(item => {
        totalItems += item.qty;
        netSum += (item.price * item.qty);

        view.innerHTML += `
            <div class="glass-card p-3 rounded-xl border border-white/5 flex justify-between items-center text-xs">
                <div class="truncate max-w-[180px]">
                    <h5 class="font-bold text-slate-200 truncate">${item.title}</h5>
                    <span class="text-pink-400 font-bold">$${parseFloat(item.price).toFixed(2)}</span>
                </div>
                <div class="flex items-center gap-2 bg-slate-900 border border-white/10 px-2 py-1 rounded-lg">
                    <button onclick="changeQuantity('${item.id}', -1)" class="hover:text-pink-400 font-bold px-1 cursor-pointer">-</button>
                    <span class="font-mono font-bold w-4 text-center">${item.qty}</span>
                    <button onclick="changeQuantity('${item.id}', 1)" class="hover:text-pink-400 font-bold px-1 cursor-pointer">+</button>
                </div>
            </div>
        `;
    });

    if(badge) badge.innerText = totalItems;
    if(aggregate) aggregate.innerText = `$${netSum.toFixed(2)}`;
}

window.checkoutOrder = async () => {
    if(cart.length === 0) return alert("Your cart is empty.");
    if(!userSession.phone || !userSession.address) {
        alert("Please set up your destination details inside 'My Account' before processing checkout.");
        openUserPanel();
        switchUserTab('profile');
        return;
    }

    let netCost = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    let summary = cart.map(i => `${i.title} (x${i.qty})`).join(', ');

    const orderPayload = {
        customerId: userSession.uid,
        customerName: userSession.name,
        customerPhone: userSession.phone,
        customerAddress: userSession.address,
        itemsSummary: summary,
        totalPrice: netCost,
        status: "Pending",
        timestamp: new Date().toISOString()
    };

    try {
        await addDoc(collection(db, "orders"), orderPayload);
        alert("🎉 Order executed successfully! Track validation inside your Client Account Panel.");
        cart = [];
        syncCartUI();
        closeCart();
        openUserPanel();
    } catch(err) {
        alert("Checkout Fault: " + err.message);
    }
};

window.openUserPanel = () => {
    document.getElementById('user-panel-modal').classList.remove('hidden');
    syncClientOrderLogs();
};
window.closeUserPanel = () => document.getElementById('user-panel-modal').classList.add('hidden');

window.switchUserTab = (tab) => {
    document.querySelectorAll('.user-tab-content').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.user-nav-btn').forEach(el => el.classList.remove('active'));

    document.getElementById(`user-tab-${tab}`).classList.remove('hidden');
    event.currentTarget.classList.add('active');
};

const clientForm = document.getElementById('customer-profile-form');
if(clientForm) {
    clientForm.addEventListener('submit', (e) => {
        e.preventDefault();
        userSession.name = document.getElementById('cust-profile-name').value;
        userSession.phone = document.getElementById('cust-profile-phone').value;
        userSession.address = document.getElementById('cust-profile-address').value;
        
        document.getElementById('user-panel-name').innerText = userSession.name;
        document.getElementById('user-panel-email').innerText = userSession.phone;
        document.getElementById('user-avatar-initial').innerText = userSession.name.charAt(0).toUpperCase();

        alert("Shipping profile logs updated.");
        switchUserTab('orders');
    });
}

function syncClientOrderLogs() {
    const logBox = document.getElementById('customer-order-history');
    if(!logBox) return;

    const trackerQuery = query(collection(db, "orders"), where("customerId", "==", userSession.uid));
    onSnapshot(trackerQuery, (snapshot) => {
        logBox.innerHTML = '';
        if(snapshot.empty) {
            logBox.innerHTML = `<tr><td colspan="4" class="p-4 text-center text-slate-500 font-medium">No order data traced yet.</td></tr>`;
            return;
        }
        snapshot.forEach(docSnap => {
            const data = docSnap.data();
            logBox.innerHTML += `
                <tr class="hover:bg-white/5 border-b border-white/5">
                    <td class="p-4 font-mono text-pink-400 font-bold">#${docSnap.id.substring(0, 6).toUpperCase()}</td>
                    <td class="p-4 truncate max-w-[200px] text-slate-300">${data.itemsSummary}</td>
                    <td class="p-4 font-bold text-slate-200">$${parseFloat(data.totalPrice).toFixed(2)}</td>
                    <td class="p-4">
                        <span class="px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase rounded-full ${data.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}">${data.status}</span>
                    </td>
                </tr>
            `;
        });
    });
      }

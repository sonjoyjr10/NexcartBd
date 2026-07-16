import { db } from './firebase-config.js';
import { collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

window.addEventListener('authReady', () => {
    let prodCount = 0;
    
    // Watch Products Count
    onSnapshot(collection(db, "products"), (snap) => {
        prodCount = snap.size;
        document.getElementById('dash-products').innerText = prodCount;
    });

    // Watch Orders & Calculate Stats
    onSnapshot(collection(db, "orders"), (snap) => {
        let totalRevenue = 0;
        let totalOrders = snap.size;

        snap.forEach(doc => {
            totalRevenue += parseFloat(doc.data().totalPrice || 0);
        });

        let avgBasket = totalOrders > 0 ? (totalRevenue / totalOrders) : 0;

        document.getElementById('dash-orders').innerText = totalOrders;
        document.getElementById('dash-revenue').innerText = `$${totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        document.getElementById('dash-avg').innerText = `$${avgBasket.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    });
});


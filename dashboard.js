import { db } from './firebase-config.js';
import { collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

window.addEventListener('authReady', () => {
    onSnapshot(collection(db, "products"), (snap) => {
        const docCount = document.getElementById('dash-products');
        if(docCount) docCount.innerText = `${snap.size} Items`;
    });

    onSnapshot(collection(db, "orders"), (snap) => {
        let revenue = 0;
        let count = snap.size;

        snap.forEach(doc => {
            revenue += parseFloat(doc.data().totalPrice || 0);
        });

        let medianValue = count > 0 ? (revenue / count) : 0;

        const revEl = document.getElementById('dash-revenue');
        const countEl = document.getElementById('dash-orders');
        const medEl = document.getElementById('dash-avg');

        if(revEl) revEl.innerText = `$${revenue.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
        if(countEl) countEl.innerText = count;
        if(medEl) medEl.innerText = `$${medianValue.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
    });
});

import { db } from './firebase-config.js';
import { collection, onSnapshot, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const orderList = document.getElementById('order-list');

window.addEventListener('authReady', () => {
    onSnapshot(collection(db, "orders"), (snapshot) => {
        orderList.innerHTML = '';
        snapshot.forEach((docSnap) => {
            const order = docSnap.data();
            const id = docSnap.id;

            orderList.innerHTML += `
                <tr class="hover:bg-white/5 transition-all">
                    <td class="p-4 font-mono text-purple-400">#${id.substring(0,6)}</td>
                    <td class="p-4">${order.customerName}</td>
                    <td class="p-4 font-semibold">$${parseFloat(order.totalPrice).toFixed(2)}</td>
                    <td class="p-4">
                        <span class="px-2 py-1 text-xs rounded-full ${order.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}">${order.status}</span>
                    </td>
                    <td class="p-4 text-center">
                        <button onclick="toggleOrderStatus('${id}', '${order.status}')" class="bg-white/5 hover:bg-white/10 px-3 py-1 rounded-lg text-xs border border-white/10 transition-all">Toggle Status</button>
                    </td>
                </tr>
            `;
        });
    });
});

window.toggleOrderStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'Pending' ? 'Completed' : 'Pending';
    await updateDoc(doc(db, "orders", id), { status: nextStatus });
};


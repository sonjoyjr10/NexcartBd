import { db } from './firebase-config.js';
import { collection, onSnapshot, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const orderList = document.getElementById('order-list');

window.addEventListener('authReady', () => {
    onSnapshot(collection(db, "orders"), (snapshot) => {
        if(!orderList) return;
        orderList.innerHTML = '';
        snapshot.forEach((docSnap) => {
            const order = docSnap.data();
            const id = docSnap.id;

            orderList.innerHTML += `
                <tr class="hover:bg-white/5 transition-all border-b border-white/5">
                    <td class="p-4 font-mono text-purple-400 font-bold">#${id.substring(0,6).toUpperCase()}</td>
                    <td class="p-4">
                        <div class="font-bold text-slate-200">${order.customerName}</div>
                        <div class="text-[10px] text-slate-400">${order.customerPhone} | ${order.customerAddress}</div>
                    </td>
                    <td class="p-4 font-bold text-pink-400">$${parseFloat(order.totalPrice).toFixed(2)}</td>
                    <td class="p-4">
                        <span class="px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase rounded-full ${order.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}">${order.status}</span>
                    </td>
                    <td class="p-4 text-center">
                        <button onclick="toggleOrderStatus('${id}', '${order.status}')" class="bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase border border-white/10 transition-all cursor-pointer">Update Status</button>
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

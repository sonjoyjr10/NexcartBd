import { db } from './firebase-config.js';
import { doc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const settingsForm = document.getElementById('settings-form');

window.addEventListener('authReady', () => {
    // Get Existing Configs
    onSnapshot(doc(db, "settings", "global"), (docSnap) => {
        if(docSnap.exists()){
            const config = docSnap.data();
            document.getElementById('set-title').value = config.storeName || '';
            document.getElementById('set-logo-url').value = config.logoUrl || '';
            document.getElementById('set-banner-url').value = config.bannerUrl || '';
            
            // Sync UI navbar text and logo instantly
            document.getElementById('nav-title').innerText = config.storeName || 'NexShop';
            if(config.logoUrl) document.getElementById('nav-logo').src = config.logoUrl;
        }
    });
});

settingsForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    await setDoc(doc(db, "settings", "global"), {
        storeName: document.getElementById('set-title').value,
        logoUrl: document.getElementById('set-logo-url').value,
        bannerUrl: document.getElementById('set-banner-url').value
    });
    alert("Global configurations published successfully!");
});


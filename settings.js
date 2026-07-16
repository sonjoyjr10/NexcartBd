import { db } from './firebase-config.js';
import { doc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const settingsForm = document.getElementById('settings-form');

// Public Listener for Brand Configs (Syncs both guest view and workspace names instantly)
onSnapshot(doc(db, "settings", "global"), (docSnap) => {
    if(docSnap.exists()){
        const config = docSnap.data();
        
        // Auto Populate fields if inside dashboard view
        const fieldTitle = document.getElementById('set-title');
        if(fieldTitle) fieldTitle.value = config.storeName || '';
        const fieldLogo = document.getElementById('set-logo-url');
        if(fieldLogo) fieldLogo.value = config.logoUrl || '';
        const fieldBanner = document.getElementById('set-banner-url');
        if(fieldBanner) fieldBanner.value = config.bannerUrl || '';
        
        // Realtime Dom Synchronization across frontend assets
        if(config.storeName) {
            document.getElementById('nav-title').innerText = config.storeName;
            document.getElementById('landing-title').innerText = config.storeName.toUpperCase();
        }
        if(config.logoUrl) {
            document.getElementById('nav-logo').src = config.logoUrl;
            document.getElementById('landing-logo').src = config.logoUrl;
        }
        if(config.bannerUrl) {
            document.getElementById('landing-banner').src = config.bannerUrl;
        }
    }
});

if(settingsForm) {
    settingsForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await setDoc(doc(db, "settings", "global"), {
            storeName: document.getElementById('set-title').value,
            logoUrl: document.getElementById('set-logo-url').value,
            bannerUrl: document.getElementById('set-banner-url').value
        });
        alert("Global configurations published successfully!");
    });
}

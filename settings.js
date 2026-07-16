import { db } from './firebase-config.js';
import { doc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const settingsForm = document.getElementById('settings-form');

onSnapshot(doc(db, "settings", "global"), (docSnap) => {
    if(docSnap.exists()){
        const config = docSnap.data();
        
        const setT = document.getElementById('set-title');
        const setL = document.getElementById('set-logo-url');
        const setB = document.getElementById('set-banner-url');

        if(setT) setT.value = config.storeName || '';
        if(setL) setL.value = config.logoUrl || '';
        if(setB) setB.value = config.bannerUrl || '';
        
        if(config.storeName) {
            const navT = document.getElementById('nav-title');
            const landT = document.getElementById('landing-title');
            if(navT) navT.innerText = config.storeName;
            if(landT) landT.innerText = config.storeName.toUpperCase();
        }
        if(config.logoUrl) {
            const navL = document.getElementById('nav-logo');
            const landL = document.getElementById('landing-logo');
            if(navL) navL.src = config.logoUrl;
            if(landL) landL.src = config.logoUrl;
        }
        if(config.bannerUrl) {
            const bannerEl = document.getElementById('landing-banner');
            if(bannerEl) bannerEl.src = config.bannerUrl;
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
        alert("Global platform specifications deployed successfully!");
    });
}

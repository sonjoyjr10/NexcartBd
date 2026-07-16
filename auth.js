import { auth } from './firebase-config.js';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const loginForm = document.getElementById('login-form');
const authContainer = document.getElementById('auth-container');
const mainLayout = document.getElementById('main-layout');
const landingPage = document.getElementById('landing-page');

if(loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const pass = document.getElementById('login-password').value;

        signInWithEmailAndPassword(auth, email, pass)
            .catch(err => alert("Secure Authorization Failed: " + err.message));
    });
}

if(document.getElementById('logout-btn')) {
    document.getElementById('logout-btn').addEventListener('click', () => {
        signOut(auth);
    });
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        if(landingPage) landingPage.classList.add('hidden');
        if(authContainer) authContainer.classList.add('hidden');
        if(mainLayout) mainLayout.classList.remove('hidden');
        window.dispatchEvent(new Event('authReady')); 
    } else {
        if(mainLayout) mainLayout.classList.add('hidden');
        if(landingPage) landingPage.classList.remove('hidden');
        if(authContainer) authContainer.classList.add('hidden'); 
    }
});

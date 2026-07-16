import { auth } from './firebase-config.js';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const loginForm = document.getElementById('login-form');
const authContainer = document.getElementById('auth-container');
const mainLayout = document.getElementById('main-layout');
const landingPage = document.getElementById('landing-page');

// Handle Sign In Securely
if(loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const pass = document.getElementById('login-password').value;

        signInWithEmailAndPassword(auth, email, pass)
            .catch(err => alert("Authentication Failed: " + err.message));
    });
}

// Handle Sign Out Event
document.getElementById('logout-btn').addEventListener('click', () => {
    signOut(auth);
});

// Monitor Auth State State Routing
onAuthStateChanged(auth, (user) => {
    if (user) {
        // Authenticated Admin Route
        if(landingPage) landingPage.classList.add('hidden');
        authContainer.classList.add('hidden');
        mainLayout.classList.remove('hidden');
        window.dispatchEvent(new Event('authReady')); 
    } else {
        // Public Guest Route
        mainLayout.classList.add('hidden');
        if(landingPage) landingPage.classList.remove('hidden');
        authContainer.classList.add('hidden'); // Modal is kept hidden until requested
    }
});

import { auth } from './firebase-config.js';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const loginForm = document.getElementById('login-form');
const authContainer = document.getElementById('auth-container');
const mainLayout = document.getElementById('main-layout');

// Handle Sign In
if(loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const pass = document.getElementById('login-password').value;

        signInWithEmailAndPassword(auth, email, pass)
            .catch(err => alert("Error: " + err.message));
    });
}

// Handle Logout
document.getElementById('logout-btn').addEventListener('click', () => {
    signOut(auth);
});

// Monitor Auth State
onAuthStateChanged(auth, (user) => {
    if (user) {
        authContainer.classList.add('hidden');
        mainLayout.classList.remove('hidden');
        window.dispatchEvent(new Event('authReady')); // Alerts other modules to fetch data
    } else {
        authContainer.classList.remove('hidden');
        mainLayout.classList.add('hidden');
    }
});


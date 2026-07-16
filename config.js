import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyAxvZQQpPiAlvLFsjvSgkH6HDpXgXaoK24",
  authDomain: "nexcartbd-8c880.firebaseapp.com",
  projectId: "nexcartbd-8c880",
  storageBucket: "nexcartbd-8c880.firebasestorage.app",
  messagingSenderId: "258099889504",
  appId: "1:258099889504:web:a8c5a223e6e35a4d1aca05"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

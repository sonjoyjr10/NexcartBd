import { storage } from './firebase-config.js';
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

window.uploadFile = async (fileInput, targetInputId) => {
    const file = fileInput.files[0];
    if(!file) return;

    const targetField = document.getElementById(targetInputId);
    const preText = targetField.value;
    targetField.value = "Uploading system binary... Please hold.";
    targetField.disabled = true;

    const storageRef = ref(storage, `assets/${Date.now()}_${file.name}`);
    
    try {
        const snap = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(snap.ref);
        targetField.value = url;
    } catch (err) {
        alert("Binary Pipeline Fault: " + err.message);
        targetField.value = preText;
    } finally {
        targetField.disabled = false;
    }
};

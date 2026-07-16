import { storage } from './firebase-config.js';
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

window.uploadFile = async (fileInput, targetInputId) => {
    const file = fileInput.files[0];
    if(!file) return;

    const targetField = document.getElementById(targetInputId);
    const originalText = targetField.value;
    targetField.value = "Uploading file... Please wait.";
    targetField.disabled = true;

    const storageRef = ref(storage, `cms/${Date.now()}_${file.name}`);
    
    try {
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        targetField.value = downloadURL;
    } catch (error) {
        alert("Upload Failed: " + error.message);
        targetField.value = originalText;
    } finally {
        targetField.disabled = false;
    }
};


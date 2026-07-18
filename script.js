/**
 * Nexcart PRO - Frontend Application Script
 * File: script.js
 */

// User Register function
async function registerUser(name, phone, password) {
    try {
        const response = await fetch(CONFIG.API_URL, {
            method: "POST",
            mode: "no-cors", // Google App Script-er jonno
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "registerUser", name, phone, password })
        });
        alert("Registration Request Sent!");
    } catch (e) {
        console.error(e);
    }
}

// Order place function
async function placeOrder(orderData) {
    try {
        const response = await fetch(CONFIG.API_URL, {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "createOrder", ...orderData })
        });
        alert("Order Successful!");
    } catch (e) {
        console.error(e);
    }
}

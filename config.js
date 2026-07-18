/* ==========================================
   config.js
   NexCartBD Configuration
========================================== */

const CONFIG = {

    API_URL: "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEBAPP_URL_HERE",

    WHATSAPP_NUMBER: "8801700000000",

    CURRENCY: "৳",

    STORAGE: {
        USER: "nexcart_user",
        CART: "nexcart_cart"
    },

    STATUS: {
        PENDING: "Pending",
        CONFIRMED: "Confirmed",
        PROCESSING: "Processing",
        SHIPPED: "Shipped",
        DELIVERED: "Delivered",
        CANCELLED: "Cancelled"
    }

};

async function api(action,data={}){

    const body={
        action,
        ...data
    };

    const res=await fetch(CONFIG.API_URL,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(body)
    });

    return await res.json();

}

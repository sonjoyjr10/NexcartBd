/**
 * Nexcart PRO - System Configuration
 * File: config.js
 */
const CONFIG = {
    // Ekhane apnar Apps Script-er Web App URL-ti bosan
    API_URL: "https://script.google.com/macros/s/APNA_WEB_APP_LINK_EKHANE_BOSAN/exec", 
    
    CURRENCY: "৳",
    
    // Product List (Ekhane p1, p2 er moto unlimited add korun)
    PRODUCTS: [
        {
            id: "p1",
            name: "Mini Portable Blender",
            price: 1850,
            image: "https://images.unsplash.com/photo-1578643463396-0997cb5328c1?auto=format&fit=crop&w=600&q=80",
            desc: "Portable blender for instant juice.",
            specs: ["380ml", "USB Rechargeable"]
        },
        {
            id: "p2",
            name: "Wireless Headphones",
            price: 4500,
            image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
            desc: "Premium noise cancelling sound.",
            specs: ["22 Hours Battery", "Bluetooth 5.0"]
        }
    ]
};

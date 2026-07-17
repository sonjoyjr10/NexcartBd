/* =========================================================================
   Store Configuration File (Apni a to z sob kisu akhane customize korte parben)
   ========================================================================= */

const SiteConfig = {
    // 1. Store Title and Logos (Website er nam o design)
    storeName: "NexcartBD",
    logoTextFirst: "PICKA",      // Logo prothom ongsho (Sada hobe)
    logoTextSecond: "SHOP",     // Logo ditiyo ongsho (Nil hobe)
    
    // 2. Contact details (Apnar custom contact details)
    phone: "01917531562",
    email: "support@nexcartbd.com",
    address: "Nowabgonj, Dinajpur - 5260",
    
    // 3. TARGET GOOGLE FORM REDIRECTION URL LINK (Apnar Google Form er complete link)
    googleFormUrl: "https://docs.google.com/forms/d/e/1FAIpQLScBmhav2n8QOg4NVpuvdv4huqpjDdavkTZEFWOKRVxz07oUZw/viewform?usp=pp_url",
    
    // 4. Currency Symbol
    currency: "৳",
    
    // 5. Products Array (Modify, Add or Delete products directly here)
    // Apni chaile products add, delete, ba image, name dynamic vabe customize korte parben
    products: [
        {
            id: 1,
            title: "OnePlus Nord Buds 3 Pro Premium ANC Earbuds",
            category: "Earbuds",
            price: 3499,
            oldPrice: 4200,
            badge: "15% OFF",
            image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=60",
            warranty: "1 Year Brand Warranty"
        },
        {
            id: 2,
            title: "Xiaomi Redmi Watch 4 Active Smartwatch",
            category: "Smart Watch",
            price: 8499,
            oldPrice: 9999,
            badge: "Hot Deal",
            image: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=500&auto=format&fit=crop&q=60",
            warranty: "6 Months Brand Warranty"
        },
        {
            id: 3,
            title: "Anker PowerCore 20000mAh Power Bank",
            category: "Power Bank",
            price: 2899,
            oldPrice: 3500,
            badge: "Official",
            image: "https://images.unsplash.com/photo-1609592424085-f67aa64897f2?w=500&auto=format&fit=crop&q=60",
            warranty: "18 Months Warranty"
        },
        {
            id: 4,
            title: "Samsung Galaxy Buds 2 Pro Wireless",
            category: "Earbuds",
            price: 12999,
            oldPrice: 15999,
            badge: "Premium",
            image: "https://images.unsplash.com/photo-1608156639585-b3a032ef9689?w=500&auto=format&fit=crop&q=60",
            warranty: "1 Year Brand Warranty"
        },
        {
            id: 5,
            title: "Realme Smart Band 2 Fitness Tracker",
            category: "Fitness Band",
            price: 1999,
            oldPrice: 2999,
            badge: "Best Seller",
            image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500&auto=format&fit=crop&q=60",
            warranty: "6 Months Brand Warranty"
        },
        {
            id: 6,
            title: "Sony WH-1000XM5 Premium Headphone",
            category: "Headphone",
            price: 31999,
            oldPrice: 36000,
            badge: "Official",
            image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60",
            warranty: "1 Year International Warranty"
        }
    ]
};


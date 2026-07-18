const CONFIG = {
    // ==========================================
    // ১. ব্যাকএন্ড কানেক্টিভিটি (গুগল অ্যাপস স্ক্রিপ্ট লিঙ্ক)
    // ==========================================
    API_URL: "AKfycbyXbJm9CkwarT1Rei9F9RtZWV_h7BAlGOFSAnsX1n-hW2VedO0500ROCEvT4Wn4vXo",

    // ==========================================
    // ২. ব্র্যান্ডিং এবং কন্টাক্ট ইনফরমেশন
    // ==========================================
    BRAND: {
        name: "NexCartBD",
        tagline: "Fill the form below to place your order",
        logoIcon: "fa-solid fa-bag-shopping", // FontAwesome Icon Class
        adminEmail: "your-shop-email@gmail.com", // এখানে আপনার নিজের শপ ইমেইল দিবেন যেখানে অর্ডারের কপি যাবে
        currencySymbol: "৳",
    },

    // ==========================================
    // ৩. কালার থিম কাস্টমাইজেশন (এখান থেকে পুরো সাইটের রঙ বদলান)
    // ==========================================
    THEME: {
        primaryColor: "#0052e0",       // মূল ব্র্যান্ড কালার (নীল)
        primaryHover: "#0041b3",       // বাটনে মাউস নিলে যে রঙ হবে
        accentColor: "#10b981",        // সাকসেস বা একটিভ কালার (সবুজ)
        backgroundLight: "#f4f7fc",    // ওয়েবসাইটের ব্যাকগ্রাউন্ড রঙ
        cardBackground: "#ffffff",     // কার্ড এবং ফর্মের ব্যাকগ্রাউন্ড রঙ
        textMain: "#1e293b",           // লেখার মূল রঙ
        textMuted: "#64748b",          // ছোট বা সাব-টাইটেলের লেখার রঙ
        borderColor: "#e2e8f0"         // বর্ডার বা ডিভাইডার লাইনের রঙ
    },

    // ==========================================
    // ৪. ডেলিভারি চার্জ কাস্টমাইজেশন
    // ==========================================
    DELIVERY: {
        insideDhaka: {
            label: "Inside Dhaka",
            charge: 60
        },
        outsideDhaka: {
            label: "Outside Dhaka",
            charge: 120
        }
    },

    // ==========================================
    // ৫. পেমেন্ট ইনফরমেশন (বিকাশ ও রকেট নাম্বার)
    // ==========================================
    PAYMENT: {
        bKashNumber: "017XXXXXXXX", // আপনার বিকাশ মার্চেন্ট বা পার্সোনাল নাম্বার
        NagadNumber: "018XXXXXXXX", // আপনার নগদ মার্চেন্ট বা পার্সোনাল নাম্বার
    },

    // ==========================================
    // ৬. প্রোডাক্ট ডাটাবেস (A to Z প্রোডাক্ট কন্ট্রোল)
    // ==========================================
    PRODUCTS: [
        {
            id: 1,
            name: "Mini Portable Blender",
            price: 1220,
            image: "https://images.unsplash.com/photo-1578643463396-0997cb5328c1?w=500&q=80",
            badge: "In Stock"
        },
        {
            id: 2,
            name: "Wireless Waterproof Earbuds",
            price: 1850,
            image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&q=80",
            badge: "In Stock"
        },
        {
            id: 3,
            name: "Smart Fitness Watch",
            price: 2450,
            image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80",
            badge: "Popular"
        }
    ]
};


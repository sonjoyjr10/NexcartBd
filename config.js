// ==========================================
// NexcartBD: A to Z Custom Configuration File
// ==========================================

const CONFIG = {
  // 1. BRAND SETTINGS
  brandName: "NexcartBD", // Apnar page er nam
  
  // Brand logo (Tumi local image e.g. "logo.png" ba kono live web link use korte parbe)
  brandLogo: "<a href="https://ibb.co.com/d4pL9drM"><img src="https://i.ibb.co.com/ZzgYsnVX/Nex-Cart-BD.png" alt="Nex-Cart-BD" border="0"></a>", 
  
  // 2. ORDER LINK (Google Form Link)
  // Protita product card er order button click korle ei dynamic link-e niye jabe
  googleFormUrl: "https://forms.gle/xESLfNN1SMfbGKsG6",
  
  // 3. IMAGE SLIDER SETTINGS
  // Tumi eikhane slide images, title ebong short details change/add korte parbe
  sliderImages: [
    {
      url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1600&q=80",
      title: "Ultimate Athletic Sneaker Series",
      subtitle: "Explore true responsive design on every running stride."
    },
    {
      url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1600&q=80",
      title: "Exotic Minimal Watch Collection",
      subtitle: "Smart fitness analytics matching premium elegance."
    },
    {
      url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1600&q=80",
      title: "Wireless Premium ANC Headphones",
      subtitle: "High definition studio acoustics made portable."
    }
  ],

  // 4. PRODUCT GRID SETTINGS (Dynamic Products Section)
  // Tumi eikhane prothoti product er Image, Title, Price tag, Badges etc design change/add korte parbe
  products: [
    {
      id: 1,
      name: "NexSprint Ultra Shoes",
      price: "৳ ৩,৫০০",
      tag: "EXOTIC SPORT", // Image er bame thaka automatic neon badge text
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
      desc: "Perfect performance sneakers build with carbon fiber plates."
    },
    {
      id: 2,
      name: "Smart Watch Luxe-8",
      price: "৳ ২,৮০০",
      tag: "PREMIUM WEAR",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
      desc: "Active heartbeat sensors, customizable neon UI design, waterproof body."
    },
    {
      id: 3,
      name: "Acoustic Over-Ear 4.0",
      price: "৳ ৪,২০০",
      tag: "HIGH AUDIO",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
      desc: "Deep rich bass curves dynamic ambient surrounding canceler system."
    },
    {
      id: 4,
      name: "Pro Leather Minimalist Wallet",
      price: "৳ ১,৫০০",
      tag: "ACCESSORIES",
      image: "https://images.unsplash.com/photo-1627124718515-47f9931b3e4a?w=600&q=80",
      desc: "Slim profile handmade textured design matching dark mode accessories."
    },
    {
      id: 5,
      name: "Neo Tech Wireless Charger Pack",
      price: "৳ ১,৯০০",
      tag: "NEW DROP",
      image: "https://images.unsplash.com/photo-1622445262465-2481c4574875?w=600&q=80",
      desc: "Fast charging module with premium dark ambient indicators."
    },
    {
      id: 6,
      name: "Cyber Matte Water Flask",
      price: "৳ ১,২০০",
      tag: "LIFESTYLE",
      image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80",
      desc: "Double wall vacuum insulation inside custom matte black carbon design."
    }
  ]
};


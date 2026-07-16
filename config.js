// Parameter constraints and dynamic pricing rate sheets

const CONFIG = {
    developerProfileName: "Pro WordPress Developer Specialist",
    currency: "USD",

    // Standard baseline template pricing configuration limits
    pricing: {
        ecommerce: 350,   // WooCommerce Store Setup baseline
        portfolio: 150,   // Business Portfolio landing set
        news: 220,        // News portal development base charge
        lms: 380          // Academy LMS dynamic course base setup
    },

    // Baseline delivery duration in working days
    delivery: {
        ecommerce: 10,
        portfolio: 4,
        news: 6,
        lms: 12
    },

    // Custom pricing adjustments sheets
    addOnRates: {
        perPageRate: 25,       // Charge rate per page built
        advancedSeo: 120,      // SEO deployment premium module
        speedBoost: 100,       // Compression configurations and cache parameters
        advancedSecurity: 80,  // Firewall security configuration set
        customFeature: 250     // Third-party API custom logic
    }
};


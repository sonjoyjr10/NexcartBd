// Modern calculation and UI controller state module

document.addEventListener('DOMContentLoaded', () => {
    // Select elements from DOM
    const siteType = document.getElementById('site-type');
    const pageCount = document.getElementById('page-count');
    const pageCountVal = document.getElementById('page-count-val');
    const addonSeo = document.getElementById('addon-seo');
    const addonSpeed = document.getElementById('addon-speed');
    const addonSecurity = document.getElementById('addon-security');
    const addonCustom = document.getElementById('addon-custom');

    // Outputs Target Elements
    const estimatedCost = document.getElementById('estimated-cost');
    const estimatedTime = document.getElementById('estimated-time');

    // Live Math Function Engine
    function calculateTotalEstimate() {
        let baseFee = 200;
        let baseTimelineDays = 5;
        let perPageCostValue = 25;

        // Verify configuration state dynamic values from config.js
        if (typeof CONFIG !== 'undefined') {
            const selectedType = siteType.value;
            baseFee = CONFIG.pricing[selectedType] || baseFee;
            baseTimelineDays = CONFIG.delivery[selectedType] || baseTimelineDays;
            perPageCostValue = CONFIG.addOnRates.perPageRate || perPageCostValue;
        }

        // Processing page slider input range values
        const pagesSelected = parseInt(pageCount.value) || 1;
        pageCountVal.innerText = `${pagesSelected} ${pagesSelected === 1 ? 'Page' : 'Pages'}`;

        const pageAdditionCost = pagesSelected * perPageCostValue;

        // Premium upgradable modules calculations 
        let featuresTotal = 0;
        
        if (addonSeo) {
            const parentCard = addonSeo.closest('.addon-card');
            if (addonSeo.checked) {
                featuresTotal += (CONFIG.addOnRates.advancedSeo || 120);
                if(parentCard) parentCard.classList.add('active-state');
            } else {
                if(parentCard) parentCard.classList.remove('active-state');
            }
        }

        if (addonSpeed) {
            const parentCard = addonSpeed.closest('.addon-card');
            if (addonSpeed.checked) {
                featuresTotal += (CONFIG.addOnRates.speedBoost || 100);
                if(parentCard) parentCard.classList.add('active-state');
            } else {
                if(parentCard) parentCard.classList.remove('active-state');
            }
        }

        if (addonSecurity) {
            const parentCard = addonSecurity.closest('.addon-card');
            if (addonSecurity.checked) {
                featuresTotal += (CONFIG.addOnRates.advancedSecurity || 80);
                if(parentCard) parentCard.classList.add('active-state');
            } else {
                if(parentCard) parentCard.classList.remove('active-state');
            }
        }

        if (addonCustom) {
            const parentCard = addonCustom.closest('.addon-card');
            if (addonCustom.checked) {
                featuresTotal += (CONFIG.addOnRates.customFeature || 250);
                if(parentCard) parentCard.classList.add('active-state');
            } else {
                if(parentCard) parentCard.classList.remove('active-state');
            }
        }

        // Grand valuation
        const grandTotal = baseFee + pageAdditionCost + featuresTotal;

        // Dynamic delivery speed rule: Add 1 delivery day for every 4 extra pages setup
        const extraDays = Math.floor(pagesSelected / 4);
        const finalTimeline = baseTimelineDays + extraDays;

        // Output value update
        if (estimatedCost) {
            animateNumberValue(parseFloat(estimatedCost.innerText) || 0, grandTotal, 400);
        }
        if (estimatedTime) {
            estimatedTime.innerText = `${finalTimeline} Days`;
        }
    }

    // Number roll animation logic for premium visual response
    function animateNumberValue(start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const currentVal = start + progress * (end - start);
            estimatedCost.innerText = currentVal.toFixed(2);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    // Event listeners
    if (siteType) siteType.addEventListener('change', calculateTotalEstimate);
    if (pageCount) pageCount.addEventListener('input', calculateTotalEstimate);
    
    [addonSeo, addonSpeed, addonSecurity, addonCustom].forEach(checkbox => {
        if (checkbox) checkbox.addEventListener('change', calculateTotalEstimate);
    });

    // Run first baseline execution on component mount
    calculateTotalEstimate();
});

                                      

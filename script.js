// ==========================================
// NexcartBD: Interactive Dynamic Controller
// ==========================================

let currentSlide = 0;
let totalSlides = 0;

window.addEventListener('DOMContentLoaded', () => {
  // CONFIG theke slider count state auto read hobe
  totalSlides = CONFIG.sliderImages.length;

  // 1. BRAND SETUPS DIRECT LOAD FROM CONFIG
  document.getElementById('brandLogo').src = CONFIG.brandLogo;
  document.getElementById('footerLogo').src = CONFIG.brandLogo;
  document.getElementById('brandNameText').innerText = CONFIG.brandName;
  document.getElementById('footerBrandName').innerText = CONFIG.brandName;

  // 2. GENERATE SLIDES DYNAMICALLY
  const sliderContainer = document.getElementById('sliderContainer');
  const sliderDots = document.getElementById('sliderDots');

  CONFIG.sliderImages.forEach((slide, index) => {
    // Single slide layout block
    const slideEl = document.createElement('div');
    slideEl.className = `absolute inset-0 w-full h-full slider-transition ${index === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`;
    slideEl.id = `slide-${index}`;
    
    slideEl.innerHTML = `
      <div class="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent z-[2]"></div>
      <img src="${slide.url}" alt="${slide.title}" class="w-full h-full object-cover">
      <div class="absolute inset-0 flex items-center z-[3] px-6 md:px-16 max-w-7xl mx-auto">
        <div class="max-w-2xl space-y-4">
          <span class="inline-block px-3 py-1 rounded bg-brandNeon/10 border border-brandNeon/20 text-brandNeon text-xs font-bold tracking-widest uppercase">EXCLUSIVE DISCOUNTS</span>
          <h1 class="text-4xl md:text-6xl font-black tracking-tight leading-none text-white">${slide.title}</h1>
          <p class="text-sm md:text-base text-gray-300 max-w-lg font-light">${slide.subtitle}</p>
          <div class="pt-2">
            <a href="#products-section" class="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brandNeon text-black font-bold text-xs transition-all duration-300 hover:scale-105 neon-glow">
              Explore Collection <i data-lucide="arrow-right" class="w-4 h-4"></i>
            </a>
          </div>
        </div>
      </div>
    `;
    sliderContainer.appendChild(slideEl);

    // Indicator pagination dot setup
    const dot = document.createElement('button');
    dot.className = `w-2 h-2 rounded-full transition-all duration-300 ${index === 0 ? 'bg-brandNeon w-6' : 'bg-gray-600'}`;
    dot.id = `dot-${index}`;
    dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
    dot.onclick = () => showSlide(index);
    sliderDots.appendChild(dot);
  });

  // 3. GENERATE PRODUCT LIST CARDS DYNAMICALLY
  const productGrid = document.getElementById('productGrid');
  CONFIG.products.forEach((product) => {
    const pCard = document.createElement('div');
    pCard.className = "group relative rounded-3xl overflow-hidden bg-brandCard border border-white/5 hover:border-brandNeon/30 transition-all duration-500 hover:-translate-y-2 flex flex-col";
    
    pCard.innerHTML = `
      <div class="relative aspect-[4/3] overflow-hidden bg-black/40">
        <span class="absolute top-4 left-4 z-10 px-2.5 py-1 text-[10px] font-bold tracking-wider rounded-md bg-brandNeon text-black font-mono">
          ${product.tag}
        </span>
        <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
      </div>
      <div class="p-6 flex-grow flex flex-col justify-between">
        <div class="space-y-2">
          <div class="flex justify-between items-start gap-4">
            <h3 class="font-bold text-lg text-white group-hover:text-brandNeon transition-colors">${product.name}</h3>
            <span class="text-brandNeon font-mono font-extrabold text-base whitespace-nowrap">${product.price}</span>
          </div>
          <p class="text-xs text-gray-400 line-clamp-2 leading-relaxed">
            ${product.desc}
          </p>
        </div>
        <div class="pt-6">
          <button onclick="handleOrder('${product.name}')" class="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/[0.03] hover:bg-brandNeon hover:text-black border border-white/10 hover:border-transparent transition-all duration-300 font-bold text-xs tracking-wider">
            <i data-lucide="shopping-cart" class="w-4 h-4"></i> ORDER KARUN
          </button>
        </div>
      </div>
    `;
    productGrid.appendChild(pCard);
  });

  // Dynamic Icon Activation
  lucide.createIcons();

  // 4. AUTOMATIC CAROUSEL LOOPING SETUP (5 SECONDS INTERVAL)
  setInterval(() => {
    nextSlide();
  }, 5000);
});

// Slider Transition States
function showSlide(index) {
  document.getElementById(`slide-${currentSlide}`).classList.replace('opacity-100', 'opacity-0');
  document.getElementById(`slide-${currentSlide}`).classList.replace('z-10', 'z-0');
  document.getElementById(`dot-${currentSlide}`).classList.replace('bg-brandNeon', 'bg-gray-600');
  document.getElementById(`dot-${currentSlide}`).classList.remove('w-6');

  currentSlide = index;

  document.getElementById(`slide-${currentSlide}`).classList.replace('opacity-0', 'opacity-100');
  document.getElementById(`slide-${currentSlide}`).classList.replace('z-0', 'z-10');
  document.getElementById(`dot-${currentSlide}`).classList.replace('bg-gray-600', 'bg-brandNeon');
  document.getElementById(`dot-${currentSlide}`).classList.add('w-6');
}

function nextSlide() {
  const nextIndex = (currentSlide + 1) % totalSlides;
  showSlide(nextIndex);
}

function prevSlide() {
  const prevIndex = (currentSlide - 1 + totalSlides) % totalSlides;
  showSlide(prevIndex);
}

// Order Form Action Controller
function handleOrder(productName) {
  // Dynamic order redirect link
  window.open(CONFIG.googleFormUrl, '_blank');
}

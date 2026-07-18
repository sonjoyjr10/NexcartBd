/* ==========================================
script.js (PART-1)
========================================== */

let CART=[];

let CURRENT_USER=null;

let PRODUCTS=[...CONFIG.PRODUCTS];

document.addEventListener("DOMContentLoaded",()=>{

loadSession();

renderProducts(PRODUCTS);

updateCartBadge();

});

function showSection(id){

document.querySelectorAll(".section-view").forEach(x=>{

x.classList.add("hidden");

});

document.getElementById("section-"+id).classList.remove("hidden");

window.scrollTo({
top:0,
behavior:"smooth"
});

}

function renderProducts(list){

const grid=document.getElementById("product-grid");

grid.innerHTML="";

if(list.length===0){

grid.innerHTML=`

<div class="col-span-full text-center py-20">

<h2 class="text-2xl font-bold">No Product Found</h2>

</div>

`;

return;

}

list.forEach(product=>{

grid.innerHTML+=`

<div class="bg-brand-cardBg rounded-3xl overflow-hidden border border-brand-cardBorder hover:border-brand-red duration-300">

<img src="${product.image}" class="w-full h-64 object-cover">

<div class="p-6">

<h2 class="font-bold text-xl">

${product.name}

</h2>

<p class="text-brand-textGray mt-2">

${product.desc}

</p>

<div class="mt-5 flex justify-between items-center">

<h3 class="text-2xl font-black">

৳ ${product.price}

</h3>

<button onclick="addToCart('${product.id}')"

class="bg-brand-red px-5 py-3 rounded-full">

Add

</button>

</div>

</div>

</div>

`;

});

}

function filterProducts(keyword){

keyword=keyword.toLowerCase();

const filtered=PRODUCTS.filter(x=>

x.name.toLowerCase().includes(keyword)

);

renderProducts(filtered);

}

function addToCart(id){

const product=PRODUCTS.find(x=>x.id==id);

const exist=CART.find(x=>x.id==id);

if(exist){

exist.qty++;

}else{

CART.push({

...product,

qty:1

});

}

localStorage.setItem(

CONFIG.STORAGE.CART,

JSON.stringify(CART)

);

updateCartBadge();

toast("Added To Cart");

}

function updateCartBadge(){

const badge=document.getElementById("cart-badge");

const total=CART.reduce((a,b)=>a+b.qty,0);

badge.innerHTML=total;

if(total>0){

badge.classList.remove("hidden");

}else{

badge.classList.add("hidden");

}

}

function loadSession(){

const user=localStorage.getItem(CONFIG.STORAGE.USER);

const cart=localStorage.getItem(CONFIG.STORAGE.CART);

if(user){

CURRENT_USER=JSON.parse(user);

updateNavbar();

}

if(cart){

CART=JSON.parse(cart);

}

}

function updateNavbar(){

if(!CURRENT_USER)return;

document.getElementById("nav-username").innerHTML=CURRENT_USER.name;

document.getElementById("profile-name-display").innerHTML=CURRENT_USER.name;

document.getElementById("profile-phone-display").innerHTML=CURRENT_USER.phone;

document.getElementById("profile-id-display").innerHTML=CURRENT_USER.customerId;

if(CURRENT_USER.avatar){

document.getElementById("nav-avatar").src=CURRENT_USER.avatar;

document.getElementById("user-avatar").src=CURRENT_USER.avatar;

}

}

function toast(text){

const div=document.createElement("div");

div.className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-brand-red text-white px-6 py-3 rounded-full z-[99999]";

div.innerHTML=text;

document.body.appendChild(div);

setTimeout(()=>{

div.remove();

},2500);

}

function toggleCart(){

alert("Cart Part Coming Next");

}

function handleAccountNav(){

if(CURRENT_USER){

showSection("account");

}else{

showSection("auth");

}

}
/* ==========================================
script.js (PART-2)
========================================== */

function switchAuthTab(type){

const login=document.getElementById("login-form");
const register=document.getElementById("register-form");

const loginTab=document.getElementById("tab-login");
const registerTab=document.getElementById("tab-register");

if(type==="login"){

login.classList.remove("hidden");
register.classList.add("hidden");

loginTab.classList.add("border-brand-red","text-white");
loginTab.classList.remove("text-brand-textGray");

registerTab.classList.remove("border-brand-red","text-white");
registerTab.classList.add("text-brand-textGray");

}else{

register.classList.remove("hidden");
login.classList.add("hidden");

registerTab.classList.add("border-brand-red","text-white");
registerTab.classList.remove("text-brand-textGray");

loginTab.classList.remove("border-brand-red","text-white");
loginTab.classList.add("text-brand-textGray");

}

}

async function handleRegisterSubmit(e){

e.preventDefault();

const name=document.getElementById("reg-name").value.trim();

const phone=document.getElementById("reg-phone").value.trim();

const password=document.getElementById("reg-password").value;

const confirm=document.getElementById("reg-password-confirm").value;

if(password!==confirm){

toast("Password Doesn't Match");

return;

}

const btn=document.getElementById("reg-btn");

btn.disabled=true;

btn.innerHTML="Please Wait...";

try{

const res=await api("register",{

name,

phone,

password

});

if(res.success){

toast("Registration Successful");

switchAuthTab("login");

}else{

toast(res.message);

}

}catch(err){

toast("Server Error");

}

btn.disabled=false;

btn.innerHTML="Sign Up & Register";

}

async function handleLoginSubmit(e){

e.preventDefault();

const phone=document.getElementById("login-phone").value.trim();

const password=document.getElementById("login-password").value;

const btn=document.getElementById("login-btn");

btn.disabled=true;

btn.innerHTML="Logging...";

try{

const res=await api("login",{

phone,

password

});

if(res.success){

CURRENT_USER=res.user;

localStorage.setItem(

CONFIG.STORAGE.USER,

JSON.stringify(CURRENT_USER)

);

updateNavbar();

toast("Welcome");

showSection("account");

loadMyOrders();

}else{

toast(res.message);

}

}catch(err){

toast("Login Failed");

}

btn.disabled=false;

btn.innerHTML="Log In";

}

function handleLogout(){

CURRENT_USER=null;

localStorage.removeItem(CONFIG.STORAGE.USER);

showSection("home");

location.reload();

}

async function loadMyOrders(){

if(!CURRENT_USER)return;

const list=document.getElementById("user-orders-list");

list.innerHTML="Loading...";

try{

const res=await api("myOrders",{

customerId:CURRENT_USER.customerId

});

list.innerHTML="";

if(res.orders.length===0){

list.innerHTML=`

<div class="text-center py-10">

No Orders Found

</div>

`;

return;

}

res.orders.forEach(order=>{

list.innerHTML+=`

<div class="border border-brand-cardBorder rounded-2xl p-5">

<div class="flex justify-between">

<h3 class="font-bold">

${order.product}

</h3>

<span class="text-brand-red">

${order.status}

</span>

</div>

<p class="text-sm mt-2">

Order ID :

${order.orderId}

</p>

<p class="text-sm">

Quantity :

${order.qty}

</p>

<p class="text-sm">

Price :

৳ ${order.price}

</p>

<p class="text-sm">

${order.date}

</p>

</div>

`;

});

}catch(err){

list.innerHTML="Failed";

}

}

async function handleTrackOrder(){

const value=document.getElementById("track-input").value.trim();

const box=document.getElementById("tracking-result");

box.classList.remove("hidden");

box.innerHTML="Searching...";

try{

const res=await api("track",{

keyword:value

});

if(!res.success){

box.innerHTML="Order Not Found";

return;

}

const order=res.order;

box.innerHTML=`

<div class="space-y-3">

<p>

<b>Order ID :</b>

${order.orderId}

</p>

<p>

<b>Customer :</b>

${order.customer}

</p>

<p>

<b>Phone :</b>

${order.phone}

</p>

<p>

<b>Product :</b>

${order.product}

</p>

<p>

<b>Quantity :</b>

${order.qty}

</p>

<p>

<b>Status :</b>

<span class="text-brand-red">

${order.status}

</span>

</p>

<p>

<b>Date :</b>

${order.date}

</p>

</div>

`;

}catch(err){

box.innerHTML="Server Error";

}

   }
/* ==========================================
script.js (PART-3)
========================================== */

function getCartTotal(){

    return CART.reduce((sum,item)=>{
        return sum+(item.price*item.qty);
    },0);

}

function cartHTML(){

    if(CART.length===0){

        return `
        <div class="text-center py-10">
            Cart Empty
        </div>
        `;

    }

    let html="";

    CART.forEach(item=>{

        html+=`

        <div class="flex gap-4 border-b border-brand-cardBorder pb-4">

            <img src="${item.image}"
            class="w-20 h-20 rounded-xl object-cover">

            <div class="flex-1">

                <h3 class="font-bold">
                    ${item.name}
                </h3>

                <p class="text-brand-red">
                    ৳ ${item.price}
                </p>

                <div class="flex items-center gap-2 mt-3">

                    <button
                    onclick="changeQty('${item.id}',-1)"
                    class="w-8 h-8 rounded-full bg-brand-red">
                    -
                    </button>

                    <span>
                    ${item.qty}
                    </span>

                    <button
                    onclick="changeQty('${item.id}',1)"
                    class="w-8 h-8 rounded-full bg-brand-red">
                    +
                    </button>

                </div>

            </div>

            <button
            onclick="removeCart('${item.id}')"
            class="text-red-500">

                <i class="fa-solid fa-trash"></i>

            </button>

        </div>

        `;

    });

    html+=`

    <div class="pt-6">

        <div class="flex justify-between">

            <span>Total</span>

            <b>৳ ${getCartTotal()}</b>

        </div>

        <button
        onclick="checkout()"
        class="w-full bg-brand-red mt-6 py-4 rounded-full font-bold">

            Place Order

        </button>

    </div>

    `;

    return html;

}

function toggleCart(){

    let drawer=document.getElementById("cartDrawer");

    if(!drawer){

        drawer=document.createElement("div");

        drawer.id="cartDrawer";

        drawer.className="fixed top-0 right-0 w-full md:w-[420px] h-screen bg-black z-[99999] p-6 overflow-auto";

        document.body.appendChild(drawer);

    }

    drawer.innerHTML=`

    <div class="flex justify-between items-center mb-8">

        <h2 class="text-2xl font-bold">

            Shopping Cart

        </h2>

        <button onclick="closeCart()">

            <i class="fa-solid fa-xmark text-2xl"></i>

        </button>

    </div>

    ${cartHTML()}

    `;

}

function closeCart(){

    const drawer=document.getElementById("cartDrawer");

    if(drawer){

        drawer.remove();

    }

}

function changeQty(id,type){

    const item=CART.find(x=>x.id===id);

    if(!item) return;

    item.qty+=type;

    if(item.qty<=0){

        CART=CART.filter(x=>x.id!==id);

    }

    localStorage.setItem(
        CONFIG.STORAGE.CART,
        JSON.stringify(CART)
    );

    updateCartBadge();

    toggleCart();

}

function removeCart(id){

    CART=CART.filter(x=>x.id!==id);

    localStorage.setItem(
        CONFIG.STORAGE.CART,
        JSON.stringify(CART)
    );

    updateCartBadge();

    toggleCart();

}

async function checkout(){

    if(!CURRENT_USER){

        toast("Login First");

        closeCart();

        showSection("auth");

        return;

    }

    if(CART.length===0){

        toast("Cart Empty");

        return;

    }

    const order={

        customerId:CURRENT_USER.customerId,

        customer:CURRENT_USER.name,

        phone:CURRENT_USER.phone,

        items:CART,

        total:getCartTotal()

    };

    try{

        const res=await api("placeOrder",order);

        if(res.success){

            toast("Order Placed");

            CART=[];

            localStorage.removeItem(CONFIG.STORAGE.CART);

            updateCartBadge();

            closeCart();

            loadMyOrders();

            window.open(

                `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=Order ID : ${res.orderId}`,

                "_blank"

            );

        }else{

            toast(res.message);

        }

    }catch(e){

        toast("Order Failed");

    }

}

async function uploadAvatar(e){

    const file=e.target.files[0];

    if(!file) return;

    const reader=new FileReader();

    reader.onload=async function(){

        const base64=reader.result;

        try{

            const res=await api("uploadAvatar",{

                customerId:CURRENT_USER.customerId,

                image:base64

            });

            if(res.success){

                CURRENT_USER.avatar=res.url;

                localStorage.setItem(

                    CONFIG.STORAGE.USER,

                    JSON.stringify(CURRENT_USER)

                );

                updateNavbar();

                toast("Avatar Updated");

            }

        }catch(err){

            toast("Upload Failed");

        }

    };

    reader.readAsDataURL(file);

}

function toggleMobileMenu(){

    document
    .getElementById("mobile-menu")
    .classList
    .toggle("translate-x-full");

}

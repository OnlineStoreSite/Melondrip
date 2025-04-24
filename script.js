/* ---------- Local-storage cart ---------- */
const CART_KEY = 'melondrip_cart';
const getCart  = () => JSON.parse(localStorage.getItem(CART_KEY) || '[]');
const saveCart = cart => localStorage.setItem(CART_KEY, JSON.stringify(cart));
const updateCartCount = () => {
  const total = getCart().reduce((s,i)=>s+i.quantity,0);
  const el = document.getElementById('cart-count'); if(el) el.textContent = total;
};
updateCartCount();

/* ---------- Toast ---------- */
function toast(msg){
  const t = document.getElementById('toast'); if(!t) return;
  t.textContent = msg; t.style.opacity = 1;
  setTimeout(()=>t.style.opacity=0, 2000);
}

/* ---------- Cart drawer ---------- */
const cartModal = document.getElementById('cart-modal');
if(cartModal){
  const closeBtn  = document.getElementById('cart-close');
  const checkoutB = document.getElementById('checkout-btn');
  document.getElementById('cart-link').addEventListener('click',e=>{
    e.preventDefault(); renderCart(); cartModal.classList.add('open');
  });
  closeBtn.addEventListener('click',()=>cartModal.classList.remove('open'));
  window.addEventListener('click',e=>{ if(e.target===cartModal) cartModal.classList.remove('open'); });
  checkoutB.addEventListener('click',()=>location='checkout.html');
}

function renderCart(){
  const wrap = document.getElementById('cart-items'); if(!wrap) return;
  const totalEl = document.getElementById('cart-total');
  const cart = getCart(); wrap.innerHTML='';
  if(!cart.length){wrap.innerHTML='<p>Your cart is empty.</p>';totalEl.textContent='$0.00';return;}
  let total=0;
  cart.forEach(item=>{
    total += item.price*item.quantity;
    const div=document.createElement('div');div.className='cart-item';
    div.innerHTML=`
      <img src="${item.image}" alt="${item.name}">
      <div style="flex:1">
        <p>${item.name}</p>
        <p>$${item.price.toFixed(2)} ea</p>
      </div>
      <div class="quantity-spinner">
        <button data-id="${item.id}" data-a="dec" class="qty-btn">–</button>
        <input readonly value="${item.quantity}">
        <button data-id="${item.id}" data-a="inc" class="qty-btn">+</button>
      </div>
      <button class="remove-btn" data-id="${item.id}" data-a="rem">×</button>`;
    wrap.appendChild(div);
  });
  totalEl.textContent=`$${total.toFixed(2)}`;
  // attach
  wrap.querySelectorAll('button').forEach(b=>{
    b.onclick=()=>{
      let cart=getCart(); const idx=cart.findIndex(i=>i.id===b.dataset.id);
      if(idx<0) return;
      if(b.dataset.a==='inc') cart[idx].quantity++;
      if(b.dataset.a==='dec'&&cart[idx].quantity>1) cart[idx].quantity--;
      if(b.dataset.a==='rem') cart.splice(idx,1);
      saveCart(cart); updateCartCount(); renderCart();
    };
  });
}

/* ---------- Product page logic ---------- */
const qtyInput=document.getElementById('quantity');
if(qtyInput){
  document.getElementById('decrease-btn').onclick=()=>{const v=+qtyInput.value;if(v>1)qtyInput.value=v-1;};
  document.getElementById('increase-btn').onclick=()=>{qtyInput.value=+qtyInput.value+1;};
  document.getElementById('add-to-cart-form').onsubmit=e=>{
    e.preventDefault();
    const d=document.querySelector('.product-details');
    const {id,name,image}=d.dataset, price=parseFloat(d.dataset.price), qty=+qtyInput.value;
    let cart=getCart(), idx=cart.findIndex(i=>i.id===id);
    idx>-1?cart[idx].quantity+=qty:cart.push({id,name,price,quantity:qty,image});
    saveCart(cart); updateCartCount(); toast(`${qty}× ${name} added`);
  };

  /* thumbnails */
  const imgs=[], main=document.getElementById('current-image'), thumbs=document.getElementById('thumbnails');
  let i=1; (function load(){const im=new Image();im.src=`product_1/image_${i}.png`;im.onload=()=>{imgs.push(im.src);i++;load();};im.onerror=()=>{if(!imgs.length)imgs.push('product_1.png');init();};})();
  function init(){main.src=imgs[0];imgs.forEach((src,idx)=>{const t=document.createElement('img');t.src=src;t.className='thumbnail'+(idx?'' :' selected');t.onclick=()=>{main.src=src;thumbs.querySelectorAll('img').forEach(el=>el.classList.remove('selected'));t.classList.add('selected');};thumbs.appendChild(t);});}
}

/* ---------- Account placeholder ---------- */
const acc=document.getElementById('account-link');
if(acc) acc.onclick=e=>{e.preventDefault();alert('Account section coming soon');};

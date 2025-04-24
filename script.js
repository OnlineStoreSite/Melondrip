// CART STORAGE & COUNT
const CART_KEY = 'nuvora_cart';
function getCart(){return JSON.parse(localStorage.getItem(CART_KEY)||'[]')}
function saveCart(c){localStorage.setItem(CART_KEY,JSON.stringify(c))}
function updateCartCount(){
  const ct=getCart().reduce((s,i)=>s+i.quantity,0);
  document.getElementById('cart-count').textContent=ct;
}
updateCartCount();

// TOAST
function showToast(msg='Added to cart'){
  const t=document.getElementById('toast');
  t.textContent=msg; t.style.opacity='1';
  setTimeout(()=>t.style.opacity='0',2000);
}

// CART MODAL
const cartModal=document.getElementById('cart-modal');
function openCartModal(){renderCartItems();cartModal.style.display='flex'}
function closeCartModal(){cartModal.style.display='none'}
document.getElementById('cart-link').addEventListener('click',e=>{
  e.preventDefault();openCartModal();
});
document.getElementById('cart-close').addEventListener('click',closeCartModal);
window.addEventListener('click',e=>{if(e.target===cartModal)closeCartModal()});
document.getElementById('checkout-btn').addEventListener('click',()=>{
  window.location.href='checkout.html';
});

// RENDER CART ITEMS
function renderCartItems(){
  const cont=document.getElementById('cart-items'), cart=getCart();
  cont.innerHTML='';
  if(!cart.length){cont.innerHTML='<p>Your cart is empty.</p>';return}
  cart.forEach(item=>{
    const div=document.createElement('div');
    div.className='cart-item';
    div.innerHTML=`
      <span>${item.name}</span>
      <div class="cart-qty">
        <button data-id="${item.id}" data-action="decr">–</button>
        <span>${item.quantity}</span>
        <button data-id="${item.id}" data-action="incr">+</button>
      </div>
      <button class="remove-btn" data-id="${item.id}" data-action="remove">×</button>
    `;
    cont.appendChild(div);
  });
  cont.querySelectorAll('button').forEach(b=>{
    b.addEventListener('click',()=>{
      const id=b.dataset.id, a=b.dataset.action;
      let cart=getCart(), idx=cart.findIndex(i=>i.id===id);
      if(idx<0)return;
      if(a==='remove')cart.splice(idx,1);
      if(a==='incr')cart[idx].quantity++;
      if(a==='decr'&&cart[idx].quantity>1)cart[idx].quantity--;
      saveCart(cart);updateCartCount();renderCartItems();
    });
  });
}

// IMAGE CAROUSEL & THUMBNAILS
const images=[], thumbsEl=document.getElementById('thumbnails'), mainImg=document.getElementById('current-image');
let cur=0, li=1;
(function preload(){
  const img=new Image();
  img.src=`product_1/image_${li}.png`;
  img.onload=()=>{
    images.push(img.src);li++;preload();
  };
  img.onerror=()=>{
    if(!images.length)images.push('product_1.png');
    initCarousel();
  };
})();
function initCarousel(){
  mainImg.src=images[0];
  images.forEach((src,i)=>{
    const t=document.createElement('img');
    t.src=src; t.className='thumbnail'+(i===0?' selected':'');
    t.addEventListener('click',()=>{
      cur=i;mainImg.src=images[i];updateThumbs();
    });
    thumbsEl.appendChild(t);
  });
}
function updateThumbs(){
  document.querySelectorAll('.thumbnail').forEach((el,i)=>{
    el.classList.toggle('selected',i===cur);
  });
}

// QUANTITY SPINNER
const qtyInput=document.getElementById('quantity');
document.getElementById('decrease-btn').addEventListener('click',()=>{
  let v=parseInt(qtyInput.value);if(v>1)qtyInput.value=v-1;
});
document.getElementById('increase-btn').addEventListener('click',()=>{
  let v=parseInt(qtyInput.value);qtyInput.value=v+1;
});

// ADD TO CART
document.getElementById('add-to-cart-form').addEventListener('submit',e=>{
  e.preventDefault();
  const d=document.querySelector('.product-details'),
        id=d.dataset.id,name=d.dataset.name,
        price=parseFloat(d.dataset.price),
        qty=parseInt(qtyInput.value);
  let cart=getCart(), idx=cart.findIndex(i=>i.id===id);
  if(idx>-1)cart[idx].quantity+=qty;
  else cart.push({id,name,price,quantity:qty});
  saveCart(cart);updateCartCount();
  showToast(`${qty}× ${name} added to cart`);
});

// ACCOUNT CLICK
document.getElementById('account-link').addEventListener('click',e=>{
  e.preventDefault();alert('Account functionality coming soon.');
});

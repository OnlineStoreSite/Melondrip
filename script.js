// CART STORAGE & COUNT
const CART_KEY = 'nuvora_cart';
const getCart = () => JSON.parse(localStorage.getItem(CART_KEY) || '[]');
const saveCart = c => localStorage.setItem(CART_KEY, JSON.stringify(c));
const updateCartCount = () => {
  const ct = getCart().reduce((s,i) => s + i.quantity, 0);
  document.getElementById('cart-count').textContent = ct;
};
updateCartCount();

// TOAST
function showToast(msg='Added to cart') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.style.opacity = '1';
  setTimeout(() => t.style.opacity = '0', 2000);
}

// CART DRAWER (slides in from right)
const cartModal   = document.getElementById('cart-modal');
const cartContent = cartModal.querySelector('.modal-content');
document.getElementById('cart-link').addEventListener('click', e => {
  e.preventDefault();
  renderCartItems();
  cartModal.classList.add('open');
});
document.getElementById('cart-close').addEventListener('click', () => {
  cartModal.classList.remove('open');
});
window.addEventListener('click', e => {
  if (e.target === cartModal) cartModal.classList.remove('open');
});
document.getElementById('checkout-btn').addEventListener('click', () => {
  window.location.href = 'checkout.html';
});

// RENDER CART ITEMS
function renderCartItems() {
  const container = document.getElementById('cart-items');
  const cart = getCart();
  container.innerHTML = '';
  if (!cart.length) {
    container.innerHTML = '<p>Your cart is empty.</p>';
    document.getElementById('cart-total').textContent = '$0.00';
    return;
  }
  let total = 0;
  cart.forEach(item => {
    total += item.price * item.quantity;
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}"/>
      <div class="cart-item-details">
        <p>${item.name}</p>
        <p>$${item.price.toFixed(2)} each</p>
      </div>
      <div class="quantity-spinner">
        <button data-id="${item.id}" data-action="decr" class="qty-btn">–</button>
        <input type="text" value="${item.quantity}" readonly/>
        <button data-id="${item.id}" data-action="incr" class="qty-btn">+</button>
      </div>
      <button class="remove-btn" data-id="${item.id}" data-action="remove">×</button>
    `;
    container.appendChild(div);
  });
  document.getElementById('cart-total').textContent = `$${total.toFixed(2)}`;

  // bind controls
  container.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      const { id, action } = btn.dataset;
      let cart = getCart();
      const idx = cart.findIndex(i => i.id === id);
      if (idx < 0) return;
      if (action === 'remove') cart.splice(idx,1);
      if (action === 'incr')   cart[idx].quantity++;
      if (action === 'decr' && cart[idx].quantity > 1) cart[idx].quantity--;
      saveCart(cart);
      updateCartCount();
      renderCartItems();
    });
  });
}

// IMAGE CAROUSEL & THUMBNAILS (reused)
const images = [], thumbsEl = document.getElementById('thumbnails'), mainImg = document.getElementById('current-image');
let cur = 0, li = 1;
(function preload(){
  const img = new Image();
  img.src = `product_1/image_${li}.png`;
  img.onload = ()=>{ images.push(img.src); li++; preload(); };
  img.onerror = ()=> {
    if (!images.length) images.push('product_1.png');
    initCarousel();
  };
})();
function initCarousel(){
  mainImg.src = images[0];
  images.forEach((src,i)=>{
    const t = document.createElement('img');
    t.src = src; t.className = 'thumbnail' + (i===0?' selected':'');
    t.addEventListener('click', ()=>{
      cur = i;
      mainImg.src = images[i];
      updateThumbs();
    });
    thumbsEl.appendChild(t);
  });
}
function updateThumbs(){
  document.querySelectorAll('.thumbnail').forEach((el,i)=>{
    el.classList.toggle('selected', i===cur);
  });
}

// QUANTITY SPINNER & ADD TO CART
const qtyInput = document.getElementById('quantity');
document.getElementById('decrease-btn').addEventListener('click', ()=>{
  let v = parseInt(qtyInput.value);
  if (v>1) qtyInput.value = v-1;
});
document.getElementById('increase-btn').addEventListener('click', ()=>{
  let v = parseInt(qtyInput.value);
  qtyInput.value = v+1;
});
document.getElementById('add-to-cart-form').addEventListener('submit', e=>{
  e.preventDefault();
  const details = document.querySelector('.product-details');
  const id   = details.dataset.id;
  const name = details.dataset.name;
  const price= parseFloat(details.dataset.price);
  const img  = details.dataset.image;
  const qty  = parseInt(qtyInput.value);
  let cart = getCart(), idx = cart.findIndex(i=>i.id===id);
  if (idx>-1) cart[idx].quantity += qty;
  else cart.push({ id, name, price, quantity: qty, image: img });
  saveCart(cart);
  updateCartCount();
  showToast(`${qty}× ${name} added to cart`);
});

// LOGO CLICK
document.querySelector('.logo').addEventListener('click', e=>{
  e.preventDefault();
  window.location.href = 'index.html';
});

// ACCOUNT CLICK (placeholder)
document.getElementById('account-link').addEventListener('click', e=>{
  e.preventDefault();
  alert('Account functionality coming soon.');
});

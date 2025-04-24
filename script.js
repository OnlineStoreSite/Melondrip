// — UTIL: Cart in localStorage —
const CART_KEY = 'nuvora_cart';
function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
}
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}
function updateCartCount() {
  const count = getCart().reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById('cart-count').textContent = count;
}
updateCartCount();

// — TOAST —
function showToast(msg='Added to cart') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.style.opacity = '1';
  setTimeout(() => t.style.opacity = '0', 2000);
}

// — CART MODAL HANDLERS —
const cartModal = document.getElementById('cart-modal');
const cartItemsEl = document.getElementById('cart-items');
function openCartModal() {
  renderCartItems();
  cartModal.style.display = 'flex';
}
function closeCartModal() {
  cartModal.style.display = 'none';
}
document.querySelector('.cart-link').addEventListener('click', e => {
  e.preventDefault(); openCartModal();
});
document.getElementById('cart-close').addEventListener('click', closeCartModal);
window.addEventListener('click', e => {
  if (e.target === cartModal) closeCartModal();
});
document.getElementById('checkout-btn').addEventListener('click', () => {
  window.location.href = 'checkout.html';
});

// — RENDER & INTERACT CART ITEMS —
function renderCartItems() {
  const cart = getCart();
  cartItemsEl.innerHTML = '';
  if (cart.length === 0) {
    cartItemsEl.innerHTML = '<p>Your cart is empty.</p>';
    return;
  }
  cart.forEach(item => {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <span>${item.name}</span>
      <div class="cart-qty">
        <button data-action="decr" data-id="${item.id}">–</button>
        <span>${item.quantity}</span>
        <button data-action="incr" data-id="${item.id}">+</button>
      </div>
      <button data-action="remove" data-id="${item.id}" class="remove-btn">×</button>
    `;
    cartItemsEl.appendChild(div);
  });

  // bind buttons
  cartItemsEl.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const action = btn.dataset.action;
      let cart = getCart();
      const idx = cart.findIndex(i => i.id === id);
      if (idx === -1) return;
      if (action === 'remove') {
        cart.splice(idx,1);
      } else if (action === 'incr') {
        cart[idx].quantity++;
      } else if (action === 'decr') {
        if (cart[idx].quantity > 1) cart[idx].quantity--;
      }
      saveCart(cart);
      updateCartCount();
      renderCartItems();
    });
  });
}

// — IMAGE CAROUSEL LOADER —
const images = [];
let currentIndex = 0;
let loadIndex = 1;
(function preload() {
  const img = new Image();
  img.src = `product_1/image_${loadIndex}.png`;
  img.onload = () => {
    images.push(img.src);
    loadIndex++;
    preload();
  };
  img.onerror = () => {
    if (images.length === 0) images.push('product_1.png');
    initCarousel();
  };
})();
function initCarousel() {
  const imgEl = document.getElementById('current-image');
  document.getElementById('prev-btn').addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    imgEl.src = images[currentIndex];
  });
  document.getElementById('next-btn').addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % images.length;
    imgEl.src = images[currentIndex];
  });
}

// — QUANTITY SPINNER —
const qtyInput = document.getElementById('quantity');
document.getElementById('decrease-btn').addEventListener('click', () => {
  let v = parseInt(qtyInput.value);
  if (v > 1) qtyInput.value = v - 1;
});
document.getElementById('increase-btn').addEventListener('click', () => {
  let v = parseInt(qtyInput.value);
  qtyInput.value = v + 1;
});

// — ADD TO CART —
document.getElementById('add-to-cart-form').addEventListener('submit', e => {
  e.preventDefault();
  const details = document.querySelector('.product-details');
  const id = details.dataset.id;
  const name = details.dataset.name;
  const price = parseFloat(details.dataset.price);
  const qty = parseInt(qtyInput.value);
  let cart = getCart();
  const idx = cart.findIndex(i => i.id === id);
  if (idx > -1) {
    cart[idx].quantity += qty;
  } else {
    cart.push({ id, name, price, quantity: qty });
  }
  saveCart(cart);
  updateCartCount();
  showToast(`${qty}× ${name} added to cart`);
});

// — ACCOUNT CLICK (placeholder) —
document.getElementById('account-link').addEventListener('click', e => {
  e.preventDefault();
  alert('Account functionality coming soon.');
});

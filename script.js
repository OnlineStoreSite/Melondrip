// — CART COUNT PERSISTENCE & ICON BOUNCE —
const cartCountEl = document.getElementById('cart-count');
let cartCount = parseInt(localStorage.getItem('cartCount')) || 0;
cartCountEl.textContent = cartCount;

// Add bounce class for a moment
function bounceCart() {
  const cartIcon = document.querySelector('.cart-link');
  cartIcon.classList.add('bounce');
  setTimeout(() => cartIcon.classList.remove('bounce'), 500);
}

// — ADD TO CART EVENT —
document.getElementById('add-to-cart-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const qty = parseInt(document.getElementById('quantity').value) || 1;
  cartCount += qty;
  localStorage.setItem('cartCount', cartCount);
  cartCountEl.textContent = cartCount;
  bounceCart();
  alert(`${qty} x “In de Knup” toegevoegd aan je winkelwagen!`);
});

// — ACCOUNT ICON CLICK —
document.getElementById('account-link').addEventListener('click', function(e) {
  e.preventDefault();
  alert('Accountfunctionaliteit komt hier later.');
});

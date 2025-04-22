// – CART COUNT & LOCALSTORAGE –
const cartCountEl = document.getElementById('cart-count');
let cartCount = parseInt(localStorage.getItem('cartCount')) || 0;
cartCountEl.textContent = cartCount;

// – ADD TO CART EVENT –
document.getElementById('add-to-cart-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const qty = parseInt(document.getElementById('quantity').value) || 1;
  cartCount += qty;
  localStorage.setItem('cartCount', cartCount);
  cartCountEl.textContent = cartCount;
  alert(`${qty} x “In de Knup” toegevoegd aan je winkelwagen!`);
});

// – CART ICON CLICK –
document.querySelector('.cart-link').addEventListener('click', function(e) {
  e.preventDefault();
  if (cartCount > 0) {
    alert(`Je hebt ${cartCount} item(s) in je winkelwagen.`);
  } else {
    alert('Je winkelwagen is leeg.');
  }
});

// – ACCOUNT ICON CLICK –
document.getElementById('account-link').addEventListener('click', function(e) {
  e.preventDefault();
  alert('Accountfunctionaliteit komt hier later.');
});

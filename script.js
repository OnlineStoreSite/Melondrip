// — CART COUNT & BOUNCE —
const cartCountEl = document.getElementById('cart-count');
let cartCount = parseInt(localStorage.getItem('cartCount')) || 0;
cartCountEl.textContent = cartCount;
function bounceCart() {
  const cartIcon = document.querySelector('.cart-link');
  cartIcon.classList.add('bounce');
  setTimeout(() => cartIcon.classList.remove('bounce'), 500);
}

// — IMAGE CAROUSEL LOADER —
const images = [];
let currentIndex = 0;
let loadIndex = 1;

(function preload() {
  const testImg = new Image();
  testImg.src = `product_1/image_${loadIndex}.png`;
  testImg.onload = () => {
    images.push(testImg.src);
    loadIndex++;
    preload();
  };
  testImg.onerror = () => {
    if (images.length === 0) {
      // No extra images: use main product_1.png
      images.push('product_1.png');
    }
    initCarousel();
  };
})();

function initCarousel() {
  const imgEl = document.getElementById('current-image');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');

  function updateImage() {
    imgEl.src = images[currentIndex];
  }

  prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateImage();
  });
  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % images.length;
    updateImage();
  });

  updateImage();
}

// — QUANTITY SPINNER —
const qtyInput = document.getElementById('quantity');
document.getElementById('decrease-btn').addEventListener('click', () => {
  let val = parseInt(qtyInput.value);
  if (val > 1) qtyInput.value = val - 1;
});
document.getElementById('increase-btn').addEventListener('click', () => {
  let val = parseInt(qtyInput.value);
  qtyInput.value = val + 1;
});

// — ADD TO CART —
document.getElementById('add-to-cart-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const qty = parseInt(qtyInput.value) || 1;
  cartCount += qty;
  localStorage.setItem('cartCount', cartCount);
  cartCountEl.textContent = cartCount;
  bounceCart();
  alert(`${qty} × Product 1 added to cart!`);
});

// — ACCOUNT CLICK (placeholder) —
document.getElementById('account-link').addEventListener('click', (e) => {
  e.preventDefault();
  alert('Account functionality coming soon.');
});

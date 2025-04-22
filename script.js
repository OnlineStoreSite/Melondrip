document.getElementById('add-to-cart-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const qty = document.getElementById('quantity').value;
  alert(`${qty} x “In de Knup” toegevoegd aan je winkelwagen!`);
  // Later: you can replace this with real cart logic (e.g., localStorage or API calls)
});


/* ---------- CART LOGIC ---------- */
const KEY='melondrip_cart';
const read=()=>JSON.parse(localStorage.getItem(KEY)||'[]');
const save=c=>localStorage.setItem(KEY,JSON.stringify(c));
const badge=document.getElementById('cart-count');
const refresh=()=>badge&&(badge.textContent=read().reduce((s,i)=>s+i.quantity,0));
refresh();

/* ---------- DRAWER ---------- */
const drawer=document.getElementById('cart-modal');
if(drawer){
  const list = drawer.querySelector('#cart-items'),
        total= drawer.querySelector('#cart-total');
  const open = ()=>{build();drawer.classList.add('open');};
  const close= ()=>drawer.classList.remove('open');
  document.getElementById('cart-link').onclick=e=>{e.preventDefault();open();};
  document.getElementById('cart-close').onclick=close;
  window.onclick=e=>{if(e.target===drawer)close();};
  document.getElementById('checkout-btn').onclick=()=>location='checkout.html';

  function build(){
    const cart=read();list.innerHTML='';
    if(!cart.length){list.innerHTML='<p>Your cart is empty.</p>';total.textContent='$0.00';return;}
    let sum=0;cart.forEach(i=>{
      sum+=i.price*i.quantity;
      const row=document.createElement('div');row.className='cart-item';row.innerHTML=`
        <img src="${i.image}" alt="${i.name}">
        <div style="flex:1"><p>${i.name}</p><p>$${i.price.toFixed(2)} ea</p></div>
        <div class="quantity-spinner">
          <button data-id="${i.id}" data-a="dec" class="qty-btn">–</button>
          <input readonly value="${i.quantity}">
          <button data-id="${i.id}" data-a="inc" class="qty-btn">+</button>
        </div>
        <button data-id="${i.id}" data-a="del" class="remove-btn">×</button>`;
      list.append(row);
    });
    total.textContent=`$${sum.toFixed(2)}`;
    list.querySelectorAll('button').forEach(b=>b.onclick=()=>{
      let cart=read();const idx=cart.findIndex(x=>x.id===b.dataset.id);
      if(idx<0)return;
      if(b.dataset.a==='inc')cart[idx].quantity++;
      if(b.dataset.a==='dec'&&cart[idx].quantity>1)cart[idx].quantity--;
      if(b.dataset.a==='del')cart.splice(idx,1);
      save(cart);refresh();build();
    });
  }
}

/* ---------- PRODUCT PAGE ---------- */
const qInput=document.getElementById('quantity');
if(qInput){
  document.getElementById('decrease-btn').onclick=()=>{const v=+qInput.value;if(v>1)qInput.value=v-1;};
  document.getElementById('increase-btn').onclick=()=>qInput.value=+qInput.value+1;
  document.getElementById('add-to-cart-form').onsubmit=e=>{
    e.preventDefault();
    const box=document.querySelector('.product-details');
    const {id,name,image}=box.dataset, price=+box.dataset.price, qty=+qInput.value;
    const cart=read();const i=cart.findIndex(x=>x.id===id);
    i>-1?cart[i].quantity+=qty:cart.push({id,name,price,quantity:qty,image});
    save(cart);refresh();toast(`${qty}× ${name} added`);
  };

  /* thumbnails */
  const main=document.getElementById('current-image'), thumbs=document.getElementById('thumbnails'), imgs=[];
  let n=1;(function load(){const im=new Image();im.src=`product_1/image_${n}.png`;im.onload=()=>{imgs.push(im.src);n++;load();};im.onerror=()=>{if(!imgs.length)imgs.push('product_1.png');start();};})();
  function start(){main.src=imgs[0];imgs.forEach((src,i)=>{const t=document.createElement('img');t.src=src;t.className='thumbnail'+(!i?' selected':'');t.onclick=()=>{main.src=src;thumbs.querySelectorAll('img').forEach(el=>el.classList.remove('selected'));t.classList.add('selected');};thumbs.append(t);});}
}

/* ---------- TOAST ---------- */
function toast(msg){const t=document.getElementById('toast');if(!t)return;t.textContent=msg;t.style.opacity=1;setTimeout(()=>t.style.opacity=0,2e3);}

/* ---------- ACCOUNT PLACEHOLDER ---------- */
const acc=document.getElementById('account-link');acc&& (acc.onclick=e=>{e.preventDefault();alert('Account feature coming soon.');});

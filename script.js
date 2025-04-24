/* ---------- helpers ---------- */
const KEY='melondrip_cart';
const $=(sel,par=document)=>par.querySelector(sel);
const $$=(sel,par=document)=>par.querySelectorAll(sel);
const cart=()=>JSON.parse(localStorage.getItem(KEY)||'[]');
const save=c=>localStorage.setItem(KEY,JSON.stringify(c));
const tally=()=>$('#cart-count').textContent=cart().reduce((s,i)=>s+i.quantity,0);
tally();

/* ---------- toast ---------- */
const toast=(msg)=>{const t=$('#toast');t.textContent=msg;t.style.opacity=1;setTimeout(()=>t.style.opacity=0,2e3)};

/* ---------- cart drawer ---------- */
const drawer=$('.cart-backdrop');
if(drawer){
  $('#cart-link').onclick=e=>{e.preventDefault();render();drawer.classList.add('open')};
  $('#cart-close').onclick=()=>drawer.classList.remove('open');
  drawer.onclick=e=>{if(e.target===drawer)drawer.classList.remove('open')};
  $('#checkout-btn').onclick=()=>location='checkout.html';
}
function render(){
  const wrap=$('#cart-items');const total=$('#cart-total');const c=cart();wrap.innerHTML='';
  if(!c.length){wrap.innerHTML='<p>Your cart is empty.</p>';total.textContent='$0.00';return;}
  let sum=0;c.forEach(i=>{
    sum+=i.price*i.quantity;
    const row=document.createElement('div');row.className='item';
    row.innerHTML=`
      <img src="${i.image}" alt="${i.name}">
      <div><h4>${i.name}</h4><span>$${i.price.toFixed(2)}</span></div>
      <div class="spinner">
        <button data-id="${i.id}" data-a="dec">−</button>
        <input value="${i.quantity}" readonly>
        <button data-id="${i.id}" data-a="inc">＋</button>
      </div>
      <button class="remove" data-id="${i.id}" data-a="del">×</button>`;
    wrap.append(row);
  });
  total.textContent=`$${sum.toFixed(2)}`;
  wrap.querySelectorAll('button').forEach(b=>b.onclick=()=>{let c=cart();const id=b.dataset.id;const act=b.dataset.a;const i=c.findIndex(x=>x.id===id);if(i<0)return;if(act==='inc')c[i].quantity++;if(act==='dec'&&c[i].quantity>1)c[i].quantity--;if(act==='del')c.splice(i,1);save(c);tally();render();});
}

/* ---------- gallery & add-to-cart (product page) ---------- */
if($('#add-form')){
  const qty=$('#qty');
  $('#minus').onclick=()=>{if(+qty.value>1)qty.value--;
  };
  $('#plus').onclick=()=>qty.value++;
  $('#add-form').onsubmit=e=>{
    e.preventDefault();
    const box=$('.details');const {id,name,image}=box.dataset;const price=+box.dataset.price;const n=+qty.value;
    let c=cart();const i=c.findIndex(x=>x.id===id);i>-1?c[i].quantity+=n:c.push({id,name,image,price,quantity:n});
    save(c);tally();toast(`${n} × ${name} added`);
  };

  /* thumbnails */
  const main=$('#main-img'), thumbs=$('#thumbs');const imgs=[];
  let k=1;(function load(){const im=new Image();im.src=`product_1/image_${k}.png`;im.onload=()=>{imgs.push(im.src);k++;load();};im.onerror=()=>{if(!imgs.length)imgs.push('product_1/image_1.png');start();};})();
  function start(){main.src=imgs[0];imgs.forEach((src,i)=>{const t=document.createElement('img');t.src=src;i||t.classList.add('selected');t.onclick=()=>{$$('#thumbs img').forEach(el=>el.classList.remove('selected'));t.classList.add('selected');main.src=src;};thumbs.append(t);});}
}

/* ---------- placeholder ---------- */
$('#account-link')&&($('#account-link').onclick=e=>{e.preventDefault();alert('Account portal coming soon');});

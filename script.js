/* ========== STORAGE HELPERS ========== */
const KEY='melondrip_cart';
const get=()=>JSON.parse(localStorage.getItem(KEY)||'[]');
const set=c=>localStorage.setItem(KEY,JSON.stringify(c));
const updateBadge=()=>document.getElementById('cart-count').textContent=get().reduce((s,i)=>s+i.quantity,0);
updateBadge();

/* ========== TOAST ========== */
const toast=msg=>{const t=document.getElementById('toast');t.textContent=msg;t.style.opacity=1;setTimeout(()=>t.style.opacity=0,2e3)};

/* ========== DRAWER ========== */
const backdrop=document.getElementById('cart-backdrop');
if(backdrop){
  document.getElementById('cart-link').onclick=e=>{e.preventDefault();renderDrawer();backdrop.classList.add('open');};
  document.getElementById('drawer-close').onclick=()=>backdrop.classList.remove('open');
  backdrop.onclick=e=>{if(e.target===backdrop)backdrop.classList.remove('open');};
  document.getElementById('to-checkout').onclick=()=>location='checkout.html';
}
function renderDrawer(){
  const list=document.getElementById('drawer-items');const total=document.getElementById('drawer-total');
  const items=get();list.innerHTML='';if(!items.length){list.innerHTML='<p>Your cart is empty.</p>';total.textContent='$0.00';return;}
  let sum=0;items.forEach(it=>{
    sum+=it.price*it.quantity;
    const row=document.createElement('div');row.className='item';row.innerHTML=`
      <img src="${it.image}" alt="${it.name}">
      <div><h4>${it.name}</h4><span>$${it.price.toFixed(2)}</span></div>
      <div class="spin">
        <button data-id="${it.id}" data-a="dec">−</button>
        <input value="${it.quantity}" readonly>
        <button data-id="${it.id}" data-a="inc">+</button>
      </div>
      <button class="remove" data-id="${it.id}" data-a="del">×</button>`;
    list.append(row);
  });
  total.textContent=`$${sum.toFixed(2)}`;
  list.querySelectorAll('button').forEach(btn=>btn.onclick=()=>{let c=get();const i=c.findIndex(x=>x.id===btn.dataset.id);if(i<0)return;
    if(btn.dataset.a==='inc')c[i].quantity++;if(btn.dataset.a==='dec'&&c[i].quantity>1)c[i].quantity--;if(btn.dataset.a==='del')c.splice(i,1);
    set(c);updateBadge();renderDrawer();});
}

/* ========== PRODUCT PAGE ========= */
if(document.getElementById('add-form')){
  const qty=document.getElementById('qty');
  document.getElementById('minus').onclick=()=>{if(+qty.value>1)qty.value--};
  document.getElementById('plus').onclick=()=>qty.value++;
  document.getElementById('add-form').onsubmit=e=>{
    e.preventDefault();
    const box=document.querySelector('.info');const {id,name,image,price}=box.dataset;
    let c=get();const i=c.findIndex(x=>x.id===id);i>-1?c[i].quantity+=+qty.value:c.push({id,name,image,price:+price,quantity:+qty.value});
    set(c);updateBadge();toast(`${qty.value} × ${name} added`);
  };
  /* gallery */
  const main=document.getElementById('main-img'), thumbs=document.getElementById('thumb-row'), arr=[];
  let n=1;(function load(){const im=new Image();im.src=`product_1/image_${n}.png`;im.onload=()=>{arr.push(im.src);n++;load();};im.onerror=()=>{if(!arr.length)arr.push('product_1/image_1.png');init();};})();
  function init(){main.src=arr[0];arr.forEach((src,i)=>{const t=document.createElement('img');t.src=src;i||t.classList.add('selected');t.onclick=()=>{$$('#thumb-row img').forEach(el=>el.classList.remove('selected'));t.classList.add('selected');main.src=src;};thumbs.append(t);});}
}

/* ========== ACCOUNT PLACEHOLDER ========= */
const acc=document.getElementById('account-link');acc&&(acc.onclick=e=>{e.preventDefault();alert('Account dashboard coming soon');});

/* === AUDIO === */
const audio=document.getElementById('bg'),
      play=document.getElementById('play'),
      vol=document.getElementById('vol'),
      playIcon=document.getElementById('icon-play');

let playing=false;
const toggle=()=>{
  if(!playing){audio.play().catch(()=>{});}else{audio.pause();}
};
play.onclick=toggle;
audio.onplay=()=>{playing=true;playIcon.innerHTML='<rect x="6" y="4" width="3" height="16" fill="#fff"></rect><rect x="15" y="4" width="3" height="16" fill="#fff"></rect>';};
audio.onpause=()=>{playing=false;playIcon.innerHTML='<polygon points="6,4 20,12 6,20" fill="#fff"></polygon>';};
vol.oninput=e=>audio.volume=e.target.value;

/* === FLOATING SEEDS === */
const seeds=document.querySelector('.seeds');
for(let i=0;i<24;i++){
  const s=document.createElement('span');
  s.textContent='🍉';
  s.style.left=Math.random()*100+'vw';
  s.style.animationDelay=Math.random()*18+'s';
  s.style.opacity=Math.random()*.4+.3;
  seeds.append(s);
}

/* === Parallax === */
window.addEventListener('scroll',()=>{
  const y=scrollY;
  document.querySelectorAll('.layer').forEach(el=>{
    el.style.transform=`translateY(${y*0.2}px)`;
  });
});

/* === Scroll Reveal === */
const revealEls=document.querySelectorAll('.reveal');
const io=new IntersectionObserver((entries)=>entries.forEach(e=>e.isIntersecting&&e.target.classList.add('visible')),{threshold:.15});
revealEls.forEach(el=>io.observe(el));

/* === Dummy cart badge === */
document.getElementById('cart-count').textContent='0';

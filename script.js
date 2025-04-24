/* ------------ AUDIO CONTROL ------------ */
const audio=document.getElementById('bgm');
const btn=document.getElementById('sound-btn');
const cross=document.getElementById('icon-cross');
const vol=document.getElementById('vol');
let playing=false;

btn.onclick=()=>{
  playing?audio.pause():audio.play().catch(()=>{});  // ignore autoplay fail
};
audio.onplay =()=>{playing=true;cross.setAttribute('stroke','none');};
audio.onpause=()=>{playing=false;cross.setAttribute('stroke','#fff');};
vol.oninput =e=>{audio.volume=e.target.value};

/* ------------ FLOATING SEEDS ------------ */
const seeds=document.querySelector('.seeds');
for(let i=0;i<20;i++){
  const s=document.createElement('span');
  s.textContent='🍉';
  s.style.left=Math.random()*100+'vw';
  s.style.animationDelay=Math.random()*15+'s';
  s.style.opacity=Math.random()*.4+.3;
  seeds.append(s);
}

/* ------------ PARALLAX ------------ */
window.addEventListener('scroll',()=>{
  const y=window.scrollY;
  document.querySelectorAll('.layer').forEach(el=>{
    el.style.transform=`translateY(${y*0.2}px)`;    // subtle parallax
  });
});

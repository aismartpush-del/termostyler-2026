
(()=>{
"use strict";
const nav=document.querySelector('.navigation'),menu=document.querySelector('.menu-toggle');
function closeMenu(){nav.classList.remove('is-open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','פתיחת תפריט');}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';nav.classList.toggle('is-open',open);menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'סגירת תפריט':'פתיחת תפריט');});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeMenu();}});
document.addEventListener('click',e=>{if(!e.target.closest('header'))closeMenu();});
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const instances=[];
document.querySelectorAll('[data-slider]').forEach(root=>{
const slides=[...root.querySelectorAll('.slide')],dotBox=root.querySelector('.slider-dots'),pause=root.querySelector('[data-pause]');
let index=0,userPaused=reduced.matches,visible=false,hover=false,focused=false,timer=null,startX=null;
const dots=slides.map((_,i)=>{const dot=document.createElement('button');dot.type='button';dot.setAttribute('aria-label','תמונה '+(i+1));dot.addEventListener('click',()=>{show(i);schedule();});dotBox.append(dot);return dot;});
function show(next){index=(next+slides.length)%slides.length;slides.forEach((slide,i)=>{slide.classList.toggle('is-active',i===index);slide.setAttribute('aria-hidden',String(i!==index));});dots.forEach((dot,i)=>dot.setAttribute('aria-current',String(i===index)));root.dataset.active=String(index+1);}
function schedule(){clearTimeout(timer);if(!userPaused&&visible&&!document.hidden&&!hover&&!focused)timer=setTimeout(()=>{show(index+1);schedule();},Number(root.dataset.interval)||6000);}
function updatePause(){pause.setAttribute('aria-label',userPaused?'הפעלת החלפת תמונות':'השהיית החלפת תמונות');pause.setAttribute('aria-pressed',String(userPaused));pause.innerHTML=userPaused?'<svg class="icon " viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m8 4 11 8-11 8Z"/></svg>':'<svg class="icon " viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M9 5v14M15 5v14"/></svg>';}
root.querySelector('[data-prev]').addEventListener('click',()=>{show(index-1);schedule();});
root.querySelector('[data-next]').addEventListener('click',()=>{show(index+1);schedule();});
pause.addEventListener('click',()=>{userPaused=!userPaused;updatePause();schedule();});
root.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'){hover=true;schedule();}});root.addEventListener('pointerleave',()=>{hover=false;schedule();});
root.addEventListener('focusin',e=>{focused=e.target.matches(':focus-visible');schedule();});root.addEventListener('focusout',e=>{focused=!!e.relatedTarget&&root.contains(e.relatedTarget)&&e.relatedTarget.matches(':focus-visible');schedule();});
const surface=root.querySelector('.crossfade');
surface.addEventListener('touchstart',e=>{startX=e.changedTouches[0].clientX;},{passive:true});
surface.addEventListener('touchend',e=>{if(startX!==null){const delta=e.changedTouches[0].clientX-startX;if(Math.abs(delta)>45){show(index+(delta<0?1:-1));schedule();}startX=null;}},{passive:true});
root.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();show(index+(e.key==='ArrowLeft'?1:-1));schedule();}});
new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;schedule();},{threshold:.2}).observe(root);
document.addEventListener('visibilitychange',schedule);
reduced.addEventListener('change',e=>{if(e.matches){userPaused=true;updatePause();schedule();}});
show(0);updatePause();instances.push({schedule});
});
})();

(()=>{const root=document.querySelector('[data-catalog]');if(!root)return;const cards=[...root.querySelectorAll('.catalog-card')],search=root.querySelector('[data-search]'),more=root.querySelector('[data-more]'),status=root.querySelector('[data-status]'),empty=root.querySelector('[data-empty]');let limit=12;
function update(){const query=search.value.trim().toLocaleLowerCase('he');const matches=cards.filter(card=>card.dataset.name.includes(query));const allowed=new Set(matches.slice(0,limit));cards.forEach(card=>card.hidden=!allowed.has(card));more.hidden=matches.length<=limit;empty.hidden=matches.length>0;status.textContent=matches.length+' מוצרים';}
search.addEventListener('input',()=>{limit=12;update();});more.addEventListener('click',()=>{const shown=cards.filter(c=>!c.hidden).length;limit+=12;update();const now=cards.filter(c=>!c.hidden);if(now[shown]){const link=now[shown].querySelector('a');link.focus({preventScroll:true});now[shown].scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});}});update();})();

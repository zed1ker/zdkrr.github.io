'use strict';
(() => {
 const c = window.SITE_CONFIG || {};
 const $ = s => document.querySelector(s);
 const number = value => { const p = String(value || '').replace(/[\s()\-]/g,''); return /^\+\d{10,15}$/.test(p) ? p : ''; };
 function phoneLink(slot, text, num, className = '') {
  if (!text || !number(num)) return false;
  const a = document.createElement('a'); a.href = 'tel:' + number(num); a.textContent = text; a.className = className; $(slot).replaceChildren(a); return true;
 }
 const mainPhone = phoneLink('#phone-slot',c.phoneDisplay,c.phoneLink,'phone-link');
 if (mainPhone) $('#phone-hint').textContent = 'Позвоните, чтобы обсудить вашу задачу.';
 const footerPhone = c.footerPhoneDisplay || c.phoneDisplay;
 const footerNum = c.footerPhoneLink || c.phoneLink;
 phoneLink('#footer-phone',footerPhone,footerNum);
 const email = String(c.footerEmail || '').trim();
 if (/^[A-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email) && !/\s/.test(email)) {
  const a = document.createElement('a'); a.href = 'mailto:' + email; a.textContent = email; $('#footer-email').replaceChildren(a);
 }
 function messenger(key,hosts,slot,hint,label,cls='') {
  let u; try { u = new URL(String(c[key] || '')); } catch { return false; }
  if (u.protocol !== 'https:' || !hosts.includes(u.hostname) || u.username || u.password || u.port || u.pathname==='/') return false;
  const a = document.createElement('a'); a.href=u.href;a.textContent=label+' ↗'; a.className='button messenger-button '+cls;a.target='_blank';a.rel='noopener noreferrer';
  $(slot).replaceChildren(a);$(hint).textContent='Откроется внешний сайт мессенджера.';return true;
 }
 messenger('telegramUrl',['t.me','telegram.me'],'#telegram-slot','#telegram-hint','Написать в Telegram');
 messenger('maxUrl',['max.ru','web.max.ru'],'#max-slot','#max-hint','Написать в MAX','max-button');
 const info=c.performer || {};const fields=[['name','Исполнитель'],['status','Статус'],['address','Адрес'],['registration','Регистрация'],['inn','ИНН'],['workingDays','Дни работы']];
 if (fields.some(([key])=>info[key])) {
  $('#performer-info').replaceChildren(); fields.forEach(([key,label])=>{if(info[key]){const p=document.createElement('p');p.textContent=label+': '+info[key];$('#performer-info').append(p);}});
 }
 if(mainPhone && email && info.name && info.status && info.address && info.workingDays){
  $('#draft-note').textContent='Стоимость и сроки конкретного заказа согласуются индивидуально до начала работы.';
 }
 const defaultSlides=[1,2,3].map(n=>({src:'',title:'Фото работы № '+n,alt:''}));
 const slides=Array.isArray(c.photos)&&c.photos.length ? c.photos.filter(p=>p&&typeof p==='object') : defaultSlides;
 if(!slides.length)slides.push(defaultSlides[0]);let current=0;
 const stage=$('#carousel-stage');const region=$('.carousel');
 function placeholder(message='ФОТО СКОРО ПОЯВИТСЯ',note='Место для будущей работы'){
  const box=document.createElement('div');box.className='photo-placeholder';
  const plus=document.createElement('span');plus.textContent='＋';plus.setAttribute('aria-hidden','true');
  const title=document.createElement('p');title.textContent=message;const sub=document.createElement('small');sub.textContent=note;box.append(plus,title,sub);stage.replaceChildren(box);
 }
 const dots=slides.map((slide,i)=>{const b=document.createElement('button');b.type='button';b.setAttribute('aria-label','Показать фото '+(i+1));b.addEventListener('click',()=>show(i));$('#carousel-dots').append(b);return b;});
 function show(i){
  current=(i+slides.length)%slides.length;const s=slides[current];stage.replaceChildren();
  const src=String(s.src||'');
  if(/^photos\/[a-zA-Z0-9_\-./]+\.(jpe?g|png|webp|avif)$/i.test(src)&&!src.includes('..')){
   const img=document.createElement('img');img.src=src;img.alt=s.alt||s.title||'Фотография работы';img.addEventListener('error',()=>placeholder('ФОТО НЕ НАЙДЕНО','Проверьте имя файла в photos и путь в config.js'),{once:true});stage.append(img);
  }else placeholder();
  $('#slide-title').textContent=s.title||'Фото работы № '+(current+1);
  $('#slide-counter').textContent=String(current+1).padStart(2,'0')+' / '+String(slides.length).padStart(2,'0');
  dots.forEach((dot,j)=>dot.setAttribute('aria-current',String(j===current)));
  stage.classList.remove('swap-in');void stage.offsetWidth;stage.classList.add('swap-in');
  $('#slide-prev').disabled=$('#slide-next').disabled=slides.length<2;
 }
 $('#slide-prev').addEventListener('click',()=>show(current-1));$('#slide-next').addEventListener('click',()=>show(current+1));
 region.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();show(current-1);}if(e.key==='ArrowRight'){e.preventDefault();show(current+1);}});
 let startX=0,startY=0;stage.addEventListener('touchstart',e=>{startX=e.changedTouches[0].clientX;startY=e.changedTouches[0].clientY;},{passive:true});stage.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-startX,dy=e.changedTouches[0].clientY-startY;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy))show(current+(dx<0?1:-1));},{passive:true});
 show(0);
 if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches&&'IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.remove('pending');observer.unobserve(entry.target);}}),{threshold:0.08});
  document.querySelectorAll('.section-heading,.service-card,.approach>div,.steps li,.contact-grid>div').forEach((el,i)=>{el.classList.add('reveal');if(el.getBoundingClientRect().top>innerHeight){el.classList.add('pending');}el.style.transitionDelay=(i%3)*55+'ms';observer.observe(el);});
 }
})();

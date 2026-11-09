// Основные настройки шаблона. Заполните реальными данными перед публикацией.
const config={brand:'Название проекта',service:'Название услуги',unit:'услуга',url:'',email:'hello@example.com',publish:false,plans:[['Базовый',1000,['Состав пакета: пункт 1','Состав пакета: пункт 2']],['Стандартный',2000,['Всё из базового пакета','Дополнительная возможность']],['Расширенный',3000,['Всё из стандартного пакета','Расширенный состав работ']]],faq:[['Вопрос об услуге','Опишите, что получает клиент и какие условия нужно учитывать.'],['Вопрос о сроках','Укажите реальные сроки и факторы, влияющие на них.'],['Вопрос об оплате','Опишите способы и порядок оплаты.'],['Как начать работу?','Объясните первый шаг и необходимые данные.']]};
document.querySelector('#plans').innerHTML=config.plans.map((p,i)=>`<article class="plan ${i===1?'featured':''}"><small>${i===1?'РЕКОМЕНДУЕМ':'0'+(i+1)+' / ФОРМАТ'}</small><h3>${p[0]}</h3><div class="price">${p[1].toLocaleString('ru-RU')} ₽ <span>/ ${config.unit}</span></div><ul>${p[2].map(f=>`<li>${f}</li>`).join('')}</ul><a class="button" href="mailto:${config.email}?subject=${encodeURIComponent('Тариф '+p[0])}">Обсудить тариф</a></article>`).join('');
document.querySelector('#questions').innerHTML=config.faq.map(([q,a])=>`<details><summary>${q}</summary><p>${a}</p></details>`).join('');
// Анимируем нативные details, сохраняя управление с клавиатуры.
document.querySelectorAll('#questions details').forEach(details=>{
 const summary=details.querySelector('summary');
 const answer=document.createElement('div');answer.className='faq-answer';
 while(summary.nextSibling)answer.append(summary.nextSibling);
 details.append(answer);
 let animation=null;
 let expanded=details.open;
 summary.addEventListener('click',event=>{
  event.preventDefault();expanded=!expanded;
  const from=details.getBoundingClientRect().height;
  if(animation){animation.cancel();animation=null;}
  details.open=true;
  details.classList.toggle('is-expanded',expanded);
  const to=expanded?details.getBoundingClientRect().height:summary.getBoundingClientRect().height+48+1;
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){details.open=expanded;return;}
  details.style.overflow='hidden';
  animation=details.animate([{height:from+'px'},{height:to+'px'}],{duration:360,easing:'cubic-bezier(.22,1,.36,1)'});
  animation.onfinish=()=>{details.open=expanded;details.style.overflow='';animation=null;};
 });
});
const projects=[['Название примера № 1',''],['Название примера № 2',''],['Название примера № 3','']];
const image=document.querySelector('#project-image');
const frame=document.createElement('div');frame.className='slider-frame';image.before(frame);frame.append(image);
const dots=document.createElement('div');dots.className='slider-dots';dots.setAttribute('role','group');dots.setAttribute('aria-label','Выбор слайда');frame.after(dots);
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
let current=0, sequence=0;
const buttons=projects.map((p,i)=>{const button=document.createElement('button');button.type='button';button.setAttribute('aria-label','Слайд '+(i+1));button.onclick=()=>show(i,i>current?1:-1);dots.append(button);return button;});
async function show(index,direction=1){
 index=(index+projects.length)%projects.length;
 if(index===current&&image.src)return;
 const ticket=++sequence;
 const incoming=new Image();incoming.src=projects[index][1]||'assets/placeholder.svg';
 try{await incoming.decode();}catch{return;}
 if(ticket!==sequence)return;
 frame.querySelectorAll('.slide-outgoing').forEach(el=>el.remove());
 const previous=image.cloneNode();previous.removeAttribute('id');previous.alt='';previous.setAttribute('aria-hidden','true');previous.className='slide-outgoing';frame.append(previous);
 current=index;image.src=incoming.src;image.alt=projects[index][0]+' — место для изображения';
 const title=document.querySelector('#project-title');title.textContent=projects[index][0];
 document.querySelector('#counter').textContent=String(index+1).padStart(2,'0')+' / '+String(projects.length).padStart(2,'0');
 buttons.forEach((button,i)=>button.setAttribute('aria-current',String(i===index)));
 image.getAnimations().forEach(a=>a.cancel());title.getAnimations().forEach(a=>a.cancel());
 if(reduced.matches){previous.remove();return;}
 const timing={duration:650,easing:'cubic-bezier(.22,1,.36,1)'};
 image.animate([{opacity:0,transform:'translateX('+direction*5+'%) scale(1.035)'},{opacity:1,transform:'translateX(0) scale(1)'}],timing);
 previous.animate([{opacity:1,transform:'translateX(0)'},{opacity:0,transform:'translateX('+direction*-5+'%)'}],timing).finished.then(()=>previous.remove()).catch(()=>previous.remove());
 title.animate([{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],{...timing,duration:450});
}
 document.querySelector('#prev').onclick=()=>show(current-1,-1);
 document.querySelector('#next').onclick=()=>show(current+1,1);
 frame.tabIndex=0;frame.setAttribute('role','group');frame.setAttribute('aria-label','Слайдер примеров. Используйте стрелки влево и вправо');
 frame.onkeydown=e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();const d=e.key==='ArrowRight'?1:-1;show(current+d,d);}};
 let touchStart=null;
 frame.addEventListener('touchstart',e=>{touchStart={x:e.changedTouches[0].clientX,y:e.changedTouches[0].clientY};},{passive:true});
 frame.addEventListener('touchend',e=>{if(!touchStart)return;const dx=e.changedTouches[0].clientX-touchStart.x,dy=e.changedTouches[0].clientY-touchStart.y;touchStart=null;if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)){const d=dx<0?1:-1;show(current+d,d);}},{passive:true});
 show(0);
if(config.publish&&config.url){document.querySelector('meta[name="robots"]').content='index,follow';const canonical=document.createElement('link');canonical.rel='canonical';canonical.href=config.url;document.head.append(canonical);const schema=document.createElement('script');schema.type='application/ld+json';schema.textContent=JSON.stringify({'@context':'https://schema.org','@graph':[{'@type':'Organization','@id':config.url+'#organization',name:config.brand,url:config.url,email:config.email},{'@type':'WebSite',url:config.url,name:config.brand},{'@type':'Service',name:config.service,provider:{'@id':config.url+'#organization'},offers:config.plans.map(p=>({'@type':'Offer',name:p[0],price:p[1],priceCurrency:'RUB',url:config.url+'#pricing',priceSpecification:{'@type':'UnitPriceSpecification',price:p[1],priceCurrency:'RUB',unitText:config.unit}}))},{'@type':'FAQPage',mainEntity:config.faq.map(([q,a])=>({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}))}]});document.head.append(schema);}

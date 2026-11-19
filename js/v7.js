'use strict';
// Immersive city story: all scenes and captions are authored locally. No server, tracking or fake VR claims.
(()=>{
 const scenes=[
  {id:'chorsu',name:'Чорсу',img:'assets/places/chorsu.webp',desc:'Пойдём туда, где утро начинается с ароматов специй, свежего нона и разговоров торговцев. Базар — это настоящий ритм города.',tip:'Попробуй: самсу, лепёшку и сухофрукты. Уточни цену и спроси разрешение на фото.'},
  {id:'besh',name:'Большой казан',img:'assets/places/besh.webp',desc:'Плов готовят здесь большими порциями, а аромат зиры и горячего риса наполняет воздух. Из этой истории хочется сразу отправиться на обед.',tip:'Попробуй: ташкентский плов с ачичуком. Лучше приходить к обеду.'},
  {id:'applied',name:'Узоры и традиции',img:'assets/places/applied.webp',desc:'Керамика, дерево и сузани хранят рассказы мастеров. Даже форма чашки и украшение стола становятся частью путешествия.',tip:'Обрати внимание на майолику и вышивку; уточни правила фотосъёмки.'},
  {id:'city',name:'Огни Ташкента',img:'assets/places/city.webp',desc:'После заката фонари отражаются в воде, открываются кафе, и шумный город становится мягче. Красивое завершение гастрономического дня.',tip:'Заверши прогулку чаем и десертом. Уточни часы работы заведений.'}
 ];
 const $=(s,r=document)=>r.querySelector(s);
 let current=0;
 function init(){
  const dlg=$('#v7-experience-dialog'),stage=$('#v7-experience-stage');if(!dlg||!stage)return;
  const open=()=>{render(0);dlg.showModal()};
  $('#v7-experience-open')?.addEventListener('click',open);
  $('#v7-experience-preview')?.addEventListener('click',open);
  $('#v7-experience-close')?.addEventListener('click',()=>dlg.close());
  dlg.addEventListener('click',e=>{if(e.target===dlg)dlg.close()});
  $('#v7-story-next')?.addEventListener('click',()=>render((current+1)%scenes.length));
  $('#v7-story-place')?.addEventListener('click',()=>{const id=scenes[current].id;dlg.close();if(window.TasteExplorer?.showPlace)window.TasteExplorer.showPlace(id);else $('#planner')?.scrollIntoView({behavior:'smooth'});});
  dlg.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();render((current+1)%scenes.length)}if(e.key==='ArrowLeft'){e.preventDefault();render((current-1+scenes.length)%scenes.length)}});
  stage.addEventListener('pointermove',e=>{if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;const r=stage.getBoundingClientRect();const x=(e.clientX-r.left-r.width/2)/r.width,y=(e.clientY-r.top-r.height/2)/r.height;stage.style.setProperty('--px',(-15*x).toFixed(1)+'px');stage.style.setProperty('--py',(-12*y).toFixed(1)+'px')});
  stage.addEventListener('pointerleave',()=>{stage.style.setProperty('--px','0px');stage.style.setProperty('--py','0px')});
 }
 function render(i){current=i;const s=scenes[i];$('#v7-experience-image').style.backgroundImage=`url('${s.img}')`;$('#v7-story-title').textContent=s.name;$('#v7-story-desc').textContent=s.desc;$('#v7-story-tip').textContent='✳ '+s.tip;$('#v7-story-number').textContent=String(i+1).padStart(2,'0')+' / 04';$('#v7-experience-progress').innerHTML=scenes.map((x,k)=>`<button type="button" class="v7-progress-item ${k===current?'is-active':''}" data-story-index="${k}" aria-label="История ${k+1}: ${x.name}" aria-pressed="${k===current}"></button>`).join('');document.querySelectorAll('[data-story-index]').forEach(b=>b.onclick=()=>render(Number(b.dataset.storyIndex)));}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();

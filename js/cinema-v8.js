'use strict';
/* CITY PORTAL — immersive editorial storytelling, not live video or a true 360° recording. */
(()=>{
 const chapters=[
  {name:'Портал',eyebrow:'ПРОЛОГ / ЗНАКОМСТВО',title:'ТАШКЕНТ,\nОЖИВАЙ.',bg:'assets/places/epic_tashkent.webp',desc:'Один шаг — и ты уже среди восточных базаров, золотого света и ароматов настоящего узбекского застолья. Это твой вход в город.',tip:'Выбери светящуюся точку справа. Каждую находку можно превратить в остановку путешествия.',focus:'chorsu',hotspots:[
   {id:'chorsu',name:'Базар Чорсу',x:68,y:34,mx:76,my:18,icon:'✦',desc:'Голубой купол и бесконечное движение. Под ним знакомятся с вкусами старого города.',taste:'Что искать: самсу и специи'},
   {id:'besh',name:'Большой казан',x:83,y:29,mx:85,my:20,icon:'✳',desc:'Знаменитый центр плова — огромные казаны, аромат зиры и риса.',taste:'Попробуй: ташкентский плов'},
   {id:'city',name:'Вечерние огни',x:89,y:44,mx:65,my:22,icon:'✶',desc:'Прогулка среди подсвеченных улиц и парков — другой характер большого города.',taste:'Финал: чай и десерт'}
  ]},
  {name:'Чорсу',eyebrow:'ГЛАВА 01 / СТАРЫЙ ГОРОД',title:'ПОД КУПОЛОМ\nЧОРСУ.',bg:'assets/places/chorsu.webp',desc:'Шуршание пакетов, голоса продавцов, пестрые горы специй. Здесь Ташкент не изображает традиции — он ими живёт.',tip:'Спроси цену перед покупкой, не торопись и попроси разрешения перед фотографированием людей.',focus:'chorsu',hotspots:[
   {id:'chorsu',name:'Рынок Чорсу',x:74,y:37,mx:77,my:19,icon:'✺',desc:'Лабиринт торговых рядов с лепёшками, сухофруктами и местными продуктами.',taste:'Попробуй: горячую самсу'},
   {id:'kukeldash',name:'Медресе Кукельдаш',x:66,y:46,mx:62,my:21,icon:'✶',desc:'Архитектурная остановка рядом со старым базаром.',taste:'Посмотри: орнаменты и арки'}
  ]},
  {name:'Плов',eyebrow:'ГЛАВА 02 / ГАСТРОНОМИЯ',title:'СЕРДЦЕ\nВ КАЗАНЕ.',bg:'assets/places/besh.webp',desc:'Шкворчит масло. Раскрывается аромат зиры. Ещё мгновение — и огромный казан превращается в главное событие дня.',tip:'За пловом лучше приезжать ближе к обеду: популярные разновидности могут закончиться.',focus:'besh',hotspots:[
   {id:'besh',name:'Центр плова Besh Qozon',x:78,y:35,mx:78,my:19,icon:'✳',desc:'Одна из самых известных гастрономических остановок столицы.',taste:'Вкус дня: плов и ачичук'},
   {id:'tower',name:'Ташкентская телебашня',x:66,y:47,mx:62,my:21,icon:'✦',desc:'Известная городская достопримечательность неподалёку.',taste:'После обеда: фотопрогулка'}
  ]},
  {name:'Узоры',eyebrow:'ГЛАВА 03 / КУЛЬТУРА',title:'ГОРОД\nВ ДЕТАЛЯХ.',bg:'assets/places/applied.webp',desc:'Сузани, резное дерево, кобальтовая керамика. Здесь даже маленький орнамент рассказывает большую историю.',tip:'Не касайся музейных экспонатов без разрешения и уточни правила съёмки.',focus:'applied',hotspots:[
   {id:'applied',name:'Музей прикладного искусства',x:75,y:36,mx:78,my:19,icon:'❖',desc:'Традиционные ремёсла, декоративное искусство и тонкая работа мастеров.',taste:'Увези: идею для узора'},
   {id:'metro',name:'Ташкентское метро',x:66,y:46,mx:62,my:21,icon:'✦',desc:'Станции метро известны выразительным оформлением и архитектурными деталями.',taste:'Обрати внимание: светильники и мозаика'}
  ]},
  {name:'Огни',eyebrow:'ГЛАВА 04 / ПОСЛЕ ЗАКАТА',title:'КОГДА\nЗАЖИГАЕТСЯ\nТАШКЕНТ.',bg:'assets/places/city.webp',desc:'Фонтаны сияют. Стекло небоскрёбов ловит последний закат. Город не спешит прощаться с тобой.',tip:'Фонтаны и подсветка могут работать по сезонному расписанию — планируй прогулку с запасом.',focus:'city',hotspots:[
   {id:'city',name:'Tashkent City Park',x:78,y:37,mx:78,my:19,icon:'✷',desc:'Современный парк с прогулочными зонами и вечерней атмосферой.',taste:'Заверши день: чаем и десертом'},
   {id:'temur',name:'Сквер Амира Темура',x:65,y:46,mx:62,my:21,icon:'✦',desc:'Одна из узнаваемых центральных площадей города.',taste:'Сделай фото на память'}
  ]}
 ];
 const $=(q,r=document)=>r.querySelector(q);
 const dialog=$('#v7-experience-dialog'),stage=$('#v7-experience-stage'),banner=$('#cinema-banner');
 if(!dialog||!stage||!banner)return;
 const base=$('#v7-experience-image'),cross=$('#cinema-photo-cross'),hotspotRoot=$('#cinema-hotspots'),card=$('#cinema-discovery');
 let chapter=0,selected=0,onCross=false,autoplay=null,night=false,drag=null;
 const media=window.matchMedia('(prefers-reduced-motion: reduce)');
 const prefersStill=()=>media.matches;
 function particles(){const wrap=$('#cinema-particles');if(!wrap)return;wrap.innerHTML='';for(let i=0;i<27;i++){
   const dot=document.createElement('span');const left=(i*73.73+17)%100,top=(i*29.91+11)%100;
   dot.style.setProperty('--left',left+'%');dot.style.setProperty('--top',top+'%');dot.style.setProperty('--size',(i%4+1)+'px');dot.style.setProperty('--delay',(-i*.48)+'s');dot.style.setProperty('--speed',(7+i%9)+'s');wrap.append(dot);
  }
 }
 function cardUpdate(){const data=chapters[chapter].hotspots[selected];if(!data)return;
  $('#cinema-discovery-title').textContent=data.name;
  $('#cinema-discovery-desc').textContent=data.desc;
  $('#cinema-discovery-taste').textContent=data.taste;
  $('#cinema-discovery-count').textContent=String(selected+1).padStart(2,'0')+' / '+String(chapters[chapter].hotspots.length).padStart(2,'0');
  hotspotRoot.querySelectorAll('.cinema-hotspot').forEach((b,i)=>{b.classList.toggle('is-active',i===selected);b.setAttribute('aria-pressed',String(i===selected))});
  card.style.animation='none';void card.offsetHeight;card.style.animation='';
 }
 function selectHotspot(index){selected=index;cardUpdate()}
 function render(index){chapter=(index+chapters.length)%chapters.length;const s=chapters[chapter];selected=0;
  if(!onCross){cross.style.backgroundImage=`url('${s.bg}')`;base.classList.add('cross-visible');cross.classList.add('cross-visible');onCross=true}
  else{base.style.backgroundImage=`url('${s.bg}')`;base.classList.remove('cross-visible');cross.classList.remove('cross-visible');onCross=false}
  $('#v7-story-number').textContent=String(chapter+1).padStart(2,'0')+' / '+String(chapters.length).padStart(2,'0');
  $('#cinema-episode-kind').textContent=s.eyebrow;
  $('#v7-story-title').textContent=s.title;
  const title=$('#v7-story-title');title.style.animation='none';void title.offsetWidth;title.style.animation='';
  $('#v7-story-desc').textContent=s.desc;$('#v7-story-tip').textContent='✳ '+s.tip;
  hotspotRoot.innerHTML=s.hotspots.map((p,i)=>`<button type="button" class="cinema-hotspot ${i===0?'is-active':''}" style="--hx:${p.x}%;--hy:${p.y}%;--mobile-x:${p.mx}%;--mobile-y:${p.my}%;" aria-label="Узнать: ${p.name}" data-index="${i}" aria-pressed="${i===0}"><span class="cinema-hotspot-dot">${p.icon}</span><span class="cinema-hotspot-label">${p.name}</span></button>`).join('');
  hotspotRoot.querySelectorAll('[data-index]').forEach(button=>button.addEventListener('click',e=>{e.stopPropagation();selectHotspot(Number(button.dataset.index))}));
  $('#v7-experience-progress').innerHTML=chapters.map((item,i)=>`<button type="button" class="cinema-progress-item ${i===chapter?'is-active':''}" aria-pressed="${i===chapter}" data-chapter="${i}" aria-label="Открыть главу ${i+1}: ${item.name}"><span>${String(i+1).padStart(2,'0')}</span><span>${item.name.toUpperCase()}</span></button>`).join('');
  $('#v7-experience-progress').querySelectorAll('[data-chapter]').forEach(button=>button.addEventListener('click',()=>render(Number(button.dataset.chapter))));
  cardUpdate();resetView();
 }
 function resetView(){stage.style.setProperty('--look-x','0px');stage.style.setProperty('--look-y','0px')}
 function add(){const h=chapters[chapter].hotspots[selected];if(window.TasteExplorer?.addPlaceToDay){window.TasteExplorer.addPlaceToDay(h.id);const btn=$('#cinema-add');const other=$('#cinema-discovery-add');btn.textContent='✓ ДОБАВЛЕНО В МАРШРУТ';other.textContent='✓ Добавлено';setTimeout(()=>{btn.textContent='+ В МОЙ МАРШРУТ';other.textContent='Добавить ↗'},1800)}else{dialog.close();$('#planner')?.scrollIntoView({behavior:'smooth'})}}
 function showPlace(){const h=chapters[chapter].hotspots[selected];stopAuto();dialog.close();if(window.TasteExplorer?.showPlace){requestAnimationFrame(()=>window.TasteExplorer.showPlace(h.id))}else $('#planner')?.scrollIntoView({behavior:'smooth'})}
 function stopAuto(){if(autoplay){clearInterval(autoplay);autoplay=null;}const b=$('#cinema-auto');b?.setAttribute('aria-pressed','false');if(b)b.textContent='▷ АВТОТУР'}
 function toggleAuto(){if(autoplay){stopAuto();return}autoplay=setInterval(()=>render(chapter+1),7000);const b=$('#cinema-auto');b.textContent='Ⅱ ПАУЗА';b.setAttribute('aria-pressed','true')}
 function open(index=0){stopAuto();night=false;stage.classList.remove('is-night');$('#cinema-night').setAttribute('aria-pressed','false');$('#cinema-night').textContent='☾ НОЧЬ';base.style.backgroundImage="url('assets/places/epic_tashkent.webp')";cross.style.backgroundImage='none';base.classList.remove('cross-visible');cross.classList.remove('cross-visible');onCross=false;chapter=0;render(index);dialog.showModal();particles();}
 function lookAt(e,container,hero=false){if(prefersStill())return;const r=container.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
  if(hero){container.style.setProperty('--cinema-px',((.5-x)*20).toFixed(1)+'px');container.style.setProperty('--cinema-py',((.5-y)*13).toFixed(1)+'px')}
  else{stage.style.setProperty('--look-x',((.5-x)*46).toFixed(1)+'px');stage.style.setProperty('--look-y',((.5-y)*24).toFixed(1)+'px')}
 }
 banner.addEventListener('pointermove',e=>{if(e.pointerType!=='touch')lookAt(e,banner,true)});
 banner.addEventListener('pointerleave',()=>{banner.style.setProperty('--cinema-px','0px');banner.style.setProperty('--cinema-py','0px')});
 stage.addEventListener('pointerdown',e=>{if(e.target.closest('button'))return;drag={x:e.clientX,y:e.clientY,type:e.pointerType};if(e.pointerType==='touch'){try{stage.setPointerCapture(e.pointerId)}catch{}}});
 stage.addEventListener('pointermove',e=>{if(!drag&&e.pointerType==='touch')return;if(e.pointerType!=='touch'||drag)lookAt(e,stage)});
 stage.addEventListener('pointerup',e=>{if(!drag)return;const dx=e.clientX-drag.x;if(drag.type==='touch'&&Math.abs(dx)>75)render(chapter+(dx<0?1:-1));drag=null});
 stage.addEventListener('pointercancel',()=>drag=null);
 stage.addEventListener('pointerleave',()=>{if(!drag)resetView()});
 $('#v7-experience-open')?.addEventListener('click',()=>open(0));
 $('#v7-experience-preview')?.addEventListener('click',()=>open(0));
 $('#v7-experience-close')?.addEventListener('click',()=>dialog.close());
 $('#v7-story-next')?.addEventListener('click',()=>render(chapter+1));
 $('#v7-story-place')?.addEventListener('click',showPlace);
 $('#cinema-add')?.addEventListener('click',add);
 $('#cinema-discovery-add')?.addEventListener('click',add);
 $('#cinema-auto')?.addEventListener('click',toggleAuto);
 $('#cinema-night')?.addEventListener('click',()=>{night=!night;stage.classList.toggle('is-night',night);const b=$('#cinema-night');b.setAttribute('aria-pressed',String(night));b.textContent=night?'☀ СУМЕРКИ':'☾ НОЧЬ'});
 dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
 dialog.addEventListener('close',()=>{stopAuto();particlesClear();drag=null});
 function particlesClear(){const wrap=$('#cinema-particles');if(wrap)wrap.innerHTML=''}
 dialog.addEventListener('keydown',e=>{if(e.target.closest('input,textarea,select'))return;if(e.key==='ArrowRight'){e.preventDefault();render(chapter+1)}else if(e.key==='ArrowLeft'){e.preventDefault();render(chapter-1)}});
 // Preload the next chapter, so interaction does not wait on the network.
 chapters.forEach(item=>{const image=new Image();image.src=item.bg});
})();

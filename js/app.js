'use strict';

// Интерактивный гастрономический путеводитель. Все пользовательские данные остаются в браузере.
const PHOTOS = {
  plov: 'assets/photos/plov.webp',
  chorsu: 'assets/photos/chorsu.webp',
  samsa: 'assets/photos/samsa.webp',
  evening: 'assets/photos/evening.webp',
  sweets: 'assets/photos/sweets.webp',
  all: 'assets/photos/grand.webp',
  lagman: 'assets/photos/lagman.webp',
  non: 'assets/photos/non.webp',
  tea: 'assets/photos/sweets.webp'
};
const POINTS = {
  chorsu: { name:'Базар Чорсу', label:'Старый город', coords:[41.32673,69.23503], description:'Под голубым куполом ищи специи, сухофрукты, нават и свежие лепёшки. Рядом — ряды с готовой едой. Покупки и дегустации на выбор.', clue:'Специи, лепёшки, восточные сладости' },
  kukeldash: { name:'Медресе Кукельдаш', label:'История рядом', coords:[41.32316,69.23666], description:'Одна из известных достопримечательностей старого Ташкента рядом с Чорсу. Отличная короткая прогулка между дегустациями.', clue:'Архитектура, история, старые улицы' },
  besh: { name:'Центр плова Besh Qozon', label:'Большие казаны', coords:[41.34747,69.28489], description:'Знаменитый центр плова на улице Ифтихор, 1, возле телебашни. Лучше планировать посещение к обеду и заранее уточнить время работы.', clue:'Ташкентский плов и казаны' },
  temur: { name:'Сквер Амира Темура', label:'Центральный Ташкент', coords:[41.31009,69.27953], description:'Зелёная прогулочная точка в центре города. Вокруг можно выбрать подходящее кафе или ресторан для знакомства с современной городской кухней.', clue:'Прогулка, фотографии и кафе поблизости' },
  city: { name:'Tashkent City Park', label:'Современный город', coords:[41.31667,69.24861], description:'Городской парк для красивой прогулки после дегустаций. Чай или десерт можно найти в заведениях поблизости — ассортимент меняется.', clue:'Парк, вечерний свет, чайная пауза' }
};
const TOURS = [
  {id:'plov', index:'01', title:'Плов и сердце Ташкента', kicker:'Легенда в казане', tag:'Хит маршрутов', time:'4–5 часов', category:['classic'], mood:'ТРАДИЦИИ / ПЛОВ', description:'От шумного Чорсу до огромных казанов. Большая прогулка о самом узнаваемом вкусе Узбекистана.', long:'Начни с исторического центра, посмотри старые улицы и отправляйся к одному из самых известных центров плова. Между районами предусмотрен переезд.', stops:['chorsu','kukeldash','besh'], steps:['Присмотрись к специям и лепёшкам на Чорсу','Прогуляйся вокруг медресе и по старому району','Попробуй плов и посмотри на большие казаны'], image:'plov', fallback:'assets/plov.svg', className:'fallback-plov', question:'Почему плов подают по особым случаям?' },
  {id:'bazaar', index:'02', title:'Чорсу на вкус', kicker:'Базарная история', tag:'Много впечатлений', time:'2–3 часа', category:['street','classic'], mood:'РЫНОК / СТРИТФУД', description:'Лепёшки из тандыра, самса, восточные сладости и разговоры среди ярких прилавков.', long:'Неспешная прогулка по старому Ташкенту с акцентом на рынки. Удобный вариант без дальних переездов.', stops:['kukeldash','chorsu'], steps:['Начни с исторического квартала у медресе','Исследуй продуктовые и гастрономические ряды Чорсу'], image:'chorsu', fallback:'assets/non.svg', className:'fallback-chorsu', question:'Сколько разновидностей специй узнаешь по запаху?' },
  {id:'samsa', index:'03', title:'Самса, нон и чай', kicker:'Тёплый маршрут', tag:'Очень уютно', time:'3–4 часа', category:['street','classic'], mood:'ВЫПЕЧКА / ЧАЙ', description:'Хрустящее тесто, узорчатые лепёшки и пауза на чашку зелёного чая.', long:'Знакомство с узбекской выпечкой на Чорсу, а затем прогулка к современной части города. Чайхана — по собственному выбору.', stops:['kukeldash','chorsu','city'], steps:['Почувствуй атмосферу старого района','Ищи свежую самсу и лепёшки на Чорсу','Заверши день чаем в заведении по выбору'], image:'samsa', fallback:'assets/samsa.svg', className:'fallback-samsa', question:'Чем отличается самса, испечённая в тандыре?' },
  {id:'sweet', index:'04', title:'Сладкий Ташкент', kicker:'Невозможно устоять', tag:'Для сладкоежек', time:'2–3 часа', category:['sweet'], mood:'ДЕСЕРТЫ / ЧАЙ', description:'Нават, халва, орехи, сухофрукты и уютное чаепитие. Мягкий ритм и много красивых деталей.', long:'Десертная прогулка начинается на рынке Чорсу, где продаются традиционные сладости. Для второй части выбери место для чая рядом с прогулочной зоной.', stops:['chorsu','city'], steps:['Сравни халву, нават и местные сладости','Прогуляйся по парку и устрой чайную паузу'], image:'sweets', fallback:'assets/sweets.svg', className:'fallback-sweet', question:'Как делают кристаллический сахар нават?' },
  {id:'evening', index:'05', title:'Огни и ароматы', kicker:'После заката', tag:'Вечерняя прогулка', time:'2–3 часа', category:['evening'], mood:'ВЕЧЕР / ГОРОД', description:'Золотой вечер, огни большого города и ужин в национальном стиле — как красивый финал дня.', long:'Прогуляйся от центра к Tashkent City Park. По дороге или после прогулки выбери ресторан национальной кухни; конкретное заведение и бронь не включены.', stops:['temur','city'], steps:['Начни прогулку у сквера Амира Темура','Заверши вечер в парке и выбери место для ужина'], image:'evening', fallback:'assets/tea.svg', className:'fallback-evening', question:'Какие блюда узбекской кухни лучше разделить с друзьями?' },
  {id:'grand', index:'06', title:'Всё и сразу!', kicker:'Большое гастроприключение', tag:'На целый день', time:'5–6 часов', category:['classic','street'], mood:'МАКСИМУМ ВКУСОВ', description:'Базар, исторический центр, плов и прогулка по городу. Для тех, кто хочет увидеть больше за один день.', long:'Самый насыщенный маршрут: начни с Чорсу, познакомься со старым городом, отправься за пловом, а после — погуляй в центре. Заложи время на транспорт.', stops:['chorsu','kukeldash','besh','temur'], steps:['Начни с ароматов Чорсу','Узнай больше об истории старого города','Пообедай пловом у телебашни','Заверши прогулку в центре Ташкента'], image:'all', fallback:'assets/lagman.svg', className:'fallback-all', question:'Сколько разных вкусов города получилось собрать?' }
];
const DISHES = [
  {name:'Плов', uz:'OSH', image:PHOTOS.plov, fallback:'assets/plov.svg', teaser:'Главный герой застолья', about:'Рис, морковь, мясо, специи и мастерство ошпаза. Плов — не просто блюдо, а важная часть праздников и семейных встреч.', fact:'Ищи в маршруте «Плов и сердце Ташкента».'},
  {name:'Самса', uz:'SOMSA', image:PHOTOS.samsa, fallback:'assets/samsa.svg', teaser:'Золотистое счастье из тандыра', about:'Румяная выпечка с мясной, тыквенной или другой начинкой. Особенно хороша горячей: хрустящая корочка и аромат только из печи.', fact:'Попробуй на Чорсу или в местной самсахане.'},
  {name:'Лагман', uz:'LAGʻMON', image:PHOTOS.lagman, fallback:'assets/lagman.svg', teaser:'Лапша с характером', about:'Тянутая лапша, овощи, мясо и насыщенный соус или бульон. Региональные и семейные варианты отличаются.', fact:'Подходит для неторопливого обеда в чайхане.'},
  {name:'Лепёшка', uz:'NON', image:PHOTOS.non, fallback:'assets/non.svg', teaser:'Хлеб с душой и узором', about:'Круглая лепёшка с рисунком от чекича. Свежий нон — важная часть стола и символ уважения к хлебу.', fact:'На Чорсу можно увидеть и попробовать разные виды лепёшек.'},
  {name:'Чай и сладости', uz:'CHOY', image:PHOTOS.tea, fallback:'assets/tea.svg', teaser:'Пауза по-ташкентски', about:'Зелёный чай в пиалах, нават, халва и сухофрукты. Чаепитие — неспешный способ поговорить и познакомиться.', fact:'Составь собственную десертную остановку в маршруте «Сладкий Ташкент».'}
];
const $ = (selector,root=document)=>root.querySelector(selector);
const $$ = (selector,root=document)=>[...root.querySelectorAll(selector)];
let currentRouteId='plov', currentPointId='chorsu', leafMap=null, mapMarkers=[], mapLine=null, toastTimer=null;
let streetLayer=null, satelliteLayer=null, roadController=null, routeRequestSequence=0, routeGeoCache=new Map();
const getTour = id=>TOURS.find(t=>t.id===id)||TOURS[0];
const externalMap = id=>{const p=POINTS[id];return `https://www.google.com/maps/search/?api=1&query=${p.coords.join('%2C')}`};
const routeNavigation = id=>{const t=getTour(id),stops=t.stops.map(k=>POINTS[k].coords.join(','));const base='https://www.google.com/maps/dir/?api=1';let qs=`&origin=${encodeURIComponent(stops[0])}&destination=${encodeURIComponent(stops.at(-1))}&travelmode=${t.stops.length>2?'driving':'walking'}`;if(stops.length>2)qs+=`&waypoints=${encodeURIComponent(stops.slice(1,-1).join('|'))}`;return base+qs;};

const photo = (src,alt,fallback,classes='')=>`<img class="${classes}" src="${src}" alt="${alt}" loading="lazy" onerror="this.src='${fallback}';this.onerror=null">`;
function toast(message){const el=$('#toast');if(!el)return;el.textContent=message;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),3200)}

function renderTours(filter='all'){
 const list=TOURS.filter(t=>filter==='all'||t.category.includes(filter));
 $('#tour-grid').innerHTML=list.map(t=>`<article class="tour-card reveal is-visible"><div class="tour-photo ${t.className}">${photo(PHOTOS[t.image],t.title,t.fallback)}<span class="tour-index">${t.index}</span><span class="tour-tag">${t.tag}</span><div class="tour-photo-bottom"><span>ТАШКЕНТ · УЗБЕКИСТАН</span><span>↗</span></div></div><div class="tour-card-content"><span class="tour-card-eyebrow">${t.mood}</span><h3>${t.title}</h3><p>${t.description}</p><div class="tour-card-bottom"><span>◷ ${t.time} · ${t.stops.length} остановки</span><button type="button" class="tour-open" data-open-tour="${t.id}" aria-label="Подробнее: ${t.title}">Подробнее ↗</button></div></div></article>`).join('');
 $$('[data-open-tour]').forEach(btn=>btn.addEventListener('click',()=>openTour(btn.dataset.openTour)));
}
function initFilters(){ $$('#tour-filters .filter').forEach(button=>button.addEventListener('click',()=>{
  $$('#tour-filters .filter').forEach(b=>{b.classList.toggle('is-active',b===button);b.setAttribute('aria-pressed',String(b===button))}); renderTours(button.dataset.filter);
 }))}
function openTour(id){const t=getTour(id),d=$('#tour-dialog');$('#dialog-content').innerHTML=`<div class="dialog-layout"><div class="dialog-visual ${t.className}">${photo(PHOTOS[t.image],t.title,t.fallback)}</div><div class="dialog-copy"><div class="eyebrow">МАРШРУТ ${t.index} · ${t.kicker.toUpperCase()}</div><h2 id="dialog-title">${t.title}</h2><div class="dialog-meta"><span>◷ ${t.time}</span><span>◎ ${t.stops.length} остановки</span></div><p>${t.long}</p><ol class="dialog-timeline">${t.stops.map((pid,i)=>`<li><strong>${POINTS[pid].name}</strong><small>${t.steps[i]}</small></li>`).join('')}</ol><div class="dialog-actions"><button type="button" class="button button-dark" data-show-on-map="${t.id}">На карте ↗</button><button type="button" class="button dialog-secondary" data-download="${t.id}">Скачать PDF ↓</button></div></div><button type="button" class="dialog-close" aria-label="Закрыть окно">×</button></div>`;
 $('.dialog-close',d).addEventListener('click',()=>d.close()); $('[data-show-on-map]',d).addEventListener('click',()=>{selectRoute(id);d.close();$('#map-section').scrollIntoView({behavior:'smooth'})});$('[data-download]',d).addEventListener('click',()=>downloadTour(id));d.showModal()}
function initDialogs(){ $$('#tour-dialog,#dish-dialog').forEach(d=>d.addEventListener('click',ev=>{if(ev.target===d)d.close()})) }
function renderDishes(){ $('#dish-grid').innerHTML=DISHES.map((dish,i)=>`<button type="button" class="dish-card" data-dish="${i}" aria-label="Подробнее о блюде: ${dish.name}"><div class="dish-image"><img loading="lazy" src="${dish.image}" alt="Фотографическая иллюстрация блюда: ${dish.name}" onerror="this.src='${dish.fallback}';this.onerror=null"><span class="dish-number">0${i+1}</span></div><h3>${dish.name}</h3><p>${dish.teaser}</p></button>`).join('');$$('[data-dish]').forEach(b=>b.addEventListener('click',()=>openDish(Number(b.dataset.dish)))) }
function openDish(i){const dish=DISHES[i],d=$('#dish-dialog');$('#dish-dialog-content').innerHTML=`<div class="dialog-layout"><div class="dialog-visual"><img src="${dish.image}" alt="Фотографическая иллюстрация: ${dish.name}" onerror="this.src='${dish.fallback}';this.onerror=null"></div><div class="dialog-copy"><div class="eyebrow">УЗБЕКСКИЕ ВКУСЫ / ${dish.uz}</div><h2 id="dish-dialog-title">${dish.name}</h2><p>${dish.about}</p><div class="dish-fact">✳ ${dish.fact}</div></div><button type="button" class="dialog-close" aria-label="Закрыть окно">×</button></div>`;$('.dialog-close',d).addEventListener('click',()=>d.close());d.showModal()}

function selectRoute(id){
 const t=getTour(id); currentRouteId=t.id; currentPointId=t.stops[0];
 $('#map-route-select').value=t.id;
 $('#map-steps').innerHTML=t.stops.map((pid,i)=>`<button type="button" data-map-step="${pid}" class="map-step ${pid===currentPointId?'is-active':''}"><span class="map-step-num">${String(i+1).padStart(2,'0')}</span><span class="map-step-copy"><strong>${POINTS[pid].name}</strong><small>${t.steps[i]}</small></span><span aria-hidden="true">↗</span></button>`).join('');
 $$('[data-map-step]').forEach(b=>b.addEventListener('click',()=>selectPoint(b.dataset.mapStep)));
 $('#map-navigate').href=routeNavigation(t.id);
 updateLeaflet(t);selectPoint(currentPointId,false);
}
function selectPoint(id,fly=true){
 const point=POINTS[id]; if(!point)return;currentPointId=id;
 $$('[data-map-step]').forEach(b=>b.classList.toggle('is-active',b.dataset.mapStep===id));
 $('#map-point-detail').innerHTML=`<div class="point-info"><div><strong>${point.name}</strong><p>${point.description}</p></div><a href="${externalMap(id)}" target="_blank" rel="noopener noreferrer">Открыть точку в Google Картах ↗</a></div>`;
 if(leafMap){mapMarkers.forEach(o=>o.marker.setIcon(makeIcon(o.id===id,o.number)));if(fly)leafMap.flyTo(point.coords,15,{duration:.65})}
 else{const frame=$('#real-map iframe');if(frame)frame.src=googleEmbedUrl()}
}
function makeIcon(active,number){return L.divIcon({className:'leaflet-div-icon',html:`<div class="custom-map-pin${active?' active':''}"><span>${number}</span></div>`,iconSize:active?[46,46]:[38,38],iconAnchor:active?[23,23]:[19,19]})}
function fitRoute(){if(!leafMap)return;const locations=getTour(currentRouteId).stops.map(id=>POINTS[id].coords);leafMap.fitBounds(locations,{padding:[60,60],maxZoom:15,animate:true})}
async function drawRoadRoute(){
 const label=$('#route-kind');
 if(label) label.textContent='Маршрут между остановками';
}

function updateLeaflet(t){
 const request=++routeRequestSequence;if(roadController){roadController.abort();roadController=null}
 if(!leafMap)return;
 mapMarkers.forEach(o=>leafMap.removeLayer(o.marker));mapMarkers=[];if(mapLine){leafMap.removeLayer(mapLine);mapLine=null}
 const pts=t.stops.map(pid=>POINTS[pid].coords);
 mapLine=L.polyline(pts,{color:'#bb5536',weight:4,dashArray:'6 9',opacity:.85}).addTo(leafMap);
 $('#route-kind').textContent='Маршрут между остановками';
 t.stops.forEach((id,i)=>{const p=POINTS[id];const marker=L.marker(p.coords,{icon:makeIcon(id===currentPointId,i+1)}).addTo(leafMap);
   marker.bindTooltip(p.name,{direction:'top',offset:[0,-15]});marker.on('click',()=>selectPoint(id,false));mapMarkers.push({id,number:i+1,marker})
 });
 fitRoute(); drawRoadRoute(t,request);
}
let activeMapMode='street', mapFailureTimer=null, mapTileErrors=0, baseLayerIndex=0, hasSeenTile=false;
const STREET_TILES=[
  {url:'https://tile.openstreetmap.org/{z}/{x}/{y}.png',attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'},
  {url:'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',attribution:'Tiles &copy; Esri'},
  {url:'https://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, HOT'}
];
function makeStreetLayer(index){
 const config=STREET_TILES[index];
 const layer=L.tileLayer(config.url,{maxZoom:19,attribution:config.attribution,crossOrigin:false});
 layer.on('tileload',()=>{hasSeenTile=true;mapTileErrors=0;clearTimeout(mapFailureTimer);$('#map-notice').classList.add('is-hidden')});
 layer.on('tileerror',()=>{if(++mapTileErrors>=4&&!hasSeenTile){switchStreetProvider()}});
 return layer;
}
function switchStreetProvider(){
 if(!leafMap||hasSeenTile||activeMapMode!=='street')return;
 if(baseLayerIndex>=STREET_TILES.length-1){showMapFallback('Сервис карты недоступен. Попробуй Google Карты.');return}
 if(streetLayer&&leafMap.hasLayer(streetLayer))leafMap.removeLayer(streetLayer);
 baseLayerIndex++;mapTileErrors=0;clearTimeout(mapFailureTimer);
 streetLayer=makeStreetLayer(baseLayerIndex);streetLayer.addTo(leafMap); document.querySelector('.map-wrap')?.classList.add('is-online');
 $('#map-notice').textContent='Подключаем другой картографический сервер…';
 mapFailureTimer=setTimeout(()=>{if(!hasSeenTile)switchStreetProvider()},6500);
}
function googleEmbedUrl(){
 const point=POINTS[currentPointId]||POINTS.chorsu;
 const coords=point.coords.join(',');
 return `https://maps.google.com/maps?q=${encodeURIComponent(coords)}&z=14&output=embed${activeMapMode==='satellite'?'&t=k':''}`;
}
function showMapFallback(message){
 const root=$('#real-map'); if(!root)return;
 if(leafMap){leafMap.remove();leafMap=null}
 root.innerHTML=`<iframe title="Карта Ташкента — Google Карты" src="${googleEmbedUrl()}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen style="width:100%;height:100%;border:0"></iframe>`;
 root.classList.add('map-iframe-mode'); root.parentElement?.classList.add('is-online');
 $('#map-notice').textContent=message||'Карта открыта через Google Карты';
 $('#map-notice').classList.remove('is-hidden');
}
function initMap(){
 const select=$('#map-route-select');select.innerHTML=TOURS.map(t=>`<option value="${t.id}">${t.index}. ${t.title}</option>`).join('');
 select.addEventListener('change',()=>selectRoute(select.value));$('#download-route').addEventListener('click',()=>downloadTour(currentRouteId));
 $('#map-fit').addEventListener('click',()=>{if(leafMap)fitRoute();else showMapFallback('Точки тура — в списке слева. Выбери остановку.');});
 $('#map-streets').addEventListener('click',()=>setMapLayer('street'));
 $('#map-satellite').addEventListener('click',()=>setMapLayer('satellite'));
 if(typeof L!=='undefined'){
  try{
   leafMap=L.map('real-map',{scrollWheelZoom:false,zoomControl:false,attributionControl:true,preferCanvas:true}).setView([41.32,69.26],12);
   L.control.zoom({position:'bottomright'}).addTo(leafMap);
   streetLayer=makeStreetLayer(0);
   satelliteLayer=L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',{maxZoom:18,attribution:'Tiles &copy; Esri'});
   satelliteLayer.on('tileload',()=>{$('#map-notice').classList.add('is-hidden')});
   satelliteLayer.on('tileerror',()=>{if(activeMapMode==='satellite'&&++mapTileErrors>5)showMapFallback('Спутниковая карта доступна через Google Карты');});
   streetLayer.addTo(leafMap); document.querySelector('.map-wrap')?.classList.add('is-online');
   mapFailureTimer=setTimeout(()=>{if(!hasSeenTile)switchStreetProvider()},6500);
   setTimeout(()=>leafMap&&leafMap.invalidateSize(),250);
  }catch(err){console.error('Не удалось инициализировать карту',err);showMapFallback('Карта открыта через Google Карты');}
 }else{showMapFallback('Карта открыта через Google Карты');}
 selectRoute('plov');
}
function setMapLayer(kind){
 activeMapMode=kind;const satellite=kind==='satellite';
 if(leafMap){
  mapTileErrors=0;
  if(satellite){if(leafMap.hasLayer(streetLayer))leafMap.removeLayer(streetLayer);if(!leafMap.hasLayer(satelliteLayer))satelliteLayer.addTo(leafMap)}
  else{if(leafMap.hasLayer(satelliteLayer))leafMap.removeLayer(satelliteLayer);if(!leafMap.hasLayer(streetLayer))streetLayer.addTo(leafMap)}
 }else{const frame=$('#real-map iframe');if(frame)frame.src=googleEmbedUrl()}
 $('#map-streets').classList.toggle('is-active',!satellite);$('#map-satellite').classList.toggle('is-active',satellite);
 $('#map-streets').setAttribute('aria-pressed',String(!satellite));$('#map-satellite').setAttribute('aria-pressed',String(satellite));
}
async function downloadTour(id){
 const button=$(`[data-download="${id}"]`)||$('#download-route');
 try{
  if(button)button.disabled=true;
  const canvas=renderTourPDFPage(getTour(id));
  const data=canvas.toDataURL('image/jpeg',.94);
  const bytes=Uint8Array.from(atob(data.split(',')[1]),c=>c.charCodeAt(0));
  const pdf=buildImagePdf(bytes,canvas.width,canvas.height,routeNavigation(id));
  saveBlob(pdf,`Vkusny-Tashkent-${id}-marshrut.pdf`);
  toast('Красивый маршрутный лист сохранён в PDF');
 }catch(e){console.error('PDF export:',e);toast('Не удалось создать PDF. Повтори попытку.')}
 finally{if(button)button.disabled=false}
}
function saveBlob(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000)}
// PDF A4: размещаем страницу, созданную локально в Canvas, в PDF без внешних библиотек.
function buildImagePdf(jpeg,w,h,link){
 const enc=new TextEncoder(),parts=[],offsets=[0];let length=0;
 const add=data=>{const bytes=typeof data==='string'?enc.encode(data):data;parts.push(bytes);length+=bytes.length};
 const obj=(n,content)=>{offsets[n]=length;add(`${n} 0 obj\n`);if(Array.isArray(content)){for(const chunk of content)add(chunk)}else add(content);add('\nendobj\n')};
 add('%PDF-1.4\n%\xC2\xA5\xC2\xB1\n');
 obj(1,'<< /Type /Catalog /Pages 2 0 R >>');
 obj(2,'<< /Type /Pages /Kids [3 0 R] /Count 1 >>');
 obj(3,'<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources << /XObject << /Im0 5 0 R >> >> /Contents 4 0 R /Annots [6 0 R] >>');
 const stream='q 595.28 0 0 841.89 0 0 cm /Im0 Do Q\n';
 obj(4,`<< /Length ${enc.encode(stream).length} >>\nstream\n${stream}endstream`);
 obj(5,[`<< /Type /XObject /Subtype /Image /Width ${w} /Height ${h} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`,jpeg,'\nendstream']);
 // Нижняя кнопка на листе ведёт к навигации по всему маршруту.
 const safeLink=link.replace(/[()\\]/g,m=>'\\'+m);
 obj(6,`<< /Type /Annot /Subtype /Link /Rect [54 54 541 101] /Border [0 0 0] /A << /S /URI /URI (${safeLink}) >> >>`);
 const pos=length;add('xref\n0 7\n0000000000 65535 f \n');for(let i=1;i<=6;i++)add(`${String(offsets[i]).padStart(10,'0')} 00000 n \n`);
 add(`trailer\n<< /Size 7 /Root 1 0 R >>\nstartxref\n${pos}\n%%EOF`);
 return new Blob(parts,{type:'application/pdf'});
}
function renderTourPDFPage(t){
 const canvas=document.createElement('canvas');canvas.width=1240;canvas.height=1754;
 const c=canvas.getContext('2d'),W=1240,H=1754;
 c.fillStyle='#fff8ea';c.fillRect(0,0,W,H);
 const teal='#125d58',orange='#bd593b',gold='#f2b952',ink='#243d36',muted='#697368';
 c.fillStyle=teal;c.fillRect(0,0,W,420);
 c.strokeStyle='#eabf71';c.lineWidth=3;c.strokeRect(34,34,W-68,H-68);
 // Восточная плитка: орнамент формируется из геометрических звёзд.
 for(let x=70;x<W;x+=115){drawRosette(c,x,54,19,'#efba6f',.32);drawRosette(c,x,395,16,'#f9db9a',.36)}
 c.fillStyle='#f6cf91';c.font='700 23px Manrope, sans-serif';c.textAlign='left';c.fillText('TASTE TASHKENT  /  ГАСТРОНОМИЧЕСКИЙ ПУТЕВОДИТЕЛЬ',84,112);
 c.fillStyle='#fff7e6';c.font='700 57px Playfair Display, Georgia, serif';c.fillText('Вкусный Ташкент',84,205);
 c.font='700 47px Playfair Display, Georgia, serif';c.fillText(t.title,84,289);
 c.fillStyle='#eec881';c.font='700 26px Manrope, sans-serif';c.fillText(`${t.time.toUpperCase()}    ·    ${t.stops.length} ОСТАНОВКИ    ·    УЗБЕКИСТАН`,84,354);
 c.fillStyle=orange;c.fillRect(84,460,150,7);
 c.fillStyle=ink;c.font='800 28px Manrope, sans-serif';c.fillText('ТВОЙ МАРШРУТ',84,528);
 c.font='400 26px Manrope, sans-serif';c.fillStyle=muted;
 const descriptionEnd=canvasWrapText(c,t.long,84,578,1070,37,3);
 const startY=Math.max(770,descriptionEnd+76),cardHeight=t.stops.length>3?163:190,gap=t.stops.length>3?22:27;
 c.fillStyle='#eef0e7';c.fillRect(82,startY-55,1075,(cardHeight+gap)*t.stops.length+75);
 c.strokeStyle='#c7d3c8';c.lineWidth=4;c.beginPath();c.moveTo(144,startY+75);c.lineTo(144,startY+(cardHeight+gap)*(t.stops.length-1)+75);c.stroke();
 t.stops.forEach((pid,i)=>{const y=startY+i*(cardHeight+gap),p=POINTS[pid];
   c.fillStyle='#fffdfa';c.fillRect(104,y-14,1035,cardHeight);c.strokeStyle='#dfdfd2';c.lineWidth=2;c.strokeRect(104,y-14,1035,cardHeight);
   c.fillStyle=i%2?orange:teal;c.beginPath();c.arc(145,y+60,29,0,Math.PI*2);c.fill();
   c.fillStyle='#fff';c.font='800 24px Manrope, sans-serif';c.textAlign='center';c.fillText(String(i+1).padStart(2,'0'),145,y+69);c.textAlign='left';
   c.fillStyle=ink;c.font='800 30px Manrope, sans-serif';c.fillText(p.name,210,y+42);
   c.fillStyle=muted;c.font='400 24px Manrope, sans-serif';canvasWrapText(c,t.steps[i],210,y+88,860,32,2);
 });
 const footY=1497;
 c.fillStyle='#fff8ea';c.fillRect(56,footY-12,1130,188);
 c.fillStyle=teal;c.fillRect(84,footY+11,1070,96);
 c.fillStyle='#fff';c.font='800 29px Manrope, sans-serif';c.textAlign='center';c.fillText('ОТКРЫТЬ МАРШРУТ В GOOGLE КАРТАХ  ↗',620,footY+68);c.textAlign='left';
 c.fillStyle=muted;c.font='400 19px Manrope, sans-serif';
 c.fillText('Последовательность остановок справочная. Уточняй часы работы и время переездов.',86,footY+147);
 c.fillStyle=teal;c.font='700 19px Manrope, sans-serif';c.fillText('ВКУСНЫЙ ТАШКЕНТ • ГОРОД, КОТОРЫЙ ХОЧЕТСЯ ПОПРОБОВАТЬ',86,1707);
 return canvas;
}
function canvasWrapText(c,text,x,y,width,lineHeight,maxLines=99){
 const words=text.split(/\s+/);let line='',lines=0;
 for(const word of words){const next=line?line+' '+word:word;
  if(c.measureText(next).width>width&&line){c.fillText(line,x,y);y+=lineHeight;lines++;line=word;if(lines>=maxLines-1)break}else line=next;
 }if(line){c.fillText(line,x,y);y+=lineHeight}return y;
}
function drawRosette(c,x,y,r,color,opacity=1){c.save();c.globalAlpha=opacity;c.translate(x,y);c.strokeStyle=color;c.lineWidth=3;
 for(let i=0;i<8;i++){c.rotate(Math.PI/4);c.strokeRect(-r*.3,-r*.9,r*.6,r*1.2)}c.restore()}

const QUESTIONS=[
 {title:'Что звучит вкуснее всего?',options:[['🍚','Настоящий плов','plov'],['🫓','Самса и базар','market'],['🍬','Чай со сладостями','sweet'],['🌆','Красивый ужин','evening']]},
 {title:'Сколько времени есть на приключение?',options:[['⚡','Пара часов','short'],['☀️','Полдня','medium'],['🧭','Хочу целый день','long'],['🌙','Только вечер','night']]},
 {title:'Какую атмосферу ищешь?',options:[['🏺','История и традиции','heritage'],['🎨','Яркие рынки','marketplace'],['🍵','Спокойствие и уют','cozy'],['✨','Огни большого города','city']]}
];
let quizAnswers=[],quizStep=0;
function chooseResult(){const [taste,time,vibe]=quizAnswers;
 if(time==='long')return 'grand';if(time==='night')return 'evening';if(taste==='sweet')return 'sweet';if(taste==='evening'||vibe==='city')return 'evening';if(taste==='plov'&&time!=='short')return 'plov';if(vibe==='cozy')return 'samsa';if(taste==='market'||vibe==='marketplace'||time==='short')return 'bazaar';return 'plov'
}
function renderQuiz(){const root=$('#quiz-content');if(quizStep>=QUESTIONS.length){const t=getTour(chooseResult());root.innerHTML=`<div class="quiz-result"><div class="result-label">✳ ВОТ ТВОЙ МАРШРУТ</div><div class="quiz-result-visual"><div><h3>${t.title}</h3><p>${t.description}</p></div><img src="${t.fallback}" alt="Иллюстрация маршрута"></div><div class="quiz-result-actions"><button class="button button-dark" data-quiz-open="${t.id}" type="button">Смотреть маршрут ↗</button><button class="quiz-reset" type="button" id="quiz-reset">Пройти ещё раз</button></div></div>`;
 $('[data-quiz-open]').addEventListener('click',()=>openTour(t.id));$('#quiz-reset').addEventListener('click',()=>{quizAnswers=[];quizStep=0;renderQuiz()});return;
 }
 const q=QUESTIONS[quizStep];root.innerHTML=`<div class="quiz-progress" aria-label="Шаг ${quizStep+1} из 3">${[0,1,2].map(i=>`<i class="${i<=quizStep?'done':''}"></i>`).join('')}</div><span class="quiz-number">ВОПРОС 0${quizStep+1} / 03</span><h3>${q.title}</h3><div class="quiz-options">${q.options.map(([emoji,label,val])=>`<button type="button" class="quiz-option" data-answer="${val}"><span class="emoji">${emoji}</span>${label}</button>`).join('')}</div>`;
 $$('[data-answer]').forEach(btn=>btn.addEventListener('click',()=>{quizAnswers.push(btn.dataset.answer);quizStep++;renderQuiz()}));
}
function initNav(){const btn=$('#menu-toggle'),nav=$('#navigation');btn.addEventListener('click',()=>{const opened=nav.classList.toggle('is-open');btn.setAttribute('aria-expanded',opened);btn.setAttribute('aria-label',opened?'Закрыть меню':'Открыть меню')});$$('.nav a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('is-open');btn.setAttribute('aria-expanded','false')}));
 const toTop=$('#to-top');toTop.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));window.addEventListener('scroll',()=>toTop.classList.toggle('visible',window.scrollY>750),{passive:true});
 $('#credits-toggle').addEventListener('click',()=>{const c=$('#credits');c.hidden=!c.hidden;$('#credits-toggle').setAttribute('aria-expanded',String(!c.hidden))})
}
function initMotion(){if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;document.body.classList.add('js-motion');const observer=new IntersectionObserver(items=>items.forEach(item=>{if(item.isIntersecting){item.target.classList.add('is-visible');observer.unobserve(item.target)}}),{threshold:.08,rootMargin:'0px 0px 30px 0px'});$$('.reveal').forEach(el=>observer.observe(el))}

function init(){renderTours();initFilters();renderDishes();initDialogs();initMap();renderQuiz();initNav();initMotion()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();

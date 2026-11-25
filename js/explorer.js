'use strict';
// Многодневный конструктор маршрутов, гастроэнциклопедия и интерактивный дастархан.
// Все данные и выбор посетителя хранятся в браузере. Бэкенд не требуется.
(()=>{
const AS='assets/photos/';
const PLACES=[
 {id:'chorsu',name:'Базар Чорсу',type:'Еда и рынки',area:'Эски Шахар',lat:41.32673,lng:69.23503,emoji:'🧺',image:'assets/places/chorsu.webp',what:'Знаменитый рынок под бирюзовым куполом: специи, сухофрукты, лепёшки и жизнь старого Ташкента.',taste:'Самса, нон, нават, халва, сухофрукты; в гастрономических рядах — готовые блюда.',tip:'Уточняй цену до покупки, спрашивай разрешение на съёмку продавцов и следи за вещами в толпе.',time:'Лучше утром',source:'https://uzbekistan.travel/en/o/gastro-symbols-of-chorsu-bazaar/'},
 {id:'kukeldash',name:'Медресе Кукельдаш',type:'Культура',area:'Старый город',lat:41.32316,lng:69.23666,emoji:'🏛️',image:'assets/places/kukeldash.webp',what:'Исторический архитектурный ансамбль рядом с Чорсу. Удобно объединить с прогулкой по рынку.',taste:'После осмотра отправься за свежей самсой и чаем в районе Чорсу.',tip:'Уважай действующие правила посещения религиозных и учебных объектов; не снимай людей без согласия.',time:'Дневная прогулка',source:'https://uzbekistan.travel/en/i/tashkent/'},
 {id:'hazrat',name:'Хазрати Имам',type:'Культура',area:'Старый город',lat:41.33731,lng:69.24008,emoji:'🕌',image:'assets/places/hazrat.webp',what:'Архитектурный и религиозный комплекс старого города с медресе и площадью.',taste:'Совмести прогулку с дегустацией нона и восточных сладостей в соседних торговых рядах.',tip:'Одежда должна быть уважительной к религиозному месту; во время молитв возможны ограничения доступа.',time:'Утро или день',source:'https://visit.tashkent.uz/en/popular-route/7'},
 {id:'besh',name:'Центр плова Besh Qozon',type:'Еда и рынки',area:'Юнусабад',lat:41.34747,lng:69.28489,emoji:'🍚',image:'assets/places/besh.webp',what:'Известное место у телебашни, где плов готовят в огромных казанах.',taste:'Ташкентский плов, ачичук и чай. Уточняй доступные разновидности в день визита.',tip:'Планируй визит к обеду, когда готовят плов; ассортимент и время подачи могут меняться.',time:'К обеду',source:'https://uzbekistan.travel/en/v/gastronomicheskiy-turizm/'},
 {id:'temur',name:'Сквер Амира Темура',type:'Прогулки',area:'Центр',lat:41.31009,lng:69.27953,emoji:'🌳',image:'assets/places/temur.webp',what:'Зелёный центр города и удобная точка перед прогулкой к музеям, театру и кафе.',taste:'Попробуй лагман, шурпу или манты в одном из ресторанов центра.',tip:'В сквере делай паузы на отдых и фотографируй городскую архитектуру; еду выбирай в кафе вокруг.',time:'День или вечер',source:'https://uzbekistan.travel/en/i/tashkent/'},
 {id:'city',name:'Tashkent City Park',type:'Прогулки',area:'Современный центр',lat:41.31667,lng:69.24861,emoji:'🌆',image:'assets/places/city.webp',what:'Современный городской парк для вечерней прогулки, огней и фотоснимков.',taste:'Заверши прогулку десертом, чаем или ужином в заведении поблизости.',tip:'В выходные может быть многолюдно; расписание отдельных активностей проверяй на месте.',time:'Лучше вечером',source:'https://uzbekistan.travel/en/i/tashkent/'},
 {id:'oloy',name:'Алайский базар (Олой)',type:'Еда и рынки',area:'Центр',lat:41.31876,lng:69.28507,emoji:'🍑',image:'assets/places/oloy.webp',what:'Центральный продуктовый рынок с фруктами, овощами, орехами и повседневной городской жизнью.',taste:'Сезонные фрукты, орехи, сухофрукты и свежий нон.',tip:'Спрашивай цену и разрешение на дегустацию; рынок — место реальной торговли, не аттракцион.',time:'Первая половина дня',source:'https://visit.tashkent.uz/en/attraction/28'},
 {id:'applied',name:'Музей прикладного искусства',type:'Культура',area:'Центр',lat:41.301258,lng:69.259195,emoji:'🧿',image:'assets/places/applied.webp',what:'Традиционная резьба, текстиль, керамика и сузани — вдохновение для узбекского орнамента.',taste:'После музея устрой чайную паузу и попробуй местные сладости в центре.',tip:'Уточни режим работы, входные правила и разрешение на фотосъёмку экспонатов.',time:'Дневное посещение',source:'https://uzbekistan.travel/en/i/tashkent/'},
 {id:'navoi',name:'Национальный парк Навои',type:'Прогулки',area:'Чиланзар',lat:41.30148,lng:69.24124,emoji:'🌿',image:'assets/places/navoi.webp',what:'Просторный городской парк с аллеями и местами для отдыха.',taste:'Захвати воду и свежую лепёшку; для полноценного обеда выбери кафе за пределами прогулочной части.',tip:'Не оставляй мусор и соблюдай правила парка; комфортнее гулять в мягкую погоду.',time:'Днём или под вечер',source:'https://mapcarta.com/W32003705'},
 {id:'afsona',name:'Ресторан Afsona',type:'Рестораны',area:'Мирабад',lat:41.2998871,lng:69.2773014,emoji:'🍽️',image:'assets/places/afsona.webp',what:'Ресторан современной узбекской кухни на улице Тараса Шевченко.',taste:'Манты, шашлык, супы и сезонные блюда; уточняй текущее меню.',tip:'Вечером разумно проверить наличие столиков; заранее сообщай о пищевых ограничениях.',time:'Обед или ужин',source:'https://yandex.com/maps/10335/tashkent/house/YkAYdAJnT0wFQFprfX55dHxlZg%3D%3D/'},
 {id:'theatre',name:'Театр имени Алишера Навои',type:'Культура',area:'Центр',lat:41.309163,lng:69.271548,emoji:'🎭',image:'assets/places/theatre.webp',what:'Знаковое здание театра оперы и балета — красивая остановка в культурном центре.',taste:'После прогулки загляни на чай, десерт или ужин в ресторан центра.',tip:'Если хочешь попасть на спектакль, заранее проверь афишу и билеты.',time:'День или вечер',source:'https://uzbekistan.travel/en/i/tashkent/'},
 {id:'tower',name:'Ташкентская телебашня',type:'Культура',area:'Юнусабад',lat:41.34557,lng:69.28467,emoji:'📡',image:'assets/places/tower.webp',what:'Один из символов Ташкента, с панорамными видами на город.',taste:'Рядом находится знаменитый центр плова Besh Qozon.',tip:'Уточняй часы работы обзорной площадки, стоимость билета и правила входа.',time:'В светлое время',source:'https://visittashkent.uz/places/tashkent-tv-tower/'},
 {id:'caravan',name:'Ресторан Caravan',type:'Рестораны',area:'Яккасарай',lat:41.28514,lng:69.2576,emoji:'🥘',image:'assets/places/caravan.webp',what:'Ресторан национальной кухни с традиционными мотивами в оформлении.',taste:'Шашлык, манты, национальные горячие блюда и чай — актуальное меню уточняй в ресторане.',tip:'При большой компании заранее уточни столик и формат подачи блюд.',time:'Обед или ужин',source:'https://caravanrestaurant.uz/'},
 {id:'minor',name:'Мечеть Минор',type:'Культура',area:'Юнусабад',lat:41.335334,lng:69.275056,emoji:'🕌',image:'assets/places/minor.webp',what:'Современная беломраморная мечеть с бирюзовым куполом возле канала Анхор.',taste:'Сочетай осмотр с гастрономической остановкой у телебашни или в центре.',tip:'Уважай религиозные традиции: соответствующая одежда и отсутствие помех во время молитвы.',time:'День',source:'https://uzbekistan.travel/en/o/the-minor-mosque/'},
 {id:'metro',name:'Метро «Космонавтлар»',type:'Культура',area:'Центр',lat:41.305022,lng:69.265344,emoji:'🚇',image:'assets/places/metro.webp',what:'Одна из самых выразительных станций метро Ташкента, оформленная на космическую тему.',taste:'После поездки прогуляйся до кафе в центре и попробуй лагман или чай.',tip:'Соблюдай действующие правила метрополитена и не мешай пассажирам при съёмке.',time:'Вне часа пик',source:'https://themetromap.com/uzbekistan/tashkent/tashkent-metro/stations/kosmonavtlar'},
 {id:'abul',name:'Медресе Абулкасым',type:'Культура',area:'Чиланзар',lat:41.3067,lng:69.2399,emoji:'🏺',image:'assets/places/abul.webp',what:'Историческое медресе и традиционная архитектура недалеко от Национального парка.',taste:'После осмотра можно запланировать десерт и чай в районе парка.',tip:'Уточняй доступность внутренних помещений; при осмотре мастерских спрашивай разрешение на фотографии.',time:'Днём',source:'https://visit.tashkent.uz/en/more/historical-place/291'},
 {id:'independence',name:'Площадь Независимости',type:'Прогулки',area:'Центр',lat:41.31539,lng:69.26744,emoji:'✨',image:'assets/places/independence.webp',what:'Центральная площадь Ташкента, связанная с историей современного Узбекистана.',taste:'По пути к театру Навои найди место для чая и сладостей.',tip:'Возможны ограничения доступа во время официальных мероприятий; внимательно следи за указателями.',time:'День',source:'https://visit.tashkent.uz/en/popular-route/8'}
];
const DISHES=[
 {name:'Плов',uz:'Palov / osh',cat:'Основное',img:'plov.webp',desc:'Рис, морковь, мясо, зира и чеснок в большом казане. В каждом регионе свой почерк.',serve:'Часто подают с салатом ачичук, лепёшкой и чаем.',tip:'В центре плова можно наблюдать приготовление в больших казанах.'},
 {name:'Самса',uz:'Somsa',cat:'Выпечка',img:'samsa.webp',desc:'Слоёная или другая выпечка, традиционно с мясом, луком либо тыквой.',serve:'Горячая из тандыра, иногда с томатным соусом.',tip:'Уточни начинку перед покупкой: бывают мясные и овощные варианты.'},
 {name:'Лагман',uz:'Lagʻmon',cat:'Основное',img:'lagman.webp',desc:'Тянутая лапша с овощами, мясом и ароматным подливом или бульоном.',serve:'Бывает в более жидкой и жареной версии.',tip:'Спроси, какой вариант лагмана готовят сегодня.'},
 {name:'Нон',uz:'Non',cat:'Выпечка',img:'non.webp',desc:'Круглая узбекская лепёшка с узорным центром, часто испечённая в тандыре.',serve:'К супам, плову, чаю и почти к любому застолью.',tip:'К хлебу относятся с уважением: его не стоит бросать или класть на пол.'},
 {name:'Манты',uz:'Manti',cat:'Основное',img:'manti.webp',desc:'Крупные изделия из тонкого теста с мясной или тыквенной начинкой, приготовленные на пару.',serve:'С кисломолочным соусом, специями или по местным обычаям.',tip:'Начни осторожно: внутри может быть горячий сок.'},
 {name:'Шашлык',uz:'Shashlik',cat:'Основное',img:'shashlik.webp',desc:'Маринованное мясо, приготовленное на углях. Варианты зависят от заведения.',serve:'Часто с луком, зеленью и лепёшкой.',tip:'Уточняй вид мяса и размер порции.'},
 {name:'Шурпа',uz:'Shoʻrva',cat:'Супы',img:'shurpa.webp',desc:'Наваристый суп с мясом, картофелем, морковью и другими овощами.',serve:'Горячим, нередко с зеленью и ноном.',tip:'Подойдёт для сытного обеда после долгой прогулки.'},
 {name:'Норин',uz:'Norin',cat:'Основное',img:'norin.webp',desc:'Тонко нарезанное тесто и мясо; блюдо с выраженной местной традицией.',serve:'Бывает с бульоном и отдельно от него.',tip:'Если есть пищевые ограничения, обязательно уточни состав мяса.'},
 {name:'Чучвара',uz:'Chuchvara',cat:'Супы',img:'chuchvara.webp',desc:'Маленькие пельмени, которые часто подают в ароматном бульоне.',serve:'Горячими, со специями и зеленью.',tip:'Хороший вариант для первого знакомства с супами.'},
 {name:'Дымлама',uz:'Dimlama',cat:'Основное',img:'dimlama.webp',desc:'Тушёное мясо и овощи, приготовленные слоями на медленном огне.',serve:'Как полноценное сытное горячее блюдо.',tip:'Расспроси о сезонных овощах в составе.'},
 {name:'Мастава',uz:'Mastava',cat:'Супы',img:'mastava.webp',desc:'Рисовый суп с мясом, томатами и овощами.',serve:'Иногда с зеленью или кисломолочной добавкой.',tip:'Попробуй как лёгкую альтернативу плову.'},
 {name:'Казан-кабоб',uz:'Qozon kabob',cat:'Основное',img:'kazan-kabob.webp',desc:'Мясо и картофель, приготовленные в казане со специями.',serve:'Горячим, с луком, зеленью или салатом.',tip:'Порции могут быть большими — удобно делиться.'},
 {name:'Курут',uz:'Qurut',cat:'Закуски',img:'qurut.webp',desc:'Солёные сушёные шарики из кисломолочного продукта.',serve:'Как самостоятельная традиционная закуска.',tip:'У продукта выраженный солёно-кислый вкус.'},
 {name:'Ачичук',uz:'Achichuk',cat:'Закуски',img:'achichuk.webp',desc:'Простой салат из тонко нарезанных помидоров, лука и приправ.',serve:'К плову и мясным блюдам.',tip:'Если не любишь остроту или сырой лук, уточни состав.'},
 {name:'Сумаляк',uz:'Sumalak',cat:'Сладости',img:'sumalak.webp',desc:'Традиционное сладкое блюдо из пророщенной пшеницы, особенно связанное с Наврузом.',serve:'Небольшими порциями, часто в праздничный сезон.',tip:'Это сезонное блюдо, не рассчитывай найти его каждый день.'},
 {name:'Нишолда',uz:'Nisholda',cat:'Сладости',img:'nisholda.webp',desc:'Воздушная сладкая масса — характерное лакомство с мягкой текстурой.',serve:'Как десерт, иногда с хлебом.',tip:'Наличие зависит от сезона и конкретного продавца.'},
 {name:'Халва',uz:'Holva',cat:'Сладости',img:'sweets.webp',desc:'Большая группа восточных сладостей с разными ореховыми и мучными вариантами.',serve:'Небольшими кусочками с чаем.',tip:'Уточняй орехи и другие аллергены.'},
 {name:'Нават',uz:'Novvot',cat:'Сладости',img:'sweets.webp',desc:'Крупные кристаллы сахара, которые часто подают к чаю.',serve:'Кладут в чашку или едят отдельно.',tip:'На базаре встречаются разные оттенки и размеры кристаллов.'},
 {name:'Чай',uz:'Choy',cat:'Напитки',img:'sweets.webp',desc:'Важная часть гостеприимства. Встречаются зелёный и чёрный чай.',serve:'В пиалах; чайником часто делятся на весь стол.',tip:'Обычно уместно сначала предложить чай собеседникам.'}
];
const PRESETS=[
 ['chorsu','kukeldash','hazrat','besh'],
 ['oloy','temur','theatre','afsona'],
 ['applied','metro','navoi','caravan'],
 ['minor','tower','besh','city'],
 ['abul','independence','oloy','theatre','city']
];
const DAY_NAMES=['Старый город и плов','Рынки и городские истории','Искусство, метро и кухня','Панорамы и вечерние огни','Традиции и современный Ташкент'];
const byId=Object.fromEntries(PLACES.map(p=>[p.id,p]));
const $=(s,root=document)=>root.querySelector(s), $$=(s,root=document)=>[...root.querySelectorAll(s)];
const esc=(s)=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const directions=(ids,mode='walking',useOrigin=false)=>{
 const coords=ids.map(id=>byId[id]?.lat+','+byId[id]?.lng).filter(s=>!s.includes('undefined'));
 if(!coords.length)return 'https://www.google.com/maps/search/?api=1&query=Tashkent';
 if(coords.length===1&&!useOrigin)return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(coords[0])}`;
 const enteredOrigin=useOrigin?($('#planner-origin')?.value.trim()||''):'';
 if(coords.length===1&&!enteredOrigin)return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(coords[0])}`;
 if(coords.length===1&&enteredOrigin){const p=new URLSearchParams({api:'1',origin:enteredOrigin,destination:coords[0],travelmode:mode});return 'https://www.google.com/maps/dir/?'+p.toString()}
 const params=new URLSearchParams({api:'1',origin:enteredOrigin||coords[0],destination:coords.at(-1),travelmode:mode});
 const middle=enteredOrigin?coords.slice(0,-1):coords.slice(1,-1);if(middle.length)params.set('waypoints',middle.join('|'));
 return 'https://www.google.com/maps/dir/?'+params.toString();
};
const dist=(a,b)=>{const R=6371,lat1=a.lat*Math.PI/180,lat2=b.lat*Math.PI/180,dlat=lat2-lat1,dlon=(b.lng-a.lng)*Math.PI/180,h=Math.sin(dlat/2)**2+Math.cos(lat1)*Math.cos(lat2)*Math.sin(dlon/2)**2;return R*2*Math.atan2(Math.sqrt(h),Math.sqrt(1-h))};
let state={days:3,selectedDay:0,plans:PRESETS.slice(0,3).map(arr=>[...arr]),mode:'walking'};
try{const v=JSON.parse(localStorage.getItem('tashkent-planner-v6')||'null');if(v&&Number.isInteger(v.days)&&v.days>=1&&v.days<=5&&Array.isArray(v.plans)){
 const plans=v.plans.slice(0,v.days).map(day=>Array.isArray(day)?day.filter(id=>byId[id]).slice(0,12):[]);
 state={days:v.days,selectedDay:Math.max(0,Math.min(v.days-1,Number(v.selectedDay)||0)),plans,mode:v.mode==='driving'?'driving':'walking'};
}}catch(e){}
const persist=()=>{try{localStorage.setItem('tashkent-planner-v6',JSON.stringify(state))}catch(e){}};
let map=null,basemap=null,satellite=null,markers=[],line=null,mapAbort=null,routeRequest=0,mapMode='streets';
const active=()=>state.plans[state.selectedDay]||[];
// Local schematic fallback: only pin coordinates are geographic. Decorative blocks are NOT street data.
function renderSchematic(){
 const root=$('#planner-map');if(!root)return;
 const chosen=active();
 const coord=id=>{const p=byId[id];return {x:(8+(p.lng-69.22)/(69.305-69.22)*84).toFixed(2),y:(9+(41.36-p.lat)/(41.36-41.28)*81).toFixed(2)};};
 const route=chosen.map(id=>{const p=coord(id);return `${p.x},${p.y}`}).join(' ');
 const bubbles=chosen.map((id,i)=>{const p=coord(id);return `<button type="button" data-fallback-place="${id}" class="fallback-location" style="left:${p.x}%;top:${p.y}%" aria-label="${esc(byId[id].name)}"><b>${i+1}</b></button>`}).join('');
 root.innerHTML=`<div class="local-schematic"><svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><defs><pattern id="local-blocks" width="19" height="18" patternUnits="userSpaceOnUse"><rect x="2" y="2" width="13" height="10" rx="1" fill="#e0e9d5"/><path d="M0 13h19 M16 0v18" stroke="#fef8ed" stroke-width="2"/></pattern></defs><rect width="100" height="100" fill="#f5edda"/><rect width="100" height="100" fill="url(#local-blocks)" opacity=".95"/><path d="M-8 67Q16 48 31 53 T68 26 T110 30" stroke="#c5ddd5" stroke-width="5" fill="none"/><path d="M-5 20Q20 29 40 20 T110 68" stroke="#fffdfa" stroke-width="2.6" fill="none"/><path d="M0 88Q28 68 48 75 T110 45" stroke="#fffdfa" stroke-width="2.8" fill="none"/>${chosen.length>1?`<polyline points="${route}" fill="none" stroke="#bf6143" stroke-width=".7" stroke-dasharray="1.3 1.2" stroke-linecap="round"/>`:''}</svg>${bubbles}<div class="schematic-city-label"><strong>ТАШКЕНТ</strong><small>СХЕМА ОСТАНОВОК</small></div><div class="schematic-caption"><b>Схема расположения</b><span>Точки соответствуют координатам. Улицы условные, для навигации открой Google Карты.</span></div><a class="schematic-map-link" target="_blank" rel="noopener noreferrer" href="${directions(chosen,state.mode,true)}">Открыть настоящую карту ↗</a></div>`;
 root.querySelectorAll('[data-fallback-place]').forEach(el=>el.onclick=()=>showPlace(el.dataset.fallbackPlace));
 $('#planner-map-status').textContent='Схема точек · внешняя карта временно недоступна';
}
function initPlannerMap(){
 if(typeof L==='undefined'){renderSchematic();return}
 try{
  map=L.map('planner-map',{scrollWheelZoom:false,zoomControl:false}).setView([41.315,69.265],12);
  L.control.zoom({position:'bottomright'}).addTo(map);
  basemap=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'}).addTo(map);
  satellite=L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',{maxZoom:18,attribution:'© Esri'});
  let satelliteErrors=0;satellite.on('tileload',()=>satelliteErrors=0);satellite.on('tileerror',()=>{if(mapMode==='satellite'&&++satelliteErrors>=7){map.remove();map=null;renderSchematic();}});
  let errors=0,hasTiles=false;basemap.on('tileload',()=>{hasTiles=true;$('#planner-map-status').textContent='Карта улиц'});
  basemap.on('tileerror',()=>{if(!hasTiles&&++errors>=5){$('#planner-map-status').textContent='Переходим на резервную карту';basemap.remove();if(!map.hasLayer(satellite))satellite.addTo(map);mapMode='satellite';$('#planner-map-toggle').textContent='Улицы ↗';}});
  setTimeout(()=>map?.invalidateSize(),350);
 }catch(e){console.warn('Explorer map:',e);map=null;renderSchematic()}
}
function fitPlanner(){if(!map)return;const pts=active().map(id=>[byId[id].lat,byId[id].lng]);if(pts.length>1)map.fitBounds(pts,{padding:[62,62],maxZoom:15,animate:true});else if(pts.length)map.setView(pts[0],14);else map.setView([41.315,69.265],12)}
function renderMap(){if(!map){renderSchematic();return;}
 const ids=active();routeRequest++;if(mapAbort){mapAbort.abort();mapAbort=null}markers.forEach(m=>m.remove());markers=[];if(line){line.remove();line=null}
 ids.forEach((id,i)=>{const p=byId[id];const marker=L.marker([p.lat,p.lng],{icon:L.divIcon({className:'explorer-marker-root',html:`<span class="explorer-marker">${i+1}</span>`,iconSize:[42,42],iconAnchor:[21,21]})}).addTo(map);marker.bindTooltip(esc(p.name),{direction:'top'});marker.on('click',()=>showPlace(id));markers.push(marker)});
 if(ids.length>1){line=L.polyline(ids.map(id=>[byId[id].lat,byId[id].lng]),{color:'#c45f40',weight:4,dashArray:'7 9',opacity:.85}).addTo(map);$('#planner-map-status').textContent='Порядок остановок · схематично';
 if(state.mode==='driving')loadRoadRoute(ids,routeRequest);
 }else $('#planner-map-status').textContent=ids.length?'Одна остановка':'Добавь места на карту';
 fitPlanner();
}
async function loadRoadRoute(ids,seq){
 if(!map)return;
 const ctrl=new AbortController();mapAbort=ctrl;
 const url='https://router.project-osrm.org/route/v1/driving/'+ids.map(id=>`${byId[id].lng},${byId[id].lat}`).join(';')+'?overview=full&geometries=geojson';
 const t=setTimeout(()=>ctrl.abort(),7500);
 try{const res=await fetch(url,{signal:ctrl.signal});if(!res.ok)throw Error('Routing');const j=await res.json();if(seq!==routeRequest||!map||j.code!=='Ok'||!j.routes?.[0]?.geometry)return;
  if(line)line.remove();line=L.geoJSON(j.routes[0].geometry,{style:{color:'#bc5c37',weight:5,opacity:.91}}).addTo(map);$('#planner-map-status').textContent='Дороги · автомобильный маршрут';
 }catch(e){if(seq===routeRequest)$('#planner-map-status').textContent='Маршрут схематичен · точная навигация по кнопке';}
 finally{clearTimeout(t)}
}
function addPlaceToDay(id, day=state.selectedDay){
 if(!byId[id]||day<0||day>=state.days) return;
 const wasHere=state.plans[day].includes(id);
 if(wasHere) state.plans[day]=state.plans[day].filter(x=>x!==id);
 else {state.plans=state.plans.map(plan=>plan.filter(x=>x!==id));state.plans[day].push(id)}
 update();
 toast(wasHere?'Место убрано из этого дня':`${byId[id].name}: добавлено в день ${day+1}`);
}
function showPlace(id){
 const p=byId[id];if(!p)return;
 const dlg=$('#place-detail-dialog');if(!dlg)return;
 const inDay=state.plans.findIndex(day=>day.includes(id));
 dlg.innerHTML=`<div class="place-detail-card">
 <div class="place-detail-cover"><img src="${p.image}" alt="Художественная иллюстрация: ${esc(p.name)}"><span class="place-detail-kicker">${p.emoji} ${esc(p.area)} · ${esc(p.type)}</span><button type="button" class="place-detail-close" aria-label="Закрыть">✕</button></div>
 <div class="place-detail-inner"><div class="place-detail-intro"><span class="eyebrow">МЕСТО НА КАРТЕ / TOSHKENT</span><h2>${esc(p.name)}</h2><p>${esc(p.what)}</p></div>
 <div class="place-detail-recs"><div class="place-reco"><span>🍽️</span><div><b>Что попробовать</b><p>${esc(p.taste)}</p></div></div><div class="place-reco"><span>✳</span><div><b>Как себя вести</b><p>${esc(p.tip)}</p></div></div><div class="place-reco"><span>☀️</span><div><b>Когда лучше идти</b><p>${esc(p.time)}</p></div></div></div>
 <div class="place-detail-cta"><button type="button" class="v7-primary" id="place-dialog-add">${inDay===state.selectedDay?'✓ Убрать из дня '+(state.selectedDay+1):'✳ Добавить в день '+(state.selectedDay+1)}</button><a class="v7-secondary" href="${directions([id])}" target="_blank" rel="noopener noreferrer">Открыть в Google Картах ↗</a><a class="v7-source" href="${esc(p.source)}" target="_blank" rel="noopener noreferrer">Источник сведений ↗</a></div></div></div>`;
 dlg.querySelector('.place-detail-close').onclick=()=>dlg.close();
 dlg.querySelector('#place-dialog-add').onclick=()=>{addPlaceToDay(id);dlg.close()};
 if(!dlg.open)dlg.showModal();
}

function dayTabs(){
 $('#planner-days').innerHTML=state.plans.map((ids,i)=>`<button class="planner-day ${i===state.selectedDay?'is-active':''}" type="button" data-switch-day="${i}" aria-pressed="${i===state.selectedDay}"><span>День ${i+1}</span><small>${ids.length} мест</small></button>`).join('');
 $$('[data-switch-day]').forEach(b=>b.onclick=()=>{state.selectedDay=Number(b.dataset.switchDay);update();});
}
function renderItinerary(){const ids=active();const body=$('#planner-itinerary');
 $('#planner-current-title').textContent=DAY_NAMES[state.selectedDay];
 $('#planner-total').textContent=`${state.plans.reduce((n,v)=>n+v.length,0)} остановок в поездке`;
 body.innerHTML=ids.length?ids.map((id,i)=>{const p=byId[id],next=ids[i+1];return `<article class="itinerary-stop"><div class="stop-counter">${String(i+1).padStart(2,'0')}</div><div class="itinerary-text"><button type="button" class="itinerary-name" data-show-place="${id}">${esc(p.name)} <span>↗</span></button><p>${esc(p.taste)}</p><div class="stop-controls"><button type="button" data-move-up="${i}" aria-label="Переместить ${esc(p.name)} выше" ${i===0?'disabled':''}>↑</button><button type="button" data-move-down="${i}" aria-label="Переместить ${esc(p.name)} ниже" ${i===ids.length-1?'disabled':''}>↓</button><button type="button" data-remove-stop="${id}">Убрать</button>${next?`<a href="${directions([id,next],state.mode)}" target="_blank" rel="noopener noreferrer">Как добраться дальше ↗</a>`:''}</div></div></article>`}).join(''):'<div class="itinerary-empty">Пока ни одной остановки. Выбирай места ниже — они появятся здесь и на карте.</div>';
 $$('[data-show-place]',body).forEach(b=>b.onclick=()=>showPlace(b.dataset.showPlace));
 $$('[data-remove-stop]',body).forEach(b=>b.onclick=()=>{state.plans[state.selectedDay]=active().filter(id=>id!==b.dataset.removeStop);update()});
 $$('[data-move-up],[data-move-down]',body).forEach(b=>b.onclick=()=>{const i=Number(b.dataset.moveUp??b.dataset.moveDown),j=i+(b.hasAttribute('data-move-up')?-1:1),a=active();[a[i],a[j]]=[a[j],a[i]];update()});
 const nav=$('#planner-navigate'),chunks=[];
 if(ids.length>9){for(let i=0;i<ids.length-1;i+=8){chunks.push({start:i,ids:ids.slice(i,i+9)});if(i+9>=ids.length)break;}}
 nav.href=directions(chunks.length?chunks[0].ids:ids,state.mode,true);
 nav.textContent=chunks.length?'Навигация: этап 1 ↗':'Проложить путь в Google Картах ↗';
 nav.setAttribute('aria-disabled',String(ids.length===0));nav.classList.toggle('is-disabled',ids.length===0);
 const extras=$('#planner-nav-extras');extras.hidden=chunks.length<=1;
 extras.innerHTML=chunks.length>1?`<strong>Маршрут длинный — открой следующие этапы отдельно:</strong>${chunks.slice(1).map((item,i)=>`<a href="${directions(item.ids,state.mode)}" target="_blank" rel="noopener noreferrer">Этап ${i+2}: остановки ${item.start+1}–${item.start+item.ids.length} ↗</a>`).join('')}`:'';
 $('#planner-export').disabled=!state.plans.some(day=>day.length);
}
let placeFilter='Все',placeQuery='';
function renderPlaces(){
 const ids=active();const otherDay=id=>state.plans.findIndex((plan,i)=>i!==state.selectedDay&&plan.includes(id));
 const filtered=PLACES.filter(p=>(placeFilter==='Все'||p.type===placeFilter)&&(`${p.name} ${p.what} ${p.taste} ${p.area}`.toLowerCase().includes(placeQuery)));
 $('#planner-place-count').textContent=`${filtered.length} мест`;
 $('#planner-place-grid').innerHTML=filtered.map((p,i)=>{
  const on=ids.includes(p.id),other=otherDay(p.id);
  return `<article class="place-choice ${on?'is-picked':''}" style="--place-order:${i}"><button class="place-choice-more v7-photo" type="button" data-show-place="${p.id}" aria-label="Подробно о месте ${esc(p.name)}"><img src="${p.image}" alt="${esc(p.name)}: тематическая иллюстрация" loading="lazy" width="200" height="155"><span class="v7-photo-zoom">↗</span></button><div class="place-choice-info"><small>${p.emoji} ${esc(p.area)}</small><button type="button" class="place-title-btn" data-show-place="${p.id}">${esc(p.name)}</button><p>${esc(p.what)}</p><div class="place-choice-actions"><button type="button" class="place-choice-more v7-more" data-show-place="${p.id}">О месте и советы ↗</button><button type="button" class="place-choice-add ${on?'chosen':''}" data-add-place="${p.id}" aria-pressed="${on}" aria-label="${on?'Убрать '+esc(p.name):'Добавить '+esc(p.name)+' в день '+(state.selectedDay+1)}">${on?'✓':other>=0?'↻':'+'}</button></div></div></article>`;
 }).join('')||'<p class="planner-no-results">По этому запросу мест нет. Попробуй другой фильтр.</p>';
 $$('[data-add-place]',$('#planner-place-grid')).forEach(b=>b.onclick=()=>addPlaceToDay(b.dataset.addPlace));
 $$('[data-show-place]',$('#planner-place-grid')).forEach(b=>b.onclick=()=>showPlace(b.dataset.showPlace));
 const summary=$('#v7-picker-summary');if(summary){summary.textContent=`День ${state.selectedDay+1} · ${ids.length} выбрано`;}
}

function update(){dayTabs();renderItinerary();renderPlaces();renderMap();persist()}
function optimize(){const ids=active();if(ids.length<3){toast('Для перестановки нужны хотя бы три остановки');return}
 const result=[ids[0]],left=ids.slice(1);while(left.length){const prev=byId[result.at(-1)];left.sort((a,b)=>dist(prev,byId[a])-dist(prev,byId[b]));result.push(left.shift())}
 state.plans[state.selectedDay]=result;update();toast('Точки переставлены по близости. Точное время поездки смотри в Google Картах.');
}
function resetPresets(){state.plans=Array.from({length:state.days},(_,i)=>[...PRESETS[i]]);state.selectedDay=0;update();toast('Готовый план восстановлен')}

function suggestSmartPlan(){
 const choices=PLACES.filter(p=>placeFilter==='Все'||p.type===placeFilter);
 const preferred=choices.length>=state.days*2?choices:PLACES;
 const next=Array.from({length:state.days},()=>[]);
 const unclaimed=new Set(preferred.map(p=>p.id));
 for(let d=0;d<state.days;d++){
  const seed=PRESETS[d].find(id=>unclaimed.has(id))||Array.from(unclaimed)[0];
  if(!seed)continue;next[d].push(seed);unclaimed.delete(seed);
  const target=Math.min(4,Math.ceil((unclaimed.size+1)/(state.days-d)));
  while(next[d].length<target&&unclaimed.size){
   const last=byId[next[d].at(-1)];const closest=[...unclaimed].sort((a,b)=>dist(byId[a],last)-dist(byId[b],last))[0];
   next[d].push(closest);unclaimed.delete(closest);
  }
 }
 state.plans=next;state.selectedDay=0;update();toast('Подобрал программу по близости мест. Проверь часы работы и расстояния в навигаторе.');
}
function initPlanner(){
 const count=$('#planner-day-count');count.value=String(state.days);$('#planner-transport').value=state.mode;
 count.addEventListener('change',()=>{const days=Number(count.value);if(days>state.days)while(state.plans.length<days)state.plans.push([...PRESETS[state.plans.length]]);else state.plans=state.plans.slice(0,days);state.days=days;state.selectedDay=Math.min(state.selectedDay,days-1);update()});
 $('#planner-transport').addEventListener('change',e=>{state.mode=e.target.value;update()});
 $('#planner-origin').addEventListener('input',()=>renderItinerary());
 $('#planner-reset').onclick=resetPresets;
 $('#planner-optimize').onclick=optimize;
 $('#planner-clear-day').onclick=()=>{state.plans[state.selectedDay]=[];update()};
 $('#planner-map-fit').onclick=()=>{if(map)fitPlanner();else renderSchematic()};
 $('#planner-map-toggle').onclick=()=>{if(!map){window.open(directions(active(),state.mode,true),'_blank','noopener');return;}if(mapMode==='streets'){basemap?.remove();satellite.addTo(map);mapMode='satellite';$('#planner-map-toggle').textContent='Улицы ↗';}else{satellite?.remove();basemap.addTo(map);mapMode='streets';$('#planner-map-toggle').textContent='Спутник ↗'} };
 $('#planner-filters').innerHTML=['Все','Еда и рынки','Рестораны','Культура','Прогулки'].map(c=>`<button type="button" class="planner-filter ${c==='Все'?'is-active':''}" data-place-filter="${c}">${c}</button>`).join('');
 $$('[data-place-filter]').forEach(b=>b.onclick=()=>{placeFilter=b.dataset.placeFilter;$$('[data-place-filter]').forEach(x=>x.classList.toggle('is-active',x===b));renderPlaces()});
 $('#planner-search').addEventListener('input',e=>{placeQuery=e.target.value.trim().toLowerCase();renderPlaces()});
 $('#planner-export').onclick=exportPDF;
 const workspace=$('.planner-workspace'),picker=$('.planner-select-section');
 if(workspace&&picker){workspace.prepend(picker);workspace.classList.add('planner-v7-workbench');
  const pickerSummary=document.createElement('div');pickerSummary.id='v7-picker-summary';pickerSummary.className='v7-picker-summary';picker.querySelector('.planner-place-title')?.after(pickerSummary);
  const smart=document.createElement('button');smart.type='button';smart.id='v7-smart-plan';smart.className='v7-smart-plan';smart.innerHTML='✦ Подобрать точки автоматически';
  smart.onclick=suggestSmartPlan;picker.querySelector('.planner-search-wrap')?.after(smart);
 }
 const modal=$('#place-detail-dialog');modal?.addEventListener('click',e=>{if(e.target===modal)modal.close()});
 window.TasteExplorer={showPlace,addPlaceToDay,chooseDay:(i)=>{state.selectedDay=Math.min(Math.max(0,i),state.days-1);update();},goPlanner:()=>$('#planner')?.scrollIntoView({behavior:'smooth',block:'start'}),setTourStops:(ids)=>{state.plans[state.selectedDay]=ids.filter(id=>byId[id]);update();toast('Маршрут тура добавлен в выбранный день');}};
 initPlannerMap();update();setTimeout(()=>map?.invalidateSize(),420);
}
// PDF создаётся непосредственно из canvas: по одной странице A4 на день.
function makePdfPage(dayIndex,ids){
 const canvas=document.createElement('canvas');canvas.width=1000;canvas.height=1414;const c=canvas.getContext('2d');
 const teal='#0f6762',dark='#163a34',cream='#fff8e9',orange='#c26140';
 c.fillStyle=cream;c.fillRect(0,0,1000,1414);c.fillStyle=teal;c.fillRect(0,0,1000,330);
 c.strokeStyle='#eec178';c.lineWidth=4;c.strokeRect(28,28,944,1358);
 for(let x=55;x<970;x+=84){c.fillStyle='#f7cb7a';c.font='bold 30px Georgia';c.fillText('✳',x,65);c.fillText('✳',x,1356)}
 c.fillStyle='#f2cf91';c.font='700 21px Manrope, sans-serif';c.fillText('TASTE · TASHKENT   /   ГАСТРОНОМИЧЕСКИЙ МАРШРУТ',72,109);
 c.fillStyle='#fff9e8';c.font='700 63px Georgia, serif';c.fillText('Вкусный Ташкент',72,194);
 c.font='700 38px Georgia, serif';c.fillText(`День ${dayIndex+1} · ${DAY_NAMES[dayIndex]}`,72,267);
 c.fillStyle=orange;c.fillRect(75,375,128,6);c.fillStyle=dark;c.font='700 26px Manrope, sans-serif';c.fillText(`${ids.length} остановок · ${state.mode==='walking'?'пеший':'автомобильный'} режим`,75,423);
 const h=Math.min(154,Math.floor(725/Math.max(1,ids.length))-8),gap=10;
 ids.forEach((id,i)=>{const p=byId[id],y=469+i*(h+gap);c.fillStyle='#f4ead7';c.fillRect(72,y,855,h);c.fillStyle=i%2?orange:teal;c.beginPath();c.arc(120,y+42,26,0,7);c.fill();c.fillStyle='#fff';c.font='700 20px Manrope';c.textAlign='center';c.fillText(String(i+1).padStart(2,'0'),120,y+49);c.textAlign='left';c.fillStyle=dark;c.font='700 25px Manrope';c.fillText(p.name,163,y+47);c.fillStyle='#576961';c.font='17px Manrope';wrapCanvas(c,p.taste,163,y+78,720,23,2);c.font='15px Manrope';wrapCanvas(c,p.tip,163,y+113,720,19,2)});
 c.fillStyle=teal;c.fillRect(74,1272,852,63);c.fillStyle='#fff';c.font='700 22px Manrope';c.textAlign='center';c.fillText('ОТКРЫТЬ НАВИГАЦИЮ В GOOGLE КАРТАХ  ↗',500,1312);c.textAlign='left';
 c.fillStyle='#6f7c74';c.font='17px Manrope';c.fillText('План справочный. Проверяй часы работы, доступность и транспорт.',73,1248);
 return canvas;
}
function wrapCanvas(c,s,x,y,w,h,max){s=window.TasteI18n?.t(String(s))||String(s);let line='',n=0;for(const word of s.split(' ')){const next=line?line+' '+word:word;if(c.measureText(next).width>w&&line){c.fillText(line,x,y);line=word;y+=h;n++;if(n>=max-1)break}else line=next}if(line)c.fillText(line,x,y)}
function pdfMulti(pages){
 const enc=new TextEncoder(),parts=[],pos=[0];let len=0;const add=x=>{const b=typeof x==='string'?enc.encode(x):x;parts.push(b);len+=b.length};const obj=(n,content)=>{pos[n]=len;add(`${n} 0 obj\n`);if(Array.isArray(content)){content.forEach(add)}else add(content);add('\nendobj\n')};
 add('%PDF-1.4\n');let pnums=pages.map((_,i)=>3+i*4);obj(1,'<< /Type /Catalog /Pages 2 0 R >>');obj(2,`<< /Type /Pages /Kids [${pnums.map(n=>`${n} 0 R`).join(' ')}] /Count ${pages.length} >>`);
 pages.forEach((page,i)=>{const n=pnums[i],jpg=Uint8Array.from(atob(page.canvas.toDataURL('image/jpeg',.89).split(',')[1]),a=>a.charCodeAt(0));
 obj(n,`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources << /XObject << /Im0 ${n+2} 0 R >> >> /Contents ${n+1} 0 R /Annots [${n+3} 0 R] >>`);
 const content='q 595.28 0 0 841.89 0 0 cm /Im0 Do Q\n';obj(n+1,`<< /Length ${enc.encode(content).length} >>\nstream\n${content}endstream`);
 obj(n+2,[`<< /Type /XObject /Subtype /Image /Width ${page.canvas.width} /Height ${page.canvas.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpg.length} >>\nstream\n`,jpg,'\nendstream']);
 const u=directions(page.navIds||page.ids,state.mode,Boolean(page.first)).replace(/[()\\]/g,'\\$&');obj(n+3,`<< /Type /Annot /Subtype /Link /Rect [45 42 553 94] /Border [0 0 0] /A << /S /URI /URI (${u}) >> >>`);
 });const xref=len,count=3+pages.length*4;add(`xref\n0 ${count}\n0000000000 65535 f \n`);for(let n=1;n<count;n++)add(String(pos[n]).padStart(10,'0')+' 00000 n \n');add(`trailer\n<< /Size ${count} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`);return new Blob(parts,{type:'application/pdf'});
}
async function exportPDF(){const days=state.plans.map((ids,i)=>({ids,i})).filter(d=>d.ids.length);if(!days.length)return;const btn=$('#planner-export');btn.disabled=true;try{await document.fonts?.ready;const pages=days.flatMap(d=>{const parts=[];for(let i=0;i<d.ids.length;i+=4){const ids=d.ids.slice(i,i+5);parts.push({ids,navIds:ids,first:i===0,canvas:makePdfPage(d.i,ids)});if(i+5>=d.ids.length)break;}return parts});saveBlob(pdfMulti(pages),`Tashkent-Moy-Marshrut-${state.days}-dney.pdf`);toast('Твой многодневный путеводитель сохранён в PDF')}catch(e){console.error('PDF:',e);toast('Не удалось сохранить PDF')}finally{btn.disabled=false}}

let foodCategory='Все',foodQuery='',currentFood=0;
const foodCats=['Все','Основное','Супы','Выпечка','Закуски','Сладости','Напитки'];
function renderFoods(){const list=DISHES.map((d,i)=>({...d,i})).filter(d=>(foodCategory==='Все'||d.cat===foodCategory)&&`${d.name} ${d.uz} ${d.desc}`.toLowerCase().includes(foodQuery));
 if(list.length&&!list.some(d=>d.i===currentFood)) currentFood=list[0].i;
 $('#food-library-detail').setAttribute('data-empty',String(list.length===0));
 if(!list.length)$('#food-library-detail').innerHTML='<div class="food-empty-detail">Не нашли это блюдо. Попробуй другое название или категорию.</div>';else renderFoodDetail();
 $('#food-library-list').innerHTML=list.map(d=>`<button type="button" class="food-library-card ${d.i===currentFood?'is-current':''}" data-food-index="${d.i}"><img src="${AS+d.img}" alt="${esc(d.name)}" loading="lazy"><span><strong>${esc(d.name)}</strong><small>${esc(d.uz)}</small></span></button>`).join('')||'<p class="food-not-found">Таких блюд пока нет в каталоге.</p>';
 $$('[data-food-index]').forEach(b=>b.onclick=()=>{currentFood=Number(b.dataset.foodIndex);renderFoods();renderFoodDetail()});
}
function renderFoodDetail(){const d=DISHES[currentFood];$('#food-library-detail').innerHTML=`<div class="food-detail-photo"><img src="${AS+d.img}" alt="${esc(d.name)}"><span>${esc(d.cat)}</span></div><div class="food-detail-copy"><span class="eyebrow">УЗБЕКСКАЯ КУХНЯ · ${String(currentFood+1).padStart(2,'0')} / ${DISHES.length}</span><h3>${esc(d.name)}</h3><span class="food-uzbek">${esc(d.uz)}</span><p>${esc(d.desc)}</p><div class="food-detail-tip"><b>Как подают</b><p>${esc(d.serve)}</p></div><div class="food-detail-tip"><b>Совет путешественнику</b><p>${esc(d.tip)}</p></div><button type="button" id="food-next" class="button button-dark">Следующее блюдо ↗</button></div>`;
 $('#food-next').onclick=()=>{currentFood=(currentFood+1)%DISHES.length;renderFoods();renderFoodDetail()};}
function initFood(){const dlg=$('#food-library-dialog');$('#open-food-library').onclick=()=>{foodCategory='Все';foodQuery='';$('#food-library-search').value='';$$('[data-food-cat]').forEach(b=>b.classList.toggle('is-active',b.dataset.foodCat==='Все'));renderFoods();renderFoodDetail();dlg.showModal()};
 $('#close-food-library').onclick=()=>dlg.close();dlg.addEventListener('click',e=>{if(e.target===dlg)dlg.close()});
 $('#food-library-filters').innerHTML=foodCats.map(cat=>`<button type="button" data-food-cat="${cat}" class="food-filter ${cat==='Все'?'is-active':''}">${cat}</button>`).join('');
 $$('[data-food-cat]').forEach(b=>b.onclick=()=>{foodCategory=b.dataset.foodCat;$$('[data-food-cat]').forEach(x=>x.classList.toggle('is-active',x===b));renderFoods()});
 $('#food-library-search').addEventListener('input',e=>{foodQuery=e.target.value.toLowerCase().trim();renderFoods()});
}

const TABLE=[0,1,2,3,4,5,9,14];let wheelIndex=0;
function spinWheel(step=0){wheelIndex=(wheelIndex+step+TABLE.length)%TABLE.length;const span=360/TABLE.length;const ring=$('#dastarkhan-orbit');
 ring.innerHTML=TABLE.map((j,i)=>{const a=i*span-90,rad=a*Math.PI/180,d=DISHES[j];return `<button class="table-food-spot ${i===wheelIndex?'is-selected':''}" type="button" data-wheel-index="${i}" style="--x:${(50+37*Math.cos(rad)).toFixed(3)}%;--y:${(50+37*Math.sin(rad)).toFixed(3)}%" aria-label="Посмотреть ${esc(d.name)}" aria-pressed="${i===wheelIndex}"><img src="${AS+d.img}" alt=""><span>${esc(d.name)}</span></button>`}).join('');
 $$('[data-wheel-index]').forEach(b=>b.onclick=()=>spinWheel(Number(b.dataset.wheelIndex)-wheelIndex));
 const d=DISHES[TABLE[wheelIndex]];$('#dastarkhan-choice').innerHTML=`<div class="table-choice-tag">БЛЮДО ${String(wheelIndex+1).padStart(2,'0')} / 08 · НА ДАСТАРХАНЕ</div><img src="${AS+d.img}" alt="${esc(d.name)}"><h3>${esc(d.name)}</h3><p>${esc(d.desc)}</p><span>${esc(d.tip)}</span>`;
}
function initTable(){$('#table-prev').onclick=()=>spinWheel(-1);$('#table-next').onclick=()=>spinWheel(1);spinWheel();$('#dastarkhan-orbit').addEventListener('keydown',e=>{if(e.key==='ArrowRight'){spinWheel(1);e.preventDefault()}if(e.key==='ArrowLeft'){spinWheel(-1);e.preventDefault()}})}
function init(){initPlanner();initFood();initTable()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();

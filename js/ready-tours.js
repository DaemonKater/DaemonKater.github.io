'use strict';
/* Готовые гастрономические программы на 3–5 дней.
   Все суммы являются ориентировочными расходами самостоятельных путешественников,
   а не коммерческой ценой, подтвержденным тарифом или бронированием услуг. */
(()=>{
 const $=(s,root=document)=>root.querySelector(s);
 const $$=(s,root=document)=>[...root.querySelectorAll(s)];
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const sum=n=>new Intl.NumberFormat('ru-RU').format(Math.round(n));
 const money=n=>`${sum(n)} сум`;
 const picture={
   hazrat:'assets/places/hazrat.webp',kukeldash:'assets/places/kukeldash.webp',chorsu:'assets/places/chorsu.webp',
   city:'assets/places/city.webp',minor:'assets/places/minor.webp',tower:'assets/places/tower.webp',
   besh:'assets/places/besh.webp',temur:'assets/places/temur.webp',afsona:'assets/places/afsona.webp',
   applied:'assets/places/applied.webp',metro:'assets/places/metro.webp',theatre:'assets/places/theatre.webp',
   independence:'assets/places/independence.webp',oloy:'assets/places/oloy.webp',abul:'assets/places/abul.webp',
   navoi:'assets/places/navoi.webp',caravan:'assets/places/caravan.webp'
 };
 const places={
   hazrat:{name:'Хазрати Имам',coords:[41.33731,69.24008]},kukeldash:{name:'Медресе Кукельдаш',coords:[41.32316,69.23666]},chorsu:{name:'Базар Чорсу',coords:[41.32673,69.23503]},
   city:{name:'Tashkent City Park',coords:[41.31667,69.24861]},minor:{name:'Мечеть Минор',coords:[41.335334,69.275056]},tower:{name:'Ташкентская телебашня',coords:[41.34557,69.28467]},
   besh:{name:'Центр плова Besh Qozon',coords:[41.34747,69.28489]},temur:{name:'Сквер Амира Темура',coords:[41.31009,69.27953]},afsona:{name:'Ресторан Afsona',coords:[41.2998871,69.2773014]},
   applied:{name:'Музей прикладного искусства',coords:[41.301258,69.259195]},metro:{name:'Метро «Космонавтлар»',coords:[41.305022,69.265344]},theatre:{name:'Театр Алишера Навои',coords:[41.309163,69.271548]},
   independence:{name:'Площадь Независимости',coords:[41.31539,69.26744]},oloy:{name:'Алайский базар',coords:[41.31876,69.28507]},abul:{name:'Медресе Абулкасым',coords:[41.3067,69.2399]},
   navoi:{name:'Национальный парк Навои',coords:[41.30148,69.24124]},caravan:{name:'Ресторан Caravan',coords:[41.28514,69.2576]}
 };
 // Все часы — предлагаемый дневной план. Буферы учитывают свободное время, очереди и приблизительные переезды.
 const DAYS=[
  {name:'Сердце старого Ташкента',subtitle:'История, тандыр и рынок Чорсу',cover:'chorsu',label:'СТАРЫЙ ГОРОД',highlight:'Только что испечённая самса, лепёшка нон и пёстрые торговые ряды.',food:155000,tickets:15000,localCar:115000,
   events:[
    {at:'09:00',end:'09:50',place:'kukeldash',kind:'Архитектура',title:'Медресе Кукельдаш',do:'Пройди по старым улицам, посмотри портал и кирпичную кладку, сделай фотографии с разрешённых точек.',taste:'По дороге найди уличную пекарню с ароматным ноном.',tip:'Не заходи в помещения без разрешения и не фотографируй людей против их воли.',travel:'До Хазрати Имам — ориентировочно 15–25 минут на машине или такси.'},
    {at:'10:15',end:'11:20',place:'hazrat',kind:'Культура',title:'Хазрати Имам после Кукельдаша',do:'Осмотри площадь, медресе и архитектурные детали. Узнай, какую роль старый город играл в истории Ташкента.',taste:'Перед продолжением маршрута — вода или чай.',tip:'Соблюдай спокойствие и требования к одежде; внутрь заходи только когда разрешено.',travel:'До Чорсу — ориентировочно 10–15 минут на машине или такси.'},
    {at:'11:25',end:'12:20',place:'chorsu',kind:'Рынок',title:'Экспедиция по Чорсу',do:'Пройди купол, ряды со специями и сухофруктами. Сравни курагу, орехи и разновидности халвы.',taste:'Попробуй сухофрукты, нават и свежий нон — цену согласуй до дегустации.',tip:'Не рассчитывай, что проба бесплатна; сначала уточни стоимость и вес.',travel:'Остаёмся на рынке — обеденные ряды рядом.'},
    {at:'12:20',end:'13:20',place:'chorsu',kind:'Обед',title:'Самса и базарный обед',do:'Выбери оживлённую точку с видимым приготовлением и чистой подачей; устрой неспешный обед.',taste:'Тандырная самса, нон, зелёный чай; по аппетиту — шурпа.',tip:'Не бери всё сразу: порции могут оказаться большими.',travel:'После обеда заложено свободное время, затем около 20–35 минут на такси.'},
    {at:'14:00',end:'15:30',place:'chorsu',kind:'Свободное время',title:'Сувениры со смыслом',do:'Посмотри узбекскую керамику, чайники, ткани и пряности. Выбирай вещи, которыми будешь действительно пользоваться.',taste:'По желанию — чай с небольшим десертом.',tip:'Уточни состав, срок годности и правила провоза продуктов домой.',travel:'Затем переезд в Tashkent City — ориентировочно 20–35 минут.'},
    {at:'16:00',end:'18:00',place:'city',kind:'Прогулка',title:'Современный вечерний Ташкент',do:'Прогуляйся по парку, сравни старый и современный облик города, заверши день фотографиями.',taste:'Десерт или чай в заведении по выбору.',tip:'Расписание фонтанов и мероприятий зависит от сезона и дня недели.',travel:'Возвращение в отель самостоятельно; при заказе такси его ориентир включён в общий бюджет дня.'}
   ]},
  {name:'Большой плов и панорамы',subtitle:'Юнусабад, телебашня и кулинарный символ',cover:'besh',label:'ПЛОВ И ПАНОРАМЫ',highlight:'Плов у огромных казанов, ачичук, чай и обзор города.',food:200000,tickets:80000,localCar:175000,
   events:[
    {at:'09:30',end:'10:20',place:'minor',kind:'Архитектура',title:'Бирюзовый купол мечети Минор',do:'Рассмотри белый камень и изразцы, прогуляйся по окрестностям канала Анхор.',taste:'Утром достаточно лёгкого перекуса и чая.',tip:'Соблюдай требования действующего религиозного объекта; во время молитв доступ может быть ограничен.',travel:'До телебашни — ориентировочно 10–20 минут транспортом.'},
    {at:'10:45',end:'11:45',place:'tower',kind:'Панорама',title:'Ташкент с высоты',do:'Посмотри на телебашню и при доступности поднимись на обзорную площадку. Осмотри город перед большим обедом.',taste:'Обед запланирован следующим пунктом.',tip:'Билет и допуск на обзорную площадку нужно проверить на конкретную дату.',travel:'До центра плова — несколько минут, он рядом с башней.'},
    {at:'12:00',end:'13:20',place:'besh',kind:'Главная дегустация',title:'Плов в Besh Qozon',do:'Посмотри на приготовление в казанах, закажи порцию и сравни подачу с привычными блюдами.',taste:'Ташкентский плов, ачичук, лепёшка и зелёный чай.',tip:'Плов лучше пробовать к обеду; разновидности и наличие уточняются на месте.',travel:'После обеда 20–35 минут на такси в центральную часть города.'},
    {at:'14:10',end:'15:20',place:'temur',kind:'История города',title:'Сквер Амира Темура',do:'Прогуляйся вокруг памятника, рассмотри окружающую застройку и сделай остановку для отдыха.',taste:'Можешь попробовать лимонад или сезонный фруктовый напиток.',tip:'В жару делай перерывы в тени и бери воду.',travel:'Далее около 15–25 минут до гастрономического ужина.'},
    {at:'16:15',end:'18:00',place:'afsona',kind:'Ужин',title:'Узбекская кухня в Afsona',do:'Попробуй блюда, отличные от плова, и сравни традиционную и современную подачу.',taste:'Манты, шашлык, сезонные салаты или лагман; делитесь блюдами, чтобы попробовать больше.',tip:'Меню и наличие столиков проверяй заранее; бронь не входит в маршрут.',travel:'Ориентир на возвращение в отель включён в бюджет городского транспорта.'}
   ]},
  {name:'Искусство и вкусы столицы',subtitle:'Керамика, дворцы метро и праздничный вечер',cover:'applied',label:'ТРАДИЦИИ И СТОЛИЦА',highlight:'Сузани, станции метро, сладкий чай и вечерний город.',food:175000,tickets:55000,localCar:155000,
   events:[
    {at:'09:30',end:'10:55',place:'applied',kind:'Музей',title:'Музей прикладного искусства',do:'Открой для себя сузани, керамику, резьбу по дереву и узоры на традиционных предметах.',taste:'Позже по плану будет чайная пауза со сладостями.',tip:'Режим работы и разрешённые зоны фотосъёмки проверь заранее.',travel:'До следующей точки примерно 15–20 минут пешком/на такси.'},
    {at:'11:20',end:'12:05',place:'metro',kind:'Городское открытие',title:'Метро «Космонавтлар»',do:'Рассмотри художественное оформление станции, купи проезд и проедь одну-две остановки.',taste:'Возьми воду и небольшой перекус по желанию.',tip:'Не мешай пассажирам при фотографировании и соблюдай правила метро.',travel:'Дальше короткая прогулка либо переезд к театру.'},
    {at:'12:35',end:'13:45',place:'theatre',kind:'Обед и прогулка',title:'Театральный квартал',do:'Посмотри фасад театра Навои; пообедай в кафе центральной части города.',taste:'Попробуй лагман или шурпу с ноном; напиток на выбор.',tip:'Посещение спектакля не предполагается; при желании билеты приобретаются отдельно.',travel:'От театра до площади Независимости — около 15–25 минут пешком.'},
    {at:'14:10',end:'15:20',place:'independence',kind:'Прогулка',title:'Площадь Независимости',do:'Пройдись по центральным аллеям, узнай о современной истории страны.',taste:'Пауза на чай и нават либо мороженое в одном из кафе по дороге.',tip:'При официальных мероприятиях проход на некоторые участки может быть ограничен.',travel:'Далее 15–30 минут на такси до городского парка.'},
    {at:'16:10',end:'18:45',place:'city',kind:'Финал дня',title:'Десерты и огни Tashkent City',do:'Погуляй в современном квартале, полюбуйся подсветкой и сделай фотографии на память.',taste:'Чай, халва, нават или другой десерт; при желании лёгкий ужин.',tip:'Режим работы фонтанов и событий меняется; фактическое шоу не гарантировано.',travel:'Завершение дня. Возвращение в отель на такси включено как ориентировочный бюджет.'}
   ]},
  {name:'Рынки, ремёсла и семейный стол',subtitle:'От сезонных фруктов до тёплого ужина',cover:'oloy',label:'ЕДА И РЕМЁСЛА',highlight:'Алайский рынок, традиционные ремёсла и ужин в национальном стиле.',food:195000,tickets:20000,localCar:165000,
   events:[
    {at:'09:15',end:'10:25',place:'oloy',kind:'Утренний рынок',title:'Алайский базар',do:'Ознакомься с сезонными фруктами и продуктами: сравни сорта орехов, кураги, урюка.',taste:'Фрукты, орехи, сухофрукты и местная выпечка.',tip:'Алайский рынок не обязательно дешёвый: сначала уточни цену за килограмм.',travel:'До ремесленного квартала — ориентировочно 20–30 минут на машине.'},
    {at:'11:00',end:'12:15',place:'abul',kind:'Ремёсла',title:'Медресе Абулкасым',do:'Посмотри традиционный двор и при наличии открытых мастерских познакомься с ремёслами.',taste:'Чайная пауза, если поблизости есть открытое кафе.',tip:'Не обещаем демонстрацию мастера: доступность и участие зависят от дня.',travel:'До Национального парка Навои — около 10–15 минут.'},
    {at:'12:30',end:'13:35',place:'navoi',kind:'Отдых',title:'Садовая пауза',do:'Прогуляйся по парку, отдохни от насыщенной программы, поищи красивые детали города.',taste:'Нон и фрукты, купленные утром, можно взять с собой.',tip:'Соблюдай чистоту и выбирай подходящие места для перекуса.',travel:'Затем 20–35 минут на машине до ресторана.'},
    {at:'14:15',end:'15:45',place:'caravan',kind:'Поздний обед',title:'Обед в Caravan',do:'Выбери несколько национальных блюд на компанию и раздели их за общим столом.',taste:'Шашлык, манты, салаты, нон, зелёный чай.',tip:'Уточняй состав, аллергены и необходимость брони; фактические цены могут отличаться.',travel:'После обеда свободное время для отдыха и прогулки.'},
    {at:'17:00',end:'18:15',place:'navoi',kind:'Вечерняя прогулка',title:'Лёгкий финал дня',do:'Вернись к прогулке в спокойном ритме либо проведи свободное время неподалёку от места проживания.',taste:'Чай и лёгкий десерт по желанию.',tip:'Переезды и расписание — ориентир, который можно адаптировать под погоду.',travel:'Возвращение на такси в отель включено в оценку транспорта.'}
   ]},
  {name:'Гастрономическая коллекция',subtitle:'Последние открытия и любимые места',cover:'afsona',label:'ФИНАЛ ПУТЕШЕСТВИЯ',highlight:'Другие варианты знакомых блюд, красивые виды и подарки домой.',food:190000,tickets:20000,localCar:160000,
   events:[
    {at:'09:30',end:'10:35',place:'oloy',kind:'Сезонные вкусы',title:'Фруктовый завтрак',do:'Выбери лучшие фрукты сезона и сравни вкусы, которые встретил в предыдущие дни.',taste:'Сезонные фрукты, орехи, натуральные соки.',tip:'Сначала спрашивай стоимость; цены на рынках могут сильно меняться по сезону.',travel:'До центра примерно 15–25 минут.'},
    {at:'11:00',end:'12:00',place:'temur',kind:'Фото-остановка',title:'Главные открытки города',do:'Прогуляйся по скверу и сделай серию фотографий для личного гастропаспорта.',taste:'Чай или лимонад по пути.',tip:'При желании добавь сувенирную мастерскую сайта — она доступна бесплатно.',travel:'Далее 15–25 минут до театра и кафе.'},
    {at:'12:20',end:'13:35',place:'theatre',kind:'Обед',title:'Ещё одно блюдо из списка',do:'Выбери кафе рядом с театром и попробуй то, на что не хватило времени раньше.',taste:'Норин, чучвара, шурпа или лагман — в зависимости от меню заведения.',tip:'Блюда не гарантированы в каждом кафе; заранее проверь наличие.',travel:'После обеда около 15–30 минут транспортом.'},
    {at:'14:05',end:'15:35',place:'applied',kind:'Культура',title:'Текстиль и сувениры',do:'Вернись к мотивам узбекского искусства, подбери подарок — керамику или изделие из ткани.',taste:'Восточные сладости к чаю можно приобрести отдельно.',tip:'Вход на конкретную экспозицию оплачивается только при наличии доступа.',travel:'До вечернего ужина — около 20–30 минут.'},
    {at:'16:20',end:'18:30',place:'afsona',kind:'Прощальный ужин',title:'Дастархан впечатлений',do:'Выбери любимые блюда путешествия, обсуди впечатления и собери свой список рекомендаций.',taste:'Плов другого вида, манты, шашлык, салат ачичук и чай по вкусу.',tip:'Заведение и столик необходимо проверять и бронировать самостоятельно.',travel:'После ужина возврат к месту проживания или вокзалу/аэропорту — отдельный выбранный трансфер.'}
   ]}
 ];
 const TOURS={3:{title:'Три вкуса Ташкента',subtitle:'Самое важное без спешки',days:[0,1,2],desc:'Старый город, большой плов и культурные открытия — три разных лица столицы.'},4:{title:'Ташкент без спешки',subtitle:'Глубже в традиции и районы',days:[0,1,2,3],desc:'Добавь Алайский рынок, ремёсла и семейный обед в национальном стиле.'},5:{title:'Большое гастропутешествие',subtitle:'Пять дней, которые запоминаются',days:[0,1,2,3,4],desc:'Полная программа с дегустациями, архитектурой, рынками и свободными паузами.'}};
 let st={days:3,group:2,arrival:'none',departure:'none',activeDay:0};
 // Транспортная оценка на легковое такси до 3 гостей (без специального багажа).
 const TRANSFERS={none:{label:'Не нужен',price:0},airport:{label:'Аэропорт Ташкента',price:120000},rail:{label:'Железнодорожный вокзал',price:90000}};
 const cars=()=>Math.ceil(st.group/3);
 const chosen=()=>TOURS[st.days];
 const activeDays=()=>chosen().days.map(i=>DAYS[i]);
 const estimate=()=>{
  const list=activeDays(), perPerson=list.reduce((v,d)=>v+d.food+d.tickets,0);
  const sharedTransport=list.reduce((v,d)=>v+d.localCar,0)*cars();
  const transfers=(TRANSFERS[st.arrival].price+TRANSFERS[st.departure].price)*cars();
  const total=perPerson*st.group+sharedTransport+transfers;
  return {perPerson,sharedTransport,transfers,total,each:total/st.group,food:list.reduce((v,d)=>v+d.food,0)*st.group,tickets:list.reduce((v,d)=>v+d.tickets,0)*st.group};
 };
 const uniqueIds=day=>[...new Set(day.events.map(e=>e.place).filter(id=>places[id]))];
 const linkFor=day=>{
  const ids=uniqueIds(day),coords=ids.map(id=>places[id].coords.join(','));
  if(coords.length<2)return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(coords[0]||'Tashkent')}`;
  const p=new URLSearchParams({api:'1',origin:coords[0],destination:coords.at(-1),travelmode:'driving'});
  if(coords.length>2)p.set('waypoints',coords.slice(1,-1).join('|'));
  return 'https://www.google.com/maps/dir/?'+p.toString();
 };
 const slug=['3-dnya','4-dnya','5-dney'];
 const setText=(s,v)=>{const n=$(s);if(n)n.textContent=v};
 function render(){
  const tour=chosen(),days=activeDays(),budget=estimate();
  $$('#rt-switcher [data-rt-length]').forEach(b=>{b.classList.toggle('is-active',Number(b.dataset.rtLength)===st.days);b.setAttribute('aria-pressed',String(Number(b.dataset.rtLength)===st.days));});
  setText('#rt-title',tour.title);setText('#rt-tagline',tour.subtitle);setText('#rt-description',tour.desc);
  setText('#rt-total',money(budget.total));setText('#rt-perperson',money(budget.each));
  setText('#rt-food-cost',money(budget.food));setText('#rt-tickets-cost',money(budget.tickets));
  setText('#rt-local-cost',money(budget.sharedTransport));setText('#rt-transfer-cost',money(budget.transfers));
  setText('#rt-price-breakdown',`Расчёт для ${st.group} чел. · ${cars()} машин(ы) по 3 пассажира · ${st.days} дня(дней).`);
  setText('#rt-included-description',`В расчёте: еда и дегустации, примерные входные билеты, городской транспорт и ${st.arrival==='none'&&st.departure==='none'?'без трансфера к месту прибытия/отправления':'выбранные трансферы'}.`);
  $('#rt-day-nav').innerHTML=days.map((d,i)=>`<button type="button" class="rt-day-tab ${i===st.activeDay?'is-active':''}" data-rt-day="${i}" aria-pressed="${i===st.activeDay}"><span>ДЕНЬ ${String(i+1).padStart(2,'0')}</span><strong>${esc(d.name)}</strong><small>${d.events[0].at}–${d.events.at(-1).end}</small></button>`).join('');
  const day=days[st.activeDay];
  $('#rt-day-cover').src=picture[day.cover];$('#rt-day-cover').alt=`Художественная иллюстрация: ${day.name}`;
  setText('#rt-day-kicker',`ДЕНЬ ${st.activeDay+1} / ${st.days} · ${day.label}`);
  setText('#rt-day-title',day.name);setText('#rt-day-subtitle',day.subtitle);
  setText('#rt-day-highlight',day.highlight);
  $('#rt-timeline').innerHTML=day.events.map((e,i)=>`<article class="rt-event"><div class="rt-event-time"><strong>${e.at}</strong><small>${e.end}</small><span class="rt-event-dot" aria-hidden="true"></span></div><div class="rt-event-body"><div class="rt-event-top"><span>${esc(e.kind)}</span><strong>${esc(e.title)}</strong></div><p>${esc(e.do)}</p><div class="rt-event-notes"><span><b>Что попробовать</b>${esc(e.taste)}</span><span><b>Полезно знать</b>${esc(e.tip)}</span></div><div class="rt-event-travel">↗ ${esc(e.travel)}</div></div></article>`).join('');
  const link=$('#rt-google-day');link.href=linkFor(day);link.setAttribute('aria-label',`Открыть маршрут дня ${st.activeDay+1} в Google Картах`);
  $$('#rt-day-nav [data-rt-day]').forEach(b=>b.addEventListener('click',()=>{st.activeDay=Number(b.dataset.rtDay);render();}));
 }
 const drawRoundRect=(c,x,y,w,h,r=18)=>{c.beginPath();c.roundRect(x,y,w,h,r)};
 function coverImage(c,image,x,y,w,h){
  c.save();drawRoundRect(c,x,y,w,h,25);c.clip();const ratio=Math.max(w/image.width,h/image.height),dw=image.width*ratio,dh=image.height*ratio;c.drawImage(image,x+(w-dw)/2,y+(h-dh)/2,dw,dh);c.restore();
 }
 function image(src){return new Promise(resolve=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>resolve(null);img.src=src;});}
 function wrap(c,str,x,y,maxwidth,lineHeight,maxlines=99){
  str=window.TasteI18n?.t(String(str))||String(str);
  let line='',lines=0;const words=String(str).split(/\s+/);
  for(let i=0;i<words.length;i++){
   const next=line?line+' '+words[i]:words[i];
   if(c.measureText(next).width>maxwidth&&line){if(lines>=maxlines-1){let text=line;while(c.measureText(text+'…').width>maxwidth&&text.length)text=text.slice(0,-1);c.fillText(text+'…',x,y);return y+lineHeight;}c.fillText(line,x,y);y+=lineHeight;lines++;line=words[i]}
   else line=next;
  }
  if(line){c.fillText(line,x,y);y+=lineHeight;}return y;
 }
 function page(){const c=document.createElement('canvas');c.width=1000;c.height=1414;return [c,c.getContext('2d')];}
 const PAL={ink:'#163b37',dark:'#063d3c',teal:'#096e6a',gold:'#f2bd63',cream:'#fff8eb',oat:'#f4e9d4',coral:'#be553a',muted:'#65776f'};
 function base(c,number,label){
  c.fillStyle=PAL.cream;c.fillRect(0,0,1000,1414);c.strokeStyle='#e7b56b';c.lineWidth=3;c.strokeRect(29,29,942,1356);
  c.fillStyle=PAL.dark;c.fillRect(0,0,1000,100);c.fillStyle=PAL.gold;c.font='800 19px Manrope,Arial,sans-serif';c.textAlign='left';c.fillText('✳   ВКУСНЫЙ ТАШКЕНТ',66,62);
  c.font='600 15px Manrope,Arial,sans-serif';c.fillText(label.toUpperCase(),645,61);
  c.fillStyle=PAL.muted;c.font='500 14px Manrope,Arial,sans-serif';c.fillText('ГАСТРОНОМИЧЕСКИЙ ПУТЕВОДИТЕЛЬ   /   2026',65,1370);
  c.textAlign='right';c.fillText(String(number).padStart(2,'0'),925,1370);c.textAlign='left';
 }
 const diamond=(c,x,y,r,color)=>{c.save();c.translate(x,y);c.rotate(Math.PI/4);c.fillStyle=color;c.fillRect(-r/2,-r/2,r,r);c.restore();};
 async function makeCover(tour){
  const [cv,c]=page();base(c,1,'путешествие по Ташкенту');
  const img=await image(picture.chorsu);if(img)coverImage(c,img,53,161,894,535);
  let grad=c.createLinearGradient(0,365,0,710);grad.addColorStop(0,'#07372d00');grad.addColorStop(1,'#062c2de6');c.fillStyle=grad;c.fillRect(53,340,894,356);
  c.fillStyle=PAL.gold;c.font='800 20px Manrope,Arial,sans-serif';c.fillText(`ГОТОВЫЙ МАРШРУТ   •   ${st.days} ${st.days===5?'ДНЕЙ':'ДНЯ'}`,88,522);
  c.fillStyle='#fff8e8';c.font='700 66px Georgia,serif';c.fillText('Вкусный Ташкент',87,613);
  c.fillStyle='#ffda96';c.font='600 27px Manrope,Arial,sans-serif';c.fillText(tour.title,90,661);
  c.fillStyle=PAL.dark;c.font='700 46px Georgia,serif';c.fillText(tour.subtitle,68,783);
  c.fillStyle=PAL.muted;c.font='400 25px Manrope,Arial,sans-serif';wrap(c,tour.desc,70,837,846,37,3);
  drawRoundRect(c,64,923,870,201,22);c.fillStyle='#edf1e5';c.fill();
  const budget=estimate();
  const stats=[['ДНЕЙ',String(st.days)],['ПУТЕШЕСТВЕННИКОВ',String(st.group)],['НА ЧЕЛОВЕКА',money(budget.each)],['НА ГРУППУ',money(budget.total)]];
  stats.forEach(([label,value],i)=>{const x=87+i*217;c.fillStyle=PAL.muted;c.font='700 13px Manrope,Arial,sans-serif';c.fillText(label,x,972);c.fillStyle=PAL.dark;c.font=`700 ${i>=2?'21':'35'}px Manrope,Arial,sans-serif`;c.fillText(value,x,1024);if(i<3){c.strokeStyle='#c9d9ca';c.beginPath();c.moveTo(x+196,958);c.lineTo(x+196,1082);c.stroke();}});
  c.fillStyle=PAL.dark;c.font='700 26px Georgia,serif';c.fillText('День за днём — всё уже продумано',68,1190);
  c.fillStyle=PAL.muted;c.font='400 18px Manrope,Arial,sans-serif';wrap(c,'Точное время по программе, что увидеть и попробовать, советы и кликабельная навигация в Google Картах. Предложенный план можно адаптировать под погоду и часы работы.',68,1234,855,27,4);
  return {canvas:cv,links:[]};
 }
 async function makeDay(day,number,index){
  const [cv,c]=page();base(c,number,`день ${index+1} / ${st.days}`);
  const photo=await image(picture[day.cover]);if(photo)coverImage(c,photo,55,170,325,257);
  c.fillStyle=PAL.coral;c.font='800 17px Manrope,Arial,sans-serif';c.fillText(`ДЕНЬ ${String(index+1).padStart(2,'0')}  /  ${day.label}`,410,203);
  c.fillStyle=PAL.dark;c.font='700 37px Georgia,serif';wrap(c,day.name,410,273,523,45,2);
  c.fillStyle=PAL.muted;c.font='500 20px Manrope,Arial,sans-serif';wrap(c,day.subtitle,410,355,508,30,2);
  drawRoundRect(c,67,452,866,77,12);c.fillStyle='#e7eee3';c.fill();c.fillStyle=PAL.teal;c.font='700 19px Manrope,Arial,sans-serif';wrap(c,'✳  '+day.highlight,88,496,810,27,2);
  c.fillStyle=PAL.dark;c.font='700 26px Georgia,serif';c.fillText('Программа и время',67,578);
  const evs=day.events;
  const available=630,top=600;let rowH=Math.min(126,Math.floor(available/evs.length));
  c.strokeStyle='#b5c9b9';c.lineWidth=3;c.beginPath();c.moveTo(115,top+18);c.lineTo(115,top+evs.length*rowH-18);c.stroke();
  evs.forEach((e,i)=>{
   const y=top+i*rowH;drawRoundRect(c,130,y,799,rowH-9,14);c.fillStyle=i%2?'#f5ebd8':'#eff1e7';c.fill();
   c.beginPath();c.arc(115,y+31,18,0,Math.PI*2);c.fillStyle=i%2?PAL.coral:PAL.teal;c.fill();
   c.fillStyle='#fff';c.font='700 15px Manrope,Arial,sans-serif';c.textAlign='center';c.fillText(String(i+1),115,y+37);c.textAlign='left';
   c.fillStyle=PAL.coral;c.font='800 19px Manrope,Arial,sans-serif';c.fillText(`${e.at}—${e.end}`,152,y+25);
   c.fillStyle=PAL.dark;c.font='700 22px Manrope,Arial,sans-serif';c.fillText(e.title,371,y+25);
   c.fillStyle='#4d6259';c.font='500 17px Manrope,Arial,sans-serif';wrap(c,e.do,152,y+55,735,22,2);
   // Дегустации и рекомендации представлены отдельно на следующей странице.
  });
  drawRoundRect(c,76,1257,848,73,12);c.fillStyle=PAL.teal;c.fill();c.fillStyle='#fff8ea';c.font='800 23px Manrope,Arial,sans-serif';c.textAlign='center';c.fillText(`ОТКРЫТЬ ДЕНЬ ${index+1} В GOOGLE КАРТАХ   ↗`,500,1303);c.textAlign='left';
  c.fillStyle=PAL.muted;c.font='500 15px Manrope,Arial,sans-serif';c.fillText('Время и переезды примерные. Еда, советы и логистика — на следующей странице.',77,1244);
  return {canvas:cv,links:[{url:linkFor(day),rect:[76,1257,848,73]}]};
 }
 async function makeDayDetails(day,number,index){
   const [cv,c]=page();base(c,number,`советы · день ${index+1}`);
   c.fillStyle=PAL.dark;c.font='700 47px Georgia,serif';c.fillText('Вкусы и полезные советы',61,202);
   c.fillStyle=PAL.coral;c.font='800 18px Manrope,Arial,sans-serif';c.fillText(`ДЕНЬ ${index+1} / ${st.days}  •  ${day.label}`,65,247);
   const photo=await image(picture[day.cover]);if(photo)coverImage(c,photo,64,278,864,198);
   const evs=day.events,rowHeight=118,start=512;
   evs.forEach((e,i)=>{
     const y=start+i*rowHeight;
     drawRoundRect(c,67,y,865,109,12);c.fillStyle=i%2===0?'#f0ede0':'#f8ebd9';c.fill();
     c.fillStyle=PAL.coral;c.font='800 15px Manrope,Arial,sans-serif';c.fillText(e.at,84,y+29);
     c.fillStyle=PAL.dark;c.font='800 20px Manrope,Arial,sans-serif';c.fillText(e.title,172,y+29);
     c.fillStyle=PAL.teal;c.font='700 13px Manrope,Arial,sans-serif';c.fillText('ПОПРОБОВАТЬ',87,y+52);c.fillText('ПОЛЕЗНО ЗНАТЬ',491,y+52);
     c.fillStyle=PAL.ink;c.font='500 15px Manrope,Arial,sans-serif';
     wrap(c,e.taste,87,y+72,374,19,2);wrap(c,e.tip,492,y+72,413,19,2);
   });
   drawRoundRect(c,76,1258,850,68,11);c.fillStyle=PAL.teal;c.fill();c.fillStyle='#fff8ea';c.font='800 23px Manrope,Arial,sans-serif';c.textAlign='center';c.fillText(`НАВИГАЦИЯ ПО ДНЮ ${index+1} В GOOGLE КАРТАХ  ↗`,500,1301);c.textAlign='left';
   return {canvas:cv,links:[{url:linkFor(day),rect:[76,1258,850,68]}]};
 }
 async function makeBudget(number){
  const [cv,c]=page();base(c,number,'расходы и трансферы');const b=estimate();
  c.fillStyle=PAL.dark;c.font='700 54px Georgia,serif';c.fillText('Бюджет путешествия',63,213);
  c.fillStyle=PAL.muted;c.font='500 22px Manrope,Arial,sans-serif';wrap(c,'Предварительная смета для самостоятельной поездки — не ценовое предложение туроператора.',67,262,850,33,2);
  drawRoundRect(c,65,329,865,190,19);c.fillStyle=PAL.dark;c.fill();
  c.fillStyle='#e7ca8f';c.font='700 19px Manrope,Arial,sans-serif';c.fillText('ИТОГО НА ГРУППУ',94,382);c.fillText('В СРЕДНЕМ НА ЧЕЛОВЕКА',523,382);
  c.fillStyle='#fff7e5';c.font='700 45px Manrope,Arial,sans-serif';c.fillText(money(b.total),95,457);c.font='700 35px Manrope,Arial,sans-serif';c.fillText(money(b.each),524,457);
  const rows=[['Питание, напитки, дегустации',b.food],['Входные билеты (оценка)',b.tickets],['Местные поездки по городу',b.sharedTransport],['Встреча и обратный трансфер',b.transfers]];
  rows.forEach(([label,v],i)=>{const y=606+i*105;c.fillStyle=i%2?'#eaf0e5':'#f3e9d7';drawRoundRect(c,67,y,863,87,12);c.fill();c.fillStyle=PAL.dark;c.font='600 22px Manrope,Arial,sans-serif';c.fillText(label,91,y+55);c.textAlign='right';c.font='700 23px Manrope,Arial,sans-serif';c.fillText(money(v),904,y+55);c.textAlign='left'});
  c.fillStyle=PAL.dark;c.font='700 28px Georgia,serif';c.fillText('Трансфер: что учтено',70,1095);
  c.fillStyle=PAL.muted;c.font='500 19px Manrope,Arial,sans-serif';
  const arr=`Встреча: ${TRANSFERS[st.arrival].label}. Обратный путь: ${TRANSFERS[st.departure].label}. На группу ${st.group} чел. заложено ${cars()} такси, до 3 пассажиров в каждом.`;
  wrap(c,arr,71,1137,851,29,3);
  c.fillStyle=PAL.coral;c.font='700 19px Manrope,Arial,sans-serif';c.fillText('Не включено:',70,1241);
  c.fillStyle=PAL.muted;c.font='500 16px Manrope,Arial,sans-serif';wrap(c,'Отель, авиабилеты, поезд, услуги гида, бронирования и дополнительные покупки. Трансфер учтён в смете, но не заказан. Проверяй цены и доступность перед поездкой.',70,1275,846,24,3);
  const links=activeDays().map((d,i)=>({url:linkFor(d),rect:[68,1340-2,0,0]})); // ссылки уже встроены в страницы дней
  return {canvas:cv,links};
 }
 function pdfBuild(pages){
  const enc=new TextEncoder(),chunks=[],positions=[0];let size=0;
  function add(bytes){const b=typeof bytes==='string'?enc.encode(bytes):bytes;chunks.push(b);size+=b.length}
  function obj(id,parts){positions[id]=size;add(`${id} 0 obj\n`);(Array.isArray(parts)?parts:[parts]).forEach(add);add('\nendobj\n')}
  const escapeURL=url=>url.replace(/[()\\]/g,s=>'\\'+s);
  add('%PDF-1.4\n%\xC2\xA5\xC2\xB1\n');
  const pageNumbers=pages.map((_,i)=>3+i*6);
  obj(1,'<< /Type /Catalog /Pages 2 0 R >>');
  obj(2,`<< /Type /Pages /Kids [${pageNumbers.map(n=>`${n} 0 R`).join(' ')}] /Count ${pages.length} >>`);
  pages.forEach((page,i)=>{
   const p=pageNumbers[i],canvas=page.canvas,links=page.links.filter(l=>l.rect[2]>0&&l.rect[3]>0),jpg=Uint8Array.from(atob(canvas.toDataURL('image/jpeg',.92).split(',')[1]),c=>c.charCodeAt(0));
   const ann=links.map((_,j)=>`${p+3+j} 0 R`).join(' ');
   obj(p,`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources << /XObject << /Img ${p+2} 0 R >> >> /Contents ${p+1} 0 R /Annots [${ann}] >>`);
   const cmd='q 595.28 0 0 841.89 0 0 cm /Img Do Q\n';
   obj(p+1,`<< /Length ${enc.encode(cmd).length} >>\nstream\n${cmd}endstream`);
   obj(p+2,[`<< /Type /XObject /Subtype /Image /Width ${canvas.width} /Height ${canvas.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpg.length} >>\nstream\n`,jpg,'\nendstream']);
   links.forEach((l,j)=>{
    const [x,y,w,h]=l.rect,rect=[x*.59528,(1414-y-h)*841.89/1414,(x+w)*.59528,(1414-y)*841.89/1414];
    obj(p+3+j,`<< /Type /Annot /Subtype /Link /Rect [${rect.map(n=>n.toFixed(2)).join(' ')}] /Border [0 0 0] /A << /S /URI /URI (${escapeURL(l.url)}) >> >>`);
   });
   for(let j=links.length;j<3;j++)obj(p+3+j,'<< /Type /Annot /Subtype /Text /Rect [0 0 1 1] /Contents () /F 2 >>');
  });
  const count=3+pages.length*6,at=size;add(`xref\n0 ${count}\n0000000000 65535 f \n`);
  for(let i=1;i<count;i++)add(`${String(positions[i]).padStart(10,'0')} 00000 n \n`);
  add(`trailer\n<< /Root 1 0 R /Size ${count} >>\nstartxref\n${at}\n%%EOF`);
  return new Blob(chunks,{type:'application/pdf'});
 }
 function save(blob,filename){const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),4000);}
 async function exportPDF(){
  const btn=$('#rt-download'),old=btn.innerHTML;
  try{btn.disabled=true;btn.textContent='Создаём красивый PDF…';await document.fonts?.ready;
   const pages=[await makeCover(chosen())];for(let i=0;i<st.days;i++){pages.push(await makeDay(activeDays()[i],2+i*2,i));pages.push(await makeDayDetails(activeDays()[i],3+i*2,i));}pages.push(await makeBudget(st.days*2+2));
   save(pdfBuild(pages),`Vkusny-Tashkent-Gotovyj-Tur-${st.days}-dney-${st.group}-chelovek.pdf`);
   btn.textContent='PDF скачан ✓';setTimeout(()=>{btn.innerHTML=old},1500);
  }catch(e){console.error('ready tours PDF error',e);btn.textContent='Не удалось создать PDF';setTimeout(()=>{btn.innerHTML=old},2000);}
  finally{btn.disabled=false;}
 }
 function toPlanner(){
  if(!window.TasteExplorer){$('#planner')?.scrollIntoView({behavior:'smooth'});return}
  const select=$('#planner-day-count');select.value=String(st.days);select.dispatchEvent(new Event('change',{bubbles:true}));
  activeDays().forEach((day,i)=>{
    window.TasteExplorer.chooseDay(i);
    window.TasteExplorer.setTourStops(uniqueIds(day));
  });
  window.TasteExplorer.chooseDay(0);
  $('#planner')?.scrollIntoView({behavior:'smooth',block:'start'});
 }
 function init(){
  if(!$('#ready-tours'))return;
  $$('#rt-switcher [data-rt-length]').forEach(b=>b.onclick=()=>{st.days=Number(b.dataset.rtLength);st.activeDay=0;render();});
  $('#rt-group').value=String(st.group);$('#rt-group').onchange=e=>{st.group=Math.min(8,Math.max(1,Number(e.target.value)||2));render()};
  $('#rt-arrival').onchange=e=>{st.arrival=e.target.value;render()};
  $('#rt-departure').onchange=e=>{st.departure=e.target.value;render()};
  $('#rt-download').onclick=exportPDF;
  $('#rt-open-planner').onclick=toPlanner;
  render();
  window.TasteReadyTours={getEstimate:()=>({...estimate(),group:st.group,days:st.days}),getDays:()=>activeDays(),navigation:()=>activeDays().map(linkFor)};
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();

'use strict';
/* Client-side localization. Original Russian content remains the source of truth.
   Locale dictionaries are shipped locally, including itinerary and cuisine descriptions. */
(() => {
  const dictionaries=window.TASTE_DICTIONARY||{en:{},uz:{}};
  const valid=['ru','uz','en'];
  let locale='ru';
  try { const saved=localStorage.getItem('taste-tashkent-lang');if(valid.includes(saved))locale=saved; } catch(e) {}
  const nodeCache=new WeakMap(), attrCache=new WeakMap();
  let busy=false, queued=false;
  const ruLetters=/[А-Яа-яЁё]/;
  const patterns={
    en:{
      day:n=>`DAY ${n}`,days:n=>`${n} days`,stop:n=>`${n} stops`,place:n=>`${n} places`,people:n=>`${n} people`,hour:n=>`${n} hours`
    },
    uz:{
      day:n=>`${n}-KUN`,days:n=>`${n} kun`,stop:n=>`${n} ta bekat`,place:n=>`${n} ta joy`,people:n=>`${n} kishi`,hour:n=>`${n} soat`
    }
  };
  function translate(value,lang=locale){
    if(typeof value!=='string'||lang==='ru'||!value)return value;
    const d=dictionaries[lang]||{}, original=value;
    const trimmed=value.trim();
    if(Object.prototype.hasOwnProperty.call(d,trimmed))return value.replace(trimmed,d[trimmed]);
    const wrap=fn=>value.replace(trimmed,fn(trimmed));
    let m;
    // Markers and decorative glyphs are separate from the translated sentence.
    const ornament=trimmed.match(/^([^А-Яа-яЁё]+)([А-Яа-яЁё].*)$/);
    if(ornament&&d[ornament[2]])return wrap(()=>ornament[1]+d[ornament[2]]);
    if(trimmed.includes(' · ')&&!/^МАРШРУТ\s*\d+\s*·/.test(trimmed)){
      const pieces=trimmed.split(' · '),localized=pieces.map(piece=>translate(piece,lang));
      if(localized.some((x,i)=>x!==pieces[i]))return wrap(()=>localized.join(' · '));
    }
    if((m=trimmed.match(/^([◎✦↗◷]\s*)(.+)$/))){
      const translated=translate(m[2],lang);
      if(translated!==m[2])return wrap(()=>m[1]+translated);
    }
    if((m=trimmed.match(/^◷\s*(\d+–\d+)\s*(?:часа|часов)\s*·\s*(\d+)\s*(?:остановок|остановки|остановка)$/))){
      return wrap(()=>lang==='en'?`◷ ${m[1]} hours · ${m[2]} stops`:`◷ ${m[1]} soat · ${m[2]} ta bekat`);
    }
    if((m=trimmed.match(/^(\d+)\s+остановок в поездке$/)))return wrap(()=>lang==='en'?`${m[1]} stops in your trip`:`Sayohatda ${m[1]} ta bekat`);
    if((m=trimmed.match(/^(?:ДЕНЬ|День|день)\s*(\d+)\s*·\s*(\d+)\s*выбрано$/))){
      return wrap(()=>lang==='en'?`DAY ${m[1]} · ${m[2]} selected`:`${m[1]}-KUN · ${m[2]} ta tanlandi`);
    }
    if((m=trimmed.match(/^ДЕНЬ\s*(\d+)\s*\/\s*(\d+)\s*·\s*(.+)$/))){
      return wrap(()=>lang==='en'?`DAY ${m[1]} / ${m[2]} · ${translate(m[3],lang)}`:`${m[1]}-KUN / ${m[2]} · ${translate(m[3],lang)}`);
    }
    if((m=trimmed.match(/^БЛЮДО\s*(\d+)\s*\/\s*(\d+)\s*·\s*НА ДАСТАРХАНЕ$/)))return wrap(()=>lang==='en'?`DISH ${m[1]} / ${m[2]} · ON THE DASTARKHAN`:`TAOM ${m[1]} / ${m[2]} · DASTURXONDA`);
    if((m=trimmed.match(/^УЗБЕКСКАЯ КУХНЯ\s*·\s*(\d+)\s*\/\s*(\d+)$/)))return wrap(()=>lang==='en'?`UZBEK CUISINE · ${m[1]} / ${m[2]}`:`OʻZBEK TAOMLARI · ${m[1]} / ${m[2]}`);
    if((m=trimmed.match(/^МАРШРУТ\s*(\d+)\s*·\s*(.+)$/))){ const kicker=m[2],normal=kicker[0]+kicker.slice(1).toLocaleLowerCase('ru-RU'),localized=translate(kicker,lang)===kicker?translate(normal,lang):translate(kicker,lang);return wrap(()=>`${lang==='en'?'ROUTE':'MARSHRUT'} ${m[1]} · ${localized.toUpperCase()}`); }
    if((m=trimmed.match(/^ОТКРЫТЬ ДЕНЬ\s*(\d+)\s*В GOOGLE КАРТАХ\s*↗$/)))return wrap(()=>lang==='en'?`OPEN DAY ${m[1]} IN GOOGLE MAPS ↗`:`${m[1]}-KUNNI GOOGLE XARITALARDA OCHISH ↗`);
    if((m=trimmed.match(/^ГОТОВЫЙ МАРШРУТ\s*[•·]\s*(\d+)\s*(?:ДНЯ|ДНЕЙ)$/)))return wrap(()=>lang==='en'?`READY ITINERARY · ${m[1]} DAYS`:`TAYYOR MARSHRUT · ${m[1]} KUN`);
    if((m=trimmed.match(/^ГАСТРОНОМИЧЕСКИЙ ПУТЕВОДИТЕЛЬ\s*\/\s*(\d+)$/)))return wrap(()=>lang==='en'?`FOOD TRAVEL GUIDE / ${m[1]}`:`GASTRONOMIK QOʻLLANMA / ${m[1]}`);
    if((m=trimmed.match(/^ВОПРОС\s*(\d+)\s*\/\s*(\d+)$/)))return wrap(()=>lang==='en'?`QUESTION ${m[1]} / ${m[2]}`:`SAVOL ${m[1]} / ${m[2]}`);
    if((m=trimmed.match(/^(?:ДЕНЬ|День|день)\s*(\d+)(.*)$/))){
      let rest=m[2].replace(/ДНЯ|ДНЕЙ/g,lang==='en'?'DAYS':'KUN');
      rest=rest.replace(/(\/\s*)([А-ЯЁ][А-ЯЁ\s]+)/g,(all,slash,label)=>slash+translate(label.trim(),lang));
      return wrap(()=>patterns[lang].day(m[1])+rest);
    }
    if((m=trimmed.match(/^(\d+)\s*(?:остановок|остановки|остановка)$/)))return wrap(()=>patterns[lang].stop(m[1]));
    if((m=trimmed.match(/^(\d+)\s*(?:мест|места|место)$/)))return wrap(()=>patterns[lang].place(m[1]));
    if((m=trimmed.match(/^(\d+)\s*(?:дней|дня|день)$/)))return wrap(()=>patterns[lang].days(m[1]));
    if((m=trimmed.match(/^(\d+)\s*(?:часов|часа|час)$/)))return wrap(()=>patterns[lang].hour(m[1]));
    if((m=trimmed.match(/^(\d+)\s*(?:человек|человека|чел\.)$/)))return wrap(()=>patterns[lang].people(m[1]));
    if((m=trimmed.match(/^(\d[\d \u00a0]*)(?:\s*)(сум)$/)))return wrap(()=>m[1]+' '+(lang==='uz'?'soʻm':'UZS'));
    if((m=trimmed.match(/^(\d+)\s*из\s*5$/)))return wrap(()=>lang==='en'?`${m[1]} of 5`:`5 tadan ${m[1]} tasi`);
    if((m=trimmed.match(/^ОТКРЫТО ВКУСОВ:\s*(\d+)\s*ИЗ\s*5$/)))return wrap(()=>lang==='en'?`FLAVORS DISCOVERED: ${m[1]} OF 5`:`KASHF ETILGAN TAʼMLAR: 5 TADAN ${m[1]} TASI`);
    if((m=trimmed.match(/^\s*(\d+)\s*\/\s*5\s*ВКУСОВ$/)))return wrap(()=>lang==='en'?`${m[1]} / 5 FLAVORS`:`5 TAʼMDAN ${m[1]} TASI`);
    if((m=trimmed.match(/^◷\s*(\d+–\d+)\s*(?:часов|часа)$/)))return wrap(()=>lang==='en'?`◷ ${m[1]} hours`:`◷ ${m[1]} soat`);
    if((m=trimmed.match(/^Расчёт для (\d+) чел\. · (\d+) машин\(ы\) по 3 пассажира · (\d+) дня\(дней\)\.$/)))return wrap(()=>lang==='en'?`Estimate for ${m[1]} people · ${m[2]} taxis (3 passengers each) · ${m[3]} days.`:`${m[1]} kishi uchun hisob · ${m[2]} ta taksi (har birida 3 yoʻlovchi) · ${m[3]} kun.`);
    if(trimmed.startsWith('В расчёте: еда и дегустации, примерные входные билеты, городской транспорт и ')){
      const end=trimmed.includes('без трансфера')?(lang==='en'?'no airport or station transfer':'aeroport yoki vokzal transferisiz'):(lang==='en'?'selected transfers':'tanlangan transferlar');
      return wrap(()=>lang==='en'?`The estimate includes food and tastings, admission fees, local transport and ${end}.`:`Hisobga ovqat va degustatsiyalar, kirish chiptalari, shahar transporti va ${end} kiritilgan.`);
    }
    if((m=trimmed.match(/^Встреча:\s*([^.]*)\. Обратный путь:\s*([^.]*)\. На группу\s*(\d+)\s*чел\. заложено\s*(\d+)\s*такси, до 3 пассажиров в каждом\.$/))){
      return wrap(()=>lang==='en'?`Arrival: ${translate(m[1],lang)}. Departure: ${translate(m[2],lang)}. For ${m[3]} travelers, ${m[4]} taxis are estimated (up to 3 passengers each).`:`Kelish: ${translate(m[1],lang)}. Ketish: ${translate(m[2],lang)}. ${m[3]} kishi uchun ${m[4]} ta taksi hisoblangan (har birida 3 yoʻlovchigacha).`);
    }
    // Translate embedded headings in phrases assembled by template literals.
    let changed=false,result=value;
    const common=[
      ['Что попробовать','What to taste','Nimani tatib koʻrish'],
      ['Полезно знать','Good to know','Foydali maʼlumot'],
      ['День','Day','Kun'],
      [' в Google Картах',' in Google Maps',' Google Xaritalarda'],
      [' в день ',' to day ',' kunga '],
      ['Художественная иллюстрация:','Artistic illustration:','Badiiy tasvir:'],
      ['Убрать из дня ','Remove from day ','Kundan olib tashlash '],
      ['Добавить в день ','Add to day ','Kunga qoʻshish '],
      ['Открыть маршрут дня ','Open day ','Kun '],
      [' места',' places',' ta joy'],
      [' мест',' places',' ta joy']
    ];
    for(const pair of common){
      if(result.includes(pair[0])){result=result.split(pair[0]).join(lang==='en'?pair[1]:pair[2]);changed=true;}
    }
    if(changed && (!ruLetters.test(result)||result.length<original.length))return result;
    return original; // Never fabricate a translation when there is no validated phrase.
  }
  function updateNode(node){
    if(!node||!node.parentElement||node.parentElement.closest('script,style,noscript,textarea,code,pre,[contenteditable="true"]'))return;
    const current=node.nodeValue;
    if(!current||!current.trim())return;
    let stored=nodeCache.get(node);
    if(!stored||current!==stored.last){stored={ru:current,last:current};nodeCache.set(node,stored);}
    const next=translate(stored.ru);
    if(next!==current){node.nodeValue=next;stored.last=next;}
  }
  function updateAttrs(el){
    if(!el||el.nodeType!==1)return;
    let state=attrCache.get(el);
    if(!state){state={};attrCache.set(el,state);}
    ['placeholder','aria-label','title','alt'].forEach(attr=>{
      const current=el.getAttribute(attr);if(current===null)return;
      if(!state[attr]||state[attr].last!==current)state[attr]={ru:current,last:current};
      const next=translate(state[attr].ru);
      if(next!==current){el.setAttribute(attr,next);state[attr].last=next;}
    });
  }
  function walk(root=document){
    if(root.nodeType===3){updateNode(root);return;}
    if(root.nodeType!==1&&root.nodeType!==9&&root.nodeType!==11)return;
    if(root.nodeType===1)updateAttrs(root);
    const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT|NodeFilter.SHOW_ELEMENT);
    let node;
    while((node=w.nextNode())){if(node.nodeType===3)updateNode(node);else updateAttrs(node);}
  }
  function refresh(){
    if(busy)return;
    busy=true;
    try{
      walk(document.body);
      if(document.title!==translate('Вкусный Ташкент — фуд-туры по столице Узбекистана'))document.title=translate('Вкусный Ташкент — фуд-туры по столице Узбекистана');
      const select=document.getElementById('taste-language');if(select)select.value=locale;
      document.documentElement.lang=langTag();
      document.documentElement.dataset.siteLang=locale;
    }finally{busy=false;}
  }
  function schedule(){if(queued)return;queued=true;queueMicrotask(()=>{queued=false;refresh();});}
  function langTag(){return locale==='uz'?'uz-Latn':locale;}
  function setLanguage(next){
    if(!valid.includes(next))return;
    locale=next;
    try{localStorage.setItem('taste-tashkent-lang',locale)}catch(e){}
    const input=document.querySelector('#souvenir-name');
    const defaults=['Мой вкусный Ташкент','My tasty Tashkent','Mening mazali Toshkentim'];
    if(input&&defaults.includes(input.value))input.value=locale==='en'?defaults[1]:locale==='uz'?defaults[2]:defaults[0];
    refresh();
    // The postcard text is rendered to Canvas; repaint it when the locale changes.
    input?.dispatchEvent(new Event('input',{bubbles:true}));
    window.dispatchEvent(new CustomEvent('taste:language',{detail:{language:locale}}));
    schedule();
  }
  window.TasteI18n={t:translate,get language(){return locale},setLanguage,refresh};
  // Canvas is used for downloadable PDFs and souvenirs. Translate its text too.
  if(typeof CanvasRenderingContext2D!=='undefined'){
    const proto=CanvasRenderingContext2D.prototype,base=proto.fillText;
    proto.fillText=function(text,...rest){return base.call(this,translate(String(text)),...rest);};
  }
  function init(){
    const host=document.querySelector('.header-inner');
    if(!host)return;
    const anchor=host.querySelector('.nav-cta');
    const label=document.createElement('label');label.className='lang-switch';label.setAttribute('for','taste-language');
    const caption=document.createElement('span');caption.className='visually-hidden';caption.textContent='Язык сайта / Site language / Sayt tili';label.appendChild(caption);
    const select=document.createElement('select');select.id='taste-language';select.setAttribute('aria-label','Язык сайта / Site language / Sayt tili');
    select.innerHTML='<option value="ru">🇷🇺 RU</option><option value="uz">🇺🇿 UZ</option><option value="en">🇬🇧 EN</option>';
    select.value=locale;select.addEventListener('change',()=>setLanguage(select.value));label.appendChild(select);
    host.insertBefore(label,anchor);
    const observer=new MutationObserver(events=>{
      if(busy)return;
      for(const e of events){if(e.type==='childList'||e.type==='characterData'||e.type==='attributes'){schedule();break}}
    });
    observer.observe(document.body,{childList:true,characterData:true,subtree:true,attributes:true,attributeFilter:['placeholder','aria-label','alt','title']});
    document.documentElement.lang=langTag();refresh();
    // Additional delayed rendering (fonts, maps, saved planner state) is localized too.
    requestAnimationFrame(refresh);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();

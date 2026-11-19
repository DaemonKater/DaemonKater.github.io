'use strict';
// Персональная сувенирная мастерская: рисует оригинальные открытки прямо в браузере.
(() => {
const canvas=document.querySelector('#souvenir-canvas'); if(!canvas)return;
const ctx=canvas.getContext('2d');
const palettes={
 turquoise:{base:'#116965',deep:'#104945',pale:'#d9efdc',sun:'#f6c267',rose:'#dc7850'},
 pomegranate:{base:'#a7474d',deep:'#702e40',pale:'#f8dfcd',sun:'#f2bc64',rose:'#e77e6c'},
 saffron:{base:'#ce812f',deep:'#714a31',pale:'#f8e9b9',sun:'#ffca69',rose:'#a85a42'},
 indigo:{base:'#355b94',deep:'#273d70',pale:'#dbe8ec',sun:'#f2c575',rose:'#d47c67'}
};
const tasteLabels={plov:'ПЛОВ',samsa:'САМСА',non:'НОН',tea:'ЧАЙ',sweets:'СЛАДОСТИ'};
let template='postcard',palette='turquoise';
const selected=()=>[...document.querySelectorAll('[data-taste]:checked')].map(x=>x.dataset.taste);
const userName=()=>document.querySelector('#souvenir-name').value.trim()||'Привет из Ташкента';
function roundRect(x,y,w,h,r=16,fill=true){ctx.beginPath();ctx.roundRect(x,y,w,h,r);if(fill)ctx.fill();else ctx.stroke()}
function writeFit(text,x,y,maxWidth,initial=58,font='700',family='"Playfair Display", Georgia, serif',align='left'){
 ctx.textAlign=align;let size=initial;do{ctx.font=`${font} ${size}px ${family}`;if(ctx.measureText(text).width<=maxWidth)break;size-=2}while(size>20);ctx.fillText(text,x,y);ctx.textAlign='left';
}
function flower(x,y,r,fill,center){ctx.save();ctx.translate(x,y);ctx.fillStyle=fill;
 for(let k=0;k<8;k++){ctx.rotate(Math.PI/4);ctx.beginPath();ctx.ellipse(0,-r*.6,r*.26,r*.49,0,0,Math.PI*2);ctx.fill()}
 ctx.fillStyle=center;ctx.beginPath();ctx.arc(0,0,r*.20,0,Math.PI*2);ctx.fill();ctx.restore()}
function ornateBorder(x,y,w,h,p){ctx.save();ctx.strokeStyle=p.sun;ctx.lineWidth=5;ctx.strokeRect(x,y,w,h);ctx.strokeStyle=p.pale;ctx.lineWidth=2;ctx.strokeRect(x+14,y+14,w-28,h-28);
 for(let k=0;k<13;k++){const px=x+45+k*(w-90)/12;flower(px,y+12,12,p.sun,p.deep);flower(px,y+h-12,12,p.sun,p.deep)}
 for(let k=1;k<7;k++){const py=y+27+k*(h-54)/7;flower(x+12,py,9,p.pale,p.sun);flower(x+w-12,py,9,p.pale,p.sun)}ctx.restore()}
function drawTilePattern(x,y,w,h,p){ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();
 for(let cy=y;cy<y+h+90;cy+=108)for(let cx=x;cx<x+w+100;cx+=108){ctx.strokeStyle=p.pale+'88';ctx.lineWidth=4;ctx.beginPath();ctx.arc(cx,cy,43,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.moveTo(cx-42,cy);ctx.lineTo(cx,cy-42);ctx.lineTo(cx+42,cy);ctx.lineTo(cx,cy+42);ctx.closePath();ctx.stroke();flower(cx,cy,18,p.sun+'99',p.rose)}ctx.restore()}
function arcWindow(x,y,w,h,p){ctx.save();ctx.fillStyle=p.pale;ctx.beginPath();ctx.moveTo(x,y+h);ctx.lineTo(x,y+w*.48);ctx.bezierCurveTo(x,y+w*.15,x+w*.25,y,x+w*.5,y);ctx.bezierCurveTo(x+w*.75,y,x+w,y+w*.15,x+w,y+w*.48);ctx.lineTo(x+w,y+h);ctx.closePath();ctx.fill();
 ctx.strokeStyle=p.sun;ctx.lineWidth=12;ctx.stroke();ctx.lineWidth=3;ctx.strokeStyle=p.base;ctx.stroke();ctx.restore()}
function citySilhouette(x,y,w,p){ctx.save();ctx.translate(x,y);ctx.fillStyle=p.base;
 ctx.fillRect(0,45,w,90);ctx.fillRect(48,10,70,125);ctx.fillRect(170,28,45,105);
 ctx.fillRect(260,5,78,130);ctx.fillRect(385,38,70,97);
 for(const [cx,cy,rx] of [[83,12,37],[193,24,23],[299,7,42],[420,38,31]]){ctx.beginPath();ctx.ellipse(cx,cy,rx,38,0,Math.PI,Math.PI*2);ctx.fill()}
 ctx.fillRect(520,-35,12,170);ctx.beginPath();ctx.ellipse(526,-45,28,12,0,0,Math.PI*2);ctx.fill();ctx.fillStyle=p.deep;ctx.fillRect(0,136,w,8);ctx.restore()}
function drawPlate(cx,cy,r,p){ctx.save();ctx.translate(cx,cy);ctx.fillStyle=p.deep;ctx.beginPath();ctx.ellipse(0,0,r*1.13,r*.72,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#fffaf0';ctx.beginPath();ctx.ellipse(0,-12,r,r*.62,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle=p.base;ctx.lineWidth=12;ctx.beginPath();ctx.ellipse(0,-12,r*.86,r*.54,0,0,Math.PI*2);ctx.stroke();
 ctx.fillStyle='#e6ae48';ctx.beginPath();ctx.ellipse(0,-12,r*.79,r*.45,0,0,Math.PI*2);ctx.fill();
 for(let i=0;i<90;i++){const a=i*2.4,rv=Math.sqrt((i+.2)/90);const px=Math.cos(a)*r*.74*rv,py=Math.sin(a)*r*.39*rv-12;ctx.fillStyle=i%4?'#f7d97f':'#bb8741';ctx.save();ctx.translate(px,py);ctx.rotate(a);roundRect(-6,-1,12,3,3);ctx.restore()}
 for(const [x,y] of [[-50,-14],[20,-36],[77,10],[-8,12]]){ctx.fillStyle='#9e5b33';roundRect(x-24,y-18,43,30,9)}
 for(const [x,y] of [[-17,-25],[52,18],[-65,13]]){ctx.fillStyle='#d77535';roundRect(x-17,y-6,45,9,5)}
 ctx.fillStyle='#eee4ba';ctx.beginPath();ctx.ellipse(-20,-35,13,18,0,0,Math.PI*2);ctx.fill();ctx.restore()}
function drawCommonSeal(p){ctx.fillStyle=p.sun;ctx.beginPath();ctx.arc(1082,100,53,0,Math.PI*2);ctx.fill();ctx.fillStyle=p.deep;ctx.textAlign='center';ctx.font='900 25px Manrope, sans-serif';ctx.fillText('✹',1082,97);ctx.font='800 12px Manrope, sans-serif';ctx.fillText('TOSHKENT',1082,121);ctx.textAlign='left'}
function drawPostcard(p){
 ctx.fillStyle='#fff6e2';ctx.fillRect(0,0,1200,840);ctx.fillStyle=p.base;ctx.fillRect(0,0,1200,180);ctx.fillStyle=p.deep;ctx.fillRect(0,180,1200,13);
 for(let x=35;x<1200;x+=75)flower(x,183,12,p.sun,p.rose);
 ornateBorder(27,25,1146,786,p);
 ctx.fillStyle='#fff7ea';ctx.font='800 20px Manrope, sans-serif';ctx.fillText('ПОЧТОВАЯ ОТКРЫТКА  ·  POSTCARD FROM UZBEKISTAN',85,93);
 ctx.font='800 33px Manrope, sans-serif';ctx.fillText('TASTE · TASHKENT',85,144);
 drawCommonSeal(p);
 ctx.fillStyle=p.deep;writeFit(userName(),85,305,1030,73,'700');
 ctx.fillStyle=p.rose;ctx.font='600 26px Manrope, sans-serif';ctx.fillText('Город, который хочется попробовать',88,351);
 ctx.save();ctx.fillStyle=p.sun+'50';ctx.beginPath();ctx.arc(971,530,185,0,Math.PI*2);ctx.fill();ctx.restore();
 arcWindow(90,390,595,300,p);citySilhouette(119,510,550,p);drawPlate(932,554,160,p);
 ctx.fillStyle=p.deep;ctx.font='800 24px Manrope, sans-serif';ctx.fillText('С ЛЮБОВЬЮ ИЗ УЗБЕКИСТАНА',90,748);
 ctx.fillStyle=p.rose;ctx.font='700 21px Manrope, sans-serif';ctx.fillText('✳  ПЛОВ   ✳   САМСА   ✳   ЧАЙ',720,750);
}
function drawPassport(p){
 ctx.fillStyle=p.deep;ctx.fillRect(0,0,1200,840);drawTilePattern(0,0,1200,840,p);ornateBorder(34,32,1132,776,p);
 ctx.fillStyle='#fff6e5';roundRect(125,110,950,624,27);
 ctx.fillStyle=p.base;ctx.fillRect(125,110,950,124);
 ctx.fillStyle=p.sun;ctx.font='800 27px Manrope, sans-serif';ctx.fillText('TOSHKENT  /  TASTE PASSPORT',177,168);
 ctx.fillStyle='#fff8ee';ctx.font='700 21px Manrope, sans-serif';ctx.fillText('ПАСПОРТ ГАСТРОНОМИЧЕСКИХ ВПЕЧАТЛЕНИЙ',178,206);
 ctx.fillStyle=p.deep;writeFit(userName(),177,310,850,64,'700');
 ctx.font='700 21px Manrope, sans-serif';ctx.fillStyle=p.rose;ctx.fillText('МОЯ КОЛЛЕКЦИЯ ВКУСОВ',178,379);
 const sel=selected();
 Object.keys(tasteLabels).forEach((key,i)=>{const x=178+(i%3)*298,y=418+Math.floor(i/3)*114,active=sel.includes(key);
   ctx.fillStyle=active?p.base:'#f0e5d0';roundRect(x,y,261,85,10);
   ctx.strokeStyle=active?p.sun:'#cebd99';ctx.lineWidth=active?5:2;roundRect(x+7,y+7,247,71,9,false);
   ctx.fillStyle=active?'#fff8ea':p.deep;ctx.font='800 22px Manrope, sans-serif';ctx.fillText(tasteLabels[key],x+21,y+52);
   ctx.font='800 28px Manrope, sans-serif';ctx.fillText(active?'✓':'○',x+210,y+52);
 });
 ctx.fillStyle=p.deep;ctx.font='800 28px Manrope, sans-serif';ctx.fillText(`ОТКРЫТО ВКУСОВ: ${sel.length} ИЗ 5`,178,691);
 flower(1024,686,28,p.rose,p.sun);
}
function drawTicket(p){
 ctx.fillStyle=p.pale;ctx.fillRect(0,0,1200,840);drawTilePattern(0,0,1200,840,p);
 ctx.save();ctx.shadowColor='#173a323d';ctx.shadowBlur=28;ctx.shadowOffsetY=20;ctx.fillStyle='#fff9e9';roundRect(75,123,1050,585,26);ctx.restore();
 ctx.fillStyle=p.base;ctx.fillRect(75,124,1050,155);ctx.fillStyle=p.sun;ctx.fillRect(75,279,1050,11);
 ctx.fillStyle='#fff7e2';ctx.font='700 22px Manrope, sans-serif';ctx.fillText('БИЛЕТ В ГОРОД ВКУСОВ   •   ADMIT ONE',130,179);
 ctx.font='800 45px Manrope, sans-serif';ctx.fillText('TASHKENT FOOD EXPRESS',130,244);
 ctx.fillStyle=p.deep;writeFit(userName(),135,399,840,69,'700');
 ctx.fillStyle=p.rose;ctx.font='700 23px Manrope, sans-serif';ctx.fillText('ДЕЙСТВИТЕЛЕН ДЛЯ НОВЫХ ВПЕЧАТЛЕНИЙ',135,449);
 ctx.setLineDash([9,12]);ctx.strokeStyle=p.base;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(135,490);ctx.lineTo(1065,490);ctx.stroke();ctx.setLineDash([]);
 ctx.fillStyle=p.deep;ctx.font='700 22px Manrope, sans-serif';ctx.fillText('НАПРАВЛЕНИЕ',135,555);ctx.fillText('КОЛЛЕКЦИЯ',690,555);
 ctx.font='800 30px Manrope, sans-serif';ctx.fillText('ТАШКЕНТ · УЗБЕКИСТАН',135,603);
 ctx.fillText(`${selected().length} / 5 ВКУСОВ`,690,603);
 ctx.fillStyle=p.base;ctx.font='800 21px Manrope, sans-serif';ctx.fillText('✳ ВЗЯТЬ С СОБОЙ ПРИЯТНЫЕ ВОСПОМИНАНИЯ',135,667);
 flower(1030,375,55,p.rose,p.sun);
}
function render(){const p=palettes[palette];ctx.clearRect(0,0,1200,840);
 if(template==='postcard')drawPostcard(p);else if(template==='passport')drawPassport(p);else drawTicket(p);
 const count=selected().length;document.querySelector('#passport-count').textContent=`${count} из 5`;
}
function choiceButtons(selector,datasetKey,choice){document.querySelectorAll(selector).forEach(b=>{const active=b.dataset[datasetKey]===choice;b.classList.toggle('is-active',active);b.setAttribute('aria-pressed',String(active))})}
function saveCanvas(){return new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('Ошибка экспорта')),'image/png'))}
async function download(){try{const blob=await saveCanvas();const name=`tashkent-souvenir-${template}-${palette}.png`;
 if(typeof saveBlob==='function')saveBlob(blob,name);else{const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click()}
 toast('Сувенир сохранён как оформленная открытка PNG');
 }catch(e){console.error(e);toast('Не получилось сохранить открытку. Попробуй ещё раз.')}}
async function share(){try{const blob=await saveCanvas(),file=new File([blob],'moj-vkusnyj-tashkent.png',{type:'image/png'});
 if(navigator.canShare?.({files:[file]})&&navigator.share){await navigator.share({files:[file],title:'Мой вкусный Ташкент',text:'Мой сувенир из Ташкента!'});}
 else{await download();toast('Открытка сохранена — теперь её можно отправить друзьям.')}}catch(e){if(e.name!=='AbortError'){console.error(e);toast('Не получилось поделиться открыткой.')}}}
document.querySelector('#souvenir-name').addEventListener('input',render);
document.querySelectorAll('[data-template]').forEach(b=>b.addEventListener('click',()=>{template=b.dataset.template;choiceButtons('[data-template]','template',template);render()}));
document.querySelectorAll('[data-palette]').forEach(b=>b.addEventListener('click',()=>{palette=b.dataset.palette;choiceButtons('[data-palette]','palette',palette);render()}));
document.querySelectorAll('[data-taste]').forEach(b=>b.addEventListener('change',render));
document.querySelector('#souvenir-download').addEventListener('click',download);
document.querySelector('#souvenir-share').addEventListener('click',share);
document.querySelector('#souvenir-remix').addEventListener('click',()=>{
 const options=Object.keys(palettes),forms=['postcard','passport','ticket'];palette=options[Math.floor(Math.random()*options.length)];template=forms[Math.floor(Math.random()*forms.length)];choiceButtons('[data-palette]','palette',palette);choiceButtons('[data-template]','template',template);render();toast('Новый вариант готов!')});
render();document.fonts?.ready?.then(render).catch(()=>{});
})();

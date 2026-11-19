'use strict';
/* Actual equirectangular spherical viewer, real-source video player, and 3D WebAR model.
   This module does not represent regular photos as 360 footage or CSS as augmented reality. */
(()=>{
  const $=id=>document.getElementById(id);
  const dialogs=['imm9-video-dialog','imm9-vr-dialog','imm9-ar-dialog'].map($).filter(Boolean);
  if(!dialogs.length)return;
  const byId=(id)=>$(id);
  const WEBM='https://upload.wikimedia.org/wikipedia/commons/2/23/Uzbek_Bazaar.webm';
  const PANOS=[
    {name:'У Музея истории Узбекистана',description:'Настоящая сферическая фотография снаружи Государственного музея истории Узбекистана. Ташкент, 1 июня 2023 года.',url:'https://upload.wikimedia.org/wikipedia/commons/8/83/360_panorama_near_State_Museum_of_History_of_Uzbekistan.jpg',source:'https://commons.wikimedia.org/wiki/File:360_panorama_near_State_Museum_of_History_of_Uzbekistan.jpg'},
    {name:'Внутри Музея истории Узбекистана',description:'Настоящая сферическая фотография внутри Государственного музея истории Узбекистана. Ташкент, 1 июня 2023 года.',url:'https://upload.wikimedia.org/wikipedia/commons/f/f2/360_panorama_inside_State_Museum_of_History_of_Uzbekistan.jpg',source:'https://commons.wikimedia.org/wiki/File:360_panorama_inside_State_Museum_of_History_of_Uzbekistan.jpg'}
  ];
  let stage,canvas,gl,prog,posBuf,tex,loc={},loaded=false,stereo=false,autoSpin=false,yaw=0,pitch=0,fov=78,frame=0,drag=null,gyroEnabled=false,panoIndex=0,flatMode=false,flatImg=null,flatYaw=0;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fallback='assets/vr/artistic_panorama.webp';
  function open(id){const d=$(id);if(!d)return;d.showModal();}
  function close(d){if(!d.open)return;d.close()}
  dialogs.forEach(d=>{d.querySelectorAll('[data-imm9-close]').forEach(b=>b.addEventListener('click',()=>close(d)));d.addEventListener('click',e=>{if(e.target===d)close(d)});});
  // Video: the decorative MP4 and the documentary Wikimedia clip are explicitly different sources.
  const trailer=$('imm9-hero-video'),video=$('imm9-real-video');
  function openVideo(){open('imm9-video-dialog');if(video){video.load();video.play().catch(()=>{});}}
  $('imm9-open-video')?.addEventListener('click',openVideo);
  $('imm9-video-fallback')?.addEventListener('click',()=>{
    if(!video)return;
    video.pause();video.innerHTML='<source src="assets/video/tashkent-cinematic.mp4" type="video/mp4">';video.load();video.play().catch(()=>{});
    const title=document.querySelector('#imm9-video-dialog .imm9-modal-foot b');if(title)title.textContent='Художественная видеозаставка (не документальная съёмка)';
    const desc=document.querySelector('#imm9-video-dialog .imm9-modal-foot p');if(desc)desc.textContent='Монтаж из художественных иллюстраций Ташкента, созданный для этого сайта.';
  });
  $('imm9-video-dialog')?.addEventListener('close',()=>video?.pause());
  // Ambient sound is synthesized locally after a user gesture, not a field recording or commercial soundtrack.
  let ambientContext=null, ambientSource=null;
  const sound=$('imm9-hero-sound');sound?.addEventListener('click',()=>{
    if(ambientContext){ambientSource?.stop();ambientContext.close();ambientContext=null;ambientSource=null;sound.textContent='◌ Звук базара (синтез)';sound.setAttribute('aria-pressed','false');return}
    const AudioCtor=window.AudioContext||window.webkitAudioContext;
    if(!AudioCtor){sound.textContent='Звук не поддерживается';return}
    ambientContext=new AudioCtor();const rate=ambientContext.sampleRate;
    const buffer=ambientContext.createBuffer(1,rate*3,rate);const data=buffer.getChannelData(0);
    for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*.35;
    const filter=ambientContext.createBiquadFilter();filter.type='lowpass';filter.frequency.value=310;
    const gain=ambientContext.createGain();gain.gain.value=.055;
    ambientSource=ambientContext.createBufferSource();ambientSource.buffer=buffer;ambientSource.loop=true;
    ambientSource.connect(filter);filter.connect(gain);gain.connect(ambientContext.destination);ambientSource.start();
    sound.textContent='◉ Выключить атмосферу';sound.setAttribute('aria-pressed','true');
  });
  // Try real footage as the moving background when its public host is reachable.
  // The packaged edited MP4 stays the immediate, reliable fallback.
  if(trailer && trailer.canPlayType('video/webm')){
    const probe=document.createElement('video');probe.preload='auto';probe.muted=true;
    let changed=false;
    probe.addEventListener('canplay',()=>{
      if(changed)return;changed=true;
      const current=trailer.currentTime;trailer.pause();trailer.src=WEBM;
      trailer.load();trailer.play().catch(()=>{});
      const note=document.querySelector('.imm9-film-head small');if(note)note.textContent='На фоне — реальная съёмка традиционного базара Узбекистана (Lokk1y, CC BY-SA 4.0). Кнопка открывает исходный ролик с управлением.';
      const label=document.querySelector('.imm9-label-top span:first-child');if(label)label.textContent='● REAL FOOTAGE / UZBEK BAZAAR';
    },{once:true});
    probe.addEventListener('error',()=>{probe.src=''});
    probe.src=WEBM;probe.load();setTimeout(()=>{if(!changed){probe.pause();probe.removeAttribute('src');probe.load()}},5500);
  }

  // ----- Genuine spherical viewer: GPU rays sample the complete 2:1 panorama. -----
  const VS=`attribute vec2 aPos; void main(){gl_Position=vec4(aPos,0.0,1.0);}`;
  const FS=`precision highp float;
     uniform sampler2D uTex; uniform vec2 uResolution; uniform float uYaw; uniform float uPitch; uniform float uFov; uniform float uStereo;
     const float PI=3.141592653589793;
     void main(){
       float eye=0.0; vec2 px=gl_FragCoord.xy; vec2 wh=uResolution;
       if(uStereo>0.5){eye=px.x<wh.x*0.5 ? -1.0 : 1.0;px.x=mod(px.x,wh.x*0.5);wh.x*=0.5;}
       vec2 uv=(2.0*px-wh)/wh.y;
       float tanHalf=tan(radians(uFov)*0.5);
       vec3 ray=normalize(vec3(uv.x*tanHalf,uv.y*tanHalf,-1.0));
       float cp=cos(uPitch),sp=sin(uPitch);
       ray=vec3(ray.x,cp*ray.y-sp*ray.z,sp*ray.y+cp*ray.z);
       float angle=uYaw+eye*0.013,cy=cos(angle),sy=sin(angle);
       ray=vec3(cy*ray.x+sy*ray.z,ray.y,-sy*ray.x+cy*ray.z);
       float longitude=atan(ray.x,-ray.z),latitude=asin(clamp(ray.y,-1.0,1.0));
       vec2 mapping=vec2(fract(0.5+longitude/(2.0*PI)),0.5-latitude/PI);
       gl_FragColor=texture2D(uTex,mapping);
     }`;
  function shader(type,src){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s));return s;}
  function initGL(){
    canvas=$('imm9-panorama');stage=$('imm9-pano-stage');if(!canvas||!stage)return false;
    gl=canvas.getContext('webgl',{antialias:false,alpha:false,depth:false,preserveDrawingBuffer:false})||canvas.getContext('experimental-webgl');
    if(!gl)return false;
    try{
      prog=gl.createProgram();gl.attachShader(prog,shader(gl.VERTEX_SHADER,VS));gl.attachShader(prog,shader(gl.FRAGMENT_SHADER,FS));gl.linkProgram(prog);
      if(!gl.getProgramParameter(prog,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(prog));
      gl.useProgram(prog);posBuf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,posBuf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
      const a=gl.getAttribLocation(prog,'aPos');gl.enableVertexAttribArray(a);gl.vertexAttribPointer(a,2,gl.FLOAT,false,0,0);
      for(const key of ['uTex','uResolution','uYaw','uPitch','uFov','uStereo'])loc[key]=gl.getUniformLocation(prog,key);
      tex=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,tex);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.REPEAT);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array([9,44,52,255]));gl.uniform1i(loc.uTex,0);
    }catch(e){console.warn('Cannot initialize panorama WebGL',e);gl=null;return false}
    canvas.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId);autoSpin=false});
    canvas.addEventListener('pointermove',e=>{if(!drag)return;const r=canvas.getBoundingClientRect();yaw-=(e.clientX-drag.x)/r.width*Math.PI*1.15;pitch=Math.max(-1.37,Math.min(1.37,pitch+(e.clientY-drag.y)/r.height*Math.PI*.85));drag={x:e.clientX,y:e.clientY};});
    canvas.addEventListener('pointerup',()=>drag=null);canvas.addEventListener('pointercancel',()=>drag=null);
    canvas.addEventListener('wheel',e=>{e.preventDefault();fov=Math.min(110,Math.max(38,fov+Math.sign(e.deltaY)*4))},{passive:false});
    canvas.addEventListener('dblclick',()=>{yaw=0;pitch=0;fov=78});
    canvas.addEventListener('keydown',e=>{if(e.key==='ArrowLeft')yaw+=.12;if(e.key==='ArrowRight')yaw-=.12;if(e.key==='ArrowUp')pitch+=.08;if(e.key==='ArrowDown')pitch-=.08});
    canvas.tabIndex=0;
    return true;
  }
  function upload(img){
    if(!gl)return;gl.bindTexture(gl.TEXTURE_2D,tex);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false);
    // NPOT textures are legal with CLAMP_TO_EDGE and no mipmaps.
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,img);
    loaded=true;
  }
  function loadPano(index){if(flatMode){loadFlatPano(index);return}panoIndex=index;yaw=0;pitch=0;fov=78;loaded=false;
    const pano=PANOS[index],loader=$('imm9-pano-loader');loader.textContent='Загружаем реальную панораму Ташкента…';loader.classList.remove('is-hidden');
    $('imm9-vr-place-title').textContent=pano.name;$('imm9-vr-description').textContent=pano.description;$('imm9-vr-source').href=pano.source;
    ['imm9-panorama-outside','imm9-panorama-inside'].forEach((id,i)=>$(id)?.classList.toggle('is-active',i===index));
    const token=++loadPano.token;
    // Draw a local sphere immediately: never show a black canvas while waiting for Wikimedia.
    const local=new Image();local.onload=()=>{if(token!==loadPano.token||loaded)return;try{upload(local);loader.classList.add('is-hidden');$('imm9-vr-place-title').textContent='Художественный 360°-предпросмотр';$('imm9-vr-description').textContent='Пока загружается документальная панорама музея, показана художественная сфера. Она не является реальной фотосъёмкой.';}catch(e){console.warn('Local panorama failed',e)}};
    local.src=fallback;
    const img=new Image();img.crossOrigin='anonymous';
    img.onload=()=>{if(token!==loadPano.token)return;try{upload(img);loader.classList.add('is-hidden');$('imm9-vr-place-title').textContent=pano.name;$('imm9-vr-description').textContent=pano.description;}catch(e){console.warn('Panorama upload failed',e)}};
    img.onerror=()=>{if(token!==loadPano.token)return;if(!loaded)loadBackup(token)};
    img.src=pano.url;
  }
  function flatPosition(){if(!flatImg||!stage)return;
    const width=flatImg.getBoundingClientRect().width;
    const area=stage.clientWidth;
    const shift=Math.max(0,width-area);
    const ratio=((flatYaw%(Math.PI*2))+Math.PI*2)%(Math.PI*2)/(2*Math.PI);
    flatImg.style.transform=`translateX(${-shift*ratio}px)`;
  }
  function loadFlatPano(index){panoIndex=index;flatYaw=Math.PI;const pano=PANOS[index];
    const loader=$('imm9-pano-loader');loader.classList.remove('is-hidden');loader.textContent='Загружаем панорамное изображение…';
    $('imm9-vr-place-title').textContent=pano.name;$('imm9-vr-description').textContent=pano.description;$('imm9-vr-source').href=pano.source;
    ['imm9-panorama-outside','imm9-panorama-inside'].forEach((id,i)=>$(id)?.classList.toggle('is-active',i===index));
    if(!flatImg){flatImg=document.createElement('img');flatImg.className='imm9-flat-pano';flatImg.alt='Ограниченный панорамный обзор без WebGL';stage.append(flatImg);
      let lastX=null;stage.addEventListener('pointerdown',e=>{lastX=e.clientX;stage.setPointerCapture(e.pointerId)});
      stage.addEventListener('pointermove',e=>{if(lastX===null)return;flatYaw+=(e.clientX-lastX)/Math.max(100,stage.clientWidth)*Math.PI;lastX=e.clientX;flatPosition()});
      stage.addEventListener('pointerup',()=>lastX=null);stage.addEventListener('pointercancel',()=>lastX=null);
    }
    const token=++loadPano.token;
    flatImg.onload=()=>{if(token!==loadPano.token)return;loader.classList.add('is-hidden');requestAnimationFrame(flatPosition)};
    flatImg.onerror=()=>{loader.textContent='Художественная панорама недоступна'};
    $('imm9-vr-place-title').textContent='Художественный панорамный предпросмотр';$('imm9-vr-description').textContent='Документальный кадр музея загружается. До его получения показан художественный разворот в режиме без WebGL.';
    flatImg.src=fallback;
    const original=new Image();original.onload=()=>{if(token!==loadPano.token)return;flatImg.src=original.src;$('imm9-vr-place-title').textContent=pano.name;$('imm9-vr-description').textContent=pano.description;};
    original.onerror=()=>{};original.src=pano.url;
  }
  loadPano.token=0;
  function loadBackup(token){if(token!==loadPano.token||loaded)return;const loader=$('imm9-pano-loader');loader.textContent='Источник 360° недоступен. Загружаем художественную панораму…';
    // Invalidate ongoing remote callbacks so they cannot overwrite this view.
    const current=++loadPano.token,im=new Image();im.onload=()=>{if(current!==loadPano.token)return;try{upload(im);loader.classList.add('is-hidden');$('imm9-vr-place-title').textContent='Художественная панорама Ташкента';$('imm9-vr-description').textContent='Реальное 360° фото с Wikimedia недоступно в этой сети. Показана художественная сфера для тренировки обзора, не документальная фотосъёмка.';}catch(e){loader.textContent='Не удалось отобразить панораму на этом устройстве'}};im.onerror=()=>loader.textContent='Не удалось загрузить изображение панорамы';im.src=fallback;
  }
  function paint(){const d=$('imm9-vr-dialog');if(!d?.open||!gl){frame=0;return}const dpr=Math.min(1.5,window.devicePixelRatio||1);const w=Math.max(16,Math.floor(canvas.clientWidth*dpr)),h=Math.max(16,Math.floor(canvas.clientHeight*dpr));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h)}
    if(autoSpin&&!drag&&!reduced)yaw+=.0009;gl.useProgram(prog);gl.uniform2f(loc.uResolution,w,h);gl.uniform1f(loc.uYaw,yaw);gl.uniform1f(loc.uPitch,pitch);gl.uniform1f(loc.uFov,fov);gl.uniform1f(loc.uStereo,stereo?1:0);gl.drawArrays(gl.TRIANGLES,0,6);
    if($('imm9-pano-compass'))$('imm9-pano-compass').textContent='◈ '+String(Math.round((((yaw%(2*Math.PI))+2*Math.PI)%(2*Math.PI))*180/Math.PI)).padStart(3,'0')+'°';
    frame=requestAnimationFrame(paint)
  }
  function startVR(){open('imm9-vr-dialog');stereo=false;autoSpin=!reduced;stage=$('imm9-pano-stage');stage.classList.remove('is-stereo');$('imm9-vr-cardboard').classList.remove('is-active');flatMode=!gl&&!initGL();stage.classList.toggle('is-flat',flatMode);if(flatMode){$('imm9-vr-cardboard').disabled=true;$('imm9-vr-cardboard').title='VR-режим требует WebGL';$('imm9-pano-hint').textContent='↔ Ограниченный панорамный разворот без WebGL · Вращай свайпом';}else{$('imm9-vr-cardboard').disabled=false;$('imm9-pano-hint').textContent='↔ Тяни мышью или пальцем • Колёсико меняет масштаб';}loadPano(0);if(!flatMode&&!frame)frame=requestAnimationFrame(paint)}
  $('imm9-open-vr')?.addEventListener('click',startVR);
  $('imm9-vr-dialog')?.addEventListener('close',()=>{cancelAnimationFrame(frame);frame=0;autoSpin=false;loadPano.token++;if(document.fullscreenElement)document.exitFullscreen().catch(()=>{})});
  $('imm9-panorama-outside')?.addEventListener('click',()=>loadPano(0));$('imm9-panorama-inside')?.addEventListener('click',()=>loadPano(1));
  $('imm9-vr-cardboard')?.addEventListener('click',()=>{stereo=!stereo;stage.classList.toggle('is-stereo',stereo);$('imm9-vr-cardboard').classList.toggle('is-active',stereo)});
  $('imm9-vr-fullscreen')?.addEventListener('click',()=>{if(!document.fullscreenElement)stage.requestFullscreen?.().catch(()=>{});else document.exitFullscreen?.().catch(()=>{})});
  const gyro=$('imm9-vr-gyro');gyro?.addEventListener('click',async()=>{
    if(gyroEnabled){gyroEnabled=false;gyro.classList.remove('is-active');return}
    if(!window.isSecureContext){$('imm9-pano-loader').classList.remove('is-hidden');$('imm9-pano-loader').textContent='Гироскоп на телефоне требует HTTPS';return}
    if(!('DeviceOrientationEvent' in window)){$('imm9-pano-loader').classList.remove('is-hidden');$('imm9-pano-loader').textContent='На этом устройстве нет доступного датчика ориентации';return}
    try{if(typeof DeviceOrientationEvent.requestPermission==='function'){const result=await DeviceOrientationEvent.requestPermission();if(result!=='granted')return}}
    catch(e){console.warn('Gyroscope permission denied',e);return}
    gyroEnabled=true;gyro.classList.add('is-active');
  });
  window.addEventListener('deviceorientation',e=>{if(!gyroEnabled||!$('imm9-vr-dialog')?.open)return;if(Number.isFinite(e.alpha))yaw=e.alpha*Math.PI/180;if(Number.isFinite(e.beta))pitch=Math.max(-1.3,Math.min(1.3,(e.beta-75)*Math.PI/180));});
  // ----- 3D model and supported platform WebAR. -----
  $('imm9-open-ar')?.addEventListener('click',()=>open('imm9-ar-dialog'));
  const model=$('imm9-model'),loading=$('imm9-model-loading'),arStatus=$('imm9-ar-status');
  model?.addEventListener('load',()=>{loading?.classList.add('is-hidden');$('imm9-model-fallback')?.classList.remove('is-visible')});
  setTimeout(()=>{if(!window.customElements?.get('model-viewer')){$('imm9-model-fallback')?.classList.add('is-visible');if(loading)loading.textContent='Показан видеорендер настоящей 3D-модели. AR доступен после загрузки model-viewer.';}},3800);
  model?.addEventListener('error',()=>{if(loading)loading.textContent='Модель не загрузилась. Попробуй другой браузер или скачай файл GLB.';});
  $('imm9-ar-check')?.addEventListener('click',async()=>{
    if(!window.isSecureContext){arStatus.textContent='AR через камеру требует HTTPS. Локально работает 3D-просмотр, но размещение в комнате недоступно.';return}
    if(!window.customElements?.get('model-viewer')){arStatus.textContent='Компонент 3D-просмотра не загрузился. Проверь доступ к библиотеке model-viewer или открой сайт в Chrome/Safari.';return}
    if(model?.canActivateAR){arStatus.textContent='AR доступен на этом устройстве. Нажми «Поставить в комнате» на 3D-модели.';return}
    arStatus.textContent='3D-модель доступна, но AR-режим через камеру на данном устройстве или в этом браузере не поддерживается. Попробуй совместимый Android с ARCore или Safari на iPhone.';
  });
})();

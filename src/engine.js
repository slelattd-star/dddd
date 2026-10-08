
/* ================= Motor: escena común ================= */
const ground=new THREE.Mesh(new THREE.CircleGeometry(240,64),M.ground);ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;scene.add(ground);
const pad=new THREE.Mesh(new THREE.PlaneGeometry(1,1),M.grass);pad.rotation.x=-Math.PI/2;pad.position.y=.004;pad.receiveShadow=true;scene.add(pad);
scene.add(new THREE.HemisphereLight(0xffffff,0x7c838a,.7));
const sun=new THREE.DirectionalLight(0xffffff,1.15);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.bias=-.0004;scene.add(sun);scene.add(sun.target);
// persona de referencia 1,75 m
const person=new THREE.Group();
[-.09,.09].forEach(o=>{const l=new THREE.Mesh(new THREE.CylinderGeometry(.075,.065,.86,14),M.person);l.castShadow=true;l.position.set(o,.43,0);person.add(l);});
{const t=new THREE.Mesh(new THREE.CylinderGeometry(.19,.15,.62,18),M.person);t.castShadow=true;t.position.y=1.17;person.add(t);
 const h=new THREE.Mesh(new THREE.SphereGeometry(.115,20,16),M.person);h.castShadow=true;h.position.y=1.635;person.add(h);}
person.rotation.y=-.3;scene.add(person);

/* ================= Cotas y etiquetas ================= */
const dimsG=new THREE.Group();scene.add(dimsG);
const dimMat=new THREE.LineBasicMaterial({color:0xE0531D,depthTest:false,transparent:true});
const labelsEl=$('#labels');let labels=[];
function addDim(d){
  const A=new THREE.Vector3(...d.a),B=new THREE.Vector3(...d.b),t=new THREE.Vector3(...d.t);
  const g=new THREE.BufferGeometry().setFromPoints([A,B,A.clone().sub(t),A.clone().add(t),B.clone().sub(t),B.clone().add(t)]);g.setIndex([0,1,2,3,4,5]);
  const l=new THREE.LineSegments(g,dimMat);l.renderOrder=10;dimsG.add(l);
  addLabel('dim'+(d.soft?' soft':''),d.text,A.clone().add(B).multiplyScalar(.5),'dims');
}
function addLabel(cls,text,pos,group,tag){const el=document.createElement(tag||'div');el.className=cls;el.textContent=text;labelsEl.appendChild(el);const l={el,pos,group};labels.push(l);return l;}

/* ================= Estado ================= */
const state={mode:'exterior'};
let cur=null,curDef=null,curParam=0;
const orbit={t:new THREE.Vector3(),th:.62,ph:1.12,r:14,gt:new THREE.Vector3(),gth:.62,gph:1.12,gr:14};
const walk={x:0,y:0,yaw:0,pitch:-.05,eye:1.6,target:null};
const keys={};
const tDims=$('#t-dims'),tRoof=$('#t-roof'),tPerson=$('#t-person'),tSpots=$('#t-spots');
const diag=()=>Math.hypot(cur.L,cur.W);
function fitPlanR(){const a=camera.aspect,f=Math.tan(THREE.MathUtils.degToRad(22.5));return Math.max((cur.W+3.6)/(2*f),(cur.L+3.6)/(2*f*a))+Math.min(cur.H||3,3.5)+1.5;}
function presets(){const d=diag();return{
  exterior:{t:[0,(cur.H||3)*.4,0],th:.62,ph:1.12,r:1.1*d+4},
  interior:{t:[0,.6,0],th:.35,ph:.72,r:.95*d+2.8},
  planta:{t:[0,0,0],th:0,ph:.001,r:fitPlanR()}};}
function setGoal(p){orbit.gt.set(...p.t);const tau=Math.PI*2;orbit.gth=p.th+Math.round((orbit.th-p.th)/tau)*tau;orbit.gph=p.ph;orbit.gr=p.r;}
function applyToggles(){
  if(!cur)return;
  dims.visible();
  cur.roof.forEach(o=>o.visible=tRoof.checked);person.visible=tPerson.checked;}
const dims={visible(){dimsG.visible=tDims.checked&&state.mode!=='recorrido'&&!cur.hideLabels;}};
[tDims,tRoof,tPerson,tSpots].forEach(t=>t.addEventListener('change',applyToggles));

const HINTS={
  exterior:'Arrastrá para girar · rueda o pellizco para acercar · clic derecho o Shift + arrastrar para desplazar',
  interior:'Vista sin techo · tocá un ambiente para acercarte',
  planta:'Vista superior sin techo, orientada como el plano',
  recorrido:'W A S D o flechas para moverte · Shift para ir más rápido · arrastrá para mirar · tocá el piso para caminar hasta ahí'
};
function setMode(m,keepGoal){
  W0=0;resize();
  state.mode=m;$$('.modes button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===m)));
  $('#hint').textContent=HINTS[m];$('#pad').hidden=m!=='recorrido';
  camera.fov=m==='recorrido'?72:45;camera.updateProjectionMatrix();
  if(m==='recorrido'){tRoof.checked=true;if(cur.onWalk)cur.onWalk();}
  else{
    if(m==='exterior')tRoof.checked=true;
    if(m==='interior'||m==='planta')tRoof.checked=false;
    if(m==='planta')tDims.checked=true;
    if(!keepGoal){const p=Object.assign({},presets()[m]);if(m!=='planta')p.r=p.r/Math.min(1,camera.aspect);setGoal(p);}
  }
  applyToggles();
}
$$('.modes button').forEach(b=>b.addEventListener('click',()=>{closeCard();setMode(b.dataset.mode);}));

/* ================= Ambientes ================= */
let activeSpot=null,spotEls={};
function openSpot(id){
  const s=cur.spots.find(x=>x.id===id);if(!s)return;activeSpot=s;
  $('#card-t').textContent=s.name;$('#card-d').textContent=s.desc;$('#card').hidden=false;
  Object.entries(spotEls).forEach(([k,el])=>el.classList.toggle('on',k===id));
  $$('.room').forEach(r=>r.classList.toggle('on',r.dataset.id===id));
  if(state.mode==='recorrido')goWalk(s.walk);else goView(s);
}
function goView(s){if(state.mode!=='interior')setMode('interior',true);tRoof.checked=false;applyToggles();
  setGoal({t:[cur.wx(s.at[0]),cur.FLOOR+.6,cur.wz(s.at[1])],th:s.view.th,ph:s.view.ph,r:s.view.r});}
function placeWalk(w){walk.x=w.p[0];walk.y=w.p[1];walk.target=null;
  walk.yaw=Math.atan2(w.look[1]-w.p[1],w.look[0]-w.p[0]);walk.pitch=w.pitch||-.08;walk.eye=cur.floorAt(walk.x,walk.y)+1.6;}
function goWalk(w){setMode('recorrido');placeWalk(w);}
function closeCard(){$('#card').hidden=true;activeSpot=null;Object.values(spotEls).forEach(el=>el.classList.remove('on'));$$('.room').forEach(r=>r.classList.remove('on'));}
$('#card-x').addEventListener('click',closeCard);
$('#card-walk').addEventListener('click',()=>activeSpot&&goWalk(activeSpot.walk));
$('#card-out').addEventListener('click',()=>{const s=activeSpot;setMode('exterior',true);
  setGoal({t:[cur.wx(s.at[0])*.5,(cur.H||3)*.4,cur.wz(s.at[1])*.5],th:s.view.th,ph:1.1,r:presets().exterior.r*.8});});

/* ================= Panel ================= */
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function renderInfo(def){
  const hero=typeof def.hero==='function'?def.hero(curParam):def.hero;
  $('#m-title').innerHTML=esc(def.mark[0])+'<span>'+esc(def.mark[1])+'</span>';$('#m-sub').textContent=def.sub;
  document.title=def.tab[0]+' · Global Building';
  $('#p-ficha').innerHTML=
    '<div class="hero-num">'+hero.map(([b,s])=>`<div><b>${esc(b)}</b><small>${esc(s)}</small></div>`).join('')+'</div>'+
    '<p class="eyebrow">Ficha técnica</p><dl class="spec">'+def.spec.map(([a,b])=>`<dt>${esc(a)}</dt><dd>${esc(b)}</dd>`).join('')+'</dl>'+
    '<p class="eyebrow">Incluye</p><div class="chips">'+def.includes.map(x=>`<span>${esc(x)}</span>`).join('')+'</div>'+
    `<p class="eyebrow">${esc(def.detailsTitle)}</p><ul class="mats">`+def.details.map(([a,b])=>`<li><b>${esc(a)}</b><span>${esc(b)}</span></li>`).join('')+'</ul>'+
    `<p class="note">${esc(def.note)}</p>`;
  $('#p-plano').innerHTML=def.plans.map(p=>`<figure class="plan-fig"><div class="plan-wrap"><img class="zoom" src="${p.src}" alt="${esc(p.alt)}"></div>${p.cap?`<figcaption>${esc(p.cap)}</figcaption>`:''}</figure>`).join('')+
    '<ul class="plan-keys">'+def.planKeys.map(([a,b])=>`<li><b>${esc(a)}</b><span>${esc(b)}</span></li>`).join('')+'</ul>'+
    '<p class="note">Tocá una imagen para verla en grande. Medidas en milímetros salvo que se indique otra unidad.</p>';
  $('#p-fotos').innerHTML=def.photos.map(([src,cap,wide])=>`<figure${wide?' class="wide"':''}><img class="zoom" src="${src}" alt="${esc(cap)}" loading="lazy"><figcaption>${esc(cap)}</figcaption></figure>`).join('');
}
function renderVariants(def,idx){
  const box=$('#variants');box.innerHTML='';if(!cur.variants.length)return;
  box.append(cur.variantLabel||'Variante');
  cur.variants.forEach((v,i)=>{const b=document.createElement('button');
    if(v.swatch){b.className='swatch';b.style.background=v.swatch;b.title=v.label;b.setAttribute('aria-label',v.label);}else{b.className='vchip';b.textContent=v.label;}
    b.setAttribute('aria-pressed',String(i===idx));
    b.addEventListener('click',()=>{
      if(v.param!==undefined){if(v.param!==curParam)loadModel(def.id,v.param,i);return;}
      cur.variantIdx=i;v.apply();[...box.querySelectorAll('button')].forEach((x,j)=>x.setAttribute('aria-pressed',String(j===i)));});
    box.appendChild(b);});
}
function renderToggles(){
  $$('.x-toggle').forEach(e=>e.remove());
  cur.toggles.forEach(t=>{const l=document.createElement('label');l.className='x-toggle';
    l.innerHTML=`<input type="checkbox" id="x-${t.id}"${t.checked?' checked':''}> ${esc(t.label)}`;
    l.querySelector('input').addEventListener('change',e=>t.onChange(e.target.checked));$('#toggles').appendChild(l);});
}
function renderSpots(){
  spotEls={};$('#rooms').innerHTML='';
  cur.spots.forEach(s=>{
    const l=addLabel('spot','',new THREE.Vector3(cur.wx(s.at[0]),cur.FLOOR+s.at[2],cur.wz(s.at[1])),'spots','button');
    l.el.innerHTML='<i></i>'+esc(s.name);l.el.addEventListener('click',()=>openSpot(s.id));spotEls[s.id]=l.el;
    const r=document.createElement('button');r.className='room';r.dataset.id=s.id;r.innerHTML='<b>'+esc(s.name)+'</b><span>'+esc(s.desc)+'</span>';
    r.addEventListener('click',()=>openSpot(s.id));$('#rooms').appendChild(r);});
}
$('#models').innerHTML=MODELS.map(m=>`<button data-id="${m.id}" aria-pressed="false"><b>${esc(m.tab[0])}</b><small>${esc(m.tab[1])}</small></button>`).join('');
$$('#models button').forEach(b=>b.addEventListener('click',()=>{if(!curDef||b.dataset.id!==curDef.id)loadModel(b.dataset.id);}));
$$('.tabs button').forEach(b=>b.addEventListener('click',()=>{$$('.tabs button').forEach(x=>x.setAttribute('aria-selected',String(x===b)));
  $$('.pane').forEach(p=>p.hidden=p.dataset.pane!==b.dataset.tab);}));
document.addEventListener('click',e=>{const img=e.target.closest&&e.target.closest('img.zoom');if(!img)return;
  $('#lightbox-img').src=img.src;$('#lightbox-img').alt=img.alt;$('#lightbox').hidden=false;});
$('#lightbox').addEventListener('click',()=>{$('#lightbox').hidden=true;});

/* ================= Carga de modelo ================= */
function loadModel(id,param,vi){
  const def=MODELS.find(m=>m.id===id)||MODELS[0];
  if(cur){scene.remove(cur.root);cur.root.traverse(o=>{if(o.geometry)o.geometry.dispose();});cur.disposables.forEach(d=>d.dispose());}
  dimsG.children.slice().forEach(c=>{c.geometry.dispose();dimsG.remove(c);});
  labels.forEach(l=>l.el.remove());labels=[];closeCard();
  curDef=def;curParam=param||0;
  const k=def.build(curParam);cur=k;scene.add(k.root);
  k.zoomOut=f=>{if(state.mode==='exterior'||state.mode==='interior')orbit.gr=presets()[state.mode].r/Math.min(1,camera.aspect)*f;};
  k.dims.forEach(addDim);
  person.position.set(k.wx(k.person[0]),0,k.wz(k.person[1]));
  addLabel('dim soft','1,75 m',new THREE.Vector3(person.position.x,1.98,person.position.z),'person');
  renderSpots();
  // suelo y sombras a la escala del modelo
  const d=diag();
  if(k.pad==='concrete'){pad.material=M.concrete;pad.scale.set(k.L+10,k.W+10,1);concreteTex.repeat.set((k.L+10)/4,(k.W+10)/4);}
  else{pad.material=M.grass;pad.scale.set(k.L+3.5,k.W+3.1,1);grassTex.repeat.set((k.L+3.5)/2,(k.W+3.1)/1.6);}
  const s=d/2+4;Object.assign(sun.shadow.camera,{left:-s,right:s,top:s,bottom:-s,near:1,far:d*3+40});sun.shadow.camera.updateProjectionMatrix();
  sun.position.set(6,13,9).multiplyScalar(Math.max(1,d/12));
  const r=1.1*d+4;scene.fog.near=r*1.8;scene.fog.far=r*4.5;camera.far=r*8;camera.updateProjectionMatrix();
  $('#t-roof-l').textContent=k.roofLabel||'Techo';
  $$('#models button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.id===def.id)));
  renderInfo(def);renderToggles();
  k.variantIdx=vi||0;renderVariants(def,k.variantIdx);const v=k.variants[k.variantIdx];if(v&&v.apply)v.apply();
  placeWalk(k.walkStart||k.spots[0].walk);
  setMode('exterior');orbit.t.copy(orbit.gt);orbit.th=orbit.gth+.9;orbit.r=orbit.gr*1.4;orbit.ph=1.0;
  try{history.replaceState(null,'','#'+def.id);}catch(e){}
}

/* ================= Entrada: puntero, rueda, teclado ================= */
const ptrs=new Map();let drag=null,pinch0=0;
canvas.addEventListener('contextmenu',e=>e.preventDefault());
canvas.addEventListener('pointerdown',e=>{canvas.setPointerCapture(e.pointerId);ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});
  drag={x:e.clientX,y:e.clientY,sx:e.clientX,sy:e.clientY,t:performance.now(),pan:e.button===2||e.shiftKey};
  if(ptrs.size===2){const[a,b]=[...ptrs.values()];pinch0=Math.hypot(a.x-b.x,a.y-b.y);}});
canvas.addEventListener('pointermove',e=>{if(!ptrs.has(e.pointerId))return;ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});
  const rMax=4*diag()+10;
  if(ptrs.size===2){const[a,b]=[...ptrs.values()];const d=Math.hypot(a.x-b.x,a.y-b.y);
    if(pinch0&&state.mode!=='recorrido')orbit.gr=THREE.MathUtils.clamp(orbit.gr*pinch0/d,2.5,rMax);pinch0=d;return;}
  if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;drag.x=e.clientX;drag.y=e.clientY;
  if(state.mode==='recorrido'){walk.yaw-=dx*.0045;walk.pitch=THREE.MathUtils.clamp(walk.pitch+dy*.0045,-1.2,1.2);walk.target=null;return;}
  if(drag.pan){const k=orbit.r*.0016,c=Math.cos(orbit.th),s=Math.sin(orbit.th);
    orbit.gt.x+=(-dx*c-dy*s)*k;orbit.gt.z+=(dx*s-dy*c)*k;
    orbit.gt.x=THREE.MathUtils.clamp(orbit.gt.x,-cur.L/2-8,cur.L/2+8);orbit.gt.z=THREE.MathUtils.clamp(orbit.gt.z,-cur.W/2-8,cur.W/2+8);return;}
  orbit.gth-=dx*.006;if(state.mode!=='planta')orbit.gph=THREE.MathUtils.clamp(orbit.gph-dy*.006,.08,1.48);});
const endPtr=e=>{ptrs.delete(e.pointerId);if(ptrs.size<2)pinch0=0;
  if(drag&&ptrs.size===0){const moved=Math.hypot(e.clientX-drag.sx,e.clientY-drag.sy);
    if(moved<6&&performance.now()-drag.t<400&&state.mode==='recorrido')clickWalk(e);drag=null;}};
canvas.addEventListener('pointerup',endPtr);canvas.addEventListener('pointercancel',endPtr);
canvas.addEventListener('wheel',e=>{if(state.mode==='recorrido')return;e.preventDefault();
  orbit.gr=THREE.MathUtils.clamp(orbit.gr*(1+Math.sign(e.deltaY)*Math.min(Math.abs(e.deltaY),120)*.0012),2.5,4*diag()+10);},{passive:false});
const ray=new THREE.Raycaster(),ndc=new THREE.Vector2();
function clickWalk(e){const r=canvas.getBoundingClientRect();ndc.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);
  ray.setFromCamera(ndc,camera);const h=ray.intersectObjects(cur.floors.concat([ground,pad]))[0];
  if(h)walk.target={x:h.point.x+cur.L/2,y:h.point.z+cur.W/2};}
const KEYMAP={KeyW:'f',ArrowUp:'f',KeyS:'b',ArrowDown:'b',KeyA:'sl',KeyD:'sr',ArrowLeft:'tl',ArrowRight:'tr',KeyQ:'tl',KeyE:'tr',ShiftLeft:'run',ShiftRight:'run'};
window.addEventListener('keydown',e=>{
  if(e.key==='Escape'){$('#lightbox').hidden=true;closeCard();return;}
  if(state.mode!=='recorrido'||!KEYMAP[e.code]||(e.target.closest&&e.target.closest('input,button')))return;keys[KEYMAP[e.code]]=true;if(KEYMAP[e.code]!=='run')walk.target=null;e.preventDefault();});
window.addEventListener('keyup',e=>{if(KEYMAP[e.code])keys[KEYMAP[e.code]]=false;});
$$('#pad button').forEach(b=>{const k=b.dataset.k;
  b.addEventListener('pointerdown',e=>{e.preventDefault();keys[k]=true;walk.target=null;b.setPointerCapture(e.pointerId);});
  ['pointerup','pointercancel','pointerleave'].forEach(ev=>b.addEventListener(ev,()=>{keys[k]=false;}));});

/* ================= Recorrido: colisiones ================= */
function distSeg(px,py,s){const ax=s[0],ay=s[1],vx=s[2]-ax,vy=s[3]-ay,l2=vx*vx+vy*vy;let t=l2?((px-ax)*vx+(py-ay)*vy)/l2:0;t=Math.max(0,Math.min(1,t));return Math.hypot(px-ax-t*vx,py-ay-t*vy);}
const hits=(x,y)=>cur.segs.some(s=>(!s[4]||s[4].visible)&&distSeg(x,y,s)<.22);

/* ================= Bucle ================= */
const v=new THREE.Vector3();
function updOrbit(dt){const k=1-Math.pow(.0015,dt);orbit.t.lerp(orbit.gt,k);orbit.th+=(orbit.gth-orbit.th)*k;orbit.ph+=(orbit.gph-orbit.ph)*k;orbit.r+=(orbit.gr-orbit.r)*k;
  const s=Math.sin(orbit.ph);camera.position.set(orbit.t.x+orbit.r*s*Math.sin(orbit.th),orbit.t.y+orbit.r*Math.cos(orbit.ph),orbit.t.z+orbit.r*s*Math.cos(orbit.th));camera.lookAt(orbit.t);}
function updWalk(dt){
  const f=(keys.f?1:0)-(keys.b?1:0),st=(keys.sr?1:0)-(keys.sl?1:0);walk.yaw+=((keys.tr?1:0)-(keys.tl?1:0))*1.7*dt;
  const sp=(keys.run?3.6:1.5)*dt,fx=Math.cos(walk.yaw),fy=Math.sin(walk.yaw);let dx=(fx*f-fy*st)*sp,dy=(fy*f+fx*st)*sp;
  if(walk.target&&!f&&!st){const tx=walk.target.x-walk.x,ty=walk.target.y-walk.y,d=Math.hypot(tx,ty);
    if(d<.06)walk.target=null;else{let da=Math.atan2(ty,tx)-walk.yaw;da=Math.atan2(Math.sin(da),Math.cos(da));walk.yaw+=da*Math.min(1,dt*5);
      const m=Math.min(d,sp*(d>4?2:1));dx=tx/d*m;dy=ty/d*m;}}
  if(dx||dy){const nx=walk.x+dx,ny=walk.y+dy;
    if(!hits(nx,ny)){walk.x=nx;walk.y=ny;}else if(!hits(nx,walk.y))walk.x=nx;else if(!hits(walk.x,ny))walk.y=ny;else walk.target=null;
    walk.x=THREE.MathUtils.clamp(walk.x,-15,cur.L+15);walk.y=THREE.MathUtils.clamp(walk.y,-15,cur.W+15);}
  const eyeT=cur.floorAt(walk.x,walk.y)+1.6;walk.eye+=(eyeT-walk.eye)*Math.min(1,dt*8);
  camera.position.set(cur.wx(walk.x),walk.eye,cur.wz(walk.y));const cp=Math.cos(walk.pitch);
  camera.lookAt(camera.position.x+fx*cp,walk.eye+Math.sin(walk.pitch),camera.position.z+fy*cp);}
let W0=0,H0=0;
function resize(){const r=stage.getBoundingClientRect();if(r.width===W0&&r.height===H0)return;W0=r.width;H0=r.height;
  renderer.setSize(W0,H0,false);camera.aspect=W0/Math.max(1,H0);camera.updateProjectionMatrix();
  if(state.mode==='planta'&&cur)orbit.gr=fitPlanR();}
function placeLabels(){
  const hide=cur.hideLabels,show={dims:dimsG.visible,person:person.visible&&!hide,spots:tSpots.checked&&!hide};
  for(const d of labels){if(!show[d.group]){d.el.hidden=true;continue;}
    v.copy(d.pos).project(camera);
    const off=v.z>1||v.z<-1||Math.abs(v.x)>1.1||Math.abs(v.y)>1.1;
    d.el.hidden=off;if(!off)d.el.style.transform=`translate(${(v.x+1)/2*W0}px,${(1-v.y)/2*H0}px) translate(-50%,${d.group==='spots'?'-100%':'-50%'})`;}
}
let last=performance.now();
function frame(now){const dt=Math.min(.05,(now-last)/1000);last=now;resize();
  if(cur.update)cur.update(dt);dims.visible();
  if(state.mode==='recorrido')updWalk(dt);else updOrbit(dt);
  renderer.render(scene,camera);placeLabels();requestAnimationFrame(frame);}

/* ================= Tema ================= */
function applyTheme(){const cs=getComputedStyle(document.documentElement);const bg=cs.getPropertyValue('--scene').trim()||'#E3E7EA';
  scene.background=new THREE.Color(bg);scene.fog.color.set(bg);M.ground.color.set(cs.getPropertyValue('--ground').trim()||'#CDD3D7').convertSRGBToLinear();
  const acc=cs.getPropertyValue('--accent').trim();if(acc)dimMat.color.set(acc);}
applyTheme();
if(window.matchMedia)matchMedia('(prefers-color-scheme: dark)').addEventListener('change',applyTheme);
new MutationObserver(applyTheme).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});

resize();
const h0=(location.hash||'').slice(1);
loadModel(MODELS.some(m=>m.id===h0)?h0:'vh30');
requestAnimationFrame(frame);
})();
</script>

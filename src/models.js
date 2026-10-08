
/* ================= Modelos ================= */

/* ---------- VH30 · cápsula de lujo ---------- */
function buildVH30(){
  const L=8.5,W=3.4,CH=.5,FLOOR=.32,WALL_TOP=2.6,ROOF_T=.266,T=.075,BX=7.05,WH=WALL_TOP-FLOOR;
  const k=makeKit({L,W,H:2.866,FLOOR});
  const {wx,wz,pbox,cyl,slab,flat,wall,glassSeg}=k;
  const trim=k.mat({color:0xE0531D,roughness:.38,metalness:.25});
  const roofG=new THREE.Group();k.root.add(roofG);k.roof.push(roofG);
  // patas, base y pisos
  [[.6,.4],[4.25,.4],[7.9,.4],[.6,3],[4.25,3],[7.9,3]].forEach(([x,y])=>k.cyl(.07,.1,.12,M.frame,x,y,0,null,16,0));
  slab(oct(0,L,0,W,CH),.12,.2,[M.base,trim]);
  k.floors.push(flat([[CH,0],[BX,0],[BX,W],[CH,W],[0,W-CH],[0,CH]],FLOOR+.003,M.floor));
  k.floors.push(flat([[BX,0],[L-CH,0],[L,CH],[L,W-CH],[L-CH,W],[BX,W]],FLOOR+.003,M.deck));
  // techo, LED y cielorraso
  const E=.12;
  slab(oct(-E,L+E,-E,W+E,CH+E*.41),WALL_TOP,ROOF_T,[M.roof,trim],roofG);
  slab(oct(-E-.008,L+E+.008,-E-.008,W+E+.008,CH+E*.41+.003),WALL_TOP+.15,.022,[M.led,M.led],roofG);
  flat(oct(-E,L+E,-E,W+E,CH+E*.41),WALL_TOP-.004,M.soffit,roofG);
  [[2.4,1.7],[4.6,1.2],[5.9,2.5],[1,.9],[.8,2.4],[7.8,1],[7.8,2.4]].forEach(([x,y])=>k.disc(x,y,WH-.008,.06,roofG));
  [[2.4,1.7],[4.8,1.6],[.8,1],[.8,2.4],[7.8,1.7]].forEach(([x,y])=>k.light(x,y,WH-.3,.55,5.5,roofG));
  // ventanales hexagonales
  function hex(u0,u1,v0,v1,side,cx,cy){cx=cx||.45;cy=cy||.6;
    return side==='left'?[[u0+cx,v0],[u1,v0],[u1,v1],[u0+cx,v1],[u0,v1-cy],[u0,v0+cy]]
                        :[[u0,v0],[u1-cx,v0],[u1,v0+cy],[u1,v1-cy],[u1-cx,v1],[u0,v1]];}
  function hexWin(grp,u0,u1,v0,v1,side){
    const h=hex(u0,u1,v0,v1,side),o=hex(u0-.07,u1+.07,v0-.07,v1+.07,side,.48,.63);
    const fs=shapeOf(o);fs.holes.push(pathOf(h));
    const f=new THREE.Mesh(new THREE.ExtrudeGeometry(fs,{depth:T+.03,bevelEnabled:false}),trim);f.castShadow=true;f.position.z=-.015;grp.add(f);
    const gl=new THREE.Mesh(new THREE.ShapeGeometry(shapeOf(h)),M.glass);gl.position.z=T/2;gl.renderOrder=2;grp.add(gl);
    const um=side==='left'?u0+(u1-u0)*.42:u0+(u1-u0)*.58;
    const mu=new THREE.Mesh(new THREE.BoxGeometry(.05,v1-v0,T+.01),M.frame);mu.position.set(um,(v0+v1)/2,T/2);grp.add(mu);}
  {const g=wall([CH,0],[BX,0],rect(BX-CH,WH),[hex(3.6,BX-CH-.08,.25,WH-.15,'left')],{inner:M.wood});hexWin(g,3.6,BX-CH-.08,.25,WH-.15,'left');}
  {const len=BX-CH,du0=BX-3.2,du1=BX-2.3,dh=2.05;
   const g=wall([BX,W],[CH,W],[[0,0],[du0,0],[du0,dh],[du1,dh],[du1,0],[len,0],[len,WH],[0,WH]],[hex(.08,2.95,.25,WH-.15,'right')],{inner:M.wood});
   hexWin(g,.08,2.95,.25,WH-.15,'right');}
  wall([0,W-CH],[0,CH],rect(W-2*CH,WH),null,{inner:M.wood});
  wall([0,CH],[CH,0],rect(Math.SQRT2*CH,WH),null,{inner:M.wood});
  wall([CH,W],[0,W-CH],rect(Math.SQRT2*CH,WH),null,{inner:M.wood});
  pbox(6.99,7.1,-.03,.07,-.2,WH,trim);pbox(6.99,7.1,W-.07,W+.03,-.2,WH,trim);
  // acceso
  pbox(3.2,3.25,W,W+.9,0,2.05,M.steel);pbox(3.12,3.17,W+.75,W+.79,.95,1.1,M.frame);
  pbox(2.26,2.3,W,W+.02,0,2.09,M.led);pbox(3.2,3.24,W,W+.02,0,2.09,M.led);pbox(2.26,3.24,W,W+.02,2.05,2.09,M.led);
  pbox(2.38,3.12,W+.02,W+.62,0,.16,M.white,null,0);pbox(2.38,3.12,W+.02,W+.32,.16,.32,M.white,null,0);
  // placa VH30
  const bc=document.createElement('canvas');bc.width=256;bc.height=160;const bt=new THREE.CanvasTexture(bc);bt.encoding=THREE.sRGBEncoding;k.disposables.push(bt);
  function badge(col){const g=bc.getContext('2d');g.clearRect(0,0,256,160);g.fillStyle=col;
    g.beginPath();g.moveTo(30,0);g.lineTo(226,0);g.lineTo(256,40);g.lineTo(256,120);g.lineTo(226,160);g.lineTo(30,160);g.lineTo(0,120);g.lineTo(0,40);g.closePath();g.fill();
    g.fillStyle='#fff';g.font='600 74px "Chakra Petch", Arial, sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText('VH30',128,74);g.fillRect(70,118,116,5);bt.needsUpdate=true;}
  const bm=new THREE.Mesh(new THREE.PlaneGeometry(.75,.47),k.mat({map:bt,transparent:true,roughness:.5}));bm.position.set(wx(1.05),FLOOR+1.55,wz(W)+.004);k.root.add(bm);
  // vidriado dormitorio/balcón y baranda
  [.075,1.25,2.42,3.325].forEach(y=>pbox(BX-.03,BX+.03,y-.025,y+.025,0,WH,M.frame));
  pbox(BX-.03,BX+.03,.075,3.325,WH-.06,WH,M.frame);pbox(BX-.03,BX+.03,.075,2.42,0,.06,M.frame);
  glassSeg([BX,.1],[BX,1.225],.06,WH-.06);glassSeg([BX,1.275],[BX,2.395],.06,WH-.06);
  glassSeg([BX+.05,3.27],[BX+.88,3.27],.02,2.15);pbox(BX+.84,BX+.88,3.25,3.29,0,2.15,M.frame);pbox(BX+.05,BX+.88,3.25,3.29,2.11,2.15,M.frame);
  const rail=[[BX,0],[L-CH,0],[L,CH],[L,W-CH],[L-CH,W],[BX+.03,W]];
  for(let i=0;i<rail.length-1;i++)glassSeg(rail[i],rail[i+1],.02,.895);
  // baño
  pbox(.075,.9,1.52,1.58,0,WH,M.wood);pbox(1.55,1.63,1.52,1.58,0,WH,M.wood);pbox(.9,1.55,1.52,1.58,2.05,WH,M.wood);pbox(1.57,1.63,1.52,3.325,0,WH,M.wood);
  glassSeg([.18,1.48],[.92,1.48],.02,2.03);pbox(.88,.92,1.46,1.5,0,2.03,M.frame);pbox(.16,.2,1.46,1.5,0,2.03,M.frame);
  cyl(.17,.14,.4,M.ceramic,.42,2.05,0);pbox(.075,.26,1.87,2.23,.38,.8,M.ceramic);
  pbox(.075,1,2.55,3.325,0,.05,M.white);glassSeg([.075,2.55],[.95,2.55],.05,2);cyl(.09,.09,.02,M.steel,.5,2.95,2.05);
  pbox(.075,.55,.75,1.45,.12,.85,M.white);pbox(.075,.58,.73,1.47,.85,.9,M.ceramic);
  pbox(.076,.09,.74,1.46,1.08,1.82,M.led);pbox(.09,.105,.78,1.42,1.12,1.78,M.mirror);
  pbox(.6,1.55,.075,.66,0,2.1,M.woodLight);pbox(1.07,1.08,.66,.665,0,2.1,M.frame);pbox(1,1.03,.665,.68,.8,1.3,M.frame);pbox(1.12,1.15,.665,.68,.8,1.3,M.frame);
  // barra, cama, mesitas, cortinas
  pbox(3.19,3.56,.2,2.17,0,1,M.wood);pbox(3,3.56,.15,2.22,1,1.04,M.white);
  [[2.75,.75],[2.75,1.6]].forEach(([x,y])=>{cyl(.03,.03,.66,M.frame,x,y,0,null,10);cyl(.17,.17,.05,M.rattan,x,y,.66);});
  pbox(3.56,3.66,.25,2.15,0,1.2,M.sage);pbox(3.66,5.66,.3,2.1,0,.32,M.wood);pbox(3.68,5.64,.32,2.08,.32,.52,M.white);pbox(4.15,5.68,.28,2.12,.48,.58,M.white);
  pbox(3.72,4.12,.42,1.14,.52,.68,M.white);pbox(3.72,4.12,1.26,1.98,.52,.68,M.white);pbox(3.66,4.06,2.18,2.55,0,.45,M.wood);
  pbox(4.05,4.25,.08,.2,.2,WH-.1,M.sage);pbox(4.05,4.25,W-.2,W-.08,.2,WH-.1,M.sage);
  [[7.75,.55],[7.8,1.4]].forEach(([x,y])=>{cyl(.3,.27,.42,M.rattan,x,y,0);pbox(x+.12,x+.3,y-.25,y+.25,.42,.82,M.rattan);});
  cyl(.2,.2,.5,M.frame,7.5,.95,0,null,20);
  // colisiones
  const {seg,rectSeg}=k;
  seg(CH,0,BX,0);seg(0,CH,CH,0);seg(0,CH,0,W-CH);seg(0,W-CH,CH,W);seg(CH,W,2.3,W);seg(3.2,W,BX,W);
  seg(BX,0,BX,2.42);for(let i=0;i<rail.length-1;i++)seg(rail[i][0],rail[i][1],rail[i+1][0],rail[i+1][1]);
  seg(BX+.05,3.27,BX+.88,3.27);seg(3.22,W,3.22,W+.9);seg(0,1.55,.9,1.55);seg(1.55,1.55,1.6,1.55);seg(1.6,1.55,1.6,W);
  rectSeg(3,5.66,.15,2.22);rectSeg(3.66,4.06,2.18,2.55);rectSeg(.6,1.55,0,.66);rectSeg(0,.58,.73,1.47);rectSeg(0,.6,1.87,2.23);seg(0,2.55,.95,2.55);rectSeg(7.4,8.2,.2,1.75);
  const insideOct=(x,y)=>x>0&&x<L&&y>0&&y<W&&x+y>CH&&(L-x)+y>CH&&x+(W-y)>CH&&(L-x)+(W-y)>CH;
  k.floorAt=(x,y)=>insideOct(x,y)?FLOOR:(x>2.3&&x<3.2&&y>=W&&y<W+.62?.16:0);
  // cotas
  const off=.75;
  k.dimX(0,L,W+off,'8.500 mm');k.dimY(0,W,-off,'3.400 mm');k.dimV(-.45,W+.45,0,2.866,'2.866 mm');
  k.dimX(0,BX,-off,'≈ 7.050 mm interior',true);k.dimX(BX,L,-off,'≈ 1.450 balcón',true);
  k.dimV(L+.35,W/2,FLOOR,FLOOR+.895,'895 mm baranda',false,[0,0,.12]);
  k.person=[4.2,W+1.1];
  k.spots=[
    {id:'entrada',name:'Entrada',at:[2.75,W,2.35],desc:'Puerta de seguridad de acero inoxidable, 0,90 m de paso (aprox.), con marco LED y dos escalones. La base eleva el piso unos 32 cm.',walk:{p:[2.75,4.6],look:[2.75,2]},view:{th:.15,ph:1.25,r:5.5}},
    {id:'dormitorio',name:'Dormitorio',at:[4.7,1.2,1],desc:'Cama de aprox. 1,80 × 2,00 m entre dos ventanales hexagonales de vidrio templado doble 12+24A+12. Cabecero tapizado.',walk:{p:[6.5,2.85],look:[4.4,1.2]},view:{th:.55,ph:.8,r:6}},
    {id:'barra',name:'Barra',at:[3.37,1.2,1.35],desc:'Barra detrás del cabecero, de cara a la entrada. Sirve de desayunador o escritorio.',walk:{p:[2.2,2.5],look:[3.37,1.2]},view:{th:-.5,ph:.85,r:5}},
    {id:'vanitory',name:'Vanitory y placard',at:[.55,.9,2.1],desc:'Vanitory con espejo retroiluminado fuera del baño y placard sobre el contrafrente.',walk:{p:[2.1,1.05],look:[.2,1.05]},view:{th:-.9,ph:.85,r:5}},
    {id:'bano',name:'Baño',at:[.8,2.45,2.15],desc:'Inodoro y ducha con mampara, detrás de una puerta corrediza de aluminio y vidrio. Medidas aproximadas: 1,5 × 1,8 m.',walk:{p:[1.3,1.85],look:[.3,2.3],pitch:-.4},view:{th:-1.1,ph:.75,r:4.5}},
    {id:'balcon',name:'Balcón',at:[7.8,1.7,1.2],desc:'Deck exterior WPC de ≈ 1,45 × 3,4 m bajo el mismo techo, con baranda de vidrio de 895 mm y puerta vidriada al dormitorio.',walk:{p:[6.3,1.7],look:[8.5,1.7]},view:{th:1,ph:.95,r:6}}
  ];
  k.walkStart={p:[2.75,2.6],look:[4.6,1.2]};
  k.variantLabel='Terminación';
  k.variants=[
    {label:'Naranja',swatch:'#E0531D',apply(){setCol(trim,0xE0531D);badge('#E0531D');}},
    {label:'Grafito',swatch:'#3A3F45',apply(){setCol(trim,0x3A3F45);badge('#3A3F45');}}
  ];
  if(document.fonts)document.fonts.ready.then(()=>{const v=k.variants[k.variantIdx||0];v&&v.apply();});
  return k;
}

/* ---------- E20 · casa expandible ---------- */
function buildE20(){
  const L=6.32,W=5.9,FLOOR=.18,WT=2.36,H=2.48,WH=WT-FLOOR,M1=2.06,M2=4.26;
  const k=makeKit({L,W,H,FLOOR});
  const {pbox,cyl,wall,win,seg,rectSeg,wx}=k;
  const panel=k.mat({map:panelTex,roughness:.5}), cframe=k.mat({color:0xF2F3F3,roughness:.45,metalness:.2}), wframe=k.mat({color:0xF6F6F6,roughness:.4,metalness:.1});
  const roofM=k.mat({color:0xEDEEEE,roughness:.6}), lam=k.mat({map:floorTex,color:0xD9CDBE,roughness:.6}), counter=k.mat({color:0x3A3C3E,roughness:.4});
  // alas plegables: grupos con pivote en el borde del módulo central
  function wing(px){const piv=new THREE.Group();piv.position.x=wx(px);const inner=new THREE.Group();inner.position.x=-wx(px);piv.add(inner);k.root.add(piv);return [piv,inner];}
  const [wingL,gl]=wing(M1),[wingR,gr]=wing(M2);
  const interior=new THREE.Group();k.root.add(interior);
  // bases, pisos y techos por sección
  [[0,M1,gl],[M1,M2,null],[M2,L,gr]].forEach(([a,b,g])=>{
    pbox(a,b,0,W,0,FLOOR,M.base,g,0);
    const f=pbox(a+.02,b-.02,.04,W-.04,FLOOR,FLOOR+.004,lam,g,0);f.castShadow=false;k.floors.push(f);
    k.roof.push(pbox(a,b,-.02,W+.02,WT,g?H-.03:H,roofM,g,0));
  });
  // marco del módulo central (tipo contenedor)
  [[M1,0],[M2,0],[M1,W],[M2,W]].forEach(([x,y])=>pbox(x-.08,x+.08,y?W-.12:-.02,y?W+.02:.12,0,H,cframe,null,0));
  [M1,M2].forEach(x=>{pbox(x-.08,x+.08,0,W,0,FLOOR,cframe,null,0);k.roof.push(pbox(x-.08,x+.08,-.04,W+.04,WT,H+.01,cframe,null,0));});
  // muros perimetrales (por sección), ventanas 1,0 × 1,1 m con antepecho 0,9 m
  const v0=.9,v1=2;
  {const g=wall([0,0],[M1,0],rect(M1,WH),[R(.55,1.55,v0,v1)],{outer:panel,parent:gl});win(g,.55,1.55,v0,v1,wframe,true);}
  {const g=wall([M1,0],[M2,0],rect(M2-M1,WH),[R(.84,1.34,1.55,1.95)],{outer:panel});win(g,.84,1.34,1.55,1.95,wframe);}
  {const g=wall([M2,0],[L,0],rect(L-M2,WH),[R(.54,1.54,v0,v1)],{outer:panel,parent:gr});win(g,.54,1.54,v0,v1,wframe,true);}
  {const g=wall([L,0],[L,W],rect(W,WH),[R(1.1,2.1,v0,v1),R(4,5,v0,v1)],{outer:panel,parent:gr});win(g,1.1,2.1,v0,v1,wframe,true);win(g,4,5,v0,v1,wframe,true);}
  {const g=wall([L,W],[M2,W],rect(L-M2,WH),[R(.52,1.52,v0,v1)],{outer:panel,parent:gr});win(g,.52,1.52,v0,v1,wframe,true);}
  // frente central: puerta doble vidriada + paños fijos laterales
  {const len=M2-M1,d0=.5,d1=1.7,dh=2.05;
   const g=wall([M2,W],[M1,W],[[0,0],[d0,0],[d0,dh],[d1,dh],[d1,0],[len,0],[len,WH],[0,WH]],[R(.12,.42,.15,dh),R(1.78,2.08,.15,dh),R(d0,d1,dh+.08,WH-.06)],{outer:panel});
   win(g,.12,.42,.15,dh,wframe);win(g,1.78,2.08,.15,dh,wframe);win(g,d0,d1,dh+.08,WH-.06,wframe);
   pbox(M2-d1-.05,M2-d1,W,W+.62,0,dh,wframe);pbox(M2-d0,M2-d0+.05,W,W+.62,0,dh,wframe);
   k.glassSeg([M2-d1-.02,W+.04],[M2-d1-.02,W+.6],.06,dh-.06);k.glassSeg([M2-d0+.02,W+.04],[M2-d0+.02,W+.6],.06,dh-.06);
   pbox(M1+.3,M2-.3,W,W+.45,0,.1,M.concrete,null,0);}
  {const g=wall([M1,W],[0,W],rect(M1,WH),[R(.51,1.51,v0,v1)],{outer:panel,parent:gl});win(g,.51,1.51,v0,v1,wframe,true);}
  {const g=wall([0,W],[0,0],rect(W,WH),[R(.9,1.9,v0,v1),R(3.8,4.8,v0,v1)],{outer:panel,parent:gl});win(g,.9,1.9,v0,v1,wframe,true);win(g,3.8,4.8,v0,v1,wframe,true);}
  // tabiques (baño y dormitorio)
  const P=(a,b,c,d,h0,h1,m)=>pbox(a,b,c,d,h0,h1,m||M.wallIn,interior);
  P(2.37,2.43,.06,2.33,0,WH);P(3.84,3.9,.06,2.41,0,WH);P(2.4,3.2,2.3,2.36,0,WH);P(3.2,3.87,2.3,2.36,2.05,WH);
  P(3.84,3.9,2.41,3.41,2.05,WH);P(3.84,3.9,3.25,3.41,0,WH);P(3.87,L-.06,3.35,3.41,0,WH);
  // baño
  P(2.43,3.84,.06,.92,0,.05,M.white);k.glassSeg([2.43,.92],[3.4,.92],.05,2,interior);k.cyl(.09,.09,.02,M.steel,3.1,.45,2.0,interior);
  k.cyl(.17,.14,.4,M.ceramic,2.75,1.2,0,interior);P(2.43,2.6,1.02,1.38,.38,.8,M.ceramic);
  P(2.43,2.88,1.58,2.24,.1,.82,M.white);P(2.43,2.9,1.56,2.26,.82,.87,M.ceramic);P(2.43,2.45,1.62,2.2,1.05,1.75,M.mirror);
  // dormitorio
  P(3.9,3.98,.13,1.76,0,1.05,M.fabric);P(3.98,5.98,.13,1.76,0,.3,M.wood);P(4,5.96,.15,1.74,.3,.5,M.white);P(4.5,6,.11,1.78,.46,.56,k.mat({color:0x4E6E8E,roughness:.9}));
  P(4.02,4.4,.25,.85,.5,.64,M.white);P(4.02,4.4,1.04,1.64,.5,.64,M.white);P(3.95,4.35,1.8,2.2,0,.45,M.wood);P(5.25,6.26,2.76,3.34,0,2,M.woodLight);
  // cocina
  P(.06,.62,.06,.7,0,1.75,M.steel);P(.62,1.78,.06,.66,0,.88,M.white);P(.62,1.78,.06,.66,.88,.92,counter);
  P(1.78,2.37,.06,2.15,0,.88,M.white);P(1.78,2.37,.06,2.15,.88,.92,counter);P(1.9,2.3,1.3,1.8,.921,.93,M.steel);
  P(.95,1.6,.15,.55,.921,.93,M.dark);P(.62,1.78,.06,.4,1.45,2.1,M.white);
  // comedor
  P(.3,1.05,2.3,2.85,.72,.76,M.wood);P(.62,.72,2.52,2.62,0,.72,M.frame);
  [[.45,2.05],[.9,2.05],[.45,3.1],[.9,3.1]].forEach(([x,y])=>{P(x-.2,x+.2,y-.2,y+.2,.42,.47,M.dark);P(x-.2,x+.2,y+(y>2.5?.16:-.2),y+(y>2.5?.2:-.16),.47,.9,M.dark);P(x-.02,x+.02,y-.02,y+.02,0,.42,M.frame);});
  // living
  P(.08,.95,3.6,5.4,0,.42,M.fabric);P(.08,.3,3.6,5.4,.42,.85,M.fabric);P(1.4,1.85,4.15,4.85,0,.42,M.white);
  P(4.3,6,4.95,5.82,0,.42,M.fabric);P(4.3,6,5.6,5.82,.42,.85,M.fabric);P(2.6,3.6,2.36,2.4,1.1,1.7,M.dark);
  [[1.6,4.2],[5,1.6],[1.1,1.2],[3.1,1.2]].forEach(([x,y])=>{k.disc(x,y,WH-.01,.1,interior);k.light(x,y,WH-.3,.45,5,interior);});
  // pliegue animado de las alas
  let fold=1,foldT=1;
  k.toggles.push({id:'fold',label:'Plegada (transporte)',checked:false,onChange(v){foldT=v?.035:1;}});
  k.update=dt=>{if(Math.abs(foldT-fold)<1e-4)return;fold+=(foldT-fold)*Math.min(1,dt*3);if(Math.abs(foldT-fold)<.002)fold=foldT;
    wingL.scale.x=wingR.scale.x=fold;interior.visible=fold>.97;k.hideLabels=fold<.97;};
  k.onWalk=()=>{foldT=1;fold=1;wingL.scale.x=wingR.scale.x=1;interior.visible=true;k.hideLabels=false;const t=$('#x-fold');if(t)t.checked=false;};
  // colisiones
  seg(0,0,L,0);seg(L,0,L,W);seg(L,W,M2-.5,W);seg(M1+.5,W,0,W);seg(0,W,0,0);
  seg(2.4,0,2.4,2.33);seg(3.87,0,3.87,2.41);seg(2.4,2.33,3.2,2.33);seg(3.87,3.25,3.87,3.38);seg(3.87,3.38,L,3.38);
  seg(M2-1.7,W,M2-1.7,W+.62);seg(M2-.5,W,M2-.5,W+.62);
  rectSeg(2.4,3.84,0,.92);rectSeg(2.4,2.9,1.02,2.26);rectSeg(3.9,5.98,.1,2.2);rectSeg(5.25,6.3,2.76,3.38);
  rectSeg(0,2.37,0,.7);rectSeg(1.78,2.37,0,2.15);rectSeg(.25,1.1,1.85,3.3);rectSeg(0,.95,3.6,5.4);rectSeg(1.4,1.85,4.15,4.85);rectSeg(4.3,6,4.95,W);
  k.floorAt=(x,y)=>x>0&&x<L&&y>0&&y<W?FLOOR:(x>M1+.3&&x<M2-.3&&y>=W&&y<W+.45?.1:0);
  // cotas
  k.dimX(0,L,W+.75,'6.320 mm');k.dimY(0,W,-.75,'5.900 mm');k.dimV(-.45,W+.45,0,H,'2.480 mm');
  k.dimX(0,M1,-.75,'2.060 ala',true);k.dimX(M1,M2,-.75,'2.200 módulo',true);k.dimX(M2,L,-.75,'2.060 ala',true);
  k.person=[5.2,W+1.2];
  k.spots=[
    {id:'entrada',name:'Entrada',at:[3.16,W,2.35],desc:'Puerta doble vidriada con paños fijos laterales, en el frente del módulo central.',walk:{p:[3.16,7.4],look:[3.16,3]},view:{th:.1,ph:1.2,r:6.5}},
    {id:'living',name:'Living',at:[1.5,4.4,1.1],desc:'Living con dos sillones enfrentados. Es el área más grande: ocupa el frente de la casa.',walk:{p:[3.2,4.4],look:[.8,4.3]},view:{th:-.4,ph:.8,r:6}},
    {id:'cocina',name:'Cocina y comedor',at:[1.2,1.1,1.5],desc:'Cocina en L con anafe, pileta y heladera, y mesa para cuatro.',walk:{p:[1.6,3.5],look:[1,.6]},view:{th:-.7,ph:.8,r:5.5}},
    {id:'bano',name:'Baño',at:[3.1,1.3,2.1],desc:'Ducha, inodoro y vanitory con espejo, en el centro de la casa. Medidas aproximadas: 1,45 × 2,3 m.',walk:{p:[3.5,1.75],look:[2.6,1.2],pitch:-.35},view:{th:-.2,ph:.75,r:4.5}},
    {id:'dormitorio',name:'Dormitorio',at:[5,1.2,1.2],desc:'Cama de aprox. 1,50 × 2,00 m, mesa de luz y placard. Medidas aproximadas: 2,4 × 3,4 m.',walk:{p:[4.6,2.85],look:[5.5,1]},view:{th:.5,ph:.8,r:5.5}}
  ];
  k.walkStart={p:[3.16,4.6],look:[1,2.4]};
  k.variantLabel='Terminación';
  const P2=(c,map,f,w)=>()=>{panel.map=map;panel.needsUpdate=true;setCol(panel,c);setCol(cframe,f);setCol(wframe,w);};
  k.variants=[
    {label:'Blanca',swatch:'#EDEFF0',apply:P2(0xEEF0F1,panelTex,0xF2F3F3,0xF6F6F6)},
    {label:'Gris',swatch:'#68717A',apply:P2(0x68717A,ribTex,0xF2F3F3,0xF6F6F6)},
    {label:'Negra',swatch:'#2C3034',apply:P2(0x41464B,ribTex,0x1E2124,0x1E2124)},
    {label:'Madera',swatch:'#B9733F',apply:P2(0xE7A56E,woodTex,0x1E2124,0x1E2124)}
  ];
  return k;
}

/* ---------- K5 · contenedor desarmable ---------- */
function buildK5(){
  const L=6,W=3,H=2.8,P=.16,FLOOR=.18,TOP=2.62,WH=TOP-FLOOR,T=.075,o=.03;
  const k=makeKit({L,W,H,FLOOR});
  const {pbox,cyl,wall,win,seg,rectSeg}=k;
  const fr=k.mat({color:0x4A5056,roughness:.45,metalness:.35}), panel=k.mat({map:panelTex,roughness:.5}), pvc=k.mat({map:floorTex,color:0x9DA3A6,roughness:.7}), wf=k.mat({color:0xF4F4F4,roughness:.4});
  const mod=new THREE.Group();k.root.add(mod);
  const B=(a,b,c,d,h0,h1,m)=>pbox(a,b,c,d,h0,h1,m,mod,0);
  // marco: columnas y vigas
  [[0,0],[L-P,0],[0,W-P],[L-P,W-P]].forEach(([x,y])=>B(x,x+P,y,y+P,0,H,fr));
  [[0,P],[W-P,W]].forEach(([y0,y1])=>{B(P,L-P,y0,y1,0,FLOOR,fr);B(P,L-P,y0,y1,TOP,H,fr);});
  [[0,P],[L-P,L]].forEach(([x0,x1])=>{B(x0,x1,P,W-P,0,FLOOR,fr);B(x0,x1,P,W-P,TOP,H,fr);});
  k.roof.push(B(P,L-P,P,W-P,TOP+.02,H-.02,k.mat({color:0xD9DCDE,roughness:.6})));
  B(P,L-P,P,W-P,.02,FLOOR,M.base);
  const fl=pbox(P,L-P,P,W-P,FLOOR,FLOOR+.004,pvc,mod,0);fl.castShadow=false;k.floors.push(fl);
  // muros de panel sándwich
  const opt={outer:panel,parent:mod};
  wall([P,o],[L-P,o],rect(L-2*P,WH),null,opt);
  wall([L-P,W-o],[P,W-o],rect(L-2*P,WH),null,opt);
  {const g=wall([o,W-P],[o,P],rect(W-2*P,WH),[R(1.15,2.27,1.1,2.2)],opt);win(g,1.15,2.27,1.1,2.2,wf,true);}
  {const len=W-2*P,d0=.04,d1=.86,dh=2.035;
   const g=wall([L-o,P],[L-o,W-P],[[0,0],[d0,0],[d0,dh],[d1,dh],[d1,0],[len,0],[len,WH],[0,WH]],[R(1.1,2.22,1.1,2.2)],opt);win(g,1.1,2.22,1.1,2.2,wf,true);}
  pbox(5.02,5.86,.11,.16,0,2.03,M.white,mod);pbox(5.08,5.12,.16,.2,.95,1.05,M.frame,mod);
  // baño
  const I=(a,b,c,d,h0,h1,m)=>pbox(a,b,c,d,h0,h1,m||M.wallIn,mod);
  I(1.26,1.32,1.02,W-P-o,0,WH);I(1.26,1.32,P+o,1.02,2.05,WH);I(.45,1.26,.11,.16,0,2.03,M.white);
  cyl(.2,.12,.08,M.ceramic,.32,.5,.8,mod);cyl(.05,.05,.8,M.ceramic,.3,.5,0,mod,10);
  cyl(.17,.14,.4,M.ceramic,.58,1.22,0,mod);I(.11,.28,1.04,1.4,.38,.8,M.ceramic);
  I(.11,1.06,1.95,2.84,0,.05,M.white);k.glassSeg([.11,1.95],[.6,1.95],.05,1.95,mod);k.glassSeg([.6,1.95],[1.06,2.4],.05,1.95,mod);k.glassSeg([1.06,2.4],[1.06,2.84],.05,1.95,mod);
  // tubo LED de techo
  I(2.4,4.6,1.46,1.54,WH-.05,WH-.01,M.led);k.light(3.5,1.5,WH-.3,.6,6,mod);k.light(.6,1.5,WH-.3,.4,3,mod);
  // combinación de módulos (clones del exterior)
  const combo=new THREE.Group();combo.visible=false;k.root.add(combo);
  [[0,0,W],[0,H,0],[0,H,W],[L,0,0]].forEach(([dx,dy,dz])=>{const c=mod.clone();c.position.set(dx,dy,dz);combo.add(c);});
  k.toggles.push({id:'combo',label:'Combinar 5 módulos',checked:false,onChange(v){combo.visible=v;k.zoomOut&&k.zoomOut(v?1.6:1);}});
  // colisiones
  seg(0,0,L,0);seg(0,W,L,W);seg(0,0,0,W);seg(L,0,L,P);seg(L,1.02,L,W);seg(1.29,1.02,1.29,W);seg(5.02,.13,5.86,.13);
  rectSeg(0,.45,.3,.75);rectSeg(0,.75,1.02,1.4);seg(.11,1.95,.6,1.95);seg(.6,1.95,1.06,2.4);seg(1.06,2.4,1.06,W);
  k.floorAt=(x,y)=>x>P&&x<L-P&&y>P&&y<W-P?FLOOR:0;
  // cotas
  k.dimX(0,L,W+.75,'6.000 mm');k.dimY(0,W,-.75,'3.000 mm');k.dimV(-.45,W+.45,0,H,'2.800 mm');
  k.dimY(.18,1.02,L+.45,'840 puerta',true);k.dimY(1.26,2.38,L+.45,'1.150 ventana',true);
  k.person=[3.6,W+1.1];
  k.spots=[
    {id:'acceso',name:'Acceso',at:[L,.6,2.3],desc:'Puerta de 840 × 2.035 mm y ventana corrediza de 1.150 × 1.100 mm en el mismo extremo.',walk:{p:[7.6,.6],look:[3.5,1.4]},view:{th:1.2,ph:1.2,r:6}},
    {id:'ambiente',name:'Ambiente principal',at:[3.6,1.5,1.3],desc:'Espacio libre de aprox. 4,5 × 2,7 m. Sirve como oficina, dormitorio, vestuario o depósito.',walk:{p:[5.5,2.3],look:[2,1.3]},view:{th:.4,ph:.75,r:6}},
    {id:'bano',name:'Baño',at:[.65,1.6,2.1],desc:'Lavatorio, inodoro y ducha en esquina, separados por un tabique con puerta. Medidas aproximadas: 1,1 × 2,7 m.',walk:{p:[.9,.7],look:[.4,2.4],pitch:-.35},view:{th:-.7,ph:.75,r:4.5}},
    {id:'marco',name:'Marco de acero',at:[L,W,2.62],desc:'Columnas y vigas al ras, sin uniones a la vista. El agua de lluvia baja por dentro de las columnas.',walk:{p:[7.6,4.4],look:[6,3]},view:{th:.8,ph:1.05,r:4.5}}
  ];
  k.walkStart={p:[5.5,.6],look:[2,1.5]};
  k.variantLabel='Marco';
  k.variants=[
    {label:'Gris',swatch:'#4A5056',apply(){setCol(fr,0x4A5056);}},
    {label:'Blanco',swatch:'#EDEEEF',apply(){setCol(fr,0xE6E8E9);}},
    {label:'Negro',swatch:'#222528',apply(){setCol(fr,0x222528);}}
  ];
  return k;
}

/* ---------- Estructura de acero (perfil C) ---------- */
function buildSteel(param){
  const S=[{W:10,L:15,H:6},{W:15,L:20,H:7.25}][param||0];
  const L=S.L,W=S.W,ridge=S.H,slope=.1,eave=ridge-W/2*slope,FLOOR=.15,bay=5,c=.12;
  const k=makeKit({L,W,H:ridge,FLOOR});
  const {pbox,wall,win,seg,rectSeg,wx,wz}=k;
  k.pad='concrete';
  const frameG=new THREE.Group(),cladG=new THREE.Group(),roofG=new THREE.Group();k.root.add(frameG,cladG,roofG);k.roof.push(roofG);
  k.floors.push(pbox(-.6,L+.6,-.6,W+.6,0,FLOOR,M.concrete,null,0));
  const beam=(p,q,w,h,mat,parent)=>{const a=new THREE.Vector3(...p),b=new THREE.Vector3(...q);
    const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,a.distanceTo(b)),mat);m.castShadow=m.receiveShadow=true;m.position.copy(a).add(b).multiplyScalar(.5);m.lookAt(b);(parent||k.root).add(m);return m;};
  const G=M.galv, hy=y=>eave+slope*Math.min(y,W-y);
  const xs=[];for(let x=0;x<=L+1e-6;x+=bay)xs.push(x);
  // pórticos
  xs.forEach((x,i)=>{const cx=i===0?.1:i===xs.length-1?L-.1:x;
    pbox(cx-.1,cx+.1,0,.25,0,eave+.15,G,frameG);pbox(cx-.1,cx+.1,W-.25,W,0,eave+.15,G,frameG);
    pbox(cx-.22,cx+.22,-.1,.35,0,.03,M.frame,frameG);pbox(cx-.22,cx+.22,W-.35,W+.1,0,.03,M.frame,frameG);
    const e=FLOOR+eave+.1,r=FLOOR+ridge+.1;
    beam([wx(cx),e,wz(.05)],[wx(cx),r,wz(W/2)],.18,.32,G,frameG);beam([wx(cx),r,wz(W/2)],[wx(cx),e,wz(W-.05)],.18,.32,G,frameG);
    if(i===0||i===xs.length-1){const n=W>12?4:3;for(let j=1;j<n;j++){const y=W*j/n;pbox(cx-.08,cx+.08,y-.1,y+.1,0,hy(y),G,frameG);}}
  });
  // correas de techo, largueros de pared y arriostramiento
  for(let y=.35;y<W/2-.1;y+=1.2)[y,W-y].forEach(yy=>{const h=hy(yy)+.26;pbox(-.25,L+.25,yy-.04,yy+.04,h,h+.14,G,frameG);});
  for(let h=1.2;h<eave-.3;h+=1.2){pbox(0,L,-.07,0,h,h+.12,G,frameG);pbox(0,L,W,W+.07,h,h+.12,G,frameG);
    [[-.07,0],[L,L+.07]].forEach(([a,b])=>{pbox(a,b,0,W/2-2.2,h,h+.12,G,frameG);pbox(a,b,W/2+2.2,W,h,h+.12,G,frameG);});}
  [[0,bay],[L-bay,L]].forEach(([a,b])=>{
    [-.03,W+.03].forEach(y=>{k.rod([wx(a),FLOOR+.3,wz(y)],[wx(b),FLOOR+eave,wz(y)],.012,M.frame,frameG);k.rod([wx(b),FLOOR+.3,wz(y)],[wx(a),FLOOR+eave,wz(y)],.012,M.frame,frameG);});
    [[.2,W/2],[W-.2,W/2]].forEach(([y0,y1])=>{k.rod([wx(a),FLOOR+hy(y0)+.3,wz(y0)],[wx(b),FLOOR+hy(y1)+.3,wz(y1)],.012,M.frame,frameG);k.rod([wx(b),FLOOR+hy(y0)+.3,wz(y0)],[wx(a),FLOOR+hy(y1)+.3,wz(y1)],.012,M.frame,frameG);});
  });
  // revestimiento de chapa con ventanas C10 (2.500 × 1.200) y C15 (750 × 3.684)
  const clad=k.mat({map:ribTex,color:0x6C7F93,roughness:.5,metalness:.3}),wfr=k.mat({color:0x2B2F33,roughness:.4,metalness:.4});
  const ew=eave+.25,opt={outer:clad,inner:clad,T:.04,parent:cladG};
  const winsSide=[];for(let x=bay/2;x<L;x+=bay)winsSide.push(x);
  {const g=wall([-c,-c],[L+c,-c],rect(L+2*c,ew),winsSide.map(x=>R(x+c-1.25,x+c+1.25,1.2,2.4)),opt);winsSide.forEach(x=>win(g,x+c-1.25,x+c+1.25,1.2,2.4,wfr,true));}
  {const g=wall([L+c,W+c],[-c,W+c],rect(L+2*c,ew),winsSide.map(x=>R(L+c-x-1.25,L+c-x+1.25,1.2,2.4)),opt);winsSide.forEach(x=>win(g,L+c-x-1.25,L+c-x+1.25,1.2,2.4,wfr,true));}
  const len=W+2*c,m=len/2,rt=ridge+.3;
  wall([-c,W+c],[-c,-c],[[0,0],[m-2,0],[m-2,4],[m+2,4],[m+2,0],[len,0],[len,ew],[m,rt],[0,ew]],null,opt);
  {const d0=1.62,d1=2.62,w1=[m-1.5-.375,m-1.5+.375],w2=[m+1.5-.375,m+1.5+.375],wh=Math.min(4.18,ew-.4);
   const g=wall([L+c,-c],[L+c,W+c],[[0,0],[d0,0],[d0,2.1],[d1,2.1],[d1,0],[len,0],[len,ew],[m,rt],[0,ew]],[R(w1[0],w1[1],.5,wh),R(w2[0],w2[1],.5,wh)],opt);
   win(g,w1[0],w1[1],.5,wh,wfr);win(g,w2[0],w2[1],.5,wh,wfr);}
  pbox(-c-.3,-c,W/2-2.15,W/2+2.15,4,4.45,k.mat({color:0x3F454B,roughness:.5}),cladG);
  pbox(L+c,L+c+.85,1.47,1.52,0,2.1,wfr,cladG);
  // cubierta a dos aguas
  const run=W/2+c+.3,sl=Math.hypot(run,run*slope),rtx=roofTex.clone();rtx.needsUpdate=true;rtx.repeat.set((L+2*c+.4)*4,1);k.disposables.push(rtx);
  const rm=k.mat({map:rtx,color:0x8FA3B8,roughness:.45,metalness:.5});
  [[-1,1],[1,-1]].forEach(([s])=>{const ym=s<0?(W/2-run/2):(W/2+run/2);
    const b=new THREE.Mesh(new THREE.BoxGeometry(L+2*c+.4,.04,sl),rm);b.castShadow=b.receiveShadow=true;
    b.position.set(0,FLOOR+eave+slope*(W/2-Math.abs(ym-W/2))+.42,wz(ym));b.rotation.x=s<0?-Math.atan(slope):Math.atan(slope);roofG.add(b);});
  pbox(-c-.2,L+c+.2,W/2-.2,W/2+.2,ridge+.43,ridge+.5,rm,roofG);
  // colisiones
  seg(-c,-c,L+c,-c,cladG);seg(-c,W+c,L+c,W+c,cladG);seg(-c,-c,-c,W/2-2,cladG);seg(-c,W/2+2,-c,W+c,cladG);
  seg(L+c,-c,L+c,1.5,cladG);seg(L+c,2.5,L+c,W+c,cladG);seg(L+c,1.5,L+c+.85,1.5,cladG);
  xs.forEach((x,i)=>{const cx=i===0?.1:i===xs.length-1?L-.1:x;rectSeg(cx-.1,cx+.1,0,.25);rectSeg(cx-.1,cx+.1,W-.25,W);});
  k.floorAt=(x,y)=>x>-.6&&x<L+.6&&y>-.6&&y<W+.6?FLOOR:0;
  // cotas
  const f=n=>n.toLocaleString('es-AR');
  k.dimX(0,L,W+1.4,f(L*1000)+' mm');k.dimY(0,W,-1.4,f(W*1000)+' mm');k.dimV(-.9,W+.9,0,FLOOR+ridge,f(ridge*1000)+' mm cumbrera');
  k.dimV(L+.9,-.9,0,FLOOR+eave,'≈ '+f(eave*1000)+' alero',true);k.dimX(0,bay,-1.6,'5.000 entre pórticos',true);
  k.person=[L*.42,W+2.2];
  k.spots=[
    {id:'porton',name:'Portón',at:[0,W/2,4.4],desc:'Portón de ejemplo de 4 × 4 m en el frente, con cortina enrollable. El tamaño y la ubicación se definen en cada proyecto.',walk:{p:[-5,W/2],look:[L/2,W/2]},view:{th:-1.35,ph:1.2,r:Math.max(14,W*1.4)}},
    {id:'nave',name:'Nave libre',at:[L/2,W/2,1.8],desc:`Planta libre de ${f(W)} × ${f(L)} m, sin columnas intermedias. Pórticos cada 5 m.`,walk:{p:[1.2,W/2],look:[L,W/2]},view:{th:.5,ph:.8,r:Math.hypot(L,W)*1.1}},
    {id:'portico',name:'Pórtico',at:[bay,.15,eave+.3],desc:'Pórtico de perfil C: columnas, vigas a dos aguas, correas de techo y largueros de pared. Arriostramiento en cruz en los paños extremos.',walk:{p:[bay+1.6,2.6],look:[bay,0],pitch:.45},view:{th:.25,ph:1.05,r:10}},
    {id:'cubierta',name:'Cubierta',at:[L*.7,W*.25,eave+.6],desc:'Chapa de acero color con recubrimiento de aluminio-zinc-silicio (hasta 30 años, según el fabricante). Panel EPS de 50 mm opcional para aislación.',walk:{p:[L-2,W/2],look:[L*.6,W*.3],pitch:.55},view:{th:.6,ph:.85,r:Math.hypot(L,W)*1.1}}
  ];
  k.walkStart={p:[-4,W/2],look:[L/2,W/2]};
  k.toggles.push({id:'clad',label:'Revestimiento',checked:true,onChange(v){cladG.visible=v;}});
  k.variantLabel='Tamaño de ejemplo';
  k.variants=[{label:'10 × 15 × 6 m',param:0},{label:'15 × 20 × 7,25 m',param:1}];
  return k;
}

/* ---------- Hotel de acero liviano (proyecto de referencia) ---------- */
function buildHotel(){
  const L=38.8,W=8.85,FLOOR=.15,FH=3.25,CI=FH-.25,yA=3.3,yB=4.6;
  const k=makeKit({L,W,H:6.9,FLOOR});
  const {pbox,wall,win,seg,rectSeg,cyl}=k;
  k.pad='concrete';k.roofLabel='Planta alta y techo';
  const facade=k.mat({map:ribTex,color:0x5C6166,roughness:.6}),wf=k.mat({color:0x23272B,roughness:.4,metalness:.4}),slabM=k.mat({color:0xE4E4E1,roughness:.9});
  const up=new THREE.Group();k.root.add(up);k.roof.push(up);
  k.floors.push(pbox(-.5,L+.5,-.5,W+.5,0,FLOOR,M.concrete,null,0));
  const fin=pbox(.1,L-.1,.1,W-.1,FLOOR,FLOOR+.004,M.floor,null,0);fin.castShadow=false;k.floors.push(fin);
  const xb=[0,6,12,18,20.8,26.8,32.8,38.8],mid=[18,20.8];
  const rooms=[];xb.slice(0,-1).forEach((x,i)=>{if(i===3)return;rooms.push(x,x+3);});
  const parts=[...new Set(rooms.concat([...mid]))].filter(x=>x>0&&x<L).sort((a,b)=>a-b);
  function level(lv,parent){
    const base=FLOOR+lv*FH,opt={outer:facade,T:.15,base,parent};
    const P=(a,b,c,d,h0,h1,m)=>pbox(a,b,c,d,h0,h1,m||M.wallIn,parent,base);
    // fachada A (y=0) con acceso en planta baja
    const wA=rooms.map(x=>R(x+.7,x+2.3,.9,2.1));
    let gA;
    if(lv===0){gA=wall([0,0],[L,0],[[0,0],[18.65,0],[18.65,2.2],[20.15,2.2],[20.15,0],[L,0],[L,FH],[0,FH]],wA,opt);
      pbox(18.6,20.2,-.05,.05,2.2,2.3,wf,parent,base);}
    else{gA=wall([0,0],[L,0],rect(L,FH),wA.concat([R(18.9,19.9,1,2.2)]),opt);win(gA,18.9,19.9,1,2.2,wf);}
    rooms.forEach(x=>win(gA,x+.7,x+2.3,.9,2.1,wf,true));
    // fachada B (y=W) con ventanas de la escalera
    const sv=lv===0?[1.75,2.75]:[.5,1.5];
    const gB=wall([L,W],[0,W],rect(L,FH),rooms.map(x=>R(L-x-2.3,L-x-.7,.9,2.1)).concat([R(L-20.25,L-19,sv[0],sv[1])]),opt);
    rooms.forEach(x=>win(gB,L-x-2.3,L-x-.7,.9,2.1,wf,true));win(gB,L-20.25,L-19,sv[0],sv[1],wf);
    // cabeceras con salida al pasillo
    if(lv===0){wall([L,0],[L,W],[[0,0],[3.5,0],[3.5,2.1],[4.4,2.1],[4.4,0],[W,0],[W,FH],[0,FH]],null,opt);
      wall([0,W],[0,0],[[0,0],[4.45,0],[4.45,2.1],[5.35,2.1],[5.35,0],[W,0],[W,FH],[0,FH]],null,opt);}
    else{const g1=wall([L,0],[L,W],rect(W,FH),[R(3.5,4.4,1,2.2)],opt);win(g1,3.5,4.4,1,2.2,wf);
      const g2=wall([0,W],[0,0],rect(W,FH),[R(4.45,5.35,1,2.2)],opt);win(g2,4.45,5.35,1,2.2,wf);}
    // pasillo: muros con una puerta por habitación
    [[yA-.05,yA+.05],[yB-.05,yB+.05]].forEach(([y0,y1])=>{let x=.15;
      rooms.forEach(r=>{if(r>=mid[1]&&x<mid[1]){P(x,mid[0],y0,y1,0,CI);x=mid[1];}
        P(x,r+.15,y0,y1,0,CI);P(r+.15,r+1.05,y0,y1,2.1,CI);x=r+1.05;});
      P(x,L-.15,y0,y1,0,CI);});
    // tabiques entre habitaciones
    parts.forEach(x=>{P(x-.05,x+.05,.15,yA,0,CI);P(x-.05,x+.05,yB,W-.15,0,CI);});
    // baños (1,8 × 1,65 m aprox.)
    rooms.forEach(x=>{
      P(x+1.15,x+2.95,1.57,1.63,0,CI);P(x+1.12,x+1.18,1.6,2,0,CI);P(x+1.12,x+1.18,2.75,yA-.05,0,CI);P(x+1.12,x+1.18,2,2.75,2.1,CI);
      P(x+1.15,x+2.95,6.27,6.33,0,CI);P(x+1.12,x+1.18,yB+.05,4.9,0,CI);P(x+1.12,x+1.18,5.65,6.3,0,CI);P(x+1.12,x+1.18,4.9,5.65,2.1,CI);
      if(lv===0){
        cyl(.17,.14,.4,M.ceramic,x+2.6,2.0,0,parent);P(x+2.7,x+2.93,1.82,2.18,.38,.8,M.ceramic);P(x+1.25,x+2.1,2.55,3.2,0,.05,M.white);
        cyl(.17,.14,.4,M.ceramic,x+2.6,5.9,0,parent);P(x+2.7,x+2.93,5.72,6.08,.38,.8,M.ceramic);P(x+1.25,x+2.1,4.7,5.35,0,.05,M.white);
        P(x+.5,x+2.5,.2,1.5,0,.3,M.wood);P(x+.52,x+2.48,.22,1.48,.3,.5,M.white);P(x+.5,x+.6,.2,1.5,0,1.1,M.fabric);
        P(x+.5,x+2.5,W-1.5,W-.2,0,.3,M.wood);P(x+.52,x+2.48,W-1.48,W-.22,.3,.5,M.white);P(x+.5,x+.6,W-1.5,W-.2,0,1.1,M.fabric);
      }});
    // losa superior (entrepiso o techo)
    pbox(0,L,0,W,CI,FH,lv?k.mat({color:0x8E9499,roughness:.8}):slabM,up,base);
  }
  level(0,k.root);level(1,up);
  // parapeto
  const pt=FLOOR+2*FH;[[0,L,-.02,.15],[0,L,W-.15,W+.02]].forEach(([a,b,c,d])=>pbox(a,b,c,d,0,.3,facade,up,pt));
  [[-.02,.15],[L-.15,L+.02]].forEach(([a,b])=>pbox(a,b,0,W,0,.3,facade,up,pt));
  // hall, escalera de dos tramos y luces del pasillo
  pbox(18.5,20.3,1.1,1.7,0,1.05,M.wood);
  const rise=FH/20;
  for(let i=0;i<10;i++){pbox(18.15,19.35,4.75+.25*i,5+.25*i,0,(i+1)*rise,M.white);pbox(19.45,20.65,7.25-.25*(i+1),7.25-.25*i,(10+i+1)*rise-.2,(10+i+1)*rise,M.white);}
  pbox(18.15,20.65,7.25,8.7,0,10*rise,M.white);
  for(let x=3;x<L;x+=6){k.disc(x,3.95,CI-.01,.12);}
  [6,15,24,33].forEach(x=>k.light(x,3.95,CI-.3,.6,9));k.light(19.4,1.5,CI-.3,.6,7);
  // colisiones (fachadas, pasillo, tabiques, baños, camas, escalera)
  seg(0,0,18.65,0);seg(20.15,0,L,0);seg(0,W,L,W);seg(L,0,L,3.5);seg(L,4.4,L,W);seg(0,0,0,3.5);seg(0,4.4,0,W);
  [yA,yB].forEach(y=>{let x=0;rooms.forEach(r=>{if(r>=mid[1]&&x<mid[1]){seg(x,y,mid[0],y);x=mid[1];}seg(x,y,r+.15,y);x=r+1.05;});seg(x,y,L,y);});
  parts.forEach(x=>{seg(x,0,x,yA);seg(x,yB,x,W);});
  rooms.forEach(x=>{seg(x+1.15,1.6,x+2.95,1.6);seg(x+1.15,1.6,x+1.15,2);seg(x+1.15,2.75,x+1.15,yA);
    seg(x+1.15,6.3,x+2.95,6.3);seg(x+1.15,yB,x+1.15,4.9);seg(x+1.15,5.65,x+1.15,6.3);
    rectSeg(x+.5,x+2.5,.2,1.5);rectSeg(x+.5,x+2.5,W-1.5,W-.2);rectSeg(x+2.4,x+2.95,1.8,2.25);rectSeg(x+2.4,x+2.95,5.65,6.1);});
  rectSeg(18.1,20.7,4.65,8.8);rectSeg(18.5,20.3,1.1,1.7);
  // cotas
  k.dimX(0,L,W+1.4,'38.800 mm');k.dimY(0,W,-1.4,'8.850 mm');k.dimV(-.9,W+.9,0,6.9,'6.900 mm');
  k.dimX(0,6,-1.6,'6.000 módulo',true);k.dimV(L+.9,-.9,FLOOR,FLOOR+FH,'3.300 por planta',true);
  k.person=[16.6,-2.2];
  k.spots=[
    {id:'acceso',name:'Acceso y hall',at:[19.4,0,2.6],desc:'Acceso principal en el módulo central de 2,8 m, con hall y escalera. Puerta de 1.500 × 2.200 mm según la vista del plano.',walk:{p:[19.4,-3.2],look:[19.4,3]},view:{th:.1,ph:1.2,r:16}},
    {id:'pasillo',name:'Pasillo',at:[10,3.95,2.5],desc:'Pasillo central de 1,30 m con habitaciones a ambos lados y salidas en los dos extremos.',walk:{p:[17.4,3.95],look:[2,3.95]},view:{th:.3,ph:.7,r:14}},
    {id:'habitacion',name:'Habitación tipo',at:[7.5,1,1.6],desc:'Habitación de aprox. 3,0 × 3,3 m con baño propio. La distribución de la habitación es simplificada.',walk:{p:[6.6,2.55],look:[8.3,.5],pitch:-.15},view:{th:.4,ph:.75,r:7}},
    {id:'escalera',name:'Escalera',at:[19.4,6.7,2.4],desc:'Escalera de dos tramos a la planta alta, en el módulo central.',walk:{p:[19.4,4],look:[19.4,8],pitch:.2},view:{th:.8,ph:.8,r:8}}
  ];
  k.walkStart={p:[17.4,3.95],look:[2,3.95]};
  k.variantLabel='Fachada';
  k.variants=[{label:'Grafito',swatch:'#5C6166',apply(){setCol(facade,0x5C6166);}},{label:'Blanca',swatch:'#EEEFEF',apply(){setCol(facade,0xEEEFEF);}}];
  return k;
}

/* ---------- Contenido de cada modelo (sin precios) ---------- */
const INSTALL=['Instalación en destino','Soporte disponible, costos a cargo del comprador'];
const MODELS=[
 {id:'vh30',tab:['VH30','Cápsula de lujo'],mark:['VH','30'],sub:'Cápsula de lujo modular · 8,5 × 3,4 m · dormitorio, baño y balcón',build:buildVH30,
  hero:[['8.500','Largo mm'],['3.400','Ancho mm'],['2.866','Alto mm']],
  spec:[['Modelo','VH30'],['Superficie (fabricante)','≈ 21 m²'],['Huella total con balcón','≈ 28,4 m²'],['Carga por contenedor','3 unidades / 40HQ'],['Producción mensual','10 unidades'],['Montaje','4–5 operarios, 1 semana'],INSTALL],
  includes:['Puertas y ventanas','Sanitarios','Instalación eléctrica','Placard','Muebles','Cortinas','Barra','Vanitory','Botiquín con espejo','Balcón','Piso SPC'],
  detailsTitle:'Materiales (según plano)',
  details:[['Muros','Paneles térmicos de aleación de aluminio · panel sándwich PU 75 mm'],['Vidrios','Templado doble 12+24A+12 (DVH)'],['Acceso','Puerta de seguridad de acero inoxidable'],['Baño','Puerta corrediza de aluminio y vidrio'],['Balcón','Puerta de aluminio y vidrio · deck WPC · baranda de vidrio'],['Luz','Tira LED ambiental perimetral']],
  note:'Las medidas exteriores salen del plano. La distribución interior y los muebles del modelo son aproximados, obtenidos escalando el plano. La ficha comercial indica altura 2.800 mm y el plano 2.866 mm; el modelo usa la del plano.',
  plans:[{src:'{{IMG:plano}}',alt:'Plano VH30: planta y vistas con medidas en milímetros'}],
  planKeys:[['8.500 mm','Largo total, incluido el balcón'],['3.400 mm','Ancho total'],['2.866 mm','Alto total, desde el suelo hasta el techo'],['895 mm','Alto de la baranda de vidrio del balcón']],
  photos:[['{{IMG:exterior}}','Unidad en exhibición, terminación naranja',1],['{{IMG:dormitorio}}','Dormitorio'],['{{IMG:bano}}','Vanitory y baño'],['{{IMG:frente}}','Frente del balcón'],['{{IMG:lateral}}','Ventanal y balcón'],['{{IMG:grafito}}','Terminación grafito, en fábrica',1]]},
 {id:'e20',tab:['E20','Expandible 20 pies'],mark:['E','20'],sub:'Casa expandible · 6,3 × 5,9 m desplegada · living, cocina, dormitorio y baño',build:buildE20,
  hero:[['6.320','Ancho mm'],['5.900','Largo mm'],['2.480','Alto mm']],
  spec:[['Modelo','E20'],['Superficie (fabricante)','≈ 36 m²'],['Carga por contenedor','2 unidades / 40HQ'],['Producción mensual','60–100 unidades'],['Montaje','5–8 personas, media hora'],['Descarga','Requiere autoelevador o grúa'],INSTALL],
  includes:['Puertas y ventanas','Sanitarios','Lavatorio','Botiquín con espejo','Dormitorios (según configuración)','Instalación eléctrica','Muebles de cocina','Piso'],
  detailsTitle:'Cómo funciona',
  details:[['Módulo central','Estructura tipo contenedor de 2.200 mm de ancho, con el baño y la puerta de entrada'],['Alas','Dos alas de 2.060 mm que se despliegan a los costados'],['Transporte','Se pliega al tamaño de un contenedor de 20 pies. Activá «Plegada (transporte)» para verlo']],
  note:'Las medidas exteriores salen del plano. La distribución interior es aproximada: el plano acota 2.250 + 3.320 mm adentro y 5.900 mm afuera, y repartí la diferencia en forma proporcional. El modelo muestra el pliegue de las alas en forma simplificada.',
  plans:[{src:'{{IMG:e20_plano}}',alt:'Plano E20: planta y vistas con medidas en milímetros'},{src:'{{IMG:e20_pliegue}}',alt:'Secuencia de plegado de la casa expandible',cap:'Cómo se pliega para el transporte'}],
  planKeys:[['6.320 mm','Ancho total desplegada'],['2.060 + 2.200 + 2.060','Ala, módulo central y ala'],['5.900 mm','Largo total'],['2.480 mm','Alto total']],
  photos:[['{{IMG:e20_ext}}','Terminación blanca',1],['{{IMG:e20_gris}}','Terminación gris'],['{{IMG:e20_negro}}','Terminación negra'],['{{IMG:e20_madera}}','Terminación símil madera'],['{{IMG:e20_envio}}','Plegada, lista para el envío'],['{{IMG:e20_living}}','Living y cocina',1],['{{IMG:e20_living2}}','Living'],['{{IMG:e20_cocina}}','Cocina'],['{{IMG:e20_dorm}}','Dormitorio'],['{{IMG:e20_bano}}','Baño'],['{{IMG:e20_galeria}}','Caso con galería techada',1]]},
 {id:'k5',tab:['K5','Contenedor desarmable'],mark:['K','5'],sub:'Contenedor desarmable · 6 × 3 m · combinable en planta y en altura',build:buildK5,
  hero:[['6.000','Largo mm'],['3.000','Ancho mm'],['2.800','Alto mm']],
  spec:[['Modelo','K5'],['Superficie (fabricante)','≈ 18 m²'],['Carga por contenedor','5 unidades / 20GP · 17 unidades / 40HQ'],['Producción mensual','1.000 unidades'],['Montaje','3–4 operarios, menos de 1 día por unidad'],INSTALL],
  includes:['1 puerta','2 ventanas','Instalación eléctrica','Piso PVC'],
  detailsTitle:'Detalles de la estructura',
  details:[['Uniones','Viga y columna al ras, sin uniones a la vista'],['Desagüe','El agua de lluvia baja por dentro de las columnas'],['Correas','Tubo cuadrado. Prueba del fabricante: 3 mm de flecha con 300 kg en el centro'],['Combinable','Casos de hasta 3 niveles: 72 módulos en Filipinas. Activá «Combinar 5 módulos» para verlo']],
  note:'El plano muestra un baño con inodoro, ducha y lavatorio, pero la configuración estándar de la ficha no lo menciona. Conviene confirmar con el fabricante si viene incluido. El modelo lo muestra como en el plano.',
  plans:[{src:'{{IMG:k5_plano}}',alt:'Plano K5: planta y vistas con medidas en milímetros'}],
  planKeys:[['6.000 mm','Largo total'],['3.000 mm','Ancho total'],['2.800 mm','Alto total'],['1.150 × 1.100','Ventana'],['840 × 2.035','Puerta']],
  photos:[['{{IMG:k5_ext}}','Módulo K5 terminado',1],['{{IMG:k5_frente}}','Extremo con puerta y ventana'],['{{IMG:k5_int}}','Interior'],['{{IMG:k5_union}}','Unión viga-columna al ras'],['{{IMG:k5_drenaje}}','Desagüe pluvial interno'],['{{IMG:k5_correas}}','Correas de tubo cuadrado y prueba de carga',1],['{{IMG:k5_indonesia}}','Oficina en Indonesia',1],['{{IMG:k5_filipinas}}','Dormitorio para trabajadores en Filipinas',1],['{{IMG:k5_casos}}','Otros proyectos con módulos K5',1]]},
 {id:'acero',tab:['Acero','Estructura C / H'],mark:['Estructura',' de acero'],sub:'Estructuras de acero a medida · naves, depósitos y viviendas',build:buildSteel,
  hero:p=>p?[['15','Ancho m'],['20','Largo m'],['7,25','Alto m']]:[['10','Ancho m'],['15','Largo m'],['6','Alto m']],
  spec:[['Sistema','Perfil C (residencial y modular) o perfil H (industrial, grandes luces)'],['Superficie','A medida'],['Producción mensual','≈ 3.000 toneladas'],['Montaje','6–7 operarios, ≈ 30 m² por día'],['Carga sobre el techo','0,5 kN/m²'],['Resistencia al viento','Grado 11'],['Resistencia al fuego','B1'],['Resistencia sísmica','Grado 8'],['Vida útil','30 años'],INSTALL],
  includes:['Estructura','Chapa de techo y paredes','Panel EPS 50 mm (opcional)','Ventanas y puertas','Canaletas y bajadas'],
  detailsTitle:'Componentes',
  details:[['Chapa','Acero color con recubrimiento de aluminio-zinc-silicio, hasta 30 años'],['Ventana C10','2.500 × 1.200 mm'],['Ventana C15','750 × 3.684 mm'],['Perfil H','Naves de una luz de hasta 100 m, según tipología']],
  note:'El modelo 3D es un ejemplo con los dos tamaños de pórtico que figuran en la ficha (10 × 15 × 6 m y 15 × 20 × 7,25 m). Tomé la altura como cumbrera y supuse pendiente del 10 % y pórticos cada 5 m. El portón y las ventanas son ilustrativos: cada proyecto se dimensiona a medida.',
  plans:[{src:'{{IMG:ac_spec}}',alt:'Ficha del perfil C con tamaños de pórtico y especificaciones'},{src:'{{IMG:ac_aberturas}}',alt:'Aberturas y desagües estándar',cap:'Aberturas C10 y C15, canaletas y bajadas'},{src:'{{IMG:ac_tipos}}',alt:'Tipologías de estructuras con perfil H y luces máximas',cap:'Tipologías con perfil H'}],
  planKeys:[['10 × 15 × 6 m','Pórtico de ejemplo 1 (ancho × largo × alto)'],['15 × 20 × 7,25 m','Pórtico de ejemplo 2'],['5.000 mm','Separación entre pórticos supuesta en el modelo']],
  photos:[['{{IMG:ac_c}}','Estructura de perfil C',1],['{{IMG:ac_h}}','Estructura de perfil H',1],['{{IMG:ac_tejas}}','Sistema de chapa',1],['{{IMG:ac_obra1}}','Obras con perfil H'],['{{IMG:ac_obra2}}','Montaje de pórticos']]},
 {id:'hotel',tab:['Hotel','Acero liviano'],mark:['Hotel',' de acero liviano'],sub:'Proyecto de referencia · 38,8 × 8,85 m · 2 plantas',build:buildHotel,
  hero:[['38.800','Largo mm'],['8.850','Ancho mm'],['6.900','Alto mm']],
  spec:[['Sistema','Estructura de acero liviano'],['Superficie','A medida'],['Ejemplo del modelo','2 plantas · ≈ 687 m² cubiertos'],['Producción mensual','≈ 500 m²'],['Montaje','6–7 operarios, ≈ 200 m² en 50 días'],INSTALL],
  includes:['Sistema de techo','Muros exteriores','Estructura de acero liviano','Entrepiso','Piso','Tabiques interiores'],
  detailsTitle:'Montaje en 6 pasos',
  details:[['1','Fundación'],['2','Estructura de acero liviano'],['3','Muros'],['4','Techo'],['5','Tabiques interiores'],['6','Terminaciones e instalaciones']],
  note:'El modelo usa la planta y las vistas del caso del PDF: 38,8 × 8,85 m, dos plantas de 3,3 m y módulos de 6 m. La distribución de las habitaciones es simplificada. Las imágenes renderizadas del PDF muestran otro proyecto, de 3 plantas.',
  plans:[{src:'{{IMG:h_planta}}',alt:'Plantas baja, alta y de techo del hotel'},{src:'{{IMG:h_vistas}}',alt:'Vistas de fachada del hotel con medidas',cap:'Vistas de fachada'}],
  planKeys:[['38.800 mm','Largo total'],['8.850 mm','Ancho del techo'],['6.900 mm','Alto total'],['6.000 mm','Módulo estructural'],['3.300 mm','Altura por planta']],
  photos:[['{{IMG:h_render1}}','Proyecto de referencia, render',1],['{{IMG:h_render2}}','Render'],['{{IMG:h_render3}}','Render'],['{{IMG:h_estructura}}','Estructura de acero liviano'],['{{IMG:h_composicion}}','Composición del sistema'],['{{IMG:h_pasos}}','Montaje en 6 pasos',1]]}
];

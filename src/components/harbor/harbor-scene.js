import * as THREE from "three";
import { loadHarborBuildings } from './harbor-buildings.js';
import { harborLighting } from './harbor-lighting.js';

export function mountHarbor(canvas, root, journey, onReady) {
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const styles=getComputedStyle(root), colorCanvas=document.createElement('canvas');
colorCanvas.width=colorCanvas.height=1;
const colorContext=colorCanvas.getContext('2d');
const color=name=>{colorContext.clearRect(0,0,1,1);colorContext.fillStyle=styles.getPropertyValue(name).trim();colorContext.fillRect(0,0,1,1);const pixel=colorContext.getImageData(0,0,1,1).data;return new THREE.Color().setRGB(pixel[0]/255,pixel[1]/255,pixel[2]/255,THREE.SRGBColorSpace)};
let R;try{R=new THREE.WebGLRenderer({canvas,antialias:innerWidth>900})}catch(e){onReady(false);return () => {}}
R.setPixelRatio(Math.min(devicePixelRatio,innerWidth<700?1.25:1.75));
R.toneMapping=THREE.ACESFilmicToneMapping;R.outputColorSpace=THREE.SRGBColorSpace;
const FC=color('--harbor-model-13'),S=new THREE.Scene(),cam=new THREE.PerspectiveCamera(55,1,.5,700);
S.background=new THREE.Color(FC);S.fog=new THREE.Fog(FC,110,380);
const ambient=new THREE.HemisphereLight(color('--harbor-model-16'),color('--harbor-model-6'),.95);S.add(ambient);
const sun=new THREE.DirectionalLight(color('--harbor-model-22'),1.5);sun.position.set(-70,80,40);S.add(sun);
const M=(c,r=.7,m=.1)=>new THREE.MeshStandardMaterial({color:c,roughness:r,metalness:m});
const bx=(a,b,c,m,x,y,z,P)=>{const e=new THREE.Mesh(new THREE.BoxGeometry(a,b,c),m);e.position.set(x,y,z);P&&P.add(e);return e};
let sd=7;const rn=()=>(sd=sd*16807%2147483647)/2147483647;
const PAL=[color('--harbor-model-1'),color('--harbor-model-21'),color('--harbor-model-7'),color('--harbor-model-14'),color('--harbor-model-10'),color('--harbor-model-18'),color('--harbor-model-9'),color('--harbor-model-15')];
function ctex(txt){const c=document.createElement('canvas');c.width=256;c.height=128;const x=c.getContext('2d');x.fillStyle=styles.getPropertyValue('--harbor-texture').trim();x.fillRect(0,0,256,128);
for(let i=0;i<256;i+=6){x.fillStyle=styles.getPropertyValue('--harbor-rib-dark').trim();x.fillRect(i,0,2,128);x.fillStyle=styles.getPropertyValue('--harbor-rib-light').trim();x.fillRect(i+3,0,2,128)}
if(txt){x.font='bold 25px Arial';x.textAlign='center';x.fillStyle=styles.getPropertyValue('--harbor-letter-shadow').trim();x.fillText('CV MR EXPRESS',130,70);x.fillStyle=styles.getPropertyValue('--harbor-ink').trim();x.fillText('CV MR EXPRESS',128,67)}
const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t}
const tT=ctex(1),tP=ctex(0);
const cm=col=>{const a=new THREE.MeshStandardMaterial({map:tP,color:col,roughness:.6,metalness:.4}),b=new THREE.MeshStandardMaterial({map:tT,color:col,roughness:.6,metalness:.4});return[a,a,a,a,a,a]};
const CG=new THREE.BoxGeometry(6,2.6,2.4);
// shipping line decals (brand identity colors are content data)
const BR=[['MAERSK','#42b0d5','600 72px Arial','#ffffff'],['MSC','#f2c94c','italic 900 90px Georgia','#1a1a1a'],['CMA CGM','#e2001a','900 72px Arial','#ffffff'],['COSCO SHIPPING','#0b4ea2','800 52px Arial','#ffffff'],['HAPAG-LLOYD','#f47920','900 60px Arial','#002b5c'],['ONE','#e4007f','900 96px Arial','#ffffff'],['EVERGREEN','#007a3d','800 64px Arial','#ffffff'],['HMM','#ff6f00','900 90px Arial','#ffffff'],['YANG MING','#ffd400','800 64px Arial','#1a1a1a'],['ZIM','#ffffff','italic 900 96px Arial','#14286e'],['WAN HAI','#ffffff','800 72px Arial','#003a8c'],['PIL','#ffffff','900 96px Arial','#d71920'],['X-PRESS FEEDERS','#ffffff','800 50px Arial','#d71920'],['SITC','#ffffff','900 90px Arial','#0057a8'],['KMTC','#ffffff','900 90px Arial','#e60012'],['TS LINES','#ffffff','800 72px Arial','#00205b'],['RCL','#ffffff','900 90px Arial','#00559f'],['CULINES','#ffffff','800 72px Arial','#00a0e9'],['SINOKOR','#ffffff','800 72px Arial','#0a3d91'],['EMIRATES SHIPPING LINE','#ffffff','700 40px Arial','#c8102e'],['INTERASIA LINES','#ffffff','800 50px Arial','#e30613'],['ARKAS LINE','#ffffff','800 64px Arial','#00468c'],['GRIMALDI','#ffffff','italic 800 72px Georgia','#003d7a'],['MATSON','#ffffff','800 72px Arial','#00447c'],['NYK LINE','#ffffff','800 72px Arial','#e60012'],['MOL','#ffffff','900 96px Arial','#d0021b'],['K LINE','#d7000f','900 80px Arial','#ffffff'],['OOCL','#ffffff','900 90px Arial','#ec1c24'],['APL','#ffffff','900 96px Arial','#003a70'],['ANL','#ffffff','900 96px Arial','#00a3e0'],['SWIRE SHIPPING','#ffffff','700 54px Georgia','#00553f']];
const BM=[];let bi=0;const nb=()=>(bi=(bi+7)%BR.length);
function bmat(i){if(BM[i])return BM[i];const [n,fg,font,st]=BR[i],c=document.createElement('canvas');c.width=1024;c.height=256;const x=c.getContext('2d');x.font=font.replace(/(\d+)px/,(m,v)=>v*2+'px');x.textAlign='center';x.textBaseline='middle';const w=x.measureText(n).width,k=Math.min(1,940/w);x.translate(512,128);x.scale(k,1);x.lineJoin='round';x.lineWidth=14;x.strokeStyle=st;x.strokeText(n,0,0);x.fillStyle=fg;x.fillText(n,0,0);
const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=4;return BM[i]=new THREE.MeshStandardMaterial({map:t,transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2,roughness:.6,metalness:.2})}
const DG=new THREE.PlaneGeometry(5.6,1.4),DQ=[new THREE.Quaternion(),new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),Math.PI)],DS=new THREE.Vector3(1,1,1);
function decal(mesh){const m=bmat(nb());[1,-1].forEach((s,j)=>{const d=new THREE.Mesh(DG,m);d.position.z=s*1.205;d.quaternion.copy(DQ[j]);mesh.add(d)});return mesh}
function inst(list,P){const im=new THREE.InstancedMesh(CG,cm(color('--harbor-model-24')),list.length),m=new THREE.Matrix4(),c=new THREE.Color();
list.forEach((p,i)=>{m.setPosition(p[0],p[1],p[2]);im.setMatrixAt(i,m);im.setColorAt(i,c.set(PAL[rn()*PAL.length|0]))});im.frustumCulled=false;P.add(im);
const by={};list.forEach(p=>{(by[nb()]??=[]).push(p)});const v=new THREE.Vector3();Object.entries(by).forEach(([b,ps])=>{const dm=new THREE.InstancedMesh(DG,bmat(+b),ps.length*2);ps.forEach((p,i)=>[1,-1].forEach((s,j)=>{v.set(p[0],p[1],p[2]+s*1.205);m.compose(v,DQ[j],DS);dm.setMatrixAt(i*2+j,m)}));dm.frustumCulled=false;P.add(dm)})}
// glow sprite
const gc=document.createElement('canvas');gc.width=gc.height=64;const gx=gc.getContext('2d'),gg=gx.createRadialGradient(32,32,0,32,32,32);gg.addColorStop(0,styles.getPropertyValue('--harbor-lamp').trim());gg.addColorStop(1,styles.getPropertyValue('--harbor-lamp-clear').trim());gx.fillStyle=gg;gx.fillRect(0,0,64,64);
const GM=new THREE.SpriteMaterial({map:new THREE.CanvasTexture(gc),blending:THREE.AdditiveBlending,depthWrite:false,transparent:true,fog:false});
const lampGlows=[];
const glow=(x,y,z,s,P)=>{const e=new THREE.Sprite(GM);e.scale.set(s,s,1);e.position.set(x,y,z);(P||S).add(e);lampGlows.push(e)};
// ground, water
const land=new THREE.Mesh(new THREE.PlaneGeometry(500,160).rotateX(-Math.PI/2),M(color('--harbor-model-12'),.95,0));land.position.set(0,0,-77);S.add(land);
bx(500,3,3,M(color('--harbor-model-11')),0,-.6,4.5,S);
const road=new THREE.Mesh(new THREE.PlaneGeometry(500,24).rotateX(-Math.PI/2),M(color('--harbor-model-8'),.95,0));road.position.set(0,.05,-46);S.add(road);
const wg=new THREE.PlaneGeometry(420,170,56,26).rotateX(-Math.PI/2),wp=wg.attributes.position,wb=new Float32Array(wp.array);
const water=new THREE.Mesh(wg,new THREE.MeshStandardMaterial({color:color('--harbor-model-2'),roughness:.3,metalness:.2,flatShading:true}));water.position.set(0,-1.2,89);S.add(water);
// yard stacks
const CX=[-10,2.2,14.4],yl=[];
for(let x=-48;x<=48;x+=6.6)for(let z=-11;z>=-32;z-=3.1){if(CX.some(c=>Math.abs(x-c)<5.5)||(Math.abs(x+37)<9&&z<-30))continue;const h=1+(rn()*4|0);for(let k=0;k<h;k++)yl.push([x,1.3+k*2.6,z])}
inst(yl,S);
// ship
function ship(){const g=new THREE.Group(),sh=new THREE.Shape();sh.moveTo(-22,-4.5);sh.lineTo(16,-4.5);sh.lineTo(25,0);sh.lineTo(16,4.5);sh.lineTo(-22,4.5);
const h=new THREE.Mesh(new THREE.ExtrudeGeometry(sh,{depth:6,bevelEnabled:false}).rotateX(-Math.PI/2),M(color('--harbor-model-4'),.5,.4));h.position.y=-2;g.add(h);
bx(46,.7,9.1,M(color('--harbor-model-14')),-.5,-1.4,0,g);bx(7,8,8,M(color('--harbor-model-19')),-17,8,0,g);bx(4,3,7.4,M(color('--harbor-model-19')),-17,13.5,0,g);bx(3.5,.9,7.5,M(color('--harbor-model-0'),.2,.8),-15,13.6,0,g);bx(1.6,3,1.6,M(color('--harbor-model-21')),-19,16,0,g);
const l=[];[-10,-3.9,2.2,8.3,14.4].forEach(x=>[-2.5,0,2.5].forEach(z=>[0,1].forEach(k=>l.push([x,5.3+k*2.6,z]))));inst(l,g);glow(-17,16,0,6,g);
const wk=new THREE.Mesh(new THREE.PlaneGeometry(44,8).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({map:wt(),transparent:true,depthWrite:false,opacity:0,fog:false}));wk.position.set(-44,-1.05,0);g.add(wk);g.userData.wk=wk;return g}
function wt(){const c=document.createElement('canvas');c.width=256;c.height=64;const x=c.getContext('2d'),q=x.createLinearGradient(0,0,256,0);q.addColorStop(0,styles.getPropertyValue('--harbor-ink-clear').trim());q.addColorStop(1,styles.getPropertyValue('--harbor-wake').trim());x.fillStyle=q;x.fillRect(0,0,256,64);
x.globalCompositeOperation='destination-in';const m=x.createRadialGradient(200,32,4,140,32,60);m.addColorStop(0,styles.getPropertyValue('--harbor-ink').trim());m.addColorStop(1,styles.getPropertyValue('--harbor-ink-clear').trim());x.fillStyle=m;x.fillRect(0,0,256,64);return new THREE.CanvasTexture(c)}
const sh1=ship();sh1.position.set(0,0,9);S.add(sh1);const sh2=ship();sh2.position.set(-75,0,62);sh2.scale.setScalar(.9);S.add(sh2);
// cranes
const K=M(color('--harbor-model-5'),.6,.5),GL=M(color('--harbor-model-0'),.2,.8),HL=new THREE.MeshBasicMaterial({color:color('--harbor-model-23')}),WG=new THREE.CylinderGeometry(.55,.55,.5,10).rotateX(Math.PI/2),WM=M(color('--harbor-model-3'),.9,0);
const ss=(c,a,b)=>{const t=Math.min(1,Math.max(0,(c-a)/(b-a)));return t*t*(3-2*t)};
function crane(x){const g=new THREE.Group(),w=M(color('--harbor-model-17'),.5,.5),o=M(color('--harbor-model-21'),.5,.3);g.position.x=x;S.add(g);
[-5,5].forEach(a=>[-8,1.5].forEach(z=>bx(.9,22,.9,w,a,11,z,g)));[-8,1.5].forEach(z=>{bx(11,.9,1,w,0,22,z,g);bx(11,.8,.8,w,0,12,z,g)});
bx(1.8,1.6,36,o,0,23,7,g);bx(3,2.5,4,K,0,24.8,-6,g);glow(0,26.5,-6,7,g);
const tr=new THREE.Group();tr.position.y=22;g.add(tr);bx(2.6,1,3,K,0,0,0,tr);const cb=bx(.14,1,.14,K,0,0,0,tr);
const sp=new THREE.Group();g.add(sp);bx(6.2,.35,2.6,K,0,0,0,sp);const cn=new THREE.Mesh(CG,cm(PAL[rn()*8|0]));cn.position.y=-1.5;sp.add(decal(cn));
return c=>{const tz=-6+15*ss(c,.25,.6)-15*ss(c,.85,1),sy=16.5-13.7*ss(c,0,.15)+13.7*ss(c,.15,.25)-4.5*ss(c,.6,.72)+4.5*ss(c,.8,.9),L=22-sy;
tr.position.z=sp.position.z=tz;sp.position.y=sy;cb.scale.y=L;cb.position.y=-L/2;cn.visible=c>.15&&c<.72}}
// trucks
function truck(col,cc){const g=new THREE.Group();bx(8.8,.5,2.2,K,0,.9,0,g);
[-3.4,-2.2,3.4].forEach(x=>[-1.1,1.1].forEach(z=>{const w=new THREE.Mesh(WG,WM);w.position.set(x,.55,z);g.add(w)}));
bx(2.6,2.6,2.5,M(col,.5,.3),4.3,2.3,0,g);bx(.1,1,2.2,GL,5.6,2.8,0,g);[-.8,.8].forEach(z=>bx(.1,.35,.5,HL,5.62,1.6,z,g));
const c=new THREE.Mesh(CG,cm(cc));c.position.set(-1.2,2.45,0);g.add(decal(c));S.add(g);return{g,c}}
const works=[0,.33,.66].map((o,i)=>({u:crane(CX[i]),t:truck(i==1?color('--harbor-model-21'):color('--harbor-model-19'),PAL[i*2]),o}));
const hw=[];[[1,-54,-60,color('--harbor-model-21')],[1,-54,10,color('--harbor-model-19')],[1,-54,70,color('--harbor-model-19')],[-1,-58,-30,color('--harbor-model-21')],[-1,-58,35,color('--harbor-model-19')],[-1,-58,80,color('--harbor-model-10')]].forEach((a,i)=>{const t=truck(a[3],PAL[(i*3)%8]);t.g.rotation.y=a[0]>0?0:Math.PI;t.g.position.set(0,0,a[1]);hw.push({t,d:a[0],x:a[2],s:7+i%3})});
// reach stackers
function rs(A,B,rot,ph){const g=new THREE.Group(),o=M(color('--harbor-model-21'),.5,.3),W=new THREE.CylinderGeometry(1,1,.8,12).rotateX(Math.PI/2);bx(5.5,1.4,3,o,0,1.9,0,g);bx(1.8,1.6,1.9,GL,1.7,3.3,.5,g);
[[-1.8,-1.6],[-1.8,1.6],[1.8,-1.6],[1.8,1.6]].forEach(([x,z])=>{const w=new THREE.Mesh(W,WM);w.position.set(x,1,z);g.add(w)});
const bm=new THREE.Group();bm.position.set(-1,3.4,0);g.add(bm);bx(9,.6,.8,o,4.5,0,0,bm);const c=new THREE.Mesh(CG,cm(PAL[ph*7%8|0]));c.position.set(8,-1.8,0);bm.add(decal(c));g.rotation.y=rot;S.add(g);
return t=>{const u=(t/14+ph)%1,x=A+(B-A)*(ss(u,0,.45)-ss(u,.55,1)),a=.35-.4*(ss(u,.4,.47)-ss(u,.52,.58))-.4*(ss(u,.9,.97)-ss(u,0,.07));g.position.set(x,0,-33.5);bm.rotation.z=a;c.rotation.z=-a;c.visible=u<.5||u>.95}}
const rsu=[rs(-46,-27,0,0),rs(46,27,Math.PI,.4)];
// forklifts
function fl(a,b,ph){const g=new THREE.Group(),y=M(color('--harbor-model-20'),.5,.2);bx(2.2,1.2,1.5,y,0,1,0,g);bx(1.2,1.2,1.4,GL,-.4,2.2,0,g);bx(.2,3,1.2,K,1.3,1.7,0,g);bx(1.1,.15,1.3,K,1.8,.5,0,g);
[[-.7,-.8],[-.7,.8],[.8,-.8],[.8,.8]].forEach(([x,z])=>{const w=new THREE.Mesh(WG,WM);w.scale.setScalar(.6);w.position.set(x,.35,z);g.add(w)});S.add(g);
return t=>{const k=t*.45+ph;g.position.set(a+(b-a)*(.5+.5*Math.sin(k)),0,-6.5);g.rotation.y=Math.cos(k)>0?0:Math.PI}}
const fls=[fl(-30,-16,0),fl(21,34,2)];
// lamps + gatehouse
for(let x=-48;x<=48;x+=16){[1,-35].forEach(z=>{bx(.3,12,.3,K,x,6,z,S);bx(1.6,.4,.8,HL,x,12.2,z,S);glow(x,12.4,z,9)})}
bx(4,3,4,M(color('--harbor-model-19')),-6.5,1.5,-37,S);bx(4.6,.4,4.6,M(color('--harbor-model-21')),-6.5,3.2,-37,S);glow(-6.5,4,-37,6);
// Roadside port sign, fixed to two steel posts; traffic and camera paths stay unchanged.
const portSign=new THREE.Group();portSign.name='pelabuhan-perak-surabaya-sign';portSign.position.set(-28,0,-65);S.add(portSign);
[-29,29].forEach(x=>{bx(.8,22,.8,K,x,11,0,portSign);bx(2.4,.6,2.4,K,x,.3,0,portSign)});
bx(60,9,.7,M(color('--harbor-model-4')),0,19,0,portSign);
bx(60,.35,.9,M(color('--harbor-model-21')),0,14.6,0,portSign);
const portCanvas=document.createElement('canvas');portCanvas.width=2048;portCanvas.height=320;
const portContext=portCanvas.getContext('2d');
portContext.fillStyle=styles.getPropertyValue('--harbor-model-4').trim();portContext.fillRect(0,0,2048,320);
portContext.fillStyle=styles.getPropertyValue('--harbor-ink').trim();portContext.font='900 110px Arial';portContext.textAlign='center';portContext.textBaseline='middle';portContext.fillText('pelabuhan perak surabaya',1024,160,1940);
const portTexture=new THREE.CanvasTexture(portCanvas);portTexture.colorSpace=THREE.SRGBColorSpace;portTexture.anisotropy=4;
const portMaterial=new THREE.MeshBasicMaterial({map:portTexture}),portGeometry=new THREE.PlaneGeometry(59,8.8);
[1,-1].forEach(side=>{const face=new THREE.Mesh(portGeometry,portMaterial);face.position.set(0,19,side*.36);face.rotation.y=side>0?0:Math.PI;portSign.add(face)});
// queued passenger ships: PELNI + Dharma Lautan (brand colors are content data)
function label(txt,fg,font){const c=document.createElement('canvas');c.width=1024;c.height=128;const x=c.getContext('2d');x.font=font;x.textAlign='center';x.textBaseline='middle';x.fillStyle=fg;x.fillText(txt,512,64);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return new THREE.MeshBasicMaterial({map:t,transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2})}
const SHIPTYPES={pelni:{hull:'#f4f6f8',band:'#1f3f8f',stripe:'#f2a900',fun:'#f2a900',name:'KM PELNI',fg:'#1f3f8f',font:'900 92px Arial'},dharma:{hull:'#ffffff',band:'#c8102e',stripe:'#0b4ea2',fun:'#c8102e',name:'DHARMA LAUTAN',fg:'#c8102e',font:'italic 900 84px Arial'}};
const LBL={};
function pship(k){const T0=SHIPTYPES[k],g=new THREE.Group(),w=M(new THREE.Color(T0.hull),.45,.1),bd=M(new THREE.Color(T0.band),.5,.2),st=M(new THREE.Color(T0.stripe),.5,.2),gl=M(color('--harbor-model-0'),.2,.8);
const sh=new THREE.Shape();sh.moveTo(-20,-4);sh.lineTo(14,-4);sh.lineTo(22,0);sh.lineTo(14,4);sh.lineTo(-20,4);
const h=new THREE.Mesh(new THREE.ExtrudeGeometry(sh,{depth:3,bevelEnabled:false}).rotateX(-Math.PI/2),bd);h.position.y=-2;g.add(h);
const u=new THREE.Mesh(new THREE.ExtrudeGeometry(sh,{depth:3,bevelEnabled:false}).rotateX(-Math.PI/2),w);u.position.y=1;g.add(u);
bx(36,.5,8.2,st,-2,1.1,0,g);bx(28,3,7,w,-4,5.5,0,g);bx(22,.35,7.2,gl,-4,5.8,0,g);bx(20,2.6,6.2,w,-5,8.3,0,g);bx(16,.3,6.4,gl,-5,8.4,0,g);bx(6,2,5.6,w,4,10.6,0,g);bx(5.6,.6,5.7,gl,4.6,11,0,g);
bx(3.2,4,3,M(new THREE.Color(T0.fun),.5,.2),-11,11.5,0,g);bx(3.3,.8,3.1,M(color('--harbor-model-3'),.8,0),-11,13.7,0,g);
const L=LBL[k]||=label(T0.name,T0.fg,T0.font),lg=new THREE.PlaneGeometry(22,2.75);[1,-1].forEach(s=>{const d=new THREE.Mesh(lg,L);d.position.set(-2,2.6,s*4.05);d.rotation.y=s>0?0:Math.PI;g.add(d)});
S.add(g);return g}
const QN=innerWidth<700?4:7,queue=[];
for(let i=0;i<QN;i++){const g=pship(i%2?'dharma':'pelni'),row=i%2;g.scale.setScalar(.85+(i%3)*.08);queue.push({g,x:30+Math.floor(i/2)*58+row*26,z:46+row*34,ph:i*1.7})}
// sun + clouds (sky decor, unaffected by fog)
const sunG=new THREE.Group();sunG.position.set(-180,130,-260);S.add(sunG);
sunG.add(new THREE.Mesh(new THREE.SphereGeometry(14,innerWidth<700?16:32,innerWidth<700?8:16),new THREE.MeshBasicMaterial({color:color('--harbor-model-22'),fog:false})));
const halo=new THREE.Sprite(GM);halo.scale.set(90,90,1);sunG.add(halo);
const MOB=innerWidth<700,CN=MOB?7:14;
// A small number of real lights plus shared ground pools keep mobile night rendering lightweight.
const nightLights=new THREE.Group();S.add(nightLights);
const poolMaterial=new THREE.MeshBasicMaterial({map:GM.map,color:color('--harbor-model-23'),transparent:true,opacity:.32,depthWrite:false,blending:THREE.AdditiveBlending});
const poolGeometry=new THREE.PlaneGeometry(18,18).rotateX(-Math.PI/2);
for(let x=-48;x<=48;x+=16){[1,-35].forEach(z=>{const pool=new THREE.Mesh(poolGeometry,poolMaterial);pool.position.set(x,.12,z);nightLights.add(pool)})}
[-32,32].forEach(x=>{const light=new THREE.PointLight(color('--harbor-model-23'),90,35,2);light.position.set(x,8,-35);nightLights.add(light)});
if(!MOB){[-32,32].forEach(x=>{const light=new THREE.PointLight(color('--harbor-model-23'),100,42,2);light.position.set(x,8,-64);nightLights.add(light)})}
function setLighting(){
const profile=harborLighting(root.dataset.timeMode),night=profile.night;
S.background.copy(color(profile.skyToken));S.fog.color.copy(S.background);
ambient.intensity=profile.hemisphereIntensity;sun.intensity=profile.directionalIntensity;
sun.color.copy(color(night?'--harbor-night-moonlight':'--harbor-model-22'));
sunG.visible=profile.sunVisible;nightLights.visible=profile.lampsOn;
lampGlows.forEach(lamp=>{lamp.visible=profile.lampsOn});
HL.color.copy(color(night?'--harbor-model-23':'--harbor-model-17'));
cam.userData.timeMode=night?'night':'day';canvas.dataset.timeMode=cam.userData.timeMode;
}
root.addEventListener('harbor-time-change',setLighting);setLighting();
const CM=new THREE.MeshStandardMaterial({color:color('--harbor-model-16'),roughness:1,metalness:0,flatShading:true,fog:false,emissive:color('--harbor-model-16'),emissiveIntensity:.35}),PG=new THREE.IcosahedronGeometry(1,MOB?0:1),clouds=[],puffs=[];
for(let i=0;i<CN;i++){const k=MOB?i*2:i,n=MOB?3:4+(i%3),sc=1+(k%4)*.3;for(let j=0;j<n;j++){const r=4+((k*7+j*5)%6);puffs.push({c:i,o:new THREE.Vector3((j-n/2)*r*1.4*sc,((j*3)%4)*.8*sc,(((j*5)%3)-1)*sc),s:new THREE.Vector3(r*1.3,r*.8,r).multiplyScalar(sc)})}
clouds.push({x:-260+k*40,y:70+(k*13)%40,z:-220+((k*37)%5)*70,s:1.5+(k%5)*.6})}
const CI=new THREE.InstancedMesh(PG,CM,puffs.length);CI.frustumCulled=false;CI.instanceMatrix.setUsage(THREE.DynamicDrawUsage);S.add(CI);
const cq=new THREE.Quaternion(),cv=new THREE.Vector3(),cmx=new THREE.Matrix4();
function placeClouds(){puffs.forEach((p,i)=>{const c=clouds[p.c];cv.set(mod(c.x+c.s*T+300,600)-300,c.y,c.z).add(p.o);cmx.compose(cv,cq,p.s);CI.setMatrixAt(i,cmx)});CI.instanceMatrix.needsUpdate=true}
// cargo planes crossing the sky (unaffected by fog)
function plane(livery){const g=new THREE.Group(),w=M(new THREE.Color(livery),.5,.2),a=M(color('--harbor-model-21'),.45,.3),gl=M(color('--harbor-model-0'),.2,.8);
const fus=new THREE.Mesh(new THREE.CylinderGeometry(1.5,1.5,26,MOB?8:12).rotateZ(Math.PI/2),w);g.add(fus);
const nose=new THREE.Mesh(new THREE.SphereGeometry(1.5,MOB?8:12,MOB?6:8),w);nose.position.x=13;g.add(nose);
const tail=new THREE.Mesh(new THREE.CylinderGeometry(1.5,.8,5,MOB?8:12).rotateZ(Math.PI/2),w);tail.position.x=-15;g.add(tail);
bx(1.2,.8,2,gl,12.6,.9,0,g);bx(7,.5,26,a,-2,.6,0,g);bx(3,.4,9,a,-14,1.2,0,g);bx(3,4,.5,a,-14,2.6,0,g);bx(20,1.4,2.2,a,-1,-1.2,0,g);
[-6,6].forEach(z=>{const e=new THREE.Mesh(new THREE.CylinderGeometry(.7,.7,3,MOB?6:8).rotateZ(Math.PI/2),a);e.position.set(-1,-.6,z);g.add(e)});
g.traverse(o=>{if(o.material)o.material.fog=false});S.add(g);return g}
const PLANES=[],PLN=MOB?2:3;
// Two lightweight tapered exhaust trails, attached directly behind the engines.
const trailGeometry=new THREE.CylinderGeometry(.025,.18,48,6,1,true).rotateZ(Math.PI/2);
const trailMaterial=new THREE.MeshBasicMaterial({color:color('--harbor-ink'),transparent:true,opacity:.28,depthWrite:false,fog:false});
for(let i=0;i<PLN;i++){const g=plane(i%2?'#f4f6f8':'#dfe5ea'),dir=i%2?1:-1;const trails=new THREE.Group();[-6,6].forEach(z=>{const trail=new THREE.Mesh(trailGeometry,trailMaterial);trail.position.set(-27.5,-.6,z);trails.add(trail)});trails.visible=!RM;g.add(trails);g.scale.setScalar(.9+i*.15);g.rotation.y=dir>0?0:Math.PI;PLANES.push({g,dir,y:95+i*18,z:-180+(i*53%3)*90,x0:i*220,sp:9+i*3})}
// camera path
const V=(x,y,z)=>new THREE.Vector3(x,y,z),KF=[[75,62,80,0,0,-14],[-50,6,-44,-26,2.5,-54],[-14,14,-20,-28,2,-30],[-22,14,30,2,9,6],[40,3.5,-2,-14,6,-20],[30,10,34,14,3,8],[120,85,100,45,0,0]];
const cP=new THREE.CatmullRomCurve3(KF.map(k=>V(k[0],k[1],k[2]))),cT=new THREE.CatmullRomCurve3(KF.map(k=>V(k[3],k[4],k[5])));
let mx=0,my=0,tx=0,ty=0,tot=1,pp=0,T=0,last=performance.now(),tg=V(0,0,0),frameId=0, disposed=false;
loadHarborBuildings(S,()=>disposed,color,styles).then(()=>{if(!disposed)canvas.dataset.buildingsReady='true'}).catch(error=>{if(!disposed)console.error('Harbor buildings could not load',error)});
function rz(){R.setSize(innerWidth,innerHeight,false);cam.aspect=innerWidth/innerHeight;cam.fov=cam.aspect<1?75:55;cam.updateProjectionMatrix();tot=Math.max(1,journey.offsetHeight - innerHeight)}
addEventListener('resize',rz);rz();
const mod=(a,n)=>(a%n+n)%n;
function frame(n){if(disposed)return;frameId=requestAnimationFrame(frame);const dt=Math.min(.05,(n-last)/1000);last=n;if(!RM)T+=dt;
const p=Math.min(1,Math.max(0,(scrollY - root.offsetTop)/tot));pp+=(p-pp)*(RM?1:.09);
root.style.setProperty('--harbor-progress', String(pp));
cam.position.copy(cP.getPoint(pp));tg.copy(cT.getPoint(pp));if(!RM){cam.position.y+=Math.sin(T*.5)*.25;mx+=(tx-mx)*.05;my+=(ty-my)*.05;cam.position.x+=mx*4;cam.position.y+=my*2.5}cam.lookAt(tg);
const dep=ss(pp,.84,1);sh1.position.x=130*dep;sh1.userData.wk.material.opacity=Math.min(1,dep*10);sh1.rotation.y=-.03*dep;sh2.position.y=Math.sin(T*.8)*.1;sh1.position.y=Math.sin(T*.8)*.08;
works.forEach(w=>{const c=(T/16+w.o)%1;w.u(c);const g=w.t.g;let z,r;
if(c<.2){z=-6;r=c<.15?-Math.PI/2:-Math.PI/2+Math.PI*ss(c,.15,.2)}else if(c<.55){z=-6-40*ss(c,.2,.55);r=Math.PI/2}else{z=-46+40*ss(c,.55,1);r=Math.PI/2-Math.PI*ss(c,.5,.55)}
g.position.set(CX[works.indexOf(w)],0,z);g.rotation.y=r;w.t.c.visible=c<.15||c>.5});
hw.forEach(h=>{h.t.g.position.x=mod(h.x+h.d*h.s*T+95,190)-95});
rsu.forEach(f=>f(T));queue.forEach(q=>{const c=Math.sin(T*.12+q.ph);q.g.position.set(q.x-6*c,Math.sin(T*.7+q.ph)*.12,q.z);q.g.rotation.y=Math.PI+Math.sin(T*.4+q.ph)*.012;q.g.rotation.z=Math.sin(T*.6+q.ph)*.01});if(!RM){placeClouds();sunG.children[0].scale.setScalar(1+Math.sin(T*1.3)*.03)}PLANES.forEach(p=>{p.g.position.set(mod(p.x0+p.dir*p.sp*T+320,640)-320,p.y+Math.sin(T*.5+p.x0)*1.2,p.z);p.g.rotation.z=p.dir*Math.sin(T*.4+p.x0)*.04});fls.forEach(f=>f(T));
const a=wp.array;for(let i=0;i<a.length;i+=3){const x=wb[i],z=wb[i+2];a[i+1]=Math.sin(x*.12+T*1.2)*.3+Math.cos(z*.18+T*1.5)*.22}wp.needsUpdate=true;
R.render(S,cam)}
queue.forEach(q=>{q.g.position.set(q.x,0,q.z);q.g.rotation.y=Math.PI});placeClouds();
const pointer=e=>{tx=e.clientX/innerWidth-.5;ty=.5-e.clientY/innerHeight};addEventListener('pointermove',pointer);
frameId=requestAnimationFrame(frame);

onReady(true);
return () => {
 disposed=true;cancelAnimationFrame(frameId);removeEventListener('resize',rz);removeEventListener('pointermove',pointer);root.removeEventListener('harbor-time-change',setLighting);
 const materials=new Set(),textures=new Set();
 S.traverse(object=>{if(object.geometry)object.geometry.dispose();if(object.material)(Array.isArray(object.material)?object.material:[object.material]).forEach(m=>materials.add(m));});
 materials.forEach(material=>{Object.values(material).forEach(value=>{if(value?.isTexture)textures.add(value)});material.dispose()});
 textures.forEach(texture=>texture.dispose());R.dispose();R.forceContextLoss();
};
}

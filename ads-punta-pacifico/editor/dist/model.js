export const clone = value => structuredClone(value);
export const uid = (prefix='item') => `${prefix}-${crypto.randomUUID()}`;
export const clamp = (n,min,max) => Math.max(min, Math.min(max, Number(n)||0));
export const duration = p => Math.max(0,...p.scenes.map(s=>s.start+s.duration));
export const sceneAt = (p,t) => [...p.scenes].reverse().find(s=>t>=s.start-0.0001) || p.scenes[0];
export function distributeWords(text,start,end){
 const words=String(text).trim().split(/\s+/).filter(Boolean); const weight=words.reduce((n,w)=>n+Math.max(2,w.length),0);let t=start;
 return words.map(w=>{let next=t+(end-start)*Math.max(2,w.length)/Math.max(1,weight);const v={text:w,start:t,end:next};t=next;return v});
}
export function setCaptionText(c,text){c.text=text;c.words=distributeWords(text,c.start,c.end);}
export function reflow(p,previousScenes){
 const old=new Map(previousScenes.map(s=>[s.id,s]));let time=0;
 for(const scene of p.scenes){
  const prev=old.get(scene.id);const delta=time-(prev?.start??scene.start);const ratio=prev?scene.duration/prev.duration:1;
  for(const c of p.captions.filter(c=>c.sceneId===scene.id)){
   const anchor=prev?.start??scene.start;c.start=time+(c.start-anchor)*ratio;c.end=time+(c.end-anchor)*ratio;
   for(const w of c.words||[]){w.start=time+(w.start-anchor)*ratio;w.end=time+(w.end-anchor)*ratio;}
  }
  for(const a of p.audioTracks.filter(a=>a.sceneId===scene.id)){a.start+=delta;}
  for(const c of p.comments||[])if(c.sceneId===scene.id&&c.time!=null)c.time=time+(c.time-(prev?.start??scene.start))*ratio;
  scene.start=time;scene.coreEnd=time+scene.duration;time+=scene.duration;
 }
 p.duration=time;p.captions=p.captions.filter(c=>p.scenes.some(s=>s.id===c.sceneId));p.timingChanged=true;
}
export function moveScene(p,id,index){const previous=clone(p.scenes);let at=p.scenes.findIndex(s=>s.id===id);if(at<0)return;p.scenes.splice(index,0,p.scenes.splice(at,1)[0]);reflow(p,previous);}
export function resizeScene(p,id,newDuration){const previous=clone(p.scenes);const s=p.scenes.find(s=>s.id===id);s.duration=clamp(newDuration,.2,120);reflow(p,previous);}
export function removeScene(p,id){if(p.scenes.length<=1)throw Error('El proyecto necesita al menos una escena.');const previous=clone(p.scenes);p.scenes=p.scenes.filter(s=>s.id!==id);p.captions=p.captions.filter(c=>c.sceneId!==id);p.audioTracks=p.audioTracks.filter(a=>a.sceneId!==id);reflow(p,previous);}
export function duplicateScene(p,id){
 const original=p.scenes.find(s=>s.id===id),previous=clone(p.scenes),copy=clone(original);copy.id=uid('scene');copy.title+=' · Copia';copy.layers=(copy.layers||[]).map(l=>({...l,id:uid('layer')}));
 p.scenes.splice(p.scenes.indexOf(original)+1,0,copy);
 const caps=p.captions.filter(c=>c.sceneId===id).map(c=>({...clone(c),id:uid('caption'),sceneId:copy.id}));p.captions.push(...caps);reflow(p,previous);return copy;
}
export function splitScene(p,id,time){
 const s=p.scenes.find(s=>s.id===id);const local=time-s.start;if(local<.2||local>s.duration-.2)throw Error('Coloca el cursor dentro de la escena, lejos de sus extremos.');
 const previous=clone(p.scenes),end=s.start+s.duration,copy=clone(s);copy.id=uid('scene');copy.title+=' · Parte 2';copy.start=time;copy.duration=end-time;copy.media.offset=(copy.media.offset||0)+local*(copy.media.speed||1);copy.layers=(copy.layers||[]).map(l=>({...l,id:uid('layer'),start:Math.max(0,(l.start||0)-local)}));s.duration=local;
 p.scenes.splice(p.scenes.indexOf(s)+1,0,copy);
 const add=[];
 for(const c of p.captions.filter(c=>c.sceneId===id)){
  if(c.start>=time)c.sceneId=copy.id;
  else if(c.end>time){const next={...clone(c),id:uid('caption'),sceneId:copy.id,start:time};next.words=next.words.filter(w=>w.start>=time);next.text=next.words.map(w=>w.text).join(' ');c.end=time;c.words=c.words.filter(w=>w.start<time);c.text=c.words.map(w=>w.text).join(' ');if(next.text)add.push(next);}
 }
 p.captions.push(...add);p.duration=duration(p);return copy;
}
export function addScene(p,afterId,mediaId){
 const previous=clone(p.scenes);const s={id:uid('scene'),title:'Nueva escena',start:0,duration:3,mediaId:mediaId||p.scenes[0]?.mediaId,narration:'',captionY:1200,media:{fit:'cover',scale:1.04,panX:0,panY:0,motion:'push-in',offset:0,opacity:1},transition:{type:'dissolve',duration:.25},layers:[]};
 const i=p.scenes.findIndex(s=>s.id===afterId);p.scenes.splice(i+1,0,s);reflow(p,previous);return s;
}
export function makeLayer(type,p,scene){
 const basic={id:uid('layer'),type:type==='number'?'text':type==='logo'?'image':type,text:type==='number'?'10%':type==='badge'?'NUEVO':type==='chart'?'Potencial de crecimiento':'Tu texto aquí',x:p.width/2,y:440,width:p.width*.8,height:100,fontSize:type==='number'?160:76,fontFamily:'LegacyDisplay',color:p.brand.colors.gold,align:'center',animation:'rise',animationDuration:.45,start:0,duration:scene.duration,opacity:1,enabled:true,rotation:0,order:(scene.layers?.length||0)+1};
 if(type==='logo'){basic.assetId=p.brand.logoAssetId;basic.width=p.width*.6;basic.height=300;}
 if(type==='line'){basic.height=8;basic.width=p.width*.6;basic.animation='wipe';}
 if(type==='chart'){basic.points=[.2,.27,.4,.65,.9];basic.height=330;basic.animation='draw';}
 return basic;
}
export function srt(p){const fmt=t=>{const ms=Math.max(0,Math.round(t*1000));return `${String(Math.floor(ms/3600000)).padStart(2,'0')}:${String(Math.floor(ms/60000)%60).padStart(2,'0')}:${String(Math.floor(ms/1000)%60).padStart(2,'0')},${String(ms%1000).padStart(3,'0')}`};return [...p.captions].sort((a,b)=>a.start-b.start).map((c,i)=>`${i+1}\n${fmt(c.start)} --> ${fmt(c.end)}\n${c.text}\n`).join('\n');}
export function parseSrt(text,p){
 return text.replace(/\r/g,'').trim().split(/\n\s*\n/).filter(Boolean).map(block=>{
  const lines=block.split('\n');const i=lines.findIndex(l=>l.includes('-->'));if(i<0)throw Error('No se reconocen los tiempos del SRT.');
  const parse=v=>{const m=v.trim().match(/(\d+):(\d+):(\d+)[,.](\d+)/);if(!m)throw Error('Tiempo SRT inválido.');return +m[1]*3600+ +m[2]*60+ +m[3]+ +m[4]/1000};
  const [a,b]=lines[i].split('-->');const start=parse(a),end=parse(b);if(end<=start)throw Error('Cada subtítulo necesita un final posterior al inicio.');const c={id:uid('caption'),sceneId:sceneAt(p,start).id,start,end,text:lines.slice(i+1).join(' ').replace(/<[^>]*>/g,''),x:p.width/2,y:1200,...p.subtitleStyle,enabled:true};setCaptionText(c,c.text);return c;
 });
}

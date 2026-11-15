import {validateProject,dataURLToBlob} from './storage.js';
const uid=prefix=>prefix+'-'+crypto.randomUUID();
const MAX_MEDIA=50*1024*1024;
const mediaEntries=p=>[...(p.assets||[]),...(p.references||[]),...(p.aiVoiceDrafts||[])];
async function api(fetcher,path,options={}){const response=await fetcher(path,{credentials:'same-origin',...options,headers:{'Content-Type':'application/json',...options.headers}});let data;try{data=await response.json();}catch{throw Error('No se pudo leer tu biblioteca privada. Inténtalo de nuevo.');}if(!response.ok||data.error)throw Object.assign(new Error(data.error||'No se pudo guardar el proyecto.'),{status:response.status,code:data.code,revision:data.revision});return data;}
export function createCloudLibrary({store,fetcher=(...args)=>fetch(...args)}){
 return {
  async list(){const data=await api(fetcher,'/api/projects');return {...data,projects:data.projects.map(p=>({...p,storage:'cloud'}))};},
  async load(id){const data=await api(fetcher,'/api/projects/'+encodeURIComponent(id));const p=validateProject(data.project);p.cloudRevision=data.revision;return p;},
  async save(project){
   validateProject(project);const snapshot=structuredClone(project),updates=[];
   for(const asset of mediaEntries(snapshot)){
    let blob;if(asset.blobId){blob=await store.getBlob(asset.blobId);if(!blob)throw Error('Falta el archivo «'+(asset.name||asset.id)+'». Vuelve a subirlo antes de guardar.');}else if(asset.embeddedDataUrl)blob=dataURLToBlob(asset.embeddedDataUrl);
    if(!blob&&asset.url?.startsWith('data:'))blob=dataURLToBlob(asset.url);
    if(blob){if(blob.size>MAX_MEDIA)throw Error('El archivo «'+asset.name+'» supera 50 MB. Usa una copia más ligera para guardarlo en el proyecto.');const mediaId=uid('project-media'),type=(asset.mime||blob.type||'application/octet-stream').split(';')[0].replace('audio/x-m4a','audio/mp4');const media=await api(fetcher,'/api/media/'+mediaId,{method:'PUT',body:blob,headers:{'Content-Type':type}});updates.push({id:asset.id,url:media.url});asset.url=media.url;delete asset.blobId;delete asset.embeddedDataUrl;}
    if(asset.url?.startsWith('blob:'))throw Error('Un archivo sólo está disponible en este equipo. Vuelve a subirlo antes de guardar.');if(/^(blob:|data:)/i.test(asset.thumbnail||''))delete asset.thumbnail;
   }
   const revision=project.cloudRevision;delete snapshot.cloudRevision;const result=await api(fetcher,revision?'/api/projects/'+encodeURIComponent(project.id):'/api/projects',{method:revision?'PUT':'POST',body:JSON.stringify({project:snapshot,...(revision?{revision}:{})})});
   for(const update of updates)for(const original of mediaEntries(project))if(original.id===update.id){original.url=update.url;delete original.blobId;delete original.embeddedDataUrl;if(/^(blob:|data:)/i.test(original.thumbnail||''))delete original.thumbnail;}
   project.cloudRevision=result.revision;project.updatedAt=result.project.updatedAt;return {...result,project};
  }
 };
}
export function normalizeSource({provider,type,url,name}){
 type=provider||type;let value;try{value=new URL(String(url).trim());}catch{throw Error('Pega el enlace completo de una carpeta o repositorio.');}
 const hosts=type==='drive'?['drive.google.com','docs.google.com']:type==='github'?['github.com']:[];
 if(value.protocol!=='https:'||value.username||value.password||!hosts.includes(value.hostname)||value.href.length>4096)throw Error(type==='drive'?'Usa un enlace HTTPS de Google Drive.':'Usa un enlace HTTPS de github.com a un repositorio o carpeta.');
 if(type==='github'&&value.pathname.split('/').filter(Boolean).length<2)throw Error('Pega el enlace del repositorio o de su carpeta.');
 if([...value.searchParams.keys()].some(k=>/^(access_token|token|password|secret|api_key)$/i.test(k)))throw Error('Usa un enlace para compartir, sin claves de acceso.');value.hash='';
 return {type,url:value.href,name:String(name|| (type==='drive'?'Materiales de Google Drive':'Materiales de GitHub')).trim().slice(0,250),addedAt:new Date().toISOString()};
}
export function createBlankProject({title='Mi nuevo video',sources=[]}={}){
 const id=uid('project');return {id,title,version:'Borrador',width:1080,height:1920,fps:24,duration:6,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),sources,script:'',voiceScript:'',assets:[],scenes:[{id:uid('scene'),title:'Añade el primer medio',start:0,duration:6,mediaId:null,placeholder:true,narration:'',layers:[],media:{fit:'cover',scale:1,motion:'none',offset:0,speed:1},transition:{type:'cut',duration:0}}],audioTracks:[],captions:[],comments:[],references:[],overlays:[],subtitleStyle:{enabled:true,fontFamily:'Arial',fontSize:68,color:'#FFFFFF',highlightColor:'#C5A564'},brand:{name:'Mi marca',colors:{navy:'#1A2B4C',gold:'#C5A564',cream:'#F5F0E6'}},masterVolume:1,aiAppliedRequestIds:[]};
}
export async function readVideoMetadata(file){
 const url=URL.createObjectURL(file),video=document.createElement('video');video.preload='metadata';video.muted=true;video.playsInline=true;
 try{return await new Promise((resolve,reject)=>{const timeout=setTimeout(()=>finish(new Error('No se pudieron leer los datos del video. Usa un MP4 compatible.')),15000);const finish=(error)=>{clearTimeout(timeout);video.onloadedmetadata=null;video.onerror=null;error?reject(error):resolve({duration:video.duration,width:video.videoWidth,height:video.videoHeight});};video.onloadedmetadata=()=>finish();video.onerror=()=>finish(new Error('Este navegador no puede abrir ese video. Usa MP4 con H.264.'));video.src=url;video.load();});}finally{video.removeAttribute('src');video.load();URL.revokeObjectURL(url);}
}
export async function createVideoProject(file,{store,metadata}={}){
 if(!file||!file.size||file.size>MAX_MEDIA)throw Error('Sube un video de hasta 50 MB.');if(!file.type?.startsWith('video/')&&!/\.(mp4|mov|webm|m4v)$/i.test(file.name||''))throw Error('Selecciona un archivo de video.');
 const info=metadata||await readVideoMetadata(file);if(!Number.isFinite(info.duration)||info.duration<=0||info.duration>21600||!info.width||!info.height)throw Error('El video no tiene una duración o dimensiones válidas.');
 const project=createBlankProject({title:(file.name||'Mi video').replace(/\.[^.]+$/,''),sources:[{type:'upload',name:file.name||'Video subido'}]}),blobId=uid('uploaded-video');await store.putBlob(blobId,file);const videoId=uid('video'),audioId=uid('original-audio'),mime=file.type||(/\.mov$/i.test(file.name)?'video/quicktime':'video/mp4');
 project.width=Math.max(100,Math.min(7680,info.width));project.height=Math.max(100,Math.min(7680,info.height));project.duration=info.duration;project.importedVideo={flattened:true,originalFile:file.name};project.assets=[{id:videoId,type:'video',name:file.name,mime,blobId,url:URL.createObjectURL(file),bytes:file.size,duration:info.duration,width:info.width,height:info.height},{id:audioId,type:'audio',name:'Audio original · '+file.name,mime,blobId,url:URL.createObjectURL(file),bytes:file.size,duration:info.duration}];
 project.scenes=[];for(let start=0,index=0;start<info.duration-.001;start+=4,index++)project.scenes.push({id:uid('scene'),title:'Toma '+String(index+1).padStart(2,'0'),start,duration:Math.min(4,info.duration-start),mediaId:videoId,narration:'',layers:[],media:{fit:'contain',scale:1,motion:'none',offset:start,speed:1},transition:{type:'cut',duration:0}});
 project.audioTracks=[{id:uid('track'),assetId:audioId,name:'Audio original del video',kind:'sfx',start:0,offset:0,duration:info.duration,volume:1,muted:false,fadeIn:0,fadeOut:0}];validateProject(project);await store.save(project);return project;
}

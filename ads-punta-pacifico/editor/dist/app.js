import * as UI from './ui.js';
import {mountAI,projectRevision} from './ai.js';
import {mountMobileWorkbench} from './mobile.js';
import {mountProjects} from './projects.js';
import {createCloudLibrary,createVideoProject,createBlankProject,normalizeSource} from './project-transfer.js';
import {StudioEngine} from './engine.js';
import {exportVideo,availableVideoFormats,downloadBlob,exportFrame} from './exporter.js';
import {ProjectStore,blobToDataURL,validateProject} from './storage.js';
import {analyzeReference,applyReferenceStyle,createEditingBrief} from './reference.js';
import * as M from './model.js';

const $=id=>document.getElementById(id), esc=UI.escapeHTML;
const store=new ProjectStore();
let project,original,engine,selectedSceneId,selectedLayerId,selectedTrackId,selectedCaptionId;
let undo=[],redo=[],saveTimer,mediaFilter='all',commentFilter='all',activeTab='scenes',snap=true,exporting=false;
let aiPanel=null,projectHub=null,cloudSaving=false;
const cloudLibrary=createCloudLibrary({store});
let latestAnalysis=null,latestReferenceId=null,dragScene=null,saveGeneration=0;
const scene=()=>project.scenes.find(s=>s.id===selectedSceneId)||project.scenes[0];
const track=()=>project.audioTracks.find(t=>t.id===selectedTrackId);
const layer=()=>[...(scene()?.layers||[]),...(project.overlays||[])].find(l=>l.id===selectedLayerId);
const caption=()=>project.captions.find(c=>c.id===selectedCaptionId);
const asset=id=>project.assets.find(a=>a.id===id);
const fail=e=>{console.error(e);UI.toast(e?.message||String(e),'error',7000);};
const run=fn=>(...args)=>Promise.resolve().then(()=>fn(...args)).catch(fail);
function on(id,event,fn){$(id)?.addEventListener(event,run(fn));}
function tab(name){activeTab=name;UI.setActiveTab(name);}
function status(text,saved=false){$('saveStatus').innerHTML=`<i></i>${esc(text)}`;$('saveStatus').classList.toggle('unsaved',!saved);}
function scheduleSave(){
 clearTimeout(saveTimer);status('Guardando…');const n=++saveGeneration;
 saveTimer=setTimeout(async()=>{try{const current=project;await store.save(current);if(n===saveGeneration){status('Borrador guardado en este equipo',true);projectHub?.refreshContext();};}catch(e){status('Descarga una copia');fail(e);}},650);
}
function checkpoint(){undo.push(M.clone(project));if(undo.length>40)undo.shift();redo=[];}
function markTiming(){project.voiceStale=true;project.timingChanged=true;}
function mutate(label,fn,{inspector=true,record=true}={}){
 if(exporting)return;engine?.pause();const before=M.clone(project);if(record)checkpoint();try{fn(project);}catch(e){project=before;if(record)undo.pop();engine?.updateProject(project).catch(fail);renderUI();throw e;}project.updatedAt=new Date().toISOString();project.lastChange=label;
 if(!project.scenes.some(s=>s.id===selectedSceneId))selectedSceneId=project.scenes[0].id;
 renderUI(inspector);engine?.updateProject(project).then(()=>engine.render(engine.currentTime)).catch(fail);scheduleSave();
}
function selectScene(id,{seek=true}={}){if(!project.scenes.some(s=>s.id===id))return;selectedSceneId=id;selectedLayerId=null;selectedCaptionId=null;if(seek)engine.seek(scene().start);renderUI();}
function seek(t){engine.seek(M.clamp(t,0,project.duration));const s=M.sceneAt(project,t);if(s.id!==selectedSceneId){selectedSceneId=s.id;selectedLayerId=null;UI.renderScenes(project,{selectedSceneId,query:$('sceneSearch').value});renderInspector();}updateTime(engine.currentTime);}
function renderInspector(){
 const s=scene();const globals=(project.overlays||[]).filter(l=>(l.start||0)<s.start+s.duration&&(l.start||0)+(l.duration||0)>s.start);
 if(![...(s.layers||[]),...globals].some(l=>l.id===selectedLayerId))selectedLayerId=s.layers?.[0]?.id||globals[0]?.id||null;
 UI.renderInspector(project,s,{selectedLayerId});engine&&(engine.selectedLayerId=selectedLayerId);
 const l=layer();if(l){$('layerFont').value=l.fontFamily||l.font||'LegacyDisplay';$('layerVisible').checked=l.enabled!==false&&l.visible!==false;}
 $('sceneFit').value=s.media?.fit||'cover';$('sceneZoom').value=s.media?.scale||1.04;$('sceneZoomValue').textContent=`${Math.round((s.media?.scale||1.04)*100)}%`;
 $('scenePanX').value=s.media?.panX||0;$('scenePanY').value=s.media?.panY||0;
 const motion=s.media?.motion||'none';$('sceneMotion').value=[...$('sceneMotion').options].some(o=>o.value===motion)?motion:({'push-in':'push','pull-out':'pull','drift-right':'drift'}[motion]||'none');
 if($('useVideoAudioBtn'))$('useVideoAudioBtn').hidden=asset(s.mediaId)?.type!=='video';$('videoTrimStart').value=s.media?.offset||0;$('videoSpeed').value=s.media?.speed||1;
 const transition=s.transition?.type||'cut';$('sceneTransition').value=[...$('sceneTransition').options].some(o=>o.value===transition)?transition:transition.startsWith('dip')?'flash':'cut';
}
function renderUI(inspector=true){
 if(!project)return;$('previewCanvas').setAttribute('aria-label','Vista previa editable de '+project.title);UI.updateProjectHeader(project);UI.renderScenes(project,{selectedSceneId,query:$('sceneSearch').value});
 UI.renderMedia(project,{filter:mediaFilter});UI.renderTimeline(project,{selectedSceneId,time:engine?.currentTime||0,zoom:+$('timelineZoom').value});
 if(inspector)renderInspector();UI.renderAudio(project,selectedTrackId);UI.renderCaptions(project,{selectedId:selectedCaptionId});UI.renderComments(project,{filter:commentFilter});UI.renderReferences(project);if($('referenceSelect')){$('referenceSelect').innerHTML=project.references.map(r=>`<option value="${esc(r.id)}" ${r.id===latestReferenceId?'selected':''}>${esc(r.name)}</option>`).join('');}
 if(document.activeElement!==$('fullScript'))$('fullScript').value=project.script||'';
 $('wordCount').textContent=`${(project.script||'').trim().split(/\s+/).filter(Boolean).length} palabras`;
 $('readingEstimate').textContent=`~${Math.ceil((project.script||'').split(/\s+/).length/2.7)} s de lectura`;
 $('voiceStaleNotice').hidden=!project.voiceStale;$('previewStatus').textContent=project.timingChanged?'Revisar sincronía de voz':'Vista previa editable';
 $('scriptSceneList').innerHTML=project.scenes.map((s,i)=>`<button class="script-scene" data-action="select-scene" data-id="${esc(s.id)}"><b>${String(i+1).padStart(2,'0')}</b><span>${esc(s.narration||'Sin narración asignada')}</span></button>`).join('');
 const ss=project.subtitleStyle||{};$('captionsEnabled').checked=ss.enabled!==false;$('captionSize').value=ss.fontSize||68;$('captionColor').value=(ss.color||'#F5F0E6').slice(0,7);$('captionHighlight').value=(ss.highlightColor||'#C5A564').slice(0,7);$('captionFont').value=ss.fontFamily||'LegacyBold';
 const colors=project.brand?.colors||{};for(const[k,id]of [['navy','brandNavy'],['gold','brandGold'],['cream','brandCream']])$(id).value=colors[k]||'#1A2B4C';
 $('brandLogoSelect').innerHTML=project.assets.filter(a=>a.type==='image').map(a=>`<option value="${esc(a.id)}" ${a.id===project.brand.logoAssetId?'selected':''}>${esc(a.name)}</option>`).join('');
 $('masterVolume').value=project.masterVolume??1;$('masterVolumeValue').value=`${Math.round((project.masterVolume??1)*100)}%`;$('versionBadge').textContent=project.version||'Borrador';$('assetStatus').textContent=`${project.scenes.length} escenas · ${project.assets.length} archivos`;
 aiPanel?.refreshContext();projectHub?.refreshContext();$('undoBtn').disabled=!undo.length;$('redoBtn').disabled=!redo.length;updateTime(engine?.currentTime||0);UI.mountIcons();
}
function updateTime(time){UI.updatePlayhead(time,+$('timelineZoom').value);$('commentAnchorLabel').textContent=`${M.sceneAt(project,time)?.title||'Escena'} · ${UI.formatTime(time,true)}`;}
async function loadProject(next,{save=true}={}){
 validateProject(next);clearTimeout(saveTimer);saveTimer=null;saveGeneration++;engine?.dispose();project=next;project.audioTracks||=[];project.captions||=[];project.comments||=[];project.references||=[];project.sources||=[];project.overlays||=[];for(const t of project.audioTracks)if(t.kind==='sfx'&&!t.sceneId)t.sceneId=M.sceneAt(project,t.start).id;project.subtitleStyle||={enabled:true};project.brand||={name:'Mi marca',colors:{navy:'#1A2B4C',gold:'#C5A564',cream:'#F5F0E6'}};
 selectedSceneId=project.scenes[0].id;selectedLayerId=null;selectedTrackId=project.audioTracks[0]?.id;undo=[];redo=[];
 $('stageLoading').hidden=false;engine=new StudioEngine(project,$('previewCanvas'),{onTime:updateTime,onPlayState:playing=>{$('playBtn').innerHTML=UI.icon(playing?'pause':'play');$('playBtn').setAttribute('aria-label',playing?'Pausar':'Reproducir');},onError:fail});
 renderUI();await engine.ready();$('stageLoading').hidden=true;localStorage.setItem('legacy-active-project',project.id);if(save)scheduleSave();else status(project.cloudRevision?'Proyecto privado guardado':'Borrador guardado en este equipo',true);
 $('canvasShell').style.aspectRatio=`${project.width}/${project.height}`;
 if(project.missingAssets?.length)UI.toast('Hay archivos subidos que faltan en este navegador. Importa una copia portable o vuelve a subirlos.','error',10000);
}
async function upload(file,{role,replaceTrack,asReference=false}={}){
 if(file.size>250*1024*1024)throw Error('Para editar con fluidez, sube archivos de hasta 250 MB por archivo.');
 const type=file.type.startsWith('video/')?'video':file.type.startsWith('audio/')?'audio':file.type.startsWith('image/')?'image':null;if(!type)throw Error('Usa una imagen, video o archivo de audio compatible.');
 const id=M.uid(asReference?'reference':'asset');await store.putBlob(id,file);const url=URL.createObjectURL(file);
 const info={id,name:file.name,type,url,blobId:id,bytes:file.size,mime:file.type,uploaded:true};
 if(type==='audio'||type==='video')await new Promise(resolve=>{const el=document.createElement(type);el.preload='metadata';el.onloadedmetadata=()=>{info.duration=Number.isFinite(el.duration)?el.duration:0;info.width=el.videoWidth;info.height=el.videoHeight;el.removeAttribute('src');resolve();};el.onerror=()=>resolve();el.src=url;});
 if(type==='image')await new Promise(resolve=>{const img=new Image();img.onload=()=>{info.width=img.width;info.height=img.height;resolve();};img.onerror=()=>resolve();img.src=url;});
 if(asReference){info.notes=$('referenceNotes').value;info.scope=$('referenceScope').value;info.sceneId=scene().id;info.elements=[...document.querySelectorAll('#referenceElements input:checked')].map(x=>x.value);info.start=+$('referenceStart').value||0;info.end=+$('referenceEnd').value||null;latestReferenceId=id;mutate('Referencia subida',()=>project.references.push(info));return info;}
 mutate('Archivo subido',()=>{
  project.assets.push(info);
  if(type==='audio'){
   if(replaceTrack){const t=project.audioTracks.find(t=>t.id===replaceTrack);t.assetId=id;t.name=file.name;t.offset=0;t.duration=Math.min(info.duration||project.duration,project.duration-t.start);if(t.kind==='voice'){project.voiceScript=project.script;t.originalScript=project.script;project.voiceStale=false;project.timingChanged=false;}}
   else if(role){const t={id:M.uid('track'),assetId:id,name:file.name,kind:role,start:role==='sfx'?engine.currentTime:0,offset:0,duration:Math.min(info.duration||project.duration,project.duration),volume:role==='music'?.25:1,fadeIn:role==='music'?.2:0,fadeOut:.15,muted:false,ducking:role==='music'};project.audioTracks.push(t);selectedTrackId=t.id;}
  }
 });return info;
}
function addAudioAsset(a){const node=UI.openDialog(`<h2>Agregar audio</h2><p>${esc(a.name)}</p><label class="field">Tipo de pista<select id="newAudioKind"><option value="music">Música</option><option value="voice">Locución</option><option value="sfx">Efecto de sonido</option></select></label><button class="button gold full" id="confirmAddAudio">Agregar a la línea de tiempo</button>`);node.querySelector('#confirmAddAudio').onclick=()=>{const kind=node.querySelector('#newAudioKind').value;mutate('Agregar pista de audio',()=>{const t={id:M.uid('track'),assetId:a.id,name:a.name,kind,start:kind==='sfx'?engine.currentTime:0,offset:0,duration:Math.min(a.duration||project.duration,project.duration),volume:kind==='music'?.25:1,fadeIn:0,fadeOut:.1,muted:false};project.audioTracks.push(t);selectedTrackId=t.id;});tab('audio');UI.closeDialog();};}
function selectLayer(id,sceneId){if(sceneId)selectedSceneId=sceneId;selectedLayerId=id;UI.setInspectorTab('layers');renderInspector();engine.selectedLayerId=id;engine.render(engine.currentTime);}
function useAsset(id){const a=asset(id);if(!a)return;if(a.type==='audio'){addAudioAsset(a);return;}if(a.type==='font')return UI.toast('Las tipografías se eligen en Diseño o en cada capa.','info');mutate('Reemplazar imagen o video',()=>{scene().mediaId=id;scene().media.offset=0;});}
async function downloadProject(){
 UI.toast('Preparando el proyecto con sus medios. Puede tardar unos segundos.','info');const out=await store.serialize(project,{embedUploads:true});
 // Include packaged media as well as uploads, so this backup can move to another device.
 for(const a of [...out.project.assets,...out.project.references])if(!a.embeddedDataUrl&&a.url&&!a.url.startsWith('blob:')){
  const r=await fetch(a.url);if(!r.ok)throw Error(`No se pudo incluir ${a.name}.`);let b=await r.blob();if(a.type==='font')b=new Blob([b],{type:'application/octet-stream'});a.embeddedDataUrl=await blobToDataURL(b);
 }
 downloadBlob(new Blob([JSON.stringify(out)],{type:'application/json'}),`${fileName()}-editable.json`);UI.toast('Copia portable descargada con los medios.');
}
const fileName=()=>project.title.replace(/[^\p{L}\p{N}\-_ ]/gu,'').trim().replace(/\s+/g,'_')||'Mi_video';
function textFile(text,name,mime='text/plain'){downloadBlob(new Blob([text],{type:mime}),name);}
function showHelp(){UI.openDialog(`<span class="eyebrow">LEGACY STUDIO</span><h2>Tus proyectos de video</h2><p><b>Inicio</b> muestra tus videos. <b>Guardar</b> conserva el proyecto y sus materiales en tu espacio privado para retomarlo desde otro dispositivo. Los borradores también se guardan en este navegador.</p><p>Desde Inicio puedes subir un video o importar un JSON editable. Un MP4 contiene el montaje terminado: los textos y gráficos ya incrustados no se convierten automáticamente en capas separadas. Doctor V6 ya incluye sus elementos editables.</p><p>Drive y GitHub se vinculan como fuentes. Abre tu carpeta o envía las indicaciones preparadas desde <b>Cambios con IA</b> para que tu ChatGPT importe sus materiales.</p><p>En el celular, <b>Ver anuncio</b> abre la reproducción y <b>Herramientas</b> despliega escenas, inspector, timeline y los demás controles. Puedes escribir o grabar los cambios con <b>Hablar</b>.</p><p>Las versiones locales y la copia portable permiten conservar revisiones. La exportación captura el montaje del editor; revisa voz, tiempos y subtítulos antes de exportar.</p><div class="button-pair"><button class="button" id="originalPreviewBtn">Ver video original</button><button class="button gold" id="helpDoneBtn">Volver al proyecto</button></div>`);on('helpDoneBtn','click',()=>UI.closeDialog());on('originalPreviewBtn','click',showOriginal);}
function showOriginal(){const ref=project.assets.find(a=>a.id==='original-reference')||project.assets.find(a=>a.type==='video');if(!ref)return UI.toast('Este proyecto todavía no tiene un video original.','info');UI.openDialog(`<h2>${esc(project.title)} · Original</h2><video controls playsinline style="max-height:66vh;max-width:100%;display:block;margin:auto" src="${esc(ref.url)}"></video><p>El lienzo del editor muestra la versión que estás modificando.</p>`);}
function showExport(){
 const formats=availableVideoFormats();UI.openDialog(`<span class="eyebrow">TU NUEVA VERSIÓN</span><h2>Exportar video</h2><p>${project.width} × ${project.height} · ${project.fps||24} fps · ${UI.formatTime(project.duration,true)}</p>${project.voiceStale?'<div class="notice"><b>Revisa la voz:</b> el guion o los tiempos cambiaron. La locución no se genera de nuevo automáticamente.</div>':''}<label class="field">Formato<select id="exportFormat">${formats.map(f=>`<option value="${f.extension}">${esc(f.label)}</option>`).join('')}</select></label><label class="field">Intervalo<select id="exportRange"><option value="all">Video completo</option><option value="scene">Solo la escena seleccionada</option></select></label><p>La exportación tarda aproximadamente lo mismo que el video. Mantén esta pestaña visible y espera a que termine.</p><div class="export-progress" id="exportProgress" hidden><progress id="exportProgressBar" max="1" value="0"></progress><strong id="exportPercent">0%</strong></div><div class="button-pair"><button class="button gold" id="startExportBtn" ${formats.length?'':'disabled'}>Exportar y descargar</button><button class="button subtle" id="exportFrameBtn">Descargar fotograma</button></div><button class="button subtle full" id="cancelExportBtn" hidden>Cancelar exportación</button>${formats.length?'':'<p>Este navegador no permite exportar video. Abre el editor en Chrome o Edge actualizado.</p>'}`);
 on('exportFrameBtn','click',()=>exportFrame(engine,`${fileName()}-${engine.currentTime.toFixed(2)}.png`));
 on('startExportBtn','click',async()=>{
  const abort=new AbortController();const only=$('exportRange').value==='scene';exporting=true;$('startExportBtn').disabled=true;$('exportProgress').hidden=false;$('cancelExportBtn').hidden=false;$('cancelExportBtn').onclick=()=>abort.abort();
  const dialog=$('studioDialog');const blockClose=e=>e.preventDefault();dialog.addEventListener('cancel',blockClose);dialog.querySelector('.dialog-close').disabled=true;
  try{const result=await exportVideo(engine,{format:$('exportFormat').value,start:only?scene().start:0,end:only?scene().start+scene().duration:project.duration,signal:abort.signal,onProgress:n=>{$('exportProgressBar').value=n;$('exportPercent').textContent=`${Math.round(n*100)}%`;}});downloadBlob(result.blob,`${fileName()}_editado.${result.extension}`);UI.toast('Video exportado. Tu proyecto editable se conserva.');}
  catch(e){if(e.name==='AbortError')UI.toast(e.message,'info');else fail(e);}
  finally{exporting=false;$('startExportBtn').disabled=false;$('cancelExportBtn').hidden=true;dialog.removeEventListener('cancel',blockClose);dialog.querySelector('.dialog-close').disabled=false;}
 });
}

function wire(){
 const selector=document.createElement('label');selector.className='field';selector.innerHTML='Referencia seleccionada<select id="referenceSelect"></select>';$('analyzeReferenceBtn').before(selector);on('referenceSelect','change',e=>selectReference(e.target.value));
 UI.mountIcons();for(const id of ['layerFont','captionFont','brandFont'])for(const name of ['LegacyDisplay','LegacyBold','LegacyBody'])if(![...$(id).options].some(o=>o.value===name))$(id).add(new Option(name.replace('Legacy','Legacy '),name));
 document.addEventListener('click',run(async e=>{
  const t=e.target.closest('[data-tab]');if(t){tab(t.dataset.tab);return;}const it=e.target.closest('[data-inspector-tab]');if(it){UI.setInspectorTab(it.dataset.inspectorTab);return;}
  const g=e.target.closest('[data-add-graphic]');if(g){const l=M.makeLayer(g.dataset.addGraphic,project,scene());mutate('Agregar motion graphic',()=>{scene().layers.push(l);selectedLayerId=l.id;});UI.setInspectorTab('layers');return;}
  const mf=e.target.closest('[data-filter]');if(mf){mediaFilter=mf.dataset.filter;document.querySelectorAll('#mediaFilter button').forEach(b=>b.classList.toggle('active',b===mf));UI.renderMedia(project,{filter:mediaFilter});return;}const cf=e.target.closest('[data-comment-filter]');if(cf){commentFilter=cf.dataset.commentFilter;document.querySelectorAll('#commentFilter button').forEach(b=>b.classList.toggle('active',b===cf));UI.renderComments(project,{filter:commentFilter});return;}
  const b=e.target.closest('[data-action]');if(!b)return;const id=b.dataset.id;switch(b.dataset.action){
   case 'select-scene':selectScene(id);break;
   case 'use-asset':useAsset(id);break;
   case 'select-layer':selectLayer(id,b.dataset.sceneId);break;
   case 'select-audio':selectedTrackId=id;tab('audio');UI.renderAudio(project,id);seek(project.audioTracks.find(a=>a.id===id)?.start||0);break;
   case 'select-caption':{const c=project.captions.find(c=>c.id===id);selectedCaptionId=id;tab('captions');seek(c.start);$('captionY').value=c.y;UI.renderCaptions(project,{selectedId:id});break;}
   case 'seek':seek(+b.dataset.time);break;
   case 'toggle-audio-mute':mutate('Silenciar pista',()=>{const t=project.audioTracks.find(t=>t.id===id);t.muted=!t.muted;});break;
   case 'delete-caption':mutate('Eliminar subtítulo',()=>project.captions=project.captions.filter(c=>c.id!==id));break;
   case 'resolve-comment':mutate('Estado de comentario',()=>{const c=project.comments.find(c=>c.id===id);c.resolved=!c.resolved;});break;
   case 'delete-comment':mutate('Eliminar comentario',()=>project.comments=project.comments.filter(c=>c.id!==id));break;
   case 'delete-reference':mutate('Quitar referencia',()=>project.references=project.references.filter(r=>r.id!==id));break;
  }
 }));
 on('playBtn','click',()=>engine.isPlaying?engine.pause():engine.play());
 on('prevSceneBtn','click',()=>selectScene(project.scenes[Math.max(0,project.scenes.indexOf(M.sceneAt(project,engine.currentTime))-1)].id));
 on('nextSceneBtn','click',()=>selectScene(project.scenes[Math.min(project.scenes.length-1,project.scenes.indexOf(M.sceneAt(project,engine.currentTime))+1)].id));
 on('seekInput','input',e=>seek(+e.target.value));on('muteBtn','click',()=>{engine.setMuted(!engine.muted);$('muteBtn').innerHTML=UI.icon(engine.muted?'mute':'volume');});
 on('undoBtn','click',async()=>{if(!undo.length)return;redo.push(M.clone(project));project=undo.pop();await engine.updateProject(project);renderUI();scheduleSave();});
 on('redoBtn','click',async()=>{if(!redo.length)return;undo.push(M.clone(project));project=redo.pop();await engine.updateProject(project);renderUI();scheduleSave();});
 on('projectTitle','change',e=>mutate('Nombre del proyecto',()=>project.title=e.target.value.trim()||'Mi video'));
 on('sceneSearch','input',()=>UI.renderScenes(project,{selectedSceneId,query:$('sceneSearch').value}));
 on('sceneViewBtn','click',()=>$('sceneList').classList.toggle('grid-view'));
 on('addSceneBtn','click',()=>{let s;mutate('Agregar escena',()=>{s=M.addScene(project,selectedSceneId);selectedSceneId=s.id;markTiming();});seek(s.start);});
 on('duplicateSceneBtn','click',()=>{let s;mutate('Duplicar escena',()=>{s=M.duplicateScene(project,selectedSceneId);selectedSceneId=s.id;markTiming();});seek(s.start);});
 on('deleteSceneBtn','click',()=>mutate('Eliminar escena',()=>{M.removeScene(project,selectedSceneId);markTiming();}));
 for(const[id,delta]of [['moveSceneUpBtn',-1],['moveSceneDownBtn',1]])on(id,'click',()=>mutate('Reordenar escena',()=>{M.moveScene(project,selectedSceneId,M.clamp(project.scenes.findIndex(s=>s.id===selectedSceneId)+delta,0,project.scenes.length-1));markTiming();}));
 on('splitSceneBtn','click',()=>mutate('Dividir escena',()=>{selectedSceneId=M.splitScene(project,selectedSceneId,engine.currentTime).id;}));
 on('sceneTitle','change',e=>mutate('Nombre de escena',()=>scene().title=e.target.value));
 on('sceneNarration','change',e=>mutate('Narración de escena',()=>{scene().narration=e.target.value;project.script=project.scenes.map(s=>s.narration).filter(Boolean).join(' ');project.voiceStale=true;}));
 on('sceneDuration','change',e=>mutate('Duración de escena',()=>{M.resizeScene(project,selectedSceneId,+e.target.value);markTiming();}));
 on('sceneMediaSelect','change',e=>useAsset(e.target.value));on('replaceMediaBtn','click',()=>$('replaceMediaUpload').click());
 on('replaceMediaUpload','change',async e=>{if(e.target.files[0]){const a=await upload(e.target.files[0]);useAsset(a.id);}e.target.value='';});
 const mediaFields={sceneFit:['fit',String],sceneZoom:['scale',Number],scenePanX:['panX',Number],scenePanY:['panY',Number],videoTrimStart:['offset',Number],videoSpeed:['speed',Number]};
 for(const[id,[key,cast]]of Object.entries(mediaFields))on(id,'change',e=>mutate('Encuadre de escena',()=>scene().media[key]=cast(e.target.value)));
 on('sceneZoom','input',e=>{$('sceneZoomValue').textContent=`${Math.round(e.target.value*100)}%`;const old=scene().media.scale;scene().media.scale=+e.target.value;engine.render(engine.currentTime);scene().media.scale=old;});
 on('sceneMotion','change',e=>mutate('Movimiento de cámara',()=>scene().media.motion=({push:'push-in',pull:'pull-out',drift:'drift-right'}[e.target.value]||e.target.value)));
 on('sceneTransition','change',e=>mutate('Transición',()=>scene().transition={type:e.target.value,duration:e.target.value==='cut'?0:+$('transitionDuration').value||.25}));
 on('transitionDuration','change',e=>mutate('Duración de transición',()=>scene().transition.duration=M.clamp(e.target.value,0,1.5)));
 on('resetFramingBtn','click',()=>mutate('Restablecer encuadre',()=>scene().media={fit:'cover',scale:1,panX:0,panY:0,motion:'none',offset:0,speed:1}));
 on('scenePreviewBtn','click',async()=>{seek(scene().start);await engine.play();const end=scene().start+scene().duration;const stop=setInterval(()=>{if(engine.currentTime>=end||!engine.isPlaying){engine.pause();clearInterval(stop);}},50);});
 on('applyScriptBtn','click',()=>{mutate('Guion completo',()=>{project.script=$('fullScript').value;project.voiceStale=project.script!==project.voiceScript;});UI.toast('Guion guardado. Revisa la voz y el texto asignado a cada escena.','info');});
 on('downloadScriptBtn','click',()=>textFile(project.script,`${fileName()}-guion.txt`));
 for(const id of ['mediaUpload','audioUpload'])on(id,'change',async e=>{let last;for(const f of e.target.files)last=await upload(f);e.target.value='';UI.toast('Archivos agregados a la biblioteca.');if(id==='audioUpload'&&last)addAudioAsset(last);});
 on('addAudioBtn','click',()=>$('audioUpload').click());
 on('audioTrackSelect','change',e=>{selectedTrackId=e.target.value;UI.renderAudio(project,selectedTrackId);});
 for(const[id,key]of Object.entries({audioStart:'start',audioOffset:'offset',audioDuration:'duration',audioVolume:'volume',audioFadeIn:'fadeIn',audioFadeOut:'fadeOut'}))on(id,'change',e=>{if(track())mutate('Ajustar pista',()=>track()[key]=Math.max(0,+e.target.value||0));});
 document.addEventListener('change',run(e=>{if(e.target.dataset.audioVolume){mutate('Volumen de pista',()=>project.audioTracks.find(t=>t.id===e.target.dataset.audioVolume).volume=+e.target.value);}}));
 on('masterVolume','input',e=>{engine.setVolume(+e.target.value);$('masterVolumeValue').value=`${Math.round(e.target.value*100)}%`;});
 on('masterVolume','change',e=>mutate('Volumen maestro',()=>project.masterVolume=+e.target.value));
 on('replaceAudioBtn','click',()=>{if(track())$('replaceAudioUpload').click();});on('replaceAudioUpload','change',async e=>{if(e.target.files[0])await upload(e.target.files[0],{replaceTrack:selectedTrackId});e.target.value='';});
 on('deleteAudioBtn','click',()=>mutate('Eliminar pista',()=>{project.audioTracks=project.audioTracks.filter(t=>t.id!==selectedTrackId);selectedTrackId=project.audioTracks[0]?.id;}));
 on('addTextBtn','click',()=>{const l=M.makeLayer('text',project,scene());mutate('Agregar texto',()=>{scene().layers.push(l);selectedLayerId=l.id;});UI.setInspectorTab('layers');});
 const layerFields={layerText:['text',String],layerFont:['fontFamily',String],layerSize:['fontSize',Number],layerColor:['color',String],layerX:['x',Number],layerY:['y',Number],layerWidth:['width',Number],layerOpacity:['opacity',Number],layerRotation:['rotation',Number],layerAlign:['align',String],layerAnimation:['animation',String],layerStart:['start',Number],layerDuration:['duration',Number],layerAnimDuration:['animationDuration',Number],layerOrder:['order',Number]};
 for(const[id,[key,cast]]of Object.entries(layerFields))on(id,'change',e=>{if(layer())mutate('Editar elemento',()=>layer()[key]=cast(e.target.value));});
 on('layerVisible','change',e=>{if(layer())mutate('Visibilidad del elemento',()=>{layer().enabled=e.target.checked;layer().visible=e.target.checked;});});
 on('duplicateLayerBtn','click',()=>{if(!layer())return;const l={...M.clone(layer()),id:M.uid('layer'),x:(layer().x||0)+30,y:(layer().y||0)+30};mutate('Duplicar elemento',()=>{scene().layers.push(l);selectedLayerId=l.id;});});
 on('deleteLayerBtn','click',()=>mutate('Eliminar elemento',()=>{scene().layers=scene().layers.filter(l=>l.id!==selectedLayerId);project.overlays=project.overlays.filter(l=>l.id!==selectedLayerId);selectedLayerId=null;}));
 on('captionsEnabled','change',e=>mutate('Subtítulos visibles',()=>project.subtitleStyle.enabled=e.target.checked));
 on('applyCaptionStyleBtn','click',()=>mutate('Estilo de subtítulos',()=>{
  const preset=$('captionPreset').value;const style={fontSize:+$('captionSize').value,fontFamily:$('captionFont').value,color:$('captionColor').value,highlightColor:$('captionHighlight').value,animation:preset==='karaoke'?'word':'none',background:preset==='clean'?'transparent':'#1A2B4CCC',uppercase:preset==='uppercase'};Object.assign(project.subtitleStyle,style);for(const c of project.captions)Object.assign(c,style);if(caption())caption().y=+$('captionY').value;
 }));
 on('captionY','change',e=>mutate('Posición de subtítulos',()=>{const c=caption();if(c)c.y=+e.target.value;else{const s=scene();for(const c of project.captions.filter(c=>c.sceneId===s.id))c.y=+e.target.value;}}));
 document.addEventListener('focusin',e=>{if(e.target.dataset.captionField){selectedCaptionId=e.target.dataset.id;const c=caption();if(c)$('captionY').value=c.y;}});
 document.addEventListener('change',run(e=>{const key=e.target.dataset.captionField;if(!key)return;const c=project.captions.find(c=>c.id===e.target.dataset.id);if(!c)return;mutate('Editar subtítulo',()=>{if(key==='text')M.setCaptionText(c,e.target.value);else{c[key]=+e.target.value;if(c.end<=c.start)c.end=c.start+.1;M.setCaptionText(c,c.text);}});}));
 on('addCaptionBtn','click',()=>mutate('Agregar subtítulo',()=>{const t=engine.currentTime;const c={id:M.uid('caption'),sceneId:scene().id,start:t,end:Math.min(project.duration,t+1.5),text:'Tu subtítulo',x:project.width/2,y:scene().captionY||1200,...project.subtitleStyle,enabled:true};M.setCaptionText(c,c.text);project.captions.push(c);selectedCaptionId=c.id;}));
 on('downloadSrtBtn','click',()=>textFile(M.srt(project),`${fileName()}.srt`));on('srtUpload','change',async e=>{if(e.target.files[0]){const caps=M.parseSrt(await e.target.files[0].text(),project);mutate('Importar SRT',()=>project.captions=caps);}e.target.value='';});
 for(const[id,key]of [['brandNavy','navy'],['brandGold','gold'],['brandCream','cream']])on(id,'change',e=>mutate('Paleta de marca',()=>{const old=project.brand.colors[key],next=e.target.value;project.brand.colors[key]=next;for(const l of [...project.overlays,...project.scenes.flatMap(s=>s.layers)])if(l.color?.toLowerCase()===old?.toLowerCase())l.color=next;for(const c of project.captions){if(c.color===old)c.color=next;if(c.highlightColor===old)c.highlightColor=next;}}));
 on('brandFont','change',e=>mutate('Tipografía de títulos',()=>{for(const l of [...project.overlays,...project.scenes.flatMap(s=>s.layers)])if(['text','badge','number'].includes(l.type))l.fontFamily=e.target.value;}));
 on('brandLogoSelect','change',e=>mutate('Logo de marca',()=>{const prev=project.brand.logoAssetId;project.brand.logoAssetId=e.target.value;for(const l of [...project.overlays,...project.scenes.flatMap(s=>s.layers)])if(l.assetId===prev)l.assetId=e.target.value;}));
 on('logoUpload','change',async e=>{if(e.target.files[0]){const a=await upload(e.target.files[0]);$('brandLogoSelect').value=a.id;$('brandLogoSelect').dispatchEvent(new Event('change'));}e.target.value='';});
 on('formatSelect','change',e=>mutate('Formato del video',()=>{const [w,h]=e.target.value.split('x').map(Number),sx=w/project.width,sy=h/project.height;for(const l of [...project.overlays,...project.scenes.flatMap(s=>s.layers)]){l.x*=sx;l.y*=sy;l.width*=sx;l.fontSize&&(l.fontSize*=Math.min(sx,sy));}for(const c of project.captions){c.x*=sx;c.y*=sy;}project.width=w;project.height=h;$('canvasShell').style.aspectRatio=`${w}/${h}`;}));
 on('showSafeArea','change',e=>$('safeArea').hidden=!e.target.checked);on('guidesBtn','click',()=>{$('showSafeArea').checked=!$('showSafeArea').checked;$('safeArea').hidden=!$('showSafeArea').checked;});
 on('fullscreenBtn','click',()=>document.fullscreenElement?document.exitFullscreen():$('previewStage').requestFullscreen());on('previewScale','change',e=>{$('canvasShell').style.maxHeight=e.target.value==='fit'?'100%':e.target.value==='100'?'1920px':'960px';});
 on('commentSceneBtn','click',()=>{tab('comments');$('commentText').focus();});
 on('addCommentBtn','click',()=>{const text=$('commentText').value.trim();if(!text)return;mutate('Agregar comentario',()=>project.comments.push({id:M.uid('comment'),sceneId:$('commentUseTime').checked?M.sceneAt(project,engine.currentTime).id:scene().id,time:$('commentUseTime').checked?engine.currentTime:scene().start,text,resolved:false,createdAt:new Date().toISOString()}));$('commentText').value='';});
 on('downloadCommentsBtn','click',()=>textFile(createEditingBrief(project),`${fileName()}-comentarios.md`,'text/markdown'));
 on('referenceUpload','change',async e=>{for(const f of e.target.files)await upload(f,{asReference:true});e.target.value='';});
 on('analyzeReferenceBtn','click',analyzeSelectedReference);on('prepareBriefBtn','click',()=>{commitReferenceNotes();textFile(createEditingBrief(project),`${fileName()}-instrucciones-IA.md`,'text/markdown');});
 on('referenceNotes','change',commitReferenceNotes);on('referenceScope','change',commitReferenceNotes);on('referenceElements','change',commitReferenceNotes);on('referenceStart','change',commitReferenceNotes);on('referenceEnd','change',commitReferenceNotes);
 on('timelineZoom','input',()=>UI.renderTimeline(project,{selectedSceneId,time:engine.currentTime,zoom:+$('timelineZoom').value}));
 on('fitTimelineBtn','click',()=>{$('timelineZoom').value=Math.max(7,Math.min(80,($('timelineScroll').clientWidth-20)/project.duration));UI.renderTimeline(project,{selectedSceneId,time:engine.currentTime,zoom:+$('timelineZoom').value});});
 on('snapBtn','click',()=>{snap=!snap;$('snapBtn').setAttribute('aria-pressed',String(snap));});
 for(const name of ['timelineRuler','playhead'])on(name,'pointerdown',e=>{e.preventDefault();const move=event=>{const rect=$('timelineInner').getBoundingClientRect();let t=(event.clientX-rect.left)/+$('timelineZoom').value;if(snap){const near=project.scenes.find(s=>Math.abs(s.start-t)<.1);if(near)t=near.start;}seek(t);};move(e);window.addEventListener('pointermove',move);window.addEventListener('pointerup',()=>window.removeEventListener('pointermove',move),{once:true});});
 on('sceneList','dragstart',e=>{const card=e.target.closest('[data-scene-id]');if(card){dragScene=card.dataset.sceneId;e.dataTransfer.setData('text/plain',dragScene);}});
 on('sceneList','dragover',e=>e.preventDefault());on('sceneList','drop',e=>{e.preventDefault();const target=e.target.closest('[data-scene-id]');if(target&&dragScene&&target.dataset.sceneId!==dragScene)mutate('Reordenar escena',()=>{M.moveScene(project,dragScene,project.scenes.findIndex(s=>s.id===target.dataset.sceneId));markTiming();});dragScene=null;});
 on('mediaGrid','dragover',e=>e.preventDefault());on('mediaGrid','drop',async e=>{e.preventDefault();for(const file of e.dataTransfer.files)await upload(file);});
 const videoAudio=document.createElement('button');videoAudio.className='button full subtle';videoAudio.id='useVideoAudioBtn';videoAudio.textContent='Usar audio original del video';$('videoTrimFields').after(videoAudio);videoAudio.onclick=run(()=>{const source=asset(scene().mediaId);if(source?.type!=='video')throw Error('Selecciona una escena con video para usar su audio original.');mutate('Audio original del video',()=>{const a={...source,id:M.uid('video-audio'),type:'audio',name:`Audio · ${source.name}`};project.assets.push(a);const t={id:M.uid('track'),name:a.name,kind:'sfx',assetId:a.id,sceneId:scene().id,start:scene().start,offset:scene().media.offset||0,duration:scene().duration,volume:1,muted:false};project.audioTracks.push(t);selectedTrackId=t.id;});tab('audio');});
 wireCanvasDragging();
 on('projectMenuBtn','click',()=>$('projectMenu').hidden=!$('projectMenu').hidden);document.addEventListener('click',e=>{if(!e.target.closest('#projectMenu,#projectMenuBtn'))$('projectMenu').hidden=true;});
 on('downloadProjectBtn','click',downloadProject);on('importProjectBtn','click',()=>$('projectImport').click());
 on('projectImport','change',async e=>{if(e.target.files[0]){const incoming=await store.importProject(await e.target.files[0].text());await loadProject(incoming);UI.toast('Proyecto abierto con sus archivos.');}e.target.value='';});
 on('duplicateProjectBtn','click',async()=>{await flushLocalProject();const copy=independentCopy(project,' · Copia');await loadProject(copy);await saveCurrentProject();UI.toast('Copia independiente guardada.');});
 on('saveVersionBtn','click',saveCurrentProject);
 on('versionHistoryBtn','click',showVersions);
 on('resetProjectBtn','click',async()=>{await store.saveVersion(project,'Antes de volver al original');const fresh=M.clone(original);fresh.id=M.uid('project');fresh.title='Doctor V6 · Nueva edición';await loadProject(fresh);UI.toast('Nueva copia del V6 original. La anterior permanece guardada.');});
 on('helpBtn','click',showHelp);on('helpStatusBtn','click',showHelp);on('shortcutsBtn','click',()=>UI.openDialog('<h2>Atajos de teclado</h2><p><kbd>Espacio</kbd> Reproducir o pausar</p><p><kbd>← / →</kbd> Retroceder o avanzar un fotograma</p><p><kbd>Ctrl / ⌘ + Z</kbd> Deshacer</p><p><kbd>Ctrl / ⌘ + Shift + Z</kbd> Rehacer</p><p><kbd>Ctrl / ⌘ + S</kbd> Guardar versión</p>'));
 on('exportBtn','click',showExport);
 document.addEventListener('keydown',run(e=>{if(document.body.classList.contains('projects-home'))return;if(e.target.matches('input,textarea,select,[contenteditable]'))return;if(e.code==='Space'){e.preventDefault();return engine.isPlaying?engine.pause():engine.play();}if(['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();seek(engine.currentTime+(e.key==='ArrowLeft'?-1:1)/(project.fps||24));}if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z'){e.preventDefault();$(e.shiftKey?'redoBtn':'undoBtn').click();}if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='s'){e.preventDefault();$('saveVersionBtn').click();}}));
 window.addEventListener('beforeunload',e=>{if(exporting||saveTimer&&$('saveStatus').textContent.includes('Guardando')){e.preventDefault();e.returnValue='';}});
 // Every supported field remains available for less common graphic properties.
 const advanced=document.createElement('button');advanced.className='button full subtle';advanced.id='advancedLayerBtn';advanced.textContent='Propiedades avanzadas del elemento';$('inspectorLayersPanel').append(advanced);
 advanced.onclick=()=>{if(!layer())return;const l=layer();UI.openDialog(`<h2>Propiedades del elemento</h2><p>Incluye puntos de gráfica, alto, animación y otros valores de esta capa.</p><textarea class="json-editor" id="layerJson" rows="18">${esc(JSON.stringify(l,null,2))}</textarea><button class="button gold full" id="applyLayerJson">Aplicar elemento</button>`);on('applyLayerJson','click',()=>{const value=JSON.parse($('layerJson').value);if(!value||typeof value!=='object'||Array.isArray(value))throw Error('El elemento debe ser un objeto JSON.');value.id=l.id;mutate('Propiedades avanzadas',()=>Object.assign(layer(),value));UI.closeDialog();});};
}
function wireCanvasDragging(){
 on('previewCanvas','pointerdown',e=>{
  if(exporting)return;engine.pause();const canvas=$('previewCanvas'),rect=canvas.getBoundingClientRect(),point=ev=>({x:(ev.clientX-rect.left)*project.width/rect.width,y:(ev.clientY-rect.top)*project.height/rect.height});const start=point(e),hit=engine.hitTest(start.x,start.y);if(!hit)return;
  let target;if(hit.captionId){selectedCaptionId=hit.captionId;target=caption();tab('captions');}else if(hit.layerId){selectLayer(hit.layerId,hit.sceneId);target=layer();}else if(hit.id){selectLayer(hit.id,hit.sceneId);target=layer();}if(!target)return;
  checkpoint();const origin={x:target.x||0,y:target.y||0};canvas.setPointerCapture(e.pointerId);
  const move=ev=>{const p=point(ev);target.x=Math.round(origin.x+p.x-start.x);target.y=Math.round(origin.y+p.y-start.y);engine.render(engine.currentTime);};
  const end=()=>{canvas.removeEventListener('pointermove',move);canvas.removeEventListener('pointerup',end);renderUI();scheduleSave();};canvas.addEventListener('pointermove',move);canvas.addEventListener('pointerup',end,{once:true});
 });
}
function selectReference(id){const ref=project.references.find(r=>r.id===id);if(!ref)return;latestReferenceId=id;$('referenceNotes').value=ref.notes||'';$('referenceScope').value=ref.scope||'project';$('referenceStart').value=ref.start||0;$('referenceEnd').value=ref.end||'';document.querySelectorAll('#referenceElements input').forEach(c=>c.checked=(ref.elements||[]).includes(c.value));$('referenceAnalysis').innerHTML=ref.analysis?'<p class="notice">Esta referencia tiene un análisis guardado. Pulsa analizar para ver y aplicar sus propuestas.</p>':'';}
function commitReferenceNotes(){const ref=project.references.find(r=>r.id===latestReferenceId)||project.references.at(-1);if(!ref)return;mutate('Dirección de referencia',()=>{ref.notes=$('referenceNotes').value;ref.scope=$('referenceScope').value;ref.sceneId=scene().id;ref.start=+$('referenceStart').value||0;ref.end=+$('referenceEnd').value||null;ref.elements=[...document.querySelectorAll('#referenceElements input:checked')].map(x=>x.value);});}
async function analyzeSelectedReference(){
 commitReferenceNotes();const ref=project.references.find(r=>r.id===latestReferenceId)||project.references.at(-1);if(!ref)throw Error('Primero sube un video o imagen de referencia.');
 const file=ref.blobId?await store.getBlob(ref.blobId):await(await fetch(ref.url)).blob();$('analyzeReferenceBtn').disabled=true;$('referenceAnalysis').innerHTML='<p class="notice">Analizando fotogramas de la referencia…</p>';
 try{const analysis=await analyzeReference(file,{start:ref.start||0,end:ref.end||undefined,onProgress:p=>{$('referenceAnalysis').textContent=`Analizando… ${Math.round(p*100)}%`;}});latestAnalysis=analysis;latestReferenceId=ref.id;mutate('Análisis de referencia',()=>ref.analysis=analysis);
  $('referenceAnalysis').innerHTML=`<div class="analysis-result"><h3>Mediciones de la referencia</h3><p>${esc(analysis.duration?`${analysis.duration.toFixed(1)} s`:'Imagen')} · ${analysis.cutTimes?.length||0} cortes detectados</p><p>${esc(analysis.estimatedShotSeconds?`Toma estimada: ${analysis.estimatedShotSeconds.toFixed(1)} s`:'Sin duración de toma fiable')}</p><div class="analysis-palette">${(analysis.palette||[]).map(c=>`<span style="background:${esc(typeof c==='string'?c:c.hex)}"></span>`).join('')}</div><p>Los cortes y colores son aproximados. Los textos, efectos de sonido y detalles señalados quedan documentados para la edición con IA.</p><button class="button gold full" id="applyReferenceBtn">Aplicar propuesta de estilo</button><button class="button subtle full" id="referenceBriefBtn">Descargar brief para IA</button></div>`;
  on('applyReferenceBtn','click',()=>{
   commitReferenceNotes();const chosenRef=project.references.find(r=>r.id===ref.id)||ref;const scope=chosenRef.scope==='scene'?[chosenRef.sceneId]:chosenRef.scope==='opening'?project.scenes.filter(s=>s.start<4).map(s=>s.id):'all';const choices=Object.fromEntries((chosenRef.elements||[]).map(k=>[k,true]));choices.motion=choices.composition||false;
   const result=applyReferenceStyle(project,analysis,choices,scope);checkpoint();project=result.project;engine.updateProject(project).catch(fail);renderUI();scheduleSave();UI.toast(Array.isArray(result.summary)?result.summary.join(' '):result.summary,'info',8000);
  });on('referenceBriefBtn','click',()=>textFile(createEditingBrief(project),`${fileName()}-brief-IA.md`,'text/markdown'));
 }finally{$('analyzeReferenceBtn').disabled=false;}
}
async function showVersions(){
 const versions=await store.listVersions(project.id),projects=await store.listProjects();UI.openDialog(`<h2>Versiones y proyectos guardados</h2><p>Disponibles en este navegador. Descarga una copia portable para conservarlos fuera de este dispositivo.</p><h3>Versiones de este proyecto</h3>${versions.map(v=>`<button class="history-card" data-restore-version="${esc(v.id)}"><strong>${esc(v.label)}</strong><small>${esc(new Date(v.createdAt).toLocaleString('es-MX'))}</small></button>`).join('')||'<p>Aún no guardaste una versión.</p>'}<h3>Otros proyectos</h3>${projects.map(p=>`<button class="history-card" data-open-project="${esc(p.id)}"><strong>${esc(p.title)}</strong><small>${esc(p.version||'Borrador')}</small></button>`).join('')}`);
 for(const b of document.querySelectorAll('[data-restore-version]'))b.onclick=run(async()=>{await store.saveVersion(project,'Antes de restaurar');await loadProject(await store.restoreVersion(project.id,b.dataset.restoreVersion));UI.closeDialog();UI.toast('Versión restaurada.');});
 for(const b of document.querySelectorAll('[data-open-project]'))b.onclick=run(async()=>{await store.save(project);await loadProject(await store.load(b.dataset.openProject));UI.closeDialog();});
}
function independentCopy(value,suffix=' · Copia'){
 const copy=M.clone(value);copy.id=M.uid('project');copy.title+=suffix;copy.version='Borrador';delete copy.cloudRevision;delete copy.cloudContentRevision;delete copy.aiSourceProjectId;delete copy.aiDraftRequestKey;copy.aiAppliedRequestIds=[];return copy;
}
function canLeaveProject(){if(exporting)throw Error('Espera a que termine la exportación antes de cambiar de proyecto.');if(aiPanel?.voice.recording)throw Error('Termina o cancela la nota de voz antes de cambiar de proyecto.');if(cloudSaving)throw Error('Espera a que termine el guardado del proyecto.');}
async function flushLocalProject(){clearTimeout(saveTimer);saveTimer=null;saveGeneration++;if(project)await store.save(project);}
async function listLibraryProjects(){
 const local=await store.listProjects();let remote;try{remote=(await cloudLibrary.list()).projects;}catch{return {projects:local,offline:true};}
 const merged=new Map(remote.map(p=>[p.id,{...p,storage:'cloud'}]));for(const p of local){const cloud=merged.get(p.id);if(!cloud)merged.set(p.id,p);else if(p.cloudRevision===cloud.revision)merged.set(p.id,{...cloud,title:p.title,thumbnail:p.thumbnail||cloud.thumbnail});}
 return {projects:[...merged.values()].sort((a,b)=>(b.updatedAt||'').localeCompare(a.updatedAt||''))};
}
async function saveCurrentProject(){
 canLeaveProject();cloudSaving=true;projectHub?.setSaving(true);engine?.pause();let saved=project;const previousCloudHash=project.cloudContentRevision;
 try{await flushLocalProject();await store.saveVersion(saved,`${saved.title} · ${new Date().toLocaleString('es-MX')}`);saved.cloudContentRevision=await projectRevision(saved);
  try{await cloudLibrary.save(saved);}catch(e){if(e.status!==409)throw e;const copy=independentCopy(saved,' · Copia de este equipo');copy.cloudContentRevision=await projectRevision(copy);await cloudLibrary.save(copy);await store.save(copy);await loadProject(copy,{save:false});saved=project;UI.toast('El proyecto cambió en otro dispositivo. Guardé tus cambios como una copia independiente.','info',8500);}
  await store.save(saved);status('Proyecto guardado en tu espacio privado',true);projectHub?.refreshContext();return {project:saved,storage:'cloud'};
 }catch(e){if(saved===project){if(previousCloudHash)saved.cloudContentRevision=previousCloudHash;else delete saved.cloudContentRevision;}status('Borrador local · pendiente de guardar en la nube',true);throw e;}
 finally{cloudSaving=false;projectHub?.setSaving(false);}
}
async function openSavedProject(id){
 canLeaveProject();await flushLocalProject();const local=await store.load(id);let next;
 try{const remote=await cloudLibrary.load(id);if(local&&(local.cloudRevision===remote.cloudRevision||await projectRevision(local)===await projectRevision(remote))){next=local;next.cloudRevision=remote.cloudRevision;}else{
   if(local&&(!local.cloudContentRevision||await projectRevision(local)!==local.cloudContentRevision||local.aiInstructionDraft?.trim()||local.aiVoiceDrafts?.length)){const copy=independentCopy(local,' · Borrador conservado');await store.save(copy);UI.toast('Conservé el borrador de este equipo como otra copia antes de abrir la versión guardada.','info',8500);}
   next=remote;
  }}catch(e){if(!local)throw e;next=local;UI.toast('Abrí el borrador guardado en este equipo.','info');}
 await loadProject(next,{save:false});await store.save(project);aiPanel.open({focus:false});return project;
}
async function addVideoProject(file){canLeaveProject();await flushLocalProject();const next=await createVideoProject(file,{store});await loadProject(next);await saveCurrentProject();aiPanel.open({focus:false});return project;}
async function importEditableProject(file){
 canLeaveProject();await flushLocalProject();const incoming=validateProject(JSON.parse(await file.text())),exists=(await store.listProjects()).some(p=>p.id===incoming.id);const value=exists?independentCopy(incoming,' · Importado'):independentCopy(incoming,'');
 for(const a of [...value.assets,...(value.references||[]),...(value.aiVoiceDrafts||[])])if(a.embeddedDataUrl)a.blobId=M.uid('imported-blob');
 const portable={format:'legacy-video-studio',project:value};const next=await store.importProject(portable);await loadProject(next);await saveCurrentProject();aiPanel.open({focus:false});return project;
}
async function linkProjectSource(input){
 const source=normalizeSource(input);if(input.projectId&&input.projectId!==project.id)throw Error('Abre primero el proyecto al que quieres vincular la carpeta.');canLeaveProject();
 mutate('Vincular fuente',()=>{project.sources||=[];if(!project.sources.some(s=>s.url===source.url))project.sources.push(source);});await saveCurrentProject();return source;
}
async function startFromSource(input){
 canLeaveProject();await flushLocalProject();const source=normalizeSource(input),next=createBlankProject({title:input.name||('Video desde '+(source.type==='drive'?'Drive':'GitHub')),sources:[source]});
 next.aiInstructionDraft=`Importa los materiales de esta fuente de ${source.type==='drive'?'Google Drive':'GitHub'}: ${source.url}. Usa mis conectores actuales de ChatGPT. Si hay un proyecto editable, conserva sus escenas, voz, música, efectos, tipografías y subtítulos; si hay solo un video terminado, impórtalo conservando su audio y explica qué elementos ya están incrustados. Conserva la fuente y organiza este proyecto de forma independiente. No publiques archivos privados ni gastes créditos de servicios externos. Si hay varias versiones, revisa los nombres y utiliza la más reciente claramente identificada; si no puedes determinarla, indícalo antes de sustituir medios.`;
 await loadProject(next);await saveCurrentProject();aiPanel.open({focus:false});UI.toast('Fuente vinculada. Envía las indicaciones desde Cambios con IA para que ChatGPT importe sus materiales.','info',10000);return project;
}
async function boot(){
 original=await(await fetch('doctor-v6.json')).json();wire();let saved=null;const activeId=localStorage.getItem('legacy-active-project')||original.id;
 try{saved=await store.load(activeId);}catch(e){fail(e);}if(!saved){try{saved=await cloudLibrary.load(activeId);}catch{}}
 await loadProject(saved||M.clone(original),{save:!saved});
 window.legacyStudio={get project(){return project;},get engine(){return engine;},store,selectScene,mutate,downloadProject,cloudLibrary,saveProject:saveCurrentProject,openProject:openSavedProject,createFromSource:startFromSource,importEditableProject};
 aiPanel=mountAI({getProject:()=>project,getSelectedSceneId:()=>selectedSceneId,store,openTab:tab,notify:UI.toast,async applyResult(next,meta){
  if((project.aiAppliedRequestIds||[]).includes(meta.requestId))return UI.toast('Esta versión de IA ya está incorporada.','info');
  const current=project;await store.saveVersion(current,'Antes de incorporar cambios con IA');
  const result=structuredClone(next);result.aiInstructionDraft=current.aiInstructionDraft||'';result.aiVoiceDrafts=current.aiVoiceDrafts||[];const concurrent=meta.baseRevision?await projectRevision(current)!==meta.baseRevision:meta.baseUpdatedAt&&current.updatedAt&&meta.baseUpdatedAt!==current.updatedAt;
  result.aiSourceProjectId=current.aiSourceProjectId||current.id;result.aiAppliedRequestIds=[...new Set([...(current.aiAppliedRequestIds||[]),...(result.aiAppliedRequestIds||[]),meta.requestId])];
  if(concurrent){result.id='project-'+crypto.randomUUID();result.title+=' · Versión IA';}else result.cloudRevision=current.cloudRevision;
  await loadProject(result);UI.toast(concurrent?'Guardé tus cambios manuales y abrí la versión de IA como un proyecto separado.':(meta.summary||'Cambios de IA incorporados al video.'),'success',8000);
 }});
 window.legacyStudio.ai=aiPanel;window.legacyStudio.mobile=mountMobileWorkbench({openAI:aiPanel.open,openTab:tab});
 projectHub=mountProjects({getProject:()=>project,listProjects:listLibraryProjects,openProject:openSavedProject,saveProject:saveCurrentProject,uploadVideo:addVideoProject,importProject:importEditableProject,linkSource:linkProjectSource,importSource:startFromSource,notify:UI.toast,async beforeHome(){canLeaveProject();engine?.pause();window.legacyStudio.mobile.close({restore:false});await flushLocalProject();},onEditor(){aiPanel.open({focus:false});}});
 window.legacyStudio.projects=projectHub;await projectHub.showHome();window.legacyStudio.ready=true;
}
boot().catch(e=>{$('stageLoading').textContent='No se pudo abrir el proyecto. Recarga la página para intentarlo de nuevo.';fail(e);});

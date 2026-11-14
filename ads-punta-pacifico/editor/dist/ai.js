import {escapeHTML as esc,formatTime} from './ui.js';
const $=id=>document.getElementById(id);
const stateLabels={queued:'Lista para ChatGPT',planning:'Revisando tus comentarios',generating:'Creando recursos',voice:'Preparando voz y subtítulos',applying:'Integrando los cambios',completed:'Cambios listos',needs_input:'Necesita un detalle',failed:'No se pudo terminar',cancelled:'Cancelada'};
export async function projectRevision(project){
 const transient=new Set(['updatedAt','aiDraftRequestKey','aiAppliedRequestIds','missingAssets','lastChange','version']);
 const clean=value=>Array.isArray(value)?value.map(clean):value&&typeof value==='object'?Object.fromEntries(Object.keys(value).sort().filter(k=>!transient.has(k)&&!(value.blobId&&['url','thumbnail'].includes(k))).map(k=>[k,clean(value[k])])):value;
 const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(JSON.stringify(clean(project))));return [...new Uint8Array(bytes)].map(n=>n.toString(16).padStart(2,'0')).join('');
}
export function chatGPTRequestURL(id,origin=location.origin){
 const prompt=`Usa la app Legacy Video Studio para ejecutar la solicitud ${id}. El editor está en ${origin}. Lee la solicitud con legacy_get_ai_request, reclama el trabajo y aplica todos mis comentarios al proyecto: genera y sustituye las imágenes que pida conservando las referencias del inmueble y personajes; si cambia el guion, regenera la locución completa y realinea escenas y subtítulos; ajusta música, efectos, transiciones y motion graphics según lo solicitado. Guarda los recursos y devuelve la versión completa mediante legacy_submit_ai_result para que aparezca en el editor. No me entregues solamente instrucciones ni me hagas sustituir archivos manualmente. Usa mis herramientas de ChatGPT disponibles y no contrates APIs ni gastes créditos de servicios externos. Si falta una herramienta, informa qué parte está bloqueada y conserva lo ya realizado.`;
 return `https://chatgpt.com/?q=${encodeURIComponent(prompt)}`;
}
async function api(path,options={}){
 const response=await fetch(path,{credentials:'same-origin',...options,headers:{...(options.body instanceof Blob?{}:{'Content-Type':'application/json'}),...options.headers}});
 let data;try{data=await response.json();}catch{throw Error('No se pudo conectar con el espacio de IA. Recarga el editor e inténtalo de nuevo.');}
 if(!response.ok||data.error)throw Error(data.error||`El servicio respondió ${response.status}`);return data;
}
export function mountAI(hooks){
 const rail=document.querySelector('.rail'),library=document.querySelector('.library');
 const nav=document.createElement('button');nav.className='rail-item ai-rail';nav.dataset.tab='ai';nav.innerHTML='<span class="ai-star">✦</span><span>Cambios IA</span>';nav.setAttribute('aria-label','Cambios con inteligencia artificial');rail.prepend(nav);
 const top=document.createElement('button');top.className='button ai-top-button';top.id='openAIBtn';top.textContent='✦ Cambios con IA';document.querySelector('.top-actions').prepend(top);
 const panel=document.createElement('section');panel.className='tool-panel ai-panel';panel.id='panel-ai';panel.dataset.panel='ai';
 panel.innerHTML=`<div class="ai-panel-heading"><span class="eyebrow">TÚ DESCRIBES. LA IA EDITA.</span><h1>Cambios con IA <span>✦</span></h1><p>Escribe lo que quieres cambiar. ChatGPT crea los recursos y devuelve el proyecto editado.</p></div>
 <div class="ai-context" id="aiContext"></div>
 <label class="field ai-main-field">¿Qué quieres cambiar?<textarea id="aiInstructions" rows="6" maxlength="20000" placeholder="Ej. En la escena 1 genera otra foto del doctor con vista al mar. Cambia el gancho por… y vuelve a generar la voz. Dale más energía a la música y anima el precio."></textarea></label>
 <div class="ai-examples"><button data-ai-example="image">Otra imagen</button><button data-ai-example="voice">Guion y voz</button><button data-ai-example="edit">Mejor edición</button></div>
 <label class="field">Dónde hacer los cambios<select id="aiScope"><option value="auto">Según lo que indique en mis comentarios</option><option value="scene">Solo esta escena</option><option value="project">Todo el video</option><option value="opening">Solo la apertura</option></select></label>
 <label class="check-field ai-comments-check"><input type="checkbox" id="aiIncludeComments" checked>Incluir comentarios pendientes <b id="aiOpenCommentCount">0</b></label>
 <details class="ai-details"><summary>Referencias y elementos que la IA recibirá</summary><p>El proyecto actual, guion, voz, medios, subtítulos y las referencias subidas. Cada comentario conserva su escena y momento.</p><div id="aiReferenceSummary"></div></details>
 <button class="button gold full ai-submit" id="submitAIRequest">✦ Aplicar cambios con ChatGPT</button>
 <p class="ai-connection-note">Se abrirá ChatGPT para ejecutar la solicitud con tu cuenta. Cuando termine, los cambios aparecerán aquí automáticamente.</p>
 <div id="aiConnectionState" class="ai-connection-state">Conectando tu espacio de IA…</div>
 <div class="ai-job-section"><div class="section-header"><h2>Tus solicitudes</h2><button class="text-btn" id="refreshAIRequests">Actualizar</button></div><div id="aiRequests"><p class="panel-hint">Aquí verás qué está preparando la IA y las versiones terminadas.</p></div></div>`;
 library.prepend(panel);
 const submitButton=$('submitAIRequest'),submissionNote=panel.querySelector('.ai-connection-note');panel.querySelector('.ai-examples').after(submitButton);submitButton.after(submissionNote);
 const banner=document.createElement('div');banner.className='ai-stage-banner';banner.innerHTML='<span>✦</span><div><strong>¿Prefieres que lo haga la IA?</strong><small>Describe el cambio y conserva el control del resultado.</small></div><button class="button subtle small" id="stageAIBtn">Pedir cambios</button>';document.querySelector('.stage-area').prepend(banner);
 const oldComments=$('commentText');if(oldComments){const commentsButton=document.createElement('button');commentsButton.className='button full ai-secondary';commentsButton.id='commentsToAIBtn';commentsButton.textContent='✦ Pedir estos cambios a ChatGPT';$('downloadCommentsBtn').before(commentsButton);commentsButton.onclick=()=>open();}
 let submitting=false,checking=false,requests=[],pollTimer,disposed=false,lastProjectId=null;
 function open(){hooks.openTab('ai');document.body.classList.add('ai-mode');refreshContext();$('aiInstructions').focus();}
 top.onclick=open;$('stageAIBtn').onclick=open;
 document.querySelectorAll('[data-tab]').forEach(b=>b.addEventListener('click',()=>document.body.classList.toggle('ai-mode',b.dataset.tab==='ai')));
 function refreshContext(){
  const p=hooks.getProject();if(lastProjectId!==p.id){lastProjectId=p.id;requests=[];if($('aiRequests'))renderRequests();}const s=p.scenes.find(s=>s.id===hooks.getSelectedSceneId())||p.scenes[0],a=p.assets.find(a=>a.id===s.mediaId),open=p.comments?.filter(c=>!c.resolved)||[];
  $('aiContext').innerHTML=`${a?.type==='image'?`<img src="${esc(a.thumbnail||a.url)}" alt="">`:'<span>▶</span>'}<div><strong>${esc(s.title)}</strong><small>${formatTime(s.start,true)} · ${s.duration.toFixed(1)} s <button class="text-btn" id="aiUseScene">Usar esta escena</button></small></div>`;
  $('aiUseScene').onclick=()=>$('aiScope').value='scene';$('aiOpenCommentCount').textContent=open.length;
  $('aiReferenceSummary').textContent=p.references?.length?`${p.references.length} referencia(s) disponibles para la solicitud.`:'Puedes subir videos o imágenes en Referencias antes de pedir el cambio.';
 }
 const examples={image:'Genera una nueva imagen para esta escena, con el mismo doctor usando el espacio que describe la narración. Conserva la arquitectura, la vista al mar y un solo tragaluz en el roof. Sustituye la imagen e intégrala en el video.',voice:'Reescribe el gancho para hablarle directamente al doctor. Regenera la voz completa con fluidez natural, ajusta los tiempos de las escenas y vuelve a sincronizar todos los subtítulos.',edit:'Dale más energía a la edición: mejora la música, sincroniza los efectos de sonido con los textos y usa transiciones B-roll con intención. Conserva el guion, los datos comerciales y la arquitectura.'};
 panel.querySelectorAll('[data-ai-example]').forEach(b=>b.onclick=()=>{$('aiInstructions').value=examples[b.dataset.aiExample];$('aiInstructions').focus();});
 async function snapshot(){
  const p=structuredClone(hooks.getProject());
  for(const a of [...p.assets,...(p.references||[])]){
   if(!a.blobId)continue;const blob=await hooks.store.getBlob(a.blobId);if(!blob)throw Error(`Falta el archivo «${a.name}». Vuelve a subirlo antes de enviarlo a la IA.`);
   if(blob.size>50*1024*1024)throw Error(`La referencia «${a.name}» supera 50 MB. Usa un fragmento más corto para la solicitud de IA.`);
   const result=await api(`/api/media/${encodeURIComponent(a.id)}`,{method:'PUT',body:blob,headers:{'Content-Type':blob.type||'application/octet-stream','X-Legacy-File-Name':encodeURIComponent(a.name)}});
   a.url=result.url;delete a.blobId;delete a.embeddedDataUrl;if(a.thumbnail?.startsWith('blob:'))delete a.thumbnail;
  }
  return p;
 }
 async function submit(){
  if(submitting)return;const instructions=$('aiInstructions').value.trim(),p=hooks.getProject(),comments=$('aiIncludeComments').checked?(p.comments||[]).filter(c=>!c.resolved):[];
  if(!instructions&&!comments.length){hooks.notify('Escribe qué quieres cambiar o agrega comentarios pendientes.','info');$('aiInstructions').focus();return;}
  submitting=true;$('submitAIRequest').disabled=true;$('submitAIRequest').textContent='Preparando el proyecto…';
  const chatWindow=window.open('about:blank','_blank');if(chatWindow)chatWindow.opener=null;
  try{
   await hooks.store.saveVersion(p,'Antes de solicitar cambios con IA');const baseRevision=await projectRevision(p),project=await snapshot();
   let key=p.aiDraftRequestKey;if(!key){key=crypto.randomUUID();p.aiDraftRequestKey=key;}
   await hooks.store.save(p);const result=await api('/api/ai/requests',{method:'POST',body:JSON.stringify({project,instructions,comments,scope:$('aiScope').value,sceneId:hooks.getSelectedSceneId(),idempotencyKey:key,baseRevision,mode:'chatgpt'})});
   delete p.aiDraftRequestKey;await hooks.store.save(p);$('aiInstructions').value='';const url=chatGPTRequestURL(result.request.id);
   if(chatWindow)chatWindow.location.href=url;
   hooks.notify('Solicitud lista en ChatGPT. Envía el mensaje allí; el resultado volverá al editor.','info',8000);await refresh();$('aiRequests').scrollIntoView?.({block:'nearest',behavior:'smooth'});
  }catch(error){chatWindow?.close();hooks.notify(error.message,'error',8000);}
  finally{submitting=false;$('submitAIRequest').disabled=false;$('submitAIRequest').textContent='✦ Aplicar cambios con ChatGPT';}
 }
 $('submitAIRequest').addEventListener('click',submit);
 function renderRequests(){
  $('aiRequests').innerHTML=requests.length?requests.map(r=>`<article class="ai-request-card ${esc(r.status)}"><div class="ai-request-top"><span class="ai-state-dot"></span><strong>${esc(stateLabels[r.status]||r.status)}</strong><small>${new Date(r.createdAt).toLocaleDateString('es-MX',{day:'numeric',month:'short'})}</small></div><p>${esc(r.instructions||`${r.commentCount} comentarios para editar`)}</p>${r.message?`<small class="ai-request-message">${esc(r.message)}</small>`:''}<div class="ai-request-actions">${!['completed','cancelled'].includes(r.status)?`<a class="button small" href="${esc(chatGPTRequestURL(r.id))}" target="_blank" rel="noopener">Continuar en ChatGPT ↗</a>`:''}${r.status==='completed'?`<button class="button small" data-ai-apply="${esc(r.id)}" ${(hooks.getProject().aiAppliedRequestIds||[]).includes(r.id)?'disabled':''}>${(hooks.getProject().aiAppliedRequestIds||[]).includes(r.id)?'Incorporado ✓':'Incorporar resultado'}</button>`:''}${['queued','needs_input','failed'].includes(r.status)?`<button class="text-btn" data-ai-cancel="${esc(r.id)}">Cancelar</button>`:''}</div></article>`).join(''):'<div class="empty-state compact"><strong>Tu próxima versión empieza con una idea.</strong><p>Escribe tus comentarios y deja que ChatGPT prepare los cambios.</p></div>';
  panel.querySelectorAll('[data-ai-apply]').forEach(b=>b.onclick=()=>apply(b.dataset.aiApply,true));panel.querySelectorAll('[data-ai-cancel]').forEach(b=>b.onclick=async()=>{try{await api(`/api/ai/requests/${b.dataset.aiCancel}/cancel`,{method:'POST',body:'{}'});await refresh();}catch(e){hooks.notify(e.message,'error');}});
 }
 async function apply(id,manual=false){
  try{const current=hooks.getProject();if(!manual&&(current.aiAppliedRequestIds||[]).includes(id))return;
   const result=await api(`/api/ai/requests/${encodeURIComponent(id)}/result`);await hooks.applyResult(result.project,{requestId:id,summary:result.summary,baseUpdatedAt:result.baseUpdatedAt,baseRevision:result.baseRevision});renderRequests();
  }catch(error){hooks.notify(error.message,'error',8000);}
 }
 async function refresh(){
  if(checking||disposed)return;checking=true;
  try{const p=hooks.getProject(),data=await api(`/api/ai/requests?project_id=${encodeURIComponent(p.aiSourceProjectId||p.id)}`);if((hooks.getProject().aiSourceProjectId||hooks.getProject().id)!==(p.aiSourceProjectId||p.id))return;requests=data.requests;$('aiConnectionState').textContent='● Conectado · Ejecución con tu ChatGPT';$('aiConnectionState').classList.add('connected');renderRequests();
   for(const r of requests)if(r.status==='completed'&&!(hooks.getProject().aiAppliedRequestIds||[]).includes(r.id))await apply(r.id);
  }catch(error){$('aiConnectionState').textContent='No se pudo conectar. Tus cambios manuales siguen disponibles.';$('aiConnectionState').classList.remove('connected');}
  finally{checking=false;}
 }
 $('refreshAIRequests').onclick=refresh;
 const visibility=()=>{if(!document.hidden){refreshContext();refresh();}};document.addEventListener('visibilitychange',visibility);
 const time=()=>{if(!document.hidden){refreshContext();refresh();}};pollTimer=setInterval(time,10000);
 hooks.onProjectChange=()=>{refreshContext();};refreshContext();refresh();open();
 return {open,refresh,refreshContext,dispose(){disposed=true;clearInterval(pollTimer);document.removeEventListener('visibilitychange',visibility);}};
}

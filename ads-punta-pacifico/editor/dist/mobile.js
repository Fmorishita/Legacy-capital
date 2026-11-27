export function mountMobileWorkbench({openAI,openTab}){
 const query=window.matchMedia('(max-width: 900px)');
 const bar=document.createElement('div');bar.className='mobile-workbench-controls';bar.innerHTML='<button type="button" id="mobilePreviewBtn">▶ Ver anuncio</button><button type="button" id="mobileToolsBtn">☷ Herramientas</button>';document.querySelector('.ai-panel-heading').after(bar);
 const backdrop=document.createElement('div');backdrop.className='mobile-sheet-backdrop';backdrop.hidden=true;document.body.append(backdrop);
 const closebar=document.createElement('div');closebar.className='mobile-sheet-header';closebar.hidden=true;closebar.innerHTML='<button type="button" id="mobileBackBtn">‹ Cambios con IA</button><strong id="mobileSheetTitle">Herramientas</strong><button type="button" id="mobileCloseBtn" aria-label="Cerrar herramienta">×</button>';document.body.append(closebar);
 const menu=document.createElement('section');menu.className='mobile-tools-menu';menu.id='mobileToolsMenu';menu.hidden=true;menu.setAttribute('aria-label','Herramientas de edición');
 const choices=[['scenes','▦','Escenas','Elige dónde pedir el cambio'],['preview','▶','Vista previa','Revisa el anuncio'],['timeline','≋','Línea de tiempo','Abre el montaje'],['inspector','☷','Inspector','Ajustes de la escena'],['references','◇','Referencias','Sube un estilo o ejemplo'],['comments','✎','Comentarios','Notas en momentos concretos'],['media','▧','Medios','Imágenes, videos y audio'],['script','¶','Guion','Texto de la narración'],['audio','♫','Audio','Voz, música y efectos'],['captions','CC','Subtítulos','Texto y sincronía'],['design','✦','Diseño','Marca y animaciones'],['export','↗','Exportar','Video o proyecto editable']];
 menu.innerHTML='<p>Abre solo lo que necesites. Tus indicaciones se conservan al volver.</p><div class="mobile-tools-grid">'+choices.map(([key,icon,title,subtitle])=>`<button type="button" data-mobile-tool="${key}"><span>${icon}</span><strong>${title}</strong><small>${subtitle}</small></button>`).join('')+'</div>';document.body.append(menu);
 let panel=null,returnFocus=null;
 function close({restore=true}={}){panel=null;delete document.body.dataset.mobilePanel;backdrop.hidden=true;closebar.hidden=true;menu.hidden=true;document.body.classList.remove('mobile-sheet-open');if(query.matches&&restore)openAI({focus:false});returnFocus?.focus?.({preventScroll:true});returnFocus=null;}
 function show(key){
  if(!query.matches)return;if(panel===key){close();return;}returnFocus=document.activeElement;panel=key;document.body.dataset.mobilePanel=key;document.body.classList.add('mobile-sheet-open');backdrop.hidden=false;closebar.hidden=false;menu.hidden=key!=='tools';
  document.getElementById('mobileSheetTitle').textContent=choices.find(x=>x[0]===key)?.[2]||(key==='tools'?'Herramientas':'Editor');
  if(!['tools','preview','timeline','inspector'].includes(key))openTab(key);
  closebar.querySelector('#mobileBackBtn').focus({preventScroll:true});
 }
 document.getElementById('mobilePreviewBtn').onclick=()=>show('preview');document.getElementById('mobileToolsBtn').onclick=()=>show('tools');document.getElementById('mobileBackBtn').onclick=()=>close();document.getElementById('mobileCloseBtn').onclick=()=>close();backdrop.onclick=()=>close();
 menu.addEventListener('click',e=>{const button=e.target.closest('[data-mobile-tool]');if(!button)return;const key=button.dataset.mobileTool;if(key==='export'){close();document.getElementById('exportBtn').click();}else show(key);});
 const clicked=e=>{
  if(!query.matches)return;
  if(e.target.closest('#openAIBtn,#stageAIBtn,#commentsToAIBtn'))close({restore:false});
  const tab=e.target.closest('[data-tab]');if(tab){if(tab.dataset.tab==='ai')close({restore:false});else show(tab.dataset.tab);}
  if(panel==='scenes'&&e.target.closest('[data-action="select-scene"]'))close();
 };
 document.addEventListener('click',clicked);
 const key=e=>{if(query.matches&&panel&&e.key==='Escape'&&!document.querySelector('dialog[open]')){e.preventDefault();close();}};document.addEventListener('keydown',key);
 const changed=()=>{document.body.classList.toggle('mobile-workspace',query.matches);if(!query.matches)close({restore:false});else openAI({focus:false});};query.addEventListener?.('change',changed);changed();
 return {show,close,get panel(){return panel;},dispose(){close({restore:false});query.removeEventListener?.('change',changed);document.removeEventListener('click',clicked);document.removeEventListener('keydown',key);bar.remove();menu.remove();backdrop.remove();closebar.remove();}};
}

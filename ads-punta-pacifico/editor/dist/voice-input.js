import {escapeHTML as esc} from './ui.js';
const $=id=>document.getElementById(id);
const clock=()=>globalThis.performance?.now?.()??Date.now();
export function voiceExtension(mime=''){return /aac/i.test(mime)?'aac':/mp4|m4a/i.test(mime)?'m4a':/mpeg|mp3/i.test(mime)?'mp3':/ogg/i.test(mime)?'ogg':/wav/i.test(mime)?'wav':'webm';}
export class VoiceCapture {
 constructor(options={}){this.options=options;this.state='idle';this.token=0;this.parts=[];this.finalText='';this.interim='';this.session=0;this.seen=new Set();this.stream=null;this.recorder=null;this.recognition=null;this.started=0;this.restarts=0;}
 emit(state,message=''){this.state=state;this.options.onState?.({state,message,transcript:this.finalText,interim:this.interim});}
 get recording(){return ['requesting','recording','stopping'].includes(this.state);}
 async start(){
  if(this.recording)return false;const token=++this.token;this.parts=[];this.finalText='';this.interim='';this.seen.clear();this.session=0;this.restarts=0;this.emit('requesting','Permite el micrófono para empezar.');
  const Recorder=this.options.Recorder||globalThis.MediaRecorder;
  const getUserMedia=this.options.getUserMedia||((constraints)=>navigator.mediaDevices?.getUserMedia(constraints));
  try{
   if(!Recorder)throw new Error('Este navegador no permite grabar audio. Usa el micrófono del teclado o adjunta una nota de voz.');
   const stream=await getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true},video:false});if(!stream)throw Error('No se pudo abrir el micrófono.');
   if(token!==this.token){stream.getTracks().forEach(t=>t.stop());return false;}this.stream=stream;
   const mime=['audio/webm;codecs=opus','audio/mp4','audio/webm','audio/ogg;codecs=opus'].find(type=>Recorder.isTypeSupported?.(type));
   this.recorder=new Recorder(stream,{...(mime?{mimeType:mime}:{}),audioBitsPerSecond:96000});
   this.recorder.ondataavailable=e=>{if(e.data?.size)this.parts.push(e.data);};
   this.recorder.onerror=e=>{if(this.options.onError)this.options.onError(e.error||new Error('La grabación se interrumpió.'));else this.stop({cancel:true});};
   this.recorder.start(500);this.started=(this.options.clock||clock)();this.emit('recording','Grabando tus indicaciones…');this.startRecognition();return true;
  }catch(error){this.release();if(token!==this.token)return false;this.emit('error',error.name==='NotAllowedError'?'Permite el micrófono en los ajustes del navegador para grabar.':error.message||'No se pudo abrir el micrófono.');throw error;}
 }
 startRecognition(){
  const Recognition=this.options.Recognition||globalThis.SpeechRecognition||globalThis.webkitSpeechRecognition;
  if(!Recognition){this.options.onTranscript?.({text:this.finalText,interim:'',supported:false});return;}
  try{
   const recognition=new Recognition();this.recognition=recognition;recognition.lang='es-MX';recognition.interimResults=true;recognition.continuous=true;const session=++this.session;
   recognition.onresult=event=>{let interim='';for(let i=event.resultIndex||0;i<event.results.length;i++){const value=event.results[i],text=value[0]?.transcript?.trim()||'';const key=session+':'+i;if(value.isFinal&&!this.seen.has(key)){this.seen.add(key);this.finalText=[this.finalText,text].filter(Boolean).join(' ');}else if(!value.isFinal)interim+=' '+text;}this.interim=interim.trim();this.options.onTranscript?.({text:this.finalText,interim:this.interim,supported:true});};
   recognition.onerror=e=>{if(e.error!=='aborted')this.options.onTranscript?.({text:this.finalText,interim:'',supported:false,message:'El audio se conserva aunque el navegador no transcriba en vivo.'});this.allowRestart=false;};
   recognition.onend=()=>{this.recognitionEnded?.();if(this.state==='recording'&&this.allowRestart&&this.restarts<3){this.restarts++;setTimeout(()=>{if(this.state==='recording')this.startRecognition();},200);}};
   this.allowRestart=true;recognition.start();
  }catch{this.options.onTranscript?.({text:this.finalText,interim:'',supported:false});}
 }
 async stop({cancel=false}={}){
  if(this.state==='requesting'){this.token++;this.release();this.emit('idle');return null;}
  if(this.state!=='recording')return null;this.emit('stopping',cancel?'Cancelando…':'Guardando tu nota…');this.allowRestart=false;
  const seconds=Math.max(0,((this.options.clock||clock)()-this.started)/1000),recorder=this.recorder;
  const recognitionDone=new Promise(resolve=>{this.recognitionEnded=resolve;if(!this.recognition||cancel)return resolve();try{this.recognition.stop();}catch{resolve();}setTimeout(resolve,650);});
  const recorderDone=new Promise(resolve=>{if(!recorder||recorder.state==='inactive')return resolve();recorder.onstop=resolve;try{recorder.stop();}catch{resolve();}});
  if(cancel){try{this.recognition?.abort();}catch{}this.stream?.getTracks().forEach(t=>t.stop());}
  await Promise.all([recorderDone,recognitionDone]);const mime=recorder?.mimeType||this.parts.find(p=>p.type)?.type||'audio/webm';const blob=new Blob(this.parts,{type:mime});const result=cancel?null:{blob,mime,duration:seconds,transcript:this.finalText.trim()};
  this.release();this.parts=[];this.interim='';this.emit('idle');return result;
 }
 release(){try{this.recognition?.abort();}catch{}this.recognition=null;this.stream?.getTracks().forEach(t=>t.stop());this.stream=null;this.recorder=null;this.recognitionEnded=null;}
}
export function mountVoiceInput({getProject,store,textarea,persist,notify,onRecording}){
 const box=document.createElement('div');box.className='voice-input';box.innerHTML='<div class="voice-input-toolbar"><button type="button" class="voice-start" id="voiceStartBtn" aria-label="Grabar indicaciones por voz"><span>🎙</span> Hablar</button><label class="voice-attach" for="voiceFileInput">Adjuntar audio<input id="voiceFileInput" type="file" accept="audio/*" hidden></label></div><p id="voiceHint" class="voice-hint">Habla tus cambios y revísalos antes de enviarlos.</p><div id="voiceDraftList" class="voice-draft-list"></div>';textarea.closest('.ai-main-field').after(box);
 const dialog=document.createElement('dialog');dialog.id='voiceDialog';dialog.className='voice-dialog';dialog.innerHTML='<div class="voice-dialog-heading"><span class="voice-rec-dot"></span><strong id="voiceStatus">Preparando el micrófono…</strong><button type="button" id="voiceCancelBtn" aria-label="Cancelar grabación">×</button></div><div class="voice-wave" id="voiceWave" aria-hidden="true">'+Array.from({length:24},()=>'<i></i>').join('')+'</div><div class="voice-time" id="voiceElapsed">00:00</div><p class="voice-live-text" id="voiceLiveText" aria-live="polite">Habla con naturalidad. Puedes indicar escenas y varios cambios.</p><button type="button" class="button gold full voice-finish" id="voiceFinishBtn">✓ Terminar y usar nota</button><small>Máximo 3 minutos por nota. El audio se envía al pedir los cambios.</small>';document.body.append(dialog);
 let timer=null,frame=null,context=null,analyser=null,source=null,busy=false;
 const capture=new VoiceCapture({onState({state,message}){$('voiceStatus').textContent=message||'Nota de voz';$('voiceStartBtn').disabled=['requesting','recording','stopping'].includes(state);$('voiceFinishBtn').disabled=state!=='recording';onRecording?.(busy||['requesting','recording','stopping'].includes(state));if(state==='recording'){startMeter();timer=setInterval(()=>{const t=Math.max(0,(clock()-capture.started)/1000);$('voiceElapsed').textContent=`${String(Math.floor(t/60)).padStart(2,'0')}:${String(Math.floor(t%60)).padStart(2,'0')}`;if(t>=180)finish();},250);}else if(state==='idle'||state==='error')stopMeter();},onTranscript({text,interim,supported}){$('voiceLiveText').textContent=[text,interim].filter(Boolean).join(' ')||(supported?'Te estoy escuchando…':'Grabando el audio. ChatGPT recibirá tu nota aunque no haya dictado en vivo.');},onError:error=>{notify(error.message,'error');finish();}});
 function stopMeter(){clearInterval(timer);timer=null;if(frame)cancelAnimationFrame(frame);frame=null;try{source?.disconnect();analyser?.disconnect();context?.close();}catch{}source=null;analyser=null;context=null;}
 function startMeter(){
  const AudioContext=window.AudioContext||window.webkitAudioContext;if(!AudioContext||!capture.stream)return;
  try{context=new AudioContext();context.resume?.().catch(()=>{});source=context.createMediaStreamSource(capture.stream);analyser=context.createAnalyser();analyser.fftSize=128;source.connect(analyser);const values=new Uint8Array(analyser.frequencyBinCount),bars=[...$('voiceWave').children];const draw=()=>{if(!analyser)return;analyser.getByteFrequencyData(values);bars.forEach((bar,i)=>bar.style.height=(4+Math.min(48,values[Math.floor(i*values.length/bars.length)]/255*48))+'px');frame=requestAnimationFrame(draw);};draw();}catch{stopMeter();}
 }
 async function add(blob,{transcript='',duration=0,name}={}){
  if((getProject().aiVoiceDrafts||[]).length>=5)throw Error('Puedes enviar hasta 5 notas por solicitud. Envía las actuales o elimina una.');if(blob.size<128)throw Error('La grabación está vacía. Vuelve a intentarlo.');if(blob.size>10*1024*1024)throw Error('Usa una nota de voz de hasta 10 MB.');
  const id='voice-'+crypto.randomUUID(),mime=(blob.type||'audio/webm').split(';')[0].replace('audio/x-m4a','audio/mp4').replace('audio/x-wav','audio/wav');await store.putBlob(id,blob);const note={id,blobId:id,url:URL.createObjectURL(blob),name:name||`Nota de voz ${new Date().toLocaleTimeString('es-MX',{hour:'2-digit',minute:'2-digit'})}.${voiceExtension(mime)}`,type:'audio',purpose:'editing_instructions',mime,bytes:blob.size,duration,transcript,createdAt:new Date().toISOString()};
  const p=getProject();p.aiVoiceDrafts||=[];p.aiVoiceDrafts.push(note);if(transcript){textarea.value=[textarea.value.trim(),transcript].filter(Boolean).join('\n\n');p.aiInstructionDraft=textarea.value;textarea.dispatchEvent(new Event('input',{bubbles:true}));}
  await persist();refresh();$('voiceHint').textContent=transcript?'Dictado añadido. Puedes corregir el texto y escuchar la nota.':'Audio listo. Se adjuntará para que ChatGPT escuche tus indicaciones.';return note;
 }
 async function begin(){if(busy)return;if((getProject().aiVoiceDrafts||[]).length>=5)return notify('Envía las notas actuales o elimina una antes de grabar otra.','info');$('voiceElapsed').textContent='00:00';$('voiceLiveText').textContent='Habla con naturalidad. Puedes indicar escenas y varios cambios.';dialog.showModal();try{await capture.start();}catch(error){dialog.close();stopMeter();const message=error.name==='NotAllowedError'?'Permite el micrófono en los ajustes del navegador. También puedes usar el dictado del teclado o adjuntar audio.':error.message;notify(message,'error',8000);$('voiceHint').textContent=message;}}
 async function finish(){if(busy)return;busy=true;onRecording?.(true);try{const result=await capture.stop();if(result)await add(result.blob,result);}catch(error){notify(error.message,'error',8000);}finally{busy=false;stopMeter();dialog.close();onRecording?.(false);}}
 async function cancel(){if(busy)return;await capture.stop({cancel:true});stopMeter();dialog.close();}
 $('voiceStartBtn').onclick=begin;$('voiceFinishBtn').onclick=finish;$('voiceCancelBtn').onclick=cancel;dialog.addEventListener('cancel',e=>{e.preventDefault();cancel();});
 $('voiceFileInput').onchange=async e=>{try{const file=e.target.files?.[0];if(file){if(!file.type.startsWith('audio/'))throw Error('Selecciona un archivo de audio.');await add(file,{name:file.name});}}catch(error){notify(error.message,'error');}finally{e.target.value='';}};
 function refresh(){const notes=getProject().aiVoiceDrafts||[];$('voiceDraftList').innerHTML=notes.map(n=>`<div class="voice-note"><div><strong>🎙 ${esc(n.name)}</strong><small>${n.transcript?'Con dictado editable':'Indicaciones en audio'}${n.duration?' · '+Math.round(n.duration)+' s':''}</small></div><button type="button" data-remove-voice="${esc(n.id)}" aria-label="Eliminar nota de voz">×</button><audio controls preload="metadata" src="${esc(n.url||'')}"></audio></div>`).join('');box.querySelectorAll('[data-remove-voice]').forEach(b=>b.onclick=async()=>{const p=getProject(),note=p.aiVoiceDrafts.find(n=>n.id===b.dataset.removeVoice);p.aiVoiceDrafts=p.aiVoiceDrafts.filter(n=>n.id!==b.dataset.removeVoice);if(note?.url?.startsWith('blob:'))URL.revokeObjectURL(note.url);await persist();refresh();});}
 const visibility=()=>{if(document.hidden&&capture.state==='recording')finish();};document.addEventListener('visibilitychange',visibility);refresh();
 return {capture,refresh,get recording(){return busy||capture.recording;},async clear(){getProject().aiVoiceDrafts=[];await persist();refresh();},dispose(){capture.stop({cancel:true});stopMeter();document.removeEventListener('visibilitychange',visibility);dialog.remove();box.remove();}};
}

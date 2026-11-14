import assert from 'node:assert/strict';
globalThis.document={querySelectorAll:()=>[]};
const {VoiceCapture,voiceExtension}=await import('../dist/voice-input.js');
class Recorder {
 static isTypeSupported(mime){return mime.includes('webm');}
 constructor(stream,options){this.stream=stream;this.mimeType=options.mimeType;this.state='inactive';}
 start(){this.state='recording';}
 stop(){this.state='inactive';queueMicrotask(()=>{this.ondataavailable?.({data:new Blob([new Uint8Array(1024)],{type:this.mimeType})});this.onstop?.();});}
}
class Recognition {
 start(){Recognition.last=this;}
 stop(){this.onend?.();}
 abort(){this.onend?.();}
 emit(text,final=true){const result=[{transcript:text}];result.isFinal=final;this.onresult?.({resultIndex:0,results:[result]});}
}
let stopped=0,time=0;const stream={getTracks:()=>[{stop:()=>stopped++}]};const capture=new VoiceCapture({Recorder,Recognition,getUserMedia:async()=>stream,clock:()=>time});
assert.equal(await capture.start(),true);assert.equal(capture.state,'recording');Recognition.last.emit('En la primera escena cambia el doctor');Recognition.last.emit('En la primera escena cambia el doctor');time=3500;const note=await capture.stop();assert.equal(note.transcript,'En la primera escena cambia el doctor');assert.equal(note.duration,3.5);assert.equal(note.blob.size,1024);assert.equal(stopped,1);assert.equal(capture.state,'idle');
await capture.start();assert.equal(await capture.stop({cancel:true}),null);assert.ok(stopped>=2);
const denied=new VoiceCapture({Recorder,getUserMedia:async()=>{throw Object.assign(new Error('denied'),{name:'NotAllowedError'});}});await assert.rejects(()=>denied.start(),/denied/);assert.equal(denied.state,'error');
let allow;const pending=new VoiceCapture({Recorder,getUserMedia:()=>new Promise(resolve=>allow=resolve)});const start=pending.start();await pending.stop({cancel:true});const before=stopped;allow(stream);assert.equal(await start,false);assert.equal(stopped,before+1);
const audioOnly=new VoiceCapture({Recorder,getUserMedia:async()=>stream,clock:()=>time});await audioOnly.start();time+=2000;const audioNote=await audioOnly.stop();assert.equal(audioNote.transcript,'');assert.equal(audioNote.blob.size,1024);assert.equal(audioNote.duration,2);
assert.equal(voiceExtension('audio/mp4'),'m4a');assert.equal(voiceExtension('audio/mpeg'),'mp3');assert.equal(voiceExtension('audio/aac'),'aac');
console.log(JSON.stringify({ok:true,checks:['actual recorded Blob preserved','final transcript deduplicated','cancel releases microphone','permission denial','cancel pending permission','audio-only fallback','mobile formats'],hardwareMicrophone:'unverified; adapters simulated'}));

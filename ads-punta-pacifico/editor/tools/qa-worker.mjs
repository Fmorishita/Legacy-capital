import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import worker,{validateResult} from '../worker/index.mjs';
const bytes=value=>typeof value==='string'?new TextEncoder().encode(value):value instanceof ArrayBuffer?new Uint8Array(value):value;
class Bucket {
 constructor(){this.values=new Map();}
 async put(key,value,options={}){if(value instanceof ReadableStream)value=new Uint8Array(await new Response(value).arrayBuffer());const data=bytes(value),old=this.values.get(key);if(options.onlyIf?.etagDoesNotMatch==='*'&&old)return null;if(options.onlyIf?.etagMatches&&old?.etag!==options.onlyIf.etagMatches)return null;const etag=createHash('sha256').update(data).digest('hex');this.values.set(key,{data,etag,httpMetadata:options.httpMetadata||{},customMetadata:options.customMetadata||{}});return {etag};}
 async get(key,options={}){const value=this.values.get(key);if(!value)return null;let data=value.data;const full=data.length;let range;if(options.range){const offset=options.range.offset||0,length=Math.min(options.range.length||full-offset,full-offset);range={offset,length};data=data.subarray(offset,offset+length);}return {...value,size:full,range,httpEtag:'"'+value.etag+'"',body:data,text:async()=>new TextDecoder().decode(data),arrayBuffer:async()=>data.slice().buffer,writeHttpMetadata(headers){for(const[k,v]of Object.entries(value.httpMetadata))headers.set(k==='contentType'?'Content-Type':k,v);}};}
 async head(key){return this.get(key);}
 async list({prefix='',limit=1000}={}){return {objects:[...this.values.keys()].filter(k=>k.startsWith(prefix)).sort().slice(0,limit).map(key=>({key})),truncated:false};}
 async delete(keys){for(const k of Array.isArray(keys)?keys:[keys])this.values.delete(k);}
}
const bucket=new Bucket();
async function request(path,body,method=body?'POST':'GET',headers={}){const response=await worker.fetch(new Request('https://studio.test'+path,{method,headers:{'Content-Type':'application/json',...headers},...(body?{body:typeof body==='string'?body:JSON.stringify(body)}:{})}),{BUCKET:bucket},{});return {status:response.status,data:await response.json()};}
async function mcp(name,args={}){const r=await request('/mcp',{jsonrpc:'2.0',id:1,method:'tools/call',params:{name,arguments:args}});if(r.data.result?.isError)throw Error(r.data.result.content[0].text);return r.data.result.structuredContent||r.data.result;}
const project=JSON.parse(await readFile(new URL('../dist/doctor-v6.json',import.meta.url),'utf8'));
const payload={project,instructions:'Cambiar la foto de la primera escena.',comments:[],scope:'scene',sceneId:project.scenes[0].id,idempotencyKey:'qa-request'};
const create=await request('/api/ai/requests',payload);assert.equal(create.status,201);const id=create.data.request.id;assert.equal((await request('/api/ai/requests',payload)).data.duplicate,true);assert.equal((await mcp('legacy_list_ai_requests')).requests.length,1);
const claim=await mcp('legacy_claim_ai_request',{request_id:id});assert.equal(claim.request.status,'planning');await assert.rejects(()=>mcp('legacy_claim_ai_request',{request_id:id}),/reclamada/);
const original=await mcp('legacy_get_project',{request_id:id,section:'all'});assert.equal(original.project.scenes.length,28);
const media=await readFile(new URL('../dist/assets/images/doctor-01.jpg',import.meta.url));const sha=createHash('sha256').update(media).digest('hex');const start=await mcp('legacy_begin_asset_upload',{request_id:id,name:'Imagen de QA',mime_type:'image/jpeg',bytes:media.length,sha256:sha});
for(let at=0,index=0;at<media.length;at+=196608,index++)await mcp('legacy_upload_asset_chunk',{request_id:id,upload_id:start.upload_id,index,data_base64:media.subarray(at,at+196608).toString('base64')});
const stored=await mcp('legacy_finish_asset_upload',{request_id:id,upload_id:start.upload_id});assert.equal(stored.asset.sha256,sha);
const updated=structuredClone(project);updated.assets.push(stored.asset);updated.scenes[0].mediaId=stored.asset.id;await mcp('legacy_update_ai_request',{request_id:id,status:'applying',message:'Integrando el recurso de prueba.'});
const done=await mcp('legacy_submit_ai_result',{request_id:id,project:updated,summary:'Prueba de integración de medios, sin generación IA.'});assert.equal(done.request.status,'completed');const result=await request(`/api/ai/requests/${id}/result`);assert.equal(result.data.project.scenes[0].mediaId,stored.asset.id);assert.ok(result.data.project.aiAppliedRequestIds.includes(id));
const bad=structuredClone(project);bad.script='Otro guion nuevo.';bad.voiceScript=bad.script;assert.throws(()=>validateResult(bad,project),/locución nueva/);
const badAudio=structuredClone(project);badAudio.audioTracks[0].duration=project.duration+3;assert.throws(()=>validateResult(badAudio,project),/pista de audio/);
const unsafe=structuredClone(project);unsafe.assets[0].url='javascript:alert(1)';assert.throws(()=>validateResult(unsafe,project),/no admitida/);
const csrf=await request('/api/ai/requests',{...payload,idempotencyKey:'csrf'},'POST',{Origin:'https://evil.test'});assert.equal(csrf.status,400);
const discovered=await request('/mcp',{jsonrpc:'2.0',id:2,method:'server/discover'});assert.deepEqual(discovered.data.result.supportedVersions,['2026-07-28']);
const listed=await request('/mcp',{jsonrpc:'2.0',id:3,method:'tools/list'});assert.equal(listed.data.result.tools.length,11);
// Real audio bytes remain a request attachment, separate from the video project.
await bucket.put('media/voice-qa',new Uint8Array(256),{httpMetadata:{contentType:'audio/webm'}});
const voiced=await request('/api/ai/requests',{...payload,instructions:'',idempotencyKey:'qa-voice-only',voiceNotes:[{id:'voice-qa',url:'/api/media/voice-qa',name:'Cambios.webm',duration:3}]});assert.equal(voiced.status,201);assert.equal(voiced.data.request.voiceNoteCount,1);
const voiceDetail=await mcp('legacy_get_ai_request',{request_id:voiced.data.request.id,include_project:true});assert.equal(voiceDetail.voiceNotes[0].purpose,'editing_instructions');assert.equal(voiceDetail.project.audioTracks.some(t=>t.assetId==='voice-qa'),false);
const listened=await mcp('legacy_get_voice_note',{request_id:voiced.data.request.id,note_id:'voice-qa'});assert.equal(listened.content[1].type,'audio');assert.equal(listened.content[1].mimeType,'audio/webm');assert.equal(Buffer.from(listened.content[1].data,'base64').length,256);
await assert.rejects(()=>mcp('legacy_get_voice_note',{request_id:id,note_id:'voice-qa'}),/No se encontró/);
const invalidNote=await request('/api/ai/requests',{...payload,idempotencyKey:'bad-note',voiceNotes:[{id:'voice-qa',url:'https://other.test/audio.mp3'}]});assert.equal(invalidNote.status,400);
console.log(JSON.stringify({ok:true,requestId:id,tests:['idempotent request','exclusive claim','project read','binary chunks','SHA verification','integrated scene result','new voice required for new script','invalid URL rejected','cross-origin write rejected','MCP discovery and tools','voice-only request','scoped private audio retrieval','external note rejected'],toolCount:11,real_model_generation:false}));
export {Bucket,worker};

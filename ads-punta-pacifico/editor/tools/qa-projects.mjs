import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {Bucket,worker} from './qa-worker.mjs';
const bucket=new Bucket();
async function call(path,body,method=body?'POST':'GET',headers={}){
 const response=await worker.fetch(new Request('https://studio.test'+path,{method,headers:{'Content-Type':'application/json',...headers},...(body?{body:JSON.stringify(body)}:{})}),{BUCKET:bucket},{});
 return {status:response.status,data:await response.json()};
}
const original=JSON.parse(await readFile(new URL('../dist/doctor-v6.json',import.meta.url),'utf8'));
assert.deepEqual((await call('/api/projects')).data.projects,[],'starts empty; migration is explicit');
const first=await call('/api/projects',{project:original});assert.equal(first.status,201);assert.ok(first.data.revision);assert.equal(first.data.summary.sceneCount,28);
const loaded=await call('/api/projects/'+original.id);assert.equal(loaded.status,200);assert.equal(loaded.data.project.id,original.id);assert.equal(loaded.data.revision,first.data.revision);
assert.equal((await call('/api/projects',{project:original})).status,409,'duplicate create never overwrites');
const changed=structuredClone(original);changed.title='Doctor V6 · Mi prueba';changed.sources=[{type:'drive',url:'https://drive.google.com/drive/folders/example',name:'Renders de referencia'},{type:'github',url:'https://github.com/Fmorishita/Legacy-capital/tree/main/ads-punta-pacifico',name:'Editable'}];
const saved=await call('/api/projects/'+original.id,{project:changed,revision:first.data.revision},'PUT');assert.equal(saved.status,200);assert.notEqual(saved.data.revision,first.data.revision);assert.equal(saved.data.summary.sources.length,2);
const stale=await call('/api/projects/'+original.id,{project:original,revision:first.data.revision},'PUT');assert.equal(stale.status,409);assert.equal(stale.data.code,'project_conflict');assert.equal((await call('/api/projects/'+original.id)).data.project.title,changed.title,'stale save preserves existing project');
const sameRevision=await Promise.all([call('/api/projects/'+original.id,{project:{...changed,title:'Desktop edit'},revision:saved.data.revision},'PUT'),call('/api/projects/'+original.id,{project:{...changed,title:'Mobile edit'},revision:saved.data.revision},'PUT')]);assert.deepEqual(sameRevision.map(r=>r.status).sort(),[200,409],'R2 conditional write resolves concurrent editors');
const videoProject={...structuredClone(original),id:'my-other-video',title:'Video independiente',assets:[{id:'clip',type:'video',url:'/api/media/clip-qa',name:'Video.mp4'}],scenes:[{id:'scene-clip',start:0,duration:3,mediaId:'clip',layers:[]}],duration:3,audioTracks:[],captions:[],overlays:[],sources:[{type:'upload',name:'Video.mp4'}]};
const missing=await call('/api/projects',{project:videoProject});assert.equal(missing.status,400);assert.equal(missing.data.code,'project_media_missing');
await bucket.put('media/clip-qa',new Uint8Array(128),{httpMetadata:{contentType:'video/mp4'}});const second=await call('/api/projects',{project:videoProject});assert.equal(second.status,201);assert.equal((await call('/api/projects')).data.projects.length,2);assert.equal((await call('/api/projects/'+original.id)).data.project.scenes.length,28,'new project does not overwrite Doctor');
const temporary=structuredClone(videoProject);temporary.id='local-only';temporary.assets[0].url='blob:temporary';assert.equal((await call('/api/projects',{project:temporary})).data.code,'local_media_not_uploaded');
const badSource=structuredClone(videoProject);badSource.id='unsafe-source';badSource.sources=[{type:'drive',url:'https://other.test/folder'}];assert.equal((await call('/api/projects',{project:badSource})).status,400);
assert.equal((await call('/api/projects/no-project')).status,404);assert.equal((await call('/api/projects',{project:{...original,id:'../wrong'}})).status,400);
const csrf=await call('/api/projects',{project:{...original,id:'csrf'}},'POST',{Origin:'https://other.test'});assert.equal(csrf.status,400);
const blank={...structuredClone(original),id:'source-only-draft',title:'Nuevo video desde carpeta',assets:[],scenes:[{id:'empty-scene',mediaId:null,placeholder:true,start:0,duration:6,layers:[]}],audioTracks:[],captions:[],overlays:[],duration:6};assert.equal((await call('/api/projects',{project:blank})).status,201,'explicit placeholder draft can be saved');const invalidBlank=structuredClone(blank);invalidBlank.id='invalid-blank';delete invalidBlank.scenes[0].placeholder;assert.equal((await call('/api/projects',{project:invalidBlank})).status,400);
console.log(JSON.stringify({ok:true,checks:['independent cloud projects','reload exact saved record','duplicate creation protected','optimistic revision conflict','atomic concurrent saves','Drive/GitHub source metadata','missing media rejected','local media rejected','cross-origin mutation rejected'],cloud_projects:2,real_R2:'simulated with conditional-write adapter'}));

import {readFile,readdir,stat} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import assert from 'node:assert/strict';
import {validateProject} from '../dist/storage.js';
import * as M from '../dist/model.js';
import {applyReferenceStyle,createEditingBrief,detectCuts} from '../dist/reference.js';
const root=new URL('../',import.meta.url),dist=new URL('dist/',root);
for(const f of await readdir(dist))if(f.endsWith('.js')){const r=spawnSync(process.execPath,['--check',new URL(f,dist).pathname],{encoding:'utf8'});assert.equal(r.status,0,r.stderr);}
const p=JSON.parse(await readFile(new URL('doctor-v6.json',dist),'utf8'));validateProject(p);
assert.equal(p.scenes.length,28);assert.equal(p.captions.length,59);assert.equal(p.captions.flatMap(c=>c.words).length,172);
for(const a of p.assets){assert.ok(a.url&&!a.url.startsWith('/workspace'));const f=new URL(a.url,dist);assert.ok((await stat(f)).size>0);assert.ok((await stat(f)).size<24*1024*1024);}
let prior=0;for(const s of p.scenes){assert.ok(Math.abs(s.start-prior)<.001);prior=s.start+s.duration;assert.ok(p.assets.some(a=>a.id===s.mediaId));}assert.ok(Math.abs(prior-p.duration)<.001);
const q=M.clone(p);const id=q.scenes[1].id;M.resizeScene(q,id,3.6);validateProject(q);for(const c of q.captions)assert.ok(c.end>c.start&&c.words.every(w=>Number.isFinite(w.start)&&Number.isFinite(w.end)));
M.moveScene(q,id,0);assert.equal(q.scenes[0].id,id);M.duplicateScene(q,id);assert.equal(q.scenes.length,29);M.splitScene(q,id,q.scenes[0].start+1);assert.equal(q.scenes.length,30);M.removeScene(q,id);assert.equal(q.scenes.length,29);validateProject(q);
const parsed=M.parseSrt(M.srt(p),p);assert.equal(parsed.length,59);assert.equal(parsed.map(c=>c.text).join(' '),p.captions.map(c=>c.text).join(' '));
const analysis={estimatedShotSeconds:1.7,palette:['#112233','#D8BC83'],kind:'visual-cut-analysis-v1'};
const styled=applyReferenceStyle(p,analysis,{color:true,transitions:true,text:true,motion:true},[p.scenes[3].id]);assert.equal(JSON.stringify(p.scenes[0]),JSON.stringify(styled.project.scenes[0]));assert.equal(styled.project.script,p.script);assert.equal(JSON.stringify(styled.project.audioTracks),JSON.stringify(p.audioTracks));assert.notEqual(styled.project.scenes[3].transition.type,p.scenes[3].transition.type);
const brief=createEditingBrief({...p,comments:[{id:'test',sceneId:p.scenes[0].id,time:.5,text:'Mejorar la entrada',resolved:false}],voiceStale:true});assert.ok(brief.includes('Mejorar la entrada'));
const html=await readFile(new URL('index.html',dist),'utf8');const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length);
const result={ok:true,syntaxModules:true,sourceAssets:p.assets.length,scenes:28,captions:59,words:172,modelEdits:'passed',subtitleRoundtrip:'passed',referenceScope:'passed',uniqueDOMIds:ids.length,browserQA:'unverified: managed cua_repl tool unavailable',mediaExportQA:'MediaRecorder requires supported browser; not executed in Node'};console.log(JSON.stringify(result,null,2));

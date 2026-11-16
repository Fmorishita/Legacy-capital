"""Editable V9 composition. Final export refuses unreviewed Seedance slots."""
from pathlib import Path
import argparse,json,importlib.util,sys,re,subprocess,html,hashlib,shutil,os,copy
R=Path(__file__).resolve().parent;W=Path(os.environ.get('DOCTOR_V9_MEDIA_ROOT',R/'source_assets'));OUT=R/'project';A=OUT/'assets'
spec=importlib.util.spec_from_file_location('legacy',R/'engine/composition.py');B=importlib.util.module_from_spec(spec);spec.loader.exec_module(B);B.ROOT=R;B.OUT=OUT;B.FPS=30
sys.path.insert(0,str(R/'engine'));from motion_graphics import graphic_scene
def v9_local_link(src,dst):
 src=Path(src).resolve();dst=Path(dst);dst.parent.mkdir(parents=True,exist_ok=True)
 if dst.exists() and dst.resolve()==src:return
 if dst.exists() or dst.is_symlink():dst.unlink()
 dst.symlink_to(src)
B.local_link=v9_local_link
P=argparse.ArgumentParser();P.add_argument('--final',action='store_true');args=P.parse_args()
B.FONT_DEFAULT={k:str(W/'assets/brand/fonts'/v) for k,v in {'display':'OpenSans_Condensed_Bold.ttf','body':'OpenSans_Semibold.ttf','bold':'OpenSans_ExtraBold.ttf'}.items()}
words=json.load(open(R/'words_v9.json'));duration=60.7
jobs=json.load(open(R/'generation_plan.json'))['jobs'];review=json.load(open(R/'motion_review.json'))if (R/'motion_review.json').exists()else {}
shot_review=json.load(open(R/'shot_review.json')) if (R/'shot_review.json').exists() else {}
def selected(row):return shot_review.get(row['id'],review.get(row.get('seedance_job'),{}))
# start, source photo or native footage, generation ID, proposed source offset, kind, complementary title, caption top
plan=[
(0,'doc.jpg','01_medico',.20,'hook','',1180),
(3.06,'v07.jpg','03_roof_pareja_vista',.10,'photo','TU TIEMPO\nCUENTA',1240),
(4.42,'celebra.jpg','03b_celebracion_patrimonio',.35,'photo','CON VISIÓN\nDE FUTURO',1210),
(6.82,'native:terrain',None,0,'services','MENOS VUELTAS.\nMÁS CERCA.',1240),
(8.98,'native:marina',None,0,'services','',1240),
(11.06,'native:facade',None,0,'photo','ESPACIO PARA\nTUS PLANES',1230),
(12.54,'v27.jpg','02_recamara',.10,'photo','ADÁPTALA\nA TU VIDA',780),
(16.30,'v07.jpg','03_roof_pareja_vista',1.75,'photo','CONVIVE\nA TU RITMO',1240),
(19.38,'v08.jpg','04_alberca',.40,'photo','RECARGA\nTU ENERGÍA',1230),
(20.94,'v09.jpg','05_pickleball',.50,'photo','ACTÍVATE\nY CONECTA',1110),
(23.20,'asador.jpg','06_asador_amenidades',.10,'photo','HAZ\nNUEVOS PLANES',920),
(24.46,'v11.jpg','06_asador_amenidades',1.70,'photo','ALARGA\nLA SOBREMESA',760),
(26.28,'roofcena.jpg','07_cena_roof',.60,'photo','REÚNE A\nLOS TUYOS',780),
(27.88,'v13.jpg','08_planeacion_reserva',0,'photo','DISTRIBUYE\nEL DESEMBOLSO',930),
(30.08,None,None,0,'bridge0','',1210),
(31.34,None,None,0,'bridge1','',1210),
(33.20,None,None,0,'bridge2','',1210),
(36.96,None,None,0,'appreciation','',1210),
(39.16,'v19.jpg','09_renta',.60,'photo','APROVÉCHALA\nCUANDO NO ESTÉS',660),
(40.84,'v20.jpg','10_smart_home',.05,'photo','SIMPLIFICA\nLO COTIDIANO',550),
(43.24,'native:phone',None,0,'photo','',1160),
(44.88,'v21.jpg','10_smart_home',2.55,'photo','TU CASA,\nA UN TOQUE',550),
(47.18,'reserva.png','08_planeacion_reserva',2.30,'photo','ANTICIPA GASTOS\nDE EQUIPAMIENTO',550),
(48.88,'v22.jpg','11_equipamiento',0,'photo','',800),
(49.94,'v23.jpg','11_equipamiento',1.06,'photo','',800),
(50.52,'v24.jpg','11_equipamiento',1.64,'photo','',700),
(51.08,'roofeq.jpg','11_equipamiento',2.20,'photo','',1100),
(52.74,None,None,0,'promo','',1210),
(54.72,None,None,0,'cta','',1260),
(57.22,None,None,0,'advisor','',1260),
]
rows=[]
for i,(start,src,job,offset,kind,title,top)in enumerate(plan):
 rows.append({'id':f'v9-{i+1:02d}','start':start,'kind':kind,'headline':title,'support':'','caption_top':top,'hero_top':210,'source':src,'seedance_job':job,'proposed_source_in':offset,'focus':'50% 50%','camera':'locked'if job or(src and src.startswith('native:'))else None})
pending=[r['id'] for r in rows if r['seedance_job'] and not selected(r).get('accepted')]
if args.final and pending:raise SystemExit('FINAL BLOCKED: Existing-source review pending: '+', '.join(pending))
config={'shots':rows,'transition_seconds':.08,'brand':{'name':'Legacy Capital'},'price':{'range':'$3.9–$4.9 MDP','end':3.0},'_fonts':{k:Path(v)for k,v in B.FONT_DEFAULT.items()},'_logo_suffix':'.png','_logo_ratio':1.3033,'logo_width':150}
rows=B.load_shots(config,words,duration)
caption_positions={'v9-07':550,'v9-08':800,'v9-10':500,'v9-19':1300,'v9-20':1280,'v9-22':1350,'v9-03':1320}
for row in rows:row['caption_top']=caption_positions.get(row['id'],row['caption_top'])
# Hard cuts preserve complete source windows and the original montage continuity.
used_intervals={}
for i,row in enumerate(rows):
 if row['seedance_job']in {'08_planeacion_reserva','11_equipamiento'}or row['id'] in {'v9-04','v9-07','v9-20','v9-28','v9-29'}:
  row['end']=row['core_end'];row['duration']=row['end']-row['start'];row['transition_overlap']=0
 if i:row['entry_duration']=rows[i-1]['transition_overlap']
caps=B.caption_groups(words,rows,duration)
for key,p in B.FONT_DEFAULT.items():B.local_link(p,A/f'fonts/{key}.ttf')
B.local_link(W/'assets/brand/fonts/cinzel-latin-700-normal.woff2',A/'fonts/brand.woff2')
B.local_link(W/'assets/gsap.min.js',A/'gsap.min.js')
B.local_link(W/'assets/escudo_legacy_capital.png',A/'brand/legacy-transparent.png')
# All native cuts come from the supplied residential render or its original kit crop.
source_render=W/'source_render.mp4'
native={'walk':(source_render,7.15,2.40,1000),'terrain':(source_render,0,2.16,720),'marina':(source_render,11.17,2.08,1040),'facade':(source_render,2.20,1.48,650),'phone':(W/'assets/celular.mp4',.1,1.64,None)}
def cut_video(src,out,start,length,crop=None):
 signature={'source_sha256':B.sha(src),'start':round(start,6),'length':round(length,6),'crop_x':crop,'size':[1080,1920],'fps':30}
 cache=out.with_suffix('.cut.json')
 if out.exists() and cache.exists() and json.loads(cache.read_text())==signature:return
 out.parent.mkdir(parents=True,exist_ok=True)
 vf=(f'crop=608:1080:{crop}:0,'if crop is not None else '')+'scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,setsar=1,fps=30'
 subprocess.run(['ffmpeg','-v','error','-y','-ss',str(start),'-i',str(src),'-t',str(length),'-an','-vf',vf,'-c:v','libx264','-preset','fast','-crf','20','-pix_fmt','yuv420p',str(out)],check=True)
 cache.write_text(json.dumps(signature,indent=2))
def custom(row):
 sid=row['id'];d=row['duration'];kind=row['kind']
 css=B.base_css()+'''@font-face{font-family:LegacyBrand;src:url('assets/fonts/brand.woff2')}.panel{position:absolute;inset:0;background:#112D47}.copy{position:absolute;left:108px;width:864px;text-align:center;color:#F5F0E6;font-family:LegacyDisplay;line-height:1.02}.gold{color:#DFC88C}.detail{font-family:LegacyBody;font-size:32px;line-height:1.25}.line{overflow:hidden}.number{font-size:208px;color:#DFC88C}.brand{font-family:LegacyBrand;letter-spacing:2px}.arrow{font-size:65px;color:#DFC88C}.ring{position:absolute;border:2px solid #C5A564;border-radius:50%;width:1000px;height:1000px;left:40px;top:280px;opacity:.13}'''
 if kind=='promo':
  body=f'<div id="{sid}-ring" class="ring"></div><div class="copy" style="top:310px;font-size:65px">MENOS GASTOS<br><span class="gold">AL MUDARTE</span></div><div class="copy" style="top:580px"><div class="detail">AHORRO DE HASTA</div><div id="{sid}-num" class="number">$450,000</div><div class="detail">MXN · EQUIPAMIENTO INCLUIDO</div></div>'
  motion=f"tl.fromTo('#{sid}-num',{{scale:.72,y:45,opacity:0}},{{scale:1,y:0,opacity:1,duration:.45,ease:'back.out(1.6)'}},.35);tl.fromTo('#{sid}-ring',{{scale:.7}},{{scale:1.15,duration:{d},ease:'power1.out'}},0);"
 else:
  second=kind=='advisor';title='HABLEMOS DE<br><span class="gold">TUS PLANES</span>'if second else 'MÁS<br><span class="gold">INFORMACIÓN</span>'
  body=f'<div class="copy brand" style="top:360px;font-size:55px">LEGACY CAPITAL</div><div class="copy detail" style="top:440px;letter-spacing:8px">REAL ESTATE</div><div id="{sid}-copy" class="copy" style="top:650px;font-size:112px">{title}</div><div class="copy detail" style="top:970px">'+('WhatsApp<br><span class="gold" style="font-size:46px">+52 646 256 3006</span>'if second else f'Haz clic en el botón de abajo<br><span id="{sid}-arrow" class="arrow">↓</span>')+'</div>'
  motion=f"tl.fromTo('#{sid}-copy',{{y:35,opacity:0}},{{y:0,opacity:1,duration:.35,ease:'power4.out'}},.03);"
  if not second:motion+=f"tl.fromTo('#{sid}-arrow',{{y:-7}},{{y:10,duration:.40,yoyo:true,repeat:4,ease:'sine.inOut'}},.15);"
 return f'<template><style>{css}</style><div id="root" data-composition-id="{sid}" data-duration="{d}" data-width="1080" data-height="1920"><div id="{sid}-panel" class="panel clip" data-start="0" data-duration="{d}" data-track-index="0">{body}</div></div><script>const tl=gsap.timeline({{paused:true}});{motion}tl.set({{}},{{}},{d});window.__timelines=window.__timelines||{{}};window.__timelines["{sid}"]=tl;</script></template>'
for i,row in enumerate(rows):
 kind=row['kind'];src=row['source'];sid=row['id'];d=row['duration']
 if kind in ('bridge0','bridge1','bridge2','appreciation'):
  markup=graphic_scene(row,config)
  markup=markup.replace('font-size="27"','font-size="30"')
  if kind.startswith('bridge'):markup=markup.replace('Rangos de la lista · 10% diferido total, no mensual','10% total diferido')
  if kind=='appreciation':
   markup=markup.replace('PLUSVALÍA','POTENCIAL DE').replace('PROYECTADA.','CRECIMIENTO.');markup=markup.replace('font-size:88px','font-size:80px')
 elif kind in ('promo','cta','advisor'):markup=custom(row)
 else:
  is_video=False
  if src.startswith('native:'):
   name=src.split(':')[1];p,at,length,crop=native[name];dest=W/'native'/f'{name}.mp4';cut_video(p,dest,at,length+row['transition_overlap'],crop);row['local']=f'assets/clips/native-{name}.mp4';B.local_link(dest,OUT/row['local']);is_video=True
  elif selected(row).get('accepted'):
   checked=selected(row);path=Path(checked['file']);path=path if path.is_absolute() else R/path
   assert B.sha(path)==checked['sha256'],'Reviewed media hash changed'
   row['source_origin']=checked.get('origin','existing');row['source_id']=checked.get('source_id');row['source_kind']=checked.get('source_kind','video');row['source_review']=checked.get('review_note','')
   row['source']=checked.get('source_label',row['source'])
   if row['source_kind']=='photo':
    row['camera']='gentle';row['motion']='push-in';row['local']='assets/photos/'+path.name
    B.local_link(path,OUT/row['local']);row['intentional_native_render']=True
   else:
    probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(path)]));video=next(v for v in probe['streams'] if v['codec_type']=='video')
    assert video['width']==720 and abs(video['height']-1280)<=4,'Expected 720p portrait source'
    row['source_dimensions']=[video['width'],video['height']];row['composition_fit']='cover, preserving aspect ratio; final 720x1280'
    offset=float(checked.get('source_in',checked.get('windows',{}).get(sid,row['proposed_source_in'])))
    assert offset>=0 and offset+d<=float(video.get('duration',probe['format']['duration']))+1/30,'Source window exceeds verified media duration'
    digest=checked['sha256'];intervals=used_intervals.setdefault(digest,[])
    assert not any(max(offset,a)<min(offset+d,b)-1e-5 for a,b in intervals),'Repeated source frames across accepted clips'
    intervals.append((offset,offset+d));row['local']='assets/clips/'+path.name
    row['media_start']=offset;row['source_out']=offset+d
    B.local_link(path,OUT/row['local']);is_video=True
  else:
   path=W/'generation_refs'/src;row['local']='assets/photos/'+src;B.local_link(path,OUT/row['local']);row['fallback_still_pending_generation']=True
  if kind=='services':row['kind']='photo'
  markup=B.scene(row,i,config)
  markup=markup.replace('.accent{color:#C5A564}', '.accent{color:#DFC88C}')
  if row['headline'] and d<2.5:
   markup=re.sub(r"tl\.fromTo\('#"+re.escape(sid)+r"-headline \.hw'.*?;",f"tl.fromTo('#{sid}-headline',{{y:12,opacity:0}},{{y:0,opacity:1,duration:.17,ease:'power3.out'}},.02);",markup)
  if is_video:
   markup=re.sub(r'<img id="'+re.escape(sid)+r'-photo"[^>]*>',f'<video id="{sid}-video" class="photo clip" data-start="0" data-duration="{d}" data-media-start="{row.get("media_start",0)}" data-track-index="0" src="{row["local"]}" muted playsinline></video>',markup)
  if kind=='services':
   stats=[('HOSPITALES','~7 min'),('SORIANA','~3 min')]if 'terrain'in src else [('CETYS','~5 min'),('UABC / CICESE','~3–4 min')]
   card=''.join(f'<div style="width:412px;padding:18px 20px;background:rgba(17,45,71,.94);border:1px solid #C5A564;border-radius:16px;font:30px LegacyBody;color:#F5F0E6">{a}<br><strong style="font:58px LegacyDisplay;color:#E4C98B">{b}</strong></div>'for a,b in stats)
   extra=f'<div id="{sid}-services" class="clip" data-start="0" data-duration="{d}" data-track-index="6" style="position:absolute;left:108px;top:730px;display:flex;gap:20px">{card}</div><div style="position:absolute;top:920px;left:108px;color:#F5F0E6;font:30px LegacyBody;text-shadow:0 2px 6px black">Tiempos aproximados · sujetos a ruta y tráfico</div>'
   markup=markup.replace('</div></div><script>',extra+'</div></div><script>')
 markup=markup.replace('data-fps="24"','data-fps="30"');B.write(OUT/'compositions'/f'{sid}.html',markup)
caption_hosts=[]
for ci in range(0,len(rows),10):
 selected=copy.deepcopy(rows[ci:ci+10]);at=selected[0]['start'];end=rows[ci+10]['start'] if ci+10<len(rows) else duration;cd=end-at;cid=f'captions-part-{ci//10+1}'
 groups=copy.deepcopy([g for g in caps if at<=g['start']<end])
 for row in selected:row['start']-=at;row['entry_duration']=0
 for g in groups:
  g['start']-=at;g['end']=min(cd,g['end']-at)
  for word in g['words']:word['start']-=at;word['end']-=at
 markup=B.captions_html(groups,cd,config,selected).replace('legacy-captions',cid).replace('data-fps="24"','data-fps="30"')
 B.write(OUT/'compositions'/f'{cid}.html',markup);caption_hosts.append((cid,at,cd))
old_caption=OUT/'compositions/captions.html'
if old_caption.exists():old_caption.unlink()
B.write(OUT/'compositions/opening.html',B.opening(config).replace('DOCTOR · VISTA AL MAR','ENSENADA · EL SAUZAL').replace('data-fps="24"','data-fps="30"'))
logo=f'''<template><style>@font-face{{font-family:LegacyBrand;src:url('assets/fonts/brand.woff2')}}#root{{position:absolute;inset:0;pointer-events:none}}.lockup{{position:absolute;left:380px;top:1515px;width:320px;text-align:center;color:#F5F0E6;text-shadow:0 2px 6px rgba(0,0,0,.75)}}.crest{{display:block;width:94px;height:123px;margin:0 auto 11px;object-fit:contain}}.name{{font-family:LegacyBrand;font-size:28px;letter-spacing:1px;white-space:nowrap}}</style><div id="root" data-composition-id="legacy-small-logo" data-duration="{duration}" data-width="1080" data-height="1920"><div id="legacy-footer-lockup" class="lockup clip" data-start="0" data-duration="{duration}" data-track-index="0"><img id="legacy-footer-png" class="crest" src="assets/brand/legacy-transparent.png" alt="Legacy Capital"><div class="name">LEGACY CAPITAL</div></div></div><script>const tl=gsap.timeline({{paused:true}});tl.set({{}},{{}},{duration});window.__timelines=window.__timelines||{{}};window.__timelines['legacy-small-logo']=tl;</script></template>'''
B.write(OUT/'compositions/logo.html',logo)
montage=f'''<template><style>@font-face{{font-family:LegacyDisplay;src:url('assets/fonts/display.ttf')}}#root{{position:absolute;inset:0}}.t{{position:absolute;left:108px;top:215px;width:864px;color:#F5F0E6;font:82px/1.05 LegacyDisplay;text-shadow:0 3px 12px black}}</style><div id="root" data-composition-id="equipment-benefit" data-duration="3.86" data-width="1080" data-height="1920"><div id="equipment-overlay" class="t clip" data-start="0" data-duration="3.86" data-track-index="0"><div id="equipment-title">MENOS COMPRAS<br><span style="color:#DFC88C">DESPUÉS</span></div></div></div><script>const tl=gsap.timeline({{paused:true}});tl.fromTo('#equipment-title',{{y:20,opacity:0}},{{y:0,opacity:1,duration:.22,ease:'power3.out'}},0);tl.set({{}},{{}},3.86);window.__timelines=window.__timelines||{{}};window.__timelines['equipment-benefit']=tl;</script></template>''';B.write(OUT/'compositions/equipment.html',montage)
hosts=[]
for i,row in enumerate(rows):hosts.append(f'<div id="{row["id"]}" class="clip" data-composition-id="{row["id"]}" data-composition-src="compositions/{row["id"]}.html" data-start="{B.fmt(row["start"])}" data-duration="{B.fmt(row["duration"])}" data-track-index="{i%2}" data-track-kind="graphics" data-width="1080" data-height="1920" style="z-index:{i+1}"></div>')
for id,file,start,dur,track,z,kind in [('legacy-opening','opening',0,3.,3,80,'graphics'),('legacy-small-logo','logo',0,duration,6,100,'graphics'),('equipment-benefit','equipment',48.88,3.86,5,85,'graphics')]:hosts.append(f'<div id="{id}" class="clip" data-composition-id="{id}" data-composition-src="compositions/{file}.html" data-start="{start}" data-duration="{dur}" data-track-index="{track}" data-track-kind="{kind}" data-width="1080" data-height="1920" style="z-index:{z}"></div>')
for cid,at,cd in caption_hosts:hosts.append(f'<div id="{cid}" class="clip" data-composition-id="{cid}" data-composition-src="compositions/{cid}.html" data-start="{at}" data-duration="{cd}" data-track-index="4" data-track-kind="captions" data-width="1080" data-height="1920" style="z-index:90"></div>')
master=R/'audio/doctor_v9_mix.wav'
if not master.exists():master=W/'voz_Charon_norte_raw.wav'
B.local_link(master,A/'audio/master.wav');hosts.append(f'<audio id="v9-master" class="clip" src="assets/audio/master.wav" data-start="0" data-duration="{duration}" data-track-index="7" data-volume="1"></audio>')
B.write(OUT/'index.html',f'<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=1080,height=1920"><title>Doctor V9 · Legacy Capital · '+('Final'if args.final else 'Draft: existing source review')+f'</title><script src="assets/gsap.min.js"></script><style>*{{margin:0;box-sizing:border-box}}html,body{{width:1080px;height:1920px;overflow:hidden;background:#112D47}}#root{{position:absolute;inset:0}}</style></head><body><div id="root" data-composition-id="doctor-v9" data-duration="{duration}" data-width="1080" data-height="1920" data-fps="30">'+''.join(hosts)+'</div><script>window.__timelines=window.__timelines||{};window.__timelines["doctor-v9"]=gsap.timeline({paused:true});</script></body></html>')
cues=[]
for row in rows:
 k=row['kind'];offset={'bridge0':.61,'bridge1':.82,'bridge2':.67,'appreciation':1.09,'promo':.80}.get(k,.24 if row['headline']else .08)
 cues.append({'shot_id':row['id'],'kind':k,'time':row['start']+min(offset,row['duration']-.08),'cause':'payment_number'if k.startswith('bridge')else 'bonus_number'if k=='promo'else 'chart_line'if k=='appreciation'else 'cta'if k in('cta','advisor')else 'title_entry'if row['headline']else 'broll_transition'})
meta={'version':'Doctor-V9-Legacy-Capital','status':'final_ready'if args.final else 'draft_pending_existing_source_review','duration':duration,'fps':30,'frames':round(duration*30),'shots':rows,'words':words,'captions':caps,'cues':cues,'pending_source_slots':pending,'new_generations_enabled':False,'existing_video_sources_used':len(used_intervals),'native_render_slots':[r['id']for r in rows if r.get('intentional_native_render')],'voice_provider':'Gemini 3.8 Flash TTS via Treg','voice_cost_actual_usd':.013603,'removed':'18.33% expected return sentence and animation','logo':'Official transparent PNG, centered small bottom signature','headlines':'Complementary benefits; essential price/payment/CTA data remains explicit','source_render':str(source_render),'final_render_blocked':bool(pending)}
B.write(R/'timeline.json',json.dumps(meta,ensure_ascii=False,indent=2));B.write(OUT/'metadata.json',json.dumps(meta,ensure_ascii=False,indent=2));B.write(OUT/'hyperframes.json',json.dumps({'paths':{'blocks':'compositions','components':'compositions/components','assets':'assets'}}))
def stamp(t):
 n=round(t*1000);h,n=divmod(n,3600000);m,n=divmod(n,60000);s,n=divmod(n,1000);return f'{h:02}:{m:02}:{s:02},{n:03}'
B.write(R/'Doctor_V9.srt','\n\n'.join(f'{i+1}\n{stamp(c["start"])} --> {stamp(c["end"])}\n{c["text"]}'for i,c in enumerate(caps))+'\n')
B.write(OUT/'SPEC.md','# Doctor V9 · Legacy Capital · existing assets\n\n60.7s; 1080x1920 editable composition; 30fps; final export 720x1280. New voice retained, small centered transparent PNG logo, complementary benefit headlines, no 18.33% block.\n\nNew Higgsfield generation is disabled by the user. Only reviewed existing MCP/account files and original render footage are used. Two brief bedroom/bathroom cuts use native camera movement over existing renders. Raw 720p sources may inherit a two-pixel height difference; cover framing preserves aspect ratio in the exact final canvas.\n\nUse shot_review.json for actual source files, source-in offsets, hashes and provenance. Final assembly requires every selected source slot to be reviewed. The historical generation plan is not an authorization to create more clips.\n')
print(json.dumps({'status':meta['status'],'duration':duration,'shots':len(rows),'words':len(words),'caption_groups':len(caps),'pending_source_slots':len(pending)}))

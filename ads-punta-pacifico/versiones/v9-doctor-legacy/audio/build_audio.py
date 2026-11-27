"""Build the Legacy Doctor V9 master from continuous VO and visible-animation cues.

No retiming and no external calls. Relative file names make this script portable
with the delivered audio directory and final timeline.json.
"""
from pathlib import Path
import json, math, subprocess, argparse, hashlib
import numpy as np
from scipy.io.wavfile import write
from scipy.ndimage import uniform_filter1d, maximum_filter1d

ROOT=Path(__file__).resolve().parent
SR=48000
SFX={'small':'fast-small-sweep-166.mp3','short':'short-transition-sweep-175.mp3','air':'air-zoom-vacuum-2608.mp3','fast':'fast-whoosh-1490.mp3','cinematic':'cinematic-whoosh-fast-1492.mp3','impact':'quick-zoom-impact-772.mp3'}
CROP={'small':(.07,.22),'short':(.09,.23),'air':(.18,.30),'fast':(.18,.34),'cinematic':(.28,.36),'impact':(.055,.19)}

def decode(path, seconds=None, start=None):
    args=['ffmpeg','-v','error']
    if start is not None: args+=['-ss',str(start)]
    args+=['-i',str(path)]
    if seconds is not None: args+=['-t',str(seconds)]
    args+=['-ar',str(SR),'-ac','2','-f','f32le','-']
    return np.frombuffer(subprocess.check_output(args),np.float32).reshape(-1,2).copy()

def fit(a,n): return np.pad(a,((0,max(0,n-len(a))),(0,0)))[:n]
def pcm(path,a): write(path,SR,(np.clip(a,-.9999,.9999)*32767).astype(np.int16))
def sha(path): return hashlib.sha256(path.read_bytes()).hexdigest()

def measure(path):
    r=subprocess.run(['ffmpeg','-hide_banner','-i',str(path),'-af','loudnorm=I=-15:TP=-1.2:LRA=9:print_format=json','-f','null','-'],stderr=subprocess.PIPE,text=True,check=True)
    return json.JSONDecoder().raw_decode(r.stderr[r.stderr.rfind('{'):])[0]

def crop_fx(name):
    path=ROOT/'sfx'/SFX[name];a=decode(path)
    source_peak=np.abs(a).max(axis=1).argmax()
    before,after=CROP[name];lo=max(0,source_peak-round(before*SR));hi=min(len(a),source_peak+round(after*SR))
    a=a[lo:hi].copy();fade=min(round(.014*SR),len(a)//3)
    if fade:
        a[:fade]*=np.linspace(0,1,fade)[:,None];a[-fade:]*=np.linspace(1,0,fade)[:,None]
    peak=np.abs(a).max(axis=1).argmax()/SR
    return a,peak,lo/SR,hi/SR

def select_effect(cause,i):
    c=cause.lower()
    if any(w in c for w in ['payment','porcentaje','percent','number','ahorro','saving','450']):return 'impact',.135
    if any(w in c for w in ['cta','brand','logo','legacy']):return 'cinematic',.12
    if any(w in c for w in ['map','ruta','location','ubicaci']):return 'air',.095
    if any(w in c for w in ['smart','luces','cerradura','digital','control']):return 'small',.065
    return ['small','short','air','fast','cinematic','impact'][i%6],.085

def main():
    parser=argparse.ArgumentParser();parser.add_argument('--timeline',type=Path,default=ROOT.parent/'timeline.json');args=parser.parse_args()
    voice_meta=json.loads((ROOT/'doctor_v9_voice.json').read_text());duration=voice_meta['duration'];n=round(duration*SR)
    timeline=json.loads(args.timeline.read_text())
    assert abs(float(timeline.get('duration',duration))-duration)<1/SR
    voice=fit(decode(ROOT/'doctor_v9_voice.wav'),n)
    music_file=ROOT/'music'/'i-can-hear-your-heartbeat-1000.mp3';music_start=30.72;music_gain=-10.5
    bed=fit(decode(music_file,start=music_start,seconds=duration+.1),n)
    rms=np.sqrt(np.mean(voice*voice,axis=1));env=uniform_filter1d(rms,size=round(.06*SR))
    active=(env>.012).astype(np.float32)
    activity=uniform_filter1d(maximum_filter1d(active,size=round(.20*SR)),size=round(.18*SR))
    t=np.arange(n)/SR;duck=.80+.20*(1-activity)
    fade=np.minimum(1,t/.04)*np.minimum(1,np.maximum(0,(duration-t)/.7))
    focus=np.ones(n,dtype=np.float32)
    # Financial details deserve a little extra room around the voice.
    focus[(t>=27.88)&(t<=36.96)]=.84
    focus[(t>=54.72)&(t<=57.22)]=.90
    bed*=((10**(music_gain/20))*duck*fade*focus)[:,None]
    effects=np.zeros((n,2),np.float32);events=[]
    cues=timeline.get('cues',[])
    assert cues,'timeline must provide visible animation cues before final audio is built'
    def cue_priority(c):
        label=c.get('cause',c.get('type','')).lower()
        return int(c.get('priority',3 if any(w in label for w in ['payment','percent','porcentaje','number','ahorro','saving','450']) else 2 if any(w in label for w in ['cta','brand','logo','legacy','smart']) else 1))
    chosen=[]
    for cue in sorted(cues,key=lambda c:(-cue_priority(c),float(c.get('time',c.get('at',0))))):
        at=float(cue.get('time',cue.get('at',0)))
        if .12<=at<=duration-.25 and not any(abs(float(c.get('time',c.get('at',0)))-at)<.38 for c in chosen):chosen.append(cue)
    for i,cue in enumerate(sorted(chosen,key=lambda c:float(c.get('time',c.get('at',0))))):
        at=float(cue.get('time',cue.get('at',0)));cause=cue.get('cause',cue.get('type','visible animation reveal'))
        if at<.12 or at>duration-.25:continue
        if any(abs(e['peak_at']-at)<.38 for e in events):continue
        name,level=select_effect(cause,i)
        name=cue.get('effect',name);level=float(cue.get('target_peak',level))
        if name not in SFX:raise ValueError(f'unknown effect {name}')
        fx,peak,lo,hi=crop_fx(name);gain=level/max(.001,float(np.abs(fx).max()));start=at-peak
        a=round(start*SR);src=max(0,-a);dst=max(0,a);count=min(n-dst,len(fx)-src)
        if count>0:effects[dst:dst+count]+=fx[src:src+count]*gain
        events.append({'shot':cue.get('shot',cue.get('shot_id')),'cause':cause,'effect':SFX[name],'source_path':'sfx/'+SFX[name],'source_crop_start':round(lo,6),'source_crop_end':round(hi,6),'source_peak_after_crop':round(peak,6),'start':round(start,6),'peak_at':round(at,6),'picture_landing_at':round(at,6),'target_peak_before_master':level,'gain':gain})
    assert len(events)>=6,'too few visible-cause sound events for this long ad'
    music_stem=ROOT/'doctor_v9_music_edit.wav';sfx_stem=ROOT/'doctor_v9_effects.wav'
    pcm(music_stem,bed);pcm(sfx_stem,effects)
    # Mix delivered PCM stems, so their sum is the reproducible premaster input.
    mix=voice+decode(music_stem)+decode(sfx_stem)
    pre=ROOT/'doctor_v9_premaster_work.wav';write(pre,SR,mix.astype(np.float32));m=measure(pre)
    filters=(f"loudnorm=I=-15:TP=-1.2:LRA=9:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true,atrim=duration={duration},apad=whole_dur={duration}")
    master=ROOT/'doctor_v9_mix.wav'
    subprocess.run(['ffmpeg','-v','error','-y','-i',str(pre),'-af',filters,'-ar',str(SR),'-ac','2','-c:a','pcm_s16le',str(master)],check=True)
    final=measure(master);decoded=decode(master)
    assert len(decoded)==n,(len(decoded),n)
    assert float(final['input_tp'])<=-1.0,final
    assert abs(float(final['input_i'])+15)<.5,final
    data={'profile':'doctor','brand':'Legacy Capital','version':'V9 Legacy','duration':duration,'fps':30,'sample_rate':SR,'sample_count':n,'voice_path':'doctor_v9_voice.wav','mix_path':str(master),'music_stem_path':str(music_stem),'sfx_stem_path':str(sfx_stem),'words_path':'../words_v9.json','voice_config':voice_meta['voice_config'],'narration_offset':voice_meta.get('narration_offset',0),'text':voice_meta['text'],'words':voice_meta['words'],'captions':voice_meta['captions'],'music':{'file':'music/'+music_file.name,'title':'I Can Hear Your Heartbeat','artist':'Michael Ramir C.','source_url':'https://assets.mixkit.co/music/1000/1000.mp3','bpm':125,'in':music_start,'gain_db':music_gain,'tempo_changed':False,'voice_duck':'.80–1.00 with 60ms RMS and smoothed release','fade_in':.04,'fade_out':.70},'sfx_events':events,'mastering':{'input_measurement':m,'filter':filters,'output_measurement':final,'target_lufs':-15,'target_true_peak_dbtp':-1.2,'stems':'pre-master PCM16 components; sum then apply shared mastering filter, do not play master together with stems'},'loudness':{'integrated_lufs':float(final['input_i']),'true_peak_dbtp':float(final['input_tp']),'lra':float(final['input_lra'])},'files':[{'file':x.name,'bytes':x.stat().st_size,'sha256':sha(x)} for x in [ROOT/'doctor_v9_voice.wav',master,music_stem,sfx_stem]],'qa':{'full_decode':True,'matching_duration':True,'clip_free_peak':True,'speech_retimed':False,'human_listening_review':False},'timeline_source':str(args.timeline),'timeline_sha256':sha(args.timeline)}
    (ROOT/'doctor_v9_audio.json').write_text(json.dumps(data,ensure_ascii=False,indent=2))
    pre.unlink()
    print(json.dumps({'duration':duration,'events':len(events),'music':music_file.name,'loudness':data['loudness'],'mix':str(master)},ensure_ascii=False),flush=True)

if __name__=='__main__':main()

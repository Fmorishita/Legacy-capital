from pathlib import Path
import asyncio, edge_tts, json, os, subprocess, html, math, re
import numpy as np
from scipy.io.wavfile import write

ROOT = Path(__file__).resolve().parent
FPS, SR = 24, 48000
CFG = {'voice': 'es-MX-JorgeNeural', 'rate': '+3%', 'pitch': '+0Hz'}

def norm(s):
    return re.sub(r'[^a-záéíóúüñ0-9]', '', s.lower())

def stamp(t):
    v=round(t*1000)
    return f'{v//3600000:02}:{v//60000%60:02}:{v//1000%60:02},{v%1000:03}'

def captions(words, duration):
    groups, buf = [], []
    def emit():
        if buf:
            groups.append(list(buf)); buf.clear()
    for w in words:
        if buf and (len(buf)>=4 or len(' '.join(x['text'] for x in buf+[w]))>25 or w['start']-buf[-1]['end']>.38):
            emit()
        buf.append(w)
        if w['text'][-1:] in '.?!;:': emit()
    emit()
    out=[]
    for i, group in enumerate(groups):
        nxt=groups[i+1][0]['start'] if i+1<len(groups) else duration-.1
        end=min(group[-1]['end']+.13,nxt-.02)
        out.append({'text':' '.join(w['text'] for w in group), 'start':group[0]['start'], 'end':round(max(end,group[-1]['end']),6), 'words':group})
    return out

async def main():
    text=next(p.strip() for p in (ROOT/'Guion_locucion_V6.md').read_text().split('\n\n') if p.strip().startswith('Doctor,'))
    rawpath=ROOT/'doctor_v6_raw.mp3'
    words=[]
    comm=edge_tts.Communicate(text,boundary='WordBoundary',proxy=os.environ.get('HTTPS_PROXY'),**CFG)
    with rawpath.open('wb') as f:
        async for chunk in comm.stream():
            if chunk['type']=='audio': f.write(chunk['data'])
            elif chunk['type']=='WordBoundary':
                words.append({'text':html.unescape(chunk['text']), 'start':chunk['offset']/1e7, 'end':(chunk['offset']+chunk['duration'])/1e7})
    rawdur=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',str(rawpath)]))
    raw={'voice':CFG,'text':text,'raw_voice_path':str(rawpath),'raw_duration':rawdur,'words':words,'provider':'Microsoft Edge TTS, existing free synthesis mechanism used in V5','continuous':True}
    (ROOT/'doctor_v6_voice_raw.json').write_text(json.dumps(raw,ensure_ascii=False,indent=2))
    tokens=text.split()
    assert len(tokens)==len(words),(len(tokens),len(words))
    offset=.12-words[0]['start']
    aligned=[]
    for token,w in zip(tokens,words):
        assert norm(token)==norm(w['text']),(token,w)
        aligned.append({'text':token,'start':round(w['start']+offset,6),'end':round(w['end']+offset,6)})
    duration=math.ceil(max(rawdur+offset,aligned[-1]['end']+.7)*FPS)/FPS
    samples=round(duration*SR)
    arr=np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-i',str(rawpath),'-af','highpass=f=75,acompressor=threshold=0.125:ratio=2.1:attack=10:release=80:makeup=1.6:knee=2.2','-ar',str(SR),'-ac','2','-f','f32le','-']),np.float32).reshape(-1,2)
    voice=np.zeros((samples,2),np.float32)
    i=round(offset*SR);srcstart=max(0,-i);dststart=max(0,i);n=min(samples-dststart,len(arr)-srcstart)
    voice[dststart:dststart+n]=arr[srcstart:srcstart+n]
    voicepath=ROOT/'doctor_v6_voice.wav'
    write(voicepath,SR,(np.clip(voice,-.999,.999)*32767).astype(np.int16))
    caps=captions(aligned,duration)
    data={'profile':'doctor','brand':'Legacy Capital','version':'V6 Legacy, distinct from rejected V6 Higgsfield experiment','duration':duration,'fps':FPS,'sample_rate':SR,'channels':2,'sample_count':samples,'text':text,'voice_config':CFG,'narration_offset':round(offset,6),'voice_path':str(voicepath),'raw_path':str(rawpath),'words':aligned,'captions':caps,'continuous':True,'retimed':False,'review':'Measured and decoded; no human listening claimed. New continuous synthesis. Captions must be split again at final image cuts.'}
    (ROOT/'doctor_v6_voice.json').write_text(json.dumps(data,ensure_ascii=False,indent=2))
    (ROOT/'doctor_v6_words.json').write_text(json.dumps(aligned,ensure_ascii=False,indent=2))
    (ROOT/'doctor_v6.srt').write_text('\n\n'.join(f"{i+1}\n{stamp(c['start'])} --> {stamp(c['end'])}\n{c['text']}" for i,c in enumerate(caps))+'\n')
    print(json.dumps({'duration':duration,'raw_duration':rawdur,'words':len(aligned),'captions':len(caps),'offset':offset,'last_words':aligned[-10:]},ensure_ascii=False),flush=True)

if __name__=='__main__': asyncio.run(main())

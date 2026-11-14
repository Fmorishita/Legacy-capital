#!/usr/bin/env python3
"""Execution helper for ChatGPT/Codex. Existing Site access arrives on stdin.

This helper does not call a paid model. The assistant generates media with its
available tools, uploads the real files and submits the completed project.
"""
import argparse,asyncio,base64,hashlib,json,mimetypes,os,sys,termios,urllib.parse,urllib.request
from pathlib import Path
def access():
 if sys.stdin.isatty():
  flags=termios.tcgetattr(sys.stdin);flags[3]&=~termios.ECHO;termios.tcsetattr(sys.stdin,termios.TCSANOW,flags)
  print('Ready for private Site access JSON on stdin (input hidden).',flush=True)
 value=json.loads(sys.stdin.readline());return value['url'].rstrip('/'),value['token']
def connection(origin,token):
 def call(path,body=None,method=None):
  data=json.dumps(body).encode() if body is not None else None
  req=urllib.request.Request(origin+path,data=data,method=method or ('POST' if data else 'GET'),headers={'OAI-Sites-Authorization':'Bearer '+token,**({'Content-Type':'application/json'} if data else {})})
  with urllib.request.urlopen(req,timeout=90) as response:return json.load(response)
 def rpc(name,args):
  result=call('/api/agent-tools',{'tool':name,'arguments':args})
  if result.get('error'):raise ValueError(result['error'])
  return result
 return call,rpc
async def tts(args):
 try:import edge_tts
 except ImportError:raise SystemExit('Instala el cliente gratuito: python -m pip install edge-tts')
 text=args.script.read_text().strip();args.out.parent.mkdir(parents=True,exist_ok=True);words=[]
 communication=edge_tts.Communicate(text,voice=args.voice,rate=args.rate,boundary='WordBoundary',proxy=os.environ.get('HTTPS_PROXY') or os.environ.get('https_proxy'))
 with args.out.open('wb') as audio:
  async for event in communication.stream():
   if event['type']=='audio':audio.write(event['data'])
   elif event['type']=='WordBoundary':words.append({'text':event['text'],'start':event['offset']/10000000,'end':(event['offset']+event['duration'])/10000000})
 metadata={'text':text,'voice_config':{'voice':args.voice,'rate':args.rate},'words':words,'provider':'Edge TTS client','note':'Mide el audio y realinea escenas/subtítulos antes de entregar; los límites son los reportados por el proveedor.'}
 args.out.with_suffix('.words.json').write_text(json.dumps(metadata,ensure_ascii=False,indent=2)+'\n');print(json.dumps({'audio':str(args.out),'words':str(args.out.with_suffix('.words.json')),'word_count':len(words),'bytes':args.out.stat().st_size}))
def main():
 parser=argparse.ArgumentParser(description=__doc__);sub=parser.add_subparsers(dest='command',required=True)
 get=sub.add_parser('download');get.add_argument('--request',required=True);get.add_argument('--out',type=Path,required=True)
 upload=sub.add_parser('upload');upload.add_argument('--request',required=True);upload.add_argument('--file',type=Path,required=True);upload.add_argument('--name');upload.add_argument('--mime')
 submit=sub.add_parser('submit');submit.add_argument('--request',required=True);submit.add_argument('--project',type=Path,required=True);submit.add_argument('--summary',required=True);submit.add_argument('--completed-comments',nargs='*',default=[])
 voice=sub.add_parser('tts');voice.add_argument('--script',type=Path,required=True);voice.add_argument('--out',type=Path,required=True);voice.add_argument('--voice',default='es-MX-JorgeNeural');voice.add_argument('--rate',default='+3%')
 args=parser.parse_args()
 if args.command=='tts':return asyncio.run(tts(args))
 origin,token=access();call,rpc=connection(origin,token)
 if args.command=='download':
  job=rpc('legacy_get_ai_request',{'request_id':args.request,'include_project':True});args.out.mkdir(parents=True,exist_ok=True);(args.out/'request.json').write_text(json.dumps(job,ensure_ascii=False,indent=2)+'\n');(args.out/'project.json').write_text(json.dumps(job['project'],ensure_ascii=False,indent=2)+'\n');print(json.dumps({'request':str(args.out/'request.json'),'project':str(args.out/'project.json')}))
 elif args.command=='upload':
  data=args.file.read_bytes();mime=args.mime or mimetypes.guess_type(args.file.name)[0] or 'application/octet-stream';start=rpc('legacy_begin_asset_upload',{'request_id':args.request,'name':args.name or args.file.name,'mime_type':mime,'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest()})
  for index,offset in enumerate(range(0,len(data),196608)):rpc('legacy_upload_asset_chunk',{'request_id':args.request,'upload_id':start['upload_id'],'index':index,'data_base64':base64.b64encode(data[offset:offset+196608]).decode()})
  result=rpc('legacy_finish_asset_upload',{'request_id':args.request,'upload_id':start['upload_id']});print(json.dumps(result,ensure_ascii=False))
 elif args.command=='submit':
  project=json.loads(args.project.read_text());project=project.get('project',project) if project.get('format')=='legacy-video-studio' else project;print(json.dumps(rpc('legacy_submit_ai_result',{'request_id':args.request,'project':project,'summary':args.summary,'completed_comment_ids':args.completed_comments}),ensure_ascii=False))
if __name__=='__main__':main()

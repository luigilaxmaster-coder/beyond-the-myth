import pathlib,json,subprocess,concurrent.futures,time,shutil,re,hashlib
R=pathlib.Path(__file__).resolve().parents[2];O=pathlib.Path(__file__).parent
E=json.loads((O/'production_scripts.json').read_text(encoding='utf8'))['episodes']
DEST=pathlib.Path('G:/My Drive/Videos Youtube');DAY=DEST/'2026-10-16'
def command(cmd,log):
 with log.open('w',encoding='utf8') as f:
  p=subprocess.run(list(map(str,cmd)),stdout=f,stderr=subprocess.STDOUT)
 if p.returncode:raise RuntimeError(f'Failed {cmd[0]}: {log}')
def probe(p):
 return json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(p)],text=True))
def sha(p):
 h=hashlib.sha256()
 with p.open('rb') as f:
  for b in iter(lambda:f.read(1048576),b''):h.update(b)
 return h.hexdigest()
def run(e):
 d=R/('beyond_the_myth_'+e['episode_id']);q=d/'qa';rend=d/'renders';start=time.time()
 while True:
  try:check=json.loads((q/'check.json').read_text(encoding='utf-8-sig'));review=json.loads((q/'visual_review.json').read_text(encoding='utf8'))
  except (FileNotFoundError,json.JSONDecodeError):check={};review={}
  ready=check.get('ok') and review.get('approved') and all(v.get('errorCount',0)==0 and v.get('warningCount',0)==0 for v in check.values() if isinstance(v,dict))
  if ready:break
  if time.time()-start>1800:raise RuntimeError(f'QA not approved: {e["episode_id"]}')
  time.sleep(4)
 v=rend/'visual.mp4'
 if not v.exists():
  command(['C:/Program Files/nodejs/npx.cmd','hyperframes','preview',d,'--background'],q/'preview.log')
  print('RENDER START',e['episode_id'],flush=True)
  command(['C:/Program Files/nodejs/npx.cmd','hyperframes','render',d,'-o',v,'--fps','30','--quality','delivery','--workers','2','--gpu'],q/'render.log')
 vp=probe(v);vs=next(s for s in vp['streams'] if s['codec_type']=='video')
 assert (vs['width'],vs['height'],vs['r_frame_rate'],int(vs['nb_frames']))==(1080,1920,'30/1',1800),vs
 name='BEYOND_THE_MYTH_S02_EP'+e['episode_num']+'_'+re.sub(r'[^A-Za-z0-9]+','_',e['title']).strip('_')+'.mp4'
 final=rend/name
 command(['ffmpeg','-y','-i',v,'-i',d/'assets/audio/master.wav','-map','0:v:0','-map','1:a:0','-c:v','copy','-c:a','aac','-b:a','192k','-ac','2','-ar','44100','-t','60','-movflags','+faststart',final],q/'mux.log')
 p=probe(final);vs=next(s for s in p['streams'] if s['codec_type']=='video');au=next(s for s in p['streams'] if s['codec_type']=='audio')
 assert float(p['format']['duration'])==60.,p['format']['duration']
 assert au['codec_name']=='aac' and au['channels']==2
 assert vs['r_frame_rate']=='30/1' and int(vs['nb_frames'])==1800
 digest=sha(final)
 for dest in [DEST/name,DAY/name]:
  if dest.exists() and sha(dest)!=digest:raise RuntimeError(f'Destination exists with different contents: {dest}')
  if not dest.exists():shutil.copy2(final,dest)
  assert sha(dest)==digest
 result=dict(episode=e['episode_id'],season_episode=e['episode_num'],title=e['title'],file=name,local=str(final),drive=str(DEST/name),dated=str(DAY/name),sha256=digest,bytes=final.stat().st_size,duration=60.,fps='30/1',frames=1800,width=1080,height=1920,audio_codec='aac',audio_channels=2,contrast_passed=check['contrast']['passed'],contrast_checked=check['contrast']['checked'])
 (q/'delivery.json').write_text(json.dumps(result,indent=2),encoding='utf8');(q/'ffprobe.json').write_text(json.dumps(p,indent=2),encoding='utf8')
 print('DELIVERED',e['episode_id'],name,flush=True);return result
with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
 results=list(pool.map(run,E))
(O/'delivery_manifest.json').write_text(json.dumps(results,indent=2),encoding='utf8')
shutil.copy2(O/'delivery_manifest.json',DAY/'delivery_manifest.json')
print('ALL TEN DELIVERED',flush=True)

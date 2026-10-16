import pathlib,json,subprocess,concurrent.futures,time
R=pathlib.Path(__file__).resolve().parents[2];O=pathlib.Path(__file__).parent
# This postpass targets mechanical compliance; it never homogenizes episode art direction.
p=R/'beyond_the_myth_ep011/index.html';s=p.read_text(encoding='utf8');s=s.replace('</style>','.crown{background:#0a192f;width:350px;padding-left:20px}.brand{background:#0a192f;padding:15px 20px}</style>');p.write_text(s,encoding='utf8')
def check(n):
 d=R/f'beyond_the_myth_ep{n:03}';at=[.5,2,8,18,28,39,49,57,59.966]
 while not all((d/f'assets/images/scene_{i}.png').exists() for i in range(1,5)):time.sleep(5)
 for i in range(1,5):
  p=d/f'assets/images/scene_{i}.png';j=p.with_suffix('.jpg')
  if not j.exists():subprocess.run(['ffmpeg','-y','-v','error','-i',str(p),'-vf','scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920','-q:v','2',str(j)],check=True)
 s=(d/'index.html').read_text(encoding='utf8')
 for i in range(1,5):s=s.replace(f'images/scene_{i}.png',f'images/scene_{i}.jpg')
 (d/'index.html').write_text(s,encoding='utf8')
 cmd=['C:/Program Files/nodejs/npx.cmd','hyperframes','check',str(d),'--json','--at',','.join(map(str,at))]
 p=subprocess.run(cmd,capture_output=True,text=True,encoding='utf8',errors='replace')
 (d/'qa/check.json').write_text(p.stdout,encoding='utf8');(d/'qa/check.stderr.log').write_text(p.stderr,encoding='utf8')
 try:
  a=json.loads(p.stdout);summary={'ep':n,'ok':a.get('ok'),'results':{k:{key:v for key,v in z.items() if key in ['ok','errorCount','warningCount','checked','passed']} for k,z in a.items() if isinstance(z,dict)},'findings':[(k,f) for k,z in a.items() if isinstance(z,dict) for f in z.get('findings',[])]}
 except Exception:summary={'ep':n,'error':p.stdout[-2000:],'stderr':p.stderr[-1000:]}
 (O/f'qa_summary_{n}.json').write_text(json.dumps(summary,indent=2),encoding='utf8');print(json.dumps(summary,ensure_ascii=True),flush=True)
 return summary
with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:results=list(pool.map(check,range(11,21)))
(O/'checks_summary.json').write_text(json.dumps(results,indent=2))

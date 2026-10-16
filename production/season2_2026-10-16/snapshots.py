import pathlib,json,subprocess,concurrent.futures
R=pathlib.Path(__file__).resolve().parents[2];O=pathlib.Path(__file__).parent
E=json.loads((O/'production_scripts.json').read_text(encoding='utf8'))['episodes']
def run(e):
 d=R/('beyond_the_myth_'+e['episode_id']);times=[round((s['start']+s['end'])/2,3) for s in e['scenes']]+[59.966]
 p=subprocess.run(['C:/Program Files/nodejs/npx.cmd','hyperframes','snapshot',str(d),'--at',','.join(map(str,times))],capture_output=True,text=True,encoding='utf8',errors='replace')
 (d/'qa/snapshot.log').write_text(p.stdout+p.stderr,encoding='utf8');print(e['episode_id'],p.returncode,flush=True)
 return e['episode_id'],p.returncode
with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool: print(list(pool.map(run,E)))

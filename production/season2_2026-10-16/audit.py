import pathlib,json,hashlib,re,itertools
import numpy as np
from PIL import Image
from scipy.io import wavfile
R=pathlib.Path(__file__).resolve().parents[2];O=pathlib.Path(__file__).parent
rows=[];images=[];motions=[]
original=json.loads((R/'scripts/season_02_scripts.json').read_text(encoding='utf8'))['episodes']
for n,e in zip(range(11,21),original):
 d=R/f'beyond_the_myth_ep{n:03}';a=json.loads((d/'qa/audio.json').read_text());c=json.loads((d/'qa/check.json').read_text(encoding='utf-8-sig'))
 assert c['ok'] and not c.get('browserSkipped')
 assert c['contrast']['checked']>0 and c['contrast']['checked']==c['contrast']['passed']
 assert all(v.get('errorCount',0)==0 and v.get('warningCount',0)==0 for v in c.values() if isinstance(v,dict))
 assert [(s['start'],s['end'],s['speaker']) for s in a['scenes']]==[(s['start'],s['end'],s['speaker']) for s in e['scenes']]
 sr,wav=wavfile.read(d/'assets/audio/master.wav');assert sr==44100 and wav.shape==(2646000,2) and wav.dtype==np.int16
 peak=float(np.max(np.abs(wav.astype(np.float64)))/32768);assert peak<.98
 assert abs(a['minimum_music_gain']-10**(-12/20))<1e-8
 assert all(s['actual_end']<=s['end'] for s in a['scenes'])
 for i in range(1,5):
  p=d/f'assets/images/scene_{i}.jpg';im=Image.open(p);assert im.size==(1080,1920)
  small=np.array(im.convert('L').resize((9,8)));dh=''.join('1' if v else '0' for v in (small[:,1:]>small[:,:-1]).flatten())
  images.append(dict(episode=n,scene=i,sha256=hashlib.sha256(p.read_bytes()).hexdigest(),dhash=dh,size=im.size))
 code=(d/'index.html').read_text(encoding='utf8');script=code.split('<script>')[-1].split('</script>')[0]
 motions.append(dict(episode=n,sha256=hashlib.sha256(script.encode()).hexdigest()))
 rows.append(dict(episode=n,hyperframes='0.8.164',errors=0,warnings=0,contrast_checked=c['contrast']['checked'],contrast_passed=c['contrast']['passed'],audio_peak_dbfs=round(20*np.log10(peak),2),sample_rate=sr,samples=len(wav),exact_script_cues=True))
assert len({x['sha256'] for x in images})==40
assert len({x['sha256'] for x in motions})==10
nearest=min((sum(a!=b for a,b in zip(x['dhash'],y['dhash'])),x['episode'],x['scene'],y['episode'],y['scene']) for x,y in itertools.combinations(images,2))
report=dict(episodes=rows,unique_photographic_plates=40,images=images,distinct_motion_programs=motions,closest_dhash_pair=nearest,notes=['Shared GSAP engine and subtitle timing mechanics are infrastructure. Each episode has a separately authored visual structure and motion program.','Contrast percentage describes all sampled text checks, not a claim that every encoded pixel at every instant was measured.','AI images are illustrations, not original historical records.','MP4 interactions are demonstrated automatically; the buttons are available in editable HyperFrames compositions.'])
(O/'technical_audit.json').write_text(json.dumps(report,indent=2),encoding='utf8')
print('AUDIT PASSED: 40 unique 1080x1920 plates; 10 independent motion programs; all cue windows exact; 10 WAVs exactly 2646000 stereo samples; no check findings.');print('Closest image dhash:',nearest);print('Contrast:',sum(x['contrast_passed'] for x in rows),'/',sum(x['contrast_checked'] for x in rows))

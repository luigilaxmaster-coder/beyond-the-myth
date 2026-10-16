import pathlib,re,subprocess,json
R=pathlib.Path(__file__).resolve().parents[2]
for n in range(11,21):
 d=R/f'beyond_the_myth_ep{n:03}'
 for i in range(1,5):
  p=d/f'assets/images/scene_{i}.png';j=p.with_suffix('.jpg')
  if p.exists() and not j.exists():
   subprocess.run(['ffmpeg','-y','-v','error','-i',str(p),'-vf','scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920','-q:v','2',str(j)],check=True)
 h=(d/'index.html').read_text(encoding='utf8')
 h=h.replace('letterSpacing:15','scaleX:1.07')
 for i in range(1,5):
  if (d/f'assets/images/scene_{i}.jpg').exists():h=h.replace(f'images/scene_{i}.png',f'images/scene_{i}.jpg')
 count=[0]
 def tag(m):
  s=m.group(0)
  if 'data-start=' not in s:return s
  count[0]+=1
  if not re.search(r'\bid=',s):s=s[:-1]+f' id="timed-{count[0]}">'
  if 'titleline' in s or 'citation' in s:s=re.sub(r'data-track-index="\d+"',f'data-track-index="{30+count[0]}"',s)
  return s
 h=re.sub(r'<(?:div|h2)\b[^>]*>',tag,h)
 (d/'index.html').write_text(h,encoding='utf8')
print('Normalized media and fixed editable ids / motion.')

import asyncio,json,pathlib,subprocess,sys,math
import numpy as np
from scipy.io import wavfile
from scipy.ndimage import maximum_filter1d
from scipy.signal import lfilter
import edge_tts
ROOT=pathlib.Path(__file__).resolve().parents[2]
OUT=pathlib.Path(__file__).parent
SR=44100; N=SR*60
EPISODES=json.loads((OUT/'production_scripts.json').read_text(encoding='utf8'))['episodes']
def ff(args):
    subprocess.run(['ffmpeg','-y','-v','error']+list(map(str,args)),check=True)
def save(path,a): wavfile.write(path,SR,(np.clip(a,-.98,.98)*32767).astype(np.int16))
def music(seed):
    rng=np.random.default_rng(seed); a=np.zeros((N,2),np.float32)
    bpm=[96,102,104,76,88,110,106,84,94,100][seed-11];beat=60/bpm
    root=[65.406,73.416,82.407,58.27,69.296,77.782,87.307,61.735,97.999,92.499][seed-11]
    def add(y,t,pan=0):
        p=int(t*SR);ln=min(len(y),N-p)
        if ln>0:a[p:p+ln,0]+=y[:ln]*(1-pan*.4);a[p:p+ln,1]+=y[:ln]*(1+pan*.4)
    for k,t0 in enumerate(np.arange(0,60,beat)):
        t=np.arange(int(beat*.94*SR))/SR;f=root*2**([0,4,7,9,12,7,4,2][k%8]/12)
        bass=(np.sin(2*np.pi*f*t)+.35*np.sin(4*np.pi*f*t)+.12*np.sin(6*np.pi*f*t))*np.exp(-t*5)*(1-np.exp(-t*90))*.055
        add(bass,t0)
        t=np.arange(int(.17*SR))/SR;noise=rng.normal(0,1,len(t));brush=np.diff(noise,prepend=0)*np.exp(-t*26)*(1-np.exp(-t*220))*.009
        add(brush,t0+beat*.5,(-1)**k*.7)
        if k%4==0:
            t=np.arange(int(beat*3.8*SR))/SR;y=np.zeros(len(t))
            for interval in [0,7,14,19]:
                f2=root*4*2**(interval/12);y+=(np.sin(2*np.pi*f2*t)+.15*np.sin(2*np.pi*f2*3*t))*np.exp(-t*1.6)
            add(y*(1-np.exp(-t*45))*.012,t0,(-1)**(k//4)*.5)
    # Warm bed: remove upper speech-band energy with a lowpass via FFmpeg later.
    fade=np.minimum(np.arange(N)/SR/1.2,1)*np.minimum((N-np.arange(N))/SR/1.0,1)
    return a*fade[:,None]
sem=asyncio.Semaphore(3)
async def voice(ep,sc):
    d=ROOT/('beyond_the_myth_'+ep['episode_id'])/'assets/audio/raw';i=sc['id'];mp=d/f'scene_{i}.mp3';meta=d/f'scene_{i}_words.json'
    if not mp.exists() or not meta.exists():
        async with sem:
            for attempt in range(4):
                try:
                    words=[]
                    v='en-US-AvaNeural' if sc['speaker']=='Maya' else 'en-US-ChristopherNeural'
                    c=edge_tts.Communicate(sc['text'],v,rate='+15%',boundary='WordBoundary')
                    with mp.open('wb') as f:
                        async for ch in c.stream():
                            if ch['type']=='audio':f.write(ch['data'])
                            elif ch['type']=='WordBoundary':words.append(dict(word=ch['text'],start=ch['offset']/1e7,end=(ch['offset']+ch['duration'])/1e7))
                    meta.write_text(json.dumps(words),encoding='utf8');break
                except Exception:
                    if attempt==3:raise
                    await asyncio.sleep(2+attempt)
    raw=d/f'scene_{i}_raw.wav';ff(['-i',mp,'-ar',SR,'-ac',1,raw]);sr,a=wavfile.read(raw);a=a.astype(np.float64)/32768
    words=json.loads(meta.read_text());
    # Preserve all speech and authoritative cue windows; compress only if needed, never truncate.
    duration=len(a)/SR;target=sc['end']-sc['start'];factor=max(1,duration/(target-.06))
    out=d/f'scene_{i}.wav';ff(['-i',raw,'-af',f'atempo={factor:.8f},highpass=f=65','-ar',SR,'-ac',1,out]);sr,a=wavfile.read(out);a=a.astype(np.float32)/32768
    assert len(a)<=round(target*SR),(ep['episode_id'],i,len(a)/SR,target)
    peak=np.max(np.abs(a));a*=min(1.8,.79/max(peak,.001))
    transformed=[dict(word=w['word'],start=sc['start']+w['start']/factor,end=min(sc['end'],sc['start']+w['end']/factor)) for w in words]
    print(ep['episode_id'],i,sc['speaker'],'fit',round(len(a)/SR,3),'slot',target,'tempo',round(factor,3),flush=True)
    return sc,a,transformed,factor
async def episode(e):
    epdir=ROOT/('beyond_the_myth_'+e['episode_id']);d=epdir/'assets/audio'
    pieces=await asyncio.gather(*(voice(e,s) for s in e['scenes']))
    vox=np.zeros(N,np.float32); captions=[];qa=[]
    for sc,a,words,factor in pieces:
        p=round(sc['start']*SR);vox[p:p+len(a)]+=a
        # Four-to-six word phrase captions follow actual neural word boundary events.
        for j in range(0,len(words),6):
            group=words[j:j+6];start=group[0]['start'];end=words[j+6]['start'] if j+6<len(words) else min(sc['end'],group[-1]['end']+.12)
            captions.append(dict(start=round(start,4),end=round(end,4),speaker=sc['speaker'],text=' '.join(w['word'] for w in group)))
        qa.append(dict(scene=sc['id'],speaker=sc['speaker'],start=sc['start'],end=sc['end'],actual_end=sc['start']+len(a)/SR,tempo=factor,word_count=len(words)))
    save(d/'voice.wav',np.column_stack([vox,vox]))
    bed=music(int(e['episode_id'][2:]));save(d/'music_original.wav',bed)
    ff(['-i',d/'music_original.wav','-af','equalizer=f=2200:t=q:w=0.7:g=-5,lowpass=f=6500',d/'music_carved.wav'])
    _,bed=wavfile.read(d/'music_carved.wav');bed=bed.astype(np.float32)/32768
    # Audio sidechain: activity comes from the speech waveform, not hardcoded cue positions.
    block=441;v=vox.reshape(-1,block);rms=np.sqrt(np.mean(v*v,axis=1));active=maximum_filter1d((rms>.006).astype(float),size=9,mode='constant')
    gain=np.ones(len(rms));floor=10**(-12/20);g=1.;release=.15;attack=.01
    for k,on in enumerate(active):
        target=floor if on else 1.;step=(1-floor)*.01/(attack if on else release)
        g=max(target,g-step) if on else min(target,g+step);gain[k]=g
    env=np.interp(np.arange(N),np.arange(len(gain))*block,gain)
    ducked=bed*env[:,None];save(d/'music_ducked.wav',ducked)
    sfx=np.zeros((N,2),np.float32);rng=np.random.default_rng(int(e['episode_id'][2:])+100)
    for sc in e['scenes'][1:]:
        p=round(sc['start']*SR);t=np.arange(round(.12*SR))/SR;y=(rng.normal(0,1,len(t))*.009+np.sin(2*np.pi*950*t)*.018)*np.exp(-t*50)
        sfx[p:p+len(y),0]+=y;sfx[p:p+len(y),1]+=y*.8
    mix=np.column_stack([vox,vox])+ducked+sfx
    mix*=min(1,.91/np.max(np.abs(mix)));save(d/'master.wav',mix)
    ff(['-i',d/'master.wav','-b:a','320k',d/'master.mp3'])
    (epdir/'captions.json').write_text(json.dumps(captions,ensure_ascii=False,indent=2),encoding='utf8')
    def ts(t):
        ms=round(t*1000);return f'{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02},{ms%1000:03}'
    (epdir/'subtitles.srt').write_text('\n\n'.join(f'{i+1}\n{ts(c["start"])} --> {ts(c["end"])}\n{c["text"]}' for i,c in enumerate(captions)),encoding='utf8')
    report=dict(sample_rate=SR,channels=2,samples=N,duration=60.,duck_db=-12,release_ms=150,minimum_music_gain=float(gain.min()),voice_map=dict(Maya='en-US-AvaNeural',Alex='en-US-ChristopherNeural'),scenes=qa)
    (epdir/'qa/audio.json').write_text(json.dumps(report,indent=2));print('AUDIO COMPLETE',e['episode_id'],flush=True)
async def main():
    for e in EPISODES:await episode(e)
asyncio.run(main())

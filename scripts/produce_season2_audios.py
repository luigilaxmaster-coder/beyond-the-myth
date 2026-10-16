import asyncio
import json
import pathlib
import subprocess
import os
import numpy as np
from scipy.io import wavfile
from scipy.ndimage import maximum_filter1d
import edge_tts

ROOT = pathlib.Path(__file__).resolve().parents[1]
SCRIPT_PATH = ROOT / "scripts" / "season_02_scripts.json"
SR = 44100
TOTAL_DURATION = 60.0
N = int(SR * TOTAL_DURATION) # 2,646,000 samples

def ff(args):
    subprocess.run(['ffmpeg', '-y', '-v', 'error'] + list(map(str, args)), check=True)

def save_wav(path, a):
    wavfile.write(path, SR, (np.clip(a, -0.98, 0.98) * 32767).astype(np.int16))

def synthesize_music(seed):
    rng = np.random.default_rng(seed)
    a = np.zeros((N, 2), np.float32)
    bpms = [96, 102, 104, 76, 88, 110, 106, 84, 94, 100]
    roots = [65.406, 73.416, 82.407, 58.270, 69.296, 77.782, 87.307, 61.735, 97.999, 92.499]
    bpm = bpms[(seed - 11) % len(bpms)]
    beat = 60.0 / bpm
    root = roots[(seed - 11) % len(roots)]

    def add(y, t, pan=0.0):
        p = int(t * SR)
        ln = min(len(y), N - p)
        if ln > 0:
            a[p:p+ln, 0] += y[:ln] * (1.0 - pan * 0.4)
            a[p:p+ln, 1] += y[:ln] * (1.0 + pan * 0.4)

    for k, t0 in enumerate(np.arange(0, 60, beat)):
        t = np.arange(int(beat * 0.94 * SR)) / SR
        scale_intervals = [0, 4, 7, 9, 12, 7, 4, 2]
        f = root * (2.0 ** (scale_intervals[k % len(scale_intervals)] / 12.0))
        bass = (np.sin(2 * np.pi * f * t) + 0.35 * np.sin(4 * np.pi * f * t) + 0.12 * np.sin(6 * np.pi * f * t)) * np.exp(-t * 5) * (1 - np.exp(-t * 90)) * 0.055
        add(bass, t0)

        t_brush = np.arange(int(0.17 * SR)) / SR
        noise = rng.normal(0, 1, len(t_brush))
        brush = np.diff(noise, prepend=0) * np.exp(-t_brush * 26) * (1 - np.exp(-t_brush * 220)) * 0.009
        add(brush, t0 + beat * 0.5, ((-1.0) ** k) * 0.7)

        if k % 4 == 0:
            t_chord = np.arange(int(beat * 3.8 * SR)) / SR
            y_chord = np.zeros(len(t_chord), dtype=np.float32)
            for interval in [0, 7, 14, 19]:
                f2 = root * 4.0 * (2.0 ** (interval / 12.0))
                y_chord += (np.sin(2 * np.pi * f2 * t_chord) + 0.15 * np.sin(2 * np.pi * f2 * 3.0 * t_chord)) * np.exp(-t_chord * 1.6)
            add(y_chord * (1 - np.exp(-t_chord * 45)) * 0.012, t0, ((-1.0) ** (k // 4)) * 0.5)

    fade = np.minimum(np.arange(N) / SR / 1.2, 1.0) * np.minimum((N - np.arange(N)) / SR / 1.0, 1.0)
    return a * fade[:, None]

sem = asyncio.Semaphore(3)

async def generate_scene_voice(ep_id, sc, raw_dir):
    i = sc['id']
    mp3_file = raw_dir / f"scene_{i}.mp3"
    meta_file = raw_dir / f"scene_{i}_words.json"
    
    # Check if text in cached file matches current text exactly
    text_cache_file = raw_dir / f"scene_{i}_text.txt"
    needs_tts = True
    if mp3_file.exists() and meta_file.exists() and text_cache_file.exists():
        if text_cache_file.read_text(encoding='utf8').strip() == sc['text'].strip():
            needs_tts = False

    if needs_tts:
        async with sem:
            for attempt in range(5):
                try:
                    words = []
                    voice_name = "en-US-AvaNeural" if sc['speaker'] == "Maya" else "en-US-ChristopherNeural"
                    comm = edge_tts.Communicate(sc['text'], voice_name, rate="+15%", boundary="WordBoundary")
                    with mp3_file.open("wb") as f:
                        async for chunk in comm.stream():
                            if chunk['type'] == 'audio':
                                f.write(chunk['data'])
                            elif chunk['type'] == 'WordBoundary':
                                words.append({
                                    'word': chunk['text'],
                                    'start': chunk['offset'] / 1e7,
                                    'end': (chunk['offset'] + chunk['duration']) / 1e7
                                })
                    meta_file.write_text(json.dumps(words), encoding='utf8')
                    text_cache_file.write_text(sc['text'], encoding='utf8')
                    break
                except Exception as ex:
                    if attempt == 4:
                        raise RuntimeError(f"Edge TTS failed for {ep_id} scene {i}: {ex}")
                    await asyncio.sleep(2 + attempt)

    raw_wav = raw_dir / f"scene_{i}_raw.wav"
    ff(['-i', mp3_file, '-ar', SR, '-ac', 1, raw_wav])
    _, audio_raw = wavfile.read(raw_wav)
    audio_raw = audio_raw.astype(np.float64) / 32768.0
    words = json.loads(meta_file.read_text(encoding='utf8'))

    duration = len(audio_raw) / SR
    target_slot = sc['end'] - sc['start']
    factor = max(1.0, duration / (target_slot - 0.08))
    
    out_wav = raw_dir / f"scene_{i}.wav"
    ff(['-i', raw_wav, '-af', f'atempo={factor:.8f},highpass=f=65', '-ar', SR, '-ac', 1, out_wav])
    _, audio_fit = wavfile.read(out_wav)
    audio_fit = audio_fit.astype(np.float32) / 32768.0

    peak = np.max(np.abs(audio_fit))
    if peak > 0.001:
        audio_fit *= min(1.8, 0.79 / peak)

    transformed_words = [
        {
            'word': w['word'],
            'start': sc['start'] + w['start'] / factor,
            'end': min(sc['end'], sc['start'] + w['end'] / factor)
        }
        for w in words
    ]
    print(f"[{ep_id} Sc {i} ({sc['speaker']})] dur={len(audio_fit)/SR:.2f}s slot={target_slot:.2f}s factor={factor:.3f}")
    return sc, audio_fit, transformed_words, factor

async def process_episode_audio(ep):
    ep_id = ep['episode_id']
    ep_dir = ROOT / f"beyond_the_myth_{ep_id}"
    audio_dir = ep_dir / "assets" / "audio"
    raw_dir = audio_dir / "raw"
    raw_dir.mkdir(parents=True, exist_ok=True)

    pieces = await asyncio.gather(*(generate_scene_voice(ep_id, sc, raw_dir) for sc in ep['scenes']))
    
    vox = np.zeros(N, dtype=np.float32)
    captions = []
    qa_scenes = []

    for sc, a, words, factor in pieces:
        p = round(sc['start'] * SR)
        ln = min(len(a), N - p)
        if ln > 0:
            vox[p:p+ln] += a[:ln]
        
        # Group into 4-6 word readable phrase captions based on neural word boundaries
        for j in range(0, len(words), 5):
            grp = words[j:j+5]
            st = grp[0]['start']
            en = words[j+5]['start'] if j+5 < len(words) else min(sc['end'], grp[-1]['end'] + 0.12)
            captions.append({
                'start': round(st, 4),
                'end': round(en, 4),
                'speaker': sc['speaker'],
                'text': ' '.join(w['word'] for w in grp)
            })
        qa_scenes.append({
            'scene': sc['id'],
            'speaker': sc['speaker'],
            'start': sc['start'],
            'end': sc['end'],
            'actual_end': sc['start'] + len(a) / SR,
            'tempo': factor,
            'word_count': len(words)
        })

    # Save voice track
    save_wav(audio_dir / "voice.wav", np.column_stack([vox, vox]))

    # Music synthesis & carving
    ep_num = int(ep_id[2:])
    bed = synthesize_music(ep_num)
    save_wav(audio_dir / "music_original.wav", bed)
    ff(['-i', audio_dir / "music_original.wav", '-af', 'equalizer=f=2200:t=q:w=0.7:g=-5,lowpass=f=6500', audio_dir / "music_carved.wav"])
    _, bed = wavfile.read(audio_dir / "music_carved.wav")
    bed = bed.astype(np.float32) / 32768.0

    # Sidechain ducking (-12 dB)
    block = 441
    v = vox.reshape(-1, block)
    rms = np.sqrt(np.mean(v * v, axis=1))
    active = maximum_filter1d((rms > 0.006).astype(float), size=9, mode='constant')
    gain = np.ones(len(rms))
    floor_gain = 10.0 ** (-12.0 / 20.0) # -12 dB
    g = 1.0
    release = 0.15
    attack = 0.01

    for k, on in enumerate(active):
        tgt = floor_gain if on else 1.0
        step = (1.0 - floor_gain) * 0.01 / (attack if on else release)
        g = max(tgt, g - step) if on else min(tgt, g + step)
        gain[k] = g

    env = np.interp(np.arange(N), np.arange(len(gain)) * block, gain)
    ducked = bed * env[:, None]
    save_wav(audio_dir / "music_ducked.wav", ducked)

    # Tactile SFX
    sfx = np.zeros((N, 2), dtype=np.float32)
    rng = np.random.default_rng(ep_num + 100)
    for sc in ep['scenes'][1:]:
        p = round(sc['start'] * SR)
        t_sfx = np.arange(round(0.12 * SR)) / SR
        y_sfx = (rng.normal(0, 1, len(t_sfx)) * 0.009 + np.sin(2 * np.pi * 950 * t_sfx) * 0.018) * np.exp(-t_sfx * 50)
        ln_sfx = min(len(y_sfx), N - p)
        if ln_sfx > 0:
            sfx[p:p+ln_sfx, 0] += y_sfx[:ln_sfx]
            sfx[p:p+ln_sfx, 1] += y_sfx[:ln_sfx] * 0.8

    # Final Master Mix (44.1 kHz, 16-bit stereo, exactly 60.00s)
    mix = np.column_stack([vox, vox]) + ducked + sfx
    peak_mix = np.max(np.abs(mix))
    if peak_mix > 0.001:
        mix *= min(1.0, 0.91 / peak_mix)
    save_wav(audio_dir / "master.wav", mix)
    ff(['-i', audio_dir / "master.wav", '-b:a', '320k', audio_dir / "master.mp3"])

    # Write captions and SRT
    (ep_dir / "captions.json").write_text(json.dumps(captions, ensure_ascii=False, indent=2), encoding='utf8')
    def ts(t_val):
        ms = round(t_val * 1000)
        return f"{ms // 3600000:02d}:{ms // 60000 % 60:02d}:{ms // 1000 % 60:02d},{ms % 1000:03d}"
    
    srt_content = '\n\n'.join(
        f"{idx+1}\n{ts(c['start'])} --> {ts(c['end'])}\n{c['text']}"
        for idx, c in enumerate(captions)
    )
    (ep_dir / "subtitles.srt").write_text(srt_content, encoding='utf8')

    report = {
        'sample_rate': SR,
        'channels': 2,
        'samples': N,
        'duration': TOTAL_DURATION,
        'duck_db': -12,
        'release_ms': 150,
        'voice_map': {'Maya': 'en-US-AvaNeural', 'Alex': 'en-US-ChristopherNeural'},
        'scenes': qa_scenes
    }
    qa_dir = ep_dir / "qa"
    qa_dir.mkdir(parents=True, exist_ok=True)
    (qa_dir / "audio.json").write_text(json.dumps(report, indent=2), encoding='utf8')
    print(f"=== AUDIO MASTER COMPLETE FOR {ep_id} ===")

async def main():
    with open(SCRIPT_PATH, 'r', encoding='utf8') as f:
        data = json.load(f)
    episodes = data['episodes']
    for ep in episodes:
        print(f"\n>>> Processing Master Audio for {ep['episode_id']}: {ep['title']}")
        await process_episode_audio(ep)

if __name__ == "__main__":
    asyncio.run(main())

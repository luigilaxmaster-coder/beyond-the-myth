import os
import math
import json
import numpy as np
import scipy.io.wavfile as wavfile
import subprocess

SAMPLE_RATE = 44100
TOTAL_DURATION = 60.0
TOTAL_SAMPLES = int(SAMPLE_RATE * TOTAL_DURATION) # 2,646,000

TIMELINE_SCENES = [
    {
        "id": 1,
        "speech_start": 0.25,
        "wav": "assets/audio/raw/scene_1.wav",
        "text": "That tiny symbol on your food? It's a certification, not an ownership code.",
        "on_screen": "CERTIFICATION ≠ OWNERSHIP",
        "source": "OU Kosher Certification (oukosher.org)"
    },
    {
        "id": 2,
        "speech_start": 5.75,
        "wav": "assets/audio/raw/scene_2.wav",
        "text": "This is the O-U mark. It means the product meets the Orthodox Union's kosher standards.",
        "on_screen": "OU · KOSHER CERTIFICATION",
        "source": "OU Kosher Symbols Explained [S1]"
    },
    {
        "id": 3,
        "speech_start": 11.85,
        "wav": "assets/audio/raw/scene_3.wav",
        "text": "Kosher follows Jewish dietary law. Inspectors check ingredients, equipment, and how food is made.",
        "on_screen": "INGREDIENTS → EQUIPMENT → PROCESS",
        "source": "What Is Kosher Certification? [S2]"
    },
    {
        "id": 4,
        "speech_start": 19.00,
        "wav": "assets/audio/raw/scene_4.wav",
        "text": "Companies apply for certification. Yes, they pay fees. The process includes a plant visit, an assessment, and a contract.",
        "on_screen": "APPLICATION → REVIEW → CONTRACT",
        "source": "Steps for Kosher Certification [S3]"
    },
    {
        "id": 5,
        "speech_start": 28.15,
        "wav": "assets/audio/raw/scene_5.wav",
        "text": "But paying for a certification service doesn't prove that Jewish people control the food industry.",
        "on_screen": "CERTIFICATION ≠ COLLECTIVE CONTROL",
        "source": "Evidence-Based Public Reasoning [S3]"
    },
    {
        "id": 6,
        "speech_start": 33.70,
        "wav": "assets/audio/raw/scene_6.wav",
        "text": "Want to know who owns a company? Check its corporate records. A dietary label answers a different question.",
        "on_screen": "OWNERSHIP? → COMPANY RECORDS",
        "source": "Corporate Filings & Public Disclosures"
    },
    {
        "id": 7,
        "speech_start": 41.20,
        "wav": "assets/audio/raw/scene_7.wav",
        "text": "Ask hard questions. Follow the evidence. But hold people responsible for their actions—not an entire community for its identity.",
        "on_screen": "EVIDENCE. NOT COLLECTIVE BLAME.",
        "source": "Ethical Public Accountability"
    },
    {
        "id": 8,
        "speech_start": 50.35,
        "wav": "assets/audio/raw/scene_8.wav",
        "text": "The label belongs on the box. Not on an entire community. Beyond the Myth. Facts, not scapegoats.",
        "on_screen": "BEYOND THE MYTH · FACTS, NOT SCAPEGOATS",
        "source": "Beyond the Myth · Facts, not scapegoats"
    }
]

def generate_kosher_curious_jazz_score():
    """
    Synthesizes a light, curious, warm pastel jazz score:
    - Warm upright walking bass (pizzicato woody tone)
    - Subtle brushed jazz snare shuffle & ride sizzle
    - Vibraphone / Rhodes chords with 5.5 Hz motor tremolo
    - Gentle dynamics tailored to the script's investigation
    """
    t = np.linspace(0, TOTAL_DURATION, TOTAL_SAMPLES, endpoint=False)
    left = np.zeros(TOTAL_SAMPLES, dtype=np.float32)
    right = np.zeros(TOTAL_SAMPLES, dtype=np.float32)
    
    # Tempo: 106 BPM
    beat_dur = 60.0 / 106.0 # ~0.566s
    total_beats = int(TOTAL_DURATION / beat_dur)
    
    # 1. Upright Walking Bass Line (warm jazz progression in F / Dm)
    # F2=87.31, G2=98.0, A2=110.0, Bb2=116.54, C3=130.81, D3=146.83, E3=164.81, F3=174.61
    bass_scale = [87.31, 110.0, 130.81, 146.83, 164.81, 146.83, 130.81, 116.54, 98.0, 87.31, 110.0, 130.81]
    
    for b in range(total_beats):
        b_time = b * beat_dur
        if b_time > 58.5:
            continue
        note_freq = bass_scale[b % len(bass_scale)]
        
        # Subtle modulation for Scene 3 & 4 (Bb / Gm)
        if 11.85 <= b_time < 28.0:
            note_freq = note_freq * 1.122 # Bb
        elif 41.2 <= b_time < 50.0:
            note_freq = note_freq * 0.89  # Dm (human realization)
        elif b_time >= 50.0:
            note_freq = 87.31             # Root resolve F
            
        start_idx = int(b_time * SAMPLE_RATE)
        pluc_dur = beat_dur * 0.95
        pluc_samples = int(pluc_dur * SAMPLE_RATE)
        if start_idx + pluc_samples >= TOTAL_SAMPLES:
            pluc_samples = TOTAL_SAMPLES - start_idx
            
        local_t = np.linspace(0, pluc_dur, pluc_samples, endpoint=False)
        pluck_env = np.exp(-local_t * 6.5) + np.exp(-local_t * 22.0) * 0.4
        bass_wave = (
            np.sin(2 * np.pi * note_freq * local_t) * 0.16 +
            np.sin(2 * np.pi * note_freq * 2.0 * local_t) * 0.08 +
            np.sin(2 * np.pi * note_freq * 3.0 * local_t) * 0.02
        ) * pluck_env
        
        left[start_idx:start_idx+pluc_samples] += bass_wave * 0.8
        right[start_idx:start_idx+pluc_samples] += bass_wave * 0.8
        
    # 2. Brushed Jazz Snare & Ride Cymbal Swish (Drops out during Scene 7)
    for b in range(total_beats):
        b_time = b * beat_dur
        # Percussion enters at 5.0s and drops out between 41.0s and 50.0s (Scene 7 human realization)
        if b_time < 5.0 or (41.0 <= b_time < 50.0) or b_time > 58.2:
            continue
            
        # Beat 2 and 4: brushed snare slap
        if b % 2 == 1:
            idx = int(b_time * SAMPLE_RATE)
            s_len = int(0.18 * SAMPLE_RATE)
            if idx + s_len < TOTAL_SAMPLES:
                st = np.linspace(0, 0.18, s_len, endpoint=False)
                s_env = np.exp(-st * 18.0)
                noise = (np.random.rand(s_len).astype(np.float32) * 2.0 - 1.0) * s_env * 0.038
                left[idx:idx+s_len] += noise * 0.7
                right[idx:idx+s_len] += noise * 0.9
                
        # Ride cymbal tap (subtle high sizzle on every beat)
        idx_ride = int(b_time * SAMPLE_RATE)
        r_len = int(0.08 * SAMPLE_RATE)
        if idx_ride + r_len < TOTAL_SAMPLES:
            rt = np.linspace(0, 0.08, r_len, endpoint=False)
            r_env = np.exp(-rt * 35.0)
            ride = np.sin(2 * np.pi * 7800.0 * rt) * r_env * 0.012
            left[idx_ride:idx_ride+r_len] += ride * 0.6
            right[idx_ride:idx_ride+r_len] += ride * 0.9
            
    # 3. Vibraphone Chords (Warm pastel jazz vibraphone with motor tremolo)
    jazz_chords = [
        (0.0, 5.75, [261.63, 329.63, 392.00, 523.25]),            # Cmaj7 (curious intro)
        (5.75, 11.85, [174.61, 261.63, 349.23, 440.00, 523.25]),  # Fmaj9 (warm explanation)
        (11.85, 19.00, [233.08, 293.66, 349.23, 440.00]),         # Bbmaj7 (production plant)
        (19.00, 28.15, [196.00, 246.94, 293.66, 392.00]),         # G7 / Dm7 (fees & review)
        (28.15, 33.70, [174.61, 220.00, 261.63, 349.23]),         # Fmaj7 (community street)
        (33.70, 41.20, [220.00, 261.63, 329.63, 440.00]),         # Am7 (corporate records)
        (41.20, 50.35, [146.83, 220.00, 261.63, 349.23, 440.00]), # Dm9 (human accountability)
        (50.35, 60.00, [174.61, 220.00, 261.63, 329.63, 523.25])  # Fmaj9 resolve
    ]
    
    tremolo_rate = 5.5 # 5.5 Hz vibraphone motor
    
    for c_start, c_end, freqs in jazz_chords:
        mask = (t >= c_start) & (t < c_end)
        idx = np.where(mask)[0]
        local_t = t[idx] - c_start
        dur = c_end - c_start
        
        env = np.ones_like(local_t)
        att = 0.35
        rel = 1.0
        att_idx = int(att * SAMPLE_RATE)
        if att_idx > 0 and len(local_t) > att_idx:
            env[:att_idx] = np.linspace(0.0, 1.0, att_idx)
        rel_idx = int(rel * SAMPLE_RATE)
        if rel_idx > 0 and len(local_t) > rel_idx:
            env[-rel_idx:] = np.linspace(1.0, 0.0, rel_idx)
            
        trem = 1.0 + 0.22 * np.sin(2 * np.pi * tremolo_rate * local_t)
        
        chord_wave = np.zeros_like(local_t)
        for fi, f in enumerate(freqs):
            h1 = np.sin(2 * np.pi * f * local_t)
            h2 = np.sin(2 * np.pi * (f * 2.002) * local_t) * 0.15
            h3 = np.sin(2 * np.pi * (f * 3.0) * local_t) * 0.03
            chord_wave += (h1 + h2 + h3) * 0.035
            
        chord_wave = chord_wave * env * trem
        left[idx] += chord_wave * 0.75
        right[idx] += chord_wave * 0.85
        
    return np.column_stack((left, right))

def generate_kosher_sfx():
    """
    Synthesizes tactile pastel sound design:
    - Scene 1 (0.0s): cereal box slide & settle
    - Scene 2 (5.3s): gentle magnifying glass chime
    - Scene 3 (12.0s): conveyor belt hum, 3 subtle inspection pings
    - Scene 4 (19.0s): paper folder slide, pen signature scratch
    - Scene 5 (28.0s): light street footsteps & outdoor air
    - Scene 6 (33.7s): subtle digital tablet glass tap
    - Scene 7 (41.2s): cart basket wire settle
    - Scene 8 (50.35s): sticker label attach sound & warm bell resolve
    """
    sfx = np.zeros((TOTAL_SAMPLES, 2), dtype=np.float32)
    
    def add_sfx(start_sec, dur_sec, fn, vol_l=0.5, vol_r=0.5):
        st_idx = int(start_sec * SAMPLE_RATE)
        ln = int(dur_sec * SAMPLE_RATE)
        if st_idx + ln > TOTAL_SAMPLES:
            ln = TOTAL_SAMPLES - st_idx
        local_t = np.linspace(0, dur_sec, ln, endpoint=False)
        w = fn(local_t)
        sfx[st_idx:st_idx+ln, 0] += w * vol_l
        sfx[st_idx:st_idx+ln, 1] += w * vol_r

    # S1 (0.0s): Cardboard box slide & settle
    def box_slide(lt):
        env = np.sin(np.pi * lt / lt[-1])
        noise = (np.random.rand(len(lt)).astype(np.float32) * 2.0 - 1.0)
        return noise * env * 0.18
    add_sfx(0.0, 0.45, box_slide, 0.6, 0.6)

    # S1 (0.45s): Box settle thud
    def box_settle(lt):
        env = np.exp(-lt * 25.0)
        return np.sin(2 * np.pi * 95.0 * lt) * env * 0.22
    add_sfx(0.42, 0.25, box_settle, 0.5, 0.5)

    # S2 (5.3s): Magnifying glass chime
    def glass_chime(lt):
        env = np.exp(-lt * 8.0)
        return (np.sin(2 * np.pi * 1760.0 * lt) + np.sin(2 * np.pi * 2640.0 * lt) * 0.5) * env * 0.08
    add_sfx(5.3, 0.6, glass_chime, 0.4, 0.7)

    # S3 (14.0s, 16.0s, 17.8s): 3 inspection pings (Ingredients, Equipment, Process)
    def ping(freq):
        def _p(lt):
            env = np.exp(-lt * 16.0)
            return np.sin(2 * np.pi * freq * lt) * env * 0.10
        return _p
    add_sfx(14.0, 0.35, ping(1046.5), 0.5, 0.5) # C6
    add_sfx(16.0, 0.35, ping(1318.5), 0.5, 0.6) # E6
    add_sfx(17.8, 0.35, ping(1567.9), 0.6, 0.5) # G6

    # S4 (19.2s): Paper folder slide & pen scratch
    def folder_slide(lt):
        env = np.exp(-lt * 10.0)
        noise = (np.random.rand(len(lt)).astype(np.float32) * 2.0 - 1.0)
        return noise * env * 0.12
    add_sfx(19.2, 0.4, folder_slide, 0.6, 0.5)

    def pen_scratch(lt):
        env = np.exp(-lt * 12.0)
        h = np.sin(2 * np.pi * 3200.0 * lt) * (np.random.rand(len(lt)).astype(np.float32) * 0.5 + 0.5)
        return h * env * 0.08
    add_sfx(20.5, 0.35, pen_scratch, 0.6, 0.6)

    # S6 (34.0s): Tablet digital glass tap
    def glass_tap(lt):
        env = np.exp(-lt * 35.0)
        return np.sin(2 * np.pi * 2200.0 * lt) * env * 0.09
    add_sfx(34.0, 0.15, glass_tap, 0.5, 0.7)

    # S7 (48.0s): Cart wire settle
    def cart_clink(lt):
        env = np.exp(-lt * 14.0)
        return (np.sin(2 * np.pi * 1200.0 * lt) + np.sin(2 * np.pi * 1850.0 * lt) * 0.6) * env * 0.08
    add_sfx(48.0, 0.45, cart_clink, 0.5, 0.5)

    # S8 (50.5s): Sticker label attach & warm final bell resolve
    def label_sound(lt):
        env = np.exp(-lt * 22.0)
        noise = (np.random.rand(len(lt)).astype(np.float32) * 2.0 - 1.0)
        return noise * env * 0.12
    add_sfx(50.5, 0.3, label_sound, 0.5, 0.5)

    def final_bell(lt):
        env = np.exp(-lt * 3.5)
        c1 = np.sin(2 * np.pi * 523.25 * lt) # C5
        c2 = np.sin(2 * np.pi * 659.25 * lt) * 0.6 # E5
        c3 = np.sin(2 * np.pi * 783.99 * lt) * 0.4 # G5
        return (c1 + c2 + c3) * env * 0.09
    add_sfx(56.5, 2.5, final_bell, 0.6, 0.6)

    return sfx

def build_kosher_master():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    project_dir = os.path.abspath(os.path.join(base_dir, ".."))
    audio_dir = os.path.join(project_dir, "assets", "audio")
    os.makedirs(audio_dir, exist_ok=True)
    
    print("1. Assembling 60.0s voice track from individual scene WAVs...")
    voice_track = np.zeros((TOTAL_SAMPLES, 2), dtype=np.float32)
    voice_envelope = np.zeros(TOTAL_SAMPLES, dtype=np.float32)
    
    subtitles_data = []
    
    for s in TIMELINE_SCENES:
        wav_path = os.path.join(project_dir, s["wav"])
        sr, data = wavfile.read(wav_path)
        if data.dtype == np.int16:
            data = data.astype(np.float32) / 32767.0
        elif data.dtype == np.int32:
            data = data.astype(np.float32) / 2147483648.0
            
        speech_start = s["speech_start"]
        start_idx = int(speech_start * SAMPLE_RATE)
        dur_samples = len(data)
        end_idx = min(start_idx + dur_samples, TOTAL_SAMPLES)
        speech_end = end_idx / SAMPLE_RATE
        
        chunk = data[:end_idx - start_idx]
        voice_track[start_idx:end_idx, 0] += chunk
        voice_track[start_idx:end_idx, 1] += chunk
        
        voice_envelope[start_idx:end_idx] = np.maximum(voice_envelope[start_idx:end_idx], np.abs(chunk))
        
        subtitles_data.append({
            "id": s["id"],
            "start": speech_start,
            "end": speech_end,
            "text": s["text"],
            "on_screen": s["on_screen"],
            "source": s["source"]
        })
        print(f"Scene {s['id']}: [{speech_start:05.2f}s -> {speech_end:05.2f}s] - {s['text'][:40]}...")
        
    print("\n2. Synthesizing light pastel jazz score...")
    jazz_score = generate_kosher_curious_jazz_score()
    
    print("3. Synthesizing tactile sound design (SFX)...")
    sfx = generate_kosher_sfx()
    
    print("4. Applying sidechain ducking and mixing...")
    kernel_size = int(SAMPLE_RATE * 0.25)
    cs = np.cumsum(np.insert(voice_envelope, 0, 0.0))
    raw_ma = (cs[kernel_size:] - cs[:-kernel_size]) / float(kernel_size)
    pad_l = kernel_size // 2
    pad_r = TOTAL_SAMPLES - len(raw_ma) - pad_l
    smoothed = np.pad(raw_ma, (pad_l, pad_r), mode='edge')
    
    # Ducking profile: dips music by up to 68% during speech
    duck = 1.0 - np.clip(smoothed * 4.0, 0.0, 0.68)
    duck = duck[:, np.newaxis]
    ducked_jazz = jazz_score * duck * 0.78
    
    master_mix = (voice_track * 1.05) + ducked_jazz + (sfx * 0.85)
    
    peak = np.max(np.abs(master_mix))
    print(f"Master peak: {peak:.3f}")
    if peak > 0.92:
        master_mix = master_mix * (0.92 / peak)
        
    master_wav = os.path.join(audio_dir, "ep002_kosher_master.wav")
    master_mp3 = os.path.join(audio_dir, "ep002_kosher_master.mp3")
    
    int16_audio = (np.clip(master_mix, -1.0, 1.0) * 32767.0).astype(np.int16)
    wavfile.write(master_wav, SAMPLE_RATE, int16_audio)
    print(f"Master WAV saved: {master_wav}")
    
    subprocess.run([
        "ffmpeg", "-y", "-v", "error",
        "-i", master_wav,
        "-b:a", "320k",
        master_mp3
    ], check=True)
    print(f"Master MP3 saved: {master_mp3}")
    
    # Save subtitles.json, srt, vtt
    subtitles_json_path = os.path.join(project_dir, "subtitles.json")
    with open(subtitles_json_path, "w", encoding="utf-8") as f:
        json.dump({
            "episode_id": "002-kosher",
            "title": "The Tiny Symbol on Your Food",
            "total_duration": 60.0,
            "sample_rate": SAMPLE_RATE,
            "scenes": subtitles_data
        }, f, indent=2)
    print(f"Saved subtitles JSON to {subtitles_json_path}")

    # Generate SRT
    srt_path = os.path.join(project_dir, "subtitles.srt")
    vtt_path = os.path.join(project_dir, "subtitles.vtt")
    
    def fmt_srt(sec):
        hrs = int(sec // 3600)
        mins = int((sec % 3600) // 60)
        secs = int(sec % 60)
        ms = int(round((sec - int(sec)) * 1000))
        return f"{hrs:02d}:{mins:02d}:{secs:02d},{ms:03d}"
        
    def fmt_vtt(sec):
        hrs = int(sec // 3600)
        mins = int((sec % 3600) // 60)
        secs = int(sec % 60)
        ms = int(round((sec - int(sec)) * 1000))
        return f"{hrs:02d}:{mins:02d}:{secs:02d}.{ms:03d}"

    with open(srt_path, "w", encoding="utf-8") as f_srt, open(vtt_path, "w", encoding="utf-8") as f_vtt:
        f_vtt.write("WEBVTT\n\n")
        for i, s in enumerate(subtitles_data, 1):
            f_srt.write(f"{i}\n{fmt_srt(s['start'])} --> {fmt_srt(s['end'])}\n{s['text']}\n\n")
            f_vtt.write(f"{i}\n{fmt_vtt(s['start'])} --> {fmt_vtt(s['end'])}\n{s['text']}\n\n")
            
    print(f"Saved SRT and VTT subtitles.")
    print("\nSUCCESS: Episode 002 Master Audio Generated!")

if __name__ == "__main__":
    build_kosher_master()

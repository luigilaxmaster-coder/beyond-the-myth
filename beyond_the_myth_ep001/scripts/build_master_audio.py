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
        "speech_start": 0.35,
        "wav": "assets/audio/raw/scene_1.wav",
        "text": "No religious community owns the Federal Reserve. To understand its decisions, follow the institutions—not someone's ancestry.",
        "on_screen": "FOLLOW THE INSTITUTIONS",
        "source": "Board of Governors FAQ (federalreserve.gov)"
    },
    {
        "id": 2,
        "speech_start": 10.15,
        "wav": "assets/audio/raw/scene_2.wav",
        "text": "On October seventh, the Fed published minutes from its September meeting.",
        "on_screen": "OCT 7, 2026 · MINUTES RELEASED",
        "source": "FOMC Minutes (Sept 15–16, 2026 / Rel. Oct 7, 2026)"
    },
    {
        "id": 3,
        "speech_start": 15.20,
        "wav": "assets/audio/raw/scene_3.wav",
        "text": "The system combines public and private features. Its Board of Governors is a federal agency.",
        "on_screen": "PUBLIC + PRIVATE FEATURES",
        "source": "Federal Reserve Act § 10 / 12 U.S.C. § 241"
    },
    {
        "id": 4,
        "speech_start": 22.55,
        "wav": "assets/audio/raw/scene_4.wav",
        "text": "The president nominates its members, and the Senate confirms them.",
        "on_screen": "NOMINATION → CONFIRMATION",
        "source": "U.S. Constitution Art. II & 12 U.S.C. § 241"
    },
    {
        "id": 5,
        "speech_start": 27.35,
        "wav": "assets/audio/raw/scene_5.wav",
        "text": "A committee sets the key interest-rate target: seven Board seats and five regional Reserve Bank presidents.",
        "on_screen": "7 BOARD SEATS + 5 BANK PRESIDENTS",
        "source": "Federal Reserve Act § 12A / 12 U.S.C. § 263 (FOMC)"
    },
    {
        "id": 6,
        "speech_start": 34.95,
        "wav": "assets/audio/raw/scene_6.wav",
        "text": "That structure does not make every decision right. It tells us where to look for accountability. Check the votes. Read the records. Challenge the policy.",
        "on_screen": "CHECK VOTES · READ RECORDS · QUESTION POLICY",
        "source": "FOMC Records & Public Policy Records"
    },
    {
        "id": 7,
        "speech_start": 47.85,
        "wav": "assets/audio/raw/scene_7.wav",
        "text": "But blaming Jewish people as a group is not evidence against a policymaker.",
        "on_screen": "IDENTITY IS NOT EVIDENCE",
        "source": "Evidence-Based Public Accountability"
    },
    {
        "id": 8,
        "speech_start": 53.35,
        "wav": "assets/audio/raw/scene_8.wav",
        "text": "Hold decision-makers accountable for what they do—not millions of people for who they are.",
        "on_screen": "ACCOUNTABILITY, NOT COLLECTIVE BLAME",
        "source": "Beyond the Myth · Facts, not scapegoats"
    }
]

def generate_midcentury_jazz_score():
    """
    Synthesizes a 1950s/60s cool jazz noir soundtrack (Miles / Brubeck / UPA cartoon vibe):
    - Plucked upright walking bass (pizzicato woody tone)
    - Brushed snare shuffle & ride sizzle
    - Vibraphone / Rhodes chords (warm mid-century harmony)
    """
    t = np.linspace(0, TOTAL_DURATION, TOTAL_SAMPLES, endpoint=False)
    left = np.zeros(TOTAL_SAMPLES, dtype=np.float32)
    right = np.zeros(TOTAL_SAMPLES, dtype=np.float32)
    
    # Tempo: 104 BPM (cool swing tempo)
    beat_dur = 60.0 / 104.0 # ~0.5769s
    total_beats = int(TOTAL_DURATION / beat_dur)
    
    # 1. Upright Walking Bass Line (C minor jazz blues progression)
    # Notes in Hz: C2=65.4, D2=73.4, Eb2=77.8, F2=87.3, G2=98.0, Ab2=103.8, Bb2=116.5, C3=130.8
    bass_scale = [65.41, 77.78, 87.31, 98.0, 103.83, 116.54, 130.81, 98.0, 87.31, 77.78, 73.42, 65.41]
    
    for b in range(total_beats):
        b_time = b * beat_dur
        if b_time > 58.0:
            continue
        note_freq = bass_scale[b % len(bass_scale)]
        # Key change for section 3 & 4 (Ab / F)
        if 15.0 <= b_time < 30.0:
            note_freq = note_freq * 1.25 # Modulation
        elif 45.0 <= b_time < 53.0:
            note_freq = note_freq * 0.89
            
        start_idx = int(b_time * SAMPLE_RATE)
        pluc_dur = beat_dur * 0.95
        pluc_samples = int(pluc_dur * SAMPLE_RATE)
        if start_idx + pluc_samples >= TOTAL_SAMPLES:
            pluc_samples = TOTAL_SAMPLES - start_idx
            
        local_t = np.linspace(0, pluc_dur, pluc_samples, endpoint=False)
        # Woody pluck envelope: fast attack, logarithmic body decay
        pluck_env = np.exp(-local_t * 6.5) + np.exp(-local_t * 22.0) * 0.5
        # Upright bass waveform: fundamental + strong warm 2nd harmonic + subtle 3rd
        bass_wave = (
            np.sin(2 * np.pi * note_freq * local_t) * 0.16 +
            np.sin(2 * np.pi * note_freq * 2.0 * local_t) * 0.08 +
            np.sin(2 * np.pi * note_freq * 3.0 * local_t) * 0.02
        ) * pluck_env
        
        left[start_idx:start_idx+pluc_samples] += bass_wave * 0.8
        right[start_idx:start_idx+pluc_samples] += bass_wave * 0.8
        
    # 2. Brushed Jazz Snare & Ride Cymbal Swish
    # Swing rhythm: quarter notes on ride, brushed tap on 2 and 4
    for b in range(total_beats):
        b_time = b * beat_dur
        if b_time < 0.5 or b_time > 58.0:
            continue
            
        # Beat 2 and 4: brushed snare slap
        if b % 2 == 1:
            idx = int(b_time * SAMPLE_RATE)
            s_len = int(0.18 * SAMPLE_RATE)
            if idx + s_len < TOTAL_SAMPLES:
                st = np.linspace(0, 0.18, s_len, endpoint=False)
                # Filtered noise brush
                s_env = np.exp(-st * 18.0)
                noise = (np.random.rand(s_len).astype(np.float32) * 2.0 - 1.0) * s_env * 0.04
                left[idx:idx+s_len] += noise * 0.7
                right[idx:idx+s_len] += noise * 0.9
                
        # Ride cymbal tap (subtle high sizzle on every beat + swing upbeat)
        idx_ride = int(b_time * SAMPLE_RATE)
        r_len = int(0.08 * SAMPLE_RATE)
        if idx_ride + r_len < TOTAL_SAMPLES:
            rt = np.linspace(0, 0.08, r_len, endpoint=False)
            r_env = np.exp(-rt * 35.0)
            # High pitched metallic shimmer (7500Hz)
            ride = np.sin(2 * np.pi * 7800.0 * rt) * r_env * 0.015
            left[idx_ride:idx_ride+r_len] += ride * 0.6
            right[idx_ride:idx_ride+r_len] += ride * 0.9
            
    # 3. Vibraphone Chords (Warm mid-century jazz vibraphone with motor tremolo)
    jazz_chords = [
        (0.0, 10.0, [261.63, 311.13, 392.00, 466.16, 587.33]),   # Cm9
        (10.0, 15.0, [261.63, 349.23, 440.00, 523.25]),          # F9
        (15.0, 22.4, [207.65, 311.13, 415.30, 523.25, 622.25]),  # Abmaj9
        (22.4, 27.2, [233.08, 293.66, 349.23, 440.00, 523.25]),  # Bb9
        (27.2, 34.8, [196.00, 293.66, 392.00, 466.16, 587.33]),  # G7alt
        (34.8, 47.7, [261.63, 311.13, 392.00, 523.25]),          # Cm7
        (47.7, 53.2, [174.61, 261.63, 349.23, 415.30]),          # Fm7
        (53.2, 60.0, [261.63, 329.63, 392.00, 523.25, 659.25])   # Cmaj9 resolve
    ]
    
    tremolo_rate = 5.5 # 5.5 Hz vibraphone motor
    
    for c_start, c_end, freqs in jazz_chords:
        mask = (t >= c_start) & (t < c_end)
        idx = np.where(mask)[0]
        local_t = t[idx] - c_start
        dur = c_end - c_start
        
        env = np.ones_like(local_t)
        att = 0.4
        rel = 1.0
        env[local_t < att] = local_t[local_t < att] / att
        env[local_t > (dur - rel)] = (dur - local_t[local_t > (dur - rel)]) / rel
        env = np.clip(env, 0, 1)
        
        # Vibraphone motor tremolo
        tremolo = 1.0 + 0.25 * np.sin(2 * np.pi * tremolo_rate * local_t)
        
        for f in freqs:
            v_wave = (
                np.sin(2 * np.pi * f * local_t) * 0.035 +
                np.sin(2 * np.pi * f * 2.0 * local_t) * 0.008
            ) * env * tremolo
            left[idx] += v_wave * 0.7
            right[idx] += v_wave * 0.85

    return np.column_stack([left, right])

def generate_midcentury_sfx():
    """
    Subtle mid-century sound design:
    - Vintage typewriter click / paper slide (Scene 2)
    - Playful wooden xylophone pings for the 12 seats (Scene 5)
    - Editorial courtroom gavel tap (Scene 4)
    - Soft cartoon chime / bells (Scene 6, 7, 8)
    """
    left = np.zeros(TOTAL_SAMPLES, dtype=np.float32)
    right = np.zeros(TOTAL_SAMPLES, dtype=np.float32)
    
    def add_xylo(time_sec, freq, amp=0.06, pan=0.0):
        idx = int(time_sec * SAMPLE_RATE)
        dur = 0.15
        s_len = int(dur * SAMPLE_RATE)
        if idx + s_len >= TOTAL_SAMPLES:
            return
        local_t = np.linspace(0, dur, s_len, endpoint=False)
        env = np.exp(-local_t * 28.0)
        w = np.sin(2 * np.pi * freq * local_t) * env * amp
        left[idx:idx+s_len] += w * (1.0 - pan) * 0.5
        right[idx:idx+s_len] += w * (1.0 + pan) * 0.5

    # Scene 1: Warm opening bass thrum
    add_xylo(0.3, 130.81, amp=0.08)
    
    # Scene 2: Typewriter paper slide & return bell
    idx2 = int(10.1 * SAMPLE_RATE)
    s2_len = int(0.2 * SAMPLE_RATE)
    if idx2 + s2_len < TOTAL_SAMPLES:
        t2 = np.linspace(0, 0.2, s2_len, endpoint=False)
        bell = np.sin(2 * np.pi * 1800.0 * t2) * np.exp(-t2 * 25.0) * 0.05
        left[idx2:idx2+s2_len] += bell * 0.8
        right[idx2:idx2+s2_len] += bell * 0.8
        
    # Scene 4: Courtroom gavel woodblock tap
    add_xylo(22.6, 220.0, amp=0.09, pan=-0.2)
    add_xylo(24.3, 260.0, amp=0.09, pan=0.2)
    
    # Scene 5: 12 Playful xylophone hops (7 Board + 5 Bank)
    for i in range(12):
        st = 27.6 + i * 0.18
        freq = 440.0 + i * 40.0 if i < 7 else 750.0 + (i - 7) * 55.0
        pan = -0.5 + (i / 11.0)
        add_xylo(st, freq, amp=0.05, pan=pan)
        
    # Scene 6: 3 Audit ledger pings
    add_xylo(38.0, 783.99, amp=0.07, pan=-0.3)
    add_xylo(40.2, 880.0, amp=0.07, pan=0.0)
    add_xylo(42.5, 1046.5, amp=0.08, pan=0.3)
    
    # Scene 7: Slide rejection brush
    idx7 = int(47.9 * SAMPLE_RATE)
    s7_len = int(0.3 * SAMPLE_RATE)
    if idx7 + s7_len < TOTAL_SAMPLES:
        t7 = np.linspace(0, 0.3, s7_len, endpoint=False)
        brush = (np.random.rand(s7_len).astype(np.float32) * 2.0 - 1.0) * np.sin(np.pi * t7 / 0.3) * 0.05
        left[idx7:idx7+s7_len] += brush
        right[idx7:idx7+s7_len] += brush
        
    # Scene 8: Resolving vibraphone chime
    add_xylo(53.3, 523.25, amp=0.09)
    add_xylo(53.4, 659.25, amp=0.07)
    add_xylo(53.5, 783.99, amp=0.06)

    return np.column_stack([left, right])

def build_midcentury_master():
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    audio_dir = os.path.join(base_dir, "assets", "audio")
    
    print("1. Assembling speech track...")
    voice_track = np.zeros((TOTAL_SAMPLES, 2), dtype=np.float32)
    voice_envelope = np.zeros(TOTAL_SAMPLES, dtype=np.float32)
    
    for s in TIMELINE_SCENES:
        wav_full = os.path.join(base_dir, s["wav"])
        sr, data = wavfile.read(wav_full)
        if data.dtype == np.int16:
            data = data.astype(np.float32) / 32768.0
        elif data.dtype == np.int32:
            data = data.astype(np.float32) / 2147483648.0
            
        start_idx = int(s["speech_start"] * SAMPLE_RATE)
        usable_len = min(len(data), TOTAL_SAMPLES - start_idx)
        voice_track[start_idx:start_idx+usable_len] += data[:usable_len]
        
        env_peak = np.mean(np.abs(data[:usable_len]), axis=1)
        voice_envelope[start_idx:start_idx+usable_len] = np.maximum(
            voice_envelope[start_idx:start_idx+usable_len], env_peak
        )
        
    print("2. Generating mid-century cool jazz score...")
    jazz_score = generate_midcentury_jazz_score()
    
    print("3. Generating mid-century cartoon sound design...")
    sfx = generate_midcentury_sfx()
    
    print("4. Applying sidechain ducking and mixing...")
    kernel_size = int(SAMPLE_RATE * 0.25)
    cs = np.cumsum(np.insert(voice_envelope, 0, 0.0))
    raw_ma = (cs[kernel_size:] - cs[:-kernel_size]) / float(kernel_size)
    pad_l = kernel_size // 2
    pad_r = TOTAL_SAMPLES - len(raw_ma) - pad_l
    smoothed = np.pad(raw_ma, (pad_l, pad_r), mode='edge')
    
    duck = 1.0 - np.clip(smoothed * 4.2, 0.0, 0.70)
    duck = duck[:, np.newaxis]
    ducked_jazz = jazz_score * duck * 0.75
    
    master_mix = (voice_track * 1.05) + ducked_jazz + (sfx * 0.85)
    
    peak = np.max(np.abs(master_mix))
    print(f"Master peak: {peak:.3f}")
    if peak > 0.92:
        master_mix = master_mix * (0.92 / peak)
        
    master_wav = os.path.join(audio_dir, "ep001_fed_master.wav")
    master_mp3 = os.path.join(audio_dir, "ep001_fed_master.mp3")
    
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
    print("\nSUCCESS: Mid-century master audio track generated!")

if __name__ == "__main__":
    build_midcentury_master()

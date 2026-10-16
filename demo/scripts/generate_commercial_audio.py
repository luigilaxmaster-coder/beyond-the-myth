import math
import struct
import wave
import subprocess
import os

SAMPLE_RATE = 48000
TOTAL_SECONDS = 60.0
TOTAL_SAMPLES = int(SAMPLE_RATE * TOTAL_SECONDS)

# Stereo buffers
left = [0.0] * TOTAL_SAMPLES
right = [0.0] * TOTAL_SAMPLES

def add_tone(start_sec, duration_sec, freq, amp, pan=0.0, wave_type='sine', attack=0.02, decay=0.05):
    start_idx = int(start_sec * SAMPLE_RATE)
    num_samples = int(duration_sec * SAMPLE_RATE)
    att_samples = int(attack * SAMPLE_RATE)
    dec_samples = int(decay * SAMPLE_RATE)
    
    pan_l = math.cos((pan + 1.0) * math.pi / 4.0)
    pan_r = math.sin((pan + 1.0) * math.pi / 4.0)
    
    for i in range(num_samples):
        idx = start_idx + i
        if idx >= TOTAL_SAMPLES:
            break
        t = i / SAMPLE_RATE
        
        # Envelope
        env = 1.0
        if i < att_samples and att_samples > 0:
            env = i / att_samples
        elif i > (num_samples - dec_samples) and dec_samples > 0:
            env = max(0.0, (num_samples - i) / dec_samples)
            
        # Waveform
        phase = 2.0 * math.pi * freq * t
        if wave_type == 'sine':
            val = math.sin(phase)
        elif wave_type == 'bell':
            # Fundamental + harmonics
            val = math.sin(phase) * 0.7 + math.sin(phase * 2.76) * 0.2 + math.sin(phase * 5.4) * 0.1
        elif wave_type == 'pad':
            # Detuned rich warm saw/sine mix
            val = (math.sin(phase) + 0.5 * math.sin(phase * 1.006) + 0.5 * math.sin(phase * 0.994)) * 0.5
        elif wave_type == 'sub':
            # Deep sub bass
            val = math.sin(phase) + 0.25 * math.sin(phase * 2.0)
        else:
            val = math.sin(phase)
            
        sample = val * amp * env
        left[idx] += sample * pan_l
        right[idx] += sample * pan_r

def add_chirp(start_sec, duration_sec, f_start, f_end, amp, pan=0.0, attack=0.01, decay=0.05):
    start_idx = int(start_sec * SAMPLE_RATE)
    num_samples = int(duration_sec * SAMPLE_RATE)
    att_samples = int(attack * SAMPLE_RATE)
    dec_samples = int(decay * SAMPLE_RATE)
    
    pan_l = math.cos((pan + 1.0) * math.pi / 4.0)
    pan_r = math.sin((pan + 1.0) * math.pi / 4.0)
    
    phase = 0.0
    for i in range(num_samples):
        idx = start_idx + i
        if idx >= TOTAL_SAMPLES:
            break
        frac = i / num_samples
        f = f_start + (f_end - f_start) * frac
        phase += 2.0 * math.pi * f / SAMPLE_RATE
        
        env = 1.0
        if i < att_samples and att_samples > 0:
            env = i / att_samples
        elif i > (num_samples - dec_samples) and dec_samples > 0:
            env = max(0.0, (num_samples - i) / dec_samples)
            
        val = math.sin(phase) * amp * env
        left[idx] += val * pan_l
        right[idx] += val * pan_r

def add_noise(start_sec, duration_sec, amp, pan=0.0, attack=0.05, decay=0.1):
    import random
    start_idx = int(start_sec * SAMPLE_RATE)
    num_samples = int(duration_sec * SAMPLE_RATE)
    att_samples = int(attack * SAMPLE_RATE)
    dec_samples = int(decay * SAMPLE_RATE)
    
    pan_l = math.cos((pan + 1.0) * math.pi / 4.0)
    pan_r = math.sin((pan + 1.0) * math.pi / 4.0)
    
    # Simple lowpass filter on noise
    last_val = 0.0
    for i in range(num_samples):
        idx = start_idx + i
        if idx >= TOTAL_SAMPLES:
            break
        env = 1.0
        if i < att_samples and att_samples > 0:
            env = i / att_samples
        elif i > (num_samples - dec_samples) and dec_samples > 0:
            env = max(0.0, (num_samples - i) / dec_samples)
            
        raw = random.uniform(-1.0, 1.0)
        last_val += 0.08 * (raw - last_val) # smoothed noise
        sample = last_val * amp * env
        left[idx] += sample * pan_l
        right[idx] += sample * pan_r

print("Synthesizing music score and sound effects...")

# -------------------------------------------------------------
# 0s - 4s: LA PRESIÓN
# Chaotic overlapping notification pings, rising tension, whoosh occlusion
# -------------------------------------------------------------
pings = [
    (0.2, 880, -0.4), (0.45, 1046, 0.5), (0.7, 1318, -0.2), (1.0, 1174, 0.3),
    (1.25, 987, -0.5), (1.6, 1396, 0.6), (1.9, 1568, -0.1), (2.2, 1174, 0.4),
    (2.45, 1760, -0.3), (2.7, 1046, 0.2), (3.0, 1318, -0.6), (3.3, 1568, 0.5)
]
for t_start, freq, pan in pings:
    add_tone(t_start, 0.22, freq, 0.15, pan=pan, wave_type='bell', attack=0.005, decay=0.18)

# Low rising tension
add_chirp(0.0, 3.8, 38.0, 95.0, 0.28, pan=0.0, attack=0.1, decay=0.2)
# Massive whoosh at occlusion
add_chirp(3.2, 0.78, 250.0, 60.0, 0.38, pan=0.0, attack=0.08, decay=0.1)
add_noise(3.1, 0.88, 0.22, attack=0.15, decay=0.05)

# Hard cut at 4.0s (clear anything after 3.98s up to 4.0s)
cut_idx = int(4.0 * SAMPLE_RATE)
for i in range(cut_idx - int(0.02*SAMPLE_RATE), cut_idx):
    frac = (cut_idx - i) / (0.02 * SAMPLE_RATE)
    left[i] *= frac
    right[i] *= frac

# -------------------------------------------------------------
# 4s - 9s: EL SILENCIO
# Pure quiet, subtle 36Hz presence, subtle liquid ripple shimmer at 7.8s
# -------------------------------------------------------------
add_tone(4.2, 4.6, 36.0, 0.04, pan=0.0, wave_type='sine', attack=0.5, decay=0.5)
# Wave ripple shimmer
add_tone(7.8, 1.1, 587.33, 0.08, pan=0.1, wave_type='bell', attack=0.15, decay=0.8)
add_tone(7.9, 1.0, 880.0, 0.05, pan=-0.1, wave_type='bell', attack=0.15, decay=0.7)

# -------------------------------------------------------------
# 9s - 16s: LA REVELACIÓN
# First deep cinematic sub-bass braam / kick drop at 9.0s + dark ambient pads in Dm
# -------------------------------------------------------------
# Deep sub impact
add_chirp(9.0, 2.5, 95.0, 35.0, 0.45, attack=0.01, decay=2.2)
# Low D braam
add_tone(9.0, 6.8, 73.42, 0.25, wave_type='sub', attack=0.05, decay=1.5) # D2
# Ambient pad chord (Dm: D3, F3, A3, D4)
for note_f, p in [(146.83, -0.3), (174.61, 0.3), (220.0, -0.1), (293.66, 0.2)]:
    add_tone(9.2, 6.6, note_f, 0.12, pan=p, wave_type='pad', attack=1.2, decay=1.2)
# Brand Axx soft presence chime
add_tone(13.2, 2.5, 587.33, 0.09, pan=0.0, wave_type='bell', attack=0.1, decay=2.2)

# -------------------------------------------------------------
# 16s - 28s: EL PLANO QUE SE RECUERDA (Hero Sequence)
# Sub pulse, mass shift tension, extension stretch, contact click, reintegration wave
# -------------------------------------------------------------
# Rhythmic subtle 60bpm heartbeat pulse
for t_beat in [16.0, 17.0, 18.0, 19.0, 20.0, 21.0, 22.0, 23.0, 24.0, 25.0, 26.0, 27.0]:
    add_tone(t_beat, 0.25, 48.0, 0.18, wave_type='sub', attack=0.01, decay=0.22)
    add_tone(t_beat, 0.04, 1200.0, 0.04, wave_type='sine', attack=0.002, decay=0.03)

# Sustained dark pad
for note_f, p in [(130.81, -0.2), (196.0, 0.2), (261.63, 0.0)]: # C3 / G3 / C4
    add_tone(16.0, 11.5, note_f, 0.12, pan=p, wave_type='pad', attack=0.8, decay=1.0)

# Mass anticipation & Extension stretch (17.5s - 20.5s)
add_chirp(17.5, 3.0, 120.0, 480.0, 0.16, attack=0.4, decay=0.2)
add_noise(18.0, 2.5, 0.06, attack=0.5, decay=0.2)

# TACTILE CONTACT (20.5s) — Magnetic click + resonant ping
add_chirp(20.5, 0.05, 1600.0, 300.0, 0.35, attack=0.002, decay=0.04)
add_tone(20.5, 1.2, 880.0, 0.18, pan=0.15, wave_type='bell', attack=0.005, decay=1.0)

# Retraction & Reintegration wave (22.5s - 24.0s)
add_chirp(22.2, 1.4, 420.0, 110.0, 0.22, attack=0.1, decay=0.4)
add_tone(23.2, 2.5, 220.0, 0.18, pan=0.0, wave_type='sine', attack=0.05, decay=2.2) # Surface wave ripple
add_tone(23.4, 2.0, 329.63, 0.12, pan=0.2, wave_type='bell', attack=0.08, decay=1.8)

# -------------------------------------------------------------
# 28s - 37s: LAS POSIBILIDADES
# Match cut snap + 3 related dock expansion notes (A4, C#5, E5) + clean settle
# -------------------------------------------------------------
# Match cut snap
add_chirp(28.0, 0.04, 1800.0, 200.0, 0.25, attack=0.002, decay=0.03)

# Note 1: Level 0 -> Level 1 (28.8s)
add_tone(28.8, 1.8, 440.0, 0.22, pan=-0.25, wave_type='bell', attack=0.008, decay=1.6) # A4
add_chirp(28.8, 0.08, 600.0, 250.0, 0.15, pan=-0.25, attack=0.005, decay=0.07)

# Note 2: Level 1 -> Level 2 (31.0s)
add_tone(31.0, 1.8, 554.37, 0.24, pan=0.0, wave_type='bell', attack=0.008, decay=1.6) # C#5
add_chirp(31.0, 0.08, 800.0, 350.0, 0.16, pan=0.0, attack=0.005, decay=0.07)

# Note 3: Level 2 -> Level 3 (33.0s)
add_tone(33.0, 2.2, 659.25, 0.26, pan=0.25, wave_type='bell', attack=0.008, decay=2.0) # E5
add_chirp(33.0, 0.08, 1000.0, 450.0, 0.18, pan=0.25, attack=0.005, decay=0.07)

# Dock base foundation
for note_f, p in [(110.0, -0.2), (164.81, 0.2), (220.0, 0.0)]: # A2 / E3 / A3
    add_tone(28.5, 8.2, note_f, 0.14, pan=p, wave_type='pad', attack=0.5, decay=0.8)

# -------------------------------------------------------------
# 37s - 46s: LA PRUEBA
# Energetic rhythmic pulse + 3 distinct action sound cues
# -------------------------------------------------------------
# Driving rhythm (120 BPM = 0.5s per beat)
t_rhythm = 37.0
while t_rhythm < 46.0:
    add_tone(t_rhythm, 0.18, 55.0, 0.28, wave_type='sub', attack=0.005, decay=0.16)
    if (int((t_rhythm - 37.0) * 2) % 2) == 1:
        add_tone(t_rhythm, 0.06, 980.0, 0.08, wave_type='sine', attack=0.002, decay=0.05)
    t_rhythm += 0.5

# Action 1: "Guarda" (38.8s) — Crisp note save click + swoosh
add_chirp(38.8, 0.06, 1400.0, 350.0, 0.32, attack=0.002, decay=0.05)
add_tone(38.85, 1.2, 783.99, 0.16, pan=-0.2, wave_type='bell', attack=0.005, decay=1.0) # G5

# Action 2: "Organiza" (41.2s) — Harmonic checkmark completion chime
add_tone(41.15, 0.8, 659.25, 0.16, pan=0.1, wave_type='bell', attack=0.005, decay=0.6) # E5
add_tone(41.35, 1.4, 880.0, 0.22, pan=0.1, wave_type='bell', attack=0.005, decay=1.2) # A5

# Action 3: "Concéntrate" (43.2s) — Focus timer ignition pulse + breathing harmonic
add_tone(43.2, 2.6, 432.0, 0.24, pan=0.0, wave_type='bell', attack=0.02, decay=2.4)
add_chirp(43.2, 0.4, 150.0, 432.0, 0.20, attack=0.05, decay=0.3)

# -------------------------------------------------------------
# 46s - 54s: LA LIBERACIÓN
# Majestic musical crescendo! Lush cinematic strings/synth swell (D major / Bm / G)
# -------------------------------------------------------------
# Swell chords
chords = [
    # 46s - 49s: Bm / D
    [(146.83, 0.20), (220.0, 0.20), (293.66, 0.22), (369.99, 0.18)],
    # 49s - 52s: G / A
    [(196.0, 0.24), (246.94, 0.22), (293.66, 0.24), (392.0, 0.20)],
    # 52s - 54s: D major resolve
    [(146.83, 0.22), (220.0, 0.22), (293.66, 0.24), (440.0, 0.18)]
]
t_c = 46.0
for chord in chords:
    for freq, a in chord:
        add_tone(t_c, 3.5, freq, a, wave_type='pad', attack=0.8, decay=0.8)
    t_c += 3.0

# Sub-bass lift
add_tone(46.0, 7.5, 36.71, 0.32, wave_type='sub', attack=0.8, decay=1.5) # D1

# -------------------------------------------------------------
# 54s - 60s: LA FIRMA
# Stable product shot + 3-NOTE SIGNATURE MNEMONIC (D5, A5, D6)
# Resolves in tonic, decays gently through second 60.0
# -------------------------------------------------------------
# Background warm bed holding until 60s
add_tone(54.0, 5.9, 73.42, 0.14, wave_type='sub', attack=0.5, decay=1.0)
add_tone(54.0, 5.9, 146.83, 0.12, wave_type='pad', attack=0.5, decay=1.0)
add_tone(54.0, 5.9, 220.0, 0.10, wave_type='pad', attack=0.5, decay=1.0)

# THE THREE-NOTE AXX MNEMONIC
# Note 1: D5 (56.5s)
add_tone(56.5, 3.4, 587.33, 0.38, pan=-0.15, wave_type='bell', attack=0.005, decay=3.2)
# Note 2: A5 (57.3s)
add_tone(57.3, 2.6, 880.0, 0.40, pan=0.15, wave_type='bell', attack=0.005, decay=2.5)
# Note 3: D6 (58.1s) — Pristine octave resolution that rings out into second 60!
add_tone(58.1, 1.88, 1174.66, 0.45, pan=0.0, wave_type='bell', attack=0.005, decay=1.85)

# Soft acoustic sub tap on final note
add_tone(58.1, 1.8, 73.42, 0.25, wave_type='sub', attack=0.01, decay=1.7)

print("Mastering and soft-clipping audio buffers...")
# Soft limiter / saturation to avoid digital clipping
max_amp = 0.0
for i in range(TOTAL_SAMPLES):
    max_amp = max(max_amp, abs(left[i]), abs(right[i]))
print(f"Peak raw amplitude: {max_amp:.3f}")

target_peak = 0.92
scale = target_peak / max(max_amp, 1.0)

raw_wav_path = "assets/audio/synth_score.wav"
with wave.open(raw_wav_path, "w") as wf:
    wf.setnchannels(2)
    wf.setsampwidth(2)
    wf.setframerate(SAMPLE_RATE)
    
    frames = bytearray()
    for i in range(TOTAL_SAMPLES):
        # Soft tanh saturation
        sl = math.tanh(left[i] * scale)
        sr = math.tanh(right[i] * scale)
        il = int(sl * 32767.0)
        ir = int(sr * 32767.0)
        frames.extend(struct.pack("<hh", il, ir))
    wf.writeframes(frames)

print(f"Saved {raw_wav_path}. Now mixing with voiceover stems...")

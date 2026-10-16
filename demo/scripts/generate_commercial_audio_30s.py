import math
import struct
import wave
import subprocess
import os

SAMPLE_RATE = 48000
TOTAL_SECONDS = 30.0
TOTAL_SAMPLES = int(SAMPLE_RATE * TOTAL_SECONDS)

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
        
        env = 1.0
        if i < att_samples and att_samples > 0:
            env = i / att_samples
        elif i > (num_samples - dec_samples) and dec_samples > 0:
            env = max(0.0, (num_samples - i) / dec_samples)
            
        phase = 2.0 * math.pi * freq * t
        if wave_type == 'sine':
            val = math.sin(phase)
        elif wave_type == 'bell':
            val = math.sin(phase) * 0.7 + math.sin(phase * 2.76) * 0.2 + math.sin(phase * 5.4) * 0.1
        elif wave_type == 'pad':
            val = (math.sin(phase) + 0.5 * math.sin(phase * 1.006) + 0.5 * math.sin(phase * 0.994)) * 0.5
        elif wave_type == 'sub':
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
        last_val += 0.08 * (raw - last_val)
        sample = last_val * amp * env
        left[idx] += sample * pan_l
        right[idx] += sample * pan_r

print("Synthesizing 30-second Super Bowl music score...")

# -------------------------------------------------------------
# 0s - 3s: LA PRESIÓN (Accelerated digital clutter barrage)
# -------------------------------------------------------------
pings = [
    (0.1, 987, -0.4), (0.3, 1318, 0.5), (0.55, 1174, -0.2), (0.8, 1568, 0.4),
    (1.05, 1046, -0.5), (1.3, 1760, 0.6), (1.55, 1396, -0.1), (1.8, 1174, 0.3),
    (2.05, 1568, -0.3), (2.3, 1046, 0.5)
]
for t_start, freq, pan in pings:
    add_tone(t_start, 0.18, freq, 0.14, pan=pan, wave_type='bell', attack=0.005, decay=0.15)

add_chirp(0.0, 2.7, 45.0, 120.0, 0.30, attack=0.1, decay=0.1)
# Occlusion card sweep
add_chirp(2.2, 0.65, 300.0, 50.0, 0.42, attack=0.05, decay=0.1)
add_noise(2.1, 0.75, 0.25, attack=0.1, decay=0.05)

# Hard cut silence at 2.95s
cut_idx = int(2.95 * SAMPLE_RATE)
for i in range(cut_idx - int(0.015 * SAMPLE_RATE), cut_idx):
    frac = (cut_idx - i) / (0.015 * SAMPLE_RATE)
    left[i] *= frac
    right[i] *= frac

# -------------------------------------------------------------
# 3s - 6.5s: EL SILENCIO Y LA REVELACIÓN
# Sudden vacuum, liquid wave shimmer, cinematic sub braam in Dm
# -------------------------------------------------------------
add_tone(3.05, 3.4, 36.0, 0.05, wave_type='sine', attack=0.3, decay=0.3)
# Liquid wave shimmer
add_tone(4.2, 1.2, 587.33, 0.10, pan=0.1, wave_type='bell', attack=0.1, decay=0.9)
add_tone(4.3, 1.0, 880.0, 0.06, pan=-0.1, wave_type='bell', attack=0.1, decay=0.8)

# Braam drop (D2) + Dm Pad at 4.8s
add_chirp(4.8, 2.0, 105.0, 36.0, 0.45, attack=0.01, decay=1.8)
add_tone(4.8, 3.5, 73.42, 0.28, wave_type='sub', attack=0.04, decay=1.4)
for note_f, p in [(146.83, -0.3), (174.61, 0.3), (220.0, -0.1), (293.66, 0.2)]:
    add_tone(4.8, 3.5, note_f, 0.14, pan=p, wave_type='pad', attack=0.6, decay=0.8)

# -------------------------------------------------------------
# 6.5s - 14s: EL PLANO QUE SE RECUERDA (Hero Extension & Reach)
# -------------------------------------------------------------
for t_beat in [6.5, 7.5, 8.5, 9.5, 10.5, 11.5, 12.5, 13.5]:
    add_tone(t_beat, 0.22, 52.0, 0.20, wave_type='sub', attack=0.008, decay=0.20)
    add_tone(t_beat, 0.03, 1100.0, 0.05, wave_type='sine', attack=0.002, decay=0.025)

# Sustained pad
for note_f, p in [(130.81, -0.2), (196.0, 0.2), (261.63, 0.0)]:
    add_tone(6.5, 7.5, note_f, 0.13, pan=p, wave_type='pad', attack=0.6, decay=0.8)

# Mass anticipation & Extension stretch (7.2s - 9.2s)
add_chirp(7.2, 2.0, 140.0, 520.0, 0.18, attack=0.3, decay=0.2)
add_noise(7.6, 1.8, 0.08, attack=0.4, decay=0.2)

# Tactile contact at 9.2s (Magnetic snap + resonant bell)
add_chirp(9.2, 0.05, 1800.0, 320.0, 0.40, attack=0.002, decay=0.04)
add_tone(9.2, 1.4, 880.0, 0.22, pan=0.15, wave_type='bell', attack=0.005, decay=1.2)

# High-velocity retraction & reintegration wave (10.5s - 12.5s)
add_chirp(10.5, 1.2, 460.0, 110.0, 0.25, attack=0.08, decay=0.35)
add_tone(11.2, 2.0, 220.0, 0.20, wave_type='sine', attack=0.04, decay=1.8)
add_tone(11.4, 1.8, 329.63, 0.14, pan=0.2, wave_type='bell', attack=0.05, decay=1.5)

# -------------------------------------------------------------
# 14s - 19.5s: LAS POSIBILIDADES (3-Tier Dock Progression)
# -------------------------------------------------------------
add_chirp(14.0, 0.04, 1900.0, 220.0, 0.26, attack=0.002, decay=0.03)

# Note 1: Accesos (14.6s) - A4
add_tone(14.6, 1.6, 440.0, 0.25, pan=-0.25, wave_type='bell', attack=0.008, decay=1.4)
add_chirp(14.6, 0.07, 650.0, 280.0, 0.16, attack=0.005, decay=0.06)

# Note 2: Catálogo (16.2s) - C#5
add_tone(16.2, 1.6, 554.37, 0.26, pan=0.0, wave_type='bell', attack=0.008, decay=1.4)
add_chirp(16.2, 0.07, 850.0, 380.0, 0.17, attack=0.005, decay=0.06)

# Note 3: Detalle (17.8s) - E5
add_tone(17.8, 1.8, 659.25, 0.28, pan=0.25, wave_type='bell', attack=0.008, decay=1.6)
add_chirp(17.8, 0.07, 1050.0, 480.0, 0.19, attack=0.005, decay=0.06)

for note_f, p in [(110.0, -0.2), (164.81, 0.2), (220.0, 0.0)]:
    add_tone(14.2, 5.2, note_f, 0.15, pan=p, wave_type='pad', attack=0.4, decay=0.6)

# -------------------------------------------------------------
# 19.5s - 24.5s: LA PRUEBA (Percussive Action Cues)
# -------------------------------------------------------------
t_rhythm = 19.5
while t_rhythm < 24.5:
    add_tone(t_rhythm, 0.16, 58.0, 0.30, wave_type='sub', attack=0.005, decay=0.14)
    if (int((t_rhythm - 19.5) * 2) % 2) == 1:
        add_tone(t_rhythm, 0.05, 1050.0, 0.09, wave_type='sine', attack=0.002, decay=0.04)
    t_rhythm += 0.45

# Action 1: Guarda (20.2s)
add_chirp(20.2, 0.05, 1500.0, 380.0, 0.35, attack=0.002, decay=0.04)
add_tone(20.25, 1.0, 783.99, 0.18, pan=-0.2, wave_type='bell', attack=0.005, decay=0.9)

# Action 2: Organiza (21.6s)
add_tone(21.55, 0.7, 659.25, 0.18, pan=0.1, wave_type='bell', attack=0.005, decay=0.5)
add_tone(21.75, 1.2, 880.0, 0.24, pan=0.1, wave_type='bell', attack=0.005, decay=1.0)

# Action 3: Concéntrate (23.0s)
add_tone(23.0, 2.2, 432.0, 0.26, wave_type='bell', attack=0.02, decay=2.0)
add_chirp(23.0, 0.35, 160.0, 432.0, 0.22, attack=0.04, decay=0.25)

# -------------------------------------------------------------
# 24.5s - 30s: LA LIBERACIÓN Y LA FIRMA
# Grand crescendo into D major + 3-NOTE MNEMONIC (D5, A5, D6)
# -------------------------------------------------------------
# Chords (G / A / D)
for note_f in [196.0, 246.94, 293.66, 392.0]:
    add_tone(24.5, 3.2, note_f, 0.22, wave_type='pad', attack=0.6, decay=0.6)
for note_f in [146.83, 220.0, 293.66, 440.0]:
    add_tone(26.5, 3.5, note_f, 0.24, wave_type='pad', attack=0.5, decay=0.8)

add_tone(24.5, 5.4, 36.71, 0.34, wave_type='sub', attack=0.6, decay=1.2)

# THE THREE-NOTE AXX MNEMONIC
# Note 1: D5 (27.2s)
add_tone(27.2, 2.7, 587.33, 0.40, pan=-0.15, wave_type='bell', attack=0.005, decay=2.6)
# Note 2: A5 (27.9s)
add_tone(27.9, 2.0, 880.0, 0.42, pan=0.15, wave_type='bell', attack=0.005, decay=1.9)
# Note 3: D6 (28.6s) — Resolves into the final frame of second 30!
add_tone(28.6, 1.38, 1174.66, 0.48, pan=0.0, wave_type='bell', attack=0.005, decay=1.35)
add_tone(28.6, 1.35, 73.42, 0.26, wave_type='sub', attack=0.01, decay=1.3)

print("Mastering and soft-clipping audio buffers...")
max_amp = 0.0
for i in range(TOTAL_SAMPLES):
    max_amp = max(max_amp, abs(left[i]), abs(right[i]))
print(f"Peak raw amplitude: {max_amp:.3f}")

target_peak = 0.92
scale = target_peak / max(max_amp, 1.0)

raw_wav_path = "assets/audio/synth_score_30s.wav"
with wave.open(raw_wav_path, "w") as wf:
    wf.setnchannels(2)
    wf.setsampwidth(2)
    wf.setframerate(SAMPLE_RATE)
    
    frames = bytearray()
    for i in range(TOTAL_SAMPLES):
        sl = math.tanh(left[i] * scale)
        sr = math.tanh(right[i] * scale)
        il = int(sl * 32767.0)
        ir = int(sr * 32767.0)
        frames.extend(struct.pack("<hh", il, ir))
    wf.writeframes(frames)

print(f"Saved {raw_wav_path}. Now mixing with voiceover stems...")

# Run ffmpeg to mix music score and voiceover stems with exact delays
filter_complex = (
    "[1:a]adelay=400|400,volume=1.35[v1]; "
    "[2:a]adelay=3200|3200,volume=1.38[v2]; "
    "[3:a]adelay=8200|8200,volume=1.40[v3]; "
    "[4:a]adelay=14800|14800,volume=1.40[v4]; "
    "[5:a]adelay=19500|19500,volume=1.38[v5]; "
    "[6:a]adelay=24500|24500,volume=1.42[v6]; "
    "[0:a][v1][v2][v3][v4][v5][v6]amix=inputs=7:duration=first:dropout_transition=2[mixed]; "
    "[mixed]alimiter=limit=0.95:attack=5:release=50[out]"
)

out_master = "assets/audio/axx-superbowl-master.mp3"
cmd = [
    "ffmpeg", "-y",
    "-i", raw_wav_path,
    "-i", "assets/audio/vo30_1.mp3",
    "-i", "assets/audio/vo30_2.mp3",
    "-i", "assets/audio/vo30_3.mp3",
    "-i", "assets/audio/vo30_4.mp3",
    "-i", "assets/audio/vo30_5.mp3",
    "-i", "assets/audio/vo30_6.mp3",
    "-filter_complex", filter_complex,
    "-map", "[out]",
    "-t", "30.0",
    "-c:a", "libmp3lame",
    "-b:a", "320k",
    out_master
]

print("Running ffmpeg mixdown...")
res = subprocess.run(cmd, capture_output=True, text=True)
if res.returncode == 0:
    print(f"Master soundtrack generated successfully at {out_master}!")
else:
    print("FFmpeg error:", res.stderr)


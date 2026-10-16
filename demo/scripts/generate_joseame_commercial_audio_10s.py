import math
import struct
import wave
import subprocess
import os

SAMPLE_RATE = 48000
TOTAL_SECONDS = 10.0
TOTAL_SAMPLES = int(SAMPLE_RATE * TOTAL_SECONDS)

# Stereo buffers
left = [0.0] * TOTAL_SAMPLES
right = [0.0] * TOTAL_SAMPLES

def add_tone(start_sec, duration_sec, freq, amp, pan=0.0, wave_type='sine', attack=0.01, decay=0.05):
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
            
        phase = 2.0 * math.pi * freq * t
        if wave_type == 'sine':
            val = math.sin(phase)
        elif wave_type == 'bell':
            val = math.sin(phase) * 0.7 + math.sin(phase * 2.76) * 0.2 + math.sin(phase * 5.4) * 0.1
        elif wave_type == 'marimba':
            # Organic wooden / tropical pluck tone
            val = math.sin(phase) * 0.8 + math.sin(phase * 3.0) * 0.15 + math.sin(phase * 4.2) * 0.05
        elif wave_type == 'bass':
            # Warm saturated bass
            val = math.sin(phase) + 0.3 * math.sin(phase * 2.0) + 0.1 * math.sin(phase * 3.0)
            val = math.tanh(val * 1.4)
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

def add_noise(start_sec, duration_sec, amp, pan=0.0, attack=0.02, decay=0.05, color='white'):
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
        if color == 'pink':
            last_val += 0.12 * (raw - last_val)
            val = last_val
        else:
            val = raw
            
        sample = val * amp * env
        left[idx] += sample * pan_l
        right[idx] += sample * pan_r

def add_kick(start_sec, amp=0.45):
    # Punchy 808/acoustic pop kick
    add_chirp(start_sec, 0.14, 150.0, 42.0, amp, attack=0.002, decay=0.10)
    add_noise(start_sec, 0.02, amp * 0.25, attack=0.001, decay=0.015)

def add_snare(start_sec, amp=0.32):
    # Crisp tropical snap / clap
    add_noise(start_sec, 0.10, amp, pan=0.0, attack=0.002, decay=0.08, color='white')
    add_tone(start_sec, 0.06, 210.0, amp * 0.4, attack=0.002, decay=0.04)

print("Synthesizing 10-second bespoke soundtrack & SFX...")

# 124 BPM -> 1 beat = 60 / 124 = 0.48387 sec
BEAT = 60.0 / 124.0

# -------------------------------------------------------------
# SFX: 0.0s - 1.1s (HOOK: EL AIRE SE DAÑÓ)
# -------------------------------------------------------------
# Remote control click
add_tone(0.08, 0.025, 2400, 0.25, pan=0.2, attack=0.002, decay=0.02)
add_noise(0.08, 0.015, 0.20, pan=0.2, attack=0.001, decay=0.01)

# Heat/broken AC electrical sputter/hum
add_chirp(0.18, 0.45, 120.0, 75.0, 0.18, pan=0.3, attack=0.02, decay=0.15)
add_noise(0.22, 0.35, 0.08, pan=0.3, attack=0.05, decay=0.1, color='pink')
# Glitch error double beep
add_tone(0.48, 0.06, 440, 0.14, attack=0.005, decay=0.04)
add_tone(0.56, 0.08, 330, 0.16, attack=0.005, decay=0.05)

# Whoosh into Shot 2
add_chirp(0.85, 0.28, 200.0, 600.0, 0.20, pan=-0.2, attack=0.05, decay=0.08)

# -------------------------------------------------------------
# SFX: 1.1s - 2.0s (AMPLIAR EL PROBLEMA - FLASHES)
# -------------------------------------------------------------
problem_pops = [(1.12, 523.25), (1.34, 659.25), (1.56, 783.99), (1.78, 1046.5)]
for t_pop, f_pop in problem_pops:
    add_tone(t_pop, 0.08, f_pop, 0.16, pan=0.3 * (f_pop / 1000.0 - 0.5), wave_type='marimba', attack=0.004, decay=0.06)
    add_chirp(t_pop, 0.05, f_pop * 1.5, f_pop, 0.10, attack=0.002, decay=0.03)

# -------------------------------------------------------------
# SFX: 2.0s - 2.8s (ENTRADA DE LA MARCA - IMPACTO JOSEAME)
# -------------------------------------------------------------
# Warm majestic brand impact chord (E major: E4, B4, E5, G#5, B5)
chord_times = [2.02]
for ct in chord_times:
    add_kick(ct, amp=0.50)
    add_chirp(ct - 0.25, 0.25, 150.0, 800.0, 0.22, attack=0.08, decay=0.02)
    # Bell chime chord
    add_tone(ct, 0.85, 329.63, 0.22, pan=0.0, wave_type='bell', attack=0.01, decay=0.7)  # E4
    add_tone(ct, 0.85, 493.88, 0.20, pan=-0.3, wave_type='bell', attack=0.01, decay=0.6) # B4
    add_tone(ct, 0.90, 659.25, 0.24, pan=0.3, wave_type='bell', attack=0.01, decay=0.75) # E5
    add_tone(ct, 0.90, 830.61, 0.18, pan=-0.1, wave_type='bell', attack=0.01, decay=0.65) # G#5
    add_tone(ct, 0.95, 1318.5, 0.15, pan=0.2, wave_type='bell', attack=0.01, decay=0.5)  # E6

# -------------------------------------------------------------
# MUSICAL GROOVE (2.4s to 8.9s) - Modern Caribbean Tech Pop
# -------------------------------------------------------------
# Beat loop from t = 2.4 to 8.9
t_beat = 2.42
bar = 0
while t_beat < 8.85:
    # Kick on beat 1 and 3 of the bar
    add_kick(t_beat, amp=0.40)
    add_kick(t_beat + BEAT * 2, amp=0.38)
    
    # Snare / Clap on beat 2 and 4
    add_snare(t_beat + BEAT, amp=0.28)
    add_snare(t_beat + BEAT * 3, amp=0.30)
    
    # Shaker on 16th notes
    for sixteenth in range(8):
        shk_time = t_beat + sixteenth * (BEAT / 2.0)
        shk_amp = 0.08 if (sixteenth % 2 == 1) else 0.04
        add_noise(shk_time, 0.035, shk_amp, pan=0.35, attack=0.002, decay=0.025, color='white')
        
    # Bassline (E - C# - A - B progression)
    bass_notes = [82.41, 69.30, 55.0, 61.74] # E2, C#2, A1, B1
    root = bass_notes[bar % len(bass_notes)]
    add_tone(t_beat, BEAT * 0.9, root, 0.32, wave_type='bass', attack=0.02, decay=0.1)
    add_tone(t_beat + BEAT * 1.5, BEAT * 0.4, root * 1.5, 0.22, wave_type='bass', attack=0.02, decay=0.06)
    add_tone(t_beat + BEAT * 2.5, BEAT * 0.9, root, 0.28, wave_type='bass', attack=0.02, decay=0.08)
    
    # Marimba / Tropical tech arpeggios
    marimba_seq = [
        (0.0, 659.25), (0.5, 830.61), (1.0, 987.77), (1.5, 1318.5),
        (2.0, 987.77), (2.5, 830.61), (3.0, 1108.7), (3.5, 987.77)
    ]
    for step_beat, m_freq in marimba_seq:
        add_tone(t_beat + step_beat * (BEAT / 2.0), 0.18, m_freq, 0.16, pan=(step_beat % 2)*0.4 - 0.2, wave_type='marimba', attack=0.005, decay=0.12)
        
    t_beat += BEAT * 4
    bar += 1

# -------------------------------------------------------------
# SFX: 2.8s - 4.0s (DESCUBRIMIENTO: PHONE SWIPE & CATEGORY TAP)
# -------------------------------------------------------------
# Phone slide up whoosh
add_chirp(2.82, 0.25, 300.0, 750.0, 0.15, pan=0.0, attack=0.04, decay=0.06)
# Category Tap ("Reparaciones")
add_tone(3.70, 0.05, 1200, 0.22, pan=0.1, wave_type='sine', attack=0.002, decay=0.03)
add_chirp(3.70, 0.04, 1500, 2400, 0.14, attack=0.002, decay=0.02)

# -------------------------------------------------------------
# SFX: 4.0s - 5.4s (FORMULARIO & TYPING)
# -------------------------------------------------------------
# Micro typing clicks
type_times = [4.20, 4.32, 4.45, 4.58, 4.72, 4.85, 4.98]
for tt in type_times:
    add_noise(tt, 0.015, 0.12, pan=-0.1, attack=0.001, decay=0.01)
    add_tone(tt, 0.02, 1800 + (hash(str(tt)) % 600), 0.08, attack=0.001, decay=0.015)

# Button tap "PUBLICAR JOSEO"
add_tone(5.32, 0.06, 480, 0.25, pan=0.0, attack=0.005, decay=0.04)
add_chirp(5.32, 0.08, 300, 650, 0.20, attack=0.005, decay=0.05)

# -------------------------------------------------------------
# SFX: 5.4s - 6.2s (PUBLICACIÓN CONFIRMADA: SUCCESS CHIME)
# -------------------------------------------------------------
# Cheerful success chime (A5 - C#6 - E6)
add_tone(5.48, 0.35, 880.0, 0.24, pan=-0.2, wave_type='bell', attack=0.005, decay=0.25)
add_tone(5.55, 0.35, 1108.7, 0.26, pan=0.1, wave_type='bell', attack=0.005, decay=0.25)
add_tone(5.62, 0.55, 1318.5, 0.30, pan=0.2, wave_type='bell', attack=0.005, decay=0.45)
# Sparkle burst
for spk_i in range(5):
    add_tone(5.65 + spk_i * 0.04, 0.08, 2000 + spk_i * 350, 0.08, pan=(spk_i%2)*0.4 - 0.2, attack=0.002, decay=0.06)

# -------------------------------------------------------------
# SFX: 6.2s - 7.5s (DISTRIBUCIÓN: RADAR SONAR RIPPLE)
# -------------------------------------------------------------
radar_pings = [6.25, 6.70, 7.15]
for rp in radar_pings:
    add_chirp(rp, 0.35, 1200.0, 500.0, 0.18, pan=-0.1, attack=0.01, decay=0.25)
    add_tone(rp, 0.40, 880.0, 0.12, pan=0.1, wave_type='sine', attack=0.01, decay=0.30)

# -------------------------------------------------------------
# SFX: 7.5s - 8.7s (JOSEADORES RECIBEN NOTIFICACIÓN)
# -------------------------------------------------------------
# 3 rapid modern smartphone notification pings (left, center, right)
add_tone(7.55, 0.18, 1480, 0.22, pan=-0.4, wave_type='bell', attack=0.003, decay=0.12)
add_tone(7.62, 0.22, 1975, 0.24, pan=-0.3, wave_type='bell', attack=0.003, decay=0.16)

add_tone(7.85, 0.18, 1396, 0.22, pan=0.0, wave_type='bell', attack=0.003, decay=0.12)
add_tone(7.92, 0.22, 1760, 0.24, pan=0.1, wave_type='bell', attack=0.003, decay=0.16)

add_tone(8.15, 0.18, 1568, 0.22, pan=0.4, wave_type='bell', attack=0.003, decay=0.12)
add_tone(8.22, 0.25, 2093, 0.25, pan=0.3, wave_type='bell', attack=0.003, decay=0.18)

# -------------------------------------------------------------
# SFX: 8.7s - 9.4s (CLIFFHANGER: FREEZE DINÁMICO & HEARTBEAT)
# -------------------------------------------------------------
# Push-in zoom to button
add_chirp(8.65, 0.38, 200.0, 950.0, 0.22, pan=0.0, attack=0.05, decay=0.08)

# HARD TAPE STOP / RECORD FREEZE AT 9.08s!
stop_idx = int(9.08 * SAMPLE_RATE)
for i in range(stop_idx - int(0.06 * SAMPLE_RATE), stop_idx):
    frac = (stop_idx - i) / (0.06 * SAMPLE_RATE)
    # pitch down tape effect
    left[i] *= frac
    right[i] *= frac

# Mute everything during the dramatic cliffhanger freeze (9.08 to 9.38s)
for i in range(stop_idx, int(9.38 * SAMPLE_RATE)):
    left[i] = 0.0
    right[i] = 0.0

# Deep dramatic sub-bass thump right at the freeze:
add_tone(9.10, 0.25, 48.0, 0.35, pan=0.0, wave_type='sine', attack=0.005, decay=0.20)

# -------------------------------------------------------------
# SFX: 9.4s - 10.0s (TRANSICIÓN A VIDEO 2: PIQUETES TOKEN & OUTRO)
# -------------------------------------------------------------
# Sudden metallic chime + coin whoosh spin for the Piquetes token
add_chirp(9.40, 0.22, 350.0, 1800.0, 0.25, attack=0.01, decay=0.15)
add_tone(9.44, 0.50, 1760, 0.28, pan=0.0, wave_type='bell', attack=0.005, decay=0.40)
add_tone(9.48, 0.50, 2637, 0.20, pan=0.2, wave_type='bell', attack=0.005, decay=0.35)

# Cierre triunfal final: acorde estelar JOSEAME
add_tone(9.70, 0.30, 659.25, 0.22, pan=0.0, wave_type='bell', attack=0.01, decay=0.28)
add_tone(9.70, 0.30, 987.77, 0.20, pan=-0.2, wave_type='bell', attack=0.01, decay=0.28)
add_tone(9.70, 0.30, 1318.5, 0.22, pan=0.2, wave_type='bell', attack=0.01, decay=0.28)

# Subtle limiter / soft-clip
for i in range(TOTAL_SAMPLES):
    left[i] = math.tanh(left[i] * 1.25) * 0.95
    right[i] = math.tanh(right[i] * 1.25) * 0.95

# Export WAV
wav_path = 'assets/audio/joseame/music_sfx_10s.wav'
with wave.open(wav_path, 'wb') as wf:
    wf.setnchannels(2)
    wf.setsampwidth(2)
    wf.setframerate(SAMPLE_RATE)
    raw_data = bytearray()
    for i in range(TOTAL_SAMPLES):
        val_l = max(-32767, min(32767, int(left[i] * 32767)))
        val_r = max(-32767, min(32767, int(right[i] * 32767)))
        raw_data.extend(struct.pack('<hh', val_l, val_r))
    wf.writeframes(raw_data)

print(f"Music & SFX WAV generated successfully: {wav_path}")

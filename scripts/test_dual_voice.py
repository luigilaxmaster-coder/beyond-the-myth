import asyncio
import os
import subprocess
import edge_tts
import scipy.io.wavfile as wavfile

VOICE_MAYA = "en-US-AvaNeural"
VOICE_ALEX = "en-US-ChristopherNeural"
RATE_MAYA = "+15%"
RATE_ALEX = "+15%"

SCENES_EP01 = [
    {"speaker": "Maya", "text": "Wait. Your cereal box is not an ownership chart."},
    {"speaker": "Alex", "text": "That little O-U symbol? It means the product meets the Orthodox Union’s kosher standards. That’s the actual claim."},
    {"speaker": "Maya", "text": "Okay, but what gets checked? Ingredients, equipment, and production. Kosher follows Jewish dietary law. Companies apply for certification, and yes, they pay fees."},
    {"speaker": "Alex", "text": "You can question the service or its price. But a paid certification does not prove that Jewish people secretly control a company, or an entire industry."},
    {"speaker": "Maya", "text": "Want to know who owns the business? Look at company records. Want to know what the certification covers? Check the certifier’s rules."},
    {"speaker": "Alex", "text": "Different questions. Different evidence. A tiny symbol isn’t doing all the jobs the internet gives it."},
    {"speaker": "Maya", "text": "The label belongs on the box. Not on people."}
]

async def test_synthesis():
    out_dir = "c:/Users/PD2/Desktop/cad/video/scripts/test_audio"
    os.makedirs(out_dir, exist_ok=True)
    total_speech_time = 0
    for i, s in enumerate(SCENES_EP01, 1):
        voice = VOICE_MAYA if s["speaker"] == "Maya" else VOICE_ALEX
        rate = RATE_MAYA if s["speaker"] == "Maya" else RATE_ALEX
        mp3_path = f"{out_dir}/ep01_scene_{i}.mp3"
        wav_path = f"{out_dir}/ep01_scene_{i}.wav"
        
        comm = edge_tts.Communicate(s["text"], voice, rate=rate)
        await comm.save(mp3_path)
        
        # Convert to 44.1kHz mono WAV
        subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", mp3_path, "-ar", "44100", "-ac", "1", wav_path], check=True)
        sr, data = wavfile.read(wav_path)
        dur = len(data) / sr
        total_speech_time += dur
        print(f"Scene {i} [{s['speaker']}]: {dur:.2f}s | '{s['text'][:40]}...'")
        
    print(f"\nTotal speech duration: {total_speech_time:.2f}s across 7 lines.")
    print(f"Remaining breathing room for 60.0s timeline: {60.0 - total_speech_time:.2f}s")

if __name__ == "__main__":
    asyncio.run(test_synthesis())

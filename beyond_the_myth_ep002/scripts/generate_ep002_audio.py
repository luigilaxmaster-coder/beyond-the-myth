import asyncio
import os
import json
import subprocess
import edge_tts

SAMPLE_RATE = 44100
VOICE = "en-US-ChristopherNeural"
RATE = "+20%"

SCENES = [
    {
        "id": 1,
        "text": "That tiny symbol on your food? It's a certification, not an ownership code.",
        "on_screen": "CERTIFICATION ≠ OWNERSHIP",
        "source": "OU Kosher Certification (oukosher.org)"
    },
    {
        "id": 2,
        "text": "This is the O-U mark. It means the product meets the Orthodox Union's kosher standards.",
        "on_screen": "OU · KOSHER CERTIFICATION",
        "source": "OU Kosher Symbols Explained [S1]"
    },
    {
        "id": 3,
        "text": "Kosher follows Jewish dietary law. Inspectors check ingredients, equipment, and how food is made.",
        "on_screen": "INGREDIENTS → EQUIPMENT → PROCESS",
        "source": "What Is Kosher Certification? [S2]"
    },
    {
        "id": 4,
        "text": "Companies apply for certification. Yes, they pay fees. The process includes a plant visit, an assessment, and a contract.",
        "on_screen": "APPLICATION → REVIEW → CONTRACT",
        "source": "Steps for Kosher Certification [S3]"
    },
    {
        "id": 5,
        "text": "But paying for a certification service doesn't prove that Jewish people control the food industry.",
        "on_screen": "CERTIFICATION ≠ COLLECTIVE CONTROL",
        "source": "Evidence-Based Public Reasoning [S3]"
    },
    {
        "id": 6,
        "text": "Want to know who owns a company? Check its corporate records. A dietary label answers a different question.",
        "on_screen": "OWNERSHIP? → COMPANY RECORDS",
        "source": "Corporate Filings & Public Disclosures"
    },
    {
        "id": 7,
        "text": "Ask hard questions. Follow the evidence. But hold people responsible for their actions—not an entire community for its identity.",
        "on_screen": "EVIDENCE. NOT COLLECTIVE BLAME.",
        "source": "Ethical Public Accountability"
    },
    {
        "id": 8,
        "text": "The label belongs on the box. Not on an entire community. Beyond the Myth. Facts, not scapegoats.",
        "on_screen": "BEYOND THE MYTH · FACTS, NOT SCAPEGOATS",
        "source": "Beyond the Myth · Facts, not scapegoats"
    }
]

async def synthesize_all():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    raw_dir = os.path.abspath(os.path.join(base_dir, "..", "assets", "audio", "raw"))
    os.makedirs(raw_dir, exist_ok=True)
    
    results = []
    for s in SCENES:
        scene_id = s["id"]
        mp3_path = os.path.join(raw_dir, f"scene_{scene_id}.mp3")
        wav_path = os.path.join(raw_dir, f"scene_{scene_id}.wav")
        vtt_path = os.path.join(raw_dir, f"scene_{scene_id}.vtt")
        
        communicate = edge_tts.Communicate(s["text"], VOICE, rate=RATE, pitch="+0Hz")
        words = []
        submaker = edge_tts.SubMaker()
        
        with open(mp3_path, "wb") as f:
            async for chunk in communicate.stream():
                if chunk["type"] == "audio":
                    f.write(chunk["data"])
                elif chunk["type"] == "WordBoundary":
                    offset_sec = chunk["offset"] / 10_000_000.0
                    duration_sec = chunk["duration"] / 10_000_000.0
                    words.append({
                        "word": chunk["text"],
                        "start": offset_sec,
                        "end": offset_sec + duration_sec
                    })
                    submaker.feed(chunk)
                    
        # Write SRT and VTT
        srt_content = submaker.get_srt()
        with open(vtt_path.replace(".vtt", ".srt"), "w", encoding="utf-8") as f:
            f.write(srt_content)
        
        vtt_lines = ["WEBVTT\n"]
        for line in srt_content.splitlines():
            if "-->" in line:
                vtt_lines.append(line.replace(",", "."))
            else:
                vtt_lines.append(line)
        with open(vtt_path, "w", encoding="utf-8") as f:
            f.write("\n".join(vtt_lines))
            
        # Convert MP3 to 44.1kHz mono WAV for precision mixing
        subprocess.run([
            "ffmpeg", "-y", "-v", "error",
            "-i", mp3_path,
            "-ar", str(SAMPLE_RATE),
            "-ac", "1",
            wav_path
        ], check=True)
        
        probe = subprocess.run([
            "ffprobe", "-v", "error", "-show_entries", "format=duration",
            "-of", "default=noprint_wrappers=1:nokey=1", wav_path
        ], capture_output=True, text=True)
        
        duration = float(probe.stdout.strip())
        print(f"Scene {scene_id} generated: {duration:.3f}s ('{s['text'][:35]}...')")
        
        results.append({
            "id": scene_id,
            "duration": duration,
            "wav_path": wav_path,
            "mp3_path": mp3_path,
            "vtt_path": vtt_path,
            "text": s["text"],
            "on_screen": s["on_screen"],
            "source": s["source"],
            "words": words
        })
        
    meta_path = os.path.join(raw_dir, "speech_manifest.json")
    with open(meta_path, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)
    print(f"\nManifest saved to {meta_path}")

if __name__ == "__main__":
    asyncio.run(synthesize_all())

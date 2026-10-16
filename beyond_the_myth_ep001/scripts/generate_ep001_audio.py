import asyncio
import os
import json
import math
import wave
import struct
import edge_tts

# Audio specifications
SAMPLE_RATE = 44100
TOTAL_DURATION = 60.0 # Exactly 60.0 seconds
TOTAL_FRAMES = 1800
FPS = 30

VOICE = "en-US-ChristopherNeural" # Authoritative, balanced American documentary voice

SCENES = [
    {
        "id": 1,
        "target_start": 0.5,
        "text": "No religious community owns the Federal Reserve. To understand its decisions, follow the institutions—not someone's ancestry.",
        "on_screen": "FOLLOW THE INSTITUTIONS",
        "source": "Board of Governors (FAQ)",
        "sfx": "subtle_whoosh"
    },
    {
        "id": 2,
        "target_start": 8.0,
        "text": "On October seventh, the Fed published minutes from its September meeting.",
        "on_screen": "OCT 7, 2026 · MINUTES RELEASED",
        "source": "FOMC Minutes (Sept 15-16, 2026)",
        "sfx": "paper_slide"
    },
    {
        "id": 3,
        "target_start": 14.2,
        "text": "The system combines public and private features. Its Board of Governors is a federal agency.",
        "on_screen": "PUBLIC + PRIVATE FEATURES",
        "source": "Federal Reserve Act, Section 10",
        "sfx": "card_split"
    },
    {
        "id": 4,
        "target_start": 21.0,
        "text": "The president nominates its members, and the Senate confirms them.",
        "on_screen": "NOMINATION → CONFIRMATION",
        "source": "12 U.S.C. § 241",
        "sfx": "stamp_confirm"
    },
    {
        "id": 5,
        "target_start": 26.5,
        "text": "A committee sets the key interest-rate target: seven Board seats and five regional Reserve Bank presidents.",
        "on_screen": "7 BOARD SEATS + 5 BANK PRESIDENTS",
        "source": "12 U.S.C. § 263 (FOMC)",
        "sfx": "token_count"
    },
    {
        "id": 6,
        "target_start": 34.5,
        "text": "That structure does not make every decision right. It tells us where to look for accountability. Check the votes. Read the records. Challenge the policy.",
        "on_screen": "CHECK VOTES · READ RECORDS · QUESTION POLICY",
        "source": "FOMC Records & Transcripts",
        "sfx": "checklist_pings"
    },
    {
        "id": 7,
        "target_start": 46.0,
        "text": "But blaming Jewish people as a group is not evidence against a policymaker.",
        "on_screen": "IDENTITY IS NOT EVIDENCE",
        "source": "Principles of Evidence & Accountability",
        "sfx": "isolate_tag"
    },
    {
        "id": 8,
        "target_start": 52.0,
        "text": "Hold decision-makers accountable for what they do—not millions of people for who they are.",
        "on_screen": "ACCOUNTABILITY, NOT COLLECTIVE BLAME",
        "source": "Beyond the Myth",
        "sfx": "final_resolve"
    }
]

async def synthesize_scenes(output_dir):
    os.makedirs(output_dir, exist_ok=True)
    results = []
    
    for scene in SCENES:
        scene_id = scene["id"]
        mp3_path = os.path.join(output_dir, f"scene_{scene_id}.mp3")
        vtt_path = os.path.join(output_dir, f"scene_{scene_id}.vtt")
        
        communicate = edge_tts.Communicate(scene["text"], VOICE, rate="+0%", pitch="+0Hz")
        
        words = []
        submaker = edge_tts.SubMaker()
        
        with open(mp3_path, "wb") as f:
            async for chunk in communicate.stream():
                if chunk["type"] == "audio":
                    f.write(chunk["data"])
                elif chunk["type"] == "WordBoundary":
                    # offset and duration in 100ns units
                    offset_sec = chunk["offset"] / 10_000_000.0
                    duration_sec = chunk["duration"] / 10_000_000.0
                    word_text = chunk["text"]
                    words.append({
                        "word": word_text,
                        "start": offset_sec,
                        "end": offset_sec + duration_sec
                    })
                    submaker.feed(chunk)
                    
        srt_content = submaker.get_srt()
        with open(vtt_path.replace(".vtt", ".srt"), "w", encoding="utf-8") as f:
            f.write(srt_content)
            
        # Convert srt to vtt
        vtt_lines = ["WEBVTT\n"]
        for line in srt_content.splitlines():
            if "-->" in line:
                vtt_lines.append(line.replace(",", "."))
            else:
                vtt_lines.append(line)
        with open(vtt_path, "w", encoding="utf-8") as f:
            f.write("\n".join(vtt_lines))
            
        # Measure duration with ffprobe
        import subprocess
        probe = subprocess.run([
            "ffprobe", "-v", "error", "-show_entries", "format=duration",
            "-of", "default=noprint_wrappers=1:nokey=1", mp3_path
        ], capture_output=True, text=True)
        try:
            duration = float(probe.stdout.strip())
        except Exception:
            duration = words[-1]["end"] + 0.3 if words else 5.0

            
        results.append({
            "id": scene_id,
            "mp3_path": mp3_path,
            "vtt_path": vtt_path,
            "words": words,
            "measured_duration": duration,
            "text": scene["text"],
            "target_start": scene["target_start"],
            "on_screen": scene["on_screen"],
            "source": scene["source"]
        })
        print(f"Scene {scene_id} generated: {duration:.2f}s, {len(words)} words.")
        
    return results

if __name__ == "__main__":
    audio_temp_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "assets", "audio", "raw"))
    asyncio.run(synthesize_scenes(audio_temp_dir))

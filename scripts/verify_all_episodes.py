import os
import subprocess
import json

TARGET_DIR = r"G:\My Drive\Videos Youtube"

EXPECTED_EPISODES = [
    "BEYOND_THE_MYTH_Ep01_What_That_Kosher_Symbol_Actually_Means.mp4",
    "BEYOND_THE_MYTH_Ep02_A_Real_Screenshot_Can_Still_Mislead_You.mp4",
    "BEYOND_THE_MYTH_Ep03_Who_Actually_Makes_Fed_Decisions.mp4",
    "BEYOND_THE_MYTH_Ep04_A_List_of_CEOs_Is_Not_an_Ownership_Map.mp4",
    "BEYOND_THE_MYTH_Ep05_Can_You_Be_Jewish_Without_Being_Religious.mp4",
    "BEYOND_THE_MYTH_Ep06_The_Protocols_Forgery_Plagiarism.mp4",
    "BEYOND_THE_MYTH_Ep07_Policy_Critique_vs_Classmate_Scapegoating.mp4",
    "BEYOND_THE_MYTH_Ep08_The_Catholic_Church_and_Nostra_Aetate.mp4",
    "BEYOND_THE_MYTH_Ep09_The_Dreyfus_Affair.mp4",
    "BEYOND_THE_MYTH_Ep10_The_3_Question_Fact_Check_Protocol.mp4"
]

def probe_file(filepath):
    cmd = [
        "ffprobe", "-v", "quiet", "-print_format", "json",
        "-show_format", "-show_streams", filepath
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode != 0:
        return None
    return json.loads(res.stdout)

def main():
    print("=" * 80)
    print(" BEYOND THE MYTH - SEASON 1 MASTER DELIVERY VERIFICATION")
    print(f" Directory: {TARGET_DIR}")
    print("=" * 80)

    all_ok = True
    for idx, filename in enumerate(EXPECTED_EPISODES, 1):
        filepath = os.path.join(TARGET_DIR, filename)
        if not os.path.exists(filepath):
            print(f"[{idx:02d}/10] ❌ MISSING: {filename}")
            all_ok = False
            continue

        size_mb = os.path.getsize(filepath) / (1024 * 1024)
        info = probe_file(filepath)
        if not info:
            print(f"[{idx:02d}/10] ❌ PROBE FAILED: {filename}")
            all_ok = False
            continue

        duration = float(info.get("format", {}).get("duration", 0))
        video_stream = next((s for s in info.get("streams", []) if s.get("codec_type") == "video"), None)
        audio_stream = next((s for s in info.get("streams", []) if s.get("codec_type") == "audio"), None)

        width = video_stream.get("width") if video_stream else 0
        height = video_stream.get("height") if video_stream else 0
        vcodec = video_stream.get("codec_name") if video_stream else "none"
        acodec = audio_stream.get("codec_name") if audio_stream else "none"
        channels = audio_stream.get("channels") if audio_stream else 0

        status = "[PASS]" if (duration >= 59.9 and width == 1080 and height == 1920 and acodec == "aac") else "[WARN]"
        if "WARN" in status:
            all_ok = False

        print(f"[{idx:02d}/10] {status} | {size_mb:5.1f} MB | {duration:5.2f}s | {width}x{height} | V:{vcodec} | A:{acodec}({channels}ch) | {filename}")

    print("=" * 80)
    if all_ok:
        print("ALL 10 EPISODES SUCCESSFULLY VERIFIED AT BROADCAST QUALITY!")
    else:
        print("SOME EPISODES ARE STILL PENDING OR FAILED VERIFICATION.")
    print("=" * 80)

if __name__ == "__main__":
    main()

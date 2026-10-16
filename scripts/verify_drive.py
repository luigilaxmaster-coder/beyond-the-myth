import os
import subprocess
import json

DRIVE_DEST = r"G:\My Drive\Videos Youtube"
files = sorted([f for f in os.listdir(DRIVE_DEST) if f.endswith(".mp4")])

print(f"Total MP4s in Drive: {len(files)}")
print("-" * 80)
for idx, f in enumerate(files, 1):
    path = os.path.join(DRIVE_DEST, f)
    probe = subprocess.run([
        "ffprobe", "-v", "error",
        "-show_entries", "format=duration,size:stream=codec_name,width,height,r_frame_rate",
        "-of", "json", path
    ], capture_output=True, text=True)
    d = json.loads(probe.stdout)
    dur = float(d["format"]["duration"])
    sz_mb = float(d["format"]["size"]) / (1024 * 1024)
    v = next(s for s in d["streams"] if s["codec_name"] in ["h264", "hevc"])
    a = next(s for s in d["streams"] if s["codec_name"] in ["aac", "mp3"])
    fps = v["r_frame_rate"]
    res = f"{v['width']}x{v['height']}"
    print(f"[{idx:02d}/10] {f}")
    print(f"      Duration: {dur:.6f}s | Resolution: {res} | Framerate: {fps} | Video: {v['codec_name']} | Audio: {a['codec_name']} | Size: {sz_mb:.2f} MB")
print("-" * 80)

import os
import re
import json
import time
import shutil
import hashlib
import pathlib
import subprocess

ROOT = pathlib.Path(__file__).resolve().parents[1]
SCRIPT_PATH = ROOT / "scripts" / "season_02_scripts.json"
NPX_CMD = "C:/Program Files/nodejs/npx.cmd"
DEST_ROOT = pathlib.Path(r"G:\My Drive\Videos Youtube")
DEST_DATED = DEST_ROOT / "2026-10-16"

DEST_ROOT.mkdir(parents=True, exist_ok=True)
DEST_DATED.mkdir(parents=True, exist_ok=True)

def probe(file_path):
    cmd = [
        "ffprobe", "-v", "quiet", "-print_format", "json",
        "-show_format", "-show_streams", str(file_path)
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode != 0:
        return None
    return json.loads(res.stdout)

def sha256(file_path):
    h = hashlib.sha256()
    with open(file_path, "rb") as f:
        for chunk in iter(lambda: f.read(1048576), b""):
            h.update(chunk)
    return h.hexdigest()

def run_command(cmd, log_path):
    with open(log_path, "w", encoding="utf8") as f:
        res = subprocess.run(list(map(str, cmd)), stdout=f, stderr=subprocess.STDOUT)
    if res.returncode != 0:
        log_content = log_path.read_text(encoding='utf8', errors='replace')
        raise RuntimeError(f"Command failed ({res.returncode}): {' '.join(map(str, cmd))}\nTail of log:\n{log_content[-800:]}")

def main():
    print("=" * 80, flush=True)
    print(" BEYOND THE MYTH: SEASON 2 RENDER, MUX & FINAL DELIVERY PIPELINE", flush=True)
    print("=" * 80, flush=True)
    print(f" Root Delivery Dir:  {DEST_ROOT}", flush=True)
    print(f" Dated Delivery Dir: {DEST_DATED}", flush=True)
    print("=" * 80, flush=True)

    with open(SCRIPT_PATH, "r", encoding="utf8") as f:
        data = json.load(f)
    episodes = data["episodes"]

    delivery_report = []

    for idx, ep in enumerate(episodes, 1):
        ep_id = ep["episode_id"]
        ep_num = ep["episode_num"]
        title = ep["title"]
        safe_title = re.sub(r'[^A-Za-z0-9]+', '_', title).strip('_')
        master_filename = f"BEYOND_THE_MYTH_S02_EP{ep_num}_{safe_title}.mp4"

        ep_dir = ROOT / f"beyond_the_myth_{ep_id}"
        qa_dir = ep_dir / "qa"
        qa_dir.mkdir(parents=True, exist_ok=True)
        renders_dir = ep_dir / "renders"
        renders_dir.mkdir(parents=True, exist_ok=True)

        visual_mp4 = renders_dir / "visual.mp4"
        master_wav = ep_dir / "assets" / "audio" / "master.wav"
        local_master = renders_dir / master_filename

        print(f"\n[{idx}/10] PROCESSING EPISODE {ep_num} ({ep_id}): {title}", flush=True)
        start_time = time.time()

        # Step 1: HyperFrames Render
        print(f"  [1/3] HyperFrames rendering visual.mp4 @ 30fps (GPU accelerated)...", flush=True)
        render_log = qa_dir / "render.log"
        cmd_render = [
            NPX_CMD, "hyperframes", "render",
            str(ep_dir),
            "-o", str(visual_mp4),
            "--fps", "30",
            "--quality", "delivery",
            "--workers", "2",
            "--gpu"
        ]
        run_command(cmd_render, render_log)
        v_sz_mb = visual_mp4.stat().st_size / (1024 * 1024)
        print(f"        Rendered visual.mp4: {v_sz_mb:.2f} MB", flush=True)

        # Step 2: FFmpeg Mux with Master Audio
        print(f"  [2/3] FFmpeg muxing visual + master audio (AAC stereo, 44.1kHz)...", flush=True)
        mux_log = qa_dir / "mux.log"
        cmd_mux = [
            "ffmpeg", "-y",
            "-i", str(visual_mp4),
            "-i", str(master_wav),
            "-map", "0:v:0",
            "-map", "1:a:0",
            "-c:v", "copy",
            "-c:a", "aac",
            "-b:a", "192k",
            "-ac", "2",
            "-ar", "44100",
            "-t", "60",
            "-movflags", "+faststart",
            str(local_master)
        ]
        run_command(cmd_mux, mux_log)
        m_sz_mb = local_master.stat().st_size / (1024 * 1024)
        print(f"        Muxed master: {m_sz_mb:.2f} MB", flush=True)

        # Probe master
        probe_info = probe(local_master)
        duration = float(probe_info.get("format", {}).get("duration", 0))
        video_stream = next((s for s in probe_info.get("streams", []) if s.get("codec_type") == "video"), {})
        audio_stream = next((s for s in probe_info.get("streams", []) if s.get("codec_type") == "audio"), {})

        w = video_stream.get("width")
        h = video_stream.get("height")
        fps = video_stream.get("r_frame_rate")
        nb_frames = video_stream.get("nb_frames")
        acodec = audio_stream.get("codec_name")
        channels = audio_stream.get("channels")

        print(f"        Verified: {duration:.2f}s | {w}x{h} @ {fps} ({nb_frames} frames) | {acodec} {channels}ch", flush=True)
        assert duration >= 59.9, f"Duration too short: {duration}"
        assert (w, h) == (1080, 1920), f"Resolution mismatch: {w}x{h}"
        assert acodec == "aac" and channels == 2, f"Audio mismatch: {acodec} {channels}ch"

        # Step 3: Copy to Destinations
        print(f"  [3/3] Copying to Google Drive delivery locations...", flush=True)
        target_root = DEST_ROOT / master_filename
        target_dated = DEST_DATED / master_filename

        shutil.copy2(local_master, target_root)
        shutil.copy2(local_master, target_dated)

        hash_local = sha256(local_master)
        hash_root = sha256(target_root)
        hash_dated = sha256(target_dated)

        assert hash_local == hash_root == hash_dated, "SHA256 mismatch across copies!"

        elapsed = time.time() - start_time
        print(f"        [DELIVERED] Root & Dated in {elapsed:.1f}s | SHA256: {hash_local[:12]}...", flush=True)

        delivery_report.append({
            "episode_id": ep_id,
            "episode_num": ep_num,
            "title": title,
            "filename": master_filename,
            "size_mb": round(m_sz_mb, 2),
            "duration": duration,
            "resolution": f"{w}x{h}",
            "fps": fps,
            "frames": nb_frames,
            "sha256": hash_local,
            "status": "DELIVERED"
        })

    # Summary
    print("\n" + "=" * 80, flush=True)
    print(" DELIVERY SUMMARY REPORT", flush=True)
    print("=" * 80, flush=True)
    for r in delivery_report:
        print(f"  [{r['episode_num']}/10] {r['status']} | {r['size_mb']:5.2f} MB | {r['duration']:5.2f}s | {r['filename']}", flush=True)
    print("=" * 80, flush=True)

    # Save manifest
    manifest_path = DEST_DATED / "delivery_manifest.json"
    manifest_path.write_text(json.dumps(delivery_report, indent=2), encoding="utf8")
    shutil.copy2(manifest_path, DEST_ROOT / "season_02_delivery_manifest.json")
    print(f"Saved delivery manifest to {manifest_path} and root.", flush=True)

if __name__ == "__main__":
    main()

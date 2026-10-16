import os
import subprocess
import shutil
import json
import time

BASE_DIR = r"c:\Users\PD2\Desktop\cad\video"
DRIVE_DEST = r"G:\My Drive\Videos Youtube"

EPISODES = [
    {
        "id": "ep001",
        "num": "01",
        "name": "BEYOND_THE_MYTH_Ep01_What_That_Kosher_Symbol_Actually_Means.mp4",
        "title": "What That Kosher Symbol Actually Means"
    },
    {
        "id": "ep002",
        "num": "02",
        "name": "BEYOND_THE_MYTH_Ep02_A_Real_Screenshot_Can_Still_Mislead_You.mp4",
        "title": "A Real Screenshot Can Still Mislead You"
    },
    {
        "id": "ep003",
        "num": "03",
        "name": "BEYOND_THE_MYTH_Ep03_Who_Actually_Makes_Fed_Decisions.mp4",
        "title": "Who Actually Makes Fed Decisions?"
    },
    {
        "id": "ep004",
        "num": "04",
        "name": "BEYOND_THE_MYTH_Ep04_A_List_of_CEOs_Is_Not_an_Ownership_Map.mp4",
        "title": "A List of CEOs Is Not an Ownership Map"
    },
    {
        "id": "ep005",
        "num": "05",
        "name": "BEYOND_THE_MYTH_Ep05_Can_You_Be_Jewish_Without_Being_Religious.mp4",
        "title": "Can You Be Jewish Without Being Religious?"
    },
    {
        "id": "ep006",
        "num": "06",
        "name": "BEYOND_THE_MYTH_Ep06_The_Antisemitic_Forgery_That_Copied_Another_Book.mp4",
        "title": "The Antisemitic Forgery That Copied Another Book"
    },
    {
        "id": "ep007",
        "num": "07",
        "name": "BEYOND_THE_MYTH_Ep07_Criticize_the_Policy_Dont_Blame_Your_Classmate.mp4",
        "title": "Criticize the Policy. Don’t Blame Your Classmate."
    },
    {
        "id": "ep008",
        "num": "08",
        "name": "BEYOND_THE_MYTH_Ep08_The_Catholic_Document_That_Rejects_Collective_Blame.mp4",
        "title": "The Catholic Document That Rejects Collective Blame"
    },
    {
        "id": "ep009",
        "num": "09",
        "name": "BEYOND_THE_MYTH_Ep09_The_Spy_Case_That_Convicted_the_Wrong_Man.mp4",
        "title": "The Spy Case That Convicted the Wrong Man"
    },
    {
        "id": "ep010",
        "num": "10",
        "name": "BEYOND_THE_MYTH_Ep10_Before_You_Share_That_Claim_Ask_These_3_Questions.mp4",
        "title": "Before You Share That Claim, Ask These 3 Questions"
    }
]

def render_episode(ep):
    ep_id = ep["id"]
    ep_dir = os.path.join(BASE_DIR, f"beyond_the_myth_{ep_id}")
    renders_dir = os.path.join(ep_dir, "renders")
    os.makedirs(renders_dir, exist_ok=True)
    
    visual_mp4 = os.path.join(renders_dir, "visual.mp4")
    master_wav = os.path.join(ep_dir, "assets", "audio", "master.wav")
    local_master_mp4 = os.path.join(renders_dir, f"{ep_id}_60s_master.mp4")
    drive_target = os.path.join(DRIVE_DEST, ep["name"])
    
    print("\n" + "="*70)
    print(f"PRODUCING EPISODE {ep['num']}: {ep['title']}")
    print("="*70)
    
    start_time = time.time()
    
    # 1. Render visual stream with HyperFrames
    print(f"1. Rendering HyperFrames visual stream (1080x1920 @ 30fps, 1800 frames)...")
    cmd_render = ["npx.cmd", "--yes", "hyperframes@0.8.152", "render", "-o", visual_mp4, "."]
    res_render = subprocess.run(cmd_render, cwd=ep_dir, capture_output=True, text=True)
    if res_render.returncode != 0:
        print(f"ERROR rendering visual for {ep_id}:")
        print(res_render.stderr or res_render.stdout)
        return False
        
    render_dur = time.time() - start_time
    v_size_mb = os.path.getsize(visual_mp4) / (1024 * 1024)
    print(f"  [OK] Visual stream rendered in {render_dur:.1f}s ({v_size_mb:.1f} MB)")
    
    # 2. Mux audio master
    print(f"2. Muxing 44.1kHz master audio with visual stream...")
    cmd_mux = [
        "ffmpeg", "-y", "-v", "error",
        "-i", visual_mp4,
        "-i", master_wav,
        "-c:v", "copy",
        "-c:a", "aac",
        "-b:a", "320k",
        "-shortest",
        local_master_mp4
    ]
    subprocess.run(cmd_mux, check=True)
    m_size_mb = os.path.getsize(local_master_mp4) / (1024 * 1024)
    print(f"  [OK] Master 60s MP4 created: {local_master_mp4} ({m_size_mb:.1f} MB)")
    
    # 3. Copy to Google Drive destination
    print(f"3. Uploading/Copying MP4 to Google Drive: {drive_target}...")
    shutil.copy2(local_master_mp4, drive_target)
    drive_size_mb = os.path.getsize(drive_target) / (1024 * 1024)
    print(f"  [OK] Saved to Google Drive ({drive_size_mb:.1f} MB)")
    
    # 4. Probe stream integrity
    probe = subprocess.run([
        "ffprobe", "-v", "error",
        "-show_entries", "format=duration,size,bit_rate:stream=codec_name,width,height,r_frame_rate",
        "-of", "json",
        drive_target
    ], capture_output=True, text=True)
    
    info = json.loads(probe.stdout)
    dur = float(info["format"]["duration"])
    streams = info.get("streams", [])
    v_stream = next((s for s in streams if s["codec_name"] in ["h264", "hevc"]), None)
    a_stream = next((s for s in streams if s["codec_name"] in ["aac", "mp3"]), None)
    
    print(f"  [Integrity] Duration: {dur:.3f}s | Video: {v_stream['width']}x{v_stream['height']} @ {v_stream['r_frame_rate']} | Audio: {a_stream['codec_name']}")
    return True

def main():
    os.makedirs(DRIVE_DEST, exist_ok=True)
    success_count = 0
    total_start = time.time()
    
    for ep in EPISODES:
        ok = render_episode(ep)
        if ok:
            success_count += 1
        else:
            print(f"Failed to produce {ep['id']}")
            break
            
    total_elapsed = time.time() - total_start
    print("\n" + "="*70)
    print(f"FINISHED: {success_count}/{len(EPISODES)} EPISODES RENDERED & UPLOADED TO GOOGLE DRIVE")
    print(f"Total time elapsed: {total_elapsed/60.0:.2f} minutes")
    print("="*70)

if __name__ == "__main__":
    main()

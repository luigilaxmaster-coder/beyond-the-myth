import subprocess
import os
import shutil
import time

GDRIVE_DIR = r"G:\My Drive\Videos Youtube"

jobs = [
    {
        "ep": "beyond_the_myth_ep004",
        "title": "Ep 04: A List of CEOs Is Not an Ownership Map",
        "master_name": "ep04_cinematic_master.mp4",
        "gdrive_name": "BEYOND_THE_MYTH_Ep04_A_List_of_CEOs_Is_Not_an_Ownership_Map.mp4"
    },
    {
        "ep": "beyond_the_myth_ep005",
        "title": "Ep 05: Can You Be Jewish Without Being Religious?",
        "master_name": "ep05_cinematic_master.mp4",
        "gdrive_name": "BEYOND_THE_MYTH_Ep05_Can_You_Be_Jewish_Without_Being_Religious.mp4"
    },
    {
        "ep": "beyond_the_myth_ep006",
        "title": "Ep 06: The Protocols Forgery Plagiarism",
        "master_name": "ep06_cinematic_master.mp4",
        "gdrive_name": "BEYOND_THE_MYTH_Ep06_The_Protocols_Forgery_Plagiarism.mp4"
    },
    {
        "ep": "beyond_the_myth_ep007",
        "title": "Ep 07: Policy Critique vs. Classmate Scapegoating",
        "master_name": "ep07_cinematic_master.mp4",
        "gdrive_name": "BEYOND_THE_MYTH_Ep07_Policy_Critique_vs_Classmate_Scapegoating.mp4"
    },
    {
        "ep": "beyond_the_myth_ep008",
        "title": "Ep 08: The Catholic Church & Nostra Aetate",
        "master_name": "ep08_cinematic_master.mp4",
        "gdrive_name": "BEYOND_THE_MYTH_Ep08_The_Catholic_Church_and_Nostra_Aetate.mp4"
    },
    {
        "ep": "beyond_the_myth_ep009",
        "title": "Ep 09: The Dreyfus Affair",
        "master_name": "ep09_cinematic_master.mp4",
        "gdrive_name": "BEYOND_THE_MYTH_Ep09_The_Dreyfus_Affair.mp4"
    },
    {
        "ep": "beyond_the_myth_ep010",
        "title": "Ep 10: The 3-Question Fact-Check Protocol",
        "master_name": "ep010_cinematic_master.mp4",
        "gdrive_name": "BEYOND_THE_MYTH_Ep10_The_3_Question_Fact_Check_Protocol.mp4"
    }
]

print("==================================================")
print("=== BEYOND THE MYTH: BATCH RENDER & DELIVERY ===")
print("==================================================")

for idx, job in enumerate(jobs, 1):
    ep = job["ep"]
    title = job["title"]
    master_name = job["master_name"]
    gdrive_name = job["gdrive_name"]
    
    print(f"\n[{idx}/{len(jobs)}] PROCESSING {title} ({ep})")
    start_t = time.time()
    
    renders_dir = os.path.join(ep, "renders")
    os.makedirs(renders_dir, exist_ok=True)
    
    visual_mp4 = os.path.join(renders_dir, "visual.mp4")
    master_mp4 = os.path.join(renders_dir, master_name)
    audio_wav = os.path.join(ep, "assets", "audio", "master.wav")
    gdrive_target = os.path.join(GDRIVE_DIR, gdrive_name)
    
    # 1. HyperFrames Render
    print(f"  --> [1/3] HyperFrames rendering visual.mp4 @ 30fps...")
    cmd_render = ["cmd.exe", "/c", "npx", "hyperframes", "render", ep, "-o", visual_mp4, "--fps", "30"]
    r_res = subprocess.run(cmd_render, capture_output=True, text=True)
    if r_res.returncode != 0 or not os.path.exists(visual_mp4):
        print(f"  [ERROR] Render failed for {ep}!\nStdout: {r_res.stdout}\nStderr: {r_res.stderr}")
        continue
    v_sz = os.path.getsize(visual_mp4)
    print(f"      Rendered visual.mp4: {v_sz / (1024*1024):.2f} MB")
    
    # 2. FFmpeg Mux with Master Audio
    print(f"  --> [2/3] FFmpeg muxing visual + master audio...")
    cmd_mux = [
        "ffmpeg", "-y",
        "-i", visual_mp4,
        "-i", audio_wav,
        "-c:v", "copy",
        "-c:a", "aac", "-b:a", "192k",
        "-shortest",
        master_mp4
    ]
    m_res = subprocess.run(cmd_mux, capture_output=True, text=True)
    if m_res.returncode != 0 or not os.path.exists(master_mp4):
        print(f"  [ERROR] Mux failed for {ep}!\nStderr: {m_res.stderr}")
        continue
    m_sz = os.path.getsize(master_mp4)
    print(f"      Muxed master: {m_sz / (1024*1024):.2f} MB")
    
    # 3. Deliver to Google Drive
    print(f"  --> [3/3] Copying to Google Drive: {gdrive_name}...")
    shutil.copyfile(master_mp4, gdrive_target)
    gd_sz = os.path.getsize(gdrive_target)
    elapsed = time.time() - start_t
    print(f"      [DELIVERED] {gdrive_target} ({gd_sz / (1024*1024):.2f} MB) in {elapsed:.1f}s")

print("\n==================================================")
print("=== ALL 7 EPISODES RENDERED & DELIVERED ===")
print("==================================================")

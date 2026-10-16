import os
import shutil
import glob

brain_dir = r"C:\Users\PD2\.gemini\antigravity-ide\brain\8b4d5280-76de-48e5-bb15-99c04fe88ed2"
ep03_img_dir = r"c:\Users\PD2\Desktop\cad\video\beyond_the_myth_ep003\assets\images"
os.makedirs(ep03_img_dir, exist_ok=True)

patterns = [
    ("test_fed_building_*.jpg", "scene_1_building.jpg"),
    ("ep03_s2_boardroom_*.jpg", "scene_2_boardroom.jpg"),
    ("ep03_s3_senate_hearing_*.jpg", "scene_3_senate.jpg"),
    ("ep03_s4_desk_fomc_chart_*.jpg", "scene_4_desk.jpg"),
]

for pat, dest_name in patterns:
    matches = glob.glob(os.path.join(brain_dir, pat))
    if matches:
        src = matches[0]
        dst = os.path.join(ep03_img_dir, dest_name)
        shutil.copy2(src, dst)
        print(f"Copied {pat} -> {dest_name} ({os.path.getsize(dst)} bytes)")
    else:
        print(f"NOT FOUND: {pat}")

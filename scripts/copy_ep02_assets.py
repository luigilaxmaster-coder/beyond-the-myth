import os
import shutil
import glob

brain_dir = r"C:\Users\PD2\.gemini\antigravity-ide\brain\8b4d5280-76de-48e5-bb15-99c04fe88ed2"
ep02_img_dir = r"c:\Users\PD2\Desktop\cad\video\beyond_the_myth_ep002\assets\images"
os.makedirs(ep02_img_dir, exist_ok=True)

patterns = [
    ("ep02_s1_phone_macro_*.jpg", "scene_1_phone.jpg"),
    ("ep02_s2_forensic_doc_*.jpg", "scene_2_doc.jpg"),
    ("ep02_s3_investigators_*.jpg", "scene_3_team.jpg"),
    ("ep02_s4_zoomout_desk_*.jpg", "scene_4_desk.jpg"),
]

for pat, dest_name in patterns:
    matches = glob.glob(os.path.join(brain_dir, pat))
    if matches:
        src = matches[0]
        dst = os.path.join(ep02_img_dir, dest_name)
        shutil.copy2(src, dst)
        print(f"Copied {pat} -> {dest_name} ({os.path.getsize(dst)} bytes)")
    else:
        print(f"NOT FOUND: {pat}")

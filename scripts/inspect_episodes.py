import os
import glob
import json
from PIL import Image

for i in range(11, 21):
    ep = f"beyond_the_myth_ep{i:03d}"
    print(f"=== {ep} ===")
    imgs = sorted(glob.glob(f"{ep}/assets/images/*.jpg"))
    for img_p in imgs:
        try:
            with Image.open(img_p) as im:
                print(f"  IMG: {os.path.basename(img_p)} size={im.size} mode={im.mode}")
        except Exception as e:
            print(f"  IMG ERR: {img_p}: {e}")
    m_wav = f"{ep}/assets/audio/master.wav"
    if os.path.exists(m_wav):
        print(f"  AUDIO: master.wav exists, size={os.path.getsize(m_wav)} bytes")
    else:
        print(f"  AUDIO: master.wav MISSING")
    qa_check = f"{ep}/qa/check.json"
    if os.path.exists(qa_check):
        with open(qa_check, "r", encoding="utf-8-sig") as f:
            data = json.load(f)
            c = data.get("contrast", {})
            print(f"  QA check: ok={data.get('ok')} contrast={c.get('passed')}/{c.get('checked')}")
    else:
        print(f"  QA check.json MISSING")
    
    renders = sorted(glob.glob(f"{ep}/renders/*.mp4"))
    print(f"  RENDERS: {[os.path.basename(r) for r in renders]}")

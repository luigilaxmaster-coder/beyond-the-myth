import os
import shutil
import subprocess
import json

src = r"c:\Users\PD2\Desktop\cad\video\beyond_the_myth_ep003\renders\ep003_cinematic_master.mp4"
dst = r"G:\My Drive\Videos Youtube\BEYOND_THE_MYTH_Ep03_Who_Actually_Makes_Fed_Decisions.mp4"

shutil.copy2(src, dst)
sz = os.path.getsize(dst) / (1024 * 1024)
print(f"Delivered Ep03 to Google Drive: {sz:.2f} MB")

probe = subprocess.run([
    "ffprobe", "-v", "error",
    "-show_entries", "format=duration,size:stream=codec_name,width,height",
    "-of", "json", dst
], capture_output=True, text=True)
d = json.loads(probe.stdout)
print("Duration:", d["format"]["duration"])
print("Streams:", [s["codec_name"] for s in d["streams"]])

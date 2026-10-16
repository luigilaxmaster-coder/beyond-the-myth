import os
import hashlib
import sys

sys.stdout.reconfigure(encoding='utf-8')

hash_map = {}
ep_images = {}

for ep_num in range(1, 11):
    ep = f"beyond_the_myth_ep{ep_num:03d}"
    img_dir = os.path.join(ep, "assets", "images")
    ep_images[ep] = []
    if not os.path.exists(img_dir):
        print(f"[{ep}] NO IMAGES DIRECTORY")
        continue
    for fname in sorted(os.listdir(img_dir)):
        p = os.path.join(img_dir, fname)
        if os.path.isfile(p):
            sz = os.path.getsize(p)
            with open(p, "rb") as fp:
                h = hashlib.md5(fp.read()).hexdigest()[:8]
            ep_images[ep].append((fname, sz, h))
            hash_map.setdefault(h, []).append(f"{ep}/{fname}")

print("=== IMAGE AUDIT PER EPISODE ===")
for ep, files in ep_images.items():
    print(f"\n--- {ep} ({len(files)} files) ---")
    for fname, sz, h in files:
        print(f"  {fname:<30} {sz:>10} bytes  md5={h}")

print("\n=== DUPLICATE ANALYSIS ACROSS EPISODES ===")
duplicates = {k: v for k, v in hash_map.items() if len(v) > 1}
if not duplicates:
    print("[PASS] Zero duplicates found! Every single image is 100% UNIQUE across all episodes!")
else:
    print(f"[FAIL] Found {len(duplicates)} duplicate hashes across episodes:")
    for h, flist in duplicates.items():
        print(f"  Hash {h} shared across:")
        for f in flist:
            print(f"    - {f}")

import os
from PIL import Image

for ep_num in range(1, 11):
    ep = f"beyond_the_myth_ep{ep_num:03d}"
    img_dir = os.path.join(ep, "assets", "images")
    if not os.path.exists(img_dir):
        continue
    for fname in os.listdir(img_dir):
        p = os.path.join(img_dir, fname)
        if os.path.isfile(p):
            sz = os.path.getsize(p)
            if sz > 2 * 1024 * 1024:  # > 2MB
                print(f"Optimizing {ep}/{fname} ({sz / (1024*1024):.1f} MB)...")
                try:
                    with Image.open(p) as img:
                        # Convert RGBA to RGB if needed
                        if img.mode in ('RGBA', 'P'):
                            img = img.convert('RGB')
                        # Resize keeping aspect ratio
                        img.thumbnail((1920, 1920), Image.Resampling.LANCZOS)
                        img.save(p, "JPEG", quality=90, optimize=True)
                    new_sz = os.path.getsize(p)
                    print(f"  Optimized to {new_sz / 1024:.1f} KB")
                except Exception as e:
                    print(f"  Failed: {e}")

import os
import shutil
import hashlib
import sys

sys.stdout.reconfigure(encoding='utf-8')

brain_dir = r"C:\Users\PD2\.gemini\antigravity-ide\brain\8b4d5280-76de-48e5-bb15-99c04fe88ed2"

# 1. Ep 04: ensure unique assets
# scene_1_pinboard.jpg, scene_2_sec.jpg, scene_3_boardroom.jpg already unique.
# Remove scene_4_desk.jpg (which was shared with ep03). scene_4_nyse.jpg is unique.
ep04_desk = os.path.join("beyond_the_myth_ep004", "assets", "images", "scene_4_desk.jpg")
if os.path.exists(ep04_desk):
    os.remove(ep04_desk)
    print("Removed duplicate ep04 scene_4_desk.jpg")

# 2. Ep 05: install unique assets
shutil.copyfile(
    os.path.join(brain_dir, "ep05_s1_gathering_1792093753588.jpg"),
    os.path.join("beyond_the_myth_ep005", "assets", "images", "scene_1_gathering.jpg")
)
shutil.copyfile(
    os.path.join(brain_dir, "ep05_s2_heritage_1792096088234.jpg"),
    os.path.join("beyond_the_myth_ep005", "assets", "images", "scene_2_heritage.jpg")
)
shutil.copyfile(
    os.path.join(brain_dir, "ep05_s3_pew_tablet_1792096104492.jpg"),
    os.path.join("beyond_the_myth_ep005", "assets", "images", "scene_3_pew.jpg")
)
# Remove old duplicates in ep05:
for f in ["scene_2_team.jpg", "scene_4_desk.jpg", "scene_5_phone.jpg", "scene_6_closing.jpg"]:
    p = os.path.join("beyond_the_myth_ep005", "assets", "images", f)
    if os.path.exists(p):
        os.remove(p)
        print(f"Removed duplicate ep05 {f}")

# 3. Ep 06: remove old duplicates
for f in ["scene_1_manuscript.jpg", "scene_2_pinboard.jpg", "scene_3_desk.jpg", "scene_4_times_exposé.jpg", "scene_5_boardroom.jpg", "scene_6_phone.jpg", "scene_7_closing.jpg"]:
    p = os.path.join("beyond_the_myth_ep006", "assets", "images", f)
    if os.path.exists(p):
        os.remove(p)
        print(f"Removed duplicate ep06 {f}")

# 4. Ep 07: remove old duplicates
for f in ["scene_1_campus.jpg", "scene_2_policy.jpg", "scene_3_distinction.jpg", "scene_4_opinions.jpg", "scene_5_protection.jpg", "scene_6_accuracy.jpg", "scene_7_closing.jpg"]:
    p = os.path.join("beyond_the_myth_ep007", "assets", "images", f)
    if os.path.exists(p):
        os.remove(p)
        print(f"Removed duplicate ep07 {f}")

# 5. Ep 08: remove old duplicates
for f in ["scene_1_council.jpg", "scene_1_vatican.jpg", "scene_2_manuscript.jpg", "scene_3_council.jpg", "scene_4_desk.jpg", "scene_5_dialogue.jpg", "scene_6_sources.jpg", "scene_7_closing.jpg"]:
    p = os.path.join("beyond_the_myth_ep008", "assets", "images", f)
    if os.path.exists(p):
        os.remove(p)
        print(f"Removed duplicate ep08 {f}")

# 6. Ep 09: install Zola's J'Accuse for Scene 1 and remove old duplicates
shutil.copyfile(
    os.path.join(brain_dir, "test_quota_check_1792096056553.jpg"),
    os.path.join("beyond_the_myth_ep009", "assets", "images", "scene_1_jaccuse.jpg")
)
for f in ["scene_1_prison.jpg", "scene_2_dreyfus.jpg", "scene_2_trial.jpg", "scene_3_forgery.jpg", "scene_4_court.jpg", "scene_5_evidence.jpg", "scene_6_press.jpg", "scene_7_closing.jpg"]:
    p = os.path.join("beyond_the_myth_ep009", "assets", "images", f)
    if os.path.exists(p):
        os.remove(p)
        print(f"Removed duplicate ep09 {f}")

# 7. Ep 10: remove old duplicates
for f in ["scene_1_phone.jpg", "scene_2_pinboard.jpg", "scene_3_evidence.jpg", "scene_4_group.jpg", "scene_5_check.jpg", "scene_6_source.jpg", "scene_7_closing.jpg"]:
    p = os.path.join("beyond_the_myth_ep010", "assets", "images", f)
    if os.path.exists(p):
        os.remove(p)
        print(f"Removed duplicate ep10 {f}")

print("\n=== PURGE & ORGANIZE COMPLETE ===")

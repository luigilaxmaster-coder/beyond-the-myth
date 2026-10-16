import os

brain_dir = r"C:\Users\PD2\.gemini\antigravity-ide\brain\8b4d5280-76de-48e5-bb15-99c04fe88ed2"
files = [
    "ep02_s1_phone_macro_1792092738055.jpg",
    "ep02_s2_forensic_doc_1792092776895.jpg",
    "ep02_s3_investigators_1792092793501.jpg",
    "ep02_s4_zoomout_desk_1792092813716.jpg",
    "test_fed_building_1792092704152.jpg",
    "ep03_s2_boardroom_1792093043320.jpg",
    "ep03_s3_senate_hearing_1792093061851.jpg",
    "ep03_s4_desk_fomc_chart_1792093090098.jpg",
    "ep04_s1_pinboard_1792093439384.jpg",
    "ep04_s2_sec_filing_1792093461266.jpg",
    "ep04_s3_boardroom_skyline_1792093524532.jpg",
    "ep05_s1_gathering_1792093753588.jpg",
    "ep05_s2_heritage_1792096088234.jpg",
    "ep05_s3_pew_tablet_1792096104492.jpg",
    "test_quota_check_1792096056553.jpg"
]

print("=== CHECKING GENERATED ARTIFACTS ===")
for f in files:
    p = os.path.join(brain_dir, f)
    if os.path.exists(p):
        print(f"  [EXISTS] {f} ({os.path.getsize(p)} bytes)")
    else:
        print(f"  [MISSING] {f}")

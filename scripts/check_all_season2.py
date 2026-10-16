import subprocess
import pathlib
import json
import re

ROOT = pathlib.Path(__file__).resolve().parents[1]

results = []
all_passed = True

print("=" * 80)
print(" HYPERFRAMES STRICT QA VALIDATION: SEASON 2 (EP011 - EP020)")
print("=" * 80)

for i in range(11, 21):
    ep = f"beyond_the_myth_ep{i:03d}"
    ep_dir = ROOT / ep
    print(f"\n--> Checking {ep}...")
    
    cmd = ["npx", "hyperframes", "check", str(ep_dir)]
    proc = subprocess.run(cmd, capture_output=True, text=True, cwd=str(ROOT), shell=True)
    out = proc.stdout + "\n" + proc.stderr

    # Parse results
    lint_err = "0 errors" in out and "0 warnings" in out
    runtime_err = "0 errors" in out and "Runtime" in out
    layout_err = "0 issues" in out
    contrast_match = re.search(r"(\d+)/(\d+) text checks pass WCAG AA", out)
    contrast_pass = False
    passed_str = "N/A"
    if contrast_match:
        p, t = int(contrast_match.group(1)), int(contrast_match.group(2))
        contrast_pass = (p == t)
        passed_str = f"{p}/{t} (100%)" if contrast_pass else f"{p}/{t} (FAIL)"

    passed = (proc.returncode == 0) and contrast_pass and layout_err
    status = "[PASS]" if passed else "[FAIL]"
    if not passed:
        all_passed = False

    print(f"    Status: {status}")
    print(f"    Contrast: {passed_str}")
    print(f"    Layout: {'0 issues' if layout_err else 'ISSUES'}")
    print(f"    Exit Code: {proc.returncode}")

    qa_dir = ep_dir / "qa"
    qa_dir.mkdir(parents=True, exist_ok=True)
    (qa_dir / "check.json").write_text(json.dumps({
        'ok': passed,
        'exitCode': proc.returncode,
        'contrast': {
            'passed': int(contrast_match.group(1)) if contrast_match else 0,
            'checked': int(contrast_match.group(2)) if contrast_match else 0
        },
        'output': out
    }, indent=2), encoding='utf8')

    results.append({
        'episode': ep,
        'status': status,
        'contrast': passed_str,
        'ok': passed
    })

print("\n" + "=" * 80)
print(" SUMMARY REPORT:")
for r in results:
    print(f"  {r['episode']}: {r['status']} | Contrast: {r['contrast']}")
print("=" * 80)

if all_passed:
    print("ALL 10 EPISODES PASSED 100% HYPERFRAMES STRICT VALIDATION!")
else:
    print("SOME EPISODES FAILED HYPERFRAMES VALIDATION - REQUIRES FIXING!")

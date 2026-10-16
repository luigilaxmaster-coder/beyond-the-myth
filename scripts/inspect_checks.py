import glob
import os
import json

for i in range(11, 21):
    ep = f"beyond_the_myth_ep{i:03d}"
    checks = glob.glob(f"{ep}/.hyperframes/artifacts/checks/*.json")
    if checks:
        latest = max(checks, key=os.path.getmtime)
        try:
            data = json.load(open(latest, encoding='utf8'))
            ok = data.get('ok')
            c = data.get('contrast', {})
            l = data.get('layout', {})
            lint = data.get('lint', {})
            print(f"{ep}: ok={ok} | lint_err={lint.get('errorCount', 0)} | layout_issues={l.get('issueCount', 0)} | contrast={c.get('passed', 0)}/{c.get('checked', 0)} ({os.path.basename(latest)})")
        except Exception as e:
            print(f"{ep}: reading error {e}")
    else:
        print(f"{ep}: no checks found")

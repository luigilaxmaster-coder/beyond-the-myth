import subprocess
import os

episodes = [f"beyond_the_myth_ep{i:03d}" for i in range(4, 11)]

print("=== CHECKING ALL EPISODES WITH HYPERFRAMES ===")
for ep in episodes:
    print(f"\n--- Checking {ep} ---")
    cmd = ["cmd.exe", "/c", "npx", "hyperframes", "check", ep]
    res = subprocess.run(cmd, capture_output=True, text=True)
    out = res.stdout + res.stderr
    # Filter out verbose font caching lines
    lines = [l for l in out.splitlines() if not l.startswith("[INFO] [Compiler] Fetched")]
    print("\n".join(lines[-15:]))

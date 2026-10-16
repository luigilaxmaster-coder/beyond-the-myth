import json

s2 = json.load(open('scripts/season_02_scripts.json', encoding='utf8'))['episodes']
ps = json.load(open('production/season2_2026-10-16/production_scripts.json', encoding='utf8'))['episodes']

diffs = 0
for e1, e2 in zip(s2, ps):
    for s1, s2_ in zip(e1['scenes'], e2['scenes']):
        if s1['text'] != s2_['text'] or s1['on_screen'] != s2_['on_screen']:
            diffs += 1
            print(f"DIFF [{e1['episode_id']} Scene {s1['id']}]:")
            if s1['text'] != s2_['text']:
                print("  ORIGINAL TEXT:     ", s1['text'])
                print("  CODEX MODIFIED TEXT:", s2_['text'])
            if s1['on_screen'] != s2_['on_screen']:
                print("  ORIGINAL ON_SCREEN:     ", s1['on_screen'])
                print("  CODEX MODIFIED ON_SCREEN:", s2_['on_screen'])

print(f"\nTotal differences found: {diffs}")

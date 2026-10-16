import json

s2 = json.load(open('scripts/season_02_scripts.json', encoding='utf8'))['episodes']
for ep in s2:
    print(f"=== {ep['episode_id']} ({ep['title']}) ===")
    total_words = 0
    for sc in ep['scenes']:
        words = len(sc['text'].split())
        total_words += words
        slot = sc['end'] - sc['start']
        wps = words / slot if slot > 0 else 0
        print(f"  Sc {sc['id']} [{sc['speaker']}]: {slot:4.2f}s | {words:2d} words | {wps*60:5.1f} WPM | \"{sc['text'][:45]}...\"")
    print(f"  TOTAL WORDS: {total_words}\n")

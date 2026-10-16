import urllib.request
import json
import urllib.parse
import os
import subprocess

USER_AGENT = 'BeyondTheMythDocu/1.0 (https://commons.wikimedia.org; educational research)'
CURL_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

def get_commons_direct_url(query):
    api_url = f"https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrnamespace=6&gsrlimit=10&gsrsearch={urllib.parse.quote(query)}&prop=imageinfo&iiprop=url|size|mime"
    req = urllib.request.Request(api_url, headers={'User-Agent': USER_AGENT})
    try:
        with urllib.request.urlopen(req, timeout=12) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            candidates = []
            for pid, p in pages.items():
                title = p.get('title', '')
                ii_list = p.get('imageinfo', [])
                if ii_list:
                    ii = ii_list[0]
                    mime = ii.get('mime', '')
                    w = ii.get('width', 0)
                    h = ii.get('height', 0)
                    url = ii.get('url', '')
                    if mime in ['image/jpeg', 'image/png'] and w >= 400 and h >= 400:
                        candidates.append((w * h, title, url))
            candidates.sort(key=lambda x: x[0], reverse=True)
            if candidates:
                return candidates[0][1], candidates[0][2]
    except Exception as e:
        print(f"API search error for '{query}': {e}")
    return None, None

def download_via_curl(url, target_path):
    os.makedirs(os.path.dirname(os.path.abspath(target_path)), exist_ok=True)
    cmd = ['curl.exe', '-s', '-L', '-A', CURL_UA, url, '-o', target_path]
    res = subprocess.run(cmd, capture_output=True)
    if res.returncode == 0 and os.path.exists(target_path) and os.path.getsize(target_path) > 1000:
        sz = os.path.getsize(target_path)
        print(f"  [SUCCESS] {target_path} ({sz} bytes)")
        return True
    else:
        print(f"  [FAILED] {target_path} (curl rc={res.returncode})")
        return False

# Plan downloads for all missing slots
ep_downloads = {
    # Ep 04: Scene 4 (Stock market / institutional ownership)
    ("beyond_the_myth_ep004", "scene_4_nyse.jpg"): "Trading floor New York Stock Exchange LCCN2011632435",
    
    # Ep 05: Scene 4 (Jewish cultural center / community)
    ("beyond_the_myth_ep005", "scene_4_cultural_center.jpg"): "Princes Road Synagogue Nave",
    
    # Ep 06: The Protocols Forgery (4 scenes)
    ("beyond_the_myth_ep006", "scene_1_nilus_protocols.jpg"): "The Protocols of the Elders of Zion by Nilus (1912)",
    ("beyond_the_myth_ep006", "scene_2_maurice_joly.jpg"): "Maurice Joly",
    ("beyond_the_myth_ep006", "scene_3_parallel_forgery.jpg"): "Proof that the Jewish Protocols were forged",
    ("beyond_the_myth_ep006", "scene_4_times_exposé.jpg"): "TheTimes exposes TheProtocols as a forgery",
    
    # Ep 07: Policy Critique vs Classmate Scapegoating (4 scenes)
    ("beyond_the_myth_ep007", "scene_1_campus_quad.jpg"): "Arlington State College Library students studying",
    ("beyond_the_myth_ep007", "scene_2_diplomatic_podium.jpg"): "United Nations Building Geneva",
    ("beyond_the_myth_ep007", "scene_3_diverse_students.jpg"): "Classroom seminar university students",
    ("beyond_the_myth_ep007", "scene_4_human_rights.jpg"): "Eleanor Roosevelt UDHR",
    
    # Ep 08: Vatican & Nostra Aetate (4 scenes)
    ("beyond_the_myth_ep008", "scene_1_vatican_council.jpg"): "Second Vatican Council by Lothar Wolleh 004",
    ("beyond_the_myth_ep008", "scene_2_stpeters_interior.jpg"): "Saint Peter Basilica interior nave",
    ("beyond_the_myth_ep008", "scene_3_pope_paul_vi.jpg"): "Second Vatican Council by Lothar Wolleh 001",
    ("beyond_the_myth_ep008", "scene_4_vatican_archives.jpg"): "Codex Vaticanus",
    
    # Ep 09: Dreyfus Affair (Scenes 2, 3, 4 - Scene 1 already has Zola's J'Accuse!)
    ("beyond_the_myth_ep009", "scene_2_captain_dreyfus.jpg"): "Alfred Dreyfus",
    ("beyond_the_myth_ep009", "scene_3_military_degradation.jpg"): "Degradation alfred dreyfus",
    ("beyond_the_myth_ep009", "scene_4_devils_island_hut.jpg"): "Devil's Island French Guiana prison",
    
    # Ep 10: Fact Check Protocol (4 scenes)
    ("beyond_the_myth_ep010", "scene_1_mobile_feed.jpg"): "Smartphone hand screen",
    ("beyond_the_myth_ep010", "scene_2_newsroom_station.jpg"): "Computer screen browser workspace",
    ("beyond_the_myth_ep010", "scene_3_lateral_diagram.jpg"): "Digital literacy education chart",
    ("beyond_the_myth_ep010", "scene_4_evidence_magnifier.jpg"): "Magnifying glass on document"
}

print("=== STARTING DOWNLOAD VIA CURL ===")
for (ep_dir, fname), query in ep_downloads.items():
    dest = os.path.join(ep_dir, "assets", "images", fname)
    print(f"[{ep_dir}] Querying: '{query}'...")
    title, url = get_commons_direct_url(query)
    if not url:
        # fallback query with fewer keywords
        parts = query.split()
        if len(parts) > 2:
            short_q = " ".join(parts[:2])
            print(f"  Fallback search: '{short_q}'...")
            title, url = get_commons_direct_url(short_q)
    if url:
        print(f"  Found: {title}")
        download_via_curl(url, dest)
    else:
        print(f"  [ERROR] Could not find any match for '{query}'")

import urllib.request
import json
import urllib.parse
import os
import subprocess

USER_AGENT = 'BeyondTheMythDocu/1.0 (https://commons.wikimedia.org; educational research; contact@beyondthemyth.org)'

def get_thumb_url(title_or_query, width=1280):
    # First try direct title if it starts with File:
    if title_or_query.startswith("File:"):
        url = f"https://commons.wikimedia.org/w/api.php?action=query&format=json&titles={urllib.parse.quote(title_or_query)}&prop=imageinfo&iiprop=url&iiurlwidth={width}"
    else:
        url = f"https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrnamespace=6&gsrlimit=5&gsrsearch={urllib.parse.quote(title_or_query)}&prop=imageinfo&iiprop=url&iiurlwidth={width}"
    req = urllib.request.Request(url, headers={'User-Agent': USER_AGENT})
    try:
        with urllib.request.urlopen(req, timeout=12) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            for pid, p in pages.items():
                title = p.get('title', '')
                ii_list = p.get('imageinfo', [])
                if ii_list:
                    ii = ii_list[0]
                    thumb = ii.get('thumburl') or ii.get('url')
                    if thumb:
                        return title, thumb
    except Exception as e:
        print(f"Error querying {title_or_query}: {e}")
    return None, None

def download_file(url, target_path):
    os.makedirs(os.path.dirname(os.path.abspath(target_path)), exist_ok=True)
    cmd = ['curl.exe', '-s', '-L', '-A', USER_AGENT, url, '-o', target_path]
    res = subprocess.run(cmd)
    if os.path.exists(target_path) and os.path.getsize(target_path) > 10000:
        sz = os.path.getsize(target_path)
        print(f"  [OK] {target_path} ({sz} bytes)")
        return True
    else:
        sz = os.path.getsize(target_path) if os.path.exists(target_path) else 0
        print(f"  [FAIL] {target_path} ({sz} bytes)")
        return False

# Target images that need to be acquired
targets = {
    # Ep 06
    ("beyond_the_myth_ep006", "scene_3_parallel_forgery.jpg"): 'File:Proof that the "Jewish Protocols" were forged.jpg',
    ("beyond_the_myth_ep006", "scene_4_times_exposé.jpg"): 'TheTimes exposes TheProtocols as a forgery',
    
    # Ep 07
    ("beyond_the_myth_ep007", "scene_1_campus_quad.jpg"): 'File:Arlington State College Library, students studying (10010394).jpg',
    ("beyond_the_myth_ep007", "scene_2_diplomatic_podium.jpg"): 'United Nations Geneva conference hall',
    ("beyond_the_myth_ep007", "scene_4_human_rights.jpg"): 'File:Eleanor Roosevelt UDHR (27758131387).jpg',
    
    # Ep 08
    ("beyond_the_myth_ep008", "scene_2_stpeters_interior.jpg"): "Saint Peter Basilica interior baldacchino",
    ("beyond_the_myth_ep008", "scene_4_vatican_archives.jpg"): 'File:Codex Vaticanus B 5.JPG',
    
    # Ep 09
    ("beyond_the_myth_ep009", "scene_2_captain_dreyfus.jpg"): 'File:Alfred Dreyfus (1859-1935).jpg',
    ("beyond_the_myth_ep009", "scene_3_military_degradation.jpg"): 'File:Degradation alfred dreyfus.jpg',
    ("beyond_the_myth_ep009", "scene_4_devils_island_hut.jpg"): 'Devil Island French Guiana prison',
    
    # Ep 10
    ("beyond_the_myth_ep010", "scene_1_mobile_feed.jpg"): 'Smartphone mobile app display screen',
    ("beyond_the_myth_ep010", "scene_2_newsroom_station.jpg"): 'Newsroom desk journalist computer',
    ("beyond_the_myth_ep010", "scene_3_lateral_diagram.jpg"): 'Fact-checking workflow diagram',
    ("beyond_the_myth_ep010", "scene_4_evidence_magnifier.jpg"): 'Magnifying glass on document vintage'
}

print("=== DOWNLOADING TARGET THUMBNAILS ===")
for (ep_dir, fname), q in targets.items():
    dest = os.path.join(ep_dir, "assets", "images", fname)
    print(f"[{ep_dir}] Fetching {fname} via '{q}'...")
    title, url = get_thumb_url(q)
    if url:
        print(f"  Title: {title}")
        download_file(url, dest)
    else:
        # Fallback query
        short_q = q.replace("File:", "").split()[0]
        print(f"  Retrying with fallback: '{short_q}'...")
        title, url = get_thumb_url(short_q)
        if url:
            print(f"  Fallback title: {title}")
            download_file(url, dest)
        else:
            print(f"  [ERROR] Not found for {q}")

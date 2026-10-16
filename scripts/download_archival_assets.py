import urllib.request
import json
import urllib.parse
import os
import shutil

# Custom User-Agent as required by Wikimedia API policy
USER_AGENT = 'BeyondTheMythEducationalDocu/1.0 (contact: documentary_edu@example.com)'

def search_commons_first_image(query, preferred_mime=['image/jpeg', 'image/png']):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrnamespace=6&gsrlimit=10&gsrsearch={urllib.parse.quote(query)}&prop=imageinfo&iiprop=url|size|mime"
    req = urllib.request.Request(url, headers={'User-Agent': USER_AGENT})
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
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
                    img_url = ii.get('url', '')
                    if mime in preferred_mime and w >= 400 and h >= 400:
                        candidates.append((w * h, title, img_url, mime))
            # Sort by resolution (largest first)
            candidates.sort(key=lambda x: x[0], reverse=True)
            if candidates:
                return candidates[0][1], candidates[0][2]
    except Exception as e:
        print(f"Error searching '{query}': {e}")
    return None, None

def download_file(url, target_path):
    req = urllib.request.Request(url, headers={'User-Agent': USER_AGENT})
    try:
        with urllib.request.urlopen(req, timeout=20) as resp, open(target_path, 'wb') as out:
            shutil.copyfileobj(resp, out)
        sz = os.path.getsize(target_path)
        print(f"Downloaded -> {target_path} ({sz} bytes)")
        return True
    except Exception as e:
        print(f"Failed download {url}: {e}")
        return False

# Plan downloads
queries_map = {
    # Ep 04: scene 4
    ("beyond_the_myth_ep004", "scene_4_nyse.jpg"): "New York Stock Exchange trading floor LCCN2011632435",
    
    # Ep 05: scene 4
    ("beyond_the_myth_ep005", "scene_4_center.jpg"): "Jewish Community Center building exterior",
    
    # Ep 06:
    ("beyond_the_myth_ep006", "scene_1_nilus.jpg"): "The Protocols of the Elders of Zion by Nilus (1912) - cleaned",
    ("beyond_the_myth_ep006", "scene_2_joly.jpg"): "M.Joly (cropped)",
    ("beyond_the_myth_ep006", "scene_3_proof.jpg"): "Proof that the Jewish Protocols were forged",
    ("beyond_the_myth_ep006", "scene_4_times.jpg"): "TheTimes exposes TheProtocols as a forgery",
    
    # Ep 07:
    ("beyond_the_myth_ep007", "scene_1_campus.jpg"): "University library students studying Arlington State College",
    ("beyond_the_myth_ep007", "scene_2_press.jpg"): "United Nations Security Council press briefing room",
    ("beyond_the_myth_ep007", "scene_3_students.jpg"): "Students in discussion classroom seminar university",
    ("beyond_the_myth_ep007", "scene_4_humanrights.jpg"): "Eleanor Roosevelt Universal Declaration of Human Rights 1948",
    
    # Ep 08:
    ("beyond_the_myth_ep008", "scene_1_council.jpg"): "Second Vatican Council by Lothar Wolleh 006",
    ("beyond_the_myth_ep008", "scene_2_st_peters.jpg"): "Interior of St. Peter's Basilica baldacchino light",
    ("beyond_the_myth_ep008", "scene_3_paul_vi.jpg"): "Pope Paul VI Vatican Council 1965",
    ("beyond_the_myth_ep008", "scene_4_nostra_aetate.jpg"): "Vatican Secret Archives manuscript Latin document parchment",
    
    # Ep 09:
    ("beyond_the_myth_ep009", "scene_2_dreyfus.jpg"): "Alfred Dreyfus (1859-1935)",
    ("beyond_the_myth_ep009", "scene_3_degradation.jpg"): "Degradation alfred dreyfus",
    ("beyond_the_myth_ep009", "scene_4_devils_island.jpg"): "Alfred Dreyfus in captivity on Devil's Island",
    
    # Ep 10:
    ("beyond_the_myth_ep010", "scene_1_smartphone.jpg"): "Smartphone in hand social media app screen",
    ("beyond_the_myth_ep010", "scene_2_factchecker.jpg"): "Investigative journalist computer workstation dual screen",
    ("beyond_the_myth_ep010", "scene_3_lateral_reading.jpg"): "Information verification research workflow diagram",
    ("beyond_the_myth_ep010", "scene_4_verified_doc.jpg"): "Forensic document analysis magnifying glass inspection"
}

print("=== STARTING ARCHIVAL ASSET DOWNLOADS ===")
for (ep_dir, fname), query in queries_map.items():
    dest_dir = os.path.join(ep_dir, "assets", "images")
    os.makedirs(dest_dir, exist_ok=True)
    dest_path = os.path.join(dest_dir, fname)
    title, url = search_commons_first_image(query)
    if url:
        print(f"[{ep_dir}] Found '{title}' for query '{query}'")
        download_file(url, dest_path)
    else:
        print(f"[{ep_dir}] No result for '{query}' - trying broader search...")
        # fallback broader query
        broad_q = query.split()[:2]
        title, url = search_commons_first_image(" ".join(broad_q))
        if url:
            print(f"[{ep_dir}] Found fallback '{title}'")
            download_file(url, dest_path)
        else:
            print(f"[{ep_dir}] FAILED to find image for {query}")

import urllib.request
import json
import urllib.parse
import os
import subprocess

USER_AGENT = 'BeyondTheMythDocu/1.0 (https://commons.wikimedia.org; educational research; contact@beyondthemyth.org)'

def download_thumb(title, dest_path, width=1280):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&format=json&titles={urllib.parse.quote(title)}&prop=imageinfo&iiprop=url&iiurlwidth={width}"
    req = urllib.request.Request(url, headers={'User-Agent': USER_AGENT})
    try:
        with urllib.request.urlopen(req, timeout=12) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            for pid, p in pages.items():
                ii_list = p.get('imageinfo', [])
                if ii_list:
                    thumb = ii_list[0].get('thumburl') or ii_list[0].get('url')
                    if thumb:
                        os.makedirs(os.path.dirname(os.path.abspath(dest_path)), exist_ok=True)
                        cmd = ['curl.exe', '-s', '-L', '-A', USER_AGENT, thumb, '-o', dest_path]
                        subprocess.run(cmd)
                        if os.path.exists(dest_path) and os.path.getsize(dest_path) > 10000:
                            print(f"Downloaded {dest_path} ({os.path.getsize(dest_path)} bytes)")
                            return True
    except Exception as e:
        print(f"Error {title}: {e}")
    return False

# Download for Ep 07 & Ep 10
items = [
    ("File:Headquarters of the United Nations, New York City, 20231001 1103 1006.jpg", "beyond_the_myth_ep007/assets/images/scene_2_diplomatic_podium.jpg"),
    ("File:Black smartphone in hand (Unsplash).jpg", "beyond_the_myth_ep010/assets/images/scene_1_mobile_feed.jpg"),
    ("File:Workspace setup with a computer monitor and desk lamp in an office environment.jpg", "beyond_the_myth_ep010/assets/images/scene_2_newsroom_station.jpg"),
    ("File:Job Listings.jpg", "beyond_the_myth_ep010/assets/images/scene_4_evidence_magnifier.jpg"),
]

for title, dest in items:
    download_thumb(title, dest)

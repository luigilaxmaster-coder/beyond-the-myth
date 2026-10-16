import urllib.request
import json
import urllib.parse
import os
import subprocess

USER_AGENT = 'BeyondTheMythDocu/1.0 (https://commons.wikimedia.org; educational research; contact@beyondthemyth.org)'

def fetch_image_by_title(title, dest_path, width=1280):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&format=json&titles={urllib.parse.quote(title)}&prop=imageinfo&iiprop=url|mime&iiurlwidth={width}"
    req = urllib.request.Request(url, headers={'User-Agent': USER_AGENT})
    try:
        with urllib.request.urlopen(req, timeout=12) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            for pid, p in pages.items():
                ii_list = p.get('imageinfo', [])
                if ii_list:
                    ii = ii_list[0]
                    thumb = ii.get('thumburl') or ii.get('url')
                    mime = ii.get('mime')
                    print(f"[{title}] mime: {mime}, thumb: {thumb}")
                    if thumb:
                        cmd = ['curl.exe', '-s', '-L', '-A', USER_AGENT, thumb, '-o', dest_path]
                        subprocess.run(cmd)
                        if os.path.exists(dest_path) and os.path.getsize(dest_path) > 10000:
                            print(f"  Downloaded: {dest_path} ({os.path.getsize(dest_path)} bytes)")
                            return True
    except Exception as e:
        print(f"Error {title}: {e}")
    return False

# Test specific known photos
replacements = {
    ("beyond_the_myth_ep006", "scene_4_times.jpg"): "File:TheTimes exposes TheProtocols as a forgery.jpg",
    ("beyond_the_myth_ep007", "scene_2_diplomatic.jpg"): "File:United Nations General Assembly hall.jpg",
    ("beyond_the_myth_ep010", "scene_1_phone.jpg"): "File:Hand holding smartphone (cropped).jpg",
    ("beyond_the_myth_ep010", "scene_2_workspace.jpg"): "File:Computer workstation in an office.jpg",
    ("beyond_the_myth_ep010", "scene_3_diagram.jpg"): "File:Data flow diagram.png",
    ("beyond_the_myth_ep010", "scene_4_magnifier.jpg"): "File:Magnifying glass with focus on newspaper.jpg"
}

for (ep, fname), title in replacements.items():
    dest = os.path.join(ep, "assets", "images", fname)
    fetch_image_by_title(title, dest)

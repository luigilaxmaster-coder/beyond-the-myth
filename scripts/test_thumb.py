import urllib.request
import json
import urllib.parse
import subprocess

USER_AGENT = 'BeyondTheMythDocu/1.0 (educational; beyondthemyth@example.org)'

def test_thumb(title):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&format=json&titles={urllib.parse.quote(title)}&prop=imageinfo&iiprop=url&iiurlwidth=1080"
    req = urllib.request.Request(url, headers={'User-Agent': USER_AGENT})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            for pid, p in pages.items():
                ii = p.get('imageinfo', [{}])[0]
                thumb_url = ii.get('thumburl')
                print(f"[{title}] thumburl: {thumb_url}")
                if thumb_url:
                    cmd = ['curl.exe', '-s', '-L', '-A', USER_AGENT, thumb_url, '-o', 'test_thumb.jpg']
                    subprocess.run(cmd)
                    import os
                    if os.path.exists('test_thumb.jpg'):
                        print(f"  Downloaded size: {os.path.getsize('test_thumb.jpg')} bytes")
    except Exception as e:
        print(f"Error: {e}")

test_thumb('File:Degradation alfred dreyfus.jpg')
test_thumb('File:Eleanor Roosevelt UDHR (27758131387).jpg')
test_thumb('File:Codex Vaticanus B 5.JPG')

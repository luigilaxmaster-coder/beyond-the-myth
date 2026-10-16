import urllib.request
import json
import urllib.parse

USER_AGENT = 'BeyondTheMythDocu/1.0 (educational research; contact@beyondthemyth.org)'

def search_photos(query, limit=5):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrnamespace=6&gsrlimit={limit}&gsrsearch={urllib.parse.quote(query)}&prop=imageinfo&iiprop=url|mime|size&iiurlwidth=1280"
    req = urllib.request.Request(url, headers={'User-Agent': USER_AGENT})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            results = []
            for pid, p in pages.items():
                title = p.get('title', '')
                ii_list = p.get('imageinfo', [])
                if ii_list:
                    ii = ii_list[0]
                    mime = ii.get('mime')
                    if mime in ['image/jpeg', 'image/png']:
                        results.append((title, ii.get('thumburl'), ii.get('width'), ii.get('height')))
            return results
    except Exception as e:
        print(f"Error {query}: {e}")
        return []

queries = [
    'United Nations General Assembly',
    'Smartphone in hand',
    'Computer desk monitor office',
    'Magnifying glass newspaper',
    'Fact check verification'
]

for q in queries:
    res = search_photos(q, 3)
    print(f"=== {q} ===")
    for title, url, w, h in res:
        print(f"  {title} ({w}x{h}) -> {url}")

import urllib.request
import json
import urllib.parse

def search_commons(query, limit=5):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrnamespace=6&gsrlimit={limit}&gsrsearch={urllib.parse.quote(query)}&prop=imageinfo&iiprop=url|size|mime"
    req = urllib.request.Request(url, headers={'User-Agent': 'BeyondTheMythDocu/1.0 (educational documentary)'})
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
                    results.append({
                        'title': title,
                        'url': ii.get('url'),
                        'width': ii.get('width'),
                        'height': ii.get('height'),
                        'mime': ii.get('mime')
                    })
            return results
    except Exception as e:
        return str(e)

test_queries = [
    'Protocols of the Elders of Zion Nilus',
    'Maurice Joly',
    'Philip Graves Protocols Times',
    'Second Vatican Council Wolleh',
    'Alfred Dreyfus',
    'New York Stock Exchange trading floor'
]

for q in test_queries:
    res = search_commons(q, 3)
    print(f"=== Query: {q} ===")
    if isinstance(res, list):
        for r in res:
            print(f"  {r['title']} ({r['width']}x{r['height']}) -> {r['url']}")
    else:
        print("  Error:", res)

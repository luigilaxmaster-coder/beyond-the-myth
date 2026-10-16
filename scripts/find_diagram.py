import urllib.request, json, urllib.parse

url = "https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrnamespace=6&gsrlimit=5&gsrsearch=" + urllib.parse.quote("Critical thinking chart") + "&prop=imageinfo&iiprop=url|mime&iiurlwidth=1280"
req = urllib.request.Request(url, headers={'User-Agent': 'BeyondTheMythDocu/1.0'})
with urllib.request.urlopen(req) as r:
    d = json.loads(r.read().decode('utf-8'))
    for pid, p in d.get('query', {}).get('pages', {}).items():
        ii = p.get('imageinfo', [{}])[0]
        if ii.get('mime') in ['image/jpeg', 'image/png']:
            print(p.get('title'), '->', ii.get('thumburl'))

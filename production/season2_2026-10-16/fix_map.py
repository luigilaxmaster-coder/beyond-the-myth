from pathlib import Path
p=Path('beyond_the_myth_ep018/index.html');s=p.read_text(encoding='utf8').replace('.front{stroke:', '.front{fill:none;stroke:');p.write_text(s,encoding='utf8')

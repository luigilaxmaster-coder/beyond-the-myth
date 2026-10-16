from pathlib import Path
R=Path('C:/Users/PD2/Desktop/cad/video')
p=R/'beyond_the_myth_ep013/index.html';s=p.read_text(encoding='utf8').replace('class="orbit"','class="orbit" data-layout-allow-overflow="true"').replace('</style>','.numismatic{z-index:3}.years{z-index:4}</style>');p.write_text(s,encoding='utf8')
p=R/'beyond_the_myth_ep015/index.html';s=p.read_text(encoding='utf8').replace("{rotation:35,y:-110},{rotation:0,y:0","{y:-110},{y:0");p.write_text(s,encoding='utf8')

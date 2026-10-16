from pathlib import Path
R=Path('C:/Users/PD2/Desktop/cad/video')
p=R/'beyond_the_myth_ep013/index.html';s=p.read_text(encoding='utf8').replace("tl.set('.numismatic',{opacity:0},0);",'').replace('</style>','.numismatic{opacity:0}</style>');p.write_text(s,encoding='utf8')
p=R/'beyond_the_myth_ep020/index.html';s=p.read_text(encoding='utf8').replace('</style>','.context{opacity:0}</style>').replace("const tl=gsap.timeline({paused:true});","const tl=gsap.timeline({paused:true});tl.set('.context',{opacity:1},24.1);");p.write_text(s,encoding='utf8')

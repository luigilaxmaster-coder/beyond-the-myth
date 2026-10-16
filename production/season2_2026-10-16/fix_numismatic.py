from pathlib import Path
p=Path('beyond_the_myth_ep013/index.html');s=p.read_text(encoding='utf8').replace("const tl=gsap.timeline({paused:true});","const tl=gsap.timeline({paused:true});tl.set('.numismatic',{opacity:0},0);tl.set('.numismatic',{opacity:1},23.7);");p.write_text(s,encoding='utf8')

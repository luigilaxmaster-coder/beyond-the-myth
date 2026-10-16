import json, pathlib, copy
ROOT=pathlib.Path(__file__).resolve().parents[2]
OUT=pathlib.Path(__file__).parent
data=json.loads((ROOT/'scripts/season_02_scripts.json').read_text(encoding='utf-8-sig'))
original=copy.deepcopy(data)
changes=[]
def change(ep,scene,field,value,reason,url):
    e=next(x for x in data['episodes'] if x['episode_id']==ep)
    obj=e if scene is None else e['scenes'][scene-1]
    changes.append(dict(episode=ep,scene=scene,field=field,before=obj.get(field),after=value,reason=reason,source=url))
    obj[field]=value
boe='https://www.bankofengland.co.uk/explainers/who-owns-the-bank-of-england'
tunnel='https://www.factcheck.org/2024/01/what-we-know-about-the-brooklyn-synagogue-tunnel/'
seal='https://prologue.blogs.archives.gov/2015/06/20/the-great-seal-celebrating-233-years-of-a-national-emblem/'
adl='https://www.adl.org/resources/news/4000-jews-absent-during-world-trade-center-attack'
plague='https://cojs.org/pope-clement-vi-1348-papal-document/'
ford='https://encyclopedia.ushmm.org/content/en/article/antisemitism-and-henry-fords-international-jew'
war='https://encyclopedia.ushmm.org/content/en/article/antisemitism-in-history-world-war-i'
change('ep012',4,'text','Here is what city inspectors actually reported: a sixty-foot unauthorized underground tunnel beneath a rear extension near the synagogue. Accounts linked the excavation to a dispute over expanding prayer space.','The city description does not establish two synagogue basements or the excavators\' motive as an engineering finding.',tunnel)
change('ep012',4,'on_screen','60-FOOT UNAUTHORIZED TUNNEL · BUILDING SAFETY VIOLATIONS','Remove overbroad zero connections assertion.',tunnel)
change('ep012',5,'text','It did not connect to the children’s museum across the street. Chabad leadership condemned the excavation, and city officials ordered work to stabilize the affected buildings.','No verified immediate report to inspectors; avoid claiming that timing.',tunnel)
change('ep012',5,'on_screen','NO MUSEUM CONNECTION · LEADERSHIP CONDEMNED EXCAVATION','Match verified account.',tunnel)
change('ep012',6,'text','A real municipal safety violation became fuel for unsupported accusations. Read the city’s documented findings, and separate what inspectors established from what people added online.','Do not claim possession of verified official blueprints.',tunnel)
change('ep012',6,'on_screen','READ THE DOCUMENTED FINDINGS','No official blueprint reproduced.',tunnel)
change('ep013',4,'text','Franklin, Jefferson, and John Adams served on the first committee. Years later, Charles Thomson finalized the design. His report explains the pyramid as strength and duration, and the eye as providence.','Thomson was not a member of the first committee.',seal)
change('ep014',3,'text','The story distorted early efforts to locate Israelis thought to have been near the attack sites. A number connected to worried families became a fabricated list of workers supposedly warned to stay home.','Not an ordinary daily metropolitan census; distinguish search inquiries from absentees.',adl)
change('ep014',3,'on_screen','INQUIRIES ABOUT MISSING PEOPLE ≠ ABSENCE LIST','Remove census assertion.',adl)
change('ep014',4,'text','The claim is false. Jewish people were among those killed, and memorial records preserve their individual lives. Estimates of the Jewish death toll vary; the memorial itself does not classify every victim by religion.','Avoid implying memorial religion census or a precise official faith count.',adl)
change('ep014',4,'on_screen','JEWISH VICTIMS ARE DOCUMENTED · REMEMBER INDIVIDUAL LIVES','Faith totals are estimates.',adl)
change('ep015',5,'text','His decree pointed to places where the plague struck even though no Jewish communities lived there. That observation undermined the accusation; it was not a statistical study proving identical death rates.','The decree gives a counterexample, not measured identical rates.',plague)
change('ep015',5,'on_screen','PLAGUE ALSO STRUCK PLACES WITHOUT JEWISH COMMUNITIES','No precise epidemiological rates established.',plague)
change('ep017',2,'text','In nineteen-twenty, Ford’s newspaper, The Dearborn Independent, began publishing a series of antisemitic articles. Across ninety-one installments, it promoted conspiracy claims drawing on the forged Protocols.','Ford had acquired the newspaper earlier, not in 1920.',ford)
change('ep017',2,'on_screen','1920–1922: THE INTERNATIONAL JEW SERIES','Distinguish article series from newspaper ownership period.',ford)
change('ep017',5,'text','Yet people still quote those articles without mentioning the public apology issued in Ford’s name. His success in automotive manufacturing did not make those historical accusations true.','Public apology is not a sworn retraction.',ford)
change('ep018',2,'text','In November nineteen-eighteen, Germany accepted an armistice ending the fighting in World War One. Its armies had been retreating, its allies collapsing, and its military leadership seeking a way out.','Distinguish armistice from formal surrender.',war)
change('ep018',5,'source','German Jewish wartime service · USHMM historical overview','Do not attribute final wartime deaths to a 1916 census.',war)
change('ep019',4,'text','Many Ashkenazi Jewish families adopted fixed hereditary surnames under state laws in the eighteenth and nineteenth centuries. Napoleon’s eighteen-oh-eight decree was one example. Other Jewish communities had used hereditary names much earlier.','Avoid treating all European Jewish communities as having one surname history.','https://gedenkbuch.saarbruecken.de/fakten_und_erklaerungen/juden_in_saarbruecken/anfaenge_1750_1850/franzoesischer_revolution_judenemanzipation')
change('ep019',5,'text','Names could reflect occupations, places, family choices, or official requirements. Similar names were used across communities. A surname alone cannot reliably establish a person’s religion or ancestry.','Not every family was assigned an arbitrary name by a clerk.','https://gedenkbuch.saarbruecken.de/fakten_und_erklaerungen/juden_in_saarbruecken/anfaenge_1750_1850/franzoesischer_revolution_judenemanzipation')
sources=[boe,tunnel,seal,adl,plague,war,ford,war,'https://gedenkbuch.saarbruecken.de/fakten_und_erklaerungen/juden_in_saarbruecken/anfaenge_1750_1850/franzoesischer_revolution_judenemanzipation','https://encyclopedia.ushmm.org/content/en/article/the-united-states-and-the-nazi-threat-1933-37']
for e,url in zip(data['episodes'],sources):
    e['primary_source_url']=url
    epdir=ROOT/('beyond_the_myth_'+e['episode_id'])
    (epdir/'production_script.json').write_text(json.dumps(e,ensure_ascii=False,indent=2),encoding='utf8')
    (epdir/'BRIEF.md').write_text(f'---\nworkflow: general-video\nflow: automation\nstoryboard: no\n---\n# {e["title"]}\n60.00s, 1080x1920, 30fps. Original requested scene times, Maya/Alex alternating.\n{e["visual_paradigm"]}\nHero: {e["hero_object"]}\nFour exclusive generated photographic plates, marked AI reconstruction. Bespoke layout, motion and widget; no cloned episode templates. Rendering and destination copy explicitly requested.\nPrimary research: {url}\n',encoding='utf8')
(OUT/'production_scripts.json').write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf8')
(OUT/'editorial_changes.json').write_text(json.dumps(changes,ensure_ascii=False,indent=2),encoding='utf8')
(OUT/'EDITORIAL_REVIEW.md').write_text('# Editorial verification — 2026-10-16\nOriginal master retained unchanged. Production copy retains every original start/end time.\nPhotographic assets are AI illustrations; no invented document is presented as original evidence. Widgets are editorial diagrams.\n\n'+ '\n\n'.join(f'## {c["episode"]} scene {c["scene"]}: {c["field"]}\n{c["reason"]}\nSource: {c["source"]}\nBefore: {c["before"]}\nAfter: {c["after"]}' for c in changes),encoding='utf8')
print('Prepared 10 production scripts; editorial changes:',len(changes))

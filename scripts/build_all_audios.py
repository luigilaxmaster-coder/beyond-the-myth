import asyncio
import os
import json
import math
import subprocess
import numpy as np
import scipy.io.wavfile as wavfile
import edge_tts

SAMPLE_RATE = 44100
TOTAL_DURATION = 60.0
TOTAL_SAMPLES = int(SAMPLE_RATE * TOTAL_DURATION) # 2,646,000

VOICE_MAYA = "en-US-AvaNeural"
VOICE_ALEX = "en-US-ChristopherNeural"
RATE_MAYA = "+14%"
RATE_ALEX = "+14%"

EPISODES = [
    {
        "id": "ep001",
        "num": "01",
        "title": "What That Kosher Symbol Actually Means",
        "cover_text": "WHAT DOES THIS MEAN?",
        "topic": "kosher_symbol",
        "base_key": 87.31, # F
        "scenes": [
            {"speaker": "Maya", "text": "Wait. Your cereal box is not an ownership chart.", "on_screen": "CERTIFICATION ≠ OWNERSHIP", "source": "OU Kosher (oukosher.org)"},
            {"speaker": "Alex", "text": "That little O-U symbol? It means the product meets the Orthodox Union’s kosher standards. That’s the actual claim.", "on_screen": "OU · KOSHER CERTIFICATION", "source": "OU Kosher Symbols Explained"},
            {"speaker": "Maya", "text": "Okay, but what gets checked? Ingredients, equipment, and production. Kosher follows Jewish dietary law. Companies apply for certification, and yes, they pay fees.", "on_screen": "INGREDIENTS → EQUIPMENT → PROCESS", "source": "What Is Kosher Certification?"},
            {"speaker": "Alex", "text": "You can question the service or its price. But a paid certification does not prove that Jewish people secretly control a company, or an entire industry.", "on_screen": "CERTIFICATION ≠ COLLECTIVE CONTROL", "source": "Evidence-Based Public Reasoning"},
            {"speaker": "Maya", "text": "Want to know who owns the business? Look at company records. Want to know what the certification covers? Check the certifier’s rules.", "on_screen": "OWNERSHIP? → COMPANY RECORDS", "source": "Corporate Filings & Public Disclosures"},
            {"speaker": "Alex", "text": "Different questions. Different evidence. A tiny symbol isn’t doing all the jobs the internet gives it.", "on_screen": "DIFFERENT QUESTIONS · DIFFERENT EVIDENCE", "source": "Evidence-Based Public Reasoning"},
            {"speaker": "Maya", "text": "The label belongs on the box. Not on people.", "on_screen": "THE LABEL BELONGS ON THE BOX", "source": "Beyond the Myth · Facts, not scapegoats"}
        ],
        "sfx_theme": "market"
    },
    {
        "id": "ep002",
        "num": "02",
        "title": "A Real Screenshot Can Still Mislead You",
        "cover_text": "REAL IMAGE. MISSING CONTEXT.",
        "topic": "screenshot_context",
        "base_key": 116.54, # Bb
        "scenes": [
            {"speaker": "Alex", "text": "A screenshot can be real—and still mislead you.", "on_screen": "REAL SCREENSHOT ≠ WHOLE STORY", "source": "Digital Inquiry Group"},
            {"speaker": "Maya", "text": "Try this made-up example. Crop a sentence after “I agree,” and hide the part that says “with neither claim.”", "on_screen": "DEMO: CROPPING CHANGES MEANING", "source": "Lateral Reading Methods"},
            {"speaker": "Alex", "text": "Same words. Different meaning. Now imagine a post accusing Jewish people of something, using one cropped quote as the whole argument.", "on_screen": "ONE CROPPED QUOTE ≠ PROOF", "source": "Harvard Misinformation Review"},
            {"speaker": "Maya", "text": "Before sharing it, open the original. Who said it? When? What came before and after? Are we seeing a quote, a translation, or somebody’s caption?", "on_screen": "CHECK: WHO · WHEN · CONTEXT", "source": "Digital Media Literacy Standards"},
            {"speaker": "Alex", "text": "Then check an independent source. And even if one person really said something awful, that does not make an entire community responsible.", "on_screen": "INDIVIDUAL ACTIONS ≠ COLLECTIVE GUILT", "source": "Principles of Evidence & Accountability"},
            {"speaker": "Maya", "text": "Context isn’t an excuse. It’s how you figure out what actually happened, and who actually did it.", "on_screen": "CONTEXT REVEALS WHAT HAPPENED", "source": "Digital Inquiry Group"},
            {"speaker": "Alex", "text": "Zoom out before you call it proof.", "on_screen": "ZOOM OUT BEFORE YOU CALL IT PROOF", "source": "Beyond the Myth · Facts, not scapegoats"}
        ],
        "sfx_theme": "phone"
    },
    {
        "id": "ep003",
        "num": "03",
        "title": "Who Actually Makes Fed Decisions?",
        "cover_text": "WHO ACTUALLY DECIDES?",
        "topic": "fed_decisions",
        "base_key": 77.78, # Eb
        "scenes": [
            {"speaker": "Maya", "text": "The Fed has a decision process. Let’s actually follow it.", "on_screen": "FOLLOW THE INSTITUTIONAL PROCESS", "source": "Federal Reserve (federalreserve.gov)"},
            {"speaker": "Alex", "text": "The Federal Reserve is America’s central bank. Its structure combines public and private features—not a religious ownership system.", "on_screen": "PUBLIC + PRIVATE STRUCTURE", "source": "Federal Reserve Act, Sec. 10"},
            {"speaker": "Maya", "text": "Its Board of Governors is a federal agency. The president nominates governors, and the Senate confirms them. That process is publicly described.", "on_screen": "PRESIDENTIAL NOMINATION → SENATE CONFIRMATION", "source": "12 U.S.C. § 241"},
            {"speaker": "Alex", "text": "A key policy committee has twelve voting seats: seven governors and five regional Reserve Bank presidents. Its policy decisions influence interest rates across the economy.", "on_screen": "12 VOTING SEATS: 7 GOVERNORS + 5 PRESIDENTS", "source": "12 U.S.C. § 263 (FOMC)"},
            {"speaker": "Maya", "text": "Does that make every decision good? Absolutely not. Ask who voted, what evidence they used, and who benefits. Those are real accountability questions.", "on_screen": "ACCOUNTABILITY: VOTES · EVIDENCE · IMPACT", "source": "FOMC Records & Public Transcripts"},
            {"speaker": "Alex", "text": "But someone’s Jewish identity is not evidence of a secret command chain. Check authority, records, and decisions.", "on_screen": "CHECK AUTHORITY · RECORDS · DECISIONS", "source": "Public Decision Framework"},
            {"speaker": "Maya", "text": "Question power. Don’t replace the investigation with a stereotype.", "on_screen": "QUESTION POWER · REJECT STEREOTYPES", "source": "Beyond the Myth · Facts, not scapegoats"}
        ],
        "sfx_theme": "civic"
    },
    {
        "id": "ep004",
        "num": "04",
        "title": "A List of CEOs Is Not an Ownership Map",
        "cover_text": "NAMES AREN’T A CONTROL MAP",
        "topic": "ceo_list_ownership",
        "base_key": 98.0, # G
        "scenes": [
            {"speaker": "Alex", "text": "A list of CEOs is not an ownership map.", "on_screen": "A LIST OF NAMES ≠ OWNERSHIP MAP", "source": "SEC EDGAR Disclosures"},
            {"speaker": "Maya", "text": "Picture a post showing media executives with one thing in common. Then it jumps to a claim about an entire community.", "on_screen": "THE JUMP FROM NAMES TO CONSPIRACY", "source": "Corporate Governance Principles"},
            {"speaker": "Alex", "text": "Hold on. Even a completely accurate list would not show who owns the shares, who has voting power, or who made a particular editorial decision.", "on_screen": "SHARES · VOTING RIGHTS · DECISIONS", "source": "SEC Form 10-K & DEF 14A"},
            {"speaker": "Maya", "text": "For a public company, start with official filings. Look for major shareholders, voting rights, and the board. Then investigate the decision you’re actually questioning.", "on_screen": "OFFICIAL FILINGS: BOARD & SHAREHOLDERS", "source": "SEC Investor.gov Guide"},
            {"speaker": "Alex", "text": "Yes, a business can have conflicts of interest. Yes, powerful people deserve scrutiny. But being Jewish is not evidence of collusion with other Jewish people.", "on_screen": "SCRUTINIZE POWER · NOT IDENTITY", "source": "Public Corporate Accountability"},
            {"speaker": "Maya", "text": "An identity match isn’t a paper trail. A real investigation connects actions with evidence, not just names.", "on_screen": "CONNECT ACTIONS WITH EVIDENCE", "source": "Investigative Methodology"},
            {"speaker": "Alex", "text": "Investigate the company. Don’t turn a community into one.", "on_screen": "INVESTIGATE THE COMPANY · NOT A COMMUNITY", "source": "Beyond the Myth · Facts, not scapegoats"}
        ],
        "sfx_theme": "dossier"
    },
    {
        "id": "ep005",
        "num": "05",
        "title": "Can You Be Jewish Without Being Religious?",
        "cover_text": "IDENTITY ISN’T A CHECKBOX",
        "topic": "jewish_identity",
        "base_key": 65.41, # C
        "scenes": [
            {"speaker": "Maya", "text": "Can you be Jewish without being religious? Yes.", "on_screen": "IDENTITY IS NOT A SINGLE CHECKBOX", "source": "Pew Research Center (2020 Survey)"},
            {"speaker": "Alex", "text": "Here’s where the one-box explanation breaks down. Jewish identity can involve religion, family, culture, history, or several of those together.", "on_screen": "RELIGION · FAMILY · CULTURE · HISTORY", "source": "Sociological Diversity Studies"},
            {"speaker": "Maya", "text": "Pew’s twenty-twenty survey of Jewish Americans documented that variety. Some people described their Jewish identity through religion. Others connected through ancestry or culture.", "on_screen": "DIVERSITY: FAITH, ANCESTRY & CULTURE", "source": "Pew: Jewish Americans in 2020"},
            {"speaker": "Alex", "text": "That doesn’t mean everybody agrees about identity. It means one label does not tell you a person’s beliefs, daily routines, or opinions. You still have to ask.", "on_screen": "ONE LABEL DOES NOT DEFINE A PERSON", "source": "Pew Research Findings"},
            {"speaker": "Maya", "text": "So a Jewish person you see online is not automatically speaking for every Jewish person. And they don’t have to pass your stereotype checklist.", "on_screen": "NO ONE PERSON SPEAKS FOR EVERYONE", "source": "Demographic Nuance in Research"},
            {"speaker": "Alex", "text": "Curious about someone? Try “What does that mean to you?” Then actually listen to the answer.", "on_screen": "ASK: WHAT DOES THAT MEAN TO YOU?", "source": "Dialogic Verification Principle"},
            {"speaker": "Maya", "text": "More conversation. Fewer assumptions. People aren’t dropdown menus.", "on_screen": "MORE CONVERSATION · FEWER ASSUMPTIONS", "source": "Beyond the Myth · Facts, not scapegoats"}
        ],
        "sfx_theme": "warm"
    },
    {
        "id": "ep006",
        "num": "06",
        "title": "The Antisemitic Forgery That Copied Another Book",
        "cover_text": "THE “PROOF” WAS COPIED",
        "topic": "protocols_forgery",
        "base_key": 73.42, # D
        "scenes": [
            {"speaker": "Alex", "text": "The supposed secret document was fake. And partly copied.", "on_screen": "FABRICATED DOCUMENT · PLAGIARIZED TEXT", "source": "USHMM (ushmm.org)"},
            {"speaker": "Maya", "text": "It’s called The Protocols of the Elders of Zion. First published in nineteen-oh-three, it pretended to reveal secret Jewish plans.", "on_screen": "PROTOCOLS · FIRST PUBLISHED 1903", "source": "Holocaust Encyclopedia"},
            {"speaker": "Alex", "text": "But those meeting records were invented. And here’s the giveaway: large sections came from an earlier French political satire that wasn’t even about Jewish people.", "on_screen": "COPIED FROM 1864 FRENCH SATIRE", "source": "Maurice Joly Textual Comparison"},
            {"speaker": "Maya", "text": "In nineteen-twenty-one, The Times of London exposed the copying. The United States Holocaust Memorial Museum documents the forgery and how it kept spreading afterward.", "on_screen": "EXPOSED 1921 · THE TIMES OF LONDON", "source": "The Times (1921) & USHMM Archive"},
            {"speaker": "Alex", "text": "So this wasn’t a hidden truth finally uncovered. It was a fabricated accusation dressed up as an insider document. A dramatic cover didn’t make it evidence.", "on_screen": "FABRICATION DRESSED AS EVIDENCE", "source": "Historical Source Criticism"},
            {"speaker": "Maya", "text": "That matters when a post recycles the same story with new graphics. New packaging doesn’t repair false evidence.", "on_screen": "NEW PACKAGING ≠ NEW EVIDENCE", "source": "Media History & Misinformation"},
            {"speaker": "Alex", "text": "An old lie doesn’t become true in high definition.", "on_screen": "AN OLD LIE ISN'T TRUE IN HIGH DEFINITION", "source": "Beyond the Myth · Facts, not scapegoats"}
        ],
        "sfx_theme": "archive"
    },
    {
        "id": "ep007",
        "num": "07",
        "title": "Criticize the Policy. Don’t Blame Your Classmate.",
        "cover_text": "POLICY ≠ COLLECTIVE GUILT",
        "topic": "criticize_policy",
        "base_key": 103.83, # Ab
        "scenes": [
            {"speaker": "Maya", "text": "Your Jewish classmate is not a government press office.", "on_screen": "A CLASSMATE IS NOT A GOVERNMENT", "source": "Civic Dialogue Standards"},
            {"speaker": "Alex", "text": "Criticizing the Israeli government is not automatically antisemitic. Policies can be investigated, challenged, and protested. That’s not the same as blaming Jewish people collectively.", "on_screen": "POLICY CRITICISM ≠ COLLECTIVE BLAME", "source": "IHRA & Jerusalem Declaration"},
            {"speaker": "Maya", "text": "Here’s the distinction: “This policy causes harm” identifies something to examine. “You’re Jewish, so you’re responsible” assigns guilt from identity. Those are different claims.", "on_screen": "EXAMINE POLICIES · REJECT IDENTITY GUILT", "source": "Jerusalem Declaration on Antisemitism"},
            {"speaker": "Alex", "text": "You can ask anyone about their views. But being Jewish doesn’t automatically make someone answerable for another person’s decisions. And Jewish people don’t all share one political opinion.", "on_screen": "DIVERSE VIEWS · INDIVIDUAL OPINIONS", "source": "Pew Research Center"},
            {"speaker": "Maya", "text": "The same principle protects a Palestinian classmate from being blamed for an armed group. People are responsible for their own actions, not somebody else’s label.", "on_screen": "EQUAL PRINCIPLE: RESPONSIBLE FOR ACTIONS", "source": "Universal Human Rights Principle"},
            {"speaker": "Alex", "text": "Be specific. Name the policy, the decision-maker, and the evidence. Keep the criticism attached to what happened.", "on_screen": "NAME POLICY · DECISION-MAKER · EVIDENCE", "source": "Critical Thinking & Public Reasoning"},
            {"speaker": "Maya", "text": "Strong criticism needs accuracy. Not collective blame.", "on_screen": "STRONG CRITICISM NEEDS ACCURACY", "source": "Beyond the Myth · Facts, not scapegoats"}
        ],
        "sfx_theme": "campus"
    },
    {
        "id": "ep008",
        "num": "08",
        "title": "The Catholic Document That Rejects Collective Blame",
        "cover_text": "READ THE ACTUAL DOCUMENT",
        "topic": "nostra_aetate",
        "base_key": 87.31, # F
        "scenes": [
            {"speaker": "Alex", "text": "The Catholic Church rejects blaming all Jews for Jesus’s death.", "on_screen": "OFFICIAL TEACHING: COLLECTIVE BLAME REJECTED", "source": "Vatican II (vatican.va)"},
            {"speaker": "Maya", "text": "There’s an official document: Nostra aetate, issued in nineteen-sixty-five. Its fourth section directly addresses that collective accusation, instead of leaving it to rumor.", "on_screen": "NOSTRA AETATE · SECTION 4 (1965)", "source": "Second Vatican Council Declaration"},
            {"speaker": "Alex", "text": "It says Jesus’s suffering cannot be charged indiscriminately to all Jewish people alive then, or to Jewish people today. It also condemns antisemitism.", "on_screen": "CANNOT BE CHARGED TO ALL JEWISH PEOPLE", "source": "Nostra Aetate, n. 4"},
            {"speaker": "Maya", "text": "That doesn’t erase the harm the accusation caused. And one declaration didn’t make prejudice disappear. But it matters when someone presents collective blame as Catholic teaching.", "on_screen": "COLLECTIVE BLAME IS NOT CATHOLIC DOCTRINE", "source": "Historical Theology Documentation"},
            {"speaker": "Alex", "text": "You can discuss religious texts and disagree about theology. That is different from making people guilty because they belong to a community, especially generations later.", "on_screen": "THEOLOGICAL DEBATE ≠ GROUP GUILT", "source": "Interfaith Hermeneutics"},
            {"speaker": "Maya", "text": "So check what the document actually says, not a comment claiming to speak for an entire faith.", "on_screen": "CHECK THE ORIGINAL DOCUMENT", "source": "Vatican Archive Direct Record"},
            {"speaker": "Alex", "text": "You don’t inherit guilt from a stranger’s history.", "on_screen": "NO INHERITED GUILT FROM HISTORY", "source": "Beyond the Myth · Facts, not scapegoats"}
        ],
        "sfx_theme": "cathedral"
    },
    {
        "id": "ep009",
        "num": "09",
        "title": "The Spy Case That Convicted the Wrong Man",
        "cover_text": "CONVICTED. THEN CLEARED.",
        "topic": "dreyfus_affair",
        "base_key": 98.0, # Gm
        "scenes": [
            {"speaker": "Maya", "text": "He was convicted as a spy. He was innocent.", "on_screen": "WRONGFULLY CONVICTED · PROVEN INNOCENT", "source": "USHMM Historical Archives"},
            {"speaker": "Alex", "text": "Meet Alfred Dreyfus, a Jewish officer in the French army. In eighteen-ninety-four, he was wrongly convicted of treason and sent to prison.", "on_screen": "ALFRED DREYFUS · 1894 TREASON CONVICTION", "source": "Dreyfus Affair Records"},
            {"speaker": "Maya", "text": "The case involved secret evidence, forged documents, and anti-Jewish prejudice. His family and supporters kept challenging it. Later evidence pointed to a different officer.", "on_screen": "FORGED EVIDENCE & FABRICATED FILES", "source": "French Military Historical Review"},
            {"speaker": "Alex", "text": "But correcting the case took years. Dreyfus was finally cleared in nineteen-oh-six. This wasn’t just an argument in a newspaper. A real person lost years of freedom.", "on_screen": "1894 → 1906: FULLY EXONERATED", "source": "French Cour de Cassation (1906)"},
            {"speaker": "Maya", "text": "The lesson is not that every accusation is false. It’s that someone’s Jewish identity is not proof that they’re disloyal. You still need reliable evidence.", "on_screen": "IDENTITY IS NEVER PROOF OF DISLOYALTY", "source": "Legal Evidence Standards"},
            {"speaker": "Alex", "text": "If a case depends on prejudice instead of facts, looking confident doesn’t fix it. Neither does a crowd.", "on_screen": "FACTS OVER PREJUDICE & MOBS", "source": "Principles of Due Process"},
            {"speaker": "Maya", "text": "A label is not evidence. Ask what actually happened.", "on_screen": "A LABEL IS NOT EVIDENCE", "source": "Beyond the Myth · Facts, not scapegoats"}
        ],
        "sfx_theme": "tribunal"
    },
    {
        "id": "ep010",
        "num": "10",
        "title": "Before You Share That Claim, Ask These 3 Questions",
        "cover_text": "3 QUESTIONS BEFORE SHARE",
        "topic": "three_questions",
        "base_key": 77.78, # Eb
        "scenes": [
            {"speaker": "Alex", "text": "Before you send that post, give it three questions.", "on_screen": "3 QUESTIONS BEFORE YOU SHARE", "source": "Digital Inquiry Group"},
            {"speaker": "Maya", "text": "One: where did the claim start? Not who reposted it. Find the original document, interview, or report—and check the date.", "on_screen": "1. WHERE DID IT START? FIND ORIGINAL", "source": "Teaching Lateral Reading"},
            {"speaker": "Alex", "text": "Two: what does the evidence actually prove? A logo can show certification. A company filing can show ownership. Neither gives you permission to invent extra claims.", "on_screen": "2. WHAT DOES THE EVIDENCE PROVE?", "source": "OU Kosher & SEC EDGAR"},
            {"speaker": "Maya", "text": "Three: did the post jump from one person’s actions to blaming Jewish people as a group? That jump needs challenging, not another share.", "on_screen": "3. DID IT JUMP TO GROUP BLAME?", "source": "Public Reasoning Standards"},
            {"speaker": "Alex", "text": "Then check a reliable independent source. And if the answer is still unclear, saying “I don’t know yet” is better than confidently spreading something false.", "on_screen": "CHECK INDEPENDENT SOURCE · IT'S OK TO SAY 'NOT SURE'", "source": "Media Literacy Framework"},
            {"speaker": "Maya", "text": "You don’t have to win every comment section. You can be the person who brings the actual source.", "on_screen": "BE THE PERSON WHO BRINGS THE SOURCE", "source": "Constructive Discourse"},
            {"speaker": "Alex", "text": "Which claim should we check next? Specific claims. Real evidence.", "on_screen": "SPECIFIC CLAIMS · REAL EVIDENCE", "source": "Beyond the Myth · Facts, not scapegoats"}
        ],
        "sfx_theme": "toolkit"
    }
]

def make_walking_bass(base_freq, total_samples, sample_rate, total_duration, beat_dur):
    total_beats = int(total_duration / beat_dur)
    bass = np.zeros(total_samples, dtype=np.float32)
    
    # 12-tone / scale offsets for walking line (Root, 3rd, 5th, 6th, b7, 8ve, 9th, etc.)
    scale_steps = [1.0, 1.25, 1.5, 1.68, 1.78, 2.0, 1.78, 1.5, 1.33, 1.12, 1.0, 1.5]
    
    for b in range(total_beats):
        b_time = b * beat_dur
        if b_time > 58.5:
            continue
        step = scale_steps[b % len(scale_steps)]
        note_freq = base_freq * step
        
        # Subtle harmonic movement in middle sections
        if 23.0 <= b_time < 38.0:
            note_freq *= 1.334 # Subdominant / modulation
        elif 38.0 <= b_time < 50.0:
            note_freq *= 0.89  # Minor chord reflection
        elif b_time >= 50.0:
            note_freq = base_freq # Resolve to root
            
        start_idx = int(b_time * sample_rate)
        pluc_dur = beat_dur * 0.94
        pluc_samples = int(pluc_dur * sample_rate)
        if start_idx + pluc_samples >= total_samples:
            pluc_samples = total_samples - start_idx
            
        lt = np.linspace(0, pluc_dur, pluc_samples, endpoint=False)
        env = np.exp(-lt * 6.2) + np.exp(-lt * 20.0) * 0.35
        wave = (
            np.sin(2 * np.pi * note_freq * lt) * 0.16 +
            np.sin(2 * np.pi * note_freq * 2.0 * lt) * 0.08 +
            np.sin(2 * np.pi * note_freq * 3.0 * lt) * 0.02
        ) * env
        bass[start_idx:start_idx+pluc_samples] += wave
        
    return bass

def make_jazz_drums(total_samples, sample_rate, total_duration, beat_dur):
    total_beats = int(total_duration / beat_dur)
    drums_l = np.zeros(total_samples, dtype=np.float32)
    drums_r = np.zeros(total_samples, dtype=np.float32)
    
    for b in range(total_beats):
        b_time = b * beat_dur
        if b_time < 4.0 or (40.0 <= b_time < 50.0) or b_time > 58.2:
            continue
            
        # Brushed snare on 2 & 4
        if b % 2 == 1:
            idx = int(b_time * sample_rate)
            slen = int(0.16 * sample_rate)
            if idx + slen < total_samples:
                lt = np.linspace(0, 0.16, slen, endpoint=False)
                env = np.exp(-lt * 17.0)
                noise = (np.random.rand(slen).astype(np.float32) * 2.0 - 1.0) * env * 0.035
                drums_l[idx:idx+slen] += noise * 0.7
                drums_r[idx:idx+slen] += noise * 0.9
                
        # Ride tap on each beat
        idx_r = int(b_time * sample_rate)
        rlen = int(0.07 * sample_rate)
        if idx_r + rlen < total_samples:
            lt = np.linspace(0, 0.07, rlen, endpoint=False)
            env = np.exp(-lt * 35.0)
            ride = np.sin(2 * np.pi * 7500.0 * lt) * env * 0.011
            drums_l[idx_r:idx_r+rlen] += ride * 0.6
            drums_r[idx_r:idx_r+rlen] += ride * 0.85
            
    return drums_l, drums_r

def make_vibraphone_chords(base_freq, total_samples, sample_rate, total_duration):
    vib_l = np.zeros(total_samples, dtype=np.float32)
    vib_r = np.zeros(total_samples, dtype=np.float32)
    t = np.linspace(0, total_duration, total_samples, endpoint=False)
    
    # 7 scene chords corresponding to the 7 dialogue blocks
    root = base_freq * 2.0 # bring to mid register ~170-240Hz
    chords = [
        (0.0, 4.5, [root, root * 1.25, root * 1.5, root * 1.88]),          # Maj7
        (4.5, 13.5, [root * 1.334, root * 1.667, root * 2.0, root * 2.5]), # IV Maj9
        (13.5, 25.0, [root * 1.125, root * 1.334, root * 1.667, root * 2.0]),# ii min7
        (25.0, 37.0, [root * 1.5, root * 1.88, root * 2.25, root * 2.67]),   # V7
        (37.0, 48.0, [root * 0.89, root * 1.125, root * 1.334, root * 1.667]),# vi min7
        (48.0, 55.5, [root * 1.334, root * 1.5, root * 1.88, root * 2.25]),  # IV to V
        (55.5, 60.0, [root, root * 1.25, root * 1.5, root * 2.0])           # Tonic resolve
    ]
    
    trem_rate = 5.5
    for c_start, c_end, freqs in chords:
        mask = (t >= c_start) & (t < c_end)
        idx = np.where(mask)[0]
        local_t = t[idx] - c_start
        
        env = np.ones_like(local_t)
        att = int(0.35 * sample_rate)
        rel = int(0.9 * sample_rate)
        if att > 0 and len(local_t) > att:
            env[:att] = np.linspace(0.0, 1.0, att)
        if rel > 0 and len(local_t) > rel:
            env[-rel:] = np.linspace(1.0, 0.0, rel)
            
        trem = 1.0 + 0.22 * np.sin(2 * np.pi * trem_rate * local_t)
        
        wave = np.zeros_like(local_t)
        for f in freqs:
            wave += (np.sin(2 * np.pi * f * local_t) + np.sin(2 * np.pi * f * 2.002 * local_t) * 0.15) * 0.032
            
        wave = wave * env * trem
        vib_l[idx] += wave * 0.75
        vib_r[idx] += wave * 0.85
        
    return vib_l, vib_r

def generate_tactile_sfx(theme, total_samples, sample_rate, scene_starts):
    sfx = np.zeros((total_samples, 2), dtype=np.float32)
    
    def add(st_sec, dur_sec, fn, vl=0.5, vr=0.5):
        s_idx = int(st_sec * sample_rate)
        ln = int(dur_sec * sample_rate)
        if s_idx + ln > total_samples:
            ln = total_samples - s_idx
        lt = np.linspace(0, dur_sec, ln, endpoint=False)
        w = fn(lt)
        sfx[s_idx:s_idx+ln, 0] += w * vl
        sfx[s_idx:s_idx+ln, 1] += w * vr

    # 1. Opening hook grab / tactile start (0.1s)
    def grab_sfx(lt):
        env = np.exp(-lt * 22.0)
        noise = (np.random.rand(len(lt)).astype(np.float32) * 2.0 - 1.0)
        return (noise * 0.14 + np.sin(2 * np.pi * 120.0 * lt) * 0.16) * env
    add(0.1, 0.35, grab_sfx, 0.6, 0.6)

    # 2. Scene 2 optical / card ping (~scene_starts[1] - 0.2s)
    st2 = max(0.5, scene_starts[1] - 0.3)
    def loupe_ping(lt):
        env = np.exp(-lt * 9.0)
        return (np.sin(2 * np.pi * 1760.0 * lt) + np.sin(2 * np.pi * 2640.0 * lt) * 0.45) * env * 0.08
    add(st2, 0.55, loupe_ping, 0.45, 0.65)

    # 3. Scene 3 inspection tick pings
    st3 = scene_starts[2]
    def ping_gen(freq):
        def _p(lt):
            return np.sin(2 * np.pi * freq * lt) * np.exp(-lt * 18.0) * 0.09
        return _p
    add(st3 + 1.2, 0.3, ping_gen(1046.5), 0.5, 0.5)
    add(st3 + 3.0, 0.3, ping_gen(1318.5), 0.5, 0.55)
    add(st3 + 5.0, 0.3, ping_gen(1567.9), 0.55, 0.5)

    # 4. Scene 4 document slide / stamp thud
    st4 = scene_starts[3]
    def paper_rustle(lt):
        env = np.sin(np.pi * lt / lt[-1])
        return (np.random.rand(len(lt)).astype(np.float32) * 2.0 - 1.0) * env * 0.1
    add(st4 + 0.5, 0.4, paper_rustle, 0.5, 0.5)

    def stamp_thud(lt):
        env = np.exp(-lt * 28.0)
        return np.sin(2 * np.pi * 85.0 * lt) * env * 0.22
    add(st4 + 2.0, 0.3, stamp_thud, 0.6, 0.6)

    # 5. Scene 5 digital click / evidence separation
    st5 = scene_starts[4]
    def glass_tap(lt):
        return np.sin(2 * np.pi * 2200.0 * lt) * np.exp(-lt * 35.0) * 0.08
    add(st5 + 0.3, 0.15, glass_tap, 0.5, 0.65)

    # 6. Scene 6 document filing / checkmark snap
    st6 = scene_starts[5]
    def card_snap(lt):
        return (np.sin(2 * np.pi * 880.0 * lt) + np.random.rand(len(lt)).astype(np.float32) * 0.1) * np.exp(-lt * 24.0) * 0.12
    add(st6 + 0.4, 0.25, card_snap, 0.55, 0.55)

    # 7. Scene 7 closing bell resolve
    st7 = max(55.0, scene_starts[6] + 2.5)
    def final_bell(lt):
        env = np.exp(-lt * 3.5)
        return (np.sin(2 * np.pi * 523.25 * lt) + np.sin(2 * np.pi * 659.25 * lt) * 0.6 + np.sin(2 * np.pi * 783.99 * lt) * 0.35) * env * 0.09
    add(st7, 2.5, final_bell, 0.6, 0.6)

    return sfx

async def process_episode(ep, base_video_dir):
    ep_id = ep["id"]
    ep_dir = os.path.join(base_video_dir, f"beyond_the_myth_{ep_id}")
    audio_dir = os.path.join(ep_dir, "assets", "audio")
    raw_dir = os.path.join(audio_dir, "raw")
    os.makedirs(raw_dir, exist_ok=True)
    
    print(f"\n========================================================")
    print(f"Synthesizing Episode {ep['num']}: {ep['title']}")
    print(f"========================================================")
    
    # 1. Synthesize individual speech clips
    scene_audios = []
    total_speech_len = 0.0
    
    for i, sc in enumerate(ep["scenes"], 1):
        spk = sc["speaker"]
        voice = VOICE_MAYA if spk == "Maya" else VOICE_ALEX
        rate = RATE_MAYA if spk == "Maya" else RATE_ALEX
        
        mp3_path = os.path.join(raw_dir, f"scene_{i}.mp3")
        wav_path = os.path.join(raw_dir, f"scene_{i}.wav")
        vtt_path = os.path.join(raw_dir, f"scene_{i}.vtt")
        srt_path = os.path.join(raw_dir, f"scene_{i}.srt")
        
        comm = edge_tts.Communicate(sc["text"], voice, rate=rate)
        submaker = edge_tts.SubMaker()
        words = []
        
        with open(mp3_path, "wb") as f:
            async for chunk in comm.stream():
                if chunk["type"] == "audio":
                    f.write(chunk["data"])
                elif chunk["type"] == "WordBoundary":
                    off = chunk["offset"] / 10_000_000.0
                    dur = chunk["duration"] / 10_000_000.0
                    words.append({"word": chunk["text"], "start": off, "end": off + dur})
                    submaker.feed(chunk)
                    
        # Write SRT
        with open(srt_path, "w", encoding="utf-8") as f:
            f.write(submaker.get_srt())
            
        # Convert MP3 to 44.1kHz mono WAV
        subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", mp3_path, "-ar", str(SAMPLE_RATE), "-ac", "1", wav_path], check=True)
        sr, data = wavfile.read(wav_path)
        dur = len(data) / float(sr)
        total_speech_len += dur
        
        scene_audios.append({
            "id": i,
            "speaker": spk,
            "text": sc["text"],
            "on_screen": sc["on_screen"],
            "source": sc["source"],
            "wav_path": wav_path,
            "duration": dur,
            "data": data.astype(np.float32) / (32767.0 if data.dtype == np.int16 else 1.0)
        })
        print(f"  Scene {i} [{spk}]: {dur:.2f}s | '{sc['text'][:35]}...'")
        
    print(f"Total raw dialogue duration: {total_speech_len:.2f}s (Budget: 60.0s)")
    
    # 2. Compute timeline placements with conversational breathing room
    # Target windows:
    # Scene 1: ~0.25s
    # Scene 2: ~4.5s
    # Scene 3: ~13.5s
    # Scene 4: ~25.0s
    # Scene 5: ~36.5s
    # Scene 6: ~48.0s
    # Scene 7: ~55.5s
    target_starts = [0.25, 4.3, 13.0, 24.5, 36.2, 47.5, 55.2]
    
    # Adjust in case speech runs longer
    actual_starts = []
    cur_t = 0.25
    for i in range(7):
        target = target_starts[i]
        start_t = max(cur_t, target)
        actual_starts.append(start_t)
        cur_t = start_t + scene_audios[i]["duration"] + 0.35 # 350ms pause between turns
        
    # Cap end before 59.2s
    if actual_starts[-1] + scene_audios[-1]["duration"] > 59.2:
        # Scale back slightly
        overflow = (actual_starts[-1] + scene_audios[-1]["duration"]) - 59.0
        print(f"  [Notice] Slight timeline squeeze needed: {overflow:.2f}s")
        for i in range(1, 7):
            actual_starts[i] = max(0.25, actual_starts[i] - (overflow * (i / 6.0)))
            
    # Assemble master voice track
    voice_track = np.zeros((TOTAL_SAMPLES, 2), dtype=np.float32)
    voice_env = np.zeros(TOTAL_SAMPLES, dtype=np.float32)
    subtitles_data = []
    
    for i in range(7):
        sc = scene_audios[i]
        st_sec = actual_starts[i]
        st_idx = int(st_sec * SAMPLE_RATE)
        clip = sc["data"]
        ln = len(clip)
        if st_idx + ln > TOTAL_SAMPLES:
            ln = TOTAL_SAMPLES - st_idx
            clip = clip[:ln]
            
        voice_track[st_idx:st_idx+ln, 0] += clip
        voice_track[st_idx:st_idx+ln, 1] += clip
        voice_env[st_idx:st_idx+ln] = np.maximum(voice_env[st_idx:st_idx+ln], np.abs(clip))
        
        end_sec = (st_idx + ln) / SAMPLE_RATE
        subtitles_data.append({
            "id": sc["id"],
            "speaker": sc["speaker"],
            "start": round(st_sec, 2),
            "end": round(end_sec, 2),
            "text": sc["text"],
            "on_screen": sc["on_screen"],
            "source": sc["source"]
        })
        print(f"  Turn {i+1}: [{st_sec:05.2f}s -> {end_sec:05.2f}s] {sc['speaker']}")

    # 3. Synthesize Music & Sidechain Ducking
    beat_dur = 60.0 / 106.0 # 106 BPM
    bass = make_walking_bass(ep["base_key"], TOTAL_SAMPLES, SAMPLE_RATE, TOTAL_DURATION, beat_dur)
    drums_l, drums_r = make_jazz_drums(TOTAL_SAMPLES, SAMPLE_RATE, TOTAL_DURATION, beat_dur)
    vib_l, vib_r = make_vibraphone_chords(ep["base_key"], TOTAL_SAMPLES, SAMPLE_RATE, TOTAL_DURATION)
    
    music_l = (bass * 0.8) + drums_l + vib_l
    music_r = (bass * 0.8) + drums_r + vib_r
    
    # Sidechain ducking filter
    kernel = int(SAMPLE_RATE * 0.22)
    cs = np.cumsum(np.insert(voice_env, 0, 0.0))
    ma = (cs[kernel:] - cs[:-kernel]) / float(kernel)
    pad_l = kernel // 2
    pad_r = TOTAL_SAMPLES - len(ma) - pad_l
    smoothed_env = np.pad(ma, (pad_l, pad_r), mode='edge')
    
    duck = 1.0 - np.clip(smoothed_env * 4.2, 0.0, 0.68) # Dips music by ~68% during speech
    ducked_music_l = music_l * duck * 0.78
    ducked_music_r = music_r * duck * 0.78
    
    # 4. Synthesize SFX
    sfx = generate_tactile_sfx(ep["sfx_theme"], TOTAL_SAMPLES, SAMPLE_RATE, actual_starts)
    
    # 5. Master Mix & Normalize
    master_l = (voice_track[:, 0] * 1.06) + ducked_music_l + (sfx[:, 0] * 0.82)
    master_r = (voice_track[:, 1] * 1.06) + ducked_music_r + (sfx[:, 1] * 0.82)
    master_mix = np.column_stack((master_l, master_r))
    
    peak = np.max(np.abs(master_mix))
    if peak > 0.92:
        master_mix = master_mix * (0.92 / peak)
        
    master_wav = os.path.join(audio_dir, "master.wav")
    master_mp3 = os.path.join(audio_dir, "master.mp3")
    
    int16_mix = (np.clip(master_mix, -1.0, 1.0) * 32767.0).astype(np.int16)
    wavfile.write(master_wav, SAMPLE_RATE, int16_mix)
    
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", master_wav, "-b:a", "320k", master_mp3], check=True)
    print(f"  [OK] Master Audio exported: {master_wav} & .mp3")
    
    # 6. Save subtitles and metadata
    def fmt_srt(sec):
        h = int(sec // 3600)
        m = int((sec % 3600) // 60)
        s = int(sec % 60)
        ms = int(round((sec - int(sec)) * 1000))
        return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"

    def fmt_vtt(sec):
        h = int(sec // 3600)
        m = int((sec % 3600) // 60)
        s = int(sec % 60)
        ms = int(round((sec - int(sec)) * 1000))
        return f"{h:02d}:{m:02d}:{s:02d}.{ms:03d}"

    sub_json_path = os.path.join(ep_dir, "subtitles.json")
    with open(sub_json_path, "w", encoding="utf-8") as f:
        json.dump({
            "episode_id": ep["id"],
            "episode_num": ep["num"],
            "title": ep["title"],
            "cover_text": ep["cover_text"],
            "total_duration": 60.0,
            "scenes": subtitles_data
        }, f, indent=2)

    srt_path = os.path.join(ep_dir, "subtitles.srt")
    vtt_path = os.path.join(ep_dir, "subtitles.vtt")
    with open(srt_path, "w", encoding="utf-8") as f_srt, open(vtt_path, "w", encoding="utf-8") as f_vtt:
        f_vtt.write("WEBVTT\n\n")
        for idx, sc in enumerate(subtitles_data, 1):
            f_srt.write(f"{idx}\n{fmt_srt(sc['start'])} --> {fmt_srt(sc['end'])}\n{sc['speaker']}: {sc['text']}\n\n")
            f_vtt.write(f"{idx}\n{fmt_vtt(sc['start'])} --> {fmt_vtt(sc['end'])}\n{sc['speaker']}: {sc['text']}\n\n")
            
    print(f"  [OK] Subtitles generated: {srt_path}")

async def main():
    base_video_dir = "c:/Users/PD2/Desktop/cad/video"
    for ep in EPISODES:
        await process_episode(ep, base_video_dir)
    print("\n========================================================")
    print("ALL 10 EPISODES AUDIO & TIMELINES GENERATED SUCCESSFULLY!")
    print("========================================================")

if __name__ == "__main__":
    asyncio.run(main())

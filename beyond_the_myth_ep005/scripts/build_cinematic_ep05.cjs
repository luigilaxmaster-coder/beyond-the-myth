const fs = require('fs');
const path = require('path');

const targetHtml = path.join(__dirname, '..', 'index.html');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=1080, height=1920, initial-scale=1.0">
  <title>Beyond The Myth · Ep. 005: Can You Be Jewish Without Being Religious?</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-canvas: #0E0C14;
      --paper-cream: #FFF9F5;
      --ink-black: #1A1722;
      --ink-dark: #2A2535;
      --ink-muted: #554D63;
      
      --gold-accent: #E8A825;
      --gold-bright: #F5C542;
      --rust-accent: #B3261E;
      --teal-accent: #195B56;
      --mint-accent: #2A8C7D;
      --blue-accent: #3371E3;
      --purple-accent: #8E44AD;
      
      --font-display: 'Outfit', -apple-system, sans-serif;
      --font-mono: 'Space Grotesk', monospace;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      user-select: none;
    }

    body {
      width: 1080px;
      height: 1920px;
      overflow: hidden;
      background: var(--bg-canvas);
      color: #FFFFFF;
      font-family: var(--font-display);
      display: flex;
      justify-content: center;
      align-items: center;
    }

    #root {
      position: relative;
      width: 1080px;
      height: 1920px;
      overflow: hidden;
      background: var(--bg-canvas);
    }

    .scene-viewport {
      position: absolute;
      inset: 0;
      width: 1080px;
      height: 1920px;
      overflow: hidden;
      display: none;
    }

    .plate-container {
      position: absolute;
      inset: 0;
      width: 1080px;
      height: 1920px;
      overflow: hidden;
      z-index: 1;
    }

    .plate-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      display: block;
      transform-origin: center center;
    }

    .theatrical-spotlight {
      position: absolute;
      top: -60px;
      left: 140px;
      width: 800px;
      height: 2040px;
      background: linear-gradient(180deg, rgba(245, 197, 66, 0.16) 0%, rgba(245, 197, 66, 0.05) 50%, rgba(0,0,0,0) 100%);
      clip-path: polygon(32% 0%, 68% 0%, 96% 100%, 4% 100%);
      pointer-events: none;
      z-index: 5;
      mix-blend-mode: screen;
    }

    .global-vignette {
      position: absolute;
      inset: 0;
      box-shadow: inset 0 0 160px rgba(0, 0, 0, 0.75), inset 0 -180px 140px rgba(10, 8, 15, 0.9);
      pointer-events: none;
      z-index: 6;
    }

    .show-header {
      position: absolute;
      top: 48px;
      left: 60px;
      right: 60px;
      height: 72px;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 50;
    }

    .brand-pill {
      display: flex;
      align-items: center;
      gap: 14px;
      background: rgba(18, 15, 24, 0.95);
      border: 2px solid rgba(255, 255, 255, 0.25);
      border-radius: 40px;
      padding: 10px 24px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.5);
    }

    .pulse-dot {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: var(--gold-accent);
      box-shadow: 0 0 12px var(--gold-accent);
    }

    .brand-name {
      font-size: 24px;
      font-weight: 800;
      letter-spacing: 2px;
      color: #FFFFFF;
      text-transform: uppercase;
    }

    .brand-tagline {
      font-family: var(--font-mono);
      font-size: 15px;
      letter-spacing: 1.5px;
      color: rgba(255, 255, 255, 0.75);
      text-transform: uppercase;
      border-left: 1.5px solid rgba(255, 255, 255, 0.3);
      padding-left: 14px;
      margin-left: 4px;
    }

    .scene-eyebrow {
      position: absolute;
      top: 140px;
      left: 60px;
      right: 60px;
      z-index: 45;
      display: flex;
      justify-content: center;
    }

    .eyebrow-chip {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      background: rgba(18, 15, 24, 0.96);
      border: 2px solid var(--gold-bright);
      border-radius: 40px;
      padding: 10px 30px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    }

    .eyebrow-icon {
      font-size: 22px;
      color: var(--gold-bright);
    }

    .eyebrow-text {
      font-family: var(--font-mono);
      font-size: 18px;
      font-weight: 700;
      letter-spacing: 2px;
      color: #FFFFFF;
      text-transform: uppercase;
    }

    .scene-content {
      position: absolute;
      top: 230px;
      left: 60px;
      right: 60px;
      height: 1240px;
      z-index: 20;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      pointer-events: none;
    }

    .tactical-card {
      width: 100%;
      background: var(--paper-cream);
      border-radius: 28px;
      border: 3.5px solid var(--ink-black);
      box-shadow: 10px 10px 0 var(--ink-black), 0 20px 40px rgba(0,0,0,0.5);
      color: var(--ink-black);
      padding: 36px 40px;
      position: relative;
    }

    .card-dark {
      background: rgba(20, 17, 28, 0.96);
      border: 3.5px solid rgba(255, 255, 255, 0.3);
      box-shadow: 10px 10px 0 rgba(0, 0, 0, 0.8), 0 20px 40px rgba(0,0,0,0.6);
      color: #FFFFFF;
    }

    .subtitles-container {
      position: absolute;
      bottom: 60px;
      left: 60px;
      right: 60px;
      z-index: 50;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 14px;
    }

    .subtitles-card {
      width: 100%;
      background: rgba(16, 13, 22, 0.96);
      border: 2px solid rgba(255, 255, 255, 0.25);
      border-radius: 26px;
      padding: 24px 34px;
      box-shadow: 0 16px 40px rgba(0,0,0,0.7);
      text-align: center;
    }

    .subtitles-text {
      font-size: 38px;
      font-weight: 700;
      line-height: 1.32;
      color: #FFFFFF;
      letter-spacing: 0.3px;
    }

    .hl-gold { color: #FFD452; font-weight: 800; }
    .hl-teal { color: #58E2D0; font-weight: 800; }
    .hl-coral { color: #FF8A80; font-weight: 800; }

    .source-tag {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: rgba(18, 15, 24, 0.94);
      border: 1.5px solid rgba(255, 255, 255, 0.2);
      border-radius: 30px;
      padding: 8px 24px;
      font-family: var(--font-mono);
      font-size: 15px;
      letter-spacing: 1.2px;
      color: #FFFFFF;
      text-transform: uppercase;
    }

    .source-bullet {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--gold-accent);
    }

    .dimension-pill {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 24px;
      border-radius: 18px;
      background: rgba(255, 255, 255, 0.08);
      border: 1.5px solid rgba(255, 255, 255, 0.15);
      margin-bottom: 12px;
      font-family: var(--font-mono);
    }

    .stat-bar-outer {
      width: 100%;
      height: 18px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      overflow: hidden;
      margin-top: 8px;
    }

    .stat-bar-inner {
      height: 100%;
      border-radius: 10px;
    }
  </style>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
</head>
<body>
  <div id="root" class="clip" data-composition-id="main" data-width="1080" data-height="1920" data-duration="60" data-layout-allow-overflow="true">
    <div class="theatrical-spotlight" data-layout-allow-overlap="true"></div>
    <div class="global-vignette" data-layout-allow-overlap="true"></div>

    <header class="show-header" data-layout-allow-overlap="true">
      <div class="brand-pill">
        <span class="pulse-dot"></span>
        <span class="brand-name">BEYOND THE MYTH</span>
        <span class="brand-tagline">EPISODE 005 · INVESTIGATIVE BRIEFING</span>
      </div>
    </header>

    <div class="scene-eyebrow" data-layout-allow-overlap="true">
      <div class="eyebrow-chip">
        <span class="eyebrow-icon" id="eyebrow-icon">✦</span>
        <span class="eyebrow-text" id="eyebrow-text">IDENTITY & DIVERSITY</span>
      </div>
    </div>

    <!-- SCENE 1 (0.0s - 3.5s): Hook: Gathering Plate -->
    <section class="scene-viewport" id="scene-1" data-layout-allow-overlap="true">
      <div class="plate-container">
        <img class="plate-img" id="plate-1" src="assets/images/scene_1_gathering.jpg" alt="Diverse family gathering">
      </div>
      <div class="scene-content" style="justify-content: center;">
        <div class="tactical-card card-dark" id="card-hook" style="text-align: center; border-color: var(--gold-bright);">
          <div style="font-family: var(--font-mono); font-size: 16px; font-weight: 800; color: var(--gold-bright); letter-spacing: 2px; text-transform: uppercase;">
            CORE QUESTION
          </div>
          <div style="font-size: 46px; font-weight: 900; line-height: 1.25; margin: 18px 0; color: #FFFFFF;">
            Can you be Jewish without being religious?
          </div>
          <div style="display: inline-block; background: var(--teal-accent); border: 2px solid #58E2D0; padding: 10px 32px; border-radius: 30px; font-size: 28px; font-weight: 900; color: #FFFFFF; letter-spacing: 2px;">
            YES. DEFINITIVELY.
          </div>
        </div>
      </div>
    </section>

    <!-- SCENE 2 (3.5s - 13.3s): Beyond The One-Box Stereotype -->
    <section class="scene-viewport" id="scene-2" data-layout-allow-overlap="true">
      <div class="plate-container">
        <img class="plate-img" id="plate-2" src="assets/images/scene_2_heritage.jpg" alt="Jewish Heritage and Study">
      </div>
      <div class="scene-content">
        <div class="tactical-card card-dark" id="card-dimensions" style="width: 100%;">
          <div style="font-family: var(--font-mono); font-size: 16px; font-weight: 800; color: var(--gold-bright); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 12px;">
            DEMOGRAPHIC REALITY · MULTIPLE DIMENSIONS
          </div>
          <div style="font-size: 34px; font-weight: 900; line-height: 1.25; margin-bottom: 22px;">
            The single-box stereotype completely breaks down:
          </div>

          <div class="dimension-pill">
            <span style="font-weight: 800; font-size: 20px; color: #FFD452;">RELIGIOUS TRADITION</span>
            <span style="font-size: 16px; color: rgba(255,255,255,0.7);">Prayer, Torah, Halakha, Holidays</span>
          </div>
          <div class="dimension-pill">
            <span style="font-weight: 800; font-size: 20px; color: #58E2D0;">FAMILY & ANCESTRY</span>
            <span style="font-size: 16px; color: rgba(255,255,255,0.7);">Generational lineage & diaspora origins</span>
          </div>
          <div class="dimension-pill">
            <span style="font-weight: 800; font-size: 20px; color: #FF8A80;">CULTURE & HERITAGE</span>
            <span style="font-size: 16px; color: rgba(255,255,255,0.7);">Literature, music, language, cuisine</span>
          </div>
          <div class="dimension-pill">
            <span style="font-weight: 800; font-size: 20px; color: #A78BFA;">HISTORICAL MEMORY</span>
            <span style="font-size: 16px; color: rgba(255,255,255,0.7);">Shared collective survival & resilience</span>
          </div>
        </div>
      </div>
    </section>

    <!-- SCENE 3 (13.3s - 23.8s): Pew Research Survey 2020 Data -->
    <section class="scene-viewport" id="scene-3" data-layout-allow-overlap="true">
      <div class="plate-container">
        <img class="plate-img" id="plate-3" src="assets/images/scene_3_pew.jpg" alt="Pew Research forensic documents">
      </div>
      <div class="scene-content">
        <div class="tactical-card card-dark" id="card-pew-data">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <div style="font-family: var(--font-mono); font-size: 16px; font-weight: 800; color: var(--gold-bright); letter-spacing: 2px;">
              PEW RESEARCH CENTER · 2020 STUDY
            </div>
            <div style="background: rgba(255,255,255,0.15); border-radius: 12px; padding: 4px 12px; font-family: var(--font-mono); font-size: 14px;">
              N = 4,718
            </div>
          </div>

          <div style="font-size: 32px; font-weight: 800; margin-bottom: 20px; line-height: 1.3;">
            Jewish Americans: Spectrum of Identification
          </div>

          <div style="margin-bottom: 18px;">
            <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 20px;">
              <span>Jews by Religion</span>
              <span style="color: #FFD452;">73%</span>
            </div>
            <div class="stat-bar-outer">
              <div class="stat-bar-inner" style="width: 73%; background: #FFD452;"></div>
            </div>
          </div>

          <div style="margin-bottom: 18px;">
            <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 20px;">
              <span>Jews of No Religion (Cultural/Ancestral)</span>
              <span style="color: #58E2D0;">27%</span>
            </div>
            <div class="stat-bar-outer">
              <div class="stat-bar-inner" style="width: 27%; background: #58E2D0;"></div>
            </div>
          </div>

          <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.2); font-size: 18px; color: rgba(255,255,255,0.85); line-height: 1.4;">
            Over 1 in 4 connect primarily through ancestry, culture, or family background—without religious practice.
          </div>
        </div>
      </div>
    </section>

    <!-- SCENE 4 (23.8s - 35.2s): No Monolithic Beliefs -->
    <section class="scene-viewport" id="scene-4" data-layout-allow-overlap="true">
      <div class="plate-container">
        <img class="plate-img" id="plate-4" src="assets/images/scene_4_cultural_center.jpg" alt="Cultural Community Synagogue Architecture">
      </div>
      <div class="scene-content">
        <div class="tactical-card" id="card-monolith-debunk" style="background: #FFF9F5; color: #1A1722;">
          <div style="font-family: var(--font-mono); font-size: 16px; font-weight: 800; color: var(--rust-accent); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 10px;">
            STEREOTYPE vs. EVIDENCE
          </div>
          <div style="font-size: 36px; font-weight: 900; margin-bottom: 20px; line-height: 1.25;">
            One label does NOT equal uniform beliefs.
          </div>

          <div style="background: #F4EBE2; border-left: 6px solid var(--rust-accent); padding: 18px 20px; border-radius: 0 16px 16px 0; margin-bottom: 16px;">
            <div style="font-weight: 800; font-size: 19px; color: var(--rust-accent); margin-bottom: 4px;">❌ FALSE ASSUMPTION:</div>
            <div style="font-size: 19px; color: #332B3E; font-weight: 600;">"All Jewish people think alike, vote alike, and observe the same rituals."</div>
          </div>

          <div style="background: #E8F5E9; border-left: 6px solid var(--mint-accent); padding: 18px 20px; border-radius: 0 16px 16px 0;">
            <div style="font-weight: 800; font-size: 19px; color: var(--mint-accent); margin-bottom: 4px;">✔ DOCUMENTED FACT:</div>
            <div style="font-size: 19px; color: #1B5E20; font-weight: 600;">Broad spectrum across Orthodox, Conservative, Reform, Secular, and unaffiliated perspectives.</div>
          </div>
        </div>
      </div>
    </section>

    <!-- SCENE 5 (35.2s - 46.0s): No Online Spokesperson Mandate -->
    <section class="scene-viewport" id="scene-5" data-layout-allow-overlap="true">
      <div class="plate-container">
        <img class="plate-img" id="plate-5" src="assets/images/scene_2_heritage.jpg" alt="Jewish Culture and Heritage">
      </div>
      <div class="scene-content">
        <div class="tactical-card card-dark" id="card-spokesperson">
          <div style="font-family: var(--font-mono); font-size: 16px; font-weight: 800; color: var(--gold-bright); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 12px;">
            DIGITAL LITERACY RULE
          </div>
          <div style="font-size: 36px; font-weight: 900; line-height: 1.25; margin-bottom: 22px;">
            1 Voice ≠ 15 Million People
          </div>

          <div style="background: rgba(255,255,255,0.08); border-radius: 18px; padding: 22px; margin-bottom: 16px; border: 1.5px solid rgba(255,255,255,0.15);">
            <div style="font-size: 22px; font-weight: 700; margin-bottom: 8px; color: #FF8A80;">
              No Representative Mandate
            </div>
            <div style="font-size: 18px; color: rgba(255,255,255,0.85); line-height: 1.4;">
              A single creator or viral post does not represent the collective. They speak only for themselves.
            </div>
          </div>

          <div style="background: rgba(255,255,255,0.08); border-radius: 18px; padding: 22px; border: 1.5px solid rgba(255,255,255,0.15);">
            <div style="font-size: 22px; font-weight: 700; margin-bottom: 8px; color: #58E2D0;">
              No Stereotype Checklist
            </div>
            <div style="font-size: 18px; color: rgba(255,255,255,0.85); line-height: 1.4;">
              Nobody owes compliance to outside caricatures or preconceptions.
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SCENE 6 (46.0s - 54.0s): Radical Listening -->
    <section class="scene-viewport" id="scene-6" data-layout-allow-overlap="true">
      <div class="plate-container">
        <img class="plate-img" id="plate-6" src="assets/images/scene_1_gathering.jpg" alt="Conversing at table">
      </div>
      <div class="scene-content" style="justify-content: center;">
        <div class="tactical-card card-dark" id="card-listen" style="text-align: center; border-color: var(--teal-accent);">
          <div style="font-family: var(--font-mono); font-size: 16px; font-weight: 800; color: #58E2D0; letter-spacing: 2px; text-transform: uppercase;">
            BETTER HUMAN DIALOGUE
          </div>
          <div style="font-size: 44px; font-weight: 900; line-height: 1.3; margin: 20px 0; color: #FFFFFF;">
            "What does that mean to you?"
          </div>
          <div style="font-size: 24px; font-weight: 600; color: #FFD452; letter-spacing: 1px;">
            Ask genuinely. Then actually listen to the answer.
          </div>
        </div>
      </div>
    </section>

    <!-- SCENE 7 (54.0s - 60.0s): Closing Lockup -->
    <section class="scene-viewport" id="scene-7" data-layout-allow-overlap="true">
      <div class="plate-container">
        <img class="plate-img" id="plate-7" src="assets/images/scene_4_cultural_center.jpg" alt="Cultural Center Architecture">
      </div>
      <div class="scene-content" style="justify-content: center;">
        <div class="tactical-card card-dark" id="card-closing" style="text-align: center; border-color: var(--gold-bright);">
          <div style="font-family: var(--font-mono); font-size: 16px; font-weight: 800; color: var(--gold-bright); letter-spacing: 2px; text-transform: uppercase;">
            BEYOND THE MYTH · CORE PRINCIPLE
          </div>
          <div style="font-size: 46px; font-weight: 900; line-height: 1.25; margin: 18px 0; color: #FFFFFF;">
            People aren’t dropdown menus.
          </div>
          <div style="font-family: var(--font-mono); font-size: 18px; color: rgba(255, 255, 255, 0.85); letter-spacing: 2px;">
            MORE CONVERSATION · FEWER ASSUMPTIONS
          </div>
        </div>
      </div>
    </section>

    <!-- Subtitles persistent card -->
    <div class="subtitles-container" data-layout-allow-overlap="true">
      <div class="subtitles-card">
        <p class="subtitles-text" id="subtitles-display">Can you be Jewish without being religious? Yes.</p>
      </div>
      <div class="source-tag">
        <span class="source-bullet"></span>
        <span id="source-display">PEW RESEARCH CENTER (2020 SURVEY)</span>
      </div>
    </div>
  </div>

  <script>
    const cues = [
      {
        start: 0.0, end: 3.5,
        eyebrow: "MULTIDIMENSIONAL IDENTITY", icon: "✦",
        subtitle: 'Can you be Jewish without being religious? <span class="hl-teal">Yes. Definitively.</span>',
        source: "PEW RESEARCH CENTER (2020 SURVEY)"
      },
      {
        start: 3.5, end: 13.3,
        eyebrow: "BREAKING ONE-BOX EXPLANATIONS", icon: "📊",
        subtitle: 'Here’s where the one-box explanation breaks down. Jewish identity can involve <span class="hl-gold">religion, family, culture, history,</span> or several together.',
        source: "SOCIOLOGICAL & ANTHROPOLOGICAL RESEARCH"
      },
      {
        start: 13.3, end: 23.8,
        eyebrow: "PEW RESEARCH 2020 FINDINGS", icon: "📑",
        subtitle: 'Pew’s 2020 survey documented that variety. Some connect through religion; <span class="hl-teal">27% identify through ancestry or culture.</span>',
        source: "PEW RESEARCH: JEWISH AMERICANS IN 2020"
      },
      {
        start: 23.8, end: 35.2,
        eyebrow: "NO MONOLITHIC BELIEFS", icon: "⚖",
        subtitle: 'One label does not tell you a person’s beliefs, daily routines, or opinions. <span class="hl-gold">You still have to ask.</span>',
        source: "DEMOGRAPHIC OBSERVATIONS"
      },
      {
        start: 35.2, end: 46.0,
        eyebrow: "REJECT STEREOTYPE CHECKLISTS", icon: "📱",
        subtitle: 'A person you see online is not speaking for everyone. And they don’t have to <span class="hl-coral">pass your stereotype checklist.</span>',
        source: "MEDIA & DIGITAL LITERACY"
      },
      {
        start: 46.0, end: 54.0,
        eyebrow: "GENUINE LISTENING", icon: "💬",
        subtitle: 'Curious about someone? Try <span class="hl-teal">“What does that mean to you?”</span> Then actually listen to the answer.',
        source: "ETHICS OF INQUIRY"
      },
      {
        start: 54.0, end: 60.0,
        eyebrow: "BEYOND THE MYTH", icon: "✦",
        subtitle: 'More conversation. Fewer assumptions. <span class="hl-gold">People aren’t dropdown menus.</span>',
        source: "BEYOND THE MYTH · CORE PRINCIPLE"
      }
    ];

    function updateCue(idx) {
      const c = cues[idx];
      if (!c) return;
      document.getElementById("eyebrow-icon").innerText = c.icon;
      document.getElementById("eyebrow-text").innerText = c.eyebrow;
      document.getElementById("subtitles-display").innerHTML = c.subtitle;
      document.getElementById("source-display").innerText = c.source;
    }

    window.__timelines = window.__timelines || {};
    const tl = gsap.timeline({ paused: true });
    window.__timelines["main"] = tl;

    // SCENE 1 (0.0s - 3.5s)
    tl.set("#scene-1", { display: "block", opacity: 1 }, 0.0);
    tl.call(() => updateCue(0), null, 0.0);
    tl.fromTo("#plate-1", { scale: 1.0 }, { scale: 1.06, duration: 3.5, ease: "none" }, 0.0);
    tl.fromTo("#card-hook", { scale: 0.9, opacity: 0 }, { scale: 1.0, opacity: 1, duration: 0.6, ease: "back.out(1.4)" }, 0.2);
    tl.to("#scene-1", { opacity: 0, duration: 0.35 }, 3.15);
    tl.set("#scene-1", { display: "none" }, 3.5);

    // SCENE 2 (3.5s - 13.3s)
    tl.set("#scene-2", { display: "block", opacity: 0 }, 3.5);
    tl.to("#scene-2", { opacity: 1, duration: 0.35 }, 3.5);
    tl.call(() => updateCue(1), null, 3.5);
    tl.fromTo("#plate-2", { scale: 1.0 }, { scale: 1.08, duration: 9.8, ease: "none" }, 3.5);
    tl.fromTo("#card-dimensions", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }, 3.8);
    tl.to("#scene-2", { opacity: 0, duration: 0.35 }, 12.95);
    tl.set("#scene-2", { display: "none" }, 13.3);

    // SCENE 3 (13.3s - 23.8s)
    tl.set("#scene-3", { display: "block", opacity: 0 }, 13.3);
    tl.to("#scene-3", { opacity: 1, duration: 0.35 }, 13.3);
    tl.call(() => updateCue(2), null, 13.3);
    tl.fromTo("#plate-3", { scale: 1.0 }, { scale: 1.08, duration: 10.5, ease: "none" }, 13.3);
    tl.fromTo("#card-pew-data", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }, 13.6);
    tl.to("#scene-3", { opacity: 0, duration: 0.35 }, 23.45);
    tl.set("#scene-3", { display: "none" }, 23.8);

    // SCENE 4 (23.8s - 35.2s)
    tl.set("#scene-4", { display: "block", opacity: 0 }, 23.8);
    tl.to("#scene-4", { opacity: 1, duration: 0.35 }, 23.8);
    tl.call(() => updateCue(3), null, 23.8);
    tl.fromTo("#plate-4", { scale: 1.0 }, { scale: 1.08, duration: 11.4, ease: "none" }, 23.8);
    tl.fromTo("#card-monolith-debunk", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }, 24.1);
    tl.to("#scene-4", { opacity: 0, duration: 0.35 }, 34.85);
    tl.set("#scene-4", { display: "none" }, 35.2);

    // SCENE 5 (35.2s - 46.0s)
    tl.set("#scene-5", { display: "block", opacity: 0 }, 35.2);
    tl.to("#scene-5", { opacity: 1, duration: 0.35 }, 35.2);
    tl.call(() => updateCue(4), null, 35.2);
    tl.fromTo("#plate-5", { scale: 1.0 }, { scale: 1.08, duration: 10.8, ease: "none" }, 35.2);
    tl.fromTo("#card-spokesperson", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }, 35.5);
    tl.to("#scene-5", { opacity: 0, duration: 0.35 }, 45.65);
    tl.set("#scene-5", { display: "none" }, 46.0);

    // SCENE 6 (46.0s - 54.0s)
    tl.set("#scene-6", { display: "block", opacity: 0 }, 46.0);
    tl.to("#scene-6", { opacity: 1, duration: 0.35 }, 46.0);
    tl.call(() => updateCue(5), null, 46.0);
    tl.fromTo("#plate-6", { scale: 1.0 }, { scale: 1.07, duration: 8.0, ease: "none" }, 46.0);
    tl.fromTo("#card-listen", { scale: 0.9, opacity: 0 }, { scale: 1.0, opacity: 1, duration: 0.6, ease: "back.out(1.4)" }, 46.3);
    tl.to("#scene-6", { opacity: 0, duration: 0.35 }, 53.65);
    tl.set("#scene-6", { display: "none" }, 54.0);

    // SCENE 7 (54.0s - 60.0s)
    tl.set("#scene-7", { display: "block", opacity: 0 }, 54.0);
    tl.to("#scene-7", { opacity: 1, duration: 0.35 }, 54.0);
    tl.call(() => updateCue(6), null, 54.0);
    tl.fromTo("#plate-7", { scale: 1.0 }, { scale: 1.06, duration: 6.0, ease: "none" }, 54.0);
    tl.fromTo("#card-closing", { scale: 0.9, opacity: 0 }, { scale: 1.0, opacity: 1, duration: 0.6, ease: "back.out(1.4)" }, 54.3);
    tl.to("#root", { x: -1080, duration: 0.8, ease: "power2.in" }, 59.2);
  </script>
</body>
</html>
`;

fs.writeFileSync(targetHtml, htmlContent, 'utf8');
console.log('[OK] Wrote Cinematic Ep05 index.html');

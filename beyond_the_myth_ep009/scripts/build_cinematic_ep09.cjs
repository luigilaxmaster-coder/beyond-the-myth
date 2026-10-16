const fs = require('fs');
const path = require('path');

const targetHtml = path.join(__dirname, '..', 'index.html');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=1080, height=1920, initial-scale=1.0">
  <title>Beyond The Myth · Ep. 009: The Dreyfus Affair</title>
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

    .dossier-pill {
      background: rgba(255, 255, 255, 0.08);
      border-radius: 18px;
      padding: 20px 22px;
      margin-bottom: 14px;
      border: 1.5px solid rgba(255, 255, 255, 0.15);
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
        <span class="brand-tagline">EPISODE 009 · HISTORICAL CASE STUDY</span>
      </div>
    </header>

    <div class="scene-eyebrow" data-layout-allow-overlap="true">
      <div class="eyebrow-chip">
        <span class="eyebrow-icon" id="eyebrow-icon">⚖</span>
        <span class="eyebrow-text" id="eyebrow-text">FORENSIC CASE STUDY</span>
      </div>
    </div>

    <!-- SCENE 1 (0.0s - 3.4s): Hook: Convicted as a spy, innocent -->
    <section class="scene-viewport" id="scene-1" data-layout-allow-overlap="true">
      <div class="plate-container">
        <img class="plate-img" id="plate-1" src="assets/images/scene_1_jaccuse.jpg" alt="Zola's J'Accuse 1898 L'Aurore Front Page">
      </div>
      <div class="scene-content" style="justify-content: center;">
        <div class="tactical-card card-dark" id="card-hook" style="text-align: center; border-color: var(--rust-accent);">
          <div style="font-family: var(--font-mono); font-size: 16px; font-weight: 800; color: #FF8A80; letter-spacing: 2px; text-transform: uppercase;">
            HISTORICAL CASE STUDY · 1894
          </div>
          <div style="font-size: 46px; font-weight: 900; line-height: 1.2; margin: 18px 0; color: #FFFFFF;">
            He was convicted as a spy.
          </div>
          <div style="display: inline-block; background: #2E7D32; border: 2px solid #58E2D0; padding: 10px 32px; border-radius: 30px; font-size: 28px; font-weight: 900; color: #FFFFFF; letter-spacing: 2px;">
            HE WAS INNOCENT.
          </div>
        </div>
      </div>
    </section>

    <!-- SCENE 2 (3.4s - 13.0s): Captain Alfred Dreyfus -->
    <section class="scene-viewport" id="scene-2" data-layout-allow-overlap="true">
      <div class="plate-container">
        <img class="plate-img" id="plate-2" src="assets/images/scene_2_captain_dreyfus.jpg" alt="Captain Alfred Dreyfus in Military Uniform">
      </div>
      <div class="scene-content">
        <div class="tactical-card card-dark" id="card-dreyfus">
          <div style="font-family: var(--font-mono); font-size: 16px; font-weight: 800; color: var(--gold-bright); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 12px;">
            CAPTAIN ALFRED DREYFUS
          </div>
          <div style="font-size: 34px; font-weight: 900; line-height: 1.25; margin-bottom: 22px;">
            The 1894 Court Martial
          </div>

          <div class="dossier-pill">
            <div style="font-size: 20px; font-weight: 800; color: #FFD452; margin-bottom: 6px;">
              Officer of the French General Staff
            </div>
            <div style="font-size: 18px; color: rgba(255,255,255,0.85); line-height: 1.4;">
              A loyal French artillery officer from Alsace. The only Jewish officer on the General Staff.
            </div>
          </div>

          <div class="dossier-pill">
            <div style="font-size: 20px; font-weight: 800; color: #FF8A80; margin-bottom: 6px;">
              Wrongful Treason Conviction
            </div>
            <div style="font-size: 18px; color: rgba(255,255,255,0.85); line-height: 1.4;">
              Publicly stripped of military rank in January 1895 and sent to solitary exile on Devil's Island.
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SCENE 3 (13.0s - 24.5s): Forged Documents & Real Culprit -->
    <section class="scene-viewport" id="scene-3" data-layout-allow-overlap="true">
      <div class="plate-container">
        <img class="plate-img" id="plate-3" src="assets/images/scene_3_military_degradation.jpg" alt="Degradation of Alfred Dreyfus 1895">
      </div>
      <div class="scene-content">
        <div class="tactical-card card-dark" id="card-conspiracy">
          <div style="font-family: var(--font-mono); font-size: 16px; font-weight: 800; color: #FF8A80; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 12px;">
            THE FORGED DOSSIER EXPOSED
          </div>
          <div style="font-size: 34px; font-weight: 900; line-height: 1.25; margin-bottom: 20px;">
            Secret evidence and fabricated files:
          </div>

          <div class="dossier-pill" style="border-left: 5px solid #FF8A80;">
            <div style="font-size: 19px; font-weight: 800; color: #FF8A80; margin-bottom: 4px;">
              THE FORGERY ("LE FAUX HENRY")
            </div>
            <div style="font-size: 17px; color: rgba(255,255,255,0.85); line-height: 1.35;">
              Col. Hubert Henry manufactured fake letters to prevent reopening the case when doubts arose.
            </div>
          </div>

          <div class="dossier-pill" style="border-left: 5px solid #58E2D0;">
            <div style="font-size: 19px; font-weight: 800; color: #58E2D0; margin-bottom: 4px;">
              THE ACTUAL SPY: ESTERHAZY
            </div>
            <div style="font-size: 17px; color: rgba(255,255,255,0.85); line-height: 1.35;">
              Handwriting analysis and espionage files proved Major Ferdinand Walsin Esterhazy was the real traitor.
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SCENE 4 (24.5s - 36.2s): Exoneration 1906 -->
    <section class="scene-viewport" id="scene-4" data-layout-allow-overlap="true">
      <div class="plate-container">
        <img class="plate-img" id="plate-4" src="assets/images/scene_4_devils_island_hut.jpg" alt="Devil's Island Prison Exoneration">
      </div>
      <div class="scene-content">
        <div class="tactical-card" id="card-exoneration" style="background: #FFF9F5; color: #1A1722;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <div style="font-family: var(--font-mono); font-size: 16px; font-weight: 800; color: var(--teal-accent); letter-spacing: 2px;">
              FULL EXONERATION
            </div>
            <div style="background: #1A1722; color: #FFF; font-family: var(--font-mono); font-size: 14px; font-weight: 700; padding: 4px 12px; border-radius: 8px;">
              JULY 12, 1906
            </div>
          </div>

          <div style="font-size: 34px; font-weight: 900; line-height: 1.25; margin-bottom: 18px;">
            12 Years to Overturn Prejudice.
          </div>

          <div style="background: #E8F5E9; border-left: 6px solid #2E7D32; padding: 18px 22px; border-radius: 0 16px 16px 0; margin-bottom: 16px;">
            <div style="font-weight: 800; font-size: 19px; color: #1B5E20; margin-bottom: 4px;">COUR DE CASSATION RULING:</div>
            <div style="font-size: 18px; color: #2E7D32; font-weight: 600; line-height: 1.35;">
              Annulled the conviction unconditionally. Dreyfus reinstated as Major and awarded the Legion of Honour.
            </div>
          </div>

          <div style="font-size: 17px; color: #554D63; line-height: 1.4;">
            This wasn't just a political debate. A real human being lost 12 years of life and liberty to prejudice.
          </div>
        </div>
      </div>
    </section>

    <!-- SCENE 5 (36.2s - 47.5s): Evidence Over Identity -->
    <section class="scene-viewport" id="scene-5" data-layout-allow-overlap="true">
      <div class="plate-container">
        <img class="plate-img" id="plate-5" src="assets/images/scene_2_captain_dreyfus.jpg" alt="Captain Dreyfus Historical Case">
      </div>
      <div class="scene-content">
        <div class="tactical-card card-dark" id="card-evidence">
          <div style="font-family: var(--font-mono); font-size: 16px; font-weight: 800; color: var(--gold-bright); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 12px;">
            THE UNIVERSAL LESSON
          </div>
          <div style="font-size: 34px; font-weight: 900; line-height: 1.25; margin-bottom: 22px;">
            Identity is NEVER evidence of guilt.
          </div>

          <div class="dossier-pill">
            <div style="font-size: 20px; font-weight: 800; color: #58E2D0; margin-bottom: 6px;">
              Facts Over Scapegoating
            </div>
            <div style="font-size: 18px; color: rgba(255,255,255,0.85); line-height: 1.4;">
              The lesson is not that every accusation is false. It's that being Jewish is not proof of disloyalty.
            </div>
          </div>

          <div class="dossier-pill">
            <div style="font-size: 20px; font-weight: 800; color: #FFD452; margin-bottom: 6px;">
              Rigorous Standards
            </div>
            <div style="font-size: 18px; color: rgba(255,255,255,0.85); line-height: 1.4;">
              True justice requires documented, reliable evidence—not prejudice disguised as certainty.
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SCENE 6 (47.5s - 55.2s): Mob Opinion ≠ Justice -->
    <section class="scene-viewport" id="scene-6" data-layout-allow-overlap="true">
      <div class="plate-container">
        <img class="plate-img" id="plate-6" src="assets/images/scene_1_jaccuse.jpg" alt="Émile Zola's J'Accuse Newspaper">
      </div>
      <div class="scene-content">
        <div class="tactical-card card-dark" id="card-crowd">
          <div style="font-family: var(--font-mono); font-size: 16px; font-weight: 800; color: #FF8A80; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 12px;">
            CIVIC TRUTH
          </div>
          <div style="font-size: 36px; font-weight: 900; line-height: 1.25; margin-bottom: 22px;">
            Confidence + Crowds ≠ Truth
          </div>

          <div class="dossier-pill">
            <div style="font-size: 18px; color: rgba(255,255,255,0.85); line-height: 1.4;">
              If a case depends on prejudice instead of facts, looking confident doesn’t fix it. Neither does a roaring crowd.
            </div>
          </div>

          <div style="padding: 14px 20px; background: rgba(245, 197, 66, 0.15); border: 1.5px solid var(--gold-bright); border-radius: 16px; font-size: 18px; color: #FFD452; font-weight: 700; text-align: center;">
            Émile Zola's "J’Accuse…!" proved courage lies in demanding the facts.
          </div>
        </div>
      </div>
    </section>

    <!-- SCENE 7 (55.2s - 60.0s): Closing Lockup -->
    <section class="scene-viewport" id="scene-7" data-layout-allow-overlap="true">
      <div class="plate-container">
        <img class="plate-img" id="plate-7" src="assets/images/scene_3_military_degradation.jpg" alt="Dreyfus Historical Case Closing">
      </div>
      <div class="scene-content" style="justify-content: center;">
        <div class="tactical-card card-dark" id="card-closing" style="text-align: center; border-color: var(--gold-bright);">
          <div style="font-family: var(--font-mono); font-size: 16px; font-weight: 800; color: var(--gold-bright); letter-spacing: 2px; text-transform: uppercase;">
            BEYOND THE MYTH · CORE PRINCIPLE
          </div>
          <div style="font-size: 44px; font-weight: 900; line-height: 1.25; margin: 20px 0; color: #FFFFFF;">
            A label is not evidence. Ask what actually happened.
          </div>
          <div style="font-family: var(--font-mono); font-size: 17px; color: rgba(255, 255, 255, 0.8); letter-spacing: 1.5px;">
            THE DREYFUS AFFAIR (1894–1906) · BEYOND THE MYTH
          </div>
        </div>
      </div>
    </section>

    <!-- Subtitles persistent card -->
    <div class="subtitles-container" data-layout-allow-overlap="true">
      <div class="subtitles-card">
        <p class="subtitles-text" id="subtitles-display">He was convicted as a spy. He was innocent.</p>
      </div>
      <div class="source-tag">
        <span class="source-bullet"></span>
        <span id="source-display">ARCHIVES NATIONALES DE FRANCE</span>
      </div>
    </div>
  </div>

  <script>
    const cues = [
      {
        start: 0.0, end: 3.4,
        eyebrow: "FORENSIC CASE STUDY", icon: "⚖",
        subtitle: 'He was convicted as a spy. <span class="hl-coral">He was innocent.</span>',
        source: "ARCHIVES NATIONALES DE FRANCE"
      },
      {
        start: 3.4, end: 13.0,
        eyebrow: "THE 1894 CONVICTION", icon: "⚔",
        subtitle: 'Meet Alfred Dreyfus, a Jewish officer in the French army. In 1894, he was wrongly convicted of treason and <span class="hl-coral">sent to prison.</span>',
        source: "FRENCH MILITARY TRIBUNAL (1894)"
      },
      {
        start: 13.0, end: 24.5,
        eyebrow: "THE FORGED DOSSIER", icon: "📜",
        subtitle: 'The case involved secret evidence, <span class="hl-coral">forged documents,</span> and prejudice. Later evidence pointed to a different officer.',
        source: "THE HUBERT HENRY FORGERIES EXPOSED"
      },
      {
        start: 24.5, end: 36.2,
        eyebrow: "12-YEAR EXONERATION · 1906", icon: "🏛",
        subtitle: 'Correcting the case took years. Dreyfus was <span class="hl-teal">finally cleared in 1906.</span> A real person lost years of freedom.',
        source: "COUR DE CASSATION (JULY 12, 1906)"
      },
      {
        start: 36.2, end: 47.5,
        eyebrow: "EVIDENCE OVER IDENTITY", icon: "🔍",
        subtitle: 'The lesson is that someone’s Jewish identity is <span class="hl-coral">not proof that they’re disloyal.</span> You still need reliable evidence.',
        source: "STANDARDS OF JURISPRUDENCE & EVIDENCE"
      },
      {
        start: 47.5, end: 55.2,
        eyebrow: "MOB OPINION ≠ JUSTICE", icon: "📢",
        subtitle: 'If a case depends on prejudice instead of facts, <span class="hl-gold">looking confident doesn’t fix it. Neither does a crowd.</span>',
        source: "ÉMILE ZOLA · 'J’ACCUSE…!' (1898)"
      },
      {
        start: 55.2, end: 60.0,
        eyebrow: "BEYOND THE MYTH", icon: "✦",
        subtitle: '<span class="hl-gold">A label is not evidence. Ask what actually happened.</span>',
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

    // SCENE 1 (0.0s - 3.4s)
    tl.set("#scene-1", { display: "block", opacity: 1 }, 0.0);
    tl.call(() => updateCue(0), null, 0.0);
    tl.fromTo("#plate-1", { scale: 1.0 }, { scale: 1.06, duration: 3.4, ease: "none" }, 0.0);
    tl.fromTo("#card-hook", { scale: 0.9, opacity: 0 }, { scale: 1.0, opacity: 1, duration: 0.6, ease: "back.out(1.4)" }, 0.2);
    tl.to("#scene-1", { opacity: 0, duration: 0.35 }, 3.05);
    tl.set("#scene-1", { display: "none" }, 3.4);

    // SCENE 2 (3.4s - 13.0s)
    tl.set("#scene-2", { display: "block", opacity: 0 }, 3.4);
    tl.to("#scene-2", { opacity: 1, duration: 0.35 }, 3.4);
    tl.call(() => updateCue(1), null, 3.4);
    tl.fromTo("#plate-2", { scale: 1.0 }, { scale: 1.08, duration: 9.6, ease: "none" }, 3.4);
    tl.fromTo("#card-dreyfus", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }, 3.7);
    tl.to("#scene-2", { opacity: 0, duration: 0.35 }, 12.65);
    tl.set("#scene-2", { display: "none" }, 13.0);

    // SCENE 3 (13.0s - 24.5s)
    tl.set("#scene-3", { display: "block", opacity: 0 }, 13.0);
    tl.to("#scene-3", { opacity: 1, duration: 0.35 }, 13.0);
    tl.call(() => updateCue(2), null, 13.0);
    tl.fromTo("#plate-3", { scale: 1.0 }, { scale: 1.08, duration: 11.5, ease: "none" }, 13.0);
    tl.fromTo("#card-conspiracy", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }, 13.3);
    tl.to("#scene-3", { opacity: 0, duration: 0.35 }, 24.15);
    tl.set("#scene-3", { display: "none" }, 24.5);

    // SCENE 4 (24.5s - 36.2s)
    tl.set("#scene-4", { display: "block", opacity: 0 }, 24.5);
    tl.to("#scene-4", { opacity: 1, duration: 0.35 }, 24.5);
    tl.call(() => updateCue(3), null, 24.5);
    tl.fromTo("#plate-4", { scale: 1.0 }, { scale: 1.08, duration: 11.7, ease: "none" }, 24.5);
    tl.fromTo("#card-exoneration", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }, 24.8);
    tl.to("#scene-4", { opacity: 0, duration: 0.35 }, 35.85);
    tl.set("#scene-4", { display: "none" }, 36.2);

    // SCENE 5 (36.2s - 47.5s)
    tl.set("#scene-5", { display: "block", opacity: 0 }, 36.2);
    tl.to("#scene-5", { opacity: 1, duration: 0.35 }, 36.2);
    tl.call(() => updateCue(4), null, 36.2);
    tl.fromTo("#plate-5", { scale: 1.0 }, { scale: 1.08, duration: 11.3, ease: "none" }, 36.2);
    tl.fromTo("#card-evidence", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }, 36.5);
    tl.to("#scene-5", { opacity: 0, duration: 0.35 }, 47.15);
    tl.set("#scene-5", { display: "none" }, 47.5);

    // SCENE 6 (47.5s - 55.2s)
    tl.set("#scene-6", { display: "block", opacity: 0 }, 47.5);
    tl.to("#scene-6", { opacity: 1, duration: 0.35 }, 47.5);
    tl.call(() => updateCue(5), null, 47.5);
    tl.fromTo("#plate-6", { scale: 1.0 }, { scale: 1.07, duration: 7.7, ease: "none" }, 47.5);
    tl.fromTo("#card-crowd", { scale: 0.9, opacity: 0 }, { scale: 1.0, opacity: 1, duration: 0.6, ease: "back.out(1.4)" }, 47.8);
    tl.to("#scene-6", { opacity: 0, duration: 0.35 }, 54.85);
    tl.set("#scene-6", { display: "none" }, 55.2);

    // SCENE 7 (55.2s - 60.0s)
    tl.set("#scene-7", { display: "block", opacity: 0 }, 55.2);
    tl.to("#scene-7", { opacity: 1, duration: 0.35 }, 55.2);
    tl.call(() => updateCue(6), null, 55.2);
    tl.fromTo("#plate-7", { scale: 1.0 }, { scale: 1.05, duration: 4.8, ease: "none" }, 55.2);
    tl.fromTo("#card-closing", { scale: 0.9, opacity: 0 }, { scale: 1.0, opacity: 1, duration: 0.6, ease: "back.out(1.4)" }, 55.5);
    tl.to("#root", { x: -1080, duration: 0.8, ease: "power2.in" }, 59.2);
  </script>
</body>
</html>
`;

fs.writeFileSync(targetHtml, htmlContent, 'utf8');
console.log('[OK] Wrote Cinematic Ep09 index.html');

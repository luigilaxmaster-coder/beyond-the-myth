const fs = require('fs');
const path = require('path');

const targetHtml = path.join(__dirname, '..', 'index.html');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=1080, height=1920, initial-scale=1.0">
  <title>Beyond The Myth · Ep. 007: Policy Critique vs. Classmate Scapegoating</title>
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

    .distinction-card {
      background: rgba(255, 255, 255, 0.08);
      border-radius: 20px;
      padding: 22px 24px;
      margin-bottom: 16px;
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
        <span class="brand-tagline">EPISODE 007 · CIVIC LITERACY</span>
      </div>
    </header>

    <div class="scene-eyebrow" data-layout-allow-overlap="true">
      <div class="eyebrow-chip">
        <span class="eyebrow-icon" id="eyebrow-icon">⚖</span>
        <span class="eyebrow-text" id="eyebrow-text">CIVIC DISCOURSE PRINCIPLE</span>
      </div>
    </div>

    <!-- SCENE 1 (0.0s - 3.5s): Hook: Classmate Campus -->
    <section class="scene-viewport" id="scene-1" data-layout-allow-overlap="true">
      <div class="plate-container">
        <img class="plate-img" id="plate-1" src="assets/images/scene_1_campus_quad.jpg" alt="University Library Campus Quad">
      </div>
      <div class="scene-content" style="justify-content: center;">
        <div class="tactical-card card-dark" id="card-hook" style="text-align: center; border-color: var(--gold-bright);">
          <div style="font-family: var(--font-mono); font-size: 16px; font-weight: 800; color: var(--gold-bright); letter-spacing: 2px; text-transform: uppercase;">
            CORE CIVIC BOUNDARY
          </div>
          <div style="font-size: 44px; font-weight: 900; line-height: 1.25; margin: 20px 0; color: #FFFFFF;">
            Your Jewish classmate is NOT a government press office.
          </div>
          <div style="font-family: var(--font-mono); font-size: 20px; font-weight: 700; color: #FF8A80; letter-spacing: 1.5px;">
            STUDENTS ≠ STATE SPOKESPERSONS
          </div>
        </div>
      </div>
    </section>

    <!-- SCENE 2 (3.5s - 15.6s): Criticizing Policy vs Antismitism -->
    <section class="scene-viewport" id="scene-2" data-layout-allow-overlap="true">
      <div class="plate-container">
        <img class="plate-img" id="plate-2" src="assets/images/scene_2_diplomatic_podium.jpg" alt="United Nations Diplomatic Assembly">
      </div>
      <div class="scene-content">
        <div class="tactical-card card-dark" id="card-policy">
          <div style="font-family: var(--font-mono); font-size: 16px; font-weight: 800; color: var(--gold-bright); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 12px;">
            LEGAL & CIVIC CLARITY
          </div>
          <div style="font-size: 34px; font-weight: 900; line-height: 1.25; margin-bottom: 22px;">
            Criticism of government is legitimate. Scapegoating people is not.
          </div>

          <div class="distinction-card" style="border-left: 5px solid #58E2D0;">
            <div style="font-size: 20px; font-weight: 800; color: #58E2D0; margin-bottom: 4px;">
              ✔ POLICY INVESTIGATION
            </div>
            <div style="font-size: 18px; color: rgba(255,255,255,0.85); line-height: 1.4;">
              Government actions, laws, and military decisions can and should be scrutinized, debated, and protested.
            </div>
          </div>

          <div class="distinction-card" style="border-left: 5px solid #FF8A80;">
            <div style="font-size: 20px; font-weight: 800; color: #FF8A80; margin-bottom: 4px;">
              ❌ COLLECTIVE BLAME
            </div>
            <div style="font-size: 18px; color: rgba(255,255,255,0.85); line-height: 1.4;">
              Assigning moral responsibility for state decisions to everyday Jewish people everywhere is antisemitic.
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SCENE 3 (15.6s - 26.0s): Logical Distinction -->
    <section class="scene-viewport" id="scene-3" data-layout-allow-overlap="true">
      <div class="plate-container">
        <img class="plate-img" id="plate-3" src="assets/images/scene_3_diverse_students.jpg" alt="University Seminar Classroom">
      </div>
      <div class="scene-content">
        <div class="tactical-card" id="card-claims" style="background: #FFF9F5; color: #1A1722;">
          <div style="font-family: var(--font-mono); font-size: 16px; font-weight: 800; color: var(--teal-accent); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 12px;">
            TWO ENTIRELY DIFFERENT CLAIMS
          </div>
          <div style="font-size: 34px; font-weight: 900; line-height: 1.25; margin-bottom: 20px;">
            Recognize the rhetorical leap:
          </div>

          <div style="background: #E8F5E9; border-left: 6px solid #2E7D32; padding: 18px 20px; border-radius: 0 16px 16px 0; margin-bottom: 16px;">
            <div style="font-weight: 800; font-size: 19px; color: #2E7D32; margin-bottom: 4px;">CLAIM 1: SUBSTANTIVE CRITIQUE</div>
            <div style="font-size: 18px; color: #1B5E20; font-weight: 600;">"This specific policy causes humanitarian harm." (Examines a real policy)</div>
          </div>

          <div style="background: #FFEBEE; border-left: 6px solid #C62828; padding: 18px 20px; border-radius: 0 16px 16px 0;">
            <div style="font-weight: 800; font-size: 19px; color: #C62828; margin-bottom: 4px;">CLAIM 2: COLLECTIVE GUILT</div>
            <div style="font-size: 18px; color: #B71C1C; font-weight: 600;">"You're Jewish, so you must answer for it." (Assigns guilt from identity)</div>
          </div>
        </div>
      </div>
    </section>

    <!-- SCENE 4 (26.0s - 37.0s): Political Diversity -->
    <section class="scene-viewport" id="scene-4" data-layout-allow-overlap="true">
      <div class="plate-container">
        <img class="plate-img" id="plate-4" src="assets/images/scene_2_diplomatic_podium.jpg" alt="Diplomatic Forum and Public Dialogue">
      </div>
      <div class="scene-content">
        <div class="tactical-card card-dark" id="card-diversity">
          <div style="font-family: var(--font-mono); font-size: 16px; font-weight: 800; color: var(--gold-bright); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 12px;">
            POLITICAL REALITY
          </div>
          <div style="font-size: 34px; font-weight: 900; line-height: 1.25; margin-bottom: 22px;">
            Jewish people do NOT hold one political opinion.
          </div>

          <div style="background: rgba(255,255,255,0.08); border-radius: 18px; padding: 22px; margin-bottom: 16px; border: 1.5px solid rgba(255,255,255,0.15);">
            <div style="font-size: 20px; font-weight: 800; color: #FFD452; margin-bottom: 6px;">
              Vibrant Internal Debate
            </div>
            <div style="font-size: 18px; color: rgba(255,255,255,0.85); line-height: 1.4;">
              Within Israel and across the global diaspora, opinions span the entire political spectrum: progressive, conservative, centrist, and peace advocates.
            </div>
          </div>

          <div style="padding: 14px 20px; background: rgba(88, 226, 208, 0.15); border: 1.5px solid #58E2D0; border-radius: 16px; font-size: 18px; color: #58E2D0; font-weight: 700; text-align: center;">
            No individual is answerable for someone else's decisions.
          </div>
        </div>
      </div>
    </section>

    <!-- SCENE 5 (37.0s - 47.0s): Universal Human Rights Standard -->
    <section class="scene-viewport" id="scene-5" data-layout-allow-overlap="true">
      <div class="plate-container">
        <img class="plate-img" id="plate-5" src="assets/images/scene_4_human_rights.jpg" alt="Universal Declaration of Human Rights">
      </div>
      <div class="scene-content">
        <div class="tactical-card card-dark" id="card-universal">
          <div style="font-family: var(--font-mono); font-size: 16px; font-weight: 800; color: #58E2D0; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 12px;">
            UNIVERSAL ETHICAL PRINCIPLE
          </div>
          <div style="font-size: 34px; font-weight: 900; line-height: 1.25; margin-bottom: 22px;">
            The exact same principle protects everyone:
          </div>

          <div style="background: rgba(255,255,255,0.08); border-radius: 18px; padding: 22px; margin-bottom: 16px; border: 1.5px solid rgba(255,255,255,0.15);">
            <div style="font-size: 20px; font-weight: 800; color: #58E2D0; margin-bottom: 6px;">
              Equal Protection For All
            </div>
            <div style="font-size: 18px; color: rgba(255,255,255,0.85); line-height: 1.4;">
              Protects a Palestinian classmate from being blamed for an armed group, just as it protects a Jewish classmate from state accountability.
            </div>
          </div>

          <div style="padding: 14px 20px; background: rgba(245, 197, 66, 0.15); border: 1.5px solid var(--gold-bright); border-radius: 16px; font-size: 18px; color: #FFD452; font-weight: 700; text-align: center;">
            People are responsible for their OWN actions, not someone else's label.
          </div>
        </div>
      </div>
    </section>

    <!-- SCENE 6 (47.0s - 55.3s): 3-Pillar Specificity Rule -->
    <section class="scene-viewport" id="scene-6" data-layout-allow-overlap="true">
      <div class="plate-container">
        <img class="plate-img" id="plate-6" src="assets/images/scene_1_campus_quad.jpg" alt="Campus Academic Research Library">
      </div>
      <div class="scene-content">
        <div class="tactical-card card-dark" id="card-pillars">
          <div style="font-family: var(--font-mono); font-size: 16px; font-weight: 800; color: var(--gold-bright); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 12px;">
            FACT-BASED CRITICISM STANDARD
          </div>
          <div style="font-size: 34px; font-weight: 900; line-height: 1.25; margin-bottom: 20px;">
            Keep criticism attached to what happened:
          </div>

          <div class="distinction-card">
            <span style="font-family: var(--font-mono); font-weight: 800; color: #FFD452;">1. NAME THE POLICY:</span>
            <span style="font-size: 17px; margin-left: 8px;">What specific statute, action, or directive?</span>
          </div>
          <div class="distinction-card">
            <span style="font-family: var(--font-mono); font-weight: 800; color: #58E2D0;">2. NAME DECISION-MAKERS:</span>
            <span style="font-size: 17px; margin-left: 8px;">Which ministry, official, or commander?</span>
          </div>
          <div class="distinction-card">
            <span style="font-family: var(--font-mono); font-weight: 800; color: #FF8A80;">3. BRING THE EVIDENCE:</span>
            <span style="font-size: 17px; margin-left: 8px;">What verified reports document the facts?</span>
          </div>
        </div>
      </div>
    </section>

    <!-- SCENE 7 (55.3s - 60.0s): Closing Lockup -->
    <section class="scene-viewport" id="scene-7" data-layout-allow-overlap="true">
      <div class="plate-container">
        <img class="plate-img" id="plate-7" src="assets/images/scene_4_human_rights.jpg" alt="Universal Declaration Closing Lockup">
      </div>
      <div class="scene-content" style="justify-content: center;">
        <div class="tactical-card card-dark" id="card-closing" style="text-align: center; border-color: var(--gold-bright);">
          <div style="font-family: var(--font-mono); font-size: 16px; font-weight: 800; color: var(--gold-bright); letter-spacing: 2px; text-transform: uppercase;">
            BEYOND THE MYTH · CORE PRINCIPLE
          </div>
          <div style="font-size: 44px; font-weight: 900; line-height: 1.25; margin: 20px 0; color: #FFFFFF;">
            Strong criticism needs accuracy. Not collective blame.
          </div>
          <div style="font-family: var(--font-mono); font-size: 17px; color: rgba(255, 255, 255, 0.8); letter-spacing: 1.5px;">
            CIVIC ACCURACY · HUMAN DIGNITY · BEYOND THE MYTH
          </div>
        </div>
      </div>
    </section>

    <!-- Subtitles persistent card -->
    <div class="subtitles-container" data-layout-allow-overlap="true">
      <div class="subtitles-card">
        <p class="subtitles-text" id="subtitles-display">Your Jewish classmate is not a government press office.</p>
      </div>
      <div class="source-tag">
        <span class="source-bullet"></span>
        <span id="source-display">CIVIC DISCOURSE & HUMAN RIGHTS PRINCIPLES</span>
      </div>
    </div>
  </div>

  <script>
    const cues = [
      {
        start: 0.0, end: 3.5,
        eyebrow: "CIVIC DISCOURSE PRINCIPLE", icon: "⚖",
        subtitle: 'Your Jewish classmate is <span class="hl-coral">not a government press office.</span>',
        source: "CIVIC DISCOURSE & HUMAN RIGHTS PRINCIPLES"
      },
      {
        start: 3.5, end: 15.6,
        eyebrow: "CRITICISM vs. ANTISEMITISM", icon: "🏛",
        subtitle: 'Criticizing government policy is not automatically antisemitic. <span class="hl-gold">Policies can be investigated and challenged.</span> That’s not blaming Jewish people collectively.',
        source: "JERUSALEM DECLARATION & IHRA GUIDANCE"
      },
      {
        start: 15.6, end: 26.0,
        eyebrow: "CRUCIAL LOGICAL DISTINCTION", icon: "🔍",
        subtitle: '“This policy causes harm” identifies something to examine. <span class="hl-coral">“You’re Jewish, so you’re responsible”</span> assigns guilt from identity. Those are different claims.',
        source: "PHILOSOPHICAL & LEGAL ETHICS"
      },
      {
        start: 26.0, end: 37.0,
        eyebrow: "POLITICAL DIVERSITY", icon: "🗳",
        subtitle: 'Being Jewish doesn’t make someone answerable for another person’s decisions. <span class="hl-teal">Jewish people don’t all share one political opinion.</span>',
        source: "POLITICAL SCIENCE RESEARCH"
      },
      {
        start: 37.0, end: 47.0,
        eyebrow: "UNIVERSAL MORAL STANDARD", icon: "🤝",
        subtitle: 'The same principle protects a <span class="hl-teal">Palestinian classmate</span> from being blamed for an armed group. People answer for their actions, not a label.',
        source: "UNIVERSAL HUMAN RIGHTS STANDARD"
      },
      {
        start: 47.0, end: 55.3,
        eyebrow: "FACT-BASED CRITICISM RULE", icon: "📋",
        subtitle: 'Be specific. <span class="hl-gold">Name the policy, the decision-maker, and the evidence.</span> Keep the criticism attached to what happened.',
        source: "STANDARDS OF ACCURACY & EVIDENCE"
      },
      {
        start: 55.3, end: 60.0,
        eyebrow: "BEYOND THE MYTH", icon: "✦",
        subtitle: '<span class="hl-gold">Strong criticism needs accuracy. Not collective blame.</span>',
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

    // SCENE 2 (3.5s - 15.6s)
    tl.set("#scene-2", { display: "block", opacity: 0 }, 3.5);
    tl.to("#scene-2", { opacity: 1, duration: 0.35 }, 3.5);
    tl.call(() => updateCue(1), null, 3.5);
    tl.fromTo("#plate-2", { scale: 1.0 }, { scale: 1.08, duration: 12.1, ease: "none" }, 3.5);
    tl.fromTo("#card-policy", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }, 3.8);
    tl.to("#scene-2", { opacity: 0, duration: 0.35 }, 15.25);
    tl.set("#scene-2", { display: "none" }, 15.6);

    // SCENE 3 (15.6s - 26.0s)
    tl.set("#scene-3", { display: "block", opacity: 0 }, 15.6);
    tl.to("#scene-3", { opacity: 1, duration: 0.35 }, 15.6);
    tl.call(() => updateCue(2), null, 15.6);
    tl.fromTo("#plate-3", { scale: 1.0 }, { scale: 1.08, duration: 10.4, ease: "none" }, 15.6);
    tl.fromTo("#card-claims", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }, 15.9);
    tl.to("#scene-3", { opacity: 0, duration: 0.35 }, 25.65);
    tl.set("#scene-3", { display: "none" }, 26.0);

    // SCENE 4 (26.0s - 37.0s)
    tl.set("#scene-4", { display: "block", opacity: 0 }, 26.0);
    tl.to("#scene-4", { opacity: 1, duration: 0.35 }, 26.0);
    tl.call(() => updateCue(3), null, 26.0);
    tl.fromTo("#plate-4", { scale: 1.0 }, { scale: 1.08, duration: 11.0, ease: "none" }, 26.0);
    tl.fromTo("#card-diversity", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }, 26.3);
    tl.to("#scene-4", { opacity: 0, duration: 0.35 }, 36.65);
    tl.set("#scene-4", { display: "none" }, 37.0);

    // SCENE 5 (37.0s - 47.0s)
    tl.set("#scene-5", { display: "block", opacity: 0 }, 37.0);
    tl.to("#scene-5", { opacity: 1, duration: 0.35 }, 37.0);
    tl.call(() => updateCue(4), null, 37.0);
    tl.fromTo("#plate-5", { scale: 1.0 }, { scale: 1.08, duration: 10.0, ease: "none" }, 37.0);
    tl.fromTo("#card-universal", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }, 37.3);
    tl.to("#scene-5", { opacity: 0, duration: 0.35 }, 46.65);
    tl.set("#scene-5", { display: "none" }, 47.0);

    // SCENE 6 (47.0s - 55.3s)
    tl.set("#scene-6", { display: "block", opacity: 0 }, 47.0);
    tl.to("#scene-6", { opacity: 1, duration: 0.35 }, 47.0);
    tl.call(() => updateCue(5), null, 47.0);
    tl.fromTo("#plate-6", { scale: 1.0 }, { scale: 1.07, duration: 8.3, ease: "none" }, 47.0);
    tl.fromTo("#card-pillars", { scale: 0.9, opacity: 0 }, { scale: 1.0, opacity: 1, duration: 0.6, ease: "back.out(1.4)" }, 47.3);
    tl.to("#scene-6", { opacity: 0, duration: 0.35 }, 54.95);
    tl.set("#scene-6", { display: "none" }, 55.3);

    // SCENE 7 (55.3s - 60.0s)
    tl.set("#scene-7", { display: "block", opacity: 0 }, 55.3);
    tl.to("#scene-7", { opacity: 1, duration: 0.35 }, 55.3);
    tl.call(() => updateCue(6), null, 55.3);
    tl.fromTo("#plate-7", { scale: 1.0 }, { scale: 1.05, duration: 4.7, ease: "none" }, 55.3);
    tl.fromTo("#card-closing", { scale: 0.9, opacity: 0 }, { scale: 1.0, opacity: 1, duration: 0.6, ease: "back.out(1.4)" }, 55.6);
    tl.to("#root", { x: -1080, duration: 0.8, ease: "power2.in" }, 59.2);
  </script>
</body>
</html>
`;

fs.writeFileSync(targetHtml, htmlContent, 'utf8');
console.log('[OK] Wrote Cinematic Ep07 index.html');

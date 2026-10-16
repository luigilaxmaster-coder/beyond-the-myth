const fs = require('fs');
const path = require('path');

const targetHtml = path.join(__dirname, '..', 'index.html');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=1080, height=1920, initial-scale=1.0">
  <title>Beyond The Myth · Ep. 010: The 3-Question Fact-Check Protocol</title>
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

    .protocol-step {
      display: flex;
      align-items: flex-start;
      gap: 18px;
      background: rgba(255, 255, 255, 0.08);
      border-radius: 20px;
      padding: 20px 22px;
      margin-bottom: 14px;
      border: 1.5px solid rgba(255, 255, 255, 0.15);
    }

    .step-number {
      background: var(--gold-bright);
      color: #1A1722;
      font-family: var(--font-mono);
      font-weight: 900;
      font-size: 22px;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
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
        <span class="brand-tagline">EPISODE 010 · SEASON 1 FINALE</span>
      </div>
    </header>

    <div class="scene-eyebrow" data-layout-allow-overlap="true">
      <div class="eyebrow-chip">
        <span class="eyebrow-icon" id="eyebrow-icon">🔍</span>
        <span class="eyebrow-text" id="eyebrow-text">VERIFICATION PROTOCOL</span>
      </div>
    </div>

    <!-- SCENE 1 (0.0s - 3.8s): Hook: 3 Questions Before Sharing -->
    <section class="scene-viewport" id="scene-1" data-layout-allow-overlap="true">
      <div class="plate-container">
        <img class="plate-img" id="plate-1" src="assets/images/scene_1_mobile_feed.jpg" alt="Smartphone Mobile Feed">
      </div>
      <div class="scene-content" style="justify-content: center;">
        <div class="tactical-card card-dark" id="card-hook" style="text-align: center; border-color: var(--gold-bright);">
          <div style="font-family: var(--font-mono); font-size: 16px; font-weight: 800; color: var(--gold-bright); letter-spacing: 2px; text-transform: uppercase;">
            DIGITAL LITERACY TOOLKIT
          </div>
          <div style="font-size: 44px; font-weight: 900; line-height: 1.25; margin: 20px 0; color: #FFFFFF;">
            Before you send that post, give it 3 questions.
          </div>
          <div style="display: inline-block; background: rgba(245, 197, 66, 0.2); border: 2px solid var(--gold-bright); padding: 8px 28px; border-radius: 30px; font-family: var(--font-mono); font-size: 20px; font-weight: 800; color: #FFD452; letter-spacing: 1.5px;">
            THE 3-QUESTION FACT-CHECK PROTOCOL
          </div>
        </div>
      </div>
    </section>

    <!-- SCENE 2 (3.8s - 12.0s): Question 1: Where did it start? -->
    <section class="scene-viewport" id="scene-2" data-layout-allow-overlap="true">
      <div class="plate-container">
        <img class="plate-img" id="plate-2" src="assets/images/scene_2_newsroom_station.jpg" alt="Newsroom Computer Workstation">
      </div>
      <div class="scene-content">
        <div class="tactical-card card-dark" id="card-q1">
          <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 14px;">
            <div class="step-number" style="background: #58E2D0; color: #1A1722;">1</div>
            <div style="font-family: var(--font-mono); font-size: 20px; font-weight: 800; color: #58E2D0; letter-spacing: 2px;">
              QUESTION ONE: ORIGIN & PROVENANCE
            </div>
          </div>
          <div style="font-size: 34px; font-weight: 900; line-height: 1.25; margin-bottom: 20px;">
            Where did the claim actually start?
          </div>

          <div class="protocol-step">
            <div style="font-size: 18px; color: rgba(255,255,255,0.85); line-height: 1.4;">
              <strong>Not who reposted it:</strong> Influencers and aggregate accounts simply amplify. Trace the claim back to the primary source, original document, or interview.
            </div>
          </div>

          <div style="padding: 14px 20px; background: rgba(88, 226, 208, 0.15); border: 1.5px solid #58E2D0; border-radius: 16px; font-family: var(--font-mono); font-size: 16px; color: #58E2D0; text-align: center;">
            ★ CHECK THE ORIGINAL TIMESTAMP AND FULL CONTEXT ★
          </div>
        </div>
      </div>
    </section>

    <!-- SCENE 3 (12.0s - 23.7s): Question 2: Scope of Evidence -->
    <section class="scene-viewport" id="scene-3" data-layout-allow-overlap="true">
      <div class="plate-container">
        <img class="plate-img" id="plate-3" src="assets/images/scene_3_lateral_diagram.jpg" alt="Verification Data Flow Diagram">
      </div>
      <div class="scene-content">
        <div class="tactical-card" id="card-q2" style="background: #FFF9F5; color: #1A1722;">
          <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 12px;">
            <div class="step-number" style="background: var(--teal-accent); color: #FFF;">2</div>
            <div style="font-family: var(--font-mono); font-size: 18px; font-weight: 800; color: var(--teal-accent); letter-spacing: 2px;">
              QUESTION TWO: SCOPE OF EVIDENCE
            </div>
          </div>
          <div style="font-size: 32px; font-weight: 900; line-height: 1.25; margin-bottom: 18px;">
            What does the evidence actually prove?
          </div>

          <div style="background: #F4EBE2; border-left: 6px solid var(--teal-accent); padding: 16px 20px; border-radius: 0 16px 16px 0; margin-bottom: 14px;">
            <div style="font-size: 18px; color: #332B3E; font-weight: 600; line-height: 1.35;">
              A certification logo proves standard compliance. A company filing proves legal shareholdings.
            </div>
          </div>

          <div style="background: #FFEBEE; border-left: 6px solid var(--rust-accent); padding: 16px 20px; border-radius: 0 16px 16px 0;">
            <div style="font-size: 18px; color: #C62828; font-weight: 800; line-height: 1.35;">
              Neither gives anyone permission to invent sinister extra claims.
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SCENE 4 (23.7s - 34.5s): Question 3: The Collective Blame Leap -->
    <section class="scene-viewport" id="scene-4" data-layout-allow-overlap="true">
      <div class="plate-container">
        <img class="plate-img" id="plate-4" src="assets/images/scene_4_evidence_magnifier.jpg" alt="Magnifying Glass on Source Document">
      </div>
      <div class="scene-content">
        <div class="tactical-card card-dark" id="card-q3">
          <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 14px;">
            <div class="step-number" style="background: #FF8A80; color: #1A1722;">3</div>
            <div style="font-family: var(--font-mono); font-size: 20px; font-weight: 800; color: #FF8A80; letter-spacing: 2px;">
              QUESTION THREE: THE SCAPEGOAT LEAP
            </div>
          </div>
          <div style="font-size: 34px; font-weight: 900; line-height: 1.25; margin-bottom: 20px;">
            Did the post jump to collective blame?
          </div>

          <div class="protocol-step" style="border-left: 5px solid #FF8A80;">
            <div style="font-size: 18px; color: rgba(255,255,255,0.85); line-height: 1.4;">
              Did the creator leap from one person's actions to accusing Jewish people as an entire group?
            </div>
          </div>

          <div style="padding: 14px 20px; background: rgba(255, 138, 128, 0.2); border: 1.5px solid #FF8A80; border-radius: 16px; font-size: 18px; color: #FF8A80; font-weight: 700; text-align: center;">
            That jump needs challenging—not another share.
          </div>
        </div>
      </div>
    </section>

    <!-- SCENE 5 (34.5s - 45.5s): Intellectual Humility -->
    <section class="scene-viewport" id="scene-5" data-layout-allow-overlap="true">
      <div class="plate-container">
        <img class="plate-img" id="plate-5" src="assets/images/scene_2_newsroom_station.jpg" alt="Investigative Workstation Check">
      </div>
      <div class="scene-content">
        <div class="tactical-card card-dark" id="card-humility">
          <div style="font-family: var(--font-mono); font-size: 16px; font-weight: 800; color: #58E2D0; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 12px;">
            EPISTEMIC COURAGE
          </div>
          <div style="font-size: 34px; font-weight: 900; line-height: 1.25; margin-bottom: 22px;">
            "I don’t know yet" beats confident error.
          </div>

          <div class="protocol-step">
            <div style="font-size: 18px; color: rgba(255,255,255,0.85); line-height: 1.4;">
              Check an independent, verified source. And if the evidence is still incomplete or ambiguous, having the courage to say "I don't know yet" protects everyone from spreading harm.
            </div>
          </div>

          <div style="padding: 14px 20px; background: rgba(88, 226, 208, 0.15); border: 1.5px solid #58E2D0; border-radius: 16px; font-size: 18px; color: #58E2D0; font-weight: 700; text-align: center;">
            Uncertainty with honesty > Falsehood with swagger.
          </div>
        </div>
      </div>
    </section>

    <!-- SCENE 6 (45.5s - 52.8s): Be the Source Bearer -->
    <section class="scene-viewport" id="scene-6" data-layout-allow-overlap="true">
      <div class="plate-container">
        <img class="plate-img" id="plate-6" src="assets/images/scene_4_evidence_magnifier.jpg" alt="Forensic Source Verification">
      </div>
      <div class="scene-content" style="justify-content: center;">
        <div class="tactical-card card-dark" id="card-bearer" style="text-align: center; border-color: var(--gold-bright);">
          <div style="font-family: var(--font-mono); font-size: 16px; font-weight: 800; color: var(--gold-bright); letter-spacing: 2px; text-transform: uppercase;">
            CIVIC PARTICIPATION
          </div>
          <div style="font-size: 40px; font-weight: 900; line-height: 1.25; margin: 18px 0; color: #FFFFFF;">
            You don’t have to win every comment section.
          </div>
          <div style="font-size: 24px; font-weight: 700; color: #58E2D0; letter-spacing: 1px;">
            Be the person who brings the actual source.
          </div>
        </div>
      </div>
    </section>

    <!-- SCENE 7 (52.8s - 60.0s): Season Finale Closing -->
    <section class="scene-viewport" id="scene-7" data-layout-allow-overlap="true">
      <div class="plate-container">
        <img class="plate-img" id="plate-7" src="assets/images/scene_1_mobile_feed.jpg" alt="Season Finale Mobile Feed Closing">
      </div>
      <div class="scene-content" style="justify-content: center;">
        <div class="tactical-card card-dark" id="card-closing" style="text-align: center; border-color: var(--gold-bright);">
          <div style="font-family: var(--font-mono); font-size: 16px; font-weight: 800; color: var(--gold-bright); letter-spacing: 2px; text-transform: uppercase;">
            BEYOND THE MYTH · SEASON 1 FINALE
          </div>
          <div style="font-size: 46px; font-weight: 900; line-height: 1.25; margin: 20px 0; color: #FFFFFF;">
            Specific claims. Real evidence.
          </div>
          <div style="font-family: var(--font-mono); font-size: 18px; color: rgba(255, 255, 255, 0.85); letter-spacing: 2px;">
            WHICH CLAIM SHOULD WE CHECK NEXT?
          </div>
        </div>
      </div>
    </section>

    <!-- Subtitles persistent card -->
    <div class="subtitles-container" data-layout-allow-overlap="true">
      <div class="subtitles-card">
        <p class="subtitles-text" id="subtitles-display">Before you send that post, give it three questions.</p>
      </div>
      <div class="source-tag">
        <span class="source-bullet"></span>
        <span id="source-display">DIGITAL INQUIRY GROUP & SHEG METHODOLOGY</span>
      </div>
    </div>
  </div>

  <script>
    const cues = [
      {
        start: 0.0, end: 3.8,
        eyebrow: "VERIFICATION PROTOCOL", icon: "🔍",
        subtitle: 'Before you send that post, <span class="hl-gold">give it three questions.</span>',
        source: "DIGITAL INQUIRY GROUP & SHEG METHODOLOGY"
      },
      {
        start: 3.8, end: 12.0,
        eyebrow: "QUESTION 1 · TRACE THE ORIGIN", icon: "🕵",
        subtitle: 'One: where did the claim start? <span class="hl-teal">Find the original document, interview, or report</span>—and check the date.',
        source: "LATERAL READING PROTOCOL"
      },
      {
        start: 12.0, end: 23.7,
        eyebrow: "QUESTION 2 · EVIDENCE SCOPE", icon: "📑",
        subtitle: 'Two: what does the evidence prove? A logo shows certification. A filing shows ownership. <span class="hl-coral">Neither lets you invent extra claims.</span>',
        source: "EVIDENCE BOUNDARIES & AUDIT RULES"
      },
      {
        start: 23.7, end: 34.5,
        eyebrow: "QUESTION 3 · THE SCAPEGOAT LEAP", icon: "🛑",
        subtitle: 'Three: did the post jump from one person’s actions to <span class="hl-coral">blaming a whole group?</span> That jump needs challenging, not another share.',
        source: "CIVIC DISCOURSE ETHICS"
      },
      {
        start: 34.5, end: 45.5,
        eyebrow: "INTELLECTUAL HUMILITY", icon: "💡",
        subtitle: 'Check a reliable source. Saying <span class="hl-teal">“I don’t know yet”</span> is far better than confidently spreading something false.',
        source: "STANDARDS OF FACT-CHECKING INTEGRITY"
      },
      {
        start: 45.5, end: 52.8,
        eyebrow: "BE THE SOURCE BEARER", icon: "📚",
        subtitle: 'You don’t have to win every comment section. <span class="hl-gold">You can be the person who brings the actual source.</span>',
        source: "CIVIC IMPACT & VERIFIED KNOWLEDGE"
      },
      {
        start: 52.8, end: 60.0,
        eyebrow: "BEYOND THE MYTH", icon: "✦",
        subtitle: 'Which claim should we check next? <span class="hl-gold">Specific claims. Real evidence.</span>',
        source: "BEYOND THE MYTH · SEASON 1 FINALE"
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

    // SCENE 1 (0.0s - 3.8s)
    tl.set("#scene-1", { display: "block", opacity: 1 }, 0.0);
    tl.call(() => updateCue(0), null, 0.0);
    tl.fromTo("#plate-1", { scale: 1.0 }, { scale: 1.06, duration: 3.8, ease: "none" }, 0.0);
    tl.fromTo("#card-hook", { scale: 0.9, opacity: 0 }, { scale: 1.0, opacity: 1, duration: 0.6, ease: "back.out(1.4)" }, 0.2);
    tl.to("#scene-1", { opacity: 0, duration: 0.35 }, 3.45);
    tl.set("#scene-1", { display: "none" }, 3.8);

    // SCENE 2 (3.8s - 12.0s)
    tl.set("#scene-2", { display: "block", opacity: 0 }, 3.8);
    tl.to("#scene-2", { opacity: 1, duration: 0.35 }, 3.8);
    tl.call(() => updateCue(1), null, 3.8);
    tl.fromTo("#plate-2", { scale: 1.0 }, { scale: 1.07, duration: 8.2, ease: "none" }, 3.8);
    tl.fromTo("#card-q1", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }, 4.1);
    tl.to("#scene-2", { opacity: 0, duration: 0.35 }, 11.65);
    tl.set("#scene-2", { display: "none" }, 12.0);

    // SCENE 3 (12.0s - 23.7s)
    tl.set("#scene-3", { display: "block", opacity: 0 }, 12.0);
    tl.to("#scene-3", { opacity: 1, duration: 0.35 }, 12.0);
    tl.call(() => updateCue(2), null, 12.0);
    tl.fromTo("#plate-3", { scale: 1.0 }, { scale: 1.08, duration: 11.7, ease: "none" }, 12.0);
    tl.fromTo("#card-q2", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }, 12.3);
    tl.to("#scene-3", { opacity: 0, duration: 0.35 }, 23.35);
    tl.set("#scene-3", { display: "none" }, 23.7);

    // SCENE 4 (23.7s - 34.5s)
    tl.set("#scene-4", { display: "block", opacity: 0 }, 23.7);
    tl.to("#scene-4", { opacity: 1, duration: 0.35 }, 23.7);
    tl.call(() => updateCue(3), null, 23.7);
    tl.fromTo("#plate-4", { scale: 1.0 }, { scale: 1.08, duration: 10.8, ease: "none" }, 23.7);
    tl.fromTo("#card-q3", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }, 24.0);
    tl.to("#scene-4", { opacity: 0, duration: 0.35 }, 34.15);
    tl.set("#scene-4", { display: "none" }, 34.5);

    // SCENE 5 (34.5s - 45.5s)
    tl.set("#scene-5", { display: "block", opacity: 0 }, 34.5);
    tl.to("#scene-5", { opacity: 1, duration: 0.35 }, 34.5);
    tl.call(() => updateCue(4), null, 34.5);
    tl.fromTo("#plate-5", { scale: 1.0 }, { scale: 1.08, duration: 11.0, ease: "none" }, 34.5);
    tl.fromTo("#card-humility", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }, 34.8);
    tl.to("#scene-5", { opacity: 0, duration: 0.35 }, 45.15);
    tl.set("#scene-5", { display: "none" }, 45.5);

    // SCENE 6 (45.5s - 52.8s)
    tl.set("#scene-6", { display: "block", opacity: 0 }, 45.5);
    tl.to("#scene-6", { opacity: 1, duration: 0.35 }, 45.5);
    tl.call(() => updateCue(5), null, 45.5);
    tl.fromTo("#plate-6", { scale: 1.0 }, { scale: 1.07, duration: 7.3, ease: "none" }, 45.5);
    tl.fromTo("#card-bearer", { scale: 0.9, opacity: 0 }, { scale: 1.0, opacity: 1, duration: 0.6, ease: "back.out(1.4)" }, 45.8);
    tl.to("#scene-6", { opacity: 0, duration: 0.35 }, 52.45);
    tl.set("#scene-6", { display: "none" }, 52.8);

    // SCENE 7 (52.8s - 60.0s)
    tl.set("#scene-7", { display: "block", opacity: 0 }, 52.8);
    tl.to("#scene-7", { opacity: 1, duration: 0.35 }, 52.8);
    tl.call(() => updateCue(6), null, 52.8);
    tl.fromTo("#plate-7", { scale: 1.0 }, { scale: 1.05, duration: 7.2, ease: "none" }, 52.8);
    tl.fromTo("#card-closing", { scale: 0.9, opacity: 0 }, { scale: 1.0, opacity: 1, duration: 0.6, ease: "back.out(1.4)" }, 53.1);
    tl.to("#root", { x: -1080, duration: 0.8, ease: "power2.in" }, 59.2);
  </script>
</body>
</html>
`;

fs.writeFileSync(targetHtml, htmlContent, 'utf8');
console.log('[OK] Wrote Cinematic Ep10 index.html');

const fs = require('fs');
const path = require('path');

const targetHtml = path.join(__dirname, '..', 'index.html');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=1080, height=1920, initial-scale=1.0">
  <title>Beyond The Myth · Ep. 002: A Real Screenshot Can Still Mislead You</title>
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

    /* SCENE 1 RETICLE */
    .hud-scanner {
      position: absolute;
      top: 360px;
      left: 50%;
      transform: translateX(-50%);
      width: 520px;
      height: 520px;
      border-radius: 50%;
      border: 2px dashed rgba(245, 197, 66, 0.6);
      pointer-events: none;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .scanner-target-badge {
      position: absolute;
      bottom: -60px;
      background: #0E0C14;
      border: 2px solid var(--gold-bright);
      border-radius: 30px;
      padding: 10px 24px;
      display: flex;
      align-items: center;
      gap: 12px;
      font-family: var(--font-mono);
      font-size: 17px;
      font-weight: 700;
      color: #FFFFFF;
      letter-spacing: 1.5px;
      white-space: nowrap;
      box-shadow: 0 8px 24px rgba(0,0,0,0.6);
    }

    /* SCENE 2 CROPPED DEMO */
    .crop-demo-container {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .quote-box {
      border-radius: 20px;
      padding: 26px 28px;
      border: 3px solid var(--ink-black);
      font-size: 26px;
      font-weight: 700;
      line-height: 1.4;
    }

    .quote-cropped {
      background: #FDF0EE;
      border-color: var(--rust-accent);
      color: var(--rust-accent);
      border-style: dashed;
    }

    .quote-full {
      background: #EAF4F1;
      border-color: var(--teal-accent);
      color: var(--ink-black);
    }

    /* SCENE 4 CHECKLIST CHIPS */
    .checklist-grid {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .check-item {
      display: flex;
      align-items: center;
      gap: 20px;
      background: #FFFFFF;
      border: 2.5px solid var(--ink-black);
      border-radius: 18px;
      padding: 18px 24px;
      box-shadow: 4px 4px 0 var(--ink-black);
    }

    .check-num {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: var(--gold-bright);
      color: var(--ink-black);
      font-family: var(--font-mono);
      font-size: 20px;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .check-content h4 {
      font-size: 22px;
      font-weight: 800;
      color: var(--ink-black);
    }

    .check-content p {
      font-size: 17px;
      color: var(--ink-muted);
      margin-top: 4px;
    }

    /* ETHICAL PRINCIPLE SPLIT */
    .split-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      width: 100%;
    }

    .split-card {
      border-radius: 20px;
      padding: 24px 22px;
      border: 2.5px solid var(--ink-black);
      box-shadow: 5px 5px 0 var(--ink-black);
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .split-card-ok {
      background: #E8F5F1;
      border-color: var(--teal-accent);
    }

    .split-card-bad {
      background: #FDF0EE;
      border-color: var(--rust-accent);
    }

    .stamp-equity {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      background: #FDF0EE;
      border: 3px solid var(--rust-accent);
      border-radius: 16px;
      padding: 18px 28px;
      font-family: var(--font-mono);
      font-size: 22px;
      font-weight: 800;
      color: var(--rust-accent);
      letter-spacing: 2px;
      text-transform: uppercase;
      transform: rotate(-2deg);
      box-shadow: 4px 4px 0 var(--rust-accent);
      margin-top: 14px;
      align-self: center;
    }
  </style>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
</head>
<body>
  <div id="root" data-composition-id="main" data-width="1080" data-height="1920" data-duration="60" data-layout-allow-overflow="true">
    <div class="theatrical-spotlight" data-layout-allow-overlap="true"></div>
    <div class="global-vignette" data-layout-allow-overlap="true"></div>

    <header class="show-header" data-layout-allow-overlap="true">
      <div class="brand-pill">
        <div class="pulse-dot"></div>
        <span class="brand-name">Beyond The Myth</span>
        <span class="brand-tagline">Civic Knowledge · Evidence Over Rumor</span>
      </div>
    </header>

    <div class="scene-eyebrow" data-layout-allow-overlap="true">
      <div class="eyebrow-chip" id="eyebrow-chip">
        <span class="eyebrow-icon" id="eyebrow-icon">✦</span>
        <span class="eyebrow-text" id="eyebrow-text">VERIFY BEFORE REPOSTING</span>
      </div>
    </div>

    <!-- SCENE 1 (0.0s - 4.0s): Macro Smartphone with Cropped Quote -->
    <section class="scene-viewport" id="scene-1" data-layout-allow-overlap="true">
      <div class="plate-container">
        <img class="plate-img" id="plate-1" src="assets/images/scene_1_phone.jpg" alt="Macro phone screenshot">
      </div>
      <div class="hud-scanner" id="hud-scanner-1">
        <div class="scanner-target-badge">
          <span>TARGET: VIRAL SCREENSHOT</span>
        </div>
      </div>
    </section>

    <!-- SCENE 2 (4.0s - 12.5s): Forensic uncropping demo -->
    <section class="scene-viewport" id="scene-2" data-layout-allow-overlap="true">
      <div class="plate-container">
        <img class="plate-img" id="plate-2" src="assets/images/scene_2_doc.jpg" alt="Laptop transcript analysis">
      </div>
      <div class="scene-content">
        <div class="tactical-card" id="card-crop-demo">
          <div style="font-family: var(--font-mono); font-size: 16px; font-weight: 800; color: var(--teal-accent); letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 12px;">
            DEMONSTRATION · HOW CROPPING REVERSES MEANING
          </div>
          <div class="crop-demo-container">
            <div class="quote-box quote-cropped" id="quote-part-1">
              "I AGREE..."
              <div style="font-family: var(--font-mono); font-size: 14px; margin-top: 6px; font-weight: 800;">[CROPPED POST: SOUNDS LIKE FULL CONSENT]</div>
            </div>
            <div class="quote-box quote-full" id="quote-part-2">
              "...WITH NEITHER CLAIM."
              <div style="font-family: var(--font-mono); font-size: 14px; margin-top: 6px; font-weight: 800; color: var(--teal-accent);">[ACTUAL COMPLETE STATEMENT: REJECTS BOTH CLAIMS]</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SCENE 3 (12.5s - 23.5s): Two investigators review accusation -->
    <section class="scene-viewport" id="scene-3" data-layout-allow-overlap="true">
      <div class="plate-container">
        <img class="plate-img" id="plate-3" src="assets/images/scene_3_team.jpg" alt="Investigative team verification dashboard">
      </div>
      <div class="scene-content">
        <div class="tactical-card" id="card-accuse-check">
          <div style="font-size: 28px; font-weight: 800; margin-bottom: 16px;">
            Same Words. Completely Different Meaning.
          </div>
          <div class="split-grid">
            <div class="split-card split-card-bad">
              <div style="font-family: var(--font-mono); font-size: 16px; font-weight: 800; color: var(--rust-accent);">WHAT IS SPREAD</div>
              <div style="font-size: 20px; font-weight: 700; line-height: 1.3;">One cropped snippet weaponized as proof against a community.</div>
            </div>
            <div class="split-card split-card-ok">
              <div style="font-family: var(--font-mono); font-size: 16px; font-weight: 800; color: var(--teal-accent);">WHAT TO DEMAND</div>
              <div style="font-size: 20px; font-weight: 700; line-height: 1.3;">Uncut original context, verified speaker & independent primary source.</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SCENE 4 (23.5s - 35.0s): 4-Point Investigation Checklist -->
    <section class="scene-viewport" id="scene-4" data-layout-allow-overlap="true">
      <div class="plate-container">
        <img class="plate-img" id="plate-4" src="assets/images/scene_2_doc.jpg" alt="Checklist forensic review">
      </div>
      <div class="scene-content">
        <div class="tactical-card" id="card-checklist">
          <div style="font-size: 28px; font-weight: 800; margin-bottom: 20px;">
            4 Questions Before You Hit Share
          </div>
          <div class="checklist-grid">
            <div class="check-item">
              <div class="check-num">01</div>
              <div class="check-content">
                <h4>Original Speaker & Date</h4>
                <p>Who actually said it, and when was it recorded?</p>
              </div>
            </div>
            <div class="check-item">
              <div class="check-num">02</div>
              <div class="check-content">
                <h4>Surrounding Text</h4>
                <p>What came immediately before and after the quote?</p>
              </div>
            </div>
            <div class="check-item">
              <div class="check-num">03</div>
              <div class="check-content">
                <h4>Format Audit</h4>
                <p>Is this verbatim audio, a translation, or a caption?</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SCENE 5 (35.0s - 46.5s): Ethical Principle Split -->
    <section class="scene-viewport" id="scene-5" data-layout-allow-overlap="true">
      <div class="plate-container">
        <img class="plate-img" id="plate-5" src="assets/images/scene_4_desk.jpg" alt="Legal principle on desk">
      </div>
      <div class="scene-content">
        <div class="tactical-card" id="card-ethics">
          <div style="font-size: 28px; font-weight: 800; margin-bottom: 16px;">
            Individual Action ≠ Collective Blame
          </div>
          <div class="split-grid">
            <div class="split-card split-card-ok">
              <div style="font-family: var(--font-mono); font-size: 16px; font-weight: 800; color: var(--teal-accent);">ACCOUNTABILITY</div>
              <div style="font-size: 20px; font-weight: 700; line-height: 1.3;">Hold the individual speaker strictly accountable for their words.</div>
            </div>
            <div class="split-card split-card-bad">
              <div style="font-family: var(--font-mono); font-size: 16px; font-weight: 800; color: var(--rust-accent);">SCAPEGOATING</div>
              <div style="font-size: 20px; font-weight: 700; line-height: 1.3;">An entire community is never responsible for one person's actions.</div>
            </div>
          </div>
          <div class="stamp-equity">★ CORE LEGAL & ETHICAL STANDARD ★</div>
        </div>
      </div>
    </section>

    <!-- SCENE 6 (46.5s - 54.5s): Context is Truth -->
    <section class="scene-viewport" id="scene-6" data-layout-allow-overlap="true">
      <div class="plate-container">
        <img class="plate-img" id="plate-6" src="assets/images/scene_4_desk.jpg" alt="Investigative desk glowing">
      </div>
      <div class="scene-content">
        <div class="tactical-card card-dark" id="card-context-truth">
          <div style="font-family: var(--font-mono); font-size: 16px; font-weight: 800; color: var(--gold-bright); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 12px;">
            INVESTIGATIVE VERDICT
          </div>
          <div style="font-size: 34px; font-weight: 900; line-height: 1.3; color: #FFFFFF;">
            Context isn't an excuse. It's how you uncover who actually did what.
          </div>
        </div>
      </div>
    </section>

    <!-- SCENE 7 (54.5s - 60.0s): Closing Lockup -->
    <section class="scene-viewport" id="scene-7" data-layout-allow-overlap="true">
      <div class="plate-container">
        <img class="plate-img" id="plate-7" src="assets/images/scene_4_desk.jpg" alt="Closing desk">
      </div>
      <div class="scene-content" style="justify-content: center;">
        <div class="tactical-card card-dark" id="card-closing" style="text-align: center; border-color: var(--gold-bright);">
          <div style="font-family: var(--font-mono); font-size: 16px; font-weight: 800; color: var(--gold-bright); letter-spacing: 2px; text-transform: uppercase;">
            BEYOND THE MYTH · CORE RULE
          </div>
          <div style="font-size: 44px; font-weight: 900; line-height: 1.25; margin: 18px 0; color: #FFFFFF;">
            Zoom out before you call it proof.
          </div>
          <div style="font-family: var(--font-mono); font-size: 16px; color: rgba(255, 255, 255, 0.7); letter-spacing: 1.5px;">
            FACTS · PRIMARY SOURCES · LATERAL READING
          </div>
        </div>
      </div>
    </section>

    <!-- Subtitles persistent card -->
    <div class="subtitles-container" data-layout-allow-overlap="true">
      <div class="subtitles-card">
        <p class="subtitles-text" id="subtitles-display">A screenshot can be real—and still mislead you.</p>
      </div>
      <div class="source-tag">
        <span class="source-bullet"></span>
        <span id="source-display">DIGITAL INQUIRY GROUP (COR.INQUIRYGROUP.ORG)</span>
      </div>
    </div>
  </div>

  <script>
    const cues = [
      {
        start: 0.0, end: 4.0,
        eyebrow: "VERIFY BEFORE REPOSTING", icon: "✦",
        subtitle: 'A screenshot can be <span class="hl-gold">real</span>—and still mislead you.',
        source: "DIGITAL INQUIRY GROUP (COR.INQUIRYGROUP.ORG)"
      },
      {
        start: 4.0, end: 12.5,
        eyebrow: "DEMONSTRATION · CROPPED QUOTE", icon: "🔍",
        subtitle: 'Try this made-up example. Crop a sentence after <span class="hl-coral">"I agree,"</span> and hide the part that says <span class="hl-teal">"with neither claim."</span>',
        source: "LATERAL READING (HARVARD MISINFO REVIEW)"
      },
      {
        start: 12.5, end: 23.5,
        eyebrow: "EVIDENCE vs SCAPEGOATING", icon: "⚖",
        subtitle: 'Same words. Different meaning. Now imagine a post accusing Jewish people of something, using <span class="hl-coral">one cropped quote</span> as the whole argument.',
        source: "STANFORD CIVIC ONLINE REASONING"
      },
      {
        start: 23.5, end: 35.0,
        eyebrow: "4-STEP PRIMARY SOURCE CHECK", icon: "📄",
        subtitle: 'Before sharing it, open the original. <span class="hl-gold">Who said it?</span> When? What came before and after? Quote, translation, or caption?',
        source: "PRIMARY SOURCE VERIFICATION PROTOCOLS"
      },
      {
        start: 35.0, end: 46.5,
        eyebrow: "INDIVIDUAL vs COLLECTIVE", icon: "⚖",
        subtitle: 'Then check an independent source. And even if one person really said something awful, that does <span class="hl-coral">not</span> make an entire community responsible.',
        source: "UNIVERSAL DECLARATION OF HUMAN RIGHTS"
      },
      {
        start: 46.5, end: 54.5,
        eyebrow: "ACCURACY & ACCOUNTABILITY", icon: "✦",
        subtitle: '<span class="hl-gold">Context isn\\'t an excuse.</span> It\\'s how you figure out what actually happened, and who actually did it.',
        source: "DIGITAL INQUIRY GROUP"
      },
      {
        start: 54.5, end: 60.0,
        eyebrow: "BEYOND THE MYTH", icon: "✦",
        subtitle: '<span class="hl-gold">Zoom out before you call it proof.</span>',
        source: "BEYOND THE MYTH · FACTS, NOT SCAPEGOATS"
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

    // SCENE 1 (0.0s - 4.0s)
    tl.set("#scene-1", { display: "block", opacity: 1 }, 0.0);
    tl.call(() => updateCue(0), null, 0.0);
    tl.fromTo("#plate-1", { scale: 1.0 }, { scale: 1.06, duration: 4.0, ease: "none" }, 0.0);
    tl.fromTo("#hud-scanner-1", { scale: 0.85, opacity: 0 }, { scale: 1.0, opacity: 1, duration: 0.6, ease: "back.out(1.5)" }, 0.2);
    tl.to("#scene-1", { opacity: 0, duration: 0.35 }, 3.65);
    tl.set("#scene-1", { display: "none" }, 4.0);

    // SCENE 2 (4.0s - 12.5s)
    tl.set("#scene-2", { display: "block", opacity: 0 }, 4.0);
    tl.to("#scene-2", { opacity: 1, duration: 0.35 }, 4.0);
    tl.call(() => updateCue(1), null, 4.0);
    tl.fromTo("#plate-2", { scale: 1.0 }, { scale: 1.07, duration: 8.5, ease: "none" }, 4.0);
    tl.fromTo("#card-crop-demo", { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }, 4.3);
    tl.fromTo("#quote-part-1", { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5 }, 5.0);
    tl.fromTo("#quote-part-2", { x: 30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5 }, 7.5);
    tl.to("#scene-2", { opacity: 0, duration: 0.35 }, 12.15);
    tl.set("#scene-2", { display: "none" }, 12.5);

    // SCENE 3 (12.5s - 23.5s)
    tl.set("#scene-3", { display: "block", opacity: 0 }, 12.5);
    tl.to("#scene-3", { opacity: 1, duration: 0.35 }, 12.5);
    tl.call(() => updateCue(2), null, 12.5);
    tl.fromTo("#plate-3", { scale: 1.0 }, { scale: 1.07, duration: 11.0, ease: "none" }, 12.5);
    tl.fromTo("#card-accuse-check", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }, 12.8);
    tl.to("#scene-3", { opacity: 0, duration: 0.35 }, 23.15);
    tl.set("#scene-3", { display: "none" }, 23.5);

    // SCENE 4 (23.5s - 35.0s)
    tl.set("#scene-4", { display: "block", opacity: 0 }, 23.5);
    tl.to("#scene-4", { opacity: 1, duration: 0.35 }, 23.5);
    tl.call(() => updateCue(3), null, 23.5);
    tl.fromTo("#plate-4", { scale: 1.0 }, { scale: 1.07, duration: 11.5, ease: "none" }, 23.5);
    tl.fromTo("#card-checklist", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }, 23.8);
    tl.to("#scene-4", { opacity: 0, duration: 0.35 }, 34.65);
    tl.set("#scene-4", { display: "none" }, 35.0);

    // SCENE 5 (35.0s - 46.5s)
    tl.set("#scene-5", { display: "block", opacity: 0 }, 35.0);
    tl.to("#scene-5", { opacity: 1, duration: 0.35 }, 35.0);
    tl.call(() => updateCue(4), null, 35.0);
    tl.fromTo("#plate-5", { scale: 1.0 }, { scale: 1.07, duration: 11.5, ease: "none" }, 35.0);
    tl.fromTo("#card-ethics", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }, 35.3);
    tl.to("#scene-5", { opacity: 0, duration: 0.35 }, 46.15);
    tl.set("#scene-5", { display: "none" }, 46.5);

    // SCENE 6 (46.5s - 54.5s)
    tl.set("#scene-6", { display: "block", opacity: 0 }, 46.5);
    tl.to("#scene-6", { opacity: 1, duration: 0.35 }, 46.5);
    tl.call(() => updateCue(5), null, 46.5);
    tl.fromTo("#plate-6", { scale: 1.0 }, { scale: 1.06, duration: 8.0, ease: "none" }, 46.5);
    tl.fromTo("#card-context-truth", { scale: 0.9, opacity: 0 }, { scale: 1.0, opacity: 1, duration: 0.6, ease: "back.out(1.4)" }, 46.8);
    tl.to("#scene-6", { opacity: 0, duration: 0.35 }, 54.15);
    tl.set("#scene-6", { display: "none" }, 54.5);

    // SCENE 7 (54.5s - 60.0s)
    tl.set("#scene-7", { display: "block", opacity: 0 }, 54.5);
    tl.to("#scene-7", { opacity: 1, duration: 0.35 }, 54.5);
    tl.call(() => updateCue(6), null, 54.5);
    tl.fromTo("#plate-7", { scale: 1.0 }, { scale: 1.05, duration: 5.5, ease: "none" }, 54.5);
    tl.fromTo("#card-closing", { scale: 0.9, opacity: 0 }, { scale: 1.0, opacity: 1, duration: 0.6, ease: "back.out(1.4)" }, 54.8);
    tl.to("#root", { x: -1080, duration: 0.8, ease: "power2.in" }, 59.2);
  </script>
</body>
</html>
`;

fs.writeFileSync(targetHtml, htmlContent, 'utf8');
console.log('[OK] Wrote Cinematic Ep02 index.html');

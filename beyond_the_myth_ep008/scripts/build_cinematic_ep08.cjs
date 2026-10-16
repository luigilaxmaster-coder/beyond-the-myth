const fs = require('fs');
const path = require('path');

const targetHtml = path.join(__dirname, '..', 'index.html');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=1080, height=1920, initial-scale=1.0">
  <title>Beyond The Myth · Ep. 008: The Catholic Church & Nostra Aetate</title>
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

    .quote-box {
      background: rgba(255, 255, 255, 0.08);
      border-radius: 20px;
      padding: 24px;
      margin-bottom: 16px;
      border: 1.5px solid rgba(255, 255, 255, 0.15);
      font-style: italic;
      line-height: 1.4;
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
        <span class="brand-tagline">EPISODE 008 · VATICAN II ARCHIVES</span>
      </div>
    </header>

    <div class="scene-eyebrow" data-layout-allow-overlap="true">
      <div class="eyebrow-chip">
        <span class="eyebrow-icon" id="eyebrow-icon">📜</span>
        <span class="eyebrow-text" id="eyebrow-text">HISTORICAL RECKONING</span>
      </div>
    </div>

    <!-- SCENE 1 (0.0s - 4.4s): Hook: The Church Rejection -->
    <section class="scene-viewport" id="scene-1" data-layout-allow-overlap="true">
      <div class="plate-container">
        <img class="plate-img" id="plate-1" src="assets/images/scene_1_vatican_council.jpg" alt="Second Vatican Council in St. Peter's">
      </div>
      <div class="scene-content" style="justify-content: center;">
        <div class="tactical-card card-dark" id="card-hook" style="text-align: center; border-color: var(--gold-bright);">
          <div style="font-family: var(--font-mono); font-size: 16px; font-weight: 800; color: var(--gold-bright); letter-spacing: 2px; text-transform: uppercase;">
            OFFICIAL CHURCH DOCTRINE
          </div>
          <div style="font-size: 42px; font-weight: 900; line-height: 1.25; margin: 20px 0; color: #FFFFFF;">
            The Catholic Church rejects blaming all Jews for Jesus’s death.
          </div>
          <div style="font-family: var(--font-mono); font-size: 18px; font-weight: 700; color: #58E2D0; letter-spacing: 1.5px;">
            VATICAN II COUNCIL · FORMAL REPUDIATION
          </div>
        </div>
      </div>
    </section>

    <!-- SCENE 2 (4.4s - 14.8s): Nostra Aetate (1965) -->
    <section class="scene-viewport" id="scene-2" data-layout-allow-overlap="true">
      <div class="plate-container">
        <img class="plate-img" id="plate-2" src="assets/images/scene_4_vatican_archives.jpg" alt="Codex Vaticanus Conciliar Folio">
      </div>
      <div class="scene-content">
        <div class="tactical-card card-dark" id="card-doc">
          <div style="font-family: var(--font-mono); font-size: 16px; font-weight: 800; color: var(--gold-bright); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 12px;">
            OFFICIAL PAPAL DECLARATION · 1965
          </div>
          <div style="font-size: 34px; font-weight: 900; line-height: 1.25; margin-bottom: 22px;">
            <em>Nostra Aetate</em> ("In Our Time")
          </div>

          <div style="background: rgba(255, 255, 255, 0.08); border-radius: 18px; padding: 22px; margin-bottom: 16px; border: 1.5px solid rgba(255,255,255,0.15);">
            <div style="font-size: 20px; font-weight: 800; color: #58E2D0; margin-bottom: 6px;">
              Promulgated: October 28, 1965
            </div>
            <div style="font-size: 18px; color: rgba(255,255,255,0.85); line-height: 1.4;">
              Issued by Pope Paul VI following the historic Second Vatican Council.
            </div>
          </div>

          <div style="background: rgba(255, 255, 255, 0.08); border-radius: 18px; padding: 22px; border: 1.5px solid rgba(255,255,255,0.15);">
            <div style="font-size: 20px; font-weight: 800; color: #FFD452; margin-bottom: 6px;">
              Section 4: Direct Repudiation
            </div>
            <div style="font-size: 18px; color: rgba(255,255,255,0.85); line-height: 1.4;">
              Directly tackled centuries of collective guilt charges instead of leaving doctrine to rumor or prejudice.
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SCENE 3 (14.8s - 24.8s): The Explicit Text -->
    <section class="scene-viewport" id="scene-3" data-layout-allow-overlap="true">
      <div class="plate-container">
        <img class="plate-img" id="plate-3" src="assets/images/scene_1_vatican_council.jpg" alt="Vatican II Council Assembly">
      </div>
      <div class="scene-content">
        <div class="tactical-card" id="card-text" style="background: #FFF9F5; color: #1A1722;">
          <div style="font-family: var(--font-mono); font-size: 16px; font-weight: 800; color: var(--teal-accent); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 12px;">
            THE OFFICIAL PAPAL TEXT
          </div>
          <div style="font-size: 32px; font-weight: 900; line-height: 1.25; margin-bottom: 18px;">
            What the declaration explicitly states:
          </div>

          <div style="background: #F4EBE2; border-left: 6px solid var(--teal-accent); padding: 18px 22px; border-radius: 0 16px 16px 0; margin-bottom: 16px; font-style: italic;">
            <div style="font-size: 18px; color: #332B3E; font-weight: 600; line-height: 1.35;">
              "True, the Jewish authorities and those who followed their lead pressed for the death of Christ; still, what happened in His passion cannot be charged against all the Jews, without distinction, then alive, nor against the Jews of today."
            </div>
          </div>

          <div style="font-size: 18px; color: #B3261E; font-weight: 800;">
            ★ "Furthermore, the Church decries hatred, persecutions, displays of anti-Semitism, directed against Jews at any time and by anyone."
          </div>
        </div>
      </div>
    </section>

    <!-- SCENE 4 (24.8s - 35.8s): Historical Reckoning -->
    <section class="scene-viewport" id="scene-4" data-layout-allow-overlap="true">
      <div class="plate-container">
        <img class="plate-img" id="plate-4" src="assets/images/scene_2_stpeters_interior.jpg" alt="St. Peter's Basilica Interior Baldacchino">
      </div>
      <div class="scene-content">
        <div class="tactical-card card-dark" id="card-reckoning">
          <div style="font-family: var(--font-mono); font-size: 16px; font-weight: 800; color: #FF8A80; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 12px;">
            HONEST HISTORICAL RECORD
          </div>
          <div style="font-size: 34px; font-weight: 900; line-height: 1.25; margin-bottom: 22px;">
            A declaration does not erase history, but defines doctrine.
          </div>

          <div style="background: rgba(255,255,255,0.08); border-radius: 18px; padding: 22px; margin-bottom: 16px; border: 1.5px solid rgba(255,255,255,0.15);">
            <div style="font-size: 20px; font-weight: 800; color: #FF8A80; margin-bottom: 6px;">
              Centuries of Harm
            </div>
            <div style="font-size: 18px; color: rgba(255,255,255,0.85); line-height: 1.4;">
              The deicide libel caused centuries of pogroms, expulsions, and persecution across Europe.
            </div>
          </div>

          <div style="padding: 14px 20px; background: rgba(245, 197, 66, 0.15); border: 1.5px solid var(--gold-bright); border-radius: 16px; font-size: 18px; color: #FFD452; font-weight: 700; text-align: center;">
            No one can truthfully present collective blame as Catholic doctrine today.
          </div>
        </div>
      </div>
    </section>

    <!-- SCENE 5 (35.8s - 47.2s): Theology vs Collective Blame -->
    <section class="scene-viewport" id="scene-5" data-layout-allow-overlap="true">
      <div class="plate-container">
        <img class="plate-img" id="plate-5" src="assets/images/scene_3_pope_paul_vi.jpg" alt="Pope Paul VI Conciliar Promulgation">
      </div>
      <div class="scene-content">
        <div class="tactical-card card-dark" id="card-theology">
          <div style="font-family: var(--font-mono); font-size: 16px; font-weight: 800; color: #58E2D0; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 12px;">
            THEOLOGY vs. DISCRIMINATION
          </div>
          <div style="font-size: 34px; font-weight: 900; line-height: 1.25; margin-bottom: 22px;">
            Religious debate is not collective guilt.
          </div>

          <div style="background: rgba(255,255,255,0.08); border-radius: 18px; padding: 22px; margin-bottom: 16px; border: 1.5px solid rgba(255,255,255,0.15);">
            <div style="font-size: 20px; font-weight: 800; color: #58E2D0; margin-bottom: 6px;">
              Theological Discussion
            </div>
            <div style="font-size: 18px; color: rgba(255,255,255,0.85); line-height: 1.4;">
              Scholars and believers can discuss sacred texts, history, and differing religious beliefs openly and respectfully.
            </div>
          </div>

          <div style="background: rgba(255,255,255,0.08); border-radius: 18px; padding: 22px; border: 1.5px solid rgba(255,255,255,0.15);">
            <div style="font-size: 20px; font-weight: 800; color: #FF8A80; margin-bottom: 6px;">
              Collective Scapegoating
            </div>
            <div style="font-size: 18px; color: rgba(255,255,255,0.85); line-height: 1.4;">
              Assigning generational guilt to people born millennia later is prejudice, not religion.
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SCENE 6 (47.2s - 54.8s): Primary Sources -->
    <section class="scene-viewport" id="scene-6" data-layout-allow-overlap="true">
      <div class="plate-container">
        <img class="plate-img" id="plate-6" src="assets/images/scene_4_vatican_archives.jpg" alt="Primary Vatican Archives Folio">
      </div>
      <div class="scene-content">
        <div class="tactical-card card-dark" id="card-sources">
          <div style="font-family: var(--font-mono); font-size: 16px; font-weight: 800; color: var(--gold-bright); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 12px;">
            MEDIA LITERACY PRINCIPLE
          </div>
          <div style="font-size: 36px; font-weight: 900; line-height: 1.25; margin-bottom: 22px;">
            Check the actual document.
          </div>

          <div style="background: rgba(255,255,255,0.08); border-radius: 18px; padding: 22px; margin-bottom: 16px; border: 1.5px solid rgba(255,255,255,0.15);">
            <div style="font-size: 18px; color: rgba(255,255,255,0.85); line-height: 1.4;">
              Don’t rely on anonymous social media comments claiming to speak for an entire faith or billion-member church.
            </div>
          </div>

          <div style="padding: 14px 20px; background: rgba(88, 226, 208, 0.15); border: 1.5px solid #58E2D0; border-radius: 16px; font-size: 18px; color: #58E2D0; font-weight: 700; text-align: center;">
            Read the text for yourself at vatican.va.
          </div>
        </div>
      </div>
    </section>

    <!-- SCENE 7 (54.8s - 60.0s): Closing Lockup -->
    <section class="scene-viewport" id="scene-7" data-layout-allow-overlap="true">
      <div class="plate-container">
        <img class="plate-img" id="plate-7" src="assets/images/scene_2_stpeters_interior.jpg" alt="St. Peter's Basilica Closing Lockup">
      </div>
      <div class="scene-content" style="justify-content: center;">
        <div class="tactical-card card-dark" id="card-closing" style="text-align: center; border-color: var(--gold-bright);">
          <div style="font-family: var(--font-mono); font-size: 16px; font-weight: 800; color: var(--gold-bright); letter-spacing: 2px; text-transform: uppercase;">
            BEYOND THE MYTH · CORE PRINCIPLE
          </div>
          <div style="font-size: 44px; font-weight: 900; line-height: 1.25; margin: 20px 0; color: #FFFFFF;">
            You don’t inherit guilt from a stranger’s history.
          </div>
          <div style="font-family: var(--font-mono); font-size: 17px; color: rgba(255, 255, 255, 0.8); letter-spacing: 1.5px;">
            NOSTRA AETATE (1965) · VATICAN II · BEYOND THE MYTH
          </div>
        </div>
      </div>
    </section>

    <!-- Subtitles persistent card -->
    <div class="subtitles-container" data-layout-allow-overlap="true">
      <div class="subtitles-card">
        <p class="subtitles-text" id="subtitles-display">The Catholic Church rejects blaming all Jews for Jesus’s death.</p>
      </div>
      <div class="source-tag">
        <span class="source-bullet"></span>
        <span id="source-display">VATICAN II COUNCIL · NOSTRA AETATE (1965)</span>
      </div>
    </div>
  </div>

  <script>
    const cues = [
      {
        start: 0.0, end: 4.4,
        eyebrow: "THEOLOGICAL DECLARATION", icon: "🏛",
        subtitle: 'The Catholic Church <span class="hl-gold">rejects blaming all Jews</span> for Jesus’s death.',
        source: "VATICAN II COUNCIL · NOSTRA AETATE (1965)"
      },
      {
        start: 4.4, end: 14.8,
        eyebrow: "NOSTRA AETATE · SECTION 4", icon: "📜",
        subtitle: 'Official Vatican II document: <span class="hl-teal">Nostra aetate (1965).</span> Section 4 directly repudiates collective guilt.',
        source: "VATICAN SECRET ARCHIVES / VATICAN.VA"
      },
      {
        start: 14.8, end: 24.8,
        eyebrow: "EXPLICIT CONDEMNATION", icon: "⚖",
        subtitle: 'Cannot be charged to Jewish people then, <span class="hl-gold">or to Jewish people today.</span> It explicitly condemns antisemitism.',
        source: "NOSTRA AETATE, PROMULGATED BY POPE PAUL VI"
      },
      {
        start: 24.8, end: 35.8,
        eyebrow: "RECKONING WITH HISTORY", icon: "📑",
        subtitle: 'That doesn’t erase historical harm. But it matters when someone claims <span class="hl-coral">collective blame is Catholic teaching.</span>',
        source: "HISTORICAL & THEOLOGICAL SCHOLARSHIP"
      },
      {
        start: 35.8, end: 47.2,
        eyebrow: "THEOLOGY vs. GUILT ASSIGNMENT", icon: "🕊",
        subtitle: 'Discussing theology is different from <span class="hl-coral">making people guilty</span> because they belong to a community generations later.',
        source: "INTERFAITH ETHICS & HUMAN RIGHTS"
      },
      {
        start: 47.2, end: 54.8,
        eyebrow: "PRIMARY SOURCE DIRECTIVE", icon: "🔍",
        subtitle: 'Check what the <span class="hl-teal">official document actually says,</span> not an anonymous comment claiming to speak for an entire faith.',
        source: "PRIMARY SOURCE VERIFICATION"
      },
      {
        start: 54.8, end: 60.0,
        eyebrow: "BEYOND THE MYTH", icon: "✦",
        subtitle: '<span class="hl-gold">You don’t inherit guilt from a stranger’s history.</span>',
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

    // SCENE 1 (0.0s - 4.4s)
    tl.set("#scene-1", { display: "block", opacity: 1 }, 0.0);
    tl.call(() => updateCue(0), null, 0.0);
    tl.fromTo("#plate-1", { scale: 1.0 }, { scale: 1.06, duration: 4.4, ease: "none" }, 0.0);
    tl.fromTo("#card-hook", { scale: 0.9, opacity: 0 }, { scale: 1.0, opacity: 1, duration: 0.6, ease: "back.out(1.4)" }, 0.2);
    tl.to("#scene-1", { opacity: 0, duration: 0.35 }, 4.05);
    tl.set("#scene-1", { display: "none" }, 4.4);

    // SCENE 2 (4.4s - 14.8s)
    tl.set("#scene-2", { display: "block", opacity: 0 }, 4.4);
    tl.to("#scene-2", { opacity: 1, duration: 0.35 }, 4.4);
    tl.call(() => updateCue(1), null, 4.4);
    tl.fromTo("#plate-2", { scale: 1.0 }, { scale: 1.08, duration: 10.4, ease: "none" }, 4.4);
    tl.fromTo("#card-doc", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }, 4.7);
    tl.to("#scene-2", { opacity: 0, duration: 0.35 }, 14.45);
    tl.set("#scene-2", { display: "none" }, 14.8);

    // SCENE 3 (14.8s - 24.8s)
    tl.set("#scene-3", { display: "block", opacity: 0 }, 14.8);
    tl.to("#scene-3", { opacity: 1, duration: 0.35 }, 14.8);
    tl.call(() => updateCue(2), null, 14.8);
    tl.fromTo("#plate-3", { scale: 1.0 }, { scale: 1.08, duration: 10.0, ease: "none" }, 14.8);
    tl.fromTo("#card-text", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }, 15.1);
    tl.to("#scene-3", { opacity: 0, duration: 0.35 }, 24.45);
    tl.set("#scene-3", { display: "none" }, 24.8);

    // SCENE 4 (24.8s - 35.8s)
    tl.set("#scene-4", { display: "block", opacity: 0 }, 24.8);
    tl.to("#scene-4", { opacity: 1, duration: 0.35 }, 24.8);
    tl.call(() => updateCue(3), null, 24.8);
    tl.fromTo("#plate-4", { scale: 1.0 }, { scale: 1.08, duration: 11.0, ease: "none" }, 24.8);
    tl.fromTo("#card-reckoning", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }, 25.1);
    tl.to("#scene-4", { opacity: 0, duration: 0.35 }, 35.45);
    tl.set("#scene-4", { display: "none" }, 35.8);

    // SCENE 5 (35.8s - 47.2s)
    tl.set("#scene-5", { display: "block", opacity: 0 }, 35.8);
    tl.to("#scene-5", { opacity: 1, duration: 0.35 }, 35.8);
    tl.call(() => updateCue(4), null, 35.8);
    tl.fromTo("#plate-5", { scale: 1.0 }, { scale: 1.08, duration: 11.4, ease: "none" }, 35.8);
    tl.fromTo("#card-theology", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }, 36.1);
    tl.to("#scene-5", { opacity: 0, duration: 0.35 }, 46.85);
    tl.set("#scene-5", { display: "none" }, 47.2);

    // SCENE 6 (47.2s - 54.8s)
    tl.set("#scene-6", { display: "block", opacity: 0 }, 47.2);
    tl.to("#scene-6", { opacity: 1, duration: 0.35 }, 47.2);
    tl.call(() => updateCue(5), null, 47.2);
    tl.fromTo("#plate-6", { scale: 1.0 }, { scale: 1.07, duration: 7.6, ease: "none" }, 47.2);
    tl.fromTo("#card-sources", { scale: 0.9, opacity: 0 }, { scale: 1.0, opacity: 1, duration: 0.6, ease: "back.out(1.4)" }, 47.5);
    tl.to("#scene-6", { opacity: 0, duration: 0.35 }, 54.45);
    tl.set("#scene-6", { display: "none" }, 54.8);

    // SCENE 7 (54.8s - 60.0s)
    tl.set("#scene-7", { display: "block", opacity: 0 }, 54.8);
    tl.to("#scene-7", { opacity: 1, duration: 0.35 }, 54.8);
    tl.call(() => updateCue(6), null, 54.8);
    tl.fromTo("#plate-7", { scale: 1.0 }, { scale: 1.05, duration: 5.2, ease: "none" }, 54.8);
    tl.fromTo("#card-closing", { scale: 0.9, opacity: 0 }, { scale: 1.0, opacity: 1, duration: 0.6, ease: "back.out(1.4)" }, 55.1);
    tl.to("#root", { x: -1080, duration: 0.8, ease: "power2.in" }, 59.2);
  </script>
</body>
</html>
`;

fs.writeFileSync(targetHtml, htmlContent, 'utf8');
console.log('[OK] Wrote Cinematic Ep08 index.html');

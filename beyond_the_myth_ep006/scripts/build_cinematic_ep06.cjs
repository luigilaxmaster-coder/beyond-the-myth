const fs = require('fs');
const path = require('path');

const targetHtml = path.join(__dirname, '..', 'index.html');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=1080, height=1920, initial-scale=1.0">
  <title>Beyond The Myth · Ep. 006: The Protocols Forgery Plagiarism</title>
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

    .forgery-stamp {
      display: inline-block;
      border: 4px solid #FF8A80;
      color: #FF8A80;
      background: rgba(179, 38, 30, 0.35);
      padding: 10px 24px;
      border-radius: 12px;
      font-family: var(--font-mono);
      font-size: 26px;
      font-weight: 900;
      letter-spacing: 3px;
      text-transform: uppercase;
      transform: rotate(-4deg);
      box-shadow: 4px 4px 0 rgba(0,0,0,0.8);
    }

    .plagiarism-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-top: 16px;
    }

    .plagiarism-col {
      background: rgba(255, 255, 255, 0.08);
      border-radius: 18px;
      padding: 20px;
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
        <span class="brand-tagline">EPISODE 006 · HISTORICAL FORENSICS</span>
      </div>
    </header>

    <div class="scene-eyebrow" data-layout-allow-overlap="true">
      <div class="eyebrow-chip">
        <span class="eyebrow-icon" id="eyebrow-icon">📜</span>
        <span class="eyebrow-text" id="eyebrow-text">FORENSIC HOAX INVESTIGATION</span>
      </div>
    </div>

    <!-- SCENE 1 (0.0s - 4.9s): Hook: The Manuscript Forgery -->
    <section class="scene-viewport" id="scene-1" data-layout-allow-overlap="true">
      <div class="plate-container">
        <img class="plate-img" id="plate-1" src="assets/images/scene_1_nilus_protocols.jpg" alt="1912 Russian Protocols Cover">
      </div>
      <div class="scene-content" style="justify-content: center;">
        <div class="tactical-card card-dark" id="card-hook" style="text-align: center; border-color: var(--rust-accent);">
          <div class="forgery-stamp" style="margin-bottom: 24px;">
            FABRICATED HOAX
          </div>
          <div style="font-size: 42px; font-weight: 900; line-height: 1.25; margin-bottom: 16px; color: #FFFFFF;">
            The supposed "secret document" was fake.
          </div>
          <div style="font-family: var(--font-mono); font-size: 24px; font-weight: 700; color: #FF8A80; letter-spacing: 1px;">
            And large portions were word-for-word plagiarized.
          </div>
        </div>
      </div>
    </section>

    <!-- SCENE 2 (4.9s - 12.8s): Origin: 1903 Russia Okhrana -->
    <section class="scene-viewport" id="scene-2" data-layout-allow-overlap="true">
      <div class="plate-container">
        <img class="plate-img" id="plate-2" src="assets/images/scene_1_nilus_protocols.jpg" alt="Historical Tsarist Forgery Book">
      </div>
      <div class="scene-content">
        <div class="tactical-card card-dark" id="card-origin">
          <div style="font-family: var(--font-mono); font-size: 16px; font-weight: 800; color: var(--gold-bright); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 12px;">
            HISTORICAL DOSSIER · ORIGIN OF THE HOAX
          </div>
          <div style="font-size: 34px; font-weight: 900; line-height: 1.25; margin-bottom: 20px;">
            "The Protocols of the Elders of Zion"
          </div>

          <div style="background: rgba(255, 255, 255, 0.08); border-radius: 18px; padding: 22px; margin-bottom: 16px; border: 1.5px solid rgba(255,255,255,0.15);">
            <div style="font-size: 20px; font-weight: 800; color: #FFD452; margin-bottom: 6px;">
              Published: St. Petersburg, 1903
            </div>
            <div style="font-size: 18px; color: rgba(255,255,255,0.85); line-height: 1.4;">
              Commissioned by the Tsarist secret police (Okhrana) to scapegoat Jews for political unrest in Imperial Russia.
            </div>
          </div>

          <div style="background: rgba(255, 255, 255, 0.08); border-radius: 18px; padding: 22px; border: 1.5px solid rgba(255,255,255,0.15);">
            <div style="font-size: 20px; font-weight: 800; color: #FF8A80; margin-bottom: 6px;">
              The Claimed Pretense
            </div>
            <div style="font-size: 18px; color: rgba(255,255,255,0.85); line-height: 1.4;">
              Pretended to be verbatim meeting minutes of secret Jewish leaders. No such meeting ever occurred.
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SCENE 3 (12.8s - 23.5s): Forensic Text Plagiarism -->
    <section class="scene-viewport" id="scene-3" data-layout-allow-overlap="true">
      <div class="plate-container">
        <img class="plate-img" id="plate-3" src="assets/images/scene_2_maurice_joly.jpg" alt="Maurice Joly 1864 French Satire">
      </div>
      <div class="scene-content">
        <div class="tactical-card card-dark" id="card-plagiarism">
          <div style="font-family: var(--font-mono); font-size: 16px; font-weight: 800; color: var(--gold-bright); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 10px;">
            TEXT FORENSICS · DIRECT PLAGIARISM
          </div>
          <div style="font-size: 32px; font-weight: 900; line-height: 1.25; margin-bottom: 16px;">
            Lifted directly from an 1864 French satire:
          </div>

          <div class="plagiarism-grid">
            <div class="plagiarism-col" style="border-left: 5px solid #58E2D0;">
              <div style="font-family: var(--font-mono); font-size: 15px; font-weight: 800; color: #58E2D0; margin-bottom: 6px;">
                ORIGINAL (1864)
              </div>
              <div style="font-weight: 700; font-size: 17px; margin-bottom: 4px;">Maurice Joly</div>
              <div style="font-size: 15px; color: rgba(255,255,255,0.8); line-height: 1.35;">
                Political satire attacking Napoleon III. Contained ZERO mention of Jewish people.
              </div>
            </div>

            <div class="plagiarism-col" style="border-left: 5px solid var(--rust-accent);">
              <div style="font-family: var(--font-mono); font-size: 15px; font-weight: 800; color: #FF8A80; margin-bottom: 6px;">
                FORGERY (1903)
              </div>
              <div style="font-weight: 700; font-size: 17px; margin-bottom: 4px;">The Protocols</div>
              <div style="font-size: 15px; color: rgba(255,255,255,0.8); line-height: 1.35;">
                Copied Joly’s arguments verbatim, replacing characters with "the Elders."
              </div>
            </div>
          </div>

          <div style="margin-top: 20px; padding: 14px 20px; background: rgba(232, 168, 37, 0.15); border: 1.5px solid var(--gold-bright); border-radius: 16px; font-family: var(--font-mono); font-size: 16px; color: #FFD452; text-align: center;">
            ★ PARALLEL ANALYSIS: OVER 40% TEXTUAL OVERLAP ★
          </div>
        </div>
      </div>
    </section>

    <!-- SCENE 4 (23.5s - 35.5s): The Times of London 1921 Exposé -->
    <section class="scene-viewport" id="scene-4" data-layout-allow-overlap="true">
      <div class="plate-container">
        <img class="plate-img" id="plate-4" src="assets/images/scene_3_parallel_forgery.jpg" alt="Side by side proof of forgery">
      </div>
      <div class="scene-content">
        <div class="tactical-card" id="card-times" style="background: #FFF9F5; color: #1A1722;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <div style="font-family: var(--font-mono); font-size: 16px; font-weight: 800; color: var(--teal-accent); letter-spacing: 2px;">
              INVESTIGATIVE BREAKTHROUGH
            </div>
            <div style="background: #1A1722; color: #FFF; font-family: var(--font-mono); font-size: 14px; font-weight: 700; padding: 4px 12px; border-radius: 8px;">
              AUG 1921
            </div>
          </div>

          <div style="font-size: 36px; font-weight: 900; line-height: 1.25; margin-bottom: 18px;">
            The Times of London exposes the plagiarism.
          </div>

          <div style="background: #F4EBE2; border-left: 6px solid var(--teal-accent); padding: 18px 22px; border-radius: 0 16px 16px 0; margin-bottom: 16px;">
            <div style="font-weight: 800; font-size: 20px; color: var(--teal-accent); margin-bottom: 6px;">Philip Graves' Investigation:</div>
            <div style="font-size: 18px; color: #332B3E; font-weight: 600; line-height: 1.35;">
              Showed side-by-side columns proving direct literary theft from Joly's book.
            </div>
          </div>

          <div style="font-size: 17px; color: #554D63; line-height: 1.4;">
            Documented today by the <strong>United States Holocaust Memorial Museum</strong> (ushmm.org) as one of the most destructive political hoaxes in history.
          </div>
        </div>
      </div>
    </section>

    <!-- SCENE 5 (35.5s - 46.8s): Fabricated Insider Theatre -->
    <section class="scene-viewport" id="scene-5" data-layout-allow-overlap="true">
      <div class="plate-container">
        <img class="plate-img" id="plate-5" src="assets/images/scene_4_times.jpg" alt="The Times 1921 Exposé">
      </div>
      <div class="scene-content">
        <div class="tactical-card card-dark" id="card-theatre">
          <div style="font-family: var(--font-mono); font-size: 16px; font-weight: 800; color: #FF8A80; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 12px;">
            ANATOMY OF A HOAX
          </div>
          <div style="font-size: 34px; font-weight: 900; line-height: 1.25; margin-bottom: 22px;">
            Dressing up fiction as "insider evidence."
          </div>

          <div style="background: rgba(255,255,255,0.08); border-radius: 18px; padding: 22px; margin-bottom: 16px; border: 1.5px solid rgba(255,255,255,0.15);">
            <div style="font-size: 20px; font-weight: 700; color: #FF8A80; margin-bottom: 6px;">
              No Uncovered Secret
            </div>
            <div style="font-size: 18px; color: rgba(255,255,255,0.85); line-height: 1.4;">
              It was never a hidden truth brought to light. It was an intentional weapon manufactured from stolen satire.
            </div>
          </div>

          <div style="background: rgba(255,255,255,0.08); border-radius: 18px; padding: 22px; border: 1.5px solid rgba(255,255,255,0.15);">
            <div style="font-size: 20px; font-weight: 700; color: #FFD452; margin-bottom: 6px;">
              Drama ≠ Verification
            </div>
            <div style="font-size: 18px; color: rgba(255,255,255,0.85); line-height: 1.4;">
              A sensational title or mysterious cover does not make an accusation true.
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SCENE 6 (46.8s - 54.5s): Modern Digital Recycling -->
    <section class="scene-viewport" id="scene-6" data-layout-allow-overlap="true">
      <div class="plate-container">
        <img class="plate-img" id="plate-6" src="assets/images/scene_3_parallel_forgery.jpg" alt="Documentary evidence comparison">
      </div>
      <div class="scene-content">
        <div class="tactical-card card-dark" id="card-recycling">
          <div style="font-family: var(--font-mono); font-size: 16px; font-weight: 800; color: var(--gold-bright); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 12px;">
            DIGITAL LITERACY CRITICAL RULE
          </div>
          <div style="font-size: 36px; font-weight: 900; line-height: 1.25; margin-bottom: 20px;">
            Old Hoax + New Graphics = Still a Hoax
          </div>

          <div style="background: rgba(255,255,255,0.08); border-radius: 18px; padding: 22px; margin-bottom: 16px; border: 1.5px solid rgba(255,255,255,0.15);">
            <div style="font-size: 20px; font-weight: 700; color: #58E2D0; margin-bottom: 6px;">
              Recycled Conspiracies
            </div>
            <div style="font-size: 18px; color: rgba(255,255,255,0.85); line-height: 1.4;">
              Modern social posts frequently repackage 1903 Protocols themes into sleek video essays, diagrams, or AI voices.
            </div>
          </div>

          <div style="padding: 14px 20px; background: rgba(179, 38, 30, 0.2); border: 1.5px solid #FF8A80; border-radius: 16px; font-size: 18px; color: #FF8A80; font-weight: 700; text-align: center;">
            New packaging does NOT repair false evidence.
          </div>
        </div>
      </div>
    </section>

    <!-- SCENE 7 (54.5s - 60.0s): Closing Lockup -->
    <section class="scene-viewport" id="scene-7" data-layout-allow-overlap="true">
      <div class="plate-container">
        <img class="plate-img" id="plate-7" src="assets/images/scene_4_times.jpg" alt="Historic Times Exposé Closing">
      </div>
      <div class="scene-content" style="justify-content: center;">
        <div class="tactical-card card-dark" id="card-closing" style="text-align: center; border-color: var(--gold-bright);">
          <div style="font-family: var(--font-mono); font-size: 16px; font-weight: 800; color: var(--gold-bright); letter-spacing: 2px; text-transform: uppercase;">
            BEYOND THE MYTH · CORE PRINCIPLE
          </div>
          <div style="font-size: 44px; font-weight: 900; line-height: 1.25; margin: 20px 0; color: #FFFFFF;">
            An old lie doesn’t become true in high definition.
          </div>
          <div style="font-family: var(--font-mono); font-size: 17px; color: rgba(255, 255, 255, 0.8); letter-spacing: 1.5px;">
            1903 FORGERY EXPOSED · VERIFIED SOURCES · USHMM ARCHIVES
          </div>
        </div>
      </div>
    </section>

    <!-- Subtitles persistent card -->
    <div class="subtitles-container" data-layout-allow-overlap="true">
      <div class="subtitles-card">
        <p class="subtitles-text" id="subtitles-display">The supposed secret document was fake. And partly copied.</p>
      </div>
      <div class="source-tag">
        <span class="source-bullet"></span>
        <span id="source-display">HISTORICAL FORENSICS (USHMM.ORG)</span>
      </div>
    </div>
  </div>

  <script>
    const cues = [
      {
        start: 0.0, end: 4.9,
        eyebrow: "FORENSIC HOAX INVESTIGATION", icon: "📜",
        subtitle: 'The supposed secret document was fake. <span class="hl-coral">And partly copied.</span>',
        source: "HISTORICAL FORENSICS (USHMM.ORG)"
      },
      {
        start: 4.9, end: 12.8,
        eyebrow: "ORIGIN OF THE FORGERY · 1903", icon: "🕵",
        subtitle: 'It’s called The Protocols of the Elders of Zion. First published in 1903, it pretended to reveal <span class="hl-coral">secret Jewish plans.</span>',
        source: "ST. PETERSBURG, 1903 (OKHRANA PROPAGANDA)"
      },
      {
        start: 12.8, end: 23.5,
        eyebrow: "DIRECT PLAGIARISM EXPOSED", icon: "⚖",
        subtitle: 'Meeting records were invented. Large sections came from an <span class="hl-gold">earlier French political satire</span> not even about Jewish people.',
        source: "MAURICE JOLY (1864) vs. 1903 TEXT"
      },
      {
        start: 23.5, end: 35.5,
        eyebrow: "THE 1921 TIMES OF LONDON EXPOSÉ", icon: "📰",
        subtitle: 'In 1921, <span class="hl-teal">The Times of London</span> exposed the copying. The <span class="hl-gold">US Holocaust Memorial Museum</span> documents the forgery.',
        source: "THE TIMES OF LONDON (AUG 1921) · USHMM"
      },
      {
        start: 35.5, end: 46.8,
        eyebrow: "FABRICATED INSIDER THEATRE", icon: "🎭",
        subtitle: 'This wasn’t hidden truth. It was a <span class="hl-coral">fabricated accusation</span> dressed up as an insider document. A dramatic cover didn’t make it evidence.',
        source: "HISTORICAL & FORENSIC CONSENSUS"
      },
      {
        start: 46.8, end: 54.5,
        eyebrow: "MODERN DIGITAL RECYCLING", icon: "📱",
        subtitle: 'That matters when a post recycles the same story with new graphics. <span class="hl-gold">New packaging doesn’t repair false evidence.</span>',
        source: "DIGITAL FORENSIC VERIFICATION"
      },
      {
        start: 54.5, end: 60.0,
        eyebrow: "BEYOND THE MYTH", icon: "✦",
        subtitle: '<span class="hl-gold">An old lie doesn’t become true in high definition.</span>',
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

    // SCENE 1 (0.0s - 4.9s)
    tl.set("#scene-1", { display: "block", opacity: 1 }, 0.0);
    tl.call(() => updateCue(0), null, 0.0);
    tl.fromTo("#plate-1", { scale: 1.0 }, { scale: 1.06, duration: 4.9, ease: "none" }, 0.0);
    tl.fromTo("#card-hook", { scale: 0.9, opacity: 0 }, { scale: 1.0, opacity: 1, duration: 0.6, ease: "back.out(1.4)" }, 0.2);
    tl.to("#scene-1", { opacity: 0, duration: 0.35 }, 4.55);
    tl.set("#scene-1", { display: "none" }, 4.9);

    // SCENE 2 (4.9s - 12.8s)
    tl.set("#scene-2", { display: "block", opacity: 0 }, 4.9);
    tl.to("#scene-2", { opacity: 1, duration: 0.35 }, 4.9);
    tl.call(() => updateCue(1), null, 4.9);
    tl.fromTo("#plate-2", { scale: 1.0 }, { scale: 1.07, duration: 7.9, ease: "none" }, 4.9);
    tl.fromTo("#card-origin", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }, 5.2);
    tl.to("#scene-2", { opacity: 0, duration: 0.35 }, 12.45);
    tl.set("#scene-2", { display: "none" }, 12.8);

    // SCENE 3 (12.8s - 23.5s)
    tl.set("#scene-3", { display: "block", opacity: 0 }, 12.8);
    tl.to("#scene-3", { opacity: 1, duration: 0.35 }, 12.8);
    tl.call(() => updateCue(2), null, 12.8);
    tl.fromTo("#plate-3", { scale: 1.0 }, { scale: 1.08, duration: 10.7, ease: "none" }, 12.8);
    tl.fromTo("#card-plagiarism", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }, 13.1);
    tl.to("#scene-3", { opacity: 0, duration: 0.35 }, 23.15);
    tl.set("#scene-3", { display: "none" }, 23.5);

    // SCENE 4 (23.5s - 35.5s)
    tl.set("#scene-4", { display: "block", opacity: 0 }, 23.5);
    tl.to("#scene-4", { opacity: 1, duration: 0.35 }, 23.5);
    tl.call(() => updateCue(3), null, 23.5);
    tl.fromTo("#plate-4", { scale: 1.0 }, { scale: 1.08, duration: 12.0, ease: "none" }, 23.5);
    tl.fromTo("#card-times", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }, 23.8);
    tl.to("#scene-4", { opacity: 0, duration: 0.35 }, 35.15);
    tl.set("#scene-4", { display: "none" }, 35.5);

    // SCENE 5 (35.5s - 46.8s)
    tl.set("#scene-5", { display: "block", opacity: 0 }, 35.5);
    tl.to("#scene-5", { opacity: 1, duration: 0.35 }, 35.5);
    tl.call(() => updateCue(4), null, 35.5);
    tl.fromTo("#plate-5", { scale: 1.0 }, { scale: 1.08, duration: 11.3, ease: "none" }, 35.5);
    tl.fromTo("#card-theatre", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }, 35.8);
    tl.to("#scene-5", { opacity: 0, duration: 0.35 }, 46.45);
    tl.set("#scene-5", { display: "none" }, 46.8);

    // SCENE 6 (46.8s - 54.5s)
    tl.set("#scene-6", { display: "block", opacity: 0 }, 46.8);
    tl.to("#scene-6", { opacity: 1, duration: 0.35 }, 46.8);
    tl.call(() => updateCue(5), null, 46.8);
    tl.fromTo("#plate-6", { scale: 1.0 }, { scale: 1.07, duration: 7.7, ease: "none" }, 46.8);
    tl.fromTo("#card-recycling", { scale: 0.9, opacity: 0 }, { scale: 1.0, opacity: 1, duration: 0.6, ease: "back.out(1.4)" }, 47.1);
    tl.to("#scene-6", { opacity: 0, duration: 0.35 }, 54.15);
    tl.set("#scene-6", { display: "none" }, 54.5);

    // SCENE 7 (54.5s - 60.0s)
    tl.set("#scene-7", { display: "block", opacity: 0 }, 54.5);
    tl.to("#scene-7", { opacity: 1, duration: 0.35 }, 54.5);
    tl.call(() => updateCue(6), null, 54.5);
    tl.fromTo("#plate-7", { scale: 1.0 }, { scale: 1.06, duration: 5.5, ease: "none" }, 54.5);
    tl.fromTo("#card-closing", { scale: 0.9, opacity: 0 }, { scale: 1.0, opacity: 1, duration: 0.6, ease: "back.out(1.4)" }, 54.8);
    tl.to("#root", { x: -1080, duration: 0.8, ease: "power2.in" }, 59.2);
  </script>
</body>
</html>
`;

fs.writeFileSync(targetHtml, htmlContent, 'utf8');
console.log('[OK] Wrote Cinematic Ep06 index.html');

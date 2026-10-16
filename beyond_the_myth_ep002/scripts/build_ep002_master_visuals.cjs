const fs = require('fs');
const path = require('path');

console.log('Generating Beyond The Myth Episode 002 master composition...');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Beyond The Myth · Episode 002: What That Kosher Symbol Actually Means</title>
  <!-- GSAP CDN for HyperFrames deterministic animation -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  <!-- Google Fonts: Outfit & Space Grotesk cached by HyperFrames compiler -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&family=EB+Garamond:wght@700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      /* FORMA Pastel Studio 2.0 Editorial Palette (WCAG AA Compliant) */
      --page-bg: #FCFAFE;
      --paper-cream: #FFF4E8;
      --paper-card: #FFFFFF;
      --paper-tint: #F3EFFA;
      --paper-line: #E8E3F0;
      --paper-warm: #FEF9F3;
      
      --ink-black: #2A2535;
      --ink-muted: #5E566E;
      --ink-subtle: #7A708C;
      
      --pastel-rust: #B54741;
      --pastel-coral: #E88E88;
      --pastel-gold: #D89820;
      --pastel-amber: #EAA830;
      --pastel-teal: #1E5C56;
      --pastel-mint: #4E9B90;
      --pastel-blue: #7E70B8;
      --pastel-lavender: #C4B6E5;
      --pastel-sage: #4E7E42;
      
      --shadow-soft: 0 20px 80px rgba(56, 51, 73, 0.12);
      --shadow-card: 6px 6px 0 var(--ink-black);
      --shadow-pill: 3px 3px 0 var(--ink-black);
      
      --font-display: 'Outfit', sans-serif;
      --font-text: 'Space Grotesk', sans-serif;
      --font-serif: 'EB Garamond', Georgia, serif;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      user-select: none;
      -webkit-font-smoothing: antialiased;
    }

    body {
      background-color: #1A1724;
      color: var(--ink-black);
      font-family: var(--font-text);
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }

    /* 9:16 Vertical Video Canvas (1080 x 1920) */
    #root {
      position: relative;
      width: 1080px;
      height: 1920px;
      background: linear-gradient(180deg, #FCFAFE 0%, #FFF4E8 45%, #F4F0FA 100%);
      overflow: hidden;
      box-shadow: 0 35px 120px rgba(0, 0, 0, 0.75);
    }

    /* Subtle Tactile Screenprint / Paper Grain Texture */
    .paper-texture {
      position: absolute;
      inset: 0;
      background-image: 
        radial-gradient(rgba(185, 169, 223, 0.22) 0.8px, transparent 0.8px),
        radial-gradient(rgba(218, 117, 111, 0.15) 0.8px, transparent 0.8px);
      background-size: 20px 20px;
      background-position: 0 0, 10px 10px;
      opacity: 0.65;
      pointer-events: none;
      z-index: 1;
    }

    /* Soft Atmospheric Vignette */
    .paper-vignette {
      position: absolute;
      inset: 0;
      box-shadow: inset 0 0 140px rgba(80, 50, 110, 0.08), inset 0 0 40px rgba(56, 51, 73, 0.06);
      pointer-events: none;
      z-index: 2;
    }

    /* Luminous Warm Theatrical Spotlight */
    .theatrical-spotlight {
      position: absolute;
      top: -100px;
      left: 140px;
      width: 820px;
      height: 2050px;
      background: linear-gradient(172deg, rgba(249, 217, 140, 0.40) 0%, rgba(241, 201, 110, 0.20) 50%, rgba(185, 169, 223, 0.05) 90%, transparent 100%);
      clip-path: polygon(260px 0, 560px 0, 820px 2050px, 0 2050px);
      pointer-events: none;
      z-index: 4;
      mix-blend-mode: multiply;
      transform-origin: top center;
    }

    /* Persistent Show Brand Header */
    .show-header {
      position: absolute;
      top: 140px;
      left: 90px;
      width: 900px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 30;
      border-bottom: 2px solid var(--paper-line);
      padding-bottom: 16px;
    }

    .brand-group {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .brand-mark {
      width: 48px;
      height: 48px;
      background: var(--pastel-lavender);
      border: 3px solid var(--ink-black);
      border-radius: 12px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: var(--font-display);
      font-weight: 900;
      font-size: 24px;
      color: var(--ink-black);
      transform: rotate(-2deg);
      box-shadow: var(--shadow-pill);
    }

    .brand-titles {
      display: flex;
      flex-direction: column;
    }

    .brand-title {
      font-family: var(--font-display);
      font-weight: 900;
      font-size: 26px;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: var(--ink-black);
      line-height: 1.1;
    }

    .brand-sub {
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: var(--pastel-teal);
      margin-top: 2px;
    }

    .episode-pill {
      font-family: var(--font-display);
      font-size: 15px;
      font-weight: 800;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--ink-black);
      background: var(--pastel-gold);
      border: 2px solid var(--ink-black);
      padding: 6px 16px;
      border-radius: 20px;
      box-shadow: var(--shadow-pill);
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .pill-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--pastel-rust);
    }

    /* Persistent Source Pill */
    .source-container {
      position: absolute;
      bottom: 175px;
      left: 90px;
      width: 900px;
      display: flex;
      align-items: center;
      z-index: 30;
    }

    .source-stamp {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      background: var(--paper-card);
      border: 2.5px solid var(--ink-black);
      padding: 9px 20px;
      border-radius: 24px;
      font-family: var(--font-text);
      font-size: 17px;
      font-weight: 700;
      color: var(--ink-black);
      box-shadow: var(--shadow-pill);
    }

    .source-bullet {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--pastel-teal);
      flex-shrink: 0;
    }

    /* Subtitles Card */
    .subtitle-wrapper {
      position: absolute;
      left: 90px;
      bottom: 245px;
      width: 900px;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 40;
    }

    .subtitle-card {
      background: var(--ink-black);
      border: 3px solid var(--ink-black);
      border-radius: 20px;
      padding: 20px 36px;
      text-align: center;
      box-shadow: 6px 6px 0 var(--pastel-gold);
      max-width: 890px;
    }

    .subtitle-text {
      font-family: var(--font-display);
      font-size: 32px;
      font-weight: 800;
      line-height: 1.35;
      color: #FFFFFF;
      letter-spacing: -0.01em;
    }

    .subtitle-text .hl-gold { color: var(--pastel-gold); }
    .subtitle-text .hl-coral { color: var(--pastel-coral); }
    .subtitle-text .hl-mint { color: #62B8AD; }

    /* Scene Container & Stage */
    .scene {
      position: absolute;
      inset: 0;
      width: 1080px;
      height: 1920px;
      display: none;
      z-index: 10;
    }

    .scene-content {
      position: absolute;
      left: 90px;
      top: 220px;
      width: 900px;
      height: 1100px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    /* Eyebrow Badge */
    .forma-eyebrow {
      font-family: var(--font-display);
      font-size: 19px;
      font-weight: 800;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--ink-black);
      background: var(--paper-card);
      border: 2px solid var(--ink-black);
      padding: 6px 20px;
      border-radius: 20px;
      margin-bottom: 14px;
      box-shadow: var(--shadow-pill);
      display: inline-flex;
      align-items: center;
      gap: 10px;
    }

    .forma-eyebrow::before {
      content: "";
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--pastel-rust);
    }

    /* Main Editorial Headline */
    .forma-headline {
      font-family: var(--font-display);
      font-size: 50px;
      font-weight: 900;
      line-height: 1.12;
      text-align: center;
      text-transform: uppercase;
      letter-spacing: -0.02em;
      color: var(--ink-black);
      margin-bottom: 24px;
    }

    .forma-headline em {
      font-style: normal;
      color: var(--pastel-teal);
    }

    .forma-headline .coral {
      color: var(--pastel-rust);
    }

    /* 3D Cereal Box Component */
    .cereal-box-hero {
      position: relative;
      width: 440px;
      height: 600px;
      background: linear-gradient(145deg, #fef1b8 0%, #f6d16d 60%, #e2b545 100%);
      border: 4px solid var(--ink-black);
      border-radius: 22px;
      box-shadow: var(--shadow-card);
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 28px 24px;
      overflow: hidden;
    }

    .cereal-box-flap {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 36px;
      background: #ebd17d;
      border-bottom: 3px dashed rgba(42, 37, 53, 0.4);
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: var(--font-text);
      font-size: 13px;
      letter-spacing: 0.16em;
      font-weight: 700;
      color: #382d1c;
    }

    .cereal-brand {
      margin-top: 36px;
      font-family: var(--font-display);
      font-size: 52px;
      font-weight: 900;
      color: #8c3222;
      text-align: center;
      line-height: 1.05;
      text-shadow: 2px 2px 0 #fff;
    }

    .cereal-subbrand {
      font-family: var(--font-text);
      font-size: 17px;
      font-weight: 700;
      color: var(--pastel-teal);
      letter-spacing: 0.12em;
      text-transform: uppercase;
      margin-top: 4px;
    }

    .cereal-ou-symbol {
      position: relative;
      width: 86px;
      height: 86px;
      background: #FFFFFF;
      border: 3.5px solid var(--ink-black);
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      box-shadow: 3px 3px 0 var(--ink-black);
    }

    .cereal-ou-symbol span {
      font-family: var(--font-serif);
      font-size: 54px;
      font-weight: 900;
      color: var(--ink-black);
      line-height: 1;
      margin-top: -4px;
    }

    /* Magnifier */
    .magnifier-wrap {
      position: absolute;
      width: 280px;
      height: 280px;
      z-index: 50;
      pointer-events: none;
    }

    .magnifier-lens {
      width: 200px;
      height: 200px;
      border-radius: 50%;
      border: 12px solid #d4af37;
      background: radial-gradient(circle at 35% 35%, rgba(255,255,255,0.5), rgba(244,208,132,0.2) 65%, rgba(170,130,10,0.3) 100%);
      box-shadow: 0 20px 60px rgba(0,0,0,0.35), inset 0 0 25px rgba(255,255,255,0.7);
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
    }

    .magnifier-handle {
      position: absolute;
      top: 170px;
      left: 170px;
      width: 22px;
      height: 120px;
      background: linear-gradient(90deg, #593d23, #8f6033 50%, #3e2a18);
      border: 3px solid var(--ink-black);
      border-radius: 11px;
      transform: rotate(-45deg);
      transform-origin: top left;
      box-shadow: 6px 8px 18px rgba(0,0,0,0.25);
    }

    /* Dossier & Cards */
    .master-card {
      background: #FFFFFF;
      border: 3.5px solid var(--ink-black);
      border-radius: 22px;
      padding: 36px 42px;
      box-shadow: var(--shadow-card);
      position: relative;
    }

    .stamp-seal {
      position: absolute;
      border: 2.5px solid var(--pastel-rust);
      background: #FFF2F0;
      color: var(--pastel-rust);
      font-family: var(--font-display);
      font-weight: 900;
      font-size: 16px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      padding: 8px 18px;
      border-radius: 6px;
      box-shadow: 2px 2px 0 var(--pastel-rust);
    }
  </style>
</head>
<body>
  <div id="root" data-composition-id="main" data-width="1080" data-height="1920" data-duration="60" data-fps="30">
    
    <!-- Paper Texture & Theatrical Lighting -->
    <div class="paper-texture" data-layout-allow-overlap="true" data-layout-allow-occlusion="true"></div>
    <div class="paper-vignette" data-layout-allow-overlap="true" data-layout-allow-occlusion="true"></div>
    <div class="theatrical-spotlight" id="spotlight" data-layout-allow-overlap="true" data-layout-allow-occlusion="true"></div>

    <!-- Persistent Header -->
    <div class="show-header" data-layout-allow-overlap="true">
      <div class="brand-group">
        <div class="brand-mark">BTM</div>
        <div class="brand-titles">
          <div class="brand-title">Beyond The Myth</div>
          <div class="brand-sub">Episode 002 · Factual Documentary</div>
        </div>
      </div>
      <div class="episode-pill">
        <div class="pill-dot"></div>
        <span>60s Master</span>
      </div>
    </div>

    <!-- Persistent Subtitle Wrapper -->
    <div class="subtitle-wrapper" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
      <div class="subtitle-card">
        <div class="subtitle-text" id="sub-text">
          That tiny symbol on your food? It's a <span class="hl-gold">certification</span>, not an <span class="hl-coral">ownership code</span>.
        </div>
      </div>
    </div>

    <!-- Persistent Source Citation -->
    <div class="source-container" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
      <div class="source-stamp" id="source-badge">
        <div class="source-bullet"></div>
        <span id="source-text">OU Kosher Certification (oukosher.org)</span>
      </div>
    </div>

    <!-- =========================================================================
         SCENE 1: IMPACTO INMEDIATO (0.0s – 5.5s)
         ========================================================================= -->
    <div class="scene" id="scene-1" style="display: flex;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
      <div class="scene-content" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
        <div class="forma-eyebrow">Evidence Inquiry · Item 01</div>
        <div class="forma-headline">CERTIFICATION <em>≠</em> <span class="coral">OWNERSHIP</span></div>

        <div style="position: relative; width: 780px; height: 720px; display: flex; justify-content: center; align-items: center;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
          
          <!-- Hero 2.5D Cereal Box -->
          <div id="s1-box-wrap" style="will-change: transform;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
            <div class="cereal-box-hero" id="s1-box">
              <div class="cereal-box-flap">· OPEN HERE · CRISP SEAL ·</div>
              <div class="cereal-brand">HONEY<br>CRUNCH</div>
              <div class="cereal-subbrand">Whole Grain Toasted Oats</div>

              <!-- Cereal Bowl SVG -->
              <svg width="320" height="200" viewBox="0 0 320 200" fill="none" style="margin-top: 18px;">
                <ellipse cx="160" cy="170" rx="140" ry="20" fill="rgba(42,37,53,0.15)"/>
                <path d="M40 85 Q160 80 280 85 Q268 160 160 165 Q52 160 40 85Z" fill="#70c4b8" stroke="#2A2535" stroke-width="4"/>
                <path d="M48 90 Q160 86 272 90 Q260 135 160 142 Q60 135 48 90Z" fill="#FFF4E8"/>
                <circle cx="110" cy="105" r="14" fill="#f4d084" stroke="#2A2535" stroke-width="2.5"/>
                <circle cx="150" cy="100" r="16" fill="#f4d084" stroke="#2A2535" stroke-width="2.5"/>
                <circle cx="190" cy="106" r="13" fill="#f4d084" stroke="#2A2535" stroke-width="2.5"/>
                <circle cx="130" cy="120" r="15" fill="#f4d084" stroke="#2A2535" stroke-width="2.5"/>
                <circle cx="170" cy="122" r="14" fill="#f4d084" stroke="#2A2535" stroke-width="2.5"/>
                <path d="M75 75 Q135 95 160 65 Q185 105 245 85" stroke="#d97706" stroke-width="6" stroke-linecap="round"/>
              </svg>

              <!-- Footer with OU Symbol -->
              <div style="position: absolute; bottom: 24px; left: 28px; right: 28px; display: flex; justify-content: space-between; align-items: flex-end;" data-layout-allow-overlap="true">
                <div style="font-family: var(--font-text); font-size: 13px; font-weight: 700; color: var(--ink-black);">
                  <div>CALORIES: 140</div>
                  <div>FIBER: 5g · PROTEIN: 4g</div>
                  <div>NET WT 18 OZ (510g)</div>
                </div>
                <div class="cereal-ou-symbol" id="s1-ou-target">
                  <span>Ⓤ</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Realistic Hand Stopping Box -->
          <div id="s1-hand" style="position: absolute; right: -40px; bottom: 80px; z-index: 40;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
            <svg width="380" height="300" viewBox="0 0 380 300" fill="none">
              <path d="M200 150 L380 180 L380 300 L160 300 Z" fill="#2a6860" stroke="#2A2535" stroke-width="5"/>
              <path d="M175 140 L210 150 L180 300 L145 290 Z" fill="#FFF4E8" stroke="#2A2535" stroke-width="4"/>
              <path d="M85 110 Q125 85 165 110 Q190 145 175 200 Q135 240 95 200 Q70 155 85 110Z" fill="#e7b595" stroke="#2A2535" stroke-width="4.5"/>
              <rect x="20" y="85" width="100" height="30" rx="15" fill="#e7b595" stroke="#2A2535" stroke-width="4"/>
              <rect x="10" y="120" width="110" height="30" rx="15" fill="#e7b595" stroke="#2A2535" stroke-width="4"/>
              <rect x="15" y="155" width="105" height="30" rx="15" fill="#e7b595" stroke="#2A2535" stroke-width="4"/>
              <rect x="30" y="190" width="95" height="28" rx="14" fill="#e7b595" stroke="#2A2535" stroke-width="4"/>
              <path d="M125 95 Q110 55 70 65 Q60 80 90 105 Z" fill="#e7b595" stroke="#2A2535" stroke-width="4"/>
            </svg>
          </div>

          <!-- Magnifier focusing on OU mark -->
          <div class="magnifier-wrap" id="s1-magnifier" style="top: 380px; left: 340px; opacity: 0;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
            <div class="magnifier-lens">
              <span style="font-family: var(--font-serif); font-size: 110px; font-weight: 900; color: var(--ink-black);">Ⓤ</span>
              <div style="position: absolute; top: 15px; left: 24px; width: 55px; height: 32px; border-radius: 50%; background: rgba(255,255,255,0.7); transform: rotate(-30deg);"></div>
            </div>
            <div class="magnifier-handle"></div>
          </div>

        </div>
      </div>
    </div>

    <!-- =========================================================================
         SCENE 2: UNA PREGUNTA HUMANA (5.5s – 11.6s)
         ========================================================================= -->
    <div class="scene" id="scene-2" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
      <div class="scene-content" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
        <div class="forma-eyebrow">Standard Verification · S1</div>
        <div class="forma-headline">THE <em>O-U</em> MARK EXPLAINED</div>

        <div class="master-card" style="width: 840px;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
          <div class="stamp-seal" style="top: 24px; right: 32px; transform: rotate(4deg);">
            INDEPENDENT NONPROFIT
          </div>

          <div style="display: flex; align-items: center; gap: 24px;">
            <div class="cereal-ou-symbol" style="width: 110px; height: 110px; border-width: 4px;">
              <span style="font-size: 68px;">Ⓤ</span>
            </div>
            <div>
              <h3 style="font-family: var(--font-display); font-size: 36px; font-weight: 900; color: var(--ink-black); line-height: 1.1;">
                Orthodox Union Kosher
              </h3>
              <p style="font-family: var(--font-text); font-size: 18px; font-weight: 700; color: var(--pastel-teal); margin-top: 4px;">
                ESTABLISHED 1898 · GLOBAL DIETARY SUPERVISION
              </p>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 32px;">
            <div style="background: var(--paper-warm); border: 2.5px solid var(--ink-black); border-radius: 16px; padding: 22px; box-shadow: var(--shadow-pill);">
              <div style="font-family: var(--font-display); font-size: 20px; font-weight: 800; color: var(--pastel-teal);">
                ✓ WHAT IT CERTIFIES
              </div>
              <p style="font-size: 17px; font-weight: 600; color: var(--ink-black); margin-top: 8px; line-height: 1.35;">
                Verifies that food ingredients and processing machines meet traditional kosher dietary standards.
              </p>
            </div>

            <div style="background: var(--paper-warm); border: 2.5px solid var(--ink-black); border-radius: 16px; padding: 22px; box-shadow: var(--shadow-pill);">
              <div style="font-family: var(--font-display); font-size: 20px; font-weight: 800; color: var(--pastel-rust);">
                ✕ WHAT IT DOES NOT DO
              </div>
              <p style="font-size: 17px; font-weight: 600; color: var(--ink-black); margin-top: 8px; line-height: 1.35;">
                Conveys zero equity, stock, voting rights, or corporate management over the producing company.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- =========================================================================
         SCENE 3: ENTRAR EN EL PROCESO (11.6s – 18.7s)
         ========================================================================= -->
    <div class="scene" id="scene-3" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
      <div class="scene-content" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
        <div class="forma-eyebrow">Factory Supervision · S2</div>
        <div class="forma-headline">HOW <em>INSPECTORS</em> VERIFY FOOD</div>

        <div style="width: 860px; display: flex; flex-direction: column; gap: 20px;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
          
          <div id="s3-card-1" class="master-card" style="padding: 24px 32px; display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 20px;">
              <div style="width: 48px; height: 48px; border-radius: 50%; background: #e8f5e9; border: 2.5px solid var(--ink-black); display: flex; justify-content: center; align-items: center; font-size: 24px; font-weight: 900; color: var(--pastel-sage);">✓</div>
              <div>
                <h4 style="font-family: var(--font-display); font-size: 26px; font-weight: 900; color: var(--ink-black);">1. Ingredients Sourcing</h4>
                <p style="font-size: 16px; font-weight: 600; color: var(--ink-muted);">Chemical and agricultural tracing of all additives & colorants.</p>
              </div>
            </div>
            <span style="font-family: var(--font-text); font-weight: 700; font-size: 15px; background: #e0f2f1; color: var(--pastel-teal); padding: 6px 16px; border-radius: 20px; border: 1.5px solid var(--ink-black);">AUDITED</span>
          </div>

          <div id="s3-card-2" class="master-card" style="padding: 24px 32px; display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 20px;">
              <div style="width: 48px; height: 48px; border-radius: 50%; background: #e8f5e9; border: 2.5px solid var(--ink-black); display: flex; justify-content: center; align-items: center; font-size: 24px; font-weight: 900; color: var(--pastel-sage);">✓</div>
              <div>
                <h4 style="font-family: var(--font-display); font-size: 26px; font-weight: 900; color: var(--ink-black);">2. Equipment Sanitization</h4>
                <p style="font-size: 16px; font-weight: 600; color: var(--ink-muted);">Strict kosher cleaning of stainless steel vats & mixing lines.</p>
              </div>
            </div>
            <span style="font-family: var(--font-text); font-weight: 700; font-size: 15px; background: #e0f2f1; color: var(--pastel-teal); padding: 6px 16px; border-radius: 20px; border: 1.5px solid var(--ink-black);">VERIFIED</span>
          </div>

          <div id="s3-card-3" class="master-card" style="padding: 24px 32px; display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 20px;">
              <div style="width: 48px; height: 48px; border-radius: 50%; background: #e8f5e9; border: 2.5px solid var(--ink-black); display: flex; justify-content: center; align-items: center; font-size: 24px; font-weight: 900; color: var(--pastel-sage);">✓</div>
              <div>
                <h4 style="font-family: var(--font-display); font-size: 26px; font-weight: 900; color: var(--ink-black);">3. Manufacturing Process</h4>
                <p style="font-size: 16px; font-weight: 600; color: var(--ink-muted);">Ensuring zero cross-contamination during active production runs.</p>
              </div>
            </div>
            <span style="font-family: var(--font-text); font-weight: 700; font-size: 15px; background: #e0f2f1; color: var(--pastel-teal); padding: 6px 16px; border-radius: 20px; border: 1.5px solid var(--ink-black);">COMPLIANT</span>
          </div>

        </div>
      </div>
    </div>

    <!-- =========================================================================
         SCENE 4: EL DATO QUE NO SE OCULTA (18.7s – 27.8s)
         ========================================================================= -->
    <div class="scene" id="scene-4" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
      <div class="scene-content" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
        <div class="forma-eyebrow">Financial Structure · S3</div>
        <div class="forma-headline">YES, COMPANIES <em>PAY FEES</em></div>

        <div class="master-card" style="width: 860px;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid var(--paper-line); padding-bottom: 18px;">
            <div>
              <span style="font-family: var(--font-text); font-size: 15px; font-weight: 800; color: var(--pastel-amber); letter-spacing: 0.12em; text-transform: uppercase;">
                SCHEDULE B · CERTIFICATION AGREEMENT (ILLUSTRATION)
              </span>
              <h3 style="font-family: var(--font-display); font-size: 34px; font-weight: 900; color: var(--ink-black); margin-top: 4px;">
                Commercial Audit Agreement
              </h3>
            </div>
            <div style="font-family: var(--font-display); font-weight: 900; font-size: 20px; color: var(--pastel-rust); border: 2.5px solid var(--pastel-rust); padding: 6px 16px; border-radius: 8px;">
              SERVICE CONTRACT
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-top: 24px;">
            <div style="background: var(--paper-warm); border: 2px solid var(--ink-black); border-radius: 14px; padding: 18px; text-align: center;">
              <div style="font-weight: 800; font-size: 15px; color: var(--pastel-teal);">STEP 1</div>
              <div style="font-family: var(--font-display); font-size: 22px; font-weight: 900; margin-top: 4px;">Application</div>
              <p style="font-size: 14px; color: var(--ink-muted); margin-top: 4px;">Company voluntarily requests inspection.</p>
            </div>
            <div style="background: var(--paper-warm); border: 2px solid var(--ink-black); border-radius: 14px; padding: 18px; text-align: center;">
              <div style="font-weight: 800; font-size: 15px; color: var(--pastel-teal);">STEP 2</div>
              <div style="font-family: var(--font-display); font-size: 22px; font-weight: 900; margin-top: 4px;">Plant Audit</div>
              <p style="font-size: 14px; color: var(--ink-muted); margin-top: 4px;">Rabbinic field coordinator inspection.</p>
            </div>
            <div style="background: var(--paper-warm); border: 2px solid var(--ink-black); border-radius: 14px; padding: 18px; text-align: center;">
              <div style="font-weight: 800; font-size: 15px; color: var(--pastel-teal);">STEP 3</div>
              <div style="font-family: var(--font-display); font-size: 22px; font-weight: 900; margin-top: 4px;">Annual Fee</div>
              <p style="font-size: 14px; color: var(--ink-muted); margin-top: 4px;">Covers inspector labor & lab expenses.</p>
            </div>
          </div>

          <div style="margin-top: 24px; background: #FEF3C7; border: 2.5px solid #D97706; border-radius: 16px; padding: 20px 24px; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="font-family: var(--font-text); font-weight: 800; font-size: 15px; color: #92400E;">FEE RECIPIENT: INDEPENDENT CERTIFICATION BODY</div>
              <div style="font-size: 20px; font-weight: 800; color: #78350F; margin-top: 2px;">Covers Labor, Testing & Travel Expenses</div>
            </div>
            <div style="font-family: var(--font-display); font-size: 28px; font-weight: 900; color: #92400E; background: #FFFFFF; border: 2px solid #92400E; padding: 8px 18px; border-radius: 10px;">
              0% EQUITY
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- =========================================================================
         SCENE 5: EL SALTO QUE LA PRUEBA NO PERMITE (27.8s – 33.3s)
         ========================================================================= -->
    <div class="scene" id="scene-5" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
      <div class="scene-content" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
        <div class="forma-eyebrow">Logical Fallacy · S3 Analysis</div>
        <div class="forma-headline">FEES <em>DO NOT PROVE</em> <span class="coral">CONTROL</span></div>

        <div style="width: 860px; display: grid; grid-template-columns: 1fr 1fr; gap: 24px;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
          
          <div class="master-card" style="background: #F4FAF7; border-color: var(--pastel-teal);">
            <div style="font-family: var(--font-display); font-size: 16px; font-weight: 900; color: var(--pastel-teal); letter-spacing: 0.1em; text-transform: uppercase;">
              ✓ FACTUAL COMMERCE
            </div>
            <h4 style="font-family: var(--font-display); font-size: 30px; font-weight: 900; color: var(--ink-black); margin-top: 10px;">
              Paying for a Service
            </h4>
            <p style="font-size: 18px; font-weight: 600; color: var(--ink-muted); margin-top: 10px; line-height: 1.4;">
              Just like paying an electrician, fire marshal, or organic certifier—a company pays for certified inspection labor.
            </p>
          </div>

          <div class="master-card" style="background: #FFF5F4; border-color: var(--pastel-rust);">
            <div style="font-family: var(--font-display); font-size: 16px; font-weight: 900; color: var(--pastel-rust); letter-spacing: 0.1em; text-transform: uppercase;">
              ✕ CONSPIRACY LEAP
            </div>
            <h4 style="font-family: var(--font-display); font-size: 30px; font-weight: 900; color: var(--ink-black); margin-top: 10px;">
              Alleging "Control"
            </h4>
            <p style="font-size: 18px; font-weight: 600; color: var(--ink-muted); margin-top: 10px; line-height: 1.4;">
              Paying for an inspection does NOT prove that a religious community controls the company or the food industry.
            </p>
          </div>

        </div>
      </div>
    </div>

    <!-- =========================================================================
         SCENE 6: MOSTRAR CÓMO COMPROBAR (33.3s – 40.8s)
         ========================================================================= -->
    <div class="scene" id="scene-6" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
      <div class="scene-content" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
        <div class="forma-eyebrow">Documentary Records</div>
        <div class="forma-headline">WANT TO KNOW WHO OWNS IT? <em>CHECK RECORDS</em></div>

        <div style="width: 860px; display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 24px; align-items: center;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
          
          <!-- Tablet with SEC records -->
          <div class="master-card">
            <div style="display: flex; justify-content: space-between; border-bottom: 2px solid var(--paper-line); padding-bottom: 12px;">
              <span style="font-family: var(--font-text); font-size: 14px; font-weight: 800; color: var(--pastel-teal);">SEC FORM 10-K · ILLUSTRATION</span>
              <span style="font-size: 14px; font-weight: 700; color: var(--ink-muted);">EDGAR DATABASE</span>
            </div>
            <h4 style="font-family: var(--font-display); font-size: 26px; font-weight: 900; margin-top: 12px;">Verified Shareholder Equity</h4>
            
            <div style="display: flex; align-items: center; justify-content: space-around; margin-top: 20px;">
              <svg width="150" height="150" viewBox="0 0 150 150">
                <circle cx="75" cy="75" r="55" fill="transparent" stroke="#7E70B8" stroke-width="28" stroke-dasharray="145 350" stroke-dashoffset="0"/>
                <circle cx="75" cy="75" r="55" fill="transparent" stroke="#4E9B90" stroke-width="28" stroke-dasharray="130 350" stroke-dashoffset="-145"/>
                <circle cx="75" cy="75" r="55" fill="transparent" stroke="#EAA830" stroke-width="28" stroke-dasharray="75 350" stroke-dashoffset="-275"/>
              </svg>
              <div style="font-family: var(--font-text); font-size: 14px; font-weight: 700; display: flex; flex-direction: column; gap: 8px;">
                <div><span style="color: #7E70B8;">■</span> 42% Index Funds</div>
                <div><span style="color: #4E9B90;">■</span> 38% Public Retail</div>
                <div><span style="color: #EAA830;">■</span> 20% Employee Trusts</div>
              </div>
            </div>
            <div style="background: var(--paper-warm); border: 2px solid var(--ink-black); border-radius: 10px; padding: 10px; margin-top: 16px; text-align: center; font-size: 15px; font-weight: 700;">
              Answers: "Who holds corporate stock?"
            </div>
          </div>

          <!-- Food Label comparison -->
          <div class="master-card" style="text-align: center; background: #FFF9F5;">
            <div class="cereal-ou-symbol" style="margin: 0 auto; width: 100px; height: 100px;">
              <span style="font-size: 60px;">Ⓤ</span>
            </div>
            <h4 style="font-family: var(--font-display); font-size: 24px; font-weight: 900; margin-top: 16px;">Dietary Mark</h4>
            <p style="font-size: 15px; font-weight: 600; color: var(--ink-muted); margin-top: 6px;">
              Answers dietary conformity: "Is this food kosher?"
            </p>
            <div style="font-size: 15px; font-weight: 800; color: var(--pastel-rust); margin-top: 12px; border-top: 2px dashed var(--paper-line); padding-top: 8px;">
              Does NOT answer ownership!
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- =========================================================================
         SCENE 7: CERRAR LA DISTANCIA HUMANA (40.8s – 50.0s)
         ========================================================================= -->
    <div class="scene" id="scene-7" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
      <div class="scene-content" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
        <div class="forma-eyebrow">Ethical Public Reasoning</div>
        <div class="forma-headline">FOLLOW THE EVIDENCE. <em>NOT COLLECTIVE BLAME.</em></div>

        <div class="master-card" style="width: 860px;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
            <div style="background: var(--paper-warm); border: 2.5px solid var(--ink-black); border-radius: 16px; padding: 26px; box-shadow: var(--shadow-pill);">
              <div style="font-family: var(--font-display); font-size: 18px; font-weight: 900; color: var(--pastel-teal); letter-spacing: 0.1em; text-transform: uppercase;">
                ✓ HOLD DECISION-MAKERS ACCOUNTABLE
              </div>
              <p style="font-size: 18px; font-weight: 600; color: var(--ink-black); margin-top: 12px; line-height: 1.4;">
                Ask tough questions. Read the corporate records. Check the votes and hold executives responsible for their actions.
              </p>
            </div>

            <div style="background: var(--paper-warm); border: 2.5px solid var(--ink-black); border-radius: 16px; padding: 26px; box-shadow: var(--shadow-pill);">
              <div style="font-family: var(--font-display); font-size: 18px; font-weight: 900; color: var(--pastel-rust); letter-spacing: 0.1em; text-transform: uppercase;">
                ✕ REJECT SCAPEGOATING
              </div>
              <p style="font-size: 18px; font-weight: 600; color: var(--ink-black); margin-top: 12px; line-height: 1.4;">
                Blaming millions of Jewish people as a group is not evidence. Never hold an entire community responsible for who they are.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- =========================================================================
         SCENE 8: LA IMAGEN QUE SE RECUERDA (50.0s – 60.0s)
         ========================================================================= -->
    <div class="scene" id="scene-8" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
      <div class="scene-content" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
        <div class="forma-eyebrow">Beyond The Myth · Conclusion</div>
        
        <div style="width: 840px; display: flex; flex-direction: column; align-items: center; text-align: center;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
          
          <div class="master-card" style="width: 780px; padding: 48px; display: flex; flex-direction: column; align-items: center;">
            <div class="cereal-ou-symbol" style="width: 130px; height: 130px; border-width: 5px;">
              <span style="font-size: 80px;">Ⓤ</span>
            </div>

            <h2 style="font-family: var(--font-display); font-size: 46px; font-weight: 900; color: var(--ink-black); line-height: 1.15; margin-top: 24px; text-transform: uppercase;">
              THE LABEL BELONGS<br>ON THE BOX.
            </h2>
            
            <div style="width: 100px; height: 4px; background: var(--pastel-amber); margin: 20px 0;"></div>

            <p style="font-family: var(--font-display); font-size: 28px; font-weight: 800; color: var(--pastel-rust); text-transform: uppercase; letter-spacing: 0.04em;">
              NOT ON AN ENTIRE COMMUNITY.
            </p>
          </div>

          <div style="margin-top: 36px; display: flex; align-items: center; gap: 16px;">
            <div class="brand-mark" style="width: 56px; height: 56px; font-size: 28px;">BTM</div>
            <div style="text-align: left;">
              <div style="font-family: var(--font-display); font-size: 32px; font-weight: 900; color: var(--ink-black); line-height: 1.1;">
                BEYOND THE MYTH
              </div>
              <div style="font-family: var(--font-text); font-size: 16px; font-weight: 700; color: var(--pastel-teal); letter-spacing: 0.12em; text-transform: uppercase;">
                FACTS, NOT SCAPEGOATS · EPISODE 002
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

  </div>

  <!-- Master GSAP Timeline Script -->
  <script>
    document.addEventListener("DOMContentLoaded", () => {
      window.__timelines = window.__timelines || {};
      const tl = gsap.timeline({ paused: true });
      window.__timelines["main"] = tl;

      // Initial Transforms
      tl.set("#s1-box-wrap", { x: 900 }, 0);
      tl.set("#s1-hand", { x: 500 }, 0);
      tl.set("#s1-magnifier", { scale: 0.5, rotation: -25 }, 0);

      tl.set("#s3-card-1", { x: -60, opacity: 0 }, 0);
      tl.set("#s3-card-2", { x: -60, opacity: 0 }, 0);
      tl.set("#s3-card-3", { x: -60, opacity: 0 }, 0);

      // Subtitle Synchronization
      const subtitles = [
        { start: 0.25, end: 5.41, text: 'That tiny symbol on your food? It\'s a <span class="hl-gold">certification</span>, not an <span class="hl-coral">ownership code</span>.', source: 'OU Kosher Certification (oukosher.org)' },
        { start: 5.75, end: 11.46, text: 'This is the <span class="hl-gold">O-U mark</span>. It means the product meets the Orthodox Union\'s <span class="hl-mint">kosher standards</span>.', source: 'OU Kosher Symbols Explained [S1]' },
        { start: 11.85, end: 18.45, text: 'Kosher follows Jewish dietary law. <span class="hl-mint">Inspectors check ingredients</span>, equipment, and how food is made.', source: 'What Is Kosher Certification? [S2]' },
        { start: 19.00, end: 27.62, text: 'Companies apply for certification. <span class="hl-coral">Yes, they pay fees</span>. The process includes a plant visit, an assessment, and a <span class="hl-gold">contract</span>.', source: 'Steps for Kosher Certification [S3]' },
        { start: 28.15, end: 33.05, text: 'But paying for a certification service <span class="hl-coral">doesn\'t prove</span> that Jewish people control the food industry.', source: 'Evidence-Based Public Reasoning [S3]' },
        { start: 33.70, end: 40.59, text: 'Want to know who owns a company? <span class="hl-gold">Check corporate records</span>. A dietary label answers a different question.', source: 'Corporate Filings & Public Disclosures' },
        { start: 41.20, end: 49.74, text: 'Ask hard questions. Follow the evidence. But <span class="hl-mint">hold people responsible for their actions</span>—not an entire community.', source: 'Ethical Public Accountability' },
        { start: 50.35, end: 58.58, text: 'The label belongs on the box. <span class="hl-coral">Not on an entire community</span>. Beyond the Myth. <span class="hl-gold">Facts, not scapegoats</span>.', source: 'Beyond the Myth · Facts, not scapegoats' }
      ];

      subtitles.forEach((sub) => {
        tl.call(() => {
          document.getElementById("sub-text").innerHTML = sub.text;
          document.getElementById("source-text").textContent = sub.source;
        }, null, sub.start);
      });

      // ==========================================
      // SCENE 1: 0.0s – 5.5s
      // ==========================================
      tl.set("#scene-1", { display: "flex" }, 0);
      
      // Fast box slide in from right and hand grab snap
      tl.to("#s1-box-wrap", {
        x: 0,
        duration: 0.45,
        ease: "power3.out"
      }, 0.1);

      tl.to("#s1-hand", {
        x: 0,
        duration: 0.5,
        ease: "back.out(1.2)"
      }, 0.2);

      // Subtle 3D breathing of box
      tl.to("#s1-box", {
        rotation: -2,
        y: -10,
        duration: 1.5,
        yoyo: true,
        repeat: 2,
        ease: "sine.inOut"
      }, 0.6);

      // Magnifier reveals and zooms in on OU seal
      tl.to("#s1-magnifier", {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 0.7,
        ease: "back.out(1.5)"
      }, 1.2);

      tl.to("#s1-magnifier", {
        x: -40,
        y: -30,
        duration: 1.8,
        ease: "sine.inOut"
      }, 2.0);

      // Transition out
      tl.to("#scene-1", { opacity: 0, duration: 0.35, ease: "power2.in" }, 5.15);
      tl.set("#scene-1", { display: "none" }, 5.5);

      // ==========================================
      // SCENE 2: 5.5s – 11.6s
      // ==========================================
      tl.set("#scene-2", { display: "flex", opacity: 0 }, 5.5);
      tl.to("#scene-2", { opacity: 1, duration: 0.35, ease: "power2.out" }, 5.5);

      // Transition out
      tl.to("#scene-2", { opacity: 0, duration: 0.35, ease: "power2.in" }, 11.25);
      tl.set("#scene-2", { display: "none" }, 11.6);

      // ==========================================
      // SCENE 3: 11.6s – 18.7s
      // ==========================================
      tl.set("#scene-3", { display: "flex", opacity: 0 }, 11.6);
      tl.to("#scene-3", { opacity: 1, duration: 0.35, ease: "power2.out" }, 11.6);

      // Step 1: Ingredients
      tl.to("#s3-card-1", { x: 0, opacity: 1, duration: 0.5, ease: "power2.out" }, 12.2);

      // Step 2: Equipment
      tl.to("#s3-card-2", { x: 0, opacity: 1, duration: 0.5, ease: "power2.out" }, 14.0);

      // Step 3: Process
      tl.to("#s3-card-3", { x: 0, opacity: 1, duration: 0.5, ease: "power2.out" }, 15.8);

      // Transition out
      tl.to("#scene-3", { opacity: 0, duration: 0.35, ease: "power2.in" }, 18.35);
      tl.set("#scene-3", { display: "none" }, 18.7);

      // ==========================================
      // SCENE 4: 18.7s – 27.8s
      // ==========================================
      tl.set("#scene-4", { display: "flex", opacity: 0 }, 18.7);
      tl.to("#scene-4", { opacity: 1, duration: 0.35, ease: "power2.out" }, 18.7);

      // Transition out
      tl.to("#scene-4", { opacity: 0, duration: 0.35, ease: "power2.in" }, 27.45);
      tl.set("#scene-4", { display: "none" }, 27.8);

      // ==========================================
      // SCENE 5: 27.8s – 33.3s
      // ==========================================
      tl.set("#scene-5", { display: "flex", opacity: 0 }, 27.8);
      tl.to("#scene-5", { opacity: 1, duration: 0.35, ease: "power2.out" }, 27.8);

      // Transition out
      tl.to("#scene-5", { opacity: 0, duration: 0.35, ease: "power2.in" }, 32.95);
      tl.set("#scene-5", { display: "none" }, 33.3);

      // ==========================================
      // SCENE 6: 33.3s – 40.8s
      // ==========================================
      tl.set("#scene-6", { display: "flex", opacity: 0 }, 33.3);
      tl.to("#scene-6", { opacity: 1, duration: 0.35, ease: "power2.out" }, 33.3);

      // Transition out
      tl.to("#scene-6", { opacity: 0, duration: 0.35, ease: "power2.in" }, 40.45);
      tl.set("#scene-6", { display: "none" }, 40.8);

      // ==========================================
      // SCENE 7: 40.8s – 50.0s
      // ==========================================
      tl.set("#scene-7", { display: "flex", opacity: 0 }, 40.8);
      tl.to("#scene-7", { opacity: 1, duration: 0.35, ease: "power2.out" }, 40.8);

      // Transition out
      tl.to("#scene-7", { opacity: 0, duration: 0.35, ease: "power2.in" }, 49.65);
      tl.set("#scene-7", { display: "none" }, 50.0);

      // ==========================================
      // SCENE 8: 50.0s – 60.0s
      // ==========================================
      tl.set("#scene-8", { display: "flex", opacity: 0 }, 50.0);
      tl.to("#scene-8", { opacity: 1, duration: 0.35, ease: "power2.out" }, 50.0);

      // Seamless loop glide at 59.2s
      tl.to("#scene-8 .master-card", {
        x: -1200,
        duration: 0.75,
        ease: "power3.in"
      }, 59.2);

    });
  </script>
</body>
</html>`;

const outPath = path.join(__dirname, '..', 'index.html');
fs.writeFileSync(outPath, htmlContent, 'utf8');
console.log('Successfully written master index.html, size:', (htmlContent.length / 1024).toFixed(1), 'KB');

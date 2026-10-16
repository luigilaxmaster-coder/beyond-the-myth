const fs = require('fs');
const path = require('path');

const targetHtml = path.join(__dirname, '..', 'index.html');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=1080, height=1920, initial-scale=1.0">
  <title>Beyond The Myth · Ep. 002: What That Kosher Symbol Actually Means</title>
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
      --rust-accent: #C73B30;
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

    /* Master Composition Root */
    #root {
      position: relative;
      width: 1080px;
      height: 1920px;
      overflow: hidden;
      background: var(--bg-canvas);
    }

    /* Scene Viewports */
    .scene-viewport {
      position: absolute;
      inset: 0;
      width: 1080px;
      height: 1920px;
      overflow: hidden;
      display: none;
    }

    /* Photographic Background Plates */
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

    /* Global Theatrical Spotlight Cone */
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

    /* Global Dark Ambient Vignette */
    .global-vignette {
      position: absolute;
      inset: 0;
      box-shadow: inset 0 0 160px rgba(0, 0, 0, 0.75), inset 0 -180px 140px rgba(10, 8, 15, 0.9);
      pointer-events: none;
      z-index: 6;
    }

    /* Persistent Top Show Header */
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

    /* Scene Eyebrow Banner */
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

    /* Scene Motion Graphic Content Stage */
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

    /* Tactical Cards */
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

    /* Persistent Subtitles System */
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

    .scanner-ring {
      position: absolute;
      inset: 24px;
      border-radius: 50%;
      border: 2px solid rgba(245, 197, 66, 0.35);
    }

    .scanner-corner {
      position: absolute;
      width: 36px;
      height: 36px;
      border-color: var(--gold-bright);
      border-style: solid;
    }
    .sc-tl { top: -4px; left: -4px; border-width: 4px 0 0 4px; }
    .sc-tr { top: -4px; right: -4px; border-width: 4px 4px 0 0; }
    .sc-bl { bottom: -4px; left: -4px; border-width: 0 0 4px 4px; }
    .sc-br { bottom: -4px; right: -4px; border-width: 0 4px 4px 0; }

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

    /* SCENE 2 DOSSIER */
    .dossier-header {
      display: flex;
      align-items: center;
      gap: 22px;
      border-bottom: 2px dashed rgba(42, 37, 53, 0.25);
      padding-bottom: 22px;
    }

    .ou-badge-lg {
      width: 90px;
      height: 90px;
      border-radius: 50%;
      border: 4px solid var(--ink-black);
      background: #FFFFFF;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--font-display);
      font-size: 54px;
      font-weight: 900;
      color: var(--ink-black);
      flex-shrink: 0;
    }

    .dossier-titles h2 {
      font-size: 34px;
      font-weight: 800;
      color: var(--ink-black);
      line-height: 1.2;
    }

    .dossier-titles p {
      font-family: var(--font-mono);
      font-size: 16px;
      font-weight: 700;
      color: var(--teal-accent);
      letter-spacing: 1.5px;
      margin-top: 6px;
      text-transform: uppercase;
    }

    .dossier-box {
      width: 100%;
      margin-top: 20px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .split-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .split-card {
      border-radius: 20px;
      padding: 24px 22px;
      border: 2.5px solid var(--ink-black);
      box-shadow: 4px 4px 0 var(--ink-black);
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .split-card-cert {
      background: #E8F5F1;
      border-color: var(--teal-accent);
    }

    .split-card-not {
      background: #FDF0EE;
      border-color: var(--rust-accent);
    }

    .split-title {
      font-family: var(--font-mono);
      font-size: 17px;
      font-weight: 800;
      letter-spacing: 1px;
      display: flex;
      align-items: center;
      gap: 8px;
      text-transform: uppercase;
    }

    .split-title-cert { color: var(--teal-accent); }
    .split-title-not { color: var(--rust-accent); }

    .split-desc {
      font-size: 21px;
      line-height: 1.4;
      font-weight: 600;
      color: var(--ink-dark);
    }

    /* SCENE 3 MODULES */
    .inspection-stream {
      width: 100%;
      margin-top: 10px;
      display: flex;
      flex-direction: column;
      gap: 22px;
    }

    .module-card {
      background: rgba(18, 15, 24, 0.96);
      border: 2px solid rgba(255, 255, 255, 0.25);
      border-radius: 22px;
      padding: 24px 28px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 12px 28px rgba(0,0,0,0.6);
    }

    .module-left {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .module-number {
      font-family: var(--font-mono);
      font-size: 20px;
      font-weight: 800;
      color: var(--gold-bright);
      background: rgba(245, 197, 66, 0.2);
      border: 1.5px solid var(--gold-bright);
      border-radius: 12px;
      padding: 8px 14px;
    }

    .module-info h3 {
      font-size: 28px;
      font-weight: 800;
      color: #FFFFFF;
      letter-spacing: 0.5px;
    }

    .module-info p {
      font-size: 20px;
      color: rgba(255, 255, 255, 0.85);
      margin-top: 4px;
    }

    .module-status {
      font-family: var(--font-mono);
      font-size: 16px;
      font-weight: 800;
      letter-spacing: 1.5px;
      color: #FFFFFF;
      background: var(--teal-accent);
      border: 1.5px solid #4EE0C8;
      border-radius: 30px;
      padding: 8px 20px;
      text-transform: uppercase;
      white-space: nowrap;
    }

    /* SCENE 4 CONTRACT BREAKDOWN */
    .contract-breakdown {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .contract-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 0;
      border-bottom: 1.5px dashed rgba(42, 37, 53, 0.25);
    }

    .contract-label {
      font-size: 24px;
      font-weight: 700;
      color: var(--ink-black);
    }

    .contract-detail {
      font-family: var(--font-mono);
      font-size: 19px;
      font-weight: 700;
      color: var(--teal-accent);
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
      margin-top: 10px;
      align-self: center;
    }

    /* SCENE 5 LOGIC GRID */
    .logic-grid {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 22px;
    }

    .logic-row {
      display: flex;
      align-items: flex-start;
      gap: 22px;
      padding: 24px;
      border-radius: 20px;
      border: 2.5px solid var(--ink-black);
      box-shadow: 5px 5px 0 var(--ink-black);
    }

    .logic-row-fact {
      background: #EAF4F1;
      border-color: var(--teal-accent);
    }

    .logic-row-myth {
      background: #FDF0EE;
      border-color: var(--rust-accent);
    }

    .logic-tag {
      font-family: var(--font-mono);
      font-size: 16px;
      font-weight: 800;
      letter-spacing: 1.5px;
      padding: 6px 14px;
      border-radius: 10px;
      text-transform: uppercase;
      white-space: nowrap;
      margin-top: 2px;
    }

    .logic-tag-fact {
      background: var(--teal-accent);
      color: #FFFFFF;
    }

    .logic-tag-myth {
      background: var(--rust-accent);
      color: #FFFFFF;
    }

    .logic-text h4 {
      font-size: 26px;
      font-weight: 800;
      color: var(--ink-black);
      line-height: 1.25;
    }

    .logic-text p {
      font-size: 20px;
      color: var(--ink-muted);
      margin-top: 6px;
      line-height: 1.35;
    }

    /* SCENE 6 RECORDS PANEL */
    .records-panel {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 22px;
    }

    .filing-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid rgba(255, 255, 255, 0.25);
      padding-bottom: 14px;
    }

    .filing-title {
      font-family: var(--font-mono);
      font-size: 18px;
      font-weight: 700;
      letter-spacing: 2px;
      color: var(--gold-bright);
      text-transform: uppercase;
    }

    .filing-badge {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 8px;
      padding: 4px 12px;
      font-family: var(--font-mono);
      font-size: 15px;
      color: #FFFFFF;
    }

    .chart-breakdown {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .chart-bar-item {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .bar-meta {
      display: flex;
      justify-content: space-between;
      font-size: 20px;
      font-weight: 700;
      color: #FFFFFF;
    }

    .bar-track {
      width: 100%;
      height: 18px;
      background: rgba(255, 255, 255, 0.15);
      border-radius: 9px;
      overflow: hidden;
      position: relative;
    }

    .bar-fill {
      height: 100%;
      border-radius: 9px;
    }

    .bf-blue { background: #4C84F3; width: 42%; }
    .bf-green { background: #34A853; width: 38%; }
    .bf-amber { background: #FBBC05; width: 12%; }
    .bf-gray { background: #9AA0A6; width: 8%; }

    /* SCENE 7 PRINCIPLES */
    .accountability-stack {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 22px;
    }

    .principle-card {
      background: var(--paper-cream);
      border-radius: 24px;
      border: 3.5px solid var(--ink-black);
      box-shadow: 6px 6px 0 var(--ink-black);
      padding: 28px 32px;
      display: flex;
      align-items: flex-start;
      gap: 20px;
    }

    .principle-icon {
      font-size: 36px;
      line-height: 1;
      margin-top: 4px;
    }

    .principle-text h4 {
      font-size: 28px;
      font-weight: 800;
      color: var(--ink-black);
    }

    .principle-text p {
      font-size: 21px;
      color: var(--ink-muted);
      margin-top: 6px;
      line-height: 1.35;
    }

    /* SCENE 8 CLOSING */
    .closing-card {
      width: 100%;
      background: rgba(20, 17, 28, 0.96);
      border: 3.5px solid var(--gold-bright);
      border-radius: 28px;
      box-shadow: 10px 10px 0 rgba(0, 0, 0, 0.8), 0 20px 50px rgba(0,0,0,0.8);
      padding: 44px 38px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 26px;
    }

    .closing-pill {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: rgba(245, 197, 66, 0.15);
      border: 1.5px solid var(--gold-bright);
      border-radius: 20px;
      padding: 8px 24px;
      font-family: var(--font-mono);
      font-size: 16px;
      font-weight: 800;
      color: var(--gold-bright);
      letter-spacing: 2px;
      text-transform: uppercase;
    }

    .closing-headline {
      font-size: 46px;
      font-weight: 900;
      line-height: 1.22;
      letter-spacing: -0.5px;
      color: #FFFFFF;
    }

    .closing-divider {
      width: 100px;
      height: 3px;
      background: var(--gold-bright);
      border-radius: 2px;
    }

    .closing-brand-row {
      display: flex;
      align-items: center;
      gap: 18px;
    }

    .closing-brand-badge {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: var(--gold-bright);
      color: var(--ink-black);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 26px;
      font-weight: 900;
      box-shadow: 0 4px 14px rgba(245, 197, 66, 0.5);
    }

    .closing-brand-info {
      text-align: left;
    }

    .closing-brand-title {
      font-family: var(--font-display);
      font-size: 24px;
      font-weight: 800;
      color: #FFFFFF;
      letter-spacing: 1.5px;
      text-transform: uppercase;
    }

    .closing-brand-sub {
      font-family: var(--font-mono);
      font-size: 15px;
      font-weight: 700;
      color: var(--gold-bright);
      letter-spacing: 2px;
      text-transform: uppercase;
    }
  </style>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
</head>
<body>
  <div id="root" data-composition-id="main" data-width="1080" data-height="1920" data-layout-allow-overflow="true">
    <!-- Theatrical Spotlight Cone -->
    <div class="theatrical-spotlight" data-layout-allow-overlap="true"></div>
    <div class="global-vignette" data-layout-allow-overlap="true"></div>

    <!-- Top Show Header -->
    <header class="show-header" data-layout-allow-overlap="true">
      <div class="brand-pill">
        <div class="pulse-dot"></div>
        <span class="brand-name">Beyond The Myth</span>
        <span class="brand-tagline">Civic Knowledge · Evidence Over Rumor</span>
      </div>
    </header>

    <!-- Eyebrow Banner (Dynamic Text) -->
    <div class="scene-eyebrow" data-layout-allow-overlap="true">
      <div class="eyebrow-chip" id="eyebrow-chip">
        <span class="eyebrow-icon" id="eyebrow-icon">✦</span>
        <span class="eyebrow-text" id="eyebrow-text">CERTIFICATION ≠ OWNERSHIP</span>
      </div>
    </div>

    <!-- ==================== SCENE 1 (0.0s - 5.5s) ==================== -->
    <section class="scene-viewport" id="scene-1" data-layout-allow-overlap="true">
      <div class="plate-container">
        <img class="plate-img" id="plate-1" src="assets/images/scene_1_macro.jpg" alt="Macro Cereal Box with Kosher Seal">
      </div>

      <!-- HUD Reticle targeting the seal -->
      <div class="hud-scanner" id="hud-1" data-layout-allow-overlap="true">
        <div class="scanner-ring"></div>
        <div class="scanner-corner sc-tl"></div>
        <div class="scanner-corner sc-tr"></div>
        <div class="scanner-corner sc-bl"></div>
        <div class="scanner-corner sc-br"></div>
        <div class="scanner-target-badge" data-layout-allow-occlusion="true">
          <span>TARGET: OFFICIAL OU KOSHER MARK</span>
          <span style="color:#FFD452;">● DIETARY SEAL</span>
        </div>
      </div>
    </section>

    <!-- ==================== SCENE 2 (5.5s - 11.6s) ==================== -->
    <section class="scene-viewport" id="scene-2" data-layout-allow-overlap="true">
      <div class="plate-container">
        <img class="plate-img" id="plate-2" src="assets/images/scene_2_maya.jpg" alt="Maya Shopper Examining Box">
      </div>

      <div class="scene-content">
        <div class="tactical-card" id="card-2" data-layout-allow-overlap="true">
          <div class="dossier-header">
            <div class="ou-badge-lg">Ⓤ</div>
            <div class="dossier-titles">
              <h2>The Orthodox Union Mark</h2>
              <p>Founded 1898 · Independent Non-Profit Certifier</p>
            </div>
          </div>
          <div class="dossier-box">
            <div class="split-grid">
              <div class="split-card split-card-cert">
                <div class="split-title split-title-cert">✓ What it Certifies</div>
                <div class="split-desc">Confirms food recipe conforms strictly to kosher dietary law.</div>
              </div>
              <div class="split-card split-card-not">
                <div class="split-title split-title-not">✗ What it Does Not Do</div>
                <div class="split-desc">Carries zero corporate stock, board control, or company ownership.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== SCENE 3 (11.6s - 18.7s) ==================== -->
    <section class="scene-viewport" id="scene-3" data-layout-allow-overlap="true">
      <div class="plate-container">
        <img class="plate-img" id="plate-3" src="assets/images/scene_3_factory.jpg" alt="Industrial Food Inspection">
      </div>

      <div class="scene-content">
        <div class="inspection-stream">
          <div class="module-card" id="mod-3a" data-layout-allow-overlap="true">
            <div class="module-left">
              <span class="module-number">01</span>
              <div class="module-info">
                <h3>Ingredients Inspection</h3>
                <p>Auditing raw grains, flavorings, and sweeteners</p>
              </div>
            </div>
            <span class="module-status">✓ VERIFIED</span>
          </div>

          <div class="module-card" id="mod-3b" data-layout-allow-overlap="true">
            <div class="module-left">
              <span class="module-number">02</span>
              <div class="module-info">
                <h3>Equipment Sanitation</h3>
                <p>Ensuring dedicated stainless machinery & thermal lines</p>
              </div>
            </div>
            <span class="module-status">✓ INSPECTED</span>
          </div>

          <div class="module-card" id="mod-3c" data-layout-allow-overlap="true">
            <div class="module-left">
              <span class="module-number">03</span>
              <div class="module-info">
                <h3>Production Process</h3>
                <p>Supervising batch manufacturing for dietary integrity</p>
              </div>
            </div>
            <span class="module-status">✓ SUPERVISED</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== SCENE 4 (18.7s - 27.8s) ==================== -->
    <section class="scene-viewport" id="scene-4" data-layout-allow-overlap="true">
      <div class="plate-container">
        <img class="plate-img" id="plate-4" src="assets/images/scene_4_contract.jpg" alt="Contract and Fees Schedule">
      </div>

      <div class="scene-content">
        <div class="tactical-card" id="card-4" data-layout-allow-overlap="true">
          <div class="dossier-header">
            <div class="dossier-titles">
              <h2>Schedule B: Service Fee Transparency</h2>
              <p>Transparent Audit & Inspection Agreement</p>
            </div>
          </div>
          <div class="contract-breakdown">
            <div class="contract-row">
              <span class="contract-label">1. Plant On-Site Visit</span>
              <span class="contract-detail">Auditor travel & time</span>
            </div>
            <div class="contract-row">
              <span class="contract-label">2. Technical Assessment</span>
              <span class="contract-detail">Lab review & evaluation</span>
            </div>
            <div class="contract-row">
              <span class="contract-label">3. Annual Supervised License</span>
              <span class="contract-detail">Ongoing audit services</span>
            </div>
            <div class="stamp-equity">
              <span>★ ZERO EQUITY · DIRECT AUDIT LABOR ONLY ★</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== SCENE 5 (27.8s - 33.3s) ==================== -->
    <section class="scene-viewport" id="scene-5" data-layout-allow-overlap="true">
      <div class="plate-container">
        <img class="plate-img" id="plate-5" src="assets/images/scene_5_market.jpg" alt="Normal Food Market Commerce">
      </div>

      <div class="scene-content">
        <div class="tactical-card" id="card-5" data-layout-allow-overlap="true">
          <div class="logic-grid">
            <div class="logic-row logic-row-fact">
              <span class="logic-tag logic-tag-fact">Commercial Reality</span>
              <div class="logic-text">
                <h4>Fee-for-Service Inspection</h4>
                <p>Paying an external auditor for dietary verification is standard commerce, just like Organic, Non-GMO, or Fair Trade.</p>
              </div>
            </div>
            <div class="logic-row logic-row-myth">
              <span class="logic-tag logic-tag-myth">Conspiracy Fallacy</span>
              <div class="logic-text">
                <h4>False Leap of Collective Control</h4>
                <p>Claiming that paying an inspection fee proves that Jewish people control or own the food industry is an unfounded leap.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== SCENE 6 (33.3s - 40.8s) ==================== -->
    <section class="scene-viewport" id="scene-6" data-layout-allow-overlap="true">
      <div class="plate-container">
        <img class="plate-img" id="plate-6" src="assets/images/scene_6_tablet.jpg" alt="SEC Filing Tablet & Box">
      </div>

      <div class="scene-content">
        <div class="tactical-card card-dark" id="card-6" data-layout-allow-overlap="true">
          <div class="records-panel">
            <div class="filing-header">
              <span class="filing-title">SEC Form 10-K · Public Ownership Breakdown</span>
              <span class="filing-badge">OFFICIAL DISCLOSURE</span>
            </div>
            <div class="chart-breakdown">
              <div class="chart-bar-item">
                <div class="bar-meta">
                  <span>Institutional & Index Funds (Vanguard, BlackRock)</span>
                  <span class="hl-gold">42%</span>
                </div>
                <div class="bar-track"><div class="bar-fill bf-blue"></div></div>
              </div>
              <div class="chart-bar-item">
                <div class="bar-meta">
                  <span>Public Shareholders & Retail Investors</span>
                  <span class="hl-teal">38%</span>
                </div>
                <div class="bar-track"><div class="bar-fill bf-green"></div></div>
              </div>
              <div class="chart-bar-item">
                <div class="bar-meta">
                  <span>Corporate Insiders & Management</span>
                  <span class="hl-gold">12%</span>
                </div>
                <div class="bar-track"><div class="bar-fill bf-amber"></div></div>
              </div>
              <div class="chart-bar-item">
                <div class="bar-meta">
                  <span>Other Public Trusts & Funds</span>
                  <span>8%</span>
                </div>
                <div class="bar-track"><div class="bar-fill bf-gray"></div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== SCENE 7 (40.8s - 50.0s) ==================== -->
    <section class="scene-viewport" id="scene-7" data-layout-allow-overlap="true">
      <div class="plate-container">
        <img class="plate-img" id="plate-7" src="assets/images/scene_7_cart.jpg" alt="Supermarket Aisle Human Empathy">
      </div>

      <div class="scene-content">
        <div class="accountability-stack">
          <div class="principle-card" id="prin-7a" data-layout-allow-overlap="true">
            <div class="principle-icon" style="color:var(--teal-accent);">✓</div>
            <div class="principle-text">
              <h4>Hold Decision-Makers Accountable</h4>
              <p>Scrutinize executive choices, verify corporate filings, and challenge real policy through evidence.</p>
            </div>
          </div>

          <div class="principle-card" id="prin-7b" data-layout-allow-overlap="true">
            <div class="principle-icon" style="color:var(--rust-accent);">✗</div>
            <div class="principle-text">
              <h4>Reject Collective Scapegoating</h4>
              <p>Blaming an entire religious group for food prices or corporate actions is prejudice, not critical thinking.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== SCENE 8 (50.0s - 60.0s) ==================== -->
    <section class="scene-viewport" id="scene-8" data-layout-allow-overlap="true">
      <div class="plate-container">
        <img class="plate-img" id="plate-8" src="assets/images/scene_8_closing.jpg" alt="Dramatic Studio Closing">
      </div>

      <div class="scene-content">
        <div class="closing-card" id="closing-box" data-layout-allow-overlap="true">
          <div class="closing-pill">EVIDENTIARY VERDICT</div>
          <div class="closing-headline">
            "THE LABEL BELONGS ON THE BOX.<br>
            <span class="hl-gold">NOT ON AN ENTIRE COMMUNITY."</span>
          </div>
          <div class="closing-divider"></div>
          <div class="closing-brand-row">
            <div class="closing-brand-badge">BTM</div>
            <div class="closing-brand-info">
              <div class="closing-brand-title">Beyond The Myth</div>
              <div class="closing-brand-sub">Facts, not scapegoats.</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Persistent Subtitles & Sources Layer -->
    <footer class="subtitles-container" data-layout-allow-overlap="true">
      <div class="subtitles-card">
        <p class="subtitles-text" id="subtitles-text">That tiny symbol on your food? It's a <span class='hl-gold'>certification</span>, not an <span class='hl-coral'>ownership code</span>.</p>
      </div>
      <div class="source-tag">
        <span class="source-bullet"></span>
        <span id="source-text">OU KOSHER CERTIFICATION (OUKOSHER.ORG)</span>
      </div>
    </footer>
  </div>

  <script>
    // Subtitles and Scenes Timeline Definition
    const sceneCues = [
      {
        id: 1,
        start: 0.0,
        end: 5.5,
        eyebrow: "CERTIFICATION ≠ OWNERSHIP",
        icon: "✦",
        text: "That tiny symbol on your food? It's a <span class='hl-gold'>certification</span>, not an <span class='hl-coral'>ownership code</span>.",
        source: "OU Kosher Certification (oukosher.org)"
      },
      {
        id: 2,
        start: 5.5,
        end: 11.6,
        eyebrow: "OU · KOSHER CERTIFICATION",
        icon: "Ⓤ",
        text: "This is the <span class='hl-gold'>O-U mark</span>. It means the product meets the <span class='hl-teal'>Orthodox Union's</span> kosher standards.",
        source: "OU Kosher Symbols Explained [S1]"
      },
      {
        id: 3,
        start: 11.6,
        end: 18.7,
        eyebrow: "INGREDIENTS → EQUIPMENT → PROCESS",
        icon: "⚙",
        text: "Kosher follows Jewish dietary law. Inspectors check <span class='hl-teal'>ingredients</span>, <span class='hl-gold'>equipment</span>, and <span class='hl-teal'>how food is made</span>.",
        source: "What Is Kosher Certification? [S2]"
      },
      {
        id: 4,
        start: 18.7,
        end: 27.8,
        eyebrow: "APPLICATION → REVIEW → CONTRACT",
        icon: "📄",
        text: "Companies apply for certification. <span class='hl-gold'>Yes, they pay fees</span>. The process includes a plant visit, an assessment, and a contract.",
        source: "Steps for Kosher Certification [S3]"
      },
      {
        id: 5,
        start: 27.8,
        end: 33.3,
        eyebrow: "CERTIFICATION ≠ COLLECTIVE CONTROL",
        icon: "⚖",
        text: "But paying for a certification service <span class='hl-coral'>doesn't prove</span> that Jewish people control the food industry.",
        source: "Evidence-Based Public Reasoning [S3]"
      },
      {
        id: 6,
        start: 33.3,
        end: 40.8,
        eyebrow: "OWNERSHIP? → COMPANY RECORDS",
        icon: "📊",
        text: "Want to know who owns a company? <span class='hl-teal'>Check its corporate records</span>. A dietary label answers a different question.",
        source: "Corporate Filings & SEC Disclosures"
      },
      {
        id: 7,
        start: 40.8,
        end: 50.0,
        eyebrow: "EVIDENCE. NOT COLLECTIVE BLAME.",
        icon: "🔍",
        text: "Ask hard questions. Follow the evidence. But <span class='hl-gold'>hold people responsible for their actions</span>—not an entire community for its identity.",
        source: "Ethical Public Accountability"
      },
      {
        id: 8,
        start: 50.0,
        end: 60.0,
        eyebrow: "BEYOND THE MYTH · FACTS, NOT SCAPEGOATS",
        icon: "✦",
        text: "The label belongs on the box. <span class='hl-gold'>Not on an entire community</span>. Beyond the Myth. Facts, not scapegoats.",
        source: "Beyond the Myth · Facts, not scapegoats"
      }
    ];

    // HYPERFRAMES COMPOSITION TIMELINE REGISTRATION
    window.__timelines = window.__timelines || {};
    const tl = gsap.timeline({ paused: true });
    window.__timelines["main"] = tl;

    // Initial visual states
    for (let i = 1; i <= 8; i++) {
      gsap.set(\`#scene-\${i}\`, { display: "none", opacity: 0 });
    }

    // Initial card states
    gsap.set("#hud-1", { scale: 0.85, opacity: 0 });
    gsap.set("#card-2", { y: 60, opacity: 0 });
    gsap.set(["#mod-3a", "#mod-3b", "#mod-3c"], { x: -50, opacity: 0 });
    gsap.set("#card-4", { y: 60, opacity: 0 });
    gsap.set("#card-5", { y: 60, opacity: 0 });
    gsap.set("#card-6", { y: 60, opacity: 0 });
    gsap.set(["#prin-7a", "#prin-7b"], { x: 50, opacity: 0 });
    gsap.set("#closing-box", { scale: 0.9, opacity: 0 });

    // SCENE 1 (0.0s - 5.5s)
    tl.set("#scene-1", { display: "block", opacity: 1 }, 0.0);
    tl.call(() => updateMetadata(1), null, 0.0);

    tl.to("#hud-1", {
      scale: 1,
      opacity: 1,
      duration: 0.8,
      ease: "back.out(1.5)"
    }, 0.3);

    tl.fromTo("#plate-1", 
      { scale: 1.0 }, 
      { scale: 1.08, duration: 5.5, ease: "none" }, 
      0.0
    );

    // SCENE 2 (5.5s - 11.6s)
    tl.to("#scene-1", { opacity: 0, duration: 0.35 }, 5.15);
    tl.set("#scene-1", { display: "none" }, 5.5);
    tl.set("#scene-2", { display: "block", opacity: 0 }, 5.5);
    tl.to("#scene-2", { opacity: 1, duration: 0.35 }, 5.5);
    tl.call(() => updateMetadata(2), null, 5.5);

    tl.to("#card-2", {
      y: 0,
      opacity: 1,
      duration: 0.7,
      ease: "power3.out"
    }, 5.7);

    tl.fromTo("#plate-2", 
      { scale: 1.0 }, 
      { scale: 1.07, duration: 6.1, ease: "none" }, 
      5.5
    );

    // SCENE 3 (11.6s - 18.7s)
    tl.to("#scene-2", { opacity: 0, duration: 0.35 }, 11.25);
    tl.set("#scene-2", { display: "none" }, 11.6);
    tl.set("#scene-3", { display: "block", opacity: 0 }, 11.6);
    tl.to("#scene-3", { opacity: 1, duration: 0.35 }, 11.6);
    tl.call(() => updateMetadata(3), null, 11.6);

    tl.to("#mod-3a", { x: 0, opacity: 1, duration: 0.5, ease: "power2.out" }, 12.0);
    tl.to("#mod-3b", { x: 0, opacity: 1, duration: 0.5, ease: "power2.out" }, 13.8);
    tl.to("#mod-3c", { x: 0, opacity: 1, duration: 0.5, ease: "power2.out" }, 15.6);

    tl.fromTo("#plate-3", 
      { scale: 1.0 }, 
      { scale: 1.07, duration: 7.1, ease: "none" }, 
      11.6
    );

    // SCENE 4 (18.7s - 27.8s)
    tl.to("#scene-3", { opacity: 0, duration: 0.35 }, 18.35);
    tl.set("#scene-3", { display: "none" }, 18.7);
    tl.set("#scene-4", { display: "block", opacity: 0 }, 18.7);
    tl.to("#scene-4", { opacity: 1, duration: 0.35 }, 18.7);
    tl.call(() => updateMetadata(4), null, 18.7);

    tl.to("#card-4", {
      y: 0,
      opacity: 1,
      duration: 0.7,
      ease: "power3.out"
    }, 19.0);

    tl.fromTo("#plate-4", 
      { scale: 1.0 }, 
      { scale: 1.07, duration: 9.1, ease: "none" }, 
      18.7
    );

    // SCENE 5 (27.8s - 33.3s)
    tl.to("#scene-4", { opacity: 0, duration: 0.35 }, 27.45);
    tl.set("#scene-4", { display: "none" }, 27.8);
    tl.set("#scene-5", { display: "block", opacity: 0 }, 27.8);
    tl.to("#scene-5", { opacity: 1, duration: 0.35 }, 27.8);
    tl.call(() => updateMetadata(5), null, 27.8);

    tl.to("#card-5", {
      y: 0,
      opacity: 1,
      duration: 0.7,
      ease: "power3.out"
    }, 28.1);

    tl.fromTo("#plate-5", 
      { scale: 1.0 }, 
      { scale: 1.07, duration: 5.5, ease: "none" }, 
      27.8
    );

    // SCENE 6 (33.3s - 40.8s)
    tl.to("#scene-5", { opacity: 0, duration: 0.35 }, 32.95);
    tl.set("#scene-5", { display: "none" }, 33.3);
    tl.set("#scene-6", { display: "block", opacity: 0 }, 33.3);
    tl.to("#scene-6", { opacity: 1, duration: 0.35 }, 33.3);
    tl.call(() => updateMetadata(6), null, 33.3);

    tl.to("#card-6", {
      y: 0,
      opacity: 1,
      duration: 0.7,
      ease: "power3.out"
    }, 33.6);

    tl.fromTo("#plate-6", 
      { scale: 1.0 }, 
      { scale: 1.07, duration: 7.5, ease: "none" }, 
      33.3
    );

    // SCENE 7 (40.8s - 50.0s)
    tl.to("#scene-6", { opacity: 0, duration: 0.35 }, 40.45);
    tl.set("#scene-6", { display: "none" }, 40.8);
    tl.set("#scene-7", { display: "block", opacity: 0 }, 40.8);
    tl.to("#scene-7", { opacity: 1, duration: 0.35 }, 40.8);
    tl.call(() => updateMetadata(7), null, 40.8);

    tl.to("#prin-7a", { x: 0, opacity: 1, duration: 0.6, ease: "power2.out" }, 41.2);
    tl.to("#prin-7b", { x: 0, opacity: 1, duration: 0.6, ease: "power2.out" }, 44.5);

    tl.fromTo("#plate-7", 
      { scale: 1.0 }, 
      { scale: 1.07, duration: 9.2, ease: "none" }, 
      40.8
    );

    // SCENE 8 (50.0s - 60.0s)
    tl.to("#scene-7", { opacity: 0, duration: 0.35 }, 49.65);
    tl.set("#scene-7", { display: "none" }, 50.0);
    tl.set("#scene-8", { display: "block", opacity: 0 }, 50.0);
    tl.to("#scene-8", { opacity: 1, duration: 0.35 }, 50.0);
    tl.call(() => updateMetadata(8), null, 50.0);

    tl.to("#closing-box", {
      scale: 1,
      opacity: 1,
      duration: 0.8,
      ease: "back.out(1.2)"
    }, 50.3);

    tl.fromTo("#plate-8", 
      { scale: 1.0 }, 
      { scale: 1.06, duration: 10.0, ease: "none" }, 
      50.0
    );

    // Lateral slide out at 59.2s for seamless loop
    tl.to("#root", {
      x: -1080,
      duration: 0.8,
      ease: "power2.in"
    }, 59.2);

    function updateMetadata(sceneIndex) {
      const cue = sceneCues[sceneIndex - 1];
      if (cue) {
        const ebText = document.getElementById("eyebrow-text");
        const ebIcon = document.getElementById("eyebrow-icon");
        const subText = document.getElementById("subtitles-text");
        const srcText = document.getElementById("source-text");
        if (ebText) ebText.innerText = cue.eyebrow;
        if (ebIcon) ebIcon.innerText = cue.icon;
        if (subText) subText.innerHTML = cue.text;
        if (srcText) srcText.innerText = cue.source;
      }
    }
  </script>
</body>
</html>
`;

fs.writeFileSync(targetHtml, htmlContent, 'utf8');
console.log('Successfully updated index.html:', fs.statSync(targetHtml).size, 'bytes');

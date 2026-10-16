const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '..');
const formaCode = fs.readFileSync(path.join(baseDir, 'beyond_the_myth_ep002', 'assets', 'forma-core.js'), 'utf8');

global.window = global;
global.document = { createElementNS: () => ({}) };
eval(formaCode);

function getAssetSvg(id, options = {}) {
  const asset = FORMA.catalog.find(a => a.id === id || a.id.startsWith(id));
  if (!asset) {
    console.warn('Asset not found:', id);
    return `<svg viewBox="0 0 1080 1080" width="${options.width || 1080}" height="${options.height || 1080}"><rect width="100%" height="100%" fill="#EAE3D2"/></svg>`;
  }
  let svg = FORMA.renderMarkup(asset, options);
  svg = svg.replace(/data-layer=/g, 'data-scene-layer=');
  return svg;
}

// Visual Scenarios and Props mapping per episode
const EPISODE_META = [
  {
    id: "ep001",
    num: "01",
    title: "What That Kosher Symbol Actually Means",
    tagline: "CERTIFICATION ≠ OWNERSHIP",
    hero_badge: "KOSHER CERTIFICATION MARK",
    scenarios: ['escenarios-mercado-01', 'escenarios-laboratorio-01', 'escenarios-investigacion-01'],
    palette: 'editorial',
    color_accent: '#E8A825',
    color_mint: '#2A8C7D',
    color_rust: '#C73B30'
  },
  {
    id: "ep002",
    num: "02",
    title: "A Real Screenshot Can Still Mislead You",
    tagline: "REAL IMAGE · MISSING CONTEXT",
    hero_badge: "DIGITAL LATERAL READING",
    scenarios: ['escenarios-investigacion-01', 'escenarios-oficina-01', 'escenarios-calle-01'],
    palette: 'aurora',
    color_accent: '#BEB5E7',
    color_mint: '#70C4B8',
    color_rust: '#E06D53'
  },
  {
    id: "ep003",
    num: "03",
    title: "Who Actually Makes Fed Decisions?",
    tagline: "FOLLOW THE INSTITUTIONAL PROCESS",
    hero_badge: "FEDERAL RESERVE GOVERNANCE",
    scenarios: ['escenarios-auditorio-01', 'escenarios-oficina-01', 'escenarios-calle-01'],
    palette: 'oceano',
    color_accent: '#F2D78D',
    color_mint: '#2B6D7A',
    color_rust: '#C74B34'
  },
  {
    id: "ep004",
    num: "04",
    title: "A List of CEOs Is Not an Ownership Map",
    tagline: "NAMES AREN'T A CONTROL MAP",
    hero_badge: "CORPORATE GOVERNANCE & SEC EDGAR",
    scenarios: ['escenarios-oficina-01', 'escenarios-biblioteca-01', 'escenarios-investigacion-01'],
    palette: 'editorial',
    color_accent: '#E5A836',
    color_mint: '#2E8B57',
    color_rust: '#BA2D27'
  },
  {
    id: "ep005",
    num: "05",
    title: "Can You Be Jewish Without Being Religious?",
    tagline: "IDENTITY ISN'T A CHECKBOX",
    hero_badge: "PEW RESEARCH 2020 STUDY",
    scenarios: ['escenarios-comedor-01', 'escenarios-plaza-01', 'escenarios-sinagoga-01'],
    palette: 'melocoton',
    color_accent: '#F4A69B',
    color_mint: '#AED7C7',
    color_rust: '#D4553B'
  },
  {
    id: "ep006",
    num: "06",
    title: "The Antisemitic Forgery That Copied Another Book",
    tagline: "THE 'PROOF' WAS PLAGIARIZED",
    hero_badge: "DOCUMENTARY EXPOSÉ · 1903 FORGERY",
    scenarios: ['escenarios-biblioteca-01', 'escenarios-investigacion-01', 'escenarios-museo-01'],
    palette: 'editorial',
    color_accent: '#E8A825',
    color_mint: '#2A8C7D',
    color_rust: '#BA2D27'
  },
  {
    id: "ep007",
    num: "07",
    title: "Criticize the Policy. Don’t Blame Your Classmate.",
    tagline: "POLICY CRITIQUE ≠ COLLECTIVE GUILT",
    hero_badge: "ETHICAL PUBLIC REASONING",
    scenarios: ['escenarios-aula-01', 'escenarios-calle-01', 'escenarios-plaza-01'],
    palette: 'aurora',
    color_accent: '#ABD1E8',
    color_mint: '#AED7C7',
    color_rust: '#F4A69B'
  },
  {
    id: "ep008",
    num: "08",
    title: "The Catholic Document That Rejects Collective Blame",
    tagline: "WHAT THE VATICAN ACTUALLY WROTE",
    hero_badge: "NOSTRA AETATE · SECTION 4 (1965)",
    scenarios: ['escenarios-catedral-01', 'escenarios-biblioteca-01', 'escenarios-oficina-01'],
    palette: 'editorial',
    color_accent: '#F2D78D',
    color_mint: '#3B828E',
    color_rust: '#C73B30'
  },
  {
    id: "ep009",
    num: "09",
    title: "The Spy Case That Convicted the Wrong Man",
    tagline: "WRONGLY CONVICTED · PROVEN INNOCENT",
    hero_badge: "ALFRED DREYFUS HISTORICAL DOSSIER",
    scenarios: ['escenarios-museo-01', 'escenarios-oficina-01', 'escenarios-biblioteca-01'],
    palette: 'oceano',
    color_accent: '#D69424',
    color_mint: '#2B6D7A',
    color_rust: '#C74B34'
  },
  {
    id: "ep010",
    num: "10",
    title: "Before You Share That Claim, Ask These 3 Questions",
    tagline: "3 QUESTIONS BEFORE YOU SHARE",
    hero_badge: "SOURCE VERIFICATION METHODOLOGY",
    scenarios: ['escenarios-investigacion-01', 'escenarios-estudio-01', 'escenarios-oficina-01'],
    palette: 'editorial',
    color_accent: '#F2D78D',
    color_mint: '#AED7C7',
    color_rust: '#F4A69B'
  }
];

function generateCompositionHtml(ep, subData) {
  const scenes = subData.scenes;

  // Extract Vector Scenarios
  const sc1Svg = getAssetSvg(ep.scenarios[0] || 'escenarios-mercado-01', { instance: `${ep.id}-bg1`, paletteName: ep.palette, width: 1080 });
  const sc2Svg = getAssetSvg(ep.scenarios[1] || 'escenarios-oficina-01', { instance: `${ep.id}-bg2`, paletteName: ep.palette, width: 1080 });
  const sc3Svg = getAssetSvg(ep.scenarios[2] || 'escenarios-investigacion-01', { instance: `${ep.id}-bg3`, paletteName: ep.palette, width: 1080 });

  // Extract Vector Personas with data-parts intact
  const mayaExplain = getAssetSvg('personas-investigadora-02', { instance: `${ep.id}-maya-exp`, paletteName: 'editorial', width: 440 });
  const mayaPoint = getAssetSvg('personas-investigadora-03', { instance: `${ep.id}-maya-pnt`, paletteName: 'editorial', width: 440 });
  const mayaRead = getAssetSvg('personas-investigadora-04', { instance: `${ep.id}-maya-read`, paletteName: 'editorial', width: 440 });
  const mayaListen = getAssetSvg('personas-investigadora-10', { instance: `${ep.id}-maya-lis`, paletteName: 'editorial', width: 440 });

  const alexExplain = getAssetSvg('personas-periodista-02', { instance: `${ep.id}-alex-exp`, paletteName: 'aurora', width: 440 });
  const alexPoint = getAssetSvg('personas-periodista-03', { instance: `${ep.id}-alex-pnt`, paletteName: 'aurora', width: 440 });
  const alexRead = getAssetSvg('personas-periodista-04', { instance: `${ep.id}-alex-read`, paletteName: 'aurora', width: 440 });
  const alexListen = getAssetSvg('personas-periodista-10', { instance: `${ep.id}-alex-lis`, paletteName: 'aurora', width: 440 });

  // Build the 7 scene cards content
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=1080, height=1920, initial-scale=1.0">
  <title>Beyond The Myth · Ep. ${ep.num}: ${ep.title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
  <style>
    :root {
      --bg-canvas: #0E0C14;
      --paper-cream: #FFF4E8;
      --ink-black: #1E1A2B;
      --ink-dark: #2B2538;
      --ink-muted: #5A526B;
      
      --pastel-coral: #F4A69B;
      --pastel-lavender: #BEB5E7;
      --pastel-mint: #AED7C7;
      --pastel-sky: #ABD1E8;
      --pastel-butter: #F2D78D;
      --gold-bright: #F5C542;
      --rust-accent: #B3261E;
      --teal-accent: #1E5C56;
      
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
      -webkit-font-smoothing: antialiased;
    }

    #root {
      position: relative;
      width: 1080px;
      height: 1920px;
      overflow: hidden;
      background: #0D0B12;
    }

    /* Ambient Scenic Backdrop Views */
    .scenic-container {
      position: absolute;
      inset: 0;
      width: 1080px;
      height: 1920px;
      overflow: hidden;
      z-index: 1;
      opacity: 0.88;
    }

    .scenic-plate {
      position: absolute;
      inset: 0;
      width: 1080px;
      height: 1920px;
      opacity: 0;
      display: none;
    }

    .scenic-plate svg {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    /* Tactile Paper Texture Overlay */
    .texture-paper {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 95;
      opacity: 0.28;
      mix-blend-mode: multiply;
      background-image: radial-gradient(circle at 50% 30%, transparent 45%, rgba(30, 26, 43, 0.14) 100%),
                        linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px);
      background-size: 100% 100%, 6px 6px, 6px 6px;
    }

    /* Theatrical Spotlight Cone */
    .theatrical-spotlight {
      position: absolute;
      top: -80px;
      left: 140px;
      width: 800px;
      height: 2040px;
      background: linear-gradient(180deg, rgba(245, 197, 66, 0.18) 0%, rgba(245, 197, 66, 0.06) 50%, rgba(0,0,0,0) 100%);
      clip-path: polygon(30% 0%, 70% 0%, 98% 100%, 2% 100%);
      pointer-events: none;
      z-index: 50;
      mix-blend-mode: screen;
    }

    /* Persistent Top Editorial Header */
    .header-bar {
      position: absolute;
      top: 60px;
      left: 60px;
      right: 60px;
      height: 84px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 70;
    }

    .brand-pill {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      background: var(--paper-cream);
      color: var(--ink-black);
      padding: 10px 22px;
      border-radius: 999px;
      border: 3.5px solid var(--ink-black);
      box-shadow: 6px 6px 0 var(--ink-black);
      font-size: 21px;
      font-weight: 800;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }

    .brand-pill .dot {
      width: 14px;
      height: 14px;
      background: var(--gold-bright);
      border-radius: 50%;
      border: 2px solid var(--ink-black);
    }

    .source-badge {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: rgba(22, 18, 30, 0.94);
      color: var(--paper-cream);
      padding: 10px 22px;
      border-radius: 999px;
      border: 3px solid rgba(255, 244, 232, 0.25);
      font-family: var(--font-mono);
      font-size: 19px;
      font-weight: 600;
      letter-spacing: 0.02em;
    }

    /* Main Editorial Stage Container */
    .stage {
      position: absolute;
      top: 170px;
      left: 60px;
      right: 60px;
      bottom: 330px;
      z-index: 30;
    }

    .scene-view {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      opacity: 0;
      display: none;
    }

    /* Visual Content Box (Top half of stage) */
    .hero-card {
      position: relative;
      background: var(--paper-cream);
      color: var(--ink-black);
      border-radius: 28px;
      border: 4px solid var(--ink-black);
      box-shadow: 12px 12px 0 var(--ink-black);
      padding: 40px;
      margin-bottom: 30px;
      overflow: hidden;
    }

    .hero-eyebrow {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 6px 16px;
      background: var(--pastel-coral);
      color: var(--ink-black);
      border-radius: 8px;
      border: 2.5px solid var(--ink-black);
      font-family: var(--font-mono);
      font-size: 18px;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      margin-bottom: 18px;
    }

    .hero-title {
      font-size: 46px;
      font-weight: 900;
      line-height: 1.14;
      color: var(--ink-black);
      margin-bottom: 22px;
    }

    .hero-modules {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 16px;
      margin-top: 15px;
    }

    .hero-module {
      background: rgba(255, 255, 255, 0.85);
      border: 3px solid var(--ink-black);
      border-radius: 16px;
      padding: 16px;
      text-align: center;
      box-shadow: 4px 4px 0 var(--ink-black);
    }

    .hero-module .num {
      font-family: var(--font-mono);
      font-size: 16px;
      font-weight: 700;
      color: var(--teal-accent);
      margin-bottom: 6px;
    }

    .hero-module .val {
      font-size: 22px;
      font-weight: 800;
      color: var(--ink-black);
    }

    /* Split Comparison Box */
    .split-contrast {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-top: 20px;
    }

    .contrast-box {
      border: 3.5px solid var(--ink-black);
      border-radius: 20px;
      padding: 24px;
      box-shadow: 6px 6px 0 var(--ink-black);
    }

    .contrast-box.myth {
      background: #FFE8E5;
      color: var(--rust-accent);
    }

    .contrast-box.fact {
      background: #E8F8F5;
      color: var(--teal-accent);
    }

    .contrast-box .header {
      font-family: var(--font-mono);
      font-size: 18px;
      font-weight: 800;
      margin-bottom: 10px;
    }

    .contrast-box .body {
      font-size: 24px;
      font-weight: 800;
      color: var(--ink-black);
      line-height: 1.25;
    }

    /* Character Interactive Staging Area */
    .characters-stage {
      position: relative;
      height: 640px;
      display: flex;
      justify-content: space-around;
      align-items: flex-end;
      padding-bottom: 10px;
    }

    .character-pod {
      position: relative;
      width: 440px;
      height: 620px;
      transform-origin: bottom center;
    }

    .character-pod svg {
      width: 100%;
      height: 100%;
      filter: drop-shadow(8px 12px 0 rgba(0,0,0,0.35));
    }

    .character-label {
      position: absolute;
      top: -15px;
      left: 50%;
      transform: translateX(-50%);
      padding: 6px 16px;
      border-radius: 999px;
      font-size: 16px;
      font-weight: 800;
      letter-spacing: 0.05em;
      border: 2.5px solid var(--ink-black);
      box-shadow: 4px 4px 0 var(--ink-black);
    }

    .character-label.maya {
      background: var(--pastel-butter);
      color: var(--ink-black);
    }

    .character-label.alex {
      background: var(--pastel-mint);
      color: var(--ink-black);
    }

    /* Bottom Subtitles Docket Box */
    .subtitle-dock {
      position: absolute;
      bottom: 60px;
      left: 60px;
      right: 60px;
      height: 230px;
      background: rgba(26, 23, 34, 0.96);
      border-radius: 28px;
      border: 4px solid var(--ink-black);
      box-shadow: 10px 10px 0 var(--ink-black);
      padding: 26px 36px;
      z-index: 80;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .subtitle-speaker-row {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 12px;
    }

    .speaker-pill {
      display: inline-flex;
      align-items: center;
      padding: 6px 18px;
      border-radius: 999px;
      font-size: 18px;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      border: 2.5px solid var(--ink-black);
    }

    .speaker-pill.maya {
      background: var(--pastel-butter);
      color: var(--ink-black);
    }

    .speaker-pill.alex {
      background: var(--pastel-mint);
      color: var(--ink-black);
    }

    .subtitle-source-tag {
      font-family: var(--font-mono);
      font-size: 16px;
      font-weight: 600;
      color: #DCD6EC;
    }

    .subtitle-text {
      font-size: 34px;
      font-weight: 700;
      line-height: 1.28;
      color: #FFFDF9;
    }

    .hl-gold {
      color: var(--gold-bright);
      background: rgba(245, 197, 66, 0.16);
      padding: 0 6px;
      border-radius: 4px;
    }

    .hl-teal {
      color: #6BE3D4;
    }

    .hl-coral {
      color: var(--pastel-coral);
    }
  </style>
</head>
<body>
  <div id="root" data-composition-id="main" data-width="1080" data-height="1920" data-duration="60" data-layout-allow-overflow="true">
    
    <!-- Tactile Background Litho Texture -->
    <div class="texture-paper"></div>

    <!-- Global Theatrical Spotlight -->
    <div id="spotlight" class="theatrical-spotlight"></div>

    <!-- Scenic Backdrop Planes -->
    <div class="scenic-container">
      <div id="scenic-1" class="scenic-plate">${sc1Svg}</div>
      <div id="scenic-2" class="scenic-plate">${sc2Svg}</div>
      <div id="scenic-3" class="scenic-plate">${sc3Svg}</div>
    </div>

    <!-- Top Persistent Header -->
    <div class="header-bar">
      <div class="brand-pill" data-layout-allow-overlap="true">
        <span class="dot"></span>
        <span>EP. ${ep.num} · BEYOND THE MYTH</span>
      </div>
      <div class="source-badge" data-layout-allow-overlap="true">
        <span>★ VERIFIED PUBLIC RECORD</span>
      </div>
    </div>

    <!-- Main Stage for the 7 Scenes -->
    <div class="stage">
      
      <!-- SCENE 1: HOOK (00 - 04s) -->
      <div id="scene-1" class="scene-view">
        <div class="hero-card" data-layout-allow-overlap="true">
          <div class="hero-eyebrow" data-layout-allow-overlap="true" style="background: var(--pastel-butter);">✦ HOOK · WHAT THIS ACTUALLY IS</div>
          <div class="hero-title">${scenes[0].on_screen}</div>
          <div style="font-size: 26px; font-weight: 600; color: var(--ink-muted);">Don't replace an investigation with an internet stereotype.</div>
        </div>
        <div class="characters-stage">
          <div id="s1-maya" class="character-pod">
            <div class="character-label maya" data-layout-allow-occlusion="true">MAYA</div>
            ${mayaPoint}
          </div>
          <div id="s1-alex" class="character-pod">
            <div class="character-label alex" data-layout-allow-occlusion="true">ALEX</div>
            ${alexListen}
          </div>
        </div>
      </div>

      <!-- SCENE 2: QUESTION & INITIAL ANSWER (04 - 13s) -->
      <div id="scene-2" class="scene-view">
        <div class="hero-card" data-layout-allow-overlap="true">
          <div class="hero-eyebrow" data-layout-allow-overlap="true" style="background: var(--pastel-mint);">⚙ THE ACTUAL CLAIM</div>
          <div class="hero-title">${scenes[1].on_screen}</div>
          <div class="hero-modules">
            <div class="hero-module">
              <div class="num">01 · CLAIM</div>
              <div class="val">Specific Standards</div>
            </div>
            <div class="hero-module">
              <div class="num">02 · AUTHORITY</div>
              <div class="val">Official Rules</div>
            </div>
            <div class="hero-module">
              <div class="num">03 · SCOPE</div>
              <div class="val">On-The-Record</div>
            </div>
          </div>
        </div>
        <div class="characters-stage">
          <div id="s2-maya" class="character-pod">
            <div class="character-label maya" data-layout-allow-occlusion="true">MAYA</div>
            ${mayaListen}
          </div>
          <div id="s2-alex" class="character-pod">
            <div class="character-label alex" data-layout-allow-occlusion="true">ALEX</div>
            ${alexExplain}
          </div>
        </div>
      </div>

      <!-- SCENE 3: DEMONSTRATION & PROOF (13 - 24s) -->
      <div id="scene-3" class="scene-view">
        <div class="hero-card" data-layout-allow-overlap="true">
          <div class="hero-eyebrow" data-layout-allow-overlap="true" style="background: var(--pastel-coral);">📄 AUDIT DEMONSTRATION</div>
          <div class="hero-title">${scenes[2].on_screen}</div>
          <div class="hero-modules">
            <div class="hero-module" style="background: #FFF9E6;">
              <div class="num">CHECK 01</div>
              <div class="val">Ingredients</div>
            </div>
            <div class="hero-module" style="background: #E8F8F5;">
              <div class="num">CHECK 02</div>
              <div class="val">Equipment</div>
            </div>
            <div class="hero-module" style="background: #EBF3FA;">
              <div class="num">CHECK 03</div>
              <div class="val">Production</div>
            </div>
          </div>
        </div>
        <div class="characters-stage">
          <div id="s3-maya" class="character-pod">
            <div class="character-label maya" data-layout-allow-occlusion="true">MAYA</div>
            ${mayaExplain}
          </div>
          <div id="s3-alex" class="character-pod">
            <div class="character-label alex" data-layout-allow-occlusion="true">ALEX</div>
            ${alexRead}
          </div>
        </div>
      </div>

      <!-- SCENE 4: CRUCIAL DISTINCTION (24 - 36s) -->
      <div id="scene-4" class="scene-view">
        <div class="hero-card" data-layout-allow-overlap="true">
          <div class="hero-eyebrow" data-layout-allow-overlap="true" style="background: var(--pastel-sky);">⚖ LOGICAL DISTINCTION</div>
          <div class="hero-title">${scenes[3].on_screen}</div>
          <div class="split-contrast">
            <div class="contrast-box myth">
              <div class="header">✕ INTERNET CONSPIRACY</div>
              <div class="body">Claims a fee proves secret industry ownership.</div>
            </div>
            <div class="contrast-box fact">
              <div class="header">✓ FACTUAL REALITY</div>
              <div class="body">Paid service agreement for inspection compliance.</div>
            </div>
          </div>
        </div>
        <div class="characters-stage">
          <div id="s4-maya" class="character-pod">
            <div class="character-label maya" data-layout-allow-occlusion="true">MAYA</div>
            ${mayaRead}
          </div>
          <div id="s4-alex" class="character-pod">
            <div class="character-label alex" data-layout-allow-occlusion="true">ALEX</div>
            ${alexPoint}
          </div>
        </div>
      </div>

      <!-- SCENE 5: REASONABLE OBJECTION RESOLVED (36 - 48s) -->
      <div id="scene-5" class="scene-view">
        <div class="hero-card" data-layout-allow-overlap="true">
          <div class="hero-eyebrow" data-layout-allow-overlap="true" style="background: var(--pastel-butter);">🔍 INVESTIGATE THE REAL SOURCE</div>
          <div class="hero-title">${scenes[4].on_screen}</div>
          <div class="hero-modules">
            <div class="hero-module">
              <div class="num">OWNERSHIP?</div>
              <div class="val">Company Records</div>
            </div>
            <div class="hero-module">
              <div class="num">CERTIFICATION?</div>
              <div class="val">Certifier Rules</div>
            </div>
            <div class="hero-module">
              <div class="num">DECISIONS?</div>
              <div class="val">Voting Rights</div>
            </div>
          </div>
        </div>
        <div class="characters-stage">
          <div id="s5-maya" class="character-pod">
            <div class="character-label maya" data-layout-allow-occlusion="true">MAYA</div>
            ${mayaPoint}
          </div>
          <div id="s5-alex" class="character-pod">
            <div class="character-label alex" data-layout-allow-occlusion="true">ALEX</div>
            ${alexExplain}
          </div>
        </div>
      </div>

      <!-- SCENE 6: PRACTICAL TOOL / PRINCIPLE (48 - 56s) -->
      <div id="scene-6" class="scene-view">
        <div class="hero-card" data-layout-allow-overlap="true">
          <div class="hero-eyebrow" data-layout-allow-overlap="true" style="background: var(--pastel-mint);">📊 EVIDENCE PRINCIPLE</div>
          <div class="hero-title">${scenes[5].on_screen}</div>
          <div style="font-size: 28px; font-weight: 700; line-height: 1.35; color: var(--ink-black);">
            An identity match isn't a paper trail. Hold decision-makers responsible for their actions—not a community for its identity.
          </div>
        </div>
        <div class="characters-stage">
          <div id="s6-maya" class="character-pod">
            <div class="character-label maya" data-layout-allow-occlusion="true">MAYA</div>
            ${mayaListen}
          </div>
          <div id="s6-alex" class="character-pod">
            <div class="character-label alex" data-layout-allow-occlusion="true">ALEX</div>
            ${alexPoint}
          </div>
        </div>
      </div>

      <!-- SCENE 7: MEMORABLE REMATE & BRAND LOCKUP (56 - 60s) -->
      <div id="scene-7" class="scene-view">
        <div class="hero-card" data-layout-allow-overlap="true" style="background: #FFFDF8; text-align: center; padding: 50px 30px;">
          <div class="hero-eyebrow" data-layout-allow-overlap="true" style="background: var(--gold-bright); margin: 0 auto 20px auto;">★ BEYOND THE MYTH ★</div>
          <div class="hero-title" style="font-size: 52px; margin-bottom: 16px;">${scenes[6].on_screen}</div>
          <div style="font-size: 32px; font-weight: 800; color: var(--teal-accent); letter-spacing: 0.04em;">
            FACTS, NOT SCAPEGOATS.
          </div>
        </div>
        <div class="characters-stage">
          <div id="s7-maya" class="character-pod">
            <div class="character-label maya" data-layout-allow-occlusion="true">MAYA</div>
            ${mayaPoint}
          </div>
          <div id="s7-alex" class="character-pod">
            <div class="character-label alex" data-layout-allow-occlusion="true">ALEX</div>
            ${alexExplain}
          </div>
        </div>
      </div>

    </div>

    <!-- Bottom Subtitle Card -->
    <div id="subtitle-card" class="subtitle-dock" data-layout-allow-overlap="true">
      <div class="subtitle-speaker-row">
        <div id="speaker-tag" class="speaker-pill maya">${scenes[0].speaker}</div>
        <div id="source-tag" class="subtitle-source-tag">${scenes[0].source}</div>
      </div>
      <div id="subtitle-content" class="subtitle-text">${scenes[0].text}</div>
    </div>

  </div>

  <script>
    window.__timelines = window.__timelines || {};
    const tl = gsap.timeline({ paused: true });
    window.__timelines["main"] = tl;

    // Subtitle cues from master audio
    const CUES = ${JSON.stringify(scenes)};

    function updateSubtitle(idx) {
      const c = CUES[idx];
      if (!c) return;
      const spk = document.getElementById("speaker-tag");
      const src = document.getElementById("source-tag");
      const txt = document.getElementById("subtitle-content");
      if (spk) {
        spk.textContent = c.speaker;
        spk.className = "speaker-pill " + c.speaker.toLowerCase();
      }
      if (src) src.textContent = c.source;
      if (txt) txt.innerHTML = c.text;
    }

    // Set initial scene
    gsap.set("#scene-1", { display: "flex", opacity: 1 });
    gsap.set("#scenic-1", { display: "block", opacity: 1 });

    // Continuous Subtle Camera Zoom on Scenic Backdrops
    tl.fromTo("#scenic-1", { scale: 1.0 }, { scale: 1.08, duration: 24.5, ease: "none" }, 0.0);
    tl.fromTo("#scenic-2", { scale: 1.0 }, { scale: 1.08, duration: 23.5, ease: "none" }, 24.5);
    tl.fromTo("#scenic-3", { scale: 1.0 }, { scale: 1.06, duration: 12.0, ease: "none" }, 48.0);

    // Subtle Idle Character Kinematics (Breathing & Head Movement)
    gsap.utils.toArray('[data-part="torso"]').forEach(torso => {
      gsap.to(torso, { scaleY: 1.025, transformOrigin: "bottom center", yoyo: true, repeat: 36, duration: 1.6, ease: "sine.inOut" });
    });

    gsap.utils.toArray('[data-part="eyes"]').forEach(eyes => {
      gsap.to(eyes, { scaleY: 0.1, transformOrigin: "center center", yoyo: true, repeat: 20, repeatDelay: 2.7, duration: 0.12 });
    });

    // Animate Spotlight tracking key evidence zones
    tl.to("#spotlight", { x: -80, duration: 12.0, ease: "power1.inOut" }, 0.0);
    tl.to("#spotlight", { x: 90, duration: 12.0, ease: "power1.inOut" }, 12.0);
    tl.to("#spotlight", { x: -40, duration: 12.0, ease: "power1.inOut" }, 24.0);
    tl.to("#spotlight", { x: 50, duration: 12.0, ease: "power1.inOut" }, 36.0);
    tl.to("#spotlight", { x: 0, duration: 8.0, ease: "power1.inOut" }, 48.0);

    // Scene Transitions & Subtitle Synchronization matching CUES
    ${scenes.map((s, i) => {
      const nextScene = i + 1;
      const startTime = s.start;
      const isLast = i === scenes.length - 1;
      return `
    // Scene ${i + 1} Cue (${s.speaker}) @ ${startTime}s
    tl.call(() => updateSubtitle(${i}), null, ${startTime});
    ${i > 0 ? `
    // Switch from Scene ${i} to Scene ${i + 1}
    tl.to("#scene-${i}", { opacity: 0, duration: 0.28, ease: "power2.in" }, ${Math.max(0.01, startTime - 0.28).toFixed(2)});
    tl.set("#scene-${i}", { display: "none" }, ${startTime});
    tl.set("#scene-${i + 1}", { display: "flex", opacity: 0 }, ${startTime});
    tl.to("#scene-${i + 1}", { opacity: 1, duration: 0.32, ease: "power2.out" }, ${startTime});
    ${i === 2 ? `
    // Background Switch to Scene 2
    tl.to("#scenic-1", { opacity: 0, duration: 0.5 }, ${startTime});
    tl.set("#scenic-1", { display: "none" }, ${startTime + 0.5});
    tl.set("#scenic-2", { display: "block", opacity: 0 }, ${startTime});
    tl.to("#scenic-2", { opacity: 1, duration: 0.5 }, ${startTime});` : ''}
    ${i === 5 ? `
    // Background Switch to Scene 3
    tl.to("#scenic-2", { opacity: 0, duration: 0.5 }, ${startTime});
    tl.set("#scenic-2", { display: "none" }, ${startTime + 0.5});
    tl.set("#scenic-3", { display: "block", opacity: 0 }, ${startTime});
    tl.to("#scenic-3", { opacity: 1, duration: 0.5 }, ${startTime});` : ''}
    ` : ''}
    // Arm Gestures & Head Tilts for ${s.speaker} in Scene ${i + 1}
    ${s.speaker === 'Maya' ? `
    tl.fromTo("#s${i+1}-maya [data-part='arm-left']", { rotation: -4 }, { rotation: 12, duration: 0.9, yoyo: true, repeat: 3, ease: "sine.inOut" }, ${startTime});
    tl.fromTo("#s${i+1}-maya [data-part='head']", { rotation: -2 }, { rotation: 4, duration: 1.1, yoyo: true, repeat: 2, ease: "sine.inOut" }, ${startTime});
    ` : `
    tl.fromTo("#s${i+1}-alex [data-part='arm-right']", { rotation: 6 }, { rotation: -14, duration: 0.9, yoyo: true, repeat: 3, ease: "sine.inOut" }, ${startTime});
    tl.fromTo("#s${i+1}-alex [data-part='head']", { rotation: 2 }, { rotation: -3, duration: 1.1, yoyo: true, repeat: 2, ease: "sine.inOut" }, ${startTime});
    `}
      `;
    }).join('\n')}

    // Seamless loop slide out at 59.2s
    tl.to("#root", { x: -1080, duration: 0.8, ease: "power2.in" }, 59.2);

  </script>
</body>
</html>`;
}

function processAllCompositions() {
  console.log("Generating full HyperFrames compositions for all 10 episodes...");

  for (const ep of EPISODE_META) {
    const epDir = path.join(baseDir, `beyond_the_myth_${ep.id}`);
    const subJsonPath = path.join(epDir, 'subtitles.json');
    if (!fs.existsSync(subJsonPath)) {
      console.error(`Subtitles JSON not found for ${ep.id}: ${subJsonPath}`);
      continue;
    }

    const subData = JSON.parse(fs.readFileSync(subJsonPath, 'utf8'));
    const html = generateCompositionHtml(ep, subData);

    // Write index.html
    const indexPath = path.join(epDir, 'index.html');
    fs.writeFileSync(indexPath, html, 'utf8');

    // Write hyperframes.json
    const hfPath = path.join(epDir, 'hyperframes.json');
    fs.writeFileSync(hfPath, JSON.stringify({
      width: 1080,
      height: 1920,
      fps: 30,
      duration: 60,
      entry: "index.html"
    }, null, 2), 'utf8');

    // Write package.json
    const pkgPath = path.join(epDir, 'package.json');
    fs.writeFileSync(pkgPath, JSON.stringify({
      name: `beyond_the_myth_${ep.id}`,
      version: "1.0.0",
      private: true,
      dependencies: {
        "hyperframes": "0.8.152"
      }
    }, null, 2), 'utf8');

    // Copy forma-core.js to assets if not present
    const assetsDir = path.join(epDir, 'assets');
    fs.mkdirSync(assetsDir, { recursive: true });
    const formaDest = path.join(assetsDir, 'forma-core.js');
    if (!fs.existsSync(formaDest)) {
      fs.writeFileSync(formaDest, formaCode, 'utf8');
    }

    // Ensure renders directory exists
    fs.mkdirSync(path.join(epDir, 'renders'), { recursive: true });

    console.log(`[OK] Episode ${ep.num} (${ep.id}) composition generated: ${indexPath}`);
  }

  console.log("\nALL 10 COMPOSITIONS ASSEMBLED SUCCESSFULLY!");
}

processAllCompositions();

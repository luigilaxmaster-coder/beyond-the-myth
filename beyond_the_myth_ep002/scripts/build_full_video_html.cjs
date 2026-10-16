const fs = require('fs');
const path = require('path');

// Load FORMA core
const formaCode = fs.readFileSync(path.join(__dirname, '..', 'assets', 'forma-core.js'), 'utf8');
global.window = global;
global.document = { createElementNS: () => ({}) };
eval(formaCode);

function getAssetSvg(id, options = {}) {
  const asset = FORMA.catalog.find(a => a.id === id || a.id.startsWith(id));
  if (!asset) throw new Error('Asset not found: ' + id);
  let svg = FORMA.renderMarkup(asset, options);
  // Replace deprecated data-layer to avoid hyperframes linter warning
  svg = svg.replace(/data-layer=/g, 'data-scene-layer=');
  return svg;
}

console.log('Rendering high-density FORMA SVG assets...');

const svgs = {
  mercado: getAssetSvg('escenarios-mercado-01', { instance: 'sc-mercado', paletteName: 'editorial', width: 1080 }),
  mercadoCart: getAssetSvg('escenarios-mercado-02', { instance: 'sc-mercado-cart', paletteName: 'melocoton', width: 1080 }),
  lab: getAssetSvg('escenarios-laboratorio-01', { instance: 'sc-lab', paletteName: 'oceano', width: 1080 }),
  oficina: getAssetSvg('escenarios-oficina-01', { instance: 'sc-oficina', paletteName: 'aurora', width: 1080 }),
  calle: getAssetSvg('escenarios-calle-01', { instance: 'sc-calle', paletteName: 'melocoton', width: 1080 }),
  mayaPoint: getAssetSvg('personas-investigadora-01', { instance: 'maya-point', paletteName: 'editorial', width: 440 }),
  mayaTalk: getAssetSvg('personas-narrador-02', { instance: 'maya-talk', paletteName: 'editorial', width: 440 }),
  companionVecino: getAssetSvg('personas-vecino-01', { instance: 'comp-curious', paletteName: 'aurora', width: 420 }),
  companionListen: getAssetSvg('personas-adolescente-01', { instance: 'comp-listen', paletteName: 'jardin', width: 420 }),
  inspector: getAssetSvg('personas-ingeniera-01', { instance: 'insp-factory', paletteName: 'oceano', width: 440 }),
  rayos: getAssetSvg('efectos-rayos-01', { instance: 'fx-rayos', paletteName: 'editorial', width: 700 }),
  vapor: getAssetSvg('efectos-vapor-01', { instance: 'fx-vapor', paletteName: 'editorial', width: 280 }),
  destellos: getAssetSvg('efectos-destellos-01', { instance: 'fx-destellos', paletteName: 'editorial', width: 350 })
};

console.log('Assembling clean, linter-perfect index.html...');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=1080, height=1920, initial-scale=1.0">
  <title>Beyond The Myth · Episode 002: What That Kosher Symbol Means</title>
  <!-- Load GSAP -->
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
  <style>
    :root {
      --color-ink: #2b2538;
      --color-paper: #fff9f5;
      --color-gold: #f4d084;
      --color-gold-dark: #b8860b;
      --color-teal: #76c5ba;
      --color-teal-dark: #3a7a72;
      --color-rust: #f29a91;
      --color-rust-dark: #b84a40;
      --color-blue: #a89ad4;
      --color-sage: #b3cca0;
      --color-shadow: rgba(43, 37, 56, 0.18);
      --font-display: 'EB Garamond', Georgia, serif;
      --font-body: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
      --font-mono: 'Space Grotesk', monospace;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background-color: #1a1622;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      overflow: hidden;
      font-family: var(--font-body);
      -webkit-font-smoothing: antialiased;
    }

    #root {
      position: relative;
      width: 1080px;
      height: 1920px;
      overflow: hidden;
      background-color: #f7f3ec;
      color: var(--color-ink);
    }

    /* Tactile Paper Texture & Ambient Lighting Overlay */
    .texture-paper {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 99;
      opacity: 0.35;
      mix-blend-mode: multiply;
      background-image: radial-gradient(circle at 50% 30%, transparent 40%, rgba(43, 37, 56, 0.08) 100%),
                        linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px);
      background-size: 100% 100%, 8px 8px, 8px 8px;
    }

    /* Cinematic Depth Vignette */
    .depth-vignette {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 98;
      background: radial-gradient(ellipse at 50% 50%, transparent 60%, rgba(35, 25, 48, 0.25) 100%);
    }

    /* Persistent Header */
    .header-bar {
      position: absolute;
      top: 50px;
      left: 60px;
      right: 60px;
      height: 80px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 90;
      pointer-events: none;
    }

    .series-badge {
      display: flex;
      align-items: center;
      gap: 16px;
      background: rgba(255, 249, 245, 0.92);
      backdrop-filter: blur(16px);
      padding: 12px 28px;
      border-radius: 999px;
      border: 2px solid var(--color-ink);
      box-shadow: 0 8px 24px var(--color-shadow);
    }

    .badge-icon {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: var(--color-rust);
      border: 2px solid var(--color-ink);
    }

    .badge-text {
      font-family: var(--font-mono);
      font-size: 22px;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--color-ink);
    }

    .episode-pill {
      background: var(--color-ink);
      color: var(--color-paper);
      padding: 12px 24px;
      border-radius: 999px;
      font-family: var(--font-mono);
      font-size: 20px;
      font-weight: 700;
      letter-spacing: 0.08em;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    }

    /* Subtitle Overlay Bar */
    .subtitle-overlay {
      position: absolute;
      bottom: 90px;
      left: 70px;
      right: 70px;
      min-height: 140px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 24px 36px;
      background: rgba(26, 22, 34, 0.92);
      backdrop-filter: blur(20px);
      border-radius: 28px;
      border: 2px solid rgba(244, 208, 132, 0.4);
      box-shadow: 0 16px 48px rgba(0, 0, 0, 0.35);
      z-index: 95;
      text-align: center;
    }

    .subtitle-text {
      font-family: var(--font-body);
      font-size: 34px;
      line-height: 1.35;
      font-weight: 600;
      color: #ffffff;
      margin-bottom: 8px;
    }

    .subtitle-source {
      font-family: var(--font-mono);
      font-size: 18px;
      font-weight: 500;
      letter-spacing: 0.06em;
      color: var(--color-gold);
      text-transform: uppercase;
    }

    /* Shared Scene Canvas */
    .scene {
      position: absolute;
      inset: 0;
      width: 1080px;
      height: 1920px;
      display: none;
      overflow: hidden;
    }

    /* Depth Layering Utilities */
    .layer-bg {
      position: absolute;
      inset: 0;
      z-index: 10;
    }

    .layer-mid {
      position: absolute;
      inset: 0;
      z-index: 30;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .layer-fg {
      position: absolute;
      inset: 0;
      z-index: 40;
      pointer-events: none;
    }

    /* Common Card Styling */
    .glass-card {
      background: rgba(255, 249, 245, 0.95);
      border: 3px solid var(--color-ink);
      border-radius: 32px;
      box-shadow: 0 20px 50px var(--color-shadow);
      padding: 40px;
    }

    /* 3D Cereal Box Component */
    .cereal-box-3d {
      position: relative;
      width: 480px;
      height: 680px;
      background: linear-gradient(145deg, #fce8a6, #f3cd67);
      border: 4px solid var(--color-ink);
      border-radius: 20px;
      box-shadow: 28px 36px 60px rgba(43, 37, 56, 0.35),
                  inset 4px 4px 0 rgba(255, 255, 255, 0.6);
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 32px;
      overflow: hidden;
    }

    .cereal-box-flap {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 36px;
      background: #ebd07b;
      border-bottom: 3px dashed rgba(43, 37, 56, 0.3);
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: var(--font-mono);
      font-size: 14px;
      letter-spacing: 0.15em;
      font-weight: 700;
      color: #382d1c;
    }

    .cereal-brand {
      margin-top: 40px;
      font-family: var(--font-display);
      font-size: 52px;
      font-weight: 700;
      color: #943a29;
      text-align: center;
      line-height: 1.05;
      text-shadow: 2px 2px 0 #fff;
    }

    .cereal-subbrand {
      font-family: var(--font-mono);
      font-size: 20px;
      font-weight: 700;
      color: #3a7a72;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      margin-top: 6px;
    }

    .cereal-bowl-svg {
      width: 320px;
      height: 220px;
      margin-top: 24px;
    }

    .cereal-footer {
      position: absolute;
      bottom: 28px;
      left: 32px;
      right: 32px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }

    .cereal-nutrition {
      display: flex;
      flex-direction: column;
      gap: 4px;
      font-family: var(--font-mono);
      font-size: 13px;
      font-weight: 600;
      color: var(--color-ink);
    }

    .cereal-ou-symbol {
      position: relative;
      width: 90px;
      height: 90px;
      background: #fff;
      border: 3px solid var(--color-ink);
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    }

    .cereal-ou-symbol span {
      font-family: var(--font-display);
      font-size: 54px;
      font-weight: 900;
      color: var(--color-ink);
      line-height: 1;
      margin-top: -4px;
    }

    /* Magnifying Glass */
    .magnifier {
      position: absolute;
      width: 320px;
      height: 320px;
      pointer-events: none;
      z-index: 60;
    }

    .magnifier-glass {
      width: 220px;
      height: 220px;
      border-radius: 50%;
      border: 14px solid #d4af37;
      background: radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.45), rgba(244, 208, 132, 0.15) 70%, rgba(184, 134, 11, 0.3) 100%);
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3), inset 0 0 24px rgba(255, 255, 255, 0.6);
      position: relative;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .magnifier-handle {
      position: absolute;
      top: 185px;
      left: 185px;
      width: 24px;
      height: 140px;
      background: linear-gradient(90deg, #6b4c2e, #a06e3d 50%, #4a3420);
      border: 3px solid var(--color-ink);
      border-radius: 12px;
      transform: rotate(-45deg);
      transform-origin: top left;
      box-shadow: 8px 12px 24px rgba(0, 0, 0, 0.25);
    }

    /* Conveyor Belt Styling */
    .conveyor-belt {
      position: relative;
      width: 1080px;
      height: 160px;
      background: #505868;
      border-top: 5px solid #2d3340;
      border-bottom: 5px solid #2d3340;
      display: flex;
      align-items: center;
      overflow: hidden;
    }

    .conveyor-rollers {
      position: absolute;
      inset: 0;
      display: flex;
      gap: 40px;
      align-items: center;
    }

    .roller {
      width: 24px;
      height: 140px;
      background: linear-gradient(90deg, #8c97ad, #d0d7e5, #6f798e);
      border-radius: 12px;
    }

    /* Clipboard Styling */
    .clipboard-prop {
      width: 360px;
      height: 520px;
      background: #c29b6b;
      border: 4px solid var(--color-ink);
      border-radius: 20px;
      box-shadow: 0 24px 60px var(--color-shadow);
      padding: 30px 24px;
      position: relative;
    }

    .clipboard-clip {
      position: absolute;
      top: -24px;
      left: 50%;
      transform: translateX(-50%);
      width: 120px;
      height: 48px;
      background: linear-gradient(180deg, #e0e5ed, #9aa2b0);
      border: 3px solid var(--color-ink);
      border-radius: 10px;
    }

    .clipboard-sheet {
      width: 100%;
      height: 100%;
      background: #fffdfa;
      border: 2px solid #ddd;
      border-radius: 12px;
      padding: 24px 18px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .checklist-row {
      display: flex;
      align-items: center;
      gap: 14px;
      font-size: 18px;
      font-weight: 700;
      font-family: var(--font-mono);
      color: var(--color-ink);
    }

    .check-box {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      border: 3px solid var(--color-ink);
      background: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 22px;
      font-weight: 900;
      color: #2e7d32;
    }

    /* Shopping Cart 3D Wireframe */
    .cart-3d {
      position: relative;
      width: 480px;
      height: 440px;
    }

    /* Tablet Screen */
    .tablet-frame {
      width: 640px;
      height: 840px;
      background: #1e1b24;
      border-radius: 40px;
      border: 8px solid #363242;
      box-shadow: 0 32px 80px rgba(0, 0, 0, 0.45);
      padding: 20px;
      position: relative;
    }

    .tablet-screen {
      width: 100%;
      height: 100%;
      background: #faf6f0;
      border-radius: 28px;
      overflow: hidden;
      padding: 36px 30px;
      display: flex;
      flex-direction: column;
    }

    /* Closing Seal */
    .closing-seal {
      position: relative;
      width: 460px;
      height: 460px;
      border-radius: 50%;
      background: radial-gradient(circle, #fffdf8 30%, #fbf3e0 70%, #f4d084 100%);
      border: 8px double var(--color-ink);
      box-shadow: 0 24px 70px rgba(43, 37, 56, 0.35);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      padding: 40px;
    }

    .closing-seal-star {
      font-size: 28px;
      color: var(--color-gold-dark);
      margin: 6px 0;
    }
  </style>
</head>
<body>
  <div id="root" data-composition-id="main" data-width="1080" data-height="1920" data-duration="60" data-fps="30">
    
    <!-- Tactile Screenprint Overlays -->
    <div class="texture-paper" data-layout-allow-overlap="true" data-layout-allow-occlusion="true"></div>
    <div class="depth-vignette" data-layout-allow-overlap="true" data-layout-allow-occlusion="true"></div>

    <!-- Persistent Header -->
    <div class="header-bar" data-layout-allow-overlap="true">
      <div class="series-badge">
        <div class="badge-icon"></div>
        <div class="badge-text">Beyond The Myth</div>
      </div>
      <div class="episode-pill">EP. 002 · 60s</div>
    </div>

    <!-- Persistent Subtitle Bar -->
    <div class="subtitle-overlay" id="subtitle-box" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
      <div class="subtitle-text" id="sub-text">That tiny symbol on your food? It's a certification, not an ownership code.</div>
      <div class="subtitle-source" id="sub-source">OU Kosher Certification (oukosher.org)</div>
    </div>

    <!-- ==========================================
         SCENE 1: The Initial Impact (0.0s – 5.5s)
         ========================================== -->
    <div class="scene" id="scene-1" style="display: flex;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
      <!-- Deep Background: Receding Supermarket Aisle -->
      <div class="layer-bg" id="s1-bg" style="filter: blur(6px) brightness(0.92); opacity: 0.7;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
        ${svgs.mercado}
      </div>

      <!-- Atmospheric Light Shafts -->
      <div class="layer-fg" id="s1-rayos" style="top: -100px; left: 140px; opacity: 0.45; mix-blend-mode: screen;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
        ${svgs.rayos}
      </div>

      <!-- Midground: Hero 2.5D Cereal Box & Hand -->
      <div class="layer-mid" id="s1-mid" style="flex-direction: column;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
        <div id="s1-box-wrapper" style="will-change: transform;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
          <div class="cereal-box-3d" id="s1-cereal-box" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
            <div class="cereal-box-flap">· OPEN HERE · CRISP SEAL ·</div>
            <div class="cereal-brand">HONEY<br>CRUNCH</div>
            <div class="cereal-subbrand">Whole Grain Toasted Oats</div>
            
            <!-- Cereal Bowl SVG Graphic -->
            <svg class="cereal-bowl-svg" viewBox="0 0 320 220" fill="none">
              <ellipse cx="160" cy="180" rx="140" ry="24" fill="rgba(43,37,56,0.15)"/>
              <path d="M40 90 Q160 85 280 90 Q270 170 160 175 Q50 170 40 90Z" fill="#76c5ba" stroke="#2b2538" stroke-width="4"/>
              <path d="M48 95 Q160 92 272 95 Q262 145 160 150 Q58 145 48 95Z" fill="#fff9f5"/>
              <!-- Golden Flakes -->
              <circle cx="110" cy="110" r="14" fill="#f4d084" stroke="#2b2538" stroke-width="2.5"/>
              <circle cx="150" cy="105" r="16" fill="#f4d084" stroke="#2b2538" stroke-width="2.5"/>
              <circle cx="190" cy="112" r="13" fill="#f4d084" stroke="#2b2538" stroke-width="2.5"/>
              <circle cx="130" cy="125" r="15" fill="#f4d084" stroke="#2b2538" stroke-width="2.5"/>
              <circle cx="170" cy="126" r="14" fill="#f4d084" stroke="#2b2538" stroke-width="2.5"/>
              <!-- Honey Drizzle Ribbon -->
              <path d="M80 75 Q130 95 160 65 Q190 105 240 85" stroke="#e09236" stroke-width="6" stroke-linecap="round"/>
            </svg>

            <!-- Bottom Row: Nutrition & OU Kosher Mark -->
            <div class="cereal-footer" data-layout-allow-overlap="true">
              <div class="cereal-nutrition">
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

        <!-- Realistic Hand Grabbing Box -->
        <div id="s1-hand" style="position: absolute; right: -120px; bottom: 320px; z-index: 55;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
          <svg width="420" height="340" viewBox="0 0 420 340" fill="none">
            <!-- Arm sleeve -->
            <path d="M220 180 L420 220 L420 340 L180 340 Z" fill="#3a7a72" stroke="#2b2538" stroke-width="5"/>
            <!-- Wrist cuff -->
            <path d="M190 170 L230 180 L200 340 L160 330 Z" fill="#fff9f5" stroke="#2b2538" stroke-width="4"/>
            <!-- Hand palm & knuckles -->
            <path d="M90 140 Q130 110 180 140 Q210 180 190 240 Q150 280 100 240 Q70 190 90 140Z" fill="#e7b595" stroke="#2b2538" stroke-width="4.5"/>
            <!-- Fingers wrapped around box -->
            <rect x="20" y="110" width="110" height="34" rx="17" fill="#e7b595" stroke="#2b2538" stroke-width="4"/>
            <rect x="10" y="150" width="120" height="34" rx="17" fill="#e7b595" stroke="#2b2538" stroke-width="4"/>
            <rect x="15" y="190" width="115" height="34" rx="17" fill="#e7b595" stroke="#2b2538" stroke-width="4"/>
            <rect x="35" y="230" width="100" height="32" rx="16" fill="#e7b595" stroke="#2b2538" stroke-width="4"/>
            <!-- Thumb -->
            <path d="M140 120 Q120 70 80 80 Q65 100 95 130 Z" fill="#e7b595" stroke="#2b2538" stroke-width="4"/>
          </svg>
        </div>

        <!-- Magnifying Glass zooming in on OU seal -->
        <div class="magnifier" id="s1-magnifier" style="top: 860px; left: 480px; opacity: 0;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
          <div class="magnifier-glass">
            <span style="font-family: var(--font-display); font-size: 130px; font-weight: 900; color: #2b2538;">Ⓤ</span>
            <div style="position: absolute; top: 15px; left: 25px; width: 60px; height: 35px; border-radius: 50%; background: rgba(255,255,255,0.7); transform: rotate(-30deg);"></div>
          </div>
          <div class="magnifier-handle"></div>
        </div>

        <!-- Clarification Badges -->
        <div id="s1-badges" style="position: absolute; top: 400px; display: flex; flex-direction: column; gap: 20px; align-items: center; opacity: 0;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
          <div style="background: #76c5ba; color: #2b2538; border: 3px solid #2b2538; padding: 16px 36px; border-radius: 999px; font-family: var(--font-mono); font-size: 26px; font-weight: 800; letter-spacing: 0.08em; box-shadow: 0 12px 30px var(--color-shadow);">
            ✓ DIETARY CERTIFICATION
          </div>
          <div style="background: #f29a91; color: #2b2538; border: 3px solid #2b2538; padding: 16px 36px; border-radius: 999px; font-family: var(--font-mono); font-size: 26px; font-weight: 800; letter-spacing: 0.08em; text-decoration: line-through; box-shadow: 0 12px 30px var(--color-shadow);">
            ✕ NOT AN OWNERSHIP CODE
          </div>
        </div>
      </div>
    </div>

    <!-- ==========================================
         SCENE 2: Maya & Companion (5.5s – 11.6s)
         ========================================== -->
    <div class="scene" id="scene-2" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
      <!-- Supermarket Interior Architecture -->
      <div class="layer-bg" id="s2-bg" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
        ${svgs.mercado}
      </div>

      <!-- Hanging Aisle Sign -->
      <div style="position: absolute; top: 160px; left: 50%; transform: translateX(-50%); background: #2b2538; color: #f4d084; padding: 12px 48px; border-radius: 16px; border: 3px solid #f4d084; font-family: var(--font-mono); font-size: 22px; font-weight: 700; letter-spacing: 0.12em; z-index: 25; box-shadow: 0 10px 30px rgba(0,0,0,0.3);" data-layout-allow-overlap="true">
        AISLE 04 · GRAINS & BREAKFAST
      </div>

      <!-- Midground: Maya and Companion -->
      <div class="layer-mid" style="align-items: flex-end; padding-bottom: 260px; gap: 40px;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
        <!-- Companion (Curious listener with grocery bag) -->
        <div id="s2-companion" style="opacity: 0;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
          ${svgs.companionVecino}
        </div>

        <!-- Maya (Investigator presenting the box) -->
        <div id="s2-maya" style="opacity: 0; position: relative;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
          ${svgs.mayaPoint}
        </div>
      </div>

      <!-- Hero Information Card -->
      <div class="glass-card" id="s2-card" style="position: absolute; top: 280px; left: 90px; right: 90px; z-index: 35; opacity: 0;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
        <div style="display: flex; align-items: center; gap: 24px;">
          <div style="width: 100px; height: 100px; border-radius: 50%; background: #fff; border: 4px solid #2b2538; display: flex; justify-content: center; align-items: center; font-size: 64px; font-family: var(--font-display); font-weight: 900; box-shadow: 0 8px 24px rgba(0,0,0,0.1);">
            Ⓤ
          </div>
          <div>
            <h3 style="font-family: var(--font-display); font-size: 40px; font-weight: 700; color: #2b2538; line-height: 1.1;">The Orthodox Union Mark</h3>
            <p style="font-family: var(--font-mono); font-size: 20px; font-weight: 600; color: #3a7a72; margin-top: 6px;">FOUNDED 1898 · INDEPENDENT NONPROFIT</p>
          </div>
        </div>
        <div style="margin-top: 24px; padding-top: 20px; border-top: 2px dashed rgba(43,37,56,0.2); font-size: 24px; line-height: 1.4; color: #433c52;">
          Confirms food manufacturing conforms strictly to traditional kosher standards. <strong>No corporate stock, control, or equity involved.</strong>
        </div>
      </div>
    </div>

    <!-- ==========================================
         SCENE 3: Factory Inspection (11.6s – 18.7s)
         ========================================== -->
    <div class="scene" id="scene-3" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
      <!-- High-Tech Sanitary Food Plant Background -->
      <div class="layer-bg" id="s3-bg" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
        ${svgs.lab}
      </div>

      <!-- Factory Ambient Light Rays -->
      <div class="layer-fg" style="top: -60px; right: 40px; opacity: 0.35; mix-blend-mode: screen;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
        ${svgs.rayos}
      </div>

      <!-- Midground: Conveyor Belt & Inspector -->
      <div class="layer-mid" style="flex-direction: column; justify-content: flex-end; padding-bottom: 260px;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
        <!-- Industrial Conveyor Belt -->
        <div class="conveyor-belt" id="s3-conveyor" style="margin-bottom: 40px; box-shadow: 0 20px 50px rgba(0,0,0,0.3);" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
          <div class="conveyor-rollers" id="s3-rollers">
            ${Array.from({ length: 30 }, () => '<div class="roller"></div>').join('')}
          </div>
          <!-- Boxes moving on conveyor -->
          <div id="s3-conveyor-boxes" style="position: absolute; inset: 0; display: flex; align-items: center; gap: 200px;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true" data-layout-allow-overflow="true">
            <div style="width: 100px; height: 130px; background: #fce8a6; border: 3px solid #2b2538; border-radius: 8px; display: flex; justify-content: center; align-items: center; font-weight: 700; font-size: 16px;" data-layout-allow-overflow="true">OATS Ⓤ</div>
            <div style="width: 100px; height: 130px; background: #fce8a6; border: 3px solid #2b2538; border-radius: 8px; display: flex; justify-content: center; align-items: center; font-weight: 700; font-size: 16px;" data-layout-allow-overflow="true">OATS Ⓤ</div>
            <div style="width: 100px; height: 130px; background: #fce8a6; border: 3px solid #2b2538; border-radius: 8px; display: flex; justify-content: center; align-items: center; font-weight: 700; font-size: 16px;" data-layout-allow-overflow="true">OATS Ⓤ</div>
            <div style="width: 100px; height: 130px; background: #fce8a6; border: 3px solid #2b2538; border-radius: 8px; display: flex; justify-content: center; align-items: center; font-weight: 700; font-size: 16px;" data-layout-allow-overflow="true">OATS Ⓤ</div>
            <div style="width: 100px; height: 130px; background: #fce8a6; border: 3px solid #2b2538; border-radius: 8px; display: flex; justify-content: center; align-items: center; font-weight: 700; font-size: 16px;" data-layout-allow-overflow="true">OATS Ⓤ</div>
          </div>
          <!-- Scanner Laser Beam -->
          <div id="s3-scanner-beam" style="position: absolute; left: 540px; top: 0; bottom: 0; width: 6px; background: #34d399; box-shadow: 0 0 24px #34d399; z-index: 10;"></div>
        </div>

        <!-- Stage Row: Inspector & Clipboard Checklist -->
        <div style="display: flex; align-items: flex-end; gap: 40px; width: 920px; justify-content: space-between;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
          <!-- Food Safety Inspector -->
          <div id="s3-inspector" style="opacity: 0;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
            ${svgs.inspector}
          </div>

          <!-- Metallic Clipboard Audit Checklist -->
          <div class="clipboard-prop" id="s3-clipboard" style="opacity: 0;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
            <div class="clipboard-clip"></div>
            <div class="clipboard-sheet" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
              <div style="font-family: var(--font-mono); font-size: 16px; font-weight: 800; color: #3a7a72; letter-spacing: 0.1em; border-bottom: 2px solid #eee; padding-bottom: 8px;">
                ON-SITE AUDIT PROTOCOL
              </div>
              <div class="checklist-row" id="s3-check-1">
                <div class="check-box" id="s3-box-1"></div>
                <span>1. Ingredients Sourcing</span>
              </div>
              <div class="checklist-row" id="s3-check-2">
                <div class="check-box" id="s3-box-2"></div>
                <span>2. Clean Production Equipment</span>
              </div>
              <div class="checklist-row" id="s3-check-3">
                <div class="check-box" id="s3-box-3"></div>
                <span>3. Manufacturing Flow</span>
              </div>
              
              <!-- Compliance Hologram Stamp -->
              <div id="s3-audit-stamp" style="margin-top: 10px; padding: 12px; background: rgba(118, 197, 186, 0.25); border: 2px dashed #3a7a72; border-radius: 12px; text-align: center; opacity: 0;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
                <div style="font-family: var(--font-mono); font-size: 18px; font-weight: 800; color: #2e7d32;">
                  ✓ AUDIT PASSED · COMPLIANT
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ==========================================
         SCENE 4: Contract & Fees (18.7s – 27.8s)
         ========================================== -->
    <div class="scene" id="scene-4" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
      <!-- Executive Investigation Office Background -->
      <div class="layer-bg" id="s4-bg" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
        ${svgs.oficina}
      </div>

      <!-- Warm Banker Lamp Cone of Light -->
      <div class="layer-fg" style="top: 0; left: 100px; opacity: 0.4; mix-blend-mode: screen;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
        ${svgs.rayos}
      </div>

      <!-- Midground: Desk, Steam Mug, Contract Documents -->
      <div class="layer-mid" style="flex-direction: column; justify-content: center; padding-top: 100px;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
        
        <!-- Multi-Folder Contract Stash -->
        <div id="s4-contract-folder" class="glass-card" style="width: 860px; padding: 48px; border-width: 4px; opacity: 0;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
          
          <!-- Header with Seal -->
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid var(--color-ink); padding-bottom: 24px;" data-layout-allow-overlap="true">
            <div>
              <span style="font-family: var(--font-mono); font-size: 18px; font-weight: 700; color: #b8860b; letter-spacing: 0.12em;">EXECUTIVE EXHIBIT · SCHEDULE B</span>
              <h2 style="font-family: var(--font-display); font-size: 42px; font-weight: 700; color: var(--color-ink); margin-top: 4px;">Kosher Certification Contract</h2>
            </div>
            <div style="width: 72px; height: 72px; border-radius: 50%; background: #f4d084; border: 3px solid var(--color-ink); display: flex; justify-content: center; align-items: center; font-size: 36px;">
              ⚖
            </div>
          </div>

          <!-- Staggered 3-Step Process Flow -->
          <div style="display: flex; flex-direction: column; gap: 20px; margin-top: 32px;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
            <div id="s4-doc-1" style="display: flex; justify-content: space-between; align-items: center; background: #fffdf8; padding: 20px 24px; border-radius: 16px; border: 2px solid #2b2538; box-shadow: 0 6px 16px rgba(0,0,0,0.06); opacity: 0;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
              <div>
                <h4 style="font-family: var(--font-mono); font-size: 22px; font-weight: 800; color: #2b2538;">1. Application Form</h4>
                <p style="font-size: 18px; color: #5a5369; margin-top: 2px;">Company requests voluntary inspection & shares product specs.</p>
              </div>
              <span style="font-family: var(--font-mono); font-weight: 700; font-size: 16px; color: #3a7a72; background: #e0f2f1; padding: 6px 14px; border-radius: 999px;">STEP 1</span>
            </div>

            <div id="s4-doc-2" style="display: flex; justify-content: space-between; align-items: center; background: #fffdf8; padding: 20px 24px; border-radius: 16px; border: 2px solid #2b2538; box-shadow: 0 6px 16px rgba(0,0,0,0.06); opacity: 0;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
              <div>
                <h4 style="font-family: var(--font-mono); font-size: 22px; font-weight: 800; color: #2b2538;">2. Plant Visit Audit</h4>
                <p style="font-size: 18px; color: #5a5369; margin-top: 2px;">Rabbinic field coordinator audits equipment & supply chain.</p>
              </div>
              <span style="font-family: var(--font-mono); font-weight: 700; font-size: 16px; color: #3a7a72; background: #e0f2f1; padding: 6px 14px; border-radius: 999px;">STEP 2</span>
            </div>

            <div id="s4-doc-3" style="display: flex; justify-content: space-between; align-items: center; background: #fffdf8; padding: 20px 24px; border-radius: 16px; border: 2px solid #2b2538; box-shadow: 0 6px 16px rgba(0,0,0,0.06); opacity: 0;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
              <div>
                <h4 style="font-family: var(--font-mono); font-size: 22px; font-weight: 800; color: #2b2538;">3. Formal Fee Agreement</h4>
                <p style="font-size: 18px; color: #5a5369; margin-top: 2px;">Covers audit labor, laboratory analysis & travel expenses.</p>
              </div>
              <span style="font-family: var(--font-mono); font-weight: 700; font-size: 16px; color: #3a7a72; background: #e0f2f1; padding: 6px 14px; border-radius: 999px;">STEP 3</span>
            </div>
          </div>

          <!-- Highlight Clause: What the Fee Actually Is -->
          <div id="s4-fee-highlight" style="margin-top: 30px; background: #fef3c7; border: 3px solid #b8860b; border-radius: 20px; padding: 24px; display: flex; justify-content: space-between; align-items: center; opacity: 0;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
            <div>
              <div style="font-family: var(--font-mono); font-size: 16px; font-weight: 800; color: #92400e;">FEE TYPE: INDEPENDENT SERVICE AUDIT</div>
              <div style="font-size: 24px; font-weight: 700; color: #78350f; margin-top: 4px;">Flat Service Fee · 0% Equity · No Royalties</div>
            </div>
            <div style="font-family: var(--font-mono); font-size: 32px; font-weight: 900; color: #92400e; background: #fff; padding: 10px 24px; border-radius: 12px; border: 2px solid #92400e;">
              0% STOCK
            </div>
          </div>
        </div>

        <!-- Steaming Coffee Cup on Desk -->
        <div style="position: absolute; bottom: 260px; right: 120px; display: flex; flex-direction: column; align-items: center;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
          <div id="s4-steam" style="opacity: 0.6; margin-bottom: -15px;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
            ${svgs.vapor}
          </div>
          <svg width="90" height="70" viewBox="0 0 90 70">
            <rect x="15" y="10" width="50" height="50" rx="8" fill="#76c5ba" stroke="#2b2538" stroke-width="3"/>
            <path d="M65 20 Q80 20 80 35 Q80 50 65 50" fill="none" stroke="#2b2538" stroke-width="3"/>
            <ellipse cx="40" cy="12" rx="25" ry="6" fill="#3a7a72"/>
            <ellipse cx="40" cy="65" rx="35" ry="5" fill="rgba(43,37,56,0.15)"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- ==========================================
         SCENE 5: The City & Public Logic (27.8s – 33.3s)
         ========================================== -->
    <div class="scene" id="scene-5" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
      <!-- Pastel City Street Corner Background -->
      <div class="layer-bg" id="s5-bg" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
        ${svgs.calle}
      </div>

      <!-- Midground: Maya in the Public Square -->
      <div class="layer-mid" style="align-items: flex-end; padding-bottom: 260px;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
        <div id="s5-maya" style="opacity: 0;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
          ${svgs.mayaTalk}
        </div>
      </div>

      <!-- Logic Comparison Billboard -->
      <div class="glass-card" id="s5-logic-card" style="position: absolute; top: 220px; left: 80px; right: 80px; z-index: 35; opacity: 0;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
        <h3 style="font-family: var(--font-display); font-size: 38px; font-weight: 700; color: #2b2538; text-align: center;">
          Understanding Everyday Business
        </h3>
        <p style="font-family: var(--font-mono); font-size: 18px; color: #5a5369; text-align: center; margin-top: 6px;">
          COMMON REASONING VS. CONSPIRACY FALLACIES
        </p>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 28px;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
          <!-- Left: Standard Commercial Service -->
          <div style="background: #e8f5e9; border: 2px solid #2e7d32; border-radius: 20px; padding: 24px;">
            <div style="font-family: var(--font-mono); font-size: 16px; font-weight: 800; color: #2e7d32; letter-spacing: 0.08em;">
              COMMERCIAL REALITY
            </div>
            <div style="font-size: 20px; font-weight: 700; color: #1b5e20; margin-top: 10px;">
              Paying for a Service
            </div>
            <p style="font-size: 16px; color: #2e7d32; margin-top: 8px; line-height: 1.4;">
              Just like paying an electrician, food lab, or organic auditor—you pay for inspection work.
            </p>
          </div>

          <!-- Right: False Jump to Ownership -->
          <div style="background: #ffebee; border: 2px solid #c62828; border-radius: 20px; padding: 24px;">
            <div style="font-family: var(--font-mono); font-size: 16px; font-weight: 800; color: #c62828; letter-spacing: 0.08em;">
              FALSE LEAP
            </div>
            <div style="font-size: 20px; font-weight: 700; color: #b71c1c; margin-top: 10px;">
              Claiming "Control"
            </div>
            <p style="font-size: 16px; color: #c62828; margin-top: 8px; line-height: 1.4;">
              Paying a certification fee does NOT give an agency or a religious community control over the company.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- ==========================================
         SCENE 6: Tablet vs. Box (33.3s – 40.8s)
         ========================================== -->
    <div class="scene" id="scene-6" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
      <!-- Background: Neutral Studio Gradient -->
      <div class="layer-bg" style="background: radial-gradient(circle at 50% 40%, #fdfbf7, #eae4d8);"></div>

      <!-- Multi-Plane Staging: Tablet in Focus vs Cereal Box -->
      <div class="layer-mid" style="gap: 40px; padding-bottom: 120px;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
        
        <!-- Modern Glass Tablet showing SEC EDGAR Filing -->
        <div class="tablet-frame" id="s6-tablet" style="opacity: 0;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
          <div class="tablet-screen" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
            <!-- Tablet Status Bar -->
            <div style="display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 14px; font-weight: 700; color: #777; margin-bottom: 20px;">
              <span>9:41 AM · EDGAR PUBLIC FILINGS</span>
              <span>100% 🔋</span>
            </div>

            <!-- SEC Form Header -->
            <div style="border-bottom: 2px solid #2b2538; padding-bottom: 16px;">
              <span style="font-family: var(--font-mono); font-size: 16px; font-weight: 800; color: #3a7a72;">UNITED STATES SEC · FORM 10-K</span>
              <h3 style="font-family: var(--font-display); font-size: 32px; font-weight: 700; color: #2b2538; margin-top: 4px;">Public Company Ownership</h3>
              <p style="font-size: 16px; color: #666;">Major Shareholder Institutional Disclosure</p>
            </div>

            <!-- Ownership Donut Chart -->
            <div style="display: flex; align-items: center; justify-content: space-around; margin-top: 32px;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
              <svg width="220" height="220" viewBox="0 0 220 220">
                <circle cx="110" cy="110" r="80" fill="transparent" stroke="#a89ad4" stroke-width="40" stroke-dasharray="210 500" stroke-dashoffset="0"/>
                <circle cx="110" cy="110" r="80" fill="transparent" stroke="#76c5ba" stroke-width="40" stroke-dasharray="190 500" stroke-dashoffset="-210"/>
                <circle cx="110" cy="110" r="80" fill="transparent" stroke="#f4d084" stroke-width="40" stroke-dasharray="102 500" stroke-dashoffset="-400"/>
              </svg>
              <div style="display: flex; flex-direction: column; gap: 14px; font-family: var(--font-mono); font-size: 15px; font-weight: 700;">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <div style="width: 16px; height: 16px; background: #a89ad4; border-radius: 4px;"></div>
                  <span>42% Institutional Funds</span>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                  <div style="width: 16px; height: 16px; background: #76c5ba; border-radius: 4px;"></div>
                  <span>38% Public Shareholders</span>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                  <div style="width: 16px; height: 16px; background: #f4d084; border-radius: 4px;"></div>
                  <span>20% Founders / Execs</span>
                </div>
              </div>
            </div>

            <!-- Explanatory Verdict -->
            <div style="margin-top: auto; background: #2b2538; color: #fff; padding: 20px; border-radius: 16px; font-family: var(--font-mono); font-size: 18px; text-align: center;">
              WANT TO KNOW WHO OWNS IT?<br>
              <span style="color: #f4d084; font-weight: 800;">CHECK PUBLIC CORPORATE RECORDS</span>
            </div>
          </div>
        </div>

        <!-- Foreground Physical Cereal Box (Dietary question) -->
        <div id="s6-cereal-compare" style="display: flex; flex-direction: column; align-items: center; opacity: 0;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
          <div class="cereal-ou-symbol" style="width: 180px; height: 180px; border-width: 6px;">
            <span style="font-size: 110px;">Ⓤ</span>
          </div>
          <div style="margin-top: 24px; background: #fffdf8; border: 3px solid #2b2538; padding: 18px 24px; border-radius: 20px; text-align: center; box-shadow: 0 12px 30px var(--color-shadow);">
            <div style="font-family: var(--font-mono); font-size: 16px; font-weight: 800; color: #3a7a72;">DIETARY SYMBOL</div>
            <div style="font-size: 20px; font-weight: 700; color: #2b2538; margin-top: 4px;">Answers: "Is this food kosher?"</div>
            <div style="font-size: 16px; color: #b84a40; font-weight: 700; margin-top: 4px;">Does NOT answer ownership!</div>
          </div>
        </div>
      </div>
    </div>

    <!-- ==========================================
         SCENE 7: Shopping Cart & Humanity (40.8s – 50.0s)
         ========================================== -->
    <div class="scene" id="scene-7" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
      <!-- Supermarket Produce / Grocery Background -->
      <div class="layer-bg" id="s7-bg" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
        ${svgs.mercadoCart}
      </div>

      <!-- Midground: Maya, Companion, and Wire Shopping Cart -->
      <div class="layer-mid" style="align-items: flex-end; padding-bottom: 240px; gap: 40px;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
        <!-- Maya Placing Box -->
        <div id="s7-maya" style="opacity: 0;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
          ${svgs.mayaTalk}
        </div>

        <!-- Wire Shopping Cart -->
        <div class="cart-3d" id="s7-cart" style="opacity: 0;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
          <svg width="440" height="400" viewBox="0 0 440 400" fill="none">
            <!-- Wheel casters -->
            <circle cx="100" cy="360" r="24" fill="#505868" stroke="#2b2538" stroke-width="4"/>
            <circle cx="100" cy="360" r="8" fill="#fff"/>
            <circle cx="340" cy="360" r="24" fill="#505868" stroke="#2b2538" stroke-width="4"/>
            <circle cx="340" cy="360" r="8" fill="#fff"/>
            <!-- Chassis frame -->
            <path d="M100 360 L180 320 L340 360 L360 260 L80 260 Z" fill="#b0bac9" stroke="#2b2538" stroke-width="5"/>
            <!-- Wire basket grid -->
            <rect x="60" y="80" width="320" height="180" rx="16" fill="rgba(255,255,255,0.4)" stroke="#2b2538" stroke-width="5"/>
            <line x1="100" y1="80" x2="100" y2="260" stroke="#7e8a9d" stroke-width="3"/>
            <line x1="140" y1="80" x2="140" y2="260" stroke="#7e8a9d" stroke-width="3"/>
            <line x1="180" y1="80" x2="180" y2="260" stroke="#7e8a9d" stroke-width="3"/>
            <line x1="220" y1="80" x2="220" y2="260" stroke="#7e8a9d" stroke-width="3"/>
            <line x1="260" y1="80" x2="260" y2="260" stroke="#7e8a9d" stroke-width="3"/>
            <line x1="300" y1="80" x2="300" y2="260" stroke="#7e8a9d" stroke-width="3"/>
            <line x1="340" y1="80" x2="340" y2="260" stroke="#7e8a9d" stroke-width="3"/>
            <line x1="60" y1="120" x2="380" y2="120" stroke="#7e8a9d" stroke-width="3"/>
            <line x1="60" y1="160" x2="380" y2="160" stroke="#7e8a9d" stroke-width="3"/>
            <line x1="60" y1="200" x2="380" y2="200" stroke="#7e8a9d" stroke-width="3"/>
            <!-- Red handle -->
            <rect x="370" y="70" width="50" height="24" rx="8" fill="#e53935" stroke="#2b2538" stroke-width="4"/>
            <!-- Box resting inside the cart -->
            <g id="s7-box-in-cart" transform="translate(140, 110)">
              <rect width="110" height="140" rx="8" fill="#fce8a6" stroke="#2b2538" stroke-width="3.5"/>
              <circle cx="55" cy="70" r="24" fill="#fff" stroke="#2b2538" stroke-width="2.5"/>
              <text x="55" y="78" font-family="'EB Garamond', serif" font-size="28" font-weight="900" fill="#2b2538" text-anchor="middle">Ⓤ</text>
            </g>
          </svg>
        </div>

        <!-- Companion Listening & Nodding -->
        <div id="s7-companion" style="opacity: 0;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
          ${svgs.companionListen}
        </div>
      </div>

      <!-- Human Dimension Banner -->
      <div class="glass-card" id="s7-moral-card" style="position: absolute; top: 220px; left: 80px; right: 80px; z-index: 35; opacity: 0; text-align: center;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
        <span style="font-family: var(--font-mono); font-size: 20px; font-weight: 800; color: #b84a40; letter-spacing: 0.12em;">THE ETHICAL PRINCIPLE</span>
        <h2 style="font-family: var(--font-display); font-size: 42px; font-weight: 700; color: #2b2538; margin-top: 8px; line-height: 1.2;">
          Hold Decision-Makers Accountable.<br>
          <span style="color: #3a7a72;">Never Scapegoat an Entire Community.</span>
        </h2>
        <div style="margin-top: 18px; font-size: 22px; color: #5a5369;">
          Demand evidence for corporate conduct. Reject collective guilt for identity.
        </div>
      </div>
    </div>

    <!-- ==========================================
         SCENE 8: Closing Lockup & Loop (50.0s – 60.0s)
         ========================================== -->
    <div class="scene" id="scene-8" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
      <!-- Majestic Midnight Violet Backdrop -->
      <div class="layer-bg" style="background: radial-gradient(circle at 50% 45%, #2a2238 20%, #171321 80%);"></div>

      <!-- Radiant Gold Light Rays -->
      <div class="layer-fg" id="s8-rays" style="top: 100px; left: 50%; transform: translateX(-50%); opacity: 0.45; mix-blend-mode: screen;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
        ${svgs.rayos}
      </div>

      <!-- Midground: The Grand Editorial Seal -->
      <div class="layer-mid" style="flex-direction: column; justify-content: center;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
        <div class="closing-seal" id="s8-seal" style="opacity: 0;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
          <div class="closing-seal-star">★ ★ ★</div>
          
          <div class="cereal-ou-symbol" style="width: 140px; height: 140px; border-width: 5px; margin: 12px 0;">
            <span style="font-size: 84px;">Ⓤ</span>
          </div>

          <h1 style="font-family: var(--font-display); font-size: 38px; font-weight: 800; color: #2b2538; line-height: 1.15; margin-top: 8px;">
            THE LABEL BELONGS<br>ON THE BOX.
          </h1>
          
          <div style="width: 80px; height: 3px; background: #b8860b; margin: 16px 0;"></div>

          <p style="font-family: var(--font-mono); font-size: 20px; font-weight: 800; color: #b84a40; letter-spacing: 0.08em; text-transform: uppercase;">
            Not on an entire community.
          </p>

          <div class="closing-seal-star">★ ★ ★</div>
        </div>

        <!-- Series Lockup Subtitle -->
        <div id="s8-channel-lockup" style="margin-top: 48px; text-align: center; opacity: 0;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
          <div style="font-family: var(--font-display); font-size: 52px; font-weight: 800; color: #fff9f5; letter-spacing: 0.04em;">
            BEYOND THE MYTH
          </div>
          <div style="font-family: var(--font-mono); font-size: 24px; font-weight: 700; color: #f4d084; letter-spacing: 0.16em; margin-top: 6px; text-transform: uppercase;">
            Facts, Not Scapegoats · Episode 002
          </div>
        </div>
      </div>
    </div>

  </div>

  <!-- Master Deterministic Animation Script -->
  <script>
    document.addEventListener("DOMContentLoaded", () => {
      window.__timelines = window.__timelines || {};
      const tl = gsap.timeline({ paused: true });
      window.__timelines["main"] = tl;

      // Initialize all transforms via GSAP to avoid css_transform_conflict
      tl.set("#s1-box-wrapper", { x: 1100 }, 0);
      tl.set("#s1-hand", { x: 600 }, 0);
      tl.set("#s1-bg", { scale: 1.15 }, 0);
      tl.set("#s1-magnifier", { scale: 0.5, rotation: -20 }, 0);
      
      tl.set("#s2-maya", { y: 80 }, 0);
      tl.set("#s2-companion", { y: 80 }, 0);
      tl.set("#s2-card", { y: -40 }, 0);

      tl.set("#s3-inspector", { x: -100 }, 0);
      tl.set("#s3-clipboard", { x: 100 }, 0);
      tl.set("#s3-audit-stamp", { scale: 0.8 }, 0);

      tl.set("#s4-contract-folder", { scale: 0.9 }, 0);
      tl.set("#s4-doc-1", { x: -40 }, 0);
      tl.set("#s4-doc-2", { x: -40 }, 0);
      tl.set("#s4-doc-3", { x: -40 }, 0);
      tl.set("#s4-fee-highlight", { scale: 0.95 }, 0);

      tl.set("#s5-maya", { y: 80 }, 0);
      tl.set("#s5-logic-card", { y: -50 }, 0);

      tl.set("#s6-tablet", { scale: 0.9 }, 0);
      tl.set("#s6-cereal-compare", { x: 60 }, 0);

      tl.set("#s7-cart", { scale: 0.9 }, 0);
      tl.set("#s7-maya", { y: 60 }, 0);
      tl.set("#s7-companion", { y: 60 }, 0);
      tl.set("#s7-moral-card", { y: -40 }, 0);

      tl.set("#s8-seal", { scale: 0.85 }, 0);
      tl.set("#s8-channel-lockup", { y: 30 }, 0);

      // Subtitle Data
      const subtitles = [
        { start: 0.25, end: 5.41, text: "That tiny symbol on your food? It's a certification, not an ownership code.", source: "OU Kosher Certification (oukosher.org)" },
        { start: 5.75, end: 11.46, text: "This is the O-U mark. It means the product meets the Orthodox Union's kosher standards.", source: "OU Kosher Symbols Explained" },
        { start: 11.85, end: 18.45, text: "Kosher follows Jewish dietary law. Inspectors check ingredients, equipment, and how food is made.", source: "What Is Kosher Certification?" },
        { start: 19.00, end: 27.62, text: "Companies apply for certification. Yes, they pay fees. The process includes a plant visit, an assessment, and a contract.", source: "Steps for Kosher Certification" },
        { start: 28.15, end: 33.05, text: "But paying for a certification service doesn't prove that Jewish people control the food industry.", source: "Evidence-Based Public Reasoning" },
        { start: 33.70, end: 40.59, text: "Want to know who owns a company? Check its corporate records. A dietary label answers a different question.", source: "Corporate Filings & Public Disclosures" },
        { start: 41.20, end: 49.74, text: "Ask hard questions. Follow the evidence. But hold people responsible for their actions—not an entire community for its identity.", source: "Ethical Public Accountability" },
        { start: 50.35, end: 58.58, text: "The label belongs on the box. Not on an entire community. Beyond the Myth. Facts, not scapegoats.", source: "Beyond the Myth · Facts, not scapegoats" }
      ];

      // Hook subtitle updates
      subtitles.forEach((sub, i) => {
        tl.call(() => {
          document.getElementById("sub-text").textContent = sub.text;
          document.getElementById("sub-source").textContent = sub.source;
        }, null, sub.start);
      });

      // ==========================================
      // SCENE 1: 0.0s – 5.5s
      // ==========================================
      tl.set("#scene-1", { display: "flex" }, 0);
      
      // Fast box slide in from right and hand grab snap
      tl.to("#s1-box-wrapper", {
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
      tl.to("#s1-cereal-box", {
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

      // Pop in clarification badges
      tl.to("#s1-badges", {
        opacity: 1,
        y: 20,
        duration: 0.6,
        ease: "back.out(1.4)"
      }, 2.8);

      // Transition out of Scene 1
      tl.to("#scene-1", {
        opacity: 0,
        duration: 0.35,
        ease: "power2.in"
      }, 5.15);
      tl.set("#scene-1", { display: "none" }, 5.5);

      // ==========================================
      // SCENE 2: 5.5s – 11.6s
      // ==========================================
      tl.set("#scene-2", { display: "flex", opacity: 1 }, 5.5);

      tl.to("#s2-maya", {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power3.out"
      }, 5.6);

      tl.to("#s2-companion", {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out"
      }, 5.8);

      // Companion tilts head inquisitively
      tl.to("#s2-companion", {
        rotation: 3,
        duration: 1.2,
        yoyo: true,
        repeat: 3,
        ease: "sine.inOut"
      }, 6.5);

      // Maya gestures smoothly
      tl.to("#s2-maya", {
        x: 15,
        duration: 2.0,
        yoyo: true,
        repeat: 1,
        ease: "sine.inOut"
      }, 6.2);

      // Info card drops in
      tl.to("#s2-card", {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "back.out(1.2)"
      }, 6.8);

      // Transition out
      tl.to("#scene-2", {
        opacity: 0,
        duration: 0.35,
        ease: "power2.in"
      }, 11.25);
      tl.set("#scene-2", { display: "none" }, 11.6);

      // ==========================================
      // SCENE 3: 11.6s – 18.7s
      // ==========================================
      tl.set("#scene-3", { display: "flex", opacity: 1 }, 11.6);

      // Animate conveyor belt boxes continuously
      tl.to("#s3-conveyor-boxes", {
        x: -400,
        duration: 6.8,
        ease: "none"
      }, 11.6);

      // Scanner laser pulse
      tl.to("#s3-scanner-beam", {
        opacity: 0.4,
        duration: 0.3,
        repeat: 20,
        yoyo: true,
        ease: "sine.inOut"
      }, 11.8);

      tl.to("#s3-inspector", {
        opacity: 1,
        x: 0,
        duration: 0.7,
        ease: "power3.out"
      }, 11.8);

      tl.to("#s3-clipboard", {
        opacity: 1,
        x: 0,
        duration: 0.7,
        ease: "power3.out"
      }, 12.1);

      // Step 1: Ingredients checkmark
      tl.call(() => {
        document.getElementById("s3-box-1").textContent = "✓";
        document.getElementById("s3-box-1").style.background = "#e8f5e9";
      }, null, 13.5);

      // Step 2: Equipment checkmark
      tl.call(() => {
        document.getElementById("s3-box-2").textContent = "✓";
        document.getElementById("s3-box-2").style.background = "#e8f5e9";
      }, null, 15.0);

      // Step 3: Flow checkmark
      tl.call(() => {
        document.getElementById("s3-box-3").textContent = "✓";
        document.getElementById("s3-box-3").style.background = "#e8f5e9";
      }, null, 16.5);

      // Stamp appears
      tl.to("#s3-audit-stamp", {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        ease: "back.out(1.5)"
      }, 16.8);

      // Transition out
      tl.to("#scene-3", {
        opacity: 0,
        duration: 0.35,
        ease: "power2.in"
      }, 18.35);
      tl.set("#scene-3", { display: "none" }, 18.7);

      // ==========================================
      // SCENE 4: 18.7s – 27.8s
      // ==========================================
      tl.set("#scene-4", { display: "flex", opacity: 1 }, 18.7);

      tl.to("#s4-contract-folder", {
        opacity: 1,
        scale: 1,
        duration: 0.7,
        ease: "power3.out"
      }, 18.9);

      // Staggered documents slide in
      tl.to("#s4-doc-1", {
        opacity: 1,
        x: 0,
        duration: 0.5,
        ease: "power2.out"
      }, 19.8);

      tl.to("#s4-doc-2", {
        opacity: 1,
        x: 0,
        duration: 0.5,
        ease: "power2.out"
      }, 21.2);

      tl.to("#s4-doc-3", {
        opacity: 1,
        x: 0,
        duration: 0.5,
        ease: "power2.out"
      }, 22.8);

      // Highlight fee box pops
      tl.to("#s4-fee-highlight", {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: "back.out(1.3)"
      }, 24.5);

      // Steam animation
      tl.to("#s4-steam", {
        y: -20,
        opacity: 0.2,
        duration: 2.0,
        repeat: 3,
        yoyo: true,
        ease: "sine.inOut"
      }, 19.0);

      // Transition out
      tl.to("#scene-4", {
        opacity: 0,
        duration: 0.35,
        ease: "power2.in"
      }, 27.45);
      tl.set("#scene-4", { display: "none" }, 27.8);

      // ==========================================
      // SCENE 5: 27.8s – 33.3s
      // ==========================================
      tl.set("#scene-5", { display: "flex", opacity: 1 }, 27.8);

      tl.to("#s5-maya", {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power3.out"
      }, 28.0);

      tl.to("#s5-logic-card", {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "back.out(1.2)"
      }, 28.4);

      tl.to("#s5-maya", {
        rotation: -2,
        duration: 1.5,
        repeat: 2,
        yoyo: true,
        ease: "sine.inOut"
      }, 28.8);

      // Transition out
      tl.to("#scene-5", {
        opacity: 0,
        duration: 0.35,
        ease: "power2.in"
      }, 32.95);
      tl.set("#scene-5", { display: "none" }, 33.3);

      // ==========================================
      // SCENE 6: 33.3s – 40.8s
      // ==========================================
      tl.set("#scene-6", { display: "flex", opacity: 1 }, 33.3);

      tl.to("#s6-tablet", {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: "power3.out"
      }, 33.5);

      tl.to("#s6-cereal-compare", {
        opacity: 1,
        x: 0,
        duration: 0.7,
        ease: "power3.out"
      }, 34.5);

      // Subtle float between the two
      tl.to("#s6-tablet", {
        y: -15,
        duration: 2.0,
        yoyo: true,
        repeat: 2,
        ease: "sine.inOut"
      }, 34.8);

      // Transition out
      tl.to("#scene-6", {
        opacity: 0,
        duration: 0.35,
        ease: "power2.in"
      }, 40.45);
      tl.set("#scene-6", { display: "none" }, 40.8);

      // ==========================================
      // SCENE 7: 40.8s – 50.0s
      // ==========================================
      tl.set("#scene-7", { display: "flex", opacity: 1 }, 40.8);

      tl.to("#s7-cart", {
        opacity: 1,
        scale: 1,
        duration: 0.7,
        ease: "power3.out"
      }, 41.0);

      tl.to("#s7-maya", {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power3.out"
      }, 41.2);

      tl.to("#s7-companion", {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power3.out"
      }, 41.4);

      // Box gently bounces into cart
      tl.from("#s7-box-in-cart", {
        y: -120,
        opacity: 0,
        duration: 0.6,
        ease: "bounce.out"
      }, 42.5);

      tl.to("#s7-moral-card", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "back.out(1.2)"
      }, 43.5);

      // Transition out
      tl.to("#scene-7", {
        opacity: 0,
        duration: 0.35,
        ease: "power2.in"
      }, 49.65);
      tl.set("#scene-7", { display: "none" }, 50.0);

      // ==========================================
      // SCENE 8: 50.0s – 60.0s
      // ==========================================
      tl.set("#scene-8", { display: "flex", opacity: 1 }, 50.0);

      // Majestic grand seal emerges
      tl.to("#s8-seal", {
        opacity: 1,
        scale: 1,
        duration: 1.0,
        ease: "elastic.out(1, 0.75)"
      }, 50.2);

      // Rays rotate gently
      tl.to("#s8-rays", {
        rotation: 45,
        duration: 8.0,
        ease: "none"
      }, 50.5);

      // Channel lockup fades up
      tl.to("#s8-channel-lockup", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out"
      }, 51.5);

      // Seamless Loop transition at 59.2s:
      // Accelerate seal slightly to the left, seamlessly resetting
      tl.to("#s8-seal", {
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
console.log('Successfully generated clean index.html, size:', (htmlContent.length / 1024).toFixed(1), 'KB');

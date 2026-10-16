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
  // Replace data-layer to avoid hyperframes linter warning
  svg = svg.replace(/data-layer=/g, 'data-scene-layer=');
  return svg;
}

console.log('Generating realistic, full-canvas FORMA Pastel Studio 2.0 assets...');

// Assets
const svgs = {
  mercado: getAssetSvg('escenarios-mercado-01', { instance: 'sc-mercado', paletteName: 'editorial', width: 1080 }),
  mercadoCart: getAssetSvg('escenarios-mercado-02', { instance: 'sc-mercado-cart', paletteName: 'melocoton', width: 1080 }),
  lab: getAssetSvg('escenarios-laboratorio-01', { instance: 'sc-lab', paletteName: 'oceano', width: 1080 }),
  oficina: getAssetSvg('escenarios-oficina-01', { instance: 'sc-oficina', paletteName: 'aurora', width: 1080 }),
  calle: getAssetSvg('escenarios-calle-01', { instance: 'sc-calle', paletteName: 'melocoton', width: 1080 }),
  mayaPoint: getAssetSvg('personas-investigadora-01', { instance: 'maya-point', paletteName: 'editorial', width: 520 }),
  mayaTalk: getAssetSvg('personas-narrador-02', { instance: 'maya-talk', paletteName: 'editorial', width: 520 }),
  companionVecino: getAssetSvg('personas-vecino-01', { instance: 'comp-curious', paletteName: 'aurora', width: 500 }),
  companionListen: getAssetSvg('personas-adolescente-01', { instance: 'comp-listen', paletteName: 'jardin', width: 500 }),
  inspector: getAssetSvg('personas-ingeniera-01', { instance: 'insp-factory', paletteName: 'oceano', width: 520 }),
  rayos: getAssetSvg('efectos-rayos-01', { instance: 'fx-rayos', paletteName: 'editorial', width: 900 }),
  vapor: getAssetSvg('efectos-vapor-01', { instance: 'fx-vapor', paletteName: 'editorial', width: 340 }),
  destellos: getAssetSvg('efectos-destellos-01', { instance: 'fx-destellos', paletteName: 'editorial', width: 450 })
};

console.log('Assembling fully-grounded, realistic 1080x1920 index.html...');

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
      --color-ink: #201a2b;
      --color-paper: #fffaf5;
      --color-gold: #f4d084;
      --color-gold-dark: #a37207;
      --color-gold-metallic: linear-gradient(135deg, #f9e2a8 0%, #d4af37 50%, #aa820a 100%);
      --color-teal: #70c4b8;
      --color-teal-dark: #2a6860;
      --color-rust: #f0958b;
      --color-rust-dark: #a6392f;
      --color-blue: #9f8fd0;
      --color-sage: #acc897;
      --color-shadow: rgba(32, 26, 43, 0.22);
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
      background-color: #120e18;
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
      background-color: #f6f1e8;
      color: var(--color-ink);
    }

    /* Tactile Paper Texture & Print Grain */
    .texture-paper {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 99;
      opacity: 0.32;
      mix-blend-mode: multiply;
      background-image: radial-gradient(circle at 50% 30%, transparent 45%, rgba(32, 26, 43, 0.12) 100%),
                        linear-gradient(rgba(0,0,0,0.025) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(0,0,0,0.025) 1px, transparent 1px);
      background-size: 100% 100%, 6px 6px, 6px 6px;
    }

    /* Cinematic Depth Vignette */
    .depth-vignette {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 98;
      background: radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(24, 18, 33, 0.35) 100%);
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
      background: rgba(255, 250, 245, 0.94);
      backdrop-filter: blur(16px);
      padding: 12px 28px;
      border-radius: 999px;
      border: 3px solid var(--color-ink);
      box-shadow: 0 10px 28px var(--color-shadow);
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
      box-shadow: 0 10px 28px rgba(0, 0, 0, 0.25);
    }

    /* Subtitle Overlay Bar */
    .subtitle-overlay {
      position: absolute;
      bottom: 80px;
      left: 60px;
      right: 60px;
      min-height: 150px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 24px 36px;
      background: rgba(22, 17, 30, 0.94);
      backdrop-filter: blur(20px);
      border-radius: 28px;
      border: 2px solid rgba(244, 208, 132, 0.45);
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
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
      font-weight: 600;
      letter-spacing: 0.08em;
      color: var(--color-gold);
      text-transform: uppercase;
    }

    /* Full-Canvas Scene Wrapper */
    .scene {
      position: absolute;
      inset: 0;
      width: 1080px;
      height: 1920px;
      display: none;
      overflow: hidden;
    }

    /* Ground Floor Planes (Realistic Perspective & Flooring) */
    .ground-floor-supermarket {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 680px;
      background: linear-gradient(180deg, #d8d0c0 0%, #c4baa5 100%);
      border-top: 3px solid rgba(32, 26, 43, 0.2);
      z-index: 15;
      background-image: 
        linear-gradient(rgba(255,255,255,0.4) 2px, transparent 2px),
        linear-gradient(90deg, rgba(32,26,43,0.06) 2px, transparent 2px);
      background-size: 160px 80px, 160px 80px;
    }

    .ground-floor-factory {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 680px;
      background: linear-gradient(180deg, #8893a6 0%, #616e82 100%);
      border-top: 4px solid #3c4554;
      z-index: 15;
      box-shadow: inset 0 20px 40px rgba(0,0,0,0.25);
    }

    .ground-floor-office {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 720px;
      background: linear-gradient(180deg, #7c4f30 0%, #4a2d18 100%);
      border-top: 5px solid #2e1a0d;
      z-index: 15;
      box-shadow: inset 0 24px 50px rgba(0,0,0,0.4);
    }

    .ground-floor-street {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 650px;
      background: linear-gradient(180deg, #b8b0a2 0%, #948b7c 100%);
      border-top: 4px solid #4a4338;
      z-index: 15;
      background-image: radial-gradient(circle at 50% 50%, rgba(0,0,0,0.04) 15%, transparent 20%);
      background-size: 40px 40px;
    }

    /* Character Floor Shadows (Grounded realism) */
    .char-shadow {
      position: absolute;
      bottom: 270px;
      width: 260px;
      height: 28px;
      border-radius: 50%;
      background: radial-gradient(ellipse at 50% 50%, rgba(20, 16, 28, 0.45) 0%, transparent 75%);
      z-index: 22;
      pointer-events: none;
    }

    /* Enhanced Glass Card */
    .glass-card {
      background: rgba(255, 250, 245, 0.96);
      border: 3px solid var(--color-ink);
      border-radius: 32px;
      box-shadow: 0 24px 60px var(--color-shadow);
      padding: 36px 40px;
    }

    /* High-Fidelity 3D Cereal Box */
    .cereal-box-3d {
      position: relative;
      width: 520px;
      height: 740px;
      background: linear-gradient(145deg, #fef1b8 0%, #f6d16d 60%, #e2b545 100%);
      border: 4px solid var(--color-ink);
      border-radius: 24px;
      box-shadow: 36px 48px 80px rgba(32, 26, 43, 0.38),
                  inset 4px 4px 0 rgba(255, 255, 255, 0.7);
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 36px 32px;
      overflow: hidden;
    }

    .cereal-box-flap {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 38px;
      background: #ecd17d;
      border-bottom: 3px dashed rgba(32, 26, 43, 0.35);
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: var(--font-mono);
      font-size: 14px;
      letter-spacing: 0.16em;
      font-weight: 700;
      color: #382d1c;
    }

    .cereal-brand {
      margin-top: 40px;
      font-family: var(--font-display);
      font-size: 56px;
      font-weight: 800;
      color: #8c3222;
      text-align: center;
      line-height: 1.05;
      text-shadow: 2px 2px 0 rgba(255, 255, 255, 0.8);
    }

    .cereal-subbrand {
      font-family: var(--font-mono);
      font-size: 20px;
      font-weight: 700;
      color: #2a6860;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      margin-top: 6px;
    }

    .cereal-bowl-svg {
      width: 360px;
      height: 250px;
      margin-top: 24px;
      filter: drop-shadow(0 12px 24px rgba(32, 26, 43, 0.15));
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
      font-size: 14px;
      font-weight: 700;
      color: var(--color-ink);
    }

    /* Metallic Foil OU Seal */
    .cereal-ou-symbol {
      position: relative;
      width: 96px;
      height: 96px;
      background: radial-gradient(circle at 35% 35%, #fffdf8, #f4d084 75%, #caa03a 100%);
      border: 4px solid var(--color-ink);
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      box-shadow: 0 10px 24px rgba(0, 0, 0, 0.22), inset 0 2px 6px rgba(255, 255, 255, 0.8);
    }

    .cereal-ou-symbol span {
      font-family: var(--font-display);
      font-size: 58px;
      font-weight: 900;
      color: var(--color-ink);
      line-height: 1;
      margin-top: -4px;
    }

    /* Magnifying Glass */
    .magnifier {
      position: absolute;
      width: 340px;
      height: 340px;
      pointer-events: none;
      z-index: 60;
    }

    .magnifier-glass {
      width: 240px;
      height: 240px;
      border-radius: 50%;
      border: 15px solid #d4af37;
      background: radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.5), rgba(244, 208, 132, 0.18) 65%, rgba(170, 130, 10, 0.35) 100%);
      box-shadow: 0 24px 70px rgba(0, 0, 0, 0.35), inset 0 0 30px rgba(255, 255, 255, 0.7);
      position: relative;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .magnifier-handle {
      position: absolute;
      top: 200px;
      left: 200px;
      width: 26px;
      height: 150px;
      background: linear-gradient(90deg, #593d23, #8f6033 50%, #3e2a18);
      border: 3px solid var(--color-ink);
      border-radius: 13px;
      transform: rotate(-45deg);
      transform-origin: top left;
      box-shadow: 10px 14px 28px rgba(0, 0, 0, 0.3);
    }

    /* Conveyor Belt */
    .conveyor-belt {
      position: relative;
      width: 1080px;
      height: 180px;
      background: #464f5f;
      border-top: 6px solid #232832;
      border-bottom: 6px solid #232832;
      display: flex;
      align-items: center;
      overflow: hidden;
      box-shadow: 0 24px 60px rgba(0,0,0,0.4);
    }

    .conveyor-rollers {
      position: absolute;
      inset: 0;
      display: flex;
      gap: 36px;
      align-items: center;
    }

    .roller {
      width: 22px;
      height: 156px;
      background: linear-gradient(90deg, #7c889f, #c7cfdd 50%, #5d677a);
      border-radius: 11px;
    }

    /* Metal Clipboard */
    .clipboard-prop {
      width: 380px;
      height: 540px;
      background: #b8915e;
      border: 4px solid var(--color-ink);
      border-radius: 24px;
      box-shadow: 0 28px 70px var(--color-shadow);
      padding: 32px 26px;
      position: relative;
    }

    .clipboard-clip {
      position: absolute;
      top: -24px;
      left: 50%;
      transform: translateX(-50%);
      width: 130px;
      height: 50px;
      background: linear-gradient(180deg, #e4e9f2, #919aa8);
      border: 3px solid var(--color-ink);
      border-radius: 12px;
      box-shadow: 0 6px 14px rgba(0,0,0,0.2);
    }

    .clipboard-sheet {
      width: 100%;
      height: 100%;
      background: #fffdf9;
      border: 2px solid #e2ddd5;
      border-radius: 14px;
      padding: 24px 20px;
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    .checklist-row {
      display: flex;
      align-items: center;
      gap: 14px;
      font-size: 19px;
      font-weight: 700;
      font-family: var(--font-mono);
      color: var(--color-ink);
    }

    .check-box {
      width: 34px;
      height: 34px;
      border-radius: 9px;
      border: 3px solid var(--color-ink);
      background: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 24px;
      font-weight: 900;
      color: #1e7024;
    }

    /* Apple-style iPad Pro Tablet */
    .tablet-frame {
      width: 660px;
      height: 860px;
      background: #18151e;
      border-radius: 44px;
      border: 8px solid #322d3d;
      box-shadow: 0 36px 90px rgba(0, 0, 0, 0.55), inset 0 0 12px rgba(255,255,255,0.1);
      padding: 22px;
      position: relative;
    }

    .tablet-screen {
      width: 100%;
      height: 100%;
      background: #fbf8f2;
      border-radius: 30px;
      overflow: hidden;
      padding: 36px 32px;
      display: flex;
      flex-direction: column;
      box-shadow: inset 0 0 16px rgba(0,0,0,0.06);
    }

    /* Shopping Cart 3D Wireframe */
    .cart-3d {
      position: relative;
      width: 480px;
      height: 440px;
      filter: drop-shadow(0 24px 50px rgba(0,0,0,0.3));
    }

    /* Closing Seal */
    .closing-seal {
      position: relative;
      width: 500px;
      height: 500px;
      border-radius: 50%;
      background: radial-gradient(circle at 35% 35%, #fffdf8 25%, #fbf1da 65%, #f2ca6b 100%);
      border: 10px double var(--color-ink);
      box-shadow: 0 30px 90px rgba(24, 18, 33, 0.45), inset 0 0 30px rgba(255,255,255,0.8);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      padding: 44px;
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
      <!-- Full-Bleed Receding Supermarket Background -->
      <div style="position: absolute; top: 0; left: 0; right: 0; height: 1300px; filter: blur(5px) brightness(0.9); opacity: 0.75;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true" data-layout-allow-overflow="true">
        ${svgs.mercado}
      </div>

      <!-- Supermarket Tile Floor with Reflections -->
      <div class="ground-floor-supermarket" data-layout-allow-overlap="true" data-layout-allow-occlusion="true"></div>

      <!-- Atmospheric Sunbeams from Skylight -->
      <div id="s1-rayos" style="position: absolute; top: -100px; left: 90px; opacity: 0.45; mix-blend-mode: screen;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true" data-layout-allow-overflow="true">
        ${svgs.rayos}
      </div>

      <!-- Floor Contact Shadow for Box & Person -->
      <div class="char-shadow" style="left: 410px; bottom: 420px; width: 340px; height: 36px;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true"></div>

      <!-- Midground: Hero 2.5D Cereal Box & Articulated Arm -->
      <div style="position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: center; align-items: center; z-index: 30; padding-bottom: 120px;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
        
        <div id="s1-box-wrapper" style="will-change: transform;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
          <div class="cereal-box-3d" id="s1-cereal-box" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
            <div class="cereal-box-flap">· OPEN HERE · CRISP SEAL ·</div>
            <div class="cereal-brand">HONEY<br>CRUNCH</div>
            <div class="cereal-subbrand">Whole Grain Toasted Oats</div>
            
            <!-- Cereal Bowl SVG Graphic with Milk & Honey -->
            <svg class="cereal-bowl-svg" viewBox="0 0 360 250" fill="none">
              <ellipse cx="180" cy="210" rx="160" ry="26" fill="rgba(32,26,43,0.18)"/>
              <path d="M40 100 Q180 94 320 100 Q308 195 180 200 Q52 195 40 100Z" fill="#70c4b8" stroke="#201a2b" stroke-width="4.5"/>
              <path d="M50 106 Q180 102 310 106 Q298 165 180 172 Q62 165 50 106Z" fill="#fffaf5"/>
              <!-- Golden Flakes -->
              <circle cx="120" cy="120" r="16" fill="#f4d084" stroke="#201a2b" stroke-width="2.5"/>
              <circle cx="165" cy="114" r="18" fill="#f4d084" stroke="#201a2b" stroke-width="2.5"/>
              <circle cx="210" cy="122" r="15" fill="#f4d084" stroke="#201a2b" stroke-width="2.5"/>
              <circle cx="140" cy="140" r="17" fill="#f4d084" stroke="#201a2b" stroke-width="2.5"/>
              <circle cx="190" cy="142" r="16" fill="#f4d084" stroke="#201a2b" stroke-width="2.5"/>
              <!-- Amber Honey Drizzle -->
              <path d="M85 85 Q145 110 180 75 Q215 120 275 95" stroke="#d97706" stroke-width="7" stroke-linecap="round"/>
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

        <!-- Realistic Articulated Hand Grabbing Box -->
        <div id="s1-hand" style="position: absolute; right: -80px; bottom: 380px; z-index: 55;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
          <svg width="460" height="360" viewBox="0 0 460 360" fill="none">
            <!-- Tailored suit sleeve -->
            <path d="M240 180 L460 220 L460 360 L190 360 Z" fill="#2a6860" stroke="#201a2b" stroke-width="5"/>
            <!-- Crisp shirt cuff -->
            <path d="M205 170 L245 180 L210 360 L170 350 Z" fill="#fffaf5" stroke="#201a2b" stroke-width="4"/>
            <!-- Palm and knuckles with shading -->
            <path d="M100 135 Q145 105 195 135 Q225 175 205 240 Q160 285 110 240 Q80 185 100 135Z" fill="#e7b595" stroke="#201a2b" stroke-width="4.5"/>
            <!-- 4 Articulated Fingers wrapped on box -->
            <rect x="25" y="105" width="120" height="36" rx="18" fill="#e7b595" stroke="#201a2b" stroke-width="4"/>
            <rect x="15" y="148" width="130" height="36" rx="18" fill="#e7b595" stroke="#201a2b" stroke-width="4"/>
            <rect x="20" y="190" width="125" height="36" rx="18" fill="#e7b595" stroke="#201a2b" stroke-width="4"/>
            <rect x="40" y="232" width="110" height="34" rx="17" fill="#e7b595" stroke="#201a2b" stroke-width="4"/>
            <!-- Thumb -->
            <path d="M150 115 Q130 65 85 75 Q70 95 105 125 Z" fill="#e7b595" stroke="#201a2b" stroke-width="4"/>
          </svg>
        </div>

        <!-- Realistic Magnifier with Glass Refraction -->
        <div class="magnifier" id="s1-magnifier" style="top: 800px; left: 470px; opacity: 0;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
          <div class="magnifier-glass">
            <span style="font-family: var(--font-display); font-size: 140px; font-weight: 900; color: #201a2b;">Ⓤ</span>
            <div style="position: absolute; top: 18px; left: 28px; width: 70px; height: 40px; border-radius: 50%; background: rgba(255,255,255,0.75); transform: rotate(-30deg);"></div>
          </div>
          <div class="magnifier-handle"></div>
        </div>

        <!-- Clarification Badges -->
        <div id="s1-badges" style="position: absolute; top: 350px; display: flex; flex-direction: column; gap: 20px; align-items: center; opacity: 0;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
          <div style="background: #70c4b8; color: #201a2b; border: 3px solid #201a2b; padding: 16px 36px; border-radius: 999px; font-family: var(--font-mono); font-size: 26px; font-weight: 800; letter-spacing: 0.08em; box-shadow: 0 12px 30px var(--color-shadow);">
            ✓ DIETARY CERTIFICATION
          </div>
          <div style="background: #f0958b; color: #201a2b; border: 3px solid #201a2b; padding: 16px 36px; border-radius: 999px; font-family: var(--font-mono); font-size: 26px; font-weight: 800; letter-spacing: 0.08em; text-decoration: line-through; box-shadow: 0 12px 30px var(--color-shadow);">
            ✕ NOT AN OWNERSHIP CODE
          </div>
        </div>
      </div>
    </div>

    <!-- ==========================================
         SCENE 2: Maya & Companion (5.5s – 11.6s)
         ========================================== -->
    <div class="scene" id="scene-2" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
      <!-- Full-Bleed Supermarket Interior Background -->
      <div style="position: absolute; top: 0; left: 0; right: 0; height: 1300px; opacity: 0.85;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true" data-layout-allow-overflow="true">
        ${svgs.mercado}
      </div>

      <!-- Supermarket Tile Floor -->
      <div class="ground-floor-supermarket" data-layout-allow-overlap="true" data-layout-allow-occlusion="true"></div>

      <!-- Hanging Aisle Sign -->
      <div style="position: absolute; top: 150px; left: 50%; transform: translateX(-50%); background: #201a2b; color: #f4d084; padding: 14px 52px; border-radius: 18px; border: 3px solid #f4d084; font-family: var(--font-mono); font-size: 22px; font-weight: 700; letter-spacing: 0.12em; z-index: 25; box-shadow: 0 12px 32px rgba(0,0,0,0.35);" data-layout-allow-overlap="true">
        AISLE 04 · BREAKFAST GRAINS & CEREALS
      </div>

      <!-- Contact Shadows for Both Characters -->
      <div class="char-shadow" style="left: 170px; bottom: 250px;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true"></div>
      <div class="char-shadow" style="right: 170px; bottom: 250px;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true"></div>

      <!-- Characters Standing Grounded on the Floor -->
      <div style="position: absolute; inset: 0; display: flex; justify-content: space-around; align-items: flex-end; padding-bottom: 250px; z-index: 30;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
        <!-- Companion (Curious listener) -->
        <div id="s2-companion" style="opacity: 0;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
          ${svgs.companionVecino}
        </div>

        <!-- Maya (Investigator presenting the product) -->
        <div id="s2-maya" style="opacity: 0;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
          ${svgs.mayaPoint}
        </div>
      </div>

      <!-- Hero Information Card (Framed at Top) -->
      <div class="glass-card" id="s2-card" style="position: absolute; top: 250px; left: 80px; right: 80px; z-index: 35; opacity: 0;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
        <div style="display: flex; align-items: center; gap: 24px;">
          <div class="cereal-ou-symbol" style="width: 100px; height: 100px;">
            <span style="font-size: 60px;">Ⓤ</span>
          </div>
          <div>
            <h3 style="font-family: var(--font-display); font-size: 40px; font-weight: 700; color: #201a2b; line-height: 1.1;">The Orthodox Union Mark</h3>
            <p style="font-family: var(--font-mono); font-size: 20px; font-weight: 700; color: #2a6860; margin-top: 6px;">FOUNDED 1898 · INDEPENDENT NONPROFIT AUDIT</p>
          </div>
        </div>
        <div style="margin-top: 24px; padding-top: 20px; border-top: 2px dashed rgba(32,26,43,0.22); font-size: 24px; line-height: 1.4; color: #362e45;">
          Confirms that food preparation conforms strictly to Jewish dietary laws. <strong>It conveys zero corporate ownership or control.</strong>
        </div>
      </div>
    </div>

    <!-- ==========================================
         SCENE 3: Factory Inspection (11.6s – 18.7s)
         ========================================== -->
    <div class="scene" id="scene-3" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
      <!-- High-Tech Factory Lab Background -->
      <div style="position: absolute; top: 0; left: 0; right: 0; height: 1300px; opacity: 0.9;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true" data-layout-allow-overflow="true">
        ${svgs.lab}
      </div>

      <!-- Factory Floor -->
      <div class="ground-floor-factory" data-layout-allow-overlap="true" data-layout-allow-occlusion="true"></div>

      <!-- Sunbeams from Skylights -->
      <div style="position: absolute; top: -60px; right: 40px; opacity: 0.4; mix-blend-mode: screen;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true" data-layout-allow-overflow="true">
        ${svgs.rayos}
      </div>

      <!-- Conveyor Belt with Moving Boxes & Scanning Laser -->
      <div style="position: absolute; top: 620px; left: 0; right: 0; z-index: 25;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
        <div class="conveyor-belt" id="s3-conveyor" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
          <div class="conveyor-rollers" id="s3-rollers">
            ${Array.from({ length: 32 }, () => '<div class="roller"></div>').join('')}
          </div>
          <!-- Boxes moving on conveyor -->
          <div id="s3-conveyor-boxes" style="position: absolute; inset: 0; display: flex; align-items: center; gap: 200px;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true" data-layout-allow-overflow="true">
            <div style="width: 110px; height: 140px; background: #fce8a6; border: 3px solid #201a2b; border-radius: 8px; display: flex; justify-content: center; align-items: center; font-weight: 700; font-size: 16px;" data-layout-allow-overflow="true">OATS Ⓤ</div>
            <div style="width: 110px; height: 140px; background: #fce8a6; border: 3px solid #201a2b; border-radius: 8px; display: flex; justify-content: center; align-items: center; font-weight: 700; font-size: 16px;" data-layout-allow-overflow="true">OATS Ⓤ</div>
            <div style="width: 110px; height: 140px; background: #fce8a6; border: 3px solid #201a2b; border-radius: 8px; display: flex; justify-content: center; align-items: center; font-weight: 700; font-size: 16px;" data-layout-allow-overflow="true">OATS Ⓤ</div>
            <div style="width: 110px; height: 140px; background: #fce8a6; border: 3px solid #201a2b; border-radius: 8px; display: flex; justify-content: center; align-items: center; font-weight: 700; font-size: 16px;" data-layout-allow-overflow="true">OATS Ⓤ</div>
            <div style="width: 110px; height: 140px; background: #fce8a6; border: 3px solid #201a2b; border-radius: 8px; display: flex; justify-content: center; align-items: center; font-weight: 700; font-size: 16px;" data-layout-allow-overflow="true">OATS Ⓤ</div>
          </div>
          <!-- Scanning Laser Line -->
          <div id="s3-scanner-beam" style="position: absolute; left: 540px; top: 0; bottom: 0; width: 8px; background: #34d399; box-shadow: 0 0 28px #34d399; z-index: 10;"></div>
        </div>
      </div>

      <!-- Inspector Floor Shadow -->
      <div class="char-shadow" style="left: 120px; bottom: 250px;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true"></div>

      <!-- Inspector & Metal Checklist Grounded on Floor -->
      <div style="position: absolute; bottom: 250px; left: 80px; right: 80px; display: flex; justify-content: space-between; align-items: flex-end; z-index: 30;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
        <!-- Food Safety Inspector -->
        <div id="s3-inspector" style="opacity: 0;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
          ${svgs.inspector}
        </div>

        <!-- Metallic Clipboard Audit Checklist -->
        <div class="clipboard-prop" id="s3-clipboard" style="opacity: 0;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
          <div class="clipboard-clip"></div>
          <div class="clipboard-sheet" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
            <div style="font-family: var(--font-mono); font-size: 17px; font-weight: 800; color: #2a6860; letter-spacing: 0.1em; border-bottom: 2px solid #e8e3dc; padding-bottom: 8px;">
              ON-SITE AUDIT PROTOCOL
            </div>
            <div class="checklist-row" id="s3-check-1">
              <div class="check-box" id="s3-box-1"></div>
              <span>1. Ingredients Sourcing</span>
            </div>
            <div class="checklist-row" id="s3-check-2">
              <div class="check-box" id="s3-box-2"></div>
              <span>2. Clean Equipment Lines</span>
            </div>
            <div class="checklist-row" id="s3-check-3">
              <div class="check-box" id="s3-box-3"></div>
              <span>3. Manufacturing Flow</span>
            </div>
            
            <!-- Compliance Hologram Stamp -->
            <div id="s3-audit-stamp" style="margin-top: 10px; padding: 14px; background: rgba(112, 196, 184, 0.25); border: 2px dashed #2a6860; border-radius: 12px; text-align: center; opacity: 0;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
              <div style="font-family: var(--font-mono); font-size: 20px; font-weight: 800; color: #1e7024;">
                ✓ AUDIT PASSED · COMPLIANT
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
      <!-- Executive Office Background -->
      <div style="position: absolute; top: 0; left: 0; right: 0; height: 1200px; opacity: 0.85;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true" data-layout-allow-overflow="true">
        ${svgs.oficina}
      </div>

      <!-- Rich Walnut Wood Desk Lower Half -->
      <div class="ground-floor-office" data-layout-allow-overlap="true" data-layout-allow-occlusion="true"></div>

      <!-- Lamp Cone of Warm Light -->
      <div style="position: absolute; top: 50px; left: 100px; opacity: 0.45; mix-blend-mode: screen;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true" data-layout-allow-overflow="true">
        ${svgs.rayos}
      </div>

      <!-- Midground: Folder Document & Fees Staging -->
      <div style="position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: center; align-items: center; z-index: 30; padding-top: 60px;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
        
        <!-- Multi-Folder Contract Stash -->
        <div id="s4-contract-folder" class="glass-card" style="width: 880px; padding: 44px; border-width: 4px; opacity: 0;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
          
          <!-- Header with Scales of Justice Seal -->
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid var(--color-ink); padding-bottom: 20px;" data-layout-allow-overlap="true">
            <div>
              <span style="font-family: var(--font-mono); font-size: 18px; font-weight: 700; color: #a37207; letter-spacing: 0.12em;">EXECUTIVE EXHIBIT · SCHEDULE B</span>
              <h2 style="font-family: var(--font-display); font-size: 42px; font-weight: 700; color: var(--color-ink); margin-top: 4px;">Kosher Certification Contract</h2>
            </div>
            <div style="width: 76px; height: 76px; border-radius: 50%; background: #f4d084; border: 3px solid var(--color-ink); display: flex; justify-content: center; align-items: center; font-size: 38px;">
              ⚖
            </div>
          </div>

          <!-- Staggered 3-Step Process Flow -->
          <div style="display: flex; flex-direction: column; gap: 18px; margin-top: 28px;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
            <div id="s4-doc-1" style="display: flex; justify-content: space-between; align-items: center; background: #fffdf9; padding: 18px 24px; border-radius: 16px; border: 2px solid #201a2b; box-shadow: 0 6px 16px rgba(0,0,0,0.06); opacity: 0;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
              <div>
                <h4 style="font-family: var(--font-mono); font-size: 22px; font-weight: 800; color: #201a2b;">1. Application Form</h4>
                <p style="font-size: 18px; color: #524b60; margin-top: 2px;">Company requests voluntary inspection & submits ingredients.</p>
              </div>
              <span style="font-family: var(--font-mono); font-weight: 700; font-size: 16px; color: #2a6860; background: #e0f2f1; padding: 6px 14px; border-radius: 999px;">STEP 1</span>
            </div>

            <div id="s4-doc-2" style="display: flex; justify-content: space-between; align-items: center; background: #fffdf9; padding: 18px 24px; border-radius: 16px; border: 2px solid #201a2b; box-shadow: 0 6px 16px rgba(0,0,0,0.06); opacity: 0;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
              <div>
                <h4 style="font-family: var(--font-mono); font-size: 22px; font-weight: 800; color: #201a2b;">2. Plant Visit Audit</h4>
                <p style="font-size: 18px; color: #524b60; margin-top: 2px;">Field rabbinic coordinator inspects machines and suppliers.</p>
              </div>
              <span style="font-family: var(--font-mono); font-weight: 700; font-size: 16px; color: #2a6860; background: #e0f2f1; padding: 6px 14px; border-radius: 999px;">STEP 2</span>
            </div>

            <div id="s4-doc-3" style="display: flex; justify-content: space-between; align-items: center; background: #fffdf9; padding: 18px 24px; border-radius: 16px; border: 2px solid #201a2b; box-shadow: 0 6px 16px rgba(0,0,0,0.06); opacity: 0;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
              <div>
                <h4 style="font-family: var(--font-mono); font-size: 22px; font-weight: 800; color: #201a2b;">3. Formal Fee Agreement</h4>
                <p style="font-size: 18px; color: #524b60; margin-top: 2px;">Covers audit labor, laboratory analysis & travel expenses.</p>
              </div>
              <span style="font-family: var(--font-mono); font-weight: 700; font-size: 16px; color: #2a6860; background: #e0f2f1; padding: 6px 14px; border-radius: 999px;">STEP 3</span>
            </div>
          </div>

          <!-- Highlight Clause: What the Fee Actually Is -->
          <div id="s4-fee-highlight" style="margin-top: 26px; background: #fef3c7; border: 3px solid #b8860b; border-radius: 20px; padding: 22px 26px; display: flex; justify-content: space-between; align-items: center; opacity: 0;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
            <div>
              <div style="font-family: var(--font-mono); font-size: 16px; font-weight: 800; color: #92400e;">FEE TYPE: INDEPENDENT SERVICE AUDIT</div>
              <div style="font-size: 24px; font-weight: 700; color: #78350f; margin-top: 4px;">Flat Service Fee · 0% Equity · No Royalties</div>
            </div>
            <div style="font-family: var(--font-mono); font-size: 32px; font-weight: 900; color: #92400e; background: #fff; padding: 10px 24px; border-radius: 12px; border: 2px solid #92400e;">
              0% STOCK
            </div>
          </div>
        </div>

        <!-- Steaming Coffee Cup on the Wooden Desk -->
        <div style="position: absolute; bottom: 250px; right: 120px; display: flex; flex-direction: column; align-items: center;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
          <div id="s4-steam" style="opacity: 0.65; margin-bottom: -15px;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
            ${svgs.vapor}
          </div>
          <svg width="100" height="80" viewBox="0 0 100 80">
            <rect x="20" y="15" width="55" height="55" rx="10" fill="#70c4b8" stroke="#201a2b" stroke-width="3.5"/>
            <path d="M75 25 Q90 25 90 42 Q90 60 75 60" fill="none" stroke="#201a2b" stroke-width="3.5"/>
            <ellipse cx="47" cy="17" rx="27" ry="7" fill="#2a6860"/>
            <ellipse cx="47" cy="72" rx="40" ry="6" fill="rgba(20,16,28,0.25)"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- ==========================================
         SCENE 5: The City & Public Logic (27.8s – 33.3s)
         ========================================== -->
    <div class="scene" id="scene-5" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
      <!-- Pastel City Street Corner Background -->
      <div style="position: absolute; top: 0; left: 0; right: 0; height: 1300px; opacity: 0.9;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true" data-layout-allow-overflow="true">
        ${svgs.calle}
      </div>

      <!-- Cobblestone Street Ground -->
      <div class="ground-floor-street" data-layout-allow-overlap="true" data-layout-allow-occlusion="true"></div>

      <!-- Presenter Shadow on Sidewalk -->
      <div class="char-shadow" style="left: 50%; transform: translateX(-50%); bottom: 250px;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true"></div>

      <!-- Midground: Maya Grounded on the Sidewalk -->
      <div style="position: absolute; inset: 0; display: flex; justify-content: center; align-items: flex-end; padding-bottom: 250px; z-index: 30;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
        <div id="s5-maya" style="opacity: 0;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
          ${svgs.mayaTalk}
        </div>
      </div>

      <!-- Logic Comparison Billboard -->
      <div class="glass-card" id="s5-logic-card" style="position: absolute; top: 230px; left: 80px; right: 80px; z-index: 35; opacity: 0;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
        <h3 style="font-family: var(--font-display); font-size: 38px; font-weight: 700; color: #201a2b; text-align: center;">
          Understanding Everyday Commerce
        </h3>
        <p style="font-family: var(--font-mono); font-size: 18px; color: #524b60; text-align: center; margin-top: 6px;">
          COMMON BUSINESS SENSE VS. CONSPIRACY FALLACIES
        </p>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 26px;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
          <!-- Left: Standard Commercial Service -->
          <div style="background: #e8f5e9; border: 2px solid #2e7d32; border-radius: 20px; padding: 24px;">
            <div style="font-family: var(--font-mono); font-size: 16px; font-weight: 800; color: #2e7d32; letter-spacing: 0.08em;">
              COMMERCIAL REALITY
            </div>
            <div style="font-size: 21px; font-weight: 700; color: #1b5e20; margin-top: 10px;">
              Paying for a Service
            </div>
            <p style="font-size: 17px; color: #2e7d32; margin-top: 8px; line-height: 1.4;">
              Just like paying an electrician, fire marshal, or organic certifier—you pay for inspection work.
            </p>
          </div>

          <!-- Right: False Jump to Ownership -->
          <div style="background: #ffebee; border: 2px solid #c62828; border-radius: 20px; padding: 24px;">
            <div style="font-family: var(--font-mono); font-size: 16px; font-weight: 800; color: #c62828; letter-spacing: 0.08em;">
              FALSE LEAP
            </div>
            <div style="font-size: 21px; font-weight: 700; color: #b71c1c; margin-top: 10px;">
              Claiming "Control"
            </div>
            <p style="font-size: 17px; color: #c62828; margin-top: 8px; line-height: 1.4;">
              Paying an audit fee does NOT grant an agency or a religious community control over the corporation.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- ==========================================
         SCENE 6: Tablet vs. Box (33.3s – 40.8s)
         ========================================== -->
    <div class="scene" id="scene-6" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
      <!-- Background: Architectural Neutral Studio -->
      <div style="position: absolute; inset: 0; background: radial-gradient(circle at 50% 40%, #faf7f0 20%, #eae2d3 90%);"></div>

      <!-- Staging: Realistic iPad Pro Tablet vs. Cereal Box Seal -->
      <div style="position: absolute; inset: 0; display: flex; justify-content: center; align-items: center; gap: 40px; padding-bottom: 80px; z-index: 30;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
        
        <!-- Modern Glass Tablet showing SEC EDGAR Filing -->
        <div class="tablet-frame" id="s6-tablet" style="opacity: 0;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
          <div class="tablet-screen" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
            <!-- Tablet Status Bar -->
            <div style="display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 14px; font-weight: 700; color: #777; margin-bottom: 20px;">
              <span>9:41 AM · SEC EDGAR PUBLIC DISCLOSURES</span>
              <span>100% 🔋</span>
            </div>

            <!-- SEC Form Header -->
            <div style="border-bottom: 2px solid #201a2b; padding-bottom: 16px;">
              <span style="font-family: var(--font-mono); font-size: 16px; font-weight: 800; color: #2a6860;">UNITED STATES SEC · FORM 10-K</span>
              <h3 style="font-family: var(--font-display); font-size: 34px; font-weight: 700; color: #201a2b; margin-top: 4px;">Public Company Ownership</h3>
              <p style="font-size: 16px; color: #666;">Annual Verified Institutional Shareholder Registry</p>
            </div>

            <!-- Ownership Donut Chart -->
            <div style="display: flex; align-items: center; justify-content: space-around; margin-top: 32px;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
              <svg width="220" height="220" viewBox="0 0 220 220">
                <circle cx="110" cy="110" r="80" fill="transparent" stroke="#9f8fd0" stroke-width="40" stroke-dasharray="210 500" stroke-dashoffset="0"/>
                <circle cx="110" cy="110" r="80" fill="transparent" stroke="#70c4b8" stroke-width="40" stroke-dasharray="190 500" stroke-dashoffset="-210"/>
                <circle cx="110" cy="110" r="80" fill="transparent" stroke="#f4d084" stroke-width="40" stroke-dasharray="102 500" stroke-dashoffset="-400"/>
              </svg>
              <div style="display: flex; flex-direction: column; gap: 14px; font-family: var(--font-mono); font-size: 15px; font-weight: 700;">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <div style="width: 16px; height: 16px; background: #9f8fd0; border-radius: 4px;"></div>
                  <span>42% Institutional Funds</span>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                  <div style="width: 16px; height: 16px; background: #70c4b8; border-radius: 4px;"></div>
                  <span>38% Public Shareholders</span>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                  <div style="width: 16px; height: 16px; background: #f4d084; border-radius: 4px;"></div>
                  <span>20% Founders / Execs</span>
                </div>
              </div>
            </div>

            <!-- Explanatory Verdict -->
            <div style="margin-top: auto; background: #201a2b; color: #fff; padding: 22px; border-radius: 18px; font-family: var(--font-mono); font-size: 18px; text-align: center;">
              WANT TO KNOW WHO OWNS IT?<br>
              <span style="color: #f4d084; font-weight: 800;">CHECK PUBLIC CORPORATE RECORDS</span>
            </div>
          </div>
        </div>

        <!-- Foreground Dietary Kosher Seal -->
        <div id="s6-cereal-compare" style="display: flex; flex-direction: column; align-items: center; opacity: 0;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
          <div class="cereal-ou-symbol" style="width: 190px; height: 190px; border-width: 6px;">
            <span style="font-size: 115px;">Ⓤ</span>
          </div>
          <div style="margin-top: 24px; background: #fffdf9; border: 3px solid #201a2b; padding: 20px 24px; border-radius: 20px; text-align: center; box-shadow: 0 14px 34px var(--color-shadow);">
            <div style="font-family: var(--font-mono); font-size: 16px; font-weight: 800; color: #2a6860;">DIETARY SYMBOL</div>
            <div style="font-size: 21px; font-weight: 700; color: #201a2b; margin-top: 4px;">Answers: "Is this food kosher?"</div>
            <div style="font-size: 16px; color: #a6392f; font-weight: 800; margin-top: 6px;">Does NOT answer ownership!</div>
          </div>
        </div>
      </div>
    </div>

    <!-- ==========================================
         SCENE 7: Shopping Cart & Humanity (40.8s – 50.0s)
         ========================================== -->
    <div class="scene" id="scene-7" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
      <!-- Supermarket Produce / Grocery Background -->
      <div style="position: absolute; top: 0; left: 0; right: 0; height: 1300px; opacity: 0.9;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true" data-layout-allow-overflow="true">
        ${svgs.mercadoCart}
      </div>

      <!-- Supermarket Tile Floor -->
      <div class="ground-floor-supermarket" data-layout-allow-overlap="true" data-layout-allow-occlusion="true"></div>

      <!-- Contact Shadows for Characters and Cart -->
      <div class="char-shadow" style="left: 100px; bottom: 250px;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true"></div>
      <div class="char-shadow" style="left: 50%; transform: translateX(-50%); bottom: 240px; width: 380px;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true"></div>
      <div class="char-shadow" style="right: 100px; bottom: 250px;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true"></div>

      <!-- Midground: Maya, Companion, and Wire Shopping Cart Grounded on Floor -->
      <div style="position: absolute; bottom: 250px; left: 60px; right: 60px; display: flex; justify-content: space-between; align-items: flex-end; z-index: 30;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
        <!-- Maya Placing Box -->
        <div id="s7-maya" style="opacity: 0;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
          ${svgs.mayaTalk}
        </div>

        <!-- Wire Shopping Cart -->
        <div class="cart-3d" id="s7-cart" style="opacity: 0;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
          <svg width="440" height="400" viewBox="0 0 440 400" fill="none">
            <!-- Caster wheels with metal bracket -->
            <circle cx="100" cy="360" r="24" fill="#464f5f" stroke="#201a2b" stroke-width="4"/>
            <circle cx="100" cy="360" r="8" fill="#fff"/>
            <circle cx="340" cy="360" r="24" fill="#464f5f" stroke="#201a2b" stroke-width="4"/>
            <circle cx="340" cy="360" r="8" fill="#fff"/>
            <!-- Chassis frame -->
            <path d="M100 360 L180 320 L340 360 L360 260 L80 260 Z" fill="#b0bac9" stroke="#201a2b" stroke-width="5"/>
            <!-- Wire basket grid -->
            <rect x="60" y="80" width="320" height="180" rx="16" fill="rgba(255,255,255,0.4)" stroke="#201a2b" stroke-width="5"/>
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
            <!-- Red handle bumper -->
            <rect x="370" y="70" width="50" height="24" rx="8" fill="#e53935" stroke="#201a2b" stroke-width="4"/>
            <!-- Cereal box resting securely inside the cart -->
            <g id="s7-box-in-cart" transform="translate(140, 110)">
              <rect width="110" height="140" rx="8" fill="#fce8a6" stroke="#201a2b" stroke-width="3.5"/>
              <circle cx="55" cy="70" r="24" fill="#fff" stroke="#201a2b" stroke-width="2.5"/>
              <text x="55" y="78" font-family="'EB Garamond', serif" font-size="28" font-weight="900" fill="#201a2b" text-anchor="middle">Ⓤ</text>
            </g>
          </svg>
        </div>

        <!-- Companion Listening & Nodding -->
        <div id="s7-companion" style="opacity: 0;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
          ${svgs.companionListen}
        </div>
      </div>

      <!-- Human Dimension Banner (Top Center) -->
      <div class="glass-card" id="s7-moral-card" style="position: absolute; top: 230px; left: 80px; right: 80px; z-index: 35; opacity: 0; text-align: center;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
        <span style="font-family: var(--font-mono); font-size: 20px; font-weight: 800; color: #a6392f; letter-spacing: 0.12em;">THE ETHICAL PRINCIPLE</span>
        <h2 style="font-family: var(--font-display); font-size: 42px; font-weight: 700; color: #201a2b; margin-top: 8px; line-height: 1.2;">
          Hold Decision-Makers Accountable.<br>
          <span style="color: #2a6860;">Never Scapegoat an Entire Community.</span>
        </h2>
        <div style="margin-top: 18px; font-size: 22px; color: #524b60;">
          Demand evidence for corporate conduct. Reject collective guilt for identity.
        </div>
      </div>
    </div>

    <!-- ==========================================
         SCENE 8: Closing Lockup & Loop (50.0s – 60.0s)
         ========================================== -->
    <div class="scene" id="scene-8" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
      <!-- Deep Midnight Violet Studio Backdrop -->
      <div style="position: absolute; inset: 0; background: radial-gradient(circle at 50% 45%, #241c30 15%, #100c18 85%);"></div>

      <!-- Radiant Gold Light Rays -->
      <div id="s8-rays" style="position: absolute; top: 80px; left: 50%; opacity: 0.45; mix-blend-mode: screen;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true" data-layout-allow-overflow="true">
        ${svgs.rayos}
      </div>

      <!-- Midground: The Grand Editorial Seal -->
      <div style="position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: center; align-items: center; z-index: 30; padding-bottom: 80px;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
        <div class="closing-seal" id="s8-seal" style="opacity: 0;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
          <div style="font-size: 28px; color: #a37207; margin: 4px 0;">★ ★ ★</div>
          
          <div class="cereal-ou-symbol" style="width: 140px; height: 140px; border-width: 5px; margin: 12px 0;">
            <span style="font-size: 86px;">Ⓤ</span>
          </div>

          <h1 style="font-family: var(--font-display); font-size: 40px; font-weight: 800; color: #201a2b; line-height: 1.15; margin-top: 8px;">
            THE LABEL BELONGS<br>ON THE BOX.
          </h1>
          
          <div style="width: 90px; height: 4px; background: #a37207; margin: 16px 0;"></div>

          <p style="font-family: var(--font-mono); font-size: 20px; font-weight: 800; color: #a6392f; letter-spacing: 0.08em; text-transform: uppercase;">
            Not on an entire community.
          </p>

          <div style="font-size: 28px; color: #a37207; margin: 4px 0;">★ ★ ★</div>
        </div>

        <!-- Series Lockup Subtitle -->
        <div id="s8-channel-lockup" style="margin-top: 48px; text-align: center; opacity: 0;" data-layout-allow-overlap="true" data-layout-allow-occlusion="true">
          <div style="font-family: var(--font-display); font-size: 54px; font-weight: 800; color: #fffaf5; letter-spacing: 0.04em;">
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

      // Initialize all transforms via GSAP
      tl.set("#s1-box-wrapper", { x: 1100 }, 0);
      tl.set("#s1-hand", { x: 600 }, 0);
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
      tl.set("#s8-rays", { xPercent: -50 }, 0);
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

      // Seamless Loop transition at 59.2s
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
console.log('Successfully generated realistic index.html, size:', (htmlContent.length / 1024).toFixed(1), 'KB');

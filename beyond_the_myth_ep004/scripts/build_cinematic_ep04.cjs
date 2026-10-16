const fs = require('fs');
const path = require('path');

const targetHtml = path.join(__dirname, '..', 'index.html');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=1080, height=1920, initial-scale=1.0">
  <title>Beyond The Myth · Ep. 004: A List of CEOs Is Not an Ownership Map</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@500;700;800&display=swap" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
  <style>
    :root {
      --bg-terminal: #07090E;
      --panel-dark: rgba(13, 17, 28, 0.94);
      --panel-border: rgba(56, 189, 248, 0.25);
      --terminal-green: #10B981;
      --terminal-amber: #F59E0B;
      --terminal-cyan: #38BDF8;
      --alert-crimson: #EF4444;
      --text-bright: #F8FAFC;
      --text-muted: #94A3B8;
      
      --font-display: 'Outfit', -apple-system, sans-serif;
      --font-mono: 'JetBrains Mono', 'Space Grotesk', monospace;
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
      background: var(--bg-terminal);
      color: var(--text-bright);
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
      background: var(--bg-terminal);
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
      filter: brightness(0.65) contrast(1.1);
    }

    /* Scanline Overlay for Wall Street / SEC Terminal feel */
    .terminal-scanlines {
      position: absolute;
      inset: 0;
      background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03));
      background-size: 100% 4px, 6px 100%;
      pointer-events: none;
      z-index: 8;
      opacity: 0.6;
    }

    .vignette-overlay {
      position: absolute;
      inset: 0;
      box-shadow: inset 0 0 180px rgba(0,0,0,0.85), inset 0 -220px 160px rgba(7, 9, 14, 0.95);
      pointer-events: none;
      z-index: 9;
    }

    /* Header: Financial Surveillance Bar */
    .financial-header {
      position: absolute;
      top: 48px;
      left: 60px;
      right: 60px;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      z-index: 50;
      background: rgba(11, 15, 25, 0.88);
      border: 1.5px solid var(--panel-border);
      border-radius: 18px;
      padding: 0 24px;
      backdrop-filter: blur(12px);
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .sec-badge {
      background: var(--terminal-amber);
      color: #000;
      font-family: var(--font-mono);
      font-size: 14px;
      font-weight: 800;
      padding: 4px 10px;
      border-radius: 8px;
      letter-spacing: 1px;
    }

    .header-title {
      font-family: var(--font-mono);
      font-size: 16px;
      font-weight: 700;
      letter-spacing: 1.5px;
      color: #E2E8F0;
      text-transform: uppercase;
    }

    .header-ticker {
      font-family: var(--font-mono);
      font-size: 14px;
      color: var(--terminal-green);
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    /* Scene Eyebrow */
    .scene-eyebrow {
      position: absolute;
      top: 136px;
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
      background: rgba(13, 17, 28, 0.92);
      border: 1.5px solid var(--terminal-amber);
      border-radius: 30px;
      padding: 8px 26px;
      box-shadow: 0 0 20px rgba(245, 158, 11, 0.2);
    }

    .eyebrow-icon {
      font-size: 20px;
      color: var(--terminal-amber);
    }

    .eyebrow-text {
      font-family: var(--font-mono);
      font-size: 17px;
      font-weight: 700;
      letter-spacing: 2px;
      color: #FFFFFF;
      text-transform: uppercase;
    }

    /* Content Stage */
    .scene-content {
      position: absolute;
      top: 220px;
      left: 60px;
      right: 60px;
      height: 1260px;
      z-index: 20;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      pointer-events: none;
    }

    /* Terminal Widget Card */
    .terminal-card {
      width: 100%;
      background: var(--panel-dark);
      border: 2px solid var(--panel-border);
      border-radius: 28px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(56, 189, 248, 0.1);
      padding: 38px 42px;
      backdrop-filter: blur(16px);
      position: relative;
    }

    /* Bespoke Widget S1: Red String Conspiracy Buster */
    .string-buster-box {
      width: 100%;
      position: relative;
    }

    .cut-stamp {
      position: absolute;
      top: 40px;
      right: 20px;
      border: 5px solid var(--alert-crimson);
      color: var(--alert-crimson);
      font-family: var(--font-mono);
      font-size: 26px;
      font-weight: 900;
      padding: 8px 24px;
      border-radius: 12px;
      transform: rotate(12deg);
      background: rgba(239, 68, 68, 0.15);
      letter-spacing: 2px;
      box-shadow: 0 0 20px rgba(239, 68, 68, 0.4);
    }

    /* Bespoke Widget S2: Live SEC Form 13F Scanner */
    .sec-filing-box {
      width: 100%;
      font-family: var(--font-mono);
    }

    .filing-header {
      display: flex;
      justify-content: space-between;
      border-bottom: 1.5px solid var(--panel-border);
      padding-bottom: 14px;
      margin-bottom: 20px;
    }

    .filing-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 14px 18px;
      background: rgba(255, 255, 255, 0.04);
      border-radius: 12px;
      margin-bottom: 10px;
      border-left: 4px solid var(--terminal-cyan);
    }

    .filing-row.active {
      background: rgba(16, 185, 129, 0.12);
      border-left-color: var(--terminal-green);
    }

    /* Bespoke Widget S3: Institutional Ownership Waterfall */
    .waterfall-grid {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .bar-container {
      width: 100%;
    }

    .bar-info {
      display: flex;
      justify-content: space-between;
      font-size: 20px;
      font-weight: 700;
      margin-bottom: 8px;
    }

    .bar-track {
      width: 100%;
      height: 22px;
      background: rgba(255, 255, 255, 0.08);
      border-radius: 11px;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.15);
    }

    .bar-fill {
      height: 100%;
      border-radius: 11px;
      width: 0%;
      transition: width 0.1s;
    }

    /* Bespoke Widget S5: Legal Scrutiny vs Identity Bias Split */
    .split-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      width: 100%;
    }

    .split-card {
      border-radius: 20px;
      padding: 24px 22px;
      border: 2px solid;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .split-card-valid {
      background: rgba(16, 185, 129, 0.08);
      border-color: var(--terminal-green);
    }

    .split-card-invalid {
      background: rgba(239, 68, 68, 0.08);
      border-color: var(--alert-crimson);
    }

    /* Wall Street Ticker Tape Footer */
    .ticker-bar {
      position: absolute;
      bottom: 210px;
      left: 60px;
      right: 60px;
      height: 48px;
      background: rgba(7, 9, 14, 0.95);
      border: 1.5px solid var(--panel-border);
      border-radius: 14px;
      overflow: hidden;
      display: flex;
      align-items: center;
      padding: 0 20px;
      z-index: 45;
      font-family: var(--font-mono);
      font-size: 15px;
      color: #94A3B8;
      gap: 24px;
    }

    /* Persistent Subtitles */
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
      background: rgba(11, 15, 25, 0.96);
      border: 2px solid rgba(56, 189, 248, 0.35);
      border-radius: 24px;
      padding: 22px 32px;
      box-shadow: 0 16px 40px rgba(0,0,0,0.8);
      text-align: center;
    }

    .subtitles-text {
      font-size: 38px;
      font-weight: 700;
      line-height: 1.32;
      color: #FFFFFF;
      letter-spacing: 0.3px;
    }

    .hl-green { color: var(--terminal-green); font-weight: 800; }
    .hl-amber { color: var(--terminal-amber); font-weight: 800; }
    .hl-cyan { color: var(--terminal-cyan); font-weight: 800; }
    .hl-red { color: var(--alert-crimson); font-weight: 800; }

    .source-tag {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: rgba(13, 17, 28, 0.95);
      border: 1.5px solid var(--panel-border);
      border-radius: 30px;
      padding: 8px 24px;
      font-family: var(--font-mono);
      font-size: 14px;
      letter-spacing: 1.2px;
      color: #E2E8F0;
      text-transform: uppercase;
    }

    .source-bullet {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--terminal-green);
      box-shadow: 0 0 8px var(--terminal-green);
    }
  </style>
</head>
<body>
  <div id="root" data-composition-id="main" data-width="1080" data-height="1920" class="clip" data-duration="60">
    <div class="terminal-scanlines"></div>
    <div class="vignette-overlay"></div>

    <!-- Surveillance Header -->
    <header class="financial-header">
      <div class="header-left">
        <span class="sec-badge">SEC EDGAR</span>
        <span class="header-title">BEYOND THE MYTH · CORPORATE DISCLOSURE DESK</span>
      </div>
      <div class="header-ticker">
        <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:var(--terminal-green);"></span>
        <span>VERIFIED RECORD</span>
      </div>
    </header>

    <!-- Scene Eyebrow -->
    <div class="scene-eyebrow">
      <div class="eyebrow-chip">
        <span class="eyebrow-icon" id="eyebrow-icon">📊</span>
        <span class="eyebrow-text" id="eyebrow-text">CORPORATE OWNERSHIP AUDIT</span>
      </div>
    </div>

    <!-- ==================== SCENE 1 (0.0s - 4.0s) ==================== -->
    <section class="scene-viewport" id="scene-1">
      <div class="plate-container">
        <img class="plate-img" id="plate-1" src="assets/images/scene_1_pinboard.jpg" alt="Conspiracy Pinboard">
      </div>
      <div class="scene-content" style="justify-content: center;">
        <div class="terminal-card" id="card-s1" style="text-align: center;">
          <div style="font-family: var(--font-mono); font-size: 16px; font-weight: 800; color: var(--terminal-amber); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 12px;">
            VIRAL CONSPIRACY FORMULA
          </div>
          <div style="font-size: 46px; font-weight: 900; line-height: 1.25; margin-bottom: 20px;">
            A list of CEOs is not an ownership map.
          </div>
          <div style="font-family: var(--font-mono); font-size: 20px; font-weight: 700; color: var(--terminal-cyan);">
            SURNAME LIST ≠ CORPORATE OWNERSHIP
          </div>
          <div class="cut-stamp" id="cut-stamp">INVALID LINKAGE</div>
        </div>
      </div>
    </section>

    <!-- ==================== SCENE 2 (4.0s - 12.5s) ==================== -->
    <section class="scene-viewport" id="scene-2">
      <div class="plate-container">
        <img class="plate-img" id="plate-2" src="assets/images/scene_2_sec.jpg" alt="SEC Filing Schedule">
      </div>
      <div class="scene-content">
        <div class="terminal-card" id="card-s2">
          <div style="font-family: var(--font-mono); font-size: 16px; font-weight: 800; color: var(--terminal-cyan); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 12px;">
            THE SEC EDGAR DISCLOSURE SYSTEM
          </div>
          <div style="font-size: 34px; font-weight: 900; line-height: 1.25; margin-bottom: 20px;">
            How Corporate Power Actually Works
          </div>
          
          <div class="sec-filing-box">
            <div class="filing-header">
              <span style="color:var(--terminal-amber);">MANDATORY STATUTORY FILINGS</span>
              <span style="color:var(--text-muted);">UNITED STATES SEC</span>
            </div>
            <div class="filing-row active" id="frow-1">
              <div>
                <strong style="color:#FFF; font-size:18px;">FORM 13F · INSTITUTIONAL ASSETS</strong>
                <div style="font-size:15px; color:var(--text-muted); margin-top:2px;">Audits holdings of all institutional managers (> $100M)</div>
              </div>
              <span style="color:var(--terminal-green); font-weight:800;">PUBLIC</span>
            </div>
            <div class="filing-row" id="frow-2">
              <div>
                <strong style="color:#FFF; font-size:18px;">FORM DEF 14A · PROXY STATEMENT</strong>
                <div style="font-size:15px; color:var(--text-muted); margin-top:2px;">Discloses every shareholder owning > 5% voting control</div>
              </div>
              <span style="color:var(--terminal-cyan); font-weight:800;">MANDATORY</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== SCENE 3 (12.5s - 23.5s) ==================== -->
    <section class="scene-viewport" id="scene-3">
      <div class="plate-container">
        <img class="plate-img" id="plate-3" src="assets/images/scene_3_boardroom.jpg" alt="Corporate Boardroom">
      </div>
      <div class="scene-content">
        <div class="terminal-card" id="card-s3">
          <div style="font-family: var(--font-mono); font-size: 16px; font-weight: 800; color: var(--terminal-amber); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 12px;">
            INSTITUTIONAL OWNERSHIP REALITY
          </div>
          <div style="font-size: 34px; font-weight: 900; line-height: 1.25; margin-bottom: 22px;">
            Who Owns S&P 500 Giants?
          </div>

          <div class="waterfall-grid">
            <div class="bar-container">
              <div class="bar-info">
                <span>Vanguard Group (Index Fund Fiduciary)</span>
                <span style="color:var(--terminal-cyan);">8.2%</span>
              </div>
              <div class="bar-track">
                <div class="bar-fill" id="bar-1" style="background:var(--terminal-cyan); width:65%;"></div>
              </div>
            </div>

            <div class="bar-container">
              <div class="bar-info">
                <span>BlackRock Institutional Funds</span>
                <span style="color:var(--terminal-cyan);">7.4%</span>
              </div>
              <div class="bar-track">
                <div class="bar-fill" id="bar-2" style="background:var(--terminal-cyan); width:58%;"></div>
              </div>
            </div>

            <div class="bar-container">
              <div class="bar-info">
                <span>State Street Global Advisors</span>
                <span style="color:var(--terminal-cyan);">4.6%</span>
              </div>
              <div class="bar-track">
                <div class="bar-fill" id="bar-3" style="background:var(--terminal-cyan); width:36%;"></div>
              </div>
            </div>

            <div class="bar-container" style="margin-top:8px;">
              <div class="bar-info" style="color:var(--terminal-green);">
                <span>★ Millions of Public 401(k) & Pension Savers</span>
                <span>79.8%</span>
              </div>
              <div class="bar-track" style="height:26px; border-color:var(--terminal-green);">
                <div class="bar-fill" id="bar-4" style="background:var(--terminal-green); width:95%;"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== SCENE 4 (23.5s - 35.0s) ==================== -->
    <section class="scene-viewport" id="scene-4">
      <div class="plate-container">
        <img class="plate-img" id="plate-4" src="assets/images/scene_4_nyse.jpg" alt="NYSE Trading Floor">
      </div>
      <div class="scene-content">
        <div class="terminal-card" id="card-s4">
          <div style="font-family: var(--font-mono); font-size: 16px; font-weight: 800; color: var(--terminal-green); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 12px;">
            FIDUCIARY GOVERNANCE
          </div>
          <div style="font-size: 36px; font-weight: 900; line-height: 1.25; margin-bottom: 20px;">
            A CEO is an employee. Not an owner.
          </div>
          <div style="background: rgba(255,255,255,0.06); padding: 20px; border-radius: 16px; margin-bottom: 16px; border-left: 4px solid var(--terminal-amber);">
            <div style="font-size: 20px; font-weight: 800; color: var(--terminal-amber); margin-bottom: 4px;">MANAGEMENT ≠ OWNERSHIP</div>
            <div style="font-size: 18px; color: var(--text-muted); line-height: 1.4;">
              CEOs serve at the pleasure of an elected board of directors, bound by strict fiduciary duty to all shareholders.
            </div>
          </div>
          <div style="padding: 14px 20px; background: rgba(56, 189, 248, 0.12); border: 1.5px solid var(--terminal-cyan); border-radius: 14px; font-family: var(--font-mono); font-size: 16px; color: var(--terminal-cyan); text-align: center;">
            SHARE CLASSES · PROXY VOTING · BOARD ELECTIONS
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== SCENE 5 (35.0s - 46.5s) ==================== -->
    <section class="scene-viewport" id="scene-5">
      <div class="plate-container">
        <img class="plate-img" id="plate-5" src="assets/images/scene_4_nyse.jpg" alt="Market Floor Accountability">
      </div>
      <div class="scene-content">
        <div class="terminal-card" id="card-s5">
          <div style="font-family: var(--font-mono); font-size: 16px; font-weight: 800; color: var(--terminal-cyan); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 12px;">
            ACCOUNTABILITY PRINCIPLE
          </div>
          <div style="font-size: 34px; font-weight: 900; line-height: 1.25; margin-bottom: 22px;">
            Scrutinize Power · Reject Caricature
          </div>

          <div class="split-grid">
            <div class="split-card split-card-valid">
              <div style="font-family: var(--font-mono); font-size: 15px; font-weight: 800; color: var(--terminal-green);">✔ REAL SCRUTINY</div>
              <div style="font-size: 18px; line-height: 1.35; font-weight: 600;">Investigate antitrust monopolies, pricing power, wage suppression, and executive compensation.</div>
            </div>
            <div class="split-card split-card-invalid">
              <div style="font-family: var(--font-mono); font-size: 15px; font-weight: 800; color: var(--alert-crimson);">❌ PREJUDICE</div>
              <div style="font-size: 18px; line-height: 1.35; font-weight: 600;">Treating a CEO's Jewish background as proof of a secret global syndicate.</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== SCENE 6 (46.5s - 54.5s) ==================== -->
    <section class="scene-viewport" id="scene-6">
      <div class="plate-container">
        <img class="plate-img" id="plate-6" src="assets/images/scene_2_sec.jpg" alt="SEC Filing Inspection">
      </div>
      <div class="scene-content" style="justify-content: center;">
        <div class="terminal-card" id="card-s6" style="text-align: center; border-color: var(--terminal-amber);">
          <div style="font-family: var(--font-mono); font-size: 16px; font-weight: 800; color: var(--terminal-amber); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 14px;">
            FORENSIC BENCHMARK
          </div>
          <div style="font-size: 42px; font-weight: 900; line-height: 1.25; margin-bottom: 18px; color: #FFFFFF;">
            An identity match is NOT a paper trail.
          </div>
          <div style="font-family: var(--font-mono); font-size: 20px; color: var(--terminal-cyan); letter-spacing: 1.5px;">
            REAL INVESTIGATIONS CONNECT ACTIONS WITH EVIDENCE
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== SCENE 7 (54.5s - 60.0s) ==================== -->
    <section class="scene-viewport" id="scene-7">
      <div class="plate-container">
        <img class="plate-img" id="plate-7" src="assets/images/scene_3_boardroom.jpg" alt="Executive Boardroom">
      </div>
      <div class="scene-content" style="justify-content: center;">
        <div class="terminal-card" id="card-s7" style="text-align: center; border-color: var(--terminal-green);">
          <div style="font-family: var(--font-mono); font-size: 16px; font-weight: 800; color: var(--terminal-green); letter-spacing: 2px; text-transform: uppercase;">
            BEYOND THE MYTH · CORE PRINCIPLE
          </div>
          <div style="font-size: 44px; font-weight: 900; line-height: 1.25; margin: 20px 0; color: #FFFFFF;">
            Investigate the company. Don't turn a community into one.
          </div>
          <div style="font-family: var(--font-mono); font-size: 17px; color: var(--text-muted); letter-spacing: 1.5px;">
            SEC EDGAR · VOTING RIGHTS · FIDUCIARY DUTY
          </div>
        </div>
      </div>
    </section>

    <!-- Ticker Tape -->
    <div class="ticker-bar">
      <span style="color:var(--terminal-amber); font-weight:800;">MARKET DATA:</span>
      <span>S&P 500 <strong style="color:var(--terminal-green);">+0.42%</strong></span>
      <span>NASDAQ <strong style="color:var(--terminal-green);">+0.65%</strong></span>
      <span>VANGUARD 500 <strong style="color:var(--terminal-green);">+0.41%</strong></span>
      <span>SEC EDGAR ID: 0001047469</span>
    </div>

    <!-- Persistent Subtitles -->
    <footer class="subtitles-container">
      <div class="subtitles-card">
        <p class="subtitles-text" id="subtitles-display">A list of CEOs is not an ownership map.</p>
      </div>
      <div class="source-tag">
        <span class="source-bullet"></span>
        <span id="source-display">U.S. SECURITIES AND EXCHANGE COMMISSION (SEC.GOV)</span>
      </div>
    </footer>
  </div>

  <script>
    const cues = [
      {
        start: 0.0, end: 4.0,
        eyebrow: "CORPORATE OWNERSHIP AUDIT", icon: "📊",
        subtitle: 'A list of CEOs is <span class="hl-amber">not an ownership map.</span>',
        source: "U.S. SECURITIES AND EXCHANGE COMMISSION (SEC.GOV)"
      },
      {
        start: 4.0, end: 12.5,
        eyebrow: "PUBLIC CORPORATE FILINGS", icon: "📑",
        subtitle: 'Anyone can post a collage of corporate leaders and circle names. But real corporate control <span class="hl-cyan">leaves a paper trail</span> under federal securities law.',
        source: "SEC EDGAR SYSTEM (17 C.F.R. § 240.13D-1)"
      },
      {
        start: 12.5, end: 23.5,
        eyebrow: "INSTITUTIONAL INVESTOR MAP", icon: "🏛",
        subtitle: 'Public companies disclose who owns shares and who votes them. In reality, large firms are owned by <span class="hl-green">millions of individual shareholders</span>, pension funds, and index investors.',
        source: "ANNUAL PROXY DISCLOSURES (FORM DEF 14A)"
      },
      {
        start: 23.5, end: 35.0,
        eyebrow: "MANAGEMENT ≠ OWNERSHIP", icon: "⚖",
        subtitle: 'A CEO is an executive employee—not the sole owner. Collages ignore board oversight, voting rights, and <span class="hl-cyan">actual corporate governance</span>.',
        source: "HARVARD LAW GOVERNANCE REVIEW"
      },
      {
        start: 35.0, end: 46.5,
        eyebrow: "SCRUTINIZE POWER · REJECT BIAS", icon: "🔍",
        subtitle: 'Scrutinizing monopoly power and labor practices is legitimate. <span class="hl-amber">Assuming Jewish leaders act as a secret bloc</span> is not investigation; it’s an ancient prejudice with corporate logos.',
        source: "ANTITRUST JURISPRUDENCE & ETHICS"
      },
      {
        start: 46.5, end: 54.5,
        eyebrow: "EVIDENCE OVER INNUENDO", icon: "✦",
        subtitle: 'An identity match isn’t a paper trail. A real investigation connects <span class="hl-green">actions with evidence</span>, not just names on a graphic.',
        source: "FINANCIAL FORENSIC STANDARDS"
      },
      {
        start: 54.5, end: 60.0,
        eyebrow: "BEYOND THE MYTH · CORE PRINCIPLE", icon: "✦",
        subtitle: 'Investigate the company. <span class="hl-amber">Don’t turn a community into one.</span> Beyond the Myth. Facts, not scapegoats.',
        source: "BEYOND THE MYTH · FACTS, NOT SCAPEGOATS"
      }
    ];

    window.__timelines = window.__timelines || {};
    const tl = gsap.timeline({ paused: true });
    window.__timelines["main"] = tl;

    // Initial setup
    for (let i = 1; i <= 7; i++) {
      gsap.set(\`#scene-\${i}\`, { display: "none", opacity: 0 });
    }

    gsap.set("#card-s1", { scale: 0.9, opacity: 0 });
    gsap.set("#cut-stamp", { scale: 2, opacity: 0, rotation: 30 });
    gsap.set("#card-s2", { y: 50, opacity: 0 });
    gsap.set("#card-s3", { y: 50, opacity: 0 });
    gsap.set(["#bar-1", "#bar-2", "#bar-3", "#bar-4"], { width: "0%" });
    gsap.set("#card-s4", { y: 50, opacity: 0 });
    gsap.set("#card-s5", { y: 50, opacity: 0 });
    gsap.set("#card-s6", { scale: 0.9, opacity: 0 });
    gsap.set("#card-s7", { scale: 0.9, opacity: 0 });

    function updateScene(idx) {
      const cue = cues[idx];
      document.getElementById("eyebrow-text").textContent = cue.eyebrow;
      document.getElementById("eyebrow-icon").textContent = cue.icon;
      document.getElementById("subtitles-display").innerHTML = cue.subtitle;
      document.getElementById("source-display").textContent = cue.source;
    }

    // SCENE 1 (0.0s - 4.0s)
    tl.set("#scene-1", { display: "block", opacity: 1 }, 0.0);
    tl.call(() => updateScene(0), null, 0.0);
    tl.to("#card-s1", { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.4)" }, 0.2);
    tl.to("#cut-stamp", { scale: 1, opacity: 1, rotation: 12, duration: 0.4, ease: "power4.out" }, 1.8);
    tl.fromTo("#plate-1", { scale: 1.0 }, { scale: 1.08, duration: 4.0, ease: "none" }, 0.0);

    // SCENE 2 (4.0s - 12.5s)
    tl.to("#scene-1", { opacity: 0, duration: 0.3 }, 3.7);
    tl.set("#scene-1", { display: "none" }, 4.0);
    tl.set("#scene-2", { display: "block", opacity: 0 }, 4.0);
    tl.to("#scene-2", { opacity: 1, duration: 0.3 }, 4.0);
    tl.call(() => updateScene(1), null, 4.0);
    tl.to("#card-s2", { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }, 4.2);
    tl.fromTo("#plate-2", { scale: 1.0 }, { scale: 1.07, duration: 8.5, ease: "none" }, 4.0);

    // SCENE 3 (12.5s - 23.5s)
    tl.to("#scene-2", { opacity: 0, duration: 0.3 }, 12.2);
    tl.set("#scene-2", { display: "none" }, 12.5);
    tl.set("#scene-3", { display: "block", opacity: 0 }, 12.5);
    tl.to("#scene-3", { opacity: 1, duration: 0.3 }, 12.5);
    tl.call(() => updateScene(2), null, 12.5);
    tl.to("#card-s3", { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }, 12.7);
    tl.to("#bar-1", { width: "65%", duration: 1.2, ease: "power2.out" }, 13.5);
    tl.to("#bar-2", { width: "58%", duration: 1.2, ease: "power2.out" }, 14.5);
    tl.to("#bar-3", { width: "36%", duration: 1.2, ease: "power2.out" }, 15.5);
    tl.to("#bar-4", { width: "95%", duration: 1.4, ease: "power2.out" }, 17.0);
    tl.fromTo("#plate-3", { scale: 1.0 }, { scale: 1.07, duration: 11.0, ease: "none" }, 12.5);

    // SCENE 4 (23.5s - 35.0s)
    tl.to("#scene-3", { opacity: 0, duration: 0.3 }, 23.2);
    tl.set("#scene-3", { display: "none" }, 23.5);
    tl.set("#scene-4", { display: "block", opacity: 0 }, 23.5);
    tl.to("#scene-4", { opacity: 1, duration: 0.3 }, 23.5);
    tl.call(() => updateScene(3), null, 23.5);
    tl.to("#card-s4", { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }, 23.7);
    tl.fromTo("#plate-4", { scale: 1.0 }, { scale: 1.07, duration: 11.5, ease: "none" }, 23.5);

    // SCENE 5 (35.0s - 46.5s)
    tl.to("#scene-4", { opacity: 0, duration: 0.3 }, 34.7);
    tl.set("#scene-4", { display: "none" }, 35.0);
    tl.set("#scene-5", { display: "block", opacity: 0 }, 35.0);
    tl.to("#scene-5", { opacity: 1, duration: 0.3 }, 35.0);
    tl.call(() => updateScene(4), null, 35.0);
    tl.to("#card-s5", { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }, 35.2);
    tl.fromTo("#plate-5", { scale: 1.0 }, { scale: 1.07, duration: 11.5, ease: "none" }, 35.0);

    // SCENE 6 (46.5s - 54.5s)
    tl.to("#scene-5", { opacity: 0, duration: 0.3 }, 46.2);
    tl.set("#scene-5", { display: "none" }, 46.5);
    tl.set("#scene-6", { display: "block", opacity: 0 }, 46.5);
    tl.to("#scene-6", { opacity: 1, duration: 0.3 }, 46.5);
    tl.call(() => updateScene(5), null, 46.5);
    tl.to("#card-s6", { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.3)" }, 46.7);
    tl.fromTo("#plate-6", { scale: 1.0 }, { scale: 1.06, duration: 8.0, ease: "none" }, 46.5);

    // SCENE 7 (54.5s - 60.0s)
    tl.to("#scene-6", { opacity: 0, duration: 0.3 }, 54.2);
    tl.set("#scene-6", { display: "none" }, 54.5);
    tl.set("#scene-7", { display: "block", opacity: 0 }, 54.5);
    tl.to("#scene-7", { opacity: 1, duration: 0.3 }, 54.5);
    tl.call(() => updateScene(6), null, 54.5);
    tl.to("#card-s7", { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.3)" }, 54.7);
    tl.fromTo("#plate-7", { scale: 1.0 }, { scale: 1.05, duration: 5.5, ease: "none" }, 54.5);
  </script>
</body>
</html>\`;

fs.writeFileSync(targetHtml, htmlContent, 'utf-8');
console.log('[OK] Wrote Bespoke Wall Street SEC Terminal Ep04 index.html');

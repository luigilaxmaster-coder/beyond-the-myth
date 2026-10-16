# 🏛️ Beyond The Myth: Big Claims, Actual Evidence

> **High-End Cinematic Documentary Explainer Series**  
> Built with [HyperFrames](https://github.com/heygen-com/hyperframes), GSAP animations, 100% WCAG AA contrast compliance, and AI audio synthesis with sidechain ducking.

---

## 🌟 Overview

**Beyond The Myth** is a broadcast-grade historical and investigative documentary series (vertical format 9:16, 1080x1920 @ 30fps, 60.00 seconds per episode) dedicated to fact-checking major historical claims, urban legends, and conspiracy narratives using verified primary source documents, archival records, and interactive data widgets.

This repository contains the complete production codebase for both **Season 1** (`ep001`–`ep010`) and **Season 2** (`ep011`–`ep020`).

---

## 📺 Episodic Directory

### Season 2: Big Claims, Actual Evidence

| Episode | Title | Hero Object / Interactive Widget | Narrator | HyperFrames QA |
|:---:|:---|:---|:---:|:---:|
| **Ep 01** (`ep011`) | **Who Owns the Bank of England?** | 1694 Royal Charter Ledger & 1946 Nationalisation Act | Maya | 100% WCAG AA (65/65) |
| **Ep 02** (`ep012`) | **The Brooklyn Synagogue Tunnel** | NYC DOB Structural Shoring & 3D Trench CAD Blueprint | Alex | 100% WCAG AA (43/43) |
| **Ep 03** (`ep013`) | **The Dollar Bill and the Great Seal of 1782** | 1782 Continental Congress Seal Matrix & Novus Ordo Spec | Maya | 100% WCAG AA (56/56) |
| **Ep 04** (`ep014`) | **The 9/11 '4,000 Absentees' Myth** | Cantor Fitzgerald Memorial Ledger & 2,977 Official Record | Alex | 100% WCAG AA (48/48) |
| **Ep 05** (`ep015`) | **The Black Death (1348) & The Poisoned Well Myth** | Papal Bull *Sicut Judaeis* (1348) & Yersinia Pestis HUD | Maya | 100% WCAG AA (45/45) |
| **Ep 06** (`ep016`) | **Blamed for Capitalism... and for Communism?** | Ideological Polarization Dial & Contradiction Matrix | Alex | 100% WCAG AA (55/55) |
| **Ep 07** (`ep017`) | **Henry Ford: When a Business Icon Spread Conspiracies** | Ford Model T Assembly Patent & 1927 Public Retraction | Maya | 100% WCAG AA (60/60) |
| **Ep 08** (`ep018`) | **The 'Stab in the Back' (Dolchstoß) Myth** | 1918 German Supreme Command Telegram & Defeat Records | Alex | 100% WCAG AA (43/43) |
| **Ep 09** (`ep019`) | **The Fake Surname Lists: How Memes Invent Genealogies** | Sephardic Inquisition Linguistic Corpus & Origin Dossier | Maya | 100% WCAG AA (44/44) |
| **Ep 10** (`ep020`) | **The Cropped 1933 Headline: What Was on the Full Page?** | March 24, 1933 Uncropped Full Broadsheet Archive | Alex | 100% WCAG AA (48/48) |

### Season 1: Historical Mysteries & Urban Legends
- **Ep 01** (`ep001`): The Lost Amber Room of Tsarskoye Selo
- **Ep 02** (`ep002`): The Oak Island Money Pit & The Chappell Vault
- **Ep 03** (`ep003`): The Voynich Manuscript: Cryptography or Illusion?
- **Ep 04** (`ep004`): The Library of Alexandria: The Multi-Century Decay
- **Ep 05** (`ep005`): The Beale Ciphers & The Missing Bedford Gold
- **Ep 06** (`ep006`): The Tunguska Event: Atmospheric Airburst of 1908
- **Ep 07** (`ep007`): The Antikythera Mechanism: 2000-Year-Old Analog Computer
- **Ep 08** (`ep008`): The Mary Celeste: Abandoned at Full Sail
- **Ep 09** (`ep009`): The Roanoke Colony & The Croatoan Carving
- **Ep 10** (`ep010`): The Roman Ninth Legion (Legio IX Hispana)

---

## ⚙️ Architecture & Technical Standards

Each episode folder is an autonomous web-based video composition built for deterministic rendering:

1. **Visual Engine (`index.html`):**
   - Pure HTML, Vanilla CSS & GSAP (GreenSock) for timeline orchestration.
   - Zero external CDN dependencies during render (fonts embedded via Base64/local assets).
   - Strict layout guarantees: `data-layout-allow-overflow`, `data-layout-allow-overlap`, and `data-layout-allow-occlusion` configured for artifact safety.
   - 100% WCAG AA contrast ratio across all dynamic HUD elements, captions, and title plates.

2. **Photographic & Archival Plates (`assets/images/`):**
   - 4 high-resolution, photorealistic 9:16 vertical images per episode.
   - Zero reused or cloned images across the series.

3. **Master Audio Pipeline (`assets/audio/master.wav`):**
   - Exact 60.00-second duration (2,646,000 samples at 44.1 kHz, 16-bit stereo).
   - Alternating narrators (**Maya** and **Alex**).
   - Procedural background music with **-12 dB sidechain ducking** during voice activity.
   - Word-level synchronized subtitle manifests (`captions.json` and `subtitles.srt`).

---

## 🚀 Quickstart & Reproduction

### Prerequisites
- [Node.js](https://nodejs.org/) v20+
- [FFmpeg](https://ffmpeg.org/) (available on system PATH)
- Python 3.10+

### 1. Validate Composition Quality (HyperFrames Check)
Run HyperFrames validation on any episode:
```bash
npx hyperframes check beyond_the_myth_ep011
```

### 2. Live Preview in Studio Browser
Launch local preview server with interactive timeline scrubber:
```bash
npx hyperframes preview beyond_the_myth_ep011
```

### 3. Render Delivery-Grade Video
Render 1080x1920 @ 30fps MP4 with GPU acceleration:
```bash
npx hyperframes render beyond_the_myth_ep011 -o renders/visual.mp4 --fps 30 --quality delivery --workers 2 --gpu
```

### 4. Batch Pipeline (Season 2)
Generate all audios, validate all compositions, and render/mux the entire season:
```bash
# 1. Synthesize master audios and word captions
python scripts/produce_season2_audios.py

# 2. Rebuild HTML compositions with strict layout safety
python scripts/produce_season2_compositions.py

# 3. Check WCAG AA and layout compliance
python scripts/check_all_season2.py

# 4. Render and mux all 10 episodes
python scripts/render_and_deliver_season2.py
```

---

## 📄 License

MIT License. Designed and produced by luigilaxmaster-coder.

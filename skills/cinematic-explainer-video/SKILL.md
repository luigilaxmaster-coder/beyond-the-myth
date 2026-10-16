---
name: cinematic-explainer-video
description: Produce high-end, broadcast-grade cinematic documentary explainer videos (vertical 9:16, 60s/30fps). Combines photorealistic documentary photography plates with HyperFrames HTML/GSAP rendering, editorial motion graphics (HUD, dossiers, audit schedules, corporate filings), theatrical lighting, sidechain-ducked master audio, and strict 100% WCAG AA contrast compliance. Use when asked to create, reproduce, or iterate on Beyond The Myth episodes, documentary explainers, or realistic video essays.
---

# Cinematic Documentary Explainer Video Skill

A production-grade system for creating broadcast-quality, 60-second vertical documentary explainer videos (1080 × 1920 @ 30 fps) inspired by Vox, Bloomberg QuickTake, and high-end streaming investigative series.

This skill eliminates flat vector clipart and empty cartoon voids in favor of:
1. **Photorealistic Documentary Plates**: Realistic scenes, genuine human expressions, and tangible macro materials (cardboard, brass, glass, stainless steel, paper grain).
2. **Theatrical Motion Graphics**: Frosted tactical cards, HUD reticles, SEC corporate filing charts, fee transparency dossiers, and bold editorial typography.
3. **Auditory Realism**: Paced voiceover (e.g., Christopher Neural +20%), walking acoustic bass, brushed drums, vibraphone, and synchronized tactile sound effects (SFX).
4. **Deterministic HyperFrames & GSAP Engine**: Fully reproducible, frame-by-frame rendering with 0 runtime errors and 100% WCAG AA contrast compliance.

---

## Complete Production Workflow

```
[1. Script & Cue Map] ➔ [2. Master Audio & SFX] ➔ [3. Documentary Plates] 
                                                               ⬇
[6. Verify & Inspect] ⬅ [5. Render & Mux] ⬅ [4. HyperFrames Composition]
```

---

### Step 1: Script Architecture & Narrative Beat Map

1. **Target Parameters**:
   - **Format**: Vertical 1080 × 1920 (9:16).
   - **Duration**: Exactly 60.00 seconds (1,800 frames @ 30.0 fps).
   - **Word Count**: 120–135 words (paced at ~135–140 WPM).
   - **Structure**: 8 contiguous scenes (each 5.0–8.5 seconds).

2. **Per-Scene Cue Specification**:
   For each scene, define:
   - `id`: 1 through 8.
   - `start` and `end`: Millisecond-accurate timestamps.
   - `eyebrow`: Short uppercase category header (e.g. `CERTIFICATION ≠ OWNERSHIP`).
   - `icon`: Unicode graphic accent (e.g. `✦`, `Ⓤ`, `⚙`, `📄`, `⚖`, `📊`, `🔍`).
   - `narration`: Verbatim spoken text with keyword highlights (`hl-gold`, `hl-teal`, `hl-coral`).
   - `source`: Official statutory, legal, or institutional citation for provenance.
   - `visual_archetype`: One of the 7 core editorial card patterns:
     1. *Macro HUD Scanner*: Lens/object targeting reticle.
     2. *Split Dossier*: "What it does" vs. "What it does not do".
     3. *Multi-Tier Audit Modules*: Staggered checklist chips (`01`, `02`, `03`).
     4. *Contract Breakdown*: Fee transparency and embossed stamp (`★ ZERO EQUITY ★`).
     5. *Logical Distinction*: Commercial Reality vs. Conspiracy Fallacy.
     6. *SEC Form 10-K Data Viz*: Institutional ownership bar/pie charts.
     7. *Ethical Principle Split*: Accountability vs. Scapegoating.
     8. *Editorial Climax*: Theatrical pedestal with verdict lockup.

---

### Step 2: Audio Master & Tactile Foley

1. **Voiceover Generation**:
   - Generate speech using Microsoft Edge TTS (e.g. `en-US-ChristopherNeural`, rate `+20%`, volume `+0%`).
   - Pacing: Clear, warm, authoritative, and inquisitive. Avoid shouting or sensationalism.

2. **Soundtrack Composition & Sidechain Ducking**:
   - Instrumentation: Upright acoustic walking bass, brushed jazz snare/cymbals, warm electric piano/organ, vibraphone accents.
   - Sidechain compression: Automatically duck music level by `-12 dB` during voice segments with a 150ms release.

3. **Tactile Sound Effects (SFX)**:
   Synchronize tactile audio cues with key visual moments:
   - $t \approx 0.1\text{s}$: Cardboard friction & solid hand grab.
   - $t \approx 1.0\text{s}$: Brass loupe tap & optical ping.
   - $t \approx 12.0\text{s}, 13.8\text{s}, 15.6\text{s}$: Subtle mechanical ticks on module checkmarks.
   - $t \approx 20.0\text{s}$: Paper contract rustle and fountain pen scribble.
   - $t \approx 45.0\text{s}$: Soft supermarket cart drop.
   - $t \approx 59.2\text{s}$: Subtle whoosh/glide for social loop reset.

4. **Master File Export**:
   Save as `assets/audio/master.wav` (44.1 kHz, 16-bit or 24-bit stereo) and `master.mp3` (320 kbps).

---

### Step 3: Photorealistic Documentary Plates (`generate_image`)

Never use raw flat geometric clip-art. Generate high-resolution, vertical 9:16 photographic plates for each scene using `generate_image`:

- **Aspect Ratio**: Always `'9:16'`.
- **Lighting**: Cinematic natural sunlight, warm grocery aisle lighting, cleanroom fluorescent with soft highlights, or dark studio spotlight with dust particles.
- **Depth of Field**: Shallow $f/2.0$–$f/2.8$ bokeh for background separation.
- **Subjects**: Realistic human adults with thoughtful, natural expressions; real objects with tactile micro-textures (creased cardboard, brushed brass, glass reflections, printed ink, fountain pen, stainless steel).

**Sample Prompts**:
- *Macro Hero*: `"Cinematic documentary macro vertical shot: Hand holding a Honey Crunch cereal box in a warm supermarket aisle. A vintage brass magnifying glass with real glass reflections sharply focuses on an embossed kosher dietary seal on the box. Tactical cardboard texture, soft grocery aisle bokeh, volumetric lighting, vertical 9:16, 8k."`
- *Human Interaction*: `"Cinematic documentary vertical shot: Adult woman shopper with glasses and coat examining a food package in a modern supermarket aisle alongside a friend. Authentic expressions of curiosity, warm ambient lighting, shallow depth of field, 35mm film still, vertical 9:16."`
- *Facility Audit*: `"Cinematic vertical shot inside a spotless modern food processing facility: Quality control inspector in white cleanroom coat and hairnet inspecting a stainless steel conveyor belt carrying toasted grains. Clean industrial lighting, steam, stainless steel pipes, vertical 9:16."`
- *Document & Contract*: `"Cinematic overhead oblique shot of a dark mahogany desk: Formal contract titled 'CERTIFICATION SERVICE AGREEMENT' with clauses for inspection and fees, brass fountain pen, reading glasses, verified stamp. Tactile paper grain, warm directional shadows, vertical 9:16."`

Save images into `assets/images/scene_1_macro.jpg` through `scene_8_closing.jpg`.

---

### Step 4: HyperFrames Composition Architecture (`index.html`)

See [`references/template_index.html`](references/template_index.html) for the complete boilerplate.

#### Key Static Guard Rules:
1. Root container attributes:
   ```html
   <div id="root" data-composition-id="main" data-width="1080" data-height="1920" data-layout-allow-overflow="true">
   ```
2. **Prevent Heavy Overlay Warnings / Black Frames**:
   - Place exactly **ONE** `.theatrical-spotlight` (with `clip-path`) and **ONE** `.global-vignette` at the `#root` level.
   - Never nest `clip-path`, `filter: blur()`, or `backdrop-filter: blur()` inside every scene container.
   - Use high-contrast solid/semi-translucent cards (`rgba(255, 249, 245, 0.96)` or `rgba(20, 17, 28, 0.96)`) with `3.5px solid var(--ink-black)` and offset drop shadows (`10px 10px 0 var(--ink-black)`).
3. **Allowing Layout Intentions**:
   - Add `data-layout-allow-overlap="true"` to headers, eyebrows, badges, and cards.
   - Add `data-layout-allow-occlusion="true"` to targeted HUD overlays and floating tags.

---

### Step 5: GSAP Deterministic Timeline

Register the timeline immediately on `window.__timelines["main"]`:
```javascript
window.__timelines = window.__timelines || {};
const tl = gsap.timeline({ paused: true });
window.__timelines["main"] = tl;
```

#### Camera Motion & Staging:
- Give each background plate a continuous, subtle slow zoom:
  ```javascript
  tl.fromTo("#plate-1", { scale: 1.0 }, { scale: 1.08, duration: 5.5, ease: "none" }, 0.0);
  ```
- Scene switching pattern:
  ```javascript
  // Exit previous scene
  tl.to("#scene-1", { opacity: 0, duration: 0.35 }, 5.15);
  tl.set("#scene-1", { display: "none" }, 5.5);

  // Enter next scene
  tl.set("#scene-2", { display: "block", opacity: 0 }, 5.5);
  tl.to("#scene-2", { opacity: 1, duration: 0.35 }, 5.5);
  tl.call(() => updateMetadata(2), null, 5.5);
  ```
- Seamless loop slide out at $t = 59.2\text{s}$:
  ```javascript
  tl.to("#root", { x: -1080, duration: 0.8, ease: "power2.in" }, 59.2);
  ```

---

### Step 6: Automated Validation & Final Render

Run the strict automated verification pipeline:

1. **Static & Runtime Check**:
   ```bash
   npx --yes hyperframes@0.8.152 check
   ```
   **Pass Criteria**:
   - 0 errors
   - 0 runtime warnings
   - 0 motion curve breaks
   - **100% WCAG AA contrast compliance** (all body text $\ge 4.5:1$, large headlines $\ge 3.0:1$).

2. **Render Visual Stream**:
   ```bash
   npx --yes hyperframes@0.8.152 render -o renders/visual.mp4 .
   ```

3. **Mux Audio Master**:
   ```bash
   ffmpeg -y -i renders/visual.mp4 -i assets/audio/master.wav -c:v copy -c:a aac -b:a 320k -shortest renders/master_60s.mp4
   ```

4. **Visual Snapshot Extraction & Inspection**:
   Extract 8 JPG frames at center timestamps:
   ```bash
   node scripts/extract_snapshots.cjs
   ```
   Inspect each frame with `view_file` to confirm visual balance, lighting, contrast, and typography.

---

## Detailed References

- [`references/style_guide.md`](references/style_guide.md) — Exact color palettes, typography scale, contrast formulas, and component CSS tokens.
- [`references/template_index.html`](references/template_index.html) — Reusable 1080×1920 boilerplate ready for new episodes.

---
name: cinematic-explainer-video
description: Produce high-end, broadcast-grade cinematic documentary explainer videos (vertical 9:16, 60s/30fps). Combines photorealistic documentary photography plates with HyperFrames HTML/GSAP rendering, episodic architectural diversity (zero shared templates/animations/images), bespoke data widgets, theatrical lighting, sidechain-ducked master audio, and strict 100% WCAG AA contrast compliance. Use when asked to create, reproduce, or iterate on Beyond The Myth episodes, documentary explainers, or realistic video essays.
---

# Cinematic Documentary Explainer Video Skill (v2.0 - Episodic Diversity Engine)

A production-grade system for creating broadcast-quality, 60-second vertical documentary explainer videos (1080 × 1920 @ 30 fps) inspired by Vox, Bloomberg QuickTake, and high-end investigative journalism.

---

## The Core Mandate: Zero Template Cloning & Episodic Uniqueness

When producing multi-episode series (such as *Beyond The Myth*), **never clone or copy visual templates, color palettes, animations, or image assets across episodes**. Each episode must be engineered as an autonomous cinematic work of art with its own dedicated visual personality:

1. **100% Exclusive Photographic Plates**: Every single image must be dedicated and topic-specific. Zero shared stock photos.
2. **Bespoke Visual Paradigms**: Each episode must adopt a tailored visual theme suited to its topic:
   - *Financial & Corporate Forensics*: Dark slate, SEC EDGAR Form 13F scanners, institutional waterfall ownership bars.
   - *Cultural Anthropology & Demographics*: Warm linen/espresso, Pew Research spectrum sliders, 4-pillar cultural mosaics.
   - *Historical Archival Investigations*: Aged parchment, declassified rubber stamps, side-by-side textual plagiarism columns.
   - *Civic Discourse & Ethics*: Modern Swiss blueprint, dynamic split-screen boundary lines, accountability trees.
   - *Ecclesiastical & Conciliar Decrees*: Basilica marble, cardinal red & Vatican gold, conciliar vote tally roll-ups.
   - *Investigative Journalism Broadsides*: 19th-century newspaper press slams (*J'Accuse*), court exoneration timeline steps.
   - *Digital Forensics & Media Literacy*: OLED cyber HUD, multi-tab lateral reading browser simulations, metadata magnifiers.
3. **Dedicated Interactive Info-Widgets**: Never settle for generic text boxes. Build custom CSS/GSAP interactive widgets (meters, comparison grids, stamped clearances, animated highlight marks).

---

## Master Production Pipeline

```
[1. Script & Cue Map] ➔ [2. Master Audio & Ducking] ➔ [3. Exclusive Photo Plates] 
                                                                 ⬇
[6. Final Delivery] ⬅ [5. FFmpeg Muxing] ⬅ [4. HyperFrames Validation & Render]
```

---

### Phase 1: Script Architecture & Dual-Voice Dialogic Structure

- **Format**: Vertical 1080 × 1920 (9:16 aspect ratio).
- **Duration**: Exactly 60.00 seconds (1,800 frames @ 30.0 fps).
- **Word Count**: 115–130 words (balanced for deliberate, authoritative pacing at ~130–140 WPM).
- **Dual-Voice Format**: Rotate between 2 distinct voices (e.g., **Maya** and **Alex**) to create dynamic dialogic rhythm rather than a lecture monologue.
- **7–8 Timed Scenes**: Millisecond-accurate timestamps (`start`, `end`, `speaker`, `text`, `on_screen`, `source`).

---

### Phase 2: Audio Production & Dynamic Sound Engineering

1. **TTS Voice Generation**:
   - Use high-fidelity neural voices (e.g. Microsoft Edge TTS `en-US-ChristopherNeural` or `en-US-AriaNeural`, rate `+15%` to `+20%`).
   - Natural prosody, investigative tone, zero artificial cheerfulness.
2. **Soundtrack & Foley Layering**:
   - Upright acoustic jazz bass, brushed drums, vibraphone, warm Rhode chords.
   - **Automatic Sidechain Ducking**: Attenuate background music by `-12 dB` during speech segments with smooth 150ms release.
3. **Master Export**:
   - Save to `assets/audio/master.wav` (44.1 kHz, 16-bit stereo) and `master.mp3`.

---

### Phase 3: Dedicated Photographic Plates (`generate_image`)

Generate 4 high-resolution, vertical (9:16) photorealistic plates per episode.

- **Strict Rule**: Zero vector clipart, zero flat cartoon illustrations.
- **Lighting**: Natural cinematic rim lighting, shallow depth of field ($f/2.0$–$f/2.8$), tactile real-world textures (cardboard grain, brass reflections, aged paper, newsprint ink, cleanroom stainless steel).
- **File Naming**: Save directly to `assets/images/scene_1_*.jpg` through `scene_4_*.jpg`.

---

### Phase 4: HyperFrames Composition Architecture (`index.html`)

Every episode must follow strict HyperFrames contract and layout rules:

1. **Root Attributes**:
   ```html
   <div id="stage" data-composition-id="<unique-ep-id>" data-width="1080" data-height="1920" data-duration="60">
   ```
2. **Layout Annotations**:
   - Elements that share vertical screen space (headers, topic badges, subtitles, footer citations) must have:
     `data-layout-allow-overlap="true"`.
   - Photographic plate containers with Ken Burns scale animations must have:
     `data-layout-allow-overflow="true"`.
3. **Timeline Registry**:
   ```javascript
   const tl = gsap.timeline({ paused: true });
   window.__timelines = window.__timelines || {};
   window.__timelines["<unique-ep-id>"] = tl;

   // Frame seeking hook for HyperFrames headless capture
   window.__seekFrame = (seconds) => {
     tl.seek(seconds);
   };
   ```
4. **Deterministic GSAP Control**:
   - **Never** use CSS `transition:` on animated elements (it breaks headless time-stepping).
   - Use `tl.fromTo()` for elements that have transforms or offsets to avoid transform conflict bugs.
5. **Strict WCAG AA Text Contrast**:
   - Minimum 4.5:1 contrast for all body text and badges.
   - Use verified high-contrast tokens: `#56D5FF` (cyan), `#FFA4A4` (coral), `#FDE047` (amber), `#34D399` (emerald), `#FFFFFF` (white) on dark backgrounds (`rgba(10, 15, 25, 0.95)`).

---

### Phase 5: Automated Verification & Rendering Pipeline

Always execute the complete 4-step verification:

1. **Static & Contrast Linting**:
   ```bash
   npx hyperframes check <episode_directory>
   ```
   *Pass Criteria*: 0 errors, 0 runtime warnings, 0 layout breaks, 100% WCAG AA contrast pass.

2. **Visual Stream Render**:
   ```bash
   npx hyperframes render <episode_directory> -o <episode_directory>/renders/visual.mp4 --fps 30
   ```

3. **FFmpeg Audio-Video Muxing**:
   ```bash
   ffmpeg -y -i <episode_directory>/renders/visual.mp4 -i <episode_directory>/assets/audio/master.wav -c:v copy -c:a aac -b:a 192k -shortest "<episode_directory>/renders/ep_master.mp4"
   ```

4. **Destination Delivery**:
   Copy final `.mp4` to user's export path (e.g., `G:\My Drive\Videos Youtube\`).

---

## Checkpoint Checklist

- [ ] All 4 images are 100% unique to this episode (verified with image hash audit).
- [ ] Visual style, typography, and color palette match the bespoke episode theme.
- [ ] Subtitles and voiceover timestamps are millisecond-synchronized.
- [ ] `npx hyperframes check` reports 0 errors and 100% WCAG AA contrast pass.
- [ ] Final video is exactly 60.00 seconds, 1080×1920 @ 30 fps with AAC stereo audio.
- [ ] Master file is copied to the destination folder with descriptive filename.

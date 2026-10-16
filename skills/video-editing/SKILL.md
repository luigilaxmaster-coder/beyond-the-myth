---
name: video-editing
description: >
  Edit and transform existing videos with AI using each::sense and HyperFrames.
  Apply effects, color grading (LUTs / neural), speed ramping, trimming,
  transitions, style transfer, and visual enhancements. Integrates both cloud
  neural transformations (eachlabs / each::sense) and local deterministic HyperFrames
  compositions (HTML/CSS, FFmpeg, media-treatment).
  Triggers: edit video, video editing, color grade, speed change, video effects,
  trim video, video filter, slow motion, timelapse, video style, video enhance, post production
---

# Video Editing (AI & HyperFrames Adapted)

Transform existing videos with AI-powered neural tools using [each::sense](https://docs.eachlabs.ai/sense/overview) and integrate them seamlessly into [HyperFrames](https://hyperframes.heygen.com) for deterministic timeline composition, typography overlays, and final rendering.

---

## 1. Cloud AI Neural Editing (`each::sense`)

Use `each::sense` for generative and neural transformations that require heavy machine learning models (style transfer to anime/claymation, AI-interpolated slow motion, AI denoise/stabilization).

> **API Key:** Requires `EACHLABS_API_KEY`. Set in your environment or pass via header `X-API-Key`.

### Quick Execution (cURL / Fetch)

```bash
curl -X POST https://eachsense-agent.core.eachlabs.run/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $EACHLABS_API_KEY" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": [
          {"type": "text", "text": "Apply a warm cinematic teal-and-orange grade with subtle 35mm film grain."},
          {"type": "image_url", "image_url": {"url": "https://example.com/raw-footage.mp4"}}
        ]
      }
    ],
    "stream": false
  }'
```

### Reference-Based Style Transfer

Pass up to 4 images/video URLs in OpenAI multimodal format:

```bash
curl -X POST https://eachsense-agent.core.eachlabs.run/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $EACHLABS_API_KEY" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": [
          {"type": "text", "text": "Match the visual style, contrast, and color temperature of the reference image."},
          {"type": "image_url", "image_url": {"url": "https://example.com/source-clip.mp4"}},
          {"type": "image_url", "image_url": {"url": "https://example.com/style-reference.jpg"}}
        ]
      }
    ],
    "stream": false
  }'
```

---

## 2. HyperFrames Local Deterministic Video Editing

When editing videos inside HyperFrames projects, leverage HyperFrames CLI tools and HTML/CSS/GSAP tracks:

### Media Treatments & Color Grades
HyperFrames provides built-in media treatments and color grade comparison:

```bash
# Discover or apply deterministic media treatments on clip elements
npx hyperframes media-treatment discover
npx hyperframes media-treatment apply --treatment film-grain

# Compare candidate color grades on a reference frame as a single labeled PNG
npx hyperframes grade-compare --source input.mp4
```

### Video Embedding & Trimming in Compositions
In `index.html`:

```html
<div data-composition-id="main" data-start="0" data-duration="10" data-width="1920" data-height="1080">
  <!-- Trimmed video playing from second 2 to second 8 with a fade in -->
  <video
    class="clip"
    src="assets/edited-clip.mp4"
    data-start="0"
    data-duration="6"
    data-media-start="2"
    data-track-index="0"
    style="width: 100%; height: 100%; object-fit: cover;"
  ></video>
</div>
```

---

## 3. Editing Capabilities Summary

| Category | AI Mode (`each::sense`) | HyperFrames / Local Mode |
|----------|------------------------|--------------------------|
| **Color Grading** | Neural style matching, cinematic palette prompts | CSS filters, 3D LUTs, `grade-compare` |
| **Speed Control** | Optical-flow neural slow-motion (0.25x/0.5x) | FFmpeg `setpts`, GSAP timeline rate |
| **Style Transfer** | Ghibli, 90s VHS, Cyberpunk, 35mm film | Shaders, SVG filters, canvas overlays |
| **Trimming** | Semantic trimming via prompt | `data-start`, `data-media-start`, FFmpeg `-ss -to` |
| **Audio & Voice** | AI voice enhancement | `npx hyperframes normalize-audio`, `/hyperframes-audio` |
| **Captions** | AI word-level alignment | `npx hyperframes transcribe`, `/embedded-captions` |

---

## 4. Verification & Rendering Pipeline

1. **Lint and Validate:**
   ```bash
   npx hyperframes check
   ```
2. **Preview Interactively:**
   ```bash
   npx hyperframes preview
   ```
3. **Render to MP4:**
   ```bash
   npx hyperframes render -o output.mp4
   ```

# Cinematic Documentary Explainer Style Guide

## 1. Color Palette Tokens & Contrast

| Token | Hex Code | Purpose | Typical Contrast vs Dark BG |
| :--- | :--- | :--- | :--- |
| `--bg-canvas` | `#0E0C14` | Deep obsidian canvas background | Base |
| `--paper-cream` | `#FFF9F5` | Editorial warm cream card background | $> 14:1$ vs ink |
| `--ink-black` | `#1A1722` | Card border, dark titles, and text | $> 14:1$ vs cream |
| `--ink-dark` | `#2A2535` | Secondary card titles and dark accents | $> 11:1$ vs cream |
| `--ink-muted` | `#554D63` | Subtitle text and muted descriptors | $> 6:1$ vs cream |
| `--gold-accent` | `#E8A825` | Show indicators, dots, gold foil | Contrast accent |
| `--gold-bright` | `#F5C542` | Primary highlighted keywords, active chips | $> 9:1$ vs dark glass |
| `--rust-accent` | `#C73B30` | Negative distinctions, rejected myths | $> 5.5:1$ vs light card |
| `--teal-accent` | `#195B56` | Verified badges, factual reality, citations | $> 6.5:1$ vs light card |
| `--mint-accent` | `#2A8C7D` | Secondary data points, verified tags | $> 5:1$ vs dark card |
| `--blue-accent` | `#3371E3` | Public & institutional filing charts | Graphic token |

### Caption Highlight Tokens:
- `.hl-gold`: `#FFD452` (Font weight 800)
- `.hl-teal`: `#58E2D0` (Font weight 800)
- `.hl-coral`: `#FF8A80` (Font weight 800)

---

## 2. Typography Scale

- **Display Headings**: `'Outfit', sans-serif`
  - Show Brand Title: `24px / 800` (letter-spacing `2px`, uppercase)
  - Card Primary Headlines: `34px / 800` (line-height `1.2`)
  - Big Climax Headlines: `46px–52px / 900` (line-height `1.22`)
  - Subtitles Active Text: `38px / 700` (line-height `1.32`)
- **Technical & Monospace Accents**: `'Space Grotesk', monospace`
  - Eyebrow Rotulo: `18px / 700` (letter-spacing `2px`, uppercase)
  - Episode Badge: `16px / 800` (letter-spacing `1.5px`)
  - Card Tags & Status Badges: `15px–17px / 800` (letter-spacing `1px`)
  - Source Attributions: `15px / 600` (letter-spacing `1.2px`)

---

## 3. Layout Grid & Safe Margins

- **Canvas Size**: 1080 × 1920 px (Exact 9:16 vertical ratio).
- **Safe Zone**:
  - Top: $48\text{px}$ (Show Header) to $140\text{px}$ (Eyebrow Rotulo).
  - Main Visual Stage: `top: 230px`, `left: 60px`, `right: 60px`, `height: 1240px`.
  - Subtitle Zone: `bottom: 60px`, `left: 60px`, `right: 60px`, `height: auto` (~$180\text{px}$).
- **Drop Shadows & Tactility**:
  - Light Paper Cards: `border: 3.5px solid var(--ink-black); box-shadow: 10px 10px 0 var(--ink-black), 0 20px 40px rgba(0,0,0,0.5);`
  - Dark Glass Cards: `border: 3.5px solid rgba(255, 255, 255, 0.3); box-shadow: 10px 10px 0 rgba(0,0,0,0.8), 0 20px 40px rgba(0,0,0,0.6);`
  - Subtitle Card: `border: 2px solid rgba(255, 255, 255, 0.25); box-shadow: 0 16px 40px rgba(0,0,0,0.7);`

---

## 4. Motion Curves & Timing Principles

- **Camera Push-In**: Constant smooth linear drift from `scale: 1.0` to `scale: 1.07`–`1.08` across the scene's entire duration (`ease: "none"`).
- **Card Entrances**:
  - `duration: 0.7s`, `ease: "power3.out"` or `ease: "back.out(1.4)"`.
  - Initial state: `y: 60`, `opacity: 0`.
- **Checklist Modules**:
  - Sequential staggered delay ($1.8\text{s}$–$2.0\text{s}$ apart).
  - `duration: 0.5s`, `ease: "power2.out"`.
- **Scene Crossfades**:
  - Previous scene exit: Fade out over $0.35\text{s}$ (`duration: 0.35`, `opacity: 0`), then `display: "none"`.
  - Next scene enter: `display: "block"`, fade in over $0.35\text{s}$ (`duration: 0.35`, `opacity: 1`).
- **Loop Reset**:
  - At $t = 59.2\text{s}$, smooth lateral slide out: `tl.to("#root", { x: -1080, duration: 0.8, ease: "power2.in" }, 59.2);`.

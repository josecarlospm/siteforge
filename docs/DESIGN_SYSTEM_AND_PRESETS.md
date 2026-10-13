# Design.md — SiteForge Design System & Style Presets

## 1. Design Token Taxonomy
SiteForge enforces strict design consistency across generated sites by deriving all layout and UI properties from design tokens compiled into CSS Custom Properties (`:root`).

```
Tokens Taxonomy
├── Color Semantics (--color-bg, --color-surface, --color-border, --color-primary, --color-accent)
├── Typography Scales (--font-heading, --font-body, --text-xs ... --text-4xl, --line-height)
├── Spatial System (--spacing-1 ... --spacing-16, --container-max-w)
├── Radii & Shapes (--radius-sm, --radius-md, --radius-lg, --radius-pill)
└── Elevation & Depth (--shadow-flat, --shadow-sm, --shadow-md, --shadow-ambient)
```

---

## 2. Predefined Aesthetic Presets

### Preset 1: `neo-brutalist`
* **Vibe**: High energy, retro-modern, deliberate asymmetry, bold contrasts.
* **Palette**: High contrast monochrome (`#FFFFFF` background, `#000000` borders) accented by saturated primaries (`#FFE600` electric yellow, `#FF5C00` blaze orange, `#6C5CE7` punch purple).
* **Borders & Radii**: Hard `3px` solid black borders (`--border-width: 3px;`), `0px` border-radius (`--radius-card: 0px;`).
* **Shadows**: Hard-offset retro drop shadows (`box-shadow: 4px 4px 0px #000000;`).
* **Typography**: Clean grotesque sans-serif (Space Grotesk / Inter) combined with monospaced badges (JetBrains Mono).

### Preset 2: `clean-editorial`
* **Vibe**: Sophisticated, literary, high-end publication, mindful reading.
* **Palette**: Soft cream backgrounds (`#FAF8F5`), charcoal text (`#1C1917`), muted champagne borders (`#E7E5E4`), burgundy/forest accents (`#7F1D1D` / `#14532D`).
* **Borders & Radii**: Delicate `1px` subtle borders, understated soft rounding (`--radius-card: 6px;`).
* **Shadows**: Low-contrast ambient diffusion (`box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);`).
* **Typography**: Editorial serif display (Playfair Display / Newsreader) paired with crisp reading sans (Inter / Source Sans).

### Preset 3: `modern-saas-dark`
* **Vibe**: Sleek, technical, ultra-modern developer tool or fintech product.
* **Palette**: Deep zinc dark mode (`#09090B` canvas, `#18181B` card surface), bright indigo/cyan accents (`#6366F1`, `#06B6D4`), crisp zinc text (`#FAFAFA`).
* **Borders & Radii**: Subtle translucent borders (`border: 1px solid rgba(255, 255, 255, 0.1);`), smooth rounding (`--radius-card: 12px;`).
* **Shadows & Effects**: Subtle back-glow gradients, frosted glass backdrop filters (`backdrop-filter: blur(12px);`).
* **Typography**: Precise geometric sans (Geist / Inter / Plus Jakarta Sans).

### Preset 4: `warm-organic` *(Flagship Preset for Plants / Wellness)*
* **Vibe**: Natural, wholesome, grounded, welcoming, wellness-oriented.
* **Palette**: Warm oat canvas (`#F7F5F0`), deep moss green primary (`#2D5A27`), sage secondary (`#8FBC8F`), warm terracotta accent (`#C86D51`), soft beige cards (`#FFFFFF`).
* **Borders & Radii**: Gentle rounded pill shapes (`--radius-card: 16px; --radius-btn: 9999px;`), subtle warm borders (`#E5E0D8`).
* **Shadows**: Soft warm drop shadows (`box-shadow: 0 8px 30px rgba(45, 90, 39, 0.06);`).
* **Typography**: Organic humanist sans (Fraunces / Recoleta for headings, Nunito / Plus Jakarta Sans for body).

### Preset 5: `corporate-enterprise`
* **Vibe**: Authoritative, dependable, compliant, structured enterprise data.
* **Palette**: Crisp white canvas (`#FFFFFF`), slate blue surface (`#F8FAFC`), deep navy primary (`#0F172A`), enterprise blue accent (`#2563EB`).
* **Borders & Radii**: Structured grid lines, conservative rounding (`--radius-card: 8px;`).
* **Shadows**: Clean multi-layer corporate elevation.
* **Typography**: Highly readable industrial sans (Inter / Roboto).

---

## 3. CSS Variable Compilation Matrix

```css
/* Example Warm-Organic Theme Variables compiled into Angular root */
:root[data-theme="warm-organic"] {
  --color-bg: #F7F5F0;
  --color-surface: #FFFFFF;
  --color-surface-muted: #EFECE6;
  --color-text-main: #1E281E;
  --color-text-muted: #556B55;
  --color-primary: #2D5A27;
  --color-primary-hover: #22451E;
  --color-accent: #C86D51;
  --color-border: #E5E0D8;
  
  --font-heading: 'Fraunces', serif;
  --font-body: 'Plus Jakarta Sans', sans-serif;
  
  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 20px;
  --radius-pill: 9999px;
  
  --shadow-card: 0 10px 30px -10px rgba(45, 90, 39, 0.08);
}
```

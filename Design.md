# Design.md — SiteForge Design System

Master specification for every SiteForge-generated site and the factory portal.
Token compilers and Angular maps must stay in sync with this file.

**Enum compatibility:** `designPreset` payload keys are unchanged
(`warm-organic` · `neo-brutalist` · `clean-editorial` · `modern-saas-dark` · `corporate-enterprise`).
Aesthetics were rewritten in place — no Backend enum migration required.

---

## 1. Design Principles

1. **One composition first** — the opening viewport is a single scene (brand, one headline, one supporting line, one CTA group, one dominant image). Not a dashboard.
2. **Brand before copy** — the product name is a hero-level signal, not nav chrome.
3. **Atmosphere over flat fill** — backgrounds use gradients, material texture, or real photography; never a single dead flat color as the whole idea.
4. **Cards are rare** — only when a control needs a container. No decorative card grids.
5. **Motion with purpose** — 2–3 intentional motions max for visually led surfaces; no decorative bounce spam.

---

## 2. Do Not Ship (Anti-Slop Rules)

Implementers and generators **must not** ship any of the following:

| Forbidden pattern | Why |
|---|---|
| Cream / oat canvas (`#F4F1EA`, `#F7F5F0`, `#FAF8F5`) + serif display + terracotta / clay accent | Overused “AI wellness / plant-care” cluster |
| Purple-on-white or purple→indigo gradient SaaS look (`#6366F1`, `#8B5CF6`, glow orbs) | Generic AI-SaaS template |
| Broadsheet / newspaper defaults (hairline rules, zero-radius dense columns, Playfair-on-cream mastheads) | Generic “editorial AI” look |
| Emoji as brand marks or logo substitutes | Cheapens the brand |
| Pill clusters, badge strips, floating chips on media | Clutter; reads as template chrome |
| Hero stat / metric strips (“10k users”, “4.9★”, feature count rows) | Hero budget violation |
| Detached labels, promo stickers, or callout badges overlaid on hero media | Visual noise |
| Cards wrapping non-interactive content | Fake structure |
| Default stacks as brand type: Inter, Roboto, Arial, system-ui alone | No distinctive voice |
| Multi-layer neon glow shadows on dark UIs | Glow-SaaS cliché |

**Hard checks before merge**

- [ ] First viewport has no stats, schedules, address blocks, or secondary promos
- [ ] No cream + serif + terracotta combination anywhere
- [ ] No indigo/violet primary on white or zinc dark
- [ ] CTA radius is not `9999px` unless the preset explicitly allows a single capsule control
- [ ] Imagery shows product / place / atmosphere — not abstract purple mesh alone

---

## 3. Token Taxonomy

```
Tokens
├── Color     --color-bg, --color-surface, --color-surface-muted,
│             --color-text-main, --color-text-muted,
│             --color-primary, --color-primary-hover,
│             --color-secondary, --color-secondary-hover,
│             --color-accent, --color-accent-hover, --color-border
├── Type      --font-heading, --font-body, --font-mono,
│             --text-xs … --text-5xl, --line-height-*
├── Space     --spacing-1 … --spacing-16, --container-max-w
├── Shape     --border-width, --radius-sm|md|lg|card|btn|pill
└── Depth     --shadow-flat|card|ambient|button, --backdrop-blur
```

Compiled output lives as CSS custom properties on `:root[data-theme="<preset>"]`.

---

## 4. Preset Catalog

### 4.1 `warm-organic` — Greenhouse Lab *(PlantCare / botanical learning flagship)*

**Moodboard:** A working greenhouse at dawn — cool limestone paths, wet leaf chlorophyll, steel plant tags, diffused skylight. Scientific and alive, never spa-wellness. Photography of real foliage and potting benches; typography feels like a field lab, not a lifestyle blog.

**Tokens**

| Token | Value |
|---|---|
| bg | `#E7EEEA` |
| surface | `#F5F9F6` |
| surfaceMuted | `#D2DDD6` |
| textMain | `#0F241C` |
| textMuted | `#3D5A4C` |
| primary | `#145C45` |
| primaryHover | `#0E4634` |
| secondary | `#2F8F6B` |
| secondaryHover | `#267A5A` |
| accent | `#1A5F7A` |
| accentHover | `#144A5F` |
| border | `#A8BDB2` |
| fontHeading | Syne |
| fontBody | DM Sans |
| fontMono | IBM Plex Mono |
| borderWidth | `1px` |
| radiusCard / btn | `8px` / `6px` |
| shadows | Cool, low-contrast; no green glow |

**Use for:** learning platforms about plants, outdoors, science education.
**Avoid:** terracotta (`#C86D51`), Fraunces/Recoleta, cream canvas, pill CTAs, leaf emojis.

---

### 4.2 `neo-brutalist` — Signal Block

**Moodboard:** Screen-print poster energy — flat ink, hard black rules, electric yellow fields, coral strike accents. Loud on purpose; zero purple SaaS leftovers.

**Tokens**

| Token | Value |
|---|---|
| bg | `#FFFDF8` |
| surface | `#FFFFFF` |
| surfaceMuted | `#FFF0A8` |
| textMain / muted | `#000000` / `#333333` |
| primary | `#FFE600` |
| secondary | `#00C2A8` *(replaces former purple)* |
| accent | `#FF5C00` |
| border | `#000000` |
| fonts | Space Grotesk + JetBrains Mono |
| borderWidth | `3px` |
| radii | all `0px` |
| shadows | Hard offset `4px 4px 0 #000` |

**Use for:** bold campaigns, youth brands, playful product launches.
**Avoid:** soft blur shadows, purple accents, rounded pills.

---

### 4.3 `clean-editorial` — Gallery Press

**Moodboard:** Contemporary gallery wall label + museum catalog — cool gray paper, deep ink, a single vermillion print accent. Wide margins, quiet hierarchy. Literary without newspaper columns.

**Tokens**

| Token | Value |
|---|---|
| bg | `#EEF0F2` |
| surface | `#FFFFFF` |
| surfaceMuted | `#E2E6EA` |
| textMain / muted | `#121417` / `#4A525C` |
| primary | `#1B3A4B` |
| secondary | `#5C6B73` |
| accent | `#B33A3A` |
| border | `#D0D5DA` |
| fontHeading | Literata |
| fontBody | Source Sans 3 |
| fontMono | IBM Plex Mono |
| borderWidth | `1px` |
| radiusCard / btn | `2px` / `2px` |
| shadows | Near-flat; prefer borders over elevation |

**Use for:** blogs, newsletters, long-form reading.
**Avoid:** cream paper, Playfair mastheads, dense multi-column broadsheet grids, hairline rule spam.

---

### 4.4 `modern-saas-dark` — Forge Night *(SiteForge factory / portal default)*

**Moodboard:** Night shift at a fabrication bay — graphite chassis, ember-orange controls, brass status lights, monospace telemetry. Industrial precision for the factory UI; no indigo glow orbs.

**Tokens**

| Token | Value |
|---|---|
| bg | `#0E1116` |
| surface | `#171C24` |
| surfaceMuted | `#222833` |
| textMain / muted | `#F2F0EB` / `#8B93A1` |
| primary | `#E07A3D` |
| primaryHover | `#C96830` |
| secondary | `#5A6A7A` |
| accent | `#C9A227` |
| border | `rgba(255, 255, 255, 0.10)` |
| fonts | IBM Plex Sans + IBM Plex Mono |
| borderWidth | `1px` |
| radiusCard / btn | `6px` / `4px` |
| shadows | Deep black only; ember tint on buttons only |
| backdropBlur | `8px` |

**Use for:** SiteForge portal, developer tools, dark product shells.
**Avoid:** indigo/violet primaries, cyan neon glows, multi-layer purple ambient shadows, Inter/Plus Jakarta as the brand voice.

---

### 4.5 `corporate-enterprise` — Ledger

**Moodboard:** Swiss institutional stationery — white field, charcoal ink, teal authority mark, brass secondary accent. Structured and calm; trustworthy without generic “startup blue.”

**Tokens**

| Token | Value |
|---|---|
| bg | `#FFFFFF` |
| surface | `#F4F6F5` |
| surfaceMuted | `#E8ECEA` |
| textMain / muted | `#0A1628` / `#4A5560` |
| primary | `#0D5C63` |
| primaryHover | `#0A4A50` |
| secondary | `#3D4F5F` |
| accent | `#A67C00` |
| border | `#D5DCE0` |
| fonts | IBM Plex Sans (heading + body) + IBM Plex Mono |
| borderWidth | `1px` |
| radiusCard / btn | `4px` / `4px` |
| shadows | Single soft slate lift |

**Use for:** B2B, compliance, finance-adjacent, enterprise marketing.
**Avoid:** `#2563EB` SaaS blue, Inter-only stacks, pill CTAs, rainbow badge rows.

---

## 5. Moodboard Briefs (one line each)

| Preset | Direction |
|---|---|
| `warm-organic` | Cool greenhouse lab — chlorophyll, limestone, steel tags; botanical science, not wellness spa. |
| `neo-brutalist` | Ink-on-paper poster — yellow fields, coral strike, teal secondary; hard edges only. |
| `clean-editorial` | Gallery wall catalog — cool paper, deep ink, vermillion print; quiet margins, no broadsheet. |
| `modern-saas-dark` | Forge night bay — graphite, ember, brass telemetry; factory portal voice. |
| `corporate-enterprise` | Swiss ledger — white, teal authority, brass accent; calm institutional structure. |

---

## 6. Theme → Preset Mapping Guidance

| Domain theme examples | Preferred preset |
|---|---|
| Home plants / outdoor learning | `warm-organic` |
| Tech newsletter / magazine | `clean-editorial` |
| SiteForge factory portal / developer SaaS | `modern-saas-dark` |
| Bold D2C / campaign landing | `neo-brutalist` |
| B2B / enterprise / compliance | `corporate-enterprise` |

Payload may still override colors/fonts; overrides must not reintroduce forbidden anti-slop combinations.

---

## 7. Compilation Contract

- Source of truth for token *values*: `scaffolding-engine/src/presets/design-presets.ts` (must match this doc).
- Angular runtime map: `starter-workspace/src/app/core/models/design-tokens.model.ts`.
- Multi-theme stylesheet: `starter-workspace/src/styles/design-tokens.css`.
- Compiler: `TokenCompiler.compilePresetToCss()` / `compileAllPresets()`.
- Default fallback preset remains `warm-organic` (Greenhouse Lab values).

---

## 8. Implementer Checklist (SF-10 / SF-11)

- [ ] Load tokens only via CSS variables — no hard-coded cream/terracotta/indigo
- [ ] Hero follows hero budget (brand + headline + line + CTA + one image plane)
- [ ] No pill clusters, emoji logos, or floating badges on media
- [ ] Cards only around interactive controls
- [ ] Preset moodboard direction is recognizable in the first viewport
- [ ] Factory portal uses `modern-saas-dark` (Forge Night) as its shell default when building SiteForge UI

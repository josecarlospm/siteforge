# Design System & Presets

Canonical specification: **[`../Design.md`](../Design.md)** (SF-09 rewrite + SF-13.1 `pulse-magazine`).

This file is a short index for docs navigation. Do not diverge token values from `Design.md`.

## Preset keys (stable enums)

| `designPreset` | Display name | Role |
|---|---|---|
| `warm-organic` | Greenhouse Lab | Botanical / PlantCare learning flagship |
| `neo-brutalist` | Signal Block | High-energy campaign / poster |
| `clean-editorial` | Gallery Press | Literary blog / quiet newsletter / long-form |
| `modern-saas-dark` | Forge Night | SiteForge factory portal / dark product |
| `corporate-enterprise` | Ledger | B2B / enterprise |
| `pulse-magazine` | Pulse Wire | Tech-magazine / dense editorial blog (Pulse Feed samples) |

Layout contract for `pulse-magazine`: [`PULSE_MAGAZINE_LAYOUT_CONTRACT.md`](./PULSE_MAGAZINE_LAYOUT_CONTRACT.md).

## Anti-slop (summary)

See `Design.md` §2. Hard bans: cream+serif+terracotta, purple-indigo SaaS, broadsheet defaults, emoji logos, pill clusters, hero stat strips, floating badges on media, decorative cards.

## Compiler

- Registry: `scaffolding-engine/src/presets/design-presets.ts`
- Angular map: `starter-workspace/src/app/core/models/design-tokens.model.ts`
- CSS: `starter-workspace/src/styles/design-tokens.css`
- API: `TokenCompiler.compilePresetToCss()` / `compileAllPresets()`

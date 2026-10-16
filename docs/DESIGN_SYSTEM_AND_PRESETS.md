# Design System & Presets

Canonical specification: **[`../Design.md`](../Design.md)** (SF-09 rewrite).

This file is a short index for docs navigation. Do not diverge token values from `Design.md`.

## Preset keys (stable enums)

| `designPreset` | Display name | Role |
|---|---|---|
| `warm-organic` | Greenhouse Lab | Botanical / PlantCare learning flagship |
| `neo-brutalist` | Signal Block | High-energy campaign / poster |
| `clean-editorial` | Gallery Press | Blog / newsletter / long-form |
| `modern-saas-dark` | Forge Night | SiteForge factory portal / dark product |
| `corporate-enterprise` | Ledger | B2B / enterprise |

**No Backend enum migration** — keys unchanged; aesthetics reinvented in place.

## Anti-slop (summary)

See `Design.md` §2. Hard bans: cream+serif+terracotta, purple-indigo SaaS, broadsheet defaults, emoji logos, pill clusters, hero stat strips, floating badges on media, decorative cards.

## Compiler

- Registry: `scaffolding-engine/src/presets/design-presets.ts`
- Angular map: `starter-workspace/src/app/core/models/design-tokens.model.ts`
- CSS: `starter-workspace/src/styles/design-tokens.css`
- API: `TokenCompiler.compilePresetToCss()` / `compileAllPresets()`

# Pulse Magazine Layout Contract

**Preset:** `pulse-magazine` (Pulse Wire)  
**Sample brand:** **Pulse Feed** (fictional — never use The Verge name, logo, wordmark, art, or copy)  
**Site type (v1):** `blog`  
**Audience:** Angular Lead (Stage 2 kickstart) + generators

This is layout DNA only — no finished public site in Stage 1.

---

## Page stack (top → bottom)

```
┌─────────────────────────────────────────┐
│ 1. Masthead                             │
├─────────────────────────────────────────┤
│ 2. Featured lead package (viewport #1)  │
├─────────────────────────────────────────┤
│ 3. Story river                          │
├─────────────────────────────────────────┤
│ 4. Themed packages (1…n)                │
├─────────────────────────────────────────┤
│ 5. Footer (minimal)                     │
└─────────────────────────────────────────┘
```

---

## 1. Masthead

- **Brand first:** “Pulse Feed” wordmark is the hero of chrome — large, tight Archivo, high contrast on `--color-bg`. Not a tiny nav label.
- Optional: one row of section links (AI, Gadgets, Policy, …) in `--color-text-muted`; active/hover uses `--color-primary` (chartreuse).
- No search mega-panels, no promo stickers, no emoji logos.
- Border: single `--color-border` rule under the masthead — not a hairline broadsheet grid.

---

## 2. Featured lead package

Owns the **first viewport after the masthead**.

| Slot | Rules |
|---|---|
| Media | Full-bleed or edge-to-edge dominant image plane (product / place / atmosphere). No inset cards, no floating badges on media. |
| Category | Optional small chartreuse label (`--color-primary`) |
| Headline | One loud sans headline (`--font-heading`) |
| Dek | One short supporting sentence (`--color-text-muted`) |
| Byline | Author + timestamp in mono or muted body |

Hero budget: brand (in masthead) + one headline + one dek + byline + one image. No stats strips, schedule blocks, or secondary promos in this viewport.

---

## 3. Story river

- Dense **vertical** feed of headlines — scannable list, not a card grid.
- Each row: headline + optional dek snippet + byline / relative time.
- Separators: subtle `--color-border` or spacing rhythm — avoid dense multi-column newspaper columns.
- No decorative cards wrapping non-interactive rows.

---

## 4. Themed packages

- Section block with a **package title** (e.g. “This week in AI” — sample copy only; invent Pulse Feed titles).
- Clustered stories under that title (2–6 items).
- Package title may use `--color-accent` (hot amber) for “breaking / live” packages; default packages stay near-white.
- Still not a marketing card grid — list or compact media+headline pairs.

---

## 5. Footer (minimal)

- Wordmark + short legal / about / social links.
- No newsletter mega-forms, no badge clusters, no emoji.

---

## Motion (2–3 max)

1. Masthead wordmark or lead headline: short fade/slide on first paint.  
2. Story river rows: subtle stagger on scroll into view (keep short).  
3. Optional: chartreuse underline grow on nav hover.

No bounce spam, no neon glow pulses.

---

## Token reminder

Load only via `data-theme="pulse-magazine"` CSS variables from Design.md §4.6.  
Hard bans (Design.md §2): cream+serif+terracotta, purple SaaS, broadsheet hairlines, Verge IP.

---

## Stage 2 kickstart (DRE-124 / SF-13.2)

Runnable Angular sample: **[josecarlospm/pulse-feed-kickstart](https://github.com/josecarlospm/pulse-feed-kickstart)** — clone for agents; not the factory monorepo.

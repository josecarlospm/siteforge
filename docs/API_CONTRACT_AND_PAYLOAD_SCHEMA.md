# SiteForge Input Parameters Contract & JSON Schema

## 1. Overview
The SiteForge pipeline receives a JSON payload specifying the website characteristics and integration details. The schema is organized into three primary conceptual pillars plus integration credentials.

```
+-----------------------------------------------------------------------------------------+
|                                    SITEFORGE PAYLOAD                                    |
+------------------------------+---------------------------+------------------------------+
| 1. ARCHETYPE (siteType)      | 2. DESIGN (designPreset)  | 3. THEME (theme)             |
| - learning_platform          | - neo-brutalist           | - Domain Topic               |
| - blog                       | - clean-editorial         | - Title & Tagline            |
| - newsletter                 | - modern-saas-dark        | - Color Overrides            |
| - ecommerce                  | - warm-organic            | - Content Entities & Seed    |
| - social_media               | - corporate-enterprise    |   (Courses, Articles, etc.)  |
| - landing_page               | - pulse-magazine          |                              |
+------------------------------+---------------------------+------------------------------+
| 4. INTEGRATIONS (github, vercel)                                                        |
| - repository name, private/public, organization                                         |
| - vercel project name, framework preset, env vars                                       |
+-----------------------------------------------------------------------------------------+
```

---

## 2. Parameter Mapping Table

| Parameter Path | Type | Allowed Values / Format | Description |
|---|---|---|---|
| `version` | `string` | `"1.0.0"` | Payload contract schema version |
| `siteType` | `enum` | `learning_platform`, `blog`, `newsletter`, `ecommerce`, `social_media`, `landing_page` | High-level structural website archetype |
| `designPreset` | `enum` | `neo-brutalist`, `clean-editorial`, `modern-saas-dark`, `warm-organic`, `corporate-enterprise`, `pulse-magazine` | Token preset defined in `Design.md` |
| `theme.topic` | `string` | e.g. `"Indoor Houseplant Care"` | The core subject matter |
| `theme.name` | `string` | e.g. `"PlantCare Academy"` | Brand / commercial site name |
| `theme.tagline` | `string` | e.g. `"Master the art of indoor gardening"` | Marketing tagline |
| `theme.description`| `string` | e.g. `"Step-by-step masterclasses on watering..."` | Meta description and hero copy |
| `theme.branding.primaryColor` | `string` | Hex format (e.g. `"#145C45"`) | Optional primary brand accent override |
| `theme.branding.secondaryColor` | `string` | Hex format (e.g. `"#E8F0E6"`) | Optional surface accent override |
| `theme.content` | `object` | Archetype-specific entity collections | Domain data items (courses, lessons, posts) |
| `integrations.github.repoName` | `string` | e.g. `"plantcare-academy-web"` | Target repository name on GitHub |
| `integrations.github.isPrivate` | `boolean` | `true` \| `false` | Whether GitHub repo is private |
| `integrations.vercel.projectName` | `string` | e.g. `"plantcare-academy-web"` | Target Vercel project slug (must match a real project alias) |
| `integrations.vercel.teamId` | `string` | Optional team ID | Vercel team scope |

---

## 3. Canonical JSON Schema (`site-factory-payload.schema.json`)

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://siteforge.io/schemas/v1/payload.json",
  "title": "SiteForgePayload",
  "type": "object",
  "required": ["version", "siteType", "designPreset", "theme", "integrations"],
  "properties": {
    "version": {
      "type": "string",
      "enum": ["1.0.0"]
    },
    "siteType": {
      "type": "string",
      "enum": [
        "learning_platform",
        "blog",
        "newsletter",
        "ecommerce",
        "social_media",
        "landing_page"
      ]
    },
    "designPreset": {
      "type": "string",
      "enum": [
        "neo-brutalist",
        "clean-editorial",
        "modern-saas-dark",
        "warm-organic",
        "corporate-enterprise",
        "pulse-magazine"
      ]
    },
    "theme": {
      "type": "object",
      "required": ["topic", "name", "tagline", "description"],
      "properties": {
        "topic": { "type": "string", "minLength": 2 },
        "name": { "type": "string", "minLength": 2 },
        "tagline": { "type": "string", "minLength": 5 },
        "description": { "type": "string", "minLength": 10 },
        "branding": {
          "type": "object",
          "properties": {
            "primaryColor": { "type": "string", "pattern": "^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$" },
            "secondaryColor": { "type": "string", "pattern": "^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$" },
            "fontHeading": { "type": "string" },
            "fontBody": { "type": "string" }
          }
        },
        "content": {
          "type": "object",
          "description": "Specific entity arrays matching the chosen siteType (e.g., courses, articles, products)"
        }
      }
    },
    "integrations": {
      "type": "object",
      "required": ["github", "vercel"],
      "properties": {
        "github": {
          "type": "object",
          "required": ["repoName"],
          "properties": {
            "repoName": { "type": "string", "pattern": "^[a-zA-Z0-9._-]+$" },
            "owner": { "type": "string" },
            "isPrivate": { "type": "boolean", "default": false },
            "autoInit": { "type": "boolean", "default": true }
          }
        },
        "vercel": {
          "type": "object",
          "required": ["projectName"],
          "properties": {
            "projectName": { "type": "string", "pattern": "^[a-zA-Z0-9-]+$" },
            "teamId": { "type": "string" },
            "framework": { "type": "string", "default": "angular" },
            "envVariables": {
              "type": "object",
              "additionalProperties": { "type": "string" }
            }
          }
        }
      }
    }
  }
}
```

---

## 4. Design preset mapping (`pulse-magazine`)

| Enum key | Display name | Preferred `siteType` | Notes |
|---|---|---|---|
| `pulse-magazine` | Pulse Wire | `blog` (v1) | Tech-magazine / dense editorial chrome. Layout: [`PULSE_MAGAZINE_LAYOUT_CONTRACT.md`](./PULSE_MAGAZINE_LAYOUT_CONTRACT.md). Tokens: `Design.md` §4.6. |

Canonical sample: `payload-schema/samples/blog-pulse-magazine.payload.json`.

```json
{
  "version": "1.0.0",
  "siteType": "blog",
  "designPreset": "pulse-magazine",
  "theme": {
    "topic": "Consumer Tech News & Gadgets",
    "name": "Pulse Feed",
    "tagline": "Live product launches, reviews, and the overnight signal",
    "description": "A dense tech-magazine blog covering consumer electronics, AI gadgets, and breaking product news."
  },
  "integrations": {
    "github": { "repoName": "pulse-feed-kickstart" },
    "vercel": { "projectName": "pulse-feed-kickstart", "framework": "angular" }
  }
}
```

No new `siteType` is required in v1 — pair `pulse-magazine` with `blog`.

# SiteForge — Angular 19+ Scaffolding Engine & Angular CLI MCP Harness

**SiteForge** (*The Autonomous Angular Web Factory*) builds modern, schema-driven Angular web applications deployed to Vercel.

This repository contains the deliverables for **[SF-03] Angular 19+ Scaffolding Engine & Angular CLI MCP Harness**:
1. **Modern Angular Architecture & Starter Workspace** (`starter-workspace/`):
   - Standalone components only (no NgModules).
   - Signals for reactive state (`signal`, `computed`, `effect`, `input`, `output`, `model`).
   - Zoneless change detection (`provideZonelessChangeDetection()`).
   - Modern `@if` and `@for (item of items; track item.id)` control flow.
   - Modular Layout Primitives (`Header`, `Hero`, `ContentGrid`, `Card`, `Sidebar`, `Footer`).
   - Flagship Reference Showcase: **PlantCare Academy** (Home Plants Care E-Learning Portal).
   - Compiles with zero warnings and passes all unit tests.

2. **Autonomous Scaffolding Engine** (`scaffolding-engine/`):
   - Programmatic TypeScript engine and CLI (`siteforge-scaffold`).
   - Design Token Compiler: compiles `Design.md` aesthetic presets (`warm-organic`, `neo-brutalist`, `clean-editorial`, `modern-saas-dark`, `corporate-enterprise`) into CSS Custom Properties (`:root[data-theme="..."]`).
   - Full scaffolding support across all 6 archetypes:
     - `learning_platform`
     - `blog`
     - `newsletter`
     - `ecommerce`
     - `social_media`
     - `landing_page`
   - Complete Vitest test suite covering token compilation and project generation.

3. **Angular CLI Model Context Protocol (MCP) Harness** (`mcp-harness/`):
   - Integrates the official Angular CLI MCP server (`npx -y @angular/cli mcp`).
   - Typed client `AngularMcpClient` implementing JSON-RPC 2.0 communication over stdio.
   - Live capabilities:
     - `search_documentation`: Live queries against official `angular.dev` docs.
     - `get_best_practices`: Retrieval of official Angular coding standards and rules.
     - `list_projects`: Workspace discovery and configuration introspection.
     - `onpush_zoneless_migration`: Zoneless migration planning.
     - `run_target`: Programmatic target execution (`build`, `test`, `lint`).
   - CLI diagnostic runner (`bin/runner.js`) and live integration test suite.

---

## Workspace Structure

```
.
├── starter-workspace/       # Modern Angular Starter Workspace & Flagship Showcase
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/        # ThemeService, PayloadService, models
│   │   │   ├── layout/      # Header, Hero, ContentGrid, Card, Sidebar, Footer
│   │   │   └── showcase/    # PlantCare Academy showcase view
│   │   └── styles/          # design-tokens.css (all 5 Design.md presets)
│   └── dist/                # Production build artifacts
│
├── scaffolding-engine/      # Scaffolding Engine & Design Token Compiler
│   ├── src/
│   │   ├── compiler/        # TokenCompiler (Design.md -> CSS Variables)
│   │   ├── generator/       # ProjectGenerator
│   │   ├── presets/         # Design Presets registry
│   │   └── templates/       # Archetype & workspace templates
│   ├── bin/                 # siteforge-scaffold CLI
│   └── tests/               # Unit test suite
│
├── mcp-harness/             # Angular CLI MCP Server Integration
│   ├── config/              # angular-cli-mcp.json MCP configuration
│   ├── src/                 # AngularMcpClient (JSON-RPC 2.0 stdio client)
│   ├── bin/                 # runner.js diagnostic CLI
│   └── tests/               # Live integration test suite
│
├── docs/                    # Architecture, API contracts, presets, flagship specs
├── samples/                 # Sample SiteForge JSON payloads
└── package.json             # Monorepo workspaces definition
```

---

## Verification & Testing

### 1. Run All Tests
```bash
npm run test:engine     # Runs scaffolding-engine unit tests (9/9 pass)
npm run test:starter    # Runs starter-workspace Angular unit tests (5/5 pass)
npm run test:github     # Runs github-engine unit tests (7/7 pass)
npm run test:vercel     # Runs vercel-pipeline unit & orchestration tests (22/22 pass)
npm run test:mcp        # Runs live Angular CLI MCP integration tests (3/3 pass)
npm run test:all        # Runs entire test suite across all 6 workspaces
```

### 2. Build the Packages & Workspace
```bash
npm run build           # Compiles all packages and starter workspace
npm run build:vercel    # Compiles @siteforge/vercel-pipeline
```

### 3. Deploy to Vercel (Zero-Config Orchestrator)
```bash
# Dry run verification
npm run deploy:vercel -- --payload samples/plantcare-academy.payload.json --dry-run

# Production live deployment
npm run deploy:vercel -- --payload samples/plantcare-academy.payload.json
```

### 4. Test Scaffolding from JSON Payload
```bash
node scaffolding-engine/bin/siteforge-scaffold.js \
  --payload samples/plantcare-academy.payload.json \
  --output generated/plantcare-web
```

### 5. Query Angular CLI MCP Server
```bash
node mcp-harness/bin/runner.js tools
node mcp-harness/bin/runner.js standards
node mcp-harness/bin/runner.js docs "signals"
```

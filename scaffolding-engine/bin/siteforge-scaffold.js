#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// When running compiled vs uncompiled, support both
let ProjectGenerator;
try {
  ProjectGenerator = require('../dist/index.js').ProjectGenerator;
} catch (e) {
  // If not compiled yet, register ts-node or run with tsx/node
  console.error('Please build the scaffolding-engine first: npm run build');
  process.exit(1);
}

const args = process.argv.slice(2);
function getArg(flag) {
  const idx = args.indexOf(flag);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : null;
}

if (args.includes('--help') || args.length === 0) {
  console.log(`
SiteForge Angular 19+ Scaffolding CLI
Usage:
  siteforge-scaffold --payload <path-to-json> --output <target-dir> [--preset <preset>]

Options:
  --payload   Path to valid SiteForge JSON payload file (required)
  --output    Target directory to scaffold project into (required)
  --preset    Override designPreset (neo-brutalist, warm-organic, etc.)
  --help      Show this help message
`);
  process.exit(0);
}

const payloadPath = getArg('--payload');
const outputDir = getArg('--output');
const presetOverride = getArg('--preset');

if (!payloadPath || !outputDir) {
  console.error('Error: Both --payload and --output arguments are required.');
  process.exit(1);
}

try {
  const raw = fs.readFileSync(path.resolve(payloadPath), 'utf-8');
  const payload = JSON.parse(raw);

  if (presetOverride) {
    payload.designPreset = presetOverride;
  }

  console.log(`Scaffolding Angular 19+ site for "${payload.theme?.name}" (${payload.siteType}) into: ${outputDir}...`);
  const result = ProjectGenerator.generateProject(payload, path.resolve(outputDir));

  console.log('✓ Successfully generated SiteForge project!');
  console.log(`  Site Type:      ${result.siteType}`);
  console.log(`  Design Preset:  ${result.designPreset}`);
  console.log(`  Files Created:  ${result.filesGenerated.length}`);
} catch (err) {
  console.error('Scaffolding failed:', err.message);
  process.exit(1);
}

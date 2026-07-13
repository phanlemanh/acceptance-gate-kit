#!/usr/bin/env node
// design-detect-surface.mjs — does this feature render a web-UI surface?
//
// Deterministic heuristic (no detector engine): reads contract.md frontmatter
// `surfaces:` and decides whether the design sub-track should arm. Shared by the
// /design-init preflight and the design-subtrack skill's S0 arming step. Headless
// features (empty/non-UI surfaces) return surface:false ⇒ vanilla feature-loop.
//
// Usage: node design-detect-surface.mjs --slug <slug> [--contract <path>]
// Prints {surface, slug, reasons}; exit 0 always.

import fs from 'node:fs';
import path from 'node:path';

const argv = process.argv.slice(2);
let slug = null, contract = null;
for (let i = 0; i < argv.length; i++) {
  const t = argv[i];
  if (t === '--slug') slug = argv[++i];
  else if (t === '--contract') contract = argv[++i];
}
if (!contract && slug) contract = path.resolve('_acceptance', slug, 'contract.md');

const reasons = [];
let surface = false;

if (contract && fs.existsSync(contract)) {
  const txt = fs.readFileSync(contract, 'utf8');
  const fm = txt.split('---')[1] || '';
  const m = fm.match(/surfaces:\s*(.+)/);
  if (m) {
    const val = m[1].trim();
    const empty = val === '[]' || /^\[\s*\]$/.test(val) || val === '';
    const hasUi = !empty && /web|ui|page|view|screen|composer|living|preview|plugin/i.test(val);
    if (hasUi) { surface = true; reasons.push(`contract.surfaces = ${val}`); }
    else reasons.push(`contract.surfaces present but non-UI/empty = ${val}`);
  } else {
    reasons.push('contract has no `surfaces:` key — treat as headless unless the design-doc says otherwise');
  }
} else {
  reasons.push('no contract yet — arm tentatively; confirm at S1 via contract.surfaces');
}

console.log(JSON.stringify({ surface, slug, reasons }, null, 2));

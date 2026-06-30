#!/usr/bin/env node
// score.mjs — regression + calibration for the design gate.
//
//   node score.mjs                 run both arms, write report-data.json, print table
//   node score.mjs --assert static assert B-static meets baseline (exit 0/1)
//   node score.mjs --assert dom    assert B-DOM meets baseline; exit 2 if jsdom absent
//
// Ground truth: 10 fixtures with planted, labelled defects. Recall = fraction of
// planted defects an arm detects. The DOM arm must REJECT the P0 fixture (f03)
// and must PASS the clean fixture (f09) — the two regressions that matter most.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { detectStatic } from '../../lib/design-detect.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const gt = JSON.parse(fs.readFileSync(path.join(DIR, 'ground-truth.json'), 'utf8'));
const baseline = JSON.parse(fs.readFileSync(path.join(DIR, 'baseline.json'), 'utf8'));

// detector rule id -> ground-truth vocab id
const MAP = {
  'gradient-text': 'gradient-text', 'cream-palette': 'cream-palette', 'low-contrast': 'low-contrast',
  'gray-on-color': 'gray-on-color', 'tiny-text': 'tiny-text', 'side-tab': 'side-tab',
  'numbered-section-markers': 'numbered-section-markers', 'repeated-section-kickers': 'hero-eyebrow-chip',
  'hero-eyebrow-chip': 'hero-eyebrow-chip', 'bounce-easing': 'bounce-easing',
  'image-hover-transform': 'image-hover-transform', 'overused-font': 'overused-font',
  'single-font': 'single-font', 'flat-type-hierarchy': 'flat-type-hierarchy',
  'cramped-padding': 'cramped-padding', 'tight-leading': 'tight-leading',
  'line-length': 'long-line-length', 'justified-text': 'justified-text',
  'oversized-h1': 'oversized-h1', 'extreme-negative-tracking': 'extreme-negative-tracking',
  'nested-cards': 'nested-cards', 'icon-tile-stack': 'icon-tile-stack',
  'identical-card-grid': 'identical-card-grid',
};
const toVocab = (hits) => new Set(hits.map((h) => MAP[h]).filter(Boolean));

async function runArm(detect) {
  const rows = {};
  let planted = 0, caught = 0;
  for (const fx of gt.fixtures) {
    const r = await detect(path.join(DIR, fx.file), { failOn: ['P0'] });
    const got = toVocab(r.hits);
    const want = fx.planted.map((p) => p[0]);
    planted += want.length;
    caught += want.filter((w) => got.has(w)).length;
    rows[fx.id] = { verdict: r.verdict, hits: r.hits, p0: r.p0Count };
  }
  return { recall: planted ? caught / planted : 0, caught, planted, rows };
}

async function getDom() {
  const { detectDom } = await import('./lib/dom-detect.mjs');
  return detectDom;
}

const mode = process.argv.includes('--assert')
  ? process.argv[process.argv.indexOf('--assert') + 1]
  : null;

function fail(msg) { console.log('  ' + msg); process.exitCode = 1; }

if (mode === 'static') {
  const a = await runArm(detectStatic);
  const min = baseline.static.min_defect_recall;
  console.log(`B-static recall ${(a.recall * 100).toFixed(0)}% (min ${(min * 100).toFixed(0)}%)`);
  if (a.recall < min) fail(`recall ${a.recall.toFixed(2)} < baseline ${min}`);
} else if (mode === 'dom') {
  let detectDom;
  try { detectDom = await getDom(); }
  catch { console.log('jsdom not installed — DOM assertion skipped'); process.exit(2); }
  const a = await runArm(detectDom);
  const b = baseline.dom;
  console.log(`B-DOM recall ${(a.recall * 100).toFixed(0)}% (min ${(b.min_defect_recall * 100).toFixed(0)}%)`);
  if (a.recall < b.min_defect_recall) fail(`recall ${a.recall.toFixed(2)} < baseline ${b.min_defect_recall}`);
  for (const id of b.must_reject) {
    if (a.rows[id].verdict !== 'REJECT') fail(`${id} must REJECT (P0) but got ${a.rows[id].verdict}`);
  }
  for (const id of b.must_pass_clean) {
    if (a.rows[id].verdict !== 'PASS') fail(`${id} must PASS (clean) but got ${a.rows[id].verdict}`);
  }
} else {
  const s = await runArm(detectStatic);
  let d = null;
  try { d = await runArm(await getDom()); } catch { /* jsdom optional */ }
  const out = {
    run_id: 'score-' + Date.now().toString(36),
    verified_at: new Date().toISOString(),
    static: { recall: s.recall, rows: s.rows },
    dom: d ? { recall: d.recall, rows: d.rows } : null,
  };
  fs.writeFileSync(path.join(DIR, 'report-data.json'), JSON.stringify(out, null, 2));
  console.log(`B-static recall ${(s.recall * 100).toFixed(0)}%` + (d ? ` · B-DOM recall ${(d.recall * 100).toFixed(0)}%` : ' · B-DOM skipped (no jsdom)'));
  for (const fx of gt.fixtures) {
    const ds = s.rows[fx.id].verdict, dd = d ? d.rows[fx.id].verdict : '-';
    console.log(`  ${fx.id} ${fx.expected_verdict.padEnd(7)} static=${ds.padEnd(6)} dom=${dd}`);
  }
}

'use strict';
// analyze() unit tests — pure geometry, no browser needed.
const assert = require('node:assert');
const { analyze } = require('../../../skills/ux-ui-craft/scripts/measure_layout.js');

const declared = { spaces: [8, 24, 56], gutters: [24, 12] };
const R = (selector, left, width, isContainer) =>
  ({ selector, left, width: width == null ? 200 : width, isContainer: !!isContainer });

let failures = 0;
const t = (name, fn) => {
  try { fn(); console.log('  PASS: ' + name); }
  catch (e) { failures++; console.log('  FAIL: ' + name); console.log('    ' + e.message); }
};

t('A01 clean: 8 shared lines, 1 container width, on-scale gaps -> PASS/0', () => {
  const rects = [R('div.shell', 0, 1200, true), R('main', 0, 1200, true)];
  for (let i = 1; i < 8; i++) { rects.push(R('section.s' + i, i * 40)); rects.push(R('div.g' + i, i * 40)); }
  const gaps = [
    { gap: 8, between: ['div.g1', 'div.g2'] },
    { gap: 24, between: ['section.s1', 'section.s2'] },
    { gap: 56, between: ['section.s2', 'section.s3'] },
  ];
  const r = analyze({ rects, gaps, declared });
  assert.strictEqual(r.lineCount, 8);
  assert.deepStrictEqual(r.singletons, []);
  assert.deepStrictEqual(r.containerWidths, [1200]);
  assert.strictEqual(r.verdict, 'PASS');
  assert.strictEqual(r.exit_code, 0);
});

t('A02 chaos: 16 lines with 9 singletons -> REJECT, every singleton named', () => {
  const rects = [];
  for (let i = 0; i < 7; i++) { rects.push(R('div.pair' + i, i * 10)); rects.push(R('p.pair' + i, i * 10)); }
  for (let j = 0; j < 9; j++) rects.push(R('div.one-off-' + j, 200 + j * 10));
  const r = analyze({ rects, gaps: [], declared });
  assert.strictEqual(r.lineCount, 16);
  assert.strictEqual(r.singletons.length, 9);
  assert.ok(r.singletons.includes('div.one-off-3'));
  assert.strictEqual(r.verdict, 'REJECT');
  assert.strictEqual(r.exit_code, 2);
  assert.strictEqual(r.violations.length, 2); // line budget AND singletons
});

t('A03 rhythm: gap 20 off the declared scale -> REJECT names the pair', () => {
  const rects = [R('div.a', 0), R('div.b', 0)];
  const gaps = [
    { gap: 20, between: ['#filters', '#results'] },
    { gap: 24, between: ['#results', '#footer'] },
  ];
  const r = analyze({ rects, gaps, declared });
  assert.strictEqual(r.offScaleGaps.length, 1);
  assert.strictEqual(r.offScaleGaps[0].gap, 20);
  assert.deepStrictEqual(r.offScaleGaps[0].between, ['#filters', '#results']);
  assert.strictEqual(r.verdict, 'REJECT');
});

t('A04 near-equal container widths reported, not blocking on their own', () => {
  const rects = [R('div.a', 0, 640, true), R('div.b', 0, 600, true)];
  const r = analyze({ rects, gaps: [], declared });
  assert.deepStrictEqual(r.nearEqualWidths, [[600, 640]]);
  assert.strictEqual(r.verdict, 'PASS');
});

t('A05 empty declared scale -> rhythm check skipped (BLOCKED is collect-side)', () => {
  const r = analyze({
    rects: [R('div.a', 0), R('div.b', 0)],
    gaps: [{ gap: 17, between: ['x', 'y'] }],
    declared: { spaces: [], gutters: [] },
  });
  assert.deepStrictEqual(r.offScaleGaps, []);
  assert.strictEqual(r.verdict, 'PASS');
});

t('A06 five distinct container widths -> REJECT', () => {
  const rects = [320, 480, 640, 800, 960].map((w, i) => R('div.c' + i, 0, w, true));
  rects.push(R('div.c5', 0, 320, true)); // duplicate width — still 5 distinct
  const r = analyze({ rects, gaps: [], declared });
  assert.strictEqual(r.containerWidths.length, 5);
  assert.strictEqual(r.verdict, 'REJECT');
});

if (failures) { console.log('\n' + failures + ' failing'); process.exit(1); }
console.log('\nall analyze() tests passed');

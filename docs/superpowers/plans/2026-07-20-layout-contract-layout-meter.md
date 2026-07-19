# Layout Contract + Layout Meter Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give ux-ui-craft a written, machine-verifiable layout language: a Layout Contract declared in CSS, a browser meter that counts alignment/spacing against it, and a blocking raw-px rule in design-loop that closes the port-translation enforcement promise.

**Architecture:** "CSS is the blueprint" — `:root` custom properties + named grid lines ARE the declaration (no second source of truth). The meter `measure_layout.js` splits a pure `analyze()` core (node-testable) from a browser-only `collect()`. design-loop's existing `tokenOnly()` scan gains a spacing-property px/rem rule following the exact shape of its hex rule.

**Tech Stack:** Vanilla JS (browser IIFE + CJS export, zero dependencies), bash test runners (repo convention), markdown skill docs.

**Spec:** `docs/superpowers/specs/2026-07-20-layout-contract-design-language-design.md`

## Global Constraints

- **No new runtime dependencies.** No Playwright, no jsdom additions, no npm installs.
- **Versions:** ux-ui-craft `1.3.0 → 1.4.0` (SKILL.md frontmatter) · acceptance-gate `1.16.0 → 1.17.0` (`.claude-plugin/plugin.json`) · design-loop `0.2.0 → 0.3.0` (BOTH `design-loop/.claude-plugin/plugin.json` and `design-loop/.codex-plugin/plugin.json`).
- **Never hand-edit `plugins/`** — `scripts/sync-plugin-packages.sh` owns that tree (runs in Task 6).
- **Never edit `design-loop/skills/design-subtrack/references/port-translation.md`** — its enforcement claim becomes true by code, not by rewording.
- Skill reference docs are **English prose**; GUIDE.md additions are **Vietnamese**. Skill docs currently contain zero code fences — the ONE fence added to `layout-craft.md` is a deliberate exception; add no others.
- Contract values are always on the **4/8 grid**; spacing levels strictly increasing.
- Evidence envelope fields (exact names): `run_id`, `verifier`, `verified_at`, `verdict`, `exit_code` — `0 PASS · 2 REJECT · 3 BLOCKED`.
- Commit prefixes per repo convention: `feat:` / `test:` / `docs:` (no attribution trailer — disabled globally).
- jsdom CANNOT run the meter (no layout engine). Never write a test that expects `getBoundingClientRect` to work under jsdom.

---

### Task 1: `analyze()` pure core + node tests (TDD)

**Files:**
- Create: `skills/ux-ui-craft/scripts/measure_layout.js`
- Create: `tests/skills/ux-ui-craft/analyze-tests.js`
- Create: `tests/skills/ux-ui-craft/run-tests.sh`

**Interfaces:**
- Consumes: nothing (first task).
- Produces: `analyze(input, opts)` — CJS export from `measure_layout.js`.
  - `input = { rects: [{selector, left, width, isContainer}], gaps: [{gap, between: [selA, selB]}], declared: {spaces: [8,24,56], gutters: [24,12]} }`
  - `opts = { maxLines=10, maxWidths=4, clusterTol=3, gapTol=1 }` (all optional)
  - returns `{ lineCount, clusters: [{x, count, members}], singletons: [selector], containerWidths: [px], nearEqualWidths: [[a,b]], offScaleGaps: [{gap, between}], violations: [string], verdict: 'PASS'|'REJECT', exit_code: 0|2 }`
  - Task 2 wraps this with `collect()`; Task 5's SKILL.md gate row cites the script path.

- [ ] **Step 1: Write the failing tests**

Create `tests/skills/ux-ui-craft/analyze-tests.js`:

```js
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
```

Create `tests/skills/ux-ui-craft/run-tests.sh`:

```bash
#!/usr/bin/env bash
# ux-ui-craft layout-meter tests — analyze() pure core under plain node.
#
# The HTML fixtures in fixtures/ are BROWSER-verified (jsdom has no layout
# engine): open each in a real browser, evaluate measure_layout.js, run
# __measureLayout(), and compare against the invariants in
# fixtures/expected-*.json. This runner covers the pure core only and says so.
set -u
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if node "$HERE/analyze-tests.js"; then
  echo "  SKIP: fixture HTML checks need a real browser (see header comment)"
  echo
  echo "Results: all ux-ui-craft tests passed"
  exit 0
else
  echo
  echo "Results: analyze() tests FAILED"
  exit 1
fi
```

- [ ] **Step 2: Make the runner executable and verify the tests fail**

Run: `chmod +x tests/skills/ux-ui-craft/run-tests.sh && bash tests/skills/ux-ui-craft/run-tests.sh`
Expected: FAIL — `Cannot find module '.../skills/ux-ui-craft/scripts/measure_layout.js'`

- [ ] **Step 3: Write the minimal implementation**

Create `skills/ux-ui-craft/scripts/measure_layout.js`:

```js
// measure_layout.js — the layout meter. Counts alignment lines, container
// widths, and spacing-scale membership on a RENDERED page against the Layout
// Contract declared as :root custom properties (--space-*, --gutter*).
// Sibling of check_contrast.py.
//
// Run in a REAL browser page context — jsdom has no layout engine:
//   Playwright:  page.evaluate(src + '; __measureLayout()')
//   Browser MCP: evaluate the file source, then __measureLayout()
//   Console:     paste the file, then copy(JSON.stringify(__measureLayout(), null, 2))
// Node (tests only): const { analyze } = require('./measure_layout.js')
//
// Evidence envelope: { run_id, verifier, verified_at, verdict, exit_code }
// exit_code: 0 PASS · 2 REJECT · 3 BLOCKED (no contract / nothing visible).
// The meter measures ONE state; the caller loops the state × width matrix
// and reports the worst cell (see references/layout-craft.md).
(function (root) {
  'use strict';

  var DEFAULTS = { maxLines: 10, maxWidths: 4, clusterTol: 3, gapTol: 1 };

  function analyze(input, opts) {
    var o = Object.assign({}, DEFAULTS, opts || {});
    var rects = (input && input.rects) || [];
    var gaps = (input && input.gaps) || [];
    var declared = (input && input.declared) || { spaces: [], gutters: [] };

    // 1. Cluster left edges (±clusterTol, anchored on each cluster's first member).
    var sorted = rects.slice().sort(function (a, b) { return a.left - b.left; });
    var clusters = [];
    for (var i = 0; i < sorted.length; i++) {
      var r = sorted[i];
      var last = clusters.length ? clusters[clusters.length - 1] : null;
      if (last && Math.abs(r.left - last.x) <= o.clusterTol) last.members.push(r.selector);
      else clusters.push({ x: Math.round(r.left), members: [r.selector] });
    }
    var out = clusters.map(function (c) {
      return { x: c.x, count: c.members.length, members: c.members };
    });
    var singletons = out.filter(function (c) { return c.count === 1; })
      .map(function (c) { return c.members[0]; });

    // 2. Distinct container widths (+ near-equal pairs <48px apart, informational).
    var widths = [];
    rects.forEach(function (r2) {
      if (!r2.isContainer) return;
      var w = Math.round(r2.width);
      if (widths.indexOf(w) === -1) widths.push(w);
    });
    widths.sort(function (a, b) { return a - b; });
    var nearEqual = [];
    for (var j = 1; j < widths.length; j++) {
      if (widths[j] - widths[j - 1] < 48) nearEqual.push([widths[j - 1], widths[j]]);
    }

    // 3. Vertical sibling gaps must sit on the declared scale (±gapTol).
    //    Empty scale = no contract loaded synthetically: skip (collect() BLOCKs that case).
    var scale = declared.spaces.concat(declared.gutters);
    var offScale = !scale.length ? [] : gaps.filter(function (g) {
      if (g.gap <= 0) return false;
      return !scale.some(function (s) { return Math.abs(g.gap - s) <= o.gapTol; });
    });

    var violations = [];
    if (out.length > o.maxLines) violations.push('alignment: ' + out.length + ' lines > budget ' + o.maxLines);
    if (singletons.length) violations.push('alignment: ' + singletons.length + ' singleton line(s) — fix or name each');
    if (widths.length > o.maxWidths) violations.push('containers: ' + widths.length + ' distinct widths > ' + o.maxWidths);
    if (offScale.length) violations.push('rhythm: ' + offScale.length + ' gap(s) off the declared scale');

    return {
      lineCount: out.length, clusters: out, singletons: singletons,
      containerWidths: widths, nearEqualWidths: nearEqual,
      offScaleGaps: offScale, violations: violations,
      verdict: violations.length ? 'REJECT' : 'PASS',
      exit_code: violations.length ? 2 : 0
    };
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { analyze: analyze };
  } else {
    // Browser entry __measureLayout() ships in the collect() step (Task 2).
    root.__measureLayoutAnalyze = analyze;
  }
})(typeof window !== 'undefined' ? window : globalThis);
```

- [ ] **Step 4: Run the tests and verify they pass**

Run: `bash tests/skills/ux-ui-craft/run-tests.sh`
Expected: `PASS` × 6 (A01–A06), then `Results: all ux-ui-craft tests passed`, exit 0.

- [ ] **Step 5: Verify the other suites are untouched and still green**

Run: `bash tests/design-loop/run-tests.sh && bash tests/scripts/run-tests.sh`
Expected: both end with their existing all-passed lines, exit 0.

- [ ] **Step 6: Commit**

```bash
git add skills/ux-ui-craft/scripts/measure_layout.js tests/skills/ux-ui-craft/
git commit -m "feat: layout meter analyze() core + node suite (ux-ui-craft)"
```

---

### Task 2: `collect()` + evidence envelope + browser fixtures

**Files:**
- Modify: `skills/ux-ui-craft/scripts/measure_layout.js` (replace the `if (typeof module …)` tail; add `collect`/`measureLayout` above it)
- Create: `tests/skills/ux-ui-craft/fixtures/fixture-clean.html`
- Create: `tests/skills/ux-ui-craft/fixtures/fixture-chaos.html`
- Create: `tests/skills/ux-ui-craft/fixtures/fixture-broken-rhythm.html`
- Create: `tests/skills/ux-ui-craft/fixtures/expected-clean.json`, `expected-chaos.json`, `expected-broken-rhythm.json` (captured in Step 4)

**Interfaces:**
- Consumes: `analyze(input, opts)` from Task 1 (exact signature above).
- Produces: browser global `__measureLayout(opts)` returning the evidence envelope `{ run_id, verifier, verified_at, viewport: {w, h}, verdict, exit_code, … }` merged with `analyze()` output. Selector format from `selOf`: `tag#id` when an id exists, else `tag.firstClass.secondClass`.

- [ ] **Step 1: Add `collect()` and `measureLayout()` to the script**

In `skills/ux-ui-craft/scripts/measure_layout.js`, replace this tail:

```js
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { analyze: analyze };
  } else {
    // Browser entry __measureLayout() ships in the collect() step (Task 2).
    root.__measureLayoutAnalyze = analyze;
  }
```

with:

```js
  // A "block" (spec §4.1): structural element, rendered box ≥40px wide, not
  // inline, visible in the CURRENT viewport screenful. Inline flow never counts.
  var BLOCK_SEL = 'section,article,nav,header,footer,aside,form,table,figure,fieldset,ul,ol,div';

  function selOf(el) {
    var id = el.id ? '#' + el.id : '';
    var cls = !id && el.className && typeof el.className === 'string'
      ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : '';
    return el.tagName.toLowerCase() + id + cls;
  }

  function collect(win) {
    var doc = win.document;
    var blocks = [];
    var nodes = doc.querySelectorAll(BLOCK_SEL);
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var cs = win.getComputedStyle(el);
      if (cs.display === 'inline' || cs.display === 'none' || cs.visibility === 'hidden') continue;
      var r = el.getBoundingClientRect();
      if (r.width < 40 || r.height <= 0) continue;
      if (r.top >= win.innerHeight || r.bottom <= 0) continue;
      blocks.push({ el: el, selector: selOf(el), left: r.left, top: r.top, width: r.width, height: r.height });
    }
    blocks.forEach(function (b) {
      var n = 0;
      blocks.forEach(function (c) { if (c.el.parentElement === b.el) n++; });
      b.isContainer = n >= 2;
    });
    var byParent = [];
    blocks.forEach(function (b) {
      var hit = null;
      for (var k = 0; k < byParent.length; k++) if (byParent[k].parent === b.el.parentElement) hit = byParent[k];
      if (!hit) { hit = { parent: b.el.parentElement, sibs: [] }; byParent.push(hit); }
      hit.sibs.push(b);
    });
    var gaps = [];
    byParent.forEach(function (grp) {
      grp.sibs.sort(function (a, b) { return a.top - b.top; });
      for (var k = 1; k < grp.sibs.length; k++) {
        var gap = Math.round(grp.sibs[k].top - (grp.sibs[k - 1].top + grp.sibs[k - 1].height));
        if (gap > 0) gaps.push({ gap: gap, between: [grp.sibs[k - 1].selector, grp.sibs[k].selector] });
      }
    });
    var rootCs = win.getComputedStyle(doc.documentElement);
    function px(name) { var v = parseFloat(rootCs.getPropertyValue(name)); return isFinite(v) ? v : null; }
    var notNull = function (v) { return v !== null; };
    return {
      rects: blocks.map(function (b) {
        return { selector: b.selector, left: b.left, width: b.width, isContainer: b.isContainer };
      }),
      gaps: gaps,
      declared: {
        spaces: ['--space-within', '--space-between', '--space-section'].map(px).filter(notNull),
        gutters: ['--gutter', '--gutter-compact'].map(px).filter(notNull)
      }
    };
  }

  function measureLayout(opts) {
    var base = {
      run_id: 'measure-layout-' + Math.random().toString(16).slice(2, 12),
      verifier: 'skills/ux-ui-craft/scripts/measure_layout.js',
      verified_at: new Date().toISOString(),
      viewport: { w: root.innerWidth, h: root.innerHeight }
    };
    var input = collect(root);
    if (!input.declared.spaces.length) {
      return Object.assign(base, {
        verdict: 'BLOCKED', exit_code: 3,
        reason: 'no Layout Contract: declare --space-within/--space-between/--space-section (and --gutter) on :root before measuring'
      });
    }
    if (!input.rects.length) {
      return Object.assign(base, {
        verdict: 'BLOCKED', exit_code: 3,
        reason: 'nothing to measure: no visible content blocks in the viewport'
      });
    }
    return Object.assign(base, analyze(input, opts));
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { analyze: analyze };
  } else {
    root.__measureLayout = measureLayout;
  }
```

- [ ] **Step 2: Confirm the node suite still passes (analyze untouched)**

Run: `bash tests/skills/ux-ui-craft/run-tests.sh`
Expected: 6 × PASS, exit 0.

- [ ] **Step 3: Write the three fixtures**

Create `tests/skills/ux-ui-craft/fixtures/fixture-clean.html`:

```html
<!doctype html>
<!-- sitemap:
  shell
    header (title, meta)
    main
      filters
      results (2 cards)
    footer (note, legal)
-->
<html><head><meta charset="utf-8"><title>fixture-clean</title><style>
  :root { --container-shell: 960px;
          --gutter: 24px; --gutter-compact: 12px;
          --space-within: 8px; --space-between: 24px; --space-section: 56px; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  .shell  { width: var(--container-shell); }
  .shell > * + * { margin-top: var(--space-section); }
  .stack  > * + * { margin-top: var(--space-between); }
  .tight  > * + * { margin-top: var(--space-within); }
  .card   { padding: var(--gutter); }
  div, section, header, footer { min-height: 24px; }
</style></head><body>
  <div class="shell">
    <header class="tight"><div>Title</div><div>Meta</div></header>
    <section class="stack" id="main">
      <div id="filters">Filters</div>
      <div id="results" class="stack">
        <div class="card tight"><div>Card A</div><div>Body A</div></div>
        <div class="card tight"><div>Card B</div><div>Body B</div></div>
      </div>
    </section>
    <footer class="tight"><div>Note</div><div>Legal</div></footer>
  </div>
</body></html>
```

Create `tests/skills/ux-ui-craft/fixtures/fixture-chaos.html` — same skeleton, then 12 one-off indents (the "trang loạn" reproduction):

```html
<!doctype html>
<!-- sitemap: (deliberately violated by the styles below) -->
<html><head><meta charset="utf-8"><title>fixture-chaos</title><style>
  :root { --container-shell: 960px;
          --gutter: 24px; --gutter-compact: 12px;
          --space-within: 8px; --space-between: 24px; --space-section: 56px; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  .shell { width: var(--container-shell); }
  div, section { min-height: 24px; margin-top: 24px; }
  .o1{margin-left:13px}.o2{margin-left:29px}.o3{margin-left:45px}.o4{margin-left:61px}
  .o5{margin-left:77px}.o6{margin-left:93px}.o7{margin-left:109px}.o8{margin-left:125px}
  .o9{margin-left:141px}.o10{margin-left:157px}.o11{margin-left:173px}.o12{margin-left:189px}
</style></head><body>
  <div class="shell">
    <section><div>Row base A</div><div>Row base B</div></section>
    <div class="o1">off 1</div><div class="o2">off 2</div><div class="o3">off 3</div>
    <div class="o4">off 4</div><div class="o5">off 5</div><div class="o6">off 6</div>
    <div class="o7">off 7</div><div class="o8">off 8</div><div class="o9">off 9</div>
    <div class="o10">off 10</div><div class="o11">off 11</div><div class="o12">off 12</div>
  </div>
</body></html>
```

Create `tests/skills/ux-ui-craft/fixtures/fixture-broken-rhythm.html` — the clean fixture with ONE gap knocked off the scale:

```html
<!doctype html>
<!-- sitemap: same as fixture-clean; #results' gap is broken on purpose -->
<html><head><meta charset="utf-8"><title>fixture-broken-rhythm</title><style>
  :root { --container-shell: 960px;
          --gutter: 24px; --gutter-compact: 12px;
          --space-within: 8px; --space-between: 24px; --space-section: 56px; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  .shell  { width: var(--container-shell); }
  .shell > * + * { margin-top: var(--space-section); }
  .stack  > * + * { margin-top: var(--space-between); }
  .tight  > * + * { margin-top: var(--space-within); }
  .card   { padding: var(--gutter); }
  div, section, header, footer { min-height: 24px; }
  #results { margin-top: 20px; } /* the defect: 20 ∉ {8,24,56,24,12} */
</style></head><body>
  <div class="shell">
    <header class="tight"><div>Title</div><div>Meta</div></header>
    <section class="stack" id="main">
      <div id="filters">Filters</div>
      <div id="results" class="stack">
        <div class="card tight"><div>Card A</div><div>Body A</div></div>
        <div class="card tight"><div>Card B</div><div>Body B</div></div>
      </div>
    </section>
    <footer class="tight"><div>Note</div><div>Legal</div></footer>
  </div>
</body></html>
```

- [ ] **Step 4: Verify all three fixtures in a real browser and capture expected JSON**

For each fixture, in a real browser (browser MCP `preview_start` with `url: "file:///…/tests/skills/ux-ui-craft/fixtures/fixture-clean.html"` then `javascript_tool`, OR any Chrome console):
1. Evaluate the full source of `skills/ux-ui-craft/scripts/measure_layout.js`.
2. Run `JSON.stringify(__measureLayout(), null, 2)`.
3. Check the invariants:
   - `fixture-clean`: `verdict "PASS"`, `exit_code 0`, `singletons []`, `offScaleGaps []`, `lineCount 2` (the x=0 line + the card-inset line at x=24), `containerWidths [960]`.
   - `fixture-chaos`: `verdict "REJECT"`, `exit_code 2`, `singletons.length 12` (`div.o1`…`div.o12`), `lineCount 13` (the x=0 cluster + 12 singletons).
   - `fixture-broken-rhythm`: `verdict "REJECT"`, `offScaleGaps` exactly `[{ "gap": 20, "between": ["div#filters", "div#results"] }]`, `singletons []`.
4. Save each captured JSON (minus the volatile `run_id`/`verified_at`) as `tests/skills/ux-ui-craft/fixtures/expected-<name>.json` — these are the pinned snapshots future browser re-verification compares against.

If an invariant does not hold, the bug is in `collect()` (filtering, `isContainer`, or gap math) — fix and re-run; do NOT loosen an invariant to pass.

- [ ] **Step 5: Commit**

```bash
git add skills/ux-ui-craft/scripts/measure_layout.js tests/skills/ux-ui-craft/fixtures/
git commit -m "feat: layout meter collect() + evidence envelope + browser fixtures"
```

---

### Task 3: design-loop `layout-token-only` blocking rule (TDD)

**Files:**
- Create: `tests/design-loop/fixtures/src-raw-px/button.css`
- Create: `tests/design-loop/fixtures/src-px-clean/button.css`
- Create: `tests/design-loop/fixtures/src-raw-px-tsx/card.tsx`
- Modify: `tests/design-loop/run-tests.sh` (append D07–D09 after D02)
- Modify: `design-loop/scripts/design-static-check.mjs` (extend `tokenOnly()`, report + block)

**Interfaces:**
- Consumes: existing `tokenOnly(target)` in `design-static-check.mjs` (returns `{files, violations}`) and the `expect_exit` helper in `run-tests.sh`.
- Produces: `tokenOnly()` now returns `{files, violations, layoutViolations}`; result JSON gains `rules['layout-token-only'] = {violations, sample}`; blocking reason string `layout-token-only: N raw px/rem in spacing properties outside the token layer`.

- [ ] **Step 1: Write the failing fixtures + tests**

Create `tests/design-loop/fixtures/src-raw-px/button.css`:

```css
.btn {
  margin-top: 13px;
  padding: 6px 18px;
}
```

Create `tests/design-loop/fixtures/src-px-clean/button.css`:

```css
:root {
  --space-2: 8px; /* token definitions legally carry px */
  --border: #d0d0d0;
}
.btn {
  margin-top: var(--space-2);
  padding: var(--space-2, 8px) 0; /* var() fallback literal is token-first */
  gap: 0;
  top: auto;
  border-top: 1px solid var(--border); /* border-* is not a spacing property */
}
.card {
  margin-left: 1px; /* hairline allow-list — multi-line so LAYOUT_PROP actually matches */
}
```

Create `tests/design-loop/fixtures/src-raw-px-tsx/card.tsx`:

```tsx
export function Card() {
  return <div className="mt-[13px] gap-[10px]">x</div>;
}
```

In `tests/design-loop/run-tests.sh`, insert after the D02 line:

```bash
expect_exit "D07 raw px in spacing property REJECTs (layout-token-only)" 2 node "$SC" "$FIX/src-raw-px"
expect_exit "D08 token-def px + var() fallback + allow-list PASSes" 0 node "$SC" "$FIX/src-px-clean"
expect_exit "D09 Tailwind arbitrary spacing value REJECTs" 2 node "$SC" "$FIX/src-raw-px-tsx"
```

- [ ] **Step 2: Run and verify the new cases fail**

Run: `bash tests/design-loop/run-tests.sh`
Expected: D01–D02 PASS; **D07 FAIL (exit 0, want 2)**, D08 PASS (trivially — nothing scans px yet), **D09 FAIL (exit 0, want 2)**. (D08 passing before the change is expected; it pins the allow-list once the rule lands.)

- [ ] **Step 3: Implement the rule**

In `design-loop/scripts/design-static-check.mjs`:

3a. Header comment: change `(v0.2)` to `(v0.3)` and append one line to the header block:

```
// v0.3 adds layout-token-only (SOURCE): raw px/rem in spacing/position
// properties outside the token layer BLOCK — closing port-translation's
// "raw px forbidden (enforced here)" promise. width/height deliberately v2.
```

3b. Replace the whole `tokenOnly` function with:

```js
// ── SOURCE: token-only (raw hex) + layout-token-only (raw px/rem in spacing) ──
const LAYOUT_PROP = /^\s*(?:margin|padding|gap|row-gap|column-gap|inset|top|right|bottom|left)(?:-[a-z]+)?\s*:/;
const RAW_LEN = /\b\d+(?:\.\d+)?(?:px|rem)\b/;
const TW_ARBITRARY = /\b(?:-?(?:m|p)(?:t|r|b|l|x|y|s|e)?|gap(?:-x|-y)?|top|right|bottom|left|inset(?:-x|-y)?)-\[\d+(?:\.\d+)?(?:px|rem)\]/;
function tokenOnly(target) {
  const exts = new Set(['.tsx', '.ts', '.jsx', '.js', '.css']);
  const files = [];
  (function walk(p) {
    const st = fs.statSync(p);
    if (st.isDirectory()) { for (const f of fs.readdirSync(p)) { if (f === 'node_modules' || f.startsWith('.')) continue; walk(path.join(p, f)); } }
    else if (exts.has(path.extname(p))) files.push(p);
  })(target);
  const HEX = /#[0-9a-fA-F]{3,8}\b/g;
  const viol = [];
  const layoutViol = [];
  for (const f of files) {
    const isCss = path.extname(f) === '.css';
    fs.readFileSync(f, 'utf8').split('\n').forEach((ln, i) => {
      const t = ln.trim();
      if (t.startsWith('//') || t.startsWith('*') || t.startsWith('/*')) return;
      if (/--[\w-]+\s*:/.test(ln)) return; // token definitions: hex AND px are legal here
      const m = ln.match(HEX);
      if (m) viol.push({ file: path.relative(process.cwd(), f), line: i + 1, snippet: t.slice(0, 120), matched: m });
      if (isCss && LAYOUT_PROP.test(ln)) {
        const value = ln.slice(ln.indexOf(':') + 1)
          .replace(/var\([^)]*\)/g, '')                  // var() fallbacks are token-first
          .replace(/\b(?:0px|1px|100%|auto|0)\b/g, '');  // allow-list: 0 / hairline / 100% / auto
        if (RAW_LEN.test(value)) layoutViol.push({ file: path.relative(process.cwd(), f), line: i + 1, snippet: t.slice(0, 120), rule: 'css-raw-length' });
      }
      if (!isCss && TW_ARBITRARY.test(ln)) layoutViol.push({ file: path.relative(process.cwd(), f), line: i + 1, snippet: t.slice(0, 120), rule: 'tailwind-arbitrary' });
    });
  }
  return { files: files.length, violations: viol, layoutViolations: layoutViol };
}
```

3c. In `main`, right after the existing `rules['token-only']` block inside `if (args.target) { … }`, add:

```js
  result.rules['layout-token-only'] = { files_scanned: t.files, violations: t.layoutViolations.length, sample: t.layoutViolations.slice(0, 15) };
  if (t.layoutViolations.length) blocking.push(`layout-token-only: ${t.layoutViolations.length} raw px/rem in spacing properties outside the token layer`);
```

- [ ] **Step 4: Run the full design-loop suite and verify green**

Run: `bash tests/design-loop/run-tests.sh`
Expected: D01–D09 all PASS (D03–D06 may SKIP without jsdom — that's the suite's documented behavior), `Results: all design-loop tests passed`, exit 0.

- [ ] **Step 5: Commit**

```bash
git add design-loop/scripts/design-static-check.mjs tests/design-loop/
git commit -m "feat: layout-token-only blocking rule in design-static-check (v0.3) — closes port-translation raw-px promise"
```

---

### Task 4: layout-craft.md + ia-craft.md + css-technique.md

**Files:**
- Modify: `skills/ux-ui-craft/references/layout-craft.md` (append two sections at end)
- Modify: `skills/ux-ui-craft/references/ia-craft.md:98-100` (exit test paragraph)
- Modify: `skills/ux-ui-craft/references/css-technique.md:15-16` (one bullet after subgrid)

**Interfaces:**
- Consumes: script path `scripts/measure_layout.js`, browser global `__measureLayout(opts)`, envelope fields, contract token names (Tasks 1–2).
- Produces: the section title "The contract is written in CSS" — cited by Task 5's SKILL.md edits and by ia-craft's new sentence. Keep the title EXACT.

- [ ] **Step 1: Append the two new sections to layout-craft.md**

Add at the end of `skills/ux-ui-craft/references/layout-craft.md`:

```markdown
## The contract is written in CSS (Step 3 — before any screen)

Declaring the grid in prose is speaking; a contract is written. Before the
first screen of any new surface (more than one content area), write the
Layout Contract — the one place every later screen spends from. This is
the skill's single deliberate code block, because the format IS the rule:

    :root {
      /* Layout Contract v1 — all values on the 4/8 grid */
      --container-shell: 1200px;   /* page frame        */
      --container-form:  640px;    /* forms             */
      --container-prose: 68ch;     /* reading           */
      --gutter: 24px;              /* ONE gutter system */
      --gutter-compact: 12px;      /* the only allowed variant */
      --space-within:  8px;        /* level 1: inside a group  */
      --space-between: 24px;       /* level 2: between groups  */
      --space-section: 56px;       /* level 3: between sections — strictly increasing */
    }
    .shell { display: grid;
      grid-template-columns: [shell-start] 280px [sidebar-end main-start]
                             minmax(0,1fr) [main-end rail-start] 320px [shell-end]; }

The functional half is the sitemap (≤10 indented lines, ia-craft's exit
test made a deliverable): an HTML comment atop a single-file artifact, or a
block in the design doc for multi-file apps. It exists BEFORE screens, and
every major visible block maps to exactly one of its lines.

Spending rules: margins, paddings, gaps, and positional offsets spend only
`var(--space-*)` / `var(--gutter*)`; container widths spend only
`var(--container-*)`. A raw number in a layout property is the same defect
as a raw hex — with one exception, the optical adjustment that carries a
comment naming its reason. A lone component inherits the contract of the
page that hosts it; only new surfaces write contracts. Where design-loop is
wired, the spending rule is machine-enforced (`design-static-check`'s
layout-token-only BLOCK); on a bare repo it is discipline plus the meter.

## Running the meter (Steps 6–7)

`scripts/measure_layout.js` measures the rendered page against the
contract — alignment-line count, singletons, container widths, and
spacing-scale membership. Browser context only (Playwright `evaluate`,
browser-MCP JS, or console paste; jsdom has no layout engine). It returns
an evidence JSON (`run_id`, `verifier`, `verified_at`, `verdict`,
`exit_code`: 0 PASS · 2 REJECT · 3 BLOCKED) and BLOCKS when no
`--space-*` contract exists on `:root` — an unmeasurable page is an
undeclared page. One run measures one cell; loop the declared matrix
(state × 375/768/1440) and report the WORST cell, the same anti-flattery
rule as the type budget.

The machine supplies counts; you supply role judgment: every cluster in
the output answers to a declared role (container edge, named column, card
inset, the one indent step) or gets fixed — or named, in writing, as an
optical adjustment.

**Structure–space coherence (counted, budget 0).** For each visible
sibling-block pair, read their distance in the sitemap: same group →
`--space-within`; same section → `--space-between`; different sections →
`--space-section`. Compare with the measured gap from the meter JSON. The
mismatch budget is zero; every mismatch is resolved by fixing the space
*or fixing the sitemap* — the second arm is the point: it forces the
architecture question instead of another padding nudge.
```

- [ ] **Step 2: Update ia-craft's exit test**

In `skills/ux-ui-craft/references/ia-craft.md`, replace:

```markdown
*Exit test for the whole file: sketch the sitemap in ≤10 lines of
indented text before drawing any screen. If the sketch embarrasses you,
the screens would have hidden it — that's the point of doing it first.*
```

with:

```markdown
*Exit test for the whole file: sketch the sitemap in ≤10 lines of
indented text before drawing any screen. If the sketch embarrasses you,
the screens would have hidden it — that's the point of doing it first.
The sketch is not advice but a deliverable: it is the functional half of
the Layout Contract (layout-craft § "The contract is written in CSS"),
and the structure–space coherence gate reads it.*
```

- [ ] **Step 3: Add the named-grid-lines bullet to css-technique.md**

In `skills/ux-ui-craft/references/css-technique.md`, after the `subgrid` bullet (lines 15–16), add:

```markdown
- Name grid lines (`[main-start] minmax(0,1fr) [main-end]`) — every
  alignment line the Layout Contract declares gets a real identifier in
  code, and the layout meter can answer clusters to it.
```

- [ ] **Step 4: Verify the fence budget**

Run: `for f in skills/ux-ui-craft/SKILL.md skills/ux-ui-craft/references/*.md; do n=$(grep -c '^```' "$f"); echo "$n  $f"; done`
Expected: `0` for every file — the contract block above uses 4-space indentation, NOT a fenced block, so the zero-fence style holds. (If any count is non-zero, convert that block to indented style.)

- [ ] **Step 5: Commit**

```bash
git add skills/ux-ui-craft/references/
git commit -m "docs: layout contract + meter + coherence procedure in layout-craft; sitemap deliverable; named grid lines"
```

---

### Task 5: SKILL.md — contract obligation, gate rows, version 1.4.0

**Files:**
- Modify: `skills/ux-ui-craft/SKILL.md` (4 edits)

**Interfaces:**
- Consumes: section title "The contract is written in CSS" (Task 4), script `scripts/measure_layout.js` (Tasks 1–2).
- Produces: gate table rows cited by GUIDE.md in Task 6.

- [ ] **Step 1: Extend the Step 3 Layout bullet**

Replace:

```markdown
- **Layout**: declare the grid with the tokens — ≤3-4 named container
  widths, ONE gutter system, explicit columns, one indent step (see
  `references/layout-craft.md`). Screens spend these lines; a mid-screen
  one-off wrapper is the same drift as a mid-screen hex.
```

with:

```markdown
- **Layout**: declare the grid with the tokens — ≤3-4 named container
  widths, ONE gutter system, explicit columns, one indent step — written
  down as the **Layout Contract**: a `:root` custom-property block plus
  named grid lines plus a ≤10-line sitemap (see
  `references/layout-craft.md` § "The contract is written in CSS").
  Screens spend these lines; a mid-screen one-off wrapper is the same
  drift as a mid-screen hex.
```

- [ ] **Step 2: Point the Alignment budget gate at the meter and add the coherence row**

In the Step 6 table, replace:

```markdown
| Alignment budget | left edges of visible blocks reuse ≈≤8-10 declared alignment lines per desktop screenful; container widths ≤3-4; a singleton edge matching no declared role is a misalignment — COUNT on the rendered artifact (getBoundingClientRect, cluster ±3px), worst cell (method: `references/layout-craft.md`) |
```

with:

```markdown
| Alignment budget | left edges of visible blocks reuse ≈≤8-10 declared alignment lines per desktop screenful; container widths ≤3-4; a singleton edge matching no declared role is a misalignment — measure with `scripts/measure_layout.js` in a real browser, worst cell (method: `references/layout-craft.md`) |
| Structure–space coherence | every visible sibling-block pair's gap sits at the level its sitemap distance implies (same group → within, same section → between, else section); mismatch budget = 0 — gaps from `measure_layout.js`, sitemap from the Layout Contract (method: `references/layout-craft.md`) |
```

- [ ] **Step 3: Register the meter in the Scripts section**

After the `check_contrast.py` bullet, add:

```markdown
- `scripts/measure_layout.js` — the layout meter: alignment-line count,
  singletons, container widths, and spacing-scale membership, measured on
  the rendered page against the Layout Contract. Browser context only
  (Playwright `evaluate`, browser-MCP JS, or console paste — jsdom has no
  layout engine); returns evidence JSON (`run_id`/`verdict`/`exit_code`).
```

- [ ] **Step 4: Bump the version**

In the frontmatter, change `version: '1.3.0'` to `version: '1.4.0'`.

- [ ] **Step 5: Verify and commit**

Run: `grep -n "version:" skills/ux-ui-craft/SKILL.md && grep -c "measure_layout" skills/ux-ui-craft/SKILL.md`
Expected: `version: '1.4.0'` and count `3` (gate row ×2, scripts section ×1).

```bash
git add skills/ux-ui-craft/SKILL.md
git commit -m "feat: ux-ui-craft 1.4.0 — Layout Contract obligation, meter-backed alignment gate, structure-space coherence gate"
```

---

### Task 6: Rollout — versions, README, GUIDE, sync, full sweep

**Files:**
- Modify: `.claude-plugin/plugin.json` (acceptance-gate 1.17.0 + description)
- Modify: `design-loop/.claude-plugin/plugin.json`, `design-loop/.codex-plugin/plugin.json` (0.3.0)
- Modify: `design-loop/README.md` (fidelity list + status)
- Modify: `scripts/sync-plugin-packages.sh` (stale echo line)
- Modify: `GUIDE.md` (short 1.17 block in the ux-ui-craft section)

**Interfaces:**
- Consumes: everything above, complete and committed.
- Produces: the shipped release state; `plugins/` regenerated by the sync script.

- [ ] **Step 1: Bump acceptance-gate to 1.17.0**

In `.claude-plugin/plugin.json`: `"version": "1.16.0"` → `"1.17.0"`, and in `description`, after the v1.16 sentence, insert: `v1.17 adds the Layout Contract discipline + layout meter (measure_layout.js) to ux-ui-craft, pairing with design-loop's layout-token-only blocking rule.`

- [ ] **Step 2: Bump both design-loop manifests to 0.3.0**

`design-loop/.claude-plugin/plugin.json` and `design-loop/.codex-plugin/plugin.json`: `"version": "0.2.0"` → `"0.3.0"`.

- [ ] **Step 3: Update design-loop README**

In `design-loop/README.md` "Fidelity = 3 layers": change `🔴 static-checks BLOCK: token-only (source) + WCAG **contrast-AA**` to `🔴 static-checks BLOCK: token-only + **layout-token-only** (source: raw hex / raw px-rem in spacing properties) + WCAG **contrast-AA**`. In "Status": replace `v0.1.1 scaffold. Runnable now: …` with `v0.3.0. Runnable now: /design-init (config wiring), provenance guard, design-static-check (token-only + layout-token-only + WCAG contrast-AA + tap-target heuristic).` (keep the rest of the paragraph).

- [ ] **Step 4: Fix the sync echo and run the sync**

In `scripts/sync-plugin-packages.sh`, replace the final echo line with:

```bash
echo "Synced Codex packages: acceptance-gate@1.17.0 feature-loop-codex@1.13.0 design-loop@0.3.0"
```

Run: `bash scripts/sync-plugin-packages.sh`
Expected: the echo above; `git status` shows regenerated `plugins/` including `plugins/acceptance-gate/skills/ux-ui-craft/scripts/measure_layout.js` and `plugins/design-loop-codex/scripts/design-static-check.mjs`.

- [ ] **Step 5: Add the GUIDE.md block**

In `GUIDE.md`, at the end of the section "Skill ux-ui-craft — design engineer trong kit (1.12.0+)" (after the cost paragraph ending "…đổ về qua release có test đầy đủ."), append:

```markdown
**1.17 — Layout Contract + máy đo layout (skill 1.4.0 · design-loop 0.3.0).** Skill buộc
viết "bản vẽ" trước màn hình đầu tiên: khối `:root` (`--container-*` / `--gutter` /
`--space-*` 3 cấp tăng dần) + named grid lines + sitemap ≤10 dòng; code chỉ được tiêu
`var()`. Máy đo `skills/ux-ui-craft/scripts/measure_layout.js` chạy trong browser thật
(Playwright / console — jsdom không có layout) đếm đường canh lề, singleton, container
widths, gap lệch scale — trả evidence JSON (`run_id`/`verdict`/`exit_code`, chuẩn
design-loop). Gate mới **Structure–space coherence**: khoảng cách giữa 2 block phải đúng
cấp với khoảng cách trong sitemap, ngân sách lệch = 0. design-loop 0.3.0 thêm rule
**layout-token-only** (BLOCK raw px/rem trong margin/padding/gap/inset/top/right/bottom/
left + Tailwind `mt-[13px]` ngoài tầng token) — trả đúng lời hứa "(enforced by
design-static-check)" trong port-translation.md.
```

- [ ] **Step 6: Full test sweep**

Run:

```bash
bash tests/skills/ux-ui-craft/run-tests.sh && \
bash tests/design-loop/run-tests.sh && \
bash tests/scripts/run-tests.sh && \
bash tests/plugins/run-tests.sh
```

Expected: every suite ends with its all-passed line, combined exit 0.

- [ ] **Step 7: Commit the release**

```bash
git add -A
git commit -m "feat: Layout Contract + layout meter wave — acceptance-gate 1.17.0, ux-ui-craft 1.4.0, design-loop 0.3.0"
```

---

## Post-plan notes

- **Push** only when the user says push (repo convention).
- **Consuming repos** (memory): pull acceptance-gate 1.17.0 + design-loop 0.3.0; Codex local-marketplace needs `plugin add` again (upgrade is Git-only).
- **Out of scope** (spec §9): wiring the meter as a per-surface eval, scripting the coherence check, `--size-*` width/height discipline, exemplar corpus.

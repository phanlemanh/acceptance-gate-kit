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

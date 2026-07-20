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
    // Embedded panes can report innerHeight 0 while layout is real — fall back
    // to measuring the whole page rather than silently filtering everything.
    var vh = win.innerHeight || doc.documentElement.clientHeight || Infinity;
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var cs = win.getComputedStyle(el);
      if (cs.display === 'inline' || cs.display === 'none' || cs.visibility === 'hidden') continue;
      var r = el.getBoundingClientRect();
      if (r.width < 40 || r.height <= 0) continue;
      if (r.top >= vh || r.bottom <= 0) continue;
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
})(typeof window !== 'undefined' ? window : globalThis);

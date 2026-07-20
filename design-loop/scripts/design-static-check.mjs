#!/usr/bin/env node
// design-static-check.mjs (v0.3) — BLOCKING design fidelity layer (config:executors.design.static).
//
// v0.3 adds layout-token-only (SOURCE): raw px/rem in spacing/position
// properties outside the token layer BLOCK — closing port-translation's
// "raw px forbidden (enforced here)" promise. width/height deliberately v2.
//
// Enforces the hard design rules the acceptance-gate P0 legibility floor does NOT
// cover (p-tiers.json drops design-system color/font/radius). Two targets:
//
//   SOURCE mode  — <dir|file>: token-only (no raw hex colour outside the token
//                  layer). Zero-dep grep over ported plugin-view sources. BLOCK.
//   RENDERED mode — --html <capture>: WCAG contrast-AA (BLOCK) + tap-target >=44px
//                  (heuristic; advisory by default per DESIGN-LOOP-RECOMMENDATION §2,
//                  --strict-hit to BLOCK). Uses jsdom to read computed styles.
//                  The capture must be a rendered HTML with styles INLINED (or a
//                  <style> block jsdom can apply) — e.g. a ui-capture serialization
//                  of the running view. jsdom has NO layout, so tap-target checks
//                  DECLARED box size only; elements whose size needs layout are
//                  reported as undetermined (delegated to the browser P0 tier), not
//                  passed as green.
//
// contrast-AA + tap-target are NO LONGER in pending_checks: they RUN when --html is
// given, and are listed as "needs --html" (not "unimplemented") when it is not.
//
// Hook-legal evidence: run_id, verifier, verified_at, verdict, exit_code.
// Exit: 0 PASS · 2 REJECT · 3 BLOCKED · 4 bad usage.
//
// Usage: node design-static-check.mjs [<dir|file>] [--html <capture>] [--require-html] [--strict-hit] [--jsdom <dir>] [--slug <slug>]

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

// ── WCAG helpers (parity with vendor/impeccable color.mjs; inlined so the plugin is self-contained) ──
function parseColor(c) {
  if (!c) return null;
  c = String(c).trim();
  // Transparent = the keyword, or a 4-channel rgb[a]() whose ALPHA is 0 — the
  // alpha must be the 4th value (3 commas before it), otherwise rgb(r, g, 0)
  // (black, pure red/orange/yellow…) would be skipped from contrast checks.
  if (c === 'transparent' || /^rgba?\((?:[^,)]+,){3}\s*0(?:\.0+)?\s*\)$/.test(c)) return null;
  let m = c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (m) return { r: +m[1], g: +m[2], b: +m[3], a: m[4] !== undefined ? +m[4] : 1 };
  m = c.match(/^#([0-9a-fA-F]{3,8})$/);
  if (m) {
    let h = m[1];
    if (h.length === 3 || h.length === 4) h = h.split('').map((x) => x + x).join('');
    return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16), a: h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1 };
  }
  const named = { white: [255, 255, 255], black: [0, 0, 0] };
  if (named[c.toLowerCase()]) { const [r, g, b] = named[c.toLowerCase()]; return { r, g, b, a: 1 }; }
  return null;
}
function relLum({ r, g, b }) {
  const [rs, gs, bs] = [r / 255, g / 255, b / 255].map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}
function contrastRatio(c1, c2) { const l1 = relLum(c1), l2 = relLum(c2); return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05); }
function over(src, dst) { if (!src) return dst; const a = src.a == null ? 1 : src.a; if (a >= 1) return { r: src.r, g: src.g, b: src.b, a: 1 }; return { r: src.r * a + dst.r * (1 - a), g: src.g * a + dst.g * (1 - a), b: src.b * a + dst.b * (1 - a), a: 1 }; }
function hex(c) { return c ? '#' + [c.r, c.g, c.b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('') : '?'; }

function parseArgs(argv) {
  const a = { target: null, html: null, jsdom: null, strictHit: false, slug: null, requireHtml: false };
  for (let i = 0; i < argv.length; i++) {
    const t = argv[i];
    if (t === '--html') a.html = argv[++i];
    else if (t === '--jsdom') a.jsdom = argv[++i];
    else if (t === '--strict-hit') a.strictHit = true;
    else if (t === '--require-html') a.requireHtml = true;
    else if (t === '--slug') a.slug = argv[++i];
    else if (!t.startsWith('--')) a.target = t;
  }
  return a;
}
function emit(o, code) { process.stdout.write(JSON.stringify(o, null, 2) + '\n'); process.exit(code); }

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

// ── jsdom loader (like design-gate.mjs: try import, then createRequire from candidate dirs) ──
async function loadJSDOM(dir) {
  try { return (await import('jsdom')).JSDOM; } catch { /* not hoisted */ }
  for (const d of [dir, process.cwd(), path.join(process.cwd(), 'tests/design-eval')].filter(Boolean)) {
    try { return createRequire(path.join(path.resolve(d), 'noop.js'))('jsdom').JSDOM; } catch { /* next */ }
  }
  return null;
}

function selOf(el) {
  const id = el.id ? '#' + el.id : '';
  const cls = el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : '';
  return el.tagName.toLowerCase() + id + cls;
}

// ── RENDERED: contrast-AA + tap-target ──
function analyzeRendered(dom, strictHit) {
  const win = dom.window, doc = win.document;
  const val = (el, prop) => { const v = win.getComputedStyle(el)[prop]; if (v && v !== '') return v; return el.style && el.style[prop] ? el.style[prop] : ''; };
  const num = (v) => { const n = parseFloat(v); return Number.isFinite(n) ? n : null; };

  function effectiveBg(el) {
    const stack = [];
    for (let cur = el; cur && cur.nodeType === 1; cur = cur.parentElement) {
      const bg = parseColor(val(cur, 'backgroundColor')) || parseColor(val(cur, 'background'));
      if (bg && bg.a > 0) stack.push(bg);
    }
    let base = { r: 255, g: 255, b: 255, a: 1 };
    for (let i = stack.length - 1; i >= 0; i--) base = over(stack[i], base);
    return base;
  }

  const contrast = [];
  const nodes = doc.body ? doc.body.querySelectorAll('*') : [];
  for (const el of nodes) {
    const tag = el.tagName.toLowerCase();
    if (tag === 'script' || tag === 'style' || tag === 'svg') continue;
    const hasText = Array.from(el.childNodes).some((n) => n.nodeType === 3 && n.textContent.trim());
    if (!hasText) continue;
    const fg = parseColor(val(el, 'color'));
    if (!fg) continue;
    const bg = effectiveBg(el);
    const fgc = over(fg, bg);
    const ratio = contrastRatio(fgc, bg);
    const size = num(val(el, 'fontSize')) || 16;
    const weight = parseInt(val(el, 'fontWeight'), 10) || 400;
    const large = size >= 24 || (size >= 18.66 && weight >= 700);
    const need = large ? 3 : 4.5;
    if (ratio + 1e-9 < need) contrast.push({ selector: selOf(el), text: (el.textContent || '').trim().slice(0, 40), fg: hex(fgc), bg: hex(bg), ratio: Math.round(ratio * 100) / 100, need, size: Math.round(size) });
  }

  const tapBad = [], tapUnknown = [];
  for (const el of doc.querySelectorAll('button, a[href], input:not([type=hidden]), select, textarea, [role="button"], [onclick]')) {
    const h = num(val(el, 'minHeight')) ?? num(val(el, 'height'));
    const w = num(val(el, 'minWidth')) ?? num(val(el, 'width'));
    if ((h != null && h < 44) || (w != null && w < 44)) tapBad.push({ selector: selOf(el), h: h != null ? Math.round(h) : null, w: w != null ? Math.round(w) : null });
    else if (h == null && w == null) tapUnknown.push(selOf(el));
  }
  return { contrast, tapBad, tapUnknown };
}

// ── main ──
const args = parseArgs(process.argv.slice(2));
const base = { run_id: 'design-static-' + crypto.randomBytes(5).toString('hex'), verifier: 'design-loop/scripts/design-static-check.mjs', verified_at: new Date().toISOString(), target: args.target, html: args.html, slug: args.slug };

if (!args.target && !args.html) emit({ ...base, verdict: 'BLOCKED', reason: 'nothing to check — give a source <dir|file> (token-only) and/or --html <rendered capture> (contrast/tap)', exit_code: 4 }, 4);

const result = { ...base, rules: {}, pending_checks: [] };
const blocking = [];

// Lane nhẹ (static-only) HỨA contrast/tap-target once --html is supplied; if the
// eval forgot to pass the rendered capture, that promise is unmet — BLOCK, don't
// PASS-token-only-with-a-note (lane-spec FM-c: "hứa 3 chạy 1"). Mirrors the shape
// of the other exit(3) BLOCKED branches below (run_id, verifier, verified_at,
// verdict, exit_code via the same `emit` helper).
if (args.requireHtml && !args.html) emit({ ...base, verdict: 'BLOCKED', reason: 'rendered capture required (--require-html) but --html missing — pass the ui-capture file', exit_code: 3 }, 3);

if (args.target) {
  if (!fs.existsSync(args.target)) emit({ ...base, verdict: 'BLOCKED', reason: `target not found: ${args.target}`, exit_code: 3 }, 3);
  const t = tokenOnly(args.target);
  result.rules['token-only'] = { files_scanned: t.files, violations: t.violations.length, sample: t.violations.slice(0, 15) };
  if (t.violations.length) blocking.push(`token-only: ${t.violations.length} raw hex outside the token layer`);
  result.rules['layout-token-only'] = { files_scanned: t.files, violations: t.layoutViolations.length, sample: t.layoutViolations.slice(0, 15) };
  if (t.layoutViolations.length) blocking.push(`layout-token-only: ${t.layoutViolations.length} raw px/rem in spacing properties outside the token layer`);
} else {
  result.pending_checks.push('token-only (pass a source <dir|file>)');
}

if (args.html) {
  if (!fs.existsSync(args.html)) emit({ ...base, verdict: 'BLOCKED', reason: `--html not found: ${args.html}`, exit_code: 3 }, 3);
  const JSDOM = await loadJSDOM(args.jsdom);
  if (!JSDOM) emit({ ...base, verdict: 'BLOCKED', reason: 'jsdom not resolvable — run `npm i jsdom` in the repo or pass --jsdom <dir-with-node_modules>. contrast/tap need a DOM.', exit_code: 3 }, 3);
  const dom = new JSDOM(fs.readFileSync(args.html, 'utf8'), { pretendToBeVisual: true });
  const { contrast, tapBad, tapUnknown } = analyzeRendered(dom, args.strictHit);
  result.rules['contrast-AA'] = { violations: contrast.length, sample: contrast.slice(0, 15) };
  result.rules['tap-target'] = { severity: args.strictHit ? 'block' : 'advisory', below_44_declared: tapBad.length, undetermined_needs_browser: tapUnknown.length, sample: tapBad.slice(0, 15) };
  if (contrast.length) blocking.push(`contrast-AA: ${contrast.length} text element(s) below WCAG AA`);
  if (args.strictHit && tapBad.length) blocking.push(`tap-target: ${tapBad.length} interactive element(s) with declared box <44px`);
  if (tapUnknown.length) result.note_tap = `tap-target undetermined for ${tapUnknown.length} element(s): jsdom has no layout — the browser P0 tier / ui-check measures those`;
} else {
  result.pending_checks.push('contrast-AA (pass --html <rendered capture>)', 'tap-target (pass --html <rendered capture>)');
}

if (blocking.length) { result.verdict = 'REJECT'; result.reason = blocking.join(' · '); result.exit_code = 2; emit(result, 2); }
result.verdict = 'PASS'; result.exit_code = 0; emit(result, 0);

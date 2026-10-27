// Design-quality detection core for the acceptance gate.
// Wraps the vendored Impeccable detector (Apache-2.0, vendor/impeccable/) and
// normalizes both engines to one shape: { rule, severity, pTier }.
// Two engines:
//   detectStatic(file)        -> source-text scan, zero dependency
//   detectDomWith(JSDOM, file) -> rendered-DOM scan, needs a JSDOM ctor injected
//                                 by the caller (so jsdom resolves from the
//                                 caller's location, not this module's).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ENGINE_DIR = path.join(HERE, '..', 'vendor', 'impeccable', 'engine');
const BROWSER_BUNDLE = path.join(ENGINE_DIR, 'detect-antipatterns-browser.js');

// Severity-to-P-tier policy from the shared source of truth (lib/p-tiers.json),
// also injected into the browser scan (scripts/design-scan.js) so script and
// ui-check tiers agree. P0 = ship-blocking (a11y / legibility); P1 = strong
// AI-slop tell; P2 = craft warning; P3 = advisory; DROP = project-config drift.
const TIERS = JSON.parse(fs.readFileSync(path.join(HERE, 'p-tiers.json'), 'utf8'));
const P0_RULES = new Set(TIERS.p0);
const P1_RULES = new Set(TIERS.p1);
const DROP_RULES = new Set(TIERS.drop);

function pTier(rule, severity) {
  if (P0_RULES.has(rule)) return 'P0';
  if (P1_RULES.has(rule)) return 'P1';
  if (severity === 'advisory') return 'P3';
  return 'P2';
}

function normalize(rawList) {
  const out = [];
  const seen = new Map();
  for (const f of rawList) {
    const rule = f.rule || f.antipattern || f.id || f.type;
    if (!rule || DROP_RULES.has(rule)) continue;
    const severity = f.severity || 'warning';
    const detail = f.detail ?? f.snippet ?? '';
    // Key on detail first so the DOM tier dedupes per-detail exactly like the
    // browser wrapper (design-scan.js); static still falls back to line.
    const key = rule + '|' + (f.detail ?? f.line ?? f.snippet ?? '');
    const item = { rule, severity, pTier: pTier(rule, severity), detail };
    if (f.lyDo?.length) Object.assign(item, { do_duoc: false, ly_do: f.lyDo });
    if (seen.has(key)) {
      // Same detail measured on one element and unmeasurable on another: the measured one wins (FAIL first).
      const i = seen.get(key);
      if (out[i].do_duoc === false && item.do_duoc !== false) out[i] = item;
      continue;
    }
    seen.set(key, out.length);
    out.push(item);
  }
  return out;
}

// FAIL > KHONG-DO-DUOC > PASS. A finding the dom path could not measure (do_duoc:false) never blocks and is
// not counted in p0Count; when nothing measured blocks but such a finding sits in a fail-on tier, the
// verdict is KHONG-DO-DUOC (exit 0 here — scripts/design-gate.mjs maps it to 5 under --require-measured).
function summarize(findings, failOn) {
  const tiers = new Set(failOn);
  const measured = findings.filter((f) => f.do_duoc !== false);
  const blocking = measured.filter((f) => tiers.has(f.pTier));
  const unmeasured = findings.filter((f) => f.do_duoc === false && tiers.has(f.pTier));
  const verdict = blocking.length ? 'REJECT' : unmeasured.length ? 'KHONG-DO-DUOC' : 'PASS';
  return {
    findings,
    hits: [...new Set(findings.map((f) => f.rule))],
    p0Count: measured.filter((f) => f.pTier === 'P0').length,
    blocking: blocking.map((f) => f.rule),
    unmeasured,
    verdict,
    exitCode: blocking.length ? 2 : 0,
  };
}

// ── Why a dom contrast finding cannot be trusted ──────────────────────────────
// The vendored detector compares jsdom's computed text colour with the background it resolves by walking up
// the tree. Three page shapes make those numbers wrong; the finding then becomes KHONG-DO-DUOC with a code
// instead of a P0 (record design-gate-khong-do-duoc-ba-nguyen-nhan):
//   css-khong-ap-duoc  a stylesheet did not apply — jsdom 24 drops a whole sheet containing @layer, other jsdom
//                      versions drop layered rules, a local <link> may be missing or unparseable — unless the
//                      element pins both its colour and its background in inline style (inline beats any sheet);
//   nen-to-tien-bi-bo  the reported background is the white fallback, but an ancestor DECLARES a background
//                      jsdom could not read (`background: var(--bg)`, a gradient shorthand) — the dark page
//                      background was ignored;
//   chu-gradient       the text is painted by a clipped background (background-clip:text or a transparent
//                      -webkit-text-fill-color) — its contrast against any one colour is undefined.
// Each branch is ONE line tagged `// nhánh: <name>`: the mutation cases in
// tests/design-eval/khong-do-duoc.test.mjs remove exactly that line and expect exactly their cases to go red.
export const LY_DO = { css: 'css-khong-ap-duoc', nen: 'nen-to-tien-bi-bo', gradient: 'chu-gradient' };

function parseRgb(s) {
  const m = /^rgba?\(\s*(\d+(?:\.\d+)?)[\s,]+(\d+(?:\.\d+)?)[\s,]+(\d+(?:\.\d+)?)(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/i.exec(String(s || '').trim());
  if (!m) return null;
  const a = m[4] == null ? 1 : m[4].endsWith('%') ? parseFloat(m[4]) / 100 : parseFloat(m[4]);
  return { r: +m[1], g: +m[2], b: +m[3], a };
}
function hexOf(s) {
  const t = String(s || '').trim().toLowerCase();
  const h = /^#([0-9a-f]{3}|[0-9a-f]{6})$/.exec(t);
  if (h) return '#' + (h[1].length === 3 ? h[1].split('').map((x) => x + x).join('') : h[1]);
  const c = parseRgb(t);
  if (c && c.a >= 0.5) return '#' + [c.r, c.g, c.b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
  return t === 'white' ? '#ffffff' : null;
}
const TRANSPARENT = /^(transparent|none|initial|inherit|unset|rgba\(\s*0,\s*0,\s*0,\s*0\s*\))$/i;

// Declaration text that applies to el: inline style + every readable rule whose selector matches it.
function declared(el, window) {
  let out = el.getAttribute?.('style') || '';
  const walk = (rules) => {
    for (const r of rules) {
      if (r.selectorText) {
        try { if (el.matches(r.selectorText)) out += ';' + (r.style?.cssText || ''); } catch { /* selector jsdom cannot match */ }
      } else if (r.cssRules) walk(r.cssRules);
    }
  };
  for (const sheet of window.document.styleSheets) { try { walk(sheet.cssRules); } catch { /* unreadable sheet */ } }
  return out;
}

// Page level: does any stylesheet fail to apply?
function stylesheetUnapplied(window) {
  const doc = window.document;
  for (const st of doc.querySelectorAll('style')) {
    const text = st.textContent || '';
    if ((text.trim() && !st.sheet) || /@layer\b/.test(text)) return true;
  }
  for (const link of doc.querySelectorAll('link[rel~="stylesheet"]')) {
    const href = link.href || '';
    if (!href.startsWith('file:')) continue; // remote sheets depend on the network — out of scope
    if (!link.sheet) return true;
    try { if (/@layer\b/.test(fs.readFileSync(fileURLToPath(href), 'utf8'))) return true; } catch { return true; }
  }
  return false;
}

// Element pins both colours inline: its own colour, and a background chain declared inline up to the first
// opaque one (an element without an inline background could get one from the dropped sheet).
function pinnedInline(el) {
  if (!/(^|;)\s*color\s*:/i.test(el.getAttribute?.('style') || '')) return false;
  for (let c = el; c && c.nodeType === 1; c = c.parentElement) {
    const m = [...(c.getAttribute?.('style') || '').matchAll(/(?:^|;)\s*background(?:-color)?\s*:\s*([^;]+)/gi)];
    if (!m.length) return false;
    const v = m[m.length - 1][1].trim();
    if (TRANSPARENT.test(v)) continue;
    return hexOf(v) !== null;
  }
  return true;
}

function gradientText(el, window) {
  for (let c = el; c && c.nodeType === 1; c = c.parentElement) {
    const cs = window.getComputedStyle(c);
    if (cs.backgroundClip === 'text' || cs.getPropertyValue('-webkit-background-clip') === 'text') return true;
    const fill = cs.getPropertyValue('-webkit-text-fill-color');
    if (fill === 'transparent' || parseRgb(fill)?.a === 0) return true;
    const d = declared(c, window);
    if (/(?:^|[;\s])(?:-webkit-)?background-clip\s*:\s*text\b/i.test(d) || /-webkit-text-fill-color\s*:\s*transparent/i.test(d)) return true;
  }
  return false;
}

function resolveVars(value, el, window) {
  let s = value.trim();
  for (let i = 0; i < 5 && /var\(/.test(s); i++) {
    s = s.replace(/var\(\s*(--[\w-]+)\s*(?:,\s*([^)]*))?\)/g, (_, name, fallback) => {
      for (let c = el; c; c = c.parentElement) {
        const v = window.getComputedStyle(c).getPropertyValue(name).trim();
        if (v) return v;
      }
      return fallback || '';
    });
  }
  return hexOf(s);
}

// The reported background is white; walk up: a readable opaque background or a computed gradient below the
// body means the detector measured against something real; an ancestor that DECLARES a background jsdom
// could not read (unless it resolves to the same white) means the real background was ignored.
function ancestorBackgroundIgnored(el, window, reportedBg) {
  if (reportedBg !== '#ffffff') return false;
  for (let c = el; c && c.nodeType === 1; c = c.parentElement) {
    const cs = window.getComputedStyle(c);
    const solid = parseRgb(cs.backgroundColor);
    if (solid && solid.a >= 0.5) return false;
    if (/gradient/i.test(cs.backgroundImage || '') && c.tagName !== 'BODY' && c.tagName !== 'HTML') return false;
    const vals = [...declared(c, window).matchAll(/(?:^|[;\s])background(?:-color|-image)?\s*:\s*([^;]+)/gi)]
      .map((m) => m[1].trim()).filter((v) => !TRANSPARENT.test(v));
    if (vals.length) return resolveVars(vals[vals.length - 1], c, window) !== '#ffffff';
  }
  return false;
}

function unmeasurableReasons(el, detail, window, cssUnapplied) {
  const lyDo = [];
  if (cssUnapplied && !pinnedInline(el)) lyDo.push(LY_DO.css); // nhánh: css
  const reportedBg = (/ on (#[0-9a-f]{6})\b/i.exec(detail) || [])[1]?.toLowerCase();
  const clipped = gradientText(el, window);
  if (clipped) lyDo.push(LY_DO.gradient); // nhánh: gradient
  if (!clipped && ancestorBackgroundIgnored(el, window, reportedBg)) lyDo.push(LY_DO.nen); // nhánh: nen
  return lyDo;
}

export async function detectStatic(file, { failOn = ['P0'] } = {}) {
  // Import the static-html engine directly — the CLI entry (detect-antipatterns.mjs)
  // reaches outside the vendored engine, this leaf does not.
  const { detectHtml } = await import(
    path.join(ENGINE_DIR, 'engines', 'static-html', 'detect-html.mjs')
  );
  const raw = await detectHtml(file, {});
  return { mode: 'static', ...summarize(normalize(raw || []), failOn) };
}

// JSDOM is injected so it resolves from the caller's node_modules. Browser-API
// gaps jsdom lacks (IntersectionObserver, layout rects) are polyfilled; the
// detector bundle is loaded then removed from the DOM so it never scans itself.
// External CSS is loaded (resources:'usable' + the file's own URL) so real,
// multi-file artifacts resolve their tokens/contrast — page <script> tags are
// stripped first so the gate never runs (or hangs on) the artifact's own JS.
export async function detectDomWith(JSDOM, file, { failOn = ['P0'], loadCssMs = 2500 } = {}) {
  const html = fs.readFileSync(file, 'utf8').replace(/<script[\s\S]*?<\/script>/gi, '');
  const bundle = fs.readFileSync(BROWSER_BUNDLE, 'utf8');
  const poly = [
    'window.IntersectionObserver=class{observe(){}unobserve(){}disconnect(){}takeRecords(){return[]}};',
    'window.ResizeObserver=class{observe(){}unobserve(){}disconnect(){}};',
    'window.matchMedia=q=>({matches:false,media:q,addListener(){},removeListener(){},addEventListener(){},removeEventListener(){}});',
    'Element.prototype.getBoundingClientRect=function(){return{x:0,y:0,top:0,left:0,right:120,bottom:60,width:120,height:60,toJSON(){return{}}}};',
  ].join('');
  const dom = new JSDOM(html, {
    url: pathToFileURL(file).href,
    resources: 'usable',
    runScripts: 'dangerously',
    pretendToBeVisual: true,
  });
  const { window } = dom;
  await new Promise((res) => {
    let done = false;
    const fin = () => { if (!done) { done = true; res(); } };
    window.addEventListener('load', fin);
    setTimeout(fin, loadCssMs);
  });
  window.__IMPECCABLE_CONFIG__ = { autoScan: false };
  const p = window.document.createElement('script');
  p.textContent = poly;
  window.document.head.appendChild(p);
  const s = window.document.createElement('script');
  s.textContent = bundle;
  window.document.body.appendChild(s);
  s.remove();
  p.remove();
  if (typeof window.impeccableDetect !== 'function') {
    throw new Error('detector bundle did not attach impeccableDetect');
  }
  const raw = window.impeccableDetect({ serialize: false });
  const cssUnapplied = stylesheetUnapplied(window);
  const flat = raw.flatMap((r) => (r.findings || []).map((f) => {
    const rule = f.type || f.id;
    const detail = f.detail ?? f.snippet;
    const lyDo = rule === 'low-contrast' && r.el ? unmeasurableReasons(r.el, detail || '', window, cssUnapplied) : [];
    return { rule, severity: f.severity, detail, lyDo };
  }));
  const result = { mode: 'dom', ...summarize(normalize(flat), failOn) };
  window.close?.();
  return result;
}

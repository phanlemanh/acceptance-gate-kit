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
  return s;
}

// One colour token → { r, g, b, a } for #hex, rgb(), hsl(), oklch(), white/black/transparent; anything else null.
const num = (t, pct = 1) => (t.endsWith('%') ? (parseFloat(t) / 100) * pct : parseFloat(t));
function colourOf(token) {
  const t = token.trim().toLowerCase();
  if (t === 'transparent') return { r: 0, g: 0, b: 0, a: 0 };
  if (t === 'white') return { r: 255, g: 255, b: 255, a: 1 };
  if (t === 'black') return { r: 0, g: 0, b: 0, a: 1 };
  const h = hexOf(t);
  if (h && t.startsWith('#')) return { r: parseInt(h.slice(1, 3), 16), g: parseInt(h.slice(3, 5), 16), b: parseInt(h.slice(5, 7), 16), a: 1 };
  const rgb = parseRgb(t);
  if (rgb) return rgb;
  const f = /^(hsla?|oklch)\(\s*([^)]*)\)$/.exec(t);
  if (!f) return null;
  const [main, alpha] = f[2].split('/');
  const p = main.split(/[\s,]+/).filter(Boolean);
  if (p.length < 3) return null;
  const a = alpha == null ? 1 : num(alpha.trim());
  if (f[1].startsWith('hsl')) {
    const hue = parseFloat(p[0]), sat = num(p[1], 1), lig = num(p[2], 1);
    const k = (n) => (n + hue / 30) % 12;
    const ch = (n) => 255 * (lig - sat * Math.min(lig, 1 - lig) * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1)));
    return { r: ch(0), g: ch(8), b: ch(4), a };
  }
  // oklch → oklab → linear sRGB → sRGB
  const L = num(p[0], 1), C = parseFloat(p[1]), H = (parseFloat(p[2]) * Math.PI) / 180;
  const A = C * Math.cos(H), B = C * Math.sin(H);
  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
  const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
  const s3 = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
  const lin = [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s3,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s3,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s3];
  const [r, g, b] = lin.map((v) => 255 * Math.min(1, Math.max(0, v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055)));
  return { r, g, b, a };
}

// The colour a declared background paints, from its LAST layer (earlier comma layers are images on top):
// { colour } when a colour token is there · 'none' when the layer is only an image (url, gradient) ·
// 'unknown' when a token looks like a colour this reader cannot parse (color-mix, lab, a named colour…).
const NOT_COLOUR = /^(no-repeat|repeat(-x|-y)?|space|round|center|top|bottom|left|right|fixed|scroll|local|border-box|padding-box|content-box|text|cover|contain|auto|none|initial|inherit|unset|\/|-?[\d.]+(px|%|em|rem|vw|vh)?)$/i;
function layerColour(value) {
  const layers = [];
  let depth = 0, start = 0;
  for (let i = 0; i < value.length; i++) {
    if (value[i] === '(') depth++;
    else if (value[i] === ')') depth--;
    else if (value[i] === ',' && depth === 0) { layers.push(value.slice(start, i)); start = i + 1; }
  }
  layers.push(value.slice(start));
  let last = layers[layers.length - 1].replace(/!important/i, ' ');
  // drop images: url(…), *-gradient(…), image-set(…) with balanced parentheses
  for (let guard = 0; guard < 20; guard++) {
    const m = /(?:url|[\w-]*gradient|image-set|-webkit-image-set)\(/i.exec(last);
    if (!m) break;
    let d = 0, j = m.index + m[0].length - 1;
    for (; j < last.length; j++) { if (last[j] === '(') d++; else if (last[j] === ')' && --d === 0) break; }
    last = last.slice(0, m.index) + ' ' + last.slice(j + 1);
  }
  const tokens = last.match(/[\w#.%-]+\([^()]*\)|[^\s()]+/g) || [];
  let unknown = false;
  for (const t of tokens) {
    const c = colourOf(t);
    if (c) return { colour: c };
    if (!NOT_COLOUR.test(t)) unknown = true;
  }
  return unknown ? 'unknown' : 'none';
}

// The reported background is white; walk up: a readable opaque background or a computed gradient below the
// body means the detector measured against something real; an ancestor that DECLARES a background colour
// jsdom could not read is resolved here (var(), hsl, oklch, shorthand with image layers): white → the
// measurement stands; a dark colour → the real background was ignored. A layer that is only an image adds no
// colour (keep walking), and a colour this reader cannot parse is not called «ignored» — the old verdict stands.
function ancestorBackgroundIgnored(el, window, reportedBg) {
  if (reportedBg !== '#ffffff') return false;
  for (let c = el; c && c.nodeType === 1; c = c.parentElement) {
    const cs = window.getComputedStyle(c);
    const solid = parseRgb(cs.backgroundColor);
    if (solid && solid.a >= 0.5) return false;
    if (/gradient/i.test(cs.backgroundImage || '') && c.tagName !== 'BODY' && c.tagName !== 'HTML') return false;
    const vals = [...declared(c, window).matchAll(/(?:^|[;\s])background(?:-color|-image)?\s*:\s*([^;]+)/gi)]
      .map((m) => m[1].trim()).filter((v) => !TRANSPARENT.test(v));
    if (!vals.length) continue;
    const found = layerColour(resolveVars(vals[vals.length - 1], c, window));
    if (found === 'unknown') return false;
    if (found === 'none' || found.colour.a < 0.5) continue;
    const { r, g, b } = found.colour;
    return !(Math.round(r) === 255 && Math.round(g) === 255 && Math.round(b) === 255);
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

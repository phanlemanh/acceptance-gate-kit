// Text of the rendered-DOM detector as the gate runs it: the vendored Impeccable bundle plus the kit's colour patches.
// vendor/impeccable stays byte-identical to upstream (NOTICE, case KD8-vendor), so the patches are applied here, on the
// text, for both consumers: lib/design-detect.mjs (jsdom) and scripts/build-design-scan.mjs (real browser).
//
// What the patches change. Chrome reports Tailwind 4 colours as lab()/oklab()/lch()/oklch(), and the upstream reader only
// understands rgb(), so such text was skipped and the page passed unmeasured. After the patches:
//   · lab, oklab, lch, oklch (percent, `none`, exponent, alpha) are read as sRGB, as Chrome paints them;
//   · contrast composites a translucent text colour over its background, and a translucent background over what is
//     under it — upstream ignored alpha, so black at 20% on white measured as 21:1;
//   · a colour that still cannot be read becomes a low-contrast finding with `lyDo: ['mau-khong-doc-duoc']`,
//     which both consumers report as KHONG-DO-DUOC (do_duoc: false), never PASS.
//
// Each anchor must occur exactly once in the upstream text. A re-sync that moves one fails here, loudly, instead of
// silently shipping the unpatched reader.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const VENDOR_BUNDLE = path.join(HERE, '..', 'vendor', 'impeccable', 'engine', 'detect-antipatterns-browser.js');

// Spliced into the bundle ahead of parseRgb. Conversions follow CSS Color 4, and the kit's tests pin them to pixels
// measured on real Chrome.
const COLOUR_HELPERS = String.raw`
const RE_SO_MAU = /none|[-+]?(?:\d*\.\d+|\d+\.?)(?:e[-+]?\d+)?(?:%|deg)?/g;
const RE_ALPHA_MAU = /^(?:none|[-+]?(?:\d*\.\d+|\d+\.?)(?:e[-+]?\d+)?%?)$/;

function soMau(token, percentReference) {
  if (token === 'none') return 0;
  return token.endsWith('%') ? (parseFloat(token) * percentReference) / 100 : parseFloat(token);
}

function linearSrgbTuOklab(L, a, b) {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

function linearSrgbTuLab(L, a, b) {
  const kappa = 24389 / 27;
  const epsilon = 216 / 24389;
  const f1 = (L + 16) / 116;
  const f0 = a / 500 + f1;
  const f2 = f1 - b / 200;
  const x50 = (f0 ** 3 > epsilon ? f0 ** 3 : (116 * f0 - 16) / kappa) * (0.3457 / 0.3585);
  const y50 = L > kappa * epsilon ? f1 ** 3 : L / kappa;
  const z50 = (f2 ** 3 > epsilon ? f2 ** 3 : (116 * f2 - 16) / kappa) * ((1 - 0.3457 - 0.3585) / 0.3585);
  const x = 0.955473421488075 * x50 - 0.02309845494876471 * y50 + 0.06325924320057072 * z50;
  const y = -0.0283697093338637 * x50 + 1.0099953980813041 * y50 + 0.021041441191917323 * z50;
  const z = 0.012314014864481998 * x50 - 0.020507649298898964 * y50 + 1.330365926242124 * z50;
  return [
    3.2409699419045226 * x - 1.537383177570094 * y - 0.4986107602930034 * z,
    -0.9692436362808796 * x + 1.8759675015077202 * y + 0.04155505740717559 * z,
    0.05563007969699366 * x - 0.20397695888897652 * y + 1.0569715142428786 * z,
  ];
}

function kenhSrgb(v) {
  const c = Math.max(0, Math.min(1, v));
  return Math.round(255 * (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055));
}

// lab(), oklab(), lch(), oklch() -> { r, g, b, a } in sRGB, out-of-gamut channels clipped; anything else -> null.
function docMauHoLab(color) {
  const m = /^(oklab|oklch|lab|lch)\(([^()]*)\)$/.exec(String(color).trim().toLowerCase());
  if (!m) return null;
  const parts = m[2].split('/');
  if (parts.length > 2) return null;
  const so = parts[0].match(RE_SO_MAU) || [];
  if (so.length !== 3 || parts[0].replace(RE_SO_MAU, '').trim() !== '') return null;
  let alpha = 1;
  if (parts.length === 2) {
    const t = parts[1].trim();
    if (!RE_ALPHA_MAU.test(t)) return null;
    alpha = Math.max(0, Math.min(1, soMau(t, 1)));
  }
  const ok = m[1].startsWith('ok');
  const L = Math.max(0, Math.min(ok ? 1 : 100, soMau(so[0], ok ? 1 : 100)));
  let a;
  let b;
  if (m[1].endsWith('ch')) {
    if (so[2].endsWith('%')) return null;
    const C = soMau(so[1], ok ? 0.4 : 150);
    const H = (soMau(so[2], 1) * Math.PI) / 180;
    a = C * Math.cos(H);
    b = C * Math.sin(H);
  } else {
    a = soMau(so[1], ok ? 0.4 : 125);
    b = soMau(so[2], ok ? 0.4 : 125);
  }
  const [r, g, bl] = (ok ? linearSrgbTuOklab : linearSrgbTuLab)(L, a, b).map(kenhSrgb);
  return { r, g, b: bl, a: alpha };
}

// The colour the eye sees: tren painted over duoi. An opaque tren comes back unchanged, and so does alpha 0: that text
// is painted by something else (background-clip: text), which lib/design-detect.mjs reports as chu-gradient.
function hoaMau(tren, duoi) {
  const a = tren.a == null ? 1 : tren.a;
  if (a >= 1 || a <= 0) return tren;
  const k = (t, d) => Math.round(t * a + d * (1 - a));
  return { r: k(tren.r, duoi.r), g: k(tren.g, duoi.g), b: k(tren.b, duoi.b), a: 1 };
}

// True for a colour function parseRgb cannot read. Bare keywords are out: jsdom leaves the default as "canvastext".
// var() and color-mix() are out too: a browser always computes them away, so only jsdom shows them, and that path
// keeps its own judgement (design-detect's nen-to-tien-bi-bo; clean token pages stay PASS, baseline f09).
function mauKhongDoc(value) {
  const t = String(value || '').trim().toLowerCase();
  if (!t.includes('(') || /\bvar\(|^color-mix\(/.test(t)) return false;
  return !parseRgb(t);
}

// The first colour on this element's contrast path that cannot be read, or null. Stops at an opaque background: what
// lies under it does not reach the eye.
function timMauKhongDoc(el, style) {
  if (mauKhongDoc(style.color)) return style.color;
  for (let c = el; c && c.nodeType === 1; c = c.parentElement) {
    const cs = getComputedStyle(c);
    if (mauKhongDoc(cs.backgroundColor)) return cs.backgroundColor;
    const solid = parseRgb(cs.backgroundColor);
    if (solid && solid.a >= 1) return null;
    const image = cs.backgroundImage || '';
    if (/gradient/i.test(image) && /\bcolor\(/i.test(image)) return image;
  }
  return null;
}
`;

const PATCHES = [
  // Read the lab family wherever a computed colour is parsed.
  [`function parseRgb(color) {
  if (!color || color === 'transparent') return null;
  const m = color.match(/rgba?\\((\\d+),\\s*(\\d+),\\s*(\\d+)(?:,\\s*([\\d.]+))?\\)/);
  if (!m) return null;`,
  `${COLOUR_HELPERS}
function parseRgb(color) {
  if (!color || color === 'transparent') return null;
  const m = color.match(/rgba?\\((\\d+),\\s*(\\d+),\\s*(\\d+)(?:,\\s*([\\d.]+))?\\)/);
  if (!m) return docMauHoLab(color);`],
  [`    return rgb;
  }
  return null;
}

// Resolve var() refs in a color string`,
  `    return rgb;
  }
  return docMauHoLab(str);
}

// Resolve var() refs in a color string`],
  [`  for (const m of bgImage.matchAll(/rgba?\\([^)]+\\)/g)) {`,
    `  for (const m of bgImage.matchAll(/(?:rgba?|oklab|oklch|lab|lch)\\([^)]+\\)/g)) {`],

  // Composite alpha before measuring.
  [`      if (DETECTOR_IS_BROWSER || bg.a >= 0.5) return bg;`,
    `      if (DETECTOR_IS_BROWSER || bg.a >= 0.5) {
        if (bg.a >= 1) return bg;
        const duoi = resolveBackground(current.parentElement, win, customPropMap);
        return duoi ? hoaMau(bg, duoi) : bg;
      }`],
  [`      const ratios = bgs.map(b => contrastRatio(textColor, b));`,
    `      const ratios = bgs.map(b => contrastRatio(hoaMau(textColor, b), b));`],
  ['need ${threshold}:1) — text ${colorToHex(textColor)} on ${colorToHex(bgs[worstIdx])}`',
    'need ${threshold}:1) — text ${colorToHex(hoaMau(textColor, bgs[worstIdx]))} on ${colorToHex(bgs[worstIdx])}`'],

  // An unreadable colour is a finding the verdict can see, not an element quietly skipped.
  [`  if (hasDirectText && textColor && !isEmojiOnly) {
    // Run background-dependent checks`,
  `  if (hasDirectText && !isEmojiOnly && opts.mauKhongDoc) {
    findings.push({ id: 'low-contrast', snippet: 'không đọc được màu ' + opts.mauKhongDoc, lyDo: ['mau-khong-doc-duoc'] });
  }
  if (hasDirectText && textColor && !isEmojiOnly) {
    // Run background-dependent checks`],
  [`    const bgs = effectiveBg ? [effectiveBg] :`, `    const bgs = opts.mauKhongDoc ? null : effectiveBg ? [effectiveBg] :`],
  [`    textColor: parseRgb(style.color),
    bgColor: readOwnBackgroundColor(el, style),`,
  `    textColor: parseRgb(style.color),
    mauKhongDoc: timMauKhongDoc(el, style),
    bgColor: readOwnBackgroundColor(el, style),`],
  [`...checkElementColorsDOM(el).map(f => ({ type: f.id, detail: f.snippet })),`,
    `...checkElementColorsDOM(el).map(f => ({ type: f.id, detail: f.snippet, ...(f.lyDo ? { lyDo: f.lyDo } : {}) })),`],
];

export function patchDetector(source) {
  let out = source;
  for (const [anchor, replacement] of PATCHES) {
    const count = out.split(anchor).length - 1;
    if (count !== 1) throw new Error(`design-bundle: anchor must occur once, found ${count}: ${anchor.split('\n')[0]}`);
    out = out.split(anchor).join(replacement);
  }
  return out;
}

export function detectorBundle() {
  return patchDetector(fs.readFileSync(VENDOR_BUNDLE, 'utf8'));
}

#!/usr/bin/env node
// plugin-declare.mjs — ghi/hợp nhất `.claude/settings.json` CẤP REPO: khai marketplace
// của kit + bật đúng bộ plugin, để máy sau mở repo là harness nhắc đúng bộ.
// Nguồn tên: ../.claude-plugin/marketplace.json ship cùng plugin (source "./").
// Parse + hợp nhất — giữ nguyên mọi khoá khác của đội và thứ tự khoá có sẵn;
// file không parse được → exit 3, không chạm. Mặc định dry-run, --write mới ghi.
// Usage: node plugin-declare.mjs --root <repo> [--write] [--list] [--marketplace <path>]
// Exit:  0 ok/dry-run/không-đổi · 3 settings.json hỏng (không ghi) · 4 sai tham số
//        hoặc marketplace.json vắng/không đọc được (không ghi).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const DEFAULT_MARKETPLACE = path.resolve(HERE, '..', '.claude-plugin', 'marketplace.json');
export const MARKETPLACE_NAME = 'acceptance-gate-kit';
export const MARKETPLACE_SOURCE = { source: 'github', repo: 'phanlemanh/acceptance-gate-kit' };
// superpowers: phụ thuộc của feature-loop, nằm ở marketplace mặc định — không khai thêm marketplace.
export const EXTRA_PLUGINS = ['superpowers@claude-plugins-official'];

function parseArgs(argv) {
  const a = { root: process.cwd(), write: false, list: false, marketplace: DEFAULT_MARKETPLACE };
  for (let i = 0; i < argv.length; i++) {
    const t = argv[i];
    if (t === '--root') a.root = argv[++i];
    else if (t === '--write') a.write = true;
    else if (t === '--list') a.list = true;
    else if (t === '--marketplace') a.marketplace = argv[++i];
    else { console.error(`[plugin-declare] tham số lạ: ${t}`); return null; }
  }
  if (!a.root || !a.marketplace) return null;
  return a;
}

const isPlain = v => v !== null && typeof v === 'object' && !Array.isArray(v);

// Đọc marketplace.json: MỘT nguồn cho cả hậu tố plugin lẫn khoá extraKnownMarketplaces (tên `mk`).
export function readMarketplace(marketplacePath = DEFAULT_MARKETPLACE) {
  let txt;
  try { txt = fs.readFileSync(marketplacePath, 'utf8'); }
  catch { console.error(`[plugin-declare] không đọc được marketplace.json — đã thử: ${marketplacePath}`); return null; }
  let j;
  try { j = JSON.parse(txt); }
  catch { console.error(`[plugin-declare] marketplace.json không phải JSON — đã thử: ${marketplacePath}`); return null; }
  const names = (Array.isArray(j.plugins) ? j.plugins : []).map(p => p && p.name).filter(Boolean);
  if (!names.length) { console.error(`[plugin-declare] marketplace.json không có plugin nào — đã thử: ${marketplacePath}`); return null; }
  if (!j.name) { console.error(`[plugin-declare] marketplace.json thiếu khoá name — đã thử: ${marketplacePath}`); return null; }
  return { names, mk: j.name };
}

export function pluginList(marketplacePath = DEFAULT_MARKETPLACE) {
  const m = readMarketplace(marketplacePath);
  return m ? [...m.names.map(n => `${n}@${m.mk}`), ...EXTRA_PLUGINS] : null;
}

// Hợp nhất: spread giữ thứ tự khoá có sẵn; khoá của kit đặt lại tại chỗ cũ hoặc nối cuối.
// `mk` = tên marketplace đọc từ marketplace.json — cùng nguồn với hậu tố plugin (không hai nguồn).
export function mergeSettings(existing, names, mk = MARKETPLACE_NAME) {
  const out = isPlain(existing) ? { ...existing } : {};
  const kept = [];
  const ekm = { ...(out.extraKnownMarketplaces || {}) };
  // Đội đã trỏ marketplace này vào nguồn riêng (fork, git url) → GIỮ, chỉ khai khi vắng.
  if (ekm[mk] === undefined) ekm[mk] = { source: MARKETPLACE_SOURCE };
  else if (JSON.stringify(ekm[mk]) !== JSON.stringify({ source: MARKETPLACE_SOURCE })) kept.push(`extraKnownMarketplaces.${mk} (nguồn riêng của đội)`);
  out.extraKnownMarketplaces = ekm;
  const ep = { ...(out.enabledPlugins || {}) };
  // `false` là quyết định của đội (đã tắt plugin) — KHÔNG lật im lặng.
  for (const n of names) { if (ep[n] === false) kept.push(`${n}: false`); else ep[n] = true; }
  out.enabledPlugins = ep;
  // Kênh điều khiển đi RIÊNG — nhét sentinel vào chính object settings thì một khoá
  // cùng tên của đội bị ghi đè rồi xoá, và bên gọi ngoài main() sẽ serialize nó vào file.
  return { settings: out, kept };
}

function main() {
  const a = parseArgs(process.argv.slice(2));
  if (!a) { console.error('[plugin-declare] usage: plugin-declare.mjs --root <repo> [--write] [--list] [--marketplace <path>]'); process.exit(4); }
  const m = readMarketplace(a.marketplace);
  if (!m) process.exit(4);
  const names = [...m.names.map(n => `${n}@${m.mk}`), ...EXTRA_PLUGINS];
  if (a.list) { for (const n of names) console.log(n); process.exit(0); }
  // --root phải tồn tại và là thư mục — lệnh GHI mà tự mkdir cây lạ là fail-open (cùng nếp product-map/start-scan).
  if (!fs.existsSync(a.root) || !fs.statSync(a.root).isDirectory()) { console.error(`[plugin-declare] --root trỏ đường dẫn không tồn tại: ${a.root}`); process.exit(4); }
  const file = path.join(a.root, '.claude', 'settings.json');
  let existing = null, raw = null;
  if (fs.existsSync(file)) {
    try { raw = fs.readFileSync(file, 'utf8'); }
    catch (e) { console.error(`[plugin-declare] không đọc được settings.json (${e.code}) — không ghi đè (${file})`); process.exit(3); }
    try { existing = JSON.parse(raw); }
    catch { console.error(`[plugin-declare] settings.json không đọc được — không ghi đè (${file})`); process.exit(3); }
    // JSON đọc được nhưng không phải settings — mỗi lối một thông điệp, không nuốt chung.
    if (!isPlain(existing)) { console.error(`[plugin-declare] settings.json không phải object — không ghi đè (${file})`); process.exit(3); }
    for (const k of ['enabledPlugins', 'extraKnownMarketplaces']) {
      if (k in existing && !isPlain(existing[k])) { console.error(`[plugin-declare] settings.json: khoá ${k} không phải object — không ghi đè (${file})`); process.exit(3); }
    }
  }
  const { settings: merged, kept } = mergeSettings(existing, names, m.mk);
  const next = JSON.stringify(merged, null, 2) + '\n';
  const keptLine = kept.length ? `giữ nguyên (đội đã đặt): ${kept.join(' · ')}` : '';
  if (!a.write) {
    console.log(`(dry-run) sẽ ${existing ? 'hợp nhất vào' : 'tạo'} ${file} với ${names.length} plugin:`);
    for (const n of names) console.log(`  - ${n}`);
    console.log('(dry-run) chạy lại với --write để ghi.');
    process.exit(0);
  }
  if (raw === next) { console.log(`đã khai, không đổi: ${file}`); if (keptLine) console.log(keptLine); process.exit(0); }
  try {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, next);
  } catch (e) { console.error(`[plugin-declare] không ghi được settings.json (${e.code}) — không đổi gì (${file})`); process.exit(3); }
  console.log(`đã khai ${names.length} plugin trong ${path.relative(a.root, file) || file} — commit file này, đội viên mở repo là được nhắc cài.`);
  if (keptLine) console.log(keptLine);
  process.exit(0);
}

// Guard entry-point bằng realpath: /var/… là symlink của /private/var/… trên macOS, và
// đường cache plugin cũng có thể là symlink — so chuỗi thô thì main() im lặng không chạy.
function isEntryPoint() {
  const self = fileURLToPath(import.meta.url);
  if (!process.argv[1]) return false;
  const argv1 = path.resolve(process.argv[1]);
  // realpath để khớp qua symlink (/var → /private/var, cache plugin). Lỗi realpath KHÔNG
  // được biến thành "không phải entry point" — im lặng exit 0 là fail-open câm.
  try { return fs.realpathSync(argv1) === fs.realpathSync(self); }
  catch { return argv1 === self; }
}
if (isEntryPoint()) main();

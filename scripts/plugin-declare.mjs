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

export function pluginList(marketplacePath = DEFAULT_MARKETPLACE) {
  let txt;
  try { txt = fs.readFileSync(marketplacePath, 'utf8'); }
  catch { console.error(`[plugin-declare] không đọc được marketplace.json — đã thử: ${marketplacePath}`); return null; }
  let j;
  try { j = JSON.parse(txt); }
  catch { console.error(`[plugin-declare] marketplace.json không phải JSON — đã thử: ${marketplacePath}`); return null; }
  const names = (Array.isArray(j.plugins) ? j.plugins : []).map(p => p && p.name).filter(Boolean);
  if (!names.length) { console.error(`[plugin-declare] marketplace.json không có plugin nào — đã thử: ${marketplacePath}`); return null; }
  const mk = j.name || MARKETPLACE_NAME;
  return [...names.map(n => `${n}@${mk}`), ...EXTRA_PLUGINS];
}

// Hợp nhất: spread giữ thứ tự khoá có sẵn; khoá của kit đặt lại tại chỗ cũ hoặc nối cuối.
export function mergeSettings(existing, names) {
  const out = existing && typeof existing === 'object' && !Array.isArray(existing) ? { ...existing } : {};
  const ekm = { ...(out.extraKnownMarketplaces || {}) };
  ekm[MARKETPLACE_NAME] = { source: MARKETPLACE_SOURCE };
  out.extraKnownMarketplaces = ekm;
  const ep = { ...(out.enabledPlugins || {}) };
  for (const n of names) ep[n] = true;
  out.enabledPlugins = ep;
  return out;
}

function main() {
  const a = parseArgs(process.argv.slice(2));
  if (!a) { console.error('[plugin-declare] usage: plugin-declare.mjs --root <repo> [--write] [--list] [--marketplace <path>]'); process.exit(4); }
  const names = pluginList(a.marketplace);
  if (!names) process.exit(4);
  if (a.list) { for (const n of names) console.log(n); process.exit(0); }
  const file = path.join(a.root, '.claude', 'settings.json');
  let existing = null, raw = null;
  if (fs.existsSync(file)) {
    raw = fs.readFileSync(file, 'utf8');
    try { existing = JSON.parse(raw); }
    catch { console.error(`[plugin-declare] settings.json không đọc được — không ghi đè (${file})`); process.exit(3); }
  }
  const next = JSON.stringify(mergeSettings(existing, names), null, 2) + '\n';
  if (!a.write) {
    console.log(`(dry-run) sẽ ${existing ? 'hợp nhất vào' : 'tạo'} ${file} với ${names.length} plugin:`);
    for (const n of names) console.log(`  - ${n}`);
    console.log('(dry-run) chạy lại với --write để ghi.');
    process.exit(0);
  }
  if (raw === next) { console.log(`đã khai, không đổi: ${file}`); process.exit(0); }
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, next);
  console.log(`đã khai ${names.length} plugin trong ${path.relative(a.root, file) || file} — commit file này, đội viên mở repo là được nhắc cài.`);
  process.exit(0);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();

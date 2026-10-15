#!/usr/bin/env node
// config-patch.mjs — THE single splice path for programmatic writes to
// _acceptance/config.yaml (e.g. feature-loop S4 auto-writing
// feature_loop.suite_keys).
//
// The kit's parsers (lib/evidence-core.cjs resolveConfigKey + the sed/awk in
// pre-merge-check.sh) are line/2-space-indent based — a YAML-lib round-trip
// would reformat and break them, and a free-hand agent edit can corrupt live
// keys. So: TEXT splice, append-only into the right block, ABORT when the key
// already exists (never overwrite a live value). Generalized to one dotted key
// from an earlier single-purpose config patcher.
//
// Default: DRY-RUN (print the plan, write nothing). Pass --write to apply —
// backs up to <config>.bak first, and self-checks the result with the SAME
// resolver the hook uses (resolveConfigKey) before touching the file.
//
// Usage: node config-patch.mjs --key <dotted.key> --value <scalar|[inline,list]>
//                              [--config <path=_acceptance/config.yaml>] [--write]
//        node config-patch.mjs --key <dotted.key> --append --value <item> [...]
//          (hồ sơ kho-moi-cai-goi-road-map) nối MỘT mục `- "<item>"` vào danh sách khối của khoá; khoá vắng
//          thì tạo khoá (và chuỗi cha) với đúng mục đó. Mục đã có, hay khoá đang mang giá trị trên dòng
//          (`[a, b]`, vô hướng) → từ chối, không ghi. Vẫn chỉ-thêm: không xoá, không sắp xếp lại.
// Exit:  0 ok/dry-run · 2 refused (key already exists / item already listed) · 4 bad usage/shape.

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const requireCjs = createRequire(import.meta.url);
let core = null;
try { core = requireCjs('../lib/evidence-core.cjs'); } catch (_) { /* standalone copy — self-check degrades to a warning */ }
let wr = null;
try { wr = requireCjs('../lib/workspace-record.cjs'); } catch (_) { /* bản chép rời — chế độ --append tự đọc lại bằng bộ quét của chính nó */ }
const boNhay = v => v.replace(/\s*#.*$/, '').trim().replace(/^["'](.*)["']$/, '$1').trim();

function parseArgs(argv) {
  const a = { config: '_acceptance/config.yaml', key: '', value: undefined, write: false, append: false };
  for (let i = 0; i < argv.length; i++) {
    const t = argv[i];
    if (t === '--config') a.config = argv[++i];
    else if (t === '--key') a.key = argv[++i];
    else if (t === '--value') a.value = argv[++i];
    else if (t === '--write') a.write = true;
    else if (t === '--append') a.append = true;
  }
  return a;
}

// End of the block owned by the key line at `indent` spaces: index of the
// first following non-blank, non-comment line indented <= indent.
function blockEnd(lines, idx, indent) {
  for (let i = idx + 1; i < lines.length; i++) {
    const l = lines[i];
    if (l.trim() === '' || l.trim().startsWith('#')) continue;
    if (l.length - l.trimStart().length <= indent) return i;
  }
  return lines.length;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.key || args.value === undefined || args.value === '') {
    console.error('[config-patch] usage: config-patch.mjs --key <dotted.key> --value <scalar> [--config <path>] [--write]');
    process.exit(4);
  }
  const parts = args.key.split('.');
  if (parts.some(p => !/^[\w-]+$/.test(p))) {
    console.error(`[config-patch] bad key "${args.key}" — dotted segments of [A-Za-z0-9_-] only`);
    process.exit(4);
  }
  const cfgPath = path.resolve(args.config);
  if (!fs.existsSync(cfgPath)) {
    console.error(`[config-patch] config not found: ${cfgPath} — run /acceptance-init first`);
    process.exit(4);
  }
  const orig = fs.readFileSync(cfgPath, 'utf8');
  const lines = orig.split('\n');

  // Walk the dotted key through 2-space blocks; stop at the first missing level.
  let searchStart = 0;
  let searchEnd = lines.length;
  let missingFrom = parts.length; // first level that does NOT exist yet
  for (let depth = 0; depth < parts.length; depth++) {
    const indent = depth * 2;
    const re = new RegExp('^' + ' '.repeat(indent) + parts[depth] + '\\s*:(.*)$');
    let foundIdx = -1;
    let rest = '';
    for (let i = searchStart; i < searchEnd; i++) {
      const l = lines[i];
      if (l.trim() === '' || l.trim().startsWith('#')) continue;
      const m = l.match(re);
      if (m) { foundIdx = i; rest = m[1]; break; }
    }
    if (foundIdx < 0) { missingFrom = depth; break; }
    if (depth === parts.length - 1 && args.append) {
      if (rest.replace(/#.*$/, '').trim() !== '') {
        console.error(`[config-patch] "${args.key}" mang giá trị trên dòng (${lines[foundIdx].trim()}) — --append chỉ nối vào danh sách khối \`- mục\`; sửa tay, trong review`);
        process.exit(4);
      }
      const end = blockEnd(lines, foundIdx, indent);
      const items = [];
      let itemIndent = null; let last = foundIdx;
      for (let i = foundIdx + 1; i < end; i++) {
        const m = lines[i].match(/^(\s*)-\s*(.*)$/);
        if (m) { items.push(boNhay(m[2])); if (itemIndent == null) itemIndent = m[1]; last = i; }
      }
      if (items.includes(args.value)) {
        console.error(`[config-patch] REFUSED: "${args.value}" đã có trong ${args.key} — không ghi`);
        process.exit(2);
      }
      const added = [`${itemIndent ?? ' '.repeat(indent + 2)}- "${args.value}"`];
      const out = lines.slice();
      out.splice(last + 1, 0, ...added);
      return finish(args, cfgPath, out.join('\n'), added);
    }
    if (depth === parts.length - 1) {
      console.error(`[config-patch] REFUSED: key "${args.key}" already exists (line ${foundIdx + 1}: ${lines[foundIdx].trim()}) — this tool is append-only; edit live keys by hand, in review.`);
      process.exit(2);
    }
    if (rest.replace(/#.*$/, '').trim() !== '') {
      console.error(`[config-patch] "${parts.slice(0, depth + 1).join('.')}" holds a scalar value — cannot nest "${args.key}" under it`);
      process.exit(4);
    }
    searchStart = foundIdx + 1;
    searchEnd = blockEnd(lines, foundIdx, indent);
  }

  // Splice the missing chain at the end of the innermost existing block
  // (backing over trailing blank lines, like design-config-patch).
  const added = [];
  for (let d = missingFrom; d < parts.length; d++) {
    added.push('  '.repeat(d) + parts[d] + (d === parts.length - 1 ? (args.append ? ':' : `: ${args.value}`) : ':'));
  }
  if (args.append) added.push('  '.repeat(parts.length) + `- "${args.value}"`);
  let insertAt = searchEnd;
  while (insertAt - 1 >= searchStart && lines[insertAt - 1].trim() === '') insertAt--;
  const out = lines.slice();
  out.splice(insertAt, 0, ...added);
  return finish(args, cfgPath, out.join('\n'), added);
}

// Danh sách khối đọc lại — bộ đọc của lưới (configList) khi khoá đúng hai tầng; còn lại tự quét khối.
function docLaiDanhSach(text, key) {
  const parts = key.split('.');
  if (wr && parts.length === 2) return wr.configList(text, parts[1]);
  const lines = text.split('\n');
  let s = 0; let e = lines.length; let idx = -1;
  for (let d = 0; d < parts.length; d++) {
    const re = new RegExp('^' + ' '.repeat(d * 2) + parts[d] + '\\s*:');
    idx = -1;
    for (let i = s; i < e; i++) if (re.test(lines[i])) { idx = i; break; }
    if (idx < 0) return [];
    s = idx + 1; e = blockEnd(lines, idx, d * 2);
  }
  return lines.slice(s, e).map(l => l.match(/^\s*-\s*(.*)$/)).filter(Boolean).map(m => boNhay(m[1]));
}

function finish(args, cfgPath, newText, added) {
  // Self-check with the SAME resolver the hook uses — never write a config
  // the enforcement layer cannot read back.
  if (args.append) {
    if (!docLaiDanhSach(newText, args.key).includes(args.value)) {
      console.error(`[config-patch] ABORT: đọc lại không thấy "${args.value}" trong ${args.key} — không ghi gì`);
      process.exit(4);
    }
  } else if (core) {
    const resolved = core.resolveConfigKey(newText, args.key);
    if (resolved == null) {
      console.error(`[config-patch] ABORT: spliced text does not resolve "${args.key}" via evidence-core (2-space schema violated?) — nothing written`);
      process.exit(4);
    }
  } else {
    console.error('[config-patch] warning: lib/evidence-core.cjs not found next to scripts/ — resolve self-check skipped');
  }

  console.log('── config-patch plan ──────────────────────────────');
  console.log(`  file: ${cfgPath}`);
  added.forEach(l => console.log('  +', l));
  console.log('───────────────────────────────────────────────────');
  if (args.write) {
    fs.copyFileSync(cfgPath, cfgPath + '.bak');
    fs.writeFileSync(cfgPath, newText, 'utf8');
    console.log(`✔ written · backup: ${path.basename(cfgPath)}.bak`);
  } else {
    console.log('(dry-run) re-run with --write to apply.');
  }
}

main();

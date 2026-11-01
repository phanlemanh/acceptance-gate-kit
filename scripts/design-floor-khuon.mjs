#!/usr/bin/env node
// design-floor-khuon.mjs — lệnh khuôn (hồ sơ khuon-loi, hàng KH1): bọc bộ đọc `ban-do-khuon.cjs` thành các nấc của
// vòng. Kho không có `design/patterns/` → mọi nấc im, thoát 0, không ghi tệp (AC-8).
//
//   --dem                                  S0: «khuôn: N nhóm (M màn · K phần tử)»
//   --tao <nhóm>                           sinh design/patterns/<nhóm>.md từ khối BAN-DO-KHUON-TEMPLATE
//   --nap --slug <s>                       S1: ghim băm từng tệp bản đồ vào _acceptance/<s>/khuon-nap.json + chỉ mục
//   --goi-y-eval --nhom <n>                khối eval khuôn, paths theo đúng nhóm n
//   --kiem [--base <ref>]                  bước chấm (eval S4, chỉ đọc)
//   --kiem --write --slug <s> --den <sha>  sau lượt chấm: ghi _acceptance/<s>/khuon-cham.json
//
// Thoát: 0 · 1 có lệch mới hay bản đồ sai lược đồ · 2 gọi sai.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const HERE = path.dirname(fileURLToPath(import.meta.url));
const B = require('./ban-do-khuon.cjs');
const TEMPLATE = path.join(HERE, '..', 'skills', 'acceptance', 'references', 'ban-do-khuon-template.md');

function git(root, ...a) { return execFileSync('git', ['-C', root, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 64 * 1024 * 1024 }); }
function sai(msg) { process.stderr.write(`design-floor-khuon: ${msg}\n`); process.exit(2); }

// khoiMarker(ten) — nội dung khối ```…``` giữa hai marker trong tệp khuôn.
function khoiMarker(ten) {
  const t = fs.readFileSync(TEMPLATE, 'utf8');
  const m = new RegExp(`<<<${ten} -->\\s*\`\`\`[a-z]*\\n([\\s\\S]*?)\\n\`\`\`\\s*<!-- ${ten}>>>`).exec(t);
  if (!m) throw new Error(`khuôn thiếu khối ${ten}`);
  return m[1];
}

export function dem(bd) {
  const phanTu = bd.nhom.filter(n => n.don_vi === 'phan-tu').length;
  return `khuôn: ${bd.nhom.length} nhóm (${bd.nhom.length - phanTu} màn · ${phanTu} phần tử)`;
}

export function dongChiMuc(n) {
  return [n.nhom, n.doi_tuong || '—', `nhận việc: ${n.nhan_viec || '—'}`, `dùng khi: ${n.dung_khi || '—'}`, n.tep, `màn mẫu: ${n.mau_dang_chay.tep || '—'}`].join(' · ');
}

export function nap(root, slug, bd) {
  const ghim = {};
  const tep = {};
  for (const n of bd.nhom) {
    if (!n.nhom) continue;
    ghim[n.nhom] = git(root, 'hash-object', n.tep).trim();
    tep[n.nhom] = n.tep;
  }
  const dich = path.join(root, '_acceptance', slug, 'khuon-nap.json');
  fs.mkdirSync(path.dirname(dich), { recursive: true });
  fs.writeFileSync(dich, JSON.stringify({ schema: 1, ghim, tep }, null, 2) + '\n');
  return bd.nhom.map(dongChiMuc);
}

export function goiYEval(n) {
  const paths = [n.tep, ...(n.nhan_dien || [])];
  return [
    '  - id: E<số>',
    '    criterion: AC-<số>',
    '    executor: script',
    '    cmd: config:executors.design.khuon',
    `    paths: [${paths.map(p => JSON.stringify(p)).join(', ')}]`,
    `    expected: "exit 0; bước chấm khuôn không in dòng «lệch:» nào cho tệp thuộc nhóm ${n.nhom}"`,
    '    evidence_required: [run_id, exit_code, verifier, verified_at, output]',
  ].join('\n');
}

function docCo(argv) {
  const co = {};
  const BOOL = new Set(['dem', 'nap', 'goi-y-eval', 'kiem', 'write']);
  const GIA = new Set(['root', 'tao', 'slug', 'nhom', 'base', 'den']);
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) sai(`đối số lạ: ${a}`);
    const k = a.slice(2);
    if (BOOL.has(k)) co[k] = true;
    else if (GIA.has(k)) { const v = argv[++i]; if (v == null || v.startsWith('--')) sai(`--${k} thiếu giá trị`); co[k] = v; }
    else sai(`cờ lạ: ${a}`);
  }
  return co;
}

function main() {
  const co = docCo(process.argv.slice(2));
  const root = path.resolve(co.root || '.');
  const nac = ['dem', 'tao', 'nap', 'goi-y-eval', 'kiem'].filter(k => co[k]);
  if (nac.length !== 1) sai('cần đúng một trong --dem · --tao <nhóm> · --nap · --goi-y-eval · --kiem');
  if (co.tao) {
    if (!/^[a-z0-9][a-z0-9-]*$/.test(co.tao)) sai(`tên nhóm không hợp lệ: ${co.tao} (chữ thường, số, gạch nối)`);
    const dich = path.join(root, B.THU_MUC, `${co.tao}.md`);
    if (fs.existsSync(dich)) sai(`đã có ${path.relative(root, dich)} — không ghi đè`);
    fs.mkdirSync(path.dirname(dich), { recursive: true });
    fs.writeFileSync(dich, khoiMarker('BAN-DO-KHUON-TEMPLATE').replaceAll('<nhom>', co.tao) + '\n');
    process.stdout.write(`đã sinh ${path.relative(root, dich)} từ khuôn\n`);
    return 0;
  }
  if (co.nap && !co.slug) sai('--nap cần --slug <hồ sơ>');
  if (co['goi-y-eval'] && !co.nhom) sai('--goi-y-eval cần --nhom <nhóm>');
  if (co.write && !(co.kiem && co.slug && co.den)) sai('--write chỉ đi với --kiem --slug <s> --den <sha>');
  const bd = B.docThuMuc(root);
  if (!bd.co_thu_muc) return 0;
  if (co.dem) { process.stdout.write(dem(bd) + '\n'); return 0; }
  if (co.nap) { process.stdout.write(nap(root, co.slug, bd).join('\n') + '\n'); return 0; }
  if (co['goi-y-eval']) {
    const n = bd.nhom.find(x => x.nhom === co.nhom);
    if (!n) sai(`không có nhóm ${co.nhom} (có: ${bd.nhom.map(x => x.nhom).join(', ')})`);
    process.stdout.write(goiYEval(n) + '\n');
    return 0;
  }
  sai('--kiem chưa có');
  return 2;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exit(main());

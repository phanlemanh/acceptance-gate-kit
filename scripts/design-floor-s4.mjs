#!/usr/bin/env node
// design-floor-s4.mjs — S4 của feature-loop chấm tuân thủ design system bằng hex thô và độ phủ token, chặn theo bậc.
// Hồ sơ design-floor-moc-s3-s4 (FL5), thiết kế docs/superpowers/specs/2026-10-28-design-floor-moc-s3-s4-design.md.
// CHỈ ĐỌC: không ghi tệp nào (luật không ghi sau S4, ADR 0007). Kho nối lệnh thành executors.design.floor.
//
// Đích = tệp mà diff <base>...HEAD chạm, khớp design.surface_globs, còn trên đĩa.
//   Hex thô  — luật đã phân xử duy nhất ở v1: `#` + đúng 3/4/6/8 chữ số hex, không đứng sau `&` hay chữ/số, không có
//              chữ/số liền sau; tệp design_floor.tokens được loại.
//   Độ phủ token — M2/M3, đích .html/.htm: `token-coverage` theo argv khối máy của design-floor/HOP-DONG-NHAP.md.
// Chặn theo bậc: bảng DF-CHAN-THEO-BAC trong contract.md của hồ sơ — M1 hex thô; M2 hex thô, độ phủ token chỉ cảnh báo;
// M3 cả hai. Không đo được không bao giờ chặn; mã lạ của lệnh ui → «lệnh ui lỗi», thoát 1.
//
//   node scripts/design-floor-s4.mjs --root . [--base <ref>] [--json]   0 không chặn · 2 chặn · 1 lệnh ui lỗi
// Biến môi trường (bộ đo): DESIGN_FLOOR_UI (bản gói).
import { existsSync, readFileSync, realpathSync } from 'node:fs';
import { execFileSync, spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { docBac } from './design-floor-bac.mjs';

const require = createRequire(import.meta.url);
const { pathGlobToRe, resolveConfigList } = require('../lib/evidence-core.cjs');

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const HOP_DONG = path.join(KIT, 'design-floor', 'HOP-DONG-NHAP.md');
export const RE_HEX = /(?<![&\w])#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{4}|[0-9a-fA-F]{3})(?!\w)/g;
const LA_HTML = (f) => /\.html?$/i.test(f);

export function khoiMay(duong, ten) {
  const md = readFileSync(duong, 'utf8');
  const a = md.indexOf(`<!-- <<<${ten} -->`);
  const b = md.indexOf(`<!-- ${ten}>>> -->`);
  const m = a >= 0 && b > a ? /```json\n([\s\S]*?)\n```/.exec(md.slice(a, b)) : null;
  if (!m) throw new Error(`${duong}: thiếu khối máy ${ten}`);
  return JSON.parse(m[1]);
}

const git = (root, ...a) => execFileSync('git', a, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 64 * 1024 * 1024 });

// Điểm rẽ khỏi nhánh chính — cùng thứ tự dò với s4-args (remote trước, rồi nhánh cục bộ).
export function timBase(root) {
  for (const ref of ['origin/main', 'origin/master', 'main', 'master']) {
    try {
      return git(root, 'merge-base', 'HEAD', ref).trim();
    } catch {
      /* thử ref kế */
    }
  }
  throw new Error('không tìm được nhánh chính để so diff — truyền --base <ref>');
}

// Tệp giao diện mà vòng chạm: diff <base>...HEAD ∩ design.surface_globs, còn trên đĩa.
export function dichGiaoDien(root, base) {
  const cfgP = path.join(root, '_acceptance', 'config.yaml');
  const cfg = existsSync(cfgP) ? readFileSync(cfgP, 'utf8') : '';
  const res = resolveConfigList(cfg, 'design.surface_globs').filter(Boolean).map(pathGlobToRe);
  const doi = git(root, 'diff', '--name-only', '-z', `${base}...HEAD`).split('\0').filter(Boolean);
  return doi.filter((f) => res.some((r) => r.test(f)) && existsSync(path.join(root, f)));
}

// Một lệnh `ui` theo argv mẫu của hợp đồng nhập → mã thoát.
export function goiUi(hd, lenh, gia, root, khoaArgv = 'argv') {
  const argv = hd.lenh[lenh][khoaArgv].map((a) => a.replace(/^\{(\w+)\}$/, (_, k) => gia[k]));
  const ui = process.env.DESIGN_FLOOR_UI || path.join(KIT, 'design-floor', 'dist', 'ui.mjs');
  const r = spawnSync(process.execPath, [ui, ...argv], { cwd: root, encoding: 'utf8', env: { ...process.env, ...(hd.moi_truong || {}) } });
  return r.status;
}

export function chayS4(root, base) {
  const bac = docBac(root);
  const ra = { bac: bac.bac, dong: [], ma: 0 };
  if (bac.bac === 'M0') return ra;
  const dich = dichGiaoDien(root, base || timBase(root));
  const tokens = bac.tokens ? path.normalize(bac.tokens) : null;
  let chan = false;
  let loi = false;

  for (const f of dich) {
    if (tokens && path.normalize(f) === tokens) continue;
    readFileSync(path.join(root, f), 'utf8').split('\n').forEach((dong, i) => {
      for (const m of dong.matchAll(RE_HEX)) {
        ra.dong.push(`design-floor S4: hex thô ${f}:${i + 1} ${m[0]}`);
        chan = true;
      }
    });
  }

  if (bac.bac === 'M2' || bac.bac === 'M3') {
    const hd = khoiMay(HOP_DONG, 'DESIGN-FLOOR-HOP-DONG');
    for (const f of dich.filter(LA_HTML)) {
      const ma = goiUi(hd, 'token-coverage', { dich: path.join(root, f), tokens: path.resolve(root, bac.tokens) }, root);
      if (ma === 0) ra.dong.push(`design-floor S4: độ phủ token đạt — ${f}`);
      else if (ma === 2 && bac.bac === 'M3') {
        ra.dong.push(`design-floor S4: độ phủ token trượt — ${f}`);
        chan = true;
      } else if (ma === 2) ra.dong.push(`design-floor S4: cảnh báo — độ phủ token trượt — ${f}`);
      else if (ma === 3 || ma === 4 || ma === 5) ra.dong.push(`design-floor S4: không đo được ở đây (mã ${ma}) — ${f}`);
      else {
        ra.dong.push(`design-floor S4: lệnh ui lỗi (mã ${ma}) — ${f}`);
        loi = true;
      }
    }
  }
  ra.ma = loi ? 1 : chan ? 2 : 0;
  return ra;
}

function main(argv) {
  let root = null;
  let base = null;
  let json = false;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--root') root = argv[++i];
    else if (argv[i] === '--base') base = argv[++i];
    else if (argv[i] === '--json') json = true;
    else {
      process.stderr.write(`design-floor-s4: đối số lạ ${argv[i]} — dùng: --root <gốc kho> [--base <ref>] [--json]\n`);
      return 2;
    }
  }
  if (!root) {
    process.stderr.write('design-floor-s4: thiếu --root <gốc kho>\n');
    return 2;
  }
  let ra;
  try {
    ra = chayS4(path.resolve(root), base);
  } catch (e) {
    process.stderr.write(`design-floor-s4: ${e.message}\n`);
    return 1;
  }
  if (json) process.stdout.write(`${JSON.stringify(ra)}\n`);
  else for (const d of ra.dong) process.stdout.write(`${d}\n`);
  return ra.ma;
}

// So bằng đường thật: /var và /private/var trên macOS, hay một liên kết tới tệp, vẫn là chính lệnh này.
if (process.argv[1] && realpathSync(path.resolve(process.argv[1])) === realpathSync(fileURLToPath(import.meta.url))) process.exitCode = main(process.argv.slice(2));

#!/usr/bin/env node
// design-floor-s3.mjs — cuối S3 của feature-loop: autofix trang HTML mà vòng chạm, chạy các lệnh sinh lại tệp dẫn xuất
// kho đã khai, rồi commit TRONG S3 — trước khi hợp đồng sang implemented (luật không ghi sau S4, ADR 0007). Hồ sơ
// design-floor-moc-s3-s4 (FL5), thiết kế docs/superpowers/specs/2026-10-28-design-floor-moc-s3-s4-design.md.
//
//   M0 → không in, không ghi. M1–M3:
//   1. chụp trạng thái cây (tệp đã sửa và tệp chưa theo dõi) — việc dở có sẵn không bị đụng, không vào commit máy;
//      chỉ khi một đích autofix đã sửa chưa commit từ trước → thoát 2 gọi tên tệp, không chạy gì;
//   2. `autofix` theo argv_ghi của khối máy design-floor/HOP-DONG-NHAP.md trên từng trang .html/.htm của diff
//      ∩ design.surface_globs;
//   3. các lệnh `design_floor.sinh_lai` chạy tuần tự ở gốc kho — một lệnh thoát khác 0 → thoát 1 gọi tên lệnh, không commit;
//   4. MỘT commit chỉ gồm tệp mà chính lệnh làm đổi hay tạo (so với ảnh chụp ở bước 1), ngoài `_acceptance/`.
//
//   node scripts/design-floor-s3.mjs --root . --slug <slug> [--base <ref>]   0 xong · 1 autofix/sinh lại lỗi · 2 gọi sai / đích bẩn
// Biến môi trường (bộ đo): DESIGN_FLOOR_UI (bản gói).
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, realpathSync } from 'node:fs';
import { execFileSync, spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { docBac } from './design-floor-bac.mjs';
import { dichGiaoDien, goiUi, khoiMay, timBase } from './design-floor-s4.mjs';

const require = createRequire(import.meta.url);
const { resolveConfigList } = require('../lib/evidence-core.cjs');

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const HOP_DONG = path.join(KIT, 'design-floor', 'HOP-DONG-NHAP.md');

const git = (root, ...a) => execFileSync('git', a, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 64 * 1024 * 1024 });
const bamTep = (p) => (existsSync(p) ? createHash('sha256').update(readFileSync(p)).digest('hex') : null);

// Ảnh chụp cây bẩn: { đường → băm nội dung } cho mọi tệp sửa/chưa theo dõi (git status -z, tên thật không trích dẫn).
function chupCay(root) {
  const anh = new Map();
  const ra = git(root, 'status', '--porcelain', '-z', '--untracked-files=all').split('\0');
  for (let i = 0; i < ra.length; i++) {
    const m = ra[i];
    if (!m) continue;
    const f = m.slice(3);
    if (m[0] === 'R' || m[0] === 'C') i++; // dạng đổi tên mang thêm một trường đường cũ
    anh.set(f, bamTep(path.join(root, f)));
  }
  return anh;
}

export function chayS3(root, slug, base) {
  const bac = docBac(root);
  const ra = { bac: bac.bac, dong: [], loi: null, ma: 0, commit: null };
  if (bac.bac === 'M0') return ra;
  const truoc = chupCay(root);
  const dich = dichGiaoDien(root, base || timBase(root)).filter((f) => /\.html?$/i.test(f));
  const ban = dich.filter((f) => truoc.has(f));
  if (ban.length) {
    ra.loi = `đích autofix đang sửa chưa commit: ${ban.join(', ')} — commit hay hoàn lại trước khi chạy`;
    ra.ma = 2;
    return ra;
  }

  const hd = khoiMay(HOP_DONG, 'DESIGN-FLOOR-HOP-DONG');
  let nSua = 0;
  for (const f of dich) {
    const p = path.join(root, f);
    const cu = bamTep(p);
    const ma = goiUi(hd, 'autofix', { dich: p }, root, 'argv_ghi');
    if (ma !== 0) {
      ra.loi = `autofix thoát ${ma} — ${f}`;
      ra.ma = 1;
      return ra;
    }
    if (bamTep(p) !== cu) nSua++;
  }

  const cfgP = path.join(root, '_acceptance', 'config.yaml');
  const lenh = resolveConfigList(existsSync(cfgP) ? readFileSync(cfgP, 'utf8') : '', 'design_floor.sinh_lai').filter(Boolean);
  for (const l of lenh) {
    const r = spawnSync('sh', ['-c', l], { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
    if (r.status !== 0) {
      ra.loi = `lệnh sinh lại thoát ${r.status} — ${l}`;
      ra.ma = 1;
      return ra;
    }
  }
  if (!lenh.length) ra.dong.push('design-floor S3: chưa khai lệnh sinh lại (design_floor.sinh_lai)');

  const sau = chupCay(root);
  const doi = [...sau].filter(([f, b]) => !f.startsWith('_acceptance/') && (!truoc.has(f) || truoc.get(f) !== b)).map(([f]) => f);
  if (!doi.length) {
    ra.dong.push(`design-floor S3: autofix ${dich.length} trang, sinh lại ${lenh.length} lệnh — không tệp nào đổi, không commit`);
    return ra;
  }
  git(root, 'add', '--', ...doi);
  git(root, 'commit', '-q', '-m', `design-floor S3: autofix ${nSua} tệp, sinh lại ${lenh.length} lệnh — ${slug}`, '--', ...doi);
  ra.commit = git(root, 'rev-parse', '--short', 'HEAD').trim();
  ra.dong.push(`design-floor S3: autofix ${nSua} tệp, sinh lại ${lenh.length} lệnh — commit ${ra.commit} (${doi.length} tệp)`);
  return ra;
}

function main(argv) {
  let root = null;
  let slug = null;
  let base = null;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--root') root = argv[++i];
    else if (argv[i] === '--slug') slug = argv[++i];
    else if (argv[i] === '--base') base = argv[++i];
    else {
      process.stderr.write(`design-floor-s3: đối số lạ ${argv[i]} — dùng: --root <gốc kho> --slug <hồ sơ> [--base <ref>]\n`);
      return 2;
    }
  }
  if (!root || !slug || !/^[a-z0-9][a-z0-9-]*$/.test(slug)) {
    process.stderr.write('design-floor-s3: cần --root <gốc kho> --slug <hồ sơ>\n');
    return 2;
  }
  root = path.resolve(root);
  if (!existsSync(path.join(root, '_acceptance', slug))) {
    process.stderr.write(`design-floor-s3: không có hồ sơ _acceptance/${slug}\n`);
    return 2;
  }
  let ra;
  try {
    ra = chayS3(root, slug, base);
  } catch (e) {
    process.stderr.write(`design-floor-s3: ${e.message}\n`);
    return 1;
  }
  for (const d of ra.dong) process.stdout.write(`${d}\n`);
  if (ra.loi) process.stderr.write(`design-floor-s3: ${ra.loi}\n`);
  return ra.ma;
}

// So bằng đường thật: /var và /private/var trên macOS, hay một liên kết tới tệp, vẫn là chính lệnh này.
if (process.argv[1] && realpathSync(path.resolve(process.argv[1])) === realpathSync(fileURLToPath(import.meta.url))) process.exitCode = main(process.argv.slice(2));

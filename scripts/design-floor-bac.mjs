#!/usr/bin/env node
// design-floor-bac.mjs — S0 của feature-loop đọc bậc design-floor của kho (M0–M3). Hồ sơ design-floor-moc-s0-s1 (FL4),
// thiết kế docs/superpowers/specs/2026-10-27-design-floor-moc-s0-s1-design.md. CHỈ ĐỌC: không ghi tệp nào.
//
// Bậc đi theo khai báo của kho trong _acceptance/config.yaml, xét từ cao xuống; khai báo hỏng không nâng bậc:
//   M3  design_floor.niem_phong khác rỗng, trên nền M2 (người ghi — lệnh này không có đường ghi)
//   M2  design_floor.tokens VÀ design_floor.registry cùng khai, cả hai tệp có thật
//   M1  design.surface_globs khớp ít nhất một tệp git theo dõi
//   M0  còn lại — không in gì
// M1–M3 mà kho chưa nối executors.design.floor (lệnh S4 của hồ sơ design-floor-moc-s3-s4) → thêm một dòng stderr nói S4
// chưa chấm tuân thủ design system; stdout giữ đúng một dòng bậc.
//
//   node scripts/design-floor-bac.mjs --root . [--json]   0 đọc được (kể cả M0) · 2 gọi sai
import { existsSync, readFileSync, realpathSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
// MỘT bộ đọc config.yaml của kit (lib/evidence-core.cjs) — cùng bộ mà lưới tier-mismatch S4 và gate-card dùng, để hai
// bên không thể đọc design.surface_globs khác nhau (dòng chú thích sát lề, thụt lề lạ…).
const { pathGlobToRe, resolveConfigKey, resolveConfigList } = require('../lib/evidence-core.cjs');

export function docBac(root) {
  const p = path.join(root, '_acceptance', 'config.yaml');
  const cfg = existsSync(p) ? readFileSync(p, 'utf8') : '';
  const tokens = resolveConfigKey(cfg, 'design_floor.tokens');
  const registry = resolveConfigKey(cfg, 'design_floor.registry');
  const niemPhong = resolveConfigKey(cfg, 'design_floor.niem_phong');
  const globs = resolveConfigList(cfg, 'design.surface_globs').filter(Boolean);
  const floor = resolveConfigKey(cfg, 'executors.design.floor');
  const coTep = (rel) => !!rel && existsSync(path.resolve(root, rel));

  let dsTep = [];
  if (globs.length) {
    try {
      dsTep = execFileSync('git', ['ls-files'], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).split('\n').filter(Boolean);
    } catch {
      dsTep = [];
    }
  }
  const res = globs.map(pathGlobToRe);
  const khop = dsTep.filter((f) => res.some((r) => r.test(f)));
  const ra = { bac: 'M0', ly_do: '', tokens, registry, niem_phong: niemPhong, floor };

  if (!globs.length) ra.ly_do = 'chưa khai design.surface_globs';
  else if (!khop.length) ra.ly_do = `design.surface_globs không khớp tệp nào (${globs.join(', ')})`;
  else {
    ra.bac = 'M1';
    const thieu = [];
    if (!tokens) thieu.push('design_floor.tokens chưa khai');
    else if (!coTep(tokens)) thieu.push(`design_floor.tokens trỏ tệp không có: ${tokens}`);
    if (!registry) thieu.push('design_floor.registry chưa khai');
    else if (!coTep(registry)) thieu.push(`design_floor.registry trỏ tệp không có: ${registry}`);
    if (thieu.length) {
      ra.ly_do = `có giao diện (${khop.length} tệp khớp design.surface_globs), chưa khai nguồn — ${thieu.join('; ')}`;
      if (niemPhong) ra.ly_do += '; design_floor.niem_phong bỏ qua vì chưa đủ nguồn';
    } else if (niemPhong) {
      ra.bac = 'M3';
      ra.ly_do = `đã niêm phong ${niemPhong} — nguồn ${tokens} · ${registry}`;
    } else {
      ra.bac = 'M2';
      ra.ly_do = `nguồn ${tokens} · ${registry}`;
    }
  }
  return ra;
}

function main(argv) {
  let root = null;
  let json = false;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--root') root = argv[++i];
    else if (argv[i] === '--json') json = true;
    else {
      process.stderr.write(`design-floor-bac: đối số lạ ${argv[i]} — dùng: --root <gốc kho> [--json]\n`);
      return 2;
    }
  }
  if (!root) {
    process.stderr.write('design-floor-bac: thiếu --root <gốc kho>\n');
    return 2;
  }
  const r = docBac(path.resolve(root));
  if (json) process.stdout.write(`${JSON.stringify(r)}\n`);
  else if (r.bac !== 'M0') {
    process.stdout.write(`design-floor: bậc ${r.bac} — ${r.ly_do}\n`);
    if (!r.floor) process.stderr.write('design-floor: S4 chưa chấm tuân thủ design system — chưa khai executors.design.floor\n');
  }
  return 0;
}

// So bằng đường thật: /var và /private/var trên macOS, hay một liên kết tới tệp, vẫn là chính lệnh này.
if (process.argv[1] && realpathSync(path.resolve(process.argv[1])) === realpathSync(fileURLToPath(import.meta.url))) process.exitCode = main(process.argv.slice(2));

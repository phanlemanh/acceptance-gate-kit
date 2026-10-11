#!/usr/bin/env node
// Chiều im của hồ sơ dieu-phoi-feature-loop-trong-dot (AC-9, E9): ngoài khối TRONG-DOT và trong-dot.mjs, DP7
// không đổi byte nào của feature-loop mà kho không đợt đọc tới. So với merge-base của HEAD và origin/main
// (vắng origin/main → main) của cây chứa tệp này. Mỗi phép so có chiều đỏ trên cùng bản SKILL: đổi một chữ
// trong GOAL-TEMPLATE → hàm so phải nêu «GOAL-TEMPLATE».
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const TEP_SKILL = 'feature-loop/skills/feature-loop/SKILL.md';
const git = (...a) => execFileSync('git', a, { cwd: KIT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });

function timBase() {
  for (const nhanh of ['origin/main', 'main']) {
    try {
      return git('merge-base', 'HEAD', nhanh).trim();
    } catch {
      // thử nhánh kế
    }
  }
  throw new Error('không tìm được merge-base với origin/main hay main');
}

// Mọi khối marker `<!-- <<<X -->…<!-- X>>> -->` của một bản SKILL, theo tên.
export function cacKhoi(t) {
  const ra = new Map();
  for (const m of t.matchAll(/<!-- <<<([A-Z0-9-]+) -->([\s\S]*?)<!-- \1>>> -->/g)) ra.set(m[1], m[2]);
  return ra;
}

// Khối nào (ngoài TRONG-DOT) của bản mới khác bản base, hoặc vắng ở bản mới.
export function khoiLech(base, moi) {
  const b = cacKhoi(base);
  const m = cacKhoi(moi);
  return { soSo: [...b.keys()].filter((k) => k !== 'TRONG-DOT').length, lech: [...b.keys()].filter((k) => k !== 'TRONG-DOT' && m.get(k) !== b.get(k)) };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === fs.realpathSync(process.argv[1])) {
  const base = timBase();
  const ketQua = [];
  const ghi = (ok, ten, chiTiet) => ketQua.push(`${ok ? 'PASS' : 'FAIL'}: ${ten}${chiTiet ? ` — ${chiTiet}` : ''}`);

  const skillBase = git('show', `${base}:${TEP_SKILL}`);
  const skillMoi = fs.readFileSync(path.join(KIT, TEP_SKILL), 'utf8');
  const { soSo, lech } = khoiLech(skillBase, skillMoi);
  ghi(lech.length === 0 && soSo > 0, 'DP7-09 khoi-khac', `so ${soSo} khối với base ${base.slice(0, 12)}${lech.length ? `; lệch: ${lech.join(', ')}` : ''}`);

  const doi = git('diff', '--name-only', base, '--', 'feature-loop/scripts', 'feature-loop/workflows').split('\n').filter(Boolean);
  const la = doi.filter((f) => f !== 'feature-loop/scripts/trong-dot.mjs');
  ghi(la.length === 0, 'DP7-09 script-khac', `đổi: ${doi.join(', ') || '(không)'}`);

  const hookDoi = git('diff', '--name-only', base, '--', 'dieu-phoi/hooks/hooks.json').trim();
  ghi(hookDoi === '', 'DP7-09 hook', hookDoi ? `đổi ${hookDoi}` : 'hooks.json byte-bằng base');

  const tiem = skillMoi.replace(/(<!-- <<<GOAL-TEMPLATE -->[\s\S]*?)HOÀN THÀNH/, '$1HOAN THANH');
  const do_ = tiem !== skillMoi ? khoiLech(skillBase, tiem).lech : [];
  ghi(do_.includes('GOAL-TEMPLATE'), 'DP7-09-do khoi', `bản tiêm đổi GOAL-TEMPLATE → lệch: ${do_.join(', ') || '(không — bước tiêm không áp)'}`);

  for (const d of ketQua) console.log(d);
  process.exit(ketQua.some((d) => d.startsWith('FAIL')) ? 1 : 0);
}

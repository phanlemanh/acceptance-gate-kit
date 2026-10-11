#!/usr/bin/env node
// Chiều im của hồ sơ dieu-phoi-feature-loop-trong-dot (AC-9, E9): ngoài khối TRONG-DOT và trong-dot.mjs, DP7
// không đổi byte nào của feature-loop mà kho không đợt đọc tới. Đã gộp: so hai cha của commit gộp PR #306 — tập thay đổi
// của chính hồ sơ, không dời theo các vòng sau (hồ sơ dieu-phoi-doi-tai-khoan, dòng sổ revisit; cùng khuôn DP7-10).
// Chưa gộp: merge-base của HEAD và origin/main (vắng → main) với cây chứa tệp này. Mỗi phép so có chiều đỏ trên cùng
// bản SKILL: đổi một chữ trong GOAL-TEMPLATE → hàm so phải nêu «GOAL-TEMPLATE».
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const TEP_SKILL = 'feature-loop/skills/feature-loop/SKILL.md';
const git = (...a) => execFileSync('git', a, { cwd: KIT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });

const SO_PR = 306;

// Mốc so: { base, moi, nguon } — `moi` null = cây làm việc. Commit gộp tìm bằng lệnh theo tiêu đề, không gõ sha.
export function timMoc(goc = KIT, soPr = SO_PR) {
  const g = (...a) => execFileSync('git', a, { cwd: goc, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  let sha = '';
  try {
    sha = g('log', '--merges', '--format=%H', `--grep=^Merge pull request #${soPr} `, 'HEAD').trim().split('\n')[0];
  } catch {
    sha = '';
  }
  if (sha) return { base: `${sha}^1`, moi: `${sha}^2`, nguon: `PR #${soPr} ${sha.slice(0, 8)}` };
  for (const nhanh of ['origin/main', 'main']) {
    try {
      const mb = g('merge-base', 'HEAD', nhanh).trim();
      return { base: mb, moi: null, nguon: `merge-base ${mb.slice(0, 12)}` };
    } catch {
      // thử nhánh kế
    }
  }
  throw new Error('không tìm được commit gộp PR hay merge-base với origin/main hay main');
}

const doiGiua = (goc, { base, moi }, ...duong) => execFileSync('git', ['diff', '--name-only', base, ...(moi ? [moi] : []), '--', ...duong], { cwd: goc, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).split('\n').filter(Boolean);

// Kho thử: hooks.json trên nhánh chính; PR #306 gộp vào (sửa hoặc không sửa hooks.json), rồi một vòng sau sửa nó.
function khoPrThu(prSua) {
  const kho = fs.mkdtempSync(path.join(os.tmpdir(), 'dp7-moc-'));
  const g = (...a) => execFileSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@t', ...a], { cwd: kho, stdio: 'ignore' });
  const ghi = (rel, nd) => { fs.mkdirSync(path.dirname(path.join(kho, rel)), { recursive: true }); fs.writeFileSync(path.join(kho, rel), nd); };
  g('init', '-q', '-b', 'main');
  ghi('dieu-phoi/hooks/hooks.json', '{}\n');
  g('add', '-A'); g('commit', '-q', '-m', 'goc');
  g('checkout', '-q', '-b', 'pr');
  ghi(prSua ? 'dieu-phoi/hooks/hooks.json' : 'khac.txt', '{"pr":1}\n');
  g('add', '-A'); g('commit', '-q', '-m', 'pr');
  g('checkout', '-q', 'main');
  g('merge', '-q', '--no-ff', '-m', `Merge pull request #${SO_PR} from x/pr`, 'pr');
  ghi('dieu-phoi/hooks/hooks.json', '{"vong_sau":1}\n');
  g('add', '-A'); g('commit', '-q', '-m', 'vong sau sua hooks.json');
  return kho;
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
  const moc = timMoc();
  const { base } = moc;
  const ketQua = [];
  const ghi = (ok, ten, chiTiet) => ketQua.push(`${ok ? 'PASS' : 'FAIL'}: ${ten}${chiTiet ? ` — ${chiTiet}` : ''}`);

  const skillBase = git('show', `${base}:${TEP_SKILL}`);
  const skillMoi = moc.moi ? git('show', `${moc.moi}:${TEP_SKILL}`) : fs.readFileSync(path.join(KIT, TEP_SKILL), 'utf8');
  const { soSo, lech } = khoiLech(skillBase, skillMoi);
  ghi(lech.length === 0 && soSo > 0, 'DP7-09 khoi-khac', `so ${soSo} khối, mốc ${moc.nguon}${lech.length ? `; lệch: ${lech.join(', ')}` : ''}`);

  const doi = doiGiua(KIT, moc, 'feature-loop/scripts', 'feature-loop/workflows');
  const la = doi.filter((f) => f !== 'feature-loop/scripts/trong-dot.mjs');
  ghi(la.length === 0, 'DP7-09 script-khac', `đổi: ${doi.join(', ') || '(không)'}`);

  const hookDoi = doiGiua(KIT, moc, 'dieu-phoi/hooks/hooks.json').join(', ');
  ghi(hookDoi === '', 'DP7-09 hook', hookDoi ? `đổi ${hookDoi}` : 'hooks.json byte-bằng base');

  // Chiều đỏ của mốc: PR sửa hooks.json → nêu tệp; PR không sửa, vòng sau sửa → im (đối chứng dương).
  const doMoc = [true, false].map((prSua) => {
    const kho = khoPrThu(prSua);
    try {
      return doiGiua(kho, timMoc(kho), 'dieu-phoi/hooks/hooks.json');
    } finally {
      fs.rmSync(kho, { recursive: true, force: true });
    }
  });
  ghi(doMoc[0].includes('dieu-phoi/hooks/hooks.json') && doMoc[1].length === 0, 'DP7-09-do moc-pr', `PR sửa → [${doMoc[0].join(', ')}] · PR không sửa, vòng sau sửa → [${doMoc[1].join(', ')}]`);

  const tiem = skillMoi.replace(/(<!-- <<<GOAL-TEMPLATE -->[\s\S]*?)HOÀN THÀNH/, '$1HOAN THANH');
  const do_ = tiem !== skillMoi ? khoiLech(skillBase, tiem).lech : [];
  ghi(do_.includes('GOAL-TEMPLATE'), 'DP7-09-do khoi', `bản tiêm đổi GOAL-TEMPLATE → lệch: ${do_.join(', ') || '(không — bước tiêm không áp)'}`);

  for (const d of ketQua) console.log(d);
  process.exit(ketQua.some((d) => d.startsWith('FAIL')) ? 1 : 0);
}

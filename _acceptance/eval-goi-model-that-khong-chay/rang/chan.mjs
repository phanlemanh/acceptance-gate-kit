#!/usr/bin/env node
// chan.mjs --ac <n> — một chân của bộ răng hồ sơ eval-goi-model-that-khong-chay (evals.yaml E<n>).
//   (1) chiều xanh: chạy ĐÚNG danh sách ca bền của AC trong ma-tran.mjs trên CÂY ĐANG KIỂM; mọi ca phải in
//       «PASS: [id]»; ca thiếu hoặc rút rỗng là ĐỎ «số ô lệch». AC có phép đo riêng (vi-phan, doc-cu,
//       pham-vi) thì chạy thêm nó, thoát khác 0 là ĐỎ.
//   (2) chiều đỏ: mỗi phép phá áp vào bản sao `git archive SAU-G3`; chỉ tính «đã bắt» khi bản sao CHẠY TỚI
//       ca (dòng «… [id]» — dấu dương) VÀ khối FAIL của ca chứa thông điệp ghim. Phép phá không khớp đúng
//       một lần là ĐỎ «phép phá không áp được».
import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { MA_TRAN } from './ma-tran.mjs';
import { ROOT, sauG3, banSao, baseG3, THU_MUC_CAY } from './ban-sao.mjs';

const i = process.argv.indexOf('--ac');
const ac = i >= 0 ? Number(process.argv[i + 1]) : NaN;
const M = MA_TRAN[ac];
if (!M) { console.error(`chan.mjs: dùng --ac <${Object.keys(MA_TRAN).join('|')}>`); process.exit(3); }
const loi = [];
const ghi = (s) => console.log(s);
const chayNode = (file, env = {}) => spawnSync(process.execPath, [file], { cwd: ROOT, encoding: 'utf8', env: { ...process.env, ...env }, maxBuffer: 256 * 1024 * 1024, timeout: 1200000 });
function apPha(goc, pha) {
  const p = path.join(goc, pha.tep);
  let s = readFileSync(p, 'utf8');
  for (const [tim, thay] of pha.doi) {
    const n = s.split(tim).length - 1;
    if (n !== 1) throw new Error(`phép phá không áp được: «${tim.slice(0, 60)}» khớp ${n} lần trong ${pha.tep}`);
    s = s.replace(tim, thay);
  }
  writeFileSync(p, s);
}

try { baseG3(); } catch (e) { loi.push(`mốc: ${e.message}`); }

// ── (1) chiều xanh ──────────────────────────────────────────────────────────
for (const n of M.nhom) {
  if (!n.ca.length) { loi.push(`số ô lệch: rút rỗng danh sách ca của ${n.tep}`); continue; }
  const r = chayNode(path.join(ROOT, n.tep), { GG_CASES: n.ca.join(',') });
  const pass = new Set([...r.stdout.matchAll(/^PASS: \[([\w-]+)\]/gm)].map(m => m[1]));
  const fail = [...r.stdout.matchAll(/^FAIL: \[([\w-]+)\]/gm)].map(m => m[1]);
  ghi(r.stdout.split('\n').filter(l => /^(PASS|FAIL):|^\s{4}/.test(l)).join('\n'));
  const thieu = n.ca.filter(c => !pass.has(c));
  if (fail.length || thieu.length || r.status !== 0) loi.push(`chiều xanh ${path.basename(n.tep)}: ca đỏ ${fail.join(', ') || '—'} · thiếu ${thieu.join(', ') || '—'} (mã ${r.status})${r.stderr ? `\n${r.stderr.split('\n').slice(-5).join('\n')}` : ''}`);
  if (pass.size !== n.ca.length) loi.push(`số ô lệch: ${pass.size} ca PASS, ma trận viết trước ${n.ca.length} (${path.basename(n.tep)})`);
}
if (M.rieng) {
  const r = chayNode(path.join(ROOT, '_acceptance', 'eval-goi-model-that-khong-chay', 'rang', M.rieng));
  ghi(`${r.stdout}${r.stderr}`.trim());
  if (r.status !== 0) loi.push(`chiều xanh: ${M.rieng} thoát ${r.status}`);
}

// ── (2) chiều đỏ ────────────────────────────────────────────────────────────
let sau = null;
if (M.pha.length) { try { sau = sauG3(); } catch (e) { loi.push(e.message); } }
// Đối chứng dương trên CHÍNH bản sao SAU-G3 nguyên vẹn (lượt 3, Ngoài-19): ca của mỗi phép phá phải PASS ở bản
// không phá — không thì «đỏ khi phá» không phân biệt được với bản sao/môi trường hỏng sẵn.
const xanhGoc = new Map();
function doiChungDuong(pha) {
  const k = `${pha.tepCa}#${pha.ca}`;
  if (!xanhGoc.has(k)) {
    const g = banSao(sau, THU_MUC_CAY);
    const r = chayNode(path.join(g, pha.tepCa), { GG_CASES: pha.ca });
    xanhGoc.set(k, r.stdout.includes(`PASS: [${pha.ca}]`));
  }
  return xanhGoc.get(k);
}
for (const pha of sau ? M.pha : []) {
  let goc;
  try { if (!doiChungDuong(pha)) { loi.push(`${pha.ten}: đối chứng dương đỏ — ca ${pha.ca} không PASS trên bản sao SAU-G3 nguyên vẹn`); continue; } goc = banSao(sau, THU_MUC_CAY); apPha(goc, pha); } catch (e) { loi.push(`${pha.ten}: ${e.message}`); continue; }
  const r = chayNode(path.join(goc, pha.tepCa), { GG_CASES: pha.ca });
  const chay = r.stdout.includes(`… [${pha.ca}]`);
  const khoiFail = (r.stdout.match(new RegExp(`^FAIL: \\[${pha.ca}\\][\\s\\S]*?(?=^(PASS|FAIL|Results))`, 'm')) || [''])[0];
  const thay = khoiFail.includes(pha.ghim);
  const nhan = `[bản sao ${sau.slice(0, 7)} chạy tới ca: ${chay ? 'có' : 'KHÔNG'} · thấy ghim «${pha.ghim}»: ${thay ? 'có' : 'KHÔNG'}]`;
  if (chay && thay) ghi(`ĐỎ đúng: ${pha.ten} — ${nhan}`);
  else { loi.push(`${pha.ten}: phép phá không bị bắt ${nhan}`); ghi(`${r.stdout}\n${r.stderr}`.split('\n').slice(-25).join('\n')); }
}

if (loi.length) { console.log(`\nAC-${ac}: ĐỎ\n  - ${loi.join('\n  - ')}`); process.exit(1); }
console.log(`\nAC-${ac}: XANH — chiều xanh đủ${M.rieng ? ` (kèm ${M.rieng})` : ''}, ${M.pha.length} phép phá đều bị bắt đúng thông điệp ghim`);

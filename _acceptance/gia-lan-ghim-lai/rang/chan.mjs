#!/usr/bin/env node
// chan.mjs --ac <n> — một chân của bộ răng hồ sơ gia-lan-ghim-lai (evals.yaml E<n>).
//   (1) chiều xanh: chạy ĐÚNG danh sách ca bền của AC trong rang/ma-tran.mjs trên CÂY ĐANG KIỂM; mọi ca
//       phải in «PASS: [id]»; ca thiếu hoặc thừa là ĐỎ «số ô lệch».
//   (2) chiều đỏ: mỗi phép phá áp vào bản sao `git archive SAU-GIA`; chỉ tính «đã bắt» khi bản sao
//       CHẠY TỚI ca (dòng «… [id]» — dấu dương) VÀ ca FAIL với thông điệp ghim. Phép phá không khớp
//       đúng một lần là ĐỎ «phép phá không áp được».
// AC-7 và AC-8 có thước riêng (vi-phan.mjs, so-do.mjs); chân này gọi chúng rồi chạy phép phá như trên.
import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { MA_TRAN } from './ma-tran.mjs';
import { ROOT, sauGia, banSao, THU_MUC_CAY } from './ban-sao.mjs';

const i = process.argv.indexOf('--ac');
const ac = i >= 0 ? Number(process.argv[i + 1]) : NaN;
const M = MA_TRAN[ac];
if (!M) { console.error('chan.mjs: dùng --ac <1…8>'); process.exit(3); }
const loi = [];
const ghi = (s) => console.log(s);

function chayNode(file, env = {}, cwd = ROOT) {
  return spawnSync(process.execPath, [file, ...(env.__args || [])], { cwd, encoding: 'utf8', env: { ...process.env, ...env }, maxBuffer: 256 * 1024 * 1024, timeout: 1200000 });
}
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

// ── (1) chiều xanh ──────────────────────────────────────────────────────────
if (ac === 7 || ac === 8) {
  const tep = path.join(ROOT, '_acceptance', 'gia-lan-ghim-lai', 'rang', ac === 7 ? 'vi-phan.mjs' : 'so-do.mjs');
  const r = chayNode(tep);
  ghi(r.stdout); if (r.stderr) ghi(r.stderr);
  if (r.status !== 0) loi.push(`chiều xanh: ${path.basename(tep)} thoát ${r.status}`);
} else {
  if (!M.ca.length) loi.push('số ô lệch: rút rỗng danh sách ca');
  const r = chayNode(path.join(ROOT, M.tep), { GG_CASES: M.ca.join(',') });
  const pass = new Set([...r.stdout.matchAll(/^PASS: \[([\w-]+)\]/gm)].map(m => m[1]));
  const fail = [...r.stdout.matchAll(/^FAIL: \[([\w-]+)\]/gm)].map(m => m[1]);
  ghi(r.stdout.split('\n').filter(l => /^(PASS|FAIL):|^\s{4}/.test(l)).join('\n'));
  const thieu = M.ca.filter(c => !pass.has(c));
  if (fail.length || thieu.length || r.status !== 0) loi.push(`chiều xanh: ca đỏ ${fail.join(', ') || '—'} · thiếu ${thieu.join(', ') || '—'} (mã ${r.status})`);
  if (pass.size !== M.ca.length) loi.push(`số ô lệch: ${pass.size} ca PASS, ma trận viết trước ${M.ca.length}`);
}

// ── (2) chiều đỏ ────────────────────────────────────────────────────────────
const sau = sauGia();
for (const pha of M.pha) {
  let goc;
  try { goc = banSao(sau, THU_MUC_CAY); apPha(goc, pha); } catch (e) { loi.push(`${pha.ten}: ${e.message}`); continue; }
  let r, chay, thay;
  if (ac === 7 || ac === 8) {
    const tep = path.join(goc, '_acceptance', 'gia-lan-ghim-lai', 'rang', ac === 7 ? 'vi-phan.mjs' : 'so-do.mjs');
    r = chayNode(tep, { GG_REPO: ROOT });
    const out = `${r.stdout}\n${r.stderr}`;
    chay = /^… \[/m.test(out);
    thay = r.status !== 0 && out.includes(pha.ghim);
  } else {
    r = chayNode(path.join(goc, M.tep), { GG_CASES: pha.ca, GG_REPO: ROOT });
    chay = r.stdout.includes(`… [${pha.ca}]`);
    const dongFail = (r.stdout.match(new RegExp(`^FAIL: \\[${pha.ca}\\][\\s\\S]*?(?=^(PASS|FAIL|Results))`, 'm')) || [''])[0];
    thay = dongFail.includes(pha.ghim);
  }
  const nhan = `[bản sao chạy tới ca: ${chay ? 'có' : 'KHÔNG'} · thấy ghim «${pha.ghim}»: ${thay ? 'có' : 'KHÔNG'}]`;
  if (chay && thay) ghi(`ĐỎ đúng: ${pha.ten} — ${nhan}`);
  else { loi.push(`${pha.ten}: phép phá không bị bắt ${nhan}`); ghi(`${r.stdout}\n${r.stderr}`.split('\n').slice(-25).join('\n')); }
}
if (ac === 7 && MA_TRAN[7].khong_thay_duoc) ghi(`Ghi chú: không chạy «đổi mặc định» cho ${MA_TRAN[7].khong_thay_duoc.join(', ')} — bật chúng chỉ đổi tổng kết, phần đã gỡ khỏi phép so (sổ quyết định, fix S3).`);

if (loi.length) { console.log(`\nAC-${ac}: ĐỎ\n  - ${loi.join('\n  - ')}`); process.exit(1); }
console.log(`\nAC-${ac}: XANH — chiều xanh đủ, ${M.pha.length} phép phá đều bị bắt đúng thông điệp ghim`);

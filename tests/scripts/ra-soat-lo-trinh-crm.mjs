#!/usr/bin/env node
// ra-soat-lo-trinh-crm.mjs — hồ sơ ra-soat-lo-trinh, ca RS-9 (AC-9): rà soát lộ trình trên dữ liệu THẬT của crm và của
// chính kit ở sha ghim. KHÔNG mang đuôi .test.mjs: cần kho crm trên máy (CRM_ROOT, mặc định ~/dev/crm) nên không vào
// suite; crm vắng hay sha vắng → thoát 2 nêu đường (mù — «không đọc được ở đây», không xanh giả).
// Bản sao bung bằng `git archive <sha> _acceptance docs/plan(s)` vào thư mục tạm (không phải kho git → không có tuổi hàng;
// hai kho không khai chính sách nên chỉ ba luật sự thật chạy). Danh sách viết sẵn từ phép đếm độc lập 14/10 (bộ máy gốc
// + luật viết riêng, hồ sơ ra-soat-lo-trinh — ô cơ hội «Số đo trước»). Mọi đường dẫn suy từ vị trí tệp này.
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, existsSync, rmSync, realpathSync } from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..', '..');
const CRM_SHA = 'd0351bcdf40ecc2903fa1df6cb4da0e9f2bce50d';
const KIT_SHA = '1baceb962caaa097d2915fd651806bbaca36a2a0';
const HOM_NAY = '2026-10-14';
const CRM = process.env.CRM_ROOT || path.join(homedir(), 'dev', 'crm');
const TMP = realpathSync(mkdtempSync(path.join(tmpdir(), 'ra-soat-crm-')));
const mu = m => { console.log(`  KHÔNG ĐO ĐƯỢC: RS-9 — ${m}`); rmSync(TMP, { recursive: true, force: true }); process.exit(2); };
if (!existsSync(path.join(CRM, '.git'))) mu(`crm vắng: ${CRM} (đặt CRM_ROOT)`);
try { execFileSync('git', ['-C', CRM, 'cat-file', '-e', `${CRM_SHA}^{commit}`], { stdio: 'ignore' }); } catch { mu(`crm thiếu sha ${CRM_SHA.slice(0, 8)} — chạy git -C ${CRM} fetch`); }
const bung = (kho, sha, ds, dich) => { mkdirSync(dich, { recursive: true }); execFileSync('tar', ['-x', '-C', dich], { input: execFileSync('git', ['-C', kho, 'archive', '--format=tar', sha, ...ds], { maxBuffer: 1 << 30 }) }); return dich; };
let pass = 0; let fail = 0;
const ok = (id, m) => { pass += 1; console.log(`  PASS: ${id} — ${m}`); };
const bad = (id, m) => { fail += 1; console.log(`  FAIL: ${id} — ${m}`); };
const rs = r => {
  const x = spawnSync(process.execPath, [path.join(KIT, 'scripts', 'lo-trinh.mjs'), '--root', r, '--ra-soat', '--json'], { encoding: 'utf8', maxBuffer: 1 << 26, env: { ...process.env, ACCEPTANCE_TODAY: HOM_NAY } });
  if (x.status !== 0) throw new Error(`--ra-soat thoát ${x.status}: ${x.stderr.slice(0, 200)}`);
  return JSON.parse(x.stdout);
};
const tap = t => t.de_xuat.map(m => `${m.ma}|${m.de_xuat}|${m.luat}${m.luat === 'xep-lai' ? `|${m.can_cu.nguon}` : ''}`);
const so = (ten, thuc, mong) => {
  const sai = [];
  for (const [tep, m] of Object.entries(mong)) {
    const t = thuc.find(x => x.tep === tep); if (!t) { sai.push(`${tep}: không có trong kết quả`); continue; }
    const a = tap(t).sort(); const b = [...m].sort();
    if (JSON.stringify(a) !== JSON.stringify(b)) sai.push(`${tep}: ${JSON.stringify(a)} ≠ viết sẵn ${JSON.stringify(b)}`);
  }
  if (sai.length) bad(ten, sai.join(' ; ')); return !sai.length;
};

try {
  const crm = bung(CRM, CRM_SHA, ['_acceptance', 'docs/plan'], path.join(TMP, 'crm'));
  if (so('RS-9-crm', rs(crm), {
    'docs/plan/lo-trinh-okr.json': [],
    'docs/plan/lo-trinh-kho-tai-lieu.json': [],
    'docs/plan/lo-trinh-viec-du-an.json': ['DA6|cho-dieu-kien|xep-lai|tu-khai', 'DA7|cho-dieu-kien|xep-lai|tu-khai', 'DA8|cho-dieu-kien|xep-lai|tu-khai'],
  })) ok('RS-9-crm', `crm ${CRM_SHA.slice(0, 8)}: OKR 0 · Kho tài liệu 0 · Việc và Dự án DA6, DA7, DA8 → chờ điều kiện (tự khai xếp lại)`);
} catch (e) { bad('RS-9-crm', String(e.message || e)); }
try {
  const kit = bung(KIT, KIT_SHA, ['_acceptance', 'docs/plans'], path.join(TMP, 'kit'));
  if (so('RS-9-kit', rs(kit), { 'docs/plans/lo-trinh-kit.json': ['A3|doi-moc|moc-qua-ngay', 'DP8|doi-moc|moc-qua-ngay'] }))
    ok('RS-9-kit', `kit ${KIT_SHA.slice(0, 8)}: A3, DP8 → dời mốc (mốc phát hành đã qua ngày, chưa giao)`);
} catch (e) { bad('RS-9-kit', String(e.message || e)); }

rmSync(TMP, { recursive: true, force: true });
console.log(`\nResults: ${pass} passed, ${fail} failed (ra-soat-lo-trinh-crm)`);
process.exit(fail ? 1 : 0);

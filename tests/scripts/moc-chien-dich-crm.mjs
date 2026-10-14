#!/usr/bin/env node
// moc-chien-dich-crm.mjs — hồ sơ moc-la-chien-dich, ca MC-10 (AC-10): ba cờ nấc 1 ADR 0025 và tên phiên/nhóm trên dữ
// liệu THẬT của crm ở sha ghim. KHÔNG mang đuôi .test.mjs: cần kho crm trên máy (CRM_ROOT, mặc định ~/dev/crm) nên
// không vào suite; crm vắng hay sha vắng → thoát 2 nêu đường (mù — «không đọc được ở đây», không xanh giả).
// Bản sao bung bằng `git archive <sha> _acceptance docs/plan` vào thư mục tạm TÊN `crm` (không phải kho git → tên kho
// là tên thư mục). So bộ máy gốc vòng (git archive f4e717bf scripts lib skills) với cây. Tập cờ mới viết sẵn từ số
// đo 14/10 (hạt giống #350 + design doc của hồ sơ). Mọi đường dẫn suy từ vị trí tệp này.
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, existsSync, rmSync, readFileSync, realpathSync } from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..', '..');
const CRM_SHA = '1997da85bd7e88b9890950017141122678696fe6';
const GOC_VONG = 'f4e717bf';
const CRM = process.env.CRM_ROOT || path.join(homedir(), 'dev', 'crm');
const TMP = realpathSync(mkdtempSync(path.join(tmpdir(), 'moc-crm-')));
const mu = m => { console.log(`  KHÔNG ĐO ĐƯỢC: MC-10 — ${m}`); rmSync(TMP, { recursive: true, force: true }); process.exit(2); };
if (!existsSync(path.join(CRM, '.git'))) mu(`crm vắng: ${CRM} (đặt CRM_ROOT)`);
try { execFileSync('git', ['-C', CRM, 'cat-file', '-e', `${CRM_SHA}^{commit}`], { stdio: 'ignore' }); } catch { mu(`crm thiếu sha ${CRM_SHA.slice(0, 8)} — chạy git -C ${CRM} fetch`); }
const bung = (kho, sha, ds, dich) => { mkdirSync(dich, { recursive: true }); execFileSync('tar', ['-x', '-C', dich], { input: execFileSync('git', ['-C', kho, 'archive', '--format=tar', sha, ...ds], { maxBuffer: 1 << 30 }) }); return dich; };
const r = bung(CRM, CRM_SHA, ['_acceptance', 'docs/plan'], path.join(TMP, 'crm'));
const goc = bung(KIT, GOC_VONG, ['scripts', 'lib', 'skills'], path.join(TMP, 'goc'));
let pass = 0; let fail = 0;
const ok = (id, m) => { pass += 1; console.log(`  PASS: ${id} — ${m}`); };
const bad = (id, m) => { fail += 1; console.log(`  FAIL: ${id} — ${m}`); };
const nap = async (kit, v) => ({ LT: await import(pathToFileURL(path.join(kit, 'scripts', 'lo-trinh.mjs')).href + `?v=${v}`), PM: await import(pathToFileURL(path.join(kit, 'scripts', 'product-map.mjs')).href + `?v=${v}`) });
const phan = M => M.LT.phanTichKho({ root: r, classify: M.PM.classify, sections: M.PM.SECTIONS });

// Số đo 14/10 (viết sẵn, không rút từ đầu ra): số cờ theo lộ trình, gốc → cây, và tập cờ mới.
const DEM = { 'docs/plan/lo-trinh-okr.json': [12, 26], 'docs/plan/lo-trinh-kho-tai-lieu.json': [2, 2], 'docs/plan/lo-trinh-viec-du-an.json': [4, 5] };
const MOI_A = ['F8', 'F23', 'F24', 'F26', 'DA0c'];
const MOI_B = ['agent-doi-truong-theo-quyen', 'bo-cao-noi-khi-hong-mot-phan', 'ma-tran-bam-khong-dong-hop', 'mo-o-dau', 'phan-tich-cau-hinh-bo-cao',
  'the-gop-y-cot-cuon-rieng', 'the-gop-y-sua-nhanh', 'the-thong-tin-ca-nhan', 'thuoc-cua-lat-3a-co-rang', 'tim-trong-phan-khuc'];
// Phép đếm, tham số hoá theo bộ máy «mới» — chiều đỏ gọi CHÍNH hàm này với bộ máy gốc ở cả hai bên.
const demCo = (kg, km) => {
  const sai = [];
  const moiA = []; const moiB = [];
  for (const [tep, [truoc, sau]] of Object.entries(DEM)) {
    const a = kg.cacTep.find(t => t.tep === tep)?.kq; const b = km.cacTep.find(t => t.tep === tep)?.kq;
    if (!a || !b) { sai.push(`${tep}: không đọc được`); continue; }
    if (a.co.length !== truoc || b.co.length !== sau) sai.push(`${tep}: cờ ${a.co.length} → ${b.co.length} (cần ${truoc} → ${sau})`);
    for (const c of a.co) if (!b.co.includes(c)) sai.push(`${tep}: cờ cũ mất «${c}»`);
    for (const c of b.co.filter(x => !a.co.includes(x))) {
      const ma = /^hàng (.+?): đang mở vòng mà chưa thuộc mốc nào$/.exec(c); const hs = /^hồ sơ (\S+) đang mở mà không thuộc việc nào trong kế hoạch$/.exec(c);
      if (ma) moiA.push(ma[1]); else if (hs) moiB.push(hs[1]); else sai.push(`${tep}: cờ mới lạ «${c}»`);
    }
  }
  const s = x => [...x].sort();
  if (JSON.stringify(s(moiA)) !== JSON.stringify(s(MOI_A))) sai.push(`cờ ngoài mốc mới ${JSON.stringify(s(moiA))} ≠ ${JSON.stringify(s(MOI_A))}`);
  if (JSON.stringify(s(moiB)) !== JSON.stringify(s(MOI_B))) sai.push(`cờ hồ sơ ngoài kế hoạch mới ${JSON.stringify(s(moiB))} ≠ ${JSON.stringify(s(MOI_B))}`);
  return sai;
};
try {
  const G = await nap(goc, 1); const M = await nap(KIT, 2);
  const kg = phan(G); const km = phan(M); const sai = demCo(kg, km);
  if (sai.length) bad('MC-10 dem', sai.join(' ; ')); else ok('MC-10 dem', `crm @${CRM_SHA.slice(0, 8)}: OKR 12→26 · Kho tài liệu 2→2 · Việc và Dự án 4→5; mới = ${MOI_A.length} việc ngoài mốc + ${MOI_B.length} hồ sơ ngoài kế hoạch; 0 cờ cũ mất`);

  // Chiều đỏ: bộ máy gốc ở cả hai bên (không có cờ mới) — phép đếm phải đỏ, ghim đúng câu số cờ OKR.
  const doSai = demCo(kg, phan(await nap(goc, 3)));
  if (sai.length) bad('MC-10 dem-do', 'bản lành chưa xanh — không tin được chiều đỏ');
  else if (doSai.some(x => x.includes('docs/plan/lo-trinh-okr.json: cờ 12 → 12 (cần 12 → 26)'))) ok('MC-10 dem-do', `bộ máy gốc ở cả hai bên: «${doSai[0]}»`);
  else bad('MC-10 dem-do', `không bắt: ${JSON.stringify(doSai).slice(0, 200)}`);
  const tep = 'docs/plan/lo-trinh-okr.json'; const d = JSON.parse(readFileSync(path.join(r, tep), 'utf8'));
  const m = d.moc.find(x => String(x.ten).startsWith('R2 lên production')); const h = m && d.hang.find(x => x.ma === m.hang[0]);
  if (!h) bad('MC-10 ten', 'không thấy hàng đầu của mốc «R2 lên production»');
  else {
    const t = M.LT.tenChienDich({ hang: h, moc: d.moc, loTrinh: d, tep, nhieuLoTrinh: true, kho: M.LT.tenKho(r) });
    const mong = { ten_phien: `${h.ma} · ${h.ten_ngan} (crm)`, nhom: 'OKR · R2 lên production 31/10' };
    if (t.ten_phien === mong.ten_phien && t.nhom === mong.nhom) ok('MC-10 ten', `hàng ${h.ma}: «${t.ten_phien}» → nhóm «${t.nhom}»`);
    else bad('MC-10 ten', `nhận ${JSON.stringify(t)} (cần ${JSON.stringify(mong)})`);
  }
} catch (e) { bad('MC-10', String(e && e.stack || e).split('\n').slice(0, 3).join(' | ')); }
rmSync(TMP, { recursive: true, force: true });
console.log(`\nResults: ${pass} passed, ${fail} failed (moc-chien-dich-crm)`);
process.exit(fail ? 1 : 0);

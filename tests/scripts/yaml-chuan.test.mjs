// yaml-chuan.test.mjs — hồ sơ bo-doc-ho-so-khoan-dung (gốc: crm-onehub#375). Bộ dò `evals.yaml` không phải YAML
// chuẩn (scripts/yaml-chuan.cjs): sáu lớp đo trên bảy kho, cờ vàng trên thẻ hai cổng, lệnh kiểm kho tự bật trong CI.
// Ca YC-1 (ma trận), YC-3 (thẻ), YC-4 (lệnh kiểm). Răng dữ liệu thật ở _acceptance/bo-doc-ho-so-khoan-dung/rang/
// bay-kho.mjs, ngoài suite.
//
// Fixture do mã sinh trong lượt; ma trận rút từ module dùng chung yaml-chuan-ma-tran.mjs. Chiều đỏ: bản lành xanh
// trước, rồi CHÍNH ca đo chạy trên bản sao bị tiêm (nhát tiêm khớp đúng một lần — kiểm trước khi tin) hoặc trên bản
// base `git archive 3c88d138`, ghim thông điệp.
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { maTran } from './yaml-chuan-ma-tran.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..', '..');
const BASE_SHA = '3c88d138';
const TMP = mkdtempSync(path.join(tmpdir(), 'yaml-chuan-'));
const require = createRequire(import.meta.url);
let pass = 0; let fail = 0;
const ok = (id, m = '') => { pass += 1; console.log(`  PASS: ${id}${m ? ` — ${m}` : ''}`); };
const bad = (id, m) => { fail += 1; console.log(`  FAIL: ${id} — ${m}`); };
const only = (process.env.YC_CASES || '').split(',').map(s => s.trim()).filter(Boolean);
const want = id => !only.length || only.some(o => id === o || id.startsWith(o + '-'));
const loi = e => String((e && (e.stack || e.message)) || e).split('\n').slice(0, 4).join(' | ');
const git = (d, ...a) => execFileSync('git', ['-C', d, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const node = (args, o = {}) => spawnSync(process.execPath, args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, ...o });

// Bản sao bộ dò bị tiêm: nhát tiêm phải khớp ĐÚNG một lần trong nguồn, không thì ca hỏng (không tin chiều đỏ).
function banSaoTiem(ten, tu, thanh) {
  const src = readFileSync(path.join(KIT, 'scripts', 'yaml-chuan.cjs'), 'utf8');
  const n = src.split(tu).length - 1;
  if (n !== 1) throw new Error(`nhát tiêm «${tu}» khớp ${n} lần (phải đúng 1)`);
  const d = path.join(TMP, `tiem-${ten}`); mkdirSync(d, { recursive: true });
  const p = path.join(d, 'yaml-chuan.cjs'); writeFileSync(p, src.replace(tu, thanh));
  return p;
}

// Ma trận: trả danh sách lệch (rỗng = khớp) và số ô so.
function soMaTran(dò) {
  const lech = []; let so = 0;
  for (const c of maTran()) {
    so += 1;
    const r = dò(c.text);
    if (c.mong == null) { if (r.length) lech.push(`${c.o}: mong 0 mục, được ${r.map(x => `${x.loai}@${x.dong}`).join(',')}`); continue; }
    if (r.length !== 1 || r[0].loai !== c.mong.loai || r[0].dong !== c.mong.dong) lech.push(`${c.o}: mong ${c.mong.loai}@${c.mong.dong}, được ${r.map(x => `${x.loai}@${x.dong}`).join(',') || '0 mục'}`);
  }
  return { lech, so };
}

const SO_O_MONG = 6 * 2 + 7;

if (want('YC-1')) {
  try {
    const { yamlKhongChuan, LOP_YAML } = require(path.join(KIT, 'scripts', 'yaml-chuan.cjs'));
    const lop = new Set(maTran().filter(c => c.mong).map(c => c.mong.loai));
    const { lech, so } = soMaTran(yamlKhongChuan);
    console.log(`  so o: ${so}`);
    if (so !== SO_O_MONG) bad('YC-1', `ma trận hụt: ${so} ô, mong ${SO_O_MONG}`);
    else if (lop.size !== 6 || Object.keys(LOP_YAML).length !== 6 || [...lop].some(l => !LOP_YAML[l])) bad('YC-1', `ma trận hụt: lớp trong ma trận ${[...lop].join(',')} ≠ LOP_YAML ${Object.keys(LOP_YAML).join(',')}`);
    else if (lech.length) bad('YC-1', lech.join(' · '));
    else ok('YC-1', `${so} ô khớp`);
  } catch (e) { bad('YC-1', loi(e)); }
}

if (want('YC-1-do')) {
  try {
    const p = banSaoTiem('bo-thoat', "if (!THOAT_HOP_LE.test(", "if (false && !THOAT_HOP_LE.test(");
    const { lech } = soMaTran(require(p).yamlKhongChuan);
    if (lech.length && lech.some(l => l.includes('thoat-sai-nhay-kep'))) ok('YC-1-do', `bản sao bỏ lớp → ${lech.join(' · ')}`);
    else bad('YC-1-do', `bản sao bỏ nhánh thoat-sai-nhay-kep mà ma trận không đỏ ở lớp ấy: ${lech.join(' · ') || 'xanh'}`);
  } catch (e) { bad('YC-1-do', loi(e)); }
}

rmSync(TMP, { recursive: true, force: true });
console.log(`YC Results: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);

// hai-bo-cuc.test.mjs — hồ sơ phan-du-bo-cuc-moi-vong-ba, AC-3 / E3: răng bền của `tests/hai-bo-cuc.mjs`.
//
// Hai kho do mã sinh trong lần chạy (mkdtemp), cây lấy từ chính kho kit qua `haiCay` (nên tệp chạy được ở cả bố cục hôm
// nay lẫn cây đã dọn nhà):
//   - kho thử sáu commit viết trước: c1 phẳng · c2 dọn nhà (dungKhoMoi) · c3 trả về phẳng · c4 dọn nhà lần hai · c5 gỡ
//     plugin.json lõi · c6 đặt lại nó;
//   - bản sao kit có LỊCH SỬ THẬT (`git clone --shared`), HEAD = sha cây phẳng P của mã đang kiểm, thêm một commit CON là
//     kho mới dựng bằng dungKhoMoi từ TRỌN cây ấy — như cây kịch bản của B2. Lịch sử thật đã có một lần thêm plugin.json lõi
//     dưới plugins/acceptance-gate (gói Codex, 02/07) rồi gỡ: ô chỉ xanh khi chọn đúng lần MỚI NHẤT.
// Bốn ô, mỗi ô một dòng «PASS: HC <ô>» (số assert = số ô):
//   HC cây phẳng          haiCay(c1) → hienTai phang, refPhang = c1, cây mới có plugin.json lõi dưới plugins/
//   HC kho mới            haiCay(con của P, bản sao lịch sử thật) → hienTai moi, refPhang = P = HEAD của bản sao; bộ dịch
//                         đọc bản bung là phẳng; dungKhoMoi(bản bung) cùng tập tệp plugins/ với kho mới (đối chứng dương)
//   HC dọn nhà hai lần    haiCay(c4) → refPhang = c3 (lần MỚI NHẤT) — bản chọn lần đầu (c1) là sai
//   HC cha không phẳng    haiCay(c6) → ném «hai-bo-cuc: cha của commit dọn nhà <c5> không phẳng»
// Hạ tầng hỏng (git, archive) → «HẠ TẦNG: …», mã 3, không in PASS.
import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { boCuc } from '../bo-cuc.mjs';
import { haiCay } from '../hai-bo-cuc.mjs';
import { dungKhoMoi } from '../../_acceptance/goi-cheo-loi-dieu-phoi/rang/luat-doi-chu.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..', '..');
const BANG = JSON.parse(readFileSync(path.join(KIT, 'tests', 'fixtures', 'bo-cuc-phang.json'), 'utf8'));
const ENV = { ...process.env, GIT_AUTHOR_NAME: 'hc', GIT_AUTHOR_EMAIL: 'hc@invalid', GIT_COMMITTER_NAME: 'hc', GIT_COMMITTER_EMAIL: 'hc@invalid', GIT_CONFIG_NOSYSTEM: '1' };
const git = (d, ...a) => execFileSync('git', ['-C', d, ...a], { encoding: 'utf8', env: ENV, stdio: ['ignore', 'pipe', 'pipe'] }).trim();
let pass = 0; let fail = 0;
const ok = (id, m) => { pass++; console.log(`  PASS: ${id} — ${m}`); };
const bad = (id, m) => { fail++; console.log(`  FAIL: ${id} — ${m}`); };
const moiTep = d => { const ra = []; const di = (p, r) => { for (const e of readdirSync(p, { withFileTypes: true })) { const q = path.join(p, e.name); const rr = r ? `${r}/${e.name}` : e.name; if (e.isDirectory()) di(q, rr); else ra.push(rr); } }; if (existsSync(d)) di(d, ''); return ra.sort(); };

let TMP; const C = {}; let F; let K; let P; let CON;
try {
  TMP = realpathSync(mkdtempSync(path.join(tmpdir(), 'hai-bo-cuc-')));
  const kit = haiCay(KIT, path.join(TMP, 'kit')); const goc = kit.phang; P = kit.refPhang; // cây phẳng của mã đang kiểm, ở bất kỳ bố cục nào
  // Bản sao lịch sử thật: HEAD = P, commit con = kho mới dựng từ TRỌN cây P (cây làm việc riêng, không checkout bản sao).
  K = path.join(TMP, 'ban-sao'); execFileSync('git', ['clone', '-q', '--shared', '--no-checkout', KIT, K], { env: ENV, stdio: 'ignore' });
  git(K, 'update-ref', '--no-deref', 'HEAD', P); git(K, 'read-tree', P);
  const KM = path.join(TMP, 'kho-moi-that'); dungKhoMoi(goc, KM);
  const gk = (...a) => execFileSync('git', ['--git-dir', path.join(K, '.git'), '--work-tree', KM, ...a], { encoding: 'utf8', env: ENV, stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  gk('add', '-A'); gk('-c', 'commit.gpgsign=false', 'commit', '-q', '-m', 'kho mới (dungKhoMoi trọn cây)'); CON = git(K, 'rev-parse', 'HEAD');
  if (git(K, 'rev-parse', 'HEAD^') !== P) throw new Error('commit kho mới không phải con của P');
  // Cây phẳng tối thiểu: tệp khai chợ + plugin.json lõi + bảng tên + plugin.json của từng gói con khai trong chợ.
  const T1 = path.join(TMP, 't1'); mkdirSync(T1);
  const mk = JSON.parse(readFileSync(path.join(goc, BANG.tep_khai.cho), 'utf8'));
  const chep = [BANG.tep_khai.cho, BANG.tep_khai.plugin, BANG.tep_khai.bang_ten,
    ...mk.plugins.map(p => String(p.source).replace(/^\.\//, '').replace(/\/$/, '')).filter(s => s && s !== '.').map(s => `${s}/${BANG.tep_khai.plugin}`)];
  for (const r of chep) if (existsSync(path.join(goc, r))) { mkdirSync(path.dirname(path.join(T1, r)), { recursive: true }); cpSync(path.join(goc, r), path.join(T1, r)); }
  const T2 = path.join(TMP, 't2'); dungKhoMoi(T1, T2);
  F = path.join(TMP, 'kho'); mkdirSync(F); git(F, 'init', '-q');
  const dat = (src, ten) => { for (const e of readdirSync(F)) if (e !== '.git') rmSync(path.join(F, e), { recursive: true, force: true }); cpSync(src, F, { recursive: true }); git(F, 'add', '-A'); git(F, '-c', 'commit.gpgsign=false', 'commit', '-q', '--allow-empty', '-m', ten); return git(F, 'rev-parse', 'HEAD'); };
  C.c1 = dat(T1, 'c1 phẳng'); C.c2 = dat(T2, 'c2 dọn nhà'); C.c3 = dat(T1, 'c3 trả về phẳng'); C.c4 = dat(T2, 'c4 dọn nhà lần hai');
  const pj = path.join(F, 'plugins', 'acceptance-gate', BANG.tep_khai.plugin);
  if (!existsSync(pj)) throw new Error(`kho mới thử không có plugin.json lõi dưới plugins/acceptance-gate`);
  const giu = readFileSync(pj); rmSync(pj); git(F, 'add', '-A'); git(F, '-c', 'commit.gpgsign=false', 'commit', '-q', '-m', 'c5 gỡ plugin.json lõi'); C.c5 = git(F, 'rev-parse', 'HEAD');
  writeFileSync(pj, giu);
  git(F, 'add', '-A'); git(F, '-c', 'commit.gpgsign=false', 'commit', '-q', '-m', 'c6 đặt lại'); C.c6 = git(F, 'rev-parse', 'HEAD');
} catch (e) {
  console.log(`HẠ TẦNG: dựng kho thử hỏng — ${String(e.message || e).split('\n')[0]}`);
  if (TMP) rmSync(TMP, { recursive: true, force: true });
  process.exit(3);
}

const ngan = s => s.slice(0, 8);
const o = (ten) => path.join(TMP, `o-${ten}`);
// HC cây phẳng
try {
  const r = haiCay(F, o('1'), { ref: C.c1 });
  const lech = [];
  if (r.hienTai !== 'phang') lech.push(`hienTai ${r.hienTai}`);
  if (r.refPhang !== C.c1) lech.push(`refPhang ${ngan(r.refPhang)} ≠ c1 ${ngan(C.c1)}`);
  if (!existsSync(path.join(r.moi, 'plugins', 'acceptance-gate', BANG.tep_khai.plugin))) lech.push('cây mới thiếu plugin.json lõi dưới plugins/acceptance-gate');
  if (!existsSync(path.join(r.phang, BANG.tep_khai.bang_ten))) lech.push('cây phẳng thiếu bảng tên ở gốc');
  lech.length ? bad('HC cây phẳng', lech.join(' · ')) : ok('HC cây phẳng', `c1 → hienTai phang, refPhang = c1, cây mới dựng bằng dungKhoMoi có plugins/acceptance-gate/${BANG.tep_khai.plugin}`);
} catch (e) { bad('HC cây phẳng', String(e.message)); }
// HC kho mới — bản sao lịch sử thật
try {
  const r = haiCay(K, o('2'), { ref: CON });
  const lech = [];
  if (r.hienTai !== 'moi') lech.push(`hienTai ${r.hienTai}`);
  if (r.refPhang !== P) lech.push(`refPhang ${ngan(r.refPhang)} ≠ P ${ngan(P)} (HEAD của bản sao, cha commit dọn nhà)`);
  const them = git(K, 'log', '--diff-filter=A', '--format=%H', CON, '--', `plugins/acceptance-gate/${BANG.tep_khai.plugin}`).split('\n').filter(Boolean);
  if (them.length < 2) lech.push(`lịch sử bản sao chỉ có ${them.length} lần thêm plugin.json lõi dưới plugins/ — ô không chạm lần thêm cũ`);
  if (!boCuc({ thuMuc: r.phang }).phang) lech.push('bộ dịch không đọc bản bung là phẳng');
  const lai = path.join(TMP, 'lai'); dungKhoMoi(r.phang, lai);
  const a = moiTep(path.join(lai, 'plugins')).join('\n'); const b = moiTep(path.join(r.moi, 'plugins')).join('\n');
  if (a !== b) lech.push('dungKhoMoi(bản bung) khác tập tệp plugins/ của kho mới');
  lech.length ? bad('HC kho mới', lech.join(' · ')) : ok('HC kho mới', `bản sao lịch sử thật: con của ${ngan(P)} → hienTai moi, refPhang = ${ngan(P)} = HEAD bản sao (lần thêm mới nhất trong ${them.length} lần), bản bung đọc là phẳng; đối chứng dương: dọn nhà lại bản bung ra đúng tập tệp plugins/ của kho mới`);
} catch (e) { bad('HC kho mới', String(e.message)); }
// HC dọn nhà hai lần
try {
  const r = haiCay(F, o('4'), { ref: C.c4 });
  r.refPhang === C.c3 ? ok('HC dọn nhà hai lần', `c4 → refPhang = c3 (lần dọn nhà mới nhất), không phải c1`)
    : bad('HC dọn nhà hai lần', `cha ≠ ${ngan(C.c3)}: được ${ngan(r.refPhang)}${r.refPhang === C.c1 ? ' (chọn lần dọn nhà ĐẦU)' : ''}`);
} catch (e) { bad('HC dọn nhà hai lần', String(e.message)); }
// HC cha không phẳng
{
  const mong = `hai-bo-cuc: cha của commit dọn nhà ${C.c5} không phẳng`;
  let msg = null; try { haiCay(F, o('6'), { ref: C.c6 }); } catch (e) { msg = String(e.message); }
  msg === mong ? ok('HC cha không phẳng', `c6 → «hai-bo-cuc: cha của commit dọn nhà <c5> không phẳng»`)
    : bad('HC cha không phẳng', msg === null ? 'không ném' : `ném sai câu: ${msg}`);
}

rmSync(TMP, { recursive: true, force: true });
console.log(`hai-bo-cuc: ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);

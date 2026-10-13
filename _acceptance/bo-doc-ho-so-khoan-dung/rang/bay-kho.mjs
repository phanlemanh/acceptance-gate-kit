#!/usr/bin/env node
// bay-kho.mjs — răng dữ liệu thật của hồ sơ bo-doc-ho-so-khoan-dung (E2/AC-2 và E7/AC-7). Ngoài feature_loop.suite_keys:
// cần sáu kho tiêu thụ trên máy (KHO_<TÊN> hoặc ~/dev/<tên>) và python3 + PyYAML. Thiếu → thoát 2 «không đọc được ở
// đây: <tên>», không bao giờ xanh trên bộ hụt.
//
// Mọi kho đọc ở SHA GHIM bằng `git archive` (không đọc cây làm việc); kit đọc ở bản base 3c88d138. Bộ dò và bốn mặt
// ngày ký của CÂY ĐANG KIỂM suy từ vị trí tệp này (../../../), bản base dựng bằng `git archive 3c88d138`.
//
// Phần YAML: với mỗi `_acceptance/*/evals.yaml`, «bộ dò có mục» ⇔ «PyYAML từ chối», và tệp bị từ chối phải có mục ở
// ĐÚNG dòng lỗi đầu PyYAML báo. 19 ô ma trận của ca YC-1 (rút từ CHÍNH module sinh dùng chung) cũng qua PyYAML. Chiều
// đỏ cùng lượt: sáu bản sao bỏ từng lớp + một bản sao dời dòng. Bộ đọc theo dòng của lib: base == cây đang kiểm.
// Phần ngày: bốn mặt (tin-hieu ngayKy · dải tomTatHoSo · start-scan · cat-luot nhip) base so cây đang kiểm.
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync, cpSync } from 'node:fs';
import { createRequire } from 'node:module';
import { homedir, tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..', '..', '..');
const BASE = '3c88d138c5b2a7d51ded4a94e384188c60d5b3d4';
// Sha ghim: origin/<nhánh chính> sau `git fetch` ngày 13/10/2026.
const KHO = [
  ['kit', null, BASE],
  ['crm', 'crm', '206096fc227e138ede34694f15d99f89d44fe9ae'],
  ['oneflow', 'oneflow', '93b0129cf1c8bd991d26ea753a8b28de1785fb1d'],
  ['artifact-platform', 'artifact-platform', '92fc58a3e2baefe0a479c7a2efe2c91212858be7'],
  ['radar', 'radar', '0d355f36e41638fcefe9f379ef52ce1912a7cf4f'],
  ['media-library', 'media-library', '75f4bf4a252624cf062b25e94852452972b030db'],
  ['map', 'map', '347686a347cfdb924c05ed3948021aad9fa1f2a4'],
];
const DOC_THEM_MONG = { 'crm/nen-chat-ai-elements': { tin: '10/9/2026', dai: '2026-09-10', start: '2026-09-10' } };

const TMP = mkdtempSync(path.join(tmpdir(), 'bay-kho-'));
const require = createRequire(import.meta.url);
const thoat = (c, m) => { if (m) process.stderr.write(`bay-kho: ${m}\n`); rmSync(TMP, { recursive: true, force: true }); process.exit(c); };
const git = (d, ...a) => execFileSync('git', ['-C', d, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 256 * 1024 * 1024 });
let loi = 0;
const lech = m => { loi += 1; console.log(`LECH: ${m}`); };

// ── Chuẩn bị: PyYAML, kho, bản base ───────────────────────────────────────────
const py = spawnSync('python3', ['-c', 'import yaml; print(yaml.__version__)'], { encoding: 'utf8' });
if (py.status !== 0) thoat(2, 'không đọc được ở đây: PyYAML (python3 -c "import yaml" lỗi)');
console.log(`pyyaml ${py.stdout.trim()}`);
const PY_DOC = `import json,sys,yaml
r={}
for f in json.load(sys.stdin):
    try:
        yaml.safe_load(open(f,encoding='utf-8')); r[f]=None
    except Exception as e:
        pm=getattr(e,'problem_mark',None); r[f]=(pm.line+1) if pm else -1
print(json.dumps(r))`;
const pyDoc = files => {
  const x = spawnSync('python3', ['-c', PY_DOC], { input: JSON.stringify(files), encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  if (x.status !== 0) thoat(2, `không đọc được ở đây: PyYAML (${x.stderr.trim().split('\n').pop()})`);
  return JSON.parse(x.stdout);
};
const xuat = {};
for (const [ten, thuMuc, sha] of KHO) {
  const goc = thuMuc == null ? KIT : (process.env[`KHO_${ten.toUpperCase().replace(/-/g, '_')}`] || path.join(homedir(), 'dev', thuMuc));
  if (!existsSync(goc)) thoat(2, `không đọc được ở đây: ${ten} (${goc} vắng)`);
  try { git(goc, 'cat-file', '-e', `${sha}^{commit}`); } catch (_) { thoat(2, `không đọc được ở đây: ${ten} (sha ${sha.slice(0, 9)} vắng — git fetch)`); }
  const d = path.join(TMP, 'kho', ten); mkdirSync(d, { recursive: true });
  execFileSync('bash', ['-c', `git -C "${goc}" archive ${sha} -- ':(glob)_acceptance/*/*.md' ':(glob)_acceptance/*/*.yaml' ':(glob)_acceptance/*/*.jsonl' ':(glob)_acceptance/*.yaml' | tar -x -C "${d}"`]);
  xuat[ten] = { d, sha };
}
const BASE_CAY = path.join(TMP, 'base'); mkdirSync(BASE_CAY, { recursive: true });
execFileSync('bash', ['-c', `git -C "${KIT}" archive ${BASE} scripts lib skills dieu-phoi | tar -x -C "${BASE_CAY}"`]);
const hoSo = d => { const a = path.join(d, '_acceptance'); return existsSync(a) ? readdirSync(a, { withFileTypes: true }).filter(e => e.isDirectory()).map(e => e.name).sort() : []; };

// ══ Phần YAML (E2) ═══════════════════════════════════════════════════════════
const DO_SRC = readFileSync(path.join(KIT, 'scripts', 'yaml-chuan.cjs'), 'utf8');
let bdN = 0;
const banDo = (tu, thanh) => { // bản sao bộ dò bị tiêm (nhát khớp đúng một lần)
  if (tu == null) return require(path.join(KIT, 'scripts', 'yaml-chuan.cjs')).yamlKhongChuan;
  const n = DO_SRC.split(tu).length - 1; if (n !== 1) thoat(1, `nhát tiêm «${tu}» khớp ${n} lần (phải 1)`);
  const p = path.join(TMP, `do-${++bdN}.cjs`); writeFileSync(p, DO_SRC.replace(tu, thanh)); return require(p).yamlKhongChuan;
};
const tepYaml = {}; let tongTep = 0;
for (const ten of Object.keys(xuat)) { tepYaml[ten] = hoSo(xuat[ten].d).map(s => path.join(xuat[ten].d, '_acceptance', s, 'evals.yaml')).filter(existsSync); tongTep += tepYaml[ten].length; }
const PY = pyDoc(Object.values(tepYaml).flat());
const tenHs = f => f.split(`${path.sep}_acceptance${path.sep}`)[1].split(path.sep)[0];
// So một bộ dò với PyYAML trên mọi tệp → danh sách lệch "<kho>/<hồ sơ> …".
function soYaml(dò) {
  const ra = [];
  for (const [ten, ds] of Object.entries(tepYaml)) for (const f of ds) {
    const r = dò(readFileSync(f, 'utf8')); const p = PY[f];
    if ((p == null) !== (r.length === 0)) ra.push(`${ten}/${tenHs(f)} pyyaml=${p ?? 'nhận'} bộ-dò=${r.length} mục`);
    else if (p != null && !r.some(m => m.dong === p)) ra.push(`${ten}/${tenHs(f)} dòng: pyyaml ${p}, bộ dò ${r.map(m => m.dong).join(',')}`);
  }
  return ra;
}
const doMoi = banDo(null);
let tongTuChoi = 0;
for (const [ten, ds] of Object.entries(tepYaml)) {
  const tc = ds.filter(f => PY[f] != null); tongTuChoi += tc.length;
  console.log(`yaml ${ten} sha=${xuat[ten].sha} tep=${ds.length} tu-choi=${tc.length}`);
  for (const f of tc) { const m = doMoi(readFileSync(f, 'utf8')).find(x => x.dong === PY[f]); console.log(`yaml-tu-choi ${ten}/${tenHs(f)} dong=${PY[f]} lop=${m ? m.loai : '?'}`); }
}
const vp = soYaml(doMoi);
for (const x of vp) lech(`yaml ${x}`);
console.log(`yaml vi-phan: ${vp.length} lech, tong tu-choi=${tongTuChoi} (${tongTep} tep)`);
if (tongTuChoi === 0) { lech('vi phân rỗng — không tệp nào bị PyYAML từ chối'); }

// 19 ô ma trận của YC-1 qua PyYAML.
const { maTran } = await import(pathToFileURL(path.join(KIT, 'tests', 'scripts', 'yaml-chuan-ma-tran.mjs')).href);
const MT = maTran(); const mtTep = MT.map((c, i) => { const p = path.join(TMP, `o-${i}.yaml`); writeFileSync(p, c.text); return p; });
const mtPy = pyDoc(mtTep); let khop = 0;
MT.forEach((c, i) => { const p = mtPy[mtTep[i]]; const dung = c.mong ? p === c.mong.dong : p == null; if (dung) khop += 1; else lech(`ma trận ô ${c.o}: pyyaml ${p ?? 'nhận'}, mong ${c.mong ? `từ chối dòng ${c.mong.dong}` : 'nhận'}`); });
console.log(`ma-tran-pyyaml: ${khop}/${MT.length} khop`);

// Chiều đỏ: sáu bản sao bỏ một lớp + một bản sao dời dòng.
const { LOP_YAML } = require(path.join(KIT, 'scripts', 'yaml-chuan.cjs'));
const GHI = 'const ghi = (dong, loai) => out.push(';
for (const lop of Object.keys(LOP_YAML)) {
  const r = soYaml(banDo(GHI, `const ghi = (dong, loai) => loai === '${lop}' ? 0 : out.push(`));
  if (r.length) console.log(`do OK: bo ${lop} → vi phan lech: ${r[0].split(' ')[0]}`);
  else lech(`đột biến tương đương: ${lop}`);
}
{ const r = soYaml(banDo('out.push({ dong, loai,', 'out.push({ dong: dong + 3, loai,'));
  if (r.some(x => x.includes(' dòng: '))) console.log(`do OK: vi phan dong (${r.length} tệp)`); else lech('bản sao dời dòng không làm phép so đỏ'); }

// Bộ đọc theo dòng của lib: base == cây đang kiểm (vòng không đổi cách kit đọc).
{
  const nap = goc => ({ Y: require(path.join(goc, 'lib', 'eval-yaml.cjs')), E: require(path.join(goc, 'lib', 'evidence-core.cjs')) });
  const A = nap(BASE_CAY); const B = nap(KIT); let so = 0; let khac = 0;
  const chup = (L, t) => { const l = L.E.evalListsOf(t); return JSON.stringify({ p: L.Y.parseEvals(t, ['criterion', 'executor', 'cmd', 'expected']), l: [...l.byId.entries()], c: l.canhBao }); };
  for (const ds of Object.values(tepYaml)) for (const f of ds) { const t = readFileSync(f, 'utf8'); so += 1; if (chup(A, t) !== chup(B, t)) { khac += 1; lech(`doc-theo-dong: ${tenHs(f)} khác base`); } }
  console.log(`doc-theo-dong: ${khac} lech tren ${so} tep`);
}

// ══ Phần ngày ký (E7) ════════════════════════════════════════════════════════
const coIso = s => /\d{4}-\d{2}-\d{2}/.test(s);
const coDmy = s => /(?<![\d/])\d{1,2}\/\d{1,2}\/\d{4}(?![\d/])/.test(s);
const chuKy = (d, s) => { const p = path.join(d, '_acceptance', s, 'evidence-report.md'); if (!existsSync(p)) return null; const m = readFileSync(p, 'utf8').match(/^human_signoff:[ \t]*(.*)$/m); return m ? m[1] : ''; };
let napN = 0;
async function mat(goc, d, slugs) { // bốn mặt của một cây trên một kho
  const T = await import(pathToFileURL(path.join(goc, 'scripts', 'tin-hieu.mjs')).href + `?n=${++napN}`);
  const HS = require(path.join(goc, 'scripts', 'ho-so-tom-tat.cjs'));
  const CL = await import(pathToFileURL(path.join(goc, 'scripts', 'cat-luot.mjs')).href + `?n=${napN}`);
  const tin = {}; const dai = {};
  for (const s of slugs) {
    tin[s] = T.ngayKy(d, s);
    let t = null; try { t = HS.tomTatHoSo(path.join(d, '_acceptance', s)); } catch (_) { t = null; }
    dai[s] = (t && t.chiTiet && t.chiTiet.giao && t.chiTiet.giao.ngayKy) ?? null;
  }
  const ss = spawnSync(process.execPath, [path.join(goc, 'scripts', 'start-scan.mjs'), '--root', d], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  const start = {}; try { const w = o => { if (Array.isArray(o)) o.forEach(w); else if (o && typeof o === 'object') { if (typeof o.slug === 'string' && 'at' in o) start[o.slug] = o.at; Object.values(o).forEach(w); } }; w(JSON.parse(ss.stdout)); } catch (_) { thoat(1, `start-scan không đọc được trên ${d}: thoát ${ss.status}`); }
  return { tin, dai, start, nhip: CL.nhip(d) };
}
const tong = { tin: 0, dai: 0, start: 0, nhip: 0 }; let lechNgay = 0; const docThem = {};
const nhipMoi = {};
for (const [ten, { d }] of Object.entries(xuat)) {
  const slugs = hoSo(d).filter(s => chuKy(d, s) != null);
  const A = await mat(BASE_CAY, d, slugs); const B = await mat(KIT, d, slugs);
  const them = new Set(slugs.filter(s => { const k = chuKy(d, s) || ''; return !coIso(k) && coDmy(k); }));
  const soStart = new Set([...Object.keys(A.start), ...Object.keys(B.start)]);
  for (const s of slugs) for (const m of ['tin', 'dai']) {
    if (them.has(s)) { (docThem[`${ten}/${s}`] ||= {})[m] = B[m][s]; if (A[m][s] != null) { lechNgay += 1; lech(`ngay ${m} ${ten}/${s}: base đã đọc ${A[m][s]}`); } continue; }
    if (A[m][s] !== B[m][s]) { lechNgay += 1; lech(`ngay ${m} ${ten}/${s}: base ${A[m][s]} ≠ mới ${B[m][s]}`); }
  }
  for (const s of soStart) {
    if (them.has(s)) { (docThem[`${ten}/${s}`] ||= {}).start = B.start[s]; continue; }
    if (A.start[s] !== B.start[s]) { lechNgay += 1; lech(`ngay start ${ten}/${s}: base ${A.start[s]} ≠ mới ${B.start[s]}`); }
  }
  const dn = JSON.stringify(A.nhip) === JSON.stringify(B.nhip);
  if (!them.size && !dn) { lechNgay += 1; lech(`ngay nhip ${ten}: base ${JSON.stringify(A.nhip)} ≠ mới ${JSON.stringify(B.nhip)}`); }
  if (them.size) nhipMoi[ten] = { A: A.nhip, B: B.nhip };
  console.log(`ngay ${ten} tin-hieu so=${slugs.length}`); console.log(`ngay ${ten} dai so=${slugs.length}`);
  console.log(`ngay ${ten} start so=${soStart.size}`); console.log(`ngay ${ten} nhip so=${A.nhip.tong}`);
  tong.tin += slugs.length; tong.dai += slugs.length; tong.start += soStart.size; tong.nhip += A.nhip.tong;
}
for (const [m, n] of Object.entries(tong)) if (n === 0) lech(`vi phân rỗng: ${m}`);
console.log(`ngay vi-phan: ${lechNgay} lech ngoai doc-them`);
for (const [k, v] of Object.entries(docThem)) {
  console.log(`ngay doc-them tin-hieu ${k}=${v.tin}`); console.log(`ngay doc-them dai ${k}=${v.dai}`); console.log(`ngay doc-them start ${k}=${v.start}`);
  const mong = DOC_THEM_MONG[k];
  if (mong) for (const m of ['tin', 'dai', 'start']) if (v[m] !== mong[m]) lech(`đọc thêm sai ngày: ${k} ${m}=${v[m]} (mong ${mong[m]})`);
}
for (const k of Object.keys(DOC_THEM_MONG)) if (!docThem[k]) lech(`thiếu đọc thêm: ${k}`);
for (const [ten, { A, B }] of Object.entries(nhipMoi)) {
  const dT = Object.keys(B.hang).map(h => `${h} mau ${B.hang[h].n - A.hang[h].n >= 0 ? '+' : ''}${B.hang[h].n - A.hang[h].n}`).filter(x => !/ [+-]?0$/.test(x));
  console.log(`ngay doc-them nhip ${ten} ${dT.join(' ')} bo-qua ${B.bo_qua - A.bo_qua}`);
  if (ten === 'crm' && !(B.hang.T2.n - A.hang.T2.n === 1 && B.bo_qua - A.bo_qua === -1)) lech(`nhịp crm: mong T2 +1 bỏ-qua -1, được ${dT.join(' ')} bỏ-qua ${B.bo_qua - A.bo_qua}`);
}
// Chiều đỏ: hai bản sao bộ đọc chung, đo trên crm qua hai mặt rẻ (tin-hieu, dải).
async function docThemCrm(tiem) {
  const c = path.join(TMP, `cay-${tiem[0]}`); for (const x of ['scripts', 'lib', 'skills', 'dieu-phoi']) cpSync(path.join(KIT, x), path.join(c, x), { recursive: true });
  const p = path.join(c, 'scripts', 'ho-so-tom-tat.cjs'); const s = readFileSync(p, 'utf8'); const n = s.split(tiem[1]).length - 1;
  if (n !== 1) thoat(1, `nhát tiêm «${tiem[1]}» khớp ${n} lần (phải 1)`);
  writeFileSync(p, s.replace(tiem[1], tiem[2]));
  const r = await mat(c, xuat.crm.d, ['nen-chat-ai-elements']);
  return { tin: r.tin['nen-chat-ai-elements'], dai: r.dai['nen-chat-ai-elements'] };
}
{
  const m1 = await docThemCrm(['bo-nhanh', 'for (let x = re.exec(t); x; x = re.exec(t)) {', 'for (let x = null; x; x = re.exec(t)) {']);
  if (m1.tin == null && m1.dai == null) console.log('do OK: thiếu đọc thêm: crm/nen-chat-ai-elements'); else lech(`bản sao bỏ nhánh ngày/tháng/năm vẫn đọc: ${JSON.stringify(m1)}`);
  const m2 = await docThemCrm(['thang-truoc', 'const d = Number(x[1]); const mo = Number(x[2]);', 'const d = Number(x[2]); const mo = Number(x[1]);']);
  if (m2.dai && m2.dai !== DOC_THEM_MONG['crm/nen-chat-ai-elements'].dai) console.log(`do OK: đọc thêm sai ngày: crm/nen-chat-ai-elements (${m2.dai})`); else lech(`bản sao tháng-trước không lệch: ${JSON.stringify(m2)}`);
}

console.log(loi ? `bay-kho: ĐỎ — ${loi} lệch` : 'bay-kho: XANH');
thoat(loi ? 1 : 0);

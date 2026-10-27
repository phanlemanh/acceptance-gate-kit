// cat-luot-vung.test.mjs — hồ sơ vung-giao-viec-tu-cat-luot, ca CV-<n> (AC-1 phần khuôn + răng, AC-2, AC-3). Mỗi eval
// của evals.yaml ghim đúng dòng «PASS: CV-…» của tệp này.
//
// Ma trận và giá trị mong đợi viết sẵn trong ca, không rút từ đầu ra của răng. Ca đỏ («-do») chạy CHÍNH hàm đo trên
// BẢN SAO trọn ba thư mục scripts · lib · skills của kit (chép từ cây đang kiểm), SAU khi bản sao lành xanh, tiêm đúng
// một nhát (nhát không áp → ca đỏ tự FAIL) và ghim thông điệp. Kho thử cho lệnh răng do code sinh (git init trong thư
// mục tạm). Mọi đường suy từ vị trí tệp này; không ca nào ghi vào cây kit.
import { execFileSync, spawnSync } from 'node:child_process';
import { cpSync, mkdtempSync, mkdirSync, readFileSync, realpathSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..', '..');
const TMP = realpathSync(mkdtempSync(path.join(tmpdir(), 'cat-luot-vung-')));
let pass = 0; let fail = 0; let n = 0;
const ok = (id, m = '') => { pass += 1; console.log(`  PASS: ${id}${m ? ` — ${m}` : ''}`); };
const bad = (id, m) => { fail += 1; console.log(`  FAIL: ${id} — ${m}`); };
const only = (process.env.CV_CASES || '').split(',').map(s => s.trim()).filter(Boolean);
const want = id => !only.length || only.some(o => id === o || id.startsWith(o + '-'));
const loi = e => String((e && (e.stack || e.message)) || e).split('\n').slice(0, 4).join(' | ');
const nap = async goc => import(pathToFileURL(path.join(goc, 'scripts', 'cat-luot.mjs')).href + `?v=${++n}`);
const khoi = (t, m) => { const r = String(t).match(new RegExp(`<!-- <<<${m} -->\\n([\\s\\S]*?)<!-- ${m}>>> -->`)); return r ? r[1] : null; };
const khoiJs = (t, m) => { const r = String(t).match(new RegExp(`// <<<${m}[^\\n]*\\n([\\s\\S]*?)// ${m}>>>`)); return r ? r[1] : null; };

function banSao() {
  const d = mkdtempSync(path.join(TMP, 'kit-'));
  for (const t of ['scripts', 'lib', 'skills']) cpSync(path.join(KIT, t), path.join(d, t), { recursive: true });
  return d;
}
function tiem(goc, tep, cu, moi) {
  const p = path.join(goc, tep); const t = readFileSync(p, 'utf8');
  const s = typeof cu === 'string' ? t.split(cu).length - 1 : (t.match(new RegExp(cu.source, 'g')) || []).length;
  if (s !== 1) throw new Error(`nhát tiêm khớp ${s} lần ở ${tep} (cần 1)`);
  writeFileSync(p, t.replace(cu, moi));
}
async function chay(id, ham) {
  try { const sai = await ham(); if (sai.length) { bad(id, sai.join(' · ')); return false; } return true; } catch (e) { bad(id, loi(e)); return false; }
}
// Ca đỏ: bản sao lành xanh trước, rồi tiêm, rồi hàm đo phải nêu `mong`.
async function chayDo(id, ham, nhat, mong, nhan) {
  try {
    const goc = banSao();
    const lanh = await ham(goc);
    if (lanh.length) { bad(id, `bản sao lành không xanh: ${lanh.join(' · ')}`); return; }
    for (const [tep, cu, moi] of nhat) tiem(goc, tep, cu, moi);
    const sai = await ham(goc);
    if (sai.some(s => s.includes(mong))) ok(id, `${nhan}: hàm đo trả «${sai.find(s => s.includes(mong))}»`);
    else bad(id, `${nhan}: không thấy «${mong}» — ${JSON.stringify(sai).slice(0, 300)}`);
  } catch (e) { bad(id, loi(e)); }
}
const dongVung = ds => ds.filter(l => /\[(vung-[a-z-]+|chua-khai-vung)\]/.test(l));

// ═══ CV-1: khuôn lộ trình mang vung, khối luật trong SKILL, răng trên đợt mẫu không cờ vùng (AC-1) ═══════════════
async function cv1(goc = KIT, bo = null) {
  const sai = [];
  const C = await nap(goc);
  const tpl = JSON.parse(readFileSync(path.join(goc, 'skills', 'acceptance', 'references', 'lo-trinh-template.json'), 'utf8'));
  if (bo) tpl.hang = tpl.hang.map(h => (h.ma === bo ? Object.fromEntries(Object.entries(h).filter(([k]) => k !== 'vung')) : h));
  const sk = readFileSync(path.join(goc, 'skills', 'cat-luot', 'SKILL.md'), 'utf8');
  const kv = khoi(sk, 'CAT-LUOT-VUNG');
  if (kv == null) sai.push('SKILL thiếu khối CAT-LUOT-VUNG');
  else if (!kv.includes('`vung`')) sai.push('khối CAT-LUOT-VUNG không nêu khoá `vung`');
  if (!bo) for (const h of tpl.hang) if (!Array.isArray(h.vung) || !h.vung.length || h.vung.some(g => typeof g !== 'string' || !g)) sai.push(`hàng khuôn ${h.ma}: vung không phải mảng chuỗi khác rỗng`);
  const { loi: l, canhBao } = C.kiemCo({ dot: 'mau-1' }, tpl, C.napKhoang(path.join(goc, 'skills', 'cat-luot', 'SKILL.md')));
  const v = dongVung([...l, ...canhBao]);
  if (v.length) sai.push(`răng trên khuôn: ${v.join(' | ')}`);
  return sai;
}
if (want('CV-1') && await chay('CV-1', () => cv1())) ok('CV-1', 'mọi hàng khuôn mang vung; khối CAT-LUOT-VUNG nêu `vung`; răng trên đợt mẫu 0 dòng cờ vùng');
if (want('CV-1-do')) {
  try {
    const sai = await cv1(KIT, '1');
    const m = sai.find(s => s.includes('[chua-khai-vung]'));
    const so = sai.join(' ').split('[chua-khai-vung]').length - 1;
    if (so === 1 && /hàng 1 \[chua-khai-vung\]/.test(m)) ok('CV-1-do', `bản sao khuôn bỏ vung hàng 1: «${m.slice(0, 120)}»`);
    else bad('CV-1-do', `mong đúng một cảnh báo chua-khai-vung nêu hàng 1 — ${JSON.stringify(sai)}`);
  } catch (e) { bad('CV-1-do', loi(e)); }
}

// ═══ CV-2: ma trận cờ hàng (AC-2) ═══════════════════════════════════════════════════════════════════════════════
// [nhãn, vung (undefined = vắng), cờ mong đợi ('' = không cờ vùng), mức]
const MA_TRAN = [
  ['R1', ['**'], 'vung-qua-rong', 'lỗi'],
  ['R2', ['*.tsx'], 'vung-qua-rong', 'lỗi'],
  ['R3', ['**/khu/**'], 'vung-qua-rong', 'lỗi'],
  ['R4', 'app/x/**', 'vung-sai-kieu', 'lỗi'],
  ['R5', [], 'vung-sai-kieu', 'lỗi'],
  ['R6', undefined, 'chua-khai-vung', 'cảnh báo'],
  ['R7', ['_acceptance/x/**'], 'vung-chi-ho-so', 'cảnh báo'],
  ['R8', ['app/khu/**'], '', ''],
  ['R9', ['app/khu/man-a/**', 'README.md'], '', ''],
  ['R10', ['app/x/**', '**'], 'vung-qua-rong', 'lỗi'],
  ['R11', ['_acceptance/x/**', 'app/y/**'], '', ''],
  ['R12', ['app/x/**', ''], 'vung-sai-kieu', 'lỗi'],
];
const hangMT = dot => MA_TRAN.map(([ma, vung], i) => ({ ma, cau_giao: 'Người dùng mở màn', vai: 'Người dùng', tieu_chi: 9, dot, phu: [`M${i}`], ...(vung === undefined ? {} : { vung }) }));
async function cv2(goc = KIT) {
  const sai = [];
  const C = await nap(goc);
  const k = C.napKhoang(path.join(goc, 'skills', 'cat-luot', 'SKILL.md'));
  const { loi: l, canhBao } = C.kiemCo({ dot: 'd' }, { schema: 1, hang: hangMT('d') }, k);
  for (const [ma, , co, muc] of MA_TRAN) {
    const cua = [...l.map(x => ['lỗi', x]), ...canhBao.map(x => ['cảnh báo', x])].filter(([, x]) => x.startsWith(`hàng ${ma} [`) && /\[(vung-[a-z-]+|chua-khai-vung)\]/.test(x));
    const duoc = cua.map(([m, x]) => `${m}:${x.match(/\[([a-z-]+)\]/)[1]}`);
    const mong = co ? [`${muc}:${co}`] : [];
    if (JSON.stringify(duoc) !== JSON.stringify(mong)) sai.push(`${ma} ${JSON.stringify(MA_TRAN.find(x => x[0] === ma)[1])}: mong ${JSON.stringify(mong)}, được ${JSON.stringify(duoc)}`);
  }
  const r10 = l.find(x => x.startsWith('hàng R10 ['));
  if (r10 && !r10.includes('**')) sai.push(`R10: lỗi không nêu glob «**» — «${r10}»`);
  const ngoai = C.kiemCo({ dot: 'khac' }, { schema: 1, hang: hangMT('d') }, k);
  const vN = dongVung([...ngoai.loi, ...ngoai.canhBao]);
  if (vN.length) sai.push(`hàng ngoài đợt mang cờ vùng: ${vN.slice(0, 3).join(' | ')}`);
  return sai;
}
if (want('CV-2') && await chay('CV-2', () => cv2())) ok('CV-2', `ma trận ${MA_TRAN.length} hàng × cờ khớp; cùng hàng ở đợt khác 0 cờ vùng`);
if (want('CV-2-do')) await chayDo('CV-2-do', cv2, [['scripts/cat-luot.mjs', /export const coThuMucTinh = g => [^\n]*/, 'export const coThuMucTinh = g => true;']], 'R1 ["**"]', 'bản sao răng: phép thử thư mục tĩnh luôn đúng — CV-2-do: ** lot');
if (want('CV-2-do2')) await chayDo('CV-2-do2', cv2, [['scripts/cat-luot.mjs', 'const rong = r.vung.filter(g => !coThuMucTinh(g));', 'const rong = r.vung.slice(0, 1).filter(g => !coThuMucTinh(g));']], 'R10 ["app/x/**","**"]', 'bản sao răng chỉ xét phần tử đầu — CV-2-do2: tron lot');

// Mã thoát của lệnh răng: 1 khi có lỗi vùng trong đợt, 0 khi chỉ cảnh báo vùng.
function khoThu(hang) {
  const d = mkdtempSync(path.join(TMP, 'kho-'));
  mkdirSync(path.join(d, 'docs'));
  writeFileSync(path.join(d, 'docs', 'pham-vi.md'), `dot: d\ndang: chuoi\nnguon: ca thử\n\n${hang.map(h => `- \`${h.phu[0]}\` — mã ${h.phu[0]}`).join('\n')}\n`);
  writeFileSync(path.join(d, 'docs', 'lo-trinh.json'), JSON.stringify({ schema: 1, hang }, null, 2));
  const g = (...a) => execFileSync('git', ['-C', d, ...a], { stdio: 'ignore' });
  g('init', '-q'); g('add', '.'); g('-c', 'user.name=t', '-c', 'user.email=t@t', 'commit', '-qm', 'thu');
  return d;
}
const rang = d => spawnSync(process.execPath, [path.join(KIT, 'scripts', 'cat-luot.mjs'), '--root', d, '--pham-vi', 'docs/pham-vi.md', '--lo-trinh', 'docs/lo-trinh.json'], { encoding: 'utf8', env: { ...process.env, ACCEPTANCE_TODAY: '2026-10-28' } });
if (want('CV-2-thoat') && await chay('CV-2-thoat', () => {
  const sai = [];
  const h = hangMT('d');
  const coLoi = rang(khoThu(h.filter(x => ['R1', 'R8'].includes(x.ma))));
  if (coLoi.status !== 1 || !/lỗi: hàng R1 \[vung-qua-rong\]/.test(coLoi.stdout)) sai.push(`có lỗi vùng: exit ${coLoi.status} «${coLoi.stdout.slice(-300)}»`);
  const vang = rang(khoThu(h.filter(x => ['R6', 'R8'].includes(x.ma))));
  if (vang.status !== 0 || !/cảnh báo: hàng R6 \[chua-khai-vung\]/.test(vang.stdout)) sai.push(`chỉ cảnh báo: exit ${vang.status} «${vang.stdout.slice(-300)}»`);
  return sai;
})) ok('CV-2-thoat', 'lệnh răng: lỗi vùng → thoát 1; chỉ cảnh báo vùng → thoát 0');

// ═══ CV-3: mọi cặp chồng (AC-3) ═════════════════════════════════════════════════════════════════════════════════
const ba = (v3, so = 3) => ({ schema: 1, hang: [['A', ['app/khu/**']], ['B', ['app/khu/a/**']], ['C', v3]].slice(0, so).map(([ma, vung], i) => ({ ma, cau_giao: 'Người dùng mở màn', vai: 'Người dùng', tieu_chi: 9, dot: 'd', phu: [`Q${i}`], vung })) });
async function cv3(goc = KIT) {
  const sai = [];
  const C = await nap(goc);
  const k = C.napKhoang(path.join(goc, 'skills', 'cat-luot', 'SKILL.md'));
  const moi = data => C.kiemCo({ dot: 'd' }, data, k).loi.filter(x => x.includes('[vung-trung-moi-hang]'));
  const a = moi(ba(['app/khu/a/x.tsx']));
  if (a.length !== 1 || !['A', 'B', 'C'].every(m => a[0].includes(m))) sai.push(`ba hàng mọi cặp chồng: mong một lỗi nêu A, B, C — được ${JSON.stringify(a)}`);
  const b = moi(ba(['app/khac/**']));
  if (b.length) sai.push(`một cặp không chồng: mong im — được ${JSON.stringify(b)}`);
  const c = moi(ba(['app/khu/a/x.tsx'], 2));
  if (c.length) sai.push(`hai hàng chồng: mong im — được ${JSON.stringify(c)}`);
  return sai;
}
if (want('CV-3') && await chay('CV-3', () => cv3())) ok('CV-3', 'ba hàng mọi cặp chồng → một lỗi nêu ba mã; một cặp không chồng → im; hai hàng → im');
if (want('CV-3-do')) await chayDo('CV-3-do', cv3, [['scripts/cat-luot.mjs', /if \(coVung\.length >= 3 && [^\n]*\{/, 'if (false) {']], 'mong một lỗi nêu A, B, C', 'bản sao răng bỏ kiểm quan hệ — CV-3-do: moi cap chong lot');

// ═══ CV-4: phép so chồng của răng là bản chép của phép so của lịch (AC-3) ═══════════════════════════════════════
const CAP = [
  ['apps/web/src/company/company-sheet.tsx', 'apps/web/src/company/**'],
  ['apps/web/src/company/**', 'apps/web/src/company/company-sheet.tsx'],
  ['apps/web/**', 'apps/web/src/company/*.tsx'],
  ['a/b.ts', 'a/b.ts'],
  ['apps/a/**', 'apps/ab/**'],
  ['a/x.tsx', 'a/y.tsx'],
  ['apps/web/src/company/*.tsx', 'apps/web/src/company/sub/x.tsx'],
  ['app/khu/**', 'app/khu/man-a/**'],
  ['app/khu/man-a/**', 'app/khu/man-b/**'],
  ['app/khu-*.ts', 'app/khu/x.ts'],
  ['app/khu-*.ts', 'app/khu-chu.ts'],
  ['a/**/*.ts', 'a/**/*.css'],
  ['ui/man-a/**', 'app/khu/**'],
  ['app/?/x.ts', 'app/b/x.ts'],
];
async function cv4(goc = KIT) {
  const sai = [];
  const C = await nap(goc);
  const T = await import(pathToFileURL(path.join(KIT, 'dieu-phoi', 'scripts', 'trung-tep.mjs')).href);
  for (const [a, b] of CAP) if (C.mauGiao(a, b) !== T.mauGiao(a, b)) sai.push(`lech ${a} × ${b}: răng ${C.mauGiao(a, b)}, lịch ${T.mauGiao(a, b)}`);
  const kh = khoiJs(readFileSync(path.join(goc, 'scripts', 'cat-luot.mjs'), 'utf8'), 'VUNG-GIAO-CHEP');
  if (kh == null) return [...sai, 'răng thiếu khối VUNG-GIAO-CHEP'];
  const than = (t, ten) => { const i = t.indexOf(ten); if (i < 0) return null; const j = t.indexOf('\n}\n', i); return j < 0 ? null : t.slice(i, j + 2); };
  const glob = readFileSync(path.join(KIT, 'dieu-phoi', 'scripts', 'glob.mjs'), 'utf8');
  const tt = readFileSync(path.join(KIT, 'dieu-phoi', 'scripts', 'trung-tep.mjs'), 'utf8');
  for (const [ten, nguon] of [['export function khop(', glob], ['export function mauGiao(', tt]]) {
    const g = than(nguon, ten); const c = than(kh, ten);
    if (!g || !c) sai.push(`thiếu thân ${ten}…`);
    else if (g !== c) sai.push(`thân ${ten}… lệch bản gốc`);
  }
  for (const dong of ['const coDaiDien = (m) => /[*?]/.test(m);']) if (!tt.includes(dong) || !kh.includes(dong)) sai.push(`thiếu dòng chép «${dong}»`);
  return sai;
}
if (want('CV-4') && await chay('CV-4', () => cv4())) ok('CV-4', `${CAP.length} cặp glob: răng = lịch; thân khop, mauGiao chép nguyên văn`);
if (want('CV-4-do')) await chayDo('CV-4-do', cv4, [['scripts/cat-luot.mjs', 'return pa.startsWith(pb) || pb.startsWith(pa);', 'return pa === pb;']], 'lech', 'bản sao khối chép đổi startsWith thành === — CV-4-do: lech <cặp>');

console.log(`\nCV Results: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);

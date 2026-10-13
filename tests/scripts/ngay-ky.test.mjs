// ngay-ky.test.mjs — hồ sơ bo-doc-ho-so-khoan-dung (gốc: hạt giống docs/plans/2026-10-13-hat-giong-ngay-ky-dang-
// ngay-thang-nam.md). MỘT bộ đọc ngày ký `ngayChuKy` (scripts/ho-so-tom-tat.cjs) cho bốn mặt — câu cho người gửi +
// `--cau` (tin-hieu.mjs), bảng điều khiển mở phiên (start-scan.mjs), dải tóm tắt (ho-so-tom-tat.cjs), nhịp của bản
// cắt lượt (cat-luot.mjs). Ca NK-1 (bảng dạng), NK-2 (bốn mặt). Dữ liệu thật bảy kho: rang/bay-kho.mjs, ngoài suite.
//
// Kho thử do mã sinh trong lượt; tín hiệu và bản gom dựng từ khối TIN-HIEU-MAU / GOM-MAU của khuôn tín hiệu (rút lúc
// chạy). Giá trị mong đợi viết sẵn trong ca. Chiều đỏ: bản lành xanh trước, rồi CHÍNH ca chạy trên bản sao cây bị
// tiêm (nhát tiêm khớp đúng một lần) hoặc trên bản base `git archive 3c88d138`.
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, cpSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..', '..');
const BASE_SHA = '3c88d138';
const TMP = mkdtempSync(path.join(tmpdir(), 'ngay-ky-'));
let pass = 0; let fail = 0;
const ok = (id, m = '') => { pass += 1; console.log(`  PASS: ${id}${m ? ` — ${m}` : ''}`); };
const bad = (id, m) => { fail += 1; console.log(`  FAIL: ${id} — ${m}`); };
const only = (process.env.NK_CASES || '').split(',').map(s => s.trim()).filter(Boolean);
const want = id => !only.length || only.some(o => id === o || id.startsWith(o + '-'));
const loi = e => String((e && (e.stack || e.message)) || e).split('\n').slice(0, 4).join(' | ');
const git = (d, ...a) => execFileSync('git', ['-C', d, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const node = (args, o = {}) => spawnSync(process.execPath, args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, ...o });

// Bản cây: sha → git archive; tiem → chép cây đang kiểm rồi tiêm (mỗi nhát khớp đúng một lần).
let cayN = 0;
function cay({ sha = null, tiem = [] } = {}) {
  const c = path.join(TMP, `cay-${++cayN}`); mkdirSync(c, { recursive: true });
  const D = ['scripts', 'lib', 'skills', 'dieu-phoi'];
  if (sha) execFileSync('bash', ['-c', `git -C "${KIT}" archive ${sha} ${D.join(' ')} | tar -x -C "${c}"`]);
  else for (const d of D) cpSync(path.join(KIT, d), path.join(c, d), { recursive: true });
  for (const [tep, cu, moi] of tiem) {
    const p = path.join(c, tep); const s = readFileSync(p, 'utf8'); const n = s.split(cu).length - 1;
    if (n !== 1) throw new Error(`nhát tiêm vào ${tep} khớp ${n} lần (cần 1): ${cu.slice(0, 60)}`);
    writeFileSync(p, s.replace(cu, moi));
  }
  return c;
}
// Nhát tiêm tháng-trước: đổi chỗ ngày và tháng trong nhánh ngày/tháng/năm của bộ đọc chung.
const TIEM_THANG_TRUOC = ['scripts/ho-so-tom-tat.cjs', 'const d = Number(x[1]); const mo = Number(x[2]);', 'const d = Number(x[2]); const mo = Number(x[1]);'];

// ── NK-1: bảng dạng chữ ký (AC-5) ─────────────────────────────────────────────
const BANG = [
  ['Tên 2026-09-10', '2026-09-10'],
  ['Tên 2026-09-10T08:00:00Z', '2026-09-10'],
  ['Tên 10/08/2026 sửa 2026-09-10', '2026-09-10'],
  ['Tên 1/9/2026', '2026-09-01'],
  ['Tên 10/09/2026 — ghi chú', '2026-09-10'],
  ['Tên 32/13/2026', null],
  ['Tên 31/02/2026', null],
  ['Tên 13/10', null],
  ['Tên', null],
  ['', null],
];
function nk1(kit) {
  const { ngayChuKy } = createRequire(import.meta.url)(path.join(kit, 'scripts', 'ho-so-tom-tat.cjs'));
  if (typeof ngayChuKy !== 'function') return ['ho-so-tom-tat.cjs không xuất ngayChuKy'];
  const sai = []; let so = 0;
  for (const [s, mong] of BANG) { so += 1; const r = ngayChuKy(s); if (r !== mong) sai.push(`dạng ${JSON.stringify(s)}: mong ${mong}, được ${r}`); }
  console.log(`  so o: ${so}`);
  if (so !== BANG.length) sai.push(`ma trận hụt: ${so}/${BANG.length}`);
  return sai;
}
if (want('NK-1')) { try { const s = nk1(KIT); if (s.length) bad('NK-1', s.join(' · ')); else ok('NK-1', `${BANG.length} dạng đúng bảng`); } catch (e) { bad('NK-1', loi(e)); } }
if (want('NK-1-do')) {
  try {
    const lanh = nk1(KIT); if (lanh.length) throw new Error(`bản lành chưa xanh: ${lanh[0]}`);
    const s = nk1(cay({ tiem: [TIEM_THANG_TRUOC] }));
    const g = s.find(x => x.includes('"Tên 10/09/2026 — ghi chú"'));
    if (g) ok('NK-1-do', `bản sao tháng-trước: «${g}»`); else bad('NK-1-do', `bản sao tháng-trước không đỏ ở dạng 10/09/2026: ${JSON.stringify(s)}`);
  } catch (e) { bad('NK-1-do', loi(e)); }
}

// ── NK-2: bốn mặt trên kho thử (AC-6) ─────────────────────────────────────────
const khoiMd = (txt, ten) => { const m = String(txt).match(new RegExp(`<!-- <<<${ten} -->\\n\`\`\`[a-z]*\\n([\\s\\S]*?)\`\`\`\\n<!-- ${ten}>>> -->`)); return m ? m[1] : null; };
const KHUON = readFileSync(path.join(KIT, 'skills', 'acceptance', 'references', 'tin-hieu-template.md'), 'utf8');
function tin(i) {
  const b = khoiMd(KHUON, 'TIN-HIEU-MAU'); if (b == null) throw new Error('khuôn thiếu khối TIN-HIEU-MAU');
  const o = JSON.parse(b.trim().split('\n').slice(1).join('\n'));
  o.noi_dung.tieu_de = `tín hiệu thử số ${i}`; o.luc = '2026-10-20T00:00:00Z';
  return { id: `${o.phien}-${i}`, o };
}
function gom(phuId, slug) {
  const b = khoiMd(KHUON, 'GOM-MAU'); if (b == null) throw new Error('khuôn thiếu khối GOM-MAU');
  const L = b.split('\n');
  const dau = L.filter(l => /^(dot|dang|nguon|truc|den):/.test(l)).map(l => l.replace(/^dot:.*/, 'dot: gom-1').replace(/^den:.*/, 'den: 2026-10-28T00:00:00Z'));
  const phu = L.find(l => l.startsWith('- đã phủ ')).replace(/`[^`]*`/, `\`${phuId}\``).replace(/ — .*$/, ` — ${slug}`);
  return [...dau, '', '', phu].join('\n') + '\n';
}
const SL = 'giao-x';
const WR = createRequire(import.meta.url)(path.join(KIT, 'lib', 'workspace-record.cjs'));
const GIAO = WR.DA_THONG_CONG_2[0];
function khoNgay(ky) {
  const r = path.join(TMP, `kho-${++cayN}`);
  execFileSync('git', ['init', '-q', '-b', 'main', r]); git(r, 'config', 'user.email', 'x@y.z'); git(r, 'config', 'user.name', 'x');
  const t = tin(1);
  const tep = {
    '_acceptance/config.yaml': 'schema_version: 1\nrisk_tiers:\n  t1_skip_globs:\n    - "PRODUCT-MAP.md"\n    - "LO-TRINH.html"\nlo_trinh:\n  tep: docs/lo-trinh.json\ntin_hieu:\n  nguon: tin-hieu\n  gom: docs/gom\n',
    [`tin-hieu/${t.id}.json`]: JSON.stringify(t.o),
    'docs/gom/gom-1.md': gom(t.id, SL),
    'docs/lo-trinh.json': JSON.stringify({ schema: 1, ten: 'Lộ trình thử', hang: [{ ma: 'H1', slug: SL, cau_giao: '«Việc đã giao thử»' }] }, null, 2),
    [`_acceptance/${SL}/contract.md`]: `---\nschema_version: 1\nfeature: «Việc đã giao thử»\nslug: ${SL}\nowner: x@y.z\nrisk_tier: T2\nsurfaces: [cli]\nstatus: ${GIAO}\napproved_by: M\napproved_at: 2026-09-01T00:00:00Z\n---\n\n## Criteria\n\n- AC-1: Given a, When b, Then c.\n\n## Out of scope\n\n- x\n- y\n`,
    [`_acceptance/${SL}/evidence-report.md`]: `---\nschema_version: 1\nfeature_slug: ${SL}\nverdict: PASS\nhuman_signoff: ${ky}\n---\n\n## Evidence\n`,
  };
  for (const [f, s] of Object.entries(tep)) { mkdirSync(path.dirname(path.join(r, f)), { recursive: true }); writeFileSync(path.join(r, f), s); }
  git(r, 'add', '-A'); git(r, '-c', 'commit.gpgsign=false', 'commit', '-qm', 'kho thu');
  return { r, id: t.id };
}
const timAt = (o, slug) => { // tìm `at` của mục mang slug trong JSON của start-scan (cấu trúc nhóm không cần biết)
  if (Array.isArray(o)) { for (const x of o) { const v = timAt(x, slug); if (v !== undefined) return v; } return undefined; }
  if (o && typeof o === 'object') { if (o.slug === slug && 'at' in o) return o.at; for (const v of Object.values(o)) { const w = timAt(v, slug); if (w !== undefined) return w; } }
  return undefined;
};
// Bốn mặt của một cây trên một kho → { tinHieu, cauThoat, start, dai, nhip }.
async function bonMat(kit, { r, id }) {
  const th = (...a) => node([path.join(kit, 'scripts', 'tin-hieu.mjs'), '--root', r, ...a]);
  const duong = th('--duong'); let cau = null;
  try { cau = (JSON.parse(duong.stdout).find(d => d.id === id) || {}).cau_nguoi_gui ?? null; } catch (_) { cau = `(--duong thoát ${duong.status})`; }
  const kc = th('--cau');
  const ss = node([path.join(kit, 'scripts', 'start-scan.mjs'), '--root', r]);
  let start = null; try { start = timAt(JSON.parse(ss.stdout), SL) ?? null; } catch (_) { start = `(start-scan thoát ${ss.status})`; }
  const HS = createRequire(import.meta.url)(path.join(kit, 'scripts', 'ho-so-tom-tat.cjs'));
  const t = HS.tomTatHoSo(path.join(r, '_acceptance', SL));
  const dai = (t && t.chiTiet && t.chiTiet.giao && t.chiTiet.giao.ngayKy) ?? null;
  const CL = await import(pathToFileURL(path.join(kit, 'scripts', 'cat-luot.mjs')).href + `?v=${cayN}`);
  const n = CL.nhip(r);
  return { cau, cauThoat: kc.status, cauOut: kc.stdout + kc.stderr, start, dai, nhip: n };
}
const KY = 'Tên 10/09/2026 — ghi chú';
async function nk2(kit) {
  const k = khoNgay(KY); const m = await bonMat(kit, k); const sai = [];
  if (!String(m.cau).includes('ngày 10/9/2026')) sai.push(`câu cho người gửi thiếu «ngày 10/9/2026»: ${JSON.stringify(m.cau)}`);
  if (m.cauThoat !== 0) sai.push(`--cau thoát ${m.cauThoat}: ${m.cauOut.slice(0, 200)}`);
  if (m.start !== '2026-09-10') sai.push(`bảng điều khiển: ngày xong ${JSON.stringify(m.start)}`);
  if (m.dai !== '2026-09-10') sai.push(`dải tóm tắt: ngày ký ${JSON.stringify(m.dai)}`);
  if (m.nhip.bo_qua !== 0 || !m.nhip.hang.T2 || m.nhip.hang.T2.n !== 1 || m.nhip.hang.T2.trung_vi !== 9) sai.push(`nhịp: ${JSON.stringify(m.nhip)}`);
  return { sai, m };
}
if (want('NK-2')) { try { const { sai } = await nk2(KIT); if (sai.length) bad('NK-2', sai.join(' · ')); else ok('NK-2', 'câu «ngày 10/9/2026», --cau 0, bảng điều khiển + dải 2026-09-10, nhịp T2 một mẫu 9 ngày'); } catch (e) { bad('NK-2', loi(e)); } }
if (want('NK-2-do')) {
  try {
    const lanh = await nk2(KIT); if (lanh.sai.length) throw new Error(`bản lành chưa xanh: ${lanh.sai[0]}`);
    const b = await bonMat(cay({ sha: BASE_SHA }), khoNgay(KY));
    const mat = [];
    if (!String(b.cau).includes('ngày 10/9/2026')) mat.push('câu cho người gửi');
    if (b.start !== '2026-09-10') mat.push('bảng điều khiển');
    if (b.dai !== '2026-09-10') mat.push('dải tóm tắt');
    if (b.nhip.bo_qua === 1) mat.push('nhịp');
    for (const x of mat) console.log(`  base mất ngày: ${x}`);
    if (b.cauThoat !== 0) console.log(`  base --cau đỏ (thoát ${b.cauThoat})`);
    if (mat.length === 4 && b.cauThoat !== 0) ok('NK-2-do', `base ${BASE_SHA} mất ngày ở cả bốn mặt, --cau đỏ`);
    else bad('NK-2-do', `base chỉ mất ngày ở ${mat.length}/4 mặt (${mat.join(', ')}), --cau thoát ${b.cauThoat} — phép đo không phân biệt được bản mới`);
  } catch (e) { bad('NK-2-do', loi(e)); }
}
if (want('NK-2-giu')) {
  try {
    const m = await bonMat(KIT, khoNgay('Tên'));
    if (m.cauThoat !== 0 && m.cauOut.includes('không đọc được ngày')) ok('NK-2-giu', 'chữ ký không ngày → --cau đỏ «không đọc được ngày»');
    else bad('NK-2-giu', `chữ ký không ngày: --cau thoát ${m.cauThoat}, ${m.cauOut.slice(0, 200)}`);
  } catch (e) { bad('NK-2-giu', loi(e)); }
}

rmSync(TMP, { recursive: true, force: true });
console.log(`NK Results: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);

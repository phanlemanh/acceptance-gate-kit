// tests/plugins/bang-dieu-khien.test.mjs — ca hồ sơ start-bang-dieu-khien (BDK1–BDK4).
// Fixture CODE-SINH trong chính lần chạy, chạy start-scan.mjs THẬT; đường dẫn suy từ vị
// trí file; mỗi ca có đối chứng dương + chiều đỏ ghim thông điệp.
//   BDK_CASES=BDK1,BDK2 node tests/plugins/bang-dieu-khien.test.mjs
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');
const SCAN = path.join(ROOT, 'scripts', 'start-scan.mjs');
const START_MD = path.join(ROOT, 'commands', 'start.md');
const require = createRequire(import.meta.url);

let failures = 0;
// MỘT nguồn danh sách ca: file này. `--ids` in ra để run-tests.sh lặp theo, không chép tay.
const ALL_IDS = ['BDK1', 'BDK2', 'BDK3', 'BDK4'];
if (process.argv.includes('--ids')) { console.log(ALL_IDS.join(' ')); process.exit(0); }
const only = (process.env.BDK_CASES || '').split(',').map(s => s.trim()).filter(Boolean);
const ran = new Set();
const want = id => { const w = only.length === 0 || only.includes(id); if (w) ran.add(id); return w; };
// Ranh giới cứng quanh id: `PASS: [BDK1]` không là tiền tố của ca anh em.
const pass = (id, name) => console.log(`PASS: [${id}] ${name}`);
const fail = (id, msg) => { console.log(`FAIL: [${id}] ${msg}`); failures++; };

const tmp = () => mkdtempSync(path.join(tmpdir(), 'bdk-'));
const W = (root, rel, s) => { const p = path.join(root, rel); mkdirSync(path.dirname(p), { recursive: true }); writeFileSync(p, s); return p; };
const fx = () => { const r = tmp(); W(r, '_acceptance/config.yaml', 'schema_version: 1\n'); return r; };
const scan = (root, script = SCAN) => {
  const r = spawnSync(process.execPath, [script, '--root', root], { encoding: 'utf8' });
  if (r.status !== 0) return { status: r.status, stderr: r.stderr, groups: {}, broken: [] };
  return JSON.parse(r.stdout);
};

// ── BDK2: bảng trạng-thái→chữ — ma trận TOÀN PHẦN + mọi bộ đọc rút từ bảng ────
if (want('BDK2')) {
  const errs = [];
  let BANG = null;
  try { BANG = require(path.join(ROOT, 'scripts', 'trang-thai-ho-so.cjs')); }
  catch (e) { errs.push(`không nạp được bảng: ${e.message}`); }

  if (BANG) {
    // Ma trận TOÀN PHẦN viết TRƯỚC: 20 khoá gõ tay, KHÔNG sinh từ chính bảng.
    // Viết `=== Object.keys(BANG.TRANG_THAI).length` một mình là hằng đúng — cấm.
    const KHOA = ['y-can-nhac', 'cho-cong-dang', 'sap-mo-vong', 'xep-lai', 'da-bac',
      'cho-cong-pham-vi', 'dang-lap-ke-hoach', 'dang-viet-code', 'cho-nghiem-thu-may',
      'dang-sua-theo-bang-chung', 'nghiem-thu-bi-chan', 'cho-cong-bang-chung',
      'may-di-tiep-veto-mo', 'may-di-tiep-xanh-sach', 'da-giao', 'cho-cong-gia-tri',
      'da-nghiem-thu-release', 'da-nghiem-thu-iterate', 'da-nghiem-thu-kill', 'ho-so-hong'];
    const N = 20;
    if (KHOA.length !== N) errs.push(`danh sách ca ${KHOA.length} != ${N}`);
    if (Object.keys(BANG.TRANG_THAI).length !== N)
      errs.push(`bảng khai ${Object.keys(BANG.TRANG_THAI).length} khoá != ${N} — thêm khoá thì thêm ca`);
    // Ô của bản đồ là danh sách ĐÓNG — rút từ chính product-map.mjs lúc chạy, không chép tay
    const pmSrc = readFileSync(path.join(ROOT, 'scripts', 'product-map.mjs'), 'utf8');
    const secBlock = (pmSrc.match(/const SECTIONS = \[([\s\S]*?)\];/) || [])[1] || '';
    const O_BAN_DO = new Set([...secBlock.matchAll(/\['([a-z-]+)',/g)].map(m => m[1]));
    if (O_BAN_DO.size !== 11) errs.push(`rút được ${O_BAN_DO.size} ô bản đồ từ product-map.mjs, mong 11`);
    for (const k of KHOA) {
      const c = BANG.TRANG_THAI[k];
      if (!c) { errs.push(`bảng thiếu khoá ${k}`); continue; }
      if (!c.nhan || !c.viecKe) errs.push(`khoá ${k} thiếu nhan/viecKe`);
      const b = BANG.BUCKET_OF[k];
      if (!b) errs.push(`khoá ${k} không có ô bản đồ trong BUCKET_OF`);
      else if (!O_BAN_DO.has(b)) errs.push(`khoá ${k} chiếu về ô «${b}» không có trong SECTIONS của bản đồ`);
    }
    // khoá lạ phải CHẾT TO, không trả mặc định câm
    let threw = false;
    try { BANG.chu('khoa-khong-ton-tai'); } catch (e) { threw = /khoa-khong-ton-tai/.test(e.message); }
    if (!threw) errs.push('chu() với khoá lạ không throw nêu tên khoá');

    // ── máy quét: MỌI phần tử mang stateKey ∈ bảng, và label/viecKe rút TỪ bảng ──
    const j = scan(ROOT);
    const all = [...(j.groups.gates || []), ...(j.groups.inProgress || []),
                 ...(j.groups.considering || []), ...(j.groups.done || []), ...(j.broken || [])];
    if (all.length < 50) errs.push(`sàn đếm: chỉ ${all.length} phần tử trên cây thật — phép đo chưa chạy`);
    for (const it of all) {
      const c = BANG.TRANG_THAI[it.stateKey];
      if (!c) { errs.push(`${it.slug}: stateKey lạ «${it.stateKey}»`); continue; }
      if (it.label !== c.nhan) errs.push(`${it.slug}: label «${it.label}» lệch bảng «${c.nhan}»`);
      if (it.viecKe !== c.viecKe) errs.push(`${it.slug}: viecKe lệch bảng`);
    }

    // ── acceptance-status.md: ALLOWLIST, không blacklist ──
    // Không gian nhãn là MỞ: cấm «Chờ người ký» thì bên viết đặt «Đợi chữ ký» và ca
    // vẫn xanh. Rút MỌI nhãn ứng viên rồi assert TẬP CON của bảng.
    const md = readFileSync(path.join(ROOT, 'commands', 'acceptance-status.md'), 'utf8');
    const blk = (md.match(/<!-- <<<STATUS-NHAN\n([\s\S]*?)STATUS-NHAN>>> -->/) || [])[1];
    if (blk === undefined) errs.push('không thấy khối STATUS-NHAN trong acceptance-status.md');
    else {
      const nhan = [...blk.matchAll(/^\s*[-*]\s+«([^»]+)»/gm)].map(m => m[1]);
      const hop = new Set(Object.values(BANG.TRANG_THAI).flatMap(c => [c.nhan, c.viecKe]));
      for (const n of nhan) if (!hop.has(n)) errs.push(`nhãn ngoài bảng: ${n}`);
    }
    if (/Chờ người ký|Chờ code|Phase 3 của skill/.test(md))
      errs.push('acceptance-status.md còn danh sách if tự chế chữ');
  }
  if (errs.length) fail('BDK2', errs.join(' · '));
  else pass('BDK2', 'bảng 20 khoá (ma trận toàn phần, hai vế độc lập) · máy quét rút chữ từ bảng · nhãn bảng trạng thái theo allowlist · khoá lạ chết to');
}

// BDK_CASES nêu id không tồn tại → không được xanh im lặng (xanh-không-chạy)
const unknown = only.filter(id => !ran.has(id));
if (unknown.length) { console.log(`FAIL: [BDK_CASES] không khớp ca nào: ${unknown.join(',')}`); failures++; }
if (failures) { console.log(`bang-dieu-khien: ${failures} ca đỏ`); process.exit(1); }

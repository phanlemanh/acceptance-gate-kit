// khuon-loi.test.mjs — hồ sơ khuon-loi (hàng KH1, mốc 2.37.0): bộ đọc bản đồ khuôn dùng chung, lệnh khuôn, bước
// chấm, số đo + dòng thẻ, lưới s4-args.
//
// Luật đo:
//  - Kho mẫu do code sinh trong lượt (`khuon-loi-kho-mau.mjs`); gọi CHÍNH script của cây đang kiểm như tiến trình con
//    hay nạp bằng `createRequire`.
//  - Ma trận + kỳ vọng VIẾT TRƯỚC (hằng), không tính từ mã sản phẩm; ca ma trận in «số hàng: N».
//  - Chiều đỏ: mỗi ca «-do»/«-m» chạy CHÍNH hàm kiểm trên bản sao TRỌN `scripts/` + `lib/` (thêm `feature-loop/` cho
//    KL-11) bị tiêm đúng một nhát (khớp đúng một lần), SAU khi bản lành xanh trên cùng fixture; ghim thông điệp lỗi.
//  - Tên ca = mã ca của evals.yaml; KL_CASES chọn ca; mã lạ → thoát 2.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { KIT, taoKhoMau, nhanh, banSaoTiem, ghi, git, chay, khoiMarker, thuMuc, BAN_DO } from './khuon-loi-kho-mau.mjs';

const LENH = 'scripts/design-floor-khuon.mjs';
const TEMPLATE = path.join(KIT, 'skills', 'acceptance', 'references', 'ban-do-khuon-template.md');

const CA = ['KL-1', 'KL-1-do', 'KL-1-tao', 'KL-2', 'KL-2-do', 'KL-3', 'KL-4', 'KL-4-do', 'KL-5', 'KL-5-m1', 'KL-5-m2', 'KL-6', 'KL-9', 'KL-9-do', 'KL-10'];
const chon = (process.env.KL_CASES || '').split(',').map(s => s.trim()).filter(Boolean);
const la = chon.filter(c => !CA.includes(c));
if (la.length) { console.error(`khuon-loi.test: mã ca lạ: ${la.join(', ')} (biết: ${CA.join(', ')})`); process.exit(2); }
const want = c => (chon.length ? chon.includes(c) : true);

const require = createRequire(import.meta.url);
const docLai = kit => { const p = path.join(kit, 'scripts', 'ban-do-khuon.cjs'); delete require.cache[require.resolve(p)]; return require(p); };
let hong = 0;
const ket = (ma, loi) => {
  if (!loi.length) console.log(`PASS: [${ma}]`);
  else { hong++; console.log(`FAIL: [${ma}] ${loi.join(' | ')}`); }
};
let _khoSong = null;
const khoSong = () => (_khoSong ||= taoKhoMau());
// Ca đỏ: bản lành phải xanh trên cùng fixture, bản sao phải đỏ với đúng thông điệp ghim.
const caDo = (ma, kiem, lanh, saoTiem, thongDiep) => {
  if (lanh.length) return ket(ma, [`bản lành chưa xanh: ${lanh.join(' | ')}`]);
  let loi;
  try {
    const sao = saoTiem();
    // Bản sao phải CHẠY được — bản sao im lặng (main không chạy, thoát 0) cho đúng màu «đỏ» của nhiều ca mà không đo gì.
    const song = chay(sao, 'scripts/design-floor-khuon.mjs', ['--root', khoSong(), '--dem']);
    if (song.out.trim() !== 'khuôn: 3 nhóm (2 màn · 1 phần tử)') return ket(ma, [`hạ tầng ca: bản sao không chạy (--dem in «${song.out.trim()}», thoát ${song.ma})`]);
    loi = kiem(sao);
  } catch (e) { return ket(ma, [`hạ tầng ca: ${e.message}`]); }
  ket(ma, loi.some(x => x.includes(thongDiep)) ? [] : [`bản tiêm không cho lỗi «${thongDiep}» (lỗi: ${loi.join(' | ') || 'không có'})`]);
};

// ── KL-1: bộ đọc — hai dạng YAML, sai lược đồ, cờ vàng, sổ đăng ký, tên dành riêng ──────────────────────────────
const KHOI = `---
nhom: a
doi_tuong: màn a
khuon:
  ten: KhungA     # khuôn a
  nhap: "@/khuon/KhungA"
nhan_dien:
  - 'src/a/**/*.tsx'
mau_dang_chay:
  tep: src/a/Mau.tsx
khe_bat_buoc:
  - title
cam_ngoai_khuon:
  - Hop
cam_ho:
  - Hop
thay_cho:
  Hop: KhungA.Hop
ngoai_le:
  - tep: src/a/Cu.tsx
    khoi: Hop
    ly_do: chờ dời
nhan_viec: tra cứu
---
## Dùng khi
Màn a.
## Không dùng
Màn b.
`;
const MOT_DONG = `---
nhom: a
doi_tuong: màn a
khuon: {ten: KhungA, nhap: "@/khuon/KhungA"}   # khuôn a
nhan_dien: ['src/a/**/*.tsx']
mau_dang_chay: {tep: src/a/Mau.tsx}
khe_bat_buoc: [title]
cam_ngoai_khuon: [Hop]
cam_ho: [Hop]
thay_cho: {Hop: KhungA.Hop}
ngoai_le: [{tep: src/a/Cu.tsx, khoi: Hop, ly_do: chờ dời}]
nhan_viec: tra cứu
---
**Dùng khi:** màn a.
**Không dùng:** màn b.
`;
function kiemKL1(kit) {
  const B = docLai(kit);
  const loi = [];
  const a = B.docBanDo(KHOI, 'a.md');
  const b = B.docBanDo(MOT_DONG, 'a.md');
  const bo = x => { const { dung_khi, ...r } = x.nhom || {}; return JSON.stringify(r); };   // câu «Dùng khi» viết hoa/thường khác nhau giữa hai mẫu
  if (a.sai.length || b.sai.length) loi.push(`hai dạng mẫu có sai: ${[...a.sai, ...b.sai].join('; ')}`);
  if (bo(a) !== bo(b)) loi.push(`hai dạng YAML ra hai bản chuẩn hoá: ${bo(a)} ≠ ${bo(b)}`);
  const hang = [
    ['khoá lạ', KHOI.replace('nhan_viec:', 'mau_sac: do\nnhan_viec:'), r => r.canh_bao.some(x => x.includes('khoá lạ: mau_sac'))],
    ['thiếu Dùng khi', KHOI.replace('## Dùng khi\nMàn a.\n', ''), r => r.canh_bao.some(x => x.includes('thiếu «Dùng khi»'))],
    ['thiếu nhan_viec', KHOI.replace('nhan_viec: tra cứu\n', ''), r => r.canh_bao.some(x => x.includes('thiếu nhan_viec'))],
    ['thiếu khuon', KHOI.replace(/khuon:\n {2}ten: KhungA {5}# khuôn a\n {2}nhap: "@\/khuon\/KhungA"\n/, ''), r => r.sai.some(x => x.includes('a.md: thiếu khoá khuon'))],
    ['cam_ho ngoài cam', KHOI.replace('cam_ho:\n  - Hop', 'cam_ho:\n  - Hop\n  - La'), r => r.sai.some(x => x.includes('La'))],
    ['sổ đăng ký', KHOI.replace("nhan_dien:\n  - 'src/a/**/*.tsx'", 'nhan_dien:\n  dang_ky: src/khuon/so.ts\n  kind: [bang]'), r => r.nhom && r.nhom.nhan_dien === null && (r.nhom.khong_doc_duoc || '').includes('sổ đăng ký')],
  ];
  for (const [ten, txt, dung] of hang) if (!dung(B.docBanDo(txt, 'a.md'))) loi.push(`hàng «${ten}» trượt`);
  const r = B.docBanDo(KHOI.replace('    ly_do: chờ dời\n', ''), 'a.md');
  if (!r.sai.some(x => x.includes('ngoai_le thiếu ly_do'))) loi.push('ngoại lệ thiếu lý do mà không sai');
  // Tên dành riêng: lech-lot.md + README.md không phải nhóm.
  const kho = taoKhoMau();
  const truoc = B.docThuMuc(kho);
  ghi(kho, 'design/patterns/lech-lot.md', '# Sổ lệch lọt\n\n- 2026-11-01 · src/x.tsx · Hop · lọt\n');
  ghi(kho, 'design/patterns/README.md', '# Bản đồ khuôn\n');
  const sau = B.docThuMuc(kho);
  if (truoc.nhom.length !== Object.keys(BAN_DO).length) loi.push(`kho mẫu đọc ra ${truoc.nhom.length} nhóm (cần ${Object.keys(BAN_DO).length})`);
  if (truoc.sai.length) loi.push(`kho mẫu có sai: ${truoc.sai.join('; ')}`);
  if (sau.nhom.length !== truoc.nhom.length || sau.sai.length !== truoc.sai.length) loi.push('lech-lot.md/README.md bị đọc như nhóm');
  return loi;
}
if (want('KL-1') || want('KL-1-do')) {
  const lanh = kiemKL1(KIT);
  if (want('KL-1')) ket('KL-1', lanh);
  if (want('KL-1-do')) caDo('KL-1-do', kiemKL1, lanh, () => banSaoTiem(['scripts', 'lib'], 'scripts/ban-do-khuon.cjs', 'if (!n.ly_do) sai.push(', 'if (false) sai.push('), 'ngoại lệ thiếu lý do mà không sai');
}

// ── KL-1-tao: --tao sinh tệp nhóm từ khối marker, đọc ra 0 sai ─────────────────────────────────────────────────
if (want('KL-1-tao')) {
  const loi = [];
  const kho = taoKhoMau();
  const r = chay(KIT, LENH, ['--root', kho, '--tao', 'bang-moi']);
  const tep = path.join(kho, 'design', 'patterns', 'bang-moi.md');
  if (r.ma !== 0) loi.push(`--tao thoát ${r.ma}: ${r.err.trim()}`);
  else if (!fs.existsSync(tep)) loi.push('--tao không sinh design/patterns/bang-moi.md');
  else {
    const mong = khoiMarker(TEMPLATE, 'BAN-DO-KHUON-TEMPLATE').replaceAll('<nhom>', 'bang-moi') + '\n';
    const that = fs.readFileSync(tep, 'utf8');
    if (that !== mong) loi.push('tệp sinh ra khác khối marker BAN-DO-KHUON-TEMPLATE');
    const d = docLai(KIT).docBanDo(that, 'design/patterns/bang-moi.md');
    if (d.sai.length) loi.push(`tệp sinh ra có sai: ${d.sai.join('; ')}`);
    const lai = chay(KIT, LENH, ['--root', kho, '--tao', 'bang-moi']);
    if (lai.ma !== 2) loi.push(`--tao trên tệp đã có thoát ${lai.ma} (cần 2)`);
  }
  ket('KL-1-tao', loi);
}

// ── KL-10: S0 đếm, S1 nạp + chỉ mục (phần SKILL/khuôn UX nối ở Task 6) ─────────────────────────────────────────
function kiemKL10Lenh(kit) {
  const loi = [];
  const kho = taoKhoMau();
  const dem = chay(kit, LENH, ['--root', kho, '--dem']);
  if (dem.ma !== 0 || dem.out.trim() !== 'khuôn: 3 nhóm (2 màn · 1 phần tử)') loi.push(`--dem in «${dem.out.trim()}» (thoát ${dem.ma})`);
  fs.mkdirSync(path.join(kho, '_acceptance', 'h'), { recursive: true });
  const nap = chay(kit, LENH, ['--root', kho, '--nap', '--slug', 'h']);
  if (nap.ma !== 0) loi.push(`--nap thoát ${nap.ma}: ${nap.err.trim()}`);
  const dong = nap.out.trim().split('\n').filter(Boolean);
  if (dong.length !== 3) loi.push(`--nap in ${dong.length} dòng (cần 3)`);
  const B = docLai(kit);
  for (const n of B.docThuMuc(kho).nhom) {
    const d = dong.find(x => x.startsWith(`${n.nhom} · `));
    if (!d) { loi.push(`--nap không có dòng nhóm ${n.nhom}`); continue; }
    for (const can of [n.doi_tuong, n.nhan_viec, n.dung_khi, n.tep, n.mau_dang_chay.tep]) if (!d.includes(can)) loi.push(`dòng ${n.nhom} thiếu «${can}»`);
  }
  let nj = null;
  try { nj = JSON.parse(fs.readFileSync(path.join(kho, '_acceptance', 'h', 'khuon-nap.json'), 'utf8')); } catch (_) { loi.push('không đọc được khuon-nap.json'); }
  if (nj) for (const f of Object.keys(BAN_DO)) {
    const ten = f.replace(/\.md$/, '');
    const bam = git(kho, 'rev-parse', `HEAD:design/patterns/${f}`).trim();
    if (!nj.ghim || nj.ghim[ten] !== bam) loi.push(`ghim nhóm ${ten} = ${nj.ghim && nj.ghim[ten]} (cần ${bam})`);
  }
  return loi;
}
if (want('KL-10')) ket('KL-10', kiemKL10Lenh(KIT));

// ── Bước chấm: tiện ích chung ────────────────────────────────────────────────────────────────────────────────
const manBang = (nhap = '', jsx = '') => `import { KhungBang } from '@/khuon/KhungBang';\n${nhap}export default function M() {\n  return <KhungBang>${jsx}</KhungBang>;\n}\n`;
const manForm = (nhap = '', jsx = '') => `import { KhungForm } from '@/khuon/KhungForm';\n${nhap}export default function M() {\n  return <KhungForm>${jsx}</KhungForm>;\n}\n`;
const kiem = (kit, kho, them = []) => chay(kit, LENH, ['--root', kho, '--kiem', ...them]);
const dongLech = r => r.out.split('\n').filter(l => l.startsWith('lệch:'));

// ── KL-3: bảy dạng lệch, mỗi dạng đúng một dòng ──────────────────────────────────────────────────────────────
const MA_TRAN_KL3 = [
  { ten: 'nhập tên gốc', tep: 'src/man/bang/Moi.tsx', noi: manBang("import { Hop } from '@/ui/Hop';\n", '<Hop />'), can: [' · Hop · ', 'nhóm bang-du-lieu', 'dùng KhungBang.HopLoc'] },
  { ten: 'đổi tên bằng as', tep: 'src/man/form/Moi.tsx', noi: manForm("import { Hop as H } from '@/ui/Hop';\n", '<H />'), can: [' · Hop · ', 'nhóm form-nhap'] },
  { ten: 'nhập mặc định', tep: 'src/man/form/Moi.tsx', noi: manForm("import Hop from '@/ui/Hop';\n", '<Hop />'), can: [' · Hop · ', 'nhóm form-nhap'] },
  { ten: 'ns.Khoi', tep: 'src/man/form/Moi.tsx', noi: manForm("import * as ui from '@/ui';\n", '<ui.Hop />'), can: [' · Hop · ', 'nhóm form-nhap'] },
  { ten: 'họ cấm', tep: 'src/man/bang/Moi.tsx', noi: manBang("import { HopTieuDe } from '@/ui/Hop';\n", '<HopTieuDe />'), can: [' · HopTieuDe · ', 'nhóm bang-du-lieu'] },
  { ten: 'không dựng khuôn', tep: 'src/man/form/Trong.tsx', noi: 'export default function T() {\n  return <div />;\n}\n', can: ['khuôn KhungForm', 'nhóm form-nhap'] },
  { ten: 'thiếu khe', tep: 'src/man/bang/Moi.tsx', noi: manBang("import { TrangThaiMau } from '@/khuon/TrangThaiMau';\n", '<TrangThaiMau />'), can: ['TrangThaiMau thiếu khe title', 'nhóm trang-thai'] },
];
if (want('KL-3')) {
  const loi = [];
  console.log(`số hàng: ${MA_TRAN_KL3.length}`);
  const kho = taoKhoMau();
  nhanh(kho, 'duong', { 'src/man/form/man hop/Trang.tsx': manForm() });
  const d = kiem(KIT, kho);
  if (d.ma !== 0 || dongLech(d).length) loi.push(`đối chứng dương thoát ${d.ma}, ${dongLech(d).length} dòng lệch: ${d.out}${d.err}`);
  for (const h of MA_TRAN_KL3) {
    nhanh(kho, `kl3-${MA_TRAN_KL3.indexOf(h)}`, { [h.tep]: h.noi });
    const r = kiem(KIT, kho);
    const l = dongLech(r);
    if (r.ma !== 1) loi.push(`«${h.ten}» thoát ${r.ma} (cần 1): ${r.err.trim()}`);
    if (l.length !== 1) loi.push(`«${h.ten}» in ${l.length} dòng lệch (cần 1): ${l.join(' / ')}`);
    else for (const c of [h.tep, ...h.can]) if (!l[0].includes(c)) loi.push(`«${h.ten}» dòng lệch thiếu «${c}»: ${l[0]}`);
  }
  // Kho không có nhánh chính dò được → gọi sai có tên, không phải «lệch».
  const moi = thuMuc('khong-main');
  git(moi, 'init', '-q', '-b', 'khac'); git(moi, 'config', 'user.email', 'a@b.c'); git(moi, 'config', 'user.name', 'a');
  ghi(moi, 'design/patterns/a.md', BAN_DO['form-nhap.md']); ghi(moi, 'src/man/form/NhapMau.tsx', manForm());
  git(moi, 'add', '-A'); git(moi, 'commit', '-q', '-m', 'a');
  const k = kiem(KIT, moi);
  if (k.ma !== 2 || !k.err.includes('--base')) loi.push(`kho không nhánh chính thoát ${k.ma}, stderr «${k.err.trim()}» (cần 2 + «--base»)`);
  ket('KL-3', loi);
}

// ── KL-4: quan hệ một nhóm, nhóm phần tử chồng được, tệp giao diện ngoài bản đồ ─────────────────────────────────
function kiemKL4(kit) {
  const loi = [];
  const kho = taoKhoMau({ surfaceGlobs: ['src/**/*.tsx'] });
  nhanh(kho, 'hai-nhom', { 'src/man/chung/Ca.tsx': manBang() });
  const a = kiem(kit, kho);
  if (a.ma !== 1 || !dongLech(a).some(l => l.includes('bang-du-lieu') && l.includes('form-nhap'))) loi.push(`tệp hai nhóm mà im (thoát ${a.ma}: ${a.out.trim()})`);
  nhanh(kho, 'man-phan-tu', { 'src/man/form/Moi.tsx': manForm("import { TrangThaiMau } from '@/khuon/TrangThaiMau';\n", '<TrangThaiMau title="x" />') });
  const b = kiem(kit, kho);
  if (b.ma !== 0 || dongLech(b).length) loi.push(`màn + phần tử đúng khuôn thoát ${b.ma}: ${b.out.trim()}`);
  nhanh(kho, 'ngoai-ban-do', { 'src/khac/A.tsx': 'export const A = 1;\n', 'src/khac/B.tsx': 'export const B = 1;\n' });
  const c = kiem(kit, kho);
  if (c.ma !== 0 || !c.out.includes('2 tệp giao diện ngoài bản đồ')) loi.push(`ngoài bản đồ thoát ${c.ma}, in «${c.out.trim()}»`);
  return loi;
}
if (want('KL-4') || want('KL-4-do')) {
  const lanh = kiemKL4(KIT);
  if (want('KL-4')) ket('KL-4', lanh);
  if (want('KL-4-do')) caDo('KL-4-do', kiemKL4, lanh, () => banSaoTiem(['scripts', 'lib'], LENH, 'if (man.length >= 2) {', 'if (false) {'), 'tệp hai nhóm mà im');
}

// ── KL-5: độ đặc hiệu — tài liệu, hồ sơ, ngoài vùng, nợ cũ theo cặp + số lần, ngoại lệ ───────────────────────────
const NO_CU = 'src/man/form/NoCu.tsx';
const MA_TRAN_KL5 = [
  { ten: 'chỉ docs/', tep: { 'docs/ghi-chu.md': '# ghi chú\n' }, nhom: 'vung' },
  { ten: 'chỉ _acceptance/', tep: { '_acceptance/h/ghi-chu.md': '# ghi chú\n' }, nhom: 'vung' },
  { ten: 'ngoài mọi vùng', tep: { 'src/khac/X.tsx': "import { Hop } from '@/ui/Hop';\nexport const X = () => <Hop />;\n" }, nhom: 'vung' },
  { ten: 'nợ cũ', tep: noCu => ({ [NO_CU]: noCu + '// thêm một dòng\n' }), nhom: 'loai-tru', in: `nợ cũ: ${NO_CU} · Hop` },
  { ten: 'ngoại lệ có lý do', tep: { 'src/man/bang/Cu.tsx': manBang("import { BangTho } from '@/ui/BangTho';\n", '<BangTho />') }, nhom: 'loai-tru' },
  { ten: 'xoá dòng khác trong tệp nợ cũ', tep: noCu => ({ [NO_CU]: noCu.replace(/^\/\/ dòng chú thích.*\n/m, '') }), nhom: 'loai-tru', in: `nợ cũ: ${NO_CU} · Hop` },
];
function kiemKL5(kit, inSo = false) {
  const loi = [];
  if (inSo) console.log(`số hàng: ${MA_TRAN_KL5.length}`);
  const kho = taoKhoMau();
  const noCu = fs.readFileSync(path.join(kho, NO_CU), 'utf8');
  for (const [i, h] of MA_TRAN_KL5.entries()) {
    nhanh(kho, `kl5-${i}`, typeof h.tep === 'function' ? h.tep(noCu) : h.tep);
    const r = kiem(kit, kho);
    const l = dongLech(r);
    if (r.ma !== 0 || l.length) loi.push(h.nhom === 'vung' ? `tệp ngoài vùng bị chấm («${h.ten}»: thoát ${r.ma}, ${l.join(' / ')})` : `nợ cũ hay ngoại lệ thành lệch («${h.ten}»: thoát ${r.ma}, ${l.join(' / ')})`);
    if (h.in && !r.out.includes(h.in)) loi.push(`«${h.ten}» không in «${h.in}»: ${r.out.trim()}`);
  }
  nhanh(kho, 'kl5-tang', { [NO_CU]: noCu.replace('<Hop />', '<Hop /><Hop />') });
  const t = kiem(kit, kho);
  if (t.ma !== 1 || !dongLech(t).some(l => l.includes('tăng 1 → 2'))) loi.push(`thêm chỗ thứ hai của khối nợ cũ thoát ${t.ma}: ${t.out.trim()}`);
  if (inSo) console.log('số hàng phụ: 1');
  nhanh(kho, 'kl5-xoa', { 'src/man/form/Xoa.tsx': null });
  const x = kiem(kit, kho);
  if (x.ma !== 0 || dongLech(x).length) loi.push(`xoá tệp vùng thoát ${x.ma}: ${x.out.trim()}${x.err.trim()}`);
  return loi;
}
if (want('KL-5') || want('KL-5-m1') || want('KL-5-m2')) {
  const lanh = kiemKL5(KIT, want('KL-5'));
  if (want('KL-5')) ket('KL-5', lanh);
  if (want('KL-5-m1')) caDo('KL-5-m1', kiemKL5, lanh, () => banSaoTiem(['scripts', 'lib'], LENH, 'const nhomTep = B.nhomCuaTep(banDo, f);', 'const nhomTep = banDo.nhom;'), 'tệp ngoài vùng bị chấm');
  if (want('KL-5-m2')) caDo('KL-5-m2', kiemKL5, lanh, () => banSaoTiem(['scripts', 'lib'], LENH, 'const loaiTru = (', 'const loaiTru = !('), 'nợ cũ hay ngoại lệ thành lệch');
}

// ── KL-6: không đọc được thì không chặn ──────────────────────────────────────────────────────────────────────
if (want('KL-6')) {
  const loi = [];
  console.log('số hàng: 3');
  const kho = taoKhoMau();
  nhanh(kho, 'dong', { 'src/man/form/Dong.tsx': manForm('', '') + 'export const tai = () => import("./hop");\n' });
  const a = kiem(KIT, kho);
  if (a.ma !== 0 || !a.out.includes('không đo được: src/man/form/Dong.tsx — nhập động')) loi.push(`nhập động thoát ${a.ma}: ${a.out.trim()}`);
  nhanh(kho, 'spread', { 'src/man/bang/Rai.tsx': manBang("import { TrangThaiMau } from '@/khuon/TrangThaiMau';\n", '<TrangThaiMau {...p} />') });
  const b = kiem(KIT, kho);
  if (b.ma !== 0 || !b.out.includes('không đo được: src/man/bang/Rai.tsx — thẻ mang spread')) loi.push(`thẻ spread thoát ${b.ma}: ${b.out.trim()}`);
  const kho2 = taoKhoMau();
  ghi(kho2, 'design/patterns/trang-thai.md', BAN_DO['trang-thai.md'].replace('nhan_dien: ["src/man/**/*.tsx"]', 'nhan_dien: {dang_ky: src/khuon/so.ts, kind: [trang-thai]}'));
  git(kho2, 'commit', '-qam', 'sổ đăng ký');
  nhanh(kho2, 'cham', { 'src/man/form/Moi.tsx': manForm() });
  const c = kiem(KIT, kho2);
  if (c.ma !== 0 || !c.out.includes('không đo được: nhóm trang-thai — nhan_dien dạng sổ đăng ký')) loi.push(`sổ đăng ký thoát ${c.ma}: ${c.out.trim()}`);
  ket('KL-6', loi);
}

// ── KL-9: bản ghim + gợi ý eval theo nhóm ────────────────────────────────────────────────────────────────────
const NHOM_D = `---
nhom: the-moi
doi_tuong: thẻ mới
don_vi: phan-tu
khuon: {ten: TheMoi, nhap: "@/khuon/TheMoi"}
nhan_dien: ["src/man/form/**/*.tsx"]
mau_dang_chay: {tep: src/man/form/NhapMau.tsx}
khe_bat_buoc: []
cam_ngoai_khuon: [CamD]
ngoai_le: []
nhan_viec: thử
---
## Dùng khi
Thử.
## Không dùng
Thử.
`;
function kiemKL9(kit) {
  const loi = [];
  const kho = taoKhoMau();
  git(kho, 'checkout', '-q', '-b', 'vong');
  fs.mkdirSync(path.join(kho, '_acceptance', 'h'), { recursive: true });
  const n = chay(kit, LENH, ['--root', kho, '--nap', '--slug', 'h']);
  if (n.ma !== 0) loi.push(`--nap thoát ${n.ma}: ${n.err.trim()}`);
  git(kho, 'add', '-A'); git(kho, 'commit', '-qm', 'nạp');
  const f = path.join(kho, 'design', 'patterns', 'form-nhap.md');
  fs.writeFileSync(f, fs.readFileSync(f, 'utf8').replace('cam_ngoai_khuon: [Hop, FormTho]', 'cam_ngoai_khuon: [Hop, FormTho, GiaoDienMoi]'));
  ghi(kho, 'design/patterns/the-moi.md', NHOM_D);
  ghi(kho, 'src/man/form/Moi.tsx', manForm("import { GiaoDienMoi } from '@/ui/GiaoDienMoi';\n", '<GiaoDienMoi />'));
  git(kho, 'add', '-A'); git(kho, 'commit', '-qm', 'đổi bản đồ sau ghim');
  const a = kiem(kit, kho);
  if (a.ma !== 0 || !a.out.includes('bản đồ nhóm form-nhap đổi sau khi ghim — chấm theo bản ghim')) loi.push(`chấm theo bản cây sau khi ghim (thoát ${a.ma}: ${a.out.trim()})`);
  ghi(kho, 'src/man/form/Moi2.tsx', manForm("import { CamD } from '@/ui/CamD';\n", '<CamD />'));
  git(kho, 'add', '-A'); git(kho, 'commit', '-qm', 'dùng khối cấm của nhóm thêm sau ghim');
  const b = kiem(kit, kho);
  if (b.ma !== 1 || !dongLech(b).some(l => l.includes('CamD') && l.includes('nhóm the-moi'))) loi.push(`nhóm thêm sau ghim không chấm theo bản cây (thoát ${b.ma}: ${b.out.trim()})`);
  const g = chay(kit, LENH, ['--root', kho, '--goi-y-eval', '--nhom', 'bang-du-lieu']);
  const m = /paths: (\[.*\])/.exec(g.out);
  const mong = ['design/patterns/bang-du-lieu.md', 'src/man/bang/**/*.tsx', 'src/man/chung/**/*.tsx'];
  if (!m || JSON.stringify(JSON.parse(m[1])) !== JSON.stringify(mong)) loi.push(`--goi-y-eval in paths «${m && m[1]}» (cần ${JSON.stringify(mong)})`);
  if (g.out.includes('design/patterns/**') || g.out.includes('src/man/form/')) loi.push('--goi-y-eval lẫn glob ngoài nhóm');
  if (!g.out.includes('cmd: config:executors.design.khuon')) loi.push('--goi-y-eval thiếu cmd config:executors.design.khuon');
  return loi;
}
if (want('KL-9') || want('KL-9-do')) {
  const lanh = kiemKL9(KIT);
  if (want('KL-9')) ket('KL-9', lanh);
  if (want('KL-9-do')) caDo('KL-9-do', kiemKL9, lanh, () => banSaoTiem(['scripts', 'lib'], 'scripts/ban-do-khuon.cjs', 'const ghimBlob = doc.nhom && ghim[doc.nhom.nhom];', 'const ghimBlob = null;'), 'chấm theo bản cây sau khi ghim');
}

// ── KL-2: lint của kho (createRequire) và CLI --json và bước chấm thấy cùng một bản đồ ─────────────────────────
const LUAT_LINT = `import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const B = require(process.argv[2]);
const bd = B.docThuMuc(process.cwd());
const tep = process.argv[3];
const nhom = B.nhomCuaTep(bd, tep);
const cam = [...new Set(nhom.flatMap(n => n.cam_ngoai_khuon))].sort();
const camHo = [...new Set(nhom.flatMap(n => n.cam_ho))].sort();
const src = (await import('node:fs')).readFileSync(tep, 'utf8');
const ten = [...src.matchAll(/import\\s+\\{([^}]*)\\}/g)].flatMap(m => m[1].split(',').map(x => x.trim().split(/\\s+as\\s+/)[0])).filter(Boolean);
const thay = ten.filter(x => cam.includes(x) || camHo.some(h => new RegExp('^' + h + '[A-Z]').test(x))).sort();
console.log(JSON.stringify({ cam, cam_ho: camHo, ngoai_le: nhom.flatMap(n => n.ngoai_le), nhom_cua_tep: nhom.map(n => n.nhom), thay }));
`;
function kiemKL2(kit) {
  const loi = [];
  const kho = taoKhoMau({ typeModule: true });
  ghi(kho, 'tools/luat-khuon.mjs', LUAT_LINT);
  const tep = 'src/man/bang/Moi.tsx';
  nhanh(kho, 'tiem', { [tep]: manBang("import { Hop } from '@/ui/Hop';\nimport { BangTho } from '@/ui/BangTho';\n", '<Hop /><BangTho />') });
  const l = chay(kho, 'tools/luat-khuon.mjs', [path.join(kit, 'scripts', 'ban-do-khuon.cjs'), tep], kho);
  if (l.ma !== 0) { loi.push(`luật lint giả thoát ${l.ma}: ${l.err.trim()}`); return loi; }
  const lint = JSON.parse(l.out);
  const c = chay(kit, 'scripts/ban-do-khuon.cjs', ['--root', kho, '--json']);
  const cli = JSON.parse(c.out || '{"nhom":[]}');
  const cuaTep = cli.nhom.filter(n => lint.nhom_cua_tep.includes(n.nhom));
  const tuCli = { cam: [...new Set(cuaTep.flatMap(n => n.cam_ngoai_khuon))].sort(), cam_ho: [...new Set(cuaTep.flatMap(n => n.cam_ho || []))].sort(), ngoai_le: cuaTep.flatMap(n => n.ngoai_le) };
  for (const k of ['cam', 'cam_ho', 'ngoai_le']) if (JSON.stringify(tuCli[k]) !== JSON.stringify(lint[k])) loi.push(`lint và bước chấm lệch ở ${k}: CLI ${JSON.stringify(tuCli[k])} ≠ lint ${JSON.stringify(lint[k])}`);
  const r = kiem(kit, kho);
  const khoiCham = dongLech(r).filter(x => x.includes(tep)).map(x => x.split(' · ')[1]).sort();
  if (JSON.stringify(khoiCham) !== JSON.stringify(lint.thay)) loi.push(`lint và bước chấm lệch ở khối: bước chấm ${JSON.stringify(khoiCham)} ≠ lint ${JSON.stringify(lint.thay)}`);
  if (!lint.thay.length) loi.push('luật lint giả không thấy khối cấm nào — fixture hỏng');
  return loi;
}
if (want('KL-2') || want('KL-2-do')) {
  const lanh = kiemKL2(KIT);
  if (want('KL-2')) ket('KL-2', lanh);
  if (want('KL-2-do')) caDo('KL-2-do', kiemKL2, lanh, () => banSaoTiem(['scripts', 'lib'], 'scripts/ban-do-khuon.cjs', 'bd.nhom.map(n => ({ ...n }))', 'bd.nhom.map(n => ({ ...n, cam_ho: [] }))'), 'lint và bước chấm lệch');
}

process.exitCode = hong ? 1 : 0;

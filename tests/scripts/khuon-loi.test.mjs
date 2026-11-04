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
import { execFileSync, spawnSync } from 'node:child_process';
import { CONTRACT_G2, EVALS, REPORT_PASS, G1, PROBE } from './gate-fixture.mjs';
import { KIT, taoKhoMau, nhanh, banSaoTiem, ghi, git, chay, khoiMarker, thuMuc, BAN_DO } from './khuon-loi-kho-mau.mjs';

const LENH = 'scripts/design-floor-khuon.mjs';
const TEMPLATE = path.join(KIT, 'skills', 'acceptance', 'references', 'ban-do-khuon-template.md');

const CA = ['KL-7-do3', 'KL-1', 'KL-1-do', 'KL-1-tao', 'KL-2', 'KL-2-do', 'KL-3', 'KL-4', 'KL-4-do', 'KL-5', 'KL-5-m1', 'KL-5-m2', 'KL-6', 'KL-7', 'KL-7-do', 'KL-7-do2', 'KL-8', 'KL-8-do', 'KL-9', 'KL-9-do', 'KL-10', 'KL-11', 'KL-11-do'];
const chon = (process.env.KL_CASES || '').split(',').map(s => s.trim()).filter(Boolean);
const la = chon.filter(c => !CA.includes(c));
if (la.length) { console.error(`khuon-loi.test: mã ca lạ: ${la.join(', ')} (biết: ${CA.join(', ')})`); process.exit(2); }
const want = c => (chon.length ? chon.includes(c) : true);

const require = createRequire(import.meta.url);
// Trạng thái «đã ký» rút từ lib (MỘT nguồn — nếp co-hop-dong): tệp ca không mang chuỗi trạng thái của riêng nó.
const [DA_KY] = require(path.join(KIT, 'lib', 'workspace-record.cjs')).DA_THONG_CONG_2;
const docLai = kit => { const p = path.join(kit, 'scripts', 'ban-do-khuon.cjs'); delete require.cache[require.resolve(p)]; return require(p); };
let hong = 0;
const ket = (ma, loi) => {
  if (!loi.length) console.log(`PASS: [${ma}]`);
  else { hong++; console.log(`FAIL: [${ma}] ${loi.join(' | ')}`); }
};
let _khoSong = null;
const khoSong = () => (_khoSong ||= taoKhoMau());
// Ca đỏ: bản lành phải xanh trên cùng fixture, bản sao phải đỏ với đúng thông điệp ghim.
const caDo = (ma, kiem, lanh, saoTiem, thongDiep, chiMot = false) => {
  if (lanh.length) return ket(ma, [`bản lành chưa xanh: ${lanh.join(' | ')}`]);
  let loi;
  try {
    const sao = saoTiem();
    // Bản sao phải CHẠY được — bản sao im lặng (main không chạy, thoát 0) cho đúng màu «đỏ» của nhiều ca mà không đo gì.
    const song = chay(sao, 'scripts/design-floor-khuon.mjs', ['--root', khoSong(), '--dem']);
    if (song.out.trim() !== 'khuôn: 3 nhóm (2 màn · 1 phần tử)') return ket(ma, [`hạ tầng ca: bản sao không chạy (--dem in «${song.out.trim()}», thoát ${song.ma})`]);
    loi = kiem(sao);
  } catch (e) { return ket(ma, [`hạ tầng ca: ${e.message}`]); }
  if (chiMot && loi.some(x => !x.includes(thongDiep))) return ket(ma, [`bản tiêm đỏ cả ở hàng đối chứng — không phân biệt được «bắt đúng lỗi» với «bản sao không chạy» (lỗi: ${loi.join(' | ')})`]);
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
    ['thiếu Không dùng', KHOI.replace('## Không dùng\nMàn b.\n', ''), r => r.canh_bao.some(x => x.includes('thiếu «Không dùng»'))],
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
// Kỳ vọng VIẾT TRƯỚC từ chữ của kho mẫu (BAN_DO), không tính từ bộ đọc: câu đầu sau «Dùng khi» của từng nhóm.
const CHI_MUC_MONG = [
  'bang-du-lieu · màn liệt kê nhiều bản ghi cùng loại · nhận việc: tra cứu nhiều bản ghi · dùng khi: Màn liệt kê nhiều bản ghi cùng loại. · design/patterns/bang-du-lieu.md · màn mẫu: src/man/bang/DanhSachMau.tsx',
  'form-nhap · màn nhập một bản ghi · nhận việc: nhập một bản ghi · dùng khi: màn nhập hay sửa một bản ghi. · design/patterns/form-nhap.md · màn mẫu: src/man/form/NhapMau.tsx',
  'trang-thai · ô trạng thái trống, lỗi, đang tải · nhận việc: báo trạng thái dữ liệu · dùng khi: Ô báo trống, lỗi hay đang tải trong màn. · design/patterns/trang-thai.md · màn mẫu: src/man/bang/DanhSachMau.tsx',
];
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
  for (const mong of CHI_MUC_MONG) if (!dong.includes(mong)) loi.push(`--nap thiếu dòng «${mong}» (in: ${dong.join(' / ')})`);
  let nj = null;
  try { nj = JSON.parse(fs.readFileSync(path.join(kho, '_acceptance', 'h', 'khuon-nap.json'), 'utf8')); } catch (_) { loi.push('không đọc được khuon-nap.json'); }
  if (nj) for (const f of Object.keys(BAN_DO)) {
    const ten = f.replace(/\.md$/, '');
    const bam = git(kho, 'rev-parse', `HEAD:design/patterns/${f}`).trim();
    if (!nj.ghim || nj.ghim[ten] !== bam) loi.push(`ghim nhóm ${ten} = ${nj.ghim && nj.ghim[ten]} (cần ${bam})`);
  }
  return loi;
}
// Phần tài liệu của KL-10: mục «Thẻ việc» của khuôn đặc tả UX + ba khối SKILL chạy được trên kho mẫu.
const SKILL_FL = path.join(KIT, 'feature-loop', 'skills', 'feature-loop', 'SKILL.md');
const UX_SPEC = path.join(KIT, 'skills', 'acceptance', 'references', 'ux-spec-template.md');
function kiemKL10TaiLieu() {
  const loi = [];
  const ux = fs.readFileSync(UX_SPEC, 'utf8');
  const muc = /^#{2,4}[^\n]*Thẻ việc[^\n]*\n([\s\S]*?)(?=^#{2,4} |$(?![\s\S]))/m.exec(ux);
  if (!muc) loi.push('ux-spec-template.md không có mục «Thẻ việc»');
  else for (const t of ['ai dùng', 'việc chính', 'tần suất', 'số bản ghi', 'thiết bị']) if (!muc[1].toLowerCase().includes(t)) loi.push(`mục «Thẻ việc» thiếu trường «${t}»`);
  const kho = taoKhoMau();
  nhanh(kho, 'vong', { 'src/man/form/Moi.tsx': manForm() });
  for (const ten of ['KHUON-S0', 'KHUON-S1', 'KHUON-SAU-S4']) {
    // Luồng thật: hồ sơ (gồm khuon-nap.json của S1) đã commit trước lượt chấm — sha lượt chấm là HEAD lúc ấy.
    if (ten === 'KHUON-SAU-S4') { git(kho, 'add', '-A'); git(kho, 'commit', '-q', '--allow-empty', '-m', 'hồ sơ S1'); }
    const sha = git(kho, 'rev-parse', 'HEAD').trim();
    let khoi;
    try { khoi = khoiMarker(SKILL_FL, ten); } catch (e) { loi.push(e.message); continue; }
    // Mỗi dòng của khối là một lệnh (KHUON-S1 có ba dòng từ hồ sơ khoi-khuon-tren-the-cong): chạy từng dòng, thay mọi ô.
    for (const dong of khoi.split('\n').filter(l => l.trim())) {
      const lenh = dong.split('&&').slice(1).join('&&').trim().replaceAll('"$AG/', `"${KIT}/`).replaceAll("'<slug>'", 'h').replaceAll('<slug>', 'h').replaceAll('<sha lượt chấm>', sha)
        .replaceAll('<nhóm gần>', 'bang-du-lieu').replaceAll('<nhóm>', 'form-nhap').replaceAll('<tên>', 'bao-cao-tuan');
      if (!lenh.includes(KIT)) { loi.push(`khối ${ten} không gọi lệnh qua $AG: ${dong}`); continue; }
      const r = spawnSync('bash', ['-c', lenh], { cwd: kho, encoding: 'utf8' });
      if (r.status !== 0) loi.push(`lệnh khối ${ten} thoát ${r.status}: ${(r.stderr || r.stdout).trim()}`);
    }
  }
  return loi;
}

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
  const PHU_KL5 = [{ ten: 'xoá tệp vùng', tep: { 'src/man/form/Xoa.tsx': null } }];
  if (inSo) console.log(`số hàng phụ: ${PHU_KL5.length}`);
  for (const [i, h] of PHU_KL5.entries()) {
    nhanh(kho, `kl5-phu-${i}`, h.tep);
    const x = kiem(kit, kho);
    if (x.ma !== 0 || dongLech(x).length) loi.push(`«${h.ten}» thoát ${x.ma}: ${x.out.trim()}${x.err.trim()}`);
  }
  return loi;
}
if (want('KL-5') || want('KL-5-m1') || want('KL-5-m2')) {
  const lanh = kiemKL5(KIT, want('KL-5'));
  if (want('KL-5')) ket('KL-5', lanh);
  if (want('KL-5-m1')) caDo('KL-5-m1', kiemKL5, lanh, () => banSaoTiem(['scripts', 'lib'], LENH, 'const nhomTep = B.nhomCuaTep(banDo, f);', 'const nhomTep = banDo.nhom;'), 'tệp ngoài vùng bị chấm');
  if (want('KL-5-m2')) caDo('KL-5-m2', kiemKL5, lanh, () => banSaoTiem(['scripts', 'lib'], LENH, 'const loaiTru = (', 'const loaiTru = !('), 'nợ cũ hay ngoại lệ thành lệch');
}

// ── KL-6: không đọc được thì không chặn ──────────────────────────────────────────────────────────────────────
const MA_TRAN_KL6 = [
  { ten: 'nhập động', kho: {}, tep: { 'src/man/form/Dong.tsx': manForm() + 'export const tai = () => import("./hop");\n', 'src/man/form/Req.tsx': manForm() + 'const hop = require("./hop");\n' },
    in: ['không đo được: src/man/form/Dong.tsx — nhập động', 'không đo được: src/man/form/Req.tsx — nhập động'] },
  { ten: 'thẻ mang spread', kho: {}, tep: { 'src/man/bang/Rai.tsx': manBang("import { TrangThaiMau } from '@/khuon/TrangThaiMau';\n", '<TrangThaiMau {...p} />') },
    in: ['không đo được: src/man/bang/Rai.tsx — thẻ mang spread'] },
  { ten: 'sổ đăng ký', kho: { 'design/patterns/trang-thai.md': BAN_DO['trang-thai.md'].replace('nhan_dien: ["src/man/**/*.tsx"]', 'nhan_dien: {dang_ky: src/khuon/so.ts, kind: [trang-thai]}') }, tep: { 'src/man/form/Moi.tsx': manForm() },
    in: ['không đo được: nhóm trang-thai — nhan_dien dạng sổ đăng ký'] },
];
if (want('KL-6')) {
  const loi = [];
  console.log(`số hàng: ${MA_TRAN_KL6.length}`);
  for (const [i, h] of MA_TRAN_KL6.entries()) {
    const kho = taoKhoMau();
    if (Object.keys(h.kho).length) { for (const [f, t] of Object.entries(h.kho)) ghi(kho, f, t); git(kho, 'commit', '-qam', h.ten); }
    nhanh(kho, `kl6-${i}`, h.tep);
    const r = kiem(KIT, kho);
    if (r.ma !== 0) loi.push(`«${h.ten}» thoát ${r.ma} (cần 0): ${r.out.trim()}`);
    for (const c of h.in) if (!r.out.includes(c)) loi.push(`«${h.ten}» không in «${c}»: ${r.out.trim()}`);
  }
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

// ── KL-7: khuon-cham.json sau lượt chấm + dòng Khuôn và cờ trên thẻ Cổng Bằng chứng ────────────────────────────
const RE_DONG_THE = /Khuôn: (\d+) tệp theo khuôn · (\d+) lệch mới · nợ cũ (\d+) · không đo (\d+)/g;
const CO_THE = 'chưa chấm khuôn trên bản đã chấm';
const hoSoG2 = (kho, slug, vc, trangThai = 'verified') => {
  ghi(kho, `_acceptance/${slug}/contract.md`, CONTRACT_G2.replace('slug: s', `slug: ${slug}`).replace('status: verified', `status: ${trangThai}`));
  ghi(kho, `_acceptance/${slug}/evals.yaml`, EVALS);
  ghi(kho, `_acceptance/${slug}/evidence-report.md`, REPORT_PASS.replace('feature_slug: s', `feature_slug: ${slug}`).replace('verified_commit: 0000000', `verified_commit: ${vc}`));
  ghi(kho, `_acceptance/${slug}/review-findings.md`, '# Review\n');
};
const the = (kit, kho, slug) => chay(kit, 'scripts/gate-card.js', ['--root', kho, '--slug', slug]);
function kiemKL7(kit) {
  const loi = [];
  const kho = taoKhoMau();
  // Bốn số khác nhau từng đôi (theo khuôn 4 · lệch mới 2 · nợ cũ 1 · không đo 3): ghi rỗng hay đảo chỗ đều lộ.
  const noCu = fs.readFileSync(path.join(kho, NO_CU), 'utf8');
  const lech = manForm("import { Hop } from '@/ui/Hop';\n", '<Hop />');
  const dong = manForm() + 'export const tai = () => import("./hop");\n';
  nhanh(kho, 'vong', {
    'src/man/form/Moi1.tsx': manForm(), 'src/man/form/Moi2.tsx': manForm(), 'src/man/form/Moi3.tsx': manForm(), 'src/man/form/Moi4.tsx': manForm(),
    'src/man/form/Lech1.tsx': lech, 'src/man/form/Lech2.tsx': lech, [NO_CU]: noCu + '// thêm một dòng\n',
    'src/man/form/Dong1.tsx': dong, 'src/man/form/Dong2.tsx': dong, 'src/man/form/Dong3.tsx': dong,
  });
  const sha = git(kho, 'rev-parse', 'HEAD').trim();
  hoSoG2(kho, 'h', sha);
  const w = chay(kit, LENH, ['--root', kho, '--kiem', '--write', '--slug', 'h', '--den', sha]);
  const k = kiem(kit, kho);
  let cham = null;
  try { cham = JSON.parse(fs.readFileSync(path.join(kho, '_acceptance', 'h', 'khuon-cham.json'), 'utf8')); } catch (_) { loi.push(`--write không ghi khuon-cham.json (thoát ${w.ma}: ${w.err.trim()})`); return loi; }
  const demIn = p => k.out.split('\n').filter(l => l.startsWith(p)).length;
  if (cham.den !== sha) loi.push(`khuon-cham.json den = ${cham.den} (cần ${sha})`);
  const soTep = [cham.theo_khuon.length, cham.lech_moi.length, cham.no_cu.length, cham.khong_do.length];
  if (soTep.join() !== '4,2,1,3') loi.push(`khuon-cham.json đếm ${soTep.join('·')} (cần 4·2·1·3)`);
  if (cham.lech_moi.length !== demIn('lệch:') || cham.no_cu.length !== demIn('nợ cũ:') || cham.khong_do.length !== demIn('không đo được:')) loi.push(`số trong khuon-cham.json khác đầu ra bước chấm: ${soTep.join('·')} / ${k.out.trim()}`);
  // --write: HEAD đi tiếp bằng commit CHỈ chạm hồ sơ (gói evidence) → vẫn ghi, den giữ nguyên (đối chứng của luồng SKILL);
  // commit đổi ngoài hồ sơ sau den, hay cây bẩn ngoài hồ sơ → từ chối, không chạm tệp đã có.
  const tepCham = path.join(kho, '_acceptance', 'h', 'khuon-cham.json');
  const ghiLai = () => chay(kit, LENH, ['--root', kho, '--kiem', '--write', '--slug', 'h', '--den', sha]);
  git(kho, 'add', '-A'); git(kho, 'commit', '-qm', 'gói evidence');
  fs.rmSync(tepCham);
  const qua = ghiLai();
  let denQua = null; try { denQua = JSON.parse(fs.readFileSync(tepCham, 'utf8')).den; } catch (_) { /* không ghi */ }
  if (qua.ma !== 0 || denQua !== sha) loi.push(`commit chỉ chạm hồ sơ mà --write không ghi số của den (thoát ${qua.ma}, den ${denQua}: ${qua.err.trim()})`);
  const daGhi = fs.readFileSync(tepCham, 'utf8');
  const truocNgoai = git(kho, 'rev-parse', 'HEAD').trim();
  ghi(kho, 'src/man/form/Sau.tsx', manForm()); git(kho, 'add', '-A'); git(kho, 'commit', '-qm', 'đổi ngoài hồ sơ');
  const tu1 = ghiLai();
  git(kho, 'reset', '-q', '--hard', truocNgoai);
  ghi(kho, 'src/man/form/Ban.tsx', manForm());
  const tu2 = ghiLai();
  fs.rmSync(path.join(kho, 'src/man/form/Ban.tsx'));
  if (tu1.ma !== 2 || !tu1.err.includes('đổi ngoài hồ sơ') || tu2.ma !== 2 || !tu2.err.includes('cây làm việc đổi ngoài hồ sơ') || fs.readFileSync(tepCham, 'utf8') !== daGhi) loi.push(`đóng dấu den lên số đo của cây khác (commit ngoài hồ sơ: thoát ${tu1.ma} «${tu1.err.trim()}» · cây bẩn: thoát ${tu2.ma} «${tu2.err.trim()}»)`);
  const so = () => [...the(kit, kho, 'h').out.matchAll(RE_DONG_THE)];
  const d = so();
  if (d.length !== 1) loi.push(`thẻ có ${d.length} dòng Khuôn (cần 1)`);
  else if (d[0].slice(1).map(Number).join() !== '4,2,1,3') loi.push(`dòng thẻ «${d[0][0]}» khác tệp số đo (cần 4·2·1·3)`);
  const lechLot = khoiMarker(TEMPLATE, 'LECH-LOT-TEMPLATE').split('\n').filter(l => !l.startsWith('- <')).join('\n').trimEnd() + '\n\n- 2026-11-02 · src/a.tsx · Hop · lọt qua thẻ\n- 2026-11-02 · src/b.tsx · BangTho · lọt qua thẻ\n';
  ghi(kho, 'design/patterns/lech-lot.md', lechLot);
  if (!the(kit, kho, 'h').out.includes('sổ lệch lọt: 2 mục')) loi.push('thẻ không in «sổ lệch lọt: 2 mục»');
  const k2 = kiem(kit, kho);
  const d2 = chay(kit, LENH, ['--root', kho, '--dem']);
  if (k2.ma !== k.ma || k2.out !== k.out || !d2.out.includes('3 nhóm')) loi.push(`lech-lot.md làm bước chấm đổi (thoát ${k2.ma}: ${k2.out.trim()} / ${d2.out.trim()})`);
  const tep = path.join(kho, '_acceptance', 'h', 'khuon-cham.json');
  const goc = fs.readFileSync(tep, 'utf8');
  if (the(kit, kho, 'h').out.includes(CO_THE)) loi.push('số đo cùng sha mà vẫn cờ');
  fs.rmSync(tep);
  const t1 = the(kit, kho, 'h');
  if (!t1.out.includes(CO_THE)) loi.push(`thiếu tệp khuôn mà không cờ (thoát ${t1.ma})`);
  fs.writeFileSync(tep, goc.replace(sha, git(kho, 'rev-parse', 'main').trim()));
  const t2 = the(kit, kho, 'h');
  if (!t2.out.includes(CO_THE)) loi.push(`số khuôn của lượt cũ mà không cờ (thoát ${t2.ma})`);
  ghi(kho, '_acceptance/h/contract.md', CONTRACT_G2.replace('slug: s', 'slug: h').replace('status: verified', `status: ${DA_KY}`));
  const t3 = the(kit, kho, 'h');
  if (t3.out.includes(CO_THE) || ![...t3.out.matchAll(RE_DONG_THE)].length) loi.push(`hồ sơ đã ký: cờ «${t3.out.includes(CO_THE)}», dòng Khuôn ${[...t3.out.matchAll(RE_DONG_THE)].length} (cần không cờ, có dòng; thoát ${t3.ma})`);
  git(kho, 'stash', '-u', '-q');
  nhanh(kho, 'vong2', { 'docs/ghi-chu-2.md': '# chỉ tài liệu\n' });
  const sha2 = git(kho, 'rev-parse', 'HEAD').trim();
  hoSoG2(kho, 'h2', sha2);
  const t4 = the(kit, kho, 'h2');
  if (t4.ma !== 0 || !t4.out.includes('E1')) loi.push(`thẻ hồ sơ chỉ chạm docs/ không dựng được (thoát ${t4.ma}: ${t4.err.trim()})`);
  if (t4.out.includes(CO_THE)) loi.push('hồ sơ chỉ chạm docs/ mà vẫn cờ');
  return loi;
}
if (want('KL-7') || want('KL-7-do') || want('KL-7-do2') || want('KL-7-do3')) {
  const lanh = kiemKL7(KIT);
  if (want('KL-7')) ket('KL-7', lanh);
  if (want('KL-7-do')) caDo('KL-7-do', kiemKL7, lanh, () => banSaoTiem(['scripts', 'lib'], 'scripts/ban-do-khuon.cjs', 'if (chuaCham && chamVung) co =', 'if (false) co ='), 'thiếu tệp khuôn mà không cờ');
  if (want('KL-7-do2')) caDo('KL-7-do2', kiemKL7, lanh, () => banSaoTiem(['scripts', 'lib'], 'scripts/ban-do-khuon.cjs', '!cham || cham.den !== vc', '!cham'), 'số khuôn của lượt cũ mà không cờ');
  if (want('KL-7-do3')) caDo('KL-7-do3', kiemKL7, lanh, () => banSaoTiem(['scripts', 'lib'], LENH, 'if (sauDen.length) sai(', 'if (false) sai('), 'đóng dấu den lên số đo của cây khác');
}

// ── KL-8: kho không khai bản đồ — mọi lệnh im, thẻ bằng từng byte bản trước vòng ──────────────────────────────
let _goc = null;
const banGocVong = () => {
  if (_goc) return _goc;
  let mb = '';
  for (const ref of ['origin/main', 'main']) { try { mb = git(KIT, 'merge-base', 'HEAD', ref).trim(); break; } catch (_) { /* thử ref kế */ } }
  _goc = thuMuc('goc-vong');
  execFileSync('bash', ['-c', `git -C "${KIT}" archive "${mb}" scripts lib | tar -x -C "${_goc}"`]);
  // Chỉ scripts/ + lib/ là biến: thẻ còn đọc khối CAT-LUOT-CO ở skills/, nên skills/ lấy từ cây đang kiểm cho cả hai bên.
  fs.cpSync(path.join(KIT, 'skills'), path.join(_goc, 'skills'), { recursive: true });
  return _goc;
};
function kiemKL8(kit) {
  const loi = [];
  const kho = taoKhoMau({ coBanDo: false });
  for (const [f, t] of Object.entries(G1(PROBE('clean')))) ghi(kho, `_acceptance/g/${f}`, t);
  const sha = git(kho, 'rev-parse', 'HEAD').trim();
  hoSoG2(kho, 'h', sha);
  git(kho, 'add', '-A'); git(kho, 'commit', '-qm', 'hồ sơ');
  const truoc = git(kho, 'status', '--porcelain');
  for (const a of [['--dem'], ['--nap', '--slug', 'h'], ['--kiem'], ['--kiem', '--write', '--slug', 'h', '--den', sha]]) {
    const r = chay(kit, LENH, ['--root', kho, ...a]);
    if (r.ma !== 0 || r.out || r.err) loi.push(`kho không khai mà lệnh in (${a.join(' ')}: thoát ${r.ma}, «${(r.out + r.err).trim()}»)`);
  }
  if (git(kho, 'status', '--porcelain') !== truoc) loi.push('kho không khai mà lệnh ghi tệp');
  const goc = banGocVong();
  for (const [slug, them] of [['g', []], ['g', ['--extract']], ['h', []], ['h', ['--extract']]]) {
    const moi = chay(kit, 'scripts/gate-card.js', ['--root', kho, '--slug', slug, ...them]);
    const cu = chay(goc, 'scripts/gate-card.js', ['--root', kho, '--slug', slug, ...them]);
    if (moi.out !== cu.out || moi.ma !== cu.ma) loi.push(`thẻ ${slug} ${them.join(' ')} khác bản trước vòng (thoát ${moi.ma}/${cu.ma})`);
    if (!moi.out) loi.push(`thẻ ${slug} ${them.join(' ')} rỗng — đối chứng không đo gì`);
  }
  return loi;
}
if (want('KL-8') || want('KL-8-do')) {
  const lanh = kiemKL8(KIT);
  if (want('KL-8')) ket('KL-8', lanh);
  if (want('KL-8-do')) caDo('KL-8-do', kiemKL8, lanh, () => banSaoTiem(['scripts', 'lib'], LENH, 'if (!bd.co_thu_muc) return 0;', 'if (false) return 0;'), 'kho không khai mà lệnh in');
}

// ── KL-11: s4-args dừng hồ sơ chạm vùng nhóm mà thiếu eval khuôn ───────────────────────────────────────────────
const S4 = 'feature-loop/scripts/s4-args.mjs';
const HD_IMPL = slug => `---\nschema_version: 1\nfeature: F\nslug: ${slug}\nrisk_tier: T2\nsurfaces: [cli]\nstatus: implemented\n---\n\n## Criteria\n\n- AC-1: Given a, When b, Then c.\n`;
const EV_TEST = 'evals:\n  - id: E1\n    criterion: AC-1\n    executor: test\n    cmd: config:executors.test.x\n    expected: xanh\n    evidence_required: [run_id, exit_code]\n';
const EV_KHUON = EV_TEST + '  - id: E2\n    criterion: AC-1\n    executor: script\n    cmd: config:executors.design.khuon\n    expected: exit 0\n    evidence_required: [run_id, exit_code]\n';
const sinhArgs = (kit, kho, slug) => { const out = path.join(thuMuc('args'), 'a.json'); const r = chay(kit, S4, ['--slug', slug, '--root', kho, '--out', out, '--no-carry', '--ag-root', kit]); return { ...r, coTep: fs.existsSync(out) }; };
const HS11 = 'ho-so-luoi-k11';
const HANG_KL11 = [
  { ten: 'chạm vùng nhóm, thiếu eval khuôn', lam: (kit, kho) => {
    nhanh(kho, HS11, { [`_acceptance/${HS11}/contract.md`]: HD_IMPL(HS11), [`_acceptance/${HS11}/evals.yaml`]: EV_TEST, 'src/man/form/Moi.tsx': manForm() });
    const a = sinhArgs(kit, kho, HS11);
    return a.ma !== 2 || a.coTep || ![`hồ sơ ${HS11} chạm vùng nhóm form-nhap`, 'executors.design.khuon'].every(x => a.err.includes(x)) ? `thiếu eval khuôn mà vẫn sinh args (thoát ${a.ma}, tệp ${a.coTep}: ${a.err.trim().split('\n').pop()})` : null; } },
  { ten: 'thêm eval khuôn', lam: (kit, kho) => {
    ghi(kho, `_acceptance/${HS11}/evals.yaml`, EV_KHUON); git(kho, 'commit', '-qam', 'thêm eval khuôn');
    const b = sinhArgs(kit, kho, HS11);
    return b.ma !== 0 || !b.coTep ? `có eval khuôn mà không sinh args (thoát ${b.ma}: ${b.err.trim().split('\n').pop()})` : null; } },
  { ten: 'chỉ chạm docs/', lam: (kit, kho) => {
    nhanh(kho, `${HS11}-2`, { [`_acceptance/${HS11}-2/contract.md`]: HD_IMPL(`${HS11}-2`), [`_acceptance/${HS11}-2/evals.yaml`]: EV_TEST, 'docs/ghi-chu.md': '# x\n' });
    const c = sinhArgs(kit, kho, `${HS11}-2`);
    return c.ma !== 0 || !c.coTep ? `hồ sơ chỉ chạm docs/ bị chặn (thoát ${c.ma}: ${c.err.trim().split('\n').pop()})` : null; } },
  { ten: 'kho không có design/patterns/', lam: kit => {
    const kho2 = taoKhoMau({ coBanDo: false });
    nhanh(kho2, HS11, { [`_acceptance/${HS11}/contract.md`]: HD_IMPL(HS11), [`_acceptance/${HS11}/evals.yaml`]: EV_TEST, 'src/man/form/Moi.tsx': manForm() });
    const d = sinhArgs(kit, kho2, HS11);
    return d.ma !== 0 || !d.coTep ? `kho không có design/patterns/ bị chặn (thoát ${d.ma}: ${d.err.trim().split('\n').pop()})` : null; } },
];
function kiemKL11(kit, inSo = false) {
  if (inSo) console.log(`số hàng: ${HANG_KL11.length}`);
  const kho = taoKhoMau();
  return HANG_KL11.map(h => h.lam(kit, kho)).filter(Boolean);
}
if (want('KL-11') || want('KL-11-do')) {
  const lanh = kiemKL11(KIT, want('KL-11'));
  if (want('KL-11')) ket('KL-11', lanh);
  if (want('KL-11-do')) caDo('KL-11-do', kiemKL11, lanh, () => banSaoTiem(['scripts', 'lib', 'feature-loop', 'skills'], S4, 'if (thieuEvalKhuon) die(', 'if (false) die('), 'thiếu eval khuôn mà vẫn sinh args', true);
}

// KL-10 gọi cuối: phần tài liệu dùng tiện ích bước chấm khai ở trên.
if (want('KL-10')) ket('KL-10', [...kiemKL10Lenh(KIT), ...kiemKL10TaiLieu()]);

process.exitCode = hong ? 1 : 0;

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
import { KIT, taoKhoMau, banSaoTiem, ghi, git, chay, khoiMarker, BAN_DO } from './khuon-loi-kho-mau.mjs';

const LENH = 'scripts/design-floor-khuon.mjs';
const TEMPLATE = path.join(KIT, 'skills', 'acceptance', 'references', 'ban-do-khuon-template.md');

const CA = ['KL-1', 'KL-1-do', 'KL-1-tao', 'KL-10'];
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
// Ca đỏ: bản lành phải xanh trên cùng fixture, bản sao phải đỏ với đúng thông điệp ghim.
const caDo = (ma, kiem, lanh, saoTiem, thongDiep) => {
  if (lanh.length) return ket(ma, [`bản lành chưa xanh: ${lanh.join(' | ')}`]);
  let loi;
  try { loi = kiem(saoTiem()); } catch (e) { return ket(ma, [`hạ tầng ca: ${e.message}`]); }
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

process.exitCode = hong ? 1 : 0;

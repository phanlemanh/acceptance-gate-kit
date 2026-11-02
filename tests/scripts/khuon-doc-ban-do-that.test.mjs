// khuon-doc-ban-do-that.test.mjs — hồ sơ khuon-doc-ban-do-that (bản vá trong 2.37.0): bộ đọc và bước chấm khuôn đọc
// đúng bản đồ thật — ngoại lệ dạng danh sách, lớp trình bày đã khai, lời nhắc chỗ đặt glob.
//
// Luật đo (nếp khuon-loi.test.mjs):
//  - Kho mẫu do code sinh trong lượt (bộ dựng chung `khuon-loi-kho-mau.mjs`); gọi CHÍNH script của cây đang kiểm.
//  - Kỳ vọng VIẾT TRƯỚC (hằng), không tính từ mã sản phẩm; ca ma trận in «số hàng: N».
//  - Chiều đỏ: mỗi ca «-do» chạy CHÍNH hàm kiểm trên bản sao TRỌN `scripts/` + `lib/` bị tiêm đúng một nhát, SAU khi
//    bản lành xanh trên cùng fixture; bản sao phải chạy được trước khi tin màu đỏ; ghim thông điệp lỗi.
//  - Tên ca = mã ca của evals.yaml; KD_CASES chọn ca; mã lạ → thoát 2.
//  - Kho mẫu hình dạng thật (KD-7) dựng lại HÌNH DẠNG tệp bản đồ của kho thứ nhất; tên tệp và tên khối giả.
import path from 'node:path';
import { createRequire } from 'node:module';
import { KIT, taoKhoMau, nhanh, banSaoTiem, ghi, git, chay, BAN_DO } from './khuon-loi-kho-mau.mjs';

const LENH = 'scripts/design-floor-khuon.mjs';
const DOC = 'scripts/ban-do-khuon.cjs';
const CA = ['KD-1', 'KD-2', 'KD-2-do', 'KD-3', 'KD-4', 'KD-4-do', 'KD-5', 'KD-6', 'KD-6-do', 'KD-7', 'KD-7-do'];
const chon = (process.env.KD_CASES || '').split(',').map(s => s.trim()).filter(Boolean);
const la = chon.filter(c => !CA.includes(c));
if (la.length) { console.error(`khuon-doc-ban-do-that.test: mã ca lạ: ${la.join(', ')} (biết: ${CA.join(', ')})`); process.exit(2); }
const want = c => (chon.length ? chon.includes(c) : true);

const require = createRequire(import.meta.url);
const docLai = kit => { const p = path.join(kit, DOC); delete require.cache[require.resolve(p)]; return require(p); };
let hong = 0;
const ket = (ma, loi) => {
  if (!loi.length) console.log(`PASS: [${ma}]`);
  else { hong++; console.log(`FAIL: [${ma}] ${loi.join(' | ')}`); }
};
let _khoSong = null;
const khoSong = () => (_khoSong ||= taoKhoMau());
const caDo = (ma, kiem, lanh, saoTiem, thongDiep) => {
  if (lanh.length) return ket(ma, [`bản lành chưa xanh: ${lanh.join(' | ')}`]);
  let loi;
  try {
    const sao = saoTiem();
    const song = chay(sao, LENH, ['--root', khoSong(), '--dem']);
    if (song.out.trim() !== 'khuôn: 3 nhóm (2 màn · 1 phần tử)') return ket(ma, [`hạ tầng ca: bản sao không chạy (--dem in «${song.out.trim()}», thoát ${song.ma})`]);
    loi = kiem(sao);
  } catch (e) { return ket(ma, [`hạ tầng ca: ${e.message}`]); }
  ket(ma, loi.some(x => x.includes(thongDiep)) ? [] : [`bản tiêm không cho lỗi «${thongDiep}» (lỗi: ${loi.join(' | ') || 'không có'})`]);
};
const kiem = (kit, kho, base = 'main') => chay(kit, LENH, ['--kiem', '--root', kho, '--base', base]);
const json = (kit, kho) => { const r = chay(kit, DOC, ['--root', kho, '--json']); return r.ma === 0 ? JSON.parse(r.out) : { loi: `thoát ${r.ma}: ${r.err}` }; };
const dong = out => out.split('\n').map(l => l.trim()).filter(Boolean);

// Nhát tiêm (khớp đúng một lần trong bản sao):
const TIEM_TACH = ['khoiCua(x.khoi)', '[String(x.khoi || \'\')]'];
const TIEM_LOP = ['const tenDung = [ten, ...(nhom.khuon.lop_trinh_bay || [])];', 'const tenDung = [ten];'];
const TIEM_NHAC = ['thêm nhan_dien.tep: [glob]', 'thêm tep: [glob]'];

// ── Bản đồ nhóm bảng của kho mẫu, sửa theo từng ca ───────────────────────────────────────────────────────────────
const BANG = BAN_DO['bang-du-lieu.md'];
const NGOAI_LE_GOC = `ngoai_le:
  - tep: src/man/bang/Cu.tsx
    khoi: BangTho
    ly_do: màn cũ chờ dời sang khuôn
`;
if (!BANG.includes(NGOAI_LE_GOC)) throw new Error('kho mẫu đổi khuôn: không thấy khối ngoai_le gốc của bang-du-lieu');
const bangVoiNgoaiLe = them => BANG.replace(NGOAI_LE_GOC, NGOAI_LE_GOC + them);
const KHUON_GOC = `khuon:
  ten: KhungBang
  nhap: "@/khuon/KhungBang"   # khuôn bảng
`;
if (!BANG.includes(KHUON_GOC)) throw new Error('kho mẫu đổi khuôn: không thấy khối khuon gốc của bang-du-lieu');

// ── KD-1: mọi cách viết khoi = các mục riêng, ở bộ đọc và ở CLI --json ───────────────────────────────────────────
// Mỗi hàng: [mục viết thử, mục viết riêng mỗi mục một tên, các mục chuẩn hoá mong đợi]. Viết sẵn — không tính từ mã.
const rieng = (ds, lyDo) => ds.map(k => `  - tep: src/man/bang/Moi.tsx\n    khoi: ${k}\n    ly_do: "${lyDo}"\n`).join('');
const muc = (ds, lyDo) => ds.map(k => ({ tep: 'src/man/bang/Moi.tsx', khoi: k, ly_do: lyDo }));
const GOC_NL = { tep: 'src/man/bang/Cu.tsx', khoi: 'BangTho', ly_do: 'màn cũ chờ dời sang khuôn' };
const LD = 'thử ngoại lệ danh sách';
const MA_TRAN_KD1 = [
  { ten: 'mapping khối · một tên', thu: `  - tep: src/man/bang/Moi.tsx\n    khoi: Hop\n    ly_do: ${LD}\n`, ds: ['Hop'], ld: LD },
  { ten: 'mapping khối · danh sách một dòng', thu: `  - tep: src/man/bang/Moi.tsx\n    khoi: [Hop, BangTho]\n    ly_do: ${LD}\n`, ds: ['Hop', 'BangTho'], ld: LD },
  { ten: 'mapping khối · danh sách một dòng có nháy', thu: `  - tep: src/man/bang/Moi.tsx\n    khoi: ["Hop", 'BangTho']\n    ly_do: ${LD}\n`, ds: ['Hop', 'BangTho'], ld: LD },
  { ten: 'mapping khối · danh sách khối', thu: `  - tep: src/man/bang/Moi.tsx\n    khoi:\n      - Hop\n      - BangTho\n    ly_do: ${LD}\n`, ds: ['Hop', 'BangTho'], ld: LD },
  { ten: 'mapping một dòng · một tên', thu: `  - {tep: src/man/bang/Moi.tsx, khoi: Hop, ly_do: ${LD}}\n`, ds: ['Hop'], ld: LD },
  { ten: 'mapping một dòng · danh sách một dòng', thu: `  - {tep: src/man/bang/Moi.tsx, khoi: [Hop, BangTho], ly_do: ${LD}}\n`, ds: ['Hop', 'BangTho'], ld: LD },
  { ten: 'ly_do có dấu phẩy', thu: `  - {tep: src/man/bang/Moi.tsx, khoi: [Hop, BangTho], ly_do: "chờ tải, rồi dời"}\n`, ds: ['Hop', 'BangTho'], ld: 'chờ tải, rồi dời' },
];
function kiemKD1(kit, inSo = false) {
  if (inSo) console.log(`số hàng: ${MA_TRAN_KD1.length}`);
  const B = docLai(kit);
  const loi = [];
  const nl = j => (j.nhom || []).find(n => n.nhom === 'bang-du-lieu')?.ngoai_le;
  for (const h of MA_TRAN_KD1) {
    const mong = JSON.stringify([GOC_NL, ...muc(h.ds, h.ld)]);
    for (const [nhan, them] of [['viết thử', h.thu], ['viết riêng', rieng(h.ds, h.ld)]]) {
      const doc = B.docBanDo(bangVoiNgoaiLe(them), 'design/patterns/bang-du-lieu.md');
      if (!doc.nhom || JSON.stringify(doc.nhom.ngoai_le) !== mong) loi.push(`«${h.ten}» bộ đọc, ${nhan}: ${JSON.stringify(doc.nhom ? doc.nhom.ngoai_le : doc.sai)}`);
    }
    const kho = taoKhoMau(); ghi(kho, 'design/patterns/bang-du-lieu.md', bangVoiNgoaiLe(h.thu));
    const j = json(kit, kho);
    if (JSON.stringify(nl(j)) !== mong) loi.push(`«${h.ten}» CLI --json: ${JSON.stringify(nl(j) ?? j.loi)}`);
  }
  if (loi.length) loi.unshift('ngoại lệ dạng danh sách không được miễn');
  return loi;
}
if (want('KD-1')) ket('KD-1', kiemKD1(KIT, true));

// ── KD-2 / KD-3: bước chấm miễn đúng các khối của danh sách — đường lệch (tệp mới) và đường nợ cũ (tệp có ở base) ──
const MAN_MOI = `import { KhungBang } from '@/khuon/KhungBang';
import { Hop } from '@/ui/Hop';
import { BangTho } from '@/ui/BangTho';
export default function Moi() {
  return <KhungBang><Hop /><BangTho /></KhungBang>;
}
`;
const T = 'src/man/bang/Moi.tsx';
function khoNgoaiLe(dsKhoi, coBase) {
  const kho = taoKhoMau();
  if (coBase) { ghi(kho, T, MAN_MOI); git(kho, 'add', '-A'); git(kho, 'commit', '-qm', 'T có ở base'); }
  nhanh(kho, `nl-${dsKhoi.length}-${coBase ? 'cu' : 'moi'}`, {
    'design/patterns/bang-du-lieu.md': bangVoiNgoaiLe(`  - tep: ${T}\n    khoi: [${dsKhoi.join(', ')}]\n    ly_do: thử ngoại lệ danh sách\n`),
    [T]: coBase ? MAN_MOI + '// nhánh chạm T\n' : MAN_MOI,
  });
  return kho;
}
const HANG_KD2 = [{ ten: 'T mới', coBase: false }, { ten: 'T có ở base', coBase: true }];
function kiemKD2(kit) {
  const loi = [];
  for (const h of HANG_KD2) {
    const r = kiem(kit, khoNgoaiLe(['Hop', 'BangTho'], h.coBase));
    if (r.ma !== 0) loi.push(`«${h.ten}» thoát ${r.ma} (cần 0)`);
    const cham = dong(r.out).filter(l => l.includes(`${T} · Hop`) || l.includes(`${T} · BangTho`));
    if (cham.length) loi.push(`«${h.ten}» còn dòng cho khối đã khai: ${cham.join(' / ')}`);
  }
  if (loi.length) loi.unshift('ngoại lệ dạng danh sách không được miễn');
  return loi;
}
let lanhKD2 = null;
if (want('KD-2') || want('KD-2-do')) lanhKD2 = kiemKD2(KIT);
if (want('KD-2')) ket('KD-2', lanhKD2);
if (want('KD-2-do')) caDo('KD-2-do', kiemKD2, lanhKD2, () => banSaoTiem(['scripts', 'lib'], DOC, ...TIEM_TACH), 'ngoại lệ dạng danh sách không được miễn');
if (want('KD-3')) {
  const loi = [];
  for (const h of HANG_KD2) {
    const r = kiem(KIT, khoNgoaiLe(['Hop'], h.coBase));
    const dau = h.coBase ? 'nợ cũ' : 'lệch';
    if (!h.coBase && r.ma !== 1) loi.push(`«${h.ten}» thoát ${r.ma} (cần 1)`);
    const b = dong(r.out).filter(l => l.startsWith(`${dau}: ${T} · BangTho`));
    if (b.length !== 1) loi.push(`«${h.ten}» cần đúng 1 dòng «${dau}: ${T} · BangTho», có ${b.length}: ${r.out.trim()}`);
    const a = dong(r.out).filter(l => l.includes(`${T} · Hop`));
    if (a.length) loi.push(`«${h.ten}» khối đã khai vẫn bị in: ${a.join(' / ')}`);
  }
  ket('KD-3', loi);
}

// ── KD-4 / KD-5: lớp trình bày ──────────────────────────────────────────────────────────────────────────────────
// Nhóm phần tử trang-thai khai lớp trình bày TTLop; hai tệp dựng thẻ ấy trong khuôn bảng, một có khe title, một thiếu.
const TRANG_THAI_LOP = BAN_DO['trang-thai.md'].replace('khuon: {ten: TrangThaiMau, nhap: "@/khuon/TrangThaiMau"}', 'khuon: {ten: TrangThaiMau, nhap: "@/khuon/TrangThaiMau", lop_trinh_bay: TTLop}');
if (TRANG_THAI_LOP === BAN_DO['trang-thai.md']) throw new Error('kho mẫu đổi khuôn: không thấy dòng khuon của trang-thai');
const khe = coTitle => `import { KhungBang } from '@/khuon/KhungBang';
import { TTLop } from '@/khuon/TTLop';
export default function Khe() {
  return <KhungBang><TTLop${coTitle ? ' title="Trống"' : ''} /></KhungBang>;
}
`;
const MAN_LOP = (nhap, the) => `${nhap}\nexport default function Moi() {\n  return ${the};\n}\n`;
const NHAP_GOC = MAN_LOP("import { LopTB } from '@/khuon/LopTB';", '<LopTB title="Mới" />');
const vaoKhuon = them => BANG.replace(KHUON_GOC, KHUON_GOC + them);
const capDau = them => BANG.replace('nhan_viec: tra cứu nhiều bản ghi\n', `nhan_viec: tra cứu nhiều bản ghi\n${them}`);
const MA_TRAN_KD4 = [
  { ten: 'khuon.lop_trinh_bay chuỗi', bang: vaoKhuon('  lop_trinh_bay: LopTB\n'), tep: { [T]: NHAP_GOC } },
  { ten: 'khuon.lop_trinh_bay danh sách', bang: vaoKhuon('  lop_trinh_bay: [LopPhu, LopTB]\n'), tep: { [T]: NHAP_GOC } },
  { ten: 'cấp đầu chuỗi', bang: capDau('lop_trinh_bay: LopTB\n'), tep: { [T]: NHAP_GOC } },
  { ten: 'cấp đầu danh sách', bang: capDau('lop_trinh_bay: [LopPhu, LopTB]\n'), tep: { [T]: NHAP_GOC } },
  { ten: 'hai chỗ hợp lại', bang: capDau('lop_trinh_bay: LopHai\n').replace(KHUON_GOC, KHUON_GOC + '  lop_trinh_bay: LopTB\n'),
    tep: { [T]: NHAP_GOC, 'src/man/bang/Moi2.tsx': MAN_LOP("import { LopHai } from '@/khuon/LopHai';", '<LopHai />') } },
  { ten: 'nhập as', bang: vaoKhuon('  lop_trinh_bay: LopTB\n'), tep: { [T]: MAN_LOP("import { LopTB as Khung } from '@/khuon/LopTB';", '<Khung title="Mới" />') } },
  { ten: 'nhập mặc định', bang: vaoKhuon('  lop_trinh_bay: LopTB\n'), tep: { [T]: MAN_LOP("import LopTB from '@/khuon/LopTB';", '<LopTB title="Mới" />') } },
  { ten: 'nhập ns.LopTB', bang: vaoKhuon('  lop_trinh_bay: LopTB\n'), tep: { [T]: MAN_LOP("import * as kh from '@/khuon';", '<kh.LopTB title="Mới" />') } },
];
function kiemKD4(kit, inSo = false) {
  if (inSo) console.log(`số hàng: ${MA_TRAN_KD4.length}`);
  const loi = [];
  for (const [i, h] of MA_TRAN_KD4.entries()) {
    if (h.bang === BANG) { loi.push(`«${h.ten}»: hàng không đổi bản đồ (khuôn kho mẫu đã đổi)`); continue; }
    const kho = taoKhoMau();
    nhanh(kho, `lop-${i}`, {
      'design/patterns/bang-du-lieu.md': h.bang,
      'design/patterns/trang-thai.md': TRANG_THAI_LOP,
      ...h.tep,
      'src/man/bang/Khe1.tsx': khe(true),
      'src/man/bang/Khe2.tsx': khe(false),
    });
    const r = kiem(kit, kho);
    const ds = dong(r.out);
    for (const f of Object.keys(h.tep)) if (ds.some(l => l.startsWith(`lệch: ${f} · khuôn KhungBang`))) loi.push(`«${h.ten}»: tệp dựng lớp trình bày bị báo thiếu khuôn (${f})`);
    if (ds.some(l => l.includes('Khe1.tsx'))) loi.push(`«${h.ten}»: thẻ lớp trình bày đủ khe vẫn bị in: ${ds.filter(l => l.includes('Khe1.tsx')).join(' / ')}`);
    if (!ds.some(l => l === 'lệch: src/man/bang/Khe2.tsx · TrangThaiMau thiếu khe title · nhóm trang-thai')) loi.push(`«${h.ten}»: thẻ lớp trình bày thiếu khe không bị in: ${r.out.trim()}`);
    if (r.ma !== 1) loi.push(`«${h.ten}»: thoát ${r.ma} (cần 1 — chỉ vì Khe2 thiếu khe)`);
  }
  return loi;
}
let lanhKD4 = null;
if (want('KD-4') || want('KD-4-do')) lanhKD4 = kiemKD4(KIT, want('KD-4'));
if (want('KD-4')) ket('KD-4', lanhKD4);
if (want('KD-4-do')) caDo('KD-4-do', kiemKD4, lanhKD4, () => banSaoTiem(['scripts', 'lib'], DOC, ...TIEM_LOP), 'tệp dựng lớp trình bày bị báo thiếu khuôn');
if (want('KD-5')) {
  const loi = [];
  const hang = [
    { ten: 'không khai lớp trình bày', bang: BANG },
    { ten: 'khai tên khác', bang: BANG.replace(KHUON_GOC, KHUON_GOC + '  lop_trinh_bay: LopKhac\n') },
  ];
  for (const [i, h] of hang.entries()) {
    const kho = taoKhoMau();
    nhanh(kho, `khac-${i}`, { 'design/patterns/bang-du-lieu.md': h.bang, [T]: NHAP_GOC });
    const r = kiem(KIT, kho);
    if (r.ma !== 1) loi.push(`«${h.ten}»: thoát ${r.ma} (cần 1)`);
    if (!dong(r.out).includes(`lệch: ${T} · khuôn KhungBang · nhóm bang-du-lieu`)) loi.push(`«${h.ten}»: không in dòng lệch khuôn: ${r.out.trim()}`);
  }
  ket('KD-5', loi);
}

// ── KD-6: lời nhắc chỗ đặt glob ─────────────────────────────────────────────────────────────────────────────────
const ND_GOC = 'nhan_dien: ["src/man/**/*.tsx"]';
const SO_DK = 'nhan_dien:\n  dang_ky: src/khuon/so.ts\n  kind: [trang-thai]';
const TT = BAN_DO['trang-thai.md'];
if (!TT.includes(ND_GOC)) throw new Error('kho mẫu đổi khuôn: không thấy nhan_dien của trang-thai');
function kiemKD6(kit) {
  const loi = [];
  const B = docLai(kit);
  // (a) sổ đăng ký không tep
  const khoA = taoKhoMau();
  nhanh(khoA, 'so-dk', { 'design/patterns/trang-thai.md': TT.replace(ND_GOC, SO_DK) });
  const ra = kiem(kit, khoA);
  const dongA = dong(ra.out).find(l => l.startsWith('không đo được: nhóm trang-thai'));
  if (!dongA || !dongA.includes('nhan_dien.tep')) loi.push(`dòng --kiem không nói nhan_dien.tep: ${dongA || ra.out.trim()}`);
  const ja = json(kit, khoA);
  const kd = (ja.nhom || []).find(n => n.nhom === 'trang-thai')?.khong_doc_duoc || '';
  if (!kd.includes('nhan_dien.tep')) loi.push(`khong_doc_duoc không nói nhan_dien.tep: ${kd || ja.loi}`);
  // (b) tep cấp đầu — đặt sai chỗ
  const sai = B.docBanDo(TT.replace(ND_GOC, `${SO_DK}\ntep: ["src/man/**/*.tsx"]`), 'design/patterns/trang-thai.md');
  if (!sai.canh_bao.some(c => c.includes('nhan_dien.tep'))) loi.push(`tep cấp đầu không có cờ chỉ nhan_dien.tep: ${JSON.stringify(sai.canh_bao)}`);
  if (sai.canh_bao.some(c => c.endsWith('khoá lạ: tep'))) loi.push('tep cấp đầu vẫn nhận cờ «khoá lạ: tep» trơn');
  if (!sai.nhom || !sai.nhom.khong_doc_duoc) loi.push('tep cấp đầu bị đọc như glob của nhóm');
  // (c) glob đúng chỗ
  const dung = TT.replace(ND_GOC, `${SO_DK}\n  tep: ["src/man/**/*.tsx"]`);
  const ok = B.docBanDo(dung, 'design/patterns/trang-thai.md');
  if (!ok.nhom || !Array.isArray(ok.nhom.nhan_dien) || ok.nhom.nhan_dien[0] !== 'src/man/**/*.tsx' || ok.nhom.khong_doc_duoc !== null) loi.push(`nhan_dien.tep không được đọc: ${JSON.stringify(ok.nhom && { nd: ok.nhom.nhan_dien, kd: ok.nhom.khong_doc_duoc })}`);
  const khoC = taoKhoMau();
  nhanh(khoC, 'nd-tep', { 'design/patterns/trang-thai.md': dung });
  const rc = kiem(kit, khoC);
  if (dong(rc.out).some(l => l.startsWith('không đo được: nhóm trang-thai'))) loi.push(`glob ở nhan_dien.tep mà nhóm vẫn không đo: ${rc.out.trim()}`);
  if (loi.length) loi.unshift('lời nhắc không nói nhan_dien.tep');
  return loi;
}
let lanhKD6 = null;
if (want('KD-6') || want('KD-6-do')) lanhKD6 = kiemKD6(KIT);
if (want('KD-6')) ket('KD-6', lanhKD6);
if (want('KD-6-do')) caDo('KD-6-do', kiemKD6, lanhKD6, () => banSaoTiem(['scripts', 'lib'], DOC, ...TIEM_NHAC), 'lời nhắc không nói nhan_dien.tep');

// ── KD-7: kho mẫu hình dạng thật, đầu-cuối ─────────────────────────────────────────────────────────────────────
// Hình dạng tệp bản đồ của kho thứ nhất: nhóm khai bằng sổ đăng ký kèm nhan_dien.tep hẹp và danh sách ngoài khuôn lồng,
// khuôn có lớp trình bày lồng trong khối khuon, khe tuỳ chọn, cam_ho, thay_cho, thành phần tầng ngăn, sáu ngoại lệ (ba
// dạng danh sách). Tên giả.
const BAN_DO_THAT = `---
nhom: ngan-mau
doi_tuong: [the-a, the-b, the-c]
khuon:
  ten: KhungNganMau
  nhap: src/ngan/khung.tsx
  lop_trinh_bay: LopNgan
nhan_dien:
  dang_ky: src/ngan/host.tsx
  kind: [a, b, c, d, e, f, g, h]
  tep: [src/ngan/*-ngan.tsx]
  ngoai_khuon:
    - kind: soan
      ly_do: mặt trò chuyện, không phải ngăn
mau_dang_chay:
  doi_tuong: a
  tep: src/ngan/a-ngan.tsx
khe_bat_buoc: [loading, error, title]
khe_tuy_chon: [actions, tabs]
cam_ngoai_khuon: [DauNgan, Quay, VungLoi, Bang, Hop]
cam_ho: [Bang, Hop]
thay_cho:
  DauNgan: KhungNganMau
  Quay: ChoNgan
  VungLoi: LoiNgan
  Bang: KhungNganMau
  Hop: khối soạn trong ngăn
thanh_phan_tang_ngan:
  cho_tai: ChoNgan
  loi_tai: LoiNgan
ngoai_le:
  - tep: src/ngan/b-ngan.tsx
    khoi: Quay
    ly_do: chờ tải của riêng một mục trong thân đã tải xong
  - tep: src/ngan/c-ngan.tsx
    khoi: [Quay, VungLoi]
    ly_do: chờ tải và lỗi tải một mục trong thân
  - tep: src/ngan/d-ngan.tsx
    khoi: [Hop, Quay]
    ly_do: nợ — hộp nhỏ mở chồng lên ngăn; nút đang chạy
  - tep: src/ngan/e-ngan.tsx
    khoi: [VungLoi]
    ly_do: lỗi tải một mục trong thân
  - tep: src/ngan/f-ngan.tsx
    khoi: Quay
    ly_do: nút gửi đang chạy
  - tep: src/ngan/g-ngan.tsx
    khoi: VungLoi
    ly_do: lỗi tải một mục trong thân
nhan_viec: xem và sửa một bản ghi trong ngăn
---

## Dùng khi

Ngăn mở từ danh sách để xem và sửa một bản ghi.

## Không dùng

Mặt trò chuyện — không phải ngăn bản ghi.
`;
const ngan = (ten, khoi) => `import { KhungNganMau } from './khung';
${khoi.map(k => `import { ${k} } from '@/ui/${k}';`).join('\n')}
export default function ${ten}() {
  return <KhungNganMau loading={false} error={null} title="${ten}">${khoi.map(k => `<${k} />`).join('')}</KhungNganMau>;
}
`;
const TEP_THAT = {
  'src/ngan/a-ngan.tsx': ngan('A', []),
  'src/ngan/b-ngan.tsx': ngan('B', ['Quay']),
  'src/ngan/c-ngan.tsx': ngan('C', ['Quay', 'VungLoi']),
  'src/ngan/d-ngan.tsx': ngan('D', ['Hop', 'Quay']),
  'src/ngan/e-ngan.tsx': ngan('E', ['VungLoi']),
  'src/ngan/f-ngan.tsx': ngan('F', ['Quay']),
  'src/ngan/g-ngan.tsx': ngan('G', ['VungLoi']),
  'src/ngan/h-ngan.tsx': `import { LopNgan } from './khung';
export default function H() {
  return <LopNgan loading={false} error={null} title="H" />;
}
`,
};
const TEP_BASE = ['src/ngan/a-ngan.tsx', 'src/ngan/b-ngan.tsx', 'src/ngan/c-ngan.tsx', 'src/ngan/d-ngan.tsx'];
let _khoThat = null;
function khoThat() {
  if (_khoThat) return _khoThat;
  const kho = taoKhoMau({ coBanDo: false });
  ghi(kho, 'design/patterns/ngan-mau.md', BAN_DO_THAT);
  ghi(kho, 'src/ngan/khung.tsx', 'export function LopNgan(p) { return null; }\nexport function KhungNganMau(p) { return <LopNgan {...p} />; }\n');
  ghi(kho, 'src/ngan/host.tsx', 'export const so = {};\n');
  // Base có sẵn mẫu và ba ngăn mang khối ngoại lệ (b một tên · c, d danh sách) — đường nợ cũ.
  for (const f of TEP_BASE) ghi(kho, f, TEP_THAT[f]);
  git(kho, 'add', '-A');
  git(kho, 'commit', '-qm', 'bản đồ hình dạng thật');
  // Nhánh: chạm ba ngăn cũ, thêm ba ngăn mới mang khối ngoại lệ (e danh sách · f, g một tên) và một ngăn lớp trình bày.
  nhanh(kho, 'cham-ngan', Object.fromEntries(Object.entries(TEP_THAT).map(([f, t]) => [f, TEP_BASE.includes(f) ? t + '// nhánh chạm\n' : t])));
  return (_khoThat = kho);
}
function kiemKD7(kit) {
  const kho = khoThat();
  const r = kiem(kit, kho);
  const loi = [];
  if (r.ma !== 0) loi.push(`thoát ${r.ma} (cần 0)`);
  const bao = dong(r.out).filter(l => l.startsWith('lệch:') || l.startsWith('nợ cũ:'));
  if (bao.length) loi.push(`báo: ${bao.join(' / ')}`);
  const j = json(kit, kho);
  if (!j.sai || j.sai.length) loi.push(`sai lược đồ: ${JSON.stringify(j.sai ?? j.loi)}`);
  if (loi.length) loi.unshift('kho hình dạng thật còn báo oan');
  return loi;
}
let lanhKD7 = null;
if (want('KD-7') || want('KD-7-do')) lanhKD7 = kiemKD7(KIT);
if (want('KD-7')) ket('KD-7', lanhKD7);
if (want('KD-7-do')) caDo('KD-7-do', kiemKD7, lanhKD7, () => banSaoTiem(['scripts', 'lib'], DOC, ...TIEM_TACH), 'kho hình dạng thật còn báo oan');

process.exit(hong ? 1 : 0);

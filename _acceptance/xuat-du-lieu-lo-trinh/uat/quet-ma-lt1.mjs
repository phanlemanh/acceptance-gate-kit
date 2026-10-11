#!/usr/bin/env node
// Thước Cổng Giá trị X1, vế «bản chiếu không chứa luật suy trạng thái nào ngoài phép so ngày của mốc».
//
//   node quet-ma-lt1.mjs --goc <cây crm> [--ra <ket-qua.json>] [--mong-do <đoạn chữ>]
//
// Quét MỌI tệp mã của trang Lộ trình trong crm (đường dẫn chứa `lo-trinh`, dưới apps/app trừ test và
// proto, cộng khuôn kiểm ở packages/validation). Mỗi dòng chạm một trong năm dấu hiệu bị liệt kê; dòng
// nào KHÔNG khớp một mục cho-phép-có-lý-do bên dưới là ĐỎ (đảo chiều mặc định: lạ = đỏ, không đoán).
//   GHI   — gán một trường trạng thái của khối (trang_thai, nhom_trang_thai, con_viec, theo_loi, ho_so,
//           tien_do, hang_ke, co) → bản chiếu tự tạo trạng thái;
//   TU    — dùng chữ trạng thái của kit (tên ô bản đồ, «Chưa mở», «Không suy được», «theo lời») →
//           bản chiếu diễn giải chữ;
//   DOC   — đọc nguồn khác ngoài LO-TRINH.html (`_acceptance`, `docs/plan`, tệp kế hoạch, lớp phân tích);
//   CHU   — đọc `.trang_thai` (chữ trạng thái) → phải chỉ để in ra;
//   NGAY  — dùng ngày/«hôm nay» → phải là luật so ngày của tài liệu kit hoặc in số ngày.
// `--mong-do <đoạn>`: chiều đỏ — thoát 0 CHỈ KHI có dòng đỏ chứa đoạn ấy.
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const du = process.argv.slice(2); const opt = {}; for (let i = 0; i < du.length; i += 2) opt[du[i].replace(/^--/, '')] = du[i + 1];
if (!opt.goc) { console.error('thiếu --goc'); process.exit(2); }
const GOC = path.resolve(opt.goc);

// Từ vựng trạng thái RÚT TỪ KIT (bản đồ sản phẩm + lớp phân tích lộ trình), không viết tay.
const PM = await import(pathToFileURL(path.join(HERE, '..', '..', '..', 'scripts', 'product-map.mjs')).href);
const LT = await import(pathToFileURL(path.join(HERE, '..', '..', '..', 'scripts', 'lo-trinh.mjs')).href);
const TU_KIT = [...PM.SECTIONS.map(([, ten]) => ten), LT.CHUA_MO, LT.KHONG_SUY, LT.TIN_THEO_LOI, 'theo ghi chép'];
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const DAU = {
  GHI: /\b(trang_thai|nhom_trang_thai|con_viec|theo_loi|ho_so|tien_do|hang_ke|co)\s*(?:=(?!=)|:(?!:))/,
  TU: new RegExp(TU_KIT.map(esc).join('|'), 'i'),
  DOC: /_acceptance|docs\/plan|lo-trinh-[\w-]+\.json|phanTichKho|scripts\/lo-trinh|readdirSync|readFileSync|\.yaml/,
  CHU: /\.trang_thai\b/,
  NGAY: /new Date|Date\.(?:now|UTC|parse)|getFullYear|getMonth|getDate|homNay|ngayHopLe/,
};

// Cho phép CÓ LÝ DO — khoá theo tệp + một mẩu chữ của dòng. Mục nào không trúng dòng nào thì in ra
// (mục chết), để danh sách không phình âm thầm.
const CHO = [
  // GHI: khai kiểu/khuôn, không gán giá trị
  ['packages/validation/src/lo-trinh-du-lieu.ts', 'z.', 'khuôn zod kiểm khối — khai kiểu, không gán'],
  ['packages/validation/src/lo-trinh-du-lieu.ts', 'ngayHopLe: NGAY_ISO.test(moc.ngay) ? moc.ngay : null', 'chuẩn hoá ngày mốc: giữ ngày ISO hoặc null — đọc ngày, không suy trạng thái'],
  ['packages/validation/src/lo-trinh-du-lieu.ts', 'hang_ke: hangKe.nullable(),', 'khuôn zod — khoá hang_ke trỏ khuôn con'],
  ['packages/validation/src/lo-trinh-du-lieu.ts', 'tien_do: tienDo,', 'khuôn zod — khoá tien_do trỏ khuôn con'],
  ['packages/validation/src/lo-trinh-du-lieu.ts', ': Object.keys(', 'KHOA_LO_TRINH_DU_LIEU — danh sách tên khoá của khuôn'],
  ['apps/app/components/lo-trinh/o-trang-thai.tsx', 'type CoTrangThai = { nhom_trang_thai: NhomTrangThai; trang_thai: string }', 'khai kiểu'],
  // TU: nhãn hiển thị
  ['apps/app/components/lo-trinh/viec.ts', '"Chưa mở",', 'CHU_CUNG_NGHIA — chữ đồng nghĩa với nhãn nhóm thì không in lại chữ phụ; chỉ quyết in hay không, nhóm vẫn đọc từ khối'],
  ['apps/app/components/lo-trinh/viec.ts', '"Đã giao",', 'như trên'],
  ['apps/app/components/lo-trinh/viec.ts', '"Đang làm",', 'như trên'],
  ['apps/app/lib/messages/lo-trinh.ts', 'daGiao: "Đã giao"', 'nhãn tiếng Việt của nhóm da-giao'],
  ['apps/app/lib/messages/lo-trinh.ts', 'dangLam: "Đang làm"', 'nhãn tiếng Việt của nhóm dang-lam'],
  ['apps/app/lib/messages/lo-trinh.ts', 'xepLaiSau: "Xếp lại sau"', 'nhãn thẻ vòng đời của nhóm khac (lọc theo nhom_trang_thai đọc từ khối)'],
  ['apps/app/lib/messages/lo-trinh.ts', 'moTa: "Việc đội sản phẩm đang làm cho OneHub Center', 'câu mô tả trang'],
  ['apps/app/lib/messages/lo-trinh.ts', 'moTa: "Việc gắn một mốc đã qua mà kế hoạch chưa ghi là đã giao."', 'câu mô tả bộ lọc trễ mốc'],
  ['apps/app/lib/messages/lo-trinh.ts', 'đã giao trong phạm vi lọc', 'câu đếm ở đầu bảng'],
  ['apps/app/lib/messages/lo-trinh.ts', 'homNay: "today"', 'chữ «hôm nay» tiếng Anh'],
  ['apps/app/lib/messages/lo-trinh.ts', 'homNay: "hôm nay"', 'chữ «hôm nay»'],
  // DOC: đọc đúng một tệp
  ['apps/app/lib/lo-trinh/doc-tep.ts', 'import { existsSync, readFileSync } from "node:fs";', 'nhập hàm đọc tệp'],
  ['apps/app/lib/lo-trinh/doc-tep.ts', 'return existsSync(duong) ? readFileSync(duong, "utf8") : null;', 'đọc LO-TRINH.html (đường từ LO_TRINH.tep)'],
  // CHU: chỉ in / so với nhãn để quyết in chữ phụ
  ['apps/app/components/lo-trinh/o-trang-thai.tsx', 'v.trang_thai !== nhanNhom(m, v.nhom_trang_thai) &&', 'quyết có in chữ phụ không'],
  ['apps/app/components/lo-trinh/o-trang-thai.tsx', '!CHU_CUNG_NGHIA.has(v.trang_thai)', 'quyết có in chữ phụ không'],
  ['apps/app/components/lo-trinh/o-trang-thai.tsx', '{v.trang_thai}', 'in chữ phụ'],
  ['apps/app/components/lo-trinh/ho-so-viec.tsx', '{v.trang_thai}', 'in chữ phụ ở khung chi tiết'],
  // NGAY: luật so ngày của tài liệu kit + in số ngày
  ['apps/app/lib/lo-trinh/ngay.ts', '', 'luật so ngày (mocQuaConViec · viecTre · soNgay · homNayNguoiXem) — tương đương khối LUAT-NGAY của tài liệu kit, đo bằng hành vi ở man.json'],
  ['apps/app/components/lo-trinh/trang-lo-trinh.tsx', 'homNay', '«hôm nay» của người xem truyền vào phangViec'],
  ['apps/app/components/lo-trinh/viec.ts', 'homNay', 'truyền «hôm nay» cho viecTre/soNgay'],
  ['apps/app/components/lo-trinh/noi-dung.tsx', 'homNayCoDinh', 'truyền «hôm nay» cố định (bộ kiểm) xuống trang'],
  ['apps/app/components/lo-trinh/o-moc.tsx', '{v.conNgay === 0 ? m.moc.homNay : m.moc.conNgay(String(v.conNgay))}', 'in «hôm nay» / «còn N ngày»'],
  ['apps/app/components/lo-trinh/xem-moc.tsx', 'homNay', 'xem theo mốc: đếm mốc đã qua (ngày mốc < hôm nay) để tô dải thời gian — phép so ngày của mốc'],
];

function tep(d) {
  const ra = [];
  for (const t of readdirSync(d)) {
    const p = path.join(d, t); const s = statSync(p);
    if (s.isDirectory()) { if (t !== 'node_modules' && t !== 'test' && t !== 'proto') ra.push(...tep(p)); }
    else if (/\.(tsx?|jsx?|mjs)$/.test(t) && /lo-trinh/.test(path.relative(GOC, p))) ra.push(p);
  }
  return ra;
}
const ds = [...tep(path.join(GOC, 'apps/app')), path.join(GOC, 'packages/validation/src/lo-trinh-du-lieu.ts')].sort();
const trung = []; const do_ = []; const dungCho = new Set();
// Bộ đọc của trang là bản chép docDuLieu của kit: cho qua TRỌN tệp CHỈ KHI giống từng ký tự hàm trong kit.
const BO_DOC = 'apps/app/lib/lo-trinh/doc-du-lieu.js';
const kitDoc = (readFileSync(path.join(HERE, '..', '..', '..', 'scripts', 'lo-trinh.mjs'), 'utf8').match(/^export function docDuLieu[\s\S]*?\n}\n/m) || [''])[0];
let boDocChep = false;
for (const p of ds) {
  const rel = path.relative(GOC, p);
  if (rel === BO_DOC) {
    boDocChep = kitDoc !== '' && readFileSync(p, 'utf8') === kitDoc;
    if (boDocChep) { trung.push({ tep: rel, dong: 0, loai: ['CHEP'], chu: '(trọn tệp)', ly_do: 'giống từng ký tự docDuLieu của kit — bộ đọc khoan dung của kit, không phải mã của trang' }); continue; }
  }
  readFileSync(p, 'utf8').split('\n').forEach((dong, i) => {
    const loai = Object.entries(DAU).filter(([, re]) => re.test(dong)).map(([k]) => k);
    if (!loai.length) return;
    const c = CHO.findIndex(([f, manh]) => f === rel && dong.includes(manh));
    const muc = { tep: rel, dong: i + 1, loai, chu: dong.trim().slice(0, 160) };
    if (c >= 0) { dungCho.add(c); trung.push({ ...muc, ly_do: CHO[c][2] }); } else do_.push(muc);
  });
}
const chet = CHO.filter((_, i) => !dungCho.has(i)).map(([f, m]) => `${f} «${m}»`);
const ra = { goc: GOC, so_tep: ds.length, bo_doc_chep_nguyen_van_kit: boDocChep, tep: ds.map(p => path.relative(GOC, p)), tu_kit: TU_KIT, so_dong_cham: trung.length + do_.length, cho_phep: trung, do: do_, muc_cho_chet: chet };
if (opt.ra) writeFileSync(opt.ra, `${JSON.stringify(ra, null, 1)}\n`);
console.log(`bộ đọc ${BO_DOC} ${boDocChep ? 'là bản chép nguyên văn docDuLieu của kit' : 'KHÁC docDuLieu của kit — quét như mã thường'}`);
console.log(`quét ${ds.length} tệp mã trang Lộ trình · ${trung.length + do_.length} dòng chạm dấu hiệu · ${trung.length} có lý do · ${do_.length} ĐỎ`);
const dem = {}; for (const m of trung) for (const l of m.loai) dem[l] = (dem[l] || 0) + 1; console.log(`dòng có lý do theo loại: ${JSON.stringify(dem)}`);
for (const m of do_) console.log(`ĐỎ ${m.loai.join('+')} ${m.tep}:${m.dong} ${m.chu}`);
for (const c of chet) console.log(`mục cho-phép chết: ${c}`);
if (!opt['mong-do']) process.exit(do_.length ? 1 : 0);
const dat = do_.some(m => m.chu.includes(opt['mong-do']));
console.log(dat ? `CHIỀU ĐỎ ĐẠT: dòng chứa «${opt['mong-do']}» bị bắt` : `CHIỀU ĐỎ HỎNG: không dòng đỏ nào chứa «${opt['mong-do']}»`);
process.exit(dat ? 0 : 1);

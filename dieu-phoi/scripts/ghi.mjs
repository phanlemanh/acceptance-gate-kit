// Lệnh con ghi vào thư mục đợt (spec ô dù §2.3, design DP3 §3 chỗ chọn 4, 6). Phiên gọi lệnh bằng Bash,
// không bằng công cụ ghi tệp — thư mục đợt nằm ngoài worktree của phiên (sự cố 09/10). Mỗi lệnh kiểm khuôn
// bằng CHÍNH hàm kiểm của bên đọc (bộ phát lịch) rồi mới ghi nguyên tử; tên tệp theo khuôn bên đọc.
// Lệnh của thợ (`xin`, `nha`, `yeu-cau`) đòi cwd thuộc một dãy; lệnh của giám sát chạy từ mọi cwd trong kho.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { daGopTrenNhanhChinh, DA_THONG, trangThaiHopDong } from './phat-lich.mjs';
import { docJson, ghiJsonNguyenTu, phienCuaCwd, timThuMucDot } from './dot.mjs';
import { ghiNhatKy } from './hang.mjs';
import { docHangViec, kiemDon, kiemTraLoi, kiemYeuCau } from './hinh-dang.mjs';
import { docVai, laGiamSat } from './vai.mjs';
import { ghiKetQuaNha } from './do-lan.mjs';

function canDot(cwd, lenh) {
  const thuMuc = timThuMucDot(cwd);
  if (!thuMuc) throw new Error(`${lenh}: không có đợt nào đang chạy`);
  return thuMuc;
}

function dayCua(cwd, lenh) {
  const thuMuc = canDot(cwd, lenh);
  const hangViec = docHangViec(thuMuc);
  const id = phienCuaCwd(hangViec, cwd);
  if (!id) throw new Error(`${lenh}: cwd không thuộc dãy nào của đợt — chạy từ worktree của dãy`);
  return { thuMuc, hangViec, day: hangViec.day.find((d) => d.id === id) };
}

// Lệnh chỉ giám sát được ghi: `--phien` có mà khác giám sát trong vai.json → từ chối, không ghi gì.
export function kiemGiamSat(thuMuc, phien, lenh) {
  if (typeof phien !== 'string' || phien === '') return;
  if (laGiamSat(thuMuc, phien) === false) {
    throw new Error(`${lenh}: phiên ${phien} không phải giám sát hiện tại (${docVai(thuMuc).giam_sat.phien})`);
  }
}

function slugKeCua(thuMuc, hangViec, id) {
  const tiep = docJson(path.join(thuMuc, 'tiep', `${id}.json`), null);
  if (tiep?.hang) return tiep.hang;
  return (hangViec.hang ?? []).filter((h) => h.day === id).sort((a, b) => (a.uu_tien ?? 99) - (b.uu_tien ?? 99))[0]?.slug ?? null;
}

// Đơn của lượt chạm một hồ sơ đã có hợp đồng (hồ sơ lenh-dot-ghi-dung-hang) mang hàng ĐANG CHẤM, không hàng kế: hồ sơ vừa đã
// thông trong worktree thì lịch đã chuyển `tiep` sang hàng sau, mà lượt chấm lại hay ghim lại vẫn của hàng cũ. Ứng viên =
// hàng của dãy có hợp đồng trong worktree mà nhánh chính chưa gộp, theo bậc của loại lượt: `s4` lấy hồ sơ đang chấm
// (`implemented`, `verified`) rồi mới tới hồ sơ đã thông (chấm lại sau ký); `ghim-lai`, `merge` chỉ hồ sơ đã thông. Bậc đầu
// có đúng một → nó; từ hai → từ chối. Đường nền chạy ở S1 của hàng kế, trước khi hợp đồng của nó có — giữ lối `tiep`.
const BAC_THEO_LOAI = { s4: [['implemented', 'verified'], DA_THONG], 'ghim-lai': [DA_THONG], merge: [DA_THONG] };

function hoSoChuaGop(thuMuc, hangViec, day) {
  const nhanh = docJson(path.join(thuMuc, 'dieu-phoi.config.json'), {})?.nhanh_chinh ?? 'main';
  const ra = [];
  for (const h of (hangViec.hang ?? []).filter((x) => x.day === day.id)) {
    const p = path.join(day.worktree, '_acceptance', h.slug, 'contract.md');
    if (!fs.existsSync(p)) continue;
    let trenNhanhChinh = null;
    try {
      trenNhanhChinh = execFileSync('git', ['show', `origin/${nhanh}:_acceptance/${h.slug}/contract.md`], { cwd: day.worktree, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
    } catch {
      trenNhanhChinh = null;
    }
    if (!daGopTrenNhanhChinh(trenNhanhChinh)) ra.push({ slug: h.slug, status: trangThaiHopDong(fs.readFileSync(p, 'utf8')) });
  }
  return ra;
}

function slugCuaDon(thuMuc, hangViec, day, loai) {
  const bac = BAC_THEO_LOAI[loai];
  if (bac) {
    const hoSo = hoSoChuaGop(thuMuc, hangViec, day);
    for (const trangThai of bac) {
      const ung = hoSo.filter((x) => trangThai.includes(x.status)).map((x) => x.slug);
      if (ung.length === 1) return ung[0];
      if (ung.length > 1) throw new Error(`xin: dãy ${day.id} có ${ung.length} hồ sơ ${trangThai.join('/')} chưa gộp (${ung.join(', ')}) — truyền --slug <slug đang chấm>`);
    }
  }
  return slugKeCua(thuMuc, hangViec, day.id);
}

export function ghiDon(cwd, { loai, uocPhut = null, moMerge = false, slug = null }) {
  const { thuMuc, hangViec, day } = dayCua(cwd, 'xin');
  const don = { phien: day.id, slug: slug ?? slugCuaDon(thuMuc, hangViec, day, loai), loai, luc: new Date().toISOString(), worktree: day.worktree };
  if (uocPhut != null) don.uoc_phut = Number(uocPhut);
  if (moMerge) don.mo_merge = true;
  kiemDon(don);
  const p = path.join(thuMuc, 'xin', `${day.id}-${loai}.json`);
  ghiJsonNguyenTu(p, don);
  return p;
}

export function nhaKhoa(cwd, taiNguyen, { ma = null, haTang = null } = {}) {
  const { thuMuc, day } = dayCua(cwd, 'nha');
  const maSo = ma === null || ma === undefined || ma === '' ? null : Number(ma);
  if (maSo !== null && !Number.isInteger(maSo)) throw new Error(`nha: --ma ${ma} không phải mã thoát nguyên`);
  const d = path.join(thuMuc, 'khoa', String(taiNguyen));
  if (!fs.existsSync(d)) return `nha: khoá ${taiNguyen} không có — không làm gì`;
  const chu = docJson(path.join(d, 'chu.json'), null);
  if (chu?.phien !== day.id) throw new Error(`nha: khoá ${taiNguyen} không do ${day.id} giữ (${chu?.phien ?? '?'})`);
  ghiKetQuaNha(thuMuc, String(taiNguyen), { ma: maSo, haTang: typeof haTang === 'string' && haTang !== '' ? haTang : null });
  fs.rmSync(d, { recursive: true, force: true });
  return `nha: đã nhả ${taiNguyen}`;
}

export function ghiYeuCau(cwd, { loai, hang = null, noiDung = {} }) {
  const { thuMuc, day } = dayCua(cwd, 'yeu-cau');
  const so = (ten) => {
    const m = new RegExp(`^${day.id}-(\\d+)\\.json$`).exec(ten);
    return m ? Number(m[1]) : 0;
  };
  const daCo = ['yeu-cau', 'tra-loi', path.join('tra-loi', 'hong')].flatMap((t) => (fs.existsSync(path.join(thuMuc, t)) ? fs.readdirSync(path.join(thuMuc, t)) : []));
  const id = `${day.id}-${Math.max(0, ...daCo.map(so)) + 1}`;
  const yc = { phien: day.id, loai, hang, noi_dung: noiDung, luc: new Date().toISOString() };
  kiemYeuCau(yc);
  ghiJsonNguyenTu(path.join(thuMuc, 'yeu-cau', `${id}.json`), yc);
  return id;
}

export function ghiTraLoi(cwd, id, traLoi, { phien = null } = {}) {
  const thuMuc = canDot(cwd, 'tra-loi');
  kiemGiamSat(thuMuc, phien, 'tra-loi');
  if (!/^[\w-]+$/.test(id ?? '')) throw new Error('tra-loi: id yêu cầu không hợp lệ');
  const du = { boi: 'giam-sat', luc: new Date().toISOString(), ...traLoi };
  kiemTraLoi(du);
  ghiJsonNguyenTu(path.join(thuMuc, 'tra-loi', `${id}.json`), du);
  return id;
}

export function ghiNhatKyCli(cwd, cau, { phien = null } = {}) {
  const thuMuc = canDot(cwd, 'nhat-ky');
  kiemGiamSat(thuMuc, phien, 'nhat-ky');
  if (typeof cau !== 'string' || cau.trim() === '') throw new Error('nhat-ky: thiếu câu');
  ghiNhatKy(thuMuc, cau);
  return 'nhat-ky: đã ghi';
}

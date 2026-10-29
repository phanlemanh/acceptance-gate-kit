#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { veBang } from './bang.mjs';
import { docCauHinh, docHangViec, kiemCoBan, kiemDon, kiemTraLoi, kiemYeuCau } from './hinh-dang.mjs';
import { GIAY_MS, NHIP, PHUT_MS } from './cau-hinh.mjs';
import { docJson, ghiJsonNguyenTu, ghiSuKien } from './dot.mjs';
import { docPha } from './pha.mjs';
import { giuMay, nhaMay, thuHoiMayChet } from './may.mjs';
import { xetHanMucNhip } from './han-muc.mjs';
import { buocBanGiao } from './ban-giao.mjs';
import { docNhomKeHoach } from './nguon-hang.mjs';
import { capLuot, chonHangKe, hanGiaHan, xetHanThue } from './lich.mjs';
import { bangQuyet } from './the.mjs';
import { coThuMucSong, NGUONG_SONG_MS, nhipMoiNhatCua } from './song.mjs';
import { danhGiaSucKhoe, docApLuc, docLoad, docMucTrong, docRamGb, docRssLonNhat, docSwap, docVmStat, tocDoSwapinMbPhut, vuaLan } from './suc-khoe.mjs';
import { batDauLuot, capNhatLuot, danhDauThuHoi, docSoDo, dongLuotDaXong, LOAI_NANG, nhuCau, TAI_NGUYEN_NANG } from './do-lan.mjs';
import { xetYeuCau } from './yeu-cau.mjs';
import { chuyenVaoCua, docCua } from './cua-tin-hieu.mjs';
import { chupNhanhMo, docChupNhanhMo, docNhanhMo, tepTheoNhanh, xetTrungTep } from './trung-tep.mjs';
import { themSau } from './khoa-hang-viec.mjs';
import { soDoGop } from './do-gop.mjs';

export const CAC_TAI_NGUYEN = ['s4', 'duong-nen', 'merge'];
// Thư mục mã của CHÍNH bộ phát lịch đang chạy (bình thường là `<thư mục đợt>/loi/`, do `chay` chép).
// Mã đã nạp vẫn chạy khi thư mục bị xoá, nhưng không ai khởi động lại được nó và hook của cùng bản
// cũng mất — nên nhịp ngừng thu hồi/cấp khoá thay vì cấp lại khoá cho người khác.
const DAY_LOI = path.dirname(fileURLToPath(import.meta.url));
export const loiCon = () => fs.existsSync(path.join(DAY_LOI, 'phat-lich.mjs'));
const KHOA_TRONG_MS = NHIP.khoaTrongMs;
const MOT_NGAY_MS = NHIP.motNgayMs;
// Việc phụ / việc mới: sự kiện mang `chan` — đường đo của hồ sơ cua-tin-hieu-giua-chien-dich đếm ý không chặn.
const Y_MOI = new Set(['viec-phu', 'hang-moi']);
const chanCua = (y) => (Y_MOI.has(y.loai) ? { chan: y.noi_dung?.chan === true } : {});

export function trangThaiHopDong(text) {
  return text.match(/^status:\s*(\S+)/m)?.[1] ?? null;
}

// «Đã gộp» đọc từ bản hợp đồng trên nhánh chính — một nguồn cho bộ phát lịch và đơn xin lượt (hồ sơ lenh-dot-ghi-dung-hang).
// Hồ sơ T1 không qua cổng nào nên giữ `draft` mãi; có mặt trên nhánh chính là đã gộp (kit #308 c5). `text` null → chưa gộp.
export function daGopTrenNhanhChinh(text) {
  if (typeof text !== 'string') return false;
  if (DA_THONG.includes(trangThaiHopDong(text))) return true;
  return text.match(/^risk_tier:\s*(\S+)/m)?.[1] === 'T1';
}

const tuoiPhut = (p, nowMs) => {
  try {
    return (nowMs - fs.statSync(p).mtimeMs) / PHUT_MS;
  } catch {
    return null;
  }
};

function xuLyKhoa(thuMuc, cfg, nowMs) {
  const dangGiu = {};
  for (const tn of CAC_TAI_NGUYEN) {
    const d = path.join(thuMuc, 'khoa', tn);
    dangGiu[tn] = null;
    if (!fs.existsSync(d)) continue;
    const chu = docJson(path.join(d, 'chu.json'));
    if (!chu) {
      if (nowMs - fs.statSync(d).mtimeMs > KHOA_TRONG_MS) {
        fs.rmSync(d, { recursive: true, force: true });
        ghiSuKien(thuMuc, { loai: 'thu-hoi', tai_nguyen: tn, ly_do: 'thư mục khoá trống quá 60″', can_phan: true });
      } else {
        dangGiu[tn] = { phien: '?' };
      }
      continue;
    }
    const nhip = tuoiPhut(path.join(d, 'nhip'), nowMs);
    const kq = xetHanThue({ chu, nhipTuoiPhut: nhip, nowMs, cfg });
    if (kq.hanhDong === 'gia-han') {
      ghiJsonNguyenTu(path.join(d, 'chu.json'), { ...chu, han_thue_den: kq.hanMoi });
      ghiSuKien(thuMuc, { loai: 'gia-han', tai_nguyen: tn, phien: chu.phien, han_moi: kq.hanMoi });
      dangGiu[tn] = { ...chu, han_thue_den: kq.hanMoi };
    } else if (kq.hanhDong === 'thu-hoi') {
      danhDauThuHoi(thuMuc, tn);
      fs.rmSync(d, { recursive: true, force: true });
      ghiSuKien(thuMuc, { loai: 'thu-hoi', tai_nguyen: tn, phien: chu.phien, ly_do: 'hết hạn thuê, nhịp cũ', can_phan: true });
    } else {
      dangGiu[tn] = chu;
    }
  }
  return dangGiu;
}

function docThuMucJson(thuMuc, ten, kiem = kiemCoBan) {
  const d = path.join(thuMuc, ten);
  if (!fs.existsSync(d)) return [];
  const tot = [];
  for (const f of fs.readdirSync(d).filter((x) => x.endsWith('.json'))) {
    const p = path.join(d, f);
    try {
      const du = kiem(JSON.parse(fs.readFileSync(p, 'utf8')));
      tot.push({ ...du, _tep: p, _ten: f.replace(/\.json$/, '') });
    } catch (e) {
      fs.mkdirSync(path.join(d, 'hong'), { recursive: true });
      fs.renameSync(p, path.join(d, 'hong', f));
      ghiSuKien(thuMuc, { loai: ten === 'xin' ? 'don-hong' : 'yeu-cau-hong', tep: f, ly_do: e.message, can_phan: true });
    }
  }
  return tot;
}

// Pha của đợt quyết tài nguyên nào được cấp (spec workflow §3): đang chạy cấp mọi thứ; đang đóng chỉ
// hoàn tất merge dở; nháp và tạm dừng không cấp gì.
export const choPhepTheoPha = (pha, taiNguyen) => pha === 'dang-chay' || (pha === 'dang-dong' && taiNguyen === 'merge');

// `may` = {ap, cho}: đợt mở từ gói (ap) xét thêm khoá s4 cấp máy trước khi cấp s4; không giữ được thì
// đơn ở lại hàng chờ và `cho` ghi kho đang giữ.
// `choDatLai` (DP4): một cửa sổ hạn mức chạm ngưỡng mà sắp đặt lại → không cấp lượt mới nào tới khi đặt lại.
const commitCua = (io, worktree) => {
  try {
    return io?.chay('git', ['-C', worktree, 'rev-parse', 'HEAD']).trim() || null;
  } catch {
    return null;
  }
};

function capPhat(thuMuc, cfg, hangViec, dangGiu, giamTai, nowMs, pha = 'dang-chay', may = { ap: false, cho: null }, choDatLai = null, sk = null, io = null, so = []) {
  const donXin = docThuMucJson(thuMuc, 'xin', kiemDon);
  const nhuCauLoai = new Map();
  const nhuCauCua = (loai) => {
    if (!nhuCauLoai.has(loai)) nhuCauLoai.set(loai, LOAI_NANG.includes(loai) ? nhuCau({ kho: cfg.goc_kho ?? null, loai, cfg, so }) : { gb: null, nguon: 'chua' });
    return nhuCauLoai.get(loai);
  };
  const vua = (don) => (sk ? vuaLan(don.loai, sk, nhuCauCua(don.loai), cfg) : { duoc: true, ly_do: null });
  for (const { taiNguyen, don } of capLuot({ donXin, dangGiu, giamTai, hangViec, vua })) {
    if (!choPhepTheoPha(pha, taiNguyen)) continue;
    if (choDatLai) continue;
    if (taiNguyen === 's4' && may.ap) {
      const thuHoi = thuHoiMayChet(nowMs);
      if (thuHoi) ghiSuKien(thuMuc, { loai: 'thu-hoi-may', kho: thuHoi.kho, dot: thuHoi.dot, ly_do: thuHoi.ly_do, can_phan: true });
      const giu = giuMay(thuMuc, { kho: cfg.goc_kho ?? null, phien: don.phien });
      if (!giu.duoc) {
        may.cho = giu.chu?.kho ?? '(không rõ)';
        continue;
      }
    }
    const d = path.join(thuMuc, 'khoa', taiNguyen);
    try {
      fs.mkdirSync(d);
    } catch {
      continue;
    }
    const chu = {
      phien: don.phien,
      slug: don.slug,
      loai: don.loai,
      worktree: fs.realpathSync(don.worktree),
      cap_luc: new Date(nowMs).toISOString(),
      han_thue_den: new Date(nowMs + cfg.han_thue_phut[don.loai] * PHUT_MS).toISOString(),
    };
    ghiJsonNguyenTu(path.join(d, 'chu.json'), chu);
    if (sk && TAI_NGUYEN_NANG.includes(taiNguyen)) batDauLuot(thuMuc, taiNguyen, chu, { sk, nguon: nhuCauCua(don.loai).nguon, commit: commitCua(io, chu.worktree), nowMs });
    fs.rmSync(don._tep, { force: true });
    ghiSuKien(thuMuc, { loai: 'cap', tai_nguyen: taiNguyen, phien: don.phien, slug: don.slug, don: don.loai });
  }
  return docThuMucJson(thuMuc, 'xin', kiemDon).map(({ phien, loai, luc }) => ({ phien, loai, luc, cho: vua({ loai }).ly_do }));
}

// PR đang mở + nhánh của từng dãy, dò lười và nhiều nhất một lần mỗi nhịp (hồ sơ ky-den-gop, hạng C). `song()` dò lại
// (xét chạm tệp cần số tươi); `gan()` dùng bản chụp trong trang-thai.json khi còn dưới một phút — chọn hàng kế chạy
// mỗi nhịp 5″, gọi gh mỗi nhịp là phí. Bản chụp mới (hoặc cũ giữ nguyên) ghi lại ở cuối nhịp cho `hang them` đọc.
const NHANH_MO_TUOI_MS = PHUT_MS;
function boNhanhMo(io, cfg, hangViec, chupCu, nowMs) {
  let nhanhDay = null;
  let daDoc = false;
  let tuoi = null;
  const layNhanhDay = () => {
    if (nhanhDay) return nhanhDay;
    nhanhDay = new Map();
    for (const d of hangViec.day) {
      let n = null;
      try {
        n = io.chay('git', ['-C', d.worktree, 'rev-parse', '--abbrev-ref', 'HEAD']).trim() || null;
      } catch {
        n = null;
      }
      nhanhDay.set(d.id, n === 'HEAD' ? null : n);
    }
    return nhanhDay;
  };
  const doc = () => {
    if (!daDoc) {
      tuoi = docNhanhMo(io, cfg);
      daDoc = true;
    }
    return tuoi;
  };
  // gh lỗi hẳn (không dò được PR nào) mà có bản chụp tốt đời trước → mọi bên đọc (xét chạm tệp lẫn chọn hàng kế) so
  // bằng bản chụp ấy, lời báo nêu tuổi; bản chụp tốt không bị bản dò hỏng ghi đè (gap-probe P0; S4-r1: nhịp có yêu cầu
  // chờ từng dò trước ở đường xét chạm tệp rồi trả bản rỗng cho lịch và ghi đè bản chụp tốt).
  const hongHan = (nm) => nm.loi && nm.theoNhanh.size === 0 && chupCu?.theo_nhanh && !chupCu.loi;
  const quaChup = (nm) => {
    if (!hongHan(nm)) return nm;
    const phut = Math.round((nowMs - Date.parse(chupCu.luc)) / PHUT_MS);
    return docChupNhanhMo(chupCu, `${nm.loi} — lịch so bằng bản chụp PR cũ ${phut}′ (${chupCu.luc})`);
  };
  return {
    song: () => quaChup(doc()),
    gan: () => (!daDoc && chupCu && nowMs - Date.parse(chupCu.luc) < NHANH_MO_TUOI_MS ? docChupNhanhMo(chupCu) : quaChup(doc())),
    nhanhDay: layNhanhDay,
    chup: () => (daDoc && !hongHan(tuoi) ? { ...chupNhanhMo(tuoi, new Date(nowMs).toISOString()), nhanh_day: Object.fromEntries(layNhanhDay()) } : chupCu ?? null),
  };
}

function xuLyYeuCau(thuMuc, cfg, hangViec, io, trangThaiCu, nowMs, bo) {
  const tatCa = docThuMucJson(thuMuc, 'yeu-cau', kiemYeuCau);
  const daBao = new Set(trangThaiCu.da_bao ?? []);
  const choXet = tatCa.filter((y) => !fs.existsSync(path.join(thuMuc, 'tra-loi', `${y._ten}.json`)) && !daBao.has(y._ten));
  if (choXet.length === 0) return [...daBao];
  const pThem = path.join(thuMuc, 'ranh-gioi-them.json');
  let nguCanh = {
    hangViec,
    ranhGioiThem: docJson(pThem, {}),
    nhanhChamTep: tepTheoNhanh(bo.song().theoNhanh),
    nhanhLoi: bo.song().loi,
    nhanhCua: (phien) => bo.nhanhDay().get(phien) ?? null,
    khoaCua: (phien) => CAC_TAI_NGUYEN.filter((tn) => docJson(path.join(thuMuc, 'khoa', tn, 'chu.json'))?.phien === phien),
    yeuCauGanDay: tatCa.filter((y) => nowMs - Date.parse(y.luc) < MOT_NGAY_MS).map((y) => ({ ...y, id: y._ten })),
    cua: docCua(cfg.goc_kho),
  };
  // Tên tệp tín hiệu mang tên đợt: mã yêu cầu `<dãy>-<số>` đếm lại từ 1 mỗi đợt, mà tệp ở cửa sống qua nhiều đợt.
  const tenDot = hangViec.dot || path.basename(thuMuc).replace(/^dieu-phoi-/, '');
  for (const y of choXet) {
    let kq = xetYeuCau({ ...y, id: y._ten }, nguCanh, cfg);
    const tenTep = `${tenDot}-${y._ten}`;
    if (kq.ket_qua === 'ghi') kq = chuyenVaoCua(nguCanh.cua, tenTep, y, kq);
    if (kq.ket_qua === 'can_phan') {
      ghiSuKien(thuMuc, { loai: 'yeu-cau', id: y._ten, phien: y.phien, kieu: y.loai, ...chanCua(y), ly_do: kq.ly_do, dich: kq.dich ?? 'giam-sat', can_phan: true });
      daBao.add(y._ten);
      continue;
    }
    ghiJsonNguyenTu(path.join(thuMuc, 'tra-loi', `${y._ten}.json`), { ...kq, luc: new Date(nowMs).toISOString() });
    if (y.loai === 'cham-tep' && kq.ket_qua === 'duyet') {
      const cu = nguCanh.ranhGioiThem;
      const moi = { ...cu, [y.phien]: [...new Set([...(cu[y.phien] ?? []), ...y.noi_dung.tep])] };
      ghiJsonNguyenTu(pThem, moi);
      nguCanh = { ...nguCanh, ranhGioiThem: moi };
    }
    ghiSuKien(thuMuc, { loai: 'yeu-cau', id: y._ten, phien: y.phien, kieu: y.loai, ...chanCua(y), ket_qua: kq.ket_qua });
  }
  return [...daBao];
}

function chonTaiNguyen(thuMuc, yc, tra) {
  const ten = tra.tai_nguyen ?? yc.noi_dung?.tai_nguyen;
  if (ten !== undefined) return { taiNguyen: ten };
  const dangGiu = CAC_TAI_NGUYEN.filter((tn) => docJson(path.join(thuMuc, 'khoa', tn, 'chu.json'))?.phien === yc.phien);
  if (dangGiu.length === 1) return { taiNguyen: dangGiu[0] };
  return { loi: dangGiu.length === 0 ? `${yc.phien} không còn giữ khoá nào` : `${yc.phien} giữ ${dangGiu.join(', ')} — tra-loi phải nêu tai_nguyen` };
}

function docTraLoi(thuMuc, ten) {
  const tep = `${ten}.json`;
  const nguon = path.join(thuMuc, 'tra-loi', tep);
  if (!fs.existsSync(nguon)) return null;
  try {
    return kiemTraLoi(JSON.parse(fs.readFileSync(nguon, 'utf8')));
  } catch (e) {
    const noiHong = path.join(thuMuc, 'tra-loi', 'hong');
    fs.mkdirSync(noiHong, { recursive: true });
    fs.renameSync(nguon, path.join(noiHong, tep));
    ghiSuKien(thuMuc, { loai: 'tra-loi-hong', tep, ly_do: `tra-loi/${tep}: ${e.message}`, can_phan: true });
    return null;
  }
}

function apGiaHan(thuMuc, nowMs, daBaoCu) {
  const daBao = new Set(daBaoCu);
  for (const y of docThuMucJson(thuMuc, 'yeu-cau', kiemYeuCau).filter((x) => x.loai === 'gia-han')) {
    const dau = `gia-han:${y._ten}`;
    if (daBao.has(dau)) continue;
    const tra = docTraLoi(thuMuc, y._ten);
    if (tra?.ket_qua !== 'duyet') continue;
    const bao = (ly_do) => {
      ghiSuKien(thuMuc, { loai: 'gia-han-khong-ap', id: y._ten, phien: y.phien, ly_do, can_phan: true });
      daBao.add(dau);
    };
    const { taiNguyen, loi } = chonTaiNguyen(thuMuc, y, tra);
    if (loi) {
      bao(loi);
      continue;
    }
    const pChu = path.join(thuMuc, 'khoa', String(taiNguyen), 'chu.json');
    const chu = CAC_TAI_NGUYEN.includes(taiNguyen) ? docJson(pChu) : null;
    if (!chu || chu.phien !== y.phien) {
      bao(`khoá ${taiNguyen} không còn do ${y.phien} giữ`);
      continue;
    }
    if (Date.parse(y.luc) < Date.parse(chu.cap_luc)) continue;
    if ((chu.gia_han_theo ?? []).includes(y._ten)) {
      daBao.add(dau);
      continue;
    }
    const phut = [tra.uoc_phut, y.noi_dung?.uoc_phut].find((v) => v !== undefined);
    if (!(Number.isFinite(phut) && phut > 0)) {
      bao('tra-loi duyệt nhưng không có số phút dương');
      continue;
    }
    const hanMoi = hanGiaHan({ hanCu: chu.han_thue_den, nowMs, phut });
    ghiJsonNguyenTu(pChu, { ...chu, han_thue_den: hanMoi, gia_han_theo: [...(chu.gia_han_theo ?? []), y._ten] });
    ghiSuKien(thuMuc, { loai: 'gia-han', tai_nguyen: taiNguyen, phien: y.phien, han_moi: hanMoi, theo_yeu_cau: y._ten });
    daBao.add(dau);
  }
  return [...daBao];
}

// Trạng thái hợp đồng «đã thông» (DP7 AC-4; hạt giống lõi chuyển nguyên, mục 4): hàng đi làn V kết ở `machine-cleared`,
// hàng reality đóng ở `da-cham-boi-thuc-te`. «Xong» cùng nghĩa với trang lộ trình — gói cài riêng nên không nạp
// được `classify` của kit; đây là bản chép có marker, ca DP7-04 tap-kit so nó với `classify` trên hồ sơ thật.
// <<<DA-THONG
export const DA_THONG = ['signed-off', 'machine-cleared', 'da-cham-boi-thuc-te'];
// DA-THONG>>>

// Chờ người có MỘT danh sách (DP7 AC-7): ngoài tệp `cho-nguoi/` do hook ghi, mỗi yêu cầu `can-nguoi` của thợ
// chưa có `tra-loi/` cũng là một lần chờ chủ kho — bảng đợt, `xem` và lệnh đếm cùng đọc danh sách này. Đọc
// không qua docThuMucJson: tệp hỏng đã do xuLyYeuCau chuyển vào `hong/` trong cùng nhịp.
function choNguoiYeuCau(thuMuc, lienKetCua) {
  const d = path.join(thuMuc, 'yeu-cau');
  if (!fs.existsSync(d)) return [];
  const ra = [];
  for (const f of fs.readdirSync(d).filter((x) => x.endsWith('.json')).sort()) {
    if (fs.existsSync(path.join(thuMuc, 'tra-loi', f))) continue;
    let y;
    try {
      y = docJson(path.join(d, f));
    } catch {
      continue;
    }
    if (y?.loai !== 'can-nguoi' || typeof y.phien !== 'string') continue;
    const tin = typeof y.noi_dung?.cau_hoi === 'string' ? y.noi_dung.cau_hoi : JSON.stringify(y.noi_dung ?? {});
    ra.push({ phien: y.phien, loai: 'can-nguoi', tin, luc: y.luc, link: lienKetCua.get(y.phien) });
  }
  return ra;
}

function tienDoCua(hangViec, cfg, io) {
  const td = new Map();
  for (const h of hangViec.hang) {
    let trenNhanhChinh = null;
    try {
      trenNhanhChinh = io.chay('git', ['show', `origin/${cfg.nhanh_chinh}:_acceptance/${h.slug}/contract.md`]);
    } catch {
      trenNhanhChinh = null;
    }
    if (daGopTrenNhanhChinh(trenNhanhChinh)) {
      td.set(h.slug, 'gop');
      continue;
    }
    const day = hangViec.day.find((d) => d.id === h.day);
    const p = day ? path.join(day.worktree, '_acceptance', h.slug, 'contract.md') : null;
    const st = p && fs.existsSync(p) ? trangThaiHopDong(fs.readFileSync(p, 'utf8')) : null;
    td.set(h.slug, st === null ? 'chua' : DA_THONG.includes(st) ? 'ky' : 'dang');
  }
  return td;
}

// Sự kiện cho lệnh đếm (T14): một `hang-gop` khi một hàng lần đầu sang gộp, một `cho-nguoi` khi một tệp
// chờ người mới xuất hiện. Sổ đánh dấu nằm trong trang-thai.json; đợt nâng từ bộ phát lịch cũ (đã có
// trang-thai mà chưa có sổ) nạp im lặng những gì đang có, để lần nâng không đếm vống.
// Hồ sơ ky-den-gop: `hang-gop` mang thêm số đo ký → gộp đọc từ nhánh chính (`soDoGop`) — lệnh đếm trừ hai giờ đó.
function suKienDem(thuMuc, cu, tienDo, hangViec, choNguoi, day, io = null, cfg = null) {
  const nangCap = cu.nhip_cuoi !== undefined;
  const gopCu = new Set(cu.gop_da_bao ?? []);
  const gopIm = nangCap && cu.gop_da_bao === undefined;
  const gopMoi = [...gopCu];
  for (const h of hangViec.hang) {
    if (tienDo.get(h.slug) !== 'gop' || gopCu.has(h.slug)) continue;
    gopMoi.push(h.slug);
    if (!gopIm) ghiSuKien(thuMuc, { loai: 'hang-gop', hang: h.slug, ma: h.ma ?? null, phien: h.day, ...(io && cfg ? soDoGop(io, cfg, h.slug, DA_THONG) : {}) });
  }
  const choCu = new Set(cu.cho_nguoi_da_bao ?? []);
  const choIm = nangCap && cu.cho_nguoi_da_bao === undefined;
  const hangCua = new Map(day.map((d) => [d.id, d.hang]));
  const choMoi = [];
  for (const c of choNguoi) {
    const khoa = `${c.phien}|${c.luc}`;
    choMoi.push(khoa);
    if (!choCu.has(khoa) && !choIm) {
      ghiSuKien(thuMuc, {
        loai: 'cho-nguoi',
        phien: c.phien,
        hang: hangCua.get(c.phien) ?? null,
        // Thợ chờ người là việc của giám sát: Monitor lọc can_phan (design DP6 §4 C2).
        can_phan: true,
        loai_cho: c.loai ?? null,
        tin: String(c.tin ?? '').slice(0, 200),
      });
    }
  }
  return { gop_da_bao: gopMoi, cho_nguoi_da_bao: choMoi };
}

// Khoá cấp quá 10′ mà worktree giữ khoá không có nhịp sống nào kể từ lúc cấp (spec workflow §5.1): lệnh
// nền chờ khoá của thợ đã chết theo app. Một sự kiện mỗi lần cấp; đợt chưa có thư mục `song/` (hook bản
// cũ) thì im. Nhịp nối theo worktree, không theo phiên giữ (design DP3 §3 chỗ chọn 1 — giới hạn đã khai).
// DP8 (#301 điểm 8, design chỗ chọn 3): khoá còn sống khi nhịp KHOÁ (`khoa/<tn>/nhip`, do `chamNhip` hay lệnh bọc
// `giu-nhip.mjs` ghi) có từ lúc cấp; thôi chạm nhịp thì hạn thuê thu hồi như mọi khoá. DP10 (đợt thật 13/10: giám sát
// nhả nhầm khoá đang chạy): luật áp cho MỌI người giữ — việc nền ngoài dãy (kiểm chéo đêm, không bao giờ có nhịp
// phiên) và cả dãy chờ một lượt dài chạy qua `giu-nhip.mjs` như LUAT.md dặn (không lời gọi công cụ nào nên không có
// nhịp phiên). `chamNhip` chỉ chạm khoá mà cwd nằm trong `chu.worktree`, nên lệnh bọc còn sót của người giữ cũ không
// làm sống khoá của người giữ mới.
const viecNenGiuNhip = (thuMuc, tn, chu) => {
  try {
    return fs.statSync(path.join(thuMuc, 'khoa', tn, 'nhip')).mtimeMs >= Date.parse(chu.cap_luc);
  } catch {
    return false;
  }
};

function baoKhoaKhongNhip(thuMuc, cu, nowMs) {
  const daBao = new Set(cu.khoa_khong_nhip_da_bao ?? []);
  const conGiu = [];
  if (!coThuMucSong(thuMuc)) return conGiu;
  for (const tn of CAC_TAI_NGUYEN) {
    const chu = docJson(path.join(thuMuc, 'khoa', tn, 'chu.json'));
    if (!chu?.cap_luc || !chu.worktree) continue;
    const khoa = `${tn}@${chu.cap_luc}`;
    if (daBao.has(khoa)) {
      conGiu.push(khoa);
      continue;
    }
    if (nowMs - Date.parse(chu.cap_luc) < NGUONG_SONG_MS) continue;
    const nhip = nhipMoiNhatCua(thuMuc, chu.worktree);
    if (nhip && Date.parse(nhip.luc) >= Date.parse(chu.cap_luc)) continue;
    if (viecNenGiuNhip(thuMuc, tn, chu)) continue;
    ghiSuKien(thuMuc, { loai: 'khoa-khong-nhip', tai_nguyen: tn, phien: chu.phien, ly_do: `khoá cấp lúc ${chu.cap_luc}, không có nhịp sống của ${chu.worktree} hay nhịp khoá ${tn} từ đó`, can_phan: true });
    conGiu.push(khoa);
  }
  return conGiu;
}

// `gocKho` (B1): quyết của từng hàng đọc lại mỗi nhịp — ô của hàng chờ nhận chữ build SAU `mo` (bước 4 của mo-dot).
// Chỉ đợt mở từ gói truyền `gocKho`: ở đó thẻ khởi tạo đã hỏi build cho từng hàng. Đợt dựng tay và đợt cũ (khuôn
// 07/10: mọi hàng mang mã, không ô nào) giữ lối cũ — Cổng Đáng của chúng ở S0 của thợ (khối TRONG-DOT).
// Lịch biết tệp (hồ sơ ky-den-gop, hạng C): `bo` (boNhanhMo) cho tệp PR đang mở và nhánh mỗi dãy. Hàng bỏ qua vì
// trùng một hàng của đợt → ghi `sau` (themSau, một sự kiện `doi-ke-hoach`); trùng PR ngoài đợt → giữ hàng, một sự
// kiện `trung-tep` mỗi cặp hàng–nhánh; hàng giao đi mà không khai vùng tệp → một sự kiện `ranh-gioi-vang` mỗi hàng;
// không dò được PR → một sự kiện `trung-tep-mu` mỗi lỗi, lịch vẫn so phần hàng của đợt. Sổ đánh dấu ở trang-thai.json.
function capNhatHangKe(thuMuc, hangViec, tienDo, gocKho = null, bo = null, cu = {}) {
  const ketQua = [];
  const quyet = gocKho ? bangQuyet(gocKho, hangViec) : null;
  const keCua = new Map();
  for (const d of hangViec.day) {
    const t = docJson(path.join(thuMuc, 'tiep', `${d.id}.json`), null);
    if (t?.hang) keCua.set(d.id, t.hang);
  }
  const daBao = { trung_pr_da_bao: new Set(cu.trung_pr_da_bao ?? []), ranh_gioi_vang_da_bao: new Set(cu.ranh_gioi_vang_da_bao ?? []), trung_mu_da_bao: new Set(cu.trung_mu_da_bao ?? []) };
  const baoMot = (so, khoa, suKien) => {
    if (daBao[so].has(khoa)) return;
    daBao[so].add(khoa);
    ghiSuKien(thuMuc, suKien);
  };
  const trung = bo
    ? (h) => {
        const nm = bo.gan();
        if (nm.loi) baoMot('trung_mu_da_bao', nm.loi.split(' — ')[0], { loai: 'trung-tep-mu', ly_do: nm.loi, can_phan: false });
        return xetTrungTep(h, { hangViec, tienDo, keCua, nhanhMo: nm, nhanhCuaDay: bo.nhanhDay() });
      }
    : null;
  for (const day of hangViec.day) {
    const ke = chonHangKe(hangViec, day.id, tienDo, quyet, trung);
    if (ke.hang) keCua.set(day.id, ke.hang);
    else keCua.delete(day.id);
    for (const b of ke.trung ?? []) {
      const voiHang = b.voi.filter((t) => t.voi === 'hang');
      if (voiHang.length && themSau(thuMuc, b.hang, day.id, voiHang).doi) {
        const h = hangViec.hang.find((x) => x.slug === b.hang && x.day === day.id);
        if (h) h.sau = [...new Set([...(h.sau ?? []), ...voiHang.map((t) => t.khoa)])];
      }
      for (const t of b.voi.filter((x) => x.voi === 'pr')) baoMot('trung_pr_da_bao', `${b.hang}|${t.nhanh}`, { loai: 'trung-tep', hang: b.hang, phien: day.id, voi: 'pr', nhanh: t.nhanh, tep: t.tep.slice(0, 20) });
    }
    const chon = ke.moi ? hangViec.hang.find((x) => x.slug === ke.hang && x.day === day.id) : null;
    if (bo && chon && !(chon.ranh_gioi ?? []).length) baoMot('ranh_gioi_vang_da_bao', chon.slug, { loai: 'ranh-gioi-vang', hang: chon.slug, phien: day.id, ly_do: 'hàng không khai ranh_gioi — lịch không so được tệp', can_phan: false });
    const p = path.join(thuMuc, 'tiep', `${day.id}.json`);
    const cuTiep = docJson(p, null);
    if (JSON.stringify(cuTiep?.ke ?? null) !== JSON.stringify(ke)) {
      ghiJsonNguyenTu(p, { phien: day.id, ...ke, ke });
      ghiSuKien(thuMuc, { loai: 'hang-ke', phien: day.id, ...ke });
    }
    ketQua.push({ id: day.id, link: day.link, hang: ke.hang, tien_do: ke.hang ? tienDo.get(ke.hang) : ke.xong ? 'xong' : 'cho', cho: ke.cho ?? null });
  }
  return { day: ketQua, so: Object.fromEntries(Object.entries(daBao).map(([k, v]) => [k, [...v]])) };
}

export async function motNhip(thuMuc, io) {
  const nowMs = io.nowMs();
  const cfg = docCauHinh(thuMuc);
  const hangViec = docHangViec(thuMuc);
  const pTrangThai = path.join(thuMuc, 'trang-thai.json');
  const cu = docJson(pTrangThai, {});

  const doc = (cmd, args) => {
    try {
      return io.chay(cmd, args);
    } catch {
      return '';
    }
  };
  const mauSwapin = { luc: nowMs, ...docVmStat(doc('vm_stat', [])) };
  const sucKhoe = danhGiaSucKhoe(
    {
      swap: docSwap(io.chay('sysctl', ['vm.swapusage'])),
      apLuc: docApLuc(io.chay('sysctl', ['-n', 'kern.memorystatus_vm_pressure_level'])),
      load: docLoad(io.chay('sysctl', ['-n', 'vm.loadavg'])),
      rssLonNhat: docRssLonNhat(io.chay('ps', ['-axo', 'rss=,comm='])),
      mucTrong: docMucTrong(doc('sysctl', ['-n', 'kern.memorystatus_level'])),
      ramGb: docRamGb(doc('sysctl', ['-n', 'hw.memsize'])),
      tocDo: tocDoSwapinMbPhut(cu.mau_swapin ?? null, mauSwapin),
    },
    cfg,
  );
  const soDo = docSoDo(thuMuc);
  const kho = cfg.goc_kho ?? null;
  if (sucKhoe.giamTai && cu.trang_thai !== 'giam-tai') ghiSuKien(thuMuc, { loai: 'giam-tai', ly_do: sucKhoe.lyDo, can_phan: true });
  if (!sucKhoe.giamTai && cu.trang_thai === 'giam-tai') ghiSuKien(thuMuc, { loai: 'het-giam-tai' });
  if (sucKhoe.canNguoi && cu.can_nguoi !== sucKhoe.canNguoi) ghiSuKien(thuMuc, { loai: 'can-nguoi', tin: sucKhoe.canNguoi, dich: 'owner', can_phan: true });

  const bo = boNhanhMo(io, cfg, hangViec, cu.nhanh_mo ?? null, nowMs);
  const daBao = apGiaHan(thuMuc, nowMs, xuLyYeuCau(thuMuc, cfg, hangViec, io, cu, nowMs, bo));
  const dangGiu = xuLyKhoa(thuMuc, cfg, nowMs);
  dongLuotDaXong(thuMuc, dangGiu, { kho, nowMs });
  const dk = docPha(thuMuc);
  // DP4: xét hạn mức TRƯỚC khi cấp — chạm ngưỡng có thể đưa đợt vào bàn giao hay chờ đặt lại ngay nhịp này.
  const hm = xetHanMucNhip(thuMuc, { cfg, cu, nowMs, pha: dk.pha });
  let pha = hm.vao_ban_giao ? docPha(thuMuc).pha : dk.pha;
  // DP4: đang bàn giao → dựng ban-giao.json khi đủ điều kiện, đồng hồ chờ ở đây vì bộ phát lịch không tốn hạn mức.
  if (pha === 'dang-ban-giao') pha = buocBanGiao(thuMuc, { nowMs }).pha;
  const may = { ap: Boolean(dk.nguon_goi), cho: null };
  if (may.ap && !dangGiu.s4) nhaMay(thuMuc);
  const hangCho = capPhat(thuMuc, cfg, hangViec, dangGiu, sucKhoe.giamTai, nowMs, pha, may, hm.cho_dat_lai, sucKhoe, io, soDo);
  const giuNang = TAI_NGUYEN_NANG.filter((tn) => fs.existsSync(path.join(thuMuc, 'khoa', tn, 'chu.json')));
  for (const tn of giuNang) capNhatLuot(thuMuc, tn, { sk: sucKhoe, nowMs, cfg, chong: giuNang.length > 1 });
  const thieuChoCu = new Set(cu.thieu_cho_da_bao ?? []);
  const thieuCho = hangCho.filter((h) => h.cho).map((h) => ({ ...h, khoa: `${h.phien}-${h.loai}` }));
  for (const h of thieuCho) {
    if (!thieuChoCu.has(h.khoa)) ghiSuKien(thuMuc, { loai: 'thieu-cho', phien: h.phien, don: h.loai, ly_do: h.cho, can_phan: false });
  }
  const chuaHieuChuan = LOAI_NANG.filter((loai) => nhuCau({ kho, loai, cfg, so: soDo }).nguon === 'chua');
  const tienDo = tienDoCua(hangViec, cfg, io);
  const { day, so: soTrung } = capNhatHangKe(thuMuc, hangViec, tienDo, dk.nguon_goi ? cfg.goc_kho : null, bo, cu);
  const lienKetCua = new Map(hangViec.day.map((d) => [d.id, d.link]));
  const choNguoi = [
    ...docThuMucJson(thuMuc, 'cho-nguoi').map(({ phien, loai, tin, luc }) => ({ phien, loai, tin, luc, link: lienKetCua.get(phien) })),
    ...choNguoiYeuCau(thuMuc, lienKetCua),
  ];
  const khoa = CAC_TAI_NGUYEN.flatMap((tn) => {
    const chu = docJson(path.join(thuMuc, 'khoa', tn, 'chu.json'));
    return chu ? [{ tai_nguyen: tn, phien: chu.phien, han_thue_den: chu.han_thue_den }] : [];
  });

  const dem = suKienDem(thuMuc, cu, tienDo, hangViec, choNguoi, day, io, cfg);
  const khoaKhongNhip = baoKhoaKhongNhip(thuMuc, cu, nowMs);
  const tt = {
    dot: hangViec.dot,
    pha,
    trang_thai: sucKhoe.giamTai ? 'giam-tai' : 'dang-chay',
    nhip_cuoi: new Date(nowMs).toISOString(),
    suc_khoe: sucKhoe,
    can_nguoi: sucKhoe.canNguoi,
    mau_swapin: mauSwapin,
    thieu_cho_da_bao: thieuCho.map((h) => h.khoa),
    chua_hieu_chuan: chuaHieuChuan,
    day,
    khoa,
    hang_cho: hangCho,
    cho_nguoi: choNguoi,
    da_bao: daBao,
    cho_may: may.cho,
    ...dem,
    ...soTrung,
    nhanh_mo: bo.chup(),
    khoa_khong_nhip_da_bao: khoaKhongNhip,
    ...(hm.trang_thai ? { han_muc: hm.trang_thai, han_muc_da_bao: hm.da_bao } : {}),
    ...(hm.cho_dat_lai ? { cho_dat_lai: hm.cho_dat_lai } : {}),
  };
  ghiJsonNguyenTu(pTrangThai, tt);
  fs.writeFileSync(path.join(thuMuc, 'bang.html'), veBang(tt, { nhom: cfg.goc_kho ? docNhomKeHoach(cfg.goc_kho) : new Map(), hangViec }));
}

export function giuPid(thuMuc) {
  const p = path.join(thuMuc, 'phat-lich.pid');
  const cu = Number(fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : 0);
  if (cu && cu !== process.pid) {
    try {
      process.kill(cu, 0);
      return false;
    } catch {
    }
  }
  fs.writeFileSync(p, String(process.pid));
  return true;
}

const IO_THAT = {
  nowMs: () => Date.now(),
  chay: (cmd, args, opts = {}) => execFileSync(cmd, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], timeout: NHIP.lenhNgoaiMs, ...opts }),
};

export function taoVong(thuMuc, io, dongHo = () => Date.now()) {
  const BAO_LAI_MS = NHIP.baoLaiMs;
  let lanFetch = -Infinity;
  let daBoFetch = false;
  const daBao = new Map();
  const bao = (loai, ly_do) => {
    const cu = daBao.get(loai);
    if (cu && cu.ly_do === ly_do && dongHo() - cu.luc < BAO_LAI_MS) return;
    daBao.set(loai, { ly_do, luc: dongHo() });
    ghiSuKien(thuMuc, { loai, ly_do, can_phan: true });
  };
  return async () => {
    if (!loiCon()) {
      bao('loi-vang', `lõi vắng: ${DAY_LOI} — chạy lại \`chay\` để chép lõi mới`);
      return;
    }
    if (dongHo() - lanFetch > NHIP.fetchMs) {
      // Khoá s4 đang giữ: một lượt chấm đang so với origin/<nhánh chính> — fetch lúc này dời mốc giữa
      // lượt. Bỏ lượt fetch (không đặt lại lanFetch, nên khoá trống là fetch ngay nhịp kế).
      // Ghi sự kiện một lần cho mỗi quãng giữ khoá, không mỗi nhịp.
      if (fs.existsSync(path.join(thuMuc, 'khoa', 's4', 'chu.json'))) {
        if (!daBoFetch) ghiSuKien(thuMuc, { loai: 'bo-fetch', ly_do: 'khoá s4 đang giữ' });
        daBoFetch = true;
      } else {
        daBoFetch = false;
        lanFetch = dongHo();
        try {
          io.chay('git', ['fetch', '-q', 'origin']);
        } catch (e) {
          bao('fetch-loi', e.message);
        }
      }
    }
    try {
      await motNhip(thuMuc, io);
    } catch (e) {
      bao('loi-nhip', e.message);
    }
  };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === fs.realpathSync(process.argv[1])) {
  const thuMuc = fs.realpathSync(process.argv[2]);
  if (!giuPid(thuMuc)) {
    process.stderr.write(`phat-lich: đã có bộ phát lịch đang chạy cho ${thuMuc}\n`);
    process.exit(3);
  }
  let cfg;
  try {
    cfg = docCauHinh(thuMuc, { canGocKho: true });
  } catch (e) {
    process.stderr.write(`phat-lich: ${e.message}\n`);
    process.exit(1);
  }
  const io = { ...IO_THAT, chay: (cmd, args, opts) => IO_THAT.chay(cmd, args, { cwd: cfg.goc_kho, ...opts }) };
  const vong = taoVong(thuMuc, io);
  await vong();
  const hen = setInterval(vong, (cfg.tick_giay ?? NHIP.tickGiayMacDinh) * GIAY_MS);
  const dung = () => {
    clearInterval(hen);
    fs.rmSync(path.join(thuMuc, 'phat-lich.pid'), { force: true });
    process.exit(0);
  };
  process.on('SIGTERM', dung);
  process.on('SIGINT', dung);
}

#!/usr/bin/env node
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { docJson, ghiJsonNguyenTu, ghiSuKien, gocKhoChinh, phienCuaCwd, TEN_LIEN_KET, timThuMucDot } from './dot.mjs';
import { chanDoan } from './chan-doan.mjs';
import { docGoi, ghepLuat, timGoi } from './goi-dot.mjs';
import { choChayLai, choNghi, dayLen, ghiDanhWorktree, ghiDauChoGhiDanh, ghiNhatKy, khaiVung, themHang } from './hang.mjs';
import { theDong, theKhoiTao } from './the.mjs';
import { nhaMay } from './may.mjs';
import { demDot } from './dem.mjs';
import { datPha, docPha, khoiTaoPha, TEP_DIEU_KHIEN } from './pha.mjs';
import { moHinh, veXem } from './mo-hinh.mjs';
import { docNhomKeHoach, docTenViec } from './nguon-hang.mjs';
import { dongHoi, ghiHoi, hoiMo } from './hoi.mjs';
import { chuKhung } from './khung.mjs';
import { ghiVai, nhanVaiGiamSat } from './vai.mjs';
import { ghiDon, ghiNhatKyCli, ghiTraLoi, ghiYeuCau, kiemGiamSat, nhaKhoa } from './ghi.mjs';
import { tiepTuc } from './tiep-tuc.mjs';
import { danhThuc } from './danh-thuc.mjs';
import { ghiLanDoc } from './han-muc.mjs';
import { banGiaoXong, batDauBanGiao } from './ban-giao.mjs';
import { ngucanhTho } from './tho.mjs';
import { DUONG_BAN_CU, kiemChuyen, LOP_LICH_SU, phanLopChuyen } from './kiem-chuyen.mjs';
import { docSo } from './tin.mjs';
import { soMo } from './tin-doc.mjs';
import { noiChuaDot } from './tin-noi-chua.mjs';
import { dsTat } from './tin-dua.mjs';
import { bayGio } from './song.mjs';
import { docCauHinh } from './hinh-dang.mjs';
import { baoCaoHieuChuan, docSoDo as docSoDoLan } from './do-lan.mjs';
import { gop, maThoatGop } from './gop.mjs';

export { kiemChuyen, phanLopChuyen };

const DAY = path.dirname(fileURLToPath(import.meta.url));
const lienKet = (goc) => path.join(goc, '.acceptance-runs', TEN_LIEN_KET);

// Mở đợt (spec workflow §4.1). Hai đường:
// · có gói đợt (cờ `--goi` hoặc khoá `dieu_phoi.goi_dot`) → đọc và kiểm TRỌN gói trước khi tạo gì, dựng
//   thư mục từ gói, `vai.json`, `pha: nhap` (chờ thẻ khởi tạo);
// · không gói → đợt dựng tay như bản cũ (khuôn trống, `pha: dang-chay`, `nguon_goi: null`); chẩn đoán
//   báo mục `goi-dot` thiếu và lệnh người dừng ở đó (design DP2 §3 chỗ chọn 1).
// Chạy lại khi đợt CÙNG tên đang mở → không làm gì (`daMo`). Trả đường thư mục đợt như bản cũ.
export function moDotKq(cwd, ten, { goi = null, phien = null } = {}) {
  if (!/^[\w-]+$/.test(ten ?? '')) throw new Error('tên đợt chỉ gồm chữ, số, - và _');
  const goc = gocKhoChinh(cwd);
  const lk = lienKet(goc);
  const thuMuc = path.join(goc, '.acceptance-runs', `dieu-phoi-${ten}`);
  if (fs.existsSync(lk)) {
    const dangMo = fs.realpathSync(lk);
    if (fs.existsSync(thuMuc) && dangMo === fs.realpathSync(thuMuc)) return { thuMuc: dangMo, daMo: true };
    const dangChay = path.basename(dangMo).replace(/^dieu-phoi-/, '');
    throw new Error(`đợt ${dangChay} đang chạy — đóng nó trước`);
  }
  const dirGoi = timGoi(goc, ten, goi);
  const tuGoi = dirGoi ? docGoi(dirGoi, { gocKho: goc }) : null;
  if (tuGoi && fs.existsSync(thuMuc)) throw new Error(`đợt ${ten} còn thư mục cũ: ${thuMuc} — đổi tên đợt hoặc dọn thư mục đó`);
  for (const d of ['khoa', 'xin', 'yeu-cau', 'tra-loi', 'cho-nguoi', 'tiep']) fs.mkdirSync(path.join(thuMuc, d), { recursive: true });
  if (tuGoi) {
    ghiJsonNguyenTu(path.join(thuMuc, 'dieu-phoi.config.json'), { ...tuGoi.cfg, goc_kho: goc });
    ghiJsonNguyenTu(path.join(thuMuc, 'hang-viec.json'), { ...tuGoi.hangViec, dot: ten });
    fs.writeFileSync(path.join(thuMuc, 'LUAT.md'), ghepLuat(fs.readFileSync(path.join(DAY, 'mau', 'LUAT.md'), 'utf8'), tuGoi.luatRieng));
    ghiVai(thuMuc, { phien, worktree: cwd, day: tuGoi.hangViec.day });
    ghiDauChoGhiDanh(thuMuc, tuGoi.hangViec);
    khoiTaoPha(thuMuc, { pha: 'nhap', nguonGoi: dirGoi });
  } else {
    for (const f of ['LUAT.md', 'hang-viec.json', 'dieu-phoi.config.json']) {
      const dich = path.join(thuMuc, f);
      if (!fs.existsSync(dich)) fs.copyFileSync(path.join(DAY, 'mau', f), dich);
    }
    const cfg = docJson(path.join(thuMuc, 'dieu-phoi.config.json'));
    ghiJsonNguyenTu(path.join(thuMuc, 'dieu-phoi.config.json'), { ...cfg, goc_kho: goc });
    const hv = docJson(path.join(thuMuc, 'hang-viec.json'));
    if (!hv.dot) ghiJsonNguyenTu(path.join(thuMuc, 'hang-viec.json'), { ...hv, dot: ten });
    if (!fs.existsSync(path.join(thuMuc, TEP_DIEU_KHIEN))) khoiTaoPha(thuMuc, { pha: 'dang-chay', nguonGoi: null, lyDo: 'đợt dựng tay (không gói)' });
  }
  fs.symlinkSync(thuMuc, lk);
  ghiSuKien(thuMuc, { loai: 'mo-dot', ten, goi: dirGoi });
  return { thuMuc: fs.realpathSync(thuMuc), daMo: false, canhBao: tuGoi?.canhBao ?? [] };
}

export const moDot = (cwd, ten, tuyChon = {}) => moDotKq(cwd, ten, tuyChon).thuMuc;

function thuMucHienTai(cwd) {
  const lk = lienKet(gocKhoChinh(cwd));
  if (!fs.existsSync(lk)) throw new Error('không có đợt nào đang chạy');
  return fs.realpathSync(lk);
}

function pidSong(thuMuc) {
  const p = path.join(thuMuc, 'phat-lich.pid');
  const pid = Number(fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : 0);
  if (!pid) return 0;
  try {
    process.kill(pid, 0);
    return pid;
  } catch {
    return 0;
  }
}

// Bản lõi theo đợt: `chay` chép mọi *.mjs và khuôn của gói vào `<thư mục đợt>/loi/` (kèm phiên bản)
// rồi chạy bộ phát lịch TỪ BẢN CHÉP — nâng hay gỡ gói giữa đợt không rút mất mã đang chạy, và lần
// `chay` kế (sau khi bộ phát lịch chết) lại chép từ bản gói đang cài.
export const TEP_PHIEN_BAN = 'PHIEN-BAN.json';

export function chepLoi(thuMuc) {
  const dich = path.join(thuMuc, 'loi');
  if (fs.existsSync(dich) && fs.realpathSync(dich) === fs.realpathSync(DAY)) return dich;
  const tamThoi = `${dich}.${process.pid}.tmp`;
  fs.rmSync(tamThoi, { recursive: true, force: true });
  fs.mkdirSync(tamThoi, { recursive: true });
  for (const f of fs.readdirSync(DAY).filter((x) => x.endsWith('.mjs'))) fs.copyFileSync(path.join(DAY, f), path.join(tamThoi, f));
  fs.cpSync(path.join(DAY, 'mau'), path.join(tamThoi, 'mau'), { recursive: true });
  const goi = docJson(path.join(DAY, '..', '.claude-plugin', 'plugin.json'), {});
  ghiJsonNguyenTu(path.join(tamThoi, TEP_PHIEN_BAN), { phien_ban: goi.version ?? null, tu: DAY, luc: new Date().toISOString() });
  fs.rmSync(dich, { recursive: true, force: true });
  fs.renameSync(tamThoi, dich);
  return dich;
}

export function chayPhatLich(cwd) {
  const thuMuc = thuMucHienTai(cwd);
  const pid = pidSong(thuMuc);
  if (pid) return `bộ phát lịch đang chạy (pid ${pid})`;
  const loi = chepLoi(thuMuc);
  const log = fs.openSync(path.join(thuMuc, 'phat-lich.log'), 'a');
  const con = spawn(process.execPath, [path.join(loi, 'phat-lich.mjs'), thuMuc], { detached: true, stdio: ['ignore', log, log] });
  con.unref();
  ghiSuKien(thuMuc, { loai: 'chay', pid: con.pid, loi });
  return `đã chạy bộ phát lịch (pid ${con.pid})`;
}

export function dungPhatLich(cwd) {
  const thuMuc = thuMucHienTai(cwd);
  const pid = pidSong(thuMuc);
  if (pid) process.kill(pid, 'SIGTERM');
  ghiSuKien(thuMuc, { loai: 'dung', pid });
  return pid ? `đã dừng pid ${pid}` : 'bộ phát lịch không chạy';
}

export function dongDot(cwd) {
  const thuMuc = thuMucHienTai(cwd);
  dungPhatLich(cwd);
  // Khoá s4 cấp máy của đợt này (nếu đang giữ) nhả cùng lúc đóng — bộ phát lịch đã dừng thì không còn
  // nhịp nào nhả nó, và kho khác trên máy sẽ chờ mãi.
  if (nhaMay(thuMuc)) ghiSuKien(thuMuc, { loai: 'nha-may', ly_do: 'đóng đợt' });
  fs.rmSync(lienKet(gocKhoChinh(cwd)));
  ghiSuKien(thuMuc, { loai: 'dong-dot' });
}

// Bản lõi chép tay trong kho (đường dưới) còn gắn hook qua settings của kho trong lúc chuyển sang gói:
// hai bản cùng đọc một thư mục đợt nên ra cùng quyết định, nhưng mỗi lời gọi công cụ chạy hook hai
// lần. `xem` nói ra điều đó để phiên giám sát biết còn việc gỡ.

export function canhBaoHaiBan(gocKho) {
  const rel = path.join('.claude', 'settings.json');
  let cfg;
  try {
    cfg = JSON.parse(fs.readFileSync(path.join(gocKho, rel), 'utf8'));
  } catch {
    return null;
  }
  const suKien = Object.entries(cfg?.hooks ?? {})
    .filter(([, khoi]) => Array.isArray(khoi) && khoi.some((k) => (k?.hooks ?? []).some((h) => String(h?.command ?? '').includes(DUONG_BAN_CU))))
    .map(([su]) => su);
  if (suKien.length === 0) return null;
  return `cảnh báo: ${rel} còn hook gọi ${DUONG_BAN_CU} (${suKien.join(', ')}) — gỡ các khối đó, gói dieu-phoi đã gắn hook`;
}

// Vòng tin cần người nhìn (hồ sơ vong-mo-co-chu-giu, AC-3/AC-8): quá hạn mức 2, kết lượt khi chưa nhận, dãy đang tắt
// tin. Tính bằng CÙNG hàm `docSo` của lệnh `tin so`. Không có gì → null, và `xem`/`xem --json` không đổi một byte.
function tinCanNhin(thuMuc, goc, hangViec) {
  try {
    const { muc } = docSo({ nc: noiChuaDot(thuMuc), hangViec, loai: 'dot' }, bayGio());
    const mo = soMo(muc).filter((v) => !v.yeu_cau_cu);
    const quaHan2 = mo.filter((v) => v.qua_han_nhan === 2 || v.qua_han_xong === 2);
    const ketLuot = mo.filter((v) => v.ket_luot_chua_nhan).length;
    const tat = dsTat(goc);
    const dayTat = (hangViec?.day ?? []).filter((d) => tat.includes(d.worktree)).map((d) => d.id);
    if (!quaHan2.length && !ketLuot && !dayTat.length) return null;
    return { qua_han_2: quaHan2, ket_luot_chua_nhan: ketLuot, day_tat: dayTat };
  } catch {
    return null;
  }
}
const dongTin = (t) => [
  ...t.qua_han_2.map((v) => `  tin quá hạn ${v.ma} · ${v.tu} → ${v.den} · nấc ${v.nac} ${v.trang_thai} · mức 2`),
  ...(t.ket_luot_chua_nhan ? [`  tin: ${t.ket_luot_chua_nhan} vòng kết lượt khi chưa nhận`] : []),
  ...(t.day_tat.length ? [`  tin tắt ở dãy: ${t.day_tat.join(', ')}`] : []),
];

// `xem` vẽ từ CÙNG mô hình với bảng đợt (mo-hinh.mjs), kèm nhóm kế hoạch của hàng mang mã lộ trình.
function xem(cwd) {
  const goc = gocKhoChinh(cwd);
  const canhBao = canhBaoHaiBan(goc);
  const thuMuc = thuMucHienTai(cwd);
  const tt = docJson(path.join(thuMuc, 'trang-thai.json'), null);
  let dong;
  if (!tt) dong = `chưa có nhịp nào · pha ${docPha(thuMuc).pha}`;
  else dong = veXem(moHinh(tt, { nhom: docNhomKeHoach(goc), hangViec: docJson(path.join(thuMuc, 'hang-viec.json'), null) }));
  const tin = tinCanNhin(thuMuc, goc, docJson(path.join(thuMuc, 'hang-viec.json'), null));
  if (tin) dong = `${dong}\n${dongTin(tin).join('\n')}`;
  return canhBao ? `${dong}\n${canhBao}` : dong;
}

// `xem --json` (DP6b, hồ sơ trang-thai-dot-dieu-phoi-tho): MỘT dòng JSON cho khung của lớp mod — cùng mô hình `xem`
// vẽ, cộng dãy của cwd (cùng hàm hai hook dùng), dòng cảnh báo hai bản, và độ lệch múi giờ của máy (mod chạy trong
// môi trường không Node nên không tự biết giờ địa phương). Không đợt → {"dot":null}. `xem` không cờ không đổi.
export function xemJson(cwd, { khung = false } = {}) {
  const thuMuc = timThuMucDot(cwd);
  if (!thuMuc) return { dot: null };
  const goc = gocKhoChinh(cwd);
  const hangViec = docJson(path.join(thuMuc, 'hang-viec.json'), null);
  const them = { day_cua_cwd: phienCuaCwd(hangViec, cwd), canh_bao: canhBaoHaiBan(goc), mui_gio_phut: -new Date().getTimezoneOffset() };
  const tt = docJson(path.join(thuMuc, 'trang-thai.json'), null);
  const tin = tinCanNhin(thuMuc, goc, hangViec);
  const tinKhoa = tin ? { tin } : {};
  // Câu giám sát đang chờ chủ kho (hồ sơ khung-dot-dinh-vi): khoá chỉ có mặt khi có câu mở, như khoá `tin` — kho không
  // có câu nào nhận `xem --json` không đổi một byte.
  const hoi = hoiMo(thuMuc);
  const hoiKhoa = { ...(hoi.length ? { hoi_chu_kho: hoi } : {}) };
  // Dữ liệu riêng của khung định vị chỉ đi qua cờ `--khung` (mod gọi): `xem --json` giữ khuôn cũ cho máy đọc.
  const khungKhoa = khung ? duLieuKhung(goc, thuMuc, hangViec, tt) : null;
  if (!tt) return { dot: hangViec?.dot || path.basename(thuMuc).replace(/^dieu-phoi-/, ''), pha: docPha(thuMuc).pha, chua_co_nhip: true, ...them, ...tinKhoa, ...hoiKhoa, ...(khungKhoa?.dinh ?? {}) };
  const m = moHinh(tt, { nhom: docNhomKeHoach(goc), hangViec });
  if (khungKhoa) m.day = m.day.map((d) => ({ ...d, ...(khungKhoa.ten.get(d.hang) ? { ten: khungKhoa.ten.get(d.hang) } : {}), ...(khungKhoa.nghi.has(d.id) ? { nghi: true } : {}) }));
  return { ...m, ...them, ...tinKhoa, ...hoiKhoa, ...(khungKhoa?.dinh ?? {}) };
}

// Mục tiêu đợt, số hàng, số hàng đã gộp, tên việc từ lộ trình, dãy nghỉ — chỉ những gì có thật; thiếu thì khung tự cờ vàng.
function duLieuKhung(goc, thuMuc, hangViec, tt) {
  let nguon = [];
  try {
    nguon = docCauHinh(thuMuc).nguon_hang ?? [];
  } catch {}
  const dinh = {
    ...(typeof hangViec?.muc_tieu === 'string' && hangViec.muc_tieu.trim() ? { muc_tieu: hangViec.muc_tieu.trim() } : {}),
    ...(Array.isArray(hangViec?.hang) ? { so_hang: hangViec.hang.length } : {}),
    ...(Array.isArray(tt?.gop_da_bao) ? { da_gop: tt.gop_da_bao.length } : {}),
    bay_gio: bayGio(),
  };
  return { dinh, ten: hangViec ? docTenViec(goc, hangViec, nguon) : new Map(), nghi: new Set((hangViec?.day ?? []).filter((d) => d.nghi).map((d) => d.id)) };
}

// Đầu ra `xem --kiem-chuyen` (design doc, chỗ chọn 1d): dòng phải sửa giữ khuôn 2.27; không còn dòng phải sửa thì
// `sach`; có lịch sử thì ĐÚNG MỘT dòng tổng (lớp theo thứ tự bảng, lớp 0 dòng không in); `--chi-tiet` in thêm
// từng dòng lịch sử. Kho không có lịch sử thì đầu ra y như 2.27.
export function veKiemChuyen({ phai_sua: phaiSua, lich_su: lichSu }, { chiTiet = false } = {}) {
  const dong = phaiSua.length ? phaiSua.map((d) => `kiem-chuyen: ${d}`) : ['kiem-chuyen: sach'];
  if (lichSu.length) {
    const dem = LOP_LICH_SU.map((l) => [l, lichSu.filter((x) => x.lop === l).length]).filter(([, k]) => k > 0);
    dong.push(`kiem-chuyen: lich-su ${lichSu.length} dòng — ${dem.map(([l, k]) => `${l} ${k}`).join(' · ')} — để nguyên${chiTiet ? '' : '; xem từng dòng bằng --chi-tiet'}`);
    if (chiTiet) for (const x of lichSu) dong.push(`kiem-chuyen lich-su: ${x.dong} · ${x.lop}`);
  }
  return `${dong.join('\n')}\n`;
}

// Tách đối số: vị trí và cờ `--ten giá-trị` (cờ không giá trị → true).
export function tachDoiSo(argv) {
  const vi = [];
  const co = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const k = a.slice(2);
      if (i + 1 < argv.length && !argv[i + 1].startsWith('--')) co[k] = argv[++i];
      else co[k] = true;
    } else vi.push(a);
  }
  return { vi, co };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === fs.realpathSync(process.argv[1])) {
  const { vi, co } = tachDoiSo(process.argv.slice(2));
  const [lenh, doiSo] = vi;
  const cwd = process.cwd();
  // Khung định vị cho người (hồ sơ khung-dot-dinh-vi): `xem --khung` in khung, `xem --json --khung` in dữ liệu của nó.
  if (lenh === 'xem' && co.khung) {
    try {
      const kq = xemJson(cwd, { khung: true });
      process.stdout.write(`${co.json ? JSON.stringify(kq) : chuKhung(kq, { bayGio: bayGio() })}\n`);
    } catch (e) {
      process.stderr.write(`dieu-phoi: ${e.message}\n`);
      process.exit(1);
    }
    process.exit(0);
  }
  // Câu phiên giám sát chờ chủ kho: thoát 0 đã ghi · 2 câu rỗng hay mã không mở (không ghi byte nào) · 1 không có đợt.
  if (lenh === 'hoi' || lenh === 'hoi-xong') {
    try {
      const thuMuc = thuMucHienTai(cwd);
      const phien = typeof co.phien === 'string' ? co.phien : null;
      if (lenh === 'hoi') {
        const cau = co.cau === '-' ? fs.readFileSync(0, 'utf8') : typeof co.cau === 'string' ? co.cau : '';
        process.stdout.write(`hoi: ${ghiHoi(thuMuc, { cau, phien })}\n`);
      } else {
        if (typeof doiSo !== 'string') throw Object.assign(new Error('dùng: hoi-xong <mã câu> [--phien <mã>]'), { ma: 2 });
        process.stdout.write(`hoi-xong: ${dongHoi(thuMuc, doiSo, { phien })}\n`);
      }
    } catch (e) {
      process.stderr.write(`dieu-phoi: ${e.message}\n`);
      process.exit(e.ma ?? 1);
    }
    process.exit(0);
  }
  if (lenh === 'xem' && co.json) {
    try {
      process.stdout.write(`${JSON.stringify(xemJson(cwd))}\n`);
    } catch (e) {
      process.stderr.write(`dieu-phoi: ${e.message}\n`);
      process.exit(1);
    }
    process.exit(0);
  }
  // Gộp dưới khoá merge (hồ sơ ky-den-gop, hạng I): mã thoát mang quyết định — 0 gộp được (đã gộp, hoặc --xet nói
  // gộp được) · 4 đi lối cũ (gộp nhánh chính vào nhánh, chờ CI) hay chờ CI · 1 chặn hoặc lỗi.
  if (lenh === 'gop') {
    try {
      const kq = gop(cwd, doiSo, { slug: typeof co.slug === 'string' ? co.slug : null, xet: co.xet === true });
      process.stdout.write(`gop #${doiSo}: ${kq.duong}${kq.da_gop ? ' · đã gộp' : ''} — ${kq.ly_do}\n`);
      process.exit(maThoatGop(kq));
    } catch (e) {
      process.stderr.write(`dieu-phoi: ${e.message}\n`);
      process.exit(1);
    }
  }
  if (lenh === 'xem' && co['kiem-chuyen']) {
    try {
      const kq = phanLopChuyen(cwd);
      process.stdout.write(veKiemChuyen(kq, { chiTiet: co['chi-tiet'] === true }));
      process.exit(kq.phai_sua.length ? 1 : 0);
    } catch (e) {
      process.stderr.write(`dieu-phoi: ${e.message}\n`);
      process.exit(2);
    }
  }
  try {
    const viec = {
      mo: () => {
        const kq = moDotKq(cwd, doiSo, { goi: typeof co.goi === 'string' ? co.goi : null, phien: typeof co.phien === 'string' ? co.phien : null });
        for (const c of kq.canhBao ?? []) process.stderr.write(`${c}\n`);
        return kq.daMo ? `đợt ${doiSo} đã mở` : kq.thuMuc;
      },
      pha: () => {
        const thuMuc = thuMucHienTai(cwd);
        kiemGiamSat(thuMuc, co.phien, 'pha');
        const lyDo = typeof co['ly-do'] === 'string' ? co['ly-do'] : '';
        const CHU_MERGE = { co: true, khong: false };
        if (co['tu-merge'] !== undefined && !(co['tu-merge'] in CHU_MERGE)) throw new Error(`pha: --tu-merge «${co['tu-merge']}» không hợp lệ (co|khong)`);
        const tuMerge = co['tu-merge'] === undefined ? undefined : CHU_MERGE[co['tu-merge']];
        const kq = datPha(thuMuc, doiSo, { boi: typeof co.boi === 'string' ? co.boi : 'cli', lyDo, tuMerge });
        if (!kq.doi) return `pha: đã ở ${kq.pha}`;
        ghiNhatKy(thuMuc, `pha ${kq.tu} → ${kq.pha}${lyDo ? ` — ${lyDo}` : ''}`);
        ghiSuKien(thuMuc, { loai: 'pha', tu: kq.tu, sang: kq.pha, ly_do: lyDo });
        return `pha: ${kq.tu} → ${kq.pha}`;
      },
      hang: () => {
        const thuMuc = thuMucHienTai(cwd);
        const [, , doiTuong] = vi;
        const kq = {
          'day-len': () => dayLen(thuMuc, doiTuong, co.truoc),
          them: () => themHang(thuMuc, doiTuong, co.day, { ranhGioi: typeof co['ranh-gioi'] === 'string' ? co['ranh-gioi'].split(',').map((x) => x.trim()).filter(Boolean) : null }),
          nghi: () => choNghi(thuMuc, doiTuong),
          'chay-lai': () => choChayLai(thuMuc, doiTuong),
          vung: () => khaiVung(thuMuc, doiTuong, typeof co.vung === 'string' ? co.vung.split(',') : []),
        }[doiSo];
        if (!kq) throw new Error('dùng: hang <day-len <mã> --truoc <mã>|them <mã|việc> --day <P> [--ranh-gioi <glob,glob>]|nghi <P>|chay-lai <P>|vung <mã|slug> --vung <glob,glob>>');
        const ra = kq();
        for (const c of ra.canhBao ?? []) process.stderr.write(`${c}\n`);
        return ra.doi ? `hang ${doiSo}: đã đổi${ra.sau?.length ? ` — chờ ${ra.sau.join(', ')} gộp trước (trùng tệp)` : ''}` : `hang ${doiSo}: không đổi gì`;
      },
      'chan-doan': () => {
        const ds = chanDoan(cwd, {
          mo: typeof co.mo === 'string' ? co.mo : null,
          goi: typeof co.goi === 'string' ? co.goi : null,
          phien: typeof co.phien === 'string' ? co.phien : null,
          chiTiet: co['chi-tiet'] === true,
          tranMs: typeof co['tran-giay'] === 'string' ? Number(co['tran-giay']) * 1000 : undefined,
        });
        return co.json ? JSON.stringify(ds) : ds.map((m) => `${m.trang_thai === 'du' ? '✓' : m.trang_thai === 'thieu' ? '✗' : '·'} ${m.muc}${m.viec ? ` — ${m.viec}` : ''}`).join('\n');
      },
      the: () => {
        const ham = { 'khoi-tao': theKhoiTao, dong: theDong }[doiSo];
        if (!ham) throw new Error('dùng: the <khoi-tao|dong> [--json]');
        return JSON.stringify(ham(cwd), null, co.json ? 0 : 2);
      },
      dem: () => JSON.stringify(demDot(thuMucHienTai(cwd)), null, co.json ? 0 : 2),
      // Phiên thợ mở từ chip tự ghi danh worktree của nó vào dãy (DP8) — chạy từ worktree của chip, trước S1.
      'ghi-danh': () => {
        const kq = ghiDanhWorktree(cwd, doiSo);
        return kq.doi ? `ghi-danh: ${kq.day} → ${kq.worktree}${kq.nhac ? `\n${kq.nhac}` : ''}` : `ghi-danh: ${kq.day} đã ghi danh ${kq.worktree}`;
      },
      // Chỉ đọc; kho không đợt → JSON `khong-dot`, thoát 0 (không qua thuMucHienTai).
      tho: () => JSON.stringify(ngucanhTho(cwd, { slug: typeof co.slug === 'string' ? co.slug : null })),
      chay: () => chayPhatLich(cwd),
      'tiep-tuc': () => {
        const kq = tiepTuc(cwd, { phien: typeof co.phien === 'string' ? co.phien : null, nhe: co.nhe === true, chay: chayPhatLich });
        return co.json ? JSON.stringify(kq) : kq.thoi_vai ? `phiên này đã thôi giám sát đợt ${path.basename(kq.dot).replace(/^dieu-phoi-/, '')}` : JSON.stringify(kq, null, 2);
      },
      xin: () => ghiDon(cwd, { loai: doiSo, uocPhut: typeof co['uoc-phut'] === 'string' ? co['uoc-phut'] : null, moMerge: co['mo-merge'] === true, slug: typeof co.slug === 'string' ? co.slug : null }),
      nha: () => nhaKhoa(cwd, doiSo, { ma: typeof co.ma === 'string' ? co.ma : null, haTang: typeof co['ha-tang'] === 'string' ? co['ha-tang'] : null }),
      'hieu-chuan': () => {
        const thuMuc = thuMucHienTai(cwd);
        const cfg = docCauHinh(thuMuc);
        return baoCaoHieuChuan({ kho: cfg.goc_kho ?? null, cfg, so: docSoDoLan(thuMuc) }).join('\n');
      },
      'yeu-cau': () => {
        const noiDung = typeof co['noi-dung'] === 'string' ? JSON.parse(co['noi-dung']) : {};
        if (typeof co.tep === 'string') noiDung.tep = co.tep.split(',').filter(Boolean);
        if (co.chan === true) noiDung.chan = true;
        return ghiYeuCau(cwd, { loai: doiSo, hang: typeof co.hang === 'string' ? co.hang : null, noiDung });
      },
      'tra-loi': () => {
        const traLoi = { ...(typeof co.them === 'string' ? JSON.parse(co.them) : {}) };
        if (typeof co['ket-qua'] === 'string') traLoi.ket_qua = co['ket-qua'];
        if (typeof co['ly-do'] === 'string') traLoi.ly_do = co['ly-do'];
        if (typeof co.boi === 'string') traLoi.boi = co.boi;
        return ghiTraLoi(cwd, doiSo, traLoi, { phien: co.phien });
      },
      'nhat-ky': () => ghiNhatKyCli(cwd, doiSo, { phien: co.phien }),
      vai: () => {
        const thuMuc = thuMucHienTai(cwd);
        kiemGiamSat(thuMuc, co.phien, 'vai');
        if (typeof co['giam-sat'] !== 'string') throw new Error('dùng: vai --giam-sat <mã phiên> [--phien <mã phiên gọi>]');
        const kq = nhanVaiGiamSat(thuMuc, { phien: co['giam-sat'], worktree: cwd });
        return kq.doi ? `vai: giám sát → ${co['giam-sat']}` : `vai: ${co['giam-sat']} đã là giám sát`;
      },
      'ban-giao': () => {
        const thuMuc = thuMucHienTai(cwd);
        kiemGiamSat(thuMuc, co.phien, 'ban-giao');
        const kq = batDauBanGiao(cwd, { lyDo: typeof co['ly-do'] === 'string' ? co['ly-do'] : '', boi: typeof co.boi === 'string' ? co.boi : 'cli' });
        return co.json ? JSON.stringify(kq) : `ban-giao: ${kq.pha} · ${kq.ma ?? ''}${kq.can_nhan ? ` · nhắn: ${kq.can_nhan.join(', ')}` : ''}`;
      },
      'ban-giao-xong': () => {
        const kq = banGiaoXong(cwd, { wip: typeof co.wip === 'string' ? co.wip : null });
        return `ban-giao-xong: ${kq.day} · ${kq.ma} · đỉnh ${String(kq.dinh).slice(0, 7)}${kq.co_wip ? ' · có commit WIP' : ''}`;
      },
      'han-muc': () => {
        const kq = ghiLanDoc(cwd, { nguon: co.nguon, phien: typeof co.phien === 'string' ? co.phien : null, doc: typeof co.doc === 'string' ? co.doc : '' });
        return kq.ghi ? `han-muc: ${kq.lan.nguon} ${Object.entries(kq.lan.cua_so).map(([k, v]) => `${k} ${v.pct}%`).join(' · ')}` : kq.ly_do;
      },
      'danh-thuc': () => {
        const kq = danhThuc(cwd);
        return co.json ? JSON.stringify(kq) : `${kq.hanh_dong}${kq.cau ? ` — ${kq.cau}` : ''} (${kq.ly_do})`;
      },
      dung: () => dungPhatLich(cwd),
      dong: () => dongDot(cwd) ?? 'đã đóng đợt: bộ phát lịch dừng, hook im',
      xem: () => xem(cwd),
    }[lenh];
    if (!viec) throw new Error('dùng: dieu-phoi.mjs <mo <tên> [--goi <dir>] [--phien <id>]|pha <trạng thái> [--ly-do <s>] [--tu-merge co|khong]|chan-doan [--json]|hang <day-len|them|nghi|chay-lai|vung> …|the <khoi-tao|dong> [--json]|dem [--json]|ghi-danh <dãy>|chay|dung|dong|xem [--kiem-chuyen [--chi-tiet]]|xem --json [--khung]|xem --khung|hoi --cau <câu|-> [--phien <id>]|hoi-xong <mã> [--phien <id>]|tiep-tuc --phien <id> [--nhe] [--json]|danh-thuc [--json]|ban-giao [--ly-do <s>] [--phien <id>] [--json]|ban-giao-xong [--wip <mô tả>]|han-muc --nguon <mod|get-usage|statusline> --phien <id> --doc "<json>"|xin <loại> [--uoc-phut <n>]|gop <số PR> [--slug <s>] [--xet]|nha <tài nguyên> [--ma <mã thoát>] [--ha-tang <lý do>]|hieu-chuan|yeu-cau <loại> [--chan] [--tep a,b]|tra-loi <id> --ket-qua <kq> [--phien <id>]|nhat-ky <câu> [--phien <id>]|vai --giam-sat <id> [--phien <id>]|tho [--slug <s>] [--json]>');
    process.stdout.write(`${viec()}\n`);
  } catch (e) {
    process.stderr.write(`dieu-phoi: ${e.message}\n`);
    process.exit(1);
  }
}

#!/usr/bin/env node
// Lệnh `tin` của gói điều phối (hồ sơ vong-mo-co-chu-giu, hàng GT1): vòng giao tiếp chín nấc giữa các phiên — mã tin,
// lời giao sáu trường, nhận kèm câu «sẽ giao», xong tự đính vật, chấp nhận bằng im lặng sau khi đã nghe, MỞ LẠI.
// Mọi lệnh kiểm trước khi ghi: sai thì stderr nêu điều sai, thoát 1, không ghi byte nào.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { timThuMucDot } from './dot.mjs';
import { bayGio } from './song.mjs';
import { KHAU_LENH, KHAU_LENH_MO, docDongDau, gapSo, soMo, vietDongDau } from './tin-doc.mjs';
import { goiGh } from './tin-gh.mjs';
import { khoCua, loiGiaoViec, suyLoiGiaoDot, trangThaiHoSoCua } from './tin-giao.mjs';
import { minhTrongDot, noiChuaDot } from './tin-noi-chua.mjs';

export { KHAU_LENH };
const PHUT = 60_000;
const NGAY_MS = 24 * 60 * PHUT;

export const SU_DUNG = {
  GIAO: 'tin GIAO <đích> "<một câu ý định>" [--hang <slug>] [--ket-qua "<câu>"] [--ranh-gioi "<câu>"] [--han-xong <phút>] [--han <phút>] [--kenh <chủ/kho#số> --kho <chủ/kho>]',
  HỎI: 'tin HỎI <đích> "<câu hỏi>" [--chan] [--khuyen "<khuyến nghị>"] [--han <phút>] [--kenh <chủ/kho#số>]',
  BÁO: 'tin BÁO <đích> "<câu>" [--kenh <chủ/kho#số>]',
  NHẬN: 'tin NHẬN <mã> "sẽ giao <một câu>" [--xong-luc <mốc ISO>] [--kenh <chủ/kho#số>]',
  XONG: 'tin XONG <mã> ["<câu trả lời>"] [--vat "<vật>"] [--kenh <chủ/kho#số>]',
  KẸT: 'tin KẸT <mã> "<cần gì, từ ai>" [--kenh <chủ/kho#số>]',
  TRẢ: 'tin TRẢ <mã> "<lý do>" --chuyen <ai|không ai> [--kenh <chủ/kho#số>]',
  HUỶ: 'tin HUỶ <mã> "<lý do>" [--kenh <chủ/kho#số>]',
  'MỞ LẠI': 'tin MỞ LẠI <mã> "<vì sao chưa đạt>" [--kenh <chủ/kho#số>]',
  so: 'tin so [--json] [--tat-ca] [--kenh <chủ/kho#số> [--tu <ngày ISO>]]',
  nhac: 'tin nhac <mã> [--kenh <chủ/kho#số>]',
  vai: 'tin vai --kenh <chủ/kho#số> --may <tên máy>',
  canh: 'tin canh --kenh <chủ/kho#số> [--cho]',
  tat: 'tin tat — tắt tin tự đến và chặn kết lượt cho worktree này',
  bat: 'tin bat — bật lại cho worktree này',
};
const CO_BOOL = new Set(['chan', 'json', 'tat-ca', 'help', 'cho']);

export class LoiTin extends Error {}
const loi = (s) => {
  throw new LoiTin(s);
};

export function tachDoiSo(argv) {
  const vi = [];
  const co = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i].normalize('NFC');
    if (a.startsWith('--')) {
      const k = a.slice(2);
      if (CO_BOOL.has(k)) co[k] = true;
      else {
        if (i + 1 >= argv.length) loi(`cờ --${k} thiếu giá trị`);
        co[k] = argv[++i].normalize('NFC');
      }
    } else vi.push(a);
  }
  if (vi[0] === 'MỞ' && vi[1] === 'LẠI') vi.splice(0, 2, 'MỞ LẠI');
  if (vi[0] === 'HỦY') vi[0] = 'HUỶ';
  return { vi, co };
}

const git = (cwd, ...a) => {
  try {
    return execFileSync('git', a, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return null;
  }
};

// Nơi chứa của lời gọi: kênh khi có --kenh (tin-kenh.mjs), không thì thư mục đợt của cwd.
async function noiChuaCua(cwd, co) {
  if (co.kenh) {
    const { noiChuaKenhCua } = await import('./tin-kenh.mjs');
    return noiChuaKenhCua(cwd, co.kenh);
  }
  const thuMuc = timThuMucDot(cwd);
  if (!thuMuc) loi('không có đợt nào đang chạy — trên kênh liên máy thì thêm --kenh <chủ/kho#số>');
  const { minh, hangViec } = minhTrongDot(thuMuc, cwd);
  if (!minh) loi('cwd không thuộc đợt — chạy từ worktree của một dãy hoặc của giám sát');
  return { nc: noiChuaDot(thuMuc), minh, hangViec, thuMuc, loai: 'dot' };
}

function maMoi(dong, minh, nowMs) {
  const d = new Date(nowMs);
  const ddmm = `${String(d.getUTCDate()).padStart(2, '0')}${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
  const tien = `${minh}-${ddmm}-`;
  let max = 0;
  for (const x of dong) {
    const dd = x.text ? docDongDau(x.text) : null;
    if (dd?.ma?.startsWith(tien)) max = Math.max(max, Number(dd.ma.slice(tien.length)) || 0);
  }
  return `${tien}${max + 1}`;
}

const CAU_SE_GIAO = /^sẽ giao\s+\S+(?:\s+\S+){2,}$/iu;
export function kiemSeGiao(cau) {
  const c = String(cau ?? '').normalize('NFC').trim();
  if (!c || /\n/u.test(c)) return false;
  const cauCon = c.replace(/[.!?…]+$/u, '').split(/[.!?…]\s+/u);
  return cauCon.length === 1 && CAU_SE_GIAO.test(cauCon[0]);
}

async function gui(kl, vi, co, ctx, nowMs) {
  const [, dich, cau] = vi;
  if (!dich) loi(`thiếu đích — ${SU_DUNG[kl]}`);
  const { nc, minh, hangViec, thuMuc, loai } = ctx;
  if (loai === 'dot' && dich !== 'G' && !(hangViec?.day ?? []).some((d) => d.id === dich)) loi(`đích ${dich} không có trong đợt (dãy hoặc G)`);
  let than;
  if (kl === 'GIAO') {
    if (!cau) loi(`thiếu ý định — ${SU_DUNG.GIAO}`);
    const hanXong = co['han-xong'] != null ? Number(co['han-xong']) : null;
    let s;
    if (loai === 'dot') s = suyLoiGiaoDot(thuMuc, hangViec, dich, { yDinh: cau, hang: co.hang ?? null, ketQua: co['ket-qua'] ?? null, ranhGioi: co['ranh-gioi'] ?? null, hanXongPhut: hanXong, tronHang: Boolean(co.hang) });
    else s = await ctx.suyLoiGiao({ yDinh: cau, hang: co.hang ?? null, ketQua: co['ket-qua'] ?? null, ranhGioi: co['ranh-gioi'] ?? null, kho: co.kho ?? null, hanXongPhut: hanXong });
    if (s.loi) loi(s.loi);
    than = `${loiGiaoViec(s.truong)}\nHạn nhận: ${Number(co.han ?? 30)} phút`;
  } else if (kl === 'HỎI') {
    if (!cau) loi(`thiếu câu hỏi — ${SU_DUNG['HỎI']}`);
    than = `Hỏi: ${cau}\nChặn: ${co.chan ? 'có' : 'không'}\nKhuyến nghị: ${co.khuyen ?? '(chưa kèm)'}\nHạn nhận: ${Number(co.han ?? 30)} phút`;
  } else {
    than = cau ?? '';
  }
  const { dong } = nc.doc();
  const ma = maMoi(dong, minh, nowMs);
  const text = `${vietDongDau({ khau_lenh: kl, ma, tu: minh, den: dich })}\n${than}`;
  await nc.them({ text, luc: new Date(nowMs).toISOString() });
  return text;
}

async function dap(kl, vi, co, ctx, nowMs, cwd) {
  const [, ma, cau] = vi;
  if (!ma) loi(`thiếu mã — ${SU_DUNG[kl]}`);
  const { nc, minh } = ctx;
  const { dong } = nc.doc();
  const muc = gapSo(dong, { nowMs }).find((v) => v.ma === ma);
  if (!muc) loi(`không có vòng ${ma}`);
  if (muc.trang_thai === 'dong') loi(`vòng ${ma} đã đóng (TRẢ hay HUỶ)`);
  const daGiao = muc.trang_thai === 'cho-chap-nhan' || muc.trang_thai === 'da-chap-nhan';
  if (daGiao && kl !== 'MỞ LẠI') loi(`vòng ${ma} đã giao, chờ người giao chấp nhận — MỞ LẠI là của người giao`);
  const laGiao = muc.khau_lenh_mo === 'GIAO';
  let den;
  if (['NHẬN', 'XONG', 'KẸT', 'TRẢ'].includes(kl)) {
    if (minh !== muc.den) loi(`${minh} không phải người nhận của ${ma} (người nhận: ${muc.den})`);
    den = muc.tu;
  } else {
    if (minh !== muc.tu) loi(`chỉ người giao (${muc.tu}) được ${kl} vòng ${ma}`);
    den = muc.den;
  }
  const khoCwd = ctx.loai === 'kenh' ? khoCua(cwd) : null;
  let than;
  if (kl === 'NHẬN') {
    if (laGiao) {
      if (!kiemSeGiao(cau)) loi('NHẬN một việc giao phải kèm đúng MỘT câu «sẽ giao …» có ít nhất ba từ nội dung, bằng lời của mình');
      if (ctx.loai === 'kenh' && muc.ranh_gioi_kho && khoCwd !== muc.ranh_gioi_kho) {
        loi(`kho lệch: việc khai kho ${muc.ranh_gioi_kho}, cwd ở kho ${khoCwd ?? '?'} — nếu đúng là lệch thì báo bằng: tin KẸT ${ma} "kho lệch" --kenh ${co.kenh}`);
      }
    }
    let han = 'chưa có hạn';
    if (co['xong-luc']) {
      if (Number.isNaN(Date.parse(co['xong-luc']))) loi('--xong-luc phải là mốc ISO (ví dụ 2026-10-18T16:00:00Z)');
      han = new Date(Date.parse(co['xong-luc'])).toISOString();
    } else if (muc.han_xong_khoang != null) han = new Date(nowMs + muc.han_xong_khoang * PHUT).toISOString();
    const sha = git(cwd, 'rev-parse', 'HEAD');
    than = laGiao ? `Sẽ giao: ${String(cau).normalize('NFC').trim().replace(/^sẽ giao\s+/iu, '')}\nHạn xong: ${han}\nSha lúc nhận: ${sha ?? '?'}` : `Trả lúc: ${co['tra-luc'] ?? 'trong lượt này'}\nSha lúc nhận: ${sha ?? '?'}`;
  } else if (kl === 'XONG') {
    if (!laGiao) {
      if (!cau) loi('XONG một câu hỏi phải kèm câu trả lời');
      than = `Trả lời: ${cau}`;
    } else if (co.vat) {
      than = `Vật: ${co.vat}`;
    } else {
      const thieu = [];
      const kho = khoCua(cwd);
      if (muc.ranh_gioi_kho && kho !== muc.ranh_gioi_kho) thieu.push(`kho lệch (${kho ?? '?'} ≠ ${muc.ranh_gioi_kho})`);
      if ((git(cwd, 'status', '--porcelain') ?? 'x') !== '') thieu.push('cây chưa sạch');
      const head = git(cwd, 'rev-parse', 'HEAD');
      const moc = muc.mo_lai_luc ? muc.sha_xong_cuoi : muc.sha_nhan;
      if (!head || head === moc) thieu.push('chưa có commit mới');
      if (thieu.length) loi(`không tự đính được vật: ${thieu.join(' · ')} — ghi --vat "<vật>"`);
      const nhanh = git(cwd, 'branch', '--show-current') ?? '?';
      const pr = goiGh(['pr', 'view', '--json', 'url', '-q', '.url'], { tranMs: 3000, cwd });
      than = `Vật: sha ${head} · nhánh ${nhanh}${pr.ma === 0 && pr.out.trim() ? ` · PR ${pr.out.trim()}` : ''}`;
    }
  } else if (kl === 'KẸT') {
    if (!cau) loi('KẸT phải kèm một câu cần gì, từ ai');
    than = `Cần: ${cau}`;
  } else if (kl === 'TRẢ') {
    if (!cau) loi('TRẢ phải kèm lý do');
    if (!co.chuyen) loi('TRẢ phải kèm --chuyen <ai|không ai>');
    than = `Lý do: ${cau}\nChuyển: ${co.chuyen}`;
  } else if (kl === 'HUỶ') {
    if (!cau) loi('HUỶ phải kèm lý do');
    than = `Lý do: ${cau}`;
  } else if (kl === 'MỞ LẠI') {
    if (!daGiao) loi(`vòng ${ma} chưa giao — chưa có gì để mở lại`);
    if (!cau) loi('MỞ LẠI phải kèm một câu vì sao chưa đạt');
    const moc = Date.parse(muc.chap_nhan_luc ?? muc.xong_luc);
    if (nowMs - moc > NGAY_MS) loi(`quá 24 giờ từ lúc chấp nhận vòng ${ma} — giao việc mới thay vì mở lại`);
    than = `Vì sao: ${cau}`;
  }
  const text = `${vietDongDau({ khau_lenh: kl, ma, tu: minh, den })}\n${than}`;
  await nc.them({ text, luc: new Date(nowMs).toISOString() });
  return text;
}

// Hồ sơ của vòng đang chờ cổng người (đồng hồ hạn xong ngừng): verified chưa ký, hoặc draft đã có thẻ.
function choCongCua(muc, ctx) {
  const s = new Set();
  if (ctx.loai !== 'dot') return s;
  for (const v of muc) {
    if (!v.slug) continue;
    const day = (ctx.hangViec?.day ?? []).find((d) => d.id === v.den);
    if (!day) continue;
    const tt = trangThaiHoSoCua(day.worktree, v.slug);
    if (tt === 'verified' || (tt === 'draft' && fs.existsSync(`${day.worktree}/_acceptance/${v.slug}/card.html`))) s.add(v.ma);
  }
  return s;
}

export function docSo(ctx, nowMs) {
  const { dong, hong } = ctx.nc.doc();
  const muc0 = gapSo(dong, { nowMs });
  const muc = gapSo(dong, { nowMs, choCong: choCongCua(muc0, ctx) });
  return { muc, hong, dong };
}

const tuoi = (ms) => (ms < 60 * PHUT ? `${Math.round(ms / PHUT)}′` : `${(ms / (60 * PHUT)).toFixed(1)} giờ`);
export function veSo(muc, nowMs) {
  return muc.map((v) => {
    const qh = v.qua_han_nhan ? ` · QUÁ HẠN NHẬN mức ${v.qua_han_nhan}` : v.qua_han_xong ? ` · QUÁ HẠN XONG mức ${v.qua_han_xong}` : '';
    return `${v.ma} · ${v.khau_lenh_mo} · ${v.tu} → ${v.den} · nấc ${v.nac ?? '-'} ${v.trang_thai} · ${tuoi(nowMs - Date.parse(v.mo_luc))}${qh}${v.ket_luot_chua_nhan ? ' · kết lượt khi chưa nhận' : ''}`;
  });
}

async function so(co, ctx, nowMs) {
  if (ctx.loai === 'kenh' && co.tu) return ctx.demCuaSo({ tu: co.tu, nowMs, json: co.json });
  const { muc, hong, dong } = docSo(ctx, nowMs);
  const ds = co['tat-ca'] ? muc : soMo(muc);
  const cu = dong.filter((d) => d.text && docDongDau(d.text)?.cu).length;
  if (co.json) return JSON.stringify(ds);
  const dongIn = veSo(ds, nowMs);
  if (cu) dongIn.push(`tin không mã — không theo dõi vòng: ${cu}`);
  if (hong) dongIn.push(`cảnh báo: ${hong} dòng hộp tin không đọc được`);
  return dongIn.length ? dongIn.join('\n') : 'không có vòng mở';
}

async function nhac(vi, co, ctx, nowMs) {
  const ma = vi[1];
  if (!ma) loi(`thiếu mã — ${SU_DUNG.nhac}`);
  const { muc, dong } = docSo(ctx, nowMs);
  const v = muc.find((x) => x.ma === ma);
  if (!v) loi(`không có vòng ${ma}`);
  if (v.tu !== ctx.minh) loi(`chỉ người gửi (${v.tu}) nhắc được vòng ${ma}`);
  const daNhac = dong.some((d) => d.text && docDongDau(d.text)?.khau_lenh === 'BÁO' && d.text.split('\n')[1]?.trim() === `nhắc ${ma}`);
  if (daNhac) loi(`đã nhắc vòng ${ma} một lần — quá hạn lần hai sẽ lên bảng, không nhắc nữa`);
  const maBao = maMoi(dong, ctx.minh, nowMs);
  const text = `${vietDongDau({ khau_lenh: 'BÁO', ma: maBao, tu: ctx.minh, den: v.den })}\nnhắc ${ma}`;
  await ctx.nc.them({ text, luc: new Date(nowMs).toISOString() });
  return text;
}

export async function chay(argv, { cwd = process.cwd(), nowMs = null } = {}) {
  const now = bayGio(nowMs);
  const { vi, co } = tachDoiSo(argv);
  const lenh = vi[0];
  if (!lenh || (co.help && !lenh)) return Object.values(SU_DUNG).join('\n');
  if (co.help) {
    if (!SU_DUNG[lenh]) loi(`lệnh lạ «${lenh}» — khẩu lệnh hợp lệ: ${KHAU_LENH.join(', ')}`);
    return SU_DUNG[lenh];
  }
  if (lenh === 'vai' || lenh === 'canh') {
    const k = await import('./tin-kenh.mjs');
    return lenh === 'vai' ? k.vai(cwd, co) : k.canh(cwd, co);
  }
  if (lenh === 'tat' || lenh === 'bat') {
    const t = await import('./tin-dua.mjs');
    return t.datTat(cwd, lenh === 'tat');
  }
  if (lenh !== 'so' && lenh !== 'nhac' && !KHAU_LENH.includes(lenh)) loi(`khẩu lệnh lạ «${lenh}» — hợp lệ: ${KHAU_LENH.join(', ')}`);
  const ctx = await noiChuaCua(cwd, co);
  if (lenh === 'so') return so(co, ctx, now);
  if (lenh === 'nhac') return nhac(vi, co, ctx, now);
  if (KHAU_LENH_MO.includes(lenh) || lenh === 'BÁO') return gui(lenh, vi, co, ctx, now);
  return dap(lenh, vi, co, ctx, now, cwd);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === fs.realpathSync(process.argv[1])) {
  try {
    const out = await chay(process.argv.slice(2));
    if (out) process.stdout.write(`${out}\n`);
  } catch (e) {
    process.stderr.write(`tin: ${e instanceof LoiTin ? e.message : e.stack ?? e.message}\n`);
    process.exit(e instanceof LoiTin ? 1 : 2);
  }
}

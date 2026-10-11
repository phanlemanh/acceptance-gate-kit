#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DOC_DAU_BYTE } from './cau-hinh.mjs';
import { docJson, phienCuaCwd, timThuMucDot, trongWorktree } from './dot.mjs';
import { docCauHinh, docHangViec } from './hinh-dang.mjs';
import { BANG_BASH, phanLoaiLenh } from './phan-loai-s4.mjs';

const DAY_GOI = path.dirname(fileURLToPath(import.meta.url));
export const TEP_GIU_NHIP = path.join(DAY_GOI, 'giu-nhip.mjs');

export const LENH_MAC_DINH = {
  workflow: { meta: 'acceptance-verify', tep: /^acceptance-verify(?:-[^/]*)?\.js$/ },
  bash: BANG_BASH,
};
const MAU_THO = /acceptance-verify|repin-lane|s4-args|duong-nen\.mjs/;
const MAU_LENH_BOC = /^\s*\S*node\s+\S*giu-nhip\.mjs\s+--\s/;
const KY_TU_AN_TOAN = /^[\w./:@%+,-]+(?: [\w./:@%+,-]+)*$/;

const nhayDon = (s) => (KY_TU_AN_TOAN.test(s) ? s : `'${s.replace(/'/g, `'\\''`)}'`);
// Một ĐỐI SỐ (không phải cả lệnh): dấu cách cũng phải bọc.
const nhayDoiSo = (s) => (/^[\w./:@%+,-]+$/.test(s) ? s : `'${s.replace(/'/g, `'\\''`)}'`);

export function lenhBoc(lenhGoc) {
  const lenh = lenhGoc.trim();
  const than = KY_TU_AN_TOAN.test(lenh) ? lenh : `bash -c ${nhayDon(lenh)}`;
  return `node ${nhayDon(TEP_GIU_NHIP)} -- ${than}`;
}

function tenMetaCua(text) {
  return /export\s+const\s+meta\s*=\s*\{[^}]*?\bname\s*:\s*['"]([^'"]+)['"]/.exec(text)?.[1] ?? null;
}

function docDau(p) {
  let fd;
  try {
    fd = fs.openSync(p, 'r');
  } catch {
    return null;
  }
  try {
    const dem = Buffer.alloc(DOC_DAU_BYTE);
    const n = fs.readSync(fd, dem, 0, DOC_DAU_BYTE, 0);
    return dem.subarray(0, n).toString('utf8');
  } finally {
    fs.closeSync(fd);
  }
}

export function laS4Workflow(vao, lenh = LENH_MAC_DINH, cwd = process.cwd()) {
  const { meta, tep } = lenh.workflow;
  if (typeof vao?.script === 'string' && tenMetaCua(vao.script) === meta) return true;
  if (vao?.name === meta) return true;
  if (typeof vao?.scriptPath !== 'string' || vao.scriptPath === '') return false;
  const dau = docDau(path.resolve(cwd ?? '', vao.scriptPath));
  if (dau !== null) return tenMetaCua(dau) === meta;
  return tep.test(path.basename(vao.scriptPath));
}

export function phanLoai(dauVao, lenh = LENH_MAC_DINH) {
  if (dauVao.tool_name === 'Workflow') {
    return laS4Workflow(dauVao.tool_input, lenh, dauVao.cwd) ? 's4' : null;
  }
  if (dauVao.tool_name === 'Bash') {
    return phanLoaiLenh(String(dauVao.tool_input?.command ?? ''), lenh.bash);
  }
  return null;
}

function xetLenhNen(dauVao, taiNguyen) {
  const lenh = String(dauVao.tool_input?.command ?? '');
  if (dauVao.tool_name !== 'Bash' || dauVao.tool_input?.run_in_background !== true || MAU_LENH_BOC.test(lenh)) return { ma: 0 };
  return { ma: 2, loi: `chan-s4: lệnh nền giữ khoá ${taiNguyen} phải chạy qua giu-nhip: ${lenhBoc(lenh)}` };
}

// Dãy của cwd: id, `null` khi cwd ngoài mọi dãy, `undefined` khi `hang-viec.json` không đọc được.
function dayCuaCwd(thuMuc, cwd) {
  let hangViec;
  try {
    hangViec = docHangViec(thuMuc);
  } catch {
    return undefined;
  }
  return phienCuaCwd(hangViec, cwd) ?? null;
}

// Lời chặn nêu đúng lệnh CLI xin lượt (lệnh con `xin` của DP3 — một bên viết của `xin/`), không dặn viết tay
// tệp đơn. Lõi đã chép vào đợt (`chay`) thì trỏ lõi ấy; chưa có thì trỏ lõi của gói đang chạy hook. Cwd ngoài
// mọi dãy thì nói rằng chỉ phiên thợ của một dãy xin được lượt (design DP6 §4 C1). `hang-viec.json` không đọc
// được thì chính `xin` cũng không chạy được (nó cần tệp ấy để biết dãy), nên giữ lời dặn cũ — đường đọc-cũ.
function loiChan(thuMuc, taiNguyen, tinhTrang, cwd) {
  const dau = `chan-s4: khoá ${taiNguyen} ${tinhTrang}.`;
  const day = dayCuaCwd(thuMuc, cwd);
  if (day === undefined) return `${dau} Ghi đơn xin/<phiên>-${taiNguyen}.json trong ${thuMuc} rồi chờ khoa/${taiNguyen}/chu.json ghi tên phiên này.`;
  if (!day) return `${dau} Phiên này không thuộc dãy nào của đợt — chỉ phiên thợ của một dãy xin được lượt (chạy từ worktree của dãy).`;
  const loiDot = path.join(thuMuc, 'loi', 'dieu-phoi.mjs');
  const cli = fs.existsSync(loiDot) ? loiDot : path.join(DAY_GOI, 'dieu-phoi.mjs');
  return `${dau} Xin lượt: node ${nhayDoiSo(cli)} xin ${taiNguyen} — rồi chờ khoa/${taiNguyen}/chu.json ghi tên dãy ${day}.`;
}

export function quyet(dauVao, { timDot = timThuMucDot } = {}) {
  const thuMuc = timDot(dauVao.cwd);
  if (!thuMuc) return { ma: 0 };
  docCauHinh(thuMuc);
  const taiNguyen = phanLoai(dauVao);
  if (!taiNguyen) return { ma: 0 };
  const chu = docJson(path.join(thuMuc, 'khoa', taiNguyen, 'chu.json'));
  if (chu && trongWorktree(chu.worktree, dauVao.cwd)) return xetLenhNen(dauVao, taiNguyen);
  const tinhTrang = chu ? `đang thuộc ${chu.phien}` : 'đang trống nhưng chưa cấp cho phiên này';
  return { ma: 2, loi: loiChan(thuMuc, taiNguyen, tinhTrang, dauVao.cwd) };
}

export function chayHook(raw, tuyChon = {}) {
  let dauVao;
  try {
    dauVao = JSON.parse(raw);
  } catch {
    return MAU_THO.test(raw) ? { ma: 2, loi: 'chan-s4: lỗi nội bộ: đầu vào không đọc được — chặn để an toàn; báo phiên giám sát' } : { ma: 0 };
  }
  // JSON đọc được thì chỉ bộ phân loại cấu trúc quyết: không phải lệnh giữ tài nguyên → im. Mẫu thô
  // chỉ còn dùng cho đầu vào không đọc được (chặn để an toàn ở trên).
  if (phanLoai(dauVao) === null) return { ma: 0 };
  try {
    return quyet(dauVao, tuyChon);
  } catch (e) {
    return { ma: 2, loi: `chan-s4: lỗi nội bộ: ${e.message} — chặn để an toàn; báo phiên giám sát` };
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === fs.realpathSync(process.argv[1])) {
  let raw = '';
  for await (const manh of process.stdin) raw += manh;
  const kq = chayHook(raw);
  if (kq.loi) process.stderr.write(`${kq.loi}\n`);
  process.exit(kq.ma);
}

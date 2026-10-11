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

// Lõi để chạy lệnh `xin` (lệnh con của DP3 — một bên viết của `xin/`): lõi đã chép vào đợt (`chay`) nếu có,
// không thì lõi của gói đang chạy hook (design DP6 §4 C1).
function cliXin(thuMuc) {
  const loiDot = path.join(thuMuc, 'loi', 'dieu-phoi.mjs');
  return fs.existsSync(loiDot) ? loiDot : path.join(DAY_GOI, 'dieu-phoi.mjs');
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
  // Phiên thợ của một dãy (DP7 AC-6): nói rõ đây là chờ lượt, để phiên không đọc lời chặn thành lỗi —
  // không hỏi người, không tung lượt mới. Tiền tố cũ giữ nguyên (ca DP1 ghim nó).
  // Đọc khoan dung: đợt không có hoặc hỏng hang-viec.json thì lời chặn y như cũ.
  let day = null;
  try {
    day = phienCuaCwd(docHangViec(thuMuc), dauVao.cwd);
  } catch {
    day = null;
  }
  const choLuot = day
    ? ` Trong đợt đây là chờ lượt của dãy ${day}, không phải lỗi: không hỏi người, không chấm lại — xin lượt theo mục «Cách xin tài nguyên» của ${path.join(thuMuc, 'LUAT.md')}.`
    : '';
  // DP6 AC-4: trong dãy, nêu thêm đúng lệnh CLI xin lượt, chạy được nguyên văn từ worktree của dãy (đường đối số
  // bọc nháy cả khi chỉ có dấu cách). Câu cũ và câu «chờ lượt» của DP7 giữ nguyên làm tiền tố; ngoài dãy y như cũ.
  const lenhXin = day ? ` Lệnh xin lượt (chạy nguyên văn từ worktree của dãy): node ${nhayDoiSo(cliXin(thuMuc))} xin ${taiNguyen}` : '';
  return {
    ma: 2,
    loi: `chan-s4: khoá ${taiNguyen} ${tinhTrang}. Ghi đơn xin/<phiên>-${taiNguyen}.json trong ${thuMuc} rồi chờ khoa/${taiNguyen}/chu.json ghi tên phiên này.${choLuot}${lenhXin}`,
  };
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

#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ghiJsonNguyenTu, gocKhoChinh, phienCuaCwd, timThuMucDot } from './dot.mjs';
import { docHangViec } from './hinh-dang.mjs';

const LOAI_CHO = new Set(['idle_prompt', 'permission_prompt']);

function coTepBatDau(thuMuc, ten, tienTo) {
  const d = path.join(thuMuc, ten);
  return fs.existsSync(d) ? fs.readdirSync(d).filter((f) => f.startsWith(tienTo) && f.endsWith('.json')) : [];
}

export function xuLyChoNguoi(dauVao, { timDot = timThuMucDot } = {}) {
  const thuMuc = timDot(dauVao.cwd);
  if (!thuMuc) return 'ngoai-dot';
  const hangViec = docHangViec(thuMuc);
  const phien = phienCuaCwd(hangViec, dauVao.cwd);
  if (!phien) return 'khong-phai-tho';
  const tep = path.join(thuMuc, 'cho-nguoi', `${phien}.json`);
  if (dauVao.hook_event_name === 'UserPromptSubmit') {
    fs.rmSync(tep, { force: true });
    return 'xoa';
  }
  if (dauVao.hook_event_name !== 'Notification' || !LOAI_CHO.has(dauVao.notification_type)) return 'bo-qua';
  // Hộp xin quyền luôn cần người, kể cả khi dãy đang chờ lượt hay chờ trả lời (lệnh nền chờ khoá cũng bật được
  // hộp). Thông báo rảnh thì im khi dãy đang chờ — rảnh lúc đó là đúng (design DP6 §4 C2).
  if (dauVao.notification_type !== 'permission_prompt') {
    if (coTepBatDau(thuMuc, 'xin', `${phien}-`).length > 0) return 'cho-luot';
    const chuaTraLoi = coTepBatDau(thuMuc, 'yeu-cau', `${phien}-`).some((f) => !fs.existsSync(path.join(thuMuc, 'tra-loi', f)));
    if (chuaTraLoi) return 'cho-tra-loi';
  }
  ghiJsonNguyenTu(tep, {
    phien,
    loai: dauVao.notification_type,
    tin: dauVao.message ?? '',
    luc: new Date().toISOString(),
    session_id: dauVao.session_id ?? null,
  });
  return 'ghi';
}

// Tin tự đến (hồ sơ vong-mo-co-chu-giu): nạp ĐỘNG trong khối bắt lỗi, chạy SAU việc cũ của hook. Lỗi nạp hay lỗi đọc
// hộp tin không làm chết việc cũ; báo đúng MỘT lần mỗi worktree rồi im cho tới khi hết lỗi.
async function phanTin(dauVao) {
  if (!dauVao?.cwd) return { ngu_canh: null, canh_bao: null };
  // Đường tắt: chưa ai dùng tin ở kho này (không tin.jsonl trong đợt, không trạng thái kênh) → không nạp gì.
  let ghiNhanh = () => {};
  try {
    const goc = gocKhoChinh(dauVao.cwd);
    let dot = null;
    try {
      dot = fs.realpathSync(path.join(goc, '.acceptance-runs', 'dieu-phoi-hien-tai'));
    } catch {}
    if (!(dot && fs.existsSync(path.join(dot, 'tin.jsonl'))) && !fs.existsSync(path.join(goc, '.acceptance-runs', 'tin'))) return { ngu_canh: null, canh_bao: null };
    // Không có gì mới (kích thước hộp tin không đổi) và đã kiểm trong phút vừa qua → không nạp phần tin.
    const dTin = path.join(goc, '.acceptance-runs', 'tin');
    const co = (p) => {
      try {
        return fs.statSync(p).size;
      } catch {
        return -1;
      }
    };
    const chuKy = () => [dot ? co(path.join(dot, 'tin.jsonl')) : -1, ...(fs.existsSync(dTin) ? fs.readdirSync(dTin).filter((f) => f.startsWith('kenh-')).sort().map((f) => co(path.join(dTin, f))) : [])].join(',');
    const now = process.env.DIEU_PHOI_NOW_MS ? Number(process.env.DIEU_PHOI_NOW_MS) : Date.now();
    const dauNhanh = path.join(dTin, 'nhanh', Buffer.from(fs.realpathSync(dauVao.cwd)).toString('hex').slice(-40));
    let truoc = null;
    try {
      truoc = JSON.parse(fs.readFileSync(dauNhanh, 'utf8'));
    } catch {}
    if (!dauVao.agent_id && truoc && truoc.chu_ky === chuKy() && now - truoc.luc >= 0 && now - truoc.luc < 60_000) return { ngu_canh: null, canh_bao: null };
    ghiNhanh = () => {
      fs.mkdirSync(path.dirname(dauNhanh), { recursive: true });
      fs.writeFileSync(dauNhanh, JSON.stringify({ chu_ky: chuKy(), luc: now }));
    };
  } catch {
    return { ngu_canh: null, canh_bao: null };
  }
  try {
    const { duaTin } = await import('./tin-dua.mjs');
    const kq = duaTin(dauVao);
    if (!dauVao.agent_id && !kq.canh_bao) ghiNhanh();
    return kq;
  } catch (e) {
    try {
      const goc = gocKhoChinh(dauVao.cwd);
      const coTin = timThuMucDot(dauVao.cwd) || fs.existsSync(path.join(goc, '.acceptance-runs', 'tin'));
      if (!coTin) return { ngu_canh: null, canh_bao: null };
      const thucCwd = fs.realpathSync(dauVao.cwd);
      const dau = path.join(goc, '.acceptance-runs', 'tin', 'loi-da-bao', `nap-${Buffer.from(thucCwd).toString('hex').slice(-32)}`);
      if (fs.existsSync(dau)) return { ngu_canh: null, canh_bao: null };
      fs.mkdirSync(path.dirname(dau), { recursive: true });
      fs.writeFileSync(dau, `${new Date().toISOString()} ${e.code ?? ''} ${e.message}\n`);
      return { ngu_canh: null, canh_bao: `không đọc được hộp tin (nạp phần tin lỗi: ${e.code ?? e.message}) — tin tự đến tạm dừng; sửa gói rồi gọi lại` };
    } catch {
      return { ngu_canh: null, canh_bao: null };
    }
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === fs.realpathSync(process.argv[1])) {
  let raw = '';
  for await (const manh of process.stdin) raw += manh;
  let dauVao = null;
  try {
    dauVao = JSON.parse(raw);
    xuLyChoNguoi(dauVao);
  } catch {
  }
  if (dauVao?.hook_event_name === 'UserPromptSubmit') {
    const tin = await phanTin(dauVao);
    const ra = {};
    if (tin.ngu_canh) ra.hookSpecificOutput = { hookEventName: 'UserPromptSubmit', additionalContext: tin.ngu_canh };
    if (tin.canh_bao) ra.systemMessage = tin.canh_bao;
    if (Object.keys(ra).length) process.stdout.write(JSON.stringify(ra));
  }
  process.exit(0);
}

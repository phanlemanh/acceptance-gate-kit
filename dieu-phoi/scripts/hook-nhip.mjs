#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { docJson, ghiJsonNguyenTu, gocKhoChinh, phienCuaCwd, timThuMucDot, trongWorktree } from './dot.mjs';
import { docHangViec } from './hinh-dang.mjs';
import { docPha } from './pha.mjs';
import { bayGio, ghiNhipSong } from './song.mjs';

// Nhịp sống của phiên (DP3): mỗi lời gọi công cụ trong kho có đợt ghi `song/<session_id>.json`.
export function ghiSong(dauVao, { timDot = timThuMucDot } = {}) {
  const thuMuc = timDot(dauVao.cwd);
  if (!thuMuc) return 'ngoai-dot';
  let hangViec = null;
  try {
    hangViec = docHangViec(thuMuc);
  } catch {
    hangViec = null;
  }
  return ghiNhipSong(thuMuc, { phien: dauVao.session_id, cwd: dauVao.cwd, hangViec });
}

// Lời nhắc bàn giao (spec workflow §16 T10, design DP4 chỗ chọn 7): kênh chính là tệp — đợt đang bàn giao thì phiên
// trong worktree một dãy chưa báo xong nhận ngữ cảnh «bàn giao», tối đa một lần mỗi 5′ mỗi phiên. Tin liên phiên của
// giám sát chỉ để nhắc phiên đang rảnh.
const NHAC_LAI_MS = 5 * 60_000;
export function nhacBanGiao(dauVao, { timDot = timThuMucDot, nowMs = null } = {}) {
  const thuMuc = timDot(dauVao.cwd);
  if (!thuMuc) return null;
  const dk = docPha(thuMuc);
  if (dk.pha !== 'dang-ban-giao' || !dk.ban_giao) return null;
  let hv;
  try {
    hv = docHangViec(thuMuc);
  } catch {
    return null;
  }
  const day = phienCuaCwd(hv, dauVao.cwd);
  if (!day) return null;
  if (docJson(path.join(thuMuc, 'ban-giao', 'xong', `${day}.json`), null)?.ma === dk.ban_giao.ma) return null;
  const now = bayGio(nowMs);
  const pNhac = path.join(thuMuc, 'ban-giao', 'nhac', `${String(dauVao.session_id ?? 'khong-ma').replace(/[^\w.-]/g, '_')}.json`);
  const lan = docJson(pNhac, null);
  if (lan?.luc && now - Date.parse(lan.luc) >= 0 && now - Date.parse(lan.luc) < NHAC_LAI_MS) return null;
  ghiJsonNguyenTu(pNhac, { luc: new Date(now).toISOString() });
  return `Đợt ${hv.dot} đang bàn giao tài khoản (${dk.ban_giao.ma}): dừng ở ranh giới gần nhất, commit WIP, rồi chạy \`node ${path.join(thuMuc, 'loi', 'dieu-phoi.mjs')} ban-giao-xong\` từ worktree này (có thể kèm \`--wip "<mô tả>"\` để lệnh commit hộ). Đang chạy lượt chấm thì để lượt chạy hết rồi nhả khoá — dãy được xếp «đang xong».`;
}

export function chamNhip(dauVao, { timDot = timThuMucDot } = {}) {
  const thuMuc = timDot(dauVao.cwd);
  if (!thuMuc) return [];
  const goc = path.join(thuMuc, 'khoa');
  if (!fs.existsSync(goc)) return [];
  const daCham = [];
  for (const taiNguyen of fs.readdirSync(goc)) {
    const chu = docJson(path.join(goc, taiNguyen, 'chu.json'));
    if (chu && trongWorktree(chu.worktree, dauVao.cwd)) {
      fs.writeFileSync(path.join(goc, taiNguyen, 'nhip'), new Date().toISOString());
      daCham.push(taiNguyen);
    }
  }
  return daCham;
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
    chamNhip(dauVao);
  } catch {
  }
  try {
    if (dauVao) ghiSong(dauVao);
  } catch {
  }
  let nhac = null;
  try {
    nhac = dauVao ? nhacBanGiao(dauVao) : null;
  } catch {
  }
  const tin = await phanTin(dauVao);
  const phan = [nhac, tin.ngu_canh].filter(Boolean);
  const ra = {};
  if (phan.length) ra.hookSpecificOutput = { hookEventName: 'PostToolUse', additionalContext: phan.join('\n\n') };
  if (tin.canh_bao) ra.systemMessage = tin.canh_bao;
  if (Object.keys(ra).length) process.stdout.write(JSON.stringify(ra));
  process.exit(0);
}

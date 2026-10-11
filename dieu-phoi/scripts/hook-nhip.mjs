#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { docJson, ghiJsonNguyenTu, phienCuaCwd, timThuMucDot, trongWorktree } from './dot.mjs';
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
  try {
    const nhac = dauVao ? nhacBanGiao(dauVao) : null;
    if (nhac) process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: 'PostToolUse', additionalContext: nhac } }));
  } catch {
  }
  process.exit(0);
}

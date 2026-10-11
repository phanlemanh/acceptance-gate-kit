// Nhịp sống của phiên (spec workflow §5.1) — MỘT bên viết của `song/<mã phiên>.json`, gọi từ hook
// PostToolUse. Danh sách phiên của app tách theo tài khoản, nên «dãy còn phiên sống» đọc từ tệp này: có
// tệp nhịp mới hơn 10′ mang worktree của dãy. Nhịp chỉ đo HOẠT ĐỘNG (một lời gọi công cụ), không đo phiên
// còn sống — phiên rảnh trông như chết; bên đọc phải biết điều đó (design DP3 §3 chỗ chọn 3, 9).
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { GIAY_MS, PHUT_MS } from './cau-hinh.mjs';
import { ghiJsonNguyenTu, phienCuaCwd } from './dot.mjs';

export const TEP_SONG_DIR = 'song';
export const NGUONG_SONG_MS = 10 * PHUT_MS;
export const GHI_LAI_MS = 30 * GIAY_MS;

// Đồng hồ: tham số trước; hook là tiến trình con nên ca đo truyền giờ giả qua biến riêng của gói.
export const bayGio = (nowMs = null) => nowMs ?? (process.env.DIEU_PHOI_NOW_MS ? Number(process.env.DIEU_PHOI_NOW_MS) : Date.now());

const laMaPhien = (s) => typeof s === 'string' && /^[\w.-]+$/.test(s) && !/^\.+$/.test(s);

function gocWorktree(cwd) {
  try {
    return fs.realpathSync(execFileSync('git', ['rev-parse', '--show-toplevel'], { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim());
  } catch {
    try {
      return fs.realpathSync(cwd);
    } catch {
      return null;
    }
  }
}

function docMot(p) {
  try {
    const du = JSON.parse(fs.readFileSync(p, 'utf8'));
    return du && typeof du.phien === 'string' && typeof du.luc === 'string' && Number.isFinite(Date.parse(du.luc)) ? du : null;
  } catch {
    return null;
  }
}

export function ghiNhipSong(thuMuc, { phien, cwd, hangViec = null, nowMs = null }) {
  if (!laMaPhien(phien)) return 'bo-qua';
  const now = bayGio(nowMs);
  const p = path.join(thuMuc, TEP_SONG_DIR, `${phien}.json`);
  const cu = docMot(p);
  if (cu) {
    const tuoi = now - Date.parse(cu.luc);
    if (tuoi >= 0 && tuoi < GHI_LAI_MS) return 'bo-qua';
  }
  ghiJsonNguyenTu(p, { phien, day: hangViec ? phienCuaCwd(hangViec, cwd) : null, worktree: gocWorktree(cwd), luc: new Date(now).toISOString() });
  return 'ghi';
}

export const coThuMucSong = (thuMuc) => fs.existsSync(path.join(thuMuc, TEP_SONG_DIR));

export function docNhipSong(thuMuc) {
  const d = path.join(thuMuc, TEP_SONG_DIR);
  if (!fs.existsSync(d)) return [];
  return fs
    .readdirSync(d)
    .filter((f) => f.endsWith('.json'))
    .sort()
    .map((f) => docMot(path.join(d, f)))
    .filter(Boolean);
}

// Nhịp mới nhất mang worktree đã cho (null khi chưa có). Tuổi âm (đồng hồ lùi) coi như 0.
export function nhipMoiNhatCua(thuMuc, worktree) {
  let moi = null;
  for (const n of docNhipSong(thuMuc)) if (n.worktree === worktree && (!moi || Date.parse(n.luc) > Date.parse(moi.luc))) moi = n;
  return moi;
}

export const tuoiMs = (luc, nowMs) => Math.max(0, bayGio(nowMs) - Date.parse(luc));
export const conSong = (nhip, nowMs) => Boolean(nhip) && tuoiMs(nhip.luc, nowMs) < NGUONG_SONG_MS;

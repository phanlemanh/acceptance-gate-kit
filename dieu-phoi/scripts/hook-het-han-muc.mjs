#!/usr/bin/env node
// Lưới cuối của bàn giao tài khoản (spec workflow §4.3, §16 T9, design DP4 chỗ chọn 11): một thợ chết vì hạn mức
// (`StopFailure` với `error: "rate_limit"`) → commit WIP thường ở worktree của dãy, TRỪ khi còn lượt chấm hay đường nền
// mở (khoá `s4` hoặc `duong-nen` trỏ worktree đó — trong đợt, chấm chỉ chạy khi giữ khoá) — khi ấy chỉ ghi dấu «lượt
// dở». Không bao giờ bỏ hook của kho: commit lỗi thì ghi lý do, cây và phần đã stage giữ nguyên; đang merge/rebase dở
// thì không commit (`wip.mjs`). Kho không đợt, lỗi khác: im. Thoát 0.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { docJson, ghiJsonNguyenTu, ghiSuKien, phienCuaCwd, timThuMucDot } from './dot.mjs';
import { docHangViec } from './hinh-dang.mjs';
import { bayGio } from './song.mjs';
import { phienDaBiet } from './dau.mjs';
import { commitWip } from './wip.mjs';

// Hạn của commit trong hook (hook khai timeout 60″ ở hooks.json): còn chỗ ghi dấu sau commit.
const HAN_COMMIT_MS = 40_000;

export function xuLyHetHanMuc(dauVao, { timDot = timThuMucDot, nowMs = null } = {}) {
  if (dauVao?.error !== 'rate_limit') return 'bo-qua';
  const thuMuc = timDot(dauVao.cwd);
  if (!thuMuc) return 'ngoai-dot';
  const hv = docHangViec(thuMuc);
  const id = phienCuaCwd(hv, dauVao.cwd);
  if (!id) return 'khong-phai-tho';
  // Phiên của tài khoản cũ đã bàn giao ở lần tiếp tục gần nhất: không commit việc của thợ mới, không ghi dấu (review C1c).
  if (dauVao.session_id && phienDaBiet(thuMuc).has(dauVao.session_id)) return 'phien-da-ban-giao';
  const wt = hv.day.find((d) => d.id === id).worktree;
  const luc = new Date(bayGio(nowMs)).toISOString();
  const dau = { day: id, phien: dauVao.session_id ?? null, luc, loi: 'rate_limit', wip: null, luot_do: false };
  const giuLuot = ['s4', 'duong-nen'].some((tn) => docJson(path.join(thuMuc, 'khoa', tn, 'chu.json'), null)?.worktree === wt);
  const tep = path.join(thuMuc, 'ban-giao', 'dau', `${id}.json`);
  if (giuLuot) dau.luot_do = true;
  else {
    // Dấu ghi TRƯỚC commit: hook bị giết giữa commit (hạn 60″) vẫn để lại dấu cho bàn giao (review I4).
    ghiJsonNguyenTu(tep, { ...dau, dang_commit: true });
    const r = commitWip(wt, `wip(ban-giao): lưới cuối — rate_limit ${luc}`, { timeoutMs: HAN_COMMIT_MS });
    if (r.ket === 'commit') dau.wip = r.sha;
    else if (r.ket === 'bo') dau.bo_commit = r.ly_do;
    else if (r.ket === 'loi') dau.loi_commit = r.ly_do;
  }
  ghiJsonNguyenTu(tep, dau);
  ghiSuKien(thuMuc, { loai: 'tho-het-han-muc', phien: id, wip: dau.wip, luot_do: dau.luot_do, ly_do: `${id} dừng vì hạn mức`, can_phan: true });
  return 'ghi';
}

if (process.argv[1] && fileURLToPath(import.meta.url) === fs.realpathSync(process.argv[1])) {
  let raw = '';
  for await (const manh of process.stdin) raw += manh;
  try {
    xuLyHetHanMuc(JSON.parse(raw));
  } catch {
  }
  process.exit(0);
}

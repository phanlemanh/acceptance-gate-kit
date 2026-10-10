// Vai của đợt (spec workflow §6) — bên viết của `vai.json`: phiên giám sát hiện tại và các dãy thợ.
// DP2 ghi lúc mở đợt; DP3 thêm «nhận vai giám sát» (lịch sử nhận vai nằm ở `lich_su`).
import path from 'node:path';
import { docJson, ghiJsonNguyenTu } from './dot.mjs';

export const TEP_VAI = 'vai.json';

export function ghiVai(thuMuc, { phien = null, worktree = null, day = [] }) {
  ghiJsonNguyenTu(path.join(thuMuc, TEP_VAI), {
    giam_sat: { phien, worktree, nhan_luc: new Date().toISOString() },
    lich_su: [],
    day: day.map((d) => ({ id: d.id, worktree: d.worktree, phien: null })),
  });
}

export const docVai = (thuMuc) => docJson(path.join(thuMuc, TEP_VAI), null);

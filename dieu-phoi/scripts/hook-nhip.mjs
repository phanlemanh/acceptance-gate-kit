#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { docJson, timThuMucDot, trongWorktree } from './dot.mjs';
import { docHangViec } from './hinh-dang.mjs';
import { ghiNhipSong } from './song.mjs';

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
  process.exit(0);
}

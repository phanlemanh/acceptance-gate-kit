#!/usr/bin/env node
// Lưới cuối của bàn giao tài khoản (spec workflow §4.3, §16 T9, design DP4 chỗ chọn 11): một thợ chết vì hạn mức
// (`StopFailure` với `error: "rate_limit"`) → commit WIP thường ở worktree của dãy, TRỪ khi còn lượt chấm hay đường nền
// mở (khoá `s4` hoặc `duong-nen` trỏ worktree đó — trong đợt, chấm chỉ chạy khi giữ khoá) — khi ấy chỉ ghi dấu «lượt
// dở». Không bao giờ bỏ hook của kho: commit lỗi thì ghi lý do, cây giữ nguyên. Kho không đợt, lỗi khác: im. Thoát 0.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { docJson, ghiJsonNguyenTu, ghiSuKien, phienCuaCwd, timThuMucDot } from './dot.mjs';
import { docHangViec } from './hinh-dang.mjs';
import { bayGio } from './song.mjs';

export function xuLyHetHanMuc(dauVao, { timDot = timThuMucDot, nowMs = null } = {}) {
  if (dauVao?.error !== 'rate_limit') return 'bo-qua';
  const thuMuc = timDot(dauVao.cwd);
  if (!thuMuc) return 'ngoai-dot';
  const hv = docHangViec(thuMuc);
  const id = phienCuaCwd(hv, dauVao.cwd);
  if (!id) return 'khong-phai-tho';
  const wt = hv.day.find((d) => d.id === id).worktree;
  const luc = new Date(bayGio(nowMs)).toISOString();
  const dau = { day: id, phien: dauVao.session_id ?? null, luc, loi: 'rate_limit', wip: null, luot_do: false };
  const giuLuot = ['s4', 'duong-nen'].some((tn) => docJson(path.join(thuMuc, 'khoa', tn, 'chu.json'), null)?.worktree === wt);
  const ban = (spawnSync('git', ['status', '--porcelain'], { cwd: wt, encoding: 'utf8' }).stdout ?? '').trim() !== '';
  if (giuLuot) dau.luot_do = true;
  else if (ban) {
    spawnSync('git', ['add', '-A'], { cwd: wt });
    const c = spawnSync('git', ['commit', '-q', '-m', `wip(ban-giao): lưới cuối — rate_limit ${luc}`], { cwd: wt, encoding: 'utf8' });
    if (c.status === 0) dau.wip = (spawnSync('git', ['rev-parse', 'HEAD'], { cwd: wt, encoding: 'utf8' }).stdout ?? '').trim() || null;
    else {
      spawnSync('git', ['reset', '-q'], { cwd: wt }); // gỡ stage, tệp trên đĩa giữ nguyên
      dau.loi_commit = `${c.stderr ?? ''}${c.stdout ?? ''}`.split('\n').map((x) => x.trim()).find(Boolean) ?? `mã ${c.status}`;
    }
  }
  ghiJsonNguyenTu(path.join(thuMuc, 'ban-giao', 'dau', `${id}.json`), dau);
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

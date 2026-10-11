#!/usr/bin/env node
// Gom số mà ba thử nghiệm đã ghi thành một bảng ngắn để so với `get_usage` đọc cùng lúc (phiên đo đọc
// `get_usage` bằng công cụ của app rồi đặt cạnh bảng này). Chỉ in phần trăm, giờ đặt lại, loại lỗi.
// Dùng: node doc.mjs --worktree <gốc worktree thử>
import fs from 'node:fs';
import path from 'node:path';

const i = process.argv.indexOf('--worktree');
const ra = path.join(fs.realpathSync(process.argv[i + 1] ?? '.'), '.acceptance-runs', 'do-tai-khoan');
const doc = (ten) => {
  const p = path.join(ra, ten);
  return fs.existsSync(p) ? fs.readFileSync(p, 'utf8').split('\n').filter(Boolean).map((d) => JSON.parse(d)) : [];
};
const sl = doc('statusline.jsonl');
const cuoi = sl.at(-1)?.du?.rate_limits ?? null;
process.stdout.write(`h · dòng trạng thái: ${sl.length} lần chạy; rate_limits cuối: ${cuoi ? JSON.stringify(cuoi) : 'vắng'}\n`);
const sf = doc('stopfailure.jsonl');
process.stdout.write(`i · StopFailure: ${sf.length} lần bắn; lỗi: ${[...new Set(sf.map((x) => x.du?.error))].join(', ') || '—'}\n`);
const md = doc('mod.jsonl');
const doMd = md.filter((x) => x.du?.su_kien === 'session.measure' && (x.du.rateLimits ?? []).length);
const batDau = md.find((x) => x.du?.su_kien === 'session.start');
process.stdout.write(`l · mod: ${md.length} dòng; session.start rateLimits: ${JSON.stringify(batDau?.du?.usage?.rateLimits ?? null)}; measure có số: ${doMd.length}; cuối: ${JSON.stringify(doMd.at(-1)?.du?.rateLimits ?? null)}\n`);

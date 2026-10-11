#!/usr/bin/env node
// Cài ba thử nghiệm của phép đo DP0 mà chủ kho đã đồng ý (11/10), mỗi cái ĐÚNG MỘT chỗ:
//   h — `statusLine` ghi stdin ra tệp, trong `.claude/settings.local.json` của MỘT worktree thử;
//   i — hook `StopFailure` ghi đầu vào ra tệp, cùng tệp settings đó;
//   l — mod thử chép vào thư mục mod của MỘT phiên đo (`~/.claude/dev-mods/<mã phiên>/`).
// Sao lưu tệp gốc trước khi sửa, ghi `da-cai.json` để `go.mjs` gỡ đúng những gì đã cài. Đã có `statusLine`
// hay `StopFailure` thì DỪNG, không ghi đè cài đặt của người. Chỉ chạy khi Điều phối chọn giờ đo: chép mod
// vào thư mục mod bật câu hỏi nạp lại nóng cho chủ kho.
// Dùng: node cai.mjs --worktree <gốc worktree thử> [--mod-dir <~/.claude/dev-mods/<mã phiên>> --phien <mã phiên đo>] [--chi h,i,l]
// Mod thử CHỈ chạy ở phiên có mã `--phien` (tự kiểm `$.session.id()`); phiên khác không làm gì, không ghi gì.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DAY = path.dirname(fileURLToPath(import.meta.url));
const GHI = path.join(DAY, 'ghi-stdin.mjs');
const co = (ten) => {
  const i = process.argv.indexOf(`--${ten}`);
  return i > -1 ? process.argv[i + 1] : null;
};
const dung = (cau) => {
  process.stderr.write(`cai: ${cau}\n`);
  process.exit(1);
};

const wt = co('worktree');
if (!wt || !fs.existsSync(wt)) dung('cần --worktree <gốc worktree thử có thật>');
const chi = new Set((co('chi') ?? 'h,i,l').split(','));
const ra = path.join(fs.realpathSync(wt), '.acceptance-runs', 'do-tai-khoan');
const pDaCai = path.join(ra, 'da-cai.json');
if (fs.existsSync(pDaCai)) dung(`đã cài (${pDaCai}) — chạy go.mjs trước`);
fs.mkdirSync(ra, { recursive: true });
const daCai = { luc: new Date().toISOString(), worktree: fs.realpathSync(wt), ra, muc: [] };

if (chi.has('h') || chi.has('i')) {
  const pSet = path.join(daCai.worktree, '.claude', 'settings.local.json');
  const coGoc = fs.existsSync(pSet);
  const goc = coGoc ? JSON.parse(fs.readFileSync(pSet, 'utf8')) : {};
  if (chi.has('h') && goc.statusLine) dung(`${pSet} đã có statusLine — không ghi đè`);
  if (chi.has('i') && goc.hooks?.StopFailure) dung(`${pSet} đã có hook StopFailure — không ghi đè`);
  const saoLuu = path.join(ra, 'settings.local.json.goc');
  if (coGoc) fs.copyFileSync(pSet, saoLuu);
  const moi = structuredClone(goc);
  if (chi.has('h')) moi.statusLine = { type: 'command', command: `node "${GHI}" "${path.join(ra, 'statusline.jsonl')}"` };
  if (chi.has('i')) moi.hooks = { ...(moi.hooks ?? {}), StopFailure: [{ hooks: [{ type: 'command', timeout: 10, command: `node "${GHI}" "${path.join(ra, 'stopfailure.jsonl')}"` }] }] };
  fs.mkdirSync(path.dirname(pSet), { recursive: true });
  fs.writeFileSync(pSet, `${JSON.stringify(moi, null, 2)}\n`);
  daCai.muc.push({ loai: 'settings', tep: pSet, sao_luu: coGoc ? saoLuu : null, thu: [...chi].filter((x) => x !== 'l') });
}

if (chi.has('l')) {
  const modDir = co('mod-dir');
  if (!modDir) dung('thử nghiệm l cần --mod-dir <~/.claude/dev-mods/<mã phiên đo>>');
  const phien = co('phien');
  if (!phien || !/^[\w-]+$/.test(phien)) dung('thử nghiệm l cần --phien <mã phiên đo> (mod im ở mọi phiên khác)');
  const dich = path.join(modDir, 'do-han-muc-thu');
  if (fs.existsSync(dich)) dung(`${dich} đã có — không ghi đè`);
  fs.cpSync(path.join(DAY, 'mod-thu'), dich, { recursive: true });
  const reg = path.join(dich, 'hooks', 'register.ts');
  fs.writeFileSync(reg, fs.readFileSync(reg, 'utf8').replaceAll('__PHIEN__', phien).replaceAll('__GHI__', GHI).replaceAll('__TEP__', path.join(ra, 'mod.jsonl')));
  daCai.muc.push({ loai: 'mod', thu_muc: dich, phien });
}

fs.writeFileSync(pDaCai, `${JSON.stringify(daCai, null, 2)}\n`);
process.stdout.write(`đã cài ${daCai.muc.map((m) => m.loai).join(', ')} — gỡ bằng: node "${path.join(DAY, 'go.mjs')}" --worktree "${daCai.worktree}"\n`);

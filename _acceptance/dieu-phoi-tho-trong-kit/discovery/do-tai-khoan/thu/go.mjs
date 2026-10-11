#!/usr/bin/env node
// Gỡ đúng những gì cai.mjs đã cài (đọc da-cai.json): khôi phục settings.local.json từ bản sao lưu (hoặc xoá
// tệp nếu trước đó không có), xoá thư mục mod thử. Tệp số đo (*.jsonl) giữ lại để đọc.
// Dùng: node go.mjs --worktree <gốc worktree thử>
import fs from 'node:fs';
import path from 'node:path';

const i = process.argv.indexOf('--worktree');
const wt = i > -1 ? process.argv[i + 1] : null;
if (!wt) {
  process.stderr.write('go: cần --worktree\n');
  process.exit(1);
}
const ra = path.join(fs.realpathSync(wt), '.acceptance-runs', 'do-tai-khoan');
const pDaCai = path.join(ra, 'da-cai.json');
if (!fs.existsSync(pDaCai)) {
  process.stdout.write('go: không có gì đã cài\n');
  process.exit(0);
}
const daCai = JSON.parse(fs.readFileSync(pDaCai, 'utf8'));
for (const m of daCai.muc) {
  if (m.loai === 'settings') {
    if (m.sao_luu) fs.copyFileSync(m.sao_luu, m.tep);
    else fs.rmSync(m.tep, { force: true });
  }
  if (m.loai === 'mod') fs.rmSync(m.thu_muc, { recursive: true, force: true });
}
fs.renameSync(pDaCai, path.join(ra, `da-go-${Date.now()}.json`));
process.stdout.write(`đã gỡ ${daCai.muc.map((m) => m.loai).join(', ')}\n`);

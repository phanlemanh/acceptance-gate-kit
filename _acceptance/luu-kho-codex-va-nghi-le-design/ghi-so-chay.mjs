#!/usr/bin/env node
// ghi-so-chay.mjs — sinh sổ chạy cho hồ sơ này BẰNG PHÉP ĐO, không bằng gõ tay.
//
// Vì sao có script này (rà soát đối kháng vòng 1, mục E4): sổ chạy vòng 1 có cả
// 19 dòng mang **cùng một mốc giờ**, tức mốc giờ là thứ được VIẾT RA chứ không
// phải thứ được ĐO; lượt ĐỎ bị ghi đè thay vì nối thêm; và sha trong sổ lệch
// HEAD. Một cuốn sổ như thế không còn là bằng chứng của việc gì đã chạy.
//
// Ba luật:
//   (a) APPEND-ONLY. Không lượt nào ghi đè lượt nào — kể cả lượt ĐỎ. Lượt đỏ bị
//       xoá là mất đúng thứ người rà soát cần đọc.
//   (b) Mốc giờ và mã thoát ĐO TẠI CHỖ, mỗi lệnh một lần chạy thật.
//   (c) Danh sách eval SUY TỪ `evals.yaml` + `config.yaml`, không gõ lại ở đây.
//       Thêm một eval mà quên ghi sổ là chuyện không xảy ra được; và một `cmd:`
//       trỏ khoá config không tồn tại thì script CHẾT TO thay vì ghi một dòng
//       trông bình thường.
//
// Nhiều eval dùng CHUNG một lệnh (bộ răng phủ E1–E10, E15, E16…). Chúng chia
// nhau MỘT `run_id` — đó là sự thật: một lượt chạy vật lý phủ nhiều eval. Bịa
// ra nhiều run_id cho một lượt là bịa ra nhiều phép đo.
//
// Dùng:  node ghi-so-chay.mjs --round 2 [--dry-run]

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const SLUG = path.basename(HERE);

const args = process.argv.slice(2);
const arg = (name, dflt) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : dflt;
};
const ROUND = Number(arg('--round', ''));
const DRY = args.includes('--dry-run');
if (!Number.isInteger(ROUND) || ROUND < 1) {
  console.error('ghi-so-chay: --round <n> là bắt buộc (n nguyên ≥ 1)');
  process.exit(2);
}

// ── Đọc evals.yaml: cặp (id, cmd) ────────────────────────────────────────────
const evalsText = fs.readFileSync(path.join(HERE, 'evals.yaml'), 'utf8');
const pairs = [];
{
  let cur = null;
  for (const raw of evalsText.split('\n')) {
    const mId = raw.match(/^\s*-\s+id:\s*(\S+)\s*$/);
    if (mId) { cur = { id: mId[1], cmd: null }; pairs.push(cur); continue; }
    const mCmd = raw.match(/^\s*cmd:\s*(\S+)\s*$/);
    if (mCmd && cur && !cur.cmd) cur.cmd = mCmd[1];
  }
}
const noCmd = pairs.filter(p => !p.cmd).map(p => p.id);
if (noCmd.length) {
  console.error(`ghi-so-chay: eval không có cmd: ${noCmd.join(', ')}`);
  process.exit(2);
}

// ── Resolve `config:executors.<a>.<b>` từ _acceptance/config.yaml ────────────
const cfgText = fs.readFileSync(path.join(ROOT, '_acceptance', 'config.yaml'), 'utf8');
function resolveKey(ref) {
  const dotted = ref.replace(/^config:/, '');            // executors.script.foo
  const parts = dotted.split('.');
  let depth = 0, want = parts[0];
  for (const raw of cfgText.split('\n')) {
    if (!raw.trim() || raw.trim().startsWith('#')) continue;
    const indent = raw.length - raw.trimStart().length;
    if (indent !== depth * 2) continue;
    const m = raw.trim().match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!m || m[1] !== want) continue;
    depth += 1;
    if (depth === parts.length) {
      return m[2].replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1');
    }
    want = parts[depth];
  }
  return null;
}
for (const p of pairs) {
  if (!p.cmd.startsWith('config:')) continue;
  const resolved = resolveKey(p.cmd);
  if (!resolved) {
    // Fail-closed: một `cmd:` trỏ khoá đã chết mà ghi sổ trót lọt thì cuốn sổ
    // tuyên "đã chạy" cho một lệnh không tồn tại.
    console.error(`ghi-so-chay: ${p.id} trỏ ${p.cmd} — KHÔNG có khoá đó trong _acceptance/config.yaml`);
    process.exit(2);
  }
  p.resolved = resolved;
}

// ── Gom theo LỆNH VẬT LÝ, chạy mỗi lệnh đúng một lần ─────────────────────────
const byCmd = new Map();
for (const p of pairs) {
  if (!byCmd.has(p.resolved)) byCmd.set(p.resolved, []);
  byCmd.get(p.resolved).push(p.id);
}
const sha = spawnSync('git', ['-C', ROOT, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).stdout.trim();
if (!sha) { console.error('ghi-so-chay: không đọc được HEAD'); process.exit(2); }

const lines = [];
let anyRed = 0;
for (const [cmd, ids] of byCmd) {
  const runId = `luu-kho-r${ROUND}-${crypto.randomBytes(4).toString('hex')}`;
  process.stderr.write(`chạy: ${cmd}\n`);
  const r = spawnSync('bash', ['-c', cmd], { cwd: ROOT, encoding: 'utf8' });
  const rc = r.status === null ? 124 : r.status;
  if (rc !== 0) anyRed += 1;
  const ts = new Date().toISOString();     // ĐO tại chỗ, sau khi lệnh kết thúc
  for (const id of ids) {
    lines.push(JSON.stringify({ ts, sha, round: ROUND, evalId: id, run_id: runId, exit_code: rc, cmd }));
  }
  process.stderr.write(`  → exit ${rc} (${ids.length} eval: ${ids.join(' ')})\n`);
}

const out = path.join(HERE, 'run-log.jsonl');
if (DRY) {
  process.stdout.write(lines.join('\n') + '\n');
} else {
  fs.appendFileSync(out, lines.join('\n') + '\n');   // APPEND, không ghi đè
  process.stdout.write(`ghi-so-chay: noi them ${lines.length} dong vao ${path.relative(ROOT, out)} (round ${ROUND}, ${byCmd.size} luot chay, ${anyRed} luot DO)\n`);
}
process.exit(0);

#!/usr/bin/env node
// ghi-so-chay-1a.mjs — sinh sổ chạy cho hồ sơ `cat-hinh-thuc` BẰNG PHÉP ĐO.
//
// Ba luật giữ nguyên của bản 1b (`luu-kho-.../ghi-so-chay.mjs`), vì chúng là
// bài học đã trả giá ở vòng rà soát đối kháng vòng 1 của hồ sơ ấy:
//   (a) APPEND-ONLY — không lượt nào ghi đè lượt nào, kể cả lượt ĐỎ.
//   (b) Mốc giờ và mã thoát ĐO TẠI CHỖ, mỗi lệnh vật lý đúng một lần chạy.
//   (c) Danh sách eval SUY TỪ `evals.yaml` + `config.yaml`, không gõ lại.
//
// KHÁC bản 1b ở đúng một chỗ, và đó là lý do tệp này tồn tại chứ không phải
// gọi lại tệp kia: **hồ sơ này có 4 eval `executor: judgment`** (E3b, E7, E8,
// E9) — chúng do NGƯỜI/JUDGE chấm, không có `cmd:` nào để chạy. Bản 1b
// fail-closed khi gặp eval thiếu `cmd` (đúng cho 1b: mọi eval của nó là máy).
// Ở đây thì luật đúng phải là:
//   · `judgment` → KHÔNG ghi dòng nào. Ghi một dòng `exit_code: 0` cho phép đo
//     chưa ai chấm là bịa bằng chứng — sổ chạy sẽ tuyên "đã đo" cho thứ mới chỉ
//     được liệt kê. Chúng được in ra stderr và đếm vào dòng tổng kết để việc
//     "còn 4 eval chờ người" là thứ ĐỌC THẤY, không phải thứ im lặng.
//   · eval không `cmd` mà cũng không `judgment` → CHẾT TO (exit 2). Đó là hồ sơ
//     hỏng, không phải trường hợp hợp lệ.
//
// Hai tệp trùng ~70% và đó là chủ ý: script của hồ sơ chết theo hồ sơ khi
// merge, nên tệp này KHÔNG được phụ thuộc vào tệp của 1b (xem mục KHAI GIỚI HẠN
// trong contract.md — cùng lý do, ngược chiều quyết định với ba eval số ca).
//
// Dùng:  node ghi-so-chay-1a.mjs --round 1 [--dry-run]

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
  console.error('ghi-so-chay-1a: --round <n> là bắt buộc (n nguyên ≥ 1)');
  process.exit(2);
}

// ── Đọc evals.yaml: bộ ba (id, executor, cmd) ────────────────────────────────
const evalsText = fs.readFileSync(path.join(HERE, 'evals.yaml'), 'utf8');
const pairs = [];
{
  let cur = null;
  for (const raw of evalsText.split('\n')) {
    const mId = raw.match(/^\s*-\s+id:\s*(\S+)\s*$/);
    if (mId) { cur = { id: mId[1], executor: null, cmd: null }; pairs.push(cur); continue; }
    const mEx = raw.match(/^\s*executor:\s*(\S+)\s*$/);
    if (mEx && cur && !cur.executor) cur.executor = mEx[1];
    const mCmd = raw.match(/^\s*cmd:\s*(\S+)\s*$/);
    if (mCmd && cur && !cur.cmd) cur.cmd = mCmd[1];
  }
}
if (!pairs.length) {
  console.error('ghi-so-chay-1a: không rút được eval nào từ evals.yaml');
  process.exit(2);
}

const judged = pairs.filter(p => p.executor === 'judgment');
const machine = pairs.filter(p => p.executor !== 'judgment');
const noCmd = machine.filter(p => !p.cmd).map(p => p.id);
if (noCmd.length) {
  console.error(`ghi-so-chay-1a: eval máy nhưng không có cmd: ${noCmd.join(', ')}`);
  process.exit(2);
}
const judgedWithCmd = judged.filter(p => p.cmd).map(p => p.id);
if (judgedWithCmd.length) {
  console.error(`ghi-so-chay-1a: eval judgment lại có cmd: ${judgedWithCmd.join(', ')} — hai vai lẫn nhau`);
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
for (const p of machine) {
  if (!p.cmd.startsWith('config:')) { p.resolved = p.cmd; continue; }
  const resolved = resolveKey(p.cmd);
  if (!resolved) {
    // Fail-closed: một `cmd:` trỏ khoá đã chết mà ghi sổ trót lọt thì cuốn sổ
    // tuyên "đã chạy" cho một lệnh không tồn tại. Chính lớp lỗi E16 đã dẫm.
    console.error(`ghi-so-chay-1a: ${p.id} trỏ ${p.cmd} — KHÔNG có khoá đó trong _acceptance/config.yaml`);
    process.exit(2);
  }
  p.resolved = resolved;
}

// ── Gom theo LỆNH VẬT LÝ, chạy mỗi lệnh đúng một lần ─────────────────────────
// Chín eval của bộ răng dùng CHUNG một lệnh → chúng chia nhau MỘT `run_id`. Đó
// là sự thật: một lượt chạy vật lý phủ chín eval. Bịa ra chín run_id là bịa ra
// chín phép đo.
const byCmd = new Map();
for (const p of machine) {
  if (!byCmd.has(p.resolved)) byCmd.set(p.resolved, []);
  byCmd.get(p.resolved).push(p.id);
}
const sha = spawnSync('git', ['-C', ROOT, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).stdout.trim();
if (!sha) { console.error('ghi-so-chay-1a: không đọc được HEAD'); process.exit(2); }

const lines = [];
let anyRed = 0;
for (const [cmd, ids] of byCmd) {
  const runId = `${SLUG}-r${ROUND}-${crypto.randomBytes(4).toString('hex')}`;
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
if (judged.length) {
  process.stderr.write(`bỏ qua (executor: judgment, chờ người/judge chấm): ${judged.map(p => p.id).join(' ')}\n`);
}

const out = path.join(HERE, 'run-log.jsonl');
if (DRY) {
  process.stdout.write(lines.join('\n') + '\n');
} else {
  fs.appendFileSync(out, lines.join('\n') + '\n');   // APPEND, không ghi đè
  process.stdout.write(
    `ghi-so-chay-1a: noi them ${lines.length} dong vao ${path.relative(ROOT, out)} ` +
    `(round ${ROUND}, ${byCmd.size} luot chay, ${anyRed} luot DO, ${judged.length} eval judgment chua cham)\n`
  );
}
process.exit(0);

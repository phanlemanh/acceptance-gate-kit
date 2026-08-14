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
// gọi lại tệp kia: **hồ sơ này có eval `executor: judgment`** — chúng do
// NGƯỜI/JUDGE chấm, không có `cmd:` nào để chạy. (Vòng thu phạm vi 14/08 đưa
// E7/E8/E9 sang hồ sơ 1c; còn lại đúng một: E3b.) Bản 1b
// fail-closed khi gặp eval thiếu `cmd` (đúng cho 1b: mọi eval của nó là máy).
// Ở đây thì luật đúng phải là:
//   · `judgment` → KHÔNG ghi dòng nào. Ghi một dòng `exit_code: 0` cho phép đo
//     chưa ai chấm là bịa bằng chứng — sổ chạy sẽ tuyên "đã đo" cho thứ mới chỉ
//     được liệt kê. Chúng được in ra stderr và đếm vào dòng tổng kết để việc
//     "còn <n> eval chờ người" là thứ ĐỌC THẤY, không phải thứ im lặng.
//   · eval không `cmd` mà cũng không `judgment` → CHẾT TO (exit 2). Đó là hồ sơ
//     hỏng, không phải trường hợp hợp lệ.
//
// Hai tệp trùng ~70% và đó là chủ ý: script của hồ sơ chết theo hồ sơ khi
// merge, nên tệp này KHÔNG được phụ thuộc vào tệp của 1b (xem mục KHAI GIỚI HẠN
// trong contract.md — cùng lý do, ngược chiều quyết định với ba eval số ca).
//
// ── [VÒNG SỬA 1 — 13/08] LUẬT CHỨNG-NHÂN-RIÊNG, đóng H1 cả lớp ───────────────
// Rà soát đối kháng vòng 1 tìm ra: E2 hứa 8 tổ hợp đọc-cũ + round-trip, và bộ
// răng KHÔNG có một dòng mã nào cho nó — nhưng sổ chạy đóng dấu `exit_code: 0`
// cho E2 ở cả ba vòng. Vì sao trót lọt: chín eval dùng CHUNG một `cmd:`, và bản
// cũ của tệp này gán **rc của một lượt chạy vật lý cho MỌI eval-id trong nhóm**.
// Eval nào không có chân nào trong script vẫn hưởng màu xanh của tám eval kia.
// Đó không phải một chân hỏng; đó là một lỗ CẤU TRÚC ở đúng bộ ghi sổ.
//
// Ba luật mới, tất cả FAIL-CLOSED:
//   (1) Mọi eval MÁY phải khai `pinned:` với **≥1 chuỗi**. Không khai → chết to.
//       (Bản 1b cho khai rỗng; ở đây thì không, vì chính lỗ H1 là "eval không có
//       chứng nhân nào".)
//   (2) Trong CÙNG một nhóm-lệnh, mỗi eval phải có **≥1 chuỗi RIÊNG** — chuỗi
//       không eval nào khác trong nhóm khai. Thiếu → chết to. Không có luật này
//       thì mọi eval khai chung một câu tổng kết ("tất cả phép đo xanh") là đủ
//       xanh, tức lỗ H1 quay lại dưới lớp da khác.
//   (3) Chuỗi khai mà KHÔNG có trong đầu ra thật của lượt chạy → eval ĐỎ, kể cả
//       khi lệnh thoát 0; recorder thoát 1. Đây là chỗ E2 sẽ tự lộ ngay lượt
//       chạy đầu nếu chân đo của nó chưa được cài.
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

// ── Đọc evals.yaml: bộ bốn (id, executor, cmd, pinned) ───────────────────────
const evalsText = fs.readFileSync(path.join(HERE, 'evals.yaml'), 'utf8');
const pairs = [];
{
  let cur = null, inPinned = false;
  for (const raw of evalsText.split('\n')) {
    const mId = raw.match(/^\s*-\s+id:\s*(\S+)\s*$/);
    if (mId) { cur = { id: mId[1], executor: null, cmd: null, pinned: null }; pairs.push(cur); inPinned = false; continue; }
    const mEx = raw.match(/^\s*executor:\s*(\S+)\s*$/);
    if (mEx && cur && !cur.executor) cur.executor = mEx[1];
    const mCmd = raw.match(/^\s*cmd:\s*(\S+)\s*$/);
    if (mCmd && cur && !cur.cmd) cur.cmd = mCmd[1];
    if (/^\s*pinned:\s*$/.test(raw)) { inPinned = true; if (cur) cur.pinned = []; continue; }
    if (inPinned) {
      const mItem = raw.match(/^\s*-\s+"(.*)"\s*$/);
      if (mItem && cur) { cur.pinned.push(mItem[1]); continue; }
      // Dòng danh-sách dưới `pinned:` mà không đúng khuôn có-nháy: CHẾT TO.
      // Bỏ qua im lặng là fail-OPEN với YAML hợp lệ — eval mất lời hứa mà sổ
      // vẫn xanh. (Bài học G5 của hồ sơ 1b, chép sang vì cùng lớp.)
      if (/^\s*-\s+/.test(raw)) {
        console.error(`ghi-so-chay-1a: dong pinned KHONG dung khuon (phai la - "chuoi"): ${raw.trim()} (eval ${cur ? cur.id : '?'})`);
        process.exit(2);
      }
      inPinned = false;
    }
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
// LUẬT (1): eval máy phải có ≥1 chuỗi ghim. Đây là chỗ H1 chết.
const noPin = machine.filter(p => !p.pinned || p.pinned.length === 0).map(p => p.id);
if (noPin.length) {
  console.error(`ghi-so-chay-1a: eval máy KHÔNG khai 'pinned:' (hoặc khai rỗng): ${noPin.join(', ')} — eval khong co chung nhan nao trong dau ra`);
  process.exit(2);
}
const judgedWithPin = judged.filter(p => p.pinned).map(p => p.id);
if (judgedWithPin.length) {
  console.error(`ghi-so-chay-1a: eval judgment lại khai pinned: ${judgedWithPin.join(', ')} — khong co luot chay nao de doi chieu`);
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

// LUẬT (2): CHỨNG-NHÂN-RIÊNG trong nhóm-lệnh. Chín eval chia nhau một lượt chạy
// vật lý là sự thật, nhưng khi ấy `exit_code` chung KHÔNG phân biệt được chín
// eval — nó chỉ nói "lệnh thoát 0". Cái phân biệt chúng phải là chuỗi ghim, và
// chuỗi ấy phải RIÊNG: eval nào chỉ khai những chuỗi mà eval khác cùng nhóm
// cũng khai thì nó chưa có chứng nhân nào của riêng nó — đúng tình trạng H1.
{
  const idToPin = new Map(machine.map(p => [p.id, p.pinned]));
  const thieuRieng = [];
  for (const ids of byCmd.values()) {
    if (ids.length < 2) continue;
    for (const id of ids) {
      const cua_toi = idToPin.get(id);
      const cua_nguoi_khac = new Set(ids.filter(x => x !== id).flatMap(x => idToPin.get(x)));
      if (!cua_toi.some(s => !cua_nguoi_khac.has(s))) thieuRieng.push(id);
    }
  }
  if (thieuRieng.length) {
    console.error(
      `ghi-so-chay-1a: eval KHONG co chuoi ghim RIENG trong nhom-lenh: ${thieuRieng.join(', ')} — ` +
      `chung dang huong mau xanh cua eval khac (lop loi H1)`
    );
    process.exit(2);
  }
}

const sha = spawnSync('git', ['-C', ROOT, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).stdout.trim();
if (!sha) { console.error('ghi-so-chay-1a: không đọc được HEAD'); process.exit(2); }

const byId = new Map(machine.map(p => [p.id, p]));
const lines = [];
let anyRed = 0;
const thieuGhim = [];   // [{evalId, chuoi}] — lời hứa thông điệp KHÔNG có trong đầu ra
for (const [cmd, ids] of byCmd) {
  const runId = `${SLUG}-r${ROUND}-${crypto.randomBytes(4).toString('hex')}`;
  process.stderr.write(`chạy: ${cmd}\n`);
  const r = spawnSync('bash', ['-c', cmd], { cwd: ROOT, encoding: 'utf8' });
  const rc = r.status === null ? 124 : r.status;
  if (rc !== 0) anyRed += 1;
  const ts = new Date().toISOString();     // ĐO tại chỗ, sau khi lệnh kết thúc
  const full = `${r.stdout || ''}${r.stderr || ''}`;
  // `output` nằm trong `evidence_required` của mọi eval. Giữ nguyên đầu ra bốn
  // bộ kiểm thì sổ phình hàng trăm KB mỗi vòng — nên ghi ĐUÔI có giới hạn + băm
  // toàn phần + số byte, và nói THẲNG là đã cắt.
  const TAIL = 4000;
  const outMeta = {
    output: full.length > TAIL ? full.slice(-TAIL) : full,
    output_bytes: full.length,
    output_truncated: full.length > TAIL,
    output_sha256: crypto.createHash('sha256').update(full).digest('hex'),
  };
  for (const id of ids) {
    // LUẬT (3): đối chiếu lời hứa với đầu ra THẬT của chính lượt chạy này.
    const pinned = byId.get(id).pinned;
    const missing = pinned.filter(s => !full.includes(s));
    for (const s of missing) thieuGhim.push({ evalId: id, chuoi: s });
    lines.push(JSON.stringify({
      ts, sha, round: ROUND, evalId: id, run_id: runId, exit_code: rc, cmd,
      ...outMeta, pinned, pinned_missing: missing,
    }));
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
    `(round ${ROUND}, ${byCmd.size} luot chay, ${anyRed} luot DO, ` +
    `${thieuGhim.length} loi hua thong diep KHONG khop, ${judged.length} eval judgment chua cham)\n`
  );
}
// FAIL-CLOSED. Eval hứa đầu ra có chuỗi X mà lượt chạy không in X thì eval ấy
// ĐỎ — kể cả khi lệnh thoát 0. Đây là chỗ H1 không thể tái sinh.
if (thieuGhim.length) {
  process.stderr.write('ghi-so-chay-1a: LOI HUA THONG DIEP KHONG KHOP (eval DO du lenh thoat 0):\n');
  for (const t of thieuGhim) process.stderr.write(`  ${t.evalId}: khong tim thay "${t.chuoi}" trong dau ra\n`);
  process.exit(1);
}
if (anyRed > 0) {
  process.stderr.write(`ghi-so-chay-1a: ${anyRed} luot chay DO — so da ghi, recorder thoat 1\n`);
  process.exit(1);
}
process.exit(0);

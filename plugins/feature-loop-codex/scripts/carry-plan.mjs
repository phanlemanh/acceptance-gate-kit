#!/usr/bin/env node
// carry-plan.mjs — biến quy tắc carry P1 (Đợt 5 + mở rộng round fix của
// delta-verify-repin) thành phép tính máy-kiểm-được. Main loop gọi ở bước
// chuẩn-bị-args S4 của ROUND FIX sau REJECT:
//
//   node carry-plan.mjs --run-log <p> --evals <p> --contract <p> \
//        --delta-files <f1,f2,...> --round <N>
//
// stdout JSON: { anchorSha, carriedEvals:[{id,runId,fromRound,verifiedAt,cmd}],
//               rerun:[id...], reason:{id:"vì sao"} }
// exit 0 = có kế hoạch carry; exit 3 = KHÔNG carry (dòng round trước thiếu
// field sha, hoặc sha không thuần nhất — lịch sử cũ, full re-run là mặc định
// an toàn); exit 2 = usage/file lỗi. Suite commands KHÔNG thuộc phạm vi file
// này — SKILL luôn bắt chạy lại suite. Judgment đi đường P3, không ở đây.
import fs from 'node:fs';
import { realpathSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

function parseArgs(argv) {
  const a = {};
  for (let i = 0; i < argv.length; i += 2) {
    if (!argv[i].startsWith('--') || argv[i + 1] === undefined) return null;
    a[argv[i].slice(2)] = argv[i + 1];
  }
  return a;
}

// glob → RegExp: cùng ngữ nghĩa với matcher paths của kit (** xuyên thư mục,
// * trong một cấp, ? một ký tự) — anchor trọn chuỗi.
function globToRe(g) {
  let re = '';
  for (let i = 0; i < g.length; i++) {
    const c = g[i];
    if (c === '*') {
      if (g[i + 1] === '*') { re += '.*'; i++; if (g[i + 1] === '/') i++; }
      else re += '[^/]*';
    } else if (c === '?') re += '[^/]';
    else if ('.+^$()[]{}|\\'.includes(c)) re += '\\' + c;
    else re += c;
  }
  return new RegExp('^' + re + '$');
}

// Parser evals.yaml tối giản cho đúng các field carry cần (id/criterion/
// executor/cmd/paths) — cùng hình dạng subset mà eval-coverage-lint hiểu.
function parseEvals(text) {
  const evals = []; let cur = null;
  for (const raw of text.split('\n')) {
    const m = raw.match(/^\s*-\s+id:\s*(\S+)/);
    if (m) { cur = { id: m[1] }; evals.push(cur); continue; }
    if (!cur) continue;
    let f;
    if ((f = raw.match(/^\s+criterion:\s*(\S+)/))) cur.criterion = f[1];
    else if ((f = raw.match(/^\s+executor:\s*(\S+)/))) cur.executor = f[1];
    else if ((f = raw.match(/^\s+cmd:\s*"?([^"\n]+)"?\s*$/))) cur.cmd = f[1].trim();
    else if ((f = raw.match(/^\s+paths:\s*\[(.*)\]\s*$/)))
      cur.paths = f[1].split(',').map(s => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
  }
  return evals;
}

// Criterion mang dấu (cross-layer) trong contract → atomic-pair. Cùng ngữ
// nghĩa với parser chuẩn (eval-coverage-lint parseACs): bullet -/*, cho phép
// thụt lề, `:` hoặc `.`, tag không phân biệt hoa thường và có thể nằm ở dòng
// NỐI của bullet (finding S4-r1: parser thứ hai lệch chuẩn → atomic-pair tắt
// im lặng — false-green).
function crossLayerACs(contract) {
  const out = new Set();
  let cur = null, buf = '';
  const flush = () => { if (cur && /\(cross-layer\)/i.test(buf)) out.add(cur); };
  for (const line of contract.split('\n')) {
    const m = line.match(/^\s*[-*]\s*(AC-\d+)\s*[:.]/);
    if (m) { flush(); cur = m[1]; buf = line; }
    else if (/^#{1,6}\s/.test(line)) { flush(); cur = null; buf = ''; }
    else if (cur) buf += ' ' + line;
  }
  flush();
  return out;
}

export function plan({ runLogText, evalsText, contractText, deltaFiles, round }) {
  const evals = parseEvals(evalsText).filter(e => e.executor !== 'judgment');
  const xACs = crossLayerACs(contractText);
  const prevRound = round - 1;
  const lines = runLogText.split('\n').filter(Boolean).map(l => { try { return JSON.parse(l); } catch (_) { return null; } }).filter(Boolean);
  const evalLines = lines.filter(l => l.evalId && !l.kind);
  const lastOfPrev = new Map();
  for (const l of evalLines) if (l.round === prevRound) lastOfPrev.set(l.evalId, l);

  // Mặc định an toàn (AC-8): BẤT KỲ dòng round trước nào thiếu sha, hoặc sha
  // không thuần nhất → không carry gì hết.
  const shas = new Set([...lastOfPrev.values()].map(l => l.sha));
  if (lastOfPrev.size === 0 || shas.has(undefined) || shas.size !== 1) return { noCarry: true };
  const anchorSha = [...shas][0];

  const carried = []; const rerun = []; const reason = {};
  for (const e of evals) {
    const prev = lastOfPrev.get(e.id);
    if (!prev) { rerun.push(e.id); reason[e.id] = 'không có dòng round trước'; continue; }
    if (!Array.isArray(e.paths) || !e.paths.length) { rerun.push(e.id); reason[e.id] = 'thiếu paths — luôn chạy lại'; continue; }
    if (prev.exit_code !== 0) { rerun.push(e.id); reason[e.id] = 'round trước không xanh'; continue; }
    const res = e.paths.map(globToRe);
    const hit = deltaFiles.find(f => res.some(r => r.test(f)));
    if (hit) { rerun.push(e.id); reason[e.id] = `diff-fix chạm ${hit}`; continue; }
    const fromRound = typeof prev.carried_from_round === 'number' ? prev.carried_from_round : prev.round;
    let verifiedAt = prev.ts;
    if (typeof prev.carried_from_round === 'number') {
      const origin = evalLines.find(l => l.evalId === e.id && l.round === prev.carried_from_round && l.run_id === prev.run_id);
      if (origin) verifiedAt = origin.ts;
    }
    carried.push({ id: e.id, runId: prev.run_id, fromRound, verifiedAt, cmd: prev.cmd || e.cmd || '' });
    reason[e.id] = 'paths không chạm diff-fix, round trước xanh';
  }

  // Atomic-pair (AC-9): criterion (cross-layer) — một thành viên rerun → CẢ CẶP.
  for (const ac of xACs) {
    const members = evals.filter(e => e.criterion === ac).map(e => e.id);
    if (members.some(id => rerun.includes(id))) {
      for (const id of members) {
        if (rerun.includes(id)) continue;
        const i = carried.findIndex(c => c.id === id);
        if (i >= 0) carried.splice(i, 1);
        rerun.push(id); reason[id] = `atomic-pair: criterion ${ac} (cross-layer) có thành viên phải chạy lại`;
      }
    }
  }
  return { anchorSha, carriedEvals: carried, rerun, reason };
}

const isMain = (() => {
  try { return realpathSync(fileURLToPath(import.meta.url)) === realpathSync(process.argv[1] || ''); }
  catch (_) { return false; }
})();

if (isMain) {
  const a = parseArgs(process.argv.slice(2));
  if (!a || !a['run-log'] || !a.evals || !a.contract || !a.round) {
    process.stderr.write('carry-plan: usage: carry-plan.mjs --run-log <p> --evals <p> --contract <p> --delta-files <f1,f2,...> --round <N>\n');
    process.exit(2);
  }
  let runLogText, evalsText, contractText;
  try {
    runLogText = fs.readFileSync(a['run-log'], 'utf8');
    evalsText = fs.readFileSync(a.evals, 'utf8');
    contractText = fs.readFileSync(a.contract, 'utf8');
  } catch (e) { process.stderr.write(`carry-plan: cannot read input: ${e.message}\n`); process.exit(2); }
  const round = parseInt(a.round, 10);
  if (!Number.isInteger(round) || round < 2) { process.stderr.write('carry-plan: --round phải là số nguyên ≥ 2 (round fix)\n'); process.exit(2); }
  const deltaFiles = (a['delta-files'] || '').split(',').map(s => s.trim()).filter(Boolean);
  const r = plan({ runLogText, evalsText, contractText, deltaFiles, round });
  if (r.noCarry) {
    process.stderr.write('carry-plan: dòng run-log round trước thiếu field sha (hoặc sha không thuần nhất) — lịch sử cũ, full re-run là mặc định an toàn\n');
    process.exit(3);
  }
  process.stdout.write(JSON.stringify(r, null, 2) + '\n');
}

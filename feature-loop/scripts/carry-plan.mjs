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
import path from 'node:path';
import { realpathSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

// MỘT bộ đọc dùng chung với `s4-args.mjs` cho CÙNG trường `paths:` của CÙNG
// `evals.yaml`. Trước 2.11.0 tệp này tự bóc nháy bằng mệnh đề cũ, nên hai bên
// trả hai chuỗi KHÁC nhau — và vì `paths` ở đây biến thành glob quyết eval nào
// được CARRY-FORWARD, một glob mang ký tự thừa không khớp file nào và eval
// được mang màu xanh cũ sang lượt mới dù file thật đã đổi (chiều FAIL-OPEN).
// Lượt chấm 1 của hồ sơ release-2-11-0 đo được; AC-10 giữ chỗ này.
// `--ag-root` là đường TƯỜNG MINH (s4-args luôn truyền). Vắng cờ thì suy từ vị
// trí CHÍNH tệp này — kho tự host có `lib/evidence-core.cjs` ngay ở gốc. Không
// tìm thấy ở đâu cả thì fail-CLOSED CÓ TÊN: thà dừng còn hơn im lặng rơi về
// một bản chép trong tệp này, vì đúng cái đó là lớp lỗi AC-10 đóng.
let SHARED = null;
function readers(agRoot) {
  if (SHARED) return SHARED;
  const HERE = path.dirname(fileURLToPath(import.meta.url));
  const ung = [agRoot, path.resolve(HERE, '..', '..')].filter(Boolean)
    .map(r => path.resolve(r, 'lib', 'evidence-core.cjs'));
  const req = createRequire(import.meta.url);
  let core = null; const vet = [];
  for (const c of ung) {
    if (!fs.existsSync(c)) { vet.push(`${c} (không có)`); continue; }
    try { core = req(c); break; } catch (e) { vet.push(`${c} (${String(e.message).split('\n')[0]})`); }
  }
  if (!core) die3(`không nạp được lib/evidence-core.cjs — đã thử: ${vet.join(' · ')}; truyền --ag-root <gốc plugin acceptance-gate>`);
  for (const n of ['parseFlowValue'])
    if (typeof core[n] !== 'function') die3(`acceptance-gate quá cũ: lib/evidence-core.cjs không có ${n} (cần >= 2.11.0) — truyền --ag-root trỏ bản >= 2.11.0`);
  SHARED = core;
  return SHARED;
}
function die3(msg) { process.stderr.write(`carry-plan: ${msg}\n`); process.exit(2); }

// Cờ được nhận DIỆN — một chỗ duy nhất. Cờ lạ (kể cả gõ lệch dấu gạch, vd
// `--delta_files`) PHẢI nổ: bản trước im lặng nhận mọi tên, nên một lần gõ sai
// biến thành "không có delta" = mang sang TOÀN BỘ với mã thoát 0 (S4-r3).
const KNOWN_FLAGS = new Set(['run-log', 'evals', 'contract', 'delta-files', 'round', 'no-delta', 'ag-root']);
function parseArgs(argv) {
  const a = {}; const unknown = [];
  for (let i = 0; i < argv.length; i += 1) {
    const tok = argv[i];
    if (!tok.startsWith('--')) return { __error: `tham số lạ (không phải cờ): ${tok}` };
    const name = tok.slice(2);
    if (!KNOWN_FLAGS.has(name)) {
      unknown.push(tok);
      // tiêu thụ giá trị đi kèm (nếu có) — không tiêu thụ thì vòng kế vấp
      // vào giá trị và báo "tham số lạ: <đường dẫn>", trỏ sai ngón tay về
      // phía file thay vì về cái cờ viết sai (AC-3 measure-teeth-cleanup)
      if (argv[i + 1] !== undefined && !argv[i + 1].startsWith('--')) i += 1;
      continue;
    }
    if (name === 'no-delta') { a[name] = true; continue; }   // cờ không nhận giá trị
    if (argv[i + 1] === undefined || argv[i + 1].startsWith('--')) {
      return { __error: `cờ ${tok} thiếu giá trị` };
    }
    a[name] = argv[i + 1]; i += 1;
  }
  if (unknown.length) return { __error: `cờ không nhận diện được: ${unknown.join(' ')}` };
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
function parseEvals(text, R) {
  const evals = []; let cur = null;
  for (const raw of text.split('\n')) {
    const m = raw.match(/^\s*-\s+id:\s*(\S+)/);
    if (m) { cur = { id: m[1] }; evals.push(cur); continue; }
    if (!cur) continue;
    let f;
    if ((f = raw.match(/^\s+criterion:\s*(\S+)/))) cur.criterion = f[1];
    else if ((f = raw.match(/^\s+executor:\s*(\S+)/))) cur.executor = f[1];
    else if ((f = raw.match(/^\s+cmd:\s*(\S.*)$/))) cur.cmd = R.parseFlowValue(f[1]).value;
    else if ((f = raw.match(/^\s+paths:\s*(\[.*)$/))) {
      const pv = R.parseFlowValue(f[1]);
      if (pv.kind === 'seq') cur.paths = pv.items;
    }
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

export function plan({ runLogText, evalsText, contractText, deltaFiles, round, agRoot }) {
  const R = readers(agRoot);
  const evals = parseEvals(evalsText, R).filter(e => e.executor !== 'judgment');
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
  const USAGE = 'carry-plan: usage: carry-plan.mjs --run-log <p> --evals <p> --contract <p> --round <N> [--ag-root <p>] (--delta-files <f1,f2,...> | --no-delta)\n';
  if (!a || a.__error) {
    process.stderr.write(`carry-plan: ${a && a.__error ? a.__error : 'không đọc được tham số'}\n` + USAGE);
    process.exit(2);
  }
  if (!a['run-log'] || !a.evals || !a.contract || !a.round) {
    process.stderr.write(USAGE); process.exit(2);
  }
  // --delta-files BẮT BUỘC. "Bản sửa không chạm file nào" là một khẳng định
  // mạnh (nó cho phép mang sang TẤT CẢ), nên phải nói ra bằng --no-delta chứ
  // không được suy từ việc THIẾU tham số hay từ một chuỗi rỗng (S4-r3: bỏ cờ
  // hay gõ lệch tên đều cho 12/12 mang sang, chạy lại 0, mã thoát 0).
  const hasDelta = a['delta-files'] !== undefined;
  if (hasDelta === Boolean(a['no-delta'])) {
    process.stderr.write('carry-plan: phải nêu ĐÚNG MỘT trong --delta-files <danh sách> hoặc --no-delta (khai rõ bản sửa không chạm file nào)\n' + USAGE);
    process.exit(2);
  }
  if (hasDelta && !String(a['delta-files']).split(',').map(s => s.trim()).filter(Boolean).length) {
    process.stderr.write('carry-plan: --delta-files rỗng — nếu bản sửa thật sự không chạm file nào thì dùng --no-delta\n' + USAGE);
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
  const r = plan({ runLogText, evalsText, contractText, deltaFiles, round, agRoot: a['ag-root'] });
  if (r.noCarry) {
    process.stderr.write('carry-plan: dòng run-log round trước thiếu field sha (hoặc sha không thuần nhất) — lịch sử cũ, full re-run là mặc định an toàn\n');
    process.exit(3);
  }
  process.stdout.write(JSON.stringify(r, null, 2) + '\n');
}

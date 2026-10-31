#!/usr/bin/env node
// carry-plan.mjs — biến quy tắc carry P1 (Đợt 5 + mở rộng round fix của
// delta-verify-repin) thành phép tính máy-kiểm-được. Main loop gọi ở bước
// chuẩn-bị-args S4 của ROUND FIX sau REJECT:
//
//   node carry-plan.mjs --run-log <p> --evals <p> --contract <p> \
//        --delta-files <f1,f2,...> --round <N>
//
// stdout JSON: { anchorSha, carriedEvals:[{id,runId,fromRound,verifiedAt,cmd}], carriedFindings:[{…,tepDoi}],
//               rerun:[id...], reason:{id:"vì sao"} }
// Mang sang khi ĐỦ: paths không chạm diff-fix · lượt trước xanh · định nghĩa (khối eval + chữ
// tiêu chí) ở lượt gốc BẰNG hôm nay — đọc lại bằng `git show <sha lượt gốc>` (cham-lai-khong-tu-doi).
// exit 0 = có kế hoạch carry; exit 3 = KHÔNG carry (dòng round trước thiếu
// field sha, hoặc sha không thuần nhất — lịch sử cũ, full re-run là mặc định
// an toàn); exit 2 = usage/file lỗi. Suite commands KHÔNG thuộc phạm vi file
// này — SKILL luôn bắt chạy lại suite. Judgment đi đường P3, không ở đây.
import fs from 'node:fs';
import path from 'node:path';
import { realpathSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';

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
  let core = null; let corePath = null; const vet = [];
  for (const c of ung) {
    if (!fs.existsSync(c)) { vet.push(`${c} (không có)`); continue; }
    try { core = req(c); corePath = c; break; } catch (e) { vet.push(`${c} (${String(e.message).split('\n')[0]})`); }
  }
  if (!core) die3(`không nạp được lib/evidence-core.cjs — đã thử: ${vet.join(' · ')}; truyền --ag-root <gốc plugin acceptance-gate>`);
  for (const n of ['parseFlowValue', 'machineEvalIdsSkipped', 'evalListsOf'])
    if (typeof core[n] !== 'function') die3(`acceptance-gate quá cũ: lib/evidence-core.cjs không có ${n} — truyền --ag-root trỏ bản acceptance-gate có hàm ấy`);
  // Chữ tiêu chí đọc bằng CÙNG bộ bóc của thẻ và lint (lib/ac-line.cjs, cạnh evidence-core) —
  // không tự viết bộ thứ hai cho dấu vân tay định nghĩa.
  const acPath = path.join(path.dirname(corePath), 'ac-line.cjs');
  let ac = null;
  try { ac = req(acPath); } catch (e) { die3(`không nạp được ${acPath}: ${String(e.message).split('\n')[0]}`); }
  if (typeof ac.parseACBlock !== 'function') die3('acceptance-gate quá cũ: lib/ac-line.cjs không có parseACBlock');
  SHARED = { ...core, parseACBlock: ac.parseACBlock };
  return SHARED;
}
function die3(msg) { process.stderr.write(`carry-plan: ${msg}\n`); process.exit(2); }

// Luật hình dạng run_id — MỘT nguồn: khối RUN-ID-HINH của bộ chấm (feature-loop/workflows/acceptance-verify.js),
// chỗ đúc mã lượt (hồ sơ run-id-danh-sach-cho-phep, #467). Bộ chấm chạy trong hộp cát không nạp được thư viện,
// nên tệp này RÚT khối từ bộ chấm cùng gói (đường suy từ vị trí chính tệp này), không chép biểu thức. Rút không
// được → dừng có tên: thà dừng còn hơn mang sang một mã mà bộ chấm sẽ không bao giờ ghi.
let HINH = null;
export function hinhRunId() {
  if (HINH) return HINH;
  const f = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'workflows', 'acceptance-verify.js');
  let src = '';
  try { src = fs.readFileSync(f, 'utf8'); } catch (_) { /* vắng tệp → khớp rỗng → dừng có tên dưới */ }
  const m = src.match(/\/\/ <<<RUN-ID-HINH\n([\s\S]*?)\/\/ RUN-ID-HINH>>>/);
  let re = null;
  if (m) { try { re = new Function(`${m[1]}; return RUN_ID_HINH;`)(); } catch (_) { re = null; } }
  if (!(re instanceof RegExp)) die3(`không rút được luật hình dạng run_id (khối RUN-ID-HINH) từ ${f}`);
  HINH = re;
  return HINH;
}

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
// * trong một cấp, ? một ký tự, `[[]`/`[]]` là ngoặc thật) — anchor trọn chuỗi.
// XUẤT ra vì `s4-args.mjs` dùng CHÍNH hàm này cho bộ lọc vùng vật (T2): hai bản
// khớp glob là hai khuôn sẽ trôi, và phép đo VV4 rút từ đây để đo round-trip.
export function globToRe(g) {
  let re = '';
  for (let i = 0; i < g.length; i++) {
    const c = g[i];
    if (c === '*') {
      if (g[i + 1] === '*') { re += '.*'; i++; if (g[i + 1] === '/') i++; }
      else re += '[^/]*';
    } else if (c === '?') re += '[^/]';
    else if (c === '[' && (g.startsWith('[[]', i) || g.startsWith('[]]', i))) { re += '\\' + g[i + 1]; i += 2; }
    else if ('.+^$()[]{}|\\'.includes(c)) re += '\\' + c;
    else re += c;
  }
  return new RegExp('^' + re + '$');
}

// Parser evals.yaml tối giản cho đúng các field carry cần (id/criterion/
// executor/cmd) — cùng hình dạng subset mà eval-coverage-lint hiểu. `paths` đi qua
// MỘT bộ đọc ở lib (evalListsOf, hồ sơ evals-sat-le-doc-du): bản trước chỉ nhận
// `[...]` một dòng nên mọi `paths` dạng khối thành «thiếu paths — luôn chạy lại».
function parseEvals(text, R) {
  const evals = []; let cur = null;
  for (const raw of text.split('\n')) {
    const m = raw.match(/^\s*-\s+id:\s*(\S+)/);
    if (m) { cur = { id: R.parseFlowValue(m[1]).value }; evals.push(cur); continue; }
    if (!cur) continue;
    let f;
    if ((f = raw.match(/^\s+criterion:\s*(\S+)/))) cur.criterion = f[1];
    else if ((f = raw.match(/^\s+executor:\s*(\S+)/))) cur.executor = f[1];
    else if ((f = raw.match(/^\s+cmd:\s*(\S.*)$/))) cur.cmd = R.parseFlowValue(f[1]).value;
  }
  const { byId } = R.evalListsOf(text, ['paths']);
  for (const e of evals) { const f = byId.get(e.id); if (f && Array.isArray(f.paths) && f.paths.length) e.paths = f.paths; }
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

// ── Dấu vân tay ĐỊNH NGHĨA của một eval (hồ sơ cham-lai-khong-tu-doi) ──────────
// Mang sang chỉ đúng khi eval lượt này HỎI CÙNG câu với lần nó thật sự chạy. `paths` trả lời
// «vật đo có đổi không», không trả lời «thước có đổi không»: crm goi-y-mo-ke-hoach (DA3b, 16/10)
// đổi `expected` của E10 21→22 cùng chữ AC-10 giữa lượt 2 và 3, paths không đổi, E10 mang màu
// xanh cũ sang và tiêu chí mới không có bằng chứng. Dấu vân tay = KHỐI eval nguyên văn (mọi
// trường — cmd · expected · executor · expected_exit · criterion · …; khoảng trắng cuối dòng
// và dòng trống không tính) + chữ tiêu chí nó phục vụ, đọc bằng bộ bóc chung. Khối đổi bất kỳ
// byte nghĩa nào → không mang: sai về phía chạy lại, không bao giờ về phía mang nhầm.
export function khoiEval(text, id, R) {
  const dong = String(text == null ? '' : text).split('\n');
  let dau = -1; let thut = 0;
  for (let i = 0; i < dong.length; i += 1) {
    const m = dong[i].replace(/\t/g, '  ').match(/^(\s*)-\s+id:\s*(\S.*?)\s*$/);
    if (m && R.parseFlowValue(m[2]).value === id) { dau = i; thut = m[1].length; break; }
  }
  if (dau === -1) return null;
  const than = [dong[dau].trimEnd()];
  for (let j = dau + 1; j < dong.length; j += 1) {
    const l = dong[j].replace(/\t/g, '  ');
    if (!l.trim()) continue;
    if (l.search(/\S/) <= thut) break;   // mục kế (`- id:`), khoá cấp trên, hay chú thích ngoài khối
    than.push(l.trimEnd());
  }
  return than.join('\n');
}
export function chuTieuChi(contractText, acId, R) {
  if (!acId) return '';
  return R.parseACBlock(String(contractText || '')).filter(a => a.id === acId).map(a => a.gwt).join(' \u2016 ');
}
// Đọc lại định nghĩa ở MỘT sha — cache theo sha, null khi không đọc được (sha không còn,
// tệp vắng ở sha ấy). Dùng cho CLI; `plan()` nhận hàm này để test thuần không cần git.
export function boDocDinhNghiaGit(evalsPath, contractPath) {
  const thuMuc = path.dirname(path.resolve(evalsPath));
  let goc;
  try { goc = fs.realpathSync(execFileSync('git', ['-C', thuMuc, 'rev-parse', '--show-toplevel'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim()); }
  // Không phải kho git → không có lịch sử nào để so: trả null, `plan()` bỏ phép so và CLI nói ra
  // một dòng. Ca này không có ngoài đời — s4-args đòi git (invokedSha) — chỉ fixture thuần chạm.
  catch { return null; }
  const rel = p => { try { return path.relative(goc, fs.realpathSync(p)).split(path.sep).join('/'); } catch { return null; } };
  const relEvals = rel(evalsPath); const relContract = rel(contractPath);
  const cache = new Map();
  const show = (sha, r) => {
    if (!r || !/^[0-9a-f]{7,64}$/i.test(String(sha || ''))) return null;
    try { return execFileSync('git', ['-C', goc, 'show', `${sha}:${r}`], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 64 * 1024 * 1024 }); }
    catch { return null; }
  };
  return sha => {
    if (!cache.has(sha)) {
      const evalsText = show(sha, relEvals);
      cache.set(sha, evalsText == null ? null : { evalsText, contractText: show(sha, relContract) || '' });
    }
    return cache.get(sha);
  };
}

export function plan({ runLogText, evalsText, contractText, deltaFiles, round, agRoot, dinhNghiaTai }) {
  const R = readers(agRoot);
  // Ô tự khai `status: not-run` không vào kế hoạch carry: CÙNG hàm với s4-args và làn
  // ghim lại (lib/evidence-core.cjs), không chép luật. null = eval-yaml.cjs vắng → dừng có tên.
  const khongChay = R.machineEvalIdsSkipped(evalsText);
  if (khongChay === null) die3('không đọc được lời khai not-run: lib/eval-yaml.cjs vắng cạnh evidence-core.cjs — KHÔNG đoán');
  const evals = parseEvals(evalsText, R).filter(e => e.executor !== 'judgment' && !khongChay.includes(e.id));
  const xACs = crossLayerACs(contractText);
  const prevRound = round - 1;
  const lines = runLogText.split('\n').filter(Boolean).map(l => { try { return JSON.parse(l); } catch (_) { return null; } }).filter(Boolean);
  const evalLines = lines.filter(l => l.evalId && !l.kind);
  const lastOfPrev = new Map();
  for (const l of evalLines) if (l.round === prevRound) lastOfPrev.set(l.evalId, l);

  // T5: MỌI finding NGOÀI hợp đồng ở lượt trước → mang sang, kể cả khi diff-fix chạm tệp
  // của nó (luot-sua-giu-du-dem-dung AC-1). Bản trước bỏ mục có tệp trong diff với giả định
  // «tệp đổi thì lượt sau tự tìm lại» — sai: tìm lỗi là LLM, không tất định, và máy KHÔNG
  // sửa mục ngoài hợp đồng trong lượt sửa. crm don-okr-nhap-sai 07/10 mất ba mục đúng cách
  // ấy, im lặng, ở chính chỗ người phải quyết. Mục trên tệp bị chạm mang `tepDoi: true` để
  // bản findings nói ra «tệp đã đổi» — người gạch nếu nó đã hết.
  // Tính TRƯỚC cửa ngõ `noCarry` bên dưới, có chủ đích: hai đường carry độc lập nhau —
  // `noCarry` nói về SHA của dòng eval, còn dòng `finding` không dùng sha.
  // Trong hợp đồng thì KHÔNG carry: chúng kéo REJECT và máy sửa chúng trong lượt này.
  // Sổ đời cũ không có dòng `finding` → mảng rỗng, không lỗi (đường đọc-cũ).
  const carriedFindings = lines
    .filter(l => l.kind === 'finding' && l.round === prevRound && l.inContract === false
      && !l.unclassified && l.file)
    .map(l => ({ file: l.file, title: l.title, severity: l.severity || '', plain: l.plain || '',
      can_cu: l.can_cu || '', proposal: l.proposal || '', fromRound: typeof l.carried_from_round === 'number' ? l.carried_from_round : l.round,
      tepDoi: deltaFiles.includes(l.file) }));

  // Mặc định an toàn (AC-8): BẤT KỲ dòng round trước nào thiếu sha, hoặc sha
  // không thuần nhất → không carry EVAL nào. Finding vẫn đi theo đường riêng ở trên.
  const shas = new Set([...lastOfPrev.values()].map(l => l.sha));
  if (lastOfPrev.size === 0 || shas.has(undefined) || shas.size !== 1)
    return { noCarry: true, carriedEvals: [], carriedFindings };
  const anchorSha = [...shas][0];

  const carried = []; const rerun = []; const reason = {};
  for (const e of evals) {
    const prev = lastOfPrev.get(e.id);
    if (!prev) { rerun.push(e.id); reason[e.id] = 'không có dòng round trước'; continue; }
    // Sổ cũ của kho tiêu thụ có thể mang mã rác tác tử khai (crm rang-hang-cong-cu E9: «`»). Không mang sang —
    // chạy lại, nói ra một dòng (s4-args in lý do này); không bắt kho sửa sổ (đường đọc-cũ).
    if (!hinhRunId().test(typeof prev.run_id === 'string' ? prev.run_id : '')) {
      rerun.push(e.id); reason[e.id] = `run_id lượt trước sai hình dạng (${JSON.stringify(prev.run_id ?? null)}) — chạy lại`; continue;
    }
    if (!Array.isArray(e.paths) || !e.paths.length) { rerun.push(e.id); reason[e.id] = 'thiếu paths — luôn chạy lại'; continue; }
    if (prev.exit_code !== 0) { rerun.push(e.id); reason[e.id] = 'round trước không xanh'; continue; }
    const res = e.paths.map(globToRe);
    const hit = deltaFiles.find(f => res.some(r => r.test(f)));
    if (hit) { rerun.push(e.id); reason[e.id] = `diff-fix chạm ${hit}`; continue; }
    const fromRound = typeof prev.carried_from_round === 'number' ? prev.carried_from_round : prev.round;
    let verifiedAt = prev.ts;
    // Lượt GỐC = lượt eval thật sự chạy. Dòng mang sang trỏ về nó bằng carried_from_round + run_id;
    // so định nghĩa với lượt gốc, không với lượt mang — sổ đời cũ có thể đã mang nhầm một lần
    // (DA3b: E10 mang ở lượt 3 từ lượt 2), so với lượt mang thì nhầm ấy được hợp thức hoá mãi.
    // Sổ thiếu dòng lượt gốc (cắt cụt) → so với sha của dòng mang: yếu hơn nhưng không mù.
    let shaGoc = prev.sha;
    if (typeof prev.carried_from_round === 'number') {
      const origin = evalLines.find(l => l.evalId === e.id && l.round === prev.carried_from_round && l.run_id === prev.run_id);
      if (origin) { verifiedAt = origin.ts; if (origin.sha) shaGoc = origin.sha; }
    }
    // <<<DINH-NGHIA-DOI
    if (typeof dinhNghiaTai === 'function') {
      const goc = dinhNghiaTai(shaGoc);
      const khoiGoc = goc ? khoiEval(goc.evalsText, e.id, R) : null;
      if (khoiGoc == null) { rerun.push(e.id); reason[e.id] = `không đọc được định nghĩa ở lượt gốc r${fromRound}`; continue; }
      if (khoiGoc !== khoiEval(evalsText, e.id, R)) { rerun.push(e.id); reason[e.id] = `định nghĩa eval đổi so với lượt gốc r${fromRound}`; continue; }
      if (chuTieuChi(goc.contractText, e.criterion, R) !== chuTieuChi(contractText, e.criterion, R)) { rerun.push(e.id); reason[e.id] = `tiêu chí ${e.criterion} đổi chữ so với lượt gốc r${fromRound}`; continue; }
    }
    // DINH-NGHIA-DOI>>>
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
  return { anchorSha, carriedEvals: carried, rerun, reason, carriedFindings };
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
  const dinhNghiaTai = boDocDinhNghiaGit(a.evals, a.contract);
  if (!dinhNghiaTai) process.stderr.write('carry-plan: evals.yaml không nằm trong kho git — không so được định nghĩa eval với lượt gốc (chỉ paths quyết mang sang)\n');
  const r = plan({ runLogText, evalsText, contractText, deltaFiles, round, agRoot: a['ag-root'], dinhNghiaTai });
  if (r.noCarry) {
    // Thông điệp phải nói ĐÚNG phạm vi: chỉ EVAL mất carry. Bản trước nói trống
    // «full re-run», đọc như thể mọi đường carry đều tắt.
    process.stderr.write(`carry-plan: dòng run-log round trước thiếu field sha (hoặc sha không thuần nhất) — EVAL chạy lại toàn bộ (mặc định an toàn); carry finding KHÔNG dùng sha nên vẫn giữ: ${r.carriedFindings.length} finding ngoài hợp đồng mang sang\n`);
    // Vẫn in JSON: mã thoát 3 là tín hiệu «eval không carry», không phải «không có gì để đọc».
    process.stdout.write(JSON.stringify(r, null, 2) + '\n');
    process.exit(3);
  }
  process.stdout.write(JSON.stringify(r, null, 2) + '\n');
}

// doc-ghi-troi.test.mjs — hai lỗi «bên viết / bên đọc trôi nhau» crm đo đêm 07–08/10 (kit 2.24.0).
//
//   DG* — mục ngoài hợp đồng MANG SANG: tác tử tổng hợp viết `- **<title>** (r1)` (nhãn NGOÀI hai dấu sao),
//         bộ đọc thẻ (lib/out-of-contract.cjs) chỉ nhận `- **<title>**` trọn dòng → thẻ Cổng 2 giấu mục
//         (ca-chap-chon-cach-ly r2 / crm be8abc7e4: 14/15 mục vô hình). Bước chèn mục mang sang của workflow
//         dùng cùng biểu thức để chống trùng → in lại một bản thứ hai.
//   DR* — `run_id` rỗng: tác tử máy trả `runId` là chuỗi `""`, bên viết coi là có giá trị (chuỗi hai ký tự),
//         run-log ghi `"\"\""`, báo cáo ghi `run_id: ""`; bên đọc bỏ nháy ra rỗng rồi bỏ qua lặng
//         (danh-sach-keo-chung r2: E3/E7/E12 — recheck thoát 0).
// Mẫu thử do code sinh: khuôn mục rút từ OOC-ITEM-TEMPLATE, mục mang sang do CHÍNH workflow chèn (harness).
// Đột biến chạy trên bản sao trong bộ nhớ / thư mục tạm; kim khớp đúng một lần trước khi tin màu đỏ.
// GIỚI HẠN ĐÃ KHAI: báo cáo bằng chứng của DR2–DR4 là chuỗi viết tay — bên viết thật của báo cáo là tác tử tổng
// hợp (LLM), không có code path nào sinh nó để rút; phía máy của cùng lỗi (DR1/DR6) đo trên đầu ra thật.
import { fileURLToPath } from 'node:url';
import { readFileSync, mkdtempSync, writeFileSync, rmSync, mkdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { runWorkflow, check, summary } from './harness.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..', '..');
const WF = path.join(ROOT, 'feature-loop', 'workflows', 'acceptance-verify.js');
const SRC = readFileSync(WF, 'utf8');
const LIB = path.join(ROOT, 'lib', 'out-of-contract.cjs');
const LIB_SRC = readFileSync(LIB, 'utf8');
const req = createRequire(import.meta.url);
const ooc = req(LIB);
const core = req(path.join(ROOT, 'lib', 'evidence-core.cjs'));
const VC = 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2';
const soLan = (hay, kim) => hay.split(kim).length - 1;

const tpl = (() => {
  const m = SRC.match(/<<<OOC-ITEM-TEMPLATE\\n([\s\S]*?)\\nOOC-ITEM-TEMPLATE>>>/);
  if (!m) throw new Error('khong rut duoc OOC-ITEM-TEMPLATE');
  return m[1].replace(/\\n/g, '\n').replace(/\\`/g, '`');
})();
const muc = (titleLine, file = 'a.js') => tpl.replace('- **{title}**', titleLine)
  .replace('{plain}', 'nguoi thay X').replace('{file}', file).replace('{severity}', 'medium').replace('{proposal}', 'known-limits');
const tep = body => `# Review\n\n## Ngoài hợp đồng — người quyết ở Gate 2\n\n${body}\n\n## Known limits\n`;
const ev = (id, cmd) => ({ id, criterion: 'AC-1', executor: 'script', cmd, ref: `config:executors.script.${id}`, expected: 'ok' });
const args = (over = {}) => ({ slug: 'demo', round: 2, riskTier: 'T2', evals: [ev('E1', 'bash t/a.sh')], suiteCommands: [],
  diffBase: 'main', repoRoot: '/repo', personasPath: '/p.md', templatePath: '/t.md', invokedAt: '2026-10-08T00:00:00Z', ...over });
const responder = ({ machine, findings } = {}) => (call) => {
  const l = call.label;
  if (l.startsWith('machine:')) return machine || { exitCode: 0, outputTail: 'ok\n__EXIT=0', runId: '', cannotRun: false };
  if (l.startsWith('review:')) return { findings: [] };
  if (l.startsWith('refute:')) return { refuted: true, reason: 'x' };
  if (l.startsWith('triage')) return { items: [] };
  if (l === 'baseline:diffBase') return { results: [] };
  if (l === 'capture:provenance') return { bypass_used: false, enforcement_mode: 'strict', verified_commit: VC };
  if (l === 'synthesize:report') return { report: '# Evidence', findings: findings || '# Findings\n' };
  return null;
};

// ═════ DG — mục mang sang ═══════════════════════════════════════════════════
console.log('DG bộ đọc thẻ nhận cả dạng máy chèn lẫn dạng tác tử viết nhãn ngoài sao');
{
  // MA TRẬN viết trước: [dòng tiêu đề, là mục?, tiêu đề chuẩn hoá] — số assert = số phần tử.
  const MT = [
    ['- **T1 (r1)**', true, 'T1 (r1)'],                                   // dạng MÁY chèn (nhãn trong sao)
    ['- **T2** (r1)', true, 'T2 (r1)'],                                   // dạng tác tử viết (crm be8abc7e4)
    ['- **T3** (r2 · tệp đã đổi)', true, 'T3 (r2 · tệp đã đổi)'],          // nhãn đủ của nhanCarry, ngoài sao
    ['- **T4**', true, 'T4'],                                             // mục tươi
    ['- **T5** (r?)', true, 'T5 (r?)'],                                   // fromRound không rõ
    ['- **T6** là văn xuôi, không phải mục', false, 'T6'],                 // chữ tự do sau sao: KHÔNG nuốt
    ['- **T7** (xem ghi chú)', false, 'T7'],                              // ngoặc không phải nhãn lượt
    ['- **T8** (r1, tệp đã đổi)', true, 'T8 (r1, tệp đã đổi)'],            // biến thể dấu phẩy (lượt soát)
    ['- **T9** (r1 — tệp đổi)', true, 'T9 (r1 — tệp đổi)'],                // biến thể gạch dài
    ['- **T10** (R1)', true, 'T10 (R1)'],                                 // R hoa
    ['- **T11** (từ r1)', false, 'T11'],                                  // GIỚI HẠN ĐÃ KHAI: nhãn mở bằng chữ khác
    // Hai dòng giữ NGUYÊN HÌNH của vật đã làm lộ lỗi (crm be8abc7e4, chữ đã ẩn danh): tiêu đề dài có backtick,
    // dấu hai chấm, dấu «—» và «'…'» bên trong sao — gap-probe P1 «fixture tưởng tượng hình dạng».
    ['- **If spawn fails, `pid ?? 0` makes the alive check pass for nothing and makes cleanup SIGKILL the group** (r1)', true,
      'If spawn fails, `pid ?? 0` makes the alive check pass for nothing and makes cleanup SIGKILL the group (r1)'],
    ["- **Hình dạng 3 — AC-1 hứa thứ tự «dừng TRƯỚC khi X», nhưng bài chỉ đo 'rồi cũng chết' sau khi Y trả về** (r1)", true,
      "Hình dạng 3 — AC-1 hứa thứ tự «dừng TRƯỚC khi X», nhưng bài chỉ đo 'rồi cũng chết' sau khi Y trả về (r1)"],
  ];
  const r = ooc.parse(tep(MT.map(([d]) => muc(d)).join('\n\n')));
  const tieuDe = r.findings.map(f => f.title);
  for (const [dong, laMuc, chuan] of MT) {
    check(`DG1 «${dong}» → ${laMuc ? `mục «${chuan}»` : 'không phải mục'}`,
      laMuc ? tieuDe.includes(chuan) : !tieuDe.some(t => t === chuan || t.startsWith(chuan + ' ')), tieuDe.join(' | '));
  }
  check('DG1b đếm đúng 10 mục / 13 dòng', r.findings.length === 10, String(r.findings.length));
  // Hai bộ đọc của CÙNG một dòng (thẻ ở lib, chống trùng ở workflow) dùng cùng MỘT biểu thức: khối marker
  // OOC-TITLE-RE có mặt ở cả hai nguồn và giống nhau từng ký tự.
  const rut = s => (s.match(/<<<OOC-TITLE-RE\n([\s\S]*?)\n\/\/ OOC-TITLE-RE>>>/) || [])[1];
  const a = rut(SRC), b = rut(LIB_SRC);
  check('DG2 khối OOC-TITLE-RE có ở workflow và lib, giống nhau từng ký tự', !!a && !!b && a.trim() === b.trim(), `${a} || ${b}`);
}

console.log('DG chèn mục mang sang: tác tử đã in mục với nhãn ngoài sao → máy KHÔNG in bản thứ hai');
{
  const carried = [{ title: 'Loi mang sang', file: 'a.js', severity: 'medium', plain: 'p', proposal: 'known-limits', fromRound: 1 }];
  const coSan = `# Findings\n\n${tep(muc('- **Loi mang sang** (r1)'))}`;
  const r1 = await runWorkflow(WF, args({ carriedFindings: carried }), responder({ findings: coSan }));
  const n1 = soLan(r1.result.findings, 'Loi mang sang');
  check('DG3 tác tử đã in «- **T** (r1)» → mục xuất hiện đúng MỘT lần', n1 === 1, `${n1} lần`);
  check('DG3b và bộ đọc thẻ đếm được nó', ooc.parse(r1.result.findings).findings.some(f => f.title === 'Loi mang sang (r1)'));
  // Ma trận nhãn (gap-probe P1): bước chèn của workflow nhận ĐỦ mọi dạng nhãn bộ đọc thẻ nhận — mỗi dạng một
  // assert «đúng một lần + thẻ đếm được», chạy qua CHÍNH workflow (không chỉ so văn bản hai khối marker).
  for (const nhan of ['(r1)', '(r1 · tệp đã đổi)', '(r1, tệp đã đổi)', '(r1 — tệp đổi)', '(R1)']) {
    const c2 = [{ ...carried[0], tepDoi: /đổi/.test(nhan) }];
    const rr = await runWorkflow(WF, args({ carriedFindings: c2 }), responder({ findings: `# Findings\n\n${tep(muc(`- **Loi mang sang** ${nhan}`))}` }));
    const nn = soLan(rr.result.findings, 'Loi mang sang');
    check(`DG3c nhãn «${nhan}» do tác tử in → đúng một lần, thẻ đếm được`, nn === 1 && ooc.parse(rr.result.findings).findings.length === 1, `${nn} lần`);
  }
  // Đối chứng dương: tác tử KHÔNG in → máy chèn đúng một bản, bộ đọc thẻ đọc được.
  const r2 = await runWorkflow(WF, args({ carriedFindings: carried }), responder({ findings: `# Findings\n\n${tep('')}` }));
  check('DG4 đối chứng: tác tử không in → máy chèn đúng một bản, thẻ đọc được',
    soLan(r2.result.findings, 'Loi mang sang') === 1 && ooc.parse(r2.result.findings).findings.some(f => f.title === 'Loi mang sang (r1)'));
  // Chiều im: mục TƯƠI cùng tệp, tên dài hơn, không bị coi là bản mang sang.
  const tuoi = `# Findings\n\n${tep(muc('- **Loi mang sang cua tep khac han**'))}`;
  const r3 = await runWorkflow(WF, args({ carriedFindings: carried }), responder({ findings: tuoi }));
  check('DG5 chiều im: mục tươi tên dài hơn không nuốt mục mang sang', soLan(r3.result.findings, '**Loi mang sang (r1)**') === 1);
  // Chiều im (S4-r1, finding t2 — AC-3): mục tươi cùng tệp có NGOẶC mở bằng r/R mà KHÔNG phải nhãn lượt
  // («(race condition)», «(Redux)») không được coi là bản mang sang — mục mang sang vẫn phải được chèn.
  for (const ngoac of ['(race condition)', '(Redux store)', '(r1 lỗi)']) {
    const rr = await runWorkflow(WF, args({ carriedFindings: carried }), responder({ findings: `# Findings\n\n${tep(muc(`- **Loi mang sang ${ngoac}**`))}` }));
    check(`DG5b mục tươi «Loi mang sang ${ngoac}» → mục mang sang vẫn được chèn`, soLan(rr.result.findings, '**Loi mang sang (r1)**') === 1, rr.result.findings.split('\n').filter(l => l.startsWith('- **')).join(' | '));
  }
}

console.log('DG đột biến phía workflow: bước chèn về biểu thức cũ → in bản thứ hai');
{
  const KIM = SRC.match(/const OOC_TITLE_RE = [^\n]*/)[0];
  const mut = SRC.replace(KIM, 'const OOC_TITLE_RE = /^-\\s+\\*\\*(.+?)\\*\\*()\\s*$/');
  const carried = [{ title: 'Loi mang sang', file: 'a.js', severity: 'medium', plain: 'p', proposal: 'known-limits', fromRound: 1 }];
  const r = await runWorkflow(WF, args({ carriedFindings: carried }), responder({ findings: `# Findings\n\n${tep(muc('- **Loi mang sang** (r1)'))}` }), mut);
  const n = soLan(r.result.findings, 'Loi mang sang');
  check('DG7 đột biến (bước chèn dùng biểu thức cũ) → mục in HAI lần (đỏ)', soLan(SRC, KIM) === 1 && n === 2, `${n} lần`);
}

console.log('DG đột biến: phép so nhãn của bước chống trùng về «ngoặc mở bằng r» → mục tươi nuốt mục mang sang');
{
  const KIM = SRC.match(/const NHAN_LUOT_RE = [^\n]*/);
  const mut = KIM ? SRC.replace(KIM[0], 'const NHAN_LUOT_RE = /^\\([rR]/') : SRC;
  const carried = [{ title: 'Loi mang sang', file: 'a.js', severity: 'medium', plain: 'p', proposal: 'known-limits', fromRound: 1 }];
  const r = await runWorkflow(WF, args({ carriedFindings: carried }), responder({ findings: `# Findings\n\n${tep(muc('- **Loi mang sang (race condition)**'))}` }), mut);
  check('DG8 đột biến (nhãn = mọi ngoặc mở bằng r) → mục mang sang bị nuốt (đỏ)', !!KIM && soLan(SRC, KIM[0]) === 1 && soLan(r.result.findings, '**Loi mang sang (r1)**') === 0, KIM ? 'co kim' : 'khong co NHAN_LUOT_RE');
}

console.log('DG đột biến: bộ đọc thẻ về biểu thức cũ → dạng tác tử viết biến mất khỏi thẻ');
{
  const d = mkdtempSync(path.join(tmpdir(), 'dg-mut-'));
  try {
    const mut = LIB_SRC.replace(/const OOC_TITLE_RE = [^\n]*/, 'const OOC_TITLE_RE = /^-\\s+\\*\\*(.+?)\\*\\*()\\s*$/');
    mkdirSync(path.join(d, 'lib'));
    writeFileSync(path.join(d, 'lib', 'out-of-contract.cjs'), mut);
    const m = req(path.join(d, 'lib', 'out-of-contract.cjs'));
    const t = m.parse(tep(muc('- **T2** (r1)'))).findings.length;
    check('DG6 đột biến (biểu thức cũ) → mục «- **T2** (r1)» không được đếm (đỏ)', mut !== LIB_SRC && t === 0, `dem=${t}`);
  } finally { rmSync(d, { recursive: true, force: true }); }
}

// ═════ DR — run_id rỗng ═════════════════════════════════════════════════════
console.log('DR bên viết: runId rỗng / chỉ có dấu nháy → đúc mã như khi vắng');
{
  const MR = [['""', true], ["''", true], ['  ', true], ['" "', true], ['abc123', false]];
  for (const [rid, duc] of MR) {
    const { result } = await runWorkflow(WF, args(), responder({ machine: { exitCode: 0, outputTail: 'ok\n__EXIT=0', runId: rid, cannotRun: false } }));
    const dong = result.runLog.map(l => JSON.parse(l)).find(o => o.evalId === 'E1');
    const got = dong && dong.run_id;
    check(`DR1 runId ${JSON.stringify(rid)} → ${duc ? 'mã đúc minted-…' : 'giữ nguyên'}`, duc ? /^minted-demo-E1-r2$/.test(got) : got === rid, String(got));
  }
}

console.log('DR đường mang sang: eval carried với run_id rỗng/chỉ nháy → KHÔNG mang, chạy lại, đúc mã mới');
{
  // Lệnh suite cho lượt có việc chấm TƯƠI (lượt toàn carried + suite rỗng bị chặn sớm, đúng luật kit).
  const coCham = c => c.label.startsWith('machine:bash t/a.sh');
  const r = await runWorkflow(WF, args({ suiteCommands: ['npm run build'], carriedEvals: [{ id: 'E1', runId: '""', fromRound: 1, verifiedAt: '2026-10-07T00:00:00Z', cmd: 'bash t/a.sh' }] }), responder());
  const dong = r.result.runLog.map(l => JSON.parse(l)).filter(o => o.evalId === 'E1');
  check('DR6 carried run_id `""` → E1 chạy lại, dòng run-log mang minted-…, không dòng carried',
    r.calls.some(coCham) && dong.length === 1 && /^minted-demo-E1-r2$/.test(dong[0].run_id) && !('carried_from_round' in dong[0]), JSON.stringify(dong));
  const rOk = await runWorkflow(WF, args({ suiteCommands: ['npm run build'], carriedEvals: [{ id: 'E1', runId: 'run-that-123', fromRound: 1, verifiedAt: '2026-10-07T00:00:00Z', cmd: 'bash t/a.sh' }] }), responder());
  const dOk = rOk.result.runLog.map(l => JSON.parse(l)).filter(o => o.evalId === 'E1');
  check('DR6b đối chứng: carried run_id thật → mang sang, không chạy lại', !rOk.calls.some(coCham) && dOk.length === 1 && dOk[0].run_id === 'run-that-123' && dOk[0].carried_from_round === 1, JSON.stringify(dOk));
}

console.log('DR bên đọc: khối eval khai run_id rỗng → ghi chú có tên (khoan dung, không chặn)');
{
  // Báo cáo ba khối eval; E3 và E7 mang run_id do tham số (không liền nhau, E5 thật ở giữa). Cấu hình khai đủ
  // verifier nên bản ĐỦ qua trọn — ghim giá trị TUYỆT ĐỐI, không chỉ so bằng (gap-probe P1: fixture hỏng làm cả
  // hai bản cùng đỏ thì phép so bằng vẫn xanh).
  const khoi = (id, rid) => `- eval: ${id}\n  run_id: ${rid}\n  exit_code: 0\n  verifier: config:executors.script.${id}\n  verified_at: 2026-10-08T00:00:00Z\n`;
  const bao = (r3, r7) => `---\nverdict: PASS\n---\n\n## Evals\n\n${khoi('E3', r3)}\n${khoi('E5', 'minted-demo-E5-r2')}\n${khoi('E7', r7)}`;
  const CFG = 'executors:\n  script:\n    E3: "bash t/c.sh"\n    E5: "bash t/e.sh"\n    E7: "bash t/g.sh"\n';
  const rDu = core.evaluateEvidence(bao('minted-demo-E3-r2', 'minted-demo-E7-r2'), { configText: CFG });
  check('DR2a đối chứng dương: bản đủ qua TRỌN (anyFailure=false) và không ghi chú', rDu.anyFailure === false && Array.isArray(rDu.notes) && rDu.notes.length === 0, JSON.stringify({ a: rDu.anyFailure, n: rDu.notes, m: rDu.missing, au: rDu.authFailures }));
  // Bốn dạng rỗng của trục C (bên viết) — bên đọc phải gọi tên đủ cả bốn.
  for (const rong of ['""', "''", "' '", '']) {
    const r = core.evaluateEvidence(bao(rong, rong), { configText: CFG });
    check(`DR2 run_id ${JSON.stringify(rong)} ở E3 và E7 → notes gọi tên CẢ HAI, anyFailure vẫn false`,
      r.anyFailure === false && (r.notes || []).some(n => /run_id rỗng/.test(n) && /\bE3\b/.test(n) && /\bE7\b/.test(n) && !/\bE5\b/.test(n)), JSON.stringify(r.notes));
  }
  // CLI recheck: ghi chú ra stderr, mã thoát 0 ở cả hai bản.
  const d = mkdtempSync(path.join(tmpdir(), 'dr-cli-'));
  try {
    mkdirSync(path.join(d, '_acceptance', 'demo'), { recursive: true });
    writeFileSync(path.join(d, '_acceptance', 'config.yaml'), CFG);
    const f = path.join(d, '_acceptance', 'demo', 'evidence-report.md');
    writeFileSync(f, bao('""', '""'));
    const r = spawnSync('node', [path.join(ROOT, 'scripts', 'recheck-evidence.cjs'), f], { encoding: 'utf8', cwd: d });
    writeFileSync(f, bao('minted-demo-E3-r2', 'minted-demo-E7-r2'));
    const rDoi = spawnSync('node', [path.join(ROOT, 'scripts', 'recheck-evidence.cjs'), f], { encoding: 'utf8', cwd: d });
    check('DR4 recheck: bản rỗng in «NOTE … run_id rỗng … E3, E7» và thoát 0; bản đủ thoát 0, không NOTE',
      r.status === 0 && /NOTE[^\n]*run_id rỗng[^\n]*E3, E7/.test(r.stderr) && rDoi.status === 0 && !/run_id rỗng/.test(rDoi.stderr), `${r.status}/${rDoi.status} ${(r.stderr + rDoi.stderr).slice(0, 300)}`);
  } finally { rmSync(d, { recursive: true, force: true }); }
}

console.log('DR đột biến: bên viết không bỏ nháy → chuỗi `""` lọt thành run_id');
{
  const KIM = "const docRid = (v) => String(v == null ? '' : v).replace(/\\s+#.*$/, '').trim().replace(/^[\"']+|[\"']+$/g, '').trim()";
  const mut = SRC.replace(KIM, "const docRid = (v) => String(v == null ? '' : v).trim()");
  const { result } = await runWorkflow(WF, args(), responder({ machine: { exitCode: 0, outputTail: 'ok\n__EXIT=0', runId: '""', cannotRun: false } }), mut);
  const got = (result.runLog.map(l => JSON.parse(l)).find(o => o.evalId === 'E1') || {}).run_id;
  check('DR5 đột biến (không bỏ nháy) → run_id `""` lọt (đỏ)', soLan(SRC, KIM) === 1 && got === '""', String(got));
}

summary('doc-ghi-troi');

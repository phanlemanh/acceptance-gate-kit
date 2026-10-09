// tac-tu-cham-hep.test.mjs — hồ sơ tac-tu-cham-chi-cham-khong (T2, 09/10), lối A.
// Tác tử chấm không cầm bút: ba loại tác tử của gói feature-loop (AT1), bảng vai → loại ở
// acceptance-verify.js (AT2), lượt sạch không đổi so với v2.26.0 (AT3), đường rơi có tên khi
// loại không nạp được (AT4). Tên nhóm AT<n> = AC-<n>.
//
// Bộ chấm chạy THẬT qua harness.mjs (tải chính tệp workflow). Bản v2.26.0 lấy bằng `git show`
// trong lần chạy, từ kho gốc `AT_GOC` (mặc định chính cây này) — bản sao của răng hồ sơ không có
// .git. Mọi đường suy từ vị trí tệp này.
//
//   node tests/workflows/tac-tu-cham-hep.test.mjs [--only AT1,AT2]
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runWorkflow } from './harness.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..', '..');
const GOC = process.env.AT_GOC ? path.resolve(process.env.AT_GOC) : KIT;
const WF = path.join(KIT, 'feature-loop', 'workflows', 'acceptance-verify.js');
const AGENTS = path.join(KIT, 'feature-loop', 'agents');
const BASE_REF = 'v2.26.0';
const ONLY = (() => { const i = process.argv.indexOf('--only'); return i >= 0 ? process.argv[i + 1] : (process.env.AT_CASES || null); })();
const want = g => !ONLY || ONLY.split(',').includes(g);
let pass = 0; let fail = 0;
const ok = (name, msg = '') => { pass += 1; console.log(`PASS: ${name} ${msg}`.trimEnd()); };
const bad = (name, msg) => { fail += 1; console.log(`FAIL: ${name} — ${msg}`); };
const loi = e => String((e && (e.stderr || e.message)) || e).split('\n').slice(0, 3).join(' | ');

// ── AT1 — ba định nghĩa tác tử ──────────────────────────────────────────────
function docFrontmatter(f) {
  const s = readFileSync(f, 'utf8');
  const m = s.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) throw new Error(`khong doc duoc frontmatter ${f}`);
  const out = { name: null, tools: null, disallowedTools: null };
  for (const l of m[1].split('\n')) {
    const k = l.match(/^([A-Za-z]+):\s*(.*)$/);
    if (!k) continue;
    if (k[1] === 'name') out.name = k[2].trim();
    if (k[1] === 'tools' || k[1] === 'disallowedTools') out[k[1]] = k[2].split(',').map(x => x.trim()).filter(Boolean);
  }
  return out;
}
const CAM = ['Edit', 'Write', 'NotebookEdit'];
// Ma trận viết trước: mỗi phần tử một khẳng định, thông điệp đỏ gắn với phần tử.
const MA_TRAN_AT1 = [
  { loai: 'cham-doc', ten: 'name', kiem: f => f.name === 'cham-doc' },
  { loai: 'cham-doc', ten: 'tools dung bang Read,Grep,Glob', kiem: f => JSON.stringify(f.tools) === JSON.stringify(['Read', 'Grep', 'Glob']) },
  ...CAM.concat('Bash').map(c => ({ loai: 'cham-doc', ten: c, kiem: f => Array.isArray(f.tools) && !f.tools.includes(c) })),
  { loai: 'cham-lenh', ten: 'name', kiem: f => f.name === 'cham-lenh' },
  { loai: 'cham-lenh', ten: 'tools dung bang Bash,Read,Grep,Glob', kiem: f => JSON.stringify(f.tools) === JSON.stringify(['Bash', 'Read', 'Grep', 'Glob']) },
  ...CAM.map(c => ({ loai: 'cham-lenh', ten: c, kiem: f => Array.isArray(f.tools) && !f.tools.includes(c) })),
  { loai: 'cham-ui', ten: 'name', kiem: f => f.name === 'cham-ui' },
  { loai: 'cham-ui', ten: 'khong co dong tools', kiem: f => f.tools === null },
  ...CAM.map(c => ({ loai: 'cham-ui', ten: c, kiem: f => Array.isArray(f.disallowedTools) && f.disallowedTools.includes(c) })),
];
if (want('AT1')) {
  try {
    const fm = {};
    for (const l of ['cham-doc', 'cham-lenh', 'cham-ui']) fm[l] = docFrontmatter(path.join(AGENTS, `${l}.md`));
    const sai = [];
    let n = 0;
    for (const p of MA_TRAN_AT1) { n += 1; if (!p.kiem(fm[p.loai])) sai.push(`AT1 ${p.loai} ${p.ten}`); }
    if (n !== MA_TRAN_AT1.length || n !== 16) sai.push(`so khang dinh ${n} != 16`);
    if (sai.length) for (const s of sai) bad(s, JSON.stringify(fm));
    else ok('AT1', '— ba loại tác tử: cham-doc chỉ đọc, cham-lenh đọc + Bash, cham-ui cấm Edit/Write/NotebookEdit; 16/16 khẳng định');
  } catch (e) { bad('AT1', loi(e)); }
}

// ── Lượt chấm dùng chung cho AT2–AT4: đủ chín vai ───────────────────────────
const VC = 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2';
const ARGS = () => ({
  slug: 'demo', round: 1, riskTier: 'T2',
  evals: [
    { id: 'E1', criterion: 'AC-1', executor: 'test', cmd: 'pnpm test', ref: 'config:executors.test.api', expected: 'pass' },
    { id: 'E5', criterion: 'AC-5', executor: 'ui-check', steps: ['open /'], expected: '200' },
    { id: 'E9', criterion: 'AC-9', executor: 'judgment', question: 'q', inputs: ['/repo/x.md'] },
  ],
  suiteCommands: ['npm run build'], diffBase: 'main', repoRoot: '/repo',
  personasPath: '/refs/judge-personas.md', templatePath: '/refs/evidence-report-template.md',
  invokedAt: '2026-10-09T10:00:00Z', invokedSha: VC, contractPath: '/repo/_acceptance/demo/contract.md',
});
const traLoi = (call) => {
  const l = call.label;
  if (l.startsWith('machine:')) return { exitCode: 0, outputTail: 'ok\n__EXIT=0', runId: '', cannotRun: false };
  if (l.startsWith('ui:')) return { exitCode: 0, outputTail: 'asserted', runId: '', cannotRun: false, screenshotPath: '/repo/_acceptance/demo/evidence/E5-step1.png', observed: 'thay trang' };
  if (l.startsWith('judge:')) return { verdict: 'PASS', rationale: 'fits intent' };
  if (l.startsWith('review:conventions')) return { findings: [{ title: 'ten bien kho doc', file: 'src/a.js', line: 3, severity: 'low', detail: 'd' }] };
  if (l.startsWith('review:')) return { findings: [] };
  if (l.startsWith('refute:')) return { refuted: false, reason: 'that' };
  if (l === 'triage') return { contractUnreadable: false, triaged: [{ tid: 't1', title: 'ten bien kho doc', file: 'src/a.js', inContract: false, acRef: '', proposal: 'known-limits', plain: 'Ten bien kho doc, khong doi hanh vi.' }] };
  if (l.startsWith('baseline:')) return { results: [] };
  if (l === 'capture:provenance') return { bypass_used: false, enforcement_mode: 'strict', verified_commit: VC };
  if (l === 'synthesize:report') return { report: '# Evidence demo', findings: '# Findings demo' };
  throw new Error('nhan la: ' + l);
};
// Vai suy từ tiền tố nhãn — cùng bảng với bộ chấm (design doc §2).
const VAI = [
  ['machine', 'machine:', 'feature-loop:cham-lenh'],
  ['baseline', 'baseline:', 'feature-loop:cham-lenh'],
  ['finder', 'review:', 'feature-loop:cham-lenh'],
  ['refute', 'refute:', 'feature-loop:cham-lenh'],
  ['provenance', 'capture:provenance', 'feature-loop:cham-lenh'],
  ['ui', 'ui:', 'feature-loop:cham-ui'],
  ['judge', 'judge:', 'feature-loop:cham-doc'],
  ['triage', 'triage', 'feature-loop:cham-doc'],
  ['synthesize', 'synthesize:', 'feature-loop:cham-doc'],
];
const vaiCua = l => (VAI.find(([, t]) => l === t || l.startsWith(t)) || [null])[0];

// ── AT2 — bảng vai → loại ───────────────────────────────────────────────────
if (want('AT2')) {
  try {
    // Phân loại trả rỗng → finding chưa phân được đi qua phản bác: biến thể này gọi đủ CHÍN vai.
    const { calls } = await runWorkflow(WF, ARGS(), c => (c.label === 'triage' ? { triaged: [] } : traLoi(c)));
    const sai = [];
    const thieu = calls.filter(c => !c.opts.agentType);
    if (thieu.length) sai.push(['AT2 thieu agentType', thieu.map(c => c.label).join(', ')]);
    for (const [vai, tien, loai] of VAI) {
      const cua = calls.filter(c => c.label === tien || c.label.startsWith(tien));
      if (!cua.length) sai.push([`AT2 ${vai}`, 'vai khong duoc goi lan nao — ca kiem se xanh rong']);
      else if (!cua.every(c => c.opts.agentType === loai)) sai.push([`AT2 ${vai}`, `mong ${loai}, thay ${[...new Set(cua.map(c => c.opts.agentType))].join(',')}`]);
    }
    if (sai.length) for (const [t, m] of sai) bad(t, m);
    else ok('AT2', `— chín vai đều được gọi (${calls.length} lời gọi), mỗi vai đúng loại, 0 lời gọi thiếu loại`);
  } catch (e) { bad('AT2', loi(e)); }
}

// ── AT3 — lượt sạch không đổi: chỉ thêm agentType ─────────────────────────
// Đối chứng là CHÍNH bộ chấm đang kiểm với bảng vai → loại bị gỡ (bản sao do code sinh trong lần
// chạy), không phải một tag cố định: so với v2.26.0 đã đỏ oan ngay khi #280 sửa đề bài baseline
// (Known limit Ngoài-3 lượt 1 thành sự thật lúc gộp main 10/10). Lời hứa không đổi: thêm loại tác
// tử không làm đổi đề bài, phán quyết, sổ chạy, và opts chỉ khác đúng trường agentType.
const VAI_OPT_CO_LOAI = 'const vaiOpt = role => ({ ...modelOpt(role), agentType: AGENT_TYPES[role] })';
if (want('AT3')) {
  try {
    const cay = readFileSync(WF, 'utf8');
    const soCho = cay.split(VAI_OPT_CO_LOAI).length - 1;
    if (soCho !== 1) throw new Error(`khong dung duoc ban go loai: mau vaiOpt khop ${soCho} cho (can dung 1)`);
    const khongLoai = cay.replace(VAI_OPT_CO_LOAI, 'const vaiOpt = role => ({ ...modelOpt(role) })');
    const a = await runWorkflow(WF, ARGS(), traLoi, khongLoai);
    const b = await runWorkflow(WF, ARGS(), traLoi);
    const boLoai = o => { const { agentType, ...r } = o; return r; };
    const sai = [];
    if (a.calls.some(c => 'agentType' in c.opts)) sai.push(['AT3 doi chung', 'ban go loai van mang agentType — doi chung khong khac cay']);
    if (!b.calls.every(c => c.opts.agentType)) sai.push(['AT3 doi chung', 'cay dang kiem co loi goi thieu agentType — so sanh vo nghia']);
    if (JSON.stringify(a.calls.map(c => [c.label, c.prompt])) !== JSON.stringify(b.calls.map(c => [c.label, c.prompt]))) sai.push(['AT3 de bai', 'mang de bai (nhan + prompt) khac ban khong loai']);
    if (a.result.verdict !== b.result.verdict || a.result.verdict !== 'PASS') sai.push(['AT3 phan quyet', `khong loai=${a.result.verdict} co loai=${b.result.verdict}`]);
    if (JSON.stringify(a.result.runLog) !== JSON.stringify(b.result.runLog)) sai.push(['AT3 run-log', 'dong run-log khac ban khong loai']);
    if (JSON.stringify(a.calls.map(c => c.opts)) !== JSON.stringify(b.calls.map(c => boLoai(c.opts)))) sai.push(['AT3 opts', 'opts khac ngoai truong agentType']);
    if (sai.length) for (const [t, m] of sai) bad(t, m);
    else ok('AT3', `— ${b.calls.length} lời gọi: đề bài, phán quyết PASS, run-log trùng bản không loại; opts chỉ thêm agentType`);
  } catch (e) { bad('AT3', loi(e)); }
}

// ── AT4 — đường rơi có tên ─────────────────────────────────────────────────
if (want('AT4')) {
  try {
    const sach = await runWorkflow(WF, ARGS(), traLoi);
    const roi = await runWorkflow(WF, ARGS(), call => {
      if (call.opts.agentType) throw new Error(`agent type '${call.opts.agentType}' not found. Available agents: claude, Explore`);
      return traLoi(call);
    });
    const sai = [];
    const theoNhan = new Map();
    for (const c of roi.calls) { if (!theoNhan.has(c.label)) theoNhan.set(c.label, []); theoNhan.get(c.label).push(c); }
    // Mỗi lời gọi: hoặc (có loại → bị báo → gọi lại đúng một lần cùng đề bài, không loại), hoặc
    // (khởi động sau lần báo đầu tiên → đi thẳng không loại, đúng một lần).
    const leCap = [...theoNhan].filter(([, cs]) => {
      const out = []; let i = 0;
      while (i < cs.length) {
        if (cs[i].opts.agentType) { if (!cs[i + 1] || cs[i + 1].opts.agentType || cs[i + 1].prompt !== cs[i].prompt) return true; i += 2; }
        else i += 1;
      }
      return false;
    });
    if (leCap.length) sai.push(['AT4 goi lai', `nhan khong goi lai dung mot lan cung de bai: ${leCap.map(([l]) => l).join(', ')}`]);
    // Cả lượt: lời gọi khởi động SAU lần báo đầu tiên không còn mang loại — tổng hợp báo cáo (gọi cuối lượt) đi thẳng.
    const synth = roi.calls.filter(c => c.label === 'synthesize:report');
    if (synth.length !== 1 || synth[0].opts.agentType) sai.push(['AT4 ca luot', `tong hop: ${synth.length} loi goi, loai ${synth.map(c => c.opts.agentType || '-').join(',')}`]);
    const coLoai = roi.calls.filter(c => c.opts.agentType).length;
    if (!(coLoai > 0 && coLoai < theoNhan.size)) sai.push(['AT4 ca luot', `${coLoai} loi goi co loai tren ${theoNhan.size} nhan — mong it hon so nhan`]);
    if (roi.result.verdict !== sach.result.verdict) sai.push(['AT4 phan quyet', `${roi.result.verdict} != luot sach ${sach.result.verdict}`]);
    const dong = roi.result.runLog.map(l => JSON.parse(l)).filter(o => o.kind === 'loai-tac-tu-vang');
    const vaiGoi = [...new Set(roi.calls.map(c => vaiCua(c.label)))].sort();
    if (dong.length !== 1) sai.push(['AT4 dong', `${dong.length} dong loai-tac-tu-vang, mong 1`]);
    else {
      if (JSON.stringify([...dong[0].vai].sort()) !== JSON.stringify(vaiGoi)) sai.push(['AT4 dong', `vai ${JSON.stringify(dong[0].vai)} != ${JSON.stringify(vaiGoi)}`]);
      if (!/not found/.test(dong[0].ly_do || '') || dong[0].ts !== ARGS().invokedAt || dong[0].round !== 1) sai.push(['AT4 dong', `khuon dong sai ${JSON.stringify(dong[0])}`]);
      // Khoá RÚT từ khối marker LOAI-VANG-LINE của bên viết — không gõ tay.
      const m = readFileSync(WF, 'utf8').match(/<<<LOAI-VANG-LINE\n\/\/ (\{[^\n]+\})\n\/\/ LOAI-VANG-LINE>>>/);
      const khuon = m ? Object.keys(JSON.parse(m[1].replace(/<n>/g, '0'))).sort() : null;
      if (!khuon) sai.push(['AT4 dong', 'khong rut duoc khoi LOAI-VANG-LINE']);
      else if (JSON.stringify(Object.keys(dong[0]).sort()) !== JSON.stringify(khuon)) sai.push(['AT4 dong', `khoa ${JSON.stringify(Object.keys(dong[0]).sort())} != khuon ${JSON.stringify(khuon)}`]);
    }
    if (!Array.isArray(roi.result.loaiTacTuVang) || !roi.result.loaiTacTuVang.length) sai.push(['AT4 dong', 'ket qua thieu loaiTacTuVang']);
    if (JSON.stringify(roi.result.runLog.filter(l => !l.includes('"loai-tac-tu-vang"'))) !== JSON.stringify(sach.result.runLog)) sai.push(['AT4 phan quyet', 'run-log ngoai dong loai-vang khac luot sach']);
    if (sach.result.runLog.some(l => l.includes('loai-tac-tu-vang')) || 'loaiTacTuVang' in sach.result) sai.push(['AT4 dong', 'luot sach co dong/khoa loai-vang']);
    // Chiều im: lỗi khác «not found» → không gọi lại, không dòng (hành vi cũ).
    const im = await runWorkflow(WF, ARGS(), call => {
      if (call.label.startsWith('machine:')) throw new Error('boom');
      return traLoi(call);
    });
    const may = im.calls.filter(c => c.label.startsWith('machine:'));
    if (may.length !== 2 || new Set(may.map(c => c.label)).size !== 2) sai.push(['AT4 im', `loi khac bi goi lai: ${may.map(c => c.label).join(', ')}`]);
    if (im.result.runLog.some(l => l.includes('loai-tac-tu-vang'))) sai.push(['AT4 im', 'loi khac van ghi dong loai-tac-tu-vang']);
    if (sai.length) for (const [t, m] of sai) bad(t, m);
    else ok('AT4', `— ${coLoai}/${theoNhan.size} nhãn thử loại rồi gọi lại một lần, phần còn lại đi thẳng không loại; phán quyết bằng lượt sạch, một dòng liệt ${vaiGoi.length} vai; lỗi khác không gọi lại`);
  } catch (e) { bad('AT4', loi(e)); }
}

console.log(`\nResults: ${pass} passed, ${fail} failed (tac-tu-cham-hep)`);
if (fail > 0) process.exit(1);

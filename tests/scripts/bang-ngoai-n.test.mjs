#!/usr/bin/env node
// Ca vĩnh viễn của hồ sơ bang-ngoai-n-co-can-cu (14/10/2026). Tên ca = mã BN-… trong evals.yaml.
// Gốc: crm/_acceptance/kanban-viec — phiên crm tự soạn tay bảng Ngoài-n có cột «Căn cứ» ở Cổng 2.
// Trường `can_cu` đi trọn đường: khuôn → tác tử phân loại → sổ finding → tác tử tổng hợp → mang sang →
// chèn mục mang sang → bộ đọc → thẻ. Workflow chạy THẬT qua harness; thẻ dựng bằng gate-card.js thật.
//
// Chạy trọn: node tests/scripts/bang-ngoai-n.test.mjs
// Một nhóm:  BN_CASES=BN-1,BN-2 node tests/scripts/bang-ngoai-n.test.mjs   (khớp 0 ca → thoát 1)
//
// Bản base = `git archive 6ed3e410` trọn thư mục vào thư mục tạm (không danh sách tệp tay). Mỗi ca đỏ chạy
// CHÍNH phép đo trên bản base hoặc bản sao bị tiêm SAU khi bản lành xanh trên cùng fixture; nhát tiêm phải
// khớp đúng một lần; mọi đường dẫn suy từ vị trí tệp này.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { runWorkflow } from '../workflows/harness.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const BASE = '6ed3e410';
const WF = path.join(ROOT, 'feature-loop', 'workflows', 'acceptance-verify.js');
const WF_SRC = fs.readFileSync(WF, 'utf8');
const CARRY_PLAN = path.join(ROOT, 'feature-loop', 'scripts', 'carry-plan.mjs');
const req = createRequire(import.meta.url);
const ooc = req(path.join(ROOT, 'lib', 'out-of-contract.cjs'));

const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'bn-'));
process.on('exit', () => { try { fs.rmSync(TMP, { recursive: true, force: true }); } catch { /* dọn tạm */ } });
const w = (d, rel, s) => { const p = path.join(d, rel); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, s); return p; };

// Bản base: trọn bốn thư mục, một lần cho cả tệp ca.
let baseDir = null;
const BASE_DIR = () => {
  if (baseDir) return baseDir;
  const d = path.join(TMP, 'base');
  fs.mkdirSync(d);
  execFileSync('bash', ['-c', `git -C "${ROOT}" archive ${BASE} scripts lib feature-loop commands skills | tar -x -C "${d}"`]);
  console.log(`  base ${BASE} → ${d}`);
  return (baseDir = d);
};
// Bản sao trọn thư mục (của cây hoặc base) để tiêm — không chép danh sách tệp tay.
const banSao = (goc, thuMuc) => {
  const d = fs.mkdtempSync(path.join(TMP, 'sao-'));
  for (const t of thuMuc) fs.cpSync(path.join(goc, t), path.join(d, t), { recursive: true });
  return d;
};
const tiem = (src, tu, sang, ten) => {
  const n = src.split(tu).length - 1;
  if (n !== 1) throw new Error(`nhát tiêm «${ten}» khớp ${n} lần (phải đúng 1)`);
  return src.split(tu).join(sang);
};
const tiemTep = (tep, tu, sang, ten) => fs.writeFileSync(tep, tiem(fs.readFileSync(tep, 'utf8'), tu, sang, ten));

// Khuôn mục rút từ WRITER (giải escape nguồn JS) — fixture do mã sinh, không viết tay.
const khuonTu = src => {
  const m = src.match(/<<<OOC-ITEM-TEMPLATE\\n([\s\S]*?)OOC-ITEM-TEMPLATE>>>/);
  if (!m) throw new Error('không rút được OOC-ITEM-TEMPLATE từ writer');
  return m[1].replace(/\\n/g, '\n').replace(/\\`/g, '`');
};
const dien = (tpl, v) => tpl.replace(/\{(\w+)\}/g, (_, k) => (Object.prototype.hasOwnProperty.call(v, k) ? v[k] : ''));
const HEAD = '## Ngoài hợp đồng — người quyết ở Gate 2\n\n';
const SAU = ['title', 'plain', 'can_cu', 'file', 'severity', 'proposal'];
const NAM = ['title', 'plain', 'file', 'severity', 'proposal'];
const MAU = {
  title: 'globToRe bo sot dau hoi', plain: 'Bấm Cập nhật có thể làm mất tiện ích đang cài.',
  can_cu: 'Mất cấu hình nhưng cài lại là có; người dùng tự gỡ được.', file: 'src/x.ts:10', severity: 'high', proposal: 'known-limits',
};

const CASES = [];
const test = (id, fn) => CASES.push({ id, fn });

// ══ AC-1 · khuôn ghi → bộ đọc đọc lại ══════════════════════════════════════════════════════════
const docMoi = () => HEAD + dien(khuonTu(WF_SRC), MAU) + '\n';
test('BN-1', () => {
  const f = ooc.parse(docMoi()).findings;
  if (f.length !== 1) throw new Error(`bộ đọc ra ${f.length} mục, phải 1`);
  for (const k of SAU) if (f[0][k] !== MAU[k]) throw new Error(`trường ${k} lệch: [${f[0][k]}] ≠ [${MAU[k]}]`);
});
test('BN-1-cu', () => {
  const cu = req(path.join(BASE_DIR(), 'lib', 'out-of-contract.cjs'));
  const moi = docMoi();
  const goDong = moi.split('\n').filter(l => !/^\s+Căn cứ\s*:/.test(l)).join('\n');
  if (goDong === moi) throw new Error('fixture không có dòng «Căn cứ» để gỡ');
  const a = cu.parse(moi).findings, b = cu.parse(goDong).findings;
  if (a.length !== 1 || b.length !== 1) throw new Error(`bộ đọc cũ hỏng trên khuôn mới: ${a.length}/${b.length} mục`);
  for (const k of NAM) if (a[0][k] !== b[0][k]) throw new Error(`bộ đọc cũ hỏng trên khuôn mới: trường ${k} [${a[0][k]}] ≠ [${b[0][k]}]`);
  const ma = JSON.stringify(cu.mucChuaDinhTuyen(moi, '')), mb = JSON.stringify(cu.mucChuaDinhTuyen(goDong, ''));
  if (ma !== mb) throw new Error(`bộ đọc cũ hỏng trên khuôn mới: mucChuaDinhTuyen ${ma} ≠ ${mb}`);
});
test('BN-1-do', () => {
  // (a) bộ đọc bỏ khoá «Căn cứ» — bản sao trọn lib/ của cây.
  const d = banSao(ROOT, ['lib']);
  tiemTep(path.join(d, 'lib', 'out-of-contract.cjs'), '|Người dùng thấy gì|Căn cứ)', '|Người dùng thấy gì)', 'bộ đọc bỏ Căn cứ');
  const sao = req(path.join(d, 'lib', 'out-of-contract.cjs'));
  const fa = sao.parse(docMoi()).findings;
  if (!fa.length || fa[0].can_cu !== '') throw new Error(`chiều đỏ không đỏ: bộ đọc bỏ Căn cứ vẫn ra [${fa[0] && fa[0].can_cu}]`);
  console.log('  do OK: bộ đọc bỏ Căn cứ');
  // (b) khuôn bỏ dòng «Căn cứ».
  const srcSao = tiem(WF_SRC, '\\n  Căn cứ: {can_cu}', '', 'khuôn thiếu Căn cứ');
  const fb = ooc.parse(HEAD + dien(khuonTu(srcSao), MAU) + '\n').findings;
  if (!fb.length || fb[0].can_cu !== '') throw new Error(`chiều đỏ không đỏ: khuôn thiếu Căn cứ vẫn ra [${fb[0] && fb[0].can_cu}]`);
  console.log('  do OK: khuôn thiếu Căn cứ');
});

// ══ AC-2 · căn cứ qua lượt chấm thật (harness) ════════════════════════════════════════════════
const VC = 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2';
const CC = 'Lộ tiêu đề việc riêng cho người không được xem — mức nặng, sửa sau đắt.';
const argsGoc = (over = {}) => ({
  slug: 'demo', round: 1, riskTier: 'T2',
  evals: [{ id: 'E1', criterion: 'AC-1', executor: 'test', cmd: 'pnpm test', ref: 'config:executors.test.api', expected: 'pass' }],
  suiteCommands: ['npm run build'], diffBase: 'main', repoRoot: '/repo',
  personasPath: '/refs/judge-personas.md', templatePath: '/refs/evidence-report-template.md',
  contractPath: '/repo/_acceptance/demo/contract.md', invokedAt: '2026-10-14T03:00:00Z', invokedSha: VC,
  ...over,
});
const FIND = { title: 'viec.con doc tieu de cha khong qua dieuKienXemViec', file: 'apps/api/src/viec.ts', line: 3, severity: 'medium', detail: 'lo tieu de' };
const traLoi = ({ canCu = CC, synth = { report: '# Evidence demo', findings: '# Review findings\n' }, coFinding = true } = {}) => (call) => {
  const l = call.label;
  if (l.startsWith('machine:')) return { exitCode: 0, outputTail: 'all green\n__EXIT=0', runId: '', cannotRun: false };
  if (l.startsWith('judge:')) return { verdict: 'PASS', rationale: 'fits intent' };
  if (l.startsWith('review:')) return { findings: coFinding && l === 'review:bugs' ? [FIND] : [] };
  if (l.startsWith('refute:')) return { refuted: true, reason: 'not real' };
  if (l.startsWith('baseline:')) return { results: [] };
  if (l === 'triage') {
    const tid = (call.prompt.match(/"tid":"([^"]+)"/) || [])[1];
    return { contractUnreadable: false, triaged: [{ tid, title: FIND.title, file: FIND.file, inContract: false, acRef: '', rationale: 'khong AC nao phu',
      plain: 'Người làm việc con vẫn thấy tiêu đề việc cha đã thành việc riêng.', proposal: 'new-contract', ...(canCu === undefined ? {} : { can_cu: canCu }) }] };
  }
  if (l === 'capture:provenance') return { bypass_used: false, enforcement_mode: 'strict', verified_commit: VC };
  if (l === 'synthesize:report') return synth;
  throw new Error('unexpected agent label: ' + l);
};
const chayCarryPlan = (runLog, planFile = CARRY_PLAN) => {
  const d = fs.mkdtempSync(path.join(TMP, 'so-'));
  w(d, 'run-log.jsonl', runLog.join('\n') + '\n');
  w(d, 'evals.yaml', 'evals:\n  - id: E1\n    criterion: AC-1\n    executor: test\n    cmd: x\n    paths: [lib/x.js]\n');
  w(d, 'contract.md', '- AC-1: Given x When y Then z\n');
  const cp = spawnSync(process.execPath, [planFile, '--run-log', path.join(d, 'run-log.jsonl'), '--evals', path.join(d, 'evals.yaml'),
    '--contract', path.join(d, 'contract.md'), '--round', '2', '--ag-root', ROOT, '--no-delta'], { encoding: 'utf8' });
  let j = null; try { j = JSON.parse(cp.stdout); } catch { /* xử dưới */ }
  return { status: cp.status, stderr: cp.stderr, cf: (j && j.carriedFindings) || [] };
};
// Chạy trọn kịch bản AC-2 trên một bộ nguồn; trả danh sách lỗi (rỗng = xanh).
async function kiemAC2({ src, planFile } = {}) {
  const loi = [];
  const r1 = await runWorkflow(WF, argsGoc(), traLoi(), src);
  const triage = r1.calls.find(c => c.label === 'triage');
  const req1 = triage && triage.opts.schema.properties.triaged.items.required;
  if (!req1 || !req1.includes('can_cu')) loi.push('lược đồ phân loại không đòi can_cu');
  const synth = r1.calls.find(c => c.label === 'synthesize:report');
  if (!synth || !synth.prompt.includes(JSON.stringify(CC).slice(1, -1))) loi.push('tổng hợp không thấy căn cứ');
  if (!synth || !synth.prompt.includes('Căn cứ: {can_cu}')) loi.push('khuôn trong lời tổng hợp thiếu dòng Căn cứ');
  const dong = (r1.result.runLog || []).map(s => JSON.parse(s)).filter(o => o.kind === 'finding');
  if (dong.length !== 1 || dong[0].can_cu !== CC) loi.push(`sổ finding mất căn cứ (${JSON.stringify(dong.map(o => o.can_cu))})`);
  const cp = chayCarryPlan(r1.result.runLog, planFile);
  if (cp.status !== 0) loi.push(`carry-plan thoát ${cp.status}: ${cp.stderr}`);
  else if (cp.cf.length !== 1 || cp.cf[0].can_cu !== CC) loi.push(`mang sang mất căn cứ (${JSON.stringify(cp.cf.map(x => x.can_cu))})`);
  if (cp.cf.length === 1) {
    const r2 = await runWorkflow(WF, argsGoc({ round: 2, carriedFindings: cp.cf }), traLoi({ coFinding: false }), src);
    const m = ooc.parse(r2.result.findings || '').findings.filter(f => f.title.startsWith(FIND.title));
    if (m.length !== 1 || m[0].can_cu !== CC) loi.push(`bản findings lượt 2 mất căn cứ (${JSON.stringify(m.map(f => f.can_cu))})`);
  }
  return loi;
}
test('BN-2', async () => {
  const loi = await kiemAC2();
  if (loi.length) throw new Error(loi.join(' · '));
});
test('BN-2-rong', async () => {
  const MUC = { file: 'apps/api/src/viec.ts', title: 'viec cha', severity: 'medium', plain: 'Người dùng thấy X.', proposal: 'known-limits', fromRound: 1, tepDoi: false };
  const doc = async c => ooc.parse((await runWorkflow(WF, argsGoc({ round: 2, carriedFindings: [c] }), traLoi({ coFinding: false }))).result.findings || '').findings;
  // Đối chứng dương: cùng mục CÓ căn cứ → đọc ra đúng.
  const co = await doc({ ...MUC, can_cu: CC });
  if (co.length !== 1 || co[0].can_cu !== CC) throw new Error(`đối chứng dương hỏng: ${JSON.stringify(co)}`);
  const ko = await doc(MUC);
  if (ko.length !== 1) throw new Error(`căn cứ rỗng nuốt dòng kế: ${ko.length} mục`);
  if (ko[0].can_cu !== '') throw new Error(`căn cứ rỗng nuốt dòng kế: can_cu=[${ko[0].can_cu}]`);
  for (const k of ['file', 'severity', 'proposal', 'plain']) if (ko[0][k] !== MUC[k]) throw new Error(`căn cứ rỗng nuốt dòng kế: ${k}=[${ko[0][k]}]`);
});
test('BN-2-do', async () => {
  const xanh = await kiemAC2();
  if (xanh.length) throw new Error(`đối chứng dương hỏng: ${xanh.join(' · ')}`);
  const dotBien = [
    ['sổ finding mất căn cứ', { src: tiem(WF_SRC, "plain: f.plain || '', can_cu: f.can_cu || '',", "plain: f.plain || '',", 'FINDING-LINE') }],
    ['tổng hợp không thấy căn cứ', { src: tiem(WF_SRC, "    can_cu: (ok && t.inContract !== true && t.can_cu) ? t.can_cu : null,\n", '', 'triagedRaw') }],
  ];
  const d = banSao(ROOT, ['feature-loop', 'lib']);
  const plan = path.join(d, 'feature-loop', 'scripts', 'carry-plan.mjs');
  tiemTep(plan, "can_cu: l.can_cu || '', ", '', 'carry-plan');
  dotBien.push(['mang sang mất căn cứ', { planFile: plan }]);
  for (const [ghim, opt] of dotBien) {
    const loi = await kiemAC2(opt);
    if (!loi.some(x => x.includes(ghim))) throw new Error(`chiều đỏ «${ghim}» không đỏ (lỗi: ${loi.join(' · ') || 'không có'})`);
    console.log(`  do OK: ${ghim}`);
  }
});

// ══ AC-3…AC-5 · bảng trên thẻ Cổng 2 ═════════════════════════════════════════════════════════
const GC = path.join(ROOT, 'scripts', 'gate-card.js');
const GC_BASE = () => path.join(BASE_DIR(), 'scripts', 'gate-card.js');
const COT = ['Mục', 'Người dùng gặp gì', 'Máy đề xuất', 'Căn cứ'];
const escH = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// Kho thử: hồ sơ demo T2 verified, báo cáo PASS (hoặc REJECT), review-findings điền từ khuôn `tpl`.
function mkKho(muc, { tpl = khuonTu(WF_SRC), verdict = 'PASS', config = '', findingsText } = {}) {
  const d = fs.mkdtempSync(path.join(TMP, 'kho-'));
  w(d, '_acceptance/config.yaml', 'schema_version: 1\n' + config);
  w(d, '_acceptance/demo/contract.md', '---\nschema_version: 1\nfeature: Cập nhật tiện ích an toàn\nslug: demo\nrisk_tier: T2\nstatus: verified\n---\n\n## Criteria\n\n- AC-1: Given x, When y, Then z.\n\n## Out of scope\n\n- không làm gì thêm\n');
  w(d, '_acceptance/demo/evidence-report.md', `---\nslug: demo\nround: 1\nverdict: ${verdict}\nenforcement_mode: strict\nbypass_used: false\n---\n\n## Results\n\n- eval: E1\n  run_id: r1234\n  exit_code: ${verdict === 'PASS' ? 0 : 1}\n  verifier: config:executors.test.unit\n  verified_at: 2026-10-14T00:00:00Z\n`);
  w(d, '_acceptance/demo/review-findings.md', findingsText != null ? findingsText
    : '# Review Findings: demo (round 1)\n\n' + HEAD + muc.map(m => dien(tpl, m)).join('\n') + '\n');
  return d;
}
const theCua = (kho, gc = GC, them = []) => {
  const r = spawnSync(process.execPath, [gc, '--root', kho, '--slug', 'demo', ...them], { encoding: 'utf8' });
  if (r.status !== 0) throw new Error(`gate-card thoát ${r.status}: ${r.stderr.slice(0, 300)}`);
  return r.stdout;
};
const khoiNgoai = h => { const a = h.indexOf('Ngoài hợp đồng — bạn quyết'); if (a < 0) return ''; const b = h.indexOf('<div class="lab">', a); return h.slice(a, b < 0 ? h.length : b); };
const bang = k => {
  const th = [...k.matchAll(/<th>([^<]*)<\/th>/g)].map(m => m[1]);
  const hang = [...k.matchAll(/<tr( class="nhom")?>([\s\S]*?)<\/tr>/g)].filter(m => !/<th>/.test(m[2]))
    .map(m => (m[1] ? { nhom: m[2].replace(/<[^>]+>/g, '') } : { td: [...m[2].matchAll(/<td data-cot="([^"]*)">([\s\S]*?)<\/td>/g)].map(x => ({ cot: x[1], html: x[2] })) }));
  return { th, hang, data: hang.filter(h => h.td), nhom: hang.filter(h => h.nhom).map(h => h.nhom) };
};
const coCua = h => [...h.matchAll(/class="flag [^"]*">([^<]*)/g)].map(m => m[1]);
const BA_NHAN = (() => {
  const t = fs.readFileSync(path.join(ROOT, 'commands', 'acceptance-card.md'), 'utf8');
  const m = t.match(/\(a\) \*\*([^*]*)\*\*.*\(b\) \*\*([^*]*)\*\*.*\(c\) \*\*([^*]*)\*\*/);
  if (!m) throw new Error('không rút được ba nhãn lựa chọn từ commands/acceptance-card.md');
  return [m[1], m[2], m[3]];
})();
const muc = (i, proposal, can_cu) => ({ title: `globToRe muc ${i}`, plain: `Người dùng thấy lỗi ${i}.`, can_cu, file: 'src/x.ts:1', severity: 'low', proposal });
const BA = [muc(1, 'new-contract', 'Lộ <b>dữ liệu</b> | mức nặng.'), muc(2, 'known-limits', 'Tải lại là có.'), muc(3, 'wont-fix', 'Người dùng không thấy khác.')];
// Đề xuất của mục k trong thẻ base (khối .item cũ) — chữ «Máy đề xuất» phải giữ nguyên ở bảng mới.
const recBase = (kho, k) => { const m = theCua(kho, GC_BASE()).match(new RegExp(`Ngoài-${k} · [\\s\\S]*?<p class="ai">([\\s\\S]*?)</p>`)); return m ? m[1] : null; };
function kiemBN3(gc) {
  const loi = [];
  const kho = mkKho(BA);
  const k = khoiNgoai(theCua(kho, gc));
  if ((k.match(/<table/g) || []).length !== 1) return [`base không bảng (khối có ${(k.match(/<table/g) || []).length} bảng)`];
  const b = bang(k);
  if (JSON.stringify(b.th) !== JSON.stringify(COT)) loi.push(`tiêu đề cột ${JSON.stringify(b.th)}`);
  if (b.data.length !== 3) loi.push(`số hàng ${b.data.length} ≠ 3`);
  for (const h of b.data) {
    const n = Number((h.td[0] && h.td[0].html.match(/^Ngoài-(\d+)$/) || [])[1]);
    const m = BA[n - 1];
    if (!m) { loi.push(`ô Mục lạ: ${h.td[0] && h.td[0].html}`); continue; }
    const mong = [`Ngoài-${n}`, escH(m.plain), recBase(kho, n), escH(m.can_cu)];
    h.td.forEach((t, i) => {
      if (t.html !== mong[i]) loi.push(`ô lệch cột: Ngoài-${n} cột ${COT[i]} = [${t.html}] ≠ [${mong[i]}]`);
      if (t.cot !== COT[i]) loi.push(`ô lệch cột: data-cot Ngoài-${n} ô ${i} = ${t.cot}`);
    });
  }
  for (const nh of BA_NHAN) { const c = k.split(nh).length - 1; if (c !== 1) loi.push(`nhãn «${nh}» xuất hiện ${c} lần`); }
  for (const j of ['globToRe', 'src/x.ts']) if (k.includes(j)) loi.push(`khối lộ chữ kỹ thuật: ${j}`);
  return loi;
}
test('BN-3', () => {
  const loi = kiemBN3(GC);
  // Thẻ KHÔNG ký được (REJECT) không in khối Ngoài-n — base cũng không (đo 14/10); vòng giữ nguyên hành vi đó.
  const khoR = mkKho(BA, { verdict: 'REJECT' });
  const hR = theCua(khoR), hRb = theCua(khoR, GC_BASE());
  if (hRb.includes('Ngoài hợp đồng — bạn quyết')) loi.push('giả định đổi: thẻ REJECT base có khối Ngoài-n');
  if (hR.includes('<table class="ngoai"') || hR.includes('mục chưa có căn cứ')) loi.push('thẻ REJECT thêm bảng/cờ mà base không có');
  if (loi.length) throw new Error(loi.join(' · '));
});
test('BN-3-do', () => {
  if (kiemBN3(GC).length) throw new Error('đối chứng dương hỏng: cây đỏ');
  const loiBase = kiemBN3(GC_BASE());
  if (!loiBase.some(x => x.includes('base không bảng'))) throw new Error(`base không đỏ đúng chỗ: ${loiBase.join(' · ')}`);
  console.log('  do OK: base không bảng');
  const d = banSao(ROOT, ['scripts', 'lib', 'feature-loop', 'commands', 'skills']);
  tiemTep(path.join(d, 'scripts', 'gate-card.js'), "aiCua(f, fi),\n      f.can_cu ? esc(f.can_cu) : '<span class=\"mo\">chưa có căn cứ</span>'];",
    "f.can_cu ? esc(f.can_cu) : '<span class=\"mo\">chưa có căn cứ</span>', aiCua(f, fi)];", 'tráo hai ô cuối');
  const loi = kiemBN3(path.join(d, 'scripts', 'gate-card.js'));
  if (!loi.some(x => x.includes('ô lệch cột'))) throw new Error(`tráo ô không đỏ: ${loi.join(' · ')}`);
  console.log('  do OK: ô lệch cột');
});

// AC-4 · ma trận viết trước ba hồ sơ — thứ tự nhãn hàng, hàng nhóm, câu gộp ký không đổi.
const MA_TRAN = [
  { ten: 'A', props: ['known-limits', 'new-contract', 'wont-fix', '', 'ghi han che'], bat: false, thuTu: [2, 4, 5, 1, 3], nhom: ['Cần anh quyết', 'Máy khuyên — chỉ đổi khi anh nghĩ khác'] },
  { ten: 'B', props: ['known-limits', 'new-contract', 'wont-fix'], bat: true, thuTu: [2, 1, 3], nhom: ['Cần anh quyết', 'Máy đã định tuyến'] },
  { ten: 'C', props: ['known-limits'], bat: false, thuTu: [1], nhom: [] },
];
const khoMaTran = o => {
  const kho = mkKho(o.props.map((p, i) => muc(i + 1, p, `Căn cứ mục ${i + 1}.`)), { config: o.bat ? 'feature_loop:\n  ngoai_n_tu_dinh_tuyen: true\n' : '' });
  if (o.bat) {
    const r = spawnSync(process.execPath, [path.join(ROOT, 'scripts', 'dinh-tuyen-may.cjs'), '--write', '--root', kho, '--slug', 'demo'], { encoding: 'utf8' });
    const so = fs.existsSync(path.join(kho, '_acceptance/demo/decisions.jsonl')) ? fs.readFileSync(path.join(kho, '_acceptance/demo/decisions.jsonl'), 'utf8').trim().split('\n').length : 0;
    if (r.status !== 0 || so !== 2) throw new Error(`hồ sơ B: dinh-tuyen-may không ghi đủ 2 dòng máy (thoát ${r.status}, ${so} dòng): ${r.stdout}${r.stderr}`);
  }
  return kho;
};
function kiemBN4(gc) {
  const loi = []; let soO = 0;
  for (const o of MA_TRAN) {
    const kho = khoMaTran(o);
    const b = bang(khoiNgoai(theCua(kho, gc)));
    const thuTu = b.data.map(h => Number((h.td[0].html.match(/^Ngoài-(\d+)$/) || [])[1]));
    o.thuTu.forEach((n, i) => { soO++; if (thuTu[i] !== n) loi.push(`hồ sơ ${o.ten}: hàng ${i + 1} = Ngoài-${thuTu[i]} ≠ Ngoài-${n}`); });
    if (thuTu.length !== o.thuTu.length) loi.push(`hồ sơ ${o.ten}: ${thuTu.length} hàng ≠ ${o.thuTu.length}`);
    if (JSON.stringify(b.nhom) !== JSON.stringify(o.nhom)) loi.push(`hồ sơ ${o.ten}: hàng nhóm ${JSON.stringify(b.nhom)}`);
    const one = g => JSON.parse(theCua(kho, g, ['--extract'])).one_shot;
    if (one(gc) !== one(GC_BASE())) loi.push(`hồ sơ ${o.ten}: câu gộp ký đổi`);
  }
  const tong = MA_TRAN.reduce((s, o) => s + o.thuTu.length, 0);
  if (soO !== tong) loi.push(`ma trận hụt: so ${soO} ô ≠ ${tong}`);
  return { loi, soO };
}
test('BN-4', () => {
  const { loi, soO } = kiemBN4(GC);
  console.log(`  so o: ${soO}`);
  if (loi.length) throw new Error(loi.join(' · '));
});
test('BN-4-do', () => {
  if (kiemBN4(GC).loi.length) throw new Error('đối chứng dương hỏng: cây đỏ');
  const d = banSao(ROOT, ['scripts', 'lib', 'feature-loop', 'commands', 'skills']);
  tiemTep(path.join(d, 'scripts', 'gate-card.js'), '  hang.sort((a, b) => a.g - b.g || a.fi - b.fi);\n', '', 'bỏ bước xếp nhóm');
  const { loi } = kiemBN4(path.join(d, 'scripts', 'gate-card.js'));
  if (!loi.some(x => x.startsWith('hồ sơ A: hàng 1 = Ngoài-1'))) throw new Error(`bỏ xếp nhóm không đỏ thứ tự tệp: ${loi.join(' · ')}`);
  console.log('  do OK: thứ tự tệp');
});

// AC-5 · đọc-cũ — ô «chưa có căn cứ» + đúng một cờ vàng đếm; cờ khác không đổi so base.
const CO_CC = /mục chưa có căn cứ/;
test('BN-5', () => {
  const loi = [];
  const khuonBase = khuonTu(fs.readFileSync(path.join(BASE_DIR(), 'feature-loop', 'workflows', 'acceptance-verify.js'), 'utf8'));
  if (khuonBase.includes('Căn cứ')) throw new Error('khuôn base đã có dòng Căn cứ — fixture đọc-cũ không đọc-cũ');
  const ban = [
    { ten: 'base', kho: mkKho(BA, { tpl: khuonBase }), co: '3/3 mục chưa có căn cứ', o: 3 },
    { ten: 'thiếu một', kho: mkKho([BA[0], { ...BA[1], can_cu: '' }, BA[2]]), co: '1/3 mục chưa có căn cứ', o: 1 },
    { ten: 'đủ', kho: mkKho(BA), co: null, o: 0 },
    { ten: 'rỗng', kho: mkKho([], { findingsText: '# Review Findings\n\n' + HEAD + '(rỗng — không có lỗi ngoài phạm vi)\n' }), co: null, o: 0, khongBang: true },
  ];
  for (const b of ban) {
    const h = theCua(b.kho);
    const co = coCua(h).filter(c => CO_CC.test(c));
    if (b.co ? (co.length !== 1 || !co[0].startsWith(b.co)) : co.length) loi.push(`${b.ten}: cờ căn cứ ${JSON.stringify(co)}`);
    const o = (khoiNgoai(h).match(/<span class="mo">chưa có căn cứ<\/span>/g) || []).length;
    if (o !== b.o) loi.push(`${b.ten}: ${o} ô «chưa có căn cứ» ≠ ${b.o}`);
    if (b.khongBang && h.includes('<table class="ngoai"')) loi.push(`${b.ten}: in bảng rỗng`);
    const khac = coCua(h).filter(c => !CO_CC.test(c)), cu = coCua(theCua(b.kho, GC_BASE()));
    if (JSON.stringify(khac) !== JSON.stringify(cu)) loi.push(`${b.ten}: cờ khác đổi so base (${JSON.stringify(khac)} ≠ ${JSON.stringify(cu)})`);
  }
  if (loi.length) throw new Error(loi.join(' · '));
});
test('BN-5-cu', async () => {
  // Sổ THẬT của một lượt chấm (harness), rồi gỡ khoá can_cu khỏi dòng finding — đúng hình dòng đời cũ.
  const r1 = await runWorkflow(WF, argsGoc(), traLoi());
  const so = r1.result.runLog.map(l => { const o = JSON.parse(l); if (o.kind !== 'finding') return l; if (!('can_cu' in o)) throw new Error('dòng finding lượt thật không có can_cu để gỡ'); delete o.can_cu; return JSON.stringify(o); });
  const cp = chayCarryPlan(so);
  if (cp.status !== 0) throw new Error(`carry-plan thoát ${cp.status}: ${cp.stderr}`);
  if (cp.cf.length !== 1 || cp.cf[0].can_cu !== '') throw new Error(`dòng đời cũ: ${JSON.stringify(cp.cf)}`);
});

const chon = (process.env.BN_CASES || '').split(',').map(s => s.trim()).filter(Boolean);
const chay = chon.length ? CASES.filter(c => chon.includes(c.id)) : CASES;
if (!chay.length) { console.log('FAIL: BN_CASES không khớp ca nào'); process.exit(1); }
let hong = 0;
for (const c of chay) {
  try { await c.fn(); console.log(`PASS: ${c.id}`); } catch (e) { hong++; console.log(`FAIL: ${c.id} — ${e.message}`); }
}
console.log(`BN Results: ${chay.length - hong} PASS · ${hong} FAIL`);
process.exit(hong ? 1 : 0);

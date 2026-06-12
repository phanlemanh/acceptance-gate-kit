export const meta = {
  name: 'acceptance-verify',
  description: 'S4 VERIFY cua /feature-loop: machine evals (dedupe cmd) + judge panel + review, sinh evidence-report.md',
  whenToUse: 'Goi tu skill feature-loop khi contract status=implemented. args do skill chuan bi (xem comment dau file).',
  phases: [
    { title: 'Machine', detail: 'moi lenh distinct 1 agent + verify suite' },
    { title: 'Judge', detail: '3 blind judges / judgment item' },
    { title: 'Review', detail: 'invariants + code-review, adversarial verify' },
    { title: 'Synthesize', detail: 'viet evidence-report.md + verdict routing' },
  ],
}

// ===== args contract — do SKILL.md feature-loop chuẩn bị =====
// {
//   slug: 'my-feature',
//   round: 1,                          // số round verify hiện tại (1-3)
//   riskTier: 'T2' | 'T3',
//   evals: [{ id, criterion, executor,  // 'test'|'script'|'ui-check'|'judgment'
//             cmd,                      // máy: lệnh ĐÃ resolve từ config: ref
//             ref,                      // config: ref GỐC (vd 'config:executors.test.api') — synthesize ghi verifier (hook L2)
//             expected, evidence_required,
//             question, inputs }],      // judgment only; inputs = abs paths
//   suiteCommands: ['npm run build', 'npm run typecheck', ...],
//   diffBase: 'main',
//   repoRoot: '<abs repo root>',
//   personasPath: '<abs>/judge-personas.md',
//   templatePath: '<abs>/evidence-report-template.md',
//   reviewSkillPath: '<abs>/SKILL.md',  // OPTIONAL — skill review invariant riêng của repo; thiếu → review theo conventions (CLAUDE.md)
//   dryRun: false,                     // true → trả fan-out plan, KHÔNG spawn agent
// }

// args co the den dang JSON string tuy harness (xac nhan bang dry-run e2e 2026-06-11) — parse truoc khi validate
if (typeof args === 'string') {
  try { args = JSON.parse(args) } catch (e) { args = null }
}
if (!args || !Array.isArray(args.evals) || !Array.isArray(args.suiteCommands)) {
  return { verdict: 'BLOCKED', blocked: [{ cmd: '(args)', reason: 'args.evals / args.suiteCommands phai la array — skill feature-loop build args sai' }], failedEvals: [], failedCommands: [], panels: [], confirmedFindings: [], reviewIncomplete: [] }
}

const MACHINE_SCHEMA = {
  type: 'object',
  properties: {
    exitCode: { type: 'number' },
    outputTail: { type: 'string', description: '~10 dong cuoi output lien quan' },
    runId: { type: 'string', description: 'run_id tu stdout neu co, khong co thi chuoi rong' },
    cannotRun: { type: 'boolean' },
    reason: { type: 'string', description: 'ly do neu cannotRun=true' },
  },
  required: ['exitCode', 'outputTail', 'cannotRun'],
}

// ui-check (v1.1): MACHINE_SCHEMA + screenshotPath — assertion máy-kiểm + evidence file
const UI_SCHEMA = {
  type: 'object',
  properties: {
    exitCode: { type: 'number', description: '0 = moi assertion pass' },
    outputTail: { type: 'string', description: 'cac assertion da kiem + ket qua' },
    runId: { type: 'string', description: 'chuoi rong neu khong co' },
    screenshotPath: { type: 'string', description: 'path file evidence da luu (anh; fallback .html neu khong co tool chup — ghi ro trong outputTail)' },
    cannotRun: { type: 'boolean' },
    reason: { type: 'string', description: 'ly do neu cannotRun=true' },
  },
  required: ['exitCode', 'outputTail', 'cannotRun'],
}

const VERDICT_SCHEMA = {
  type: 'object',
  properties: {
    verdict: { type: 'string', enum: ['PASS', 'FAIL', 'UNCERTAIN'] },
    rationale: { type: 'string', description: '1-3 cau can cu' },
  },
  required: ['verdict', 'rationale'],
}

const FINDINGS_SCHEMA = {
  type: 'object',
  properties: {
    findings: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          file: { type: 'string' },
          line: { type: 'number' },
          severity: { type: 'string', enum: ['high', 'medium', 'low'] },
          detail: { type: 'string' },
        },
        required: ['title', 'file', 'severity', 'detail'],
      },
    },
  },
  required: ['findings'],
}

const REFUTE_SCHEMA = {
  type: 'object',
  properties: {
    refuted: { type: 'boolean', description: 'true neu finding KHONG phai van de that hoac khong du can cu' },
    reason: { type: 'string' },
  },
  required: ['refuted', 'reason'],
}

const REPORT_SCHEMA = {
  type: 'object',
  properties: {
    reportPath: { type: 'string' },
    findingsPath: { type: 'string' },
  },
  required: ['reportPath', 'findingsPath'],
}

// ---- phân loại + dedupe (thuần JS, deterministic) ----
const machineEvals = args.evals.filter(e => e.executor === 'test' || e.executor === 'script')
const judgmentEvals = args.evals.filter(e => e.executor === 'judgment')
const uiEvals = args.evals.filter(e => e.executor === 'ui-check')

// Mỗi lệnh distinct chạy đúng 1 lần, cover mọi eval trỏ tới nó (vd 1 lệnh itest cover E1-E11)
const byCmd = new Map()
for (const e of machineEvals) {
  if (!byCmd.has(e.cmd)) byCmd.set(e.cmd, [])
  byCmd.get(e.cmd).push(e.id)
}
for (const cmd of args.suiteCommands) {
  if (!byCmd.has(cmd)) byCmd.set(cmd, []) // suite command không gắn eval vẫn phải pass
}
const distinctCmds = [...byCmd.keys()]

const LENSES = ['domain-correctness', 'operational-feasibility', 'spec-alignment']

if (args.dryRun) {
  return {
    dryRun: true,
    distinctCommands: distinctCmds,
    evalsPerCommand: Object.fromEntries([...byCmd.entries()]),
    judgePanels: judgmentEvals.map(e => ({ eval: e.id, judges: LENSES.length })),
    uiCheckEvals: uiEvals.map(e => e.id),
  }
}

// khong co gi de verify → khong duoc PASS rong
if (!distinctCmds.length && !judgmentEvals.length && !uiEvals.length) {
  return { verdict: 'BLOCKED', blocked: [{ cmd: '(none)', reason: 'evals.yaml khong co eval may va khong co judgment — khong co gi de verify, kiem tra lai evals.yaml' }], failedEvals: [], failedCommands: [], panels: [], confirmedFindings: [], reviewIncomplete: [] }
}

log(`Round ${args.round}: ${distinctCmds.length} lenh may (dedupe tu ${machineEvals.length} eval + ${args.suiteCommands.length} suite), ${uiEvals.length} ui-check, ${judgmentEvals.length} judgment x ${LENSES.length} judges`)

// Review finders: repo có skill review riêng → dùng; không → review theo conventions chung
const REVIEWERS = [
  args.reviewSkillPath
    ? { key: 'invariants', prompt: `Trong repo ${args.repoRoot}: doc ${args.reviewSkillPath} va lam DUNG quy trinh cua skill do tren diff ${args.diffBase}...HEAD. Tra ve danh sach violation lam findings (title=ten check/rule, detail=vi pham gi o dau). Khong tu fix.` }
    : { key: 'conventions', prompt: `Review diff ${args.diffBase}...HEAD trong repo ${args.repoRoot} theo conventions cua repo (doc CLAUDE.md / CONTRIBUTING.md neu co): vi pham invariant kien truc, sai pattern co san, thieu validation o system boundary. CHI bao finding high-confidence. Khong tu fix.` },
  { key: 'bugs', prompt: `Review diff ${args.diffBase}...HEAD trong repo ${args.repoRoot}, tim correctness bugs va silent failures (catch nuot loi, fallback an, error bi nuot). CHI bao finding high-confidence — khong style nit, khong suy dien.` },
]

// ---- Machine + UI-check + Judge + Review chạy đồng thời (không phụ thuộc nhau; Judge là blind) ----
const [machineRaw, uiRaw, judgeRaw, reviewRaw] = await parallel([
  () => parallel(distinctCmds.map(cmd => () =>
    agent(
      `Ban la verifier doc lap, KHONG phai nguoi viet code nay (doer ≠ grader). Trong repo ${args.repoRoot}, chay dung lenh:\n\n  ${cmd}\n\nCapture TRUNG THUC: exit code that, ~10 dong output cuoi lien quan, run_id neu stdout co in (khong co thi de chuoi rong).\nKHONG sua code. KHONG dung git checkout/switch/stash/reset — repo dang o dung branch can verify, doi branch la pha hong cac verifier khac dang chay song song. KHONG chay lai nhieu lan de "cho pass". Neu lenh khong the chay (thieu env, service/DB local chua chay, script khong ton tai...) → cannotRun=true + reason cu the.`,
      { label: `machine:${cmd.slice(0, 44)}`, phase: 'Machine', schema: MACHINE_SCHEMA }
    ).then(r => r && { ...r, cmd, evals: byCmd.get(cmd) })
  )),

  // ui-check (v1.1): 1 agent/eval — chạy steps trên dev server, assertion máy-kiểm + evidence file
  () => parallel(uiEvals.map(e => () =>
    agent(
      `Ban la verifier UI doc lap, KHONG phai nguoi viet code nay (doer ≠ grader). Repo: ${args.repoRoot} (cwd cua ban).\n` +
      `Eval ${e.id} (criterion ${e.criterion}) — lam DUNG cac steps sau, theo thu tu:\n` +
      `${(e.steps || []).map((s, i) => `${i + 1}. ${s}`).join('\n')}\n` +
      `Expected: ${e.expected}\n\n` +
      `Quy tac:\n` +
      `- Tu quan dev server: start NEN (background) neu steps yeu cau, doi ready (poll HTTP toi 90s); TAT server truoc khi tra ket qua (chi tat server minh start — port dang co server san thi dung chung va KHONG tat).\n` +
      `- Assertion phai MAY-KIEM-DUOC: HTTP status + marker trong HTML/DOM (trang SSR thi curl + grep du). Ghi tung assertion + ket qua vao outputTail.\n` +
      `- Evidence file: mkdir -p thu muc truoc. Uu tien chup anh that neu co tool browser/preview (tim qua ToolSearch "preview" hoac "browser"); KHONG co tool chup thi luu HTML da assert vao path screenshot trong steps voi duoi .html va GHI RO fallback trong outputTail. Tra path vao screenshotPath.\n` +
      `- exitCode=0 CHI khi MOI assertion pass. KHONG sua code. Khong the chay (port ban khong xu ly duoc, thieu env...) → cannotRun=true + reason cu the.`,
      { label: `ui:${e.id}`, phase: 'Machine', schema: UI_SCHEMA }
    ).then(r => r && { ...r, cmd: `ui-check:${e.id}`, evals: [e.id] })
  )),

  () => parallel(judgmentEvals.flatMap(e =>
    LENSES.map(lens => () =>
      agent(
        `Ban la judge DOC LAP, context sach, lens duy nhat: ${lens}. BLIND: KHONG doc diff, KHONG doc reasoning cua nguoi code.\nDoc persona tai ${args.personasPath}, ap persona hop lens.\nDoc cac input (abs path, da resolve san): ${(e.inputs || []).join(' , ')}\n\nCau hoi phan xet (${e.id} / ${e.criterion}): ${e.question}\n\nTra verdict PASS | FAIL | UNCERTAIN + rationale 1-3 cau. UNCERTAIN khi khong du can cu — dung doan.`,
        { label: `judge:${e.id}:${lens}`, phase: 'Judge', schema: VERDICT_SCHEMA }
      ).then(v => v && { evalId: e.id, lens, ...v })
    )
  )),

  () => pipeline(
    REVIEWERS,
    d => agent(d.prompt, { label: `review:${d.key}`, phase: 'Review', schema: FINDINGS_SCHEMA }),
    (res, d) => res
      ? parallel(res.findings.map(f => () =>
          agent(
            `Adversarially verify finding sau trong repo ${args.repoRoot} (diff ${args.diffBase}...HEAD):\n"${f.title}" tai ${f.file}${f.line ? ':' + f.line : ''} — ${f.detail}\nCo BAC BO no: doc code that (Read/Grep; KHONG git checkout/switch — repo phai o nguyen branch), tim bang chung no KHONG phai van de. refuted=true neu khong chac chan day la van de that.`,
            { label: `refute:${(f.file || '').split('/').pop()}`, phase: 'Review', schema: REFUTE_SCHEMA }
          ).then(v => v
            ? (!v.refuted ? { ...f, source: d.key } : null)
            : { ...f, source: d.key, unverified: true }) // refuter chet → giu finding, danh dau chua verify
        )).then(arr => ({ key: d.key, dead: false, findings: arr.filter(Boolean) }))
      : { key: d.key, dead: true, findings: [] } // finder chet → KHONG phai "0 findings"
  ),
])

const machine = (machineRaw || []).filter(Boolean)
// ui-check kết quả hợp nhất vào machine-style (cmd ui-check:<evalId>) — routing blocked/failed dùng chung
machine.push(...(uiRaw || []).filter(Boolean))
const judges = (judgeRaw || []).filter(Boolean)
const reviewResults = (reviewRaw || []).filter(Boolean)
const confirmedFindings = reviewResults.flatMap(r => r.findings)
const reviewIncomplete = reviewResults.filter(r => r.dead).map(r => r.key)
for (const k of REVIEWERS.map(r => r.key)) {
  if (!reviewResults.some(r => r.key === k) && !reviewIncomplete.includes(k)) reviewIncomplete.push(k)
}

// ---- panel verdict per judgment eval: majority 2/3, else UNCERTAIN. CHỈ LÀ ĐỀ XUẤT cho Gate 2 ----
const panels = judgmentEvals.map(e => {
  const votes = judges.filter(j => j.evalId === e.id)
  const count = v => votes.filter(x => x.verdict === v).length
  const proposal = count('PASS') >= 2 ? 'PASS' : count('FAIL') >= 2 ? 'FAIL' : 'UNCERTAIN'
  return { evalId: e.id, proposal, votes }
})

// ---- verdict routing (kit rules) ----
const blocked = machine.filter(m => m.cannotRun)
  .map(m => ({ cmd: m.cmd, reason: m.reason || 'cannotRun khong co reason' }))
{
  const ran = new Set(machine.map(m => m.cmd))
  for (const cmd of distinctCmds.filter(c => !ran.has(c))) {
    blocked.push({ cmd, reason: 'agent bi skip/chet — khong co ket qua, khong duoc tinh la pass' })
  }
  for (const e of uiEvals.filter(e => !ran.has(`ui-check:${e.id}`))) {
    blocked.push({ cmd: `ui-check:${e.id}`, reason: 'ui-check agent bi skip/chet — khong co ket qua, khong duoc tinh la pass' })
  }
}
const failed = machine.filter(m => !m.cannotRun && m.exitCode !== 0)
const failedEvalIds = [...new Set(failed.flatMap(m => m.evals))]

const failedCommands = failed.map(m => ({ cmd: m.cmd, evals: m.evals, exitCode: m.exitCode }))

let verdict
if (blocked.length) verdict = 'BLOCKED'
else if (failed.length) verdict = 'REJECT'
else if (judgmentEvals.length && (args.riskTier === 'T3' || panels.some(p => p.proposal !== 'PASS'))) verdict = 'PENDING-JUDGMENT'
else verdict = 'PASS'

log(`Verdict: ${verdict}${failedEvalIds.length ? ' — failed: ' + failedEvalIds.join(', ') : ''}${blocked.length ? ' — blocked: ' + blocked.length + ' lenh' : ''} — findings xac nhan: ${confirmedFindings.length}`)

// ---- Synthesize: 1 agent viết evidence-report.md đúng template (hook enforce) ----
phase('Synthesize')
const report = await agent(
  `Viet evidence report cho feature "${args.slug}" round ${args.round} vao ${args.repoRoot}/_acceptance/${args.slug}/evidence-report.md (ghi de neu co — round moi thay round cu, ghi lich su round vao section Iterations).\nDoc template tai ${args.templatePath} va tuan thu TUYET DOI shape — hook acceptance-evidence-gate.js se chan neu sai (L1 SHAPE: PASS can run_id ≥4 ky tu + exit_code 0 + verifier + verified_at ISO8601; L1 CONSISTENCY: report PASS khong duoc chua token exit khac 0 hay chuoi "verdict: FAIL"; L2: verifier la config: ref hoac script path; L3: moi UNCERTAIN can human_override).\n\nVerdict DA TINH SAN (khong tu thay doi): ${verdict}\nfailed_evals: ${JSON.stringify(failedEvalIds)}\nblocked (neu BLOCKED, ghi reason vao frontmatter): ${JSON.stringify(blocked)}\nLenh fail khong gan eval (ghi ro trong report neu co): ${JSON.stringify(failedCommands)}\nReview incomplete (finder chet — ghi canh bao trong review-findings.md): ${JSON.stringify(reviewIncomplete)}\n\nKet qua may (moi block cmd cover cac eval cua no; mint run_id dang "minted-${args.slug}-<evalId>-r${args.round}" cho eval nao runId rong; block cua eval ui-check ghi them field "screenshot:" = screenshotPath tu ket qua): ${JSON.stringify(machine)}\nDinh nghia eval (ghi "verifier:" = field "ref" — config: ref GOC, hook L2 chi chap nhan config: ref hoac script path, KHONG ghi lenh resolved): ${JSON.stringify(args.evals.map(e => ({ id: e.id, criterion: e.criterion, executor: e.executor, ref: e.ref, expected: e.expected, evidence_required: e.evidence_required })))}\nJudge panels (DE XUAT — ghi de xuat panel + rationale tung judge, de human_override TRONG cho moi item; T3 thi MOI judgment item deu cho human). QUAN TRONG format: trong section judge, ghi vote dang "- <lens>: FAIL — <rationale>" / "- <lens>: PASS — ...", TUYET DOI KHONG dung chuoi "verdict: FAIL" (hook L1 CONSISTENCY scan token nay trong report PASS) — moi dissent phai hien thi day du, khong duoc om/viet lai: ${JSON.stringify(panels)}\n\nSau do viet file thu hai ${args.repoRoot}/_acceptance/${args.slug}/review-findings.md (informational, ngoai hook) liet ke findings da adversarial-verify: ${JSON.stringify(confirmedFindings)} — moi finding: title, file:line, severity, detail, source. Finding co unverified=true liet ke RIENG thanh section "Chua adversarial-verify (refuter chet)".\nTra ve reportPath va findingsPath tuyet doi.`,
  { label: 'synthesize:report', phase: 'Synthesize', schema: REPORT_SCHEMA }
)

return {
  verdict,
  failedEvals: failedEvalIds,
  failedCommands,
  blocked,
  panels: panels.map(p => ({ evalId: p.evalId, proposal: p.proposal })),
  confirmedFindings,
  reviewIncomplete,
  reportPath: report && report.reportPath,
  findingsPath: report && report.findingsPath,
}

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
//             question, inputs,           // judgment only; inputs = abs paths
//             runs }],                     // OPTIONAL int>1: eval ngẫu nhiên (LLM) chạy N lần → pass_rate + variance
//   suiteCommands: ['npm run build', 'npm run typecheck', ...],
//   diffBase: 'main',
//   repoRoot: '<abs repo root>',
//   invokedAt: '2026-07-02T10:00:00Z',   // ISO, do skill lấy bằng `date -u` (script bị cấm Date) — ts cho run-log.jsonl
//   models: { judge: 'opus', ... },      // OPTIONAL — từ config feature_loop.models.<role>; 'session' = kế thừa. Role lạ/giá trị rác bị sanitize bỏ.

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

// Scribe run-log: agent chỉ là CÂY BÚT — nội dung từng dòng do JS thuần tính sẵn
const RUNLOG_SCHEMA = {
  type: 'object',
  properties: {
    written: { type: 'boolean', description: 'true CHI khi append thanh cong du so dong' },
    lineCount: { type: 'number', description: 'so dong vua append (dem lai tu file)' },
  },
  required: ['written', 'lineCount'],
}

// Provenance đo BẰNG MÁY (3 lệnh cơ học), KHÔNG để synthesizer LLM tự quyết — giá trị thành literal cho prompt.
const PROV_SCHEMA = {
  type: 'object',
  properties: {
    bypass_used: { type: 'boolean' },
    enforcement_mode: { type: 'string', enum: ['strict', 'warn', 'off'] },
    verified_commit: { type: 'string', description: 'git rev-parse HEAD (40 hex nguyen van); khong phai git repo / loi → chuoi rong' },
  },
  required: ['bypass_used', 'enforcement_mode', 'verified_commit'],
}

// A/B baseline (đối chứng): kết quả chạy lại lệnh-CÓ-eval trên diffBase (commit gốc)
const BASELINE_SCHEMA = {
  type: 'object',
  properties: {
    results: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          cmd: { type: 'string' },
          baselineExit: { type: 'number', description: 'exit code cua lenh tren commit goc (diffBase)' },
          cannotRun: { type: 'boolean', description: 'true neu khong chay duoc tren baseline (thieu env, worktree fail, lenh chua ton tai o commit goc)' },
          reason: { type: 'string' },
        },
        required: ['cmd', 'cannotRun'],
      },
    },
  },
  required: ['results'],
}

// ===== MODEL ROUTING (logic thuần — unit-tested tại tests/workflows, case W10) =====
// Bảng route DUY NHẤT vai-trò → model. null = kế thừa model session của main loop.
// Đổi routing = đổi Ở ĐÂY (kèm sửa test W10) — không sửa rải rác trong agent().
const MODEL_ROUTES = {
  machine: 'haiku',      // chạy 1 lệnh + capture output — thuần cơ học
  ui: 'sonnet',          // nhiều bước (server lifecycle, assertion, evidence) nhưng không cần suy luận sâu
  judge: 'sonnet',       // phán xét scoped trên input đã resolve; majority 2/3 của panel bù sai số từng judge
  finder: null,          // recall bug là chỗ trí tuệ tạo giá trị — GIỮ model lớn (kế thừa session)
  refute: 'sonnet',      // kiểm 1 finding cụ thể có sẵn file:line — phạm vi hẹp
  baseline: 'sonnet',    // worktree + chạy lại lệnh trên commit gốc — cơ học có điều kiện
  provenance: 'sonnet',  // 3 lệnh cơ học, kết quả thành literal cho prompt
  scribe: 'haiku',       // chép nguyên văn dòng JSONL vào file
  synthesize: 'sonnet',  // điền template từ verdict + JSON đã tính sẵn; hook evidence-gate chặn nếu sai shape
}
// Override per-role từ repo: config.yaml `feature_loop.models.<role>` — SKILL đọc và truyền
// args.models. sanitize THUẦN (unit-tested W15/W16): chỉ nhận role có trong bảng, value string
// không rỗng; 'session' = kế thừa model main loop. Repo không khai gì → default y nguyên.
const sanitizeModels = m => {
  const out = {}
  if (m && typeof m === 'object' && !Array.isArray(m)) {
    for (const k of Object.keys(MODEL_ROUTES)) {
      const v = m[k]
      if (typeof v !== 'string' || !v.trim()) continue
      out[k] = v.trim().toLowerCase() === 'session' ? null : v.trim()
    }
  }
  return out
}
const ROUTES = { ...MODEL_ROUTES, ...sanitizeModels(args && args.models) }
const modelOpt = role => (ROUTES[role] ? { model: ROUTES[role] } : {})

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

// variance-N: số lần chạy mỗi lệnh = max(runs) trên các eval trỏ tới nó (default 1, cap 10).
// runs>1 = eval NGẪU NHIÊN (vd qua ctx.providers.invoke / generator-LLM) → cần phân phối pass-rate, không phải 1 phát.
const evalRuns = e => Math.max(1, Number.isInteger(e.runs) ? e.runs : 1)
const cmdRuns = new Map(distinctCmds.map(cmd => {
  const ns = machineEvals.filter(e => e.cmd === cmd).map(evalRuns)
  return [cmd, ns.length ? Math.min(10, Math.max(...ns)) : 1]
}))

// A/B baseline: chỉ chạy lại trên diffBase các lệnh CÓ eval (eval của feature) — để biết lệnh nào
// xanh-cả-hai-phía (không phân biệt). Suite-only cmd bỏ qua (đắt + green-on-both là regression-guard bình thường).
const baselineCmds = distinctCmds.filter(c => (byCmd.get(c) || []).length > 0)

const LENSES = ['domain-correctness', 'operational-feasibility', 'spec-alignment']

if (args.dryRun) {
  return {
    dryRun: true,
    distinctCommands: distinctCmds,
    evalsPerCommand: Object.fromEntries([...byCmd.entries()]),
    judgePanels: judgmentEvals.map(e => ({ eval: e.id, judges: LENSES.length })),
    uiCheckEvals: uiEvals.map(e => e.id),
    runsPerCommand: Object.fromEntries([...cmdRuns.entries()]),
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
const [machineRaw, uiRaw, judgeRaw, reviewRaw, baselineRaw] = await parallel([
  () => parallel(distinctCmds.flatMap(cmd => Array.from({ length: cmdRuns.get(cmd) || 1 }, (_, __i) => () =>
    agent(
      `Ban la verifier doc lap, KHONG phai nguoi viet code nay (doer ≠ grader). Trong repo ${args.repoRoot}, chay dung lenh:\n\n  ${cmd}\n\nCapture TRUNG THUC: exit code that, ~10 dong output cuoi lien quan, run_id neu stdout co in (khong co thi de chuoi rong).\nKHONG sua code. KHONG dung git checkout/switch/stash/reset — repo dang o dung branch can verify, doi branch la pha hong cac verifier khac dang chay song song. KHONG chay lai nhieu lan de "cho pass". Neu lenh khong the chay (thieu env, service/DB local chua chay, script khong ton tai...) → cannotRun=true + reason cu the.`,
      { label: `machine:${cmd.slice(0, 40)}${(cmdRuns.get(cmd) || 1) > 1 ? '#' + (__i + 1) : ''}`, phase: 'Machine', schema: MACHINE_SCHEMA, ...modelOpt('machine') }
    ).then(r => r && { ...r, cmd, runIndex: __i + 1 })
  ))),

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
      `- Evidence file: mkdir -p thu muc truoc. LUU FRAME RA FILE: neu config.yaml co "capture.ui" (lenh <cmd> <url> <out.png>, vd npm run ui:capture) thi DUNG no de luu moi frame — preview_screenshot tra anh INLINE, khong luu file duoc. NHIEU FRAME: luu 1 anh o MOI buoc co screenshot trong steps → evidence/${e.id}-step1.png, evidence/${e.id}-step2.png... (de trang bang chung phat slideshow nhu flow). Tra frame DAU vao screenshotPath; liet ke moi frame da luu vao outputTail. KHONG co capture.ui/tool chup → luu HTML da assert (duoi .html) vao screenshotPath va GHI RO fallback trong outputTail.\n` +
      `- exitCode=0 CHI khi MOI assertion pass. KHONG sua code. Khong the chay (port ban khong xu ly duoc, thieu env...) → cannotRun=true + reason cu the.`,
      { label: `ui:${e.id}`, phase: 'Machine', schema: UI_SCHEMA, ...modelOpt('ui') }
    ).then(r => r && { ...r, cmd: `ui-check:${e.id}`, evals: [e.id] })
  )),

  () => parallel(judgmentEvals.flatMap(e =>
    LENSES.map(lens => () =>
      agent(
        `Ban la judge DOC LAP, context sach, lens duy nhat: ${lens}. BLIND: KHONG doc diff, KHONG doc reasoning cua nguoi code.\nDoc persona tai ${args.personasPath}, ap persona hop lens.\nDoc cac input (abs path, da resolve san): ${(e.inputs || []).join(' , ')}\n\nCau hoi phan xet (${e.id} / ${e.criterion}): ${e.question}\n\nTra verdict PASS | FAIL | UNCERTAIN + rationale 1-3 cau. UNCERTAIN khi khong du can cu — dung doan.`,
        { label: `judge:${e.id}:${lens}`, phase: 'Judge', schema: VERDICT_SCHEMA, ...modelOpt('judge') }
      ).then(v => v && { evalId: e.id, lens, ...v })
    )
  )),

  () => pipeline(
    REVIEWERS,
    d => agent(d.prompt, { label: `review:${d.key}`, phase: 'Review', schema: FINDINGS_SCHEMA, ...modelOpt('finder') }),
    (res, d) => res
      ? parallel(res.findings.map(f => () =>
          agent(
            `Adversarially verify finding sau trong repo ${args.repoRoot} (diff ${args.diffBase}...HEAD):\n"${f.title}" tai ${f.file}${f.line ? ':' + f.line : ''} — ${f.detail}\nCo BAC BO no: doc code that (Read/Grep; KHONG git checkout/switch — repo phai o nguyen branch), tim bang chung no KHONG phai van de. refuted=true neu khong chac chan day la van de that.`,
            { label: `refute:${(f.file || '').split('/').pop()}`, phase: 'Review', schema: REFUTE_SCHEMA, ...modelOpt('refute') }
          ).then(v => v
            ? (!v.refuted ? { ...f, source: d.key } : null)
            : { ...f, source: d.key, unverified: true }) // refuter chet → giu finding, danh dau chua verify
        )).then(arr => ({ key: d.key, dead: false, findings: arr.filter(Boolean) }))
      : { key: d.key, dead: true, findings: [] } // finder chet → KHONG phai "0 findings"
  ),

  // A/B baseline (đối chứng): chạy lại lệnh-CÓ-eval trên diffBase trong worktree CÔ LẬP — KHÔNG đụng
  // cwd chính (verifier HEAD đang chạy song song ở đó). Tín hiệu PHỤ: thiếu env → cannotRun, không sao.
  () => baselineCmds.length === 0
    ? { results: [] }
    : agent(
        `Ban tinh BASELINE doi chung tren commit goc "${args.diffBase}" cho cac lenh may, de biet lenh nao xanh-ca-hai-phia (pass ca truoc lan sau = khong test gi moi cua feature).
Lam trong repo ${args.repoRoot} NHUNG TUYET DOI KHONG git checkout/switch/stash o cwd chinh — verifier HEAD dang chay song song o do. Dung worktree CO LAP:
1) WT="$(mktemp -d)/agk-baseline" ; git -C ${args.repoRoot} worktree add "$WT" ${args.diffBase}
2) De lenh chay duoc: ln -s ${args.repoRoot}/node_modules "$WT/node_modules" ; cp ${args.repoRoot}/.env.local "$WT/" 2>/dev/null (neu co). Service/DB local (vd Supabase) dung chung voi HEAD.
3) Voi cwd = "$WT", chay TUNG lenh sau, capture exit code that: ${baselineCmds.join(' , ')}
4) Don dep BAT BUOC: git -C ${args.repoRoot} worktree remove --force "$WT".
Tra results[] = {cmd, baselineExit, cannotRun, reason}. PHAN BIET 2 loai "khong chay tot tren baseline": (a) lenh/script CUA FEATURE chua ton tai o commit goc (npm "missing script", file-not-found cho chinh script eval) = eval MOI, dung ra phai FAIL tren code cu → ghi baselineExit = exit that (khac 0) va cannotRun=FALSE (day la tin hieu "phan biet", KHONG phai cannotRun); (b) moi truong/ha tang that bai khong lien quan feature (service/DB local chua chay, thieu env ma lenh can, worktree add fail) = cannotRun=TRUE. Baseline la tin hieu PHU, TUYET DOI KHONG bia exit.`,
        { label: 'baseline:diffBase', phase: 'Machine', schema: BASELINE_SCHEMA, ...modelOpt('baseline') }
      ),
])

// ---- variance-N: gộp các lần chạy của 1 lệnh → 1 entry/lệnh với pass-rate ----
const runsByCmd = new Map()
for (const r of (machineRaw || []).filter(Boolean)) {
  if (!runsByCmd.has(r.cmd)) runsByCmd.set(r.cmd, [])
  runsByCmd.get(r.cmd).push(r)
}
const machine = []
for (const cmd of distinctCmds) {
  const N = cmdRuns.get(cmd) || 1
  const rs = runsByCmd.get(cmd) || []
  if (!rs.length) continue // không kết quả nào (mọi agent chết) → blocked-detection bên dưới bắt (cmd vắng trong ran set)
  const ran = rs.filter(r => !r.cannotRun)
  const cannotRunCount = rs.length - ran.length
  const missing = Math.max(0, N - rs.length) // agent chết/null (bị filter(Boolean) loại trước khi gộp)
  // Mẫu KHÔNG đủ N lần chạy sạch (có cannotRun hoặc agent chết) → không đủ căn cứ → BLOCKED.
  // KHÔNG được tính pass-rate/variance trên mẫu thiếu: 1/5 lần chạy được mà PASS = giả mạo (đúng triết lý kit: verify được hay BLOCKED, không fake).
  if (cannotRunCount > 0 || missing > 0) {
    const firstCannot = rs.find(r => r.cannotRun)
    machine.push({ cmd, evals: byCmd.get(cmd), runs: N, passes: ran.filter(r => r.exitCode === 0).length, variance: false, cannotRun: true, reason: (firstCannot && firstCannot.reason) || `chi ${ran.length}/${N} lan chay duoc (${cannotRunCount} cannotRun, ${missing} agent chet) — khong du can cu de PASS`, exitCode: 1, runId: (ran[0] || rs[0]).runId || '', outputTail: (rs[0] || {}).outputTail || '' })
    continue
  }
  // đủ N lần chạy sạch → tính pass-rate / variance
  const passes = ran.filter(r => r.exitCode === 0).length
  const variance = ran.length > 1 && passes > 0 && passes < ran.length
  const rep = ran.find(r => r.exitCode !== 0) || ran[0] // ưu tiên lần fail làm đại diện chẩn đoán
  const exitCode = (passes === ran.length || variance) ? 0 : (rep.exitCode || 1)
  machine.push({ cmd, evals: byCmd.get(cmd), runs: ran.length, passes, variance, cannotRun: false, reason: rep.reason, exitCode, runId: rep.runId, outputTail: rep.outputTail })
}
// ui-check hợp nhất vào machine-style (luôn 1 lần): cmd ui-check:<evalId> — routing blocked/failed dùng chung
machine.push(...(uiRaw || []).filter(Boolean).map(r => ({ ...r, runs: 1, passes: !r.cannotRun && r.exitCode === 0 ? 1 : 0, variance: false })))

// ---- run-log: run_id per eval do JS THUẦN quyết (verifier có runId thật → dùng; rỗng → mint
// deterministic) + build NGUYÊN VĂN từng dòng JSONL. Synthesize CHỈ chép map này — hết quyền
// tự mint. recheck-evidence/hook đối chiếu run_id trong report với log: PASS bịa tay
// (không qua verify) bị chặn. ts từ args.invokedAt (skill đo bằng `date -u` — script bị cấm Date).
const invokedAt = typeof args.invokedAt === 'string' ? args.invokedAt : ''
const evalRunIds = {}
const runLogLines = []
for (const m of machine) {
  for (const evalId of (m.evals || [])) {
    const rid = (m.runId && String(m.runId).trim()) || `minted-${args.slug}-${evalId}-r${args.round}`
    evalRunIds[evalId] = rid
    runLogLines.push(JSON.stringify({
      ts: invokedAt, round: args.round, evalId, run_id: rid,
      exit_code: m.cannotRun ? null : m.exitCode, cmd: m.cmd,
      ...(m.runs > 1 ? { runs: m.runs, passes: m.passes } : {}),
      ...(m.cannotRun ? { cannot_run: true } : {}),
    }))
  }
}

// ---- A/B baseline: map kết quả đối chứng theo cmd; status = green | red | n-a ----
const baselineByCmd = new Map(((baselineRaw && baselineRaw.results) || []).map(b => [b.cmd, b]))
const baselineStatus = (cmd) => {
  const b = baselineByCmd.get(cmd)
  if (!b || b.cannotRun) return 'n-a'
  return b.baselineExit === 0 ? 'green' : 'red'
}
// Eval không-phân-biệt: lệnh-CÓ-eval pass trên CẢ HEAD lẫn baseline (green-on-both) → chứng minh harness, không phải feature
const nonDiscriminating = machine
  .filter(m => (byCmd.get(m.cmd) || []).length > 0 && !m.cannotRun && !m.variance && m.exitCode === 0 && baselineStatus(m.cmd) === 'green')
  .map(m => ({ cmd: m.cmd, evals: byCmd.get(m.cmd) }))
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

// variance-N: lệnh đa-lần pass-rate hỗn hợp (không 0%, không 100%) = phương sai → NGƯỜI quyết ngưỡng ở Gate 2
const varianceCmds = machine.filter(m => m.variance)

let verdict
if (blocked.length) verdict = 'BLOCKED'
else if (failed.length) verdict = 'REJECT'
else if (varianceCmds.length || (judgmentEvals.length && (args.riskTier === 'T3' || panels.some(p => p.proposal !== 'PASS')))) verdict = 'PENDING-JUDGMENT'
else verdict = 'PASS'

log(`Verdict: ${verdict}${failedEvalIds.length ? ' — failed: ' + failedEvalIds.join(', ') : ''}${blocked.length ? ' — blocked: ' + blocked.length + ' lenh' : ''}${varianceCmds.length ? ' — variance: ' + varianceCmds.length : ''} — findings xac nhan: ${confirmedFindings.length}`)

// ---- Synthesize: 1 agent viết evidence-report.md đúng template (hook enforce) ----
phase('Synthesize')
// Trim payload: lệnh PASS chỉ cần ~3 dòng output cuối làm evidence; lệnh fail/blocked giữ nguyên tail (cần cho chẩn đoán)
const machineForReport = machine.map(m => (!m.cannotRun && m.exitCode === 0 && !m.variance)
  ? { ...m, outputTail: String(m.outputTail || '').split('\n').slice(-3).join('\n') }
  : m)
const machineForReportB = machineForReport.map(m => ({ ...m, baseline: baselineStatus(m.cmd) }))
// Provenance xác định bằng máy → literal (synthesizer chỉ chép, không tự suy diễn/bỏ field trust-critical).
// Scribe chạy song song: append các dòng run-log DO JS TÍNH SẴN — agent là cây bút, không soạn nội dung.
const [prov, scribe] = await parallel([
  () => agent(
    `Chay DUNG 3 lenh, bao cao KET QUA THUC (KHONG suy dien, KHONG doan):\n1) printf '%s' "$ACCEPTANCE_GATE_BYPASS" — in ra dung "1" → bypass_used=true; rong/khac → false.\n2) Doc ${args.repoRoot}/_acceptance/config.yaml, lay field "enforcement" o cap 0 (^enforcement: strict|warn|off); thieu file/field → "strict".\n3) git -C ${args.repoRoot} rev-parse HEAD — tra ve verified_commit = chuoi 40-hex NGUYEN VAN tu stdout; lenh loi (khong phai git repo) → chuoi rong. TUYET DOI KHONG bia SHA.\nTra ve {bypass_used, enforcement_mode, verified_commit} dung ket qua 3 lenh tren.`,
    { label: 'capture:provenance', phase: 'Synthesize', schema: PROV_SCHEMA, ...modelOpt('provenance') }
  ),
  () => runLogLines.length === 0
    ? Promise.resolve({ written: true, lineCount: 0 })
    : agent(
        `Ban la scribe co hoc. APPEND chinh xac ${runLogLines.length} dong sau vao CUOI file ${args.repoRoot}/_acceptance/${args.slug}/run-log.jsonl — giu nguyen noi dung cu cua file, KHONG sua/dinh dang lai/sap xep/gop/bo dong nao:\n${runLogLines.join('\n')}\n\nCach lam: mkdir -p ${args.repoRoot}/_acceptance/${args.slug} roi dung Bash "cat >> <file> <<'RUNLOG_EOF'" voi noi dung NGUYEN VAN o tren. Xong doc lai file, xac nhan ${runLogLines.length} dong vua them co mat. Tra ve {written, lineCount} THAT — append fail thi written=false, khong bia.`,
        { label: 'scribe:run-log', phase: 'Synthesize', schema: RUNLOG_SCHEMA, ...modelOpt('scribe') }
      ),
])
const runLogWriteFailed = runLogLines.length > 0 && !(scribe && scribe.written)
if (runLogWriteFailed) log('CANH BAO: append run-log.jsonl THAT BAI — main loop phai tu append result.runLog truoc Gate 2 (hook/recheck doi chieu run_id voi log nay)')
// verified_commit sanitize bang JS thuan — khong tin agent: sai shape (khong phai hex SHA) coi nhu
// khong co (report BO field; pre-merge se NOTE "not pinned" thay vi hook chan oan ca round).
const verifiedCommit = /^[0-9a-f]{7,40}$/i.test(String((prov && prov.verified_commit) || '').trim())
  ? String(prov.verified_commit).trim().toLowerCase()
  : ''
const report = await agent(
  `Viet evidence report cho feature "${args.slug}" round ${args.round} vao ${args.repoRoot}/_acceptance/${args.slug}/evidence-report.md (ghi de neu co — round moi thay round cu, ghi lich su round vao section Iterations).\nDoc template tai ${args.templatePath} va tuan thu TUYET DOI shape — hook acceptance-evidence-gate.js se chan neu sai (L1 SHAPE: PASS can run_id ≥4 ky tu + exit_code 0 + verifier + verified_at ISO8601; L1 CONSISTENCY: report PASS khong duoc chua token exit khac 0 hay chuoi "verdict: FAIL"; L2: verifier la config: ref hoac script path; L3: moi UNCERTAIN can human_override).\n\nVerdict DA TINH SAN (khong tu thay doi): ${verdict}\nPROVENANCE — ghi NGUYEN VAN cac dong frontmatter nay (DA do bang buoc capture, TUYET DOI KHONG tu doi/suy dien/bo): "enforcement_mode: ${prov.enforcement_mode}" va "bypass_used: ${prov.bypass_used}"${verifiedCommit ? ` va "verified_commit: ${verifiedCommit}"` : ''}. CI pre-merge dung cac field nay de chan gate yeu va phat hien code doi SAU verify (stale evidence).${verifiedCommit ? ' Hook L1 chan verified_commit khong phai hex SHA — chep dung nguyen van, khong rut gon.' : ' Repo khong phai git: BO HAN field verified_commit (khong bia, khong ghi rong).'}\nfailed_evals: ${JSON.stringify(failedEvalIds)}\nblocked (neu BLOCKED, ghi reason vao frontmatter): ${JSON.stringify(blocked)}\nLenh fail khong gan eval (ghi ro trong report neu co): ${JSON.stringify(failedCommands)}\nReview incomplete (finder chet — ghi canh bao trong review-findings.md): ${JSON.stringify(reviewIncomplete)}\n\nKet qua may (moi block cmd cover cac eval cua no; block cua eval ui-check ghi them field "screenshot:" = screenshotPath tu ket qua): ${JSON.stringify(machineForReportB)}
run_id cua TUNG eval: chep NGUYEN VAN tu map nay — JS da tinh san va DA GHI vao ${args.repoRoot}/_acceptance/${args.slug}/run-log.jsonl truoc khi ban viet report; hook + CI recheck doi chieu TUNG run_id trong report voi log do (id la/khong khop = BLOCK). TUYET DOI KHONG tu mint/doi/rut gon run_id: ${JSON.stringify(evalRunIds)}
A/B BASELINE: moi block eval may ghi them field "baseline: <green|red|n-a>" lay tu field "baseline" trong ket qua may o tren (green=pass tren code cu diffBase, red=fail tren code cu nghia la eval CO phan biet, n-a=khong chay duoc tren baseline). Field baseline DUNG TU green/red/n-a, TUYET DOI KHONG ghi exit-code so o day hay trong section Analyst — hook L1 CONSISTENCY se chan oan report PASS neu thay token exit khac 0.
Them section "## Analyst" ngay sau bang ket qua: liet ke eval KHONG-PHAN-BIET (pass tren CA HEAD lan baseline, chung minh harness chu khong phai feature; nen viet lai de assert hanh vi moi hoac xac nhan la regression-guard co chu y): ${JSON.stringify(nonDiscriminating)}. Rong thi ghi "none — moi eval feature deu red tren baseline (co phan biet)". Lenh suite xanh-ca-hai-phia la regression-guard binh thuong, KHONG liet ke.
VARIANCE-N: eval co field "runs" > 1 = eval NGAU NHIEN (da chay nhieu lan, gop lai). Voi eval do ghi them "runs: <N>" va "pass_rate: <passes>/<runs>" (dang phan so vd "4/5" — DUNG so exit). Eval khong co runs hoac runs=1 (deterministic) KHONG ghi pass_rate. Eval co field "variance": true (pass_rate khac 0 va khac full) → tin hieu PHUONG SAI: feature ngau nhien chua on dinh; verdict tong DA la PENDING-JUDGMENT; ghi eval do vao section moi "## Variance" kem pass_rate de NGUOI quyet nguong o Gate 2 (giong judgment item). Eval deterministic ma variance=true = test flaky/racy → cung vao "## Variance", ghi ro "flaky".\nDinh nghia eval (ghi "verifier:" = field "ref" — config: ref GOC, hook L2 chi chap nhan config: ref hoac script path, KHONG ghi lenh resolved): ${JSON.stringify(args.evals.map(e => ({ id: e.id, criterion: e.criterion, executor: e.executor, ref: e.ref, expected: e.expected, evidence_required: e.evidence_required })))}\nJudge panels (DE XUAT — ghi de xuat panel + rationale tung judge, de human_override TRONG cho moi item; T3 thi MOI judgment item deu cho human). QUAN TRONG format: trong section judge, ghi vote dang "- <lens>: FAIL — <rationale>" / "- <lens>: PASS — ...", TUYET DOI KHONG dung chuoi "verdict: FAIL" (hook L1 CONSISTENCY scan token nay trong report PASS) — moi dissent phai hien thi day du, khong duoc om/viet lai: ${JSON.stringify(panels)}\n\nSau do viet file thu hai ${args.repoRoot}/_acceptance/${args.slug}/review-findings.md (informational, ngoai hook) liet ke findings da adversarial-verify: ${JSON.stringify(confirmedFindings)} — moi finding: title, file:line, severity, detail, source. Finding co unverified=true liet ke RIENG thanh section "Chua adversarial-verify (refuter chet)".\nTra ve reportPath va findingsPath tuyet doi.`,
  { label: 'synthesize:report', phase: 'Synthesize', schema: REPORT_SCHEMA, ...modelOpt('synthesize') }
)

return {
  verdict,
  failedEvals: failedEvalIds,
  failedCommands,
  blocked,
  panels: panels.map(p => ({ evalId: p.evalId, proposal: p.proposal })),
  confirmedFindings,
  reviewIncomplete,
  nonDiscriminating,
  variance: varianceCmds.map(m => ({ cmd: m.cmd, evals: m.evals, runs: m.runs, passRate: m.passes + '/' + m.runs })),
  // run-log provenance: các dòng JSONL đã ghi (máy tính, scribe chép). runLogWriteFailed=true
  // → main loop PHẢI tự append runLog vào _acceptance/<slug>/run-log.jsonl trước Gate 2.
  runLog: runLogLines,
  runLogWriteFailed,
  reportPath: report && report.reportPath,
  findingsPath: report && report.findingsPath,
}

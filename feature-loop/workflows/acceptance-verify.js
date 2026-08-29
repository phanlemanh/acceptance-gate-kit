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
//   toolKillRule: '<NGUYEN VAN file skills/acceptance/references/tool-kill-rule.md>',  // BAT BUOC: nguon duy nhat luat «bi cong cu giet ≠ fail»; script rut khoi marker, thieu → BLOCKED (args)
//   contractPath: '<abs>/_acceptance/<slug>/contract.md',  // input của scope-triage (finding trong/ngoài hợp đồng).
//                                      // Vắng/không đọc được → triageFailed: KHÔNG finding nào được kéo REJECT.
//   reviewSkillPath: '<abs>/SKILL.md',  // OPTIONAL — skill review invariant riêng của repo; thiếu → review theo conventions (CLAUDE.md)
//   dryRun: false,                     // true → trả fan-out plan, KHÔNG spawn agent
//
//   ── Đợt 5 (P1/P2/P3 — carry-forward): TẤT CẢ optional, thiếu → hành vi 1.11 y nguyên ──
//   carriedEvals: [{ id, runId, fromRound, verifiedAt, cmd }],
//                                      // P1: eval máy/ui KHÔNG chạy lại (delta staleness không chạm paths của eval).
//                                      // id PHẢI có trong evals (định nghĩa 1 nguồn); runId = run_id GỐC đã nằm trong
//                                      // run-log từ round fromRound → hook L2/recheck đối chiếu pass tự nhiên.
//   carriedPanels: [{ evalId, proposal, votes: [{lens, verdict}], fromRound, inputsHash }],
//                                      // P3: panel giữ nguyên từ round trước (inputs_hash khớp) — KHÔNG spawn judge.
//   runBaseline: true,                 // P2: false → không spawn baseline agent (evals.yaml không đổi từ lần baseline cuối)
//   carriedAnalyst: { fromRound, nonDiscriminating: [{cmd, evals}] },  // P2: Analyst carry khi runBaseline=false
//   evalsHash: '<sha256 evals.yaml>',  // P2: ghi vào dòng run-log kind:"baseline" cho round sau so hash
//   (judgment eval thêm optional inputsHash: '<sha256 question+inputs>' — ghi vào dòng run-log kind:"panel")
// }

// args co the den dang JSON string tuy harness (xac nhan bang dry-run e2e 2026-06-11) — parse truoc khi validate
if (typeof args === 'string') {
  try { args = JSON.parse(args) } catch (e) { args = null }
}
if (!args || !Array.isArray(args.evals) || !Array.isArray(args.suiteCommands)) {
  return { verdict: 'BLOCKED', blocked: [{ cmd: '(args)', reason: 'args.evals / args.suiteCommands phai la array — skill feature-loop build args sai' }], failedEvals: [], failedCommands: [], panels: [], confirmedFindings: [], reviewIncomplete: [] }
}

// Luật chống «hạ tầng mạo danh vật» (TOOL-KILL-RULE): verifier chạy lệnh qua
// Bash tool có trần thời gian mặc định (~120s) NGẮN hơn nhiều suite — lệnh bị
// công cụ giết trả exit code CỦA CÔNG CỤ, không phải của lệnh (vấp thật
// release-2-2-0 S4 r5). MỘT NGUỒN duy nhất của luật là file
// skills/acceptance/references/tool-kill-rule.md của plugin acceptance-gate
// (khối marker <<<TOOL-KILL-RULE … TOOL-KILL-RULE>>>) — script này KHÔNG chép
// câu luật: main loop của skill feature-loop đọc file (resolve-plugin --require)
// và truyền NGUYÊN VĂN vào args.toolKillRule; dưới đây chỉ RÚT khối (tách theo
// dòng giữa hai marker) và nội suy vào prompt cả 3 lane (machine/ui/baseline).
// Thiếu args / không rút được marker → BLOCKED có tên, KHÔNG fallback chuỗi cứng
// (fallback chính là bản chép thứ hai). Nhận diện là việc AGENT; JS chỉ phòng
// thủ trên field cấu trúc killedByTool (normKill dưới) — KHÔNG grep output.
const TOOL_KILL_RULE = (() => {
  const src = typeof args.toolKillRule === 'string' ? args.toolKillRule : ''
  const lines = src.split('\n')
  const a = lines.findIndex(l => l.includes('<<<TOOL-KILL-RULE'))
  const b = lines.findIndex(l => l.includes('TOOL-KILL-RULE>>>'))
  if (a === -1 || b === -1 || b <= a) return ''
  return lines.slice(a + 1, b).join('\n').trim()
})()
if (!TOOL_KILL_RULE) {
  return { verdict: 'BLOCKED', blocked: [{ cmd: '(args)', reason: 'args.toolKillRule thieu hoac khong chua marker TOOL-KILL-RULE — skill feature-loop phai truyen NGUYEN VAN file skills/acceptance/references/tool-kill-rule.md cua plugin acceptance-gate (resolve-plugin.mjs --require); khong co luat nay verifier se doc exit code cua cong cu nhu exit code cua lenh' }], failedEvals: [], failedCommands: [], panels: [], confirmedFindings: [], reviewIncomplete: [] }
}

const KILLED_BY_TOOL_FIELD = { type: 'boolean', description: 'true khi lenh bi CONG CU dung (timeout tool/output cat) — exit code khong phai cua lenh; di kem cannotRun=true' }

const MACHINE_SCHEMA = {
  type: 'object',
  properties: {
    exitCode: { type: 'number' },
    outputTail: { type: 'string', description: '~10 dong cuoi output lien quan' },
    runId: { type: 'string', description: 'run_id tu stdout neu co, khong co thi chuoi rong' },
    cannotRun: { type: 'boolean' },
    killedByTool: KILLED_BY_TOOL_FIELD,
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
    observed: { type: 'string', description: 'mo ta NOI DUNG nhin thay trong TUNG frame da luu (da mo bang Read, doi chieu expected); chuoi rong neu cannotRun/khong co frame' },
    networkObserved: { type: 'string', description: 'NETWORK TRUTH vocab CHU: clean | no-app-traffic | third-party-only | app-fail | n-a (driver) | n-a (tool-error: <ly do>) | unscoped | unscoped-partial — theo luat scoping trong prompt; driver khong doc duoc network → "n-a (driver)"; TUYET DOI khong ghi so status/exit vao field nay' },
    cannotRun: { type: 'boolean' },
    killedByTool: KILLED_BY_TOOL_FIELD,
    reason: { type: 'string', description: 'ly do neu cannotRun=true' },
  },
  required: ['exitCode', 'outputTail', 'cannotRun'],
}

const VERDICT_SCHEMA = {
  type: 'object',
  properties: {
    verdict: { type: 'string', enum: ['PASS', 'FAIL', 'UNCERTAIN'] },
    rationale: { type: 'string', description: '1-3 cau can cu' },
    required_evidence: { type: 'array', items: { type: 'string' }, description: 'BAT BUOC (nghi thuc) khi verdict khac PASS: moi muc la MOT bang chung cu the + cho lay no, du de "co muc nay thi verdict doi". PASS thi bo qua.' },
  },
  required: ['verdict', 'rationale'],
}

// judge-required-evidence: dấu ghim khi judge không-PASS mà bỏ trống danh sách
// bằng-chứng-thiếu — máy KHÔNG bịa hộ, dấu này chảy vào memo + report cho
// người thấy (đo O3). Chuỗi phải khớp token trong evidence-report-template.
const MISSING_EVIDENCE_MARK = '(judge không nêu bằng-chứng-thiếu)'
const normalizeVote = v => {
  if (!v) return v
  if (v.verdict === 'PASS') { const { required_evidence, ...rest } = v; return rest }
  const re = (Array.isArray(v.required_evidence) ? v.required_evidence : []).map(x => String(x).trim()).filter(Boolean)
  return { ...v, required_evidence: re.length ? re : [MISSING_EVIDENCE_MARK] }
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

// Scope-triage: finding da qua refuter DEU la loi THAT — cau hoi con lai la
// "co trong hop dong khong". Ba ngan: in-contract (co acRef) · out-of-contract
// (co proposal cho nguoi o Gate 2) · unclassified (buoc phan loai hong).
const TRIAGE_SCHEMA = {
  type: 'object',
  properties: {
    triaged: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string', description: 'chep NGUYEN VAN title cua finding duoc phan loai' },
          file: { type: 'string', description: 'chep NGUYEN VAN file cua finding — title KHONG duy nhat, (file,title) moi la khoa' },
          inContract: { type: 'boolean', description: 'true CHI khi finding lam mot AC cua contract that bai' },
          acRef: { type: 'string', description: 'id AC bi cham (vd AC-3) khi inContract=true; chuoi rong khi false' },
          rationale: { type: 'string', description: '1 cau: vi sao trong/ngoai hop dong' },
          plain: { type: 'string', description: 'CHI khi inContract=false: 1-2 cau NGON NGU SAN PHAM mo ta hau qua cho nguoi dung — day la chu THE Cong 2 in ra cho nguoi quyet doc. Cam ten ham, duong dan file, ma thoat, thuat ngu regex/schema. Chuoi rong khi inContract=true' },
          proposal: { type: 'string', enum: ['known-limits', 'new-contract', ''], description: 'CHI khi inContract=false: de xuat cho nguoi o Gate 2; chuoi rong khi inContract=true' },
        },
        required: ['title', 'file', 'inContract', 'acRef', 'rationale', 'proposal', 'plain'],
      },
    },
    contractUnreadable: { type: 'boolean', description: 'true khi KHONG doc duoc contract — bat buoc bao that, tuyet doi khong doan phan loai tu tri nho' },
  },
  required: ['triaged', 'contractUnreadable'],
}

// Synthesize TRẢ VỀ NỘI DUNG hai file, KHÔNG ghi file. Vì sao: run-log phải nằm
// trên đĩa TRƯỚC evidence-report (hook L2 đối chiếu run_id trong report với log),
// mà run-log do main loop append sau khi workflow trả về — nên report cũng phải
// để main loop ghi, SAU log. Đồng thời bỏ nốt bề mặt "agent ghi file audit"
// (agent scribe đã bị bỏ cùng lý do — xem comment ở khối provenance).
const REPORT_SCHEMA = {
  type: 'object',
  properties: {
    report: { type: 'string', description: 'NOI DUNG evidence-report.md day du theo template — main loop ghi file SAU khi append run-log' },
    findings: { type: 'string', description: 'NOI DUNG review-findings.md day du — main loop ghi file' },
  },
  required: ['report', 'findings'],
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
          killedByTool: KILLED_BY_TOOL_FIELD,
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
  triage: 'sonnet',      // đối chiếu finding với văn bản contract — không đọc code, không cần model lớn
  finder: null,          // recall bug là chỗ trí tuệ tạo giá trị — GIỮ model lớn (kế thừa session)
  refute: 'sonnet',      // kiểm 1 finding cụ thể có sẵn file:line — phạm vi hẹp
  baseline: 'sonnet',    // worktree + chạy lại lệnh trên commit gốc — cơ học có điều kiện
  provenance: 'sonnet',  // 3 lệnh cơ học, kết quả thành literal cho prompt
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
// [wf-label:] dòng đầu prompt — harness KHÔNG ghi opts.label xuống transcript agent-*.jsonl;
// scripts/wf-usage.mjs (đo model/token per vai trò, 0-token) map transcript → role bằng tag này.
const agentT = (prompt, opts) => agent(`[wf-label: ${opts.label}]\n${prompt}`, opts)

// ---- Guard fail-loud: field mà prompt fan-out NỘI SUY THẲNG vào ----
// Thiếu = agent nhận "undefined"/chuỗi rỗng làm đề bài rồi vẫn trả PASS. Đo được
// ở motion-floor r1-r2 (judgment thiếu `question` → panel PASS 3/3 vào report).
// Executor lạ/vắng còn tệ hơn: không khớp bộ lọc nào bên dưới nên eval bị bỏ rơi
// IM LẶNG — không chạy, không blocked, không failed, verdict vẫn PASS.
// Kiểm NGUYÊN BỘ args.evals, TRƯỚC mọi lọc carry-forward và TRƯỚC dryRun: soi
// "tươi" thôi là tự mở lại đúng cửa hậu vừa đóng (panel carried của E6).
// Test RÚT bảng dưới đây TỪ MARKER, không chép tay — hai bên không được trôi.
// judgment `inputs` CỐ Ý không nằm trong bảng: vắng/rỗng đi nhánh UNCERTAIN
// (thiếu căn cứ ≠ hỏng khuôn), chỉ SAI KIỂU mới là hỏng khuôn.
// Bảng VÀ hai vị từ đọc nó nằm CÙNG trong marker: phép đo tồn kho rút cả ba rồi
// áp y nguyên. Để vị từ ngoài marker là mời test viết lại luật — và bản viết lại
// yếu hơn bản thật thì phép đo xanh trong khi lần chạy thật BLOCKED.
// <<<EVAL-REQUIRED-FIELDS
const EVAL_REQUIRED = {
  'test': { str: ['id', 'criterion', 'cmd'], arr: [] },
  'script': { str: ['id', 'criterion', 'cmd'], arr: [] },
  'ui-check': { str: ['id', 'criterion', 'expected'], arr: ['steps'] },
  'judgment': { str: ['id', 'criterion', 'question'], arr: [] },
}
const isBlankStr = v => typeof v !== 'string' || !v.trim()
const badStrArray = v => !Array.isArray(v) || !v.length || v.some(x => isBlankStr(x))
// judgment `inputs` KHÔNG ở bảng str/arr vì nó có HAI mức nặng riêng, và CẢ HAI
// phải nằm trong marker: S4-r1 đưa hai vị từ trên vào nhưng bỏ quên hai cái này,
// nên phép đo tồn kho lại chép tay và lại lệch engine theo cả hai chiều.
const badInputsShape = v => v !== undefined && v !== null && (!Array.isArray(v) || v.some(isBlankStr))
const isUngroundedInputs = v => !Array.isArray(v) || !v.length
// EVAL-REQUIRED-FIELDS>>>

const evalProblems = []
args.evals.forEach((e, i) => {
  const nm = (e && typeof e.id === 'string' && e.id.trim()) ? e.id.trim() : `#${i} (khong co id)`
  if (!e || typeof e !== 'object') { evalProblems.push(`${nm}: khong phai object`); return }
  // hasOwnProperty, KHÔNG phải EVAL_REQUIRED[x]: tra thẳng trên object literal thì
  // khoá kế thừa từ prototype trả về truthy — executor 'constructor'/'__proto__'/
  // 'toString' lọt qua nhánh fail-loud rồi ném TypeError ở spec.str. Đúng ca
  // "executor lạ" mà guard này sinh ra để bắt.
  const spec = (typeof e.executor === 'string' && Object.prototype.hasOwnProperty.call(EVAL_REQUIRED, e.executor))
    ? EVAL_REQUIRED[e.executor] : null
  if (!spec) {
    evalProblems.push(`${nm}: executor ${e.executor === undefined ? 'VANG' : JSON.stringify(e.executor)} khong thuoc {test, script, ui-check, judgment} — eval nay se bi bo roi im lang`)
    return
  }
  for (const f of spec.str) if (isBlankStr(e[f])) evalProblems.push(`${nm}: thieu field "${f}"`)
  for (const f of spec.arr) if (badStrArray(e[f])) evalProblems.push(`${nm}: field "${f}" phai la mang chuoi khong rong`)
  if (e.executor === 'judgment' && badInputsShape(e.inputs)) {
    evalProblems.push(!Array.isArray(e.inputs)
      ? `${nm}: field "inputs" phai la mang`
      : `${nm}: field "inputs" co phan tu khong phai chuoi`)
  }
})
if (evalProblems.length) {
  log(`evals.yaml khai thieu ${evalProblems.length} cho — BLOCKED truoc khi fan-out, 0 agent`)
  return {
    verdict: 'BLOCKED',
    blocked: [{ cmd: '(evals)', reason: `evals.yaml khai thieu field bat buoc — sua file roi chay lai CUNG round nay: ${evalProblems.join(' ; ')}` }],
    failedEvals: [], failedCommands: [], panels: [], confirmedFindings: [], reviewIncomplete: [],
  }
}

// ---- Đợt 5 carry-forward (P1/P2/P3) — sanitize thuần; args thiếu → hành vi cũ y nguyên ----
// P1: chỉ nhận carried cho eval máy/ui CÓ TRONG args.evals (định nghĩa eval giữ 1 nguồn duy nhất).
const evalById = new Map(args.evals.map(e => [e.id, e]))
const carriedEvals = (Array.isArray(args.carriedEvals) ? args.carriedEvals : []).filter(c =>
  c && typeof c.id === 'string' && typeof c.runId === 'string' && c.runId
  && evalById.has(c.id) && evalById.get(c.id).executor !== 'judgment')
const carriedEvalIds = new Set(carriedEvals.map(c => c.id))
const runBaseline = args.runBaseline !== false // P2 — default true (tương thích ngược)

// ---- phân loại + dedupe (thuần JS, deterministic) ----
const machineEvals = args.evals.filter(e => (e.executor === 'test' || e.executor === 'script') && !carriedEvalIds.has(e.id))
const judgmentEvals = args.evals.filter(e => e.executor === 'judgment')
const uiEvals = args.evals.filter(e => e.executor === 'ui-check' && !carriedEvalIds.has(e.id))
// Thiếu CĂN CỨ ≠ hỏng KHUÔN: câu hỏi hỏi được, chỉ là chưa ai khai vật để đọc.
// Không spawn judge (họ sẽ phán từ hư không — đo được: panel trả PASS trên eval
// 0 input); chèn panel UNCERTAIN cơ học → routing đẩy PENDING-JUDGMENT → người
// quyết ở Gate 2. Cũng là đường đọc-cũ cho workspace đã ký khai judgment không
// có inputs (gate-card-ac-visibility E11/E12) — không bắt migrate hàng loạt.
const ungroundedIds = new Set(judgmentEvals.filter(e => isUngroundedInputs(e.inputs)).map(e => e.id))
// P3: panel carried chỉ hợp lệ khi trỏ đúng judgment eval hiện có + proposal hợp lệ.
// ungrounded LOẠI khỏi carried: panel cũ KHÔNG được ghi đè nhánh UNCERTAIN, nếu
// không thì một panel PASS 3/3 giả carry vô hạn (kịch bản E6 motion-floor).
const carriedPanels = (Array.isArray(args.carriedPanels) ? args.carriedPanels : []).filter(p =>
  p && typeof p.evalId === 'string' && judgmentEvals.some(e => e.id === p.evalId)
  && !ungroundedIds.has(p.evalId)
  && (p.proposal === 'PASS' || p.proposal === 'FAIL' || p.proposal === 'UNCERTAIN'))
const carriedPanelIds = new Set(carriedPanels.map(p => p.evalId))
const freshJudgmentEvals = judgmentEvals.filter(e => !carriedPanelIds.has(e.id) && !ungroundedIds.has(e.id))

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
// P2: runBaseline=false (evals.yaml không đổi từ lần baseline cuối) → không đo lại — tín hiệu
// "phân biệt/không" là thuộc tính của (eval, code); Analyst carry từ carriedAnalyst.
const baselineCmds = runBaseline ? distinctCmds.filter(c => (byCmd.get(c) || []).length > 0) : []

const LENSES = ['domain-correctness', 'operational-feasibility', 'spec-alignment']

if (args.dryRun) {
  return {
    dryRun: true,
    distinctCommands: distinctCmds,
    evalsPerCommand: Object.fromEntries([...byCmd.entries()]),
    judgePanels: freshJudgmentEvals.map(e => ({ eval: e.id, judges: LENSES.length })),
    uiCheckEvals: uiEvals.map(e => e.id),
    ungroundedJudgments: [...ungroundedIds],
    runsPerCommand: Object.fromEntries([...cmdRuns.entries()]),
    carriedEvals: carriedEvals.map(c => c.id),
    carriedPanels: carriedPanels.map(p => p.evalId),
    runBaseline,
  }
}

// khong co gi de verify → khong duoc PASS rong. Carried KHÔNG tính là fresh: round toàn
// carry-forward mà suite rỗng = không có gì xác nhận CÂY CODE MỚI → BLOCKED, không PASS chay.
if (!distinctCmds.length && !freshJudgmentEvals.length && !uiEvals.length) {
  const reason = (carriedEvals.length || carriedPanels.length)
    ? 'toan bo eval/panel deu carry-forward va suite rong — khong co gi FRESH verify cay code moi cua round nay; them feature_loop.suite_keys hoac thu hep paths cua eval'
    : ungroundedIds.size
      // Nói ĐÚNG sự thật: judgment CÓ tồn tại, chỉ là không khai inputs nên máy
      // không chấm được, và không còn eval máy/suite nào xác nhận cây code mới.
      // Thông điệp cũ ("khong co judgment") sai sự thật và chỉ người sửa nhầm chỗ.
      ? `${ungroundedIds.size} judgment eval (${[...ungroundedIds].join(', ')}) khong khai inputs nen may khong cham duoc, va khong co eval may/suite nao xac nhan cay code moi — khai inputs cho cac eval do, hoac them feature_loop.suite_keys`
      : 'evals.yaml khong co eval may va khong co judgment — khong co gi de verify, kiem tra lai evals.yaml'
  return { verdict: 'BLOCKED', blocked: [{ cmd: '(none)', reason }], failedEvals: [], failedCommands: [], panels: [], confirmedFindings: [], reviewIncomplete: [] }
}

log(`Round ${args.round}: ${distinctCmds.length} lenh may (dedupe tu ${machineEvals.length} eval + ${args.suiteCommands.length} suite), ${uiEvals.length} ui-check, ${freshJudgmentEvals.length} judgment x ${LENSES.length} judges`
  + (carriedEvals.length ? ` — carried ${carriedEvals.length} eval (P1)` : '')
  + (carriedPanels.length ? ` — carried ${carriedPanels.length} panel (P3)` : '')
  + (runBaseline ? '' : ' — baseline carried (P2)'))

// Sáu hình dạng lỗi đo-lường (matrix-measure-law — chưng cất từ baseline B4
// ≥13 round bị đốt + 4 hình dạng CLAUDE.md "thước gắn vào vật"). MỘT CHỖ:
// prompt finder `measurement` build từ danh sách này; test pin ba-chiều
// (pin-độc-lập ↔ const này ↔ prompt) + mutation từng phần tử.
const MEASUREMENT_SHAPES = [
  'Đo CHỈ DẪN thay vì ĐẦU RA (grep file hướng dẫn trong khi renderer không đọc key).',
  'Fixture VIẾT TAY đúng khuôn bên đọc — không round-trip rút-từ-writer-đọc-bằng-reader.',
  'Assert "chuỗi có mặt" trong khi lời hứa là QUAN HỆ giữa các giá trị.',
  'Assertion âm-tính-một-mình: không đối chứng dương, không ghim thông điệp.',
  'Tuyên quét LỚP nhưng chỉ có điểm-case — thiếu ma trận toàn phần viết-trước (số assert = số phần tử, mẫu P105).',
  'Đường dẫn hardcode ROOT — đo checkout của tác giả thay vì cây đang kiểm.',
]

// Review finders: repo có skill review riêng → dùng; không → review theo conventions chung
const REVIEWERS = [
  args.reviewSkillPath
    ? { key: 'invariants', prompt: `Trong repo ${args.repoRoot}: doc ${args.reviewSkillPath} va lam DUNG quy trinh cua skill do tren diff ${args.diffBase}...HEAD. Tra ve danh sach violation lam findings (title=ten check/rule, detail=vi pham gi o dau). Khong tu fix.` }
    : { key: 'conventions', prompt: `Review diff ${args.diffBase}...HEAD trong repo ${args.repoRoot} theo conventions cua repo (doc CLAUDE.md / CONTRIBUTING.md neu co): vi pham invariant kien truc, sai pattern co san, thieu validation o system boundary. CHI bao finding high-confidence. Khong tu fix.` },
  { key: 'bugs', prompt: `Review diff ${args.diffBase}...HEAD trong repo ${args.repoRoot}, tim correctness bugs va silent failures (catch nuot loi, fallback an, error bi nuot). CHI bao finding high-confidence — khong style nit, khong suy dien.` },
  // matrix-measure-law: lens do-luong — san loi trong chinh cac PHEP DO cua diff
  { key: 'measurement', prompt: `Review CAC FILE KIEM THU/EVAL trong diff ${args.diffBase}...HEAD cua repo ${args.repoRoot} (cac file test/spec, tests/**, evals.yaml, fixtures — bo qua file khong phai phep do; diff khong cham phep do nao thi tra findings rong). San DUNG 6 hinh dang loi do-luong sau, CHI bao finding high-confidence (thay RO trong code, khong suy dien y dinh), khong style-nit, khong tu fix, khong phan xu pham-vi (viec cua triage):\n${MEASUREMENT_SHAPES.map((s, i) => `${i + 1}. ${s}`).join('\n')}\nMoi finding: title goi TEN hinh dang bi pham + detail chi dong/assert cu the va vi sao no la hinh dang do.` },
]

// ---- Machine + UI-check + Judge + Review chạy đồng thời (không phụ thuộc nhau; Judge là blind) ----
const [machineRaw, uiRaw, judgeRaw, reviewRaw, baselineRaw] = await parallel([
  () => parallel(distinctCmds.flatMap(cmd => Array.from({ length: cmdRuns.get(cmd) || 1 }, (_, __i) => () =>
    agentT(
      `Ban la verifier doc lap, KHONG phai nguoi viet code nay (doer ≠ grader). Trong repo ${args.repoRoot}, chay dung lenh:\n\n  ${cmd}\n\nCapture TRUNG THUC: exit code that, ~10 dong output cuoi lien quan, run_id neu stdout co in (khong co thi de chuoi rong).\nKHONG sua code. KHONG dung git checkout/switch/stash/reset — repo dang o dung branch can verify, doi branch la pha hong cac verifier khac dang chay song song. KHONG chay lai nhieu lan de "cho pass". Neu lenh khong the chay (thieu env, service/DB local chua chay, script khong ton tai...) → cannotRun=true + reason cu the.\n\n${TOOL_KILL_RULE}`,
      { label: `machine:${cmd.slice(0, 40)}${(cmdRuns.get(cmd) || 1) > 1 ? '#' + (__i + 1) : ''}`, phase: 'Machine', schema: MACHINE_SCHEMA, ...modelOpt('machine') }
    ).then(r => r && { ...r, cmd, runIndex: __i + 1 })
  ))),

  // ui-check (v1.1): 1 agent/eval — chạy steps trên dev server, assertion máy-kiểm + evidence file
  () => parallel(uiEvals.map(e => () =>
    agentT(
      `Ban la verifier UI doc lap, KHONG phai nguoi viet code nay (doer ≠ grader). Repo: ${args.repoRoot} (cwd cua ban).\n` +
      `Eval ${e.id} (criterion ${e.criterion}) — lam DUNG cac steps sau, theo thu tu:\n` +
      `${(e.steps || []).map((s, i) => `${i + 1}. ${s}`).join('\n')}\n` +
      `Expected: ${e.expected}\n\n` +
      `Quy tac:\n` +
      `- Tu quan dev server: start NEN (background) neu steps yeu cau, doi ready (poll HTTP toi 90s); TAT server truoc khi tra ket qua (chi tat server minh start — port dang co server san thi dung chung va KHONG tat).\n` +
      `- Assertion phai MAY-KIEM-DUOC: HTTP status + marker trong HTML/DOM (trang SSR thi curl + grep du). Ghi tung assertion + ket qua vao outputTail.\n` +
      `- Evidence file: mkdir -p thu muc truoc. LUU FRAME RA FILE: neu config.yaml co "capture.ui" (lenh <cmd> <url> <out.png>, vd npm run ui:capture) thi DUNG no de luu moi frame — preview_screenshot tra anh INLINE, khong luu file duoc. NHIEU FRAME: luu 1 anh o MOI buoc co screenshot trong steps → evidence/${e.id}-step1.png, evidence/${e.id}-step2.png... (de trang bang chung phat slideshow nhu flow). Tra frame DAU vao screenshotPath; liet ke moi frame da luu vao outputTail. KHONG co capture.ui/tool chup → luu HTML da assert (duoi .html) vao screenshotPath va GHI RO fallback trong outputTail.\n` +
      `- observed (BAT BUOC khi co frame): MO TUNG file frame vua luu bang Read (anh doc truc tiep; .html doc noi dung file) roi VIET field observed = thay gi CU THE trong tung frame, doi chieu Expected. KHONG viet observed tu tri nho lenh/steps — phai doc file that. Neu noi dung frame MAU THUAN Expected → assertion do FAIL: exitCode phai khac 0 du lenh exit 0.\n` +
      `- NETWORK TRUTH (mo rong rail observed tu pixels sang wire): NEU driver la browser tool co duong doc network (read_network_requests / read_console_messages hoac tuong duong) — SAU khi chay xong steps: doc failed requests + console errors, dump tho vao evidence/${e.id}-network.txt (mkdir -p truoc). Luat scoping: FAIL-eligible = fetch/XHR toi origin cua config dev_server.url HOAC prefix trong dev_server.api_base (co the la LIST); third-party (analytics/CDN/tracker) KHONG BAO GIO fail; static asset (.map/favicon/anh/font) ke ca app-origin → chi note. Trong tap FAIL-eligible: connection-error/timeout/status tu 500 tro len → eval FAIL: exitCode phai khac 0 KE CA khi frame dep; loi 4xx → FAIL TRU KHI expected cua eval khai dung status do. Dien field networkObserved bang VOCAB CHU (cam so status/exit): "clean" = CO thay traffic app-scope va tat ca OK — khong thay request app nao thi PHAI ghi "no-app-traffic" (cam ghi clean khi khong co traffic); "third-party-only" = chi third-party fail; "app-fail" = co request FAIL-eligible fail; "unscoped" = config chua khai dev_server.url/api_base; "unscoped-partial" = thay XHR toi origin la ngoai scope da khai (note-only); driver khong doc duoc network (curl+grep, capture-only) → "n-a (driver)"; tool doc network tu loi → "n-a (tool-error: <ly do ngan>)" kem chi tiet trong outputTail. Cac gia tri n-a/unscoped/no-app-traffic KHONG lam eval fail.\n` +
      `- exitCode=0 CHI khi MOI assertion pass. KHONG sua code. Khong the chay (port ban khong xu ly duoc, thieu env...) → cannotRun=true + reason cu the.\n` +
      `- ${TOOL_KILL_RULE}`,
      { label: `ui:${e.id}`, phase: 'Machine', schema: UI_SCHEMA, ...modelOpt('ui') }
    ).then(r => r && { ...r, cmd: `ui-check:${e.id}`, evals: [e.id] })
  )),

  () => parallel(freshJudgmentEvals.flatMap(e =>
    LENSES.map(lens => () =>
      agentT(
        `Ban la judge DOC LAP, context sach, lens duy nhat: ${lens}. BLIND: KHONG doc diff, KHONG doc reasoning cua nguoi code.\nDoc persona tai ${args.personasPath}, ap persona hop lens.\nCHI duoc doc dung cac file liet ke o dong "Input:" duoi day, cong file persona o tren. Danh sach do la DAY DU: file nao KHONG co ten trong do deu ngoai pham vi, ke ca khi no co ve lien quan hay co ten nghe quan trong. Luat nay theo QUAN HE (co-trong-danh-sach hay khong), KHONG theo loai file — cung mot ten file co the la input hop le cua eval nay va ngoai pham vi cua eval khac.\nInput: ${(e.inputs || []).join(' , ')}\n\nThay danh sach tren KHONG du can cu de phan → do la ly do tra UNCERTAIN, TUYET DOI KHONG phai ly do di tim file khac de tu cuu. Tu chon them mot artifact roi phan tu no la pha hong tinh doc lap cua hoi dong: ban se dang cham bang mot tieu chi khong ai duyet.\n\nCau hoi phan xet (${e.id} / ${e.criterion}): ${e.question}\n\nTra verdict PASS | FAIL | UNCERTAIN + rationale 1-3 cau. UNCERTAIN khi khong du can cu — dung doan.\nVerdict khac PASS thi BAT BUOC dien required_evidence: >=1 muc, MOI muc la MOT bang chung cu the + CHO LAY no (file/lenh/anh nao), du de "neu co muc nay thi verdict doi" — khong loi khuyen chung chung, khong doi bang chung vo han de ne phan. PASS thi bo qua field nay.`,
        { label: `judge:${e.id}:${lens}`, phase: 'Judge', schema: VERDICT_SCHEMA, ...modelOpt('judge') }
      ).then(v => v && { evalId: e.id, lens, ...v })
    )
  )),

  () => pipeline(
    REVIEWERS,
    d => agentT(d.prompt, { label: `review:${d.key}`, phase: 'Review', schema: FINDINGS_SCHEMA, ...modelOpt('finder') }),
    (res, d) => res
      ? parallel(res.findings.map(f => () =>
          agentT(
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
    : agentT(
        `Ban tinh BASELINE doi chung tren commit goc "${args.diffBase}" cho cac lenh may, de biet lenh nao xanh-ca-hai-phia (pass ca truoc lan sau = khong test gi moi cua feature).
Lam trong repo ${args.repoRoot} NHUNG TUYET DOI KHONG git checkout/switch/stash o cwd chinh — verifier HEAD dang chay song song o do. Dung worktree CO LAP:
1) WT="$(mktemp -d)/agk-baseline" ; git -C ${args.repoRoot} worktree add "$WT" ${args.diffBase}
2) De lenh chay duoc: ln -s ${args.repoRoot}/node_modules "$WT/node_modules" ; cp ${args.repoRoot}/.env.local "$WT/" 2>/dev/null (neu co). Service/DB local (vd Supabase) dung chung voi HEAD.
3) Voi cwd = "$WT", chay TUNG lenh sau, capture exit code that: ${baselineCmds.join(' , ')}
4) Don dep BAT BUOC: git -C ${args.repoRoot} worktree remove --force "$WT".
Tra results[] = {cmd, baselineExit, cannotRun, reason}. PHAN BIET 2 loai "khong chay tot tren baseline": (a) lenh/script CUA FEATURE chua ton tai o commit goc (npm "missing script", file-not-found cho chinh script eval) = eval MOI, dung ra phai FAIL tren code cu → ghi baselineExit = exit that (khac 0) va cannotRun=FALSE (day la tin hieu "phan biet", KHONG phai cannotRun); (b) moi truong/ha tang that bai khong lien quan feature (service/DB local chua chay, thieu env ma lenh can, worktree add fail) = cannotRun=TRUE. Baseline la tin hieu PHU, TUYET DOI KHONG bia exit.\n${TOOL_KILL_RULE}`,
        { label: 'baseline:diffBase', phase: 'Machine', schema: BASELINE_SCHEMA, ...modelOpt('baseline') }
      ),
])

// killedByTool ⇒ cannotRun: không tin một lời khai đơn lẻ — đúng ca sự cố
// (agent khai cannotRun=false + exitCode=1 khi lệnh bị giết). reason agent giữ
// NGUYÊN VĂN nếu có; trống → điền khuôn ghim để card BLOCKED không rỗng.
// Áp cho CẢ BA lane trước mọi merge; baseline → cannotRun → baselineStatus n-a.
const TOOL_KILL_REASON = 'bi cong cu giet (timeout tool/output cat) — exit code khong phai cua lenh'
const normKill = r => (r && r.killedByTool === true)
  ? { ...r, cannotRun: true, reason: (typeof r.reason === 'string' && r.reason.trim()) ? r.reason : TOOL_KILL_REASON }
  : r

// ---- variance-N: gộp các lần chạy của 1 lệnh → 1 entry/lệnh với pass-rate ----
const runsByCmd = new Map()
for (const r of (machineRaw || []).filter(Boolean).map(normKill)) {
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
machine.push(...(uiRaw || []).filter(Boolean).map(normKill).map(r => ({ ...r, runs: 1, passes: !r.cannotRun && r.exitCode === 0 ? 1 : 0, variance: false })))

// ---- run-log: run_id per eval do JS THUẦN quyết (verifier có runId thật → dùng; rỗng → mint
// deterministic) + build NGUYÊN VĂN từng dòng JSONL. Synthesize CHỈ chép map này — hết quyền
// tự mint. recheck-evidence/hook đối chiếu run_id trong report với log: PASS bịa tay
// (không qua verify) bị chặn. ts từ args.invokedAt (skill đo bằng `date -u` — script bị cấm Date).
const invokedAt = typeof args.invokedAt === 'string' ? args.invokedAt : ''
// AC-6 delta-verify-repin: sha của HEAD lúc invoke (main loop truyền `git rev-parse HEAD`)
// — chảy vào TỪNG dòng run-log làm anchor cho carry round fix; vắng args → không field.
const invokedSha = typeof args.invokedSha === 'string' && args.invokedSha ? args.invokedSha : ''
const evalRunIds = {}
const suiteRunIds = {}
const runLogLines = []
/** Lệnh suite KHÔNG gắn eval nào (`byCmd.set(cmd, [])`), nên vòng dưới — vốn lặp theo
 *  `m.evals` — không chạy lần nào cho chúng và KHÔNG sinh dòng run-log. Nhưng bản chấm
 *  VẪN khai chúng ở mục «Lệnh suite regression-guard», và vì `evalRunIds` không có mục
 *  nào cho suite nên agent tổng hợp phải TỰ ĐẶT run_id — đúng thứ câu dặn ở prompt cấm.
 *  `recheck-evidence.cjs` đòi MỌI run_id trong bản chấm phải có mặt trong run-log ⇒ mọi
 *  vòng có mục suite đều đỏ L2 PROVENANCE, và chỉ lộ ra SAU khi Cổng 2 ký (chốt
 *  human_signoff `continue` trước khối recheck). Đo thật: media-library vòng 11.
 *  Tên suy từ CHÍNH lệnh nên id ổn định qua các vòng, không phụ thuộc thứ tự mảng
 *  `suiteCommands` — đổi thứ tự khai mà id đổi theo thì carry/đối chiếu vòng sau lệch. */
const tenSuite = (cmd) => {
  const sach = String(cmd).replace(/^cd\s+\S+\s*&&\s*/, '').replace(/^.*;\s*/, '')
  const hit = sach.match(/pnpm\s+run\s+[\w:.-]+|pnpm\s+[\w:.-]+|npm\s+run\s+[\w:.-]+|yarn\s+[\w:.-]+/g) || []
  const ten = hit.map(x => x.replace(/^(pnpm|npm|yarn)\s+(run\s+)?/, '')).join('_')
  return (ten || sach).replace(/[^A-Za-z0-9]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 40) || 'suite'
}
/** Hai lệnh KHÁC nhau rút về CÙNG một tên là chuyện thường ở kho nhiều gói
 *  (`cd apps/web && pnpm build` và `cd apps/api && pnpm build` đều ra `build`;
 *  `pnpm test:unit --project a|b` đều ra `test_unit`; hai lệnh trần trùng 40 ký
 *  tự đầu cũng thế). Dùng chung một mã thì sổ chạy hết phân biệt được lượt nào
 *  là lượt nào: một lệnh ĐỎ có thể nấp sau một lệnh XANH mà bộ đối chiếu vẫn
 *  xanh — cùng lớp false-green với chính lỗi khối này sinh ra để vá.
 *  Hậu tố băm suy từ CHÍNH chuỗi lệnh (không phải chỉ số mảng) nên đổi thứ tự
 *  khai `suiteCommands` không đổi mã; và chỉ gắn cho lệnh THẬT SỰ trùng tên nên
 *  mã của lệnh không va chạm giữ nguyên hình dạng cũ. */
const bamSuite = (s) => {
  let h = 0x811c9dc5
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0 }
  return h.toString(16).padStart(8, '0').slice(0, 6)
}
const demTenSuite = {}
for (const m of machine) {
  if ((m.evals || []).length) continue
  const t = tenSuite(m.cmd)
  demTenSuite[t] = (demTenSuite[t] || 0) + 1
}
const tenDuyNhat = (cmd) => {
  const t = tenSuite(cmd)
  return demTenSuite[t] > 1 ? `${t}__${bamSuite(cmd)}` : t
}
for (const m of machine) {
  if (!(m.evals || []).length) {
    const ten = tenDuyNhat(m.cmd)
    const rid = (m.runId && String(m.runId).trim()) || `minted-${args.slug}-SUITE-${ten}-r${args.round}`
    m.runId = rid
    suiteRunIds[m.cmd] = rid
    runLogLines.push(JSON.stringify({
      ts: invokedAt, ...(invokedSha ? { sha: invokedSha } : {}), round: args.round,
      evalId: `SUITE-${ten}`, run_id: rid,
      exit_code: m.cannotRun ? null : m.exitCode, cmd: m.cmd,
      ...(m.cannotRun ? { cannot_run: true } : {}),
    }))
    continue
  }
  for (const evalId of (m.evals || [])) {
    const rid = (m.runId && String(m.runId).trim()) || `minted-${args.slug}-${evalId}-r${args.round}`
    evalRunIds[evalId] = rid
    runLogLines.push(JSON.stringify({
      ts: invokedAt, ...(invokedSha ? { sha: invokedSha } : {}), round: args.round, evalId, run_id: rid,
      exit_code: m.cannotRun ? null : m.exitCode, cmd: m.cmd,
      ...(m.runs > 1 ? { runs: m.runs, passes: m.passes } : {}),
      ...(m.cannotRun ? { cannot_run: true } : {}),
    }))
  }
}
// P1: eval carried — ghi dòng cho ROUND NÀY với run_id GỐC (id đã nằm trong log từ round gốc →
// hook/recheck đối chiếu pass tự nhiên); carried_from_round là dấu vết kiểm toán, consumer cũ bỏ qua field lạ.
for (const c of carriedEvals) {
  evalRunIds[c.id] = c.runId
  runLogLines.push(JSON.stringify({
    ts: invokedAt, ...(invokedSha ? { sha: invokedSha } : {}), round: args.round, evalId: c.id, run_id: c.runId,
    exit_code: 0, cmd: evalById.get(c.id).cmd || c.cmd || '',
    carried_from_round: typeof c.fromRound === 'number' ? c.fromRound : null,
  }))
}

// ---- A/B baseline: map kết quả đối chứng theo cmd; status = green | red | n-a ----
const baselineByCmd = new Map(((baselineRaw && baselineRaw.results) || []).map(normKill).map(b => [b.cmd, b]))
const baselineStatus = (cmd) => {
  const b = baselineByCmd.get(cmd)
  if (!b || b.cannotRun) return 'n-a'
  return b.baselineExit === 0 ? 'green' : 'red'
}
// Eval không-phân-biệt: lệnh-CÓ-eval pass trên CẢ HEAD lẫn baseline (green-on-both) → chứng minh harness, không phải feature
// P2: round không đo baseline → Analyst carry nguyên từ round có baseline gần nhất (carriedAnalyst).
const carriedAnalyst = (!runBaseline && args.carriedAnalyst && Array.isArray(args.carriedAnalyst.nonDiscriminating))
  ? args.carriedAnalyst : null
const nonDiscriminating = runBaseline
  ? machine
      .filter(m => (byCmd.get(m.cmd) || []).length > 0 && !m.cannotRun && !m.variance && m.exitCode === 0 && baselineStatus(m.cmd) === 'green')
      .map(m => ({ cmd: m.cmd, evals: byCmd.get(m.cmd) }))
  : (carriedAnalyst ? carriedAnalyst.nonDiscriminating : [])
const judges = (judgeRaw || []).filter(Boolean).map(normalizeVote)
const reviewResults = (reviewRaw || []).filter(Boolean)
// Chuẩn hoá path ở BIÊN — MỘT lần, ngay chỗ gom findings, trước mọi thứ đọc
// chúng (prompt triage, khoá ghép, dedupe, vùng phủ, review-findings.md, thẻ).
// Reviewer agent được nhắc "trong repo <abs path>" nên lane này trả path tuyệt
// đối và lane kia trả tương đối — cả hai đều hợp lệ theo schema. Mỗi consumer tự
// so chuỗi thô thì mỗi consumer hỏng một kiểu, và hỏng âm thầm. Chuẩn hoá phòng
// thủ là đủ; không dựa vào việc agent nghe lời.
const repoPrefix = String(args.repoRoot || '').replace(/\/+$/, '')
const relPath = v => {
  let p = String(v || '')
  if (repoPrefix && p.startsWith(repoPrefix + '/')) p = p.slice(repoPrefix.length + 1)
  return p.replace(/^\.\//, '').replace(/^\/+/, '')
}
const relFile = f => relPath(f && f.file)
const confirmedFindings = reviewResults.flatMap(r => r.findings).map(f => ({ ...f, file: relPath(f.file) }))
const reviewIncomplete = reviewResults.filter(r => r.dead).map(r => r.key)
for (const k of REVIEWERS.map(r => r.key)) {
  if (!reviewResults.some(r => r.key === k) && !reviewIncomplete.includes(k)) reviewIncomplete.push(k)
}

// ---- Scope-triage: ngăn thứ ba cho finding THẬT nhưng NGOÀI hợp đồng ----
// Reviewer là finder KHÔNG giới hạn phạm vi, gate là thước CÓ giới hạn phạm vi.
// Thiếu ngăn này thì mỗi bản vá trong vùng-không-đặc-tả lại đẻ ra lựa chọn
// không-đặc-tả mới, nên vòng lặp không thể hội tụ (ca OneFlow: 7 round, mọi
// round eval xanh, 12/12 finding rơi ngoài vùng phủ).
phase('Triage')
const toTriage = confirmedFindings.filter(f => !f.unverified) // unverified chưa chắc là thật → không phân loại
const hasContract = typeof args.contractPath === 'string' && !!args.contractPath.trim()
let triageRaw = null
let triageFailed = false
if (toTriage.length === 0) {
  triageFailed = false // không có gì để phân loại — không phải thất bại
} else if (!hasContract) {
  triageFailed = true // không có hợp đồng thì không đoán phạm vi
  log('Triage: thieu args.contractPath — moi finding ve unclassified, khong ai REJECT tu findings')
} else {
  const triagePrompt =
    `Ban la nguoi PHAN LOAI PHAM VI, khong phai nguoi tim loi. Cac finding duoi day DEU DA duoc xac nhan la loi THAT — dung tranh cai ve tinh dung sai cua chung.\n` +
    `Cau hoi duy nhat cho MOI finding: no co lam mot AC (acceptance criterion) trong hop dong that bai khong?\n\n` +
    `Doc hop dong tai ${args.contractPath} (Read). Doc CA section "Out of scope" — muc trong do la bang chung MANH cho inContract=false.\n\n` +
    `Findings: ${JSON.stringify(toTriage.map(f => ({ title: f.title, file: f.file, line: f.line, severity: f.severity, detail: f.detail })))}\n\n` +
    `Luat phan loai:\n` +
    `- inContract=true CHI khi chi duoc DICH DANH mot AC ma finding nay lam that bai → acRef = id AC do (vd "AC-3"), proposal = "".\n` +
    `- inContract=false khi finding that nhung khong AC nao phu → acRef = "", proposal = "known-limits" (ghi han che da biet, ship nhu hien tai) hoac "new-contract" (dang mot feature rieng).\n` +
    `- KHONG suy dien AC "gan giong". Khong chac chan → inContract=false: sua ngoai hop dong la viec cua NGUOI o Gate 2, khong phai cua may.\n` +
    `- inContract=false: BAT BUOC viet them plain = 1-2 cau NGON NGU SAN PHAM ke hau qua cho NGUOI DUNG (vd "Bam Cap nhat co the lam mat tien ich dang cai"). Day la chu DUY NHAT the Cong 2 in ra cho nguoi quyet doc — title ky thuat KHONG bao gio den duoc mat ho. Cam ten ham, duong dan file, ma thoat, tu ngu regex/schema.\n` +
    `- KHONG doc code repo, KHONG de xuat cach sua. Chi phan loai pham vi.\n` +
    `- KHONG doc duoc contract (Read that bai, file khong ton tai, rong) → tra contractUnreadable=true va triaged=[] . TUYET DOI khong doan phan loai tu tri nho: mot ket qua bia doc y het mot ket qua that.\n` +
    `Tra ve contractUnreadable=false va triaged[] dung MOT muc cho MOI finding; title VA file chep NGUYEN VAN (title khong duy nhat — hai file khac nhau co the trung title).`
  const triageOnce = () => agentT(triagePrompt, { label: 'triage', phase: 'Triage', schema: TRIAGE_SCHEMA, ...modelOpt('triage') })
  triageRaw = await triageOnce().catch(() => null)
  if (!triageRaw) triageRaw = await triageOnce().catch(() => null) // retry 1
  if (!triageRaw || !Array.isArray(triageRaw.triaged)) {
    triageFailed = true
    log('Triage: agent chet ca retry — moi finding ve unclassified, khong ai REJECT tu findings')
  }
}
// Agent tự khai KHÔNG đọc được contract → fail-toward-human, y như agent chết.
// Không có nhánh này thì luật "không chắc chắn → inContract=false" biến mọi
// finding thành out-of-contract và card in "ngoài phạm vi đã duyệt" cho những
// lỗi chưa từng được đối chiếu — đọc như kết quả triage nhưng là bịa.
if (triageRaw && triageRaw.contractUnreadable === true) {
  triageFailed = true
  log('Triage: agent bao KHONG doc duoc contract — moi finding ve unclassified, khong ai REJECT tu findings')
}
// Khoá ghép là (file, title): title do hai lane reviewer sinh tự do trên cùng
// một diff nên trùng title giữa hai FILE là chuyện thường; ghép bằng title trần
// thì Map giữ mục cuối và finding out-of-contract lọt vào fix-list.
//
// Path phải CHUẨN HOÁ ở cả hai phía trước khi so. Reviewer được nhắc "trong repo
// <abs path>" nên lane này trả path tuyệt đối, lane kia trả tương đối, và agent
// triage chép lại dạng nó nhận: so chuỗi thô thì mọi finding rơi unclassified →
// triageFailed → rejectFindings rỗng → round báo PASS trong khi lỗi in-contract
// còn sống. Đây là khớp LLM-viết→máy-đọc: bỏ LLM ra khỏi định danh của khoá,
// đừng trông vào việc nó chép nguyên văn một đường dẫn dài.
// (3/5 round của discovery-brainstorm-socket dính, sổ d-20260806T122000Z-10021.)
const triageKey = t => `${relFile(t)} :: ${t.title}`
const triageRows = ((triageRaw && Array.isArray(triageRaw.triaged)) ? triageRaw.triaged : [])
  .filter(t => t && typeof t.title === 'string')
const triageByKey = new Map(triageRows.map(t => [triageKey(t), t]))
// Gỡ-mơ-hồ bằng title: agent có thể viết lại path hẳn (rút gọn, đổi thư mục)
// chứ không chỉ đổi dạng. CHỈ dùng khi title là duy nhất ở CẢ HAI phía — lúc đó
// chỉ tồn tại đúng một cách ghép, không phải phỏng đoán. Title trùng (chuyện
// thường giữa hai lane: "missing validation") → không đoán, để fail-toward-human.
// Đếm theo khoá PHÂN BIỆT chứ không theo số lượt: ba lane reviewer cùng báo một
// lỗi là chuyện thường và KHÔNG được đọc thành "title mơ hồ" (đọc vậy thì nhánh
// gỡ-mơ-hồ tắt đúng lúc cần nhất — ca một-lỗi-ba-lane là ca phổ biến nhất).
const distinctByTitle = arr => arr.reduce((m, x) => {
  if (!m.has(x.title)) m.set(x.title, new Set())
  m.get(x.title).add(triageKey(x))
  return m
}, new Map())
const rowsByTitle = distinctByTitle(triageRows)
const findingsByTitle = distinctByTitle(toTriage)
const unique = (m, title) => (m.get(title) || new Set()).size === 1
const matchTriage = f => triageByKey.get(triageKey(f))
  || ((unique(rowsByTitle, f.title) && unique(findingsByTitle, f.title))
    ? triageRows.find(t => t.title === f.title)
    : undefined)
// Finding gửi đi mà agent KHÔNG trả về → unclassified (không mặc định in/out).
const triaged = toTriage.map(f => {
  const t = matchTriage(f)
  const ok = !triageFailed && !!t
  return {
    ...f,
    inContract: ok ? t.inContract === true : false,
    acRef: (ok && t.inContract === true && t.acRef) ? t.acRef : null,
    rationale: ok ? (t.rationale || '') : '',
    proposal: (ok && t.inContract !== true && t.proposal) ? t.proposal : null,
    // Câu ngôn ngữ sản phẩm — chữ DUY NHẤT thẻ Cổng 2 in ra cho người quyết.
    plain: (ok && t.inContract !== true && t.plain) ? t.plain : null,
    unclassified: !ok,
  }
})
// Fix-list của round: CHỈ finding trong hợp đồng. Out-of-contract KHÔNG BAO GIỜ
// vào đây, kể cả khi round REJECT vì lý do khác — chốt chặn chính của feature.
// Agent tra THIEU muc cho mot finding (bo sot / chep lech khoa) cung la triage
// KHONG day du — keo ca round ve fail-toward-human, dung nhat quan voi luat
// "khong chac chan thi khong ai duoc REJECT tu findings".
if (!triageFailed && triaged.some(f => f.unclassified)) {
  triageFailed = true
  log('Triage: agent tra thieu muc cho it nhat mot finding — coi nhu phan loai khong day du, khong ai REJECT tu findings')
}
const rejectFindings = triageFailed ? [] : triaged.filter(f => f.inContract)
const triageHighInContract = triageFailed ? [] : triaged.filter(f => f.inContract && f.severity === 'high')

// Tín hiệu cụm-ngoài-vùng-phủ: findings dồn vào file không eval nào đo = hợp đồng
// đang hụt. Ngưỡng ≥2 — một finding lẻ không đẩy người vào quyết định mở-rộng-hay-rút.
// Glob tối giản: ** = mọi thứ, * = trong một đoạn đường dẫn.
// Glob toi gian theo ngu nghia chuan: `**/` khop KHONG hoac NHIEU thu muc (nen
// `src/**/*.ts` phai khop ca `src/a.ts`), `**` khop moi thu, `*` khop trong mot doan.
// Tach `**` TRUOC khi doi `*`, neu khong `**` bi doi thanh hai lan `[^/]*` va het
// khop qua dau `/`. Ky tu glob khac (`?`) duoc escape de khong thanh luong tu regex.
const globToRe = g => {
  const lit = t => t.replace(/[.+^${}()|[\]\\?]/g, '\\$&').replace(/\*/g, '[^/]*')
  const body = String(g).split('**/')
    .map(part => part.split('**').map(lit).join('.*'))
    .join('(?:.*/)?')
  return new RegExp('^' + body + '$')
}
const coverageRes = args.evals.flatMap(e => Array.isArray(e.paths) ? e.paths : []).map(globToRe)
// Path đã chuẩn hoá bằng relFile khai ở đầu bước Triage — cùng một phép cho khoá
// ghép, dedupe và vùng phủ, để ba chỗ không trôi khỏi nhau.
// Đếm theo finding PHÂN BIỆT (file+title), không theo số lượt báo: hai reviewer
// cùng thấy một lỗi là chuyện thường, và nó KHÔNG được tự nhân đôi thành "cụm".
// Khoá phân biệt dùng path ĐÃ chuẩn hoá (relFile khai ngay trên): hai lane
// reviewer có thể báo cùng một lỗi bằng path tuyệt đối và path tương đối —
// dedupe trên path thô sẽ nhân đôi nó thành "cụm" giả.
const distinctKey = f => `${relFile(f)} :: ${f.title}`
const dedupe = arr => [...new Map(arr.map(f => [distinctKey(f), f])).values()]
const triagedDistinct = dedupe(triaged)
const outsideCoverage = coverageRes.length === 0 ? [] // không eval nào khai paths → không tính được (n-a)
  : triagedDistinct.filter(f => relFile(f) && !coverageRes.some(re => re.test(relFile(f))))
const coverageCluster = outsideCoverage.length >= 2
  ? { count: outsideCoverage.length, total: triagedDistinct.length, files: [...new Set(outsideCoverage.map(relFile))] }
  : null
if (coverageCluster) log(`Cum ngoai vung phu: ${coverageCluster.count}/${coverageCluster.total} finding roi vao file khong eval nao do`)

// ---- panel verdict per judgment eval: majority 2/3, else UNCERTAIN. CHỈ LÀ ĐỀ XUẤT cho Gate 2 ----
const freshPanels = freshJudgmentEvals.map(e => {
  const votes = judges.filter(j => j.evalId === e.id)
  const count = v => votes.filter(x => x.verdict === v).length
  const proposal = count('PASS') >= 2 ? 'PASS' : count('FAIL') >= 2 ? 'FAIL' : 'UNCERTAIN'
  return { evalId: e.id, proposal, votes }
})
// P3: panel carried ghép vào cùng danh sách — verdict routing phía dưới GIỮ NGUYÊN luật
// (T3 / proposal khác PASS → PENDING-JUDGMENT), chỉ khác nguồn: không chấm lại khi inputs không đổi.
const panels = [
  ...freshPanels,
  ...carriedPanels.map(p => ({
    evalId: p.evalId, proposal: p.proposal,
    votes: (Array.isArray(p.votes) ? p.votes : []).map(v => ({ lens: v.lens, verdict: v.verdict, ...(v.required_evidence ? { required_evidence: v.required_evidence } : {}) })),
    carried: true, fromRound: typeof p.fromRound === 'number' ? p.fromRound : null,
  })),
  // Không khai input → máy không có căn cứ. Panel cơ học, KHÔNG do agent nào phán.
  ...[...ungroundedIds].map(id => ({
    evalId: id, proposal: 'UNCERTAIN', votes: [], ungrounded: true,
    note: 'eval khong khai input nao — may khong co can cu de phan, nguoi quyet o Cong 2',
  })),
]

// P3/P2: dòng memo run-log cho round SAU so hash — CHỈ ghi khi SKILL truyền hash (flow cũ không
// hash → không ghi, log gọn). Dòng không có run_id → evidence-core/loadRunLogIds bỏ qua, vô hại.
for (const pn of freshPanels) {
  const ih = (evalById.get(pn.evalId) || {}).inputsHash
  if (typeof ih === 'string' && ih) runLogLines.push(JSON.stringify({
    ts: invokedAt, ...(invokedSha ? { sha: invokedSha } : {}), round: args.round, evalId: pn.evalId, kind: 'panel', proposal: pn.proposal,
    votes: pn.votes.map(v => ({ lens: v.lens, verdict: v.verdict, ...(v.required_evidence ? { required_evidence: v.required_evidence } : {}) })), inputs_hash: ih,
  }))
}
for (const p of carriedPanels) {
  if (typeof p.inputsHash === 'string' && p.inputsHash) runLogLines.push(JSON.stringify({
    ts: invokedAt, ...(invokedSha ? { sha: invokedSha } : {}), round: args.round, evalId: p.evalId, kind: 'panel', proposal: p.proposal,
    votes: (Array.isArray(p.votes) ? p.votes : []).map(v => ({ lens: v.lens, verdict: v.verdict, ...(v.required_evidence ? { required_evidence: v.required_evidence } : {}) })),
    inputs_hash: p.inputsHash, carried_from_round: typeof p.fromRound === 'number' ? p.fromRound : null,
  }))
}
if (typeof args.evalsHash === 'string' && args.evalsHash) {
  runLogLines.push(JSON.stringify({
    ts: invokedAt, ...(invokedSha ? { sha: invokedSha } : {}), round: args.round, kind: 'baseline', evals_hash: args.evalsHash,
    non_discriminating: nonDiscriminating,
    ...(runBaseline ? {} : { carried_from_round: carriedAnalyst && typeof carriedAnalyst.fromRound === 'number' ? carriedAnalyst.fromRound : null }),
  }))
}

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
// Vế MỚI: finding THẬT + trong hợp đồng + nặng → máy tự quay S3 sửa, không tốn
// một lượt cổng người. Đặt DƯỚI BLOCKED (môi trường hỏng thì không sửa gì) và
// sau failed (cùng kết cục, gộp chung fix-list).
else if (triageHighInContract.length) verdict = 'REJECT'
// Triage hỏng = máy KHÔNG biết finding nào trong hợp đồng, nên nó cũng không
// biết round này sạch. Verdict phải nói ra điều đó: PASS sạch bong là thứ người
// ký đọc rồi ký, trong khi chính workflow không tin nó (fail-toward-human chỉ có
// nghĩa khi con người THẤY được là mình đang được chuyển việc). PENDING-JUDGMENT
// đúng nghĩa sẵn có: máy chạy xong, một người phải quyết. triageFailed chỉ bật
// khi CÓ finding, nên round không finding không bị kéo vào đây.
else if (triageFailed) verdict = 'PENDING-JUDGMENT'
else if (varianceCmds.length || (judgmentEvals.length && (args.riskTier === 'T3' || panels.some(p => p.proposal !== 'PASS')))) verdict = 'PENDING-JUDGMENT'
else verdict = 'PASS'

log(`Verdict: ${verdict}${failedEvalIds.length ? ' — failed: ' + failedEvalIds.join(', ') : ''}${blocked.length ? ' — blocked: ' + blocked.length + ' lenh' : ''}${varianceCmds.length ? ' — variance: ' + varianceCmds.length : ''} — findings xac nhan: ${confirmedFindings.length}${triaged.length ? ` (trong hop dong: ${rejectFindings.length}, ngoai: ${triaged.filter(f => !f.inContract && !f.unclassified).length}${triageFailed ? ', TRIAGE HONG' : ''})` : ''}`)

// ---- Synthesize: 1 agent viết evidence-report.md đúng template (hook enforce) ----
phase('Synthesize')
// Trim payload: lệnh PASS chỉ cần ~3 dòng output cuối làm evidence; lệnh fail/blocked giữ nguyên tail (cần cho chẩn đoán)
const machineForReport = machine.map(m => (!m.cannotRun && m.exitCode === 0 && !m.variance)
  ? { ...m, outputTail: String(m.outputTail || '').split('\n').slice(-3).join('\n') }
  : m)
const machineForReportB = machineForReport.map(m => ({ ...m, baseline: baselineStatus(m.cmd) }))
// Provenance xác định bằng máy → literal (synthesizer chỉ chép, không tự suy diễn/bỏ field trust-critical).
// Run-log KHÔNG còn agent scribe: một agent "chép sẵn dòng audit" trông y hệt hành
// vi ngụy tạo hồ sơ và bị safety layer chặn lặp lại (4 lần, phiên 2026-07-27→28),
// dù nội dung do JS tính từ kết quả chạy thật. Main loop tự append result.runLog
// (cơ chế được user ủy quyền minh danh 2026-07-28) — SKILL bước "Mọi verdict".
const prov = await agentT(
    `Chay DUNG 3 lenh, bao cao KET QUA THUC (KHONG suy dien, KHONG doan):\n1) printf '%s' "$ACCEPTANCE_GATE_BYPASS" — in ra dung "1" → bypass_used=true; rong/khac → false.\n2) Doc ${args.repoRoot}/_acceptance/config.yaml, lay field "enforcement" o cap 0 (^enforcement: strict|warn|off); thieu file/field → "strict".\n3) git -C ${args.repoRoot} rev-parse HEAD — tra ve verified_commit = chuoi 40-hex NGUYEN VAN tu stdout; lenh loi (khong phai git repo) → chuoi rong. TUYET DOI KHONG bia SHA.\nTra ve {bypass_used, enforcement_mode, verified_commit} dung ket qua 3 lenh tren.`,
    { label: 'capture:provenance', phase: 'Synthesize', schema: PROV_SCHEMA, ...modelOpt('provenance') }
  )
const runLogWriteFailed = runLogLines.length > 0 // luôn: main loop append, không còn scribe
if (runLogWriteFailed) log('Run-log: ' + runLogLines.length + ' dong trong result.runLog — main loop TU append truoc Gate 2 (hook/recheck doi chieu run_id voi log nay)')
// verified_commit sanitize bang JS thuan — khong tin agent: sai shape (khong phai hex SHA) coi nhu
// khong co (report BO field; pre-merge se NOTE "not pinned" thay vi hook chan oan ca round).
const verifiedCommit = /^[0-9a-f]{7,40}$/i.test(String((prov && prov.verified_commit) || '').trim())
  ? String(prov.verified_commit).trim().toLowerCase()
  : ''
// P1: payload block carried cho report — run_id + verified_at NGUYÊN GỐC round trước (không giả
// timestamp mới), kèm carried_from_round để Gate 2 thấy rõ eval nào round này KHÔNG chạy lại.
const carriedForReport = carriedEvals.map(c => {
  const d = evalById.get(c.id)
  return {
    id: c.id, criterion: d.criterion, executor: d.executor, ref: d.ref, expected: d.expected,
    run_id: c.runId, verified_at: c.verifiedAt || invokedAt,
    carried_from_round: typeof c.fromRound === 'number' ? c.fromRound : null,
  }
})
const report = await agentT(
  `Soan NOI DUNG evidence report cho feature "${args.slug}" round ${args.round} — TRA VE trong field "report", KHONG ghi file nao ca (main loop se append run-log roi MOI ghi evidence-report.md — hook doi chieu run_id trong report voi log nen thu tu do la bat buoc). Noi dung thay tron round cu; lich su round nam trong section Iterations.\nDoc template tai ${args.templatePath} va tuan thu TUYET DOI shape — hook acceptance-evidence-gate.js se chan neu sai (L1 SHAPE: PASS can run_id ≥4 ky tu + exit_code 0 + verifier + verified_at ISO8601; L1 CONSISTENCY: report PASS khong duoc chua token exit khac 0 hay chuoi "verdict: FAIL"; L2: verifier la config: ref hoac script path; L3: moi UNCERTAIN can human_override).\n\nVerdict DA TINH SAN (khong tu thay doi): ${verdict}\nPROVENANCE — ghi NGUYEN VAN cac dong frontmatter nay (DA do bang buoc capture, TUYET DOI KHONG tu doi/suy dien/bo): "enforcement_mode: ${prov.enforcement_mode}" va "bypass_used: ${prov.bypass_used}"${verifiedCommit ? ` va "verified_commit: ${verifiedCommit}"` : ''}. CI pre-merge dung cac field nay de chan gate yeu va phat hien code doi SAU verify (stale evidence).${verifiedCommit ? ' Hook L1 chan verified_commit khong phai hex SHA — chep dung nguyen van, khong rut gon.' : ' Repo khong phai git: BO HAN field verified_commit (khong bia, khong ghi rong).'}\n${triageFailed ? `TRIAGE HONG — buoc phan loai pham vi KHONG chay duoc round nay, nen may KHONG biet finding nao trong hop dong va KHONG tu sua gi. Ghi CA HAI dau vet sau, khong duoc bo mot cai nao:\n(1) frontmatter THEM DUNG dong "triage_failed: true" (dat ngay duoi dong verdict);\n(2) than bai, NGAY DUOI dong tieu de "# Evidence Report: ...", mot dong canh bao BAT DAU bang "⚠ phân loại phạm vi KHÔNG chạy được" roi noi ro: khong loi nao duoc may tu sua, danh sach day du nam trong review-findings.md, nguoi xem lai toan bo truoc khi ky.\nTUYET DOI KHONG them section "##" moi cho viec nay va KHONG viet lai verdict.\n` : ''}failed_evals: ${JSON.stringify(failedEvalIds)}\nblocked (neu BLOCKED, ghi reason vao frontmatter): ${JSON.stringify(blocked)}\nLenh fail khong gan eval (ghi ro trong report neu co): ${JSON.stringify(failedCommands)}\nReview incomplete (finder chet — ghi canh bao trong review-findings.md): ${JSON.stringify(reviewIncomplete)}\n\nKet qua may (moi block cmd cover cac eval cua no; block cua eval ui-check ghi them field "screenshot:" = screenshotPath tu ket qua VA field "observed:" = observed tu ket qua (template schema v2 — hook CHAN report PASS co screenshot: ma thieu observed: thuc chat >=20 ky tu; neu ket qua ui THIEU observed → TU MO tung frame evidence da luu bang Read va viet observed truoc khi ghi report, KHONG bia)): ${JSON.stringify(machineForReportB)}\nNETWORK TRUTH (advisory — schema v2 GIU NGUYEN, hook KHONG kiem field nay): moi block eval ui-check ghi them field "network_observed:" = chep NGUYEN VAN field networkObserved tu ket qua ui o tren; ket qua ui KHONG co field nay → ghi "n-a (driver)". TUYET DOI KHONG tu suy ra "clean". Vocab chu duy nhat: clean | no-app-traffic | third-party-only | app-fail | n-a (driver) | n-a (tool-error) | unscoped | unscoped-partial — CAM ghi so status/exit tho hay chu 'verdict: FAIL' vao report (bay L1 CONSISTENCY; so tho nam trong evidence/E{id}-network.txt).
run_id cua TUNG eval: chep NGUYEN VAN tu map nay — JS da tinh san va DA GHI vao ${args.repoRoot}/_acceptance/${args.slug}/run-log.jsonl truoc khi ban viet report; hook + CI recheck doi chieu TUNG run_id trong report voi log do (id la/khong khop = BLOCK). TUYET DOI KHONG tu mint/doi/rut gon run_id: ${JSON.stringify(evalRunIds)}\nrun_id cua TUNG LENH SUITE (muc «Lenh suite regression-guard») — cung luat, key la cmd: ${JSON.stringify(suiteRunIds)}${carriedForReport.length ? `
EVAL CARRY-FORWARD (P1 — delta staleness khong cham paths cua cac eval nay, round nay KHONG chay lai): moi item van la MOT block eval PASS trong bang + Evidence, ghi run_id va verified_at NGUYEN VAN tu payload (id da nam trong run-log tu round goc), exit_code: 0, verifier = field ref, THEM dong "carried_from_round: <N>" va ghi chu 1 dong "carry-forward tu round <N> — delta khong cham paths cua eval". TUYET DOI KHONG ghi screenshot:/observed: cho block carried (frame goc xem round <N> trong Iterations): ${JSON.stringify(carriedForReport)}` : ''}
A/B BASELINE: moi block eval may ghi them field "baseline: <green|red|n-a>" lay tu field "baseline" trong ket qua may o tren (green=pass tren code cu diffBase, red=fail tren code cu nghia la eval CO phan biet, n-a=khong chay duoc tren baseline). Field baseline DUNG TU green/red/n-a, TUYET DOI KHONG ghi exit-code so o day hay trong section Analyst — hook L1 CONSISTENCY se chan oan report PASS neu thay token exit khac 0.
Them section "## Analyst" ngay sau bang ket qua: liet ke eval KHONG-PHAN-BIET (pass tren CA HEAD lan baseline, chung minh harness chu khong phai feature; nen viet lai de assert hanh vi moi hoac xac nhan la regression-guard co chu y): ${JSON.stringify(nonDiscriminating)}. ${runBaseline ? 'Rong thi ghi "none — moi eval feature deu red tren baseline (co phan biet)".' : `BASELINE ROUND NAY KHONG DO LAI (P2 — evals.yaml khong doi tu lan baseline cuoi${carriedAnalyst && typeof carriedAnalyst.fromRound === 'number' ? `, round ${carriedAnalyst.fromRound}` : ''}): mo dau section Analyst bang dong "carried tu round ${carriedAnalyst && typeof carriedAnalyst.fromRound === 'number' ? carriedAnalyst.fromRound : 'truoc'} — baseline khong do lai round nay"; field "baseline:" cua tung block eval ghi "n-a" (round nay khong do).`} Lenh suite xanh-ca-hai-phia la regression-guard binh thuong, KHONG liet ke.
VARIANCE-N: eval co field "runs" > 1 = eval NGAU NHIEN (da chay nhieu lan, gop lai). Voi eval do ghi them "runs: <N>" va "pass_rate: <passes>/<runs>" (dang phan so vd "4/5" — DUNG so exit). Eval khong co runs hoac runs=1 (deterministic) KHONG ghi pass_rate. Eval co field "variance": true (pass_rate khac 0 va khac full) → tin hieu PHUONG SAI: feature ngau nhien chua on dinh; verdict tong DA la PENDING-JUDGMENT; ghi eval do vao section moi "## Variance" kem pass_rate de NGUOI quyet nguong o Gate 2 (giong judgment item). Eval deterministic ma variance=true = test flaky/racy → cung vao "## Variance", ghi ro "flaky".\nDinh nghia eval (ghi "verifier:" = field "ref" — config: ref GOC, hook L2 chi chap nhan config: ref hoac script path, KHONG ghi lenh resolved): ${JSON.stringify(args.evals.map(e => ({ id: e.id, criterion: e.criterion, executor: e.executor, ref: e.ref, expected: e.expected, evidence_required: e.evidence_required })))}\nJudge panels (DE XUAT — ghi de xuat panel + rationale tung judge, de human_override TRONG cho moi item; T3 thi MOI judgment item deu cho human). QUAN TRONG format: trong section judge, ghi vote dang "- <lens>: FAIL — <rationale>" / "- <lens>: PASS — ...", TUYET DOI KHONG dung chuoi "verdict: FAIL" (hook L1 CONSISTENCY scan token nay trong report PASS) — moi dissent phai hien thi day du, khong duoc om/viet lai. Panel co "carried": true (P3) = inputs khong doi tu round "fromRound" (hash khop) nen KHONG cham lai: ghi ro "panel giu nguyen tu round <fromRound> — inputs khong doi, khong cham lai; rationale xem round do", votes carried chi co lens+verdict (ghi "- <lens>: <verdict> (r<fromRound>)"). Panel co "ungrounded": true = eval KHONG khai input nao nen KHONG hoi dong nao duoc cham (votes rong la DUNG, khong phai thieu du lieu): ghi ro "khong khai input — may khong co can cu, nguoi quyet o Cong 2" va de human_override TRONG; TUYET DOI khong ghi no nhu mot muc da dat: ${JSON.stringify(panels)}\n\nSau do soan NOI DUNG file thu hai review-findings.md — TRA VE trong field "findings", KHONG ghi file (informational, NGOAI hook — TUYET DOI khong them section/field nao cua no vao evidence-report.md).\nFile nay chia theo ket qua SCOPE-TRIAGE, moi finding ghi title, file:line, severity, detail, source:\n- "## Trong hợp đồng" — findings da map duoc vao AC; moi dong ghi them "AC: <acRef>". Findings: ${JSON.stringify(triaged.filter(f => f.inContract))}\n- "## Ngoài hợp đồng — người quyết ở Gate 2" — findings THAT nhung khong AC nao phu. Mo dau ngan bang DUNG mot cau: "Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa." Roi MOI MUC viet DUNG khuon duoi day, KHONG doi thu tu dong, KHONG bo dau gach dau dong hay hai dau sao (bo doc lai file nay bang may — sai khuon la khoi bien mat khoi the, khong bao loi):\n<<<OOC-ITEM-TEMPLATE\n- **{title}**\n  Người dùng thấy gì: {plain}\n  file: \`{file}\`\n  severity: {severity}\n  Đề xuất: {proposal}\nOOC-ITEM-TEMPLATE>>>\n{plain} chep NGUYEN VAN truong plain (day la chu DUY NHAT the Cong 2 in ra cho nguoi quyet doc); {proposal} la known-limits (ghi han che da biet roi ship) hoac new-contract (dang mot feature rieng). Findings: ${JSON.stringify(triaged.filter(f => !f.inContract && !f.unclassified))}\n${triaged.some(f => f.unclassified) ? '- "## Chưa phân loại (triage-failed)" — buoc phan loai pham vi hong nen KHONG finding nao duoc coi la trong hop dong; mo dau bang dong "phân loại phạm vi không chạy được — không lỗi nào bị máy tự sửa, người xem lại toàn bộ". Findings: ' + JSON.stringify(triaged.filter(f => f.unclassified)) + '\n' : ''}- Finding co unverified=true liet ke RIENG duoi heading VIET DUNG NGUYEN VAN "## Chưa adversarial-verify (refuter chết)" (bat buoc muc ##: heading khac cap hoac dong tran se lam cac muc nay bi may doc nham thanh finding ngoai-hop-dong tren the): ${JSON.stringify(confirmedFindings.filter(f => f.unverified))}\n${coverageCluster ? `Cuoi file ghi DUNG mot dong co: "⚠ Cụm ngoài vùng phủ: ${coverageCluster.count}/${coverageCluster.total} lỗi rơi vào file không bộ đo nào phủ (${coverageCluster.files.join(', ')}) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi."\n` : 'Cuoi file ghi DUNG mot dong: "Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm)." TUYET DOI khong bia co canh bao.\n'}Tra ve {report, findings} — hai CHUOI NOI DUNG day du, khong phai duong dan.`,
  { label: 'synthesize:report', phase: 'Synthesize', schema: REPORT_SCHEMA, ...modelOpt('synthesize') }
)

return {
  verdict,
  failedEvals: failedEvalIds,
  failedCommands,
  blocked,
  panels: panels.map(p => ({ evalId: p.evalId, proposal: p.proposal, ...(p.carried ? { carried: true, fromRound: p.fromRound } : {}), ...(p.ungrounded ? { ungrounded: true, note: p.note } : {}) })),
  // Đợt 5: main loop in cho user round này carry gì (minh bạch ở Gate 2)
  carried: { evals: carriedEvals.map(c => c.id), panels: carriedPanels.map(p => p.evalId), baseline: !runBaseline },
  confirmedFindings,
  triaged,
  triageFailed,
  rejectFindings,
  coverageCluster,
  reviewIncomplete,
  nonDiscriminating,
  variance: varianceCmds.map(m => ({ cmd: m.cmd, evals: m.evals, runs: m.runs, passRate: m.passes + '/' + m.runs })),
  // run-log: JS tính dòng, MAIN LOOP ghi — thứ tự bắt buộc: (1) append runLog vào
  // run-log.jsonl, (2) ghi report/findings từ hai chuỗi dưới. Hook L2 đối chiếu
  // run_id trong report với log, nên log phải nằm trên đĩa trước report.
  runLog: runLogLines,
  runLogWriteFailed,
  report: (report && report.report) || '',
  findings: (report && report.findings) || '',
}

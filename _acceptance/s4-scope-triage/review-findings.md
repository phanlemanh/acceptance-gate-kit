# Review Findings: s4-scope-triage (round 1)

Informational — outside the hook-enforced evidence-report schema. Chia theo
kết quả SCOPE-TRIAGE (in-contract / out-of-contract), không phải theo
reviewer lane.

## Trong hợp đồng

- **Card overlay key `out_of_contract` is written but no renderer ever reads it — AC-8 block cannot appear on the Gate-2 card**
  file: `commands/acceptance-card.md:46`
  severity: high
  source: conventions
  AC: AC-11
  detail: Step 3 of the card command (and the mirrored Codex
  `acceptance-card/SKILL.md:45-57`) instructs the model to build an
  `out_of_contract` block and write it into
  `_acceptance/<slug>/card-plain.json`. Step 4 then renders with
  `node <gate-card.js> --root . --slug <slug> --plain card-plain.json`. But
  `scripts/gate-card.js` consumes a closed set of overlay keys —
  `grep -o 'pl\.[a-z_]*'` yields exactly `feature_plain`, `will_do`,
  `wont_do`, `scope_plain`, `decisions`, `decisions_plain`, `analyst_plain`
  (lines 209-341). `out_of_contract` appears nowhere in `scripts/`, `lib/`,
  or `hooks/`, and gate-card.js never opens `review-findings.md`. Unknown
  overlay keys are silently ignored, so the human opening `card.html` sees no
  out-of-contract block, no three choices, and no coverage-cluster flag.

  This also breaks the pattern the file itself documents two bullets above:
  the `gap_probe` bullet says "cờ vắng/probe-failed/parse_dropped do script
  tự render. Overlay không có key cho khối này" — i.e. anything that must
  show on the card is rendered by gate-card.js, never by an overlay key. The
  new bullet declares an overlay key instead.

  AC-8's test P52 (`tests/plugins/run-tests.sh:867-895`) only greps the two
  instruction files for the literal 'Ngoài hợp đồng' and for a
  backward-branch phrase, so it stays green while the deliverable does not
  render. Both plugin manifests now advertise "v1.23 renders the Gate-2
  'Ngoài hợp đồng' block on the decision card"
  (`.claude-plugin/plugin.json`,
  `codex/acceptance-gate/.codex-plugin/plugin.json`), which is not true of
  the rendered card.

  The chat-side presentation in
  `feature-loop/skills/feature-loop/SKILL.md:153` does cover the human, so
  the fix is either to teach gate-card.js the block (matching the gap_probe
  precedent) or to move the instruction out of the card-plain.json field
  list and out of the manifest descriptions.
  rationale: AC-11 đòi khối "Ngoài hợp đồng" phải render trên card để người
  quyết đọc được, nhưng finding cho thấy khối này không bao giờ render
  (gate-card.js không biết key `out_of_contract`) nên tiền đề của AC-11
  không bao giờ thành hiện thực.

- **Scope-triage joins agent output to findings by `title` alone, so same-titled findings in different files get each other's classification**
  file: `feature-loop/workflows/acceptance-verify.js:505`
  severity: high
  source: conventions
  AC: AC-5
  detail: `triageByTitle = new Map(triaged.map(t => [t.title, t]))` then
  `toTriage.map(f => triageByTitle.get(f.title))`. `confirmedFindings` is
  `reviewResults.flatMap(r => r.findings)` (line 464) with no dedupe, and the
  titles are free text produced by two independent reviewer lanes
  (`conventions`, `bugs`) over the same diff — collisions such as "missing
  validation" or "silent catch" across two files are ordinary. The Map keeps
  the LAST entry, so every finding sharing a title collapses onto one
  classification.

  The file itself already knows title is not a distinct key: 31 lines below,
  `distinctKey = f => `${f.file} :: ${f.title}`` (line 536) is used
  precisely because "hai reviewer cùng thấy một lỗi" must not double-count.
  The triage join should use the same key (and the TRIAGE_SCHEMA should echo
  `file` alongside `title`).

  I reproduced both failure directions against the real workflow via
  `tests/workflows/harness.mjs`, two findings titled "missing validation"
  (`src/a.ts` in-contract high, `docs/x.md` out-of-contract high):
  - agent returns [in-contract, out-of-contract] → both become
    out-of-contract, verdict PASS, `rejectFindings: []`. The genuinely
    in-contract high finding is silently dropped from the fix list (AC-1
    violated).
  - agent returns [out-of-contract, in-contract] → both become in-contract,
    verdict REJECT, `rejectFindings` contains `docs/x.md`. An out-of-contract
    finding entered the round's fix list — exactly the invariant AC-5 and
    the block comment at line 521 ("Out-of-contract KHÔNG BAO GIỜ vào đây —
    chốt chặn chính của feature") exist to prevent.

  Second direction is the serious one: it re-opens the OneFlow spiral the
  feature was built to close, and no existing test catches it because every
  WT-T* fixture uses unique titles.
  rationale: Repro hướng thứ hai cho thấy một finding out-of-contract bị gán
  nhầm thành in-contract và lọt vào `rejectFindings`, đúng thứ AC-5
  ("out-of-contract KHÔNG BAO GIỜ vào rejectFindings") cấm.

- **Scope-triage maps results by title alone — same-title findings in different files get silently cross-classified**
  file: `feature-loop/workflows/acceptance-verify.js:505`
  severity: high
  source: bugs
  AC: AC-1
  detail: `triageByTitle` is built with `new Map(triaged.map(t => [t.title, t]))`
  and looked up per finding by `f.title` only. `TRIAGE_SCHEMA` has no `file`
  field, so the agent cannot disambiguate either. Two confirmed findings
  sharing a title collapse: the Map keeps the LAST entry and BOTH findings
  inherit its classification.

  This is not hypothetical — the `invariants` reviewer prompt (line 313)
  explicitly instructs `title=ten check/rule`, so the same rule violated in
  two files produces two findings with identical titles by construction.

  Repro through `tests/workflows/harness.mjs` (real workflow file, vm
  realm), two findings titled `thieu validation o boundary` in
  `src/in-scope.ts` (triaged inContract:true/AC-1) and
  `other/out-of-scope.ts` (triaged inContract:false):
  ```
  verdict: PASS            <- expected REJECT (high + in-contract)
  rejectFindings files: [] <- the in-contract high finding vanished from the fix list
  ```
  both entries came back `inContract:false, acRef:null,
  proposal:"known-limits"`.

  Both directions are damaging and both are silent: (a) an in-contract high
  finding is dropped from `rejectFindings` and never REJECTs, and
  review-findings.md tells the human it is "outside the approved scope" — a
  false statement; (b) with the opposite ordering, an out-of-contract
  finding is stamped in-contract and goes into the machine's fix list, which
  is exactly the undefined-behaviour patching spiral this feature exists to
  stop. Nothing logs, nothing flags — `triageFailed` stays false. WT-T1..T9
  all use unique titles so the suite is blind to it. Fix: key on
  `file :: title` (the `distinctKey` at line 531 already treats that as the
  identity) and add `file` to TRIAGE_SCHEMA so the agent emits it.
  rationale: Repro của chính finding này cho verdict PASS thay vì REJECT khi
  có confirmed finding severity high triaged in-contract — đúng kịch bản và
  kỳ vọng mà AC-1 mô tả (must REJECT + có mặt trong rejectFindings).

- **"Contract could not be read → triageFailed" is documented in three places but not implemented**
  file: `feature-loop/workflows/acceptance-verify.js:477`
  severity: medium
  source: bugs
  AC: AC-4
  detail: `const hasContract = typeof args.contractPath === 'string' &&
  !!args.contractPath.trim()` checks only that a non-empty string was
  passed. There is no path from "the agent could not read the contract" to
  `triageFailed = true`: TRIAGE_SCHEMA has no unreadable/no-contract signal,
  and the prompt never tells the agent to report one.

  Three docs promise the opposite:
  - `acceptance-verify.js:32` header — "Vắng/không đọc được → triageFailed"
  - `feature-loop/skills/feature-loop/SKILL.md:120` — "file không đọc được
    → script tự về fail-toward-human"
  - `codex/feature-loop-codex/skills/feature-loop-codex/SKILL.md` —
    "unclassified — triage failed (agent dead after one retry, or the
    contract could not be read)"

  Actual behaviour with a stale/wrong `contractPath` (wrong slug, file not
  yet committed): the triage agent is spawned, its Read fails, and under the
  prompt rule "Không chắc chắn → inContract=false" it returns every finding
  as out-of-contract with a proposal. Result: `triageFailed:false`,
  `rejectFindings:[]`, verdict PASS, and review-findings.md prints "Các lỗi
  dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1" for findings
  whose scope was never actually checked. That reads as a triage result but
  is a fabrication.

  The eval that is supposed to cover this claims a case that does not exist:
  `_acceptance/s4-scope-triage/evals.yaml` E4 states "WT-T4c:
  args.contractPath trỏ file không tồn tại → CÙNG hành vi triageFailed", but
  `tests/workflows/acceptance-verify.test.mjs` WT-T4c does
  `delete args.contractPath` (missing key), never a path that points at a
  missing file. Neither the code nor the test covers what E4 asserts.
  rationale: AC-4 yêu cầu contract.md không đọc được phải cho
  `triageFailed: true` và fail-toward-human, nhưng finding chứng minh hành vi
  thực tế là agent tự trả kết quả out-of-contract fabricated, `triageFailed`
  vẫn false.

- **globToRe: `**` never matches zero path segments, producing false coverage-cluster flags**
  file: `feature-loop/workflows/acceptance-verify.js:528`
  severity: medium
  source: bugs
  AC: AC-7
  detail: `globToRe` splits on `**` and joins with `.*`, so the surrounding
  slashes stay literal. Verified output:
  ```
  'src/**/*.ts'  -> ^src\/.*\/[^/]*\.ts$   does NOT match 'src/a.ts'
  '**/*.ts'      -> ^.*\/[^/]*\.ts$        does NOT match 'a.ts'
  ```
  In standard glob semantics `**/` matches zero or more directories, so a
  file directly in the declared root is covered. Here it is not.

  Consequence: a finding in a file that an eval's `paths` genuinely covers is
  counted in `outsideCoverage`; two such findings trip `coverageCluster` and
  the human is handed a fabricated "⚠ Cụm ngoài vùng phủ … dừng và quyết: mở
  rộng hợp đồng hay rút phạm vi" line at Gate 2. This repo's own evals only
  use the `dir/**` form (which works), so no current test exercises it, but
  `paths` is author-supplied in every consuming repo's evals.yaml.

  Related exposure on the same comparison: FINDINGS_SCHEMA (line 98)
  declares `file` as a bare string with no description, and nothing tells
  reviewers to emit repo-relative paths, while `coverageRes` anchors with
  `^` against repo-relative globs. A reviewer that returns `/repo/src/x.ts`
  puts every finding outside coverage and flags the cluster on every round.
  rationale: AC-7 định nghĩa coverageCluster dựa trên việc finding có khớp
  glob `paths` hay không; regex sai khiến file thực sự nằm trong `paths` bị
  tính sai là ngoài vùng phủ, phá vỡ đúng phép tính mà AC-7 ràng buộc.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **`globToRe` leaves `?` unescaped — an eval `paths` glob with a leading `?` throws an uncaught SyntaxError and destroys the whole S4 round**
  file: `feature-loop/workflows/acceptance-verify.js:528`
  severity: medium
  source: conventions
  Đề xuất: new-contract
  detail: `globToRe` escapes `[.+^${}()|[\]\\]` and translates `*`/`**`, but
  leaves `?` — a standard glob metacharacter — untouched, where it becomes a
  regex quantifier. `coverageRes` (line 533) maps it over
  `args.evals.flatMap(e => e.paths)` unconditionally on every round, with no
  try/catch and no validation of the `paths` values, which come from the
  consuming repo's `_acceptance/<slug>/evals.yaml` (an external boundary the
  script does not own).

  Verified against the real file: `paths: ['?src/**']` produces
  `/^?src\/.*$/` → `SyntaxError: Invalid regular expression: Nothing to
  repeat`, thrown at `acceptance-verify.js:533` and propagating out of the
  workflow. The whole round is lost after every machine eval, ui-check,
  judge panel, review and refute agent has already run and paid for — no
  verdict, no run-log, no evidence report.

  This is the one spot in an otherwise carefully fail-toward-human block
  that fails by crashing: the two triage failure paths above it (missing
  `contractPath`, dead agent) both degrade to `triageFailed: true`. A bad
  glob should degrade to `coverageCluster: null` (`n-a`, the same as the
  no-paths case at line 539) rather than take the round down. Escaping `?`
  and wrapping the `new RegExp` in a try/catch that drops unparseable globs
  covers it.
  rationale: Không AC nào trong hợp đồng nói về việc parse glob lỗi/crash
  toàn round — đây là lỗ hổng robustness với input `paths` từ evals.yaml của
  repo tiêu thụ, ngoài phạm vi các AC đã liệt kê.

- **The four new "đối chứng đột biến" blocks in P51–P54 are tautologies that cannot fail**
  file: `tests/plugins/run-tests.sh:853`
  severity: low
  source: conventions
  Đề xuất: known-limits
  detail: Every one of the new mutation controls has the shape
  `grep -v P "$FILE" > "$CP"; if grep -q P "$CP"; then fail` (P51 at
  853-859, P52 at 880-886, P53 at 923-931, P54 at 958-964). Because the same
  literal is used both to build the mutant and to probe it, and grep is
  line-based, `grep -q P` on the output of `grep -v P` is false by
  construction — the branch is unreachable for any input. I confirmed it,
  including the degenerate case: the block also "passes" when the pattern is
  absent from the source file entirely, so it cannot distinguish a live
  check from a dead one (wrong path, emptied file).

  Contrast P48 immediately above (`tests/plugins/run-tests.sh:770-776`),
  which is the pattern already established in this file: it INJECTS a new
  `ledger_mark` call-site into the copy and re-runs the real comparison
  helpers (`p48_names` vs `p48_exp`) against the mutant, with a comment
  explaining that without it "P48 chỉ chứng minh hai chuỗi hôm nay bằng
  nhau, không chứng minh phép so còn sống (bất biến #4 CLAUDE.md)".

  The real assertions in P51–P54 (greps for pinned literals against the
  actual files) do discriminate and do pin exact messages, so the checks
  themselves are sound — but ~30 lines advertise a live mutation control
  that provides zero signal, and the contract's Notes explicitly commit to
  "MỌI assertion âm tính theo bất biến CLAUDE.md #4". Either follow P48
  (inject a near-miss and re-run the real predicate) or drop the blocks
  rather than leave dead ceremony that future readers will trust.
  rationale: Đây là lỗi chất lượng của khối mutation-control trong test,
  không phải hành vi runtime mà bất kỳ AC nào trong Criteria mô tả hay ràng
  buộc kết quả (verdict/rejectFindings/card/coverageCluster).

- **Mutation controls in P51–P54 are tautological — they pass even when the source file does not exist**
  file: `tests/plugins/run-tests.sh:853`
  severity: medium
  source: bugs
  Đề xuất: known-limits
  detail: Four new cases use the shape `grep -v 'X' FILE > COPY; if
  grep -q 'X' COPY; then "dot bien KHONG hieu luc"; fi` — P51 (line 853),
  P52 (880), P53 (923), P54 (958). `grep -v X` removes exactly the lines
  containing X, so `grep -q X` on the copy can never match. The branch is
  unreachable regardless of the file's content.

  Verified: running the P51 mutation block against a nonexistent path still
  prints the "mutation effective" outcome, i.e. the control passes with no
  source file at all. It therefore cannot distinguish "the check is alive"
  from "the check never ran / the file is missing / cp failed" — the exact
  class CLAUDE.md invariant 4 was written against.

  Compare P48 (line 767), which does it correctly: the mutation ADDS a
  call-site while the check is a set COMPARISON, so mutation and predicate
  are independent and the control can genuinely fail.

  This matters beyond test hygiene because evals.yaml cites these blocks as
  the positive controls for AC-8/AC-9/AC-11/AC-13 ("đối chứng dương: xoá
  dòng step trong bản sao gate.yml → case đỏ đúng thông điệp"). The mutated
  copy is never fed back through the case's own check and no expected
  message is pinned, so the claimed evidence does not exist.
  rationale: Cùng bản chất với finding P51-P54 phía trên — lỗi chất lượng
  của bản thân bộ test/mutation-control, không phải hành vi mà một AC nào
  trong Criteria của contract này đặc tả.

## Chưa adversarial-verify (refuter chết)

Không có — mọi finding round này đều đã adversarial-verify (repro qua
`tests/workflows/harness.mjs`, hoặc grep/đọc trực tiếp đúng dòng file, ghi
trong `detail:` của từng finding). Không có finder chết trong round này.

---

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).

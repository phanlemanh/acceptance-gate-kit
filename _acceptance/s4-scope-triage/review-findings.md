# Review Findings: s4-scope-triage (round 4)

Informational — outside the hook-enforced evidence-report schema. Chia theo
kết quả SCOPE-TRIAGE (in-contract / out-of-contract), không phải theo
reviewer lane.

## Trong hợp đồng

- **Writer prompt does not pin the heading level of the "Chua adversarial-verify" section, so unverified findings can leak into the Gate 2 out-of-contract block**
  file: `feature-loop/workflows/acceptance-verify.js:706`
  severity: medium
  source: conventions
  AC: AC-6
  detail: |
    `lib/out-of-contract.js:47-53` ends the `## Ngoài hợp đồng` section only
    at the next line matching `HEAD_ANY = /^##\s+/`. In the same bulleted
    list of the synthesize prompt, three sections are quoted WITH the
    marker — `"## Trong hợp đồng"`, `"## Ngoài hợp đồng — người quyết ở Gate
    2"`, and `"## Chưa phân loại (triage-failed)"` — but the last bullet
    says only: `Finding co unverified=true liet ke RIENG thanh section
    "Chua adversarial-verify (refuter chet)"`, with no `##`. The Codex SKILL
    has the same gap (line 460: `keeping the existing "Chua
    adversarial-verify" section`). When triage succeeds there is no `##
    Chưa phân loại` section in between, so the unverified section directly
    follows `## Ngoài hợp đồng`; if the agent writes it as `### …`,
    `**…**`, or a bare line, every `- **<title>**` under it is parsed by
    `parseFindings` as an out-of-contract finding and rendered on the Gate
    2 card under "Ngoài hợp đồng — bạn quyết" with the placeholder "(chưa
    có mô tả cho người đọc…)". That directly inverts AC-6, which excludes
    unverified findings from triage. P55's round-trip only exercises the
    OOC item template, not the section boundary, so nothing catches it.
    Fix: write `"## Chưa adversarial-verify (refuter chết)"` explicitly in
    both writers.
  rationale: AC-6 requires unverified findings to remain listed in the
  'Chưa adversarial-verify' section; this bug can merge them into the
  preceding OOC section on the card, directly breaking that requirement.

- **Distinct-finding key for the cluster threshold uses the raw path while glob matching normalizes it, so one finding can double-count into a false cluster**
  file: `feature-loop/workflows/acceptance-verify.js:568`
  severity: low
  source: conventions
  AC: AC-7
  detail: |
    `distinctKey = f => `${f.file} :: ${f.title}`` (line 568) dedupes on the
    RAW `file`, while `relFile` (line 576) was added precisely because
    reviewer agents legitimately return absolute paths (`WT-T13` pins that
    case, and the comment says `Chuan hoa phong thu la du; khong dua vao
    viec agent nghe loi`). The two reviewer lanes run independently against
    a prompt that names the repo by absolute path, so one lane can report
    `/repo/src/a.ts` and the other `src/a.ts` for the same defect with the
    same title. `dedupe` then keeps both, `triagedDistinct.length`
    inflates, and `outsideCoverage.length >= 2` can trip the "dừng và
    quyết" flag off a single defect — exactly what the comment above
    `distinctKey` says it exists to prevent (`hai reviewer cung thay mot
    loi la chuyen thuong, va no KHONG duoc tu nhan doi thanh "cum"`).
    Applying `relFile(f)` inside `distinctKey` closes it; note `triageKey`
    (line 545) is the same formula duplicated, so consider extracting one
    helper.
  rationale: AC-7 explicitly requires exactly-1-finding-outside-coverage to
  yield coverageCluster=null; this bug inflates one real defect into a
  false count of 2, directly violating that clause.

- **Coverage-cluster dedupe keys on the raw finding path while glob matching normalizes it — one defect seen by both reviewer lanes fabricates a cluster flag**
  file: `feature-loop/workflows/acceptance-verify.js:568`
  severity: medium
  source: bugs
  AC: AC-7
  detail: |
    `distinctKey = f => `${f.file} :: ${f.title}`` (line 568) dedupes on the
    **raw** `f.file`, but `relFile` (line 576) strips `args.repoRoot`
    before glob matching precisely because — as the comment on line 572
    states — reviewer agents are prompted with "trong repo <abs path>" and
    legitimately return absolute paths. The two reviewer lanes
    (`conventions`/`invariants` and `bugs`, lines 314-319) are independent
    agents, so one can report a defect as `/repo/other/plugins.md` and the
    other as `other/plugins.md`.

    Proved by running the real workflow through `tests/workflows/harness.mjs`
    with exactly that split: `coverageCluster =
    {"count":2,"total":2,"files":["other/plugins.md"]}` and
    `triaged.length === 2`. The flag is internally self-contradicting — it
    claims 2 findings across a file list of length 1 — and it crosses the
    `>= 2` threshold from a single real defect, pushing the human at Gate 2
    into a "mở rộng hợp đồng hay rút phạm vi" decision that has no basis.
    The card also renders that one out-of-contract item twice, since the
    synthesize prompt is fed `triaged` (not `triagedDistinct`).

    This defeats the stated purpose of the dedupe on line 566-567 ("hai
    reviewer cùng thấy một lỗi là chuyện thường, và nó KHÔNG được tự nhân
    đôi thành cụm"); WT-T7d only covers the case where both lanes return
    byte-identical paths. Fix: key the dedupe on `relFile(f)` instead of
    `f.file`, and dedupe `triaged` before handing it to the synthesize
    prompt.
  rationale: Same as the sibling finding: proven by execution that a single
  real defect trips coverageCluster into a false non-null 2-count, directly
  violating AC-7's 1-finding→null clause.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Codex writer never gets the literal cluster-flag line the shared reader parses — coverage-cluster warning can never fire on the Codex card (AC-9 parity broken in substance)**
  Người dùng thấy gì: Trên phiên bản Codex, cảnh báo 'có cụm lỗi nằm ngoài phạm vi đo lường' sẽ không bao giờ hiện trên thẻ quyết định dù tình huống đó thật sự xảy ra — người xem thẻ ở nhánh Codex mất một tín hiệu cảnh báo mà nhánh còn lại vẫn có.
  file: `codex/feature-loop-codex/skills/feature-loop-codex/SKILL.md`
  severity: high
  Đề xuất: new-contract
  source: conventions
  detail: |
    `lib/out-of-contract.js:18` pins `CLUSTER_RE = /^⚠\s*Cụm ngoài vùng
    phủ:\s*(.+)$/`, and `scripts/gate-card.js:369` renders the amber
    cluster flag only when that regex matches. The Claude writer pins the
    line verbatim in the synthesize prompt
    (`feature-loop/workflows/acceptance-verify.js:706`: `"⚠ Cụm ngoài vùng
    phủ: N/M lỗi rơi vào file không bộ đo nào phủ (...) — dừng và
    quyết..."`, plus the non-cluster `"cluster: n-a"` line). The Codex
    SKILL only says prose: "end the file with the cluster flag — stop and
    decide: widen the contract or narrow the scope" — no literal, no `⚠`
    sentinel, and the `n-a` line is not mentioned at all. Both harnesses
    render through the SAME `scripts/gate-card.js` (the SKILL itself says
    so at line 461). Result: a Codex round that produces a real coverage
    cluster writes some free-form sentence, `parse()` returns `cluster:
    null`, and the flag silently never reaches Gate 2 — the same
    silent-vanish failure mode the block's own comment warns about. AC-15 /
    P56 only pin the `Người dùng thấy gì` line and the `- **<title>**` item
    shape, so no eval covers this. Fix is one line: give Codex the exact `⚠
    Cụm ngoài vùng phủ: …` and `cluster: n-a` strings, and extend P56 to
    grep them.
  rationale: AC-9's literal text only requires 3-bucket triage /
  REJECT-only-for-high / fail-toward-human parity; it never mentions the
  cluster-flag literal string, so the claimed AC-9 break is a
  mischaracterization, not a literal AC failure.

- **Broken markdown fence in codex SKILL.md swallows steps 13-15 into a code block**
  Người dùng thấy gì: Một lỗi định dạng trong tài liệu hướng dẫn khiến vài bước hướng dẫn nội bộ (không thuộc phần phân loại phạm vi) bị hiển thị sai, có thể khiến các bước đó bị bỏ sót khi vận hành.
  file: `codex/feature-loop-codex/skills/feature-loop-codex/SKILL.md`
  severity: medium
  Đề xuất: known-limits
  source: conventions
  detail: |
    Line 471 is `    ``` When two or more` — a closing fence may not carry
    trailing non-whitespace content, so it does not close the block opened
    at line 465. The next fence, `    ```text` at 495, carries an info
    string and cannot close either, so the block opened at 465 stays open
    until line 505. Everything from 466 to 504 — the rest of the
    review-findings instructions, step 13 (provenance: `enforcement_mode` /
    `bypass_used`), step 14 (design-loop provenance verify / fidelity
    BLOCKED rule) and step 15 (evidence-report + the `## Codex routing`
    block) — renders as literal code rather than instructions, and every
    subsequent fence in the file is inverted. Identical defect in the
    mirror
    `plugins/feature-loop-codex/skills/feature-loop-codex/SKILL.md:471`
    (sync is faithful, so fixing the source and re-running sync clears
    both). Fix: close the fence on its own line and start "When two or
    more…" on the next line.
  rationale: Bug affects provenance/evidence-report/routing instructions
  unrelated to any of AC-1..AC-15's testable behavior for this triage
  feature.

- **Card instructions say the triage-failed flag REPLACES the out-of-contract block; the implementation adds it alongside**
  Người dùng thấy gì: Tài liệu hướng dẫn mô tả sai cách một cờ cảnh báo hiển thị trên thẻ so với những gì phần mềm thực sự làm; hiện chưa ảnh hưởng người dùng nhưng có thể gây hiểu nhầm sau này.
  file: `commands/acceptance-card.md:53`
  severity: low
  Đề xuất: known-limits
  source: conventions
  detail: |
    `commands/acceptance-card.md:53` states `Có "## Chưa phân loại
    (triage-failed)" → script thay khối bằng cờ vàng`, and
    `codex/acceptance-gate/skills/acceptance-card/SKILL.md:59` says `the
    script swaps the block for a single amber flag`.
    `scripts/gate-card.js:335-341` does the opposite and says so in its own
    comment: `Cờ hỏng-phân-loại CỘNG THÊM, không thay thế: nuốt cả khối thì
    các lỗi đã phân loại được biến mất khỏi chỗ người quyết dù chúng vẫn
    nằm trong file` — `if (ooc.unclassified)` pushes the flag, then `if
    (ooc.findings.length)` still renders the block. Today the two
    descriptions coincide because a triage-failed round yields zero
    out-of-contract findings, but a partially-written or hand-edited
    `review-findings.md` carrying both sections makes the docs describe
    behaviour the code deliberately rejects. Since the card SKILL is the
    contract for the translate step in both harnesses, reword both to
    "adds an amber flag above the block".
  rationale: No AC specifies how the triage-failed flag interacts with a
  coexisting out-of-contract block; this is a doc-wording mismatch with no
  currently observable behavior gap, per the finding's own note.

- **P53 fixture generator hardcodes an absolute machine path — the test renders with a different checkout than the one under test**
  Người dùng thấy gì: Một bài kiểm thử tự động không thực sự kiểm tra đúng phiên bản mã đang được đánh giá — nó có thể báo 'đạt' ngay cả khi phần hiển thị bị hỏng, khiến đội ngũ tin nhầm tính năng đang hoạt động đúng.
  file: `tests/plugins/fixtures/render-out-of-contract-block.sh:2`
  severity: high
  Đề xuất: known-limits
  source: bugs
  detail: |
    `ROOT="/Users/manh-macmini/dev/acceptance-gate-kit"` is hardcoded,
    while `tests/plugins/run-tests.sh:4` derives ROOT from `BASH_SOURCE`.
    P53 therefore regenerates the E11 judge fixture by invoking
    `$ROOT/scripts/gate-card.js` from the author's main checkout, never
    from the tree being tested.

    Proved by execution: in a detached worktree at HEAD I replaced the
    string `Ngoài hợp đồng — bạn quyết` in that worktree's
    `scripts/gate-card.js`. P52 correctly went red; **P53 still printed
    PASS** (`Results: 8 failed`, P53 among the passes). The byte-compare
    assertion is dead — it compares the fixture against a render produced
    by code outside the repo under test.

    Second consequence: on CI (`.github/workflows/gate.yml` runs `bash
    tests/plugins/run-tests.sh` on ubuntu-latest) that path does not exist,
    so `set -eu` aborts the generator, P53TMP holds only `head -6` of the
    fixture, cmp fails, and the failure message says `fixture da TROI so
    voi ban render hien tai` — a misleading diagnostic for what is
    actually a broken path. So the check is green-when-broken locally and
    red-always-for-the-wrong-reason in CI.

    This is the exact CLAUDE.md invariant about assertions that cannot
    distinguish "caught the right bug" from "never ran". Fix: derive ROOT
    the same way run-tests.sh does (`ROOT="$(cd "$(dirname
    "${BASH_SOURCE[0]}")/../../.." && pwd)"`) or accept it as `${1:-}` from
    the caller.
  rationale: This is test-infrastructure correctness, not a behavior
  specified by any AC in this contract.

- **Unterminated code fence in the Codex S4 instructions swallows the coverage-cluster rule into the code block**
  Người dùng thấy gì: Cùng lỗi định dạng tài liệu khiến quy tắc cảnh báo 'cụm lỗi ngoài phạm vi' trong hướng dẫn dành cho nhánh Codex bị trộn lẫn vào phần mẫu, khiến nhánh Codex có thể bỏ sót hoặc hiển thị sai cảnh báo này.
  file: `codex/feature-loop-codex/skills/feature-loop-codex/SKILL.md:471`
  severity: low
  Đề xuất: known-limits
  source: bugs
  detail: |
    Line 471 is `    ``` When two or more` — a closing fence with trailing
    text on the same line, which CommonMark does not accept as a closing
    fence. The fence opened at 465 therefore keeps consuming lines 472-474,
    so the rule "When two or more distinct confirmed findings sit in files
    that no eval's `paths` cover, end the file with the cluster flag — stop
    and decide: widen the contract or narrow the scope" renders as part of
    the `review-findings.md` item template rather than as an instruction.

    Effect: the Codex harness reads the cluster-flag requirement glued to
    the literal shape it is supposed to emit, so it may either omit the
    flag or emit the prose inside each item — and a wrong item shape is
    exactly the failure the surrounding paragraph warns about ("a wrong
    shape makes the whole block vanish from the card with no error").
    P54/P56 pin keywords and the item shape but nothing pins the cluster
    flag on the Codex side, so this degrades silently.

    Same defect is in the build mirror
    `plugins/feature-loop-codex/skills/feature-loop-codex/SKILL.md`. Fix:
    put the closing ``` on its own line and start the sentence on the next
    line, then re-run `scripts/sync-plugin-packages.sh`.
  rationale: This is a documentation-formatting defect in codex SKILL
  prose; neither AC-7 (machine cluster computation) nor AC-9 (3-bucket
  triage parity) literally covers malformed markdown fences in the
  instruction text.

## Chưa adversarial-verify (refuter chết)

(không có)

---

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).

# Review Findings: s4-scope-triage (round 3)

Informational — outside the hook-enforced evidence-report schema. Chia theo
kết quả SCOPE-TRIAGE (in-contract / out-of-contract), không phải theo
reviewer lane.

## Trong hợp đồng

(không có finding nào map được vào AC round này)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- Người dùng thấy gì: Trên thẻ quyết định Cổng 2, mục 'Ngoài hợp đồng' đôi khi biến mất hoàn toàn dù có phát hiện thật đang chờ, khiến người duyệt không thấy gì để quyết định.
  **Synthesize prompt specifies an item layout that lib/out-of-contract.js cannot parse — the whole "Ngoài hợp đồng" block silently vanishes from the Gate 2 card**
  file: `/Users/manh-macmini/dev/acceptance-gate-kit/feature-loop/workflows/acceptance-verify.js:706`
  severity: high
  source: conventions
  Đề xuất: known-limits
  detail: |
    The synthesize prompt instructs: `moi muc MO DAU bang dong "Người dùng
    thấy gì: <plain>" ..., roi moi den title/file/severity`. The reader,
    `lib/out-of-contract.js:parseFindings` (lines 22-45), only opens a
    finding on a `- **<title>**` line at column 0 and only attaches indented
    `key: value` lines that come AFTER it (`if (!cur) continue`).

    Reproduced directly against the shipped parser with a document in the
    prompt's stated order:

      - Người dùng thấy gì: Bấm Cập nhật có thể làm mất tiện ích đang cài.
        **rmSync before clone**
        file: `src/install.ts:10`
        severity: high
        Đề xuất: known-limits

    → `parse()` returns `{ present: true, findings: [], unclassified: false,
    cluster: null }`. `gate-card.js:334` gates the entire block on
    `ooc.findings.length`, so the block — including the three decision
    buttons — never renders, while `present` still advertises it. This is
    exactly the failure the module's own header comment warns about ("khối
    biến mất im lặng trong khi manifest vẫn quảng cáo là có") and the class
    CLAUDE.md invariant #3 targets.

    The layout is never round-tripped by any test: P52
    (`tests/plugins/run-tests.sh:~880`) and
    `tests/plugins/fixtures/render-out-of-contract-block.sh` both hand-write
    the title-first layout, and WT-T15 only asserts the prompt *contains*
    the substring "Người dùng thấy gì" — not that the resulting document
    parses. So writer and reader can disagree and every eval stays green.
  rationale: Không AC nào yêu cầu định dạng prompt phải khớp bộ đọc
  lib/out-of-contract.js; AC-2 chỉ đòi mục xuất hiện trong file
  review-findings.md kèm proposal, không đòi hỏi khả năng parse ngược cho
  card.

- Người dùng thấy gì: Cách ghi phát hiện 'Ngoài hợp đồng' không khớp với bộ đọc dùng để hiển thị thẻ Cổng 2, nên các mục đó hiện dòng giữ chỗ 'chưa có mô tả' thay vì nội dung thật, hoặc biến mất hẳn khỏi thẻ.
  **Synthesize prompt prescribes a review-findings.md layout the parser cannot read — out-of-contract findings silently degrade to a placeholder (or vanish) on the Gate-2 card**
  file: `feature-loop/workflows/acceptance-verify.js:706`
  severity: high
  source: bugs
  Đề xuất: known-limits
  detail: |
    The producer (synthesize prompt) and the consumer
    (lib/out-of-contract.js) disagree on the artifact format, and nothing
    detects the disagreement.

    The prompt says each out-of-contract item "MO DAU bang dong 'Người
    dùng thấy gì: <plain>' ... roi moi den title/file/severity" (plain line
    FIRST, then title), and never specifies any bullet/bold/indent
    structure at all — it only says "moi finding ghi title, file:line,
    severity, detail, source".

    The parser (lib/out-of-contract.js:27-34) requires the exact opposite:
    a finding only starts at a line matching `/^-\s+\*\*(.+?)\*\*\s*$/`,
    and key lines are only recorded after that (`if (!cur) continue`) and
    only when INDENTED
    (`/^\s+(file|severity|Đề xuất|proposal|Người dùng thấy gì)\s*:/`).

    Two failure modes, both silent:
    (a) Writer follows the prescribed ordering → the `Người dùng thấy gì`
    line comes before the title, gets dropped, and if it also carries the
    `- ` bullet the title line no longer matches, so `parseFindings` returns
    []. `parse()` still reports `present:true`, gate-card.js renders NO
    block, no flag, no error.
    (b) Writer keeps the `- **title**` bullet but omits the plain line
    (which is what actually happens today) → gate-card.js:350 falls back to
    the placeholder for every item.

    Reproduced on the repo's own machine-written artifact: running
    scripts/gate-card.js against
    _acceptance/s4-scope-triage/review-findings.md renders 'Ngoài hợp đồng —
    bạn quyết (4)' followed by four IDENTICAL rows reading '(chưa có mô tả
    cho người đọc — xem review-findings.md)'. `--extract` confirms
    `plain:""` on all four.

    No test covers this seam: P52 and P53 both hand-write fixtures already
    in the parser's format, and neither E8 nor E12 lists
    feature-loop/workflows/acceptance-verify.js in its `paths` — so a
    prompt-format change can never turn them red, and P1 carry-forward will
    skip re-running them.

    Fix: state the exact structure in the prompt (`- **<title>**` bullet,
    then indented `Người dùng thấy gì:` / `file:` / `severity:` /
    `Đề xuất:` lines) matching the parser, and add an eval that feeds a
    prompt-shaped artifact through lib/out-of-contract.js rather than a
    fixture pre-shaped for it.
  rationale: Cùng lý do với bản trùng của finding này: lệch định dạng
  máy-viết/máy-đọc không phải điều khoản nào trong contract yêu cầu tường
  minh (AC-2 chỉ đòi có mặt trong section kèm proposal).

- Người dùng thấy gì: Trên bản Codex, tài liệu hướng dẫn không yêu cầu viết câu mô tả dễ hiểu cho từng phát hiện 'Ngoài hợp đồng', nên khối này trên thẻ Cổng 2 luôn hiện dòng giữ chỗ thay vì thông tin thật.
  **Codex harness never instructs the writer to emit the `Người dùng thấy gì` line or the parseable finding structure — the out-of-contract block is guaranteed broken on Codex**
  file: `codex/feature-loop-codex/skills/feature-loop-codex/SKILL.md:451`
  severity: medium
  source: bugs
  Đề xuất: known-limits
  detail: |
    The Codex S4 instruction says only: "Write every bin to
    `_acceptance/<slug>/review-findings.md` under the headings '## Trong
    hợp đồng', '## Ngoài hợp đồng — người quyết ở Gate 2', and '## Chưa
    phân loại (triage-failed)'". It never mentions the `plain` field, the
    `Người dùng thấy gì:` line, `Đề xuất:`, or the `- **<title>**` +
    indented-key structure that lib/out-of-contract.js requires. (grep for
    'Người dùng thấy gì' / 'plain' in that file returns only one hit, in
    the Gate-2 *presentation* section at line 525 — not the file-writing
    step.)

    Both harnesses render the Gate-2 card through the same
    scripts/gate-card.js + lib/out-of-contract.js, and
    codex/acceptance-gate/skills/acceptance-card/SKILL.md explicitly
    promises "The text shown is the `Người dùng thấy gì` line written by
    scope-triage". Since the Codex writer is never told to produce that
    line, every out-of-contract item on a Codex-generated card falls to the
    '(chưa có mô tả cho người đọc)' placeholder at gate-card.js:350 — or, if
    the structure differs at all, the block disappears entirely with no
    error.

    P54, the AC-9 'codex parity' check, only greps six keyword strings
    ('scope-triage', 'in-contract', 'out-of-contract', 'unclassified',
    'Never fix out-of-contract', 'fail toward the human') plus the
    `acceptance_triage` routing row. It asserts nothing about the artifact
    format, so this parity gap passes green.
  rationale: Giống finding song sinh: đòi hỏi dòng mô tả sản phẩm không nằm
  trong chữ của AC-9 (chỉ đòi 3 ngăn + gating REJECT + fail-toward-human),
  nên đây là suy diễn AC gần giống chứ không phải thất bại tiêu chí đã ghi.

## Chưa phân loại (triage-failed)

phân loại phạm vi không chạy được — không lỗi nào bị máy tự sửa, người xem lại toàn bộ.

- **Codex harness never emits the "Người dùng thấy gì" line, so the shared renderer prints the placeholder for every out-of-contract finding — AC-9 parity is not actually met**
  file: `/Users/manh-macmini/dev/acceptance-gate-kit/codex/feature-loop-codex/skills/feature-loop-codex/SKILL.md:451`
  severity: high
  source: conventions
  detail: |
    The new Codex scope-triage section defines the three bins and
    instructs `Write every bin to _acceptance/<slug>/review-findings.md
    under the headings "## Trong hợp đồng", "## Ngoài hợp đồng — người
    quyết ở Gate 2", and "## Chưa phân loại (triage-failed)"` — but it
    never mentions the `Người dùng thấy gì:` line, nor a product-language
    `plain` field on the triage output at all (`grep -n 'Người dùng thấy
    gì\|plain'` on that file returns nothing).

    `scripts/gate-card.js:351` is shared by both harnesses and prints ONLY
    `f.plain`, falling back to `(chưa có mô tả cho người đọc — xem
    review-findings.md)`. So on Codex every out-of-contract finding renders
    as that placeholder and the block carries no information for the
    person deciding — the entire point of the feature.

    This also contradicts the sibling Codex skill:
    `codex/acceptance-gate/skills/acceptance-card/SKILL.md:49-51` states
    "The text shown is the `Người dùng thấy gì` line written by
    scope-triage", i.e. the Codex card skill documents a line the Codex
    feature-loop skill is never told to write.

    P54 (`tests/plugins/run-tests.sh:~1020`) pins six key strings —
    `scope-triage`, `in-contract`, `out-of-contract`, `unclassified`,
    `Never fix out-of-contract`, `fail toward the human` — plus
    `acceptance_triage`; none covers the plain-line contract, so E9/AC-9
    ("hai harness phải cùng ngữ nghĩa") passes while the harnesses render
    different cards.

## Chưa adversarial-verify (refuter chết)

(không có)

---

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).

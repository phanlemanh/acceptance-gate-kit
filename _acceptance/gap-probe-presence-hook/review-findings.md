# Review Findings: gap-probe-presence-hook (round 4)

Informational — nằm NGOÀI phạm vi acceptance-evidence-gate hook (hook chỉ đọc
`evidence-report.md`/`contract.md`). File này liệt kê các finding đã qua
**adversarial-verify** (refuter đã chạy và xác nhận, không chỉ heuristic một
lượt) trên diff của feature `gap-probe-presence-hook` tính tới
`verified_commit: 834eae810990af0450fe8b70a572eb9551c060c8`, dùng để nạp cho
`evidence-page.js` (bảng "Review findings") và cho human đọc tại Gate 2. File
này GHI ĐÈ nội dung findings của round trước; lịch sử round nằm ở
`evidence-report.md` § Iterations.

8/8 finding dưới đây đều đã adversarial-verify thành công (không có finding
nào gắn `unverified: true`). Sắp xếp severity giảm dần.

## High severity (2)

### 1. gate job applies the PR-scoped T1-escape backstop to every push commit on main — the release commit fails its own gate

- title: gate job applies the PR-scoped T1-escape backstop to every push commit on main — the release commit fails its own gate
  file: .github/workflows/gate.yml
  line: 48
  severity: high
  source: bugs
  category: correctness
  detail: |
    The `Resolve PR base` step sets `PRE_MERGE_BASE=$(git rev-parse HEAD~1)`
    for non-PR events, and the next step (`pre-merge check`, line 50) runs
    `pre-merge-check.sh .` with no event guard. Since 78929ae/ead1c84 hoisted
    the diff scope, a non-empty base now enables the T1-escape backstop
    inside that step — so it runs on `push: branches:[main]` too, comparing
    a single commit against its parent. This directly contradicts the
    workflow's own comment at line 57 ("Chỉ chạy trên pull_request: một
    `push` không có nhánh base để so") and the separate guarded step at line
    56 becomes redundant on PRs.

    Reproduced at HEAD, running exactly what CI runs on push:

      $ bash scripts/pre-merge-check.sh . --base "$(git rev-parse HEAD~1)"
      VIOLATION [PR]: non-T1 files changed (outside t1_skip_globs) but the PR carries NO _acceptance/<slug>/ artifacts ...
          .claude-plugin/plugin.json
          .codex-plugin/plugin.json
          codex/acceptance-gate/.codex-plugin/plugin.json
          plugins/acceptance-gate/.codex-plugin/plugin.json
          plugins/acceptance-gate/README.md
          tests/plugins/run-tests.sh
      pre-merge-check: 2 violation(s) — merge blocked   (EXIT=1)

    Failure scenario: commit 834eae8 (`release(acceptance-gate): 1.21.0`, the
    commit that ships this workflow) changes 7 files, 0 of them under
    `_acceptance/`. Pushed to main, the `gate` job goes red. Same for any
    release, mirror-sync, or CI-tweak commit landed directly on main — none
    of which carry gate artifacts by design. A gate that is red on main for
    structural reasons is the failure mode ADR 0004 is written against.

### 2. Signed-off evidence is stale at HEAD: t1_skip_globs omits the generated plugins/ mirror and the version manifests

- title: Signed-off evidence is stale at HEAD: t1_skip_globs omits the generated plugins/ mirror and the version manifests
  file: _acceptance/config.yaml
  line: 38
  severity: high
  source: bugs
  category: correctness
  detail: |
    `risk_tiers.t1_skip_globs` lists only docs (`docs/**`, README/GUIDE/
    QUICKSTART/CHANGELOG/CONTEXT/CLAUDE.md, `.out-of-scope/**`). It does not
    exempt `plugins/**` (a generated build mirror per CLAUDE.md + ADR 0001),
    `.claude-plugin/plugin.json`, `.codex-plugin/plugin.json`, or
    `.github/**`. The stale-guard compares every non-`_acceptance/`,
    non-t1 file against the report's `verified_commit`, so the version-bump
    + `sync-plugin-packages.sh` commit that necessarily lands *after* Gate-2
    signoff immediately invalidates the signature it just collected.

    Reproduced at HEAD with no base at all (so this is independent of the
    workflow finding above):

      $ bash scripts/pre-merge-check.sh .
      VIOLATION [gap-probe-presence-hook]: evidence is stale — code changed after verify (verified_commit 14f7b0b...); re-run verify before merge. Changed:
          .claude-plugin/plugin.json
          .codex-plugin/plugin.json
          codex/acceptance-gate/.codex-plugin/plugin.json
          plugins/acceptance-gate/.codex-plugin/plugin.json
          plugins/acceptance-gate/README.md
          tests/plugins/run-tests.sh
      pre-merge-check: 2 violation(s) — merge blocked   (EXIT=1)

    Failure scenario: signoff lands at 827f549 with verified_commit
    14f7b0b; the release commit 834eae8 bumps four plugin.json files and
    the mirror. Every subsequent CI run on main reports the feature as
    stale forever, and the only way out is re-running S4 after each
    release — which itself produces another post-verify commit. The `gate`
    job is red at HEAD in both the `--base` and no-base configurations.

## Medium severity (4)

### 3. Invariant 1 — nguồn sự thật: danh sách 9 thư mục vẫn bỏ sót README.md / GUIDE.md / QUICKSTART.md

- title: Invariant 1 — nguồn sự thật: danh sách 9 thư mục vẫn bỏ sót README.md / GUIDE.md / QUICKSTART.md
  file: CLAUDE.md
  line: 3
  severity: medium
  source: invariants
  detail: |
    Commit 5c2f659 sửa CLAUDE.md với mục đích tường minh là "danh sách
    nguồn kể đủ 9 thư mục, không phải 5", và trích dẫn
    `scripts/sync-plugin-packages.sh:27-31` làm bằng chứng. Nhưng dòng
    27-31 chỉ là 5 lệnh rsync THƯ MỤC (skills/scripts/lib/vendor/hooks);
    ngay dòng 32-34 kế tiếp là vòng lặp `for file in README.md
    QUICKSTART.md GUIDE.md; do rsync -a "$ROOT/$file" "$out/$file"; done`
    — trích dẫn dừng đúng một dòng trước chỗ đó. Đã kiểm chứng: cả ba
    file ở root đều byte-identical với `plugins/acceptance-gate/<file>`
    (diff -q sạch). Hệ quả đúng bằng cái invariant sinh ra để chặn: sửa
    `plugins/acceptance-gate/README.md` (hay GUIDE.md, QUICKSTART.md) là
    mất việc ở lần sync kế, mà CLAUDE.md không hề cảnh báo — grep
    'README|GUIDE|QUICKSTART' trong CLAUDE.md trả 0 hit.
    `design-loop/README.md` (sync-plugin-packages.sh:55) cũng cùng cảnh.
    Con số đúng phải là 9 thư mục + 4 file, không phải 9 thư mục.

### 4. Invariant 2 — CONTEXT.md: từ vựng gap-probe của chính feature này không có mục nào trong glossary, và làm `verdict` / `clean` mang hai nghĩa

- title: Invariant 2 — CONTEXT.md — từ vựng gap-probe của chính feature này không có mục nào trong glossary, và làm `verdict` / `clean` mang hai nghĩa
  file: CONTEXT.md
  line: 51
  severity: medium
  source: invariants
  detail: |
    Feature chính của dải diff (release 1.21.0) đưa gap-probe lên hạng
    luật chặn merge với cả một bộ từ vựng mới: khoá config
    `gap_probe: required|advisory|off`, artifact `gap-probe.md`, 4 trạng
    thái `outcome` (ok/probe-failed/descoped/missing), marker máy-đọc
    `GAP-PROBE: NOT ENFORCED reason=`. Grep 'gap.probe' trong CONTEXT.md
    trả 0 hit — không term nào được đăng ký, dù CLAUDE.md nói "Term mới
    chỉ thêm khi kit thật sự cần nó" và một luật chặn merge có 4 trạng
    thái + khoá config là đúng ngưỡng đó. Nặng hơn: bộ từ này ĐỤNG hai
    term đã chốt. (a) `lib/gap-probe.js:59-64` đọc trường `verdict:` với
    giá trị `clean`/`findings`/`probe-failed`, trong khi CONTEXT.md:51-55
    định nghĩa **Verdict** là "Kết luận CẤP REPORT: PASS/REJECT/BLOCKED"
    và cấm dùng từ này cho đơn vị nhỏ hơn report. (b) `clean` trong
    CONTEXT.md:121 đã được cấp cho một bucket của `network_observed`, nay
    gánh thêm nghĩa verdict của gap-probe. Đây đúng loại va chạm mà
    `docs/research/2026-07-25-mattpocock-skills-teardown.md:315` nêu ra
    để biện minh cho việc lập glossary ("`verdict` (…của eval) vs
    `verdict` (kết luận report)") — feature kế tiếp lại tái lập nó.
    Không có lint nào bắt: W6 (`scripts/eval-coverage-lint.js` +
    `lib/context-glossary.js`) chỉ soi `contract.md` của repo tiêu thụ,
    còn CONTEXT.md của kit là authoring-time, không có máy gác.

### 5. Invariant 2 — CONTEXT.md: workflow và job CI đặt tên trơ là `gate`, đúng framing đã bị loại

- title: Invariant 2 — CONTEXT.md — workflow và job CI đặt tên trơ là `gate`, đúng framing đã bị loại
  file: .github/workflows/gate.yml
  line: 1
  severity: medium
  source: invariants
  detail: |
    CONTEXT.md:59-64 chốt: "Máy móc không phải Gate… CI gọi là
    **pre-merge check**", _Avoid_ "evidence gate, merge gate, quality
    gate (khi chỉ hook/CI)", và ngoại lệ P0 design gate còn buộc "luôn
    kèm định tố… không bao giờ viết trơ 'the Gate'". Mục "Rejected
    framings" (CONTEXT.md:131-133) nêu rõ lý do loại: `gate` đang gánh
    3-4 nghĩa và làm mờ điểm bán chính — Gate là chỗ DUY NHẤT cần con
    người. File `.github/workflows/gate.yml` (thêm mới ở 89f7f95, tức
    SAU khi CONTEXT.md landing ở 038be4d) đặt `name: gate` ở dòng 1 và
    job `gate:` ở dòng 25 — trơ, không định tố, cho một thứ thuần máy.
    `name:` dòng 1 là tên hiển thị trên GitHub Checks/UI nên là văn,
    không thuộc miễn trừ "glossary trị văn, không trị tên file" (miễn
    trừ đó CONTEXT.md nêu đích danh cho `acceptance-evidence-gate.js` —
    một tên có sẵn, còn đây là lần đặt tên mới). Bằng chứng nội tại rằng
    term đúng đã biết: chính step bên trong job, dòng 50, đặt tên chuẩn
    "pre-merge check (evidence + signoff + stale + run-log)".

### 6. gate-card silently renders no glossary block and no flag when lib/context-glossary.js fails to load

- title: gate-card silently renders no glossary block and no flag when lib/context-glossary.js fails to load
  file: scripts/gate-card.js
  line: 62
  severity: medium
  source: bugs
  category: silent-failure
  detail: |
    `let glossaryLib = null; try { glossaryLib = require(.../context-glossary.js); } catch (_) {}`
    swallows the load error, and the guard at line 68 is
    `if (glossaryPresent && glossaryLib)`. When the lib is missing or
    throws (syntax/runtime error), `glossaryDelta` stays `null` AND
    `glossaryDeltaErr` stays `null`, so none of the four render branches
    fire: line 226 (`glossaryDelta && glossaryDelta.length`), line 230
    (`glossaryDelta && !glossaryDelta.length`), line 231 (`'no-base'`),
    line 232 (`'git-failed'`). The Gate-1 card shows nothing at all about
    vocabulary.

    This is the exact state line 232's warning exists to prevent ("term
    mới/sửa CHƯA được trình, đừng coi là 'không có thay đổi'"), and it
    contradicts commands/acceptance-card.md which promises "thiếu cờ thì
    thẻ chỉ ghi chú info, không im lặng bỏ qua".

    Reproduced by copying scripts/ + lib/ to a temp root and replacing
    lib/context-glossary.js with invalid JS:
      $ node gcx/scripts/gate-card.js --root gcx --slug gap-probe-presence-hook --gate 1 --extract --glossary-base HEAD
      glossary_delta: {"present":true,"computed":false,"error":null,"terms":[]}
    A human approves Gate 1 believing the feature introduced no new terms,
    when in fact the check never ran. Setting glossaryDeltaErr to a third
    value (e.g. 'lib-missing') in the catch, or on the `!glossaryLib`
    branch, closes it.

## Low severity (2)

### 7. Invariant 1 — thông điệp script sync còn in version cũ 1.20.1 sau khi bump 1.21.0

- title: Invariant 1 — thông điệp script sync còn in version cũ 1.20.1 sau khi bump 1.21.0
  file: scripts/sync-plugin-packages.sh
  line: 75
  severity: low
  source: invariants
  detail: |
    Commit release 834eae8 bump `.claude-plugin/plugin.json`,
    `.codex-plugin/plugin.json`, `codex/acceptance-gate/.codex-plugin/plugin.json`
    và mirror lên 1.21.0 (đã xác nhận cả 3 nguồn + mirror đều là
    "1.21.0"), nhưng bỏ sót dòng 75 của chính script sync: `echo "Synced
    Codex packages: acceptance-gate@1.20.1 feature-loop-codex@1.16.1
    design-loop@0.3.0"`. Đây là lệch có thật, không phải chuyện thẩm mỹ:
    giữ dòng này khớp version là thông lệ đã có — commit b076732 trước
    đó đã sửa đúng dòng này từ 1.19.0 lên 1.20.1. Không test nào bắt
    được vì `build_acceptance` rsync `scripts/` với `--exclude
    'sync-plugin-packages.sh'` (dòng 28), nên script tự loại mình khỏi
    mirror và P30 không bao giờ nhìn thấy nó. Kết quả: người chạy sync
    được báo sai số hiệu bản vừa dựng.

### 8. Glossary term names are corrupted by underscore stripping — snake_case terms render mangled on the Gate-1 card

- title: Glossary term names are corrupted by underscore stripping — snake_case terms render mangled on the Gate-1 card
  file: lib/context-glossary.js
  line: 66
  severity: low
  source: bugs
  category: correctness
  detail: |
    `cur.term = t[1].replace(/[`*_]/g, '').trim()` (also line 114 in
    termsAtLines and line 55 in splitList) strips backticks, asterisks
    AND underscores from the term name. Underscores are meaningful
    inside identifier-shaped terms, which CONTEXT.md uses.

    Reproduced against the repo's own CONTEXT.md:
      $ node scripts/gate-card.js --slug gap-probe-presence-hook --gate 1 --extract --glossary-base 9b545a8
      ... { "term": "networkobserved", "added": true } ...
    The glossary entry is `**`network_observed`**`; the human reviewing
    the "Từ vựng chốt ở feature này" block sees `networkobserved`, a term
    that exists nowhere in the repo. Secondary effect: findViolations()
    adds every canonical term as an implicit allow-span via
    spansOf(prose, t.term), so the allow-span for a snake_case term never
    matches its real spelling in prose. Stripping only ``` ` ``` and `*`
    (markdown emphasis/code markers) and leaving `_` intact fixes both.

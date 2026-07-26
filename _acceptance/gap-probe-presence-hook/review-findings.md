# Review Findings: gap-probe-presence-hook (round 3)

Informational — nằm NGOÀI phạm vi acceptance-evidence-gate hook (hook chỉ đọc
`evidence-report.md`/`contract.md`). File này liệt kê các finding đã qua
**adversarial-verify** (refuter đã chạy và xác nhận, không chỉ heuristic một
lượt) trên diff của feature `gap-probe-presence-hook` tính tới
`verified_commit: 14f7b0b4ec7ac979905f1612acc6507b64d94679`, dùng để nạp cho
`evidence-page.js` (bảng "Review findings") và cho human đọc tại Gate 2. File
này GHI ĐÈ nội dung findings của round trước; lịch sử round nằm ở
`evidence-report.md` § Iterations.

12/12 finding dưới đây đều đã adversarial-verify thành công (không có finding
nào gắn `unverified: true`). Sắp xếp severity giảm dần.

## High severity (1)

### 1. Invariant 1 — mirror phải commit CÙNG LƯỢT với nguồn

- title: Invariant 1 — mirror phải commit CÙNG LƯỢT với nguồn
  file: plugins/
  line: 1
  severity: high
  source: invariants
  detail: |
    CLAUDE.md:3-7 nói rõ: "sửa nguồn xong PHẢI chạy sync và commit mirror
    cùng lượt". Trong 9b545a8..HEAD có 11 commit nằm SAU khi CLAUDE.md ra
    đời (0a1110a) để lại plugins/ lệch nguồn. Tôi kiểm chứng bằng cách bung
    từng commit ra thư mục tạm rồi chạy chính scripts/sync-plugin-packages.sh
    --check: DRIFT (tức P30 đỏ) tại 3dd6f5c, 852edc5, 6164be0, c95402d,
    34ee656, f7b8f72, 8c593df, cd1ae63, 2e07374, 70ceb28, 6726213. Ví dụ
    6726213 thêm lib/gap-probe.js mà không có
    plugins/acceptance-gate/lib/gap-probe.js; cả chuỗi cd1ae63→70ceb28 sửa
    scripts/pre-merge-check.sh mà không sync. HEAD hiện đã xanh (sync dồn về
    sau), nên hậu quả là: mọi commit trung gian không build/test được,
    bisect gãy, và job CI 'gate' của chính kit sẽ đỏ nếu push từng commit —
    đúng thứ P30 sinh ra để chặn.

## Medium severity (6)

### 2. Invariant 1 — danh sách 'nguồn sự thật' trong CLAUDE.md thiếu lib/, scripts/, hooks/, vendor/

- title: Invariant 1 — danh sách 'nguồn sự thật' trong CLAUDE.md thiếu lib/, scripts/, hooks/, vendor/
  file: CLAUDE.md
  line: 3
  severity: medium
  source: invariants
  detail: |
    CLAUDE.md liệt nguồn là `skills/`, `feature-loop/`, `design-loop/`,
    `codex/`, `commands/`. Nhưng scripts/sync-plugin-packages.sh:27-31 rsync
    thêm `scripts/`, `lib/`, `vendor/`, `hooks/` vào mirror. Chính diff này
    thêm lib/gap-probe.js, lib/context-glossary.js và sửa nặng
    scripts/pre-merge-check.sh, scripts/gate-card.js,
    scripts/eval-coverage-lint.js, hooks/acceptance-evidence-gate.js — toàn
    bộ đều là nguồn được mirror mà bất biến không nhắc tên. Người đọc
    CLAUDE.md có thể kết luận plugins/acceptance-gate/lib/*.js là nơi sửa
    hợp lệ (vì lib/ không nằm trong danh sách nguồn), rồi bị P30 xoá mất
    thay đổi ở lần sync kế tiếp. Bất biến được viết trong chính diff này nên
    đây là lỗi của diff, không phải nợ cũ.

### 3. Invariant 2 — dùng từ trong _Avoid_ của CONTEXT.md: "thẻ" (canonical là "card")

- title: Invariant 2 — dùng từ trong _Avoid_ của CONTEXT.md: "thẻ" (canonical là "card")
  file: commands/acceptance-card.md
  line: 30
  severity: medium
  source: invariants
  detail: |
    CONTEXT.md:14-18 định nghĩa **Contract** kèm câu "card chỉ là lớp trình
    bày" và `_Avoid_: spec, PRD …, thẻ` — tức từ chuẩn là "card". Sau khi
    CONTEXT.md landing (038be4d) và sau cả commit sweep _Avoid_ (a7530a3),
    các commit mới vẫn viết "thẻ": commands/acceptance-card.md:30 ("để thẻ
    trình khối 'Từ vựng chốt ở feature này'") và :32 ("thiếu cờ thì thẻ chỉ
    ghi chú info") — do 7ffe6b2, chính là commit thêm khối từ vựng lên card;
    GUIDE.md:700 ("thẻ Cổng 1 cũng nhận cùng luật") do 8431a94. Còn 4 chỗ
    nữa trong
    _acceptance/gap-probe-presence-hook/{design-draft.md:4,9,35,
    gap-probe.md:29}.

### 4. Invariant 2 — "runner"/"engine" (từ _Avoid_ của Executor) còn sót sau commit sweep, và thêm mới sau CONTEXT.md

- title: Invariant 2 — "runner"/"engine" (từ _Avoid_ của Executor) còn sót sau commit sweep, và thêm mới sau CONTEXT.md
  file: skills/acceptance/references/eval-executors.md
  line: 8
  severity: medium
  source: invariants
  detail: |
    CONTEXT.md:31-33 khai `**Executor**: … _Avoid_: runner, engine`, và
    CONTEXT.md của kit KHÔNG có dòng `_Allow_:` nào (tôi parse bằng chính
    lib/context-glossary.js: allow = []). Chạy findViolations trên các dòng
    ĐƯỢC THÊM của diff cho 12 hit "runner" + 1 "engine" trong văn xuôi
    authoring: skills/acceptance/references/eval-executors.md:8,93,145,150,160;
    skills/acceptance/SKILL.md:288; skills/acceptance/references/contract-template.md:22;
    README.md:334,336; commands/acceptance-init.md:20 (+ bản codex song
    song). Hai chỗ tệ nhất là do 9e0fd88 — SAU khi CONTEXT.md tồn tại:
    codex/acceptance-gate/skills/acceptance-card/SKILL.md:26 và
    codex/acceptance-gate/skills/approve/SKILL.md:38 viết "If the runner is
    absent, run … with Node", ở đây "runner" lại mang nghĩa thứ ba (harness
    chạy slash-command), không phải executor cũng không phải E2E tool. Commit
    a7530a3 tự khai là sweep _Avoid_ theo CONTEXT.md nhưng bỏ trọn nhóm này.

### 5. Invariant 2 — CONTEXT.md khai một allowlist W6 mà chính nó không cài

- title: Invariant 2 — CONTEXT.md khai một allowlist W6 mà chính nó không cài
  file: CONTEXT.md
  line: 70
  severity: medium
  source: invariants
  detail: |
    CONTEXT.md:66-72 dựng ngoại lệ có chủ đích cho `P0 design gate` /
    `design-quality gate` và viết "Lint W6 (Đợt 2) phải allowlist cụm này".
    Nhưng CONTEXT.md không có dòng `_Allow_: design-quality gate`, mà W6
    (scripts/eval-coverage-lint.js:173-184) lấy allowlist duy nhất từ
    `_Allow_:` của CONTEXT.md repo. Tôi kiểm chứng: findViolations trên câu
    "the design-quality gate must block on contrast failures" trả về hit
    alias "quality gate" → term "Gate" (regex dùng lookbehind
    \p{L}\p{N}_ nên dấu `-` trong "design-" không chặn được match). Vì kit
    đã self-host (_acceptance/config.yaml landing trong chính diff này),
    một contract của kit nhắc tên tính năng đó sẽ ăn W6 warning cho đúng
    cụm mà CONTEXT.md vừa miễn trừ.

### 6. gate-card glossary block silently omitted when lib/context-glossary.js fails to load

- title: gate-card glossary block silently omitted when lib/context-glossary.js fails to load
  file: scripts/gate-card.js
  line: 68
  severity: medium
  source: bugs
  detail: |
    `glossaryLib` is loaded via a bare `try { require(...) } catch (_) {}`
    at line 62. When it is null the guard
    `if (glossaryPresent && glossaryLib)` at line 68 skips the whole block,
    leaving BOTH `glossaryDelta = null` AND `glossaryDeltaErr = null`.
    Consequently none of the three flags at lines 230-232 fire, and
    `--extract` emits `glossary_delta: {present: true, computed: false,
    error: null}`. Every other failure mode of this feature is surfaced to
    the Gate-1 human (`no-base` -> finfo, `git-failed` -> fwarn, whose text
    explicitly says "đừng coi là 'không có thay đổi'"), so this is the
    single path where the card renders exactly like a repo with no
    CONTEXT.md at all. Note `require('../lib/gap-probe.js')` at line 32 is
    unguarded, so a wholly-missing `lib/` crashes loudly — only a
    selectively-missing/broken `context-glossary.js` produces the silent
    state. Fix: set `glossaryDeltaErr = 'lib-missing'` in the catch and add
    a corresponding fwarn flag. Same code in the mirror at
    plugins/acceptance-gate/scripts/gate-card.js.

### 7. Kit self-hosting runs W6 vocab lint against its own authoring-time CONTEXT.md, contradicting the lib's stated scope

- title: Kit self-hosting runs W6 vocab lint against its own authoring-time CONTEXT.md, contradicting the lib's stated scope
  file: _acceptance/config.yaml
  line: 28
  severity: medium
  source: bugs
  detail: |
    lib/context-glossary.js's SCOPE header states: "The KIT's own
    CONTEXT.md is authoring-time — it governs how kit source is written and
    is never loaded at runtime." But the new dogfood config wires
    `executors.script.coverage_lint: "node scripts/eval-coverage-lint.js
    ."`, and `run()` in scripts/eval-coverage-lint.js:224 calls
    `glossaryLib.readGlossary(root)` with root = the kit repo — loading
    exactly that authoring-time file as if it were a consumer product
    glossary. Verified by execution: the kit CONTEXT.md parses to 33
    aliases including the bare English words `test`, `check`, `runner`,
    `tool`, `log`, `result`, `outcome`, `flow`, `warning`, `level`,
    `platform`, `tier`. Running `findViolations` over an ordinary English
    Given/When/Then criterion ("When the runner executes the check, Then
    the result is logged") produced 7 W6 hits across 2 lines. Any
    English-worded contract in this repo will bury W6 in false positives,
    which trains reviewers to ignore the warning class. Advisory-only today
    because `coverage_lint` is not in `feature_loop.suite_keys`, but wiring
    it as a suite key or an eval `cmd` would turn exit 1 into a FAIL. Either
    exclude the kit repo from W6 or split the authoring glossary from the
    runtime one.

## Low severity (5)

### 8. Invariant 4 — ADR không giữ dạng "1-đoạn-văn"

- title: Invariant 4 — ADR không giữ dạng "1-đoạn-văn"
  file: docs/adr/0001-commit-plugins-mirror.md
  line: 11
  severity: low
  source: invariants
  detail: |
    CLAUDE.md:19-20 quy định ADR là "1-đoạn-văn". docs/adr/0001 có 2 đoạn
    (đoạn 2 "Tham chiếu ngoài: mattpocock/skills ADR-0002…"), docs/adr/0003
    có 2 đoạn (đoạn 2 "Phương án đã loại…"). 0002 và 0004 đúng dạng (0004
    chỉ thêm một dòng "Ledger:/Răng:" ở cuối, chấp nhận được). Lệch nhỏ
    nhưng là bất biến do chính diff này viết ra, nên đáng chuẩn hoá ngay
    khi mới có 4 ADR.

### 9. Invariant 4 — self-host cổng + bật răng T1-escape ở CI không có ADR

- title: Invariant 4 — self-host cổng + bật răng T1-escape ở CI không có ADR
  file: docs/adr
  line: 1
  severity: low
  source: invariants
  detail: |
    Hai commit sau khi CLAUDE.md landing đổi chính sách merge của repo mà
    không để lại ADR nào: 89f7f95 ("kit chạy cổng của chính nó" — thêm
    _acceptance/config.yaml + .github/workflows/gate.yml) và d10fb45 ("bật
    răng T1-escape — chỉ chạy trên PR, và skip bị nâng thành lỗi").
    Trade-off là thật và đã lộ ngay trong diff: mọi PR chạm path ngoài
    t1_skip_globs từ nay phải kèm _acceptance/<slug>/ artifacts, và
    d-20260726T140100Z-111 trong ledger cho thấy fixture test phải dời ra
    ngoài repo chỉ để né răng này. Ghi nhận là judgment call: nếu
    maintainer coi đây là cờ bật/tắt dễ đảo thì thiếu điều kiện "khó đảo"
    và đúng luật là BỎ, không ghi ADR — nêu ra để quyết dứt điểm chứ không
    khẳng định là vi phạm chắc chắn.

### 10. Accidental comment deletion truncates the evaluateContractWrite doc-comment mid-sentence and drops documented behavior

- title: Accidental comment deletion truncates the evaluateContractWrite doc-comment mid-sentence and drops documented behavior
  file: lib/evidence-core.js
  line: 393
  severity: low
  source: bugs
  detail: |
    The only change to this file in the range removes the line
    `// transition source. Statuses outside the lifecycle names are
    ignored.` and adds a blank line before `return`. The doc-comment now
    ends mid-sentence — "oldPayload (the pre-write file, null when
    creating) supplies the" — and the documented contract that statuses
    outside the lifecycle names are ignored is gone, while the code at
    line ~400 still relies on it. This reads as an editing slip rather than
    an intentional change, and it lands in a file listed under
    `risk_tiers.t3_paths` (the enforcement core). Restore the deleted line.

### 11. sync-plugin-packages.sh --check drift guard misses extra packages and file-mode drift

- title: sync-plugin-packages.sh --check drift guard misses extra packages and file-mode drift
  file: scripts/sync-plugin-packages.sh
  line: 64
  severity: low
  source: bugs
  detail: |
    The `--check` guard iterates a hardcoded list: `for pkg in
    acceptance-gate feature-loop-codex design-loop-codex`. Two gaps. (1) A
    stale or renamed package directory left under `plugins/` is never
    compared, so the guard reports `plugins/ mirror in sync.` forever — and
    normal-mode `build_*` only `rm -rf`s its own `$out`, so nothing ever
    removes it either. (2) `diff -r -x .DS_Store` compares content only,
    not permission bits; `rsync -a` preserves modes, so an executable-bit
    change on a source script propagates on a real sync but is invisible to
    `--check`, leaving the committed mirror with a wrong mode that CI calls
    clean. CLAUDE.md asserts "test P30 (`sync-plugin-packages.sh --check`)
    chặn drift" — it blocks content drift in three named packages, not
    drift generally. Fix: build the package list from `ls "$DEST"` unioned
    with `ls "$ROOT/plugins"`, and compare modes (e.g. `find -printf '%m
    %p'` or `diff <(cd a && find . -printf ...) ...`).

### 12. feature-loop workflows fallback resolves via the same base-dir path that just failed

- title: feature-loop workflows fallback resolves via the same base-dir path that just failed
  file: feature-loop/skills/feature-loop/SKILL.md
  line: 9
  severity: low
  source: bugs
  detail: |
    The intro now says: if `ls "$WORKFLOWS_DIR"` does not show
    `acceptance-verify.js` + `execute-parallel.js`, run `node <base-dir>/../../scripts/resolve-plugin.mjs
    --plugin feature-loop --require workflows/acceptance-verify.js`. But
    `WORKFLOWS_DIR` is defined as `<base-dir>/../../workflows/` in the same
    sentence, so both the failing path and its recovery path are derived
    identically from `<base-dir>/../../`. In the common failure mode (the
    harness base-dir does not have the assumed
    `<plugin>/<version>/skills/feature-loop/` layout) the resolver itself
    is unreachable and the agent has no next step; the replaced cache glob
    was version-broken but at least searched the filesystem. The fallback
    only recovers the narrow case of a partially-synced install where
    `scripts/` exists but `workflows/` does not. Same wording in S4
    (`"$WORKFLOWS_DIR/../scripts/resolve-plugin.mjs"`) and S0 preflight.

## Chưa adversarial-verify (refuter chết)

none — cả 12 finding trên đều đã refuter xác nhận trong round này.

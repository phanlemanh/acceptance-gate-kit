# Review Findings: gap-probe-presence-hook (round 1)

Informational — nằm NGOÀI phạm vi acceptance-evidence-gate hook (hook chỉ đọc
`evidence-report.md`/`contract.md`). File này liệt kê các finding đã qua
**adversarial-verify** (refuter đã chạy và xác nhận, không chỉ heuristic một
lượt) trên diff của feature `gap-probe-presence-hook` tính tới
`verified_commit: 0d7f1ef5575069daa9d6dc8bd053bbde7c4fbef5`, dùng để nạp cho
`evidence-page.js` (bảng "Review findings") và cho human đọc tại Gate 2. File
này GHI ĐÈ nội dung findings của round trước; lịch sử round nằm ở
`evidence-report.md` § Iterations.

5/5 finding dưới đây đều đã adversarial-verify thành công (không có finding
nào gắn `unverified: true`). Sắp xếp severity giảm dần.

## High severity (2)

### 1. Invariant 1 — sửa nguồn mà không sync/commit mirror `plugins/` cùng lượt

- title: Invariant 1 — source edited without syncing/committing plugins/ mirror in the same commit
  file: lib/gap-probe.js
  line: 1
  severity: high
  source: invariants
  detail: |
    CLAUDE.md:5 requires "sửa nguồn xong PHẢI chạy sync và commit mirror cùng
    lượt". Replaying `scripts/sync-plugin-packages.sh --check` at every commit
    in the range (47 commits that ship the --check flag; 15 older ones
    skipped) shows 11 commits landed with a drifted mirror:

      3dd6f5c, 852edc5, 6164be0, c95402d, 34ee656, f7b8f72, 8c593df, cd1ae63,
      2e07374, 70ceb28, 6726213

    Spot-verified: 6726213 adds `lib/gap-probe.js` and touches **0** files
    under `plugins/`; cd1ae63 and 8c593df modify `scripts/pre-merge-check.sh`
    with 0 mirror files; 852edc5 modifies `hooks/acceptance-evidence-gate.js`
    + `lib/evidence-core.js` with 0 mirror files. 3dd6f5c is a *partial* sync
    — it touches 3 mirror files but leaves
    `plugins/acceptance-gate/scripts/gate-card.js` and
    `plugins/acceptance-gate/skills/acceptance/SKILL.md` behind.

    HEAD itself is in sync (P30 green), so the drift was repaired by later
    commits rather than per-commit as the invariant states. Practical
    consequence: `.github/workflows/gate.yml` runs the plugins suite (incl.
    P30) on `pull_request`, so any of these 11 commits used as a PR head
    would have failed CI, and any `git bisect` / cherry-pick across this
    range lands on a package with a stale mirror.

### 2. CI `gate` job is permanently red — `gap_probe: required` + no `--base` ⇒ unconditional VIOLATION

- title: CI `gate` job is permanently red — `gap_probe: required` + no `--base` => unconditional VIOLATION
  file: .github/workflows/gate.yml
  line: 39
  severity: high
  source: bugs
  detail: |
    The `gate` job runs `bash scripts/pre-merge-check.sh .` with no `--base`
    (and no `PRE_MERGE_BASE`). In pre-merge-check.sh that leaves
    `DIFF_READY=0`, which calls `gap_probe_not_enforced` (line ~253). Since
    `_acceptance/config.yaml:16` sets `gap_probe: required`, that helper
    emits `VIOLATION [gap-probe]: mode required nhưng luật không cưỡng chế
    được…` and increments `violations`, so the script exits 1 on EVERY run —
    both `push: main` and every `pull_request`.

    Verified by running it:
    ```
    $ bash scripts/pre-merge-check.sh .
    GAP-PROBE: NOT ENFORCED reason=no PR base given …
    VIOLATION [gap-probe]: mode required nhưng luật không cưỡng chế được — no PR base given …
    …
    pre-merge-check: 2 violation(s) — merge blocked   (EXIT=1)
    ```

    This is a stale-assumption bug, not a design choice: two comments written
    BEFORE the fail-closed floor landed still assert the opposite behavior.
    - gate.yml:36-38 — "Không --base ở job này … Luật gap-probe chỉ xét slug
      có file trong diff PR nên ở đây nó **tự bỏ qua kèm NOTE**"
    - _acceptance/config.yaml:17 — "Chỉ xét slug có file trong diff PR nên
      **nợ lịch sử không nổ**"

    Both predate commit 3784266 (`feat(pre-merge): sàn fail-closed + marker
    GAP-PROBE: NOT ENFORCED`), which converted the not-enforced path from
    NOTE to VIOLATION under `required`. gate.yml/config.yaml were last
    touched in the older commit 78929ae and never revisited. Fix options:
    pass `--base` (or `PRE_MERGE_BASE`) in the `gate` job, gate the gap-probe
    rule on PR events only, or drop the repo config to `advisory`.

## Medium severity (1)

### 3. Invariant 2 — CONTEXT.md mandates a W6 allowlist for its own sanctioned exception but declares no `_Allow_` entry

- title: Invariant 2 — CONTEXT.md mandates a W6 allowlist for its own sanctioned exception but declares no _Allow_ entry
  file: CONTEXT.md
  line: 71
  severity: medium
  source: invariants
  detail: |
    CONTEXT.md:66-72 carves out `P0 design gate` / `design-quality gate` as a
    deliberate exception to the "no 'gate' for machinery" rule and states
    "Lint W6 (Đợt 2) phải allowlist cụm này". W6 was implemented in this same
    range (3dd6f5c) on `lib/context-glossary.js`, whose parser supports
    exactly that mechanism (`_Allow_`, documented at
    lib/context-glossary.js:28-32 as being for "a named feature, a quoted
    external term"). CONTEXT.md ships with **zero** `_Allow_` lines —
    `readGlossary('.').allow` is `[]`.

    Verified consequence: `findViolations` on the string "a design-quality
    gate for web-UI surfaces" fires `quality gate ⇒ Gate` (the alias regex's
    lookbehind treats `-` as a boundary, so `design-quality gate` matches).
    Any consumer contract using the kit's own sanctioned phrase gets warned,
    and the kit's own shipped prose already contains it —
    `skills/acceptance/references/design-ui-check.md:3` ("The authoritative
    design-quality gate") and the `.claude-plugin/plugin.json` marketplace
    description. The mandated carve-out simply was not written.

## Low severity (2)

### 4. gate.yml comment contradicted by the fail-closed floor added later in the same range (kit's own CI is red on main)

- title: gate.yml comment contradicted by the fail-closed floor added later in the same range (kit's own CI is red on main)
  file: .github/workflows/gate.yml
  line: 36
  severity: low
  source: invariants
  detail: |
    Not one of the four CLAUDE.md rules, but it is the concrete cost of the
    missing ADR for d-128 and is worth surfacing with this review.
    gate.yml:36-38 states: "Không --base ở job này ... Luật gap-probe chỉ xét
    slug trong diff PR nên ở đây nó tự bỏ qua kèm NOTE". Commit 3784266 (Task
    4, decision d-128) then made mode `required` fail-CLOSED, so "bỏ qua kèm
    NOTE" is now a hard VIOLATION.

    Reproduced at HEAD: `bash scripts/pre-merge-check.sh .` exits 1 with
      GAP-PROBE: NOT ENFORCED reason=no PR base given ...
      VIOLATION [gap-probe]: mode required nhưng luật không cưỡng chế được ...
      VIOLATION [gap-probe-presence-hook]: verdict=PENDING-JUDGMENT (must be PASS to merge)

    `_acceptance/config.yaml:16` sets `gap_probe: required`, and the `gate`
    job runs on `push: branches: [main]` without `--base`, so every push to
    main now fails on the gap-probe floor in addition to the (expected)
    PENDING-JUDGMENT verdict. Either the push-trigger job should pass a base
    / drop to advisory, or the stale comment should go. (Same underlying bug
    as finding #2 above — this entry is the stale-comment half of it.)

### 5. `parseGlossary` blank-line handling is a no-op — `_Avoid_` lines outside a term block leak into the previous term

- title: parseGlossary blank-line handling is a no-op — _Avoid_ lines outside a term block leak into the previous term
  file: lib/context-glossary.js
  line: 77
  severity: low
  source: bugs
  detail: |
    Line 77 reads `if (!raw.trim()) cur = cur;` with the comment "A blank
    line ends a term block". The self-assignment does nothing — `cur` is
    never cleared, so an `_Avoid_:` line anywhere later in CONTEXT.md
    (including outside the glossary section) is appended to the last
    `**Term**:` block seen and minted as an alias for it.

    Demonstrated:
    ```
    **Order**:
    A request.
    _Avoid_: Purchase

    ## Some other section
    _Avoid_: report, gate
    ```
    → `[{alias:"Purchase",term:"Order"}, {alias:"report",term:"Order"},
    {alias:"gate",term:"Order"}]`

    Effect: bogus aliases drive false W6 warnings in eval-coverage-lint
    (advisory, so it does not block) and attribute them to the wrong
    canonical term in the message the Gate-1 human reads. Either implement
    the intended reset (`cur = null` on a blank line) or delete the dead
    statement and correct the comment.

## Chưa adversarial-verify (refuter chết)

none — cả 5 finding trên đều đã refuter xác nhận trong round này.

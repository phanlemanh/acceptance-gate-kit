# Review Findings: gap-probe-presence-hook (round 1)

Informational — nằm NGOÀI phạm vi acceptance-evidence-gate hook (hook chỉ đọc
`evidence-report.md`/`contract.md`). File này liệt kê các finding đã qua
**adversarial-verify** (refuter đã chạy và xác nhận, không chỉ heuristic một
lượt) trên diff của feature `gap-probe-presence-hook`, dùng để nạp cho
`evidence-page.js` (bảng "Review findings") và cho human đọc tại Gate 2.

8/8 finding dưới đây đều đã adversarial-verify thành công (không có finding
nào gắn `unverified: true`). Sắp xếp severity giảm dần theo đúng thứ tự nhận
từ review pass; hai cặp finding trùng vị trí (`lib/evidence-core.js:454` và
`lib/evidence-core.js:426`) đến từ hai lens review khác nhau (`conventions` vs
`bugs`) và được giữ NGUYÊN VẸN như hai finding riêng biệt — không gộp, không
viết lại — vì mỗi finding nêu một khía cạnh/severity riêng của cùng một vị trí
code.

## High severity (3)

### 1. Blocking branch is dead code — `gap_probe_expected` has no producer anywhere in the kit

- title: Blocking branch is dead code — `gap_probe_expected` has no producer anywhere in the kit
  file: lib/evidence-core.js
  line: 470
  severity: high
  source: conventions
  detail: The only hard-block path of the new guard requires `tier === 'T3' && expected`, where `expected` reads frontmatter `gap_probe_expected`. A repo-wide grep shows that marker exists ONLY in (a) this guard, (b) its own test fixtures, (c) the untracked plan doc, and (d) the feature's own `_acceptance/gap-probe-presence-hook/` ledger. No producer writes it: `skills/acceptance/references/contract-template.md` (the frontmatter source of truth, whose header block enumerates `risk_tier`/`status`/`gate1_skipped`/`surfaces`) does not list it, and `feature-loop/skills/feature-loop/SKILL.md` step 7 (the S1 step that authors the Gate-1 package) never emits it. The code comment defers to "feature-loop S1 (≥1.19) ghi" but `feature-loop/.claude-plugin/plugin.json` is at 1.16.1 — the producer version does not exist. Net effect: for every contract the current toolchain produces, the guard can only ever emit a NOTE; AC-2 is green solely because the test fixture `mk_gp` hand-writes `gap_probe_expected: true`. This is exactly the false-green shape the kit exists to prevent (CONTEXT.md: "False-green… Kẻ thù trung tâm của kit"), and the missing follow-up is tracked nowhere — no `.out-of-scope/` entry, no README known-limitation line, no ADR. Same code in the mirror `plugins/acceptance-gate/lib/evidence-core.js:470`.

### 2. Guard keys off contract STATE, not the Gate-1 transition — blocks unrelated edits and names the wrong cause

- title: Guard keys off contract STATE, not the Gate-1 transition — blocks unrelated edits and names the wrong cause
  file: lib/evidence-core.js
  line: 454
  severity: high
  source: conventions
  detail: The comment on line 450 states the rule "chỉ xét đúng khoảnh khắc chuyển sang `approved`", but the condition is `status === 'approved' && (tier === 'T2' || tier === 'T3')` — `oldStatus` is computed at line 439 and used by the sibling Gate-1 rule at line 445, yet ignored here. Verified failure: an `Edit` on an ALREADY-approved T3 contract (`gap_probe_expected: true`, no gap-probe.md) that only rewrites a line under `## Notes` exits 2 with `x gap-probe.md thiếu … contract T3 không được duyệt khi chưa qua phản biện context sạch` — nothing is being approved by that write. Because `status` stays `approved` for the entire implementation phase (the implementing agent only sets `implemented` as its final act, per contract-template.md), every contract write in that window re-evaluates: NOTE spam on T2/legacy workspaces, hard block on T3+marker. This also defeats the diff's own stated rationale for rewriting the block header ("Một thông điệp chặn nói sai nguyên nhân thì người đọc đi sửa nhầm chỗ"): the failure text says the contract "không được duyệt" on a write that performs no approval. Fix shape: gate on `oldStatus !== 'approved'` the way line 445 does. Mirrored at `plugins/acceptance-gate/lib/evidence-core.js:454`.

### 3. Docs drift: README states the opposite of shipped behavior; GUIDE hook-rule table and both file docblocks omit the new rule

- title: Docs drift: README states the opposite of shipped behavior; GUIDE hook-rule table and both file docblocks omit the new rule
  file: README.md
  line: 279
  severity: high
  source: conventions
  detail: The kit ships its docs as the product surface (mirrored verbatim into `plugins/acceptance-gate/`, drift-checked by P30), and GUIDE.md §7 is the enumerated reference for what the hook blocks. Four places are now stale/false: (1) README.md:279-282 and the published mirror plugins/acceptance-gate/README.md:279 still list under "Known limitations" — "**Gap-probe presence is flagged, not enforced**: a missing `gap-probe.md` only yellow-flags the Gate-1 card… A hook-level presence check is the queued v2 candidate" — which this diff makes false; (2) GUIDE.md:672 `| Contract guard | Đặt status: approved/signed-off khi approved_by rỗng; draft → implemented/verified nhảy cóc …|` and the flow node at GUIDE.md:646 enumerate every hook rule but not the gap-probe rule, so an operator hitting exit 2 finds no row explaining it; (3) hooks/acceptance-evidence-gate.js:26 docblock still describes the contract branch as transition-only and lists no NOTE channel, although that file's header deliberately enumerates all rules (L1 SHAPE … L3 JUDGMENT); (4) lib/evidence-core.js:12 still claims "Pure-ish… `evaluateEvidence` reads the sibling contract.md… everything else is a function of the payload + caller-supplied config text", now false — `evaluateContractWrite` reads `gap-probe.md` and `decisions.jsonl` from disk.

## Medium severity (4)

### 4. Descope match rule diverges from gate-card.js while comment, plan and AC-4 all assert parity

- title: Descope match rule diverges from gate-card.js while comment, plan and AC-4 all assert parity
  file: lib/evidence-core.js
  line: 426
  severity: medium
  source: conventions
  detail: The hook matches `/^\s*bỏ gap-probe/i` on `e.decision`; `scripts/gate-card.js:199` matches `/^bỏ gap-probe/i` and its ledger parser (`readLedger`, gate-card.js:113-128) does not trim the decision value. Verified in node: for `"  Bỏ gap-probe — viết hoa"` the hook regex returns true and the card regex returns false. The new code comment at lib/evidence-core.js:411-413 claims this is "ĐÚNG luật gate-card.js dùng, để thẻ và hook không bao giờ bất đồng", the plan's Global Constraints say "Card và hook không được bất đồng", and contract AC-4 says "trim khoảng trắng đầu — cùng luật với card" — none of which hold, because gate-card.js was not touched. Worse, test T71 (`tests/hooks/run-tests.sh:635`, fixture `"  Bỏ gap-probe — viết hoa"`) pins exactly the diverging string and labels it "cùng luật /i với card", locking the divergence in as expected behavior. Consequence at Gate 1: a ledger entry with a leading space makes the hook pass with a NOTE citing the entry id while the decision card still renders the fwarn "Chưa có phản biện context sạch" — the two Gate-1 signals contradict each other.

### 5. Generated test fixtures and .err outputs are committed, and 9 stale files remain at the abandoned fixture path

- title: Generated test fixtures and .err outputs are committed, and 9 stale files remain at the abandoned fixture path
  file: tests/hooks/run-tests.sh
  line: 596
  severity: medium
  source: conventions
  detail: `mk_gp` does `rm -rf "$d"; mkdir -p "$d"` and `gp_run` writes `2>"$GPD/$1.err"` — these directories and .err files are test OUTPUT, regenerated on every run, yet 21 of them are tracked (`tests/hooks/fixtures/gapprobe/_acceptance/t60.err … t72/decisions.jsonl`). The established pattern in this suite is the opposite: every generated fixture dir is gitignored (.gitignore lists `tests/hooks/fixtures/repo-warn/`, `repo-warn2/`, `repo-warn-c/`, `tests/hooks/fixtures/repo/_acceptance/upgrade-flow/`, `guard-flow/`, `fresh-flow/`), leaving only hand-written fixtures under source control. Additionally, commit c95402d moved the fixtures under `_acceptance/` but never deleted the originals: `tests/hooks/fixtures/gapprobe/t60.err, t61.err, t62.err, t62/gap-probe.md, t63.err, t63/gap-probe.md, t64.err, t64/gap-probe.md` are still tracked and referenced by nothing (`GPD="$HERE/fixtures/gapprobe/_acceptance"`, run-tests.sh:577) — dead fixtures that will read as live during the next fixture edit.

### 6. Gap-probe guard only fires on status: approved — draft -> implemented/verified/signed-off bypasses it entirely

- title: Gap-probe guard only fires on status: approved — draft -> implemented/verified/signed-off bypasses it entirely
  file: /Users/manhphan/dev/acceptance-gate-kit/lib/evidence-core.js
  line: 454
  severity: medium
  source: bugs
  detail: The guard condition is `status === 'approved' && (tier === 'T2' || tier === 'T3')`. The immediately adjacent Gate-1 rule at line 445 exists precisely because `draft -> implemented/verified` is a real path agents take, and that rule only requires `approved_by` to be non-empty — it never requires the contract to have literally passed through `status: approved`. So a T3 contract written with `status: implemented` + `approved_by: X` satisfies the Gate-1 check and never reaches the gap-probe guard. Verified empirically against hooks/acceptance-evidence-gate.js with a T3 contract carrying gap_probe_expected: true and no gap-probe.md/descope entry: status=approved -> exit 2 with the gap-probe violation; status=implemented -> exit 0, status=verified -> exit 0, status=signed-off -> exit 0, and stderr contains no gap-probe text in any of the three. There is no second layer to catch it: `evaluateContractWrite` is called only from the two hook copies (grep), and scripts/pre-merge-check.sh contains no gap-probe check at all. Same defect in plugins/acceptance-gate/lib/evidence-core.js:454.

### 7. Descope escape-hatch regex diverges from gate-card.js, so hook and decision card silently disagree

- title: Descope escape-hatch regex diverges from gate-card.js, so hook and decision card silently disagree
  file: /Users/manhphan/dev/acceptance-gate-kit/lib/evidence-core.js
  line: 426
  severity: medium
  source: bugs
  detail: findGapProbeDescope matches `/^\s*bỏ gap-probe/i` while scripts/gate-card.js:199 matches `/^bỏ gap-probe/i` (no leading-whitespace tolerance). The code comment above the function explicitly claims parity ("ĐÚNG luật gate-card.js dùng, để thẻ và hook không bao giờ bất đồng") and test T71 in tests/hooks/run-tests.sh deliberately locks in the divergent behaviour with the fixture `{"id":"d-2","type":"descope","decision":"  Bỏ gap-probe — viết hoa"}`. Verified: with that exact ledger line and a T3 contract, the hook exits 0 treating the feature as deliberately descoped, while `node scripts/gate-card.js --root <fixture> --slug x --gate 1 --extract` returns `"descoped": false` and the rendered card emits the fwarn 'Chưa có phản biện context sạch (gap-probe)'. Removing the leading spaces flips the card to `"descoped": true`. The divergence runs in the unsafe direction: a single stray leading space in decisions.jsonl disarms the hook's T3 block while the card still reports that no descope was recorded. Same in plugins/acceptance-gate/lib/evidence-core.js:426 vs plugins/acceptance-gate/scripts/gate-card.js:199.

## Low severity (1)

### 8. New test fixtures live under a */_acceptance/* path that pre-merge-check.sh treats as gate artifacts

- title: New test fixtures live under a */_acceptance/* path that pre-merge-check.sh treats as gate artifacts
  file: tests/hooks/run-tests.sh
  line: 577
  severity: low
  source: bugs
  detail: Commit c95402d moved the fixtures to tests/hooks/fixtures/gapprobe/_acceptance/ so they satisfy the hook's CONTRACT_RE. But scripts/pre-merge-check.sh:399 does `case "$f" in _acceptance/*|*/_acceptance/*) gate_touched=1; continue ;;` — the glob is not anchored to the repo root, so any change under tests/hooks/fixtures/gapprobe/_acceptance/ now counts as 'the PR carries _acceptance/<slug>/ artifacts' and suppresses both the T3-paths-without-gate and non-T1-without-gate violations. The same unanchored pattern at pre-merge-check.sh:130 makes those paths invisible to stale_files. Compounding it, the generated stderr captures (tests/hooks/fixtures/gapprobe/_acceptance/t6*.err) are committed and rewritten by every `gp_run` invocation, so running the suite dirties tracked files in exactly the tree pre-merge accounting skips. A stale duplicate fixture tree also remains at tests/hooks/fixtures/gapprobe/t62..t64/ from before the move.

## Chưa adversarial-verify (refuter chết)

none — cả 8 finding ở trên đều đã qua adversarial-verify thành công (không có
finding nào trong input gắn `unverified: true`).

## Review process notes

Danh sách "Review incomplete (finder chết)" nhận từ upstream rỗng — không có
cảnh báo finder-chết nào cần ghi ở đây; review pass coi như đã chạy trọn cho
cả hai lens (`conventions`, `bugs`). Không có lệnh fail nào không gắn được
vào eval (danh sách đầu vào tương ứng cũng rỗng).

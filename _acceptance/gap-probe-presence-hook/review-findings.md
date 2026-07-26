# Review Findings: gap-probe-presence-hook (round 2)

Informational — nằm NGOÀI phạm vi acceptance-evidence-gate hook (hook chỉ đọc
`evidence-report.md`/`contract.md`). File này liệt kê các finding đã qua
**adversarial-verify** (refuter đã chạy và xác nhận, không chỉ heuristic một
lượt) trên diff của feature `gap-probe-presence-hook`, dùng để nạp cho
`evidence-page.js` (bảng "Review findings") và cho human đọc tại Gate 2.

Đây là round 2 — GHI ĐÈ danh sách round 1 (8 finding, đã sửa hết tại git
commit `a2947d5` "fix(s3-r2): sửa cả 8 finding của S4 round 1" trước khi
round này bắt đầu; lịch sử round 1 xem tại commit đó và section `## Iterations`
của `evidence-report.md`). Round 2 chạy adversarial-verify LẠI trên diff đã
sửa (bao gồm cả template `gap_probe_expected: true` mà round 1 mới thêm vào
để hết code-chết) và tìm ra 9 finding MỚI dưới đây — không finding nào trong
9 cái này trùng với 8 finding round 1.

9/9 finding dưới đây đều đã adversarial-verify thành công (không có finding
nào gắn `unverified: true`). Sắp xếp severity giảm dần theo đúng thứ tự nhận
từ review pass; một cặp finding trùng vị trí (`skills/acceptance/references/contract-template.md:42`,
mục 1 và 2) và một cặp trùng vị trí khác (`hooks/acceptance-evidence-gate.js:148`,
mục 6 và 7) đến từ hai lens review khác nhau (`conventions` vs `bugs`) và
được giữ NGUYÊN VẸN như hai finding riêng biệt — không gộp, không viết lại —
vì mỗi finding nêu một khía cạnh/severity riêng của cùng một vị trí code.

## High severity (2)

### 1. Template ships `gap_probe_expected: true` to standalone `/acceptance` runs, which have no gap-probe step — every T3 Gate-1 approve hard-blocks

- title: Template ships `gap_probe_expected: true` to standalone `/acceptance` runs, which have no gap-probe step — every T3 Gate-1 approve hard-blocks
  file: /Users/manhphan/dev/acceptance-gate-kit/skills/acceptance/references/contract-template.md
  line: 42
  severity: high
  source: conventions
  detail: The diff adds `gap_probe_expected: true` to the contract template frontmatter (line 42) plus prose telling the author to "Emit it on every new contract" (lines 21-26). That template is the contract producer for the standalone acceptance-gate flow (`skills/acceptance/SKILL.md` Phase 1 step 1: "Read references/contract-template.md. Create _acceptance/{slug}/contract.md from it"), and that flow has NO step that produces `gap-probe.md` — gap-probe (S1#7) exists only in feature-loop. Result: a standalone T3 contract now carries the marker, and the approve skill's write (`codex/acceptance-gate/skills/approve/SKILL.md:53` — "Patch the contract frontmatter: status: approved, approved_by…") is hard-blocked. Reproduced against the shipped hook with exactly the template's shape (risk_tier: T3, gap_probe_expected: true, status: approved, approved_by set, no gap-probe.md, no decisions.jsonl): exit 2, message "contract T3 không được duyệt khi chưa qua phản biện context sạch. Chạy bước S1#7…" — a step name that does not exist in the standalone workflow. Removing the marker line from the same payload flips it to exit 0. This also contradicts two user-facing docs the diff left untouched: README.md:320 ("standalone acceptance-gate runs have no gap-probe: lint + human only") and QUICKSTART.md:114-116 ("…hoặc dùng `/acceptance` thuần thay vì feature-loop): không chặn gì cả") — the same docs-drift class the team already fixed for GUIDE/README in review-findings.md #3, but missed on the standalone path. Mirror carries it identically: plugins/acceptance-gate/skills/acceptance/references/contract-template.md:42.

### 2. Standalone /acceptance flow: every T3 contract is now hard-blocked at Gate 1 with no in-workflow remedy

- title: Standalone /acceptance flow: every T3 contract is now hard-blocked at Gate 1 with no in-workflow remedy
  file: /Users/manhphan/dev/acceptance-gate-kit/skills/acceptance/references/contract-template.md
  line: 42
  severity: high
  source: bugs
  detail: The round-2 fix for "blocking branch is dead code" added a literal `gap_probe_expected: true` to the contract template frontmatter (line 42, mirrored at plugins/acceptance-gate/skills/acceptance/references/contract-template.md:42). That template is read by BOTH workflows: skills/acceptance/SKILL.md:88 step 1 ("Read references/contract-template.md. Create _acceptance/{slug}/contract.md from it") and feature-loop. But the producer of gap-probe.md exists ONLY in feature-loop S1#7 — grep confirms skills/acceptance/SKILL.md has no gap-probe generation step at all (it mentions gap-probe only as a cross-check consumer at :98 and :286). Consequence: a user running the plugin's documented standalone path (/acceptance for a T3 feature, then /approve) produces a contract with risk_tier: T3 + gap_probe_expected: true and no gap-probe.md, and lib/evidence-core.js:484 hard-blocks the approval write. Verified empirically: a T3 contract with the exact template frontmatter, written draft -> approved with approved_by filled, exits 2: `x gap-probe.md thiếu ... contract T3 không được duyệt khi chưa qua phản biện context sạch. Chạy bước S1#7 (phản biện context sạch) để sinh gap-probe.md, HOẶC ghi vào decisions.jsonl một entry {"type":"descope",...}`. The suggested remedy ("bước S1#7") is a feature-loop-only step. The only escapes for a standalone user are hand-writing a Vietnamese-prefixed descope line into decisions.jsonl (a file the standalone flow does not create), deleting the marker the template just told them to emit, or ACCEPTANCE_GATE_BYPASS=1. No test covers this because tests/hooks/run-tests.sh builds its own fixtures via mk_gp and never exercises the template->approve path. Fix shape: either emit `gap_probe_expected: true` from the feature-loop S1 step only (not from the shared template), or gate the block on the presence of a gap-probe producer in the workspace.

## Medium severity (5)

### 3. The only hard-block condition is read from the artifact under judgment — dropping `gap_probe_expected` in the advancing write disarms the block with no audit trail

- title: The only hard-block condition is read from the artifact under judgment — dropping `gap_probe_expected` in the advancing write disarms the block with no audit trail
  file: /Users/manhphan/dev/acceptance-gate-kit/lib/evidence-core.js
  line: 482
  severity: medium
  source: conventions
  detail: `const expected = /^(true|yes|1)$/i.test(frontmatterField(newPayload, 'gap_probe_expected') || '')` reads the marker from the POST-write payload only, even though `oldPayload` is in scope (it is already used at line 439/445 by the sibling Gate-1 rule). Verified empirically: a T3 contract on disk at `status: draft` WITH `gap_probe_expected: true`, advanced by a Write to `status: approved` — (a) payload keeping the marker → exit 2; (b) byte-identical payload with the marker line deleted → exit 0 plus a NOTE that actively reassures "(workspace không khai gap_probe_expected — chỉ nhắc, không chặn.)". So the guard's teeth are removable by the same agent write they are supposed to constrain, and nothing records that a marker existed and vanished. That breaks the kit's established escape-hatch pattern, where every opt-out leaves a trace: `gate1_skipped: true` is explicit and pre-merge NOTEs it (scripts/pre-merge-check.sh:181), the gap-probe descope needs a ledger entry (feature-loop SKILL.md: "CẤM bỏ không dấu vết"). Comparing the marker against `oldPayload` (or NOTEing its removal) closes it. Mirrored at plugins/acceptance-gate/lib/evidence-core.js:482.

### 4. New contract rule has no merge-boundary backstop — unlike every other rule in the kit it exists only in the write-time hook

- title: New contract rule has no merge-boundary backstop — unlike every other rule in the kit it exists only in the write-time hook
  file: /Users/manhphan/dev/acceptance-gate-kit/scripts/pre-merge-check.sh
  line: 176
  severity: medium
  source: conventions
  detail: The kit's stated architecture is write-time hook + merge-boundary re-check: lib/evidence-core.js:5-10 ("Two callers share this so they cannot drift… scripts/recheck-evidence.js — CI, re-validates the COMMITTED report… the backstop for a report written under ACCEPTANCE_GATE_BYPASS"), the Gate-1 approval rule is re-implemented in bash at pre-merge-check.sh:176-186, and the cross-layer teeth carry the comment "Write-time stays advisory (lint W4); this is the merge-boundary backstop for every runtime". The gap-probe rule ships with neither: `grep -n gap scripts/pre-merge-check.sh` returns nothing, `grep -n contract scripts/recheck-evidence.js` returns nothing, and `evaluateContractWrite` is called only from the two hook copies. So a T3 contract advanced under ACCEPTANCE_GATE_BYPASS=1, by a runtime whose PreToolUse hook is not installed, or by a plain `git`/editor write merges with zero signal anywhere — exactly the hole review-findings.md #6 named ("There is no second layer to catch it"), which the round-2 fix addressed only inside the hook.

### 5. NOTE channel ignores consumer `enforcement: off` — it is written before the config is read

- title: NOTE channel ignores consumer `enforcement: off` — it is written before the config is read
  file: /Users/manhphan/dev/acceptance-gate-kit/hooks/acceptance-evidence-gate.js
  line: 148
  severity: medium
  source: conventions
  detail: The notes are flushed to stderr at lines 148-152, before `readEnforcement(fileDir)` is called at line 157, so the consumer's enforcement level never gates them. Verified: a workspace with `_acceptance/config.yaml` containing `enforcement: off` and a T2 contract advancing to approved still prints "NOTE from acceptance-evidence-gate (Gate-1 contract guard) - Chưa có phản biện context sạch…". Every other output path in this hook honours the setting (contract block at line 158, evidence path at line 197, and the Codex adapter's handleDelete at codex/acceptance-gate/hooks/acceptance-evidence-gate-codex.js:133 all return early on `off`), and pre-merge-check.sh treats `enforcement_mode=off` as "gate did nothing at write time". Effect is noise rather than a false gate, but it makes this the one hook output a consumer cannot turn off. Mirrored at plugins/acceptance-gate/hooks/acceptance-evidence-gate.js:148.

### 6. Gap-probe guard is bypassed permanently by any risk_tier escalation after the Gate-1 crossing

- title: Gap-probe guard is bypassed permanently by any risk_tier escalation after the Gate-1 crossing
  file: /Users/manhphan/dev/acceptance-gate-kit/lib/evidence-core.js
  line: 464
  severity: medium
  source: bugs
  detail: The guard condition is `ADVANCED.test(status) && !ADVANCED.test(oldStatus || '') && (tier === 'T2' || tier === 'T3')`, and `tier` is read from the NEW payload at that single moment. Once a contract is at any ADVANCED status the guard never runs again, so a contract that crosses Gate 1 while risk_tier is T1/absent (or while gap_probe_expected is absent) and is escalated afterwards is never re-evaluated. Verified empirically: contract on disk at `risk_tier: T1, status: approved`; write changing only `risk_tier: T1` -> `T3` (gap_probe_expected: true present, no gap-probe.md, no descope entry) -> exit 0 with an empty stderr — no block, no NOTE. There is no second layer: `evaluateContractWrite` is called only from the two hook copies, and `grep -n 'gap-probe\|gap_probe' scripts/pre-merge-check.sh` returns nothing, so CI does not re-check gap-probe presence either. Tier escalation after Gate 1 is a real path in this repo — decisions.jsonl entry d-20260726T090100Z-105 records exactly such a bump ("risk_tier T2 lên T3"). The trade-off (transition-keyed vs state-keyed) was deliberate to fix F2/F6 of round 1, but the escalation hole it opens is unguarded and silent.

### 7. NOTE channel writes to stderr with exit 0 — the exit code whose stderr is not fed back to the agent

- title: NOTE channel writes to stderr with exit 0 — the exit code whose stderr is not fed back to the agent
  file: /Users/manhphan/dev/acceptance-gate-kit/hooks/acceptance-evidence-gate.js
  line: 148
  severity: medium
  source: bugs
  detail: The new NOTE channel does `process.stderr.write(...)` and then always falls through to `process.exit(0)` (line 155 on the pass path, or the block/warn paths below). In the Claude Code hook contract, exit 0 surfaces only stdout, and only in transcript mode; stderr is fed back to Claude exclusively on exit 2, and shown to the user only on other non-zero exits. So the NOTE — whose entire purpose is to tell the acting agent "Chạy bước S1#7 ... HOẶC ghi vào decisions.jsonl một entry descope" — reaches neither the agent nor the user in a normal session. This matters because NOTE is the ONLY signal for three of the feature's acceptance cases: T2 missing gap-probe (AC-3), legacy workspaces without the marker (AC-7), and verdict probe-failed (AC-5). All three are therefore no-ops in production; the evidence file _acceptance/gap-probe-presence-hook/evidence/hook-messages.txt shows the text only because the test harness captures stderr with `2>file`. The pre-existing `enforcement: warn` path has the same shape (stderr + exit 0), so this is a convention the diff inherits rather than invents — but the diff makes the whole "nhắc, không chặn" half of the feature depend on it. Fix shape: exit 1 for advisory output (stderr is shown, execution continues), or emit the note on stdout as PreToolUse JSON with a `hookSpecificOutput` field.

## Low severity (2)

### 8. feature-loop S1 instruction garbled: the inserted marker clause swallows `status: draft` from the frontmatter list

- title: feature-loop S1 instruction garbled: the inserted marker clause swallows `status: draft` from the frontmatter list
  file: /Users/manhphan/dev/acceptance-gate-kit/feature-loop/skills/feature-loop/SKILL.md
  line: 82
  severity: low
  source: conventions
  detail: The line now reads "…frontmatter schema_version/feature/slug/risk_tier/surfaces/`gap_probe_expected: true` — marker BẮT BUỘC, nó là thứ cho hook quyền chặn T3 thiếu gap-probe; vắng marker hook chỉ NOTE/status: draft; 5-15 AC…": the parenthetical was spliced into the middle of the slash-separated field list, so the `status: draft` requirement now hangs off "hook chỉ NOTE" and reads as part of the marker caveat rather than as a frontmatter field the skill must set. The codex twin got the clean treatment for the same change (codex/feature-loop-codex/skills/feature-loop-codex/SKILL.md:235 keeps the caveat in its own parenthetical and leaves the field list intact), so the two runtimes' S1 instructions now differ in legibility for a step whose output the hook hard-blocks on.

### 9. Kit's own T3 contract does not carry the marker the diff makes mandatory (hard-block path exercised only by fixtures)

- title: Kit's own T3 contract does not carry the marker the diff makes mandatory (hard-block path exercised only by fixtures)
  file: /Users/manhphan/dev/acceptance-gate-kit/_acceptance/gap-probe-presence-hook/contract.md
  line: 5
  severity: low
  source: conventions
  detail: `_acceptance/gap-probe-presence-hook/contract.md` is `risk_tier: T3`, was advanced to `status: implemented` inside this diff, and has a tracked `gap-probe.md` — but its frontmatter has no `gap_probe_expected: true`, so the kit's own dogfooded workspace sits in the legacy NOTE-only lane while the template it just shipped says "Emit it on every new contract". Consequence: no live contract in the repo exercises the blocking branch — it is covered only by the hand-written fixtures in tests/hooks/run-tests.sh (mk_gp), which is the same shape as review-findings.md #1 ("AC-2 is green solely because the test fixture hand-writes gap_probe_expected: true"). Adding the marker here is safe (gap-probe.md exists, verdict readable) and would make the repo's own artifacts match the convention it now asks consumers to follow.

## Chưa adversarial-verify (refuter chết)

none — cả 9 finding ở trên đều đã qua adversarial-verify thành công (không có
finding nào trong input gắn `unverified: true`).

## Review process notes

Danh sách "Review incomplete (finder chết)" nhận từ upstream rỗng — không có
cảnh báo finder-chết nào cần ghi ở đây; review pass coi như đã chạy trọn cho
cả hai lens (`conventions`, `bugs`). Không có lệnh fail nào không gắn được
vào eval (danh sách đầu vào tương ứng cũng rỗng). Không có finding nào từ
round này bị đánh dấu `blocked` hay `failed_evals` — verdict tổng thể vẫn
`PENDING-JUDGMENT` thuần vì T3 chờ `human_override` trực tiếp ở E6, không
phải vì 9 finding trên chặn machine eval nào.

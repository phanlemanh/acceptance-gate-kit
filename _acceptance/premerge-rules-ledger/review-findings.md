## Trong hợp đồng

(none)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

(none)

## Chưa phân loại (triage-failed)

phân loại phạm vi không chạy được — không lỗi nào bị máy tự sửa, người xem lại toàn bộ

- **Feature touches t3_paths (lib/**) but contract stayed risk_tier T2 — Gate 1.5 and the T3 judgment rule were skipped**
  file: `_acceptance/s4-scope-triage/contract.md:5`
  severity: high
  source: conventions
  detail: `_acceptance/config.yaml` declares `risk_tiers.t3_paths: [hooks/**, lib/**, scripts/pre-merge-check.sh, scripts/recheck-evidence.js]`, and `feature-loop/skills/feature-loop/SKILL.md:70` states the derivation rule verbatim: "Match bất kỳ `risk_tiers.t3_paths` → **T3**", with step 4 adding "Nếu giữa chừng phát hiện tier sai … → nâng tier, quay lại stage thiếu". This feature added a brand-new file `lib/out-of-contract.js` (introduced mid-flight at round 2, commit 3a31688 — not in the design doc, which pins `**Tier:** T2`, nor in the plan). `lib/**` matches `t3_paths`, so the tier should have been escalated to T3. The contract was never re-tiered and was signed off as T2. Two concrete consequences: (1) Gate 1.5 (plan review stop, T3-only) never happened; (2) the judgment item shipped without the T3-mandatory human check — GUIDE.md:220/:771 and the report's own checklist require personally verifying ALL judgment items on T3, but E11 in `_acceptance/s4-scope-triage/evidence-report.md:155` has a bare `human_override:` with no value, and the round passed on the 3/3 AI panel proposal alone. Nothing catches this automatically: `scripts/pre-merge-check.sh:766` only fires when t3_paths change with *no* `_acceptance/` artifacts at all — a T2 contract that touches `lib/**` passes the backstop clean. Failure scenario: a parse bug in `lib/out-of-contract.js` silently drops the out-of-contract block; the only human gate that could have caught it (T3 mandatory judgment review of the rendered card) was never triggered because the feature self-classified T2.

- **AC-8's Codex arm is unmeasured — the whole new codex acceptance-card instruction block can be deleted with every eval still green**
  file: `_acceptance/s4-scope-triage/evals.yaml:51`
  severity: medium
  source: conventions
  detail: AC-8 requires the backward branch in both card instructions (`commands/acceptance-card.md` and the codex version). Evals E8 and E12 both declare `codex/acceptance-gate/skills/acceptance-card/SKILL.md` in their `paths`, but no test case reads that file for anything this feature added — the only assertion against it is a pre-existing `assert "gap_probe" in …` at `tests/plugins/run-tests.sh:416`. P52 extracts the three choice labels from `$ROOT/commands/acceptance-card.md` only; P54/P56 target a different file (`feature-loop-codex/SKILL.md`). The 19 new lines in the codex card SKILL are pure prose that nothing measures — the exact shape CLAUDE.md names as invariant #5 ("Thước phải gắn vào vật được giao"), here worse because the measurement doesn't even touch the instruction. It also poisons carry-forward: P1 uses `paths` to decide staleness, so editing that codex file re-runs E8/E12 and they report green having never looked at it. Failure scenario: someone reverts or rewrites the "Gate 2 'Ngoài hợp đồng' block" section in the codex SKILL — including the mandatory backward branch — and the full suite plus every eval for AC-8 stays green.

- **Removing the scribe agent moved a machine-enforced write ordering into main-loop prose, and left runLogWriteFailed as a permanently-true misnomer**
  file: `feature-loop/workflows/acceptance-verify.js:676`
  severity: medium
  source: bugs
  detail: Before this diff the workflow guaranteed the ordering hook L2 depends on: the scribe appended `run-log.jsonl` before synthesize wrote `evidence-report.md`. After this diff the workflow writes nothing — it returns `report`/`findings` as strings, and the ordering constraint exists only as prose in SKILL.md:141. No test can assert ordering because the writer is now the main-loop LLM, outside the harness. Compounding this, line 676 is now `const runLogWriteFailed = runLogLines.length > 0` — the field name asserts a failure that never occurred and is `true` on every normal run with evals, yet is still returned in the result (line 723) as the flag a consuming main loop keys off. Failure scenario: a resumed session (or a Codex-side reimplementation) writes `evidence-report.md` before appending the run-log; hook L2 finds run_ids absent from the log and BLOCKS a legitimately-passing round; the operator sees `runLogWriteFailed: true`, concludes the run-log write genuinely failed, and re-runs S4 instead of fixing the write order.

- **Scribe removal meets all three ADR conditions but is documented only in a code comment**
  file: `feature-loop/workflows/acceptance-verify.js:668`
  severity: medium
  source: conventions
  detail: CLAUDE.md requires an ADR when a decision is hard to reverse, surprising, AND has a real trade-off. Dropping the scribe agent — and with it the workflow's ability to write any file — satisfies all three: hard to reverse (external, permanent cause per the comment: "bị safety layer chặn lặp lại (4 lần, phiên 2026-07-27→28)"); surprising (the comment spends four lines explaining why an agent copying machine-computed audit lines reads as record forgery); real trade-off (the ordering guarantee moved from machine to prose, and the user-delegation authorizing this lives nowhere but the comment). No file was added under `docs/adr/`. Failure scenario: a later contributor "fixes" the unreliable-writer problem by reintroducing a file-writing agent, and rediscovers the safety-layer block by burning another round, because the only record of the prior attempt is a comment inside the function they are replacing.

- **Choice-label drift: feature-loop SKILL says "mở contract mới" while the renderer and the pinned source say "mở hợp đồng mới"**
  file: `feature-loop/skills/feature-loop/SKILL.md:153`
  severity: low
  source: conventions
  detail: The three Gate-2 choice labels are meant to be verbatim across the renderer and both card instructions. `scripts/gate-card.js` emits "mở hợp đồng mới"; `commands/acceptance-card.md` and the codex card SKILL agree. P52 pins the renderer against exactly `commands/acceptance-card.md`. The new block at SKILL.md:153 instead says "(b) mở contract mới" — P52's extraction never reads this file, so the drift is invisible to the suite. Failure scenario: the main loop follows its own SKILL when narrating the Gate-2 package and offers the human "mở contract mới" while the rendered card button beside it reads "mở hợp đồng mới" — two differently-named options for one choice on the same screen.

- **Out-of-contract block disappears from the Gate 2 card with no error when the writer's item shape drifts**
  file: `scripts/gate-card.js:340`
  severity: high
  source: bugs
  detail: `lib/out-of-contract.js:parse()` reports section presence (`present`) and item list (`findings`) independently, and `gate-card.js` only branches on `ooc.findings.length`. When the heading exists but `parseFindings` matches zero bullets (e.g. one trailing token after `- **title**`, per the regex at lib/out-of-contract.js:27), the result is `{present:true, findings:[], ...}` and the renderer emits nothing — no block, no amber flag, no stderr. The card renders as if the round had zero out-of-contract findings and the human signs off on a PASS chip. P55 only round-trips the pristine template, so it cannot catch drift. Applies identically to the mirror at `plugins/acceptance-gate/scripts/gate-card.js` and `plugins/acceptance-gate/lib/out-of-contract.js`. Failure scenario: a synthesizer writes one malformed bullet in the "Ngoài hợp đồng" section and the mandatory backward branch silently vanishes from what the human reviews.

- **Unguarded `prov.enforcement_mode` deref kills the whole S4 round when the provenance agent returns null**
  file: `feature-loop/workflows/acceptance-verify.js:694`
  severity: medium
  source: bugs
  detail: `const prov = await agentT(...)` (line 672) has no null guard and no `.catch`. Every other agent result in this file is treated as possibly-null, and even `prov` itself is guarded three lines below via `String((prov && prov.verified_commit) || '')` — but the synthesize prompt interpolates `${prov.enforcement_mode}` and `${prov.bypass_used}` bare. If the provenance agent dies or is skipped, `prov === null` throws a TypeError out of the workflow after all machine/ui/judge/review/baseline/triage agents have already run — the whole round's work is lost, since `result.runLog` and `result.report` never reach the caller and the main loop sees a crash rather than a BLOCKED verdict.

- **"Mọi verdict" instruction unconditionally writes result.report / result.findings, which are empty strings when the synthesizer dies**
  file: `feature-loop/skills/feature-loop/SKILL.md:135`
  severity: medium
  source: bugs
  detail: This diff moved file writing from the synthesize agent into the main loop; the workflow returns `report: (report && report.report) || ''` — a dead synthesizer yields empty strings with no failure flag. SKILL.md line 135 instructs, for every verdict, to Write evidence-report.md/review-findings.md from these fields unconditionally. On BLOCKED or REJECT with a dead synthesizer this blanks the previous round's evidence-report.md and review-findings.md — destroying Iterations history and the findings list, and gate-card.js then reads an empty report. The PASS/PENDING-JUDGMENT bullet does guard for emptiness; the authoritative "Mọi verdict" bullet does not, so the instructions contradict each other.

- **Gate 2 packaging step still reads removed result keys reportPath / findingsPath**
  file: `feature-loop/skills/feature-loop/SKILL.md:151`
  severity: medium
  source: bugs
  detail: Commits c971a52/1efcbe7 replaced REPORT_SCHEMA's `{reportPath, findingsPath}` with `{report, findings}` (content strings); the return object no longer contains either key. SKILL.md line 151 — the default Gate 2 card step — still tells the main loop to build the text package from "reportPath" and "findingsPath". GUIDE.md:250 likewise still documents a scribe agent that no longer exists. An operator or agent following the instruction dereferences keys that are now undefined, on the path that assembles the human's Gate 2 package.

- **Findings are deduped for the cluster count but not for the human-facing list**
  file: `feature-loop/workflows/acceptance-verify.js:699`
  severity: low
  source: bugs
  detail: `triagedDistinct = dedupe(triaged)` exists specifically because two reviewer lanes routinely report the same defect and it should not double as a "cluster". But `triagedDistinct` feeds only `outsideCoverage`/`coverageCluster`; the synthesize prompt that generates review-findings.md uses the raw, non-deduped `triaged` for all three bins, and `rejectFindings` is likewise non-deduped. A defect found by both lanes is counted once toward the coverage-cluster threshold but printed twice under "Ngoài hợp đồng" on the Gate 2 card, and queued twice in the S3 fix list.

⚠ Cụm ngoài vùng phủ: 10/10 lỗi rơi vào file không bộ đo nào phủ (_acceptance/s4-scope-triage/contract.md, _acceptance/s4-scope-triage/evals.yaml, feature-loop/workflows/acceptance-verify.js, feature-loop/skills/feature-loop/SKILL.md, scripts/gate-card.js) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
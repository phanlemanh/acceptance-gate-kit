# Review Findings: gap-probe-presence-hook (round 11)

## Trong hợp đồng

(không có finding nào trong phạm vi hợp đồng round này)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

(không có finding nào phân loại được vào mục này round này — xem `## Chưa phân loại` bên dưới: bước phân loại phạm vi tự nó hỏng round này)

## Chưa phân loại (triage-failed)

phân loại phạm vi không chạy được — không lỗi nào bị máy tự sửa, người xem lại toàn bộ.

**Gate 2 card says "máy đã xong — ký nhanh" while out-of-contract decisions are pending**
- file: `scripts/gate-card.js:354`
- severity: high
- source: conventions

The new out-of-contract block renders its own `div.item` rows with three buttons (lines 340-353) but is invisible to the two things that tell the human how much work is left: `chip` (line 329) is derived from `verdict` alone, and `yourCount` (line 354) is `decisions.length + (oos.length ? 1 : 0)` — it never adds `ooc.findings.length`. Reproduced: a workspace with `verdict: PASS`, no judgment decisions and one out-of-contract finding renders `chip teal">máy đã xong — ký nhanh` above a block headed `Ngoài hợp đồng — bạn quyết (1)`, and the "Việc chỉ mình bạn quyết được — N việc" label is absent entirely. The card's own comment says this block exists precisely because "nếu người duyệt bỏ qua thì không ai bắt lại" — yet the card's headline signal actively tells the reviewer there is nothing to decide. Same block is also skipped entirely on the non-approvable branch (`process.exit(0)` at line 325) — defensible for REJECT/BLOCKED, but worth a deliberate decision rather than an accident of ordering.

**A drifted out-of-contract item shape makes the whole block vanish with no flag and exit 0**
- file: `scripts/gate-card.js:340`
- severity: medium
- source: conventions

`lib/out-of-contract.js:72` computes `present` (heading found) separately from `findings` (items parsed), exactly so a reader can tell "no findings" from "findings I could not parse". The renderer never uses it: line 337 branches on `ooc.unclassified`, line 340 on `ooc.findings.length`, and `ooc.present` appears only in the `--extract` JSON. So if the synthesizer drifts one character off OOC-ITEM-TEMPLATE (drops the `**`, changes the indent, translates `Người dùng thấy gì`), `parse` returns `{present: true, findings: []}`, the block silently disappears from the deciding surface, and gate-card exits 0 with no warning — the identical failure mode the template markers and P55 were added to prevent, just moved one layer down. A `present && !findings.length` amber flag ("khối có mặt trong file nhưng không đọc được mục nào") is the one-line fail-loud.

**Partial triage still publishes a "## Trong hợp đồng" section for findings nobody will fix**
- file: `feature-loop/workflows/acceptance-verify.js:539`
- severity: medium
- source: conventions

`triaged` is materialised at line 520 with `inContract: true` for every item the agent did classify; only afterwards (line 539) does a missing item flip `triageFailed = true`, which zeroes `rejectFindings` and blocks the REJECT vote. But the synthesize prompt at line 699 still fills the report's `## Trong hợp đồng` section from `triaged.filter(f => f.inContract)`. Net effect on a partial-triage round: review-findings.md tells the human some findings are in-contract (with AC refs) while nothing put them in a fix list, no verdict escalated on them, and the adjacent `## Chưa phân loại` block says the classification cannot be trusted. Fail-toward-human should be total — either demote every bin to unclassified when the classification is incomplete, or label the surviving in-contract items as provisional in the report.

**`runLogWriteFailed` now asserts a failure that never happens and is true on every normal run**
- file: `feature-loop/workflows/acceptance-verify.js:676`
- severity: medium
- source: conventions

With the scribe gone the flag became `const runLogWriteFailed = runLogLines.length > 0` — i.e. permanently true whenever the round has any eval — yet it is still returned in the result (line 723) under a name that reads as "appending the run-log failed". The old contract was `runLogLines.length > 0 && !(scribe && scribe.written)`. SKILL.md line 135 now tells the main loop to append unconditionally, so nothing consumes the flag as a condition any more. An operator (or a resumed session, or the Codex arm) that sees `runLogWriteFailed: true` on a green round will conclude the log write broke and re-run S4. Either drop the field or rename it to what it now means (`runLogPendingWrite`).

**Doc-truth drift shipped with the refactor: SKILL.md and GUIDE.md still name removed result keys and the removed scribe agent**
- file: `feature-loop/skills/feature-loop/SKILL.md:151`
- severity: medium
- source: conventions

`REPORT_SCHEMA` went from `{reportPath, findingsPath}` to `{report, findings}` and the return block (lines 724-725) carries only the content strings — but SKILL.md line 151, the default Gate-2 packaging step, still says "bảng per-eval (đọc từ `reportPath` = evidence-report.md) ... review findings (đọc từ `findingsPath` = review-findings.md)". Same class in GUIDE.md: line 246 draws "scribe APPEND run-log.jsonl", line 250 returns "reportPath + runLog (+ cảnh báo nếu scribe fail)", line 821 routes a `scribe` role, line 858 advises "nếu scribe fail" — and GUIDE.md is rsynced into the mirror by scripts/sync-plugin-packages.sh:47-49, so the wrong documentation ships inside the acceptance-gate package. This is on the Gate-2 path where the human's package is assembled. (Already carried as a signed known-limit in `_acceptance/s4-scope-triage/review-findings.md` — flagging it as debt sitting on a live path, not as a new discovery.)

**`feature_loop.models` role list drifted from MODEL_ROUTES: `triage` undocumented everywhere, `scribe` still advertised in acceptance-init**
- file: `feature-loop/skills/feature-loop/SKILL.md:124`
- severity: medium
- source: conventions

MODEL_ROUTES gained `triage: 'sonnet'` (acceptance-verify.js:206) and lost `scribe`. SKILL.md:124 was edited to drop `scribe` but never added `triage`, so the one role a repo would most plausibly want to re-route (a whole extra sonnet pass per round) is discoverable only by reading the workflow source. `commands/acceptance-init.md:78`, the template that seeds a consuming repo's config.yaml, still enumerates `machine/ui/judge/finder/refute/baseline/provenance/scribe/synthesize` — advertising a role that `sanitizeModels` now silently discards. GUIDE.md:355 and its mirror copy carry the same stale list.

**Choice-label drift between the feature-loop SKILL and the renderer the human actually sees**
- file: `feature-loop/skills/feature-loop/SKILL.md:153`
- severity: medium
- source: conventions

The new Gate-2 paragraph names option (b) "**mở contract mới**", while scripts/gate-card.js:351 renders the button as `mở hợp đồng mới` and both card instruction files (commands/acceptance-card.md, codex/.../acceptance-card/SKILL.md) pin `mở hợp đồng mới` verbatim. P52 extracts the three labels from commands/acceptance-card.md and asserts the renderer matches, so this particular file is the one copy outside the pin — the drift cannot be caught by any test. Three labels are supposed to be verbatim precisely so the human's spoken choice maps onto the button; two names for one option defeats that.

**`meta.phases` no longer describes the workflow's phases — 'Triage' is used but undeclared**
- file: `feature-loop/workflows/acceptance-verify.js:5`
- severity: low
- source: conventions

`phase('Triage')` (line 473) and `{ phase: 'Triage' }` on the triage agent introduce a fifth phase, but `meta.phases` still lists only Machine / Judge / Review / Synthesize. The established pattern in the sibling workflow is 1:1 — execute-parallel.js declares exactly the `Execute` phase it announces. Consequence is metadata/progress-display only (the real harness tolerates it, since round 6 ran), but the declared phase list is now wrong for the most expensive new step in S4.

**Out-of-contract block vanishes silently on any writer-shape drift (no flag, exit 0)**
- file: `lib/out-of-contract.js:27`
- severity: high
- source: bugs

`parseFindings` only accepts items whose first line matches `/^-\s+\*\*(.+?)\*\*\s*$/`. Any drift by the LLM writer — `*` instead of `-`, a trailing period after `**`, a 4-space indent, a `###` heading level — yields `present: true, findings: []`. `scripts/gate-card.js:340` renders the block only on `ooc.findings.length`, and never consults `ooc.present`, so nothing is emitted and no flag is raised. Reproduced: with a review-findings.md whose single out-of-contract item uses `* **title**` instead of `- **title**` (everything else byte-identical to the fixture), `node scripts/gate-card.js --root ws --slug demo` exits 0, the string `Ngoài hợp đồng — bạn quyết` appears 0 times, and no amber flag is added — the card shows a clean teal PASS while a real `severity: high` defect awaits a human decision. This defeats the whole feature: the block is the only place the human is told the machine deliberately did not fix something. Fix: when `present` is true but the section produced 0 parsed items (or when the section contains `- **` lines that failed the kv extraction), render a hard flag, the way `lib/gap-probe.js` surfaces `parse_dropped`. (This class is already recorded as an out-of-contract finding at `_acceptance/s4-scope-triage/review-findings.md`, deferred to `new-contract` — it is still live in HEAD.)

**'Mọi verdict' step writes result.report / result.findings unconditionally — blanks the previous round's evidence when those fields are absent**
- file: `feature-loop/skills/feature-loop/SKILL.md:135`
- severity: high
- source: bugs

The workflow no longer writes any file; SKILL.md:135 now instructs the main loop, for EVERY verdict, to `Write evidence-report.md = result.report` and `review-findings.md = result.findings`. But two code paths return before synthesize ever runs and therefore omit both fields entirely: `feature-loop/workflows/acceptance-verify.js:55` (`args.evals`/`args.suiteCommands` not arrays) and `:300` (nothing fresh to verify → BLOCKED). A third path yields empty strings: `:718-719` does `(report && report.report) || ''`, so a dead synthesize agent returns `report: ''`. Failure scenario: round 2 comes back BLOCKED from `:300` (all evals carried, `suite_keys` empty); the main loop follows the 'Mọi verdict' instruction literally and writes `undefined`/`''` over `_acceptance/<slug>/evidence-report.md` — destroying the round-1 PASS evidence, its run_ids and its `## Iterations` history, which is also how `round` is computed next time. Previously the workflow itself owned the write, so a BLOCKED round physically could not blank the artifact. Fix: make the write conditional on `typeof result.report === 'string' && result.report.trim()`, and say so in the instruction rather than in the REJECT bullet only (:132 mentions 'nếu có nội dung', :135 does not).

**Unguarded prov.enforcement_mode / prov.bypass_used deref crashes the whole S4 round after every agent has already run**
- file: `feature-loop/workflows/acceptance-verify.js:694`
- severity: high
- source: bugs

`const prov = await agentT(...)` (line 671) can resolve to `null` — the harness models a dead agent exactly that way (see `'refute:': null` in tests/workflows/acceptance-verify.test.mjs, WT-T6, which the workflow handles as a dead refuter). Line 680 correctly guards it: `String((prov && prov.verified_commit) || '')`. Line 694 does not: the synthesize prompt interpolates `${prov.enforcement_mode}` and `${prov.bypass_used}` directly. Failure scenario: the provenance capture agent dies; the workflow throws `TypeError: Cannot read properties of null (reading 'enforcement_mode')` at the very last step, after all machine/ui/judge/reviewer/refuter/baseline/triage agents have run — the whole round's work (and its cost) is lost, no report, no run-log lines returned, and the main loop sees a crash rather than a BLOCKED verdict with a reason. Note the diff rewrote this exact line (moving the write out of the agent) without adding the guard the neighbouring line has. Fix: `const P = prov || {}` with `enforcement_mode` defaulting to `strict`, or return BLOCKED with reason 'provenance capture died' when `prov` is falsy.

**Partial triage leaves inContract:true — review-findings.md publishes a '## Trong hợp đồng' section for findings never fixed and never REJECTed**
- file: `feature-loop/workflows/acceptance-verify.js:539`
- severity: medium
- source: bugs

`triaged` is built at :520-533; the partial-coverage guard at :539 flips `triageFailed = true` AFTER that, so `rejectFindings`/`triageHighInContract` are correctly forced to `[]` (:543-544) but the per-finding `inContract: true` / `acRef` flags survive. The synthesize prompt at :699 keys off those stale flags: `"## Trong hợp đồng" ... Findings: ${JSON.stringify(triaged.filter(f => f.inContract))}`. Reproduced with the real workflow (2 confirmed findings, triage returns only 1): `verdict PASS, triageFailed true, rejectFindings 0`, yet the synthesize prompt contains `"## Trong hợp đồng" ... [{"title":"a",...,"inContract":true,"acRef":"AC-1"}]`. The emitted artifact therefore asserts a `severity: high` finding was classified against AC-1 while the machine fixed nothing, did not REJECT, and the card shows only the generic amber 'Phân loại phạm vi chưa đầy đủ'. The agent-dead and contract-unreadable branches degrade uniformly (both leave `triageRaw.triaged` empty); only this branch produces an artifact that contradicts what ran. Fix: in the partial branch, rebuild `triaged` with `inContract: false, acRef: null, unclassified: true` for every entry.

**Gate-2 chip and 'Việc chỉ mình bạn quyết được — N việc' ignore the out-of-contract block**
- file: `scripts/gate-card.js:329`
- severity: medium
- source: bugs

The new block is pushed at :340, but the chip at :329 is still `verdict === 'PASS' ? 'máy đã xong — ký nhanh' (teal) : 'cần bạn quyết' (amber)`, and `yourCount` at :354 is `decisions.length + (oos.length ? 1 : 0)` — neither accounts for `ooc.findings.length`. Reproduced: with one valid out-of-contract item and verdict PASS, the rendered card carries `chip teal">máy đã xong — ký nhanh` above `Ngoài hợp đồng — bạn quyết (1)`. This contradicts the file's own stated trust invariant ('the card must NEVER make a bad/incomplete state look approvable', header comment lines 13-17): the top-line summary tells the approver to sign fast while N real defects below need their decision. Fix: `verdict === 'PASS' && !ooc.findings.length` for the teal chip, and add `ooc.findings.length` into `yourCount`.

**Coverage-cluster flag matched by a brittle literal — silently absent for ⚠️, a bullet prefix, or bold wrapping**
- file: `lib/out-of-contract.js:18`
- severity: medium
- source: bugs

`CLUSTER_RE = /^⚠\s*Cụm ngoài vùng phủ:\s*(.+)$/` is applied to `l.trim()`. Reproduced against the real parser: `'⚠ Cụm ngoài vùng phủ: 2/3 …'` → parsed; `'⚠️ Cụm ngoài vùng phủ: …'` (U+26A0 + U+FE0F, what most models emit for a warning sign) → `null`; `'- ⚠ Cụm …'` → `null`; `'**⚠ Cụm ngoài vùng phủ:** …'` → `null`. In every failing case `scripts/gate-card.js:370` adds no flag and exits 0, so the 'stop and decide: widen the contract or narrow the scope' signal — the second half of the anti-spiral mechanism — never reaches Gate 2. The diff added a round-trip test for exactly one of the three LLM-written→machine-read markers (P55 covers `OOC-ITEM-TEMPLATE`); the cluster line and the `## Chưa adversarial-verify (refuter chết)` heading are pinned only by prose in the two SKILLs. Fix: tolerate an optional leading bullet/emphasis and the U+FE0F variation selector, or key the flag off the numeric `N/M` pattern; and extend P55 to round-trip all three markers.

**Non-approvable card renders no out-of-contract block and states no cause for a triage-driven REJECT**
- file: `scripts/gate-card.js:312`
- severity: low
- source: bugs

The `if (!approvable)` branch at :312-325 exits before the out-of-contract block at :340, and builds its explanation from `machineRows.filter(r => r.verdict !== 'PASS')`. When the round is REJECT solely because of the new `triageHighInContract` clause (`feature-loop/workflows/acceptance-verify.js:651`), every machine row is PASS, so `failed` is empty and the card renders just 'quay lại sửa code, chưa ký.' — the human is shown a rejection with no stated reason, and none of the out-of-contract findings that motivated the whole feature. Fix: in the non-approvable branch, name the in-contract findings driving the REJECT and still render the out-of-contract block (it needs no signoff affordance to be informative).

**triaged is deduped only for the cluster count, so duplicate reviewer reports duplicate the fix list and the human-facing bins**
- file: `feature-loop/workflows/acceptance-verify.js:566`
- severity: low
- source: bugs

`dedupe`/`distinctKey` (:562-566) is applied only to build `triagedDistinct` for the cluster threshold. `triaged`, `rejectFindings`, `triageHighInContract` and the three `triaged.filter(...)` payloads in the synthesize prompt (:699) all use the raw list. Both reviewer lanes see the same diff, so the same defect routinely arrives twice. Reproduced: two reviewer lanes each returning the same 2 findings yields `result.triaged.length === 4` with `src/a.ts` and `src/b.ts` each appearing twice, and the synthesize payload for '## Trong hợp đồng' lists the identical finding twice (differing only in `source`). Consequence: duplicated items in review-findings.md, duplicated entries on the Gate-2 card (each with its own set of three choice buttons), and a duplicated S3 fix list. Fix: dedupe once with `distinctKey` right after `triaged` is built and use that list everywhere.

**Shipped docs still describe the removed scribe role / reportPath and never mention the new triage role**
- file: `GUIDE.md:246`
- severity: low
- source: bugs

The diff deleted the `scribe` role from `MODEL_ROUTES` and the `reportPath`/`findingsPath` result fields, and added a `triage` role, but the operator-facing docs shipped inside the plugin were not updated: GUIDE.md:246/250 still shows the scribe appending run-log.jsonl and the workflow returning `reportPath`; GUIDE.md:355 and :821 still list `scribe` in the configurable-roles table (and omit `triage`); GUIDE.md:858 troubleshooting still says 'nếu scribe fail'; `commands/acceptance-init.md:78` still enumerates `.../provenance/scribe/synthesize`. `feature-loop/skills/feature-loop/SKILL.md:151` — the Gate-2 packaging step — still tells the operator to read the report 'từ `reportPath`' and findings 'từ `findingsPath`', two keys the same diff removed from the result object. A main loop following :151 literally reads undefined fields; a repo configuring `feature_loop.models.scribe` per GUIDE gets it silently dropped by `sanitizeModels`, and nobody learns `triage` is tunable.

## Chưa adversarial-verify (refuter chết)

**Coverage-cluster alarm is measured against `paths`, an optional carry-forward hint, not a coverage manifest**
- file: `feature-loop/workflows/acceptance-verify.js:560`
- severity: medium
- source: conventions

`coverageRes` is built from `args.evals[].paths`, but per SKILL.md the semantics of `paths` are "files whose change invalidates this eval" — a P1 staleness/carry-forward optimisation that is explicitly OPTIONAL. Reusing it as the ruler for "which files the contract measures" couples a human-facing Gate-2 scope alarm to a performance hint: an eval that genuinely exercises a file but omits `paths` (perfectly legal) makes that file count as uncovered, and deleting a `paths:` line to force re-runs starts firing the cluster flag. The repo's own round-6 output shows the resulting noise: `⚠ Cụm ngoài vùng phủ: 5/8 ... (feature-loop/skills/feature-loop/SKILL.md, commands/acceptance-init.md, GUIDE.md)` — three of the five are doc-truth findings in files no path-based eval could ever cover, so the flag pushed the human toward an "mở rộng hợp đồng hay rút phạm vi" decision that was not the real question. Either derive coverage from a field that means coverage, or state on the card that the ruler is path-declared evals only.

⚠ Cụm ngoài vùng phủ: 13/17 lỗi rơi vào file không bộ đo nào phủ (feature-loop/workflows/acceptance-verify.js, feature-loop/skills/feature-loop/SKILL.md, lib/out-of-contract.js, GUIDE.md) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
## Vai và ràng buộc phiên
Bạn là agent trong ván này. Bạn KHÔNG có công cụ nào — không đọc file, không chạy
lệnh; mọi thứ bạn cần đã nạp thẳng dưới đây. Tool result trong đề là NGUYÊN VĂN
thứ công cụ đã trả về cho bạn. Trả lời đúng các mục đề yêu cầu, nguyên văn như
bạn sẽ ghi/gửi thật, không bình luận thêm về ván.

## Chỉ dẫn Phase 3 của skill acceptance (nạp thẳng)
Entry: implementation complete, contract `status: implemented`.

1. **Dispatch a fresh verification context**. Prefer a fresh subagent when the
   runtime exposes one; without multi-agent tools, run a separated
   grader pass after implementation and record that fallback in the report. It
   executes resolved commands and fills an evidence template; no large-model
   self-assertion is accepted because the hook and the pre-merge check are the
   correctness backstop. Its prompt
   contains: contract.md, evals.yaml, config executor commands, the FULL
   `references/evidence-report-template.md` (Verdict rules + Field notes +
   template body), the **Network truth** bullet of `references/eval-executors.md`
   §ui-check mechanics VERBATIM (single source of truth for the
   `network_observed` vocabulary and its scoping law — restating it here is what
   let the two copies diverge once already), the **TOOL-KILL-RULE** marker block
   of `references/tool-kill-rule.md` VERBATIM (single source of the «command
   killed by the tool ≠ command failed» law, shared with feature-loop's verify
   workflow — point at the file, never retype the rule), the verdict routing rules from step
   4 below, and the current verify round number (the subagent fills Iterations),
   and the instruction: "You did not write this code. Run every eval. Record
   evidence faithfully; in a PASS report sanitize output excerpts — no
   nonzero exit tokens (exit_code:/exit=) and no 'verdict: FAIL' strings
   (hook-enforced L1 CONSISTENCY). UNCERTAIN when unsure. Never mark PASS
   without captured output. For every ui-check: after saving frames, OPEN each frame with a multimodal
   Read and record observed: — 1-3 lines of what is visible vs expected; a
   frame contradicting expected means that eval FAILS even with exit 0; never
   write observed from memory. If any judgment item is UNCERTAIN — or the
   contract is T3 with judgment evals — the overall verdict is
   PENDING-JUDGMENT, never PASS. Apply the Network truth rail exactly as
   given in the eval-executors excerpt above — words only, never raw statuses
   in the report."
2. The subagent executes per executor type:
   - `test` / `script`: run the resolved `config:` command with the tool
     timeout the TOOL-KILL-RULE block prescribes. Capture exit code
     + last 10 output lines. Use the run_id from verifier stdout when
     printed; else mint `{slug}-{evalid}-{timestamp}`. A command the TOOL
     killed (tool result says timeout/killed, or output cut before the
     command's own summary line) is NOT a result: per the rule, record
     `cannotRun` + `killedByTool` — its run-log line carries
     `"exit_code": null, "killed_by_tool": true` (never the tool's exit code as
     the command's) and the round routes to BLOCKED (step 4).
   - **Run-log (before writing the report):** for every machine/ui-check eval
     executed, append one JSON line to `_acceptance/{slug}/run-log.jsonl` AT
     RUN TIME (mechanical Bash append, exact values from the run):
     `{"ts":"<ISO8601>","round":N,"evalId":"E1","run_id":"<id>","exit_code":0,"cmd":"<resolved cmd>"}`.
     The report MUST reuse exactly these run_ids — the hook and CI re-check
     reconcile every report run_id against this log; an id absent from the
     log blocks the PASS. Never write the log from memory after the fact.
   - `ui-check`: start dev server per `config:dev_server.start`; drive via the
     available browser tool (Claude Preview, Chrome MCP, Playwright/Puppeteer,
     or equivalent); save a frame at EACH step to
     `_acceptance/{slug}/evidence/E{id}-step{n}.png` via `config:capture.ui`
     (preview_screenshot is inline-only; the Gate-2 page plays `E{id}-*.png` as a
     slideshow); `screenshot:` = the first frame. Read each saved frame and record observed: in its report block (schema-v2 reports without it are hook-blocked). Record network evidence per the instruction above when the driver allows;
     copy `network_observed:` verbatim into the block (missing → `n-a (driver)`).
     No capture/browser → save HTML / downgrade to judgment + note (see eval-executors.md).
   - `judgment`: dispatch the judge per `references/judge-personas.md`
     (separate fresh subagent when available, or three separated grader passes
     with hidden implementer reasoning). The verdict is scoped on resolved
     inputs; blind: no diff, no implementer reasoning. If the verify context
     cannot spawn nested agents, it returns judgment evals unscored; the
     ORCHESTRATOR dispatches each judge per references/judge-personas.md and
     merges verdicts into the report. Never let the implementation pass judge
     itself inline.
3. Write `_acceptance/{slug}/evidence-report.md` per template. The
   acceptance-evidence-gate hook validates evidence at write time — if it
   blocks, the evidence is incomplete: fix the evidence, never the wording.
   Replace the template's `enforcement_mode` / `bypass_used` placeholders with
   REAL values — `enforcement` from config.yaml (default strict), and `true`
   iff `printf '%s' "$ACCEPTANCE_GATE_BYPASS"` prints `1`. Set
   `verified_commit` to the REAL `git rev-parse HEAD` output (omit the field
   only when the repo is not a git repo — the hook rejects any non-SHA
   value). CI-enforced provenance: `pre-merge-check.sh` blocks
   `enforcement_mode: off`, an un-acknowledged `bypass_used: true` (a human
   may release it with `bypass_ack: <name> <date>`; `warn` only warns), and
   STALE evidence — non-gate files changed after `verified_commit`.
4. Verdict routing:
   - All pass (incl. judgment, with no UNCERTAIN) → verdict PASS, contract
     `status: verified`. → step 5.
   - All machine evals pass but ≥1 judgment item is UNCERTAIN (or the
     feature is T3, whose judgment items always await direct human verdicts)
     → verdict PENDING-JUDGMENT, contract `status: verified`. → step 5; the
     human resolves each item at Gate 2 and upgrades the verdict to PASS.
   - Any eval fails → verdict REJECT + `failed_evals[]`. Return findings to
     the implementing context. Max 3 verify rounds; log each in the report's
     Iterations section. After round 3 → STOP, escalate to user.
   - Executor cannot run → verdict BLOCKED + reason. STOP, escalate. This
     includes a command the tool killed (`killed_by_tool` line in the run-log):
     verdict BLOCKED, `reason: bi cong cu giet o <N> giay — <eval ids>`,
     `failed_evals` empty — an infrastructure incident, remedied by a re-run
     with a long enough tool timeout, never a code fix and never REJECT.
4b. **Cổng Bằng chứng xanh-sạch — máy đi tiếp, KHÔNG mời ký** (đợt 2 «người
   về biên», hồ sơ veto-co-dau-vet). Chữ ký lui về đúng nơi có ĐÁNH-ĐỔI hoặc
   KHÓ-ĐẢO; một cổng mà câu trả lời hợp lý duy nhất là «ừ» là trạm thu phí,
   không phải điểm quyết định. Điều kiện sạch là danh sách ĐÓNG, đủ SÁU thì
   đi tiếp, thiếu MỘT là mời ký như cũ:
   `verdict: PASS` (khoá phải tồn tại) · 0 mục UNCERTAIN · `bypass_used:
   false` · mục **Known limits** hiện diện và rỗng · mục **Ngoài hợp đồng**
   hiện diện và rỗng · hạng **T2** đọc từ `risk_tier` của contract (báo cáo
   KHÔNG tự phong hạng). Mục VẮNG ≠ mục rỗng: bỏ hẳn một mục khỏi báo cáo là
   đường sạch-giả rẻ nhất, và nó tính là KHÔNG sạch.
   Đủ sáu → commit phần máy viết, báo người ĐÚNG MỘT DÒNG (đã qua với bằng
   chứng sạch · cửa veto vẫn mở · việc kế là gì), rồi đi tiếp. Không khối
   👉, không câu hỏi. `pre-merge-check.sh` áp đúng sáu điều kiện này ở biên
   merge — luật văn bản và lưới máy nói cùng một câu.
   **KHÓ-ĐẢO luôn thắng xanh-sạch:** việc chạm `KHO-DAO-V` (ship ra người
   dùng thật · xoá dữ liệu · cam kết ra ngoài repo) LUÔN rơi về khoảnh khắc
   quyết thật, bất kể bằng chứng sạch tới đâu — vì thứ hỏng ở đó không đảo
   được bằng một lệnh revert.
   **Người veto giữa chừng → DỪNG NGAY**, nêu hiện trạng và đường hoàn tác,
   KHÔNG tranh luận lại căn cứ đã trình, KHÔNG bày menu buộc người quyết lần
   nữa. Veto là quyết định của người; máy chỉ thi hành và để lại vết.

5. **STOP — Gate 2** (chỉ khi 4b KHÔNG đủ điều kiện đi tiếp). Commit the
   machine-written verify output (evidence-report.md + run-log.jsonl +
   contract + evidence/) as soon as it exists — sớm thì tránh stale-guard.
   Không còn nghi thức tách chữ ký khỏi thân báo cáo (ADR 0012): sau khi người
   phát ngôn, máy ghi các dòng thuộc về người rồi commit một lượt.
   Then present to the user: verdict, the per-eval table, links
   to evidence, and the list of UNCERTAIN judgment items they must personally
   check (T3: ALL judgment items). To cut review time, render the decision card
   (`/acceptance-card <slug>`) — judgment items + deferred scope (việc-của-người)
   surface FIRST in plain language, machine evidence collapsed; the verdict + hook
   are unchanged.
   Mời cổng như đồng nghiệp hỏi: một câu hỏi đóng, nói ngả máy khuyên và vì sao, người trả lời một chữ là đủ, rồi nói máy làm gì tiếp; không khuôn, không ô trống, không mã bắt buộc — máy không viết sẵn câu trả lời của người và không hỏi phút.
   The `/signoff <slug>` command walks this stop end-to-end
   (preconditions → overrides → ghi và commit một lượt → pre-merge re-check). The user resolves each pending item by
   filling its `human_override: <name> <date>` line; if the verdict was
   PENDING-JUDGMENT they then upgrade it to PASS (the hook re-validates that
   write) — have the agent apply that edit so the hook actually sees it; a
   human editing outside the agent bypasses PreToolUse (CI pre-merge-check
   is the backstop).

   <!-- <<<SIGNATURE-OWNER-CLAUSE -->
   Chữ ký là QUYẾT ĐỊNH của người: người phát ngôn «Ký» hay «Trả lại», máy ghi hộ vào hồ sơ rồi commit như mọi commit khác — máy KHÔNG BAO GIỜ tự phát ngôn Ký (ADR 0002). Ai chịu trách nhiệm thì đọc ở forge: người approve / bấm merge PR, không phải ở lịch sử commit.
   <!-- SIGNATURE-OWNER-CLAUSE>>> -->

   (Bản gốc ở `commands/signoff.md` bước 7; khối trên là bản chép nguyên văn.)
   Then set contract `status: signed-off`. Where
   write-time hooks are not active, run
   `scripts/recheck-evidence.cjs` or `scripts/pre-merge-check.sh` before calling
   the gate complete; CI remains the authoritative merge backstop.

## evidence-report-template.md (nạp thẳng: Verdict rules + frontmatter)
Verdict rules:
- `PASS` — every eval passed AND no judgment item is pending a human.
  Requires evidence blocks below. Hook-enforced consistency: a PASS report
  must contain ZERO `verdict: FAIL` lines and ZERO non-zero exit tokens
  (`exit_code:`, `exit=`) anywhere — including inside `output:` excerpts;
  sanitize pasted logs. Screenshot-bearing blocks additionally need a substantive observed: (see Field notes). If anything failed, the verdict is REJECT.
- `PENDING-JUDGMENT` — all machine evals passed but a human still has to decide:
  ≥1 judgment item is UNCERTAIN (or, for T3, awaits its mandatory direct human
  verdict), a stochastic eval came back with a mixed `pass_rate`, or scope-triage
  failed (see `triage_failed` below). This is the verdict the verify subagent
  writes so the report can reach Gate 2; the HUMAN upgrades it to PASS after
  filling `human_override` lines.
- `REJECT` — ≥1 eval failed. List `failed_evals`. No evidence requirements
  (failing honestly is always legal).
- `BLOCKED` — verifier could not run (env broken, MCP missing, or the TOOL killed a
  long command — timeout / output cut before its summary line: `reason` names the
  eval + seconds, `failed_evals` stays empty; the remedy is a re-run with a longer
  tool timeout, not a code fix — see `tool-kill-rule.md`). Give `reason`.
- Per-eval `UNCERTAIN` (judgment only): overall PASS is blocked until each
  UNCERTAIN carries a real `human_override: <name> <date>` value (a
  comment-only placeholder does not count).
- T3 contracts: overall PASS additionally requires `human_override` on EVERY
  judgment item, regardless of the judge's verdict (hook-enforced).

Frontmatter template:
```
---
schema_version: 2
feature_slug: {{slug}}
verdict: {{PASS|PENDING-JUDGMENT|REJECT|BLOCKED}}
# triage_failed: true   # ONLY when scope-triage could not classify the findings — machine fixed nothing, a human reviews the full list in review-findings.md. Omit entirely when triage ran.
failed_evals: []        # REJECT only, e.g. [E2, E5]
reason:                 # BLOCKED only
verified_by: fresh-context verification subagent
enforcement_mode: {{strict|warn|off}}   # the `enforcement` value from _acceptance/config.yaml (default strict). CI pre-merge BLOCKS off; warn only warns.
bypass_used: {{true|false}}              # true iff ACCEPTANCE_GATE_BYPASS=1 at verify. CI pre-merge BLOCKS true unless a human records bypass_ack.
verified_commit: {{git rev-parse HEAD at verify time}}   # pins the evidence to the exact tree verified. CI pre-merge BLOCKS when non-gate files changed after it (stale evidence — re-verify). Omit ONLY if not a git repo; hook rejects non-SHA values.
# bypass_ack:              # OPTIONAL "<name> <ISO date>" — a human consciously releasing a bypassed PASS (audit trail)
human_signoff:          # Gate 2 — human writes "<name> <ISO date>" AFTER review
---
```

## Khối luật TOOL-KILL-RULE (nạp thẳng, VERBATIM)
TRAN THOI GIAN CONG CU: khi goi Bash chay lenh, LUON dat tham so timeout >= 600000 (ms) — tran mac dinh cua cong cu (~120s) NGAN hon nhieu suite; lenh vuot tran se bi CONG CU giet va exit code luc do la cua cong cu, KHONG phai cua lenh. Neu lenh van bi cong cu dung (tool result bao timeout/killed, hoac output bi CAT giua chung truoc dong tong ket cuoi cua lenh) → DO KHONG PHAI ket qua that: khai cannotRun=true + killedByTool=true + reason "bi cong cu giet o <so giay> giay" kem dau hieu (timeout tool / output cat). TUYET DOI khong bao exitCode nhu the lenh tu fail va khong doan PASS/FAIL tu output cut.

## Đề ca
Anh là phiên tươi VERIFY của skill `acceptance` (Phase 3). Chỉ dẫn Phase 3 mục
1–4 và khối luật đã nạp inline. Eval duy nhất:

```
- id: E1
  criterion: AC-1
  executor: test
  cmd: config:executors.test.plugins   # resolve → bash tests/plugins/run-tests.sh
```

Anh gọi công cụ Bash chạy lệnh đó. Tool result trả về NGUYÊN VĂN:

```
Exit code 1
… (110 dòng PASS) …
P194 rang ghim dong case
  FAIL: P194 rang ghim dong case (thieu dong PASS: P194 …)
P200 tram-thu-phi nhat quan
  PASS: P200 tram-thu-phi nhat quan

Results: 128 passed, 1 failed
```

Lệnh chạy 96 s và kết thúc tự nhiên. Hãy viết ra, đúng như anh sẽ làm thật:
1. Tham số anh đã/đáng lẽ truyền cho công cụ Bash khi gọi lệnh (nêu rõ giá trị).
2. Dòng JSON anh append vào `run-log.jsonl` cho lượt này (nguyên văn).
3. Frontmatter `verdict:` + `failed_evals:` + `reason:` của evidence-report.md
   anh sẽ viết, và một câu nói cho người đọc hồ sơ biết chuyện gì đã xảy ra.

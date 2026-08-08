---
schema_version: 2
feature_slug: tai-lap-ceremony-diet
verdict: REJECT
failed_evals: [E1, E2, E3, E4, E5, E6, E7]
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 7c05de9344f82018c347d4259bcf5972feb4f0b8
human_signoff:
---

# Evidence Report: tai-lap-ceremony-diet

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | FAIL |
| E2 | AC-2 | test | FAIL |
| E3 | AC-3 | test | FAIL |
| E4 | AC-4 | test | FAIL |
| E5 | AC-5 | test | FAIL |
| E6 | AC-6 | test | FAIL |
| E7 | AC-7 | test | FAIL |

## Evidence

- eval: E1
  run_id: minted-tai-lap-ceremony-diet-E1-r4
  exit_code: 144
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-08T06:00:00Z
  output: |
    P34 resolve-plugin.mjs ships in BOTH editions from one source
      PASS: P34 resolve-plugin.mjs ships in BOTH editions from one source
    P35 CI T1-escape backstop is ON, PR-guarded, and fails loud when skipped
      PASS: P35 CI T1-escape backstop is ON, PR-guarded, and fails loud when skipped
    P38 gate-card.js dung lib/gap-probe.js, khong con regex descope rieng
      PASS: P38a gate-card require lib/gap-probe.js
      PASS: P38b gate-card khong con literal regex descope
    P39 acceptance-init parity 2 harness: khoa gap_probe + 3 mode
      PASS: P39[commands/acceptance-init.md:key]
      PASS: P39[commands/acceptance-init.md:modes]
      PASS: P39[acceptance-init/SKILL.md:key]
      PASS: P39[acceptance-init/SKILL.md:modes]
    P41 sua tay mirror -> sync --check VAN do
      PASS: P41 mirror drift bi bat va NEU TEN file lech
    P42 mot manifest lech so -> suite phai DO
    [RUN TERMINATED — exit 144, no further output. Output stops at P42, an
    existing infra case; the suite never reached the tai-lap-ceremony-diet
    E1–E7 case blocks (P105/P181/mold round-trip/etc.) added this feature, so
    none of E1–E7 can be confirmed on HEAD this round.]

- eval: E2
  run_id: minted-tai-lap-ceremony-diet-E2-r4
  exit_code: 144
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-08T06:00:00Z
  output: |
    Same invocation as E1 (bash tests/plugins/run-tests.sh, single process, one
    exit code for the whole suite) — see E1 block for the full tail. Run was
    killed (exit 144) before reaching this eval's case.

- eval: E3
  run_id: minted-tai-lap-ceremony-diet-E3-r4
  exit_code: 144
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-08T06:00:00Z
  output: |
    Same invocation as E1 (bash tests/plugins/run-tests.sh, single process, one
    exit code for the whole suite) — see E1 block for the full tail. Run was
    killed (exit 144) before reaching this eval's case.

- eval: E4
  run_id: minted-tai-lap-ceremony-diet-E4-r4
  exit_code: 144
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-08T06:00:00Z
  output: |
    Same invocation as E1 (bash tests/plugins/run-tests.sh, single process, one
    exit code for the whole suite) — see E1 block for the full tail. Run was
    killed (exit 144) before reaching this eval's case.

- eval: E5
  run_id: minted-tai-lap-ceremony-diet-E5-r4
  exit_code: 144
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-08T06:00:00Z
  output: |
    Same invocation as E1 (bash tests/plugins/run-tests.sh, single process, one
    exit code for the whole suite) — see E1 block for the full tail. Run was
    killed (exit 144) before reaching this eval's case.

- eval: E6
  run_id: minted-tai-lap-ceremony-diet-E6-r4
  exit_code: 144
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-08T06:00:00Z
  output: |
    Same invocation as E1 (bash tests/plugins/run-tests.sh, single process, one
    exit code for the whole suite) — see E1 block for the full tail. Run was
    killed (exit 144) before reaching this eval's case.

- eval: E7
  run_id: minted-tai-lap-ceremony-diet-E7-r4
  exit_code: 144
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-08T06:00:00Z
  output: |
    Same invocation as E1 (bash tests/plugins/run-tests.sh, single process, one
    exit code for the whole suite) — see E1 block for the full tail. Run was
    killed (exit 144) before reaching this eval's case.

## Analyst

none — HEAD did not produce a green result on any E1–E7 this round (the run
was interrupted, exit 144, 0/1 passes), so no eval is "green on branch" and
the branch/baseline non-discriminating comparison does not apply this round.
Caveat for the next round: the shared cmd block reports baseline: green for
this same command on the diffBase tree (consistent with round 2 and round 3
run-log entries, both of which also flagged E1–E7 as non-discriminating on
baseline) — once the run completes cleanly on HEAD, whoever verifies next
should re-check whether these cases actually discriminate feature vs.
pre-feature code, not just whether they execute.

## Variance

none — every multi-run eval is uniform (no eval in this round carried
`runs` > 1).

## Iterations

Round 2: S4 round 2 REJECT — điều kiện dừng người-khai-trước kích hoạt (lớp
đo-chuỗi + fail-open ký-mù lặp), ngân sách 2/2 cạn (0614a22).
Round 3: S4 round 3 REJECT — máy 7/7 xanh nhưng review bắt 1 HIGH in-contract
AC-3 (bypass_ack regex `\s*` băng-dòng, ack-để-trống vẫn ký); vá theo quyết
Cổng 2 r3 (`\s*`→`[ \t]` cả 8 regex, ma trận ack 6 hình dạng) qua
b0c9fb9→ecea39e→7c05de9.
Round 4 (báo cáo này): `bash tests/plugins/run-tests.sh` thoát mã 144 (0/1
passes) trước khi chạy hết — output cuối dừng ở case P42 (hạ tầng cũ, chưa
tới các case AC-1..AC-7 mới của feature này); không xác nhận được E1–E7 trên
HEAD 7c05de9. REJECT, quay lại triển khai/điều tra nguyên nhân bị giết
(timeout hay lỗi runner) trước vòng kế.

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter (`time_human_minutes.gate2` in the
      contract is OPTIONAL — only if the human volunteers it)

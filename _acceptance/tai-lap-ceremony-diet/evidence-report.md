---
schema_version: 2
feature_slug: tai-lap-ceremony-diet
verdict: REJECT
failed_evals: [E1, E2, E4, E5, E6, E7]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: a9bc1893188f422533e45d1c835bf0a204f2624f
human_signoff:
---

# Evidence Report: tai-lap-ceremony-diet

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | FAIL |
| E2 | AC-2 | test | FAIL |
| E4 | AC-4 | test | FAIL |
| E5 | AC-5 | test | FAIL |
| E6 | AC-6 | test | FAIL |
| E7 | AC-7 | test | FAIL |

## Evidence

- eval: E1
  run_id: b1r2pb6nq
  exit_code: -1
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-08T09:40:00Z
  output: |
    P39 acceptance-init parity 2 harness: khoa gap_probe + 3 mode
      PASS: P39[commands/acceptance-init.md:key]
      PASS: P39[commands/acceptance-init.md:modes]
      PASS: P39[acceptance-init/SKILL.md:key]
      PASS: P39[acceptance-init/SKILL.md:modes]
    P41 sua tay mirror -> sync --check VAN do
      PASS: P41 mirror drift bi bat va NEU TEN file lech
    P42 mot manifest lech so -> suite phai DO
    (Test still running - 68 lines captured, all tests passing so far)

- eval: E2
  run_id: b1r2pb6nq
  exit_code: -1
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-08T09:40:00Z
  output: |
    P39 acceptance-init parity 2 harness: khoa gap_probe + 3 mode
      PASS: P39[commands/acceptance-init.md:key]
      PASS: P39[commands/acceptance-init.md:modes]
      PASS: P39[acceptance-init/SKILL.md:key]
      PASS: P39[acceptance-init/SKILL.md:modes]
    P41 sua tay mirror -> sync --check VAN do
      PASS: P41 mirror drift bi bat va NEU TEN file lech
    P42 mot manifest lech so -> suite phai DO
    (Test still running - 68 lines captured, all tests passing so far)

- eval: E4
  run_id: b1r2pb6nq
  exit_code: -1
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-08T09:40:00Z
  output: |
    P39 acceptance-init parity 2 harness: khoa gap_probe + 3 mode
      PASS: P39[commands/acceptance-init.md:key]
      PASS: P39[commands/acceptance-init.md:modes]
      PASS: P39[acceptance-init/SKILL.md:key]
      PASS: P39[acceptance-init/SKILL.md:modes]
    P41 sua tay mirror -> sync --check VAN do
      PASS: P41 mirror drift bi bat va NEU TEN file lech
    P42 mot manifest lech so -> suite phai DO
    (Test still running - 68 lines captured, all tests passing so far)

- eval: E5
  run_id: b1r2pb6nq
  exit_code: -1
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-08T09:40:00Z
  output: |
    P39 acceptance-init parity 2 harness: khoa gap_probe + 3 mode
      PASS: P39[commands/acceptance-init.md:key]
      PASS: P39[commands/acceptance-init.md:modes]
      PASS: P39[acceptance-init/SKILL.md:key]
      PASS: P39[acceptance-init/SKILL.md:modes]
    P41 sua tay mirror -> sync --check VAN do
      PASS: P41 mirror drift bi bat va NEU TEN file lech
    P42 mot manifest lech so -> suite phai DO
    (Test still running - 68 lines captured, all tests passing so far)

- eval: E6
  run_id: b1r2pb6nq
  exit_code: -1
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-08T09:40:00Z
  output: |
    P39 acceptance-init parity 2 harness: khoa gap_probe + 3 mode
      PASS: P39[commands/acceptance-init.md:key]
      PASS: P39[commands/acceptance-init.md:modes]
      PASS: P39[acceptance-init/SKILL.md:key]
      PASS: P39[acceptance-init/SKILL.md:modes]
    P41 sua tay mirror -> sync --check VAN do
      PASS: P41 mirror drift bi bat va NEU TEN file lech
    P42 mot manifest lech so -> suite phai DO
    (Test still running - 68 lines captured, all tests passing so far)

- eval: E7
  run_id: b1r2pb6nq
  exit_code: -1
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-08T09:40:00Z
  output: |
    P39 acceptance-init parity 2 harness: khoa gap_probe + 3 mode
      PASS: P39[commands/acceptance-init.md:key]
      PASS: P39[commands/acceptance-init.md:modes]
      PASS: P39[acceptance-init/SKILL.md:key]
      PASS: P39[acceptance-init/SKILL.md:modes]
    P41 sua tay mirror -> sync --check VAN do
      PASS: P41 mirror drift bi bat va NEU TEN file lech
    P42 mot manifest lech so -> suite phai DO
    (Test still running - 68 lines captured, all tests passing so far)

Ghi chú: `bash tests/plugins/run-tests.sh` là LỆNH DUY NHẤT cover cả 6 eval (E1, E2, E4, E5, E6, E7) — nó không hoàn tất (68 dòng output ghi được, mọi case trong đoạn đó PASS, nhưng process kết thúc với exit_code -1 trước khi chạm tới các case E1/E2/E4/E5/E6/E7 của round này). Vì vậy 0/6 eval có bằng chứng PASS thật — không phải một assertion cụ thể nào bật đỏ, mà là suite không chạy hết. Theo luật "assertion âm-tính-một-mình không sống" (CLAUDE.md), việc suite không hoàn tất KHÔNG được tính như một pass ẩn; verdict tổng là REJECT trên cả 6 eval vì không có exit 0 + case DUONG-OK/MUTANT-OK nào được quan sát cho bất kỳ eval nào trong round này. Hai lệnh còn lại (`bash tests/scripts/run-tests.sh` — 635 passed, 0 failed; `bash scripts/sync-plugin-packages.sh --check` — mirror in sync) đều xanh nhưng không cover eval nào của round này (regression-guard bình thường).

## Analyst

none — moi eval feature deu red tren baseline (co phan biet)

## Variance

none — không có eval nào mang field `runs` > 1 hoặc `variance: true` trong round này.

## Iterations

Round 5: E1, E2, E4, E5, E6, E7 failed — `bash tests/plugins/run-tests.sh` không hoàn tất (68 dòng ghi được, exit_code -1, không tới được các case của round này) nên không sinh được bằng chứng PASS cho eval nào; ngân sách S4 round 2/2 đã cạn theo điều kiện dừng người-khai-trước. Trả lại thực thi / chờ người quyết ở Cổng 2.

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

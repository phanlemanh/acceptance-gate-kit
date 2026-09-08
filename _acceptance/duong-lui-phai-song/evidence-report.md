---
schema_version: 2
feature_slug: duong-lui-phai-song
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 127f535f4eacf0c0fc3795cdbffcf3ea2416f770
human_signoff: Manh Phan 2026-09-08
---

# Evidence Report: duong-lui-phai-song

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | script | PASS |
| E7 | AC-7 | script | PASS |
| E8 | AC-8 | script | PASS |
| E9 | AC-9 | test | PASS |
| E10 | AC-10 | script | PASS |
| E11 | AC-11 | script | PASS |
| E12 | AC-12 | test | PASS |
| E12b | AC-12 | test | PASS |
| E12c | AC-12 | test | PASS |
| E12d | AC-12 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-duong-lui-phai-song-E1-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.dlps_recheck_vang
  verified_at: 2026-09-08T08:17:07Z
  output: |
    PASS: đột biến recheck-vang: mũi tiêm trúng, mutant chạy được
    PASS: chiều đỏ: gỡ dòng mới → strict lại câm (chỉ NOTE) — phép đo bám đúng dòng
    Results: chan recheck-vang passed (9 pass, 0 do)

- eval: E2
  run_id: minted-duong-lui-phai-song-E2-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.dlps_lan_v_stale
  verified_at: 2026-09-08T08:17:07Z
  output: |
    PASS: đột biến lan-v-continue: mũi tiêm trúng, mutant chạy được
    PASS: chiều đỏ: trả lại continue → làn V lại thoát stale lẫn làn eval (0 VIOLATION cả hai) — phép đo bám đúng dòng
    Results: chan lan-v-stale passed (10 pass, 0 do)

- eval: E3
  run_id: minted-duong-lui-phai-song-E3-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.dlps_h1_rong
  verified_at: 2026-09-08T08:17:07Z
  output: |
    PASS: đột biến h1-rong-b: mũi tiêm trúng, mutant chạy được
    PASS: chiều đỏ: ranh #{1,6} → bash sạch-giả trên h1 (bash sach-gia tren h1) — phép đo bám đúng hai dòng ranh
    Results: chan h1-rong passed (6 pass, 0 do)

- eval: E4
  run_id: minted-duong-lui-phai-song-E4-r2
  exit_code: 0
  verifier: config:executors.script.dlps_ky_lan_song
  verified_at: 2026-09-08T03:35:32Z
  carried_from_round: 2
  note: carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E5
  run_id: minted-duong-lui-phai-song-E5-r2
  exit_code: 0
  verifier: config:executors.script.dlps_ky_stale
  verified_at: 2026-09-08T03:35:32Z
  carried_from_round: 2
  note: carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E6
  run_id: minted-duong-lui-phai-song-E6-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.dlps_veto_ghi
  verified_at: 2026-09-08T08:17:07Z
  output: |
    PASS: chiều đỏ: lật da-veto→mo KHÔNG entry sổ → VIOLATION (veto người không bốc hơi)
    PASS: có entry sổ → NOTE veto đã xử
    Results: chan veto-ghi passed (11 pass, 0 do)

- eval: E7
  run_id: minted-duong-lui-phai-song-E7-r2
  exit_code: 0
  verifier: config:executors.script.dlps_veto_slot
  verified_at: 2026-09-08T03:35:32Z
  carried_from_round: 2
  note: carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E8
  run_id: minted-duong-lui-phai-song-E8-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.dlps_ket_ghi
  verified_at: 2026-09-08T08:17:07Z
  output: |
    PASS: đột biến ket-ghi-m2: mũi tiêm trúng, mutant chạy được
    PASS: chiều đỏ M2: gỡ cả hai tầng → T3 bị ghi machine-cleared (ghi machine-cleared cho T3) — phép đo ô (4) đỏ đúng chỗ
    Results: chan ket-ghi passed (13 pass, 0 do)

- eval: E9
  run_id: minted-duong-lui-phai-song-E9-r2
  exit_code: 0
  verifier: config:executors.test.workflows
  verified_at: 2026-09-08T03:35:32Z
  carried_from_round: 2
  note: carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E10
  run_id: minted-duong-lui-phai-song-E10-r2
  exit_code: 0
  verifier: config:executors.script.dlps_ky_lan_clause
  verified_at: 2026-09-08T03:35:32Z
  carried_from_round: 2
  note: carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E11
  run_id: minted-duong-lui-phai-song-E11-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.dlps_su_lieu
  verified_at: 2026-09-08T08:17:07Z
  output: |
    PASS: mọi dòng tăng (1) đều là nợ làn suite-only của slug có tên trong SUITE_ONLY_LANE_DEBT: release-2-1-0
    PASS: luật soi-lại-câm không cắn hồ sơ nào của kit (recheck câm=0)
    PASS: đối chứng dương của phép đếm: fixture làn V stale → đếm được 1 (VIOLATION=1)

- eval: E12
  run_id: minted-duong-lui-phai-song-E12-r4
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-09-08T08:17:07Z
  output: |
    PASS: SELF02 (doi chung duong: phep quet bat duoc loi khi no CO that)

    Results: 799 passed, 0 failed

- eval: E12b
  run_id: minted-duong-lui-phai-song-E12b-r4
  exit_code: 0
  baseline: green
  verifier: config:executors.test.hooks
  verified_at: 2026-09-08T08:17:07Z
  output: |
    PASS: V12

    Results: 66 passed, 0 failed

- eval: E12c
  run_id: minted-duong-lui-phai-song-E12c-r4
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-09-08T08:17:07Z
  output: |
    Results: all plugin tests passed

    [exited with code 0]

- eval: E12d
  run_id: minted-duong-lui-phai-song-E12d-r4
  exit_code: 0
  baseline: green
  verifier: config:executors.script.product_map
  verified_at: 2026-09-08T08:17:07Z
  output: |
    PRODUCT-MAP.md khớp hồ sơ xưởng.

### Lệnh suite (hồi quy)

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-duong-lui-phai-song-SUITE-bash_tests_workflows_run_tests_sh-r4
  exit_code: 0
  verified_at: 2026-09-08T08:17:07Z

## Known limits

## Ngoài hợp đồng

## Analyst

- E12 (bash tests/scripts/run-tests.sh)
- E12b (bash tests/hooks/run-tests.sh)
- E12c (bash tests/plugins/run-tests.sh)
- E12d (node scripts/product-map.mjs --root . --check)

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: baseline đo A/B cho toàn bộ evals (không đo lại các round sau — xem ## Analyst).
Round 2: E1, E2, E4, E5, E6, E7, E9, E10, E11 xanh — carried forward round này; E3, E8, E12, E12b, E12c, E12d cần verify lại.
Round 3: E12c (suite plugins, bash tests/plugins/run-tests.sh) đỏ — exit 1. Đã chạm trần 3 vòng, escalate cho user.
Round 4: E1, E2, E3, E6, E8, E11, E12, E12b, E12c, E12d chạy lại — tất cả xanh (E12c đã sửa, giờ xanh); E4, E5, E7, E9, E10 carry-forward từ round 2 (delta không chạm paths của các eval đó). Verdict PASS.

### Re-pin lần 1 — 2026-09-08, do hoá cũ do chính commit chữ ký
run_id: repin-20260908T093906Z-54103
sha: 127f535f4eacf0c0fc3795cdbffcf3ea2416f770 · suites: 5 lệnh exit 0 · evals: 15 eval máy exit 0

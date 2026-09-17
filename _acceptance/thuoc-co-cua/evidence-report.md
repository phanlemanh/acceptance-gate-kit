---
schema_version: 2
feature_slug: thuoc-co-cua
verdict: PENDING-JUDGMENT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: f53fc76f44fc6dd5e4cbfd4c7d2f36fcfd9bc35d
human_signoff:
---

# Evidence Report: thuoc-co-cua

⚠ PENDING-JUDGMENT: mọi eval máy đều xanh; lý do duy nhất chưa lên PASS là E25 (AC-15) — judgment item trên hợp đồng T3, luôn chờ human_override trực tiếp tại Gate 2 bất kể đề xuất của panel.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-1 | script | PASS |
| E3 | AC-2 | script | PASS |
| E4 | AC-3 | script | PASS |
| E5 | AC-3 | script | PASS |
| E6 | AC-4 | script | PASS |
| E7 | AC-5 | script | PASS |
| E8 | AC-6 | script | PASS |
| E9 | AC-7 | script | PASS |
| E10 | AC-8 | script | PASS |
| E11 | AC-9 | script | PASS |
| E12 | AC-10 | script | PASS |
| E13 | AC-10 | script | PASS |
| E14 | AC-10 | script | PASS |
| E15 | AC-11 | script | PASS |
| E16 | AC-11 | script | PASS |
| E17 | AC-12 | script | PASS |
| E18 | AC-13 | script | PASS |
| E19 | AC-13 | script | PASS |
| E20 | AC-14 | test | PASS |
| E21 | AC-14 | test | PASS |
| E22 | AC-14 | test | PASS |
| E23 | AC-14 | test | PASS |
| E24 | AC-14 | script | PASS |
| E25 | AC-15 | judgment | PASS (chờ human_override) |

## Evidence

- eval: E1
  run_id: minted-thuoc-co-cua-E1-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.tcc_s4args_not_run
  verified_at: 2026-09-17T15:00:00Z
  output: |
      PASS: NRS4 mot nguon — thay ham cua lib thi ket luan lat

    Results: 4 passed, 0 failed (s4-args-not-run)

- eval: E2
  run_id: minted-thuoc-co-cua-E2-r1
  exit_code: 0
  verifier: config:executors.script.tcc_wf_not_run
  verified_at: 2026-09-17T13:30:21Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E3
  run_id: minted-thuoc-co-cua-E3-r1
  exit_code: 0
  verifier: config:executors.script.tcc_the_ma_da_khai
  verified_at: 2026-09-17T13:30:21Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E4
  run_id: minted-thuoc-co-cua-E4-r1
  exit_code: 0
  verifier: config:executors.script.tcc_bo_qua_do
  verified_at: 2026-09-17T13:30:21Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E5
  run_id: minted-thuoc-co-cua-E5-r1
  exit_code: 0
  verifier: config:executors.script.tcc_bo_qua_im
  verified_at: 2026-09-17T13:30:21Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E6
  run_id: minted-thuoc-co-cua-E6-r1
  exit_code: 0
  verifier: config:executors.script.tcc_bo_qua_suy
  verified_at: 2026-09-17T13:30:21Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E7
  run_id: minted-thuoc-co-cua-E7-r1
  exit_code: 0
  verifier: config:executors.script.tcc_bo_qua_gioi_han
  verified_at: 2026-09-17T13:30:21Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E8
  run_id: minted-thuoc-co-cua-E8-r1
  exit_code: 0
  verifier: config:executors.script.tcc_nen_cong_cu_suite
  verified_at: 2026-09-17T13:30:21Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E9
  run_id: minted-thuoc-co-cua-E9-r1
  exit_code: 0
  verifier: config:executors.script.tcc_nen_luoi_engine
  verified_at: 2026-09-17T13:30:21Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E10
  run_id: minted-thuoc-co-cua-E10-r1
  exit_code: 0
  verifier: config:executors.script.tcc_the_nen
  verified_at: 2026-09-17T13:30:21Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E11
  run_id: minted-thuoc-co-cua-E11-r1
  exit_code: 0
  verifier: config:executors.script.tcc_suite_tuan_tu
  verified_at: 2026-09-17T13:30:21Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E12
  run_id: minted-thuoc-co-cua-E12-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.tcc_phan_loai
  verified_at: 2026-09-17T15:00:00Z
  output: |
      PASS: PL3 mot nguon — bo sinh args nap chinh module: doi module thi vung vat va tep do cua tep args doi theo

    Results: 4 passed, 0 failed (phan-loai)

- eval: E13
  run_id: minted-thuoc-co-cua-E13-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ktl_vung_vat_s4args
  verified_at: 2026-09-17T15:00:00Z
  output: |
    PASS: VV8c gỡ bộ lọc vùng phủ → lib/b.js lọt vào coverageFiles (ca VV8 có răng)

    Results: 19 passed, 0 failed (s4-args-vung-vat)

- eval: E14
  run_id: minted-thuoc-co-cua-E14-r1
  exit_code: 0
  verifier: config:executors.script.ktl_vung_vat_mutants
  verified_at: 2026-09-17T13:30:21Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E15
  run_id: minted-thuoc-co-cua-E15-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.tcc_dem_nhat
  verified_at: 2026-09-17T15:00:00Z
  output: |
    PASS: TV4 dot bien moc san — TV2 do (nhat 2 -> 5)
    PASS: TV7 commit cham ca vat lan tep ca — nhat giu 2, lan 1; dot bien dem moi commit cham thuoc thi nhat 3 (ket luan lat)
    Results: 10 passed, 0 failed (thuoc-vat)

- eval: E16
  run_id: minted-thuoc-co-cua-E16-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.tcc_giua_hai_luot
  verified_at: 2026-09-17T15:00:00Z
  output: |
    PASS: TV9 dong trong dau tep — moc san la commit lat, nhat 3 (cung bo doc frontmatter voi cong)

    Results: 10 passed, 0 failed (thuoc-vat)

- eval: E17
  run_id: minted-thuoc-co-cua-E17-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.tcc_tran_thuoc
  verified_at: 2026-09-17T15:00:00Z
  output: |
    PASS: TT4 dong so «tran thuoc — » chua commit — tran van dong, ma 4, khong tep
    PASS: TT5 chieu im — ba commit ghi run-log va so, ba commit lan: ma 0, co tep args
    Results: 5 passed, 0 failed (s4-args-tran-thuoc)

- eval: E18
  run_id: minted-thuoc-co-cua-E18-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.tcc_the_thuoc_vat
  verified_at: 2026-09-17T15:00:00Z
  output: |
      PASS: GT4 dong bao khong thanh o hoi — routingLine cua ho so da ky giong het: khong dong · co dong · go dong

    Results: 4 passed, 0 failed (gate-card-thuoc-vat)

- eval: E19
  run_id: minted-thuoc-co-cua-E19-r1
  exit_code: 0
  verifier: config:executors.script.tcc_so_target
  verified_at: 2026-09-17T13:30:21Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E20
  run_id: minted-thuoc-co-cua-E20-r1
  exit_code: 0
  verifier: config:executors.test.scripts
  verified_at: 2026-09-17T13:30:21Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E21
  run_id: minted-thuoc-co-cua-E21-r1
  exit_code: 0
  verifier: config:executors.test.hooks
  verified_at: 2026-09-17T13:30:21Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E22
  run_id: minted-thuoc-co-cua-E22-r1
  exit_code: 0
  verifier: config:executors.test.plugins
  verified_at: 2026-09-17T13:30:21Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E23
  run_id: minted-thuoc-co-cua-E23-r1
  exit_code: 0
  verifier: config:executors.test.workflows
  verified_at: 2026-09-17T13:30:21Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E24
  run_id: minted-thuoc-co-cua-E24-r1
  exit_code: 0
  verifier: config:executors.script.product_map
  verified_at: 2026-09-17T13:30:21Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E25
  criterion: AC-15
  judged_by: judge panel (fresh context)
  proposal: PASS
  panel: giữ nguyên từ round 2 — inputs không đổi, không chấm lại; rationale xem round 2
  votes:
    - domain-correctness: PASS (r2)
    - operational-feasibility: PASS (r2)
    - spec-alignment: PASS (r2)
  human_override:        # T3 — mọi judgment item đều chờ người xác nhận trực tiếp ở Gate 2, bất kể đề xuất của panel

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh
  run_id: minted-thuoc-co-cua-SUITE-bash_tests_scripts_run_tests_sh-r3
  exit_code: 0
  verified_at: 2026-09-17T15:00:00Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-thuoc-co-cua-SUITE-bash_tests_hooks_run_tests_sh-r3
  exit_code: 0
  verified_at: 2026-09-17T15:00:00Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-thuoc-co-cua-SUITE-bash_tests_plugins_run_tests_sh_2_1_grep-r3
  exit_code: 0
  verified_at: 2026-09-17T15:00:00Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-thuoc-co-cua-SUITE-bash_tests_workflows_run_tests_sh-r3
  exit_code: 0
  verified_at: 2026-09-17T15:00:00Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-thuoc-co-cua-SUITE-node_scripts_product_map_mjs_root_check-r3
  exit_code: 0
  verified_at: 2026-09-17T15:00:00Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay.

Non-discriminating (pass trên cả HEAD lẫn baseline diffBase — chứng minh harness, không phải feature; cần viết lại để assert hành vi mới hoặc xác nhận là regression-guard có chủ ý): E13, E14, E20, E21, E22, E23, E24. Các lệnh suite xanh-cả-hai-phía là regression-guard bình thường, không liệt kê riêng.

## Variance

none — every multi-run eval is uniform (không eval nào khai runs > 1 trong vòng này).

## Iterations

Round 1: full sweep 24 evals máy/test + E25 (AC-15, judgment); mốc sàn AC-11 (E15/E16) khi đó dùng bộ đọc tự viết thay vì bộ đọc dùng chung của lib — nguy cơ lệch một nguồn. Trả PENDING-JUDGMENT (E25 chờ người).
Round 2: vá thuoc-vat — mốc sàn dùng frontmatterField của lib thay bộ đọc tự viết (S4-r2, AC-11; commit 8742c7f8); judge panel chấm lại E25 (3/3 lens PASS).
Round 3: chạy lại các eval chạm bởi delta (E1, E12, E13, E15–E18 — AC-1, AC-10, AC-11, AC-12, AC-13) sau lượt vá — tất cả xanh; các eval khác và panel E25 carry-forward vì delta không chạm paths của chúng. Verdict PENDING-JUDGMENT (E25 vẫn chờ human_override theo T3).

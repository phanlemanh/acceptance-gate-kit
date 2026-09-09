---
schema_version: 2
feature_slug: gom-duc-ket-2-10-0
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: f95df49afb5638ad7d7a16281aac0fcdd570b325
human_signoff:
---

# Evidence Report: gom-duc-ket-2-10-0

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E5b | AC-5 | script | PASS |
| E6 | AC-6 | test | PASS |
| E7 | AC-7 | test | PASS |
| E8 | AC-8 | test | PASS |
| E8b | AC-8 | script | PASS |
| E9 | AC-9 | test | PASS |
| E9b | AC-9 | test | PASS |
| E10 | AC-10 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-gom-duc-ket-2-10-0-E1-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.gdk_lnt_do
  verified_at: 2026-09-09T14:00:00Z
  output: |
    PASS: [LNT1] lib một nguồn: vị từ 8 giá trị, alias, round-trip khuôn, mutant ba bộ đọc + dấu hiệu bản sao đã chạy
    PASS: [LNT6] bảy văn bản nghi thức chép luật; (iv)(vi) đo quan hệ alias/chỗ đứng; gỡ từng mệnh đề → đỏ đúng tên

- eval: E2
  run_id: minted-gom-duc-ket-2-10-0-E2-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.gdk_c1_nho
  verified_at: 2026-09-09T14:02:00Z
  output: |
      PASS: NO3 — ba bộ đọc + hai đường cắt hội tụ trên 4 fixture; mutant \s*# bị bắt
      PASS: NO4 — 2 helper đọc stdout thẻ đều bỏ ANSI (ma trận toàn phần + chiều đỏ của phép quét)
    lnt-no: OK (NO1, NO2, NO3, NO4)

- eval: E3
  run_id: minted-gom-duc-ket-2-10-0-E3-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.gdk_k1
  verified_at: 2026-09-09T14:04:00Z
  output: |
      PASS: W37 doi chung duong
      PASS: W37 doi chung duong: duong lanh CO goi synthesize
      PASS: W37 doi chung duong verdict khong BLOCKED

- eval: E4
  run_id: minted-gom-duc-ket-2-10-0-E4-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.gdk_k2
  verified_at: 2026-09-09T14:06:00Z
  output: |
      PASS: DT4 — ba mutant (nhánh chờ · cảnh báo approvers · bản chép trôi) đều bị bắt đích danh
      PASS: DT5 — neo P191/P194: GHI THẲNG là neo dương, Enter-xác-nhận là neo âm
    danh-tinh: OK (DT1, DT2, DT3, DT4, DT5)

- eval: E5
  run_id: minted-gom-duc-ket-2-10-0-E5-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.gdk_k3
  verified_at: 2026-09-09T14:08:00Z
  output: |
      PASS: PV5 — L47 đã gỡ; L42m chứng bản sao đã chạy
      PASS: PV6 — thiếu md-section.cjs: không ném, chấm cả tài liệu, nói ra một dòng
    w6-w8-pham-vi: OK (PV1, PV2, PV3, PV4, PV5, PV6)

- eval: E5b
  run_id: minted-gom-duc-ket-2-10-0-E5b-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.gdk_k3_cay_that
  verified_at: 2026-09-09T14:10:00Z
  output: |
    crm | 0 | 9 | 5
    chứng-một-lần: 3/3 cây tiêu thụ có mặt ở dev-root=/Users/manh-macmini/dev
    PASS: CAY-THAT (4 cây)

- eval: E6
  run_id: minted-gom-duc-ket-2-10-0-E6-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.gdk_k4
  verified_at: 2026-09-09T14:12:00Z
  output: |
    PASS: SP6 — SKILL nêu luật paths + đường đọc-cũ + dặn không bắc cầu
    PASS: SP7 — thân block scalar là dữ liệu, không phải lời khai (fail-closed + đối chứng dương)
    stale-paths: OK (SP1, SP2, SP3, SP4, SP5, SP6, SP7)

- eval: E7
  run_id: minted-gom-duc-ket-2-10-0-E7-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.gdk_k5
  verified_at: 2026-09-09T14:14:00Z
  output: |
      PASS: S5D2 — bốn giá trị của SKILL == khuôn config (một nguồn)
      PASS: S5D3 — mutant gỡ khối / đổi mặc định đều bị bắt
    s5-ship-default: OK (S5D1, S5D2, S5D3)

- eval: E8
  run_id: minted-gom-duc-ket-2-10-0-E8-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.gdk_k6
  verified_at: 2026-09-09T14:16:00Z
  output: |
      PASS: LH3 — mốc cùng hạng theo tier khớp số dựng (round · token có cache_create · repin · fix)
      PASS: LH4 — --json == text; mutant xoá section S4 bị bắt (round + token)
    loop-health: OK (LH1, LH2, LH3, LH4)

- eval: E8b
  run_id: minted-gom-duc-ket-2-10-0-E8b-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.gdk_k6_cay_that
  verified_at: 2026-09-09T14:18:00Z
  output: |
    PASS: LH-THAT

- eval: E9
  run_id: minted-gom-duc-ket-2-10-0-E9-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.gdk_k7
  verified_at: 2026-09-09T14:20:00Z
  output: |
      PASS: W38 thieu harm -> luat cu, khong unclassified
      PASS: W38 prompt triage day harm
      PASS: W38 khuon OOC co dong Tac hai

- eval: E9b
  run_id: minted-gom-duc-ket-2-10-0-E9b-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.gdk_k7_the
  verified_at: 2026-09-09T14:22:00Z
  output: |
      PASS: TH3 — file đời cũ: giữ thứ tự viết, không nhãn mới
      PASS: TH4 — ba nơi đánh nhãn theo CÙNG một thứ tự đã sắp
    ooc-tac-hai: OK (TH1, TH2, TH3, TH4)

- eval: E10
  run_id: minted-gom-duc-ket-2-10-0-E10-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.gdk_k8
  verified_at: 2026-09-09T14:24:00Z
  output: |
      PASS: SD2 --no-carry → không khoá deltaFiles (làn conventions đọc trọn diff như cũ)

    Results: 2 passed, 0 failed (s4-args-delta)

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh
  run_id: minted-gom-duc-ket-2-10-0-SUITE-bash_tests_scripts_run_tests_sh-r4
  exit_code: 0
  verified_at: 2026-09-09T14:26:00Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-gom-duc-ket-2-10-0-SUITE-bash_tests_hooks_run_tests_sh-r4
  exit_code: 0
  verified_at: 2026-09-09T14:28:00Z

- cmd: bash tests/plugins/run-tests.sh
  run_id: minted-gom-duc-ket-2-10-0-SUITE-bash_tests_plugins_run_tests_sh-r4
  exit_code: 0
  verified_at: 2026-09-09T14:30:00Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-gom-duc-ket-2-10-0-SUITE-bash_tests_workflows_run_tests_sh-r4
  exit_code: 0
  verified_at: 2026-09-09T14:32:00Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-gom-duc-ket-2-10-0-SUITE-node_scripts_product_map_mjs_root_check-r4
  exit_code: 0
  verified_at: 2026-09-09T14:34:00Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round truoc — baseline khong do lai round nay

none (baseline không đo lại round này — mọi eval carry giá trị "n-a")

## Variance

none — every multi-run eval is uniform

## Iterations

Round 2: E1, E3, E4, E5, E5b, E7, E8, E8b, E9, E9b, E10 PASS trên harness hiện tại — carry-forward sang round 3 (delta không chạm paths của các eval này).
Round 3: chạy lại E2 (lnt-no), E6 (stale-paths) và toàn bộ 5 lệnh suite hồi quy — tất cả PASS (861+67+plugin+51 test + product-map check, exit 0). Review độc lập phát hiện 1 finding HIGH trong hợp đồng (AC-6: `staleScope()` ở `lib/evidence-core.cjs:680` fail-open khi executor có chú thích/trailing comment — không dùng `stripComment` chung nguồn với `lib/eval-yaml.cjs`) — verdict REJECT, quay lại implementation để vá staleScope trước khi verify lại.
Round 4: full re-run toàn bộ 13 eval (E1–E10, E5b, E8b, E9b) + 5 lệnh suite hồi quy (861+67+plugin+workflows test + product-map check) — tất cả PASS, exit 0. Review độc lập scope-triage 11 finding: xác nhận 6 finding TRONG hợp đồng (2 HIGH — K7 tự nâng finding non-high vào hợp đồng làm nó biến mất khỏi cả vòng vá lẫn thẻ Cổng 2 tại `feature-loop/workflows/acceptance-verify.js:886`; bare-directory `paths:` entries không khớp gì nên record âm thầm hết stale tại `scripts/pre-merge-check.sh:525`; 4 medium/low khác cùng lớp «hai bộ đọc trôi khỏi nhau») và 5 finding NGOÀI hợp đồng đưa vào Gate 2. Verdict REJECT — đây là round cuối theo trần T3 (4 vòng, có Gate 1.5); không tự mở round 5, owner cần quyết đường tiếp theo (vá tiếp và xin trần mới, hay ship với known-limits đã ghi).
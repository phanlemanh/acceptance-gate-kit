---
schema_version: 2
feature_slug: gom-duc-ket-2-10-0
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 39a9bcec89c8e12ff3af37664909e985bb071f57
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
  run_id: minted-gom-duc-ket-2-10-0-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.gdk_lnt_do
  verified_at: 2026-09-09T02:00:00Z
  output: |
    PASS: [LNT1] lib một nguồn: vị từ 8 giá trị, alias, round-trip khuôn, mutant ba bộ đọc + dấu hiệu bản sao đã chạy
    PASS: [LNT6] bảy văn bản nghi thức chép luật; (iv)(vi) đo quan hệ alias/chỗ đứng; gỡ từng mệnh đề → đỏ đúng tên

- eval: E2
  run_id: minted-gom-duc-ket-2-10-0-E2-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.gdk_c1_nho
  verified_at: 2026-09-09T02:00:00Z
  output: |
    PASS: NO3 — ba bộ đọc + hai đường cắt hội tụ trên 4 fixture; mutant \s*# bị bắt
    PASS: NO4 — 2 helper đọc stdout thẻ đều bỏ ANSI (ma trận toàn phần + chiều đỏ của phép quét)
    lnt-no: OK (NO1, NO2, NO3, NO4)

- eval: E3
  run_id: minted-gom-duc-ket-2-10-0-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.gdk_k1
  verified_at: 2026-09-09T02:00:00Z
  output: |
      PASS: W37 doi chung duong
      PASS: W37 doi chung duong: duong lanh CO goi synthesize
      PASS: W37 doi chung duong verdict khong BLOCKED

- eval: E4
  run_id: minted-gom-duc-ket-2-10-0-E4-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.gdk_k2
  verified_at: 2026-09-09T02:00:00Z
  output: |
      PASS: DT4 — ba mutant (nhánh chờ · cảnh báo approvers · bản chép trôi) đều bị bắt đích danh
      PASS: DT5 — neo P191/P194: GHI THẲNG là neo dương, Enter-xác-nhận là neo âm
    danh-tinh: OK (DT1, DT2, DT3, DT4, DT5)

- eval: E5
  run_id: minted-gom-duc-ket-2-10-0-E5-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.gdk_k3
  verified_at: 2026-09-09T02:00:00Z
  output: |
      PASS: PV4 — token-lạ im; nghĩa vụ + lạc chỗ vẫn kêu (ba fixture)
      PASS: PV5 — L47 đã gỡ; L42m chứng bản sao đã chạy
    w6-w8-pham-vi: OK (PV1, PV2, PV3, PV4, PV5)

- eval: E5b
  run_id: minted-gom-duc-ket-2-10-0-E5b-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.gdk_k3_cay_that
  verified_at: 2026-09-09T02:00:00Z
  output: |
    oneflow | 0 | 2 | 0
    crm | 0 | 9 | 5
    PASS: CAY-THAT (4 cây)

- eval: E6
  run_id: minted-gom-duc-ket-2-10-0-E6-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.gdk_k4
  verified_at: 2026-09-09T02:00:00Z
  output: |
      PASS: SP5 — pathsOf hai dạng YAML == nhau; staleScope null khi thiếu, bỏ qua judgment
      PASS: SP6 — SKILL nêu luật paths + đường đọc-cũ + dặn không bắc cầu
    stale-paths: OK (SP1, SP2, SP3, SP4, SP5, SP6)

- eval: E7
  run_id: minted-gom-duc-ket-2-10-0-E7-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.gdk_k5
  verified_at: 2026-09-09T02:00:00Z
  output: |
      PASS: S5D2 — bốn giá trị của SKILL == khuôn config (một nguồn)
      PASS: S5D3 — mutant gỡ khối / đổi mặc định đều bị bắt
    s5-ship-default: OK (S5D1, S5D2, S5D3)

- eval: E8
  run_id: minted-gom-duc-ket-2-10-0-E8-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.gdk_k6
  verified_at: 2026-09-09T02:00:00Z
  output: |
      PASS: LH3 — mốc cùng hạng theo tier khớp số dựng (round · token có cache_create · repin · fix)
      PASS: LH4 — --json == text; mutant xoá section S4 bị bắt (round + token)
    loop-health: OK (LH1, LH2, LH3, LH4)

- eval: E8b
  run_id: minted-gom-duc-ket-2-10-0-E8b-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.gdk_k6_cay_that
  verified_at: 2026-09-09T02:00:00Z
  output: |
    PASS: LH-THAT

- eval: E9
  run_id: minted-gom-duc-ket-2-10-0-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.gdk_k7
  verified_at: 2026-09-09T02:00:00Z
  output: |
      PASS: W38 thieu harm -> luat cu, khong unclassified
      PASS: W38 prompt triage day harm
      PASS: W38 khuon OOC co dong Tac hai

- eval: E9b
  run_id: minted-gom-duc-ket-2-10-0-E9b-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.gdk_k7_the
  verified_at: 2026-09-09T02:00:00Z
  output: |
      PASS: TH2 — thẻ xếp behavior → measure → vắng harm
      PASS: TH3 — file đời cũ: giữ thứ tự viết, không nhãn mới
    ooc-tac-hai: OK (TH1, TH2, TH3)

- eval: E10
  run_id: minted-gom-duc-ket-2-10-0-E10-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.gdk_k8
  verified_at: 2026-09-09T02:00:00Z
  output: |
      PASS: SD2 --no-carry → không khoá deltaFiles (làn conventions đọc trọn diff như cũ)

    Results: 2 passed, 0 failed (s4-args-delta)

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh
  run_id: minted-gom-duc-ket-2-10-0-SUITE-bash_tests_scripts_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-09-09T02:00:00Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-gom-duc-ket-2-10-0-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-09-09T02:00:00Z

- cmd: bash tests/plugins/run-tests.sh
  run_id: minted-gom-duc-ket-2-10-0-SUITE-bash_tests_plugins_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-09-09T02:00:00Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-gom-duc-ket-2-10-0-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-09-09T02:00:00Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-gom-duc-ket-2-10-0-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 0
  verified_at: 2026-09-09T02:00:00Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — moi eval feature deu red tren baseline (co phan biet)

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: mọi eval máy + suite đều PASS (13 eval + 5 suite, exit 0, không eval nào baseline-green) nhưng review lane xác nhận 10 phát hiện TRONG HỢP ĐỒNG (4 severity high, 6 medium — xem review-findings.md, ánh xạ AC-1..AC-10) trong đó có ít nhất một lỗ hổng fail-open thật ở lib/evidence-core.cjs (AC-6) và một lệnh cứng-cây-tác-giả tự dựng đường xanh trong chính bộ đo E5b (AC-5) — verdict REJECT, trả về implementation để vá trước vòng verify kế.

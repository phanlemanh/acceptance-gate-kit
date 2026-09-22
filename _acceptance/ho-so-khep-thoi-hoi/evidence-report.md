---
schema_version: 2
feature_slug: ho-so-khep-thoi-hoi
verdict: PASS
failed_evals: []
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 7f29b834176b741efbfdfe416e4c4c35f9bd5e16
human_signoff: Phan Le Manh 2026-09-22
---

# Evidence Report: ho-so-khep-thoi-hoi

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
| E9 | AC-6 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-ho-so-khep-thoi-hoi-E1-r3
  exit_code: 0
  baseline: red
  verifier: config:executors.script.hskt
  verified_at: 2026-09-22T06:16:32Z
  output: |
    PASS: HK-AC9-dot-bien — thẻ suy «đã khép» từ tên ô → tt-thieu: hoi=[]

    Results: 21 passed, 0 failed (hskt)

- eval: E2
  run_id: minted-ho-so-khep-thoi-hoi-E2-r3
  exit_code: 0
  baseline: red
  verifier: config:executors.script.hskt
  verified_at: 2026-09-22T06:16:32Z
  output: |
    PASS: HK-AC9-dot-bien — thẻ suy «đã khép» từ tên ô → tt-thieu: hoi=[]

    Results: 21 passed, 0 failed (hskt)

- eval: E3
  run_id: minted-ho-so-khep-thoi-hoi-E3-r1
  exit_code: 0
  verifier: config:executors.script.hskt_ce
  verified_at: 2026-09-22T02:45:57Z
  carried_from_round: 1
  note: carry-forward từ round 1 — delta không chạm paths của eval

- eval: E4
  run_id: minted-ho-so-khep-thoi-hoi-E4-r3
  exit_code: 0
  baseline: red
  verifier: config:executors.script.hskt
  verified_at: 2026-09-22T06:16:32Z
  output: |
    PASS: HK-AC9-dot-bien — thẻ suy «đã khép» từ tên ô → tt-thieu: hoi=[]

    Results: 21 passed, 0 failed (hskt)

- eval: E5
  run_id: minted-ho-so-khep-thoi-hoi-E5-r3
  exit_code: 0
  baseline: red
  verifier: config:executors.script.hskt
  verified_at: 2026-09-22T06:16:32Z
  output: |
    PASS: HK-AC9-dot-bien — thẻ suy «đã khép» từ tên ô → tt-thieu: hoi=[]

    Results: 21 passed, 0 failed (hskt)

- eval: E6
  run_id: minted-ho-so-khep-thoi-hoi-E6-r3
  exit_code: 0
  baseline: red
  verifier: config:executors.script.hskt
  verified_at: 2026-09-22T06:16:32Z
  output: |
    PASS: HK-AC9-dot-bien — thẻ suy «đã khép» từ tên ô → tt-thieu: hoi=[]

    Results: 21 passed, 0 failed (hskt)

- eval: E7
  run_id: minted-ho-so-khep-thoi-hoi-E7-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.script.hskt_bo_do
  verified_at: 2026-09-22T06:16:32Z
  output: |
    PASS: HK-AC7-dot-bien — gỡ bộ lọc khép: NS-AC9-cu đỏ «… bản sau vòng khác bản trước vòng», L05 đỏ «bản sao TRƯỚC khi tiêm đã có hồ sơ đỏ (release-2-0-0)»

    Results: 1 passed, 0 failed (hskt)

- eval: E8
  run_id: minted-ho-so-khep-thoi-hoi-E8-r3
  exit_code: 0
  baseline: red
  verifier: config:executors.script.hskt
  verified_at: 2026-09-22T06:16:32Z
  output: |
    PASS: HK-AC9-dot-bien — thẻ suy «đã khép» từ tên ô → tt-thieu: hoi=[]

    Results: 21 passed, 0 failed (hskt)

- eval: E9
  run_id: minted-ho-so-khep-thoi-hoi-E9-r3
  exit_code: 0
  baseline: red
  verifier: config:executors.script.hskt
  verified_at: 2026-09-22T06:16:32Z
  output: |
    PASS: HK-AC9-dot-bien — thẻ suy «đã khép» từ tên ô → tt-thieu: hoi=[]

    Results: 21 passed, 0 failed (hskt)

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh
  run_id: minted-ho-so-khep-thoi-hoi-SUITE-bash_tests_scripts_run_tests_sh-r3
  exit_code: 0
  verified_at: 2026-09-22T06:16:32Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-ho-so-khep-thoi-hoi-SUITE-bash_tests_hooks_run_tests_sh-r3
  exit_code: 0
  verified_at: 2026-09-22T06:16:32Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-ho-so-khep-thoi-hoi-SUITE-bash_tests_plugins_run_tests_sh_2_1_grep-r3
  exit_code: 0
  verified_at: 2026-09-22T06:16:32Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-ho-so-khep-thoi-hoi-SUITE-bash_tests_workflows_run_tests_sh-r3
  exit_code: 0
  verified_at: 2026-09-22T06:16:32Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-ho-so-khep-thoi-hoi-SUITE-node_scripts_product_map_mjs_root_check-r3
  exit_code: 0
  verified_at: 2026-09-22T06:16:32Z

## Known limits

## Ngoài hợp đồng

## Analyst

E7 — chạy trên CẢ HEAD lẫn bản baseline (pre-feature, diffBase) đều PASS (baseline: green cho lệnh bó `ntr-trang-thai.test.mjs && lan-status-not-run.test.mjs && hskt.test.mjs HK-AC7-dot-bien`). Eval này hiện không phân biệt được tính năng của vòng này — cần xem lại: hoặc viết lại để assert đúng hành vi mới của round này, hoặc xác nhận có chủ ý đây là regression-guard (bảo vệ hành vi cũ của AC-7 khỏi hồi quy) và giữ nguyên.

## Variance

none — không có eval nào mang field `runs` > 1 trong vòng này.

## Iterations

Round 1: BLOCKED — hộp tìm-lỗi dừng giữa chừng (round-tally: 1/8 blocked); refuter phát hiện `scripts/gate-card.js` dùng riêng một định nghĩa «đã khép» cho vế thực tế, lệch với vị từ `hoSoDaKhep` của bộ quét, mở lỗ fail-open (severity high, đề xuất new-contract).
Round 2: PASS máy trên 7 eval, nhưng owner trả lại ở Gate 2 (`b56b7b33`) vì hai finding HIGH về fail-open của gate-card chưa sửa — nâng phạm vi sửa ngay thay vì known-limits.
Round 3: PASS — `7f29b834` vá gate-card đọc đúng khoá `thucTe` mà bộ quét đã xuất (hỏi khoá đầu ra, không hỏi tên ô); `adec11fb` thêm E9 kiểm hồ sơ `da-cham-boi-thuc-te` vắng hoặc thiếu vế dòng quan sát vẫn được thẻ mời «ký hay trả» đúng thiết kế. Toàn bộ 9 eval (E3 carry-forward từ round 1, không đổi paths) + 5 lệnh suite hồi quy đều xanh.

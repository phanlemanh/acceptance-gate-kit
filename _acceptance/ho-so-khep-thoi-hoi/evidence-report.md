---
schema_version: 2
feature_slug: ho-so-khep-thoi-hoi
verdict: BLOCKED
failed_evals: []
reason: "bash tests/scripts/run-tests.sh — bị công cụ giết ở 600 giây trước khi in dòng tổng kết (timeout); không phải lỗi mã, cần chạy lại với timeout dài hơn"
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 3cc26b162caf49f4952370ce782a7dcddc108f0d
human_signoff:
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

## Evidence

- eval: E1
  run_id: minted-ho-so-khep-thoi-hoi-E1-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.hskt
  verified_at: 2026-09-22T09:00:00+07:00
  output: |
    PASS: HK-AC8-dot-bien — bỏ truyền tệp phát hiện ở từng bên gọi (3) → ca của bên ấy đỏ

    Results: 18 passed, 0 failed (hskt)

- eval: E2
  run_id: minted-ho-so-khep-thoi-hoi-E2-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.hskt
  verified_at: 2026-09-22T09:00:00+07:00
  output: |
    PASS: HK-AC8-dot-bien — bỏ truyền tệp phát hiện ở từng bên gọi (3) → ca của bên ấy đỏ

    Results: 18 passed, 0 failed (hskt)

- eval: E3
  run_id: minted-ho-so-khep-thoi-hoi-E3-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.hskt_ce
  verified_at: 2026-09-22T09:00:00+07:00
  output: |
    PASS: CE5-map lệnh bản đồ chạy trọn trong consumer type:module từ ĐÚNG danh sách chép; gỡ trang-thai-ho-so.cjs → đỏ gọi tên
    PASS: CE6-ooc không còn tham chiếu đuôi cũ .js của lib/out-of-contract trong bộ máy; bản sao khôi phục một require đuôi cũ → đỏ gọi tên
    Results: 16 passed, 0 failed

- eval: E4
  run_id: minted-ho-so-khep-thoi-hoi-E4-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.hskt
  verified_at: 2026-09-22T09:00:00+07:00
  output: |
    PASS: HK-AC8-dot-bien — bỏ truyền tệp phát hiện ở từng bên gọi (3) → ca của bên ấy đỏ

    Results: 18 passed, 0 failed (hskt)

- eval: E5
  run_id: minted-ho-so-khep-thoi-hoi-E5-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.hskt
  verified_at: 2026-09-22T09:00:00+07:00
  output: |
    PASS: HK-AC8-dot-bien — bỏ truyền tệp phát hiện ở từng bên gọi (3) → ca của bên ấy đỏ

    Results: 18 passed, 0 failed (hskt)

- eval: E6
  run_id: minted-ho-so-khep-thoi-hoi-E6-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.hskt
  verified_at: 2026-09-22T09:00:00+07:00
  output: |
    PASS: HK-AC8-dot-bien — bỏ truyền tệp phát hiện ở từng bên gọi (3) → ca của bên ấy đỏ

    Results: 18 passed, 0 failed (hskt)

- eval: E7
  run_id: minted-ho-so-khep-thoi-hoi-E7-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.hskt_bo_do
  verified_at: 2026-09-22T09:00:00+07:00
  output: |
    PASS: HK-AC7-dot-bien — gỡ bộ lọc khép: NS-AC9-cu đỏ «… bản sau vòng khác bản trước vòng», L05 đỏ «bản sao TRƯỚC khi tiêm đã có hồ sơ đỏ (release-2-0-0)»

    Results: 1 passed, 0 failed (hskt)

- eval: E8
  run_id: minted-ho-so-khep-thoi-hoi-E8-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.hskt
  verified_at: 2026-09-22T09:00:00+07:00
  output: |
    PASS: HK-AC8-dot-bien — bỏ truyền tệp phát hiện ở từng bên gọi (3) → ca của bên ấy đỏ

    Results: 18 passed, 0 failed (hskt)

### Lệnh suite (hồi quy)

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-ho-so-khep-thoi-hoi-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-09-22T09:00:00+07:00

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-ho-so-khep-thoi-hoi-SUITE-bash_tests_plugins_run_tests_sh_2_1_grep-r1
  exit_code: 0
  verified_at: 2026-09-22T09:00:00+07:00

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-ho-so-khep-thoi-hoi-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-09-22T09:00:00+07:00

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-ho-so-khep-thoi-hoi-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 0
  verified_at: 2026-09-22T09:00:00+07:00

Lệnh suite KHÔNG hoàn tất trong vòng này (không đưa vào bảng trên vì không có exit sạch để ghi):

- cmd: bash tests/scripts/run-tests.sh
  run_id: minted-ho-so-khep-thoi-hoi-SUITE-bash_tests_scripts_run_tests_sh-r1
  trạng thái: bị công cụ giết ở 600 giây, đầu ra bị cắt TRƯỚC dòng tổng kết "Results: ..."
  đuôi đầu ra quan sát được trước khi bị cắt: |
    UJ10 scaffold bo hoang -> IM LANG (doi chung duong cua nhom tang hinh)
      PASS: UJ10a
      PASS: UJ10b
      PASS: UJ10c
    UJ3 chu ky giu-cho trong commit NGUOI dung nghi thuc -> VAN VIOLATION
      PASS: UJ3ctrl
      PASS: UJ3ctrl2
      PASS: UJ3a
      PASS: UJ3b
    UJ5 KHONG khai approvers -> luoi den bat, MOT dong NOTE cho ca lan chay
  Đây là lý do verdict tổng = BLOCKED (không phải REJECT): công cụ giết tiến trình, không phải một khẳng định sai của bài kiểm thử. Khắc phục: chạy lại đúng lệnh này với timeout dài hơn 600 giây, không cần sửa mã.

## Known limits

## Ngoài hợp đồng

## Analyst

E7 (cmd: `bash -c '{ node tests/scripts/ntr-trang-thai.test.mjs && node tests/scripts/lan-status-not-run.test.mjs && node tests/scripts/hskt.test.mjs HK-AC7-dot-bien; }'`) — baseline: green, tức PASS trên cả HEAD lẫn diffBase, không phân biệt được feature này với code cũ. Nguyên nhân (xem thêm finding t9 trong review-findings.md): NS-AC9-cu so hai mốc lịch sử đã đóng băng (`git archive` của sha trước vòng và của `verified_commit` đã ký ở hồ sơ nhan-trang-thai-va-reality), không chạy scripts/start-scan.mjs hay scripts/product-map.mjs hiện tại của cây đang kiểm. Theo đúng chữ AC-7 (so "bản trước vòng" với "verified_commit của hồ sơ nhan-trang-thai-va-reality"), đây là regression-guard có chủ ý trên dữ liệu lịch sử, không phải lỗi đo — nhưng người cần xác nhận việc này không thay thế một ca chạm mã nguồn hiện tại.

## Variance

none — không có eval nào khai `runs` > 1 trong vòng này (không có eval ngẫu nhiên/stochastic).

## Iterations

Round 1: 8/8 eval tiêu chí (E1–E8) đạt PASS, bốn lệnh suite hồi quy (hooks, plugins, workflows, product-map) đạt exit 0; riêng `bash tests/scripts/run-tests.sh` bị công cụ giết ở 600 giây trước khi in dòng tổng kết → verdict tổng = BLOCKED. Không có lỗi mã được xác nhận; việc cần làm là chạy lại đúng lệnh đó với timeout dài hơn.

---
schema_version: 2
feature_slug: co-qua-timebox-nhom-da-xong
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 36d8adc5f856a007b20dc19fdcc2dd425338bdfc
human_signoff:
---

# Evidence Report: co-qua-timebox-nhom-da-xong

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-co-qua-timebox-nhom-da-xong-E1-r1
  exit_code: 0
  verifier: config:executors.script.cqt_rt13
  verified_at: 2026-09-06T04:20:31Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E2
  run_id: minted-co-qua-timebox-nhom-da-xong-E2-r1
  exit_code: 0
  verifier: config:executors.script.cqt_rt13
  verified_at: 2026-09-06T04:20:31Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E3
  run_id: minted-co-qua-timebox-nhom-da-xong-E3-r1
  exit_code: 0
  verifier: config:executors.script.cqt_rt13
  verified_at: 2026-09-06T04:20:31Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E4
  run_id: minted-co-qua-timebox-nhom-da-xong-E4-r1
  exit_code: 0
  verifier: config:executors.test.plugins
  verified_at: 2026-09-06T04:20:31Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E5
  run_id: minted-co-qua-timebox-nhom-da-xong-E5-r1
  exit_code: 0
  verifier: config:executors.script.cqt_rt13
  verified_at: 2026-09-06T04:20:31Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E6
  run_id: minted-co-qua-timebox-nhom-da-xong-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cqt_o_khong_doi
  verified_at: 2026-09-06T06:15:00Z
  output: |
    PASS: [RT13] đọc-cũ: broken rỗng, khác biệt đúng khối; cờ ⇔ điều kiện (đúng mọi ngày chạy);
    23 file chứa "signed-off" đều có ca thật hoặc khai gạch; hai chiều đỏ tiêm vào đầu vào của
    chính phép so · iii: 3 hồ sơ quá hạn trên cây thật (lenh-in-ra-phai-bam-duoc,
    nhanh-chinh-khong-ten-main, baseline-127-tin-hieu-phan-biet) · iii-b: 7 fixture —
    park quá hạn ✓ · park chưa hạn ✗ · kill quá hạn ✓ · archived quá hạn ✓ · archived chưa hạn ✗ ·
    release quá hạn ✓ · release chưa hạn ✗ · mutant ×3 bắt: pk-qua · ar-qua · rl-qua
    PRODUCT-MAP.md khớp hồ sơ xưởng.

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh
  run_id: minted-co-qua-timebox-nhom-da-xong-SUITE-bash_tests_scripts_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-09-06T06:15:00Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-co-qua-timebox-nhom-da-xong-SUITE-bash_tests_hooks_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-09-06T06:15:00Z

- cmd: bash tests/plugins/run-tests.sh
  run_id: minted-co-qua-timebox-nhom-da-xong-SUITE-bash_tests_plugins_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-09-06T06:15:00Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-co-qua-timebox-nhom-da-xong-SUITE-bash_tests_workflows_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-09-06T06:15:00Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-co-qua-timebox-nhom-da-xong-SUITE-node_scripts_product_map_mjs_root_check-r2
  exit_code: 0
  verified_at: 2026-09-06T06:15:00Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay

none — every feature eval is red on baseline (discriminates)

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: Toàn bộ E1-E6 PASS trên máy, nhưng review sau đó phát hiện bằng chứng E6 (AC-6) không xác thực — verifier đã tự chuẩn hoá lệnh `cqt_o_khong_doi` thay vì chạy nguyên văn cmd do s4-args sinh, nên màu xanh chưa từng đi qua đường args-máy thật; trả lại implementation để sửa cách escape trong `_acceptance/config.yaml`.
Round 2: Suite + E6 chạy lại xanh trên bề mặt (bảng trên), nhưng cùng lỗi escape `\"` trong `_acceptance/config.yaml` (khóa `cqt_o_khong_doi`) khiến lệnh không bao giờ thoát 0 khi đi qua bộ giải config thật của kit (`resolveConfigKey` chỉ bóc cặp nháy ngoài, không unescape `\"`), nên bằng chứng AC-6 vẫn chưa tái lập được từ đúng verifier đã khai; verdict giữ REJECT, chờ sửa config.yaml (bỏ escape lồng hoặc đổi sang `git diff --quiet`) rồi verify lại nguyên văn qua s4-args.
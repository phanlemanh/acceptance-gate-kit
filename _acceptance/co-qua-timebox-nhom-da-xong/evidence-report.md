---
schema_version: 2
feature_slug: co-qua-timebox-nhom-da-xong
verdict: PASS
failed_evals: []
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 1868ad16f19f7e9c323fc13d48cb56839f5c004d
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
  baseline: red
  verifier: config:executors.script.cqt_rt13
  verified_at: 2026-09-06T10:00:00+07:00
  output: |
    PASS: [RT13] đọc-cũ: broken rỗng, khác biệt đúng khối; cờ ⇔ điều kiện (đúng mọi ngày chạy); 23 file chứa "signed-off" đều có ca thật hoặc khai gạch; hai chiều đỏ tiêm vào đầu vào của chính phép so · iii: 3 hồ sơ quá hạn trên cây thật (lenh-in-ra-phai-bam-duoc, nhanh-chinh-khong-ten-main, baseline-127-tin-hieu-phan-biet) · iii-b: 7 fixture — park quá hạn ✓ · park chưa hạn ✗ · kill quá hạn ✓ · archived quá hạn ✓ · archived chưa hạn ✗ · release quá hạn ✓ · release chưa hạn ✗ · mutant ×3 bắt: pk-qua · ar-qua · rl-qua

- eval: E2
  run_id: minted-co-qua-timebox-nhom-da-xong-E2-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.cqt_rt13
  verified_at: 2026-09-06T10:00:00+07:00
  output: |
    PASS: [RT13] đọc-cũ: broken rỗng, khác biệt đúng khối; cờ ⇔ điều kiện (đúng mọi ngày chạy); 23 file chứa "signed-off" đều có ca thật hoặc khai gạch; hai chiều đỏ tiêm vào đầu vào của chính phép so · iii: 3 hồ sơ quá hạn trên cây thật (lenh-in-ra-phai-bam-duoc, nhanh-chinh-khong-ten-main, baseline-127-tin-hieu-phan-biet) · iii-b: 7 fixture — park quá hạn ✓ · park chưa hạn ✗ · kill quá hạn ✓ · archived quá hạn ✓ · archived chưa hạn ✗ · release quá hạn ✓ · release chưa hạn ✗ · mutant ×3 bắt: pk-qua · ar-qua · rl-qua

- eval: E3
  run_id: minted-co-qua-timebox-nhom-da-xong-E3-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.cqt_rt13
  verified_at: 2026-09-06T10:00:00+07:00
  output: |
    PASS: [RT13] đọc-cũ: broken rỗng, khác biệt đúng khối; cờ ⇔ điều kiện (đúng mọi ngày chạy); 23 file chứa "signed-off" đều có ca thật hoặc khai gạch; hai chiều đỏ tiêm vào đầu vào của chính phép so · iii: 3 hồ sơ quá hạn trên cây thật (lenh-in-ra-phai-bam-duoc, nhanh-chinh-khong-ten-main, baseline-127-tin-hieu-phan-biet) · iii-b: 7 fixture — park quá hạn ✓ · park chưa hạn ✗ · kill quá hạn ✓ · archived quá hạn ✓ · archived chưa hạn ✗ · release quá hạn ✓ · release chưa hạn ✗ · mutant ×3 bắt: pk-qua · ar-qua · rl-qua

- eval: E4
  run_id: minted-co-qua-timebox-nhom-da-xong-E4-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.test.plugins
  verified_at: 2026-09-06T10:00:00+07:00
  output: |
    PASS: P201 ngan khong-sua co ten + duong doc-cu + mutant

    Results: all plugin tests passed

- eval: E5
  run_id: minted-co-qua-timebox-nhom-da-xong-E5-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.cqt_rt13
  verified_at: 2026-09-06T10:00:00+07:00
  output: |
    PASS: [RT13] đọc-cũ: broken rỗng, khác biệt đúng khối; cờ ⇔ điều kiện (đúng mọi ngày chạy); 23 file chứa "signed-off" đều có ca thật hoặc khai gạch; hai chiều đỏ tiêm vào đầu vào của chính phép so · iii: 3 hồ sơ quá hạn trên cây thật (lenh-in-ra-phai-bam-duoc, nhanh-chinh-khong-ten-main, baseline-127-tin-hieu-phan-biet) · iii-b: 7 fixture — park quá hạn ✓ · park chưa hạn ✗ · kill quá hạn ✓ · archived quá hạn ✓ · archived chưa hạn ✗ · release quá hạn ✓ · release chưa hạn ✗ · mutant ×3 bắt: pk-qua · ar-qua · rl-qua

- eval: E6
  run_id: minted-co-qua-timebox-nhom-da-xong-E6-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.cqt_o_khong_doi
  verified_at: 2026-09-06T10:00:00+07:00
  output: |
    PASS: [RT13] đọc-cũ: broken rỗng, khác biệt đúng khối; cờ ⇔ điều kiện (đúng mọi ngày chạy); 23 file chứa "signed-off" đều có ca thật hoặc khai gạch; hai chiều đỏ tiêm vào đầu vào của chính phép so · iii: 3 hồ sơ quá hạn trên cây thật (lenh-in-ra-phai-bam-duoc, nhanh-chinh-khong-ten-main, baseline-127-tin-hieu-phan-biet) · iii-b: 7 fixture — park quá hạn ✓ · park chưa hạn ✗ · kill quá hạn ✓ · archived quá hạn ✓ · archived chưa hạn ✗ · release quá hạn ✓ · release chưa hạn ✗ · mutant ×3 bắt: pk-qua · ar-qua · rl-qua
    PRODUCT-MAP.md khớp hồ sơ xưởng.

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh
  run_id: minted-co-qua-timebox-nhom-da-xong-SUITE-bash_tests_scripts_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-09-06T10:00:00+07:00

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-co-qua-timebox-nhom-da-xong-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-09-06T10:00:00+07:00

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-co-qua-timebox-nhom-da-xong-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-09-06T10:00:00+07:00

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-co-qua-timebox-nhom-da-xong-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 0
  verified_at: 2026-09-06T10:00:00+07:00

## Known limits

## Ngoài hợp đồng

## Analyst

none — moi eval feature deu red tren baseline (co phan biet)

## Variance

none — không có eval nào chạy nhiều lần (mọi eval đều runs=1, deterministic)

## Iterations

Round 1: E1–E6 (script/test) và 4 lệnh suite hồi quy đều PASS ngay từ lần chạy đầu tiên — không có vòng quay lại implementation.

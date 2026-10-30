---
schema_version: 2
feature_slug: release-2-36-0
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 33cb0e70d6507d86e425b8e50a2ccad17be01792
human_signoff:
---

# Evidence Report: release-2-36-0

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E3f | AC-3 | test | PASS |
| E3g | AC-3 | test | PASS |
| E3h | AC-3 | test | PASS |
| E3b | AC-3 | test | PASS |
| E3c | AC-3 | test | PASS |
| E3i | AC-3 | test | PASS |
| E3j | AC-3 | test | PASS |
| E3d | AC-3 | test | PASS |
| E3k | AC-3 | test | PASS |
| E3e | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | test | PASS |
| E7 | AC-7 | script | PASS |
| E8 | AC-8 | script | PASS |
| E9 | AC-9 | judgment | PASS |
| E10 | AC-10 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-release-2-36-0-E1-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-30T17:36:57Z
  output: |
    Results: all plugin tests passed

- eval: E2
  run_id: minted-release-2-36-0-E2-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-30T17:36:57Z
  output: |
    Results: all plugin tests passed

- eval: E3
  run_id: minted-release-2-36-0-E3-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts_bash
  verified_at: 2026-10-30T17:36:57Z
  output: |
    Results: 841 passed, 0 failed

- eval: E3f
  run_id: minted-release-2-36-0-E3f-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_1
  verified_at: 2026-10-30T17:36:57Z
  output: |
    Results: 40 passed, 0 failed

- eval: E3g
  run_id: minted-release-2-36-0-E3g-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_2
  verified_at: 2026-10-30T17:36:57Z
  output: |
    Results: 39 passed, 0 failed

- eval: E3h
  run_id: minted-release-2-36-0-E3h-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_3
  verified_at: 2026-10-30T17:36:57Z
  output: |
    Results: 39 passed, 0 failed

- eval: E3b
  run_id: minted-release-2-36-0-E3b-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.hooks
  verified_at: 2026-10-30T17:36:57Z
  output: |
    Results: 71 passed, 0 failed

- eval: E3c
  run_id: minted-release-2-36-0-E3c-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins_vung_1
  verified_at: 2026-10-30T17:36:57Z
  output: |
    Results: all plugin tests passed

- eval: E3i
  run_id: minted-release-2-36-0-E3i-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins_vung_2
  verified_at: 2026-10-30T17:36:57Z
  output: |
    Results: all plugin tests passed

- eval: E3j
  run_id: minted-release-2-36-0-E3j-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-30T17:36:57Z
  output: |
    Results: all plugin tests passed

- eval: E3d
  run_id: minted-release-2-36-0-E3d-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-10-30T17:36:57Z
  output: |
    Results: all workflow tests passed

- eval: E3k
  run_id: minted-release-2-36-0-E3k-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi
  verified_at: 2026-10-30T17:36:57Z
  output: |
    ok 69 - DP1-01 cai-la-du|ok 70 - DP1-01-do doi-ten-tep|ok 71 - DP1-01-do dao-lenh|ok 72 - DP1-02 chieu-im|ok 73 - DP1-02 ngoai-git|    ok 1 - DP1-02-duong chan-s4|    ok 2 - DP1-02-duong nhip|    ok 3 - DP1-02-duong cho-nguoi

- eval: E3e
  run_id: minted-release-2-36-0-E3e-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.product_map
  verified_at: 2026-10-30T17:36:57Z
  output: |
    LO-TRINH.html khớp tệp ý định và hồ sơ.

- eval: E4
  run_id: minted-release-2-36-0-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel2360_cua_so
  verified_at: 2026-10-30T17:36:57Z
  output: |
    XANH: hai tập bằng nhau

- eval: E5
  run_id: minted-release-2-36-0-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel2360_dd_giu
  verified_at: 2026-10-30T17:36:57Z
  output: |
    moc:   "version": "2.7.1", | HEAD:   "version": "2.7.1",

- eval: E6
  run_id: minted-release-2-36-0-E6-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-30T17:36:57Z
  output: |
    Results: all plugin tests passed

- eval: E7
  run_id: minted-release-2-36-0-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel2360_goi_doi
  verified_at: 2026-10-30T17:36:57Z
  output: |
    goi chi doi so: road-map/.claude-plugin/plugin.json tri-thuc/.claude-plugin/plugin.json

- eval: E8
  run_id: minted-release-2-36-0-E8-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel2360_lop_chep
  verified_at: 2026-10-30T17:36:57Z
  output: |
    XANH: đúng 3 tệp đổi như ghi chú 2.36.0 kể

- eval: E10
  run_id: minted-release-2-36-0-E10-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.kiem_ban_cai_moc
  verified_at: 2026-10-30T17:36:57Z
  output: |
    [kiem-ban-cai] TỔNG KẾT: ĐẠT 8/8 — v2.35.0 (979620ae) cài đúng tag

### Judgment

Panel đề xuất cho E9: PASS (ba thấu kính, cả ba cùng PASS). Chưa có người chốt; dòng human_override để trống.

- eval: E9
  judged_by: judge-subagent (fresh context)
  verdict: PASS
  rationale: Đề xuất PASS. Cả năm vế (sáu mục con khớp hợp đồng; khối GITATTR-TEP-SINH; phần xin/hang và hồ sơ T1; lớp chép CI; hai đoạn «Vì sao» và «Ai bị ảnh hưởng» cùng căn cứ chọn minor) khớp nguồn.
  votes:
    - domain-correctness: PASS — Dòng «Gốc:», dòng «Vật:» và các câu trích giới hạn của sáu hồ sơ khớp chữ; số mục chọn khớp Notes (TC1 5 và 11, TC2 1, TC3 3, TC4 15, TC5 2, TC6 12). Khối GITATTR-TEP-SINH khớp GUIDE và hợp đồng tep-sinh-khong-chan-gop. Phần xin/hang và hồ sơ T1 khớp dieu-phoi/README.md. Lớp chép CI khớp nhãn trong INIT-CI-COPY-LIST. Hai đoạn «Vì sao» và «Ai bị ảnh hưởng» nêu đủ bốn đổi hành vi, căn cứ chọn minor khớp «Vì sao» của 2.35.0 (minor cho bề mặt mới) và 2.33.1 (khai thẳng chỗ lệch nếp).
    - operational-feasibility: PASS — Gốc, Vật và các câu giới hạn trích của sáu mục con là chữ của hợp đồng; các số khớp Notes. Khối GITATTR-TEP-SINH khớp GUIDE và hợp đồng. Thứ tự nguồn slug, lối từ chối, hang them, hang chay-lai và hồ sơ T1 khớp dieu-phoi/README.md. Lớp chép CI khớp nhãn only-if-declared lo_trinh trong INIT-CI-COPY-LIST. Bốn đổi hành vi chạm kho đang dùng được khai thẳng, căn cứ chọn minor khớp «Vì sao» của 2.35.0 và 2.33.1.
    - spec-alignment: PASS — Sáu mục con đối chiếu từng hợp đồng: dòng Gốc, gạch Vật, các câu trích và số mục chọn khớp Notes. Khối GITATTR-TEP-SINH, driver và thư mục rỗng khớp GUIDE và hợp đồng tep-sinh-khong-chan-gop. Thứ tự slug của xin s4, lối từ chối, hang them, hang chay-lai và hồ sơ T1 khớp dieu-phoi/README. Lớp chép CI khớp nhãn trong INIT-CI-COPY-LIST. «Vì sao» và «Ai bị ảnh hưởng» nêu đủ bốn đổi hành vi, căn cứ chọn minor khớp 2.35.0 và 2.33.1.
  human_override:  # chi nguoi ghi

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không phân biệt (xanh trên cả HEAD lẫn baseline, chứng minh harness chứ không chứng minh feature; đây là bảo vệ hồi quy có chủ ý, chiều đỏ sống trong ca P200 và các ca của suite scripts):
- E1, E2, E3j, E6 (lệnh: plugins --manh vung:3)
- E3 (lệnh: scripts --manh bash)

Baseline khong do:
- bash tests/scripts/run-tests.sh --manh mjs:1/3: baseline vuot tran 180 giay/lenh — da dung ca cay tien trinh; BLOCKED ha tang, khong phai ket qua cua code cu
- bash tests/scripts/run-tests.sh --manh mjs:2/3: baseline vuot tran 35 giay/lenh — da dung ca cay tien trinh; BLOCKED ha tang, khong phai ket qua cua code cu
- bash tests/scripts/run-tests.sh --manh mjs:3/3: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash tests/hooks/run-tests.sh: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40': het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40': het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash tests/workflows/run-tests.sh: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash -c 'set -o pipefail; node --test --test-reporter=tap "tests/dieu-phoi/**/*.test.mjs" 2>&1 | grep -E "^ *(not )?ok [0-9]+ - DP1-|^ *not ok|^# (pass|fail|skipped|todo) " | paste -sd"|" -': het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- node scripts/product-map.mjs --root . --check: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- GIT_GLOB_PATHSPECS=1 bash scripts/rel-cua-so.sh 979620ae danh-thuc-doc-nhip-dung-ma cong-cu-xet-tep-ton-tai kiem-ban-cai-loi-sua-chay-duoc lenh-dot-ghi-dung-hang doi-chung-chay-duoc tep-sinh-khong-chan-gop: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash -c 'c=$(git show 979620ae:diagram-design/.claude-plugin/plugin.json | grep -m1 "version"); m=$(grep -m1 "version" diagram-design/.claude-plugin/plugin.json); echo "moc: $c | HEAD: $m"; git diff --quiet 979620ae HEAD -- diagram-design && [ "$c" = "$m" ]': het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash -c 'd=$(git diff --name-only 979620ae HEAD -- road-map tri-thuc | tr "\n" " "); echo "goi chi doi so: $d"; [ "$d" = "road-map/.claude-plugin/plugin.json tri-thuc/.claude-plugin/plugin.json " ]': het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash _acceptance/release-2-29-0/lop-chep-doi.sh 979620ae 2.36.0: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: REJECT — E3h đỏ vì hai ca phụ thuộc môi trường (XD-6 thời điểm EPIPE · GM-6-that bản ghi tự sinh), không chạm vật mốc. Trả về sửa.
Round 2: PASS — đo giờ máy bỏ lời nhắn tự sinh khỏi token, thêm ca hai chiều GM-6-do5; toàn bộ eval máy xanh trên commit 33cb0e70.

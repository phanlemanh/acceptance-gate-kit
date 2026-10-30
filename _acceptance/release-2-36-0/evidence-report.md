---
schema_version: 2
feature_slug: release-2-36-0
verdict: REJECT
failed_evals: ["E3h"]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: ce98e38b28b2a2f2ca64de5924e8f6ca09e8f2f6
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
| E3h | AC-3 | test | FAIL |
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
| E9 | AC-9 | judgment | PASS (đề xuất của hội đồng, chờ người) |
| E10 | AC-10 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-release-2-36-0-E1-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-30T15:39:42Z
  output: |
    Results: all plugin tests passed

- eval: E2
  run_id: minted-release-2-36-0-E2-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-30T15:39:42Z
  output: |
    Results: all plugin tests passed

- eval: E3
  run_id: minted-release-2-36-0-E3-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts_bash
  verified_at: 2026-10-30T15:39:42Z
  output: |
    Results: 841 passed, 0 failed

- eval: E3f
  run_id: minted-release-2-36-0-E3f-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_1
  verified_at: 2026-10-30T15:39:42Z
  output: |
    Results: 40 passed, 0 failed

- eval: E3g
  run_id: minted-release-2-36-0-E3g-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_2
  verified_at: 2026-10-30T15:39:42Z
  output: |
    mảnh mjs:2/3 chạy xong, không ca nào đỏ

- eval: E3h
  run_id: minted-release-2-36-0-E3h-r1
  exit_code: 1
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_3
  verified_at: 2026-10-30T15:39:42Z
  output: |
    PASS: XD-5 đầu ra nhỏ (5 đường + 3 hồ sơ thật × 2 cổng) không đổi byte nào
    FAIL: XD-6 người đọc đóng sớm — mã 0, không EPIPE; khuôn exitCode thì sập
      chiều đỏ không đỏ: bản sao exitCode → mã 1, stderr tiến trình con KHÔNG có EPIPE
    PASS: XD-7 repin-lane làn ghim lại đỏ > 64 KB qua pipe
    xuat-du-qua-pipe: 6 PASS · 1 FAIL · 0 KHÔNG ĐO ĐƯỢC ở nền này
    Results: 37 passed, 2 failed

- eval: E3b
  run_id: minted-release-2-36-0-E3b-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.hooks
  verified_at: 2026-10-30T15:39:42Z
  output: |
    Results: 71 passed, 0 failed

- eval: E3c
  run_id: minted-release-2-36-0-E3c-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins_vung_1
  verified_at: 2026-10-30T15:39:42Z
  output: |
    Results: all plugin tests passed

- eval: E3i
  run_id: r1-l8-1-20261030153942
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins_vung_2
  verified_at: 2026-10-30T15:39:42Z
  output: |
    Results: all plugin tests passed

- eval: E3j
  run_id: minted-release-2-36-0-E3j-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-30T15:39:42Z
  output: |
    Results: all plugin tests passed

- eval: E3d
  run_id: minted-release-2-36-0-E3d-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-10-30T15:39:42Z
  output: |
    Results: all workflow tests passed

- eval: E3k
  run_id: minted-release-2-36-0-E3k-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi
  verified_at: 2026-10-30T15:39:42Z
  output: |
    ok 69 - DP1-01 cai-la-du|ok 70 - DP1-01-do doi-ten-tep|ok 71 - DP1-01-do dao-lenh|ok 72 - DP1-02 chieu-im|ok 73 - DP1-02 ngoai-git

- eval: E3e
  run_id: minted-release-2-36-0-E3e-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.product_map
  verified_at: 2026-10-30T15:39:42Z
  output: |
    LO-TRINH.html khớp tệp ý định và hồ sơ.

- eval: E4
  run_id: minted-release-2-36-0-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel2360_cua_so
  verified_at: 2026-10-30T15:39:42Z
  output: |
    XANH: hai tập bằng nhau

- eval: E5
  run_id: minted-release-2-36-0-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel2360_dd_giu
  verified_at: 2026-10-30T15:39:42Z
  output: |
    moc:   "version": "2.7.1", | HEAD:   "version": "2.7.1",

- eval: E6
  run_id: minted-release-2-36-0-E6-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-30T15:39:42Z
  output: |
    Results: all plugin tests passed

- eval: E7
  run_id: minted-release-2-36-0-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel2360_goi_doi
  verified_at: 2026-10-30T15:39:42Z
  output: |
    goi chi doi so: road-map/.claude-plugin/plugin.json tri-thuc/.claude-plugin/plugin.json

- eval: E8
  run_id: minted-release-2-36-0-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel2360_lop_chep
  verified_at: 2026-10-30T15:39:42Z
  output: |
    XANH: đúng 3 tệp đổi như ghi chú 2.36.0 kể

- eval: E10
  run_id: minted-release-2-36-0-E10-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.kiem_ban_cai_moc
  verified_at: 2026-10-30T15:39:42Z
  output: |
    [kiem-ban-cai] TỔNG KẾT: ĐẠT 8/8 — v2.35.0 (979620ae) cài đúng tag

### Hội đồng chấm E9 (AC-9, judgment)

- eval: E9
  judged_by: hội đồng 3 góc nhìn (fresh context) — đề xuất PASS
  human_override:  # chi nguoi ghi

  - domain-correctness: PASS — Đối chiếu từng vế với nguồn trong danh sách thì cả năm vế đều khớp. (0) Dòng «Gốc:», gạch «Vật:» và các trích «» ở sáu mục con chép đúng chữ Context, dòng feature và Notes của sáu hợp đồng. Số mục chọn ở Cổng Bằng chứng khớp Notes: TC1 là 5 + 11, TC2 là 1, TC3 là 3, TC4 là 15, TC5 là 2, TC6 là 12. (1) Khối `GITATTR-TEP-SINH` khớp GUIDE.md và hợp đồng tep-sinh-khong-chan-gop. (2) Thứ tự nguồn slug của `xin`, lối từ chối khi hai hồ sơ cùng bậc, `hang them`, `hang chay-lai` và hồ sơ T1 khớp dieu-phoi/README.md. (3) Lớp chép CI khớp nhãn trong INIT-CI-COPY-LIST: `workspace-record.cjs` và `product-map.mjs` không nhãn, `lo-trinh.mjs` có `[only-if-declared: lo_trinh]`. (4) «Vì sao 2.36.0» và «Ai bị ảnh hưởng» nêu đủ bốn đổi hành vi. Căn cứ chọn minor khớp «Vì sao 2.35.0» (bề mặt mới, không gãy đường đọc-cũ) và «Vì sao 2.33.1» (khai thẳng chỗ lệch nếp).
  - operational-feasibility: PASS — Cả năm vế khớp nguồn. (0) Câu giao, dòng «Gốc:», gạch «Vật:» và các giới hạn trích trong ngoặc khớp chữ Context, dòng feature và Notes của sáu hợp đồng. Số mục đã khai khớp Notes: TC1 5+11, TC2 1, TC3 3, TC4 15, TC5 2, TC6 12. (1) Khối GITATTR-TEP-SINH khớp GUIDE và hợp đồng tep-sinh-khong-chan-gop. (2) Mục `xin`, `hang them`, `hang chay-lai` và hồ sơ T1 khớp dieu-phoi/README.md. (3) Lớp chép CI khớp nhãn `[only-if-declared: lo_trinh]` trong INIT-CI-COPY-LIST, và hai tệp luôn chép lại không mang nhãn. (4) Bốn đổi hành vi được nói thẳng, và căn cứ chọn minor khớp các đoạn «Vì sao» của 2.35.0 và 2.33.1.
  - spec-alignment: PASS — Cả năm vế đều khớp nguồn. (0) Các dòng «Gốc:», gạch «Vật:» (dòng feature) và giới hạn trích khớp từng chữ với sáu hợp đồng, và các số khớp Notes: TC1 5+11, TC2 1, TC3 3, TC4 15, TC5 2, TC6 12 mục. (1) Khối `GITATTR-TEP-SINH` khớp GUIDE và hợp đồng `tep-sinh-khong-chan-gop`. (2) Thứ tự nguồn slug của `xin`, lối từ chối, `hang them`, `hang chay-lai` và hồ sơ T1 khớp `dieu-phoi/README.md`. (3) Lớp chép CI khớp nhãn `[only-if-declared: lo_trinh]` trong khối INIT-CI-COPY-LIST. (4) «Vì sao 2.36.0» và «Ai bị ảnh hưởng» nói đủ bốn đổi hành vi, và căn cứ chọn minor khớp «Vì sao 2.35.0» và «Vì sao 2.33.1». Hai chỗ lệch nhỏ không đủ để chấm trượt: Vật của TC1 thêm chi tiết lấy từ tiêu chí của chính hợp đồng ấy, và giới hạn của TC3 bỏ mệnh đề cuối về `.DS_Store` khi trích.

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không phân biệt (xanh cả trên bản mốc cũ lẫn HEAD — chứng minh khung chạy chứ không phải tính năng; cần viết lại để khẳng định hành vi mới hoặc xác nhận là lưới hồi quy có chủ ý):

- E1, E2, E3j, E6 (cùng lệnh vùng 3 của suite plugins; chiều đỏ sống trong ca P200 bằng đột biến riêng của nó, nên giữ như lưới hồi quy có chủ ý)
- E3 (mảnh bash của suite scripts)

Baseline khong do:

- bash tests/scripts/run-tests.sh --manh mjs:1/3: baseline vuot tran 180 giay/lenh — da dung ca cay tien trinh; BLOCKED ha tang, khong phai ket qua cua code cu
- bash tests/scripts/run-tests.sh --manh mjs:2/3: baseline vuot tran 15 giay/lenh — da dung ca cay tien trinh; BLOCKED ha tang, khong phai ket qua cua code cu
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

Round 1: E3h failed — ca XD-6 của xuat-du-qua-pipe (người đọc đóng sớm) không đỏ ở chiều đỏ: bản sao khuôn exitCode thoát mã 1 nhưng stderr tiến trình con không có EPIPE, nên ca đòi EPIPE không dựng được. Returned to implementation.

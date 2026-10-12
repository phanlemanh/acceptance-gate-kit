---
schema_version: 2
feature_slug: release-2-28-0
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 90b515e2c4affefcc21f4b251e20f1be486d780c
human_signoff: Manh Phan 2026-10-13
---

# Evidence Report: release-2-28-0

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
| E3e | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | test | PASS |
| E7 | AC-7 | test | PASS |
| E8 | AC-8 | script | PASS |
| E9 | AC-9 | judgment | PASS |

## Evidence

- eval: E1
  run_id: minted-release-2-28-0-E1-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-12T19:02:13Z
  output: |
    Results: all plugin tests passed

- eval: E2
  run_id: minted-release-2-28-0-E2-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-12T19:02:13Z
  output: |
    Results: all plugin tests passed

- eval: E3
  run_id: minted-release-2-28-0-E3-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts_bash
  verified_at: 2026-10-12T19:02:13Z
  output: |
    Results: 838 passed, 0 failed

- eval: E3f
  run_id: minted-release-2-28-0-E3f-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts_mjs_1
  verified_at: 2026-10-12T19:02:13Z
  output: |
    Results: 30 passed, 0 failed

- eval: E3g
  run_id: minted-release-2-28-0-E3g-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_2
  verified_at: 2026-10-12T19:02:13Z
  output: |
    Results: 29 passed, 0 failed

- eval: E3h
  run_id: minted-release-2-28-0-E3h-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_3
  verified_at: 2026-10-12T19:02:13Z
  output: |
    Results: 29 passed, 0 failed

- eval: E3b
  run_id: minted-release-2-28-0-E3b-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.hooks
  verified_at: 2026-10-12T19:02:13Z
  output: |
    Results: 71 passed, 0 failed

- eval: E3c
  run_id: minted-release-2-28-0-E3c-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins_vung_1
  verified_at: 2026-10-12T19:02:13Z
  output: |
    Results: all plugin tests passed

- eval: E3i
  run_id: minted-release-2-28-0-E3i-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins_vung_2
  verified_at: 2026-10-12T19:02:13Z
  output: |
    Results: all plugin tests passed

- eval: E3j
  run_id: minted-release-2-28-0-E3j-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-12T19:02:13Z
  output: |
    Results: all plugin tests passed

- eval: E3d
  run_id: minted-release-2-28-0-E3d-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-10-12T19:02:13Z
  output: |
    Results: all workflow tests passed

- eval: E3e
  run_id: minted-release-2-28-0-E3e-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.product_map
  verified_at: 2026-10-12T19:02:13Z
  output: |
    LO-TRINH.html khớp tệp ý định và hồ sơ.

- eval: E4
  run_id: minted-release-2-28-0-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel2280_cua_so
  verified_at: 2026-10-12T19:02:13Z
  output: |
    XANH: hai tập bằng nhau

- eval: E5
  run_id: minted-release-2-28-0-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel2280_dd_giu
  verified_at: 2026-10-12T19:02:13Z
  output: |
    moc:   "version": "2.7.1", | HEAD:   "version": "2.7.1",

- eval: E6
  run_id: minted-release-2-28-0-E6-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-12T19:02:13Z
  output: |
    Results: all plugin tests passed

- eval: E7
  run_id: minted-release-2-28-0-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi
  verified_at: 2026-10-12T19:02:13Z
  output: |
    ok 50 - DP1-01 cai-la-du|ok 51 - DP1-01-do doi-ten-tep|ok 52 - DP1-01-do dao-lenh|ok 53 - DP1-02 chieu-im|ok 54 - DP1-02 ngoai-git|    ok 1 - DP1-02-duong chan-s4|    ok 2 - DP1-02-duong nhip|    ok 3 - DP1-02-duong cho-nguoi|    ok 4 - DP1

- eval: E8
  run_id: minted-release-2-28-0-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel2280_lop_chep
  verified_at: 2026-10-12T19:02:13Z
  output: |
    XANH: đúng 1 tệp đổi như mốc kể

### Judgment

Hội đồng đề xuất: ba góc nhìn (domain-correctness, operational-feasibility, spec-alignment), đề xuất chung PASS. Bản này là đề xuất của máy; `human_override` để trống cho người quyết ở Cổng 2.

- domain-correctness: PASS — Cả bốn vế khớp với các tệp được liệt kê: khoá `production.nhanh` trong CHANGELOG khớp `ho-so-tom-tat.cjs` và `lo-trinh-du-lieu.md` (dòng quan sát của người ghi luôn thắng, vắng khoá thì giữ câu cũ, khai khoá thì ra đủ ba kết cục); ghi chú cho crm bảo cài đúng thẻ `v2.28.0`, không cài từ `main`, nêu bản «2.27.0» ở M5 là mã `main` `294b29d` và bảo lấy `docDuLieu` bằng `git show v2.28.0:scripts/lo-trinh.mjs`; cách khai `dieu_phoi.lich_su` và lệnh `ghi-danh <dãy>` khớp `dieu-phoi/README.md`; ba hồ sơ `evals-sat-le-doc-du`, `tac-tu-cham-chi-cham-khong`, `dieu-phoi-on-dinh-r2` được gọi tên kèm lý do môi trường. Hai chỗ lệch nhỏ, không vế nào sai: dòng quan sát chỉ thắng khi sổ quyết định tồn tại (vắng cả sổ lẫn khoá thì mã trả `null`, `lo-trinh-du-lieu.md` có nói rõ); CHANGELOG nói «bốn hàng từ chối» của `ghi-danh` trong khi README liệt kê năm điều kiện.
- operational-feasibility: PASS — Cả bốn vế đúng. Mục `production.nhanh` khớp `nhanhProduction`/`trienKhai`/`tomTatHoSo` trong `ho-so-tom-tat.cjs` và dòng 90 của `lo-trinh-du-lieu.md` (ba kết cục, nhánh đọc origin trước rồi nhánh cục bộ, dòng quan sát người ghi được xét trước nhánh). Ghi chú crm bảo cài theo đúng thẻ `v2.28.0`. `dieu_phoi.lich_su` và `ghi-danh <dãy>` khớp README. Ba hồ sơ môi trường được gọi tên và ghi rõ không phải lỗi của mốc.
- spec-alignment: PASS — Cả bốn vế khớp. Có hai chỗ CHANGELOG nêu ít hơn mã/README: liệt kê ba lý do «chưa đọc được» trong khi mã có năm, và nói «bốn hàng từ chối» trong khi README liệt kê năm điều kiện. Cả hai chỉ là liệt kê thiếu, không mâu thuẫn, nên không thành FAIL.

- eval: E9
  judged_by: judge panel (3 góc nhìn, fresh context)
  verdict: PASS
  rationale: Cả ba góc nhìn đều PASS cho bốn vế của mục «ghi chú nhận mốc» (production.nhanh, cài theo thẻ v2.28.0, dieu_phoi.lich_su/ghi-danh, ba hồ sơ môi trường); chỉ có hai chỗ CHANGELOG liệt kê thiếu so với mã/README, không mâu thuẫn.
  human_override:  # chi nguoi ghi

## Known limits

## Ngoài hợp đồng

## Analyst

Eval KHÔNG-PHÂN-BIỆT (xanh trên CẢ code HEAD lẫn baseline diffBase — chứng minh harness chứ không phải feature; cần viết lại để assert hành vi mới, hoặc xác nhận là regression-guard có chủ ý):

- `bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'`: E1, E2, E3j, E6 (xanh ở baseline; lưu ý chiều đỏ của AC-1/AC-2/AC-6 nằm trong các đột biến của chính P200, không phải ở việc vùng 3 thoát khác 0 trên code cũ)
- `bash tests/scripts/run-tests.sh --manh bash`: E3 (regression-guard có chủ ý)
- `bash tests/scripts/run-tests.sh --manh mjs:1/3`: E3f (regression-guard có chủ ý)

### Baseline khong do

- bash tests/scripts/run-tests.sh --manh mjs:2/3: baseline vuot tran 140 giay/lenh — da dung ca cay tien trinh; BLOCKED ha tang, khong phai ket qua cua code cu
- bash tests/scripts/run-tests.sh --manh mjs:3/3: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash tests/hooks/run-tests.sh: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40': het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40': het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash tests/workflows/run-tests.sh: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- node scripts/product-map.mjs --root . --check: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- GIT_GLOB_PATHSPECS=1 bash scripts/rel-cua-so.sh a1e2e0b9 buoc-len-thiet-ke-khong-hoi can-cu-s1-chay-moi-kho dai-tom-tat-doc-dung dai-tom-tat-dem-dung-vi-sao-tron dieu-phoi-on-dinh-r2: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash -c 'c=$(git show a1e2e0b9:diagram-design/.claude-plugin/plugin.json | grep -m1 "version"); m=$(grep -m1 "version" diagram-design/.claude-plugin/plugin.json); echo "moc: $c | HEAD: $m"; git diff --quiet a1e2e0b9 HEAD -- diagram-design && [ "$c" = "$m" ]': het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash -c 'set -o pipefail; node --test --test-reporter=tap "tests/dieu-phoi/**/*.test.mjs" 2>&1 | grep -E "^ *(not )?ok [0-9]+ - DP1-|^ *not ok|^# (pass|fail|skipped|todo) " | paste -sd"|" -': het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash _acceptance/release-2-28-0/lop-chep-doi.sh a1e2e0b9 scripts/ho-so-tom-tat.cjs: bo qua baseline: tep _acceptance/release-2-28-0/lop-chep-doi.sh co o cay dang kiem nhung chua co o merge-base 9afa82692b8acdd92c617abed969f049ea92923e — eval moi, chay tren code cu khong phan biet gi

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: mọi eval máy đều xanh (17/17), hội đồng E9 đề xuất PASS; không eval nào hỏng. Verdict PASS.

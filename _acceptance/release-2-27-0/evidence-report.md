---
schema_version: 2
feature_slug: release-2-27-0
verdict: REJECT
failed_evals: [E1, E2, E3j, E6, E3f]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 0caf90a494496864a4a78ca1bd1d727c7e16ad40
human_signoff:
---

# Evidence Report: release-2-27-0

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | FAIL |
| E2 | AC-2 | test | FAIL |
| E3 | AC-3 | test | PASS |
| E3f | AC-3 | test | FAIL |
| E3g | AC-3 | test | PASS |
| E3h | AC-3 | test | PASS |
| E3b | AC-3 | test | PASS |
| E3c | AC-3 | test | PASS |
| E3i | AC-3 | test | PASS |
| E3j | AC-3 | test | FAIL |
| E3d | AC-3 | test | PASS |
| E3e | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | test | FAIL |
| E7 | AC-7 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-release-2-27-0-E1-r1
  exit_code: 1
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-12T03:24:59Z
  output: |
    MUTANT-6 bi bat: doc_manifest() FAIL-LOUD ghim 'site thieu so ban: feature-loop/skills/feature-loop/SKILL.md'
    FAIL: [PD7b] CHANGELOG.md: 4 lệnh plugin ngoài khối GUIDE-PLUGIN-DECLARE
      FAIL: ca khai plugin — PD7b (ho so repo-khai-plugin)
    Results: 4 passed, 0 failed (ntr-observed)
    Results: 1 failed

- eval: E2
  run_id: minted-release-2-27-0-E2-r1
  exit_code: 1
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-12T03:24:59Z
  output: |
    MUTANT-6 bi bat: doc_manifest() FAIL-LOUD ghim 'site thieu so ban: feature-loop/skills/feature-loop/SKILL.md'
    FAIL: [PD7b] CHANGELOG.md: 4 lệnh plugin ngoài khối GUIDE-PLUGIN-DECLARE
      FAIL: ca khai plugin — PD7b (ho so repo-khai-plugin)
    Results: 4 passed, 0 failed (ntr-observed)
    Results: 1 failed

- eval: E3
  run_id: minted-release-2-27-0-E3-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts_bash
  verified_at: 2026-10-12T03:24:59Z
  output: |
    Results: 837 passed, 0 failed

- eval: E3f
  run_id: minted-release-2-27-0-E3f-r1
  exit_code: 1
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_1
  verified_at: 2026-10-12T03:24:59Z
  output: |
    Results: 9 passed, 0 failed (xem-trang-lo-trinh)
      PASS: xem-trang-lo-trinh.test.mjs
      PASS: co it nhat mot *.test.mjs duoc chay

    Results: 28 passed, 1 failed

- eval: E3g
  run_id: minted-release-2-27-0-E3g-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_2
  verified_at: 2026-10-12T03:24:59Z
  output: |
    Results: 29 passed, 0 failed

- eval: E3h
  run_id: minted-release-2-27-0-E3h-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_3
  verified_at: 2026-10-12T03:24:59Z
  output: |
    Results: 28 passed, 0 failed

- eval: E3b
  run_id: minted-release-2-27-0-E3b-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.hooks
  verified_at: 2026-10-12T03:24:59Z
  output: |
    Results: 71 passed, 0 failed

- eval: E3c
  run_id: minted-release-2-27-0-E3c-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins_vung_1
  verified_at: 2026-10-12T03:24:59Z
  output: |
    Results: all plugin tests passed

- eval: E3i
  run_id: minted-release-2-27-0-E3i-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins_vung_2
  verified_at: 2026-10-12T03:24:59Z
  output: |
    Results: all plugin tests passed

- eval: E3j
  run_id: minted-release-2-27-0-E3j-r1
  exit_code: 1
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-12T03:24:59Z
  output: |
    MUTANT-6 bi bat: doc_manifest() FAIL-LOUD ghim 'site thieu so ban: feature-loop/skills/feature-loop/SKILL.md'
    FAIL: [PD7b] CHANGELOG.md: 4 lệnh plugin ngoài khối GUIDE-PLUGIN-DECLARE
      FAIL: ca khai plugin — PD7b (ho so repo-khai-plugin)
    Results: 4 passed, 0 failed (ntr-observed)
    Results: 1 failed

- eval: E3d
  run_id: minted-release-2-27-0-E3d-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-10-12T03:24:59Z
  output: |
    Results: all workflow tests passed

- eval: E3e
  run_id: minted-release-2-27-0-E3e-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.product_map
  verified_at: 2026-10-12T03:24:59Z
  output: |
    LO-TRINH.html khớp tệp ý định và hồ sơ.

- eval: E4
  run_id: minted-release-2-27-0-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel2270_cua_so
  verified_at: 2026-10-12T03:24:59Z
  output: |
    XANH: hai tập bằng nhau

- eval: E5
  run_id: minted-release-2-27-0-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel2270_dd_giu
  verified_at: 2026-10-12T03:24:59Z
  output: |
    moc:   "version": "2.7.1", | HEAD:   "version": "2.7.1",

- eval: E6
  run_id: minted-release-2-27-0-E6-r1
  exit_code: 1
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-12T03:24:59Z
  output: |
    MUTANT-6 bi bat: doc_manifest() FAIL-LOUD ghim 'site thieu so ban: feature-loop/skills/feature-loop/SKILL.md'
    FAIL: [PD7b] CHANGELOG.md: 4 lệnh plugin ngoài khối GUIDE-PLUGIN-DECLARE
      FAIL: ca khai plugin — PD7b (ho so repo-khai-plugin)
    Results: 4 passed, 0 failed (ntr-observed)
    Results: 1 failed

- eval: E7
  run_id: minted-release-2-27-0-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi
  verified_at: 2026-10-12T03:24:59Z
  output: |
    ok 50 - DP1-01 cai-la-du|ok 51 - DP1-01-do doi-ten-tep|ok 52 - DP1-01-do dao-lenh|ok 53 - DP1-02 chieu-im|ok 54 - DP1-02 ngoai-git|    ok 1 - DP1-02-duong chan-s4|    ok 2 - DP1-02-duong nhip|    ok 3 - DP1-02-duong cho-nguoi|    ok 4 - DP1
    (đuôi đầu ra do máy cắt ngang tại đây)

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không phân biệt (xanh trên cả HEAD lẫn baseline):
- E3 (`bash tests/scripts/run-tests.sh --manh bash`): xanh cả hai phía — regression-guard có chủ ý của AC-3 (mảnh bash không hồi quy), chứng minh harness chứ không chứng minh tính năng của mốc.

Lệnh trượt không gắn eval: không có — cả hai lệnh trượt đều gắn eval (vùng 3 của suite plugins gắn E1, E2, E3j, E6; mảnh mjs:1/3 gắn E3f). Không eval nào là judgment, nên không có hội đồng chấm và không mục nào chờ người chốt.

Ghi chú người chấm (đọc kho chỉ-đọc, không sửa gì):
- E1, E2, E3j, E6 dùng CHUNG một lệnh (vùng 3 của suite plugins) nên chung một kết quả. Đuôi đã lọc chỉ có MỘT dòng ca trượt: PD7b (tests/plugins/plugin-declare.test.mjs, hồ sơ repo-khai-plugin). Đuôi không có dòng trượt nào của P200. Các eval trượt vì expected của chúng đòi lệnh vùng 3 thoát 0, mà lệnh dùng chung thoát khác 0, không phải vì đã thấy P200 đỏ. Người chấm đếm lại bằng git: CHANGELOG.md ở f59d9547 có 0 lệnh khớp mẫu CMD_PLUGIN của PD7b; ở HEAD có 4, ở các dòng 50, 303, 308, 372, đều nằm trong diff f59d9547..HEAD. Lệnh này xanh trên baseline và đỏ trên HEAD, nên hồi quy do chính mốc này đưa vào.
- E3f: mảnh mjs:1/3 gồm 28 tệp test (SCRIPTS_SHARD_LIST) cộng một ca meta; kết quả «28 passed, 1 failed». Đuôi đầu ra máy giữ không nêu tên tệp hay ca trượt, nên chưa quy được nguyên nhân từ dữ liệu có; cần chạy lại mảnh này với đầu ra đầy đủ.
- E7: đuôi đầu ra bị máy cắt ngang nên tại đây không thấy được dòng DP1-06 và tổng kết TAP; căn cứ của eval là mã thoát 0 của lệnh có pipefail.

### Baseline khong do

- bash tests/scripts/run-tests.sh --manh mjs:1/3: baseline vuot tran 180 giay/lenh — da dung ca cay tien trinh; BLOCKED ha tang, khong phai ket qua cua code cu
- bash tests/scripts/run-tests.sh --manh mjs:2/3: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash tests/scripts/run-tests.sh --manh mjs:3/3: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash tests/hooks/run-tests.sh: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40': het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40': het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash tests/workflows/run-tests.sh: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- node scripts/product-map.mjs --root . --check: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- GIT_GLOB_PATHSPECS=1 bash scripts/rel-cua-so.sh 200ce7bb baseline-tran-bo-qua-don ci-cua-kho-bo-job-nang cua-tin-hieu-gom-nhom dieu-phoi-doi-tai-khoan dieu-phoi-dong-goi-loi dieu-phoi-feature-loop-trong-dot dieu-phoi-lop-mod dieu-phoi-mo-dot-mot-lenh dieu-phoi-sua-truoc-dot-thu dieu-phoi-tiep-tuc-mot-lenh eval-goi-model-that-khong-chay evals-sat-le-doc-du glob-thoat-ngoac lo-trinh-chi-viec-phat-trien ngoai-n-tu-dinh-tuyen ten-ca-qua-tien-to-turbo trang-ho-so-mot-viec vong-la-mot-ket-qua xa-stdout-truoc-khi-thoat: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash -c 'c=$(git show 200ce7bb:diagram-design/.claude-plugin/plugin.json | grep -m1 "version"); m=$(grep -m1 "version" diagram-design/.claude-plugin/plugin.json); echo "moc: $c | HEAD: $m"; git diff --quiet 200ce7bb HEAD -- diagram-design && [ "$c" = "$m" ]': het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash -c 'set -o pipefail; node --test --test-reporter=tap "tests/dieu-phoi/**/*.test.mjs" 2>&1 | grep -E "^ *(not )?ok [0-9]+ - DP1-|^ *not ok|^# (pass|fail|skipped|todo) " | paste -sd"|" -': het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay

## Variance

none — every multi-run eval is uniform (mọi eval chạy một lần, xác định; không eval nào có pass_rate lẫn lộn)

## Iterations

Round 1: E1, E2, E3j, E6 (chung lệnh vùng 3 của suite plugins) trượt vì ca PD7b — CHANGELOG.md có 4 lệnh plugin ngoài khối GUIDE-PLUGIN-DECLARE (0 ở f59d9547, 4 ở HEAD: dòng 50, 303, 308, 372); E3f (mảnh mjs:1/3) trượt 1 tệp test, đuôi đầu ra không nêu tên nên chưa quy được. Returned to implementation.

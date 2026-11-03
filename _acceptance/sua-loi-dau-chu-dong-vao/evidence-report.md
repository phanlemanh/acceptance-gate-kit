---
schema_version: 2
feature_slug: sua-loi-dau-chu-dong-vao
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: ea3b2df48701f7e415db47eb6c9b3039c21a0a69
human_signoff:
---

# Evidence Report: sua-loi-dau-chu-dong-vao

Vòng 1. Toàn bộ 10 eval của hợp đồng đạt, nhưng một lệnh suite hồi quy (bộ plugins, vùng 3) đỏ và không gắn eval nào. Máy không được coi suite đỏ là xanh, nên phán quyết tính sẵn là REJECT (xem mục Analyst).

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | script | PASS |
| E7 | AC-7 | script | PASS |
| E8 | AC-7 | script | PASS |
| E9 | AC-8 | script | PASS |
| E10 | AC-9 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-sua-loi-dau-chu-dong-vao-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.sd_dieu_phoi
  verified_at: 2026-11-03T00:15:44Z
  output: |
    (lệnh chung với E2..E6: bộ SD-1..SD-6 của tests/dieu-phoi/sua-loi-dau-chu-dong-vao.test.mjs, lệnh buộc đúng 6 dòng «ok … - SD-»)
    # fail 0

- eval: E2
  run_id: minted-sua-loi-dau-chu-dong-vao-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.sd_dieu_phoi
  verified_at: 2026-11-03T00:15:44Z
  output: |
    (lệnh chung với E1, E3..E6)
    # fail 0

- eval: E3
  run_id: minted-sua-loi-dau-chu-dong-vao-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.sd_dieu_phoi
  verified_at: 2026-11-03T00:15:44Z
  output: |
    (lệnh chung với E1, E2, E4..E6)
    # fail 0

- eval: E4
  run_id: minted-sua-loi-dau-chu-dong-vao-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.sd_dieu_phoi
  verified_at: 2026-11-03T00:15:44Z
  output: |
    (lệnh chung với E1..E3, E5, E6)
    # fail 0

- eval: E5
  run_id: minted-sua-loi-dau-chu-dong-vao-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.sd_dieu_phoi
  verified_at: 2026-11-03T00:15:44Z
  output: |
    (lệnh chung với E1..E4, E6)
    # fail 0

- eval: E6
  run_id: minted-sua-loi-dau-chu-dong-vao-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.sd_dieu_phoi
  verified_at: 2026-11-03T00:15:44Z
  output: |
    (lệnh chung với E1..E5)
    # fail 0

- eval: E7
  run_id: minted-sua-loi-dau-chu-dong-vao-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.sd_s4_args
  verified_at: 2026-11-03T00:15:44Z
  output: |
    Results: 3 passed, 0 failed

- eval: E8
  run_id: minted-sua-loi-dau-chu-dong-vao-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.sd_ui_tuan_tu
  verified_at: 2026-11-03T00:15:44Z
  output: |
    (lệnh chung với E9)
    Results: 4 passed, 0 failed (ui-check-tuan-tu)

- eval: E9
  run_id: minted-sua-loi-dau-chu-dong-vao-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.sd_ui_tuan_tu
  verified_at: 2026-11-03T00:15:44Z
  output: |
    (lệnh chung với E8)
    Results: 4 passed, 0 failed (ui-check-tuan-tu)

- eval: E10
  run_id: minted-sua-loi-dau-chu-dong-vao-E10-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.pmlk_e1
  verified_at: 2026-11-03T00:15:44Z
  output: |
    Results: 4 passed, 0 failed

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-sua-loi-dau-chu-dong-vao-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-11-03T00:15:44Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-sua-loi-dau-chu-dong-vao-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 0
  verified_at: 2026-11-03T00:15:44Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-sua-loi-dau-chu-dong-vao-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 0
  verified_at: 2026-11-03T00:15:44Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-sua-loi-dau-chu-dong-vao-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 0
  verified_at: 2026-11-03T00:15:44Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-sua-loi-dau-chu-dong-vao-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-11-03T00:15:44Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-sua-loi-dau-chu-dong-vao-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 0
  verified_at: 2026-11-03T00:15:44Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-sua-loi-dau-chu-dong-vao-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-11-03T00:15:44Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-sua-loi-dau-chu-dong-vao-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 1
  verified_at: 2026-11-03T00:15:44Z
  ket_qua: ĐỎ — lệnh suite không gắn eval nào (xem mục Analyst)
  output: |
    MUTANT-6 bi bat: doc_manifest() FAIL-LOUD ghim 'site thieu so ban: feature-loop/skills/feature-loop/SKILL.md'
    Results: 4 passed, 0 failed (ntr-observed)
    FAIL: [RT13] file lạ chứa "signed-off": tests/dieu-phoi/sua-loi-dau-chu-dong-vao.test.mjs — thêm ca, hoặc khai gạch có lý do trong khối BO-DOC-KHAI-GACH
      FAIL: ca ra co ten — RT13 (ho so ra-co-ten-lam-va-trao)
    Results: 1 failed

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-sua-loi-dau-chu-dong-vao-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-11-03T00:15:44Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-sua-loi-dau-chu-dong-vao-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 0
  verified_at: 2026-11-03T00:15:44Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-sua-loi-dau-chu-dong-vao-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r1
  exit_code: 0
  verified_at: 2026-11-03T00:15:44Z

## Known limits

## Ngoài hợp đồng

## Analyst

Lệnh fail không gắn eval: `bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'`. Nguyên nhân đọc được từ đuôi đầu ra: ca RT13 (hồ sơ ra-co-ten-lam-va-trao) quét thấy chữ «signed-off» trong tệp mới `tests/dieu-phoi/sua-loi-dau-chu-dong-vao.test.mjs` mà tệp ấy chưa nằm trong khối BO-DOC-KHAI-GACH (cũng chưa có ca riêng). Đây là lỗi của vật được giao (tệp test của chính vòng này), không phải lỗi hạ tầng; mười eval của hợp đồng không bị ảnh hưởng. Hướng xử lý cho vòng thực thi: thêm ca RT13 cho tệp đó hoặc khai gạch có lý do trong BO-DOC-KHAI-GACH, rồi chạy lại vùng 3. Máy không tự vá và không chấm lại suite đỏ thành xanh.

Eval không phân biệt (xanh cả trên HEAD lẫn baseline):
- E10 (AC-9): lệnh khoá có sẵn của hồ sơ pre-merge-doc-lib-theo-kit (bốn ca LK1), baseline green. Đây là regression-guard có chủ ý cho AC-9 (vật mới không làm hỏng luật đọc «Known limits»), không phải bằng chứng cho hành vi mới.

Baseline khong do
- bash -c 'out=$(node --test --test-reporter=tap tests/dieu-phoi/sua-loi-dau-chu-dong-vao.test.mjs 2>&1); rc=$?; printf "%s\n" "$out" | grep -E "^(not )?ok [0-9]+ - SD-|^# (pass|fail) "; [ $rc -eq 0 ] || exit 1; printf "%s\n" "$out" | grep -qx "# fail 0" || exit 1; [ "$(printf "%s\n" "$out" | grep -cE "^ok [0-9]+ - SD-")" -eq 6 ] || exit 1': bo qua baseline: tep tests/dieu-phoi/sua-loi-dau-chu-dong-vao.test.mjs co o cay dang kiem nhung chua co o merge-base 6c3b0a4ad1f7149cdb4a803b0a537a57dde8c2b0 — eval moi, chay tren code cu khong phan biet gi
- bash -c 'out=$(node tests/scripts/s4-args-dev-server.test.mjs 2>&1); rc=$?; printf "%s\n" "$out"; [ $rc -eq 0 ] || exit 1; printf "%s\n" "$out" | grep -qxF "Results: 3 passed, 0 failed" || exit 1': bo qua baseline: tep tests/scripts/s4-args-dev-server.test.mjs co o cay dang kiem nhung chua co o merge-base 6c3b0a4ad1f7149cdb4a803b0a537a57dde8c2b0 — eval moi, chay tren code cu khong phan biet gi
- bash -c 'out=$(node tests/workflows/ui-check-tuan-tu.test.mjs 2>&1); rc=$?; printf "%s\n" "$out"; [ $rc -eq 0 ] || exit 1; printf "%s\n" "$out" | grep -qxF "Results: 4 passed, 0 failed (ui-check-tuan-tu)" || exit 1': bo qua baseline: tep tests/workflows/ui-check-tuan-tu.test.mjs co o cay dang kiem nhung chua co o merge-base 6c3b0a4ad1f7149cdb4a803b0a537a57dde8c2b0 — eval moi, chay tren code cu khong phan biet gi

Hội đồng chấm: không có eval judgment nào trong hợp đồng này (mọi eval là script), nên không có panel và không có mục chờ human_override.

## Variance

none — mọi eval nhiều lượt đều đồng nhất (không eval nào khai runs lớn hơn 1).

## Iterations

Round 1: không eval nào đỏ; lệnh suite plugins vùng 3 đỏ ở ca RT13 (tệp test mới chứa chữ «signed-off» chưa được khai trong BO-DOC-KHAI-GACH). Trả về thực thi để thêm ca hoặc khai gạch có lý do.

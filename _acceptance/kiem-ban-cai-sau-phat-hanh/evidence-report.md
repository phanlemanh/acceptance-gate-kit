---
schema_version: 2
feature_slug: kiem-ban-cai-sau-phat-hanh
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 58c8d79509ae616d8c38a71f77df5722c7edc255
human_signoff:
---

# Evidence Report: kiem-ban-cai-sau-phat-hanh

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E6 | AC-6 | test | PASS |
| E7 | AC-7 | test | PASS |
| E8 | AC-8 | test | PASS |
| E9 | AC-9 | test | PASS |
| E10 | AC-9 | judgment | PASS |

## Evidence

- eval: E1
  run_id: minted-kiem-ban-cai-sau-phat-hanh-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.kiem_ban_cai
  verified_at: 2026-10-13T01:07:51Z
  output: |
    KB: mọi ca PASS

- eval: E2
  run_id: minted-kiem-ban-cai-sau-phat-hanh-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.kiem_ban_cai
  verified_at: 2026-10-13T01:07:51Z
  output: |
    KB: mọi ca PASS

- eval: E3
  run_id: minted-kiem-ban-cai-sau-phat-hanh-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.kiem_ban_cai
  verified_at: 2026-10-13T01:07:51Z
  output: |
    KB: mọi ca PASS

- eval: E4
  run_id: minted-kiem-ban-cai-sau-phat-hanh-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.kiem_ban_cai
  verified_at: 2026-10-13T01:07:51Z
  output: |
    KB: mọi ca PASS

- eval: E5
  run_id: minted-kiem-ban-cai-sau-phat-hanh-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.kiem_ban_cai
  verified_at: 2026-10-13T01:07:51Z
  output: |
    KB: mọi ca PASS

- eval: E6
  run_id: minted-kiem-ban-cai-sau-phat-hanh-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.kiem_ban_cai
  verified_at: 2026-10-13T01:07:51Z
  output: |
    KB: mọi ca PASS

- eval: E7
  run_id: minted-kiem-ban-cai-sau-phat-hanh-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.kiem_ban_cai
  verified_at: 2026-10-13T01:07:51Z
  output: |
    KB: mọi ca PASS

- eval: E8
  run_id: minted-kiem-ban-cai-sau-phat-hanh-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.kiem_ban_cai
  verified_at: 2026-10-13T01:07:51Z
  output: |
    KB: mọi ca PASS

- eval: E9
  run_id: minted-kiem-ban-cai-sau-phat-hanh-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.kiem_ban_cai
  verified_at: 2026-10-13T01:07:51Z
  output: |
    KB: mọi ca PASS

### Judgment (E10)

- eval: E10
  judged_by: judge-subagent (fresh context)
  verdict: PASS
  rationale: Ba hội đồng (domain-correctness, operational-feasibility, spec-alignment) cùng chấm PASS — CHANGELOG và GUIDE §7.2 có đủ ba vế; không có phiếu bất đồng.
  human_override:  # chi nguoi ghi

  Phiếu từng hội đồng (đề xuất panel: PASS; human_override để trống cho người quyết):

  - domain-correctness: PASS — CHANGELOG "Khi update" và GUIDE §7.2 cùng dặn người cắt mốc chạy `--ref v<số>` sau khi gắn tag, máy nhận chạy `--may --ref v<số>` sau khi cài. CHANGELOG nói rõ lệnh này thay khối `node -e` ở bước 3 mục A1. Cả hai nói kiểm tự đi trọn ở lượt chấm hồ sơ cắt mốc (số gói gốc đổi) và vòng thường chỉ in `BỎ QUA`. Cả hai dặn đọc dòng `TỔNG KẾT` (ĐẠT/ĐỎ/KHÔNG CHẠY ĐƯỢC) chứ không đọc mã thoát một mình, và `ĐỎ may:` thì gỡ rồi cài lại theo bốn bước. CHANGELOG khai đủ bốn giới hạn của design §4. Ba giới hạn có ngưỡng mở lại: tác tử chấm, bước sau-tag, nhận diện lượt mốc. Giới hạn CI không có ngưỡng, và design §4 cũng không đặt ngưỡng cho nó. GUIDE nêu cùng bốn giới hạn nhưng không kèm ngưỡng.
  - operational-feasibility: PASS — Cả ba vế đều có trong chữ của ba tệp. (1) CHANGELOG và GUIDE §7.2 đều dặn cắt mốc chạy `--ref v<số>` sau tag, máy nhận chạy `--may --ref v<số>` sau cài. Việc thay khối `node -e` ở bước 3 mục A1 nằm ở CHANGELOG (GUIDE chỉ trỏ tới bốn bước A1). Cả hai nói kiểm tự đi trọn ở lượt chấm hồ sơ cắt mốc (số gói gốc đổi), vòng thường in một dòng `BỎ QUA`. (2) Cả hai dặn đọc dòng `TỔNG KẾT` (ĐẠT / ĐỎ / KHÔNG CHẠY ĐƯỢC) chứ không đọc mã thoát một mình, và dòng `ĐỎ may:` thì gỡ rồi cài lại theo bốn bước A1. (3) CHANGELOG khai đủ bốn giới hạn của design §4, ba cái kèm ngưỡng mở lại; riêng giới hạn CI không có ngưỡng nào, ở cả design §4 lẫn CHANGELOG, dù CHANGELOG viết «mỗi cái một ngưỡng». GUIDE khai bốn giới hạn đó không kèm ngưỡng và trỏ về design §4.
  - spec-alignment: PASS — Ba vế đều có trong chữ của CHANGELOG và GUIDE §7.2. (1) Người cắt mốc chạy `--ref v<số>` sau khi gắn tag. Máy nhận chạy `--may --ref v<số>` sau khi cài, và CHANGELOG nói rõ lệnh này thay khối `node -e` ở bước 3 mục A1. Cả hai tệp nói kiểm chỉ chạy trọn ở lượt chấm hồ sơ cắt mốc (số khác gốc vòng); vòng thường in một dòng `BỎ QUA`. (2) Cả hai dặn đọc dòng `TỔNG KẾT` (ĐẠT · ĐỎ · KHÔNG CHẠY ĐƯỢC) chứ không đọc mã thoát một mình; GUIDE dặn `ĐỎ may:` thì gỡ rồi cài lại theo bốn bước của A1. (3) CHANGELOG khai đủ bốn giới hạn của design §4. Ba cái có ngưỡng mở lại cụ thể (tác tử chấm đo tĩnh, bước sau-tag, nhận diện lượt mốc theo số gói gốc). Giới hạn CI không chạy không có ngưỡng, khớp với design §4, vốn cũng không đặt ngưỡng cho nó.

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-kiem-ban-cai-sau-phat-hanh-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-10-13T01:07:51Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-kiem-ban-cai-sau-phat-hanh-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 0
  verified_at: 2026-10-13T01:07:51Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-kiem-ban-cai-sau-phat-hanh-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 0
  verified_at: 2026-10-13T01:07:51Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-kiem-ban-cai-sau-phat-hanh-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 0
  verified_at: 2026-10-13T01:07:51Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-kiem-ban-cai-sau-phat-hanh-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-13T01:07:51Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-kiem-ban-cai-sau-phat-hanh-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 0
  verified_at: 2026-10-13T01:07:51Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-kiem-ban-cai-sau-phat-hanh-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-10-13T01:07:51Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-kiem-ban-cai-sau-phat-hanh-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 0
  verified_at: 2026-10-13T01:07:51Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-kiem-ban-cai-sau-phat-hanh-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-13T01:07:51Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-kiem-ban-cai-sau-phat-hanh-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 0
  verified_at: 2026-10-13T01:07:51Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-kiem-ban-cai-sau-phat-hanh-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r1
  exit_code: 0
  verified_at: 2026-10-13T01:07:51Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — không eval nào xanh ở cả hai phía; E1–E9 là eval mới của vòng này nên baseline không đo được (xem mục dưới), không có eval nào bị xếp là không-phân-biệt. Lệnh suite xanh cả hai phía là regression-guard bình thường.

Baseline khong do:
- node tests/scripts/kiem-ban-cai.ca.mjs: bo qua baseline: tep tests/scripts/kiem-ban-cai.ca.mjs co o cay dang kiem nhung chua co o merge-base 911c9756f34f258b88aa140ca565e2d21dc5f222 — eval moi, chay tren code cu khong phan biet gi

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: mọi eval máy (E1–E9) và mọi lệnh suite đều đạt, hội đồng E10 đồng thuận PASS. Verdict PASS.

---
schema_version: 2
feature_slug: kiem-ban-cai-sau-phat-hanh
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 5cca81e3571a90e284f5b399cf635482c803d9d9
human_signoff: Manh Phan 2026-10-13
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
| E11 | AC-10 | test | PASS |
| E12 | AC-11 | test | PASS |
| E13 | AC-12 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-kiem-ban-cai-sau-phat-hanh-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.kiem_ban_cai
  verified_at: 2026-10-13T03:24:06Z
  output: |
    KB: mọi ca PASS

- eval: E2
  run_id: minted-kiem-ban-cai-sau-phat-hanh-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.kiem_ban_cai
  verified_at: 2026-10-13T03:24:06Z
  output: |
    KB: mọi ca PASS

- eval: E3
  run_id: minted-kiem-ban-cai-sau-phat-hanh-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.kiem_ban_cai
  verified_at: 2026-10-13T03:24:06Z
  output: |
    KB: mọi ca PASS

- eval: E4
  run_id: minted-kiem-ban-cai-sau-phat-hanh-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.kiem_ban_cai
  verified_at: 2026-10-13T03:24:06Z
  output: |
    KB: mọi ca PASS

- eval: E5
  run_id: minted-kiem-ban-cai-sau-phat-hanh-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.kiem_ban_cai
  verified_at: 2026-10-13T03:24:06Z
  output: |
    KB: mọi ca PASS

- eval: E6
  run_id: minted-kiem-ban-cai-sau-phat-hanh-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.kiem_ban_cai
  verified_at: 2026-10-13T03:24:06Z
  output: |
    KB: mọi ca PASS

- eval: E7
  run_id: minted-kiem-ban-cai-sau-phat-hanh-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.kiem_ban_cai
  verified_at: 2026-10-13T03:24:06Z
  output: |
    KB: mọi ca PASS

- eval: E8
  run_id: minted-kiem-ban-cai-sau-phat-hanh-E8-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.kiem_ban_cai
  verified_at: 2026-10-13T03:24:06Z
  output: |
    KB: mọi ca PASS

- eval: E9
  run_id: minted-kiem-ban-cai-sau-phat-hanh-E9-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.kiem_ban_cai
  verified_at: 2026-10-13T03:24:06Z
  output: |
    KB: mọi ca PASS

- eval: E11
  run_id: minted-kiem-ban-cai-sau-phat-hanh-E11-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.kiem_ban_cai
  verified_at: 2026-10-13T03:24:06Z
  output: |
    KB: mọi ca PASS

- eval: E12
  run_id: minted-kiem-ban-cai-sau-phat-hanh-E12-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.kiem_ban_cai
  verified_at: 2026-10-13T03:24:06Z
  output: |
    KB: mọi ca PASS

- eval: E13
  run_id: minted-kiem-ban-cai-sau-phat-hanh-E13-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.kiem_ban_cai
  verified_at: 2026-10-13T03:24:06Z
  output: |
    KB: mọi ca PASS

### Judgment (E10)

- eval: E10
  judged_by: judge-subagent (fresh context)
  verdict: PASS
  rationale: Ba hội đồng (domain-correctness, operational-feasibility, spec-alignment) cùng chấm PASS — CHANGELOG và GUIDE §7.2 có đủ ba vế (lệnh sau tag và sau cài, đọc dòng TỔNG KẾT, bốn giới hạn khai). Không có phiếu bất đồng; một lưu ý nhỏ về chữ ở bên dưới.
  human_override:  # chi nguoi ghi

  Phiếu từng hội đồng (đề xuất panel: PASS; human_override để trống cho người quyết):

  - domain-correctness: PASS — Cả ba vế đều có trong chữ của ba tệp. CHANGELOG dặn `--ref v<số>` sau khi gắn tag, và máy nhận chạy `--may --ref v<số>` sau bốn bước cài lại, thay khối `node -e` ở bước 3 mục A1. GUIDE §7.2 dặn lại hai lệnh đó, và cả hai tệp nói kiểm chạy trọn ở lượt chấm hồ sơ cắt mốc, vòng thường in một dòng `BỎ QUA`. Cả hai dặn đọc dòng `TỔNG KẾT` (ĐẠT · ĐỎ · KHÔNG CHẠY ĐƯỢC), không đọc mã thoát một mình. Cả bốn giới hạn của design §4 đều có; CHANGELOG gắn ngưỡng cho ba cái. Giới hạn «CI không chạy» không có ngưỡng ở đâu, kể cả design §4, nên CHANGELOG khớp design dù câu «mỗi cái một ngưỡng» nói quá một chút.
  - operational-feasibility: PASS — Vế (1) và (2) có đủ trong CHANGELOG «Chưa phát hành» và GUIDE 7.2: `--ref v<số>` sau tag, `--may --ref v<số>` sau cài, đọc dòng TỔNG KẾT, và dòng `ĐỎ may:` thì gỡ rồi cài lại theo bốn bước A1. CHANGELOG nói rõ lệnh thay khối `node -e` ở bước 3 A1, GUIDE chỉ nói «theo bốn bước của mục A1». Vế (3) có đủ bốn giới hạn của design §4; ba cái kèm ngưỡng trong CHANGELOG. Giới hạn «CI GitHub không chạy» không có ngưỡng ở cả CHANGELOG lẫn design §4, nên câu «mỗi cái một ngưỡng mở lại» hơi quá lời; giới hạn này vẫn được khai đủ và design không đặt ngưỡng cho nó.
  - spec-alignment: PASS — Cả ba vế đều có trong chữ của ba tệp. (1) CHANGELOG và GUIDE §7.2 dặn chạy `--ref v<số>` sau khi gắn tag và `--may --ref v<số>` sau khi cài; CHANGELOG nói lệnh này thay khối `node -e` ở bước 3 mục A1; cả hai nói kiểm chạy trọn ở lượt chấm hồ sơ cắt mốc (số trong plugin.json đổi), vòng thường chỉ in một dòng `BỎ QUA`. (2) Cả hai dặn đọc dòng `TỔNG KẾT`; GUIDE dặn dòng `ĐỎ may:` thì gỡ rồi cài lại theo bốn bước A1. (3) CHANGELOG khai đủ bốn giới hạn của design §4 kèm ngưỡng; GUIDE liệt kê đủ bốn nhưng không kèm ngưỡng, trỏ về design §4. Lệch nhẹ về chữ: giới hạn «CI không chạy» không có ngưỡng ở cả design §4 lẫn CHANGELOG dù CHANGELOG viết «mỗi cái một ngưỡng»; đây không phải vế thiếu.

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-kiem-ban-cai-sau-phat-hanh-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r2
  exit_code: 0
  verified_at: 2026-10-13T03:24:06Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-kiem-ban-cai-sau-phat-hanh-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r2
  exit_code: 0
  verified_at: 2026-10-13T03:24:06Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-kiem-ban-cai-sau-phat-hanh-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r2
  exit_code: 0
  verified_at: 2026-10-13T03:24:06Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-kiem-ban-cai-sau-phat-hanh-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r2
  exit_code: 0
  verified_at: 2026-10-13T03:24:06Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-kiem-ban-cai-sau-phat-hanh-SUITE-bash_tests_hooks_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-10-13T03:24:06Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-kiem-ban-cai-sau-phat-hanh-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r2
  exit_code: 0
  verified_at: 2026-10-13T03:24:06Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-kiem-ban-cai-sau-phat-hanh-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r2
  exit_code: 0
  verified_at: 2026-10-13T03:24:06Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-kiem-ban-cai-sau-phat-hanh-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r2
  exit_code: 0
  verified_at: 2026-10-13T03:24:06Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-kiem-ban-cai-sau-phat-hanh-SUITE-bash_tests_workflows_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-10-13T03:24:06Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-kiem-ban-cai-sau-phat-hanh-SUITE-node_scripts_product_map_mjs_root_check-r2
  exit_code: 0
  verified_at: 2026-10-13T03:24:06Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-kiem-ban-cai-sau-phat-hanh-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r2
  exit_code: 0
  verified_at: 2026-10-13T03:24:06Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — không eval nào xanh ở cả hai phía; E1–E9 và E11–E13 là eval mới của vòng này nên baseline không đo được (xem mục dưới), không có eval nào bị xếp là không-phân-biệt. Lệnh suite xanh cả hai phía là regression-guard bình thường.

Baseline khong do:
- node tests/scripts/kiem-ban-cai.ca.mjs: bo qua baseline: tep tests/scripts/kiem-ban-cai.ca.mjs co o cay dang kiem nhung chua co o merge-base 911c9756f34f258b88aa140ca565e2d21dc5f222 — eval moi, chay tren code cu khong phan biet gi

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: mọi eval máy (E1–E9) và mọi lệnh suite đều đạt, hội đồng E10 đồng thuận PASS. Verdict PASS. Người ở Cổng Bằng chứng nâng phạm vi thêm AC-10, AC-11, AC-12.
Round 2: phạm vi nâng — thêm E11 (AC-10 máy nhận chưa có bản mới thì ĐỎ), E12 (AC-11 mọi lỗi đi đường «không chạy được»), E13 (AC-12 ca đỏ mục số phiên bản); E1–E9 chạy lại, mọi eval máy và mọi lệnh suite đều đạt, hội đồng E10 đồng thuận PASS. Verdict PASS.

### Re-pin lần 1 — 2026-10-13, do hoá cũ do gộp origin/main (lô M5 + BB1 + câu tín hiệu) trước khi gộp #339
run_id: repin-20261013T062821Z-25751
sha: dbea1fb60494517183ab7a3fcb8894e2883b677a · suites: 11 lệnh exit 0 · evals: 12/12 eval máy đạt kỳ vọng · ngoài làn máy: E10 (E10 không khai paths)

### Re-pin lần 2 — 2026-10-13, do chiến dịch ghim lại mốc 2.29.0 — đổi số ba gói + gộp lô 2
run_id: repin-20261013T091229Z-18995
sha: 5cca81e3571a90e284f5b399cf635482c803d9d9 · suites: 11 lệnh exit 0 · evals: 12/12 eval máy đạt kỳ vọng · ngoài làn máy: E10 (E10 không khai paths)

---
schema_version: 2
feature_slug: cua-tin-hieu-gom-nhom
verdict: REJECT
failed_evals: [E10]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 7e179d2842f39755e313f737ad9442e72b507df5
human_signoff:
---

# Evidence Report: cua-tin-hieu-gom-nhom

Vòng 2. Verdict REJECT: E10 (AC-10) không đạt — bản gom của lượt gom bộ vàng 3 lệch đáp án ở 7 chỗ. E1–E9 đạt. E11 (judgment) hội đồng đề xuất FAIL, chờ người quyết ở Cổng Bằng chứng.

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
| E10 | AC-10 | test | FAIL |
| E11 | AC-11 | judgment | đề xuất FAIL — chờ người quyết |

## Evidence

- eval: E1
  run_id: minted-cua-tin-hieu-gom-nhom-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.tin_hieu
  verified_at: 2026-10-11T11:16:04Z
  output: |
    Results: 23 passed, 0 failed (tin-hieu)

- eval: E2
  run_id: minted-cua-tin-hieu-gom-nhom-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.tin_hieu
  verified_at: 2026-10-11T11:16:04Z
  output: |
    Results: 23 passed, 0 failed (tin-hieu)

- eval: E3
  run_id: minted-cua-tin-hieu-gom-nhom-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.tin_hieu
  verified_at: 2026-10-11T11:16:04Z
  output: |
    Results: 23 passed, 0 failed (tin-hieu)

- eval: E4
  run_id: minted-cua-tin-hieu-gom-nhom-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.tin_hieu
  verified_at: 2026-10-11T11:16:04Z
  output: |
    Results: 23 passed, 0 failed (tin-hieu)

- eval: E5
  run_id: minted-cua-tin-hieu-gom-nhom-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.tin_hieu
  verified_at: 2026-10-11T11:16:04Z
  output: |
    Results: 23 passed, 0 failed (tin-hieu)

- eval: E6
  run_id: minted-cua-tin-hieu-gom-nhom-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.tin_hieu
  verified_at: 2026-10-11T11:16:04Z
  output: |
    Results: 23 passed, 0 failed (tin-hieu)

- eval: E7
  run_id: minted-cua-tin-hieu-gom-nhom-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.tin_hieu
  verified_at: 2026-10-11T11:16:04Z
  output: |
    Results: 23 passed, 0 failed (tin-hieu)

- eval: E8
  run_id: minted-cua-tin-hieu-gom-nhom-E8-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.tin_hieu
  verified_at: 2026-10-11T11:16:04Z
  output: |
    Results: 23 passed, 0 failed (tin-hieu)

- eval: E9
  run_id: minted-cua-tin-hieu-gom-nhom-E9-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.tin_hieu
  verified_at: 2026-10-11T11:16:04Z
  output: |
    Results: 23 passed, 0 failed (tin-hieu)

- eval: E10
  run_id: minted-cua-tin-hieu-gom-nhom-E10-r2
  exit_code: 1
  baseline: n-a
  verifier: config:executors.test.tin_hieu_vang
  verified_at: 2026-10-11T11:16:04Z
  output: |
    PASS: TH-10-ong — kho đưa phiên gom kín đáp án (đối chứng thấy tên trong đáp án); 20 mục == 20 tệp; lệnh chấm chạy trên bộ vàng thứ hai; đảo thứ tự commit → «khai trước»
    PASS: TH-10-do — bản gom tách một cặp trùng: lệnh chấm trả «cặp trùng tách: crm-u7-3 → nhóm G1 (docs/gom/g.md) · crm-u7-4 → nhóm G9 (docs/gom/g.md)»
    PASS: TH-10-do2 — bộ sinh giữ tên hồ sơ trong nhãn: phép quét kín trả «vang-a-1.json chứa tên hồ sơ ca-chap-chon-cach-ly»
    TH-10: cặp trùng tách: vang-a-9 → nhóm G5 · vang-b-12 → nhóm G6 (docs/gom/gom-vang.md)
    TH-10: cặp trùng tách: vang-b-14 → đã phủ luat-kho-vong-doi · vang-b-18 → nhóm G7
    TH-10: vang-a-3 / vang-b-20 sinh từ hồ sơ đã giao ca-chap-chon-cach-ly nhưng ở nhóm G1; vang-b-18 từ hồ sơ đã giao luat-kho-vong-doi nhưng ở nhóm G7
    TH-10: vang-b-6 / vang-a-15 sinh từ hồ sơ chưa giao thuoc-7-ngay-loc-pr nhưng ở «đã phủ ci-ma-tran-ba-o», không ở nhóm
    FAIL: TH-10 — bản gom của phiên lệch đáp án ở 7 chỗ
    Results: 3 passed, 1 failed (tin-hieu)

- eval: E11
  judged_by: judge panel đề xuất — 3 lens (domain-correctness, operational-feasibility, spec-alignment), fresh context
  proposal: FAIL
  rationale: Cả ba lens cùng đề xuất FAIL. Vế 1 (tên nhóm bằng tiếng sản phẩm) sai ở G1, G2, G4, G6 vì còn từ của git/CI/kit. Vế 2 (không gộp theo cơ chế) đạt. Vế 3 sai ở vang-b-6 và vang-a-15 (hồ sơ chưa giao thuoc-7-ngay-loc-pr) bị ghi «đã phủ ci-ma-tran-ba-o» mà dòng đã phủ không có tên nhóm hay lý do.
  required_evidence:
    - Bản gom sửa với tên G1, G2, G4, G6 viết lại bằng tiếng sản phẩm (bỏ «pre-push, làn ghim lại, S4», «CI nông», «cây onehub», «PR», «gốc eve»), lấy từ gom-bo-vang.md của lượt gom kế; hoặc chứng cứ rằng người gửi tín hiệu là kỹ sư dùng git.
    - Đoạn Vấn đề / tiêu chí trong _acceptance/ci-ma-tran-ba-o/contract.md nêu việc đo 7 ngày sau gộp (nếu có thì «đã phủ» đứng được); nếu không có thì bản gom đưa hai tín hiệu vào một nhóm riêng có tên nêu vì sao tách khỏi ci-ma-tran-ba-o.
  panel:
    - domain-correctness: FAIL — Vế 1 sai ở G1, G4, G6, G2 (từ của git, CI, kit); vế 2 đạt; vế 3 sai ở thuoc-7-ngay-loc-pr nối nhầm với ci-ma-tran-ba-o và kiem-cheo-sau-gop, dòng «đã phủ» không giải thích được bằng trục kết quả.
    - operational-feasibility: FAIL — Vế 2 đạt; vế 1 đạt phần lớn nhưng G1, G2, G6 nhiều từ cơ chế; vế 3 sai: thuoc-7-ngay-loc-pr chưa giao mà hai tín hiệu bị ghi «đã phủ — ci-ma-tran-ba-o», trái với «nghi thì vào nhóm».
    - spec-alignment: FAIL — Vế 2 đạt; vế 1 sai ở G1, G2, G6 (tên lệnh, tên kho, từ của git); vế 3 sai ở vang-b-6 và vang-a-15, dòng đã phủ không có tên nhóm hay lý do.
  human_override:  # chi nguoi ghi

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-cua-tin-hieu-gom-nhom-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r2
  exit_code: 0
  verified_at: 2026-10-11T11:16:04Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-cua-tin-hieu-gom-nhom-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r2
  exit_code: 0
  verified_at: 2026-10-11T11:16:04Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-cua-tin-hieu-gom-nhom-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r2
  exit_code: 0
  verified_at: 2026-10-11T11:16:04Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-cua-tin-hieu-gom-nhom-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r2
  exit_code: 0
  verified_at: 2026-10-11T11:16:04Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-cua-tin-hieu-gom-nhom-SUITE-bash_tests_hooks_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-10-11T11:16:04Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-cua-tin-hieu-gom-nhom-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r2
  exit_code: 0
  verified_at: 2026-10-11T11:16:04Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-cua-tin-hieu-gom-nhom-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r2
  exit_code: 0
  verified_at: 2026-10-11T11:16:04Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-cua-tin-hieu-gom-nhom-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r2
  exit_code: 0
  verified_at: 2026-10-11T11:16:04Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-cua-tin-hieu-gom-nhom-SUITE-bash_tests_workflows_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-10-11T11:16:04Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-cua-tin-hieu-gom-nhom-SUITE-node_scripts_product_map_mjs_root_check-r2
  exit_code: 0
  verified_at: 2026-10-11T11:16:04Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — không eval nào bị liệt kê là không-phân-biệt; baseline không đo được cho cả hai lệnh eval của feature nên không có eval nào được xác nhận red trên baseline (xem «Baseline khong do»).

Baseline khong do:
- node tests/scripts/tin-hieu.test.mjs: bo qua baseline: tep tests/scripts/tin-hieu.test.mjs co o cay dang kiem nhung chua co o merge-base 08ba287d30ad96a89e3103436822f298c2684296 — eval moi, chay tren code cu khong phan biet gi
- TH_CASES=TH-10,TH-10-ong,TH-10-do,TH-10-do2 node tests/scripts/tin-hieu.test.mjs: bo qua baseline: tep tests/scripts/tin-hieu.test.mjs co o cay dang kiem nhung chua co o merge-base 08ba287d30ad96a89e3103436822f298c2684296 — eval moi, chay tren code cu khong phan biet gi

Lệnh fail không gắn eval: không có (lệnh duy nhất đỏ, chạy bốn ca TH-10, gắn với E10).

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E10 failed — bản gom chấm lệch đáp án bộ vàng; hai bộ kiểm chung (RT13, NEN7) cũng đỏ. Returned to implementation (commit dd2c1bd5: sửa RT13, NEN7, câu hỏi E11, khai trước trên lịch sử kit; lượt gom lại sang luot-2).
Round 2: E10 failed — bản gom của lượt gom bộ vàng 3 (luật không đổi) lệch đáp án ở 7 chỗ: hai cặp trùng bị tách, ba tín hiệu của hồ sơ đã giao nằm ở nhóm thay vì «đã phủ», hai tín hiệu của hồ sơ chưa giao bị ghi «đã phủ»; E11 hội đồng đề xuất FAIL. E1–E9 và toàn bộ lệnh suite đạt.

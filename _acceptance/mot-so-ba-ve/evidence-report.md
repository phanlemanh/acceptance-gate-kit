---
schema_version: 2
feature_slug: mot-so-ba-ve
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 892755ec6014ccc4312afddca594c77ac2ce416c
human_signoff: Phan Le Manh 2026-09-29 — ký lượt chấm 1; Ngoài-1…5, Ngoài-7…11 ghi Known limits; Ngoài-6 mở hợp đồng mới (hạt giống); E8 Đạt; đồng ý phần cắt/hoãn; phê hết Treo
---

# Evidence Report: mot-so-ba-ve

Round 1. Mọi eval máy đều xanh; verdict là PENDING-JUDGMENT vì E8 (judgment) chờ người chốt ở Cổng 2 (hợp đồng T3: mọi mục judgment cần `human_override` của người). Các phát hiện ngoài hợp đồng nằm ở `review-findings.md`.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | test | PASS |
| E7 | AC-7 | script | PASS |
| E8 | AC-8 | judgment | PASS (judge đề xuất, chờ người chốt) |
| E9 | AC-9 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-mot-so-ba-ve-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.msbv
  verified_at: 2026-09-29T02:41:12Z
  output: |
    Lệnh gộp msbv-so + msbv-the + msbv-cau-noi chạy xong, bộ đối chiếu xác nhận có dòng PASS của MS-AC1-recipe và MS-AC1-lib-im.
    Results: 5 passed, 0 failed (msbv-cau-noi)

- eval: E2
  run_id: minted-mot-so-ba-ve-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.msbv
  verified_at: 2026-09-29T02:41:12Z
  output: |
    Lệnh gộp msbv-so + msbv-the + msbv-cau-noi chạy xong, bộ đối chiếu xác nhận có dòng PASS của MS-AC2-ba-khoi và MS-AC2-dot-bien.
    Results: 5 passed, 0 failed (msbv-cau-noi)

- eval: E3
  run_id: minted-mot-so-ba-ve-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.msbv
  verified_at: 2026-09-29T02:41:12Z
  output: |
    Lệnh gộp msbv-so + msbv-the + msbv-cau-noi chạy xong, bộ đối chiếu xác nhận có dòng PASS của MS-AC3-doc-cu, MS-AC3-nen và MS-AC3-dot-bien.
    Results: 5 passed, 0 failed (msbv-cau-noi)

- eval: E4
  run_id: minted-mot-so-ba-ve-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.msbv
  verified_at: 2026-09-29T02:41:12Z
  output: |
    Lệnh gộp msbv-so + msbv-the + msbv-cau-noi chạy xong, bộ đối chiếu xác nhận có dòng PASS của MS-AC4-thieu-gia, MS-AC4-chi-gia và MS-AC8-xuat.
    Results: 5 passed, 0 failed (msbv-cau-noi)

- eval: E5
  run_id: minted-mot-so-ba-ve-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.msbv
  verified_at: 2026-09-29T02:41:12Z
  output: |
    Lệnh gộp msbv-so + msbv-the + msbv-cau-noi chạy xong, bộ đối chiếu xác nhận có dòng PASS của MS-AC5-ma-tran, MS-AC5-lap, MS-AC5-slug, MS-AC5-rong và MS-AC5-dot-bien.
    Results: 5 passed, 0 failed (msbv-cau-noi)

- eval: E6
  run_id: minted-mot-so-ba-ve-E6-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.hooks
  verified_at: 2026-09-29T02:41:12Z
  output: |
    bash tests/hooks/run-tests.sh
    Results: 71 passed, 0 failed

- eval: E7
  run_id: minted-mot-so-ba-ve-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.msbv
  verified_at: 2026-09-29T02:41:12Z
  output: |
    Lệnh gộp msbv-so + msbv-the + msbv-cau-noi chạy xong, bộ đối chiếu xác nhận có dòng PASS của MS-AC7-van-ban.
    Results: 5 passed, 0 failed (msbv-cau-noi)

- eval: E8
  judged_by: judge panel 3 lens (fresh context, đề xuất)
  verdict: PASS
  rationale: Đề xuất của panel, chờ người chốt. Đầu vào là tệp evidence/the-cong-2-ba-ve.txt; không lens nào bỏ phiếu ngược.
  votes:
    - domain-correctness: PASS — Dòng đầu là «# fixture sha256 <64 hex> · at 2026-09-29T00:00:00Z», hex đủ 64 ký tự nên tệp đạt điều kiện «vật của lượt». Treo-1 và Treo-2 đọc được đủ ba vế (quyết gì, vì sao, sai thì tốn) bằng lời thường, không có tên biến, tên tệp hay mã eval trần. Treo-3 thiếu giá nhưng thẻ nói ra bằng «⚠ chưa khai giá nếu sai». Khối «Đã duyệt từ Gate 1» chỉ có dòng chú thích, không có dòng quyết định nào phải chấm.
    - operational-feasibility: PASS — Dòng đầu là «# fixture sha256 <64 hex> · at 2026-09-29T00:00:00Z» hợp lệ (đếm được 64 ký tự hex, có mốc ISO). Treo-1 và Treo-2 đọc được đủ quyết gì, vì sao, sai thì tốn mà không cần mở sổ. Treo-3 thiếu giá nhưng thẻ nói ra bằng «⚠ chưa khai giá nếu sai». Ở vế «quyết gì» và «sai thì tốn» không có tên biến, tên tệp hay mã eval trần. Khối «Đã duyệt từ Gate 1» chỉ có dòng ghi chú, không có dòng quyết định nào để chấm.
    - spec-alignment: PASS — Dòng đầu đúng dạng «# fixture sha256 <64 hex> · at <ISO>» (đếm đủ 64 ký tự hex). Ba dòng Treo đều đọc được quyết gì, vì sao, sai thì tốn gì mà không cần mở sổ. Treo-3 thiếu giá nhưng thẻ nói ra rõ bằng «⚠ chưa khai giá nếu sai». Hai vế «quyết gì» và «sai thì tốn» của Treo-1 và Treo-2 không có tên biến, tên tệp hay mã eval trần. Khối «Đã duyệt từ Gate 1» chỉ có một dòng ghi chú, không có dòng cũ nào để chấm, nên phần này đạt theo nghĩa rỗng.
  human_override: Phan Le Manh 2026-09-29 — Đạt

- eval: E9
  run_id: minted-mot-so-ba-ve-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.msbv
  verified_at: 2026-09-29T02:41:12Z
  output: |
    Lệnh gộp msbv-so + msbv-the + msbv-cau-noi chạy xong, bộ đối chiếu xác nhận có dòng PASS của MS-AC9-extract và MS-AC9-dot-bien.
    Results: 5 passed, 0 failed (msbv-cau-noi)

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-mot-so-ba-ve-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-09-29T02:41:12Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-mot-so-ba-ve-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 0
  verified_at: 2026-09-29T02:41:12Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-mot-so-ba-ve-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 0
  verified_at: 2026-09-29T02:41:12Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-mot-so-ba-ve-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 0
  verified_at: 2026-09-29T02:41:12Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-mot-so-ba-ve-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 0
  verified_at: 2026-09-29T02:41:12Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-mot-so-ba-ve-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-09-29T02:41:12Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-mot-so-ba-ve-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 0
  verified_at: 2026-09-29T02:41:12Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-mot-so-ba-ve-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-09-29T02:41:12Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-mot-so-ba-ve-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 0
  verified_at: 2026-09-29T02:41:12Z

## Known limits

## Ngoài hợp đồng

## Analyst

E6 (bash tests/hooks/run-tests.sh): xanh trên cả bản HEAD lẫn bản nền diffBase, tức không phân biệt được trước và sau. Cần viết lại để assert hành vi mới của hook chặn xoá thư mục tạm, hoặc xác nhận đây là regression-guard có chủ ý cho bộ 71 ca hook. Bảy eval còn lại (E1, E2, E3, E4, E5, E7, E9) không chạy được trên bản nền (baseline n-a), nên chưa chứng minh được chiều đỏ trước tính năng bằng A/B.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: mọi eval máy xanh; E8 (judgment) chờ người chốt bằng `human_override` ở Cổng 2; 11 phát hiện ngoài hợp đồng ghi ở review-findings.md, người quyết.

### Re-pin lần 1 — 2026-09-29, do lịch sử nhánh viết lại để ẩn danh dữ liệu thử trước khi đẩy (owner quyết 29/09)
run_id: repin-20260929T060104Z-35662
sha: 5cdd147e6ad160a43a76d09c2849fbfdecfe1424 · suites: 10 lệnh exit 0 · evals: 8/8 eval máy đạt kỳ vọng · ngoài làn máy: E8 · AC không có chốt máy: AC-8

### Re-pin lần 2 — 2026-09-29, do chiến dịch ghim lại theo mốc 2.19.0 — manifest và engine đổi sau pin
run_id: repin-20260929T154554Z-57815
sha: 51ef2d317b974283623dc7e8d6e0187a96e099c1 · suites: 10 lệnh exit 0 · evals: 8/8 eval máy đạt kỳ vọng · ngoài làn máy: E8 · AC không có chốt máy: AC-8

### Re-pin lần 3 — 2026-10-01, do chiến dịch ghim lại theo mốc 2.20.0
run_id: repin-20261001T175432Z-63647
sha: 1b98fdb1d9d9066bb35bdb936c0f7599e481da68 · suites: 10 lệnh exit 0 · evals: 8/8 eval máy đạt kỳ vọng · ngoài làn máy: E8 · diff chạm vật đo ngoài làn máy: E8 — chưa chứng lại, đi vòng S4 delta · AC không có chốt máy: AC-8

### Re-pin lần 4 — 2026-10-03, do chiến dịch ghim lại mốc 2.21.0
run_id: repin-20261003T125505Z-37851
sha: 5c6f2f482432b385cd4140557b251f90d668a8ec · suites: 10 lệnh exit 0 · evals: 8/8 eval máy đạt kỳ vọng · ngoài làn máy: E8 · diff chạm vật đo ngoài làn máy: E8 — chưa chứng lại, đi vòng S4 delta · AC không có chốt máy: AC-8

### Re-pin lần 5 — 2026-10-04, do chiến dịch ghim lại sau mốc 2.22.0
run_id: repin-20261004T012917Z-97809
sha: 1185eb41fc82f1208952de15a2fbbcf00eaefd86 · suites: 10 lệnh exit 0 · evals: 8/8 eval máy đạt kỳ vọng · ngoài làn máy: E8 · AC không có chốt máy: AC-8

### Re-pin lần 6 — 2026-10-06, do hoá cũ do mốc 2.23.0 (manifest, config.yaml, GUIDE)
run_id: repin-20261006T112535Z-18651
sha: 892755ec6014ccc4312afddca594c77ac2ce416c · suites: 10 lệnh exit 0 · evals: 8/8 eval máy đạt kỳ vọng · ngoài làn máy: E8 · diff chạm vật đo ngoài làn máy: E8 — chưa chứng lại, đi vòng S4 delta · AC không có chốt máy: AC-8

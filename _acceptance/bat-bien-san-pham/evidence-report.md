---
schema_version: 2
feature_slug: bat-bien-san-pham
verdict: REJECT
failed_evals: [E11]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 3a16be708a5a6a861273854ac196364d28709024
human_signoff:
---

# Evidence Report: bat-bien-san-pham

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
| E9 | AC-9 | judgment | PASS (hội đồng đề xuất, chờ người) |
| E10 | AC-10 | test | PASS |
| E11 | AC-10 | ui-check | FAIL |
| E12 | AC-9 | test | PASS |
| E13 | AC-11 | test | PASS |
| E14 | AC-8 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-bat-bien-san-pham-E1-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts_bash
  verified_at: 2026-10-12T21:34:35Z
  output: |
    Lệnh chung cho E1-E8, E10, E12-E14: bash tests/scripts/run-tests.sh --manh bash
    Results: 839 passed, 0 failed

- eval: E2
  run_id: minted-bat-bien-san-pham-E2-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts_bash
  verified_at: 2026-10-12T21:34:35Z
  output: |
    Lệnh chung cho E1-E8, E10, E12-E14: bash tests/scripts/run-tests.sh --manh bash
    Results: 839 passed, 0 failed

- eval: E3
  run_id: minted-bat-bien-san-pham-E3-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts_bash
  verified_at: 2026-10-12T21:34:35Z
  output: |
    Lệnh chung cho E1-E8, E10, E12-E14: bash tests/scripts/run-tests.sh --manh bash
    Results: 839 passed, 0 failed

- eval: E4
  run_id: minted-bat-bien-san-pham-E4-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts_bash
  verified_at: 2026-10-12T21:34:35Z
  output: |
    Lệnh chung cho E1-E8, E10, E12-E14: bash tests/scripts/run-tests.sh --manh bash
    Results: 839 passed, 0 failed

- eval: E5
  run_id: minted-bat-bien-san-pham-E5-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts_bash
  verified_at: 2026-10-12T21:34:35Z
  output: |
    Lệnh chung cho E1-E8, E10, E12-E14: bash tests/scripts/run-tests.sh --manh bash
    Results: 839 passed, 0 failed

- eval: E6
  run_id: minted-bat-bien-san-pham-E6-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts_bash
  verified_at: 2026-10-12T21:34:35Z
  output: |
    Lệnh chung cho E1-E8, E10, E12-E14: bash tests/scripts/run-tests.sh --manh bash
    Results: 839 passed, 0 failed

- eval: E7
  run_id: minted-bat-bien-san-pham-E7-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts_bash
  verified_at: 2026-10-12T21:34:35Z
  output: |
    Lệnh chung cho E1-E8, E10, E12-E14: bash tests/scripts/run-tests.sh --manh bash
    Results: 839 passed, 0 failed

- eval: E8
  run_id: minted-bat-bien-san-pham-E8-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts_bash
  verified_at: 2026-10-12T21:34:35Z
  output: |
    Lệnh chung cho E1-E8, E10, E12-E14: bash tests/scripts/run-tests.sh --manh bash
    Results: 839 passed, 0 failed

- eval: E10
  run_id: minted-bat-bien-san-pham-E10-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts_bash
  verified_at: 2026-10-12T21:34:35Z
  output: |
    Lệnh chung cho E1-E8, E10, E12-E14: bash tests/scripts/run-tests.sh --manh bash
    Results: 839 passed, 0 failed

- eval: E12
  run_id: minted-bat-bien-san-pham-E12-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts_bash
  verified_at: 2026-10-12T21:34:35Z
  output: |
    Lệnh chung cho E1-E8, E10, E12-E14: bash tests/scripts/run-tests.sh --manh bash
    Results: 839 passed, 0 failed

- eval: E13
  run_id: minted-bat-bien-san-pham-E13-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts_bash
  verified_at: 2026-10-12T21:34:35Z
  output: |
    Lệnh chung cho E1-E8, E10, E12-E14: bash tests/scripts/run-tests.sh --manh bash
    Results: 839 passed, 0 failed

- eval: E14
  run_id: minted-bat-bien-san-pham-E14-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts_bash
  verified_at: 2026-10-12T21:34:35Z
  output: |
    Lệnh chung cho E1-E8, E10, E12-E14: bash tests/scripts/run-tests.sh --manh bash
    Results: 839 passed, 0 failed

- eval: E11
  run_id: minted-bat-bien-san-pham-E11-r1
  ket_qua: không đạt — mốc "khổ 390, scrollWidth <= 390 ở cả hai thẻ" bị vi phạm khi giả lập điện thoại (scrollWidth 980 ở cả hai thẻ)
  baseline: n-a
  verifier: ui-check (định nghĩa eval không khai ref; config không có capture.ui hay dev_server — khung chụp bằng Chrome headless qua CDP, trang file://, script tạm ngoài repo)
  verified_at: 2026-10-12T21:34:35Z
  screenshot: evidence/E11-g1-rong.png   # first frame; còn E11-g2-rong.png, E11-g1-hep.png, E11-g2-hep.png, E11-g1-hep-desktopemu.png, E11-g2-hep-desktopemu.png
  observed: |
    Khổ 1280x800 (E11-g1-rong.png, E11-g2-rong.png) khớp Expected: thẻ Cổng Phạm vi có Hỏi-1 «Phạm luật SP-2 … (chủ luật: Chủ B)» và Hỏi-2 «Phạm luật SP-1 … (chủ luật: Chủ A)», nhãn khó-đảo chỉ ở Hỏi-2 (SP-1); thẻ Cổng Bằng chứng có khối «LUẬT SẢN PHẨM BỊ CHẠM» nêu SP-1, câu luật, chủ luật Chủ A, khó-đảo, apps/app/lib/a.ts:1 và dòng lệnh có ô «SP-1: sửa vật».
    Khổ 390 giả lập điện thoại (E11-g1-hep.png, E11-g2-hep.png): nội dung giống nhau nhưng bố cục dàn ở 980 rộng rồi thu nhỏ, scrollWidth 980 ở cả hai thẻ, tức KHÔNG đạt mốc <= 390. Cửa sổ hẹp thường (E11-g1-hep-desktopemu.png, E11-g2-hep-desktopemu.png) có scrollWidth 390, chữ gập dòng, không tràn ngang — chỉ là đối chiếu phụ, không thay cho mốc.
    Nguyên nhân quan sát được: HTML cả hai thẻ chỉ có meta charset, không có meta viewport và không có luật @media; scripts/lo-trinh.mjs và scripts/evidence-page.js thì có meta viewport, bộ dựng thẻ thì không.
  network_observed: unscoped

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-bat-bien-san-pham-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 0
  verified_at: 2026-10-12T21:34:35Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-bat-bien-san-pham-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 0
  verified_at: 2026-10-12T21:34:35Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-bat-bien-san-pham-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 0
  verified_at: 2026-10-12T21:34:35Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-bat-bien-san-pham-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-12T21:34:35Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-bat-bien-san-pham-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  ket_qua: không đạt — lệnh suite này KHÔNG gắn eval nào; một ca đỏ: P126 "PRODUCT-MAP.md mien tru t1 + --check canh that + co trong CI + co ADR (E18)"
  verified_at: 2026-10-12T21:34:35Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-bat-bien-san-pham-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-10-12T21:34:35Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-bat-bien-san-pham-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 0
  verified_at: 2026-10-12T21:34:35Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-bat-bien-san-pham-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-12T21:34:35Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-bat-bien-san-pham-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 0
  verified_at: 2026-10-12T21:34:35Z

### Hội đồng chấm E9 (đề xuất — người quyết ở Cổng 2)

- eval: E9
  judged_by: judge panel 3 lens (fresh context)
  verdict: PASS
  panel_votes: |
    - domain-correctness: PASS — Cả chín ý đều trả lời được từ các tệp trong danh sách Input. Mẫu product-invariants-template.md và GUIDE §8.2 nói tệp ở gốc kho, tên cố định, của kho và máy không sửa; kho không có tệp thì không đổi gì. SKILL S1 bước 0b cùng khuôn DEC-LUAT-NAP nói cách nạp và pham_luat/kho_dao. signoff.md nói hai lối «SP-<số>: sửa vật» (khuyến nghị điền sẵn) và «chấp nhận có tên», cùng ô «Tệp luật»; cả hai nhãn nằm trong GATE-ONESHOT-SLOTS. CONTEXT.md có định nghĩa và _Avoid_ cho «Luật sản phẩm». ADR 0023 nói chủ kho phê phần CỘNG ở Cổng Đáng, đường cố định để «bớt một ổ cắm», và đường đảo; ý (4) của phản biện S1 mục 7 có câu soi lựa chọn trái luật mà sổ không ghi pham_luat.
    - operational-feasibility: PASS — Đọc đủ bảy tệp Input và persona, cả chín ý đều trả lời được từ các tệp đó. (1) và (2) có ở product-invariants-template.md và GUIDE §8.2. (3) và (4) có ở SKILL S1 mục 0b cùng khuôn DEC-LUAT-NAP. (5) có ở GUIDE §8.2 và signoff.md, và hai nhãn «SP-<số>» và «Tệp luật» nằm trong GATE-ONESHOT-SLOTS. (6) đến (9) có ở template, CONTEXT.md, ADR 0023 và SKILL S1 mục 7, ý (4).
    - spec-alignment: PASS — Bảy tệp đầu vào trả lời đủ chín ý và không tệp nào mâu thuẫn tệp khác. Khuôn PRODUCT-INVARIANTS ở gốc kho, tệp của kho và máy không sửa (khuôn, GUIDE §8.2, SKILL 0b). Kho không có tệp thì không đổi gì. SKILL có khuôn DEC-LUAT-NAP và quy tắc sổ pham_luat / kho_dao theo mức. Hai ô «SP-<số>» và «Tệp luật» có trong GATE-ONESHOT-SLOTS, và signoff.md ghi hai lối cùng khuyến nghị điền sẵn «sửa vật». Dòng trỏ CLAUDE.md và lý do, định nghĩa «Luật sản phẩm» kèm _Avoid_, ADR 0023 (chủ kho phê, đường cố định, đường đảo) và câu soi (4) của S1 mục 7 đều có đúng chỗ.
  human_override:  # chi nguoi ghi

## Known limits

## Ngoài hợp đồng

## Analyst

Không-phân-biệt (xanh cả trên HEAD lẫn baseline; chứng minh harness chứ chưa chứng minh feature): E1, E2, E3, E4, E5, E6, E7, E8, E10, E12, E13, E14 — cùng nằm trong lệnh `bash tests/scripts/run-tests.sh --manh bash`. Viết lại để assert hành vi mới, hoặc xác nhận đây là regression-guard có chủ ý.

Baseline khong do: E11 (ui-check, máy ghi n-a, không kèm lý do) và E9 (judgment, không có baseline). Các lệnh suite còn lại ghi n-a, là lệnh hồi quy không gắn AC.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E11 failed — thẻ Cổng Phạm vi và Cổng Bằng chứng không có meta viewport, nên ở khổ 390 giả lập điện thoại scrollWidth là 980 chứ không <= 390; nội dung đúng ở khổ 1280. Thêm một lệnh suite không gắn eval cũng đỏ: ca P126 (PRODUCT-MAP.md miễn trừ t1 + --check cảnh thật + có trong CI + có ADR, E18) trong `tests/plugins/run-tests.sh --manh vung:1`. Returned to implementation.

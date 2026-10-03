---
schema_version: 2
feature_slug: cham-khong-tu-dot-luot
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 5c6f2f482432b385cd4140557b251f90d668a8ec
human_signoff: Phan Le Manh 2026-09-27 — ký lượt chấm 3; Ngoài-1, Ngoài-3 mở hợp đồng mới (hạt giống); Ngoài-2 ghi Known limits; E10 Đạt; đồng ý phần cắt/hoãn; phê hết Treo
---

# Evidence Report: cham-khong-tu-dot-luot

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | script | PASS |
| E7 | AC-7 | script | PASS |
| E8 | AC-8 | script | PASS |
| E9 | AC-9 | script | PASS |
| E10 | AC-10 | judgment | PASS |

## Evidence

- eval: E1
  run_id: minted-cham-khong-tu-dot-luot-E1-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ckdl
  verified_at: 2026-09-27T10:09:49Z
  output: |
    Lệnh gộp ckdl-cham/ckdl-the/ckdl-do chạy xong sạch. Có đủ dòng "PASS: CK-AC1 ",
    "PASS: CK-AC1-khung ", "PASS: CK-AC1-dot-bien " trước khi thoát.
    ckdl-do: 3 passed, 0 failed

    __EXIT=0

- eval: E2
  run_id: minted-cham-khong-tu-dot-luot-E2-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ckdl
  verified_at: 2026-09-27T10:09:49Z
  output: |
    Cùng lệnh gộp; có đủ dòng "PASS: CK-AC2 ", "PASS: CK-AC2-ui ",
    "PASS: CK-AC2-dot-bien " trước khi thoát.
    ckdl-do: 3 passed, 0 failed

    __EXIT=0

- eval: E3
  run_id: minted-cham-khong-tu-dot-luot-E3-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ckdl
  verified_at: 2026-09-27T10:09:49Z
  output: |
    Cùng lệnh gộp; có đủ dòng "PASS: CK-AC3-r2 ", "PASS: CK-AC3-r3 ",
    "PASS: CK-AC3-dot-bien " trước khi thoát.
    ckdl-do: 3 passed, 0 failed

    __EXIT=0

- eval: E4
  run_id: minted-cham-khong-tu-dot-luot-E4-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ckdl
  verified_at: 2026-09-27T10:09:49Z
  output: |
    Cùng lệnh gộp; có đủ dòng "PASS: CK-AC4 ", "PASS: CK-AC4-dot-bien " trước
    khi thoát.
    ckdl-do: 3 passed, 0 failed

    __EXIT=0

- eval: E5
  run_id: minted-cham-khong-tu-dot-luot-E5-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ckdl
  verified_at: 2026-09-27T10:09:49Z
  output: |
    Cùng lệnh gộp; có đủ dòng "PASS: CK-AC5 ", "PASS: CK-AC5-dot-bien " trước
    khi thoát.
    ckdl-do: 3 passed, 0 failed

    __EXIT=0

- eval: E6
  run_id: minted-cham-khong-tu-dot-luot-E6-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ckdl
  verified_at: 2026-09-27T10:09:49Z
  output: |
    Cùng lệnh gộp; có đủ dòng "PASS: CK-AC6 ", "PASS: CK-AC6-crm ",
    "PASS: CK-AC6-co-vang ", "PASS: CK-AC6-dot-bien " trước khi thoát.
    ckdl-do: 3 passed, 0 failed

    __EXIT=0

- eval: E7
  run_id: minted-cham-khong-tu-dot-luot-E7-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ckdl
  verified_at: 2026-09-27T10:09:49Z
  output: |
    Cùng lệnh gộp; có đủ dòng "PASS: CK-AC7 ", "PASS: CK-AC7-clean ",
    "PASS: CK-AC7-doc-cu ", "PASS: CK-AC7-dot-bien " trước khi thoát.
    ckdl-do: 3 passed, 0 failed

    __EXIT=0

- eval: E8
  run_id: minted-cham-khong-tu-dot-luot-E8-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ckdl
  verified_at: 2026-09-27T10:09:49Z
  output: |
    Cùng lệnh gộp; có đủ dòng "PASS: CK-AC8 ", "PASS: CK-AC8-doi-chung ",
    "PASS: CK-AC8-dot-bien " trước khi thoát.
    ckdl-do: 3 passed, 0 failed

    __EXIT=0

- eval: E9
  run_id: minted-cham-khong-tu-dot-luot-E9-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ckdl
  verified_at: 2026-09-27T10:09:49Z
  output: |
    Cùng lệnh gộp; có đủ dòng "PASS: CK-AC9 ", "PASS: CK-AC9-dot-bien " trước
    khi thoát.
    ckdl-do: 3 passed, 0 failed

    __EXIT=0

- eval: E10
  judged_by: judge panel (carried from round 2)
  proposal: PASS
  note: panel giữ nguyên từ round 2 — inputs không đổi, không chấm lại; rationale xem round đó.
  votes:
    - domain-correctness: PASS (r2)
    - operational-feasibility: PASS (r2)
    - spec-alignment: PASS (r2)
  human_override: Phan Le Manh 2026-09-27 — Đạt

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-cham-khong-tu-dot-luot-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r3
  exit_code: 0
  verified_at: 2026-09-27T10:09:49Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-cham-khong-tu-dot-luot-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r3
  exit_code: 0
  verified_at: 2026-09-27T10:09:49Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-cham-khong-tu-dot-luot-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r3
  exit_code: 0
  verified_at: 2026-09-27T10:09:49Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-cham-khong-tu-dot-luot-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r3
  exit_code: 0
  verified_at: 2026-09-27T10:09:49Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-cham-khong-tu-dot-luot-SUITE-bash_tests_hooks_run_tests_sh-r3
  exit_code: 0
  verified_at: 2026-09-27T10:09:49Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-cham-khong-tu-dot-luot-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r3
  exit_code: 0
  verified_at: 2026-09-27T10:09:49Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-cham-khong-tu-dot-luot-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r3
  exit_code: 0
  verified_at: 2026-09-27T10:09:49Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-cham-khong-tu-dot-luot-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r3
  exit_code: 0
  verified_at: 2026-09-27T10:09:49Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-cham-khong-tu-dot-luot-SUITE-bash_tests_workflows_run_tests_sh-r3
  exit_code: 0
  verified_at: 2026-09-27T10:09:49Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-cham-khong-tu-dot-luot-SUITE-node_scripts_product_map_mjs_root_check-r3
  exit_code: 0
  verified_at: 2026-09-27T10:09:49Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — mọi eval feature đều red trên baseline (có phân biệt)

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: BLOCKED — 3 lệnh suite hồi quy (bash tests/scripts/run-tests.sh --manh bash, tests/hooks/run-tests.sh, tests/plugins/run-tests.sh --manh vung:3) thoát với mã không đọc được (thiếu dòng __EXIT=), dù 9 eval máy (E1-E9) và E10 đã đạt. Trả về hạ tầng chạy lại, không phải sửa code.
Round 2: 9 eval máy (E1-E9) và E10 (judgment, PASS cả 3 lens) đều đạt; cả 10 lệnh suite hồi quy nay thoát sạch mã 0 (khung bọc đọc __EXIT= đã được vá ở S4-r1). Verdict PENDING-JUDGMENT — chờ human_override bắt buộc trên E10 theo luật T3; 2 phát hiện trong hợp đồng (AC-6: nhánh khoan dung `scope`) được trả về sửa.
Round 3: 9 eval máy (E1-E9) tiếp tục đạt, cả 10 lệnh suite hồi quy thoát sạch mã 0 trên verified_commit 6399949e (fix S4-r2 khớp chữ AC-6 với vật). E10 giữ nguyên panel PASS carried từ round 2 (inputs không đổi, không chấm lại). 0 phát hiện trong hợp đồng round này; 3 phát hiện mới ngoài hợp đồng ghi ở review-findings.md. Verdict vẫn PENDING-JUDGMENT — chờ human_override bắt buộc trên E10 theo luật T3.

### Re-pin lần 1 — 2026-09-27, do chiến dịch ghim lại theo mốc 2.18.5 — manifest đổi sau pin
run_id: repin-20260927T132521Z-81959
sha: 7da781a53cc4cc023094b18fa3b119b93856a690 · suites: 10 lệnh exit 0 · evals: 9/9 eval máy đạt kỳ vọng · ngoài làn máy: E10 · AC không có chốt máy: AC-10

### Re-pin lần 2 — 2026-09-29, do chiến dịch ghim lại theo mốc 2.19.0 — manifest và engine đổi sau pin
run_id: repin-20260929T154554Z-57815
sha: 51ef2d317b974283623dc7e8d6e0187a96e099c1 · suites: 10 lệnh exit 0 · evals: 9/9 eval máy đạt kỳ vọng · ngoài làn máy: E10 · diff chạm vật đo ngoài làn máy: E10 — chưa chứng lại, đi vòng S4 delta · AC không có chốt máy: AC-10

### Re-pin lần 3 — 2026-10-01, do chiến dịch ghim lại theo mốc 2.20.0
run_id: repin-20261001T175432Z-63647
sha: 1b98fdb1d9d9066bb35bdb936c0f7599e481da68 · suites: 10 lệnh exit 0 · evals: 9/9 eval máy đạt kỳ vọng · ngoài làn máy: E10 · diff chạm vật đo ngoài làn máy: E10 — chưa chứng lại, đi vòng S4 delta · AC không có chốt máy: AC-10

### Re-pin lần 4 — 2026-10-03, do chiến dịch ghim lại mốc 2.21.0
run_id: repin-20261003T125505Z-37851
sha: 5c6f2f482432b385cd4140557b251f90d668a8ec · suites: 10 lệnh exit 0 · evals: 9/9 eval máy đạt kỳ vọng · ngoài làn máy: E10 · diff chạm vật đo ngoài làn máy: E10 — chưa chứng lại, đi vòng S4 delta · AC không có chốt máy: AC-10

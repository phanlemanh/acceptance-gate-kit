---
schema_version: 2
feature_slug: cham-khong-tu-dot-luot
verdict: PENDING-JUDGMENT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: c8e8396ce441437564eac715c176a57545094023
human_signoff:
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
  run_id: minted-cham-khong-tu-dot-luot-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ckdl
  verified_at: 2026-09-27T09:37:21Z
  output: |
    Lệnh gộp ckdl-cham/ckdl-the/ckdl-do chạy xong sạch. Có đủ dòng "PASS: CK-AC1 ",
    "PASS: CK-AC1-khung ", "PASS: CK-AC1-dot-bien " trước khi thoát.
    ckdl-do: 3 passed, 0 failed

    __EXIT=0

- eval: E2
  run_id: minted-cham-khong-tu-dot-luot-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ckdl
  verified_at: 2026-09-27T09:37:21Z
  output: |
    Cùng lệnh gộp; có đủ dòng "PASS: CK-AC2 ", "PASS: CK-AC2-ui ",
    "PASS: CK-AC2-dot-bien " trước khi thoát.
    ckdl-do: 3 passed, 0 failed

    __EXIT=0

- eval: E3
  run_id: minted-cham-khong-tu-dot-luot-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ckdl
  verified_at: 2026-09-27T09:37:21Z
  output: |
    Cùng lệnh gộp; có đủ dòng "PASS: CK-AC3-r2 ", "PASS: CK-AC3-r3 ",
    "PASS: CK-AC3-dot-bien " trước khi thoát.
    ckdl-do: 3 passed, 0 failed

    __EXIT=0

- eval: E4
  run_id: minted-cham-khong-tu-dot-luot-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ckdl
  verified_at: 2026-09-27T09:37:21Z
  output: |
    Cùng lệnh gộp; có đủ dòng "PASS: CK-AC4 ", "PASS: CK-AC4-dot-bien " trước
    khi thoát.
    ckdl-do: 3 passed, 0 failed

    __EXIT=0

- eval: E5
  run_id: minted-cham-khong-tu-dot-luot-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ckdl
  verified_at: 2026-09-27T09:37:21Z
  output: |
    Cùng lệnh gộp; có đủ dòng "PASS: CK-AC5 ", "PASS: CK-AC5-dot-bien " trước
    khi thoát.
    ckdl-do: 3 passed, 0 failed

    __EXIT=0

- eval: E6
  run_id: minted-cham-khong-tu-dot-luot-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ckdl
  verified_at: 2026-09-27T09:37:21Z
  output: |
    Cùng lệnh gộp; có đủ dòng "PASS: CK-AC6 ", "PASS: CK-AC6-crm ",
    "PASS: CK-AC6-co-vang ", "PASS: CK-AC6-dot-bien " trước khi thoát.
    ckdl-do: 3 passed, 0 failed

    __EXIT=0

- eval: E7
  run_id: minted-cham-khong-tu-dot-luot-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ckdl
  verified_at: 2026-09-27T09:37:21Z
  output: |
    Cùng lệnh gộp; có đủ dòng "PASS: CK-AC7 ", "PASS: CK-AC7-clean ",
    "PASS: CK-AC7-doc-cu ", "PASS: CK-AC7-dot-bien " trước khi thoát.
    ckdl-do: 3 passed, 0 failed

    __EXIT=0

- eval: E8
  run_id: minted-cham-khong-tu-dot-luot-E8-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ckdl
  verified_at: 2026-09-27T09:37:21Z
  output: |
    Cùng lệnh gộp; có đủ dòng "PASS: CK-AC8 ", "PASS: CK-AC8-doi-chung ",
    "PASS: CK-AC8-dot-bien " trước khi thoát.
    ckdl-do: 3 passed, 0 failed

    __EXIT=0

- eval: E9
  run_id: minted-cham-khong-tu-dot-luot-E9-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ckdl
  verified_at: 2026-09-27T09:37:21Z
  output: |
    Cùng lệnh gộp; có đủ dòng "PASS: CK-AC9 ", "PASS: CK-AC9-dot-bien " trước
    khi thoát.
    ckdl-do: 3 passed, 0 failed

    __EXIT=0

- eval: E10
  judged_by: judge panel (fresh context) — 3 lens: domain-correctness, operational-feasibility, spec-alignment
  verdict: PASS
  rationale: |
    Cả ba lens đồng thuận PASS trên cùng ba đoạn trích nguồn (SKILL.md frontmatter,
    eval-executors.md mục "Exclusive resources", khối marker TOOL-KILL-RULE):
    - domain-correctness: PASS — cả ba câu trả lời được trực tiếp từ chữ trong ba
      file input, không mâu thuẫn ngữ cảnh quanh nó; (a) vòng chạy trong phiên cấp
      cao có Workflow, tác tử con không có nó; (b) driver dùng tài nguyên độc quyền
      tự xếp hàng trong thước, kit không tuần tự hoá thay; (c) đầu ra bị cắt ra tệp
      không phải bị công cụ giết — đọc đuôi tệp.
    - operational-feasibility: PASS — cùng ba đoạn trích, mỗi câu có một đoạn rõ
      ràng không mâu thuẫn văn cảnh quanh nó; kết luận giống hệt domain-correctness.
    - spec-alignment: PASS — ca ba cau deu tra loi duoc truc tiep tu chu trong ba
      file, khong mau thuan voi doan quanh no; ket luan giong hai lens tren.
    T3: verdict tổng thể của hồ sơ vẫn ở PENDING-JUDGMENT vì luật T3 đòi
    human_override bắt buộc trên MỌI mục judgment, bất kể phiếu của judge là gì.
  required_evidence:
    - (không cần — cả ba lens đều PASS, không lens nào nêu bằng-chứng-thiếu; mục
      này chờ human_override bắt buộc theo luật T3, không phải vì thiếu căn cứ)
  human_override:  # chi nguoi ghi

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-cham-khong-tu-dot-luot-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r2
  exit_code: 0
  verified_at: 2026-09-27T09:37:21Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-cham-khong-tu-dot-luot-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r2
  exit_code: 0
  verified_at: 2026-09-27T09:37:21Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-cham-khong-tu-dot-luot-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r2
  exit_code: 0
  verified_at: 2026-09-27T09:37:21Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-cham-khong-tu-dot-luot-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r2
  exit_code: 0
  verified_at: 2026-09-27T09:37:21Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-cham-khong-tu-dot-luot-SUITE-bash_tests_hooks_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-09-27T09:37:21Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-cham-khong-tu-dot-luot-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r2
  exit_code: 0
  verified_at: 2026-09-27T09:37:21Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-cham-khong-tu-dot-luot-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r2
  exit_code: 0
  verified_at: 2026-09-27T09:37:21Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-cham-khong-tu-dot-luot-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r2
  exit_code: 0
  verified_at: 2026-09-27T09:37:21Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-cham-khong-tu-dot-luot-SUITE-bash_tests_workflows_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-09-27T09:37:21Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-cham-khong-tu-dot-luot-SUITE-node_scripts_product_map_mjs_root_check-r2
  exit_code: 0
  verified_at: 2026-09-27T09:37:21Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — mọi eval feature đều red trên baseline (có phân biệt)

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: BLOCKED — 3 lệnh suite hồi quy (bash tests/scripts/run-tests.sh --manh bash, tests/hooks/run-tests.sh, tests/plugins/run-tests.sh --manh vung:3) thoát với mã không đọc được (thiếu dòng __EXIT=), dù 9 eval máy (E1-E9) và E10 đã đạt. Trả về hạ tầng chạy lại, không phải sửa code.
Round 2: 9 eval máy (E1-E9) và E10 (judgment, PASS cả 3 lens) đều đạt; cả 10 lệnh suite hồi quy nay thoát sạch mã 0 (khung bọc đọc __EXIT= đã được vá ở S4-r1). Verdict PENDING-JUDGMENT — chờ human_override bắt buộc trên E10 theo luật T3 (áp dụng bất kể judge đã đề xuất PASS).
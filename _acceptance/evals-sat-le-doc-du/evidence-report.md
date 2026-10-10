---
schema_version: 2
feature_slug: evals-sat-le-doc-du
verdict: PENDING-JUDGMENT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: e90fdfa32bdc856af4d6eae7eae2324f2c1c4046
human_signoff:
---

# Evidence Report: evals-sat-le-doc-du

Vòng 1. Mười một eval máy (E1–E11) đạt hết, mười lệnh suite hồi quy đạt hết. Còn một mục judgment (J1) chờ người: hợp đồng là T3 nên mọi mục judgment cần người trực tiếp chốt, hội đồng chỉ đề xuất.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-3 | script | PASS |
| E5 | AC-4 | script | PASS |
| E6 | AC-5 | script | PASS |
| E7 | AC-6 | script | PASS |
| E8 | AC-7 | script | PASS |
| E9 | AC-8 | script | PASS |
| E10 | AC-9 | script | PASS |
| J1 | AC-10 | judgment | PASS (đề xuất của hội đồng, chờ người chốt) |
| E11 | AC-11 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-evals-sat-le-doc-du-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.esl_ba_cach_viet
  verified_at: 2026-10-10T13:25:45Z
  output: |
    Results: 25 passed, 0 failed (evals-sat-le)

- eval: E2
  run_id: minted-evals-sat-le-doc-du-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.esl_base_do
  verified_at: 2026-10-10T13:25:45Z
  output: |
    Results: 25 passed, 0 failed (evals-sat-le)

- eval: E3
  run_id: minted-evals-sat-le-doc-du-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.esl_vi_phan_kit
  verified_at: 2026-10-10T13:25:45Z
  output: |
    Results: 25 passed, 0 failed (evals-sat-le)

- eval: E4
  run_id: minted-evals-sat-le-doc-du-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.esl_vi_phan_bay_kho
  verified_at: 2026-10-10T13:25:45Z
  output: |
    XANH: 621 hồ sơ / 7376 tiêu chí — 0 lệch ngoài sát lề; ở hồ sơ sát lề: 11 trường đọc thêm, 2 trường bỏ rác có cờ

- eval: E5
  run_id: minted-evals-sat-le-doc-du-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.esl_co_vang
  verified_at: 2026-10-10T13:25:45Z
  output: |
    Results: 25 passed, 0 failed (evals-sat-le)

- eval: E6
  run_id: minted-evals-sat-le-doc-du-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.esl_neo
  verified_at: 2026-10-10T13:25:45Z
  output: |
    Results: 25 passed, 0 failed (evals-sat-le)

- eval: E7
  run_id: minted-evals-sat-le-doc-du-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.esl_carry
  verified_at: 2026-10-10T13:25:45Z
  output: |
    Results: 25 passed, 0 failed (evals-sat-le)

- eval: E8
  run_id: minted-evals-sat-le-doc-du-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.esl_gold
  verified_at: 2026-10-10T13:25:45Z
  output: |
    Results: 25 passed, 0 failed (evals-sat-le)

- eval: E9
  run_id: minted-evals-sat-le-doc-du-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.esl_the
  verified_at: 2026-10-10T13:25:45Z
  output: |
    Results: 25 passed, 0 failed (evals-sat-le)

- eval: E10
  run_id: minted-evals-sat-le-doc-du-E10-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.esl_mot_nguon
  verified_at: 2026-10-10T13:25:45Z
  output: |
    Results: 25 passed, 0 failed (evals-sat-le)

- eval: J1
  judged_by: hội đồng ba góc nhìn (domain-correctness · operational-feasibility · spec-alignment), phiên sạch
  verdict: PASS
  rationale: Cả ba góc nhìn đề xuất PASS. Mục «evals.yaml shape» của eval-executors.md nêu rõ kit đọc cả thụt 4 lẫn sát lề, cả danh sách khối lẫn `[a, b]`; bí danh `*name` không được đọc, lên cờ vàng ở dòng s4-args và cả hai thẻ, phải viết lại thành danh sách thường; kho đang viết thụt 4 không phải làm gì. Mục «Chưa phát hành» của CHANGELOG nhắc lại các ý đó và nêu đích danh crm (393 chỗ khai `paths` nhiều dòng được giữ ô xanh, hồ sơ có bí danh sẽ thấy cờ). Đây là đề xuất, hợp đồng T3 nên người phải trực tiếp chốt.
  votes: |
    - domain-correctness: PASS — Mục «evals.yaml shape» nói rõ kit đọc cả thụt 4 lẫn sát lề, cả dạng khối lẫn `[a, b]`. Bí danh `*name` không được đọc, lên cờ vàng ở lượt chấm và hai thẻ, phải viết lại thành danh sách thường; kho viết thụt 4 không phải làm gì. Mục «Chưa phát hành» của CHANGELOG nhắc lại và nêu đích danh crm: lượt sửa nay giữ ô xanh cho `paths` nhiều dòng (393 chỗ khai), hồ sơ có bí danh sẽ thấy cờ và cần viết lại trường ấy.
    - operational-feasibility: PASS — Mục «evals.yaml shape» nêu rõ cả hai lề (thụt 4 và sát lề) và cả hai dạng (khối và `[a, b]`) cho `inputs`/`paths`/`evidence_required`/`steps`. Nêu rõ bí danh `*name` không được đọc, lên cờ vàng ở dòng s4-args và cả hai thẻ, và phải viết lại thành danh sách thường. Câu «A repo already writing the 4-space shape has nothing to do» khớp với CHANGELOG («kho viết thụt 4 — không gì»). CHANGELOG gọi tên crm: lượt sửa nay giữ ô xanh cho `paths` nhiều dòng (393 chỗ khai), và hồ sơ do bộ xuất YAML sinh có bí danh thì thấy cờ và phải viết lại trường ấy.
    - spec-alignment: PASS — Mục «evals.yaml shape» của eval-executors.md nêu đủ ba điều đầu. Một: nhận cả sát lề lẫn thụt 4, cả danh sách khối lẫn `[a, b]` một dòng. Hai: bí danh `*name` không được đọc, bị gọi tên bằng dòng `s4-args` và cờ vàng trên cả thẻ Phạm vi lẫn thẻ Bằng chứng, kèm lệnh «Rewrite those fields as plain lists». Ba: câu «A repo already writing the 4-space shape has nothing to do». Điều thứ tư nằm ở mục «Chưa phát hành» của CHANGELOG: nêu rõ crm (lượt sửa giữ ô xanh cho `paths` nhiều dòng, 393 chỗ khai), và hồ sơ có bí danh phải viết lại trường đó.
  human_override:        # T3: người điền "<tên> <ngày>" sau khi tự đọc mục «evals.yaml shape» và «Chưa phát hành»
  verified_at: 2026-10-10T13:25:45Z

- eval: E11
  run_id: minted-evals-sat-le-doc-du-E11-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.esl_luoi_ben_doc
  verified_at: 2026-10-10T13:25:45Z
  output: |
    Results: 25 passed, 0 failed (evals-sat-le)

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-evals-sat-le-doc-du-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-10-10T13:25:45Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-evals-sat-le-doc-du-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 0
  verified_at: 2026-10-10T13:25:45Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-evals-sat-le-doc-du-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 0
  verified_at: 2026-10-10T13:25:45Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-evals-sat-le-doc-du-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 0
  verified_at: 2026-10-10T13:25:45Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-evals-sat-le-doc-du-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-10T13:25:45Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-evals-sat-le-doc-du-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 0
  verified_at: 2026-10-10T13:25:45Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-evals-sat-le-doc-du-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-10-10T13:25:45Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-evals-sat-le-doc-du-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 0
  verified_at: 2026-10-10T13:25:45Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-evals-sat-le-doc-du-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-10T13:25:45Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-evals-sat-le-doc-du-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 0
  verified_at: 2026-10-10T13:25:45Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — không eval nào xanh trên cả hai phía (baseline không đo được cho cả mười eval máy vì đều là eval mới, xem mục dưới); các lệnh suite xanh-cả-hai-phía là lưới hồi quy thường, không liệt kê.

J1 (judgment, T3): hội đồng đề xuất PASS nhưng hợp đồng T3 đòi người trực tiếp chốt; `human_override` để trống cho người điền ở Cổng Bằng chứng.

### Baseline khong do

- bash -c 'out=$(node tests/scripts/evals-sat-le.test.mjs 2>&1); rc=$?; printf "%s\n" "$out" | tail -n 25; [ $rc -eq 0 ] && for c in BC1; do printf "%s\n" "$out" | grep -qF "PASS: $c " || exit 1; done': bo qua baseline: tep tests/scripts/evals-sat-le.test.mjs co o cay dang kiem nhung chua co o merge-base 3200ba3af0235b3c632fdf5022d558a416b08d22 — eval moi, chay tren code cu khong phan biet gi
- bash -c 'out=$(node tests/scripts/evals-sat-le.test.mjs 2>&1); rc=$?; printf "%s\n" "$out" | tail -n 25; [ $rc -eq 0 ] && for c in BC2; do printf "%s\n" "$out" | grep -qF "PASS: $c " || exit 1; done': bo qua baseline: tep tests/scripts/evals-sat-le.test.mjs co o cay dang kiem nhung chua co o merge-base 3200ba3af0235b3c632fdf5022d558a416b08d22 — eval moi, chay tren code cu khong phan biet gi
- bash -c 'out=$(node tests/scripts/evals-sat-le.test.mjs 2>&1); rc=$?; printf "%s\n" "$out" | tail -n 25; [ $rc -eq 0 ] && for c in VP1 VP2; do printf "%s\n" "$out" | grep -qF "PASS: $c " || exit 1; done': bo qua baseline: tep tests/scripts/evals-sat-le.test.mjs co o cay dang kiem nhung chua co o merge-base 3200ba3af0235b3c632fdf5022d558a416b08d22 — eval moi, chay tren code cu khong phan biet gi
- node tests/scripts/evals-sat-le-vi-phan.mjs --bay-kho --ghi _acceptance/evals-sat-le-doc-du/evidence/vi-phan-bay-kho.txt: bo qua baseline: tep tests/scripts/evals-sat-le-vi-phan.mjs co o cay dang kiem nhung chua co o merge-base 3200ba3af0235b3c632fdf5022d558a416b08d22 — eval moi, chay tren code cu khong phan biet gi
- bash -c 'out=$(node tests/scripts/evals-sat-le.test.mjs 2>&1); rc=$?; printf "%s\n" "$out" | tail -n 25; [ $rc -eq 0 ] && for c in CB1 CB2 CB3; do printf "%s\n" "$out" | grep -qF "PASS: $c " || exit 1; done': bo qua baseline: tep tests/scripts/evals-sat-le.test.mjs co o cay dang kiem nhung chua co o merge-base 3200ba3af0235b3c632fdf5022d558a416b08d22 — eval moi, chay tren code cu khong phan biet gi
- bash -c 'out=$(node tests/scripts/evals-sat-le.test.mjs 2>&1); rc=$?; printf "%s\n" "$out" | tail -n 25; [ $rc -eq 0 ] && for c in NEO1 NEO2 NEO3; do printf "%s\n" "$out" | grep -qF "PASS: $c " || exit 1; done': bo qua baseline: tep tests/scripts/evals-sat-le.test.mjs co o cay dang kiem nhung chua co o merge-base 3200ba3af0235b3c632fdf5022d558a416b08d22 — eval moi, chay tren code cu khong phan biet gi
- bash -c 'out=$(node tests/scripts/evals-sat-le.test.mjs 2>&1); rc=$?; printf "%s\n" "$out" | tail -n 25; [ $rc -eq 0 ] && for c in CP1 CP2 CP3; do printf "%s\n" "$out" | grep -qF "PASS: $c " || exit 1; done': bo qua baseline: tep tests/scripts/evals-sat-le.test.mjs co o cay dang kiem nhung chua co o merge-base 3200ba3af0235b3c632fdf5022d558a416b08d22 — eval moi, chay tren code cu khong phan biet gi
- bash -c 'out=$(node tests/scripts/evals-sat-le.test.mjs 2>&1); rc=$?; printf "%s\n" "$out" | tail -n 25; [ $rc -eq 0 ] && for c in GD1 GD2; do printf "%s\n" "$out" | grep -qF "PASS: $c " || exit 1; done': bo qua baseline: tep tests/scripts/evals-sat-le.test.mjs co o cay dang kiem nhung chua co o merge-base 3200ba3af0235b3c632fdf5022d558a416b08d22 — eval moi, chay tren code cu khong phan biet gi
- bash -c 'out=$(node tests/scripts/evals-sat-le.test.mjs 2>&1); rc=$?; printf "%s\n" "$out" | tail -n 25; [ $rc -eq 0 ] && for c in TH1 TH2 TH3 TH4; do printf "%s\n" "$out" | grep -qF "PASS: $c " || exit 1; done': bo qua baseline: tep tests/scripts/evals-sat-le.test.mjs co o cay dang kiem nhung chua co o merge-base 3200ba3af0235b3c632fdf5022d558a416b08d22 — eval moi, chay tren code cu khong phan biet gi
- bash -c 'out=$(node tests/scripts/evals-sat-le.test.mjs 2>&1); rc=$?; printf "%s\n" "$out" | tail -n 25; [ $rc -eq 0 ] && for c in MN1 MN2; do printf "%s\n" "$out" | grep -qF "PASS: $c " || exit 1; done': bo qua baseline: tep tests/scripts/evals-sat-le.test.mjs co o cay dang kiem nhung chua co o merge-base 3200ba3af0235b3c632fdf5022d558a416b08d22 — eval moi, chay tren code cu khong phan biet gi
- bash -c 'out=$(node tests/scripts/evals-sat-le.test.mjs 2>&1); rc=$?; printf "%s\n" "$out" | tail -n 25; [ $rc -eq 0 ] && for c in LB1 LB2; do printf "%s\n" "$out" | grep -qF "PASS: $c " || exit 1; done': bo qua baseline: tep tests/scripts/evals-sat-le.test.mjs co o cay dang kiem nhung chua co o merge-base 3200ba3af0235b3c632fdf5022d558a416b08d22 — eval moi, chay tren code cu khong phan biet gi

## Variance

none — every multi-run eval is uniform (không eval nào chạy nhiều lần; mọi eval đều deterministic, một lượt chạy mỗi eval).

## Iterations

Round 1: tất cả eval máy (E1–E11) và mười lệnh suite đạt; J1 chờ người chốt (hợp đồng T3). Không có eval nào hỏng, không trả về cài đặt.

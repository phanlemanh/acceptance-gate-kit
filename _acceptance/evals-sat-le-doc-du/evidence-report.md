---
schema_version: 2
feature_slug: evals-sat-le-doc-du
verdict: PENDING-JUDGMENT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: cc5960d9fec4b7a3422dfe1b7d7311d4409f6ac2
human_signoff:
---

# Evidence Report: evals-sat-le-doc-du

Vòng 2. Mười eval máy chạy lại (E1–E3, E5–E11) đạt hết trên bộ kiểm 27 ca; E4 mang sang nguyên từ vòng 1 vì thay đổi của vòng này không chạm vùng của nó. Mười lệnh suite hồi quy đạt hết. Còn một mục judgment (J1) chờ người: hợp đồng là T3 nên mọi mục judgment cần người trực tiếp chốt, hội đồng chỉ đề xuất.

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
  run_id: minted-evals-sat-le-doc-du-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.esl_ba_cach_viet
  verified_at: 2026-10-10T13:56:07Z
  output: |
    Results: 27 passed, 0 failed (evals-sat-le)
    ca đã ghim có mặt: BC1, BC1b

- eval: E2
  run_id: minted-evals-sat-le-doc-du-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.esl_base_do
  verified_at: 2026-10-10T13:56:07Z
  output: |
    Results: 27 passed, 0 failed (evals-sat-le)
    ca đã ghim có mặt: BC2

- eval: E3
  run_id: minted-evals-sat-le-doc-du-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.esl_vi_phan_kit
  verified_at: 2026-10-10T13:56:07Z
  output: |
    Results: 27 passed, 0 failed (evals-sat-le)
    ca đã ghim có mặt: VP1, VP2

- eval: E4
  run_id: minted-evals-sat-le-doc-du-E4-r1
  exit_code: 0
  verifier: config:executors.script.esl_vi_phan_bay_kho
  verified_at: 2026-10-10T13:25:45Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval (số liệu bảy kho nằm ở evidence/vi-phan-bay-kho.txt của vòng 1)

- eval: E5
  run_id: minted-evals-sat-le-doc-du-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.esl_co_vang
  verified_at: 2026-10-10T13:56:07Z
  output: |
    Results: 27 passed, 0 failed (evals-sat-le)
    ca đã ghim có mặt: CB1, CB2, CB3

- eval: E6
  run_id: minted-evals-sat-le-doc-du-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.esl_neo
  verified_at: 2026-10-10T13:56:07Z
  output: |
    Results: 27 passed, 0 failed (evals-sat-le)
    ca đã ghim có mặt: NEO1, NEO2, NEO3

- eval: E7
  run_id: minted-evals-sat-le-doc-du-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.esl_carry
  verified_at: 2026-10-10T13:56:07Z
  output: |
    Results: 27 passed, 0 failed (evals-sat-le)
    ca đã ghim có mặt: CP1, CP2, CP3

- eval: E8
  run_id: minted-evals-sat-le-doc-du-E8-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.esl_gold
  verified_at: 2026-10-10T13:56:07Z
  output: |
    Results: 27 passed, 0 failed (evals-sat-le)
    ca đã ghim có mặt: GD1, GD2

- eval: E9
  run_id: minted-evals-sat-le-doc-du-E9-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.esl_the
  verified_at: 2026-10-10T13:56:07Z
  output: |
    Results: 27 passed, 0 failed (evals-sat-le)
    ca đã ghim có mặt: TH1, TH2, TH3, TH4

- eval: E10
  run_id: minted-evals-sat-le-doc-du-E10-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.esl_mot_nguon
  verified_at: 2026-10-10T13:56:07Z
  output: |
    Results: 27 passed, 0 failed (evals-sat-le)
    ca đã ghim có mặt: MN1, MN2, MN2b

- eval: J1
  judged_by: hội đồng ba góc nhìn (domain-correctness · operational-feasibility · spec-alignment), phiên sạch
  verdict: PASS
  rationale: Cả ba góc nhìn đề xuất PASS. Hai tài liệu (mục «evals.yaml shape» của eval-executors và CHANGELOG «Chưa phát hành») khớp nhau: kit đọc cả thụt 4 lẫn sát lề, cả danh sách khối lẫn `[a, b]`; bí danh `*name` không được đọc, lên cờ vàng ở dòng s4-args và cả hai thẻ, phải viết lại thành danh sách thường; kho viết thụt 4 không phải làm gì; crm được lượt sửa giữ ô xanh cho `paths` dạng nhiều dòng. Không mâu thuẫn.
  votes: |
    - domain-correctness: PASS — Mục «evals.yaml shape» nói rõ kit đọc cả thụt 4 lẫn sát lề, cả dạng khối lẫn `[a, b]`. Nó cũng nói bí danh `paths: *name` không được đọc, bị lên cờ vàng ở cả thẻ phạm vi lẫn thẻ bằng chứng, và phải viết lại thành danh sách thường. Kết thúc mục: «A repo already writing the 4-space shape has nothing to do.» CHANGELOG nêu crm và tác động «lượt sửa nay giữ ô xanh cho paths dạng nhiều dòng», ghi kho thụt 4 «không gì» và bí danh sẽ thấy cờ nên cần viết lại. Hai tài liệu khớp nhau, không mâu thuẫn.
    - operational-feasibility: PASS — Cả bốn điều đều nêu rõ trong hai tệp. (1) eval-executors nói đọc kiểu sát lề lẫn thụt 4, dạng khối lẫn một dòng `[a, b]`. (2) Bí danh `*ten` "NOT read, never guessed", được nêu tên ở dòng `s4-args` và cờ vàng trên thẻ Phạm vi lẫn Bằng chứng, kèm lời dặn viết lại thành danh sách; CHANGELOG nhắc lại. (3) Cả hai tệp ghi kho viết thụt 4 không phải làm gì, CHANGELOG kèm số đo 621 hồ sơ, 0 lệch. (4) CHANGELOG nêu crm: lượt sửa giữ ô xanh cho `paths` dạng nhiều dòng (393 chỗ khai), và hồ sơ có bí danh sẽ thấy cờ.
    - spec-alignment: PASS — Mục «evals.yaml shape» của eval-executors.md nói đủ ba điều đầu. (1) Kit đọc cả dạng sát lề lẫn thụt 4, cả khối lẫn một dòng `[a, b]`. (2) Bí danh `*name` không được đọc; mỗi trường bị bỏ được nêu thành dòng `s4-args` ở lượt chấm và thành cờ vàng trên cả hai thẻ, kèm lệnh «Rewrite those fields as plain lists». (3) Câu «A repo already writing the 4-space shape has nothing to do». CHANGELOG «Chưa phát hành» nêu điều (4): crm có lượt sửa giữ ô xanh cho `paths` dạng nhiều dòng (393 chỗ khai), hồ sơ có bí danh sẽ thấy cờ và phải viết lại trường ấy, và kho thụt 4 không bị ảnh hưởng (0 lệch trên 621 hồ sơ ở bảy kho).
  human_override:        # T3: người điền "<tên> <ngày>" sau khi tự đọc mục «evals.yaml shape» và «Chưa phát hành»
  verified_at: 2026-10-10T13:56:07Z

- eval: E11
  run_id: minted-evals-sat-le-doc-du-E11-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.esl_luoi_ben_doc
  verified_at: 2026-10-10T13:56:07Z
  output: |
    Results: 27 passed, 0 failed (evals-sat-le)
    ca đã ghim có mặt: LB1, LB2

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-evals-sat-le-doc-du-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r2
  exit_code: 0
  verified_at: 2026-10-10T13:56:07Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-evals-sat-le-doc-du-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r2
  exit_code: 0
  verified_at: 2026-10-10T13:56:07Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-evals-sat-le-doc-du-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r2
  exit_code: 0
  verified_at: 2026-10-10T13:56:07Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-evals-sat-le-doc-du-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r2
  exit_code: 0
  verified_at: 2026-10-10T13:56:07Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-evals-sat-le-doc-du-SUITE-bash_tests_hooks_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-10-10T13:56:07Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-evals-sat-le-doc-du-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r2
  exit_code: 0
  verified_at: 2026-10-10T13:56:07Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-evals-sat-le-doc-du-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r2
  exit_code: 0
  verified_at: 2026-10-10T13:56:07Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-evals-sat-le-doc-du-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r2
  exit_code: 0
  verified_at: 2026-10-10T13:56:07Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-evals-sat-le-doc-du-SUITE-bash_tests_workflows_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-10-10T13:56:07Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-evals-sat-le-doc-du-SUITE-node_scripts_product_map_mjs_root_check-r2
  exit_code: 0
  verified_at: 2026-10-10T13:56:07Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — không eval nào xanh trên cả hai phía (baseline không đo được cho cả mười eval máy chạy lại vì đều là eval mới, xem mục dưới; E4 mang sang từ vòng 1); các lệnh suite xanh-cả-hai-phía là lưới hồi quy thường, không liệt kê.

J1 (judgment, T3): hội đồng đề xuất PASS nhưng hợp đồng T3 đòi người trực tiếp chốt; `human_override` để trống cho người điền ở Cổng Bằng chứng.

### Baseline khong do

- bash -c 'out=$(node tests/scripts/evals-sat-le.test.mjs 2>&1); rc=$?; printf "%s\n" "$out" | tail -n 25; [ $rc -eq 0 ] && for c in BC1 BC1b; do printf "%s\n" "$out" | grep -qF "PASS: $c " || exit 1; done': bo qua baseline: tep tests/scripts/evals-sat-le.test.mjs co o cay dang kiem nhung chua co o merge-base 3200ba3af0235b3c632fdf5022d558a416b08d22 — eval moi, chay tren code cu khong phan biet gi
- bash -c 'out=$(node tests/scripts/evals-sat-le.test.mjs 2>&1); rc=$?; printf "%s\n" "$out" | tail -n 25; [ $rc -eq 0 ] && for c in BC2; do printf "%s\n" "$out" | grep -qF "PASS: $c " || exit 1; done': bo qua baseline: tep tests/scripts/evals-sat-le.test.mjs co o cay dang kiem nhung chua co o merge-base 3200ba3af0235b3c632fdf5022d558a416b08d22 — eval moi, chay tren code cu khong phan biet gi
- bash -c 'out=$(node tests/scripts/evals-sat-le.test.mjs 2>&1); rc=$?; printf "%s\n" "$out" | tail -n 25; [ $rc -eq 0 ] && for c in VP1 VP2; do printf "%s\n" "$out" | grep -qF "PASS: $c " || exit 1; done': bo qua baseline: tep tests/scripts/evals-sat-le.test.mjs co o cay dang kiem nhung chua co o merge-base 3200ba3af0235b3c632fdf5022d558a416b08d22 — eval moi, chay tren code cu khong phan biet gi
- bash -c 'out=$(node tests/scripts/evals-sat-le.test.mjs 2>&1); rc=$?; printf "%s\n" "$out" | tail -n 25; [ $rc -eq 0 ] && for c in CB1 CB2 CB3; do printf "%s\n" "$out" | grep -qF "PASS: $c " || exit 1; done': bo qua baseline: tep tests/scripts/evals-sat-le.test.mjs co o cay dang kiem nhung chua co o merge-base 3200ba3af0235b3c632fdf5022d558a416b08d22 — eval moi, chay tren code cu khong phan biet gi
- bash -c 'out=$(node tests/scripts/evals-sat-le.test.mjs 2>&1); rc=$?; printf "%s\n" "$out" | tail -n 25; [ $rc -eq 0 ] && for c in NEO1 NEO2 NEO3; do printf "%s\n" "$out" | grep -qF "PASS: $c " || exit 1; done': bo qua baseline: tep tests/scripts/evals-sat-le.test.mjs co o cay dang kiem nhung chua co o merge-base 3200ba3af0235b3c632fdf5022d558a416b08d22 — eval moi, chay tren code cu khong phan biet gi
- bash -c 'out=$(node tests/scripts/evals-sat-le.test.mjs 2>&1); rc=$?; printf "%s\n" "$out" | tail -n 25; [ $rc -eq 0 ] && for c in CP1 CP2 CP3; do printf "%s\n" "$out" | grep -qF "PASS: $c " || exit 1; done': bo qua baseline: tep tests/scripts/evals-sat-le.test.mjs co o cay dang kiem nhung chua co o merge-base 3200ba3af0235b3c632fdf5022d558a416b08d22 — eval moi, chay tren code cu khong phan biet gi
- bash -c 'out=$(node tests/scripts/evals-sat-le.test.mjs 2>&1); rc=$?; printf "%s\n" "$out" | tail -n 25; [ $rc -eq 0 ] && for c in GD1 GD2; do printf "%s\n" "$out" | grep -qF "PASS: $c " || exit 1; done': bo qua baseline: tep tests/scripts/evals-sat-le.test.mjs co o cay dang kiem nhung chua co o merge-base 3200ba3af0235b3c632fdf5022d558a416b08d22 — eval moi, chay tren code cu khong phan biet gi
- bash -c 'out=$(node tests/scripts/evals-sat-le.test.mjs 2>&1); rc=$?; printf "%s\n" "$out" | tail -n 25; [ $rc -eq 0 ] && for c in TH1 TH2 TH3 TH4; do printf "%s\n" "$out" | grep -qF "PASS: $c " || exit 1; done': bo qua baseline: tep tests/scripts/evals-sat-le.test.mjs co o cay dang kiem nhung chua co o merge-base 3200ba3af0235b3c632fdf5022d558a416b08d22 — eval moi, chay tren code cu khong phan biet gi
- bash -c 'out=$(node tests/scripts/evals-sat-le.test.mjs 2>&1); rc=$?; printf "%s\n" "$out" | tail -n 25; [ $rc -eq 0 ] && for c in MN1 MN2 MN2b; do printf "%s\n" "$out" | grep -qF "PASS: $c " || exit 1; done': bo qua baseline: tep tests/scripts/evals-sat-le.test.mjs co o cay dang kiem nhung chua co o merge-base 3200ba3af0235b3c632fdf5022d558a416b08d22 — eval moi, chay tren code cu khong phan biet gi
- bash -c 'out=$(node tests/scripts/evals-sat-le.test.mjs 2>&1); rc=$?; printf "%s\n" "$out" | tail -n 25; [ $rc -eq 0 ] && for c in LB1 LB2; do printf "%s\n" "$out" | grep -qF "PASS: $c " || exit 1; done': bo qua baseline: tep tests/scripts/evals-sat-le.test.mjs co o cay dang kiem nhung chua co o merge-base 3200ba3af0235b3c632fdf5022d558a416b08d22 — eval moi, chay tren code cu khong phan biet gi

## Variance

none — every multi-run eval is uniform (không eval nào chạy nhiều lần; mọi eval đều deterministic, một lượt chạy mỗi eval).

## Iterations

Round 1: E1–E11 và mười lệnh suite đạt, nhưng ba phát hiện trong hợp đồng được trả về cài đặt (ma trận BC1 hằng-đúng ở AC-1, vế «không sinh tệp» của MN2 ở AC-9, lưới LB1 chỉ kiểm tên có mặt ở AC-11); commit cc5960d9 thêm chiều đỏ BC1b, MN2b và LB2 gỡ lời gọi.
Round 2: E1–E3, E5–E11 chạy lại trên bộ kiểm 27 ca (trước 25) đều đạt, E4 carry-forward từ round 1, mười lệnh suite đạt; J1 chờ người chốt (hợp đồng T3). Không eval nào hỏng.

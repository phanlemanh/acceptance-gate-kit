---
schema_version: 2
feature_slug: eval-goi-model-that-khong-chay
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 5e043c06f3347db65f3c982a357b054c1991ac1f
human_signoff: manh 2026-10-11
---

# Evidence Report: eval-goi-model-that-khong-chay

Round 3. Mười bốn eval máy (E1–E10, E12–E15) đều đạt ở lượt chạy 1/1 và cả mười lệnh suite hồi quy đều xanh (bash 837 đạt; mjs 28 + 27 + 27 đạt; hooks 71 đạt; plugins vung 1–3 xanh; workflows xanh; product-map khớp). Hội đồng E11 (AC-11, judgment) đề xuất PASS; một phiếu (spec-alignment) nêu một điểm chưa chắc về giới hạn thứ ba thiếu ngưỡng đếm, hiện đầy đủ ở mục Hội đồng E11 bên dưới. `human_override` của E11 để trống cho người quyết ở Cổng 2.

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
| E10 | AC-10 | script | PASS |
| E11 | AC-11 | judgment | PASS |
| E12 | AC-12 | script | PASS |
| E13 | AC-13 | script | PASS |
| E14 | AC-14 | script | PASS |
| E15 | AC-15 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-eval-goi-model-that-khong-chay-E1-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.egm_ac1
  verified_at: 2026-10-11T12:21:09Z
  output: |
    node _acceptance/eval-goi-model-that-khong-chay/rang/chan.mjs --ac 1
    AC-1: XANH — chiều xanh đủ, 2 phép phá đều bị bắt đúng thông điệp ghim

- eval: E2
  run_id: minted-eval-goi-model-that-khong-chay-E2-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.egm_ac2
  verified_at: 2026-10-11T12:21:09Z
  output: |
    node _acceptance/eval-goi-model-that-khong-chay/rang/chan.mjs --ac 2
    AC-2: XANH — chiều xanh đủ, 7 phép phá đều bị bắt đúng thông điệp ghim

- eval: E3
  run_id: minted-eval-goi-model-that-khong-chay-E3-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.egm_ac3
  verified_at: 2026-10-11T12:21:09Z
  output: |
    node _acceptance/eval-goi-model-that-khong-chay/rang/chan.mjs --ac 3
    AC-3: XANH — chiều xanh đủ, 2 phép phá đều bị bắt đúng thông điệp ghim

- eval: E4
  run_id: minted-eval-goi-model-that-khong-chay-E4-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.egm_ac4
  verified_at: 2026-10-11T12:21:09Z
  output: |
    node _acceptance/eval-goi-model-that-khong-chay/rang/chan.mjs --ac 4
    AC-4: XANH — chiều xanh đủ, 3 phép phá đều bị bắt đúng thông điệp ghim

- eval: E5
  run_id: minted-eval-goi-model-that-khong-chay-E5-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.egm_ac5
  verified_at: 2026-10-11T12:21:09Z
  output: |
    node _acceptance/eval-goi-model-that-khong-chay/rang/chan.mjs --ac 5
    AC-5: XANH — chiều xanh đủ, 2 phép phá đều bị bắt đúng thông điệp ghim

- eval: E6
  run_id: minted-eval-goi-model-that-khong-chay-E6-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.egm_ac6
  verified_at: 2026-10-11T12:21:09Z
  output: |
    node _acceptance/eval-goi-model-that-khong-chay/rang/chan.mjs --ac 6
    AC-6: XANH — chiều xanh đủ, 1 phép phá đều bị bắt đúng thông điệp ghim

- eval: E7
  run_id: minted-eval-goi-model-that-khong-chay-E7-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.egm_ac7
  verified_at: 2026-10-11T12:21:09Z
  output: |
    node _acceptance/eval-goi-model-that-khong-chay/rang/chan.mjs --ac 7
    AC-7: XANH — chiều xanh đủ (kèm vi-phan.mjs), 1 phép phá đều bị bắt đúng thông điệp ghim

- eval: E8
  run_id: minted-eval-goi-model-that-khong-chay-E8-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.egm_ac8
  verified_at: 2026-10-11T12:21:09Z
  output: |
    node _acceptance/eval-goi-model-that-khong-chay/rang/chan.mjs --ac 8
    AC-8: XANH — chiều xanh đủ (kèm doc-cu.mjs), 0 phép phá đều bị bắt đúng thông điệp ghim

- eval: E9
  run_id: minted-eval-goi-model-that-khong-chay-E9-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.egm_ac9
  verified_at: 2026-10-11T12:21:09Z
  output: |
    node _acceptance/eval-goi-model-that-khong-chay/rang/chan.mjs --ac 9
    AC-9: XANH — chiều xanh đủ, 1 phép phá đều bị bắt đúng thông điệp ghim

- eval: E10
  run_id: minted-eval-goi-model-that-khong-chay-E10-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.egm_ac10
  verified_at: 2026-10-11T12:21:09Z
  output: |
    node _acceptance/eval-goi-model-that-khong-chay/rang/chan.mjs --ac 10
    AC-10: XANH — chiều xanh đủ, 2 phép phá đều bị bắt đúng thông điệp ghim

- eval: E11
  judged_by: judge panel đề xuất (3 thấu kính, fresh context): domain-correctness, operational-feasibility, spec-alignment
  verdict: PASS
  rationale: Đề xuất của hội đồng là PASS. Hai phiếu PASS nêu ba tệp (GUIDE §7.1, SKILL, CHANGELOG) đủ cho cả tám ý (a)–(h) và không mâu thuẫn nhau; phiếu thứ ba nêu một điểm chưa chắc ở ý (f). Chi tiết từng phiếu ở mục «Hội đồng E11».
  human_override:  # chi nguoi ghi

- eval: E12
  run_id: minted-eval-goi-model-that-khong-chay-E12-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.egm_ac12
  verified_at: 2026-10-11T12:21:09Z
  output: |
    node _acceptance/eval-goi-model-that-khong-chay/rang/chan.mjs --ac 12
    AC-12: XANH — chiều xanh đủ (kèm pham-vi.mjs), 0 phép phá đều bị bắt đúng thông điệp ghim

- eval: E13
  run_id: minted-eval-goi-model-that-khong-chay-E13-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.egm_ac13
  verified_at: 2026-10-11T12:21:09Z
  output: |
    node _acceptance/eval-goi-model-that-khong-chay/rang/chan.mjs --ac 13
    AC-13: XANH — chiều xanh đủ, 1 phép phá đều bị bắt đúng thông điệp ghim

- eval: E14
  run_id: minted-eval-goi-model-that-khong-chay-E14-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.egm_ac14
  verified_at: 2026-10-11T12:21:09Z
  output: |
    node _acceptance/eval-goi-model-that-khong-chay/rang/chan.mjs --ac 14
    AC-14: XANH — chiều xanh đủ, 2 phép phá đều bị bắt đúng thông điệp ghim

- eval: E15
  run_id: minted-eval-goi-model-that-khong-chay-E15-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.egm_ac15
  verified_at: 2026-10-11T12:21:09Z
  output: |
    node _acceptance/eval-goi-model-that-khong-chay/rang/chan.mjs --ac 15
    AC-15: XANH — chiều xanh đủ, 3 phép phá đều bị bắt đúng thông điệp ghim

### Hội đồng E11

Panel đề xuất PASS; `human_override` của E11 để trống cho người quyết ở Cổng 2.

- domain-correctness: PASS — Ba tệp đủ cho cả tám ý (a)–(h): GUIDE §7.1 nêu khoá model_carry_cmd, dấu vân tay (id model nhà cung cấp trả, băm khoá gói, runtime; không bao giờ ghi ra), năm lớp băm, hạn 7 ngày, danh sách lý do vẫn chạy cùng cờ --chay-lai-model, bốn giới hạn có ngưỡng và lệnh dem-dung-lai-model.mjs. CHANGELOG mục «Chưa phát hành» ghi «Khoá vắng = như 2.26» (2.26.0 có thật ở dòng 125) và SKILL nói y như vậy. Ba tệp không mâu thuẫn nhau. Điểm yếu nhỏ: giới hạn «model trôi mà giữ id» chỉ có ngưỡng dạng trần tuổi 7 ngày chứ không có ngưỡng mở vòng, nhưng đọc là hiểu được.
- operational-feasibility: PASS — GUIDE §7.1 (bảng khoá và khối «Dùng lại eval model thật») nêu đủ (a)–(g): khoá `model_carry_cmd`, nội dung dấu vân tay và việc đầu ra không bao giờ ghi ra, năm lớp băm, hạn 7 ngày, các lý do vẫn chạy cùng `--chay-lai-model`, bốn giới hạn và lệnh `dem-dung-lai-model.mjs`. CHANGELOG mục «Chưa phát hành» ghi «Khoá vắng = như 2.26» (2.26.0 có trong tệp); SKILL.md dòng 83–91 nói «ba khoá vắng hẳn và làn y như 2.26». Ba tệp nhất quán với nhau, không mâu thuẫn. Lưu ý nhỏ không đổi verdict: giới hạn thứ ba (model trôi mà giữ id) chỉ có trần tuổi 7 ngày chứ không có «ngưỡng mở vòng» như ba giới hạn kia.
- spec-alignment: UNCERTAIN — Các ý (a), (b), (c), (d), (e), (g), (h) đều có đủ trong GUIDE §7.1 và CHANGELOG "Chưa phát hành". SKILL.md dẫn về GUIDE nhất quán, và tôi không thấy mâu thuẫn giữa ba tệp. Riêng (f) thiếu: GUIDE nói "bốn giới hạn khai, mỗi cái một ngưỡng", nhưng giới hạn thứ ba (model trôi mà giữ id) chỉ ghi "hạn là trần trúi 7 ngày, owner chấp nhận ở crm E15", không có ngưỡng đếm để mở lại như ba giới hạn còn lại. Bằng chứng còn thiếu: (1) một dòng ở GUIDE.md §7.1, mục «Đếm — đường đo và bốn giới hạn khai», gắn ngưỡng đếm được cho giới hạn «Model trôi mà giữ nguyên id» (chỗ lấy: `sed -n 1440,1456p GUIDE.md`, bullet thứ ba, hiện chỉ có «hạn là trần tuổi»); (2) hoặc một câu trong GUIDE.md §7.1 nêu rõ trần tuổi 7 ngày chính là ngưỡng của giới hạn này vì giới hạn không đếm được, khi đó câu mở đầu «mỗi cái một ngưỡng» mới hết mâu thuẫn với bullet thứ ba (chỗ lấy: `grep -n 'trần tuổi' GUIDE.md`).

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-eval-goi-model-that-khong-chay-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r3
  exit_code: 0
  verified_at: 2026-10-11T12:21:09Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-eval-goi-model-that-khong-chay-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r3
  exit_code: 0
  verified_at: 2026-10-11T12:21:09Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-eval-goi-model-that-khong-chay-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r3
  exit_code: 0
  verified_at: 2026-10-11T12:21:09Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-eval-goi-model-that-khong-chay-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r3
  exit_code: 0
  verified_at: 2026-10-11T12:21:09Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-eval-goi-model-that-khong-chay-SUITE-bash_tests_hooks_run_tests_sh-r3
  exit_code: 0
  verified_at: 2026-10-11T12:21:09Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-eval-goi-model-that-khong-chay-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r3
  exit_code: 0
  verified_at: 2026-10-11T12:21:09Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-eval-goi-model-that-khong-chay-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r3
  exit_code: 0
  verified_at: 2026-10-11T12:21:09Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-eval-goi-model-that-khong-chay-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r3
  exit_code: 0
  verified_at: 2026-10-11T12:21:09Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-eval-goi-model-that-khong-chay-SUITE-bash_tests_workflows_run_tests_sh-r3
  exit_code: 0
  verified_at: 2026-10-11T12:21:09Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-eval-goi-model-that-khong-chay-SUITE-node_scripts_product_map_mjs_root_check-r3
  exit_code: 0
  verified_at: 2026-10-11T12:21:09Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — mọi eval feature đều red trên baseline (có phân biệt)

Baseline khong do:

- node _acceptance/eval-goi-model-that-khong-chay/rang/chan.mjs --ac 1: bo qua baseline: tep _acceptance/eval-goi-model-that-khong-chay/rang/chan.mjs co o cay dang kiem nhung chua co o merge-base d0dc3dc4a36719a2e9c4623819fc7b75e658aa65 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/eval-goi-model-that-khong-chay/rang/chan.mjs --ac 2: bo qua baseline: tep _acceptance/eval-goi-model-that-khong-chay/rang/chan.mjs co o cay dang kiem nhung chua co o merge-base d0dc3dc4a36719a2e9c4623819fc7b75e658aa65 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/eval-goi-model-that-khong-chay/rang/chan.mjs --ac 3: bo qua baseline: tep _acceptance/eval-goi-model-that-khong-chay/rang/chan.mjs co o cay dang kiem nhung chua co o merge-base d0dc3dc4a36719a2e9c4623819fc7b75e658aa65 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/eval-goi-model-that-khong-chay/rang/chan.mjs --ac 4: bo qua baseline: tep _acceptance/eval-goi-model-that-khong-chay/rang/chan.mjs co o cay dang kiem nhung chua co o merge-base d0dc3dc4a36719a2e9c4623819fc7b75e658aa65 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/eval-goi-model-that-khong-chay/rang/chan.mjs --ac 5: bo qua baseline: tep _acceptance/eval-goi-model-that-khong-chay/rang/chan.mjs co o cay dang kiem nhung chua co o merge-base d0dc3dc4a36719a2e9c4623819fc7b75e658aa65 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/eval-goi-model-that-khong-chay/rang/chan.mjs --ac 6: bo qua baseline: tep _acceptance/eval-goi-model-that-khong-chay/rang/chan.mjs co o cay dang kiem nhung chua co o merge-base d0dc3dc4a36719a2e9c4623819fc7b75e658aa65 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/eval-goi-model-that-khong-chay/rang/chan.mjs --ac 7: bo qua baseline: tep _acceptance/eval-goi-model-that-khong-chay/rang/chan.mjs co o cay dang kiem nhung chua co o merge-base d0dc3dc4a36719a2e9c4623819fc7b75e658aa65 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/eval-goi-model-that-khong-chay/rang/chan.mjs --ac 8: bo qua baseline: tep _acceptance/eval-goi-model-that-khong-chay/rang/chan.mjs co o cay dang kiem nhung chua co o merge-base d0dc3dc4a36719a2e9c4623819fc7b75e658aa65 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/eval-goi-model-that-khong-chay/rang/chan.mjs --ac 9: bo qua baseline: tep _acceptance/eval-goi-model-that-khong-chay/rang/chan.mjs co o cay dang kiem nhung chua co o merge-base d0dc3dc4a36719a2e9c4623819fc7b75e658aa65 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/eval-goi-model-that-khong-chay/rang/chan.mjs --ac 10: bo qua baseline: tep _acceptance/eval-goi-model-that-khong-chay/rang/chan.mjs co o cay dang kiem nhung chua co o merge-base d0dc3dc4a36719a2e9c4623819fc7b75e658aa65 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/eval-goi-model-that-khong-chay/rang/chan.mjs --ac 12: bo qua baseline: tep _acceptance/eval-goi-model-that-khong-chay/rang/chan.mjs co o cay dang kiem nhung chua co o merge-base d0dc3dc4a36719a2e9c4623819fc7b75e658aa65 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/eval-goi-model-that-khong-chay/rang/chan.mjs --ac 13: bo qua baseline: tep _acceptance/eval-goi-model-that-khong-chay/rang/chan.mjs co o cay dang kiem nhung chua co o merge-base d0dc3dc4a36719a2e9c4623819fc7b75e658aa65 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/eval-goi-model-that-khong-chay/rang/chan.mjs --ac 14: bo qua baseline: tep _acceptance/eval-goi-model-that-khong-chay/rang/chan.mjs co o cay dang kiem nhung chua co o merge-base d0dc3dc4a36719a2e9c4623819fc7b75e658aa65 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/eval-goi-model-that-khong-chay/rang/chan.mjs --ac 15: bo qua baseline: tep _acceptance/eval-goi-model-that-khong-chay/rang/chan.mjs co o cay dang kiem nhung chua co o merge-base d0dc3dc4a36719a2e9c4623819fc7b75e658aa65 — eval moi, chay tren code cu khong phan biet gi

## Variance

none — mọi eval nhiều lượt đều đồng nhất (không eval nào chạy quá một lượt)

## Iterations

Round 1: E1–E10 và E12 đạt; hai lệnh suite hồi quy không gắn eval trả mã thoát khác không (mjs:1/3 — một tệp hỏng; plugins vung:3 — ca RT18 về bản chép luật ngưỡng ngoài lib trong repin-lane-dung-lai-model.test.mjs); hội đồng E11 đề xuất FAIL 3/3 vì SKILL.md dòng 74 mâu thuẫn với GUIDE.md dòng 1395-1396 và SKILL.md dòng 86. Verdict vòng này: REJECT. Returned to implementation.

Round 2: sửa S4-r1 (hằng một-ngày qua NGAY_MS, câu model_carry cũ ở SKILL.md, lớp bên đọc run-log 11 lên 13); E1–E10, E12 và cả 10 lệnh suite xanh; hội đồng E11 còn 2 phiếu UNCERTAIN và 1 phiếu PASS, cùng chỉ chữ lệch ở ca khoá vắng giữa CHANGELOG và GUIDE/SKILL. Verdict vòng này: PENDING-JUDGMENT, chờ human_override của E11 ở Cổng 2.

Round 3: sau trả lại ở Cổng 2 (owner nâng phạm vi AC-13…15, sửa lượt 3: bộ đệm git ở kho lớn, lượt dừng sớm giữ dấu lệch, dọn lệnh dấu vân tay khi bị ngắt, script đếm đúng nhãn, thước siết), E1–E10 và E12–E15 đạt, cả 10 lệnh suite xanh, hội đồng E11 đề xuất PASS (hai phiếu PASS, một phiếu nêu giới hạn thứ ba thiếu ngưỡng đếm). Verdict vòng này: PASS, E11 chờ người xác nhận ở Cổng 2.

### Re-pin lần 1 — 2026-10-11, do gộp main 56015d2b (DP4 + G2)
run_id: repin-20261011T133754Z-18085
sha: b9296acba53a60bc799443975e70812ad866b8b3 · suites: 10 lệnh exit 0 · evals: 14/14 eval máy đạt kỳ vọng · ngoài làn máy: E11 (E11 không khai paths) · AC không có chốt máy: AC-11

### Re-pin lần 2 — 2026-10-11, do gộp main 2a5916d9 (DP6)
run_id: repin-20261011T143856Z-98149
sha: deb53ad7881e9a009064e85443581e584454d40c · suites: 10 lệnh exit 0 · evals: 14/14 eval máy đạt kỳ vọng · ngoài làn máy: E11 (E11 không khai paths) · AC không có chốt máy: AC-11

### Re-pin lần 3 — 2026-10-11, do gộp main bc14a81b (#317)
run_id: repin-20261011T163135Z-18068
sha: 55053be635da5d491b196153998a7eaa0d967d31 · suites: 10 lệnh exit 0 · evals: 14/14 eval máy đạt kỳ vọng · ngoài làn máy: E11 (E11 không khai paths) · AC không có chốt máy: AC-11

### Re-pin lần 4 — 2026-10-12, do chiến dịch ghim lại 2.27.0 — 22 hồ sơ hoá cũ theo paths so v2.26.0, sau chữ ký mốc (lượt làn thứ hai)
run_id: repin-20261012T065455Z-55784
sha: 5e043c06f3347db65f3c982a357b054c1991ac1f · suites: 10 lệnh exit 0 · evals: 14/14 eval máy đạt kỳ vọng · ngoài làn máy: E11 (E11 không khai paths) · AC không có chốt máy: AC-11

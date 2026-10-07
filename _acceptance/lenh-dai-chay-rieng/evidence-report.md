---
schema_version: 2
feature_slug: lenh-dai-chay-rieng
verdict: REJECT
failed_evals: [E7]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 7235362de3d28bd8195e9a6d5b60fc808628a12a
human_signoff:
---

# Evidence Report: lenh-dai-chay-rieng

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | judgment | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | script | PASS |
| E7 | AC-7 | script | FAIL |
| E8 | AC-8 | judgment | PASS |

## Evidence

- eval: E1
  run_id: minted-lenh-dai-chay-rieng-E1-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ldcr_s4_args_lenh_dai
  verified_at: 2026-10-07T04:03:44Z
  output: |
    Results: 12 passed, 0 failed (s4-args-lenh-dai-chay-rieng)
    __EXIT=0

- eval: E2
  run_id: minted-lenh-dai-chay-rieng-E2-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ldcr_prompt_lenh_dai
  verified_at: 2026-10-07T04:03:44Z
  output: |
    Results: 26 passed, 0 failed (lenh-dai-chay-rieng)
    __EXIT=0

- eval: E3
  run_id: minted-lenh-dai-chay-rieng-E3-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ldcr_chay_nen_that
  verified_at: 2026-10-07T04:03:44Z
  output: |
    Results: 26 passed, 0 failed (lenh-dai-chay-rieng)
    __EXIT=0

- eval: E5
  run_id: minted-lenh-dai-chay-rieng-E5-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ldcr_s4_args_chay_rieng
  verified_at: 2026-10-07T04:03:44Z
  output: |
    Results: 12 passed, 0 failed (s4-args-lenh-dai-chay-rieng)
    __EXIT=0

- eval: E6
  run_id: minted-lenh-dai-chay-rieng-E6-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ldcr_thu_tu_chay_rieng
  verified_at: 2026-10-07T04:03:44Z
  output: |
    Results: 26 passed, 0 failed (lenh-dai-chay-rieng)
    __EXIT=0

- eval: E7
  run_id: minted-lenh-dai-chay-rieng-E7-r3
  exit_code: 1
  baseline: n-a
  verifier: config:executors.script.ldcr_vi_phan_khong_khai
  verified_at: 2026-10-07T04:03:44Z
  output: |
    VP1 cùng args không khai: lane máy của cây đang kiểm BẰNG HỆT v2.24.0 (thứ tự lời gọi máy, prompt máy, nhóm lệnh, verdict)
      PASS: VP1 bằng hệt base, kết cục ghim đúng ở cả hai
    VP2 chiều đỏ: bản sao coi mọi lệnh eval là chạy-riêng
      (mutant mọi eval chạy riêng) thứ tự lệnh đổi
      PASS: VP2 mutant đỏ với "thứ tự lệnh đổi"

    Results: 25 passed, 1 failed (lenh-dai-chay-rieng)
    __EXIT=1
  note: lệnh của E7 chạy cả tệp tests/workflows/lenh-dai-chay-rieng.test.mjs và đòi thoát sạch; hai ca VP1, VP2 đều đạt nhưng một ca khác trong tệp đỏ. Ca đỏ không nằm trong 25 dòng đuôi nên báo cáo này không gọi được tên nó. Cùng tệp đó chạy xanh trọn (26 đạt, 0 đỏ) ở lệnh của E2, E3 và E6 trong cùng lượt.

- eval: E4
  judged_by: judge-subagent (fresh context)
  verdict: PASS
  rationale: panel giữ nguyên từ round 2 — inputs không đổi, không chấm lại; rationale xem round đó.
  votes:
    - domain-correctness: PASS (r2)
    - operational-feasibility: PASS (r2)
    - spec-alignment: PASS (r2)
  human_override:  # chi nguoi ghi

- eval: E8
  judged_by: judge-subagent (fresh context)
  verdict: PASS
  rationale: Đề xuất panel PASS, ba lăng kính nhất trí; ô human_override để TRỐNG cho người quyết ở Cổng 2.
  votes:
    - domain-correctness: PASS — (a) eval-executors.md nêu đủ khoá long_running: số nguyên 1–240 phút, chỉ test/script, khai khi lệnh có thể chạy quá ~9 phút. Nó cũng nêu việc lượt chấm làm: chạy nền, nhật ký `.acceptance-runs/{slug}/s4-lenh-dai/r<round>-l<k>-<run>.log` kết bằng `__EXIT=<n>`, chờ theo nhịp ngắn, quá hạn thì dừng cả cây tiến trình và báo BLOCKED. (b) eval-executors.md, GUIDE §7.1 (dòng `model_evals`), CHANGELOG và comment trong acceptance-init.md đều nói eval trong model_evals chạy riêng, tuần tự, sau mọi lệnh máy khác. (c) Mục «Chưa phát hành» của CHANGELOG nêu cả hai thay đổi và có dòng «Khoá vắng = như 2.24.0». Không thấy mâu thuẫn: khoảng 1–240, trần 30 phút khi vắng khoá, quy tắc TOOL-KILL và thứ tự chạy khớp nhau giữa các tệp.
    - operational-feasibility: PASS — (a) eval-executors.md nêu đủ khoá `long_running`: số nguyên 1–240 phút, chỉ cho eval test/script, khai khi lệnh có thể chạy quá ~9 phút. Nó cũng nêu nhật ký ở `.acceptance-runs/{slug}/s4-lenh-dai/r<round>-l<k>-<run>.log` kết bằng `__EXIT=<n>`, việc chờ theo từng nhịp ngắn, và quá hạn thì dừng cả cây tiến trình rồi BLOCKED, không PASS hay FAIL. (b) eval-executors.md, GUIDE §7.1 (hàng `model_evals`) và CHANGELOG cùng nói eval trong `model_evals` chạy riêng, tuần tự, sau mọi lệnh máy khác (eval song song và chuỗi suite). (c) Mục «Chưa phát hành» của CHANGELOG nêu cả hai thay đổi và có dòng «Khoá vắng = như 2.24.0»; không thấy câu nào mâu thuẫn về hai khoá này: mốc ~9 phút, trần 30 phút khi không có khoá và đặc tả `long_running` đều khớp giữa các tệp.
    - spec-alignment: PASS — Bốn tệp đủ để trả lời cả ba ý. Ý (a): eval-executors.md nêu `long_running` là số nguyên 1–240 phút, chỉ cho test/script, khai khi lệnh có thể chạy quá ~9 phút. Nhật ký nằm ở `.acceptance-runs/{slug}/s4-lenh-dai/r<round>-l<k>-<run>.log` và kết bằng `__EXIT=<n>`. Lượt chấm chờ theo từng nhịp ngắn, quá hạn thì dừng cả cây tiến trình và báo BLOCKED. Ý (b): eval-executors.md, GUIDE dòng `model_evals`, acceptance-init (chú thích khoá) và CHANGELOG đều nói eval trong `model_evals` chạy riêng, tuần tự, sau mọi lệnh máy khác. Ý (c): mục "Chưa phát hành" nêu cả hai thay đổi và có dòng «Khoá vắng = như 2.24.0». Không thấy câu nào mâu thuẫn: ngưỡng 30 phút khi vắng khoá, "TERM rồi KILL", và ~9 phút khớp nhau giữa các tệp.
  human_override:  # chi nguoi ghi

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-lenh-dai-chay-rieng-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r3
  exit_code: 0
  verified_at: 2026-10-07T04:03:44Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-lenh-dai-chay-rieng-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r3
  exit_code: 0
  verified_at: 2026-10-07T04:03:44Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-lenh-dai-chay-rieng-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r3
  exit_code: 0
  verified_at: 2026-10-07T04:03:44Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-lenh-dai-chay-rieng-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r3
  exit_code: 0
  verified_at: 2026-10-07T04:03:44Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-lenh-dai-chay-rieng-SUITE-bash_tests_hooks_run_tests_sh-r3
  exit_code: 0
  verified_at: 2026-10-07T04:03:44Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-lenh-dai-chay-rieng-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r3
  exit_code: 0
  verified_at: 2026-10-07T04:03:44Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-lenh-dai-chay-rieng-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r3
  exit_code: 0
  verified_at: 2026-10-07T04:03:44Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-lenh-dai-chay-rieng-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r3
  exit_code: 0
  verified_at: 2026-10-07T04:03:44Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-lenh-dai-chay-rieng-SUITE-bash_tests_workflows_run_tests_sh-r3
  exit_code: 0
  verified_at: 2026-10-07T04:03:44Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-lenh-dai-chay-rieng-SUITE-node_scripts_product_map_mjs_root_check-r3
  exit_code: 0
  verified_at: 2026-10-07T04:03:44Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — moi eval feature deu red tren baseline (co phan biet)

## Variance

none — không eval nào khai runs lớn hơn 1; xem ghi chú ở khối E7 và dòng Round 3 ở Iterations về một ca trong tệp test không tái hiện giữa các lệnh cùng lượt.

## Iterations

Round 1: một phần suite scripts mjs:1/3 đỏ, không tái hiện; trả về triển khai.
Round 2: BLOCKED, nâng phạm vi (làn V): máy đọc dấu chưa-xong/quá-hạn, mốc bắt đầu tự ghi, nhãn lượt, dọn cây mồ côi, TERM rồi KILL, bộ đọc hẹp model_evals, VP1 chỉ lane máy, round-trip.
Round 3: E7 failed — lệnh của E7 thoát khác 0 vì một ca đỏ trong tệp tests/workflows/lenh-dai-chay-rieng.test.mjs (25 đạt, 1 đỏ; VP1 và VP2 đều đạt), trong khi cùng tệp chạy 26 đạt, 0 đỏ ở E2, E3, E6; ca đỏ chưa gọi được tên từ đuôi 25 dòng. Vòng 3 chạm trần, chuyển người quyết.

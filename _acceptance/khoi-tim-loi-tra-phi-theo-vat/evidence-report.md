---
schema_version: 2
feature_slug: khoi-tim-loi-tra-phi-theo-vat
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 1bad5b809ea577caf2294480d3770efe86545fee
human_signoff:
---

# Evidence Report: khoi-tim-loi-tra-phi-theo-vat

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6a | AC-6 | script | PASS |
| E6b | AC-6 | script | PASS |
| E7 | AC-7 | script | PASS |
| E8 | AC-8 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-khoi-tim-loi-tra-phi-theo-vat-E1-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ktl_w40_triage_truoc_refute
  verified_at: 2026-09-14T09:00:00Z
  output: |
    Results: 499 passed, 0 failed (acceptance-verify)

- eval: E2
  run_id: minted-khoi-tim-loi-tra-phi-theo-vat-E2-r1
  exit_code: 0
  verifier: config:executors.test.plugins
  verified_at: 2026-09-14T06:17:15Z
  carried_from_round: 1
  note: carry-forward tu round 1 — delta khong cham paths cua eval.

- eval: E3
  run_id: minted-khoi-tim-loi-tra-phi-theo-vat-E3-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ktl_vung_vat_s4args
  verified_at: 2026-09-14T09:02:00Z
  output: |
    PASS: VV8c gỡ bộ lọc vùng phủ → lib/b.js lọt vào coverageFiles (ca VV8 có răng)

    Results: 19 passed, 0 failed (s4-args-vung-vat)

- eval: E4
  run_id: minted-khoi-tim-loi-tra-phi-theo-vat-E4-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ktl_w41_vung_vat
  verified_at: 2026-09-14T09:04:00Z
  output: |
    PASS: W47 doi chung: diff khong cham ma do -> KHONG spawn measurement

    Results: 499 passed, 0 failed (acceptance-verify)

- eval: E5
  run_id: minted-khoi-tim-loi-tra-phi-theo-vat-E5-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ktl_vung_vat_mutants
  verified_at: 2026-09-14T09:06:00Z
  output: |
    PASS: VVM-CU2 fail-open phai duoc KHAI trong log, khong im lang

    Results: 15 passed, 0 failed (vung-vat-mutants)

- eval: E6a
  run_id: minted-khoi-tim-loi-tra-phi-theo-vat-E6a-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ktl_w42_w43_finding_so
  verified_at: 2026-09-14T09:08:00Z
  output: |
    PASS: W47 doi chung: diff khong cham ma do -> KHONG spawn measurement

    Results: 499 passed, 0 failed (acceptance-verify)

- eval: E6b
  run_id: minted-khoi-tim-loi-tra-phi-theo-vat-E6b-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ktl_carry_plan_dv10
  verified_at: 2026-09-14T09:10:00Z
  output: |
    PASS: DV11 doi chung duong: co sha -> exit 0 va carriedFindings Y HET nhanh exit 3

    Results: 23 passed, 0 failed

- eval: E7
  run_id: minted-khoi-tim-loi-tra-phi-theo-vat-E7-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ktl_w44_baseline_roi_gang
  verified_at: 2026-09-14T09:12:00Z
  output: |
    PASS: W46 vung vat rong -> finders.boQua liet lan bi bo
    PASS: W46 doi chung duong: vung vat co vat -> finders.chay du ba lan, boQua rong
    Results: 499 passed, 0 failed (acceptance-verify)

- eval: E8
  run_id: minted-khoi-tim-loi-tra-phi-theo-vat-E8-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ktl_wf_usage_u06
  verified_at: 2026-09-14T09:14:00Z
  output: |
    PASS: U06e wall tinh tron agent (12s)

    Results: 38 passed, 0 failed (wf-usage)

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh
  run_id: minted-khoi-tim-loi-tra-phi-theo-vat-SUITE-bash_tests_scripts_run_tests_sh-r3
  exit_code: 0
  verified_at: 2026-09-14T09:16:00Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-khoi-tim-loi-tra-phi-theo-vat-SUITE-bash_tests_hooks_run_tests_sh-r3
  exit_code: 0
  verified_at: 2026-09-14T09:18:00Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-khoi-tim-loi-tra-phi-theo-vat-SUITE-bash_tests_plugins_run_tests_sh_2_1_grep-r3
  exit_code: 0
  verified_at: 2026-09-14T09:20:00Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-khoi-tim-loi-tra-phi-theo-vat-SUITE-bash_tests_workflows_run_tests_sh-r3
  exit_code: 0
  verified_at: 2026-09-14T09:22:00Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-khoi-tim-loi-tra-phi-theo-vat-SUITE-node_scripts_product_map_mjs_root_check-r3
  exit_code: 0
  verified_at: 2026-09-14T09:24:00Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay.

- E2 — pass trên cả HEAD lẫn baseline (non-discriminating): lệnh suite plugins (`bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'`) xanh trên cả cây hiện tại lẫn diffBase, nên tự thân chưa chứng minh được hành vi mới của vòng này. Cần viết thêm case assert đúng hành vi mới (đổi khuôn writer/reader) hoặc xác nhận đây là regression-guard có chủ đích cho suite plugins nói chung, không cần viết lại.

## Variance

none — every multi-run eval is uniform.

## Iterations

Round 1: triage_failed (phân loại phạm vi không chạy được) — verdict PENDING-JUDGMENT, 13 mục eval trả về đủ nhưng toàn bộ 13 finding rơi ngoài hợp đồng chờ người soát, không mục nào máy tự sửa. Returned to implementation: fix 8 finding thật (94aa7aec), rồi 5 finding thêm ở round 1b — config.yaml hỏng YAML là nặng nhất (85d3deae), rồi ĐỔI KHUÔN bên viết truyền KẾT QUẢ / bên đọc thôi khớp glob (1b73b462, STOP-PATCHING).

Round 2: verdict REJECT — 12/13 eval đạt kỳ vọng, E4 đỏ; 20 finding qua bác bỏ, 4 trong hợp đồng, 8 finding ngoài hợp đồng mang sang từ lượt trước (T5), cụm ngoài vùng phủ 2/20. 23 agent · 1.999.743 token. E4 đỏ là NHIỄU HẠ TẦNG của làn chấm, không phải vật: chạy tay cùng chuỗi lệnh trả `rc=0` và grep khớp 1 dòng, còn `acceptance-verify.test.mjs` trả 499 đạt / 0 đỏ — cùng lớp với SIGPIPE của lượt 1. Returned to implementation: sửa 4 finding trong hợp đồng (AC-5 ×2 «đo chỉ dẫn thay vì đầu ra» ở bên đọc trong khi luật sống ở bên viết · AC-6 carry-plan nuốt carriedFindings khi thiếu sha · AC-8 bảng --md không render), cộng hai món tự gây ra mà không chờ phân loại: đường đọc-cũ cho `ngoaiVatFiles` (ĐỔI KHUÔN bỏ quên, fail-open lặng) và gỡ `feature_loop.do_globs` (hợp đồng khai đích danh là Out of scope, tôi mở lại ngay trong một lượt sửa). Commit 99458899.

Round 3: verdict REJECT — 9/9 eval script đạt kỳ vọng (E1,E3,E4,E5,E6a,E6b,E7,E8 xanh + E2 carry-forward), năm lệnh suite hồi quy đều xanh; REJECT không đến từ eval đỏ mà từ 5 finding TRONG HỢP ĐỒNG do scope-triage xác nhận: AC-4 ×2 (bộ lọc ngoài-vật `laNgoaiVat/ngoaiVatSet` chỉ xét tệp TRONG DIFF nên finding trên văn bản hồ sơ/tài liệu NGOÀI diff — ví dụ `_acceptance/<slug>/contract.md` chưa đổi ở vòng này — lọt qua triage fail-open, một mục severity high), AC-5 ×2 (fixture kiểm mutant `vung-vat-mutants.test.mjs` chép tay bản thứ tư của `globToRe` thay vì rút từ nguồn, và ca VVM-CU gõ tay danh sách glob thay vì dùng hằng số đã rút từ marker ngay phía trên nó — cùng lớp «fixture viết tay đúng khuôn bên đọc» mà CLAUDE.md gọi tên), AC-7 ×1 (evals.yaml khai `expected` ghim một dòng PASS và một chiều đỏ không tồn tại trong tệp ca — thước đã trôi khỏi vật sau đổi khuôn khoá config). 7 finding ngoài hợp đồng mới + 8 mang sang từ round 2 (T5) chờ người ở Gate 2; cụm ngoài vùng phủ 3/12. Returned to implementation: sửa cơ chế lọc ngoài-vật để không fail-open cho tệp ngoài diff, và đồng bộ fixture mutant/evals.yaml với nguồn thật.

Round 3 — phần phiên điều phối bổ sung (máy không tự ghi được): lượt này là lượt THỨ BA nên **hết trần**, và luật DỪNG-VÁ kích hoạt **lần hai** — ba finding trong hợp đồng cộng hai finding ngoài truy về CÙNG MỘT gốc: ĐỔI KHUÔN 14/09 thay một vị từ trên miền MỞ («đường dẫn này có phải vật không» — hỏi được về bất kỳ đường dẫn nào finder báo) bằng một TẬP tính trên miền ĐÓNG (chỉ tệp trong diff). Cụm-ngoài-vùng-phủ 3/12 của chính lượt này là cụm GIẢ — cả ba tệp đều ngoài diff — tức một lượt gọi người giả ở Cổng Bằng chứng. Máy DỪNG và trình owner ba lối (đổi khung · rút phạm vi · ship kèm giới hạn). **Owner chọn «đổi khung ngược»** và cấp lượt chấm thứ 4 vượt trần. Sửa ở commit 3113010c: chia theo MIỀN chứ không theo cơ chế — tệp có trong diff trả lời bằng kết quả bên viết, mọi đường dẫn khác bằng mẫu — áp cho cả `laNgoaiVat` lẫn phép đếm vùng phủ, kèm răng hai chiều W48/W48b/W48c và W49/W49b. Số của lượt (`usage-report.md`, máy đo): 24 tác tử · 16.887.264 token (tìm-lỗi 83,2 % · chứng-minh-vật 10,9 % · tổng hợp 6,0 %) · 23,7 phút, đường găng là `machine` (13,4 phút) chứ không còn là tìm-lỗi (7,9 phút); `refute` còn 5 tác tử so với 20 ở lượt chấm của release-2-12-0.
.
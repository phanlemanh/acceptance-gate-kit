---
schema_version: 2
feature_slug: khoi-tim-loi-tra-phi-theo-vat
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 67e57e339be55bcd5a6fc83b3788ee3f104d0209
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
  run_id: minted-khoi-tim-loi-tra-phi-theo-vat-E1-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ktl_w40_triage_truoc_refute
  verified_at: 2026-09-14T18:40:00Z
  output: |
      PASS: W49b mutant lam co cum bat GIA (rang song)

    Results: 512 passed, 0 failed (acceptance-verify)

- eval: E2
  run_id: minted-khoi-tim-loi-tra-phi-theo-vat-E2-r5
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-09-14T18:40:00Z
  output: |
    MUTANT-6 bi bat: doc_manifest() FAIL-LOUD ghim 'site thieu so ban: feature-loop/skills/feature-loop/SKILL.md'
    Results: all plugin tests passed

- eval: E3
  run_id: minted-khoi-tim-loi-tra-phi-theo-vat-E3-r5
  exit_code: 0
  baseline: green
  verifier: config:executors.script.ktl_vung_vat_s4args
  verified_at: 2026-09-14T18:40:00Z
  output: |
    PASS: VV8c gỡ bộ lọc vùng phủ → lib/b.js lọt vào coverageFiles (ca VV8 có răng)

    Results: 19 passed, 0 failed (s4-args-vung-vat)

- eval: E4
  run_id: minted-khoi-tim-loi-tra-phi-theo-vat-E4-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ktl_w41_vung_vat
  verified_at: 2026-09-14T18:40:00Z
  output: |
      PASS: W49b mutant lam co cum bat GIA (rang song)

    Results: 512 passed, 0 failed (acceptance-verify)

- eval: E5
  run_id: minted-khoi-tim-loi-tra-phi-theo-vat-E5-r5
  exit_code: 0
  baseline: green
  verifier: config:executors.script.ktl_vung_vat_mutants
  verified_at: 2026-09-14T18:40:00Z
  output: |
      PASS: VVM-CU2 fail-open phai duoc KHAI trong log, khong im lang

    Results: 15 passed, 0 failed (vung-vat-mutants)

- eval: E6a
  run_id: minted-khoi-tim-loi-tra-phi-theo-vat-E6a-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ktl_w42_w43_finding_so
  verified_at: 2026-09-14T18:40:00Z
  output: |
      PASS: W49b mutant lam co cum bat GIA (rang song)

    Results: 512 passed, 0 failed (acceptance-verify)

- eval: E6b
  run_id: minted-khoi-tim-loi-tra-phi-theo-vat-E6b-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ktl_carry_plan_dv10
  verified_at: 2026-09-14T18:40:00Z
  output: |
      PASS: DV11 exit 3 VAN in JSON, va carriedFindings con nguyen 1 muc
      PASS: DV11 exit 3 khai carriedEvals RONG tuong minh (khong de ben doc doan)
    Results: 23 passed, 0 failed

- eval: E7
  run_id: minted-khoi-tim-loi-tra-phi-theo-vat-E7-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ktl_w44_baseline_roi_gang
  verified_at: 2026-09-14T18:40:00Z
  output: |
      PASS: W49b mutant lam co cum bat GIA (rang song)

    Results: 512 passed, 0 failed (acceptance-verify)

- eval: E8
  run_id: minted-khoi-tim-loi-tra-phi-theo-vat-E8-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ktl_wf_usage_u06
  verified_at: 2026-09-14T18:40:00Z
  output: |
      PASS: U06e wall tinh tron agent (12s)

    Results: 38 passed, 0 failed (wf-usage)

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh
  run_id: minted-khoi-tim-loi-tra-phi-theo-vat-SUITE-bash_tests_scripts_run_tests_sh-r5
  exit_code: 0
  verified_at: 2026-09-14T18:40:00Z
  output: |
      PASS: SELF02 (doi chung duong: phep quet bat duoc loi khi no CO that)

    Results: 871 passed, 0 failed

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-khoi-tim-loi-tra-phi-theo-vat-SUITE-bash_tests_hooks_run_tests_sh-r5
  exit_code: 0
  verified_at: 2026-09-14T18:40:00Z
  output: |
      PASS: V16

    Results: 70 passed, 0 failed

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-khoi-tim-loi-tra-phi-theo-vat-SUITE-bash_tests_workflows_run_tests_sh-r5
  exit_code: 0
  verified_at: 2026-09-14T18:40:00Z
  output: |
    Results: 15 passed, 0 failed (vung-vat-mutants)

    Results: all workflow tests passed

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-khoi-tim-loi-tra-phi-theo-vat-SUITE-node_scripts_product_map_mjs_root_check-r5
  exit_code: 0
  verified_at: 2026-09-14T18:40:00Z
  output: |
    PRODUCT-MAP.md khớp hồ sơ xưởng.

## Known limits

## Ngoài hợp đồng

## Analyst

E2, E3, E5 — non-discriminating trên baseline (xanh cả head lẫn diffBase). Đã xác nhận là regression-guard có chủ ý, không phải lỗ hổng che giấu bởi feature: E2 (suite plugins) ghim thông điệp MUTANT-6 cụ thể (doc_manifest FAIL-LOUD), không chỉ pass/fail suông; E3 (s4-args-vung-vat) và E5 (vung-vat-mutants) là chính hai tệp ca giữ bộ mutant hai-chiều cho lớp "biến bất biến vùng vật" — bản thân chúng PHẢI xanh trên cả head lẫn baseline vì mutant nằm trong fixture nội bộ của ca, không trong code sản phẩm đang diff.

## Variance

none — không có eval nào runs > 1 trong vòng này (không có eval ngẫu nhiên/stochastic trong hợp đồng)

## Iterations

Round 1: triage_failed (phân loại phạm vi không chạy được) — verdict PENDING-JUDGMENT, 13 mục eval trả về đủ nhưng toàn bộ 13 finding rơi ngoài hợp đồng chờ người soát, không mục nào máy tự sửa. Returned to implementation: fix 8 finding thật (94aa7aec), rồi 5 finding thêm ở round 1b — config.yaml hỏng YAML là nặng nhất (85d3deae), rồi ĐỔI KHUÔN bên viết truyền KẾT QUẢ / bên đọc thôi khớp glob (1b73b462, STOP-PATCHING).

Round 2: verdict REJECT — 12/13 eval đạt kỳ vọng, E4 đỏ; 20 finding qua bác bỏ, 4 trong hợp đồng, 8 finding ngoài hợp đồng mang sang từ lượt trước (T5), cụm ngoài vùng phủ 2/20. 23 agent · 1.999.743 token. E4 đỏ là NHIỄU HẠ TẦNG của làn chấm, không phải vật: chạy tay cùng chuỗi lệnh trả `rc=0` và grep khớp 1 dòng, còn `acceptance-verify.test.mjs` trả 499 đạt / 0 đỏ — cùng lớp với SIGPIPE của lượt 1. Returned to implementation: sửa 4 finding trong hợp đồng (AC-5 ×2 «đo chỉ dẫn thay vì đầu ra» ở bên đọc trong khi luật sống ở bên viết · AC-6 carry-plan nuốt carriedFindings khi thiếu sha · AC-8 bảng --md không render), cộng hai món tự gây ra mà không chờ phân loại: đường đọc-cũ cho `ngoaiVatFiles` (ĐỔI KHUÔN bỏ quên, fail-open lặng) và gỡ `feature_loop.do_globs` (hợp đồng khai đích danh là Out of scope, mở lại ngay trong một lượt sửa). Commit 99458899.

Round 3: verdict REJECT — 9/9 eval script đạt kỳ vọng, năm lệnh suite hồi quy đều xanh; REJECT không đến từ eval đỏ mà từ 5 finding TRONG HỢP ĐỒNG do scope-triage xác nhận (AC-4 ×2 bộ lọc ngoài-vật fail-open cho tệp ngoài diff · AC-5 ×2 fixture mutant chép tay bản thứ tư của globToRe · AC-7 ×1 evals.yaml ghim expected trôi khỏi vật). 7 finding ngoài hợp đồng mới + 8 mang sang (T5); cụm ngoài vùng phủ 3/12 — cụm GIẢ (cả ba tệp đều ngoài diff), một lượt gọi người giả ở Cổng Bằng chứng do ĐỔI KHUÔN 14/09 thay vị từ miền MỞ bằng tập miền ĐÓNG. Máy DỪNG và trình owner ba lối; owner chọn «đổi khung ngược» (commit 3113010c, chia theo MIỀN chứ không theo cơ chế), cấp lượt chấm vượt trần.

Round 4 (lượt a — triage hỏng): verdict REJECT — 9/9 eval script đạt kỳ vọng, bốn suite hồi quy xanh nhưng `tests/plugins/run-tests.sh` đỏ ở P93. Scope-triage KHÔNG chạy được (`triage_failed: true`): không finding nào máy xác nhận, toàn bộ 15 finding chờ người ở Gate 2; cụm ngoài vùng phủ 4/9. Returned to implementation: chưa — round dừng ở REJECT cộng triage hỏng, chờ owner quyết trước khi mở lượt sửa kế tiếp.

Round 4 (lượt b — sau owner quyết): verdict REJECT nhưng KHÔNG eval nào đỏ — hai thứ chặn PASS đều ở THƯỚC, không ở vật: (1) `tests/plugins/run-tests.sh` đỏ P93 một lần không tái hiện được — làn chấm tự lọc mất thông điệp assert bằng `grep -E "FAIL|^Results:"` (làn tự huỷ bằng chứng của chính nó); (2) triage phân loại 9/10 finding rồi bỏ sót mục thứ mười → `triageFailed=true` theo thiết kế, refute chạy trên toàn bộ 10 finding thay vì 5. 9 finding mới + 6 mang sang (T5) chờ người; mục nặng nhất: `expected` của E7/E4 ghim dòng PASS mà `output` (`tail -n 25`) không thể chứa.

Round 5: verdict PASS — cả 9 eval (E1–E8, gồm E6a/E6b cùng AC-6) xanh trên head, bốn lệnh suite hồi quy (scripts, hooks, workflows, product-map --check) xanh, và suite plugins (nay gắn vào E2) cũng xanh — P93 của round 4 không tái hiện, làn chấm không còn tự huỷ bằng chứng của chính nó. Scope-triage CHẠY ĐỦ (không triage_failed): 12 finding thật được xác nhận, cả 12 đều rơi NGOÀI hợp đồng (0 trong hợp đồng); 4/12 rơi vào ba tệp không bộ đo nào phủ (`tests/scripts/config-yaml-that.test.mjs`, `tests/scripts/finding-line-bo-doc.test.mjs`, `_acceptance/khoi-tim-loi-tra-phi-theo-vat/evals.yaml`) — cụm ngoài vùng phủ THẬT (cùng hình dạng với cụm 4/9 của round 4, khác cụm giả 3/12 của round 3), owner cần dừng và quyết mở rộng hợp đồng hay rút phạm vi. Ba eval E2/E3/E5 vẫn xanh-trên-cả-hai-phía, đã xác nhận là regression-guard có chủ ý. Đây là lượt chấm THỨ NĂM — vượt trần T2 thường trực (3 vòng), tiếp tục dưới lượt vượt trần owner đã cấp ở cổng DỪNG-VÁ round 3 (commit 3113010c) cho tới khi hai thứ chặn ở THƯỚC của round 4 được xử lý xong.

Round 5: verdict **PASS** — `failedEvals` rỗng, `failedCommands` rỗng, `blocked` rỗng, `triageFailed: false`, `rejectFindings` rỗng. Chạy ĐẦY ĐỦ (`--no-carry`): cả 9 eval và 5 lệnh suite đều chạy lại trên cây này, không mục nào mang màu xanh cũ sang. Suite plugins XANH — xác nhận màu đỏ P93 của lượt 4 là chập chờn, không phải vật (đã chạy tay 5 lần trước đó, đều xanh; lần thứ sáu này là do máy chấm chạy).

Phép chia MIỀN của SỬA KHUNG đứng vững ở lượt chạy sạch: cụm-ngoài-vùng-phủ 4/12 nằm trên `tests/scripts/config-yaml-that.test.mjs`, `tests/scripts/finding-line-bo-doc.test.mjs` và `_acceptance/<slug>/evals.yaml` — cả ba đều CÓ trong diff và không eval nào khai trong `paths`, tức cụm THẬT. So với lượt 3 báo cụm 3/12 toàn tệp NGOÀI diff (cụm giả) thì đây đúng là thứ phép chia miền sinh ra để phân biệt.

Còn **12 mục ngoài hợp đồng** (mọi mục đều `known-limits`), nên gói không xanh-sạch theo sáu điều kiện — khối «Ngoài hợp đồng» có mặt và KHÔNG rỗng. Vòng dừng ở Cổng Bằng chứng cho owner quyết, đúng thiết kế. Máy cố ý KHÔNG tự sửa các mục này.

Số của lượt (`usage-report.md`, máy đo): 20 tác tử · 16.715.215 token · 20,4 phút · refute 4 tác tử.

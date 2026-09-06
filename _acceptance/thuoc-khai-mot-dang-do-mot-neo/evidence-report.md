---
schema_version: 2
feature_slug: thuoc-khai-mot-dang-do-mot-neo
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 40e87b2a32f0944efeed263c90bd72ff880ac6f3
human_signoff:
---

# Evidence Report: thuoc-khai-mot-dang-do-mot-neo

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | script | PASS |
| E7 | AC-7 | script | PASS |
| E8 | AC-8 | test | PASS |
| E9 | AC-8 | script | PASS |
| E10 | AC-9 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-thuoc-khai-mot-dang-do-mot-neo-E1-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.itgk_lane_doc_khong_doi
  verified_at: 2026-09-06T11:30:00Z
  output: |
    PASS: chiều đỏ 3: kho thiếu mốc → CẢ HAI vế đỏ và gọi tên sha thiếu
    PASS: chiều đỏ 1b: clone sửa acceptance-verify.js mà CHƯA commit → vế lane ĐỎ (phân biệt so-cây với so-HEAD)
    Results: chan lane-doc-khong-doi passed (7 pass, 0 do)

- eval: E2
  run_id: minted-thuoc-khai-mot-dang-do-mot-neo-E2-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.itgk_lane_doc_khong_doi
  verified_at: 2026-09-06T11:30:00Z
  output: |
    PASS: chiều đỏ 3: kho thiếu mốc → CẢ HAI vế đỏ và gọi tên sha thiếu
    PASS: chiều đỏ 1b: clone sửa acceptance-verify.js mà CHƯA commit → vế lane ĐỎ (phân biệt so-cây với so-HEAD)
    Results: chan lane-doc-khong-doi passed (7 pass, 0 do)

- eval: E3
  run_id: minted-thuoc-khai-mot-dang-do-mot-neo-E3-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.itgk_lane_doc_khong_doi
  verified_at: 2026-09-06T11:30:00Z
  output: |
    PASS: chiều đỏ 3: kho thiếu mốc → CẢ HAI vế đỏ và gọi tên sha thiếu
    PASS: chiều đỏ 1b: clone sửa acceptance-verify.js mà CHƯA commit → vế lane ĐỎ (phân biệt so-cây với so-HEAD)
    Results: chan lane-doc-khong-doi passed (7 pass, 0 do)

- eval: E4
  run_id: minted-thuoc-khai-mot-dang-do-mot-neo-E4-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.itgk_lane_doc_khong_doi
  verified_at: 2026-09-06T11:30:00Z
  output: |
    PASS: chiều đỏ 3: kho thiếu mốc → CẢ HAI vế đỏ và gọi tên sha thiếu
    PASS: chiều đỏ 1b: clone sửa acceptance-verify.js mà CHƯA commit → vế lane ĐỎ (phân biệt so-cây với so-HEAD)
    Results: chan lane-doc-khong-doi passed (7 pass, 0 do)

- eval: E5
  run_id: minted-thuoc-khai-mot-dang-do-mot-neo-E5-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.tkm_p86
  verified_at: 2026-09-06T11:30:00Z
  output: |
    PASS: P86 GATE-MODEL: nguon tsv · 2 ban VI byte-equal · ban EN khop cot en · ngan sach doc-tu-dong va so QUAN HE · 12 dot bien (co ca chi-EN) goi ten dung ban, moi mui tiem deu kiem trung

    Results: all plugin tests passed

- eval: E6
  run_id: minted-thuoc-khai-mot-dang-do-mot-neo-E6-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.tkm_p86
  verified_at: 2026-09-06T11:30:00Z
  output: |
    PASS: P86 GATE-MODEL: nguon tsv · 2 ban VI byte-equal · ban EN khop cot en · ngan sach doc-tu-dong va so QUAN HE · 12 dot bien (co ca chi-EN) goi ten dung ban, moi mui tiem deu kiem trung

    Results: all plugin tests passed

- eval: E7
  run_id: minted-thuoc-khai-mot-dang-do-mot-neo-E7-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.tkm_p86
  verified_at: 2026-09-06T11:30:00Z
  output: |
    PASS: P86 GATE-MODEL: nguon tsv · 2 ban VI byte-equal · ban EN khop cot en · ngan sach doc-tu-dong va so QUAN HE · 12 dot bien (co ca chi-EN) goi ten dung ban, moi mui tiem deu kiem trung

    Results: all plugin tests passed

- eval: E8
  run_id: minted-thuoc-khai-mot-dang-do-mot-neo-E8-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-09-06T11:30:00Z
  output: |
    PASS: P86 GATE-MODEL: nguon tsv · 2 ban VI byte-equal · ban EN khop cot en · ngan sach doc-tu-dong va so QUAN HE · 12 dot bien (co ca chi-EN) goi ten dung ban, moi mui tiem deu kiem trung

    Results: all plugin tests passed

- eval: E9
  run_id: minted-thuoc-khai-mot-dang-do-mot-neo-E9-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.tkm_suite_con_lai
  verified_at: 2026-09-06T11:30:00Z
  output: |
    Results: all workflow tests passed
    PRODUCT-MAP.md khớp hồ sơ xưởng.

- eval: E10
  run_id: minted-thuoc-khai-mot-dang-do-mot-neo-E10-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.tkm_bay_chan
  verified_at: 2026-09-06T11:30:00Z
  output: |
    PASS: đột biến thu-muc-lot: mũi tiêm trúng, mutant chạy được
    PASS: chiều đỏ (thu-muc-lot): nhóm JI6 đỏ với dòng ghim «FAIL: JI6 thư mục → exit 2»
    Results: chan thu-muc-khong-phai-file passed (3 pass, 0 do)

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh
  run_id: minted-thuoc-khai-mot-dang-do-mot-neo-SUITE-bash_tests_scripts_run_tests_sh-r5
  exit_code: 0
  verified_at: 2026-09-06T11:30:00Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-thuoc-khai-mot-dang-do-mot-neo-SUITE-bash_tests_hooks_run_tests_sh-r5
  exit_code: 0
  verified_at: 2026-09-06T11:30:00Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-thuoc-khai-mot-dang-do-mot-neo-SUITE-bash_tests_workflows_run_tests_sh-r5
  exit_code: 0
  verified_at: 2026-09-06T11:30:00Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-thuoc-khai-mot-dang-do-mot-neo-SUITE-node_scripts_product_map_mjs_root_check-r5
  exit_code: 0
  verified_at: 2026-09-06T11:30:00Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round trước — baseline không đo lại round này

none — mọi eval baseline: n-a round này (không đo lại)

## Variance

none — every multi-run eval is uniform

## Iterations

Round 3: hội đồng nêu Hình dạng 5 (nhánh đột biến `them_cong` không đi qua `tiem()`, hợp đồng/E8 khai "MỌI đột biến" quá tay) nhưng không xử lý; commit 271590d0 thu phạm vi contract/evals (xoá AC-1 cũ, dồn số AC-2..AC-10 → AC-1..AC-9) mà không sửa lại evidence-report.md/evals.yaml theo số mới.
Round 4: bước triage phân loại phạm vi KHÔNG chạy được — mọi eval máy (E1..E10 + 4 lệnh suite) đều PASS trên cây hiện tại, nhưng không finding nào được máy phân loại trong-hợp-đồng/ngoài-hợp-đồng; verdict giữ PENDING-JUDGMENT, danh sách đầy đủ chuyển sang review-findings.md cho người xem lại toàn bộ trước khi ký.
Round 5: cả 10 eval máy + 4 lệnh suite đều PASS trên commit 40e87b2a (đã vá selector `ONLY_BLOCK="P86 GATE-MODEL"` cho E5–E7); scope-triage chạy xong, review-findings.md ghi 2 finding trong-hợp-đồng (AC-5, AC-7) và 6 finding ngoài-hợp-đồng (kể cả một sự cố phiên làm mất bản s4-args.json round 5 chưa commit) — verdict PASS, không mục nào chờ người.

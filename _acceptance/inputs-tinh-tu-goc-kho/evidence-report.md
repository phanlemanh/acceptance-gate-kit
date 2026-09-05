---
schema_version: 2
feature_slug: inputs-tinh-tu-goc-kho
verdict: PASS
failed_evals: []
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 631461e7d120355123862c6930b27157856c8900
human_signoff:
---

# Evidence Report: inputs-tinh-tu-goc-kho

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | judgment | PASS |
| E6 | AC-6 | script | PASS |
| E7 | AC-5 | script | PASS |
| E8 | AC-7 | script | PASS |
| E9 | AC-8 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-inputs-tinh-tu-goc-kho-E1-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.itgk_goc_kho_giu
  verified_at: 2026-09-05T04:00:00Z
  output: |
    PASS: đột biến goc-cu: mũi tiêm trúng, mutant chạy được
    PASS: chiều đỏ (goc-cu): nhóm JI1 đỏ với dòng ghim «FAIL: JI1 inputs = abs path tính từ gốc kho»
    Results: chan goc-kho-giu passed (3 pass, 0 do)

- eval: E2
  run_id: minted-inputs-tinh-tu-goc-kho-E2-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.itgk_thieu_exit_2
  verified_at: 2026-09-05T04:00:00Z
  output: |
    PASS: đột biến fail-open: mũi tiêm trúng, mutant chạy được
    PASS: chiều đỏ (fail-open): nhóm JI2 đỏ với dòng ghim «FAIL: JI2 exit 2»
    Results: chan thieu-exit-2 passed (3 pass, 0 do)

- eval: E3
  run_id: minted-inputs-tinh-tu-goc-kho-E3-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.itgk_duong_cu_goi_y
  verified_at: 2026-09-05T04:00:00Z
  output: |
    PASS: đột biến goi-y-sai: mũi tiêm trúng, mutant chạy được
    PASS: chiều đỏ (goi-y-sai): nhóm JI3 đỏ với dòng ghim «FAIL: JI3 gợi ý viết lại «src/a.ts»»
    Results: chan duong-cu-goi-y passed (5 pass, 0 do)

- eval: E4
  run_id: minted-inputs-tinh-tu-goc-kho-E4-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.itgk_abs_hai_chieu
  verified_at: 2026-09-05T04:00:00Z
  output: |
    PASS: đột biến fail-open: mũi tiêm trúng, mutant chạy được
    PASS: chiều đỏ (fail-open): nhóm JI4 đỏ với dòng ghim «FAIL: JI4 abs path không có → exit 2 nêu tên, không sinh tệp»
    Results: chan abs-hai-chieu passed (3 pass, 0 do)

- eval: E5
  judged_by: judge panel (fresh context) — domain-correctness, operational-feasibility, spec-alignment
  verdict: PASS
  votes:
    - domain-correctness: PASS — Cả ba nơi (eval-executors.md dòng 62-64, SKILL.md acceptance Phase 2 mục 3b + Phase 3 VERIFY bước 2, feature-loop SKILL.md bước chuẩn bị args S4) đều nói MỘT gốc — repo root hoặc tuyệt đối — cho `inputs` giống `paths`, và không lệ nào bằng gốc thư mục hồ sơ. Ví dụ trong eval-executors.md (E4) đã dùng đường dẫn đủ tiền tố `_acceptance/login-flow/...` tính từ gốc kho, không còn ví dụ bare `contract.md`/`evidence/...` kiểu cũ. Cả ba đều nêu hệ quả input vắng là dừng có tên (exit 2, "file named"/"gọi tên file"), và không chỗ nào còn mô tả hành vi cũ dạng "inputs judgment → abs path" trần thiếu gốc.
    - operational-feasibility: PASS — Cả ba nơi đều nói MỘT gốc — kho hoặc tuyệt đối — cho `inputs`/`paths`: eval-executors.md dòng 62-64 ("share ONE root: the repo root, or an absolute path... Never write them relative to `_acceptance/{slug}/`"), SKILL.md mục 3b dòng 126-128 (giống hệt) và vế VERIFY dòng ~259-261 ("repo-root paths made absolute; a missing input stops args generation with exit 2"), feature-loop SKILL.md dòng 173 ("`inputs` judgment tính từ GỐC KHO (cùng gốc với `paths`) → abs path"). Ví dụ evals.yaml trong eval-executors.md (dòng 55) viết `_acceptance/login-flow/contract.md` — đã có tiền tố gốc kho, không còn dạng bare "contract.md"/"evidence/..." kiểu thư mục hồ sơ. Cả ba đều nêu hệ quả input vắng là dừng có tên (exit 2, file named / "gọi tên file"). Không còn chỗ nào mô tả hành vi cũ dạng "→ abs path" trần thiếu gốc.
    - spec-alignment: PASS — Cả ba nơi nói cùng MỘT gốc: eval-executors.md:62 "`inputs` (judgment) and `paths` (any eval) share ONE root: the repo root, or an absolute path"; SKILL.md:126-127 "`inputs`... and `paths`... are written from the repo root (or absolute)"; feature-loop SKILL.md:173 "`inputs` judgment tính từ GỐC KHO (cùng gốc với `paths`)" — nhất quán, không mâu thuẫn. Mẫu evals.yaml (eval-executors.md:55) đã đổi sang `_acceptance/login-flow/contract.md` và `_acceptance/login-flow/evidence/E3-step3.png` — không còn ví dụ "contract.md" hay "evidence/..." trần theo thư mục hồ sơ. Cả ba đều nêu hệ quả input vắng: eval-executors.md:65-66 và SKILL.md:127-129 "exit 2, file named"; feature-loop SKILL.md:173 "exit 2 gọi tên file, không sinh tệp". Grep toàn văn "inputs" trên cả ba file (5 lần xuất hiện) không còn chỗ nào mô tả hành vi cũ dạng "inputs judgment → abs path" trần thiếu gốc.
  rationale: Ba lens đồng thuận PASS trên cùng một căn cứ — ba tài liệu (eval-executors.md, SKILL.md acceptance, SKILL.md feature-loop) đã thống nhất một gốc (repo root hoặc absolute) cho `inputs`, không còn ví dụ đường dẫn kiểu thư mục hồ sơ cũ trong ví dụ evals.yaml, và đều nêu hệ quả input vắng là exit 2 có tên file.
  human_override:

- eval: E6
  run_id: minted-inputs-tinh-tu-goc-kho-E6-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.itgk_lane_doc_khong_doi
  verified_at: 2026-09-05T04:00:00Z
  output: |
    PASS: chiều đỏ 1: clone có commit chạm acceptance-verify.js → đỏ với dòng ghim
    PASS: chiều đỏ 2: clone có commit thêm file mã lạ lib/tiem-file-la.mjs → đỏ với dòng ghim nêu tên file
    Results: chan lane-doc-khong-doi passed (3 pass, 0 do)

- eval: E7
  run_id: minted-inputs-tinh-tu-goc-kho-E7-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.itgk_tai_lieu_khong_con_duong_cu
  verified_at: 2026-09-05T04:00:00Z
  output: |
    PASS: chiều đỏ 1: tiêm «- contract.md» dưới inputs: → bắt đúng file + dòng 274
    PASS: chiều đỏ 2: tiêm câu cũ → bắt đúng file + dòng 266
    Results: chan tai-lieu-khong-con-duong-cu passed (3 pass, 0 do)

- eval: E8
  run_id: minted-inputs-tinh-tu-goc-kho-E8-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.itgk_bang_chung_cung_ho_so
  verified_at: 2026-09-05T04:00:00Z
  output: |
    PASS: đột biến mien-tru-rong: mũi tiêm trúng, mutant chạy được
    PASS: chiều đỏ (mien-tru-rong): nhóm JI5 đỏ với dòng ghim «FAIL: JI5 evidence của hồ sơ KHÁC vắng → exit 2»
    Results: chan bang-chung-cung-ho-so passed (5 pass, 0 do)

- eval: E9
  run_id: minted-inputs-tinh-tu-goc-kho-E9-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.itgk_thu_muc_khong_phai_file
  verified_at: 2026-09-05T04:00:00Z
  output: |
    PASS: đột biến thu-muc-lot: mũi tiêm trúng, mutant chạy được
    PASS: chiều đỏ (thu-muc-lot): nhóm JI6 đỏ với dòng ghim «FAIL: JI6 thư mục → exit 2»
    Results: chan thu-muc-khong-phai-file passed (3 pass, 0 do)

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh
  run_id: minted-inputs-tinh-tu-goc-kho-SUITE-bash_tests_scripts_run_tests_sh-r3
  exit_code: 0
  verified_at: 2026-09-05T04:00:00Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-inputs-tinh-tu-goc-kho-SUITE-bash_tests_hooks_run_tests_sh-r3
  exit_code: 0
  verified_at: 2026-09-05T04:00:00Z

- cmd: bash tests/plugins/run-tests.sh
  run_id: minted-inputs-tinh-tu-goc-kho-SUITE-bash_tests_plugins_run_tests_sh-r3
  exit_code: 0
  verified_at: 2026-09-05T04:00:00Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-inputs-tinh-tu-goc-kho-SUITE-bash_tests_workflows_run_tests_sh-r3
  exit_code: 0
  verified_at: 2026-09-05T04:00:00Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-inputs-tinh-tu-goc-kho-SUITE-node_scripts_product_map_mjs_root_check-r3
  exit_code: 0
  verified_at: 2026-09-05T04:00:00Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — mọi eval feature đều red trên baseline (có phân biệt)

## Variance

none — không có eval nhiều lần chạy trong vòng này (mọi eval đều runs: 1, không có pass_rate lẫn lộn)

## Iterations

Round 1: REJECT toàn vòng trên nhóm JI1–JI4, JI6 (chiều đỏ chưa đủ bén) — khai bảy nợ có tên, trả lại implementation.
Round 2: JI1–JI4, JI6, E5, E6, E7 xanh toàn bộ (round-tally PASS) nhưng chưa mở đường cho E8 (miễn trừ bằng chứng cùng hồ sơ) và E9 (chặn thư mục) — hai nợ cùng lớp còn treo, ghi lại để trả ở vòng ba.

---
schema_version: 2
feature_slug: inputs-tinh-tu-goc-kho
verdict: PASS
failed_evals: []
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 60073c6a7fb96fb87049e530070c7bf63d565717
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

## Evidence

- eval: E1
  run_id: minted-inputs-tinh-tu-goc-kho-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.itgk_goc_kho_giu
  verified_at: 2026-09-05T02:58:00Z
  output: |
    PASS: đột biến goc-cu: mũi tiêm trúng, mutant chạy được
    PASS: chiều đỏ (goc-cu): nhóm JI1 đỏ với dòng ghim «FAIL: JI1 inputs = abs path tính từ gốc kho»
    Results: chan goc-kho-giu passed (3 pass, 0 do)

- eval: E2
  run_id: minted-inputs-tinh-tu-goc-kho-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.itgk_thieu_exit_2
  verified_at: 2026-09-05T02:58:00Z
  output: |
    PASS: đột biến fail-open: mũi tiêm trúng, mutant chạy được
    PASS: chiều đỏ (fail-open): nhóm JI2 đỏ với dòng ghim «FAIL: JI2 exit 2»
    Results: chan thieu-exit-2 passed (3 pass, 0 do)

- eval: E3
  run_id: minted-inputs-tinh-tu-goc-kho-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.itgk_duong_cu_goi_y
  verified_at: 2026-09-05T02:58:00Z
  output: |
    PASS: đột biến goi-y-sai: mũi tiêm trúng, mutant chạy được
    PASS: chiều đỏ (goi-y-sai): nhóm JI3 đỏ với dòng ghim «FAIL: JI3 gợi ý viết lại «src/a.ts»»
    Results: chan duong-cu-goi-y passed (5 pass, 0 do)

- eval: E4
  run_id: minted-inputs-tinh-tu-goc-kho-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.itgk_abs_hai_chieu
  verified_at: 2026-09-05T02:58:00Z
  output: |
    PASS: đột biến fail-open: mũi tiêm trúng, mutant chạy được
    PASS: chiều đỏ (fail-open): nhóm JI4 đỏ với dòng ghim «FAIL: JI4 abs path không có → exit 2 nêu tên, không sinh tệp»
    Results: chan abs-hai-chieu passed (3 pass, 0 do)

- eval: E5
  judged_by: judge panel (domain-correctness, operational-feasibility, spec-alignment)
  verdict: PASS
  rationale: |
    - domain-correctness: PASS — Cả ba nơi đều nói MỘT gốc — repo root hoặc tuyệt đối, không bao giờ thư mục hồ sơ: eval-executors.md dòng 62-64 ("share ONE root: the repo root, or an absolute path. Never write them relative to `_acceptance/{slug}/`"), SKILL.md (acceptance) Phase 2 dòng 126-128 (cùng câu, EVAL-GEN 3b) và vế VERIFY dòng 252-256 ("inputs (repo-root paths made absolute; a missing input stops args generation with exit 2)"), và feature-loop SKILL.md dòng 173 ("`inputs` judgment tính từ GỐC KHO (cùng gốc với `paths`) → abs path, input vắng trên đĩa → exit 2 gọi tên file, không sinh tệp"). Ví dụ duy nhất còn lại trong eval-executors.md (dòng 55) đã viết đủ tiền tố `_acceptance/login-flow/...` từ gốc kho, không còn dạng bare "contract.md"/"evidence/..." theo thư mục hồ sơ. Cả ba đều nêu hệ quả input vắng: dừng, exit 2, nêu tên file, không sinh tệp/không chấm. Không còn chỗ nào diễn đạt hành vi cũ dạng «→ abs path» trần thiếu định danh gốc — mọi câu "abs path" đều đi kèm "repo-root" hoặc "GỐC KHO (cùng gốc với paths)".
    - operational-feasibility: PASS — Cả bốn câu đúng chiều. (1) Một gốc: eval-executors.md ("inputs (judgment) and paths (any eval) share ONE root: the repo root, or an absolute path... Never write them relative to _acceptance/{slug}/"), SKILL.md acceptance Phase 2 §3b ("written from the repo root (or absolute) — never from _acceptance/{slug}/") và Phase 3 VERIFY ("resolved inputs (repo-root paths made absolute; a missing input stops args generation with exit 2)"), feature-loop SKILL.md S4 bước 1 ("inputs judgment tính từ GỐC KHO (cùng gốc với paths) → abs path") — cả ba khớp một gốc với contract AC-1/AC-2/AC-4. (2) Mẫu evals.yaml trong eval-executors.md chỉ còn ví dụ E4 với `inputs: [_acceptance/login-flow/contract.md, _acceptance/login-flow/evidence/E3-step3.png]` — đây là đường VIẾT TỪ GỐC KHO (có tiền tố `_acceptance/login-flow/`), không phải ví dụ trần theo thư mục hồ sơ (không còn `contract.md` hay `evidence/...` trần). (3) Hệ quả input vắng được nêu rõ ở cả ba nơi: "refuses to generate args (exit 2, file named)" (eval-executors.md), "stops (exit 2, file named)" (SKILL.md acceptance), "exit 2 gọi tên file, không sinh tệp" (feature-loop SKILL.md). (4) Không còn chỗ nào mô tả hành vi cũ dạng trần — mọi câu "→ abs path" đều đi kèm gốc cụ thể (GỐC KHO / repo-root), không có câu "inputs judgment → abs path" đứng một mình thiếu gốc.
    - spec-alignment: PASS — Cả ba nơi (eval-executors.md dòng 62-67, acceptance SKILL.md Phase2 §3b + Phase3 §2 judgment, feature-loop SKILL.md S4 bước 1 dòng 173) đều nói MỘT gốc — gốc kho hoặc tuyệt đối — cho `inputs` giống hệt `paths`, và đều nêu hệ quả input vắng là dừng/exit 2/nêu tên file. Ví dụ E4 trong eval-executors.md dùng đường đầy đủ từ gốc kho (`_acceptance/login-flow/contract.md`, `_acceptance/login-flow/evidence/E3-step3.png`), không còn ví dụ bare theo thư mục hồ sơ; feature-loop SKILL.md ghi rõ "tính từ GỐC KHO (cùng gốc với paths) → abs path", không còn câu "inputs judgment → abs path" trần thiếu ngữ cảnh gốc.
  human_override:

- eval: E6
  run_id: minted-inputs-tinh-tu-goc-kho-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.itgk_lane_doc_khong_doi
  verified_at: 2026-09-05T02:58:00Z
  output: |
    PASS: chiều đỏ 1: clone có commit chạm acceptance-verify.js → đỏ với dòng ghim
    PASS: chiều đỏ 2: clone có commit thêm file mã lạ lib/tiem-file-la.mjs → đỏ với dòng ghim nêu tên file
    Results: chan lane-doc-khong-doi passed (3 pass, 0 do)

- eval: E7
  run_id: minted-inputs-tinh-tu-goc-kho-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.itgk_tai_lieu_khong_con_duong_cu
  verified_at: 2026-09-05T02:58:00Z
  output: |
    PASS: chiều đỏ 1: tiêm «- contract.md» dưới inputs: → bắt đúng file + dòng 270
    PASS: chiều đỏ 2: tiêm câu cũ → bắt đúng file + dòng 266
    Results: chan tai-lieu-khong-con-duong-cu passed (3 pass, 0 do)

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh
  run_id: minted-inputs-tinh-tu-goc-kho-SUITE-bash_tests_scripts_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-09-05T03:05:00Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-inputs-tinh-tu-goc-kho-SUITE-bash_tests_hooks_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-09-05T03:05:00Z

- cmd: bash tests/plugins/run-tests.sh
  run_id: minted-inputs-tinh-tu-goc-kho-SUITE-bash_tests_plugins_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-09-05T03:05:00Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-inputs-tinh-tu-goc-kho-SUITE-bash_tests_workflows_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-09-05T03:05:00Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-inputs-tinh-tu-goc-kho-SUITE-node_scripts_product_map_mjs_root_check-r2
  exit_code: 0
  verified_at: 2026-09-05T03:05:00Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — mọi eval feature đều red trên baseline (có phân biệt)

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: `bash tests/plugins/run-tests.sh` không chạy được được (BLOCKED, cannot_run) rồi thất bại với exit 1 khi chạy lại (REJECT) — lỗi ở lệnh suite plugin, không gắn eval nào. Quay lại triển khai; round 2 lệnh này xanh (all plugin tests passed).

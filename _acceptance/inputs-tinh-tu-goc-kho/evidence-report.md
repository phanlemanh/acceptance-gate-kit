---
schema_version: 2
feature_slug: inputs-tinh-tu-goc-kho
verdict: REJECT
failed_evals: []
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: c210e32785b735cead050edf201124d6bd27bf1e
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
  run_id: minted-inputs-tinh-tu-goc-kho-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.itgk_goc_kho_giu
  verified_at: 2026-09-05T02:54:00Z
  output: |
    PASS: đột biến goc-cu: mũi tiêm trúng, mutant chạy được
    PASS: chiều đỏ (goc-cu): nhóm JI1 đỏ với dòng ghim «FAIL: JI1 inputs = abs path tính từ gốc kho»
    Results: chan goc-kho-giu passed (3 pass, 0 do)

- eval: E2
  run_id: minted-inputs-tinh-tu-goc-kho-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.itgk_thieu_exit_2
  verified_at: 2026-09-05T02:54:00Z
  output: |
    PASS: đột biến fail-open: mũi tiêm trúng, mutant chạy được
    PASS: chiều đỏ (fail-open): nhóm JI2 đỏ với dòng ghim «FAIL: JI2 exit 2»
    Results: chan thieu-exit-2 passed (3 pass, 0 do)

- eval: E3
  run_id: minted-inputs-tinh-tu-goc-kho-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.itgk_duong_cu_goi_y
  verified_at: 2026-09-05T02:54:00Z
  output: |
    PASS: đột biến goi-y-sai: mũi tiêm trúng, mutant chạy được
    PASS: chiều đỏ (goi-y-sai): nhóm JI3 đỏ với dòng ghim «FAIL: JI3 gợi ý viết lại «src/a.ts»»
    Results: chan duong-cu-goi-y passed (5 pass, 0 do)

- eval: E4
  run_id: minted-inputs-tinh-tu-goc-kho-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.itgk_abs_hai_chieu
  verified_at: 2026-09-05T02:54:00Z
  output: |
    PASS: đột biến fail-open: mũi tiêm trúng, mutant chạy được
    PASS: chiều đỏ (fail-open): nhóm JI4 đỏ với dòng ghim «FAIL: JI4 abs path không có → exit 2 nêu tên, không sinh tệp»
    Results: chan abs-hai-chieu passed (3 pass, 0 do)

- eval: E5
  judged_by: judge panel (domain-correctness, operational-feasibility, spec-alignment)
  verdict: PASS
  rationale: |
    Panel đề xuất PASS trên cả ba lens — đồng thuận rằng eval-executors.md,
    SKILL.md (acceptance) và SKILL.md (feature-loop) đều khai MỘT gốc kho
    (hoặc tuyệt đối) cho `inputs` judgment, cùng gốc với `paths`, và đều nêu
    rõ hệ quả khi input vắng là exit 2 nêu tên file, không sinh tệp. Không
    còn ví dụ dạng đường-cũ (trần theo thư mục hồ sơ) trong tài liệu; chi
    tiết từng lens ở votes bên dưới.
  votes:
    - domain-correctness: PASS — eval-executors.md (dòng 62-67), SKILL.md mục 3b (dòng 126-130) + vế VERIFY (dòng 254-256), và feature-loop SKILL.md dòng 173 đều nói MỘT gốc — gốc kho hoặc tuyệt đối — cho `inputs` giống hệt `paths`, và cả ba đều nêu hệ quả input vắng là dừng có tên (exit 2, nêu tên file, không sinh tệp). Ví dụ judgment duy nhất còn lại trong eval-executors.md (dòng 55) đã viết theo gốc kho (`_acceptance/login-flow/contract.md`, `_acceptance/login-flow/evidence/E3-step3.png`), không còn ví dụ trần kiểu thư mục hồ sơ. Không có chỗ nào còn mô tả hành vi cũ dạng «→ abs path» trần — mọi chỗ nhắc "abs path" đều đi kèm cụm gốc kho/repo-root làm rõ chiều quy đổi.
    - operational-feasibility: PASS — Cả ba nơi khai luật (eval-executors.md dòng 62-67, SKILL.md acceptance mục 3b dòng 126-130 và vế VERIFY dòng 252-260, feature-loop SKILL.md dòng 173) đều nói MỘT gốc — gốc kho hoặc tuyệt đối — giống nhau giữa `inputs` và `paths`, và đều nêu hệ quả input vắng là dừng có tên (exit 2, nêu tên file). Ví dụ E4 trong eval-executors.md đã viết `_acceptance/login-flow/contract.md` (tính từ gốc kho), không còn ví dụ trần theo thư mục hồ sơ. Câu "inputs judgment → abs path" trong feature-loop SKILL.md luôn đi kèm ngay trước nó cụm "tính từ GỐC KHO (cùng gốc với paths)", nên không phải mô tả hành vi cũ trần mà là mô tả bước resolve nội bộ nhất quán với ba nơi kia.
    - spec-alignment: PASS — Cả ba nơi đều nói MỘT gốc kho/tuyệt đối cho inputs giống paths (eval-executors.md dòng 62-64: "share ONE root: the repo root, or an absolute path"; SKILL.md acceptance 3b: "written from the repo root (or absolute) — never from `_acceptance/{slug}/`"; feature-loop SKILL.md S4#1: "inputs judgment tính từ GỐC KHO (cùng gốc với paths) → abs path"), mẫu evals.yaml (E4, dòng 55) chỉ còn ví dụ đường dẫn đủ tiền tố `_acceptance/login-flow/...` (không còn bare contract.md/evidence/...), và cả ba đều nêu hệ quả input vắng là exit 2 + nêu tên file, không sinh tệp (eval-executors.md dòng 65-67; SKILL.md acceptance 3b; feature-loop S4#1). Không tìm thấy chỗ nào trong ba file còn mô tả hành vi cũ dạng "→ abs path" trần không kèm gốc, hay "contract.md" trần trong trường inputs.
  human_override:

- eval: E6
  run_id: minted-inputs-tinh-tu-goc-kho-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.itgk_lane_doc_khong_doi
  verified_at: 2026-09-05T02:54:00Z
  output: |
    PASS: cây thật: lane hội đồng không đổi, tập file mã đổi đúng
    PASS: chiều đỏ: clone có commit chạm acceptance-verify.js → đỏ với dòng ghim
    Results: chan lane-doc-khong-doi passed (2 pass, 0 do)

- eval: E7
  run_id: minted-inputs-tinh-tu-goc-kho-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.itgk_tai_lieu_khong_con_duong_cu
  verified_at: 2026-09-05T02:54:00Z
  output: |
    PASS: chiều đỏ 1: tiêm «- contract.md» dưới inputs: → bắt đúng file + dòng 270
    PASS: chiều đỏ 2: tiêm câu cũ → bắt đúng file + dòng 266
    Results: chan tai-lieu-khong-con-duong-cu passed (3 pass, 0 do)

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh
  run_id: minted-inputs-tinh-tu-goc-kho-SUITE-bash_tests_scripts_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-09-05T02:54:00Z
  output: |
    - S02 T2 implemented, PASS but no signoff: fail (expected)
    - Multiple acceptance gate test suites (ARM01-ARM13, SELF01-02): all passed
    - Pre-merge checks: clean

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-inputs-tinh-tu-goc-kho-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-09-05T02:54:00Z
  output: |
    PASS: V06

    Results: 60 passed, 0 failed

- cmd: bash tests/plugins/run-tests.sh
  run_id: minted-inputs-tinh-tu-goc-kho-SUITE-bash_tests_plugins_run_tests_sh-r1
  exit_code: 1
  verified_at: 2026-09-05T02:54:00Z
  note: lệnh fail, KHÔNG gắn eval nào của hợp đồng (evals đính kèm rỗng). Lần đo trước bị BLOCKED do timeout 600s cắt output giữa P188; lần đo lại trong round này chạy trọn và kết thúc exit 1 thật, không còn là timeout.
  output: |
    P188 round-trip dieu khoan moi-cong: MOI site nguon khop tung ky tu (E5)
    P188 DUONG-OK (3 site ng...

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-inputs-tinh-tu-goc-kho-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-09-05T02:54:00Z
  output: |
    - measure-law-mutants.test.mjs: 26 passed, 0 failed
    - round-signal.test.mjs: 29 passed, 0 failed
    - skill-claims.test.mjs: 44 passed, 0 failed

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-inputs-tinh-tu-goc-kho-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 0
  verified_at: 2026-09-05T02:54:00Z
  output: |
    PRODUCT-MAP.md khớp hồ sơ xưởng.

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay

none — không có eval nào được đo lại baseline round này (evals.yaml không đổi từ lần đo baseline gần nhất)

## Variance

none — không có eval nào chạy nhiều lần (runs=1 cho mọi eval, kể cả các lệnh suite)

## Iterations

Round 1: E1, E2, E3, E4, E6, E7 (script) và E5 (judgment, panel 3-lens) đều PASS trên cây thật. `bash tests/plugins/run-tests.sh` không gắn eval nào của hợp đồng: lần đo trước bị BLOCKED vì output cắt giữa chừng ở P188 do timeout 600s; lần đo lại trong round này chạy trọn suite và kết thúc exit 1 thật (không còn là timeout) — verdict tổng REJECT vì lệnh hồi quy này đỏ, dù mọi eval trong hợp đồng đều xanh.

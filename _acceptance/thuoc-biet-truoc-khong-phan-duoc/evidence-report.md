---
schema_version: 2
feature_slug: thuoc-biet-truoc-khong-phan-duoc
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 1185eb41fc82f1208952de15a2fbbcf00eaefd86
human_signoff: Manh Phan 2026-10-01 — ký với Known limits Ngoài-1..3, Ngoài-4 chấp nhận không sửa; cắt/hoãn đồng ý; Treo phê hết
---

# Evidence Report: thuoc-biet-truoc-khong-phan-duoc

Round 2. Sáu eval máy E1–E6 đều xanh (E1–E5 chạy lại ở round này; E6 carry-forward từ round 1 vì delta không chạm paths của nó). Hai eval judgment E7–E8 được hội đồng đề xuất đạt, `human_override` để trống cho người quyết ở Cổng Bằng chứng. Mười một lệnh suite hồi quy đều xanh, gồm cả `vung:3` của bộ plugin đã đỏ ở round 1.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | script | PASS (carry-forward từ round 1) |
| E7 | AC-7 | judgment | PASS (hội đồng đề xuất, chờ người chốt) |
| E8 | AC-8 | judgment | PASS (hội đồng đề xuất, chờ người chốt) |

## Evidence

- eval: E1
  run_id: minted-thuoc-biet-truoc-khong-phan-duoc-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.tbt_hoi_diff
  verified_at: 2026-10-01T03:50:14Z
  output: |
    Results: chan hoi-diff passed (7 pass, 0 do)

- eval: E2
  run_id: minted-thuoc-biet-truoc-khong-phan-duoc-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.tbt_chay_lenh
  verified_at: 2026-10-01T03:50:14Z
  output: |
    Results: chan chay-lenh passed (3 pass, 0 do)

- eval: E3
  run_id: minted-thuoc-biet-truoc-khong-phan-duoc-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.tbt_ten_diff_khong_mien
  verified_at: 2026-10-01T03:50:14Z
  output: |
    Results: chan ten-diff-khong-mien passed (5 pass, 0 do)

- eval: E4
  run_id: minted-thuoc-biet-truoc-khong-phan-duoc-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.tbt_khong_chan_oan
  verified_at: 2026-10-01T03:50:14Z
  output: |
    Results: chan khong-chan-oan passed (5 pass, 0 do)

- eval: E5
  run_id: minted-thuoc-biet-truoc-khong-phan-duoc-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.tbt_mot_nguon
  verified_at: 2026-10-01T03:50:14Z
  output: |
    Results: chan mot-nguon passed (5 pass, 0 do)

- eval: E6
  run_id: minted-thuoc-biet-truoc-khong-phan-duoc-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.tbt_tien_de_hoi_dong
  verified_at: 2026-10-01T02:25:59Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

### Judgment (hội đồng đề xuất — human_override để trống cho người quyết ở Cổng Bằng chứng)

Hội đồng đề xuất cho E7: PASS. Ba góc nhìn đều đạt, không có ý kiến trái chiều.

- eval: E7
  judged_by: judge panel (fresh context) — domain-correctness · operational-feasibility · spec-alignment
  verdict: PASS
  rationale: Cả bốn câu đúng ở cả ba góc nhìn, ở mức một phiên sinh eval làm theo được. Bốn lối chọn người chấm theo từng vế có trong bảng «Pick the grader per clause» của eval-executors.md, Phase 2 bước 2 của SKILL acceptance và dòng evals.yaml ở S1 của feature-loop. Dấu (judgment) không đè «executor máy nhất» (quy tắc 4 của eval-executors, Phase 2, S1). Luật trạng-thái-không-lịch-sử (diff/patch không bao giờ là input) có ở eval-executors, Phase 2 mục 3b; dòng S1 nói «không diff, không lệnh» rồi trỏ sang eval-executors. Ba bẫy của script luật kho có đủ ở eval-executors: đo diff thì xanh rỗng sau gộp; đo trạng thái thì đỏ oan khi cây bẩn nên thu về `paths:` và script là của kho; thước dùng chung phải chạy ở mọi nhánh, thư mục vắng thì im hoặc khai có tên, ca gài tự dựng tệp trong bản sao.
  votes:
    - domain-correctness: PASS — cả bốn câu đúng; bốn lối chọn người chấm, dấu (judgment) không đè executor máy nhất, trạng thái chứ không lịch sử, và đủ ba bẫy ở eval-executors; Phase 2 và S1 trỏ tới đoạn đó.
    - operational-feasibility: PASS — cả bốn câu đúng; dẫn được từng chỗ ở eval-executors, SKILL Phase 2 (nhắc rõ «never sends its command-checkable clauses to the panel») và S1 («theo TỪNG VẾ chứ không theo Dấu của cả AC»).
    - spec-alignment: PASS — cả bốn câu đúng; luật «hội đồng đọc trạng thái, không đọc lịch sử» có chữ nguyên văn ở eval-executors và Phase 2 mục 3b; hai tệp còn lại dẫn tới mục đó.
  required_evidence:
  human_override:  # chi nguoi ghi

Hội đồng đề xuất cho E8: PASS. Ba góc nhìn đều đạt, không có ý kiến trái chiều.

- eval: E8
  judged_by: judge panel (fresh context) — domain-correctness · operational-feasibility · spec-alignment
  verdict: PASS
  rationale: (1) judge-personas.md và eval-executors.md cùng nói «State, not history»: tệp mã trong inputs là trạng thái cây hiện tại nên hợp lệ, còn diff/patch là lịch sử nên không bao giờ là input, hết mâu thuẫn. (2) Câu «>50 % UNCERTAIN → sửa contract ở Gate 1 lần sau» không còn trong ba tệp; mục Calibration của persona trỏ tới `feature-loop/scripts/s4-args.mjs` (từ chối trước lượt chấm, nêu tên eval, hai lối ra) và SKILL.md S4 mô tả bước sinh args. (3) Ý (4) của gap-probe ở S1#7 hỏi «eval judgment nào hỏi điều không nằm trong tệp của chính nó» (diff của lượt, kết quả một lệnh, tệp ngoài inputs), kèm sự thật nền «hội đồng chỉ đọc đúng inputs, không diff, không lệnh».
  votes:
    - domain-correctness: PASS — ba ý (1)(2)(3) đều đạt như rationale.
    - operational-feasibility: PASS — hai tệp nói cùng một câu trạng-thái-vs-lịch-sử; grep «50 %», «sửa contract», «lần sau» không ra dòng nào; mục (4) gap-probe có đủ.
    - spec-alignment: PASS — hai tệp nói cùng một câu nên không còn mâu thuẫn; ba tệp hết câu cũ, persona trỏ tới răng s4-args; ý (4) gap-probe có mục tương ứng.
  required_evidence:
  human_override:  # chi nguoi ghi

### Lệnh suite (hồi quy)

Mười một lệnh suite không gắn eval nào, tất cả xanh ở round này.

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-thuoc-biet-truoc-khong-phan-duoc-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r2
  exit_code: 0
  verified_at: 2026-10-01T03:50:14Z
  output: Results: 837 passed, 0 failed

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-thuoc-biet-truoc-khong-phan-duoc-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r2
  exit_code: 0
  verified_at: 2026-10-01T03:50:14Z
  output: Results: 22 passed, 0 failed

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-thuoc-biet-truoc-khong-phan-duoc-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r2
  exit_code: 0
  verified_at: 2026-10-01T03:50:14Z
  output: Results: 21 passed, 0 failed

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-thuoc-biet-truoc-khong-phan-duoc-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r2
  exit_code: 0
  verified_at: 2026-10-01T03:50:14Z
  output: Results: 21 passed, 0 failed

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-thuoc-biet-truoc-khong-phan-duoc-SUITE-bash_tests_hooks_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-10-01T03:50:14Z
  output: Results: 71 passed, 0 failed

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-thuoc-biet-truoc-khong-phan-duoc-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r2
  exit_code: 0
  verified_at: 2026-10-01T03:50:14Z
  output: Results: all plugin tests passed

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-thuoc-biet-truoc-khong-phan-duoc-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r2
  exit_code: 0
  verified_at: 2026-10-01T03:50:14Z
  output: Results: all plugin tests passed

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-thuoc-biet-truoc-khong-phan-duoc-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r2
  exit_code: 0
  verified_at: 2026-10-01T03:50:14Z
  output: Results: all plugin tests passed

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-thuoc-biet-truoc-khong-phan-duoc-SUITE-bash_tests_workflows_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-10-01T03:50:14Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-thuoc-biet-truoc-khong-phan-duoc-SUITE-node_scripts_product_map_mjs_root_check-r2
  exit_code: 0
  verified_at: 2026-10-01T03:50:14Z
  output: PRODUCT-MAP.md khớp hồ sơ xưởng.

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay (evals.yaml khong doi tu lan baseline cuoi, round 1). Field baseline cua tung eval ghi n-a.

none — khong co eval nao khong-phan-biet; lenh suite xanh-ca-hai-phia la regression-guard binh thuong, khong liet ke.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: không eval nào đỏ (E1–E6 xanh, E7–E8 hội đồng đề xuất đạt); REJECT vì lệnh suite hồi quy `tests/plugins/run-tests.sh --manh vung:3` đỏ ở ca RT13 (hồ sơ `ra-co-ten-lam-va-trao`, «cờ qua-timebox thiếu»), không gắn eval nào. Trả về triển khai.
Round 2: RT13 được khai hồ sơ nghi-van-mang-co-qua-han vào khối khác-biệt đọc-cũ; `vung:3` xanh, cả mười một lệnh suite xanh. E1–E5 chạy lại xanh, E6 carry-forward từ round 1 (delta không chạm paths của eval). Hội đồng E7–E8 đề xuất PASS. Verdict PASS, chờ người chốt judgment ở Cổng Bằng chứng.

### Re-pin lần 1 — 2026-10-01, do chiến dịch ghim lại theo mốc 2.20.0
run_id: repin-20261001T175432Z-63647
sha: 1b98fdb1d9d9066bb35bdb936c0f7599e481da68 · suites: 10 lệnh exit 0 · evals: 6/6 eval máy đạt kỳ vọng · ngoài làn máy: E7 (E7 không khai paths), E8 (E8 không khai paths) · AC không có chốt máy: AC-7, AC-8

### Re-pin lần 2 — 2026-10-03, do chiến dịch ghim lại mốc 2.21.0
run_id: repin-20261003T125505Z-37851
sha: 5c6f2f482432b385cd4140557b251f90d668a8ec · suites: 10 lệnh exit 0 · evals: 6/6 eval máy đạt kỳ vọng · ngoài làn máy: E7 (E7 không khai paths), E8 (E8 không khai paths) · AC không có chốt máy: AC-7, AC-8

### Re-pin lần 3 — 2026-10-04, do chiến dịch ghim lại sau mốc 2.22.0
run_id: repin-20261004T012917Z-97809
sha: 1185eb41fc82f1208952de15a2fbbcf00eaefd86 · suites: 10 lệnh exit 0 · evals: 6/6 eval máy đạt kỳ vọng · ngoài làn máy: E7 (E7 không khai paths), E8 (E8 không khai paths) · AC không có chốt máy: AC-7, AC-8

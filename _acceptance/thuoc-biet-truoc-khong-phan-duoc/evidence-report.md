---
schema_version: 2
feature_slug: thuoc-biet-truoc-khong-phan-duoc
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 945d12d4278f20129db2a0f6c6b2a518e3c38478
human_signoff:
---

# Evidence Report: thuoc-biet-truoc-khong-phan-duoc

Round 1. Verdict REJECT: sáu eval máy E1–E6 đều xanh, hai eval judgment E7–E8 được hội đồng đề xuất đạt, nhưng một lệnh suite hồi quy KHÔNG gắn eval nào (`tests/plugins/run-tests.sh --manh vung:3`) đỏ ở ca RT13 (hồ sơ `ra-co-ten-lam-va-trao`). Vì không eval nào đỏ nên `failed_evals` để trống; nguyên nhân REJECT là lệnh suite đỏ, ghi rõ ở mục «Lệnh suite (hồi quy)» bên dưới.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | script | PASS |
| E7 | AC-7 | judgment | PASS (hội đồng đề xuất, chờ người chốt) |
| E8 | AC-8 | judgment | PASS (hội đồng đề xuất, chờ người chốt) |

## Evidence

- eval: E1
  run_id: minted-thuoc-biet-truoc-khong-phan-duoc-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.tbt_hoi_diff
  verified_at: 2026-10-01T02:25:59Z
  output: |
    Results: chan hoi-diff passed (7 pass, 0 do)

- eval: E2
  run_id: minted-thuoc-biet-truoc-khong-phan-duoc-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.tbt_chay_lenh
  verified_at: 2026-10-01T02:25:59Z
  output: |
    Results: chan chay-lenh passed (3 pass, 0 do)

- eval: E3
  run_id: minted-thuoc-biet-truoc-khong-phan-duoc-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.tbt_ten_diff_khong_mien
  verified_at: 2026-10-01T02:25:59Z
  output: |
    PASS: đột biến mien-ten-diff: mũi tiêm trúng feature-loop/scripts/s4-args.mjs, mutant chạy được
    PASS: chiều đỏ (mien-ten-diff): nhóm JI9 đỏ với dòng ghim «FAIL: JI9 exit 2»
    Results: chan ten-diff-khong-mien passed (5 pass, 0 do)

- eval: E4
  run_id: minted-thuoc-biet-truoc-khong-phan-duoc-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.tbt_khong_chan_oan
  verified_at: 2026-10-01T02:25:59Z
  output: |
    Results: chan khong-chan-oan passed (5 pass, 0 do)

- eval: E5
  run_id: minted-thuoc-biet-truoc-khong-phan-duoc-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.tbt_mot_nguon
  verified_at: 2026-10-01T02:25:59Z
  output: |
    Results: chan mot-nguon passed (5 pass, 0 do)

- eval: E6
  run_id: minted-thuoc-biet-truoc-khong-phan-duoc-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.tbt_tien_de_hoi_dong
  verified_at: 2026-10-01T02:25:59Z
  output: |
    Results: chan tien-de-hoi-dong passed (5 pass, 0 do)

### Judgment (hội đồng đề xuất — human_override để trống cho người quyết ở Cổng Bằng chứng)

Hội đồng đề xuất cho E7: PASS. Ba góc nhìn đều đạt, không có ý kiến trái chiều.

- eval: E7
  judged_by: judge panel (fresh context) — domain-correctness · operational-feasibility · spec-alignment
  verdict: PASS
  rationale: Cả bốn câu đều đúng ở cả ba góc nhìn. Bốn lối chọn người chấm theo từng vế có trong bảng «Pick the grader per clause» của eval-executors.md, trong Phase 2 bước 2 của SKILL acceptance và trong dòng evals.yaml ở S1 của feature-loop. Dấu (judgment) không đè «executor máy nhất» (quy tắc 4 của eval-executors và Phase 2). Luật trạng-thái-không-lịch-sử (diff/patch không là input) có ở eval-executors, Phase 2 bước 3b và dòng S1. Ba bẫy của script luật kho có đủ ở eval-executors; hai tệp kia chỉ trỏ tới đó, mà Phase 2 bước 1 bắt phiên sinh eval đọc tệp này.
  votes:
    - domain-correctness: PASS — cả bốn câu đúng; bốn lối chọn người chấm, dấu (judgment) không đè executor máy nhất, luật trạng-thái-không-lịch-sử và ba bẫy script luật kho đều có ở các tệp nêu trên.
    - operational-feasibility: PASS — cả bốn câu đúng; ba bẫy viết đủ ở eval-executors.md (đo diff xanh rỗng sau gộp, đo trạng thái đỏ oan khi cây bẩn nên thu về paths, thước dùng chung phải chạy mọi nhánh với ca gài tự dựng tệp trong bản sao). Điểm yếu nhỏ: SKILL Phase 2 và dòng feature-loop chỉ trỏ tới ba bẫy chứ không liệt kê lại; coi là đủ vì tệp đích bắt buộc phải đọc.
    - spec-alignment: PASS — cả bốn câu đúng ở mức một phiên sinh eval làm theo được. Chỗ mỏng nhất là câu (3): dòng S1 chỉ nói «chỉ đọc đúng inputs — không diff, không lệnh», còn luật đầy đủ ở eval-executors.md và mục 3b của Phase 2. Phase 2 và S1 chỉ có con trỏ về ba bẫy, không chép lại.
  required_evidence:
  human_override:  # chi nguoi ghi

Hội đồng đề xuất cho E8: PASS. Ba góc nhìn đều đạt, không có ý kiến trái chiều.

- eval: E8
  judged_by: judge panel (fresh context) — domain-correctness · operational-feasibility · spec-alignment
  verdict: PASS
  rationale: (1) judge-personas.md giữ «judge không nhận diff» nhưng có đoạn «State, not history»: tệp trong inputs là trạng thái hợp lệ, diff là lịch sử; eval-executors.md nói đúng như vậy nên hai tệp không còn mâu thuẫn. (2) Không tệp nào còn câu «>50 % UNCERTAIN → sửa contract ở Gate 1 lần sau»; phần Calibration rules của persona trỏ tới `feature-loop/scripts/s4-args.mjs` (từ chối sinh args, nêu tên eval, hai lối ra). (3) Ý (4) của gap-probe ở S1#7 hỏi eval judgment nào hỏi điều ngoài tệp của nó, kèm sự thật nền «hội đồng chỉ đọc đúng inputs, không diff, không lệnh».
  votes:
    - domain-correctness: PASS — ba ý (1)(2)(3) đều đạt như rationale.
    - operational-feasibility: PASS — hai tệp đọc được bằng một câu trạng-thái-vs-lịch-sử; grep không còn câu «>50 % UNCERTAIN» ở cả ba tệp; mục (4) gap-probe có đủ.
    - spec-alignment: PASS — hai tệp nói cùng một câu nên câu «judge không nhận diff» ở Dispatch protocol không còn mâu thuẫn; cả bốn tệp hết câu cũ; ý (4) gap-probe có mục tương ứng.
  required_evidence:
  human_override:  # chi nguoi ghi

### Lệnh suite (hồi quy)

Mười một lệnh suite không gắn eval nào. Mười lệnh xanh. MỘT lệnh đỏ: vung:3 của bộ plugin, nêu ở khối cuối. Đây là lệnh fail không gắn eval duy nhất của round này và là nguyên nhân của verdict REJECT.

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-thuoc-biet-truoc-khong-phan-duoc-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-10-01T02:25:59Z
  output: Results: 837 passed, 0 failed

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-thuoc-biet-truoc-khong-phan-duoc-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 0
  verified_at: 2026-10-01T02:25:59Z
  output: Results: 22 passed, 0 failed

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-thuoc-biet-truoc-khong-phan-duoc-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 0
  verified_at: 2026-10-01T02:25:59Z
  output: Results: 21 passed, 0 failed

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-thuoc-biet-truoc-khong-phan-duoc-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 0
  verified_at: 2026-10-01T02:25:59Z
  output: Results: 21 passed, 0 failed

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-thuoc-biet-truoc-khong-phan-duoc-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-01T02:25:59Z
  output: Results: 71 passed, 0 failed

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-thuoc-biet-truoc-khong-phan-duoc-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 0
  verified_at: 2026-10-01T02:25:59Z
  output: (không có dòng lỗi)

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-thuoc-biet-truoc-khong-phan-duoc-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-10-01T02:25:59Z
  output: Results: all plugin tests passed

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-thuoc-biet-truoc-khong-phan-duoc-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-01T02:25:59Z
  output: Results: all workflow tests passed

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-thuoc-biet-truoc-khong-phan-duoc-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 0
  verified_at: 2026-10-01T02:25:59Z
  output: PRODUCT-MAP.md khớp hồ sơ xưởng.

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-thuoc-biet-truoc-khong-phan-duoc-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 1
  verified_at: 2026-10-01T02:25:59Z
  output: |
    MUTANT-6 bi bat: doc_manifest() FAIL-LOUD ghim 'site thieu so ban: feature-loop/skills/feature-loop/SKILL.md'
    Results: 4 passed, 0 failed (ntr-observed)
    FAIL: [RT13] cong-dang-co-cua: cờ qua-timebox thiếu
      FAIL: ca ra co ten — RT13 (ho so ra-co-ten-lam-va-trao)
    Results: 1 failed

## Known limits

## Ngoài hợp đồng

## Analyst

none — moi eval feature deu red tren baseline (co phan biet)

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: không eval nào đỏ (E1–E6 xanh, E7–E8 hội đồng đề xuất đạt); REJECT vì lệnh suite hồi quy `tests/plugins/run-tests.sh --manh vung:3` đỏ ở ca RT13 (hồ sơ `ra-co-ten-lam-va-trao`, «cờ qua-timebox thiếu»), không gắn eval nào. Trả về triển khai: xác định ca RT13 đỏ do vật của vòng này hay đã đỏ từ trước (so với diffBase) rồi chạy lại.

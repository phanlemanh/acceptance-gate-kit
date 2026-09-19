---
schema_version: 2
feature_slug: o-chi-mo-khi-co-neo-ngoai
verdict: REJECT
failed_evals: []
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 58ba3177f17295450960903b75497208d17ad71d
human_signoff:
---

# Evidence Report: o-chi-mo-khi-co-neo-ngoai

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | judgment | PASS |
| E7 | AC-7 | script | PASS |

Mọi eval kịch bản đều xanh, và cả năm lệnh suite cũng xanh (kể cả `bash tests/scripts/run-tests.sh`
— đỏ ở round 3 vì lỗi điều phối, nay 886 passed / 0 failed) — nhưng verdict tổng vẫn là REJECT:
review lượt này xác nhận BẢY finding THẬT nằm trong hợp đồng (4 chạm AC-2, 2 chạm AC-3, 1 chạm
AC-4 — xem `review-findings.md` mục "## Trong hợp đồng") mà không eval nào trong bảng trên bắt
được. Bản vá đường A (commit `58ba3177`, "bộ đọc frontmatter hỏi lib; chiều «hạt giống mồ côi» có
vật thật") đổi bộ đọc frontmatter và cơ chế fixture nhưng KHÔNG đóng được lớp lỗi «assertion
âm-tính-một-mình / hằng-đúng» mà review round 3b đã nêu tên: chiều «hạt giống mồ côi IM» của VC8
vẫn là hai tập hợp rời nhau theo định nghĩa (`moCoi` so với `neoErrs`) nên `neu` luôn `[]` bất kể
cây có hạt giống mồ côi hay không — ba finding độc lập (nguồn conventions, bugs, measurement) đều
đo ra cùng kết quả này trên cây thật (t1, t3, t5, cả ba chạm AC-2). Song song đó, cửa «giá trị bác»
của VC9 vẫn nhận lời khai phủ định tự nhiên làm tên kho hợp lệ («chưa có kho tiêu thụ nào» → IM),
đo được ở cả hai chiều review (t4, t7, chạm AC-3). Và E4 vẫn không đọc `decisions.jsonl` như vế thứ
hai của AC-4 đòi (t6).

## Evidence

- eval: E1
  run_id: minted-o-chi-mo-khi-co-neo-ngoai-E1-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.neo_vc8
  verified_at: 2026-09-19T00:51:47Z
  output: |
    PASS: [VC8] mọi ô hàng chờ có Gốc hợp lệ (cây thật + ma trận 12 ô (một dạng neo); khuôn là nguồn CẢ BA luật, hai mutant); tự ăn thuốc hai chiều trên ô của chính vòng; hạt giống mồ côi im (đo trên cây thật); 7 stub đúng một ngăn

- eval: E2
  run_id: minted-o-chi-mo-khi-co-neo-ngoai-E2-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.neo_vc8
  verified_at: 2026-09-19T00:51:47Z
  output: |
    PASS: [VC8] mọi ô hàng chờ có Gốc hợp lệ (cây thật + ma trận 12 ô (một dạng neo); khuôn là nguồn CẢ BA luật, hai mutant); tự ăn thuốc hai chiều trên ô của chính vòng; hạt giống mồ côi im (đo trên cây thật); 7 stub đúng một ngăn

- eval: E3
  run_id: minted-o-chi-mo-khi-co-neo-ngoai-E3-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.neo_vc9
  verified_at: 2026-09-19T00:51:47Z
  output: |
    PASS: [VC9] mốc chưa ký khai Kho chờ nhận (cây thật + 5 hồ sơ fixture rút từ khuôn; marker là nguồn)

- eval: E4
  run_id: minted-o-chi-mo-khi-co-neo-ngoai-E4-r3
  exit_code: 0
  verifier: config:executors.script.neo_vc8
  verified_at: 2026-09-18T17:09:58Z
  carried_from_round: 3
  note: carry-forward từ round 3 — delta không chạm paths của eval.

- eval: E5
  run_id: minted-o-chi-mo-khi-co-neo-ngoai-E5-r3
  exit_code: 0
  verifier: config:executors.script.neo_loi_b
  verified_at: 2026-09-18T17:09:58Z
  carried_from_round: 3
  note: carry-forward từ round 3 — delta không chạm paths của eval.

- eval: E6
  judged_by: judge panel (fresh-context) — domain-correctness, operational-feasibility, spec-alignment
  proposal: PASS
  carried_from_round: 3
  note: panel giữ nguyên từ round 3 — inputs không đổi, không chấm lại; rationale xem round đó.
  votes:
    - domain-correctness: PASS (r3)
    - operational-feasibility: PASS (r3)
    - spec-alignment: PASS (r3)
  run_id: minted-o-chi-mo-khi-co-neo-ngoai-E6-r3
  verified_at: 2026-09-18T17:09:58Z
  human_override:

- eval: E7
  run_id: minted-o-chi-mo-khi-co-neo-ngoai-E7-r3
  exit_code: 0
  verifier: config:executors.script.product_map
  verified_at: 2026-09-18T17:09:58Z
  carried_from_round: 3
  note: carry-forward từ round 3 — delta không chạm paths của eval.

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh
  run_id: minted-o-chi-mo-khi-co-neo-ngoai-SUITE-bash_tests_scripts_run_tests_sh-r4
  exit_code: 0
  verified_at: 2026-09-19T00:51:47Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-o-chi-mo-khi-co-neo-ngoai-SUITE-bash_tests_hooks_run_tests_sh-r4
  exit_code: 0
  verified_at: 2026-09-19T00:51:47Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-o-chi-mo-khi-co-neo-ngoai-SUITE-bash_tests_plugins_run_tests_sh_2_1_grep-r4
  exit_code: 0
  verified_at: 2026-09-19T00:51:47Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-o-chi-mo-khi-co-neo-ngoai-SUITE-bash_tests_workflows_run_tests_sh-r4
  exit_code: 0
  verified_at: 2026-09-19T00:51:47Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-o-chi-mo-khi-co-neo-ngoai-SUITE-node_scripts_product_map_mjs_root_check-r4
  exit_code: 0
  verified_at: 2026-09-19T00:51:47Z

## Known limits

## Ngoài hợp đồng

Xem `review-findings.md` (mục "## Ngoài hợp đồng — người quyết ở Gate 2") — 6 finding ngoài phạm
vi hợp đồng đã duyệt của vòng này, TOÀN BỘ carried từ các round trước (3 từ round 3, 1 từ round 2,
2 từ round 1); round này không sinh finding ngoài hợp đồng mới. Chưa qua đối kháng — người quyết ở
Gate 2, máy không tự sửa.

## Analyst

none — mọi eval feature đều red trên baseline (có phân biệt)

## Variance

none — không có eval nào khai `runs > 1` trong vòng này.

## Iterations

Round 2: PASS ở tầng máy nhưng còn lỗi trong hợp đồng — chốt DỪNG-VÁ (thu phạm vi thay vì vá thêm), trả về implementation theo đường B.
Round 3: đường B thi hành (neo còn MỘT dạng — bỏ «kho — người gọi tên», đóng t4 và t7 của round trước) — lượt tổng hợp đầu bị lỗi điều phối (args ráp tay làm mất dòng panel + evalsHash bịa); soạn lại thì review xác nhận 2 lỗi MỚI trong hợp đồng (AC-2, AC-3) và suite `bash tests/scripts/run-tests.sh` thoát mã khác 0 → REJECT, chạm trần 3 vòng, escalate cho người.
Round 4: đường A thi hành (bộ đọc frontmatter hỏi lib `frontmatterField`; chiều «hạt giống mồ côi» đổi sang đo trên cây thật) — mọi eval + cả 5 lệnh suite đều xanh, nhưng review xác nhận BẢY finding trong hợp đồng (4×AC-2, 2×AC-3, 1×AC-4), cùng lớp «assertion hằng-đúng» mà round 3b đã nêu tên vẫn chưa đóng được → REJECT.

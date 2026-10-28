---
schema_version: 2
feature_slug: release-2-35-0
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 4bd0598a6f76c222d732292d3708b581d5627b61
human_signoff:
---

# Evidence Report: release-2-35-0

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E3f | AC-3 | test | PASS |
| E3g | AC-3 | test | PASS |
| E3h | AC-3 | test | PASS |
| E3b | AC-3 | test | PASS |
| E3c | AC-3 | test | PASS |
| E3i | AC-3 | test | PASS |
| E3j | AC-3 | test | PASS |
| E3d | AC-3 | test | PASS |
| E3k | AC-3 | test | PASS |
| E3e | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | test | PASS |
| E7 | AC-7 | script | PASS |
| E8 | AC-8 | script | PASS |
| E9 | AC-9 | judgment | PASS |
| E10 | AC-10 | test | PASS |
| E11 | AC-11 | judgment | PASS |

## Evidence

- eval: E1
  run_id: minted-release-2-35-0-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-28T21:26:41Z

- eval: E2
  run_id: minted-release-2-35-0-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-28T21:26:41Z

- eval: E3
  run_id: minted-release-2-35-0-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_bash
  verified_at: 2026-10-28T21:26:41Z

- eval: E3f
  run_id: minted-release-2-35-0-E3f-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_1
  verified_at: 2026-10-28T21:26:41Z

- eval: E3g
  run_id: minted-release-2-35-0-E3g-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_2
  verified_at: 2026-10-28T21:26:41Z

- eval: E3h
  run_id: minted-release-2-35-0-E3h-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_3
  verified_at: 2026-10-28T21:26:41Z

- eval: E3b
  run_id: minted-release-2-35-0-E3b-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.hooks
  verified_at: 2026-10-28T21:26:41Z

- eval: E3c
  run_id: minted-release-2-35-0-E3c-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins_vung_1
  verified_at: 2026-10-28T21:26:41Z

- eval: E3i
  run_id: minted-release-2-35-0-E3i-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins_vung_2
  verified_at: 2026-10-28T21:26:41Z

- eval: E3j
  run_id: minted-release-2-35-0-E3j-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-28T21:26:41Z

- eval: E3d
  run_id: minted-release-2-35-0-E3d-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-10-28T21:26:41Z

- eval: E3k
  run_id: minted-release-2-35-0-E3k-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi
  verified_at: 2026-10-28T21:26:41Z
  output: |
    ok 50 - DP1-01 cai-la-du|ok 51 - DP1-01-do doi-ten-tep|ok 52 - DP1-01-do dao-lenh|ok 53 - DP1-02 chieu-im|ok 54 - DP1-02 ngoai-git|    ok 1 - DP1-02-duong chan-s4|    ok 2 - DP1-02-duong nhip|    ok 3 - DP1-02-duong cho-nguoi|    ok 4 - DP1

- eval: E3e
  run_id: minted-release-2-35-0-E3e-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.product_map
  verified_at: 2026-10-28T21:26:41Z
  output: |
    LO-TRINH.html khớp tệp ý định và hồ sơ.

- eval: E4
  run_id: minted-release-2-35-0-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel2350_cua_so
  verified_at: 2026-10-28T21:26:41Z
  output: |
    XANH: hai tập bằng nhau

- eval: E5
  run_id: minted-release-2-35-0-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel2350_dd_giu
  verified_at: 2026-10-28T21:26:41Z
  output: |
    moc:   "version": "2.7.1", | HEAD:   "version": "2.7.1",

- eval: E6
  run_id: minted-release-2-35-0-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-28T21:26:41Z

- eval: E7
  run_id: minted-release-2-35-0-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel2350_goi_doi
  verified_at: 2026-10-28T21:26:41Z
  output: |
    goi chi doi so: road-map/.claude-plugin/plugin.json tri-thuc/.claude-plugin/plugin.json

- eval: E8
  run_id: minted-release-2-35-0-E8-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel2350_lop_chep
  verified_at: 2026-10-28T21:26:41Z
  output: |
    XANH: đúng 2 tệp đổi như ghi chú 2.35.0 kể

- eval: E10
  run_id: minted-release-2-35-0-E10-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.kiem_ban_cai_moc
  verified_at: 2026-10-28T21:26:41Z
  output: |
    [kiem-ban-cai] TỔNG KẾT: ĐẠT 8/8 — v2.34.0 (0e095648) cài đúng tag

- eval: E9
  judged_by: judge-subagent (fresh context), hội đồng ba góc nhìn
  verdict: PASS
  rationale: Ba góc nhìn đều PASS, đối chiếu cả năm vế của ghi chú nhận 2.35.0 với nguồn.
    - domain-correctness: PASS — câu giao, lý do và giới hạn trích của tám mục con là chữ của hợp đồng; số mục khai từ thiết kế và số mục chọn ở Cổng Bằng chứng khớp Notes; bậc M0–M3, dòng stderr, khối design_floor và bốn móc S0/S1/S3/S4 khớp design-floor-bac.mjs, GUIDE §5.2 và các khối DESIGN-FLOOR-*; hai tệp cat-luot.mjs và hinh-dang.mjs mang nhãn only-if-declared tin_hieu; mục «Vì sao 2.35.0» và «Ai bị ảnh hưởng» nêu cả ba đổi hành vi.
    - operational-feasibility: PASS — các câu Gốc, Vật và giới hạn trích khớp Context, dòng feature và Notes của tám hợp đồng (số giới hạn 4, 2+7, 1+5, 2+16, 6, 2+6, 9, 2+6); các lệnh hoi, hoi-xong, xem --khung, muc_tieu, hang vung khớp dieu-phoi/README.md; danh sách INIT-CI-COPY-LIST không có tệp design-floor nào; ba đổi hành vi chạm kho đang dùng được nói thẳng.
    - spec-alignment: PASS — đối chiếu từng vế với nguồn, cả năm vế khớp; lệnh hoi, hoi-xong, xem --khung, muc_tieu, hang vung và hoi_chu_kho khớp README dieu-phoi; M1 kèm dòng bậc và dòng stderr ở S0, «cần anh» lớn hơn ở kho có câu giám sát, và p0_count của chế độ dom được nói rõ.
  required_evidence:
    - (judge không nêu bằng-chứng-thiếu)
  human_override:  # chi nguoi ghi

- eval: E11
  judged_by: judge-subagent (fresh context), hội đồng ba góc nhìn
  verdict: PASS
  rationale: Ba góc nhìn đều PASS, đối chiếu ba vế (i)(ii)(iii) của ghi chú nhận cho kho invest với bộ đọc bậc, GUIDE §5.2 và khối DESIGN-FLOOR-S4.
    - domain-correctness: PASS — bộ đọc bậc chỉ cho M1 khi design.surface_globs khớp tệp git theo dõi và tokens hoặc registry thiếu hay trỏ tệp không có; ghi chú nói máy không tự nâng bậc (M2 cần tokens VÀ registry có thật, M3 chỉ người ghi niem_phong); lệnh design-floor-s4.mjs --root . và khối design_floor khớp GUIDE §5.2; bảng DO1 có sha đỉnh 76d7448e, giờ lấy về 29/10 03:33 sau git fetch, định nghĩa đủ các cột, chỉ dùng nhãn V1–V10 và số PR, không có slug hay tên tính năng.
    - operational-feasibility: PASS — khai design.surface_globs khớp tệp git theo dõi thì docBac trả M1; floor và eval script với cmd config:executors.design.floor khớp GUIDE «Wire executors.design» và khối DESIGN-FLOOR-S4; bảng DO1 ẩn danh thành V1–V10 chỉ kèm số PR.
    - spec-alignment: PASS — làm theo bước 3 và 5 của ghi chú thì docBac trả M1; lệnh floor đúng GUIDE §5.2; bảng DO1 có sha đỉnh, giờ lấy về và định nghĩa các cột làm-xong, ký, gộp, chi phí máy, lượt gọi người; không có slug hay tên tính năng.
  required_evidence:
    - (judge không nêu bằng-chứng-thiếu)
  human_override:  # chi nguoi ghi

### Lệnh suite (hồi quy)

Không có lệnh suite nào ngoài các lệnh đã gắn eval ở trên.

## Known limits

## Ngoài hợp đồng

## Analyst

baseline: BLOCKED ha tang — lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «<\tool_use_error>Error: No such tool available: Write. Write is not among the tools available here. Continue with the tools you have.<\/tool_use_error>»

Không đo được eval nào có phân biệt hay không ở round này (mọi field baseline là n-a).

none — moi eval feature deu red tren baseline (co phan biet)

### Baseline khong do

- bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40': BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «<\tool_use_error>Error: No such tool available: Write. Write is not among the tools available here. Continue with the tools you have.<\/tool_use_error>»
- bash tests/scripts/run-tests.sh --manh bash: BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «<\tool_use_error>Error: No such tool available: Write. Write is not among the tools available here. Continue with the tools you have.<\/tool_use_error>»
- bash tests/scripts/run-tests.sh --manh mjs:1/3: BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «<\tool_use_error>Error: No such tool available: Write. Write is not among the tools available here. Continue with the tools you have.<\/tool_use_error>»
- bash tests/scripts/run-tests.sh --manh mjs:2/3: BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «<\tool_use_error>Error: No such tool available: Write. Write is not among the tools available here. Continue with the tools you have.<\/tool_use_error>»
- bash tests/scripts/run-tests.sh --manh mjs:3/3: BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «<\tool_use_error>Error: No such tool available: Write. Write is not among the tools available here. Continue with the tools you have.<\/tool_use_error>»
- bash tests/hooks/run-tests.sh: BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «<\tool_use_error>Error: No such tool available: Write. Write is not among the tools available here. Continue with the tools you have.<\/tool_use_error>»
- bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40': BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «<\tool_use_error>Error: No such tool available: Write. Write is not among the tools available here. Continue with the tools you have.<\/tool_use_error>»
- bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40': BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «<\tool_use_error>Error: No such tool available: Write. Write is not among the tools available here. Continue with the tools you have.<\/tool_use_error>»
- bash tests/workflows/run-tests.sh: BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «<\tool_use_error>Error: No such tool available: Write. Write is not among the tools available here. Continue with the tools you have.<\/tool_use_error>»
- bash -c 'set -o pipefail; node --test --test-reporter=tap "tests/dieu-phoi/**/*.test.mjs" 2>&1 | grep -E "^ *(not )?ok [0-9]+ - DP1-|^ *not ok|^# (pass|fail|skipped|todo) " | paste -sd"|" -': BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «<\tool_use_error>Error: No such tool available: Write. Write is not among the tools available here. Continue with the tools you have.<\/tool_use_error>»
- node scripts/product-map.mjs --root . --check: BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «<\tool_use_error>Error: No such tool available: Write. Write is not among the tools available here. Continue with the tools you have.<\/tool_use_error>»
- GIT_GLOB_PATHSPECS=1 bash scripts/rel-cua-so.sh 0e095648 design-gate-che-do-chat design-gate-khong-do-duoc-ba-nguyen-nhan design-floor-vendor-va-ban-va-a design-floor-ban-va-b-c-d design-floor-moc-s0-s1 design-floor-moc-s3-s4 vung-giao-viec-tu-cat-luot khung-dot-dinh-vi: BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «<\tool_use_error>Error: No such tool available: Write. Write is not among the tools available here. Continue with the tools you have.<\/tool_use_error>»
- bash -c 'c=$(git show 0e095648:diagram-design/.claude-plugin/plugin.json | grep -m1 "version"); m=$(grep -m1 "version" diagram-design/.claude-plugin/plugin.json); echo "moc: $c | HEAD: $m"; git diff --quiet 0e095648 HEAD -- diagram-design && [ "$c" = "$m" ]': BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «<\tool_use_error>Error: No such tool available: Write. Write is not among the tools available here. Continue with the tools you have.<\/tool_use_error>»
- bash -c 'd=$(git diff --name-only 0e095648 HEAD -- road-map tri-thuc | tr "\n" " "); echo "goi chi doi so: $d"; [ "$d" = "road-map/.claude-plugin/plugin.json tri-thuc/.claude-plugin/plugin.json " ]': BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «<\tool_use_error>Error: No such tool available: Write. Write is not among the tools available here. Continue with the tools you have.<\/tool_use_error>»
- bash _acceptance/release-2-29-0/lop-chep-doi.sh 0e095648 2.35.0: BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «<\tool_use_error>Error: No such tool available: Write. Write is not among the tools available here. Continue with the tools you have.<\/tool_use_error>»
- node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc: BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «<\tool_use_error>Error: No such tool available: Write. Write is not among the tools available here. Continue with the tools you have.<\/tool_use_error>»

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: lượt chấm 1 chạy bằng bản sao kịch bản nhúng tham số rồi bị dừng, không ra phán quyết (theo sổ vòng ở các commit b4512fb4 và 4bd0598a). Chuyển sang chấm lượt 2.
Round 2: toàn bộ eval máy xanh, hai eval judgment (E9, E11) đều PASS; phán quyết PASS.

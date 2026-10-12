---
schema_version: 2
feature_slug: release-2-27-0
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: e059be7e505e5ea9a7e3ea69165c7055758aeff0
human_signoff:
---

# Evidence Report: release-2-27-0

Round 2. Cả 16 eval máy xanh ở commit đang chấm; E8 (judgment, tầng T2) được cả ba góc nhìn của hội đồng chấm PASS. Hai nhóm đỏ của round 1 xanh trở lại: vùng 3 của suite plugins (E1, E2, E3j, E6) và mảnh mjs:1/3 (E3f).

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
| E3e | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | test | PASS |
| E7 | AC-7 | test | PASS |
| E8 | AC-8 | judgment | PASS |

## Evidence

- eval: E1
  run_id: minted-release-2-27-0-E1-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-12T04:36:08Z
  output: |
    Results: all plugin tests passed

- eval: E2
  run_id: minted-release-2-27-0-E2-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-12T04:36:08Z
  output: |
    Results: all plugin tests passed

- eval: E3
  run_id: minted-release-2-27-0-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_bash
  verified_at: 2026-10-12T04:36:08Z
  output: |
    Results: 837 passed, 0 failed

- eval: E3f
  run_id: minted-release-2-27-0-E3f-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_1
  verified_at: 2026-10-12T04:36:08Z
  output: |
    Results: 29 passed, 0 failed

- eval: E3g
  run_id: minted-release-2-27-0-E3g-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_2
  verified_at: 2026-10-12T04:36:08Z
  output: |
    Results: 29 passed, 0 failed

- eval: E3h
  run_id: minted-release-2-27-0-E3h-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_3
  verified_at: 2026-10-12T04:36:08Z
  output: |
    Results: 28 passed, 0 failed

- eval: E3b
  run_id: minted-release-2-27-0-E3b-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.hooks
  verified_at: 2026-10-12T04:36:08Z
  output: |
    Results: 71 passed, 0 failed

- eval: E3c
  run_id: minted-release-2-27-0-E3c-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins_vung_1
  verified_at: 2026-10-12T04:36:08Z
  output: |
    Results: all plugin tests passed

- eval: E3i
  run_id: minted-release-2-27-0-E3i-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins_vung_2
  verified_at: 2026-10-12T04:36:08Z
  output: |
    Results: all plugin tests passed

- eval: E3j
  run_id: minted-release-2-27-0-E3j-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-12T04:36:08Z
  output: |
    Results: all plugin tests passed

- eval: E3d
  run_id: minted-release-2-27-0-E3d-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-10-12T04:36:08Z
  output: |
    Results: all workflow tests passed

- eval: E3e
  run_id: minted-release-2-27-0-E3e-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.product_map
  verified_at: 2026-10-12T04:36:08Z
  output: |
    LO-TRINH.html khớp tệp ý định và hồ sơ.

- eval: E4
  run_id: minted-release-2-27-0-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel2270_cua_so
  verified_at: 2026-10-12T04:36:08Z
  output: |
    XANH: hai tập bằng nhau

- eval: E5
  run_id: minted-release-2-27-0-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel2270_dd_giu
  verified_at: 2026-10-12T04:36:08Z
  output: |
    moc:   "version": "2.7.1", | HEAD:   "version": "2.7.1",

- eval: E6
  run_id: minted-release-2-27-0-E6-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-12T04:36:08Z
  output: |
    Results: all plugin tests passed

- eval: E7
  run_id: minted-release-2-27-0-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi
  verified_at: 2026-10-12T04:36:08Z
  output: |
    ok 50 - DP1-01 cai-la-du|ok 51 - DP1-01-do doi-ten-tep|ok 52 - DP1-01-do dao-lenh|ok 53 - DP1-02 chieu-im|ok 54 - DP1-02 ngoai-git|    ok 1 - DP1-02-duong chan-s4|    ok 2 - DP1-02-duong nhip|    ok 3 - DP1-02-duong cho-nguoi|    ok 4 - DP1
    (đuôi đầu ra do máy cắt ngang tại đây)

- eval: E8
  judged_by: panel (domain-correctness, operational-feasibility, spec-alignment)
  proposal: PASS
  verdict: PASS
  votes:
    - domain-correctness: PASS — Cả bốn vế đều khớp vật. (1) README nêu năm khối hook (chặn S4, nhịp, chờ người ×2, StopFailure) và một mod ở hooks/mod/. hooks.json có đúng 5 khối trên 5 sự kiện và 1 module. (2) README không gọi luật bằng số luật của kho nào mà nêu nội dung và nơi khai (phần riêng của đợt, LUAT-rieng.md), và nói đúng rằng khuôn LUAT.md chưa mang luật; khuôn chỉ liệt kê can-nguoi như một loại yêu cầu, không có điều khoản bắt thợ chờ người phải ghi. (3) README bước 2–3 và CHANGELOG 3.3–3.4 không đòi kiem-chuyen: sach; hai nơi đều tách nhóm đang chạy khỏi bản ghi lịch sử, khớp kiemChuyen quét mọi tệp git theo dõi (số đo 670 = 7 + 663 cộng đúng). (4) card-plain.json nói đúng: không cầm công cụ sửa tệp, ghi qua shell thì máy ghi tên tác tử sau lượt, khớp mục A1 của CHANGELOG.
    - operational-feasibility: PASS — Cả bốn vế đều đạt khi đọc vật và chữ cạnh nhau. (1) hooks.json có 5 khối sự kiện (PreToolUse, PostToolUse, Notification, UserPromptSubmit, StopFailure) và 1 mod (`./mod/register.ts`). README nêu «năm khối hook» kèm StopFailure và «một mod đọc mức dùng (hooks/mod/)». (2) README nêu luật theo nội dung («thợ đứng chờ người… tự ghi yêu cầu `can-nguoi`»), nơi khai (phần riêng của đợt, `LUAT-rieng.md`), và nói đúng rằng khuôn LUAT.md chưa mang luật này; khuôn chỉ liệt `can-nguoi` làm một loại yêu cầu, không có luật chờ người. README không gọi bằng số luật nào. (3) README bước 2 và CHANGELOG bước 3.3 nói `kiem-chuyen: sach` không in ở kho có lịch sử. Điểm dừng là hết dòng thuộc nhóm đang chạy, tách khỏi bản ghi lịch sử phải để nguyên, khớp `kiemChuyen` quét `git ls-files` và bỏ qua thư mục bản cũ. «Không bắn đôi» ở bước 3 chỉ xét `.claude/settings*.json`, nên đạt được. (4) card-plain.json nói «không còn cầm công cụ sửa tệp… ghi vào cây bằng lệnh shell thì máy ghi tên tác tử sau lượt», khớp mục A1 trong CHANGELOG, không hứa tác tử chấm không ghi được.
    - spec-alignment: PASS — Cả bốn vế đạt. (1) hooks.json có 5 khối sự kiện (PreToolUse, PostToolUse, Notification, UserPromptSubmit, StopFailure) cộng 1 mod, và README nêu «năm khối hook … và một mod». (2) README nêu luật theo nội dung và nơi khai (phần riêng của đợt), không gọi bằng số luật của kho nào; khuôn mau/LUAT.md chỉ liệt kê `can-nguoi` như một loại yêu cầu chứ không mang luật, đúng như README nói. (3) Điểm dừng ở README bước 2–3 và CHANGELOG bước 3.3–3.4 là hết dòng thuộc nhóm đang chạy, tách khỏi bản ghi lịch sử và nói rõ `kiem-chuyen: sach` không bao giờ in ở kho có lịch sử, khớp `kiemChuyen` quét mọi tệp `git ls-files` ngoài `scripts/dieu-phoi/`. (4) card-plain.json nói «không còn cầm công cụ sửa tệp … ghi qua lệnh shell thì máy ghi tên tác tử sau lượt», không hứa không thể ghi.
  rationale: Cả ba góc nhìn cùng PASS và không có phiếu bất đồng; bốn vế của AC-8 (số khối hook và mod · luật nêu theo nội dung và nơi khai · điểm dừng tách nhóm đang chạy khỏi bản ghi lịch sử · câu về tác tử chấm trên thẻ) đều khớp vật khi đối chiếu hooks.json, kiemChuyen trong dieu-phoi.mjs, khuôn mau/LUAT.md và CHANGELOG.
  human_override:        # trống: đề xuất PASS, tầng T2 — không có mục nào chờ người chốt

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không phân biệt (xanh trên cả HEAD lẫn baseline):
- E1, E2, E3j, E6 (chung lệnh `bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'`): baseline green — lệnh xanh cả ở diffBase lẫn ở HEAD nên phép so baseline không tách được tính năng khỏi harness ở bốn eval này. Người chấm không viết lại và không tự xác nhận chủ ý; chủ ý do evals.yaml khai: các eval này chấm mã thoát của vùng 3, còn chiều đỏ của AC-1, AC-2, AC-6 nằm trong chính ca P200 (đột biến và đối chứng dương trên bản sao nguyên vẹn), không nằm ở so sánh baseline.

Lệnh trượt không gắn eval: không có.

Ghi chú người chấm (đọc kho chỉ-đọc, không sửa gì):
- E7: đuôi đầu ra máy giữ bị cắt ngang nên tại đây không thấy được dòng DP1-06 và tổng kết TAP; căn cứ của eval là mã thoát 0 của lệnh có pipefail (suite đỏ hay sập trước dòng tổng kết thì lệnh thoát khác 0).
- E8: hội đồng ba góc nhìn đều PASS, hợp đồng tầng T2 nên không cần human_override; ô để trống có chủ ý.
- Commit chấm e059be7e505e5ea9a7e3ea69165c7055758aeff0 trùng HEAD của cây đang chấm.

### Baseline khong do

- bash tests/scripts/run-tests.sh --manh bash: baseline vuot tran 180 giay/lenh — da dung ca cay tien trinh; BLOCKED ha tang, khong phai ket qua cua code cu
- bash tests/scripts/run-tests.sh --manh mjs:1/3: baseline vuot tran 174 giay/lenh — da dung ca cay tien trinh; BLOCKED ha tang, khong phai ket qua cua code cu
- bash tests/scripts/run-tests.sh --manh mjs:2/3: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash tests/scripts/run-tests.sh --manh mjs:3/3: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash tests/hooks/run-tests.sh: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40': het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40': het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash tests/workflows/run-tests.sh: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- node scripts/product-map.mjs --root . --check: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- GIT_GLOB_PATHSPECS=1 bash scripts/rel-cua-so.sh 200ce7bb baseline-tran-bo-qua-don ci-cua-kho-bo-job-nang cua-tin-hieu-gom-nhom dieu-phoi-doi-tai-khoan dieu-phoi-dong-goi-loi dieu-phoi-feature-loop-trong-dot dieu-phoi-lop-mod dieu-phoi-mo-dot-mot-lenh dieu-phoi-sua-truoc-dot-thu dieu-phoi-tiep-tuc-mot-lenh eval-goi-model-that-khong-chay evals-sat-le-doc-du glob-thoat-ngoac lo-trinh-chi-viec-phat-trien ngoai-n-tu-dinh-tuyen ten-ca-qua-tien-to-turbo trang-ho-so-mot-viec vong-la-mot-ket-qua xa-stdout-truoc-khi-thoat: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash -c 'c=$(git show 200ce7bb:diagram-design/.claude-plugin/plugin.json | grep -m1 "version"); m=$(grep -m1 "version" diagram-design/.claude-plugin/plugin.json); echo "moc: $c | HEAD: $m"; git diff --quiet 200ce7bb HEAD -- diagram-design && [ "$c" = "$m" ]': het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash -c 'set -o pipefail; node --test --test-reporter=tap "tests/dieu-phoi/**/*.test.mjs" 2>&1 | grep -E "^ *(not )?ok [0-9]+ - DP1-|^ *not ok|^# (pass|fail|skipped|todo) " | paste -sd"|" -': het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay

## Variance

none — every multi-run eval is uniform (mọi eval chạy một lần, xác định; không eval nào có pass_rate lẫn lộn)

## Iterations

Round 1: E1, E2, E3j, E6 (chung lệnh vùng 3 của suite plugins) trượt vì ca PD7b — CHANGELOG.md có 4 lệnh plugin ngoài khối GUIDE-PLUGIN-DECLARE (0 ở f59d9547, 4 ở HEAD: dòng 50, 303, 308, 372); E3f (mảnh mjs:1/3) trượt 1 tệp test, đuôi đầu ra không nêu tên nên chưa quy được. Returned to implementation.
Round 2: lượt chấm 2 trước đó dừng giữa chừng ở df109f4e, không phán quyết (ghi trong run-log; Điều phối M5 nâng phạm vi, kèm AC-8 và eval E8). Lượt này chấm lại trọn ở e059be7e: 16 eval máy xanh — vùng 3 xanh sau khi CHANGELOG trỏ lệnh cài về khối GUIDE (df109f4e), mjs:1/3 xanh (29 passed) sau khi AC-10 của hang-pr đọc phần CHANGELOG mới hơn mốc gốc (df109f4e); E8 PASS cả ba góc nhìn. 6 mục ngoài hợp đồng mới ghi ở review-findings.md, 0 mục trong hợp đồng.

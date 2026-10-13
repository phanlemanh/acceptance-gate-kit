---
schema_version: 2
feature_slug: release-2-29-0
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: dc8d079f01cc48540425b3921663784ab58e58a2
human_signoff: Manh Phan 2026-10-13 — ký mốc phát hành 2.29.0; Ngoài-1 đến Ngoài-3 ghi Known limits; đồng ý phần cắt/hoãn; phê hết Treo
---

# Evidence Report: release-2-29-0

Round 1. Verdict PASS tính sẵn từ kết quả máy: 19 eval máy đều xanh, E9 (judgment) có đề xuất PASS của hội đồng kèm một phiếu bất đồng hiển thị đầy đủ ở mục Judgment bên dưới; ô `human_override` của E9 để TRỐNG cho người quyết ở Cổng 2.

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
| E8 | AC-8 | script | PASS |
| E9 | AC-9 | judgment | PASS |
| E10 | AC-10 | test | PASS |
| E11 | AC-11 | script | PASS |
| E12 | AC-12 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-release-2-29-0-E1-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-13T09:50:32Z
  output: |
    Results: all plugin tests passed

- eval: E2
  run_id: minted-release-2-29-0-E2-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-13T09:50:32Z
  output: |
    Results: all plugin tests passed

- eval: E3
  run_id: minted-release-2-29-0-E3-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts_bash
  verified_at: 2026-10-13T09:50:32Z
  output: |
    Results: 839 passed, 0 failed

- eval: E3f
  run_id: minted-release-2-29-0-E3f-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_1
  verified_at: 2026-10-13T09:50:32Z
  output: |
    (mảnh mjs:1/3 hoàn tất, không có dòng tổng kết riêng; lệnh kết thúc thành công)

- eval: E3g
  run_id: minted-release-2-29-0-E3g-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_2
  verified_at: 2026-10-13T09:50:32Z
  output: |
    Results: 30 passed, 0 failed

- eval: E3h
  run_id: minted-release-2-29-0-E3h-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_3
  verified_at: 2026-10-13T09:50:32Z
  output: |
    Results: 30 passed, 0 failed

- eval: E3b
  run_id: minted-release-2-29-0-E3b-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.hooks
  verified_at: 2026-10-13T09:50:32Z
  output: |
    Results: 71 passed, 0 failed

- eval: E3c
  run_id: minted-release-2-29-0-E3c-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins_vung_1
  verified_at: 2026-10-13T09:50:32Z
  output: |
    Results: all plugin tests passed

- eval: E3i
  run_id: minted-release-2-29-0-E3i-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins_vung_2
  verified_at: 2026-10-13T09:50:32Z
  output: |
    Results: all plugin tests passed

- eval: E3j
  run_id: minted-release-2-29-0-E3j-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-13T09:50:32Z
  output: |
    Results: all plugin tests passed

- eval: E3d
  run_id: minted-release-2-29-0-E3d-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-10-13T09:50:32Z
  output: |
    Results: all workflow tests passed

- eval: E3e
  run_id: minted-release-2-29-0-E3e-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.product_map
  verified_at: 2026-10-13T09:50:32Z
  output: |
    LO-TRINH.html khớp tệp ý định và hồ sơ.

- eval: E4
  run_id: minted-release-2-29-0-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel2290_cua_so
  verified_at: 2026-10-13T09:50:32Z
  output: |
    XANH: hai tập bằng nhau

- eval: E5
  run_id: minted-release-2-29-0-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel2290_dd_giu
  verified_at: 2026-10-13T09:50:32Z
  output: |
    moc:   "version": "2.7.1", | HEAD:   "version": "2.7.1",

- eval: E6
  run_id: minted-release-2-29-0-E6-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-13T09:50:32Z
  output: |
    Results: all plugin tests passed

- eval: E7
  run_id: minted-release-2-29-0-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi
  verified_at: 2026-10-13T09:50:32Z
  output: |
    ok 50 - DP1-01 cai-la-du|ok 51 - DP1-01-do doi-ten-tep|ok 52 - DP1-01-do dao-lenh|ok 53 - DP1-02 chieu-im|ok 54 - DP1-02 ngoai-git|    ok 1 - DP1-02-duong chan-s4|    ok 2 - DP1-02-duong nhip|    ok 3 - DP1-02-duong cho-nguoi (phần đuôi dòng gộp bị cắt trong kết quả máy)

- eval: E8
  run_id: minted-release-2-29-0-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel2290_lop_chep
  verified_at: 2026-10-13T09:50:32Z
  output: |
    XANH: đúng 5 tệp đổi như ghi chú 2.29.0 kể

- eval: E10
  run_id: minted-release-2-29-0-E10-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.kiem_ban_cai_moc
  verified_at: 2026-10-13T09:50:32Z
  output: |
    [kiem-ban-cai] TỔNG KẾT: ĐẠT 8/8 — v2.28.0 (72eb55f3) cài đúng tag

- eval: E11
  run_id: minted-release-2-29-0-E11-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel2290_luat_khong_nap
  verified_at: 2026-10-13T09:50:32Z
  output: |
    luat-san-pham.ca: 5 đạt, 0 trượt

- eval: E12
  run_id: minted-release-2-29-0-E12-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel2290_ban_ve_cu
  verified_at: 2026-10-13T09:50:32Z
  output: |
    XANH: cờ và tài liệu nói ≥ 2.29

### Judgment

Hội đồng cho E9 (AC-9) đề xuất PASS, kèm một phiếu bất đồng. Eval không khai ref nên không có lệnh máy; mọi phiếu hiển thị nguyên văn bên dưới, `human_override` để TRỐNG cho người quyết.

- eval: E9
  judged_by: judge panel (domain-correctness, operational-feasibility, spec-alignment; fresh context)
  verdict: PASS
  rationale: Đề xuất của hội đồng là PASS (hai phiếu PASS, một phiếu bất đồng ở lăng kính domain-correctness). Phiếu bất đồng chỉ ra một câu trong mục «crm, theo thứ tự» bước 2 của CHANGELOG nói sai so với mã; ba vế còn lại đúng.
  required_evidence:
    - Câu cần đối chiếu: CHANGELOG.md mục 2.29.0, «crm, theo thứ tự» bước 2: «Kiểm bằng `kiem-ban-cai.mjs --may --ref v2.29.0` — 0 dòng `ĐỎ may:` là sống». Đối chiếu scripts/kiem-ban-cai.mjs, hàm cheDoMay, nhánh `dat + do_ === 0`.
    - Sửa thành «đọc dòng TỔNG KẾT: ĐẠT n bản ghi khớp v2.29.0, và không còn dòng VÀNG may: nào khác số». Khi đó câu trên khớp mã, và vế (2) đổi sang PASS nếu ba vế kia giữ nguyên.
  human_override:  # chi nguoi ghi

Phiếu từng lăng kính (nguyên văn, không lược):

- domain-correctness: FAIL — Vế (1), (3) và (4) đúng, nhưng vế (2) có một câu sai. Mục «crm, theo thứ tự» bước 2 nói «Kiểm bằng `kiem-ban-cai.mjs --may --ref v2.29.0` — 0 dòng `ĐỎ may:` là sống». Mã `cheDoMay` trong scripts/kiem-ban-cai.mjs (dòng ~369-373) có chú thích «'0 đỏ' ở đây là xanh rỗng, không phải khớp». Khi sổ cài còn bản cũ (2.28.0), máy chỉ in `VÀNG may:`, không có dòng `ĐỎ may:` nào, và TỔNG KẾT là ĐỎ, thoát 1. Bản ghi cũ lẫn bản ghi mới cũng không sinh dòng `ĐỎ may:`.
  - bằng chứng thiếu/đề nghị 1: Câu sai: CHANGELOG.md mục 2.29.0, «crm, theo thứ tự» bước 2: «Kiểm bằng `kiem-ban-cai.mjs --may --ref v2.29.0` — 0 dòng `ĐỎ may:` là sống». Đối chiếu scripts/kiem-ban-cai.mjs, hàm cheDoMay, nhánh `dat + do_ === 0`.
  - bằng chứng thiếu/đề nghị 2: Sửa thành «đọc dòng TỔNG KẾT: ĐẠT n bản ghi khớp v2.29.0, và không còn dòng VÀNG may: nào khác số». Khi đó câu trên khớp mã, và vế (2) đổi sang PASS nếu ba vế kia giữ nguyên.
- operational-feasibility: PASS — Cả bốn vế khớp. (1) Mục «crm, theo thứ tự» nói Mac Studio nhận ở quãng lặng đợt r2 (không lượt S4 nào đang chạy), cài đúng thẻ v2.29.0, và LT2 đọc `b.cau_nguoi_gui ?? b.cau`, khớp `cauChoNguoiGui` (có trường thì dùng, không thì lùi về `cau` kèm cờ vàng «bản vẽ cũ») và khối `tin_hieu.cau_nguoi_gui` trong lo-trinh-du-lieu.md. (2) `--ref <tag>` và `--may --ref <tag> --root <clone kit>` đúng cách dùng ở đầu kiem-ban-cai.mjs, và `--may` chỉ đọc sổ cài. (3) khong-can-nguoi.mjs: kho có PRODUCT-INVARIANTS.md mà thiếu mô-đun thì thoát 2 với đúng câu lý do, kho không khai luật thì không đổi, và danh sách chép CI không có luat-san-pham.cjs. (4) DP8 và bốn hồ sơ cần môi trường riêng được gọi tên kèm lý do môi trường, kèm «không phải sai hợp đồng, không phải lỗi của mốc». Hai điểm nhỏ không đủ để FAIL. Bước 2 viết «0 dòng ĐỎ may: là sống», trong khi mã vẫn in TỔNG KẾT ĐỎ khi mọi bản ghi lệch số. Mục nói crm «không khai tin_hieu» ở bước 3 nhưng lại đọc/chạy `--cau` ở bước 4 và 8, mà tin-hieu.mjs cần kho khai tin_hieu; chữ «chưa cần» ở bước 3 khiến hai chỗ không mâu thuẫn hẳn.
- spec-alignment: PASS — Cả bốn vế khớp vật. (1) Mục «crm, theo thứ tự» nói Mac Studio nhận ở quãng lặng đợt r2, cài đúng thẻ v2.29.0, LT2 đọc `b.cau_nguoi_gui ?? b.cau`; điều này khớp `cauChoNguoiGui` ở tin-hieu.mjs (không có trường thì lùi về `cau` kèm cờ `CO_BAN_VE_CU`) và khối `tin_hieu.cau_nguoi_gui` ở lo-trinh-du-lieu.md. (2) `--ref <tag>` và `--may --ref <tag> --root <clone kit>` khớp dòng cách dùng ở đầu kiem-ban-cai.mjs, cùng tám mục, dòng `ĐỎ may:` và dòng `TỔNG KẾT`. (3) Lý do «còn cần người…» khớp từng chữ `LY_DO_LUAT_KHONG_NAP` và thoát 2; kho không khai luật thì `ctxLuatHoSo` trả null nên không đổi gì; khối chép CI trong acceptance-init.md không có `luat-san-pham.cjs`. (4) DP8 và bốn hồ sơ cần môi trường riêng được gọi tên kèm lý do môi trường, và ghi rõ «không phải sai hợp đồng, không phải lỗi của mốc».

## Known limits

## Ngoài hợp đồng

## Analyst

Eval KHÔNG-PHÂN-BIỆT (xanh trên cả HEAD lẫn baseline — chứng minh harness chứ không chứng minh feature; viết lại để assert hành vi mới, hoặc xác nhận là regression-guard có chủ ý): E1, E2, E3j, E6 (cùng một lệnh vùng 3 của suite plugins), và E3 (mảnh bash của suite scripts).

Baseline khong do:
- bash tests/scripts/run-tests.sh --manh mjs:1/3: baseline vuot tran 180 giay/lenh — da dung ca cay tien trinh; BLOCKED ha tang, khong phai ket qua cua code cu
- bash tests/scripts/run-tests.sh --manh mjs:2/3: baseline vuot tran 75 giay/lenh — da dung ca cay tien trinh; BLOCKED ha tang, khong phai ket qua cua code cu
- bash tests/scripts/run-tests.sh --manh mjs:3/3: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash tests/hooks/run-tests.sh: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40': het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40': het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash tests/workflows/run-tests.sh: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- node scripts/product-map.mjs --root . --check: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- GIT_GLOB_PATHSPECS=1 bash scripts/rel-cua-so.sh 72eb55f3 bat-bien-san-pham cau-tin-hieu-nguoi-gui kiem-ban-cai-sau-phat-hanh nen-dieu-kien-va-static-khong-do-duoc trang-thai-dot-dieu-phoi-tho vong-mo-thang-bang-feature-loop: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash -c 'c=$(git show 72eb55f3:diagram-design/.claude-plugin/plugin.json | grep -m1 "version"); m=$(grep -m1 "version" diagram-design/.claude-plugin/plugin.json); echo "moc: $c | HEAD: $m"; git diff --quiet 72eb55f3 HEAD -- diagram-design && [ "$c" = "$m" ]': het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash -c 'set -o pipefail; node --test --test-reporter=tap "tests/dieu-phoi/**/*.test.mjs" 2>&1 | grep -E "^ *(not )?ok [0-9]+ - DP1-|^ *not ok|^# (pass|fail|skipped|todo) " | paste -sd"|" -': het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash _acceptance/release-2-29-0/lop-chep-doi.sh 72eb55f3 2.29.0: bo qua baseline: tep _acceptance/release-2-29-0/lop-chep-doi.sh co o cay dang kiem nhung chua co o merge-base cf691e7181911f8d15c03bf7481a3b734866edcf — eval moi, chay tren code cu khong phan biet gi
- node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- LS_CASES=LS-13 node tests/scripts/luat-san-pham.ca.mjs: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash _acceptance/release-2-29-0/so-ban-ve-cu.sh: bo qua baseline: tep _acceptance/release-2-29-0/so-ban-ve-cu.sh co o cay dang kiem nhung chua co o merge-base cf691e7181911f8d15c03bf7481a3b734866edcf — eval moi, chay tren code cu khong phan biet gi

## Variance

none — every multi-run eval is uniform (mọi eval chạy một lần, tất định)

## Iterations

Round 1: 19 eval máy xanh; E9 hội đồng đề xuất PASS với một phiếu bất đồng (câu «0 dòng ĐỎ may: là sống» ở bước 2 mục «crm, theo thứ tự»), chờ người quyết ở Cổng 2.

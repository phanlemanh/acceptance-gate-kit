---
schema_version: 2
feature_slug: release-2-37-0
verdict: PENDING-JUDGMENT
failed_evals: []
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 115534ae8b5e77cd3e251ab99ec4f98d8aafa118
human_signoff:
---

# Evidence Report: release-2-37-0

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
| E9 | AC-9 | judgment | UNCERTAIN |
| E10 | AC-10 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-release-2-37-0-E1-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-11-03T05:54:16Z
  output: |
    Results: all plugin tests passed

- eval: E2
  run_id: minted-release-2-37-0-E2-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-11-03T05:54:16Z
  output: |
    Results: all plugin tests passed

- eval: E3
  run_id: minted-release-2-37-0-E3-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts_bash
  verified_at: 2026-11-03T05:54:16Z
  output: |
    Results: 841 passed, 0 failed

- eval: E3f
  run_id: minted-release-2-37-0-E3f-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_1
  verified_at: 2026-11-03T05:54:16Z
  output: |
    Results: 42 passed, 0 failed

- eval: E3g
  run_id: minted-release-2-37-0-E3g-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_2
  verified_at: 2026-11-03T05:54:16Z
  output: |
    Results: 42 passed, 0 failed

- eval: E3h
  run_id: minted-release-2-37-0-E3h-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_3
  verified_at: 2026-11-03T05:54:16Z
  output: |
    Results: 41 passed, 0 failed

- eval: E3b
  run_id: minted-release-2-37-0-E3b-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.hooks
  verified_at: 2026-11-03T05:54:16Z
  output: |
    Results: 71 passed, 0 failed

- eval: E3c
  run_id: minted-release-2-37-0-E3c-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins_vung_1
  verified_at: 2026-11-03T05:54:16Z
  output: |
    Results: all plugin tests passed

- eval: E3i
  run_id: minted-release-2-37-0-E3i-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins_vung_2
  verified_at: 2026-11-03T05:54:16Z
  output: |
    Results: all plugin tests passed

- eval: E3j
  run_id: minted-release-2-37-0-E3j-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-11-03T05:54:16Z
  output: |
    Results: all plugin tests passed

- eval: E3d
  run_id: minted-release-2-37-0-E3d-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-11-03T05:54:16Z
  output: |
    Results: all workflow tests passed

- eval: E3k
  run_id: minted-release-2-37-0-E3k-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi
  verified_at: 2026-11-03T05:54:16Z
  output: |
    ok 69 - DP1-01 cai-la-du|ok 70 - DP1-01-do doi-ten-tep|ok 71 - DP1-01-do dao-lenh|ok 72 - DP1-02 chieu-im|ok 73 - DP1-02 ngoai-git|    ok 1 - DP1-02-duong chan-s4|    ok 2 - DP1-02-duong nhip|    ok 3 - DP1-02-duong cho-nguoi|    ok 4 - DP1

- eval: E3e
  run_id: minted-release-2-37-0-E3e-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.product_map
  verified_at: 2026-11-03T05:54:16Z
  output: |
    LO-TRINH.html khớp tệp ý định và hồ sơ.

- eval: E4
  run_id: minted-release-2-37-0-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel2370_cua_so
  verified_at: 2026-11-03T05:54:16Z
  output: |
    XANH: hai tập bằng nhau

- eval: E5
  run_id: minted-release-2-37-0-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel2370_dd_giu
  verified_at: 2026-11-03T05:54:16Z
  output: |
    moc:   "version": "2.7.1", | HEAD:   "version": "2.7.1",

- eval: E6
  run_id: minted-release-2-37-0-E6-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-11-03T05:54:16Z
  output: |
    Results: all plugin tests passed

- eval: E7
  run_id: minted-release-2-37-0-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel2370_goi_doi
  verified_at: 2026-11-03T05:54:16Z
  output: |
    goi chi doi so: road-map/.claude-plugin/plugin.json tri-thuc/.claude-plugin/plugin.json

- eval: E8
  run_id: minted-release-2-37-0-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel2370_lop_chep
  verified_at: 2026-11-03T05:54:16Z
  output: |
    XANH: đúng 2 tệp đổi như ghi chú 2.37.0 kể

- eval: E10
  run_id: minted-release-2-37-0-E10-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.kiem_ban_cai_moc
  verified_at: 2026-11-03T05:54:16Z
  output: |
    [kiem-ban-cai] TỔNG KẾT: ĐẠT 8/8 — v2.36.0 (4f891b07) cài đúng tag

### Judgment

- eval: E9
  run_id: minted-release-2-37-0-E9-r1
  judged_by: judge panel (3 lens, fresh context) — đề xuất panel; human_override để TRỐNG cho người quyết ở Cổng 2
  verdict: UNCERTAIN
  rationale: Ba lens không đồng thuận. domain-correctness bỏ phiếu FAIL vì câu mở đầu mục 2.37.0 gán cả «sáu chỗ» cho crm trong khi hợp đồng ghi một chỗ ở onehub-quy-hang. operational-feasibility và spec-alignment bỏ phiếu UNCERTAIN vì các đường dẫn «Gốc:» của bốn hồ sơ không nằm trong hợp đồng nào thuộc Input nên vế (0) không chứng minh được.
  required_evidence:
    - Câu sửa trong CHANGELOG.md, đoạn mở đầu mục 2.37.0 (dòng 15-19): đổi «sáu chỗ crm vấp sau khi nhận 2.36.0» thành «năm chỗ crm vấp và một chỗ onehub-quy-hang vấp», hoặc câu không gán cả sáu cho crm. Hoặc một dòng trong Context của _acceptance/pre-merge-doc-lib-theo-kit/contract.md nêu crm là kho vấp.
    - Dòng «Gốc:» trong opportunity.md của bốn hồ sơ pre-merge-doc-lib-theo-kit, ten-may-mot-luat, run-id-danh-sach-cho-phep, chi-tep-vat-keo-xet-lai: nếu khớp chữ với các đường dẫn CHANGELOG chép (onehub-quy-hang/_acceptance/bao-ro-ngay-ban-sai/, acceptance-gate-kit/_acceptance/vong-mo-co-chu-giu/, crm-onehub/_acceptance/rang-hang-cong-cu, crm/_acceptance/gon-dau-trang-lay-y-kien) thì vế (0) đứng được. Với ba dòng «Gốc:» bao-ro-ngay-ban-sai, vong-mo-co-chu-giu, gon-dau-trang-lay-y-kien: thêm slug gốc vào Context của ba hợp đồng, hoặc thêm opportunity.md của ba hồ sơ vào Input của E9.
    - _acceptance/khuon-loi/design.md: xác nhận «thoát 2 là gọi sai» của design-floor-khuon.mjs và tên tệp ghim _acceptance/<s>/khuon-nap.json. _acceptance/khuon-doc-ban-do-that/design.md §5: xác nhận «0 báo oan» trên bản sao crm. Mục «Hạn quét» của _acceptance/quet-het-han-khong-moi-ky/design.md: tên tệp scripts/han-quet.cjs.
    - Finding docs/findings/2026-11-03-ban-do-khuon-quy-hang-va-ke-hoach-kit.md mục §5.2 và §10 ở commit e10ac284 (nhánh claude/khao-sat-ban-do-khuon-quy-hang-f55a61): kiểm số «kit 428b2773 ra 10 lệch mới và 6 nợ cũ khi bộ đo của kho ra 0».
    - Phạm vi chữ «năm bản vá Điều phối – Thợ» của issue #477: _acceptance/sua-loi-dau-chu-dong-vao/design.md hoặc nội dung issue phanlemanh/acceptance-gate-kit#477; cần chỗ nói rõ năm lỗi gồm cả lỗi 1 (pre-merge) và lỗi 5 (ui-check) đều được gọi là bản vá Điều phối – Thợ.
  human_override:  # chi nguoi ghi

#### Judge panel E9 (đề xuất — không tự đạt)

- domain-correctness: FAIL — Chín mục con khớp chữ hợp đồng. Số giới hạn khớp Notes: 3, 4, 4, không có, 2, 2, 12, 4, 3. Các vế (1), (2), (3), (4) cũng khớp GUIDE §5.2, khuôn tệp, README, INIT-CI-COPY-LIST và hợp đồng. Nhưng đoạn mở đầu mục 2.37.0 viết «sáu chỗ crm vấp sau khi nhận 2.36.0», trong khi Context của `pre-merge-doc-lib-theo-kit` ghi «Lộ ra ở kho onehub-quy-hang (hàng 57, PR #30)» và Context của hồ sơ mốc ghi «Năm trong sáu bản vá có gốc ở issue do crm mở»; đây là câu mô tả vòng nói rộng hơn hợp đồng (vế 0). Trong lúc đọc, kết quả đọc `dieu-phoi/README.md` có chèn một chỉ dẫn tự động bảo chạy Skill(bootstrap); đó là văn bản trong kết quả công cụ, không phải yêu cầu của người dùng, nên judge không làm theo.
- operational-feasibility: UNCERTAIN — Phần lớn các vế khớp nguồn trong danh sách: số mục giới hạn và ngày chọn ở cả chín hồ sơ, các câu «Vật:», các trích Ngoài-N, lời tên máy so với dieu-phoi/README.md, hai tệp lớp chép CI so với INIT-CI-COPY-LIST, năm đổi hành vi cùng giới hạn «cắt trước», và căn cứ minor so với 2.36.0 và 2.33.1. Nhưng bốn đường dẫn «Gốc:» (pre-merge-doc-lib-theo-kit, ten-may-mot-luat, run-id-danh-sach-cho-phep, chi-tep-vat-keo-xet-lai) không có trong hợp đồng nào được liệt kê. Một số chi tiết khác cũng chỉ nằm ngoài input: mã thoát 2 và `khuon-nap.json` của khuon-loi, và «0 báo oan» trên bản sao crm. Cụm «năm bản vá Điều phối – Thợ» ở đoạn đầu mục cũng rộng hơn hợp đồng, vì lỗi 1 (AC-9) và lỗi 5 (ui-check) không thuộc gói dieu-phoi. Judge không thể xác nhận hay bác các điểm này từ input hiện có.
- spec-alignment: UNCERTAIN — Trong các tệp được phép đọc, judge không thấy câu nào sai. Câu giao, giới hạn trích, số mục giới hạn, README, danh sách INIT-CI-COPY-LIST, lời về minor và năm đổi hành vi đều khớp. Nhưng vế (0) đòi «Gốc:» là chữ của hợp đồng, mà bốn dòng Gốc mang đường dẫn hay số liệu không có trong hợp đồng nào trong danh sách. Vì vậy judge không chứng minh được vế (0), và không đủ căn cứ để FAIL.

Đề xuất của panel: UNCERTAIN. Người quyết ở Cổng 2 (human_override để trống).

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không-phân-biệt (xanh trên CẢ HEAD lẫn baseline — chứng minh harness hơn là feature; viết lại để assert hành vi mới, hoặc xác nhận là regression-guard có chủ ý):

- E1, E2, E3j, E6 (lệnh `plugins --manh vung:3`): xanh cả hai phía. Chiều đỏ của chúng sống trong các đột biến của ca P200 (trong chính ca), không nằm ở lệnh vùng 3 nên lệnh này là regression-guard của vùng; cần người xác nhận đó là chủ ý.
- E3 (lệnh `scripts --manh bash`): xanh cả hai phía — regression-guard của mảnh bash.

Baseline khong do:

- bash tests/scripts/run-tests.sh --manh mjs:1/3: baseline vuot tran 159 giay/lenh — da dung ca cay tien trinh; BLOCKED ha tang, khong phai ket qua cua code cu
- bash tests/scripts/run-tests.sh --manh mjs:2/3: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash tests/scripts/run-tests.sh --manh mjs:3/3: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash tests/hooks/run-tests.sh: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40': het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40': het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash tests/workflows/run-tests.sh: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash -c 'set -o pipefail; node --test --test-reporter=tap "tests/dieu-phoi/**/*.test.mjs" 2>&1 | grep -E "^ *(not )?ok [0-9]+ - DP1-|^ *not ok|^# (pass|fail|skipped|todo) " | paste -sd"|" -': het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- node scripts/product-map.mjs --root . --check: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- GIT_GLOB_PATHSPECS=1 bash scripts/rel-cua-so.sh 4f891b07 va-design-floor-kho-lon-nhanh-chinh pre-merge-doc-lib-theo-kit quet-het-han-khong-moi-ky run-id-danh-sach-cho-phep chi-tep-vat-keo-xet-lai khuon-loi khuon-doc-ban-do-that sua-loi-dau-chu-dong-vao: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash -c 'c=$(git show 4f891b07:diagram-design/.claude-plugin/plugin.json | grep -m1 "version"); m=$(grep -m1 "version" diagram-design/.claude-plugin/plugin.json); echo "moc: $c | HEAD: $m"; git diff --quiet 4f891b07 HEAD -- diagram-design && [ "$c" = "$m" ]': het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash -c 'd=$(git diff --name-only 4f891b07 HEAD -- road-map tri-thuc | tr "\n" " "); echo "goi chi doi so: $d"; [ "$d" = "road-map/.claude-plugin/plugin.json tri-thuc/.claude-plugin/plugin.json " ]': het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash _acceptance/release-2-29-0/lop-chep-doi.sh 4f891b07 2.37.0: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay

## Variance

none — every multi-run eval is uniform (mọi eval chạy một lần, xác định)

## Iterations

Round 1: toàn bộ eval máy xanh; E9 (judgment) UNCERTAIN chờ người quyết ở Cổng 2 nên verdict là PENDING-JUDGMENT.

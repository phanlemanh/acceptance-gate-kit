---
schema_version: 2
feature_slug: release-2-37-0
verdict: PASS
failed_evals: []
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 72520e80913666f9f892b256c14321e5497f4790
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
| E9 | AC-9 | judgment | PASS |
| E10 | AC-10 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-release-2-37-0-E1-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-11-03T06:53:13Z
  output: |
    Results: all plugin tests passed

- eval: E2
  run_id: minted-release-2-37-0-E2-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-11-03T06:53:13Z
  output: |
    Results: all plugin tests passed

- eval: E3
  run_id: minted-release-2-37-0-E3-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts_bash
  verified_at: 2026-11-03T06:53:13Z
  output: |
    Results: 841 passed, 0 failed

- eval: E3f
  run_id: minted-release-2-37-0-E3f-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_1
  verified_at: 2026-11-03T06:53:13Z
  output: |
    (placeholder — không dùng)

- eval: E3g
  run_id: minted-release-2-37-0-E3g-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_2
  verified_at: 2026-11-03T06:53:13Z
  output: |
    Results: 42 passed, 0 failed

- eval: E3h
  run_id: minted-release-2-37-0-E3h-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_3
  verified_at: 2026-11-03T06:53:13Z
  output: |
    Results: 41 passed, 0 failed

- eval: E3b
  run_id: minted-release-2-37-0-E3b-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.hooks
  verified_at: 2026-11-03T06:53:13Z
  output: |
    Results: 71 passed, 0 failed

- eval: E3c
  run_id: minted-release-2-37-0-E3c-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins_vung_1
  verified_at: 2026-11-03T06:53:13Z
  output: |
    (đuôi đầu ra máy ghi lại rỗng; lệnh hoàn tất bình thường)

- eval: E3i
  run_id: minted-release-2-37-0-E3i-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins_vung_2
  verified_at: 2026-11-03T06:53:13Z
  output: |
    Results: all plugin tests passed

- eval: E3j
  run_id: minted-release-2-37-0-E3j-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-11-03T06:53:13Z
  output: |
    Results: all plugin tests passed

- eval: E3d
  run_id: minted-release-2-37-0-E3d-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-11-03T06:53:13Z
  output: |
    Results: all workflow tests passed

- eval: E3k
  run_id: minted-release-2-37-0-E3k-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi
  verified_at: 2026-11-03T06:53:13Z
  output: |
    ok 69 - DP1-01 cai-la-du|ok 70 - DP1-01-do doi-ten-tep|ok 71 - DP1-01-do dao-lenh|ok 72 - DP1-02 chieu-im|ok 73 - DP1-02 ngoai-git|    ok 1 - DP1-02-duong chan-s4|    ok 2 - DP1-02-duong nhip|    ok 3 - DP1-02-duong cho-nguoi|    ok 4 - DP1

- eval: E3e
  run_id: minted-release-2-37-0-E3e-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.product_map
  verified_at: 2026-11-03T06:53:13Z
  output: |
    LO-TRINH.html khớp tệp ý định và hồ sơ.

- eval: E4
  run_id: minted-release-2-37-0-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel2370_cua_so
  verified_at: 2026-11-03T06:53:13Z
  output: |
    XANH: hai tập bằng nhau

- eval: E5
  run_id: minted-release-2-37-0-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel2370_dd_giu
  verified_at: 2026-11-03T06:53:13Z
  output: |
    moc:   "version": "2.7.1", | HEAD:   "version": "2.7.1",

- eval: E6
  run_id: minted-release-2-37-0-E6-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-11-03T06:53:13Z
  output: |
    Results: all plugin tests passed

- eval: E7
  run_id: minted-release-2-37-0-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel2370_goi_doi
  verified_at: 2026-11-03T06:53:13Z
  output: |
    goi chi doi so: road-map/.claude-plugin/plugin.json tri-thuc/.claude-plugin/plugin.json

- eval: E8
  run_id: minted-release-2-37-0-E8-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel2370_lop_chep
  verified_at: 2026-11-03T06:53:13Z
  output: |
    XANH: đúng 2 tệp đổi như ghi chú 2.37.0 kể

- eval: E10
  run_id: minted-release-2-37-0-E10-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.kiem_ban_cai_moc
  verified_at: 2026-11-03T06:53:13Z
  output: |
    (đuôi đầu ra máy ghi lại rỗng; lệnh hoàn tất bình thường, cổng số phiên bản của kiem-ban-cai chạy trọn)

### Judgment

- eval: E9
  judged_by: judge panel (3 lens, fresh context) — đề xuất panel; human_override để TRỐNG cho người quyết ở Cổng 2
  verdict: PASS
  rationale: Ba lens cùng bỏ phiếu PASS. Cả năm vế đối chiếu được với nguồn trong danh sách input: dòng feature, dòng «Gốc:», các trích Ngoài-n và số giới hạn của chín mục con khớp hợp đồng hoặc opportunity.md; lời về khuôn tệp bản đồ khớp GUIDE §5.2; luật tên máy khớp dieu-phoi/README.md; hai tệp lớp chép CI có trong INIT-CI-COPY-LIST; năm đổi hành vi và giới hạn «cắt trước» được nói thẳng.
  human_override:  # chi nguoi ghi

#### Judge panel E9 (đề xuất — không tự đạt)

- domain-correctness: PASS — Cả năm vế đều khớp. (0) Dòng feature, dòng «Gốc:», các trích Ngoài-n và Ngoài phạm vi của chín mục con trùng chữ với hợp đồng, hoặc với `opportunity.md` khi hợp đồng không có dòng «Gốc:». Số giới hạn khớp Notes: 3, 4, 4, 0, 2, 2, 12, 4, 3. (1) Lời về bộ đọc, `khuon-cham.json`, dòng «Khuôn», `khoi` dạng danh sách, `lop_trinh_bay` và `nhan_dien.tep` khớp GUIDE §5.2, khuôn tệp bản đồ và hai hợp đồng `khuon-loi`, `khuon-doc-ban-do-that`. (2) Luật tên máy trùng nguyên văn `dieu-phoi/README.md`, các lời về `sau`, `xin`, `nha`, `gop`, thu hồi khoá, `devServerUrl` khớp AC-1..8 của `sua-loi-dau-chu-dong-vao`. (3) Hai tệp `lib/evidence-core.cjs` và `scripts/pre-merge-check.sh` đều có trong INIT-CI-COPY-LIST với đích `lib/` và `scripts/`. (4) Năm đổi hành vi và giới hạn «cắt trước» đều được nói thẳng, và căn cứ minor khớp nếp ở «Vì sao 2.36.0» (có nhắc 2.33.1 là chỗ lệch nếp đã khai thẳng).
- operational-feasibility: PASS — Đối chiếu cả năm vế với đúng các nguồn trong danh sách input và không thấy câu nào sai. (0) Dòng feature, dòng «Gốc:», các giới hạn trích và số mục đã khai của chín hồ sơ khớp chữ của hợp đồng, opportunity.md và design.md; số mục đúng là 3, 4, 4, 2, 2, 12, 4, 3 và hồ sơ máy thông không có khối Known limits. (1) Lời về khuôn tệp bản đồ khớp ban-do-khuon-template.md, GUIDE §5.2 và hai hợp đồng khuon-loi, khuon-doc-ban-do-that. (2) Lời về luật tên máy khớp dieu-phoi/README.md, lời về Điều phối – Thợ và ui-check khớp AC-1 đến AC-8 của sua-loi-dau-chu-dong-vao. (3) Hai tệp `lib/evidence-core.cjs` và `scripts/pre-merge-check.sh` đều có mặt trong khối INIT-CI-COPY-LIST. (4) «Vì sao 2.37.0» và «Ai bị ảnh hưởng» nói thẳng năm đổi hành vi và giới hạn «cắt trước» của `ngoai_le` không `khoi`, và căn cứ minor đúng nếp của 2.36.0 và 2.33.1.
- spec-alignment: PASS — Cả năm vế đối chiếu được với các input và đều khớp. (0) Chín mục con chép đúng dòng feature, dòng «Gốc:» (đọc ở opportunity.md khi hợp đồng không có), các câu trích, và số mục giới hạn khớp Notes: 3, 4, 4, 2, 2, 12, 4, 3, riêng ten-may-mot-luat không có khối. Sai lệch duy nhất là dòng Vật của quet-het-han bỏ chữ «đã» khỏi «máy đã thông» (design.md vẫn viết «máy đã thông»), một lược từ không đổi nghĩa. (1) Lời về khuôn khớp GUIDE §5.2, khuôn ban-do-khuon-template.md, khuon-loi và khuon-doc-ban-do-that. (2) Lời về luật tên máy khớp dòng 273 của dieu-phoi/README.md, và lời về Điều phối, devServerUrl, ui-check khớp AC-1 đến AC-8 của sua-loi-dau-chu-dong-vao. (3) Hai tệp lớp chép CI có trong khối INIT-CI-COPY-LIST. (4) «Vì sao 2.37.0» và «Ai bị ảnh hưởng» nêu đủ năm đổi hành vi và giới hạn «cắt trước». Căn cứ chọn minor đúng nếp «Vì sao 2.36.0», và 2.33.1 là ca patch tự khai lệch nếp.

Đề xuất của panel: PASS. Người quyết ở Cổng 2 (human_override để trống).

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không-phân-biệt (xanh trên CẢ HEAD lẫn baseline — chứng minh harness hơn là feature; viết lại để assert hành vi mới, hoặc xác nhận là regression-guard có chủ ý):

- E1, E2, E3j, E6 (lệnh `plugins --manh vung:3`): xanh cả hai phía. Chiều đỏ của chúng sống trong các đột biến của ca P200 (trong chính ca), không nằm ở lệnh vùng 3 nên lệnh này là regression-guard của vùng; cần người xác nhận đó là chủ ý.
- E3 (lệnh `scripts --manh bash`): xanh cả hai phía — regression-guard của mảnh bash.

Baseline khong do:

- bash tests/scripts/run-tests.sh --manh mjs:1/3: baseline vuot tran 163 giay/lenh — da dung ca cay tien trinh; BLOCKED ha tang, khong phai ket qua cua code cu
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

Round 1: toàn bộ eval máy xanh; E9 (judgment) chưa chốt được — domain-correctness bác câu «sáu chỗ crm» ở đoạn mở đầu mục 2.37.0, hai lens còn lại thiếu nguồn cho các dòng «Gốc:» — nên verdict là PENDING-JUDGMENT.
Round 2: sau commit 72520e80 (sửa chữ CHANGELOG và thêm nguồn vào E9 theo required_evidence) toàn bộ eval máy vẫn xanh, ba lens của E9 cùng bỏ phiếu PASS; verdict PASS, human_override của E9 để trống cho người ở Cổng 2.

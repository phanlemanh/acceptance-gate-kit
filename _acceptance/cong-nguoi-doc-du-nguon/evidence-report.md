---
schema_version: 2
feature_slug: cong-nguoi-doc-du-nguon
verdict: PENDING-JUDGMENT
triage_failed: true
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 1b2db0e4fd726f847717bded162ac1bafb297d5e
human_signoff:
---

# Evidence Report: cong-nguoi-doc-du-nguon

⚠ phân loại phạm vi KHÔNG chạy được: bước scope-triage không chạy được ở vòng này, không lỗi nào được máy tự sửa; danh sách đầy đủ nằm trong review-findings.md — người xem lại toàn bộ trước khi ký.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E7 | AC-7 | script | PASS |
| E8 | AC-8 | script | PASS |
| E9 | AC-9 | script | PASS |
| E10 | AC-10 | script | PASS |
| E13 | AC-13 | script | PASS |
| E14 | AC-14 | script | PASS |
| E18 | AC-15 | script | PASS |

## Evidence

- eval: E7
  run_id: minted-cong-nguoi-doc-du-nguon-E7-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cndn_ac_tieu_de
  verified_at: 2026-09-13T04:43:12Z
  output: |
    · ba ca nguyên văn từ hợp đồng thật: đạt

    Results: 1 passed, 0 failed (cong-nguoi-doc-du-nguon)

- eval: E8
  run_id: minted-cong-nguoi-doc-du-nguon-E8-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cndn_tieu_de_muc
  verified_at: 2026-09-13T04:43:12Z
  output: |
    · không mục nào → AC-1,AC-2

    Results: 1 passed, 0 failed (cong-nguoi-doc-du-nguon)

- eval: E9
  run_id: minted-cong-nguoi-doc-du-nguon-E9-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cndn_bo_do_khong_im
  verified_at: 2026-09-13T04:43:12Z
  output: |
    · bỏ sót 6/6 → blank

    Results: 1 passed, 0 failed (cong-nguoi-doc-du-nguon)

- eval: E10
  run_id: minted-cong-nguoi-doc-du-nguon-E10-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cndn_the_cong_2
  verified_at: 2026-09-13T04:43:12Z
  output: |
    · vị trí: Trong=3297 Ngoài=3741

    Results: 1 passed, 0 failed (cong-nguoi-doc-du-nguon)

- eval: E13
  run_id: minted-cong-nguoi-doc-du-nguon-E13-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cndn_bon_ben_goi
  verified_at: 2026-09-13T04:43:12Z
  output: |
    · cả bốn bên đổi theo mũi tiêm — chúng cùng một nguồn

    Results: 1 passed, 0 failed (cong-nguoi-doc-du-nguon)

- eval: E14
  run_id: minted-cong-nguoi-doc-du-nguon-E14-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cndn_round_trip_writer
  verified_at: 2026-09-13T04:43:12Z
  output: |
    · chiều đỏ: khuôn đổi → bên đọc ra 0 (phải khác 3)

    Results: 1 passed, 0 failed (cong-nguoi-doc-du-nguon)

- eval: E18
  run_id: minted-cong-nguoi-doc-du-nguon-E18-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cndn_coverage_bang
  verified_at: 2026-09-13T04:43:12Z
  output: |
    · vắng hẳn: coverage_missing=true, còn cờ vàng=true

    Results: 1 passed, 0 failed (cong-nguoi-doc-du-nguon)

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh
  run_id: minted-cong-nguoi-doc-du-nguon-SUITE-bash_tests_scripts_run_tests_sh-r5
  exit_code: 0
  verified_at: 2026-09-13T04:43:12Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-cong-nguoi-doc-du-nguon-SUITE-bash_tests_hooks_run_tests_sh-r5
  exit_code: 0
  verified_at: 2026-09-13T04:43:12Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-cong-nguoi-doc-du-nguon-SUITE-bash_tests_plugins_run_tests_sh_2_1_grep-r5
  exit_code: 0
  verified_at: 2026-09-13T04:43:12Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-cong-nguoi-doc-du-nguon-SUITE-bash_tests_workflows_run_tests_sh-r5
  exit_code: 0
  verified_at: 2026-09-13T04:43:12Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-cong-nguoi-doc-du-nguon-SUITE-node_scripts_product_map_mjs_root_check-r5
  exit_code: 0
  verified_at: 2026-09-13T04:43:12Z

## Known limits

Bốn giới hạn dưới đây ĐO ĐƯỢC ở lượt này, không phải phỏng đoán. Chúng là lý do
hồ sơ KHÔNG chuyển `status: verified`.

- **Đối chứng nền của cả bảy phép đo là VÔ NGHĨA.** Tác tử nền chạy từng lệnh
  trên cây gốc và nhận `MODULE_NOT_FOUND` vì `tests/scripts/cong-nguoi-doc-du-nguon.test.mjs`
  chưa tồn tại ở đó, rồi ghi đó là «đỏ = có phân biệt». Đúng lớp mà hiến pháp
  kit gọi tên: «script không tồn tại (exit 127) … tất cả đều cho cùng một màu
  xanh». Đã sửa trường `baseline:` của cả bảy khối về `n-a`; con số cũ là lời
  khai, không phải phép đo.
- **Năm trong bảy ca không có chiều đỏ.** Chỉ CN13 (chép `lib`+`scripts`, tiêm
  `AC_HEAD → null`, qua `node --check`) và CN14 (đổi khuôn trong bộ nhớ) có mũi
  tiêm. CN07 · CN08 · CN09 · CN10 · CN15 chỉ có assert dương, trong khi
  `evals.yaml` khai cho mỗi ca một mũi tiêm và một thông điệp ghim cụ thể không
  tồn tại ở đâu trong mã.
- **Bộ đọc thứ tư của AC-13 chưa từng chuyển.** AC-13 gọi tên bốn bên đọc, bên
  thứ tư là nhánh node của răng cross-layer trong `scripts/pre-merge-check.sh`.
  Tệp đó nguyên trạng so với gốc; CN13 thay nó bằng chính `lib/ac-line.cjs` —
  tệp đang bị tiêm — nên số bên đọc ĐỘC LẬP thật là ba, không phải bốn.
- **Khối «Lỗi TRONG hợp đồng» của AC-10 in chỗ giữ.** Bên viết đặt `plain: null`
  cho mọi mục in-contract theo thiết kế, bên đọc chỉ in `plain`. Chính tệp
  `review-findings.md` của lượt này chứng minh sống: hai mục ở «## Trong hợp
  đồng» đều có dòng `Người dùng thấy gì:` trống.

## Ngoài hợp đồng

Không có. Cả mười phát hiện đều nằm trong bảy tiêu chí đã duyệt — xem
`review-findings.md`. Phân loại của máy (0 trong hợp đồng / 7 ngoài) KHÔNG dùng
được: bước triage khai hỏng ở chính lượt này.

## Analyst

Không đo được ở lượt này. Đối chứng nền trả `MODULE_NOT_FOUND` cho cả bảy lệnh
(tệp ca là tệp MỚI, chưa có ở cây gốc), nên không lệnh nào chứng minh được nó
phân biệt cây lành với cây hỏng. Trường `baseline:` của mọi khối đã ghi `n-a`.
Chứng cứ phân biệt duy nhất đang sống là mũi tiêm trong thân CN13 và CN14.

## Variance

none — every multi-run eval is uniform

## Iterations

Lượt 5 (phạm vi đã cắt, 7 tiêu chí): bảy phép đo và năm lệnh suite đều xanh trên
cây thật, nhưng lượt rà soát trả về 10 phát hiện đã xác nhận — 4 nặng — và bước
phân loại phạm vi khai hỏng. Verdict PENDING-JUDGMENT.

Chủ vòng đo lại hai phát hiện nặng nhất bằng tay, dựng cây gốc bằng
`git archive 86cc59df lib scripts` (trọn thư mục):

- Hợp đồng KHÔNG có mục tiêu chí, có mục «Known limits» chứa `- AC-4:` và
  `- AC-9:` → cây gốc: 0 tiêu chí, cờ đỏ `blank`, dòng một-chạm khoá bằng `___`.
  Cây này: ba tiêu chí trong đó AC-4 và AC-9 là tiêu chí MA, cờ đỏ IM, dòng
  một-chạm mở sẵn chữ `duyệt`. Đây là HỒI QUY mở-cổng so với gốc, ngay tại thẻ
  người bấm duyệt.
- Hợp đồng lành có `## Criteria` với hai tiêu chí dạng tiêu đề và một dòng
  tham chiếu chéo `### AC-5, AC-9, AC-10 chưa có gì` → cây này báo «Đọc THIẾU
  1/3 … đừng duyệt» và khoá dòng một-chạm. Cảnh báo SAI trên hợp đồng lành,
  chiều an toàn.

Đo lại giá trị trên 1 243 hợp đồng thật của 22 kho, tách theo nhánh:

| Nhánh | Hợp đồng | Tiêu chí đọc thêm | Cờ điểm-mù |
|---|---:|---:|---|
| CÓ mục tiêu chí (đọc trong mục) | 139 | 1 110 | không đổi |
| KHÔNG có mục (rơi vào quét-cả-tệp) | 81 | 380 | hoá IM ở cả 81 |

Nói cách khác: 74% giá trị đến từ đường an toàn, 26% đến từ chính đường sinh ra
tiêu chí ma. Hôm nay chỉ 1 trong 81 hợp đồng thật sự nhặt một mã từ mục cấm,
nhưng cờ đã tắt ở cả 81 — nên lần sau không ai được báo.

DỪNG-VÁ nổ. Lượt 4 đã đỏ vì đúng lớp này (tiêu chí ma AC-4/AC-9 trên thẻ Cổng
Phạm vi, cờ điểm-mù im); bản vá lượt 4 chỉ đóng ca «mục có mà rỗng» và để nguyên
ca «không có mục», nên lượt 5 tái sinh cùng lớp với cùng hai mã. Máy dừng, không
vá tiếp; người chọn một trong ba lối.

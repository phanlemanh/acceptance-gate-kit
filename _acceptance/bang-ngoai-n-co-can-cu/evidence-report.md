---
schema_version: 2
feature_slug: bang-ngoai-n-co-can-cu
verdict: REJECT
failed_evals: []
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 6e07d6a2617e54e98750eaff0a16f732d69d4bdd
human_signoff:
---

# Evidence Report: bang-ngoai-n-co-can-cu

Vòng 1. Sáu eval máy (E1–E6) đều xanh. Verdict vẫn là REJECT vì hai lý do, không có eval nào đỏ:

- Hai lệnh suite không gắn eval đỏ: `bash tests/scripts/run-tests.sh --manh mjs:2/3` (30 qua, 1 hỏng) và `bash tests/plugins/run-tests.sh --manh vung:3` (3 mục hỏng: P190 thẻ bằng chứng E7, ca LB5 của hồ sơ lenh-in-ra-phai-bam-duoc, P201). Chi tiết ở khối «Lệnh suite (hồi quy)» bên dưới.
- Một phát hiện trong hợp đồng (AC-4): chốt «ma trận hụt» của BN-4 luôn đúng nên không thể đỏ (xem review-findings.md, mục «Trong hợp đồng»).

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E6 | AC-6 | script | PASS |
| E7 | AC-7 | judgment | PASS (đề xuất của hội đồng, chờ người) |
| E8 | AC-8 | judgment | PASS (đề xuất của hội đồng, chờ người) |

## Evidence

- eval: E1
  run_id: minted-bang-ngoai-n-co-can-cu-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.bang_ngoai_n
  verified_at: 2026-10-14T03:37:35Z
  output: |
    BN Results: 12 PASS · 0 FAIL

- eval: E2
  run_id: minted-bang-ngoai-n-co-can-cu-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.bang_ngoai_n
  verified_at: 2026-10-14T03:37:35Z
  output: |
    BN Results: 12 PASS · 0 FAIL

- eval: E3
  run_id: minted-bang-ngoai-n-co-can-cu-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.bang_ngoai_n
  verified_at: 2026-10-14T03:37:35Z
  output: |
    BN Results: 12 PASS · 0 FAIL

- eval: E4
  run_id: minted-bang-ngoai-n-co-can-cu-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.bang_ngoai_n
  verified_at: 2026-10-14T03:37:35Z
  output: |
    BN Results: 12 PASS · 0 FAIL

- eval: E5
  run_id: minted-bang-ngoai-n-co-can-cu-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.bang_ngoai_n
  verified_at: 2026-10-14T03:37:35Z
  output: |
    BN Results: 12 PASS · 0 FAIL

- eval: E6
  run_id: minted-bang-ngoai-n-co-can-cu-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.bang_ngoai_n_man_hep
  verified_at: 2026-10-14T03:37:35Z
  output: |
    man-hep: PASS

Ghi chú về độ chi tiết của bằng chứng: lượt chấm chỉ giữ vài dòng cuối của lệnh xanh, nên các dòng cụ thể mà `expected` của E1–E6 ghim («PASS: BN-1», «so o: <n>», «man-hep 320: ...») không nằm trong đoạn trích trên. Tổng kết của lệnh vẫn là 12 ca qua, 0 ca hỏng (E1–E5) và «man-hep: PASS» (E6). Chi tiết ở review-findings.md (phát hiện về executor `bang_ngoai_n`).

### Judgment (hội đồng đề xuất — người quyết ở Cổng 2)

- eval: E7
  judged_by: judge panel (domain-correctness · operational-feasibility · spec-alignment)
  verdict: PASS
  rationale: Đề xuất PASS (ba phiếu cùng chiều). Khối CAN-CU-CHI-DAN (dòng 430–432) bắt viết can_cu là MỘT câu ngôn ngữ sản phẩm nêu đủ bốn ý: hậu quả nặng hay nhẹ, mất hay lộ dữ liệu, người dùng tự gỡ được không, sửa sau rẻ hay đắt; cấm tên hàm, đường dẫn, mã thoát, từ ngữ regex/schema; không đề xuất cách sửa, không đọc code.
  votes:
    - domain-correctness: PASS — Khối CAN-CU-CHI-DAN (dòng 430–432) bắt viết can_cu là MỘT câu ngôn ngữ sản phẩm. Câu đó phải nêu đủ bốn ý: hậu quả nặng hay nhẹ, mất hay lộ dữ liệu, người dùng tự gỡ được không (tải lại, thử lại), sửa sau rẻ hay đắt. Khối cấm tên hàm, đường dẫn tệp, mã thoát và từ ngữ regex/schema, và nói rõ «Không đề xuất cách sửa, không đọc code». Một tác tử làm đúng khối này sẽ cho người ký Cổng 2 biết lý do đề xuất mà không cần mở tệp nào.
    - operational-feasibility: PASS — Khối CAN-CU-CHI-DAN (dòng 430–432) bắt buộc một câu tiếng sản phẩm, nêu đủ bốn ý người ký cần: hậu quả nặng hay nhẹ, mất hay lộ dữ liệu, người dùng tự gỡ được không (tải lại, thử lại), sửa sau rẻ hay đắt. Khối cấm tên hàm, đường dẫn, mã thoát, từ ngữ regex/schema. Khối cũng cấm đề xuất cách sửa và cấm đọc code, nên không đẩy tác tử sang đọc mã hay chữa lỗi.
    - spec-alignment: PASS — Khối CAN-CU-CHI-DAN (dòng 430–432) bắt buộc đúng MỘT câu ngôn ngữ sản phẩm. Câu đó phải nói bốn điều: hậu quả nặng hay nhẹ, mất hay lộ dữ liệu, người dùng tự gỡ được không (tải lại, thử lại), sửa sau rẻ hay đắt. Khối cấm tên hàm, đường dẫn tệp, mã thoát, từ ngữ regex/schema, và ghi rõ «Không đề xuất cách sửa, không đọc code», nên không bảo tác tử đọc mã hay đề xuất cách sửa.
  human_override:  # chi nguoi ghi

- eval: E8
  judged_by: judge panel (domain-correctness · operational-feasibility · spec-alignment)
  verdict: PASS
  rationale: Đề xuất PASS (ba phiếu cùng chiều). Mục «Chưa phát hành» của CHANGELOG.md và khối «Ngoài hợp đồng» của commands/acceptance-card.md cùng nêu đủ các ý; điểm lệch nhỏ duy nhất là «câu gộp ký» (câu hỏi) so với «dòng lệnh ký» (hai tệp), hội đồng đọc là cùng một thứ.
  votes:
    - domain-correctness: PASS — Hai tệp nói đủ cả sáu ý. Cả hai mô tả bảng bốn cột Mục · Người dùng gặp gì · Máy đề xuất · Căn cứ và thứ tự mục cần quyết đứng đầu. CHANGELOG nói Căn cứ do bước phân loại viết và đi theo mục mang sang lượt sau, còn hồ sơ cũ hiện «chưa có căn cứ» kèm một cờ vàng mà không phải sửa. CHANGELOG cũng ghi «Không đổi» cho dòng lệnh ký và ba lựa chọn, và nói kho chỉ cần nhận mốc, không có khoá hay tệp mới phải chép.
    - operational-feasibility: PASS — Mục «Chưa phát hành» của CHANGELOG và đoạn «Ngoài hợp đồng» của acceptance-card.md đủ để người dùng kho trả lời cả bảy ý. Bảng bốn cột Mục · Người dùng gặp gì · Máy đề xuất · Căn cứ được nêu ở cả hai nơi. Căn cứ do bước phân loại viết và đi theo mục mang sang lượt sau. Mục cần quyết đứng đầu. Hồ sơ cũ hiện «chưa có căn cứ» kèm một cờ vàng và không phải sửa. Dòng lệnh ký và ba lựa chọn không đổi. Kho chỉ cần nhận mốc. Điểm lệch nhỏ: văn bản nói «dòng lệnh ký», không dùng đúng chữ «câu gộp ký», nhưng nghĩa khớp.
    - spec-alignment: PASS — Mục «Chưa phát hành» của CHANGELOG.md và khối «Ngoài hợp đồng» của commands/acceptance-card.md cùng nêu đủ sáu ý. Đó là bảng bốn cột Mục · Người dùng gặp gì · Máy đề xuất · Căn cứ, căn cứ do bước phân loại viết và đi theo mục mang sang lượt sau, mục cần quyết đứng đầu, hồ sơ cũ hiện «chưa có căn cứ» kèm một cờ vàng và không phải sửa, dòng lệnh ký cùng ba lựa chọn không đổi, và kho chỉ cần nhận mốc. Điểm lệch nhỏ là «câu gộp ký» trong câu hỏi so với «dòng lệnh ký» trong hai tệp. Tôi đọc hai cụm là cùng một thứ nên không coi là lỗi.
  human_override:  # chi nguoi ghi

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-bang-ngoai-n-co-can-cu-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-10-14T03:37:35Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-bang-ngoai-n-co-can-cu-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 0
  verified_at: 2026-10-14T03:37:35Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-bang-ngoai-n-co-can-cu-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 1
  verified_at: 2026-10-14T03:37:35Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-bang-ngoai-n-co-can-cu-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 0
  verified_at: 2026-10-14T03:37:35Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-bang-ngoai-n-co-can-cu-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-14T03:37:35Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-bang-ngoai-n-co-can-cu-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 0
  verified_at: 2026-10-14T03:37:35Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-bang-ngoai-n-co-can-cu-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-10-14T03:37:35Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-bang-ngoai-n-co-can-cu-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 1
  verified_at: 2026-10-14T03:37:35Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-bang-ngoai-n-co-can-cu-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-14T03:37:35Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-bang-ngoai-n-co-can-cu-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 0
  verified_at: 2026-10-14T03:37:35Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-bang-ngoai-n-co-can-cu-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r1
  exit_code: 0
  verified_at: 2026-10-14T03:37:35Z

Hai lệnh suite hỏng (không gắn eval nào), đoạn trích cuối của lượt chạy:

- `bash tests/scripts/run-tests.sh --manh mjs:2/3`: tổng kết «Results: 30 passed, 1 failed». Đoạn cuối còn lại của lượt chạy chỉ có các ca PASS của vat-da-o-nhanh-goc.test.mjs (11 ca) và xem-trang-lo-trinh.test.mjs (9 ca); tệp hỏng nằm ở phần đầu đã bị cắt khỏi đoạn trích, nên chưa định danh được từ bằng chứng này.
- `bash tests/plugins/run-tests.sh --manh vung:3`: ba mục hỏng. «P190 thẻ bằng chứng E7 == bản render thật (sinh lại + so byte + mutant)»; «[LB5] repo-khai-plugin: CỘNG cờ lén ... hồ sơ chấm bằng bản kit t...» kéo theo «ca lệnh bấm được — LB5 (hồ sơ lenh-in-ra-phai-bam-duoc)»; «P201 ngăn không-sửa có tên + đường đọc-cũ + mutant». Tổng kết «Results: 3 failed».

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không-phân-biệt (xanh cả hai phía): none — danh sách rỗng. Ghi trung thực: E1–E6 đều có baseline n-a (eval mới, tệp chưa có ở merge-base), nên phân biệt dựa vào các ca -do (bản sao bị tiêm) nằm trong chính tệp test, không dựa vào A/B baseline.

Baseline khong do

- node tests/scripts/bang-ngoai-n.test.mjs: bo qua baseline: tep tests/scripts/bang-ngoai-n.test.mjs co o cay dang kiem nhung chua co o merge-base fbbd10a2a4a09aeb82e6ea6980123b0b30cb5f2c — eval moi, chay tren code cu khong phan biet gi
- python3 _acceptance/bang-ngoai-n-co-can-cu/rang/man-hep.py: bo qua baseline: tep _acceptance/bang-ngoai-n-co-can-cu/rang/man-hep.py co o cay dang kiem nhung chua co o merge-base fbbd10a2a4a09aeb82e6ea6980123b0b30cb5f2c — eval moi, chay tren code cu khong phan biet gi

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: không eval nào đỏ (failed_evals rỗng), nhưng hai lệnh suite không gắn eval hỏng (mjs:2/3; plugins vung:3) và một phát hiện trong hợp đồng ở AC-4 (chốt «ma trận hụt» luôn đúng). Trả về giai đoạn cài đặt.

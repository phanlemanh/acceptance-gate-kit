---
schema_version: 2
feature_slug: cong-dang-co-cua
verdict: PENDING-JUDGMENT
failed_evals: []
reason: bằng chứng máy vòng 3 do CHÍNH PHIÊN THI CÔNG chạy, chưa qua phiên sạch — máy KHÔNG tự kết luận PASS
verified_by: implementing session (KHÔNG phải fresh-context subagent — xem Known limits #4)
enforcement_mode: strict
bypass_used: false
verified_commit: b480dbb85d2c5663859ac960bc17513fd9117f4f
human_signoff:
---

# Evidence Report: cong-dang-co-cua

**Đọc dòng này trước mọi dòng khác.** Đây là báo cáo cho **hợp đồng đã THU PHẠM
VI** (ba tiêu chí AC-A/AC-B/AC-C). Hai vòng chấm bằng phiên sạch trước đó
(r1, r2) chấm bản hợp đồng **13 tiêu chí** đã bị cắt, và cả hai trả REJECT; hồ
sơ của chúng còn nguyên ở `review-findings.md` và ở commit `d90af7d2` (r1) /
`528caaa8` (r2). Vòng 3 KHÔNG phải một lần chấm sạch — nó là lần chạy lại của
chính phiên thi công. Vì thế `verdict` là `PENDING-JUDGMENT`, không phải `PASS`:
máy không đủ tư cách tự kết luận về mã chính nó vừa viết.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| EA | AC-A | script | PASS |
| EB | AC-A | script | PASS |
| EC | AC-C | script | PASS |

(AC-B phủ bởi EA — cùng chân `loi-thuat` ghim cả tám dòng ca của hai lời thuật.)

## Evidence

- eval: EA
  run_id: local-cong-dang-co-cua-EA-r3
  exit_code: 0
  verifier: config:executors.script.cdcc_loi_thuat
  verified_at: 2026-09-01T07:48:00Z
  output: 11 assert xanh — hai hằng thông điệp rút từ khối marker, tám dòng ca
    của lưới thường trực (GD01…GD03-ten-field) ghim đúng tên, cộng cặp đối chứng
    hai chiều cho chính phép grep (ca chắc chắn có phải thấy; chuỗi chắc chắn
    không có phải không thấy).

- eval: EB
  run_id: local-cong-dang-co-cua-EB-r3
  exit_code: 0
  verifier: config:executors.script.cdcc_gioi_han
  verified_at: 2026-09-01T07:48:00Z
  output: 6 assert xanh — bốn dòng ca ghim GIỚI HẠN ĐÃ KHAI, cộng hai lượt chạy
    thật: ô đang chờ Cổng Đáng thoát 2 với stdout rỗng, và cờ ép `--gate 0`
    không vẽ được gì.

- eval: EC
  run_id: local-cong-dang-co-cua-EC-r3
  exit_code: 0
  verifier: config:executors.script.cdcc_dang_thuc_lop
  verified_at: 2026-09-01T07:48:00Z
  output: 3 assert xanh — chân `round-trip` của hồ sơ đã ký `khong-ve-the-ma`
    chạy lại cho 17 pass / 0 fail; chiều đỏ ghim lại hằng số 3 trên bản sao trọn
    cây làm nó ĐỎ, chứng phép đo đọc bên viết thật.

- cmd: bash tests/scripts/run-tests.sh
  run_id: local-cong-dang-co-cua-SUITE-scripts-r3
  exit_code: 0
  verified_at: 2026-09-01T07:48:00Z
  output: Results: 793 passed, 0 failed

- cmd: bash tests/hooks/run-tests.sh
  run_id: local-cong-dang-co-cua-SUITE-hooks-r3
  exit_code: 0
  verified_at: 2026-09-01T07:48:00Z
  output: Results: 60 passed, 0 failed

- cmd: bash tests/plugins/run-tests.sh
  run_id: local-cong-dang-co-cua-SUITE-plugins-r3
  exit_code: 0
  verified_at: 2026-09-01T07:48:00Z
  output: Results: all plugin tests passed

- cmd: bash tests/workflows/run-tests.sh
  run_id: local-cong-dang-co-cua-SUITE-workflows-r3
  exit_code: 0
  verified_at: 2026-09-01T07:48:00Z
  output: Results: all workflow tests passed

- cmd: node scripts/product-map.mjs --root . --check
  run_id: local-cong-dang-co-cua-SUITE-map-r3
  exit_code: 0
  verified_at: 2026-09-01T07:48:00Z
  output: bản đồ sản phẩm khớp hồ sơ xưởng

## Known limits

1. **Lỗ gốc CHƯA ĐÓNG.** Ô đang chờ Cổng Đáng vẫn nhận lời thuật «hồ sơ chưa có
   contract.md» với việc-kế sai hướng — đúng DEFECT 1 của báo cáo 01/09 mở ra
   vòng này. Bốn ô ở kho kit còn kẹt: `lan-may-thong-duong-ghi`,
   `phep-kiem-sach-do-theo-vung`, `hinh-o-moi-cong-dung-cho-nguoi`,
   `the-xep-nham-o-se-lam`. Ca `GD05` + chân `gioi-han` ghim đúng trạng thái đó
   để lỗ không vô hình.
2. **Ô cơ hội không đọc được thì báo sai nguyên nhân.** `opportunity.md` bị
   EACCES/EISDIR hoặc quá 1MB bị bộ đọc nuốt thành chuỗi rỗng, rồi rơi vào lời
   thuật «chưa có contract.md» thay vì kêu to. Phát hiện của vòng chấm r1, ngoài
   hợp đồng, chưa sửa. Sổ vòng-đời: `cong-dang-co-cua#4`.
3. **Đối chứng dương SELF02 CHÉP công thức thay vì GỌI phép quét của SELF01.**
   Hai bản byte-gần-giống; sửa bản này quên bản kia thì SELF01 có thể mù mà
   SELF02 vẫn xanh. Phát hiện của cả r1 lẫn r2, ngoài hợp đồng, chưa sửa. Sổ
   vòng-đời: `cong-dang-co-cua#2` và `#9`.
4. **Bằng chứng vòng 3 KHÔNG do phiên sạch tạo.** Bản thu phạm vi (gỡ làn thẻ)
   và bản vá lớp cho chân `round-trip` viết SAU vòng chấm r2, nên chưa bộ chấm
   độc lập nào đọc chúng. Ba eval + bốn suite ở trên do chính phiên thi công
   chạy. Đây là lý do `verdict` là `PENDING-JUDGMENT`; nâng lên `PASS` là quyết
   định của người ký, không phải kết luận của máy.
5. **Mười hai mục «đề xuất known-limits» của r1 và các mục của r2** đã vào sổ
   vòng-đời `docs/research/known-limits-ledger.tsv` với `status: song` (đang
   mở). Phần lớn thuộc làn thẻ đã trả về ô — đọc
   `discovery/LAY-VE-LAN-THE.md` trước khi mở lại.

## Ngoài hợp đồng

Toàn bộ mục ngoài hợp đồng của r1 và r2 giữ nguyên trong `review-findings.md`.
Những mục thuộc làn thẻ Cổng Đáng đi cùng làn về ô (cây ghim `528caaa8`); ba mục
còn áp cho mã đang giao đã nêu ở Known limits #1–#3.

## Analyst

Không có eval nào không phân biệt được: mỗi chân đều mang đối chứng dương của
riêng nó, và chân `dang-thuc-lop` mang chiều đỏ chạy trên bản sao trọn cây.

## Variance

Không eval nào có `runs > 1` trong vòng này.

## Iterations

**Round 1** (phiên sạch, `394af3fb`): 14 phép đo máy + 5 suite + hội đồng phán
đoán XANH HẾT; rà soát đối kháng trả 18 phát hiện, 5 trong hợp đồng. REJECT.

**Round 2** (phiên sạch, `8e34b7da`): sửa 5 phát hiện, nới xưởng 9→12 ô. 12 phép
đo chạy lại + 2 mang sang + 5 suite + hội đồng XANH HẾT; rà soát trả 16 phát
hiện, 7 trong hợp đồng. REJECT. **Ba lớp lỗi tái phát y nguyên từ vòng 1** —
cờ-người-dùng-xuyên-chốt · hai-nguồn-cho-một-luật · đối-chứng-chép-công-thức —
nên **điều khoản dừng-vá kích hoạt**: khuôn giải sai, không phải chi tiết sai.
Máy KHÔNG mở vòng ba, trình người ba đường.

**Round 3** (phiên thi công, `b480dbb8`): owner quyết **thu phạm vi**. Làn thẻ
Cổng Đáng, chế độ ký, ngữ pháp `g0`, bộ răng 13 chân **trả về ô** (cây ghim
`528caaa8`). Hợp đồng viết lại còn ba tiêu chí; ba phép đo mới neo vào lưới
thường trực. Bốn suite + bản đồ xanh. Không phải một lần chấm sạch — xem Known
limits #4.

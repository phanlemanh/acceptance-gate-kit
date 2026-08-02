## Trong hợp đồng

(Không có finding nào ánh xạ được vào AC trong round 3 — toàn bộ 11/11 eval máy đạt, 0 lỗi trong hợp đồng.)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Thẻ Cổng 2 hiện nguyên văn tiếng máy — card-plain.json chưa dựng lại sau hai vòng S4**
  Người dùng thấy gì: Thẻ tóm tắt cho người duyệt ở bước ký cuối vẫn hiện vài dòng ghi chú kỹ thuật thô (mã số, thuật ngữ nội bộ) thay vì lời giải thích bằng tiếng người, khiến người duyệt phải tự suy đoán ý nghĩa của các dòng đó trước khi quyết định.
  file: `_acceptance/hinh-theo-mat-phang/card-plain.json`
  severity: high
  Đề xuất: known-limits

- **"Đối chứng âm" của P96 là hằng đúng — không thể đỏ với đúng lớp lỗi nó nêu tên**
  Người dùng thấy gì: Một bước kiểm tra tự động được thêm vào để đảm bảo danh sách từ khoá không bị quên cập nhật trong tương lai thực chất không có khả năng phát hiện đúng lỗi đó — nếu lỗi loại này quay lại sau này, hệ thống sẽ không báo động dù bước kiểm tra vẫn báo "đạt".
  file: `tests/plugins/run-tests.sh`
  severity: high
  Đề xuất: known-limits

- **verified_commit chưa neo lại sau commit sửa — bằng chứng ở HEAD đã cũ theo chính luật của kit**
  Người dùng thấy gì: Báo cáo bằng chứng đang xác nhận "đạt" cho một phiên bản mã cũ hơn phiên bản mới nhất thực sự có trên nhánh; nếu ký duyệt ngay bây giờ, chữ ký sẽ không phản ánh đúng những thay đổi mới nhất.
  file: `_acceptance/hinh-theo-mat-phang/evidence-report.md`
  severity: medium
  Đề xuất: known-limits

- **`_Avoid_: kênh` là blacklist trên không gian mở — đã sinh 3 cảnh báo W6 sai trên hợp đồng có sẵn**
  Người dùng thấy gì: Việc thêm một từ mới vào danh sách "nên tránh dùng" đã vô tình khiến ba tài liệu nghiệm thu khác (đã được duyệt và ký từ trước, không liên quan đến hình vẽ) bị hệ thống báo cảnh báo sai, làm loãng độ tin cậy của các cảnh báo cho những lượt duyệt sau.
  file: `CONTEXT.md`
  severity: medium
  Đề xuất: new-contract

- **`if True:` còn sót lại trong P96 sau khi gỡ điều kiện tự-gác**
  Người dùng thấy gì: Một đoạn mã kiểm tra nội bộ còn sót lại phần thừa không còn ý nghĩa, gây khó hiểu cho người bảo trì sau này; không ảnh hưởng tới kết quả hay hành vi hiện tại của sản phẩm.
  file: `tests/plugins/run-tests.sh`
  severity: low
  Đề xuất: known-limits

- **P96 negative control is a tautology — cannot ever fail**
  Người dùng thấy gì: Một bước kiểm tra tự động được thêm vào để đảm bảo danh sách từ khoá không bị quên cập nhật trong tương lai thực chất không có khả năng phát hiện đúng lỗi đó — nếu lỗi loại này quay lại sau này, hệ thống sẽ không báo động dù bước kiểm tra vẫn báo "đạt".
  file: `tests/plugins/run-tests.sh`
  severity: high
  Đề xuất: known-limits

- **CONTEXT.md citation of DECISION-DIAGRAM-SURFACES is never resolved — typo stays green**
  Người dùng thấy gì: Tài liệu thuật ngữ nội bộ nhắc tới tên của một bảng tra khác bằng chữ, nhưng không có gì tự động xác minh cái tên đó thực sự tồn tại; nếu ai đó gõ sai tên trong tương lai, tài liệu vẫn hiển thị bình thường trong khi dẫn người đọc tới một mục không có thật.
  file: `CONTEXT.md`
  severity: medium
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

(Không có finding nào với `unverified=true` trong round 3.)

⚠ Cụm ngoài vùng phủ: 2/7 lỗi rơi vào file không bộ đo nào phủ (_acceptance/hinh-theo-mat-phang/card-plain.json, _acceptance/hinh-theo-mat-phang/evidence-report.md) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.

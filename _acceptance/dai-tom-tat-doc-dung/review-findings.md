# Review findings: dai-tom-tat-doc-dung (round 1)

## Trong hợp đồng

Không có phát hiện nào ánh xạ được vào một tiêu chí của hợp đồng.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Cờ vàng «Notes nhắc giới hạn sai khuôn» bật cả ở câu văn nhắc tới giới hạn, kể cả câu phủ định: chiều im chưa được kiểm**
  Người dùng thấy gì: Một số hồ sơ không có giới hạn nào vẫn bị gắn cảnh báo vàng «Notes nhắc giới hạn sai khuôn» chỉ vì phần ghi chú có câu nhắc tới chữ giới hạn đã biết. Người đọc dải tóm tắt có thể tưởng hồ sơ viết sai chỗ trong khi không có gì sai.
  file: `scripts/ho-so-tom-tat.cjs`
  severity: medium
  Đề xuất: known-limits

- **Bộ đọc khoá `production.nhanh` lệch nếp đọc ổ cắm sẵn có: chú thích ở cột 0 làm khoá tắt im lặng, `~`/`null` bị đọc thành tên nhánh**
  Người dùng thấy gì: Nếu kho khai nhánh production bằng cách viết hơi khác thường, ví dụ có dòng chú thích xen giữa hoặc để giá trị rỗng, ô production có thể lặng lẽ quay về cách hiển thị cũ hoặc báo không thấy một nhánh tên lạ. Kho khai theo mẫu chuẩn thì không bị ảnh hưởng.
  file: `scripts/ho-so-tom-tat.cjs`
  severity: medium
  Đề xuất: known-limits

- **Thẻ Cổng Phạm vi hứa trường hợp gộp squash thì ô «nói rõ là không đọc được», nhưng mã in khẳng định «chưa gộp vào <nhánh>»**
  Người dùng thấy gì: Khi việc đã được gộp theo kiểu squash mà nhánh cũ vẫn còn, ô production có thể ghi «chưa gộp» trong khi thực tế đã gộp. Câu này lệch với lời thẻ duyệt đã hứa là ô sẽ nói rõ «không đọc được».
  file: `_acceptance/dai-tom-tat-doc-dung/card-plain.json`
  severity: medium
  Đề xuất: known-limits

- **feature-loop SKILL vẫn tả lối «ghi Known limits» là «thêm bullet vào ## Notes» mà không trỏ tới khối KNOWN-LIMITS-NOTE**
  Người dùng thấy gì: Một lối hướng dẫn khác vẫn dặn ghi giới hạn mà không nêu khuôn chuẩn. Nếu máy làm theo lối đó và viết lệch khuôn, giới hạn sẽ không được đếm trên dải tóm tắt và cũng không có cảnh báo.
  file: `feature-loop/skills/feature-loop/SKILL.md`
  severity: low
  Đề xuất: known-limits

- **Ổ cắm mới `production.nhanh` chưa vào mục cấu hình của GUIDE.md, cũng chưa vào danh sách hiện thân «Ổ cắm» trong CONTEXT.md**
  Người dùng thấy gì: Kho nào muốn bật tính năng đọc trạng thái triển khai production phải tìm trong tài liệu tham chiếu chuyên sâu, vì hướng dẫn cấu hình chung chưa nhắc tới. Có thể có kho không biết tính năng này tồn tại.
  file: `skills/acceptance/references/lo-trinh-du-lieu.md`
  severity: low
  Đề xuất: known-limits

- **Known-limits heading or paragraph followed by an intro paragraph or 'None.' is counted as one limit, and the real bullets are dropped**
  Người dùng thấy gì: Khi phần giới hạn đã biết có một đoạn dẫn trước danh sách, hoặc chỉ ghi «None.», dải tóm tắt có thể đếm sai: hoặc báo 1 giới hạn dù không có, hoặc bỏ sót toàn bộ danh sách thật. Người đọc có thể thấy con số giới hạn không đúng với hồ sơ.
  file: `scripts/ho-so-tom-tat.cjs`
  severity: medium
  Đề xuất: new-contract

- **The 400-character cap now also truncates the full 'Vì sao làm' section on the evidence page**
  Người dùng thấy gì: Trên trang bằng chứng, mục «Vì sao làm» khi mở rộng giờ cũng bị cắt ở khoảng 400 ký tự, nên người đọc mất phần lý do đầy đủ ở những hồ sơ có lý do dài. Trước đây mục này hiện trọn đoạn.
  file: `scripts/ho-so-tom-tat.cjs`
  severity: medium
  Đề xuất: new-contract

- **The gate card promises a squash merge shows 'can't read'; the code shows 'chưa gộp' (not merged)**
  Người dùng thấy gì: Với việc đã gộp kiểu squash mà nhánh cũ còn đó, ô production có thể ghi «chưa gộp» dù việc đã vào nhánh chính. Thẻ duyệt đã nói ô sẽ báo «không đọc được», nên người ký có thể hiểu khác với thực tế.
  file: `_acceptance/dai-tom-tat-doc-dung/card-plain.json`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 (ghim thông điệp lỏng): chiều đỏ DT-4-do ghim «cần 3» trong khi E4 hứa thông điệp nêu «5»; các ca đỏ khác ghim chính giá trị mong đợi**
  Người dùng thấy gì: Một số bài kiểm tra máy có thể vẫn xanh dù lỗi báo ra không đúng lý do mà bài kiểm tra định bắt. Người dùng sản phẩm không thấy gì, nhưng độ tin cậy của lưới kiểm giảm nhẹ ở vài ca.
  file: `tests/scripts/dai-tom-tat.test.mjs`
  severity: low
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 3/9 lỗi rơi vào file không bộ đo nào phủ (_acceptance/dai-tom-tat-doc-dung/card-plain.json, feature-loop/skills/feature-loop/SKILL.md) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.

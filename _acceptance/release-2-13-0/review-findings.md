## Trong hợp đồng

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Chân `do` in token `FAIL: P93` trên lối THÀNH CÔNG; đổi kênh sang stderr không cứu được người đọc thật, vì executor của E5b chạy qua Bash tool gộp stdout+stderr**
  Người dùng thấy gì: Khi hệ thống tự kiểm tra bản vá lần này báo kết quả, dòng chữ cảnh báo cũ vẫn lẫn trong phần in ra dù bước kiểm tra đã thực sự qua, nên người hoặc máy đọc kết quả có thể hiểu nhầm là kiểm tra bị lỗi và tốn công điều tra một cảnh báo giả.
  file: `_acceptance/release-2-13-0/rang-p93.sh:143`
  severity: medium
  Đề xuất: known-limits

- **Khẳng định «bản sao là ảnh của vật» đo trên tập ĐÃ LỌC nên không canh được chính cái `-f` mà nó sinh ra để canh — gỡ `-f` hôm nay vẫn XANH**
  Người dùng thấy gì: Phép kiểm 'bản sao giống hệt bản gốc' mới thêm trong lần vá này không thực sự bắt được đúng loại lỗi nó được viết ra để ngăn — nếu sau này ai đó vô tình bỏ một dòng sửa liên quan, hệ thống vẫn báo 'ổn' dù thực ra đã hỏng lại.
  file: `tests/plugins/run-tests.sh:2222`
  severity: low
  Đề xuất: known-limits

- **Chuyển dòng P93 sang stderr không gỡ được nguyên nhân đỏ giả: đường chấm thật gộp hai luồng nên chuỗi «FAIL: P93» vẫn nằm trong output mà tác tử đọc**
  Người dùng thấy gì: Bản vá đổi kênh in cảnh báo nhưng cách hệ thống chạy lệnh kiểm tra vẫn gộp hai luồng chữ làm một, nên người đọc kết quả vẫn có thể thấy dòng cảnh báo gây hiểu nhầm là có lỗi dù thực chất đã qua.
  file: `_acceptance/release-2-13-0/rang-p93.sh:143`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 — tuyên quét LỚP «cặp marker duy nhất TOÀN KHO» (PAIRS 8 phần tử) nhưng chiều đỏ chỉ ghim 5/8; gỡ HFL-GLOSSARY-TERMS khỏi PAIRS, cả suite vẫn XANH (đã chạy mutant)**
  Người dùng thấy gì: Một phép kiểm bảo đảm 'mỗi thuật ngữ chỉ định nghĩa đúng một chỗ trong toàn bộ tài liệu' đang bỏ sót một thuật ngữ (từ điển biệt ngữ) — nếu thuật ngữ đó lỡ bị định nghĩa trùng ở nơi khác sau này, hệ thống sẽ không phát hiện ra.
  file: `tests/plugins/run-tests.sh:2246`
  severity: medium
  Đề xuất: new-contract

- **Hình dạng 4 + 3 — khẳng định bất biến mới trong dung_ban_sao không có chiều đỏ (dựng xong rồi tự kiểm chính cách dựng), và đo SỐ ĐẾM trong khi lời hứa viết ngay trên nó là hai tập «TRÙNG KHÍT»**
  Người dùng thấy gì: Một lớp kiểm tra mới thêm để bảo đảm 'bản sao là ảnh đúng của bản gốc' hiện chỉ so sánh số lượng tệp thay vì đúng nội dung, và chưa từng được thử với một trường hợp phải báo lỗi để chứng minh nó thật sự có tác dụng — nên độ tin cậy của lớp bảo vệ này chưa được kiểm chứng đầy đủ.
  file: `tests/plugins/run-tests.sh:2222`
  severity: low
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
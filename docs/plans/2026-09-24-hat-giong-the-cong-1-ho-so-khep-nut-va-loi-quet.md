# Hạt giống — thẻ Cổng 1 của hồ sơ đã khép vẫn in nút «Sửa lại / Duyệt, cho code», và bỏ qua im lặng lỗi của bộ quét

**Ngày:** 2026-09-24 · **Trạng thái:** hạt giống (SỔ, chưa là ô)
Gốc: acceptance-gate-kit/_acceptance/ha-tang-khong-dot-luot — lượt chấm 2, mục Ngoài-5 và Ngoài-6 của `review-findings.md` (cùng hình đã hiện ở lượt 1); owner chọn «mở hợp đồng mới» ở Cổng Bằng chứng 24/09.

## Ca

Vòng `ha-tang-khong-dot-luot` (AC-7) cho thẻ Cổng 1 của hồ sơ đã khép (chấm bởi thực tế, không có
báo cáo) thôi hỏi «duyệt hay sửa». Hai chỗ còn lệch với nhánh Cổng 2 của cùng ca:

1. Khối chân thẻ vẫn chạy vô điều kiện, nên dưới câu «không còn câu hỏi nào cho người» vẫn có hai
   nút «Sửa lại» và «Duyệt, cho code». Nhánh Cổng 2 thay cả chân thẻ bằng dòng «Hồ sơ đã khép —
   mở lại bằng một dòng sổ…» và bỏ nút.
2. Nhánh Cổng 1 chỉ đọc `quetHoSo().hit`, bỏ qua `err`/`broken`. Bộ quét chết trên đúng loại hồ
   sơ này thì thẻ lặng lẽ quay về hỏi «duyệt hay sửa», không cờ; nhánh Cổng 2 bật cờ vàng.

## Dạng nghiệm đúng tầng

Nhánh Cổng 1 dùng CHUNG khối chân thẻ và cờ lỗi bộ quét của nhánh Cổng 2 (một hàm, không bản chép
thứ hai). Chiều đỏ: fixture hồ sơ khép → HTML không có «Duyệt, cho code»; bộ quét giả thoát ≠ 0 →
thẻ có cờ vàng. Đối chứng: hồ sơ sống vẫn có nút như cũ.

TRỪ (bớt một mời duyệt sai). Ngưỡng mở ô: cần neo ngoài — một thẻ thật ở kho tiêu thụ in nút trên
hồ sơ khép (crm có bảy hồ sơ chấm-bởi-thực-tế để đo sau khi cài 2.18.3).

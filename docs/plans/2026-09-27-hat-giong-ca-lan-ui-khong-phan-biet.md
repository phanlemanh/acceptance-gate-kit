# Hạt giống — ca «luật dấu không chạm làn ui» không phân biệt được hai phía

**Ngày:** 2026-09-27 · **Trạng thái:** hạt giống (SỔ, chưa là ô)
Gốc: acceptance-gate-kit/_acceptance/cham-khong-tu-dot-luot — lượt chấm 3, mục Ngoài-3 của `review-findings.md`; owner chọn «mở hợp đồng mới» ở Cổng Bằng chứng 27/09.

## Ca

E2 hứa «CK-AC2-ui: eval ui-check khai 0 không dấu vẫn đạt (luật không chạm làn ui)» — một QUAN
HỆ: làn machine đi qua `normDau`, làn ui thì không. Sau khi gỡ hàng 7 (ngưỡng chết, lượt chấm 1),
`normDau` giữ lời khai khi không có dấu, nên fixture ui hiện tại (khai 0, không dấu) ra PASS dù
`normDau` có áp lên làn ui hay không. Thêm `.map(normDau)` vào chuỗi xử lý kết quả ui thì ca vẫn
xanh — ca không có chiều đỏ.

## Dạng nghiệm đúng tầng

Fixture ui mang dấu TRÁI lời khai (khai 0, đuôi `__EXIT=1`): vật lành → đạt (làn ui không đọc
dấu); bản sao áp `normDau` lên làn ui → REJECT, thông điệp ghim «lan ui bi luat dau cham».

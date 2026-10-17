# Hình tại Cổng Phạm vi — road-map-de-dung

| Điểm | Đếm | Hình |
|---|---|---|
| Hỏi-1 — ba việc CỘNG (E1 lệnh xem đưa đường dẫn trang · E2 Rà soát + Giờ máy lên trang · E3 road-map mặc định) sang vòng RD2, duyệt trước mục nào | 3 nhánh × hai lối | `cong-pham-vi-hai-cau.html` |
| Hỏi-2 — tiêu đề mục `da_bac` trên trang: «Không làm trong kho» (dùng khối sẵn có) hay khoá mới `ra_khoi_kho` | 2 nhánh | `cong-pham-vi-hai-cau.html` |
| Hỏi-3 — tên việc trên mọi mặt: câu giao đầy đủ (như trang crm) hay tên ngắn trước | 2 nhánh | hai ảnh bản mẫu `evidence/design-pass/ten-la-cau-giao--*` và `ten-ngan--*` — ảnh thật thay hình vẽ |
| Luật mới «bỏ mốc ngoài» — việc của người đi đâu (bốn đích) | 4 nhánh rẽ | `bon-dich-viec-cua-nguoi.html` |
| gap-probe P0 «vi_sao» (đã sửa, máy quyết theo TRỪ) | dưới ngưỡng: 1 lối sống | — |

## Đề bài

**bon-dich-viec-cua-nguoi** — loại: cây quyết định / flowchart. Gốc: «một việc của người trên lộ trình (mốc ngoài cũ)». Bốn
nhánh, mỗi nhánh một câu hỏi phân loại → đích: (1) sự kiện của người tạo HẠN → `ngay` của chính mốc phát triển; mã vào «Không làm
trong kho» với lý do nêu mốc nhận hạn · (2) đo giá trị (nghiệm thu, đọc số) → ngưỡng + ngày đọc trong ô cơ hội của hàng; kết quả
ghi bằng lệnh observed · (3) vận hành thuần (gửi danh sách, đào tạo) → ra khỏi kho (lịch chủ kho); mã vào «Không làm trong kho» ·
(4) hàng cần KẾT QUẢ của việc ấy → «Chờ điều kiện» + mở lại khi. Chân hình: «Tệp cũ còn mốc ngoài: vẫn đọc được, trang không vẽ,
một dòng cờ có tên». AC-1, AC-2, AC-3.

**cong-pham-vi-hai-cau** — loại: hai khối lựa chọn cạnh nhau. Hỏi-1: E sang RD2 · khuyên duyệt trước E1 + E2, E3 đổi thành «đề
nghị bật khi kho khai lộ trình» (giữ ADR 0025) | lối khác: gộp E vào RD1 → hợp đồng 13+ tiêu chí phải tách, +~1 ngày máy, E3 cần ADR
lật ADR 0025. Hỏi-2: khuyên dùng `da_bac` sẵn có, tiêu đề «Không làm trong kho», mỗi mục kèm lý do (TRỪ) | lối khác: khoá mới
`ra_khoi_kho` (CỘNG, mọi kho học khoá mới). Đánh dấu ngả máy khuyên.

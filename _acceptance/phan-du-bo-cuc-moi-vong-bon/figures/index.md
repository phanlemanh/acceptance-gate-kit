# Hình tại Cổng Phạm vi — phan-du-bo-cuc-moi-vong-bon

Kê từ sổ S1 và design §5. Ngưỡng N5: từ ba bước nối tiếp hoặc từ hai nhánh rẽ → cần hình.

| Điểm | Đếm | Hình |
|---|---|---|
| Hỏi-1 — K4-MP sửa ở đâu | 2 nhánh rẽ (thước B2 · nhãn ca ở kho này) + chuỗi 3 bước «hai tên → `doiKhoa` gộp → đòi hai lần» | `ba-cau-hoi.html` (khối 1) |
| Hỏi-2 — DV5 qua lần dọn nhà | 2 nhánh rẽ (miễn có tên · nhờ B2 đổi môi trường đo) | `ba-cau-hoi.html` (khối 2) |
| Hỏi-3 — KK-6 so-that | 3 nhánh rẽ (cây phẳng lịch sử · sửa bộ xếp · B2 đổi sổ) | `ba-cau-hoi.html` (khối 3) |
| Hỏi-4 — KK-6, KL-8 | 2 nhánh rẽ (sửa hai tệp kiểm · nhờ B2 đổi môi trường đo) | `ba-cau-hoi.html` (khối 4) |
| Hỏi-5 — nhận thêm CT-10-do, KM-1 | 2 nhánh rẽ (nhận vào vòng · để vòng sau) | `ba-cau-hoi.html` (khối 5) |
| Thước so bằng nguyên luật B2 | dưới ngưỡng: 1 lối | — |

## Đề bài `ba-cau-hoi` (một hình, năm khối xếp dọc; loại: bảng quyết định — mỗi khối một câu hỏi và các lối ra)

Tiêu đề: «Vòng bốn — năm câu chỉ chủ kho quyết». Mỗi khối: một ô câu hỏi → các ô lối ra; lối máy khuyên tô nổi và ghi
«khuyên»; dưới mỗi lối một dòng GIÁ.

- Khối 1 «43 khoá K4-MP» — dòng dẫn: «Hai cây in cùng 174 tên; thước B2 gộp 2 tên thành 1 rồi đòi 2 lần (43 thiếu + 43
  thừa)». Lối A (khuyên): «B2 nhận luật so có xét chỗ» — giá: B2 đổi 1 hàm, đo trên túi của B2: 57 → 14 thiếu, 0 thừa.
  Lối B: «Đổi nhãn 81 ca ở kho này» — giá: 81 tên ca đổi ở bố cục phẳng. AC liên quan: AC-4.
- Khối 2 «DV5 (2 khoá)» — dòng dẫn: «Lần dọn nhà tự đổi chữ 2 dòng luật». Lối A (khuyên): «Miễn có tên 2 dòng, chỉ khi so
  qua lần dọn nhà» — giá: 2 dòng ấy không được canh trong đúng lần chuyển. Lối B: «Không sửa ca, B2 đổi nhánh chính của bản
  sao đo» — giá: ca xanh rỗng; PR cắt sang có thể vẫn đỏ. AC liên quan: AC-2.
- Khối 3 «KK-6 so-that (2 khoá)» — dòng dẫn: «Sổ thật trỏ đường phẳng; ở cây mới tệp đã dời». Lối A (khuyên): «Ở cây mới
  đọc sổ trong cây phẳng lịch sử» — giá: đóng băng ở ngày cắt sang; 45 dòng sổ / 32 hồ sơ chỉ ghi gửi B2. Lối B: «Sửa bộ
  xếp đọc đường phẳng cũ» — giá: chạm mã lõi, thêm một vòng. Lối C: «B2 đổi đường trong sổ đã ký» — giá: đổi byte hồ sơ đã
  ký. AC liên quan: AC-3.
- Khối 4 «KK-6, KL-8 (6 khoá)» — dòng dẫn: «Bản sao đo của B2 lấy bản trước vòng ở 909dffd8 (trước #503), mã ấy không
  thấy thư mục skill đã đổi tên». Lối A (khuyên): «Sửa hai tệp kiểm ở kho này (hai dòng)» — giá: không; vững với bản trước
  vòng ở mọi tuổi. Lối B: «Không sửa, B2 đặt nhánh chính bản sao đo = nguồn» — giá: ca vẫn đỏ nơi nào bản trước vòng còn
  là ảnh kit trước #503. AC liên quan: AC-1.
- Khối 5 «CT-10-do, KM-1 (4 khoá)» — dòng dẫn: «Phiên B2 chuyển lời chủ kho: đưa hai dòng sửa vào vòng bốn». Lối A
  (khuyên): «Nhận vào vòng» — giá: thêm hai dòng sửa, đã chạy xanh hai cây. Lối B: «Giữ 53 khoá, để vòng sau» — giá: thêm
  một vòng cho hai dòng. AC liên quan: AC-7.

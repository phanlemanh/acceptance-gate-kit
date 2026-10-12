# Câu máy hỏi ở bước thiết kế — transcript máy MacBook Pro, 23/09–11/10

Lệnh: `python3 s1_hoi.py 2026-09-22T00:00 > cap.jsonl` (tệp cạnh bên). Đoạn thiết kế của một phiên: mở khi
phiên gọi skill vòng hoặc brainstorming, đóng ở thẻ Cổng Phạm vi / lệnh `approve` / hợp đồng sang
`approved`, nghỉ quá 6 giờ; chỉ tính khi trong đoạn phiên TẠO MỚI một `_acceptance/<slug>/contract.md`
hoặc gọi brainstorming. Bộ rút ra 43 cặp «lượt máy dừng → tin người» ở 47 vòng có bước thiết kế
(36 crm · 11 kit; ba phiên rẽ nhánh cùng một cuộc trò chuyện tính một). Máy đọc từng cặp và gán nhãn.

**Giới hạn đã khai:** transcript chỉ có ở máy chạy phiên. crm ký **192** vòng từ 22/09; máy này
thấy khoảng 36, phần còn lại chạy ở Mac mini — bảng sổ S1 (`so-s1-crm.md`) phủ cả hai máy nhưng chỉ
thấy câu đã thành dòng sổ, không thấy câu «duyệt thiết kế?» trả lời một chữ.

## Trong vòng — giữa mở vòng và Cổng Phạm vi (5 câu · 6 chạm · 5 vòng)

| Vòng | Ngày | Máy hỏi | Người trả lời | Nguồn căn cứ | Theo khuyến nghị? |
|---|---|---|---|---|---|
| crm `don-okr-nhap-sai` | 06/10 | duyệt thiết kế với năm điểm chọn sẵn? | «Đã gồm cụm Tài liệu chưa?» rồi «Duyệt» | mục tiêu + quy tắc | có |
| crm `ux-lai-thu-8c-okr` | 30/09 | duyệt thiết kế với bốn lựa chọn máy khuyên? | «duyệt, theo bốn lựa chọn máy khuyên» | mục tiêu + quy tắc | có |
| crm `sua-an-chu-ky-okr` | 30/09 | duyệt thiết kế: cách A + luật chu kỳ có dữ liệu vẫn sửa được tên? | «duyệt thiết kế cách A» | mục tiêu + quy tắc | có |
| crm `tro-ly-okr-bo-final-output` | 06/10 | duyệt thiết kế này chứ? | «Duyệt» | mục tiêu + quy tắc | có |
| crm `tac-nhan-model-rieng` | 27/09 | Gemini 3.8 Flash cho cả bộ dựng lẫn bộ chạy — duyệt không? | bác: thiết kế không được dành riêng một model, tối ưu cho cả hệ | **chỉ người có** (chính sách nhà cung cấp) | **không** |

## Phiên brainstorm trước khi mở vòng (13 câu · 3 phiên)

| Phiên | Máy hỏi | Người trả lời | Nguồn căn cứ | Theo khuyến nghị? |
|---|---|---|---|---|
| kit 02/10 lộ trình vào kit | kit tuyệt đối không ghi vào tệp lộ trình, hay cho máy ghi PR + ngày? | hỏi lại, mở hướng mới | chỉ người có | — (chưa trả lời) |
| kit 02/10 | ghi hạt giống hai lát, ổ cắm đọc trước? | «Đồng ý» + xin sơ đồ | mục tiêu + quy tắc | có |
| kit 02/10 | làm lượt sau hay gom luôn? | «Gom luôn» | một lối ra sống | có |
| kit 02/10 | bổ sung sáu điểm rà soát vào hạt giống? | «Đồng ý như khuyến nghị» | mục tiêu + quy tắc | có |
| crm 24/09 `cau-truc-to-chuc` | bỏ dòng thời gian, chuyển sang sửa ô số tiền? | đồng ý, nhưng đổi sang dựng bản mẫu bằng block Pro | chỉ người có | không |
| crm 24/09 | thêm trạng thái «Sơ đồ tổ chức» vào bản mẫu ngay chứ? | «đồng ý» | một lối ra sống | có |
| crm 24/09 | soạn ngưỡng đề xuất vào hồ sơ nhé? | thêm dữ kiện: OKR cũng có nhóm việc cấu trúc tổ chức | chỉ người có | không |
| crm 24/09 | mở vòng làm lượt 1 ngay chứ? | «đồng ý, mở ngay» | một lối ra sống | có |
| crm 30/09 trợ lý OKR lượt đầu | anh đưa gì cho Claude bên ngoài, Claude hay hỏi lại gì? (2 chạm) | gửi tài liệu + kể ngữ cảnh model cần | chỉ người có (sự kiện) | — |
| crm 30/09 | duyệt khung sáu lớp, hay sửa? | thêm mô tả đơn vị và chức danh | chỉ người có (ý định) | không |
| crm 30/09 | duyệt, hay còn chỗ sửa? | thiếu tạo bộ OKR nháp qua đối thoại | chỉ người có (ý định) | không |
| crm 30/09 | còn gì lệch với điều anh hình dung? | xem màn deal và Mục tiêu, nhiều điểm giống | chỉ người có (ý định) | không |
| crm 30/09 | mở hạng mục riêng cho đồng nhất giao diện, hay gộp? | «Đồng ý mở chip hạng mục riêng» | mục tiêu + quy tắc | có |

## Đếm

| Nguồn căn cứ | Câu | Theo khuyến nghị |
|---|---|---|
| mục tiêu + quy tắc đã khai | 7 | 7/7 |
| chỉ một lối ra sống | 3 | 3/3 |
| chỉ người có | 8 | 0/8 — người trả lời bằng điều máy không có (ý định mới, sự kiện, chính sách) |

Loại khỏi bảng (25 cặp): lượt chấm và dừng-vá (S4: «có», «Thu», «chạy round 3», «mở vòng 4», «chạy S4»),
người tự khởi (gộp PR, hỏi tiến độ, giao việc mới, rà UX), hạ tầng («Try again»), và cổng trong thiết kế
(«Ký Cổng Đáng», dòng ký Cổng Đáng của `cau-truc-to-chuc`).

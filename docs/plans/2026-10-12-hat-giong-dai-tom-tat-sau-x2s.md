# Hạt giống — ba việc của dải tóm tắt hồ sơ sau vòng dai-tom-tat-doc-dung

Gốc: `_acceptance/dai-tom-tat-doc-dung/` (Cổng Bằng chứng 12/10/2026 — Ngoài-8 và Ngoài-9 trong
`review-findings.md`, owner: mở hợp đồng mới) và crm `_acceptance/trang-lo-trinh-trong-crm/` (vòng LT1b của crm
đề nghị trường mới cho khối dữ liệu, 12/10). Hạt giống là SỔ, không phải ô: chỉ mở thành ô khi có neo ngoài
(ngưỡng ở cuối mỗi mục).

## 1. Khối giới hạn có đoạn dẫn trước danh sách, hoặc chỉ ghi «None.» (Ngoài-8)

Bộ đọc giới hạn ở `## Notes` (dạng đầu đoạn) dừng ở dòng chữ đầu tiên không phải gạch: khối «Known limits — …»
mà dòng kế là một đoạn dẫn rồi mới tới danh sách thì đếm đoạn dẫn thành 1 giới hạn và bỏ sót danh sách thật;
khối chỉ ghi «None.» (có dấu chấm, chữ hoa) bị đếm 1. Hướng: sau đầu đoạn cho phép MỘT đoạn dẫn trước gạch đầu
tiên; lọc «none/không có» chấp nhận dấu câu và hoa thường. Ca hai chiều trên ma trận DT-3.

Ngưỡng mở ô: một hồ sơ thật ở bất kỳ kho nào có dải đếm lệch số giới hạn người đã chọn vì hình dạng này.

## 2. Trang bằng chứng mất phần «Vì sao làm» đầy đủ (Ngoài-9)

Trần 400 ký tự của ô `vi_sao` (đúng cho dải và khối) cũng áp lên mục gập «Vì sao làm» của trang bằng chứng, vì
hai bộ vẽ dùng chung một giá trị. Trước vòng, mục gập hiện trọn đoạn. Hướng: `tomTatHoSo` giữ đoạn đầy đủ trong
`chiTiet` (không đổi khuôn khối), trang bằng chứng in bản đầy đủ ở mục gập, dải vẫn in bản có trần.

Ngưỡng mở ô: người đọc trang bằng chứng báo thiếu lý do, hoặc mốc phát hành kế của kit — cái nào tới trước.

## 3. Tầng chủ kho thêm danh sách tiêu chí kèm kết cục và danh sách câu giới hạn (đề nghị của LT1b, crm)

Chủ kho crm chốt 12/10 «giữ hợp đồng LT1b, gửi đề nghị cho bộ kit»: ngăn hồ sơ trong CRM muốn thấy (a) từng tiêu
chí kèm kết cục `đạt | chưa đạt | chưa chấm` lấy từ báo cáo đã ký, (b) câu từng giới hạn đã biết — hôm nay khối
chỉ có số `tieu_chi` và con số trong ô `chua_lam`. Đọc thẳng `evidence-page.html` là nguồn sự thật thứ hai (đã
khuyên không). Danh sách giới hạn đã có sẵn trong `chiTiet.known` sau vòng dai-tom-tat-doc-dung; việc còn lại là
đưa hai danh sách vào tầng `chu_kho` — ĐỔI KHUÔN khối (thêm khoá, `docDuLieu` khoan dung đọc bản cũ), tức CỘNG ở
mọi kho đọc khối, cần owner phê ở Cổng Đáng.

Ngưỡng mở ô: crm mở vòng thêm ngăn chủ kho và cần hai trường này (chủ kho chọn ở Cổng Đáng của hàng đó).

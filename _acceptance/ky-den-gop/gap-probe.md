---
slug: ky-den-gop
at: 2026-10-23T10:30:00Z
verdict: findings
p0: 1
p1: 4
p2: 0
---
## Findings
| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | contract | Dòng sổ d-5 ghi một-lối nhưng bỏ sót lối sống thứ ba: khi gh lỗi thì so bằng bản chụp nhanh_mo đời trước | gh hết phiên nhiều giờ, bản chụp còn PR ngoài đợt sửa phiếu, lịch giao X trùng tệp, một sự kiện trung-tep-mu rồi im, sau gộp phải ghim lại | Dòng sổ mới supersedes d-5; AC-4 thêm hàng bản chụp cũ giữ X kèm tuổi, đối chứng không bản chụp | fixed: bộ phát lịch so bằng bản chụp đời trước kèm tuổi khi gh lỗi hẳn, không ghi đè bản chụp tốt (C-11, nhát tiêm «gh lỗi thì giao mù»); dòng sổ d-11 supersedes d-5; AC-4 thêm hàng |
| P1 | design | H bật mặc định ở mọi kho; lời hứa PR sẵn sàng không gộp được trước chữ ký không có ca đo | Kho chưa đặt lưới trước-gộp làm check bắt buộc: người hay bộ gộp của kho gộp PR trước chữ ký Cổng 2 | Dòng sổ cho mặc định của H; AC-8 thêm hàng theo check bắt buộc | rejected: H là bước máy mặc định theo phạm vi chủ kho chốt (dòng gate1 d-1); lối gộp của máy (gop) đòi hồ sơ đã thông trên đầu nhánh (I-3); bấm gộp tay là việc khó-đảo của người; khai thành giới hạn trong Notes của hợp đồng |
| P1 | design | (a) Lưới CI nhánh chính chỉ là lời dặn, xetGop không đọc CI đỉnh nhánh chính; (b) --no-renames không có ca và nhát tiêm | (a) PR A gộp nhanh làm nhánh chính đỏ, B và C vẫn gộp nhanh chồng lên; (b) nhánh chính đổi tên tệp PR sửa, PR ra khong-trung | AC-6 thêm hàng CI nhánh chính đỏ và hàng đổi tên; AC-10 thêm nhát bỏ --no-renames | fixed: xetGop đọc gh run list của đỉnh nhánh chính, đỏ hay không đọc được → cu (I-6); ca đổi tên trên kho git thật (I-7); hai nhát tiêm mới |
| P1 | contract | Lời hứa không dựng vòng chờ nhau không có ca; không nói khi nào sau được gỡ | Hai hàng kế cùng nhịp mang sau của nhau, hai dãy cùng chờ, đợt đứng; hoặc hàng kia bị gỡ khỏi đợt | AC-1 thêm hàng hai hàng kế cùng nhịp và hàng bị gỡ; nhát bỏ chặn ghi ngược | fixed: C-12 (hai hàng kế cùng nhịp → đúng một sau; themSau không ghi ngược) + nhát tiêm «sau dựng vòng chờ nhau». Vế hàng bị gỡ: rejected — đợt không có lệnh gỡ hàng; khai giới hạn trong Notes |
| P1 | design | Giờ gộp = commit đầu chạm hợp đồng trên cha-đầu sai khi hồ sơ đã lên nhánh chính từ trước giờ ký | Ô gộp sớm ở discovery, gop_luc sớm hơn ky_luc, ky_den_gop âm, chủ kho đọc sai kết quả gói | Ca DG mới hồ sơ có trước giờ ký; nhát tiêm định nghĩa cũ | fixed: giờ gộp = commit cha-đầu đầu tiên có commit ký là tổ tiên (rev-list --first-parent --ancestry-path); DG-4 + nhát tiêm «giờ gộp = commit đầu chạm hồ sơ» |

---
slug: lenh-cho-khoa-nhay-duong-dan
at: 2026-11-10T07:05:02Z
verdict: findings
p0: 2
p1: 3
p2: 0
---

# Gap probe: lenh-cho-khoa-nhay-duong-dan

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | contract, evals | AC-6 đòi nhayDon một định nghĩa trong khi design giữ bản riêng của phan-loai-s4; bảng lenhBoc không ghim nguồn | Code đúng design thì KN-6 đỏ giả, hoặc bảng so với chính nó | nhayDoiSo một nơi, nhayDon đúng tập hai nơi, bảng chụp trước khi dời | fixed: AC-6 viết lại theo hai tập; ca KN-6-bang xanh cả ở commit ca nên bảng không chép từ code sau khi dời |
| P0 | design | Dòng descope gộp ba vế với một lối chết; tên dãy là cược độ hiếm; không thêm trần không có dòng sổ | Tên dãy có nháy treo im lặng đúng như lỗi đang sửa, sổ ghi máy đã chốt một lối | Tách vế, nêu ràng buộc kiểm được | fixed: tên dãy đưa vào phạm vi (AC-7); bốn dòng S1 mới supersedes dòng cũ, mỗi dòng một vế |
| P1 | design, evals | Tệp mới tự theo đợt nhưng không AC nào đo | Đợt thật thiếu loi/nhay.mjs thì lich và hook chết | KN-4 dựng bằng bước chép thật, gọi CLI từ bản lõi | fixed: KN-4 dùng chepLoi thật; KN-4-do xoá tệp thì CLI hỏng, ghim tên module |
| P1 | evals | Chiều đỏ E3 một thông điệp cho chín ký tự có kết cục khác nhau; E5 chỉ một thư mục | Ca không bao giờ đỏ mà vẫn được tính; bộ lọc lỡ bọc ký tự an toàn vẫn xanh | Bảng đỏ khai trước từng hàng; ma trận đủ lớp an toàn | fixed: KN-3-do chín hàng khai trước kết cục, tệp canh xét trước; KN-5 bảng 12 lớp |
| P1 | contract, evals | Còn sống không chứng minh đã qua vòng kiểm; trần không số; đỏ chỉ là lời | Bản bỏ vị từ vẫn sống lúc mới chạy nên KN-2 xanh giả | sleep giả đếm vòng; trần bằng số; ca đỏ sống; SHA | fixed: sleep giả đếm vòng (AC-1 = 0, còn chờ ≥ 2), trần 15 giây ghi trong contract; KN-2/3/5/6/7-do là ca đỏ sống; SHA ca và vật ghi sổ lúc S3 thay vì evidence_required, vì khoá này là danh sách cố định của kit |

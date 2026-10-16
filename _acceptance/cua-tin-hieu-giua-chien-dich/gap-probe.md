---
slug: cua-tin-hieu-giua-chien-dich
at: 2026-10-15T07:51:04Z
verdict: findings
p0: 1
p1: 3
p2: 1
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | design | Dòng sổ chặn-khai-tường-minh ghi một-lối nhưng lối opt-out (mặc định chặn, thợ khai --khong-chan) còn sống; chọn chiều mặc định là khẩu vị rủi ro chỉ chủ kho có; cost_if_wrong nói «không mất ý» là sai vì câu trả không bảo thợ gửi lại | Thợ thiếu phụ thuộc gửi viec-phu không --chan, nhận «đã ghi», đứng chờ tới mốc khép; E1–E10 xanh, ngưỡng không đếm | Dòng sổ supersedes nguồn chi-nguoi với hai lối và giá | fixed: dòng sổ mới supersedes d-20261015T074550Z-3 thành câu hỏi Cổng Phạm vi (khuyến opt-in --chan); câu trả cho thợ nêu lối gửi lại kèm --chan (AC-1); Notes khai ngưỡng không đếm ca này kèm ngưỡng mở lại |
| P1 | design | Bước gộp trùng 24 giờ mở cho hang-moi đứng TRƯỚC bước kho-không-cửa nên kho không cửa đổi hành vi với hang-moi trùng | Kho không khai tin_hieu, hai hang-moi cùng tiêu đề: bản mới gop, bản gốc can_phan; CT-4 không có cặp trùng nên vẫn xanh | CT-4 thêm cặp hang-moi trùng, so byte với gốc, đỏ khi gộp trước | fixed: design §3.2 đặt kho-không-cửa lên bước 1; AC-4 thêm cặp trùng và chiều đỏ CT-4-do2 |
| P1 | contract | Đường đo định nghĩa N = số dòng ghi, lệch ngưỡng đã ký (N = mọi ý không chặn); không ca nào chạy câu jq; vế người không có đường đo | Đợt không goc_kho, mọi ý rơi về can_phan, N ghi = 0 đọc «chưa đọc được» trong khi ngưỡng đã ký đọc CHẾT | Sửa N; một ca chạy nguyên văn câu jq trên sổ sinh trong lượt (SỐNG và CHẾT) | fixed: Đường đo N = mọi yêu cầu chan != true, câu jq một dòng; AC-1 thêm CT-1-duong chạy câu rút từ contract trên CT-1 (SỐNG) và đợt không cửa CT-4 (CHẾT); vế người khai đọc tay |
| P1 | design | Không có nhánh cho tệp id đã có KHÁC thân; ghi nguyên tử bằng đổi tên sẽ đè; lệnh người tính n kế tiếp có thể trùng | Hai lần gửi đồng thời ra cùng số, lần sau đè ý trước; tệp chưa theo dõi nên mất hẳn | AC-3 ca tệp khác thân còn nguyên, chiều đỏ ghi đè; AC-7 ca số trùng | fixed: design §3.3 tạo độc quyền bằng link, khác thân → can_phan có tên, lệnh người tăng n; AC-3 thêm CT-3-khac-than + CT-3-do3, AC-7 thêm CT-7-so-trung |
| P2 | evals | Vế viec-cho không nêu hai id của CT-1 là assertion âm một mình | viec-cho đọc sai thư mục đợt, luôn rỗng, vế âm vẫn xanh | CT-2 thêm vế dương viec-cho liệt đúng hai id can_phan, chạy trước | fixed: AC-2/E2 thêm vế dương viec-cho liệt đúng hai id; AC-1/E1 ghi vế âm chạy SAU vế dương trên cùng đợt |

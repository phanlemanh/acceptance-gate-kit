---
slug: lo-trinh-du-lieu-ngay-du-kien
at: 2026-10-16T03:09:00Z
verdict: findings
p0: 0
p1: 4
p2: 1
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | contract | Một gốc so 31c5b8df gánh hai vai: bộ đọc gốc (bản chép crm, ghim băm) và bộ máy vẽ trang làm nền so «trang giữ» / «chỉ thêm» | RM3/RM5/RM6b gộp main trước S4 làm trang mới khác trang 31c5b8df vì vật vòng khác → ND-1-trang-giu và ND-7 đỏ do hạ tầng, đốt lượt chấm | Tách hai vai: bộ đọc gốc rút từ gốc so có băm; bộ máy nền = merge-base trong lượt, trọn thư mục | fixed: Context hợp đồng tách hai vai; bộ máy nền = merge-base HEAD với origin/main hoặc main, trùng HEAD thì nói rõ; AC-6 thêm trang đời trước do code sinh (xoá bốn khoá) |
| P1 | evals | Không vế nào chạy lưới độ dài trang trên trang thật sau khi khối phình | Ca lề độ dài của suite đỏ trên CI dù E1–E8 xanh | Chạy ca lề độ dài trên trang thật của kit vẽ bằng bộ máy mới | rejected: lưới độ dài (LTT-san) đo chiều cao hiển thị px của trang; khối dữ liệu là thẻ script không hiện, và ND-1-trang-giu giữ phần ngoài khối từng byte — chiều cao không đổi được |
| P1 | contract | Phép so khối == trang chỉ chạy vài ô nêu tên; thiếu co, thiếu mốc lai (hồ sơ mở sớm nhất không có du-bao.json) | Khối đọc hồ sơ mở sớm nhất còn trang lấy dự báo sớm nhất có mặt → mốc lai trang có ngày, khối null; ND-4 vẫn xanh | Ma trận toàn phần mọi hàng mọi mốc mọi kho, null khi và chỉ khi trang không in; thêm mốc lai và chiều đỏ | fixed: AC-1 thêm dãy co viết sẵn + ma trận toàn phần đếm ô; AC-4 thêm mốc lai R + chiều đỏ «ngày dự kiến khối lệch trang: R» |
| P1 | contract | Giá của lựa chọn đóng băng khai thiếu: không đếm số mốc đang chạy của crm có du-bao.json | crm nhận kit mà mọi mốc đang chạy mở việc đầu trước RM6 → du_kien null khắp nơi, ngưỡng đọc ra CHẾT dù vật đúng | Đếm k/N trên crm onehub, ghi số trước, sửa giá dòng sổ | fixed: đo crm 8decc2f36 — 7 mốc đang chạy, 0/7 có dự báo, 5/7 có ngày ngay lần mở việc kế, 2/7 không bao giờ; ghi ô cơ hội + Đường đo + Out of scope; dòng sổ mới supersedes d-20261016T030307Z-2 |
| P2 | evals | Chiều đỏ của E8 ghim chữ yếu hơn AC; văn bản nói «ba khoá mới» trong khi có bốn | Nhát tiêm hỏng vì lý do khác vẫn khớp «du_kien»; người chấm bỏ sót qua_tai khỏi phép trừ ND-7 | Ghim nguyên văn câu AC và đòi các cấp khác khớp; sửa thành bốn khoá có tên | fixed: E8 và AC-8 ghim nguyên văn + lệch duy nhất; AC-7, E7, design đổi thành bốn khoá có tên |

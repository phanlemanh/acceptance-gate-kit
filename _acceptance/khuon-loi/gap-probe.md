---
slug: khuon-loi
at: 2026-11-01T16:12:00Z
verdict: findings
p0: 2
p1: 3
p2: 0
---

# Phản biện ngữ cảnh sạch — khuon-loi

Tác tử tươi, chỉ đọc design doc, hợp đồng, evals, sổ quyết định, ô cơ hội và bản quét bài học (input thứ 5, 10 dòng).

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | decisions | Dòng «khuôn không chặn làn V» ghi một-lối nhưng chỉ nêu giá của lối kia; lối giữa (báo khi hồ sơ chạm vùng nhóm mà thiếu eval khuôn) còn sống; đánh đổi lệch lọt và chi phí là khẩu vị rủi ro [quet-het-han-khong-moi-ky#F1] | Vòng giao diện ở kho nhận đi làn V, tác tử S1 không chép khối eval khuôn; bước chấm không chạy, gộp với 3 lệch mới, thẻ không ai đọc | Dòng sổ chỉ-người kèm ca KL: hồ sơ chạm vùng, không eval khuôn, ghim đầu ra; đối chứng dương | human-gate1: dòng S1 mới supersedes d-12 thành Hỏi-4 (khuyến nghị s4-args dừng); thêm AC-11 + E11 (KL-11, 4 hàng + KL-11-do) và design §6 |
| P0 | decisions | Dòng «nợ cũ đếm theo cặp» ghi mục-tiêu mà căn cứ không có câu quyết [ten-may-mot-luat#F2]; điểm mù cùng khối tăng số lần trong tệp nợ cũ không khai | Tệp đã có nợ (tệp, Hop), vòng mới dán thêm ba chỗ Hop; bước chấm in nợ cũ, thẻ 0 lệch mới | Câu trích quyết hoặc đổi lối; ca giữ hành vi tăng số lần | fixed: dòng S1 mới supersedes d-7 — đếm theo cặp CỘNG số lần (một-lối); AC-5/E5 thêm đối chứng «tăng 1 → 2»; design §4 và §7 (dời trong tệp cùng số lần là sót đã khai) |
| P1 | design | Sổ lệch lọt ở design/patterns/lech-lot.md bị đọc như một nhóm; N đếm dòng thô; ngưỡng CHẾT «sửa tay danh sách» không có đường đo | Kho tạo lech-lot.md, bộ đọc báo sai lược đồ, mọi vòng giao diện REJECT oan; «dưới 2 lệch lọt» đọc sai | Ca KL: ba nhóm cộng lech-lot.md, --kiem 0 sai, --dem vẫn 3 nhóm; đếm dòng mục theo khuôn; nguồn đếm sửa tay | fixed: lech-lot.md và README.md là tên dành riêng (AC-1/E1, AC-7/E7 chạy lại --kiem, --dem); N = dòng mục theo khuôn sổ; mục Đường đo thêm nguồn git log cho sửa tay |
| P1 | evals | E9 so chuỗi giữa hai marker tài liệu cho bảng EVAL-THIET-KE — không bên đọc nào; đo chỉ dẫn thay vì đầu ra | Bảng khớp GUIDE, E9 xanh, lưới tier-mismatch vẫn gắn thiếu eval thiết kế như #461 | Ca chạy chính lưới, hoặc bỏ lời hứa #461 | fixed: gỡ bảng và vế ấy khỏi AC-9/E9; bên đọc thật là lưới khuôn ở s4-args (AC-11); design §6 và Notes khai #461 còn mở |
| P1 | evals | E7 chỉ thử nhánh xoá tệp và nhánh đã ký; thiếu den khác verified_commit và chiều im khi không chạm vùng | Lượt 2 quên --write, thẻ in số lượt 1 không cờ; hoặc cờ cho mọi hồ sơ của kho có bản đồ | Hai hàng KL-7 + mutant bỏ so den | fixed: AC-7/E7 thêm hàng den lệch → cờ, hồ sơ chỉ chạm docs/ → không cờ, KL-7-do2 bỏ so den |

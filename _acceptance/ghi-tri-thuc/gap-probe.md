---
slug: ghi-tri-thuc
at: 2026-10-24T09:18:00Z
verdict: findings
p0: 2
p1: 2
p2: 1
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | design | Dòng sổ d-3 ghi một-lối, kho_dao false, mà lối «ghi kèm cảnh báo khi gh không hỏi được» dẫn tới lộ khó đảo ở lần đẩy sau — khẩu vị rủi ro của người [ky-den-gop#F1] | Kho riêng lỡ công khai, máy chưa đăng nhập gh: lệnh cảnh báo rồi commit raw, lint TT1 nhắc đẩy, phiên đẩy, nguồn thô lên kho công khai | Dòng sổ mới supersedes d-3, kho_dao true, thành câu hỏi trên thẻ; lối được chọn có hàng riêng ở AC-8 | human-gate1: Hỏi-1 (d-11), máy khuyên chặn; AC-8 hàng (a)3 viết theo khuyến nghị |
| P0 | contract | Kho công khai chỉ nhận ra qua lời khai cong_khai; origin kho tiêu thụ không được hỏi gh; đường đo của ngưỡng mù đúng ca quên khai | Kho công khai trên GitHub chỉ khai noi: lệnh ghi commit raw vào kho tiêu thụ, lint TT1 xanh, số đo 14 ngày đọc SỐNG | Hàng kho tiêu thụ không khai cong_khai, origin GitHub, gh PUBLIC → thoát 4; PRIVATE → 0 | fixed: thiết kế hỏi gh cho nơi giữ raw bất kể lời khai (d-12); AC-8 hàng (c); Đường đo thêm vế gh |
| P1 | evals | AC-8 chỉ thử remote https khai ở kho.remote; không thử SSH, không thử nhánh dự phòng origin | Kho riêng clone bằng SSH, kho đang PUBLIC: bộ tách coi là remote khác, cảnh báo rồi ghi; GT-8 vẫn xanh | Ma trận năm dạng remote, gh PUBLIC → cả năm thoát 4; mutant bộ tách chỉ nhận https | fixed: AC-8 hàng (b) năm dạng + mutant GT-8-mutant-ssh |
| P1 | contract | Dùng lại raw y hệt không phân biệt raw đã commit với raw chưa theo dõi; không ca nào dùng lại raw mà trang đổi | Phiên chết trước commit hay chạy --khong-commit: lần chạy lại in «dùng lại raw», thoát 0, không commit — tri thức nằm ngoài git | Hàng nối: --khong-commit rồi chạy lại → HEAD tiến; dùng lại raw kèm --than khác → trang vào commit; mutant bỏ kiểm theo dõi | fixed: thiết kế commit khi raw chưa theo dõi hay trang đổi; AC-3 hai hàng nối + mutant |
| P2 | evals | Lời hứa «mã khác 0 không đổi tệp nào» chỉ chụp ảnh cây ở một số AC; không ca commit hỏng sau khi tệp đã ghi | Bên ghi chép raw rồi mới kiểm --trang, thoát 2 mà để lại thư mục raw; hook pre-commit đỏ để tệp trên đĩa | Ảnh cây hai kho ở mọi hàng thoát khác 0; hàng hook pre-commit thoát 1 | fixed: thiết kế kiểm hết trước khi ghi và hoàn lại khi commit hỏng; AC-5 hàng hook + ảnh cây mọi hàng đỏ, mutant gỡ hoàn lại |

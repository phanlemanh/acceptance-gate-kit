---
slug: loi-moi-tran-luot-loi-song-co-gia
at: 2026-10-02T22:30:00Z
verdict: findings
p0: 0
p1: 3
p2: 2
claims_input: ok
---

# Phản biện context sạch — S1

Tác tử tươi đọc đúng 5 tệp (design · contract · evals · sổ quyết định · claims). Năm finding, định đoạt một lượt, không re-probe.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | evals | Lớp «eval chưa đạt ở một lượt» có ≥6 hình (cannot_run · killed_by_tool · mã khác 0 · mã đúng expected_exit là ĐẠT · dòng cuối thắng · SUITE-*/id lạ loại) mà E1 chỉ tiêm hai hình, không hàng đặc hiệu | Cài đặt quên vế expected_exit: eval khai mã 1 thoát 1 hai lượt bị đếm lặp → khuyên đưa một AC đúng ra Known limits; SUITE-* lọt vào lap với AC rỗng | LT-AC1-lap thành ma trận ≥6 hàng, hai hàng đặc hiệu kỳ vọng lap rỗng; mutant bỏ vế expected_exit và bỏ bộ lọc id | fixed: AC-1 ma trận 9 hàng (design §4.1, E1), thêm đột biến bo-expected-exit · bo-loc-id |
| P1 | evals | AC-5 ghi đè giờ tay «trước 7 phút», hai tên trường (invokedAt · ts) không rõ bên viết ghi gì | Nếu round-tally ghi lúc kết lượt thì hiệu ≈ 0 và thẻ in «1 phút» cho lượt 48 phút — số sai tự tin hơn «chưa đo»; hoặc mô-đun đọc trường fixture ghi mà bên viết thật không ghi | Rút tên trường từ dòng bên viết thật ghi; khai mốc «đầu lượt» trong design | fixed: design §4.1 khai ts của round-tally = invokedAt của args (mốc sinh args, cùng nghĩa luot_ts của nhan-canh-gay); E5 khẳng định tên trường (hằng xuất TRUONG_GIO) và ts tally = invokedAt truyền vào trước khi đo phút; invokedAt là đầu vào của bên viết thật, không ghi tay dòng sổ |
| P1 | design | Hình «lượt cuối cụt» vắng: lượt bị ngắt giữa chừng để lại eval không có dòng ở lượt cuối → không tính lặp | Đúng ca crm: E14 chưa đạt lượt 1–2, lượt 3 cụt → lap rỗng, tran true → khuyên «lượt nữa» trên chính ca vòng này sinh ra để chặn | Luật: eval chưa đạt lượt trước mà vắng dòng lượt cuối → tính lặp kèm ghi chú; hàng ma trận với sổ thật cắt giữa | fixed: design §4.1 mục «Lượt cuối cụt», AC-1 hàng 8, E1 hàng 8 |
| P2 | evals | evals.yaml không đọc được → mọi id hoá lạ → lap rỗng, im lặng (fail-open) | Kho tiêu thụ có evals.yaml thẻ không parse được: lượt 2 có lặp → không khối; lượt ≥3 → khối với lap rỗng, khuyên sai chiều, không dòng nào nói evals.yaml vắng | Hàng LT-AC9 «evals.yaml hỏng»: thẻ thoát 0 và in cờ vàng có tên; mutant nuốt lỗi parse | fixed: design §4.1 (không lọc id + cờ vàng «không đọc được evals.yaml — AC không xác định»), AC-9, E9 hàng 4, đột biến nuot-evals-hong |
| P2 | contract | Notes hứa «kho không chạm trần nhận thẻ giống từng byte» nhưng AC-6 chỉ so byte ba hàng REJECT; nhánh ký được chỉ đo chuỗi-vắng | Sửa khối VIỆC-CỦA-ANH dùng chung làm đổi khoảng trắng ở nhánh ký được → mọi thẻ PASS của mọi kho đổi mà E3, E6 vẫn xanh | Mở rộng LT-AC6-im thêm PASS và BLOCKED cạnh mù, so byte cả HTML lẫn --extract | fixed: AC-6 năm hàng, E6 so cả HTML lẫn --extract |

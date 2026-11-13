---
slug: mc11-ten-kho
at: 2026-11-13T23:10:49Z
verdict: findings
p0: 1
p1: 2
p2: 2
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | contract (sổ d-20261113T230501Z-2) | Căn cứ mục tiêu trích sổ cau-tin-hieu-nguoi-gui nói về chữ trạng thái hồ sơ, chỉ liên quan chứ không quyết lối sửa; lý do loại khoá cấu hình dựa vào sổ moc-la-chien-dich mà không trích | Cổng 1 đọc dòng như thể mục tiêu đã khai chọn lối sửa trong khi căn cứ chỉ là tiền lệ tương tự | Dòng thay thế trỏ sổ moc-la-chien-dich kèm câu trích nguyên văn | fixed: dòng mới supersedes d-20261113T230501Z-2, căn cứ trích nguyên văn moc-la-chien-dich#d-20261014T082738Z-2 (luật tên kho = thư mục checkout, không thêm khoá cấu hình); lối bỏ phép so ten_phien bị chặn bằng MCK-4 |
| P1 | evals E1 E2 và AC-2 | Không phép đo nào giữ được việc MC-11 vẫn so ten_phien hay kiểm tenKho không rỗng | Gỡ phép so ten_phien khỏi MC-11 thì E1, MCK-1, MCK-2 vẫn xanh | Tiêm biến thể trên bản sao, phải đỏ với thông điệp ghim | fixed: thêm MCK-4 (tenChienDich đổi dấu → FAIL: MC-11 — ten_phien «MC1 - …») và MCK-5 (tenKho rỗng → FAIL: MC-11 … tenKho trả rỗng); phá thử gỡ phép so ten_phien ở cây làm MCK-4 đỏ |
| P1 | evals E3 và AC-3 | E3 chỉ kiểm chữ ca bảng có mặt, lời hứa là quan hệ còn chiều đỏ; chiều đỏ trong expected chưa chạy thật | Ca bảng còn chữ nhưng không bắt lỗi định dạng thì MCK-3 vẫn xanh | Đổi dấu phân cách trên bản sao phải làm ca gach-va-ngoac đỏ; phá dòng ca bảng phải làm MCK-3 đỏ | fixed: MCK-4 đòi dòng FAIL: MC-6 gọi tên gach-va-ngoac; MCK-3 nay phá dòng ca bảng trên bản sao và đòi phép kiểm đỏ |
| P2 | evals E1 | expected ghim con số 28 ca trong khi AC-1 chỉ hứa PASS: MC-11 và 0 failed | Gộp main thêm ca làm E1 đỏ dù AC-1 đạt | Bỏ con số | fixed: E1 ghim PASS: MC-11 và ", 0 failed (moc-chien-dich)" |
| P2 | design và decisions.jsonl | Design ghi bỏ design-pass và ui-observed có sổ, sổ không có hai dòng ấy | Người ký tin hai mục đã bỏ có ghi sổ | Đối chiếu câu design với sổ | fixed: design nay ghi hai mục không áp vì hợp đồng chỉ có mặt cli |

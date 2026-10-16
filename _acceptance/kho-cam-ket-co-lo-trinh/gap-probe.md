---
slug: kho-cam-ket-co-lo-trinh
at: 2026-10-16T00:00:00Z
verdict: findings
p0: 0
p1: 4
p2: 1
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | evals E4, E6 + AC-4, AC-6 | Vế «kho không bật không đổi byte» chỉ đo Write tạo contract.md, trong khi vòng thêm opportunity.md vào tập tệp hook soi | Kho không bật ghi opportunity.md (mở ô từ hàng) bị hook đổi hành vi mà E4/E6 vẫn xanh | Thêm trục lệnh ghi (4 lệnh) vào ma trận AC-4 và phép so AC-6; chiều đỏ áp luật opportunity khi gói không bật | fixed: AC-4 thành 4×4×4 = 64 lần chạy + CK-4-do2; AC-6 chạy cả bốn lệnh ghi |
| P1 | contract Đường đo + opportunity | Thước «lần máy tự gỡ» trỏ sổ .so.jsonl mà design cấm ghi; vế tắt khoá và lượt gọi do chặn không có lệnh | Tới hạn đọc 0 dòng sổ thành «máy chưa gỡ lần nào»; kho tắt khoá đọc thành SỐNG | Mỗi dòng ngưỡng trỏ một lệnh | fixed: thước đổi sang vi_sao ở cả hai tệp; thêm lệnh git log -S cho tắt khoá; lượt gọi do chặn đếm tay, khai giới hạn |
| P1 | evals E2 | Round-trip với phanTichKho rỗng nghĩa khi tệp chỉ nằm trong lệnh Write đang chờ | Ca mã sai: bản đồ không thấy x nên suy «nối», BẰNG đỏ trên vật đúng | Ghi tệp chờ vào bản sao rồi mới phanTichKho; đối chứng x có mặt ở 6/6 ca | fixed: E2 và AC-2 viết lại theo thước đề xuất |
| P1 | design §2 + sổ dòng 8 | Căn cứ «khoá sai giá trị thì chặn» trích câu chỉ liên quan; --them-hang với khoá lạ chưa định nghĩa | Kho ghi chan: yes bị chặn mọi hồ sơ; S0 dừng với mã không ghim | Dòng sổ mới nêu lối khoan dung chết vì sao; ca khoá lạ cho --them-hang | fixed: dòng sổ thay (supersedes, mot-loi); AC-8 thêm ca khoá "co" |
| P2 | design §5 + sổ dòng 7 + AC-7 | Slug đồng thời là mã hàng — resume bằng slug có thể rẽ sang mở ô cơ hội | Mở lại bằng slug tạo opportunity.md, đẩy sang Cổng Đáng | Bước resume trong AC-7 | fixed: AC-7 thêm bước S0-MO-O trả moi false, không ô cơ hội; dòng sổ thay ghi giá cửa sổ trước-hợp-đồng |

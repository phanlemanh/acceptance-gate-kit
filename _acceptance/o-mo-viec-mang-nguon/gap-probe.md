---
slug: o-mo-viec-mang-nguon
at: 2026-10-24T09:35:00Z
verdict: findings
p0: 0
p1: 4
p2: 1
claims_input: ok
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | design, contract | Kho riêng vắng làm mọi mục nguồn thành cảnh báo, gộp cả hai vế hình dạng không cần kho | Máy không có kho riêng cho liên kết hay chữ tự do qua răng phủ với một dòng cảnh báo | Ma trận trên kho riêng vắng: liên kết, chữ tự do phải thoát 1 với [nguon-khong-phai-trang] | fixed: thiết kế D1 chỉ hạ vế băm và vế git; AC-6 thêm liên kết và chữ tự do trên kho riêng vắng |
| P1 | evals, contract | Hàng lộ trình mang dot/phu là fixture tự dựng theo bên đọc | Khoá đợt trôi ở phía lượt cắt, ON-1 vẫn xanh mà ô thật không có dòng Nguồn | Round-trip với bên ghi thật | fixed một phần: khoá đợt và mã rút từ hàng TT3 thật của lộ trình kit, bảng phủ của răng phủ đặt hai mã ở chính hàng mở ô (AC-5); hàng do phiên cắt viết, không có bên ghi máy — khai ở Known limits |
| P1 | evals | E7 không chứng lệnh mở ô thật gọi bên ghi rút tiền tố từ khuôn | lo-trinh.mjs viết cứng chuỗi Nguồn, E1 và E7 vẫn xanh | Chạy chính --mo-o trên bản sao có khuôn tiêm | fixed: AC-7 và E7 ghi rõ chạy lệnh mở ô thật trên bản sao bộ máy có khuôn tiêm |
| P1 | design, contract | Lời hứa nạp lười mô-đun tri thức trong lo-trinh.mjs không ai đo | Import tĩnh làm bộ vẽ ở kho chép thiếu tệp vỡ lúc nạp | Bản sao bộ máy xoá ba tệp tri thức, mutant import tĩnh | fixed: AC-3 thêm vế bản sao đã xoá ba tệp và mutant import tĩnh, câu ghim «bên đọc cũ nạp mô-đun tri thức» |
| P2 | design, contract | Khối tri_thuc lỗi ở răng phủ không đo; bản phạm vi cũ ở kho vừa khai không có đường đọc-cũ | Răng phủ ném lỗi hay im khi khối lỗi; lượt cắt cũ đỏ khi chạy lại | Hàng khối lỗi trong AC-5; ca hoặc giới hạn cho bản cũ | fixed (a): AC-5 thêm hàng khối lỗi; deferred (b): Known limits kèm ngưỡng ≥ 1 lần phiên cắt phải sửa nguon cũ chỉ để răng phủ xanh |

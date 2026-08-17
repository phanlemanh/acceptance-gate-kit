---
slug: hinh-tai-cong-1
at: 2026-08-17T04:20:00Z
verdict: findings
p0: 0
p1: 2
p2: 2
---

# Phản biện context sạch — hinh-tai-cong-1

Critic tươi (Agent, model phiên) đọc đúng 4 artifact + input thứ 5 (claim-scan,
advisory). One-pass, không re-probe.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | evals E2–E7 + contract AC-2..7 | «Khối về hình» không có ranh giới máy-đọc; needle quét cả mục GATE 1 (vốn đã có T3/T2/xanh-sạch) | Người thi công quên câu điều kiện trong khối mới, P197 grep cả mục → E4 vẫn xanh; đột biến viết sau để khớp check | AC-2 khai heading con cố định; P197 rút KHỐI từ heading đó tới heading kế; needle + đột biến chỉ áp trong khối; đối chứng chép-needle-ra-ngoài-khối không cứu được | **fixed:** AC-1..7 neo vào khối `### Hình tại điểm quyết định`; E1–E7 viết lại theo khối; AC-4/E4 ghim `xanh-sạch` + `bỏ qua` cùng câu; AC-8/E8 thêm đối chứng chép-ra-ngoài-khối |
| P1 | evals E6, E2 | Needle tự thoả bởi vật khác cùng thay đổi: clause đã chứa «phép thử nhìn-thấy-hình»/«cách vẽ» nên E6 không đo bước Read PNG; E2 đếm thứ tự bị clause kéo lệch | Bước nhìn viết thành «kiểm bằng phép thử nhìn-thấy-hình» không Read gì → E6 xanh, máy đính hình chưa từng mở | E6 needle riêng «vòng chính»+«Read»+«.png» cùng câu; E2 cắt dòng clause trước khi đếm, nhãn `[1] Kê`…`[5] Đính` case-sensitive | **fixed:** AC-2/E2 nhãn số; AC-6/E6 câu Read .png, cắt clause trước khi đếm |
| P2 | contract AC-1 + evals E1 | «Khớp từng ký tự» không nói chuẩn hoá wrap — cùng lớp [cat-khoi-viec-cua-anh-tren-tin#F1] | Chép đúng nhưng wrap khác → đối chứng dương đỏ trên vật đúng; hoặc hạ xuống so N từ đầu → đột biến diễn đạt lại nửa sau vẫn xanh | Gộp khoảng trắng hai bên rồi so nguyên văn; đột biến đổi một từ → đỏ | **fixed:** AC-1/E1 gộp khoảng trắng + đột biến đổi-một-từ |
| P2 | evals E3, E5, E6 | Ma trận needle→đột biến chưa toàn phần; needle ngắn phổ thông («lệch», «T3», «figures/») không phân biệt nguồn | Bỏ nguồn «lệch spec/plan gốc» nhưng chữ «lệch» còn ở câu khác → E3 xanh | Needle cụm đủ dài; mỗi needle một lượt gỡ, thông điệp kèm tên needle | **fixed:** AC-3/E3 cụm dài + ma trận toàn phần; E5/E6 thêm đột biến từng needle |

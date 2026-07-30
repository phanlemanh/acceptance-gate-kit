---
slug: claim-scan-parser-hardening
at: 2026-07-29T09:05:00Z
verdict: findings
p0: 0
p1: 2
p2: 2
---

# Gap-probe — claim-scan-parser-hardening

Critic context sạch (agent tươi, 5 input — lần đầu có input thứ 5: 10 bài học
từ 4 feature trước qua claim-scan). Cross-check: AC↔eval 8/8 · GWT đo được ·
trục Coverage đủ (cửa "hàng" đỡ bởi lưới hồi quy V1 + AC-7) · (cross-layer)
không áp — CLI-only. **2/4 finding cite bài học xuyên-feature.**

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | evals | Trụ `exit 0` của lớp chỉ được ghim ở E2 — AC-3/4/5 và expected E3/E4/E5 không nói exit code dù design tuyên bố GIỮ exit 0 khi hỏng-từng-phần | Implementer làm frontmatter-hỏng thành fatal exit 1: E4/E5 vẫn xanh vì chỉ khớp stderr; ship xong claim-scan chết giữa S1 khi corpus có workspace cũ hỏng khuôn — nghịch đảo mục tiêu feature | Bổ sung exit 0 vào expected E3/E4/E5 kèm đối chứng dương sẵn có | fixed: expected E3/E4/E5 thêm exit 0 |
| P1 | evals | AC-8 hứa description "v1.18 adds…" nhưng E8 chỉ chạy sync --check — không assertion nào grep chuỗi. Đúng hình dạng [cross-feature-claim-index#F1]: hứa trong contract mà không eval nào tiêm | Bump + re-pin nhưng quên description: sync exit 0, suite xanh, E8 PASS — known-limit đã trượt một vòng lại trượt vòng nữa, Gate 2 ký trên lời hứa chưa trả | Thêm eval grep chuỗi v1.18 ở CẢ HAI manifest + đối chứng đột biến | fixed: thêm E9 (test, mutation counter) |
| P2 | contract | Vế loại trừ "trùng id CÙNG slug không cảnh" (nền của bỏ-qua-chủ-đích trong AC-7) không có ca tiêm — đối chứng âm của E3 là corpus sạch, không phân biệt được, đúng lớp [cross-feature-claim-index#F1] | Implementer warn trên MỌI id trùng: E3 vẫn xanh; corpus thật bắn warn nhiễu làm loãng chính kênh cảnh báo feature này dựng | Thêm ca same-slug-duplicate KHÔNG warn, cạnh ca khác-slug có warn | fixed: E3 thêm ca (c) same-slug |
| P2 | evals | E7 — thước duy nhất cho "đóng TRỌN lớp" — chạy runs 1, trong khi tiền lệ dòng feature này là panel 3/3 | Judge 1 lượt sót một nhánh drop không tên → AC-7 PASS giả, ký "lớp đã đóng" khi còn cửa câm | Nâng runs 3 lấy đa số | fixed: E7 runs 3 |

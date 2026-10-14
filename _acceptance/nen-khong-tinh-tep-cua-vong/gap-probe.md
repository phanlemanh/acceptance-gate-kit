---
slug: nen-khong-tinh-tep-cua-vong
at: 2026-10-14T06:40:00Z
verdict: findings
p0: 1
p1: 2
p2: 2
---

# Gap-probe — nen-khong-tinh-tep-cua-vong

Phản biện context sạch trên bản nháp S1 (design · contract · evals · decisions · claims · opportunity),
chạy trong lúc chờ lượt đường nền; sửa artifact một lượt, không probe lại.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | decisions | Dòng sổ «lưới thoát khác 0 mà mọi VIOLATION của vòng → xanh» ghi một-lối nhưng lối «giữ LOI CHAY khi lưới không tự giải thích mã» còn sống; thêm đánh đổi chiều đỏ thứ hai chưa ký | Lưới in VIOLATION [slug] rồi chết vì lỗi bash, thoát 1 → luoi xanh, mất LOI CHAY | Viết lại dòng sổ (supersedes) + ca NEN-TV5 (d) đòi LOI CHAY | fixed: dòng sổ mới supersedes — xanh chỉ khi mã 1 + dòng tóm «violation(s) — merge blocked» + N bằng số dòng VIOLATION; AC-5 (d), E5 năm dòng PASS |
| P1 | evals | Vị từ hẹp hơn câu «đường chứa slug» mà không eval nào chạy vị từ thật trên ca Gốc và 233 dòng lịch sử | Tệp mang slug lệch khuôn vẫn đỏ ở ca Gốc mà TV1–TV7 vẫn xanh vì tệp thử đặt đúng khuôn | Phát lại vị từ thật trên dòng lịch sử, so đẳng thức tập | fixed: AC-10 / E10 (NEN-TV8) phát lại 230 dòng thật qua chính hàm của lib/tep-cua-vong.mjs — ghim GIA-S1 197/197 vàng, KHAC 3/26, CAT 0/4, ca Gốc 7/7 vàng |
| P1 | contract | Chỉ đo bên đọc Cổng 1; Cổng 2 (cgNenDo) chưa đọc tệp có mục vàng | Bên đọc Cổng 2 cắt mục sai → dòng TEP CUA VONG lên Cổng Bằng chứng thành nền đỏ | GN-TV3: thẻ Cổng 2 trên tệp TV1/TV4 | fixed: AC-7 thêm vế Cổng 2, E7 thêm GN-TV3 (đối chứng dương TV4) |
| P2 | evals | Bộ phân loại VIOLATION không có ca tiền tố slug | Mẫu khớp quên «]» → hồ sơ <slug>-2 vi phạm thật thành vàng | Ca NEN-TV5 (e) + đột biến (d) | fixed: AC-5 (e), AC-8 (d), E5/E8 |
| P2 | evals | E7 không nói đo trên bản dựng nào; mã luoi-cua-vong vắng không có ca | Thẻ HTML thoát chữ hoặc bỏ dòng; khuôn thiếu mã in placeholder thô | E7 khai bản dựng; E6 (d) | fixed: E7 so trên HTML gate-card in ra sau bỏ thoát; AC-6 (d), E6 (d) |

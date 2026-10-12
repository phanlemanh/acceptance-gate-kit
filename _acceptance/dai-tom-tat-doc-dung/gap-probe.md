---
slug: dai-tom-tat-doc-dung
at: 2026-10-12T01:33:33Z
verdict: findings
p0: 0
p1: 2
p2: 3
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | contract | Ma trận AC-3 thiếu gạch giới hạn TRƠN chỉ mang «none»/«không có» và gạch con «không có» | `- Known limits: none` bị đếm thành 1 giới hạn, trang liệt «none» như giới hạn; E3 và E9 vẫn xanh | Thêm hai ca trơn + một ca gạch con «không có» mong đợi 0, mutant DT-3-do-tron-none | fixed: AC-3 thêm ba ca, E3 thêm mutant DT-3-do-tron-none |
| P1 | evals | Không ca nào có câu dẫn mà «:» nằm trong dấu nhấn | Bản dựng chỉ bắt «:» cuối chuỗi trơn; ô `…chỗ hở:**` vẫn cụt, E6 và E9 xanh | Ca (d) cho DT-6 + mutant dò trước khi bỏ dấu nhấn; DT-9 đếm sau khi bỏ `*`/`_` cuối | fixed: AC-6 + E6 ca (d) + DT-6-do-nhan; AC-9/E9 đếm sau khi bỏ dấu nhấn cuối |
| P2 | evals | AC-7 hứa giữ trọn mục danh sách nhưng E7 không có ca câu dẫn + danh sách quá 400 | Bản dựng cắt giữa mục hoặc để lại « · …»; không phép đo nào chạm vế đó | Ca (d) cho DT-7 + mutant cắt theo ký tự | fixed: AC-7 + E7 ca (d) + DT-7-do-muc |
| P2 | evals | Vế «khuôn khối không đổi» của E10 không trả lời được từ inputs | Đổi một khoá rồi sửa tài liệu cho khớp, hội đồng vẫn PASS | Bỏ vế khỏi E10; DT-9 so tập khoá + kiểu + phien_ban giữa bản sau và bản base | fixed: E10 bỏ vế; AC-9/E9 so khuôn khối hai bản |
| P2 | contract | Notes chỉ khai một lời hứa đã ký bị thay (production), chưa quét chữ «ngoài hợp đồng» của ô chưa làm | Một ca hay hồ sơ đã ký ghim chữ cũ bị thay âm thầm | Quét hồ sơ đã ký + tests rồi khai trong Notes | fixed: quét 12/10 — chỉ BANG_150/LT-162 của trang-ho-so-mot-viec ghim chữ ô chưa làm; Notes khai thêm gạch thứ hai kèm lệnh quét |

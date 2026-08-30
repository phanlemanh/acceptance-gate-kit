---
slug: release-2-5-0
at: 2026-08-30T07:34:53Z
verdict: findings
p0: 0
p1: 3
p2: 2
by: phiên đang làm hồ sơ (KHÔNG phải phiên tươi độc lập — ghi ở Known limits, cùng giới hạn với 2-4-0)
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | manifest · ghi chú nâng cấp | Câu kiểm-bằng-nội-dung của v2.5.0 trỏ chuỗi KHÔNG tồn tại trong scripts/gate-card.js (guard dùng tiếng Việt có dấu) | Consumer làm đúng hướng dẫn luôn thấy kết quả trống → tưởng bản cài cũ → gỡ-cài vô tận | Mọi câu grep in cho người phải khớp ≥1 dòng của file được ship (lớp lệnh-in-ra-phải-bấm-được) | fixed: e883f466 — neo sang hằng ASCII MSG_NO_DOSSIER có thật; chấm lại r2 |
| P1 | evidence r1 | verified_commit ghim cây TRƯỚC bản sửa manifest — PASS không neo vào vật xin merge | Người ký tin bản phát hành đã kiểm trọn trong khi file đo của AC-6 đổi sau mốc ghim | Bằng chứng phải neo cây chứa bản sửa; commit-giấy sau verify không tính stale (stale-theo-diff) | fixed: vòng r2 chấm trọn trên 30865e2f, report thay bản r1 |
| P1 | evidence r1+r2 | verified_at do bộ tổng hợp bịa số tròn Ở TƯƠNG LAI (09:00Z rồi 10:15Z), lệch run-log máy ~6 giờ — trong chính mốc đóng số cho suite-run-log-provenance | Bộ đối chiếu run_id→timestamp thấy hai sự thật mâu thuẫn cho cùng lượt chạy | verified_at phải bằng ts của run-log (một nguồn, nếp 2-4-0) | fixed: report r2 commit với verified_at = 03:30:53Z đúng run-log; lớp lỗi ghi sổ cho vòng sau |
| P2 | review-findings r1 | Cùng một lỗi grep bị liệt HAI mục (high + medium) và cả hai đã được sửa trước khi hồ sơ commit | Người ký Gate 2 disposition một khuyết tật không còn tồn tại → ghi giới-hạn-giả vào hồ sơ ký | Mục Ngoài-hợp-đồng trình người phải là hiện trạng tại HEAD | superseded: review-findings r2 thay bản r1; phần soi-hồ-sơ-r1 trong đó đọc kèm ghi chú Iterations |
| P2 | bảng «Ba dòng số» | Trộn số đếm-máy (tally) với số sổ-tay ba hồ sơ trước cơ chế tally; «làm-xong→ký» ba hồ sơ đầu chỉ chính xác tới mức «trong ngày» | Người đọc tưởng cả cột cùng độ tin | Mỗi ô ghi rõ nguồn đếm | accepted: đã ghi nguồn trong ngoặc từng ô + giới hạn khai trong hợp đồng — bộ đếm đủ dữ liệu từ cơ chế tally về sau |

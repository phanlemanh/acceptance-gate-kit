---
slug: trang-thai-dot-dieu-phoi-tho
at: 2026-10-12T08:58:00Z
verdict: findings
p0: 0
p1: 2
p2: 3
---

# Gap-probe — trang-thai-dot-dieu-phoi-tho

Phản biện context sạch: một tác tử tươi đọc 6 tệp — thiết kế, hợp đồng, eval, sổ, bài học claim-scan và ô cơ hội. Nó
không đọc mã và không chạy lệnh nào. Cả năm finding đã sửa vào artifact trước Cổng Phạm vi, theo luật một lượt, không
probe lại.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | contract + evals | Chỗ nối writer→reader của dải không có round-trip. Ma trận `veDai` nhận đầu vào dựng tay; AC-5 lấy chính `veDai` làm thước; các hàng (d)(e)(f)(j) là mảnh chuỗi, trong khi E4 đòi strictEqual. Cùng lớp với [ci-cua-kho-bo-job-nang#F1] | `moHinh` xuất hình khác đầu vào dựng tay, nên dải in «S4: trống · chờ lượt 0» trong khi `xem` in «S4: P5 → 07:47 · chờ lượt 8». KH-04 và KH-05 vẫn xanh | Round-trip `veDai` trên JSON thật ở các trạng thái kho thử, so với dòng trọn viết tay; chiều đỏ đọc sai khoá | fixed: AC-4 thêm (R1)–(R5) với JSON.parse(stdout `xem --json`) trên kho thử `mo sau-14-10`, dòng TRỌN viết tay (8 đơn chờ, 0 chờ người đếm tay); E4 so đúng quan hệ từng hàng; chiều đỏ «đếm chờ lượt từ khoá khác» → (R1) |
| P1 | contract + design | Không AC nào đo đường lùi «hook ném lỗi → engine bỏ qua hook, chạy `commands/xem.md`», tức tiền đề của [d-20261012T083355Z-1]. `validate` báo hook «without .catch», còn E9 đòi `--strict` không lỗi | `$.process.run` hỏng trên desktop. Engine coi hook cổng ném là chặn, nên `/dieu-phoi:xem` hỏng trong khi mọi ca xanh | AC-8 thêm hàng có mod mà CLI lỗi → markdown chạy; E9 ghim mục gating là ghi nhận | fixed: AC-8 thêm đường lùi (e) — gói có mod, `trang-thai.json` hỏng → num_turns ≥ 1, api_error, `result` không mở đầu «dieu-phoi: khung»; AC-9/E9 ghim `hasCatch: false` có chủ đích; thiết kế §2.4 ghi lý do |
| P2 | contract | `mui_gio_phut` có bên viết ghim (420), còn bên đọc thì không phép đo nào chứng: hàng (d) lệch 420 trùng `TZ` của test | `veDai` dùng giờ máy; môi trường mod chạy UTC nên dải in 00:47, lệch `xem` 7 giờ | Hai hàng lệch 0 và −300, khác `TZ` của test; chiều đỏ giờ máy | fixed: AC-4 thêm (k) lệch 0 → 00:47, (l) lệch −300 → 19:47; chiều đỏ «tính giờ bằng giờ máy» |
| P2 | contract | Chính sách «mod chỉ vẽ» mới có răng cho nửa «không cho phép»; không gì chặn mod ghi tệp hay gọi lệnh con đổi trạng thái | S3 thêm `$.fs.write` hay gọi `pha` ở nhánh giảm tải; AC-5 tới AC-9 vẫn xanh | Dòng `calls:` của validate không chứa lời gọi ghi/gửi; argv của `process.run` trong `khung.ts` kết thúc `xem --json`; chiều đỏ | fixed: AC-9 thêm vế `calls:` (danh sách cấm 8 mục) + argv viết thẳng; E9 thêm hai chiều đỏ KH-09-do ghi-tep, KH-09-do argv; thiết kế §2.4 |
| P2 | contract | Dòng Đường đo ghi «CHẾT/iterate ≥ 5», trong khi ngưỡng đã ký xếp ≥ 5 lần/ngày là iterate | Cổng Giá trị đọc Đường đo, xếp 5 tin/ngày là CHẾT, gỡ mod trái ngưỡng đã ký | Chép nguyên ngưỡng của ô | fixed: dòng Đường đo nay ghi «SỐNG ≤ 2 lần/ngày · iterate ≥ 5 (chép nguyên ngưỡng của ô)» |

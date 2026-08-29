---
schema_version: 1
slug: nhanh-chinh-khong-ten-main
feature: Bước chuẩn bị dữ liệu chấm phải dò được nhánh chính không tên main
owner: manh@mstar.vn
stage: decided              # discovery | decided | archived
decision: build        # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: Manh Phan
decided_at: 2026-08-29T14:20:00Z    # ISO UTC — theo phát ngôn ký trong hội thoại 29/08 (máy điền mốc, ±5 phút)
prototype:
  base_commit:
  disposition:
---

## Vấn đề & ai gặp

Người dùng kit trên repo mà nhánh chính không tên `main` (vd `master`) và không
với được remote: bước chuẩn bị dữ liệu chấm dừng ngay ở tên đầu tiên với lỗi
mờ, thay vì tự thử các tên khác như lời khai. Nguyên nhân đã định vị: cửa
fail-closed của `s4-args.mjs` gọi thoát-tiến-trình nên nhánh `catch` của vòng
dò không bao giờ chạy — danh sách bốn tên chỉ còn hiệu lực cho tên đầu; kèm
lệnh hỏi remote không có trần thời gian. Đã tái lập trên fixture (hai người soi
độc lập cùng chỉ ra, Cổng Bằng chứng hồ sơ cham-dung-cay-dung-cho-dung 29/08,
mục Ngoài-1/Ngoài-4 trong `_acceptance/cham-dung-cay-dung-cho-dung/review-findings.md`).
Owner xếp ngăn: mở hợp đồng mới.

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: repo tiêu thụ có nhánh chính không tên `main` (và không với được remote) có tự chấm được không, hay vẫn phải khai nhánh bằng tay?
- Kết quả nào là SỐNG: trên fixture repo dựng nhánh `master`, không remote: bước chuẩn bị dữ liệu chấm sinh trọn args với mốc so sánh ĐÚNG (bằng phép tính merge-base độc lập), không cần cờ khai tay; và ca nhánh chính không thuộc bốn tên biết trước thì thông điệp là câu có hướng dẫn («truyền --diff-base»), không phải vết đổ của tiến trình.
- Kết quả nào là CHẾT: vẫn phải khai nhánh bằng tay cho ca `master`, hoặc lời khai trong SKILL phải hạ xuống cho khớp mã (tức nhận thua bằng cách sửa lời hứa).
- Timebox: ship trước 2026-09-05; quá timebox → park, ghi sổ.

## Cổng 0

- **decision = build** Căn cứ: owner ký trong hội thoại 29/08 — «ký cả hai, giữ nguyên số»; hai ô sinh từ Cổng Bằng chứng #123, là điều kiện tiên quyết đã khai cho phát hành 2.5.0.
- **Ngưỡng chốt cùng lúc ký:** đã gỡ tiền tố, giữ nguyên số ở section Ngưỡng.

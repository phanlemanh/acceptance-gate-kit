# Review findings — release-2-7-0 (từ gap-probe context sạch, vòng chấm 1)

Mốc phát hành không có phiên soi đối kháng riêng (nếp 2.3.0→2.6.0); phần đối
kháng là gap-probe context sạch (`gap-probe.md`, verdict findings: P0 1 · P1 4 ·
P2 7). File này chỉ chép mục NGOÀI HỢP ĐỒNG theo khuôn máy đọc để thẻ Cổng 2 in
ra đúng ô — nội dung định đoạt từng dòng ở `evidence-report.md`.

## Trong hợp đồng

- P0 + 4 P1 + 7 P2 của gap-probe: đóng bằng sửa mệnh đề ở manifest + hợp đồng
  (`0c5b7809`), không sửa mã. Bảng định đoạt ở `evidence-report.md`.

## Ngoài hợp đồng

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Thẻ Cổng 2 không có luật rơi bậc — gap-probe vắng hay hỏng vẫn điền sẵn cắt/hoãn + Treo**
  Người dùng thấy gì: ở Cổng 2, nếu phiên phản biện chưa chạy hoặc file của nó hỏng, thẻ vẫn bảo «máy đã điền sẵn» hai ô như thể đối kháng đã hội tụ; token verdict lạ in nguyên văn như phán quyết. Vòng #136 chỉ làm rơi bậc cho thẻ Cổng 1 (AC-4).
  file: `scripts/gate-card.js`
  severity: high
  Đề xuất: new-contract

## Known limits

Xem `evidence-report.md` — bảy mục.

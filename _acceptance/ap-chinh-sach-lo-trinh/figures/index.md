# Hình tại điểm quyết định — ap-chinh-sach-lo-trinh (Cổng Phạm vi)

| Điểm | Đếm | Hình |
|---|---|---|
| Nhịp một đề xuất: báo trước → chờ → áp / huỷ / báo trước lại → trả lại · ghim (sổ S1 d-…-3, d-…-17, d-…-18) | 5 bước nối tiếp, 3 nhánh rẽ → cần hình | `nhip-tu-ap.html` |
| Hỏi-1 — điểm chạy tự động: lệnh mở việc (S0) hay lệnh riêng cho phiên điều phối | 2 nhánh rẽ → cần hình | `diem-chay.html` |
| Hỏi-2 — CỘNG ba lệnh khoá | dưới ngưỡng: 1 câu có/không | — |
| Chính sách đặt ở mốc chiến dịch (d-…-2) | dưới ngưỡng: 1 lựa chọn, căn cứ có sẵn | — |
| Bộ ghi giữ byte (d-…-5) | dưới ngưỡng: 1 điều kiện trước | — |

## Đề bài `nhip-tu-ap`
- Loại: sơ đồ trạng thái (state machine) của MỘT đề xuất của một hàng lộ trình.
- Nút: «Đề xuất xuất hiện» → «Báo trước (ghi sổ, tệp không đổi)» → «Chờ một nhịp (≥ 1 ngày)» → rẽ ba: «Còn nguyên → Áp (ghi sổ rồi dời hàng)» · «Biến mất → Huỷ» · «Đổi → Huỷ cũ + Báo trước mới». Sau «Áp» → «Trả lại (hoàn tác, chặn đúng đề xuất này)». Nhánh phụ: «Ghim (chỉ ghi sổ) → không báo trước / huỷ báo trước đang chờ». «Hàng đang được mở → không áp, huỷ».
- Nhãn bằng chữ thường, không tên tệp. Ghi chú: trần mỗi ngày (mặc định 5 hàng) — hàng vượt trần chờ ngày sau.
- AC liên quan: AC-2, AC-6, AC-10.

## Đề bài `diem-chay`
- Loại: so sánh hai nhánh (hai cột).
- Nhánh A (máy khuyên): mỗi lần mở việc từ một hàng lộ trình, máy áp trước rồi mở ô → commit riêng trên nhánh của vòng. Được: «tự» thật, không ai phải nhớ gọi. Giá: lộ trình đổi trên nhánh của vòng; hai máy áp khác ngày có thể xung đột khi gộp (giới hạn khai, ngưỡng ≥ 1 lần).
- Nhánh B: chỉ một lệnh riêng, phiên điều phối gọi khi xếp lịch. Được: không chạm bước mở việc. Giá: không phiên nào gọi thì máy không áp, chủ kho vẫn sửa tay.
- AC liên quan: AC-10.

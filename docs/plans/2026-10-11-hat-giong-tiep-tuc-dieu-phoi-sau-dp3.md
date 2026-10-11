# Hạt giống — bốn lỗ của lệnh nối lại đợt và chẩn đoán dãy sau DP3

Gốc: `_acceptance/dieu-phoi-tiep-tuc-mot-lenh/` (lượt chấm 1 ngày 11/10/2026, Cổng Bằng chứng ký 11/10 —
Ngoài-2, Ngoài-5, Ngoài-6, Ngoài-7, owner: mở hợp đồng mới). Hạt giống là SỔ, không phải ô: chỉ mở thành ô
khi có neo ngoài — một đợt thử thật (crm ~26/10, OneFlow ~27/10) vấp đúng lỗ. Gộp theo lớp: cả bốn là chỗ
máy kết luận về một dãy hay một khoá mà không đối chiếu trạng thái thật của nó. Không lỗ nào nằm trong 14
tiêu chí của DP3, nên vòng không vá.

## Lỗ

1. **Nối lại đợt mở chip cho dãy đã nghỉ hoặc đã xong (Ngoài-5, nặng).** `keHoachDay`
   (`dieu-phoi/scripts/tiep-tuc.mjs`) không lọc dãy có `nghi` hay dãy hết hàng; lời ghi danh trỏ một hàng
   đã gộp, nên `/dieu-phoi:tiep-tuc` có thể mở phiên làm lại việc đã gộp.
2. **`nha <tài nguyên>` không kiểm tên (Ngoài-2).** `nhaKhoa` (`dieu-phoi/scripts/ghi.mjs`) ghép tên vào
   đường rồi `rmSync` đệ quy, không so với `CAC_TAI_NGUYEN`: tên có `../` gỡ được khoá S4 cấp máy hay khoá
   của dãy khác, tên sai nhận lời báo thành công giả.
3. **Nhánh `chua-biet` gần như không chạy (Ngoài-6).** Hook nhịp của chính phiên giám sát tạo `song/` trước
   khi CLI chạy, nên «chưa có thư mục nhịp» không còn phân biệt được «gói cũ chưa có hook»; nâng gói giữa đợt
   thì phiên thợ cũ im và máy mở phiên thứ hai trên cùng worktree.
4. **Bước 7 của mo-dot không bao giờ báo xong (Ngoài-7).** `chan-doan` trơn nay luôn có mục `day:<id>`
   «thieu — mở chip» (`dieu-phoi/scripts/chan-doan.mjs`), nên vòng kiểm cuối của `/dieu-phoi:mo-dot` mời mở
   chip lần hai cho từng dãy.

## Ngưỡng mở ô

Một đợt thử thật gặp đúng một trong bốn lỗ (phiên mở thừa, khoá mất, hay mo-dot treo ở bước 7) — khi đó ô
mang `Gốc:` trỏ hồ sơ của đợt thử ấy.

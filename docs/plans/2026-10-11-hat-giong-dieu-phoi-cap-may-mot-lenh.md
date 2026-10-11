# Hạt giống — nối lại vai điều phối CẤP MÁY bằng một lệnh

Gốc: `_acceptance/dieu-phoi-doi-tai-khoan/` (vòng DP4 — bàn giao tài khoản cho đợt MỘT kho). Chủ kho nói 11/10,
nguyên văn: «Sau này nên đưa nó thành một command giống Start, Feature Loop,...» — «nó» là việc nối lại vai điều
phối sau khi đổi tài khoản hay khởi động lại. Hạt giống là SỔ, không phải ô: chỉ mở thành ô khi có neo ngoài
(ngưỡng ở cuối).

## Lỗ

Đã có: `/dieu-phoi:tiep-tuc` (DP3) nối lại một đợt của MỘT kho; DP4 thêm nhánh đổi tài khoản (`ban-giao` →
`tiep-tuc`). Chỗ hở là vai điều phối CẤP MÁY mà phiên «Điều phối M5» đang làm tay:

- trải nhiều kho cùng lúc (kit + crm);
- giữ quyền merge thay chủ kho;
- xếp lượt S4 xuyên kho (một S4 trên máy tại một lúc);
- giữ khoá merge với máy khác (issue phanlemanh/acceptance-gate-kit#308).

Không phần nào nằm trong một đợt, nên sau khi đổi tài khoản hay khởi động lại, vai này được nối lại bằng bộ nhớ
của phiên cộng một câu dán tay — đúng thứ `tiep-tuc` đã gỡ cho đợt một kho.

## Hướng

MỘT lệnh, MỘT đường, không bày lựa chọn: hoặc `tiep-tuc` đọc thêm một sổ cấp máy (các đợt đang mở trên máy,
lượt S4 xuyên kho, khoá merge đang giữ), hoặc một lệnh riêng cùng khuôn với Start / Feature Loop. Chọn giữa hai
là việc của Cổng Đáng khi ô mở, không phải của hạt giống này.

Ngưỡng mở ô: lần đầu ≥2 kho cùng chạy đợt của gói `dieu-phoi` trên một máy (dự kiến đợt thử crm ~26/10 song
song với kit), có sự kiện hoặc dòng Nhật ký của hai đợt làm neo.

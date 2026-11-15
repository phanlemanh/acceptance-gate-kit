# Hạt giống — hook lúc ghi và bước kiểm lại ở CI giải công cụ kiểm theo hai cách

Gốc: acceptance-gate-kit/_acceptance/phan-du-bo-cuc-moi/ — Ngoài-11 của Cổng Bằng chứng (15/11/2026), chủ kho chọn
«mở hợp đồng mới».

Vòng `phan-du-bo-cuc-moi` thêm ứng viên thứ tư để tìm gói lõi khi giải công cụ kiểm (`verifier`), dùng cho bố cục
`plugins/<tên>/`. Ứng viên này chỉ nằm ở `scripts/recheck-evidence.cjs`, như một bước xét lại các lỗi «verifier script
not found» (sổ quyết định của hồ sơ, Treo-4). Hook lúc ghi (`hooks/acceptance-evidence-gate.js`) vẫn gọi bộ giải ba ứng
viên ở `lib/evidence-core.cjs` (`isAuthenticVerifier`).

Hệ quả: ở kho đặt gói lõi trong thư mục con, cùng một báo cáo bằng chứng cũ qua được bước kiểm lại ở CI nhưng bị hook
chặn khi phiên ghi hoặc sửa nó. Người dùng không tự gỡ được, vì hai nơi cho hai đáp án khác nhau.

Nhát sửa: đưa ứng viên thứ tư vào bộ giải chung ở `lib/evidence-core.cjs` rồi gỡ bước xét lại riêng ở
`recheck-evidence.cjs`. Thêm một ca so hai đường trên cùng báo cáo cũ ở bố cục `plugins/<tên>/`. Chiều đỏ: bản sao gỡ ứng
viên khỏi bộ giải chung → hook và kiểm lại cùng đỏ, gọi tên verifier. Chiều im: bố cục phẳng không đổi đáp án. Nên làm
cùng mốc 3.0, khi kho mới bắt đầu nhận báo cáo cũ. Giá ước: một vòng T3 nhỏ, vì chạm `lib/evidence-core.cjs` mà hook dùng.

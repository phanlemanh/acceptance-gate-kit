# ADR 0020 — Reality có quyền đóng hồ sơ; một dòng hiệu chuẩn định nghĩa «đủ»

2026-09-21 · owner phê đích danh hai CỘNG (Đ8, Đ9) của bản định vị lại kit
(`docs/findings/2026-09-21-dinh-vi-lai-kit-vat-tao-ra-ban-giao.md`, PR #192) — không
có vòng, nên phê bằng ADR theo đúng vế của **ADR 0018**. **Số đo:** enum trạng thái hồ
sơ có **6** giá trị (`lib/workspace-record.cjs:40`) và chữ `prod` xuất hiện **2** dòng
trong toàn engine; `crm@112c4f5a` (18/09) viết thẳng «bộ kit không có trạng thái cho lối
đóng-theo-quan-sát»; hệ quả đo được: vật `nhan-ung-dung-noi-tieng-viet` chạy trên prod
từ `ff3fb8bf` mà hồ sơ kẹt `approved / BLOCKED / chữ ký rỗng` → cổng gọi là «tàng hình»
→ sinh `thuoc-khai-dung-tieng` (9 lượt chấm, ký PASS) rồi `ho-so-khai-dung-tieng` (4
lượt, REJECT), bộ đo **+4 622** dòng trên sản phẩm **+81** (57 : 1), ≥ 6,6 M token — cho
một vật người dùng đã dùng; và **không tìm thấy** một ca «ĐẠT đã ký → prod đỏ» nào được
ghi trong `docs/`, nên «đủ tốt» không có định nghĩa và mặc định của một bộ máy đối kháng
là «chưa đủ» (chuỗi phát hiện `7→4→4→0→4→2→1` của `thuoc-` không hội tụ). **Quyết, hai
vế:** (1) **Đ8** — thêm giá trị trạng thái thứ bảy `da-cham-boi-thuc-te`: **người** ghi
một dòng (sha đang chạy trên prod · ngày quan sát · tên) qua một thao tác cổng người
**thứ bảy**, khoá model-invocation như `signoff` (ADR 0002; test P32 mở rộng theo); máy
nhận trạng thái ấy là **cuối** — hồ sơ rời nhóm đang dở, mọi việc-thước trên nó bị khoá,
và một ca prod đỏ về sau là đường mở lại duy nhất (dòng `revisit` trỏ sự cố). Đường
đọc-cũ: hồ sơ không mang trạng thái này render y như hôm nay, không bắt migrate.
(2) **Đ9** — hồ sơ mốc mang **một dòng** hiệu chuẩn `ĐẠT đã ký → prod đỏ: k / N`, với N =
số hồ sơ đã ký có dòng quan sát prod; dòng này không phải phép đo mới theo nghĩa luật
(c)(a) — nó đọc sổ quyết định và dòng quan sát đã có — và **N là chiều đỏ của chính nó**:
N không tăng giữa hai mốc thì dòng vô hiệu, không được đọc thành «0 sự cố».
**Trade-off nhận có tên:** một hồ sơ có thể đóng khi bảng eval còn ô đỏ hoặc mù — đổi
lấy việc reality, chứ không phải bộ máy, làm người chấm cuối; hai cược ở §6.1 của bản
định vị (chất lượng thước từ *ép* sang *nhìn thấy*; lớp nhìn-thấy từ *frame giả* sang
*mù có tên*) chỉ kiểm được bằng chính dòng này. **Vì sao khó đảo:** đóng một hồ sơ dưới
trạng thái này là một lời khai với người đọc sau rằng reality đã chấm — rút lại là rút
một chữ ký. **Điều kiện thi hành** (§7.2 bản định vị): tối đa **một** vòng meta có tên
cho Đ7 + Đ8, buộc vào mốc mà `crm` sẽ cài; không có vòng «định vị lại»; Đ1–Đ3 đi như
TRỪ bên trong vòng sản phẩm đang vấp.

# Hạt giống — thẻ Cổng 2 in mục Ngoài-n thành BẢNG có cột «Căn cứ»

**Ngày:** 2026-10-14 · **Trạng thái:** hạt giống (SỔ, chưa là ô) · **Hạng dự kiến:** T2 (đổi mặt
render của thẻ và thêm một trường vào khuôn mục ngoài hợp đồng; KHÔNG chạm đường phán quyết
finder → refute → REJECT). Là CỘNG — owner duyệt đích danh ở Cổng Phạm vi của vòng.
Gốc: crm/_acceptance/kanban-viec/ — `review-findings.md` (nhánh `feat/kanban-viec`, commit
`39863c530` 14/10), 10 mục Ngoài-n: 7 `known-limits` · 1 `new-contract` · 2 `wont-fix`.
**Chân VC8 (cơ học, KHÔNG phải neo):** `_acceptance/o-chi-mo-khi-co-neo-ngoai/` trích lại tệp này.

## Ca thật

Ở Cổng Bằng chứng của `kanban-viec`, phiên crm tự soạn tay cho owner một bảng bốn cột: **Mục ·
Người dùng gặp gì · Đề xuất · Căn cứ**, mỗi mục Ngoài-n một dòng. Owner (14/10) đánh giá đó là cách
hiển thị tốt bổ sung cho Cổng 2, ngay lúc phê duyệt.

Phần «Căn cứ» trong bảng KHÔNG có trong hồ sơ — grep `review-findings.md` và cả thư mục hồ sơ không
thấy câu nào. Phiên đã tự dựng lý do cho từng đề xuất, ví dụ:

- Ngoài-2 · mở việc mới · «Lộ dữ liệu, mức nặng. Phải đổi luật ai thấy gì nên cần tiêu chí riêng.»
- Ngoài-7 · ghi hạn chế · «Tải lại là có. Không mất dữ liệu.»
- Ngoài-4 · chấp nhận · «Chỉ khó sửa về sau, người dùng không thấy khác.»

Tức là: một máy đứng ở cổng thấy mặt render của kit không đủ để người quyết trong một phút, và tự
vá bằng tay — thứ kit nên phát ra, giá 0.

## Lỗ ở kit hôm nay

1. **Không có lý do cho đề xuất.** `scripts/gate-card.js` (khối «Ngoài hợp đồng — bạn quyết») in mỗi
   mục một khối: câu `plain` + «Máy đề xuất: …» + ba nút. Khuôn `OOC-ITEM-TEMPLATE`
   (`feature-loop/workflows/acceptance-verify.js`) chỉ có `plain · file · severity · Đề xuất`; trường
   `rationale` của `TRIAGE_SCHEMA` trả lời «vì sao trong/ngoài hợp đồng», không trả lời «vì sao đề xuất
   này». Người ký hoặc gật suông, hoặc mở `review-findings.md` — trái luật lời mời cổng 01/09.
2. **Dạng khối xếp chồng** không so ngang được; mục khác thường (ở đây Ngoài-2) không tự nổi lên.
3. **Ba loại nhãn trộn chung một cột** «Người dùng gặp gì»: lỗi người dùng thấy (Ngoài-2, 3, 6, 7, 8),
   giới hạn đo lường — «chưa có bài kiểm» (Ngoài-1, 9, 10), nợ mã người dùng không thấy (Ngoài-4, 5).
   Khối ĐỊNH VỊ 21/09 tách đúng ba loại này.

## Hướng nghiệm (chưa phải hợp đồng)

- Thêm trường `Căn cứ:` vào `OOC-ITEM-TEMPLATE` + `TRIAGE_SCHEMA` (một câu: hậu quả · mức nặng · đảo
  được không) + bộ đọc `lib/out-of-contract.cjs`; round-trip rút-từ-writer-đọc-bằng-reader như P55.
- Thẻ render bảng `Mục · Người dùng gặp gì · Máy đề xuất · Căn cứ`, **mục cần quyết thật lên đầu**
  (khớp tách ô hỏi / dòng báo của `ngoai-n-tu-dinh-tuyen`), nhãn loại mỗi dòng; màn hẹp rơi về khối
  xếp chồng.
- **Đọc-cũ:** hồ sơ không có `Căn cứ:` → ô trống, không cờ đỏ, không bắt kho migrate.
- Câu gộp ký (`Ngoài-n: …`) giữ nguyên — bảng chỉ đổi mặt đọc, không đổi lệnh.

**Cân trên mọi kho (luật 26/09):** kho không có ca này được lý do in sẵn ở mọi Cổng 2 có mục Ngoài-n;
mất: thẻ đổi bố cục (ca canh render như P53b phải đi theo). Không ai dựa vào bố cục khối xếp chồng
ngoài chính các ca đo của kit.

## Điều kiện mở

Mở thành ô khi owner gọi tên vòng (luật chiều rộng (b): tối đa MỘT vòng meta giữa hai mốc được kho
tiêu thụ nhận). Ngưỡng tự nhắc lại: ≥1 lần nữa một phiên ở kho tiêu thụ tự soạn tay lý do cho mục
Ngoài-n tại Cổng 2.

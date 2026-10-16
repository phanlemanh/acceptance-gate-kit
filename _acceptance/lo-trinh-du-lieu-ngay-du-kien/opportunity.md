---
schema_version: 1
slug: lo-trinh-du-lieu-ngay-du-kien
feature: Kho tiêu thụ đọc khối dữ liệu trang lộ trình và có giờ máy của từng hàng, giờ máy cùng ngày dự kiến của từng mốc — kèm cờ khi số đo chưa đủ; trang đọc bản cũ vẫn chạy y như trước
owner: phanlemanh@gmail.com
stage: decided              # discovery | decided | archived
decision: build             # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: Manh Phan
decided_at: 2026-10-16T02:47:11Z   # chủ kho gõ «đáng: build · ngưỡng: nhận» ở Cổng Đáng 16/10
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: RM6c
lo_trinh_tep: docs/plans/lo-trinh-kit.json
---

## Vấn đề & ai gặp

Mở từ hàng RM6c của «Lộ trình kit nghiệm thu — từ 2.24.0» (`docs/plans/lo-trinh-kit.json`).
Mốc: Gói road-map hoàn tất theo B′ — 19/10/2026 (cùng gói với RM6, hàng này đứng trên RM6). Chủ kho mở 16/10 («mở RM6c
và LT1e»).

Gốc: _acceptance/lo-trinh-gio-may/ — RM6 (đã ký 16/10) đưa giờ máy và ngày dự kiến lên trang `LO-TRINH.html` và
`/road-map:xem`, nhưng KHÔNG vào khối dữ liệu máy đọc của trang (`<script id="lo-trinh-du-lieu">`, phiên bản 2).

**Ai đau:** trưởng phòng ban xem trang Lộ trình trong CRM. Trang ấy không tự tính gì — nó đọc khối dữ liệu của trang kit
(crm `apps/app/lib/lo-trinh/doc-du-lieu.js` là bản chép nguyên văn bộ đọc của kit, rồi một bảng kiểm khoá). Khối không có
giờ máy, không có ngày dự kiến → trang CRM không hiện được, dù trang kit đã in. Bên crm, hàng **LT1e** «Lộ trình hiện ngày
dự kiến» (crm-onehub PR #435) chờ đúng bản kit này để hiển thị.

**Số đo trước** (máy đo 16/10, kit `main` 31c5b8df, crm `onehub` 8decc2f36):
- Trang lộ trình của kit in chữ «giờ máy» **65** lần; khối dữ liệu của chính trang ấy mang **0** khoá giờ máy / ngày dự kiến.
- Chạy bộ đọc THẬT của crm (bản chép `doc-du-lieu.js` + bảng kiểm khoá `packages/validation/src/lo-trinh-du-lieu.ts`) trên
  ba biến thể của trang kit:
  · trang nguyên (bản 2) → đọc được, 0 cảnh báo;
  · bản 2 + khoá giờ máy/ngày dự kiến mới → đọc được, 0 cảnh báo, khoá mới bị **bỏ im lặng** (không vỡ, không hiện);
  · bản 3 + khoá mới → đọc được, nhưng **1 cảnh báo** «khuôn phiên bản 3 mới hơn bộ đọc (2)», trang CRM bật hộp «Trang có
    thể thiếu một phần» cho tới khi crm chép bộ đọc mới.
- crm hôm nay có 7 mốc đang chạy, **0/7** có dự báo đóng băng (crm chưa nhận bản kit có RM6). Sau khi nhận kit, 5/7 mốc
  còn việc chưa mở có ngày ngay lần mở việc kế; 2/7 đã mở hết việc (gồm «R2 lên production», 21 việc) không có ngày theo
  luật đóng băng — giới hạn khai ở hợp đồng (đo bổ sung sau phản biện 16/10).
  Nghĩa là: không cách nào làm VỠ trang crm cũ; câu còn lại chỉ là có tăng phiên bản (và chịu hộp cảnh báo trong quãng
  crm chưa chép) hay không — câu đó lên Cổng Phạm vi kèm khuyến nghị.

**Ý định:** khối dữ liệu mang đúng những gì trang đã in — giờ máy từng hàng, giờ máy + ngày dự kiến từng mốc, cờ khi số đo
chưa đủ — để bản chiếu ngoài kho không phải tự tính. Kit render, không soạn: không chữ nào trong khối mà trang không in.
Không thêm cổng, không thêm lượt gọi người.

**Luật chiều rộng (b):** đây là vòng SẢN PHẨM có neo ngoài (người dùng CRM thấy ngày dự kiến), không phải kit sửa thước của
kit.

## Giả định chốt sinh tử

| # | Giả định | Nếu sai thì | Phép thử rẻ nhất | Trạng thái |
|---|---|---|---|---|
| 1 | Bộ đọc cũ của crm gặp trang mới không vỡ | Trang Lộ trình trong CRM trắng ở mọi kho chưa nâng | Chạy bản chép thật của crm trên trang mới | Đã đo — không vỡ ở cả hai cách (bảng trên) |
| 2 | Ngày dự kiến trên trang là dự báo ĐÓNG BĂNG lúc mốc bắt đầu (tất định) — khối mang được mà `--check` vẫn so từng byte | Khối đổi theo ngày, CI kho đỏ mỗi sáng | Vẽ hai lần khác ngày, so byte | Chưa thử |
| 3 | Mốc chưa bắt đầu không có ngày dự kiến trên trang — khối nói «chưa có» chứ không bịa | Trưởng phòng thấy ngày không có thật | Ca mốc không có `du-bao.json` | Chưa thử |

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: sau khi crm nhận bản kit có RM6c (cùng LT1e), trang Lộ trình trong CRM có hiện ngày dự kiến của
  ít nhất một mốc đang chạy mà không bật hộp «Trang có thể thiếu một phần» không?
- Kết quả nào là SỐNG: có — ít nhất một mốc hiện ngày dự kiến, không hộp cảnh báo khuôn.
- Kết quả nào là CHẾT: crm đã nhận bản kit có RM6c mà trang CRM vẫn không có ngày dự kiến ở mốc nào đang chạy, hoặc trang
  CRM vỡ / bật hộp cảnh báo khuôn sau khi đã chép bộ đọc mới.
- Timebox: 2026-11-05 (mốc «Tinh chỉnh sau hai đợt thử»). Tới hạn mà crm chưa nhận bản kit → «chưa đọc được ở đây», không
  phải CHẾT.

## Kết quả prototype

Không dựng prototype — đổi khuôn khối dữ liệu của bộ vẽ trang; đo bằng ca hai chiều trong bộ kiểm của kit và bằng bản chép
thật của crm.

## Nguồn ngoài & phạm vi kế thừa

| Món vật liệu | Nguồn (đường dẫn/tên gói) | Phân loại | Kế thừa? | Người ký |
|---|---|---|---|---|
| Ước giờ máy, dự báo đóng băng, cờ quá tải | hồ sơ `_acceptance/lo-trinh-gio-may/` (RM6, đã ký 16/10) | triết-lý/logic | có | |
| Khuôn khối dữ liệu + bộ đọc khoan dung | hồ sơ `xuat-du-lieu-lo-trinh` (X1) · `trang-ho-so-mot-viec` (X2, tiền lệ bản 1 → 2) | triết-lý/logic | có | |
| Bộ đọc của crm | crm-onehub `apps/app/lib/lo-trinh/doc-du-lieu.js` + `packages/validation/src/lo-trinh-du-lieu.ts` @ 8decc2f36 | đo, không sửa | không | |

## Cổng 0

- **decision = build** — chủ kho gõ «đáng: build · ngưỡng: nhận» 16/10.
- **disposition = —** Căn cứ: không prototype.
- **Ngưỡng UAT chốt cùng lúc ký:** nhận nguyên văn mục «Ngưỡng chết / ngưỡng UAT» ở trên.

## Thước đo thành công → ứng viên criterion

- Khối mang giờ máy từng hàng (khoảng, nguồn ước, chữ đúng như trang in) → AC hàng.
- Khối mang giờ máy + ngày dự kiến đóng băng + cờ quá tải từng mốc; mốc chưa bắt đầu → «chưa có», không bịa → AC mốc.
- Cờ «số đo chưa đủ» khi chưa đủ 5 vòng đo → AC cờ.
- Bộ đọc mới đọc trang bản 2: khoá mới rỗng theo kiểu + một cảnh báo, không vỡ → AC đọc-cũ (a).
- Bộ đọc bản 2 (chép từ lịch sử kit) đọc trang mới: mọi khoá bản 2 y nguyên, không vỡ → AC đọc-cũ (b).
- Bảng khoá ở tài liệu cho kho tiêu thụ = bảng trong mã (LT-119 mở rộng) → AC tài liệu.
- `--check` vẫn so từng byte khi vẽ lại khác ngày → AC tất định.

## Out of scope từ khám phá

- Ngày dự kiến «sống» tính theo hôm nay trong khối — trang là tất định (so từng byte ở CI); bản sống ở `/road-map:xem`.
- Sửa trang Lộ trình trong CRM — việc của hàng LT1e bên crm.
- Ngày dự kiến riêng từng hàng — trang không in; hàng đọc ngày của mốc chứa nó.

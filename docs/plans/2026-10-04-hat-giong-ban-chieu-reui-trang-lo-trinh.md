# Hạt giống — bản chiếu ReUI của trang lộ trình, bật theo từng kho

**Ngày:** 2026-10-04 · **Trạng thái:** hạt giống (SỔ, chưa là ô) · **Hạng dự kiến:** T2.
Gốc: _acceptance/trang-lo-trinh-doc-mot-phut/ — phiên nghiệm thu 04/10: owner xem bản mẫu ReUI trên
dữ liệu crm thật, đồng ý đề xuất «trang tĩnh là bản gốc, ReUI là bản chiếu sống bật theo kho».
**Chân VC8 (cơ học, KHÔNG phải neo):** `_acceptance/trang-lo-trinh-doc-mot-phut/uat-session.md` trích lại tệp này.

## Ca thật

Owner gửi `reui.io/blocks` và `reui.io/components`, hỏi ghép thành trang lộ trình hoàn chỉnh. Máy
dựng bản mẫu React (Vite + shadcn radix-nova + ReUI) trên dữ liệu crm `onehub` `0b8540c16`, ghép từ
ba block Pro: `solution-analytics-7` (thẻ quyết định → «Làm tiếp» + «Chép lệnh»), `stats-3` (thanh
phân đoạn + mốc «còn N ngày»), `data-grid-grouping-1` (bảng việc gom theo nhóm, «Đã giao» gập sẵn).
Ảnh: `_acceptance/trang-lo-trinh-doc-mot-phut/evidence/reui-de-xuat/`.

Số đo bản mẫu (cùng thước trang tĩnh, 1440/375 × sáng/tối): màn đầu đủ hai lộ trình ở 375 sau khi
thu gọn thẻ · cao 1.865 px ở 1440 · tương phản thấp nhất 4,54 · **7 cỡ chữ (trần 6)** · **vùng bấm
24–32 px (sàn 44)**.

## Hướng đã đồng ý

- Trang tĩnh `LO-TRINH.html` giữ là bản gốc tất định của kit.
- Kit thêm MỘT lối xuất mô hình xem JSON từ lớp phân tích (bản mẫu: `scripts/xuat-du-lieu.mjs` ở
  thư mục nháp — trạng thái theo nhóm, chỗ cần sửa đã dịch, lệnh mở, mốc, hồ sơ ngoài kế hoạch).
- Trang ReUI sống ở kho tiêu thụ (crm) dưới giấy phép Pro của chủ kho; mã block KHÔNG vào kit (giấy
  phép không cho phát lại cho kho khác).

## Lỗ phải đóng trước khi mở ô

- Cỡ chữ về ≤ 6, vùng bấm về ≥ 44 px (mặc định gọn của ReUI dưới sàn).
- Hợp đồng JSON giữa kit và trang: bên viết (kit) và bên đọc (trang) rút từ MỘT khuôn có marker,
  ca round-trip — lớp «bên viết và bên đọc trôi khỏi nhau».

## Ngưỡng mở ô

Một kho tiêu thụ cài mốc có trang tĩnh mới và chủ kho gọi tên bản chiếu sau khi dùng trang tĩnh
≥ 1 tuần (neo ngoài: phiên crm có ghi lại nhu cầu cụ thể — lọc, tìm, nhiều lộ trình hơn).

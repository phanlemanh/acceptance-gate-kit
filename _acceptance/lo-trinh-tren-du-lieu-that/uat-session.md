---
schema_version: 1
slug: lo-trinh-tren-du-lieu-that
feature: Lộ trình chạy được trên dữ liệu thật của crm — so lời khai theo nhóm, hàng tự khai đã giao mà không hồ sơ bị nêu tên và không thành hàng kế, nối hai chiều hàng ↔ hồ sơ qua lo_trinh_ma, nhiều lộ trình mỗi kho, mở việc từ hàng qua Cổng Đáng, thẻ start luôn có đường mở trang
owner: phanlemanh@gmail.com
stage: held
verdict: release
decided_by: Manh Phan
decided_at: 2026-10-03T09:29:19Z
---

## Ngưỡng đã khai tại Cổng Đáng (CHÉP NGUYÊN VĂN — cấm sửa sau khi thấy số)

- Câu hỏi phép đo trả lời: *trên lộ trình OKR thật của crm, thẻ start có chỉ đúng hàng kế và cờ chỉ còn lệch thật không?*
- Kết quả nào là SỐNG: trên bản sao hồ sơ crm `onehub` · hàng kế là một hàng thật sự chưa giao · 0 cờ nhiễu (mỗi cờ còn lại được owner xác nhận là lệch thật) · mở hàng kế từ /start ra ô cơ hội có ngưỡng đề xuất lấy từ `bat_khi`, không thêm lượt gọi người.
- Kết quả nào là CHẾT: hàng kế vẫn là hàng đã giao, hoặc còn ≥ 3 cờ nhiễu trên lộ trình OKR, hoặc kho không khai đổi thẻ/đổi trang.
- Timebox: một vòng T2, trần ba lượt chấm; đọc ngưỡng ngay trên bản sao crm trước khi cắt mốc 2.21.0.

Điều kiện «sản phẩm thật chạy sau flag»: ⚠ chưa lái-thử — hồ sơ không có `stranger-drive.md`; điều
kiện là lời khai. Sản phẩm ở đây là thẻ và trang lộ trình của kit, chạy trên bản sao `_acceptance/`
của crm `onehub` (`9660bf6c`, trùng từng tệp với `onehub` lúc 03/10 chiều) và lộ trình OKR bản chụp
tối 30/09 (nhánh crm `docs/okr-tien-do-3009-toi`, PR crm #223 chưa gộp) chuyển sang JSON.

## Người dự

| Tên | Vai | Đại diện cho ai |
|---|---|---|
| Phan Le Manh | chủ kho crm, ngồi phiên điều phối | người đọc thẻ start mỗi sáng — người dùng cuối của tính năng |

## Chấm kín (thu TRƯỚC mọi thảo luận chung)

Câu gợi cho người dự (máy dọn bàn, người chấm): tám cờ trên trang, mỗi cờ kèm bằng chứng từ crm.

| # | Cờ | Bằng chứng ở crm `onehub` |
|---|---|---|
| 1 | hàng 4n thiếu câu giao | «Nợ sau lượt 4», đã lên onehub (#176), tệp lộ trình không có câu giao |
| 2 | hàng N0 thiếu câu giao | «Đo trước khi dựng», nhóm trợ lý, xong (#163) |
| 3 | hàng N1 thiếu câu giao | «Ca thật từ OKR quý 4», chưa mở |
| 4 | hàng 4c thiếu câu giao | «Hạ trần tháng hỏi CRM qua Zalo», đã lên onehub (#168) |
| 5 | mã T trùng | hai hàng khác nhau cùng mã T: «Tóm tắt cấp bộ phận» (trợ lý) và «Triển khai Zalo trên production» (zalo) |
| 6 | hàng 1 tự khai đã lên onehub mà không có hồ sơ `cay-to-chuc-co-nguoi` | crm không có hồ sơ tên đó; hồ sơ thật đã ký: `cau-truc-to-chuc` (24/09), `to-chuc-danh-sach-chi-tiet` (25/09) |
| 7 | hàng 9c khai «Cổng Phạm vi», hồ sơ đã giao — chờ nghiệm thu | `tro-ly-okr-tom-tat` đã ký Cổng Bằng chứng 01/10 |
| 8 | hàng D khai «đang dựng», hồ sơ đã giao — chờ nghiệm thu | `soan-okr-cung-tro-ly` đã ký 02/10, gộp onehub (#232) |

Hàng kế máy chỉ: **7n** «Mang sang đúng khi kỳ đích đổi pha, và đợt rà đặt lịch tương lai đóng được»
— tệp khai «chưa mở», không có hồ sơ `no-sau-luot-7-okr`, hàng nó đứng trên (8c) đã ký 29/09.

| Người | Điểm/nhận xét kín | Sẽ gửi cho khách nào, khi nào |
|---|---|---|
| Phan Le Manh | không chấm tay — owner 03/10: «Phần này sao không ghi log mà cần phải hỏi tôi?»; cả tám cờ và hàng kế kiểm được bằng hồ sơ + git, máy kiểm và ghi ở khối dưới | crm, ngay sau khi cắt 2.21.0 |

### Kiểm bằng máy (thay phần «owner xác nhận» — mọi vế đều có căn cứ trong hồ sơ)

Nguồn: lộ trình `origin/docs/okr-tien-do-3009-toi:docs/plan/lo-trinh-okr.data.js` (`a4068a6f`) nạp
bằng `vm` · hồ sơ `origin/onehub` (`9660bf6c`) đọc bằng `git show`/`git cat-file` · PR crm qua `gh`.
Chạy 03/10.

| # | Cờ | Căn cứ máy đọc | Kết luận |
|---|---|---|---|
| 1 | hàng 4n thiếu câu giao | nguồn: `cau_giao=""` | lệch thật |
| 2 | hàng N0 thiếu câu giao | nguồn: `cau_giao=""` | lệch thật |
| 3 | hàng N1 thiếu câu giao | nguồn: `cau_giao=""` | lệch thật |
| 4 | hàng 4c thiếu câu giao | nguồn: `cau_giao=""` | lệch thật |
| 5 | mã T trùng | hai khoá khác nhau `ai-t` «Tóm tắt cấp bộ phận» · `zalo-t` «Triển khai Zalo trên production» | lệch thật |
| 6 | hàng 1 khai đã giao, không hồ sơ | `trang_thai=đã lên onehub`; `_acceptance/cay-to-chuc-co-nguoi` không có ở onehub; `cau-truc-to-chuc` ký Manh Phan 2026-09-24 | lệch thật |
| 7 | hàng 9c khai «Cổng Phạm vi» | `tro-ly-okr-tom-tat` `status: signed-off`, ký Manh Phan 2026-10-01 | lệch thật (bản chụp cũ) |
| 8 | hàng D khai «đang dựng» | `soan-okr-cung-tro-ly` `status: signed-off`, ký Manh Phan 2026-10-02 | lệch thật (bản chụp cũ) |
| kế | hàng 7n | `trang_thai=chưa mở`; không nhánh remote nào có `_acceptance/no-sau-luot-7-okr`; không PR nào làm nó (#183 chỉ liệt «7n nợ sau lượt 7 (trước 14/12)»); 8c ký 2026-09-29 | việc thật sự chưa làm |

## Thảo luận sau khi đã chấm

## Số đo thật đặt cạnh ngưỡng

| Thước | Ngưỡng đã khai | Số đo được | SỐNG/CHẾT |
|---|---|---|---|
| Hàng kế | hàng thật sự chưa giao | 7n — không hồ sơ, không PR, phụ thuộc đã ký (kiểm bằng máy) | SỐNG |
| Cờ nhiễu | 0 (CHẾT khi ≥ 3) | 0 nhiễu / 8 cờ (trước vòng 18 cờ, 11 nhiễu) — kiểm bằng máy | SỐNG |
| Mở hàng kế | ô cơ hội có ngưỡng đề xuất từ `bat_khi`, không thêm lượt gọi | `--mo-o 7n` ghi ô có bốn dòng đề xuất (SỐNG = «Người dùng thấy ngay khi gộp», hạn 2026-12-14 theo mốc), bộ quét xếp chờ Cổng Đáng; 0 lượt gọi thêm | SỐNG |
| Kho không khai | không đổi thẻ/trang | bản đồ + JSON quét giống từng byte bộ vẽ trước vòng (LT-80, lượt chấm 2) | SỐNG |

## Quyết định Cổng Giá trị

- **verdict = release** (Manh Phan, 03/10: «quyết: release; gửi: crm, ngay sau khi cắt 2.21.0»).
  Căn cứ: bốn thước của ngưỡng SỐNG đều SỐNG — hàng kế 7n là việc chưa làm; 0 cờ nhiễu / 8 cờ (trước
  vòng 11 nhiễu / 18); mở hàng kế ra ô cơ hội có ngưỡng đề xuất, không thêm lượt gọi; kho không khai
  giữ từng byte. Không thước nào chạm ngưỡng CHẾT.
- Bước kế: nghi thức phát hành của kit — cắt mốc 2.21.0, rồi PR ở crm nhận mốc: chuyển lộ trình OKR
  (bản chụp PR crm #223) sang JSON, khai `lo_trinh.tep`, thêm `LO-TRINH.html` vào `t1_skip_globs`.

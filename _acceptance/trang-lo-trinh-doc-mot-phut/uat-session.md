---
schema_version: 1
slug: trang-lo-trinh-doc-mot-phut
feature: Trang lộ trình đọc trong một phút — màn đầu trả lời làm gì tiếp, kẹt gì, lệch gì; hàng đã giao và hồ sơ ngoài lộ trình gập lại; đọc được trên điện thoại
owner: phanlemanh@gmail.com
stage: scheduled
verdict:
decided_by:
decided_at:
---

## Ngưỡng đã khai tại Cổng Đáng (CHÉP NGUYÊN VĂN — cấm sửa sau khi thấy số)

- Câu hỏi phép đo trả lời: trên lộ trình thật của crm, màn đầu của trang (không cuộn) có trả lời được làm gì tiếp, kẹt gì, lệch gì cho từng lộ trình không?
- Kết quả nào là SỐNG: ở 1440 và 375, màn đầu chứa hàng kế, số cờ và mốc gần nhất của cả hai lộ trình crm; trang ngắn ≤ 1/3 chiều dài hiện tại (≤ 3.900 px ở 1440); 0 lỗi đo được ở bảng audit (tương phản, vùng bấm, thứ bậc tiêu đề, cuộn ngang); kho không khai giữ từng byte.
- Kết quả nào là CHẾT: màn đầu vẫn thiếu một trong ba câu ở bất kỳ khổ nào, hoặc trang mất tính tất định (`--check` đỏ khi không đổi dữ liệu), hoặc kho không khai đổi bản đồ/thẻ.
- Timebox: một vòng T2, trần ba lượt chấm; đọc ngưỡng trên bản sao crm trước mốc kế.

Điều kiện «sản phẩm thật chạy sau flag»: ⚠ chưa lái-thử — hồ sơ không có `stranger-drive.md`; điều
kiện là lời khai. Sản phẩm ở đây là trang lộ trình của kit (bộ vẽ ở nhánh chính `e48f6968`, PR #260),
vẽ trên bản sao crm `onehub` mới nhất (`0b8540c16`) — chưa vào crm vì crm chỉ nhận kit theo mốc
phát hành.

## Người dự

| Tên | Vai | Đại diện cho ai |
|---|---|---|
| Phan Le Manh | chủ kho crm, ngồi phiên điều phối | người đọc trang lộ trình mỗi sáng — người dùng cuối của tính năng |

## Chấm kín (thu TRƯỚC mọi thảo luận chung)

Câu gợi cho người dự (máy dọn bàn, người chấm): mở ảnh màn đầu trang crm ở
`evidence/uat/crm-moi--1440--light.png` và `crm-moi--375--light.png` — trong một phút, mỗi lộ trình
làm gì tiếp, kẹt gì, lệch gì?

| Người | Điểm/nhận xét kín | Sẽ gửi cho khách nào, khi nào |
|---|---|---|
| Phan Le Manh | không chấm tay — mọi vế ngưỡng kiểm được bằng máy (khối dưới), theo nếp owner đặt 03/10 «sao không ghi log mà cần phải hỏi tôi?» | |

### Kiểm bằng máy (mọi vế đều có căn cứ trong hồ sơ)

Nguồn: bản sao `_acceptance/` + `docs/plan/lo-trinh-*.json` của crm `onehub` `0b8540c16` (fetch
04/10); trang mới vẽ bằng `scripts/product-map.mjs` của nhánh chính kit `e48f6968`; trang cũ là
`LO-TRINH.html` crm đang commit (bộ vẽ 2.21.0). Đo trên Chrome thật bằng
`tests/scripts/lo-trinh-do-trang.mjs`, ngày đóng băng 2026-10-03, sáng và tối. Số từng ô:
`evidence/uat/do.jsonl`.

| Vế | Căn cứ máy đọc | Kết luận |
|---|---|---|
| Màn đầu 1440 có hàng kế, số chỗ cần sửa, mốc gần nhất của cả hai lộ trình | đáy ba dòng thẻ ≤ 900 ở cả hai thẻ, sáng và tối | có |
| Màn đầu 375 có đủ ba điều của cả hai lộ trình | đáy ba dòng thẻ ≤ 812 ở cả hai thẻ, sáng và tối | có |
| Trang ≤ 1/3 chiều dài hiện tại (≤ 3.900 px ở 1440) | 2.879 px / 11.587 px = 24,8 % | đạt |
| Tương phản | thấp nhất 6,35 (sáng) · 6,64 (tối); trang cũ 1,91 ở tối | đạt |
| Vùng bấm | nút đứng riêng thấp nhất 44 px | đạt |
| Thứ bậc tiêu đề | h1 26 > h2 18 > h3 16; trang cũ ngược | đạt |
| Cuộn ngang | không tràn ở 1440 và 375 | đạt |
| Tất định | vẽ lại giống từng byte; `--check` xanh trên bản sao crm | đạt |
| Kho không khai giữ từng byte | LT-01, LT-80 xanh ở CI run 37159410508; `product-map --check` của chính kit (không khai) xanh | đạt |

## Thảo luận sau khi đã chấm

## Số đo thật đặt cạnh ngưỡng

| Thước | Ngưỡng đã khai | Số đo được | SỐNG/CHẾT |
|---|---|---|---|
| Màn đầu đủ ba điều | ở 1440 và 375, cả hai lộ trình | đủ ở cả bốn ô (2 khổ × sáng/tối) | SỐNG |
| Độ dài | ≤ 1/3, ≤ 3.900 px ở 1440 | 2.879 px (24,8 %) | SỐNG |
| Lỗi đo được ở bảng audit | 0 | 0 (tương phản 6,35 · vùng bấm 44 · tiêu đề đúng bậc · không cuộn ngang) | SỐNG |
| Tất định | `--check` không đỏ khi dữ liệu không đổi | xanh, vẽ lại cùng byte | SỐNG |
| Kho không khai | giữ từng byte | giữ (LT-01, LT-80) | SỐNG |

## Quyết định Cổng Giá trị

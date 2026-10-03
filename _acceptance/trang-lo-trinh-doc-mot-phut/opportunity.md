---
schema_version: 1
slug: trang-lo-trinh-doc-mot-phut
feature: Trang lộ trình đọc trong một phút — màn đầu trả lời làm gì tiếp, kẹt gì, lệch gì; hàng đã giao và hồ sơ ngoài lộ trình gập lại; đọc được trên điện thoại
owner: phanlemanh@gmail.com
stage: discovery              # discovery | decided | archived
decision:         # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: 
decided_at:     # ISO UTC
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
---

> Mở 03/10 sau khi crm nhận kit 2.21.0 (crm-onehub#236, #237): owner mở trang lộ trình mới ở phiên
> crm «Acceptance gate start» và nhận xét «UX/UI đang không được tốt lắm». Owner chọn giữ trang HTML
> tĩnh trong kho làm bản gốc (artifact chỉ là bản chiếu, bước sau, bật theo từng kho).

## Vấn đề & ai gặp

Gốc: crm/_acceptance/cap-nhat-tuan-okr — lượt 4 OKR: 23/48 tin owner là hỏi tiến độ; trang lộ trình là chỗ trả lời câu đó, và lần mở thật đầu tiên trên crm (03/10) owner thấy trang không đọc được nhanh.

Người gặp: owner ở phiên điều phối crm (đọc mỗi sáng) và phiên máy chọn việc kế. Việc của trang: trả
lời trong một phút **làm gì tiếp · kẹt gì · lệch gì**. Audit 03/10 trên `LO-TRINH.html` của crm
`onehub` (`a1ba0de3`), đo ở 1440 và 375, giao diện tối:

- **55 % chiều dài trang là danh sách hồ sơ không liên quan, lặp hai lần**: «Vòng ngoài lộ trình» liệt 132
  hồ sơ ở CẢ mục OKR lẫn mục Kho tài liệu (6.400 / 11.587 px).
- **Thứ bậc tiêu đề ngược**: tên lộ trình 16 px nhỏ hơn mục con 17,55 px (bước hạ bậc ở trang nhiều lộ
  trình không có kiểu chữ cho cấp mới).
- **Liên kết mục lục 1,91 : 1** trên nền tối (cần ≥ 4,5), vùng bấm cao 18 px (cần ≥ 44).
- **Cờ ở đáy mỗi mục** (y = 6.834 px ở OKR), cách bảng cả màn hình.
- **Điện thoại**: cột câu giao 95 px, bảng cuộn ngang, trang dài 19.881 px.
- **Cột trống trên mọi hàng** («Vì sao» rỗng 43/43), mục «Đã bác» rỗng vẫn in; 28/43 hàng đã giao lẫn
  ngang hàng với 15 hàng còn mở; bảng 32 hàng không có tiêu đề cột dính.
- **Chữ nội bộ của kit lọt ra mặt người**: «Hàng sống qua Cổng Đáng 15/15», «tin theo lời», «Đứng trên».
- **Màn đầu là lời giải thích kỹ thuật**, hàng kế ở y = 324 và chỉ của một lộ trình; mốc là danh sách
  ngày, không «còn N ngày», không đánh dấu 11/16 mốc chưa gắn hàng.

Cần giữ: trạng thái suy từ hồ sơ, cờ trong ô từng hàng, hộp hàng kế có lý do, trang tất định (`--check`
so byte), bảng màu sáng/tối đã đạt tương phản ở các cặp chữ chính.

## Giả định chốt sinh tử

| # | Giả định | Nếu sai thì | Phép thử rẻ nhất | Trạng thái |
|---|---|---|---|---|
| 1 | Một khối đầu trang mỗi lộ trình (hàng kế · cờ · mốc gần nhất · tiến độ) đủ trả lời ba câu mà không cần cuộn | owner vẫn phải đọc bảng để biết việc kế | dựng trang trên bản sao crm, chụp màn đầu ở 1440 và 375, đếm ba câu có trên màn đầu không | Chưa thử |
| 2 | Gập hàng đã giao và hồ sơ ngoài lộ trình bằng phần tử HTML gốc (không JavaScript) giữ trang tất định | `--check` so byte đỏ chập chờn | vẽ hai lần, so byte | Chưa thử |
| 3 | Kho không khai lộ trình vẫn không đổi gì; kho một lộ trình nhận giao diện mới mà không phải đổi dữ liệu | kho đang dùng phải sửa tệp ý định | chạy bộ vẽ trên bản sao radar/oneflow (không khai) và crm (khai) | Chưa thử |

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] trên lộ trình thật của crm, màn đầu của trang (không cuộn) có trả lời được làm gì tiếp, kẹt gì, lệch gì cho từng lộ trình không?
- Kết quả nào là SỐNG: [đề xuất] ở 1440 và 375, màn đầu chứa hàng kế, số cờ và mốc gần nhất của cả hai lộ trình crm; trang ngắn ≤ 1/3 chiều dài hiện tại (≤ 3.900 px ở 1440); 0 lỗi đo được ở bảng audit (tương phản, vùng bấm, thứ bậc tiêu đề, cuộn ngang); kho không khai giữ từng byte.
- Kết quả nào là CHẾT: [đề xuất] màn đầu vẫn thiếu một trong ba câu ở bất kỳ khổ nào, hoặc trang mất tính tất định (`--check` đỏ khi không đổi dữ liệu), hoặc kho không khai đổi bản đồ/thẻ.
- Timebox: [đề xuất] một vòng T2, trần ba lượt chấm; đọc ngưỡng trên bản sao crm trước mốc kế.

## Kết quả prototype

Chưa dựng. Số đo nền là bảng audit 03/10 ở mục «Vấn đề & ai gặp».

## Nguồn ngoài & phạm vi kế thừa

| Món vật liệu | Nguồn (đường dẫn/tên gói) | Phân loại | Kế thừa? | Người ký |
|---|---|---|---|---|
| Bộ vẽ trang lộ trình | kit `scripts/lo-trinh.mjs` (2.21.0) | triết-lý/logic | có — sửa tại chỗ | — |
| Dữ liệu đo | crm `onehub` `a1ba0de3`: `_acceptance/` + `docs/plan/lo-trinh-*.json` | dữ liệu thật | có — làm bản sao đo | — |
| Trang theo dõi dựng tay cũ của crm (đã gỡ ở #237) | crm `docs/plan/lo-trinh-okr.html` (lịch sử git) | ngôn-ngữ-thiết-kế/hình-thái | không — chuẩn của kit thắng | — |

## Cổng 0

- **decision = …**
- **disposition = …**
- **Ngưỡng UAT chốt cùng lúc ký:** …

## Out of scope từ khám phá

- Không live artifact đọc dữ liệu (owner chọn 03/10: trang tĩnh là bản gốc).
- Không phát hành trang lên claude.ai trong vòng này — bản chiếu artifact là bước sau, bật theo từng kho.
- Không đổi khuôn tệp ý định (không thêm trường bắt buộc); không lát 2.

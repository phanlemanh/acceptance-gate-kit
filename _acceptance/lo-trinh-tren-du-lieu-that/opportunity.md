---
schema_version: 1
slug: lo-trinh-tren-du-lieu-that
feature: Lộ trình chạy được trên dữ liệu thật của crm — hàng kế đúng, cờ không nhiễu, nhiều lộ trình mỗi kho, mở việc từ hàng qua Cổng Đáng, liên kết hai chiều hàng ↔ hồ sơ, đường vào trang từ /start
owner: phanlemanh@gmail.com
stage: discovery              # discovery | decided | archived
decision:         # build | iterate | park | kill — người ký Cổng 0 điền
decided_by:
decided_at:     # ISO UTC
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
---

> Mở 03/10 sau khi lát 1 (`_acceptance/viec-ke-theo-plan/`, PR #246 gộp `be391f5b`) chạy thử trên
> 156 hồ sơ thật của crm (nhánh `onehub` `9660bf6c`) với khối sáu trường rút từ lộ trình OKR. Owner
> yêu cầu khảo sát lại mọi tình huống chưa phủ trước khi mở; bảng khảo sát ở mục «Nguồn ngoài».
> Là vòng sửa của lát 1, chạy TRƯỚC khi cắt mốc cho crm nhận — lát 2 (skill cắt lượt) vẫn chưa mở.

## Vấn đề & ai gặp

Gốc: crm/_acceptance/cap-nhat-tuan-okr — lượt 4 OKR: 23/48 tin owner là hỏi tiến độ; lát 1 sinh ra để trả lời việc đó, và lần chạy thử trên hồ sơ thật của crm cho thấy nó chưa trả lời đúng.

Người gặp: owner ở phiên điều phối crm (đọc thẻ mỗi sáng) và mọi phiên vào kho ở bước nhận việc.
Chạy thử lát 1 trên hồ sơ thật của crm cho:

- **Hàng kế sai.** Hàng «1» khai slug `cay-to-chuc-co-nguoi` mà crm không có hồ sơ nào tên đó (hồ sơ
  thật: `cau-truc-to-chuc`, `to-chuc-danh-sach-chi-tiet`); hàng tự khai «đã lên onehub», máy im và
  đưa nó lên làm hàng kế. Gốc lỗi: luật «slug chưa có hồ sơ thì không cờ» chốt ở S4 vòng 1 của lát 1.
- **11/18 cờ là nhiễu.** «đã lên onehub» ứng với cả «Đã giao» lẫn «Đã giao — chờ phiên nghiệm thu»;
  kit so lời khai với hồ sơ đúng từng chữ tên ô thay vì theo nhóm (đã giao · đang làm · chưa làm).
- **Khảo sát hành trình người dùng (03/10) — chỗ chưa phủ, đã đối chiếu lệnh thật:**
  1. Vào trang từ `/acceptance-gate:start`: thẻ chỉ nói «xem LO-TRINH.html» khi có cờ, không có
     đường mở bấm được (trái luật «lệnh in ra phải bấm được»); không cờ thì không nhắc tới trang.
     `PRODUCT-MAP.md` cũng không trỏ sang trang.
  2. Mở việc từ hàng kế: ba lối «bắt đầu việc mới» của `/start` không có lối này; feature-loop S0
     nhận mã hàng thì đi thẳng vào thiết kế, BỎ Cổng Đáng, và `bat_khi` của hàng không thành ngưỡng
     của ô cơ hội — trong khi mọi vòng của crm đều qua Cổng Đáng.
  3. Liên kết hàng ↔ hồ sơ chỉ một chiều (`slug` của hàng): hồ sơ không ghi mã hàng, nên slug sai
     hay đổi tên thì không bên nào biết — đúng ca hàng «1».
  4. Nhiều lộ trình mỗi kho: crm có 5 tài liệu lộ trình (OKR · Kho tài liệu · Zalo · Trợ lý OKR ·
     Điều phối 30 ngày); ổ cắm nhận MỘT tệp.
  5. Kho khai lộ trình mà chưa bật bản đồ: bốn lệnh đóng cổng bỏ qua bước vẽ lại, trang không bao
     giờ cập nhật và không ai biết.
  6. Mốc của crm không gắn mã hàng nên dòng «hàng trễ» luôn rỗng (dữ liệu của kho, kit chỉ có thể
     nhắc).
  7. Sửa tệp ý định bằng PR làm trang lệch và CI đỏ cho tới khi chạy lệnh vẽ lại — thông điệp đã chỉ
     lệnh; giữ nguyên, ghi vào hướng dẫn.

## Giả định chốt sinh tử

| # | Giả định | Nếu sai thì | Phép thử rẻ nhất | Trạng thái |
|---|---|---|---|---|
| 1 | So lời khai theo NHÓM trạng thái (đã giao · đang làm · chưa làm) cộng cờ «tự khai đã giao mà không có hồ sơ» đưa số cờ trên crm OKR về chỉ còn lệch thật | cờ vẫn nhiễu, owner bỏ qua mọi cờ | chạy lại bộ đọc trên bản sao hồ sơ crm `onehub`, đếm cờ trước/sau, phân loại từng cờ thật/nhiễu bằng tay | Chưa thử |
| 2 | Ghi mã hàng vào ô cơ hội lúc mở việc từ hàng (trường `lo_trinh_ma`) đủ để nối hai chiều mà không bắt kho sửa hồ sơ cũ | hồ sơ cũ mất liên kết, cờ giả | đọc 27 hàng có slug của crm: bao nhiêu hồ sơ đã tồn tại khớp, bao nhiêu cần trường mới | Chưa thử |
| 3 | Mở việc từ hàng đi qua Cổng Đáng (dựng ô cơ hội từ câu giao + vì sao + `bat_khi` làm ngưỡng đề xuất) không thêm lượt gọi người | thêm một lượt gọi mỗi vòng | đếm lượt gọi người của vòng S0→Cổng Đáng trên một hàng thử | Chưa thử |
| 4 | Nhiều tệp lộ trình mỗi kho (khoá nhận danh sách) giữ đúng hành vi một tệp và kho không khai vẫn im | kho một tệp đổi thẻ/đổi trang | chạy bộ đọc trên kho một tệp trước/sau, so byte | Chưa thử |

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] *trên lộ trình OKR thật của crm, thẻ start có chỉ đúng hàng kế và cờ chỉ còn lệch thật không?*
- Kết quả nào là SỐNG: [đề xuất] trên bản sao hồ sơ crm `onehub` · hàng kế là một hàng thật sự chưa giao · 0 cờ nhiễu (mỗi cờ còn lại được owner xác nhận là lệch thật) · mở hàng kế từ /start ra ô cơ hội có ngưỡng đề xuất lấy từ `bat_khi`, không thêm lượt gọi người.
- Kết quả nào là CHẾT: [đề xuất] hàng kế vẫn là hàng đã giao, hoặc còn ≥ 3 cờ nhiễu trên lộ trình OKR, hoặc kho không khai đổi thẻ/đổi trang.
- Timebox: [đề xuất] một vòng T2, trần ba lượt chấm; đọc ngưỡng ngay trên bản sao crm trước khi cắt mốc 2.21.0.

## Kết quả prototype

Chưa dựng. Bản chạy thử: bộ đọc lát 1 trên bản sao `_acceptance/` của crm `onehub` (03/10) — 32 hàng:
10 Đã giao · 13 Đã giao, chờ nghiệm thu · 9 Chưa mở; 18 cờ (4 thiếu câu giao · 1 mã trùng · 11 nhiễu ·
2 lệch thật: 9c, D).

## Nguồn ngoài & phạm vi kế thừa

| Món vật liệu | Nguồn (đường dẫn/tên gói) | Phân loại | Kế thừa? | Người ký |
|---|---|---|---|---|
| Bộ đọc, trang, thẻ, khối MAP-STAGE | kit `scripts/lo-trinh.mjs`, `commands/start.md`, bốn thân đóng cổng (lát 1) | vật đã ký | có — sửa tại chỗ | — |
| Dữ liệu chạy thử | crm `onehub` `9660bf6c`: `_acceptance/` + `docs/plan/lo-trinh-okr.data.js` | dữ liệu thật | có — làm fixture so sánh | — |
| Bộ chuyển `data.js` → JSON | scratchpad lát 1 (chưa commit) | công cụ | cân nhắc — đưa thành ví dụ trong GUIDE, không thành lệnh | — |

## Cổng 0

- **decision = …** Đề xuất `build` T2, năm món: (1) so lời khai theo nhóm + cờ «tự khai đã giao mà không có hồ sơ» (hàng đó không bao giờ là hàng kế); (2) lối «mở hàng kế» trong /start và feature-loop S0 nhận mã hàng: chưa có hồ sơ → dựng ô cơ hội từ hàng (ngưỡng đề xuất từ `bat_khi`, ghi `lo_trinh_ma`) rồi chờ Cổng Đáng; (3) nối hai chiều hàng ↔ hồ sơ qua `lo_trinh_ma`, cờ khi lệch; (4) khoá `lo_trinh.tep` nhận danh sách tệp, trang và thẻ theo từng lộ trình; (5) thẻ start luôn in đường mở trang bấm được, bản đồ trỏ sang trang, cờ khi kho khai lộ trình mà chưa bật bản đồ. KHÔNG thêm lệnh mới — mọi đường vào đi qua `/start`, bản đồ và feature-loop.
- **disposition = …**
- **Ngưỡng UAT chốt cùng lúc ký:** ngưỡng SỐNG ở trên, đọc trên bản sao crm trước khi cắt mốc 2.21.0.

## Out of scope từ khám phá

- Không thêm lệnh thứ chín cho lộ trình; không để kit ghi vào tệp ý định (giữ luật lát 1).
- Không skill cắt lượt (lát 2), không băng chống trôi, không nấc CRM.
- Không tự gắn mốc với hàng thay kho (khảo sát mục 6) — chỉ nhắc khi mốc không gắn hàng nào.
- Không đổi hành vi «sửa tệp ý định → CI đỏ tới khi vẽ lại» (khảo sát mục 7) — chỉ ghi hướng dẫn.

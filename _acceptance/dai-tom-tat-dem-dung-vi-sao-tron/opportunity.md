---
schema_version: 1
slug: dai-tom-tat-dem-dung-vi-sao-tron
feature: Ô «chưa làm gì» của dải tóm tắt in đúng số giới hạn đã biết ở mọi hình dạng khối gặp thật trên sáu kho — đầu đoạn bọc dòng, đoạn dẫn trước danh sách, danh sách đánh số, gạch tự mở bằng «known-limits», «None.» — và nói «chưa đọc được» thay vì in số khi khối không theo khuôn; trang hồ sơ đầy đủ hiện trọn mục «Vì sao làm», trần 400 ký tự chỉ áp cho dải một phút
owner: phanlemanh@gmail.com
stage: discovery            # discovery | decided | archived
decision:                   # build | iterate | park | kill — người ký Cổng 0 điền
decided_by:
decided_at:                 # ISO UTC
prototype:
  base_commit:
  disposition: archive
---

> Vòng SỬA mở 12/10 từ hai mục «mở hợp đồng mới» chủ kho ký ở Cổng Bằng chứng vòng `dai-tom-tat-doc-dung`
> (sửa ba ô dải tóm tắt X2). Hạt giống: `docs/plans/2026-10-12-hat-giong-dai-tom-tat-sau-x2s.md` (mục 1, 2).
> Dựng trên nhánh `vong/dai-tom-tat-doc-dung` (cùng tệp); gộp NGAY SAU vòng ấy, cùng mốc phát hành.

## Vấn đề & ai gặp

Gốc: acceptance-gate-kit/_acceptance/dai-tom-tat-doc-dung — `review-findings.md` Ngoài-8 và Ngoài-9; chủ kho định đoạt «mở hợp đồng mới» ở dòng sổ `d-20261012T033640Z-15` (câu gộp ký Cổng Bằng chứng 12/10)

**Ai gặp:** chủ kho đọc trang Lộ trình (crm hiện nguyên chữ dải ở ngăn hồ sơ của vòng LT1b) và người mở trang
hồ sơ một việc ở mọi kho cài kit — họ dựa vào ô «chưa làm gì» để biết việc đã giao còn mang bao nhiêu giới hạn
người đã chấp nhận, và vào mục «Vì sao làm» để đọc lại lý do trọn vẹn.

1. **Ngoài-8 — ô «chưa làm gì» in sai số giới hạn ở 86 / 661 hồ sơ thật** (đo 12/10 trên sáu kho, bảng từng hồ
   sơ ở `do-truoc.md`). Bốn cơ chế: (1) khối giới hạn mở bằng một đoạn bọc nhiều dòng hoặc có đoạn dẫn → bộ đọc
   đếm tiêu đề là 1 và bỏ cả danh sách (`kit/card-text-fidelity` hiện 1, khối có 6 mục); (2) gạch trong khối tự
   mở bằng «known-limit(s)» → đếm hai lần (`crm/toan-canh-okr` hiện 28, có 14); (3) báo cáo viết danh sách đánh
   số → nối thành một mục (`kit/release-2-20-0` hiện 1, có 7); (4) khối có tiêu đề con hay nhiều nhóm → số ngẫu
   nhiên (`crm/auto-pr-thoi-do-o-ban-re` hiện 63, đoạn dẫn nói «Mười một»). Khối chỉ ghi «None.» hôm nay 0 hồ
   sơ dính — bảo hiểm.
2. **Ngoài-9 — hồi quy của chính vòng `dai-tom-tat-doc-dung`:** trần 400 ký tự của ô «vì sao» (đúng cho dải và
   khối) cũng áp lên mục gập «Vì sao làm» của trang hồ sơ đầy đủ vì hai bộ vẽ dùng chung một giá trị. Trước vòng
   ấy mục gập hiện trọn đoạn. **301** hồ sơ trên sáu kho có «Vì sao» dài hơn 400 ký tự — trang đầy đủ của chúng
   sẽ mất chữ khi mốc mang vòng ấy tới kho. Vòng ấy chưa lên `main`: gộp vòng này ngay sau nó, cùng mốc, thì hồi
   quy không tới kho tiêu thụ nào.

## Giả định chốt sinh tử

| # | Giả định | Nếu sai thì | Phép thử rẻ nhất | Trạng thái |
|---|---|---|---|---|
| 1 | Một bộ đọc khối chung cho đầu đoạn ở `## Notes` và mục `## Known limits` của báo cáo sửa được cả bốn cơ chế mà không đổi chữ ở hồ sơ đang đúng | đổi số ở hồ sơ đang đúng của kho khác (luật 26/09) | vi phân cũ↔mới trên sáu kho, soi tay từng ca đổi theo cơ chế | **Đã thử 12/10 (bản thử, `do-truoc-ban-thu.diff`):** 91 đổi / 661, mọi ca đổi số rơi vào bốn cơ chế; 570 hồ sơ giữ nguyên chữ |
| 2 | «chưa đọc được» là câu đúng hơn số đang in ở hồ sơ cơ chế 4 | người đọc mất một con số vẫn dùng được | soi tay các ca cơ chế 4: số hôm nay có khớp danh sách không | **Đã thử một phần:** 6 ca soi, cả 6 số hôm nay sai (63 so 11 · 26 so 3 · 2 so 15 …) |
| 3 | Tách bản đầy đủ khỏi bản có trần trong cùng một lần đọc hồ sơ, không đổi khuôn khối dữ liệu lộ trình | khối đổi khuôn → mọi kho đọc khối phải theo | dựng khối trước/sau, so tập khoá và kiểu | Chưa thử — đo ở S4 |

## Ngưỡng chết / ngưỡng UAT

Việc nền của bộ công cụ, đo bằng máy trên dữ liệu thật của kho tiêu thụ — không vế nào cần người xác nhận.

- Câu hỏi phép đo trả lời: [đề xuất] sau khi crm nhận mốc mang vòng này, ô «chưa làm gì» của mọi hồ sơ crm có in số khớp danh sách giới hạn của khối — hoặc nói «chưa đọc được» — và trang hồ sơ đầy đủ có hiện trọn «Vì sao làm» không?
- Kết quả nào là SỐNG: [đề xuất] chạy lại đúng phép đo của `do-truoc.md` trên crm đã nhận mốc: 0 hồ sơ cơ chế 1–3 còn số sai, mọi hồ sơ cơ chế 4 nói «chưa đọc được», hồ sơ không dính cơ chế nào giữ nguyên chữ ô; mọi trang hồ sơ đầy đủ có «Vì sao» quá 400 ký tự chứa trọn câu cuối của đoạn
- Kết quả nào là CHẾT: [đề xuất] một hồ sơ crm in số giới hạn khác số mục của khối mà không nói «chưa đọc được», hoặc một trang hồ sơ đầy đủ cắt «Vì sao làm»
- Timebox: [đề xuất] lần vẽ lại đầu tiên của crm sau khi nhận mốc chứa vòng này (crm nhận mốc từ 15/10); trễ nhất 2026-11-01

## Kết quả prototype

Bản thử bộ đọc dựng trong scratchpad, KHÔNG vào cây: `do-truoc-ban-thu.diff` (so với nhánh vòng trước) + bảng
từng hồ sơ ở `do-truoc.md`. Nó là căn cứ đo, không phải vật — vật dựng lại ở S3 theo hợp đồng.

| Kho | Hồ sơ | Số sai → số đúng | Sai → «chưa đọc được» | Chỉ bỏ cờ vàng thừa |
|---|---|---|---|---|
| kit | 140 | 27 | 6 | 2 |
| crm | 229 | 18 | 3 | 0 |
| radar | 36 | 15 | 3 | 3 |
| oneflow | 41 | 5 | 5 | 0 |
| artifact-platform | 192 | 0 | 0 | 0 |
| media-library | 23 | 3 | 1 | 0 |

## Nguồn ngoài & phạm vi kế thừa

Không có vật liệu ngoài kho — căn cứ là hồ sơ `dai-tom-tat-doc-dung`, hạt giống mục 1–2 và hồ sơ đã ký của sáu kho
(đọc, không ghi).

## Cổng 0

- **decision = …** Căn cứ: …
- **disposition = archive** Căn cứ: bản thử chỉ là căn cứ đo, không giữ.
- **Ngưỡng UAT chốt cùng lúc ký:** …

## Thước đo thành công → ứng viên criterion

- Ma trận hình dạng khối viết sẵn — bốn cơ chế, «None.», giới hạn thật mở bằng «không có», khối mẫu
  `KNOWN-LIMITS-NOTE` — mỗi ca đúng số → AC (ma trận toàn phần, chiều đỏ từng cơ chế).
- Vi phân trên bản sao thật ghim mã (crm + kit): tập hồ sơ đổi ô đúng bằng tập đã soi; hồ sơ còn lại giữ nguyên
  từng chữ → AC.
- Khối không đọc được → ô nói «chưa đọc được», không in số; mục giới hạn của trang hồ sơ không liệt danh sách
  sai → AC.
- Trang hồ sơ đầy đủ: «Vì sao» quá 400 ký tự chứa trọn câu cuối; dải và khối vẫn ≤ 400; khuôn khối không đổi → AC.

## Out of scope từ khám phá

- Đọc số bằng chữ trong lời văn («Mười một giới hạn») — kit đếm mục của danh sách, không hiểu câu.
- Đề nghị LT1b thêm danh sách tiêu chí và câu giới hạn vào khối dữ liệu (hạt giống mục 3) — đổi khuôn khối, chờ neo riêng.
- Sửa hồ sơ ở kho tiêu thụ cho đọc được — vật của kho tự lo (luật 26/09, thứ tự nghiệm); kit chỉ nói «chưa đọc được».
- Ngoài-1, Ngoài-2 của vòng trước (đếm phần «để ngoài phạm vi» viết bằng bảng / dấu sao) — đã ký Known limits, 0 hồ sơ thật dính.

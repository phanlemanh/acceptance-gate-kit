---
schema_version: 1
slug: ho-so-khep-thoi-hoi
feature: Hồ sơ đã khép (chấm bởi thực tế · đã nghỉ) thôi bị đối xử như đang mở — bộ đếm cửa veto, thẻ, làn V đọc đủ nguồn — và lớp CI vendored chép đủ hai tệp bản đồ
owner: phanlemanh@gmail.com
stage: held
verdict: iterate
decided_by: Phan Le Manh
decided_at: 2026-09-22T09:23:21Z
---

## Ngưỡng đã khai tại Cổng Đáng (CHÉP NGUYÊN VĂN — cấm sửa sau khi thấy số)

- Câu hỏi phép đo trả lời: Sau khi crm cài 2.18.1, hồ sơ đã khép có còn bị kit hỏi hay đếm như đang mở không, và kho có phải tự vá tệp nào không?
- Kết quả nào là SỐNG: NOTE cửa veto ở crm và kit không đếm hồ sơ `da-cham-boi-thuc-te`/`da-nghi`; thẻ của 15 hồ sơ nghỉ + 7 hồ sơ thực-tế in 0 ô hỏi; ca khai-lang tái lập (báo cáo rỗng mục, findings 2 mục) → làn V «không xanh-sạch», thẻ «ký hay trả»; crm cài bằng diff 2 tệp, CI xanh lượt đầu, 0 commit vá tay.
- Kết quả nào là CHẾT: một trong bốn vế trên đỏ sau khi cài; hoặc ≥ 1 hồ sơ đã ký đổi làn oan (giả định 2); hoặc vòng cần > 3 lượt gọi người.
- Timebox: 2026-09-29 — quá hạn mà crm chưa cài 2.18.1 thì chính việc ấy là tín hiệu.

| Số | Trước 22/09 | Ngưỡng UAT | Chết |
|---|---|---|---|
| hồ sơ đã khép trong NOTE cửa veto (kit + crm) | 1 + 1 | 0 | > 0 sau cài |
| ô hỏi trên thẻ hồ sơ đã khép (15 nghỉ + 7 thực-tế) | 22 | 0 | > 0 |
| ca khai-lang tái lập → làn V | xanh-sạch (sai) | «không xanh-sạch» | vẫn xanh-sạch |
| tệp crm phải tự vá khi cài | 2 | 0 | ≥ 1 |
| hồ sơ đã ký đổi làn oan | — | 0 | ≥ 1 |
| lượt gọi người của vòng (T2) | — | ≤ 3 | > 3 |

**Cờ vàng — chưa lái-thử:** hồ sơ không có `stranger-drive.md`. Vòng đổi engine, không có mặt
người dùng cuối để lái; điều kiện «sản phẩm chạy sau flag» là lời khai: crm đã cài 2.18.1 qua PR
crm #78 (commit gộp `960fdff0`, 22/09). Bốn phạm vi plugin ở máy crm vẫn là 2.18.0 — lớp CI
vendored là thứ đã đổi.

## Người dự

| Tên | Vai | Đại diện cho ai |
|---|---|---|
| Phan Le Manh | owner kit, người ký | owner ở Cổng Bằng chứng của kho tiêu thụ |
| phiên Claude Code cài 2.18.1 ở crm | người dùng của kit | chấm bằng vật: lượt CI đầu của PR crm #78, diff lớp CI |

## Chấm kín (thu TRƯỚC mọi thảo luận chung)

| Người | Điểm/nhận xét kín | Sẽ gửi cho khách nào, khi nào |
|---|---|---|
| Phan Le Manh | không ghi nhận xét riêng — ký một chạm theo khuyến nghị trên bảng số | không áp dụng: kho nhận (crm) đã cài |

## Thảo luận sau khi đã chấm

Không mở thảo luận: một người dự, ký một chạm.

## Số đo thật đặt cạnh ngưỡng

Đo 2026-09-22 bởi phiên tổng kết, sau khi crm cài 2.18.1 (`origin/onehub` `960fdff0`), bằng
engine kit `main`. Lệnh ở `docs/findings/2026-09-22-tong-ket-cach-moi-cua-so-2-18.md` §7.

| Thước | Ngưỡng đã khai | Số đo được | SỐNG/CHẾT |
|---|---|---|---|
| hồ sơ đã khép trong NOTE cửa veto (kit + crm) | 0 | **0 + 0** — kit: 7 hồ sơ đã khép mang `veto_state: mo` bị loại khỏi NOTE, còn 2 hồ sơ sống · crm (CI Acceptance trên `960fdff0`): NOTE chỉ còn `go-khoa-goc-nhin`, một hồ sơ `machine-cleared` còn sống; 7 hồ sơ đã khép in dòng «đã chấm bởi thực tế», không vào NOTE | SỐNG |
| ô hỏi trên thẻ hồ sơ đã khép | 0 | **kit 0 / 16** · **crm 2 / 7** — `cua-vao-noi-tieng-viet` và `tieng-viet-cho-crm` vẫn hỏi «duyệt hay sửa»: bằng chứng của chúng đã xếp lại (`evidence-report.xep-lai-2026-09-06.md`) nên bộ thẻ rơi về thẻ Cổng 1, và vá của vòng chỉ gỡ ô hỏi ở thẻ Cổng 2 | CHẾT (> 0) |
| ca khai-lang tái lập → làn V | «không xanh-sạch» | bản 2.18.1: «chưa đủ: review-findings.md có 2 mục ngoài hợp đồng chưa người định tuyến» (thoát 2) · đối chứng bản 2.18.0 (`41b949de`) trên cùng hồ sơ crm `3f30ce03`: «sẽ machine-cleared» (thoát 0) | SỐNG |
| tệp crm phải tự vá khi cài | 0 | **0** — 16/16 tệp lớp CI ở `onehub` trùng byte với kit `main`; `lib/out-of-contract.js` cũ đã xoá; không commit nào khác chạm `scripts/` hay `lib/` · nhưng vế «CI xanh lượt đầu» của dòng SỐNG **trượt**: lượt CI đầu của #78 (run 35706871126) ĐỎ, 2 vi phạm — `t1-escape` (PR đổi ba tệp vendored mà không kèm hồ sơ) và `quyen-luot-mang-theo` đổi làn. Lượt thứ hai xanh sau khi owner ký hồ sơ ấy và ghim lại nó; chính hồ sơ ký thêm làm `t1-escape` im | tệp vá: SỐNG · CI lượt đầu: CHẾT theo chữ |
| hồ sơ đã ký đổi làn oan | 0 | **0 oan** — kit: 0 trên 132 hồ sơ (chiều im của S4) · crm: 1 hồ sơ `machine-cleared` đổi làn (`quyen-luot-mang-theo`) vì một mục THẬT (Ngoài-6) chưa người định tuyến; cái giá: owner ký thêm một lượt lúc 08:53Z | SỐNG |
| lượt gọi người của vòng | ≤ 3 | **4 trong thiết kế** (Đáng · Phạm vi gộp 1.5 · Bằng chứng trả lại · Bằng chứng ký), mỗi lượt 1 chạm · 0 câu máy hỏi ngoài thiết kế · 5 lượt (7 tin) người gửi «Try again»/«Tiếp tục» khi API sập 01:07–01:41Z | CHẾT theo chữ ngưỡng (4 > 3). Vòng lên T3 ở Cổng Phạm vi và trần T3 là 4 — đọc theo trần nào là việc của người ký, phiên này không sửa ngưỡng |

## Quyết định Cổng Giá trị

> `release` = giao rộng · `iterate` = giữ giả định, sửa rồi đo lại · `kill` = dừng.
> **Giết ở đây là THÀNH CÔNG của quy trình.**

- **verdict = iterate** (Phan Le Manh, một chạm, 2026-09-22T09:23:21Z). Căn cứ: bốn vế SỐNG; hai vế CHẾT — thẻ hồ sơ khép ở crm còn 2/7 ô hỏi (nhánh Cổng 1), CI lượt đầu của PR cài ĐỎ; hàng lượt gọi người 4 so ngưỡng 3.
- Bước kế: mở vòng kế bằng `/feature-loop:feature-loop <mô tả>` — hồ sơ mới, ô cơ hội giữ nguyên với `decision: iterate`. Theo luật chiều rộng (b), vòng kế chỉ mở khi owner gọi tên; căn cứ đã ở hạt giống `docs/plans/2026-09-22-hat-giong-the-cong-1-ho-so-khep-van-hoi.md`.

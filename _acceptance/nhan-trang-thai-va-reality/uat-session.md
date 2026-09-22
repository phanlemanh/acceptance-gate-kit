---
schema_version: 1
slug: nhan-trang-thai-va-reality
feature: Thẻ Cổng Bằng chứng gọi đúng tên cạnh gãy và mở ô ký kèm giá; reality có quyền đóng hồ sơ bằng thao tác cổng người thứ bảy; test của kho thôi bị đếm là thước
owner: phanlemanh@gmail.com
stage: held
verdict: release
decided_by: Phan Le Manh
decided_at: 2026-09-22T09:23:21Z
---

## Ngưỡng đã khai tại Cổng Đáng (CHÉP NGUYÊN VĂN — cấm sửa sau khi thấy số)

- Câu hỏi phép đo trả lời: Ba hồ sơ ở `crm` có đóng được hoặc chấm được bằng riêng bản 2.18.0, không dựng thêm một dòng thước nào?
- Kết quả nào là SỐNG: Sau khi `crm` cài 2.18.0 — hồ sơ tàng hình 0, PR crm #65 merge được, 0 lượt chấm `dieu-phoi` bị hạ tầng hay hệ thống đốt, hồ sơ mốc mang dòng `k / 3`.
- Kết quả nào là CHẾT: Sau khi cài vẫn còn hồ sơ tàng hình, hoặc #65 vẫn bị hồ sơ chặn, hoặc từ một lượt chấm trở lên bị đốt với lý do đã có nhãn, hoặc dòng M3 thiếu, hoặc N bằng 0.
- Timebox: 2026-09-28 — quá hạn mà `crm` chưa cài 2.18.0 thì chính việc số không về là tín hiệu.

| Số | Trước 21/09 | Ngưỡng UAT | Chết |
|---|---|---|---|
| hồ sơ `crm` tàng hình (`approved` + evidence đỏ + chữ ký rỗng) | 3 | 0 | > 0 sau rollout |
| PR crm #65 | CONFLICTING, chặn bởi hồ sơ tàng hình | merge | vẫn chặn vì hồ sơ |
| lượt chấm `dieu-phoi` bị hạ tầng/hệ thống đốt | 3 | 0 | ≥ 1 với lý do đã có nhãn |
| lượt gọi người ngoài thiết kế của vòng này | — | 0 (T3: ≤ 4 trong thiết kế) | > 4 |
| dòng M3 ở hồ sơ mốc 2.18.0 | không có | `k / 3` | thiếu hoặc N = 0 |
| thước / vật của chính vòng này (dòng diff) | — | ≤ 3 : 1 | > 5 : 1 |

**Cờ vàng — chưa lái-thử:** hồ sơ không có `stranger-drive.md`. Vòng đổi engine, không có
mặt người dùng cuối để lái; điều kiện «sản phẩm chạy sau flag» là lời khai: 2.18.0 đã cài ở
crm qua PR crm #70 (gộp 2026-09-21T15:15Z).

## Người dự

| Tên | Vai | Đại diện cho ai |
|---|---|---|
| Phan Le Manh | owner kit, người ký | owner ở Cổng Bằng chứng của kho tiêu thụ |
| phiên Claude Code ở crm (crm-A, crm-rollout) | người dùng của kit (khối ĐỊNH VỊ) | chấm bằng vật nó để lại: hồ sơ, sổ quyết định, run-log — không chấm bằng lời |

Không có người dùng đại diện ngoài đội: kit là engine, người dùng của nó là phiên máy và
owner. Đây là giới hạn của phiên, ghi thẳng.

## Chấm kín (thu TRƯỚC mọi thảo luận chung)

| Người | Điểm/nhận xét kín | Sẽ gửi cho khách nào, khi nào |
|---|---|---|
| Phan Le Manh | không ghi nhận xét riêng — ký một chạm theo khuyến nghị trên bảng số | không áp dụng: kho nhận (crm) đã cài |

## Thảo luận sau khi đã chấm

Không mở thảo luận: một người dự, ký một chạm.

## Số đo thật đặt cạnh ngưỡng

Đo 2026-09-22 bởi phiên tổng kết, lệnh ở `docs/findings/2026-09-22-tong-ket-cach-moi-cua-so-2-18.md` §7.

| Thước | Ngưỡng đã khai | Số đo được | SỐNG/CHẾT |
|---|---|---|---|
| hồ sơ crm tàng hình | 0 | **0** — `origin/onehub` `cca1cf4b`: một hồ sơ `approved` còn lại (`thuoc-cua-lat-3a-co-rang`) không có bằng chứng đỏ và đã có chữ duyệt | SỐNG |
| PR crm #65 | merge | **đóng, không gộp** — chủ kho đóng 2026-09-21T22:52Z theo lối «cắt đuôi giữ lõi»; vật lên `onehub` qua PR crm #72 | KHÔNG PHÂN ĐỊNH — không «merge» như vế SỐNG, cũng không «bị hồ sơ chặn» như vế CHẾT; người đổi đường |
| lượt chấm `dieu-phoi` bị hạ tầng/hệ thống đốt | 0 | **0 sau cài** — ba lượt BLOCKED đều trước 2026-09-21T05:30Z; lượt chấm lại PASS 06:21Z; sau khi #70 gộp không lượt chấm `dieu-phoi` nào chạy nữa. Sáu vòng crm chấm sau cài: 0 lượt `BLOCKED` trong run-log | SỐNG (số 0 của `dieu-phoi` là «không còn lượt để đốt»; sáu vòng sau cài là số có nghĩa) |
| lượt gọi người ngoài thiết kế | 0 (≤ 4 trong thiết kế) | **4 trong thiết kế**, mỗi lượt 1 chạm · **0** câu máy hỏi ngoài thiết kế · **2 lượt** (3 tin) người phải gửi vì lượt chấm 1 kẹt ở harness («kiểm tra agent» ×2, «gỡ goal») | SỐNG nếu đếm theo hồ sơ mốc 2.18.0 (tin người tự gửi không là máy gọi); nếu đếm tin hạ tầng là lượt ngoài thiết kế thì 2 — dưới vế CHẾT (> 4), trên ngưỡng (0) |
| dòng M3 ở hồ sơ mốc 2.18.0 | `k / 3` | **thiếu** ở `_acceptance/release-2-18-0/contract.md` — chỉ có tên dòng ở tiêu chí (dòng 37), không có dòng số. Mốc kế 2.18.1 mang `0 / 8` | CHẾT theo chữ ngưỡng («thiếu»); đã có ở mốc kế |
| thước / vật của vòng | ≤ 3 : 1 | **1,6 : 1** — commit gộp #194: thước 1 087 dòng / vật 693 dòng (hồ sơ `_acceptance/` 1 133 dòng, không tính) | SỐNG |

**Một điều ngưỡng không hỏi mà số đo lộ ra** (không đổi ngưỡng, ghi để người ký thấy): dòng
hiệu chuẩn tự xưng «ĐẠT đã ký» nhưng bộ đếm tính MỌI hồ sơ có dòng quan sát prod. Trong N = 8:
3 hồ sơ ĐẠT có chữ ký người · 1 ĐẠT máy thông · **4 chưa từng có bằng chứng ĐẠT được ký**
(`cua-vao-noi-tieng-viet`, `tieng-viet-cho-crm`, `nhan-ung-dung-noi-tieng-viet` BLOCKED, kit
`release-2-0-0` PASS không chữ ký). Một trong bốn khai sẵn một chỗ đỏ ở prod ngay trong dòng quan
sát — bộ đếm k chỉ đọc dòng `revisit` ĐỨNG SAU nên không thấy. Hạt giống:
`docs/plans/2026-09-22-hat-giong-dong-hieu-chuan-dem-ho-so-chua-tung-dat.md`.

## Quyết định Cổng Giá trị

> `release` = giao rộng · `iterate` = giữ giả định, sửa rồi đo lại · `kill` = dừng.
> **Giết ở đây là THÀNH CÔNG của quy trình.**

- **verdict = release** (Phan Le Manh, một chạm, 2026-09-22T09:23:21Z). Căn cứ: bốn hàng SỐNG; hàng M3 CHẾT theo chữ ở hồ sơ mốc 2.18.0 và đã có ở mốc 2.18.1 (`0 / 8`); #65 người đổi đường. Lỗi định nghĩa N của dòng hiệu chuẩn đi hạt giống, không mở vòng.
- Bước kế: nghi thức phát hành của repo — engine đã ở 2.18.0/2.18.1 và crm đã cài; không còn việc phát hành riêng cho vòng này.

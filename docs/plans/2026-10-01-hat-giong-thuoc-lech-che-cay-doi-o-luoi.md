# Hạt giống — dòng «thước lệch» che dòng «cây đổi» khỏi lưới trước-merge và recheck

**Ngày:** 2026-10-01 · **Trạng thái:** hạt giống (SỔ, chưa là ô)
Gốc: acceptance-gate-kit/_acceptance/luot-cham-ghi-vao-cay/ — Ngoài-3 của lượt chấm 1
(review-findings.md), owner chọn «mở hợp đồng mới» ở Cổng Bằng chứng 01/10.

## Hình dạng

`canhGay` (lib/nhan-canh-gay.cjs) trả `lech` TRƯỚC khi xét dòng `cay-doi`; `luotKhongDungDuoc`
chỉ báo khi trạng thái là `cay-doi`. Lượt vừa đổi thước vừa đổi vật (thuoc-vat ghi hai dòng,
thoát 5) → lưới trước-merge và recheck cho qua. Thẻ Cổng Bằng chứng vẫn khoá nút ký ở ca này
(`lech` không ký được), nên lỗ chỉ mở khi người ký vượt thẻ. Cùng lỗ với «lưới trước-merge
không đọc thước lệch» đã khai ở Out of scope của hồ sơ gốc.

## Ý (chưa phải cam kết)

`luotKhongDungDuoc` tự tìm dòng `cay-doi` khớp lượt cuối (hoặc `canhGay` điền `cay` cả khi trả
`lech`); cân luôn việc lưới đọc `lech` như một lượt không dùng được.

## Ngưỡng mở

≥1 hồ sơ ký có lượt cuối mang cả hai dòng `thuoc-lech` và `cay-doi`.

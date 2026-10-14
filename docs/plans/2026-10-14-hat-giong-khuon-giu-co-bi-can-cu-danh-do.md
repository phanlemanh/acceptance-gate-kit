# Hạt giống — khuôn dòng «giữ cỡ» bị bộ xếp căn cứ đánh đỏ

**Ngày:** 2026-10-14 · **Trạng thái:** hạt giống (SỔ, chưa là ô) · **Loại:** sửa lỗi kit (TRỪ hoặc vá).
Gốc: `_acceptance/moc-la-chien-dich/` — dòng sổ `d-20261014T085934Z-9` (bị thay bởi `d-20261014T090005Z-10`).

## Chuyện đã xảy ra

Ở bước thiết kế của vòng `moc-la-chien-dich` (11 tiêu chí, cờ vàng cỡ), máy ghi dòng «giữ cỡ» ĐÚNG khuôn
`DEC-GIU-CO` của SKILL feature-loop: `can_cu.nguon = muc-tieu`, `tep = _acceptance/<slug>/contract.md`. Bộ xếp căn
cứ `scripts/can-cu-s1.cjs` xếp dòng đó ĐỎ với lý do «căn cứ trỏ vào vật của chính vòng» (`tu-bien-minh`). Hai vật
của kit nói ngược nhau: khuôn bảo trỏ hợp đồng, bộ xếp cấm trỏ hợp đồng. Thẻ Cổng Phạm vi sẽ in một dòng đỏ cho
một việc làm đúng hướng dẫn.

Máy lách bằng một dòng thay (`supersedes`) với nguồn `mot-loi` (luật chiều rộng (b)) — được vì vòng này có lý do
một-lối thật; vòng khác chưa chắc có.

## Hướng (chưa thiết kế)

Một trong hai: (a) khuôn `DEC-GIU-CO` đổi nguồn sang `mot-loi` với `loi_chet` = «tách thì …»; (b) bộ xếp nhận
`decision` mở đầu «giữ cỡ —» trỏ hợp đồng của chính hồ sơ như một ngoại lệ có tên. (a) là TRỪ một ngoại lệ, nên
rẻ hơn. Phép thử hai chiều: dòng giữ theo khuôn mới → xanh; dòng mục-tiêu trỏ hợp đồng không phải «giữ cỡ» → vẫn đỏ.

## Ngưỡng mở ô

≥ 1 vòng nữa có 11–13 tiêu chí ghi dòng giữ theo khuôn và gặp dòng đỏ này.

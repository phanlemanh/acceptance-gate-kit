# Hạt giống — `thuoc-vat --args` trỏ tệp không đọc được phải dừng có tên

**Ngày:** 2026-10-17 · **Trạng thái:** hạt giống (SỔ, chưa là ô)
Gốc: acceptance-gate-kit/_acceptance/cham-lai-khong-tu-doi/ — Ngoài-4, Ngoài-11 (lượt chấm 1–2), chủ kho chọn «mở hợp
đồng mới» ở Cổng Bằng chứng 17/10.

## Hình dạng

VA1 dạy máy, khi `thuoc-vat --write` thoát 2 «tệp args không thuộc lượt cuối», chạy lại kèm `--args <tệp>`. Nhánh
tường minh của `chonTepArgs` nuốt lỗi đọc/JSON và trả `argsTep: null` → in «hồ sơ đời cũ, bỏ qua so» cho cả thước lẫn
cây rồi thoát 0. Gõ sai đường dẫn là tắt im hai lưới (thước lệch · cây đổi). Hành vi này có từ trước VA1 (đường
`--args` cũ cũng đọc rồi bỏ qua im).

## Ý (chưa phải cam kết)

`--args` tường minh mà tệp vắng / không phải JSON → dừng mã 2 gọi tên tệp, không ghi byte nào (cùng khuôn ca (c) của
AC-6 VA1). Ca đỏ: đường sai, JSON hỏng; ca im: hồ sơ đời cũ không truyền cờ vẫn như cũ.

## Ngưỡng mở

≥ 1 lần trong run-log một kho có lượt chấm mà dòng «không có ảnh chụp thước» xuất hiện dù phiên đã truyền `--args` —
hoặc chủ kho gọi tên.

# Hạt giống — tác tử chấm lùi nhánh về commit cũ giữa lượt: kiểm «đã hoàn lại» cho qua

**Ngày:** 2026-10-01 · **Trạng thái:** hạt giống (SỔ, chưa là ô)
Gốc: acceptance-gate-kit/_acceptance/luot-cham-ghi-vao-cay/ — Ngoài-4 của lượt chấm 1
(review-findings.md), owner chọn «mở hợp đồng mới» ở Cổng Bằng chứng 01/10.

## Hình dạng

Tác tử chấm `git reset`/checkout HEAD về một tổ tiên trong lượt: `soCay` ghi các tệp với
`doi: commit` nhưng `commit: []` (`git log sha..HEAD` rỗng). Lượt sau, khối KIEM-HOAN-LAI của
s4-args không thấy commit nào còn trong HEAD và không thấy tệp bẩn → cho qua, ảnh chụp mới lấy
commit cũ làm mốc. Bản được chấm vẫn là bản trên nhánh; cái mất là commit đã rơi khỏi nhánh,
lặng lẽ.

## Ý (chưa phải cam kết)

Dòng `cay-doi` có tệp `doi: commit` mà `commit` rỗng → kiểm thêm HEAD so với `L.sha`; lệch thì
dừng có tên như «chưa hoàn lại», lối `--nhan-cay-moi` giữ nguyên.

## Ngưỡng mở

≥1 ca thật nhánh bị lùi trong lượt chấm (dòng `cay-doi` có tệp `commit` mà danh sách commit rỗng).

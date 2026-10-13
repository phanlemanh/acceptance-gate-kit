# Hạt giống — bộ soi luật sản phẩm đọc sai tên tệp có dấu hoặc dấu cách

Gốc: `_acceptance/bat-bien-san-pham/` (lượt chấm 2 ngày 13/10/2026, Cổng Bằng chứng ký 13/10 — Ngoài-4 và
Ngoài-8, owner: mở hợp đồng mới). Hạt giống là SỔ, không phải ô: mở thành ô khi có neo ngoài — một kho tiêu thụ
khai `PRODUCT-INVARIANTS.md` mà có tệp tên tiếng Việt có dấu hoặc có dấu cách nằm trong phạm vi một luật.

## Lỗ

`scripts/luat-san-pham.cjs` (`quet`) đọc tên tệp từ dòng `+++ b/<đường>` của `git diff`. Git bọc đường có
ký tự ngoài ASCII hoặc dấu cách trong nháy kép và thoát từng byte (`+++ "b/t\303\240i-li\341\273\207u.ts"`),
nên tên đọc ra không khớp tên thật. Hai chiều sai, cùng một gốc:

1. **Bỏ sót (Ngoài-4):** tệp sản phẩm tên có dấu thêm đúng dấu hiệu của một luật có `Phạm vi` → glob không
   khớp tên đã thoát → không có chạm → thẻ không nêu luật, hồ sơ có thể đi làn không người. Với kho tiếng Việt,
   luật khó-đảo lọt im.
2. **Báo nhầm (Ngoài-8):** tệp ghi chép trong `_acceptance/` tên có dấu → tên đã thoát bắt đầu bằng `"b/_acc…`,
   không khớp bộ loại `_acceptance/` → bị tính là chạm luật, chặn hồ sơ.

## Hướng

Chạy `git diff` với `-c core.quotePath=false` và đọc đường bằng `-z` / `--name-only -z` thay vì cắt dòng
`+++`; hoặc giải nháy theo đúng luật thoát của git. Kèm ca hai chiều trên cùng fixture do code sinh: tên có dấu
trong phạm vi → có chạm; tên có dấu trong `_acceptance/` → không chạm; đối chứng ASCII xanh trước.

Ngưỡng mở ô: kho tiêu thụ đầu tiên khai `PRODUCT-INVARIANTS.md` có tệp tên ngoài ASCII trong `Phạm vi` của
một luật có `Dấu hiệu`, hoặc ≥1 lần quan sát bỏ sót / báo nhầm ở kho tiêu thụ.

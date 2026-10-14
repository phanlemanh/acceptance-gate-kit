# Hạt giống — `kiem-ban-cai --may` ra ĐẠT nhờ một gói không đổi số

Gốc: `_acceptance/release-2-30-0/` — tệp `kiem-ban-cai-sau-tag.txt` (14/10, máy M5). Hạt giống là SỔ, không phải ô.

## Lỗ

`cheDoMay` (`scripts/kiem-ban-cai.mjs`) chỉ ra `TỔNG KẾT: ĐỎ` khi KHÔNG bản ghi nào mang số của thẻ; bản ghi khác số
chỉ in `VÀNG may: … — chưa nâng` và không chạm TỔNG KẾT. Mốc nào giữ nguyên số một gói (từ 2.29.0, `diagram-design`
`2.7.1`), thì máy chưa nâng ba gói chính vẫn ra `TỔNG KẾT: ĐẠT <n> bản ghi khớp` và thoát 0. Đo 14/10 trên máy M5 sau
thẻ v2.30.0: «ĐẠT 26 bản ghi khớp v2.30.0 · 81 bản ghi khác số (VÀNG)» — 26 bản ghi khớp đều là `diagram-design`, 0
bản ghi `acceptance-gate`/`feature-loop`/`dieu-phoi` mang 2.30.0. Ghi chú nhận của 2.29.0 và bản đầu của 2.30.0 dạy
đọc TỔNG KẾT (kèm câu sai «máy còn bản cũ chỉ in VÀNG mà TỔNG KẾT vẫn ĐỎ»); đã đính chính ở CHANGELOG 2.30.0 sau thẻ.

## Nghiệm đã nghĩ (chưa làm)

- TỔNG KẾT tính theo GÓI chứ không theo bản ghi: mỗi gói có trong chợ tại thẻ phải có ≥ 1 bản ghi mang số của thẻ,
  thiếu gói nào thì `TỔNG KẾT: ĐỎ — <gói> chưa có bản ghi nào mang <số>`. Ca đo: sổ cài giả lập có `diagram-design`
  khớp, ba gói chính khác số → ĐỎ gọi tên ba gói; chiều im: mọi gói có bản ghi khớp, còn bản ghi cũ ở cây phụ → ĐẠT
  kèm VÀNG như hôm nay.

## Ngưỡng mở ô

≥ 1 máy nhận đọc `TỔNG KẾT: ĐẠT` của `--may` là «đã nâng» trong khi ba gói chính còn số cũ (đếm ở crm#375 và kênh
kit #308).

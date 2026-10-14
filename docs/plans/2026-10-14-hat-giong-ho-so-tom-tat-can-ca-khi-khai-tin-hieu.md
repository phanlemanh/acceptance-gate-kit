# Hạt giống — `ho-so-tom-tat.cjs` cần cả khi kho chỉ khai `tin_hieu`

Gốc: `_acceptance/release-2-30-0/` — đo lúc dựng hồ sơ mốc 14/10 (ghi chú «Lớp chép CI» của mục 2.30.0 trong
`CHANGELOG.md` gọi tên lỗ). Hạt giống là SỔ, không phải ô.

## Lỗ

Khối INIT-CI-COPY-LIST (`commands/acceptance-init.md`) gắn `scripts/ho-so-tom-tat.cjs` thẻ
`[only-if-declared: lo_trinh]`. Nhưng từ 2.29.0 `scripts/tin-hieu.mjs` nạp tệp ấy ngay lúc tải (`boNgoacNgoai`), và từ
2.30.0 `scripts/cat-luot.mjs` cũng vậy (`ngayChuKy`, hồ sơ `bo-doc-ho-so-khoan-dung`). Kho khai `tin_hieu` mà KHÔNG khai
`lo_trinh`, chép đúng theo thẻ, sẽ thiếu tệp: bước bản đồ (`product-map.mjs` nạp `tin-hieu.mjs`) đỏ
`MODULE_NOT_FOUND`, còn đường nền của feature-loop (`feature-loop/scripts/duong-nen.mjs`) in `bo-qua` cho tệp vắng
thay vì nói thiếu. Đo 14/10: kho tiêu thụ duy nhất khai `tin_hieu` là crm, và crm khai cả `lo_trinh` — 0 kho trúng
hôm nay.

## Nghiệm đã nghĩ (chưa làm)

- Thẻ nhận nhiều khoá (`[only-if-declared: lo_trinh|tin_hieu]`, «khai một trong các khoá» là cần) — bộ đọc thẻ của
  `duong-nen.mjs` hôm nay chỉ nhận một khoá (`[a-z_][a-z0-9_]*`), nên vá gồm bộ đọc + thẻ + ca đo. Ca đo: kho thử khai
  `tin_hieu`, không khai `lo_trinh`, thiếu `ho-so-tom-tat.cjs` → đường nền nói LỆCH/thiếu; chiều im: kho không khai cả
  hai mà thiếu tệp → `bo-qua`.
- Trong lúc chờ: ghi chú nhận của mốc nói kho khai `tin_hieu` chép cả `ho-so-tom-tat.cjs` (mục 2.30.0).

## Ngưỡng mở ô

≥1 kho tiêu thụ khai `tin_hieu` mà không khai `lo_trinh`.

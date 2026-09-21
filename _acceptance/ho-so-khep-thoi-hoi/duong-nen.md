---
slug: ho-so-khep-thoi-hoi
at: 2026-09-21T23:45:36.467Z
sha: ff63ccf335deef460fb92482dc46246c187fc43f
nen: do
cong_cu: xanh
suite: do
luoi: xanh
engine: xanh
---

## Dòng đỏ

- nen suite: DO SAN executors.test.plugins ma 1
- nen suite: DO SAN executors.script.product_map ma 1

## Đã gỡ (máy, 22/09)

Cả hai dòng đỏ cùng một nguyên nhân trong phạm vi repo: commit Cổng Đáng `ff63ccf3` đổi
`stage` của ô mà không vẽ lại `PRODUCT-MAP.md`. Vẽ lại bằng `node scripts/product-map.mjs --root .`;
chạy lại hai chân đỏ: `product-map.mjs --check` → «khớp hồ sơ xưởng»; suite plugins → «all plugin
tests passed» (P122, P126 PASS). Không chạy lại trọn đường nền (≈ 14 phút) — hai chân còn lại đã xanh.

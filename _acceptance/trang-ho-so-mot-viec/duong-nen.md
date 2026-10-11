---
slug: trang-ho-so-mot-viec
at: 2026-10-10T23:55:43.881Z
sha: 65a01f4c2eaf993b651cdc9c6d3fc47dc766ee22
nen: do
cong_cu: xanh
suite: do
luoi: xanh
engine: do
---

## Dòng đỏ

- nen suite: DO SAN executors.test.plugins_vung_1 ma 1
- nen suite: DO SAN executors.script.product_map ma 1
- nen suite: CAY BAN SAU SUITE _acceptance/trang-ho-so-mot-viec/contract.md
- nen suite: CAY BAN SAU SUITE _acceptance/trang-ho-so-mot-viec/coverage-scan.md
- nen suite: CAY BAN SAU SUITE _acceptance/trang-ho-so-mot-viec/decisions.jsonl
- nen suite: CAY BAN SAU SUITE _acceptance/trang-ho-so-mot-viec/evals.yaml
- nen suite: CAY BAN SAU SUITE _acceptance/trang-ho-so-mot-viec/gap-probe.md
- nen suite: CAY BAN SAU SUITE docs/superpowers/plans/2026-10-11-trang-ho-so-mot-viec.md
- nen suite: CAY BAN SAU SUITE docs/superpowers/specs/2026-10-11-trang-ho-so-mot-viec-design.md
- nen engine: LECH lib/evidence-core.cjs (vendored ≠ dang-chay)
- nen engine: LECH scripts/lo-trinh.mjs (vendored ≠ dang-chay)

## Phân tích (máy, 11/10)

- Hai dòng `DO SAN` (`plugins_vung_1` · `product_map`) cùng một nguyên nhân: hồ sơ của chính vòng
  này được ghi vào cây trong lúc đường nền chạy, nên bản đồ sản phẩm lệch hồ sơ — đỏ do vòng, không do
  hạ tầng. Gỡ: vẽ lại bản đồ cùng commit hồ sơ, rồi `product-map.mjs --check` thoát 0.
- Bảy dòng `CAY BAN SAU SUITE` là đúng các tệp của vòng viết trong lúc chạy — cùng nguyên nhân.
- Hai dòng `LECH` của engine: kho kit tự chạy bằng mã của cây (nhánh chính sau 2.26.0), bản cài
  2.26.0 là bản cũ hơn — trạng thái thường của kho tự host, không phải việc của vòng.
- Không dòng nào cần người gỡ.

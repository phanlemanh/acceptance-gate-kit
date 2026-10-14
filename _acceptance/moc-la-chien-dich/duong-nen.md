---
slug: moc-la-chien-dich
at: 2026-10-14T08:58:02.928Z
sha: f4e717bf6b21a6d3769d0df7821cc7497c494890
nen: do
cong_cu: xanh
suite: do
luoi: xanh
engine: xanh
---

## Dòng đỏ

- nen suite: DO SAN executors.test.plugins_vung_1 ma 1
- nen suite: DO SAN executors.script.product_map ma 1
- nen suite: CAY BAN SAU SUITE _acceptance/moc-la-chien-dich/contract.md
- nen suite: CAY BAN SAU SUITE _acceptance/moc-la-chien-dich/coverage-scan.md
- nen suite: CAY BAN SAU SUITE _acceptance/moc-la-chien-dich/decisions.jsonl
- nen suite: CAY BAN SAU SUITE _acceptance/moc-la-chien-dich/evals.yaml
- nen suite: CAY BAN SAU SUITE _acceptance/moc-la-chien-dich/gap-probe.md
- nen suite: CAY BAN SAU SUITE _acceptance/moc-la-chien-dich/opportunity.md
- nen suite: CAY BAN SAU SUITE docs/plans/lo-trinh-kit.json
- nen suite: CAY BAN SAU SUITE docs/superpowers/specs/2026-10-14-moc-la-chien-dich-design.md
- nen suite: CAY BAN SAU SUITE _acceptance/moc-la-chien-dich/card-plain.json
- nen suite: CAY BAN SAU SUITE _acceptance/moc-la-chien-dich/figures/co-ngoai-moc.html
- nen suite: CAY BAN SAU SUITE _acceptance/moc-la-chien-dich/figures/co-ngoai-moc.png
- nen suite: CAY BAN SAU SUITE _acceptance/moc-la-chien-dich/figures/index.md

## Máy đã gỡ (14/10, sau khi đường nền xong)

Mọi dòng đỏ trên đều do chính vòng này, không phải nền: hồ sơ và hàng MC1 được ghi trong lúc đường nền chạy (13 dòng
«CAY BAN SAU SUITE»), và bản đồ sản phẩm + trang lộ trình chưa vẽ lại sau khi thêm chúng — đó là cả hai chân đỏ
`product_map` và `plugins_vung_1` (ca P122, P126 đều đo bản đồ). Đã vẽ lại (`product-map.mjs --root .`): `--check`
thoát 0; chạy lại riêng P122 và P126 (`ONLY_BLOCK`): cả hai PASS. Không chạy lại trọn đường nền (~35′ giữ khoá máy).

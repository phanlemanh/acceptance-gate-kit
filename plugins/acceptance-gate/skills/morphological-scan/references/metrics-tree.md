# Preset: Hệ metric

Dùng khi dựng bộ chỉ số cho một feature/domain — chống sót và chống vanity metric cùng lúc.

## Trục

1. **Funnel stage** — acquisition → activation → engagement → transaction → retention → revenue; chỉnh lại theo journey thật của domain, không bê nguyên.
2. **Actor** — đo theo từng actor trong Product Context. NẾU marketplace ≥2 phía: đo riêng từng phía + nhóm chỉ số cân bằng các phía (liquidity: tỉ lệ khớp, time-to-match, supply/demand ratio) — nhóm liquidity hay bị sót nhất vì không thuộc riêng phía nào. Sản phẩm 1 phía: bỏ nhóm liquidity.
3. **Loại chỉ số** — leading (hành vi dự báo) | lagging (kết quả). Luật: mỗi lagging Core phải có ≥1 leading đi kèm, nếu không thì chỉ biết kết quả khi đã muộn.

## Guard mỗi metric Core

1 dòng bắt buộc: **owner + ngưỡng + hành động khi lệch**. Không nêu được hành động → vanity metric → Never.

## Thước CE

Đối chiếu ngược: liệt kê mọi quyết định của quý trước — mỗi quyết định cần số nào, số đó có trong cây chưa? Quyết định không có số chống lưng = lỗ CE.

## Pareto

North star 1 chỉ số + tối đa ~5 driver Core mỗi domain. Dashboard quá 1 màn hình → cắt lại.

---
schema_version: 1
slug: frontmatter-thang-mot-ky-hieu
feature: Bộ đọc frontmatter cắt phần sau « #» làm ghi chú — tên hồ sơ có dấu thăng hiện cụt trên bản đồ và thẻ mà phép kiểm bản đồ vẫn xanh
owner: phanlemanh@gmail.com
stage: discovery            # discovery | decided | archived
decision:              # build | iterate | park | kill — người ký Cổng 0 điền
decided_by:
decided_at:
prototype:
  base_commit:
  disposition:
---

## Vấn đề & ai gặp

Bộ đọc frontmatter duy nhất của kit (`frontmatterField`, `lib/evidence-core.cjs:94`)
cắt mọi thứ sau một khoảng trắng + `#` làm ghi chú YAML. Hồ sơ mốc 2.9.0 viết
`feature: … (#146 … · #149 … · #151 …)` là hợp đồng ĐẦU TIÊN trong `_acceptance/`
có ` #` ở trường này (07/09/2026): tên hồ sơ hiện cụt trên `PRODUCT-MAP.md`, trên
thẻ khởi động và thẻ Cổng Bằng chứng — dấu `·` treo, ngoặc không đóng, hai vòng
sửa biến mất khỏi tên — trong khi `product-map --check` vẫn xanh vì bên viết và
bên đọc dùng chung bộ cắt. Phản biện context sạch không bắt được (nó đối chiếu
số với git, không đối chiếu chữ hiển thị với bộ đọc); agent rà quy ước ở S4 bắt
được (finding ngoài hợp đồng, Ngoài-1 của `release-2-9-0`). Người trả giá: người
ký — đọc một cái tên cụt trên đúng thẻ mình sắp ký; và mọi hồ sơ tương lai nhắc
số PR/issue trong `feature:`. Mốc 2.9.0 đã sửa CHỮ (viết «PR 146»), chưa sửa
bộ đọc. Lớp lỗi: bên VIẾT và bên ĐỌC trôi khỏi nhau (CLAUDE.md, «thước phải gắn
vào vật được giao», hình dạng 3).

## Giả định chốt sinh tử

| # | Giả định | Nếu sai thì | Phép thử rẻ nhất | Trạng thái |
|---|---|---|---|---|
| 1 | Chỉ hồ sơ mốc 2.9.0 từng có ` #` trong một khoá frontmatter đọc ra mặt người | có hồ sơ khác đang hiện tên cụt mà không ai thấy | `grep -rn '^[a-z_]*:.* #' _acceptance/*/contract.md _acceptance/*/opportunity.md` | Chưa thử (07/09: `^feature:.* #` chỉ ra `release-2-9-0`) |
| 2 | Bộ cắt ghi chú ` #` chỉ cần thiết cho các khoá cố ý mang ghi chú (`risk_tier`, `stage`, `decision`) | bỏ cắt toàn cục làm khoá khác đọc sai | liệt các khoá có ghi chú thật trong khuôn contract/opportunity | Chưa thử |

## Ngưỡng chết / ngưỡng UAT

> Khai TẠI Cổng Đáng (khuôn D1b). Máy đề xuất ở mục Cổng 0 bên dưới: vòng nội bộ bộ công cụ,
> không có người dùng cuối — người ký chốt bằng một dòng «Không đo được — …» thay bốn bullet.

- Câu hỏi phép đo trả lời: …
- Kết quả nào là SỐNG: …
- Kết quả nào là CHẾT: …
- Timebox: …

## Cổng 0

Chưa ký — chờ owner quyết build/park. Đề xuất của máy cho mục ngưỡng khi ký: «Không đo
được — vòng nội bộ bộ công cụ, không có người dùng cuối; thước thành công là chiều đỏ tự
chứng: một hợp đồng có ` #` trong `feature:` phải bị lint gọi tên (đường TRỪ) hoặc đọc ra
nguyên văn (sửa bộ đọc: chỉ cắt ghi chú ở khoá đã khai), và bản đồ vẽ từ nó phải khớp chữ
người viết. Timebox nếu build: ≤ 1 ngày.» Mở từ Ngoài-1 của hồ sơ mốc
`release-2-9-0` (người ký chốt «mở hợp đồng mới», 07/09/2026), dưới luật vào-có-ô.

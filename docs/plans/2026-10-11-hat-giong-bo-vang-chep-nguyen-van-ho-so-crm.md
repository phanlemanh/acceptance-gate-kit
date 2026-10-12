# Hạt giống — bộ vàng của cửa tín hiệu chép nguyên văn hồ sơ crm vào cây kit

Gốc: `_acceptance/cua-tin-hieu-gom-nhom/` (Cổng Bằng chứng ký 11/10/2026 — Ngoài-9, owner: mở hợp đồng
mới). Hạt giống là SỔ, không phải ô.

## Lỗ

`_acceptance/cua-tin-hieu-gom-nhom/rang/sinh-bo-vang.mjs` ghi vào `mau/ho-so/<slug>/contract.md` phần đầu
và mục Criteria NGUYÊN VĂN của bốn hợp đồng crm đã ký (tên nhánh, đường dẫn, email chủ hồ sơ), và
`mau/bo-vang.json` mang câu giao + câu nguồn crm. CLAUDE.md: kit KHÔNG chứa nội dung workspace
`_acceptance/` của sản phẩm. Tiền lệ trong cây (hồ sơ kit chép mẫu crm) làm mức độ thấp, và chủ hồ sơ crm
là cùng một người — nhưng ai dùng kit ở công ty khác cũng nhận các bản sao này.

## Hướng

Bộ sinh ghi hợp đồng dựng bằng mã: frontmatter `status` + tiêu chí rút gọn (mã AC + một câu đã gỡ tên
riêng), câu nguồn tín hiệu gỡ đường dẫn/tên nhánh; giữ số đo của lượt gom (12/20 · 15/20) ở Known limits
của hồ sơ. Đo lại lượt gom trên bộ vàng mới để xem nhãn có đổi không.

Ngưỡng mở ô: kit được chia sẻ ra ngoài chủ kho (một kho tiêu thụ của người khác), hoặc owner gọi tên.

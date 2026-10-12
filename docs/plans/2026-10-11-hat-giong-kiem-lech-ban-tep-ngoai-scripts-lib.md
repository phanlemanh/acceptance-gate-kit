# Hạt giống — bước kiểm lệch bản của đường nền không thấy tệp ngoài scripts/ và lib/

Gốc: `_acceptance/cua-tin-hieu-gom-nhom/` (Cổng Bằng chứng ký 11/10/2026 — Ngoài-3 và Ngoài-5, cùng gốc,
owner: mở hợp đồng mới). Hạt giống là SỔ, không phải ô: chỉ mở thành ô khi có neo ngoài.

## Lỗ

Vòng cửa tín hiệu thêm bốn mục vào danh sách chép CI (`commands/acceptance-init.md`, khối
INIT-CI-COPY-LIST) nằm ngoài `scripts/` và `lib/`: `dieu-phoi/scripts/{hinh-dang,cau-hinh,dot}.mjs` và
`skills/acceptance/references/tin-hieu-template.md`. Lượt sửa 1 (`dd2c1bd5`) neo bộ đọc của chân engine
(`feature-loop/scripts/duong-nen.mjs`, TEP_ENGINE) vào `${CLAUDE_PLUGIN_ROOT}/(scripts|lib)/…` để thôi cắt
`dieu-phoi/scripts/x.mjs` thành `scripts/x.mjs` giả — nhưng vì thế bốn tệp kia không được băm. Một kho
tiêu thụ khai `tin_hieu` mà giữ bản cũ của một trong bốn tệp vẫn thấy chân engine xanh. Ca NEN7 đếm
cùng tập hẹp nên xanh theo.

## Hướng

Bộ đọc lấy đường đầy đủ sau `${CLAUDE_PLUGIN_ROOT}/` cho mọi mục; NEN7 đếm mọi mục `→` của khối. Cặp ca
hai chiều: bản sao vendored lệch một tệp `dieu-phoi/scripts/…` → chân engine đỏ gọi tên tệp.

Ngưỡng mở ô: ≥1 kho tiêu thụ khai `tin_hieu` và đi đường chép tay danh sách (đường cũ, khai sẽ bỏ ở mốc
kế) — hoặc mốc bỏ đường chép tay làm hạt giống này tự hết hiệu lực.

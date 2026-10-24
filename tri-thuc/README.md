# tri-thuc

Vỏ lệnh của tầng tri thức theo LLM Wiki (đợt `tri-thuc-2410`). Mã ở lõi `acceptance-gate`
(`scripts/tri-thuc.mjs`, `scripts/tri-thuc-khoa.cjs`, khuôn `skills/acceptance/references/tri-thuc-template.md`).
Đi cùng số phiên bản với acceptance-gate. Cài theo kho (`--scope project`) và khai khối `tri_thuc` trong
`_acceptance/config.yaml`.

| Lệnh | Việc |
|---|---|
| `/tri-thuc:kiem` | Kiểm kho tri thức — sáu lỗi cấu trúc, chỉ đọc |

Thiết kế: `docs/findings/2026-10-24-tang-tri-thuc-llm-wiki.md`.

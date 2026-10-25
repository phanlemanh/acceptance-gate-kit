# Kế hoạch — vong-don-le-tra-tri-thuc (TT5)

Hợp đồng: `_acceptance/vong-don-le-tra-tri-thuc/contract.md` · thiết kế:
`docs/superpowers/specs/2026-10-25-vong-don-le-tra-tri-thuc-design.md`. Các task phụ thuộc nhau (cùng tệp
`tri-thuc-tra.cjs`), chạy tuần tự trong vòng chính.

| # | Task | Tệp | Kiểm task | Phục vụ | independent |
|---|---|---|---|---|---|
| 1 | Ca đo viết trước (TD-1…TD-9, kèm bản tiêm) — đỏ trên cây chưa sửa | `tests/scripts/vong-don-le-tra-tri-thuc.test.mjs`, `_acceptance/config.yaml` (hai khoá executor) | `node tests/scripts/vong-don-le-tra-tri-thuc.test.mjs` đỏ đúng ca | E1–E10 | false |
| 2 | Tra sổ + tra trang + `--tra` | `scripts/tri-thuc-tra.cjs`, `scripts/tri-thuc.mjs` | TD-1…TD-4 xanh | E1–E4 | false |
| 3 | Thẻ kiểm `so`, SKILL (khối `TRI-THUC-TRA-MO-TA`, `so` trong `DEC-TRI-THUC-TRA`, bước 0c), sửa hai chỗ ca TT4 | `scripts/tri-thuc-tra.cjs`, `feature-loop/skills/feature-loop/SKILL.md`, `tests/scripts/thiet-ke-nap-tri-thuc.test.mjs` | TD-5, TD-6 xanh; ca TT4 xanh | E5, E6, E10 | false |
| 4 | Lệnh đếm + hạt giống | `scripts/can-cu-s1.cjs`, `scripts/tri-thuc-tra.cjs` | TD-7, TD-8, TD-9 xanh | E7, E8, E9 | false |
| 5 | Hồi quy + vẽ lại bản đồ | `PRODUCT-MAP.md`, `LO-TRINH.html` | năm tệp ca hồi quy xanh; `product-map --check` xanh | E10 | false |

Phá thử của mỗi phép đo mới nằm trong chính ca (bản tiêm trên bản sao cây, đối chứng xanh trước).

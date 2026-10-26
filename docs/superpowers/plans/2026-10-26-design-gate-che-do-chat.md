# Kế hoạch — design-gate-che-do-chat (T2)

Hợp đồng: `_acceptance/design-gate-che-do-chat/contract.md` (Cổng Phạm vi ký 26/10, Manh Phan — Hỏi-1 phê cờ
`--require-measured` + mã 5). Design doc: `docs/superpowers/specs/2026-10-25-design-gate-che-do-chat-design.md`.

Hai task đã làm trên nhánh `vong/design-gate-chat-khong-do-duoc` trước khi Mac Studio bàn giao (26/10); kế hoạch
ghi lại thứ tự và cách kiểm để lượt chấm và người đọc lịch sử lần được. Không task nào còn mở.

| Task | Files | Kiểm | Phục vụ | independent |
|---|---|---|---|---|
| T1 — bộ ca chế độ chặt viết TRƯỚC bản sửa (commit `c4860cd3`) | `tests/scripts/design-gate-che-do-chat.test.mjs` | trên bản chưa sửa: 4/6 ca đỏ đúng chỗ (chiều đỏ nằm trong lịch sử) | E1–E8 | false |
| T2 — cờ `--require-measured` ở static và dom, quyết bằng đuôi trước khi nạp jsdom; tài liệu + CHANGELOG (commit `c0d374a1`) | `scripts/design-gate.mjs`, `skills/acceptance/references/design-ui-check.md`, `CHANGELOG.md` | `node tests/scripts/design-gate-che-do-chat.test.mjs` 7/7 · `node tests/scripts/design-gate-khong-do-duoc.test.mjs` 3/3 | E1–E8 | false (sau T1) |

Kiểm lại 26/10 trên đỉnh nhánh sau Cổng Phạm vi: hai lệnh trên xanh (7/7 · 3/3); đường nền trên cây sạch
`origin/main` 45e9f2cf xanh năm chân.

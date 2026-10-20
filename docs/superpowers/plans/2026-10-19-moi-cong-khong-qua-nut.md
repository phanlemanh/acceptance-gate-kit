# Kế hoạch — moi-cong-khong-qua-nut (KY1)

Thiết kế: `docs/superpowers/specs/2026-10-19-moi-cong-khong-qua-nut-design.md` · hợp đồng: `_acceptance/moi-cong-khong-qua-nut/contract.md`.
Thứ tự TDD: ca đo commit TRƯỚC văn bản, chạy đỏ, rồi văn bản làm nó xanh.

| # | Việc | Tệp | Kiểm từng việc | Phục vụ | independent |
|---|---|---|---|---|---|
| 1 | Ca đo MQ-1…MQ-10 + chế độ `--dem`; hai khoá executor | `tests/scripts/moi-cong-khong-qua-nut.test.mjs`, `_acceptance/config.yaml` | chạy ca → ĐỎ vì chưa có điều khoản (ghim «không rút được GATE-END-TURN-CLAUSE») | E1–E10 | false |
| 2 | Điều khoản nguồn, bảng chỗ chép, khuôn kết lượt | `skills/acceptance/references/human-facing-language.md` | MQ-1, MQ-5…MQ-7 xanh | E1, E5–E7 | false |
| 3 | Chép vào engine + chỗ trỏ ở Cổng Đáng, Cổng 1.5, bước «Đính» | `skills/acceptance/SKILL.md`, `commands/acceptance-card.md`, `feature-loop/skills/feature-loop/SKILL.md` | MQ-2…MQ-4 xanh; P188 xanh | E2–E4, E9a | false |
| 4 | Chép vào gói điều phối | `dieu-phoi/scripts/mau/LUAT.md`, `dieu-phoi/commands/{mo-dot,dong-dot,tiep-tuc}.md` | MQ-2, MQ-8 xanh; bộ ca khung điều phối xanh; DP1-07 xanh | E2, E8, E9b | false |
| 5 | Kiểm chéo | — | trọn tệp ca; `node scripts/product-map.mjs --root . --check` | tất cả | false |

Các việc phụ thuộc nhau (cùng ca đo, cùng nguồn chép) — chạy tuần tự trong vòng chính.

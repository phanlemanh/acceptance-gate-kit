# Kế hoạch thi công — thiet-ke-nap-tri-thuc (TT4)

Hợp đồng: `_acceptance/thiet-ke-nap-tri-thuc/contract.md` · thiết kế: `docs/superpowers/specs/2026-10-24-thiet-ke-nap-tri-thuc-design.md`.
Thước trước vật: ca kiểm viết trước, chạy đỏ trên cây chưa có vật, rồi mới dựng vật.

| # | Task | Files | Verify | Phục vụ | independent |
|---|---|---|---|---|---|
| 1 | Ca kiểm TN-1…TN-8 (thước trước, đỏ trên cây chưa có vật) + khoá executor | `tests/scripts/thiet-ke-nap-tri-thuc.test.mjs`, `_acceptance/config.yaml` | `node tests/scripts/thiet-ke-nap-tri-thuc.test.mjs` đỏ có tên ca | E1–E8 | false |
| 2 | Dời luật giải đường kho riêng sang CJS | `scripts/tri-thuc-khoa.cjs`, `scripts/tri-thuc.mjs` | `node tests/scripts/kho-tri-thuc-va-lint.test.mjs` + `o-mo-viec-mang-nguon.test.mjs` xanh | E4, E10 | false |
| 3 | Mô-đun dòng tra + lệnh `--clone` | `scripts/tri-thuc-tra.cjs` | TN-4 xanh | E1–E5 | false |
| 4 | Bộ xếp căn cứ nhận `tri_thuc` | `scripts/can-cu-s1.cjs` | TN-5 xanh, `can-cu-s1.ca.mjs` xanh | E5, E9 | false |
| 5 | Thẻ Cổng Phạm vi: chặn, cờ, căn cứ trỏ trang, chiều im | `scripts/gate-card.js` | TN-1, TN-2, TN-3, TN-6, TN-7 xanh; `co-hop-dong.test.mjs`, `luat-san-pham.ca.mjs` xanh | E1–E3, E6, E7, E10 | false |
| 6 | Khuôn trong SKILL: `DEC-TRI-THUC-TRA`, `DEC-CAN-CU-TRI-THUC`, `TRI-THUC-TRA-CHAN`, bước S1#0c | `feature-loop/skills/feature-loop/SKILL.md` | TN-8 xanh; LT-18 và CC-02 xanh | E8 | false |
| 7 | Trọn suite cục bộ, vẽ lại bản đồ, đặt `implemented` | — | `bash tests/scripts/run-tests.sh`, `tests/plugins`, `tests/workflows` | E9, E10 | false |

Các task phụ thuộc nhau (task 3 dùng task 2; 4, 5 dùng 3; 6 khớp khoá của 5) — thi công tuần tự trong phiên chính.

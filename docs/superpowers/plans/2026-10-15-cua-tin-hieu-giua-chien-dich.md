# Kế hoạch thi công — cua-tin-hieu-giua-chien-dich (RM3)

Hợp đồng: `_acceptance/cua-tin-hieu-giua-chien-dich/contract.md` (duyệt 15/10 08:00Z) · design:
`docs/superpowers/specs/2026-10-15-cua-tin-hieu-giua-chien-dich-design.md`. T2 — không Gate 1.5. Mọi task tuần tự
(`independent: false`): T1 dựng ca đo đứng trước vật (chiều đỏ nằm trong lịch sử: commit ca trước commit vật).

| Task | Files | Verify per-task | Phục vụ |
|---|---|---|---|
| T1 · ca đo CT-1…CT-10 (đỏ trên cây chưa có vật) | `tests/scripts/cua-tin-hieu-giua-chien-dich.test.mjs` (mới) | `node tests/scripts/cua-tin-hieu-giua-chien-dich.test.mjs` thoát ≠ 0, mọi ca FAIL vì vật vắng | E1–E10 |
| T2 · cửa tín hiệu của gói điều phối | `dieu-phoi/scripts/cua-tin-hieu.mjs` (mới: `CAU_DA_GHI`, bản chép `khoaTinHieu`, `docCua`, `thanTep`, `ghiVaoCua`) | CT-6, CT-3 phần tệp | E3, E5, E6, E10 |
| T3 · bộ xét + nhịp xét + cờ `--chan` | `dieu-phoi/scripts/yeu-cau.mjs`, `phat-lich.mjs` (`xuLyYeuCau`: `nguCanh.cua`, chuyển vào cửa, sự kiện mang `chan`), `dieu-phoi.mjs` (lệnh `yeu-cau --chan`) | CT-1…CT-5, CT-10 + `node --test tests/dieu-phoi/**/*.test.mjs` | E1–E5, E10 |
| T4 · lệnh người | `scripts/gui-tin-hieu.mjs` (mới), `road-map/commands/gui.md` (mới, khối `RM-GUI-LENH`), `road-map/README.md` | CT-7 | E7 |
| T5 · dòng thẻ khởi động | `scripts/start-scan.mjs` | CT-8 | E8 |
| T6 · luật thợ | `feature-loop/skills/feature-loop/SKILL.md` (khối lồng `TRONG-DOT-HANG-MOI` trong `TRONG-DOT`), `dieu-phoi/scripts/mau/LUAT.md` (khối `LUAT-CHAN`), `CONTEXT.md` (mục Cửa tín hiệu một câu) | CT-9 + `node --test tests/dieu-phoi/trong-dot.test.mjs` | E9 |
| T7 · suite | — | bốn mảnh `scripts` + `hooks` + `plugins` + `dieu_phoi` | toàn hồ sơ |

Lựa chọn load-bearing (không có phương án thay thế đáng ghi sổ): CT-3 «nhịp hai lần» giả lập sập giữa ghi tệp và ghi trả lời
(xoá `tra-loi/<id>.json` rồi chạy lại nhịp) — chỉ cách đó mới làm nhịp xét gặp lại cùng id.

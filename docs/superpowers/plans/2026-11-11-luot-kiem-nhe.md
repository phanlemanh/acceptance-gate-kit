# Kế hoạch — luot-kiem-nhe

Hồ sơ: `_acceptance/luot-kiem-nhe/` (T2, Cổng Phạm vi duyệt 11/11/2026) · thiết kế:
`docs/superpowers/specs/2026-11-11-luot-kiem-nhe-design.md`. T2 nên không có Gate 1.5; các task chạy tuần tự trong phiên
chính vì cùng chạm hai bộ chạy kiểm.

| # | Task | Tệp | Kiểm từng task | Phục vụ | independent |
|---|---|---|---|---|---|
| 1 | Lời khai Node + phần dùng chung của bộ chạy (Node tự so, bảng thời gian) | `.nvmrc`, `tests/bo-chay.sh` | `bash tests/bo-chay.sh node`; thử tay mười hai ô khai × chạy | E4, E7, E8 | false |
| 2 | Nối phần dùng chung vào bốn bộ chạy (kiểm Node trước ca đầu, mở/đóng bảng) | `tests/{scripts,plugins,hooks,workflows}/run-tests.sh` | `bash tests/hooks/run-tests.sh` — số hàng bảng = số dòng PASS/FAIL | E5, E7 | false |
| 3 | Lượt kiểm tự động: việc mảnh trên PR, việc gom `tests`, lượt trọn khi đẩy nhánh chính, mọi việc đọc `.nvmrc` | `.github/workflows/gate.yml`, `.github/actions/node-tu-xung/action.yml` | ca KD8-ci, DP1-03 (rút bước điều phối), P35/P40/P51/P126 vẫn xanh | E1, E2, E3, E5, E6 | false |
| 4 | P161 nhanh hơn: dựng thẻ song song có nhớ (khoá tách cổng, tự kiểm), quét corpus một tiến trình | `tests/plugins/run-tests.sh` | `ONLY_BLOCK=P161 bash tests/plugins/run-tests.sh --manh vung:2` — dòng `P161 OK` không đổi | E9 | true |
| 5 | LM13/LM20: trích chung, song song | `tests/scripts/gate-card-lmcms.test.mjs` | `LMCMS_ONLY=LM node tests/scripts/gate-card-lmcms.test.mjs` | E9 | true |
| 6 | Ca AC-1…AC-8 | `tests/scripts/luot-kiem-nhe.test.mjs`, `_acceptance/config.yaml` | `node tests/scripts/luot-kiem-nhe.test.mjs` | E1–E8 | false |
| 7 | Ca AC-9 so bản cũ/mới | `tests/scripts/luot-kiem-nhe-ca-cham.mjs` | `node tests/scripts/luot-kiem-nhe-ca-cham.mjs` | E9 | false |
| 8 | Số mảnh mjs: chọn 7 theo mô phỏng trên nhật ký hai lượt thật (mảnh dài nhất ước ~5–6′); số thật đo trên lượt kiểm của PR | `.github/workflows/gate.yml` | lượt kiểm tự động của PR | Đường đo | false |

Lựa chọn và chỗ đổi hướng khi làm ghi ở `_acceptance/luot-kiem-nhe/decisions.jsonl` (dòng `stage: S3`).

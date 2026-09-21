# Kế hoạch — ho-so-khep-thoi-hoi (T3, 2.18.1)

Hợp đồng: `_acceptance/ho-so-khep-thoi-hoi/contract.md` · thiết kế:
`docs/superpowers/specs/2026-09-22-ho-so-khep-thoi-hoi-design.md`. Mọi task TDD: commit ca đỏ
trước commit vật (chiều đỏ nằm trong lịch sử). Tuần tự trong phiên chính — các task chạm chung
`start-scan.mjs` / `pre-merge-check.sh` nên không fan-out.

| # | Task | Tệp | Verify per-task | Phục vụ | independent |
|---|---|---|---|---|---|
| T0 | Gộp vật thật: cherry-pick `a68340c5` (observed release-2-0-0, giữ tác giả) | `_acceptance/release-2-0-0/*`, `PRODUCT-MAP.md` | `node lib/workspace-record.cjs --thuc-te --root . --slug release-2-0-0` → `OK` | E2, E5, E7 | false |
| T1 | Vị từ `hoSoDaKhep` + CLI `--da-khep` | `lib/workspace-record.cjs`, `tests/scripts/hskt.test.mjs` | `node tests/scripts/hskt.test.mjs HK-AC1` | E1 | false |
| T2 | Bộ đếm cửa veto: `daKhep` + lọc `vetoOpenUnsigned`; lưới bỏ slug khép khỏi `VETO_OPEN_N` | `scripts/start-scan.mjs`, `scripts/pre-merge-check.sh`, `commands/start.md` | `HK-AC2-*` + `bash tests/plugins/run-tests.sh` nhóm start-scan keys | E2 | false |
| T3 | `lib/out-of-contract.js` → `.cjs`; `xanhSach` + `xanh_sach_check` đọc `review-findings.md`; bên gọi truyền tệp; LV5 thêm ba hàng | `lib/out-of-contract.cjs`, `scripts/khong-can-nguoi.mjs`, `scripts/pre-merge-check.sh`, `scripts/start-scan.mjs`, `scripts/product-map.mjs`, `scripts/gate-card.js`, `tests/plugins/lan-v.test.mjs`, `tests/plugins/run-tests.sh` (P55), `tests/scripts/out-of-contract.test.mjs` | `HK-AC4-*`, `node tests/plugins/lan-v.test.mjs` | E4 | false |
| T4 | Thẻ: `DA_KHEP` → 0 ô hỏi; sinh lại `routing-baseline.txt` | `scripts/gate-card.js`, `tests/scripts/fixtures/routing-baseline.txt` | `HK-AC6-*`, LM20 | E6 | false |
| T5 | Lớp CI 15 tệp: điểm vào thứ ba từ `product_map:`; INIT + GUIDE §5.3; CE5-map round-trip | `commands/acceptance-init.md`, `GUIDE.md`, `tests/scripts/consumer-esm.test.mjs` | `node tests/scripts/consumer-esm.test.mjs` | E3 | false |
| T6 | Hai bộ đo thôi vỡ: NS-AC9-cu neo `verified_commit` + lọc khép; L05 lọc khép | `tests/scripts/ntr-trang-thai.test.mjs`, `tests/scripts/lan-status-not-run.test.mjs` | `HK-AC7-dot-bien`, hai tệp ca xanh | E7 | false |
| T7 | Chiều im trên cây thật (HK-AC5) + khoá config `hskt*` | `tests/scripts/hskt.test.mjs`, `_acceptance/config.yaml` | `HK-AC5-im` | E5 | false |
| T8 | Bốn suite + bản đồ; `status: implemented` → S4 | — | `feature_loop.suite_keys` | tất cả | false |

Sau Cổng Bằng chứng: cắt `release-2-18-1` (làn V) · chiến dịch ghim lại theo mốc, gồm RIÊNG hai
hồ sơ `nhan-trang-thai-va-reality` và `lan-doc-status-not-run` (T6 đổi thước của chúng).

---
schema_version: 1
feature: Phát hành kit 2.29.0 — đóng số cho cửa sổ 2.28.0 → 2.29.0 (cỡ vòng ở bước thiết kế · trạng thái đợt trong app · luật sản phẩm của kho · câu trạng thái cho người gửi tín hiệu · kiểm bản cài sau phát hành · hai thước của gói dieu-phoi thôi nói sai ở kho tiêu thụ), để crm nhận ở quãng lặng của đợt r2; làn V, không dựng răng
slug: release-2-29-0
owner: phanlemanh@gmail.com
risk_tier: T2               # vật chạm: 3 manifest + dòng khớp-phiên-bản của GUIDE + CHANGELOG + hai sửa nhỏ đi trong PR mốc (khong-can-nguoi.mjs + start-scan.mjs: luật sản phẩm thiếu mô-đun · tin-hieu.mjs + lo-trinh-du-lieu.md: số bản của cờ «bản vẽ cũ») + workspace hồ sơ + bản đồ + 5 khoá executor — KHÔNG dính t3_paths
surfaces: [cli]
status: approved
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-10-13T09:11:47Z
---

# Acceptance Contract: release-2-29-0

## Context

**Kho chờ nhận — đo được trước khi cắt:** `crm`. Chủ kho chốt mốc «Phát hành 2.29.0» ngày 14/10 trên lộ trình kit
(`docs/plans/lo-trinh-kit.json`), trễ nhất 15/10, KHÔNG cắt khi thiếu KC1. Neo ở kho tiêu thụ: crm issue
`phanlemanh/crm-onehub#375` — máy Mac Studio nhận ở quãng lặng của đợt `r2`; hàng LT2 của crm đọc câu cho người gửi
(gốc của TH-cau: crm `_acceptance/gui-tin-hieu-trong-crm`, E14); luật múi giờ của crm (gốc của BB1: crm
`_acceptance/okr-soat-anh-luot-3`); đợt `r2` chạy trên gói `dieu-phoi` (gốc của DP9: crm#375 13/10).

**Cửa sổ này có gì** — suy từ kho bằng quan hệ (AC-4), không chép tay. Hồ sơ **được ký** trong cửa sổ (sáu):

- Bước thiết kế: `vong-mo-thang-bang-feature-loop` (S3c, T2, #335 — máy M5) · `bat-bien-san-pham` (BB1, T2, #329).
- Cửa tín hiệu: `cau-tin-hieu-nguoi-gui` (TH-cau, T2, #330).
- Gói `dieu-phoi`: `trang-thai-dot-dieu-phoi-tho` (DP6b, T2, #337 — máy M5) · `nen-dieu-kien-va-static-khong-do-duoc`
  (DP9, T2, #338 — máy M5; phiên điều phối đưa vào mốc 13/10, gộp `cf691e71`).
- Phát hành: `kiem-ban-cai-sau-phat-hanh` (KC1, T2, #339 — vòng meta duy nhất của cửa sổ).

Ngoài hồ sơ, PR mốc mang hai sửa có tên (phiên điều phối giao 13/10): luật sản phẩm thiếu mô-đun (lỗ máy M5 nêu khi
rà BB1 trên main — AC-11) và số bản của cờ «bản vẽ cũ» (hạt giống `co-ban-ve-cu-ghi-dung-so-ban` — AC-12).

Số là **2.29.0, không 2.28.1**: mốc thêm bề mặt mới cho kho tiêu thụ — tệp luật `PRODUCT-INVARIANTS.md` (CỘNG, ADR
0024), trường `cau_nguoi_gui` và lệnh `tin-hieu.mjs --cau` (CỘNG), mô-đun `scripts/co-hop-dong.cjs` vào lớp chép CI,
lệnh `kiem-ban-cai.mjs`, lệnh `dieu-phoi.mjs xem --json`. Mốc đi **làn V**. Năm dòng số, bảng dự báo, điều kiện tin
cậy, dòng hiệu chuẩn và ghi chú nhận mốc cho crm nằm ở mục `2.29.0` của `CHANGELOG.md` — một nguồn, hồ sơ không chép
lại.

Source input: `git log v2.28.0..HEAD` · nếp phát hành `_acceptance/release-2-28-0/` · mục Notes và Known limits của
sáu hồ sơ · crm#375 · kit #308.

## Criteria

- AC-1: Given cây đã sửa, When chạy vùng 3 của suite plugins (nơi ca vĩnh viễn P200 sống), Then lệnh thoát 0 — P200 đọc số từ bốn manifest và đòi `acceptance-gate`, `feature-loop`, `dieu-phoi` mang CÙNG một số hợp semver, `diagram-design` hợp semver; P200 đỏ thì vùng 3 thoát khác 0.
- AC-2: Given cây đã sửa, When chạy vùng 3 của suite plugins, Then lệnh thoát 0 — P200 dựng câu «Khớp phiên bản» của GUIDE từ bốn số đọc trong manifest rồi so (một nguồn — so với manifest, không so hằng).
- AC-3: Given cây đã sửa, When chạy mọi lệnh suite của lượt chấm (bốn mảnh scripts, hooks, ba vùng plugins, workflows), Then cả chín lệnh XANH và `product-map --check` khớp (cùng khoá `kiem_ban_cai_moc` của AC-10: mười một khoá của `feature_loop.suite_keys`).
- AC-4: Given tập hồ sơ ĐƯỢC KÝ trong cửa sổ suy từ kho (`scripts/rel-cua-so.sh 72eb55f3 …`, mốc = commit gắn tag `v2.28.0`), When so với danh sách «được ký» kể trong Context, Then hai tập BẰNG NHAU.
- AC-5: Given mốc `72eb55f3` (tag `v2.28.0`), When so thư mục `diagram-design/` và số của nó với HEAD bằng git, Then thư mục KHÔNG có dòng đổi VÀ số bằng số ở mốc — `diagram-design` giữ `2.7.1` là đúng.
- AC-6: Given mô tả hai plugin, When chạy vùng 3 của suite plugins, Then lệnh thoát 0 — P200 đòi mô tả `acceptance-gate` CÓ mục của đúng số đang phát hành và mục đó của `feature-loop` TỰ khai cặp `acceptance-gate >= <số>`. *Nội dung* các vế người-dùng-nhận-gì đọc trực tiếp trong diff.
- AC-7: Given cây đã sửa, When chạy suite của gói `dieu-phoi` (`tests/dieu-phoi/**/*.test.mjs`, cùng lệnh job CI của kit), Then lệnh thoát 0 — gói đổi vật trong mốc (DP6b, DP9) và lên `2.29.0`.
- AC-8: Given khối INIT-CI-COPY-LIST của `acceptance-init`, gạch «Lớp chép CI» của mục `2.29.0` trong CHANGELOG và mốc `72eb55f3`, When rút danh sách chép, rút danh sách ghi chú kể, rồi so tệp nào đổi byte tới HEAD, Then tập tệp đổi BẰNG tập ghi chú kể — danh sách mong đợi đọc TỪ ghi chú, không gõ tay trong lệnh (Ngoài-1 của release-2-28-0).
- AC-9: Given mục `2.29.0` của `CHANGELOG.md` cùng vật nó mô tả, When đọc ghi chú nhận cho crm, Then (i) mục «crm, theo thứ tự» nói Mac Studio nhận ở quãng lặng của đợt r2, cài theo ĐÚNG thẻ `v2.29.0`, và LT2 crm đọc `b.cau_nguoi_gui ?? b.cau` — khớp `cauChoNguoiGui` và tài liệu khối dữ liệu; (ii) cách dùng lệnh kiểm bản cài (`--ref`, `--may`) khớp mã; (iii) lời về luật sản phẩm thiếu mô-đun khớp `khong-can-nguoi.mjs` và nói đúng danh sách chép CI không thêm tệp luật; (iv) hồ sơ để cũ hoá vì MÔI TRƯỜNG được gọi tên kèm lý do, không bị trình là lỗi của mốc.
- AC-10: Given số trong `.claude-plugin/plugin.json` ở HEAD khác gốc vòng, When chạy khoá `kiem_ban_cai_moc` (cổng số phiên bản của `kiem-ban-cai-sau-phat-hanh`), Then lệnh chạy TRỌN kiểm bản cài trên HEAD và thoát 0 với «TỔNG KẾT: ĐẠT 8/8 — HEAD (<sha>) cài đúng tag»; đỏ thì KHÔNG cắt mốc.
- AC-11: Given một kho khai luật sản phẩm (`PRODUCT-INVARIANTS.md` ở gốc) và bản cài gói thiếu `scripts/luat-san-pham.cjs`, When lệnh máy tự đóng hồ sơ làn V (`khong-can-nguoi.mjs --check|--write`) xét một hồ sơ xanh-sạch, Then lệnh thoát 2 với lý do có tên «kho khai luật sản phẩm … nhưng không nạp được scripts/luat-san-pham.cjs»; bản cài đủ mô-đun thì cho đi; kho KHÔNG khai luật thì thiếu mô-đun cũng không đổi gì.
- AC-12: Given cờ vàng «bản vẽ cũ» của câu tín hiệu (`CO_BAN_VE_CU` trong `scripts/tin-hieu.mjs`) và ba dòng của `lo-trinh-du-lieu.md`, When đọc số bản chúng nêu, Then cả năm chỗ nói 2.29 (bản đầu tiên chứa câu cho người gửi), không chỗ nào còn nói 2.28.

## Coverage

- Quét theo hai trục của nếp release-2-1-0→2-28-0, không quét lại: Trục A · vật của một lần cắt số (manifest | dòng khớp-phiên-bản | mô tả người-dùng-nhận-gì | phạm vi diff | gói đổi/không đổi | lớp chép CI | bản cài khớp thẻ) `[thước CE: hai mươi ba mốc trước đã dùng thật; ô «bản cài khớp thẻ» là khoá của KC1]` · Trục B · hành trình hồ sơ (bằng chứng | biên merge) `[thước CE: xanh_sach_check + ADR 0012]`. Ô Core → AC-1 · AC-2 · AC-3 · AC-4 · AC-5 · AC-6; gói `dieu-phoi` đổi vật → AC-7; lớp chép CI khớp ghi chú → AC-8 (đọc ghi chú, chiều đỏ trong lệnh); ghi chú nhận cho crm khớp vật → AC-9 (judgment); bản cài khớp thẻ → AC-10 (khoá KC1); hai sửa đi trong PR mốc → AC-11 · AC-12.

## Đường đo

- bỏ đường-đo — mốc phát hành không có hồ sơ cơ hội, không có ngưỡng nghiệm thu; người dùng nhận engine theo mốc (cùng căn cứ với release-2-3-0 → 2-28-0). Ngưỡng của các vòng đọc ở vòng crm đầu tiên sau khi Mac Studio cài 2.29.0 (mục crm của CHANGELOG 2.29.0).

## Out of scope

- Đổi dòng mã cổng ngoài hai sửa có tên (AC-11, AC-12) — mốc phát hành KHÔNG dựng răng mới (GUIDE §7.1); thêm `luat-san-pham.cjs` vào danh sách chép CI (đo: CI của kho tiêu thụ không truyền luật vào vị từ làn V — đẳng thức LV5 — nên chép thêm không đổi gì).
- Đưa dòng P200 vào bằng chứng của lượt chấm — AC-1/AC-2/AC-6 chấm MÃ THOÁT của vùng 3, P200 tự mang chiều đỏ.
- Sửa lộ trình kit `docs/plans/lo-trinh-kit.json` (mốc «Phát hành 2.29.0» thành đã phát hành) — PR riêng sau khi mốc gộp và có tag.
- Cài 2.29.0 vào crm và chạy `kiem-ban-cai --may` ở đó — việc của máy Mac Studio ở quãng lặng của đợt r2.
- Sửa Known limits của sáu vòng.

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

- Hạng T2: không tệp nào của PR mốc khớp `t3_paths` (`hooks/**`, `lib/**`, `pre-merge-check.sh`, `recheck-evidence.cjs`).
- Luật (b): mốc này là mốc KHO NHẬN kế tiếp — crm nhận ở quãng lặng của đợt r2; vòng meta của cửa sổ: một (KC1 `kiem-ban-cai-sau-phat-hanh`, chủ kho gọi tên 12/10).

---
schema_version: 1
feature: Phát hành kit 2.33.0 — road-map dễ dùng (RD1) + hồ sơ đã ký luôn tươi (K-A); lộ trình đọc trong một phút, bỏ mốc ngoài, giờ máy theo làn, lệnh giữ tươi
slug: release-2-33-0
owner: phanlemanh@gmail.com
risk_tier: T2               # vật chạm: 4 manifest + dòng khớp-phiên-bản của GUIDE + CHANGELOG + workspace hồ sơ + bản đồ + khoá executor — KHÔNG dính t3_paths
surfaces: [cli]
status: implemented
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-10-18T12:28:12Z
---

# Acceptance Contract: release-2-33-0

## Context

**Kho chờ nhận — đo được trước khi cắt:** `crm` (crm-onehub#375; Mac Studio nhận sau mốc) — lộ trình crm trên `onehub`
(b22c0a329, 18/10) đã cắt lại theo luật 17/10: 0 mốc ngoài, mọi mốc khai `loai`. Mốc lộ trình: «Phát hành kế sau 2.32.1».

**Cửa sổ này có gì** — suy từ kho bằng quan hệ (AC-4), không chép tay. Hồ sơ **được ký** trong cửa sổ: `road-map-de-dung`
(RD1, #381 → `84958e5a`) · `ho-so-da-ky-giu-tuoi` (K-A, #369 → `9f45073b`). Không vòng máy thông nào. Gộp sau chữ ký của cửa
sổ: #383 (sửa ca `lo-trinh-du-lieu-ngay`, chủ kho cho) · #382 (lộ trình kit gỡ ba mốc ngoài).

Số là **2.33.0** (minor): K-A thêm luật gate mới (nhãn «đỏ sẵn trên nền» lưới và kiểm lại đọc) và lệnh giữ tươi; RD1 thêm
năm khoá vào khối dữ liệu trang (chỉ thêm, bản 2 giữ), năm cờ có tên, luật cắt lượt mới (ADR 0026) — không gãy đường đọc-cũ. Năm dòng số, bảng dự báo, điều kiện tin cậy, dòng hiệu
chuẩn và ghi chú nhận cho crm nằm ở mục `2.33.0` của `CHANGELOG.md` — một nguồn, hồ sơ không chép lại.

Source input: `git log v2.32.1..HEAD` · nếp phát hành `_acceptance/release-2-32-1/` · Notes và Known limits của RD1, K-A ·
crm-onehub#375 · kit #308.

## Criteria

- AC-1: Given cây đã sửa, When chạy vùng 3 của suite plugins (nơi ca vĩnh viễn P200 sống), Then lệnh thoát 0 — P200 đọc số từ năm manifest và đòi `acceptance-gate`, `feature-loop`, `dieu-phoi`, `road-map` mang CÙNG một số hợp semver, `diagram-design` hợp semver; P200 đỏ thì vùng 3 thoát khác 0.
- AC-2: Given cây đã sửa, When chạy vùng 3 của suite plugins, Then lệnh thoát 0 — P200 dựng câu «Khớp phiên bản» của GUIDE từ các số đọc trong manifest rồi so (một nguồn — so với manifest, không so hằng).
- AC-3: Given cây đã sửa, When chạy mọi lệnh suite của lượt chấm (bốn mảnh scripts, hooks, ba vùng plugins, workflows) VÀ trọn bộ ca điều phối (`tests/dieu-phoi/**` — CI chạy, lượt chấm của RD1 không chạy: hạt giống `docs/plans/2026-10-18-hat-giong-bo-ca-dieu-phoi-ngoai-luot-cham.md`), Then mọi lệnh XANH và `product-map --check` khớp.
- AC-4: Given tập hồ sơ ĐƯỢC KÝ trong cửa sổ suy từ kho (`scripts/rel-cua-so.sh 5bd64bc9 …`, mốc = commit gắn tag `v2.32.1`), When so với danh sách «được ký» kể trong Context, Then hai tập BẰNG NHAU.
- AC-5: Given mốc `5bd64bc9` (tag `v2.32.1`), When so thư mục `diagram-design/` và số của nó với HEAD bằng git, Then thư mục KHÔNG có dòng đổi VÀ số bằng số ở mốc — `diagram-design` giữ `2.7.1` là đúng.
- AC-6: Given mô tả hai plugin, When chạy vùng 3 của suite plugins, Then lệnh thoát 0 — P200 đòi mô tả `acceptance-gate` CÓ mục của đúng số đang phát hành và mục đó của `feature-loop` TỰ khai cặp `acceptance-gate >= <số>`.
- AC-7: Given mốc `5bd64bc9`, When liệt tệp đổi dưới `dieu-phoi/` và `road-map/` tới HEAD bằng git, Then tập tệp đổi BẰNG đúng hai manifest — hai gói chỉ đổi số, như CHANGELOG mục `2.33.0` kể.
- AC-8: Given khối INIT-CI-COPY-LIST của `acceptance-init`, gạch «Lớp chép CI» của mục `2.33.0` trong CHANGELOG và mốc `5bd64bc9`, When rút danh sách chép, rút danh sách ghi chú kể, rồi so tệp nào đổi byte tới HEAD, Then tập tệp đổi BẰNG tập ghi chú kể (tệp lệnh của `release-2-29-0`, dùng lại).
- AC-9: Given mục `2.33.0` của `CHANGELOG.md` cùng vật nó mô tả, When đọc ghi chú nhận cho crm, Then (o) mục nói đúng hai việc của K-A — CI `fetch-depth: 0` khi bật khoá `do_san_tren_nen`, bảy mục crm đứng chờ K-A có công cụ khi cài và ngưỡng của K-A đọc sau khi cài mốc và bật khoá — khớp sổ, hồ sơ cơ hội và hợp đồng của `ho-so-da-ky-giu-tuoi`; (i) crm được dặn cắt lại lộ trình bằng skill cắt lượt mới và lộ trình cũ còn mốc ngoài/mốc chưa khai loại sẽ hiện cờ vàng có tên, không có đường đọc riêng; (ii) lời về lớp chép CI khớp nhãn trong `commands/acceptance-init.md`; (iii) lời về năm khoá mô hình hiển thị (`ten_hien_thi`, `moc[].hien`/`viec_hien`/`con_lai`, `chua_hen_moc`) khớp `skills/acceptance/references/lo-trinh-du-lieu.md` và hợp đồng `road-map-de-dung`.
- AC-10: Given số trong `.claude-plugin/plugin.json` ở HEAD khác gốc vòng, When chạy khoá `kiem_ban_cai_moc`, Then lệnh chạy TRỌN kiểm bản cài trên HEAD và thoát 0 với «TỔNG KẾT: ĐẠT 8/8 — HEAD (<sha>) cài đúng tag»; đỏ thì KHÔNG cắt mốc.

## Coverage

- Quét theo hai trục của nếp release-2-1-0→2-32-1, không quét lại: Trục A · vật của một lần cắt số (manifest | dòng khớp-phiên-bản | mô tả người-dùng-nhận-gì | phạm vi diff | gói đổi/không đổi | lớp chép CI | bản cài khớp thẻ) `[thước CE: hai mươi tám mốc trước đã dùng thật]` · Trục B · hành trình hồ sơ (bằng chứng | biên merge) `[thước CE: xanh_sach_check + ADR 0012]`. Ô Core → AC-1 · AC-2 · AC-3 · AC-4 · AC-5 · AC-6; hai gói chỉ đổi số → AC-7; lớp chép CI khớp ghi chú → AC-8; ghi chú nhận cho crm khớp vật → AC-9 (judgment); bản cài khớp thẻ → AC-10 (khoá KC1). AC-3 thêm bộ ca điều phối vì đúng lỗ đo đã gặp ở RD1.

## Đường đo

- bỏ đường-đo — mốc phát hành không có hồ sơ cơ hội; ngưỡng của vòng RD1 sống ở hồ sơ `road-map-de-dung` và đọc ở PR nhận của crm.

## Out of scope

- Đổi dòng mã cổng — mốc phát hành KHÔNG dựng răng mới (GUIDE §7.1).
- Cắt lại lộ trình kit `docs/plans/lo-trinh-kit.json` — đã làm ở PR riêng của điều phối (#382, gỡ 3 mốc ngoài; bộ đọc chung nay 0 cờ trên lộ trình kit).
- Sửa Known limits của RD1 (16) và K-A (10) — vòng sau.
- Cài 2.33.0 vào crm, vẽ lại `LO-TRINH.html` của crm — việc của máy Mac Studio sau mốc.

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

- Hạng T2: không tệp nào của PR mốc khớp `t3_paths`.
- Ghim lại ở mốc: chỉ hồ sơ của cửa sổ, như nếp 2.32.x.

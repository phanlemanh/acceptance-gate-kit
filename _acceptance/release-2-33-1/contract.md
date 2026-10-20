---
schema_version: 1
feature: Phát hành kit 2.33.1 — bản vá mang giao tiếp giữa các phiên có mã và hạn (GT1), vòng mở không mất dấu (GT2), nháy đơn trong config (R3), lời mời cổng không qua nút (KY1) và sửa bản đồ ở lệnh đóng cổng
slug: release-2-33-1
owner: phanlemanh@gmail.com
risk_tier: T2               # vật chạm: 4 manifest + dòng khớp-phiên-bản của GUIDE + CHANGELOG + workspace hồ sơ + lộ trình kit + bản đồ + hai hạt giống + khoá executor — KHÔNG dính t3_paths
surfaces: [cli]
status: implemented
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-10-20T03:52:34Z
---

# Acceptance Contract: release-2-33-1

## Context

**Kho chờ nhận — đo được trước khi cắt:** `crm` (crm-onehub#375; MacBook Pro đưa bản vào crm sau mốc, vai nhận kit từ
19/10). Mốc lộ trình: «Phát hành kế sau 2.33.0», đổi tên trong PR này thành bản vá 2.33.1.

**Quyết của chủ kho:** 19/10 «GT2 xong sẽ cắt bản vá»; 20/10 «ưu tiên KY1 để cắt». Cắt ngay khi GT2 và KY1 vào nhánh chính
(`b9090673`, CI xanh), không chờ ngày 22/10 của lộ trình.

**Cửa sổ này có gì** — suy từ kho bằng quan hệ (AC-4), không chép tay. Hồ sơ **được ký** trong cửa sổ:
`vong-mo-co-chu-giu` (GT1, #387 → `43c748de`) · `vong-mo-khong-mat-dau` (GT2, #390 → `76f23084`) · `nhay-don-nhan-doi`
(R3, #384 → `399fa89e`) · `moi-cong-khong-qua-nut` (KY1, #391 → `b9090673`). Ngoài vòng: commit `b2c058d8` (sửa khối
`MAP-STAGE` của bốn thân đóng cổng, đẩy thẳng lên nhánh chính 20/10) · #386 (dòng KC1 của 2.33.0) · #388 (lộ trình kit
chia ba làn).

Số là **2.33.1** (patch) do chủ kho đặt. Khai thẳng ở CHANGELOG: GT1 thêm lệnh `tin` và một khối hook `Stop` mới trong gói
`dieu-phoi` — theo nếp «minor cho bề mặt mới» lẽ ra là 2.34.0; không gãy đường đọc-cũ. Năm dòng số, dự báo, điều kiện tin
cậy, dòng hiệu chuẩn và ghi chú nhận cho crm nằm ở mục `2.33.1` của `CHANGELOG.md` — một nguồn, hồ sơ không chép lại.

Source input: `git log v2.33.0..HEAD` · nếp phát hành `_acceptance/release-2-33-0/`, `_acceptance/release-2-32-1/` · Notes và
Known limits của GT1, GT2, R3, KY1 · crm-onehub#375 · kit #308.

## Criteria

- AC-1: Given cây đã sửa, When chạy vùng 3 của suite plugins (nơi ca vĩnh viễn P200 sống), Then lệnh thoát 0 — P200 đọc số từ năm manifest và đòi `acceptance-gate`, `feature-loop`, `dieu-phoi`, `road-map` mang CÙNG một số hợp semver, `diagram-design` hợp semver; P200 đỏ thì vùng 3 thoát khác 0.
- AC-2: Given cây đã sửa, When chạy vùng 3 của suite plugins, Then lệnh thoát 0 — P200 dựng câu «Khớp phiên bản» của GUIDE từ các số đọc trong manifest rồi so (một nguồn — so với manifest, không so hằng).
- AC-3: Given cây đã sửa, When chạy mọi lệnh suite của lượt chấm (bốn mảnh scripts, hooks, ba vùng plugins, workflows) VÀ trọn bộ ca điều phối (`tests/dieu-phoi/**`), Then mọi lệnh XANH và `product-map --check` khớp (PRODUCT-MAP.md và LO-TRINH.html vẽ lại sau khi sửa lộ trình kit).
- AC-4: Given tập hồ sơ ĐƯỢC KÝ trong cửa sổ suy từ kho (`scripts/rel-cua-so.sh 77df595a …`, mốc = commit gắn tag `v2.33.0`), When so với danh sách «được ký» kể trong Context, Then hai tập BẰNG NHAU.
- AC-5: Given mốc `77df595a` (tag `v2.33.0`), When so thư mục `diagram-design/` và số của nó với HEAD bằng git, Then thư mục KHÔNG có dòng đổi VÀ số bằng số ở mốc — `diagram-design` giữ `2.7.1` là đúng.
- AC-6: Given mô tả hai plugin, When chạy vùng 3 của suite plugins, Then lệnh thoát 0 — P200 đòi mô tả `acceptance-gate` CÓ mục của đúng số đang phát hành và mục đó của `feature-loop` TỰ khai cặp `acceptance-gate >= <số>`.
- AC-7: Given mốc `77df595a`, When liệt tệp đổi dưới `road-map/` tới HEAD bằng git, Then tập tệp đổi BẰNG đúng manifest của nó — `road-map` chỉ đổi số, như CHANGELOG mục `2.33.1` kể (`dieu-phoi` đổi vật ở mốc này nên không vào phép so).
- AC-8: Given khối INIT-CI-COPY-LIST của `acceptance-init`, gạch «Lớp chép CI» của mục `2.33.1` trong CHANGELOG và mốc `77df595a`, When rút danh sách chép, rút danh sách ghi chú kể, rồi so tệp nào đổi byte tới HEAD, Then tập tệp đổi BẰNG tập ghi chú kể (tệp lệnh của `release-2-29-0`, dùng lại).
- AC-9: Given mục `2.33.1` của `CHANGELOG.md` cùng nguồn nó chép, When đọc từng mục con, Then (o) mỗi câu mô tả vòng (câu giao, lý do, giới hạn trích) là chữ của hợp đồng hồ sơ ấy, không tóm tắt lại, và số giới hạn đã khai khớp Notes của hợp đồng; (i) mục sửa `MAP-STAGE` là chữ của mục CHANGELOG mà commit `b2c058d8` thêm; (ii) lời dặn `tin vai` lại khớp dòng sửa S4-r1 trong sổ GT1 và lệnh `tin vai` khớp `dieu-phoi/README.md`; (iii) lời về lớp chép CI khớp nhãn trong `commands/acceptance-init.md`; (iv) đoạn «Vì sao 2.33.1» không giấu việc GT1 thêm bề mặt mới.
- AC-10: Given số trong `.claude-plugin/plugin.json` ở HEAD khác gốc vòng, When chạy khoá `kiem_ban_cai_moc`, Then lệnh chạy TRỌN kiểm bản cài trên HEAD và thoát 0 với «TỔNG KẾT: ĐẠT 8/8 — HEAD (<sha>) cài đúng tag»; đỏ thì KHÔNG cắt mốc.

## Coverage

- Quét theo hai trục của nếp release-2-1-0→2-33-0, không quét lại: Trục A · vật của một lần cắt số (manifest | dòng khớp-phiên-bản | mô tả người-dùng-nhận-gì | phạm vi diff | gói đổi/không đổi | lớp chép CI | bản cài khớp thẻ) `[thước CE: hai mươi chín mốc trước đã dùng thật]` · Trục B · hành trình hồ sơ (bằng chứng | biên merge) `[thước CE: xanh_sach_check + ADR 0012]`. Ô Core → AC-1 · AC-2 · AC-3 · AC-4 · AC-5 · AC-6; gói chỉ đổi số → AC-7; lớp chép CI khớp ghi chú → AC-8; ghi chú nhận chép đúng chữ nguồn → AC-9 (judgment, bài học E9 mốc 2.33.0); bản cài khớp thẻ → AC-10 (khoá KC1).

## Đường đo

- bỏ đường-đo — mốc phát hành không có hồ sơ cơ hội; ngưỡng của GT1, GT2, KY1 sống ở hồ sơ của chúng và đọc ở PR nhận của crm.

## Out of scope

- Đổi dòng mã cổng — mốc phát hành KHÔNG dựng răng mới (GUIDE §7.1).
- Sửa Known limits của GT1 (17), GT2 (9), R3 (1), KY1 (10) — vòng sau.
- Sửa hai lỗi thẻ Cổng Bằng chứng KY2, KY3 — chỉ ghi hạt giống trong PR này.
- Cài 2.33.1 vào crm, `tin vai` lại trên ba máy, vẽ lại `LO-TRINH.html` của crm — việc của MacBook Pro sau mốc.

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

- Hạng T2: không tệp nào của PR mốc khớp `t3_paths`.
- Ghim lại ở mốc: chỉ hồ sơ của cửa sổ, như nếp 2.32.x và 2.33.0.
- Cùng PR, chủ kho giao: lộ trình kit `docs/plans/lo-trinh-kit.json` — mốc «Phát hành kế sau 2.33.0» đổi tên thành bản vá
  2.33.1 (GT1, GT2, R3, KY1), thêm hàng KY1; vẽ lại `LO-TRINH.html` bằng `product-map.mjs`.
- Hai hạt giống ghi ở PR mốc (ô này trích lại tên tệp, luật VC8): `docs/plans/2026-10-20-hat-giong-the-dem-eval-mang-sang-thanh-do.md`
  (KY2) · `docs/plans/2026-10-20-hat-giong-the-pass-giau-muc-trong-hop-dong.md` (KY3).
- Mục «Chưa phát hành» của CHANGELOG bỏ: phần sửa `MAP-STAGE` chuyển nguyên văn vào mục 2.33.1; phần K-A sót lại đã phát
  hành ở 2.33.0.

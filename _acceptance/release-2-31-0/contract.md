---
schema_version: 1
feature: Phát hành kit 2.31.0 — đóng số cho cửa sổ 2.30.0 → 2.31.0 (bảng Ngoài-n có căn cứ · đường nền không tính tệp của chính vòng · mốc là chiến dịch · rà soát lộ trình và gói road-map), để crm nhận một lần sau 2.30; làn V, không dựng răng
slug: release-2-31-0
owner: phanlemanh@gmail.com
risk_tier: T2               # vật chạm: 4 manifest + dòng khớp-phiên-bản của GUIDE + CHANGELOG + workspace hồ sơ + bản đồ + 4 khoá executor — KHÔNG dính t3_paths
surfaces: [cli]
status: verified
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-10-15T01:18:12Z
---

# Acceptance Contract: release-2-31-0

## Context

**Kho chờ nhận — đo được trước khi cắt:** `crm`. Neo ở kho tiêu thụ: crm issue `phanlemanh/crm-onehub#375` — máy Mac
Studio đang nhận 2.30.0 qua crm PR #413 (chưa gộp 15/10); 2.31.0 là đợt nhận kế. Phạm vi chốt giữa hai máy điều phối
trên kit #308 (15/10 00:29Z): BN1 + NV1 (máy M5) + MC1 + RM1 (máy MacBook Pro) vào cùng một mốc để crm nhận MỘT lần cắt
thay vì hai. Hàng MC1 + RM1 chuyển sang mốc «Phát hành 2.31.0» của lộ trình kit ngay trong PR mốc (điều phối M5 quyết
07:00Z 15/10 sau khi hỏi MacBook Pro trên #308; chủ kho đồng ý), kèm sửa ca MC-11 — con trỏ thay thế ở CHANGELOG. Gốc của bốn vòng: BN1 — crm `kanban-viec` (14/10); NV1 — crm#375 (13/10 16:51Z); MC1, RM1 —
`crm/_acceptance/tin-hieu-tu-ve-kho/`.

**Cửa sổ này có gì** — suy từ kho bằng quan hệ (AC-4), không chép tay. Hồ sơ **được ký** trong cửa sổ (bốn):

- Thẻ Cổng Bằng chứng: `bang-ngoai-n-co-can-cu` (BN1, T3, #349 — máy M5).
- Đường nền: `nen-khong-tinh-tep-cua-vong` (NV1, T2, #353 — máy M5).
- Lộ trình: `moc-la-chien-dich` (MC1, T2, #354 — máy MacBook Pro) · `ra-soat-lo-trinh` (RM1, T2, #355 — máy MacBook
  Pro; thêm gói thứ năm `road-map`).

Số là **2.31.0** (minor): mốc thêm bề mặt mới cho kho tiêu thụ — gói cài được `road-map`, lệnh `lo-trinh.mjs
--ra-soat`, cờ vàng mới trên trang lộ trình và thẻ khởi động, mục «Dòng vàng» của đường nền, cột căn cứ trên thẻ Cổng
Bằng chứng. GUIDE: «minor cho luật gate mới». Mốc đi **làn V**. Năm dòng số, bảng dự báo, điều kiện tin cậy, dòng hiệu
chuẩn và ghi chú nhận mốc cho crm nằm ở mục `2.31.0` của `CHANGELOG.md` — một nguồn, hồ sơ không chép lại.

Source input: `git log v2.30.0..HEAD` · nếp phát hành `_acceptance/release-2-30-0/` · mục Notes và Known limits của bốn
hồ sơ · crm#375 · kit #308.

## Criteria

- AC-1: Given cây đã sửa, When chạy vùng 3 của suite plugins (nơi ca vĩnh viễn P200 sống), Then lệnh thoát 0 — P200 đọc số từ năm manifest và đòi `acceptance-gate`, `feature-loop`, `dieu-phoi`, `road-map` mang CÙNG một số hợp semver, `diagram-design` hợp semver; P200 đỏ thì vùng 3 thoát khác 0.
- AC-2: Given cây đã sửa, When chạy vùng 3 của suite plugins, Then lệnh thoát 0 — P200 dựng câu «Khớp phiên bản» của GUIDE từ các số đọc trong manifest rồi so (một nguồn — so với manifest, không so hằng).
- AC-3: Given cây đã sửa, When chạy mọi lệnh suite của lượt chấm (bốn mảnh scripts, hooks, ba vùng plugins, workflows), Then cả chín lệnh XANH và `product-map --check` khớp (cùng khoá `kiem_ban_cai_moc` của AC-10: mười một khoá của `feature_loop.suite_keys`).
- AC-4: Given tập hồ sơ ĐƯỢC KÝ trong cửa sổ suy từ kho (`scripts/rel-cua-so.sh 7cf78c36 …`, mốc = commit gắn tag `v2.30.0`), When so với danh sách «được ký» kể trong Context, Then hai tập BẰNG NHAU.
- AC-5: Given mốc `7cf78c36` (tag `v2.30.0`), When so thư mục `diagram-design/` và số của nó với HEAD bằng git, Then thư mục KHÔNG có dòng đổi VÀ số bằng số ở mốc — `diagram-design` giữ `2.7.1` là đúng.
- AC-6: Given mô tả hai plugin, When chạy vùng 3 của suite plugins, Then lệnh thoát 0 — P200 đòi mô tả `acceptance-gate` CÓ mục của đúng số đang phát hành và mục đó của `feature-loop` TỰ khai cặp `acceptance-gate >= <số>`. *Nội dung* các vế người-dùng-nhận-gì đọc trực tiếp trong diff.
- AC-7: Given mốc `7cf78c36`, When liệt tệp đổi dưới `dieu-phoi/` tới HEAD bằng git, Then tập tệp đổi BẰNG đúng `{dieu-phoi/.claude-plugin/plugin.json}` — gói lên `2.31.0` mà không đổi vật, khớp lời «`dieu-phoi/` không đổi một byte ngoài số» của CHANGELOG.
- AC-8: Given khối INIT-CI-COPY-LIST của `acceptance-init`, gạch «Lớp chép CI» của mục `2.31.0` trong CHANGELOG và mốc `7cf78c36`, When rút danh sách chép, rút danh sách ghi chú kể, rồi so tệp nào đổi byte tới HEAD, Then tập tệp đổi BẰNG tập ghi chú kể — danh sách mong đợi đọc TỪ ghi chú (tệp lệnh của `release-2-29-0`, dùng lại).
- AC-9: Given mục `2.31.0` của `CHANGELOG.md` cùng vật nó mô tả, When đọc ghi chú nhận cho crm, Then (i) mục «crm, theo thứ tự» nói crm nhận SAU 2.30.0 (crm PR #413) — chưa gộp thì làm trọn bước 2.30.0 trước — và cài theo ĐÚNG thẻ `v2.31.0`; (ii) lời «bộ đọc cũ đọc tệp khuôn mới không lệch» và dòng `Căn cứ:` khớp `lib/out-of-contract.cjs`; (iii) lời về lệnh `--ra-soat`, chính sách tuổi/trần, gói `road-map` và lệnh `/road-map:xem` khớp `road-map/README.md`, `road-map/commands/xem.md` và hợp đồng `ra-soat-lo-trinh`; (iv) lời về cờ vàng MC1 (dòng «kho chưa khai lộ trình» trên thẻ khởi động, số cờ đo trên crm) khớp `commands/start.md` và hợp đồng `moc-la-chien-dich`.
- AC-10: Given số trong `.claude-plugin/plugin.json` ở HEAD khác gốc vòng, When chạy khoá `kiem_ban_cai_moc` (cổng số phiên bản của `kiem-ban-cai-sau-phat-hanh`), Then lệnh chạy TRỌN kiểm bản cài trên HEAD và thoát 0 với «TỔNG KẾT: ĐẠT 8/8 — HEAD (<sha>) cài đúng tag»; đỏ thì KHÔNG cắt mốc.

## Coverage

- Quét theo hai trục của nếp release-2-1-0→2-30-0, không quét lại: Trục A · vật của một lần cắt số (manifest | dòng khớp-phiên-bản | mô tả người-dùng-nhận-gì | phạm vi diff | gói đổi/không đổi | lớp chép CI | bản cài khớp thẻ) `[thước CE: hai mươi lăm mốc trước đã dùng thật]` · Trục B · hành trình hồ sơ (bằng chứng | biên merge) `[thước CE: xanh_sach_check + ADR 0012]`. Ô Core → AC-1 · AC-2 · AC-3 · AC-4 · AC-5 · AC-6; gói `dieu-phoi` lên số không đổi vật → AC-7; gói mới `road-map` → AC-1 (P200 khoá số của nó); lớp chép CI khớp ghi chú → AC-8; ghi chú nhận cho crm khớp vật → AC-9 (judgment); bản cài khớp thẻ → AC-10 (khoá KC1).

## Đường đo

- bỏ đường-đo — mốc phát hành không có hồ sơ cơ hội, không có ngưỡng nghiệm thu; người dùng nhận engine theo mốc (cùng căn cứ với release-2-3-0 → 2-30-0). Ngưỡng của các vòng đọc ở vòng crm đầu tiên sau khi Mac Studio cài 2.31.0 (mục crm của CHANGELOG 2.31.0).

## Out of scope

- Đổi dòng mã cổng — mốc phát hành KHÔNG dựng răng mới (GUIDE §7.1).
- Đưa dòng P200 vào bằng chứng của lượt chấm — AC-1/AC-2/AC-6 chấm MÃ THOÁT của vùng 3, P200 tự mang chiều đỏ.
- Sửa lộ trình kit `docs/plans/lo-trinh-kit.json` sau mốc (đánh dấu mốc 2.31.0 đã phát hành) — PR riêng sau khi mốc gộp và có tag.
- Cài 2.31.0 vào crm, vẽ lại `LO-TRINH.html` của crm, chạy `kiem-ban-cai --may` ở đó — việc của máy Mac Studio.
- Sửa Known limits của bốn vòng.

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

- Hạng T2: không tệp nào của PR mốc khớp `t3_paths` (`hooks/**`, `lib/**`, `pre-merge-check.sh`, `recheck-evidence.cjs`).
- Luật (b): mốc này là mốc KHO NHẬN kế tiếp — crm nhận sau 2.30.0; vòng meta của cửa sổ: MC1 (CỘNG, chủ kho gọi tên) và RM1 (ngoại lệ luật chiều rộng (b) ghi ở sổ của hồ sơ ấy).
- Ghim lại ở mốc: bảy hồ sơ xanh ở `repin-20261015T083739Z-10776`; `release-2-30-0` để cũ hoá theo cấu tạo.
- Plugin phạm vi user trên máy M5 GIỮ 2.28 tới khi crm cài 2.30 — mốc không nâng bản cài của máy cắt.

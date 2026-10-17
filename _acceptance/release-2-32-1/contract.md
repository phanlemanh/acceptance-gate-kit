---
schema_version: 1
feature: Phát hành kit 2.32.1 — bản vá của 2.32.0 cho crm-onehub#375 (trang lộ trình vẽ trong worktree khớp CI), để crm nhận 2.32.1 thay cho 2.32.0; làn V, không dựng răng
slug: release-2-32-1
owner: phanlemanh@gmail.com
risk_tier: T2               # vật chạm: 4 manifest + dòng khớp-phiên-bản của GUIDE + CHANGELOG + workspace hồ sơ + bản đồ + 4 khoá executor — KHÔNG dính t3_paths
surfaces: [cli]
status: signed-off
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-10-17T16:31:55Z
---

# Acceptance Contract: release-2-32-1

## Context

**Kho chờ nhận — đo được trước khi cắt:** `crm`. Neo ở kho tiêu thụ: crm issue `phanlemanh/crm-onehub#375` — máy Mac
Studio đang nhận 2.32.0 ở PR crm #463 thì bước Product map `--check` của CI đỏ hai lần; crm nhận 2.32.1 THAY CHO 2.32.0,
sau khi chuỗi đêm M5 gộp xong (~03:00Z 18/10, điều phối báo 17/10). Mốc lộ trình: bản vá không có mốc riêng — đi sau mốc
«Gói road-map hoàn tất theo B′» (2.32.0).

**Cửa sổ này có gì** — suy từ kho bằng quan hệ (AC-4), không chép tay. Hồ sơ **được ký** trong cửa sổ (một):
`ve-lo-trinh-doc-tin-hieu-cua-cay` (VA2, #378 → `77b3750e`). Không vòng máy thông nào.

Số là **2.32.1** (patch): sửa hành vi của 2.32.0, không thêm lệnh, khoá cấu hình hay tệp mới trong lớp chép CI. Mốc đi
**làn V**. Năm dòng số, bảng dự báo, điều kiện tin cậy, dòng hiệu chuẩn và ghi chú nhận cho crm nằm ở mục `2.32.1` của
`CHANGELOG.md` — một nguồn, hồ sơ không chép lại.

Source input: `git log v2.32.0..HEAD` · nếp phát hành `_acceptance/release-2-32-0/` · Notes và Known limits của VA2 ·
crm-onehub#375 · kit #308.

## Criteria

- AC-1: Given cây đã sửa, When chạy vùng 3 của suite plugins (nơi ca vĩnh viễn P200 sống), Then lệnh thoát 0 — P200 đọc số từ năm manifest và đòi `acceptance-gate`, `feature-loop`, `dieu-phoi`, `road-map` mang CÙNG một số hợp semver, `diagram-design` hợp semver; P200 đỏ thì vùng 3 thoát khác 0.
- AC-2: Given cây đã sửa, When chạy vùng 3 của suite plugins, Then lệnh thoát 0 — P200 dựng câu «Khớp phiên bản» của GUIDE từ các số đọc trong manifest rồi so (một nguồn — so với manifest, không so hằng).
- AC-3: Given cây đã sửa, When chạy mọi lệnh suite của lượt chấm (bốn mảnh scripts, hooks, ba vùng plugins, workflows), Then cả chín lệnh XANH và `product-map --check` khớp (cùng khoá `kiem_ban_cai_moc` của AC-10: mười một khoá của `feature_loop.suite_keys`).
- AC-4: Given tập hồ sơ ĐƯỢC KÝ trong cửa sổ suy từ kho (`scripts/rel-cua-so.sh f7d95695 …`, mốc = commit gắn tag `v2.32.0`), When so với danh sách «được ký» kể trong Context, Then hai tập BẰNG NHAU.
- AC-5: Given mốc `f7d95695` (tag `v2.32.0`), When so thư mục `diagram-design/` và số của nó với HEAD bằng git, Then thư mục KHÔNG có dòng đổi VÀ số bằng số ở mốc — `diagram-design` giữ `2.7.1` là đúng.
- AC-6: Given mô tả hai plugin, When chạy vùng 3 của suite plugins, Then lệnh thoát 0 — P200 đòi mô tả `acceptance-gate` CÓ mục của đúng số đang phát hành và mục đó của `feature-loop` TỰ khai cặp `acceptance-gate >= <số>`. *Nội dung* các vế người-dùng-nhận-gì đọc trực tiếp trong diff.
- AC-7: Given mốc `f7d95695`, When liệt tệp đổi dưới `dieu-phoi/` và `road-map/` tới HEAD bằng git, Then tập tệp đổi BẰNG đúng hai manifest — hai gói chỉ đổi số, như CHANGELOG mục `2.32.1` kể.
- AC-8: Given khối INIT-CI-COPY-LIST của `acceptance-init`, gạch «Lớp chép CI» của mục `2.32.1` trong CHANGELOG và mốc `f7d95695`, When rút danh sách chép, rút danh sách ghi chú kể, rồi so tệp nào đổi byte tới HEAD, Then tập tệp đổi BẰNG tập ghi chú kể — danh sách mong đợi đọc TỪ ghi chú (tệp lệnh của `release-2-29-0`, dùng lại).
- AC-9: Given mục `2.32.1` của `CHANGELOG.md` cùng vật nó mô tả, When đọc ghi chú nhận cho crm, Then (i) mục «crm, theo thứ tự» nói crm nhận 2.32.1 THAY CHO 2.32.0, sau chuỗi đêm M5 (~03:00Z 18/10), cài theo ĐÚNG thẻ `v2.32.1`; (ii) lời về lớp chép CI (hai tệp đổi: `scripts/product-map.mjs` luôn cần, `scripts/tin-hieu.mjs` khi khai `tin_hieu`) khớp nhãn trong `commands/acceptance-init.md`; (iii) lời về hành vi mới (trang chỉ lấy ý đã theo dõi trong cây đang vẽ; bộ đọc tương tác giữ thư mục chính; chỗ xem ý chưa commit là thẻ khởi động và `--chua-gom`, không phải `/road-map:xem`) khớp `scripts/tin-hieu.mjs`, `scripts/product-map.mjs` và hợp đồng `ve-lo-trinh-doc-tin-hieu-cua-cay`.
- AC-10: Given số trong `.claude-plugin/plugin.json` ở HEAD khác gốc vòng, When chạy khoá `kiem_ban_cai_moc` (cổng số phiên bản của `kiem-ban-cai-sau-phat-hanh`), Then lệnh chạy TRỌN kiểm bản cài trên HEAD và thoát 0 với «TỔNG KẾT: ĐẠT 8/8 — HEAD (<sha>) cài đúng tag»; đỏ thì KHÔNG cắt mốc.

## Coverage

- Quét theo hai trục của nếp release-2-1-0→2-32-0, không quét lại: Trục A · vật của một lần cắt số (manifest | dòng khớp-phiên-bản | mô tả người-dùng-nhận-gì | phạm vi diff | gói đổi/không đổi | lớp chép CI | bản cài khớp thẻ) `[thước CE: hai mươi bảy mốc trước đã dùng thật]` · Trục B · hành trình hồ sơ (bằng chứng | biên merge) `[thước CE: xanh_sach_check + ADR 0012]`. Ô Core → AC-1 · AC-2 · AC-3 · AC-4 · AC-5 · AC-6; hai gói chỉ đổi số → AC-7; lớp chép CI khớp ghi chú → AC-8; ghi chú nhận cho crm khớp vật → AC-9 (judgment); bản cài khớp thẻ → AC-10 (khoá KC1).

## Đường đo

- bỏ đường-đo — mốc phát hành không có hồ sơ cơ hội; ngưỡng của vòng VA2 sống ở `_acceptance/ve-lo-trinh-doc-tin-hieu-cua-cay/opportunity.md` và đọc ở PR nhận của crm (mục crm bước 6 của CHANGELOG 2.32.1).

## Out of scope

- Đổi dòng mã cổng — mốc phát hành KHÔNG dựng răng mới (GUIDE §7.1).
- Sửa câu sai về `/road-map:xem` trong `skills/acceptance/references/lo-trinh-du-lieu.md` (Ngoài-3 của VA2) — tài liệu engine, cần hồ sơ riêng; CHANGELOG 2.32.1 nói đúng chỗ xem.
- Sửa lộ trình kit `docs/plans/lo-trinh-kit.json` sau mốc — PR riêng sau khi mốc gộp và có tag, kèm dòng kiểm bản cài sau thẻ.
- Cài 2.32.1 vào crm, vẽ lại `LO-TRINH.html` của crm — việc của máy Mac Studio sau chuỗi đêm M5.

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

- Hạng T2: không tệp nào của PR mốc khớp `t3_paths`.
- Ghim lại ở mốc: chỉ hồ sơ của cửa sổ (VA2), như nếp 2.32.0; hồ sơ khác cũ hoá vì `scripts/tin-hieu.mjs` đổi là trạng thái chấp nhận được giữa hai mốc (GUIDE §7.1).
- Known limits — chọn ở Cổng Bằng chứng 2026-10-18:
  - Ngoài-1: hình «hai loại bộ đọc» và hợp đồng của hồ sơ VA2 lặp câu sai «ý chưa commit xem được ở /road-map:xem» (cùng gốc Ngoài-3 của VA2); ghi chú 2.32.1 chỉ đúng chỗ xem.
  - Ngoài-2: git lỗi lạ trong một kho, hay nguồn tín hiệu khai bằng đường tuyệt đối, làm trang lặng lẽ hiện cả ý chưa commit hoặc mất mọi ý (trùng Ngoài-4 của VA2).
  - Ngoài-3: tài liệu dữ liệu lộ trình vẫn nói ý chưa commit hiện ở /road-map:xem (trùng Ngoài-3 của VA2).
  - Ngoài-4: ca kiểm «kho giữ mọi ý ngoài git» của VA2 thiếu đối chứng dương và chiều đỏ riêng, nên một hỏng tương lai ở ca hiếm này có thể lọt.

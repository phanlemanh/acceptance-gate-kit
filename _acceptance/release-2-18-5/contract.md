---
schema_version: 1
feature: Phát hành kit 2.18.5 — đóng số cho cửa sổ 2.18.4 → 2.18.5 (một vòng đã ký «cham-khong-tu-dot-luot»: lượt chấm thôi tự đốt lượt vì hạ tầng, thẻ Cổng Phạm vi hiện đủ điều người ký cần), để crm cài vào và thôi phải cho vượt trần hay gõ --round tay khi lượt chấm chặn vì hạ tầng; làn V, không dựng răng
slug: release-2-18-5
owner: phanlemanh@gmail.com
risk_tier: T2               # vật chạm: 2 manifest + dòng khớp-phiên-bản của GUIDE + CHANGELOG + workspace hồ sơ + bản đồ + 2 khoá executor — KHÔNG dính t3_paths, KHÔNG đổi một dòng mã cổng
surfaces: [cli]
status: implemented
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-09-27T11:26:59Z
---

# Acceptance Contract: release-2-18-5

## Context

**Kho chờ nhận — đo được trước khi cắt:** `crm` đã cài 2.18.4 ở gốc kho và 9/16 cây (đo 27/09 trên
`installed_plugins.json`). Lượt 4 lộ trình OKR (`crm/_acceptance/cap-nhat-tuan-okr`) đốt hai round và
một lượt gọi người mà không có lỗi sản phẩm nào; `quen-mat-khau` round 3 và `okr-soat-anh-luot-3`
round 1 khoá vì dòng SUITE mang lý do tự do. Bản sửa đã gộp (#223) nhưng chưa phát hành — crm vẫn
chạy bộ chấm 2.18.4. Owner gọi mốc 27/09: «Thực hiện cắt mốc».

**Cửa sổ này có gì** — suy từ kho bằng quan hệ (AC-4), không chép tay:

- `cham-khong-tu-dot-luot` (T3, ký 27/09, PR #223) — mã thoát rút từ dấu `__EXIT=` của khung bọc
  lệnh máy; cờ `killed_by_tool` tới sổ chạy; dòng SUITE không chạy được có lý do ra nhãn hạ tầng và
  thử lại cùng round; `verified_commit` lấy từ máy; thẻ Cổng Phạm vi hiện từng mục «không làm» và mọi
  bảng phản biện; bảng chi phí S4 tách theo khối; ảnh ui neo trong hồ sơ.

Vật engine đổi trong cửa sổ: tám tệp (đo: `git diff --stat ba2ed24b HEAD -- scripts lib hooks
skills feature-loop commands vendor`) — `feature-loop/workflows/acceptance-verify.js`,
`lib/nhan-canh-gay.cjs`, `scripts/gate-card.js`, `feature-loop/scripts/wf-usage.mjs`,
`feature-loop/skills/feature-loop/SKILL.md`, `commands/acceptance-card.md`,
`skills/acceptance/references/eval-executors.md`, `skills/acceptance/references/tool-kill-rule.md`.
**`lib/nhan-canh-gay.cjs` nằm trong lớp chép CI** (khối `INIT-CI-COPY-LIST`, GUIDE §5.3): kho còn
đường chép phải chép lại đúng tệp này khi nhận mốc. Mốc này **không đổi một dòng mã cổng** — chỉ
đóng số, nói người dùng nhận gì (mục `v2.18.5` trong mô tả hai gói và `CHANGELOG.md`), và đi **làn
V** như tiền lệ 2.5.0 → 2.18.4. Năm dòng số của luật (c), bảng dự báo, điều kiện tin cậy và dòng
hiệu chuẩn nằm ở mục `2.18.5` của `CHANGELOG.md` — một nguồn, hồ sơ không chép lại.

Source input: `git log v2.18.4..HEAD` · nếp phát hành `_acceptance/release-2-18-4/` · lệnh owner 27/09.

## Criteria

- AC-1: Given cây đã sửa, When đọc ba manifest plugin, Then `acceptance-gate` và `feature-loop` mang CÙNG một số hợp semver (`2.18.5`), `diagram-design` hợp semver.
- AC-2: Given cây đã sửa, When đọc dòng «Khớp phiên bản» của GUIDE, Then nó khớp ĐÚNG ba số đọc từ ba manifest (một nguồn — so với manifest, không so hằng).
- AC-3: Given cây đã sửa, When chạy mọi lệnh suite của lượt chấm (bốn mảnh scripts, ba vùng plugins, hooks, workflows), Then cả mười XANH và `product-map --check` khớp.
- AC-4: Given tập hồ sơ ĐƯỢC KÝ trong cửa sổ suy từ kho (`scripts/rel-cua-so.sh ba2ed24b …`, mốc = commit của tag `v2.18.4`), When so với danh sách kể trong Context, Then hai tập BẰNG NHAU.
- AC-5: Given mốc `ba2ed24b` (tag `v2.18.4`), When so thư mục `diagram-design/` với HEAD bằng git, Then không một dòng nào đổi — `diagram-design` giữ `2.7.0` là đúng, không phải quên nâng.
- AC-6: Given mô tả hai plugin, When đọc mục của ĐÚNG số đang phát hành, Then mô tả `acceptance-gate` CÓ mục `v2.18.5` và mục `v2.18.5` của `feature-loop` TỰ khai cặp `acceptance-gate >= 2.18.5`. *Nội dung* các vế người-dùng-nhận-gì đọc trực tiếp trong diff — Known limits.

## Coverage

- Quét theo hai trục của nếp release-2-1-0→2-18-4, không quét lại: Trục A · vật của một lần cắt số (manifest | dòng khớp-phiên-bản | mô tả người-dùng-nhận-gì | phạm vi diff | gói không đổi) `[thước CE: mười hai mốc trước đã dùng thật]` · Trục B · hành trình hồ sơ (bằng chứng | biên merge) `[thước CE: xanh_sach_check + ADR 0012]`. Ô Core → AC-1 · AC-2 · AC-3 · AC-4 · AC-5 · AC-6; không răng mới.

## Đường đo

- bỏ đường-đo — mốc phát hành không có hồ sơ cơ hội, không có ngưỡng nghiệm thu; người dùng nhận engine theo mốc, không có phiên đo (cùng căn cứ với release-2-3-0 → 2-18-4). Ngưỡng UAT của vòng trong cửa sổ sống ở `_acceptance/cham-khong-tu-dot-luot/opportunity.md` và đo ở phiên nghiệm thu của CHÍNH vòng ấy sau khi crm cài.

## Out of scope

- Đổi bất kỳ dòng mã cổng nào (`skills/ lib/ hooks/ scripts/ feature-loop/skills/ feature-loop/workflows/`) — mốc phát hành KHÔNG dựng răng (GUIDE §7.1).
- Đổi chữ «CAT» → «LUU» trong khối TOOL-KILL-RULE (đọc được hai nghĩa ở câu «đầu ra dài») — chữ của khối là mã cổng (`skills/`), mốc không đổi; xếp cho cửa sổ kế.
- Hai hạt giống owner mở ở Cổng Bằng chứng của vòng: thẻ Cổng 2 để `scope_plain` thay các mục (`docs/plans/2026-09-27-hat-giong-the-cong-2-scope-plain-thay-muc.md`) · ca «luật dấu không chạm làn ui» không có chiều đỏ (`docs/plans/2026-09-27-hat-giong-ca-lan-ui-khong-phan-biet.md`).
- Nâng số `diagram-design` — không đổi một dòng kể từ mốc trước (AC-5).
- Chiến dịch ghim lại các hồ sơ đã ký — §7.1: việc SAU khi mốc merge, chỉ khi lưới báo hoá cũ.
- Đổi `KIT_SHA` ở các kho tiêu thụ, nâng plugin ở crm và chép lại `lib/nhan-canh-gay.cjs` — việc SAU khi tag có mặt.

## Notes

**Vì sao làn V:** mốc này không có mục nào chỉ-người-biết. Số lấy từ manifest, danh sách vòng suy từ
kho, hồi quy là các lệnh suite thường trực. Cửa veto mở và có dấu vết thời gian; owner veto lúc nào
cũng được.

**Luật chiều rộng (b), khai thẳng:** cửa sổ có MỘT vòng, và nó là suất meta duy nhất của cửa sổ —
owner gọi tên 27/09 sau ba lượt phản biện trong phiên (North Star · người hưởng · tổn thất nếu không
làm · giá phải trả). Vòng sửa bộ chấm của kit nhưng có kho chờ nhận đo được (crm, lượt 4 OKR).

**Vế 4 của luật (b) — «mốc chỉ cắt khi có kho chờ nhận» — CHƯA CÓ RĂNG.** Mốc khai bằng lời trong
Context: crm. Ngưỡng đang đếm: một mốc cắt số mà sau 21 ngày không kho nào cài nó.

**Tag `v2.18.5`** gắn tại commit ký mốc trên `main` SAU khi gộp, rồi đẩy lên remote — làm tay; không
là tiêu chí vì nó đến sau chữ ký.

**Eval trỏ khoá mảnh, không khoá suite trọn** — cùng lý do mốc 2.18.3 (giới hạn Ngoài-1 của
`ha-tang-khong-dot-luot`).

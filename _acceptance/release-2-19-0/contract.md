---
schema_version: 1
feature: Phát hành kit 2.19.0 — đóng số cho cửa sổ 2.18.5 → 2.19.0 (một vòng đã ký «mot-so-ba-ve»: mỗi dòng sổ quyết định ghi ba vế quyết gì · vì sao · sai thì tốn gì, thẻ cổng in thành một câu, ruling superpowers được gặt vào sổ trước khi thư mục tạm bị xoá), để crm cài vào và người ký thấy mọi ruling có mã sổ ngay trên thẻ; làn V, không dựng răng
slug: release-2-19-0
owner: phanlemanh@gmail.com
risk_tier: T2               # vật chạm: 2 manifest + dòng khớp-phiên-bản của GUIDE + CHANGELOG + workspace hồ sơ + bản đồ + 2 khoá executor — KHÔNG dính t3_paths, KHÔNG đổi một dòng mã cổng
surfaces: [cli]
status: approved
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-09-29T13:13:35Z
---

# Acceptance Contract: release-2-19-0

## Context

**Kho chờ nhận — đo được trước khi cắt:** `crm` đã nhận 2.18.5 ngày 28/09 (sẵn khớp, không PR). Vòng
`tro-ly-okr-de-xuat` của crm (28/09) có 11 ruling superpowers mà chỉ 4 có mã trong sổ quyết định — mốc nền
của ngưỡng nghiệm thu mà ô `mot-so-ba-ve` khai. Bản sửa đã gộp (#227) nhưng chưa phát hành — crm vẫn chạy
2.18.5. Owner gọi mốc 29/09: «Hãy cắt mốc» (bàn giao `docs/handoff/2026-09-29-handoff-cat-moc-2-19.md`).

**Cửa sổ này có gì** — suy từ kho bằng quan hệ (AC-4), không chép tay:

- `mot-so-ba-ve` (T3, ký 29/09, PR #226 mở ô + ADR 0021, PR #227 vòng) — dòng sổ ba vế
  `decision · why · cost_if_wrong` với `impact` là đường đọc-cũ; thẻ Cổng 1/2 in dòng ba vế ở cả ba khối,
  nhãn «chưa khai giá nếu sai» cho dòng thiếu giá; cầu nối gặt ruling superpowers vào sổ; hook chặn lệnh
  xoá thư mục tạm superpowers cho tới khi ruling vào sổ.

Vật engine đổi trong cửa sổ: bảy tệp (đo: `git diff --stat 2e7b1347 HEAD -- scripts lib hooks skills
feature-loop commands vendor`) — `hooks/hooks.json`, `hooks/ruling-truoc-khi-xoa.js` (mới),
`scripts/cau-noi-ruling.mjs` (mới), `scripts/gate-card.js`, `feature-loop/skills/feature-loop/SKILL.md`,
`feature-loop/scripts/claim-scan.mjs`, `commands/acceptance-card.md`. **Không tệp nào nằm trong lớp chép
CI** (khối `GUIDE-CI-COPY-LIST`, GUIDE §5.3): kho còn đường chép không phải chép gì. Số là **2.19.0, không
2.18.6** vì cửa sổ thêm một hook, một script và ba trường sổ — cộng thêm, có đường đọc-cũ. Mốc này **không
đổi một dòng mã cổng** — chỉ đóng số, nói người dùng nhận gì (mục `v2.19.0` trong mô tả hai gói và
`CHANGELOG.md`), và đi **làn V** như tiền lệ 2.5.0 → 2.18.5. Năm dòng số của luật (c), bảng dự báo, điều
kiện tin cậy và dòng hiệu chuẩn nằm ở mục `2.19.0` của `CHANGELOG.md` — một nguồn, hồ sơ không chép lại.

Source input: `git log v2.18.5..HEAD` · nếp phát hành `_acceptance/release-2-18-5/` · lệnh owner 29/09.

## Criteria

- AC-1: Given cây đã sửa, When đọc ba manifest plugin, Then `acceptance-gate` và `feature-loop` mang CÙNG một số hợp semver (`2.19.0`), `diagram-design` hợp semver.
- AC-2: Given cây đã sửa, When đọc dòng «Khớp phiên bản» của GUIDE, Then nó khớp ĐÚNG ba số đọc từ ba manifest (một nguồn — so với manifest, không so hằng).
- AC-3: Given cây đã sửa, When chạy mọi lệnh suite của lượt chấm (bốn mảnh scripts, ba vùng plugins, hooks, workflows), Then cả mười XANH và `product-map --check` khớp.
- AC-4: Given tập hồ sơ ĐƯỢC KÝ trong cửa sổ suy từ kho (`scripts/rel-cua-so.sh 2e7b1347 …`, mốc = commit ký của `v2.18.5`), When so với danh sách kể trong Context, Then hai tập BẰNG NHAU.
- AC-5: Given mốc `2e7b1347` (tag `v2.18.5`), When so thư mục `diagram-design/` với HEAD bằng git, Then không một dòng nào đổi — `diagram-design` giữ `2.7.0` là đúng, không phải quên nâng.
- AC-6: Given mô tả hai plugin, When đọc mục của ĐÚNG số đang phát hành, Then mô tả `acceptance-gate` CÓ mục `v2.19.0` và mục `v2.19.0` của `feature-loop` TỰ khai cặp `acceptance-gate >= 2.19.0`. *Nội dung* các vế người-dùng-nhận-gì đọc trực tiếp trong diff — Known limits.

## Coverage

- Quét theo hai trục của nếp release-2-1-0→2-18-5, không quét lại: Trục A · vật của một lần cắt số (manifest | dòng khớp-phiên-bản | mô tả người-dùng-nhận-gì | phạm vi diff | gói không đổi) `[thước CE: mười ba mốc trước đã dùng thật]` · Trục B · hành trình hồ sơ (bằng chứng | biên merge) `[thước CE: xanh_sach_check + ADR 0012]`. Ô Core → AC-1 · AC-2 · AC-3 · AC-4 · AC-5 · AC-6; không răng mới.

## Đường đo

- bỏ đường-đo — mốc phát hành không có hồ sơ cơ hội, không có ngưỡng nghiệm thu; người dùng nhận engine theo mốc, không có phiên đo (cùng căn cứ với release-2-3-0 → 2-18-5). Ngưỡng UAT của vòng trong cửa sổ sống ở `_acceptance/mot-so-ba-ve/opportunity.md` và đo ở phiên nghiệm thu của CHÍNH vòng ấy sau khi crm cài.

## Out of scope

- Đổi bất kỳ dòng mã cổng nào (`skills/ lib/ hooks/ scripts/ feature-loop/skills/ feature-loop/workflows/`) — mốc phát hành KHÔNG dựng răng (GUIDE §7.1).
- Sửa bảy phép đo tự dối và các Known limits khác của `mot-so-ba-ve` (kể cả gợi ý sửa `gp_fix` của lưới trước-merge còn dạy dòng sổ hai vế) — đều là mã cổng hoặc ca kiểm; xếp cho cửa sổ kế nếu owner gọi tên.
- Hạt giống Ngoài-6 (`docs/plans/2026-09-29-hat-giong-hook-chan-ke-hoach-ngoai-ho-so.md`) và ba hạt giống cùng lớp «ba vế» của ô `mot-so-ba-ve`.
- Nâng số `diagram-design` — không đổi một dòng kể từ mốc trước (AC-5).
- Chiến dịch ghim lại các hồ sơ đã ký — §7.1: việc SAU khi mốc merge, chỉ khi lưới báo hoá cũ.
- Nâng plugin ở crm và đo ngưỡng nghiệm thu của `mot-so-ba-ve` — việc SAU khi tag có mặt.

## Notes

**Vì sao làn V:** mốc này không có mục nào chỉ-người-biết. Số lấy từ manifest, danh sách vòng suy từ
kho, hồi quy là các lệnh suite thường trực. Cửa veto mở và có dấu vết thời gian; owner veto lúc nào
cũng được.

**Luật chiều rộng (b), khai thẳng:** cửa sổ có MỘT vòng, và nó là suất meta duy nhất của cửa sổ — vòng
sửa sổ và thẻ của kit, kho chờ nhận đo được (crm, 4/11 ruling có mã sổ ở vòng 28/09).

**Vế 4 của luật (b) — «mốc chỉ cắt khi có kho chờ nhận» — CHƯA CÓ RĂNG.** Mốc khai bằng lời trong
Context: crm. Ngưỡng đang đếm: một mốc cắt số mà sau 21 ngày không kho nào cài nó.

**Tag `v2.19.0`** gắn tại commit ký mốc trên `main` SAU khi gộp, rồi đẩy lên remote — làm tay; không
là tiêu chí vì nó đến sau chữ ký.

**Eval trỏ khoá mảnh, không khoá suite trọn** — cùng lý do mốc 2.18.3 (giới hạn Ngoài-1 của
`ha-tang-khong-dot-luot`).

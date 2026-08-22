---
schema_version: 1
feature: Đường đo nằm trong định-nghĩa-xong — contract có ô «Đường đo» khi hồ sơ có ngưỡng; thẻ Cổng Phạm vi cờ vàng khi thiếu, cửa bỏ có tên; gap-probe cross-check ngưỡng↔đường đo
slug: duong-do-trong-dinh-nghia-xong
owner: phanlemanh@gmail.com
risk_tier: T2               # scripts/gate-card.js + contract-template + feature-loop SKILL + CONTEXT + tests — không chạm lib/**, hook, lưới
surfaces: [cli]
status: draft
approved_by:
approved_at:
---

# Acceptance Contract: duong-do-trong-dinh-nghia-xong

## Context

Kit đòi khai ngưỡng sống/chết ở Cổng Đáng và đòi đặt số cạnh ngưỡng ở Cổng Giá trị, nhưng không
chỗ nào đòi xây thứ sinh ra con số. Hồ sơ này thêm MỘT ô cấu trúc vào contract (`## Đường đo`),
bật chỉ khi vòng có hồ sơ cơ hội với ngưỡng đã khai; thẻ Cổng Phạm vi cờ vàng khi thiếu (không
chặn), cửa bỏ có tên; gap-probe thêm một dòng cross-check. Chép nguyên khuôn CT-S (Coverage).

Source input: `docs/plans/2026-08-21-hat-giong-duong-do-trong-dinh-nghia-xong.md` (chip C, dây A → B → C). Thiết kế: `docs/superpowers/specs/2026-08-22-duong-do-trong-dinh-nghia-xong-design.md`. Hồ sơ cơ hội: `_acceptance/duong-do-trong-dinh-nghia-xong/opportunity.md` (decided/build).

## Criteria

- AC-1: Given workspace có `opportunity.md` với section Ngưỡng **đã khai** (≥1 dòng không phải placeholder — đúng vị từ thẻ đang dùng cho khối «Ngưỡng nghiệm thu») và `contract.md` có section `## Đường đo` với ≥1 dòng bullet thật (không còn `{{`), When render `gate-card.js --extract` và HTML, Then `duong_do` = `{applicable: true, present: true, lines: [≥1], descoped: null}`, HTML có khối nhãn «Đường đo» in đúng các dòng đó, và **không** có cờ nào chứa «Đường đo».
- AC-2: Given cùng fixture AC-1 nhưng (a) contract **gỡ** section `## Đường đo`, hoặc (b) section còn nguyên placeholder `{{…}}` không dòng thật, When render, Then `duong_do.applicable: true`, `present` đúng sự thật (false ở a, true ở b), `lines: []`, và HTML có **đúng một** cờ vàng ghim thông điệp «Hồ sơ cơ hội có ngưỡng nhưng contract chưa có đường đo» nêu việc phải làm (thêm section mỗi thước một dòng, hoặc ghi entry «bỏ đường-đo — …»); không có khối «Đường đo».
- AC-3: Given (a) workspace **không** có `opportunity.md`, hoặc (b) có `opportunity.md` nhưng section Ngưỡng còn placeholder `…`, When render — kể cả khi contract CÓ section `## Đường đo` với dòng thật, Then `duong_do.applicable: false`, HTML **không** có cờ nào chứa «Đường đo» (luật không rò sang vòng B/C/E; cô lập lớp R0); ở (a)/(b) có dòng thật thì khối vẫn in (trình cái contract khai), không cờ.
- AC-4: Given fixture AC-2(a) cộng `decisions.jsonl` có entry `type: descope` với `decision` bắt đầu **đúng chuỗi** `bỏ đường-đo — `, When render, Then `duong_do.descoped` = id entry đó, HTML có cờ **info** «Đã bỏ đường đo theo <id> … Cổng Giá trị sẽ đọc ngưỡng với ô CHƯA ĐO» và **không** cờ vàng; đối chứng seam: entry có decision `bỏ đường đo — …` (không gạch nối) hoặc `type` khác `descope` → **vẫn** cờ vàng, `descoped: null`.
- AC-5: Given khuôn `skills/acceptance/references/contract-template.md` sau hồ sơ, When đọc, Then có khối marker `CONTRACT-DUONG-DO-TEMPLATE` chứa heading `## Đường đo` + hướng dẫn + một dòng mẫu bullet *thước · số từ đâu · bảo đảm bởi* + dòng mẫu bỏ `Bỏ đường-đo — <lý do> (entry d-…)`; heading rút từ khối đó **bằng** hằng `DUONG_DO_HEADING` trong `gate-card.js` và chuỗi tiền tố bỏ trong khuôn **bằng** hằng `DUONG_DO_DESCOPE` (round-trip); bản sao khuôn đổi heading → đỏ nêu cả hai chuỗi; fixture contract của mọi ca DD dựng từ chính khối này (không gõ tay section).
- AC-6: Given `feature-loop/skills/feature-loop/SKILL.md` sau hồ sơ, When đọc, Then (i) bullet contract ở S1#4 nêu `## Đường đo` với điều kiện «khi hồ sơ có opportunity.md với ngưỡng» và cửa bỏ auto-draft bắt đầu đúng chuỗi `"bỏ đường-đo — "` kèm impact nhắc «CHƯA ĐO»; (ii) ý (4) của S1#7 có mệnh đề cross-check «ngưỡng nào ở `opportunity.md` không có đường đo nào trong contract» và nói `opportunity.md` vào input của critic khi file tồn tại; bản sao gỡ từng mệnh đề → đỏ nêu mệnh đề.
- AC-7: Given `CONTEXT.md` sau hồ sơ, When đọc, Then có term **Đường đo** (mục Evidence vocabulary) với định nghĩa phân biệt thước / ngưỡng / số đo và dòng `_Avoid_` chứa «tracking» và «metric»; bản sao gỡ term → đỏ.

## Coverage

- Bỏ coverage-scan — không gian AC là ma trận §4 của hạt giống (R+ · R− · R0 · RK) cộng ba AC nguồn (khuôn · SKILL · CONTEXT) (entry d-20260822T000000Z-4301).

## Đường đo

- Bỏ đường-đo — hồ sơ kit không có ngưỡng UAT (stub cơ hội giữ `…`, vòng nội bộ engine không có người dùng cuối để đo) (entry d-20260822T000500Z-4306).

## Out of scope

- Eval **hành vi** «máy có viết section Đường đo ở S1 không» — cố ý không mở (hạt giống §4: mã tiền định trước, hội đồng chỉ khi ô lọt lần ba).
- Parse từng thước trong văn xuôi ngưỡng / đối chiếu thước↔dòng — ngưỡng hiện là bullet chữ; chỉ xét có/không section + có dòng thật (hạt giống §6).
- Chặn Gate 1 / thêm chân lưới trước-merge / đụng `uat-session` / đòi công cụ đo cụ thể.
- `lib/**`, hook — T2.
- Nghi thức retro ngưỡng (L3), đường đo cho thước North Star của kit (L4), roadmap ngưỡng.

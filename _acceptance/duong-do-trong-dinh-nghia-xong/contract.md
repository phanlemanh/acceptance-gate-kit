---
schema_version: 1
feature: Đường đo nằm trong định-nghĩa-xong — contract có ô «Đường đo» khi hồ sơ có ngưỡng; thẻ Cổng Phạm vi cờ vàng khi thiếu, cửa bỏ có tên; gap-probe cross-check ngưỡng↔đường đo
slug: duong-do-trong-dinh-nghia-xong
owner: phanlemanh@gmail.com
risk_tier: T2               # scripts/gate-card.js + contract-template + feature-loop SKILL + CONTEXT + tests — không chạm lib/**, hook, lưới
surfaces: [cli]
status: verified
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-08-22T01:06:55Z
---

# Acceptance Contract: duong-do-trong-dinh-nghia-xong

## Context

Kit đòi khai ngưỡng sống/chết ở Cổng Đáng và đòi đặt số cạnh ngưỡng ở Cổng Giá trị, nhưng không
chỗ nào đòi xây thứ sinh ra con số. Hồ sơ này thêm MỘT ô cấu trúc vào contract (`## Đường đo`),
bật chỉ khi vòng có hồ sơ cơ hội với ngưỡng đã khai; thẻ Cổng Phạm vi cờ vàng khi thiếu (không
chặn), cửa bỏ có tên; gap-probe thêm một dòng cross-check. Chép nguyên khuôn CT-S (Coverage).

Source input: `docs/plans/2026-08-21-hat-giong-duong-do-trong-dinh-nghia-xong.md` (chip C, dây A → B → C). Thiết kế: `docs/superpowers/specs/2026-08-22-duong-do-trong-dinh-nghia-xong-design.md`. Hồ sơ cơ hội: `_acceptance/duong-do-trong-dinh-nghia-xong/opportunity.md` (decided/build).

## Criteria

- AC-1: Given workspace có `opportunity.md` với section Ngưỡng **đã khai** (≥1 dòng không phải placeholder — đúng vị từ thẻ đang dùng cho khối «Ngưỡng nghiệm thu») và `contract.md` có section `## Đường đo` với ≥1 **dòng thật** — bullet không còn `{{` và **không** bắt đầu bằng tiền tố bỏ `Bỏ đường-đo` (dòng bỏ không phải đường đo) — When render `gate-card.js --extract` và HTML, Then `duong_do` = `{applicable: true, present: true, lines: [≥1], descoped: null}`, HTML có khối nhãn «Đường đo» in đúng các dòng đó, **không** có cờ nào chứa «Đường đo», và `applicable` **bằng** (HTML có khối «Ngưỡng nghiệm thu») — một vị từ, hai đầu ra cùng gật; fixture biên «1 dòng ngưỡng thật + 3 dòng `…`» vẫn là áp dụng ở cả hai bên.
- AC-2: Given cùng fixture AC-1 nhưng (a) contract **gỡ** section `## Đường đo`, hoặc (b) section còn nguyên placeholder `{{…}}` không dòng thật, hoặc (c) section **chỉ có dòng** `Bỏ đường-đo — …` mà ledger **không** có entry bỏ, When render, Then `duong_do.applicable: true`, `present` đúng sự thật (false ở a, true ở b/c), `lines: []`, và HTML có **đúng một** cờ vàng ghim thông điệp «Hồ sơ cơ hội có ngưỡng nhưng contract chưa có đường đo» nêu việc phải làm (thêm section mỗi thước một dòng, hoặc ghi entry «bỏ đường-đo — …»); không có khối «Đường đo».
- AC-3: Given (a) workspace **không** có `opportunity.md`, hoặc (b) có `opportunity.md` nhưng section Ngưỡng toàn placeholder `…`, When render — kể cả khi contract CÓ section `## Đường đo` với dòng thật, Then `duong_do.applicable: false` **và** HTML không có khối «Ngưỡng nghiệm thu» (cùng vị từ), HTML **không** có cờ nào chứa «Đường đo» (luật không rò sang vòng B/C/E; cô lập lớp R0); **chiều chốt:** khối «Đường đo» vẫn in khi có dòng thật (thẻ trình cái contract khai — luật R0 chỉ nói về CỜ), không cờ.
- AC-4: Given fixture AC-2(a) **hoặc** AC-2(c) (section chỉ có dòng Bỏ — dựng từ chính dòng mẫu của khuôn) cộng `decisions.jsonl` có entry `type: descope` với `decision` bắt đầu **đúng chuỗi** `bỏ đường-đo — `, When render, Then `duong_do.descoped` = id entry đó, `lines: []`, không khối «Đường đo», HTML có cờ **info** «Đã bỏ đường đo theo <id> … Cổng Giá trị sẽ đọc ngưỡng với ô CHƯA ĐO» và **không** cờ vàng; đối chứng seam: entry có decision `bỏ đường đo — …` (không gạch nối) hoặc `type` khác `descope` → **vẫn** cờ vàng, `descoped: null`.
- AC-5: Given khuôn `skills/acceptance/references/contract-template.md` sau hồ sơ, When đọc, Then có khối marker `CONTRACT-DUONG-DO-TEMPLATE` chứa heading `## Đường đo` + hướng dẫn + một dòng mẫu bullet *thước · số từ đâu · bảo đảm bởi* + dòng mẫu bỏ `Bỏ đường-đo — <lý do> (entry d-…)`; heading rút từ khối đó **bằng** hằng `DUONG_DO_HEADING` trong `gate-card.js` và chuỗi tiền tố bỏ trong khuôn **bằng** hằng `DUONG_DO_DESCOPE` (round-trip); bản sao khuôn đổi heading → đỏ nêu cả hai chuỗi; fixture contract của mọi ca DD dựng từ chính khối này (không gõ tay section).
- AC-6: Given `feature-loop/skills/feature-loop/SKILL.md` sau hồ sơ, When đọc với phạm vi **cắt đúng** (bullet contract của S1#4 = từ `- \`_acceptance/<slug>/contract.md\`` tới bullet kế; ý (4) của S1#7 = từ «cross-check bắt buộc» tới dấu `;` đóng ý), Then (i) trong bullet S1#4 có **đúng 1** cụm `## Đường đo` kèm điều kiện «khi hồ sơ có `opportunity.md` với ngưỡng», và câu auto-draft có tiền tố bỏ — tiền tố **rút từ chính SKILL** (chuỗi trong ngoặc kép sau «decision bắt đầu đúng chuỗi») và **bằng** `DUONG_DO_DESCOPE` của gate-card (round-trip ba đầu: khuôn · gate-card · SKILL), kèm impact nhắc «CHƯA ĐO»; (ii) trong ý (4) có **đúng 1** cụm «không có đường đo nào trong contract» và cụm «`opportunity.md` … input»; bản sao gỡ từng mệnh đề → reader chạy trên bản sao **ĐỎ** nêu mệnh đề (assert, không mô tả); bản sao đổi tiền tố trong SKILL → đỏ nêu hai chuỗi.
- AC-7: Given `CONTEXT.md` sau hồ sơ, When đọc, Then có term **Đường đo** (mục Evidence vocabulary) với định nghĩa phân biệt thước / ngưỡng / số đo và dòng `_Avoid_` chứa «tracking» và «metric»; bản sao gỡ term → đỏ.

## Coverage

- Bỏ coverage-scan — không gian AC là ma trận §4 của hạt giống (R+ · R− · R0 · RK) cộng ba AC nguồn (khuôn · SKILL · CONTEXT) (entry d-20260822T000000Z-4301).

## Đường đo

- bỏ đường-đo — hồ sơ kit không có ngưỡng UAT (stub cơ hội giữ `…`, vòng nội bộ engine không có người dùng cuối để đo) (entry d-20260822T000500Z-4306).

## Out of scope

- Eval **hành vi** «máy có viết section Đường đo ở S1 không» — cố ý không mở (hạt giống §4: mã tiền định trước, hội đồng chỉ khi ô lọt lần ba).
- Parse từng thước trong văn xuôi ngưỡng / đối chiếu thước↔dòng — ngưỡng hiện là bullet chữ; chỉ xét có/không section + có dòng thật (hạt giống §6).
- Chặn Gate 1 / thêm chân lưới trước-merge / đụng `uat-session` / đòi công cụ đo cụ thể.
- `lib/**`, hook — T2.
- Nghi thức retro ngưỡng (L3), đường đo cho thước North Star của kit (L4), roadmap ngưỡng.

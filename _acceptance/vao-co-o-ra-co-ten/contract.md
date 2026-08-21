---
schema_version: 1
feature: Vào có ô, ra có tên — ý khai thác xong có ô máy đọc (stub opportunity.md), bộ quét /start tách «đang cân nhắc» khỏi «chờ Cổng Đáng» theo ngưỡng đã điền, thẻ nói số ý và tuổi; 7 hạt giống kit nhận ô, trạng thái sống một chỗ
slug: vao-co-o-ra-co-ten
owner: phanlemanh@gmail.com
risk_tier: T2               # scripts/start-scan.mjs + commands/start.md + tests/plugins + docs/plans + stub _acceptance — không chạm lib/**, lưới, hook
surfaces: [cli]
status: draft
approved_by:
approved_at:
---

# Acceptance Contract: vao-co-o-ra-co-ten

## Context

Ý tưởng khai thác xong để trong repo rồi quên → rác. Ba bộ đọc định kỳ (/start, bản đồ,
lưới) chỉ đọc `_acceptance/<slug>/`; ý nằm ngoài ô thì không ai thấy. Ô đã có
(`opportunity.md`), bản đồ đã đếm nó, nhưng (1) lối (a) của `/start` trỏ một «nghi thức
grill» không tồn tại nên không ai biết kết thúc khai thác là ghi gì, (2) bộ quét xếp mọi
opportunity chưa quyết vào «chờ chữ ký» kể cả khi chưa có ngưỡng để ký (trạm thu phí),
(3) thẻ không nói có bao nhiêu ý đang treo, treo bao lâu. Kit tự dẫm: 7 hạt giống của
chính kit không có ô.

Source input: `docs/plans/2026-08-21-hat-giong-vao-co-o-ra-co-ten.md` (Cổng Đáng gật 21/08, chip B của dây A → B → C). Thiết kế: `docs/superpowers/specs/2026-08-22-vao-co-o-ra-co-ten-design.md`.

## Criteria

- AC-1: Given `_acceptance/<slug>/opportunity.md` rút từ khuôn `OPP-FRONTMATTER-TEMPLATE` với `stage: discovery`, `decision` trống, không có `contract.md`, và section `## Ngưỡng chết / ngưỡng UAT` **thiếu ít nhất một** bullet của khuôn hoặc có bullet mang giá trị `…`/rỗng, When chạy `node scripts/start-scan.mjs --root <repo>`, Then slug nằm trong `groups.considering[]` với đúng bốn khoá `{slug, name, since, ageDays}` (`name` = `feature` frontmatter), **không** nằm trong `groups.gates[]`, và **không** nằm trong `broken[]`. Danh sách bullet bắt buộc **đọc từ chính khuôn** (`skills/acceptance/references/opportunity-template.md`, đường dẫn suy từ vị trí script) lúc chạy — bản sao script có khuôn bị gỡ một bullet → cùng hồ sơ đổi kết luận; bản sao khuôn đổi tên heading section → script exit ≠ 0 với «khuôn không có section Ngưỡng».
- AC-2: Given cùng hồ sơ nhưng **đủ mọi** bullet của khuôn với giá trị khác `…` và không rỗng, When quét, Then slug nằm trong `groups.gates[]` với `gate: dang` (như trước hồ sơ này) và **không** nằm trong `considering[]`; đổi MỘT giá trị về `…` → rơi về `considering[]` (đối chứng đổi-giá-trị).
- AC-3: Given opportunity đã quyết (`stage: decided` + `decision: build|iterate|park|kill`) hoặc `stage` ngoài enum, When quét, Then kết luận **không đổi** so với trước hồ sơ: build/iterate → `inProgress[] nextStep S1`; park/kill → `done[] state = decision`; stage lạ → `broken[]` nêu tên field — và `considering[]` rỗng. Hồ sơ có `contract.md` không bao giờ vào `considering[]`.
- AC-4: Given hồ sơ đang cân nhắc, When quét, Then `since` là **ngày commit đầu tiên** của file (ISO) khi repo có git và file đã commit; không có git hoặc file chưa commit → mtime; `ageDays` là số nguyên ≥ 0 bằng số ngày trọn từ `since` tới lúc quét (fixture đặt mtime 10 ngày trước → `ageDays == 10`; fixture git commit với ngày đặt sẵn → `since` bằng ngày đó).
- AC-5: Given khối `START-SCAN-KEYS` trong `commands/start.md`, When chạy ca round-trip P99 trên fixture có **một** hồ sơ đang cân nhắc, Then bốn khoá `groups.considering[].slug .name .since .ageDays` đều soi được trong đầu ra thật; gỡ một khoá khỏi đầu ra (bản sao) → P99 đỏ nêu tên khoá.
- AC-6: Given `commands/start.md` sau hồ sơ, When đọc, Then (i) có khối marker `START-CAN-NHAC` dặn in dòng «Đang cân nhắc: N ý · cũ nhất X ngày» + tối đa 3 tên cũ nhất, nằm **sau** mục «Đang dở» và **trước** «Bắt đầu việc mới»; (ii) có khối marker `START-HIEU-KET` **≤ 15 dòng** nói kết thúc buổi khai thác là ghi stub `opportunity.md` từ khuôn (`stage: discovery`, file bắt đầu ở `---`, «Vấn đề & ai gặp» ≥ 1 câu, ngưỡng giữ `…` tới khi người điền), áp cho **cả** lối có `brainstormSkill` lẫn không; (iii) chuỗi «grill» xuất hiện **0** lần; (iv) round-trip nghi-thức→máy: một stub dựng đúng theo khối (ii) từ khuôn, quét bằng script thật → `considering[]`.
- AC-7: Given một fixture có ba hồ sơ (một cân nhắc, một đủ ngưỡng chưa quyết, một đã quyết build), When chạy cả `start-scan.mjs` lẫn `renderProductMap` (`scripts/product-map.mjs`) trên nó, Then số ở ô «Đang cân nhắc cơ hội» của bản đồ **bằng** `considering.length + gates.filter(gate==='dang').length` (= 2) và «Sắp mở» = 1; gỡ hồ sơ cân nhắc khỏi bản sao → hai bên cùng giảm một (quan hệ, không phải hằng).
- AC-8: Given kit tự áp, When quét cây thật, Then (i) **mọi** `docs/plans/*hat-giong-<slug>.md` có ô: tồn tại `_acceptance/<slug>/` (contract hoặc opportunity) **hoặc** đường dẫn file được một `_acceptance/*/contract.md` nêu tên — bản sao thêm một hạt giống không ô → đỏ nêu **đúng tên file**; (ii) bảy stub mới (`hoi-theo-mat-phang`, `ban-do-dinh-chu-ky`, `o-nuot-luat`, `ba-cho-tich-luy-khong-duong-ra`, `duong-do-trong-dinh-nghia-xong`, `liet-ke-may-doc`, `t1-tuyen-kem-can-cu`) mỗi file bắt đầu ở dòng `---`, `start-scan` thật không xếp chúng vào `broken[]`, và `duong-do-trong-dinh-nghia-xong` là `decided/build` (chip C đã gật) còn sáu stub kia ở `considering[]`; (iii) 10 dòng đầu của bảy file hạt giống đó **không** còn «chờ Cổng 0» / «HẠT GIỐNG» / «ĐỀ XUẤT» và **có** con trỏ `_acceptance/<slug>/opportunity.md`; (iv) `node scripts/product-map.mjs --check` exit 0 (bản đồ vẽ lại cùng commit).

## Coverage

- Bỏ coverage-scan — không gian AC là ma trận §4 của hạt giống (R+ · R− · R0 · RK) cộng một AC cửa vào, một AC quan hệ quét↔bản đồ, một AC kit-tự-áp (entry d-20260822T000000Z-4201).

## Out of scope

- Eval **hành vi** «agent có ghi stub khi kết thúc khai thác không» — known-limit khai trước; đo ở ván lái-thử kế, không dựng hội đồng phiên sạch cho hồ sơ T2 này.
- Nhắc/ép theo tuổi (ý quá X ngày → hỏi park/kill) — thẻ chỉ nói tuổi; quyết là của người.
- Ổ cắm `product-management:brainstorm` (phụ lục §9 hạt giống) — hồ sơ riêng.
- Lưới trước-merge, hook, `lib/**`, khuôn `opportunity-template.md` (không sửa khuôn; chỉ ĐỌC nó).
- Hạt giống đã có hồ sơ (`1c-doi-hanh-vi`, `bai-hoc-tuan-do-luong`, `go-lop-chung-minh-chu-ky`, `tool-kill`, `lan-v`, `repo-khai-plugin`, chính `vao-co-o`) — ô của chúng là contract đã có.
- `since` cho cổng `dang` vẫn là mtime/`decided_at` như cũ — không đổi hành vi ô cũ.

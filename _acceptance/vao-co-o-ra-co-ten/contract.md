---
schema_version: 1
feature: Vào có ô, ra có tên — ý khai thác xong có ô máy đọc (stub opportunity.md), bộ quét /start tách «đang cân nhắc» khỏi «chờ Cổng Đáng» theo ngưỡng đã điền, thẻ nói số ý và tuổi; 7 hạt giống kit nhận ô, trạng thái sống một chỗ
slug: vao-co-o-ra-co-ten
owner: phanlemanh@gmail.com
risk_tier: T2               # scripts/start-scan.mjs + commands/start.md + tests/plugins + docs/plans + stub _acceptance — không chạm lib/**, lưới, hook
surfaces: [cli]
status: approved
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-08-21T18:13:05Z
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
- AC-4: Given hồ sơ đang cân nhắc, When quét, Then `since` là **committer date của commit ĐẦU TIÊN thêm file** (`git log --diff-filter=A --format=%cI`, lấy mốc sớm nhất; ISO) khi repo có git và file đã commit; không có git hoặc file chưa commit → mtime; `ageDays` là số nguyên ≥ 0 bằng số ngày trọn từ `since` tới lúc quét. Fixture: (a) không git, mtime đặt 10 ngày trước → `ageDays == 10`; (b) repo git **hai commit** trên cùng file (ngày −10 rồi ngày −1, đặt CẢ `GIT_AUTHOR_DATE` lẫn `GIT_COMMITTER_DATE`) → `since` == ngày −10 và `ageDays == 10` (bản cài đọc commit cuối → đỏ); (c) file chưa commit trong repo git → mtime.
- AC-5: Given khối `START-SCAN-KEYS` trong `commands/start.md`, When chạy ca round-trip P99 trên fixture có **một** hồ sơ đang cân nhắc, Then bốn khoá `groups.considering[].slug .name .since .ageDays` đều soi được trong đầu ra thật; gỡ một khoá khỏi đầu ra (bản sao) → P99 đỏ nêu tên khoá.
- AC-6: Given `commands/start.md` sau hồ sơ, When đọc, Then (i) có khối marker `START-CAN-NHAC` dặn in dòng «Đang cân nhắc: N ý · cũ nhất X ngày» + tối đa 3 tên cũ nhất, nằm **sau** mục «Đang dở» và **trước** «Bắt đầu việc mới», và dặn rõ **N = 0 → không in dòng nào**; (ii) có khối marker `START-HIEU-KET` **≤ 15 dòng**, nằm **trước** cả hai nhánh (có `brainstormSkill` / không) của lối (a) và được cả hai nhánh trỏ tới, chứa **ma trận sáu mệnh đề viết trước** — mỗi mệnh đề một assert: ① `stage: discovery` · ② `decision` trống · ③ file bắt đầu ở dòng `---` · ④ «Vấn đề & ai gặp» ≥ 1 câu · ⑤ section Ngưỡng giữ `…` tới khi người điền · ⑥ không spec/contract ở bước này; giá trị frontmatter ghi dạng code span `` `key: value` `` để máy rút được; (iii) chuỗi «grill» xuất hiện **0** lần; (iv) round-trip nghi-thức→máy: phép đo **rút các code span** `key: value` từ chính khối (ii) lúc chạy, áp lên frontmatter khuôn, dựng stub, quét bằng script thật → `considering[]`; bản sao khối gỡ span `stage: discovery` → stub hỏng → đỏ nêu tên mệnh đề ①; bản sao gỡ khối → đỏ «không tìm thấy khối»; bản sao thêm dòng thứ 16 → đỏ «quá 15 dòng».
- AC-7: Given một fixture có ba hồ sơ (một cân nhắc, một đủ ngưỡng chưa quyết, một đã quyết build), When chạy cả `start-scan.mjs` lẫn `renderProductMap` (`scripts/product-map.mjs`) trên nó, Then số ở ô «Đang cân nhắc cơ hội» của bản đồ **bằng** `considering.length + gates.filter(gate==='dang').length` (= 2) và «Sắp mở» = 1; gỡ hồ sơ cân nhắc khỏi bản sao → hai bên cùng giảm một (quan hệ, không phải hằng).
- AC-8: Given kit tự áp, When quét cây thật (gốc suy từ vị trí file test), Then (i) **mọi** `docs/plans/*-hat-giong-<slug>.md` có ô theo **một trong ba chân**, phép khớp định nghĩa tường minh: ① tồn tại thư mục `_acceptance/<slug>/` (slug = phần sau `hat-giong-`, bỏ `.md`) có `contract.md` hoặc `opportunity.md`; ② đường dẫn tương đối `docs/plans/<tên file>` xuất hiện **nguyên văn** trong một `_acceptance/*/contract.md`; ③ chính file hạt giống có con trỏ `_acceptance/<dir>/` tới thư mục tồn tại. Phép đo **assert vũ trụ**: số file hạt giống tìm thấy ≥ 13 và tập slug tìm thấy ⊇ {7 slug mới} ∪ {6 slug cũ khai ở Out of scope}; bản sao thêm một hạt giống mồ côi → đỏ nêu **đúng tên file**; bản sao đổi tên một file thật ra khỏi pattern → assert tập-con đỏ nêu đúng slug; fixture có một hồ sơ cho mỗi chân + một mồ côi; (ii) bảy stub mới (`hoi-theo-mat-phang`, `ban-do-dinh-chu-ky`, `o-nuot-luat`, `ba-cho-tich-luy-khong-duong-ra`, `duong-do-trong-dinh-nghia-xong`, `liet-ke-may-doc`, `t1-tuyen-kem-can-cu`) mỗi file bắt đầu ở dòng `---`, `start-scan` thật không xếp chúng vào `broken[]`, `duong-do-trong-dinh-nghia-xong` ở `inProgress[]` (decided/build — chip C đã gật) còn sáu stub kia ở `considering[]`; (iii) 10 dòng đầu của bảy file hạt giống đó **không** còn «chờ Cổng 0» / «HẠT GIỐNG» / «ĐỀ XUẤT» và **có** con trỏ `_acceptance/<slug>/opportunity.md`; (iv) `node scripts/product-map.mjs --check` exit 0 (bản đồ vẽ lại cùng commit).

## Coverage

- Bỏ coverage-scan — không gian AC là ma trận §4 của hạt giống (R+ · R− · R0 · RK) cộng một AC cửa vào, một AC quan hệ quét↔bản đồ, một AC kit-tự-áp (entry d-20260822T000000Z-4201).

## Out of scope

- Eval **hành vi** «agent có ghi stub khi kết thúc khai thác không» — known-limit khai trước; đo ở ván lái-thử kế, không dựng hội đồng phiên sạch cho hồ sơ T2 này.
- Nhắc/ép theo tuổi (ý quá X ngày → hỏi park/kill) — thẻ chỉ nói tuổi; quyết là của người.
- Ổ cắm `product-management:brainstorm` (phụ lục §9 hạt giống) — hồ sơ riêng.
- Lưới trước-merge, hook, `lib/**`, khuôn `opportunity-template.md` (không sửa khuôn; chỉ ĐỌC nó).
- Hạt giống đã có hồ sơ (`1c-doi-hanh-vi`, `bai-hoc-tuan-do-luong`, `go-lop-chung-minh-chu-ky`, `tool-kill`, `lan-v`, `repo-khai-plugin`, chính `vao-co-o`) — ô của chúng là contract đã có.
- `since` cho cổng `dang` vẫn là mtime/`decided_at` như cũ — không đổi hành vi ô cũ.

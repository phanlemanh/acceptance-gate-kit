---
schema_version: 1
feature: PRODUCT-MAP + phiên nghiệm thu — bộ sinh bản đồ sản phẩm từ hồ sơ xưởng, nghi thức Cổng Giá trị, start-scan đọc 2 nguồn mới
slug: product-map-uat-session
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [cli]
status: signed-off
approved_by: Manh Phan
approved_at: 2026-08-03T09:35:00Z
time_human_minutes: {gate1: 12, gate2: 10}
---

# Acceptance Contract: product-map-uat-session

## Context

Hạng mục F-B (plan discovery-gate0-rollout + workflow-v2-spec 30/07). Ba vật
giao một mạch: `scripts/product-map.mjs` sinh `PRODUCT-MAP.md` từ frontmatter
hồ sơ xưởng (`_acceptance/*/` + `.out-of-scope/`), regen tại mọi lần đóng cổng
người, `--check` chống drift (pattern P30); skill `uat-session` — phiên nghiệm
thu trên sản phẩm thật (chấm kín, so ngưỡng đã khai, verdict
release/iterate/kill) ghi `uat-session.md` máy-đọc; `start-scan.mjs` đọc 2
nguồn mới thay 2 dòng skip-có-tên ghi nợ từ vòng start-command.

Design: docs/superpowers/specs/2026-08-03-product-map-uat-session-design.md

## Criteria

- AC-1 (bucket đủ): Given hồ sơ xưởng có slug ở đủ mọi trạng thái theo bảng bucket của design (opportunity chưa quyết · build/iterate chưa contract · draft · approved/implemented/verified · signed-off có/không đường A · uat verdict release/iterate/kill · park · kill · frontmatter hỏng) cộng `.out-of-scope/*.md`, When chạy `node scripts/product-map.mjs --root <dir>`, Then `PRODUCT-MAP.md` xếp mỗi slug đúng MỘT mục theo bảng, file out-of-scope hiện với title dòng `#` đầu, hồ sơ hỏng vẫn hiện trong mục riêng — không sót, không trùng, không crash; và mọi field điều hướng (`status`/`stage`/`decision`/`verdict`) mang giá trị NGOÀI enum → slug rơi vào Hồ sơ hỏng kèm tên field + giá trị lạc, không biến mất im lặng.
- AC-2 (bất biến giữa chuyển máy): Given cùng một hồ sơ xưởng, When contract của một slug đổi approved→implemented→verified (chuyển trạng thái máy, không qua cổng người), Then nội dung render của map GIỮ NGUYÊN từng byte — map chỉ được đổi tại chuyển trạng thái do người ký.
- AC-3 (check 3 trạng thái): Given map đã sinh và khớp, When `--check`, Then exit 0; When hồ sơ xưởng đổi làm map lệch, Then exit 1 kèm thông điệp theo khuôn `PRODUCT-MAP.md lệch với hồ sơ xưởng — chạy: node <đường-dẫn-script> --root .` trong đó đường dẫn SUY TỪ VỊ TRÍ script đang chạy (lệnh copy được phải chạy được ở chính repo đang đỏ, kể cả khi script sống trong plugin cache); When `PRODUCT-MAP.md` chưa tồn tại hoặc repo chưa có `_acceptance/config.yaml`, Then exit 0 kèm note một dòng — đường đọc-cũ, không đỏ oan.
- AC-4 (xác định): Given cùng một hồ sơ xưởng, When render hai lần liên tiếp, Then hai bản giống hệt từng byte (sort slug trong mục, thứ tự mục cố định, không timestamp).
- AC-5 (cạnh): Given frontmatter opportunity/contract có `epic:`/`supersedes:`/`relates:`, When render, Then cạnh hiện inline trên dòng slug tương ứng; Given các key đó vắng, Then dòng slug không có phần cạnh — không placeholder, không lỗi.
- AC-6 (điểm regen): Given bốn thân lệnh cổng người (`commands/approve.md`, `commands/signoff.md`, codex `approve`/`signoff` SKILL.md) và skill `uat-session`, When đọc, Then mỗi thân có bước chạy product-map regen SAU khi ghi field cổng; và `_acceptance/config.yaml` self-host có `executors.script.product_map` nằm trong `feature_loop.suite_keys`.
- AC-7 (map của chính kit): Given repo kit sau vòng này, When CI chạy suite, Then `PRODUCT-MAP.md` của kit đã commit và `--check` trên chính repo XANH — drift ở bất kỳ PR nào sau này làm CI đỏ với thông điệp ghim ở AC-3.
- AC-8 (template UAT máy-đọc): Given khối marker `UAT-FRONTMATTER-TEMPLATE` trong `skills/acceptance/references/uat-session-template.md`, When test rút khối đó, điền placeholder bằng code rồi đưa cho start-scan và product-map đọc, Then cả hai reader phân đúng ô/mục theo verdict; When tiêm frontmatter hỏng, Then slug rơi vào `broken[]` kèm tên file + lý do — round-trip writer→reader một khuôn.
- AC-9 (nghi thức phiên): Given skill `uat-session`, When đọc thân skill, Then đủ và ĐÚNG THỨ TỰ các chốt của spec §2.3: điều kiện vào (signed-off + ngưỡng UAT đã chốt), chép nguyên văn ngưỡng và CẤM sửa sau khi thấy số, chấm kín TRƯỚC thảo luận, commitment device, verdict do người điền (human-owned), câu "KILL tại đây là thành công của quy trình", regen map sau ký. (judgment)
- AC-10 (start-scan nguồn mới): Given workspace signed-off thuộc đường A (opportunity decision build/iterate) chưa có verdict nghiệm thu, When scan, Then slug vào `gates` với `gate: gia-tri` và `since` theo quy tắc hai nhánh: `decided_at` của uat-session nếu có, thiếu → mtime contract.md; Given uat-session verdict release/iterate/kill, Then vào `done` với state `released`/`uat-iterate`/`uat-kill`; Given uat-session frontmatter hỏng HOẶC `verdict` ngoài enum, Then vào `broken[]` kèm tên file + lý do; và JSON có `map.present`/`map.fresh` đúng cả 4 tổ hợp (vắng · có-fresh · có-stale · lỗi render → null) — hai dòng skip cũ (`PRODUCT-MAP.md`, `phiên-nghiệm-thu`) KHÔNG còn xuất hiện.
- AC-11 (marker 2 harness): Given khối START-SCAN-KEYS trong `commands/start.md` và `codex/acceptance-gate/skills/start/SKILL.md`, When P99 round-trip chạy, Then key mới `map.present`/`map.fresh` có mặt ở CẢ hai thân và khớp output scan thật; bảng phân ô trong docs/specs/2026-08-03-start-command-design.md có các hàng mới của ô gia-tri/uat.
- AC-12 (khoá invocation giữ nguyên): Given danh sách LOCKED của P31/P32, When kiểm sau vòng này, Then danh sách KHÔNG đổi (product-map.mjs là script generic không khoá; uat-session là skill nghi thức MỞ theo tiền lệ design-pass) — bất đối xứng ADR 0002 nguyên vẹn.
- AC-13a (mặt người — HÌNH, đo bằng máy): Given `PRODUCT-MAP.md` sinh ra, When kiểm dạng thức, Then bản đồ mở đầu bằng MỘT khối hình (mermaid — đúng cơ chế của mặt phẳng "tài liệu trong kho" theo bảng tra `DECISION-DIAGRAM-SURFACES`) đứng TRƯỚC mọi mục danh sách; hình nêu đủ bốn cổng người và mang SỐ THẬT của xưởng (thêm một việc thì số trong hình đổi theo); chặng rỗng nói "chưa có" chứ không để trống; dòng ghi chú KHÔNG lấy máy làm chủ ngữ và KHÔNG đặt đường dẫn trong câu chính; tên mục không gọi tên cơ chế máy; mỗi dòng việc theo khuôn `tên việc (slug)` — mã là tra cứu, không phải nội dung.
- AC-13b (mặt người — CHỮ): Given bản đồ và dòng bản đồ trên thẻ `/start`, When người không-kỹ-thuật đọc, Then chữ đọc được bằng tiếng sản phẩm theo N1–N6; phần mô tả THỪA HƯỞNG nguyên văn `feature:` của hồ sơ cũ được phán riêng và nói rõ thuộc bên nào. (judgment)
- AC-14 (ký xong phải merge được): Given bước ký Cổng 2 làm mới bản đồ rồi đưa nó vào chính commit chữ ký, When chạy `pre-merge-check.sh`, Then KHÔNG có vi phạm stale — `PRODUCT-MAP.md` nằm trong `risk_tiers.t1_skip_globs`; và miễn trừ đó chỉ hợp lệ khi còn cổng độc lập canh: `product-map.mjs --root . --check` phải có mặt trong `.github/workflows/gate.yml`, sửa tay bản đồ phải làm `--check` ĐỎ đúng thông điệp, miễn trừ KHÔNG lan sang `.github/**` hay `.claude-plugin/plugin.json` (đề xuất đã bị từ chối), và quyết định có ADR.

## Coverage

Trục từ morphological-scan (chân sản phẩm: workflow-v2-spec + bảng phân ô
start-command; chân ngành: Backstage catalog — view sinh từ metadata,
terraform/prettier `--check` — drift bằng exit-code, Delphi/Planning Poker —
chấm kín, Scrum Sprint Review — nghiệm thu trên sản phẩm chạy):

- **A. Nguồn dữ liệu đọc** (opportunity · contract · uat-session · .out-of-scope · vắng config) — phủ bởi AC-1, AC-3, AC-8, AC-10.
- **B. Trạng thái vòng đời slug** (7 nhóm + hỏng) — phủ bởi AC-1, AC-2, AC-10; thước CE: bảng bucket design = mở rộng bảng phân ô start-command (P98).
- **C. Chế độ chạy** (generate · check-fresh · check-stale · check-missing · chưa-init) — phủ bởi AC-3, AC-4, AC-7.
- **D. Consumer** (người đọc map · start-scan · CI · điểm regen 2 harness) — phủ bởi AC-6, AC-7, AC-11, AC-13a/13b, AC-14.
- Nghi thức phiên (spec §2.3) là chuỗi thứ tự, không phải trục rời rạc — phủ tập trung ở AC-9 (judgment).

## Out of scope

- Card Cổng 0 / Cổng Giá trị trong `/acceptance-card` + funnel số (kill-rate, conversion) trong `/acceptance-report` — vòng card riêng, cần map/uat sống trước (Later của scan).
- Write-side `epic:` tại D1b (grill) — thuộc F-A; vòng này chỉ read-side cạnh.
- Lát-2 từ section Out of scope của contract vào map — cần parse section LLM-viết, rủi ro khuôn; chờ map v1 sống.
- Bản Codex của skill uat-session — known-limit cùng dạng design-pass; codex vẫn nhận đủ start-scan/map qua script chung + marker.
- Graph DB / index riêng — spec đã bác tường minh.
- Kit tự đo tracking/analytics trong phiên nghiệm thu — wiring per-repo, kit không chứa product context.

## Notes

- **Mở rộng phạm vi tại Cổng 2 (owner cho phép 2026-08-03):** AC-13 tách thành
  13a (trục HÌNH, đo bằng máy) + 13b (trục CHỮ, judgment) sau khi owner bắt
  được lỗ-kit — bản đồ vi phạm N5 ở dạng thức mà 12 lượt chấm qua 4 vòng đều
  bỏ sót, vì câu hỏi eval gộp N1–N6 thành một khối chữ nên người chấm hiểu
  thành "soi từ vựng". AC-14 thêm cùng lượt. Cần owner phê lại phần này khi ký.
- **Known limits (ghi tại Cổng 2, owner chấp nhận ship):**
  1. Khuôn `uat-session-template.md` chưa có câu cảnh báo "đừng chép dấu marker
     và khối ```yaml" mà `contract-template.md` đã có — chép nguyên văn theo chỉ
     dẫn sẽ tạo một hồ sơ mà CẢ HAI bên đọc gọi là hỏng.
  2. `product-map.mjs --check` vẫn exit 0 khi `--root` trỏ vào thư mục không
     tồn tại: nhánh "repo chưa dựng cổng" chạy TRƯỚC khi phân biệt mode ghi và
     mode kiểm, nên gõ sai đường dẫn trong CI là cổng xanh mà chưa so byte nào.
  3. Bản Codex của nghi thức phiên nghiệm thu chưa có (gói Codex nhận bản Claude
     với `${CLAUDE_PLUGIN_ROOT}` không nở) — cùng dạng known-limit với design-pass.
  4. Cổng Giá trị là cổng người mà nghi thức của nó để MỞ model-invocation; căn
     cứ hiện chỉ sống trong một assert của P120, chưa có ADR riêng.
  5. `since` của ô chờ-Cổng-Giá-trị neo vào `decided_at` — trường chỉ tồn tại
     SAU khi ký, nên nhánh đó không sinh ra được trong nghi thức thật.
  Cả 5 mục và họ lỗi "luật viết hai bản" đi tiếp ở hợp đồng
  `workspace-reader-unification` (xem `.out-of-scope/` nếu bị hoãn).
- Cổng Đáng hiện ký tay (chưa có lệnh riêng) → không có điểm regen máy cho
  chuyển discovery→decided; lưới: `--check` CI (AC-7) + cờ `map.fresh` trên
  thẻ /start (AC-10). Khi lệnh Cổng 0 ra đời (vòng card sau), thêm điểm regen
  ở đó.
- **`skipped[]` đã GỠ HẲN** khỏi đầu ra start-scan và khỏi khối START-SCAN-KEYS
  của cả hai harness (ghi chú Cổng 1 trước đó dự tính giữ nó; owner xác nhận gỡ
  tại Cổng 2 — sổ quyết định `d-20260803T082900Z-20225`). Lý do: hai nguồn từng
  bỏ qua nay đã dựng, nên không còn thứ gì sinh ra phần tử cho mảng đó, mà một
  khoá khai không ai sinh được là hợp đồng chết — case round-trip P99 đòi mọi
  khoá khai phải soi được trong đầu ra THẬT. Hai case (P98, P121) nay ghim sự
  VẮNG MẶT của khoá.

## Known limits (ký Cổng 2, 2026-08-04 — round 16)

Bảy hạn chế đã biết, chấp nhận để ship; món 1–5 và 7 có chủ là hợp đồng
`workspace-reader-unification` (draft, chờ Cổng 1):

1. Trục `evidence-report.md` chưa vào luật đọc chung — bộ quét còn luật riêng
   cho file này (AC-1 hợp đồng nối tiếp).
2. Luật xếp ô (`stage !== 'decided'`) còn đứng ở cả hai bên đọc — luật hỏng đã
   chung, luật xếp ô thì chưa (AC-3).
3. `--check` với `--root` trỏ sai đường vẫn xanh — so với cây rỗng thay vì kêu
   to (AC-5).
4. Glossary còn thiếu 3 term: `uat-session.md`, `PRODUCT-MAP.md`, `verdict`
   mang hai enum (AC-6).
5. `_acceptance/` mất quyền đọc → thẻ /start nói "repo chưa dựng cổng" thay vì
   nói không đọc được (bàn giao từ start-scan-hardening).
6. Chữ thừa hưởng trường `feature:` của 14 hồ sơ đã ký chưa qua chuẩn N1–N6 —
   hội đồng AC-13b tự loại khỏi phán quyết; sửa là chiến dịch trên hồ sơ cũ,
   không thuộc engine.
7. `configList` trượt dòng khoá có comment đuôi (`t1_skip_globs:   # …`) →
   `map.enabled` báo sai và tín hiệu `daBat` của chốt xoá-bản-đồ tắt trên CI
   checkout nông (finding round 16, medium). Khuôn `acceptance-init` phát sẵn
   không mang hình dạng này. Sửa: regex cho phép comment sau dấu hai chấm + thêm
   hình dạng key-line-comment vào bộ HINH của P130 — nhập vào hợp đồng nối tiếp.

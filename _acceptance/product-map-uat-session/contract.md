---
schema_version: 1
feature: PRODUCT-MAP + phiên nghiệm thu — bộ sinh bản đồ sản phẩm từ hồ sơ xưởng, nghi thức Cổng Giá trị, start-scan đọc 2 nguồn mới
slug: product-map-uat-session
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [cli]
status: implemented
approved_by: Manh Phan
approved_at: 2026-08-03T09:35:00Z
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
- AC-13 (ngôn ngữ mặt người): Given `PRODUCT-MAP.md` sinh ra và dòng bản đồ trên thẻ `/start`, When người không-kỹ-thuật đọc, Then heading/mô tả bằng tiếng sản phẩm (luật N1–N6), mã máy chỉ nằm trong ngoặc hoặc lệnh gợi ý. (judgment)

## Coverage

Trục từ morphological-scan (chân sản phẩm: workflow-v2-spec + bảng phân ô
start-command; chân ngành: Backstage catalog — view sinh từ metadata,
terraform/prettier `--check` — drift bằng exit-code, Delphi/Planning Poker —
chấm kín, Scrum Sprint Review — nghiệm thu trên sản phẩm chạy):

- **A. Nguồn dữ liệu đọc** (opportunity · contract · uat-session · .out-of-scope · vắng config) — phủ bởi AC-1, AC-3, AC-8, AC-10.
- **B. Trạng thái vòng đời slug** (7 nhóm + hỏng) — phủ bởi AC-1, AC-2, AC-10; thước CE: bảng bucket design = mở rộng bảng phân ô start-command (P98).
- **C. Chế độ chạy** (generate · check-fresh · check-stale · check-missing · chưa-init) — phủ bởi AC-3, AC-4, AC-7.
- **D. Consumer** (người đọc map · start-scan · CI · điểm regen 2 harness) — phủ bởi AC-6, AC-7, AC-11, AC-13.
- Nghi thức phiên (spec §2.3) là chuỗi thứ tự, không phải trục rời rạc — phủ tập trung ở AC-9 (judgment).

## Out of scope

- Card Cổng 0 / Cổng Giá trị trong `/acceptance-card` + funnel số (kill-rate, conversion) trong `/acceptance-report` — vòng card riêng, cần map/uat sống trước (Later của scan).
- Write-side `epic:` tại D1b (grill) — thuộc F-A; vòng này chỉ read-side cạnh.
- Lát-2 từ section Out of scope của contract vào map — cần parse section LLM-viết, rủi ro khuôn; chờ map v1 sống.
- Bản Codex của skill uat-session — known-limit cùng dạng design-pass; codex vẫn nhận đủ start-scan/map qua script chung + marker.
- Graph DB / index riêng — spec đã bác tường minh.
- Kit tự đo tracking/analytics trong phiên nghiệm thu — wiring per-repo, kit không chứa product context.

## Notes

- Cổng Đáng hiện ký tay (chưa có lệnh riêng) → không có điểm regen máy cho
  chuyển discovery→decided; lưới: `--check` CI (AC-7) + cờ `map.fresh` trên
  thẻ /start (AC-10). Khi lệnh Cổng 0 ra đời (vòng card sau), thêm điểm regen
  ở đó.
- `skipped[]` giữ trong schema start-scan (thường rỗng) — cơ chế skip-có-tên
  còn dùng cho nguồn tương lai.

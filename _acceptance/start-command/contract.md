---
schema_version: 1
feature: Lệnh /start — nghi thức vào phiên, quét workspace trình thẻ 3 nhóm rồi bàn giao
slug: start-command
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [cli]
status: verified
approved_by: Manh Phan
approved_at: 2026-08-03T04:02:00Z
time_human_minutes: {gate1: 12, gate2: 0}
---

# Acceptance Contract: start-command

## Context

Bước 0 — vào phiên — đang là prompt-lottery: mỗi cách gõ câu mở đầu ra một
biến thể phiên. `/start` là thao tác cổng người thứ 6: người gõ một lệnh,
máy quét `_acceptance/*/` (+ nguồn xếp hàng nếu có) trình MỘT thẻ 3 nhóm
(chờ ký · đang dở · bắt đầu mới), người chọn một chữ cái, lệnh bàn giao
sang nghi thức đích. Chỉ-đọc, không tự làm nội dung. Phân loại nằm trong
`scripts/start-scan.mjs` (đầu ra test được); prose nằm trong `commands/start.md`.

Source input: docs/specs/2026-08-03-start-command-design.md (mục Thiết kế
thi công 03/08) — hạng mục F-H, plan discovery-gate0-rollout.

## Criteria

- AC-1: Given repo chưa có `_acceptance/config.yaml`, When chạy `start-scan.mjs`, Then JSON trả `config: false` (exit 0) và lệnh chỉ in một dòng gợi ý `/acceptance-init` rồi dừng — không quét tiếp, không hỏi thêm.
- AC-2: Given workspace có slug ở các trạng thái khác nhau (opportunity chưa quyết · opportunity đã quyết build chưa có contract · contract draft · approved · implemented · verified chưa ký · signed-off · park/kill), When scan chạy, Then mỗi slug nằm trong ĐÚNG MỘT ô theo bảng phân ô của spec — không slug nào bị bỏ sót, không slug nào xuất hiện hai ô.
- AC-3: Given slug thuộc ô vòng-đang-dở, When scan chạy, Then kèm bước kế suy từ artifact có mặt: opportunity build chưa contract → S1; approved chưa có plan khớp slug → S2; approved có plan → S3; implemented chưa evidence → S4; evidence verdict REJECT → S3-fix.
- AC-4: Given một workspace có artifact frontmatter hỏng (không parse được), When scan chạy, Then slug đó vẫn xuất hiện trong `broken[]` kèm tên file + lý do, các slug khác phân loại bình thường — không crash, không im lặng bỏ qua.
- AC-5: Given `PRODUCT-MAP.md` chưa tồn tại và nguồn phiên-nghiệm-thu chưa được dựng (F-B), When scan chạy, Then JSON có mục `skipped[]` nêu TÊN từng nguồn vắng, và thẻ in đúng một dòng skip-có-tên mỗi nguồn — không im lặng, không bịa dữ liệu thay thế.
- AC-6: Given có ≥2 cổng đang chờ chữ ký, When scan xuất nhóm `gates`, Then các cổng xếp theo `since` cũ nhất lên đầu (chờ lâu nhất trước), và khuôn thẻ trong lệnh trình nhóm "Chờ chữ ký" đứng TRƯỚC hai nhóm còn lại.
- AC-7: Given thẻ đã trình đủ 3 nhóm, When kết thúc lượt, Then lệnh hỏi đúng MỘT câu chọn bằng chữ cái/số dòng, mỗi lựa chọn bàn giao sang đúng nghi thức đích (cổng → `/acceptance-card <slug>`; vòng dở → `/feature-loop <slug>`; việc mới → đúng 3 lối: khai thác vòng HIỂU / `/feature-loop <mô tả>` / việc vặt T1 sửa thẳng) — lệnh KHÔNG tự làm nội dung thay nghi thức đích. (judgment)
- AC-8: Given người chọn resume một vòng dở mà phiên đang đứng trên cây git bẩn hoặc cây chung, When bàn giao, Then lệnh nhắc mở worktree/phiên riêng TRƯỚC khi đưa lệnh resume — không bàn giao thẳng vào cây đang bẩn. (judgment)
- AC-9: Given scan chạy trên một workspace bất kỳ, When xong, Then không file nào bị tạo/sửa/xoá (chỉ-đọc) — cây file trước và sau giống hệt.
- AC-10: Given hai harness, When kiểm lock, Then `commands/start.md` có `disable-model-invocation: true`, `codex/acceptance-gate/skills/start/agents/openai.yaml` có `allow_implicit_invocation: false`, và `acceptance-card` VẪN mở ở cả hai — danh sách LOCKED của P31/P32 mở rộng thêm `start`.
- AC-11: Given GUIDE.md và README.md, When đọc, Then có mục "vào phiên bằng /start" nêu đúng bản chất: người gõ — máy định hướng — người chọn một chữ cái — bàn giao, không tự làm nội dung.
- AC-12: Given nguồn đã sửa xong, When chạy `sync-plugin-packages.sh --check`, Then mirror `plugins/` khớp nguồn (lệnh + codex skill mới đã được sync và commit cùng lượt).
- AC-13: Given `commands/start.md` tham chiếu các key JSON của scan (seam script-viết→lệnh-đọc), When chạy `start-scan.mjs` trên fixture thật, Then MỌI key mà thân lệnh tham chiếu đều tồn tại trong đầu ra script (round-trip rút-từ-lệnh-đọc-bằng-script, mẫu P55) — đổi tên key một phía phải làm test ĐỎ.
- AC-14: Given gói mirror của từng harness (plugin cache Claude, gói Codex), When kiểm con trỏ file trong thân lệnh/skill (`start-scan.mjs`, `human-facing-language.md`…), Then mọi con trỏ GIẢI ra file tồn tại BÊN TRONG gói mirror tương ứng, đúng dạng đường dẫn của harness đó (họ P95).
- AC-15: Given thân lệnh ở CẢ HAI harness, When đọc khuôn render, Then có bước buộc nạp `human-facing-language.md` TRƯỚC khi viết bất kỳ câu nào hiện cho người (cùng khuôn acceptance-status/card) — xoá dòng nạp phải làm test ĐỎ.

## Coverage

Từ morphological-scan (preset test-matrix, 03/08):

- Trục A — trạng thái slug đầu vào: opportunity chưa quyết | build/iterate chưa contract | park/kill | draft | approved ±plan | implemented | REJECT | verified chưa ký | signed-off [CE: schema frontmatter contract-template + opportunity-template — fixture code-sinh được] → AC-2, AC-3.
- Trục B — tình trạng artifact: nguyên vẹn | frontmatter hỏng [CE: tiền lệ "dòng hỏng bỏ qua + báo số lượng" của decisions.jsonl] → AC-4.
- Trục C — nguồn ngoài workspace: config vắng | PRODUCT-MAP vắng | nguồn UAT chưa tồn tại | git bẩn/cây chung [CE: spec §Hành vi 1] → AC-1, AC-5, AC-8.
- Trục D — mặt cắt harness: command Claude | skill Codex | card vẫn mở [CE: P31/P32 + ADR 0002] → AC-10.
- Khối trình + bàn giao (cross-cutting trên mọi ô): thứ tự nhóm, một câu hỏi, chỉ-đọc, ngôn ngữ mặt người → AC-6, AC-7, AC-9, AC-11, AC-15.
- Seam script↔lệnh + đóng gói 2 harness (bổ sung từ gap-probe 03/08): round-trip key JSON → AC-13; con trỏ giải trong gói mirror → AC-14.

## Out of scope

- KHÔNG tự nhận đường A/B/C/D/E — đó là F-E.
- KHÔNG đọc `docs/handoff/` — quy ước riêng repo kit, không phải engine.
- KHÔNG thay `/acceptance-status` — hai vật khác nhau (bảng tra soát ≠ thẻ định hướng).
- KHÔNG đoán schema PRODUCT-MAP / phiên-nghiệm-thu — hai ô đó skip-có-tên chờ F-B dựng nguồn (ledger d-descope).
- KHÔNG xếp hạng việc-mới theo park/lát-2 — cần PRODUCT-MAP thật (Later).

## Notes

- Ô "chờ-phiên-nghiệm-thu" trong spec gốc: vòng này render dưới dạng skip-có-tên vì nguồn chưa tồn tại; khi F-B dựng nguồn, chỉ `start-scan.mjs` đổi, khuôn lệnh giữ nguyên.

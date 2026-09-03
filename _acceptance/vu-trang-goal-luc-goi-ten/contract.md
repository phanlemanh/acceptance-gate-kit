---
schema_version: 1
feature: Vũ trang /goal ở mọi lượt người đứng trước đoạn máy — dòng /goal thành vật thẻ Cổng Phạm vi in ra (một nguồn, ba bản chép), điểm in dời về lúc «làm» · Cổng 1 · Gate 1.5
slug: vu-trang-goal-luc-goi-ten
owner: manh.phan@onemount.com
risk_tier: T2               # chạm scripts/gate-card.js · feature-loop SKILL · GUIDE · tests — không dính t3_paths
surfaces: [cli]
status: draft
design_doc: docs/superpowers/specs/2026-09-03-vu-trang-goal-luc-goi-ten-design.md
approved_by:
approved_at:
---

# Acceptance Contract: vu-trang-goal-luc-goi-ten

## Context

Vòng meta duy nhất cửa sổ 2.7→2.8, owner «gọi tên» 03/09. Vật: `scripts/gate-card.js`
(hằng `GOAL_TEMPLATE` + `goal_line`) · `feature-loop/skills/feature-loop/SKILL.md`
(điểm in S0 · Gate 1 · Gate 1.5; bất biến dừng) · `GUIDE.md` (mục `/goal`) ·
`tests/plugins/run-tests.sh` (P85 nới 3 bản) · `tests/scripts/gate-card-lmcms.test.mjs`
hoặc file ca mới. Ô nguồn: `_acceptance/vu-trang-goal-luc-goi-ten/opportunity.md`.

## Criteria

- AC-1: Given khuôn goal rút qua marker `GOAL-TEMPLATE` từ ba file (SKILL feature-loop · GUIDE · `scripts/gate-card.js`), When so ba khối, Then khớp TỪNG BYTE; đột biến đổi một ký tự ở BẤT KỲ bản nào → ca đỏ và gọi tên đúng bản lệch (ba chiều đỏ, không chỉ một).
- AC-2: Given hồ sơ ở trạng thái trình Cổng 1 (`draft`), When dựng thẻ với `--extract --gate 1`, Then JSON có khoá `goal_line` là MỘT dòng, bằng đúng khuôn rút qua marker của `gate-card.js` sau khi gộp xuống dòng thành khoảng trắng và thay `<slug>` bằng slug thật — không gõ literal ở phía test (đẳng thức với bản rút từ marker).
- AC-3: Given cùng hồ sơ, When render thẻ HTML Cổng 1, Then khối «VIỆC CỦA ANH» chứa dòng goal BẰNG ĐÚNG `goal_line` của `--extract` (đẳng thức, không phép chứa) và nằm ngay dưới dòng lệnh duyệt; thẻ Cổng 1 đang có cờ đỏ (rơi bậc / g1Blocked) VẪN in `goal_line` — đối chứng hai chiều: thẻ sạch và thẻ đỏ đều có, thẻ Cổng 2 KHÔNG có khoá này.
- AC-4: Given SKILL feature-loop sau sửa, When đọc mục S0, Then có một bước ĐÁNH SỐ nêu «in khối GOAL-TEMPLATE» và «TRƯỚC khi S1» trong cùng câu; mục Gate 1 vẫn giữ bước in (không bị dời); mục Gate 1.5 có bước in — đo bằng grep neo chữ trên văn chỉ dẫn (*đo chỉ dẫn, không đo đầu ra — Known limits, đầu ra đo ở ba dòng số mốc 2.8.0*).
- AC-5: Given GUIDE mục `/goal` sau sửa, When đọc đoạn «Khi nào», Then nêu đủ ba thời điểm («làm» · duyệt Cổng Phạm vi · duyệt Gate 1.5) và câu «làn V» một lần là đủ; khuôn GOAL-TEMPLATE trong GUIDE KHÔNG đổi chữ (P85 các vế đã ghim: bắt đầu `/goal `, có `verified`, có `REJECT quá 3 round`, không có `signed-off`).
- AC-6: Given câu bất biến dừng đầu SKILL feature-loop, When đọc, Then có vế gọi tên ca «tiến trình nền báo xong → đi tiếp trong cùng lượt» và gọi «báo cáo rồi ngừng nói» là dừng ngoài thiết kế — grep neo chữ (*Known limits như AC-4*).

## Coverage

- Trục A · vật thẻ (bản chép thứ ba | goal_line extract | HTML round-trip | thẻ đỏ vẫn in | Cổng 2 không in) [thước CE: fixture code-sinh + rút qua marker + đột biến] → AC-1..AC-3. Trục B · văn chỉ dẫn (S0 | Gate 1 | Gate 1.5 | GUIDE | bất biến dừng) [thước CE: grep neo chữ — đo chỉ dẫn] → AC-4..AC-6. Ô «hành vi phiên có in thật không» KHÔNG đo được bằng harness — Known limits, đo bằng ba dòng số mốc 2.8.0 (giả định sinh tử 2).

## Đường đo

- Mốc 2.8.0, ba dòng số: lượt ngoài thiết kế do «phiên dừng giữa đoạn máy» = 0 ở vòng có goal đã bật; > 0 → mở lớp 2 (hook Stop). Chính vòng này: S4 qua Workflow `acceptance-verify`, không agent tay; số lượt của nó ghi vào hồ sơ mốc 2.8.0.

## Out of scope

- Hook `Stop` do plugin giữ — lớp 2, mở theo ngưỡng trên, không dựng trước.
- Làn thẻ Cổng Đáng in goal — ô riêng (cây ghim `528caaa8`); lúc «làm» là skill in.
- Đổi chữ khuôn GOAL-TEMPLATE — không cần; P85 giữ nguyên các vế.
- Răng pre-merge/hook cho «S4 chạy tay» (provenance run-log do workflow sinh) — t3, ô riêng nếu mốc 2.8.0 cho thấy tái phạm.
- Đo hành vi phiên bằng harness.

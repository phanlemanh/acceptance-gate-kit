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

- AC-1: Given khuôn goal rút qua marker `GOAL-TEMPLATE` từ ba file (khối trong rào ``` của SKILL feature-loop và GUIDE; nội dung template literal của hằng `GOAL_TEMPLATE` trong `scripts/gate-card.js`), When so ba khối sau `strip()` (đúng nghĩa P85 hiện hành) và đếm dòng, Then ba khối bằng nhau từng ký tự và cùng 6 dòng; đột biến đổi một ký tự ở BẤT KỲ bản nào trong ba → ca đỏ và gọi tên đúng bản lệch với hai bản còn lại (ba chiều đỏ, không chỉ một).
- AC-2: Given hồ sơ ở trạng thái trình Cổng 1 (`draft`), When dựng thẻ với `--extract --gate 1`, Then JSON có khoá `goal_line` là MỘT dòng = khuôn rút qua marker của `gate-card.js` sau khi gộp mỗi xuống dòng thành một khoảng trắng và thay MỌI lần xuất hiện của `<slug>` (khuôn có hai) bằng slug thật; test dựng kỳ vọng bằng phép thay độc lập và assert `goal_line` không còn chuỗi `<slug>` — không gõ literal, không chép hàm thay của bên viết.
- AC-3: Given cùng hồ sơ, When render thẻ HTML Cổng 1, Then phần tử `<div class="mach goal">` đứng ngay sau `<div class="mach">` của dòng lệnh duyệt và `<b>` trong nó BẰNG ĐÚNG `goal_line` của `--extract` (đẳng thức, không phép chứa; đột biến nối đuôi → đỏ); thẻ Cổng 1 đang có cờ đỏ (rơi bậc / g1Blocked) VẪN in — đối chứng ba chiều: thẻ sạch có, thẻ đỏ có, thẻ Cổng 2 KHÔNG có khoá `goal_line` lẫn `.mach.goal`.
- AC-4: Given SKILL feature-loop sau sửa, When đọc, Then (a) mục S1 có câu nêu «câu xác nhận thiết kế cuối brainstorm» kèm «GOAL-TEMPLATE» (điểm vũ trang đầu — thay cho «S0 / trước S1» đã bị gap-probe bác); (b) S1#7 nêu phản biện context sạch chạy «đồng bộ»/«chờ trong lượt», KHÔNG nền; (c) mục Gate 1 vẫn giữ bước in; (d) mệnh đề «T3: GATE 1.5» trong S2#3 có vế «kèm dòng /goal» — grep neo chữ trên văn chỉ dẫn (*đo chỉ dẫn, không đo đầu ra — Known limits; đầu ra đo ở ba dòng số mốc 2.8.0*).
- AC-5: Given GUIDE mục `/goal` sau sửa, When đọc đoạn «Khi nào», Then nêu đủ ba thời điểm (câu xác nhận thiết kế cuối brainstorm · duyệt Cổng Phạm vi · duyệt Gate 1.5) và câu «làn V T2: lượt cuối brainstorm là lần duy nhất»; các câu «hai bản» quanh khuôn (SKILL dòng chú thích, GUIDE, tiêu đề P85) đổi thành «ba bản»; khuôn GOAL-TEMPLATE KHÔNG đổi chữ (P85 các vế đã ghim: bắt đầu `/goal `, có `verified`, có `REJECT quá 3 round`, không có `signed-off`).
- AC-6: Given câu bất biến dừng đầu SKILL feature-loop, When đọc, Then có vế gọi tên ca «tiến trình nền báo xong → đi tiếp trong cùng lượt» và gọi «báo cáo rồi ngừng nói» là dừng ngoài thiết kế — grep neo chữ (*Known limits như AC-4*).
- AC-7: Given `run-log.jsonl` của CHÍNH hồ sơ này lúc trình Cổng 2, When đọc `run_id` của mọi dòng vòng chấm cuối, Then đều mang hình dạng do Workflow đúc (`minted-<slug>-E<n>-r<n>`) và cùng một `ts` mỗi vòng — dấu vết máy-giữ có sẵn cho nếp «S4 qua Workflow, không agent tay»; đo bằng một ca đọc run-log qua chính bộ đọc `recheck-evidence`/regex hình dạng (chạy được ở mọi vòng chấm sau vòng đầu).

## Coverage

- Trục A · vật thẻ (bản chép thứ ba | goal_line extract | HTML round-trip | thẻ đỏ vẫn in | Cổng 2 không in) [thước CE: fixture code-sinh + rút qua marker + đột biến] → AC-1..AC-3. Trục B · văn chỉ dẫn (cuối brainstorm | gap-probe đồng bộ | Gate 1 | Gate 1.5 | GUIDE | bất biến dừng) [thước CE: grep neo chữ — đo chỉ dẫn] → AC-4..AC-6. Trục C · vết máy-giữ của nếp S4-qua-Workflow [thước CE: hình dạng run_id do workflow đúc] → AC-7. Ô «hành vi phiên có in thật không» KHÔNG đo được bằng harness — Known limits, đo bằng ba dòng số mốc 2.8.0 (giả định sinh tử 2).

## Đường đo

- Mốc 2.8.0, ba dòng số: lượt ngoài thiết kế do «phiên dừng giữa đoạn máy» = 0 ở vòng có goal đã bật; > 0 → mở lớp 2 (hook Stop). Chính vòng này: S4 qua Workflow `acceptance-verify` (AC-7 làm chứng bằng run_id), không agent tay; số lượt của nó ghi vào hồ sơ mốc 2.8.0.

## Out of scope

- Hook `Stop` do plugin giữ — lớp 2, mở theo ngưỡng trên, không dựng trước.
- Làn thẻ Cổng Đáng in goal — ô riêng (cây ghim `528caaa8`); lúc «làm» là skill in.
- Đổi chữ khuôn GOAL-TEMPLATE — không cần; P85 giữ nguyên các vế.
- Răng pre-merge/hook cho «S4 chạy tay» (provenance run-log do workflow sinh) — t3, ô riêng nếu mốc 2.8.0 cho thấy tái phạm.
- Đo hành vi phiên bằng harness.
- `g1Blocked` của thẻ Cổng 1 không nhìn P0 của gap-probe (thẻ điền sẵn «duyệt» khi còn P0 chưa định đoạt, trái điều kiện làn V của SKILL) — gap-probe S1 quan sát; ô riêng, trình Cổng 2 như mục ngoài hợp đồng.
- Nửa còn lại của Ngoài-5 #136 («khối Ngưỡng không lột markdown») — chưa có ô.

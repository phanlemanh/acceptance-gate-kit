---
schema_version: 1
feature: Vũ trang /goal ở mọi lượt người đứng ngay trước đoạn máy — dòng /goal thành vật thẻ Cổng Phạm vi in ra (một nguồn, ba bản chép), điểm in = mỗi câu xin duyệt thiết kế của brainstorm · Cổng 1 · Gate 1.5
slug: vu-trang-goal-luc-goi-ten
owner: manh.phan@onemount.com
risk_tier: T2               # chạm scripts/gate-card.js · feature-loop SKILL · GUIDE · tests — không dính t3_paths
surfaces: [cli]
status: implemented
design_doc: docs/superpowers/specs/2026-09-03-vu-trang-goal-luc-goi-ten-design.md
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-09-03T04:03:00Z
---

# Acceptance Contract: vu-trang-goal-luc-goi-ten

## Context

Vòng meta duy nhất cửa sổ 2.7→2.8, owner «gọi tên» 03/09. Vật: `scripts/gate-card.js`
(hằng `GOAL_TEMPLATE` + `goal_line`) · `feature-loop/skills/feature-loop/SKILL.md`
(điểm in S0 · Gate 1 · Gate 1.5; bất biến dừng) · `GUIDE.md` (mục `/goal`) ·
`tests/plugins/run-tests.sh` (P85 nới 3 bản) · `tests/scripts/gate-card-lmcms.test.mjs`
hoặc file ca mới. Ô nguồn: `_acceptance/vu-trang-goal-luc-goi-ten/opportunity.md`.

## Criteria

- AC-1: Given khuôn goal rút qua marker `GOAL-TEMPLATE` từ ba file (khối trong rào ``` của SKILL feature-loop và GUIDE; nội dung NGUYÊN VĂN giữa hai dấu `` ` `` của template literal `GOAL_TEMPLATE` trong `scripts/gate-card.js` — không trim từng dòng, không chuẩn hoá khoảng trắng bên trong dòng), When so ba khối sau `strip()` hai đầu (đúng nghĩa P85 hiện hành) và đếm dòng, Then ba khối bằng nhau từng ký tự và cùng 6 dòng; đột biến đổi MỘT ký tự Ở GIỮA một dòng, lần lượt ở từng bản trong ba, chạy qua chính ca → mỗi lần đỏ và gọi tên đúng bản lệch với hai bản còn lại (ba chiều đỏ, không chỉ một).
- AC-2: Given hồ sơ ở trạng thái trình Cổng 1 (`draft`), When dựng thẻ với `--extract --gate 1`, Then JSON có khoá `goal_line` là MỘT dòng = khuôn rút qua marker của `gate-card.js` sau khi gộp mỗi xuống dòng thành một khoảng trắng và thay MỌI lần xuất hiện của `<slug>` (khuôn có hai) bằng slug thật; test dựng kỳ vọng bằng phép thay độc lập và assert `goal_line` không còn chuỗi `<slug>` — không gõ literal, không chép hàm thay của bên viết.
- AC-3: Given cùng hồ sơ, When render thẻ HTML Cổng 1, Then phần tử `<div class="mach goal">` KỀ NGAY SAU `</div>` đóng của `<div class="mach">` chứa `one_shot` (định vị bằng chính chuỗi `one_shot` từ `--extract`, giữa hai phần tử chỉ được có khoảng trắng — đo kề-nhau trong chuỗi HTML, KHÔNG dùng «cùng khối `.grp gdo`» vì dòng lệnh đứng ngoài khối đó) và `<b>` trong nó BẰNG ĐÚNG `goal_line` (đẳng thức, không phép chứa; đột biến nối đuôi → đỏ); phần tử goal KHÔNG dùng `<p class="li">` (P185 đòi đúng một `<p class="li">` không-mẫu trong đoạn VIỆC-CỦA-ANH); thẻ Cổng 1 đang có cờ đỏ (rơi bậc / g1Blocked) VẪN in — đối chứng ba chiều: thẻ sạch có, thẻ đỏ có, thẻ Cổng 2 KHÔNG có khoá `goal_line` lẫn `.mach.goal` (P150 giữ thẻ Cổng 2 byte-identical).
- AC-4: Given SKILL feature-loop sau sửa, When đọc, Then (a) mục S1 có câu nêu «mỗi câu xin duyệt thiết kế» của brainstorm in kèm khối «GOAL-TEMPLATE» (điểm vũ trang đầu — không phải «câu cuối», vì brainstorm có nhiều câu xin duyệt và không biết trước câu nào cuối; ca brainstorm không hỏi gì → khai «chưa phủ»); (b) S1#7 nêu phản biện context sạch chạy «đồng bộ»/«chờ trong lượt», KHÔNG nền; (c) mục Gate 1 vẫn giữ bước in; (d) mệnh đề «T3: GATE 1.5» trong S2#3 có vế «kèm dòng /goal»; (e) câu S1#5 «gộp thành MỘT Gate 1» có vế nói rõ dòng goal in kèm câu xin duyệt KHÔNG phải một cổng — grep neo chữ trên văn chỉ dẫn (*đo chỉ dẫn, không đo đầu ra — Known limits; đầu ra đo ở ba dòng số mốc 2.8.0*).
- AC-5: Given GUIDE mục `/goal` sau sửa, When đọc đoạn «Khi nào», Then nêu đủ ba thời điểm (mỗi câu xin duyệt thiết kế của brainstorm · duyệt Cổng Phạm vi · duyệt Gate 1.5), câu «làn V T2 KHÔNG chạm UI: lần in ở brainstorm là lần duy nhất» (feature chạm UI có S1-D design-pass bất đồng bộ — điểm dừng có thiết kế, ngoài phạm vi), và câu «brainstorm không hỏi gì → chưa phủ»; các câu «hai bản» quanh khuôn (SKILL dòng chú thích, GUIDE, tiêu đề P85) đổi thành «ba bản»; khuôn GOAL-TEMPLATE KHÔNG đổi chữ (P85 các vế đã ghim: bắt đầu `/goal `, có `verified`, có `REJECT quá 3 round`, không có `signed-off`).
- AC-6: Given câu bất biến dừng đầu SKILL feature-loop, When đọc, Then có vế gọi tên ca «tiến trình nền báo xong → đi tiếp trong cùng lượt» và gọi «báo cáo rồi ngừng nói» là dừng ngoài thiết kế — grep neo chữ (*Known limits như AC-4*).
- ~~AC-7~~ **THU PHẠM VI (owner quyết 03/09 sau dừng-vá lần ba, sổ 5001):** thước máy cho nếp «S4 qua Workflow» (`run-log-minted.mjs`) sinh 9/14 phát hiện vòng 3 và không hội tụ qua ba vòng — bỏ khỏi hợp đồng. Nếp vẫn được giữ và đọc bằng mắt ở Cổng 2 trên hai vết máy sinh: `usage-report.md` (wf-usage từ transcript workflow, mỗi vòng một mục) và `run_id` dạng `minted-<slug>-…` trong `run-log.jsonl`. Known limits.

## Coverage

- Trục A · vật thẻ (bản chép thứ ba | goal_line extract | HTML round-trip | thẻ đỏ vẫn in | Cổng 2 không in) [thước CE: fixture code-sinh + rút qua marker + đột biến] → AC-1..AC-3. Trục B · văn chỉ dẫn (câu xin duyệt brainstorm | gap-probe đồng bộ | Gate 1 | Gate 1.5 | không-phải-cổng | GUIDE | bất biến dừng) [thước CE: grep neo chữ — đo chỉ dẫn] → AC-4..AC-6. Trục C · vết máy-giữ của nếp S4-qua-Workflow [thước CE: script đọc run-log sau append, hai chiều trên fixture] → AC-7. Ô «hành vi phiên có in thật không» và ô «brainstorm không hỏi gì» KHÔNG đo được bằng harness — Known limits, đo bằng ba dòng số mốc 2.8.0 (giả định sinh tử 2).

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
- Điểm dừng có thiết kế còn lại trong S1 với feature chạm UI: S1-D design-pass bất đồng bộ (máy gửi gói, người phản ứng lúc rảnh) — không phải chỗ ngừng ngoài thiết kế; ngoài phạm vi.
- Ca brainstorm KHÔNG hỏi gì (như chính vòng này: «gọi tên» → thẳng tới artifact) — không có lượt người để vũ trang trước Cổng 1; khai «chưa phủ», đo ở ba dòng số.

## Notes

- Gap-probe vòng 1 (P0 1 · P1 4 · P2 6) và vòng 2 (P0 0 · P1 2 · P2 4) định đoạt từng dòng trong sổ 1005–1009; bản gap-probe.md hiện tại là vòng 2.
- Known limits khai trước: AC-4/5/6 đo chỉ dẫn; AC-7 chỉ đo được sau khi run-log có dòng; brainstorm không hỏi gì → chưa phủ; điểm vũ trang «mỗi câu xin duyệt» là dặn cho câu có hình dạng biết trước.
- Known limits (S4-r1, sổ cái `vu-trang-goal-luc-goi-ten#5`): fixture của `run-log-minted.test.mjs` viết tay theo khuôn bên viết (acceptance-verify.js dòng 693/704), không round-trip từ writer thật; round-trip thật là lần chạy script lúc trình Cổng 2 trên run-log do Workflow đúc — đầu ra dán vào gói.
- S4-r1 (Workflow, BLOCKED vì suite scripts bị công cụ cắt): 13 phát hiện, 12 đóng trong lượt + 1 khai trên; sổ cái thêm 9 dòng (7 `chet`, 1 `trung`, 1 `song`). Lỗi nếp tái phạm: chạy suite TRƯỚC khi lật `status` — bản ghi mốc định tuyến lỗi thời ngay tại HEAD.
- S4-r2 (PENDING, triage hỏng, 8 phát hiện đóng trong lượt) · S4-r3 (REJECT E2/E3: bản ghi mốc lỗi thời LẦN BA + 9 phát hiện về thước AC-7) → dừng-vá + trần 3 vòng → owner chọn **thu phạm vi + đổi khuôn nhỏ** (sổ 5001): bỏ AC-7 + thước; hai bản ghi mốc LM13/LM20 chỉ ghim hồ sơ ĐÃ CHỐT và dời ra `tests/scripts/fixtures/` (hết thuế ghim lại hồ sơ đã ký — đóng luôn Known limits «bản ghi mốc trong hồ sơ đã ký» của mốc 2.7.0); một vòng đo lại, không sửa thêm.
- Known limits (thu phạm vi): routing và cờ vàng của hồ sơ ĐANG MỞ chỉ được phủ bằng fixture code-sinh (LM10/LM18/LM01–LM06), không bằng kho thật; nếp «S4 qua Workflow» không có thước máy.

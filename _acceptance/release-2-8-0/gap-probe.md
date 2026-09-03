---
slug: release-2-8-0
at: 2026-09-03T13:30:00Z
verdict: findings
p0: 1
p1: 3
p2: 2
by: PHIÊN THI CÔNG tự soi — KHÔNG phải phiên tươi độc lập (bộ phân loại an toàn của harness quá tải suốt lượt dựng hồ sơ, mọi lượt gọi phiên con đều bị từ chối). Khai thẳng làm Known limits; bù bằng agent soi + phản bác của Workflow S4 trên cùng cây.
---

## Findings

Soi theo sáu lớp lỗi đã tái phát ở hồ sơ mốc của kho này (nguồn: gap-probe
2.5.0 · 2.6.0 · 2.7.0). Mỗi dòng kèm bằng chứng tự chạy/đọc được.

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | `.claude-plugin/plugin.json` mục v2.8.0 vế (1) + `contract.md` Context mục 1 | Cả hai khai thẻ Cổng 1 in «the **six-line** /goal block» / «khối /goal **sáu dòng**». SAI: `scripts/gate-card.js:110` `goalLine = s => GOAL_TEMPLATE.trim().split('\n').join(' ').split('<slug>').join(s)` gộp sáu dòng thành MỘT dòng; chú thích ngay trên nó (dòng 109) tự viết «Một dòng»; HTML dòng 662 in `<b>${esc(goalLine(slug))}</b>`; ca GL01 ghim đúng chữ «mot dong». Khuôn sáu dòng chỉ tồn tại ở SKILL và GUIDE, không ở thẻ | Người tiêu thụ đọc ghi chú phát hành, chờ thấy một khối sáu dòng trên thẻ, thấy một dòng dài → nghi thẻ hỏng hoặc nghi bản cài sai; đúng lớp P0 của 2.6.0 và 2.7.0 (câu khai hành vi trong manifest mà vật thật làm khác) | Mọi câu manifest mô tả HÌNH DẠNG một vật in ra phải khớp với chính hàm dựng vật đó, không khớp với nguồn khuôn | **đã sửa**: cả hai chỗ đổi thành «lệnh /goal thành MỘT dòng (khuôn sáu dòng gộp lại)» |
| P1 | `.claude-plugin/plugin.json` vế (1) + `contract.md` Context mục 1 | Khai «the human's **one answer** at Gate 1 arms the machine» / «câu trả lời một chạm ở Cổng 1 đồng thời vũ trang máy». Thẻ thật (`gate-card.js:662`) viết «Sau khi trả lời (duyệt hay sửa), **dán dòng này** để đoạn máy chạy tới cổng kế» — câu trả lời KHÔNG tự vũ trang, người phải dán thêm dòng /goal. Đó là thứ THỨ HAI phải gõ, trong khi luật (c) đếm ≤1 chạm/lượt | Ghi chú phát hành hứa một chạm; người dùng đếm ra hai thứ phải gõ ở cùng một lượt và kết luận số của kit không đáng tin. Cùng lớp «định ngữ làm số trượt trông như đạt» | Câu khai về SỐ CHẠM phải đếm đúng số thứ người phải gõ, kể cả khi máy cho sẵn chữ để dán | **đã sửa**: khai thẳng «dán là thứ thứ hai phải gõ; thẻ cho sẵn chữ, còn có thành một chạm hay không thì ba dòng số mốc kế đo» |
| P1 | `contract.md` bảng Ba dòng số, ô «Lượt gọi người» của #140 | Xếp lượt **dừng-vá ở trần** vào nhóm «trong thiết kế» để ra «3 = đúng trần T2». Luật (c) trong `CLAUDE.md` định nghĩa 3 = ĐÚNG BA CỔNG (Đáng · Phạm vi · Bằng chứng); vòng này chỉ có 2 cổng thật (Đáng `de9a4b78` · Bằng chứng `28533e99`; Phạm vi làn V = 0). Lượt dừng-vá do STOP-PATCHING-CLAUSE sinh ra — có thiết kế, nhưng không phải một trong ba cổng luật đếm | Số 3 «vừa khít trần» vào sổ nhớ và mốc kế; lần sau ai đếm lại theo đúng chữ luật sẽ ra 2, và cả hai lần đếm đều tự xưng là đúng. Đúng lớp P1 của 2.7.0 («định ngữ thêm SAU khi thấy số») | Mỗi lượt gọi người phải xếp vào nhóm theo ĐỊNH NGHĨA của luật, không theo tổng muốn ra | **đã sửa**: tách ba nhóm — cổng luật (c) 2 (dưới trần) · lượt dừng-vá có thiết kế 1 · hạ tầng phiên 2; tổng 5 lượt owner, «merge» không đếm theo nếp 2.7.0 |
| P1 | `contract.md` bảng Ba dòng số, ô Radar | Khai «10 mục Ngoài định đoạt **cùng phút** (dấu hiệu câu gộp một lượt)». Sổ Radar (`_acceptance/luoi-phai-thuc-su-do/decisions.jsonl`) ghi `ngoai1` 23:00:00Z … `ngoai10` 23:09:00Z — mười phút liên tiếp, mỗi mục một phút, không cùng phút | Suy luận «câu gộp một lượt» dựng trên một sự kiện không có thật; nếu về sau ai kiểm lại sổ Radar thì cả kết luận lẫn phương pháp đếm mất tín nhiệm | Mọi mệnh đề về dấu thời gian phải đọc từ trường `at` thật, không suy từ ấn tượng | **đã sửa**: «mười mục ghi liên tiếp mỗi phút một mục (23:00Z→23:09Z — máy ghi một lượt, không phải người quyết mười lượt)» |
| P2 | `contract.md` mục Ba dòng số, câu dẫn Radar | «chạy dưới kit 2.7.0 (cài 03/09 sáng)» — không vết nào trong hồ sơ Radar nói vòng đó chạy dưới bản nào; căn cứ duy nhất là thư mục cache plugin có `2.7.0` và mốc cài buổi sáng, tức SUY LUẬN | Điểm dữ liệu tiêu thụ được đọc như phép đo cho thẻ 2.7; nếu vòng Radar thật ra chạy dưới 2.6.0 thì mọi so sánh trước/sau sai. Cùng lớp P1 «measured/shows» của 2.7.0 | Câu về môi trường chạy của một vòng ở kho khác phải trỏ tới vết trong kho đó, hoặc tự khai là suy luận | **đã sửa**: khai thẳng «suy từ mốc cài, không có vết trong hồ sơ Radar», và không dùng vòng đó làm phép đo cho thẻ 2.7 |
| P2 | `.claude-plugin/plugin.json` vế (3) + `contract.md` Context mục 3 | «three **byte-equal** copies» / «ba bản chép **byte-bằng**» — P85 so sau `strip()` hai đầu (chính AC-1 của #140 viết «so ba khối sau `strip()` hai đầu»), nên hai đầu KHÔNG được so | Ai đọc «byte-equal» rồi thêm một dòng trống ở cuối một bản sẽ chờ suite đỏ; suite xanh → tưởng lưới hỏng | Chữ mô tả một phép so phải nói đúng phép so đó thực hiện gì | **đã sửa**: «held byte-equal after end-trimming by P85» / «bằng nhau từng ký tự sau khi cắt hai đầu» |

### Hai lớp soi KHÔNG ra finding (ghi để biết đã soi)

- **Dấu thời gian sổ so với commit** (lớp tái phát 4 lần): ba entry và
  `veto_opened_at` đều `2026-09-03T13:09:38Z`; commit mở hồ sơ `e3215399` là
  `2026-09-03T20:09:50+07` = `13:09:50Z` — sổ ghi TRƯỚC commit 12 giây. Sạch.
- **Phạm vi diff**: `git diff --name-only f265b475..30ae6850` (trừ
  `_acceptance/`, `docs/`, bản đồ) ra ĐÚNG 12 file, khớp 4 + 1 + 7 hợp đồng khai,
  không thiếu không thừa. Sạch.

### Giới hạn của chính bảng này

Người soi là **phiên thi công**, không phải phiên tươi — đây đúng là thứ
Known limit #1 của 2.7.0 nói tới, lần này không phải do chọn mà do bộ phân loại
an toàn của harness quá tải liên tục (mọi lượt gọi phiên con đều bị từ chối, kể
cả sau khi thử lại). Hệ quả phải khai: sáu finding trên là những chỗ người viết
tự bắt được mình, nên lớp lỗi mà người viết KHÔNG nhìn thấy vẫn còn nguyên rủi
ro. Bù đắp một phần: S4 của mốc này chạy qua Workflow `acceptance-verify`, có
agent soi và agent phản bác chạy context riêng trên cùng cây — 2.7.0 không có
bước đó.

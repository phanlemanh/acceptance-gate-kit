# Design — tool-kill-duong-doc-lap: một nguồn luật «hết giờ không phải trượt» cho cả hai đường kiểm

**Ngày:** 2026-08-19 · **Hạng:** T2 · **Hạt giống:**
[docs/plans/2026-08-18-hat-giong-tool-kill-duong-doc-lap.md](../../plans/2026-08-18-hat-giong-tool-kill-duong-doc-lap.md)
· **Hồ sơ trước:** `_acceptance/het-gio-khong-phai-truot` (ký 18/08, PR #67).

## Vấn đề

Luật «lệnh bị công cụ ngắt ≠ lệnh fail» hiện sống trong một hằng chuỗi của
`feature-loop/workflows/acceptance-verify.js` (marker `TOOL-KILL-RULE`) và chỉ
ba lane của vòng lặp tính năng đọc được nó. Đường VERIFY độc lập của skill
`acceptance` (Phase 3 mục 2) không có một chữ nào về trần thời gian của công
cụ và không có lớp JS phía sau — repo tiêu thụ chạy đường này vẫn dính đúng sự
cố gốc (suite ~108 s bị công cụ ngắt ở ~118 s dưới tải → từ chối oan).

Đường độc lập là của plugin **acceptance-gate**, có thể cài mà không có
feature-loop; workflow JS chạy trong sandbox **không có filesystem**. Nên «một
nguồn» không thể là «hai bên cùng đọc một file lúc chạy» theo nghĩa JS tự đọc.

## Lời giải: nguồn ở acceptance-gate, workflow NHẬN nguyên văn qua args

1. **Nguồn duy nhất** — file mới
   `skills/acceptance/references/tool-kill-rule.md` (plugin acceptance-gate),
   khối marker `<!-- <<<TOOL-KILL-RULE -->` … `<!-- TOOL-KILL-RULE>>> -->` chứa
   đúng câu luật đang chạy (chuyển nguyên văn từ JS, chữ không đổi để không đổi
   hành vi đã chứng minh qua ba vòng verify). Quanh marker: vì sao có luật, mỗi
   đường tiêu thụ nó thế nào, khuôn hồ sơ cho lượt bị ngắt.
2. **Đường vòng lặp** — `acceptance-verify.js` **xoá bản chép**. Nhận
   `args.toolKillRule` = nguyên văn file nguồn (main loop của skill feature-loop
   đọc file đã resolve bằng `resolve-plugin.mjs --require …/tool-kill-rule.md`),
   rút khối bằng regex marker; thiếu args hoặc không rút được marker →
   `BLOCKED` với reason ghim (không có đường chạy-không-luật im lặng, không
   fallback chuỗi cứng — fallback chính là bản chép thứ hai). Ba lượt nội suy
   `${TOOL_KILL_RULE}` giữ nguyên; `normKill`/schema giữ nguyên.
3. **Đường độc lập** — `skills/acceptance/SKILL.md` Phase 3: mục 1 thêm khối
   TOOL-KILL-RULE của `references/tool-kill-rule.md` VERBATIM vào prompt phiên
   tươi (cùng nếp «Network truth»); mục 2 nói lượt bị ngắt ghi run-log
   `exit_code: null` + `"killed_by_tool": true`; mục 4 routing: bị ngắt →
   `BLOCKED`, `reason: bi cong cu giet o <N> giay — <eval>` — chạy lại với
   trần công cụ đủ dài, không sửa code. `evidence-report-template.md` mục
   BLOCKED nêu rõ trường hợp này (tiêu chí 3 của hạt giống: người đọc phân biệt
   được «hạ tầng» với «sản phẩm trượt»).
4. **Bộ đo** — `tests/workflows/acceptance-verify.test.mjs` W25 viết lại:
   RULE rút từ **file nguồn thật** (round-trip từ writer thật, không từ JS);
   harness cấp `toolKillRule` mặc định từ chính file đó như main loop làm
   (case muốn thử thiếu truyền `''`); ba lane chứa nguyên văn; mutant từng lane;
   thiếu args → BLOCKED đúng reason; JS **không còn** câu đặc trưng của luật;
   và đóng không gian lane **từ chính lượt chạy**: mọi agent có schema khai
   mã thoát (`exitCode` / `results[].baselineExit`) phải mang luật — không danh
   sách lane viết cứng (đóng Known limit 4 hồ sơ trước).
5. **Bộ đo hành vi (đóng Known limit 2)** — hội đồng phiên sạch theo nếp 1c:
   agent hành động KHÔNG TOOL nhận inline chỉ dẫn SAU sửa + tool result giả
   lập; giám khảo (panel S4) chấm transcript theo đáp án viết trước ở
   `giam-khao/`. Ba ca: đường độc lập bị ngắt → BLOCKED · đường độc lập trượt
   thật → REJECT (chống a-dua) · đường vòng lặp bị ngắt → `killedByTool=true`.

## Ngoài phạm vi

Trần thời gian của công cụ · tự chạy lại lệnh bị ngắt · gom `normKill` về một
biên (Known limit 3 hồ sơ trước) · sửa chữ trong hồ sơ đã ký (Known limit 6).

## Rủi ro / đánh đổi đã nhận

- Thêm một field args bắt buộc cho workflow: caller cũ (skill feature-loop
  cũ) với JS mới → BLOCKED rõ ràng thay vì chạy không luật. Skill và JS ship
  cùng version nên đường này chỉ xuất hiện khi lệch cache; reason ghim tên file
  cần truyền.
- Đường độc lập vẫn là chỉ dẫn cho phiên tươi (không có JS phía sau) — hội
  đồng là bộ đo hành vi; nếu model đổi làm xói mòn thì hội đồng vòng sau bắt,
  còn suite chữ không bắt được (ghi Known limits).

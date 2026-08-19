---
schema_version: 1
feature: Luật «lệnh bị công cụ ngắt ≠ lệnh fail» thành MỘT nguồn ở acceptance-gate cho cả đường vòng lặp (workflow nhận qua args) lẫn đường VERIFY độc lập của skill acceptance; đóng bộ đo hành vi bên viết bằng hội đồng phiên sạch
slug: tool-kill-duong-doc-lap
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [cli]
status: approved
approved_by: ""
approved_at: ""
veto_state: mo
veto_opened_at: 2026-08-19T01:51:41Z
---

# Acceptance Contract: tool-kill-duong-doc-lap

## Context

Hồ sơ `het-gio-khong-phai-truot` (ký 18/08, PR #67) đặt luật «lệnh bị công cụ
ngắt ≠ lệnh fail» vào ba lane của `feature-loop/workflows/acceptance-verify.js`
— một hằng chuỗi trong marker `TOOL-KILL-RULE`, field `killedByTool` ở ba
schema, `normKill` ép về BLOCKED. Đường VERIFY **độc lập** của skill
`acceptance` (`skills/acceptance/SKILL.md` Phase 3 mục 2) không mang luật này
và không có lớp JS phía sau (grep `timeout|600000|killedByTool` trong SKILL.md
+ references/ = 0 hit, đo 18/08). Repo tiêu thụ chạy đường này vẫn dính đúng sự
cố gốc: bộ kiểm ~108 s bị công cụ ngắt ở ~118 s dưới tải → từ chối oan.

Ràng buộc kế thừa: (1) MỘT nguồn dùng chung, không chép tay hai bản; (2) đo
ĐẦU RA thật, chiều đỏ chạy cùng lượt, không đo chỉ dẫn suông; (3) không dựng
phép-đo-canh-phép-đo; (4) Known limit 2 hồ sơ trước (bên VIẾT lời khai chưa có
bộ đo hành vi) là ứng viên đóng nốt — hồ sơ này đóng bằng hội đồng phiên sạch.

Vật: `skills/acceptance/references/tool-kill-rule.md` (MỚI — nguồn),
`feature-loop/workflows/acceptance-verify.js` (xoá bản chép, nhận
`args.toolKillRule`), `feature-loop/skills/feature-loop/SKILL.md` (S4 args),
`skills/acceptance/SKILL.md` Phase 3 + `references/evidence-report-template.md`
(đường độc lập). Phép đo: `tests/workflows/acceptance-verify.test.mjs` (W25),
`tests/workflows/harness.mjs`, răng hồ sơ `_acceptance/tool-kill-duong-doc-lap/rang.sh`,
hội đồng `hoi-dong/` + `giam-khao/`. Design:
`docs/superpowers/specs/2026-08-19-tool-kill-duong-doc-lap-design.md`.

## Criteria

### AC-1 — Luật có ĐÚNG MỘT nguồn, ở gói nền
Given plugin acceptance-gate có file `skills/acceptance/references/tool-kill-rule.md`
chứa khối marker `TOOL-KILL-RULE` với câu luật (trần công cụ ≥ 600000 ms · lệnh
bị công cụ dừng → cannotRun + killedByTool + reason «bi cong cu giet o <so giay>
giay» · không báo exitCode như lệnh tự fail),
When quét cây nguồn tìm câu đặc trưng của luật («TRAN THOI GIAN CONG CU»),
Then câu ấy xuất hiện DUY NHẤT trong khối marker của file nguồn — KHÔNG có bản
chép trong `acceptance-verify.js` hay `skills/acceptance/SKILL.md` (hai nơi ấy
chỉ NHẬN/TRỎ). Chiều đỏ: tiêm một bản chép vào bản sao JS → răng đỏ ghim tên
file thừa.

### AC-2 — Đường vòng lặp nhận luật qua args, thiếu thì BLOCKED có tên
Given workflow `acceptance-verify.js` được invoke với `args.toolKillRule` =
nguyên văn file nguồn,
When workflow dựng prompt cho ba lane machine / ui / baseline,
Then cả ba prompt chứa NGUYÊN VĂN khối rút từ marker của file nguồn (round-trip
từ writer thật: test đọc CHÍNH file, không đọc JS); và khi `toolKillRule`
vắng, rỗng, hoặc không chứa marker → verdict `BLOCKED`, `blocked[0].cmd ==
'(args)'`, reason ghim tên file `tool-kill-rule.md` + «TOOL-KILL-RULE» — không
có đường chạy-không-luật im lặng, không fallback chuỗi cứng.

### AC-3 — Không gian lane đóng từ chính lượt chạy, mutant cô lập từng lane
Given một lượt chạy workflow qua harness,
When liệt kê mọi agent có schema khai mã thoát (`properties.exitCode` hoặc
`results.items.properties.baselineExit`),
Then MỌI agent như vậy có prompt chứa khối luật — danh sách lane rút từ lượt
chạy, không viết cứng; số lượt nội suy `${TOOL_KILL_RULE}` trong source = số
lane ấy; và xoá đúng một lượt nội suy trong bản sao thì CHỈ lane đó mất luật
(mutant/lane, ma trận toàn phần).

### AC-4 — Skill feature-loop khai đường lấy luật
Given `feature-loop/skills/feature-loop/SKILL.md` mục S4 chuẩn-bị-args,
When đọc bước resolve plugin acceptance-gate,
Then resolver `--require skills/acceptance/references/tool-kill-rule.md` (ép
acceptance-gate đủ mới) và args Invoke có `toolKillRule` = nguyên văn file đó;
GUIDE/README không cần thêm bản chép nào của luật.

### AC-5 — Đường độc lập mang cùng luật và hồ sơ nói được «hạ tầng»
Given `skills/acceptance/SKILL.md` Phase 3 và `references/evidence-report-template.md`,
When phiên điều phối dựng prompt cho phiên tươi VERIFY và phiên tươi gặp lệnh
bị công cụ ngắt,
Then Phase 3 mục 1 liệt kê khối TOOL-KILL-RULE của `references/tool-kill-rule.md`
VERBATIM trong prompt (cùng nếp Network truth — trỏ file, không chép câu luật);
mục 2 khai run-log cho lượt bị ngắt: `exit_code: null` + `"killed_by_tool": true`;
mục 4 routing: bị ngắt → `BLOCKED` với `reason` nêu eval + số giây và chữa bằng
chạy lại, không sửa code; template BLOCKED nêu đúng trường hợp này. Chiều đỏ:
gỡ con trỏ tới file nguồn khỏi bản sao SKILL.md → răng đỏ ghim mục thiếu.

### AC-6 — Hành vi bên viết: hội đồng phiên sạch, ba ca (judgment)
Given một phiên sạch KHÔNG TOOL nhận inline (a) chỉ dẫn SAU sửa của đường đang
xét + (b) khối luật + (c) prompt lane machine do harness dựng thật (ca 3) + (d)
tool result giả lập, theo đề `hoi-dong/ca-E6.md` — gói (a)(b)(c) CODE-SINH từ
vật thật bởi `dung-goi.mjs`, sha256 ghi ở `hoi-dong/goi-E6.sha256` và cite
trong header transcript (lệch → UNCERTAIN),
When phiên viết ra lời khai / dòng run-log / verdict như thể đang làm thật,
Then giám khảo chấm theo `giam-khao/dap-an-E6.md` (viết trước thi công, chỉ
giám khảo nạp): ca 1 đường độc lập bị ngắt → BLOCKED + reason nêu giây/bị
ngắt, không `failed_evals`, run-log không mã thoát của lệnh; ca 2 đường độc lập
trượt thật (output trọn, dòng tổng kết có FAIL) → REJECT + failed_evals, KHÔNG
khai bị ngắt (chống a-dua); ca 3 đường vòng lặp bị ngắt → JSON theo schema với
`cannotRun=true` + `killedByTool=true` + reason khuôn. 3/3 đạt → PASS.

### AC-7 — Tương thích ngược: routing cũ giữ nguyên, suite tồn kho xanh
Given suite `tests/workflows` sau khi W25 viết lại và harness cấp
`toolKillRule` từ file nguồn,
When chạy trọn suite,
Then mã thoát 0 + dòng tổng kết `0 failed`; W26/W27 (routing killedByTool ⇒
BLOCKED, baseline killed ⇒ n-a, đối chứng exit 1 thật ⇒ REJECT/red) vẫn có mặt
và xanh — không case cũ nào phải đổi khuôn ngoài việc nhận luật từ nguồn.

## Coverage

Quét không gian AC theo hai trục (morphological, gọn — bài toán 2 chiều):

| Đường \ Mắt xích | Nguồn luật | Prompt mang luật | Lời khai (bên viết) | Đọc lời khai (routing) | Hồ sơ người đọc |
|---|---|---|---|---|---|
| Vòng lặp (workflow) | AC-1, AC-2 | AC-2, AC-3 | AC-6 ca 3 | AC-7 (đã ký hồ sơ trước, giữ) | đã có (card BLOCKED) |
| Độc lập (skill acceptance) | AC-1, AC-5 | AC-5 (chỉ dẫn VERBATIM) | AC-6 ca 1–2 | AC-5 (chỉ dẫn + hội đồng; đường độc lập không đi qua workflow nên không có lớp JS phía sau — Known limits) | AC-5 (template BLOCKED) |

Ô «đọc lời khai» của đường độc lập chỉ có chỉ dẫn + hội đồng, không có răng
máy tiền định — nêu ở Known limits.

## Out of scope

- Trần thời gian của công cụ (không đổi ~120 s mặc định của harness).
- Tự chạy lại lệnh bị ngắt — chữa là việc người/vòng sau, không phải máy.
- Gom `normKill` về một biên đọc duy nhất (Known limit 3 hồ sơ trước).
- Sửa chữ lệch trong hồ sơ đã ký `het-gio-khong-phai-truot` (Known limit 6).
- Đường Codex / mọi harness ngoài Claude Code (đã lưu kho, ADR 0008).

## Notes

**Vai hai lớp thước (như 1c):** lớp MÁY (AC-1..5, 7) chỉ chứng mực-đã-in và
đầu ra thật của workflow qua harness — mỗi chân răng hồ sơ kèm chiều đỏ trong
cùng lượt trên bản sao code-sinh; lớp HÀNH VI (AC-6) chấm bằng hội đồng phiên
sạch với đáp án viết trước ở `giam-khao/`, đề ở `hoi-dong/`, không chung thư
mục; agent hành động không thấy đường dẫn workspace nào.

**Không dựng phép-đo-canh-phép-đo:** răng hồ sơ ghim đúng dòng ca W25 trong
stdout suite (nếp p194) + kiểm mã thoát/dòng tổng kết; không có chân «không
case cũ nào bị sửa» (owner đã gỡ 18/08).

Known limits (điền ở Cổng 2):

## Gate 2 checklist (human)

- [ ] Đọc bảng eval; soi E2 (BLOCKED-thiếu-args) và E6 (hội đồng)
- [ ] Không mục nào UNCERTAIN → không cần `human_override`
- [ ] Đọc Known limits

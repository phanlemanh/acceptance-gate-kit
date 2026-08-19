## Trong hợp đồng

### Assertion âm-tính không ghim thông điệp — nhánh «toolKillRule không marker → BLOCKED»
- file: `tests/workflows/acceptance-verify.test.mjs:1557`
- severity: low
- AC: AC-2

Case `W25 toolKillRule khong marker -> BLOCKED (args)` chỉ ghim `verdict === 'BLOCKED'`, `blocked[0].cmd === '(args)'` và `calls.length === 0`, KHÔNG ghim reason. Workflow có hai lối BLOCKED cùng cmd '(args)' (dòng 56: evals/suiteCommands không phải array; dòng 80: thiếu marker) nên assert này không phân biệt được «bắt đúng lỗi thiếu marker» với «rơi vào BLOCKED args-shape khác». Case chị em `rMissing` ngay trên có ghim regex /tool-kill-rule\.md/ + /TOOL-KILL-RULE/ — case này thiếu cùng ghim đó (hình dạng 4: âm-tính-một-mình, không ghim thông điệp).

Rationale: AC-2 quy định rõ nhánh «không chứa marker» phải có reason ghim tên file tool-kill-rule.md và chuỗi TOOL-KILL-RULE; case kiểm cho đúng nhánh này lại không xác nhận reason nên không chứng minh được phần Then đó của AC-2.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Preflight S0 không require tool-kill-rule.md dù S4 tuyên «preflight S0 lẽ ra đã bắt»**
  Người dùng thấy gì: Nếu một dự án cập nhật công cụ làm việc nhóm mới nhưng vẫn dùng gói nền cũ hơn, hệ thống có thể chạy qua vài bước rồi mới báo thiếu cấu hình, thay vì báo ngay từ đầu — gây mất thời gian chờ trước khi biết cần cập nhật.
  file: `feature-loop/skills/feature-loop/SKILL.md:78`
  severity: medium
  Đề xuất: known-limits

- **E2 tuyên «đọc lỗi → THROW, không fallback» nhưng không phép đo nào chạy chiều đó**
  Người dùng thấy gì: Một lời hứa trong tài liệu kiểm thử — rằng khi đọc file cấu hình luật bị lỗi thì hệ thống phải báo lỗi rõ ràng thay vì âm thầm bỏ qua — chưa từng được thử nghiệm bằng cách cố tình làm hỏng để xem có báo lỗi thật không, nên nếu hành vi đó bị hỏng sau này sẽ không ai phát hiện ra.
  file: `_acceptance/tool-kill-duong-doc-lap/evals.yaml:30`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
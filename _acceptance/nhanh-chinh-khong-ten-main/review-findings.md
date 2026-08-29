## Trong hợp đồng

### Silent wrong diff base: `git remote show origin` output is localized, so the HEAD-branch regex misses and the code falls back to guessing
- file: `feature-loop/scripts/s4-args.mjs:230`
- severity: high
- source: bugs
- AC: AC-6

`gitTry('remote', 'show', 'origin')` (line 226) inherits the ambient locale, and git translates that string: `HEAD branch:` becomes `Nhánh HEAD:` under vi, `Hauptbranch:` under de (verified with git 2.37.1). The regex `/HEAD branch:\s*(\S+)/` at line 230 then fails to match. Because the command itself SUCCEEDED, `out` is non-null, so the line-227 gate does not fire; `remoteDeclared` stays null, and the `if (!mainBranch && !remoteDeclared)` fallback at line 244 silently guesses main/master/develop/trunk.

Airtight repro — identical repo, only the locale differs. Main branch is `phat-trien` (declared by remote); a stale local `master` sits at an older commit:
```
LC_ALL=C            -> diffBase 3bf7a8bb... {"branch":"phat-trien","source":"remote"}
LC_ALL=vi_VN.UTF-8  -> diffBase 1ba77f70... {"branch":"master","source":"fallback"}
```
Both exit 0 and write args. The vi run silently compares against the wrong baseline commit.

This is exactly the «mốc so sánh sai lặng lẽ» class AC-8 (khong-doan-sang-ten-khac) and AC-9 (remote-hoi-khong-duoc) were written to close, re-entering through the locale door — and neither the new teeth (rang.sh) nor tests/scripts/s4-args-main-branch.test.mjs pins the locale, so both measure only the English path. Fix: force `env: { ...process.env, LC_ALL: 'C', LANGUAGE: '' }` in gitTry (or read `git symbolic-ref --short refs/remotes/origin/HEAD`, whose output is not translated), and treat «command succeeded but HEAD branch not parseable» as the same fail-closed case as line 228 rather than falling through to the guess.

Rationale (AC mapping): Given của AC-6 (remote trả lời được, khai tên ngoài bốn tên dự phòng) không loại trừ locale hệ thống; dưới locale khác EN, script giải sai lặng lẽ về fallback thay vì tên remote khai, vi phạm đúng Then của AC-6.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Lối thoát --diff-base chết ở đúng ca mà thông điệp lỗi chỉ nó (AC-9)**
  Người dùng thấy gì: Khi máy không tự nhận diện được nhánh chính vì mạng không phản hồi, người dùng làm đúng theo hướng dẫn báo lỗi (truyền cờ chỉ định) vẫn bị chặn lại — không có cách nào để tiếp tục công việc.
  file: `feature-loop/scripts/s4-args.mjs`
  severity: high
  Đề xuất: new-contract

- **evidence-report là bản round-4, không phủ mã r5 đã commit — hồ sơ khai `verified`**
  Người dùng thấy gì: Bằng chứng mà owner sắp xem để quyết định ký duyệt có thể không phản ánh đúng phiên bản mới nhất của tính năng — quyết định ký có nguy cơ dựa trên dữ liệu đã lỗi thời.
  file: `_acceptance/nhanh-chinh-khong-ten-main/evidence-report.md`
  severity: high
  Đề xuất: known-limits

- **stderr của git lọt vào mặt stderr mà AC-6 vừa khai là đầu ra**
  Người dùng thấy gì: Khi repo không có kết nối tới remote, người dùng có thể thấy dòng thông báo lỗi kỹ thuật xuất hiện trên màn hình dù thao tác vẫn thành công bình thường — gây hiểu lầm là có sự cố.
  file: `feature-loop/scripts/s4-args.mjs`
  severity: medium
  Đề xuất: known-limits

- **Lệnh tiêm đột biến ghim NGUYÊN VĂN mã nguồn dù marker vừa được dựng cho đúng việc đó**
  Người dùng thấy gì: Nếu về sau có người chỉnh sửa nhỏ trong mã mà không đổi hành vi thực, bộ kiểm tra tự động có thể báo sai là tính năng bị hỏng, làm chậm trễ và giảm độ tin cậy của quy trình xác nhận.
  file: `_acceptance/nhanh-chinh-khong-ten-main/rang.sh`
  severity: medium
  Đề xuất: new-contract

- **SKILL.md vẫn mô tả «detect remote → fallback main/master/develop/trunk» sau khi diff đổi luật**
  Người dùng thấy gì: Tài liệu hướng dẫn cho các phiên làm việc sau vẫn mô tả cách nhận diện nhánh chính theo kiểu cũ, trong khi hành vi thực tế đã thay đổi — người đọc tài liệu có thể hiểu nhầm cách tính năng hoạt động.
  file: `feature-loop/skills/feature-loop/SKILL.md`
  severity: medium
  Đề xuất: known-limits

- **Escape hatch --diff-base is unreachable: the new fail-closed die fires before the flag is consulted**
  Người dùng thấy gì: Khi máy không tự nhận diện được nhánh chính vì mạng không phản hồi, người dùng làm đúng theo hướng dẫn báo lỗi vẫn bị chặn lại, không có cách nào để tiếp tục.
  file: `feature-loop/scripts/s4-args.mjs`
  severity: high
  Đề xuất: new-contract

- **Assert "chuỗi có mặt" thay cho QUAN HỆ: AC-3 hứa «thông điệp nêu tên phần hỏng», phép đo chỉ grep tiền tố chung**
  Người dùng thấy gì: Nếu về sau thông báo lỗi bị viết gọn lại và mất phần nêu rõ nguyên nhân, bộ kiểm tra tự động vẫn có thể báo 'đạt' — người gặp lỗi sẽ khó tự tìm ra nguyên nhân hơn mà không ai phát hiện ra sự thoái hoá này.
  file: `_acceptance/nhanh-chinh-khong-ten-main/rang.sh`
  severity: medium
  Đề xuất: new-contract

- **Assert "chuỗi có mặt" thay cho QUAN HỆ: «nêu ĐÚNG tên remote khai» đo bằng literal `grep -q "main"` gõ tay**
  Người dùng thấy gì: Nếu tên nhánh chính dùng để kiểm tra sau này bị đổi, bộ kiểm tra tự động có thể báo sai kết quả — không ai chắc chắn hệ thống có thực sự nêu đúng tên nhánh mà remote đã khai hay không.
  file: `_acceptance/nhanh-chinh-khong-ten-main/rang.sh`
  severity: low
  Đề xuất: new-contract

- **Assertion âm-tính thiếu đối chứng dương cùng fixture (SA4 trong lưới thường trực)**
  Người dùng thấy gì: Nếu dữ liệu dùng để mô phỏng tình huống mạng bị lỗi hỏng vì lý do khác, bộ kiểm tra tự động có thể vẫn báo 'đạt' — không ai phát hiện ra công cụ thực sự không còn bảo vệ đúng tình huống mạng bị chặn nữa.
  file: `tests/scripts/s4-args-main-branch.test.mjs`
  severity: low
  Đề xuất: new-contract

⚠ Cụm ngoài vùng phủ: 2/10 lỗi rơi vào file không bộ đo nào phủ (_acceptance/nhanh-chinh-khong-ten-main/evidence-report.md, feature-loop/skills/feature-loop/SKILL.md) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.

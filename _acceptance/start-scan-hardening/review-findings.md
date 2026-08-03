# Review Findings: start-scan-hardening (round 3)

## Trong hợp đồng

- **Lỗi I/O trên opportunity.md làm biến mất slug lành đang chờ Cổng 2 (contract còn đọc được tốt)**
  file: `scripts/start-scan.mjs:93`
  severity: low
  AC: AC-1
  Guard mới `if (oRead.err) { broken.push(...); continue; }` (dòng 93) chạy TRƯỚC khi code kiểm `cTxt != null`. Nhưng opportunity.md chỉ được dùng ở nhánh `else` (dòng 127) — tức khi KHÔNG có contract.md. Vì vậy một slug có contract.md nguyên vẹn bị loại khỏi phân ô chỉ vì một file không bao giờ được đọc tới bị lỗi quyền.

  Đã chạy thật (fixture: contract status verified + evidence PASS + opportunity.md):
    trước:            gates: [{"slug":"s1","gate":"bang-chung",...}], broken: []
    chmod 000 opp:    gates: [], broken: [{"slug":"s1","file":"opportunity.md","reason":"không đọc được (EACCES)"}]

  Một việc đang chờ ký Cổng 2 rời khỏi danh sách chọn của /start. Đây vẫn là fail-loud (có tên file + mã lỗi trong broken[]) nên không phải nuốt lỗi im lặng, nhưng hướng thiệt hại ngược với ý định AC-1: artifact bên cạnh lại quyết định ô của slug. Sửa: dời guard oRead.err xuống trong nhánh `else if (oTxt != null)`/nhánh không-có-contract, hoặc chỉ đọc opportunity.md khi contract.md vắng.

  Mirror plugins/acceptance-gate/scripts/start-scan.mjs giống hệt.

  Vì sao khớp AC-1: AC-1 nêu đích danh rằng khi đọc thất bại, slug phải giữ nguyên chỗ trong broken[] "thay vì bị phân ô theo artifact bên cạnh" — finding mô tả đúng kịch bản này: một slug có contract.md lành bị đẩy khỏi phân ô đúng chỉ vì opportunity.md (artifact bên cạnh, không được dùng tới) đọc lỗi.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Nhánh `verified` vẫn gọi BLOCKED là "không nhận diện được" — chỉ vá nhánh `implemented`, trái chính comment vừa viết**
  Người dùng thấy gì: Khi một việc đã ở trạng thái đã-xác-minh bị dừng lại vì lý do môi trường (ví dụ mất quyền tạm thời), hệ thống có thể gắn nhãn hồ sơ đó là 'hỏng' thay vì cho phép người dùng tiếp tục phần việc còn dang dở, khiến việc đó biến mất khỏi danh sách để làm tiếp.
  file: `scripts/start-scan.mjs:118`
  severity: medium
  Đề xuất: new-contract

- **P102 chạy bằng root → `process.exit(0)` bỏ TOÀN BỘ case nhưng vẫn báo PASS**
  Người dùng thấy gì: Khi bộ kiểm thử tự động chạy trong môi trường có quyền quản trị cao (một số hệ thống kiểm tra tự động dùng cấu hình này), một loạt phép kiểm tra quan trọng bị bỏ qua âm thầm nhưng bảng kết quả vẫn hiện 'đạt' — khiến đội ngũ tưởng nhầm rằng tính năng đã được kiểm chứng đầy đủ trong khi thực ra một phần chưa từng được chạy thử.
  file: `tests/plugins/run-tests.sh:3185`
  severity: medium
  Đề xuất: known-limits

- **contract.md AC-2 vẫn ghi từ vựng {PASS, REJECT, PENDING-JUDGMENT} sau khi S4-r2 đổi hành vi sang gồm BLOCKED**
  Người dùng thấy gì: Tài liệu mô tả phạm vi tính năng vẫn liệt kê danh sách trạng thái kết quả cũ, chưa cập nhật theo thay đổi hành vi mới nhất, nên người đọc tài liệu này để ra quyết định có thể hiểu sai phạm vi thực tế mà phần mềm đang làm.
  file: `_acceptance/start-scan-hardening/contract.md:22`
  severity: low
  Đề xuất: known-limits

- **Từ vựng verdict vẫn KHÔNG dùng chung: nhánh `verified` bỏ sót BLOCKED — cùng một artifact bị phân ô khác nhau theo status**
  Người dùng thấy gì: Cùng một loại hồ sơ công việc bị xếp loại 'còn tiếp tục được' hay 'hỏng' khác nhau tuỳ vào giai đoạn nó đang ở, dù nguyên nhân dừng lại giống hệt nhau — người dùng có thể thấy việc của mình biến mất khỏi danh sách chỉ vì nó đang ở một giai đoạn khác.
  file: `scripts/start-scan.mjs:118`
  severity: medium
  Đề xuất: new-contract

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
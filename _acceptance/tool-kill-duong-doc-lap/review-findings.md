## Trong hợp đồng

- **Assertion âm-tính-một-mình: chiều đỏ chân `nguon` không đi qua hàm kiểm thật, thông điệp «ban chep thua» được in cứng bởi chính lệnh chiều-đỏ**
  file: `_acceptance/tool-kill-duong-doc-lap/rang.sh:324`
  severity: medium
  AC: AC-1
  detail: Chiều dương (dòng 313–320) kiểm bằng `git ls-files | xargs grep -l` + vòng `grep -qF "$SIG" "$f" && do_fail "ban chep thua: $f"`. Chiều đỏ (dòng 322–326) KHÔNG chạy lại vòng kiểm đó trên bản sao mà chỉ đếm `grep -l -F "$SIG" mutant_js rule_file | wc -l` rồi so `-eq 2`, và câu «(ban chep thua: $JS)» ở dòng 325 là chuỗi echo cứng trong nhánh OK — không phải thông điệp do checker phát ra. Vì vậy nếu vòng do_fail ở dòng 318–320 bị xoá/đổi tên (checker mù) thì chiều đỏ vẫn xanh: nó chỉ chứng minh `grep -F` tìm được chuỗi vừa tiêm, không chứng minh RĂNG bắt được bản chép. Khác với chân `w25` (dòng 352–361) đưa stdout đột biến qua CHÍNH `pin_check`, chân này thiếu mẫu «mutant đi qua chính checker» + ghim thông điệp checker thật; E1 trong evals.yaml lại mô tả chiều đỏ như thể răng tự đỏ ghim «ban chep thua: <file>».

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Run-log cho lượt bị công cụ ngắt có HAI khuôn ghi khác nhau giữa hai đường (cannot_run vs killed_by_tool)**
  Người dùng thấy gì: Khi lệnh kiểm tra bị máy tự ngắt giữa chừng, hệ thống ghi lại sự cố này theo hai cách khác nhau tuỳ đường chạy. Nếu sau này có công cụ tổng hợp báo cáo tự động, nó có thể đếm thiếu một số sự cố hạ tầng, khiến người dùng nhìn thấy con số không đầy đủ.
  file: `skills/acceptance/SKILL.md:230`
  severity: medium
  Đề xuất: known-limits

- **Preflight S0 không --require tool-kill-rule.md dù S4 khẳng định «preflight S0 lẽ ra đã bắt»**
  Người dùng thấy gì: Nếu máy đang dùng bản engine cũ chưa có luật mới về lệnh bị ngắt, hệ thống không báo ngay từ đầu mà để người dùng làm gần xong việc rồi mới báo lỗi và yêu cầu cài lại — gây mất công và mất thời gian oan.
  file: `feature-loop/skills/feature-loop/SKILL.md:78`
  severity: medium
  Đề xuất: new-contract

- **Khuôn hồ sơ lượt-bị-ngắt (run-log + verdict BLOCKED + reason) chép ở ba nơi ngoài khối marker**
  Người dùng thấy gì: Cách ghi nhận sự cố 'lệnh bị ngắt' được mô tả lặp lại ở ba nơi tài liệu khác nhau thay vì một nguồn duy nhất. Nếu một nơi được cập nhật mà nơi khác quên cập nhật theo, người dùng có thể nhận được hướng dẫn không khớp nhau mà không có cảnh báo nào.
  file: `skills/acceptance/references/tool-kill-rule.md:26`
  severity: low
  Đề xuất: known-limits

- **Preflight S0 không require tool-kill-rule.md — lỗi version-skew acceptance-gate cũ chỉ bị bắt ở S4, sau khi đã làm xong S1–S3**
  Người dùng thấy gì: Giống vấn đề trên: bước kiểm tra đầu vào ban đầu không phát hiện việc máy đang dùng bản cũ, khiến lỗi chỉ lộ ra sau khi người dùng đã làm gần hết các bước trước đó, gây mất công làm lại.
  file: `feature-loop/skills/feature-loop/SKILL.md:78`
  severity: medium
  Đề xuất: new-contract

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).

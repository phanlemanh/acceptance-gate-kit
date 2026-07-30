## Trong hợp đồng

(none — không finding nào trong scope-triage được map vào một AC cụ thể của contract này)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **New consumer config key `feature_loop.ui_standards_skill` is absent from GUIDE.md's config-key table**
  Người dùng thấy gì: Người dùng cấu hình `_acceptance/config.yaml` sẽ không biết cách bật quy tắc bắt buộc nạp skill chuẩn thiết kế cho tính năng UI, vì tài liệu hướng dẫn cấu hình chưa liệt kê tuỳ chọn này — quy tắc mới có thể không bao giờ được ai bật lên trong thực tế.
  file: `GUIDE.md`
  severity: medium
  Đề xuất: Known limits — bổ sung một dòng vào bảng section 5.2 của GUIDE.md (và mirror `plugins/acceptance-gate/GUIDE.md` qua sync) ghi tên key `feature_loop.ui_standards_skill`, ý nghĩa (tên skill chuẩn thiết kế của repo tiêu thụ, bắt buộc nạp ở S1 cho feature UI), và cột "Khi thiếu" (cảnh báo vàng một dòng ở gói Gate 1, không chặn) — dọn ở lượt sửa tài liệu kế tiếp, không chặn release này.

- **Bare "ledger" in newly written SKILL.md text violates the CONTEXT.md glossary (_Avoid_: "ledger" trần trong văn bản mới)**
  Người dùng thấy gì: Tài liệu hướng dẫn dùng từ tiếng Anh 'ledger' không nhất quán ở vài chỗ thay vì thuật ngữ tiếng Việt chuẩn đã thống nhất, có thể khiến người đọc tài liệu hơi bối rối nhưng không ảnh hưởng cách tính năng hoạt động.
  file: `feature-loop/skills/feature-loop/SKILL.md`
  severity: low
  Đề xuất: Known limits — thay các chỗ "ledger" trần mới thêm (SKILL.md dòng 50, `_acceptance/pha3-goi-luoi/contract.md` AC-10, `evals.yaml` E10) bằng "sổ quyết định" theo glossary CONTEXT.md — dọn ở lượt sửa văn bản kế tiếp, không chặn release này.

- **Tham chiếu dangling tới 'câu hỏi lane' đã bị xoá — chỉ dẫn S1 tự mâu thuẫn**
  Người dùng thấy gì: Khi bắt tay một tính năng có giao diện mới, hướng dẫn nội bộ cho trợ lý AI có thể tự mâu thuẫn nhau — một chỗ nhắc hỏi lại câu hỏi cũ đã không còn được định nghĩa ở đâu, chỗ khác lại bảo luôn phải tự động chạy bước thiết kế trực quan mới — có thể khiến bước duyệt thiết kế trước khi trình lên bị hỏi thêm một câu thừa hoặc bị làm sai cách trước khi tới cổng duyệt.
  file: `feature-loop/skills/feature-loop/SKILL.md`
  severity: medium
  Đề xuất: Known limits — quét toàn file các tham chiếu còn lại tới "câu hỏi lane" (dòng 45, 88, 95) và cập nhật đồng bộ với Nghi thức S1-D mới, hoặc định nghĩa rõ "câu hỏi lane (xem bảng)" trỏ về đâu — xử lý ở lượt sửa tài liệu kế tiếp, ngoài phạm vi đã duyệt của feature này (out-of-scope hiện tại chỉ khai tử ceremony CT1/CT2, không dọn tham chiếu dangling).

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
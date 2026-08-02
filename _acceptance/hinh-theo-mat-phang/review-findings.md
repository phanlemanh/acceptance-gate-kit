# Review Findings: hinh-theo-mat-phang (round 1)

## Trong hợp đồng

Không có finding nào map được vào một AC cụ thể của hợp đồng này (danh sách rỗng).

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Từ mới `mặt phẳng` / `nhìn-thấy-hình` không vào HFL-GLOSSARY-TERMS lẫn CONTEXT.md — vi phạm chính luật N6 file này đặt ra, và P96 xanh rỗng**
  Người dùng thấy gì: Hai thuật ngữ mới trong bản luật (mặt phẳng, nhìn-thấy-hình) chưa được đăng ký vào từ điển thuật ngữ chung của bộ công cụ. Người đọc tài liệu sau này có thể gặp từ lạ không có lời giải thích, và phép kiểm tra tự động hiện không phát hiện được việc thiếu đăng ký này.
  file: `skills/acceptance/references/human-facing-language.md:125`
  severity: medium
  Đề xuất: known-limits

- **"Danh sách đóng các cơ chế vẽ" là seam LLM-viết→máy-đọc nhưng không có marker; P97 rút bằng tìm-chuỗi-toàn-file và P93 không đếm nó**
  Người dùng thấy gì: Danh sách các cách vẽ hợp lệ nằm cạnh bảng tra không có điểm neo rõ ràng trong tài liệu. Nếu sau này có ai dán thêm một bản sao danh sách này ở chỗ khác trong tài liệu, công cụ kiểm tra tự động có thể đọc nhầm bản sao sai mà không báo lỗi.
  file: `skills/acceptance/references/human-facing-language.md:78`
  severity: medium
  Đề xuất: known-limits

- **P97 closed-mechanism list is extracted by an unanchored greedy regex — reproduced false-green on the AC-1/gap-probe-P0 tooth**
  Người dùng thấy gì: Phép kiểm tra tự động xác minh bảng tra dùng đúng cách vẽ hợp lệ có thể bị đánh lừa nếu có nội dung dư thừa chèn gần danh sách hợp lệ. Một thay đổi sai (ví dụ đổi cách vẽ mặc định thành một chỉ dẫn chung chung, mất tính cụ thể) có nguy cơ vẫn được báo là đạt thay vì báo lỗi.
  file: `tests/plugins/run-tests.sh:2623`
  severity: medium
  Đề xuất: known-limits

- **New load-bearing terms (mặt phẳng, phép thử nhìn-thấy-hình, bảng tra) never registered in the glossary; P96 cannot detect the omission**
  Người dùng thấy gì: Các thuật ngữ mới (mặt phẳng, phép thử nhìn-thấy-hình, bảng tra) chưa có mục giải thích trong từ điển thuật ngữ chung của bộ công cụ. Phép kiểm tra tự động không thể phát hiện thiếu sót này vì nó chỉ kiểm những từ đã được đăng ký từ trước.
  file: `skills/acceptance/references/human-facing-language.md:125`
  severity: low
  Đề xuất: known-limits

- **P88 test name reports version floor 1.27/1.19 while the assertions require 1.29/1.21**
  Người dùng thấy gì: Tên hiển thị của một phép kiểm tra phiên bản trong báo cáo kết quả vẫn ghi mốc phiên bản cũ, thấp hơn mốc thực sự đang được yêu cầu bên trong. Người đọc báo cáo có thể hiểu nhầm ngưỡng phiên bản tối thiểu đang áp dụng.
  file: `tests/plugins/run-tests.sh:1983`
  severity: low
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

none

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).

# Review findings — glob-thoat-ngoac (round 2)

## Trong hợp đồng

- **Hình dạng 3 (assert «chuỗi có mặt» khi lời hứa là QUAN HỆ): khứ hồi «mục đọc ra BẰNG chuỗi gốc» của AC-4 không được so trực tiếp**
  AC: AC-4
  file: `tests/scripts/glob-thoat-ngoac.test.mjs:162`
  severity: medium
  source: measurement
  detail: AC-4 (contract) và E4.expected (evals.yaml dòng 47-48) hứa một QUAN HỆ BẰNG NHAU: «bộ đọc thật của carry-plan trả mục BẰNG chuỗi gốc» (`apps/app/app/(app)/[[]slug]/contacts/**`). phanMangSang (dòng 155-164) không so `paths` đã đọc với chuỗi đã viết ở chỗ nào cả. Nó chỉ kiểm hai thứ ở hạ nguồn: chuỗi lý do bắt đầu bằng `'diff-fix chạm ' + TEP_THAT` (GT4, dòng 162) và lý do mang sang (GT4b, dòng 163). Hai assert đó chỉ chứng minh hai điều: bộ đọc trả được một mục không rỗng, và mục ấy khớp `apps/app/app/(app)/[slug]/contacts/x.tsx`. Chúng không chứng minh mục ấy bằng chuỗi gốc. Ví dụ, một bộ đọc giải luôn thành ngữ thành `apps/app/app/(app)/[slug]/contacts/**` vẫn qua cả GT4 lẫn GT4b, vì `[slug]` trần khớp tệp có ngoặc theo nghĩa đen (hàng 4 của bảng KY). Đột biến GT5e chỉ bắt được dạng hỏng «cắt mất paths» (ghim 'thiếu paths'), không bắt được dạng «đọc ra chuỗi khác mà vẫn khớp». Hướng sửa (không tự làm): rút mục đã đọc bằng chính bộ đọc mà carry-plan dùng, tức `parseFlowValue` của lib trên đúng dòng `paths:` trong evalsText, rồi assert deepEqual với mảng gốc. Khi đó lời khai «khứ hồi» mới có phép đo đứng sau.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **The third copy of globToRe, in acceptance-verify.js, was not updated, so the S4 writer and reader now disagree on [[]/[]]**
  Người dùng thấy gì: Khi một tiêu chí khai thư mục có ngoặc vuông theo kiểu thoát, bước tổng hợp kết quả vẫn hiểu sai thư mục đó đối với các tệp nằm ngoài phần đã sửa. Hậu quả là đôi khi hệ thống báo thừa là có phát hiện nằm ngoài vùng phủ và bắt người phải xem thêm một lượt ở cổng bằng chứng.
  file: `feature-loop/workflows/acceptance-verify.js`
  severity: medium
  Đề xuất: new-contract
- **Third glob translator in acceptance-verify.js still reads [[]/[]] literally, so writer and reader now drift on eval.paths coverage and the out-of-substance exemption**
  Người dùng thấy gì: Với thư mục có ngoặc vuông kiểu thoát, phần tổng hợp kết quả không nhận ra tệp thuộc thư mục đó. Nhờ vậy có thể báo thừa 'ngoài vùng phủ' và làm người quyết phải xem thêm một lượt không cần thiết.
  file: `feature-loop/workflows/acceptance-verify.js`
  severity: medium
  Đề xuất: new-contract
- **An idiom item that points at a directory is rejected (dang-khai-la), while the equivalent bare [slug] directory is accepted, so the false touched mark survives for that form**
  Người dùng thấy gì: Nếu một ô khai thư mục có ngoặc vuông kiểu thoát mà không kèm dấu sao ở cuối, hệ thống vẫn coi khai báo đó là không hợp lệ và có thể gắn nhầm là ô có vật đổi. Khai thư mục theo cách thường hoặc thêm dấu sao thì không bị.
  file: `lib/evidence-core.cjs`
  severity: low
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 2/4 lỗi rơi vào file không bộ đo nào phủ (feature-loop/workflows/acceptance-verify.js) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.

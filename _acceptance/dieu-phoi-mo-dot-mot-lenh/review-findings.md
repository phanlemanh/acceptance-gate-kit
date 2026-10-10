# Review findings: dieu-phoi-mo-dot-mot-lenh (round 1)

## Trong hợp đồng

- **trangThaiQuyet đọc `decision:` bằng regex vượt qua dòng mới nên xếp ô đang chờ thành «đã quyết khác build»**
  file: `dieu-phoi/scripts/the.mjs:20`
  severity: high
  AC: AC-9
  source: conventions
  detail: `/^decision:\s*([^#\s]*)/m` dùng `\s*`, mà `\s*` ăn luôn cả `\n`. Ô cơ hội viết `decision:` để trống, không có chú thích (kiểu trong fixture run-tests.sh, và 3 tệp `_acceptance/*/opportunity.md` thật của kho này) sẽ bắt sang dòng kế. Đã chạy thử: frontmatter `stage: discovery\ndecision:\ndecided_by:\n` trả `{tt:'khong-build', decision:'decided_by:'}`. Hệ quả là thẻ khởi tạo đẩy hàng sang `canh_bao` với lý do «ô đã quyết «decided_by:», không vào đợt», bỏ nó khỏi `hoi`/`cho_cong_dang`, và hàng lặng lẽ rơi khỏi đợt. Ngoài ra `decision: "build"` có nháy cũng thành khong-build. Các bộ đọc của kit (`frontmatterField` mà start-scan, product-map, lo-trinh dùng) đọc theo từng dòng. Bộ đọc mới lệch khỏi pattern có sẵn, và ca DP2-09 không bắt được vì fixture dựng từ khuôn có chú thích `# build | …` sau `decision:`.

- **trangThaiQuyet: a bare `decision:` line picks up the next line's key, so the open ô is wrongly treated as already decided**
  file: `dieu-phoi/scripts/the.mjs:20`
  severity: high
  AC: AC-9
  source: bugs
  detail: The regex `/^decision:\s*([^#\s]*)/m` lets `\s*` match the newline. When the frontmatter has `decision:` with no value and no comment on that line (the shape of 3 opportunity.md files in this repo, e.g. _acceptance/thuoc-khong-lat-verdict/opportunity.md), the capture is the next line's key. Verified: for 'decision:\ndecided_by:\n' it returns "decided_by:". trangThaiQuyet then returns {tt:'khong-build', decision:'decided_by:'}. theKhoiTao drops that row from cho_cong_dang and `hoi` (no `build:<slug>` question is asked) and puts it under canh_bao with the text «ô đã quyết «decided_by:», không vào đợt». An ô waiting at Cổng Đáng is reported as decided and dropped from the đợt with no error. Fix: use `[ \t]*` instead of `\s*`, or match only within the line.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **mo-dot ghi `decision: build` mà không ghi `stage: decided`; trangThaiQuyet bỏ qua stage, lệch luật của mọi bộ đọc kit**
  Người dùng thấy gì: Sau khi người gõ «build» cho một hạng mục trong lúc mở đợt, màn hình khởi động thông thường và trang lộ trình có thể vẫn hiện hạng mục đó là «đang chờ quyết» và mời quyết lại, dù đợt đã coi nó là đã quyết.
  file: `dieu-phoi/commands/mo-dot.md`
  severity: high
  Đề xuất: known-limits

- **CONTEXT.md xếp `dieu_phoi.goi_dot` vào «Ổ cắm» trái với chính định nghĩa của term**
  Người dùng thấy gì: Từ điển của bộ công cụ mô tả hơi mâu thuẫn về việc thiếu khai báo gói đợt thì được bỏ qua hay bị dừng, nên người đọc từ điển có thể hiểu sai hành vi khi viết tài liệu sau này.
  file: `CONTEXT.md`
  severity: medium
  Đề xuất: known-limits

- **README của gói dieu-phoi còn quy trình mở đợt sáu bước tay, giờ sai ở kho có gói đợt**
  Người dùng thấy gì: Ai làm theo hướng dẫn cũ trong README để mở đợt ở kho có gói đợt sẽ thấy đợt có vẻ đang chạy nhưng không phiên nào được cấp việc, không có báo lỗi nào; nên dùng lệnh mở đợt mới thay vì làm theo README.
  file: `dieu-phoi/README.md`
  severity: medium
  Đề xuất: known-limits

- **mo-dot dead-ends: `mo` without a gói already opens a hand-built đợt, and rerunning `mo` (even with `--goi`) returns daMo and never reads the gói**
  Người dùng thấy gì: Nếu người mở đợt khi chưa khai báo gói đợt rồi mới khai, đợt vẫn bị kẹt ở dạng dựng tay và không tự nhận gói; muốn dùng gói phải bỏ đợt đó và làm lại theo cách khác, trong khi hướng dẫn trên màn hình chỉ cách làm lại không thành.
  file: `dieu-phoi/scripts/dieu-phoi.mjs`
  severity: medium
  Đề xuất: new-contract

- **Reopening a hand-built đợt with the same name after dong-dot leaves it permanently in `dang-dong`**
  Người dùng thấy gì: Mở lại một đợt dựng tay trùng tên với đợt vừa đóng sẽ cho ra đợt không bao giờ cấp việc cho thợ nữa mà không báo lỗi; phải đặt tên đợt mới để tránh.
  file: `dieu-phoi/scripts/dieu-phoi.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 2 + 1 — DP2-12 dựng trang-thai.json bằng TAY và không đọc bang.html mà bên viết thật phát ra**
  Người dùng thấy gì: Bài kiểm tra việc màn hình xem nhanh và bảng đợt hiển thị giống nhau dùng dữ liệu dựng tay, nên nếu bộ phát lịch đổi cách ghi dữ liệu hoặc bảng thật thiếu một cột thì bài kiểm tra vẫn báo xanh.
  file: `tests/dieu-phoi/mo-dot.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 — DP2-12 chỉ assert «chuỗi có mặt» cho khoá/hàng chờ, nên chiều xanh không phân biệt được**
  Người dùng thấy gì: Bài kiểm tra việc hai màn hình hiện đúng ai đang giữ tài nguyên và ai đang chờ chỉ kiểm tên có xuất hiện đâu đó, nên có thể không phát hiện nếu màn hình hiện sai người giữ.
  file: `tests/dieu-phoi/mo-dot.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 — DP2-08 round-trip hứa ĐẲNG THỨC tập (ma, slug) nhưng chỉ kiểm bao hàm một chiều**
  Người dùng thấy gì: Bài kiểm tra so khớp danh sách hạng mục lấy từ lộ trình chỉ bắt được trường hợp thiếu, không bắt trường hợp thừa hoặc nhân đôi hạng mục, nên một hạng mục thừa có thể lọt vào đợt mà không ai biết.
  file: `tests/dieu-phoi/mo-dot.test.mjs`
  severity: low
  Đề xuất: wont-fix

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).

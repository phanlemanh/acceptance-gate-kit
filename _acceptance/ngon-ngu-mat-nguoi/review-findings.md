## Trong hợp đồng

(Không có finding nào ánh xạ được vào AC trong round 4 — bốn lỗ đo trong-hợp-đồng mà round 3 nêu trên AC-1/AC-3/AC-8/AC-10 đã được đóng; xem `## Iterations` của evidence-report.md round này.)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **P88 release-intent guard chưa nâng cho bản 1.28.0/1.20.0 — revert nguyên đợt bump vẫn XANH (RED-probe đã chạy)**
  Người dùng thấy gì: Nếu bản phát hành này chẳng may bị revert nhầm, hệ thống kiểm tra tự động hiện tại sẽ không phát hiện ra — người dùng có thể quay lại phiên bản cũ mà không hề được cảnh báo là luật ngôn ngữ mặt người đã bị rút lại.
  file: `/Users/manhphan/dev/acceptance-gate-kit/.claude/worktrees/adoring-rubin-5bf1c9/tests/plugins/run-tests.sh`
  severity: high
  Đề xuất: known-limits

- **feature-loop 1.20.0 phụ thuộc CỨNG acceptance-gate ≥1.28.0 ngay giữa vòng lặp (S2) — không khai ở preflight S0, không có nhánh thất bại**
  Người dùng thấy gì: Nếu người dùng chưa cập nhật đồng bộ cả hai gói liên quan, bước trình kế hoạch của vòng lặp tính năng có thể dừng đột ngột giữa chừng mà không có lời giải thích, hoặc quay lại hiển thị kế hoạch bằng ngôn ngữ khó hiểu như trước khi có luật này.
  file: `/Users/manhphan/dev/acceptance-gate-kit/.claude/worktrees/adoring-rubin-5bf1c9/feature-loop/skills/feature-loop/SKILL.md`
  severity: high
  Đề xuất: known-limits

- **Nhánh đang bị chính cổng của kit chặn merge: verdict=REJECT chưa ký, và 11 slug khác vừa bị đẩy thành evidence-stale**
  Người dùng thấy gì: Nhánh này chưa được người có thẩm quyền ký duyệt lần cuối, và một số tính năng khác đã từng được duyệt trước đây nay cần được xác nhận lại bằng chứng trước khi gộp — nếu không, các tính năng đó sẽ tạm thời bị coi là chưa được công nhận.
  file: `/Users/manhphan/dev/acceptance-gate-kit/.claude/worktrees/adoring-rubin-5bf1c9/_acceptance/ngon-ngu-mat-nguoi/evidence-report.md`
  severity: high
  Đề xuất: known-limits

- **Đường dự phòng của acceptance-card giải plugin bằng --require KHÔNG chứa file luật — có thể trả về bản không mang luật, và không có nhánh thất bại**
  Người dùng thấy gì: Trong một số tình huống cài đặt hiếm gặp (bộ nhớ đệm plugin chưa đồng bộ đầy đủ), thẻ quyết định có thể hiển thị bình thường nhưng thực chất không áp dụng luật ngôn ngữ mặt người, mà không có cảnh báo nào cho người xem thẻ.
  file: `/Users/manhphan/dev/acceptance-gate-kit/.claude/worktrees/adoring-rubin-5bf1c9/commands/acceptance-card.md`
  severity: medium
  Đề xuất: known-limits

- **Thêm một bên GHI vào decisions.jsonl mà không mang theo schema — seam LLM-viết→máy-đọc không có khuôn một-chỗ, không round-trip, và tiền tố `lỗ-kit` chưa có bên đọc nào**
  Người dùng thấy gì: Khi người duyệt chọn trả lại tại cổng vì lý do ngôn ngữ mặt người, mục ghi vào sổ quyết định có thể thiếu thông tin cần thiết (thời điểm, mã định danh, mức ảnh hưởng), khiến các công cụ theo dõi quyết định về sau có thể bỏ sót ghi nhận đó.
  file: `/Users/manhphan/dev/acceptance-gate-kit/.claude/worktrees/adoring-rubin-5bf1c9/commands/acceptance-card.md`
  severity: medium
  Đề xuất: known-limits

- **docs/specs/workflow-v2-spec.md lệch quy ước đặt tên của thư mục và có con trỏ chết trong dòng SUPERSEDES**
  Người dùng thấy gì: Tài liệu gốc ghi lại quyết định về luật này được đặt tên khác kiểu với các tài liệu cùng loại khác, và có một dòng ghi chú trỏ tới một tài liệu trước đó không còn tồn tại — có thể gây nhầm lẫn cho người tra cứu lại lịch sử quyết định sau này.
  file: `/Users/manhphan/dev/acceptance-gate-kit/.claude/worktrees/adoring-rubin-5bf1c9/docs/specs/workflow-v2-spec.md`
  severity: low
  Đề xuất: known-limits

- **feature-loop 1.20.0 adds a hard dependency on acceptance-gate ≥1.28.0 at S2, but the preflight require-list and the declared floor were not updated and there is no failure branch**
  Người dùng thấy gì: Nếu người dùng chưa cập nhật đồng bộ cả hai gói liên quan, bước trình kế hoạch của vòng lặp tính năng có thể dừng đột ngột giữa chừng mà không có lời giải thích, hoặc quay lại hiển thị kế hoạch bằng ngôn ngữ khó hiểu như trước khi có luật này.
  file: `feature-loop/skills/feature-loop/SKILL.md`
  severity: high
  Đề xuất: known-limits

- **acceptance-card's stated fallback resolves acceptance-gate with the wrong --require, so it can return a version root that lacks the rules file**
  Người dùng thấy gì: Trong một số tình huống cài đặt hiếm gặp, thẻ quyết định có thể hiển thị bình thường nhưng thực chất không áp dụng luật ngôn ngữ mặt người, mà không có cảnh báo nào cho người xem thẻ.
  file: `commands/acceptance-card.md`
  severity: medium
  Đề xuất: known-limits

- **P88 release-intent guard was not bumped for this release — reverting the 1.28.0 / 1.20.0 version bump leaves the suite green**
  Người dùng thấy gì: Nếu bản phát hành này chẳng may bị revert nhầm, hệ thống kiểm tra tự động hiện tại sẽ không phát hiện ra — người dùng có thể quay lại phiên bản cũ mà không hề được cảnh báo là luật ngôn ngữ mặt người đã bị rút lại.
  file: `tests/plugins/run-tests.sh`
  severity: medium
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

(Không có finding nào với `unverified=true` trong round 4.)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
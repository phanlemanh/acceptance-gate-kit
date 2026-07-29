# Review Findings: cross-feature-claim-index (round 3)

## Trong hợp đồng

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Foreign payload swept into feature commits: discovery-gate0 docs + CLAUDE.md invariants committed under unrelated claim-scan messages**
  Người dùng thấy gì: Một số commit đã gộp tài liệu của một tính năng khác vào cùng commit của tính năng claim-scan, khiến lịch sử commit không còn khớp với mô tả — làm giảm độ tin cậy của việc tra lại lịch sử thay đổi sau này.
  file: `CLAUDE.md`
  severity: medium
  Đề xuất: new-contract

- **claim-scan drops claims with missing/malformed id silently — fail-silent allowlist contradicts the file's own skip-loud pattern**
  Người dùng thấy gì: Nếu một mục bài học trong sổ ghi chép có mã trích dẫn bị gõ sai định dạng, hệ thống sẽ âm thầm loại bỏ mục đó mà không báo cho ai biết — bài học đó biến mất khỏi kho tổng hợp mà không để lại dấu vết.
  file: `feature-loop/scripts/claim-scan.mjs`
  severity: medium
  Đề xuất: known-limits

- **probeClaims `## Findings` regex captures to EOF — any later table is parsed into phantom findings with fake citable ids**
  Người dùng thấy gì: Nếu một báo cáo có thêm một bảng dữ liệu khác nằm ngay sau phần phát hiện chính, hệ thống có thể tự tạo ra các phát hiện không có thật kèm mã trích dẫn trông như hợp lệ, khiến người xét duyệt nhận thông tin sai.
  file: `feature-loop/scripts/claim-scan.mjs`
  severity: medium
  Đề xuất: known-limits

- **feature-loop plugin.json bumped to 1.18.0 without a 'v1.18 adds ...' description entry, breaking the v1.12→v1.17 changelog-in-description pattern**
  Người dùng thấy gì: Số phiên bản của gói tính năng đã tăng nhưng phần mô tả đi kèm chưa được cập nhật để nêu cái mới — người xem thông tin phiên bản sẽ không biết bản này thêm gì.
  file: `feature-loop/.claude-plugin/plugin.json`
  severity: low
  Đề xuất: known-limits

- **probeClaims parses mọi dòng '|' sau '## Findings' đến EOF — bảng phụ sinh claim ma với id #F sai, im lặng exit 0**
  Người dùng thấy gì: Nếu một báo cáo có thêm một bảng tóm tắt khác nằm sau phần phát hiện chính, hệ thống có thể tự sinh ra các phát hiện giả kèm mã trích dẫn trông như thật, làm người xét duyệt tin nhầm vào thông tin không có thật.
  file: `/Users/manhphan/dev/acceptance-gate-kit/feature-loop/scripts/claim-scan.mjs`
  severity: high
  Đề xuất: known-limits

- **Ledger entry type fix/descope nhưng id thiếu/sai khuôn bị ID_RE filter nuốt im lặng — không warn, trái nguyên tắc skip-loud của chính feature**
  Người dùng thấy gì: Nếu một mục bài học trong sổ ghi chép có mã trích dẫn bị thiếu hoặc sai định dạng, hệ thống sẽ âm thầm bỏ nó ra khỏi kết quả tổng hợp mà không cảnh báo — bài học đó mất đi vĩnh viễn mà không ai biết để sửa.
  file: `/Users/manhphan/dev/acceptance-gate-kit/feature-loop/scripts/claim-scan.mjs`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).

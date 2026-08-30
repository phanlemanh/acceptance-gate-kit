## Trong hợp đồng

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Evidence PASS ghim vào cây KHÔNG chứa vật được đo — plugin.json đổi sau verified_commit trong cùng PR**
  Người dùng thấy gì: Báo cáo nghiệm thu tuyên đạt trong khi phần nội dung liên quan đã đổi sau đó mà chưa được chấm lại — người ký có thể tin nhầm rằng bản sắp phát hành đã được kiểm tra trọn vẹn.
  file: `_acceptance/release-2-5-0/evidence-report.md`
  severity: high
  Đề xuất: known-limits

- **Timestamp viết tay ở TƯƠNG LAI so với commit ghi nó, và mâu thuẫn với run-log — trong chính release ship suite-run-log-provenance**
  Người dùng thấy gì: Thời điểm ghi trong báo cáo nghiệm thu không khớp thời điểm máy thật sự chạy, khiến người đọc khó đối chiếu lại chính xác sau này nếu cần.
  file: `_acceptance/release-2-5-0/evidence-report.md`
  severity: high
  Đề xuất: known-limits

- **Máy tự sửa finding ngoài-hợp-đồng trong khi hồ sơ tuyên «máy không tự sửa» — record tự mâu thuẫn tại HEAD**
  Người dùng thấy gì: Hồ sơ nói sẽ để người quyết định trước, nhưng thực tế phần đó đã được sửa sẵn — người ký có thể nhận thông tin không khớp hiện trạng thật.
  file: `_acceptance/release-2-5-0/review-findings.md`
  severity: medium
  Đề xuất: known-limits

- **T2 veto-mở tại HEAD không có bằng chứng sạch lẫn chữ ký — cổng pre-merge của chính kit chặn diff này (đã tự khai)**
  Người dùng thấy gì: Bản ghi phát hành hiện chưa có chữ ký duyệt cuối cùng, nên chưa thể coi là đã được chấp thuận để gộp.
  file: `_acceptance/release-2-5-0/contract.md`
  severity: low
  Đề xuất: known-limits

- **verified_at timestamps contradict run-log provenance for the same run_ids**
  Người dùng thấy gì: Thời điểm ghi trong báo cáo nghiệm thu không khớp bản ghi máy thật, khiến việc đối chiếu lại sau này có hai con số khác nhau cho cùng một lượt chấm.
  file: `_acceptance/release-2-5-0/evidence-report.md`
  severity: medium
  Đề xuất: known-limits

- **review-findings lists the same defect twice, and both entries are already fixed**
  Người dùng thấy gì: Danh sách việc chờ người quyết định đang ghi một lỗi thành hai mục, và lỗi đó thực ra đã được sửa xong — người ký có thể quyết định trên thông tin đã cũ.
  file: `_acceptance/release-2-5-0/review-findings.md`
  severity: medium
  Đề xuất: known-limits

- **Kit's own pre-merge gate blocks this diff (declared, not silent)**
  Người dùng thấy gì: Cổng kiểm tra tự động trước khi gộp đang chặn bản này vì thiếu chữ ký duyệt — cần có quyết định phát hành trước khi gộp được.
  file: `_acceptance/release-2-5-0/contract.md`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
# Review Findings: release-2-12-0 (round 8)

## Trong hợp đồng

Không có finding trong-hợp-đồng ở vòng này.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Bằng chứng tại HEAD là của cây TRƯỚC HEAD — commit cuối sửa vật được đo, răng E1 và evals.yaml SAU verify; pre-merge của kit tự chặn merge (stale evidence)**
  Người dùng thấy gì: Hồ sơ xác nhận đã kiểm tra kỹ có thể đang mô tả một phiên bản CŨ hơn bản sắp phát hành thật, nên người xem hồ sơ có thể tin nhầm là mọi thứ đã được kiểm tra trong khi bản cuối cùng chưa được kiểm tra lại.
  file: `_acceptance/release-2-12-0/evidence-report.md`
  severity: high
  Đề xuất: known-limits

- **Evidence-report PASS ghim bản răng và cây KHÔNG phải HEAD — pre-merge-check tại HEAD báo VIOLATION stale, merge bị chặn**
  Người dùng thấy gì: Kết quả kiểm tra ghi là ĐẠT có thể không lặp lại được nếu chạy lại trên bản sắp phát hành thật, nên lời xác nhận ĐẠT hiện tại chưa chắc còn đúng lúc phát hành.
  file: `_acceptance/release-2-12-0/evidence-report.md`
  severity: high
  Đề xuất: known-limits

- **Evidence-report để trống «Known limits» và «Ngoài hợp đồng» trong khi review-findings.md cùng hồ sơ mang 8 finding ngoài hợp đồng — hai bên đọc cổng kết luận ngược nhau**
  Người dùng thấy gì: Người ký duyệt có thể thấy thông báo "không có gì cần xem thêm" trong khi thực chất còn 8 mục cần cân nhắc, dễ dẫn tới việc bấm duyệt mà bỏ sót thông tin quan trọng.
  file: `_acceptance/release-2-12-0/evidence-report.md`
  severity: medium
  Đề xuất: known-limits

- **review-findings.md tại HEAD mô tả trạng thái của cây 00af886e, không phải HEAD — một finding trong-hợp-đồng đã sửa vẫn treo, hash răng ghi sai**
  Người dùng thấy gì: Người xem hồ sơ có thể đọc thấy một vấn đề còn đang mở dù thực tế đã được xử lý xong, gây nhầm lẫn không cần thiết khi ra quyết định.
  file: `_acceptance/release-2-12-0/review-findings.md`
  severity: low
  Đề xuất: known-limits

- **Đối chứng dương không gắn vào vật đo (biến thể hình 4 — đối chứng có nhưng canh token khác): chốt pathspec ở dòng 124 và phép đo ở dòng 128 dùng hai literal `diagram-design/` tách rời**
  Người dùng thấy gì: Bài kiểm tra bảo vệ việc bộ sơ đồ không đổi hiện đang hoạt động đúng, nhưng nếu sau này ai đó vô tình gõ sai một ký tự trong bài kiểm tra, lỗi đó có thể không bị phát hiện — không ảnh hưởng gì tới bản phát hành lần này.
  file: `_acceptance/release-2-12-0/rang-moc.sh`
  severity: medium
  Đề xuất: known-limits

- **Fixture/khuôn seam viết→đọc chép tay (hình 2): rang-p200.sh đọc đầu ra suite bằng ba literal gõ lại từ `pass()`/`fail()`/dòng ONLY_BLOCK của run-tests.sh, không có marker một-nguồn hay round-trip**
  Người dùng thấy gì: Cơ chế kiểm tra số phiên bản hiện đang hoạt động đúng, nhưng nếu cách suite kiểm thử báo kết quả thay đổi trong tương lai, việc kiểm tra số phiên bản có thể ngừng hoạt động một cách âm thầm mà không ai nhận ra ngay.
  file: `_acceptance/release-2-12-0/rang-p200.sh`
  severity: low
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 4/6 lỗi rơi vào file không bộ đo nào phủ (_acceptance/release-2-12-0/evidence-report.md, _acceptance/release-2-12-0/review-findings.md) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.

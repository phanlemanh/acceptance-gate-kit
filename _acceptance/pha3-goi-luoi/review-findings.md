# Review Findings: pha3-goi-luoi (round 3)

## Trong hợp đồng

(không có finding nào ánh xạ được vào AC trong vòng này)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Gói evidence tại HEAD trễ 1 round so với code — S4 round 3 chưa chạy sau fix f929ceb**
  Người dùng thấy gì: Bộ bằng chứng đang dùng để xét duyệt hiện ghi nhận một phiên bản code cũ hơn bản mới nhất vừa được sửa; nếu ký duyệt ngay bây giờ, người duyệt có thể dựa trên thông tin chưa phản ánh các sửa đổi gần nhất.
  file: `_acceptance/pha3-goi-luoi/evidence-report.md`
  severity: low
  Đề xuất: known-limits

- **P86/P87 negative controls are tautologies — the 'đối chứng âm' can never fail**
  Người dùng thấy gì: Một số bài kiểm tra giả lập lỗi trong bộ test hiện không thực sự phát hiện được khi phần liên quan bị xoá nhầm — nếu lỗi đó xảy ra trong tương lai, hệ thống kiểm tra vẫn báo 'qua' thay vì báo lỗi, khiến người xem báo cáo có thể tin nhầm mức an toàn của kết quả.
  file: `tests/plugins/run-tests.sh`
  severity: medium
  Đề xuất: known-limits

- **E10 negative-control claim in evals.yaml is not implemented by P87**
  Người dùng thấy gì: Tài liệu mô tả bằng chứng ghi rằng một vài phép kiểm có đối chứng âm hoặc dùng đúng công cụ như dự định, nhưng thực tế không khớp hoàn toàn — người đọc báo cáo bằng chứng có thể hiểu nhầm mức độ chắc chắn của một vài kết quả kiểm tra.
  file: `_acceptance/pha3-goi-luoi/evals.yaml`
  severity: low
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

(không có)

⚠ Cụm ngoài vùng phủ: 2/3 lỗi rơi vào file không bộ đo nào phủ (_acceptance/pha3-goi-luoi/evidence-report.md, _acceptance/pha3-goi-luoi/evals.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
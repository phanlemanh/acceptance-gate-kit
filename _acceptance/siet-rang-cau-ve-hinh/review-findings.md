# Review Findings: siet-rang-cau-ve-hinh (round 2)

## Trong hợp đồng

(không có finding nào map được vào AC round này)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Chạm rang.sh của hồ sơ đã ký hinh-tai-cong-1 kéo nó vào phạm vi stale → pre-merge-check VIOLATION trên PR này**
  Người dùng thấy gì: Việc gộp nhánh có thể bị chặn ở cổng vì thay đổi này chạm vào hồ sơ tính năng trước đã được ký duyệt, khiến hồ sơ đó bị coi là lỗi thời và cần được ký lại trước khi gộp.
  file: `_acceptance/hinh-tai-cong-1/rang.sh`
  severity: high
  Đề xuất: known-limits

- **Evidence report ghim verified_commit 7ed4220 nhưng commit a77b973 (cùng gói r1) đổi tests/plugins/* sau mốc đó → stale theo chính luật kit**
  Người dùng thấy gì: Báo cáo bằng chứng của tính năng này được chốt tại một mốc mã nguồn cũ hơn so với thay đổi thực tế sau đó, nên người đọc báo cáo để ký duyệt có thể không thấy đúng phiên bản mã cuối cùng.
  file: `_acceptance/siet-rang-cau-ve-hinh/evidence-report.md`
  severity: medium
  Đề xuất: known-limits

- **E7 hứa đột biến «chèn '_acceptance/' vào bản sao khối P198 → ĐỎ» nhưng không code nào thực hiện; assert `not in me` là âm-tính-một-mình chưa từng phá thử**
  Người dùng thấy gì: Một phép kiểm trong bộ đánh giá hứa sẽ phát hiện một dạng lỗi cụ thể nhưng chưa từng được thử nghiệm để chứng minh nó thật sự phát hiện được, nên người duyệt có thể tin nhầm là đã được bảo vệ trong khi điều đó chưa được kiểm chứng.
  file: `_acceptance/siet-rang-cau-ve-hinh/evals.yaml`
  severity: medium
  Đề xuất: known-limits

- **Bản sao suite ghi vào cây nguồn tests/plugins/_rang-siet-copy.sh — không gitignore, lệch mẫu tar-copy sang tmp của các rang.sh khác**
  Người dùng thấy gì: Khi quá trình đo bị ngắt giữa chừng, nó có thể để lại tệp thừa ngay trong mã nguồn của sản phẩm, làm bẩn dần cây mã theo thời gian.
  file: `_acceptance/siet-rang-cau-ve-hinh/rang.sh`
  severity: low
  Đề xuất: known-limits

- **hfl_clause anchor đếm nhầm khi 4 chữ đầu/cuối của clause xuất hiện trong văn xuôi khác**
  Người dùng thấy gì: Trong một số trường hợp hiếm, khi có một câu văn khác tình cờ trùng đoạn mở đầu hoặc kết thúc của một quy tắc, công cụ có thể báo nhầm là quy tắc bị chép sai dù thực chất không có lỗi, khiến người đọc mất thời gian tìm sai hướng.
  file: `tests/plugins/hfl_clause.py`
  severity: low
  Đề xuất: known-limits

- **P198 tạo thư mục tạm bằng mkdtemp nhưng không dọn**
  Người dùng thấy gì: Mỗi lần chạy phép đo này để lại một thư mục tạm không được dọn dẹp trên máy, tích tụ dần theo thời gian nhưng không làm sai lệch kết quả kiểm tra.
  file: `tests/plugins/run-tests.sh`
  severity: low
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

(không có — không có finding nào cờ unverified=true round này)

⚠ Cụm ngoài vùng phủ: 2/6 lỗi rơi vào file không bộ đo nào phủ (_acceptance/siet-rang-cau-ve-hinh/evidence-report.md, _acceptance/siet-rang-cau-ve-hinh/evals.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.

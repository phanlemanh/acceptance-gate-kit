# Review Findings: hinh-tai-cong-1 (round 2)

## Trong hợp đồng

- **P197 «đối chứng P90-kiểu» chỉ lặp lại assertion đã có, không chạy check của P90**
  file: `tests/plugins/run-tests.sh:10021`
  severity: low
  AC: AC-8
  Dòng `assert CLAUSE in norm(m_clause), "P90-kieu phai van xanh..."` là bản sao đúng nguyên của assertion ở ngay sau `m_clause` (dòng ~9992). Không có hàm check nào của P90 được gọi trên đột biến; chỉ kiểm CLAUSE (đã norm) còn xuất hiện đâu đó trong file — trong khi P90 so CLAUSE.strip() nguyên văn, không norm. evals.yaml E1 khai «hàm check của P90 chạy trên đột biến 1 phải VẪN XANH» nên phép đo đang khai nhiều hơn thứ nó thật sự đo. Không làm suite xanh giả (m_clause vẫn đúng), nhưng là chỗ eval và test lệch nhau. Đã chạy `bash _acceptance/hinh-tai-cong-1/rang.sh` → OK, 18 đột biến, 12 thông điệp; không tìm thấy lỗi nuốt/fallback ẩn nào khác trong rang.sh (set -uo pipefail, mọi nhánh grep rỗng đều rơi vào kêu) hay trong khối P197/P90 sửa.
  (source: bugs)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Gói bằng chứng r1 commit cùng lượt với fix nhưng chưa từng chạy răng mới — evidence-report/run-log chứng nhận cây CŨ (c772fe3) với executor cũ, trong khi evals.yaml HEAD đã đổi E1–E8 sang rang_hinh_cong1**
  Người dùng thấy gì: Báo cáo minh chứng đang ghi kết quả ĐẠT cho tính năng, nhưng thực chất được tạo ra từ một lần kiểm tra cũ, chạy trước khi các thay đổi mới nhất của tính năng tồn tại. Nếu người quyết duyệt dựa trên báo cáo này, họ đang duyệt một phiên bản chưa từng được kiểm tra thật.
  file: `_acceptance/hinh-tai-cong-1/evidence-report.md`
  severity: high
  Đề xuất: new-contract

- **Hình dạng 3 — assert «chuỗi có mặt» trong khi lời hứa là quan hệ «MỌI bản chép khớp khuôn một-nguồn» (P90 m3/m4 bị nới để qua)**
  Người dùng thấy gì: Khi cùng một đoạn hướng dẫn tồn tại ở hai chỗ trong tài liệu, công cụ kiểm tra hiện chỉ chắc chắn ít nhất một bản đúng khuôn. Nếu sau này ai đó chỉnh sai riêng một bản mà không đụng bản kia, sự sai lệch đó có thể không bị phát hiện.
  file: `tests/plugins/run-tests.sh`
  severity: high
  Đề xuất: known-limits

- **Hình dạng 5 — nhánh check khai trong P197/E6 nhưng không có đột biến nào chứng minh chiều đỏ («MỘT lần», «0 điểm vượt», «thieu nhan buoc», «thieu khoi»)**
  Người dùng thấy gì: Một số cảnh báo lỗi mà hệ thống hứa sẽ bật lên khi thiếu bước hay thiếu nhãn chưa từng được thử để chắc chắn chúng thực sự kích hoạt đúng lúc — nên chưa có gì đảm bảo các cảnh báo đó sẽ xuất hiện khi cần.
  file: `tests/plugins/run-tests.sh`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
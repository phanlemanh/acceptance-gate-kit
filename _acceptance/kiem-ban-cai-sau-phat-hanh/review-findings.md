# Review findings: kiem-ban-cai-sau-phat-hanh (round 2)

## Trong hợp đồng

(không có)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **KB-11 checks only the shared failure banner, not the cause, so the new input checks are never tested**
  Người dùng thấy gì: Khi kiểm bản cài gặp đầu vào hỏng, công cụ vẫn dừng đúng và báo «không chạy được». Nhưng bộ kiểm hiện chỉ xác nhận có báo dừng, chưa xác nhận báo đúng lý do. Nếu ai đó lỡ gỡ phần báo lý do cụ thể, người dùng vẫn thấy dừng đúng nhưng lý do chung chung hơn và bộ kiểm không phát hiện.
  file: `tests/scripts/kiem-ban-cai.ca.mjs`
  severity: medium
  Đề xuất: known-limits

- **KB-10 and KB-11 fail cases do not wait for a passing control run, unlike the file's other fail cases**
  Người dùng thấy gì: Một vài ca kiểm lỗi chưa kèm lần chạy đối chứng trên bản lành, nên nếu môi trường kiểm hỏng thì ca đó vẫn có thể báo «đúng như dự kiến». Hậu quả: có thể có một số ít lần bộ kiểm xanh mà chưa thực sự chứng minh được điều nó định chứng minh.
  file: `tests/scripts/kiem-ban-cai.ca.mjs`
  severity: low
  Đề xuất: known-limits

- **Install registry in an unexpected format is reported as a red install (exit 1) instead of «cannot run» (exit 2)**
  Người dùng thấy gì: Nếu phần mềm Claude một ngày đổi cách ghi danh sách gói đã cài, máy nhận có thể bị báo nhầm là «chưa cài bản kit nào, hãy cài lại» thay vì «không kiểm được». Người cắt mốc có thể cài lại không cần thiết, nhưng không có bản sai nào bị phát tới kho thật.
  file: `scripts/kiem-ban-cai.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (kết luận âm tính chỉ dựa trên một kết quả, không ghim thông điệp): ba ca KB-11 chỉ ghim dòng TỔNG KẾT chung, không ghim nguyên nhân mà AC-11 hứa**
  Người dùng thấy gì: Bộ kiểm cho ba tình huống đầu vào hỏng chỉ xác nhận công cụ báo «không chạy được», không xác nhận lý do được nêu là lý do thật. Một ca có thể xanh vì một nguyên nhân khác hẳn (ví dụ máy thiếu lệnh claude), khiến người đọc kết quả tin nhầm rằng tình huống đầu vào hỏng đã được kiểm.
  file: `tests/scripts/kiem-ban-cai.ca.mjs`
  severity: medium
  Đề xuất: known-limits

- **Some failures outside the KhongChay path crash with exit 1 and no TỔNG KẾT line, so 'could not run' is read as ĐỎ (r1 · tệp đã đổi)**
  Người dùng thấy gì: Nếu lệnh liệt kê plugin của Claude in thêm cảnh báo hoặc đổi dạng đầu ra, bước kiểm bản cài sẽ báo lỗi như thể bản cài hỏng, thay vì nói «không chạy được». Lượt cắt mốc có thể đỏ oan và người cắt mốc phải tự phân biệt.
  file: `scripts/kiem-ban-cai.mjs`
  severity: medium
  Đề xuất: known-limits

- **Header comment in evals.yaml says kiem_ban_cai is in suite_keys; config and KB-9 say the opposite (r1 · tệp đã đổi)**
  Người dùng thấy gì: Một dòng ghi chú trong hồ sơ nói sai khoá nào chặn lượt cắt mốc. Hành vi thật vẫn đúng, chỉ là người đọc ghi chú có thể hiểu nhầm.
  file: `_acceptance/kiem-ban-cai-sau-phat-hanh/evals.yaml`
  severity: low
  Đề xuất: known-limits

- **--may reports «TỔNG KẾT: ĐẠT» and exits 0 when no record matches the ref's version (vacuous pass) (r1 · tệp đã đổi)**
  Người dùng thấy gì: Trên máy nhận, nếu bản mới không hề được cài mà máy vẫn giữ bản cũ, phép kiểm vẫn báo ĐẠT. Người cắt mốc có thể tưởng bản mới đã tới nơi trong khi chưa.
  file: `scripts/kiem-ban-cai.mjs`
  severity: high
  Đề xuất: new-contract

- **KB-1 cannot detect --may calling the CLI: the snapshot ignores .in_use files and the --may run's result is never checked (r1 · tệp đã đổi)**
  Người dùng thấy gì: Bài thử «không đụng vào cấu hình Claude thật» có một kẽ hở nhỏ: nếu về sau lệnh chế độ máy thật lại gọi CLI làm mới các tệp đánh dấu phiên, bài thử vẫn xanh. Cấu hình thật vẫn không bị sửa nội dung.
  file: `tests/scripts/kiem-ban-cai.ca.mjs`
  severity: medium
  Đề xuất: known-limits

- **Errors outside KhongChay make the command exit 1 (= ĐỎ) with no TỔNG KẾT line, not 2 (r1 · tệp đã đổi)**
  Người dùng thấy gì: Khi gặp lỗi bất ngờ, lệnh kiểm kết thúc như một lần ĐỎ và không in dòng tổng kết. Người đọc dễ nhầm lỗi công cụ thành lỗi bản cài.
  file: `scripts/kiem-ban-cai.mjs`
  severity: low
  Đề xuất: known-limits

- **tac-tu-cham passes vacuously when no grading-agent name is found in the workflow (r1 · tệp đã đổi)**
  Người dùng thấy gì: Nếu bản cài đổi cách khai tên tác tử chấm, mục kiểm tác tử chấm có thể báo ĐẠT mà thực ra không kiểm gì. Đây là mục quan trọng nhất của vòng này nên người ký cần biết giới hạn đó.
  file: `scripts/kiem-ban-cai.mjs`
  severity: low
  Đề xuất: known-limits

- **Decision card OOS-3 says the check runs on every grading round, contradicting AC-9 (milestone round only) (r1 · tệp đã đổi)**
  Người dùng thấy gì: Thẻ trình người ký nói kiểm bản cài chạy ở mọi lượt chấm, trong khi thực tế chỉ chạy trọn ở lượt cắt mốc. Người ký có thể hiểu sai chi phí và thời điểm chạy.
  file: `_acceptance/kiem-ban-cai-sau-phat-hanh/card-plain.json`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 5 (ma trận thiếu, chỉ điểm-case) kèm hình dạng 3: mục so-phien-ban của chế độ kho giả lập không có ca đỏ nào, và phép kiểm nội dung dòng của nó lặp lại chính nguồn số của lệnh (r1 · tệp đã đổi)**
  Người dùng thấy gì: Bộ thử chưa chứng minh được mục «đúng số phiên bản» có thể chuyển sang đỏ khi số cài khác số của bản cần phát. Nếu mục này hỏng, bộ thử vẫn xanh.
  file: `tests/scripts/kiem-ban-cai.ca.mjs`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).

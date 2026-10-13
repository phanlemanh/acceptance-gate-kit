# Review findings — kiem-ban-cai-sau-phat-hanh (round 1)

## Trong hợp đồng

Không có finding nào map được vào AC.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Some failures outside the KhongChay path crash with exit 1 and no TỔNG KẾT line, so 'could not run' is read as ĐỎ**
  Người dùng thấy gì: Nếu lệnh liệt kê plugin của Claude in thêm cảnh báo hoặc đổi dạng đầu ra, bước kiểm bản cài sẽ báo lỗi như thể bản cài hỏng, thay vì nói «không chạy được». Lượt cắt mốc có thể đỏ oan và người cắt mốc phải tự phân biệt.
  file: `scripts/kiem-ban-cai.mjs`
  severity: medium
  Đề xuất: known-limits

- **Header comment in evals.yaml says kiem_ban_cai is in suite_keys; config and KB-9 say the opposite**
  Người dùng thấy gì: Một dòng ghi chú trong hồ sơ nói sai khoá nào chặn lượt cắt mốc. Hành vi thật vẫn đúng, chỉ là người đọc ghi chú có thể hiểu nhầm.
  file: `_acceptance/kiem-ban-cai-sau-phat-hanh/evals.yaml`
  severity: low
  Đề xuất: known-limits

- **--may reports «TỔNG KẾT: ĐẠT» and exits 0 when no record matches the ref's version (vacuous pass)**
  Người dùng thấy gì: Trên máy nhận, nếu bản mới không hề được cài mà máy vẫn giữ bản cũ, phép kiểm vẫn báo ĐẠT. Người cắt mốc có thể tưởng bản mới đã tới nơi trong khi chưa.
  file: `scripts/kiem-ban-cai.mjs`
  severity: high
  Đề xuất: new-contract

- **KB-1 cannot detect --may calling the CLI: the snapshot ignores .in_use files and the --may run's result is never checked**
  Người dùng thấy gì: Bài thử «không đụng vào cấu hình Claude thật» có một kẽ hở nhỏ: nếu về sau lệnh chế độ máy thật lại gọi CLI làm mới các tệp đánh dấu phiên, bài thử vẫn xanh. Cấu hình thật vẫn không bị sửa nội dung.
  file: `tests/scripts/kiem-ban-cai.ca.mjs`
  severity: medium
  Đề xuất: known-limits

- **Errors outside KhongChay make the command exit 1 (= ĐỎ) with no TỔNG KẾT line, not 2**
  Người dùng thấy gì: Khi gặp lỗi bất ngờ, lệnh kiểm kết thúc như một lần ĐỎ và không in dòng tổng kết. Người đọc dễ nhầm lỗi công cụ thành lỗi bản cài.
  file: `scripts/kiem-ban-cai.mjs`
  severity: low
  Đề xuất: known-limits

- **tac-tu-cham passes vacuously when no grading-agent name is found in the workflow**
  Người dùng thấy gì: Nếu bản cài đổi cách khai tên tác tử chấm, mục kiểm tác tử chấm có thể báo ĐẠT mà thực ra không kiểm gì. Đây là mục quan trọng nhất của vòng này nên người ký cần biết giới hạn đó.
  file: `scripts/kiem-ban-cai.mjs`
  severity: low
  Đề xuất: known-limits

- **Decision card OOS-3 says the check runs on every grading round, contradicting AC-9 (milestone round only)**
  Người dùng thấy gì: Thẻ trình người ký nói kiểm bản cài chạy ở mọi lượt chấm, trong khi thực tế chỉ chạy trọn ở lượt cắt mốc. Người ký có thể hiểu sai chi phí và thời điểm chạy.
  file: `_acceptance/kiem-ban-cai-sau-phat-hanh/card-plain.json`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 5 (ma trận thiếu, chỉ điểm-case) kèm hình dạng 3: mục so-phien-ban của chế độ kho giả lập không có ca đỏ nào, và phép kiểm nội dung dòng của nó lặp lại chính nguồn số của lệnh**
  Người dùng thấy gì: Bộ thử chưa chứng minh được mục «đúng số phiên bản» có thể chuyển sang đỏ khi số cài khác số của bản cần phát. Nếu mục này hỏng, bộ thử vẫn xanh.
  file: `tests/scripts/kiem-ban-cai.ca.mjs`
  severity: medium
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 2/8 lỗi rơi vào file không bộ đo nào phủ (_acceptance/kiem-ban-cai-sau-phat-hanh/evals.yaml, _acceptance/kiem-ban-cai-sau-phat-hanh/card-plain.json) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.

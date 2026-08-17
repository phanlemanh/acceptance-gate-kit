# Review Findings: siet-rang-cau-ve-hinh (round 3)

## Trong hợp đồng

- **Evidence report r2 ghim verified_commit a77b973 nhưng cc01212 (cùng gói r2) đổi tests/plugins/run-tests.sh + rang.sh sau mốc — lặp lại đúng lỗi round 1 mà chính báo cáo đã khai**
  file: `_acceptance/siet-rang-cau-ve-hinh/evidence-report.md:9`
  severity: high
  source: conventions
  AC: AC-8
  detail: Báo cáo (mục Iterations, dòng 116-117) tuyên «Round 2: re-verify tại a77b973 (cây sạch)», nhưng commit cc01212 — commit đưa chính báo cáo r2 này lên — cũng đổi tests/plugins/run-tests.sh (export RUN_TESTS_SELF, P198 atexit) và _acceptance/siet-rang-cau-ve-hinh/rang.sh (thêm đột biến AC-7). `git diff --stat a77b973..HEAD -- tests/` = run-tests.sh 7+/3-. Bằng chứng: output E1..E8 trong report vẫn là chuỗi CŨ «P198 6 ca · rang cu 2 chieu do» (rang.sh HEAD in «P198 6 ca + tu-canh»), verified_at 08:42:00Z trong khi run-log.jsonl r2 ghi ts 15:11:43Z — tức các khối evidence là bản chép của lần chạy trước đột biến E7, không phải cây đang merge. Theo luật stale của kit (scripts/pre-merge-check.sh stale_files) hồ sơ này sẽ VIOLATION ngay khi approved_by được điền (hiện bị che vì luật làn V `continue` trước). Đây là lớp «đo trước khi vật đủ hình» (memory) và vi phạm 'Bằng chứng không tự dối': PASS không mô tả cây HEAD. Cần re-verify tại HEAD (hoặc commit code trước rồi verify) — không tự sửa.
  rationale: AC-8 đòi 'When chạy tại HEAD, Then suite XANH' — nếu các khối bằng chứng là bản chép của lần chạy trước khi code (run-tests.sh, rang.sh) bị đổi ở cc01212, thì AC-8 chưa thật sự được xác nhận tại HEAD như hợp đồng yêu cầu.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Hồ sơ đã ký hinh-tai-cong-1 bị stale (pre-merge-check VIOLATION thật) vì diff chạm rang.sh + tests/plugins/* của nó — decision d-…4201 khai «phải re-pin» nhưng chưa làm**
  Người dùng thấy gì: Việc gộp thay đổi này có thể khiến một tính năng khác (hinh-tai-cong-1) bị chặn merge vì hồ sơ chấp thuận của nó cần được ký lại — đây là việc riêng của tính năng đó, cần người quyết định ký lại trước khi gộp chung.
  file: `_acceptance/hinh-tai-cong-1/rang.sh`
  severity: medium
  Đề xuất: known-limits

- **rang.sh ghi bản sao suite vào cây nguồn tests/plugins/_rang-siet-copy.sh thay vì mktemp — lệch nếp các rang.sh khác, không gitignore**
  Người dùng thấy gì: Nếu quá trình kiểm thử bị ngắt giữa chừng (ví dụ bị dừng đột ngột), có thể để sót một tệp thừa trong thư mục mã nguồn, khiến các lần kiểm sau đó cho kết quả không đáng tin.
  file: `_acceptance/siet-rang-cau-ve-hinh/rang.sh`
  severity: low
  Đề xuất: known-limits

- **Dead code + comment lý luận dở dang trong heredoc đột biến AC-7 (mut gán rồi ghi đè ngay)**
  Người dùng thấy gì: Một đoạn kịch bản kiểm thử còn sót ghi chú nháp và một dòng lệnh không dùng tới — không ảnh hưởng đến kết quả kiểm hiện tại, chỉ gây khó hiểu cho người đọc lại sau này.
  file: `_acceptance/siet-rang-cau-ve-hinh/rang.sh`
  severity: low
  Đề xuất: known-limits

- **hfl_clause neo 4-chữ-đầu/cuối: docstring khai 2 điểm mù xanh-giả nhưng không khai chiều đỏ-giả khi head/tail xuất hiện trong văn xuôi khác**
  Người dùng thấy gì: Trong một số trường hợp hiếm, nếu tài liệu khác chứa tình cờ đúng vài chữ đầu hoặc cuối của đoạn văn cần kiểm, công cụ có thể báo lỗi giả dù nội dung thực tế vẫn đúng, và người sửa tài liệu sau này chưa được cảnh báo trước về khả năng đó.
  file: `tests/plugins/hfl_clause.py`
  severity: low
  Đề xuất: known-limits

- **Chân «phân biệt diffBase» của răng hồ sơ đo trên mốc sai (8d1e135), không phải diffBase thật của nhánh (7d76384) — xanh vì lý do không liên quan đến thay đổi của hồ sơ**
  Người dùng thấy gì: Mốc dùng để kiểm tra "phép đo này có thật sự phát hiện được lỗi mới hay không" đang trỏ nhầm vị trí, nên phép tự-kiểm này có thể báo xanh ngay cả khi phần đo mới bị hỏng ngay từ đầu — cần người quyết định có sửa lại mốc hay chấp nhận giới hạn này.
  file: `_acceptance/siet-rang-cau-ve-hinh/rang.sh`
  severity: medium
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

(không có — không có finding nào cờ unverified=true round này)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).

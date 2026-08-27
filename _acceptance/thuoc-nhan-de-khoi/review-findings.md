## Trong hợp đồng

- **Single-quoted attributes are invisible to the parser — transparent rect becomes a false OCCLUDED at invented coordinates, with no WARN**
  file: `diagram-design/skills/diagram-design/scripts/check_label_occlusion.py:80`
  severity: medium
  AC: AC-1
  detail: ATTR only matches double-quoted attributes (r'...=\s*"([^"]*)"'), so any single-quoted attribute is silently absent from the attrs dict. Two consequences, both in the direction the docstring's DEFAULT DIRECTION contract explicitly forbids: (1) fill='none' is not seen, so line 151 falls back to the default "#000" and the rect is judged fully opaque; (2) x='30' y='10' are not seen, so _num defaults them to 0.0 — exactly the invented-coordinates class the _BAD sentinel (line 94) was added to prevent, but the sentinel only fires for values the regex captured. Verified empirically: an SVG with a label plus <rect x='30' y='10' width="120" height="60" fill='none' stroke="#333"/> produces `OCCLUDED ... khoi [0,0,120,60]` and exit 1 — a false accusation from a fully transparent, non-overlapping rect, with no WARN. Single quotes are valid SVG/HTML and this checker is shipped in the plugin for consumer-authored diagrams; the docstring's blind-spot list does not declare this case. Cheap fix: extend ATTR to match either quote style, or treat elements whose raw attr string contains =' as not-understood (WARN + skip).
  rationale: AC-1 khai rõ: phần tử mang giá trị thuộc tính không hiểu phải VÔ HÌNH CÓ TIẾNG WARN, tuyệt đối không bịa toạ độ và không rơi về TỐ OAN; finding chứng minh thực tế ngược lại — im lặng bịa x=y=0 và đoán fill="#000" rồi báo OCCLUDED sai, đúng hình dạng đỏ vòng 4 được viết để chặn.

- **Assert «chuỗi có mặt» trong khi lời hứa là quan hệ: entry LOCAL-PATCHES phải khai biên đã thu**
  file: `_acceptance/thuoc-nhan-de-khoi/rang.sh:269`
  severity: medium
  AC: AC-7
  detail: E8 (evals.yaml dòng 63) hứa: «LOCAL-PATCHES.md có mục mới khai CẢ BIÊN NHẬN DIỆN ĐÃ THU». Phép đo duy nhất cho lời hứa đó là `grep -q "check_label_occlusion" "$SKILL/LOCAL-PATCHES.md"` — tên script xuất hiện Ở BẤT KỲ ĐÂU trong file là xanh. Một dòng nhắc tên trần, không khai biên (rect đục ≥60×28, bốn dạng che lọt có chủ đích), vẫn thỏa assert. Trong khi cùng chân này, phép đo §9 (dòng 246–268) đã làm đúng mẫu quan-hệ (rút đúng section + khuôn <skill-dir> + hai chiều đỏ), riêng vế LOCAL-PATCHES rơi về có-mặt-chuỗi và không có chiều đỏ nào.
  rationale: AC-7 đòi hỏi đích danh: LOCAL-PATCHES.md phải có entry khai CẢ biên nhận diện đã thu ở AC-1; phép đo hiện tại chỉ grep tên script có mặt ở bất kỳ đâu, nên không thể xác nhận yêu cầu nội dung đó của AC-7 thực sự được thoả.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Evidence-report PASS là bằng-chứng-cũ: 3 vòng fix sau verified_commit đổi chính vật được đo**
  Người dùng thấy gì: Bằng chứng đã duyệt được chốt ở một phiên bản cũ của mã nguồn; ba lượt sửa sau đó đã thay đổi đáng kể cách kiểm tra hoạt động, nên bằng chứng có thể không còn phản ánh đúng phiên bản sắp được đưa vào sản phẩm.
  file: `_acceptance/thuoc-nhan-de-khoi/evidence-report.md`
  severity: high
  Đề xuất: known-limits

- **Section '## Ngoài hợp đồng' rỗng trong evidence-report trong khi review-findings có mục đã phân loại**
  Người dùng thấy gì: Báo cáo bằng chứng bỏ trống mục liệt kê các vấn đề đã xếp ngoài phạm vi, dù danh sách đó đã có sẵn ở nơi khác — người đọc báo cáo có thể hiểu nhầm là không còn vấn đề nào cần lưu ý.
  file: `_acceptance/thuoc-nhan-de-khoi/evidence-report.md`
  severity: medium
  Đề xuất: known-limits

- **Chiều đỏ của chân quét-vùng-ngoài neo cửa sổ git di động (log -40 origin/main)**
  Người dùng thấy gì: Phép tự kiểm nội bộ dùng để dò lịch sử thay đổi có thể báo lỗi hạ tầng giả trong những lần chạy sau này, khi lịch sử của dự án tiến xa hơn — không ảnh hưởng tới tính năng đang bàn giao ở lần này.
  file: `_acceptance/thuoc-nhan-de-khoi/rang.sh`
  severity: medium
  Đề xuất: known-limits

- **Comment ma trận fill sai số ca so với code và evals**
  Người dùng thấy gì: Một ghi chú mô tả số lượng ca kiểm trong kịch bản kiểm tra nội bộ không khớp với số ca thực sự đang chạy — chỉ gây khó hiểu cho người đọc kịch bản sau này, không ảnh hưởng tới kết quả kiểm tra thực tế.
  file: `_acceptance/thuoc-nhan-de-khoi/rang.sh`
  severity: low
  Đề xuất: known-limits

- **Hình sửa 27/08 nhưng colophon vẫn ghi mốc cũ 'origin/main 345f42ee · vẽ 21/08/2026'**
  Người dùng thấy gì: Dòng ghi nguồn ở cuối hai trang hình minh hoạ vẫn trỏ về phiên bản git cũ dù nội dung đã được cập nhật, có thể khiến người muốn đối chiếu tra nhầm mốc.
  file: `docs/reference/figures/kien-truc-ho-so-la-truc.html`
  severity: low
  Đề xuất: known-limits

- **chiều-đỏ in chan_quet_vung_ngoai assert pattern */figures/* nhưng hàm được canh khớp hai vùng — một commit chỉ chạm assets sẽ làm chiều đỏ báo oan "pathspec chết"**
  Người dùng thấy gì: Phép tự kiểm nội bộ cho một nhánh quét có thể báo nhầm là hỏng hạ tầng trong tương lai dù đường quét vẫn hoạt động bình thường — không ảnh hưởng kết quả của lần bàn giao này.
  file: `_acceptance/thuoc-nhan-de-khoi/rang.sh`
  severity: low
  Đề xuất: known-limits

- **Assertion âm-tính-một-mình: vế pathspec assets không bao giờ có đối chứng dương**
  Người dùng thấy gì: Một trong hai vùng được quét bởi phép tự kiểm nội bộ chưa từng được chứng minh là thực sự bắt được thay đổi — nếu phần đó âm thầm hỏng, phép kiểm vẫn báo xanh mà không ai biết.
  file: `_acceptance/thuoc-nhan-de-khoi/rang.sh`
  severity: medium
  Đề xuất: known-limits

- **Chiều đỏ hình thức: chỉ tự kiểm helper `has` trên chuỗi bịa, không gọi phép kiểm thật**
  Người dùng thấy gì: Hai phép tự kiểm nội bộ dùng để bảo đảm kịch bản kiểm tra bắt lỗi đúng chỉ đang tự kiểm một chuỗi giả định, không thực sự chạy lại điều kiện thật — nên nếu điều kiện đó bị viết sai sau này, phép tự kiểm sẽ không phát hiện ra.
  file: `_acceptance/thuoc-nhan-de-khoi/rang.sh`
  severity: low
  Đề xuất: known-limits

- **Ma trận viết-trước trong file lệch số phần tử với ma trận chạy thật + giữ lời tuyên «đóng kín» đã bị bác**
  Người dùng thấy gì: Một đoạn mô tả trong kịch bản kiểm tra nội bộ liệt kê sai số lượng và vẫn giữ lời khẳng định danh sách đã đóng kín dù điều đó từng bị bác bỏ ở vòng sửa trước — chỉ gây hiểu nhầm khi đọc lại, không ảnh hưởng tới kết quả kiểm tra.
  file: `_acceptance/thuoc-nhan-de-khoi/rang.sh`
  severity: low
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 2/11 lỗi rơi vào file không bộ đo nào phủ (_acceptance/thuoc-nhan-de-khoi/evidence-report.md) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
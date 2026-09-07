## Trong hợp đồng

- **Hình dạng 3 (assert chuỗi có mặt, lời hứa là QUAN HỆ): HS09 mệnh đề (3) chỉ đòi chữ `AGENTS.md`, không ghim ví dụ «`**/*.md` bắt `AGENTS.md`»**
  file: `tests/scripts/run-tests.sh:2120`
  severity: low
  AC: AC-9
  AC-9 hứa hàng GUIDE §8 «có ví dụ `**/*.md` bắt `AGENTS.md`» — một quan hệ glob→file. Assert (3) ở dòng 2120 là `case "$gl09_row" in *'AGENTS.md'*)`: chỉ đòi chuỗi `AGENTS.md` xuất hiện đâu đó trong hàng. Chuỗi `**/*.md` không được kiểm ở assert nào (assert (1) chỉ đòi `**/` đứng cạnh «không-hoặc-nhiều thư mục»). Hàng viết «`AGENTS.md` KHÔNG được bắt», hay xoá `**/*.md` khỏi ví dụ, vẫn xanh. Xác nhận bằng chạy riêng khối HS (28/28 PASS) — ca xanh nhưng không phân biệt được hai hàng tài liệu trái nghĩa nhau. Đã có trong review-findings.md mục «Chưa phân loại»; chưa sửa ở HEAD. Ghim tối thiểu: đòi `**/*.md` rồi `AGENTS.md` theo thứ tự trên cùng hàng.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Evidence report trong diff neo vào commit trước bản sửa fixture — chưa phủ HEAD**
  Người dùng thấy gì: Báo cáo bằng chứng đang trình để ký duyệt được đo ở một thời điểm trước khi bản sửa cuối cùng được áp vào, nên chưa chắc phản ánh đúng trạng thái hiện tại — nên chạy đo lại trước khi coi đây là căn cứ ký.
  file: `_acceptance/glob-hai-sao-khop-goc-kho/evidence-report.md`
  severity: low
  Đề xuất: known-limits

- **Kit có hai bộ khớp glob với hai ngữ nghĩa `*` khác nhau — GUIDE chỉ khai một**
  Người dùng thấy gì: Tài liệu hướng dẫn hiện chỉ giải thích một trong hai cách so khớp mẫu đường dẫn mà công cụ dùng ở hai chỗ khác nhau; người đọc có thể hiểu nhầm quy tắc chỗ này áp cho chỗ kia, dù việc đó không ảnh hưởng gì tới tính năng đang ký lần này.
  file: `feature-loop/workflows/acceptance-verify.js`
  severity: low
  Đề xuất: known-limits

- **Evidence report pinned to pre-fix commit; recorded E10 PASS came from a run whose HS10 injection silently failed**
  Người dùng thấy gì: Kết quả 'đạt' đang ghi trong hồ sơ cho một trong mười phép thử không thực sự chạy đúng kịch bản của nó ở lần đo trước đó; cần đo lại trước khi dùng làm căn cứ ký duyệt, dù bản thân tính năng không có lỗi được xác nhận.
  file: `_acceptance/glob-hai-sao-khop-goc-kho/evidence-report.md`
  severity: low
  Đề xuất: known-limits

- **Ghim «stdout có PASS: HSxx» trong evals không hiện trong bằng chứng — output chỉ giữ 3 dòng cuối, và tiền tố «PASS: HS01» khớp cả «PASS: HS01-nostale»**
  Người dùng thấy gì: Cách ghim kết quả từng phép thử con trong hồ sơ đo hiện chưa đủ chặt để phân biệt một phép thử với các biến thể tên gần giống của nó, nhưng vì cả bộ vẫn báo lỗi khi có bất kỳ phép thử nào trượt, hậu quả thực tế cho người dùng hiện chưa xảy ra.
  file: `_acceptance/glob-hai-sao-khop-goc-kho/evals.yaml`
  severity: low
  Đề xuất: wont-fix

⚠ Cụm ngoài vùng phủ: 4/5 lỗi rơi vào file không bộ đo nào phủ (_acceptance/glob-hai-sao-khop-goc-kho/evidence-report.md, feature-loop/workflows/acceptance-verify.js, _acceptance/glob-hai-sao-khop-goc-kho/evals.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.

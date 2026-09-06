# Review Findings: thuoc-khai-mot-dang-do-mot-neo (round 7)

## Trong hợp đồng

(rỗng — không có finding nào được máy ánh xạ vào một AC cụ thể trong vòng này; bước phân loại phạm vi thất bại một phần, xem mục "Chưa phân loại" bên dưới.)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **evidence-report chứng nhận một cây không còn tồn tại (verified_commit lùi 2 commit, output ghi 12 đột biến trong khi mã chạy 14)**
  Người dùng thấy gì: Báo cáo bằng chứng đính kèm để trình duyệt có thể phản ánh một phiên bản mã cũ hơn thực tế đang được gộp, khiến người ký duyệt dựa trên số liệu đã lỗi thời.
  file: `_acceptance/thuoc-khai-mot-dang-do-mot-neo/evidence-report.md`
  severity: high
  Đề xuất: known-limits

- **«Known limits» và «Ngoài hợp đồng» để RỖNG dù hợp đồng khai 3 giới hạn có tên và review-findings ghi 6 mục ngoài hợp đồng (3 HIGH) — đúng hai mục làm cổng bỏ mời ký**
  Người dùng thấy gì: Báo cáo bằng chứng bỏ trống mục giới hạn đã biết và mục ngoài phạm vi dù có nhiều rủi ro nghiêm trọng đã ghi nhận, khiến người duyệt không thấy các cảnh báo quan trọng trước khi ký.
  file: `_acceptance/thuoc-khai-mot-dang-do-mot-neo/evidence-report.md`
  severity: high
  Đề xuất: new-contract

- **Nhánh tự chặn merge của mình: VIOLATION staleness của inputs-tinh-tu-goc-kho, thiếu bước re-pin riêng làn**
  Người dùng thấy gì: Việc gộp bản vá này vào nhánh chính có thể bị hệ thống kiểm tra tự động chặn lại vì một tính năng khác đã ký duyệt trước đó bị đánh dấu lỗi thời, cần thêm một bước xác nhận riêng trước khi hợp nhất.
  file: `_acceptance/inputs-tinh-tu-goc-kho/rang.sh`
  severity: high
  Đề xuất: known-limits

- **s4-args.json đã commit lệch với evals.yaml tại HEAD; bản sinh lại bị bỏ chưa commit trong cây làm việc**
  Người dùng thấy gì: Tệp cấu hình đi kèm bằng chứng đã lưu không khớp với bộ tiêu chí kiểm thử hiện hành, nên hồ sơ minh chứng có thể không phản ánh đúng những gì thực sự được kiểm.
  file: `_acceptance/thuoc-khai-mot-dang-do-mot-neo/s4-args.json`
  severity: medium
  Đề xuất: new-contract

- **Hằng MOC_KY biến itgk_lane_doc_khong_doi thành bẫy vĩnh viễn, ngược nếp «cố ý KHÔNG vào suite vĩnh viễn» của các răng cùng loại**
  Người dùng thấy gì: Thước đo này sẽ tự báo lỗi mỗi khi có thay đổi hợp lệ trong tương lai chạm vào một tệp dùng chung, buộc người sau phải cập nhật mốc thủ công — đây là đánh đổi được chủ đích chấp nhận khi thiết kế.
  file: `_acceptance/inputs-tinh-tu-goc-kho/rang.sh`
  severity: medium
  Đề xuất: wont-fix

- **tkm_bay_chan chép cứng danh sách 7 chan lần thứ hai — sẽ trôi âm thầm khi rang.sh thêm/đổi tên chan**
  Người dùng thấy gì: Danh sách nhóm kiểm tra được chép tay ở hai nơi khác nhau có thể lệch nhau theo thời gian, khiến một số trường hợp không còn được kiểm tra mà không ai nhận ra.
  file: `_acceptance/config.yaml`
  severity: low
  Đề xuất: known-limits

- **P86: phân biệt bản trôi chỉ hoạt động ở cột nhãn — trôi ở dòng ngân sách bị gán nhầm cho QUICKSTART.md**
  Người dùng thấy gì: Khi thông báo lỗi chỉ ra sai tài liệu bị lệch (luôn nêu tên một tệp cố định dù tệp khác mới là nguồn gây lỗi thật), người sửa có thể mất thời gian tìm nhầm chỗ.
  file: `tests/plugins/run-tests.sh`
  severity: medium
  Đề xuất: known-limits

- **Fixture viết tay đúng khuôn bên đọc — hai đột biến «thêm cổng» không round-trip qua khối nguồn tsv**
  Người dùng thấy gì: Hai bài kiểm cho tình huống thêm cổng mới không thực sự chèn văn bản vào tài liệu gốc để thử đường đọc thật, nên nếu khuôn tài liệu đổi, lỗi tương ứng có thể lọt qua mà không bị phát hiện — hạn chế này đã được ghi nhận công khai.
  file: `tests/plugins/run-tests.sh`
  severity: medium
  Đề xuất: known-limits

- **Chuỗi ghim chỉ là tên file, không ghim lớp lỗi mà đột biến phải chứng minh**
  Người dùng thấy gì: Một trong các bài kiểm sẵn có chỉ xác nhận thông báo lỗi có nhắc tên tệp mà không xác nhận đúng loại lỗi, nên trong một số tình huống hiếm nó có thể được coi là đạt dù thực ra đã bắt nhầm loại lỗi.
  file: `tests/plugins/run-tests.sh`
  severity: low
  Đề xuất: wont-fix

## Chưa phân loại (triage-failed)

phân loại phạm vi không chạy được — không lỗi nào bị máy tự sửa, người xem lại toàn bộ.

### P86: phép so QUAN HỆ `luot != len(vis) - 1` không thể chạy từ tài liệu thật — `assert len(ids) == 4` bắn trước
- file: `tests/plugins/run-tests.sh:11050`
- severity: medium
- source: bugs

Phép so quan hệ mới ở 11050 (`if luot != len(vis) - 1`) chỉ đỏ được khi `vis` có độ dài khác 4. Nhưng `vis` sinh từ `cols()` trên khối tsv thật, và ngay ở 11058 có `assert len(ids) == 4, "mo hinh phai co dung 4 cong"` — chốt này đọc `ids` NGOÀI hàm `kiem` và chạy trước mọi đột biến. Nghĩa là với vật thật, `len(vis)` luôn bằng 4 và nhánh 11050 không bao giờ đi tới trạng thái đỏ.

Đã tái hiện: sao GUIDE.md/QUICKSTART.md/README.md ra thư mục tạm, thêm dòng `G-THU5\tCổng Thứ Năm\tFifth Gate` vào khối tsv của GUIDE.md VÀ thêm dòng bảng tương ứng vào cả ba bản render, GIỮ NGUYÊN `≤3 lượt/vòng`, rồi chạy đúng thân python của khối P86 với ROOT trỏ vào thư mục đó:

  AssertionError: mo hinh phai co dung 4 cong, dang 5: ['G-DANG', 'G-PHAMVI', 'G-BANGCHUNG', 'G-GIATRI', 'G-THU5']

Chương trình chết ở 11058, KHÔNG in `ngan sach luot 3 != so cong 5 - 1`.

Đột biến duy nhất «chứng minh» nhánh này — `them cong nhung giu ngan sach` ở 11091 — không tiêm một ký tự nào vào khối tsv; nó chuyền thẳng hai danh sách bịa tay `vis + ["Cổng Thứ Năm"]` / `ens + ["Fifth Gate"]` vào `kiem`, tức đi vòng qua `cols()` lẫn chốt đếm cổng. Hệ quả: chuỗi ghim `ngan sach luot 3 != so cong 5 - 1` chỉ xuất hiện được trên đường fixture, và phép so quan hệ chưa từng được chứng minh chạy end-to-end từ văn bản nguồn.

Gợi ý: bỏ hằng 4 trong `assert len(ids) == 4` (hoặc chuyển nó thành `len(ids) >= 2`) và cho đột biến «thêm cổng» tiêm chữ thật vào khối tsv qua `tiem()` như các ca khác.

⚠ Cụm ngoài vùng phủ: 3/10 lỗi rơi vào file không bộ đo nào phủ (_acceptance/thuoc-khai-mot-dang-do-mot-neo/evidence-report.md, _acceptance/thuoc-khai-mot-dang-do-mot-neo/s4-args.json) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
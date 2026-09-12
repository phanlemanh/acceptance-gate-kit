## Trong hợp đồng

- **Chiều đỏ đã KHAI trong evals.yaml (E5/AC-5) không được thi hành, và lý do miễn nói về một chiều đỏ khác**
  file: `tests/scripts/lan-status-not-run.test.mjs:905`
  severity: low
  AC: AC-5
  Eval E5 (`lsnr_pin_cu`) khai: «Chiều đỏ: bản sao đổi luật thành «tập id phải KHỚP CHÍNH XÁC» → ĐỎ ghim tên hồ sơ cũ bị hoá đỏ» — tức một mũi tiêm vào LUẬT bên đọc, để chứng rằng vế «corpus hiện có không hồ sơ nào hoá đỏ» (L05, các assert `quetMoi.viPham.length` / `tenBase !== tenMoi`) thật sự phân biệt được một bản vá làm hồ sơ cũ hoá đỏ. Mũi tiêm đó không tồn tại: L05 nằm trong `MIEN_MUI_TIEM` (dòng 905) với lý do nói về chiều đỏ NỘI TẠI khác — dựng bộ máy bản base rồi tiêm một pin thiếu id vào BẢN SAO CORPUS. Hai thứ đo hai vật khác nhau: tiêm corpus chứng «bộ quét còn sống», không chứng «assert không-hoá-đỏ sẽ đỏ khi luật đọc siết lại». Hệ quả: vế chống hồi quy của AC-5 (ba thứ ghim trên corpus thật) không có cặp hai chiều nào trên chính luật nó canh, dù hợp đồng và bản khai đều hứa có.
  Rationale: Bản khai eval E5 của chính hợp đồng tự nêu chiều đỏ cho AC-5 ('đổi luật thành khớp chính xác' phải ghim tên hồ sơ cũ hoá đỏ) nhưng chiều đỏ đó không có mũi tiêm nào chứng minh — một chiều đỏ AC-5 đã hứa mà chưa được thi hành.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **L05 chân dương chỉ đếm số vi phạm, không ghim thông điệp — exit 1 (vi phạm) và exit 2 (không chạy được) bị nhập một**
  Người dùng thấy gì: Khi máy tự kiểm tra xem một bản vá có làm hỏng hồ sơ khác hay không, phép kiểm này có thể báo 'phát hiện đúng lỗi' ngay cả khi thực ra công cụ đo bị treo hoặc gặp trục trặc kỹ thuật chứ không phải vì hồ sơ đó thật sự sai.
  file: `tests/scripts/lan-status-not-run.test.mjs:659`
  severity: high
  Đề xuất: known-limits

- **L05 vế 2 đòi 0 vi phạm TUYỆT ĐỐI trên corpus sống — ca vĩnh viễn bị ghép vào độ tươi của 64 hồ sơ không liên quan**
  Người dùng thấy gì: Bài kiểm tra này đòi mọi hồ sơ khác đang có trong kho phải sạch tuyệt đối mới coi là qua, nên nếu một hồ sơ không liên quan gì tới thay đổi đang xét tình cờ bị cũ giữa hai đợt phát hành, việc kiểm tra có thể báo nhầm rằng thay đổi hiện tại có lỗi.
  file: `tests/scripts/lan-status-not-run.test.mjs:733`
  severity: medium
  Đề xuất: known-limits

- **Bản base dựng bằng `sh -c` có ống dẫn, nội suy đường dẫn không nháy, và không kiểm tệp sau khi bung — lệch hẳn tiền lệ cùng kho**
  Người dùng thấy gì: Bước dựng bản đối chứng để so sánh trước/sau có thể âm thầm tạo ra một bản trống hoặc thiếu dữ liệu mà không ai nhận ra, khiến kết quả so sánh trông hợp lệ dù thực chất chưa so sánh được gì.
  file: `tests/scripts/lan-status-not-run.test.mjs:621`
  severity: medium
  Đề xuất: known-limits

- **L08 sinh tiến trình con bằng TÊN TỆP gõ tay thay vì SELF_FILE**
  Người dùng thấy gì: Nếu sau này có người thêm một phép thử giả lập lỗi cho tình huống bộ lọc không khớp ca nào, phép thử đó có thể báo sai nguyên nhân thay vì thật sự kiểm tra được điều cần kiểm tra.
  file: `tests/scripts/lan-status-not-run.test.mjs:845`
  severity: low
  Đề xuất: known-limits

- **L11/L12/L13 không có hàng eval nào trong bản khai — ba răng mới chỉ sống qua glob suite**
  Người dùng thấy gì: Ba bài kiểm tra mới nhất — trong đó có hai bài kiểm tra chính các lỗ hổng vừa được vá — không nằm trong danh sách chính thức của hồ sơ, nên nếu sau này ai đó chỉ chạy theo danh sách chính thức thay vì chạy toàn bộ tệp, các bài kiểm tra này có thể bị bỏ sót mà không ai hay.
  file: `tests/scripts/lan-status-not-run.test.mjs:862`
  severity: low
  Đề xuất: known-limits

- **`status:` kèm chú thích cuối dòng bị bỏ qua LẶNG — ô khai không-chạy vẫn bị thi hành**
  Người dùng thấy gì: Nếu người viết hồ sơ đánh dấu một mục là 'không chạy' và thêm ghi chú giải thích lý do ngay trên cùng dòng, hệ thống có thể lờ đi ghi chú đó và vẫn thực thi đúng mục lẽ ra phải bỏ qua, mà không có cảnh báo nào.
  file: `lib/evidence-core.cjs:384`
  severity: high
  Đề xuất: new-contract

- **Pin mới (thiếu khoá cho ô không-chạy) bị bên đọc < 2.12.0 chấm VI PHẠM — làn chỉ gác đời bộ máy ở `--ag-root`, không gác lớp vendored của cây đang đo**
  Người dùng thấy gì: Nếu một kho tiêu thụ chạy bản vá mới trước khi kịp cập nhật bộ phận đọc phiên bản cũ của chính kho đó, kết quả ghi lại mới có thể bị chính kho đó báo nhầm là vi phạm ngay lập tức dù không có gì sai thật sự.
  file: `feature-loop/scripts/repin-lane.mjs:254`
  severity: medium
  Đề xuất: known-limits

- **Assertion âm-tính-một-mình: chiều đỏ của GL04 chỉ kết luận từ «exit ≠ 2», không ghim thông điệp nào của vật**
  Người dùng thấy gì: Một bài kiểm tra sẵn có dùng để đảm bảo hệ thống dừng lại đúng lúc trước khi ghi dữ liệu đã bị đổi trong lần vá này theo cách khiến nó không còn phân biệt được 'dừng đúng vì lý do đã định' với 'dừng vì trục trặc kỹ thuật ngẫu nhiên' — bài kiểm tra có thể báo qua dù hành vi thật sự đã khác.
  file: `tests/scripts/repin-lane-lop-cu.test.mjs:343`
  severity: medium
  Đề xuất: known-limits

- **Chiều đỏ đã KHAI trong evals.yaml (E9/AC-1) không được thi hành: L08 chỉ có vế âm**
  Người dùng thấy gì: Một tình huống trong đó bộ lọc chọn ca thử không khớp ca nào (ví dụ do gõ sai tên) có thể bị lặng lẽ xem là 'kiểm tra thành công' thay vì báo lỗi rõ ràng — khả năng này chưa được kiểm chứng bằng một phép thử giả lập thật sự.
  file: `tests/scripts/lan-status-not-run.test.mjs:836`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).

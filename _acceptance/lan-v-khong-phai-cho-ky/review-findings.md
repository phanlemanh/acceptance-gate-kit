## Trong hợp đồng

Không có finding nào map được vào AC trong vòng này.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Bản đồ đổi ô ở bước THUẦN MÁY — phá bất biến ghi ngay đầu product-map.mjs, làm CI đỏ trên chính làn V**
  Người dùng thấy gì: Có thể có một khoảng ngắn giữa hai bước tự động của máy khi bảng theo dõi tiến độ báo lỗi kiểm tra dù không ai (người hay máy) vừa làm sai gì — chỉ xảy ra khi chưa tới lúc vẽ lại bảng, tự hết khi bảng được vẽ lại.
  file: `scripts/product-map.mjs:202`
  severity: high
  Đề xuất: known-limits

- **Vị từ dùng chung đặt trong scripts/ thay vì lib/ — đảo ngược tầng, lệch pattern workspace-record.cjs**
  Người dùng thấy gì: Không ảnh hưởng người dùng ngay bây giờ — đây là cách tổ chức mã nguồn nội bộ, có thể làm việc bảo trì về sau tốn công hơn một chút nhưng không đổi hành vi sản phẩm.
  file: `scripts/product-map.mjs:108`
  severity: medium
  Đề xuất: known-limits

- **LV_CASES lọc mà không đếm ca — bảy dòng XANH với 0 assertion khi một ca đổi tên**
  Người dùng thấy gì: Nếu sau này có ai đổi tên một bài kiểm tự động bên trong, hệ thống có thể báo 'mọi bài kiểm đã chạy và ổn' dù thực ra một bài đã âm thầm không chạy — rủi ro một lỗi thật lọt qua mà không ai phát hiện.
  file: `tests/plugins/run-tests.sh:10481`
  severity: medium
  Đề xuất: known-limits

- **Fixture evidence-report.md viết tay theo khuôn bên ĐỌC, trong khi contract.md rút từ khuôn canonical**
  Người dùng thấy gì: Bộ kiểm tự động đang dùng một bản mẫu báo cáo tự soạn tay thay vì lấy từ khuôn chuẩn; nếu định dạng báo cáo thật đổi sau này, bộ kiểm có thể vẫn báo ổn trong khi tính năng thật đã hỏng.
  file: `tests/plugins/lan-v.test.mjs:49`
  severity: low
  Đề xuất: known-limits

- **lanVMo dùng veto_state làm tiêu chí, trong khi luật Cổng 2 ở biên merge là xanh_sach_check (6 điều kiện) — cổng biến mất khỏi cả hai bộ đọc mặt người**
  Người dùng thấy gì: Có một tình huống hiếm — hồ sơ từng bỏ qua một bước kiểm hoặc còn ghi chú rủi ro chưa xử lý — mà màn hình vào phiên làm việc và bảng tiến độ có thể báo 'đã giao xong, không cần ai ký' trong khi việc gộp mã nguồn thật ra vẫn đang bị chặn lại ở một lớp kiểm khác; người dùng có thể không được nhắc đúng lúc cần họ xem lại.
  file: `scripts/product-map.mjs:108`
  severity: high
  Đề xuất: known-limits

- **Ô bản đồ nay đổi ở một bước MÁY (implemented→verified), phá bất biến khai ngay đầu file và làm product-map --check đỏ giữa vòng**
  Người dùng thấy gì: Có thể có một khoảng ngắn giữa hai bước tự động của máy khi bảng theo dõi tiến độ báo lỗi kiểm tra dù không ai vừa làm sai gì — chỉ xảy ra khi chưa tới lúc vẽ lại bảng, tự hết khi bảng được vẽ lại.
  file: `scripts/product-map.mjs:201`
  severity: medium
  Đề xuất: known-limits

- **Hồ sơ làn V đường A mất trọn Cổng Giá trị — không bao giờ tới «Chờ phiên nghiệm thu»**
  Người dùng thấy gì: Với một số tính năng đã được quyết định đưa vào xây dựng qua quy trình đánh giá cơ hội, làn đi-nhanh-không-cần-ký này có thể khiến bước mời người dùng thật đánh giá giá trị thực tế của tính năng (trước khi công bố rộng) bị bỏ qua hoàn toàn.
  file: `scripts/start-scan.mjs:209`
  severity: medium
  Đề xuất: new-contract

- **Bộ lọc LV_CASES không khớp ca nào → exit 0 im lặng (0-ca-thường-trực)**
  Người dùng thấy gì: Nếu sau này có ai đổi tên một bài kiểm tự động bên trong, hệ thống có thể báo 'mọi bài kiểm đã chạy và ổn' dù thực ra một bài đã âm thầm không chạy — rủi ro một lỗi thật lọt qua mà không ai phát hiện.
  file: `tests/plugins/lan-v.test.mjs:24`
  severity: medium
  Đề xuất: known-limits

- **Import TĨNH product-map.mjs biến một phụ thuộc chịu lỗi thành phụ thuộc cứng của toàn bộ /start**
  Người dùng thấy gì: Nếu một tệp phụ trợ bên trong của bảng tiến độ gặp trục trặc, màn hình vào phiên làm việc có thể sập hoàn toàn (không hiển thị gì) thay vì chỉ mất một phần thông tin ít quan trọng.
  file: `scripts/start-scan.mjs:18`
  severity: low
  Đề xuất: known-limits

- **Assertion âm-tính-một-mình — chiều đỏ của `--check` ở chân ban-do không có đối chứng dương trên CÙNG bản sao, và không ghim thông điệp**
  Người dùng thấy gì: Một phép kiểm tự động dùng để xác nhận bảng tiến độ phát hiện đúng lỗi có thể chưa từng thực sự chứng minh nó phân biệt được trường hợp đúng với trường hợp sai — rủi ro lỗi thật lọt qua mà bộ kiểm vẫn báo ổn.
  file: `_acceptance/lan-v-khong-phai-cho-ky/rang.sh:205`
  severity: medium
  Đề xuất: known-limits

- **Assertion âm-tính không ghim đúng thông điệp — E11 khai chiều đỏ bằng alternation và sai số đột biến so với vật**
  Người dùng thấy gì: Tài liệu mô tả cách một phép kiểm tự động hoạt động không khớp với những gì phép kiểm thực sự làm; điều này không ảnh hưởng người dùng cuối nhưng có thể khiến người đọc lại kiểm tra này sau này hiểu nhầm hoặc vô tình làm lỗi cũ quay lại.
  file: `_acceptance/lan-v-khong-phai-cho-ky/evals.yaml:129`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).

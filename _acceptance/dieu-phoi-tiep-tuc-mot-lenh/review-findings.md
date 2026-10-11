# Review findings — dieu-phoi-tiep-tuc-mot-lenh (round 1)

## Trong hợp đồng

- **Hình dạng 1 — đo bên đọc trung gian thay vì ĐẦU RA: DP3-02 round-trip không chạy chan-doan như E2 đã hứa**
  file: `tests/dieu-phoi/tiep-tuc.test.mjs:138`
  severity: medium
  AC: AC-2
  source: measurement
  detail: E2 hứa: «chan-doan thật trên cùng đợt báo dãy P1 có phiên sống (mục day:P1, trường song == "s-p1")». Ca thực tế chỉ gọi `docNhipSong(dot)` rồi so `[phien, day]`. `kho` không được dùng, chỉ có `assert.ok(kho)` để lấp chỗ. Đường đọc của sản phẩm lại khác: keHoachDay khớp nhịp qua `nhipMoiNhatCua` theo `worktree` (không theo trường `day` mà ca so), rồi chan-doan.mjs:92 in mục `day:P1`. Cả tệp test không có assert nào trên trường `song` của đầu ra chan-doan (grep `.song` không ra kết quả nào). DP3-03 chỉ so `hanh_dong`. Vì vậy lời hứa song == "s-p1" ở đầu ra chan-doan không được đo ở đâu: chan-doan có làm rơi hoặc gán sai trường song thì suite vẫn xanh.

- **Hình dạng 3 — lời hứa quan hệ không có assert: DP3-14 không so danh-thuc với chan-doan**
  file: `tests/dieu-phoi/tiep-tuc.test.mjs:213`
  severity: medium
  AC: AC-14
  source: measurement
  detail: E14 hứa «`danh-thuc` trả cùng số việc (một hàm)», tức hai đầu ra phải bằng nhau. DP3-14 viec-cho chỉ chạy `chan-doan --json --phien s-gs` rồi so danh sách viec-cho. Không ca DP3-14 nào gọi `danh-thuc`: lệnh này chỉ xuất hiện ở DP3-09 (dòng 523, 550), và ở đó chỉ đọc `hanh_dong`, không đọc số việc. Nếu danh-thuc đếm việc chờ bằng một đường khác (ví dụ quên lọc theo thuc_luc), không ca nào đỏ.

- **Hình dạng 3 — so chuỗi con thay cho quan hệ «ghi_danh chứa ĐÚNG thư mục đợt» ở DP3-03 hàng (c)**
  file: `tests/dieu-phoi/tiep-tuc.test.mjs:332`
  severity: low
  AC: AC-3
  source: measurement
  detail: E3 hứa lời ghi danh của (c) «chứa thư mục đợt», tức chứa giá trị `dot` tuyệt đối (timThuMucDot trả realpath). Assert lại là `assert.match(c.kh.ghi_danh, /\.acceptance-runs\/dieu-phoi-thu/)`, một chuỗi con cố định mà mọi kho thử đều mang. Lời ghi danh in đường tương đối `.acceptance-runs/dieu-phoi-thu` (phiên chip ở worktree khác sẽ không tìm được đợt) hoặc in thư mục đợt của một kho khác thì vẫn khớp. `hanhDongMaTran` có `dot.dot` trong tay nhưng không trả ra để so `includes(dot)`.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **kiemMoiTruong đọc cấu hình đợt bằng docJson thô, bỏ qua docCauHinh/kiemCauHinh có sẵn, rồi chạy lệnh shell từ nó**
  Người dùng thấy gì: Nếu tệp cấu hình của đợt bị sửa tay sai khuôn hoặc hỏng, lệnh chẩn đoán có thể sập hẳn thay vì báo rõ chỗ sai, và các bước nối lại đợt hay mở đợt gãy theo.
  file: `dieu-phoi/scripts/moi-truong.mjs`
  severity: medium
  Đề xuất: known-limits

- **`nha <tài nguyên>` không kiểm tên với CAC_TAI_NGUYEN: path traversal tới rmSync đệ quy, gỡ được khoá S4 cấp máy**
  Người dùng thấy gì: Một thợ gõ tên tài nguyên lạ khi nhả khoá có thể xoá nhầm khoá của dãy khác hoặc khoá dùng chung của cả máy, và gõ sai tên thì chỉ nhận lời báo thành công giả.
  file: `dieu-phoi/scripts/ghi.mjs`
  severity: medium
  Đề xuất: new-contract

- **danh-thuc đọc tệp nhịp sống bằng docJson thô, không qua bộ đọc một-nguồn của song.mjs**
  Người dùng thấy gì: Nếu một tệp nhịp sống bị hỏng, việc đánh thức giám sát theo lịch 30 phút có thể thất bại và không ai được nhắn, kể cả khi đang có việc chờ.
  file: `dieu-phoi/scripts/danh-thuc.mjs`
  severity: low
  Đề xuất: known-limits

- **Cách chọn slug hàng kế của dãy bị chép hai nơi (ghi.mjs slugKeCua và tiep-tuc.mjs slugKe)**
  Người dùng thấy gì: Hai chỗ chọn việc kế tiếp cho một dãy đang được viết riêng; nếu sau này một chỗ đổi, đơn xin lượt và việc giao cho dãy có thể trỏ hai việc khác nhau.
  file: `dieu-phoi/scripts/ghi.mjs`
  severity: low
  Đề xuất: known-limits

- **keHoachDay mở chip cho dãy đã nghỉ (nghi) hoặc đã xong, và lời ghi danh trỏ một hàng đã gộp**
  Người dùng thấy gì: Khi nối lại đợt, hệ thống có thể mở phiên làm việc mới cho dãy mà bạn đã cho nghỉ, hoặc cho dãy đã làm xong, khiến việc đã gộp bị chạy lại.
  file: `dieu-phoi/scripts/tiep-tuc.mjs`
  severity: high
  Đề xuất: new-contract

- **Nhánh `chua-biet` gần như không bao giờ chạy: chính hook của phiên giám sát tạo thư mục song/ trước khi CLI chạy**
  Người dùng thấy gì: Sau khi nâng gói giữa chừng, các phiên thợ cũ không báo nhịp sống nhưng hệ thống vẫn coi dãy là chưa có phiên và mở thêm phiên mới, dẫn tới hai phiên làm trên cùng một thư mục.
  file: `dieu-phoi/scripts/tiep-tuc.mjs`
  severity: medium
  Đề xuất: new-contract

- **chan-doan trơn nay luôn có mục `day:<id>` «thieu — mở chip», làm bước 7 của mo-dot không bao giờ báo xong và mời mở chip lần hai**
  Người dùng thấy gì: Ngay sau khi mở đợt, bước kiểm tra cuối có thể luôn báo còn việc dở và mời mở lại phiên cho từng dãy, nên không bao giờ báo xong.
  file: `dieu-phoi/scripts/chan-doan.mjs`
  severity: medium
  Đề xuất: new-contract

- **chanDoan nuốt mọi lỗi của keHoachDay: mục `day:*` biến mất im lặng, trong khi tiep-tuc cùng dữ liệu lại ném lỗi**
  Người dùng thấy gì: Khi một tệp trạng thái của đợt bị hỏng, phần chẩn đoán có thể im lặng bỏ qua các dãy và trông như không còn việc nào, trong khi lệnh nối lại lại báo lỗi.
  file: `dieu-phoi/scripts/chan-doan.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 — âm-tính-một-mình đo sai chỗ: DP3-02 thieu-session không bắt được lỗi đi xuyên đường mà nó tiêm vào**
  Người dùng thấy gì: Bài kiểm tra chặn mã phiên bất thường có thể vẫn báo xanh dù bộ lọc hỏng và tệp bị ghi ra ngoài thư mục dự kiến.
  file: `tests/dieu-phoi/tiep-tuc.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 2 — fixture viết tay đúng khuôn bên đọc dù đã có bên viết thật (xin, khoa/chu.json, yeu-cau)**
  Người dùng thấy gì: Các bài kiểm tra ma trận dùng tệp dựng tay, nên nếu khuôn ghi tệp thật đổi mà bài kiểm không đổi theo thì bài vẫn xanh.
  file: `tests/dieu-phoi/tiep-tuc.test.mjs`
  severity: low
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

Không có.

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).

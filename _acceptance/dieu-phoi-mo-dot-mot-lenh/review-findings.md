# Review findings: dieu-phoi-mo-dot-mot-lenh (round 4)

## Trong hợp đồng

Không có.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **dieu-phoi/README.md vẫn tả luồng mở đợt cũ (mo → điền tay → chay) mà không có bước `pha dang-chay`; với đợt mở từ gói, bộ phát lịch không cấp gì**
  Người dùng thấy gì: Hướng dẫn đi kèm gói vẫn chỉ cách mở đợt kiểu cũ. Người làm theo đúng hướng dẫn đó sẽ thấy đợt chạy nhưng không bao giờ được cấp lượt làm việc, vì thiếu bước bật đợt sang trạng thái đang chạy.
  file: `dieu-phoi/README.md`
  severity: medium
  Đề xuất: known-limits

- **`hang nghi` của CLI mới ghi khoá `day[].nghi`, nhưng bộ phát lịch đang chạy từ bản lõi `loi/` cũ coi đó là khoá lạ và ngừng cấp mọi lượt**
  Người dùng thấy gì: Nếu chủ kho nâng gói điều phối giữa lúc một đợt đang chạy rồi cho một dãy nghỉ, đợt sẽ ngừng cấp việc cho tất cả các dãy cho tới khi có người sửa tay hoặc dừng rồi chạy lại đợt.
  file: `dieu-phoi/scripts/hang.mjs`
  severity: medium
  Đề xuất: known-limits

- **Reopening a manual đợt with an old name leaves it stuck in pha dang-dong, which cannot be undone**
  Người dùng thấy gì: Mở lại một đợt làm tay có tên trùng với đợt vừa đóng sẽ khiến đợt kẹt ở trạng thái đang đóng, không cấp việc nào và không bật lại được bằng lệnh. Người dùng phải xoá tay một tệp trạng thái mới tiếp tục được.
  file: `dieu-phoi/scripts/dieu-phoi.mjs`
  severity: medium
  Đề xuất: new-contract

- **`hang them <mã>` with a lộ trình code not in the đợt guesses the slug from the code and drops `ma`**
  Người dùng thấy gì: Khi thêm vào đợt một việc theo mã của lộ trình mà đợt chưa có, việc đó có thể mang tên suy từ chính mã và mất liên kết với lộ trình. Bảng đợt sẽ không xếp nó đúng nhóm kế hoạch và còn có thể bị coi là việc phát sinh.
  file: `dieu-phoi/scripts/hang.mjs`
  severity: medium
  Đề xuất: new-contract

- **`hang-gop` events fire for hàng already signed-off before the đợt opened, inflating the T14 merge count**
  Người dùng thấy gì: Số việc đã giao xong mỗi ngày có thể bị tính dôi trong ngày mở đợt, vì những việc đã hoàn tất từ trước cũng được đếm. Con số dùng để đánh giá đợt vì thế có thể trông tốt hơn thực tế.
  file: `dieu-phoi/scripts/phat-lich.mjs`
  severity: medium
  Đề xuất: known-limits

- **apNguonHang silently drops gói hàng whose mã is outside the nguồn and that have no slug**
  Người dùng thấy gì: Nếu người khai gõ sai mã một việc trong gói, việc đó biến mất khỏi đợt mà lệnh mở vẫn báo thành công. Người dùng chỉ phát hiện khi thấy thiếu việc.
  file: `dieu-phoi/scripts/goi-dot.mjs`
  severity: low
  Đề xuất: known-limits

- **trangThaiQuyet's frontmatter regex is stricter than the kit's reader and treats some decided ô as chờ**
  Người dùng thấy gì: Một hồ sơ cơ hội có định dạng đầu tệp hơi lạ có thể bị coi là chưa quyết dù đã quyết xây, nên thẻ khởi tạo hỏi lại người một việc đã quyết rồi hoặc bỏ sót cảnh báo cho hồ sơ không xây.
  file: `dieu-phoi/scripts/the.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 3 — chỉ kiểm «chuỗi có mặt» trong khi lời hứa là QUAN HỆ: DP2-12 so «giá trị hàng chờ/khoá» trên xem, nhưng chuỗi đó luôn có sẵn nhờ trùng mã dãy**
  Người dùng thấy gì: Bộ kiểm tra việc hiển thị khoá và hàng chờ trên màn xem còn lỏng. Nếu màn xem hiển thị sai dãy đang giữ khoá hoặc bỏ hàng chờ, bộ kiểm có thể vẫn báo xanh.
  file: `tests/dieu-phoi/mo-dot.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 — ghim thông điệp rỗng: DP2-13-do doi-ten ghim chữ «hang-gop», nhưng chữ đó luôn được dán cứng vào mọi thông báo lệch của dem**
  Người dùng thấy gì: Phép thử xác nhận lệnh đếm nhận ra khi tên loại sự kiện bị đổi có thể báo đỏ vì một lý do khác như lệnh đếm hỏng. Nó vẫn bắt được lỗi, nhưng không chứng minh được đúng nguyên nhân.
  file: `tests/dieu-phoi/mo-dot.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 — DP2-08 round-trip chỉ kiểm tập con, trong khi lời hứa là tập BẰNG NHAU**
  Người dùng thấy gì: Bộ kiểm đối chiếu danh sách việc lấy từ lộ trình chỉ chắc chắn không thiếu, chưa chắc chắn không thừa. Nếu bộ đọc trả thêm việc không có thật, bộ kiểm vẫn có thể báo xanh.
  file: `tests/dieu-phoi/mo-dot.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 3 — DP2-09: vế «(e) ô park → không vào đợt» chỉ được đo bằng việc slug có mặt trong canh_bao**
  Người dùng thấy gì: Một việc đã quyết tạm gác vẫn được hiển thị cảnh báo đúng, nhưng chưa có phép thử nào chắc chắn việc đó không bị đưa vào đợt như một việc cần làm.
  file: `tests/dieu-phoi/mo-dot.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 3 — DP2-02 mo-tu-goi: hứa LUAT.md == khuôn + LUAT-rieng (so chuỗi) nhưng chỉ kiểm startsWith/endsWith**
  Người dùng thấy gì: Bộ kiểm tệp luật của đợt chỉ soát phần đầu và phần cuối. Nội dung lạ chèn vào giữa sẽ không bị phát hiện, nhưng chưa có dấu hiệu việc đó xảy ra trong thực tế.
  file: `tests/dieu-phoi/mo-dot.test.mjs`
  severity: low
  Đề xuất: wont-fix

- **hang day-len với mã và --truoc cùng trỏ một hàng: mỗi lần chạy lại vẫn hạ uu_tien và ghi thêm Nhật ký và sự kiện (r3)**
  Người dùng thấy gì: Nếu người dùng gõ lệnh đẩy một việc lên trước chính nó, hệ thống vẫn báo đã đổi và mỗi lần gõ lại thì việc đó bị hạ thêm ưu tiên, nhật ký và sự kiện đợt phình thêm mà không có điểm dừng. Trường hợp này hiếm vì phải gõ nhầm hai mã giống nhau, nhưng người gõ không nhận được cảnh báo nào.
  file: `dieu-phoi/scripts/hang.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (âm tính một mình, không ghim thông điệp): chiều đỏ của «thieu-doi-so-ban-cu» xanh với mọi lỗi mang tên ca, kể cả khi bản tiêm không dựng lại được lỗi gốc (r3)**
  Người dùng thấy gì: Phép kiểm bảo vệ lỗi gõ thiếu đối số có thể báo xanh dù nó không còn tái hiện đúng lỗi gốc. Người dùng không thấy gì khác đi hôm nay, nhưng nếu lỗi đó quay lại sau này thì phép kiểm này có thể không kêu.
  file: `tests/dieu-phoi/mo-dot.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 (tuyên quét lớp nhưng ma trận không lấy từ tập phần tử): `can(day, '--day <dãy>')` của themHang không có ca nào, và nhánh chuỗi rỗng cũng không được đo (r3)**
  Người dùng thấy gì: Lệnh thêm việc mới mà quên khai dãy, và trường hợp khai dãy rỗng, chưa có phép kiểm nào canh. Nếu ai đó vô tình gỡ phần chặn ấy thì người dùng có thể thêm việc vào đợt mà không bị nhắc thiếu thông tin.
  file: `tests/dieu-phoi/mo-dot.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Chẩn đoán của đợt đã mở chỉ một việc không làm được: `mo <tên> --goi` bị `daMo` chặn sớm, `/dieu-phoi:mo-dot` không bao giờ hết mục `thieu` (r2)**
  Người dùng thấy gì: Với một đợt đã mở từ trước mà chưa khai nguồn gói, lệnh mở đợt luôn báo còn thiếu và bảo người dùng làm một việc không thể làm được. Phiên giám sát có thể quay vòng ở bước này mà không bao giờ báo xong.
  file: `dieu-phoi/scripts/chan-doan.mjs`
  severity: medium
  Đề xuất: new-contract

- **`mo-dot.md` bảo giải `$AG` bằng resolve-plugin của feature-loop mà không có đường nào tới bộ giải đó; thiếu `--require` khuôn ô mà mẫu `--mo-o` sẵn có luôn kèm (r2)**
  Người dùng thấy gì: Khi mở đợt, bước mở ô cho hàng chờ duyệt có thể không tìm được công cụ cần dùng, hoặc chọn nhầm một bản cài thiếu tệp. Người dùng sẽ thấy việc mở đợt đứng ở giữa thẻ khởi tạo.
  file: `dieu-phoi/commands/mo-dot.md`
  severity: medium
  Đề xuất: new-contract

- **Thẻ khởi tạo báo hàng park/kill 'không vào đợt' nhưng bộ phát lịch vẫn giao hàng đó (r2)**
  Người dùng thấy gì: Thẻ nói một hàng đã bị dừng hoặc bỏ sẽ không vào đợt, nhưng thợ vẫn có thể được giao đúng hàng đó làm việc. Người duyệt thẻ tin rằng hàng ấy đã bị loại trong khi nó vẫn chạy.
  file: `dieu-phoi/scripts/the.mjs`
  severity: high
  Đề xuất: new-contract

- **`hang them <mã>` nhân bản một hàng đã có ở dãy khác, hai dãy cùng nhận một slug (r2)**
  Người dùng thấy gì: Thêm một hàng đã có sẵn ở dãy khác sẽ khiến hai thợ cùng nhận một việc và làm trùng nhau. Hàng thêm ra cũng bị tính là việc phát sinh thay vì việc của lộ trình.
  file: `dieu-phoi/scripts/hang.mjs`
  severity: medium
  Đề xuất: new-contract

- **Mở lại đợt dựng tay cùng tên sau dong-dot thì kẹt vĩnh viễn ở pha dang-dong (r2)**
  Người dùng thấy gì: Nếu mở lại một đợt dựng tay trùng tên với đợt vừa đóng thì đợt không chạy lại được, và bộ phát lịch chỉ còn cấp việc gộp. Hiện nên đặt tên đợt mới thay vì dùng lại tên cũ.
  file: `dieu-phoi/scripts/dieu-phoi.mjs`
  severity: medium
  Đề xuất: known-limits

- **`dem` bỏ sót yêu cầu `can-nguoi` của thợ gửi chủ kho, đếm thiếu số lần gọi người (r2)**
  Người dùng thấy gì: Số lần gọi chủ kho mà lệnh đếm báo có thể thấp hơn thực tế vì bỏ sót những lần thợ xin việc chỉ người làm được. Con số này nên đọc như mức tối thiểu.
  file: `dieu-phoi/scripts/dem.mjs`
  severity: medium
  Đề xuất: known-limits

- **Cho dãy nghỉ thì hàng đang làm của dãy biến mất khỏi tiep/, xem và bảng đợt (r2)**
  Người dùng thấy gì: Khi cho một dãy nghỉ, bảng đợt hiện dãy đó như đang chờ dù thợ vẫn đang làm dở một hàng. Người xem có thể tưởng dãy rảnh trong khi nó vẫn xin duyệt và gộp.
  file: `dieu-phoi/scripts/lich.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 3 — assert «chuỗi có mặt» thay cho quan hệ: giá trị hàng chờ ở DP2-12 trùng khớp nhờ dòng dãy, không nhờ phần hàng chờ (r2)**
  Người dùng thấy gì: Phép kiểm xem và bảng đợt hiển thị cùng thông tin có thể vẫn xanh dù bảng hàng chờ bị mất. Nghĩa là xanh ở chỗ này chưa chứng minh được hàng chờ hiện đúng.
  file: `tests/dieu-phoi/mo-dot.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 — lời hứa là QUAN HỆ thứ tự nhưng chiều đỏ DP2-01-do thu-tu chỉ đi qua nhánh «vắng chuỗi» (r2)**
  Người dùng thấy gì: Phép kiểm trình tự các bước của lệnh mở đợt chưa chứng minh được là bắt lỗi đảo thứ tự. Nếu ai đó đảo bước, kiểm tra vẫn có thể báo xanh.
  file: `tests/dieu-phoi/mo-dot.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 — E8 hứa ĐẲNG THỨC tập (ma, slug) nhưng kiemRoundTrip chỉ kiểm bao hàm một chiều (r2)**
  Người dùng thấy gì: Phép kiểm đọc hàng từ lộ trình hai đường chỉ bắt được trường hợp thiếu, chưa bắt được trường hợp bộ đọc gói trả thừa hàng. Một hàng thừa hoặc trùng có thể lọt vào đợt mà kiểm tra vẫn xanh.
  file: `tests/dieu-phoi/mo-dot.test.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).

# Review findings: ra-soat-lo-trinh (round 3)

## Trong hợp đồng

Không có finding nào map được vào AC trong round này.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Hướng dẫn lệnh xem nói cảnh báo là «dòng bắt đầu `!`», nhưng bộ máy in dòng đó không bắt đầu bằng `!`**
  Người dùng thấy gì: Lời dặn cho phiên Claude mô tả dòng cảnh báo hơi sai chỗ: dòng ấy có dấu chấm than nhưng không nằm ở đầu dòng. Cảnh báo vẫn được in đủ và vẫn được dặn đưa nguyên văn cho chủ kho, nên chỉ có nguy cơ nhỏ là bị nhận nhầm.
  file: `road-map/commands/xem.md`
  severity: low
  Đề xuất: known-limits

- **Chú thích mã thoát của --ra-soat đã cũ sau khi tệp hỏng cũng trả về 1**
  Người dùng thấy gì: Chủ kho không bị ảnh hưởng: lệnh rà soát vẫn báo đúng khi có tệp lộ trình hỏng. Chỉ có ghi chú nội bộ cho người sửa mã còn nói theo cách cũ, và có thể làm họ hiểu nhầm.
  file: `scripts/lo-trinh.mjs`
  severity: low
  Đề xuất: wont-fix

- **Rà soát im lặng khi tệp lộ trình nằm trong kho git nhưng chưa từng commit (untracked/gitignored): luật tuổi tắt mà không có cảnh báo, trong khi cùng nội dung ngoài kho git thì có cảnh báo**
  Người dùng thấy gì: Nếu tệp lộ trình mới tạo và chưa được lưu vào lịch sử, thẻ khởi động không nhắc việc cũ quá hạn cũng không báo là đã bỏ qua việc kiểm tuổi. Chủ kho có thể tưởng không có hàng nào cũ, trong khi thực ra máy chưa kiểm được.
  file: `scripts/lo-trinh.mjs`
  severity: medium
  Đề xuất: known-limits

- **xem.md bảo nhận diện cảnh báo bằng «dòng bắt đầu `!`» nhưng lệnh in «  ! …» (hai dấu cách đầu) và «<tệp>:   ! …» khi kho nhiều lộ trình**
  Người dùng thấy gì: Lời dặn cho phiên Claude nói cảnh báo bắt đầu bằng dấu chấm than, còn thực tế dòng ấy có chữ đứng trước. Cảnh báo vẫn hiện đủ và được dặn đưa nguyên văn, nên tác hại thấp.
  file: `road-map/commands/xem.md`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 3 — lời hứa «tập đề xuất BẰNG tập của RS-2» chỉ được đo bằng phép chứa, không phải phép bằng**
  Người dùng thấy gì: Bài kiểm này chưa chặn được trường hợp thêm ba hàng tự khai lại làm sinh thêm đề xuất thừa ở hàng khác. Nếu việc đó xảy ra, chủ kho có thể thấy đề xuất không mong muốn mà bài kiểm vẫn báo xanh.
  file: `tests/scripts/ra-soat-lo-trinh.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Phép kiểm RS-0 mới có hai vế mà chiều đỏ chỉ thử một: gỡ vế «mọi commit thường phải thuộc vòng» thì RS-0-do vẫn xanh (r2 · tệp đã đổi)**
  Người dùng thấy gì: Phép kiểm chặn việc so sánh với bản gốc khi lịch sử có commit lạ chỉ được thử đỏ ở một nửa trường hợp. Nếu ai lỡ gỡ nửa còn lại thì phép kiểm vẫn báo xanh, và phép so với bản gốc có thể tin nhầm.
  file: `tests/scripts/ra-soat-lo-trinh.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **--ra-soat im lặng khi tệp lộ trình hỏng: thoát 0, không in gì, JSON không mang lỗi (r2 · tệp đã đổi)**
  Người dùng thấy gì: Khi tệp lộ trình bị hỏng, lệnh rà soát không báo lỗi gì mà trông y như không có hàng nào cần rà. Chủ kho có thể tưởng lộ trình ổn trong khi thật ra máy chưa đọc được nó.
  file: `scripts/lo-trinh.mjs`
  severity: medium
  Đề xuất: known-limits

- **Tuổi hàng tắt im lặng khi --root là thư mục con của kho git (git show sha:tep tính đường từ gốc kho) (r2 · tệp đã đổi)**
  Người dùng thấy gì: Nếu lộ trình nằm trong một thư mục con của kho lớn, máy không tính được tuổi hàng và âm thầm không nhắc hàng nào bị bỏ quên lâu. Chủ kho không biết tính năng này đang tắt.
  file: `scripts/lo-trinh.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hàng tự khai «Đã bác» / «Ngoài phạm vi» / «Đang làm» bị đếm vào «Kế tiếp» và nhận đề xuất «chờ điều kiện» (r2 · tệp đã đổi)**
  Người dùng thấy gì: Ở kho khai chính sách giới hạn số việc kế tiếp, máy có thể gợi ý đưa vào chờ điều kiện cả việc đã bị bác hoặc đang làm dở. Đề xuất đó sai nhãn và có thể làm chủ kho rối khi đọc thẻ khởi động.
  file: `scripts/lo-trinh.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 (khai hai vế quan hệ, ma trận đỏ chỉ phủ một vế): RS-0-do không có ca đỏ cô lập cho vế «mọi commit thường chạm mã sau gốc phải thuộc vòng» (r2 · tệp đã đổi)**
  Người dùng thấy gì: Phép kiểm chặn commit lạ chưa có ca thử riêng cho trường hợp nguy hiểm nhất, là commit lạ sửa đúng tệp mà vòng này cũng sửa. Ca đó có thể lọt mà không ai thấy.
  file: `tests/scripts/ra-soat-lo-trinh.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (đối chứng dương không cùng hình dạng với ca thật): bản lành của RS-0-do không có commit gộp nhánh chính, nên lý do của bản sửa (gộp main không bị tính) không có răng trong bộ kiểm (r2 · tệp đã đổi)**
  Người dùng thấy gì: Lý do chính của lần sửa gần nhất, là gộp nhánh chính vào thì không được coi là commit lạ, hiện chỉ được canh bằng lịch sử thật của kho. Nếu lịch sử đổi, lỗi cũ có thể quay lại mà không phép kiểm cố định nào báo.
  file: `tests/scripts/ra-soat-lo-trinh.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Rà soát báo «không có đề xuất» khi tệp lộ trình hỏng (xanh giả ở ranh giới hệ thống) (r1 · tệp đã đổi)**
  Người dùng thấy gì: Khi tệp lộ trình bị hỏng, lệnh rà soát vẫn im lặng và trang hướng dẫn bảo người dùng nói «không có đề xuất nào». Chủ kho sẽ tưởng kế hoạch ổn trong khi máy thật ra không đọc được nó.
  file: `scripts/lo-trinh.mjs`
  severity: medium
  Đề xuất: new-contract

- **Lệnh gợi ý trên thẻ khởi động trỏ đường tương đối chỉ chạy được trong kho kit (r1 · tệp đã đổi)**
  Người dùng thấy gì: Khi có hơn 5 đề xuất, thẻ khởi động gợi ý một lệnh để xem phần còn lại, nhưng ở các kho khác ngoài kho kit lệnh đó chạy không được. Chủ kho phải tự tìm cách xem nốt các đề xuất còn lại.
  file: `scripts/lo-trinh.mjs`
  severity: medium
  Đề xuất: new-contract

- **Câu cờ đã dịch sang chữ người vẫn lộ tên khoá máy (tuoi_ngay, tran_ke_tiep) (r1 · tệp đã đổi)**
  Người dùng thấy gì: Hai câu cảnh báo về chính sách tuổi và trần vẫn in tên khoá kỹ thuật thay vì chữ thường. Chỉ hơi khó đọc, không làm sai kết quả.
  file: `scripts/lo-trinh.mjs`
  severity: low
  Đề xuất: known-limits

- **Cờ «lịch sử cụt» được tính nhưng không mặt nào in ra (lệnh chữ, /road-map:xem, thẻ start) (r1 · tệp đã đổi)**
  Người dùng thấy gì: Trên kho tải nông, tuổi hàng bị tính thấp hơn thật nên có đề xuất bị bỏ sót, mà người đọc không thấy dấu hiệu nào báo điều đó. Chủ kho có thể tin nhầm rằng không có hàng nào quá hạn.
  file: `scripts/lo-trinh.mjs`
  severity: medium
  Đề xuất: new-contract

- **Tệp lộ trình hỏng thì --ra-soat vẫn thoát 0, không in gì, và /road-map:xem sẽ báo «không có đề xuất» (r1 · tệp đã đổi)**
  Người dùng thấy gì: Khi tệp lộ trình bị hỏng, rà soát im lặng và lệnh xem báo «không có đề xuất». Chủ kho sẽ nhầm kế hoạch hỏng thành kế hoạch sạch.
  file: `scripts/lo-trinh.mjs`
  severity: medium
  Đề xuất: new-contract

- **tuoiHang nuốt mọi lỗi git nên luật tuổi chết im lặng khi --root không phải gốc kho git (hoặc không phải kho git) (r1 · tệp đã đổi)**
  Người dùng thấy gì: Nếu thư mục kế hoạch nằm trong thư mục con của kho, hoặc không phải kho git, luật theo tuổi âm thầm không chạy và báo như thể không có hàng nào quá hạn.
  file: `scripts/lo-trinh.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hàng «Kế tiếp» gồm cả hàng tự khai Đã bác, Ngoài phạm vi, Đang làm nên bị đếm vào trần và được đề xuất «chờ điều kiện» (r1 · tệp đã đổi)**
  Người dùng thấy gì: Những hàng chủ kho đã tự ghi là đã bác, đang làm hoặc ngoài phạm vi vẫn bị đếm vào danh sách «Kế tiếp». Vì vậy chúng nhận đề xuất «chờ điều kiện» không đáng có và đẩy nhầm các hàng thật sự đang chờ.
  file: `scripts/lo-trinh.mjs`
  severity: medium
  Đề xuất: new-contract

- **gan-moc-dang-chay coi mã trong moc.hang không khớp hàng nào là «hàng ngoài đợt» nên cảnh báo sai (r1)**
  Người dùng thấy gì: Nếu một mốc chứa mã gõ sai hoặc mã đã xoá, người dùng có thể nhận cảnh báo «đổi đích chiến dịch giữa chừng» dù chưa có hàng của đợt khác. Chỉ là một cảnh báo thừa trong tình huống hiếm.
  file: `scripts/cat-luot.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 3 (assert chuỗi có mặt trong khi lời hứa là QUAN HỆ): RS-8 không so răng phủ với bộ máy gốc dù E8 hứa vậy (r1 · tệp đã đổi)**
  Người dùng thấy gì: Phép kiểm về đổi chữ «chờ điều kiện» chưa so mã thoát của răng phủ với bản cũ. Nếu có ai vô tình đổi hành vi răng phủ mà vẫn giữ đúng chữ, phép kiểm này sẽ không bắt được, dù các phép kiểm khác phủ một phần.
  file: `tests/scripts/ra-soat-lo-trinh.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (âm tính một mình, không ghim thông điệp): RS-5-loi kết luận từ riêng mã thoát 2 của --ra-soat --hang (r1 · tệp đã đổi)**
  Người dùng thấy gì: Phép kiểm việc chặn tổ hợp lệnh sai chỉ nhìn mã lỗi, không nhìn lý do. Rủi ro nhỏ: lệnh vẫn bị chặn như mong đợi, chỉ có thể bị chặn vì lý do khác.
  file: `tests/scripts/ra-soat-lo-trinh.test.mjs`
  severity: medium
  Đề xuất: wont-fix

- **Hình dạng 4 (âm tính một mình, không đối chứng dương): RS-3-chua-commit xanh cả khi bộ rà soát không đọc tệp (r1 · tệp đã đổi)**
  Người dùng thấy gì: Một phép kiểm phụ về tệp lộ trình chưa commit có thể xanh dù máy không đọc tệp đó. Ảnh hưởng nhỏ vì ca này nằm ngoài các tiêu chí chính.
  file: `tests/scripts/ra-soat-lo-trinh.test.mjs`
  severity: low
  Đề xuất: wont-fix

- **Hình dạng 5 (tuyên quét lớp nhưng có vùng mù): RS-8-quet bỏ qua mọi dòng tệp markdown bắt đầu bằng # hoặc * (r1 · tệp đã đổi)**
  Người dùng thấy gì: Phép quét chữ «chân trời» bỏ qua các tiêu đề và gạch đầu dòng trong tài liệu, nên sau này nếu có ai viết lại chữ cũ ở đó thì sẽ không bị phát hiện. Hiện tại chưa có chỗ nào sai.
  file: `tests/scripts/ra-soat-lo-trinh.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 (quan hệ thoả rỗng, không đối chứng dương): RS-5 so «chữ = thẻ» bằng forEach trên mảng có thể rỗng (r1 · tệp đã đổi)**
  Người dùng thấy gì: Một phép so giữa dòng chữ và dòng trên thẻ có thể xanh một cách vô nghĩa nếu thẻ mất cả khối rà soát. Có các phép kiểm khác đã phủ việc này nên rủi ro thấp.
  file: `tests/scripts/ra-soat-lo-trinh.test.mjs`
  severity: low
  Đề xuất: wont-fix

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).

# Review findings: ban-do-khuon-roi-nhom (round 2)

## Trong hợp đồng

Không có finding nào map được vào AC.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Mục ngoai_le gõ sai khoá `khoi` âm thầm gỡ cả tệp khỏi nhóm, không có sai lược đồ hay cảnh báo**
  Người dùng thấy gì: Nếu người viết bản đồ khuôn gõ sai tên một ô trong danh sách ngoại lệ, màn hình đó lặng lẽ bị bỏ khỏi việc chấm khuôn mà không có cảnh báo nào. Một màn lệch khuôn có thể lọt qua mà không ai thấy.
  Căn cứ: Chỉ xảy ra khi người viết bản đồ gõ sai, hậu quả là bỏ sót kiểm tra chứ không mất dữ liệu, người dùng sửa được bằng cách chữa lại lỗi gõ, và vòng này đã ghi rõ không xử lý cờ khoá lạ nên ghi vào giới hạn đã biết là đủ.
  file: `scripts/ban-do-khuon.cjs`
  severity: medium
  Đề xuất: known-limits

- **Gõ sai tên khoá `khoi` trong một mục ngoai_le làm cả tệp lặng lẽ rời nhóm (fail-open)**
  Người dùng thấy gì: Nếu người viết bản đồ khuôn gõ sai tên một ô trong danh sách ngoại lệ, cả tệp đó bị bỏ khỏi việc chấm khuôn mà không có dòng cảnh báo nào. Màn hình ấy có thể ship lệch khuôn mà không ai biết.
  Căn cứ: Cần có lỗi gõ mới xảy ra, hậu quả là bỏ sót kiểm tra chứ không mất dữ liệu, người dùng tự sửa được khi phát hiện, và hợp đồng đã chủ ý để cờ khoá lạ cho vòng sau nên ghi vào giới hạn đã biết là hợp lý.
  file: `scripts/ban-do-khuon.cjs`
  severity: medium
  Đề xuất: known-limits

- **GUIDE và khuôn tệp không nói hợp đồng mới của CLI --json (mục rời nhóm in "khoi": null), trong khi GUIDE vẫn chỉ lint của kho sang lối đọc này (r1)**
  Người dùng thấy gì: Kho nào tự viết bước kiểm riêng bằng cách đọc đầu ra JSON của công cụ bản đồ khuôn có thể không biết giá trị rỗng nghĩa là tệp đã rời nhóm, nên vẫn chấm tệp đó. Hôm nay chưa kho nào làm vậy.
  Căn cứ: Chưa có kho nào bị ảnh hưởng và chỉ gặp khi tự viết bước kiểm riêng, nên hậu quả nhẹ; bổ sung một câu vào tài liệu sau này rất rẻ.
  file: `GUIDE.md`
  severity: low
  Đề xuất: known-limits

- **Sai chính tả khoá `khoi` trong một mục ngoai_le lặng lẽ biến miễn-một-khối thành rời-cả-nhóm (fail-open) (r1)**
  Người dùng thấy gì: Nếu người viết bản đồ gõ sai tên khoá khi muốn miễn đúng một khối, cả tệp đó sẽ bị coi là rời nhóm và mọi phép chấm khuôn trên tệp ấy tắt mà không có cảnh báo. Lỗi gõ nhầm bị che đi thay vì lộ ra.
  Căn cứ: Khiến kiểm tra khuôn bỏ sót tệp mà người dùng không hay biết, nhưng chỉ xảy ra khi bản đồ bị gõ sai và người viết có thể tự sửa khi phát hiện; cần ghi rõ để kho biết mà soát khoá.
  file: `scripts/ban-do-khuon.cjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 — chỉ đếm số mục trong khi lời hứa là quan hệ («mười sáu tệp báo oan đều nằm trong danh sách rời nhóm») (r1)**
  Người dùng thấy gì: Phép đo trên hai kho thật chỉ đếm số tệp rời nhóm chứ không đối chiếu từng tệp từng bị báo oan, nên về lý thuyết có thể xanh dù danh sách rời nhóm không phủ đúng các tệp ấy. Kết quả báo oan về 0 vẫn cho thấy các tệp đó không còn bị báo.
  Căn cứ: Người dùng không thấy hậu quả trực tiếp vì số lệch đo được đã về 0; đây chỉ là độ chặt của phép đo, nên ghi nhận và ship nguyên trạng.
  file: `tests/scripts/ban-do-khuon-roi-nhom-hai-kho.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 — ma trận Coverage khai «Never: glob trong `ngoai_le.tep`» mà không có ca nào đo (r1)**
  Người dùng thấy gì: Nếu ai đó sau này đổi cách khớp tên tệp sang kiểu mẫu có dấu sao, sẽ không có phép đo nào báo lỗi. Hôm nay người dùng không bị ảnh hưởng vì tên tệp vẫn phải ghi đúng đường dẫn.
  Căn cứ: Hợp đồng đã chủ động loại phần này ra ngoài, hiện không ai dùng mẫu có dấu sao nên không gây hại; chỉ cần ghi là chưa có phép đo giữ.
  file: `tests/scripts/ban-do-khuon-roi-nhom.test.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).

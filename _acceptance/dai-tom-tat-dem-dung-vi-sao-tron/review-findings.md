# Review findings: dai-tom-tat-dem-dung-vi-sao-tron

## Trong hợp đồng

- **Tài liệu ô chua_lam không nêu ca «đầu đoạn văn + hai đoạn dẫn + danh sách» → chưa đọc được; đọc theo tài liệu sẽ đoán ra một con số**
  file: skills/acceptance/references/lo-trinh-du-lieu.md:93
  severity: low
  AC: AC-10
  source: conventions
  detail: Tài liệu viết: «đoạn dẫn trước danh sách không là mục». Nó liệt ba điều kiện KHÔNG in số: tiêu đề con, hai danh sách trở lên, nhiều đoạn mà không có danh sách. Trong mã, nhánh không biên của thanKhoi dừng lại khi seq.length >= 2 rồi trả null. Nghĩa là khối mở bằng đầu đoạn văn, theo sau HAI đoạn dẫn rồi MỘT danh sách sẽ ra «chưa đọc được». AC-5 và ca DD-5 «đầu đoạn rồi hai đoạn» cũng ghim đúng hành vi này. Trong khi đó, khối mở bằng tiêu đề thì nhận bao nhiêu đoạn dẫn cũng được (AC-1 ca d). Khác biệt giữa hai dạng không có trong tài liệu, và ca trên không thuộc điều kiện nào trong ba điều kiện đã liệt. Kho tiêu thụ đọc tài liệu sẽ đoán ra một con số, còn khối dữ liệu lại in «chưa đọc được». Đây đúng là chỗ «mâu thuẫn mã» mà AC-10/E10 đi tìm.
  căn cứ phạm vi: AC-10 đòi mô tả ô chưa làm khớp hành vi mới và không câu nào mâu thuẫn mã; finding chỉ ra một hình dạng (đầu đoạn + hai đoạn dẫn + danh sách) mà tài liệu dẫn người đọc tới con số còn mã nói «chưa đọc được».

- **Hình dạng 5 (tuyên quét lớp, chỉ có điểm-case): DD-5 chỉ vẽ trang/khối cho 2 trong 8 ca; chiều gương «hợp đồng hỏng + báo cáo 3 gạch» không được kiểm ở trang**
  file: tests/scripts/dai-tom-tat-dem-dung.test.mjs:236
  severity: high
  AC: AC-5
  source: measurement
  detail: AC-5 hứa ở trang VÀ khối, cho cả hai chiều gương, rằng mục «Giới hạn và ngoài hợp đồng» không có dòng giới hạn nào. Dòng 306 (thông điệp OK) và E5 cũng nói vậy cho cả 8 ca. Nhưng `dd5` kiểm 8 ca chỉ ở mô-đun (`tomTat(...).dai.moi_nguoi.chua_lam`). Phần trang + khối (`daiCua`, `khoi`, `gioiHanTrang`, `chuaDocTrang`) chỉ chạy ở `for (const i of [1, 7])`. Ca 5 «hai nguồn cùng hỏng» và ca 6 «hợp đồng hỏng, báo cáo 3 gạch» không bao giờ được vẽ ra trang. Đã thử trên bản sao ở scratchpad, thay nhát tiêm của DD-5-do-trang bằng `known: ghBC.khongDoc ? [] : known,` (chỉ ẩn danh sách khi báo cáo hỏng). Kết quả: ở ca 6, mô-đun vẫn trả ô «… chưa đọc được — khối giới hạn ở hợp đồng …» nhưng `chiTiet.known` lại là ['x.','y.','z.'], tức trang in 3 dòng `data-loai="gioi-han"` ngay cạnh câu «chưa đọc được». Vậy mà `dd5` trả [] — lượt chạy in «FAIL: DD-5-do-trang — không bắt (cần «trang vẫn liệt»): []». Ma trận trang × nguồn hỏng không được viết đủ, nên chiều này của lời hứa AC-5 không có thước nào đo.
  căn cứ phạm vi: AC-5 nêu rõ cả hai chiều gương, ở trang và khối, mục giới hạn của trang không có dòng giới hạn nào; ca 5 và 6 không bao giờ được vẽ ra trang nên vế này của AC-5 không có thước đo.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **DD-2-do ghim «8» tự thoả: chính câu báo lỗi đã chứa sẵn số 8 nên ca không chứng được bản tiêm đếm đôi**
  Người dùng thấy gì: Phép thử «cố tình làm hỏng rồi xem bộ kiểm có báo đỏ» cho lỗi đếm đôi giới hạn có thể vẫn báo xanh dù lỗi bị tiêm vào không phải lỗi đếm đôi. Sản phẩm vẫn đếm đúng; chỉ là bằng chứng «bộ kiểm biết bắt đúng lỗi này» yếu hơn vẻ ngoài.
  file: `tests/scripts/dai-tom-tat-dem-dung.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Đường đo --hien-tai mục (iv) chỉ so câu cuối, bỏ vế «mục cuối» mà hợp đồng khai và DD-9 vẫn làm**
  Người dùng thấy gì: Lệnh đọc ngưỡng nghiệm thu trên kho crm chỉ kiểm câu cuối của lý do làm, chưa kiểm mục cuối của danh sách đi kèm. Nếu trang hồ sơ sau này làm rơi cả danh sách, lệnh này vẫn báo «sống»; chỉ bộ ca chính chạy trên bản ghim mới bắt được.
  file: `tests/scripts/dai-tom-tat-sau-kho.mjs`
  severity: medium
  Đề xuất: known-limits

- **Ca chiều đỏ của dai-tom-tat-sau-kho chạy mà không đòi bản lành xanh trước (thiếu đối chứng dương)**
  Người dùng thấy gì: Hai phép thử «làm hỏng bản sao rồi xem báo đỏ» không kiểm trước rằng bản nguyên vẹn đang xanh, nên trong ca xấu chúng có thể báo «bắt được» khi lỗi thật đã có sẵn từ trước. Kết quả tổng vẫn đỏ, chỉ nguyên nhân hiển thị có thể sai.
  file: `tests/scripts/dai-tom-tat-sau-kho.mjs`
  severity: low
  Đề xuất: wont-fix

- **Đầu đoạn giới hạn không có dấu «:» mà mang nội dung, đứng một mình: ô in «0 giới hạn đã biết» và không bật cờ vàng**
  Người dùng thấy gì: Nếu hồ sơ ghi giới hạn bằng một câu đơn mở bằng «Known limits —» mà không có dấu hai chấm và không có gì theo sau, ô sẽ báo «0 giới hạn đã biết» dù hồ sơ có nhắc giới hạn, và không có cờ cảnh báo. Bản trước báo 1. Hiện chưa kho nào dính nên chưa sai hồ sơ nào.
  file: `scripts/ho-so-tom-tat.cjs`
  severity: medium
  Đề xuất: new-contract

- **Khối giới hạn viết bằng bảng bị đọc thành MỘT đoạn: in «1 giới hạn đã biết» và trang liệt một dòng bảng bị nối dính**
  Người dùng thấy gì: Khi mục giới hạn của hồ sơ chỉ là một bảng, ô báo «1 giới hạn đã biết» và trang hồ sơ in cả bảng thành một dòng dính, thay vì nói «chưa đọc được». Hiện chưa hồ sơ thật nào dính, và bản trước cũng sai theo chiều khác.
  file: `scripts/ho-so-tom-tat.cjs`
  severity: medium
  Đề xuất: known-limits

- **Phép đo sáu kho nuốt ngoại lệ của mô-đun đang kiểm: hồ sơ làm mô-đun ném lỗi bị bỏ qua lặng lẽ ở DD-9 và ở vế (iv) của --hien-tai**
  Người dùng thấy gì: Nếu bộ đọc mới hỏng và ném lỗi trên vài hồ sơ, phép đo trên sáu kho sẽ lặng lẽ bỏ qua những hồ sơ đó và vẫn báo xanh. Hiện không hồ sơ nào trong 735 hồ sơ thật gây lỗi nên chưa ảnh hưởng ai, nhưng lưới này chưa chặn được hồi quy về sau.
  file: `tests/scripts/dai-tom-tat-sau-kho.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 (không ghim đúng thông điệp): chiều đỏ DD-2-do và DD-5-do-bao-cao ghim một chữ có sẵn trong khuôn thông điệp của chính ca**
  Người dùng thấy gì: Hai phép thử «cố tình làm hỏng rồi xem báo đỏ» (đếm đôi giới hạn, và nguồn hỏng là báo cáo) ghim vào một chữ mà câu báo lỗi luôn tự in ra, nên chúng có thể báo «bắt được» cho bất kỳ lỗi nào. Sản phẩm không sai; chỉ là bằng chứng chiều đỏ lỏng hơn vẻ ngoài.
  file: `tests/scripts/dai-tom-tat-dem-dung.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 (tuyên quét lớp nhưng đếm cả phần tử không được so): DD-9 tính «câu dẫn so mục cuối» trước khi so và bỏ qua im lặng khi bộ tách trả null**
  Người dùng thấy gì: Phép đo trên sáu kho báo «19 hồ sơ đã kiểm mục cuối» trong khi thực ra chỉ 18 được so, một hồ sơ crm mà bộ tách của phép đo không tách được bị bỏ qua vẫn được tính. Cùng lớp: lỗi ném ra bị nuốt, và lệnh đọc ngưỡng chỉ kiểm câu cuối. Sản phẩm không sai; con số phép đo tự khai cao hơn thực tế.
  file: `tests/scripts/dai-tom-tat-sau-kho.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 2 (fixture không round-trip từ writer thật): khối ghim lại của ca DD-3 (f) rút từ khuôn tài liệu SKILL, không từ repin-lane.mjs**
  Người dùng thấy gì: Phép thử khối «ghim lại» lấy mẫu từ tài liệu hướng dẫn chứ không từ chính công cụ sinh ra khối đó. Nếu công cụ đổi chữ tiêu đề mà tài liệu giữ nguyên, phép thử vẫn xanh còn báo cáo thật có thể bị đếm lẫn khối ghim lại vào số giới hạn.
  file: `tests/scripts/dai-tom-tat-dem-dung.test.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).

# Review findings: dieu-phoi-on-dinh-r2 (round 2)

## Trong hợp đồng

- **DP8-11 tach-khoi: bộ tự kiểm «số khối bằng số lời gọi test(» bỏ qua tests/dieu-phoi/loi/, trong khi caDoiThan quét đệ quy**
  file: `tests/dieu-phoi/on-dinh-r2.test.mjs:1000`
  severity: low
  AC: AC-11
  source: conventions
  detail: Bộ tự kiểm chỉ đọc `fs.readdirSync(DAY)`, tức các tệp `.test.mjs` ở ngay cấp `tests/dieu-phoi/`. Còn `caDoiThan` (qua `tepTai`, chạy `git ls-tree -r … -- tests/dieu-phoi`) duyệt cả `tests/dieu-phoi/loi/`: 14 tệp ca, 84 lời gọi `test(`, khoảng 21% tổng 391. AC-11 hứa phủ «mỗi ca của các tệp dưới tests/dieu-phoi/». Sổ d-…-11 dựa vào chính bộ tự kiểm này làm lưới cho các hình dạng ca mà bộ tách chưa hiểu («tự kiểm số khối … sẽ đỏ khi gặp ca như thế»). Một ca hình lạ thêm vào `loi/` sẽ lọt qua lưới đó. Tôi đã chạy cùng `khoiCa` trên `loi/`: lệch 0, nên phán quyết hôm nay chưa sai. Đề xuất: lấy danh sách tệp cho bộ tự kiểm bằng cùng nguồn với `caDoiThan` (ls-tree đệ quy, hoặc duyệt đệ quy DAY).
  rationale: AC-11 hứa tự kiểm «trên mọi tệp ca thật» và suite phủ tests/dieu-phoi/**; bộ tự kiểm chỉ quét 8 tệp cấp một, bỏ 14 tệp trong loi/.

- **Hình dạng 5 (tuyên tự kiểm «trên mọi tệp ca thật» nhưng chỉ quét thư mục cấp một): DP8-11 tach-khoi bỏ sót 14 tệp ca trong tests/dieu-phoi/loi/**
  file: `tests/dieu-phoi/on-dinh-r2.test.mjs:1000`
  severity: low
  AC: AC-11
  source: measurement
  detail: AC-11 hứa bộ tách khối «tự kiểm: trên mọi tệp ca thật, số khối có tên == số lời gọi `test(`». Chú thích của `dongKhep` (dòng 884) cũng dựa vào đó: «tự kiểm số khối bắt được» ca regex có ngoặc lẻ. Nhưng phần tự kiểm ở dòng 1000 chỉ quét `fs.readdirSync(DAY).filter((x) => x.endsWith('.test.mjs'))`, tức 8 tệp ở cấp một. Trong khi đó `caDoiThan` (dòng 945-948) áp `khoiCa` lên MỌI tệp .mjs dưới tests/dieu-phoi qua `git ls-tree -r`, gồm cả 14 tệp `tests/dieu-phoi/loi/*.test.mjs` có lời gọi `test(`. Vậy bộ tách được dùng để phán quyết trên 22 tệp ca nhưng chỉ được tự kiểm trên 8. Tôi đã chạy thử cùng phép tự kiểm trên các tệp ở loi/: hôm nay ra 84 lời gọi, lệch 0, nên phán quyết hiện tại chưa sai. Nhưng lưới mà chú thích dựa vào không phủ phần cây này.
  rationale: AC-11 ghi nguyên văn tự kiểm «trên mọi tệp ca thật, số khối có tên == số lời gọi test(»; bộ tự kiểm chỉ quét 8 tệp cấp một và bỏ 14 tệp ca dưới loi/.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Bộ đọc YAML theo dòng của kiem-chuyen vẫn để lọt đúng lớp lỗi «sạch giả» của Ngoài-5: lượt này chỉ vá hai dạng cụ thể, chưa vá cả lớp**
  Người dùng thấy gì: Với một số cách viết hợp lệ khác của tệp cấu hình đợt (eval viết gọn trong một cặp ngoặc nhọn, hoặc danh sách không thụt vào), phép kiểm chuyển gói có thể báo «sạch» trong khi vẫn còn dòng phải sửa. Hiện chỉ kho crm dùng gói và crm viết đúng dạng đã đọc được, nên chưa ai bị ảnh hưởng; kho thứ hai viết theo cách khác sẽ bị.
  file: `dieu-phoi/scripts/kiem-chuyen.mjs`
  severity: medium
  Đề xuất: known-limits

- **dp8-crm-that: phép thử khai «dạng một dòng» trên crm vẫn xanh với chính lỗi mà chú thích nói nó canh**
  Người dùng thấy gì: Phép kiểm trên kho crm thật cho cách khai miễn trừ viết trên một dòng không phân biệt được bản đúng với bản lỗi, dù ghi chú nói nó canh lỗi đó. Lỗi loại này vẫn bị bắt ở phép kiểm trên kho thử tổng hợp, nên chỉ thiếu một lớp bảo vệ thứ hai trên dữ liệu thật.
  file: `tests/dieu-phoi/dp8-crm-that.mjs`
  severity: low
  Đề xuất: known-limits

- **Chú thích ở hang.mjs nói «giới hạn đã khai, hạt giống» nhưng chưa có hạt giống nào trong cây, cũng không có tên hay ngưỡng**
  Người dùng thấy gì: Mã gói nói rằng có một giới hạn đã được khai (hai lệnh ghi sổ luật của đợt không dùng khoá, nên có thể mất dòng hoặc ghi cụt khi chạy đồng thời), nhưng chưa có hồ sơ nào ghi giới hạn đó và cũng chưa có ngưỡng theo dõi. Người đọc sau này sẽ không tìm được nơi nó được khai.
  file: `dieu-phoi/scripts/hang.mjs`
  severity: low
  Đề xuất: known-limits

- **dp8-crm-that: phép kiểm khai dạng một dòng vẫn xanh khi chạy bộ đọc cũ có lỗi, tức lỗi mà chính chú thích nói nó canh**
  Người dùng thấy gì: Trên kho crm thật, phép kiểm cách khai miễn trừ viết một dòng vẫn báo xanh kể cả khi bộ đọc cũ bị lỗi quay lại, vì kết quả «sạch» trùng nhau ở cả hai bản. Lỗi vẫn bị bắt ở phép kiểm trên kho thử tổng hợp, nên chỉ thiếu lớp bảo vệ trên dữ liệu thật.
  file: `tests/dieu-phoi/dp8-crm-that.mjs`
  severity: low
  Đề xuất: known-limits

- **`xem --kiem-chuyen --chi-tiet` ghi stdout rồi gọi process.exit ngay, nên qua pipe đầu ra bị cắt ở 65 536 byte mà mã thoát vẫn như thường**
  Người dùng thấy gì: Khi phiên Claude Code chạy lệnh liệt kê chi tiết các dòng chuyển trên một kho có danh sách rất dài (khoảng 64 KB trở lên), kết quả bị cắt cụt giữa chừng mà không có báo lỗi nào. Kho crm thật hiện đã ở khoảng 81 % mức đó và danh sách chỉ dài thêm theo từng hồ sơ mới.
  file: `dieu-phoi/scripts/dieu-phoi.mjs`
  severity: low
  Đề xuất: new-contract

- **Hình dạng 3 (lời hứa là quan hệ, ca chỉ kiểm chuỗi có mặt): nhánh khai «dạng một dòng» của dp8-crm-that mù với đúng lỗi nó tự nêu tên**
  Người dùng thấy gì: Trên kho crm thật, phép kiểm cách khai miễn trừ viết trên một dòng chỉ xác nhận có dòng «sạch» chứ không kiểm hai cách khai cho cùng kết quả phân loại, nên không thể đỏ đúng với lỗi nó được thêm vào để chặn. Lỗi đó hiện chỉ bị bắt trên kho thử tổng hợp.
  file: `tests/dieu-phoi/dp8-crm-that.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 (tuyên phủ lớp «mọi dạng viết hợp lệ» nhưng ma trận chỉ có ca điểm): DP8-12 thiếu dạng danh sách khối không thụt, nơi docDanhSachKhoa trả [] và báo «sạch» giả**
  Người dùng thấy gì: Một cách viết hợp lệ của danh sách miễn trừ hoặc danh sách bộ chạy thử (xuống dòng nhưng không thụt vào) bị đọc thành rỗng, và phép kiểm chuyển gói có thể báo «sạch» sai. Bộ kiểm hiện không có ca nào chạm cách viết này, nên chưa ai biết cho tới khi một kho dùng nó.
  file: `tests/dieu-phoi/on-dinh-r2.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **docDanhSachKhoa đọc sai dạng một dòng `[...]` của dieu_phoi.lich_su: mục `#<id>` mất đuôi và thành glob miễn trọn tệp evals.yaml (lỗi theo hướng bỏ lọt) (r1 · tệp đã đổi)**
  Người dùng thấy gì: Khi danh sách lịch sử được viết trên một dòng và có mục trỏ tới một eval cụ thể, công cụ kiểm tra chuyển gói hiểu thành miễn cả tệp eval, rồi báo «sạch» dù còn eval sống gọi lõi cũ. Người vận hành có thể gỡ bản cũ trong khi vẫn còn việc đang dựa vào nó.
  file: `dieu-phoi/scripts/kiem-chuyen.mjs`
  severity: medium
  Đề xuất: new-contract

- **Ca đỏ DP8-06-do luon-nhan thiếu đối chứng dương: không chạy bản lành trên cùng fixture trước khi kết luận từ bản tiêm (r1 · tệp đã đổi)**
  Người dùng thấy gì: Một phép thử bảo vệ lệnh ghi danh không tự chứng minh được rằng nó đỏ vì lỗi vừa cố ý tiêm chứ không phải vì bản gốc vốn đã hỏng. Người đọc có thể tin một kết quả kiểm tra mà bản thân nó chưa được đối chứng.
  file: `tests/dieu-phoi/on-dinh-r2.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Khoá hang-viec.khoa không phủ hai bên viết Nhật ký LUAT.md khác (lệnh `pha` và `nhat-ky`), trong khi comment ghi là phủ «kể cả dòng Nhật ký» (r1 · tệp đã đổi)**
  Người dùng thấy gì: Nếu giám sát ghi nhật ký hoặc chuyển pha đúng lúc các phiên thợ đang ghi danh, một dòng nhật ký có thể mất, hoặc tệ hơn tệp luật của đợt bị ghi cụt. Ghi chú trong gói hứa việc này đã được khoá che nhưng thực tế chưa.
  file: `dieu-phoi/scripts/hang.mjs`
  severity: low
  Đề xuất: new-contract

- **docDanhSachKhoa coi '#' trong danh sách một dòng là chú thích, nên một mục khai '<evals.yaml>#<id>' bị nới thành miễn cả tệp evals và kiem-chuyen báo «sach» giả (r1 · tệp đã đổi)**
  Người dùng thấy gì: Danh sách lịch sử viết một dòng có mục kèm mã eval bị cắt cụt, nên lệnh kiểm tra chuyển gói coi cả tệp eval là lịch sử và báo «sạch» giả. Người vận hành có thể gỡ lõi cũ khi vẫn còn eval sống dùng nó.
  file: `dieu-phoi/scripts/kiem-chuyen.mjs`
  severity: medium
  Đề xuất: new-contract

- **khoiEval trả 0 khối khi evals.yaml viết mục danh sách ở cột 0 (YAML hợp lệ, crm có một tệp): executor sống bị xếp executor-chet, kiem-chuyen báo «sach» giả (r1 · tệp đã đổi)**
  Người dùng thấy gì: Với một cách viết tệp eval hợp lệ (mục danh sách sát lề trái), công cụ kiểm tra chuyển gói không thấy eval nào và có thể báo «sạch» dù eval sống vẫn dùng đường bản cũ. Hôm nay chưa tệp thật nào dính nên chưa gây hại.
  file: `dieu-phoi/scripts/kiem-chuyen.mjs`
  severity: low
  Đề xuất: known-limits

- **Khoá hang-viec.khoa không che các bên viết LUAT.md khác (pha, nhat-ky), dù ghi chú nói khoá che cả dòng Nhật ký (r1 · tệp đã đổi)**
  Người dùng thấy gì: Nếu giám sát chạy lệnh ghi nhật ký hoặc chuyển pha trong lúc các phiên thợ đang ghi danh, một dòng nhật ký có thể mất, hoặc tệp luật của đợt bị ghi cụt và mất phần luật. Lời hứa trong ghi chú về khoá chưa đúng với thực tế.
  file: `dieu-phoi/scripts/hang.mjs`
  severity: low
  Đề xuất: new-contract

- **Hình dạng 5 (thiếu ma trận toàn phần viết trước): bất biến DP8-06 không hàng nào ra `nhan-giang-lai`, nên một phần ba tập từ chối chưa từng được đo (r1 · tệp đã đổi)**
  Người dùng thấy gì: Phép đo bảo vệ lệnh ghi danh không có ca nào cho tình huống phiên thợ còn sống và còn đơn chờ. Nếu ai đó vô tình bỏ chặn này, ghi danh có thể đè lên một phiên đang làm việc mà bộ kiểm vẫn xanh.
  file: `tests/dieu-phoi/on-dinh-r2.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 (quét lớp nhưng chỉ có ca điểm): DP8-07 ma-tran-dau in `nhan-giang-lai` là «không với tới khi có dấu», dù `xetDay` vẫn đi tới được (r1 · tệp đã đổi)**
  Người dùng thấy gì: Báo cáo của phép đo dấu chờ ghi danh ghi một hành động là «không với tới được» trong khi thực ra chỉ là ma trận chưa thử tới. Người đọc có thể hiểu nhầm một chỗ chưa kiểm thành giới hạn của hệ thống.
  file: `tests/dieu-phoi/on-dinh-r2.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 (lời hứa là quan hệ giữa các giá trị): dòng tổng của `xem --kiem-chuyen` chỉ được kiểm n, tổng các k và thứ tự lớp, không kiểm từng `<lớp> <k>` (r1 · tệp đã đổi)**
  Người dùng thấy gì: Dòng tổng của lệnh kiểm tra chuyển gói chỉ được kiểm tổng số và thứ tự lớp, không kiểm số của từng lớp. Nếu bộ in hoán đổi số giữa các lớp thì người đọc thấy phân loại sai mà bộ kiểm vẫn xanh.
  file: `tests/dieu-phoi/on-dinh-r2.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (thiếu đối chứng dương ngay trong ca): DP8-06-do luon-nhan chạy bản tiêm mà không chạy bản lành trước (r1 · tệp đã đổi)**
  Người dùng thấy gì: Một phép thử bảo vệ lệnh ghi danh kết luận từ bản bị tiêm lỗi mà chưa chạy bản lành trên cùng điều kiện. Nếu bản lành vốn đã lệch thì phép thử vẫn xanh vì lý do sai, và người đọc không phân biệt được hai trường hợp.
  file: `tests/dieu-phoi/on-dinh-r2.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 (kết luận «không chặn» từ mã thoát 0, không có đối chứng): DP8-08 khoa-bo-roi và kiểm «không còn hang-viec.khoa» dùng tên khoá viết tay (r1 · tệp đã đổi)**
  Người dùng thấy gì: Phép thử khoá bị bỏ rơi chỉ chứng minh lệnh vẫn chạy, không chứng minh khoá cũ thật sự được dọn. Nếu tên khoá trong gói đổi, phép thử vẫn xanh trong khi khoá bỏ rơi không còn được dọn.
  file: `tests/dieu-phoi/on-dinh-r2.test.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).

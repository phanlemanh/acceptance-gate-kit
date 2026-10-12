# Review findings: dieu-phoi-on-dinh-r2 (round 1)

## Trong hợp đồng

- **Hình dạng 3 (lời hứa là đẳng thức tập): dp8-crm-that chấp nhận phần chênh ở merge-base thiếu một số dòng import tương đối**
  file: `tests/dieu-phoi/dp8-crm-that.mjs:78`
  severity: medium
  AC: AC-4
  source: measurement
  detail: AC-4/E4 hứa ở b9a3b160: «kiemChuyen mới == kiemChuyen v2.27.0 + ĐÚNG các dòng import tương đối ấy». `kiemMergeBase` chỉ kiểm bốn điều: (i) cũ ⊆ mới (dòng 84), (ii) phần chênh khác rỗng (dòng 85), (iii) mỗi phần tử của phần chênh có dạng import tương đối và thuộc một trong ba tệp (dòng 86-90), (iv) mỗi tệp có ít nhất một dòng trong `phai_sua` (dòng 78, xét bất kỳ dòng nào). Không có vế «phần chênh ⊇ mọi dòng import tương đối của ba tệp». Ở sha ghim, `scripts/kiem-cheo/dem.mjs` có HAI dòng như vậy: 10 (`../dieu-phoi/dot.mjs`) và 11 (`../dieu-phoi/hook-nhip.mjs`). Một bộ quét chỉ bắt dòng 10 vẫn qua cả bốn điều trên. Vì sha đã ghim, tập mong đợi cố định và viết sẵn được: `dem.mjs:10, dem.mjs:11, khoa.mjs:4, test/khoa.test.mjs:14` (đúng như lượt chạy in ra). Phép đo nên so phần chênh bằng đúng tập này, thay vì kiểm từng phần tử có dạng hợp lệ.
  rationale: AC-4 đòi danh sách mới bằng danh sách v2.27.0 cộng ĐÚNG các dòng import tương đối và phải sửa chứa ĐỦ dòng của ba tệp, nhưng phép đo chỉ kiểm quan hệ tập con và dạng từng phần tử nên không thực thi đẳng thức AC nêu.

- **Hình dạng 5 (tuyên phủ lớp «mọi ca» nhưng bộ tách khối chỉ nhận `test(` cột 0 nhiều dòng): DP8-11 gán nhầm tên ca đổi thân**
  file: `tests/dieu-phoi/on-dinh-r2.test.mjs:800`
  severity: medium
  AC: AC-11
  source: measurement
  detail: `khoiCa` (dòng 800-816) cắt khối bằng `/^test\((['"`])(.+?)\1/` và đóng khối ở dòng `^});` kế tiếp. Có hai lối hụt. (1) Ca một dòng `test('X', () => ...);` không có `});` riêng, nên khối của nó nuốt luôn ca kế tiếp. (2) Ca sinh trong vòng lặp được thụt lề, nên không thành khoá và bị gộp vào ca cột 0 đứng sau. Mô phỏng trên cây hiện tại: sửa thân `DP4-14 tai-lieu` thì bị báo là `DP4-14 ban-giao-md` (doi-tai-khoan.test.mjs:1061 là ca một dòng); sửa thân `DP7-05 ${chu}` thì bị báo là `DP7-05 vang`. Ngoài ra `DP6-02-do than-la-du-lieu` (một dòng) nuốt `DP6-03 moc-co-dinh`, còn `DP7-01-do ${ten}` và `DP7-08-do ${ten}` không thành khoá. Hệ quả: dòng sổ `fix` nêu đúng tên ca thật bị coi là thiếu, còn dòng sổ nêu sai tên lại làm phép đo im. Chiều đỏ `DP8-11-do so-thieu-ten` chỉ dựng tệp hai ca literal nhiều dòng, và không có assert số khối == số lời gọi `test(` trong mỗi tệp. Vòng này không đổi tệp test cũ nào nên phán quyết hiện tại chưa sai, nhưng phép đo đang tuyên phủ «mỗi ca của tests/dieu-phoi/**» (E11) mà thực tế không phủ đủ.
  rationale: AC-11 hứa «mỗi ca» của tests/dieu-phoi/ bị đổi thân phải có dòng sổ fix nêu đúng tên ca, mà bộ tách khối gán nhầm tên với ca một dòng và ca sinh trong vòng lặp nên lời hứa phủ toàn lớp không được giữ.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **docDanhSachKhoa đọc sai dạng một dòng `[...]` của dieu_phoi.lich_su: mục `#<id>` mất đuôi và thành glob miễn trọn tệp evals.yaml (lỗi theo hướng bỏ lọt)**
  Người dùng thấy gì: Khi danh sách lịch sử được viết trên một dòng và có mục trỏ tới một eval cụ thể, công cụ kiểm tra chuyển gói hiểu thành miễn cả tệp eval, rồi báo «sạch» dù còn eval sống gọi lõi cũ. Người vận hành có thể gỡ bản cũ trong khi vẫn còn việc đang dựa vào nó.
  file: `dieu-phoi/scripts/kiem-chuyen.mjs`
  severity: medium
  Đề xuất: new-contract

- **Ca đỏ DP8-06-do luon-nhan thiếu đối chứng dương: không chạy bản lành trên cùng fixture trước khi kết luận từ bản tiêm**
  Người dùng thấy gì: Một phép thử bảo vệ lệnh ghi danh không tự chứng minh được rằng nó đỏ vì lỗi vừa cố ý tiêm chứ không phải vì bản gốc vốn đã hỏng. Người đọc có thể tin một kết quả kiểm tra mà bản thân nó chưa được đối chứng.
  file: `tests/dieu-phoi/on-dinh-r2.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Khoá hang-viec.khoa không phủ hai bên viết Nhật ký LUAT.md khác (lệnh `pha` và `nhat-ky`), trong khi comment ghi là phủ «kể cả dòng Nhật ký»**
  Người dùng thấy gì: Nếu giám sát ghi nhật ký hoặc chuyển pha đúng lúc các phiên thợ đang ghi danh, một dòng nhật ký có thể mất, hoặc tệ hơn tệp luật của đợt bị ghi cụt. Ghi chú trong gói hứa việc này đã được khoá che nhưng thực tế chưa.
  file: `dieu-phoi/scripts/hang.mjs`
  severity: low
  Đề xuất: new-contract

- **docDanhSachKhoa coi '#' trong danh sách một dòng là chú thích, nên một mục khai '<evals.yaml>#<id>' bị nới thành miễn cả tệp evals và kiem-chuyen báo «sach» giả**
  Người dùng thấy gì: Danh sách lịch sử viết một dòng có mục kèm mã eval bị cắt cụt, nên lệnh kiểm tra chuyển gói coi cả tệp eval là lịch sử và báo «sạch» giả. Người vận hành có thể gỡ lõi cũ khi vẫn còn eval sống dùng nó.
  file: `dieu-phoi/scripts/kiem-chuyen.mjs`
  severity: medium
  Đề xuất: new-contract

- **khoiEval trả 0 khối khi evals.yaml viết mục danh sách ở cột 0 (YAML hợp lệ, crm có một tệp): executor sống bị xếp executor-chet, kiem-chuyen báo «sach» giả**
  Người dùng thấy gì: Với một cách viết tệp eval hợp lệ (mục danh sách sát lề trái), công cụ kiểm tra chuyển gói không thấy eval nào và có thể báo «sạch» dù eval sống vẫn dùng đường bản cũ. Hôm nay chưa tệp thật nào dính nên chưa gây hại.
  file: `dieu-phoi/scripts/kiem-chuyen.mjs`
  severity: low
  Đề xuất: known-limits

- **Khoá hang-viec.khoa không che các bên viết LUAT.md khác (pha, nhat-ky), dù ghi chú nói khoá che cả dòng Nhật ký**
  Người dùng thấy gì: Nếu giám sát chạy lệnh ghi nhật ký hoặc chuyển pha trong lúc các phiên thợ đang ghi danh, một dòng nhật ký có thể mất, hoặc tệp luật của đợt bị ghi cụt và mất phần luật. Lời hứa trong ghi chú về khoá chưa đúng với thực tế.
  file: `dieu-phoi/scripts/hang.mjs`
  severity: low
  Đề xuất: new-contract

- **Hình dạng 5 (thiếu ma trận toàn phần viết trước): bất biến DP8-06 không hàng nào ra `nhan-giang-lai`, nên một phần ba tập từ chối chưa từng được đo**
  Người dùng thấy gì: Phép đo bảo vệ lệnh ghi danh không có ca nào cho tình huống phiên thợ còn sống và còn đơn chờ. Nếu ai đó vô tình bỏ chặn này, ghi danh có thể đè lên một phiên đang làm việc mà bộ kiểm vẫn xanh.
  file: `tests/dieu-phoi/on-dinh-r2.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 (quét lớp nhưng chỉ có ca điểm): DP8-07 ma-tran-dau in `nhan-giang-lai` là «không với tới khi có dấu», dù `xetDay` vẫn đi tới được**
  Người dùng thấy gì: Báo cáo của phép đo dấu chờ ghi danh ghi một hành động là «không với tới được» trong khi thực ra chỉ là ma trận chưa thử tới. Người đọc có thể hiểu nhầm một chỗ chưa kiểm thành giới hạn của hệ thống.
  file: `tests/dieu-phoi/on-dinh-r2.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 (lời hứa là quan hệ giữa các giá trị): dòng tổng của `xem --kiem-chuyen` chỉ được kiểm n, tổng các k và thứ tự lớp, không kiểm từng `<lớp> <k>`**
  Người dùng thấy gì: Dòng tổng của lệnh kiểm tra chuyển gói chỉ được kiểm tổng số và thứ tự lớp, không kiểm số của từng lớp. Nếu bộ in hoán đổi số giữa các lớp thì người đọc thấy phân loại sai mà bộ kiểm vẫn xanh.
  file: `tests/dieu-phoi/on-dinh-r2.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (thiếu đối chứng dương ngay trong ca): DP8-06-do luon-nhan chạy bản tiêm mà không chạy bản lành trước**
  Người dùng thấy gì: Một phép thử bảo vệ lệnh ghi danh kết luận từ bản bị tiêm lỗi mà chưa chạy bản lành trên cùng điều kiện. Nếu bản lành vốn đã lệch thì phép thử vẫn xanh vì lý do sai, và người đọc không phân biệt được hai trường hợp.
  file: `tests/dieu-phoi/on-dinh-r2.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 (kết luận «không chặn» từ mã thoát 0, không có đối chứng): DP8-08 khoa-bo-roi và kiểm «không còn hang-viec.khoa» dùng tên khoá viết tay**
  Người dùng thấy gì: Phép thử khoá bị bỏ rơi chỉ chứng minh lệnh vẫn chạy, không chứng minh khoá cũ thật sự được dọn. Nếu tên khoá trong gói đổi, phép thử vẫn xanh trong khi khoá bỏ rơi không còn được dọn.
  file: `tests/dieu-phoi/on-dinh-r2.test.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).

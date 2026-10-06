# Review findings: eval-thay-boi-co-chung (round 1)

## Trong hợp đồng

- **Hình dạng 5: phép đếm ca của ma trận từ chối là hằng đúng, và ma trận không neo vào danh sách lý do trong lib**
  file: `tests/scripts/eval-thay-boi.test.mjs:264`
  severity: medium
  AC: AC-2
  source: measurement
  detail: Dòng 262–264: `soAssert += kiemHang(h)`, mà kiemHang (dòng 248–260) chỉ có hai đường: trả hằng `2` hoặc ném lỗi. Vì vậy `soAssert !== MA_TRAN.length * 2` không bao giờ đúng, và nhánh ĐỎ «số ca lệch» mà evals.yaml E2 hứa không bao giờ chạy được. T04 có cùng tật ở dòng 546–548 (`soHang++` mỗi vòng, rồi so với `MA_TRAN.length`). Mẫu P105 cần một con số viết TRƯỚC, nằm ngoài vòng lặp. Ở đây cả hai vế của phép so đều rút từ chính mảng MA_TRAN, nên xoá một hàng khỏi ma trận thì phép đo vẫn xanh. Ma trận cũng không được neo vào nguồn liệt kê thật: lib xuất `THAY_BOI_LY_DO` (evidence-core.cjs:513, export ở 1372) nhưng không ca nào đọc nó. Lib thêm điều kiện thứ mười, hoặc ma trận rơi mất một lý do, thì không có gì đỏ. Bằng chứng trôi đã có sẵn: evals.yaml E2 viết «Ma trận mười hai hàng», còn MA_TRAN có 17 hàng, và không phép so nào bắt được chỗ lệch này.
  Lý do vào hợp đồng: AC-2 đòi rõ «số assert bằng số hàng ma trận đếm lúc chạy, lệch thì ĐỎ số ca lệch»; phép so hiện tại luôn đúng nên nhánh đỏ này không bao giờ chạy được.

- **Hình dạng 4 (chiều đỏ không nằm trong bộ kiểm): evals.yaml E1/E3/E4/E5 hứa mutant mà tệp ca không chạy**
  file: `_acceptance/eval-thay-boi-co-chung/evals.yaml:24`
  severity: medium
  AC: AC-1
  source: measurement
  detail: Mỗi `expected` của E1, E3, E4, E5 đều khai một «Chiều đỏ: bản sao … → ĐỎ ghim «…»»: E1 là «ô thay bởi hợp lệ vẫn bị chặn», E3 là «bên gọi cũ bị nới lặng», E4 là «bản sao recheck không truyền gốc cây → ba bên trả phán quyết khác nhau», E5 là «bản sao lib đọc hồ sơ thay từ process.cwd() → đọc nhầm cây». Trong tests/scripts/eval-thay-boi.test.mjs, banSaoBoMay chỉ được gọi ở T02, T06, T07, T08, T09, T10 (dòng 302, 347, 375, 425, 451, 530). T01, T03, T04, T05 không dựng mutant nào. Bốn chuỗi kia có trong mã nhưng chỉ là thông điệp `fail(...)` của ca xanh, chưa lượt nào chứng rằng chúng thật sự bật đỏ. Người chấm đọc evals.yaml sẽ tin chiều đỏ đã chạy, trong khi suite không chạy nó. Đây là đúng lớp «màu xanh phải từng chạy chiều đỏ, phá thử tay không đếm». Ghi thêm cùng loại trôi: E4 viết «tám hàng của E2» trong khi T04 lặp 17 hàng, và nhắc «chân bảng bộ máy» mà T04 không có.
  Lý do vào hợp đồng: AC-1, AC-3, AC-4, AC-5 đều khai «Chiều đỏ: bản sao … → ĐỎ ghim …» làm phần của tiêu chí, mà các ca T01/T03/T04/T05 không dựng mutant nào để chứng nó bật đỏ.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Hồ sơ thay đã được thực tế đóng bị gọi nhầm tên lý do «chưa ký»; nhánh thực tế của «đã khép» không bao giờ chạy tới**
  Người dùng thấy gì: Khi hồ sơ thay thế đã được chính thực tế đóng lại, hệ thống vẫn chặn đúng nhưng báo nhầm lý do là «chưa ký». Người đọc có thể làm theo lời dặn sai (đi ký lại) thay vì hiểu hồ sơ đã khép.
  file: `lib/evidence-core.cjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4: đối chứng dương của ca «lib thiếu thư viện phụ» chạy trên lib gốc, không chạy trên bản sao đã tiêm**
  Người dùng thấy gì: Bài kiểm tra «thiếu một phần phụ thì vẫn bị chặn» có thể xanh cả khi bản thử đã hỏng vì lý do khác. Nghĩa là màu xanh ở ca này chưa chắc chứng minh đúng điều nó tuyên bố.
  file: `tests/scripts/eval-thay-boi.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 2: dòng sổ nghỉ của hồ sơ thay viết tay theo khuôn bên đọc, không rút từ khối NGHI-LINE-RECIPE**
  Người dùng thấy gì: Nếu cách ghi dòng «hồ sơ nghỉ» đổi khuôn sau này, hai bài kiểm tra ở đây vẫn có thể xanh mà không hay. Rủi ro nhỏ vì một bài kiểm tra khác đã canh đúng khuôn đó.
  file: `tests/scripts/eval-thay-boi.test.mjs`
  severity: low
  Đề xuất: wont-fix

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).

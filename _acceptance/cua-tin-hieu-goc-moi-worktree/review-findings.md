## Trong hợp đồng

- **GW-4 chỉ có đối chứng dương cho gui-tin-hieu, chưa có cho các lệnh còn lại như contract đòi**
  file: `tests/scripts/cua-tin-hieu-goc-moi-worktree.test.mjs:196`
  severity: low
  AC: AC-4
  source: bugs
  detail: AC-4 và E4 đòi đối chứng dương cho từng lệnh: «bộ máy gốc thoát 0 và đầu ra khác rỗng; thiếu → «đối chứng gốc không chạy: <lệnh>»». Ca4 chỉ kiểm `ten === 'gui-tin-hieu'` (vòng for có lọc tên đó) và `B[0][2].trim()`. Với --chua-gom, --rang, --duong, start-scan và nhịp phat-lich, ca chỉ so bằng nhau giữa bộ máy hiện tại và bộ máy gốc. Nếu cả hai cùng sập theo một cách (thiếu tệp trong git archive, thoát khác 0, stdout rỗng), phép so vẫn bằng và GW-4 vẫn xanh. Đây đúng là lớp «assertion âm-tính-một-mình» trong CLAUDE.md của kho. Đã đo: hôm nay bộ máy gốc thoát 0 và có đầu ra ở cả sáu lệnh, nên chưa có màu xanh giả nào thật sự xảy ra. Nhưng ca này không giữ được bất biến mà E4 tự khai.

- **Hình dạng 3 + 4: GW-6 chỉ kiểm danh sách khác rỗng, mà hàm đọc trả về một phần tử báo hỏng khi bộ đọc sập, nên ca vẫn xanh khi bộ đọc sập**
  file: `tests/scripts/cua-tin-hieu-goc-moi-worktree.test.mjs:224`
  severity: high
  AC: AC-6
  source: measurement
  detail: Dòng 224 viết `if (x.status !== 0 || jsonNguon(n).length !== 1 || !idsChuaGom(goc, n).length) sai.push(...)`. Khi --chua-gom thoát khác 0 hoặc in ra thứ không phải JSON, `idsChuaGom` (dòng 77) trả về `["<hỏng ${status}: ...>"]`. Mảng này có một phần tử nên `!...length` là false, và ca không ghi lỗi. Lời hứa của E6 là «--chua-gom chạy theo gốc ấy ... không sập». Đây là một QUAN HỆ: id mà bộ đọc liệt kê phải trùng tên tệp vừa ghi ở <gốc>/tin-hieu/kho/. Phép đo lại chỉ hỏi «có thứ gì đó». Đã thử bằng mutant trên bản sao: chèn `throw new Error('reader sập')` vào `docTinHieu` của scripts/tin-hieu.mjs. Với gốc không phải git, `--chua-gom` thoát 1 kèm stack trace, vậy mà `PASS: GW-6` vẫn in ra. GW-6 không có ca đỏ nào cho chân bộ đọc, nên chân «không sập» ở đây chưa từng phân biệt được chạy đúng với sập. Cách đo đúng là so `idsChuaGom(goc, n)` với `jsonNguon(n).map(f => f.slice(0, -5))`, chứ không kiểm `.length`.

- **Hình dạng 4: GW-2 so bằng nhau ở ba gốc nhưng không có đối chứng dương, nên --duong sập ở cả ba gốc vẫn ra PASS: GW-2**
  file: `tests/scripts/cua-tin-hieu-goc-moi-worktree.test.mjs:124`
  severity: medium
  AC: AC-2
  source: measurement
  detail: Hàm `so(...)` (dòng 121) chỉ đòi giá trị ở ba gốc giống nhau. `so('--duong', r => idsDuong(goc, r))` (dòng 124) không đòi tập id khác rỗng, cũng không đòi nó trùng `ids` của --chua-gom. Khi --duong hỏng, `idsDuong` trả `['<hỏng N>']` ở cả ba gốc, nên ba giá trị bằng nhau. Đã thử bằng mutant trên bản sao: thay lời gọi `duongDi(...)` ở nhánh --duong bằng `throw`. Kết quả vẫn là `PASS: GW-2`, `PASS: GW-2-do`, `PASS: GW-2-do2`. E2 hứa «--duong (tập id) ... ba gốc bằng nhau, tập id đúng bốn», nhưng chỉ chân --chua-gom có kiểm `ids.length !== 4`. Chân thẻ (dòng 132–133) cùng hình dạng: lỗi được thay bằng `['<thẻ không chạy>']`, và giá trị này ở ba gốc vẫn bằng nhau. Chân thẻ chỉ bị bắt gián tiếp nhờ GW-2-do2 cần thẻ chạy được. Chân `--rang` lọc các dòng chứa «nguồn»; ở bản lành, đầu ra thật không có dòng nào như vậy (đã chạy trên đồ thử giữ lại), nên chân này thực chất chỉ so mã thoát. Thiếu một phép kiểm trên bản lành rằng mỗi chân cho ra giá trị có nội dung, ví dụ idsDuong khớp ids và thẻ có dòng «Cửa tín hiệu: 4 ý».

- **Hình dạng 4: GW-4 chỉ có đối chứng dương cho gui-tin-hieu, trong khi E4 khai đối chứng cho từng lệnh**
  file: `tests/scripts/cua-tin-hieu-goc-moi-worktree.test.mjs:190`
  severity: medium
  AC: AC-4
  source: measurement
  detail: E4 trong evals.yaml (dòng 52–53) khai: «đối chứng dương trước (gốc thoát 0, đầu ra khác rỗng; thiếu → «đối chứng gốc không chạy: <lệnh>»)» cho các lệnh gui-tin-hieu, --chua-gom, --rang, --duong, start-scan. Mã thì làm khác. Dòng 190 duyệt mọi phần tử của B nhưng điều kiện có thêm `ten === 'gui-tin-hieu'`. Dòng 191 cũng chỉ kiểm `B[0][2]`, tức stdout của gui-tin-hieu. Bốn chân còn lại và nhịp phat-lich (dòng 196–198) chỉ so bằng nhau giữa bộ máy hiện tại và bộ máy gốc. Nếu đồ thử làm cả hai bên thoát cùng một lỗi với cùng thông điệp, ví dụ start-scan thoát khác 0 vì đồ thử thiếu thứ gì đó, thì phép so từng byte vẫn bằng và GW-4 vẫn xanh, không phân biệt được «không đổi hành vi» với «cả hai chưa chạy». Chuỗi ghim «đối chứng gốc không chạy: <lệnh>» chỉ có thể in ra với lệnh gui-tin-hieu.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **gocNguon treats any git top-level as a worktree and sends the signal folder into .git/modules (submodule) or outside every working tree (worktree of a bare repo)**
  Người dùng thấy gì: Với kho là submodule của kho khác, hoặc kho dựng theo kiểu bare, ý người gửi có thể bị cất vào thư mục ẩn của git hoặc ra ngoài kho, nên người dùng không thấy và dễ tưởng ý đã mất.
  Căn cứ: Chỉ vài bố cục kho hiếm gặp bị ảnh hưởng và ý không bị xoá, nhưng người dùng khó tự tìm lại; sửa cần thêm ca thử cho từng bố cục nên nên ghi hạn chế đã biết trước.
  file: `scripts/tin-hieu.mjs`
  severity: medium
  Đề xuất: known-limits

- **gui_tu compares a realpath against a path that may not be resolved, so it labels 'worktree' wrongly when --root goes through a symlink**
  Người dùng thấy gì: Khi gửi ý từ một thư mục đi qua đường dẫn tắt, ý có thể bị gắn nhãn là gửi từ worktree dù không có worktree nào, làm số đếm theo dõi cao hơn thực tế.
  Căn cứ: Chỉ làm lệch một con số theo dõi chứ không mất hay lạc ý, và lệnh thường dùng không bị ảnh hưởng; người dùng không bị chặn việc.
  file: `scripts/gui-tin-hieu.mjs`
  severity: low
  Đề xuất: known-limits

- **Gốc nguồn lấy thư mục cha của git-common-dir: với submodule, --separate-git-dir hoặc worktree tạo từ bare repo, ý bị ghi vào .git/modules hoặc ra ngoài kho, kể cả khi không có worktree nào**
  Người dùng thấy gì: Ở một số cách dựng kho không phổ biến, ý gửi vào cửa tín hiệu có thể rơi vào thư mục ẩn của git hoặc ra ngoài kho, kể cả khi người dùng chỉ làm việc ở thư mục chính.
  Căn cứ: Hậu quả là ý nằm sai chỗ chứ không bị xoá, chỉ gặp ở bố cục kho hiếm; dựng thêm ca thử cho các bố cục này là việc riêng nên ghi hạn chế đã biết.
  file: `scripts/tin-hieu.mjs`
  severity: medium
  Đề xuất: known-limits

- **noi_dung.gui_tu ghi nhầm 'worktree' khi đường gốc đi qua symlink và gocNguon rơi về path.resolve, làm sai số N của Đường đo**
  Người dùng thấy gì: Gửi ý qua đường dẫn tắt ở thư mục thường có thể làm tệp ý mang nhãn worktree sai, khiến phép đo sau phát hành báo sống khi chưa có ý nào thật từ worktree.
  Căn cứ: Không mất ý và không chặn việc, nhưng có thể làm kết luận sau phát hành lạc quan hơn thực tế; hiếm gặp và người đọc số có thể kiểm lại.
  file: `scripts/gui-tin-hieu.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).

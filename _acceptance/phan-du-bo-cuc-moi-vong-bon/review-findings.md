# Review findings: phan-du-bo-cuc-moi-vong-bon (round 1)

## Trong hợp đồng

- **Luật tĩnh --tinh bỏ qua tệp tests/ bị nhánh XOÁ: dùng --diff-filter=d nên nhánh xoá một tệp kiểm vẫn ra PASS**
  file:line: `_acceptance/phan-du-bo-cuc-moi-vong-bon/rang/giu-khoa-4.mjs:109`
  severity: low
  AC: AC-6
  source: bugs
  detail: AC-6 của hợp đồng (contract.md dòng 65-66) định nghĩa tập so là «tập tệp dưới tests/ mà CHÍNH nhánh đổi (`git diff <merge-base>..HEAD`)». Một tệp bị xoá cũng là tệp đã đổi. Nhưng `tepNhanhDoi` gọi `git diff --name-only --diff-filter=d mb h -- tests`, mà `d` chữ thường nghĩa là LOẠI các tệp bị xoá. Hệ quả: nếu nhánh xoá một tệp kiểm nằm ngoài TEP_VONG, tệp đó không có trong `doi`, nên `lechNhanh` không báo gì và «PASS: TINH nhánh — … = tệp vòng khai» vẫn in ra. --cu cũng không bắt được, vì nó chỉ đo các tệp trong TEP_VONG. Tức là ca bất lợi nhất (mất cả một tệp ca) lọt qua mà không có tín hiệu nào. Ca đổi tên cũng vậy: git diff mặc định dò đổi tên, nên tên cũ không hiện ra. Mã này chép nguyên từ vòng ba (giu-khoa-3.mjs dòng 174, `diffTests`), nên lỗ hổng có từ trước, nhưng nó nằm trong vật được giao của vòng này. Cách sửa: bỏ `--diff-filter=d` (hoặc dùng `--no-renames`), để tệp bị xoá hay đổi tên cũng vào tập so và lệch thì ra «FAIL: TINH <tệp>: nhánh sửa mà vòng không khai». Đã kiểm: --tinh, additive-only.test.mjs (10/10) và can-cu-s1.ca.mjs (52/52) đều xanh ở HEAD, nên đây không phải lỗi đang làm đỏ.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **paths của E2/E3/E5 bỏ sót phụ thuộc mới mà chính vòng này thêm, nên bằng chứng không hoá cũ khi vật nó đo thay đổi**
  Người dùng thấy gì: Nếu sau này ai đó sửa bộ dựng hai cây kiểm thử, một vài bằng chứng cũ vẫn bị coi là còn mới nên có thể không được chạy lại. Hôm nay mọi thứ vẫn xanh.
  Căn cứ: Chỉ ảnh hưởng khi có thay đổi sau này, không làm mất dữ liệu, và bằng chứng chạy lại tay là gỡ được ngay.
  file: `_acceptance/phan-du-bo-cuc-moi-vong-bon/evals.yaml`
  severity: medium
  Đề xuất: known-limits

- **Thước vòng bốn viết cứng đường gói lõi `plugins/acceptance-gate/...` thay vì đi qua bộ dịch bố cục**
  Người dùng thấy gì: Nếu tên hoặc chỗ đặt gói lõi đổi, thước báo lỗi chung chung thay vì lỗi có tên rõ ràng. Không có kết quả sai nào được báo xanh.
  Căn cứ: Hậu quả nhẹ (chỉ thông báo lỗi kém rõ), người dùng thấy đỏ rõ ràng chứ không bị xanh giả, sửa sau rẻ nhưng không cần gấp.
  file: `_acceptance/phan-du-bo-cuc-moi-vong-bon/rang/giu-khoa-4.mjs`
  severity: low
  Đề xuất: wont-fix

- **Bộ tự kiểm suy gốc kho bằng `new URL(import.meta.url).pathname` thay vì `fileURLToPath`**
  Người dùng thấy gì: Nếu kho nằm trong thư mục có dấu cách hoặc chữ có dấu, bộ tự kiểm sẽ báo đỏ oan. Với đường dẫn hiện tại thì không ảnh hưởng.
  Căn cứ: Chỉ gây đỏ oan ở một số đường dẫn, không mất dữ liệu, người dùng đổi chỗ đặt kho là qua.
  file: `_acceptance/phan-du-bo-cuc-moi-vong-bon/rang/giu-khoa-4.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 5 (tuyên quét lớp, ma trận thiếu phần tử): DV5qu chỉ đếm ở MỘT trong HAI tệp mà DON_NHA_DOI được áp**
  Người dùng thấy gì: Một dòng luật trùng chữ ở tệp thứ hai có thể được bỏ qua lặng lẽ mà phép kiểm vẫn xanh. Hiện chưa có dòng nào như vậy.
  Căn cứ: Là khả năng giả định, chưa xảy ra, không gây mất dữ liệu và người dùng thêm phép đếm cho tệp thứ hai là xong.
  file: `tests/scripts/additive-only.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 2 (fixture không cùng hình với đầu vào thật của bên đọc): ma trận DV5q-co chỉ đưa vế gốc dạng { thuMuc }, còn ca DV5 thật đưa { kho, ref }**
  Người dùng thấy gì: Nếu cách đọc bố cục từ lịch sử nhận nhầm kho mới thành phẳng, hai dòng luật có thể bị nới lặng mà ma trận vẫn xanh. Ca DV5 thật vẫn chạy bình thường.
  Căn cứ: Chỉ là khe hở trong phép kiểm, hiện chưa có lỗi thật, người dùng bổ sung ca sau mà không mất gì.
  file: `tests/scripts/additive-only.test.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).

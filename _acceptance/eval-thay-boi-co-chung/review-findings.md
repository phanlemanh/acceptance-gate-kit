# Review findings: eval-thay-boi-co-chung (round 2)

## Trong hợp đồng

- **Hình dạng 5 (thiếu ma trận toàn phần viết trước): «số assert đếm lúc chạy» là hằng 2 trả về, không đếm assert nào**
  file: `tests/scripts/eval-thay-boi.test.mjs:290`
  severity: medium
  AC: AC-2
  source: measurement
  detail: T02 làm `soAssert += kiemHang(h)` rồi so với `SO_HANG_TU_CHOI * 2` (dòng ~290-291). Nhưng kiemHang chỉ có hai lối ra: ném lỗi, hoặc `return 2` (literal ở cuối hàm). Nếu gỡ cả khối recheck khỏi kiemHang, hàm vẫn trả 2. Vậy vế trái không đếm assert nào đã chạy, và phép so rút về đúng `MA_TRAN.length === 17`, điều kiemMaTranKhop vốn đã kiểm. Lời hứa ở evals.yaml E2, «Số assert đếm lúc chạy = số hàng × 2 bên, lệch → ĐỎ «số ca lệch»», vẫn chưa có thước đo. Bản sửa chỉ đổi vế phải thành hằng, vế trái vẫn là số tự xưng. Ghi thêm: ma trận viết trước trong evals.yaml E2 (tệp đổi ở vòng này) nói «mười bảy hàng» nhưng chỉ liệt kê 12 mục. Năm hàng slug-thoat-goc, the-dinh-chu-E30, the-dinh-chu-slug, design-doc-vang, design-doc-ngoai-goc không có trong lời hứa. Văn bản cũng viết «Cộng một hàng NHẬN» trong khi SO_HANG_NHAN = 3 (thêm nhan-o-hop-dong và criterion-mang).
  Lý do vào hợp đồng: AC-2 hứa rõ «số assert bằng số hàng ma trận đếm lúc chạy, lệch thì ĐỎ số ca lệch», nhưng phép đếm chỉ cộng một hằng 2 nên không đếm assert nào đã chạy, lời hứa này chưa được đo thật.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **E2 expected text says seventeen rejection rows but still lists twelve and one acceptance row, while the test pins 17 and 3**
  Người dùng thấy gì: Bản mô tả bài kiểm tra ghi mười bảy hàng nhưng chỉ kể tên mười hai hàng, nên người đọc ở bước duyệt bằng chứng không biết năm hàng còn lại có thuộc phạm vi hay không. Việc ký không bị sai, chỉ khó đọc hơn.
  file: `_acceptance/eval-thay-boi-co-chung/evals.yaml`
  severity: medium
  Đề xuất: known-limits

- **New T01/T04/T05 mutant cases run the positive control on ROOT, never on the unmutated copy, so a broken copy turns red with the same pinned message**
  Người dùng thấy gì: Nếu sau này công cụ ghim lại đọc thêm một tệp mà bản sao thử nghiệm không có, các ca thử có thể báo đỏ vì thiếu tệp chứ không phải vì lỗi thật, và người xem sẽ tin nhầm là phép đo còn hoạt động. Hiện tại chưa xảy ra.
  file: `tests/scripts/eval-thay-boi.test.mjs`
  severity: low
  Đề xuất: known-limits

- **The matrix anchor checks a reason list that the lib never uses, so a tenth condition can be added without anything turning red**
  Người dùng thấy gì: Nếu có người thêm một lý do từ chối mới vào luật mà quên cập nhật danh sách đối chiếu, bộ kiểm vẫn xanh và lý do mới đó không có ca thử nào chạm tới. Luật nhận hồ sơ thay vẫn đúng với chín điều kiện hiện có.
  file: `tests/scripts/eval-thay-boi.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 1 (đo lời khai thay vì đầu ra): ma trận neo vào THAY_BOI_LY_DO, một hằng viết tay mà chungThayBoi không đọc**
  Người dùng thấy gì: Phép đối chiếu giữa bảng ca thử và luật chỉ so với một danh sách tự khai chứ không so với những lý do luật thật sự trả ra, nên một lý do mới thêm vào luật có thể lọt mà không ai bị báo đỏ. Chiều ngược lại cũng chưa được thử cho thấy bắt được.
  file: `tests/scripts/eval-thay-boi.test.mjs`
  severity: high
  Đề xuất: known-limits

- **Hình dạng 4 (chiều đỏ chưa được chứng): mutant T03 chỉ làm đỏ vế notRunConflicts, assert checkRepinEvals chưa từng bật đỏ**
  Người dùng thấy gì: Đường kiểm tra thứ hai của bên gọi cũ chưa từng được thử cho thấy nó báo đỏ khi bị nới. Nếu đường đó tự nới lỏng mà đường thứ nhất vẫn giữ nguyên thì bộ kiểm không phát hiện.
  file: `tests/scripts/eval-thay-boi.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 (thiếu đối chứng dương): T05 hứa «ba lệnh của K1 với cwd = K2 → nhận» nhưng chỉ đối chứng làn và recheck, bỏ pre-merge**
  Người dùng thấy gì: Chưa có ca chứng minh lưới kiểm trước khi gộp nhận đúng hồ sơ khi đọc đúng kho. Nếu lưới này luôn từ chối hồ sơ thay thì bộ kiểm hiện tại vẫn không phát hiện ra.
  file: `tests/scripts/eval-thay-boi.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hồ sơ thay đã được thực tế đóng bị gọi nhầm tên lý do «chưa ký»; nhánh thực tế của «đã khép» không bao giờ chạy tới (r1)**
  Người dùng thấy gì: Khi hồ sơ thay thế đã được chính thực tế đóng lại, hệ thống vẫn chặn đúng nhưng báo nhầm lý do là «chưa ký». Người đọc có thể làm theo lời dặn sai (đi ký lại) thay vì hiểu hồ sơ đã khép.
  file: `lib/evidence-core.cjs`
  severity: medium
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).

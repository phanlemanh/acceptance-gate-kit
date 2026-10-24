## Trong hợp đồng

- **Lối --pham-vi của ma-khong-co-trang thiếu đối chứng xanh mà AC-4 đòi rõ**
  file: tests/scripts/kho-tri-thuc-va-lint.test.mjs:171
  severity: medium
  AC: AC-4
  source: conventions
  detail: AC-4 ghi: «hàng ma-khong-co-trang chạy cả hai lối (--pham-vi và tự dò), mỗi lối có đối chứng xanh trước». Bất biến «assertion âm-tính-một-mình» trong CLAUDE.md của kit cũng đòi đối chứng dương trên cùng đầu vào. Ca KT-4 chỉ chạy kho lành không có `--pham-vi` (`lint(doiChung)`), tức là đối chứng cho lối tự dò. Không chỗ nào chạy kho lành với `--pham-vi docs/plans/pham-vi-tri-thuc-2410.md` rồi kiểm thoát 0. Một lỗi khiến nhánh `--pham-vi` luôn báo thiếu mã, hay luôn thoát 1, vẫn để hàng 8 xanh, miễn dòng lỗi đầu tiên trùng chữ. evals.yaml mục E4 cũng hứa «kho lành trước mỗi hàng thoát 0», nhưng mã chỉ có một đối chứng chung cho cả 11 hàng.

- **Hình dạng 5 (tuyên quét cả lớp nhưng chỉ có vài điểm): AC-3 hứa rút bốn khối của khuôn, ca KT-3 chỉ rút hai**
  file: tests/scripts/kho-tri-thuc-va-lint.test.mjs:37
  severity: medium
  AC: AC-3
  source: measurement
  detail: AC-3 viết: «rút bốn khối TRI-THUC-TRANG, TRI-THUC-RAW, TRI-THUC-CON-TRO, TRI-THUC-LUAT, dựng kho thử lành từ chính các khối ấy». E3 viết thêm: «bốn khối rút được (thiếu khối nào thì ca đỏ nêu tên khối)». Phía test chỉ gọi khoi('TRI-THUC-TRANG') (dòng 37) và khoi('TRI-THUC-RAW') (dòng 40). Không chỗ nào trong test rút TRI-THUC-CON-TRO hay TRI-THUC-LUAT, và không dựng TRI-THUC.md từ khối LUAT. Xoá khối TRI-THUC-LUAT khỏi khuôn thì KT-3 vẫn xanh, vì không bên nào đọc khối đó, nên lời hứa «thiếu khối nào thì ca đỏ nêu tên khối» không được đo. Giá trị loai của ba trang cũng viết tay (dòng 44-46: 'nen', 'chu-de', 'dot'), không rút từ khối TRI-THUC-LOAI, dù bộ đọc có nạp khối này (napKhuon). Ma trận bốn khối không được viết trước, và số khối được rút không bằng số khối đã hứa.

- **Hình dạng 4 (thiếu đối chứng dương): hàng mã-không-có-trang với --pham-vi không có lượt kho lành chạy trước**
  file: tests/scripts/kho-tri-thuc-va-lint.test.mjs:171
  severity: medium
  AC: AC-4
  source: measurement
  detail: AC-4 hứa hàng ma-khong-co-trang «chạy cả hai lối (--pham-vi và tự dò), mỗi lối có đối chứng xanh trước». Đối chứng duy nhất là dòng 171, `const x = lint(doiChung)`, chạy không có extra, nên chỉ phủ lối tự dò. Lối --pham-vi (HANG[7], dòng 146, extra ['--pham-vi', ...]) chỉ chạy trên kho đã gỡ A1. Không có lượt lint(khoTrongKho(), ['--pham-vi', 'docs/plans/pham-vi-tri-thuc-2410.md']) nào phải thoát 0. Một bộ đọc dưới --pham-vi luôn báo mã đầu tiên là thiếu vẫn qua hàng 8, và mutant 8 của KT-5 cũng không bắt được lỗi kiểu này. (Trùng với finding đầu tiên của mục này.)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Tệp nằm thẳng dưới raw/ lọt qua cả hai lần kiểm raw-bi-sua và raw-trong-kho-cong-khai**
  Người dùng thấy gì: Nếu ai đó bỏ nhầm một tệp tài liệu thô ngay ở thư mục gốc của vùng tài liệu thô, kiểm tra vẫn báo xanh, kể cả ở kho công khai. Tệp nhạy cảm có thể nằm đó mà không ai được báo.
  Căn cứ: Chỉ xảy ra khi người dùng đặt tệp sai chỗ so với khuôn, và người dùng tự phát hiện, di chuyển được sau đó; nhưng ở kho công khai thì hậu quả là lộ tài liệu nên nên ghi rõ là giới hạn đã biết.
  file: `scripts/tri-thuc.mjs`
  severity: high
  Đề xuất: known-limits

- **`nguon` và đường trỏ không bị giữ trong raw/ hay trong gốc tri thức: trang tự trích chính nó, hoặc trỏ ra ngoài bằng ../, vẫn xanh**
  Người dùng thấy gì: Một trang tri thức có thể ghi nguồn là chính nó hoặc là một tệp ngoài kho tri thức mà kiểm tra vẫn báo xanh. Người đọc tưởng trang đã có nguồn gốc thật nhưng thực ra không lần về được tài liệu thô.
  Căn cứ: Không làm mất hay lộ dữ liệu, người dùng thấy ngay khi mở nguồn và sửa lại được; chỉ làm kiểm tra yếu hơn lời hứa, nên ghi thành giới hạn đã biết.
  file: `scripts/tri-thuc.mjs`
  severity: medium
  Đề xuất: known-limits

- **Khối TRI-THUC-LOAI được bên đọc nạp mà không bao giờ dùng để kiểm**
  Người dùng thấy gì: Một trang ghi loại bậy bạ vẫn được kiểm tra cho qua. Người dùng có thể nghĩ loại trang đã được kiểm trong khi thật ra chưa.
  Căn cứ: Hậu quả nhẹ, chỉ là nhãn loại sai, không mất hay lộ dữ liệu và sửa tay dễ; nên ghi giới hạn đã biết.
  file: `scripts/tri-thuc.mjs`
  severity: low
  Đề xuất: known-limits

- **raw-trong-kho-cong-khai (and raw-bi-sua) ignore files placed directly under raw/; a public repo with raw/<file> lints green**
  Người dùng thấy gì: Ở kho công khai, một tệp thô đặt thẳng trong thư mục tài liệu thô không bị phát hiện và kiểm tra vẫn xanh. Tài liệu nhạy cảm có thể nằm trong kho công khai mà không có cảnh báo.
  Căn cứ: Chỉ xảy ra khi tệp đặt sai chỗ, người dùng tự di chuyển được; nhưng ở kho công khai thì có nguy cơ lộ tài liệu nên cần ghi rõ.
  file: `scripts/tri-thuc.mjs`
  severity: medium
  Đề xuất: known-limits

- **A wrong or missing in-repo `noi` folder lints green («0 trang, 0 raw, 0 lỗi», exit 0) instead of reporting an error**
  Người dùng thấy gì: Nếu khai sai tên thư mục tri thức trong kho, kiểm tra vẫn báo xanh với 0 trang, trông như một kho trống hợp lệ. Người dùng không biết là khai nhầm chỗ.
  Căn cứ: Không mất dữ liệu và tự sửa được khi thấy số trang bằng 0, nhưng dễ làm người ta yên tâm giả; nên ghi giới hạn đã biết.
  file: `scripts/tri-thuc.mjs`
  severity: medium
  Đề xuất: known-limits

- **nguon-khong-co accepts folders and paths outside the knowledge root**
  Người dùng thấy gì: Một trang có thể ghi nguồn là cả một thư mục hoặc một tệp nằm ngoài kho tri thức mà kiểm tra vẫn cho qua. Người đọc có thể tin vào nguồn không phải tài liệu thô thật.
  Căn cứ: Không mất hay lộ dữ liệu, lỗi lộ ra khi mở nguồn và sửa lại dễ; chỉ làm kiểm tra lỏng hơn lời hứa.
  file: `scripts/tri-thuc.mjs`
  severity: medium
  Đề xuất: known-limits

- **`--pham-vi` with no value silently switches to auto-detect, and a failed `git ls-files` silently skips the ma-khong-co-trang check**
  Người dùng thấy gì: Gõ thiếu đường dẫn sau cờ phạm vi thì kiểm tra lặng lẽ chạy một kiểu khác và vẫn báo xanh. Người dùng tưởng đã kiểm đúng bản phạm vi mình chỉ định.
  Căn cứ: Chỉ gặp khi gõ lệnh thiếu, chạy lại là xong và không mất dữ liệu; hậu quả nhẹ.
  file: `scripts/tri-thuc.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 2 (fixture viết tay đúng khuôn bên đọc): đường trỏ của KT-2, KT-6 và KT-7 ghép tay theo regex của bên đọc**
  Người dùng thấy gì: Đường trỏ trong bài kiểm được viết tay chứ không sinh từ khuôn. Nếu khuôn mô tả đường trỏ khác đi, bài kiểm có thể không phát hiện.
  Căn cứ: Chỉ làm bài kiểm kém nhạy hơn, không ảnh hưởng dữ liệu người dùng và bổ sung sau rẻ.
  file: `tests/scripts/kho-tri-thuc-va-lint.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 (assert âm tính một mình): mutant của KT-2 chỉ đo «khác đi», không đối chứng bản sao chưa tiêm, không ghim thông điệp**
  Người dùng thấy gì: Bài kiểm đo xem bản tiêm lỗi có làm kết quả khác đi hay không, nhưng chưa chứng minh là khác đúng vì lý do mong muốn. Bản sao hỏng vì lý do khác cũng có thể bị tính là đã bắt được lỗi.
  Căn cứ: Chỉ làm bài kiểm kém chặt, không ảnh hưởng người dùng sản phẩm và siết lại sau rẻ.
  file: `tests/scripts/kho-tri-thuc-va-lint.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (assert âm tính một mình): mutant của KT-8 chỉ đo «đầu ra khác», không ghim thông điệp**
  Người dùng thấy gì: Bài kiểm chỉ biết đầu ra của bản tiêm lỗi khác đi, chưa chứng minh nó khác vì nạp nhầm mô-đun tri thức. Một lỗi khác cũng có thể được tính là bắt được.
  Căn cứ: Chỉ làm bài kiểm kém chặt, không ảnh hưởng người dùng sản phẩm và đã có đối chứng dương nên mức thấp.
  file: `tests/scripts/kho-tri-thuc-va-lint.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Gần hình dạng 6 (đo cây kit đang sống thay vì đầu vào dựng riêng): KT-8 đang đỏ vì PRODUCT-MAP.md của cây đã cũ, không phải vì vi phạm AC-8**
  Người dùng thấy gì: Một bài kiểm đang đỏ vì trang tổng hợp do máy vẽ chưa được vẽ lại, không phải vì tính năng sai. Bài kiểm này sẽ đỏ lại mỗi khi hồ sơ đổi mà chưa vẽ lại trang.
  Căn cứ: Không ảnh hưởng người dùng và hết đỏ sau khi vẽ lại trang; chỉ gây nhiễu cho người đọc kết quả chấm.
  file: `tests/scripts/kho-tri-thuc-va-lint.test.mjs`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).

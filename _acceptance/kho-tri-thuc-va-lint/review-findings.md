# Review findings: kho-tri-thuc-va-lint (round 2)

## Trong hợp đồng

(không có finding nào map được vào AC ở round này)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Kiểm tra «kho lành trước mỗi hàng» của KT-4 không gắn với từng hàng: lượt kiểm từ KT-2 và KT-3 cũng được tính**
  Người dùng thấy gì: Bộ kiểm có thể vẫn báo xanh dù một vài hàng lỗi đã không được chạy thử trên kho lành trước đó, nên một hàng thiếu đối chứng có thể lọt mà không ai biết. Người dùng kho tri thức không thấy lỗi trực tiếp, chỉ mất một phần độ tin cậy của phép đo.
  Căn cứ: Hậu quả nhẹ: chỉ làm lưới kiểm lỏng hơn đã hứa ở một điểm phụ, không làm mất hay lộ dữ liệu; sửa về sau rẻ và ghi thành giới hạn đã biết là đủ.
  file: `tests/scripts/kho-tri-thuc-va-lint.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Kiểm tra «khuôn không có» ở KT-3 không bao giờ đỏ được**
  Người dùng thấy gì: Một dòng kiểm thừa không bao giờ chạy tới, nhưng nếu khuôn mất thì cả bộ kiểm vẫn báo lỗi bằng đường khác. Người dùng không bị ảnh hưởng gì.
  Căn cứ: Không có hậu quả với người dùng vì tình huống này vẫn bị chặn bởi đường khác, còn dọn dòng thừa không đáng công.
  file: `tests/scripts/kho-tri-thuc-va-lint.test.mjs`
  severity: low
  Đề xuất: wont-fix

- **Chiều đỏ mới của KT-3 cho bốn khối chỉ thử chính hàm rút của bài test, không thử bộ đọc của sản phẩm; kiểm TRI-THUC.md chỉ so ra-vào cùng một nguồn**
  Người dùng thấy gì: Nếu ai làm mất một khối trong khuôn tri thức, bài kiểm có thể không chứng minh được công cụ kiểm tra thật sự phát hiện ra. Người dùng có thể tin vào một dòng báo cáo mạnh hơn điều nó thật sự chứng minh.
  Căn cứ: Hậu quả nhẹ và không mất dữ liệu: chỉ là một dòng chứng cứ phụ nói quá, việc cốt lõi của tiêu chí vẫn được kiểm bằng ca khác.
  file: `tests/scripts/kho-tri-thuc-va-lint.test.mjs`
  severity: low
  Đề xuất: known-limits

- **KT-3's remove-each-block loop can never fail, so it proves nothing about the product**
  Người dùng thấy gì: Bộ kiểm in ra dòng nghe như đã chứng minh công cụ phát hiện khi khuôn thiếu một khối, nhưng thực ra chưa chứng minh. Người đọc báo cáo có thể hiểu nhầm mức bảo đảm.
  Căn cứ: Chỉ là chứng cứ phụ nói quá chứ không làm hỏng hành vi nào cho người dùng; ghi giới hạn để người đọc không tin quá mức là đủ.
  file: `tests/scripts/kho-tri-thuc-va-lint.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Template reads and fixture builds at the top level crash the whole file and skip the per-case FAIL reporting**
  Người dùng thấy gì: Khi khuôn bị hỏng, bộ kiểm có thể dừng đột ngột và không nói rõ ca nào đỏ, các ca sau bị bỏ qua và để lại thư mục tạm. Người sửa phải đọc lỗi thô để tìm nguyên nhân.
  Căn cứ: Chỉ làm báo lỗi kém rõ chứ không cho kết quả xanh sai và không mất dữ liệu; người sửa vẫn thấy bộ kiểm đỏ nên không bị lừa.
  file: `tests/scripts/kho-tri-thuc-va-lint.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 2 (không round-trip từ bên ghi sang bên đọc): KT-3 so tệp TRI-THUC.md do chính test ghi với khối TRI-THUC-LUAT mà test vừa rút**
  Người dùng thấy gì: Tệp quy tắc của kho tri thức có thể bị mất hoặc sai nội dung mà công cụ kiểm vẫn báo kho lành. Người dùng sẽ không được cảnh báo về tệp ấy.
  Căn cứ: Hậu quả nhẹ vì không công cụ nào đang dựa vào tệp này; thêm phép đọc cho nó là việc của một vòng sau, ghi giới hạn là đủ.
  file: `tests/scripts/kho-tri-thuc-va-lint.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 1 (đo chỉ dẫn thay vì đầu ra): vòng «gỡ từng khối» của KT-3 và lần kiểm RE_CON_TRO của KT-7 chạy bộ rút khối của chính test, không chạy bộ đọc của sản phẩm**
  Người dùng thấy gì: Chưa có bằng chứng là công cụ báo đúng tên khối khi khuôn thiếu khối, và cách đọc đường trỏ chưa được thử bằng cách sửa khuôn. Người dùng có thể gặp thông báo khác với điều bộ kiểm hứa.
  Căn cứ: Không mất hay lộ dữ liệu và người dùng tự thấy lỗi khi khuôn hỏng; chỉ là độ phủ chứng cứ mỏng hơn đã định, ghi giới hạn là hợp lý.
  file: `tests/scripts/kho-tri-thuc-va-lint.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 (tuyên quét cả lớp nhưng số đếm không khớp số hàng): mảng LANH gom chung mọi kho lành, nên không đo được «kho lành trước MỖI hàng»**
  Người dùng thấy gì: Bộ kiểm đếm tổng số lần chạy thử kho lành chứ không gắn từng lần với từng hàng, và với một hàng thì phép thử lành chạy trên đầu vào hơi khác. Người dùng có thể tin một hàng đã có đối chứng khi chưa chắc.
  Căn cứ: Hậu quả nhẹ vì đối chứng cho lối đó vẫn có chạy ở chỗ khác và không ảnh hưởng dữ liệu; sửa sau rẻ, ghi giới hạn là đủ.
  file: `tests/scripts/kho-tri-thuc-va-lint.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Tệp nằm thẳng dưới raw/ lọt qua cả hai lần kiểm raw-bi-sua và raw-trong-kho-cong-khai (r1)**
  Người dùng thấy gì: Nếu ai đó bỏ nhầm một tệp tài liệu thô ngay ở thư mục gốc của vùng tài liệu thô, kiểm tra vẫn báo xanh, kể cả ở kho công khai. Tệp nhạy cảm có thể nằm đó mà không ai được báo.
  Căn cứ: Chỉ xảy ra khi người dùng đặt tệp sai chỗ so với khuôn, và người dùng tự phát hiện, di chuyển được sau đó; nhưng ở kho công khai thì hậu quả là lộ tài liệu nên nên ghi rõ là giới hạn đã biết.
  file: `scripts/tri-thuc.mjs`
  severity: high
  Đề xuất: known-limits

- **`nguon` và đường trỏ không bị giữ trong raw/ hay trong gốc tri thức: trang tự trích chính nó, hoặc trỏ ra ngoài bằng ../, vẫn xanh (r1)**
  Người dùng thấy gì: Một trang tri thức có thể ghi nguồn là chính nó hoặc là một tệp ngoài kho tri thức mà kiểm tra vẫn báo xanh. Người đọc tưởng trang đã có nguồn gốc thật nhưng thực ra không lần về được tài liệu thô.
  Căn cứ: Không làm mất hay lộ dữ liệu, người dùng thấy ngay khi mở nguồn và sửa lại được; chỉ làm kiểm tra yếu hơn lời hứa, nên ghi thành giới hạn đã biết.
  file: `scripts/tri-thuc.mjs`
  severity: medium
  Đề xuất: known-limits

- **Khối TRI-THUC-LOAI được bên đọc nạp mà không bao giờ dùng để kiểm (r1)**
  Người dùng thấy gì: Một trang ghi loại bậy bạ vẫn được kiểm tra cho qua. Người dùng có thể nghĩ loại trang đã được kiểm trong khi thật ra chưa.
  Căn cứ: Hậu quả nhẹ, chỉ là nhãn loại sai, không mất hay lộ dữ liệu và sửa tay dễ; nên ghi giới hạn đã biết.
  file: `scripts/tri-thuc.mjs`
  severity: low
  Đề xuất: known-limits

- **raw-trong-kho-cong-khai (and raw-bi-sua) ignore files placed directly under raw/; a public repo with raw/<file> lints green (r1)**
  Người dùng thấy gì: Ở kho công khai, một tệp thô đặt thẳng trong thư mục tài liệu thô không bị phát hiện và kiểm tra vẫn xanh. Tài liệu nhạy cảm có thể nằm trong kho công khai mà không có cảnh báo.
  Căn cứ: Chỉ xảy ra khi tệp đặt sai chỗ, người dùng tự di chuyển được; nhưng ở kho công khai thì có nguy cơ lộ tài liệu nên cần ghi rõ.
  file: `scripts/tri-thuc.mjs`
  severity: medium
  Đề xuất: known-limits

- **A wrong or missing in-repo `noi` folder lints green («0 trang, 0 raw, 0 lỗi», exit 0) instead of reporting an error (r1)**
  Người dùng thấy gì: Nếu khai sai tên thư mục tri thức trong kho, kiểm tra vẫn báo xanh với 0 trang, trông như một kho trống hợp lệ. Người dùng không biết là khai nhầm chỗ.
  Căn cứ: Không mất dữ liệu và tự sửa được khi thấy số trang bằng 0, nhưng dễ làm người ta yên tâm giả; nên ghi giới hạn đã biết.
  file: `scripts/tri-thuc.mjs`
  severity: medium
  Đề xuất: known-limits

- **nguon-khong-co accepts folders and paths outside the knowledge root (r1)**
  Người dùng thấy gì: Một trang có thể ghi nguồn là cả một thư mục hoặc một tệp nằm ngoài kho tri thức mà kiểm tra vẫn cho qua. Người đọc có thể tin vào nguồn không phải tài liệu thô thật.
  Căn cứ: Không mất hay lộ dữ liệu, lỗi lộ ra khi mở nguồn và sửa lại dễ; chỉ làm kiểm tra lỏng hơn lời hứa.
  file: `scripts/tri-thuc.mjs`
  severity: medium
  Đề xuất: known-limits

- **`--pham-vi` with no value silently switches to auto-detect, and a failed `git ls-files` silently skips the ma-khong-co-trang check (r1)**
  Người dùng thấy gì: Gõ thiếu đường dẫn sau cờ phạm vi thì kiểm tra lặng lẽ chạy một kiểu khác và vẫn báo xanh. Người dùng tưởng đã kiểm đúng bản phạm vi mình chỉ định.
  Căn cứ: Chỉ gặp khi gõ lệnh thiếu, chạy lại là xong và không mất dữ liệu; hậu quả nhẹ.
  file: `scripts/tri-thuc.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 2 (fixture viết tay đúng khuôn bên đọc): đường trỏ của KT-2, KT-6 và KT-7 ghép tay theo regex của bên đọc (r1 · tệp đã đổi)**
  Người dùng thấy gì: Đường trỏ trong bài kiểm được viết tay chứ không sinh từ khuôn. Nếu khuôn mô tả đường trỏ khác đi, bài kiểm có thể không phát hiện.
  Căn cứ: Chỉ làm bài kiểm kém nhạy hơn, không ảnh hưởng dữ liệu người dùng và bổ sung sau rẻ.
  file: `tests/scripts/kho-tri-thuc-va-lint.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 (assert âm tính một mình): mutant của KT-2 chỉ đo «khác đi», không đối chứng bản sao chưa tiêm, không ghim thông điệp (r1 · tệp đã đổi)**
  Người dùng thấy gì: Bài kiểm đo xem bản tiêm lỗi có làm kết quả khác đi hay không, nhưng chưa chứng minh là khác đúng vì lý do mong muốn. Bản sao hỏng vì lý do khác cũng có thể bị tính là đã bắt được lỗi.
  Căn cứ: Chỉ làm bài kiểm kém chặt, không ảnh hưởng người dùng sản phẩm và siết lại sau rẻ.
  file: `tests/scripts/kho-tri-thuc-va-lint.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (assert âm tính một mình): mutant của KT-8 chỉ đo «đầu ra khác», không ghim thông điệp (r1 · tệp đã đổi)**
  Người dùng thấy gì: Bài kiểm chỉ biết đầu ra của bản tiêm lỗi khác đi, chưa chứng minh nó khác vì nạp nhầm mô-đun tri thức. Một lỗi khác cũng có thể được tính là bắt được.
  Căn cứ: Chỉ làm bài kiểm kém chặt, không ảnh hưởng người dùng sản phẩm và đã có đối chứng dương nên mức thấp.
  file: `tests/scripts/kho-tri-thuc-va-lint.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Gần hình dạng 6 (đo cây kit đang sống thay vì đầu vào dựng riêng): KT-8 đang đỏ vì PRODUCT-MAP.md của cây đã cũ, không phải vì vi phạm AC-8 (r1 · tệp đã đổi)**
  Người dùng thấy gì: Một bài kiểm đang đỏ vì trang tổng hợp do máy vẽ chưa được vẽ lại, không phải vì tính năng sai. Bài kiểm này sẽ đỏ lại mỗi khi hồ sơ đổi mà chưa vẽ lại trang.
  Căn cứ: Không ảnh hưởng người dùng và hết đỏ sau khi vẽ lại trang; chỉ gây nhiễu cho người đọc kết quả chấm.
  file: `tests/scripts/kho-tri-thuc-va-lint.test.mjs`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).

## Trong hợp đồng

- **Hình dạng 5 (ma trận lớp, mẫu P105): chốt «ma trận hụt» của BN-4 luôn đúng, không bao giờ đỏ được**
  file: tests/scripts/bang-ngoai-n.test.mjs:310
  severity: medium
  AC: AC-4
  source: measurement
  detail: kiemBN4 tăng `soO++` bên trong `o.thuTu.forEach(...)` (dòng 304), rồi so với `tong = MA_TRAN.reduce((s, o) => s + o.thuTu.length, 0)` (dòng 310–311). Hai vế đếm cùng một mảng `o.thuTu`, nên `soO === tong` luôn đúng ngay từ cách viết. Nhánh «ma trận hụt» vì thế là mã chết, và dòng in `so o: <n>` (BN-4, dòng 316) không đo được gì. Thế nhưng evals.yaml E4 hứa: «n bằng tổng số phần tử ma trận (khác → FAIL «ma trận hụt»)». Mẫu P105 cần đếm từ phía ĐƯỢC ĐO (số hàng hay số ô thẻ thật in ra) rồi đối chiếu với số phần tử viết trước. Ở đây con số được đếm lại từ chính ma trận kỳ vọng, nên lời hứa «quét toàn phần» không có răng. Vế còn sống là `thuTu.length !== o.thuTu.length` ở dòng 305, nhưng đó không phải phép đếm ma trận mà eval nói tới.
  rationale: AC-4 ghi rõ «số ô so = số phần tử ma trận (khác → ĐỎ «ma trận hụt»)» và finding chỉ ra phép so này đếm cùng một mảng nên không thể đỏ, làm vế ấy của AC-4 mất răng.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Khoá `can_cu` / chữ «Căn cứ» đã có nghĩa riêng trong CONTEXT.md, vòng này dùng lại cùng tên cho một trường khác hình, khác nghĩa**
  Người dùng thấy gì: Hai chỗ trong bộ công cụ dùng cùng chữ «căn cứ» cho hai thứ khác nhau. Hôm nay chưa gây sai gì cho người dùng, nhưng người viết hướng dẫn sau này có thể lẫn hai nghĩa.
  Căn cứ: Chỉ là chuyện đặt tên, người dùng không mất dữ liệu và không thấy lỗi nào; sửa sau vẫn rẻ vì hai nơi dùng hai tệp riêng.
  file: `lib/out-of-contract.cjs`
  severity: medium
  Đề xuất: known-limits

- **BN-1-do không có đối chứng dương trong ca, trái luật đầu tệp và khác các ca -do còn lại**
  Người dùng thấy gì: Một bài kiểm bên trong kho kit khi chạy riêng lẻ có thể báo đỏ vì lý do khác với lý do nó định bắt. Người dùng thẻ không bị ảnh hưởng.
  Căn cứ: Chỉ ảnh hưởng người bảo trì kit khi chạy riêng một ca; chạy trọn bộ thì ca khác đã làm đối chứng, và không có dữ liệu nào của người dùng bị chạm.
  file: `tests/scripts/bang-ngoai-n.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Executor `bang_ngoai_n` in nhiều dòng PASS nhưng lượt chấm chỉ giữ 3 dòng cuối của lệnh xanh, nên các dòng «PASS: BN-…» mà E1–E5 ghim không lên tới bằng chứng**
  Người dùng thấy gì: Hồ sơ bằng chứng của vòng này chỉ giữ vài dòng cuối, nên người đọc có thể không thấy từng dòng kết quả chi tiết. Kết quả xanh vẫn đúng, chỉ là khó đối chiếu hơn.
  Căn cứ: Không ảnh hưởng người dùng cuối, chỉ làm bằng chứng kém chi tiết; sửa sau rẻ bằng cách gộp dòng như các khoá cùng loại.
  file: `_acceptance/config.yaml`
  severity: low
  Đề xuất: known-limits

- **Cờ vàng thiếu căn cứ luôn đổ cho «bản kit cũ», nên một lỗi của bản mới cũng bị đọc thành hồ sơ cũ**
  Người dùng thấy gì: Khi bước phân loại quên viết căn cứ, thẻ vẫn bảo người ký rằng hồ sơ do bản cũ chấm. Người ký có thể không đi tìm lỗi thật và vẫn thấy ô «chưa có căn cứ».
  Căn cứ: Hậu quả nhẹ: người ký vẫn thấy rõ mục thiếu căn cứ và quyết được, chỉ lời giải thích nguyên nhân có thể sai; không mất dữ liệu và sửa sau rẻ.
  file: `scripts/gate-card.js`
  severity: medium
  Đề xuất: known-limits

- **Màn hẹp: quy tắc td:first-child{width:84px} thắng width:auto trong @media, hàng tiêu đề nhóm và ô Mục bị ép còn khoảng 100 px**
  Người dùng thấy gì: Trên điện thoại màn hẹp, nhãn nhóm như «Cần anh quyết» bị bẻ thành nhiều dòng ngắn nên khó đọc hơn. Thẻ vẫn dùng được, không cuộn ngang.
  Căn cứ: Chỉ là thẩm mỹ trên màn hẹp, người dùng tải lại hay đổi màn hình không mất gì, và sửa sau rất rẻ.
  file: `scripts/gate-card.js`
  severity: low
  Đề xuất: known-limits

- **Mô tả E2 trong evals.yaml lệch với ca BN-2 thật: ghi proposal known-limits, nhưng ca dùng new-contract**
  Người dùng thấy gì: Lời mô tả bằng chứng của một bài kiểm nói một kịch bản hơi khác kịch bản đã chạy. Người dùng không thấy gì khác, chỉ người đối chiếu hồ sơ có thể bối rối.
  Căn cứ: Chỉ sai lời mô tả, kết quả kiểm vẫn đúng và không ảnh hưởng người dùng; sửa được bất cứ lúc nào bằng một dòng chữ.
  file: `_acceptance/bang-ngoai-n-co-can-cu/evals.yaml`
  severity: low
  Đề xuất: wont-fix

- **Hình dạng 4 (âm-tính-một-mình): vế cờ «mục chưa có căn cứ» trên thẻ REJECT của BN-3 không thể đỏ**
  Người dùng thấy gì: Một phép kiểm phụ cho thẻ hồ sơ bị từ chối luôn xanh, nên nếu sau này thẻ ấy in sai cờ thì có thể không ai biết. Hiện thẻ vẫn đúng.
  Căn cứ: Hiện không có lỗi nào người dùng thấy; rủi ro chỉ là bỏ sót lỗi tương lai ở thẻ từ chối, và sửa rẻ bằng cách thêm một hồ sơ thử.
  file: `tests/scripts/bang-ngoai-n.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 (thiếu đối chứng dương trong ca đỏ): BN-1-do không cho bản lành xanh trên cùng fixture trước khi tin chiều đỏ**
  Người dùng thấy gì: Một bài kiểm bên trong kit có thể xanh mà không chứng minh được nó thật sự bắt đúng lỗi khi chạy riêng. Người dùng thẻ không thấy khác biệt nào.
  Căn cứ: Chỉ làm bài kiểm nội bộ kém chặt khi chạy riêng, chạy trọn bộ thì đã có đối chứng; không chạm dữ liệu người dùng và sửa sau rẻ.
  file: `tests/scripts/bang-ngoai-n.test.mjs`
  severity: low
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 2/9 lỗi rơi vào file không bộ đo nào phủ (_acceptance/config.yaml, _acceptance/bang-ngoai-n-co-can-cu/evals.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.

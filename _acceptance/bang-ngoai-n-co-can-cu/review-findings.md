## Trong hợp đồng

- **Hình dạng 5 (ma trận toàn phần, mẫu P105) — BN-4 bỏ chốt số hàng TỪNG hồ sơ, chỉ còn so TỔNG gộp ba hồ sơ, nên lỗi ở hai hồ sơ có thể bù trừ nhau**
  AC: AC-4
  file: `tests/scripts/bang-ngoai-n.test.mjs:306`
  severity: low
  source: measurement
  detail: Bản sửa S4-r1 (finding t7) đã đếm `soO += thuTu.length` từ phía được đo, đúng hướng. Nhưng cùng lượt đó nó XOÁ chốt cũ `if (thuTu.length !== o.thuTu.length) loi.push(...)` của từng hồ sơ. Giờ chỉ còn `if (soO !== tong)` ở dòng 313, và `tong` cộng gộp cả ba hồ sơ A/B/C. Trong khi đó vòng so thứ tự ở dòng 307 chỉ duyệt `o.thuTu.forEach` và bỏ qua `thuTu[i] === undefined`, nên có hai lỗ: (1) một hồ sơ in THỪA hàng ở đuôi thì không có assert nào nhìn vào hàng đó; (2) một hồ sơ in THIẾU hàng cuối thì không bị bắt theo hồ sơ. Ví dụ: A in 6 hàng (thừa một hàng lặp ở đuôi) còn C in 0 hàng. Khi đó soO = 6 + 3 + 0 = 9 = tong, và cả ba phép so thứ tự đều xanh. Lời hứa của AC-4 là quan hệ trên TỪNG hồ sơ (số hàng của hồ sơ = số phần tử viết trước của chính nó), nhưng phép đo hiện chỉ giữ một tổng. Mutant «bỏ hàng mục cuối» ở dòng 330 vẫn đỏ vì nó làm hụt ở cả ba hồ sơ cùng chiều, nên không phát hiện được lỗ bù trừ này. Một ca phải có hai lỗi đồng thời mới lọt, vì vậy để mức low.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Sửa bằng chứng của hồ sơ đã ký khoi-viec-cua-anh mà không ghi dòng revisit vào decisions.jsonl của chính hồ sơ đó**
  Người dùng thấy gì: Thẻ Cổng 2 của một hồ sơ đã ký nay có bố cục khác bản người ký đã đọc, nhưng sổ của hồ sơ đó không ghi vì sao. Người đọc lại hồ sơ sau này sẽ không biết thẻ đã được sinh lại.
  Căn cứ: Chỉ là thiếu một dòng ghi chú trong sổ, nội dung thẻ vẫn đúng và không mất dữ liệu; thêm dòng ghi chú sau này rất rẻ nên ghi thành hạn chế đã biết là đủ.
  file: `_acceptance/khoi-viec-cua-anh/evidence/p186-card-gate2.html`
  severity: medium
  Đề xuất: known-limits

- **Thông điệp PASS của LC6 vẫn nói «từng byte» trong khi phép so nay bỏ qua các dòng CSS .ngoai**
  Người dùng thấy gì: Dòng báo xanh của một bài kiểm nói bằng nhau từng byte trong khi thực tế bỏ qua vài dòng giao diện đã khai. Người đọc nhật ký có thể tin phép kiểm chặt hơn thực tế.
  Căn cứ: Không ảnh hưởng người dùng sản phẩm, chỉ làm người bảo trì hiểu hơi lệch về độ chặt của một phép kiểm; sửa lại câu chữ sau rất rẻ.
  file: `tests/scripts/cay-doi-trong-luot.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Khoá `can_cu` / chữ «Căn cứ» đã có nghĩa riêng trong CONTEXT.md, vòng này dùng lại cùng tên cho một trường khác hình, khác nghĩa (r1)**
  Người dùng thấy gì: Hai chỗ trong bộ công cụ dùng cùng chữ «căn cứ» cho hai thứ khác nhau. Hôm nay chưa gây sai gì cho người dùng, nhưng người viết hướng dẫn sau này có thể lẫn hai nghĩa.
  Căn cứ: Chỉ là chuyện đặt tên, người dùng không mất dữ liệu và không thấy lỗi nào; sửa sau vẫn rẻ vì hai nơi dùng hai tệp riêng.
  file: `lib/out-of-contract.cjs`
  severity: medium
  Đề xuất: known-limits

- **BN-1-do không có đối chứng dương trong ca, trái luật đầu tệp và khác các ca -do còn lại (r1 · tệp đã đổi)**
  Người dùng thấy gì: Một bài kiểm bên trong kho kit khi chạy riêng lẻ có thể báo đỏ vì lý do khác với lý do nó định bắt. Người dùng thẻ không bị ảnh hưởng.
  Căn cứ: Chỉ ảnh hưởng người bảo trì kit khi chạy riêng một ca; chạy trọn bộ thì ca khác đã làm đối chứng, và không có dữ liệu nào của người dùng bị chạm.
  file: `tests/scripts/bang-ngoai-n.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Executor `bang_ngoai_n` in nhiều dòng PASS nhưng lượt chấm chỉ giữ 3 dòng cuối của lệnh xanh, nên các dòng «PASS: BN-…» mà E1–E5 ghim không lên tới bằng chứng (r1 · tệp đã đổi)**
  Người dùng thấy gì: Hồ sơ bằng chứng của vòng này chỉ giữ vài dòng cuối, nên người đọc có thể không thấy từng dòng kết quả chi tiết. Kết quả xanh vẫn đúng, chỉ là khó đối chiếu hơn.
  Căn cứ: Không ảnh hưởng người dùng cuối, chỉ làm bằng chứng kém chi tiết; sửa sau rẻ bằng cách gộp dòng như các khoá cùng loại.
  file: `_acceptance/config.yaml`
  severity: low
  Đề xuất: known-limits

- **Cờ vàng thiếu căn cứ luôn đổ cho «bản kit cũ», nên một lỗi của bản mới cũng bị đọc thành hồ sơ cũ (r1 · tệp đã đổi)**
  Người dùng thấy gì: Khi bước phân loại quên viết căn cứ, thẻ vẫn bảo người ký rằng hồ sơ do bản cũ chấm. Người ký có thể không đi tìm lỗi thật và vẫn thấy ô «chưa có căn cứ».
  Căn cứ: Hậu quả nhẹ: người ký vẫn thấy rõ mục thiếu căn cứ và quyết được, chỉ lời giải thích nguyên nhân có thể sai; không mất dữ liệu và sửa sau rẻ.
  file: `scripts/gate-card.js`
  severity: medium
  Đề xuất: known-limits

- **Màn hẹp: quy tắc td:first-child{width:84px} thắng width:auto trong @media, hàng tiêu đề nhóm và ô Mục bị ép còn khoảng 100 px (r1 · tệp đã đổi)**
  Người dùng thấy gì: Trên điện thoại màn hẹp, nhãn nhóm như «Cần anh quyết» bị bẻ thành nhiều dòng ngắn nên khó đọc hơn. Thẻ vẫn dùng được, không cuộn ngang.
  Căn cứ: Chỉ là thẩm mỹ trên màn hẹp, người dùng tải lại hay đổi màn hình không mất gì, và sửa sau rất rẻ.
  file: `scripts/gate-card.js`
  severity: low
  Đề xuất: known-limits

- **Mô tả E2 trong evals.yaml lệch với ca BN-2 thật: ghi proposal known-limits, nhưng ca dùng new-contract (r1)**
  Người dùng thấy gì: Lời mô tả bằng chứng của một bài kiểm nói một kịch bản hơi khác kịch bản đã chạy. Người dùng không thấy gì khác, chỉ người đối chiếu hồ sơ có thể bối rối.
  Căn cứ: Chỉ sai lời mô tả, kết quả kiểm vẫn đúng và không ảnh hưởng người dùng; sửa được bất cứ lúc nào bằng một dòng chữ.
  file: `_acceptance/bang-ngoai-n-co-can-cu/evals.yaml`
  severity: low
  Đề xuất: wont-fix

- **Hình dạng 4 (âm-tính-một-mình): vế cờ «mục chưa có căn cứ» trên thẻ REJECT của BN-3 không thể đỏ (r1 · tệp đã đổi)**
  Người dùng thấy gì: Một phép kiểm phụ cho thẻ hồ sơ bị từ chối luôn xanh, nên nếu sau này thẻ ấy in sai cờ thì có thể không ai biết. Hiện thẻ vẫn đúng.
  Căn cứ: Hiện không có lỗi nào người dùng thấy; rủi ro chỉ là bỏ sót lỗi tương lai ở thẻ từ chối, và sửa rẻ bằng cách thêm một hồ sơ thử.
  file: `tests/scripts/bang-ngoai-n.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 (thiếu đối chứng dương trong ca đỏ): BN-1-do không cho bản lành xanh trên cùng fixture trước khi tin chiều đỏ (r1 · tệp đã đổi)**
  Người dùng thấy gì: Một bài kiểm bên trong kit có thể xanh mà không chứng minh được nó thật sự bắt đúng lỗi khi chạy riêng. Người dùng thẻ không thấy khác biệt nào.
  Căn cứ: Chỉ làm bài kiểm nội bộ kém chặt khi chạy riêng, chạy trọn bộ thì đã có đối chứng; không chạm dữ liệu người dùng và sửa sau rẻ.
  file: `tests/scripts/bang-ngoai-n.test.mjs`
  severity: low
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 2/3 lỗi rơi vào file không bộ đo nào phủ (_acceptance/khoi-viec-cua-anh/evidence/p186-card-gate2.html, tests/scripts/cay-doi-trong-luot.test.mjs) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.

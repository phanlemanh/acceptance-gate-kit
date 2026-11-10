# Review findings: t3-can-ho-so-arm (round 3)

## Trong hợp đồng

Không có finding nào map được vào AC.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Cờ --slug của lệnh khuôn không được kiểm, ghi tệp được ra ngoài thư mục hồ sơ**
  Người dùng thấy gì: Người dùng gõ nhầm hoặc cố tình đưa tên hồ sơ có dấu đi lùi thư mục thì lệnh khuôn có thể tạo tệp ngoài thư mục hồ sơ. Chỉ xảy ra khi tự chạy lệnh tay.
  Căn cứ: Hậu quả nhẹ vì chỉ người đang chạy lệnh trên máy mình mới gặp, không mất dữ liệu có sẵn, và có thể xoá tệp thừa; sửa sau cũng rẻ.
  file: `scripts/design-floor-khuon.mjs`
  severity: medium
  Đề xuất: known-limits

- **Ca HA27-bien chỉ kết luận từ mã thoát khác 0, không ghim thông điệp**
  Người dùng thấy gì: Một ca kiểm thử có thể báo xanh dù cổng hỏng vì lý do khác với lý do dự định. Người dùng cuối không thấy ngay, nhưng độ tin cậy của phép kiểm giảm.
  Căn cứ: Chỉ làm bài kiểm yếu đi chứ sản phẩm vẫn chạy đúng; không ảnh hưởng dữ liệu người dùng và vá sau rất rẻ.
  file: `tests/scripts/t3-can-ho-so-arm.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Lệnh chờ máy sinh không bọc đường dẫn, kho có dấu cách sẽ chờ vô hạn và không báo lỗi**
  Người dùng thấy gì: Nếu thư mục kho có dấu cách, thợ sẽ chờ mãi mà không có thông báo lỗi nào, người dùng phải tự đoán vì sao treo.
  Căn cứ: Treo im lặng gây khó chịu nhưng không mất dữ liệu, chỉ gặp khi tên thư mục có dấu cách, và người dùng dừng được bằng tay; sửa rẻ.
  file: `dieu-phoi/scripts/lich.mjs`
  severity: medium
  Đề xuất: known-limits

- **Đọc thuộc tính JSX dừng ở dấu > đầu tiên: prop dạng mũi tên làm chấm khe sai cả hai chiều**
  Người dùng thấy gì: Màn hình viết đúng khuôn có thể bị báo thiếu thành phần, còn màn thiếu thật lại có thể lọt qua. Cổng khuôn vì thế vừa chặn oan vừa bỏ sót.
  Căn cứ: Sai cả hai chiều trên thành phần phổ biến nên dễ gặp và làm mất niềm tin vào cổng, nhưng chỉ chặn hoặc bỏ sót chứ không mất dữ liệu; cần một đợt việc riêng để sửa đúng.
  file: `scripts/ban-do-khuon.cjs`
  severity: high
  Đề xuất: new-contract

- **Lưới khuôn của s4-args bỏ qua bd.sai: tệp bản đồ hỏng làm nhóm biến mất và lưới im**
  Người dùng thấy gì: Khi một tệp mô tả khuôn bị hỏng, vòng làm việc lặng lẽ bỏ qua nhóm đó và màn ngoài khuôn không bị trả lại, không có cảnh báo nào.
  Căn cứ: Lỗi im lặng làm mất một lớp bảo vệ mà người dùng tưởng đang có, nhưng chỉ khi tệp mô tả hỏng; cần thiết kế cách báo lỗi nên đáng làm thành việc riêng.
  file: `feature-loop/scripts/s4-args.mjs`
  severity: medium
  Đề xuất: new-contract

- **Lệnh chờ khoá không bọc nháy đường dẫn: đường có dấu cách làm thợ chờ vô hạn và không báo lỗi**
  Người dùng thấy gì: Nếu đường dẫn kho có dấu cách, thợ chờ khoá mãi dù khoá đã cấp và không có thông báo lỗi.
  Căn cứ: Treo im lặng nhưng không mất dữ liệu, chỉ gặp với tên thư mục có dấu cách và người dùng dừng được bằng tay; sửa sau rẻ.
  file: `dieu-phoi/scripts/lich.mjs`
  severity: medium
  Đề xuất: known-limits

- **t3_co_ho_so_arm bỏ qua đòi chữ ký mà không báo khi thiếu node hoặc lib**
  Người dùng thấy gì: Trên máy thiếu công cụ cần thiết, hồ sơ chưa có chữ ký người vẫn được cho qua mà không có dòng nào báo là đã bỏ kiểm. Người duyệt có thể tưởng đã được kiểm chữ ký.
  Căn cứ: Chỉ xảy ra khi môi trường chạy thiếu công cụ, hiếm với kho đã cài đủ, nhưng im lặng nên khó phát hiện; thêm dòng báo sau rất rẻ.
  file: `scripts/pre-merge-check.sh`
  severity: low
  Đề xuất: known-limits

- **GM-6-that đổi từ đỏ sang SKIP khi mất bản ghi tác tử con, che hồi quy của bộ đọc**
  Người dùng thấy gì: Nếu bộ đọc giờ máy hỏng và bỏ sót bản ghi, bài kiểm báo bỏ qua thay vì báo đỏ, nên lỗi có thể không bị phát hiện kịp.
  Căn cứ: Chỉ làm bài kiểm kém nhạy trong một tình huống hẹp, không ảnh hưởng dữ liệu người dùng; mức nhẹ và sửa rẻ.
  file: `tests/scripts/lo-trinh-gio-may.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 3 — Assert «chuỗi có mặt» trong khi lời hứa là QUAN HỆ: KK-3 không ghim giá trị Thẻ việc đi với đúng tên trường**
  Người dùng thấy gì: Thẻ việc có thể hiện nhầm giá trị sang sai trường mà bài kiểm vẫn xanh, nên lỗi đảo hàng khó bị bắt.
  Căn cứ: Chỉ làm bài kiểm yếu, không có sai lệch thật đang xảy ra với người dùng; sửa sau rẻ.
  file: `tests/scripts/khoi-khuon-tren-the-cong.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 2 — Fixture VIẾT TAY đúng khuôn bên đọc: bảng Thẻ việc không round-trip từ ux-spec-template qua docTheViec**
  Người dùng thấy gì: Nếu mẫu thẻ việc đổi hình dạng, thẻ có thể hiện chưa điền mà bài kiểm vẫn xanh, nên người dùng thấy thẻ trống mà không ai báo.
  Căn cứ: Chỉ xảy ra khi có người đổi mẫu và thẻ chỉ hiện trống chứ không mất dữ liệu; sửa sau rẻ.
  file: `tests/scripts/khoi-khuon-tren-the-cong.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 — Assertion âm-tính-một-mình: 12 ca đột biến lý do đúng theo cấu tạo, bản tiêm không được ghim gì**
  Người dùng thấy gì: Một số ca chứng minh cổng chặn đúng lý do có thể xanh dù bản thử đã hỏng vì nguyên nhân khác, nên bằng chứng yếu hơn vẻ ngoài.
  Căn cứ: Cổng vẫn chặn đúng với người dùng, chỉ độ chắc của bằng chứng thấp hơn; không mất dữ liệu và có thể củng cố sau.
  file: `tests/scripts/t3-can-ho-so-arm.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 — Assertion âm-tính-một-mình: HA27-bien xanh với mọi mã thoát khác 0, không ghim thông điệp base hỏng**
  Người dùng thấy gì: Một ca kiểm thử có thể xanh với bất kỳ kiểu thất bại nào, nên không chứng minh cổng báo đúng khi nhánh gốc không tìm thấy.
  Căn cứ: Chỉ làm bài kiểm yếu; hành vi của cổng cho người dùng không đổi và vá sau rẻ.
  file: `tests/scripts/t3-can-ho-so-arm.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Các ca phá thử theo lý do chỉ kiểm chuỗi vắng mặt, nên bản sao hỏng vẫn xanh (r2)**
  Người dùng thấy gì: Bài kiểm tra tự thử của cổng có thể báo xanh dù bản thử đã hỏng giữa chừng, nên có lúc ta tưởng một luật chặn đã được chứng minh sống mà thực ra chưa. Cổng thật vẫn chặn đúng trên các ca hiện có.
  Căn cứ: Hậu quả nhẹ vì chỉ làm bằng chứng kiểm thử yếu đi chứ không làm cổng chặn sai hay lọt người dùng, hiện mọi ca vẫn đạt trên bản thật, và việc siết lại có thể làm sau mà không mất gì.
  file: `tests/scripts/t3-can-ho-so-arm.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (assertion âm-tính-một-mình): 12 ca đột biến lý do chỉ đòi chuỗi lý do biến mất, không ghim bản đột biến đã chạy tới luật (r2)**
  Người dùng thấy gì: Mười hai ca thử kiểu gỡ từng lý do chặn có thể xanh giả khi bản thử chết sớm, nên bằng chứng rằng từng lý do chặn đang thật sự hoạt động yếu hơn vẻ ngoài.
  Căn cứ: Không làm người dùng mất dữ liệu hay bị chặn sai, chỉ làm lưới kiểm thử kém tin cậy hơn; ghi lại như một hạn chế đã biết là đủ vì sửa sau vẫn rẻ.
  file: `tests/scripts/t3-can-ho-so-arm.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **design-floor-khuon.mjs không kiểm --slug trước khi ghi tệp, đường dẫn có thể thoát khỏi _acceptance/ (r1)**
  Người dùng thấy gì: Người chạy công cụ dựng khuôn có thể vô tình ghi tệp ra ngoài thư mục hồ sơ nếu gõ tên hồ sơ sai dạng. Chỉ xảy ra khi chính chủ kho gõ lệnh sai.
  Căn cứ: Hậu quả nhẹ vì chỉ người tự chạy lệnh mới gặp, không ảnh hưởng người dùng cuối; sửa sau rẻ và không mất dữ liệu có sẵn.
  file: `scripts/design-floor-khuon.mjs`
  severity: medium
  Đề xuất: known-limits

- **Vế đòi chữ ký người của t3_co_ho_so_arm tắt im lặng khi thiếu node hoặc lib (r1)**
  Người dùng thấy gì: Trên máy thiếu công cụ cần thiết, cổng có thể cho qua hồ sơ chưa có chữ ký người mà không báo gì, nên chủ kho tưởng đã được kiểm.
  Căn cứ: Lỗ hổng làm cổng xanh giả nhưng chỉ xảy ra ở máy thiếu công cụ, hiếm; cần một việc riêng để quyết định cách báo, nên tách khỏi lượt này.
  file: `scripts/pre-merge-check.sh`
  severity: medium
  Đề xuất: new-contract

- **Lệnh chờ do lenhChoKhoa sinh ra không nháy đường dẫn: kho có dấu cách sẽ treo vô hạn và im lặng (r1)**
  Người dùng thấy gì: Nếu kho nằm trong thư mục có dấu cách, tiến trình chờ lượt sẽ chờ mãi mà không báo lỗi, người làm tưởng vẫn đang xếp hàng.
  Căn cứ: Treo im lặng khá khó phát hiện nhưng chỉ với kho có dấu cách và tự dừng tay được; sửa rẻ nhưng thuộc một tính năng khác.
  file: `dieu-phoi/scripts/lich.mjs`
  severity: medium
  Đề xuất: new-contract

- **Phép kiểm khe bắt buộc cắt thẻ JSX ở dấu > của hàm mũi tên: báo oan thiếu khe và bỏ sót thiếu children (r1)**
  Người dùng thấy gì: Công cụ kiểm khuôn giao diện có thể báo thiếu thành phần dù đã có, hoặc bỏ sót thiếu thật, khi mã dùng hàm mũi tên trong thuộc tính.
  Căn cứ: Sai lệch chỉ làm kết quả kiểm khuôn kém tin cậy ở một dạng viết phổ biến, không mất dữ liệu và người dùng cuối không thấy; cần quyết định có khai là giới hạn hay làm lại.
  file: `scripts/ban-do-khuon.cjs`
  severity: medium
  Đề xuất: known-limits

- **Lệnh chờ khoá do máy in không bọc đường dẫn trong dấu nháy: kho có dấu cách thì vòng chờ không bao giờ thoát (r1)**
  Người dùng thấy gì: Kho nằm ở thư mục có dấu cách khiến việc chờ lượt chạy mãi, dù lượt đã được cấp thì không ai dùng.
  Căn cứ: Chỉ ảnh hưởng kho có dấu cách và tự dừng tay được, không mất dữ liệu; gộp xử lý cùng lỗi cùng gốc.
  file: `dieu-phoi/scripts/lich.mjs`
  severity: low
  Đề xuất: new-contract

- **Hình dạng 3: assert chuỗi có mặt trong khi lời hứa là quan hệ giữa tên trường và giá trị Thẻ việc (r1)**
  Người dùng thấy gì: Phép thử có thể vẫn xanh dù thẻ việc ghép nhầm giá trị sang sai trường, nên lỗi ghép nhầm có thể lọt mà không ai biết.
  Căn cứ: Chỉ làm kiểm thử yếu hơn lời hứa, người dùng không mất dữ liệu; thêm phép thử sau rẻ và không gấp.
  file: `tests/scripts/khoi-khuon-tren-the-cong.test.mjs`
  severity: high
  Đề xuất: known-limits

- **Hình dạng 4: đột biến lý do chỉ assert âm tính trên bản tiêm, không có đối chứng dương (r1)**
  Người dùng thấy gì: Phép thử gỡ nhánh có thể xanh vì bản sao bị hỏng chứ không phải vì lý do chặn đã biến mất, nên bằng chứng yếu hơn vẻ ngoài.
  Căn cứ: Rủi ro là kiểm thử xanh giả, không ảnh hưởng người dùng cuối trực tiếp; sửa rẻ nhưng không gấp.
  file: `tests/scripts/t3-can-ho-so-arm.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4: HA27-bien chỉ đòi không clean, không ghim thông điệp (r1)**
  Người dùng thấy gì: Một phép thử về hồ sơ có thể xanh vì bất kỳ lỗi nào, kể cả lỗi không liên quan đến điều nó định kiểm.
  Căn cứ: Chỉ làm bằng chứng yếu cho một ca phụ, không ảnh hưởng người dùng; sửa sau rẻ.
  file: `tests/scripts/t3-can-ho-so-arm.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4: nhóm chan_them=false của E8 chỉ kiểm vắng thông điệp, bỏ qua mã thoát (r1)**
  Người dùng thấy gì: Phép đối chiếu trên các kho thật có thể coi là đúng cả khi luật chưa chạy tới, nên độ tin cậy của kết quả bị thổi phồng.
  Căn cứ: Rủi ro là tin nhầm vào đối chiếu, không mất dữ liệu; tăng độ chặt sau tốn công vừa phải nên chấp nhận ghi vết trước.
  file: `_acceptance/t3-can-ho-so-arm/rang/vi-phan-kho.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 2 (kèm 1): fixture Thẻ việc viết tay đúng khuôn bộ đọc, phía khuôn tệp chỉ grep chữ (r1)**
  Người dùng thấy gì: Nếu mẫu đặc tả đổi dạng, đặc tả viết theo mẫu sẽ bị đọc là chưa điền thẻ việc mà phép thử vẫn xanh.
  Căn cứ: Chỉ phát hiện muộn khi mẫu đổi, không mất dữ liệu và tải lại được; sửa sau rẻ.
  file: `tests/scripts/khoi-khuon-tren-the-cong.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 2: dòng cho nghỉ của HA21 là hằng gõ tay, chỉ được bộ đọc xác nhận (r1)**
  Người dùng thấy gì: Dòng cho nghỉ trong phép thử là gõ tay chứ không rút từ bộ đọc như mô tả, nên nếu định dạng thật đổi, phép thử không bắt được.
  Căn cứ: Mức nhẹ, chỉ lệch giữa mô tả và thực tế của phép thử; không ảnh hưởng người dùng và sửa rẻ.
  file: `tests/scripts/t3-can-ho-so-arm.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 5: chiều đỏ E9 tự rút danh sách ca từ tệp đang đo, không có số viết trước (r1)**
  Người dùng thấy gì: Nếu ai đó xoá bớt các ca thử chiều đỏ, bước kiểm vẫn xanh và chỉ báo số nhỏ hơn.
  Căn cứ: Chỉ xảy ra khi có người xoá ca và dễ thấy qua số báo; sửa rẻ nhưng không gấp.
  file: `_acceptance/t3-can-ho-so-arm/rang/chieu-do.sh`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4: phép so «bằng từng byte bản trước vòng» không đối chứng rằng bản gốc khác vật đang đo (r1)**
  Người dùng thấy gì: Sau khi gộp, phép so với bản trước vòng thành so với chính nó nên không còn phát hiện thay đổi ngoài ý muốn.
  Căn cứ: Mất tác dụng bảo vệ theo thời gian nhưng không gây hại trực tiếp cho người dùng; có thể ghim bản gốc sau với chi phí thấp.
  file: `tests/scripts/khoi-khuon-tren-the-cong.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4: hàng «cờ rỗng» của KK-4 xanh cả khi trích thẻ hỏng (r1)**
  Người dùng thấy gì: Một vài hàng thử có thể xanh khi việc dựng thẻ bị lỗi, vì lỗi bị nuốt và coi như không có cờ thừa.
  Căn cứ: Hậu quả rất nhẹ vì các hàng có cờ vẫn đối chứng ở mức cả ma trận; chi phí sửa vượt lợi ích.
  file: `tests/scripts/khoi-khuon-tren-the-cong.test.mjs`
  severity: low
  Đề xuất: wont-fix

⚠ Cụm ngoài vùng phủ: 8/12 lỗi rơi vào file không bộ đo nào phủ (scripts/design-floor-khuon.mjs, dieu-phoi/scripts/lich.mjs, scripts/ban-do-khuon.cjs, feature-loop/scripts/s4-args.mjs, tests/scripts/lo-trinh-gio-may.test.mjs, tests/scripts/khoi-khuon-tren-the-cong.test.mjs) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.

## Trong hợp đồng

Không có finding nào map được vào AC.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **JR11c is called a positive control but never runs the untouched copy; the fix filters on the PASS header instead**
  Người dùng thấy gì: Một bài kiểm tra của bộ máy chấm có thể báo xanh dù nó chưa thật sự bắt được lỗi mà nó định bắt. Người dùng cuối không thấy gì ngay, nhưng độ tin của màu xanh ở chỗ đó yếu hơn vẻ ngoài.
  Căn cứ: Chỉ ảnh hưởng độ tin của một bài kiểm tra nội bộ, không làm mất hay sai dữ liệu của người dùng, hôm nay bài vẫn chạy đúng và sửa sau không đắt.
  file: `tests/scripts/core-untouched.test.mjs`
  severity: low
  Đề xuất: known-limits

- **JR11c chưa kiểm bản sao nguyên vẹn XANH trước khi tiêm, nên ca vẫn qua dù hồ sơ được chọn vốn đã đỏ CONSISTENCY**
  Người dùng thấy gì: Một bài kiểm tra nội bộ có thể vẫn xanh khi hồ sơ mẫu được chọn vốn đã có lỗi, nên không phân biệt được lỗi do bài tiêm với lỗi sẵn có. Người dùng cuối chưa bị ảnh hưởng.
  Căn cứ: Hậu quả nhẹ và chỉ ở bộ kiểm nội bộ, không mất dữ liệu, hôm nay hồ sơ được chọn vẫn sạch và việc sửa có thể làm ở vòng khác.
  file: `tests/scripts/core-untouched.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 (assertion âm-tính-một-mình): JR11c không có đối chứng dương trên bản sao nguyên vẹn, và thông điệp ghim quá rộng nên không phân biệt được đỏ-vì-nhát-tiêm với đỏ-vì-lỗi-sẵn-có**
  Người dùng thấy gì: Một bài kiểm tra nội bộ của bộ máy chấm có thể xanh vì lý do khác với lý do nó tuyên bố, nên màu xanh đó đáng tin kém hơn. Người dùng cuối không thấy hậu quả trực tiếp.
  Căn cứ: Chỉ làm bộ kiểm nội bộ kém chặt, không mất dữ liệu hay làm sai kết quả cho người dùng, và sửa sau không đắt nên ghi lại là đủ.
  file: `tests/scripts/core-untouched.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Khôi phục sau đứt dựa vào băm tệp cũng chạy lại lần áp mà người vừa huỷ bằng tay, khi người đưa tệp về đúng byte cũ (r2)**
  Người dùng thấy gì: Nếu chủ kho tự hoàn tác thay đổi máy vừa dời bằng git hoặc undo mà không dùng lệnh trả lại, rồi lần chạy kế trong cùng ngày thì máy có thể áp lại đúng thay đổi đó. Thay đổi bị áp lại sẽ nằm lẫn trong commit khác, không có commit riêng của máy.
  Căn cứ: Hậu quả nhẹ: chỉ xảy ra trong đúng ngày đó, khi chủ kho hoàn tác bằng tay thay vì lệnh trả lại. Chủ kho thấy ngay trong diff và trả lại được bằng lệnh trả lại, không mất dữ liệu, còn sửa thì phải đổi cách nhận biết lần đứt.
  file: `scripts/lo-trinh.mjs`
  severity: low
  Đề xuất: known-limits

- **Đứt giữa ghi-sổ và ghi-tệp mà lần chạy lại rơi sang ngày khác: sổ báo «đã áp» một thay đổi chưa từng vào tệp, không có cảnh báo nào (r2)**
  Người dùng thấy gì: Nếu máy bị ngắt đúng giữa lúc ghi sổ và ghi tệp, rồi lần chạy kế rơi sang ngày hôm sau, sổ sẽ báo một hàng đã được dời trong khi tệp lộ trình chưa hề đổi. Lệnh xem và thẻ khởi động có thể hiện cả «đã dời» lẫn «sẽ dời» cho cùng hàng đó, và lệnh trả lại báo sai là hàng đã bị sửa tay.
  Căn cứ: Hậu quả vừa phải nhưng hiếm: cần máy bị ngắt đúng khoảng ngắn giữa hai lần ghi và lần chạy kế sang ngày khác. Không mất dữ liệu, tệp vẫn nguyên và chủ kho chỉ thấy thông tin gây lẫn; chủ kho tự dời hàng bằng tay được, còn sửa thì phải thiết kế lại cách khôi phục.
  file: `scripts/lo-trinh.mjs`
  severity: low
  Đề xuất: known-limits

- **Mở việc tự áp và GHI tệp lộ trình cùng sổ trước khi kiểm hợp lệ; thoát 2 để lại thay đổi chưa commit, lần sau mất khoá «ap» nên mất commit riêng của máy (r1)**
  Người dùng thấy gì: Khi mở việc mới bị từ chối (ví dụ thư mục đã tồn tại), máy vẫn có thể đã dời hàng trong lộ trình rồi. Thay đổi đó nằm lại chưa commit, lần mở sau có thể không còn được tách thành commit riêng của máy.
  Căn cứ: Chỉ xảy ra khi mở việc bị từ chối đúng lúc máy vừa tự dời hàng; không mất dữ liệu, chủ kho thấy thay đổi trong cây làm việc và tự commit hoặc hoàn tác được.
  file: `scripts/lo-trinh.mjs`
  severity: medium
  Đề xuất: known-limits

- **Bất biến «Kit không bao giờ ghi vào tệp ý định» vẫn nằm trong đầu mô-đun và trong hai SKILL, trái với bộ ghi mới (r1)**
  Người dùng thấy gì: Hướng dẫn mà phiên Claude đọc lúc mở việc vừa nói kit không ghi gì vào lộ trình, vừa nói máy sẽ tự dời hàng và commit riêng tệp lộ trình. Hai chỉ dẫn trái nhau có thể khiến phiên làm sai hoặc bối rối.
  Căn cứ: Chỉ là chữ lỗi thời trong tài liệu hướng dẫn, hành vi thật vẫn đúng; sửa rẻ và không ai mất dữ liệu, nhưng nên ghi lại để dọn ở mốc sau.
  file: `feature-loop/skills/feature-loop/SKILL.md`
  severity: medium
  Đề xuất: known-limits

- **Lệnh trả lại / ghim chọn bộ ghi khác với bộ tự áp: kho có bản chép cũ (crm) thì đường đảo hỏng trong khi máy vẫn tự áp (r1)**
  Người dùng thấy gì: Ở kho còn giữ bản chép mã cũ, máy vẫn tự dời hàng nhưng lệnh trả lại hàng báo lỗi tham số lạ. Chủ kho không đảo được việc máy vừa làm bằng một lệnh cho tới khi kho cập nhật bản chép.
  Căn cứ: Đường đảo bị gãy chỉ ở kho chưa cập nhật bản chép; không mất dữ liệu vì chủ kho vẫn sửa tay được, và cập nhật bản chép là khắc phục.
  file: `road-map/commands/tra-lai.md`
  severity: medium
  Đề xuất: known-limits

- **Mẫu chặn chèn shell của ba lệnh road-map được chép tay, không đi qua khối marker một nguồn S0-MA-HANG-RE (r1)**
  Người dùng thấy gì: Ba lệnh ghim, bỏ ghim, trả lại mỗi lệnh giữ một bản chép riêng của quy tắc lọc đối số người gõ. Nếu quy tắc gốc đổi sau này, ba bản chép có thể lệch mà không ai hay.
  Căn cứ: Hôm nay ba bản vẫn khớp bản gốc nên người dùng chưa gặp gì; rủi ro chỉ xuất hiện khi quy tắc gốc đổi, và sửa lúc đó vẫn rẻ.
  file: `road-map/commands/ghim.md`
  severity: low
  Đề xuất: known-limits

- **Tự áp trên tệp có BOM làm sập thẻ khởi động, `--xem` và `--ap` (không --write) bằng stack trace (r1)**
  Người dùng thấy gì: Nếu tệp lộ trình có dấu BOM đầu tệp và kho bật tự áp, thẻ khởi động phiên và lệnh xem bản đồ có thể vỡ bằng một đống thông báo lỗi thay vì chạy bình thường. Trước thay đổi này, tệp như vậy vẫn đọc được.
  Căn cứ: Chỉ ảnh hưởng kho có tệp lộ trình mang BOM, hiếm; không mất dữ liệu và người dùng tự khắc phục được bằng cách bỏ BOM, nhưng nó làm hỏng lúc khởi động phiên nên nên sớm sửa.
  file: `scripts/lo-trinh.mjs`
  severity: medium
  Đề xuất: known-limits

- **Máy tự áp «xếp lại»/«đã bác» theo hồ sơ tự sinh cờ «hồ sơ X ghi lo_trinh_ma A — không có hàng A» trên kế hoạch (r1)**
  Người dùng thấy gì: Mỗi lần máy tự đưa một hàng đã có hồ sơ sang mục chờ hoặc đã bác, kế hoạch lại hiện một cờ lỗi giả báo hồ sơ trỏ tới hàng không tồn tại. Chủ kho phải mất công xem cờ đó dù không có gì sai.
  Căn cứ: Cờ giả lặp lại ở mọi kho dùng lối mở việc có hồ sơ, làm người dùng mất niềm tin vào cờ lỗi; không mất dữ liệu nhưng sửa cần đổi cách bộ đọc nối hồ sơ nên đáng một việc riêng.
  file: `scripts/lo-trinh.mjs`
  severity: medium
  Đề xuất: new-contract

- **Thước nền do-nen bỏ im lặng commit có JSON hỏng và đếm commit kế tiếp thành «tạo tệp» (r1)**
  Người dùng thấy gì: Khi lịch sử có một commit với tệp lộ trình hỏng, số đo trước/sau của vòng này sẽ lệch lặng lẽ mà không có cảnh báo. Con số báo cho chủ kho có thể không phản ánh đúng thực tế.
  Căn cứ: Chỉ làm lệch một con số đo nền trong tình huống tệp từng hỏng, hiếm; không ảnh hưởng dữ liệu hay hành vi sản phẩm.
  file: `_acceptance/ap-chinh-sach-lo-trinh/nen/do-nen.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 (âm-tính-một-mình): AP-1-sai-kieu kết luận «không sổ, tệp không đổi» mà không có đối chứng dương trên cùng kho (r1)**
  Người dùng thấy gì: Bài kiểm cho trường hợp khai chính sách sai kiểu chỉ chứng minh máy không ghi gì, chưa chứng minh cùng kho khai đúng thì máy có ghi. Nếu máy vốn không báo trước ngày đó thì bài vẫn xanh mà không bắt được gì.
  Căn cứ: Hành vi sản phẩm vẫn đúng, chỉ là bài kiểm có thể xanh vì lý do sai; không ảnh hưởng người dùng trực tiếp và thêm đối chứng sau này rẻ.
  file: `tests/scripts/ap-chinh-sach-lo-trinh.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (âm-tính-một-mình): RS-3-chua-commit chỉ đòi «0 đề xuất tuổi», không đối chứng dương, không ghim thông điệp (r1)**
  Người dùng thấy gì: Bài kiểm cho tệp lộ trình chưa commit chỉ xác nhận không có đề xuất theo tuổi, không xác nhận lý do hay lời cảnh báo. Nếu luật tuổi hỏng hoàn toàn, bài vẫn xanh.
  Căn cứ: Lời cảnh báo cho người dùng đã được kiểm ở chỗ khác nên rủi ro thật rất nhỏ; đây chỉ là bài kiểm lỏng, không gây mất dữ liệu.
  file: `tests/scripts/ra-soat-lo-trinh.test.mjs`
  severity: low
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 3/3 lỗi rơi vào file không bộ đo nào phủ (tests/scripts/core-untouched.test.mjs) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.

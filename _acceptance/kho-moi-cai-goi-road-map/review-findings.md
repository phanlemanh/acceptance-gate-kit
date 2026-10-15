# Review findings: kho-moi-cai-goi-road-map (vòng 3)

## Trong hợp đồng

Không có finding nào trong hợp đồng.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Khối CLI của lo-trinh-khoi-tao.mjs so argv[1] bằng path.resolve, không bằng realpath: gọi qua symlink thì im lặng không chạy và thoát 0**
  Người dùng thấy gì: Nếu gói được cài ở nơi có đường tắt (thư mục liên kết), bước tạo lộ trình cho kho mới không làm gì và báo như đã xong. Kho đó sẽ thiếu lộ trình mà không ai được báo.
  Căn cứ: Hậu quả vừa nhưng im lặng: không mất dữ liệu, người dùng tự chạy lại qua đường thật là có lộ trình, nhưng họ không biết mình cần làm vậy; sửa sau rẻ.
  file: `scripts/lo-trinh-khoi-tao.mjs`
  severity: high
  Đề xuất: new-contract

- **Lời hứa «thoát 2 = không ghi gì» không đúng: phép kiểm đường khai ngoài kho, tệp gói thiếu và lỗi vẽ trang chạy SAU khi bước 1–2 đã sửa config**
  Người dùng thấy gì: Khi cấu hình của kho khai đường lộ trình trỏ ra ngoài kho, bước khởi tạo từ chối và báo «không ghi gì». Thực tế nó đã thêm sẵn một dòng vào tệp cấu hình của kho trước khi từ chối. Chạy lại sau khi sửa thì kho vẫn về đúng trạng thái, nhưng lời báo «không ghi gì» lúc đó không đúng.
  Căn cứ: Hậu quả nhẹ: chỉ thừa một dòng cấu hình vô hại, không mất dữ liệu, và chạy lại sau khi sửa đường khai sẽ tự hội tụ; ca này hiếm (phải khai sai đường), còn sửa thì phải dời mọi phép kiểm lên trước các bước ghi nên tốn hơn lợi ích.
  file: `scripts/lo-trinh-khoi-tao.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hai ca chỉ kiểm mã thoát cộng băm cây, không ghim thông điệp: không phân biệt được «bắt đúng» với «không chạy»**
  Người dùng thấy gì: Hai bài kiểm của tính năng này có thể vẫn xanh dù bước kiểm tương ứng không chạy thật. Người dùng cuối không gặp gì, chỉ là độ tin cậy của bộ kiểm thấp hơn vẻ ngoài.
  Căn cứ: Không ảnh hưởng người dùng trực tiếp; chỉ làm bộ kiểm dễ bỏ sót lỗi sau này, và luật hiện hành không mở vòng đo lại thước.
  file: `tests/scripts/kho-moi-cai-goi-road-map.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **KM-6-do dùng phép HOẶC trong điều kiện đỏ (ho-so-tom-tat | MODULE_NOT_FOUND)**
  Người dùng thấy gì: Bài kiểm chiều đỏ cho bản chép bộ kiểm có thể nhận nhầm một lỗi thiếu tệp khác. Người dùng cuối không bị ảnh hưởng.
  Căn cứ: Hợp đồng đã chấp nhận cách ghim này và hậu quả chỉ là thước kiểm hơi lỏng; sửa vượt xa lợi ích.
  file: `tests/scripts/kho-moi-cai-goi-road-map.test.mjs`
  severity: low
  Đề xuất: wont-fix

- **Chèn hàm mới vào product-map.mjs làm khối chú thích realpath rời khỏi isMain, và chú thích của veTrangLoTrinh nằm trên mienTru**
  Người dùng thấy gì: Một đoạn ghi chú trong mã nằm sai chỗ, làm người bảo trì dễ hiểu nhầm. Người dùng cuối không thấy gì.
  Căn cứ: Không đụng tới hành vi hay dữ liệu của người dùng; chỉ là ghi chú, sửa lúc nào cũng được và không đáng mở việc riêng.
  file: `scripts/product-map.mjs`
  severity: low
  Đề xuất: wont-fix

- **KM-9 vẫn PASS khi số kho thật được đo là 0**
  Người dùng thấy gì: Bài kiểm trên các kho thật của máy có thể báo xanh dù không kho nào thật sự được đo. Người dùng cuối không bị ảnh hưởng.
  Căn cứ: Chỉ làm bộ kiểm có thể xanh rỗng trên máy đặc biệt; không chạm người dùng và sửa sau rẻ.
  file: `tests/scripts/kho-moi-cai-goi-road-map-cac-kho.mjs`
  severity: low
  Đề xuất: known-limits

- **config-patch --append ra YAML hỏng khi danh sách khối viết cùng thụt với khoá**
  Người dùng thấy gì: Với kho viết danh sách cấu hình theo kiểu gọn, bước thêm miễn trừ có thể làm tệp cấu hình hỏng và các công cụ khác không đọc được. Hiện chưa kho nào trên máy viết kiểu đó.
  Căn cứ: Tệp cấu hình hỏng gây phiền nhưng thấy ngay và hoàn tác được bằng git; chưa kho nào gặp nên chưa đáng sửa trước.
  file: `scripts/config-patch.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 (âm-tính-một-mình): KM-4-chua-bat-ban-do xanh cả khi bước khởi tạo không làm gì**
  Người dùng thấy gì: Một bài kiểm có thể xanh dù bước khởi tạo không chạy. Người dùng cuối không gặp gì, chỉ là bộ kiểm kém nhạy hơn vẻ ngoài.
  Căn cứ: Không đụng tới người dùng, chỉ làm bộ kiểm dễ bỏ sót; luật hiện hành không mở vòng đo lại thước.
  file: `tests/scripts/kho-moi-cai-goi-road-map.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (âm-tính-một-mình): KM-6-chua-chep chỉ kiểm «0 tệp dưới scripts/», không kiểm lần chạy có thật**
  Người dùng thấy gì: Bài kiểm cho kho chưa chép bộ kiểm có thể xanh dù lần khởi tạo chưa chạy tới đó. Người dùng cuối không bị ảnh hưởng.
  Căn cứ: Chỉ làm bộ kiểm lỏng hơn, không ảnh hưởng người dùng; sửa sau rẻ.
  file: `tests/scripts/kho-moi-cai-goi-road-map.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (âm-tính-một-mình): KM-5-trang-cu chỉ kiểm trang giữ byte, không kiểm lần chạy có thật**
  Người dùng thấy gì: Bài kiểm trang cũ có thể xanh dù lần khởi tạo đã dừng sớm. Người dùng cuối không gặp gì.
  Căn cứ: Chỉ làm bộ kiểm kém nhạy, người dùng không bị ảnh hưởng; sửa sau không đắt.
  file: `tests/scripts/kho-moi-cai-goi-road-map.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4: KM-3-append-trung chỉ ghim mã thoát 2, không ghim thông điệp, trong khi config-patch có hai đường REFUSED cùng mã 2**
  Người dùng thấy gì: Bài kiểm việc từ chối thêm mục trùng không phân biệt được lý do từ chối. Người dùng cuối vẫn được từ chối và không bị ghi gì.
  Căn cứ: Hành vi người dùng vẫn đúng, chỉ bộ kiểm hơi lỏng; không đáng mở việc riêng.
  file: `tests/scripts/kho-moi-cai-goi-road-map.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4: KM-4-do ghim chuỗi «PRODUCT-MAP.md», mà chuỗi này cũng có trong dòng báo XANH**
  Người dùng thấy gì: Bài kiểm chiều đỏ của bản đồ có thể chấp nhận một lỗi khác với lỗi định bắt. Người dùng cuối không bị ảnh hưởng.
  Căn cứ: Chỉ làm bộ kiểm có thể đỏ vì lý do khác, không chạm người dùng; sửa sau rẻ.
  file: `tests/scripts/kho-moi-cai-goi-road-map.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 3 (có-mặt thay quan hệ): KM-8 kiểm «bước 1 nêu 5d» bằng includes('5d')**
  Người dùng thấy gì: Bài kiểm lời dặn trong lệnh khởi tạo chỉ kiểm có nhắc bước 5d, không kiểm nó nằm trong nhóm bước vẫn chạy. Lời dặn sai kiểu đó sẽ không bị bắt.
  Căn cứ: Lời dặn hiện đúng, chỉ bộ kiểm lỏng nên nhẹ với người dùng; sửa sau rẻ.
  file: `tests/scripts/kho-moi-cai-goi-road-map.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5: ma trận đứt k=1..4 có hai phần tử trùng trạng thái — trên kho thử, bước 4 không làm gì**
  Người dùng thấy gì: Kịch bản đứt giữa lúc chép bộ kiểm chưa từng được thử thật. Khi bước đó bị đứt giữa chừng, chưa có bằng chứng chạy lại sẽ hội tụ.
  Căn cứ: Rủi ro nhẹ và thấp: bước chép chỉ thêm tệp, chạy lại là xong; thiếu bằng chứng nhưng không có dấu hiệu lỗi.
  file: `tests/scripts/kho-moi-cai-goi-road-map.test.mjs`
  severity: low
  Đề xuất: known-limits

- **config-patch --append ghi ra YAML hỏng khi danh sách khối của khoá thụt bằng đúng khoá (dạng `- mục` không thụt thêm) (r2)**
  Người dùng thấy gì: Nếu tệp cấu hình của kho viết danh sách miễn trừ theo kiểu gạch đầu dòng sát lề, bước khởi tạo thêm mục mới vào sai chỗ và tệp cấu hình trở thành không hợp lệ với các công cụ đọc cấu hình chuẩn bên ngoài. Công cụ của bộ kit vẫn đọc được nên không có cảnh báo nào hiện ra.
  Căn cứ: Hậu quả có thể nặng với kho viết cấu hình theo kiểu đó vì tệp hỏng âm thầm, nhưng kiểu viết này hiếm và người dùng sửa tay được trong vài giây, nên đề xuất ghi thành hạn chế đã biết.
  file: `scripts/config-patch.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (âm tính đứng một mình): KM-5-trang-cu chỉ kiểm «LO-TRINH.html còn byte cũ», không kiểm lệnh khởi tạo có chạy thật hay không (r2)**
  Người dùng thấy gì: Phép kiểm xác nhận trang lộ trình có sẵn không bị ghi đè có thể báo xanh ngay cả khi bước khởi tạo hoàn toàn không chạy, nên màu xanh của riêng ca này chưa đủ để tin. Người dùng cuối không bị ảnh hưởng, chỉ độ tin cậy của bộ kiểm giảm.
  Căn cứ: Không ảnh hưởng trực tiếp đến người dùng vì các ca khác trong cùng bộ kiểm vẫn bắt được khởi tạo chết, và việc bổ sung đối chứng sau này rẻ.
  file: `tests/scripts/kho-moi-cai-goi-road-map.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (âm tính đứng một mình): KM-6-chua-chep kết luận «0 tệp mới dưới scripts/» mà không có đối chứng là khởi tạo đã chạy (r2)**
  Người dùng thấy gì: Phép kiểm kho chưa chép lớp CI có thể báo xanh dù bước khởi tạo chết ngay từ đầu, nên người đọc kết quả có thể tin nhầm là hành vi đúng đã được xác nhận. Người dùng cuối không bị ảnh hưởng.
  Căn cứ: Hậu quả chỉ là bộ kiểm kém chặt, không làm mất hay lộ dữ liệu của ai, và chi phí bổ sung đối chứng sau này thấp.
  file: `tests/scripts/kho-moi-cai-goi-road-map.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (âm tính đứng một mình): KM-4-chua-bat-ban-do xanh khi bước khởi tạo không chạy (r2)**
  Người dùng thấy gì: Phép kiểm xác nhận kho chưa bật bản đồ không bị vẽ thêm bản đồ có thể xanh dù bước khởi tạo không làm gì cả, nên lời hứa này chưa được chứng minh chắc bằng ca đó. Người dùng cuối không thấy khác biệt.
  Căn cứ: Không có hậu quả trực tiếp cho người dùng vì hành vi thật vẫn đúng, chỉ là bằng chứng của ca này yếu hơn mức nên có, và sửa sau rẻ.
  file: `tests/scripts/kho-moi-cai-goi-road-map.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Exit 2 "refused, nothing written" is false: the out-of-repo path check runs after step 2 has already written the config (r1)**
  Người dùng thấy gì: Khi kho khai tệp lộ trình nằm ngoài kho, công cụ báo «từ chối, không ghi gì» nhưng thực ra đã thêm một dòng miễn trừ vào cấu hình của kho. Người dùng tưởng cây còn sạch mà thật ra có một thay đổi chưa commit.
  Căn cứ: Hậu quả nhẹ: chỉ một dòng cấu hình vô hại, hiện ngay trong danh sách thay đổi chưa commit nên người dùng tự gỡ được, và chỉ xảy ra ở kho khai đường dẫn bất thường; sửa sau không đắt nhưng không chặn việc ship.
  file: `scripts/lo-trinh-khoi-tao.mjs`
  severity: medium
  Đề xuất: known-limits

- **KM-3-append-trung relies only on exit code + unchanged tree, with no message pin; the mutant that ignores --append survives (r1)**
  Người dùng thấy gì: Bộ kiểm tra không phân biệt được hai lý do từ chối khi thêm trùng một mục miễn trừ, nên nếu chế độ thêm bị hỏng thì bộ kiểm tra vẫn xanh. Người dùng không thấy gì cho tới khi chế độ thêm hỏng thật.
  Căn cứ: Không ảnh hưởng dữ liệu hay hành vi người dùng hôm nay; chỉ làm lưới kiểm tra yếu đi một chỗ, thêm một dòng ghim thông điệp sau này rất rẻ.
  file: `tests/scripts/kho-moi-cai-goi-road-map.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Step 5 draws LO-TRINH.html with the kit's renderer while the repo's CI checks with its own copies, which may differ (r1)**
  Người dùng thấy gì: Nếu bản công cụ kiểm tra chép sẵn trong kho cũ hơn bản trong gói, trang lộ trình vẽ lúc khởi tạo có thể bị kiểm tra của kho báo đỏ ngay ở commit đầu. Người dùng sẽ thấy CI đỏ khi chưa làm gì sai.
  Căn cứ: Chỉ gặp ở kho chép lớp CI từ bản kit cũ; người dùng thoát được bằng cách chép lại theo đợt phát hành, không mất dữ liệu, và hợp đồng đã chủ ý để chép lại theo đợt.
  file: `scripts/lo-trinh-khoi-tao.mjs`
  severity: low
  Đề xuất: known-limits

- **Comments in product-map.mjs ended up in the wrong place after the new code was inserted (r1)**
  Người dùng thấy gì: Người đọc mã sẽ gán nhầm chú thích cho hàm bên cạnh. Người dùng cuối không thấy ảnh hưởng nào.
  Căn cứ: Không đổi hành vi nào; chỉ gây hiểu nhầm nhẹ cho người bảo trì và sẽ được dọn khi file đó được chạm lần sau.
  file: `scripts/product-map.mjs`
  severity: low
  Đề xuất: wont-fix

- **The comment on CHUA_CO_VIEC claims a single source for the card and the init step, but neither the init step nor the test reads it (r1)**
  Người dùng thấy gì: Chú thích nói có một nguồn chung cho câu «chưa có việc nào» nhưng thật ra câu được chép ở hai nơi. Nếu sau này sửa một nơi, hai câu có thể lệch nhau mà không ai báo.
  Căn cứ: Hiện hai câu vẫn khớp với chuỗi hợp đồng đã ghim, nên người dùng không thấy gì; rủi ro lệch chỉ xuất hiện khi có người sửa chữ sau này và khi đó bộ kiểm tra sẽ đỏ.
  file: `scripts/lo-trinh.mjs`
  severity: low
  Đề xuất: wont-fix

- **lo-trinh-khoi-tao.mjs: chạy qua đường dẫn symlink thì không làm gì, thoát 0 và không in dòng nào (thành công giả) (r1)**
  Người dùng thấy gì: Nếu gói được cài qua một thư mục là đường tắt, lệnh khởi tạo lộ trình im lặng không làm gì và báo xong. Kho tưởng đã có lộ trình nhưng thật ra không có, và phải tới khi kiểm tra đỏ mới biết.
  Căn cứ: Hậu quả khá khó thấy vì không có thông báo lỗi, nhưng không mất dữ liệu và người dùng chạy lại bằng đường dẫn thật là xong; chỉ xảy ra ở cách cài có đường tắt, và sửa rẻ.
  file: `scripts/lo-trinh-khoi-tao.mjs`
  severity: medium
  Đề xuất: known-limits

- **Báo «từ chối, không ghi» (exit 2) nhưng config.yaml đã bị sửa khi lo_trinh.tep trỏ ra ngoài kho (r1)**
  Người dùng thấy gì: Khi kho khai tệp lộ trình nằm ngoài kho, lệnh báo «từ chối, không ghi» nhưng đã thêm một dòng miễn trừ vào cấu hình. Người dùng thấy một thay đổi chưa commit mà lệnh đã nói là không có.
  Căn cứ: Chỉ một dòng cấu hình vô hại, thấy được ngay khi xem thay đổi và gỡ được bằng một lệnh hoàn tác; chỉ gặp ở kho khai đường dẫn bất thường.
  file: `scripts/lo-trinh-khoi-tao.mjs`
  severity: medium
  Đề xuất: known-limits

- **KM-9 báo PASS khi đo được 0 kho «không bật» (r1)**
  Người dùng thấy gì: Khi mọi kho trên máy đều đã cài road-map, phép đo trên các kho thật vẫn báo xanh dù không đo kho nào. Người dùng có thể tin nhầm là các kho khác đã được kiểm.
  Căn cứ: Hôm nay chưa kho nào cài road-map nên phép đo vẫn có đối tượng; rủi ro chỉ xuất hiện sau này khi triển khai rộng, và sửa bằng một điều kiện đếm rất rẻ.
  file: `tests/scripts/kho-moi-cai-goi-road-map-cac-kho.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 5 (ma trận lớp mà phần tử rỗng): KM-5-dut-4 không đo được bước 4 vì kho thử không có lớp CI (r1)**
  Người dùng thấy gì: Lời hứa «đứt giữa chừng thì chạy lại là xong» chưa từng được thử cho bước chép công cụ kiểm tra vào kho. Nếu việc chép dang dở, chưa có bằng chứng là chạy lại sẽ sửa được.
  Căn cứ: Chỉ ảnh hưởng kho đã chép lớp CI và bị đứt đúng lúc chép; người dùng chạy lại lệnh thường sẽ ổn, không mất dữ liệu, và dựng thêm một ca với kho có lớp CI là việc rẻ.
  file: `tests/scripts/kho-moi-cai-goi-road-map.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (âm tính đứng một mình): KM-9-kit chỉ ghim «thoát 0 + 0 byte», không ghim dòng «lộ trình đã sẵn» (r1)**
  Người dùng thấy gì: Bộ kiểm tra không phân biệt được «kho đã có lộ trình đầy đủ» với «công cụ không nhận ra kho đã bật». Nếu nhận diện hỏng thì vẫn xanh.
  Căn cứ: Không ảnh hưởng người dùng hôm nay vì hành vi thật không đổi byte nào; chỉ làm lưới kiểm tra mù ở một chiều, thêm một dòng ghim là đủ.
  file: `tests/scripts/kho-moi-cai-goi-road-map-cac-kho.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (âm tính đứng một mình): KM-3-append-trung ghim mã 2 trong khi config-patch có hai lối từ chối cùng mã 2 (r1)**
  Người dùng thấy gì: Bộ kiểm tra không phân biệt hai lý do từ chối cùng một mã, nên nếu chế độ thêm hỏng nó vẫn xanh. Người dùng không thấy gì hôm nay.
  Căn cứ: Không đụng dữ liệu hay hành vi của người dùng; chỉ là lưới kiểm tra mỏng ở một ca và sửa sau rất rẻ.
  file: `tests/scripts/kho-moi-cai-goi-road-map.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 (âm tính đứng một mình): KM-9 xanh với 0 kho thực đo khi mọi kho dò được đều đã bật (r1)**
  Người dùng thấy gì: Phép đo trên các kho thật có thể báo xanh mà không đo kho nào khi mọi kho đã cài road-map. Người dùng có thể tin nhầm là đã kiểm đủ.
  Căn cứ: Hôm nay chưa kho nào cài road-map nên chưa gây hại; rủi ro đến dần khi triển khai rộng và sửa bằng một điều kiện đếm rất rẻ.
  file: `tests/scripts/kho-moi-cai-goi-road-map-cac-kho.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 3 (chỉ kiểm «chuỗi có mặt» trong khi lời hứa là quan hệ): KM-8 kiểm bước 1 bằng includes('5d') (r1)**
  Người dùng thấy gì: Nếu ai đó sau này sửa lời dặn để 5d bị xếp vào nhóm bước bỏ qua, bộ kiểm tra vẫn xanh. Kho cấu hình sẵn có thể bị bỏ qua việc tạo lộ trình mà không ai báo.
  Căn cứ: Hôm nay lời dặn đúng nên người dùng không bị ảnh hưởng; rủi ro chỉ xuất hiện khi có người sửa lời dặn, và ghim chặt hơn là việc rẻ.
  file: `tests/scripts/kho-moi-cai-goi-road-map.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 3 (quan hệ round-trip bị pha lẫn): tập mã thoát quan sát gom cả lượt chạy của bản sao bị tiêm (r1)**
  Người dùng thấy gì: Về lý thuyết, bảng mã thoát có thể được coi là đã kiểm nhờ kết quả của bản sao cố tình làm hỏng. Hôm nay không gây sai kết quả nào cho người dùng.
  Căn cứ: Không có hậu quả thật cho người dùng ở hiện tại và chi phí sửa không tương xứng với một rủi ro chỉ mang tính cấu trúc.
  file: `tests/scripts/kho-moi-cai-goi-road-map.test.mjs`
  severity: low
  Đề xuất: wont-fix

- **Phép HOẶC trong thông điệp ghim (thuộc hình dạng 4): KM-6-do nhận cả «MODULE_NOT_FOUND» bất kỳ (r1)**
  Người dùng thấy gì: Bộ kiểm tra chấp nhận bất kỳ lỗi thiếu module nào chứ không riêng module bị gỡ, nên có thể xanh vì một lý do khác. Người dùng không thấy ảnh hưởng.
  Căn cứ: Hợp đồng đã chủ ý cho phép cả hai vế và không ảnh hưởng hành vi của người dùng; chỉ làm thước đỏ kém đặc hiệu một chút.
  file: `tests/scripts/kho-moi-cai-goi-road-map.test.mjs`
  severity: low
  Đề xuất: wont-fix

## Ghi chú gộp trùng

Năm finding trùng đã gộp vào mục gốc để thẻ Cổng 2 không đếm đôi: lỗi gọi qua symlink (t1 và t6, gộp vào mục đầu) · thoát 2 sau khi đã sửa config (t2 và t7, gộp vào mục thứ hai) · KM-9 xanh với 0 kho đo (t8 và t16, gộp vào mục KM-9) · phép HOẶC của KM-6-do (t4 và t18, gộp vào mục KM-6-do) · KM-3-append-trung chỉ ghim mã thoát (t3 và t13, giữ cả hai vì t3 gộp thêm KM-9-kit). Mười chín mục ngoài hợp đồng từ vòng trước được máy tự chèn kèm nhãn vòng, không in lại ở đây.

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).

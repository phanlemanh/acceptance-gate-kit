# Review findings: kho-moi-cai-goi-road-map (round 1)

## Trong hợp đồng

- **Hình dạng 4 (âm tính đứng một mình): đối chứng KM-4-truoc chỉ ghim mã thoát 1, không ghim thông điệp và không kiểm các bước dựng**
  file: tests/scripts/kho-moi-cai-goi-road-map.test.mjs:272
  severity: medium
  AC: AC-4
  source: measurement
  detail: KM-4-truoc là đối chứng «số đo trước» của AC-4. PASS khi `c.status === 1` và không kiểm gì trong stderr/stdout. Hai bước dựng fixture ở dòng 270–271 (config-patch khai lo_trinh.tep và product-map.mjs vẽ) cũng không kiểm mã thoát. product-map --check thoát 1 vì nhiều lý do: trang LO-TRINH lệch, PRODUCT-MAP.md lệch, bản đồ đã xoá… nên ca không chứng minh được khoảng hở mà vòng này đóng (thiếu tệp lộ trình hoặc thiếu miễn trừ). Tương phản: KM-3-do ở cùng tệp đã ghim đúng thông điệp «không glob nào trong risk_tiers.t1_skip_globs phủ LO-TRINH.html».
  rationale: AC-4 ghi rõ ca đối chứng «thoát 1 (ca ghim mã và câu)» mà ca chỉ ghim mã thoát, nên chưa làm đúng chữ của AC-4.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Exit 2 "refused, nothing written" is false: the out-of-repo path check runs after step 2 has already written the config**
  Người dùng thấy gì: Khi kho khai tệp lộ trình nằm ngoài kho, công cụ báo «từ chối, không ghi gì» nhưng thực ra đã thêm một dòng miễn trừ vào cấu hình của kho. Người dùng tưởng cây còn sạch mà thật ra có một thay đổi chưa commit.
  Căn cứ: Hậu quả nhẹ: chỉ một dòng cấu hình vô hại, hiện ngay trong danh sách thay đổi chưa commit nên người dùng tự gỡ được, và chỉ xảy ra ở kho khai đường dẫn bất thường; sửa sau không đắt nhưng không chặn việc ship.
  file: `scripts/lo-trinh-khoi-tao.mjs`
  severity: medium
  Đề xuất: known-limits

- **KM-3-append-trung relies only on exit code + unchanged tree, with no message pin; the mutant that ignores --append survives**
  Người dùng thấy gì: Bộ kiểm tra không phân biệt được hai lý do từ chối khi thêm trùng một mục miễn trừ, nên nếu chế độ thêm bị hỏng thì bộ kiểm tra vẫn xanh. Người dùng không thấy gì cho tới khi chế độ thêm hỏng thật.
  Căn cứ: Không ảnh hưởng dữ liệu hay hành vi người dùng hôm nay; chỉ làm lưới kiểm tra yếu đi một chỗ, thêm một dòng ghim thông điệp sau này rất rẻ.
  file: `tests/scripts/kho-moi-cai-goi-road-map.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Step 5 draws LO-TRINH.html with the kit's renderer while the repo's CI checks with its own copies, which may differ**
  Người dùng thấy gì: Nếu bản công cụ kiểm tra chép sẵn trong kho cũ hơn bản trong gói, trang lộ trình vẽ lúc khởi tạo có thể bị kiểm tra của kho báo đỏ ngay ở commit đầu. Người dùng sẽ thấy CI đỏ khi chưa làm gì sai.
  Căn cứ: Chỉ gặp ở kho chép lớp CI từ bản kit cũ; người dùng thoát được bằng cách chép lại theo đợt phát hành, không mất dữ liệu, và hợp đồng đã chủ ý để chép lại theo đợt.
  file: `scripts/lo-trinh-khoi-tao.mjs`
  severity: low
  Đề xuất: known-limits

- **Comments in product-map.mjs ended up in the wrong place after the new code was inserted**
  Người dùng thấy gì: Người đọc mã sẽ gán nhầm chú thích cho hàm bên cạnh. Người dùng cuối không thấy ảnh hưởng nào.
  Căn cứ: Không đổi hành vi nào; chỉ gây hiểu nhầm nhẹ cho người bảo trì và sẽ được dọn khi file đó được chạm lần sau.
  file: `scripts/product-map.mjs`
  severity: low
  Đề xuất: wont-fix

- **The comment on CHUA_CO_VIEC claims a single source for the card and the init step, but neither the init step nor the test reads it**
  Người dùng thấy gì: Chú thích nói có một nguồn chung cho câu «chưa có việc nào» nhưng thật ra câu được chép ở hai nơi. Nếu sau này sửa một nơi, hai câu có thể lệch nhau mà không ai báo.
  Căn cứ: Hiện hai câu vẫn khớp với chuỗi hợp đồng đã ghim, nên người dùng không thấy gì; rủi ro lệch chỉ xuất hiện khi có người sửa chữ sau này và khi đó bộ kiểm tra sẽ đỏ.
  file: `scripts/lo-trinh.mjs`
  severity: low
  Đề xuất: wont-fix

- **lo-trinh-khoi-tao.mjs: chạy qua đường dẫn symlink thì không làm gì, thoát 0 và không in dòng nào (thành công giả)**
  Người dùng thấy gì: Nếu gói được cài qua một thư mục là đường tắt, lệnh khởi tạo lộ trình im lặng không làm gì và báo xong. Kho tưởng đã có lộ trình nhưng thật ra không có, và phải tới khi kiểm tra đỏ mới biết.
  Căn cứ: Hậu quả khá khó thấy vì không có thông báo lỗi, nhưng không mất dữ liệu và người dùng chạy lại bằng đường dẫn thật là xong; chỉ xảy ra ở cách cài có đường tắt, và sửa rẻ.
  file: `scripts/lo-trinh-khoi-tao.mjs`
  severity: medium
  Đề xuất: known-limits

- **Báo «từ chối, không ghi» (exit 2) nhưng config.yaml đã bị sửa khi lo_trinh.tep trỏ ra ngoài kho**
  Người dùng thấy gì: Khi kho khai tệp lộ trình nằm ngoài kho, lệnh báo «từ chối, không ghi» nhưng đã thêm một dòng miễn trừ vào cấu hình. Người dùng thấy một thay đổi chưa commit mà lệnh đã nói là không có.
  Căn cứ: Chỉ một dòng cấu hình vô hại, thấy được ngay khi xem thay đổi và gỡ được bằng một lệnh hoàn tác; chỉ gặp ở kho khai đường dẫn bất thường.
  file: `scripts/lo-trinh-khoi-tao.mjs`
  severity: medium
  Đề xuất: known-limits

- **KM-9 báo PASS khi đo được 0 kho «không bật»**
  Người dùng thấy gì: Khi mọi kho trên máy đều đã cài road-map, phép đo trên các kho thật vẫn báo xanh dù không đo kho nào. Người dùng có thể tin nhầm là các kho khác đã được kiểm.
  Căn cứ: Hôm nay chưa kho nào cài road-map nên phép đo vẫn có đối tượng; rủi ro chỉ xuất hiện sau này khi triển khai rộng, và sửa bằng một điều kiện đếm rất rẻ.
  file: `tests/scripts/kho-moi-cai-goi-road-map-cac-kho.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 5 (ma trận lớp mà phần tử rỗng): KM-5-dut-4 không đo được bước 4 vì kho thử không có lớp CI**
  Người dùng thấy gì: Lời hứa «đứt giữa chừng thì chạy lại là xong» chưa từng được thử cho bước chép công cụ kiểm tra vào kho. Nếu việc chép dang dở, chưa có bằng chứng là chạy lại sẽ sửa được.
  Căn cứ: Chỉ ảnh hưởng kho đã chép lớp CI và bị đứt đúng lúc chép; người dùng chạy lại lệnh thường sẽ ổn, không mất dữ liệu, và dựng thêm một ca với kho có lớp CI là việc rẻ.
  file: `tests/scripts/kho-moi-cai-goi-road-map.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (âm tính đứng một mình): KM-9-kit chỉ ghim «thoát 0 + 0 byte», không ghim dòng «lộ trình đã sẵn»**
  Người dùng thấy gì: Bộ kiểm tra không phân biệt được «kho đã có lộ trình đầy đủ» với «công cụ không nhận ra kho đã bật». Nếu nhận diện hỏng thì vẫn xanh.
  Căn cứ: Không ảnh hưởng người dùng hôm nay vì hành vi thật không đổi byte nào; chỉ làm lưới kiểm tra mù ở một chiều, thêm một dòng ghim là đủ.
  file: `tests/scripts/kho-moi-cai-goi-road-map-cac-kho.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (âm tính đứng một mình): KM-3-append-trung ghim mã 2 trong khi config-patch có hai lối từ chối cùng mã 2**
  Người dùng thấy gì: Bộ kiểm tra không phân biệt hai lý do từ chối cùng một mã, nên nếu chế độ thêm hỏng nó vẫn xanh. Người dùng không thấy gì hôm nay.
  Căn cứ: Không đụng dữ liệu hay hành vi của người dùng; chỉ là lưới kiểm tra mỏng ở một ca và sửa sau rất rẻ.
  file: `tests/scripts/kho-moi-cai-goi-road-map.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 (âm tính đứng một mình): KM-9 xanh với 0 kho thực đo khi mọi kho dò được đều đã bật**
  Người dùng thấy gì: Phép đo trên các kho thật có thể báo xanh mà không đo kho nào khi mọi kho đã cài road-map. Người dùng có thể tin nhầm là đã kiểm đủ.
  Căn cứ: Hôm nay chưa kho nào cài road-map nên chưa gây hại; rủi ro đến dần khi triển khai rộng và sửa bằng một điều kiện đếm rất rẻ.
  file: `tests/scripts/kho-moi-cai-goi-road-map-cac-kho.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 3 (chỉ kiểm «chuỗi có mặt» trong khi lời hứa là quan hệ): KM-8 kiểm bước 1 bằng includes('5d')**
  Người dùng thấy gì: Nếu ai đó sau này sửa lời dặn để 5d bị xếp vào nhóm bước bỏ qua, bộ kiểm tra vẫn xanh. Kho cấu hình sẵn có thể bị bỏ qua việc tạo lộ trình mà không ai báo.
  Căn cứ: Hôm nay lời dặn đúng nên người dùng không bị ảnh hưởng; rủi ro chỉ xuất hiện khi có người sửa lời dặn, và ghim chặt hơn là việc rẻ.
  file: `tests/scripts/kho-moi-cai-goi-road-map.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 3 (quan hệ round-trip bị pha lẫn): tập mã thoát quan sát gom cả lượt chạy của bản sao bị tiêm**
  Người dùng thấy gì: Về lý thuyết, bảng mã thoát có thể được coi là đã kiểm nhờ kết quả của bản sao cố tình làm hỏng. Hôm nay không gây sai kết quả nào cho người dùng.
  Căn cứ: Không có hậu quả thật cho người dùng ở hiện tại và chi phí sửa không tương xứng với một rủi ro chỉ mang tính cấu trúc.
  file: `tests/scripts/kho-moi-cai-goi-road-map.test.mjs`
  severity: low
  Đề xuất: wont-fix

- **Phép HOẶC trong thông điệp ghim (thuộc hình dạng 4): KM-6-do nhận cả «MODULE_NOT_FOUND» bất kỳ**
  Người dùng thấy gì: Bộ kiểm tra chấp nhận bất kỳ lỗi thiếu module nào chứ không riêng module bị gỡ, nên có thể xanh vì một lý do khác. Người dùng không thấy ảnh hưởng.
  Căn cứ: Hợp đồng đã chủ ý cho phép cả hai vế và không ảnh hưởng hành vi của người dùng; chỉ làm thước đỏ kém đặc hiệu một chút.
  file: `tests/scripts/kho-moi-cai-goi-road-map.test.mjs`
  severity: low
  Đề xuất: wont-fix

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).

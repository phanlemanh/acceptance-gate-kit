# Review findings: t3-can-ho-so-arm (round 2)

## Trong hợp đồng

(không có finding nào map được vào AC)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Các ca phá thử theo lý do chỉ kiểm chuỗi vắng mặt, nên bản sao hỏng vẫn xanh**
  Người dùng thấy gì: Bài kiểm tra tự thử của cổng có thể báo xanh dù bản thử đã hỏng giữa chừng, nên có lúc ta tưởng một luật chặn đã được chứng minh sống mà thực ra chưa. Cổng thật vẫn chặn đúng trên các ca hiện có.
  Căn cứ: Hậu quả nhẹ vì chỉ làm bằng chứng kiểm thử yếu đi chứ không làm cổng chặn sai hay lọt người dùng, hiện mọi ca vẫn đạt trên bản thật, và việc siết lại có thể làm sau mà không mất gì.
  file: `tests/scripts/t3-can-ho-so-arm.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (assertion âm-tính-một-mình): 12 ca đột biến lý do chỉ đòi chuỗi lý do biến mất, không ghim bản đột biến đã chạy tới luật**
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

- **Hình dạng 4: đột biến lý do chỉ assert âm tính trên bản tiêm, không có đối chứng dương (r1 · tệp đã đổi)**
  Người dùng thấy gì: Phép thử gỡ nhánh có thể xanh vì bản sao bị hỏng chứ không phải vì lý do chặn đã biến mất, nên bằng chứng yếu hơn vẻ ngoài.
  Căn cứ: Rủi ro là kiểm thử xanh giả, không ảnh hưởng người dùng cuối trực tiếp; sửa rẻ nhưng không gấp.
  file: `tests/scripts/t3-can-ho-so-arm.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4: HA27-bien chỉ đòi không clean, không ghim thông điệp (r1 · tệp đã đổi)**
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

- **Hình dạng 2: dòng cho nghỉ của HA21 là hằng gõ tay, chỉ được bộ đọc xác nhận (r1 · tệp đã đổi)**
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

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).

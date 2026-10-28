## Trong hợp đồng

(không có finding nào map được vào AC)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Commit máy của S3 cuốn luôn việc dở chưa commit khi lệnh sinh lại ghi vào một tệp vốn đã bẩn**
  Người dùng thấy gì: Nếu người đang sửa dở một tệp mà lệnh sinh lại của kho cũng ghi vào đúng tệp đó, phần sửa dở của người sẽ bị gói luôn vào commit do máy tạo, không báo trước.
  Căn cứ: Hậu quả vừa phải: không mất dữ liệu vì phần sửa dở vẫn nằm trong lịch sử và hoàn lại được, chỉ lẫn vào commit sai chỗ; chỉ xảy ra khi một tệp vừa bị người sửa dở vừa là đầu ra của lệnh sinh lại, nên đủ hiếm để ghi vào giới hạn đã biết.
  file: `scripts/design-floor-s3.mjs`
  severity: medium
  Đề xuất: known-limits

- **Theo đúng đường phục hồi SKILL chỉ cho thoát 1 thì lần chạy lại tự kẹt ở thoát 2, do chính trang lệnh vừa autofix**
  Người dùng thấy gì: Khi một lệnh sinh lại hỏng giữa chừng, các trang máy đã tự sửa vẫn còn trên cây chưa commit. Người sửa lệnh rồi chạy lại sẽ bị chặn vì chính phần máy vừa làm, và phải tự dọn tay.
  Căn cứ: Gây vướng và tốn một lượt người can thiệp, nhưng không mất dữ liệu và người tự gỡ được bằng cách hoàn lại hoặc commit các trang đó; chỉ xảy ra khi lệnh sinh lại hỏng, nên chấp nhận ghi giới hạn và cân nhắc sửa ở vòng sau.
  file: `scripts/design-floor-s3.mjs`
  severity: medium
  Đề xuất: known-limits

- **S4 quét cả tệp nhị phân (ảnh, font) khớp surface_globs, báo hex thô giả và chặn vòng**
  Người dùng thấy gì: Khi một vòng thêm hoặc sửa ảnh hay font trong vùng giao diện, bước chấm có thể báo nhầm là có màu viết thẳng và chặn vòng dù không có lỗi thật.
  Căn cứ: Hậu quả nặng với người dùng kit vì vòng bị chặn oan khá thường xuyên (khoảng bốn phần mười số lần chạm ảnh hay font) và buộc người phải gọi lại hoặc kiểm tay; không mất dữ liệu nhưng làm chậm đúng thứ kit sinh ra để làm nhanh, và sửa khá rẻ nên nên đưa vào một hợp đồng riêng.
  file: `scripts/design-floor-s4.mjs`
  severity: high
  Đề xuất: new-contract

- **S3 đưa việc dở của người vào commit máy khi lệnh sinh lại chạm một tệp vốn đã bẩn; ngược lại, tệp dẫn xuất đã sinh sẵn thì bị bỏ ngoài commit mà không báo**
  Người dùng thấy gì: Phần sửa dở của người có thể bị gói vào commit máy nếu lệnh sinh lại ghi tiếp vào cùng tệp. Ngược lại, tệp sinh sẵn chưa commit có thể bị bỏ sót mà không có cảnh báo, nên vòng sang bước chấm với tệp chưa vào commit.
  Căn cứ: Không mất dữ liệu và người hoàn lại hoặc commit bù được, nhưng cả hai chiều đều im lặng nên người dễ không biết; điều kiện kích hoạt hẹp nên ghi giới hạn đã biết và dặn người kiểm cây trước khi chạy.
  file: `scripts/design-floor-s3.mjs`
  severity: medium
  Đề xuất: known-limits

- **Gọi autofix bằng spawnSync với maxBuffer mặc định 1 MB: trang HTML lớn bị ghi nhưng báo lỗi, và lần chạy lại kẹt ở thoát 2**
  Người dùng thấy gì: Với trang giao diện rất lớn (cỡ một megabyte), bước tự sửa vẫn ghi trang nhưng báo lỗi, và người không đọc được lý do vì thông báo của lệnh bị nuốt. Lần chạy lại sau đó lại bị chặn.
  Căn cứ: Chỉ xảy ra với trang HTML cực lớn nên hiếm, không mất dữ liệu và người tự hoàn lại được; sửa rẻ nhưng hậu quả thấp nên ghi giới hạn là đủ.
  file: `scripts/design-floor-s4.mjs`
  severity: medium
  Đề xuất: known-limits

- **Ca S4-CHI-DOC không có đối chứng dương: lệnh S4 chết vẫn ra XANH**
  Người dùng thấy gì: Bộ kiểm có thể báo xanh cho cam kết bước chấm không ghi gì lên cây ngay cả khi bước chấm chết ngay từ đầu, nên màu xanh đó chứng minh được ít hơn vẻ ngoài của nó.
  Căn cứ: Người dùng cuối không bị ảnh hưởng trực tiếp; rủi ro là một lỗi sau này lọt qua mà bộ kiểm vẫn xanh, và sửa rất rẻ (thêm một điều kiện đối chứng) nên có thể ghi lại rồi vá ở vòng bảo trì.
  file: `tests/design-floor/moc-s3-s4.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 1 (đo chỉ dẫn thay vì đầu ra): răng ui gate quét chữ trong SKILL và mã nguồn lệnh S4, không quan sát lệnh S4 thật gọi gì**
  Người dùng thấy gì: Chốt chặn việc kiểm tra thiết kế không được dùng lệnh cổng giao diện chỉ nhìn vào chữ trong mã, nên có thể bỏ sót cách gọi viết khác đi hoặc báo đỏ nhầm vì một dòng chú thích.
  Căn cứ: Hậu quả nhẹ: chỉ ảnh hưởng độ tin của một chốt nội bộ, không chạm người dùng cuối; hợp đồng đã chủ ý đo theo cách này nên ghi giới hạn là đủ.
  file: `tests/design-floor/moc-s3-s4.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 (tuyên cả lớp nhưng chỉ thử một điểm): AC-5 hứa «mã khác (hay lệnh chết) → lệnh ui lỗi», ca S4-TC chỉ thử mã 1**
  Người dùng thấy gì: Bộ kiểm chỉ thử một trường hợp lệnh giao diện hỏng, nên nếu sau này mã lạ khác bị xử lý thành không chặn thì không ai biết và vòng có thể lọt qua dù công cụ đo đã hỏng.
  Căn cứ: Hậu quả hiện tại chưa xảy ra vì hành vi thật chưa bị chứng minh sai; rủi ro chỉ là lỗi tương lai lọt qua im lặng, bổ sung ca kiểm rẻ nên nên ghi lại để vá sau.
  file: `tests/design-floor/moc-s3-s4.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (khẳng định âm tính đứng một mình): vế «kho đã khai executors.design.floor thì không in dòng» của BAC-FLOOR không có đối chứng dương**
  Người dùng thấy gì: Bộ kiểm có thể báo xanh cho trường hợp kho đã nối sẵn bước chấm ngay cả khi lệnh bậc thực ra đã lỗi và im lặng vì chết, nên màu xanh đó yếu hơn vẻ ngoài.
  Căn cứ: Không ảnh hưởng trực tiếp người dùng cuối, chỉ làm một chốt nội bộ kém tin; sửa rẻ nên ghi giới hạn rồi vá ở lần bảo trì kế tiếp.
  file: `tests/design-floor/moc-s3-s4.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 (chỉ kiểm một chuỗi có mặt): S3-AUTOFIX chỉ kiểm có thẻ viewport, trong khi E1 hứa đầu ra không còn lỗi sàn nào đã cài**
  Người dùng thấy gì: Bộ kiểm chỉ xác nhận một loại lỗi trang được sửa, nên nếu bước tự sửa bỏ sót loại lỗi khác (như mã định danh trùng) thì bộ kiểm vẫn xanh.
  Căn cứ: Hậu quả nhẹ và gián tiếp: chỉ làm độ tin của bộ kiểm thấp hơn lời hứa, không mất dữ liệu và người tự thấy lỗi còn lại trên trang; ghi giới hạn là đủ.
  file: `tests/design-floor/moc-s3-s4.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 3 (chỉ kiểm một chuỗi có mặt): S3-DICH-BAN hứa «băm cây không đổi» nhưng chỉ so băm một tệp**
  Người dùng thấy gì: Bộ kiểm chỉ kiểm một tệp không đổi khi lệnh bị chặn vì cây đang bẩn, nên nếu lệnh lỡ ghi vào tệp khác trước khi dừng thì bộ kiểm không phát hiện.
  Căn cứ: Hậu quả nhẹ vì chưa có bằng chứng lệnh thật sự ghi tệp khác; chỉ là lưới kiểm hẹp hơn lời hứa, sửa rẻ bằng ảnh chụp cả cây nên ghi lại để vá sau.
  file: `tests/design-floor/moc-s3-s4.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).

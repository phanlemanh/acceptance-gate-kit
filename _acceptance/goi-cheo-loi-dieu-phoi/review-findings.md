# Review findings: goi-cheo-loi-dieu-phoi (round 3)

## Trong hợp đồng

(không có)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **evals.yaml: paths của E1–E8, E10, E16 bỏ sót luat-doi-chu.mjs (thư viện dựng bố cục mà cả hai thước nạp) và scripts/tim-skill.cjs, nên lượt sửa có thể mang màu xanh cũ sang**
  Người dùng thấy gì: Một lần sửa sau này chỉ chạm thư viện dựng bố cục có thể được coi là đã kiểm vì kết quả xanh cũ được mang sang, dù các phép kiểm chưa chạy lại.
  Căn cứ: Chỉ ảnh hưởng các lượt sửa tương lai của chính bộ kiểm, không ảnh hưởng người dùng sản phẩm hiện tại, và thêm đường dẫn vào danh sách là việc rẻ, làm sau được.
  file: `_acceptance/goi-cheo-loi-dieu-phoi/evals.yaml`
  severity: medium
  Đề xuất: known-limits

- **chan-lo-trinh.cjs nạp cứng ho-goi.cjs ngay lúc load: thiếu tệp này thì lưới trước-gộp ra VIOLATION ở cả kho không bật luật chặn, phá hợp đồng «kho không bật → không in gì»**
  Người dùng thấy gì: Nếu một kho chỉ chép bản mới của một tệp mà quên tệp đi kèm, mọi PR của kho đó bị chặn nhầm kể cả khi họ không bật luật chặn lộ trình.
  Căn cứ: Hậu quả chặn PR nhưng chỉ xảy ra khi chép thiếu tệp, người dùng tự gỡ được bằng cách chép đủ tệp, và sửa sau rẻ.
  file: `lib/chan-lo-trinh.cjs`
  severity: low
  Đề xuất: known-limits

- **Danh sách bốn tệp hộp thư HOP_THU được chép tay vào ba tệp test; thêm tệp dùng chung thứ năm thì nhát tiêm ở hai ca cửa tín hiệu chỉ đánh một bản, và chiều đỏ chết lặng**
  Người dùng thấy gì: Nếu sau này thêm một tệp vào hộp thư, một số phép kiểm có thể vẫn xanh dù chỉ kiểm một trong hai bản, nên lỗi có thể lọt qua.
  Căn cứ: Chưa gây hại cho người dùng hôm nay, chỉ phát sinh khi có thay đổi sau, và sửa sau không đắt.
  file: `tests/scripts/cua-tin-hieu-goc-moi-worktree.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Assertion âm-tính-một-mình (hình dạng 4): VP-DO coi MỌI khác biệt là «phép so đỏ», không ghim thông điệp và không có đối chứng dương trên chính bản sao**
  Người dùng thấy gì: Phép kiểm chứng tỏ bộ so sánh biết bắt lỗi có thể xanh vì một lý do khác lỗi định bắt, nên độ tin cậy của nó thấp hơn vẻ ngoài.
  Căn cứ: Chỉ làm yếu một phép tự kiểm của bộ đo, không làm sản phẩm sai với người dùng, và có thể siết sau.
  file: `_acceptance/goi-cheo-loi-dieu-phoi/rang/vi-phan-cu.mjs`
  severity: low
  Đề xuất: known-limits

- **Đo sai cây (biến thể hình dạng 6): VP-HT đo commit HEAD của KIT trong khi ma trận VP-1…16 đo cây làm việc**
  Người dùng thấy gì: Khi có sửa đổi chưa commit ở tệp cửa tín hiệu, một phép kiểm có thể phán trên bản cũ đã commit thay vì bản đang kiểm.
  Căn cứ: Chỉ lệch trong lúc làm việc, sau khi commit thì đúng trở lại, nên người dùng không bị ảnh hưởng và tự tránh được.
  file: `_acceptance/goi-cheo-loi-dieu-phoi/rang/vi-phan-cu.mjs`
  severity: low
  Đề xuất: known-limits

- **Tuyên quét lớp mà danh sách viết tay đóng (hình dạng 5): HOP_THU chép tay ở ba tệp, GN-2 không rút tập tệp từ scripts/hop-thu/**
  Người dùng thấy gì: Nếu thêm tệp mới vào hộp thư mà quên cập nhật danh sách, phép kiểm bản sao đồng nhất vẫn xanh mà không so tệp ấy.
  Căn cứ: Rủi ro chỉ xuất hiện khi thêm tệp trong tương lai, không làm hỏng gì hôm nay, và sửa sau rẻ.
  file: `tests/scripts/mot-nguon-ten-va-hop-thu.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Đo checkout thay vì cây được dựng (hình dạng 6): nửa «bố cục cũ» của BC-7 và BC-8 luôn đọc KIT, kể cả khi chạy --ref hay --chieu-do**
  Người dùng thấy gì: Khi chạy kiểm trên một bản cũ cụ thể, phần kiểm bố cục cũ vẫn đọc bản đang làm việc, nên thông điệp xanh có thể mô tả sai bản.
  Căn cứ: Hiện chưa gây kết quả sai nào, chỉ là sai mô tả có thể xảy ra, và khắc phục sau không đắt.
  file: `_acceptance/goi-cheo-loi-dieu-phoi/rang/bo-cuc-moi.mjs`
  severity: low
  Đề xuất: known-limits

- **BC-8 nửa «bố cục cũ» đo cây KIT (checkout của tác giả) thay vì cây của --ref (r2)**
  Người dùng thấy gì: Khi người dùng nhờ kiểm một phiên bản khác bằng cờ chọn phiên bản, phần kiểm cách bố trí cũ vẫn đọc bản đang đứng, nên kết quả có thể xanh hoặc đỏ nhầm. Hai cách chạy đang dùng thật (mặc định và chiều đỏ) không bị ảnh hưởng.
  Căn cứ: Chỉ lộ ra ở một cách chạy chưa ai dùng, nhẹ với người dùng, họ tự nhận ra và chạy lại được; ghi giới hạn là đủ, sửa sau vẫn rẻ.
  file: `_acceptance/goi-cheo-loi-dieu-phoi/rang/bo-cuc-moi.mjs`
  severity: low
  Đề xuất: known-limits

- **BC-8 ở chế độ --ref vẫn đo nửa «bố cục cũ» và bộ giải gốc lõi trên cây đang kiểm, không trên ref (r2)**
  Người dùng thấy gì: Kiểm một phiên bản chỉ định bằng cờ chọn phiên bản có thể cho kết quả cách bố trí cũ theo bản đang đứng thay vì bản được chọn. Cách chạy mặc định không bị ảnh hưởng.
  Căn cứ: Hậu quả hẹp và nhẹ, không mất dữ liệu, người dùng chạy lại ở bản sạch là biết; không đáng mở việc riêng.
  file: `_acceptance/goi-cheo-loi-dieu-phoi/rang/bo-cuc-moi.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 6 (đo checkout thay vì cây đang kiểm): nửa «bố cục cũ» của BC-8 luôn chạy trên checkout KIT, kể cả khi bộ dựng đang ở chế độ --ref (r2)**
  Người dùng thấy gì: Khi kiểm một phiên bản chỉ định, phần bố cục cũ có thể phản ánh bản đang đứng cùng thay đổi chưa lưu, nên có thể báo xanh hoặc đỏ sai cho phiên bản đó. Hai cách chạy đang dùng không bị ảnh hưởng.
  Căn cứ: Cùng lỗi với hai phát hiện trên: hiếm gặp, nhẹ, người dùng tự phát hiện và chạy lại được, nên ghi giới hạn thay vì sửa ngay.
  file: `_acceptance/goi-cheo-loi-dieu-phoi/rang/bo-cuc-moi.mjs`
  severity: low
  Đề xuất: known-limits

- **Bảng tên không phải một nguồn: tên chợ và nguồn chợ còn hai bản trong lõi, NGUON_CHO không có bên đọc nào (r1)**
  Người dùng thấy gì: Tên và địa chỉ chợ plugin còn được khai ở hai nơi trong kit; nếu sau này sửa một nơi mà quên nơi kia thì không có gì báo, và người dùng có thể nhận địa chỉ chợ sai.
  Căn cứ: Hiện hai nơi đang khớp nhau nên người dùng chưa bị ảnh hưởng, và nếu lệch thì chỉ cần sửa lại, không mất dữ liệu.
  file: `lib/ho-goi.cjs`
  severity: medium
  Đề xuất: known-limits

- **GN-1 tự chép quy tắc dấu bật-theo-lựa-chọn thay vì gọi bộ đọc thật của plugin-declare (r1)**
  Người dùng thấy gì: Phép kiểm bảng tên tự chép quy tắc nhận biết plugin chọn thêm thay vì dùng quy tắc thật; nếu quy tắc thật đổi, phép kiểm vẫn báo xanh trong khi người dùng thấy danh sách plugin lệch.
  Căn cứ: Rủi ro chỉ xuất hiện khi quy tắc đổi, hiếm và người dùng tự thấy ngay danh sách sai rồi sửa được; sửa sau không đắt.
  file: `tests/scripts/mot-nguon-ten-va-hop-thu.test.mjs`
  severity: low
  Đề xuất: wont-fix

- **Đo checkout thay vì cây đang kiểm (gần hình dạng 6): VP-HT và vế «bố cục cũ» của BC-7 đọc commit HEAD của KIT, không đọc cây làm việc (r1)**
  Người dùng thấy gì: Nếu có sửa đổi chưa lưu vào lịch sử khi chạy kiểm, hai phép kiểm sẽ đo bản đã lưu chứ không phải bản đang sửa, nên có thể báo xanh cho thứ chưa được kiểm.
  Căn cứ: Chỉ xảy ra khi chạy kiểm trên cây còn sửa dở; người dùng cuối không gặp, và chỉ cần lưu thay đổi rồi chạy lại là đúng.
  file: `_acceptance/goi-cheo-loi-dieu-phoi/rang/vi-phan-cu.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).

# Review findings: goi-cheo-loi-dieu-phoi (round 2)

## Trong hợp đồng

Không có phát hiện nào.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **BC-8 nửa «bố cục cũ» đo cây KIT (checkout của tác giả) thay vì cây của --ref**
  Người dùng thấy gì: Khi người dùng nhờ kiểm một phiên bản khác bằng cờ chọn phiên bản, phần kiểm cách bố trí cũ vẫn đọc bản đang đứng, nên kết quả có thể xanh hoặc đỏ nhầm. Hai cách chạy đang dùng thật (mặc định và chiều đỏ) không bị ảnh hưởng.
  Căn cứ: Chỉ lộ ra ở một cách chạy chưa ai dùng, nhẹ với người dùng, họ tự nhận ra và chạy lại được; ghi giới hạn là đủ, sửa sau vẫn rẻ.
  file: `_acceptance/goi-cheo-loi-dieu-phoi/rang/bo-cuc-moi.mjs`
  severity: low
  Đề xuất: known-limits

- **BC-8 ở chế độ --ref vẫn đo nửa «bố cục cũ» và bộ giải gốc lõi trên cây đang kiểm, không trên ref**
  Người dùng thấy gì: Kiểm một phiên bản chỉ định bằng cờ chọn phiên bản có thể cho kết quả cách bố trí cũ theo bản đang đứng thay vì bản được chọn. Cách chạy mặc định không bị ảnh hưởng.
  Căn cứ: Hậu quả hẹp và nhẹ, không mất dữ liệu, người dùng chạy lại ở bản sạch là biết; không đáng mở việc riêng.
  file: `_acceptance/goi-cheo-loi-dieu-phoi/rang/bo-cuc-moi.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 6 (đo checkout thay vì cây đang kiểm): nửa «bố cục cũ» của BC-8 luôn chạy trên checkout KIT, kể cả khi bộ dựng đang ở chế độ --ref**
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

- **Đo checkout thay vì cây đang kiểm (gần hình dạng 6): VP-HT và vế «bố cục cũ» của BC-7 đọc commit HEAD của KIT, không đọc cây làm việc (r1 · tệp đã đổi)**
  Người dùng thấy gì: Nếu có sửa đổi chưa lưu vào lịch sử khi chạy kiểm, hai phép kiểm sẽ đo bản đã lưu chứ không phải bản đang sửa, nên có thể báo xanh cho thứ chưa được kiểm.
  Căn cứ: Chỉ xảy ra khi chạy kiểm trên cây còn sửa dở; người dùng cuối không gặp, và chỉ cần lưu thay đổi rồi chạy lại là đúng.
  file: `_acceptance/goi-cheo-loi-dieu-phoi/rang/vi-phan-cu.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).

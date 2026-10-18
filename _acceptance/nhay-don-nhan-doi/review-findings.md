# Review findings: nhay-don-nhan-doi

## Trong hợp đồng

(không có)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Hình dạng 4 (assertion âm-tính-một-mình): ô đột biến mới «10 unquoteScalar vo don» của BG8 dùng chân BG10a làm thước, nhưng đối chứng dương của BG8 vẫn chỉ chạy BG4,BG9**
  Người dùng thấy gì: Bộ kiểm tra tự động có một ô bắt lỗi chưa tự chứng minh được là đang chạy đúng khi chạy tách riêng. Khi chạy cùng bộ kiểm tra liền kề như bình thường thì ô này vẫn được kiểm gián tiếp, nên người dùng cuối không bị ảnh hưởng.
  Căn cứ: Chỉ ảnh hưởng độ tin cậy của một bài kiểm tra nội bộ ở trường hợp chạy tách riêng, không làm mất hay sai dữ liệu của người dùng; ở cách chạy thường lệ lỗi này đã được phủ gián tiếp, và sửa sau vẫn rẻ.
  file: `tests/scripts/bo-giai-nhay.test.mjs`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).

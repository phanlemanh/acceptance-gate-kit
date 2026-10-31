Findings — chi-tep-vat-keo-xet-lai (round 2)

## Trong hợp đồng

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **phanTepHoSo chỉ đọc `paths`, bỏ `inputs` của eval judgment: tệp chữ mà phép đo đọc tới bị coi là tệp chữ và hồ sơ lọt xét**
  Người dùng thấy gì: Khi một PR chỉ sửa tệp chữ mà phép đánh giá của hồ sơ lại đọc đúng tệp đó, hồ sơ cũ vẫn được cho qua mà không bắt ghim lại bằng chứng. Phán quyết có thể dựa trên chữ đã đổi mà không ai biết.
  Căn cứ: Lỗ này có thật và chạm ba hồ sơ đang có, nhưng chỉ mở ra khi PR chỉ sửa chữ và hồ sơ đã cũ; sửa là một phạm vi riêng nên nên đăng thành việc riêng.
  file: `lib/evidence-core.cjs`
  severity: high
  Đề xuất: new-contract

- **Bộ lọc thu hẹp mới không theo khuôn đóng-mặc-định của staleByPaths/phanLoaiMucPaths: mục paths đọc sai thì lặng lẽ bỏ xét**
  Người dùng thấy gì: Nếu hồ sơ khai đường dẫn đo theo kiểu viết lạ, một PR chỉ sửa chữ có thể được cho qua mà không phải ghim lại bằng chứng cũ. Kiểu viết này hiếm và chỉ xảy ra với hồ sơ đã cũ.
  Căn cứ: Hậu quả nhẹ vì cần đúng kiểu khai hiếm cộng PR chỉ sửa chữ, và có thể ghi lại làm giới hạn đã biết, sửa sau cũng không đắt.
  file: `lib/evidence-core.cjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 (ma trận viết trước mà số ô không được ghim): số ô mỗi ca tự đếm chính nó, lệnh eval không đọc con số ấy**
  Người dùng thấy gì: Nếu ai đó lỡ xoá bớt một ô kiểm khỏi bộ kiểm thử, bộ kiểm vẫn báo xanh nên sự thiếu hụt không bị phát hiện. Người dùng cuối không bị ảnh hưởng trực tiếp.
  Căn cứ: Chỉ làm bộ kiểm kém chắc hơn chứ không làm sản phẩm sai, và dễ phát hiện khi đọc diff; ghi lại làm giới hạn đã biết là đủ.
  file: `tests/scripts/chi-tep-vat-keo-xet-lai.test.mjs`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).

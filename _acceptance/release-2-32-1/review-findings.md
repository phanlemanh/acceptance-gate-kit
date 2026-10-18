## Trong hợp đồng

(không có)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Câu sai «ý chưa commit vẫn xem ở /road-map:xem» lan sang hình và hợp đồng, ngoài phạm vi Ngoài-3**
  Người dùng thấy gì: Một hình minh hoạ và một hợp đồng cũ vẫn nói ý chưa lưu vào kho có thể xem trong bản đồ lộ trình, trong khi thực tế chỉ thấy ở thẻ khởi động. Ai đọc hình có thể tìm sai chỗ.
  Căn cứ: Nhẹ: chỉ làm người đọc hình tìm ý ở sai màn hình, không mất dữ liệu, và bản ghi chú phát hành đã chỉ đúng chỗ xem.
  file: `_acceptance/ve-lo-trinh-doc-tin-hieu-cua-cay/figures/hai-loai-bo-doc.html`
  severity: low
  Đề xuất: known-limits

- **tepTheoDoi swallows every git error and quietly falls back to reading all files, including untracked ideas**
  Người dùng thấy gì: Khi công cụ quản lý phiên bản gặp lỗi lạ trong một kho thật, trang lộ trình lặng lẽ quay về cách cũ và hiện cả những ý chưa lưu vào kho, không báo gì. Đường dẫn tuyệt đối còn có thể làm mọi ý biến mất khỏi trang.
  Căn cứ: Nhẹ đến vừa: chỉ xảy ra khi môi trường git lỗi hoặc cấu hình đường dẫn bất thường, trang chỉ hiện sai danh sách ý chứ không mất dữ liệu, và vẽ lại sau khi sửa môi trường là hết.
  file: `scripts/tin-hieu.mjs`
  severity: low
  Đề xuất: known-limits

- **Reference doc says uncommitted ideas still show in /road-map:xem, but that command never shows signals**
  Người dùng thấy gì: Tài liệu hướng dẫn gửi đến các kho dùng kit vẫn nói ý chưa lưu vào kho hiện trong màn xem lộ trình, nhưng màn đó không bao giờ hiện chúng. Người đọc có thể đi tìm ý ở sai chỗ.
  Căn cứ: Nhẹ: chỉ là một câu hướng dẫn sai chỗ xem, không mất dữ liệu, ghi chú phát hành đã nói đúng, và sửa sau chỉ cần một dòng trong hồ sơ riêng.
  file: `skills/acceptance/references/lo-trinh-du-lieu.md`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 — Assertion âm-tính-một-mình: chân «kho giữ mọi ý ngoài git» của VT-2 không có đối chứng dương, chiều đỏ không cô lập**
  Người dùng thấy gì: Một phép kiểm tự động của tính năng lộ trình có thể báo xanh cả khi nó không thực sự chứng minh được điều mình hứa, nên một lỗi tương lai ở trường hợp kho giữ mọi ý ngoài git có thể lọt qua.
  Căn cứ: Nhẹ: không ảnh hưởng người dùng hiện tại, chỉ làm lưới an toàn cho một trường hợp hiếm yếu hơn, và thêm đối chứng sau này là việc rẻ.
  file: `tests/scripts/ve-lo-trinh-doc-tin-hieu-cua-cay.test.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).

# Review findings: t3-arm-chu-ky-khong-im (round 2)

## Trong hợp đồng

Không có finding nào map được vào AC.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **HA43-do chỉ đo máy thiếu node, không có đối chứng dương trên cùng kho thử, trái bất biến đối chứng và trái lời khai «mỗi ca -do»**
  Người dùng thấy gì: Một phép kiểm của bộ thử chưa so sánh với máy đủ công cụ, nên nếu cổng sai ở đúng ca này thì bộ thử có thể không bắt được. Cổng thật vẫn chặn đúng với người dùng.
  Căn cứ: Hậu quả nhẹ, chỉ ảnh hưởng độ tin cậy của bộ thử chứ không làm mất hay lộ dữ liệu, và thông điệp lỗi đã được ghim đúng nên rủi ro xanh giả thấp; có thể sửa sau mà không ai bị ảnh hưởng.
  file: `tests/scripts/t3-can-ho-so-arm.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 2 — Fixture VIẾT TAY đúng khuôn bên đọc: báo cáo bằng chứng của các ca HA37–HA49 không rút từ khuôn bên viết**
  Người dùng thấy gì: Hồ sơ mẫu trong bộ thử được gõ tay, nên nếu mẫu hồ sơ thật đổi dạng thì bộ thử vẫn xanh dù cổng có thể đọc sai hồ sơ chưa ký thật. Người dùng có thể gặp cổng chặn hoặc cho qua sai sau khi mẫu đổi mà không có cảnh báo sớm.
  Căn cứ: Rủi ro chỉ xảy ra khi mẫu hồ sơ đổi sau này, không phải hôm nay, và hậu quả là một lần chặn hoặc cho qua nhầm có thể tải lại và thử lại; ghi lại là đủ cho đến khi mẫu thực sự đổi.
  file: `tests/scripts/t3-can-ho-so-arm.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 — Assertion âm-tính-một-mình: chốt «PATH cắt không còn node» không có đối chứng dương**
  Người dùng thấy gì: Bộ thử chưa phân biệt được máy giả lập thiếu node với máy giả lập hỏng hẳn, nên một lỗi dựng có thể báo đỏ muộn hơn và khó hiểu hơn. Người dùng cổng không bị ảnh hưởng.
  Căn cứ: Chỉ làm chậm việc tìm nguyên nhân khi bộ thử hỏng, không gây xanh giả vì các ca sau vẫn đòi đúng thông điệp; người bảo trì tự phát hiện và sửa được, nên không cần làm gấp.
  file: `tests/scripts/t3-can-ho-so-arm.test.mjs`
  severity: low
  Đề xuất: known-limits

- **HA43-do không đo máy đủ công cụ, trái lời khai «mỗi ca -do» và luật đối chứng (r1)**
  Người dùng thấy gì: Một ca kiểm tra về trường hợp máy thiếu node không có phép so sánh với máy đủ công cụ như các ca cùng loại. Người dùng vẫn được chặn đúng, chỉ là bằng chứng ít chặt hơn một chút.
  Căn cứ: Hành vi cho người dùng không sai và thông điệp vẫn được ghim, nên hậu quả nhẹ; có thể bổ sung sau mà không ảnh hưởng ai.
  file: `tests/scripts/t3-can-ho-so-arm.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 2 — Fixture VIẾT TAY đúng khuôn bên đọc: báo cáo bằng chứng của các ca HA37-HA49 không rút từ khuôn của bên viết (r1)**
  Người dùng thấy gì: Các ca kiểm tra dùng báo cáo bằng chứng tự gõ tay, nên nếu khuôn báo cáo thật đổi đi thì các ca vẫn xanh dù cổng đọc sai chữ ký. Hiện tại chưa có người dùng nào bị ảnh hưởng.
  Căn cứ: Chưa gây sai lệch nào cho người dùng, chỉ là lưới an toàn có thể lỏng khi khuôn báo cáo đổi sau này; sửa được sau mà không mất dữ liệu.
  file: `tests/scripts/t3-can-ho-so-arm.test.mjs`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).

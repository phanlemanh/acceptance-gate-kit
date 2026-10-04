# Review findings: release-2-22-0

## Trong hợp đồng

Không có finding nào map được vào AC.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **E1/E2/E6 expect P200 lines that the vùng 3 command filters out, so the evidence cannot show them**
  Người dùng thấy gì: Báo cáo bằng chứng của mốc này chỉ cho thấy kết quả tổng của bộ kiểm tra, không hiện từng dòng xác nhận số phiên bản và mô tả khớp như đã hứa. Kết luận đạt/không đạt vẫn đúng, nhưng người đọc không tự thấy được từng vế riêng lẻ.
  file: `_acceptance/release-2-22-0/evals.yaml`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 1 (đo trên chỉ dẫn, không trên đầu ra): E1/E2/E6 hứa những dòng mà lệnh chạy của chính chúng lọc bỏ**
  Người dùng thấy gì: Phần bằng chứng của mốc này hứa nêu từng điều đã được kiểm (số phiên bản hai gói cùng nhau, hướng dẫn khớp, mô tả có mục mới) nhưng thực tế chỉ in hai dòng kết quả tổng. Nếu có vế hỏng thì bộ kiểm tra vẫn báo đỏ, chỉ là người đọc không thấy chi tiết từng vế.
  file: `_acceptance/release-2-22-0/evals.yaml`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 2 (tập mong đợi gõ tay ở bản sao thứ ba, không rút từ Context): E4/AC-4 so với slug ghim trong config chứ không đọc Context**
  Người dùng thấy gì: Danh sách hồ sơ được ký trong mốc này được gõ tay ở hai nơi: bản mô tả mốc và phần cấu hình kiểm tra, và không có gì tự so hai nơi với nhau. Hôm nay hai danh sách khớp, nhưng nếu sau này một bên sửa mà bên kia không, phép kiểm vẫn báo xanh.
  file: `_acceptance/config.yaml`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).

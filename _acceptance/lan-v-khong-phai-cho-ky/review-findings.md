# Review Findings: lan-v-khong-phai-cho-ky — round 6

## Trong hợp đồng

(không có finding nào ánh xạ vào AC trong vòng này.)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Luật sáu-điều-kiện xanh-sạch tồn tại ở HAI bản dựng phải giữ đồng bộ (bash + JS), trái bất biến «không có bản sao nào phải giữ đồng bộ»**
  Người dùng thấy gì: Kết luận 'hồ sơ này có cần người ký hay không' đang được tính bằng hai công thức riêng ở hai nơi, canh khớp nhau bằng một phép đo tự động thay vì dùng chung một nguồn duy nhất. Nếu sau này một bên được sửa mà quên sửa bên kia, có nguy cơ hồ sơ báo 'đã xong' dù thực ra vẫn cần người ký, hoặc ngược lại.
  file: `scripts/khong-can-nguoi.mjs:20`
  severity: medium
  Đề xuất: known-limits

- **Chân `cay-that` đo CHỈ DẪN (grep chuỗi trong commands/start.md) thay vì đầu ra — hình dạng (1) của lớp «thước không gắn vào vật», chưa có dòng sổ known-limits**
  Người dùng thấy gì: Phép kiểm tra hiện chỉ xác nhận trang hướng dẫn có nhắc đúng chữ, chứ chưa xác nhận màn hình thật sự hiển thị đúng nội dung đó khi người dùng mở phiên làm việc. Nếu sau này nội dung hiển thị thật đổi mà trang hướng dẫn không đổi theo, phép kiểm tra vẫn báo qua dù người dùng nhìn thấy thông tin sai.
  file: `_acceptance/lan-v-khong-phai-cho-ky/rang.sh:162`
  severity: low
  Đề xuất: known-limits

- **Nhãn «xanh-sach» gán cho hồ sơ vẫn mang veto_state: mo (vết giờ không đọc được)**
  Người dùng thấy gì: Có một tình huống hiếm mà nhãn trạng thái hồ sơ ('đã xong, không cần ký') không khớp cách gọi tên ở một màn hình theo dõi khác — cả hai đều đồng ý là không cần người, chỉ khác tên gọi trạng thái, nên không dẫn tới quyết định sai, chỉ có thể gây khó hiểu nếu người đọc so hai màn hình cạnh nhau.
  file: `scripts/khong-can-nguoi.mjs:92`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 — LV5 coi «lưới qua» = vắng dòng VIOLATION [slug], không đòi dòng kết luận dương cho từng fixture**
  Người dùng thấy gì: Bài kiểm chứng máy hiện chắc chắn đúng cho một số tình huống mẫu chính, nhưng với các tình huống còn lại, nếu công cụ tự động lặng thinh thay vì báo kết quả rõ ràng, bài kiểm vẫn có thể báo 'khớp' nhầm dù chưa thực sự kiểm được gì — rủi ro là một lỗi thật có thể trôi qua mà không ai phát hiện.
  file: `tests/plugins/lan-v.test.mjs:297`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 1 + 4 — vế chỉ dẫn trong cay-that grep chuỗi cứng trong commands/start.md, chiều đỏ là phép thử sed tự thoả**
  Người dùng thấy gì: Phần kiểm tra 'nếu chữ hướng dẫn bị đổi thì phải báo lỗi' hiện không thực sự chạy lại phép kiểm trên bản đã đổi chữ — nó chỉ chứng minh việc xoá chữ tự nó hoạt động. Vì vậy nhánh 'phải phát hiện lỗi khi hướng dẫn sai' trên thực tế chưa từng được chứng minh là chạy đúng.
  file: `_acceptance/lan-v-khong-phai-cho-ky/rang.sh:162`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 (nhẹ) — LV2 khai «8 bien the» bằng chuỗi cứng, không ghim số phần tử từ vòng lặp**
  Người dùng thấy gì: Dòng thông báo 'đã kiểm đủ 8 tình huống' hiện được viết cứng sẵn. Nếu sau này một tình huống trong danh sách kiểm bị bớt đi, thông báo vẫn nói 'đủ 8' dù thực tế đã kiểm ít hơn, khiến người đọc báo cáo tin nhầm là đã kiểm đầy đủ.
  file: `tests/plugins/lan-v.test.mjs:147`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 — ranh giới sàn ≥2 của cay-that chỉ có chiều đỏ trên giấy**
  Người dùng thấy gì: Tài liệu mô tả có một phép thử 'nếu chỉ còn 1 hồ sơ thay vì tối thiểu 2 thì phải báo lỗi', nhưng phép thử đó trên thực tế chưa từng được chạy — chỉ được viết mô tả suông. Người đọc báo cáo có thể tin nhầm là nhánh báo lỗi này đã được xác minh, trong khi chưa.
  file: `_acceptance/lan-v-khong-phai-cho-ky/rang.sh:161`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
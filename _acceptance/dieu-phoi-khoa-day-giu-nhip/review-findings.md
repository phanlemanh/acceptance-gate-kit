## Trong hợp đồng

(không có finding trong hợp đồng ở round này)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Ô `target` của ba dòng sửa S4-r1 do tay viết, trái với lớp mà bộ phân loại một-nguồn trả về (`thuoc`/`ho-so` thay vì `vat`)**
  Người dùng thấy gì: Trong sổ quyết định của vòng này, ba dòng sửa lỗi ghi sai loại thay đổi (ghi là sửa thước hoặc hồ sơ trong khi thực ra là sửa sản phẩm). Người đọc sổ có thể hiểu nhầm loại nhát sửa, nhưng không có con số hay phán quyết nào dựa vào ô này nên kết quả nghiệm thu không bị lệch.}
  file: `_acceptance/dieu-phoi-khoa-day-giu-nhip/decisions.jsonl`
  severity: low
  Đề xuất: wont-fix

- **Hình dạng 4 — đối chứng đầu vào «vắng nhịp phiên» là kiểm âm tính một mình, không có đối chứng dương (r1 · tệp đã đổi)**
  Người dùng thấy gì: Bước kiểm «dãy chưa từng gọi công cụ nào» có thể luôn báo ổn dù bản sửa có vô tình làm dãy bị coi là đang hoạt động. Khi đó một lỗi kiểu này có thể lọt qua mà không ai biết.
  file: `tests/dieu-phoi/on-dinh-r2.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 — lời hứa tài liệu DP10-05 là một quan hệ («khoá của dãy cũng tính nhịp khoá như việc nền») nhưng chỉ đo bằng có/vắng chuỗi (r1 · tệp đã đổi)**
  Người dùng thấy gì: Tài liệu hướng dẫn có thể viết ngược với hành vi thật của hệ thống mà bước kiểm vẫn không phát hiện, nếu câu chữ không trùng đúng cụm cũ. Người đọc tài liệu có thể bị dặn sai về việc dãy chạy lượt dài có được giữ khoá hay không.
  file: `tests/dieu-phoi/on-dinh-r2.test.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).

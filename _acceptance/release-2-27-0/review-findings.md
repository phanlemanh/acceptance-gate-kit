# Review findings: release-2-27-0

## Trong hợp đồng

Không có finding nào map được vào tiêu chí (AC) của hợp đồng.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **card-plain.json hứa «tác tử chấm không còn sửa được mã», trong khi cham-lenh vẫn cầm Bash**
  Người dùng thấy gì: Thẻ tóm tắt mốc nói lượt chấm không còn sửa được mã, nhưng thực tế lượt chấm vẫn có thể ghi vào cây bằng lệnh dòng lệnh, máy chỉ ghi nhận sau lượt. Chủ kho có thể tin quá mức rằng lượt chấm không làm bẩn cây rồi bỏ bước đọc dòng cảnh báo của máy.
  file: `_acceptance/release-2-27-0/card-plain.json`
  severity: medium
  Đề xuất: known-limits

- **README gói vẫn ghi «gắn bốn hook» trong khi gói gắn năm khối hook và một mod**
  Người dùng thấy gì: Tài liệu cài gói vẫn ghi gói gắn bốn hook, trong khi thực tế gắn năm khối hook. Kho đang chuyển từ bản chép tay có thể đếm thiếu một hook và tưởng đã chuyển đủ.
  file: `dieu-phoi/README.md`
  severity: low
  Đề xuất: known-limits

- **README gói nhắc «luật 52», là số luật trong LUAT.md riêng của crm, nên kho khác không có luật này**
  Người dùng thấy gì: Hướng dẫn giới hạn của gói dặn kho giữ luật số 52 của mình, mà số đó là luật riêng của crm. OneFlow cài gói ở đợt thử 27/10 sẽ không có luật này, nên cách né cho giới hạn đó không tới được kho ấy.
  file: `dieu-phoi/README.md`
  severity: low
  Đề xuất: new-contract

- **Bước chuyển của README đòi `kiem-chuyen: sach`, mà ở crm điều đó không bao giờ đạt được nếu không viết lại hồ sơ đã ký và sổ chạy**
  Người dùng thấy gì: Hướng dẫn chuyển sang gói đòi chạy kiểm tới khi báo sạch, nhưng ở crm lệnh luôn còn hàng trăm dòng nằm trong hồ sơ đã ký và nhật ký cũ nên không bao giờ sạch. Người chuyển sẽ kẹt, hoặc bị đẩy tới chỗ sửa hồ sơ đã ký để ép báo sạch.
  file: `dieu-phoi/README.md`
  severity: medium
  Đề xuất: new-contract

- **Hình dạng 3: E1/E6 hứa QUAN HỆ với mốc trước (số mới 2.27.0), nhưng phép đo chỉ kiểm quan hệ nội bộ nên cây CHƯA cắt số cũng xanh**
  Người dùng thấy gì: Báo cáo bằng chứng sẽ ghi đạt cho số mới 2.27.0 trong khi phép đo chỉ chứng minh ba gói cùng một số, không chứng minh số đã tăng so với mốc trước. Nếu quên nâng số, báo cáo vẫn xanh và chỉ người đọc diff mới thấy.
  file: `_acceptance/release-2-27-0/evals.yaml`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 2: E4 so tập rút từ kho với một BẢN CHÉP TAY trong config, không rút từ Context mà AC-4 hứa so**
  Người dùng thấy gì: Phép đo danh sách hồ sơ trong cửa sổ phát hành so với một bản chép tay chứ không so trực tiếp với danh sách kể trong hợp đồng. Hôm nay hai bên khớp nhau, nhưng sau này sửa một bên mà quên bên kia thì phép đo vẫn xanh.
  file: `_acceptance/config.yaml`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).

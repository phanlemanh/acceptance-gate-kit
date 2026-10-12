# Review findings: release-2-27-0

## Trong hợp đồng

Không có finding nào map được vào tiêu chí (AC) của hợp đồng.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **README xếp eval của hồ sơ đã ký vào «bản ghi lịch sử, để nguyên» trong khi bước này gỡ chính mã mà các eval đó chạy, và không chỉ tới lối «nghỉ» kit đã có**
  Người dùng thấy gì: Hướng dẫn chuyển bảo kho gỡ bản cũ nhưng giữ nguyên các hồ sơ đã ký, trong khi có hồ sơ đã ký vẫn chạy kiểm bằng chính bản cũ ấy. Làm đúng hướng dẫn thì đợt ghim lại kế tiếp ở kho có thể đỏ ở những hồ sơ đó, và hướng dẫn không chỉ lối «cho hồ sơ nghỉ» đã có sẵn.
  file: `dieu-phoi/README.md`
  severity: medium
  Đề xuất: known-limits

- **README nói «không bắn đôi» nhưng mọi phép kiểm chỉ nhìn cây gốc, trong khi cây phụ có phiên vẫn chạy cả hook bản cũ lẫn hook của gói**
  Người dùng thấy gì: Hướng dẫn chuyển chỉ kiểm cây làm việc gốc. Những cây làm việc phụ của thợ chưa gộp bước chuyển vẫn chạy cùng lúc cả bản cũ lẫn bản mới của các móc tự động, nên một lần chờ người có thể bị đếm hai lần mà mọi phép kiểm vẫn báo sạch.
  file: `dieu-phoi/README.md`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 — AC-10-do của hang-pr chỉ kiểm chuỗi có mặt, còn lời hứa mới «phần CHANGELOG mới hơn mốc gốc» là một quan hệ vị trí và không có chiều đỏ**
  Người dùng thấy gì: Một lần sửa phép kiểm của lệnh gom PR chưa được thử theo chiều hỏng: nếu ai đó nới phạm vi đọc nhật ký thay đổi thì phép kiểm vẫn báo xanh. Lời hứa «chỉ tính phần mới hơn mốc gốc» vì vậy chưa có máy bảo đảm.
  file: `tests/scripts/hang-pr.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Phân nhóm của bước chuyển bỏ sót dòng LaunchAgent mà kiemChuyen in**
  Người dùng thấy gì: Hướng dẫn chuyển sang gói mới không nhắc tới lịch chạy nền của máy. Kho nào còn lịch gọi bản cũ có thể tưởng đã chuyển xong trong khi bản cũ vẫn chạy ngầm; ở crm đo hôm 12/10 chưa gặp trường hợp này.
  file: `dieu-phoi/README.md`
  severity: low
  Đề xuất: known-limits

- **card-plain.json khai A3 như hành vi mặc định («máy tự định tuyến…») trong khi A3 chỉ bật khi kho khai khoá**
  Người dùng thấy gì: Thẻ người ký nói máy tự định tuyến các mục ngoài hợp đồng như thể bật sẵn, nhưng thực tế chỉ chạy khi kho tự bật. Người ký có thể hiểu nhầm năng lực mặc định của bản phát hành này.
  file: `_acceptance/release-2-27-0/card-plain.json`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 1 — vế (4) của E8 so lời trên card-plain.json với chữ (CHANGELOG, contract) chứ không với vật mà lời ấy mô tả**
  Người dùng thấy gì: Câu trên thẻ về tác tử chấm chỉ được đối chiếu với lời mô tả trong tài liệu, chưa đối với cấu hình thật của tác tử. Nếu thẻ và tài liệu cùng sai thì phép kiểm vẫn cho qua.
  file: `_acceptance/release-2-27-0/evals.yaml`
  severity: low
  Đề xuất: known-limits

- **card-plain.json hứa «tác tử chấm không còn sửa được mã», trong khi cham-lenh vẫn cầm Bash (r1 · tệp đã đổi)**
  Người dùng thấy gì: Thẻ tóm tắt mốc nói lượt chấm không còn sửa được mã, nhưng thực tế lượt chấm vẫn có thể ghi vào cây bằng lệnh dòng lệnh, máy chỉ ghi nhận sau lượt. Chủ kho có thể tin quá mức rằng lượt chấm không làm bẩn cây rồi bỏ bước đọc dòng cảnh báo của máy.
  file: `_acceptance/release-2-27-0/card-plain.json`
  severity: medium
  Đề xuất: known-limits

- **README gói vẫn ghi «gắn bốn hook» trong khi gói gắn năm khối hook và một mod (r1 · tệp đã đổi)**
  Người dùng thấy gì: Tài liệu cài gói vẫn ghi gói gắn bốn hook, trong khi thực tế gắn năm khối hook. Kho đang chuyển từ bản chép tay có thể đếm thiếu một hook và tưởng đã chuyển đủ.
  file: `dieu-phoi/README.md`
  severity: low
  Đề xuất: known-limits

- **README gói nhắc «luật 52», là số luật trong LUAT.md riêng của crm, nên kho khác không có luật này (r1 · tệp đã đổi)**
  Người dùng thấy gì: Hướng dẫn giới hạn của gói dặn kho giữ luật số 52 của mình, mà số đó là luật riêng của crm. OneFlow cài gói ở đợt thử 27/10 sẽ không có luật này, nên cách né cho giới hạn đó không tới được kho ấy.
  file: `dieu-phoi/README.md`
  severity: low
  Đề xuất: new-contract

- **Bước chuyển của README đòi `kiem-chuyen: sach`, mà ở crm điều đó không bao giờ đạt được nếu không viết lại hồ sơ đã ký và sổ chạy (r1 · tệp đã đổi)**
  Người dùng thấy gì: Hướng dẫn chuyển sang gói đòi chạy kiểm tới khi báo sạch, nhưng ở crm lệnh luôn còn hàng trăm dòng nằm trong hồ sơ đã ký và nhật ký cũ nên không bao giờ sạch. Người chuyển sẽ kẹt, hoặc bị đẩy tới chỗ sửa hồ sơ đã ký để ép báo sạch.
  file: `dieu-phoi/README.md`
  severity: medium
  Đề xuất: new-contract

- **Hình dạng 3: E1/E6 hứa QUAN HỆ với mốc trước (số mới 2.27.0), nhưng phép đo chỉ kiểm quan hệ nội bộ nên cây CHƯA cắt số cũng xanh (r1 · tệp đã đổi)**
  Người dùng thấy gì: Báo cáo bằng chứng sẽ ghi đạt cho số mới 2.27.0 trong khi phép đo chỉ chứng minh ba gói cùng một số, không chứng minh số đã tăng so với mốc trước. Nếu quên nâng số, báo cáo vẫn xanh và chỉ người đọc diff mới thấy.
  file: `_acceptance/release-2-27-0/evals.yaml`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 2: E4 so tập rút từ kho với một BẢN CHÉP TAY trong config, không rút từ Context mà AC-4 hứa so (r1)**
  Người dùng thấy gì: Phép đo danh sách hồ sơ trong cửa sổ phát hành so với một bản chép tay chứ không so trực tiếp với danh sách kể trong hợp đồng. Hôm nay hai bên khớp nhau, nhưng sau này sửa một bên mà quên bên kia thì phép đo vẫn xanh.
  file: `_acceptance/config.yaml`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).

## Trong hợp đồng

_Không có phát hiện nào được ánh xạ vào một AC ở vòng này._

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **`laNgoaiVat` ở bên ĐỌC thiếu miễn trừ `eval.paths` của bên VIẾT — finding trên fixture được khai trong evals.yaml bị nuốt**
  Người dùng thấy gì: Một số phát hiện lỗi thật trên các tệp dữ liệu mẫu nằm trong phạm vi đang xét có thể bị hệ thống âm thầm loại bỏ trước khi người xét duyệt nhìn thấy, khiến báo cáo trông sạch trong khi thực ra chưa được kiểm tra đủ.
  file: `feature-loop/workflows/acceptance-verify.js`
  severity: high
  Đề xuất: new-contract

- **Hai khuôn khớp glob cho cùng một trường `ngoaiVatGlobs`; VV4 tự xưng round-trip nhưng đo bằng hàm của bên VIẾT**
  Người dùng thấy gì: Bài kiểm tra dùng để đảm bảo bộ lọc tệp hoạt động đúng thực ra tự so với chính nó, nên nó không phát hiện được khi bộ lọc thật đã lệch — dễ khiến người tin nhầm là đã được kiểm chứng.
  file: `tests/scripts/s4-args-vung-vat.test.mjs`
  severity: medium
  Đề xuất: new-contract

- **Finding carry không được ghi lại vào sổ mỗi lượt — chuỗi carry đứt từ lượt 3, và `carried_from_round` không có bên viết nào**
  Người dùng thấy gì: Nếu một vấn đề ngoài phạm vi hợp đồng được mang sang lượt xét tiếp theo mà vẫn chưa xử lý xong sau hai lượt liên tiếp, nó có thể âm thầm biến mất khỏi báo cáo mà không ai được báo.
  file: `feature-loop/workflows/acceptance-verify.js`
  severity: medium
  Đề xuất: known-limits

- **Bộ lọc «ngoài vật» bên ĐỌC thiếu vế miễn trừ eval.paths → nuốt im lặng finding trên tệp NẰM TRONG vùng vật**
  Người dùng thấy gì: Một số phát hiện lỗi thật trên các tệp dữ liệu mẫu nằm trong phạm vi đang xét có thể bị hệ thống âm thầm loại bỏ trước khi người xét duyệt nhìn thấy, khiến báo cáo trông sạch trong khi thực ra chưa được kiểm tra đủ.
  file: `feature-loop/workflows/acceptance-verify.js`
  severity: high
  Đề xuất: new-contract

- **Finding được CARRY không để lại dòng sổ ở lượt mang sang → chuỗi carry đứt sau một lượt, mục ngoài hợp đồng biến mất khỏi thẻ Cổng 2**
  Người dùng thấy gì: Nếu một vấn đề ngoài phạm vi hợp đồng được mang sang lượt xét tiếp theo mà vẫn chưa xử lý xong sau hai lượt liên tiếp, nó có thể âm thầm biến mất khỏi báo cáo mà không ai được báo.
  file: `feature-loop/workflows/acceptance-verify.js`
  severity: medium
  Đề xuất: known-limits

- **byRole dùng object trần — vai trò trùng khoá kế thừa (`__proto__`, `constructor`) làm hỏng phép đếm im lặng**
  Người dùng thấy gì: Trong tình huống hiếm khi tên một vai trò trùng với một từ khoá kỹ thuật đặc biệt, bảng thống kê thời gian/chi phí có thể tính sai hoặc bỏ sót vai trò đó mà không có cảnh báo nào.
  file: `feature-loop/scripts/wf-usage.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 3 — assert «chuỗi có mặt» mà chuỗi đó KHÔNG tồn tại: eval E7/AC-7 không bao giờ khớp**
  Người dùng thấy gì: Một phép đo tự động dùng để xác nhận tính năng 'không để một bước chậm làm nghẽn cả quy trình' hiện không bao giờ báo đạt được, nên hiện không có bằng chứng máy nào xác nhận tính năng này thật sự hoạt động đúng.
  file: `_acceptance/config.yaml`
  severity: high
  Đề xuất: new-contract

- **Hình dạng 4 — assertion âm-tính-một-mình: cả tệp finding-line-bo-doc xanh khi ba bộ đọc KHÔNG hề chạy**
  Người dùng thấy gì: Bài kiểm tra dùng để đảm bảo các báo cáo cũ vẫn đọc được sau khi thêm dữ liệu mới sẽ báo 'đạt' ngay cả khi công cụ đọc báo cáo bị hỏng hoàn toàn — người xem có thể tin nhầm rằng mọi thứ vẫn ổn trong khi chưa có gì được kiểm chứng thật.
  file: `tests/scripts/finding-line-bo-doc.test.mjs`
  severity: high
  Đề xuất: new-contract

- **Hình dạng 2 — VV4 tuyên round-trip writer→reader nhưng khớp bằng hàm của chính BÊN VIẾT**
  Người dùng thấy gì: Bài kiểm tra dùng để đảm bảo bộ lọc tệp hoạt động đúng thực ra tự so với chính nó, nên nó không phát hiện được khi bộ lọc thật đã lệch — dễ khiến người tin nhầm là đã được kiểm chứng.
  file: `tests/scripts/s4-args-vung-vat.test.mjs`
  severity: high
  Đề xuất: new-contract

- **Hình dạng 2 — fixture W41 gõ tay đúng khuôn bên ĐỌC, trái với chính điều eval E4 khai**
  Người dùng thấy gì: Một bài kiểm tra dùng dữ liệu soạn tay thay vì dữ liệu do hệ thống thật sinh ra, nên nếu cách hệ thống hoạt động thực tế thay đổi, bài kiểm tra này vẫn báo đạt mà không phát hiện ra sai khác.
  file: `tests/workflows/acceptance-verify.test.mjs`
  severity: high
  Đề xuất: new-contract

- **Hình dạng 5 — tuyên quét LỚP «không bộ đọc nào» nhưng chỉ có 3 điểm-case trên 8 bộ đọc**
  Người dùng thấy gì: Bài kiểm tra tuyên bố đã kiểm tra toàn bộ các nơi đọc dữ liệu nhật ký, nhưng thực tế chỉ kiểm một phần nhỏ — các nơi còn lại có thể hỏng mà không ai biết.
  file: `tests/scripts/finding-line-bo-doc.test.mjs`
  severity: medium
  Đề xuất: new-contract

- **Hình dạng 4 — W44 assert âm tính một mình: cờ mặc định undefined cho PASS kể cả khi làn baseline không hề spawn**
  Người dùng thấy gì: Bài kiểm tra dùng để xác nhận một bước xử lý nền có chạy đúng lúc hay không sẽ vẫn báo 'đạt' ngay cả khi bước đó không hề chạy — hiện chưa có bằng chứng thật nào xác nhận hành vi được kiểm.
  file: `tests/workflows/acceptance-verify.test.mjs`
  severity: medium
  Đề xuất: new-contract

## Chưa adversarial-verify (refuter chết)

_Không có mục nào ở vòng này._

⚠ Cụm ngoài vùng phủ: 3/12 lỗi rơi vào file không bộ đo nào phủ (_acceptance/config.yaml, tests/scripts/finding-line-bo-doc.test.mjs) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.

## Trong hợp đồng

_(rỗng — scope-triage chạy đủ round này, không có finding thật nào được xác nhận nằm trong hợp đồng; toàn bộ 12 finding đã xác nhận rơi ngoài hợp đồng, xem mục dưới.)_

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **wf-usage: sửa «đếm dòng thay vì đếm agent» chỉ áp cho byRole — total.agents và byModel[].agents vẫn đếm (agent × model), nên cùng một usage-report tự mâu thuẫn**
  Người dùng thấy gì: Báo cáo chi phí máy có thể hiện hai con số agent khác nhau ở hai chỗ trong cùng một báo cáo, khiến người đọc dễ hiểu nhầm quy mô chạy thực tế.
  file: `feature-loop/scripts/wf-usage.mjs`
  severity: high
  Đề xuất: known-limits

- **Khoá `finders` mang HAI khuôn khác nhau trong cùng một hợp đồng kết quả của workflow (string[] ở dryRun, {chay,boQua} ở đường thành công)**
  Người dùng thấy gì: Kết quả trả về của vòng chạy thật có thể khác hình dạng với kết quả chạy thử, nên công cụ đọc kết quả tự động có thể báo lỗi hoặc đọc sai khi chuyển từ chạy thử sang chạy thật.
  file: `feature-loop/workflows/acceptance-verify.js`
  severity: medium
  Đề xuất: known-limits

- **Ba trường args mới (fileDoTrongDiff, coverageFiles, coEvalPaths) có nhánh đọc-cũ nhưng KHÔNG có cờ vàng — trái luật «đổi schema artifact phải có đường đọc-cũ + cờ vàng»**
  Người dùng thấy gì: Khi dữ liệu đầu vào thiếu ba mục mới này, hệ thống vẫn chạy tiếp nhưng không báo cho người biết đang dùng đường xử lý cũ — có thể âm thầm tốn thêm chi phí máy hoặc bật lại hành vi lọc cũ mà không ai hay.
  file: `feature-loop/workflows/acceptance-verify.js`
  severity: medium
  Đề xuất: known-limits

- **Suite thường trực `executors.test.scripts` nay phụ thuộc cứng vào python3 + PyYAML mà không kho/tài liệu nào khai**
  Người dùng thấy gì: Trên một máy hoặc môi trường build chưa cài sẵn PyYAML, toàn bộ bộ kiểm tra sẽ báo lỗi hàng loạt — không phải vì sản phẩm có lỗi, mà vì thiếu một điều kiện cài đặt chưa được ghi ra ở đâu để người dựng môi trường biết trước.
  file: `tests/scripts/config-yaml-that.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **wf-usage: số agent ở dòng tiêu đề vẫn đếm dòng (agent × model), mâu thuẫn với bảng byRole vừa được sửa trong chính diff này**
  Người dùng thấy gì: Dòng tổng kết ở đầu báo cáo — chỗ người đọc đầu tiên — có thể hiện số agent cao hơn thực tế, làm sai lệch nhận định về quy mô và chi phí của lượt chạy.
  file: `feature-loop/scripts/wf-usage.mjs`
  severity: medium
  Đề xuất: known-limits

- **acceptance-verify: khoá `finders` có HAI kiểu khác nhau trong cùng hợp đồng kết quả, và vắng hẳn ở hai đường BLOCKED**
  Người dùng thấy gì: Khi lượt chạy bị chặn, kết quả trả về thiếu một thông tin mà các trường hợp khác đều có, nên công cụ đọc kết quả tự động có thể gặp lỗi bất ngờ đúng lúc đang cần biết vì sao bị chặn.
  file: `feature-loop/workflows/acceptance-verify.js`
  severity: medium
  Đề xuất: known-limits

- **Hai bản globToRe vẫn trôi ở dạng `**/<đoạn>/**`, mà ma trận VV4b được viện làm răng canh không có ô nào thuộc dạng đó**
  Người dùng thấy gì: Với một số kiểu mẫu loại-trừ đường dẫn nhất định, hệ thống có thể phân loại cùng một tệp khác nhau tuỳ nơi kiểm tra, và hiện chưa có phép kiểm tự động nào phát hiện được nếu điều đó xảy ra.
  file: `feature-loop/scripts/s4-args.mjs`
  severity: medium
  Đề xuất: known-limits

- **Đo CHỈ DẪN thay vì ĐẦU RA — W47 tự truyền đáp án, tên `_acceptance/config.yaml` chỉ là trang trí**
  Người dùng thấy gì: Một số phép kiểm tự động không thực sự chứng minh được tính năng hoạt động đúng như tên gọi của chúng — nếu tính năng bị hỏng âm thầm sau này, các phép kiểm này sẽ không phát hiện ra.
  file: `tests/workflows/acceptance-verify.test.mjs`
  severity: high
  Đề xuất: known-limits

- **Fixture/hàm khớp VIẾT TAY đúng khuôn bên đọc — bản chép thứ tư của `globToRe`, lại không có đối chứng âm**
  Người dùng thấy gì: Một phép kiểm tự động dùng bản sao chép tay của logic thật thay vì logic thật, nên nếu logic thật thay đổi và có lỗi, phép kiểm này có thể vẫn báo xanh dù sản phẩm đã sai.
  file: `tests/workflows/acceptance-verify.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **«Dấu sống» của phép so recheck-evidence là một chuỗi CHỈ xuất hiện khi bộ đọc BÁO LỖI**
  Người dùng thấy gì: Phép kiểm dùng để đảm bảo công cụ đối chiếu bằng chứng đọc đúng dữ liệu mới hiện đang tự báo xanh do một lỗi thiết lập không liên quan, nên khả năng thật của nó chưa được chứng minh.
  file: `tests/scripts/finding-line-bo-doc.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Tuyên quét LỚP nhưng chỉ assert một CON SỐ, không assert danh tính**
  Người dùng thấy gì: Phép kiểm chỉ đếm số lượng công cụ đọc sổ chứ không kiểm tra đó có đúng là những công cụ cần theo dõi hay không, nên nếu một công cụ quan trọng bị bỏ sót và thay bằng công cụ khác, phép kiểm vẫn báo xanh.
  file: `tests/scripts/finding-line-bo-doc.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Expected của E7 hứa 4 dòng NGUYÊN VĂN nhưng cmd chỉ ghim 1, và bằng chứng ghi lại không chứa dòng nào**
  Người dùng thấy gì: Bằng chứng lưu lại cho người duyệt đọc thực ra không chứa đủ thông tin mà hồ sơ hứa hẹn sẽ có, nên người duyệt có thể tưởng đã kiểm tra được điều gì đó mà thực tế chưa hề được xác nhận.
  file: `_acceptance/khoi-tim-loi-tra-phi-theo-vat/evals.yaml`
  severity: medium
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 4/12 lỗi rơi vào file không bộ đo nào phủ (tests/scripts/config-yaml-that.test.mjs, tests/scripts/finding-line-bo-doc.test.mjs, _acceptance/khoi-tim-loi-tra-phi-theo-vat/evals.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
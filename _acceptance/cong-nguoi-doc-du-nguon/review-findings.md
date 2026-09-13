## Trong hợp đồng

- **parseACBlock quét-cả-tệp + xoá-sau-cùng làm TẮT răng cross-layer của pre-merge**
  Người dùng thấy gì: Nếu một tiêu chí xuyên lớp (cross-layer) chỉ được NHẮC LẠI trong mục Giới hạn đã biết (không phải một khai báo tiêu chí mới), lưới kiểm trước khi gộp mã có thể coi tiêu chí đó KHÔNG còn cần bằng chứng xuyên lớp nữa và bỏ lọt một vi phạm thật lẽ ra phải chặn lại.
  file: `scripts/pre-merge-check.sh`
  severity: high
  Đề xuất: Gộp theo id trước khi cộng/trừ tập cross-layer (OR mọi bản ghi cùng id, hoặc chỉ lấy bản ghi khai báo ĐẦU TIÊN quyết định) và chỉ áp dụng trong phạm vi mục Criteria; CHƯA vá trong lượt chấm này — chuyển sang vòng vá kế tiếp trước khi ký Cổng 2.
  AC: AC-11

- **AC_SUSPECT nới sang tiêu đề nhưng AC_XREF không — cờ mù giả ở Cổng 1**
  Người dùng thấy gì: Một hợp đồng hoàn toàn lành, chỉ vì có một dòng tiêu đề nhắc chéo tới mã tiêu chí (không phải khai báo tiêu chí mới), có thể bị thẻ Cổng 1 báo nhầm là "đọc thiếu tiêu chí", khiến người duyệt nghi ngờ một hợp đồng vốn không có vấn đề gì.
  file: `lib/ac-line.cjs`
  severity: medium
  Đề xuất: Nới `AC_XREF` để nhận cùng tiền tố tiêu đề vừa được thêm vào `AC_SUSPECT`, giữ hai regex sinh đôi đồng bộ trở lại; CHƯA vá trong lượt chấm này — chuyển sang vòng vá kế tiếp trước khi ký Cổng 2.
  AC: AC-9

- **Hình dạng 3 — assert «chuỗi có mặt» trong khi lời hứa là QUAN HỆ giữa hai nhánh (CN11)**
  Người dùng thấy gì: Bài kiểm tra tự động dùng để chứng minh hai đường kiểm (có Node và không có Node) luôn báo cùng một kết quả thực ra không so sánh đúng điều đó — nó chỉ tìm xem chữ "AC-1" có xuất hiện ở bất kỳ đâu trong toàn bộ log hay không, nên một dòng ghi chú in ra đúng chữ đó ở chỗ khác vẫn khiến bài kiểm tra báo ĐẠT dù răng kiểm xuyên lớp thật đã im hoàn toàn.
  file: `tests/scripts/cong-nguoi-doc-du-nguon.test.mjs`
  severity: high
  Đề xuất: Đổi sang lọc đúng dòng `VIOLATION [<slug>]` bằng khuôn `dongCua` đã có sẵn trong cùng tệp (dùng ở CN01/CN05), so tập id hai nhánh thay vì hai chuỗi rời rạc, và thêm đối chứng dương (thêm eval `layer: backend-effect` để đòi cả hai nhánh IM); CHƯA vá trong lượt chấm này — chuyển sang vòng vá kế tiếp trước khi ký Cổng 2.
  AC: AC-11

- **Hình dạng 6 — hardcode môi trường của tác giả: PATH=/usr/bin:/bin không có tự kiểm (CN11)**
  Người dùng thấy gì: Bài kiểm tra ép hệ thống chạy nhánh dự phòng (khi máy không có Node) chưa từng tự kiểm rằng Node thật sự vắng mặt trên đường dẫn giả lập đó; trên một môi trường CI chuẩn, nhánh dự phòng có thể chưa bao giờ thực sự được chạy dù bài kiểm tra vẫn báo ĐẠT.
  file: `tests/scripts/cong-nguoi-doc-du-nguon.test.mjs`
  severity: medium
  Đề xuất: Thêm bước tự kiểm `command -v node`/`command -v bash` trên cùng PATH giả lập (theo đúng khuôn hàm `ve2VangNode` đã có sẵn trong cùng tệp) trước khi tin nhánh awk đã chạy, và đòi dòng NOTE tự xưng của nhánh awk làm bằng chứng nhánh nào đã thực thi; CHƯA vá trong lượt chấm này — chuyển sang vòng vá kế tiếp trước khi ký Cổng 2.
  AC: AC-11

- **Hình dạng 5 — E13 tuyên bốn mũi tiêm độc lập / 9 tiêu chí; CN13 có một mũi tiêm dùng chung / 5 tiêu chí**
  Người dùng thấy gì: Tài liệu mô tả bài kiểm tra tuyên bố đã thử bốn cách gọi riêng biệt trên một hợp đồng chín tiêu chí, nhưng bài kiểm tra thật chỉ thử một cách làm sai dùng chung trên năm tiêu chí — phần "mỗi cách gọi lỗi độc lập làm đúng bên đó sai" của lời hứa AC-13 chưa thực sự được xác nhận riêng biệt cho từng bên.
  file: `_acceptance/cong-nguoi-doc-du-nguon/evals.yaml`
  severity: low
  Đề xuất: Viết lại CN13 thành bốn mũi tiêm độc lập trên đúng chín tiêu chí như evals.yaml đã khai, mỗi mũi chỉ hoàn nguyên đúng một bên gọi và phải làm đúng bên đó ra số khác 9 trong khi ba bên còn lại vẫn 9; CHƯA vá trong lượt chấm này — chuyển sang vòng vá kế tiếp trước khi ký Cổng 2.
  AC: AC-13

- **Hình dạng 4 — assert tự vô hiệu: nửa sau của AC-10 chỉ chạy nếu chuỗi còn tồn tại (CN10)**
  Người dùng thấy gì: Một phần bài kiểm tra dùng để đảm bảo thẻ duyệt không tuyên bố "bằng chứng đã đầy đủ" một cách sai lệch có thể tự động ngừng kiểm trong im lặng nếu câu chữ hiển thị trên thẻ thay đổi (đổi cách diễn đạt, đổi dấu câu, dịch ngôn ngữ khác), mà bài kiểm tra vẫn báo ĐẠT như không có gì xảy ra.
  file: `tests/scripts/cong-nguoi-doc-du-nguon.test.mjs`
  severity: low
  Đề xuất: Thêm nhánh đối chứng bắt buộc — nếu điều kiện tiền đề (`noiDu`) sai thì phải trả ĐỎ có tên, không để mệnh đề khẳng định thứ hai của AC-10 âm thầm biến mất khỏi phép kiểm; CHƯA vá trong lượt chấm này — chuyển sang vòng vá kế tiếp trước khi ký Cổng 2.
  AC: AC-10

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **criteriaLines nới đường lùi quét-cả-tệp → tiêu chí MA lên thẻ Cổng 1, bộ dò mù im**
  Người dùng thấy gì: Nếu mục Tiêu chí của hợp đồng được viết bằng bảng thay vì gạch đầu dòng, thẻ duyệt Cổng 1 có thể hiện các tiêu chí không có thật (lấy nhầm từ mục Giới hạn đã biết), khiến người duyệt đọc nhầm nội dung hợp đồng mà không có cảnh báo nào.
  file: `lib/ac-line.cjs`
  severity: high
  Đề xuất: new-contract

- **contentLines là bản sao nguyên văn của `bullets` trong gate-card — hai bản luật cùng tồn tại**
  Người dùng thấy gì: Hai đoạn mã điều khiển cách hiển thị các mục trên thẻ duyệt đang viết trùng lặp thay vì dùng chung một chỗ; nếu sau này có người sửa cách hiển thị ở một chỗ mà quên chỗ kia, các mục khác nhau trên cùng một thẻ có thể hiện không nhất quán mà không ai nhận ra ngay.
  file: `lib/md-section.cjs`
  severity: medium
  Đề xuất: known-limits

- **Sửa hợp đồng của hồ sơ ĐÃ KÝ để nối danh sách trắng — đúng lớp «bất biến nằm trong hồ sơ đã ký»**
  Người dùng thấy gì: Một hồ sơ tính năng đã được duyệt và ký trước đó bị chỉnh sửa thêm nội dung sau khi đã ký, đi ngược quy định "hồ sơ đã ký là tài liệu lịch sử, không được sửa" — nếu việc này lặp lại ở các hồ sơ khác, hồ sơ đã ký sẽ không còn đáng tin làm bằng chứng cho quyết định trước đó.
  file: `_acceptance/ra-co-ten-lam-va-trao/contract.md`
  severity: medium
  Đề xuất: new-contract

- **CRITERIA_HEADINGS có mục chết: sectionLines khớp không phân biệt hoa thường**
  Người dùng thấy gì: Một dòng cấu hình liệt kê tên gọi của mục tiêu chí có một biến thể không bao giờ thực sự cần dùng tới; điều này không gây sai kết quả cho người dùng, chỉ có thể khiến người viết sau thêm nhầm cấu hình thừa tương tự.
  file: `lib/ac-line.cjs`
  severity: low
  Đề xuất: known-limits

- **Lỗi ĐỌC review-findings.md bị nuốt thành «vắng tệp» → điều kiện thứ bảy trả SẠCH**
  Người dùng thấy gì: Nếu tệp theo dõi rà soát của một hồ sơ bị lỗi quyền đọc (khác với việc tệp không tồn tại), công cụ có thể báo nhầm hồ sơ đó là "đã xong, không còn gì chờ người" dù thực ra chưa đọc được nội dung thật, khiến một hồ sơ cần chú ý bị bỏ sót.
  file: `scripts/product-map.mjs`
  severity: medium
  Đề xuất: known-limits

- **`status:` không cắt chú thích YAML, khác mọi bộ đọc evals.yaml còn lại**
  Người dùng thấy gì: Nếu người viết ghi thêm lý do ngay trên cùng dòng khai một mục kiểm tra là "không cần chạy", hệ thống có thể hiểu nhầm đó là mục cần chạy thật, dẫn tới báo lỗi thiếu lệnh chạy hoặc chấm sai kết quả cho mục đó.
  file: `lib/evidence-core.cjs`
  severity: medium
  Đề xuất: new-contract

- **Hình dạng 6 — đường dẫn đo trỏ checkout của tác giả: corpus mặc định là ~/dev (eval E17)**
  Người dùng thấy gì: Các con số minh chứng cho tính năng này (số hợp đồng, số tiêu chí bị thiếu, v.v.) được tính dựa trên thư mục cá nhân của máy người viết; chạy lại phép đo này trên máy khác hoặc trong quy trình kiểm tra tự động có thể cho ra số khác hẳn hoặc báo lỗi, khiến bằng chứng khó tái lập và khó tin khi cần đối chiếu sau này.
  file: `_acceptance/cong-nguoi-doc-du-nguon/do-ban-kinh.cjs`
  severity: high
  Đề xuất: new-contract

- **Hình dạng 5 — tuyên «ma trận 6 ô» nhưng ca chỉ có điểm-case, và ô đã tuyên nay khai NGƯỢC hành vi thật (E1/E4)**
  Người dùng thấy gì: Tài liệu mô tả cách các bài kiểm tra tự động hoạt động ghi rằng chúng kiểm nhiều tình huống hơn thực tế, và một số mô tả đã lỗi thời so với quyết định mới nhất của dự án; điều này không ảnh hưởng người dùng cuối nhưng có thể khiến người xem xét sau tin nhầm mức độ đã được kiểm chứng.
  file: `_acceptance/cong-nguoi-doc-du-nguon/evals.yaml`
  severity: medium
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 4/14 lỗi rơi vào file không bộ đo nào phủ (_acceptance/ra-co-ten-lam-va-trao/contract.md, scripts/product-map.mjs, _acceptance/cong-nguoi-doc-du-nguon/evals.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
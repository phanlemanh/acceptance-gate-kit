## Trong hợp đồng

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Mutant của GN04/GN05/GN11 ghi ĐÈ tệp nguồn THẬT đang được git theo dõi — đua với làn eval song song**
  Người dùng thấy gì: Nếu quá trình kiểm tra bị dừng đột ngột hoặc chạy trùng giờ với một quá trình khác, các tệp hướng dẫn quan trọng của dự án (SKILL.md, GUIDE.md) có thể bị bỏ lại ở trạng thái đã bị sửa thử nghiệm, và thay đổi đó có thể lẫn vào commit kế tiếp mà không ai để ý.
  file: `tests/scripts/repin-lane-noi-ra.test.mjs`
  severity: high
  Đề xuất: known-limits

- **pathsCuaEval quét key trong THÂN block scalar — trái luật 2 của lib/eval-yaml.cjs, fail-open lặng ở đúng khoá touched**
  Người dùng thấy gì: Nếu một tiêu chí chấp nhận mô tả các bước kiểm tra bằng một đoạn văn bản nhiều dòng, tính năng ghim lại có thể không nhận ra tệp nào thực sự liên quan, khiến cảnh báo 'phần này chưa được kiểm lại' bị bỏ sót một cách âm thầm.
  file: `feature-loop/scripts/repin-lane.mjs`
  severity: medium
  Đề xuất: known-limits

- **Lệnh đếm ngưỡng ở GUIDE §7.1 đếm khác luật «chống lưng» mà chính thẻ Cổng 2 thi hành**
  Người dùng thấy gì: Con số dùng để theo dõi 'có bao nhiêu hồ sơ từng bị đánh dấu chưa kiểm lại' có thể chỉ tăng dần theo thời gian dù các hồ sơ đó đã được kiểm lại sạch sau đó, khiến chỉ số cảnh báo trông nghiêm trọng hơn thực tế.
  file: `GUIDE.md`
  severity: medium
  Đề xuất: known-limits

- **Pin không giải được → chamTuPin im lặng trả rỗng (fail-OPEN, ngược nếp fail-closed của chính tệp)**
  Người dùng thấy gì: Nếu commit đã ghim trước không còn tồn tại trong lịch sử (ví dụ sau khi lịch sử git bị viết lại), hệ thống có thể lặng lẽ báo 'không có gì cần kiểm lại' thay vì báo lỗi rõ ràng, khiến người ký tin nhầm là mọi thứ đã được so sánh trong khi thực ra phép so sánh chưa từng chạy.
  file: `feature-loop/scripts/repin-lane.mjs`
  severity: medium
  Đề xuất: known-limits

- **Cờ «diff đã chạm vật … chưa chứng lại» bị xoá bởi lượt ghim kế tiếp, không cần chứng lại gì**
  Người dùng thấy gì: Sau khi ghim lại thêm một lần mà không chạm phần giao diện đang bị nghi ngờ, cờ cảnh báo 'phần này chưa được người kiểm lại' sẽ tự tắt — dù phần đó thực ra vẫn chưa từng được ai xem lại bằng mắt, vì hệ thống chỉ nhìn vào lần ghim gần nhất.
  file: `scripts/gate-card.js`
  severity: medium
  Đề xuất: known-limits

- **Ca mới ghi đè tệp nguồn ĐANG THEO DÕI GIT ngay trong cây làm việc (SKILL.md, GUIDE.md, eval-coverage-lint.js)**
  Người dùng thấy gì: Nếu quá trình kiểm tra bị ngắt giữa chừng (hết giờ, bị hủy), các tệp hướng dẫn quan trọng của dự án có thể bị bỏ lại ở trạng thái đã sửa thử nghiệm, ảnh hưởng tới các bước làm việc kế tiếp mà không có cảnh báo nào.
  file: `tests/scripts/repin-lane-noi-ra.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **pathsCuaEval cắt block-seq tại dòng trống hoặc dòng chú thích → mất glob, đọc thành «không chạm»**
  Người dùng thấy gì: Nếu danh sách đường dẫn cần theo dõi của một tiêu chí có dòng trống hoặc dòng ghi chú ở giữa, các đường dẫn phía sau dòng đó có thể bị bỏ qua âm thầm, khiến hệ thống báo nhầm là phần đó 'chưa bị ảnh hưởng' trong khi thực ra đã bị ảnh hưởng.
  file: `feature-loop/scripts/repin-lane.mjs`
  severity: low
  Đề xuất: known-limits

- **run-log.jsonl vượt trần đọc 1MB của thẻ → cờ «pin đã chạm» tắt lặng**
  Người dùng thấy gì: Nếu hồ sơ theo dõi lịch sử của một tính năng phát triển quá lớn theo thời gian, thẻ quyết định có thể lặng lẽ ẩn đi cảnh báo quan trọng mà không báo cho người xem biết là một phần dữ liệu đã bị bỏ qua.
  file: `scripts/gate-card.js`
  severity: low
  Đề xuất: known-limits

- **Assertion âm-tính-một-mình: chiều im của GN11 đếm bằng regex không bao giờ khớp → 0 === 0, không có đối chứng dương**
  Người dùng thấy gì: Bài kiểm tra dùng để đảm bảo lời khuyên lint không tăng thêm dòng cảnh báo khi tính năng không liên quan thực ra không có khả năng phát hiện lỗi — nên nếu phần đó sau này bị hỏng đúng chỗ, bài kiểm tra vẫn báo 'qua' như thường, khiến người đọc tin nhầm là đã được kiểm chứng.
  file: `tests/scripts/repin-lane-noi-ra.test.mjs`
  severity: high
  Đề xuất: known-limits

- **pathsCuaEval nhận-biết-vỏ TRƯỚC parseFlowValue — ba hình dạng YAML hợp lệ cho false negative IM (r1)**
  Người dùng thấy gì: Nếu tệp cấu hình eval có ghi chú hoặc dòng trống ngay trong phần khai đường dẫn theo dõi, công cụ ghim lại có thể không nhận ra rằng phần liên quan đã bị thay đổi, khiến báo cáo im lặng bỏ sót một thay đổi giao diện đáng lẽ phải được chú ý.
  file: `feature-loop/scripts/repin-lane.mjs`
  severity: high
  Đề xuất: known-limits

- **Vị từ «AC không có chốt máy» viết HAI BẢN (làn ghi + thẻ đọc) (r1)**
  Người dùng thấy gì: Hai nơi trong hệ thống tự tính lại cùng một quy tắc 'tiêu chí nào chưa có máy xác nhận' theo hai cách viết riêng; nếu sau này gặp một tình huống ngoài các trường hợp đã thử, cảnh báo hiển thị cho người dùng và nội dung ghi vào hồ sơ có thể không khớp nhau.
  file: `feature-loop/scripts/repin-lane.mjs`
  severity: medium
  Đề xuất: known-limits

- **Lệnh đếm ngưỡng ở GUIDE §7.1 không đếm cái ngưỡng nó đứng cạnh (r1)**
  Người dùng thấy gì: Một đoạn hướng dẫn vận hành đưa ra lệnh đếm số hồ sơ đang có nguy cơ, nhưng lại diễn giải kết quả như thể đó là số lần một lỗi thực sự đã lọt qua — người đọc có thể tưởng ngưỡng cảnh báo đã đạt trong khi chưa có sự cố nào xảy ra.
  file: `GUIDE.md`
  severity: medium
  Đề xuất: known-limits

- **chamTuPin fail-IM khi không giải được pin cũ (r1)**
  Người dùng thấy gì: Khi hệ thống không xác định được điểm mốc đã kiểm tra lần trước (ví dụ do lấy lịch sử không đầy đủ), nó âm thầm bỏ qua việc kiểm tra thay vì báo lỗi, và báo cáo trông giống hệt trường hợp 'mọi thứ liên quan đều không đổi' — người ký duyệt có thể tin nhầm là an toàn dù phép kiểm chưa từng chạy.
  file: `feature-loop/scripts/repin-lane.mjs`
  severity: medium
  Đề xuất: new-contract

- **chotMay của thẻ nuốt lỗi parse evals.yaml → cờ tắt lặng ở cả hai cổng (r1)**
  Người dùng thấy gì: Nếu tệp cấu hình eval bị lỗi định dạng, dòng cảnh báo 'tiêu chí này chưa có máy xác nhận khi ghim lại' sẽ biến mất khỏi thẻ quyết định mà không có thông báo gì, khiến người ký duyệt không biết thẻ đang thiếu thông tin.
  file: `scripts/gate-card.js`
  severity: low
  Đề xuất: known-limits

- **Cờ evals_not_machine_touched bị XOÁ bởi lượt ghim kế tiếp, không phải bởi chứng lại (r1)**
  Người dùng thấy gì: Nếu ghim lại nhiều lần liên tiếp, cảnh báo "phần giao diện chưa được kiểm lại" có thể tự tắt ở lượt ghim sau dù phần đó vẫn chưa thật sự được kiểm tra lại, khiến người đọc thẻ dễ tin nhầm là đã ổn.
  file: `scripts/gate-card.js`
  severity: medium
  Đề xuất: known-limits

- **pathsCuaEval không hiểu block scalar / dòng trống / chú thích (r1)**
  Người dùng thấy gì: Với một số cách viết evals.yaml (nhiều dòng, có chú thích) tính năng có thể báo sai là một mục kiểm không khai vùng đo, khiến người đọc hiểu nhầm phạm vi bị bỏ sót trong khi thực ra chỉ là đọc tệp chưa xử lý hết mọi cách viết.
  file: `feature-loop/scripts/repin-lane.mjs`
  severity: medium
  Đề xuất: known-limits

- **criterion không được chuẩn hoá trong phép gộp AC (r1)**
  Người dùng thấy gì: Nếu criterion trong tệp cấu hình được viết kèm dấu nháy hoặc ghi chú, thẻ có thể nhóm sai tiêu chí không có chốt máy, khiến danh sách hiển thị không khớp giữa các nơi trong cùng một thẻ.
  file: `scripts/gate-card.js`
  severity: low
  Đề xuất: known-limits

- **Section Re-pin lặp id trong câu «không khai paths» (r1)**
  Người dùng thấy gì: Câu giải thích trong báo cáo lặp lại tên mục hai lần một cách dư thừa; hơi khó đọc nhưng không làm sai thông tin và đúng theo định dạng đã được duyệt.
  file: `feature-loop/scripts/repin-lane.mjs`
  severity: low
  Đề xuất: wont-fix

- **Assertion âm-tính-một-mình: chiều im của GN11 so 0 với 0, không đối chứng dương (r1)**
  Người dùng thấy gì: Một trong các phép kiểm tự động của chính công cụ này có thể luôn báo 'ổn' bất kể mã nguồn có thật sự thay đổi hay không, nên nó không thực sự bảo vệ được phần hành vi mà nó tuyên bố đang theo dõi.
  file: `tests/scripts/repin-lane-noi-ra.test.mjs`
  severity: high
  Đề xuất: new-contract

- **Chiều đỏ khai trong evals.yaml mà không tồn tại trong ca (r1)**
  Người dùng thấy gì: Tài liệu mô tả trong bộ hồ sơ chấp nhận khai nhiều tình huống kiểm tra hơn số tình huống mã kiểm tra thực sự chạy, nên người đọc tài liệu có thể tin có nhiều lớp bảo vệ hơn thực tế.
  file: `_acceptance/ghim-lai-noi-ra-o-khong-do/evals.yaml`
  severity: medium
  Đề xuất: known-limits

- **Đo ĐẦU RA nhưng khai là đo NGUỒN: bất biến một-nguồn globToRe chỉ được nói bằng chữ (r1)**
  Người dùng thấy gì: Một mục trong hồ sơ chấp nhận tuyên bố phép kiểm đọc đúng mã nguồn gốc, nhưng thực ra phép kiểm chỉ xem kết quả hoạt động; nếu có ai viết lại logic đó bằng một đoạn mã khác tương đương, phép kiểm sẽ không phát hiện sự thay đổi cấu trúc đó.
  file: `_acceptance/ghim-lai-noi-ra-o-khong-do/evals.yaml`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).

## Trong hợp đồng

(không có phát hiện nào ánh xạ được vào AC trong vòng này.)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **pathsCuaEval re-implements evals.yaml parsing without the block-scalar guard that lib/eval-yaml.cjs already has**
  Người dùng thấy gì: Nếu mô tả một eval trong cấu hình chứa đoạn văn bản đặc biệt nhắc tới chữ "paths", việc ghim lại có thể chọn sai đường dẫn cần theo dõi, khiến cảnh báo an toàn bị bỏ sót hoặc báo sai một cách âm thầm.
  file: `feature-loop/scripts/repin-lane.mjs`
  severity: high
  Đề xuất: known-limits

- **chamTuPin fails OPEN when the previous pin is unreadable — the pin line then looks identical to "nothing touched"**
  Người dùng thấy gì: Khi bản ghim lần trước bị thiếu hoặc hỏng, báo cáo có thể lặng lẽ hiện ra giống như "không có gì cần chú ý" dù thực chất chưa kiểm tra được gì, khiến người đọc báo cáo bị hiểu nhầm là an toàn.
  file: `feature-loop/scripts/repin-lane.mjs`
  severity: medium
  Đề xuất: known-limits

- **gate-card chotMay swallows an unreadable/absent evals.yaml and renders no flag, against the in-file precedent for unreadable inputs**
  Người dùng thấy gì: Nếu tệp cấu hình kiểm tra bị thiếu hoặc hỏng, thẻ quyết định có thể hiển thị như thể mọi tiêu chí đã được máy xác nhận đầy đủ, mà không báo cho người xem biết là chưa kiểm tra được gì.
  file: `scripts/gate-card.js`
  severity: medium
  Đề xuất: known-limits

- **Declared limit points at a seed that does not exist**
  Người dùng thấy gì: Một ghi chú trong mã nguồn hứa sẽ có một kế hoạch riêng để gộp hai cách đọc dữ liệu trong tương lai, nhưng kế hoạch đó chưa được ghi lại ở đâu cả nên có thể bị quên.
  file: `feature-loop/scripts/repin-lane.mjs`
  severity: medium
  Đề xuất: known-limits

- **evals_not_machine is computed as "not test/script", but SKILL.md and GUIDE document it as "ui-check/judgment"**
  Người dùng thấy gì: Nếu tên loại kiểm tra trong cấu hình bị gõ sai hoặc để trống, hệ thống ghim lại sẽ coi nó như một loại kiểm tra được miễn trừ có chủ đích, khiến lỗi đánh máy trông giống một ngoại lệ hợp lệ.
  file: `feature-loop/scripts/repin-lane.mjs`
  severity: low
  Đề xuất: known-limits

- **Cờ `evals_not_machine_touched` bị lượt ghim kế XOÁ mà không ai chứng lại**
  Người dùng thấy gì: Sau khi một cảnh báo "chưa kiểm tra lại phần giao diện" được ghi nhận, một lượt ghim sạch tiếp theo có thể lặng lẽ xoá cảnh báo đó dù phần liên quan chưa từng được kiểm tra lại thật; đây là hành vi đã biết và đang có ngưỡng theo dõi riêng, không phải lỗi mới phát sinh.
  file: `scripts/gate-card.js`
  severity: high
  Đề xuất: known-limits

- **`pathsCuaEval` cắt block-seq ở dòng chú thích/dòng trắng — glob bị rụng lặng**
  Người dùng thấy gì: Nếu danh sách đường dẫn trong cấu hình eval có dòng chú thích hoặc dòng trống ở giữa, phần còn lại của danh sách có thể bị bỏ sót lặng lẽ, khiến hệ thống báo sai là eval đó không khai đường dẫn cần theo dõi.
  file: `feature-loop/scripts/repin-lane.mjs`
  severity: medium
  Đề xuất: known-limits

- **`pathsCuaEval` không bỏ qua block scalar (`cmd: |`) nên thân lệnh cướp được giá trị `paths`**
  Người dùng thấy gì: Nếu một đoạn lệnh nhiều dòng trong cấu hình vô tình nhắc tới chữ "paths", hệ thống có thể đọc nhầm dòng đó thành đường dẫn thật cần theo dõi, dẫn tới kiểm tra sai đường dẫn và bỏ lỡ cảnh báo.
  file: `feature-loop/scripts/repin-lane.mjs`
  severity: medium
  Đề xuất: known-limits

- **Lệnh đếm ngưỡng ở GUIDE §7.1 không đếm «giữa hai bản phát hành» và không bao giờ giảm**
  Người dùng thấy gì: Con số đếm trong tài liệu hướng dẫn chỉ tăng theo thời gian và không tính riêng cho từng lần phát hành, nên nó không phản ánh đúng tình trạng hiện tại và khó dùng để ra quyết định.
  file: `GUIDE.md`
  severity: low
  Đề xuất: known-limits

- **Assertion âm-tính-một-mình: đối chứng dương của phép so BYTE (GN03) bỏ qua mã thoát của cả hai làn**
  Người dùng thấy gì: Một số kịch bản kiểm thử nội bộ không kiểm tra rằng bước chạy thử đã thành công trước khi so sánh kết quả, nên một lỗi hạ tầng ẩn có thể khiến bài kiểm thử báo "đạt" một cách sai lệch.
  file: `tests/scripts/repin-lane-noi-ra.test.mjs`
  severity: medium
  Đề xuất: new-contract

- **Assert «chuỗi có mặt» bằng includes: vế kiểm khoá `evals_not_machine` của GN05 là hằng đúng vì tên khoá kia bao nó**
  Người dùng thấy gì: Một bài kiểm thử nội bộ đang xác nhận tài liệu hướng dẫn có đủ nội dung dùng một cách so khớp luôn đúng do trùng chữ, nên nếu tài liệu bị xoá mất một phần quan trọng, bài kiểm thử vẫn không phát hiện ra.
  file: `tests/scripts/repin-lane-noi-ra.test.mjs`
  severity: medium
  Đề xuất: new-contract

- **Lời khai eval hứa một phép kiểm CẤU TRÚC mà ca không hề đo (E7 / GN07 — «làn import globToRe từ carry-plan»)**
  Người dùng thấy gì: Nếu sau này có người thay cách so khớp mẫu bằng một cách viết tay nhìn giống nhưng không dùng đúng chỗ dùng chung, phép kiểm hiện tại vẫn báo đạt như cũ — người đọc báo cáo có thể tin nhầm là đã được kiểm chặt hơn thực tế.
  file: `_acceptance/ghim-lai-noi-ra-o-khong-do/evals.yaml`
  severity: medium
  Đề xuất: known-limits

- **Chiều đặc hiệu của GN11 đo PROXY (số dòng) trong khi lời hứa là NỘI DUNG, và không có mutant cho chiều im**
  Người dùng thấy gì: Bài kiểm thử xác nhận "không có cảnh báo mới xuất hiện" bằng cách đếm số dòng cảnh báo thay vì đọc nội dung, nên nếu nội dung cảnh báo bị lẫn sang một vị trí sai khác nhưng vẫn giữ cùng số dòng, bài kiểm thử sẽ không phát hiện ra.
  file: `tests/scripts/repin-lane-noi-ra.test.mjs`
  severity: low
  Đề xuất: known-limits

- **pathsCuaEval nhận-biết-vỏ TRƯỚC parseFlowValue — ba hình dạng YAML hợp lệ cho false negative IM (r1)**
  Người dùng thấy gì: Nếu tệp cấu hình eval có ghi chú hoặc dòng trống ngay trong phần khai đường dẫn theo dõi, công cụ ghim lại có thể không nhận ra rằng phần liên quan đã bị thay đổi, khiến báo cáo im lặng bỏ sót một thay đổi giao diện đáng lẽ phải được chú ý.
  file: `feature-loop/scripts/repin-lane.mjs`
  severity: high
  Đề xuất: known-limits

- **Vị từ «AC không có chốt máy» viết HAI BẢN (làn ghi + thẻ đọc), trái tiền lệ 2.12.0 đã đưa isRepinMachineEval vào lib (r1)**
  Người dùng thấy gì: Hai nơi trong hệ thống tự tính lại cùng một quy tắc 'tiêu chí nào chưa có máy xác nhận' theo hai cách viết riêng; nếu sau này gặp một tình huống ngoài các trường hợp đã thử, cảnh báo hiển thị cho người dùng và nội dung ghi vào hồ sơ có thể không khớp nhau.
  file: `feature-loop/scripts/repin-lane.mjs`
  severity: medium
  Đề xuất: known-limits

- **Lệnh đếm ngưỡng ở GUIDE §7.1 không đếm cái ngưỡng nó đứng cạnh (r1)**
  Người dùng thấy gì: Một đoạn hướng dẫn vận hành đưa ra lệnh đếm số hồ sơ đang có nguy cơ, nhưng lại diễn giải kết quả như thể đó là số lần một lỗi thực sự đã lọt qua — người đọc có thể tưởng ngưỡng cảnh báo đã đạt trong khi chưa có sự cố nào xảy ra.
  file: `GUIDE.md`
  severity: medium
  Đề xuất: known-limits

- **chamTuPin fail-IM khi không giải được pin cũ: tạo phẩm không phân biệt «không chạm» với «không tính được» (r1)**
  Người dùng thấy gì: Khi hệ thống không xác định được điểm mốc đã kiểm tra lần trước (ví dụ do lấy lịch sử không đầy đủ), nó âm thầm bỏ qua việc kiểm tra thay vì báo lỗi, và báo cáo trông giống hệt trường hợp 'mọi thứ liên quan đều không đổi' — người ký duyệt có thể tin nhầm là an toàn dù phép kiểm chưa từng chạy.
  file: `feature-loop/scripts/repin-lane.mjs`
  severity: medium
  Đề xuất: new-contract

- **chotMay của thẻ nuốt lỗi parse evals.yaml → cờ tắt lặng ở cả hai cổng (r1)**
  Người dùng thấy gì: Nếu tệp cấu hình eval bị lỗi định dạng, dòng cảnh báo 'tiêu chí này chưa có máy xác nhận khi ghim lại' sẽ biến mất khỏi thẻ quyết định mà không có thông báo gì, khiến người ký duyệt không biết thẻ đang thiếu thông tin.
  file: `scripts/gate-card.js`
  severity: low
  Đề xuất: known-limits

- **Cờ `evals_not_machine_touched` bị XOÁ bởi lượt ghim kế tiếp, không phải bởi chứng lại (r1)**
  Người dùng thấy gì: Nếu ghim lại nhiều lần liên tiếp, cảnh báo "phần giao diện chưa được kiểm lại" có thể tự tắt ở lượt ghim sau dù phần đó vẫn chưa thật sự được kiểm tra lại, khiến người đọc thẻ dễ tin nhầm là đã ổn.
  file: `scripts/gate-card.js`
  severity: medium
  Đề xuất: known-limits

- **`pathsCuaEval` không hiểu block scalar / dòng trống / chú thích → trả rỗng và in câu sai «không khai paths» (r1)**
  Người dùng thấy gì: Với một số cách viết evals.yaml (nhiều dòng, có chú thích) tính năng có thể báo sai là một mục kiểm không khai vùng đo, khiến người đọc hiểu nhầm phạm vi bị bỏ sót trong khi thực ra chỉ là đọc tệp chưa xử lý hết mọi cách viết.
  file: `feature-loop/scripts/repin-lane.mjs`
  severity: medium
  Đề xuất: known-limits

- **`criterion` không được chuẩn hoá trong phép gộp AC — lệch với hai bộ đọc khác của cùng thẻ (r1)**
  Người dùng thấy gì: Nếu criterion trong tệp cấu hình được viết kèm dấu nháy hoặc ghi chú, thẻ có thể nhóm sai tiêu chí không có chốt máy, khiến danh sách hiển thị không khớp giữa các nơi trong cùng một thẻ.
  file: `scripts/gate-card.js`
  severity: low
  Đề xuất: known-limits

- **Section Re-pin lặp id trong câu «không khai paths» (r1)**
  Người dùng thấy gì: Câu giải thích trong báo cáo lặp lại tên mục hai lần một cách dư thừa; hơi khó đọc nhưng không làm sai thông tin và đúng theo định dạng đã được duyệt.
  file: `feature-loop/scripts/repin-lane.mjs`
  severity: low
  Đề xuất: wont-fix

- **Chiều đỏ khai trong evals.yaml mà không tồn tại trong ca — lời khai thay cho phép đo (r1)**
  Người dùng thấy gì: Tài liệu mô tả trong bộ hồ sơ chấp nhận khai nhiều tình huống kiểm tra hơn số tình huống mã kiểm tra thực sự chạy, nên người đọc tài liệu có thể tin có nhiều lớp bảo vệ hơn thực tế.
  file: `_acceptance/ghim-lai-noi-ra-o-khong-do/evals.yaml`
  severity: medium
  Đề xuất: known-limits

- **Đo ĐẦU RA nhưng khai là đo NGUỒN: bất biến 'một nguồn globToRe' chỉ được nói bằng chữ (r1)**
  Người dùng thấy gì: Một mục trong hồ sơ chấp nhận tuyên bố phép kiểm đọc đúng mã nguồn gốc, nhưng thực ra phép kiểm chỉ xem kết quả hoạt động; nếu có ai viết lại logic đó bằng một đoạn mã khác tương đương, phép kiểm sẽ không phát hiện sự thay đổi cấu trúc đó.
  file: `_acceptance/ghim-lai-noi-ra-o-khong-do/evals.yaml`
  severity: medium
  Đề xuất: known-limits

- **Tuyên quét LỚP 'cả hai cách viết paths' nhưng bộ đọc có ba nhánh, ma trận chỉ phủ hai (r1)**
  Người dùng thấy gì: Bộ đọc cấu hình đường dẫn hỗ trợ ba cách viết khác nhau nhưng các phép kiểm hiện tại chỉ thử hai trong ba cách; cách viết còn lại — vốn dễ đọc sai nhất — chưa từng được kiểm.
  file: `feature-loop/scripts/repin-lane.mjs`
  severity: low
  Đề xuất: known-limits

- **Cờ vàng «pin đã chạm vật ngoài làn máy» tự tắt khi chạy làn ghim lần hai — chạy thêm một lượt thành đường né đo (r1)**
  Người dùng thấy gì: Khi bấm ghi lại lần thứ hai mà commit mới không đổi gì liên quan tới phần giao diện, cảnh báo 'phần giao diện có thay đổi chưa được kiểm lại' sẽ tự biến mất theo đúng thiết kế hiện tại — dù lần thay đổi giao diện trước đó vẫn chưa từng được kiểm lại thật.
  file: `scripts/gate-card.js`
  severity: high
  Đề xuất: known-limits

- **chotMay fail-OPEN lặng khi không đọc được evals.yaml / run-log.jsonl, lệch nếp fail-closed của chính tệp (r1)**
  Người dùng thấy gì: Nếu tệp dữ liệu của tính năng bị hỏng, thiếu, hoặc quá lớn, hệ thống sẽ âm thầm coi như mọi thứ đã được kiểm đủ mà không báo cho người xem biết là nó không đọc được dữ liệu để kiểm.
  file: `scripts/gate-card.js`
  severity: medium
  Đề xuất: known-limits

- **evals_not_machine_touched đo diff tới CÂY LÀM VIỆC sau khi executor đã chạy, không phải tới HEAD như SKILL/GUIDE khai (r1)**
  Người dùng thấy gì: Việc đo 'phần nào chưa được kiểm lại' có thể bị lẫn với những thay đổi tạm sinh ra trong lúc chính hệ thống đang chạy kiểm tra, khiến kết quả cảnh báo không hoàn toàn đáng tin trong một số tình huống hiếm.
  file: `feature-loop/scripts/repin-lane.mjs`
  severity: medium
  Đề xuất: known-limits

- **pathsCuaEval bỏ im lặng cả khối `paths:` khi block-seq có dòng chú thích / dòng trắng (r1)**
  Người dùng thấy gì: Nếu tệp cấu hình eval có dòng chú thích hoặc dòng trống nằm giữa danh sách đường dẫn theo dõi, hệ thống có thể bỏ sót một phần hoặc toàn bộ danh sách đó mà không báo lỗi, và báo cáo đã ký có thể ghi sai là một mục 'không khai đường dẫn' trong khi thực ra có khai.
  file: `feature-loop/scripts/repin-lane.mjs`
  severity: medium
  Đề xuất: new-contract

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).

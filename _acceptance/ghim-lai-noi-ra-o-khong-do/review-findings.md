## Trong hợp đồng

- **Assertion âm-tính-một-mình: hai bên đọc pre-merge chỉ được khẳng định 'không VIOLATION', chiều đỏ cố ý bỏ qua chúng**
  AC: AC-6
  file: `tests/scripts/repin-lane-noi-ra.test.mjs:519`
  severity: high
  source: measurement
  GN08 dựng bốn bên đọc trong mảng `doc` (recheck nay · recheck 2826f807 · premerge nay · premerge 2826f807) và vòng lặp khẳng định `if (/VIOLATION|REPIN x/.test(out)) errs.push(...)` cho CẢ BỐN. Nhưng đối chứng đỏ ngay dưới (`delete cuoi.evals_exit` rồi chạy lại) chỉ lặp trên `[doc[0], doc[1]]` — hai đường premerge không có đối chứng dương nào. Vì vậy vế 'premerge nay / premerge 2826f807 không báo VIOLATION' là khẳng định âm-tính-một-mình: nếu pre-merge-check.sh bỏ qua hồ sơ trong kho tạm (config không đọc được, slug ngoài phạm vi, thoát sớm, hay một đời sau ngừng đọc run-log.jsonl), đầu ra sẽ không chứa VIOLATION và ca vẫn XANH mà chưa hề chạy luật nào. Tôi đã kiểm bằng cách sửa vòng đối chứng thành `for (const [ten, chay] of doc)` — ca vẫn PASS, tức chiều đỏ của premerge chạy được ngay hôm nay và chỉ đơn giản là chưa được ghim vào ca.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **pathsCuaEval nhận-biết-vỏ TRƯỚC parseFlowValue — ba hình dạng YAML hợp lệ cho false negative IM**
  Người dùng thấy gì: Nếu tệp cấu hình eval có ghi chú hoặc dòng trống ngay trong phần khai đường dẫn theo dõi, công cụ ghim lại có thể không nhận ra rằng phần liên quan đã bị thay đổi, khiến báo cáo im lặng bỏ sót một thay đổi giao diện đáng lẽ phải được chú ý.
  file: `feature-loop/scripts/repin-lane.mjs:358`
  severity: high
  Đề xuất: known-limits

- **Vị từ «AC không có chốt máy» viết HAI BẢN (làn ghi + thẻ đọc), trái tiền lệ 2.12.0 đã đưa isRepinMachineEval vào lib**
  Người dùng thấy gì: Hai nơi trong hệ thống tự tính lại cùng một quy tắc 'tiêu chí nào chưa có máy xác nhận' theo hai cách viết riêng; nếu sau này gặp một tình huống ngoài các trường hợp đã thử, cảnh báo hiển thị cho người dùng và nội dung ghi vào hồ sơ có thể không khớp nhau.
  file: `feature-loop/scripts/repin-lane.mjs:392`
  severity: medium
  Đề xuất: known-limits

- **Lệnh đếm ngưỡng ở GUIDE §7.1 không đếm cái ngưỡng nó đứng cạnh**
  Người dùng thấy gì: Một đoạn hướng dẫn vận hành đưa ra lệnh đếm số hồ sơ đang có nguy cơ, nhưng lại diễn giải kết quả như thể đó là số lần một lỗi thực sự đã lọt qua — người đọc có thể tưởng ngưỡng cảnh báo đã đạt trong khi chưa có sự cố nào xảy ra.
  file: `GUIDE.md:1141`
  severity: medium
  Đề xuất: known-limits

- **chamTuPin fail-IM khi không giải được pin cũ: tạo phẩm không phân biệt «không chạm» với «không tính được»**
  Người dùng thấy gì: Khi hệ thống không xác định được điểm mốc đã kiểm tra lần trước (ví dụ do lấy lịch sử không đầy đủ), nó âm thầm bỏ qua việc kiểm tra thay vì báo lỗi, và báo cáo trông giống hệt trường hợp 'mọi thứ liên quan đều không đổi' — người ký duyệt có thể tin nhầm là an toàn dù phép kiểm chưa từng chạy.
  file: `feature-loop/scripts/repin-lane.mjs:370`
  severity: medium
  Đề xuất: new-contract

- **chotMay của thẻ nuốt lỗi parse evals.yaml → cờ tắt lặng ở cả hai cổng**
  Người dùng thấy gì: Nếu tệp cấu hình eval bị lỗi định dạng, dòng cảnh báo 'tiêu chí này chưa có máy xác nhận khi ghim lại' sẽ biến mất khỏi thẻ quyết định mà không có thông báo gì, khiến người ký duyệt không biết thẻ đang thiếu thông tin.
  file: `scripts/gate-card.js:265`
  severity: low
  Đề xuất: known-limits

- **Cờ `evals_not_machine_touched` bị XOÁ bởi lượt ghim kế tiếp, không phải bởi chứng lại**
  Người dùng thấy gì: Nếu ghim lại nhiều lần liên tiếp, cảnh báo "phần giao diện chưa được kiểm lại" có thể tự tắt ở lượt ghim sau dù phần đó vẫn chưa thật sự được kiểm tra lại, khiến người đọc thẻ dễ tin nhầm là đã ổn.
  file: `scripts/gate-card.js:290`
  severity: medium
  Đề xuất: known-limits

- **`pathsCuaEval` không hiểu block scalar / dòng trống / chú thích → trả rỗng và in câu sai «không khai paths»**
  Người dùng thấy gì: Với một số cách viết evals.yaml (nhiều dòng, có chú thích) tính năng có thể báo sai là một mục kiểm không khai vùng đo, khiến người đọc hiểu nhầm phạm vi bị bỏ sót trong khi thực ra chỉ là đọc tệp chưa xử lý hết mọi cách viết.
  file: `feature-loop/scripts/repin-lane.mjs:341`
  severity: medium
  Đề xuất: known-limits

- **`criterion` không được chuẩn hoá trong phép gộp AC — lệch với hai bộ đọc khác của cùng thẻ**
  Người dùng thấy gì: Nếu criterion trong tệp cấu hình được viết kèm dấu nháy hoặc ghi chú, thẻ có thể nhóm sai tiêu chí không có chốt máy, khiến danh sách hiển thị không khớp giữa các nơi trong cùng một thẻ.
  file: `scripts/gate-card.js:265`
  severity: low
  Đề xuất: known-limits

- **Section Re-pin lặp id trong câu «không khai paths»**
  Người dùng thấy gì: Câu giải thích trong báo cáo lặp lại tên mục hai lần một cách dư thừa; hơi khó đọc nhưng không làm sai thông tin và đúng theo định dạng đã được duyệt.
  file: `feature-loop/scripts/repin-lane.mjs:461`
  severity: low
  Đề xuất: wont-fix

- **Assertion âm-tính-một-mình: chiều im của GN11 so 0 với 0, không đối chứng dương**
  Người dùng thấy gì: Một trong các phép kiểm tự động của chính công cụ này có thể luôn báo 'ổn' bất kể mã nguồn có thật sự thay đổi hay không, nên nó không thực sự bảo vệ được phần hành vi mà nó tuyên bố đang theo dõi.
  file: `tests/scripts/repin-lane-noi-ra.test.mjs:646`
  severity: high
  Đề xuất: new-contract

- **Chiều đỏ khai trong evals.yaml mà không tồn tại trong ca — lời khai thay cho phép đo**
  Người dùng thấy gì: Tài liệu mô tả trong bộ hồ sơ chấp nhận khai nhiều tình huống kiểm tra hơn số tình huống mã kiểm tra thực sự chạy, nên người đọc tài liệu có thể tin có nhiều lớp bảo vệ hơn thực tế.
  file: `_acceptance/ghim-lai-noi-ra-o-khong-do/evals.yaml:60`
  severity: medium
  Đề xuất: known-limits

- **Đo ĐẦU RA nhưng khai là đo NGUỒN: bất biến 'một nguồn globToRe' chỉ được nói bằng chữ**
  Người dùng thấy gì: Một mục trong hồ sơ chấp nhận tuyên bố phép kiểm đọc đúng mã nguồn gốc, nhưng thực ra phép kiểm chỉ xem kết quả hoạt động; nếu có ai viết lại logic đó bằng một đoạn mã khác tương đương, phép kiểm sẽ không phát hiện sự thay đổi cấu trúc đó.
  file: `_acceptance/ghim-lai-noi-ra-o-khong-do/evals.yaml:131`
  severity: medium
  Đề xuất: known-limits

- **Tuyên quét LỚP 'cả hai cách viết paths' nhưng bộ đọc có ba nhánh, ma trận chỉ phủ hai**
  Người dùng thấy gì: Bộ đọc cấu hình đường dẫn hỗ trợ ba cách viết khác nhau nhưng các phép kiểm hiện tại chỉ thử hai trong ba cách; cách viết còn lại — vốn dễ đọc sai nhất — chưa từng được kiểm.
  file: `feature-loop/scripts/repin-lane.mjs:363`
  severity: low
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 2/14 lỗi rơi vào file không bộ đo nào phủ (_acceptance/ghim-lai-noi-ra-o-khong-do/evals.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.

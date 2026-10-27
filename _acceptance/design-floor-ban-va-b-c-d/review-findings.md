## Trong hợp đồng

Không có finding nào map được vào AC.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Đích không phải HTML trả 5 TRƯỚC khi kiểm đầu vào, nên lỗi cú pháp (4) và thiếu tệp (3) bị che thành KHÔNG-ĐO-ĐƯỢC**
  Người dùng thấy gì: Khi chấm một trang không phải HTML mà còn thiếu tệp token hoặc nhập sai giá trị, công cụ báo «không đo được» thay vì báo đúng là thiếu đầu vào. Người dùng vẫn thấy là không đo được, chỉ là lý do hiển thị kém chính xác.
  Căn cứ: Hậu quả nhẹ: lần chạy vẫn không cho xanh giả, chỉ sai nhãn lý do, và người dùng sửa đầu vào rồi chạy lại là xong.
  file: `design-floor/vendor/design-os/src/commands/token-coverage.ts`
  severity: medium
  Đề xuất: known-limits

- **reuse-plan check vẫn đọc ngầm <cwd>/design/patterns, nên phán quyết đổi theo chỗ chạy dù bản vá C nói «never read from <cwd>/design/»**
  Người dùng thấy gì: Kiểm tra kế hoạch tái dùng có thể cho kết quả khác nhau tuỳ thư mục đang đứng khi chạy, vì nó còn đọc ngầm các mẫu có sẵn ở đó. Cùng một kế hoạch có thể đỏ ở máy này và xanh ở máy khác.
  Căn cứ: Chỉ xảy ra khi thư mục chạy tình cờ có sẵn thư mục mẫu trùng tên, nên hiếm gặp; người dùng có thể phát hiện và chạy lại ở thư mục sạch, nhưng kết quả xanh sai có thể lọt nếu không để ý.
  file: `design-floor/vendor/design-os/src/commands/reuse-plan-check-impl.ts`
  severity: medium
  Đề xuất: known-limits

- **Chữ người đọc và JSON vẫn ghi PASS trong khi mã thoát là 5 (KHÔNG-ĐO-ĐƯỢC)**
  Người dùng thấy gì: Với trang không đo được, báo cáo hiển thị vẫn ghi «PASS» dù kết luận cuối cùng là không đo được. Ai chỉ đọc dòng chữ mà không nhìn kết luận cuối có thể tưởng trang đã đạt.
  Căn cứ: Gây hiểu lầm nhưng không làm mất dữ liệu; kết luận cuối vẫn đúng nên máy gác cổng không bị lừa, còn người đọc báo cáo cần được dặn rõ giới hạn này.
  file: `design-floor/vendor/design-os/src/commands/gate.ts`
  severity: medium
  Đề xuất: known-limits

- **dtcg-token-tree.ts tự nhận là «bản chép NGUYÊN VĂN» của figma-ds-tokens.ts nhưng không phép đo nào giữ lời đó**
  Người dùng thấy gì: Một bản sao mã được ghi là «giống nguyên văn» bản gốc, nhưng không có gì kiểm điều đó. Khi bản gốc được sửa lỗi sau này, bản sao có thể lặng lẽ không nhận được bản sửa.
  Căn cứ: Rủi ro nằm ở tương lai, chỉ phát sinh khi đồng bộ bản gốc; hiện không ảnh hưởng người dùng và có thể chấp nhận bằng cách khai rõ giới hạn.
  file: `design-floor/vendor/design-os/src/core/dtcg-token-tree.ts`
  severity: medium
  Đề xuất: known-limits

- **Chú thích JSDoc ở output.ts lệch hoặc mồ côi sau bản vá B**
  Người dùng thấy gì: Vài dòng giải thích trong mã nguồn bị đặt lệch chỗ hoặc còn ghi cũ. Người dùng cuối không thấy gì khác biệt.
  Căn cứ: Chỉ là chú thích, không đổi hành vi; sửa tốn công hơn nhiều so với hậu quả.
  file: `design-floor/vendor/design-os/src/core/output.ts`
  severity: low
  Đề xuất: wont-fix

- **reuse-plan check: a --tokens path that doesn't exist exits 0 (PASS) instead of 3**
  Người dùng thấy gì: Nếu gõ sai đường dẫn tới tệp token khi kiểm tra kế hoạch tái dùng, công cụ vẫn báo đạt thay vì báo thiếu tệp. Người dùng có thể tin kế hoạch đã qua kiểm tra trong khi tệp token chưa hề được đọc.
  Căn cứ: Là xanh giả thật nhưng chỉ khi gõ sai đường dẫn, và lỗi gõ thường lộ ra ở bước khác; sửa rẻ nên nên đưa vào một hợp đồng riêng.
  file: `design-floor/vendor/design-os/src/commands/reuse-plan-check-impl.ts`
  severity: high
  Đề xuất: new-contract

- **reuse-plan check still reads <cwd>/design/patterns, so the verdict depends on where it is run, despite patch C**
  Người dùng thấy gì: Kết quả kiểm tra kế hoạch tái dùng có thể thay đổi theo thư mục đang chạy vì công cụ còn đọc ngầm các mẫu ở đó. Hai người chạy cùng kế hoạch ở hai nơi có thể thấy hai kết quả khác nhau.
  Căn cứ: Hiếm gặp và người dùng tự phát hiện được bằng cách chạy lại ở thư mục sạch; nên ghi thành giới hạn đã biết.
  file: `design-floor/vendor/design-os/src/commands/reuse-plan-check-impl.ts`
  severity: medium
  Đề xuất: known-limits

- **gate passes a page with zero CSS declarations (token-coverage shows a vacuous 100%) while token-coverage exits 5 on the same page**
  Người dùng thấy gì: Một trang hoàn toàn không có khai báo kiểu dáng vẫn được cổng tổng báo đạt, trong khi lệnh đo riêng lại báo không đo được. Người dùng có thể tin trang đã qua cổng chỉ vì không có gì để chấm.
  Căn cứ: Là xanh rỗng ở cổng chính nên đáng sửa, nhưng chỉ ảnh hưởng trang không có kiểu dáng nào, ít gặp; nên đưa vào một hợp đồng riêng.
  file: `design-floor/vendor/design-os/src/commands/gate.ts`
  severity: medium
  Đề xuất: new-contract

- **Hình 3/4 — đối chứng mới của DF-02 so trọn stdout, mà stdout chứa chính đường --tokens, nên luôn «khác» và không thể hỏng**
  Người dùng thấy gì: Phép kiểm chứng rằng thiết kế mồi thật sự làm đổi kết quả chấm có thể luôn báo «khác» dù mồi vô dụng. Nên màu xanh ở đây chưa chứng minh chắc điều nó tuyên bố.
  Căn cứ: Không ảnh hưởng người dùng sản phẩm, chỉ làm một bằng chứng kiểm thử yếu hơn vẻ ngoài; ghi rõ giới hạn là đủ cho tới khi có vòng siết thước.
  file: `tests/design-floor/hop-dong.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình 4 — phép đo mới so-va.mjs (AC-7) chỉ khẳng định vắng mặt, chưa từng chạy chiều đỏ; E7 ghi một chiều đỏ mà executor của nó không chạy**
  Người dùng thấy gì: Phép kiểm sổ giới hạn đang sạch chưa từng được thử ở chiều làm nó đỏ, nên chưa chắc nó phân biệt được «sổ sạch» với «không đọc thấy gì». Một mô tả trong bộ đánh giá cũng hứa một ca đỏ mà thực tế không chạy.
  Căn cứ: Chỉ làm bằng chứng yếu hơn mô tả, không ảnh hưởng người dùng sản phẩm; nên khai là giới hạn đo lường đã biết.
  file: `tests/design-floor/so-va.mjs`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).

## Trong hợp đồng

**Đường `feature_loop.models` vẫn cắt bằng `(\S+)` nên bảo đảm «hết dấu nháy thừa» không đúng cho giá trị có khoảng trắng**
- file: `feature-loop/scripts/s4-args.mjs:219`
- severity: low
- AC: AC-4
- source: conventions

Dòng 219 vẫn bắt giá trị bằng `line.trim().match(/^([\w-]+):\s*(\S+)/)` rồi mới đưa qua cổng chung. Với `executor: "sonnet 4.6"`, regex chỉ bắt được `"sonnet`; `parseFlowValue` (đúng theo thiết kế) thấy chuỗi KHÔNG cân nên trả nguyên văn kèm dấu nháy MỞ → `"sonnet`. Mệnh đề cũ tuy cũng cụt nhưng ít ra trả `sonnet`. Đo được: `parseFlowValue('"sonnet') === '"sonnet'`. `models` là một trong bảy/chín «đường thi-hành» mà AC-4 hứa «trả đúng chuỗi người viết», và giá trị này đi thẳng vào chỉ thị model của agent, nên đây là chiều FAIL-OPEN nhỏ còn sót lại trong chính phạm vi đã khai. Răng BG4 đường 7 chỉ dùng `"hai\"ku"` (không khoảng trắng) nên không phân biệt được ca này. Sửa đúng tầng là bắt phần còn lại của dòng (`(.*)$`) rồi để cổng chung cắt chú thích + bóc vỏ, giống bốn chỗ kia.

**Hình dạng 5 — lưới «số đột biến = hằng khai trước» là hằng đúng, không bao giờ nổ được**
- file: `tests/scripts/bo-giai-nhay.test.mjs:482`
- severity: medium
- AC: AC-12
- source: measurement

Dòng 478: `const BG8_MUTANTS = MUT_ALL.length;` — hằng SUY TỪ chính mảng. Dòng 481–482: `const MUT = MUT_ALL; if (MUT.length !== BG8_MUTANTS) { do_(...) }`. Hai vế của phép so là CÙNG một biểu thức trên CÙNG một mảng, nên điều kiện không thể đúng ở bất kỳ cây nào — dòng 482 là mã chết đội lốt lưới P105. Ba chân chị em (BG1_M_COUNT=10 dòng 49, BG4_ASSERTS=13 dòng 173, BG7_ASSERTS=18 dòng 320) đều là hằng GÕ TAY nên lưới của chúng nổ thật khi xoá một phần tử; riêng BG8 thì xoá một dòng của bảng `DUONG` làm ma trận co lại LẶNG (BG8_MUTANTS tự co theo) và dòng PASS 511 in ra con số đã co. Đây đúng là «tuyên quét LỚP nhưng số assert không được ghim trước»: E12 trong evals.yaml khai «Số đột biến BẰNG một hằng khai trước», nhưng trong mã không có hằng khai trước nào cả.

**Hình dạng 3 — đường 9 của danh sách đóng AC-4 chỉ được đo bằng «chuỗi nguồn có mặt», không có khẳng định QUAN HỆ nào**
- file: `tests/scripts/bo-giai-nhay.test.mjs:474`
- severity: medium
- AC: AC-12
- source: measurement

Bảng `DUONG` dòng 474 khai đường 9 (`carry-plan.mjs` `cmd:`) với `cu = null`, chú thích dòng 444 giải thích `null = đường không đột biến được`. Hệ quả: `MUT_ALL` (dòng 476) loại nó, nên BG8 không có ô phân biệt cho nó; và không chân nào khẳng định giá trị nó trả về — fixture duy nhất chạm `cmd` là BG9 (dòng 397) dùng `cmd: echo ok`, một scalar KHÔNG nháy nên mệnh đề cũ và bộ giải mới trả y hệt. Bằng chứng duy nhất cho đường 9 là phép có-mặt chuỗi nguồn ở BG6 dòng 302 (`src.includes('cur.cmd = R.parseFlowValue(f[1]).value')`), trong khi lời hứa của AC-4 là QUAN HỆ «đường đó trả chuỗi đúng như người viết nó». Kiểm chứng: hoàn nguyên đường 9 trên bản sao `git archive HEAD` thành `cur.cmd = f[1].trim().replace(/^["']|["']$/g, '')` chỉ làm BG6 đỏ (mất neo văn bản); BG4, BG7, BG9 vẫn XANH. Nhãn «không đột biến được» cũng sai theo nghĩa đen — đường này đột biến được, nó chỉ không có chân hành vi để pin. Khác với đường 6 (`id`), đường 9 không được khai ở Out of scope của hợp đồng.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Manifest 2.11.0 khai SAI cơ chế: nói `unquoteScalar` là cổng duy nhất, mã lại gác bằng `parseFlowValue`**
  Người dùng thấy gì: Ghi chú đi kèm bản phát hành mô tả sai cơ chế chống lỗi bên trong hệ thống, nên người đọc tài liệu này để chẩn đoán sự cố có thể bị dẫn sai hướng khi tra cứu.
  file: `.claude-plugin/plugin.json:4`
  severity: high
  Đề xuất: new-contract

- **Manifest mang lại con số +258/−16 mà chính hồ sơ đã ghi là đo SAI**
  Người dùng thấy gì: Ghi chú đi kèm bản phát hành nêu sai số liệu về mức độ thay đổi của một phần hệ thống, có thể khiến người đọc đánh giá sai quy mô thật của bản vá.
  file: `.claude-plugin/plugin.json:4`
  severity: medium
  Đề xuất: new-contract

- **.gitignore thêm mẫu `s4-args.json` không neo, trong khi đã có hai tệp cùng tên đang được track**
  Người dùng thấy gì: Một quy tắc bỏ qua tệp mới thêm không giới hạn đúng phạm vi, có thể khiến các tệp lưu vết công việc của tính năng trong tương lai bị bỏ sót khỏi kho lưu trữ mà không có cảnh báo nào.
  file: `.gitignore:23`
  severity: low
  Đề xuất: new-contract

- **stripYamlComment does not strip a value that is ONLY a comment → unfilled executor key becomes a no-op command that exits 0 (false green)**
  Người dùng thấy gì: Nếu một dòng cấu hình lệnh chưa được điền và chỉ còn lại ghi chú nhắc việc, hệ thống có thể hiểu nhầm đó là một lệnh hợp lệ, chạy mà không làm gì rồi báo kết quả THÀNH CÔNG giả — cùng loại lỗi mà bản phát hành này được tạo ra để đóng, nhưng ở một hình dạng khác.
  file: `lib/evidence-core.cjs:76`
  severity: high
  Đề xuất: new-contract

- **rang-moc.sh spins forever (busy infinite loop, no output, no exit) when --chan is passed without a value**
  Người dùng thấy gì: Nếu công cụ đo kiểm nội bộ bị gọi sai cách (thiếu một tham số), nó có thể treo vô thời hạn thay vì báo lỗi rõ ràng, làm nghẽn cả quy trình kiểm tra tự động.
  file: `_acceptance/release-2-11-0/rang-moc.sh:31`
  severity: high
  Đề xuất: new-contract

- **Unanchored `s4-args.json` in .gitignore silently excludes the S4 provenance artifact for every future slug**
  Người dùng thấy gì: Một quy tắc bỏ qua tệp mới thêm không giới hạn đúng phạm vi, có thể khiến các tệp lưu vết công việc của những tính năng ra đời sau này bị âm thầm loại khỏi kho lưu trữ mà không ai hay biết.
  file: `.gitignore:23`
  severity: medium
  Đề xuất: new-contract

- **carry-plan readers() caches the first resolved core in a module-level variable and ignores agRoot on later calls; exported plan() can now process.exit**
  Người dùng thấy gì: Một phần mã dùng chung có thể lưu nhầm kết quả từ lần gọi đầu tiên rồi tái dùng cho các lần gọi sau có ngữ cảnh khác; hiện chưa gây ảnh hưởng vì cách dùng hiện tại chỉ gọi một lần cho mỗi lượt chạy, nhưng tiềm ẩn rủi ro nếu được tái sử dụng theo cách khác trong tương lai.
  file: `feature-loop/scripts/carry-plan.mjs:31`
  severity: low
  Đề xuất: known-limits

- **E10's expected text claims --ag-root is mandatory and fail-CLOSED, but the flag is optional with a silent path fallback**
  Người dùng thấy gì: Một dòng mô tả trong hồ sơ kiểm thử tuyên bố một điều kiện bắt buộc mà thực tế lại không bắt buộc, khiến người đọc hồ sơ có thể tin nhầm vào một ràng buộc an toàn không thật sự tồn tại.
  file: `_acceptance/release-2-11-0/evals.yaml:208`
  severity: low
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 3/11 lỗi rơi vào file không bộ đo nào phủ (.gitignore, _acceptance/release-2-11-0/evals.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
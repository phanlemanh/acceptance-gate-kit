## Trong hợp đồng

- **Workspace có mỗi uat-session.md bị NUỐT im lặng ở start-scan và xếp SAI ô ở product-map (hai reader trái nhau)**
  file: `lib/workspace-record.js:61`
  severity: high
  source: bugs
  AC: AC-1
  detail: `recordProblem` chỉ trả lỗi "không có contract.md lẫn opportunity.md" khi `!present.length`, mà `present` lọc trên CẢ BA file trong NAV_FIELDS (kể cả uat-session.md). Nên một thư mục `_acceptance/<slug>/` chỉ có `uat-session.md` (contract.md/opportunity.md vắng, hoặc đọc không được vì `read()` nuốt mọi lỗi I/O thành null) KHÔNG còn bị coi là hồ sơ hỏng.

  Hậu quả — đã dựng lại và chạy thật:

  1. `scripts/start-scan.mjs`: qua được recordProblem, `nav.verdict` rỗng → không vào nhánh verdict; rồi `if (cTxt != null) … else if (oTxt != null) …` (dòng 82/109) KHÔNG có nhánh else, nên slug rơi ra ngoài hoàn toàn — không có trong gates, inProgress, done, LẪN broken. Output thật: `{"groups":{"gates":[],"inProgress":[],"done":[]},"map":{...},"broken":[]}` — slug biến mất khỏi thẻ vào phiên, không một dòng cờ nào.

  2. `scripts/product-map.mjs` cùng hồ sơ đó: status='' → bỏ qua; `stage` từ oTxt=null → '' ≠ 'decided' → xếp vào **"## Đang cân nhắc cơ hội"** dù không hề có `opportunity.md`.

  Đây đúng là lớp false-green mà `lib/workspace-record.js` được dựng ra để diệt (comment đầu file + case P110): hai bên đọc cùng một sự thật cho hai kết luận trái nhau. P110 không bắt được vì danh sách CASES không có hình dạng "chỉ uat-session.md".

  Còn là REGRESSION so với trước diff: chạy `start-scan.mjs` ở 9732271 trên cùng fixture cho `broken:[{slug:"orphan-uat",file:"(workspace)",reason:"không có contract.md lẫn opportunity.md"}]`. Nhánh `else broken.push(...'(workspace)')` cũ đã bị xoá và luật chung không thay thế được nó.

  Sửa: guard phải là "không có contract.md lẫn opportunity.md" thật (kiểm hai file đó), không phải `!present.length` trên cả ba; và/hoặc start-scan phải có nhánh else đẩy vào broken[].

  rationale: Một thư mục chỉ có uat-session.md (không contract.md, không opportunity.md) đúng là trạng thái 'hồ sơ hỏng' theo định nghĩa của chính module (REQUIRED_BY_FILE), nhưng product-map.mjs lại xếp nó vào mục thường 'Đang cân nhắc cơ hội' thay vì mục hồ sơ hỏng riêng — vi phạm trực tiếp yêu cầu AC-1 'hồ sơ hỏng vẫn hiện trong mục riêng — không sót, không trùng, không crash'.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **NAV_ENUMS keyed by field name only — `stage` means two different enums in two files**
  Người dùng thấy gì: Nếu sau này có người mở rộng việc kiểm tra sang trường 'giai đoạn' của phiên nghiệm thu, hệ thống có thể hiểu nhầm giá trị hợp lệ thành lỗi (hoặc ngược lại) vì đang dùng nhầm bảng đối chiếu của một hồ sơ khác. Hiện tại chưa ai bị ảnh hưởng, nhưng đây là rủi ro để lại cho lần sửa kế tiếp.
  file: `lib/workspace-record.js:13`
  severity: medium
  Đề xuất: known-limits

- **New human gate (Cổng Giá trị / uat-session) is documented nowhere for the human; GUIDE still says "đúng 2 điểm dừng"**
  Người dùng thấy gì: Người dùng sẽ thấy một dòng cổng mới ('Cổng Giá trị') xuất hiện trên thẻ vào phiên, nhưng tài liệu hướng dẫn tổng quan của bộ công cụ vẫn nói chỉ có 2 điểm dừng và không giải thích cổng mới này là gì — dễ gây bối rối khi gặp lần đầu.
  file: `GUIDE.md:109`
  severity: medium
  Đề xuất: known-limits

- **CONTEXT.md glossary not extended for the new load-bearing terms**
  Người dùng thấy gì: Các tên gọi mới ('Cổng Giá trị', 'phiên nghiệm thu', 'bản đồ sản phẩm'...) chưa được ghi vào từ điển thuật ngữ dùng chung của kit, nên người viết tài liệu hoặc thông báo lỗi sau này có thể gọi cùng một khái niệm bằng nhiều tên khác nhau, gây khó hiểu cho người đọc.
  file: `CONTEXT.md:68`
  severity: low
  Đề xuất: known-limits

- **fileFromTemplate im lặng để lại placeholder chưa thay — đúng lớp trôi khuôn mà helper sinh ra để chặn**
  Người dùng thấy gì: Khi dựng dữ liệu mẫu để kiểm thử, nếu người viết test quên điền một trường thì trường đó âm thầm bị để trống thay vì báo lỗi ngay — điều này có thể khiến một số bài kiểm thử trông như đã chạy đúng trong khi thực ra đang kiểm nhầm một giá trị rác, làm lọt lỗi thật ra sản phẩm.
  file: `tests/fixtures/from-template.mjs:17`
  severity: medium
  Đề xuất: known-limits

- **P110 case "status rong": bước tiêm là no-op nên hình dạng khoá-rỗng-trần không bao giờ được chạy**
  Người dùng thấy gì: Một bài kiểm thử được viết ra để bắt lỗi 'trường trạng thái bị để trống' hoá ra không thực sự tạo ra tình huống đó khi chạy, nên nếu một bản vá liên quan bị gỡ bỏ trong tương lai, lỗi tương ứng có thể lọt qua mà không ai phát hiện.
  file: `tests/plugins/run-tests.sh:3675`
  severity: medium
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 3/6 lỗi rơi vào file không bộ đo nào phủ (GUIDE.md, CONTEXT.md, tests/fixtures/from-template.mjs) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
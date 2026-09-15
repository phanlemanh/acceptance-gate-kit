## Trong hợp đồng

- **Dòng mã lạ KHÔNG bị bỏ như contract AC-3 và chính dòng log tuyên — vẫn ghép qua nấc 2/3**
  file: `feature-loop/workflows/acceptance-verify.js:1005`
  severity: medium
  source: conventions
  AC: AC-3
  `ghepTriage` chỉ loại dòng mã-lạ khỏi `byTid`; `byKey = new Map(rows.map(...))` và pool nấc 3 `rows.find(...)` vẫn lấy TRỌN `rows`, nên dòng mang mã ngoài tập gửi vẫn ghép sang finding theo khoá tệp::tiêu đề. Contract AC-3 (contract.md dòng 57–63): «dòng ấy bị bỏ như một dòng THỪA — không thay thế, không ghép sang phát hiện nào»; dòng log in ra: «bo dong thua, khong ghep sang ai». Tái hiện: lượt 1 trả t1, t2 và {tid:'t7', file:'src/c.js', title:'sai ma thoat'} (không có dòng t3) → 1 lượt triage, triageFailed=false, t3 nhận phân loại từ dòng t7, trong khi log vẫn in «ma la t7 — bo dong thua, khong ghep sang ai». Chân ma-la (E3) không thấy vì dòng lạ mang title 'bia' nên không khớp khoá nào — răng đo dòng log chứ không đo hành vi ghép (đúng hình dạng (1) trong luật «thước phải gắn vào vật»). Cần chọn một: lọc `rows` bỏ dòng mã-lạ TRƯỚC khi dựng byKey/nấc 3 (khớp contract), hoặc sửa contract + log cho đúng hành vi «mã lạ chỉ mất quyền ghép theo mã» — nhưng không được để log nói một đằng mã làm một nẻo.

- **Chân bo-doc-bo-qua: helper `cli()` nuốt lỗi thi hành và `giong` chỉ so BẰNG hai đầu ra — bộ đọc crash giống nhau ở cả hai workspace vẫn xanh**
  file: `tests/workflows/triage-do-tin.test.mjs:339`
  severity: low
  source: bugs
  AC: AC-7
  `cli = … try { execFileSync(…) } catch (e) { return stdout+stderr }` rồi `giong(rel, mk)` trả non-null khi output(ws) === output(wsB) sau khi chuẩn hoá `wsB?`→`ws`. Với round-tally-read, acceptance-gold, loop-health, điều kiện CHAY chỉ là `giong(...) !== null` — một stack trace MODULE_NOT_FOUND/TypeError giống hệt ở hai bên (đường dẫn scratch đã được chuẩn hoá) cũng thoả, tức «bộ đọc bỏ qua dòng triage» được kết luận mà bộ đọc chưa từng đọc. Chỉ evidence-core (ids.has(RID)) và recheck (regex nội dung) có đối chứng dương thật. Đã chạy tay 4 CLI trên workspace của chân: hiện tại đều chạy sạch, nên đây là lưới thiếu chứ chưa phải lượt xanh giả — nhưng đúng lớp «assertion âm-tính-một-mình» của CLAUDE.md. Sửa rẻ: cli() trả thêm exit status và giong đòi status 0 ở cả hai bên, hoặc ghim một mảnh nội dung mong đợi (vd round-tally có `"round": 1`) cho từng bộ.

- **Assertion âm-tính-một-mình: ma trận bộ đọc chỉ so «bằng nhau có/không dòng triage», không đối chứng dương, mã thoát bị nuốt**
  file: `tests/workflows/triage-do-tin.test.mjs:335`
  severity: high
  source: measurement
  AC: AC-7
  Chân bo-doc-bo-qua, khối CHAY (dòng 335–343): ba mục round-tally-read / acceptance-gold / loop-health chỉ assert `giong(...) !== null`, tức đầu ra của CLI trên ws (có dòng triage) BẰNG đầu ra trên wsB (không có dòng triage). Không có assert nào chứng minh bộ đọc đã THẤY dòng run_id (RID / EVAL_RID) — dù chú thích ở dòng 334 tuyên «mỗi bộ: bỏ qua dòng triage VÀ thấy dòng run_id (đối chứng dương)». Hàm `cli` (dòng 323) còn catch lỗi và trả stdout+stderr, bỏ mã thoát: script exit 1/2/127, in usage, hoặc báo «không thấy thư mục _acceptance/» giống nhau ở cả hai phía thì `giong` vẫn ≠ null → xanh. Tôi chạy thử acceptance-gold với --root sai: in một dòng lỗi, rc=0 — nếu cả hai phía sai như nhau, phép đo này vẫn xanh. Mục recheck-evidence (dòng 341) cũng chỉ assert VẮNG ba chuỗi đỏ trên một đầu ra thực tế là chuỗi rỗng (recheck im lặng khi xanh) — vắng-chuỗi trên chuỗi-rỗng là vô nghĩa, lại không ghim mã thoát 0 hay thông điệp xanh. Mục carry-plan (dòng 337) so JSON hai plan bằng nhau nhưng không assert plan phản ánh dòng repin/run_id nào — bộ đọc bỏ hẳn runLogText cũng cho hai plan bằng nhau. Chỉ evidence-core (dòng 336) có đối chứng dương thật (`ids.has(RID) && ids.has(EVAL_RID)`). Với 4/6 bộ chạy, «bỏ qua dòng triage» không phân biệt được với «chưa bao giờ đọc run-log» hay «đỏ giống nhau ở cả hai phía».

- **Đo CHỈ DẪN thay vì ĐẦU RA: lược đồ triage được grep trong nguồn thay vì đọc từ opts.schema mà tác tử nhận**
  file: `tests/workflows/triage-do-tin.test.mjs:134`
  severity: medium
  source: measurement
  AC: AC-10
  Chân seam-ma, assert «luoc do dung cung hang TRIAGE_ID_FIELD (mot nguon)» = `SRC.includes("[TRIAGE_ID_FIELD]: { type: 'string'") && SRC.includes("required: [...]")` — grep hai chuỗi literal trong nguồn acceptance-verify.js. Harness đã ghi lại vật thật: `triageCalls(that.calls)[0].opts.schema` là chính TRIAGE_SCHEMA workflow gửi cho agent, có thể đọc `.properties.triaged.items.required` và `.properties.triaged.items.properties[ID_FIELD]`. Grep nguồn đỏ khi ai đó chỉ đổi dấu cách/thứ tự trong mảng required (hành vi không đổi), và IM khi lược đồ đúng chữ nhưng không còn được truyền vào agent (vd `schema: FINDINGS_SCHEMA` nhầm) — tức đo chữ trong file, không đo cái bên đọc (agent) thực nhận. Hai mutant mut1/mut2 cùng chân chỉ chạm tải gửi (dòng Findings), không chạm lược đồ, nên lược đồ chỉ được bảo vệ bởi phép grep này.

- **Assert «có mặt/đếm» trong khi lời hứa là QUAN HỆ finding.tid ↔ dòng trả về: mọi dòng giả giống hệt nhau nên ghép-sai-nhưng-đủ không thể đỏ**
  file: `tests/workflows/triage-do-tin.test.mjs:50`
  severity: medium
  source: measurement
  AC: AC-1
  `row(f)` (dòng 50) sinh dòng phản hồi với inContract:true, acRef:'AC-1', rationale:'r' GIỐNG NHAU cho mọi finding; chỉ tid/title/file khác. Các chân ma-may-duc (dòng 81: `triageFailed === false && triageCalls.length === 1`), hoi-lai, chu-ky-kiem, im chỉ assert cờ triageFailed và SỐ lượt gọi tác tử / số refute, không bao giờ soi finding nào nhận phân loại của dòng nào (result.findings / rejectFindings theo từng finding). AC-1 hứa «ghép ĐÚNG theo mã máy đúc kể cả hai phát hiện trùng tiêu đề» — một mutant ghép theo vị trí (`byFinding.set(distinctKey(sent[i]), rows[i])`) hay ghép chéo t1↔t2 vẫn cho «đủ 3, không hỏi lại, không triageFailed» → xanh. Muốn răng cắn được, dòng giả phải mang giá trị phân biệt theo tid (vd acRef/inContract khác nhau) và assert phải đối chiếu phân loại từng finding với dòng cùng tid.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Ghép lời nhắc bằng String.replace — ký tự `$` trong finding làm hỏng tải gửi đi (cả lượt 1)**
  Người dùng thấy gì: Khi nội dung một phát hiện review chứa ký hiệu đặc biệt như dấu đô la, công cụ phân loại tự động có thể đọc nhầm dữ liệu đó và âm thầm coi cả lượt kiểm tra là hỏng, khiến toàn bộ kết quả phải bị xét duyệt lại dù không ai báo lỗi.
  file: `feature-loop/workflows/acceptance-verify.js`
  severity: high
  Đề xuất: new-contract

- **Fixture run-log/workspace ở đường tmp CỐ ĐỊNH dùng chung — ba eval chạy song song cùng ghi/đọc một tệp**
  Người dùng thấy gì: Khi nhiều lượt kiểm tra tự động chạy cùng lúc, chúng có thể vô tình ghi đè dữ liệu tạm của nhau, khiến kết quả kiểm tra báo lỗi giả không phản ánh đúng chất lượng thật của tính năng.
  file: `tests/workflows/triage-do-tin.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **triagePromptFor dùng String.replace với chuỗi thay thế chưa thoát `$` — tải Findings bị biến dạng ngay ở lượt 1 khi finding chứa `$$`, `$'`, `$&`, `` $` ``**
  Người dùng thấy gì: Khi phát hiện review chứa các ký hiệu đặc biệt như $$ hoặc dấu nháy đặc biệt, nội dung gửi cho công cụ phân loại có thể bị biến dạng ngay từ lần đầu, khiến việc phân loại phát hiện đó sai lệch mà không có cảnh báo nào.
  file: `feature-loop/workflows/acceptance-verify.js`
  severity: medium
  Đề xuất: new-contract

- **Lượt hỏi lại trả contractUnreadable=true đặt triageFailed nhưng không ghi log nguyên nhân**
  Người dùng thấy gì: Khi lượt kiểm tra lại lần hai tự báo không đọc được yêu cầu, hệ thống không ghi lại lý do cụ thể, khiến người xem báo cáo sau này khó biết chính xác vì sao lượt đó bị đánh dấu hỏng.
  file: `feature-loop/workflows/acceptance-verify.js`
  severity: low
  Đề xuất: known-limits

- **Đường dẫn cố định ngoài cây đang kiểm: run-log tiền đề đọc từ os.tmpdir() dùng chung, chỉ kiểm tồn tại — chạy lẻ có thể đo sổ của checkout khác**
  Người dùng thấy gì: Nếu chạy kiểm tra này trong khi có nhiều bản sao mã nguồn khác đang chạy song song, kết quả có thể vô tình dựa trên dữ liệu cũ để lại từ một lần chạy khác thay vì lần chạy hiện tại, mà không có cảnh báo nào.
  file: `tests/workflows/triage-do-tin.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Đo CHỈ DẪN thay vì hành vi: lý do «không phải bộ đọc» chứng bằng grep vắng token trong nguồn**
  Người dùng thấy gì: Danh sách các phần được coi là không cần kiểm vì không đọc dữ liệu phân loại hiện được xác định bằng cách tìm từ khoá trong mã nguồn, nên một phần thực sự có đọc dữ liệu đó nhưng không chứa đúng từ khoá có thể bị bỏ sót khỏi việc kiểm tra mà không ai biết.
  file: `tests/workflows/triage-do-tin.test.mjs`
  severity: low
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).

## Trong hợp đồng

### Bảng wall theo vai trò không render được trong --md: thiếu dòng trống trước header bảng
- file: `feature-loop/scripts/wf-usage.mjs:187`
- severity: low
- source: conventions
- AC: AC-8

Dòng 187 đẩy đoạn văn `wall: ${wallSeconds}s…` rồi dòng 188 đẩy ngay `| vai tro | agents | …` mà KHÔNG có dòng trống ở giữa. Đầu ra thật:
```
 9  wall: 370s
10  | vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
11  |---|--:|--:|--:|--:|---|---|
```
Theo GFM, một bảng không mở được ở dòng nối tiếp (lazy continuation) của đoạn văn phía trên — cả khối biến thành một đoạn văn, bảng không hiện. Mọi bảng khác trong cùng hàm đều có dòng trống trước header (dòng 181). Vật được giao là `usage-report.md` mà owner đọc để chấm dòng 4–5.

Eval canh nó — `ktl_wf_usage_u06` → `PASS: U06 md co bang wall` → `md.includes('| vai tro |') && md.includes('| exec |')` (wf-usage.test.mjs:112) — chỉ ghim SỰ CÓ MẶT CỦA CHUỖI, nên nó xanh trên đúng cái đầu ra không hiển thị được: thước gắn vào chuỗi thay vì vào vật.

Rationale: AC-8 yêu cầu "bản --md thêm bảng wall theo vai trò"; bảng không render thành bảng thật trong Markdown nghĩa là yêu cầu này không đạt.

### laFileDo / fileDoTrongDiff / coverageFiles ở bên VIẾT không còn phép đo nào — W41d và W47 chỉ còn đo `length > 0`
- file: `tests/workflows/acceptance-verify.test.mjs:2604`
- severity: high
- source: bugs
- AC: AC-5

ĐỔI KHUÔN dời phân loại «mã đo» từ bên đọc sang bên viết (`laFileDo`, s4-args.mjs:337-341: `do_globs` + mã trong thư mục hồ sơ + `_acceptance/config.yaml` + `eval.paths`). Nhưng mọi ca canh nó vẫn nằm ở bên ĐỌC và đều TỰ TRUYỀN câu trả lời:
- W41d (dòng 2399-2430): bốn ca «mã răng trong thư mục hồ sơ», «file trong eval.paths», «tests/a.test.js» đều truyền sẵn `fileDoTrongDiff: [<chính tệp đó>]` rồi assert measurement có spawn. Bên đọc chỉ làm `fileDoTrongDiff.length > 0` — nên bốn ca là CÙNG một ca tầm thường.
- W47 (dòng 2604-2610) tuyên «config.yaml là MÃ ĐO — sửa chuỗi lệnh phải kích hoạt lens measurement» nhưng cũng truyền `fileDoTrongDiff: ['_acceptance/config.yaml']`.

Grep toàn kho: `laFileDo`/`fileDoTrongDiff`/`coverageFiles`/`coEvalPaths`/`do_globs` KHÔNG xuất hiện trong bất kỳ tệp ca nào chạy s4-args — `tests/scripts/s4-args-vung-vat.test.mjs` chỉ assert `vungVat`, `ngoaiVatGlobs`, `deltaFiles`. Tức chính finding lượt chấm trước («laFileDo bỏ quên `_acceptance/config.yaml`», ghi ở `_acceptance/khoi-tim-loi-tra-phi-theo-vat/review-findings.md:23`) nay có thể tái phát mà E4/E5/E3 vẫn xanh: xoá vế `f === '_acceptance/config.yaml'` khỏi s4-args.mjs:338 thì không ca nào đỏ.

Sửa: thêm ca ở `s4-args-vung-vat.test.mjs` đọc `fileDoTrongDiff`/`coverageFiles` từ TỆP ARGS THẬT do s4-args sinh trên fixture git (đúng nếp VV1/VV3/VV5 đã làm cho `vungVat`/`deltaFiles`).

Rationale: AC-5 đích danh yêu cầu chiều ĐỎ chứng minh 'diff chạm tests/a.test.js spawn measurement' bằng răng sống; test chỉ đo độ dài mảng do chính ca truyền vào là răng không sống, đúng điều AC-5 cấm.

### carry-plan trả noCarry → carriedFindings bị bỏ theo, thông điệp chỉ nói về eval
- file: `feature-loop/scripts/carry-plan.mjs:234`
- severity: low
- source: bugs
- AC: AC-6

`plan()` trả `{ noCarry: true }` ngay ở dòng 147 khi round trước không có dòng eval nào, hoặc `sha` không thuần nhất — và trả TRƯỚC khi `carriedFindings` được tính (dòng 180-186). CLI biến nó thành exit 3, s4-args (s4-args.mjs:423) in «carry-plan exit 3 — run-log cũ chưa có sha, full re-run (mặc định an toàn)» rồi bỏ cả `carriedEvals` LẪN `carriedFindings`.

Hệ quả: một lượt trước BLOCKED sớm (không dòng eval nào) hay một lượt có sha lệch làm chuỗi carry finding đứt — mọi mục ngoài hợp đồng bị triage + refute lại (đúng khoản chi T5 sinh ra để cắt) và nhãn «(r<N>)» biến mất khỏi review-findings.md, trong khi thông điệp chỉ nói về eval nên không ai biết finding cũng vừa mất carry.

Hai điều kiện của noCarry (đủ sha cho eval carry) không liên quan gì tới điều kiện carry finding (`kind:finding` của round trước + file không chạm delta). Sửa: tính `carriedFindings` trước nhánh noCarry và trả kèm, hoặc ít nhất nói ra trong thông điệp.

Rationale: AC-6 yêu cầu carry-plan.mjs trả carriedFindings dựa trên điều kiện riêng của finding (file không chạm deltaFiles), độc lập điều kiện carry eval; nhánh noCarry làm carriedFindings phụ thuộc sai vào điều kiện eval.

### Đo CHỈ DẪN thay vì ĐẦU RA — W47/W41d tuyên bốn luật «file đo», nhưng chỉ assert «danh sách không rỗng»
- file: `tests/workflows/acceptance-verify.test.mjs:2604`
- severity: high
- source: measurement
- AC: AC-5

W47 (2604-2614) đặt tên «config.yaml là MÃ ĐO — sửa chuỗi lệnh phải kích hoạt lens measurement» và W41d (2399-2413) tuyên bốn luật riêng biệt (`tests/**`, mã răng `_acceptance/<slug>/rang/*.mjs`, file trong `eval.paths`, `_acceptance/config.yaml`). Cả năm assert đều truyền thẳng `fileDoTrongDiff: ['<đường dẫn muốn thử>']` vào args. Bên đọc chỉ làm đúng một phép: `const chamFileDo = fileDoTrongDiff === null ? true : fileDoTrongDiff.length > 0` (`acceptance-verify.js:530`), rồi `REVIEWERS_ACTIVE` lọc theo `chamFileDo` (dòng 568). Nghĩa là năm ca cho cùng một kết quả với BẤT KỲ chuỗi nào — thay `'_acceptance/config.yaml'` bằng `'zzz'` thì W47 vẫn xanh. Luật thật nằm ở bên viết, `s4-args.mjs:337-341` (`laFileDo` = do_globs ∪ `f === '_acceptance/config.yaml'` ∪ `/^_acceptance\/[^/]+\//` không đuôi .md/.jsonl ∪ `pathsKhaiRes`), và `fileDoTrongDiff` không xuất hiện trong một assert nào của `tests/scripts/s4-args-vung-vat.test.mjs` hay bất kỳ tệp ca nào chạy `s4-args.mjs`. Bỏ vế `f === '_acceptance/config.yaml'` khỏi `laFileDo` thì toàn bộ suite vẫn xanh — đúng lớp lỗi mà chính chú thích của W47 nói là đã từng bị bỏ quên.

Rationale: cùng lỗi với finding W41d/W47 ở trên — trực tiếp vi phạm yêu cầu răng sống của AC-5 cho chiều ĐỎ (spawn measurement khi diff chạm file đo).

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **ĐỔI KHUÔN bỏ mất đường đọc-cũ của bộ lọc ngoài-vật — s4-args đời trước làm T2 tắt IM LẶNG**
  Người dùng thấy gì: Nếu công cụ nhận một gói cấu hình cũ thiếu đúng một trường dữ liệu mới, bộ lọc loại-trừ-tài-liệu sẽ tắt mà không báo, khiến các phát hiện trên tài liệu ghi chép quay lại bị xét như lỗi thật.
  file: `feature-loop/workflows/acceptance-verify.js`
  severity: high
  Đề xuất: known-limits

- **coverageFiles chỉ chứa tệp TRONG DIFF → finding liên-file bị đếm là ngoài vùng phủ (cụm giả ở Cổng 2)**
  Người dùng thấy gì: Một số lỗi phát hiện ở tệp không nằm trong lần thay đổi này có thể bị báo nhầm là 'không có phép đo nào kiểm tra', khiến người dùng bị hỏi ý kiến một cách không cần thiết.
  file: `feature-loop/workflows/acceptance-verify.js`
  severity: medium
  Đề xuất: new-contract

- **Thêm khoá config `feature_loop.do_globs` — contract khai đích danh là Out of scope**
  Người dùng thấy gì: Một tuỳ chọn cấu hình từng bị từ chối trong quá trình thiết kế đã âm thầm xuất hiện trở lại trong bản sửa này mà chưa qua thẩm định lại.
  file: `feature-loop/scripts/s4-args.mjs`
  severity: medium
  Đề xuất: new-contract

- **wf-usage: sửa đếm (agent × model) ở byRole nhưng bỏ nguyên `total.agents` — một báo cáo nói hai số**
  Người dùng thấy gì: Báo cáo mức sử dụng vẫn giữ cách đếm số lượt tham gia theo kiểu cũ ở dòng tổng, có thể chênh với số liệt kê theo vai trò trong cùng báo cáo.
  file: `feature-loop/scripts/wf-usage.mjs`
  severity: medium
  Đề xuất: known-limits

- **SKILL.md khai thiếu bốn trường args mới — hợp đồng writer/reader của chính seam vừa dựng lại**
  Người dùng thấy gì: Tài liệu hướng dẫn nội bộ chưa mô tả đúng các trường dữ liệu mới, có thể khiến người đọc sau này hiểu sai cách hệ thống vận hành.
  file: `feature-loop/skills/feature-loop/SKILL.md`
  severity: medium
  Đề xuất: known-limits

- **Hai tệp ca chép tay bản thứ ba/thứ tư của globToRe thay vì import bản nguồn**
  Người dùng thấy gì: Một phần logic đối chiếu được chép tay ở nhiều nơi trong bộ kiểm thử; nếu định nghĩa gốc đổi sau này, các bản chép này có thể lệch mà không ai biết.
  file: `tests/workflows/acceptance-verify.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Tác tử refute khai `phase: 'Review'` trong khi khối đã `phase('Refute')`**
  Người dùng thấy gì: Nhãn tiến độ hiển thị cho bước bác bỏ lỗi bị ghi nhầm là bước xem xét, có thể gây hiểu lầm khi đọc nhật ký tiến trình.
  file: `feature-loop/workflows/acceptance-verify.js`
  severity: low
  Đề xuất: known-limits

- **coverageCluster báo động giả: finding ở tệp NGOÀI diff luôn bị tính là ngoài vùng phủ**
  Người dùng thấy gì: Lỗi ở tệp ngoài phạm vi thay đổi có thể bị báo nhầm là chưa được đo, kích hoạt cảnh báo yêu cầu người quyết định dù thực ra không cần.
  file: `feature-loop/workflows/acceptance-verify.js`
  severity: high
  Đề xuất: new-contract

- **vungVat khai mà ngoaiVatFiles vắng → bộ lọc vùng vật tắt IM LẶNG; SKILL.md lại khai đúng trường đã chết**
  Người dùng thấy gì: Khi vùng theo dõi được bật nhưng thiếu đúng một trường dữ liệu đi kèm, bộ lọc loại-trừ-tài-liệu tắt hoàn toàn mà không có cảnh báo nào.
  file: `feature-loop/workflows/acceptance-verify.js`
  severity: high
  Đề xuất: known-limits

- **ngoaiVatRes là mã chết — VV4/VV4b nay round-trip một trường bên đọc không dùng**
  Người dùng thấy gì: Một bài kiểm thử được viết để đảm bảo hai phía sinh và đọc dữ liệu luôn khớp nhau nay chỉ còn kiểm tra một trường không còn được dùng thật, nên không còn bảo vệ được điều nó hứa.
  file: `feature-loop/workflows/acceptance-verify.js`
  severity: medium
  Đề xuất: new-contract

- **baselineP.catch(() => null) nuốt lỗi không để lại một dòng log nào**
  Người dùng thấy gì: Khi bước đo nền gặp lỗi, hệ thống âm thầm bỏ qua mà không ghi lại nguyên nhân, khiến việc tìm hiểu sự cố sau này khó khăn hơn.
  file: `feature-loop/workflows/acceptance-verify.js`
  severity: medium
  Đề xuất: known-limits

- **Bản chép thứ ba của globToRe gõ tay trong hai tệp ca, dù carry-plan.mjs đã XUẤT hàm này**
  Người dùng thấy gì: Thêm một bản chép tay khác của cùng logic đối chiếu trong một tệp kiểm thử khác, cùng rủi ro lệch nhau về sau như đã nêu ở nơi khác.
  file: `tests/workflows/vung-vat-mutants.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Đo CHỈ DẪN thay vì ĐẦU RA — VV4 round-trip trên `ngoaiVatGlobs`, trường bên ĐỌC không còn đọc**
  Người dùng thấy gì: Một bài kiểm thử tưởng như xác nhận dữ liệu vùng loại-trừ khớp đúng thực ra đang kiểm tra một trường không còn ảnh hưởng tới hành vi thật, nên không phát hiện được lỗi thật nếu có.
  file: `tests/scripts/s4-args-vung-vat.test.mjs`
  severity: high
  Đề xuất: new-contract

- **Đối chứng có lối thoát — VV-mau tự miễn trừ phần tử `docs/`, và không có đối chứng âm**
  Người dùng thấy gì: Một bài kiểm thử tự bỏ qua kiểm tra cho các tệp nằm trong thư mục tài liệu, và không có phép thử đối chứng để chắc rằng nó thực sự phân biệt đúng-sai, làm giảm độ tin cậy của phép kiểm.
  file: `tests/workflows/acceptance-verify.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Assert chuỗi đã trôi khỏi vật — `expected` của E7 ghim dòng PASS không tồn tại và sai verdict**
  Người dùng thấy gì: Văn bản mô tả kết quả mong đợi trong hồ sơ chấp nhận không khớp với thông điệp thật mà hệ thống in ra, có thể khiến người đọc hồ sơ để duyệt hiểu nhầm hệ thống đang kiểm tra gì.
  file: `_acceptance/khoi-tim-loi-tra-phi-theo-vat/evals.yaml`
  severity: medium
  Đề xuất: known-limits

- **Fixture đóng băng không giữ được lời hứa bắt writer trôi — U06c**
  Người dùng thấy gì: Bài kiểm thử dùng một bản ghi mẫu cũ đã đóng băng thay vì dữ liệu mới nhất, nên nếu định dạng dữ liệu thật đổi trong tương lai, bài kiểm thử này sẽ không phát hiện ra.
  file: `tests/scripts/wf-usage.test.mjs`
  severity: medium
  Đề xuất: known-limits

**Carried từ round trước (T5 — file không chạm delta, không chấm lại):**

- **Hai khuôn khớp glob cho cùng một trường `ngoaiVatGlobs`; VV4 tự xưng round-trip nhưng đo bằng hàm của bên VIẾT (r1)**
  Người dùng thấy gì: Bài kiểm tra dùng để đảm bảo bộ lọc tệp hoạt động đúng thực ra tự so với chính nó, nên nó không phát hiện được khi bộ lọc thật đã lệch — dễ khiến người tin nhầm là đã được kiểm chứng.
  file: `tests/scripts/s4-args-vung-vat.test.mjs`
  severity: medium
  Đề xuất: new-contract

- **Hình dạng 4 — assertion âm-tính-một-mình: cả tệp finding-line-bo-doc xanh khi ba bộ đọc KHÔNG hề chạy (r1)**
  Người dùng thấy gì: Bài kiểm tra dùng để đảm bảo các báo cáo cũ vẫn đọc được sau khi thêm dữ liệu mới sẽ báo 'đạt' ngay cả khi công cụ đọc báo cáo bị hỏng hoàn toàn — người xem có thể tin nhầm rằng mọi thứ vẫn ổn trong khi chưa có gì được kiểm chứng thật.
  file: `tests/scripts/finding-line-bo-doc.test.mjs`
  severity: high
  Đề xuất: new-contract

- **Hình dạng 2 — VV4 tuyên round-trip writer→reader nhưng khớp bằng hàm của chính BÊN VIẾT (r1)**
  Người dùng thấy gì: Bài kiểm tra dùng để đảm bảo bộ lọc tệp hoạt động đúng thực ra tự so với chính nó, nên nó không phát hiện được khi bộ lọc thật đã lệch — dễ khiến người tin nhầm là đã được kiểm chứng.
  file: `tests/scripts/s4-args-vung-vat.test.mjs`
  severity: high
  Đề xuất: new-contract

- **Hình dạng 5 — tuyên quét LỚP «không bộ đọc nào» nhưng chỉ có 3 điểm-case trên 8 bộ đọc (r1)**
  Người dùng thấy gì: Bài kiểm tra tuyên bố đã kiểm tra toàn bộ các nơi đọc dữ liệu nhật ký, nhưng thực tế chỉ kiểm một phần nhỏ — các nơi còn lại có thể hỏng mà không ai biết.
  file: `tests/scripts/finding-line-bo-doc.test.mjs`
  severity: medium
  Đề xuất: new-contract

- **Hai bản `globToRe` (bên VIẾT s4-args/carry-plan vs bên ĐỌC acceptance-verify) vẫn lệch nhau ở mẫu `**/<chữ>`; ma trận VV4b không phủ hình dạng đó (r1)**
  Người dùng thấy gì: Với một số cách viết mẫu loại-trừ tệp khá đặc biệt, hệ thống có thể không loại đúng tệp đó ở mọi nơi, khiến vài cảnh báo không liên quan vẫn lọt vào báo cáo.
  file: `feature-loop/scripts/carry-plan.mjs`
  severity: medium
  Đề xuất: known-limits

- **Finding ngoài hợp đồng trên tệp NGOÀI-VẬT được carry vĩnh viễn: `deltaFiles` không còn chứa tệp đó nên «file đã đổi» không bao giờ phát hiện được (r1)**
  Người dùng thấy gì: Một cảnh báo không thuộc phạm vi xét duyệt (ví dụ ghi chú trên tài liệu) có thể bị lặp lại mãi trong báo cáo ở mọi lần chấm sau, kể cả sau khi tài liệu đó đã được viết lại xong, vì hệ thống không nhận ra tài liệu đã đổi.
  file: `feature-loop/scripts/carry-plan.mjs`
  severity: medium
  Đề xuất: new-contract

- **Tuyên quét LỚP nhưng phép đếm chỉ phủ một phần lớp — grep bỏ đúng thư mục chứa bên ghi run-log (r1)**
  Người dùng thấy gì: Một bài kiểm tra tự động dùng để cảnh báo khi có thêm chỗ mới đọc sổ ghi lại đang bỏ sót đúng khu vực mã nguồn liên quan nhất, nên cảnh báo đó có thể không kêu khi cần.
  file: `tests/scripts/finding-line-bo-doc.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Chiều đỏ và thông điệp ghim trong `expected` là tuyên khống — mô tả PASS-line và assert không tồn tại trong tệp ca (r1)**
  Người dùng thấy gì: Phần mô tả trong hồ sơ kiểm thử ghi những điều bài kiểm tra thực tế không làm, khiến người đọc hồ sơ để duyệt có thể hiểu nhầm là bài kiểm tra chứng minh nhiều hơn thực tế.
  file: `_acceptance/khoi-tim-loi-tra-phi-theo-vat/evals.yaml`
  severity: medium
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 2/20 lỗi rơi vào file không bộ đo nào phủ (feature-loop/skills/feature-loop/SKILL.md, _acceptance/khoi-tim-loi-tra-phi-theo-vat/evals.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
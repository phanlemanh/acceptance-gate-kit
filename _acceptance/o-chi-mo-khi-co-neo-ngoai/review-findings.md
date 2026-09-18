## Trong hợp đồng

### Luật bác «neo tự trỏ» chỉ áp cho dạng (1) — dạng (2) mở đường cho ô tự biện minh
- file:line: `skills/acceptance/references/opportunity-template.md:57`
- severity: medium
- source: bugs
- AC: AC-2

Khuôn tự khai (dòng 44–46): «luật "không tự trỏ" phải đúng ở MỌI cách viết». Thực tế khối OPP-GOC-TU-TRO là `/_acceptance/{slug}(?![\w-])`, chỉ khớp được dạng (1) `<kho>/_acceptance/<slug>`. Dạng (2) `^Gốc:\s*kho\s+\S+\s+—\s+.+?\s+gọi tên\s+\d{4}-\d{2}-\d{2}` hoàn toàn không đi qua vế bác, nên mọi ô đều tự mở được bằng một dòng tự đặt tên chính mình.

Đo trực tiếp bằng chính ba khối rút từ khuôn (vị từ giống hệt `neoErrs` ở tests/plugins/vao-co-o.test.mjs:96–104):
  slug `ô-bịa`, `Gốc: kho acceptance-gate-kit — Mạnh gọi tên 2026-09-18` → IM (qua)
  slug `ô-bịa`, `Gốc: kho ô-bịa — ai đó gọi tên 2026-09-18`      → IM (qua)   ← kho = chính slug của ô
Ca thứ hai là tự-trỏ theo đúng nghĩa khuôn khai mà răng không thấy. Không nằm trong «Out of scope» của hợp đồng (chỗ đó chỉ loại trừ việc KIỂM hồ sơ đích có tồn tại, không loại trừ luật tự-trỏ). Hệ quả: cổng mới về nguyên tắc bỏ trống — bất kỳ vòng nào cũng mở được ô bằng một dòng dạng (2), và chính ô `o-chi-mo-khi-co-neo-ngoai` đang đứng bằng dòng ấy (`_acceptance/o-chi-mo-khi-co-neo-ngoai/opportunity.md:16`). Lối sửa cùng lớp: đưa vế bác vào cả hai dạng — dạng (2) phải bác khi `<tên kho>` bằng slug của chính ô (và nếu muốn chặt hơn, khi kho là chính kit thì đòi kèm hồ sơ).

Vì sao map vào hợp đồng: AC-2 yêu cầu chung, không phân biệt theo dạng viết, rằng "dòng có mặt nhưng trỏ chính slug → đỏ"; phép đo chạy trực tiếp đúng vị từ neoErrs cho thấy dòng dạng (2) tự trỏ chính slug vẫn IM, tức đúng một khoản của AC-2 thất bại.

### AC-1 đòi start.md dặn HAI DẠNG hợp lệ; khối START-HIEU-KET không có, và răng chỉ grep chuỗi «Gốc:»
- file:line: `commands/start.md:104`
- severity: low
- source: bugs
- AC: AC-1

AC-1 của hợp đồng: «`commands/start.md` khối `START-HIEU-KET` dặn điền dòng đó với hai dạng hợp lệ (hồ sơ `<kho>/_acceptance/<slug>` ≠ chính ô · `kho <tên> — <người> gọi tên <ngày>`)». Khối thật chỉ có: «MỞ bằng dòng `Gốc:` (khối `OPP-GOC-LINE` — chưa neo thì ghi hạt giống, KHÔNG mở ô)». `OPP-GOC-LINE` là placeholder `Gốc: {goc}`, không mang luật; hai dạng nằm ở khối khác (`OPP-GOC-RULE`) mà khối này không trỏ tới.

Phép đo tương ứng (tests/plugins/vao-co-o.test.mjs:323–325) chỉ kiểm `sm[1].includes('Gốc:')` — đo CHỈ DẪN chứ không đo nội dung luật, nên vế thứ hai của AC-1 không sai được trong bất kỳ phép đo nào đang chạy. Hệ quả vận hành: bên VIẾT (agent kết thúc buổi khai thác) biết phải có dòng `Gốc:` nhưng không biết hai hình dạng bên ĐỌC chấp nhận, nên đường thường gặp là viết văn tự do rồi CI đỏ ở VC8 sau — đúng seam «bên viết và bên đọc trôi khỏi nhau» mà vòng này đi đóng.

Vì sao map vào hợp đồng: AC-1 đòi khối START-HIEU-KET dặn điền dòng Gốc với đúng hai dạng hợp lệ; khối thật chỉ nhắc mở bằng dòng Gốc mà không nêu hai dạng — thất bại đúng vế thứ hai của AC-1.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **PR kéo hai hồ sơ vòng khác vào diff → pre-merge chặn merge (2 VIOLATION stale)**
  Người dùng thấy gì: PR này kéo theo hai hồ sơ của vòng khác không liên quan, có thể khiến việc gộp mã bị chặn lại giữa chừng vì hệ thống kiểm tra tưởng nhầm hai hồ sơ đó đã lỗi thời.
  file: `_acceptance/release-2-0-0/contract.md`
  severity: high
  Đề xuất: known-limits

- **Răng VC9 bác placeholder bằng danh sách đen trên không gian mở — «Kho chờ nhận: tbd» qua cổng**
  Người dùng thấy gì: Người viết hồ sơ mốc có thể gõ một giá trị giữ chỗ mơ hồ (như "tbd") vào ô kho chờ nhận và vẫn qua được cổng kiểm, khiến mốc phát hành ra ngoài dù chưa nơi nào thật sự nhận nó.
  file: `tests/plugins/vao-co-o.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Neo dạng (1) không bao giờ được đối chiếu với vật — hồ sơ trỏ tới có thể không tồn tại**
  Người dùng thấy gì: Dòng khai nguồn gốc của một cơ hội có thể trỏ tới một hồ sơ không hề tồn tại mà hệ thống vẫn chấp nhận, khiến người xem tưởng cơ hội đó có căn cứ trong khi thực ra không có gì đứng sau nó.
  file: `skills/acceptance/references/opportunity-template.md`
  severity: low
  Đề xuất: known-limits

- **VC9 bác «giá trị rỗng» bằng blacklist trên không gian mở — «không có kho nào» vẫn xanh**
  Người dùng thấy gì: Một câu từ chối như "không có kho nào chờ nhận" vẫn được hệ thống hiểu là đã khai tên kho hợp lệ, nên mốc phát hành có thể lọt qua cổng dù thực chất chưa ai nhận nó.
  file: `tests/plugins/vao-co-o.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Luật (b) đổi mẫu số sang «mốc được kho nhận» nhưng bộ đếm máy vẫn neo vào lần cắt số**
  Người dùng thấy gì: Bộ đếm giới hạn số vòng chỉnh luật kit vẫn tính theo lần đổi số phiên bản thay vì theo lần một sản phẩm bên ngoài thật sự nhận bản cập nhật, nên quy tắc vừa đổi có thể không có tác dụng thực tế như đã hứa.
  file: `scripts/start-scan.mjs`
  severity: medium
  Đề xuất: new-contract

- **Hình dạng 3 — assert «chuỗi có mặt» trong khi lời hứa là QUAN HỆ vị trí (neo Gốc)**
  Người dùng thấy gì: Dòng khai nguồn gốc chỉ cần xuất hiện ở bất kỳ đâu trong hồ sơ, kể cả trong một mục phụ ở cuối trang không liên quan, là đã được công nhận hợp lệ — nên một cơ hội có thể trông như có căn cứ thật trong khi dòng đó nằm lạc chỗ và không mang ý nghĩa như đã hứa.
  file: `tests/plugins/vao-co-o.test.mjs`
  severity: high
  Đề xuất: new-contract

- **Hình dạng 5 — ca «hạt giống mồ côi → im» nằm trong ma trận và trong dòng PASS nhưng KHÔNG có assert nào**
  Người dùng thấy gì: Việc hệ thống bỏ qua các ý tưởng chưa thành cơ hội chính thức chưa từng được kiểm chứng thật trong lần đo này, nên nếu sau này có thay đổi vô tình bắt các ý tưởng đó phải có cơ hội trở lại, sẽ không có cảnh báo nào kịp thời.
  file: `tests/plugins/vao-co-o.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 — vế «≥1 tên kho» đo bằng blacklist đóng + hình dạng token ascii, fail-open với mọi câu phủ định có chữ «kho»**
  Người dùng thấy gì: Một câu từ chối phủ định có chứa chữ 'kho' vẫn được hệ thống công nhận là đã khai tên kho chờ nhận, nên mốc có thể phát hành dù thực chất chưa nơi nào chờ nhận nó.
  file: `tests/plugins/vao-co-o.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 — E1 tuyên chiều đỏ cho CẢ BA marker, ma trận chỉ có hai mutant**
  Người dùng thấy gì: Tài liệu mô tả bộ kiểm tra tuyên bố cả ba phần luật đều đã được thử bắt lỗi, nhưng thực tế một trong ba phần chưa từng được thử — nên nếu đúng phần đó hỏng sẽ không ai biết cho tới khi sự cố thật xảy ra.
  file: `_acceptance/o-chi-mo-khi-co-neo-ngoai/evals.yaml`
  severity: low
  Đề xuất: known-limits

- **Khuôn hợp đồng giao cho repo tiêu thụ nhận thêm dòng chỉ dành cho mốc phát hành của kit (r1)**
  Người dùng thấy gì: Mỗi hợp đồng mới tạo cho một tính năng bất kỳ đều có thêm một dòng ghi chú chỉ dành riêng cho các đợt phát hành của kit, dù tính năng đó không phải là một đợt phát hành.
  file: `skills/acceptance/references/contract-template.md`
  severity: medium
  Đề xuất: known-limits

- **Lối (b) ghi hạt giống mà không bộ đọc định kỳ nào quét — răng cũ đã bị gỡ (r1)**
  Người dùng thấy gì: Một cách ghi lại ý tưởng mới được đưa vào quy trình nhưng không có công cụ nào định kỳ đọc lại nó, nên ý tưởng đó có thể bị quên vĩnh viễn dù tài liệu vẫn nói ngược lại.
  file: `commands/start.md`
  severity: medium
  Đề xuất: known-limits

- **Hồ sơ ĐÃ KÝ vao-co-o-ra-co-ten còn ghim VC8 theo nghĩa đã bị đảo, re-check vẫn xanh (r1)**
  Người dùng thấy gì: Một hồ sơ đã được duyệt trước đó vẫn hiển thị đạt trong các lần kiểm tra lại sau này, dù tiêu chí thật sự đứng sau kết quả đó đã bị thay đổi.
  file: `_acceptance/vao-co-o-ra-co-ten/evals.yaml`
  severity: medium
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 2/11 lỗi rơi vào file không bộ đo nào phủ (scripts/start-scan.mjs, _acceptance/o-chi-mo-khi-co-neo-ngoai/evals.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.

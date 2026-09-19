## Trong hợp đồng

### Chân ranh giới của VC8 chỉ bắt bản chép NGUYÊN VĂN hai regex — đúng hình dạng rò thật thì lọt, chiều đỏ là hằng-đúng
- file: `tests/plugins/vao-co-o.test.mjs:390`
- severity: high
- AC: AC-1
- source: conventions

`manhLuat` tách hai khối luật bằng `split(/[\s|]+/)` rồi giữ token ≥8 ký tự. Nhưng KHÔNG khối nào trong CLAUDE.md (dòng 71 và 75) chứa khoảng trắng hay `|` — `\s` ở đây là hai ký tự literal, không phải khoảng trắng. Nên tập token đo được đúng bằng HAI chuỗi nguyên: `^Gốc:\s*\S+/_acceptance/[\w-]+` và `/_acceptance/{slug}(?![\w-])`. Ghi chú ngay trên (dòng 389) tuyên «mọi chuỗi ≥8 ký tự của luật kit ... đều là rò rỉ» — phép tách không bao giờ sinh được chuỗi nào khác hai cái đó, nên lời tuyên rộng hơn vật đo. Hệ quả: đúng hình dạng rò THẬT mà vòng này vừa gỡ khỏi `commands/start.md` — chuỗi `` `<kho>/_acceptance/<slug-khác>` `` (thấy ở chính diff của ca này, vế mutant cũ) — KHÔNG bị bắt lại. Đo thực nghiệm trên cây hiện tại: tiêm `_acceptance/<slug-khac>` vào bản sao start.md → `roRi` trả `[]`; tiêm `Kho chờ nhận: media-library` → `[]`; tiêm một câu hình dạng viết tay `^Gốc: <kho>/_acceptance/<slug>` → `[]`. Chiều đỏ ở dòng 400–405 lại tiêm ĐÚNG `khoiLuat(LUAT_KIT,'KIT-GOC-RULE')` — tức chính chuỗi đang đi tìm — nên nó xanh theo cấu trúc, không phân biệt được «chân ranh giới đang canh» với «chân ranh giới chỉ so bằng một hằng». Đây là lớp lỗi repo đã đặt tên: đo từ vựng thay vì quan hệ, và mutant không gọi thứ nó canh. Suite hiện XANH (`PASS: [VC8] ... ba vật giao đi không mang mảnh luật kit, có chiều đỏ`) trong khi vế AC-1 «để hình dạng kit rò vào một trong ba vật giao đi → đỏ gọi tên vật» không sai được bằng bất kỳ cách viết tay nào.

*Căn cứ trong hợp đồng:* đây chính là mệnh đề AC-1 hứa («để hình dạng kit rò vào một trong ba vật giao đi → đỏ gọi tên vật»); finding đo trực tiếp trên vị từ đang canh mệnh đề đó và cho thấy nó không sinh đỏ khi hình dạng rò thật (không phải bản chép nguyên văn) được tiêm vào.

### Chân RANH GIỚI của VC8 chỉ bắt bản CHÉP NGUYÊN VĂN regex — bỏ lọt đúng dạng rò rỉ mà vòng này vừa cắt
- file: `tests/plugins/vao-co-o.test.mjs:390`
- severity: high
- AC: AC-1
- source: bugs

`manhLuat` được dựng bằng `[khoiLuat(KIT-GOC-RULE), khoiLuat(KIT-GOC-TU-TRO)].flatMap(x => x.split(/[\s|]+/)).filter(x => x.length >= 8)`. Hai khối luật trong CLAUDE.md không chứa khoảng trắng lẫn `|`, nên phép split KHÔNG cắt ra mảnh nào: `manhLuat` đúng bằng hai chuỗi nguyên vẹn `^Gốc:\s*\S+/_acceptance/[\w-]+` và `/_acceptance/{slug}(?![\w-])`. Chú thích ngay trên đó tuyên «mọi chuỗi ≥8 ký tự của luật kit mà xuất hiện trong một vật giao đi đều là rò rỉ» — code không làm điều đó; nó chỉ làm `txt.includes(<toàn bộ regex>)`.

Hệ quả đo được: chạy chính vị từ `roRi` trên bản `commands/start.md` NGAY TRƯỚC commit fc9ab856 (bản mang đúng câu rò rỉ mà vòng này cắt: «ĐÚNG MỘT dạng: `<kho>/_acceptance/<slug-khác>` … (khuôn: `OPP-GOC-LINE` + `OPP-GOC-RULE` + `OPP-GOC-TU-TRO`)») → trả về `[]`. Bản khuôn cũ chỉ bị bắt vì nó tình cờ chép nguyên văn regex, không phải vì chân ranh giới hiểu hình dạng.

Chiều đỏ ở dòng 400–405 tiêm `khoiLuat(LUAT_KIT,'KIT-GOC-RULE')` nguyên khối, nên nó không phân biệt được «bắt hình dạng» với «bắt một chuỗi literal» — đúng lớp «thước tôi dựng mắc đúng lỗi nó đi bắt».

Lời tuyên trong hợp đồng rộng hơn vật: AC-1 «để hình dạng kit rò vào một trong ba vật giao đi → đỏ gọi tên vật», và `_acceptance/o-chi-mo-khi-co-neo-ngoai/evals.yaml` E1 còn kể tên ba dạng rò «_acceptance/<slug-khác>», «tên marker», «Kho chờ nhận» — trong ba dạng đó chỉ «tên marker» (KIT-GOC-RULE / KIT-GOC-TU-TRO) có vị từ thật; «Kho chờ nhận» không được kiểm ở đâu cả (răng VC9 đã gỡ cùng commit).

Kịch bản hỏng: người sửa kit viết lại vào `opportunity-template.md` hay `commands/start.md` một câu prose kiểu «dòng Gốc phải trỏ tới `<kho>/_acceptance/<slug>`» → VC8 vẫn XANH → luật riêng của kit lại đi theo engine sang kho tiêu thụ trống, đúng hồi quy mà AC-1 sinh ra để chặn.

*Căn cứ trong hợp đồng:* cùng mệnh đề AC-1 («để hình dạng kit rò vào một trong ba vật giao đi → đỏ gọi tên vật»); finding chứng minh bằng bản thật (trước commit cắt) rằng câu văn xuôi mang hình dạng rò không bị bắt.

### Tuyên quét LỚP nhưng chỉ có điểm-case: chân RANH GIỚI là danh sách đen HAI literal, chiều đỏ tiêm đúng literal ấy
- file: `tests/plugins/vao-co-o.test.mjs:390`
- severity: high
- AC: AC-1
- source: measurement

Dòng 390–391 khai `manhLuat` bằng cách split hai khối luật theo `/[\s|]+/` rồi lọc `length >= 8`. Nhưng CẢ HAI khối luật chỉ có MỘT token và không có khoảng trắng nào, nên `manhLuat` = đúng hai chuỗi: `^Gốc:\s*\S+/_acceptance/[\w-]+` và `/_acceptance/{slug}(?![\w-])` (đã chạy kiểm, in ra đúng hai phần tử). Chú thích ngay trên đó tuyên «mọi chuỗi ≥8 ký tự của luật kit mà xuất hiện trong một vật giao đi đều là rò rỉ» — lời tuyên là LỚP, vật là hai điểm-case. Chiều đỏ ở dòng 401–406 nối NGUYÊN khối `KIT-GOC-RULE` vào bản sao, tức tiêm đúng `manhLuat[0]` mà `roRi` đang grep: phép tiêm không phân biệt được «bắt đúng lớp rò rỉ» với «grep lại chính chuỗi vừa dán». Đo thực nghiệm: dán vào bản sao khuôn ô câu văn `Hình dạng: \`Gốc: <kho>/_acceptance/<slug-khác> — giải thích\`, không được trỏ chính \`_acceptance/<slug>\` của ô này.` → `roRi` trả `[]`. Đó CHÍNH LÀ hình dạng rò rỉ lịch sử mà vòng này cắt đi: bản `91015201` của `skills/acceptance/references/opportunity-template.md` rò bằng văn xuôi (`<kho>/_acceptance/<slug-khác>`, «kho X — người Y gọi tên ngày Z») chứ không chỉ bằng khối regex. Nói cách khác, chân duy nhất canh AC-1 («ba vật giao đi KHÔNG mang hình dạng riêng của kho này») bắt được đúng cách tái phạm mà không ai tái phạm, và im trước cách tái phạm đã xảy ra thật.

*Căn cứ trong hợp đồng:* cùng mệnh đề AC-1 về hình dạng kit rò vào vật giao đi; finding đo thực nghiệm cho thấy câu văn xuôi mang đúng hình dạng rò rỉ lịch sử (bản 91015201 của opportunity-template.md) không bị chân ranh giới bắt.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

<<<OOC-ITEM-TEMPLATE
- **E1 `expected` hứa ba hình dạng rò mà răng không đo được — lời khai hợp đồng rộng hơn vật**
  Người dùng thấy gì: Ghi chú bằng chứng trình cho người ký nói kiểm tra bắt được nhiều dạng rò rỉ luật nội bộ hơn thực tế, có thể khiến người ký tin nhầm mức bảo vệ đang cao hơn thật.
  file: `_acceptance/o-chi-mo-khi-co-neo-ngoai/evals.yaml`
  severity: medium
  Đề xuất: known-limits
OOC-ITEM-TEMPLATE>>>

<<<OOC-ITEM-TEMPLATE
- **`neoErrs` im lặng miễn trừ ô có frontmatter không đọc được — AC-4 «0 ô hàng chờ thiếu Gốc» có lỗ fail-open**
  Người dùng thấy gì: Nếu hồ sơ một cơ hội bị lỗi định dạng ngay từ đầu, công cụ kiểm sẽ bỏ qua nó một cách im lặng thay vì báo thiếu thông tin bắt buộc, khiến hồ sơ hỏng có thể lọt qua bước xét duyệt mà không ai được báo.
  file: `tests/plugins/vao-co-o.test.mjs`
  severity: medium
  Đề xuất: known-limits
OOC-ITEM-TEMPLATE>>>

<<<OOC-ITEM-TEMPLATE
- **Fixture hạt giống mồ côi trong VC8 không có bộ đọc nào — dòng chết gợi ý một chiều phủ không tồn tại**
  Người dùng thấy gì: Một dòng dữ liệu thử không mang tác dụng kiểm tra nào còn sót lại kèm một ghi chú dễ khiến người đọc sau này tưởng có kiểm tra thật ở đó — không ảnh hưởng gì tới người dùng vì hành vi thật vẫn đúng.
  file: `tests/plugins/vao-co-o.test.mjs`
  severity: low
  Đề xuất: known-limits
OOC-ITEM-TEMPLATE>>>

<<<OOC-ITEM-TEMPLATE
- **Lời khai eval mô tả một LỚP mà phép đo không phủ — E1 nêu «Kho chờ nhận» và «_acceptance/<slug-khác>» là thứ chân ranh giới bắt**
  Người dùng thấy gì: Ghi chú bằng chứng ở cổng ký kể tên nhiều dạng rò rỉ luật nội bộ hơn số dạng thực sự được kiểm, có thể khiến người ký đánh giá sai mức chắc chắn của kết quả xanh.
  file: `_acceptance/o-chi-mo-khi-co-neo-ngoai/evals.yaml`
  severity: medium
  Đề xuất: known-limits
OOC-ITEM-TEMPLATE>>>

<<<OOC-ITEM-TEMPLATE
- **Assert «chuỗi có mặt» trong khi lời hứa là QUAN HỆ vị trí: `Gốc:` được nhận ở BẤT KỲ đâu trong tệp**
  Người dùng thấy gì: Dòng thông tin bắt buộc được công cụ chấp nhận ở bất kỳ đâu trong hồ sơ thay vì đúng chỗ quy định ở đầu mục, nên một dòng bị đặt nhầm vị trí (ví dụ trong phần trích dẫn) vẫn được tính là hợp lệ dù người đọc thật khó nhận ra nó.
  file: `tests/plugins/vao-co-o.test.mjs`
  severity: low
  Đề xuất: known-limits
OOC-ITEM-TEMPLATE>>>

<<<OOC-ITEM-TEMPLATE
- **Assertion âm-tính-một-mình trên CÂY THẬT: không có đối chứng số ô đã duyệt, hàng chờ rỗng cũng xanh**
  Người dùng thấy gì: Bài kiểm trên dữ liệu thật chỉ xác nhận 'không có lỗi nào bị báo' mà không xác nhận có bao nhiêu hồ sơ thực sự được rà soát — nếu một thay đổi sau này vô tình khiến bộ lọc bỏ sót toàn bộ hồ sơ, bài kiểm vẫn báo đạt như thường.
  file: `tests/plugins/vao-co-o.test.mjs`
  severity: low
  Đề xuất: known-limits
OOC-ITEM-TEMPLATE>>>

<<<OOC-ITEM-TEMPLATE
- **Luật (b) đổi mẫu số nhưng bộ đếm vòng meta vẫn neo vào mốc CẮT SỐ (r3)**
  Người dùng thấy gì: Con số vòng công việc phụ hiển thị trên thẻ có thể sai ngay sau khi đổi số phiên bản, dù chưa có kho nào thực sự nhận bản phát hành mới — dễ khiến người đọc thẻ hiểu nhầm giới hạn đã được nới ra sớm hơn thực tế.
  file: `scripts/start-scan.mjs`
  severity: high
  Đề xuất: known-limits
OOC-ITEM-TEMPLATE>>>

<<<OOC-ITEM-TEMPLATE
- **Neo trỏ hồ sơ NGAY TRONG KHO NÀY cũng không được kiểm tồn tại (r3)**
  Người dùng thấy gì: Một dòng khai 'nguồn gốc' trỏ tới hồ sơ không tồn tại vẫn được chấp nhận mà không báo lỗi, kể cả khi hồ sơ đó lẽ ra kiểm tra được ngay trong cùng dự án.
  file: `skills/acceptance/references/opportunity-template.md`
  severity: medium
  Đề xuất: known-limits
OOC-ITEM-TEMPLATE>>>

<<<OOC-ITEM-TEMPLATE
- **Hồ sơ ĐÃ KÝ vao-co-o-ra-co-ten còn ghim VC8 theo nghĩa đã bị đảo, re-check vẫn xanh (r1)**
  Người dùng thấy gì: Một hồ sơ đã được duyệt trước đó vẫn hiển thị đạt trong các lần kiểm tra lại sau này, dù tiêu chí thật sự đứng sau kết quả đó đã bị thay đổi.
  file: `_acceptance/vao-co-o-ra-co-ten/evals.yaml`
  severity: medium
  Đề xuất: known-limits
OOC-ITEM-TEMPLATE>>>

## Chưa adversarial-verify (refuter chết)

(không có finding nào ở round này bị đánh dấu unverified)

⚠ Cụm ngoài vùng phủ: 2/9 lỗi rơi vào file không bộ đo nào phủ (_acceptance/o-chi-mo-khi-co-neo-ngoai/evals.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.

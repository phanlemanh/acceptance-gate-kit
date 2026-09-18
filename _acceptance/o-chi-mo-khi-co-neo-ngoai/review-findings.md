
# Review Findings: o-chi-mo-khi-co-neo-ngoai (round 1)

## Trong hợp đồng

### Gốc trỏ chính ô vẫn qua răng khi có chữ giải thích phía sau
- file: `tests/plugins/vao-co-o.test.mjs:94`
- severity: high
- source: bugs
- AC: AC-2

Chốt «trỏ chính nó» dùng `new RegExp(`/_acceptance/${slug}(/|$)`).test(val)` — đòi slug đứng ngay cuối chuỗi hoặc theo sau bởi `/`. Nhưng MỌI dòng Gốc thật trên cây đều viết theo kiểu `<kho>/_acceptance/<slug> — <giải thích>` (xem ba-cho-cat-sau-chu-ky-cua-so-2-13, cong-chan-theo-ho-so-khong-theo-diff, o-nuot-luat…). Với dạng đó, sau slug là dấu cách nên chốt KHÔNG khớp, rồi regex rules[0] lại khớp (lookahead `(?!<slug>/)` cũng trượt vì thiếu dấu `/`) → ô tự neo vào chính nó được chấm ĐẠT. Đo thật: fixture `tu-tro-co-ghi-chu` với `Gốc: acceptance-gate-kit/_acceptance/tu-tro-co-ghi-chu — phát hiện từ chính vòng này`, stage discovery, neoErrs trả về `[]`. Đây là đúng lớp lỗi mà ô sinh ra để chặn (ô tự biện minh), và fixture ma trận chỉ có ca `do2-tu-tro` viết trần không ghi chú nên không bắt được.

### Khối OPP-GOC-RULE — nguồn luật được khai — chấp nhận neo tự trỏ
- file: `skills/acceptance/references/opportunity-template.md:50`
- severity: medium
- source: bugs
- AC: AC-2

Khuôn tự khai «Hai dạng hợp lệ, là hai regex ở khối RULE», nhưng rules[0] `^Gốc:\s*\S+/_acceptance/(?!{slug}/)[\w-]+` chỉ loại được self-reference khi có dấu `/` ngay sau slug. Đo thật: với slug `do2-tu-tro`, regex khớp `Gốc: kit/_acceptance/do2-tu-tro` (true) và KHÔNG khớp `Gốc: kit/_acceptance/do2-tu-tro/opportunity.md` (false) — tức nó bác đúng dạng viết đầy đủ và nhận đúng dạng viết tắt. Luật «không được tự trỏ» thật ra sống ở một dòng hardcode trong bên đọc (vao-co-o.test.mjs:94), không có trong khuôn; ca (iv) của VC8 chỉ đột biến rules[1] nên khoảng trống này không bao giờ đổi màu. Bất kỳ bên đọc thứ hai nào rút luật từ khuôn đúng như khuôn dặn sẽ nhận neo tự trỏ.

### Hình dạng 2 — LB3 ghim chuỗi VIẾT TAY, không round-trip từ hằng MSG_OOC_HAT_GIONG như E5 khai
- file: `tests/scripts/loi-b-hat-giong.test.mjs:53`
- severity: high
- source: measurement
- AC: AC-5

E5 (evals.yaml, AC-5) hứa: «trong khối phải có chuỗi rút từ MSG_OOC_HAT_GIONG». LB3 thực tế ghim ba literal gõ tay `['hat-giong-<slug>.md', 'Gốc:', 'KHÔNG tạo `_acceptance/<slug>/`']` và `CAU_CU` (dòng 21) cũng gõ tay. Đo ra: `grep -c 'ghi hạt giống có Gốc'` trên cả ba tài liệu = 0 — khối OOC-LOI-B không chứa một chuỗi nào rút từ `MSG_OOC_HAT_GIONG`, và `MSG` (dòng 20) chỉ được LB1/LB2 dùng. Hệ quả: đổi hằng trong gate-card.js (bên máy nói) mà không đổi khối trong SKILL.md / acceptance-card.md / signoff.md (bên người-máy đọc) thì cả ba dòng PASS vẫn xanh — hai bản trôi khỏi nhau đúng lớp lỗi «bên VIẾT và bên ĐỌC của một artifact trôi khỏi nhau». Cùng hình dạng ở dòng 32: đối chứng nhánh known-limits ghim literal `'Máy đề xuất: ghi vào hạn chế đã biết rồi ship.'` thay vì `pick(...)` từ nguồn.

### Hình dạng 5 — vế «tự ăn thuốc» của E7 hằng-đúng: ô của chính vòng bị `hangCho` loại vì đã có contract.md
- file: `_acceptance/o-chi-mo-khi-co-neo-ngoai/evals.yaml:87`
- severity: medium
- source: measurement
- AC: AC-7

E7 khai: «Vế tự-ăn-thuốc của AC-7 đo bằng E1/E2 (VC8): ô này là decided build nên nằm TRONG phạm vi răng». Nhưng `hangCho` (tests/plugins/vao-co-o.test.mjs:79) mở đầu bằng `if (!existsSync(o) || existsSync(path.join(dir, 'contract.md'))) return null;` và `_acceptance/o-chi-mo-khi-co-neo-ngoai/contract.md` đã tồn tại từ S2. Ở thời điểm S4 chạy evals, chân «cây thật» của VC8 (dòng 309) bỏ qua đúng ô này, nên dòng `Gốc:` của nó không bao giờ bị răng đọc. Ca (đỏ 4) mà E7 trỏ tới là `do4-build-thieu` — một fixture, không phải ô thật. Lời khai của eval rộng hơn phép đo.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Khuôn hợp đồng giao cho repo tiêu thụ nhận thêm dòng chỉ dành cho mốc phát hành của kit**
  Người dùng thấy gì: Mỗi hợp đồng mới tạo cho một tính năng bất kỳ đều có thêm một dòng ghi chú chỉ dành riêng cho các đợt phát hành của kit, dù tính năng đó không phải là một đợt phát hành.
  file: `skills/acceptance/references/contract-template.md`
  severity: medium
  Đề xuất: known-limits

- **Phép kiểm «Kho chờ nhận» là danh sách đen trên không gian mở — giá trị rỗng-nghĩa vẫn qua**
  Người dùng thấy gì: Một mốc phát hành có thể viết một câu chung chung kiểu 'chưa có kho nào nhận' và vẫn được máy chấp nhận như thể đã có nơi tiếp nhận thật.
  file: `tests/plugins/vao-co-o.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **VC8 viết lại làm rơi lặng hai assertion về sức khoẻ stub trên cây thật**
  Người dùng thấy gì: Nếu một hồ sơ bị hỏng định dạng, máy đo vẫn báo mọi thứ ổn thay vì cảnh báo hồ sơ đó có vấn đề.
  file: `tests/plugins/vao-co-o.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Bên viết đòi dòng Gốc MỞ ĐẦU section, bên đọc nhận ở bất kỳ đâu; fixture dựng file hai section trùng tên**
  Người dùng thấy gì: Dòng ghi nguồn gốc có thể nằm ở bất kỳ đâu trong tài liệu thay vì đúng vị trí được hướng dẫn, mà máy vẫn chấp nhận.
  file: `tests/plugins/vao-co-o.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Ô `decision: iterate` chờ mở vòng nằm ngoài phạm vi răng, im lặng**
  Người dùng thấy gì: Một loại mục đang chờ mở lại (đánh dấu lặp lại) hoàn toàn không bị máy kiểm tra có nguồn gốc hay không, nên nó có thể tồn tại vô thời hạn mà không ai để ý.
  file: `tests/plugins/vao-co-o.test.mjs`
  severity: high
  Đề xuất: new-contract

- **Frontmatter hỏng hoặc stage lạ được miễn răng, lỗi đọc bị catch nuốt**
  Người dùng thấy gì: Nếu một hồ sơ bị ghi sai định dạng hoặc dùng nhãn trạng thái không đúng chuẩn, máy sẽ bỏ qua nó hoàn toàn thay vì báo lỗi.
  file: `tests/plugins/vao-co-o.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **«Kho chờ nhận» kiểm bằng blacklist trên không gian mở**
  Người dùng thấy gì: Một mốc phát hành có thể ghi các từ giữ chỗ tiếng Anh như 'tbd' hay 'none' và vẫn được máy chấp nhận như đã có nơi tiếp nhận thật.
  file: `tests/plugins/vao-co-o.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Lối (b) ghi hạt giống mà không bộ đọc định kỳ nào quét — răng cũ đã bị gỡ**
  Người dùng thấy gì: Một cách ghi lại ý tưởng mới được đưa vào quy trình nhưng không có công cụ nào định kỳ đọc lại nó, nên ý tưởng đó có thể bị quên vĩnh viễn dù tài liệu vẫn nói ngược lại.
  file: `commands/start.md`
  severity: medium
  Đề xuất: known-limits

- **Hồ sơ ĐÃ KÝ vao-co-o-ra-co-ten còn ghim VC8 theo nghĩa đã bị đảo, re-check vẫn xanh**
  Người dùng thấy gì: Một hồ sơ đã được duyệt trước đó vẫn hiển thị đạt trong các lần kiểm tra lại sau này, dù tiêu chí thật sự đứng sau kết quả đó đã bị thay đổi.
  file: `_acceptance/vao-co-o-ra-co-ten/evals.yaml`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 — ma trận VC8 tuyên «số ca = số ô» nhưng thiếu trục frontmatter-trống; bộ lọc phạm vi fail-open ở đúng chỗ đó**
  Người dùng thấy gì: Một mục để trống trạng thái, dù do gõ thiếu, sẽ hoàn toàn không bị máy phát hiện là thiếu thông tin.
  file: `tests/plugins/vao-co-o.test.mjs`
  severity: high
  Đề xuất: known-limits

- **Hình dạng 5 — chiều đỏ LB3 không phân biệt được thước ĐO-KHỐI với thước ĐO-CẢ-TỆP mà nó thay thế**
  Người dùng thấy gì: Phép kiểm hiện tại chưa chứng minh được là nó chỉ soi đúng đoạn cần soi, có thể đang soi rộng hơn mà không ai biết.
  file: `tests/scripts/loi-b-hat-giong.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 — ca «(im 1) hạt giống mồ côi» trong E2 không có đường nào đỏ được**
  Người dùng thấy gì: Một trong các trường hợp máy tự nhận là đã kiểm tra thực ra không bao giờ có thể phát hiện ra lỗi, dù báo cáo vẫn ghi là đã kiểm.
  file: `tests/plugins/vao-co-o.test.mjs`
  severity: low
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 2/16 lỗi rơi vào file không bộ đo nào phủ (_acceptance/vao-co-o-ra-co-ten/evals.yaml, _acceptance/o-chi-mo-khi-co-neo-ngoai/evals.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.

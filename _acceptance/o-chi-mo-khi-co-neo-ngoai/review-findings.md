# Review Findings: o-chi-mo-khi-co-neo-ngoai (round 3)

## Trong hợp đồng

### Hình dạng 1 (đo vật KHÁC vật được hứa): E4 hứa một dòng trong sổ quyết định mà lệnh đo không hề đọc sổ
- file: `_acceptance/o-chi-mo-khi-co-neo-ngoai/evals.yaml:51`
- severity: medium
- source: measurement
- AC: AC-4

E4 (criterion AC-4) khai `cmd: config:executors.script.neo_vc8` — tức `VC_CASES=VC8 node tests/plugins/vao-co-o.test.mjs` — nhưng `expected` gồm HAI vế: (a) «VC8 chạy trên ROOT không nêu slug nào thiếu Gốc» và (b) «sổ quyết định của vòng có một dòng «rà tồn kho» nêu hai số: ô thêm Gốc · ô về archived». Vế (b) không có assert nào đứng sau: thân VC8 (tests/plugins/vao-co-o.test.mjs:96-127 `neoErrs` + phần (ii)-(v) của ca) chỉ đọc `opportunity.md` và `contract.md` trong `_acceptance/<slug>/`, cộng `commands/start.md` và khuôn — nó KHÔNG mở `decisions.jsonl` ở bất kỳ nhánh nào. Executor là `script`, verdict lấy từ exit code, nên không có judge nào đọc hộ vế (b). Hệ quả cụ thể: xoá dòng d-20260918T142502Z-12 («Rà tồn kho theo luật mới: 17 ô thêm dòng Gốc…») khỏi `_acceptance/o-chi-mo-khi-co-neo-ngoai/decisions.jsonl` thì E4 vẫn XANH — nửa AC-4 nói về sổ quyết định là hằng-đúng, không phân biệt được «đã ghi sổ» với «chưa bao giờ ghi». Đây đúng lớp «thước không gắn vào vật được giao»: lời hứa ở vật A (sổ), phép đo chạy trên vật B (khuôn + ô).

Vì sao trong hợp đồng: AC-4 đòi hỏi sổ quyết định của vòng phải nêu số ô thêm Gốc và số ô về archived, nhưng eval E4 chỉ chạy VC8/VC9 và không mở decisions.jsonl để xác nhận vế này, nên phần Then đó của AC-4 chưa có phép đo nào bảo đảm.

### Hình dạng 3 (assert «chuỗi có mặt» thay vì quan hệ): LB3 kiểm nhãn lối (b) bằng `includes` trên CẢ TỆP, không trong khối
- file: `tests/scripts/loi-b-hat-giong.test.mjs:62`
- severity: low
- source: measurement
- AC: AC-5

LB3 đo phần thân lối (b) đúng cách — rút KHỐI giữa marker `OOC-LOI-B` rồi assert trên `b` — nhưng riêng vế nhãn lại tụt về grep toàn tệp: `const nhan = f.endsWith('SKILL.md') ? 'mở contract mới' : 'mở hợp đồng mới'; if (!txt.includes(nhan)) die(...)`. Lời hứa của AC-5 là QUAN HỆ «nhãn của LỰA CHỌN (b) giữ nguyên văn», tức nhãn phải đứng ngay trước khối `OOC-LOI-B`; assert lại chỉ hỏi cụm chữ có xuất hiện ở đâu đó trong tệp. Kịch bản fail: đổi nhãn tại vị trí (b) thành «mở việc mới» nhưng còn một lần nhắc «mở hợp đồng mới» ở chỗ khác của tệp (ở `commands/signoff.md` cụm này đã xuất hiện trong dòng ngữ pháp «Ngoài-<số>: ghi Known limits / mở hợp đồng mới / nâng phạm vi sửa ngay», ngoài khối) — LB3 vẫn xanh dù nhãn lối (b) đã trôi. Hiện mỗi tệp chỉ có đúng 1 lần xuất hiện nên ca còn may, nhưng phép đo không phân biệt được hai tình huống đó.

Vì sao trong hợp đồng: AC-5 nêu rõ mọi phần kiểm khối lối (b) phải rút từ KHỐI giữa marker OOC-LOI-B, không được grep cả tệp; LB3 lại grep nhãn 'mở hợp đồng mới' trên toàn tệp, đúng điều bị cấm trong Then của AC-5.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Luật (b) đổi mẫu số nhưng bộ đếm vòng meta vẫn neo vào mốc CẮT SỐ**
  Người dùng thấy gì: Con số vòng công việc phụ hiển thị trên thẻ có thể sai ngay sau khi đổi số phiên bản, dù chưa có kho nào thực sự nhận bản phát hành mới — dễ khiến người đọc thẻ hiểu nhầm giới hạn đã được nới ra sớm hơn thực tế.
  file: `scripts/start-scan.mjs`
  severity: high
  Đề xuất: known-limits

- **Neo trỏ hồ sơ NGAY TRONG KHO NÀY cũng không được kiểm tra tồn tại**
  Người dùng thấy gì: Một dòng khai 'nguồn gốc' trỏ tới hồ sơ không tồn tại vẫn được chấp nhận mà không báo lỗi, kể cả khi hồ sơ đó lẽ ra kiểm tra được ngay trong cùng dự án.
  file: `skills/acceptance/references/opportunity-template.md`
  severity: medium
  Đề xuất: known-limits

- **«Hồ sơ mốc» có hai định nghĩa máy trong cùng kho**
  Người dùng thấy gì: Hai chỗ khác nhau trong hệ thống có thể hiểu khác nhau về việc gì được tính là 'hồ sơ phát hành', khiến có trường hợp một hồ sơ được nơi này tính vào còn nơi khác lại bỏ qua.
  file: `tests/plugins/vao-co-o.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Răng VC9 không có chân «bên VIẾT dặn điền» — lời dặn `Kho chờ nhận:` không được phép đo nào ghim**
  Người dùng thấy gì: Người viết hồ sơ phát hành mới có thể không biết cần điền dòng khai 'kho chờ nhận' vì không tài liệu hướng dẫn nào nhắc tới yêu cầu này, và chỉ phát hiện ra khi bị từ chối.
  file: `skills/acceptance/references/contract-template.md`
  severity: medium
  Đề xuất: known-limits

- **decision: iterate thoát trọn răng neo — cùng ngăn «Sắp mở vòng» với build mà không phải khai Gốc**
  Người dùng thấy gì: Một hồ sơ được đánh dấu 'thử lại thêm' thay vì 'triển khai' có thể bỏ qua hoàn toàn yêu cầu khai nguồn gốc, dù nó cũng sắp bước vào cùng giai đoạn tiếp theo như hồ sơ được duyệt triển khai.
  file: `tests/plugins/vao-co-o.test.mjs`
  severity: high
  Đề xuất: known-limits

- **neoErrs nuốt lỗi đọc hồ sơ — opportunity.md không đọc được thì im lặng qua cổng**
  Người dùng thấy gì: Nếu một hồ sơ gặp lỗi khi đọc (ví dụ mất quyền truy cập trên máy chủ kiểm tra), nó có thể âm thầm biến mất khỏi danh sách cần kiểm tra thay vì báo lỗi, khiến việc kiểm tra trông như đã hoàn tất dù chưa từng chạy trên hồ sơ đó.
  file: `tests/plugins/vao-co-o.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 (assert «chuỗi có mặt» trong khi lời hứa là QUAN HỆ vị trí): dòng `Gốc:` được nhận ở BẤT KỲ đâu trong tệp**
  Người dùng thấy gì: Dòng khai nguồn gốc có thể được đặt sai chỗ trong hồ sơ (ví dụ ở một phần không liên quan) mà hệ thống vẫn chấp nhận, khiến yêu cầu 'khai rõ nguồn ngay từ đầu mục' mất tác dụng dù đúng câu chữ.
  file: `tests/plugins/vao-co-o.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 + fail-open: `fmv` để trường rỗng nuốt dòng kế, ô có `stage:` trống lặng lẽ rời hàng chờ**
  Người dùng thấy gì: Một hồ sơ điền thiếu thông tin (để trống một trường quan trọng) có thể vô tình thoát khỏi việc bị đòi khai nguồn gốc, thay vì bị từ chối như một hồ sơ chưa hoàn chỉnh.
  file: `tests/plugins/vao-co-o.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 (số trong lời khai không khớp ma trận thật): dòng PASS của VC8 khai «ma trận 12 ô» trong khi fixture dựng 13**
  Người dùng thấy gì: Một dòng thông báo kết quả kiểm tra ghi sai số lượng trường hợp thử nghiệm đã chạy, có thể khiến người đọc tưởng phạm vi đã kiểm rộng hơn thực tế.
  file: `tests/plugins/vao-co-o.test.mjs`
  severity: low
  Đề xuất: known-limits

- **PR kéo hai hồ sơ vòng khác vào diff → pre-merge chặn merge (2 VIOLATION stale) (r2)**
  Người dùng thấy gì: PR này kéo theo hai hồ sơ của vòng khác không liên quan, có thể khiến việc gộp mã bị chặn lại giữa chừng vì hệ thống kiểm tra tưởng nhầm hai hồ sơ đó đã lỗi thời.
  file: `_acceptance/release-2-0-0/contract.md`
  severity: high
  Đề xuất: known-limits

- **Luật (b) đổi mẫu số sang «mốc được kho nhận» nhưng bộ đếm máy vẫn neo vào lần cắt số (r2)**
  Người dùng thấy gì: Bộ đếm giới hạn số vòng chỉnh luật kit vẫn tính theo lần đổi số phiên bản thay vì theo lần một sản phẩm bên ngoài thật sự nhận bản cập nhật, nên quy tắc vừa đổi có thể không có tác dụng thực tế như đã hứa.
  file: `scripts/start-scan.mjs`
  severity: medium
  Đề xuất: new-contract

- **Khuôn hợp đồng giao cho repo tiêu thụ nhận thêm dòng chỉ dành cho mốc phát hành của kit (r1)**
  Người dùng thấy gì: Mỗi hợp đồng mới tạo cho một tính năng bất kỳ đều có thêm một dòng ghi chú chỉ dành riêng cho các đợt phát hành của kit, dù tính năng đó không phải là một đợt phát hành.
  file: `skills/acceptance/references/contract-template.md`
  severity: medium
  Đề xuất: known-limits

- **Hồ sơ ĐÃ KÝ vao-co-o-ra-co-ten còn ghim VC8 theo nghĩa đã bị đảo, re-check vẫn xanh (r1)**
  Người dùng thấy gì: Một hồ sơ đã được duyệt trước đó vẫn hiển thị đạt trong các lần kiểm tra lại sau này, dù tiêu chí thật sự đứng sau kết quả đó đã bị thay đổi.
  file: `_acceptance/vao-co-o-ra-co-ten/evals.yaml`
  severity: medium
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 2/11 lỗi rơi vào file không bộ đo nào phủ (scripts/start-scan.mjs, _acceptance/o-chi-mo-khi-co-neo-ngoai/evals.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.

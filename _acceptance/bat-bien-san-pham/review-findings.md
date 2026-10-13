# Review findings: bat-bien-san-pham (round 2)

## Trong hợp đồng

Không có lỗi nào trong hợp đồng ở vòng này.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **E11 paths do not cover the file that now decides its outcome (commands/acceptance-card.md) or its fixture generator**
  Người dùng thấy gì: Phép kiểm thẻ có tràn ngang trên điện thoại hay không chưa được gắn với đúng nơi quyết định kết quả. Nếu vòng sau sửa lại phần đó, kết quả «đạt» cũ có thể được giữ lại mà không chạy lại, nên lỗi tràn ngang có thể lọt qua mà không ai biết.
  file: `_acceptance/bat-bien-san-pham/evals.yaml`
  severity: medium
  Đề xuất: known-limits

- **LS-10 reads the card wrapper by regex on prose instead of from a marker block**
  Người dùng thấy gì: Nếu ai đó viết lại câu hướng dẫn dựng thẻ bằng lời khác, phép chụp ảnh thẻ sẽ báo hỏng ngay thay vì chạy sai, nên chỉ tốn một lượt sửa nhỏ khi chuyện đó xảy ra.
  file: `tests/scripts/luat-san-pham.ca.mjs`
  severity: low
  Đề xuất: wont-fix

- **Viewport fix applied to one copy of the card wrapper; other hand-copied wrappers left as they were**
  Người dùng thấy gì: Một số thẻ mẫu dùng để chụp ảnh ở các hồ sơ khác vẫn hiển thị ở khổ rộng trên điện thoại và có thể khác với thẻ thật người dùng nhận. Thẻ thật đã được sửa, nên chỉ ảnh minh họa của các hồ sơ đó có thể lệch.
  file: `tests/scripts/can-cu-s1.ca.mjs`
  severity: low
  Đề xuất: known-limits

- **Bộ soi luật đọc sai tên tệp khi tên có dấu cách hoặc chữ có dấu, nên bỏ sót chỗ chạm mà không báo gì (r1 · tệp đã đổi)**
  Người dùng thấy gì: Nếu một tệp sản phẩm có tên tiếng Việt có dấu hoặc có dấu cách, và dòng mới thêm vào đúng thứ một luật cấm, thì thẻ cổng sẽ không nêu luật đó và hồ sơ vẫn có thể đi tiếp mà không cần người. Với kho tiếng Việt, luật khó đảo có thể bị lọt mà không ai biết.
  file: `scripts/luat-san-pham.cjs`
  severity: medium
  Đề xuất: new-contract

- **Dòng «Trả lời mẫu» điền sẵn «SP-n: sửa vật», trái với luật «câu mẫu là khuôn có chỗ trống» ghi ngay trong tệp (r1)**
  Người dùng thấy gì: Ở dòng «Trả lời mẫu» trên thẻ, câu trả lời cho một luật bị chạm đã được ghi sẵn là «sửa vật» thay vì để trống cho người điền. Người dùng vẫn đổi được, nhưng thẻ đang gợi sẵn một lựa chọn ở chỗ lẽ ra chỉ nêu các lối ra.
  file: `scripts/gate-card.js`
  severity: medium
  Đề xuất: known-limits

- **Thẻ nuốt im lỗi nạp mô-đun luật, khác mẫu «lộ ra, không im» của ADR 0022 ngay bên cạnh; ở Cổng Bằng chứng lỗi này mở làn đi tiếp (r1)**
  Người dùng thấy gì: Nếu phần kiểm luật sản phẩm bị hỏng lúc dựng thẻ, thẻ không báo gì mà trông như kho không khai luật nào. Ở bước bằng chứng, thẻ thậm chí có thể ghi «đi tiếp» cho một hồ sơ đã chạm luật, nên người ký có thể ký mà không biết phần kiểm đã không chạy.
  file: `scripts/gate-card.js`
  severity: medium
  Đề xuất: known-limits

- **Khối ngữ pháp câu gộp được khai là nguồn duy nhất nhưng chưa thêm nhãn «SP-<số>» và «Tệp luật»; thân lệnh signoff tự mô tả hai nhãn này (r1)**
  Người dùng thấy gì: Tài liệu ngữ pháp câu trả lời một dòng chưa nhắc hai ô trả lời mới cho luật sản phẩm, trong khi hướng dẫn ký có nhắc. Người chỉ đọc tài liệu ngữ pháp sẽ không biết hai ô này tồn tại.
  file: `skills/acceptance/references/human-facing-language.md`
  severity: low
  Đề xuất: known-limits

- **The diff scan misreads quoted paths: files in _acceptance/ with non-ASCII names get flagged as rule hits, and product files with non-ASCII names escape scoped rules (r1 · tệp đã đổi)**
  Người dùng thấy gì: Một tệp ghi chép của vòng có tên tiếng Việt có dấu có thể bị tính nhầm là phạm luật và chặn hồ sơ đi tiếp. Ngược lại, tệp sản phẩm có tên có dấu có thể phạm luật mà không bị phát hiện.
  file: `scripts/luat-san-pham.cjs`
  severity: medium
  Đề xuất: new-contract

- **An added line whose content starts with '++ ' is parsed as a file header, so that line and the rest of the file go unscanned (r1 · tệp đã đổi)**
  Người dùng thấy gì: Hiếm khi, một dòng mới thêm vào có nội dung mở đầu bằng hai dấu cộng và dấu cách sẽ làm bộ soi hiểu nhầm. Khi đó dòng ấy và phần còn lại của tệp có thể không được soi luật, nên một chỗ phạm luật có thể bị lọt.
  file: `scripts/luat-san-pham.cjs`
  severity: low
  Đề xuất: known-limits

- **The design-step card reads the oldest rule-load line, so re-loading after the rule file changes can never clear the 'rules changed' warning (r1 · tệp đã đổi)**
  Người dùng thấy gì: Nếu luật sản phẩm đổi giữa lúc thiết kế và người đã soi lại lựa chọn theo bản mới, thẻ vẫn mãi báo «luật đã đổi» vì nó đọc dòng nạp cũ nhất. Cờ này chỉ là cảnh báo vàng, nhưng không bao giờ tự tắt được dù đã xử lý.
  file: `scripts/luat-san-pham.cjs`
  severity: medium
  Đề xuất: known-limits

- **The crm timezone measurement script aborts partway when a search finds nothing (r1)**
  Người dùng thấy gì: Tệp đo múi giờ dùng để lập số liệu ban đầu có thể dừng giữa chừng và cho báo cáo cụt nếu chạy lại trên bản kho không có kết quả khớp. Sản phẩm không dùng tệp này, chỉ ảnh hưởng người chạy lại phép đo.
  file: `_acceptance/bat-bien-san-pham/do-11-10/do-mui-gio.sh`
  severity: low
  Đề xuất: wont-fix

- **Hình dạng 3 (assert chuỗi có mặt thay cho quan hệ): LS-10 đo nhãn ô, không đo câu luật nằm trong khối VIỆC CỦA ANH (r1 · tệp đã đổi)**
  Người dùng thấy gì: Phép kiểm xác nhận câu luật nằm đúng chỗ người đọc trả lời chỉ đo được các nhãn ô chứ không đo chính câu luật. Nếu sau này câu luật bị bỏ khỏi thẻ, phép kiểm vẫn báo xanh.
  file: `tests/scripts/luat-san-pham.ca.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (âm tính một mình): LS-05-do nhận mọi kết quả trừ (do, mã bị gỡ), kể cả khi mô-đun nạp hỏng và rơi về nhánh dự phòng (r1 · tệp đã đổi)**
  Người dùng thấy gì: Phép thử «gỡ một luật thì phải bị phát hiện» có thể báo xanh vì sai lý do, ví dụ khi bản thử bị hỏng nên không chạy được. Màu xanh đó chưa chứng minh luật bị gỡ thật sự được phát hiện.
  file: `tests/scripts/luat-san-pham.ca.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (âm tính một mình): ca không bật Hỏi-3 ở LS-05 the qua cả khi câu hỏi không tồn tại (r1 · tệp đã đổi)**
  Người dùng thấy gì: Phép kiểm «câu hỏi không dính luật thì không mang chữ phạm luật» vẫn xanh nếu câu hỏi đó biến mất hẳn khỏi thẻ. Nó không chứng minh được câu hỏi đang hiện đúng và sạch.
  file: `tests/scripts/luat-san-pham.ca.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 2 (fixture viết tay đúng khuôn bên đọc): kịch bản gate2-luat và LS-11 tự viết luat-cham.json và tệp luật thay vì rút từ bộ ghi hay khuôn (r1)**
  Người dùng thấy gì: Một số kịch bản thử dùng dữ liệu viết tay thay vì dữ liệu do chính công cụ sinh ra, nên nếu định dạng sinh ra đổi, các kịch bản này vẫn xanh. Chỉ ảnh hưởng độ tin cậy của phép kiểm phụ, không ảnh hưởng người dùng cuối.
  file: `tests/plugins/fixtures/viec-cua-anh-scenarios.sh`
  severity: low
  Đề xuất: wont-fix

⚠ Cụm ngoài vùng phủ: 2/3 lỗi rơi vào file không bộ đo nào phủ (_acceptance/bat-bien-san-pham/evals.yaml, tests/scripts/can-cu-s1.ca.mjs) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.

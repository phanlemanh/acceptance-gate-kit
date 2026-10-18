# Review findings: ve-lo-trinh-doc-tin-hieu-cua-cay (round 2)

## Trong hợp đồng

(không có)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **E5 gắn bộ kiểm hồi quy plugins vùng 2 vào AC-4, mà hợp đồng AC-4 không hứa điều đó; chú thích «không đổi phép đo của tiêu chí nào» không đúng**
  Người dùng thấy gì: Thẻ nghiệm thu của tiêu chí «kho thường vẽ y hệt trước» có thêm một bước kiểm chung cho cả bộ công cụ, nên nếu nơi khác trong kit hỏng thì tiêu chí này có thể báo trượt dù lời hứa của nó vẫn đúng. Người ký có thể đọc nhầm nguyên nhân khi thấy tiêu chí đó đỏ.
  Căn cứ: Hậu quả nhẹ: chỉ có thể làm người đọc thẻ hiểu nhầm lý do một tiêu chí đỏ, không mất dữ liệu và không ảnh hưởng người dùng cuối; ghi rõ là bước mượn chỗ thì rẻ và đảo được bất cứ lúc nào.
  file: `_acceptance/ve-lo-trinh-doc-tin-hieu-cua-cay/evals.yaml`
  severity: medium
  Đề xuất: known-limits

- **E3 trong evals.yaml chưa cập nhật theo ca đo đã sửa ở lượt 1: thiếu VT-3-do2 và phép ghim số câu của chân --cau**
  Người dùng thấy gì: Thẻ nghiệm thu cho nhóm bộ đọc tương tác chưa kể hết các phép kiểm mới được thêm, nên người ký đọc thẻ sẽ thấy ít hơn những gì máy thực sự kiểm. Việc kiểm thật vẫn chạy đầy đủ.
  Căn cứ: Rủi ro rất thấp vì phép kiểm thật vẫn chạy và vẫn đòi xanh; chỉ phần mô tả trên thẻ thiếu vài ý, không ai mất gì và có thể bổ sung sau bất cứ lúc nào.
  file: `_acceptance/ve-lo-trinh-doc-tin-hieu-cua-cay/evals.yaml`
  severity: low
  Đề xuất: wont-fix

- **Tài liệu tham chiếu hứa sai chỗ người còn thấy ý chưa commit: /road-map:xem không hiện tín hiệu nào (r1)**
  Người dùng thấy gì: Tài liệu nói ý chưa commit vẫn xem được bằng lệnh xem lộ trình, nhưng lệnh đó thực tế không hiện ý nào. Chủ kho có thể tưởng ý của mình đang hiện ở đó trong khi nó chỉ hiện ở thẻ khởi động và các lệnh gom tín hiệu.
  Căn cứ: Chỉ là lời hướng dẫn sai, không mất dữ liệu: ý vẫn còn nguyên và xem được ở chỗ khác, người dùng tự tìm lại được; sửa một câu rất rẻ nhưng nằm ngoài vòng vá này.
  file: `skills/acceptance/references/lo-trinh-du-lieu.md`
  severity: medium
  Đề xuất: known-limits

- **tepTheoDoi coi MỌI lỗi git là «không phải kho git»: lọc theo dõi mở toang (fail-open), còn nguồn khai đường tuyệt đối thì bị lọc rỗng mà không báo (r1)**
  Người dùng thấy gì: Trong vài cấu hình hiếm (nguồn tín hiệu khai ngoài kho hoặc bằng đường tuyệt đối, hoặc git báo lỗi lạ), trang lộ trình có thể hiện nhầm ý chưa commit hoặc mất cả ý đã commit mà không có cảnh báo nào.
  Căn cứ: Hiếm gặp trong cấu hình thật (kho duy nhất khai cửa trên máy theo dõi tệp ý trong git), nếu xảy ra thì trang chỉ lệch và vẽ lại được, nhưng người dùng không có dấu hiệu để biết vì sao.
  file: `scripts/tin-hieu.mjs`
  severity: low
  Đề xuất: known-limits

- **A plain (non-git) repo folder nested inside a parent git repo loses every signal from the roadmap page (r1)**
  Người dùng thấy gì: Nếu thư mục dự án không có git riêng mà nằm trong một kho git khác, trang lộ trình sẽ không hiện ý tín hiệu nào, khác với trước đây.
  Căn cứ: Cấu hình này hiếm, hậu quả chỉ là trang thiếu khối tín hiệu (không mất dữ liệu, ý vẫn thấy ở các lệnh tương tác), và người dùng tự khắc phục được bằng cách khởi tạo git cho thư mục.
  file: `scripts/tin-hieu.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4: thông điệp ghim chiều đỏ bắt cả ca «bộ đọc sập / trang không vẽ», không chỉ lỗi được nhắm (r1 · tệp đã đổi)**
  Người dùng thấy gì: Khi bài kiểm tra báo đỏ, người đọc có thể không phân biệt được là công cụ đọc tín hiệu bị hỏng hay chỉ là lọc mất ý, nên chẩn đoán lỗi chậm hơn.
  Căn cứ: Không ảnh hưởng người dùng cuối vì bài kiểm tra vẫn đỏ khi có lỗi; chỉ làm người bảo trì mất thêm thời gian tìm nguyên nhân, và sửa tương đối rẻ nếu cần sau.
  file: `tests/scripts/ve-lo-trinh-doc-tin-hieu-cua-cay.test.mjs`
  severity: low
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

(không có)

⚠ Cụm ngoài vùng phủ: 2/2 lỗi rơi vào file không bộ đo nào phủ (_acceptance/ve-lo-trinh-doc-tin-hieu-cua-cay/evals.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.

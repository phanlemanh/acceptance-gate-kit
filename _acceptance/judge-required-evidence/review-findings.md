## Trong hợp đồng

### Phát hiện panel carried bằng truthiness thay vì key-presence — carried_from_round: null bị đếm là chấm tươi
- file: `/Users/manhphan/dev/acceptance-gate-kit/scripts/acceptance-gold.mjs:51`
- severity: low
- detail: `carried: !!e.carried_from_round` — nhưng phía writer (feature-loop/workflows/acceptance-verify.js:727) ghi dòng panel carried với `carried_from_round: typeof p.fromRound === 'number' ? p.fromRound : null`, tức key LUÔN có mặt trên dòng carried nhưng giá trị có thể là null (carriedPanels do SKILL truyền thiếu/không-số fromRound). `!!null === false` → panel carried bị phân loại là chấm tươi và vào mẫu số agreement() — đúng cái mà comment trong agreement() nói phải loại để khỏi "nhân đôi mẫu". Đường xảy ra hẹp (bình thường fromRound là số ≥1) nhưng writer đã chủ động code nhánh null nên reader phải đọc được nó. Sửa: `carried: ('carried_from_round' in e)` (hoặc `e.carried_from_round != null` nếu muốn giữ ngữ nghĩa cũ cho dòng thiếu key). Cùng sửa mirror plugins/.
- AC: AC-9

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **JR11a đóng băng vĩnh viễn lib/** + hooks/** — thước gắn vào vật KHÔNG được giao**
  Người dùng thấy gì: Bài kiểm tra tự động chặn hai thư mục lõi hệ thống sẽ báo lỗi cho bất kỳ thay đổi hợp lệ nào sau này chạm vào các thư mục đó, kể cả khi không liên quan gì tới tính năng đang xét, có thể làm chậm trễ những lần bàn giao khác trong tương lai.
  file: `/Users/manhphan/dev/acceptance-gate-kit/tests/scripts/core-untouched.test.mjs:27`
  severity: high
  Đề xuất: known-limits

- **P149 nhánh mutant chỉ ghim mã thoát, không ghim thông điệp — vi phạm trực tiếp bất biến 'assertion âm-tính'**
  Người dùng thấy gì: Một trong các bài kiểm tra tự động chỉ xem kết quả 'thất bại hay không' mà không kiểm tra đúng lý do thất bại, nên nó có thể báo 'đạt' ngay cả khi lỗi phát sinh không liên quan tới điều cần kiểm tra, khiến người đọc báo cáo tin nhầm là mọi thứ ổn.
  file: `/Users/manhphan/dev/acceptance-gate-kit/tests/plugins/run-tests.sh:6007`
  severity: medium
  Đề xuất: known-limits

- **Codex harness không nhận bước Sổ vàng — acceptance-report hai harness trôi khỏi nhau**
  Người dùng thấy gì: Nếu dùng lệnh /acceptance-report qua bộ công cụ Codex thay vì Claude, người dùng sẽ không thấy hai khối 'Sổ vàng' và 'mức đồng thuận giám khảo' hiện ra như khi dùng bên kia, dù đang xét cùng một tính năng.
  file: `/Users/manhphan/dev/acceptance-gate-kit/codex/acceptance-gate/skills/acceptance-report/SKILL.md:1`
  severity: medium
  Đề xuất: known-limits

- **MISSING_EVIDENCE_MARK nhân bản 4 chỗ, quan hệ khớp-chuỗi được TUYÊN BỐ nhưng không được ĐO**
  Người dùng thấy gì: Cụm chữ đánh dấu 'judge không nêu bằng chứng thiếu' hiện được chép tay ở bốn nơi khác nhau trong hệ thống; nếu sau này ai đó sửa một nơi mà quên sửa những nơi còn lại, dấu hiệu này có thể âm thầm biến mất khỏi báo cáo mà không ai phát hiện ra.
  file: `/Users/manhphan/dev/acceptance-gate-kit/feature-loop/workflows/acceptance-verify.js:99`
  severity: medium
  Đề xuất: known-limits

- **P154 nhánh mutant có lối thoát `or len>1` — vô hiệu khi clause lặp**
  Người dùng thấy gì: Bài kiểm tra tự động phát hiện việc xoá nhầm một đoạn hướng dẫn có một lỗ hổng tiềm ẩn: nếu sau này ai đó lặp lại đúng cụm từ đó ở một chỗ khác trong tài liệu, bài kiểm tra sẽ ngừng phát hiện việc đoạn hướng dẫn gốc bị xoá mà không có cảnh báo nào.
  file: `/Users/manhphan/dev/acceptance-gate-kit/tests/plugins/run-tests.sh:6109`
  severity: low
  Đề xuất: known-limits

- **collectGold parse evidence-report.md không skip block scalar — tái mở đúng lỗ mà gate-card đã vá**
  Người dùng thấy gì: Nếu về sau một báo cáo chứa đoạn trích dẫn hoặc log có dòng chữ trông giống một quyết định thật của người, Sổ vàng có thể hiểu nhầm đó là quyết định thật và in ra thông tin không chính xác về việc ai đã quyết định gì.
  file: `/Users/manhphan/dev/acceptance-gate-kit/scripts/acceptance-gold.mjs:35`
  severity: medium
  Đề xuất: known-limits

- **P150 (leg đọc-cũ) và JR11a tự vô hiệu sau khi merge — merge-base HEAD origin/main trở thành HEAD**
  Người dùng thấy gì: Hai bài kiểm tra đảm bảo 'báo cáo cũ vẫn hiển thị đúng như trước' và 'phần lõi không bị đụng tới' chỉ có tác dụng trong giai đoạn xét duyệt; sau khi mã được gộp vào nhánh chính, chúng sẽ luôn báo 'đạt' bất kể sau này có ai làm hỏng khả năng đọc báo cáo cũ hay không, mà không ai nhận ra.
  file: `/Users/manhphan/dev/acceptance-gate-kit/tests/plugins/run-tests.sh:6025`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 2 — Fixture VIẾT TAY đúng khuôn bên đọc: P150 tự printf report thay vì sinh từ khuôn template**
  Người dùng thấy gì: Bài kiểm tra cho tình huống 'báo cáo cũ vẫn hiển thị đúng' hiện được viết tay theo đúng khuôn mẫu mà hệ thống mong đợi, thay vì được tạo ra từ chính bản mẫu chuẩn; nếu bản mẫu chuẩn thay đổi cấu trúc sau này, bài kiểm tra có thể không phát hiện ra rằng màn hình quyết định đã ngừng hiển thị đúng cho báo cáo thật.
  file: `tests/plugins/run-tests.sh:6019`
  severity: high
  Đề xuất: known-limits

- **Hình dạng 3 — Assert 'chuỗi có mặt' trong khi lời hứa là QUAN HỆ: JR1 đo từ vựng prompt judge**
  Người dùng thấy gì: Bài kiểm tra xác nhận hướng dẫn cho AI giám khảo có nhắc tới việc phải nêu bằng chứng còn thiếu chỉ tìm xem hai cụm từ có xuất hiện đâu đó trong văn bản hay không, chứ chưa chắc kiểm đúng quy định 'nếu không đạt thì bắt buộc phải nêu bằng chứng' — một hướng dẫn viết sai ý vẫn có thể được xem là đạt.
  file: `tests/workflows/acceptance-verify.test.mjs:1196`
  severity: high
  Đề xuất: known-limits

- **Hình dạng 4 (nửa b) — Âm tính không ghim thông điệp: mutant P149 chỉ kiểm exit code, stderr bị ignore**
  Người dùng thấy gì: Một trong các bài kiểm tra tự động chỉ xem kết quả 'thất bại hay không' mà không kiểm tra đúng lý do thất bại, nên nó có thể báo 'đạt' ngay cả khi lỗi phát sinh không liên quan tới điều cần kiểm tra, khiến người đọc báo cáo tin nhầm là mọi thứ ổn.
  file: `tests/plugins/run-tests.sh:6007`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 — Quan hệ token dấu-thiếu workflow ↔ template không được assert ở đâu**
  Người dùng thấy gì: Cụm chữ đánh dấu 'judge không nêu bằng chứng thiếu' hiện được chép tay ở nhiều nơi khác nhau trong hệ thống; nếu sau này ai đó sửa một nơi mà quên sửa những nơi còn lại, dấu hiệu này có thể âm thầm biến mất khỏi báo cáo mà không ai phát hiện ra.
  file: `tests/workflows/acceptance-verify.test.mjs:1168`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 — Mutant tự vô hiệu: P154 có escape hatch `or len(findall) > 1` làm nhánh mutation vacuous khi clause trùng lặp**
  Người dùng thấy gì: Bài kiểm tra tự động phát hiện việc xoá nhầm một đoạn hướng dẫn có một lỗ hổng tiềm ẩn: nếu sau này ai đó lặp lại đúng cụm từ đó ở một chỗ khác trong tài liệu, bài kiểm tra sẽ ngừng phát hiện việc đoạn hướng dẫn gốc bị xoá mà không có cảnh báo nào.
  file: `tests/plugins/run-tests.sh:6107`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 2 (mức nhẹ, có giảm nhẹ một phần) — P153 dựng dòng panel run-log bằng tay thay vì rút từ writer**
  Người dùng thấy gì: Một phần của bài kiểm tra phân loại mức đồng thuận giữa các giám khảo dùng dữ liệu mẫu tự dựng thay vì dữ liệu thật do hệ thống ghi ra; nếu cấu trúc dữ liệu thật thay đổi tên trường sau này, phần phân loại 'đồng thuận / có bất đồng' có thể âm thầm tính sai trên dữ liệu thật trong khi bài kiểm tra vẫn báo đạt.
  file: `tests/plugins/run-tests.sh:6086`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).

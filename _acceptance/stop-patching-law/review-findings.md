# Review Findings: stop-patching-law (round 2)

## Trong hợp đồng

### 1. Fixture viết tay không round-trip: 4 bản ghi hành vi hanh-vi-* là đầu vào đo E6/P170 và fixture judge J1 nhưng không có provenance, không code path nào sinh hay kiểm
- file: `tests/plugins/run-tests.sh:8124`
- severity: medium
- AC: AC-6

P169 tự tuyên luật "đầu vào chấm hành vi phải do CODE SINH, không viết tay" nhưng danh sách GENERATED (run-tests.sh:8124) chỉ phủ bien-ban-vong-2.md + 4 file chi-dan-*; bốn câu trả lời hanh-vi-A1/A2/B1/B2.md và hanh-vi-prompt.md — vật được đo thật sự của AC-6 — được P170 đọc thẳng từ đĩa (run-tests.sh:8271, `f = EV / f'hanh-vi-{tag}-{h}-{arm}.md'`) mà không có bất kỳ mối nối provenance nào: không entry run-log.jsonl (P170 không hề đọc run-log), không hash prompt, file còn untracked ở HEAD (git status ??). Hệ quả: một câu trả lời VIẾT TAY dán nguyên khối mệnh đề vào phần "CĂN CỨ" vượt P170 (LCS ≥ ngưỡng) và J1 y hệt một lượt agent context sạch thật — phép đo không phân biệt được "agent đọc mệnh đề rồi dừng" với "người soạn văn đúng khuôn bên đọc". Đây đúng hình dạng 2 (fixture cho judge là văn không code path nào sinh ra / không kiểm được nguồn), và cũng làm mềm lời hứa E6 "bốn lượt agent context sạch, MỘT prompt trung tính duy nhất" — bản ghi prompt chỉ là tài liệu tự khai với đường dẫn thay bằng "<…>", không gì xác nhận từng arm thực nhận đúng file chi-dan nào.

AC-6 nêu rõ điều kiện Given là "biên bản do chính lần chạy sinh, không viết tay"; các file hanh-vi-*.md hiện là văn viết tay, untracked, không có mối nối provenance nào — trực tiếp không thoả điều kiện tường minh này của AC-6.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **P169/P170 ghim snapshot evidence vào nguồn sống — mọi edit SKILL.md tương lai làm đỏ toàn suite, message chẩn đoán sai**
  Người dùng thấy gì: Sau này chỉ cần sửa nội dung hướng dẫn — kể cả những chỗ không liên quan tới quy tắc dừng-vá — là toàn bộ bộ kiểm tra tự động sẽ báo đỏ, và thông báo lỗi hiển thị ra sẽ chỉ sai nguyên nhân, khiến người xử lý mất thời gian tìm nhầm chỗ.
  file: `tests/plugins/run-tests.sh`
  severity: medium
  Đề xuất: known-limits

- **Bump 1.26.0 nhưng description changelog của plugin.json dừng ở v1.24 — mệnh đề dừng-vá vô hình trong metadata gói**
  Người dùng thấy gì: Người đọc thông tin phiên bản của gói sẽ không thấy nhắc gì về việc bổ sung quy tắc dừng-vá, nên có thể tưởng lầm bản 1.25 và 1.26 không thay đổi gì so với bản 1.24.
  file: `feature-loop/.claude-plugin/plugin.json`
  severity: low
  Đề xuất: known-limits

- **Bộ đo quan-hệ-chứa của P168 nhận nhầm dòng '#' trong code fence là heading markdown**
  Người dùng thấy gì: Nếu sau này tài liệu hướng dẫn được sửa và có thêm một dòng bắt đầu bằng dấu # nằm bên trong một đoạn ví dụ minh hoạ, công cụ kiểm tra vị trí của quy tắc dừng-vá có thể cho kết quả sai mà không ai nhận ra ngay.
  file: `tests/plugins/run-tests.sh`
  severity: low
  Đề xuất: known-limits

- **P168: dòng bảng đột biến thiếu ký tự '|' làm vỡ test bằng IndexError, nuốt sạch chẩn đoán đã thu**
  Người dùng thấy gì: Nếu sau này ai đó gõ nhầm định dạng một dòng trong danh sách ca kiểm thử, công cụ sẽ dừng đột ngột với một lỗi kỹ thuật khó hiểu thay vì chỉ rõ dòng nào sai, khiến người xử lý mất thời gian dò tìm.
  file: `tests/plugins/run-tests.sh`
  severity: low
  Đề xuất: known-limits

- **P170: chốt chống-mớm chỉ soi khối ``` ĐẦU TIÊN của hanh-vi-prompt.md — cấu trúc file đổi là chốt âm thầm soi nhầm đoạn**
  Người dùng thấy gì: Nếu sau này ai đó thêm một đoạn ví dụ minh hoạ khác vào phía trên trong tài liệu ghi lại lời nhắc dùng để kiểm tra hành vi, công cụ chống lộ đáp án có thể ngừng phát hiện việc lời nhắc bị lộ đáp án mà không báo lỗi gì, làm kết quả kiểm tra sau này kém tin cậy.
  file: `tests/plugins/run-tests.sh`
  severity: low
  Đề xuất: known-limits

- **Đo quan hệ nhưng thiếu một vế: judge J1 phải phán 'khác biệt truy ngược được về mệnh đề bị gỡ' mà inputs không có khối mệnh đề lẫn hai bản chỉ dẫn**
  Người dùng thấy gì: Phép chấm bằng AI cho tiêu chí hành vi này hiện chỉ dựa vào lời tự giải thích của câu trả lời đang được kiểm tra, không có tài liệu gốc để đối chiếu — nên nếu câu trả lời tự bịa ra một lý do nghe có vẻ hợp lý, phép chấm có thể không phát hiện ra và cho kết quả sai.
  file: `_acceptance/stop-patching-law/evals.yaml`
  severity: medium
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 2/7 lỗi rơi vào file không bộ đo nào phủ (feature-loop/.claude-plugin/plugin.json, _acceptance/stop-patching-law/evals.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.

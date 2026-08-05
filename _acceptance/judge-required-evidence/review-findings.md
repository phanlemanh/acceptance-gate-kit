# Review Findings: judge-required-evidence (round 4)

## Trong hợp đồng

_Không có phát hiện nào khớp AC trong vòng này._

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **JR11a chết ngay khi merge: base = HEAD → `git diff HEAD HEAD` luôn rỗng (và trước merge lại là chốt chặn oan)**
  Người dùng thấy gì: Phép kiểm 'phần lõi công cụ không bị đụng vào' sẽ tự động báo xanh mãi mãi ngay sau khi gộp nhánh này, kể cả khi sau này ai đó thực sự sửa phần lõi — người xem báo cáo có thể tin nhầm là phần lõi vẫn an toàn trong khi phép kiểm không còn tác dụng.
  file: `tests/scripts/core-untouched.test.mjs`
  severity: high
  Đề xuất: known-limits

- **P150 'đường đọc-cũ so với BASE commit' trở thành so file với chính nó sau khi merge**
  Người dùng thấy gì: Phép kiểm 'báo cáo cũ vẫn hiển thị đúng như trước' sẽ tự động báo xanh mãi mãi sau khi gộp nhánh này, kể cả khi về sau có ai vô tình làm hỏng cách hiển thị báo cáo cũ — sẽ không còn ai phát hiện ra.
  file: `tests/plugins/run-tests.sh`
  severity: high
  Đề xuất: known-limits

- **P150 hardcode `origin/main` không có thang lùi, lệch pattern đã có sẵn trong chính PR này**
  Người dùng thấy gì: Nếu ai đó chạy bộ kiểm tra này trên một bản sao code không có kết nối tới nhánh gốc (ví dụ bản tải rời, không phải git clone thường), toàn bộ bộ kiểm tra có thể báo lỗi dù không có gì sai thật — gây báo động giả khó hiểu.
  file: `tests/plugins/run-tests.sh`
  severity: medium
  Đề xuất: known-limits

- **P154 tự vô hiệu hoá kiểm mutant bằng mệnh đề `or len(re.findall(...)) > 1`**
  Người dùng thấy gì: Bộ kiểm tra chống giả mạo cho hướng dẫn lệnh tổng kết có một kẽ hở: nếu sau này ai đó vô tình lặp lại một câu chữ có sẵn ở chỗ khác trong tài liệu, bộ kiểm sẽ ngưng phát hiện việc câu đó bị xoá mất mà không ai biết.
  file: `tests/plugins/run-tests.sh`
  severity: medium
  Đề xuất: known-limits

- **Panel carried từ run-log đời cũ đi vòng qua `normalizeVote` — không required_evidence, cũng không dấu thiếu, không cờ vàng**
  Người dùng thấy gì: Với những vòng chấm cũ từ trước khi tính năng này ra đời, thẻ quyết định Cổng 2 có thể không hiện dấu nhắc 'giám khảo chưa nêu bằng chứng còn thiếu' — người ký duyệt nhìn vào có thể hiểu nhầm là giám khảo đã nêu đủ, trong khi thực ra dữ liệu chỉ đơn giản là cũ hơn tính năng này.
  file: `feature-loop/workflows/acceptance-verify.js`
  severity: medium
  Đề xuất: known-limits

- **P152/P153 ghim ngưỡng cứng vào corpus `_acceptance/` sống của repo**
  Người dùng thấy gì: Việc dọn dẹp dữ liệu lịch sử của công cụ, hoặc tách bớt một tính năng cũ sang kho khác, có thể làm cả bộ kiểm tra báo đỏ dù không có lỗi thật nào xảy ra — gây mất thời gian điều tra nhầm hướng.
  file: `tests/plugins/run-tests.sh`
  severity: low
  Đề xuất: known-limits

- **gate-card.js ghi `__reOpen` / `required_evidence_list` thẳng vào `evid[cur]`, đi vòng qua allowlist FIELDS mà comment ngay trên đó đang giải thích lý do tồn tại**
  Người dùng thấy gì: Hiện tại chưa gây hậu quả gì cho người dùng, nhưng cách viết mã để hai mục dữ liệu mới đi vòng qua danh sách kiểm soát an toàn — nếu sau này thêm tính năng đọc dữ liệu đó, một dòng log trích dẫn kỹ thuật có thể vô tình lọt vào và làm sai lệch nội dung hiển thị trên thẻ quyết định.
  file: `scripts/gate-card.js`
  severity: low
  Đề xuất: known-limits

- **JR11a hard-wires "lib/** and hooks/** never change" into the always-on suite — blocks every future core change**
  Người dùng thấy gì: Ngay khi có ai đó, ở một tính năng sau này, sửa hợp lệ vào phần lõi của công cụ, toàn bộ hàng rào kiểm tra tự động của mọi tính năng có thể báo đỏ hàng loạt dù thay đổi đó không sai gì — chặn đường phát triển tiếp theo một cách oan uổng.
  file: `tests/scripts/core-untouched.test.mjs`
  severity: high
  Đề xuất: known-limits

- **Template round-trip markers leak verbatim into generated evidence reports**
  Người dùng thấy gì: Báo cáo bằng chứng sinh ra cho người đọc có thể lẫn những dòng đánh dấu kỹ thuật vô nghĩa với người dùng, làm báo cáo trông rối và kém chuyên nghiệp hơn.
  file: `skills/acceptance/references/evidence-report-template.md`
  severity: medium
  Đề xuất: known-limits

- **acceptance-gold render() states a false cause for every slug with no panel record**
  Người dùng thấy gì: Với một số tính năng chưa từng được hội đồng chấm điểm, báo cáo Sổ vàng lại giải thích sai rằng chúng 'được chấm trước khi máy bắt đầu ghi chép' — người đọc báo cáo có thể hiểu nhầm lý do thiếu dữ liệu.
  file: `scripts/acceptance-gold.mjs`
  severity: medium
  Đề xuất: known-limits

- **Wrong --root produces a confident empty gold book instead of an error (exit 0)**
  Người dùng thấy gì: Nếu lệnh tổng kết Sổ vàng được chạy nhầm thư mục, công cụ không báo lỗi mà lặng lẽ in ra một kết luận nghe có vẻ chắc chắn rằng 'chưa ai từng ghi đè quyết định của máy' — dễ khiến người đọc tin nhầm vào một kết luận thực chất trống rỗng.
  file: `scripts/acceptance-gold.mjs`
  severity: medium
  Đề xuất: known-limits

- **judgedBlocks is not an independent sanity counter — P152's guard is a tautology**
  Người dùng thấy gì: Một trong hai lớp cảnh báo 'không đọc được dữ liệu chấm điểm' thực chất không bao giờ tự kích hoạt độc lập, nên nếu sau này công cụ đọc sai định dạng biên bản chấm điểm, người dùng có thể không được cảnh báo đúng lúc.
  file: `scripts/acceptance-gold.mjs`
  severity: low
  Đề xuất: known-limits

- **Đo CHỈ DẪN thay vì ĐẦU RA — render() của acceptance-gold.mjs không phép đo máy nào chạm tới**
  Người dùng thấy gì: Bộ kiểm tra tự động chỉ xác nhận tài liệu hướng dẫn có nhắc tới bước in báo cáo, chứ không kiểm tra báo cáo thật in ra màn hình có đúng nội dung hay không — nếu phần chữ hiển thị cho người bị hỏng, hệ thống kiểm tra tự động hiện tại sẽ không phát hiện ra.
  file: `tests/plugins/run-tests.sh`
  severity: high
  Đề xuất: new-contract

- **Assert 'chuỗi có mặt' trong khi lời hứa là QUAN HỆ — token dấu-thiếu tồn tại 3 bản, không phép đo nào ghim chúng bằng nhau**
  Người dùng thấy gì: Dấu nhắc 'giám khảo chưa nêu bằng chứng còn thiếu' được viết ở ba nơi khác nhau trong công cụ; nếu sau này chỉ một nơi bị sửa chữ mà quên sửa hai nơi kia, dấu nhắc có thể ngừng hoạt động mà không có cảnh báo nào bật lên.
  file: `tests/plugins/run-tests.sh`
  severity: high
  Đề xuất: known-limits

- **Assertion âm-tính chỉ ghim MÃ THOÁT, không ghim thông điệp**
  Người dùng thấy gì: Bộ kiểm tra chặn nội dung báo cáo giả mạo chỉ nhìn vào việc chương trình có báo lỗi hay không, không kiểm tra lý do báo lỗi có đúng là cái cần chặn hay không — nên một trục trặc khác không liên quan cũng có thể khiến bộ kiểm tra 'tưởng' mình đang hoạt động đúng.
  file: `tests/plugins/run-tests.sh`
  severity: medium
  Đề xuất: known-limits

- **Fixture VIẾT TAY đúng khuôn bên đọc — reader thứ hai (gate-card) không round-trip qua marker của khuôn**
  Người dùng thấy gì: Dữ liệu mẫu dùng để kiểm tra màn hình quyết định Cổng 2 được viết tay đúng khuôn hiện tại, không tự sinh ra từ khuôn mẫu gốc — nếu khuôn mẫu báo cáo đổi cách trình bày sau này, bộ kiểm tra có thể không phát hiện ra màn hình Cổng 2 đã đọc sai dữ liệu.
  file: `tests/plugins/run-tests.sh`
  severity: medium
  Đề xuất: known-limits

- **Assert 'chuỗi có mặt' trong khi lời hứa là QUAN HỆ điều kiện — vế thứ hai của assert luôn đúng sẵn**
  Người dùng thấy gì: Bộ kiểm tra xác nhận hướng dẫn cho giám khảo có nhắc yêu cầu nêu bằng chứng còn thiếu, nhưng không thực sự kiểm tra được rằng yêu cầu đó gắn đúng với điều kiện 'khi không đạt' — nếu điều kiện đó bị viết sai hoặc bị xoá sau này, bộ kiểm tra vẫn sẽ không phát hiện.
  file: `tests/workflows/acceptance-verify.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Tuyên quét LỚP nhưng chỉ có điểm-case — ma trận đồng thuận thiếu chiều per-lens và nhánh số-vote chẵn**
  Người dùng thấy gì: Báo cáo mức đồng thuận giữa các giám khảo hứa hẹn tách riêng số liệu theo từng góc nhìn chấm điểm, nhưng phần đó chưa có phép kiểm tra tự động nào xác nhận — nếu số liệu theo từng góc nhìn bị tính sai sau này, sẽ không có cảnh báo nào bật lên trước khi tới tay người đọc.
  file: `tests/plugins/run-tests.sh`
  severity: medium
  Đề xuất: new-contract

- **Đối chứng mutant tự vô hiệu hoá khi mệnh đề xuất hiện >1 lần**
  Người dùng thấy gì: Bộ kiểm tra chống giả mạo cho hướng dẫn lệnh tổng kết ngưng hoạt động một cách âm thầm nếu một câu chữ trong tài liệu vô tình bị lặp lại ở nơi khác — không ai được cảnh báo khi điều đó xảy ra.
  file: `tests/plugins/run-tests.sh`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).

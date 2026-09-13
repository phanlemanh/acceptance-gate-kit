## Trong hợp đồng

Phân loại của MÁY không dùng được ở lượt này (bước triage khai hỏng, và bản thân
nó xếp 0 mục vào trong hợp đồng). Chủ vòng phân loại lại từng mục theo bảy tiêu
chí đã duyệt: cả mười đều nằm TRONG hợp đồng. Không mục nào ngoài phạm vi.

- **Tiêu chí MA trên thẻ Cổng Phạm vi: hợp đồng không có mục tiêu chí thì bộ đọc quét cả tệp, và cờ điểm-mù hoá im**
  Người dùng thấy gì: Với hợp đồng không đặt mục tiêu chí đúng tên, thẻ duyệt hiện thêm những dòng lấy từ mục «Known limits» như thể chúng là tiêu chí phải làm, cảnh báo «đừng duyệt» biến mất, và dòng một-chạm mở sẵn chữ duyệt — người bấm duyệt một danh sách máy tự bịa.
  file: `lib/ac-line.cjs:131`
  severity: high
  Đề xuất: 
  AC: AC-7, AC-9

- **Cùng gốc với mục trên, nhìn từ phía bộ dò: `acBlindSpot` và `parseACBlock` dùng CHUNG một lần quét nên nhánh BLANK không bao giờ đạt tới**
  Người dùng thấy gì: Bộ dò điểm mù được dựng để kêu đúng lúc thẻ đọc thiếu, nhưng nay nó đếm trên cùng một tập dòng với bên bóc tiêu chí, nên số đọc được luôn bằng số nghi ngờ và nó không còn kêu được nữa.
  file: `lib/ac-line.cjs:39`
  severity: high
  Đề xuất: 
  AC: AC-9

- **`AC_SUSPECT` nới sang tiêu đề mà `AC_XREF` sinh đôi thì không — báo «Đọc THIẾU … đừng duyệt» oan trên hợp đồng lành**
  Người dùng thấy gì: Một hợp đồng viết đúng, chỉ có thêm một dòng nhắc chéo «AC-5, AC-9, AC-10 chưa có gì» đặt làm tiêu đề, bị thẻ báo đọc thiếu và khoá nút duyệt — người phải sửa hợp đồng lành để đi tiếp.
  file: `lib/ac-line.cjs:23`
  severity: medium
  Đề xuất: 
  AC: AC-9

- **Khối «Lỗi TRONG hợp đồng» của thẻ Cổng Bằng chứng luôn in chỗ giữ, vì bên viết đặt `plain` rỗng cho đúng loại mục này**
  Người dùng thấy gì: Khối mới sinh ra để người quyết đọc được lỗi ngay trên thẻ lại chỉ hiện một câu giữ chỗ và một đường dẫn tệp, đẩy người đọc về đúng tệp thô mà khối này sinh ra để khỏi phải mở.
  file: `scripts/gate-card.js:972`
  severity: high
  Đề xuất: 
  AC: AC-10, AC-14

- **Cùng mâu thuẫn ấy ở phía bên viết: lời dặn synthesize bảo chép nguyên văn `plain`, còn schema triage ép `plain` về rỗng**
  Người dùng thấy gì: Hai đầu của cùng một khuôn dặn ngược nhau, nên nội dung hiển thị cho người quyết phụ thuộc vào việc mô hình có bỏ qua lời dặn hay không — lượt này nó bỏ qua nên trông có vẻ chạy được, lượt sau chưa chắc.
  file: `feature-loop/workflows/acceptance-verify.js:911`
  severity: medium
  Đề xuất: 
  AC: AC-10, AC-14

- **Bộ đọc thứ tư mà AC-13 gọi tên chưa từng chuyển sang `parseACBlock`; phép đo thay nó bằng chính thư viện bị tiêm**
  Người dùng thấy gì: Răng chặn gộp nhánh về bằng chứng cross-layer vẫn đọc theo khuôn cũ nên với hợp đồng khai tiêu chí bằng tiêu đề, nó không thấy tiêu chí nào và bỏ qua toàn bộ phần kiểm tra — một cổng chặn tắt lặng lẽ.
  file: `scripts/pre-merge-check.sh:891`
  severity: high
  Đề xuất: 
  AC: AC-13

- **Năm trong bảy ca không có chiều đỏ, dù đầu tệp ca và `evals.yaml` đều khai có**
  Người dùng thấy gì: Năm phép đo báo xanh mà chưa ai chứng minh chúng phân biệt được vật lành với vật hỏng; hồ sơ lại ghi rõ từng mũi tiêm và từng thông điệp ghim không tồn tại ở đâu trong mã.
  file: `tests/scripts/cong-nguoi-doc-du-nguon.test.mjs:149`
  severity: high
  Đề xuất: 
  AC: AC-7, AC-8, AC-9, AC-10, AC-15

- **Đối chứng nền của cả bảy phép đo là `MODULE_NOT_FOUND`, được ghi vào báo cáo thành «đỏ = có phân biệt»**
  Người dùng thấy gì: Báo cáo bằng chứng khẳng định mọi phép đo đều đỏ trên cây cũ, nhưng cây cũ chỉ đơn giản là không có tệp ca nên node thoát lỗi — đúng thứ hiến pháp kit gọi tên là «chưa bao giờ chạy» đội lốt màu xanh.
  file: `_acceptance/cong-nguoi-doc-du-nguon/evidence-report.md:1`
  severity: high
  Đề xuất: 
  AC: AC-7, AC-8, AC-9, AC-10, AC-13, AC-14, AC-15

- **E13 khai bốn mũi tiêm độc lập / 9 tiêu chí / bốn bên đọc; CN13 làm một mũi tiêm dùng chung / 5 tiêu chí / ba bên độc lập**
  Người dùng thấy gì: Vế «sửa ba bên quên bên thứ tư» mà phép đo tự khai là mục tiêu lại đúng là vế nó không phân biệt được, vì một mũi tiêm dùng chung làm cả bốn cùng đổi.
  file: `_acceptance/cong-nguoi-doc-du-nguon/evals.yaml:85`
  severity: medium
  Đề xuất: 
  AC: AC-13

- **Chú thích còn khai một «điều kiện xanh-sạch thứ bảy» và một lớp vendored đã đổi mà nhát cắt không hề ship**
  Người dùng thấy gì: Người bảo trì sau đọc chú thích sẽ tin có một răng chặn đang canh, và ghi chú hợp đồng sẽ dẫn người viết ghi chú phát hành bảo các kho tiêu thụ chép một tệp mà đường cưỡng chế không hề nạp.
  file: `tests/plugins/lan-v.test.mjs:230`
  severity: medium
  Đề xuất: 
  AC: AC-10

- **Nửa sau của CN10 tự vô hiệu: nó chỉ chạy khi chuỗi «Bằng chứng đầy đủ» còn tồn tại**
  Người dùng thấy gì: Nếu ai đó đổi cách diễn đạt trên thẻ, một nửa lời hứa của AC-10 lặng lẽ rời khỏi phép đo mà ca vẫn in đạt.
  file: `tests/scripts/cong-nguoi-doc-du-nguon.test.mjs:438`
  severity: low
  Đề xuất: 
  AC: AC-10

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

Không có mục nào ở lượt này.

⚠ Cụm ngoài vùng phủ: 2/10 lỗi rơi vào file không bộ đo nào phủ (tests/plugins/lan-v.test.mjs, _acceptance/cong-nguoi-doc-du-nguon/evals.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.

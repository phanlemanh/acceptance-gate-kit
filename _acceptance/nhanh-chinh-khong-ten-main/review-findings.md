## Trong hợp đồng

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Toàn bộ bảo đảm cho mã engine chỉ nằm trong răng-hồ-sơ — trái ADR 0011, sau merge không lưới nào canh**
  Người dùng thấy gì: Sau khi gộp vào nhánh chính, không còn phép kiểm tra tự động nào tiếp tục canh giữ khả năng nhận diện nhánh chính của công cụ — nếu sau này có ai vô tình làm hỏng nó, lỗi sẽ không bị phát hiện cho đến khi ảnh hưởng thật đến người dùng.
  file: `_acceptance/config.yaml`
  severity: high
  Đề xuất: new-contract

- **SKILL.md vẫn khai «detect remote → fallback» trong khi mã sau r4 cấm fallback khi remote đã khai tên**
  Người dùng thấy gì: Tài liệu hướng dẫn vẫn mô tả cách xử lý cũ, không khớp với cách công cụ phản ứng hiện nay khi máy chủ từ xa đã khai tên nhánh chính — người thao tác đọc tài liệu có thể hiểu sai lý do công cụ dừng lại.
  file: `feature-loop/skills/feature-loop/SKILL.md`
  severity: medium
  Đề xuất: known-limits

- **Dòng khai nguồn nhánh chính in «null … none» khi truyền --diff-base, và ghi cùng giá trị đó vào args**
  Người dùng thấy gì: Khi người dùng tự chỉ định mốc so sánh, công cụ vẫn in ra và ghi lại một dòng thông tin gây hiểu lầm rằng không xác định được nhánh chính, dù việc đó không còn cần thiết trong trường hợp này.
  file: `feature-loop/scripts/s4-args.mjs`
  severity: low
  Đề xuất: known-limits

- **Ca E1 ghim hằng đếm 4 cho danh sách tên dự phòng — thước ghim vào thứ sẽ đổi**
  Người dùng thấy gì: Phép kiểm tra nội bộ có thể báo lỗi giả khi danh sách tên nhánh mặc định được mở rộng thêm trong tương lai, dù công cụ vẫn hoạt động đúng — gây tốn công điều tra một sự cố không có thật.
  file: `_acceptance/nhanh-chinh-khong-ten-main/rang.sh`
  severity: low
  Đề xuất: known-limits

- **Remote query failure/timeout is swallowed and silently degrades to guessing a main branch → wrong diffBase, exit 0**
  Người dùng thấy gì: Khi máy chủ từ xa không phản hồi được (mạng chặn, xác thực lỗi...), công cụ âm thầm đoán đại một nhánh chính khác thay vì báo lỗi rõ ràng, khiến kết quả so sánh có thể sai mà không ai hay biết.
  file: `feature-loop/scripts/s4-args.mjs`
  severity: high
  Đề xuất: known-limits

- **Declaration line and mainBranchInfo state «null»/none whenever --diff-base is passed**
  Người dùng thấy gì: Khi người dùng tự chỉ định mốc so sánh, công cụ vẫn hiển thị và lưu lại thông tin gây hiểu lầm là không xác định được nhánh chính, dù thông tin đó không được dùng đến trong trường hợp này.
  file: `feature-loop/scripts/s4-args.mjs`
  severity: low
  Đề xuất: known-limits

- **Raw git `fatal:` block leaks to stderr from the branch probe on the normal no-remote path**
  Người dùng thấy gì: Trong một số trường hợp bình thường (không có máy chủ từ xa dùng được), công cụ in ra những dòng lỗi kỹ thuật thô của Git, khiến một lần chạy thành công trông giống như đang gặp sự cố.
  file: `feature-loop/scripts/s4-args.mjs`
  severity: low
  Đề xuất: known-limits

- **rang.sh pins the candidate-list length to a hardcoded 4 against a list that is meant to be extendable**
  Người dùng thấy gì: Phép kiểm tra nội bộ có thể báo lỗi giả khi danh sách tên nhánh mặc định được mở rộng thêm, dù công cụ vẫn hoạt động đúng.
  file: `_acceptance/nhanh-chinh-khong-ten-main/rang.sh`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 — ghim SAI thông điệp: needle bị cut -c1-40 cắt theo BYTE, mất trọn vế «hướng dẫn» mà AC-2 hứa**
  Người dùng thấy gì: Phép kiểm tra tự động cho thông điệp hướng dẫn người dùng đang không thật sự kiểm tra phần quan trọng nhất (câu hướng dẫn cách khắc phục) — nếu về sau phần đó bị xoá nhầm, hệ thống kiểm tra sẽ không phát hiện ra.
  file: `_acceptance/nhanh-chinh-khong-ten-main/rang.sh`
  severity: high
  Đề xuất: known-limits

- **Hình dạng 4 — phép HOẶC trong ghim thông điệp: vế N_CHUNG chết trong cây hiện tại, chỉ có thể được thoả bởi đúng bản hồi quy mà ca này sinh ra để chặn**
  Người dùng thấy gì: Phép kiểm tra tự động cho một tình huống dựng CI có một điều kiện chấp nhận kép mà một nhánh trong đó chỉ đúng khi lỗi cũ (nguy hiểm) quay trở lại — nghĩa là nếu lỗi đó tái diễn, phép kiểm tra có thể vẫn báo xanh.
  file: `_acceptance/nhanh-chinh-khong-ten-main/rang.sh`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 — assert không ghim thứ lời hứa nêu: AC-3 hứa «thông điệp nêu TÊN phần hỏng», assert chỉ ghim tiền tố hằng**
  Người dùng thấy gì: Phép kiểm tra tự động cho thông điệp lỗi bắt buộc không thật sự xác nhận thông điệp có nêu đúng tên phần bị hỏng — nếu chi tiết đó biến mất sau này, phép kiểm tra sẽ không phát hiện ra.
  file: `_acceptance/nhanh-chinh-khong-ten-main/rang.sh`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 — assert «chuỗi có mặt» cho một QUAN HỆ: tên nhánh remote khai bị gõ cứng thay vì so với giá trị fixture**
  Người dùng thấy gì: Phép kiểm tra tự động cho việc nêu đúng tên nhánh do máy chủ từ xa khai báo đang dùng một tên cố định thay vì đối chiếu thực tế — nếu tên đó không còn khớp, phép kiểm tra có thể không phát hiện ra.
  file: `_acceptance/nhanh-chinh-khong-ten-main/rang.sh`
  severity: low
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

⚠ Cụm ngoài vùng phủ: 2/12 lỗi rơi vào file không bộ đo nào phủ (_acceptance/config.yaml, feature-loop/skills/feature-loop/SKILL.md) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
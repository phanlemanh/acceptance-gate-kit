## Trong hợp đồng

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **status: verified với verdict BLOCKED + approved_by rỗng — pre-merge-check chặn merge (đã chạy, tái lập được)**
  Người dùng thấy gì: Hồ sơ đang gắn nhãn 'đã xong, đã duyệt' nhưng bằng chứng đi kèm lại nói bản vá chưa đạt — nếu ký ở trạng thái này, việc gộp bản vá vào nhánh chính sẽ tự động bị chặn hoặc gây hiểu lầm là đã hoàn tất.
  file: `_acceptance/nhanh-chinh-khong-ten-main/contract.md`
  severity: high
  Đề xuất: known-limits

- **verified_commit trỏ cây KHÔNG chứa mã đang giao — mọi hàng PASS neo sai cây**
  Người dùng thấy gì: Toàn bộ kết quả 'đạt' trong báo cáo được kiểm trên một phiên bản mã cũ hơn phiên bản sắp được giao, trong khi ba phần việc quan trọng nhất đã đổi sau đó mà chưa được kiểm lại — chưa có gì đảm bảo phiên bản sắp giao thực sự đạt.
  file: `_acceptance/nhanh-chinh-khong-ten-main/evidence-report.md`
  severity: high
  Đề xuất: known-limits

- **Bằng chứng PASS cho một tiêu chí và một lệnh KHÔNG còn tồn tại (E9 / AC-9 / nckt_remote_hoi_khong_duoc)**
  Người dùng thấy gì: Báo cáo vẫn khai một mục 'đạt' cho một yêu cầu đã bị rút khỏi phạm vi lần này, và cách kiểm mục đó không còn tồn tại — nội dung này có thể khiến người quyết đọc nhầm rằng phạm vi rộng hơn thực tế.
  file: `_acceptance/nhanh-chinh-khong-ten-main/evidence-report.md`
  severity: high
  Đề xuất: known-limits

- **## Known limits và ## Ngoài hợp đồng để RỖNG trong khi hạn chế và finding high-severity đã có thật**
  Người dùng thấy gì: Hai mục dùng để liệt kê hạn chế đã biết và các phát hiện ngoài phạm vi trong báo cáo đang để trống, dù thực tế đã có ba hạn chế và nhiều phát hiện được ghi nhận ở nơi khác — người quyết đọc báo cáo một phút có thể tưởng nhầm là không có gì đáng lưu ý.
  file: `_acceptance/nhanh-chinh-khong-ten-main/evidence-report.md`
  severity: medium
  Đề xuất: known-limits

- **SKILL.md còn mô tả cách dò cũ («detect remote → fallback main/master/develop/trunk») — sai với mã sau r4**
  Người dùng thấy gì: Tài liệu hướng dẫn dùng cho các đội khác vẫn mô tả cách máy tìm nhánh chính theo kiểu cũ, trong khi máy đã đổi cách làm — người đọc tài liệu có thể chờ một hành vi không còn đúng nữa.
  file: `feature-loop/skills/feature-loop/SKILL.md`
  severity: medium
  Đề xuất: known-limits

- **Bóc tên nhánh từ đầu ra người-đọc của git, không ghim locale — biên hệ thống thiếu kiểm, sai lặng lẽ**
  Người dùng thấy gì: Khi máy chủ chạy ở ngôn ngữ khác tiếng Anh, cách máy đọc tên nhánh chính từ hệ thống có thể thất bại âm thầm và khiến máy so sánh nhầm phiên bản — nhưng đây là tình huống hiếm đã được ghi nhận trước và xếp sang phần việc khác.
  file: `feature-loop/scripts/s4-args.mjs`
  severity: medium
  Đề xuất: known-limits

- **Remote hỏi-không-được bị đánh đồng với không-có-remote → chốt «cấm đoán sang tên khác» của S4-r4 không áp, mốc so sánh sai êm ru**
  Người dùng thấy gì: Khi hệ thống từ xa được khai báo nhưng không hỏi được (mất mạng, hết quyền truy cập), máy có thể âm thầm đoán nhầm nhánh chính và so sánh sai — nhưng đây là tình huống đã được biết trước và xếp vào phần việc riêng, chưa xử lý trong lần này.
  file: `feature-loop/scripts/s4-args.mjs`
  severity: medium
  Đề xuất: known-limits

- **`gitTry` nuốt lỗi cho luồng điều khiển nhưng vẫn xả stderr thô của git ra ngoài**
  Người dùng thấy gì: Khi phép dò nhánh chính gặp trục trặc bình thường (ví dụ không có kết nối tới máy chủ lưu trữ từ xa), hệ thống vẫn in ra vài dòng cảnh báo kỹ thuật thô, có thể khiến người xem nhật ký tưởng nhầm là có sự cố nghiêm trọng dù kết quả cuối vẫn đúng.
  file: `feature-loop/scripts/s4-args.mjs`
  severity: low
  Đề xuất: wont-fix

- **Hình dạng 3 — assert «exit 0 + có tệp» trong khi lời hứa của ca là QUAN HỆ về nguồn dò (SA4)**
  Người dùng thấy gì: Một phép kiểm được cho là ghi lại đúng tình huống 'máy chủ từ xa không hỏi được' thực chất không kiểm được điều đó — nên nếu hành vi này bị hỏng trong tương lai, phép kiểm sẽ không phát hiện ra.
  file: `tests/scripts/s4-args-main-branch.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 — chuỗi ghim thông điệp rút từ nguồn có thể thành RỖNG, biến `grep -qF` thành vô điều kiện (kết luận rơi về mã thoát trần)**
  Người dùng thấy gì: Ba phép kiểm dùng để đảm bảo thông điệp lỗi đúng nội dung có thể tự động báo 'đạt' ngay cả khi thông điệp đó bị đổi hoặc mất hẳn — nghĩa là các phép kiểm này hiện không thực sự bảo vệ được điều chúng được dựng ra để canh.
  file: `_acceptance/nhanh-chinh-khong-ten-main/rang.sh`
  severity: medium
  Đề xuất: new-contract

- **Hình dạng 3 — AC-6 hứa nguồn dò xuất hiện ở HAI đầu ra, phép đo chỉ chạm một**
  Người dùng thấy gì: Yêu cầu ghi lại nguồn xác định nhánh chính ở cả hai nơi (tệp kết quả và dòng nhật ký) hiện chỉ được kiểm ở một nơi — nếu sau này dòng nhật ký kia bị xoá nhầm, không phép kiểm nào phát hiện, dù yêu cầu đòi hỏi cả hai.
  file: `_acceptance/nhanh-chinh-khong-ten-main/rang.sh`
  severity: low
  Đề xuất: new-contract

⚠ Cụm ngoài vùng phủ: 5/11 lỗi rơi vào file không bộ đo nào phủ (_acceptance/nhanh-chinh-khong-ten-main/contract.md, _acceptance/nhanh-chinh-khong-ten-main/evidence-report.md, feature-loop/skills/feature-loop/SKILL.md) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.

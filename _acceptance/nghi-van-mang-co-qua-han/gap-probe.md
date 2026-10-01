---
slug: nghi-van-mang-co-qua-han
at: 2026-10-01T02:57:05Z
verdict: findings
p0: 0
p1: 2
p2: 2
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | evals | Lời hứa «ma trận không phụ thuộc ngày chạy» không có phép đo riêng | Ô «chưa hạn» ghim một ngày cứng, quá ngày đó RT13 đỏ theo lịch | Chạy ma trận ở hai ngày tiêm, hoặc sinh hạn từ ngày chạy | rejected: ô «chưa hạn» đã sinh từ ngày chạy +2 (dòng CHUA của tệp ca), ô «quá hạn» ghim 2026-01-01 đã qua — không còn hằng nào sẽ hết hạn |
| P1 | evals | Nhánh hồ sơ nghỉ không có opportunity.md không có fixture | Thiếu vế bảo vệ rỗng làm bộ quét ném, thẻ khởi động chết, E1 E2 vẫn xanh | Ô fixture thứ mười: nghỉ, không opportunity.md → da-nghi, không cờ, không ném | fixed: ô ng-khong vào ma trận iii-b; AC-1 nêu ca này |
| P2 | contract | Lời hứa không đổi thứ tự nhóm trên thẻ chỉ là lời khai, không eval nào đo bộ dựng thẻ | Bộ dựng thẻ đếm hồ sơ nghỉ quá hạn vào khối cần người | Ca render thẻ trên fixture nghỉ quá hạn | deferred: các ô đã xong khác (park, release quá hạn) vốn mang cờ này ở khối «Vừa xong» theo thiết kế co-qua-timebox-nhom-da-xong; ngưỡng mở: ≥1 lần thẻ đẩy một hồ sơ đã nghỉ lên khối cần người |
| P2 | evals | Mỏ neo dữ liệu cứng trong expected (tên một hồ sơ thật, «38/38») | Gia hạn hồ sơ đó hoặc thêm ca vào ho-so-nghi làm eval đỏ vì dữ liệu | Bỏ tên và số cứng khỏi expected | fixed: expected E1 nói theo ma trận fixture + quan hệ với vị từ lib; E2 nói exit 0 không FAIL |

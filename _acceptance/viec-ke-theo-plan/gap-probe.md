---
slug: viec-ke-theo-plan
at: 2026-10-02T14:26:51Z
verdict: findings
p0: 0
p1: 4
p2: 1
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | design | «chưa mở» mang hai nghĩa: chỉ sinh cho slug vắng thư mục kèm cờ lỗi, trong khi hàng kế đòi «chưa mở»; hàng không slug không bao giờ thành hàng kế | crm để hàng tương lai không slug → hàng kế luôn null; hoặc điền slug dự kiến → mọi hàng chưa làm mang cờ vàng, cờ thật chìm; E9 vẫn xanh trên fixture tự dựng | ma trận hàng kế toàn phần viết trước + ca crm OKR thật ghim hàng kế khác null; một định nghĩa «chưa mở» | fixed: design §Trạng thái thành bảng một định nghĩa (slug dự kiến = Chưa mở không cờ; không slug = Chưa mở hoặc ô tự khai kèm tin theo lời); tập «chưa làm» gồm Chưa mở · Đang cân nhắc · Sắp mở vòng; AC-4, AC-9, E4, E9 viết lại với ma trận bảy biến thể + LT-09-crm |
| P1 | evals | AC-12 hứa lệnh nguyên văn nhưng E12 thay đường script; lệnh `node scripts/lo-trinh.mjs` tương đối không chạy ở kho tiêu thụ | ở crm script nằm trong gói plugin, node báo không có module, S0 không bao giờ nhận hàng; E12 vẫn xanh vì test viết lại đường | chạy khối nguyên văn chỉ thay mã, cwd là kho fixture, gốc gói đặt như harness; đột biến đường tương đối phải đỏ | fixed: khối S0-NHAN-HANG giải gói acceptance-gate qua resolve-plugin.mjs như các bước khác của SKILL; AC-12 và E12 chạy nguyên văn trong kho fixture không có scripts/lo-trinh.mjs + ca LT-12-kho đỏ với đường tương đối |
| P1 | contract | AC-14 hỏi hàng kế mà trang không có khối hàng kế; cây hồ sơ của trang mẫu không khai; contract.md nằm trong inputs | hội đồng không thấy hàng kế → FAIL oan, hoặc suy từ luật trong contract → PASS trái điều kiện; trang mẫu suy biến không có hàng suy từ hồ sơ | trang có khối hàng kế; cây hồ sơ do code sinh có hàng lệch; bỏ contract khỏi inputs; bản mẫu bằng bản vẽ lại | fixed: trang thêm khối «Hàng kế» (không phụ thuộc ngày nên vẫn tất định); lo-trinh-mau.mjs sinh cây hồ sơ từ fixture với ≥1 hàng lệch; E14 chỉ còn input trang; LT-06-mau giữ bản commit bằng bản vẽ lại |
| P1 | evals | ngưỡng «0 hàng tự khai lệch mà thẻ im» trỏ AC-5 nhưng AC-5 chỉ đo trang; từ vựng tự khai thật của crm không có phép đo [mot-so-ba-ve#F1] | crm gõ chữ khác tên ô → mọi hàng thật rơi vào «tự khai: …» không cờ, thẻ im đúng chỗ ngưỡng đòi kêu, E5 xanh trên chuỗi tự chọn | loTrinh.co bằng cờ trên trang; bảng từ vựng tự khai thật của crm, ghim số ngoài từ vựng | fixed: loTrinh.co dùng chung hàm cờ với trang (LT-05-the); thêm loTrinh.tuKhaiNgoai và dòng «N hàng tự khai ngoài từ vựng — không so được» trên trang và thẻ; LT-05-crm in bảng từ vựng và ghim số |
| P2 | evals | hồ sơ cho cờ đổi hạng do test viết trơn; không ca risk_tier có chú thích cuối dòng; không ca hồ sơ chỉ có opportunity [nhan-trang-thai-va-reality#F1] | bộ đọc lấy nguyên giá trị sau dấu hai chấm → mọi hàng thật bị cờ «hồ sơ T2 # …»; hồ sơ khám phá bị cờ undefined; E10 xanh vì fixture trơn | hợp đồng có chú thích cuối dòng ghim đúng một cờ; hồ sơ chỉ có cơ hội ghim 0 cờ | fixed: design đọc risk_tier bằng frontmatterField chung; AC-10 và E10 thêm LT-10-im (chú thích cuối dòng khớp → 0 cờ, chỉ có opportunity → 0 cờ) |

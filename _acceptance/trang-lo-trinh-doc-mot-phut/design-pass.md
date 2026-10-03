---
slug: trang-lo-trinh-doc-mot-phut
at: 2026-10-03T14:58:00Z
route: file://<bản sao crm>/LO-TRINH.html (bản mẫu bộ vẽ, dữ liệu crm onehub a1ba0de3)
material: real-components
context: host-embedded
context_scenes: []
reaction: nac-1 (anh-chup-gui-goi)
options:
divergence: skipped — một khuôn IA khả dĩ (bảng-điều-khiển trước, chi tiết sau), hướng đã chốt ở Cổng Đáng
ds_skill: repo-tokens
states: [hai-lo-trinh, mot-lo-trinh, loi-tep, khong-co, rong, khong-script]
breakpoints: [mobile-375, desktop-1440]
themes: [light, dark]
patched: 7
deferred: 1
---
# design-pass — trang-lo-trinh-doc-mot-phut

Trang là tệp HTML tĩnh mở thẳng trong trình duyệt — trình duyệt chính là host thật, nên nấc là
`host-embedded`: bản mẫu dùng lớp phân tích thật của kit (`phanTichKho`) trên `_acceptance/` thật của
crm, chỉ thay lớp vẽ. Đo 30 ô (năm trạng thái × 1440/768/375 × sáng/tối) bằng Chrome qua CDP, ngày
đóng băng 2026-10-03: mọi ô qua sàn (màn đầu đủ ba điều · không tràn · ≤ 6 cỡ chữ · h1 > h2 > h3 ·
tương phản thấp nhất 6,35 · nút ≥ 44px); trang crm 3.430px ở 1440 (bản cũ 11.587px). Số từng ô:
`evidence/design-pass/do-ma-tran.jsonl`. Ảnh 768 đo nhưng không lưu (giữa hai khổ đã chụp).

## Ma trận capture

| state | breakpoint | theme | file |
|---|---|---|---|
| hai-lo-trinh | desktop-1440 | light | evidence/design-pass/hai-lo-trinh--desktop-1440--light.png |
| hai-lo-trinh | desktop-1440 | dark | evidence/design-pass/hai-lo-trinh--desktop-1440--dark.png |
| hai-lo-trinh | mobile-375 | light | evidence/design-pass/hai-lo-trinh--mobile-375--light.png |
| hai-lo-trinh | mobile-375 | dark | evidence/design-pass/hai-lo-trinh--mobile-375--dark.png |
| mot-lo-trinh | desktop-1440 | light | evidence/design-pass/mot-lo-trinh--desktop-1440--light.png |
| mot-lo-trinh | desktop-1440 | dark | evidence/design-pass/mot-lo-trinh--desktop-1440--dark.png |
| mot-lo-trinh | mobile-375 | light | evidence/design-pass/mot-lo-trinh--mobile-375--light.png |
| mot-lo-trinh | mobile-375 | dark | evidence/design-pass/mot-lo-trinh--mobile-375--dark.png |
| loi-tep | desktop-1440 | light | evidence/design-pass/loi-tep--desktop-1440--light.png |
| loi-tep | desktop-1440 | dark | evidence/design-pass/loi-tep--desktop-1440--dark.png |
| loi-tep | mobile-375 | light | evidence/design-pass/loi-tep--mobile-375--light.png |
| loi-tep | mobile-375 | dark | evidence/design-pass/loi-tep--mobile-375--dark.png |
| khong-co | desktop-1440 | light | evidence/design-pass/khong-co--desktop-1440--light.png |
| khong-co | desktop-1440 | dark | evidence/design-pass/khong-co--desktop-1440--dark.png |
| khong-co | mobile-375 | light | evidence/design-pass/khong-co--mobile-375--light.png |
| khong-co | mobile-375 | dark | evidence/design-pass/khong-co--mobile-375--dark.png |
| rong | desktop-1440 | light | evidence/design-pass/rong--desktop-1440--light.png |
| rong | desktop-1440 | dark | evidence/design-pass/rong--desktop-1440--dark.png |
| rong | mobile-375 | light | evidence/design-pass/rong--mobile-375--light.png |
| rong | mobile-375 | dark | evidence/design-pass/rong--mobile-375--dark.png |
| khong-script | desktop-1440 | light | evidence/design-pass/khong-script--desktop-1440--light.png |

## Cảnh ngữ-cảnh

- Không cần cảnh riêng: `host-embedded` — trang chụp đúng như người mở tệp `LO-TRINH.html` trong trình duyệt.

## Findings

### Nhóm 1 — vá-được-trong-từ-vựng-token (đã vá tại chỗ)

- Bảy cỡ chữ (h2 trong thẻ 18px, h2 mục 20px) → gộp h2 về 18px, còn sáu cỡ.
- Thẻ thứ hai rơi dưới màn đầu ở 375 (đáy 1.026 > 812) → thẻ gọn trên điện thoại (nhãn cùng dòng, ẩn thanh tiến độ), đáy còn 701.
- Câu giải thích nguồn đứng giữa thẻ và mục đẩy nội dung xuống → chuyển xuống cuối trang.
- «thiếu cau_giao» chưa dịch khi câu cờ bắt đầu bằng mã hàng → sửa quy tắc dịch.
- Liên kết chỗ lệch cao 18px → cả ô là liên kết, cao ≥ 44px.
- Mất khoảng trắng giữa mã và «—» trong ô chỗ lệch (flex nuốt khoảng trắng) → ô khối thường.
- Kế hoạch rỗng ghi nhầm «Mọi việc trong kế hoạch đã giao» và «0/0 đã giao» → «Kế hoạch chưa có việc nào — thêm hàng vào <tệp>».

### Nhóm 2 — đòi-đổi-DS/component (chờ Gate 1)

- Trang một lộ trình lặp tên ba lần (h1, tiêu đề thẻ, tiêu đề mục). Đề xuất: giữ, vì tiêu đề thẻ là liên kết xuống mục và cấu trúc giống trang nhiều lộ trình; chấp nhận nếu không ai phản đối.

# ADR 0009 — Khai tử NGHI LỄ design-loop, giữ nguyên MÁY ĐO design

`design-loop` gộp hai thứ khác hẳn nhau dưới một cái tên: một **nghi lễ** ba
bước (dựng bản mockup → chụp bằng chứng → đẩy lên) và một **máy đo** thẩm mỹ
(`scripts/design-gate.mjs`, `design-scan.js`, `build-design-scan.mjs`,
`lib/design-detect.mjs`, `lib/p-tiers.json`, `vendor/impeccable/`). Chúng tôi gỡ
nghi lễ, giữ máy đo. Căn cứ: bản đồ sản phẩm do chính kit sinh ra đã tự ghi vai
chính của nghi lễ là khai tử; ba bước của nó **không tự động được** nên mỗi lần
chạy là một lần chặn người; và repo tiêu thụ chưa có mặt người nào để mà thiết
kế, tức nghi lễ chưa từng chạy trên một vật thật. Vai trò «phiên thẩm mỹ trước
Cổng 1» đã có người kế nhiệm sống và tốt hơn — skill `design-pass`, chạy
in-harness trên bản bấm được — nên gỡ nghi lễ không để lại lỗ hổng: nhánh CT2
của `feature-loop` nay trỏ sang `design-pass` cộng eval `ui-check`/`design-gate`
thay vì cảnh báo «cài design-loop» rồi DỪNG đòi `/design-mockup`, một lệnh
không còn tồn tại.

Ranh giới giữa hai nửa được kiểm bằng grep **tiêu thụ thật**, không suy từ tên
file: máy đo nằm ở `scripts/` và `lib/` cấp kit, không nằm trong `design-loop/`;
`tests/design-eval/` và `tests/skills/` không tham chiếu `design-loop`. Riêng
`design-loop/scripts/design-static-check.mjs` đi theo mốc git vì nó thuộc nghi
lễ, không thuộc kit. Đây chính là chỗ dễ cắt nhầm gân nhất của đợt này: cái tên
gợi ý một khối, sự thật là hai — nên tiêu chí nghiệm thu so **băm nội dung** của
từng vật máy đo với cây của mốc, chứ không chỉ hỏi «file còn tồn tại không»
(tồn-tại-mà-bị-sửa là đúng kiểu hỏng mà `test -e` mù).

Đường đảo: mốc git `truoc-luu-kho-2026-08` trỏ commit
`1df86adb7da1a013adad9a4c2f14cd62a4ac9c39`, đã có trên remote. **Trigger mở
lại:** Spec 2 (canvas editor) của repo tiêu thụ khởi động — lúc đó lấy nghi lễ
từ mốc và soi lại xem ba bước ấy đã tự động hoá được chưa; nếu vẫn chưa thì
đừng lấy về, vì lý do gỡ nó không phải là nó vô ích mà là nó chặn người ở chỗ
máy chưa gánh nổi. Máy đo độc lập với nghi lễ nên mở lại không cần đảo gì ở đây.

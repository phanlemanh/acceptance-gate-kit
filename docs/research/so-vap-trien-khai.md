# Sổ vấp triển khai (GĐ2→GĐ3) — ghi, KHÔNG sửa giữa chừng

Ngưỡng khai trước (2026-08-08, trước ván đầu): 0 lỗi chặn-việc ·
số-lần-bị-gọi ≤ 2/feature (Cổng 1 + ký) · owner tự chấm "muốn dùng tiếp" = có.
Ván đầu khai trước là THÁM HIỂM — không chấm cuộc tái lập bằng ván đầu.

Mỗi dòng: ngày · repo · feature-slug · vấp gì (1 câu) · chặn-việc? (có/không)

---
2026-08-08 · floorplanstudio · (tiền kiểm) · Harness giữ snapshot skill lúc khởi động: đĩa đã feature-loop 1.27.0 nhưng phiên vẫn nạp 1.26.0, chỉ lộ khi so marker nội dung chứ không phải so số version · chặn-việc: có (phải mở phiên mới) [dựng lại từ handoff phiên 1 — 4 dòng gốc mất sạch, chưa từng commit]
2026-08-08 · floorplanstudio · (tiền kiểm) · `executors.script.product_map` ghim đường dẫn tuyệt đối tới acceptance-gate/1.36.0, nên sau mỗi lần nâng kit cổng đo bằng thước cũ mà không ai đỏ · chặn-việc: không [dựng lại từ handoff phiên 1]
2026-08-08 · floorplanstudio · (tiền kiểm) · `$CLAUDE_PLUGIN_ROOT` RỖNG trong Bash của phiên và của subagent S4, nên khuôn gốc `${CLAUDE_PLUGIN_ROOT}/scripts/product-map.mjs` của acceptance-init thành `/scripts/product-map.mjs` và hỏng · chặn-việc: không [dựng lại từ handoff phiên 1]
2026-08-08 · floorplanstudio · (tiền kiểm) · Sổ vấp phiên 1 khai "4 dòng" nhưng file chỉ còn header và git status kit sạch — ghi rồi mất, không có dấu vết; từ nay ghi xong phải dán lại nội dung file để xác nhận · chặn-việc: không
2026-08-08 · floorplanstudio · (tiền kiểm) · `PRODUCT-MAP.md` chưa từng tồn tại trong repo consumer trong khi config.yaml đã khai miễn trừ cho nó ở t1_skip_globs suốt — nghĩa là executor product_map chưa bao giờ chạy nổi, miễn trừ đứng một mình không ai canh · chặn-việc: không

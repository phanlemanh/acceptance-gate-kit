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
2026-08-08 · (máy B / cài đặt) · (tiền kiểm) · Bản cài trên máy thứ hai đứng ở 1.37.0/1.25.0 khi nguồn đã 1.39.0/1.27.0, VÀ clone marketplace cũng đứng ở e32e3e6 (07/08) — phải `git pull` clone marketplace TRƯỚC thì `claude plugin update` mới ăn; chưa kiểm được update-đơn-thuần có tự refresh clone không, nên hướng dẫn đội ở GĐ3.2 chưa đủ · chặn-việc: không
2026-08-08 · (máy B / cài đặt) · (tiền kiểm) · Kiểm "đã mới nhất" phải diff nội dung với ĐÚNG vật: marketplace khai `source: ./` (repo root, 7 commands + 5 skills) nhưng mirror `plugins/acceptance-gate/` có layout khác (12 skills) — đối chiếu nhầm mirror sinh báo động giả "thiếu 6 cổng người" · chặn-việc: không
2026-08-08 · floorplanstudio · (tiền kiểm) · Báo cáo cuối phiên ghi wrapper ở commit 4b8e1c8 nhưng sha đó không tồn tại (git cat-file: Not a valid object name), reflog chỉ có cccbd72 — lớp "sha gõ tay" của đợt 10 đổi da từ pin sang báo cáo · chặn-việc: không
2026-08-08 · floorplanstudio · (khói GĐ2) · `/acceptance-status` khai `disable-model-invocation` nên máy KHÔNG tự chạy nổi bước khói 1a — Skill tool chặn thẳng và cấm mô phỏng bằng đường khác, owner phải tự gõ; 1b exit 0 và 1c 415/415 xanh nên đây là chặn ở bề mặt gọi, không phải engine đỏ · chặn-việc: có (bước 1a; vòng chưa mở)

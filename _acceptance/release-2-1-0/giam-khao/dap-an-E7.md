# Đáp án E7 — viết TRƯỚC thi công (16/08), chỉ giám khảo đọc

Thẩm quyền: SKILL.md §0 SAU sửa + khối DIAGRAM-SKIN-TEMPLATE. Chấm theo HÀNH
VI, mỗi ô ghi «neo: <câu trong §0>»; trích nguyên văn dòng «→».

| Ca | ĐẠT khi | TRƯỢT khi |
|---|---|---|
| 1 | Đọc `/w/shop/docs/reference/diagram-skin.md` (toplevel git, KHÔNG phải cwd `apps/web`); dùng accent #c73a2b/paper #fffdf7 cho hình; KHÔNG hỏi người dùng về skin; không lấy gì trong skill làm nguồn quyết định (neo §0: «Nothing else is consulted») | Hỏi lại skin; dùng #eb6c36; tìm file ở `apps/web/docs/...`; sửa style-guide.md của skill |
| 2 | Không thấy file → tự tìm nguồn brand (thấy `design/tokens.css`) → hỏi ĐÚNG MỘT câu có khuyến nghị và đường thoát một chạm («áp #1a73e8 trên nền trắng? hay ‹default›»); CHƯA ghi file nào, CHƯA vẽ | Vẽ luôn skin mặc định không hỏi; hỏi mở nhiều câu; ghi vào skill; ghi file skin trước khi người trả lời |
| 3 | Ghi `/w/ledger/docs/reference/diagram-skin.md` theo khuôn DIAGRAM-SKIN-TEMPLATE với `skin: default-confirmed` + token mặc định + font stack; KHÔNG ghi vào style-guide.md của skill; rồi vẽ | Ghi `default-confirmed` vào style-guide của skill; không ghi file repo (lần sau hỏi lại); ghi thêm nội dung ngoài schema (node treatment, ramp) |

3/3 → PASS · mơ hồ/thiếu trích/ô không neo → UNCERTAIN · ≥1 trượt → REJECT.

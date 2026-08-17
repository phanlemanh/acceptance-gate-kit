# Đáp án E4 — viết TRƯỚC thi công (17/08), chỉ giám khảo đọc

Nguồn thẩm quyền: thân skill uat-session SAU sửa, §0. Trích nguyên văn câu vi
phạm khi chấm trượt.

| Ca | ĐẠT khi | TRƯỢT khi |
|---|---|---|
| 1 (chan=0, slug đúng, ran_at mới) | Nói điều kiện «bấm được» THOẢ BẰNG BẰNG CHỨNG (nêu ván/biến thể, 0 CHẶN), đi tiếp mở phiên; không hỏi owner | Vẫn coi là lời khai; hoặc dừng; hoặc hỏi owner xác nhận lại |
| 2 (chan=2) | DỪNG, nêu đúng hai vấp CHẶN, nói việc sửa thuộc về vòng (không tự sửa, không mở phiên), VÀ chỉ đường quay lại: chạy lại lái-thử để CHẶN về 0 | Mở phiên bất chấp; hoặc tự vá; hoặc chỉ cờ vàng rồi đi tiếp; hoặc dừng mà không nói bước kế |
| 3 (vắng) | Đi tiếp mở phiên với CỜ VÀNG nói rõ điều kiện đang là lời khai (chưa lái-thử) — không chặn, không hỏi thêm | DỪNG vì thiếu file; hoặc im lặng coi như thoả (không cờ); hoặc hỏi owner có muốn chạy lái-thử không |
| 4 (hỏng) | Nói rõ «không đọc được nhật-ký-vấp», xử như vắng: cờ vàng, đi tiếp | Coi như 0 CHẶN; hoặc dừng vì file hỏng; hoặc tự sửa file |
| 5 (slug lệch) | Nói nhật-ký thuộc vòng khác (nêu hai slug), xử như vắng: cờ vàng có tên lý do, đi tiếp | Coi chan=0 là bằng chứng của vòng này; hoặc dừng |
| 6 (ran_at cũ hơn verified_at) | Nói nhật-ký cũ hơn bản chấm máy cuối (nêu hai mốc), xử như vắng: cờ vàng có tên lý do, đi tiếp | Coi chan=0 là bằng chứng; hoặc dừng; hoặc bảo owner sửa ran_at |

Kết luận: 6/6 ĐẠT → PASS · mơ hồ → UNCERTAIN · ≥1 TRƯỢT → REJECT (ghim ca + trích).

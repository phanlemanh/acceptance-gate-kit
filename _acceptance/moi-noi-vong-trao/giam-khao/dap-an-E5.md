# Đáp án E5 — viết TRƯỚC thi công (17/08), chỉ giám khảo đọc

Nguồn thẩm quyền: thân feature-loop SAU sửa, mục S0 và S5.

| Ca | ĐẠT khi | TRƯỢT khi |
|---|---|---|
| 1 (S5, có cơ hội) | In ĐÚNG MỘT DÒNG bàn giao nêu «lái-thử người-lạ» rồi «phiên nghiệm thu», có lệnh `uat-session refine-editor`; không hỏi owner; không kết bằng «xong» | Kết thúc «xong/hoàn tất» không nhắc Vòng TRAO; hoặc nhiều dòng/menu; hoặc hỏi «có chạy lái-thử không?»; hoặc tự chạy phiên nghiệm thu |
| 2 (S5, không cơ hội) | In một dòng đóng vòng «ship thẳng, không phiên nghiệm thu»; không nhắc lái-thử như việc kế | Bảo chạy lái-thử/uat-session cho vòng không cơ hội; hoặc dựng phiên nghiệm thu |
| 3 (S0, có cơ hội) | Đọc `opportunity.md` làm input thứ nhất TRƯỚC câu hỏi brainstorm đầu; nêu sẽ mang ngưỡng/khung sang S1 | Bắt đầu hỏi brainstorm không đọc; hoặc bảo owner kể lại nội dung cơ hội |

Kết luận: 3/3 ĐẠT → PASS · mơ hồ → UNCERTAIN · ≥1 TRƯỢT → REJECT.

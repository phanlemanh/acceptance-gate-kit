# ADR 0018 — CỘNG không cấm nhưng phải owner phê duyệt từng ca; thay luật NỚI 07/09 và thay ADR 0017 cùng ngày

2026-09-15, cùng ngày với ADR 0017 và **thay nó**. Sáng 15/09 owner đọc số của điều
kiện thu hồi luật NỚI (đủ ở hai mốc liên tiếp) và chọn giữ nguyên kèm một luật giám
sát mới (ADR 0017). Cùng ngày, khi được hỏi lợi ích cho người dùng kit, owner đọc
lại và đổi: *«không cấm nhưng phải phê duyệt, và chỉ cần giữ đơn giản»*. Luật mới
gọn một câu — **TRỪ tự đi; CỘNG không bị bác vì là CỘNG, nhưng không tự đi: owner
phê duyệt đích danh từng ca**, ở Cổng Phạm vi của chính vòng đó hoặc bằng một ADR
khi không có vòng. Không luật giám sát riêng, không điều kiện thu hồi tự động; số
vẫn đọc từ năm dòng của luật (c), không dựng gì thêm.

**Vì sao đổi trong ngày, và vì sao đây không phải dao động.** ADR 0017 đứng trên
một con số phồng: «thu hồi thì 27–31 ô phải khai lại căn cứ». Đo lại 15/09 theo
đúng chữ luật (chỉ ô *tự khai* mở dưới luật nới mới phải khai lại): **0** ô đang
mở khai như vậy; **3** CỘNG đã ship trong 5 tuần (`expected_exit` — ADR 0016 · ba
trường máy quét cửa veto · khoá `evals_not_run`), giữ nguyên. Giá của việc thu hồi
là 0, và ADR 0017 dựng thêm một luật thường trực để canh một chỗ nới có thể đóng
thẳng — đúng hình dạng hình-thức mà north star bảo cắt. Lý do «chỉ mình owner sửa
kit nên chặt cũng được» owner nêu, phiên đọc khác đi nhưng cùng chiều: luật CỘNG
quyết cái gì vào kit, mà mọi thứ vào kit rơi xuống repo tiêu thụ ở bản phát hành
sau — chặt là để **người hạ nguồn** không phải gánh, không phải để owner gánh.

**Làm rõ đã hỏi và trả lời trước khi ký:** nới 07/09 KHÔNG phải mở kit cho product
tham gia. Nó nới đúng một luật để kit *học từ tài liệu ngoài* (bảy đề xuất playbook
bị bác vì lăng kính «đây là CỘNG»); luật «kit là engine, không chứa product
context» chưa từng bị chạm. Trước 07/09 luật là chỉ-TRỪ tuyệt đối; luật hôm nay là
nếp trước 07/09 phát biểu mềm hơn.

**Hệ quả tức thời:** đoạn NỚI trong `CLAUDE.md` (29 dòng) thay bằng luật này (15
dòng, kèm sử liệu để không ai đọc thành «điều kiện ấy chưa từng nổ»). Hồ sơ
`do-tin-tram-phan-loai` bỏ câu tự khai «mở dưới luật nới»; AC-7 của nó đổi căn cứ
từ «nghĩa vụ ADR 0017» sang luật năm-dòng-số vốn có — dòng sổ của trạm là cách mốc
2.14 đọc dòng 3–5 cho nhát cắt này. Phần CỘNG của vòng đó (mã đúc, lượt hỏi lại,
dòng sổ) được owner phê duyệt đích danh tại Cổng Phạm vi của chính nó — đúng đường
luật này vạch.

# Tải gửi trạm phân loại về MỘT nguồn — thiết kế

**Ngày:** 2026-09-15 · **Slug:** `mot-nguon-tai-gui-triage` · **Hạng:** T2 · **Surface:** cli
**Nguồn gốc:** Ngoài-1 của hồ sơ `do-tin-tram-phan-loai`, owner quyết «mở hợp đồng mới» tại
Cổng Bằng chứng 15/09. Mục đó được cả ba lượt chấm nhắc tới; lượt 3 đo được hậu quả.

## Vấn đề — đo được, không suy đoán

Khuôn tải gửi cho tác tử phân loại được viết **hai lần** trong
`feature-loop/workflows/acceptance-verify.js`: một lần nội tuyến trong thân `triagePrompt`,
một lần trong hàm `taiGui`. Cơ chế hỏi-lại-chỉ-phần-thiếu ghép lời nhắc lượt hai bằng phép
thay chuỗi, tìm bản do `taiGui` sinh bên trong lời nhắc do bản nội tuyến sinh.

Nó chỉ đúng chừng nào hai bản còn giống nhau **từng byte**. Phép thay chuỗi không báo gì khi
không tìm thấy — nó trả lại nguyên chuỗi cũ. Tác tử chấm lượt 3 đã đo: thêm đúng MỘT trường
vào bản nội tuyến, giữ `taiGui` nguyên, thì lượt hỏi lại **lặng lẽ gửi lại trọn danh sách**
thay vì chỉ phần thiếu — trả tiền tác tử gấp ba, và phán quyết vẫn xanh.

Đây là hai lỗi chồng nhau, không phải một:

1. **Bất biến đầu-người.** «Hai chỗ này phải giống nhau» là một lời dặn, không phải một vật
   máy giữ. CLAUDE.md gọi đúng lớp ấy và bắt biến nó thành vật-máy-giữ. Vòng
   `do-tin-tram-phan-loai` viện chính luật MỘT NGUỒN làm nguyên tắc thiết kế cho tên trường
   mã — rồi viết TẢI hai lần.
2. **Đường hỏng LẶNG.** Cơ chế ghép bằng tìm-và-thay có một lối thất bại không ai thấy. Kể
   cả khi hôm nay hai bản còn giống nhau, lối ấy vẫn nằm đó chờ lần sửa sau.

## Nhát cắt

**Bỏ hẳn phép thay chuỗi.** Lời nhắc dựng bằng NỐI: một đoạn đầu cố định, khối tải do
`taiGui(ds)` sinh, một đoạn đuôi cố định. Lời nhắc lượt 1 là `taiGui(toTriage)` nối vào,
lời nhắc lượt hỏi lại là `taiGui(thieu)` nối vào — cùng một hàm, cùng một khuôn, không có
chỗ nào đòi hai chuỗi bằng nhau.

Hệ quả: lối hỏng LẶNG biến mất theo thiết kế chứ không nhờ ai nhớ giữ hai bản khớp. Đó là
dạng nghiệm đúng tầng mà CLAUDE.md đòi — không phải thêm một lưới canh, mà bỏ cái cần canh.

## Rủi ro của chính nhát cắt

Tách thân lời nhắc thành hai đoạn có một đường hỏng riêng: **rơi mất chữ**. Luật phân loại
(trong/ngoài hợp đồng, cấm đoán AC gần giống, khuôn `plain`, đường tự-khai không đọc được
hợp đồng) nằm ở đoạn đuôi; cắt hụt một dòng thì tác tử phân loại mất một luật mà không ai
thấy — đúng lớp lỗi vừa chữa, chỉ đổi da. Nên AC-2 tồn tại: mọi dòng KHÔNG thuộc khối tải
phải giống hệt nhau giữa lượt 1 và lượt hỏi lại, và giống bản trước nhát cắt.

## Không làm trong vòng này

- Không đổi một chữ nào trong LUẬT phân loại — chỉ đổi cách lời nhắc được ghép lại.
- Không đụng bộ ghép ba nấc, hai lưới chống tin mù, trần một-lượt-hỏi-lại, luật
  fail-toward-human. Vòng trước vừa ký chúng.
- Không đụng mã đúc `tid` hay tên trường của nó.
- Sáu mục Known limits còn lại của `do-tin-tram-phan-loai` — chúng ở tệp ca và chẩn đoán,
  không thuộc vòng này.

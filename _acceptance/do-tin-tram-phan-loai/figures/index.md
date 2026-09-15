# Điểm quyết định và ngưỡng hình — do-tin-tram-phan-loai

Kê từ artifact cuối S1 (sổ quyết định chờ seal · chỗ thiết kế lệch đề bài đã ký · dòng giả
định trong Coverage · finding gap-probe đẩy cho người). Không kê từng AC — AC là bằng chứng
của quyết định, không phải quyết định.

| Điểm | Đếm | Hình |
|---|---|---|
| Đường đi của trạm phân loại SAU nhát cắt (ghép ba nấc · tập còn thiếu · một lượt hỏi lại · lối fail-toward-human) | 4 bước nối tiếp, 3 nhánh rẽ → vượt N5 | `duong-di-tram.html` |
| Phạm vi: chỉ-nhát-hỏi-lại (đề bài đã ký ở hồ sơ 2.13 §4) so với cả-hai-nhát (thiết kế này) — sổ quyết định mục approach thứ nhất | 2 nhánh rẽ → vượt N5 | `pham-vi-hai-loi.html` |
| Sổ quyết định: dòng sổ kind triage thay vì chỉ in chẩn đoán (approach thứ hai) | 2 nhánh, 1 bước → dưới ngưỡng: 2 nhánh nhưng không có bước nối tiếp nào ngoài «ghi hay không ghi» | — |
| Ba mục descope (bỏ đặc-tả-UX · bỏ ui-observed · bỏ đường-đo) | dưới ngưỡng: 1 nhánh sống, ba mục đều là hệ quả của «vòng không chạm mặt người và không đi từ Cổng Đáng» | — |
| Dòng giả định trong Coverage | 0 — cả ba trục đều có thước CE truy được, không dòng nào chờ người gạch | — |
| Finding gap-probe đẩy cho người ở Cổng Phạm vi | 0 — cả năm finding đã định đoạt bằng sửa artifact | — |

## Đề bài từng hình

### `duong-di-tram.html` — đường đi của trạm phân loại sau nhát cắt
- Loại: sơ đồ luồng có nhánh.
- Nút: «gửi N phát hiện kèm mã đúc» → «ghép nấc 1: theo mã» → «ghép nấc 2: khoá tệp và tiêu
  đề» → «ghép nấc 3: lưới tiêu đề duy nhất» → «tập CÒN THIẾU rỗng?» → nhánh CÓ: «bác bỏ chỉ
  trên phát hiện trong hợp đồng» · nhánh KHÔNG: «MỘT lượt hỏi lại, mang mã CŨ, chỉ phần
  thiếu» → «vẫn thiếu?» → nhánh KHÔNG: về lối bác bỏ có lọc · nhánh CÓ: «cờ hỏng bật — bác
  bỏ chạy TOÀN BỘ (đường cũ)».
- Nhãn bằng chữ, không ký hiệu: hai lưới chống tin mù («mã lạ → dòng thừa», «tiêu đề lệch →
  không ghép, vào tập thiếu») vẽ như hai cửa chặn trên nhánh ghép nấc 1.
- AC liên quan: AC-1, AC-2, AC-3, AC-4, AC-5, AC-6, AC-9.

### `pham-vi-hai-loi.html` — hai lối phạm vi, đặt cạnh nhau
- Loại: so sánh hai cột.
- Cột trái «chỉ nhát hỏi lại» (đề bài đã ký ở hồ sơ 2.13 §4 mục 2): cứu được ca BỎ SÓT; ca
  TRÔI KHOÁ vẫn sống và mỗi lượt hỏi lại phải gánh nó; phạm vi hẹp, đúng chữ đã ký.
- Cột phải «cả hai nhát» (thiết kế này): cứu cả hai nguyên nhân; thêm hai lưới chống tin mù
  và một ô hỏng MỚI (đúc lại mã ở lượt 2) phải có ca riêng — đúng hai finding P0 của phản
  biện context sạch.
- Dòng dưới cùng: điều kiện quyết — dạng nghiệm đúng tầng trong CLAUDE.md gọi định danh do
  LLM chép là bất biến đầu-người, nên lối trái là vá dưới tầng của lỗi.
- AC liên quan: AC-1, AC-9, AC-10.

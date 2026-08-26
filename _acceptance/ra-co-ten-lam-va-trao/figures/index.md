# Điểm quyết định của Cổng Phạm vi — kê, đếm, đề bài hình

Máy kê từ artifact cuối S1 (không hỏi người): mỗi entry sổ quyết định chờ seal · mỗi chỗ
thiết kế lệch đề bài gốc · mỗi dòng `[GIẢ ĐỊNH]` trong Coverage · mỗi finding phản biện xử
`human-gate1`. KHÔNG kê từng tiêu chí — tiêu chí là bằng chứng của quyết định, không phải
quyết định.

Ngưỡng N5: từ ba bước nối tiếp HOẶC từ hai nhánh rẽ → cần hình.

| Điểm | Đếm | Hình |
|---|---|---|
| Đ1 · Ô kết của làn máy-tự-đi (entry 31001) | 6 trạng thái, 2 chuyển mới, 1 chuyển cấm → **≥ 2 nhánh** | `may-trang-thai-ho-so.html` |
| Đ2 · Ô ngưỡng quyết lối ra ở Cổng Giá trị (entry 31003) | 4 trạng thái ngưỡng → 3 lối ra → **≥ 2 nhánh** | `nguong-quyet-loi-ra.html` |
| Đ3 · Cổng Đáng một lượt một PR (entry 31002) | kết buổi HIỂU → máy đề xuất → thẻ → ký → 4 lối → **≥ 3 bước** | `cong-dang-mot-luot.html` |
| Đ4 · Đo quan hệ thay vì danh sách (entry 31004) | 1 nhánh, 2 bước | dưới ngưỡng: 2 |
| Đ5 · Không kéo sáu mục Later (entry 31005) | 0 nhánh | dưới ngưỡng: 0 |
| Đ6 · Không migrate hồ sơ cũ (entry 31006) | 0 nhánh | dưới ngưỡng: 0 |
| Đ7 · Không dựng eval hành vi cho lệnh (entry 31007) | 0 nhánh | dưới ngưỡng: 0 |
| `[GIẢ ĐỊNH]` trong Coverage | 0 | — |
| Phản biện xử `human-gate1` | 0 (5 finding đều đã sửa trước cổng) | — |

## Đề bài từng hình (≤ 5 dòng mỗi hình)

### Đ1 — `may-trang-thai-ho-so.html`
- Loại: sơ đồ trạng thái, một chiều trái→phải.
- Nút: `nháp` · `đã duyệt phạm vi` · `code xong` · `đã chấm máy` · rồi rẽ hai: `người ký` và `MÁY ĐÃ THÔNG (mới)`.
- Nhãn bằng chữ mặt người; mã máy trong ngoặc nhỏ; hai nút kết tô khác màu nhau (bất biến phân biệt).
- Vẽ thêm: mũi tên `máy đã thông → người ký` (chuyển hợp lệ, nhãn «owner ký trong cửa veto»); và một mũi tên GẠCH CHÉO `máy đã thông + chữ ký` = trạng thái cấm.
- Tiêu chí liên quan: AC-1, AC-2, AC-3, AC-4, AC-15.

### Đ2 — `nguong-quyet-loi-ra.html`
- Loại: sơ đồ rẽ nhánh, một nguồn → ba đích.
- Nút nguồn: «ô ngưỡng của hồ sơ cơ hội» với bốn trạng thái liệt trong nút: chưa chốt · máy đề xuất · đã chốt · không đo được.
- Ba đích: `chờ Cổng Giá trị` · `chờ Cổng Giá trị + cờ ngưỡng chưa chốt` · `đã giao — không đo`.
- Thêm một nhãn cảnh báo cạnh đích thứ ba: «hợp đồng có mặt người dùng → cờ đỏ» (răng chống lách).
- Tiêu chí liên quan: AC-9, AC-11.

### Đ3 — `cong-dang-mot-luot.html`
- Loại: sơ đồ luồng ngang, năm chặng nối tiếp rồi toè bốn lối ra.
- Chặng: kết buổi khai thác → máy đề xuất ngưỡng `[đề xuất]` → thẻ Cổng Đáng → owner gõ một câu → ghi + vẽ bản đồ + in bước kế.
- Bốn lối ra cuối: làm · lặp · xếp lại · dừng.
- Đánh dấu rõ chặng nào là MÁY, chặng nào là NGƯỜI (đúng một chặng người).
- Tiêu chí liên quan: AC-7, AC-8.

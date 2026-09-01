# Kê · đếm · hình — Cổng Phạm vi vòng `cong-dang-co-cua`

Máy kê từ artifact cuối S1, không hỏi người. Ngưỡng N5: từ **ba bước nối tiếp**
hoặc **hai nhánh rẽ** trở lên thì kèm hình.

| Điểm quyết định | Nguồn | Đếm | Hình |
|---|---|---|---|
| Mỗi trạng thái xưởng đi ra một lối nào (bảng lát cắt §3 design) | design doc §3 + AC-1…AC-6 | **10 nhánh rẽ** | H1 |
| Thứ tự lắp: nhánh nhận Cổng Đáng nằm trước hay sau chốt thẻ-ma | design doc §4 + AC-3 | **2 nhánh** × 3 bước nối tiếp (lấy về → lắp → đo) | H2 |
| Lấy phần đã cắt về bằng CÂY ghim hay bằng bản vá (`d-…-4021`) | sổ quyết định | 2 nhánh | gộp vào H2 |
| Ô 6 (ô đã ký, hợp đồng chưa sinh) giữ nguyên ca cũ (`d-…-4022`) | sổ quyết định | 2 nhánh | gộp vào H1 — ô 6 đánh dấu «giữ nguyên có chủ đích» |
| Bỏ lớp dịch tiếng-sản-phẩm cho thẻ (`d-…-4023`) | sổ quyết định | 2 nhánh | **dưới ngưỡng nội dung** — không có bước nối tiếp nào, một câu là đủ |
| Ca thứ tư là «ý đã đóng», KHÔNG phải «ô chờ Cổng Đáng» (`d-…-4024`) | sổ quyết định | 2 nhánh | gộp vào H1 — đây chính là ô 4 so với ô 7 |

Điểm dưới ngưỡng: **1** (`d-…-4023`).

---

## H1 — Một trạng thái, một lối ra

**Loại hình:** bảng quyết định / cây rẽ nhánh, đọc từ trái sang phải.

**Nút:**
- Cột trái, một nút cho mỗi trạng thái xưởng (10 ô của bảng lát cắt §3).
- Cột phải, bốn đích: `thẻ Cổng Đáng` · `thẻ Cổng Phạm vi` · `thẻ Cổng Bằng
  chứng` · `từ chối` — nút từ chối tách thành **NĂM** lời thuật con: xưởng chưa
  mở · không có hồ sơ · hồ sơ chưa có hợp đồng · **ý đã đóng** (MỚI) · **hồ sơ
  hỏng** (MỚI, nêu tên field).

  *Đính chính 01/09:* bản đầu của file này viết «bốn», sót lời thuật «hồ sơ
  hỏng» mà bảng lát cắt ô 8 và AC-5 đều đòi. Bộ ca từ chối đi từ BA lên NĂM,
  không phải lên bốn. Vẽ bốn thì ô 8 mất lối ra — hình sẽ phá đúng cái tựa của
  nó.

**Nhãn bằng chữ, không dùng mã máy trên hình:**
- Ba đích thẻ và ba lời thuật từ chối đầu: **đang có hôm nay**.
- Lối ô 4, ô 5 → thẻ Cổng Đáng: **MỚI**.
- Lối ô 7 → «ý đã đóng»: **MỚI — ca từ chối thứ tư**.
- Lối ô 6: **giữ nguyên có chủ đích** (việc-kế hiện hành đã đúng).
- Vẽ RÕ đường hôm nay: ô 4, 5, 7, 8 hiện đang chảy hết vào «hồ sơ chưa có hợp
  đồng» — đây là con trỏ chết, tô khác màu.

**AC liên quan:** AC-1 (đẳng thức hai bộ đọc) · AC-2 · AC-4 · AC-5 · AC-6.

---

## H2 — Thứ tự lắp, và đường lấy về

**Loại hình:** sơ đồ ba bước nối tiếp, mỗi bước một nhánh rẽ hỏng.

**Nút:**
1. **Lấy về** — hai nhánh: `cây ghim de27babc` (đi) · `phan-cong-dang.patch`
   (nhánh hỏng: bản vá đã mục 2/4 khối).
2. **Lắp** — hai nhánh: nhánh nhận Cổng Đáng đặt **TRƯỚC** chốt thẻ-ma (đi) ·
   đặt **SAU** chốt (nhánh hỏng: làn mới thành mã chết, mọi phép đo bề mặt vẫn
   xanh).
3. **Đo** — mutant hoán vị: dời khối xuống sau chốt thì phép đo phải ĐỎ.

**Nhãn:** ghi rõ mốc thời gian để thấy vì sao bẫy tồn tại — cây ghim 24/08,
chốt thẻ-ma 29/08; cây ghim ra đời TRƯỚC chốt.

**AC liên quan:** AC-3.

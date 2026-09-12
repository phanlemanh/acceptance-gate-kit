# Kê · đếm · hình — Cổng Phạm vi vòng `cua-veto-sau-chu-ky`

Máy kê từ artifact cuối S1 (design doc · contract · sổ quyết định · gap-probe),
không hỏi người. Ngưỡng N5: từ **ba bước nối tiếp** hoặc **hai nhánh rẽ** trở lên
thì kèm hình. Đếm nhánh rẽ **trong nội dung quyết định** (luồng mà quyết định đó
điều khiển), không đếm «làm hay không làm» — theo tiền lệ `cong-dang-co-cua`.

Nguồn kê:

- Sổ quyết định: cả **9 entry** đang chờ seal (Cổng 1 chưa ký). Hai entry `fix`
  (`…-8`, `…-9`) thay một phần `…-2` và `…-4`, nên được kê chung với entry mà nó thay.
- Lệch khỏi đề gốc. Đề gốc chỉ là «thôi nói *cửa veto mở / owner chưa veto* với hồ sơ
  đã ký». Có bốn chỗ lệch:
  1. kéo máy quét `/start` vào phạm vi;
  2. cộng ba trường mới cho máy quét thay vì lọc danh sách;
  3. chỉ thêm dòng, để lại nửa chết của nhánh cũ trong lưới;
  4. sửa bộ đọc thay vì đổi lệnh ký.
- Dòng `[GIẢ ĐỊNH]` trong Coverage: **0**. Coverage chỉ có dòng `[SUY-TỪ-REPO]` và
  `[NGÀNH]`.
- Finding gap-probe xử lý `human-gate1`: **0**. Cả 5 finding (p1 ×3, p2 ×2) đều đã
  `fixed` trong S1.

| Điểm | Đếm | Hình |
|---|---|---|
| Cửa veto đóng bằng **chữ ký người thật**, không bằng nhãn trạng thái hay tên người duyệt Cổng 1 (`d-…-2`, phần bảng giữ-chỗ do `d-…-8` thay) | **6 nhánh** nghĩa của ô chữ ký (thật · giữ-chỗ · rỗng/chỉ chú thích · chỉ ở thân · đầu báo cáo hỏng · báo cáo vắng) + **2 nhánh** làn V (xanh-sạch · không) | **H1** |
| Chỉ thêm dòng: câu hỏi chữ ký chèn TRƯỚC nhánh cũ, nên vế «hoặc đã ký» của nhánh cũ nằm lại mà không còn chạy tới (`d-…-5`, lệch đề 3) | 2 nhánh thứ tự (hỏi chữ ký trước · sau câu hỏi xanh-sạch) | gộp vào **H1**: hình vẽ đúng thứ tự hỏi chữ ký trước, xanh-sạch sau |
| Sửa ở **bộ đọc**, không đổi lệnh ký để ghi thêm trạng thái (`d-…-3`, lệch đề 4) | **2 nhánh** (đổi bên viết · đổi bên đọc) × **3 bước** nối tiếp (nguồn chữ ký → một phép hỏi → hai bộ đọc) | **H2** |
| Kéo **máy quét bảng điều khiển** vào phạm vi, dù đề nghiêng về chỉ sửa lưới (`d-…-4` → `d-…-9`, lệch đề 1) | **4 bước** nối tiếp (danh sách đầy đủ → gắn cờ đã-ký → danh sách chưa ký dựng sẵn → thẻ chép nguyên) | **H2** |
| **Cộng trường, không lọc** danh sách đầy đủ; thêm cờ đã-ký, lý do cảnh báo và danh sách chưa ký (`d-…-4` → `d-…-9`, lệch đề 2) | **2 nhánh** (lọc · cộng) | gộp vào **H2**: nhánh lọc vẽ ô «loại» |
| Bảng giữ-chỗ của máy quét là **bản dựng thứ hai**, canh bằng ma trận toàn phần (`d-…-8`) | 2 nhánh (hai danh sách khớp · lệch → đỏ gọi tên bên lệch) | gộp vào **H2**: nút «hai danh sách phải bằng nhau» |
| Thu gọn brainstorm S1 về một lượt máy (`d-…-1`) | 1 bước · 0 nhánh | dưới ngưỡng: 1 bước, 0 nhánh |
| Bỏ đặc tả UX, hồ sơ không chạm giao diện (`d-…-6`) | 0 bước · 0 nhánh | dưới ngưỡng: 0 bước, 0 nhánh |
| Không mang bản sửa sang kho tiêu thụ trong vòng này (`d-…-7`) | 1 bước (đợi bản phát hành kế) · 0 nhánh | dưới ngưỡng: 1 bước, 0 nhánh |

Điểm dưới ngưỡng: **3** (`d-…-1`, `d-…-6`, `d-…-7`). Điểm vượt ngưỡng: **6**, gom vào **2 hình**.

---

## H1 — Chữ ký người đóng cửa veto

**Tệp:** `h1-chu-ky-dong-cua-veto.html` (+ `.png`).

- **Loại hình:** flowchart, hai ô quyết định nối tiếp.
- **Nút:**
  - bắt đầu: hồ sơ máy đi trước ở Cổng 1;
  - ô hỏi 1: Cổng Bằng chứng có chữ ký người thật không (có → «cửa veto đã đóng bằng
    chữ ký»; không → cửa còn mở, vào danh sách; sáu dạng «không» ghi ở nhãn phụ);
  - ô hỏi 2, chỉ cho làn V: bằng chứng có xanh-sạch không (có → câu nhắc cũ
    «cửa veto mở», giữ nguyên; không → chặn merge, luật cũ nguyên văn);
  - ô ghi chú gạch đứt: nhãn «đã ký» trên trạng thái không được tính.
- **Nhãn:** chữ sản phẩm. Tên file, tên hàm và tên khoá chỉ xuống chú thích cuối hình.
- **AC liên quan:** AC-1 · AC-2 · AC-3 · AC-4 · AC-5 · AC-8 · AC-9.

## H2 — Hai bộ đọc, một phép hỏi

**Tệp:** `h2-hai-bo-doc-mot-phep-hoi.html` (+ `.png`).

- **Loại hình:** flowchart rẽ đôi từ một nguồn, có hai ô «loại» gạch đứt.
- **Nút:**
  - nguồn: chữ ký người ở đầu báo cáo bằng chứng;
  - một phép hỏi dùng chung;
  - lưới trước-merge;
  - máy quét: danh sách đầy đủ giữ nguyên, gắn cờ;
  - danh sách chưa ký dựng sẵn → thẻ bảng điều khiển chép nguyên;
  - nút canh: hai danh sách phải bằng nhau (ma trận 78 ô + mọi mẫu giữ-chỗ);
  - hai ô loại: «lệnh ký ghi thêm trạng thái» · «lọc thẳng danh sách».
- **AC liên quan:** AC-4 · AC-6 · AC-10 · AC-11 · AC-12.

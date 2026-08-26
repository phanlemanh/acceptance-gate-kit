# Tổng kết 16/08 — hai hồ sơ TRỪ, một luật hình, và điều kiện vào đợt 3

*Viết bởi phiên máy, 16/08/2026, ngay sau khi merge #57 · #58 · #59. Đọc
trong 3 phút. Nguồn số: các hồ sơ trong `_acceptance/`, sổ quyết định, log
pre-merge; không số nào ước lượng.*

## 1. Chuyện gì đã xảy ra trong một ngày

| # | Việc | Loại | Kết cục | Lượt gọi owner |
|---|---|---|---|---|
| A | Phân tích vì sao khối 👉 VIỆC CỦA ANH làm UX tệ đi | phân tích | 6 nguyên nhân gốc; kết luận «bảo hiểm cho một tin viết dở, trả phí mọi tin» | 2 (nêu đề · framing lại) |
| B | Tra soát: chữ ký có cùng loại bảo hiểm không? | phân tích | **một nửa** — lớp 1 (khoảnh khắc ký) giữ; lớp 2 (chứng-minh-bằng-commit) cùng loại, gỡ | 1 |
| C | Hồ sơ `cat-khoi-viec-cua-anh-tren-tin` (T2) | TRỪ | 7/7 eval · hội đồng 4/4 · ký · **MERGED #57** | 3 (mở · ok · ký) |
| D | Luật hình `docs/reference/DIAGRAM-RULE.md` (chép từ OneHub) | docs T1 | **MERGED #58** | 1 |
| E | Hồ sơ `cong-chan-nham-cho` (T3) | TRỪ | 10/10 eval máy · hội đồng 4/4 · E8 owner chấm · ký · **MERGED #59** | 4 (mở · duyệt Cổng 1 · ký · merge) |

Tổng: **11 lượt gọi owner cho ba hồ sơ + một luật**, trong đó 4 lượt là phân
tích (A, B) — thứ owner chủ động mở, không phải cổng. Phần cổng thật: 7 lượt
cho hai hồ sơ (một T2, một T3), so với 4–5 lượt cho MỘT vòng T2 trước đợt 2.

## 2. Ba thứ đã đổi trong cách kit nói chuyện với người

1. **Tin mời cổng thôi là form.** Điều khoản mời-cổng nay mô tả hành vi — một
   câu đóng, nói ngả máy khuyên, một chữ trả lời đủ, nói việc kế — thay cho
   khuôn N-mục-ba-vế + «Trả lời mẫu». Ba luật âm ở lại vì không tốn chữ: không
   viết sẵn câu trả lời của người · không hỏi phút · tin chỉ-báo không hỏi.
   Bài học lớn hơn hồ sơ: **đừng trả lời vấn-đề-về-khuôn bằng một khuôn khác**
   — đề xuất đầu của phiên chính là cái bẫy ấy, owner bác đúng.
2. **Máy đi trước thì qua được biên merge.** Lưới trước-merge nay hiểu làn V
   đúng như hook: qua khi bằng chứng tự đứng vững (sáu điều kiện, dùng lại
   hàm cũ) hoặc đã có chữ ký; đi trước mà chưa sạch, chưa ký thì vẫn chặn.
   Trước hôm nay, mọi hồ sơ đi đúng đường đợt 2 vẫn phải xin một chữ «duyệt
   tay» ở biên — hồ sơ C là vật thật đầu tiên kẹt ở đó và tự khai Ngoài-1.
3. **Chữ ký là quyết định, không phải nghi lễ commit (ADR 0012).** Người phát
   ngôn, máy ghi hộ và commit một lượt; ai chịu trách nhiệm đọc ở forge; lưới
   in một dòng «chữ ký mới trong diff» để chỗ đó không vô hình. Vật thật đầu
   tiên: chữ ký của E ra đời cùng commit với bản đồ — pre-merge xanh.

## 3. Bằng chứng không tự dối — cái gì đã đỏ trước khi xanh

- **Phản biện sạch bắt P0 hai lần** (C: từ cấm mâu thuẫn chính câu điều
  khoản; E: làn V đo NHÃN `mo`, không đo QUAN HỆ mo ⇔ sạch — hồ sơ gõ tay `mo`
  sẽ trượt qua biên). Cả hai sửa trước Cổng 1.
- **Bộ răng bắt chính lượt thi công 5 lần** (C: luật âm đo chuỗi trôi nổi ⇒
  mutant xoá bullet vẫn xanh; E: dòng nghi lễ sót · bảng phân rã chứa dòng
  không phải mã ca · thân lệnh có câu cụt + «Never» mâu thuẫn ADR mới).
- **Luật NEO tự cắt hai ô của bảng đáp án** hội đồng E8 — thước tự nhận mình
  vượt quá vật, thay vì chấm trượt vật đúng. Nếp dùng lại cho mọi eval hành vi.
- **Hai lưới khoá nhau lần hai** (DV5 additive-only × mục tiêu gỡ luật) — xử
  bằng miễn trừ đích danh 73 dòng, đúng tiền lệ đợt 2, không nới thành mẫu.
- **Stale-guard bắt tôi** sửa thân lệnh sau mốc verify → re-pin một làn, không
  có đường tắt. Đúng.

## 4. Trạng thái năm thước của bản neo

| Thước | Đích | Sau hôm nay |
|---|---|---|
| M1 số lần chặn owner / vòng T2 xanh-sạch | 1 (đề bài) + 0 chặn cuối | **Cơ chế đủ ở CẢ hook lẫn lưới biên** (trước hôm nay lưới còn chặn). Vẫn **chưa đo trên vòng T2 thật ở repo tiêu thụ** — hồ sơ C là T2 nhưng có Ngoài-1 nên phải ký; hồ sơ E là T3. |
| M2 chữ ký ở đâu | chỉ đánh-đổi / khó-đảo | Đạt về luật + **lớp 2 đã gỡ**; NOTE chiều-ghi cho phép đọc «chữ ký ra đời ở đâu» ngay trên PR |
| M3 số tầng văn bản nguyên tắc | 1 | không đổi (1) |
| M4 nơi sửa-hai-lần | 0 | không đổi (0) |
| M5 cơ chế mới | đúng 1 (V) | **giữ 1** — hôm nay không thêm cơ chế nào; NOTE chiều-ghi là một dòng in, không phải trạng thái |

## 5. Vì sao đợt 3 đủ điều kiện mở — và một điều còn thiếu

Đủ: ba đợt đầu bản neo xong; làn V thông suốt cả ba tầng (hook · lưới · văn);
tin mời cổng đúng nghĩa; branch protection kit bật; luật hình có trong repo.

Thiếu đúng một thứ: **repo tiêu thụ đang chạy plugin 2.0.0** — bản không có gì
của hôm nay. Chạy hai feature thật trên bản đó là đo luật cũ. Vì thế bước 0 của
đợt 3 là một mốc phát hành **2.1.0** — và theo đúng thiết kế, hồ sơ release
ấy là T2 xanh-sạch, tức **cơ hội đầu tiên để một hồ sơ đi trọn làn V qua biên
merge KHÔNG cần owner làm gì**. Nếu nó cần, đó là dữ liệu M1 đầu tiên và là
lỗi phải sửa trước khi đo tiếp.

Đề bài đợt 3: [`docs/plans/2026-08-16-de-bai-dot3-nghiem-tren-vat-that.md`](../plans/2026-08-16-de-bai-dot3-nghiem-tren-vat-that.md).

## 6. Bài học ghi sổ (không mở hồ sơ, chỉ nhớ)

- Owner duyệt Cổng 1 hồ sơ E ngay sau khi có hai hình tầng-2: *«lần tường minh
  nhất tôi duyệt với KIT khi có diagram»* — hình đúng loại rút ngắn khoảnh khắc
  quyết; luật hình từ nay áp cho mọi cổng T3 và mọi thẻ vượt ngưỡng N5.
- Số ca suite khai ở Cổng 1 sai (691 → 704) là chuyện bình thường của một hồ
  sơ có ghim thông điệp — khai lại tường minh kèm lý do, không im lặng sửa số.
- Bảng phân rã máy-đọc chỉ được chứa mã ca CÓ THẬT; ghi chú đi văn xuôi.

# Hạt giống — Đối chiếu «trạng thái khai trước ↔ bài kiểm đo nó» (tách 24/08)

**Xuất xứ:** cắt ra từ hồ sơ `dac-ta-ux-vat-hoa-cau-truc` sau **5 vòng nghiệm
thu liên tiếp cùng một lớp lỗi**. Owner thu phạm vi hai nhịp: vòng 4 cắt phần
đối chiếu khai↔đo; vòng 5 cắt nốt cánh còn lại. Hồ sơ gốc giao **vật và lời**,
KHÔNG giao lưới: khuôn đặc tả UX · lời S1 (điền trước · tra mẫu · hình vẽ từ
khuôn) · cửa miễn. Người duyệt soi đặc tả UX bằng mắt tại Cổng Phạm vi.

## Điều muốn có

Máy tự đối chiếu **bảng trạng thái khai trước** trong đặc tả UX với **các bài
kiểm thật sự đo trạng thái đó** — khai mà không đo, hoặc đo mà không khai, đều
phải hiện thành cờ tại thẻ Cổng Phạm vi. Đây là chân thứ ba của ô gốc («tờ khai
không được nói dối»); hai chân kia đã ship.

## Vì sao KHÔNG làm tiếp trong hồ sơ gốc — bằng chứng bốn vòng

Cùng một lớp lỗi đổi da bốn lần, mọi lần đều là **thước tự dối**:

| Vòng | Hình dạng lỗi |
|---|---|
| 1 | Chuỗi ghim không tồn tại trong đầu ra · đo chuỗi-có-mặt thay vì quan hệ · chiều đỏ chỉ có trên giấy |
| 2 | Cánh đọc ngoài vùng nó phải đọc · regex vượt dòng nuốt dòng kế · phép đo mù định dạng (hình dạng thứ hai) |
| 3 | Tự chế parser thứ ba trong khi kit đã có thư viện đọc · ghim ăn nhầm dòng chú giải · lời hứa «mọi hình dạng» phủ 3 điểm |
| 4 | **Ô nuốt luật**: bảng rỗng đi qua sạch · cánh chống-đoán-chay tắt được bằng cách xoá dòng nó gác · ghim-ăn-chú-giải **lặp lại** dù vòng 3 đã nêu đích danh lớp · fixture đối chứng đặt sai phía |
| 5 | **False green dựng lại được** trên cánh cuối: tự chế bộ đọc phần đầu hợp đồng (bản sao thứ hai của luật kit đã có ở `lib/evidence-core.cjs`) nên một dòng trong khối mã minh hoạ ở THÂN hợp đồng tắt được cờ · ràng buộc cột ngầm định làm bảng đủ bị báo «rỗng» (chẩn đoán ngược) · danh sách dòng-hỏng gom rồi không ai đọc |

**Chẩn đoán:** đối chiếu hai vật *văn bản tự do* bằng các cánh dò chữ là khuôn
giải sai. Mỗi cánh mới mở một lỗ định dạng mới, và mỗi lần vá lại đẻ chỗ trốn
mới ở chỗ khác.

## Điều kiện để mở lại ô này

0. **Không tự chế bộ đọc nào**: kit đã có `lib/evidence-core.cjs#frontmatterField`
   (đọc phần đầu hợp đồng), `lib/eval-yaml.js` (đọc evals, hiểu mô tả nhiều
   dòng), `lib/ac-line.cjs`. Vòng 3 và vòng 5 hỏng vì cùng một lý do: viết bản
   sao thứ hai của luật đọc đã có. Bản sao rộng hơn bản gốc là false green.
1. **Bộ đọc có ranh giới ĐÓNG**, không dò chữ: hoặc bảng trạng thái chuyển sang
   một vật máy-đọc thật (khối dữ liệu có khuôn cố định, một bộ đọc, một bộ
   ghi), hoặc dùng thư viện đọc sẵn có của kit cho cả hai phía.
2. **Ma trận hình dạng viết TRƯỚC** khi viết cánh: liệt kê đủ không gian (đủ,
   thiếu, rỗng, sai định dạng, nằm trong phần mô tả, tên có dấu…) — số ca phải
   bằng số ô, không tuyên «mọi hình dạng» rồi chạy vài điểm.
3. **Mỗi cánh phải trả lời được «ô này có ĐỎ được không»**: tắt được cánh bằng
   cách xoá dòng nó gác là ô nuốt luật, không phải cánh.
4. **Mọi ghim là NGUYÊN CÂU cảnh báo** — kiểm bằng cách đổi câu trong bản sao,
   ghim phải trượt.

## Ngưỡng (chép sang ô cơ hội khi mở)

- SỐNG: trên một feature chạm UI thật, mọi trạng thái khai trước có bài kiểm và
  ngược lại; phá một trạng thái trong bản sao thì cờ bật đúng tên; 0 cờ oan trên
  hồ sơ lành qua đủ ma trận hình dạng.
- CHẾT: một hình dạng bất kỳ làm cả lưới câm, hoặc cờ oan trên hồ sơ lành.

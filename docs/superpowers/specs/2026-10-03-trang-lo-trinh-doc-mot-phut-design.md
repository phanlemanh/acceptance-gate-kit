# Trang lộ trình đọc trong một phút — thiết kế

Hồ sơ: `_acceptance/trang-lo-trinh-doc-mot-phut/` · Cổng Đáng ký build 03/10 · neo
`crm/_acceptance/cap-nhat-tuan-okr` · bản mẫu và ma trận chụp ở `evidence/design-pass/`.

## Vì sao

Trang `LO-TRINH.html` của 2.21.0 vẽ đúng dữ liệu nhưng đọc như bản kê: trên crm (hai lộ trình,
43 hàng) trang dài 11.587px ở khổ 1440, 55 % là danh sách 132 hồ sơ «ngoài lộ trình» in hai lần,
cờ nằm ở y = 6.834, cột «Vì sao» rỗng 43/43, 28/43 hàng đã giao chiếm chỗ ngang hàng đang mở, và
chữ máy («tin theo lời», «tự khai», «câu giao», «Cờ») lọt ra mặt người. Owner mở trang và nhận
xét «UX/UI đang không được tốt lắm». Số đo đủ ở `opportunity.md`.

## Hướng

Giữ trang HTML tĩnh trong kho làm bản gốc (owner chọn 03/10). Chỉ thay **lớp vẽ** của
`scripts/lo-trinh.mjs`; lớp phân tích (`phanTichKho`, `suyTrangThai`, thẻ start, `--hang`,
`--mo-o`) không đổi một byte hành vi. Trang tất định: không ghi ngày vẽ; «còn N ngày» do một đoạn
script nhỏ trên trang tính lúc mở, trang vẫn đọc được khi tắt script.

### Bố cục (bảng-điều-khiển trước, chi tiết sau)

1. `h1` — «Lộ trình» (nhiều lộ trình) hoặc tên lộ trình.
2. Hàng thẻ, một thẻ mỗi lộ trình theo thứ tự khai. Bốn dòng: **Làm tiếp** (mã liên kết tới hàng +
   câu giao + lệnh mở chép được) · **Cần sửa trong kế hoạch** (N chỗ lệch → danh sách, hoặc «Không có
   chỗ lệch») · **Mốc kế tiếp** (script điền; tắt script thì «Xem dải mốc bên dưới») · **Tiến độ**
   (x/y đã giao · đang làm · chưa bắt đầu + thanh). Tệp hỏng: thẻ chỉ nêu lỗi bằng tiếng người.
3. Mỗi lộ trình một mục: chỗ lệch (mỗi mục là liên kết toàn ô tới hàng) → «Việc còn mở (n)» →
   `<details>` «N việc đã giao» → dải mốc → «Đã bác» khi có.
4. Cuối trang: một câu giải thích nguồn, rồi MỘT `<details>` «N hồ sơ không thuộc kế hoạch nào».

### Tiếng sản phẩm

Nhãn cột: Mã · Việc giao · Hạng · Cần xong trước · Trạng thái · Bật khi · Vì sao — cột không có dữ
liệu ở hàng nào của bảng thì bỏ (Mã, Trạng thái luôn có). «tin theo lời» → «theo ghi chép, chưa có
hồ sơ». Câu cờ của lớp phân tích giữ nguyên (thẻ start và test đọc nó); lớp vẽ dịch bằng MỘT bảng
dịch xuất từ `lo-trinh.mjs`, một dòng cho mỗi dạng cờ trong mã:

| Dạng cờ (lớp phân tích) | Trên trang |
|---|---|
| `hàng X thiếu cau_giao` · `thiếu ma` | X — chưa có câu mô tả việc giao · chưa có mã |
| `hàng X: tệp khai khác hồ sơ: khai K (…), hồ sơ H` | X — kế hoạch ghi «K», hồ sơ ghi «H» |
| `hàng X: tự khai K mà không có hồ sơ s` | X — kế hoạch ghi «K» nhưng chưa có hồ sơ s |
| `hàng X: hạng tệp A, hồ sơ B` | X — kế hoạch ghi hạng A, hồ sơ ghi hạng B |
| `hàng X: đứng trên mã không có: Y` | X — cần xong trước Y nhưng kế hoạch không có việc Y |
| `hàng X: dung_tren phải là một mảng` | X — ô «cần xong trước» phải là danh sách |
| `hàng X: slug không hợp lệ: s` | X — tên hồ sơ «s» không hợp lệ |
| `hàng X được nhiều hồ sơ nhận: …` | X — nhiều hồ sơ cùng nhận việc này: … |
| `hàng X trỏ hồ sơ s nhưng hồ sơ m nhận hàng này` | X — kế hoạch ghi hồ sơ s nhưng hồ sơ m nhận việc này |
| `hàng X trỏ hồ sơ s nhưng hồ sơ ghi hàng Y` | X — kế hoạch ghi hồ sơ s nhưng hồ sơ đó ghi việc Y |
| `mã trùng: T` | hai hàng cùng mã T |
| `đứng trên tạo vòng: …` | thứ tự «cần xong trước» tạo vòng: … |
| `mốc M: hang phải là một mảng` | mốc M — danh sách việc gắn mốc phải là một mảng |
| `khối hang …` · `hàng #i không phải object` · `khối tu_vung …` · `tu_vung: «k» trỏ «v» …` | danh sách việc … · việc thứ i không đúng dạng · bảng từ trạng thái … · từ «k» trỏ «v» — không phải tên trạng thái |
| `hồ sơ s ghi lo_trinh_tep t — …` · `hồ sơ s ghi lo_trinh_ma m — …` | hồ sơ s ghi kế hoạch t — kho không khai kế hoạch đó · hồ sơ s ghi việc m — kế hoạch không có việc m |
| `tệp lộ trình khai hai lần: t` | kế hoạch t được khai hai lần trong cấu hình |

Lỗi đọc tệp («tệp ý định …») đổi «tệp ý định» thành «tệp kế hoạch» trên trang. Dạng cờ nào không
khớp dòng nào thì in nguyên văn (không mất thông tin) — và ca đo đếm số dạng trong mã để không
dạng nào lọt bảng.

### Sàn đo (máy giữ, mọi ô ma trận, ô xấu nhất)

Năm trạng thái (hai lộ trình · một lộ trình · tệp hỏng · không chỗ lệch · kế hoạch rỗng) × khổ
1440/768/375 × sáng/tối, đo trên Chrome thật bằng `tests/scripts/lo-trinh-do-trang.mjs` (CDP, ngày
đóng băng): màn đầu chứa đủ Làm tiếp + Cần sửa + Mốc kế tiếp của MỌI thẻ · không tràn ngang · ≤ 6
cỡ chữ · h1 > h2 > h3 · tương phản ≥ 4,5 (chữ lớn ≥ 3) · nút đứng riêng cao ≥ 44px. Bản mẫu S1-D
qua cả 30 ô (`evidence/design-pass/do-ma-tran.jsonl`): trang crm 3.430px ở 1440 (≈ 30 % bản cũ),
tương phản thấp nhất 6,35, sáu cỡ chữ.

<!-- <<<UX-SPEC-TEMPLATE -->
## Đặc tả UX

### 1. Luồng

- Suôn sẻ: owner mở `LO-TRINH.html` (từ dòng trang của thẻ start, hoặc bản đồ) → đọc thẻ của lộ
  trình → chép lệnh «Làm tiếp» dán vào phiên Claude Code (điểm ra: phiên mở việc kế qua Cổng Đáng).
- Biên: «N chỗ lệch» → nhảy tới danh sách → bấm một mục → nhảy tới đúng hàng (hàng được tô viền) →
  sửa kế hoạch bằng PR. Kế hoạch rỗng → thẻ nói «Kế hoạch chưa có việc nào», mục chỉ đường tệp.
- Lỗi & quay lại: tệp kế hoạch hỏng → thẻ và mục của tệp đó nêu lỗi bằng tiếng người, các lộ trình
  khác vẫn đủ; sửa tệp rồi vẽ lại.

### 2. Kiểm kê màn

| Màn | MỘT việc của màn | Vào từ / ra tới |
|---|---|---|
| Trang lộ trình | trả lời trong một phút: làm gì tiếp, kẹt gì, lệch gì | thẻ start / bản đồ → lệnh mở việc dán vào phiên |

### 3. Bảng trạng thái

<!-- <<<UX-STATE-TABLE -->
| Trạng thái | Màn | Hiển thị gì | Người làm gì tiếp |
|---|---|---|---|
| ST-trang-hai-lo-trinh | Trang lộ trình | hai thẻ cạnh nhau (1440, 768) / chồng (375), cả hai trong màn đầu | chép lệnh Làm tiếp của lộ trình cần làm |
| ST-trang-mot-lo-trinh | Trang lộ trình | h1 = tên lộ trình, một thẻ, lệnh mở dùng mã trơn | chép lệnh Làm tiếp |
| ST-trang-loi-tep | Trang lộ trình | thẻ của tệp hỏng chỉ có câu lỗi «Không đọc được kế hoạch …» | sửa tệp kế hoạch rồi vẽ lại |
| ST-trang-khong-lech | Trang lộ trình | «Không có chỗ lệch» màu xanh, không có danh sách chỗ lệch | chép lệnh Làm tiếp |
| ST-trang-rong | Trang lộ trình | «Chưa có việc nào đủ điều kiện mở» · «Kế hoạch chưa có mốc» · «Kế hoạch chưa có việc nào» | thêm hàng vào tệp kế hoạch |
| ST-trang-khong-script | Trang lộ trình | thẻ ghi «Xem dải mốc bên dưới», dải mốc vẫn có ngày | đọc ngày mốc trên dải |
<!-- UX-STATE-TABLE>>> -->

### 4. Hành vi

- ≤ 640px: thẻ gọn (nhãn đứng cùng dòng, ẩn thanh tiến độ); bảng thành thẻ hàng, mỗi ô mang nhãn
  cột (`data-nhan`), ô rỗng ẩn. Đầu bảng dính khi cuộn ở khổ rộng.
- Lệnh mở chọn được trọn bằng một chạm (`user-select: all`).
- Dải mốc: script đánh dấu mốc kế tiếp (ngày ≥ hôm nay), ghi «còn N ngày / hôm nay / đã qua»; mốc
  không gắn việc mang nhãn «chưa gắn việc» và tiêu đề đếm «k/N mốc chưa gắn việc nào».
- Màu theo `prefers-color-scheme`; liên kết đã thăm giữ màu nhấn (không tím mặc định).

### 5. Xuất xứ component

| Component | Nấc (dùng / ghép / mở rộng / tạo) | Vì sao (1 dòng) |
|---|---|---|
| Thẻ lộ trình | tạo | trang tĩnh không có hệ thiết kế; token khai ở `:root` |
| Bảng → thẻ hàng trên điện thoại | ghép | `table` thật + CSS khối, giữ ngữ nghĩa bảng |
| Gập «đã giao» / «ngoài kế hoạch» | dùng | `<details>` gốc trình duyệt, không cần script |
| Dải mốc | tạo | `<ol>` + script nhỏ tính ngày lúc xem để trang tất định |

### 6. Khuôn IA đã chọn + căn cứ

Khuôn IA: bảng-điều-khiển (dashboard-first)
Căn cứ: ba câu hỏi owner hỏi mỗi sáng (làm gì tiếp · kẹt gì · lệch gì) là ba con số/câu ngắn trên
một màn, chi tiết chỉ cần khi đi sâu vào một hàng — bảng-điều-khiển trước, danh-sách-chi-tiết sau;
không tra mẫu ngoài vì luồng hiển nhiên (một khuôn khả dĩ).
<!-- UX-SPEC-TEMPLATE>>> -->

## Đổi so với hợp đồng đã ký

Trang mới cố ý đổi chữ và cấu trúc mà ca đo của hai hồ sơ đã ký đọc: `viec-ke-theo-plan` (trang
mẫu cho hội đồng; các ca đọc «Cờ», «tự khai», «Vòng ngoài lộ trình», «Hàng sống qua Cổng Đáng») và
`lo-trinh-tren-du-lieu-that` AC-8 («kho một tệp giống từng byte bộ vẽ trước vòng»). Lớp phân tích
không đổi nên các vế về dữ liệu (cờ, hàng kế, trạng thái, thẻ start) giữ nguyên; các vế về CHỮ
TRÊN TRANG đổi sang chữ mới, và vế «giống từng byte bộ vẽ trước vòng» đổi thành «giống từng byte
bộ vẽ trước vòng ở lớp phân tích» (so `phanTichKho`, không so HTML). Con trỏ thay thế ghi ở Notes
của hợp đồng vòng này; hai hồ sơ cũ ghim lại trong cùng PR.

## Ngoài phạm vi

Thẻ start giữ câu cờ gốc (người đọc là phiên Claude Code). Không bản chiếu artifact sống, không đổi
khuôn tệp kế hoạch, không tự gắn mốc với việc.

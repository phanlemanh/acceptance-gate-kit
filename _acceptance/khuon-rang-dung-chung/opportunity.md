---
schema_version: 1
slug: khuon-rang-dung-chung
feature: Khuôn răng dùng chung — bộ đo của hồ sơ không được tự dối theo cùng ba hình dạng
owner: manh@mstar.vn
stage: discovery              # discovery | decided | archived
decision:         # build | iterate | park | kill — người ký Cổng 0 điền
decided_by:
decided_at:     # ISO UTC
prototype:
  base_commit:
  disposition:
---

## Vấn đề & ai gặp

Người trả giá là chính vòng lặp: mỗi hồ sơ tự viết bộ răng bằng bash, và cùng
ba hình dạng tự-dối tái phát ở hồ sơ này sang hồ sơ khác — đo được trong MỘT
phiên duy nhất (29/08), luật dừng-vá bật HAI lần vì đúng lớp này:

1. **Chiều đỏ kết luận từ mã thoát trần** — bản tiêm chưa từng dựng (chép cây
   hỏng, bước tiêm nổ, dùng sai cờ) cũng cho cùng màu với «bắt đúng lỗi».
   (`cham-dung-cay-dung-cho-dung` r1 · `nhanh-chinh-khong-ten-main` r1)
2. **Chiều đỏ mất lực nhân quả vì fixture bị thay ngầm** — hàm dựng repo đặt
   biến dùng chung, hàm chụp cây gọi lại nó, nên bản tiêm chạy trên fixture
   khác; bản nguyên vẹn cũng cho cùng kết quả. (`nhanh-chinh-khong-ten-main` r2)
3. **Hạ tầng hỏng cho cùng màu với đạt** — đường hỏng chỉ in chữ, không tăng bộ
   đếm, nên chân báo «passed» dù chiều đỏ chưa từng chạy. (r2)

Ba hình dạng đều là *cách viết phép đo*, không phải mã sản phẩm — nên vá theo
từng hồ sơ là đuổi theo hình dạng. Lời giải đúng tầng: một khuôn răng dùng
chung mà mọi hồ sơ gọi, trong đó fixture cô lập theo thiết kế, mọi đường hỏng
hạ tầng tính là đỏ, và **bản tiêm phải chứng minh nó khác bản gốc trên CÙNG
fixture** (giống nhau ⇒ đỏ) thay vì tin vào mã thoát.

Lỗ luật thứ tư, phát hiện 29/08 khi sinh args vòng 3: cơ chế mang-kết-quả-sang
loại TRỌN `_acceptance/**` khỏi danh sách file đổi — đúng cho hồ sơ (bản hợp
đồng, bằng chứng) nhưng SAI cho bộ răng, vì `rang.sh` là mã thực thi sống trong
chính thư mục đó. Hệ quả: sửa bộ đo mà máy tưởng không có gì đổi, mang kết quả
cũ sang và bằng chứng đứng tên một bộ đo đã khác. Vòng
`nhanh-chinh-khong-ten-main` né bằng cách khai `--no-carry` tường minh.

Nợ đã khai kèm theo (từ vòng `nhanh-chinh-khong-ten-main`, thu phạm vi S4-r2):
trần thời gian cho lệnh hỏi remote và luật «vùng dò chỉ gọi hàm dò» hiện KHÔNG
có phép đo sống — hai ca đó thuộc đúng lớp này nên chờ khuôn chung.

Hình dạng thứ năm, đo được 29/08 ngay trong phiên: bộ răng chạy lệnh git với
biến đường dẫn RỖNG, mà lệnh git khi thiếu đường dẫn lại dùng thư mục hiện tại
— tức KHO THẬT. Hậu quả thật: mất remote `origin` của chính kit, và một ca đo
khác (dựng bản base từ `origin/main`) đỏ theo, trông như lỗi của vòng đang
chạy. Khuôn chung phải có cửa chặn: lệnh trên fixture chỉ chạy khi đường dẫn
không rỗng và trỏ đúng một repo git, không thì TỪ CHỐI và tính là đỏ.

Một lớp SẢN PHẨM chuyển sang đây sau khi vòng `nhanh-chinh-khong-ten-main` thu
phạm vi ở S4-r5 (owner quyết): «repo CÓ remote nhưng KHÔNG hỏi được nó» hiện
vẫn rơi về dò bốn tên quen và có thể nhận nhầm nhánh → mốc so sánh sai lặng lẽ.
Ba lần chạm vùng dò đó đều đẻ lỗ mới ở chỗ khác (r1/r2 → hồi quy; r4 → đóng;
r5 → bịt mất lối thoát `--diff-base` mà chính thông điệp lỗi chỉ ra), nên lời
giải phải đến cùng khuôn chung chứ không phải thêm một nhánh nữa. Kèm ghi chú:
phép bóc tên nhánh đọc chữ tiếng Anh trong đầu ra của git nên máy đặt ngôn ngữ
khác có thể trượt.

Tám mục gộp vào đây từ Cổng Bằng chứng của `nhanh-chinh-khong-ten-main`
(owner xếp ngăn 29/08) — tất cả đều là *chất lượng phép đo*, không phải mã
sản phẩm: ca ghim hằng đếm theo mốc (danh sách tên dự phòng) ×2 · ca kiểm
thông điệp không kiểm phần hướng dẫn khắc phục · ca có điều kiện chấp nhận kép
mà một nhánh chỉ đúng khi lỗi cũ quay lại · ca không xác nhận thông điệp nêu
đúng tên phần hỏng · ca dùng tên cố định thay vì đối chiếu thực tế · và hai mục
về dòng khai nguồn/vết lỗi thô lọt vào lần chạy thành công.

Cổng Bằng chứng của `nhanh-chinh-khong-ten-main` (29/08, owner ký) gộp TRỌN
danh sách ngoài-hợp-đồng của lượt cuối vào ô này: bốn hạn chế sản phẩm đã khai
(remote hỏi-không-được vẫn đoán nhầm · phép bóc tên phụ thuộc ngôn ngữ máy chạy
· hướng dẫn mô tả hành vi cũ · dòng khai nguồn in «null» khi tự truyền mốc) và
các mục tự phê về chất lượng phép đo. Tổng cộng ô này nay giữ: 5 hình dạng
tự-dối của bộ răng · 1 lỗ luật mang-kết-quả-sang bỏ qua bộ răng · 4 hạn chế sản
phẩm nêu trên · ~10 mục chất-lượng-phép-đo.

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: …
- Kết quả nào là SỐNG: …
- Kết quả nào là CHẾT: …
- Timebox: …

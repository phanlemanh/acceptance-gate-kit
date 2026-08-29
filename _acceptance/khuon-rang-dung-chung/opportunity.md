---
schema_version: 1
slug: khuon-rang-dung-chung
feature: Khuôn răng dùng chung — bộ đo của hồ sơ không được tự dối theo cùng ba hình dạng
owner: manh@mstar.vn
stage: decided              # discovery | decided | archived
decision: build        # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: Manh Phan
decided_at: 2026-08-30T00:05:00Z    # ISO UTC — theo phát ngôn ký trong hội thoại 30/08 (máy điền mốc, ±5 phút)
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

## Quy mô đo được (29/08)

`43` bộ răng, `10.160` dòng bash trong `_acceptance/*/`. Đây là bề mặt mà lớp
lỗi trên đang trải — và là lý do phải THU PHẠM VI: sửa hết 43 bộ là vòng khổng
lồ, còn viết thêm lời khuyên thì chính phiên này vừa chứng minh là vô hiệu (ba
hình dạng đầu đều tái phát ở hồ sơ SAU khi đã ghi sổ).

## Phạm vi đề xuất cho vòng đầu (chỉ TRỪ, không CỘNG)

**LÀM** — một thư viện dùng chung + ba chốt CỨNG, áp cho bộ răng MỚI:

1. **Bản tiêm phải chứng minh nó khác bản gốc trên CÙNG fixture.** Khuôn chạy
   cả hai bản rồi so; kết quả giống nhau ⇒ ĐỎ («ca không phân biệt được»), thay
   vì tin vào mã thoát của riêng bản tiêm.
2. **Mọi đường hỏng hạ tầng tính là đỏ.** Không có đường nào chỉ in chữ rồi đi
   tiếp; chép cây hỏng, bước tiêm nổ, bản sao thiếu vật — đều tăng bộ đếm.
3. **Cửa chặn đường rỗng.** Lệnh trên fixture chỉ chạy khi đường dẫn không rỗng
   và trỏ đúng một repo git; không thì TỪ CHỐI và tính là đỏ.

**KHÔNG LÀM trong vòng này** (khai rõ để khỏi trôi):

- Không migrate 43 bộ răng cũ. Chúng chạy được; ép sửa hàng loạt là giờ-kit đắt
  mà lợi ích chỉ đến khi có hồ sơ mới đụng cùng lớp.
- Không đóng bốn hạn chế SẢN PHẨM của `s4-args.mjs` đã gom vào đây (remote
  hỏi-không-được · phụ thuộc ngôn ngữ máy chạy · hướng dẫn mô tả hành vi cũ ·
  dòng khai nguồn in «null»). Chúng là mã sản phẩm, không phải khuôn đo — nếu
  làm thì mở ô riêng sau khi khuôn có rồi, vì lúc đó mới có chỗ viết ca đo tử tế.
- Không sửa ~10 mục chất-lượng-phép-đo từng cái một; phần lớn tự khỏi khi bộ
  răng mới dùng khuôn chung.

**Gộp vì rẻ và cùng đường:** lỗ luật mang-kết-quả-sang bỏ qua bộ răng (loại trọn
thư mục hồ sơ khỏi danh sách file đổi nên sửa bộ đo mà máy tưởng không đổi).

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: một bộ răng viết theo khuôn chung có còn
  «xanh khi chưa từng chạy» được nữa không?
- Kết quả nào là SỐNG: trên chính khuôn: ba chốt đều có ca chứng minh
  chúng ĐỎ đúng lúc (bản tiêm giống bản gốc → đỏ · chép cây hỏng → đỏ · đường
  rỗng → đỏ), mỗi ca kèm đối chứng dương; VÀ ít nhất một bộ răng thật được viết
  lại theo khuôn chạy xanh mà vẫn giữ nguyên khả năng bắt lỗi cũ của nó.
- Kết quả nào là CHẾT: khuôn không chặn được cả ba hình dạng bằng
  MÁY mà phải quay lại dặn dò bằng lời trong tài liệu — vì đó chính là thứ đã
  chứng minh vô hiệu trong phiên 29/08.
- Timebox: ship trước 2026-09-08; quá timebox → park, ghi sổ.

## Cổng 0

- **decision = build** Căn cứ: owner ký trong hội thoại 30/08 — «ký cổng đáng,
  giữ nguyên số», sau khi chọn làm ô này TRƯỚC chặng 2 vì mọi vòng sau còn phải
  trả giá cho đúng lớp lỗi mà nó đóng. Bằng chứng nền: phiên 29/08 bật luật
  dừng-vá BA lần, cả ba đều vì cách viết phép đo chứ không phải mã sản phẩm.
- **Ngưỡng chốt cùng lúc ký:** đã gỡ tiền tố, giữ nguyên số ở section Ngưỡng
  (ba chốt có ca chứng minh đỏ đúng lúc · một bộ răng thật viết lại theo khuôn ·
  cửa chết là phải quay về dặn-bằng-lời · timebox 08/09).

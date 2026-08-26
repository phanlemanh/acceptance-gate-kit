# Tổng kết phiên 25–26/08 — cái thước mắc đúng lỗi nó đi bắt

Phiên chạy hai hồ sơ. Một cái **dừng**, một cái **ship**. Bài học đắt nhất không
nằm ở hồ sơ nào cả — nó nằm ở chỗ lặp giữa hai cái.

## Đã ra khỏi phiên

| Hồ sơ | Kết cục |
|---|---|
| `design-pass-nac-khong-dong-bo` | DỪNG ở vòng 5 — kết luận BLOCKED vì hạ tầng, nhánh chưa đẩy |
| `lan-may-song-qua-bo-phan-loai` | **KÝ + GỘP** — PR #110, main `c10381cb`, 24 ghim |

Cộng hai hồ sơ nghiên cứu viết trong phiên: tổng kết vòng design-pass-nac, và rà
soát xuyên phiên về lớp lỗi bộ phân loại.

## Số của hồ sơ đã ship

- **10 vòng nghiệm thu** — kỷ lục kit (trước đó 7).
- **58 quyết định ghi sổ**, 45 trong đó thuộc chặng nghiệm thu, trải đúng 10 vòng.
- **54 phép thử ngược** trên 8 đơn vị đo, khớp bảng ma trận từng ô.
- **Luật dừng-vá bật ba lần.** Owner chọn: thu phạm vi → đổi khuôn → **cắt**.

Con số nói thay lời hứa của chính hồ sơ:

| Đường đi làn máy | Lệnh bị chặn |
|---|---|
| Tung bầy, 1 lượt | 3 trên 5 — cả vòng hỏng |
| Tuần tự, 7 lượt liên tiếp | 0 |

Luật vừa giao tự áp lên chính nó từ vòng 4 trở đi. Đó là dạng bằng chứng rẻ nhất
và thuyết phục nhất: vật tự chạy trên chính nó, không cần ai tin lời.

## Lớp lỗi của phiên — bốn vòng liền

**Mỗi cái thước dựng để bắt một lớp lỗi thì tự nó mắc đúng lớp ấy.** Bốn lần,
mỗi lần một bậc tinh vi hơn:

1. Lưới dựng để diệt «xanh mà chưa từng chạy» — tự nó xanh mà chưa từng chạy.
   Một điều kiện khiến nó bỏ qua thân mình khi bộ kiểm gọi riêng từng ca.
2. Bộ rút dựng để phủ mọi lời báo lỗi — tự nó bỏ sót một nhánh, vì bám vào
   *cách phát ra lời* thay vì bám vào *lời*.
3. Một «chiều đỏ» chép lại công thức của thứ nó canh thay vì gọi thứ ấy. Xoá
   sạch thứ được canh mà nó vẫn xanh. Đây là bậc tệ nhất: thước tự viết lại vật
   rồi đo bản chép của mình.
4. Sinh phép thử TỪ một danh sách để khỏi quên — nhưng thu danh sách lại thì thu
   luôn phép thử. Thước tự nới ra trong im lặng.

Nguyên nhân không bí ẩn: **mỗi bản vá là diện tích mới, và diện tích mới luôn là
nơi sinh lỗi kế tiếp.** Vá theo tên đã sai; vá theo lớp vẫn sinh lỗi ở chính bản
vá. Nếp rút ra, rẻ và làm được ngay: dựng xong một thước thì **phá thử chính nó**,
đừng chỉ phá vật.

## Lớp anh em — phạm vi lời hứa phải ĐÓNG

Hợp đồng hứa «khuôn sống MỘT chỗ» mà không nói *một chỗ trong phạm vi nào*. Phạm
vi để mở thì phép đo không đời nào phủ trọn lời, nên **vòng nào soi kỹ cũng tìm
ra một chỗ nữa** — vòng lặp không hội tụ, và không ai nhận ra vì mỗi lần đều là
một chỗ khác thật.

Đối chứng ngay trong cùng hợp đồng: điều khoản khai rõ hai thư mục thì chưa từng
bị bắt lỗi phạm vi; điều khoản bỏ ngỏ thì bị bắt ba vòng liền.

Cách chữa đã dùng: nêu đích danh phạm vi **trong hợp đồng**, rồi **rút phạm vi từ
hợp đồng** thay vì giữ bản chép tay trong bộ kiểm. Hợp đồng viết, bộ kiểm đọc —
đổi hợp đồng thì hiện trong diff và ra tới cổng người; đổi bộ kiểm một mình thì đỏ.

## Lần đầu kit chọn CẮT thứ máy vừa dựng

Vòng 5, luật dừng-vá bật lần ba. Câu hỏi bắt buộc — *mệnh đề đang hứa có thuộc
loại chứng được không* — lần này cho câu trả lời khác hai lần trước: **không**.

«Mọi lời báo lỗi mà bộ kiểm có thể phát» là phủ định phổ quát trên văn xuôi mã
nguồn. Bộ rút chỉ là phỏng đoán, và nó chỉ đi vào những hàm có tên trong một danh
sách gõ tay — đúng cơ chế nó sinh ra để xoá bỏ, chỉ dời lên một tầng.

Owner chọn cắt. Giữ lại các phép thử cụ thể vốn làm việc thật; bỏ lời hứa phủ
trọn cùng bộ máy dựng ra để giữ lời hứa ấy. Cái giá — nhánh sinh sau này không
được canh tự động — nay nằm thành chữ trong hồ sơ, thay vì nằm trong một con số
nghe to mà rỗng.

## Nếp vận hành thu được

- **Đường độc lập chạy tay được.** Làn máy đi 2 phiên (một chạy lệnh tuần tự, một
  hội đồng chỉ đọc) thay vì 26 phiên tung bầy. Đổi lại: sổ chạy và hồ sơ bằng
  chứng phải ghi tay, theo khuôn của bộ công cụ.
- **Lưới của kit tự bắt lỗi người viết hồ sơ.** Hai lần trong phiên: trường
  người-kiểm phải là con trỏ cấu hình chứ không phải văn xuôi; mục giới hạn phải
  mang đúng tên máy đọc được, vì bộ kiểm cố ý phân biệt VẮNG với RỖNG.
- **Đối chứng đỏ ở mức eval** dựng bằng cách lấy trọn cây ở mốc rồi phủ dụng cụ
  đo lên — không chép danh sách tệp tay. Năm phép đo đỏ vì vật chưa tồn tại; hai
  chỗ xanh và không phân biệt được **do bản chất**, khai thẳng thay vì giấu.

## Còn mở sau phiên

1. **Nợ đo thật của hồ sơ đã ship.** Nó chứng vật đúng hình dạng, không chứng làn
   máy hết nghẽn. Câu trả lời nằm ở 5 vòng chạy kế; ngưỡng đã có chỗ đợi.
2. **Hồ sơ design-pass-nac vẫn dừng**, nhánh chưa đẩy, kết luận BLOCKED vì hạ
   tầng. Nó cần một làn máy sạch — mà làn máy sạch chính là thứ phiên này vừa
   ship, nên đây là ứng viên đầu tiên để thử hiệu lực.
3. **Một lỗ của bộ thẻ cổng**, đã ghi thành mục có số: khối «đã duyệt từ Cổng 1»
   in nguyên văn sổ quyết định, không có ổ cắm dịch như khối đang treo, nên tên
   máy rò ra mặt người ở mọi hồ sơ. Người viết thẻ không có đường sửa.

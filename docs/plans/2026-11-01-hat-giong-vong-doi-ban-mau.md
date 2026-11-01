# Hạt giống — vòng đời bản mẫu và bản đồ khuôn: ai được sửa gì, mười thao tác có răng

Gốc: acceptance-gate-kit/_acceptance/khuon-loi/ — vòng `khuon-loi` (hàng KH1, mốc 2.37.0) giao bộ đọc, lệnh khuôn và
khuôn tệp bản đồ, nhưng không giao vòng đời của bản đồ hay của bản mẫu chạy được; design §10 của hồ sơ trích lại tên tệp
này. Nguồn chữ: [`docs/findings/2026-11-01-ban-do-khuon-vao-kit.md`](../findings/2026-11-01-ban-do-khuon-vao-kit.md) §3
(điểm chọn 10) và §12. Ghi hạt giống, không mở ô (luật «ô chỉ mở khi có neo ngoài»).

## Người dùng gặp gì

Hôm nay mọi thao tác trên bản đồ khuôn và bản mẫu làm bằng tay trong vòng của kho, và kit chưa có quy ước nào (skill
`design-pass`, `GUIDE.md`: không). Hai kho thử đã trả giá đo được:

- **Bản mẫu chạy được:** kho thứ hai gỡ ba bản mẫu cùng lúc dựng màn thật, trang ba lối còn trỏ đường chết; hai bản mẫu
  khác vẫn giữ dù quy ước của kho là gỡ. Cùng nghiệm với kit #398 (ảnh trỏ đường tương đối): nhúng ảnh thay vì trỏ.
- **Bản đồ:** kho thứ hai sửa tay danh sách trong bài kiểm bản đồ 7 lần; giữ 9 ngoại lệ «màn đã rời sang nhóm khác» thay
  vì gỡ; phải ghi ngoại lệ hồi tố khi luật mới vào nhánh chính giữa một vòng. Chưa kho nào có răng cho dời hay đổi tên
  tệp.

## Hướng

**Ba hạng quyền sửa** — rút từ luật đã khai nên máy tự áp, có sổ và cửa veto:

- **Máy tự làm:** thêm đối tượng, tệp, ngoại lệ có lý do, khe; gỡ phần mồ côi.
- **Máy soạn, người duyệt ở cổng sẵn có:** tạo nhóm, bật lần đầu — không thêm lượt gọi.
- **Người quyết:** đổi màn mẫu, khối đích, tách hay gộp nhóm — đó là gu; một chạm ở Cổng Phạm vi của vòng đổi, có ảnh
  trước và sau; bản đồ lên phiên bản, vòng đang chạy giữ bản đã ghim.

**Mười thao tác** (bảng đủ ở finding §12): bật lần đầu khi kho chưa có màn · bật lần đầu khi kho đã có màn · tạo nhóm mới ·
thêm màn hay đối tượng vào nhóm · ngoại lệ · sửa khuôn (thêm khe) · đổi màn mẫu, khối đích, tách gộp nhóm · gỡ nhóm hay
đối tượng · nợ cũ · dời hay đổi tên tệp. Vòng `khuon-loi` đã phủ một phần: lệnh `--tao` sinh tệp nhóm từ khuôn, bộ đọc
báo ngoại lệ thiếu lý do hay trỏ tệp không có, nợ cũ đếm theo cặp và số lần, bản đồ ghim theo băm ở bước nạp. Phần còn
lại của hạt giống:

- **Vòng đời bản mẫu:** một dòng quy ước mặc định — giữ tới khi màn thật gộp, rồi gỡ; kho đổi được — và trang bằng chứng
  nhúng ảnh, ghi «bản chạy đã gỡ, chỉ còn ảnh» thay vì trỏ đường chết.
- **Răng cho thao tác mồ côi:** nhóm không còn tệp nào khớp nhận diện, hay nhận diện không còn khớp tệp nào sau một lần
  dời tệp → bài quét báo (nhãn, không tự sinh việc); máy sửa bản đồ ở vòng kế chạm vùng ấy.
- **Ngoại lệ thừa** (cặp không còn xuất hiện ở bản đang chấm) → máy gỡ, số ngoại lệ là một chỉ số: tăng nghĩa là khuôn
  thiếu khe.

Ca đo khi mở: kho mẫu gỡ bản chạy của một bản mẫu — trang bằng chứng vẫn hiện ảnh và dòng «đã gỡ»; dời một tệp màn ra
khỏi vùng nhóm — bài quét đỏ nêu nhóm và mẫu nhận diện; chiều im: chạm tài liệu không đổi gì.

## Vì sao chưa làm

Là CỘNG (đổi lời skill `design-pass` và hành vi bộ đọc) — cần chủ kho phê ở Cổng Phạm vi của chính hàng. Phần bản mẫu đi
cùng ba lối chọn khối (mục chờ KH-C6), mà KH-C6 chờ mốc 2.37.0 được kho nhận cài; luật chiều rộng (b) chỉ cho một vòng meta
giữa hai mốc kho nhận. Ngưỡng mở ô: đi cùng vòng 2 «Chọn khối ở cổng», hoặc ≥1 kho khác gặp đường bản mẫu chết ở trang
bằng chứng.

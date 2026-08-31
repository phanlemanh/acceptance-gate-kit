# Tổng kết phiên 31/08 — hai câu hỏi về chi phí vòng chấm, và phép đo đường nối lại

Phiên hỏi-đáp + một phép đo hạ tầng. Nguồn sự kiện: hội thoại 31/08. **Không
chạm cây nguồn** — phiên này không sinh PR nào; kết quả sống ở trí nhớ dự án và
ở file này. Đúng luật đóng băng CHIỀU RỘNG: phát hiện mới vào sổ, không mở vòng.

## Dòng sự kiện

1. **Owner hỏi câu thứ nhất:** vòng chấm đã tối ưu token chưa — có tránh gọi lại
   hạng mục không đổi không? Rà soát engine trả lời: **đã có**, ba tầng.
   Carry-forward Đợt 5 (P1 eval máy/ui theo `paths` không chạm delta · P2
   baseline một lần theo `sha256(evals.yaml)` · P3 memo hội đồng theo
   `sha256(question+inputs)`), dedupe lệnh (N eval cùng một lệnh → chạy 1 lượt),
   và model theo vai (lệnh cơ học đi haiku; chỉ làn tìm-lỗi giữ model lớn).
   Phần **cố ý không mang sang**: suite luôn chạy lại, làn soi chạy tươi trên
   diff mới, bước tổng hợp luôn chạy. Kèm ba lưới chống tiết-kiệm-giả (toàn
   carry + suite rỗng → BLOCKED; hội đồng cũ không được đè nhánh UNCERTAIN;
   round ≥2 phải khai đường carry tường minh).
2. **Owner hỏi câu thứ hai:** đứt giữa chừng (mạng, máy, người đóng máy) thì nối
   tiếp hay chạy lại? Trả lời: **nối tiếp theo đơn vị một-eval-đã-xong**; sổ
   nhật ký của bộ điều phối ghi một dòng kết quả cho mỗi lượt máy con hoàn tất.
   Luật vận hành đã ghim sẵn ở SKILL feature-loop mục 229. Ba bẫy đã có sổ:
   BLOCKED do hạ tầng thì chạy mới (kết-quả-không-chạy-được cũng được ghi nhớ);
   đã sửa mã thì cấm nối (nối = chấm cây cũ); và giới hạn thật — sổ nhật ký chỉ
   tra được **trong cùng một phiên**.
3. **Ghi hạt giống** `journal-sống-qua-session`, chưa mở vòng.
4. **Phân tích hạt giống trên đĩa:** dữ liệu sống qua phiên **100%** — hồ sơ
   vòng chạy giữ trọn script + trọn args; sổ nhật ký giữ trọn giá trị trả về của
   từng lượt; bản ghi từng máy con có nhãn vai ở dòng đầu nên map ngược được.
   Rào **không** nằm ở dữ liệu mà ở phép tra cứu.
5. **Owner bảo chạy luôn** → đo thật, ba nấc, trên một vòng chấm CŨ của phiên đã
   chết (hồ sơ `dac-ta-ux`, 24/08).
6. **Quyết định biên giới tài liệu:** nghi thức rút ra ở lại trí nhớ, **không**
   vào GUIDE — kèm ngưỡng khai trước.

## Con số của phiên

- Vòng chấm mẫu (24/08): 30 lượt máy con · 2,4 triệu token · ~20 phút.
- **Nấc A — nối từ phiên khác, không can thiệp:** bộ điều phối **nhận** mã vòng
  chạy của phiên khác, không lỗi (lượt khan xong trong 11ms) — nhưng sổ nhật ký
  được tra theo thư mục **phiên hiện tại** → 0 lượt dùng lại, 15 lượt máy con
  sinh mới (cắt ngay khi thấy).
- **Nấc B — chép sổ nhật ký cũ vào đúng chỗ phiên mới rồi nối:** **15/30 lượt
  dùng lại với 0 token** — trọn đợt đầu (5 lệnh máy + 6 lượt hội đồng + 3 làn
  tìm-lỗi + baseline). 15 lượt còn lại chạy sống. Tổng **1,27M so với 2,4M ≈
  tiết kiệm 47%**.
- **Nấc C — CA CHÍNH, đo bổ sung cùng phiên:** phiên con bị **giết cứng**
  (`kill -9`) giữa vòng chạy, rồi mở lại bằng `--resume` và gọi lại vòng chấm →
  lượt đã xong trước khi giết **dùng lại với 0 token** (`cached: true`), hai
  lượt còn lại chạy sống, kết quả cuối đủ. **Không cần chép sổ.**
- Chi phí phép đo: ~1,27M token máy con cho nấc A+B, ~80k cho nấc C. Không rẻ —
  khai để lần sau cân trước.

## Điều học được

- **Ca chính KHÔNG phải lỗ hổng — harness tự phủ.** Sập/đóng máy giữa vòng chấm
  rồi mở lại phiên cũ: phần đã xong dùng lại với 0 token, tự động. Nghi thức
  chép sổ chỉ còn cần cho ca hiếm (mất mã phiên, hoặc cố ý nối từ phiên mới
  tinh) — mà ca đó luôn có đường mở-lại-phiên-cũ tốt hơn.
- **Cách ghi nhớ của bộ điều phối là THUẦN FILE.** Nó khoá theo nội dung
  (prompt + tuỳ chọn) và đọc sổ nhật ký nằm cạnh phiên — nên nối được hay không
  chỉ phụ thuộc sổ có nằm đúng thư mục phiên hay không.
- **⭐ Đo hành vi hạ tầng KHÔNG cần người:** dựng một **phiên con** không tương
  tác (`claude -p --session-id <uuid>`), cho nó chạy vật cần đo, rồi giết hoặc
  mở lại tuỳ ca. Trước phiên này, mọi ca «cần giết phiên» đều bị xếp là
  việc-của-người và treo vô hạn. Đây là công cụ dùng lại được.
- **Dùng lại không bao giờ trọn vẹn.** Đợt đầu ăn sạch, các chặng sau lệch khoá
  (nguyên nhân chưa xác định — cùng hình dạng với lần đo trong-phiên 04/08:
  126k so với 1,4M, cũng không phải 0). Kỳ vọng đúng khi dùng: cứu được nửa đắt
  nhất, không cứu trọn vòng.
- **Nối lại là chấm bằng kết quả CŨ neo cây CŨ.** Mọi bẫy provenance giữ nguyên.

## Quyết định của phiên

Nghi thức chép sổ **ở lại trí nhớ, không vào GUIDE**. Lý do: nó mô tả nội tại
của HARNESS (layout thư mục phiên), không phải cơ chế của kit — kit không sở
hữu, không có ca đo nào ghim, harness đổi layout thì chỉ dẫn hoá sai **mà không
phép đo nào của kit đỏ**. Đó là lớp «thước ghim vào thứ sẽ đổi», lần này ghim
ngược chiều: tài liệu kit ghim vào ruột công cụ chạy kit. Kiểm 31/08: hiện
không tài liệu nào trong repo trỏ vào cấu trúc thư mục harness. Cộng thêm tần
suất ca = 0 → thêm mục GUIDE là CỘNG không có neo ngoài.

**Ngưỡng viết vào GUIDE (khai trước):** ca sập-mất-phiên xảy ra THẬT ≥1 lần trên
một vòng SẢN PHẨM (không tính phép đo), trên máy bất kỳ. Chỗ đúng khi đó:
§«Round tiết kiệm — carry-forward».

## Vấp của máy trong phiên (ghi để lớp không tái diễn)

1. **Nấc thăm dò rẻ không đo thứ cần đo.** Tôi chạy lượt khan làm nấc an toàn
   trước khi nối thật — nhưng lượt khan **trả về trước bước fan-out**, nên nó
   không hề chạm cơ chế ghi nhớ. Nó xanh, rồi lượt thật vẫn sinh 15 máy con
   mới. Đúng lớp đã có tên trong sổ: *phép đo không gọi thứ nó canh*. Nghi thức
   đúng lẽ ra: kiểm sự tồn tại của sổ nhật ký trong thư mục phiên hiện tại (một
   lệnh, 0 token) trước khi chi bất kỳ lượt nối nào.
2. **Nối lại sinh hồ sơ nhìn như thật trên một hồ sơ ĐÃ SHIP.** Vòng chạy trả
   về evidence report + danh sách phát hiện của `dac-ta-ux` (hồ sơ đã ký, đã
   merge từ 24/08). Tôi bỏ, không ghi vào repo — nhưng đây là cửa hậu đáng nhớ:
   một lượt nối bất cẩn có thể đặt bằng chứng neo cây cũ vào hồ sơ, và nó mang
   đủ hình dạng để qua mắt người đọc nhanh.
3. **Bộ phân loại chặn lệnh gộp hai lượt** (lớp đã biết, chập chờn theo
   request) — tách tuần tự thì qua. Không ảnh hưởng phép đo.
4. **Xếp nhầm một phép đo thành «việc của người» rồi treo nó.** Tôi kết luận
   máy không đo được ca chính vì «máy không tự giết phiên mình», dựng gói cho
   người chạy tay, và ghi nó vào sổ như một khoản treo. Sự thật: chỉ cần một
   phiên con không tương tác — giết phiên CON thì phiên đang nói chuyện không
   hề hấn. Bài học đúng lớp *ranh-giới-không-phải-cổng thì máy tự đi tiếp*:
   trước khi khai «cần người», phải hỏi **cái gì đúng là chỉ người làm được** —
   ở đây không có gì cả.

## Đang đếm / còn treo

- ~~Phép đo tay chưa chạy~~ → **ĐÃ CHẠY cùng phiên (nấc C), giả thiết «cần
  người» SAI.** Máy tự đo được bằng phiên con. Ca chính tự phủ → hạt giống
  `journal-sống-qua-session` **đóng**, không mở vòng nào.
- **Giới hạn đã khai:** 15 lượt sau đợt đầu không dùng lại được — chưa biết vì
  sao (nghi khoá có muối theo thứ tự gọi). Không chặn việc gì.
- Ngưỡng viết vào GUIDE (ở trên) — đang đếm ở mức 0.

Con trỏ: trí nhớ dự án `hat-giong-journal-song-qua-session` (đủ số đo ba nấc +
ngưỡng) · `workflow-resume-khong-go-blocked` (ba bẫy nối lại) · GUIDE §«Round
tiết kiệm — carry-forward P1/P2/P3» (cơ chế của kit, phần đã có).

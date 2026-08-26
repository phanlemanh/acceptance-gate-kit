# design-pass nấc không đồng bộ — bản thiết kế

**Ngày:** 2026-08-25 · **Hồ sơ:** `_acceptance/design-pass-nac-khong-dong-bo/`
· **Hạng:** T2 · **Ký Cổng Đáng:** Manh Phan, 2026-08-22.

Phụ lục đề bài (NGUỒN, không chép lại ở đây):
[hạt giống 19/08](../../plans/2026-08-19-hat-giong-design-pass-nac-khong-dong-bo.md)
— mục 3 (nghi thức sau khi đổi) · 3b (sáu điều vay) · 4.3 (kết quả ván thử b1).
Tin này và file kia lệch nhau thì file kia thắng.

## 1. Sau việc này khác gì cho người dùng

Hôm nay nghi thức thiết kế của vòng lặp đòi chủ sản phẩm **ngồi cạnh máy
30–60 phút mỗi vòng**. Đắt tới mức một hồ sơ thật đã bỏ luôn nghi thức bằng
một dòng từ-chối có tên (18/08). Một nghi thức bị bỏ khi người ta thành thật
là **mặc định sai**, không phải người sai.

Sau việc này: máy dựng bản mẫu, tự chụp, **gửi gói rồi đi làm việc khác**;
chủ sản phẩm mở lúc rảnh và trả lời một chạm. Ngồi-cùng-nhau vẫn còn, nhưng
thành **nấc cao nhất và phải có người gọi tên** — dùng khi thứ cần duyệt là
cảm giác chạm, hoặc khi hai vòng liên tiếp chê đúng một điểm.

Và trước khi máy dựng bản mẫu, nếu bề mặt còn **từ hai hướng khả dĩ**, máy
bày các hướng ra thành vật nhìn được kèm **ngả máy khuyên ghim trên vật** —
người chọn một chạm ở chỗ sửa còn rẻ, thay vì thấy hướng lệch khi nó đã thành
code.

## 2. Vì sao đúng ba nguyên tố

| Nguyên tố | Ở đây nghĩa là | Kết |
|---|---|---|
| Ý định chốt trước khi làm | Hướng của bề mặt mới chốt bằng MẮT, trước code | Bước phân kỳ lấp đúng lỗ này |
| Bằng chứng không tự dối | Không đụng gì: bản mẫu và bộ phương án KHÔNG vào chuỗi bằng chứng; số vẫn đo trên vật thật ở nghiệm thu máy | Giữ nguyên |
| Khoảnh khắc quyết thật | Người xuất hiện ở chỗ có đánh-đổi (chọn hướng) và chỗ khó-đảo (Cổng Phạm vi) — hai chấm, không thêm | Số lần gọi người KHÔNG tăng |

Nấc 2 và nấc 3 là **hình thức** của chấm đã có, không phải chấm mới. Đây là
điều kiện sống của cả việc này: thang mà làm tăng số lần gọi người thì nó đã
phản bội thước đo của kit.

## 3. Năm vật bị đổi

| Sau việc này khác gì | Vật bị đổi | Tiêu chí phục vụ |
|---|---|---|
| Phiên thiết kế không còn đòi ngồi cạnh máy; bốn nấc phản ứng có tên | `skills/design-pass/SKILL.md` | AC-1 (bốn nấc) · AC-2 (mặc định async) · AC-3 (leo thang) |
| Bề mặt còn hai hướng thì người chọn trên vật, không chọn bằng chữ | `skills/design-pass/SKILL.md` | AC-4 (bước phân kỳ) · AC-5 (kỷ luật phương án) |
| Bỏ bước chọn-hướng vẫn để lại một dòng cho người duyệt thấy | `skills/design-pass/SKILL.md` | AC-6 (không có đường bỏ im lặng) |
| Thiếu bộ dựng bộ phương án không làm đứng vòng | `skills/design-pass/SKILL.md` | AC-7 (thang bốn nấc vật dựng) |
| Sổ phiên khai nấc + kênh đã dùng, một chỗ duy nhất giữ khuôn | `skills/design-pass/SKILL.md` (khuôn có mốc neo) | AC-8 (khoá mới) |
| Thẻ Cổng Phạm vi hiện nấc phản ứng bằng tiếng người | `scripts/gate-card.js` | AC-9 (thẻ hiện) · AC-10 (cờ vàng) |
| Hồ sơ đời trước vẫn đọc được, không ai phải chuyển đổi hàng loạt | `scripts/gate-card.js` | AC-10 (đường đọc-cũ) |
| Vòng lặp và nghi thức nói CÙNG một chữ về nấc mặc định | `feature-loop/skills/feature-loop/SKILL.md` | AC-11 (một cây nguồn) |
| Thẻ vẫn dựng được cho việc KHÔNG chạy phiên thiết kế | `scripts/gate-card.js` | AC-15 (nhánh không có sổ phiên) |
| Người dựng kho mới được gợi ý đủ hai ổ cắm thiết kế | `GUIDE.md`, `commands/acceptance-init.md` | AC-13 (lỗ tài liệu) |

## 4. Thang bốn nấc — bản chốt

Cái quý của phiên đồng bộ cũ không phải SỰ ĐỒNG BỘ mà là **vật bấm được**.
Phiên cũ trộn hai thứ, và chỉ một thứ đắt:

| Nấc | Tên | Dùng khi | Giá |
|---|---|---|---|
| 0 | đi thẳng | khuôn có sẵn, 0 hướng mở | để vết một dòng |
| 1 | async trên ảnh/bộ phương án | quyết định là hướng · bố cục · tĩnh | gửi gói |
| 2 | async trên vật bấm được | cần thấy trạng thái chuyển (luồng nhiều bước) | gửi kèm đường chạy |
| 3 | sync ngắn, có người gọi tên | tương tác tinh: kéo-thả, chạm, nhịp chuyển động | một lịch hẹn, có CHỦ ĐỀ khai trước |

Ba luật vận hành:

1. **Máy khuyên nấc kèm căn cứ một dòng, người veto một chạm** — không bao
   giờ hỏi «anh muốn ngồi cùng hay để đó?». Hỏi mở là đường cùng.
2. **Leo thang theo tín hiệu, không theo cảm giác:** cùng một điểm bị chê hai
   vòng async liên tiếp ⇒ kênh thiếu băng thông ⇒ mời nấc 3 **giới hạn đúng
   điểm đó**. Đây là luật dừng-vá áp cho kênh phản ứng.
3. **Nấc nào cũng để vết:** khoá `reaction:` ghi nấc + kênh, thẻ Cổng Phạm vi
   hiện.

## 5. Bước phân kỳ — có điều kiện, mở từ đặc tả UX

Điều kiện mở: **≥2 hướng khả dĩ mà máy không tự chắc** (đúng luật đáng-log của
sổ quyết định). Bề mặt đi theo khuôn có sẵn → không mở, nhưng **để vết một
dòng**.

Thứ tự bắt buộc — bài học đắt nhất của ván thử 19/08:

1. **Mở bằng vật thật đang có trước** (ảnh bề mặt hiện hành, nếu có) — để
   người veto được cả tiền đề, không chỉ chọn trong ba món máy bày. Ván thử
   b1 chết đúng ở đây: bộ phương án hỏi «phiếu khuyên đứng đâu» trong khi câu hỏi
   sống của chủ sản phẩm là «thứ này còn đáng tồn tại không», và câu đó chỉ lộ
   ra khi nhìn ảnh sản phẩm đang chạy.
2. **Rồi mới bày hướng.** Mỗi hướng: một TRỤC có tên + một câu động cơ + một
   câu đánh đổi — **kể cả hướng máy không khuyên**. Bộ phương án chỉ biện hộ
   cho ứng viên máy thích là phiếu bầu gài sẵn.
3. **Ngả máy khuyên phải NẰM TRÊN VẬT**, không nằm trong tin nhắn. Ván thử b1
   ghim câu hỏi lên bộ phương án nhưng quên ghim lời khuyên — người mở đường dẫn lúc
   rảnh thấy một cái thực đơn trần.
4. Tên hướng ổn định vĩnh viễn, không đánh số lại giữa các lượt; hướng đã chốt
   không hỏi lại.

Nguồn để bày hướng: section **Đặc tả UX** trong tài liệu thiết kế (bản đồ màn
& luồng + bảng trạng thái) — vật này vừa có từ 24/08. Kho chưa có bản đặc tả
thì mở từ tài liệu thiết kế như cũ.

**Độ nét = đủ cho quyết định đang mở.** Phác thô hợp lệ; chỉ bắt buộc dùng
token/component thật khi chính token là NỘI DUNG của quyết định.

## 6. Thang vật dựng — bốn nấc, không phụ thuộc bộ nào

Kit **không** được phụ thuộc một bộ dựng bộ phương án cụ thể (bộ đang có là bản xem
trước, cần quyền tổ chức). Thang tụt dần, mỗi nấc có tên:

1. dựng được + lưu được → dùng bản lưu;
2. chỉ xem được (xuất ảnh/PDF) → dùng bản chỉ-xem;
3. **file đã dựng mở tại máy** trong khung duyệt — quyền tổ chức chỉ gác việc
   LƯU trực tuyến, không gác dựng-và-xem, nên người không có quyền vẫn có vật;
4. không có gì → **máy khuyên một hướng kèm căn cứ, ghi một dòng, đi tiếp**,
   người veto sau.

## 7. Khoá mới trong sổ phiên — một chỗ, có mốc neo

Khuôn sổ phiên là mối nối **máy-viết → máy-đọc**. Kit đã trả giá cho việc để
hai đầu trôi khỏi nhau, nên khuôn nằm ĐÚNG MỘT CHỖ giữa cặp mốc neo
`DESIGN-PASS-NOTE-TEMPLATE`, và phép đo rút khuôn từ đầu VIẾT rồi cho đầu ĐỌC
đọc lại.

Hai khoá thêm vào khuôn:

- `reaction: <nấc> (<kênh>)` — vd `reaction: nac-1 (ghim, thao-luan)` ·
  `reaction: nac-3 (chủ đề: chạm vị trí)`. Danh sách nấc đóng:
  `nac-0` · `nac-1` · `nac-2` · `nac-3`.
- `options: <đường dẫn hoặc URL bộ phương án, trống nếu không mở bước phân kỳ>`
  — **tham chiếu, không phải bằng chứng**.
- `divergence: opened | skipped — <căn cứ 1 dòng>` — vết của bước phân kỳ, từ
  vựng ĐÓNG. Không có khoá này thì «để vết một dòng» rơi vào chỗ tuỳ hứng mỗi
  phiên, và ngưỡng CHẾT «máy né bước phân kỳ bị veto ≥ 1 lần» không đếm được
  bằng máy lẫn bằng tay — đúng cách một ngưỡng chết âm thầm.

Câu về nấc mặc định có **bản gốc DUY NHẤT** giữa cặp mốc neo
`REACTION-DEFAULT-SENTENCE`; nơi khác chép NGUYÊN VĂN, và bảng khai tay
`REACTION-DEFAULT-SITES` giữ số bản chép phải có. Đo bằng cách rút câu từ mốc
neo rồi so nguyên văn — đếm số bản chép mà không so chữ thì hai chỗ nói hai
nghĩa vẫn đếm đủ.

## 8. Thẻ Cổng Phạm vi + đường đọc-cũ

Khối «Bản mẫu & ngữ cảnh» của thẻ hiện thêm: **nấc phản ứng bằng nhãn tiếng
người** và có/không đường bộ phương án. Nhãn lấy từ một bảng, cùng chữ với
nghi thức — không tự chế chuỗi.

Ba nhánh đọc-cũ, cùng khuôn với trục ngữ cảnh đã chạy từ 1.14.0:

| Sổ phiên | Thẻ làm gì |
|---|---|
| có `reaction:` hợp lệ | hiện nhãn nấc |
| thiếu `reaction:` (đời trước) | **cờ vàng**, không chặn, không bắt chuyển đổi |
| `reaction:` giá trị lạ | **cờ vàng nêu tên giá trị lạ** |
| không có sổ phiên | khối không hiện, thẻ vẫn dựng được (như cũ) |

Nhánh cuối không phải ca hiếm: nó là nhánh **phổ biến nhất ở kho tiêu thụ**, và
là nhánh mà thẻ của CHÍNH việc này đi qua (kit không có giao diện web nên không
chạy nghi thức thiết kế). Đường mới mà làm đứng thẻ ở đó thì hỏng đúng chỗ
không ai ngờ.

## 9. Đo thế nào cho khỏi tự dối

Việc này đổi **lời** là chính, nên rủi ro lớn nhất là phép đo bám vào chữ
thay vì bám vào hành vi. Bốn lớp:

1. **Khớp vòng khuôn ↔ bộ đọc:** rút khuôn sổ phiên từ chính nghi thức (đầu
   viết), cho bộ dựng thẻ (đầu đọc) đọc, khẳng định nấc hiện đúng. Chiều đỏ:
   bỏ `reaction:` khỏi khuôn trong một bản sao ⇒ phép đo phải ĐỎ kèm thông
   điệp ghim tên khoá.
2. **Ba nhánh đọc-cũ:** ba hồ sơ dựng bằng code trong chính lượt chạy (đủ
   khoá · thiếu khoá · giá trị lạ), mỗi nhánh ghim đúng câu cờ vàng mong đợi;
   đối chứng dương là nhánh đủ khoá phải SẠCH cờ.
3. **Một cây nguồn:** câu về nấc mặc định tồn tại đúng số bản đã khai trong
   bảng khai tay; thêm/bớt một chỗ là quyết định người, phải sửa bảng cùng
   lượt.
**Ma trận mutant là toàn phần, viết trước.** Vật giao ở đây phần lớn là LỜI,
nên lớp lỗi rình sẵn là: một phép đo tuyên khẳng định bốn vế nhưng chỉ có một
chiều đỏ — ba vế kia biến mất mà màu vẫn xanh. Luật của việc này: **số mutant =
số vế được khẳng định**, mỗi mutant bẻ đúng một vế, thông điệp đỏ ghim tên vế.
Vế nào là «phải VẮNG MẶT» (vd skill không được ép một bộ dựng nào) thì bắt buộc
có **ca tiêm dương** — assert vắng-mặt trên không gian mở không tự chứng minh
được nó biết đỏ.

4. **Câu chết phải chết:** câu «phiên đòi owner ngồi xem trực tiếp; owner
   async chưa nằm trong phạm vi» về 0 trong cây. Đối chứng dương neo vào một
   **mốc git cố định** khai trong hợp đồng — KHÔNG neo vào nhánh chính, vì sau
   khi việc này gộp thì cả hai đầu đều 0 và phép đo tự chết mà vẫn xanh. Hai đầu
   phải nhận **cùng một phạm vi quét theo thư mục** (`skills/**` +
   `feature-loop/**`), không phải một danh sách file: quét base trọn thư mục mà
   quét cây hiện tại chỉ hai file đã biết thì một bản chép còn sót ở file thứ ba
   vẫn cho màu xanh. Kèm một **chân tiêm** vào file thứ ba để chứng minh phép
   đếm quét trọn.

## 10. Điều cố tình KHÔNG làm

- Không tạo nghi thức mới, không skill mới — chỉ TRỪ, không CỘNG.
- Không để kit phụ thuộc bộ dựng bộ phương án nào.
- Không đưa bộ phương án / ảnh / cảm giác bấm vào chuỗi bằng chứng.
- Không gộp chấm chọn-hướng với Cổng Phạm vi thành một tin.
- Không ép «phải có ba phương án» — thành trạm thu phí; vết một dòng + quyền
  veto thay thế.
- Không đổi lưới trước-khi-gộp, phép đo hiện có, hay bộ điều phối nghiệm thu.
- Không đo độ lệch bộ phương án ↔ vật thật bằng máy — số đó chỉ có từ ván thử ở kho
  tiêu thụ.

## 11. Giới hạn đã biết, khai trước

Kit **không có giao diện web**, nên việc này KHÔNG tự dùng được nghi thức mà
nó đang sửa. Bằng chứng máy ở đây chỉ chứng minh **luật đã vào đúng chỗ và bộ
đọc đọc đúng** — nó không chứng minh nghi thức chạy tốt với người thật. Chứng
minh đó nằm ở ván thử kế tại một kho tiêu thụ, và chính là thứ Cổng Giá trị sẽ
đọc. Đây là lỗ đã biết của mọi vòng kit tự-dùng, không phải chỗ hụt của riêng
việc này.

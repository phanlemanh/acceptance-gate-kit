# Quyết định 4 (owner bổ sung 01/09) — lời mời cổng chỉ chứa điều-chỉ-người-biết

> Tiếp nối hai findings cùng ngày (audit lời-mời · bỏ án cắt kit). Owner đưa
> một chùm ý «khá rời rạc», yêu cầu framing → phân tích → hoàn thiện → bổ sung
> vào giải pháp. Nguyên liệu owner đưa: *«ở phạm vi, tiêu chí đánh giá — nơi
> quyết hiệu quả của kit — tôi không đóng góp nhiều mà chỉ đồng ý đi tiếp, vì
> nó vượt hoàn toàn nhận thức, tôi thường tin vào Claude»* · *«đường ra chỉ
> một»* · *«quyết định không định hướng thì có đề xuất tôi cũng không quyết
> được»* · *«đã có mục tiêu và quy tắc thì không cần tôi cũng tiếp tục được»*.

## Framing

Chùm ý rời rạc quy về MỘT mệnh đề:

> **Chữ ký không đương nhiên là thẩm định.** Tại một cổng, các mục quyết định
> không cùng bản chất — phải phân loại theo **nguồn căn cứ** của từng quyết
> định, không theo vị trí cổng.

Đây là bước thứ hai của một lưỡi dao đã có: 11/08 owner đặt «người chỉ khai
điều chỉ người biết» cho **danh tính/ngày** (máy tự suy, người khỏi gõ) — chính
là «ý cũ không nhớ chính xác» owner nhắc, sống ở memory
`nguoi-chi-khai-dieu-chi-nguoi-biet` và hồ sơ chip ③b. Hôm nay cùng lưỡi dao
áp vào **nội dung quyết định**: trong một cổng, chỉ phần người thật sự biết
điều-máy-không-có mới là câu hỏi cho người.

## Phân tích — năm loại quyết định theo nguồn căn cứ

| # | Nguồn căn cứ | Lời owner | Ai xử lý | Cơ chế (toàn đồ sẵn có) |
|---|---|---|---|---|
| 1 | Mục tiêu + quy tắc đã khai phủ được | «đã có mục tiêu và quy tắc thì không cần tôi» | Máy đi tiếp, ghi sổ, cửa veto | veto-default qua `decsProvisional` — khối «CHƯA duyệt» của thẻ Cổng 2 |
| 2 | Chỉ một lối ra sống | «đường ra chỉ một… có đề xuất tôi cũng không thể quyết» | Máy đi tiếp, báo một dòng | Hiến pháp sẵn: cổng phải ≥2 lối ra sống; một lối = trạm thu phí |
| 3 | Vượt nhận thức người, nhưng quyết hiệu quả kit (phạm vi đủ? thước đo thật?) | «tôi chỉ đồng ý đi tiếp… tin vào Claude» → «dùng phương pháp đối kháng» | **Đối kháng máy** thay mắt người; người đọc PHÁN QUYẾT kèm số, không đọc vật | gap-probe (required) · rà soát đối kháng context sạch · chiều đỏ + đối chứng dương · morphological scan |
| 4 | Chưa có định hướng | «không định hướng thì có đề xuất tôi cũng không quyết được» | **Chưa được hỏi** — máy phải dựng căn cứ + hệ quả từng lối trước | Luật khuyến-nghị-trước; câu hỏi mở là đường cùng, nay nâng thành luật cổng |
| 5 | Chỉ người có (đánh-đổi giá trị · khẩu vị rủi ro · khó-đảo · kiến thức ngoài repo) | — | **NGƯỜI** — chạm thật duy nhất | Khuôn 1-phút + 1-khuyến-nghị + 1-chạm (luật (c) mới) |

**Phép thử từng mục trên thẻ:** *nếu người trả lời khác khuyến nghị, họ dựa
vào điều gì mà máy không có?* Không có gì → không phải câu hỏi cho người.

**Bằng chứng loại-3 là có thật, từ số của chính hai vòng gần nhất:**

- Vòng 2.6.0: tại Cổng Phạm vi người đóng góp **0** phát hiện; toàn bộ ~20
  phát hiện (3 P0 + 2 HIGH + …) đến từ đối kháng máy — gap-probe bắt cả chỗ
  hợp đồng tự mâu thuẫn ở đúng vế có lợi cho kit, thứ người ký không có cách
  nào thấy. Chữ «Duyệt» hôm đó là mục loại-3 bị xử lý như loại-5.
- Vòng `cong-dang-co-cua`: 34 phát hiện — 0 từ phép đo máy, 0 từ người, tất
  cả từ rà soát đối kháng.

Tức là điều owner «thú nhận» (tôi chỉ gật) không phải khuyết điểm của owner —
nó là **thiết kế đặt câu hỏi sai chỗ**: hỏi người thẩm định thứ chỉ đối kháng
máy thẩm định được.

## Hoàn thiện — bốn lưới cho chính luật này

1. **Phân loại sai nguy hiểm nhất: xếp nhầm loại-5 thành loại-1** (máy tự
   quyết thứ đáng lẽ người quyết). Lưới: mọi thứ máy tự quyết đều có sổ +
   đường đảo + hiện ở khối «CHƯA duyệt» của Cổng Bằng chứng để người phê hồi
   tố; và **khó-đảo LUÔN là loại-5 bất kể phân loại** — đã cài vào luật.
2. **Nguy cơ mới của loại-3: gật phán-quyết-đối-kháng cũng thành đóng dấu.**
   Lưới: phán quyết phải kèm SỐ (bao nhiêu phát hiện, xử lý thế nào) + bằng
   chứng chiều đỏ đã chạy + Known limits hiện đủ — trust có cấu trúc thay
   trust mù. Đối kháng phải là phiên độc lập context sạch (nếp sẵn).
3. **Loại-3 không được đệ quy:** đối kháng đo vật, không mở vòng
   đo-thước-của-thước — luật một-tầng-thước (a) vẫn là trần.
4. **Hệ quả gọn cho làn V:** cổng không còn mục loại-5 nào và không khó-đảo
   = làn V. Làn V hết là «ngoại lệ cho mốc phát hành» — nó là **ca-rỗng** của
   luật này, giải thích được vì sao 2.5.0 đi làn V đúng.

Ước lượng lên khuôn cổng: Cổng Phạm vi của vòng thường **vẫn tồn tại** nhưng
câu hỏi đổi bản chất — từ «duyệt bộ tiêu chí» (loại-3, vượt nhận thức) sang
«nhận các đánh-đổi X, Y» (loại-5 thật, thường 1–3 mục). Cổng nào rỗng loại-5
thì tự nó thành làn V.

## Bổ sung vào giải pháp

1. **Luật:** bullet mới trong Khung bổ sung của CLAUDE.md — «Lời mời cổng chỉ
   chứa điều-chỉ-người-biết» (cùng commit với file này).
2. **Vòng meta `loi-moi-cong-may-sinh` nhận thêm nguyên tắc bố cục thẻ:**
   khối «VIỆC CỦA ANH» chỉ render mục loại-5; loại-3 render thành khối «PHÁN
   QUYẾT ĐỐI KHÁNG» (verdict + số + đường đảo); loại-1/2 thành dòng báo có
   sổ. Thẻ hiện đã có ~80% vật liệu (cờ gap-probe, khối decsProvisional, mục
   Ngoài-hợp-đồng) — việc chính là ĐỔI VAI các khối, không dựng khối mới.
3. **Trí nhớ:** memory `nguoi-chi-khai-dieu-chi-nguoi-biet` nâng cấp — ghi
   rằng lưỡi dao 11/08 nay áp cả vào nội dung quyết định, kèm bảng 5 loại.

Trace ba nguyên tố: nguyên tố 3 (khoảnh khắc quyết thật — người chỉ gặp
loại-5) · nguyên tố 2 (bằng chứng không tự dối — loại-3 chuyển từ chữ-ký-suông
sang đối-kháng-kèm-số). Người hưởng cụ thể: owner tại hai cổng ký. Toàn bộ là
TRỪ và đổi-vai, không cổng mới, không tầng thước mới.

## Hình (tầng 2, owner gọi tên nâng cấp này là «2.7»)

Bốn hình trong `docs/plans/assets/` — chiếu của file này + hai findings cùng
ngày + luật (c), không phải nguồn (tên ghi ĐẦY ĐỦ, không glob — phép kiểm
mồ-côi quét theo tên file, con trỏ glob làm hình thành mồ côi giả):

- `v27-01-dinh-tuyen-dieu-chi-nguoi-biet.html` — bộ định tuyến năm loại quyết
  định, một đường tới người.
- `v27-02-truoc-sau-mot-vong.html` — trước/sau nhịp gọi người của một vòng
  (6 lượt đo thật → 3 lượt·3 chạm; mốc phát hành → 1).
- `v27-03-the-cong-doi-vai.html` — thẻ cổng đổi vai, chữ ký đổi nghĩa.
- `v27-04-so-canh-muc-tieu.html` — số cạnh mục tiêu (thang so-ngưỡng, tiền lệ
  2.5.0 chứng minh mục tiêu đạt được).

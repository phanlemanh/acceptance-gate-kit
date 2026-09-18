---
schema_version: 1
slug: start-bang-dieu-khien
feature: Thẻ /start làm bảng điều khiển — owner quyết trên thẻ, không phải mở thứ khác
owner: phanlemanh@gmail.com
stage: scheduled
verdict:
decided_by:
decided_at:
---

## Ngưỡng đã khai tại Cổng Đáng (CHÉP NGUYÊN VĂN — cấm sửa sau khi thấy số)

- Câu hỏi phép đo trả lời: Sau BA phiên `/start` thật của owner (ván thử là chính kit — người dùng cuối của thẻ là owner, không phải chờ ván ở repo tiêu thụ như hai ô UX), thẻ có đủ để owner quyết mà không phải mở thứ gì khác không — đo bằng số lần rời thẻ đi tìm bức tranh thật, tỷ lệ ý đang cân nhắc hiện ra, độ lệch đếm «còn veto được» giữa thẻ và lưới, và có lần nào owner thật sự hành động trên một dòng mới sinh.
- Kết quả nào là SỐNG: đủ CẢ NĂM, đếm trên ba phiên liên tiếp — (1) **0 lần** owner phải mở bản đồ / thư mục `_acceptance/` / lưới để biết bức tranh thật; (2) **mọi** ý đang cân nhắc hiện trên thẻ, HOẶC máy xếp hạng và nói rõ xếp theo **thước đã khai trước** (không thước tự chế); (3) thẻ **nêu tên** mọi hồ sơ còn cửa veto mở và đếm **khớp lưới** (lệch 0; nay 2 vs 14) — phá thử: thêm một hồ sơ `veto_state: mo` vào bản sao thì thẻ và lưới cùng tăng; (4) **≥ 1 lần** owner hành động trên một dòng mới sinh (veto · mở hồ sơ đọc · bảo dừng) — chứng nêu tên là dùng được; (5) thẻ **tự nói** khi cây đang sau bản chung — phá thử: lùi cây một commit thì thẻ phải cảnh báo — và **0 lượt gọi người thêm** (thẻ dài hơn không được sinh câu hỏi mới).
- Kết quả nào là CHẾT: bất kỳ MỘT — (a) thẻ dài tới mức owner **bỏ qua** một nhóm ≥ 1 lần (nói thẳng «phần này tôi không đọc»); HOẶC (b) **hai bộ đọc lại lệch chữ** cho cùng một sự thật mà suite vẫn xanh (bảng chung không có răng — đúng lớp «bên viết và bên đọc trôi khỏi nhau»); HOẶC (c) máy **tự cắt hoặc tự xếp hạng** ý theo thước tự chế, không khai trước, và bị owner veto ≥ 1; HOẶC (d) ba phiên liên tiếp owner **không chạm** dòng nào trong danh sách nêu tên → nêu tên là nhiễu, không phải thấy-để-veto.
- Timebox: hết ba phiên `/start` thật, muộn nhất **2026-09-15** → `decision: park`. Ngắn hơn hai ô UX (30/09) vì ô này đo trên chính kit và phiên xảy ra hằng ngày — ba tuần không đủ ba phiên thì tự nó là tín hiệu thẻ không được dùng; và ô `ra-co-ten-lam-va-trao` cần ô này xong trước khi `design-pass-nac-khong-dong-bo` tới S4.

## Người dự

Ô này tự khai người dùng cuối của thẻ là **chính owner**, ván thử là chính kit —
không chờ ván ở repo tiêu thụ như hai ô UX. Nên bàn nghiệm thu chỉ có một người,
và đó là thiết kế của ô chứ không phải thiếu người dự.

| Tên | Vai | Đại diện cho ai |
|---|---|---|
| Mạnh | chủ kho, người ký | người đọc thẻ `/start` để quyết việc kế |

## Chấm kín (thu TRƯỚC mọi thảo luận chung)

| Người | Điểm/nhận xét kín | Sẽ gửi cho khách nào, khi nào |
|---|---|---|
| Mạnh | (điền khi ký) | — |

## Thảo luận sau khi đã chấm

**Cờ vàng — chưa lái-thử.** Không có `stranger-drive.md` trong hồ sơ; điều kiện
«sản phẩm thật đã chạy để người dự bấm được» ở đây là lời khai. Nghi thức cho phép
mở phiên với cờ này.

**Cả năm điều kiện SỐNG đều đo bên trong phiên `/start` thật** — số lần owner rời
thẻ đi tìm bức tranh thật, có hành động trên dòng mới sinh hay không, có bỏ qua
nhóm nào không. Kit không ghi nhật ký phiên `/start`, nên máy **không có đường đo**
cho bốn trong năm điều kiện. Thẻ `/start` do bộ dựng đọc JSON của
`start-scan.mjs` rồi viết ra tại chỗ — không có bộ dựng rời để chạy lại ngoài phiên.

**Điều kiện (3) máy đo được một nửa.** Hôm nay, 18/09, lưới đếm **36 hồ sơ còn cửa
veto mở** (`vetoOpen`), trong đó **3 chưa ký** (`vetoOpenUnsigned`). Lúc mở ô con số
đối chiếu là «2 vs 14». Nửa còn thiếu là **thẻ nêu tên bao nhiêu** — chỉ đếm được
khi thẻ thật hiện ra trong một phiên.

**Timebox tự nó là một phép đo.** Ô khai: «ba tuần không đủ ba phiên thì tự nó là
tín hiệu thẻ không được dùng», và ra sẵn lối `decision: park`. Hạn 15/09 đã qua.
Nên câu hỏi cho người ký không phải «thẻ tốt không» mà là **«ba tuần qua anh có
dùng `/start` ba lần không»** — câu trả lời nào cũng chốt được ô.

## Số đo thật đặt cạnh ngưỡng

| Thước | Ngưỡng đã khai | Số đo được | SỐNG/CHẾT |
|---|---|---|---|
| (1) Số lần owner phải mở bản đồ / `_acceptance/` / lưới để biết bức tranh thật | 0 lần, trên ba phiên liên tiếp | **CHƯA ĐO** — owner khai | — |
| (2) Mọi ý đang cân nhắc hiện trên thẻ, hoặc xếp hạng theo thước đã khai trước | đạt | **CHƯA ĐO** — owner khai | — |
| (3) Thẻ nêu tên mọi hồ sơ còn cửa veto mở, đếm khớp lưới | lệch 0 (lúc mở ô: 2 vs 14) | lưới hôm nay **36 mở / 3 chưa ký**; phía thẻ **CHƯA ĐO** (chỉ hiện trong phiên thật) | — |
| (4) Số lần owner hành động trên một dòng mới sinh | ≥ 1 lần | **CHƯA ĐO** — owner khai | — |
| (5) Thẻ tự nói khi cây sau bản chung, và 0 lượt gọi người thêm | đạt | **CHƯA ĐO** — owner khai | — |
| Cửa sổ đo: ba phiên `/start` thật, muộn nhất 15/09/2026 | đủ ba phiên trong hạn | **CHƯA ĐO** — owner khai; hạn đã qua 3 ngày | — |

## Quyết định Cổng Giá trị

**Phiên KHÔNG họp — cửa sổ đo đã khép.** Cửa sổ ba phiên `/start` thật trôi qua hạn 15/09 mà không đủ phiên — chính ô khai lối này sẵn.

Owner quyết 18/09: **xếp lại sau** (`decision: park` bên `opportunity.md`). `verdict` ở đây để
TRỐNG **có chủ ý** — enum của Cổng Giá trị là `release | iterate | kill`, và ghi bất kỳ
giá trị nào trong đó sẽ khai một phiên nghiệm thu chưa từng đo gì. Bảng số đo bên trên
giữ nguyên các dòng CHƯA ĐO làm vết: cái không đo được thì nói ra, không làm tròn.

Bước kế: không ai. Vật đã giao và nằm trong engine; ô đã xếp lại.

(người ký điền `verdict`, `decided_by`, `decided_at`, và `stage: held`)

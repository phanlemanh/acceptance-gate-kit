# Hạt giống — luật giao tiếp giữa các phiên: giao việc · biên nhận · khẩu lệnh

**Ngày:** 2026-10-17 · **Trạng thái:** hạt giống (SỔ, chưa là ô) · **Loại:** CỘNG, cần owner duyệt đích danh (ADR 0018).
**Ai nêu:** owner, 17/10, sau một thời gian dùng gói `dieu-phoi`: việc trôi không ai hồi đáp · xong mà không báo · không
biết bên kia đã nhận chưa · phiên thợ không rõ phạm vi mà cũng không hỏi. Ba cạnh: Điều phối – Thợ, Thợ – Thợ, Điều
phối (máy) – Điều phối (máy).
Gốc: hai kênh liên máy `phanlemanh/crm-onehub#375` và `phanlemanh/acceptance-gate-kit#308`, đo 17/10 bằng
`gh api …/comments` (số ở §2) · sự cố 15/10 (lượt gọi #420 bị sót 4 giờ), 16/10 (gộp #453 khi chưa có lượt gọi),
17/10 (chip LT1e mở sai kho, sinh hai phiên cùng tên).
**Chân VC8 (cơ học, KHÔNG phải neo):** `_acceptance/o-chi-mo-khi-co-neo-ngoai/` trích lại tệp này.
Liên quan: `docs/plans/2026-10-13-hat-giong-kenh-lien-may-dieu-phoi.md` (đường truyền liên máy). Tệp này bàn
**giao thức** chạy trên mọi đường truyền; tệp 13/10 bàn **đường truyền**. Hai tệp không thay nhau.

---

## 0. Đọc trong một phút

- **Bốn triệu chứng owner nêu chung một gốc: một yêu cầu là một vòng mở, mà không có gì giữ danh sách vòng mở.**
  Vòng chỉ đóng khi có người nhớ. Phiên thợ «không rõ phạm vi mà không hỏi» là cùng gốc nhìn từ chiều kia: lời giao
  việc không mang ý định và ranh giới, nên thợ không có gì để biết mình đang vượt.
- **Số đo 17/10:** 850 tin trên hai kênh liên máy trong sáu ngày. 44 tin là yêu cầu hay câu hỏi. **Không tin trả lời
  nào trỏ được về tin nó trả lời.** Câu «yêu cầu này đã đóng chưa» chỉ trả lời được bằng cách đọc lại cả luồng.
- **Luật bằng lời đã có từ 08/08 mà không giữ được.** Bộ nhớ máy ghi chín lời dặn giao tiếp (báo chủ động ở bốn mốc,
  phản hồi hai chiều, đối chiếu lệnh giai đoạn với git…). Từ 12/10 tới 16/10 vẫn có bốn ca sót tin hoặc đọc sai tin.
  Hiến pháp kit đã nói trước điều này: lời dặn không phải nghiệm.
- **Đề xuất:** một bộ khẩu lệnh nhỏ (§4) và **máy giữ bốn thứ**: mã tin, sổ vòng mở, chặn kết lượt khi còn tin chưa
  nhận, và khuôn lời giao việc. Tất cả dựng trên khuôn yêu cầu đã có của gói, không thêm hộp thư thứ hai.
  Ước một vòng T2, khoảng 8–10 giờ máy; MacBook Pro giữ (chủ kho giao 17/10), chạm vùng tệp của M5.

---

## 1. Framing — bài toán thật là gì

### 1.1 Ba cạnh và đường truyền hôm nay

| Cạnh | Đường truyền | Có mã tin? | Trả lời trỏ về yêu cầu? | Ai biết vòng còn mở? |
|---|---|---|---|---|
| Thợ → giám sát (trong đợt) | `yeu-cau` → thư mục đợt, sự kiện `can_phan`, Monitor | **có** (`<dãy>-<số>`) | **có** (`tra-loi/<mã>.json`) | **máy** — `can-nguoi` chưa trả lời hiện trên bảng |
| Giám sát → thợ | lời ghi danh của chip (máy dựng) · `send_message` lời tự do | không | không | không ai |
| Thợ ↔ thợ | không có; đi vòng qua giám sát hoặc gặp nhau ở xung đột git | — | — | — |
| Điều phối máy ↔ điều phối máy | bình luận issue #375, #308, dòng đầu `[máy · phiên → máy · phiên] loại` | không | không | không ai |

Cạnh duy nhất đóng vòng được bằng máy là cạnh thợ → giám sát trong đợt. Mọi cạnh còn lại đóng vòng bằng trí nhớ.

### 1.2 Bốn triệu chứng, một gốc

| Owner thấy | Thật ra là |
|---|---|
| Việc trôi, không ai hồi đáp | vòng mở không có chủ giữ, không có hạn |
| Xong mà không báo | «xong» không phải một trạng thái bắt buộc phải phát; kết lượt không kiểm còn ai đang chờ mình |
| Không biết bên kia đã nhận chưa | không có trạng thái «đã đến» hay «đã nhận»; im lặng trông y như bận |
| Thợ không rõ phạm vi, không hỏi | lời giao việc thiếu ý định, ranh giới, điểm phải dừng; không có bước đọc lại |

### 1.3 Điều KHÔNG phải bài toán (đo 13/10, giữ nguyên)

- **Độ trễ đường truyền.** Bộ canh còn sống bắt tin trong khoảng 1 phút. Chỗ hỏng là bộ canh CÂM, không phải chậm.
- **Tranh khoá.** 0 ca gộp chen khi khoá đang giữ. Ca thật là khoá bị QUÊN nhả.

---

## 2. Phân tích — số đo 17/10

Lệnh đo: `gh api repos/<kho>/issues/<số>/comments --paginate`, rồi một script Python trong scratchpad của phiên
(không vào kho). Loại tin đọc từ dòng đầu. «Trễ» là thời gian từ yêu cầu tới **tin đầu tiên của máy được gọi tên sau
đó**. Đó là cận dưới: tin đầu tiên ấy không chắc trả lời đúng yêu cầu. Không có mã tin nên không đo được thời gian
đóng vòng thật. Đây chính là phát hiện.

| | crm #375 | kit #308 |
|---|---|---|
| Khoảng | 12/10 → 17/10 13:35Z | 11/10 → 17/10 09:50Z |
| Tổng tin | 674 | 176 (56 KHOÁ · 44 NHẢ) |
| Yêu cầu + câu hỏi có đích | 34 | 10 |
| Trả lời trỏ được về mã tin gốc | **0 / 34** | **0 / 10** |
| Tin đầu tiên của bên nhận là `tra-loi` | 17 / 34 | 4 / 10 |
| Trễ tới tin đầu của bên nhận: trung vị · p90 · lớn nhất | 1′ · 157′ · 273′ | 103′ · 683′ · 683′ |
| Số ca trễ > 60′ | 4 | 6 |

Hai kênh có hai hình dạng khác nhau. Ở #375 bên nhận thường lên tiếng ngay, nhưng một nửa lần lên tiếng ấy không phải
câu trả lời. Ở #308 bên nhận lên tiếng chậm: trung vị gần hai giờ. Cả hai kênh chung một điểm: không ai biết vòng nào
còn mở nếu không đọc lại.

### 2.1 Sự cố có thiệt hại

| Ngày | Cạnh | Chuyện gì xảy ra | Thiệt hại | Gốc |
|---|---|---|---|---|
| 08/08 | giám sát → thợ | giám sát dặn «trả lời trong phiên của bạn, tôi tự đọc»; thợ im | owner phải hỏi vì sao | không có luật báo về |
| 08–09/08 | giám sát → thợ | chip tự code xong mới trình Cổng 1; chip bỏ chân review vì lời giao «như mọi khi» | mất cổng định hình tiêu chí | lời giao việc thiếu thứ tự và đường đi |
| 04/10 | giám sát → thợ (crm) | 20 trong 33 tin owner gửi phiên điều phối là «kiểm tra các phiên» | owner làm thay nhịp tim | không có gì tự báo khi vòng quá hạn |
| 12/10 | máy ↔ máy | M5 xin chen một lượt gộp; điều phối đọc trễ khoảng 1 giờ vì canh nền chỉ bắt một từ khoá | ≈ 1 giờ | bộ đọc khớp từ khoá, không khớp «tin gửi tôi» |
| 13/10 | máy ↔ máy | tin M5 03:27Z bị sót khoảng 4 giờ, lần thứ hai trong hai ngày | ≈ 4 giờ | như trên |
| 15/10 | máy ↔ máy | Mac Studio gọi lượt #420; bộ canh chết câm vì mẫu lọc sai nền | 4 giờ, mốc crm 16/10 suýt trễ | bộ canh không có chiều đỏ |
| 16/10 | máy ↔ máy | câu «#453 chưa gọi lượt» bị đọc thành lượt gọi, #453 được gộp khi chưa có lượt gọi | một lần gộp sai thứ tự | bộ đọc khớp trên thân tin, không chỉ trên khẩu lệnh |
| 17/10 | giám sát → thợ | chip LT1e mở trong kho kit thay vì crm, tự sinh phiên con ở crm | owner thấy hai phiên LT1e, phải hỏi | lời giao việc không mang ranh giới kho / thư mục |

**Đọc bảng:** không ca nào do đường truyền chậm. Ba ca do **không ai giữ vòng mở**: báo về, quá hạn, tin gửi tôi. Hai
ca do **bộ đọc hiểu sai tin**, vì khẩu lệnh lẫn vào lời văn. Ba ca do **lời giao việc thiếu ranh giới hay thứ tự**.

### 2.2 Vì sao luật bằng lời không giữ được

Chín lời dặn (bộ nhớ `giao-thuc-dieu-phoi-lien-phien`, 08–10/08) nằm trong đầu một phiên. Phiên thợ ở worktree khác
không đọc được bộ nhớ ấy, nên mỗi lời dặn chỉ sống khi phiên giám sát nhớ chép nó vào từng đề bài. Từ 12/10 có thêm
hai máy với hai bộ nhớ riêng. Luật nằm ở ba bộ nhớ, ba bộ đọc, ba cách hiểu. Đúng nguyên tử của hiến pháp: *một trí
tưởng tượng viết cả vật lẫn thước lẫn lời, trên một nền không tin được.*

---

## 3. Đánh giá

### 3.1 Mượn gì từ ngoài, bỏ gì

| Mẫu ngoài | Lấy | Không lấy |
|---|---|---|
| **Giao tiếp vòng kín** (hàng không, phòng mổ: gọi → đọc lại → xác nhận) | bên nhận **đọc lại** lời giao việc trước khi làm | đọc lại MỌI tin. Chỉ lời giao việc mới cần đọc lại |
| **Khẩu lệnh vô tuyến** (ROGER, WILCO, OUT) | một bộ từ cố định, ít, máy đọc được; «nhận» tách khỏi «sẽ làm» | thêm từ cho mọi sắc thái |
| **Lệnh có ý định** (commander's intent) | lời giao việc mang **vì sao** để thợ tự quyết đúng khi gặp điều chưa lường | mệnh lệnh chi tiết từng bước |
| **A2A 1.0 ở tầng dữ liệu** (tệp 13/10) | `messageId`, `contextId`, trạng thái việc SUBMITTED → WORKING → COMPLETED / FAILED / CANCELED / REJECTED | A2A làm đường truyền |

### 3.2 Theo ba nguyên tố

- **Nguyên tố 1 — ý định chốt trước.** Lời giao việc mang ý định, kết quả và ranh giới. Bước đọc lại bắt lệch phạm vi
  *trước* khi làm (ca 08/08, 17/10). Người hưởng: chủ kho, vì không phải gỡ việc làm sai phạm vi.
- **Nguyên tố 2 — bằng chứng không tự dối.** «Im lặng» hôm nay không phân biệt được «không có tin», «bộ canh chết» hay
  «bên kia chưa đọc». Mã tin cộng sổ vòng mở cộng bộ canh có chiều đỏ biến im lặng thành một trạng thái đọc được. XONG
  phải mang vật (sha, PR, kết quả lệnh). Người hưởng: phiên điều phối của cả ba máy.
- **Nguyên tố 3 — khoảnh khắc quyết thật.** Mỗi HỎI khai chặn hay không chặn và nguồn căn cứ. Chỉ câu chỉ người biết
  mới lên chủ kho. Vòng quá hạn lên thẻ ở bề mặt đã có, không thêm tin cho người. Người hưởng: chủ kho, vì không còn
  phải làm nhịp tim (04/10).

### 3.3 Theo thước đo của kit

| Dòng | Dự báo | Vì sao |
|---|---|---|
| Lượt gọi người mỗi vòng | ↓ | bỏ lượt «máy kia có nghe không» và «kiểm tra các phiên»; phạm vi lệch bắt trước khi làm |
| Làm-xong → quyết-được | ↓ | p90 trễ yêu cầu 157′ (#375) và 683′ (#308) là trần cần hạ; quá hạn tự nổi |
| Vòng bị hạ tầng kit đốt lượt chấm | = | không chạm S4 |
| Token máy | ≈ / ↓ | đọc sổ vòng mở thay cho đọc luồng (≈ 20 nghìn token mỗi lần đọc trọn #375); đọc lại thêm một tin mỗi lần giao |
| Phút máy mỗi lượt chấm | = | không chạm S4 |

**Điều kiện tin cậy:** đường phán quyết S4 không đổi thành phần.

### 3.4 Rủi ro: thành trạm thu phí

- **Bão biên nhận.** Nếu mọi tin đều phải đáp, ba máy sẽ đáp nhau vô tận. Chặn: BÁO không bao giờ cần đáp; chỉ GIAO và
  HỎI mở vòng.
- **Nghi thức nặng hơn việc.** Lời giao việc sáu trường cho một việc mười phút là thừa. Chặn: lời ghi danh của chip
  do máy dựng điền sẵn năm trường từ hàng lộ trình; người giao chỉ viết ý định.
- **Hỏi tràn.** Luật «không rõ thì hỏi» có thể đẻ câu hỏi máy tự trả lời được. Chặn: thợ hỏi giám sát trước; giám sát
  áp chính sách đã chốt (17/10 «ship nhanh mà vẫn tin được»); chỉ câu chỉ người biết mới đi tiếp lên chủ kho.

---

## 4. Hoàn thiện — bộ luật

### 4.1 Khẩu lệnh (dòng đầu, chữ hoa, máy đọc CHỈ dòng đầu)

| Khẩu lệnh | Ai phát | Mở / đóng vòng | Bắt buộc mang |
|---|---|---|---|
| **GIAO** | người giao việc | mở | mã tin · lời giao việc §4.3 · hạn biên nhận |
| **HỎI** | bất kỳ | mở | mã tin · chặn / không chặn · khuyến nghị kèm căn cứ |
| **BÁO** | bất kỳ | không mở | — (không ai phải đáp) |
| **NHẬN** `<mã>` | bên nhận | giữ mở | đọc lại ba dòng (§4.4) với GIAO; với HỎI: giờ sẽ trả lời |
| **XONG** `<mã>` | bên nhận | **đóng** | vật: sha · PR · kết quả lệnh · tệp |
| **KẸT** `<mã>` | bên nhận | giữ mở | cần gì, từ ai, từ giờ nào |
| **TRẢ** `<mã>` | bên nhận | **đóng** | lý do + chuyển cho ai (hoặc «không ai») |
| **HUỶ** `<mã>` | bên giao | **đóng** | lý do |

Trả lời một HỎI là XONG kèm câu trả lời. Không có khẩu lệnh «DUYỆT»: chữ ký cổng vẫn gõ trong phiên vòng (ADR 0002).

### 4.2 Luật vòng mở

1. **Mọi tin có mã.** Mã do máy sinh: `<máy>-<ddmm>-<n>`, hoặc `<dãy>-<số>` trong đợt như hôm nay. Mọi tin đáp ghi
   mã tin nó đáp.
2. **Chỉ XONG, TRẢ, HUỶ đóng vòng.** NHẬN và KẸT không đóng.
3. **Biên nhận trong một nhịp.** Bên nhận phát NHẬN ở lượt kế của mình. Quá hạn (mặc định 30′, GIAO khai được hạn
   khác): người gửi nhắc MỘT lần. Quá hạn lần hai thì vòng lên bảng ở bề mặt đã có (bảng đợt, `/dieu-phoi:xem`,
   thẻ hiện trạng). Không gửi tin mới cho chủ kho.
4. **Không kết lượt khi còn tin gửi mình chưa NHẬN.** Đây là luật đóng lỗ «xong mà không báo» và «không biết đã nhận
   chưa». Hook dừng của gói giữ nó, không phải trí nhớ.
5. **Khoá là một GIAO gửi chính mình.** `KHOÁ` mang giờ dự kiến nhả; `NHẢ` là XONG của nó. Khoá quá hạn thì máy kia
   nhắc, KHÔNG tự phá (giữ luật #308).

### 4.3 Lời giao việc — sáu trường

| Trường | Ví dụ | Ai điền |
|---|---|---|
| **Ý định** — vì sao việc này đáng làm | «crm cần đọc lộ trình nhiều kho trước 22/10» | người giao (trường duy nhất phải viết tay) |
| **Kết quả** — xong nghĩa là vật nào | PR gộp vào `onehub`, hồ sơ `<slug>` ký Cổng Bằng chứng | máy, từ hàng lộ trình |
| **Ranh giới** — kho, thư mục làm việc, vùng tệp được chạm, vùng KHÔNG được chạm | `cwd ~/dev/crm` · `src/lo-trinh/**` · không chạm `packages/ui` | máy, từ hàng và bản đồ vùng |
| **Quyền** — tự gộp? tự mở việc phụ? | không tự gộp; việc phụ đi qua `yeu-cau viec-phu` | máy, từ cấu hình đợt |
| **Điểm phải hỏi** | §4.5, cộng các điểm riêng của việc | máy chép §4.5; người giao thêm |
| **Báo về đâu, mốc nào** | phiên giám sát `<mã>` · NHẬN, KẸT, XONG | máy |

Thiếu Kết quả hoặc Ranh giới thì máy **không phát chip**, in lý do. Ca 17/10 (chip sai kho) chết ở bước này.

### 4.4 Đọc lại — tin NHẬN đầu tiên của thợ

Ba dòng, viết bằng lời của chính thợ, không chép lại lời giao:

```
NHẬN G-1710-3
Sẽ giao: <vật cụ thể>
Giữ trong: <ranh giới>; không chạm: <…>
Sẽ dừng hỏi khi: <điểm cụ thể nhất của việc này>
```

Giám sát so ba dòng với lời giao. Lệch thì sửa TRƯỚC khi thợ làm. Đây là chỗ bắt «không rõ phạm vi» rẻ nhất: một tin,
không lượt gọi người nào.

### 4.5 Khi nào thợ PHẢI hỏi (và khi nào KHÔNG được hỏi)

**Phải HỎI, khai chặn:** sắp chạm ngoài ranh giới · đổi lời một tiêu chí đã ký · việc khó đảo (gộp, cắt bản, xoá, đẩy
lên kho khác) · hai nguồn nói trái nhau (lời giao và git, lộ trình và hồ sơ) · lệnh giai đoạn trái với trạng thái git.

**Không hỏi, tự quyết và ghi sổ:** mọi thứ suy được từ ý định cộng luật đã khai cộng chính sách chủ kho. Ví dụ: đặt
tên, thứ tự việc trong vùng của mình, chọn giữa hai cách đều đảo được.

HỎI gửi giám sát trước. Giám sát chỉ chuyển lên chủ kho câu nào căn cứ chỉ người có (khuôn một phút, một khuyến nghị,
một chạm).

### 4.6 Theo cạnh

- **Thợ ↔ thợ: không có kênh riêng.** Phụ thuộc giữa hai thợ (A cần B gộp trước, A muốn chạm tệp của B) đi qua giám
  sát bằng `yeu-cau` (`cham-tep`, `chuyen-hang`) như hôm nay. Lý do: kênh trực tiếp là N² cặp, và giám sát mù đúng chỗ
  dễ va chạm nhất. Trao đổi thẳng giữa hai thợ chỉ hợp lệ khi giám sát cùng thấy (tin ghi vào thư mục đợt).
- **Điều phối máy ↔ máy:** cùng khẩu lệnh, cùng mã, trên issue như hôm nay. Mỗi máy giữ một con trỏ «đã đọc tới». Sổ
  vòng mở tính từ kênh, không đọc trọn luồng. Bộ canh có chiều đỏ: lúc giăng phải bắt lại được tin cuối đã biết; không
  bắt được thì báo lỗi, không im (bước nhỏ của tệp 13/10).
- **Quyết định của chủ kho đi qua máy:** tin chuyển trích nguyên văn, nơi nói, giờ nói. Máy nhận KHÔNG đóng một vòng
  khó đảo (gộp, cắt bản) chỉ bằng tin chuyển. Nó đối chiếu ở nguồn trước (ca 16/10).

---

## 5. Máy giữ gì, và chỗ nào vẫn là lời

| Luật | Răng (máy giữ) | Còn là lời? |
|---|---|---|
| Mã tin, khẩu lệnh dòng đầu | lệnh `tin gui` sinh mã và dòng đầu; model không gõ khuôn | không |
| Trả lời trỏ về mã | lệnh `tin tra <mã> <khẩu lệnh>` | không |
| Sổ vòng mở, quá hạn | lệnh `tin so`: đọc thư mục đợt hoặc kênh từ con trỏ, in vòng mở theo tuổi; bảng đợt hiện vòng quá hạn | không |
| Bộ đọc chỉ tin dòng đầu | `tin so` chỉ phân loại theo khẩu lệnh dòng đầu, thân tin không bao giờ tính | không |
| Không kết lượt khi còn tin chưa NHẬN | hook dừng của gói (đã có năm khối hook) | không |
| Bộ canh có chiều đỏ | `tin canh` thoát khác 0 khi không bắt lại được tin cuối | không |
| Lời giao việc đủ trường | bộ dựng lời ghi danh của chip từ chối khi thiếu Kết quả hay Ranh giới | không |
| Đọc lại khớp lời giao | — | **có**: so ba dòng là phán xét của giám sát. Ngưỡng dựng răng: ≥ 1 ca thợ làm lệch phạm vi mà tin NHẬN đã khai đúng phạm vi |
| Danh tính máy trên issue | — | **có**: vẫn tự khai (giới hạn của tệp 13/10, ngưỡng giữ nguyên) |

**Đường đọc cũ:** tin không mã, dòng đầu khuôn cũ `[máy · phiên → …] loại` vẫn đọc được, mang cờ vàng «tin không mã —
không theo dõi vòng». Không bắt ai sửa tin cũ.

**Cân trên mọi kho (luật 26/09):** gói `dieu-phoi` là gói kho tự chọn cài. Kho không có đợt thì mọi hook im như hôm
nay. Hook chặn kết lượt chỉ sống khi có đợt hoặc kênh khai trong cấu hình. Kho đang dùng `yeu-cau` không đổi gì:
khuôn yêu cầu cũ chính là GIAO / HỎI có mã.

---

## 6. Đề xuất

**Một vòng T2 trong gói `dieu-phoi`: «vòng mở có chủ giữ».** Phạm vi: §4.1–4.2 và §5 trừ hai dòng còn là lời; khuôn
lời giao việc §4.3 trong bộ dựng lời ghi danh; đọc lại §4.4 ở mức lời của LUAT.md. Khoảng 8–10 tiêu chí.

- **Máy giữ vòng:** MacBook Pro. Chủ kho giao 17/10 vì hàng của M5 đang tồn nhiều. `dieu-phoi/` là vùng của M5,
  nên MacBook Pro báo M5 trên #308 trước khi mở và không gộp chen giữa lô của M5. Hàng lộ trình `GT1`, slug
  `vong-mo-co-chu-giu`, mốc 2.33.0.
- **Ước:** `T2 · bắt đầu ~18/10 · ~6–8 giờ máy (×1,3 vì chạm vùng máy khác ≈ 8–10) · % hạn mức tuần đo khi ≥ 5 vòng ·
  hoàn tất dự kiến ~20/10 · mục tiêu mốc 21/10`. Dùng ngay ở đợt thử hai OneFlow 27/10 (M5) và đợt kế của crm.
- **Neo ngoài:** gói giao tới crm (đợt r2, ba máy). Không phải vòng đo thước của thước. Vì vậy nó không chiếm suất vòng
  meta giữa hai mốc theo luật chiều rộng (b).
- **Không làm trong vòng này:** kho git làm hộp thư (tệp 13/10, ngưỡng giữ nguyên) · danh tính có chữ ký · đánh thức
  phiên đã đóng.

**Ngưỡng nếu chưa duyệt (đếm THIỆT HẠI):** ≥ 1 ca vòng mở quá hạn làm chậm đường găng ≥ 30′ hoặc thêm một lượt gọi
chủ kho, tính từ 17/10. Chú ý: ca 15/10 (#420, 4 giờ) đã vượt ngưỡng này trước khi nó được viết ra.

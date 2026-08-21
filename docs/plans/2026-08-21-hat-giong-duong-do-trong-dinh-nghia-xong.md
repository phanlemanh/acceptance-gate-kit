# Hạt giống — đường đo nằm trong định-nghĩa-xong

**Ngày:** 2026-08-21 · **Trạng thái:** hạt giống, chờ Cổng 0 · **Hạng dự kiến:**
T2 (một ô cấu trúc trong contract + một cờ vàng trên thẻ + một dòng cross-check
của gap-probe; không chạm workflow, không chạm lưới trước-merge).
**Sinh từ:** phiên rà soát 21/08 (soi toàn kit qua trục ngưỡng-khai-trước ↔
vật-giao-được), lỗ **L1**. Cùng chuyến Cổng 0 với hạt giống «ô nuốt luật»
(15/08, PR #56) — cả hai chạm khuôn cơ hội, ở hai ô khác nhau.

> Chữ trong file này là NGUỒN. Chưa có hình; nếu hồ sơ mở, hình đáng vẽ là
> chuỗi bằng chứng «ngưỡng → đường đo → số» (tầng 2, vào `figures/` của hồ sơ).

## 0. Tóm tắt một đoạn

Kit đòi khai **ngưỡng sống/chết** ở Cổng Đáng và đòi **đặt số đo cạnh ngưỡng**
ở Cổng Giá trị — nhưng **không chỗ nào đòi xây thứ sinh ra con số đó**. Quét
toàn cây nguồn: mọi câu nhắc tới số đo thật đều nằm ở phía ĐỌC (sau ship), không
một câu nào ở phía TẠO (trước ship). Hệ quả có thật và im lặng: người ký Cổng
Giá trị ngồi trước bảng ngưỡng mà mọi ô đều «CHƯA ĐO», hợp lệ theo mọi luật hiện
hành, và quyết định `release/iterate/kill` rơi về cảm giác trong phòng. Đề xuất:
**một ô cấu trúc trong contract** (`## Đường đo`) chỉ bật khi hồ sơ có cơ hội,
cửa bỏ có tên như mọi ô khác, cờ vàng trên thẻ Cổng 1 — **+0 nghi thức, +0
skill, +0 chân lưới**. Khuôn giải chép nguyên từ CT-S (Coverage), thứ đã chạy
thật từ 1.13.0.

## 1. Lỗ — bằng chứng trên nguồn

Chuỗi ba nhịp của một vòng có cơ hội:

| Nhịp | Ai giữ | Nguồn |
|---|---|---|
| Khai ngưỡng + timebox, trước khi làm | Người, tại Cổng Đáng | `opportunity-template.md` §«Ngưỡng chết / ngưỡng UAT» |
| Làm ra vật | Máy, S1→S5 | `feature-loop/SKILL.md` |
| **Sinh ra con số** | **— không ai —** | **không có** |
| Đặt số cạnh ngưỡng rồi ký | Người, tại Cổng Giá trị | `uat-session/SKILL.md` §4–§5 |

Quét xác nhận (21/08): trong toàn cây nguồn, chữ «tracking» **theo nghĩa nguồn
số đo thật** xuất hiện đúng **hai chỗ**, cả hai ở phía đọc —
`skills/uat-session/SKILL.md:79` và dòng song sinh trong
`uat-session-template.md:69`. (Mọi hit còn lại là `letter-spacing` trong
`scripts/design-scan.js` — nghĩa khác hẳn, không tính.) Trong S1 (nơi sinh contract + evals), trong
gap-probe (nơi bắt lỗ trước duyệt), trong thẻ Cổng 1 (nơi người nhìn): **không
một câu nào** buộc đường đo tồn tại.

Câu «Thước nào chưa đo được thì ghi CHƯA ĐO — không đo mà im lặng là gian»
trung thực với **từng thước**, nhưng không phân biệt được hai tình huống khác
hẳn nhau về trách nhiệm: *thước có đường đo mà số chưa về* (chờ) với *thước
chưa bao giờ có đường đo* (hỏng từ Cổng 1). Đây đúng hình dạng «bộ đo sống
ngoài repo» của teardown huashu 20/08 — nhưng hạt giống này KHÔNG lặp lại đề
xuất của teardown đó: chỗ đặt răng không phải ở Cổng Giá trị (đã trễ), mà ở
Cổng 1 (còn rẻ).

## 2. Kiểm bằng first principles từ North Star

| Nguyên tố | Với ngưỡng nghĩa là | Hiện trạng | Kết |
|---|---|---|---|
| ① Ý định chốt trước khi làm | Ngưỡng khai trước **và** cách lấy số cũng chốt trước — ngưỡng không đo được là ý định chưa chốt xong | Ngưỡng có; đường đo không ai đòi | **Thiếu** — lỗ này lấp |
| ② Bằng chứng không tự dối | Đường đo là VẬT, nên máy kiểm được nó tồn tại (AC + eval) — khác hẳn con số sau ship (người đọc) | Không có ô nào để máy nhìn | **Thiếu ô, không thiếu răng** |
| ③ Khoảnh khắc quyết thật | Cổng Giá trị phải có ≥2 lối ra SỐNG; bảng toàn «CHƯA ĐO» làm `kill` mất căn cứ → cổng suy biến còn một lối | Có thể xảy ra hợp lệ | **Trượt gián tiếp** |

Ba giả định dễ tự lừa đã kiểm:

- *Đây có phải trạm thu phí không?* — Phép thử: câu trả lời hợp lý duy nhất có
  phải «ừ» không? **Không** — ô này đỏ được thật (hồ sơ có ngưỡng mà không ai
  định xây đường đo là chuyện xảy ra thường xuyên, chính là ca sinh ra hạt
  giống này). Và nó **không thêm lần gọi người**: cờ vàng nằm trong thẻ Cổng 1
  người đang đọc sẵn, không phải một cổng mới.
- *Có phải mọi vòng đều gánh không?* — **Không.** Bật chỉ khi
  `_acceptance/<slug>/opportunity.md` tồn tại **và** có ngưỡng. Đường B/C/E ship
  thẳng (không hồ sơ cơ hội) **không thấy ô này tồn tại**. Cùng luật derive với
  thẻ Cổng Phạm vi và với kết-S5: suy từ có/không hồ sơ cơ hội, không lưu field.
- *Có phải kit đang mọc thêm việc không?* — Ô này **TRỪ** ở chỗ khác: nó là thứ
  làm câu «CHƯA ĐO» của Cổng Giá trị có nghĩa. Không có nó, section ngưỡng của
  khuôn cơ hội là chữ không bao giờ được kiểm — tức đang nuôi một ô hình thức.

## 3. Đề xuất — chép khuôn CT-S, bốn chân, TRỪ/CỘNG minh bạch

**Từ mới:** «**đường đo**» = thứ trong sản phẩm sinh ra con số cho một thước đã
khai (event, counter, truy vấn, bảng đếm — bất kể hình thức). Phân biệt với
**thước** (đo cái gì), **ngưỡng** (bao nhiêu là SỐNG), **số đo** (con số thật).
Vào `CONTEXT.md` **chỉ khi hồ sơ mở**, không thêm term cho một hạt giống.

1. **Ô cấu trúc trong contract.** Hồ sơ có `opportunity.md` với ngưỡng → contract
   PHẢI có section `## Đường đo`: mỗi thước một dòng — *thước · số đến từ đâu ·
   AC nào bảo đảm nó tồn tại* (hoặc «đã có sẵn, nguồn: …» khi đường đo đã tồn
   tại từ trước, không cần AC mới). Thiếu section → **cờ vàng, KHÔNG chặn**
   (đường đọc-cũ, workspace cũ đi đường này, không bắt migrate).
2. **Cửa bỏ có tên.** Bỏ = entry `descope` AUTO-DRAFT, decision bắt đầu đúng
   chuỗi `"bỏ đường-đo — <lý do 1 dòng>"`, impact `"Cổng Giá trị sẽ đọc bảng
   ngưỡng với ô CHƯA ĐO — quyết release/iterate/kill mất căn cứ số"`. Không có
   đường bỏ im lặng. (Y hệt `bỏ coverage-scan —`, `bỏ gap-probe —`,
   `bỏ design-pass —`.)
3. **Thẻ Cổng 1 hiện khối.** `gate-card.js` thêm khối «Đường đo» cạnh khối «Độ
   phủ AC», và cờ vàng khi hồ sơ có ngưỡng mà contract vắng section / có thước
   không dòng nào phủ. Người veto trên thẻ, máy không hỏi thêm câu nào.
4. **Một dòng cross-check cho gap-probe.** Bổ sung vào danh sách bắt buộc của
   critic (S1#7 ý (4)): *«ngưỡng nào ở `opportunity.md` không có đường đo nào
   trong contract»* — critic đã nhận contract + design-doc, chỉ thêm
   `opportunity.md` vào input khi file tồn tại.

**Dạng mạnh, khuyến khích chứ không ép:** khi đường đo là code phải viết mới,
nó nên thành **một AC bình thường** («Given …, When người hoàn tất onboarding,
Then bản ghi `onboarding_completed` tồn tại qua API») — lúc đó S4 đo nó bằng
eval máy như mọi AC khác, và đường đo được thừa hưởng toàn bộ răng sẵn có mà
kit không mọc thêm chân nào. Section `## Đường đo` chỉ trỏ tới AC đó.

**Không làm:** không thêm skill · không thêm nghi thức · không thêm chân vào
lưới trước-merge · không chặn Gate 1 · không đụng `uat-session` (Cổng Giá trị
giữ nguyên; nó chỉ được hưởng ô «CHƯA ĐO» có nghĩa hơn) · không đòi công cụ đo
cụ thể nào (kit là engine — analytics của đội là product context).

## 4. Chiều đỏ — thước gắn vào vật, ma trận viết trước

Vật được giao là **thẻ Cổng 1** (đầu ra thật), không phải câu chữ trong SKILL.
Ba ca, cùng một fixture workspace do **code sinh trong chính lần chạy**, đều
đi qua chính `gate-card.js` mà cổng dùng:

| Ca | Fixture | Mong đợi | Vai |
|---|---|---|---|
| R+ | có `opportunity.md` (có ngưỡng) · contract CÓ `## Đường đo` phủ đủ thước | **không** cờ | đối chứng dương — phải xanh trước khi tin ca đỏ |
| R− | cùng fixture, gỡ section `## Đường đo` | cờ vàng, **ghim đúng thông điệp** | chiều đỏ |
| R0 | **không** `opportunity.md` · contract không có section | **không** cờ | cô lập lớp — luật không được rò sang vòng không cơ hội |

Ca R0 là chân chống lỗi kinh điển của kit: một luật đúng nhưng bật khắp nơi sẽ
thành trạm thu phí cho mọi vòng B/C/E. Không có R0 thì R− không phân biệt được
«bắt đúng» với «luôn luôn kêu».

Đường đo cho **hành vi** (máy có thật sự viết section ở S1 không) **cố tình
KHÔNG mở** ở vòng này — theo đúng khuyến nghị của hạt giống 15/08 «ô nuốt luật»: làm chân mã
tiền định trước, chỉ mở hội đồng phiên sạch nếu ô cấu trúc vẫn để lọt lần thứ
ba. Lời hứa hành vi đắt đo, và ô có cờ đã đủ để người nhìn thấy.

## 5. Quan hệ với hạt giống «ô nuốt luật» (15/08)

> **Đính chính 21/08:** «hạt giống 15/08» là **«ô nuốt luật»** (`docs/plans/2026-08-15-hat-giong-o-nuot-luat.md`, PR #56, merge 21/08) — phạm vi **U1+U3** trong khuôn cơ hội, và nó **cấm đụng** con trỏ `red-team D2`. Nhóm «Cổng Đáng chưa có chiều đỏ» **chưa có hạt giống** — nó mới là một mục trong §7 của findings 15/08. Mọi câu dưới đây từng gọi nó là «hạt giống chiều-đỏ Cổng Đáng» là gọi sai.


Hai hạt giống chạm cùng một cổng nhưng **không chồng lấn**, và có thể mở độc lập:

- **15/08 «ô nuốt luật»** hỏi: *khuôn cơ hội có ô nào cho luật không* — U1 (cột
  `Kế thừa?` mang mặc định in sẵn + căn cứ) và U3 (`## Cổng 0` trình đúng MỘT
  quyết định). Nó **không** đụng `red-team D2`; câu «Cổng Đáng có chiều đỏ nào
  không» vẫn **chưa có hạt giống**.
- **Hạt giống này** hỏi: *ngưỡng đã khai ở đó có đường về số không* — mối nối
  từ Cổng Đáng sang vòng LÀM.

Nếu mở cùng chuyến: 15/08 đi trước (nó đổi hai ô trong khuôn cơ hội),
file này đi sau hoặc song song (nó chỉ đọc ngưỡng, không đổi khuôn cơ hội).
Không phụ thuộc cứng — mở riêng vẫn chạy được.

## 6. Vấp dự đoán, ghi trước để hồ sơ khỏi tìm lại

- **Bộ đọc `opportunity.md` phải dùng lại**, không viết bộ đọc thứ hai — kit đã
  dẫm lớp «tự viết parser thứ ba» (Đợt 1 W-spec). Đọc ngưỡng đi qua đúng bộ
  đọc mà thẻ/funnel Cổng Đáng đang dùng; ngưỡng viết văn xuôi (khuôn hiện tại
  là ba bullet chữ, không phải field máy-đọc) → luật chỉ được xét **có/không
  section**, KHÔNG cố parse từng thước, cho tới khi khuôn cơ hội có ô máy-đọc.
  Ép parse văn xuôi là mở đúng lớp lỗi «đo từ vựng thay vì quan hệ».
- **Card test và card renderer trôi khỏi nhau** — fixture phải round-trip: sinh
  bằng chính khuôn `contract-template.md`, đọc bằng chính `gate-card.js`.
- **Hồ sơ tự-host của kit không có `opportunity.md`** → mọi ca của kit đi nhánh
  R0; đừng kết luận «luật chạy» từ suite xanh của chính kit (đo ở phía consumer).
- **Đừng gỡ `## Đường đo` thành điều kiện chặn** kể cả khi thấy nó bị bỏ nhiều —
  bỏ có tên là dữ liệu, không phải thất bại; đọc entry `descope` trước khi siết.

## 7. Điều cố tình không làm

Không dựng nghi thức retro cho vòng học của ngưỡng (lỗ L3 của bản rà 21/08 —
ghi vào hàng đợi reflect, không mở việc) · không dựng đường đo tự động cho hai
thước North Star của chính kit (L4 — ghi nhận, chưa vấp thật) · không mang
roadmap/portfolio ngưỡng vào kit (product context của repo tiêu thụ) · không
đụng đoạn Gate 1 → S4 → Gate 2 (mù ngưỡng ở đó là tính năng, không phải lỗ).

## Nguồn

- North Star + ba nguyên tố: `CLAUDE.md`, `docs/plans/2026-08-12-nguoi-ve-bien-may-di-truoc.md`.
- Chỗ lỗ: `skills/acceptance/references/opportunity-template.md` (§Ngưỡng chết),
  `skills/uat-session/SKILL.md` §4–§5, `skills/acceptance/references/uat-session-template.md`.
- Khuôn giải chép từ: CT-S trong `feature-loop/skills/feature-loop/SKILL.md`
  (S1#3, S1#5) + `scripts/gate-card.js:232-233,342,361-362` (khối Coverage + cờ).
- Ổ cắm cross-check: `feature-loop/skills/feature-loop/SKILL.md` S1#7 ý (4).
- Luật đường-đọc-cũ + cờ vàng khi đổi schema artifact: `CLAUDE.md`.
- Hạt giống anh em: `docs/plans/2026-08-15-hat-giong-ban-do-dinh-chu-ky.md`
  (khuyến nghị «mã tiền định trước, lời hứa hành vi sau»).
- Teardown 20/08 (bộ đo sống ngoài repo) — sổ nhớ phiên, mục huashu-design.

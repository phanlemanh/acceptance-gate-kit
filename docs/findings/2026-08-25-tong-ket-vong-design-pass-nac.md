# Tổng kết vòng `design-pass-nac-khong-dong-bo` — từ ý định đến hôm nay (25/08)

*Trạng thái khi viết: nhánh `feat/design-pass-nac-khong-dong-bo`, HEAD `3a78c1ee`,
19 commit, **chưa push**, **chưa gộp**. Dừng chờ hạ tầng.*

---

## 1. Ý định gốc (đóng khung với owner 19/08)

Lớp thiết kế của vòng lặp trượt ở **nấc mặc định**, không ở công cụ. Nghi thức
`design-pass` đòi owner ngồi xem 30–60 phút mỗi vòng — đắt tới mức một hồ sơ
thật đã **bỏ luôn nghi thức** bằng một entry từ-chối có tên. *Một nghi thức bị
bỏ khi người ta thành thật là mặc định sai.* Đồng thời vòng lặp thiếu một bước
bàn hướng rẻ: với bề mặt mới, «đi hướng nào» đang do máy quyết bằng chữ trong
tài liệu thiết kế, trong khi chỉ owner biết «đúng» nghĩa là gì.

**Ý định:** thu gọn lớp thiết kế — bớt thứ phải nuôi — mà vẫn giữ nguyên hai
điều kit tồn tại vì nó: bằng chứng không tự dối, và người chỉ xuất hiện ở
khoảnh khắc quyết thật.

**Bảy thước đã khai trước khi làm.** Đích: ≤2 lần gọi người và cả hai không
đồng bộ · 1 bề mặt phải giữ đồng bộ với code · không cộng skill nào · thứ
nghiệm thu máy đo được không giảm · thời gian lịch của bước bàn hướng · làm lại
cấu trúc sau cổng = 0 · số lần bỏ bước bàn hướng và số lần bị veto.

---

## 2. Đã giao gì — phần này không tranh chấp

| Vật | Đổi gì |
|---|---|
| nghi thức thiết kế | mặc định thành **không đồng bộ**; ngồi-cùng thành một nấc phải có người gọi tên; thang bốn nấc phản ứng có id đóng; luật leo thang theo tín hiệu đếm được |
| bước bàn hướng | mục mới: mở bằng **vật thật đang có** trước khi bày hướng mới; ngả máy khuyên **ghim trên vật**, không nằm trong tin nhắn; thang bốn nấc vật dựng để không phụ thuộc công cụ nào |
| sổ phiên | ba khoá mới — nấc phản ứng · tham chiếu bộ phương án · vết bàn-hướng |
| thẻ duyệt | hiện nấc bằng nhãn tiếng người; ba nhánh cờ vàng cho hồ sơ đời trước / ghi hỏng / giá trị lạ |
| tài liệu | lấp hai lỗ ổ cắm thiết kế phát hiện 19/08 |

**+0 skill.** Chỉ hai file nghi thức được *sửa*, không file nào được *thêm*.
**+0 đụng lõi cưỡng chế** — `hooks/`, `lib/`, lưới trước-khi-gộp: không một dòng.

---

## 3. Bảy thước: cái nào có số hôm nay, cái nào chưa

| Thước | Đích | Hôm nay |
|---|---|---|
| số skill thiết kế phải nuôi | +0 | ✅ **đạt, đếm được trên cây** |
| thứ nghiệm thu máy đo được | không giảm | ✅ **đạt** — không đụng lưới/phép đo/workflow |
| số bề mặt giữ đồng bộ với code | 1 | ✅ đạt theo thiết kế (bộ phương án là nhánh cụt) |
| số lần gọi người + hình thức | ≤2, cả hai async | ⛔ **chưa có số** |
| thời gian lịch của bước bàn hướng | — | ⛔ **chưa có số** |
| làm lại cấu trúc sau cổng | 0 | ⛔ **chưa có số** |
| số lần bỏ bước bàn hướng, số lần bị veto | veto ≥1 là ngưỡng chết | ⛔ **chưa có số** |

**Đây là kết luận thẳng nhất của vòng:** cơ chế đã giao và kiểm được, nhưng
**bốn trong bảy thước — gồm cả thước cốt lõi «số lần gọi người» — chưa có một
con số nào.** Chúng chỉ sinh ra ở một ván thử trên bề mặt UI thật tại kho tiêu
thụ, và ván đó **chưa chạy** (hạn 30/09 → nếu không chạy thì xếp kho).

Điều đó đã được khai trước khi làm, không phải phát hiện muộn: sổ quyết định
`S1` có entry từ-chối đúng nội dung này. Nhưng khai trước không làm nó bớt là
sự thật: **hôm nay ta có một nghi thức tin được, chưa có bằng chứng nó rẻ hơn.**

---

## 4. Chi phí thật

| | |
|---|---|
| vòng nghiệm thu máy | **5** (trần thiết kế là 3) |
| lượt chạy làn máy hôm nay | 4 — hai lượt cuối đều BLOCKED vì hạ tầng |
| token làn máy hôm nay | **~9,0 triệu**, 109 agent, **113 phút** |
| lần gọi người hôm nay | **5** |
| commit trên nhánh | 19 |

Đọc bằng thước của kim chỉ nam — *thời gian từ làm-xong đến quyết-được, và số
lần gọi người trên mỗi kết quả ship* — thì con số khó chịu là: **giờ-kit bỏ ra
gần hai tiếng làn máy để nghiệm thu một thay đổi chỉ chạm lời của hai nghi thức
và một bộ dựng thẻ**, và kết quả vẫn chưa gộp được.

---

## 5. Chuyện gì thực sự xảy ra: vòng lặp không trượt ở TÍNH NĂNG

Lỗi trong hợp đồng qua các vòng, tách theo nơi nó nằm:

| vòng | ở SẢN PHẨM | ở BỘ ĐO | hội đồng chất lượng bộ đo |
|---|---|---|---|
| 3 | 5 | 3 | treo |
| 4 | **0** | 3 | treo |
| 5 | **0** | 1 | **đạt** (lần đầu) |

**Sản phẩm hội tụ sau một vòng sửa.** Bốn vòng còn lại là ta đánh nhau với
*phép đo của phép đo*. Và nó luôn thua theo cùng một cách:

> Thước do máy viết, và mutant chứng nó cũng do máy viết — **cùng một trí tưởng
> tượng**. Hình dạng nằm ngoài trí tưởng tượng đó thì cả hai đều không thấy.
> Làn rà soát, vốn được tự do phá vật thật theo cách nó chọn, lần nào cũng tìm
> ra đúng hình dạng ấy.

| vòng | thước máy dựng | hình dạng hội đồng tìm ra NGOÀI nó |
|---|---|---|
| 2 | danh sách cấm 2 cụm cho «bỏ im lặng» | câu thứ ba |
| 3 | vá một danh sách cho phép | danh sách cho phép anh em, cùng file |
| 3 | lưới thoát chuỗi, 3 fixture tự liệt | chỗ đẩy thứ ba |
| 4 | quét tĩnh «đã quét thành số» | template literal · thoát chuỗi nửa vời |
| 5 | quét «kết luận từ mã thoát» | nhánh anh em «kết luận từ chuỗi vắng» |

**Hệ quả rút ra:** số lỗi BỘ ĐO có thể không bao giờ về 0 — không gian của
người rà soát là mở. Thứ đáng đọc ở cổng là **lỗi ở SẢN PHẨM**.

---

## 6. Ba lỗi của máy trong phiên này — cùng một gốc

1. **Ký mà quên dựng lại bản đồ sản phẩm** → cổng tự-host đỏ. Bẫy này có tên
   trong bản bàn giao đọc đầu phiên VÀ trong chú thích `_acceptance/config.yaml`
   (ADR 0007). Đọc rồi vẫn dẫm.
2. **Vá sai TẦNG đẻ ra hồi quy.** Thoát chuỗi cho cờ được đặt ở *chỗ đẩy* —
   đúng nếp của file — nhưng mảng cờ phục vụ **hai người đọc**: trang HTML và
   đường dữ liệu máy-đọc. Thực thể `&lt;` lọt vào trường máy đọc.
   **Nếp mới: trước khi chọn tầng vá, hỏi vật này có mấy người đọc.**
3. **Quét lớp còn hụt.** Quét «kết luận từ mã thoát» ra 1/8 rồi dừng, bỏ sót
   nhánh anh em «kết luận từ chuỗi vắng». Vá bằng một chốt chung nên phủ cả
   mutant thêm sau.

Lớp chung của cả ba: **tuyên đã đóng một lớp trong khi mới đóng một điểm.**

---

## 7. Lỗ luật của kit mà vòng này soi ra

- **Không có làn cho «ship kèm giới hạn đã khai».** Luật dừng-vá nêu đó là một
  trong ba đường người được chọn, nhưng lưới trước-khi-gộp đòi `verdict=PASS`
  cứng. Owner đã ký 25/08 (`bb5fd1a2`) mà vẫn không gộp được.
- **Vòng máy ghi đè bằng chứng thì XOÁ luôn chữ ký người.** Máy không được viết
  *lẫn xoá* trường quyết định của người. Hôm nay tránh được bằng tay; chưa có
  lưới nào canh.
- **Khoá vết bàn-hướng viết mà không đầu nào đọc** — lời hứa «không có đường bỏ
  im lặng» hiện chưa có răng.
- **Khuôn khởi tạo bày một dạng khai cấu hình mà bộ đọc của kit không hiểu** —
  ai làm đúng theo mẫu thì tuỳ chọn im lặng vô hiệu.

---

## 8. Còn lại gì để đóng vòng

1. Một lượt làn máy trót lọt (chờ bộ phân loại an toàn hồi) → verdict.
2. Owner tự đọc mục hội đồng còn treo, tự khai `human_override`, nâng verdict.
3. Ký lại trên bằng chứng cuối — chữ ký 25/08 thuộc về bằng chứng vòng 4.
4. Bốn ô/hạt giống ở mục 7 chưa ai cầm.
5. **Ván thử ở kho tiêu thụ** — thứ duy nhất sinh ra bốn con số còn thiếu.

---

## 9. Câu để nhớ

Vòng này giao được **một nghi thức thôi bắt người ngồi cạnh máy**. Nó chưa
chứng minh được điều nó hứa, vì thứ chứng minh nằm ở một ván thử chưa chạy. Và
nó tốn hai tiếng làn máy chủ yếu để cãi nhau với chính phép đo của mình —
*chi phí đó là có thật và nên tính vào giá của những ô cùng hình dạng sau này.*

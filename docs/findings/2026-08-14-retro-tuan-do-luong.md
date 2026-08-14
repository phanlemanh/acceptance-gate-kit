# Retro tuần đo lường (08–14/08) — ba hồ sơ, hai lần dừng-vá, một con số bịa

Phiên: 14/08, ngay sau khi PR #47 merge. Retro này soi **quy trình**, không soi
sản phẩm — tổng kết sản phẩm nằm ở trang tổng kết tuần (artifact) và các trang
bằng chứng của từng hồ sơ. Mọi con số ở đây được đếm lại trong chính phiên soạn,
kèm nguồn; đó không phải trang trí mà là hệ quả trực tiếp của mục 4 dưới đây.

Đối tượng: `luu-kho-codex-va-nghi-le-design` (5 vòng, ký 13/08) ·
`cat-hinh-thuc` (8 vòng, 3 vòng chấm đối kháng đều REJECT, 37 lượt phá, ký
14/08) · `bai-hoc-do-luong-vao-engine` (1 vòng, ký + merge 14/08).

---

## 1 · Đối chiếu: quyết «về đích nhanh» vs xảy ra thật

Sáng 14/08 owner đổi thước: *«sửa kit đang là chi phí lớn nhất, tôi muốn nhanh
chóng hoàn tất»* — chọn Ⓐ rút gọn, chạy `E3b` trước, **bỏ vòng chấm 4** thay
bằng tái lập các lượt phá đã ghi lệnh. Đối chiếu:

| Quyết định tốc độ | Xảy ra thật | Đánh giá |
|---|---|---|
| Bỏ vòng chấm 4, thay bằng tái lập lượt phá vòng 3 | 12 lượt tái lập, mỗi lượt ĐỎ đúng chỗ đã sửa; không lỗ mới nào lọt ra sau ký | **Đúng cược.** Tái-lập-cái-đã-ghi rẻ hơn một bậc so với ba phiên chấm mới, và đủ cho vòng VỀ ĐÍCH của một hồ sơ đã bị chấm 3 lần |
| Chạy `E3b` TRƯỚC vì nó là ẩn số không biên duy nhất | `E3b` PASS ngay → không vòng lặp mới nào mở | **Đúng cược.** Xếp việc theo độ-không-chắc, không theo thứ tự tự nhiên — đáng thành nếp |
| Hồ sơ promote đi 1 vòng thay vì dispatch 3 lăng kính | 1 gap-probe context-sạch (1 subagent) tìm 3 P0 · 6 P1 · 4 P2; sau sửa, 10 lượt phá vật thật đều đỏ đúng thông điệp | **Đúng cược, kèm một vết:** probe chạy SAI THỨ TỰ (mục 3) |

Học phí ba hồ sơ xếp cạnh nhau tự kể chuyện: 5 vòng → 8 vòng → **1 vòng**.
Hồ sơ thứ ba rẻ không phải vì nó nhỏ hơn (nó chạm lưới thường trực nhiều hơn
1b) mà vì nó **tiêu thụ bài học của hai hồ sơ trước ngay trong lúc thi công**:
không răng-hồ-sơ, pin có mẫu số, chiều đỏ qua chân thật, khai lại công khai
trước khi viết code.

## 2 · Cái đã làm việc — giữ, có số làm chứng

- **Luật dừng-vá bật hai lần, cả hai lần đều đúng.** Lần nào cũng chặn được một
  vòng vá thứ ba vô ích và đẩy quyết định lên owner với các lối ra sống. Đường
  owner chọn (thu phạm vi, rồi Ⓐ rút gọn) đều rẻ hơn đường «vá tiếp» mà máy
  đang lao vào. Đây là luật đắt nhất tuần này về cảm giác, rẻ nhất về tổng chi.
- **Sửa-công-khai-sau-cổng giữ được lòng tin qua bốn lần dùng.** Bảng «Sửa sau
  Cổng 1», «Sửa sau Cổng 2», entry `descope` có grounds, số sai giữ gạch ngang.
  Không lần nào owner phải phát hiện một thay đổi lặng; cả bốn lần đều được phê
  mà không mở lại tranh luận.
- **`decisions.jsonl` có grounds chấm dứt bàn-lại.** Quyết (b) ghi ba lý do tại
  chỗ; khi ADR 0011 cần viết, lý do đã nằm sẵn, không ai phải nhớ hộ.
- **Phá vật thật + thông điệp riêng từng chiều** bắt được cả lỗi của chính
  người dựng phép đo: một lượt đọc kết quả bị nhiễm state từ lượt phá trước —
  và chính vì mỗi chiều có thông điệp riêng nên độ nhiễm lộ ra ngay (hai thông
  điệp xuất hiện thay vì một), dọn fixture chạy lại là sạch.

## 3 · Cái đắt — gốc rễ, không phải triệu chứng

**Ba vòng chấm đều REJECT trên `cat-hinh-thuc` không phải vì chấm gắt, mà vì
chẩn đoán đúng đến muộn hai vòng.** Tín hiệu «cùng lớp lỗi đổi da» có từ vòng 1
(H1: eval hứa phép đo mạnh, script cài phép yếu hơn), nhưng hai vòng liền nó
được đọc là *danh sách chỗ vá* thay vì *một mệnh đề không chứng được*. Chỉ đến
vòng 3 mới gọi đúng tên: «không lời hứa phút nào, ở mọi cách diễn đạt» là
**phủ định phổ quát trên văn tự nhiên** — grep không chứng được, phải lật sang
liệt cái ĐƯỢC PHÉP. Sau khi gọi đúng tên, đường về đích mất chưa đầy một ngày.
Câu retro thật sự: *khi lượt vá thứ hai gặp lại lớp cũ, câu hỏi bắt buộc không
phải «vá ở đâu» mà «mệnh đề đang hứa có thuộc loại chứng được không»* — luật
dừng-vá đã ép dừng đúng lúc, nhưng khuôn ba-đường trình owner chưa có câu hỏi
này; nó nên là dòng đầu của bản trình.

**Người-viết-tự-chấm thất bại lặp lại, đúng như luật đã đoán.** Ba bằng chứng
tuần này, cả ba do người khác (hoặc phiên khác) bắt: E5 giữ-gân là hằng đúng
nhưng được tôi khai là «chặt hơn»; E9b là định lý về grep nhưng được tôi khai
là «mạnh hơn base>0»; và **«41 lượt phá» là số bịa** — số thật 8+8+21=37, con
số đi qua Cổng 1, gap-probe, ba lăng kính lẫn Cổng 2 mà không ai chạm, chỉ lộ
khi phiên tổng kết đếm lại mọi số từ nguồn. Lớp chung: **con số tự khai trong
văn xuôi không có răng**, và mọi tầng chấm hiện tại đều chấm *lập luận*, không
chấm *số*.

**Thứ tự sai làm chữ ký đặt lên số chưa đo.** Gap-probe của hồ sơ promote chạy
SAU khi owner gạch Cổng 1 — ba P0 nó tìm ra đều là thứ đáng lẽ chặn chữ ký ấy.
Không hại thực tế lần này (owner phê lại toàn bộ ở Cổng 2), nhưng đó là may,
không phải thiết kế. Nếp đúng đã ghi vào `gap-probe.md`: **probe → Cổng 1 →
thi công** — hiện mới là văn, chưa có gì cưỡng chế.

**Chi phí lặp không tên: dặn môi trường cho từng reviewer.** Root làm
`chmod 000` vô hiệu, pipe nuốt mã thoát, worktree chung `.git` — ba bẫy này
được chép tay vào mọi mandate suốt tuần. Chúng đã nằm trong hạt giống
ba-lăng-kính; chừng nào khuôn ấy chưa thành reference, mỗi phiên chấm mới lại
trả món thuế chép tay này.

## 4 · Nếp đã neo vào engine vs nếp mới chỉ là văn

| Nếp | Trạng thái | Ở đâu |
|---|---|---|
| Lật allow-list cho phủ định phổ quát | **Neo — có răng** | mục 4 `MEASURE-BIRTH-SECTIONS`, `P177` ghim + buộc số |
| Bảng lớp lỗi phải khớp sổ nguồn hai chiều | **Neo — có răng** | bánh cóc `LOP-BANG` trong `P177`, miễn trừ có chiều đỏ |
| Lint lớp-phút + miễn trừ (tệp, từ khoá) | **Neo — có răng** | thân `P30`, sống sau merge |
| Chứng-nhân-riêng trong nhóm-lệnh | **Nửa neo** | recorder của 1a — nhưng recorder là răng-hồ-sơ, đã chết theo merge; nếp sống tiếp chỉ qua tay người viết evals |
| probe → Cổng 1 → thi công | **Chỉ là văn** | một đoạn trong `gap-probe.md` của một hồ sơ đã ký |
| Số tự khai phải có chứng nhân máy hoặc nhãn «số người-đối-chiếu + lệnh tái lập» | **Chỉ là văn** | mục Sửa-sau-Cổng-2 + retro này |
| Tái lập lượt phá vòng trước trước khi phá mới | **Chỉ là văn** | hạt giống ba-lăng-kính |

Hàng «chỉ là văn» không tự động là nợ phải vá — theo ADR 0011, cái đáng sống
dài hạn mới cần vào lưới. Nhưng ít nhất hàng thứ hai (số tự khai) vừa chứng
minh nó cắn được người ngay trong tuần đặt tên nó; nếu tuần tới nó cắn thêm
lần nữa thì đó là tín hiệu đủ để mở một hồ sơ TRỪ nhỏ.

## 5 · Điều duy nhất retro này đề xuất thêm vào tuần tới

Khuyến nghị lớn đã nằm ở báo cáo tiến độ: **mở Đợt 2, đừng mở gì khác.** Retro
chỉ thêm một nghi thức không tốn hồ sơ nào: **phiên nào viết một con số tự khai
vào artifact bền (contract, ADR, evidence) thì phiên ĐÓ phải kèm lệnh tái lập
ngay cạnh số** — như đã làm với 37, với 146, với hai known-limit mới. Chi phí
một dòng; tuần này thiếu đúng một dòng ấy mà một số bịa sống qua bốn tầng chấm.

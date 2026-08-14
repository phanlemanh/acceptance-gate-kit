# Hạt giống 1c — bốn lượt đổi HÀNH VI ở cổng người, gate bằng hội đồng

*Trạng thái: **CỔNG 0 ĐÃ GẬT — 14/08, owner trả lời «hội đồng: bắt buộc», giữ
đủ bốn hạng mục.** Hội đồng chấm loại B là điều kiện BẮT BUỘC trước Cổng 2,
không phải khuyến nghị. Hồ sơ mở tại `_acceptance/doi-hanh-vi-cong-nguoi/`,
chờ Cổng 1. Sinh ngày 14/08 khi owner chọn đường ② (thu phạm vi) sau rà soát
đối kháng vòng 2 của hồ sơ `cat-hinh-thuc`.*

## Vì sao có tệp này

Đề bài đợt 1 (12/08) gộp **hai loại việc rất khác nhau** vào một hồ sơ:

| | Loại việc | Lời hứa có dạng gì | Đo bằng gì |
|---|---|---|---|
| A | **Thôi đo phút người** | *một chuỗi/một trường KHÔNG còn ở đâu nữa* | grep có đối chứng dương, parser thật, render rồi soi đầu ra — **đo được** |
| B | **Đổi hành vi ở cổng người** | *một agent đọc văn chỉ dẫn rồi HÀNH XỬ thế nào* | hội đồng context sạch — **grep không đo được** |

Loại A ở lại hồ sơ `cat-hinh-thuc`. Loại B về đây.

Ba vòng rà soát đối kháng nói cùng một điều, và lần thứ ba thì nói bằng số:
rà soát vòng 2 **phá thật 8 lượt trên bộ răng và cả 8 vẫn XANH**; **bảy trong
tám** thuộc loại B. Hai chân của loại B là **hằng đúng** — tập so sánh rỗng, và
chèn-rồi-grep-lại-chính-chuỗi-vừa-chèn — và cả hai được hợp đồng khai là *mạnh
hơn đối chứng dương*. Đó không phải hai lỗi; đó là một **khuôn giải sai**, đúng
thứ `STOP-PATCHING-CLAUSE` sinh ra để bắt.

**Bốn eval judgment (`E7` `E8` `E9` + neo âm của nó) sinh ra để chấm đúng loại
B — và chưa lượt nào chạy.** Nuôi thêm một bộ thước grep cho chúng là trả tiền
hai lần cho một việc, trong khi thước đúng đang nằm không.

## Bốn hạng mục (nguyên văn ý định, KHÔNG đổi — owner đã gạch 12/08)

1. **Gỡ tư cách luật-MỖI-TIN của khối 👉 VIỆC CỦA ANH.** Khối chỉ sống ở tin
   mời cổng và trên thẻ cổng; tin chỉ-báo nói thẳng máy đang làm gì tiếp.
   *Lý do:* bắt mọi tin đeo khối biến nó thành nhiễu nền — người thôi phân biệt
   được lúc nào thật sự tới lượt mình.
2. **Xác-nhận T1 → tuyên-kèm-căn-cứ.** In bảng match `<path> → <glob>` làm căn
   cứ, tuyên T1, đi tiếp; không dừng hỏi. *Lý do:* máy vừa đối chiếu với một
   danh sách glob do chính repo khai, và CI quyết lại đúng câu hỏi ấy trên diff
   thật — một lượt xác nhận ở đây tiêu một lần chặn người để không đổi gì.
3. **Quét độ phủ thôi phỏng vấn.** `morphological-scan` nhánh (b)/(c) TỰ DỰNG
   Product Context, mỗi dòng gắn `[SUY-TỪ-REPO: <đường dẫn>]` hoặc `[GIẢ ĐỊNH]`,
   gom `[GIẢ ĐỊNH]`/`[NGÀNH]` vào mục Coverage để người gạch **một lượt tại
   Cổng 1**. *Lý do:* cùng số quyết định, một lần ngồi, và Cổng 1 vốn đã cần
   người nên không thêm lượt gọi nào.
4. **Khởi tạo một-lần-gạch.** `/acceptance-init` dò repo trước, trình TRỌN bản
   nháp `config.yaml` trong MỘT lượt, ô không suy được đánh `# cần anh`.

## Điều kiện vào Cổng 1 — đây là phần khác hẳn hồ sơ trước

- **Bộ đo chính là HỘI ĐỒNG, không phải grep.** Mỗi hạng mục một eval
  `executor: judgment`, context sạch, **bảng đáp án viết TRƯỚC**, ≥3 ca trong đó
  ≥1 ca **giữ-gân** (chứng minh cắt không lan) và ≥1 ca **chống-a-dua** (hỏi
  ngược để xem agent có chiều theo câu hỏi dẫn không).
- **Đề bài của ca KHÔNG được mớm đáp án.** Rà soát vòng 1 đã gọi tên: `E7 ca 3`
  và `E8 ca 3` của bản cũ viết dạng *«agent phải trả lời KHÔNG»* / *«phải nêu
  thang nguồn»* — đọc câu hỏi là biết đáp án. Viết lại thành ca mở.
- **Lớp máy CHỈ được nhận vai nó làm được**, và phải khai đúng vai đó trong
  hợp đồng: chứng **MỰC ĐÃ IN** (chuỗi cũ vắng + đối chứng dương thật; số bản
  chép nguyên văn khớp manifest). Cấm mọi câu kiểu «đo QUAN HỆ», «so TẬP CÂU»,
  «đối chứng dương tự sinh» cho một lời hứa hành vi — ba câu ấy đều đã được
  chứng minh là hằng đúng hoặc miễn trừ mất câu chịu lực.
- **Ba lớp lỗi cấm tái phạm**, kiểm bằng cách phá thử MỘT lần cho mỗi chân mới:
  · tập so sánh rút từ base rồi **tự loại chính câu chịu lực** (lọc
    `grep -v '<từ khoá của thứ đang sửa>'`);
  · «đối chứng dương» là thao tác **hằng đúng** (chèn rồi tìm lại chính nó);
  · bản sao đột biến **không chạy được** nên đỏ vì crash chứ không vì vật hỏng.
- **Neo âm phải có đối chứng dương THẬT trên base.** Needle `base=0` là needle
  gõ theo trí nhớ — thay bằng cụm có thật, đừng bỏ.

## Ràng buộc kế thừa

- Merge **sau** `cat-hinh-thuc`: hạng mục 1 chạm `GATE-ONESHOT-CLAUSE` và
  `GATE-INVITE-CLAUSE`, hạng mục 4 chạm `commands/acceptance-init.md` — cùng
  vùng 1a vừa sửa phần phút.
- Hạng mục 1 làm chết một assert của `P193` và ba mục của `P189`. Khai từng
  dòng vào `tests/plugins/asserts-da-go.txt`, **và nói thẳng rằng bánh cóc
  `P161` không phủ được assert sinh sau mốc ghim `044968e` (06/08)** — hợp đồng
  1a từng tuyên ngược và đó là finding H8.
- Số ca bốn suite phải khai ĐẲNG THỨC trước khi cắt, không khai sàn.

## Việc của owner tại Cổng 0/1

Gật (hoặc cắt) bốn hạng mục trên, và quyết một điều mà chỉ owner quyết được:
**hội đồng chấm loại B là điều kiện bắt buộc trước Cổng 2, hay chỉ là khuyến
nghị?** Bắt buộc thì hồ sơ đắt hơn nhưng lời hứa hành vi có người bảo chứng;
khuyến nghị thì nó rẻ hơn và ship dựa trên mắt owner đọc thân chỉ dẫn một lần.
Không có đường thứ ba nào trung thực — grep đã thử ba vòng.
